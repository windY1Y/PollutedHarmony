# python3 apply_taint.py
from pathlib import Path
import re
import os

ROOT = Path.cwd()
BASE = ROOT / "test" / "xts" / "acts"

PPTAINT = r'''/*
 * [pptrace] Prototype pollution taint helper for ACTS.
 * JS version, used to avoid strict ArkTS prototype/Symbol restrictions.
 */

// Log only own primitive fields of our records. Never serialize payload objects,
// call toJSON, enumerate a Proxy payload, or coerce an injected function.
const ppOwnKeys = Object.keys;
const ppOwnDesc = Object.getOwnPropertyDescriptor;
const ppNativeDefine = Object.defineProperty;
const ppHasOwn = Function.call.bind(Object.prototype.hasOwnProperty);
const ppQuote = JSON.stringify;
let ppSession = "single";
function ppDefine(object, key, descriptor) {
  const clean = Object.create(null);
  for (const name of ppOwnKeys(descriptor)) {
    const d = ppOwnDesc(descriptor, name);
    if (d && ppHasOwn(d, "value")) clean[name] = d.value;
  }
  return ppNativeDefine(object, key, clean);
}
function ppSafeStringify(record) {
  let text = "{";
  let first = true;
  for (const key of ppOwnKeys(record)) {
    const d = ppOwnDesc(record, key);
    if (!d || !ppHasOwn(d, "value")) continue;
    const value = d.value;
    const type = typeof value;
    const encoded = value === null ? "null" :
      (type === "string" || type === "number" || type === "boolean") ? ppQuote(value) :
      ppQuote("<" + type + ">");
    text += (first ? "" : ",") + ppQuote(key) + ":" + encoded;
    first = false;
  }
  return text + "}";
}
function ppPath(parts) { return "[" + parts.map(part => ppQuote(part)).join(",") + "]"; }
function ppLog(event, data) {
  // data is an internal plain record; opaque values remain opaque.
  try { console.info("[pp] " + event + " " + ppSafeStringify(data)); }
  catch (e) { console.info("[pp] log-error"); }
}

function ppStack(enabled) {
  if (!enabled) {
    return "";
  }
  try {
    return String((new Error()).stack);
  } catch (e) {
    return "<no stack>";
  }
}

function readParam(params, name) {
  if (params === undefined || params === null) {
    return "";
  }

  let value = params[name];

  if (value === undefined || value === null) {
    value = params["-s " + name];
  }

  if ((value === undefined || value === null) && typeof params.get === "function") {
    value = params.get(name);
  }

  if ((value === undefined || value === null) && typeof params.get === "function") {
    value = params.get("-s " + name);
  }

  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? "" : String(value[0]);
  }

  return String(value);
}


function normalizeKeyName(raw) {
  if (raw.length >= 2 && raw[0] === "[" && raw[raw.length - 1] === "]") {
    return raw.substring(1, raw.length - 1);
  }
  return raw;
}

function getWellKnownSymbol(name) {
  const symbolObj = globalThis["Symbol"];
  if (symbolObj === undefined || symbolObj === null) {
    return "";
  }

  const value = symbolObj[name];
  if (value === undefined || value === null) {
    return "";
  }

  return value;
}

function toPropertyKey(raw) {
  let key = normalizeKeyName(raw);
  const lower = key.toLowerCase();

  if (lower === "symbol.toprimitive") {
    return getWellKnownSymbol("toPrimitive");
  }
  if (lower === "symbol.iterator") {
    return getWellKnownSymbol("iterator");
  }
  if (lower === "symbol.tostringtag") {
    return getWellKnownSymbol("toStringTag");
  }
  if (lower === "symbol.hasinstance") {
    return getWellKnownSymbol("hasInstance");
  }
  if (lower === "symbol.isconcatspreadable") {
    return getWellKnownSymbol("isConcatSpreadable");
  }
  if (lower === "symbol.match") {
    return getWellKnownSymbol("match");
  }
  if (lower === "symbol.replace") {
    return getWellKnownSymbol("replace");
  }
  if (lower === "symbol.search") {
    return getWellKnownSymbol("search");
  }
  if (lower === "symbol.species") {
    return getWellKnownSymbol("species");
  }
  if (lower === "symbol.split") {
    return getWellKnownSymbol("split");
  }
  if (lower === "symbol.unscopables") {
    return getWellKnownSymbol("unscopables");
  }

  if (key === "[Special Value] : Undefined") {
    return "undefined";
  }

  return key;
}

function keyToLogString(key) {
  try {
    return String(key);
  } catch (e) {
    return "<key>";
  }
}

function ppPad8(value) {
  let result = value;
  while (result.length < 8) {
    result = "0" + result;
  }
  return result;
}

let ppTaintCounter = 0;
const PP_TAINT_PREFIX = "__GHUNTER_PP_TAINT__";
const PP_NUMERIC_TAINT_BASE = 0xabc000;
const PP_NUMERIC_TAINT_SPAN = 0x100;

function nextId(key, reason) {
  ppTaintCounter += 1;
  return PP_TAINT_PREFIX + ":" + keyToLogString(key) + ":" + reason + ":" + String(ppTaintCounter);
}

function makeNumericStringTaint(key, reason, event) {
  ppTaintCounter += 1;
  const n = PP_NUMERIC_TAINT_BASE + (ppTaintCounter % PP_NUMERIC_TAINT_SPAN);
  const value = "0x" + n.toString(16);
  const marker = PP_TAINT_PREFIX + ":" + keyToLogString(key) + ":" + reason + ":" + String(ppTaintCounter);

  ppLog(event, {
    key: keyToLogString(key),
    reason,
    value,
    marker,
  });

  return value;
}

function makeStringTaint(key, reason) {
  return makeNumericStringTaint(key, reason, "taint-string");
}

function makeNumericTaint(key, reason) {
  ppTaintCounter += 1;
  const n = PP_NUMERIC_TAINT_BASE + (ppTaintCounter % PP_NUMERIC_TAINT_SPAN);
  const marker = PP_TAINT_PREFIX + ":" + keyToLogString(key) + ":" + reason + ":" + String(ppTaintCounter);

  ppLog("taint-numeric", {
    key: keyToLogString(key),
    reason,
    value: "0x" + n.toString(16),
    marker,
  });

  return n;
}

function makeBooleanTaint(key, reason) {
  ppTaintCounter += 1;
  const id = PP_TAINT_PREFIX + ":" + keyToLogString(key) + ":" + reason + ":" + String(ppTaintCounter);
  const keyString = keyToLogString(key);

  const boxed = new Boolean(true);
  try {
    ppDefine(boxed, "__pp_taint_id__", { value: id, configurable: true, enumerable: false, writable: true });
    ppDefine(boxed, "__pp_taint_key__", { value: keyString, configurable: true, enumerable: false, writable: true });
    ppDefine(boxed, "__pp_taint_mode__", { value: "boolean", configurable: true, enumerable: false, writable: true });
  } catch (e) {
    boxed["__pp_taint_id__"] = id;
    boxed["__pp_taint_key__"] = keyString;
    boxed["__pp_taint_mode__"] = "boolean";
  }

  ppLog("taint-boolean", {
    key: keyString,
    reason,
    value: true,
    marker: id,
  });

  return boxed;
}

function makeObjectTaint(key, reason) {
  const id = nextId(key, "object:" + reason);
  const keyString = keyToLogString(key);
  const value = {};

  try {
    ppDefine(value, "__pp_taint_id__", { value: id, configurable: true, enumerable: false, writable: true });
    ppDefine(value, "__pp_taint_key__", { value: keyString, configurable: true, enumerable: false, writable: true });
    ppDefine(value, "__pp_taint_mode__", { value: "object", configurable: true, enumerable: false, writable: true });
  } catch (e) {
    value["__pp_taint_id__"] = id;
    value["__pp_taint_key__"] = keyString;
    value["__pp_taint_mode__"] = "object";
  }

  ppLog("taint-object", {
    key: keyString,
    reason,
    marker: id,
  });

  return value;
}

function makeArrayTaint(key, reason) {
  const id = nextId(key, "array:" + reason);
  const keyString = keyToLogString(key);
  const value = [makeObjectTaint(key, reason + ":0")];

  try {
    ppDefine(value, "__pp_taint_id__", { value: id, configurable: true, enumerable: false, writable: true });
    ppDefine(value, "__pp_taint_key__", { value: keyString, configurable: true, enumerable: false, writable: true });
    ppDefine(value, "__pp_taint_mode__", { value: "array", configurable: true, enumerable: false, writable: true });
  } catch (e) {
    value["__pp_taint_id__"] = id;
    value["__pp_taint_key__"] = keyString;
    value["__pp_taint_mode__"] = "array";
  }

  ppLog("taint-array", {
    key: keyString,
    reason,
    length: value.length,
    marker: id,
  });

  return value;
}

function makePrimitiveTaint(key, mode, reason) {
  if (mode === "numeric") {
    return makeNumericTaint(key, reason);
  }
  if (mode === "boolean") {
    return makeBooleanTaint(key, reason);
  }
  return makeStringTaint(key, reason);
}

function makeProxyTaint(key, mode, stackEnabled, path = []) {
  const id = nextId(key, path.length > 0 ? "proxy." + path.join(".") : "proxy");
  const keyString = keyToLogString(key);
  const pathString = path.join(".");

  const target = function (...args) {
    ppLog("called-body", {
      key: keyString,
      path: pathString,
      id,
      args,
      stack: ppStack(stackEnabled),
    });
    return makeProxyTaint(key, mode, stackEnabled, path.concat(["()"]));
  };

  target["__pp_taint_id__"] = id;
  target["__pp_taint_key__"] = keyString;
  target["__pp_taint_path__"] = pathString;
  target["__pp_taint_mode__"] = mode;

  const handler = {
    apply(targetFn, thisArg, args) {
      ppLog("apply", {
        key: keyString,
        path: pathString,
        id,
        args,
        stack: ppStack(stackEnabled),
      });
      return makeProxyTaint(key, mode, stackEnabled, path.concat(["apply"]));
    },

    get(targetFn, prop, receiver) {
      const propStr = keyToLogString(prop);

      if (propStr === "__pp_taint_id__") {
        return id;
      }
      if (propStr === "__pp_taint_key__") {
        return keyString;
      }
      if (propStr === "__pp_taint_path__") {
        return pathString;
      }
      if (propStr === "__pp_taint_mode__") {
        return mode;
      }

      if (prop === "then") {
        ppLog("subget-then-passive", {
          key: keyString,
          path: pathString,
          id,
          stack: ppStack(stackEnabled),
        });
        return undefined;
      }

      ppLog("subget", {
        key: keyString,
        path: path.concat([propStr]).join("."),
        id,
        prop: propStr,
        stack: ppStack(stackEnabled),
      });

      const toPrimitiveSym = getWellKnownSymbol("toPrimitive");
      if (toPrimitiveSym !== "" && prop === toPrimitiveSym) {
        return function (hint) {
          const value = hint === "number"
            ? makeStringTaint(key, "toPrimitive:number:" + pathString)
            : makeStringTaint(key, "toPrimitive:" + hint + ":" + pathString);

          ppLog("toPrimitive", {
            key: keyString,
            path: pathString,
            id,
            hint,
            value,
          });

          return value;
        };
      }

      if (prop === "toString") {
        return function () {
          const value = makeStringTaint(key, "toString:" + pathString);
          ppLog("toString", {
            key: keyString,
            path: pathString,
            id,
            value,
          });
          return value;
        };
      }

      if (prop === "valueOf") {
        return function () {
          const value = makeStringTaint(key, "valueOf:" + pathString);
          ppLog("valueOf", {
            key: keyString,
            path: pathString,
            id,
            value,
          });
          return value;
        };
      }

      const iteratorSym = getWellKnownSymbol("iterator");
      if (iteratorSym !== "" && prop === iteratorSym) {
        return function () {
          ppLog("iterator", {
            key: keyString,
            path: pathString,
            id,
            stack: ppStack(stackEnabled),
          });

          const arr = [
            makePrimitiveTaint(key, mode, "iter0:" + pathString),
            makePrimitiveTaint(key, mode, "iter1:" + pathString),
          ];

          let index = 0;
          return {
            next() {
              if (index < arr.length) {
                const value = arr[index];
                index += 1;
                return { value, done: false };
              }
              return { value: undefined, done: true };
            },
          };
        };
      }

      if (prop === "constructor") {
        return Object;
      }

      if (prop === "length") {
        return 1;
      }

      return makeProxyTaint(key, mode, stackEnabled, path.concat([propStr]));
    },

    set(targetFn, prop, value, receiver) {
      ppLog("set", {
        key: keyString,
        path: path.concat([keyToLogString(prop)]).join("."),
        id,
        value,
        stack: ppStack(stackEnabled),
      });
      return true;
    },

    has(targetFn, prop) {
      ppLog("has", {
        key: keyString,
        path: pathString,
        id,
        prop: keyToLogString(prop),
        stack: ppStack(stackEnabled),
      });
      return Reflect.has(targetFn, prop);
    },

    ownKeys(targetFn) {
      ppLog("ownKeys", {
        key: keyString,
        path: pathString,
        id,
        stack: ppStack(stackEnabled),
      });
      return Reflect.ownKeys(targetFn);
    },

    getOwnPropertyDescriptor(targetFn, prop) {
      ppLog("getOwnPropertyDescriptor", {
        key: keyString,
        path: pathString,
        id,
        prop: keyToLogString(prop),
        stack: ppStack(stackEnabled),
      });
      return Reflect.getOwnPropertyDescriptor(targetFn, prop);
    },
  };

  return new Proxy(target, handler);
}

function makeTaintValue(key, mode, stackEnabled) {
  if (mode === "string") {
    return makeStringTaint(key, "read");
  }
  if (mode === "numeric") {
    return makeNumericTaint(key, "read");
  }
  if (mode === "boolean") {
    return makeBooleanTaint(key, "read");
  }
  if (mode === "object") {
    return makeObjectTaint(key, "read");
  }
  if (mode === "array") {
    return makeArrayTaint(key, "read");
  }
  return makeProxyTaint(key, mode, stackEnabled);
}

let ppInstalled = [];
let ppInstalledMap = Object.create(null);
export function uninstallPPTaint() {
  for (let i = ppInstalled.length - 1; i >= 0; --i) {
    const r = ppInstalled[i];
    if (r.old === undefined) delete r.owner[r.key];
    else ppDefine(r.owner, r.key, r.old);
  }
  ppInstalled = [];
  ppInstalledMap = Object.create(null);
  ppLog("restored", { session: ppSession });
}
function logRead(node, stackEnabled) {
  ppLog("read", { key: node.label, mode: node.mode, path: node.pathText,
    session: ppSession, stack: ppStack(stackEnabled) });
}
function nodeValue(node, activeThen, stackEnabled) {
  if (node.label === "then" && !activeThen) return undefined;
  if (node.children.length === 0) return makeTaintValue(node.label, node.mode, stackEnabled);
  if (node.cached !== undefined) return node.cached;
  const value = makeTaintValue(node.label, node.mode, stackEnabled);
  for (const child of node.children) {
    const oldChild = ppOwnDesc(value, child.key);
    ppDefine(value, child.key, { configurable: true, enumerable: false,
      get() { logRead(child, stackEnabled); return nodeValue(child, activeThen, stackEnabled); },
      set(v) { ppLog("write", { key: child.label, path: child.pathText, session: ppSession, value: v }); }
    });
    ppDefine(ppInstalled, String(ppInstalled.length), { value: { owner: value, key: child.key, old: oldChild }, writable: true, configurable: true, enumerable: true });
  }
  node.cached = value;
  return value;
}
function installNode(node, activeThen, stackEnabled, strict) {
  const key = node.key;
  if (ppInstalledMap[node.pathText] === true) return;
  const old = ppOwnDesc(Object.prototype, key);
  if (old && !old.configurable) {
    ppLog("install-skip-nonconfigurable", { key: node.label });
    if (strict) throw new Error("nonconfigurable property");
    return;
  }
  ppDefine(Object.prototype, key, { configurable: true, enumerable: false,
    get() { logRead(node, stackEnabled); return nodeValue(node, activeThen, stackEnabled); },
    set(value) { ppLog("write", { key: node.label, value, session: ppSession, stack: ppStack(stackEnabled) }); }
  });
  ppDefine(ppInstalled, String(ppInstalled.length), { value: { owner: Object.prototype, key, old }, writable: true, configurable: true, enumerable: true });
  ppInstalledMap[node.pathText] = true;
  ppLog("installed", { rawKey: node.rawKey, key: node.label, mode: node.mode,
    path: node.pathText, session: ppSession, activeThen, stackEnabled });
}
function singleNode(rawKey, mode) {
  const key = toPropertyKey(rawKey);
  return { rawKey, key, label: keyToLogString(key), mode,
    pathText: ppPath([keyToLogString(key)]), children: [], cached: undefined };
}
function installOne(rawKey, mode, activeThen, stackEnabled) {
  if (!rawKey || rawKey === "none") return;
  const node = singleNode(rawKey, mode);
  if (node.key === "") return;
  installNode(node, activeThen, stackEnabled, false);
}
function parsePlan(raw) {
  const spec = JSON.parse(raw[0] === "{" ? raw : decodeURIComponent(raw));
  if (spec.version !== 1 || !Array.isArray(spec.properties) || spec.properties.length < 1 || spec.properties.length > 32)
    throw new Error("ppSpec requires version 1 and 1..32 properties");
  const nodes = [];
  const ids = Object.create(null);
  const modes = ["string", "numeric", "boolean", "object", "array", "proxy"];
  for (const p of spec.properties) {
    if (!Array.isArray(p.path) || p.path.length < 1 || p.path.length > 8 || modes.indexOf(p.mode) < 0)
      throw new Error("invalid property path/mode");
    const canonical = [];
    for (const segment of p.path) {
      if (typeof segment !== "string" || !segment || segment.length > 512 || segment === "none")
        throw new Error("invalid path segment");
      const k = toPropertyKey(segment);
      if (k === "") throw new Error("unsupported symbol");
      canonical.push(keyToLogString(k));
    }
    const id = ppPath(canonical);
    if (ids[id]) throw new Error("duplicate or conflicting property path");
    const n = singleNode(p.path[p.path.length-1], p.mode);
    n.pathText = id; n.parentId = canonical.length > 1 ? ppPath(canonical.slice(0,-1)) : "";
    ids[id] = n; nodes.push(n);
  }
  for (const n of nodes) {
    if (!n.parentId) continue;
    const parent = ids[n.parentId];
    if (!parent || (parent.mode !== "object" && parent.mode !== "array"))
      throw new Error("every parent must be explicit object or array");
    if (parent.mode === "array" && n.key === "length") throw new Error("array length is nonconfigurable");
    parent.children.push(n);
  }
  return nodes;
}
export function installPPTaintFromArgs(params) {
  const rawKey = readParam(params, "ppKey");
  const mode = readParam(params, "ppMode") || "proxy";
  const rawSpec = readParam(params, "ppSpec");
  const activeThen = readParam(params, "ppActiveThen") === "true";
  const stackEnabled = readParam(params, "ppStack") === "true";
  // Validate before mutating prototypes. Single and multiple protocols cannot be mixed.
  if (rawSpec && rawKey && rawKey !== "none") throw new Error("ppKey and ppSpec are mutually exclusive");
  const nodes = rawSpec ? parsePlan(rawSpec) : null;
  if (nodes) {
    uninstallPPTaint();
    ppSession = readParam(params, "ppSession") || "multi-v1";
    try {
      for (const n of nodes) ppLog("config", { ppKey: n.label, ppMode: n.mode, path: n.pathText, session: ppSession });
      for (const n of nodes) if (!n.parentId) installNode(n, activeThen, stackEnabled, true);
      ppLog("multi-ready", { session: ppSession, properties: nodes.length });
    } catch (e) { uninstallPPTaint(); throw e; }
  } else {
    ppSession = readParam(params, "ppSession") || "single";
    ppLog("config", { ppKey: rawKey, ppMode: mode, ppActiveThen: activeThen, ppStack: stackEnabled });
    installOne(rawKey, mode, activeThen, stackEnabled);
  }
  globalThis.__pp_install_key__ = function (key) { installOne(key, mode, activeThen, stackEnabled); };
  globalThis.__pp_restore__ = uninstallPPTaint;
}

'''

