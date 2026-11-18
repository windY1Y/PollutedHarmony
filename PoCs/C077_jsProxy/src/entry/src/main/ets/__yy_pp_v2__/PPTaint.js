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

function yyInstallOriginal(params) {
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


const YY_PP_SLOT = Symbol.for("yy.pp.bootstrap.v2");
const YY_PP_PARAM = "__yy_pp_config_v2__";
const YY_PP_BUNDLES = ["com.DFX.test", "com.WebEngineVersion.test", "com.ability.errcode.assist", "com.ability.errcode.assist2", "com.ability.errcode.assist3", "com.acts.ActsAccessTokenNDKTest", "com.acts.AdsServiceDemo", "com.acts.Pastboard.napitest", "com.acts.Pastboard.ndkWithPermissionstest", "com.acts.TelephonyNdk.test", "com.acts.Timendk.test", "com.acts.ability.actslifecyclerely", "com.acts.ability.actsopenlinktestrely.static", "com.acts.ability.asynclifecycletest", "com.acts.ability.baseerrorappclonerely", "com.acts.ability.baseerrorrely", "com.acts.ability.baseerrorrely.static", "com.acts.ability.completionhandlerforatomicservice", "com.acts.ability.errcode", "com.acts.ability.errcode2", "com.acts.ability.multiinstaceerrcodetest", "com.acts.ability.plugintest", "com.acts.ability.setabilityinstanceinfo", "com.acts.ability.setabilityinstanceinfo.demo2", "com.acts.ability.specifiedability", "com.acts.ability.specifiedability.demo1", "com.acts.ability.specifiedability.demo2", "com.acts.ability.specifiedability.demo3", "com.acts.abilitydelegatorrely.static", "com.acts.abilitydelegatortest", "com.acts.abilitydelegatortest.static", "com.acts.abilitymultiinstancea", "com.acts.abilitymultiinstanceb", "com.acts.abilitymultiinstancec", "com.acts.abilitymultiinstanced", "com.acts.abilitymultiinstancee", "com.acts.abilitytoolfinishtest", "com.acts.abilitytoolrely", "com.acts.accountauthenticator", "com.acts.ace.esnapitest", "com.acts.ace.napitest", "com.acts.ace.napitestjitless", "com.acts.ace.xcomponentetstest", "com.acts.actsCallerInfoAssist01Test", "com.acts.actsCallerInfoTest", "com.acts.actsabilitywmstest", "com.acts.actsbackgroundprocessmanagertest", "com.acts.actsbaseerrrocodemethodtest", "com.acts.actsbaseerrrocodemethodtest.static", "com.acts.actscallability", "com.acts.actscallfunction", "com.acts.actscallnormalrely", "com.acts.actscallpermissionrely", "com.acts.actscapistartselfuiabilitytest20test", "com.acts.actscommoncomponentcalltest", "com.acts.actscommoneventerrortest", "com.acts.actsconnectservicetest", "com.acts.actscreatebundlecontexttest", "com.acts.actsgraphics2dapi20test", "com.acts.actsinputinjectkeyeventtest", "com.acts.actsinterfacemultiusersenterprisetest", "com.acts.actsinterfacemultiuserstest", "com.acts.actsinterfacemultiusersthirdtest", "com.acts.actslocationcapi20test", "com.acts.actslongtimetasktest", "com.acts.actsnetworkkittest", "com.acts.actsneuralnetworkcoretest", "com.acts.actsosaccountndktest", "com.acts.actsprinterrorcodetest", "com.acts.actsrelationalstoretest", "com.acts.actsrevokequickfixapp", "com.acts.actsshorttimetaskndktest", "com.acts.actsstartandterminateassisttest01", "com.acts.actsstartandterminateassisttest02", "com.acts.actsstartandterminateassisttest03", "com.acts.actsstartappcloneapptest", "com.acts.actsudmftest", "com.acts.anitest.static", "com.acts.appclonedemo", "com.acts.applicationcontexttest", "com.acts.applicationcontexttest.static", "com.acts.arktsnapiloadtest", "com.acts.arkui.atomicservice.ui.component.test", "com.acts.arkui.component.common.attrs.001.test", "com.acts.arkui.component.common.attrs.002.test", "com.acts.arkui.component.common.attrs.003.test", "com.acts.arkui.component.common.attrs.004.test", "com.acts.arkui.component.common.attrs.005.test", "com.acts.arkui.component.common.attrs.006.test", "com.acts.arkui.component.common.attrs.ResponseRegionnowear.test", "com.acts.arkui.component.common.attrs.alignRules.nowear.test", "com.acts.arkui.component.common.attrs.aspectRatio.nowear.test", "com.acts.arkui.component.common.attrs.constraintSize.nowear.test", "com.acts.arkui.component.common.attrs.disappear.nowear.test", "com.acts.arkui.component.common.attrs.displayPriority.nowear.test", "com.acts.arkui.component.common.attrs.flex.nowear.test", "com.acts.arkui.component.common.attrs.flex.two.nowear.test", "com.acts.arkui.component.common.attrs.flex1.test", "com.acts.arkui.component.common.attrs.flex2.test", "com.acts.arkui.component.common.attrs.focusValue.test", "com.acts.arkui.component.common.attrs.gridOffset.nowear.test", "com.acts.arkui.component.common.attrs.gridSpan.nowear.test", "com.acts.arkui.component.common.attrs.height.nowear.test", "com.acts.arkui.component.common.attrs.layoutWeight.nowear.test", "com.acts.arkui.component.common.attrs.margin.nowear.test", "com.acts.arkui.component.common.attrs.marginLength.nowear.test", "com.acts.arkui.component.common.attrs.markAnchor.nowear.test", "com.acts.arkui.component.common.attrs.nowear.api13", "com.acts.arkui.component.common.attrs.nowear.test", "com.acts.arkui.component.common.attrs.offset.nowear.test", "com.acts.arkui.component.common.attrs.padding.nowear.test", "com.acts.arkui.component.common.attrs.padding_container.test", "com.acts.arkui.component.common.attrs.position.nowear.test", "com.acts.arkui.component.common.attrs.size.nowear.test", "com.acts.arkui.component.common.attrs.stateStyle.nowear.test", "com.acts.arkui.component.common.attrs.test", "com.acts.arkui.component.common.attrs.three.flex.three.nowear.test", "com.acts.arkui.component.common.attrs.three.test", "com.acts.arkui.component.common.attrs.three01.test", "com.acts.arkui.component.common.attrs.two.test", "com.acts.arkui.component.common.attrs.two01.test", "com.acts.arkui.component.common.attrs.useSizeType.nowear.test", "com.acts.arkui.component.common.attrs.width.nowear.test", "com.acts.arkui.component.common.attrs.zIndex.nowear.test", "com.acts.arkui.component.common.attrs02.test", "com.acts.arkui.component.common.attrs03.test", "com.acts.arkui.component.common.attrs1.test", "com.acts.arkui.component.common.attrs2.test", "com.acts.arkui.component.common.attrs3.test", "com.acts.arkui.component.common.attrs4.test", "com.acts.arkui.component.common.attrs5.test", "com.acts.arkui.component.common.attrsTabindex.nowear.test", "com.acts.arkui.defaultfocus.testwear", "com.acts.arkui.onappear.testwear", "com.acts.arkui.theme.test", "com.acts.authorizeduriapplication", "com.acts.backgroundprocessmanagerndktest", "com.acts.bundle.stage", "com.acts.callapprely", "com.acts.calleeabilityrely", "com.acts.childprocessmanagertest", "com.acts.cleancachefilesreply", "com.acts.cloud.ad.level.test", "com.acts.cloud.ad.test", "com.acts.cloud.oaid.test", "com.acts.context.aappserviceextension", "com.acts.context.aappserviceextensionrely", "com.acts.context.aappserviceextensionrely2", "com.acts.contextprocessname", "com.acts.contextprocessnameassist", "com.acts.createdisplaycontext", "com.acts.dataShare.config", "com.acts.datashareserver_stage", "com.acts.dateTime.test", "com.acts.device_manager.normal", "com.acts.distributeddatamgr.pasteboardetsnopermissionstest", "com.acts.distributeddatamgr.pasteboardndknopermissionstest", "com.acts.distributeddatamgr.pasteboardtest", "com.acts.distributeddatamgr.relationalstoreapi16etstest", "com.acts.example.requestdialog", "com.acts.example.startselfuiabilitytest", "com.acts.flagstartwithouttipstest", "com.acts.form.formsystemtestservicea.hmservice", "com.acts.form.formsystemtestserviceb.hmservice", "com.acts.form.formsystemtestservicee.hmservice", "com.acts.form.formsystemtestservicef.hmservice", "com.acts.form.formsystemtestserviceg.hmservice", "com.acts.gzipdecompressiontest", "com.acts.gzipdecompressiontest.static", "com.acts.httpCache", "com.acts.httpdataoptions", "com.acts.httpextensionstest", "com.acts.httprequest", "com.acts.httprequestonandoff", "com.acts.httpresponse", "com.acts.imeability.test", "com.acts.inputmethodauthority.test", "com.acts.inputmethoddrawncontrol.test", "com.acts.inputmethodengine.test", "com.acts.inputmethodlist.test", "com.acts.inputmethodndktest", "com.acts.inputmethodtest", "com.acts.inputmethodwidmanage.test", "com.acts.ipcstage.service", "com.acts.ipcstage.test", "com.acts.keycodeevent", "com.acts.killprocesshap", "com.acts.killprocessthirdhap", "com.acts.killprocessthirdhap2", "com.acts.lastexitreasonrely1", "com.acts.lastexitreasontest", "com.acts.lifecycleflowordertest", "com.acts.lifecycleflowordertestdemo", "com.acts.liveformextensiontest", "com.acts.moveabilitytobgtest", "com.acts.multimodalinputcapslocktest", "com.acts.multimodalinputdevicetest", "com.acts.multimodalinputinfraredemittertest", "com.acts.multimodalinputkeycodetest", "com.acts.multimodalinputndksystemtest", "com.acts.multimodalinputndktest", "com.acts.multimodalinputnopermissiontest", "com.acts.multimodalinputpointertest", "com.acts.myapplicationb", "com.acts.myapplicationb_201", "com.acts.newNormalRequest.test", "com.acts.newRequest.test", "com.acts.newRequestAuthority.test", "com.acts.openlinktest", "com.acts.openlinktest.static", "com.acts.osaccountassistappone", "com.acts.osaccountassistapptwo", "com.acts.osaccounttest", "com.acts.pcs.arkts.assist", "com.acts.pcs.arktstest", "com.acts.pcs.jstest", "com.acts.pcs.ndktest", "com.acts.photoeditorextensiontest", "com.acts.rdb.napitest", "com.acts.relationalstorenapiTest", "com.acts.request.test", "com.acts.requestCacheDownload.test", "com.acts.requestCacheDownloadNormal.test", "com.acts.requestNormalTest", "com.acts.requestPermissionsTest.static", "com.acts.requestPermissionsonsettingTest.static", "com.acts.requestSpecial.test", "com.acts.requesttest", "com.acts.serviceextensionapp", "com.acts.serviceextensiondemo", "com.acts.shellcommandcontroltest", "com.acts.sslverify", "com.acts.stabilitystagecontext", "com.acts.startabilityforresulttest.static", "com.acts.startabilitytest.static", "com.acts.startappclonetest", "com.acts.startbywantagent", "com.acts.startuiserviceextensionrely", "com.acts.startuiserviceextensiontest", "com.acts.startuiserviceextensiontestenterprise", "com.acts.startupmanualhelp1", "com.acts.startupmanualhelp2", "com.acts.startuptest", "com.acts.staticinfomationquery", "com.acts.stinformationmulapp", "com.acts.stopserviceextensiontest", "com.acts.storage.backupextension", "com.acts.storage.environmentndk", "com.acts.storage.fileiondk", "com.acts.storage.filesharendk", "com.acts.storage.fileurindk", "com.acts.systemapitest", "com.acts.systemappa", "com.acts.systemappb", "com.acts.telephonyndk20test", "com.acts.terminalselfdelayhelper", "com.acts.terminateselfwithresulthelper", "com.acts.test.actscodeparsingtest", "com.acts.theme.screenlocktest", "com.acts.theme.wallpaperauthoritytest", "com.acts.theme.wallpapertest", "com.acts.thirdpartyapprely", "com.acts.time.test", "com.acts.timenauthority.test", "com.acts.tlssupportsendarraybuffer", "com.acts.uiextensioncontexttest", "com.acts.uiextensionprovider", "com.acts.uiextensionprovider2", "com.acts.uiextensionprovider3", "com.acts.uiextensionprovider4", "com.acts.uiextensionservice", "com.acts.usb.ets.function", "com.acts.usb.ets.function.static", "com.acts.userauthetstest", "com.acts.weberrorcode", "com.acts.websocketcertverify", "com.acts.wsproxy", "com.acts.wssupportcustomprotocol", "com.acts.zlib.napitest", "com.actsbundle.napitest", "com.actschecksumtest.test", "com.actsffrt.napitest", "com.actsziptest.test", "com.actszlibinterfacetest.test", "com.actszlibinterfacetest.test.static", "com.ai.nnrt.napitest", "com.amsst.actsabilitydelegatorcasetest", "com.amsst.actsstserviceabilityclientcasetest", "com.amsst.amsdatauriutils", "com.amsst.dataabilityaccessdatashare", "com.amsst.fwkdataaccessor", "com.amsst.stdataability", "com.amsst.stserviceabilityclient", "com.arkui.ace.FrameNode.api12", "com.arkui.ace.FrameNodeNoWear.api12", "com.arkui.ace.RouteManagement.api11", "com.arkui.ace.RouteManagement.api12", "com.arkui.ace.RouteManagement.api18", "com.arkui.ace.RouteManagementnowear.api12", "com.arkui.ace.StateMangagement.api18", "com.arkui.ace.StateMangagement.api20", "com.arkui.ace.StateMangagement.nowear.api11", "com.arkui.ace.StateMangagement.nowear.api12", "com.arkui.ace.StateMangagement.wear.api11", "com.arkui.ace.StateMangagement01.api11", "com.arkui.ace.StateMangagement01.api12", "com.arkui.ace.StateMangagement02.api11", "com.arkui.ace.StateMangagement02.api12", "com.arkui.ace.StateMangagement03.api12", "com.arkui.ace.UIContext", "com.arkui.ace.UIContext12", "com.arkui.ace.XNode.api12", "com.arkui.ace.XNode.api14", "com.arkui.ace.XNode.api15", "com.arkui.ace.XNode.api16", "com.arkui.ace.XNode.api18", "com.arkui.ace.XNode.api20", "com.arkui.ace.XNodeNoWear.api12", "com.arkui.ace.advanced.component.nowear.api18", "com.arkui.ace.animation", "com.arkui.ace.animation12", "com.arkui.ace.animation18", "com.arkui.ace.animation20", "com.arkui.ace.arcScroll_api18", "com.arkui.ace.commonAttrsDialog.api11", "com.arkui.ace.commonAttrsDialog.api12", "com.arkui.ace.commonAttrsDialog.api13", "com.arkui.ace.commonAttrsDialog.api14", "com.arkui.ace.commonAttrsDialog.nowear.api13", "com.arkui.ace.commonAttrsDialog.nowear.api14", "com.arkui.ace.commonAttrsDialog.nowear.api20", "com.arkui.ace.commonAttrsEvents.api11", "com.arkui.ace.commonAttrsEvents.api12", "com.arkui.ace.commonAttrsEvents.api13", "com.arkui.ace.commonAttrsEvents.api20", "com.arkui.ace.commonAttrsEvents.nowear.api11", "com.arkui.ace.commonAttrsLayout.api11", "com.arkui.ace.commonAttrsLayout.api12", "com.arkui.ace.commonAttrsLayout.api13", "com.arkui.ace.commonAttrsLayout.api15", "com.arkui.ace.commonAttrsLayout.nowear.api11", "com.arkui.ace.commonAttrsOther.api11", "com.arkui.ace.commonAttrsOther.api12", "com.arkui.ace.commonAttrsOther.nowear.api11", "com.arkui.ace.commonAttrsVisual.api11", "com.arkui.ace.commonAttrsVisual.api12", "com.arkui.ace.commonAttrsVisual.api14", "com.arkui.ace.commonAttrsVisual.api20", "com.arkui.ace.commonEvents.api11", "com.arkui.ace.commonEvents.api12", "com.arkui.ace.commonEvents.api12None", "com.arkui.ace.commonEvents.nowear.api11", "com.arkui.ace.dialog", "com.arkui.ace.dialog.api12", "com.arkui.ace.dialog.api15", "com.arkui.ace.dialog.api19", "com.arkui.ace.dialog.api20", "com.arkui.ace.dialog.nowear.api11", "com.arkui.ace.dialog.nowear.api12", "com.arkui.ace.dialog.nowear.api15", "com.arkui.ace.dialog.nowear.api18", "com.arkui.ace.dialog.nowear.api19", "com.arkui.ace.dialog.nowear.api20", "com.arkui.ace.draw", "com.arkui.ace.drawAPI12", "com.arkui.ace.drawAPI13", "com.arkui.ace.drawAPI20", "com.arkui.ace.global.api11", "com.arkui.ace.globalnowear.api11", "com.arkui.ace.imageText", "com.arkui.ace.imageText.api11.other", "com.arkui.ace.imageText.api12", "com.arkui.ace.imageText.api12.other", "com.arkui.ace.imageText.api13", "com.arkui.ace.imageText.api14", "com.arkui.ace.imageText.api15", "com.arkui.ace.imageText.api16", "com.arkui.ace.imageText.api18", "com.arkui.ace.imageText.api19", "com.arkui.ace.imageText.api20", "com.arkui.ace.imageText.nowear", "com.arkui.ace.imageText.nowear.api12", "com.arkui.ace.imageText.nowear.api13", "com.arkui.ace.imageText.nowear.api15", "com.arkui.ace.imageText.nowear.api16", "com.arkui.ace.imageText.nowear.api18", "com.arkui.ace.imageText.nowear.api20", "com.arkui.ace.information", "com.arkui.ace.information.api12", "com.arkui.ace.information.api16", "com.arkui.ace.information.api20", "com.arkui.ace.information.other", "com.arkui.ace.layout", "com.arkui.ace.layout.api12", "com.arkui.ace.layout.api14", "com.arkui.ace.layout.api18", "com.arkui.ace.layout.api20", "com.arkui.ace.layout.nowear.api11", "com.arkui.ace.layout.nowear.api12", "com.arkui.ace.layout.split02", "com.arkui.ace.layout.split03", "com.arkui.ace.layout.split04", "com.arkui.ace.layout.split05", "com.arkui.ace.layout.split06", "com.arkui.ace.navigation", "com.arkui.ace.navigation12", "com.arkui.ace.navigation13", "com.arkui.ace.navigation14", "com.arkui.ace.navigation15", "com.arkui.ace.navigation16", "com.arkui.ace.navigation18", "com.arkui.ace.navigation20", "com.arkui.ace.navigationnowear11", "com.arkui.ace.navigationnowear12", "com.arkui.ace.navigationnowear18", "com.arkui.ace.navigationwear18", "com.arkui.ace.observer", "com.arkui.ace.observer12", "com.arkui.ace.observer20", "com.arkui.ace.perf.api12", "com.arkui.ace.performance.api18", "com.arkui.ace.picker", "com.arkui.ace.picker.api12", "com.arkui.ace.picker.api13", "com.arkui.ace.picker.api16", "com.arkui.ace.picker.api18", "com.arkui.ace.picker.api20", "com.arkui.ace.picker.nowear", "com.arkui.ace.picker.nowear.api12", "com.arkui.ace.picker.nowear.api18", "com.arkui.ace.picker.nowear.api19", "com.arkui.ace.picker.nowear.api20", "com.arkui.ace.platform", "com.arkui.ace.platform.api12", "com.arkui.ace.platform.api13", "com.arkui.ace.platform.api14", "com.arkui.ace.platform.api20", "com.arkui.ace.platform.nowear.api12", "com.arkui.ace.scroll", "com.arkui.ace.scroll.api20", "com.arkui.ace.scroll.nowear.api11", "com.arkui.ace.scroll.nowear.api12", "com.arkui.ace.scroll.nowear.api13", "com.arkui.ace.scroll.nowear.api14", "com.arkui.ace.scroll.nowear.api15", "com.arkui.ace.scroll.nowear.api16", "com.arkui.ace.scroll.nowear.api18", "com.arkui.ace.scroll.nowear.api20", "com.arkui.ace.scroll12", "com.arkui.ace.scroll13", "com.arkui.ace.scroll14", "com.arkui.ace.scroll15", "com.arkui.ace.scroll18", "com.arkui.ace.select.api18", "com.arkui.ace.select.api20", "com.arkui.ace.swiper", "com.arkui.ace.video.api15", "com.avplayer.napitest", "com.avrecorderndk.avrecorderndktest", "com.bluetooth.napitest", "com.buffer.standard.static", "com.container.standard.static", "com.distributeddatamgr.relationalstore.napitest", "com.drivers.externalbase.napitest", "com.drivers.externalusb.napitest", "com.drivers.externalusb.noper.napitest", "com.drivers.hid.emit_event_test", "com.edm.acts.network", "com.edm.acts.nopermission", "com.edm.acts.normal", "com.errormanger.test", "com.esmodule.acts", "com.example.ActsWukongTest", "com.example.Checkbox", "com.example.DeviceAttest", "com.example.Dialog", "com.example.GeneralLayout", "com.example.ModelSheet", "com.example.Refresh", "com.example.Select", "com.example.aaappdebug", "com.example.aaappdebugtest", "com.example.aacommand07", "com.example.aacommand08", "com.example.aacommandimplicitstarttest", "com.example.aacommandprintonetest", "com.example.aacommandprintsync", "com.example.aacommandprintsynctest", "com.example.aacommandrelyhap", "com.example.aacommandtest", "com.example.abilitymonitortest", "com.example.abilitymonitortest.static", "com.example.abilitymultiinstance", "com.example.abilitymultiinstancetesta", "com.example.abilitymultiinstancetestb", "com.example.abilitymultiinstancetestc", "com.example.abilitymultiinstancetestd", "com.example.abilityrunninginfostest", "com.example.abilitystagemonitortest", "com.example.abilitystageondestroytest", "com.example.abilitywindowarg", "com.example.accessibilityerrcode", "com.example.accessibilitysendaccessibilityevent", "com.example.accessibilitysendaccessibilityevent.static", "com.example.accessibleabilitylist", "com.example.accessiblecaptionconfiguration", "com.example.accessiblecheckability", "com.example.accessiblecheckability.static", "com.example.accessibleregisterstate", "com.example.accessibleregisterstate.static", "com.example.accessiblesendevent", "com.example.accesstokentest.static", "com.example.accounttstest", "com.example.aceceshi", "com.example.acejsapi", "com.example.aceselecttest", "com.example.acevideo", "com.example.act_embeddeduiextension", "com.example.actsCommonEventSubscriberCAPITest", "com.example.actsaacommandtestatest", "com.example.actsability", "com.example.actsabilityerrcodequerytestrely", "com.example.actsabilityusertest", "com.example.actsaccountOauthtoken", "com.example.actsaccountaccessiblefirst", "com.example.actsaccountaccessiblesecond", "com.example.actsaccountoperatetest", "com.example.actsaccountsceneaccessible", "com.example.actsaccountsceneappaccess", "com.example.actsaccountsceneonoff", "com.example.actsaccounttest", "com.example.actsacenetworkinterceptionnativewebschemehandlerfourtest", "com.example.actsacenetworkinterceptionnativewebschemehandleronetest", "com.example.actsactionextensionabilityrely", "com.example.actsactionextensionabilitytest", "com.example.actsamscallbackfifthscene", "com.example.actsamscallbackfirstscene", "com.example.actsamscallbackfourthscene", "com.example.actsamscallbacksecondscene", "com.example.actsamscallbackthirdscene", "com.example.actsamstestfifthscene", "com.example.actsamstestfirstscene", "com.example.actsamstestfourthscene", "com.example.actsamstestsecondscene", "com.example.actsamstestthirdscene", "com.example.actsapplicationstartabilityauxiliary", "com.example.actsapplicationstartabilityauxiliary2", "com.example.actsapplicationstartabilitytest", "com.example.actsbmsaccesstokentest", "com.example.actsbmsenumtest.static", "com.example.actsbmsetsunpermissiontest", "com.example.actsbmsgetinfostest", "com.example.actsbmsgetinfostest.enterprise", "com.example.actsbmshapmoduletest", "com.example.actsbmsjstest", "com.example.actsbmsjsunpermissiontest", "com.example.actsbmsmetadatatest", "com.example.actsbundlemanagertest", "com.example.actscommoneventmanager", "com.example.actscommoneventmanagersupport", "com.example.actscommoneventmanagersupport.static", "com.example.actscommoneventmanagertest.static", "com.example.actscommoneventsupport", "com.example.actscommoneventsupporttest.static", "com.example.actscontext", "com.example.actscreatemodulecontexttest", "com.example.actsfeatureabilitytest", "com.example.actsflagstartwithouttipshap", "com.example.actsflagstartwithouttipshap1", "com.example.actsformtest.static", "com.example.actsgetabilitystatestagetest", "com.example.actsgetaccountsbyowner", "com.example.actsgetallaccounts", "com.example.actsgetappcontextstageatest", "com.example.actsgetappcontextstagebtest", "com.example.actsgetappcontexttest", "com.example.actsgetcurrenttopabilitystageatest", "com.example.actsgetcurrenttopabilitystagebtest", "com.example.actsgetdisplayidtest", "com.example.actsgetwantalltest", "com.example.actsgetwantalltesthap", "com.example.actskillprocesswithaccountclosetest", "com.example.actskioskmanagertest", "com.example.actsnotificationdistributed", "com.example.actsnotificationmanagerrequestenablenotificationallowtest", "com.example.actsnotificationmanagerrequestenablenotificationallowtest.static", "com.example.actsnotificationmanagerrequestenablenotificationcallbacktest", "com.example.actsnotificationmanagerrequestenablenotificationcallbacktest.static", "com.example.actsnotificationmanagerrequestenablenotificationdenytest", "com.example.actsnotificationmanagerrequestenablenotificationdenytest.static", "com.example.actsnotificationmanagerslot", "com.example.actsnotificationmanagerslot.static", "com.example.actsnotificationpublish", "com.example.actsnotificationpublish.static", "com.example.actsnotificationrequesttest", "com.example.actsnotificationrequesttest.static", "com.example.actsnotificationshow", "com.example.actsnotificationslot", "com.example.actsnotificationslot.static", "com.example.actsnotificationvibrationsound", "com.example.actsnotificationwantagent", "com.example.actsnotificationwantagent.static", "com.example.actsonandoffscreentest", "com.example.actsosaccountthirdpartytest", "com.example.actsparsingparameterstest", "com.example.actsregisterjserrorrely", "com.example.actsregisterjserrortest", "com.example.actsscenegetallaccounts", "com.example.actssetcheckdatasyncenable", "com.example.actssetchecksyncenable", "com.example.actsshareextensionabilityrely", "com.example.actsshareextensionabilitytest", "com.example.actsspecifiedprocess", "com.example.actsspecifytesthap", "com.example.actsstagecontextassisttwo", "com.example.actsstartchildprocesstest", "com.example.actsstartyunnertest", "com.example.actssubscribertestorder", "com.example.actssubscribertestorder.static", "com.example.actssubscribertestunorder", "com.example.actssubscribertestunorder.static", "com.example.actsterminateselfwithresulttest", "com.example.actsuiextensionexitreasontest", "com.example.actsuripermissionrely", "com.example.actsuripermisssiontest", "com.example.actsvalidator", "com.example.actswebdeviceservicetest.static", "com.example.addflagtest", "com.example.addflagtest.static", "com.example.amsZipfileUnzipfileST", "com.example.amsZipfileUnzipfileST.static", "com.example.apicoverhaptest", "com.example.apicoverhaptest.static", "com.example.appa", "com.example.applicationinfo", "com.example.arkcompilerdecimaltest", "com.example.arkts.ason", "com.example.arkts.collections", "com.example.arkts_module", "com.example.assistappa", "com.example.atomicsxts", "com.example.audiohaptic", "com.example.audiorenderer", "com.example.audiorenderinterrupt", "com.example.autofillautomatictest", "com.example.avimagegeneratorndk", "com.example.avmetadataextractorndk", "com.example.avplayeraudiondk", "com.example.avplayerndk", "com.example.avsessionvoicecall", "com.example.backdemo", "com.example.backwithresulttest", "com.example.badge", "com.example.badgeemitter.static", "com.example.bmsaccesstoken1", "com.example.bmsaccesstoken2", "com.example.bmsaccesstoken3", "com.example.bmsmainabilityfirstscene", "com.example.buffer", "com.example.builtins01", "com.example.builtins02", "com.example.builtinsupplytest", "com.example.bundlenativegetmainelementnametest", "com.example.c", "com.example.calltest", "com.example.camerandk", "com.example.camerapicker", "com.example.capiabilityruntimetest", "com.example.capichildprocesstest", "com.example.childprocess", "com.example.cleancachefilestest", "com.example.clearUpApplicationDataHelp", "com.example.clearUpApplicationDataHelpSystem", "com.example.collections", "com.example.collectionstest", "com.example.colorspace.static", "com.example.commonlibrarybitvectortest", "com.example.commontestabilityapp", "com.example.completionhandlerrely", "com.example.completionhandlertest", "com.example.concurrency_base_xts", "com.example.concurrentlibtest", "com.example.conditionvariabletest", "com.example.configuration", "com.example.connectionNoNet.static", "com.example.connectionWithWifi", "com.example.contacttest", "com.example.contacttest.nop", "com.example.containerLine", "com.example.containerRelation", "com.example.contextapp", "com.example.contextdirnormaltest", "com.example.contextdirtest", "com.example.contexttest", "com.example.contexttest.static", "com.example.convertxml", "com.example.coverapi", "com.example.createmodulecontextassistone", "com.example.createmodulecontexttest", "com.example.crossplatformcallback", "com.example.crossplatformpromise", "com.example.crossplatformstartability", "com.example.data", "com.example.debuggable", "com.example.defpermission", "com.example.delegatortest", "com.example.delegatortest.static", "com.example.depplinkdemo", "com.example.different.hmservice", "com.example.displaymanager", "com.example.downloadcloudsync", "com.example.downloadcloudsync.static", "com.example.dynamic_load", "com.example.ecmanewfeaturestests", "com.example.effect.static", "com.example.emittertest", "com.example.emittertest.static", "com.example.enterprise.actsbundlemanagertest", "com.example.enterprise.bundlenativegetmainelementnametest", "com.example.errmessage", "com.example.esimtest", "com.example.ethernet", "com.example.eventhubinterthreadtest", "com.example.execute_promise_after_module_load", "com.example.executeshellcommand", "com.example.executeshellcommand.static", "com.example.export01", "com.example.extensionzerotest", "com.example.fa8_app", "com.example.fa8_context", "com.example.fa_app", "com.example.faapicoverhaptest", "com.example.faapplication", "com.example.facoverhaptest", "com.example.fetchtest", "com.example.finishwithresultemptytest", "com.example.finishwithresultpromiseparameterstest", "com.example.finishwithresulttest", "com.example.formsystemhost", "com.example.forresulttestsecond", "com.example.forresulttestthrid", "com.example.getallaccountsnoparameter", "com.example.getcallingbundlepromisetest", "com.example.getformsinfotest", "com.example.getgroupdir", "com.example.getgroupdirhap2", "com.example.getmultipleaccountstest", "com.example.getresourcedirndkhaverestest", "com.example.getresourcedirndknothaverestest", "com.example.global_stage.static", "com.example.hartest", "com.example.hdr.static", "com.example.hitsnotificationcommoneventcapi", "com.example.hookabilityhap", "com.example.hookabilitytest", "com.example.httpconcurrent", "com.example.httpconcurrentnop", "com.example.image.static", "com.example.intelligenceapitest", "com.example.intent", "com.example.intl", "com.example.js", "com.example.json", "com.example.keystoretest", "com.example.l3jsdemo", "com.example.landscapewindow", "com.example.lastexitreasontest.static", "com.example.launcherability", "com.example.launchrule", "com.example.lazy_load", "com.example.lifecycle_xts", "com.example.lifecycletest", "com.example.linkenhance", "com.example.linkenhancenopermission", "com.example.lowpowerplayer_xts", "com.example.m", "com.example.mainhap", "com.example.mdns", "com.example.mechanicmanager", "com.example.menuprovider", "com.example.mindsporejstest", "com.example.multiabilitys", "com.example.multihaps", "com.example.myapplication", "com.example.myapplication.hmservice", "com.example.myapplication1", "com.example.myapplication101", "com.example.myapplication2", "com.example.myapplication4", "com.example.myapplication444", "com.example.myapplication5", "com.example.myapplication6", "com.example.mybatteryapp", "com.example.mydevicestatusapp", "com.example.mypowerapp", "com.example.mypowerdisplayapp", "com.example.mytest1", "com.example.mytest2", "com.example.mytest3", "com.example.mytest4", "com.example.mytest5", "com.example.mythermalapp", "com.example.ndk.enable", "com.example.netfirewall", "com.example.networkkndk", "com.example.networksecurity", "com.example.networktest", "com.example.newwanthap", "com.example.newwanthapa", "com.example.newwanthapapi7", "com.example.newwanttest", "com.example.notificationchangetest", "com.example.notificationchangetest.static", "com.example.notificationslotchangetest", "com.example.observertest", "com.example.ohaudiondk", "com.example.ohcamerandk", "com.example.ohimageeffectndk", "com.example.ondestorytest", "com.example.orientationtest", "com.example.pasteboardwithpermissiontest", "com.example.preferencessendabletest", "com.example.privacysensitivetest", "com.example.proxychannelmanager", "com.example.qianyiyingyong.hmservice", "com.example.radiotest", "com.example.recoveryability", "com.example.relationalstoresendabletest", "com.example.reportdrawncompletedmanualtest", "com.example.savecomponent_customize", "com.example.secondaryDirectory", "com.example.secondaryDirectory.static", "com.example.securitycomponent", "com.example.sendablecontexttest", "com.example.sensor.static", "com.example.shareapp", "com.example.shortcuttest", "com.example.simtest", "com.example.sockettest", "com.example.soundpoolxts", "com.example.stage_app", "com.example.stage_app.static", "com.example.stageappcontexttest", "com.example.stageautosign", "com.example.stagecontextpropertiestest", "com.example.startAbilityForResult.hmservice", "com.example.startability", "com.example.startabilityerrorcode", "com.example.startabilityerrorcode1", "com.example.startabilityerrorcode2", "com.example.startabilityerrorcodeenterprise", "com.example.startabilityforresult", "com.example.startabilityinnewprocessrely", "com.example.startabilityinnewprocesstest", "com.example.startabilityinnewprocesstest.static", "com.example.startdemo", "com.example.startselfuiabilityrely", "com.example.startuiserviceextensiontest.static", "com.example.static_load", "com.example.staticinformationmultihap", "com.example.staticinformationmultiple", "com.example.staticquerytesttwo", "com.example.statistics", "com.example.stream", "com.example.supportfunctionhaptest", "com.example.system1", "com.example.system2", "com.example.systemAPI", "com.example.systemAPI.static", "com.example.systemapitest.static", "com.example.systemappcalleea", "com.example.systemappcallera", "com.example.systemappcallerb", "com.example.systemappcallerc", "com.example.systemcalltest", "com.example.systemliveView", "com.example.systemliveView.static", "com.example.taskpool", "com.example.taskpool01", "com.example.taskpool02", "com.example.taskpool04", "com.example.taskpool05", "com.example.taskpool08", "com.example.taskpool11", "com.example.taskpool12", "com.example.taskpool13", "com.example.taskpool14", "com.example.taskpool15", "com.example.taskpoolsendable", "com.example.taskpooltest", "com.example.telephonysmstest", "com.example.terminateabilitytest", "com.example.terminateselfwithresulttesthap", "com.example.terminateselfwithresulttesthap2", "com.example.testapi", "com.example.text.static", "com.example.third1", "com.example.third2", "com.example.third4", "com.example.third5", "com.example.third6", "com.example.third7", "com.example.thirdappa", "com.example.thirdcalltest", "com.example.threadWorkertest", "com.example.timeout", "com.example.uiabilitycontexttest", "com.example.uiabilitycontexttest.static", "com.example.uiabilitylifecycle", "com.example.uieffect.static", "com.example.uiextensionforresultascaller", "com.example.uiextensionforresultascallerbackground", "com.example.uiextensionforresultascallerother", "com.example.uiextensionforresultascallersyspicker", "com.example.uiextensiontest", "com.example.uri", "com.example.url", "com.example.userservicesystemapi7", "com.example.util", "com.example.util2", "com.example.vendor1", "com.example.wantagentappkeytest", "com.example.wantconstanttest", "com.example.websockettest", "com.example.windowndk", "com.example.windowstagelifecycle_xts", "com.example.worker", "com.example.worker_path_load", "com.example.workercontexttest", "com.example.workermixtest", "com.example.workerpritest", "com.example.workertest", "com.example.xml", "com.example.xts_audiocapturerenhance", "com.example.xts_audiomanager", "com.example.xts_test_case", "com.examplemini.actsvalidator", "com.form.formsystemtestservicec.hmservice", "com.form.formsystemtestserviced.hmservice", "com.form.formsystemtestserviceh.hmservice", "com.form.formsystemtestservicenotsysapp.hmservice", "com.global.standard.static", "com.graphicegl.napitest", "com.graphicgl4.napitest", "com.graphicgles3.napitest", "com.hiappevent.napitest", "com.hiappevent.pamtest", "com.hicollie.test", "com.hidebug.collect.test", "com.hidebug.test", "com.hidebug.test.static", "com.hidebugnew.test", "com.hidebugraw.test", "com.hitrace.napitest", "com.huawei.printxtstest", "com.idna.myapplication", "com.jsleakwatcher.test", "com.location.napitest", "com.memoryutils.libpurgeablemem.napitest", "com.multimedia.napitest", "com.nativeavscreencapture.napitest", "com.nativebuffer.napitest", "com.nativedrawing.napitest", "com.nativefence.napitest", "com.nativeimage.napitest", "com.nativeipc.capiipc", "com.nativevsync.napitest", "com.nativewindow.napitest", "com.netconn.netconnndktest", "com.network.dnsndk.napitest", "com.network.websocket.napitest", "com.ohos.abilitydelegatorstagetest", "com.ohos.abilitytoolabilitydelegatorfatest", "com.ohos.acecollaboration", "com.ohos.actscallmanagerims2calltest", "com.ohos.actsfaabilitydisplayorientationhelper", "com.ohos.actsfaabilitydisplayorientationhelper2", "com.ohos.actsfaabilitydisplayorientationtest", "com.ohos.actshttpscertificatetest", "com.ohos.actslifecycle", "com.ohos.appclonehap1", "com.ohos.call_manager", "com.ohos.cellulardata", "com.ohos.cellulardata.nop", "com.ohos.dlp_xts", "com.ohos.getstartparameterhelper", "com.ohos.getstartparameterhelper2", "com.ohos.getstartparameterhelper3", "com.ohos.hag.famanager", "com.ohos.jshttp", "com.ohos.netmanagerhttp", "com.ohos.netmanagersocket", "com.ohos.network_nopermission", "com.ohos.network_nowifi", "com.ohos.network_wifi", "com.ohos.networksearch", "com.ohos.observer", "com.ohos.observer.nop", "com.ohos.radiostatistic", "com.ohos.rpcrequesttest", "com.ohos.rpctest", "com.ohos.simmanagertest", "com.ohos.smsmms", "com.ohos.socket", "com.ohos.st.formacquiretest", "com.ohos.st.formacquiretest2", "com.ohos.st.formdeletetest", "com.ohos.st.formdynamicrefreshtest", "com.ohos.st.formfuzztest", "com.ohos.st.formhostdeathrecipienttest", "com.ohos.st.formreleasetest", "com.ohos.st.formstatedisabletest", "com.ohos.st.formstateenabletest", "com.ohos.st.formstresstest", "com.ohos.st.formswithoutpermtest", "com.ohos.st.formsystemhost", "com.ohos.st.formsystemhostb", "com.ohos.st.formsystemhostc", "com.ohos.st.formsystemhostd", "com.ohos.st.formsystemhoste", "com.ohos.st.formsystemhostf", "com.ohos.st.formsystemhostg", "com.ohos.st.formsystemhosti", "com.ohos.st.formsystemhostj", "com.ohos.st.formsystemhostk", "com.ohos.st.formsystemhostl", "com.ohos.st.formsystemhostn", "com.ohos.st.formsystemhostnoperm", "com.ohos.st.formsystemhosto", "com.ohos.st.formsystemhostp", "com.ohos.st.formsystemprovidera", "com.ohos.st.formsystemproviderb", "com.ohos.st.formsystemproviderc", "com.ohos.st.formsystemproviderd", "com.ohos.st.formupdatetest", "com.ohos.startabilitygetdisplayidtest", "com.ohos.startabilitygetstartparametertest", "com.ohos.startabilitywantparamtest", "com.ohos.system_fetch", "com.open.harmony.aceEtsApiLack", "com.open.harmony.acetest", "com.open.harmony.acetest14", "com.open.harmony.acetestcommenventapi15", "com.open.harmony.acetestcommenventapi17", "com.open.harmony.acetestcommenventapi18", "com.open.harmony.acetestcommenventapi20", "com.open.harmony.acetestcommenventnowearapi18", "com.open.harmony.acewebtest", "com.open.harmony.actsaceincognitomodecloudservicecontrollergroupeighttest", "com.open.harmony.actsaceincognitomodecontrollerfivetest", "com.open.harmony.actsaceincognitomodedevthreetest", "com.open.harmony.actsaceincognitomodedevtwotest", "com.open.harmony.actsaceincognitomodewebviewcontrollertest", "com.open.harmony.actsacejumpbetweenwebdevtest", "com.open.harmony.actsacejumpbetweenwebdevthreetest", "com.open.harmony.actsacejumpbetweenwebenhancedtest", "com.open.harmony.actsacejumpbetweenwebenhancedtestthree", "com.open.harmony.actsacejumpbetweenwebenhancedtesttwo", "com.open.harmony.actsacejumpbetweenwebwebviewcontrollertest", "com.open.harmony.actsacejumpinwebcloudservicecontrollerseventest", "com.open.harmony.actsaceloadinterceptioncloudservicecontrollergroupsixtest", "com.open.harmony.actsaceloadinterceptionenhancedtest", "com.open.harmony.actsaceloadinterceptionenhancedtesttwo", "com.open.harmony.actsaceloadmetricdevtest", "com.open.harmony.actsaceloadmetricdevtwotest", "com.open.harmony.actsaceloadmetricenhancedtestthree", "com.open.harmony.actsaceloadmetricenhancedtesttwo", "com.open.harmony.actsaceloadstatuscloudservicewebcontrollerfivetest", "com.open.harmony.actsaceloadstatuscloudservicewebcontrollergroupeighttest", "com.open.harmony.actsaceloadstatusdevtest", "com.open.harmony.actsaceloadstatusenhancedtest", "com.open.harmony.actsaceloadstatusenhancedtestthree", "com.open.harmony.actsaceloadstatusenhancedtesttwo", "com.open.harmony.actsacenetworkinterceptioncloudservicecontrollerenhancedtest", "com.open.harmony.actsacenetworkinterceptioncloudservicecontrollerfivetest", "com.open.harmony.actsacenetworkinterceptioncloudservicecontrollerfourtest", "com.open.harmony.actsacenetworkinterceptioncloudservicecontrollergroupninetest", "com.open.harmony.actsacenetworkinterceptioncloudservicecontrollergrouptwelvetest", "com.open.harmony.actsacenetworkinterceptioncloudservicecontrollertest", "com.open.harmony.actsacenetworkinterceptiondevfourtest", "com.open.harmony.actsacenetworkinterceptiondevtest", "com.open.harmony.actsacenetworkinterceptionenhancedtest", "com.open.harmony.actsacenetworkinterceptionenhancedtesttwo", "com.open.harmony.actsacenetworkinterceptionwebcontrollertest", "com.open.harmony.actsacenetworkinterceptionwebviewcontrollertest", "com.open.harmony.actsaceopenwebpagedevfourtest", "com.open.harmony.actsaceopenwebpagedevtest", "com.open.harmony.actsaceopenwebpagedevthreetest", "com.open.harmony.actsaceopenwebpagedevtwotest", "com.open.harmony.actsaceopenwebpagedevwebviewcontrollertest", "com.open.harmony.actsaceopenwebpageenhancedtest", "com.open.harmony.actsaceopenwebpageenhancedtestthree", "com.open.harmony.actsaceopenwebpageenhancedtesttwo", "com.open.harmony.actsacewebhistoryenhancedfourtest", "com.open.harmony.actsacewebhistoryenhancedtest", "com.open.harmony.actsacewebhistoryenhancedtestthree", "com.open.harmony.actsacewebhistoryenhancedtesttwo", "com.open.harmony.actsacewebpagedownloadcloudservicecontrollergroupeighttest", "com.open.harmony.actsacewebpagedownloadcloudservicecontrollergroupeleventest", "com.open.harmony.actsacewebpagedownloadcloudservicecontrollergrouptwelvetest", "com.open.harmony.actsacewebpagedownloadenhancedtest", "com.open.harmony.actsacewebpagedownloadtestthree", "com.open.harmony.actsacewebpagedownloadtesttwo", "com.open.harmony.actsacewebpagesavingdevthreetest", "com.open.harmony.actsacewebpagesavingenhancedtest", "com.open.harmony.actsacewebpagesavingenhancedtestthree", "com.open.harmony.actsacewebpagesavingwebviewcontrollertest", "com.open.harmony.actsadvancedsecuritymodetest", "com.open.harmony.actsaudioplaytest", "com.open.harmony.actscontrolcentertest", "com.open.harmony.actsdeviceinfotest.static", "com.open.harmony.actsgraphicxtsdrawingtest.static", "com.open.harmony.actspasswordpaddingtest", "com.open.harmony.actsweberrorpagetest", "com.open.harmony.actswebnetworkproxytest", "com.open.harmony.actswebswitchcoretest", "com.open.harmony.actswebuseragentonetest", "com.open.harmony.advertisingfilteringonetest", "com.open.harmony.antitrackingonetest", "com.open.harmony.antitrackingtwotest", "com.open.harmony.basicrenderingtest", "com.open.harmony.crashinformationtest", "com.open.harmony.customdnsonetest", "com.open.harmony.customdnstwotest", "com.open.harmony.darkcolormodetest", "com.open.harmony.forwardbackwardcachefivetest", "com.open.harmony.forwardbackwardcachefourtest", "com.open.harmony.forwardbackwardcacheonetest", "com.open.harmony.forwardbackwardcachesixtest", "com.open.harmony.forwardbackwardcachethreetest", "com.open.harmony.forwardbackwardcachetwotest", "com.open.harmony.injectjavascriptonetest", "com.open.harmony.injectjavascriptthreetest", "com.open.harmony.injectjavascripttwotest", "com.open.harmony.inputdevicetest.Static", "com.open.harmony.leathercandycacheonetest", "com.open.harmony.leathercandycachetwotest", "com.open.harmony.logdottingfivetest", "com.open.harmony.logdottingfourtest", "com.open.harmony.logdottingninetest", "com.open.harmony.logdottingonetest", "com.open.harmony.logdottingseventest", "com.open.harmony.logdottingsixtest", "com.open.harmony.logdottingtentest", "com.open.harmony.logdottingthreetest", "com.open.harmony.logdottingtwotest", "com.open.harmony.modifiernowear", "com.open.harmony.multimedia.cameratest", "com.open.harmony.nowear.acetestcommenventapi20", "com.open.harmony.nowearevent", "com.open.harmony.openwebpagenapisenhanceonetest", "com.open.harmony.packagemag", "com.open.harmony.packagemag.enterprisetest", "com.open.harmony.packagemag.hmservice", "com.open.harmony.performanceMaintenancetest", "com.open.harmony.picker.api15", "com.open.harmony.pointertest.Static", "com.open.harmony.preloadlinkrendingcloudservicewebcontrollerfourtest", "com.open.harmony.preloadlinkrendingcloudservicewebcontrolleronetest", "com.open.harmony.preloadlinkrendingcloudservicewebcontrollerthreetest", "com.open.harmony.preloadlinkrendingcloudservicewebcontrollertwotest", "com.open.harmony.resourceinterceptioncloudservicefivetest", "com.open.harmony.resourceinterceptioncloudservicefourtest", "com.open.harmony.resourceinterceptioncloudserviceonetest", "com.open.harmony.resourceinterceptioncloudserviceseventest", "com.open.harmony.resourceinterceptioncloudservicesixtest", "com.open.harmony.resourceinterceptioncloudservicethreetest", "com.open.harmony.resourceinterceptioncloudservicetwotest", "com.open.harmony.runjavascripttest", "com.open.harmony.safeloadingonetest", "com.open.harmony.samelayerrenderingtest", "com.open.harmony.screencapturetest", "com.open.harmony.sendingmessagestoeachothertest", "com.open.harmony.settings", "com.open.harmony.settings.nop", "com.open.harmony.startAbility", "com.open.harmony.startAbilityForResult", "com.open.harmony.systemeventstest", "com.open.harmony.uploadanddownloadonetest", "com.open.harmony.uploadanddownloadthreetest", "com.open.harmony.uploadanddownloadtwotest", "com.open.harmony.videohostingfourtest", "com.open.harmony.videohostingonetest", "com.open.harmony.videohostingthreetest", "com.open.harmony.videohostingtwotest", "com.open.harmony.videoplaybackTwotest", "com.open.harmony.videoplaybacktest", "com.open.harmony.viewportprocessingtest", "com.open.harmony.webcamtest", "com.open.harmony.webcopypastetest", "com.open.harmony.webhostingcloudservicewebcontrolleronetest", "com.open.harmony.webhostingcloudservicewebcontrollertwotest", "com.open.harmony.webhostingnapisenhanceeighttest", "com.open.harmony.webhostingnapisenhancefivetest", "com.open.harmony.webhostingnapisenhancefourtest", "com.open.harmony.webhostingnapisenhanceninetest", "com.open.harmony.webhostingnapisenhanceonetest", "com.open.harmony.webhostingnapisenhanceseventest", "com.open.harmony.webhostingnapisenhancesixtest", "com.open.harmony.webhostingnapisenhancethreetest", "com.open.harmony.webhostingnapisenhancetwotest", "com.open.harmony.webpagedebugtest", "com.open.harmony.webpagefonttest", "com.open.harmony.webpagezoomrotatetest", "com.open.harmony.webpermissionsonetest", "com.open.harmony.webpermissionsthreetest", "com.open.harmony.webpermissionstwotest", "com.open.harmony.websitecertificatefivetest", "com.open.harmony.websitecertificatefourtest", "com.open.harmony.websitecertificateonetest", "com.open.harmony.websitecertificatethreetest", "com.open.harmony.websitecertificatetwotest", "com.openharmony.ActsAceCArkUI15XC", "com.openharmony.ace_c_scroll_crosslanguage", "com.openharmony.arkui_capi_inspector_xts_api16", "com.openharmony.arkui_capi_nowear_xts_api14", "com.openharmony.arkui_capi_nowear_xts_api15", "com.openharmony.arkui_capi_nowear_xts_api18", "com.openharmony.arkui_capi_nowear_xts_api19", "com.openharmony.arkui_capi_nowear_xts_api20", "com.openharmony.arkui_capi_xts", "com.openharmony.arkui_capi_xts.cropcase", "com.openharmony.arkui_capi_xts_api13", "com.openharmony.arkui_capi_xts_api14", "com.openharmony.arkui_capi_xts_api15", "com.openharmony.arkui_capi_xts_api151", "com.openharmony.arkui_capi_xts_api16", "com.openharmony.arkui_capi_xts_api17", "com.openharmony.arkui_capi_xts_api18", "com.openharmony.arkui_capi_xts_api19", "com.openharmony.arkui_capi_xts_api20", "com.openharmony.asset_xts_js", "com.openharmony.asset_xts_js_noright", "com.openharmony.asset_xts_ndk", "com.openharmony.certframework", "com.openharmony.certificate_manager_func", "com.openharmony.certificate_manager_notsystem_app", "com.openharmony.certificate_manager_permission", "com.openharmony.certificateframework", "com.openharmony.certificateframework2", "com.openharmony.cryptoFramework1", "com.openharmony.cryptoFramework2", "com.openharmony.cryptoFramework3", "com.openharmony.cryptoFramework41Api10", "com.openharmony.cryptoFramework50Api12", "com.openharmony.dlp_xts_normal", "com.openharmony.huksapi12", "com.openharmony.huksapi8", "com.openharmony.huksapi9", "com.pageInteraction.test", "com.pageInteractionFive.test", "com.pageInteractionFour.test", "com.pageInteractionOne.test", "com.pageInteractionSix.test", "com.pageInteractionThree.test", "com.pageInteractionTwo.test", "com.pageInteractionTwoscrollTwo.test", "com.pageInteractionTwoscrollingOne.test", "com.perftest.acts", "com.perftestScene.acts", "com.powermgr.ndk.test", "com.powermgr.permission.test", "com.rely.actsabilityerrcodequerytestrely2", "com.security.huks.napitest", "com.startup.init.napitest", "com.taskpool.sendable.standard.static", "com.test.actcontextmonitor", "com.test.actsabilityerrcodequerysecondtest", "com.test.actsabilityerrcodequerytest", "com.test.actslifecycletest", "com.test.actsrestartapptest", "com.test.actssandboxcontexttest", "com.test.actssetfontsizerely", "com.test.actssetfontsizetest", "com.test.actssetfonttest", "com.test.actsshareacquiresharedatarely", "com.test.actsshareacquiresharedatatest", "com.test.actsstartandterminatetest", "com.test.actsstartmanagertest", "com.test.actssystemapitestappmanager", "com.test.autostartupmanageone", "com.test.battery.static", "com.test.calendarManager", "com.test.display.static", "com.test.lifecycle_crossplatform_xts", "com.test.myapplication", "com.test.power.permission.static", "com.test.power.static", "com.test.thermal.static", "com.test.webGL", "com.test.window", "com.thirdparty.asan.napitest", "com.thirdparty.hwasan.napitest", "com.thirdparty.mindspore.napitest", "com.thirdparty.musl.napitest", "com.thirdparty.musl32.napitest", "com.thirdparty.tsan.napitest", "com.thirdparty.tsanmutexcheck1.napitest", "com.thirdparty.tsanmutexcheck2.napitest", "com.thirdparty.tsanmutexcheck3.napitest", "com.thirdparty.tsanmutexcheck4.napitest", "com.thirdparty.ubsan.napitest", "com.uitest.acts", "com.uitest.acts.static", "com.uitestScene.acts", "com.uri.standard.static", "com.url.standard.static", "com.webPageDocumentProcessing.test", "com.weblifecycleone.test", "com.weblifecyclethree.test", "com.weblifecycletwo.test", "com.wifi.napitest", "com.xml.standard.static", "liubea.com.myapplication.teststartapp", "ohos.abilityconstant.test", "ohos.acts.ActsDlpNDKTest", "ohos.acts.DataObjectPermission", "ohos.acts.RelationalStoreStage", "ohos.acts.UDMF", "ohos.acts.UDMFwithOutPermissiontest", "ohos.acts.UDMFwithPermissiontest", "ohos.acts.aafwk.test.faauxiliary", "ohos.acts.aafwk.test.faonandoffscreen", "ohos.acts.aafwk.test.fasupplement", "ohos.acts.aafwk.test.fasupportfunction", "ohos.acts.aafwk.test.fasupportfunctionthree", "ohos.acts.aafwk.test.stageonandoffscreen", "ohos.acts.aafwk.test.stagesupportfunction", "ohos.acts.account.nopermission", "ohos.acts.account.osaccount", "ohos.acts.actswificapioktest", "ohos.acts.applicationContextAssist", "ohos.acts.blutooth.nop.function", "ohos.acts.bms.getabilityinfo.test", "ohos.acts.bms.getlauncherabilityinfo.test", "ohos.acts.bms.getlauncherabilityinfo.test.static", "ohos.acts.bms.getlauncherabilityinfo2.test", "ohos.acts.bms.getlauncherabilityinfo2.test.static", "ohos.acts.bms.setshortcutvisibletest", "ohos.acts.bms.stage.test", "ohos.acts.bms.stage.test.static", "ohos.acts.bmszlib.checksum", "ohos.acts.bmszlib.checksum.static", "ohos.acts.build.ohosappdemo", "ohos.acts.bundle.overlay.test", "ohos.acts.bundle.overlay.test.static", "ohos.acts.bundle.stage.test", "ohos.acts.bundle.stage.test.static", "ohos.acts.bundle.test.static", "ohos.acts.bundlemanagererrcode.test", "ohos.acts.bundlemanagererrcode.test.enterprise", "ohos.acts.bundlemanagererrcode.test.static", "ohos.acts.communication.bluetooth.bluetoothhost", "ohos.acts.communication.net.manager.eap", "ohos.acts.communication.netstack.http.nop.function", "ohos.acts.communication.netstack.socket.nop.function", "ohos.acts.communication.nfc.nfcdevice", "ohos.acts.communication.wifi.manager.nop.function", "ohos.acts.communication.wifi.wifiSta", "ohos.acts.communication.wifi.wifidevice", "ohos.acts.dataObjectStage", "ohos.acts.dataSharejstest", "ohos.acts.device_manager.device_manager.function", "ohos.acts.device_manager.nopermission.function", "ohos.acts.distributedKvStore", "ohos.acts.distributeddatamgr.crossplatform.preferences.normal", "ohos.acts.distributeddatamgr.crossplatform.relationalstore.normal", "ohos.acts.distributedschedule.continuationmanager", "ohos.acts.distributedschedule.nop.continuationmanager", "ohos.acts.globalstage", "ohos.acts.hiviewdfx.hiappevent.function", "ohos.acts.hiviewdfx.hiappevent.function.static", "ohos.acts.hiviewdfx.hiappeventapm.function", "ohos.acts.hiviewdfx.hiappeventsub.function", "ohos.acts.hiviewdfx.hilog.function", "ohos.acts.hiviewdfx.hilog.function.static", "ohos.acts.hiviewdfx.hilogdomainoff.function", "ohos.acts.hiviewdfx.hilogdomainon.function", "ohos.acts.hiviewdfx.hisysevent.box.function", "ohos.acts.hiviewdfx.hisysevent.function", "ohos.acts.hiviewdfx.hisysevent.normalapp.function", "ohos.acts.hiviewdfx.hisysevent.ser.function", "ohos.acts.hiviewdfx.hitracechain.function", "ohos.acts.hiviewdfx.hitracechain.function.static", "ohos.acts.i18nStage", "ohos.acts.i18nStage.static", "ohos.acts.kvStore", "ohos.acts.location.geolocation.function", "ohos.acts.location.geolocation.function.nop", "ohos.acts.miscdevice.ndktest", "ohos.acts.multimedia.audio.audiocapturer", "ohos.acts.multimedia.audio.audiocapturerchangeInfo", "ohos.acts.multimedia.audio.audioeventmanagement", "ohos.acts.multimedia.audio.audiointerrupt", "ohos.acts.multimedia.audio.audiomanager", "ohos.acts.multimedia.audio.audioplayer", "ohos.acts.multimedia.audio.audiorecorder", "ohos.acts.multimedia.audio.audiorendererchangeInfo", "ohos.acts.multimedia.audio.audiovoip", "ohos.acts.multimedia.audio.avrecorder", "ohos.acts.multimedia.audio.recorderformat", "ohos.acts.multimedia.avimagegenerator", "ohos.acts.multimedia.avplayer", "ohos.acts.multimedia.avscreencapturerecorder", "ohos.acts.multimedia.camera.xts", "ohos.acts.multimedia.http.httpplayer", "ohos.acts.multimedia.image", "ohos.acts.multimedia.image.10bitPixelmap", "ohos.acts.multimedia.image.Colorspace", "ohos.acts.multimedia.image.Creator", "ohos.acts.multimedia.image.DecodeOptions", "ohos.acts.multimedia.image.Exif", "ohos.acts.multimedia.image.ModifyProperty", "ohos.acts.multimedia.image.Packing", "ohos.acts.multimedia.image.PackingToFile", "ohos.acts.multimedia.image.PixelMapFramework", "ohos.acts.multimedia.image.RGBA", "ohos.acts.multimedia.image.Raw", "ohos.acts.multimedia.image.Receiver", "ohos.acts.multimedia.image.ReceiverNdk", "ohos.acts.multimedia.image.Webp", "ohos.acts.multimedia.image.YUV", "ohos.acts.multimedia.image.colorSpaceTransfer", "ohos.acts.multimedia.image.image", "ohos.acts.multimedia.image.imageDecodeOptionsYuvRaw", "ohos.acts.multimedia.image.imageExifGetModify", "ohos.acts.multimedia.image.imageFormatTranscoding", "ohos.acts.multimedia.image.imageNdk", "ohos.acts.multimedia.image.imagePackToFileGif", "ohos.acts.multimedia.image.imagePackerExif", "ohos.acts.multimedia.image.imagePicture", "ohos.acts.multimedia.image.imagePicturePack", "ohos.acts.multimedia.image.imagePixelmap", "ohos.acts.multimedia.image.imagepixelMapSupportYuv", "ohos.acts.multimedia.image.imagequalityenhancement", "ohos.acts.multimedia.image.packerNDK", "ohos.acts.multimedia.image.pictureNdk", "ohos.acts.multimedia.image.receiverMultiThread", "ohos.acts.multimedia.image.sendableImageSource", "ohos.acts.multimedia.image.xts", "ohos.acts.multimedia.imageGetMimeType", "ohos.acts.multimedia.imagePixelMapNDK", "ohos.acts.multimedia.imageSourceNDK", "ohos.acts.multimedia.media.hlsplayer", "ohos.acts.multimedia.media.xts", "ohos.acts.multimedia.photoaccess", "ohos.acts.multimedia.photoaccess.xts", "ohos.acts.multimedia.video.videoplayer", "ohos.acts.multimodalinput.input", "ohos.acts.multimodalinputets.input", "ohos.acts.notification", "ohos.acts.notification.static", "ohos.acts.preferencesdatagroupidtest", "ohos.acts.preferencesjstest", "ohos.acts.preferencesndktest", "ohos.acts.rdbjstest", "ohos.acts.relationalstoredatagroupidtest", "ohos.acts.relationalstorejstest", "ohos.acts.relationalstorendktesthvigor", "ohos.acts.resourceschedule.deviceusagestatisticsjsunit.js.function", "ohos.acts.resourceschedule.reminderagent.js.function", "ohos.acts.resourceschedule.reminderagent.nop.function", "ohos.acts.resourceschedule.reminderagentMgr.js.function", "ohos.acts.resourceschedule.taskmgr.js.function", "ohos.acts.resourceschedule.taskmgr.nop.function", "ohos.acts.resourceschedule.workscheduler.js.function", "ohos.acts.security.access_token", "ohos.acts.security.access_token.normal", "ohos.acts.sensors.miscdevice.function", "ohos.acts.sensors.miscdevice.nop.function", "ohos.acts.sensors.sensor.function", "ohos.acts.sensors.sensor.nop.function", "ohos.acts.startup.js.function", "ohos.acts.startup.syscap.function", "ohos.acts.storage.backupextention", "ohos.acts.storage.backupextention.static", "ohos.acts.storage.environment", "ohos.acts.storage.environment.static", "ohos.acts.storage.file", "ohos.acts.storage.fileio", "ohos.acts.storage.fileioerror", "ohos.acts.storage.fileiov9", "ohos.acts.storage.fileiov9.static", "ohos.acts.storage.fileshare", "ohos.acts.storage.fileuri", "ohos.acts.storage.nopermission", "ohos.acts.storage.picker", "ohos.acts.storage.securitylabel", "ohos.acts.storage.securitylabel.static", "ohos.acts.storage.statfs", "ohos.acts.storage.statfs.static", "ohos.acts.udmfNdktest", "ohos.acts.usb.usb.function", "ohos.apprecovery.test", "ohos.audio.napitest", "ohos.bytrace.test", "ohos.faultloggerjs.test", "ohos.global.napitest", "ohos.hichecker.test", "ohos.hichecker.test.static", "ohos.hitracemeter.test", "ohos.hitracemeter.test.static", "ohos.image.napitest", "ohos.intl.test", "ohos.intl.test.static", "ohos.intl.test2.static", "ohos.resmgr.test", "ohos.resmgr.test.static"];

function yyOwn(obj, name) {
  if (obj === undefined || obj === null) return undefined;
  const d = Object.getOwnPropertyDescriptor(obj, name);
  return d && Object.prototype.hasOwnProperty.call(d, "value") ? d.value : undefined;
}

function yyState() {
  let state = yyOwn(globalThis, YY_PP_SLOT);
  if (!state) {
    state = { config: null, key: null, previous: undefined, installed: undefined };
    Object.defineProperty(globalThis, YY_PP_SLOT, { value: state, configurable: true });
  }
  return state;
}

function yyConfig(params) {
  const key = readParam(params, "ppKey");
  if (!key || key === "none") return null;
  const mode = readParam(params, "ppMode") || "proxy";
  if (["string", "numeric", "boolean", "proxy", "object", "array"].indexOf(mode) < 0) {
    ppLog("entry-invalid-mode", { mode });
    return null;
  }
  const config = {
    ppKey: key, ppMode: mode,
    ppActiveThen: String(readParam(params, "ppActiveThen") === "true"),
    ppStack: String(readParam(params, "ppStack") === "true")
  };
  Object.setPrototypeOf(config, null);
  return config;
}

export function installPPTaintFromArgs(params) {
  const config = yyConfig(params);
  if (!config) return false;
  const state = yyState();
  if (state.config && JSON.stringify(state.config) === JSON.stringify(config)) return true;
  // Reused auxiliary processes must not retain the preceding key or mode.
  if (state.config) {
    const current = Object.getOwnPropertyDescriptor(Object.prototype, state.key);
    if (!current || current.get !== state.installed.get || current.set !== state.installed.set) {
      ppLog("entry-config-conflict-restart-required", { previous: state.config, next: config });
      return false;
    }
    if (state.previous) Object.defineProperty(Object.prototype, state.key, state.previous);
    else delete Object.prototype[state.key];
    delete getInstalledMap()[keyToLogString(state.key)];
    state.config = null;
  }
  const key = toPropertyKey(config.ppKey);
  const previous = Object.getOwnPropertyDescriptor(Object.prototype, key);
  yyInstallOriginal(config);
  const installed = Object.getOwnPropertyDescriptor(Object.prototype, key);
  if (!installed || (previous && installed.get === previous.get && installed.set === previous.set)) {
    ppLog("entry-install-not-confirmed", { config });
    return false;
  }
  state.key = key;
  state.previous = previous;
  state.installed = installed;
  state.config = config;
  ppLog("entry-installed", config);
  return true;
}

export function yyBootstrapPPTaint(want, location) {
  try {
    const encoded = yyOwn(yyOwn(want, "parameters"), YY_PP_PARAM);
    if (typeof encoded === "string") {
      const params = JSON.parse(encoded);
      const ok = installPPTaintFromArgs(params);
      ppLog("entry-bootstrap", { location, configured: ok, source: "want" });
      return ok;
    }
    const configured = !!yyState().config;
    ppLog("entry-bootstrap", { location, configured, source: "realm" });
    return configured;
  } catch (error) {
    ppLog("entry-bootstrap-error", { location, error: String(error) });
    return false;
  }
}

// Clone without triggering an Object.prototype setter on a tainted key.
function yyCopyOwn(obj) {
  const copy = {};
  Object.keys(obj).forEach(function (key) {
    Object.defineProperty(copy, key, {
      value: obj[key], enumerable: true, configurable: true, writable: true
    });
  });
  return copy;
}

export function yyWithPPTaintWant(want, callerBundle) {
  try {
    const config = yyState().config;
    if (!config || !want || typeof want !== "object" || Array.isArray(want)) return want;
    const bundle = yyOwn(want, "bundleName");
    const ability = yyOwn(want, "abilityName");
    // Leave system/unknown/implicit/remote destinations unchanged.
    const target = bundle || (ability ? callerBundle : "");
    if (!target || YY_PP_BUNDLES.indexOf(target) < 0 || yyOwn(want, "deviceId")) return want;
    const oldParams = yyOwn(want, "parameters");
    if (oldParams !== undefined && (oldParams === null || typeof oldParams !== "object" || Array.isArray(oldParams))) {
      ppLog("want-forward-skip-invalid-parameters", { target });
      return want;
    }
    const copy = yyCopyOwn(want);
    const params = oldParams === undefined ? {} : yyCopyOwn(oldParams);
    Object.defineProperty(params, YY_PP_PARAM, {
      value: JSON.stringify(config), enumerable: true, writable: true, configurable: true
    });
    Object.defineProperty(copy, "parameters", {
      value: params, enumerable: true, writable: true, configurable: true
    });
    ppLog("want-forward", { target, ppKey: config.ppKey, ppMode: config.ppMode });
    return copy;
  } catch (error) {
    ppLog("want-forward-error", { error: String(error) });
    return want;
  }
}
