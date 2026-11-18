/*
 * [yy] Prototype pollution taint helper for ACTS.
 * JS version, used to avoid strict ArkTS prototype/Symbol restrictions.
 */

function ppSafeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (e) {
    try {
      return String(value);
    } catch (e2) {
      return "<unprintable>";
    }
  }
}

function ppLog(event, data) {
  try {
    console.info("[pp] " + event + " " + ppSafeStringify(data));
  } catch (e) {
    console.info("[pp] " + event);
  }
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
    Object.defineProperty(boxed, "__pp_taint_id__", { value: id, configurable: true, enumerable: false, writable: true });
    Object.defineProperty(boxed, "__pp_taint_key__", { value: keyString, configurable: true, enumerable: false, writable: true });
    Object.defineProperty(boxed, "__pp_taint_mode__", { value: "boolean", configurable: true, enumerable: false, writable: true });
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
    Object.defineProperty(value, "__pp_taint_id__", { value: id, configurable: true, enumerable: false, writable: true });
    Object.defineProperty(value, "__pp_taint_key__", { value: keyString, configurable: true, enumerable: false, writable: true });
    Object.defineProperty(value, "__pp_taint_mode__", { value: "object", configurable: true, enumerable: false, writable: true });
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
    Object.defineProperty(value, "__pp_taint_id__", { value: id, configurable: true, enumerable: false, writable: true });
    Object.defineProperty(value, "__pp_taint_key__", { value: keyString, configurable: true, enumerable: false, writable: true });
    Object.defineProperty(value, "__pp_taint_mode__", { value: "array", configurable: true, enumerable: false, writable: true });
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

function getInstalledMap() {
  if (globalThis.__pp_installed_keys__ === undefined || globalThis.__pp_installed_keys__ === null) {
    globalThis.__pp_installed_keys__ = {};
  }
  return globalThis.__pp_installed_keys__;
}

function installOne(rawKey, mode, activeThen, stackEnabled) {
  if (rawKey === undefined || rawKey === null || rawKey.length === 0 || rawKey === "none") {
    return;
  }

  const propKey = toPropertyKey(rawKey);
  if (propKey === "") {
    ppLog("install-skip-empty-key", { rawKey });
    return;
  }

  const logKey = keyToLogString(propKey);
  const installed = getInstalledMap();

  if (installed[logKey] === true) {
    ppLog("already-installed", { key: logKey });
    return;
  }

  const oldDesc = Object.getOwnPropertyDescriptor(Object.prototype, propKey);
  if (oldDesc !== undefined && oldDesc !== null && oldDesc.configurable === false) {
    ppLog("install-skip-nonconfigurable", { key: logKey });
    return;
  }

  const desc = {
    configurable: true,
    enumerable: false,

    get() {
      ppLog("read", {
        key: logKey,
        mode,
        stack: ppStack(stackEnabled),
      });

      if (logKey === "then" && !activeThen) {
        ppLog("then-passive-return-undefined", { key: logKey });
        return undefined;
      }

      return makeTaintValue(propKey, mode, stackEnabled);
    },

    set(value) {
      ppLog("write", {
        key: logKey,
        value,
        stack: ppStack(stackEnabled),
      });
    },
  };

  try {
    Object.defineProperty(Object.prototype, propKey, desc);
    installed[logKey] = true;
    ppLog("installed", {
      rawKey,
      key: logKey,
      mode,
      activeThen,
      stackEnabled,
    });
  } catch (e) {
    ppLog("install-failed", {
      rawKey,
      key: logKey,
      error: String(e),
    });
  }
}

export function installPPTaintFromArgs(params) {
  const rawKey = readParam(params, "ppKey");
  const mode = readParam(params, "ppMode") || "proxy";
  const activeThen = readParam(params, "ppActiveThen") === "true";
  const stackEnabled = readParam(params, "ppStack") === "true";

  ppLog("config", {
    ppKey: rawKey,
    ppMode: mode,
    ppActiveThen: activeThen,
    ppStack: stackEnabled,
  });

  installOne(rawKey, mode, activeThen, stackEnabled);

  globalThis.__pp_install_key__ = function (key) {
    installOne(key, mode, activeThen, stackEnabled);
  };
}