SKIP_DIRS = {
    "build",
    ".hvigor",
    "oh_modules",
    "node_modules",
    ".preview",
    ".idea",
    ".gradle",
}

HYPIUM_CALL_RE = re.compile(r"(?m)^([ \t]*)(Hypium\.hypiumTest\s*\()")
SOURCE_PATTERNS = ("*.ets", "*.ts", "*.js")


def should_skip(path: Path) -> bool:
    return any(part in SKIP_DIRS for part in path.parts)


def has_active_hypium_call(text: str) -> bool:
    return HYPIUM_CALL_RE.search(text) is not None


def to_import_path(from_file: Path, target_file: Path) -> str:
    rel = os.path.relpath(
        target_file.with_suffix("").resolve(),
        start=from_file.parent.resolve(),
    )
    rel = rel.replace(os.sep, "/")
    if not rel.startswith("."):
        rel = "./" + rel
    return rel


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def find_insert_import_index(lines: list[str]) -> int:
    last_import = -1
    for i, line in enumerate(lines):
        if line.lstrip().startswith("import "):
            last_import = i
    return last_import + 1


def patch_file(path: Path) -> bool:
    text = read_text(path)
    original = text

    if not has_active_hypium_call(text):
        return False

    parent = path.parent.parent
    pp_dir = parent / "pp"
    # pp_file = pp_dir / "PPTaint.ets"
    pp_file = pp_dir / "PPTaint.js"

    import_path = to_import_path(path, pp_file)
    import_line = f"import {{ installPPTaintFromArgs }} from '{import_path}';\n"

    def drop_old_entry(match):
        names = [x.strip() for x in match.group(1).split(",") if x.strip() != "installPPTaintFromArgs"]
        return "import { " + ", ".join(names) + " } from " + match.group(2) + ";" if names else ""
    text = re.sub(r"import\s*\{([^}]*\binstallPPTaintFromArgs\b[^}]*)\}\s*from\s*(['\"][^'\"]+['\"]);", drop_old_entry, text)
    if import_line not in text:
        lines = text.splitlines(keepends=True)
        insert_at = find_insert_import_index(lines)

        if insert_at > 0:
            lines.insert(insert_at, import_line)
            text = "".join(lines)
        else:
            text = import_line + text

    call_line = "installPPTaintFromArgs(abilityDelegatorArguments.parameters);"

    if call_line not in text:
        text, replacements = HYPIUM_CALL_RE.subn(
            r"\1installPPTaintFromArgs(abilityDelegatorArguments.parameters);\n\1\2",
            text,
            count=1,
        )
        if replacements == 0:
            return False

    pp_dir.mkdir(parents=True, exist_ok=True)

    old_ets_file = pp_dir / "PPTaint.ets"
    if old_ets_file.exists():
        old_ets_file.unlink()

    old_pp_text = pp_file.read_text(encoding="utf-8") if pp_file.exists() else None
    if old_pp_text != PPTAINT:
        write_text(pp_file, PPTAINT)

    if text != original:
        write_text(path, text)
        return True

    return old_pp_text != PPTAINT


def find_hypium_entry_files(base: Path) -> list[Path]:
    targets = []

    for pattern in SOURCE_PATTERNS:
        for path in base.rglob(pattern):
            if should_skip(path):
                continue

            try:
                text = read_text(path)
            except UnicodeDecodeError:
                continue
            except OSError as e:
                print(f"[skip-read-error] {path}: {e}")
                continue

            if has_active_hypium_call(text):
                targets.append(path)

    return sorted(set(targets))


def main() -> None:
    if not BASE.exists():
        raise SystemExit(f"not found: {BASE}")

    targets = find_hypium_entry_files(BASE)

    print(f"found {len(targets)} Hypium entry files")

    changed = 0
    for path in targets:
        try:
            did_change = patch_file(path)
        except OSError as e:
            print(f"[skip-patch-error] {path.relative_to(ROOT)}: {e}")
            continue

        if did_change:
            changed += 1
            print("[patched]", path.relative_to(ROOT))
        else:
            print("[ok]", path.relative_to(ROOT))

    print(f"changed {changed} files")
    print("review with: git diff -- test/xts/acts")


if __name__ == "__main__":
    main()
