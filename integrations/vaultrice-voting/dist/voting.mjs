function Wv(z) {
  return z && z.__esModule && Object.prototype.hasOwnProperty.call(z, "default") ? z.default : z;
}
var ur = { exports: {} }, P = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sd;
function Fv() {
  if (sd) return P;
  sd = 1;
  var z = Symbol.for("react.transitional.element"), o = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), v = Symbol.for("react.profiler"), b = Symbol.for("react.consumer"), h = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), w = Symbol.iterator;
  function N(y) {
    return y === null || typeof y != "object" ? null : (y = w && y[w] || y["@@iterator"], typeof y == "function" ? y : null);
  }
  var H = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, q = Object.assign, I = {};
  function V(y, R, B) {
    this.props = y, this.context = R, this.refs = I, this.updater = B || H;
  }
  V.prototype.isReactComponent = {}, V.prototype.setState = function(y, R) {
    if (typeof y != "object" && typeof y != "function" && y != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, y, R, "setState");
  }, V.prototype.forceUpdate = function(y) {
    this.updater.enqueueForceUpdate(this, y, "forceUpdate");
  };
  function rt() {
  }
  rt.prototype = V.prototype;
  function tt(y, R, B) {
    this.props = y, this.context = R, this.refs = I, this.updater = B || H;
  }
  var ht = tt.prototype = new rt();
  ht.constructor = tt, q(ht, V.prototype), ht.isPureReactComponent = !0;
  var et = Array.isArray, G = { H: null, A: null, T: null, S: null, V: null }, J = Object.prototype.hasOwnProperty;
  function St(y, R, B, j, X, ft) {
    return B = ft.ref, {
      $$typeof: z,
      type: y,
      key: R,
      ref: B !== void 0 ? B : null,
      props: ft
    };
  }
  function Gt(y, R) {
    return St(
      y.type,
      R,
      void 0,
      void 0,
      void 0,
      y.props
    );
  }
  function At(y) {
    return typeof y == "object" && y !== null && y.$$typeof === z;
  }
  function wt(y) {
    var R = { "=": "=0", ":": "=2" };
    return "$" + y.replace(/[=:]/g, function(B) {
      return R[B];
    });
  }
  var ot = /\/+/g;
  function L(y, R) {
    return typeof y == "object" && y !== null && y.key != null ? wt("" + y.key) : R.toString(36);
  }
  function ve() {
  }
  function Tl(y) {
    switch (y.status) {
      case "fulfilled":
        return y.value;
      case "rejected":
        throw y.reason;
      default:
        switch (typeof y.status == "string" ? y.then(ve, ve) : (y.status = "pending", y.then(
          function(R) {
            y.status === "pending" && (y.status = "fulfilled", y.value = R);
          },
          function(R) {
            y.status === "pending" && (y.status = "rejected", y.reason = R);
          }
        )), y.status) {
          case "fulfilled":
            return y.value;
          case "rejected":
            throw y.reason;
        }
    }
    throw y;
  }
  function Kt(y, R, B, j, X) {
    var ft = typeof y;
    (ft === "undefined" || ft === "boolean") && (y = null);
    var W = !1;
    if (y === null) W = !0;
    else
      switch (ft) {
        case "bigint":
        case "string":
        case "number":
          W = !0;
          break;
        case "object":
          switch (y.$$typeof) {
            case z:
            case o:
              W = !0;
              break;
            case m:
              return W = y._init, Kt(
                W(y._payload),
                R,
                B,
                j,
                X
              );
          }
      }
    if (W)
      return X = X(y), W = j === "" ? "." + L(y, 0) : j, et(X) ? (B = "", W != null && (B = W.replace(ot, "$&/") + "/"), Kt(X, R, B, "", function(We) {
        return We;
      })) : X != null && (At(X) && (X = Gt(
        X,
        B + (X.key == null || y && y.key === X.key ? "" : ("" + X.key).replace(
          ot,
          "$&/"
        ) + "/") + W
      )), R.push(X)), 1;
    W = 0;
    var ae = j === "" ? "." : j + ":";
    if (et(y))
      for (var Ot = 0; Ot < y.length; Ot++)
        j = y[Ot], ft = ae + L(j, Ot), W += Kt(
          j,
          R,
          B,
          ft,
          X
        );
    else if (Ot = N(y), typeof Ot == "function")
      for (y = Ot.call(y), Ot = 0; !(j = y.next()).done; )
        j = j.value, ft = ae + L(j, Ot++), W += Kt(
          j,
          R,
          B,
          ft,
          X
        );
    else if (ft === "object") {
      if (typeof y.then == "function")
        return Kt(
          Tl(y),
          R,
          B,
          j,
          X
        );
      throw R = String(y), Error(
        "Objects are not valid as a React child (found: " + (R === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : R) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return W;
  }
  function D(y, R, B) {
    if (y == null) return y;
    var j = [], X = 0;
    return Kt(y, j, "", "", function(ft) {
      return R.call(B, ft, X++);
    }), j;
  }
  function Y(y) {
    if (y._status === -1) {
      var R = y._result;
      R = R(), R.then(
        function(B) {
          (y._status === 0 || y._status === -1) && (y._status = 1, y._result = B);
        },
        function(B) {
          (y._status === 0 || y._status === -1) && (y._status = 2, y._result = B);
        }
      ), y._status === -1 && (y._status = 0, y._result = R);
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var K = typeof reportError == "function" ? reportError : function(y) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var R = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y),
        error: y
      });
      if (!window.dispatchEvent(R)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", y);
      return;
    }
    console.error(y);
  };
  function xt() {
  }
  return P.Children = {
    map: D,
    forEach: function(y, R, B) {
      D(
        y,
        function() {
          R.apply(this, arguments);
        },
        B
      );
    },
    count: function(y) {
      var R = 0;
      return D(y, function() {
        R++;
      }), R;
    },
    toArray: function(y) {
      return D(y, function(R) {
        return R;
      }) || [];
    },
    only: function(y) {
      if (!At(y))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return y;
    }
  }, P.Component = V, P.Fragment = s, P.Profiler = v, P.PureComponent = tt, P.StrictMode = r, P.Suspense = g, P.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = G, P.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(y) {
      return G.H.useMemoCache(y);
    }
  }, P.cache = function(y) {
    return function() {
      return y.apply(null, arguments);
    };
  }, P.cloneElement = function(y, R, B) {
    if (y == null)
      throw Error(
        "The argument must be a React element, but you passed " + y + "."
      );
    var j = q({}, y.props), X = y.key, ft = void 0;
    if (R != null)
      for (W in R.ref !== void 0 && (ft = void 0), R.key !== void 0 && (X = "" + R.key), R)
        !J.call(R, W) || W === "key" || W === "__self" || W === "__source" || W === "ref" && R.ref === void 0 || (j[W] = R[W]);
    var W = arguments.length - 2;
    if (W === 1) j.children = B;
    else if (1 < W) {
      for (var ae = Array(W), Ot = 0; Ot < W; Ot++)
        ae[Ot] = arguments[Ot + 2];
      j.children = ae;
    }
    return St(y.type, X, void 0, void 0, ft, j);
  }, P.createContext = function(y) {
    return y = {
      $$typeof: h,
      _currentValue: y,
      _currentValue2: y,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, y.Provider = y, y.Consumer = {
      $$typeof: b,
      _context: y
    }, y;
  }, P.createElement = function(y, R, B) {
    var j, X = {}, ft = null;
    if (R != null)
      for (j in R.key !== void 0 && (ft = "" + R.key), R)
        J.call(R, j) && j !== "key" && j !== "__self" && j !== "__source" && (X[j] = R[j]);
    var W = arguments.length - 2;
    if (W === 1) X.children = B;
    else if (1 < W) {
      for (var ae = Array(W), Ot = 0; Ot < W; Ot++)
        ae[Ot] = arguments[Ot + 2];
      X.children = ae;
    }
    if (y && y.defaultProps)
      for (j in W = y.defaultProps, W)
        X[j] === void 0 && (X[j] = W[j]);
    return St(y, ft, void 0, void 0, null, X);
  }, P.createRef = function() {
    return { current: null };
  }, P.forwardRef = function(y) {
    return { $$typeof: T, render: y };
  }, P.isValidElement = At, P.lazy = function(y) {
    return {
      $$typeof: m,
      _payload: { _status: -1, _result: y },
      _init: Y
    };
  }, P.memo = function(y, R) {
    return {
      $$typeof: f,
      type: y,
      compare: R === void 0 ? null : R
    };
  }, P.startTransition = function(y) {
    var R = G.T, B = {};
    G.T = B;
    try {
      var j = y(), X = G.S;
      X !== null && X(B, j), typeof j == "object" && j !== null && typeof j.then == "function" && j.then(xt, K);
    } catch (ft) {
      K(ft);
    } finally {
      G.T = R;
    }
  }, P.unstable_useCacheRefresh = function() {
    return G.H.useCacheRefresh();
  }, P.use = function(y) {
    return G.H.use(y);
  }, P.useActionState = function(y, R, B) {
    return G.H.useActionState(y, R, B);
  }, P.useCallback = function(y, R) {
    return G.H.useCallback(y, R);
  }, P.useContext = function(y) {
    return G.H.useContext(y);
  }, P.useDebugValue = function() {
  }, P.useDeferredValue = function(y, R) {
    return G.H.useDeferredValue(y, R);
  }, P.useEffect = function(y, R, B) {
    var j = G.H;
    if (typeof B == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return j.useEffect(y, R);
  }, P.useId = function() {
    return G.H.useId();
  }, P.useImperativeHandle = function(y, R, B) {
    return G.H.useImperativeHandle(y, R, B);
  }, P.useInsertionEffect = function(y, R) {
    return G.H.useInsertionEffect(y, R);
  }, P.useLayoutEffect = function(y, R) {
    return G.H.useLayoutEffect(y, R);
  }, P.useMemo = function(y, R) {
    return G.H.useMemo(y, R);
  }, P.useOptimistic = function(y, R) {
    return G.H.useOptimistic(y, R);
  }, P.useReducer = function(y, R, B) {
    return G.H.useReducer(y, R, B);
  }, P.useRef = function(y) {
    return G.H.useRef(y);
  }, P.useState = function(y) {
    return G.H.useState(y);
  }, P.useSyncExternalStore = function(y, R, B) {
    return G.H.useSyncExternalStore(
      y,
      R,
      B
    );
  }, P.useTransition = function() {
    return G.H.useTransition();
  }, P.version = "19.1.1", P;
}
var fd;
function gr() {
  return fd || (fd = 1, ur.exports = Fv()), ur.exports;
}
var ne = gr();
const Iv = /* @__PURE__ */ Wv(ne);
var cr = { exports: {} }, wa = {}, rr = { exports: {} }, or = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dd;
function Pv() {
  return dd || (dd = 1, function(z) {
    function o(D, Y) {
      var K = D.length;
      D.push(Y);
      t: for (; 0 < K; ) {
        var xt = K - 1 >>> 1, y = D[xt];
        if (0 < v(y, Y))
          D[xt] = Y, D[K] = y, K = xt;
        else break t;
      }
    }
    function s(D) {
      return D.length === 0 ? null : D[0];
    }
    function r(D) {
      if (D.length === 0) return null;
      var Y = D[0], K = D.pop();
      if (K !== Y) {
        D[0] = K;
        t: for (var xt = 0, y = D.length, R = y >>> 1; xt < R; ) {
          var B = 2 * (xt + 1) - 1, j = D[B], X = B + 1, ft = D[X];
          if (0 > v(j, K))
            X < y && 0 > v(ft, j) ? (D[xt] = ft, D[X] = K, xt = X) : (D[xt] = j, D[B] = K, xt = B);
          else if (X < y && 0 > v(ft, K))
            D[xt] = ft, D[X] = K, xt = X;
          else break t;
        }
      }
      return Y;
    }
    function v(D, Y) {
      var K = D.sortIndex - Y.sortIndex;
      return K !== 0 ? K : D.id - Y.id;
    }
    if (z.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var b = performance;
      z.unstable_now = function() {
        return b.now();
      };
    } else {
      var h = Date, T = h.now();
      z.unstable_now = function() {
        return h.now() - T;
      };
    }
    var g = [], f = [], m = 1, w = null, N = 3, H = !1, q = !1, I = !1, V = !1, rt = typeof setTimeout == "function" ? setTimeout : null, tt = typeof clearTimeout == "function" ? clearTimeout : null, ht = typeof setImmediate != "undefined" ? setImmediate : null;
    function et(D) {
      for (var Y = s(f); Y !== null; ) {
        if (Y.callback === null) r(f);
        else if (Y.startTime <= D)
          r(f), Y.sortIndex = Y.expirationTime, o(g, Y);
        else break;
        Y = s(f);
      }
    }
    function G(D) {
      if (I = !1, et(D), !q)
        if (s(g) !== null)
          q = !0, J || (J = !0, L());
        else {
          var Y = s(f);
          Y !== null && Kt(G, Y.startTime - D);
        }
    }
    var J = !1, St = -1, Gt = 5, At = -1;
    function wt() {
      return V ? !0 : !(z.unstable_now() - At < Gt);
    }
    function ot() {
      if (V = !1, J) {
        var D = z.unstable_now();
        At = D;
        var Y = !0;
        try {
          t: {
            q = !1, I && (I = !1, tt(St), St = -1), H = !0;
            var K = N;
            try {
              e: {
                for (et(D), w = s(g); w !== null && !(w.expirationTime > D && wt()); ) {
                  var xt = w.callback;
                  if (typeof xt == "function") {
                    w.callback = null, N = w.priorityLevel;
                    var y = xt(
                      w.expirationTime <= D
                    );
                    if (D = z.unstable_now(), typeof y == "function") {
                      w.callback = y, et(D), Y = !0;
                      break e;
                    }
                    w === s(g) && r(g), et(D);
                  } else r(g);
                  w = s(g);
                }
                if (w !== null) Y = !0;
                else {
                  var R = s(f);
                  R !== null && Kt(
                    G,
                    R.startTime - D
                  ), Y = !1;
                }
              }
              break t;
            } finally {
              w = null, N = K, H = !1;
            }
            Y = void 0;
          }
        } finally {
          Y ? L() : J = !1;
        }
      }
    }
    var L;
    if (typeof ht == "function")
      L = function() {
        ht(ot);
      };
    else if (typeof MessageChannel != "undefined") {
      var ve = new MessageChannel(), Tl = ve.port2;
      ve.port1.onmessage = ot, L = function() {
        Tl.postMessage(null);
      };
    } else
      L = function() {
        rt(ot, 0);
      };
    function Kt(D, Y) {
      St = rt(function() {
        D(z.unstable_now());
      }, Y);
    }
    z.unstable_IdlePriority = 5, z.unstable_ImmediatePriority = 1, z.unstable_LowPriority = 4, z.unstable_NormalPriority = 3, z.unstable_Profiling = null, z.unstable_UserBlockingPriority = 2, z.unstable_cancelCallback = function(D) {
      D.callback = null;
    }, z.unstable_forceFrameRate = function(D) {
      0 > D || 125 < D ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Gt = 0 < D ? Math.floor(1e3 / D) : 5;
    }, z.unstable_getCurrentPriorityLevel = function() {
      return N;
    }, z.unstable_next = function(D) {
      switch (N) {
        case 1:
        case 2:
        case 3:
          var Y = 3;
          break;
        default:
          Y = N;
      }
      var K = N;
      N = Y;
      try {
        return D();
      } finally {
        N = K;
      }
    }, z.unstable_requestPaint = function() {
      V = !0;
    }, z.unstable_runWithPriority = function(D, Y) {
      switch (D) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          D = 3;
      }
      var K = N;
      N = D;
      try {
        return Y();
      } finally {
        N = K;
      }
    }, z.unstable_scheduleCallback = function(D, Y, K) {
      var xt = z.unstable_now();
      switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? xt + K : xt) : K = xt, D) {
        case 1:
          var y = -1;
          break;
        case 2:
          y = 250;
          break;
        case 5:
          y = 1073741823;
          break;
        case 4:
          y = 1e4;
          break;
        default:
          y = 5e3;
      }
      return y = K + y, D = {
        id: m++,
        callback: Y,
        priorityLevel: D,
        startTime: K,
        expirationTime: y,
        sortIndex: -1
      }, K > xt ? (D.sortIndex = K, o(f, D), s(g) === null && D === s(f) && (I ? (tt(St), St = -1) : I = !0, Kt(G, K - xt))) : (D.sortIndex = y, o(g, D), q || H || (q = !0, J || (J = !0, L()))), D;
    }, z.unstable_shouldYield = wt, z.unstable_wrapCallback = function(D) {
      var Y = N;
      return function() {
        var K = N;
        N = Y;
        try {
          return D.apply(this, arguments);
        } finally {
          N = K;
        }
      };
    };
  }(or)), or;
}
var hd;
function t0() {
  return hd || (hd = 1, rr.exports = Pv()), rr.exports;
}
var sr = { exports: {} }, Wt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vd;
function e0() {
  if (vd) return Wt;
  vd = 1;
  var z = gr();
  function o(g) {
    var f = "https://react.dev/errors/" + g;
    if (1 < arguments.length) {
      f += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var m = 2; m < arguments.length; m++)
        f += "&args[]=" + encodeURIComponent(arguments[m]);
    }
    return "Minified React error #" + g + "; visit " + f + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function s() {
  }
  var r = {
    d: {
      f: s,
      r: function() {
        throw Error(o(522));
      },
      D: s,
      C: s,
      L: s,
      m: s,
      X: s,
      S: s,
      M: s
    },
    p: 0,
    findDOMNode: null
  }, v = Symbol.for("react.portal");
  function b(g, f, m) {
    var w = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: v,
      key: w == null ? null : "" + w,
      children: g,
      containerInfo: f,
      implementation: m
    };
  }
  var h = z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function T(g, f) {
    if (g === "font") return "";
    if (typeof f == "string")
      return f === "use-credentials" ? f : "";
  }
  return Wt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, Wt.createPortal = function(g, f) {
    var m = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!f || f.nodeType !== 1 && f.nodeType !== 9 && f.nodeType !== 11)
      throw Error(o(299));
    return b(g, f, null, m);
  }, Wt.flushSync = function(g) {
    var f = h.T, m = r.p;
    try {
      if (h.T = null, r.p = 2, g) return g();
    } finally {
      h.T = f, r.p = m, r.d.f();
    }
  }, Wt.preconnect = function(g, f) {
    typeof g == "string" && (f ? (f = f.crossOrigin, f = typeof f == "string" ? f === "use-credentials" ? f : "" : void 0) : f = null, r.d.C(g, f));
  }, Wt.prefetchDNS = function(g) {
    typeof g == "string" && r.d.D(g);
  }, Wt.preinit = function(g, f) {
    if (typeof g == "string" && f && typeof f.as == "string") {
      var m = f.as, w = T(m, f.crossOrigin), N = typeof f.integrity == "string" ? f.integrity : void 0, H = typeof f.fetchPriority == "string" ? f.fetchPriority : void 0;
      m === "style" ? r.d.S(
        g,
        typeof f.precedence == "string" ? f.precedence : void 0,
        {
          crossOrigin: w,
          integrity: N,
          fetchPriority: H
        }
      ) : m === "script" && r.d.X(g, {
        crossOrigin: w,
        integrity: N,
        fetchPriority: H,
        nonce: typeof f.nonce == "string" ? f.nonce : void 0
      });
    }
  }, Wt.preinitModule = function(g, f) {
    if (typeof g == "string")
      if (typeof f == "object" && f !== null) {
        if (f.as == null || f.as === "script") {
          var m = T(
            f.as,
            f.crossOrigin
          );
          r.d.M(g, {
            crossOrigin: m,
            integrity: typeof f.integrity == "string" ? f.integrity : void 0,
            nonce: typeof f.nonce == "string" ? f.nonce : void 0
          });
        }
      } else f == null && r.d.M(g);
  }, Wt.preload = function(g, f) {
    if (typeof g == "string" && typeof f == "object" && f !== null && typeof f.as == "string") {
      var m = f.as, w = T(m, f.crossOrigin);
      r.d.L(g, m, {
        crossOrigin: w,
        integrity: typeof f.integrity == "string" ? f.integrity : void 0,
        nonce: typeof f.nonce == "string" ? f.nonce : void 0,
        type: typeof f.type == "string" ? f.type : void 0,
        fetchPriority: typeof f.fetchPriority == "string" ? f.fetchPriority : void 0,
        referrerPolicy: typeof f.referrerPolicy == "string" ? f.referrerPolicy : void 0,
        imageSrcSet: typeof f.imageSrcSet == "string" ? f.imageSrcSet : void 0,
        imageSizes: typeof f.imageSizes == "string" ? f.imageSizes : void 0,
        media: typeof f.media == "string" ? f.media : void 0
      });
    }
  }, Wt.preloadModule = function(g, f) {
    if (typeof g == "string")
      if (f) {
        var m = T(f.as, f.crossOrigin);
        r.d.m(g, {
          as: typeof f.as == "string" && f.as !== "script" ? f.as : void 0,
          crossOrigin: m,
          integrity: typeof f.integrity == "string" ? f.integrity : void 0
        });
      } else r.d.m(g);
  }, Wt.requestFormReset = function(g) {
    r.d.r(g);
  }, Wt.unstable_batchedUpdates = function(g, f) {
    return g(f);
  }, Wt.useFormState = function(g, f, m) {
    return h.H.useFormState(g, f, m);
  }, Wt.useFormStatus = function() {
    return h.H.useHostTransitionStatus();
  }, Wt.version = "19.1.1", Wt;
}
var gd;
function l0() {
  if (gd) return sr.exports;
  gd = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (o) {
        console.error(o);
      }
  }
  return z(), sr.exports = e0(), sr.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yd;
function n0() {
  if (yd) return wa;
  yd = 1;
  var z = t0(), o = gr(), s = l0();
  function r(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        e += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function v(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function b(t) {
    var e = t, l = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do
        e = t, (e.flags & 4098) !== 0 && (l = e.return), t = e.return;
      while (t);
    }
    return e.tag === 3 ? l : null;
  }
  function h(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function T(t) {
    if (b(t) !== t)
      throw Error(r(188));
  }
  function g(t) {
    var e = t.alternate;
    if (!e) {
      if (e = b(t), e === null) throw Error(r(188));
      return e !== t ? null : t;
    }
    for (var l = t, n = e; ; ) {
      var a = l.return;
      if (a === null) break;
      var i = a.alternate;
      if (i === null) {
        if (n = a.return, n !== null) {
          l = n;
          continue;
        }
        break;
      }
      if (a.child === i.child) {
        for (i = a.child; i; ) {
          if (i === l) return T(a), t;
          if (i === n) return T(a), e;
          i = i.sibling;
        }
        throw Error(r(188));
      }
      if (l.return !== n.return) l = a, n = i;
      else {
        for (var u = !1, c = a.child; c; ) {
          if (c === l) {
            u = !0, l = a, n = i;
            break;
          }
          if (c === n) {
            u = !0, n = a, l = i;
            break;
          }
          c = c.sibling;
        }
        if (!u) {
          for (c = i.child; c; ) {
            if (c === l) {
              u = !0, l = i, n = a;
              break;
            }
            if (c === n) {
              u = !0, n = i, l = a;
              break;
            }
            c = c.sibling;
          }
          if (!u) throw Error(r(189));
        }
      }
      if (l.alternate !== n) throw Error(r(190));
    }
    if (l.tag !== 3) throw Error(r(188));
    return l.stateNode.current === l ? t : e;
  }
  function f(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = f(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  var m = Object.assign, w = Symbol.for("react.element"), N = Symbol.for("react.transitional.element"), H = Symbol.for("react.portal"), q = Symbol.for("react.fragment"), I = Symbol.for("react.strict_mode"), V = Symbol.for("react.profiler"), rt = Symbol.for("react.provider"), tt = Symbol.for("react.consumer"), ht = Symbol.for("react.context"), et = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), J = Symbol.for("react.suspense_list"), St = Symbol.for("react.memo"), Gt = Symbol.for("react.lazy"), At = Symbol.for("react.activity"), wt = Symbol.for("react.memo_cache_sentinel"), ot = Symbol.iterator;
  function L(t) {
    return t === null || typeof t != "object" ? null : (t = ot && t[ot] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var ve = Symbol.for("react.client.reference");
  function Tl(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === ve ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case q:
        return "Fragment";
      case V:
        return "Profiler";
      case I:
        return "StrictMode";
      case G:
        return "Suspense";
      case J:
        return "SuspenseList";
      case At:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case H:
          return "Portal";
        case ht:
          return (t.displayName || "Context") + ".Provider";
        case tt:
          return (t._context.displayName || "Context") + ".Consumer";
        case et:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case St:
          return e = t.displayName || null, e !== null ? e : Tl(t.type) || "Memo";
        case Gt:
          e = t._payload, t = t._init;
          try {
            return Tl(t(e));
          } catch (l) {
          }
      }
    return null;
  }
  var Kt = Array.isArray, D = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, xt = [], y = -1;
  function R(t) {
    return { current: t };
  }
  function B(t) {
    0 > y || (t.current = xt[y], xt[y] = null, y--);
  }
  function j(t, e) {
    y++, xt[y] = t.current, t.current = e;
  }
  var X = R(null), ft = R(null), W = R(null), ae = R(null);
  function Ot(t, e) {
    switch (j(W, e), j(ft, t), j(X, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? Bf(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = Bf(e), t = kf(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    B(X), j(X, t);
  }
  function We() {
    B(X), B(ft), B(W);
  }
  function Qi(t) {
    t.memoizedState !== null && j(ae, t);
    var e = X.current, l = kf(e, t.type);
    e !== l && (j(ft, t), j(X, l));
  }
  function _a(t) {
    ft.current === t && (B(X), B(ft)), ae.current === t && (B(ae), Ea._currentValue = K);
  }
  var Zi = Object.prototype.hasOwnProperty, Ki = z.unstable_scheduleCallback, Ji = z.unstable_cancelCallback, Md = z.unstable_shouldYield, Dd = z.unstable_requestPaint, De = z.unstable_now, _d = z.unstable_getCurrentPriorityLevel, yr = z.unstable_ImmediatePriority, pr = z.unstable_UserBlockingPriority, Na = z.unstable_NormalPriority, Nd = z.unstable_LowPriority, mr = z.unstable_IdlePriority, Ud = z.log, Rd = z.unstable_setDisableYieldValue, _n = null, ie = null;
  function Fe(t) {
    if (typeof Ud == "function" && Rd(t), ie && typeof ie.setStrictMode == "function")
      try {
        ie.setStrictMode(_n, t);
      } catch (e) {
      }
  }
  var ue = Math.clz32 ? Math.clz32 : jd, Hd = Math.log, qd = Math.LN2;
  function jd(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (Hd(t) / qd | 0) | 0;
  }
  var Ua = 256, Ra = 4194304;
  function Al(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Ha(t, e, l) {
    var n = t.pendingLanes;
    if (n === 0) return 0;
    var a = 0, i = t.suspendedLanes, u = t.pingedLanes;
    t = t.warmLanes;
    var c = n & 134217727;
    return c !== 0 ? (n = c & ~i, n !== 0 ? a = Al(n) : (u &= c, u !== 0 ? a = Al(u) : l || (l = c & ~t, l !== 0 && (a = Al(l))))) : (c = n & ~i, c !== 0 ? a = Al(c) : u !== 0 ? a = Al(u) : l || (l = n & ~t, l !== 0 && (a = Al(l)))), a === 0 ? 0 : e !== 0 && e !== a && (e & i) === 0 && (i = a & -a, l = e & -e, i >= l || i === 32 && (l & 4194048) !== 0) ? e : a;
  }
  function Nn(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Yd(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function br() {
    var t = Ua;
    return Ua <<= 1, (Ua & 4194048) === 0 && (Ua = 256), t;
  }
  function Sr() {
    var t = Ra;
    return Ra <<= 1, (Ra & 62914560) === 0 && (Ra = 4194304), t;
  }
  function $i(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function Un(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function Bd(t, e, l, n, a, i) {
    var u = t.pendingLanes;
    t.pendingLanes = l, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= l, t.entangledLanes &= l, t.errorRecoveryDisabledLanes &= l, t.shellSuspendCounter = 0;
    var c = t.entanglements, d = t.expirationTimes, E = t.hiddenUpdates;
    for (l = u & ~l; 0 < l; ) {
      var M = 31 - ue(l), U = 1 << M;
      c[M] = 0, d[M] = -1;
      var A = E[M];
      if (A !== null)
        for (E[M] = null, M = 0; M < A.length; M++) {
          var O = A[M];
          O !== null && (O.lane &= -536870913);
        }
      l &= ~U;
    }
    n !== 0 && xr(t, n, 0), i !== 0 && a === 0 && t.tag !== 0 && (t.suspendedLanes |= i & ~(u & ~e));
  }
  function xr(t, e, l) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var n = 31 - ue(e);
    t.entangledLanes |= e, t.entanglements[n] = t.entanglements[n] | 1073741824 | l & 4194090;
  }
  function Er(t, e) {
    var l = t.entangledLanes |= e;
    for (t = t.entanglements; l; ) {
      var n = 31 - ue(l), a = 1 << n;
      a & e | t[n] & e && (t[n] |= e), l &= ~a;
    }
  }
  function Wi(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Fi(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Tr() {
    var t = Y.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : ad(t.type));
  }
  function kd(t, e) {
    var l = Y.p;
    try {
      return Y.p = t, e();
    } finally {
      Y.p = l;
    }
  }
  var Ie = Math.random().toString(36).slice(2), Jt = "__reactFiber$" + Ie, It = "__reactProps$" + Ie, Xl = "__reactContainer$" + Ie, Ii = "__reactEvents$" + Ie, Cd = "__reactListeners$" + Ie, Vd = "__reactHandles$" + Ie, Ar = "__reactResources$" + Ie, Rn = "__reactMarker$" + Ie;
  function Pi(t) {
    delete t[Jt], delete t[It], delete t[Ii], delete t[Cd], delete t[Vd];
  }
  function Ql(t) {
    var e = t[Jt];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if (e = l[Xl] || l[Jt]) {
        if (l = e.alternate, e.child !== null || l !== null && l.child !== null)
          for (t = Lf(t); t !== null; ) {
            if (l = t[Jt]) return l;
            t = Lf(t);
          }
        return e;
      }
      t = l, l = t.parentNode;
    }
    return null;
  }
  function Zl(t) {
    if (t = t[Jt] || t[Xl]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function Hn(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(r(33));
  }
  function Kl(t) {
    var e = t[Ar];
    return e || (e = t[Ar] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function Bt(t) {
    t[Rn] = !0;
  }
  var Or = /* @__PURE__ */ new Set(), zr = {};
  function Ol(t, e) {
    Jl(t, e), Jl(t + "Capture", e);
  }
  function Jl(t, e) {
    for (zr[t] = e, t = 0; t < e.length; t++)
      Or.add(e[t]);
  }
  var Gd = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), wr = {}, Mr = {};
  function Ld(t) {
    return Zi.call(Mr, t) ? !0 : Zi.call(wr, t) ? !1 : Gd.test(t) ? Mr[t] = !0 : (wr[t] = !0, !1);
  }
  function qa(t, e, l) {
    if (Ld(e))
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var n = e.toLowerCase().slice(0, 5);
            if (n !== "data-" && n !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + l);
      }
  }
  function ja(t, e, l) {
    if (l === null) t.removeAttribute(e);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + l);
    }
  }
  function qe(t, e, l, n) {
    if (n === null) t.removeAttribute(l);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(l);
          return;
      }
      t.setAttributeNS(e, l, "" + n);
    }
  }
  var tu, Dr;
  function $l(t) {
    if (tu === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        tu = e && e[1] || "", Dr = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + tu + t + Dr;
  }
  var eu = !1;
  function lu(t, e) {
    if (!t || eu) return "";
    eu = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var n = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var U = function() {
                throw Error();
              };
              if (Object.defineProperty(U.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(U, []);
                } catch (O) {
                  var A = O;
                }
                Reflect.construct(t, [], U);
              } else {
                try {
                  U.call();
                } catch (O) {
                  A = O;
                }
                t.call(U.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (O) {
                A = O;
              }
              (U = t()) && typeof U.catch == "function" && U.catch(function() {
              });
            }
          } catch (O) {
            if (O && A && typeof O.stack == "string")
              return [O.stack, A.stack];
          }
          return [null, null];
        }
      };
      n.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var a = Object.getOwnPropertyDescriptor(
        n.DetermineComponentFrameRoot,
        "name"
      );
      a && a.configurable && Object.defineProperty(
        n.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var i = n.DetermineComponentFrameRoot(), u = i[0], c = i[1];
      if (u && c) {
        var d = u.split(`
`), E = c.split(`
`);
        for (a = n = 0; n < d.length && !d[n].includes("DetermineComponentFrameRoot"); )
          n++;
        for (; a < E.length && !E[a].includes(
          "DetermineComponentFrameRoot"
        ); )
          a++;
        if (n === d.length || a === E.length)
          for (n = d.length - 1, a = E.length - 1; 1 <= n && 0 <= a && d[n] !== E[a]; )
            a--;
        for (; 1 <= n && 0 <= a; n--, a--)
          if (d[n] !== E[a]) {
            if (n !== 1 || a !== 1)
              do
                if (n--, a--, 0 > a || d[n] !== E[a]) {
                  var M = `
` + d[n].replace(" at new ", " at ");
                  return t.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", t.displayName)), M;
                }
              while (1 <= n && 0 <= a);
            break;
          }
      }
    } finally {
      eu = !1, Error.prepareStackTrace = l;
    }
    return (l = t ? t.displayName || t.name : "") ? $l(l) : "";
  }
  function Xd(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return $l(t.type);
      case 16:
        return $l("Lazy");
      case 13:
        return $l("Suspense");
      case 19:
        return $l("SuspenseList");
      case 0:
      case 15:
        return lu(t.type, !1);
      case 11:
        return lu(t.type.render, !1);
      case 1:
        return lu(t.type, !0);
      case 31:
        return $l("Activity");
      default:
        return "";
    }
  }
  function _r(t) {
    try {
      var e = "";
      do
        e += Xd(t), t = t.return;
      while (t);
      return e;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function ge(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Nr(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function Qd(t) {
    var e = Nr(t) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    ), n = "" + t[e];
    if (!t.hasOwnProperty(e) && typeof l != "undefined" && typeof l.get == "function" && typeof l.set == "function") {
      var a = l.get, i = l.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return a.call(this);
        },
        set: function(u) {
          n = "" + u, i.call(this, u);
        }
      }), Object.defineProperty(t, e, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(u) {
          n = "" + u;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Ya(t) {
    t._valueTracker || (t._valueTracker = Qd(t));
  }
  function Ur(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(), n = "";
    return t && (n = Nr(t) ? t.checked ? "true" : "false" : t.value), t = n, t !== l ? (e.setValue(t), !0) : !1;
  }
  function Ba(t) {
    if (t = t || (typeof document != "undefined" ? document : void 0), typeof t == "undefined") return null;
    try {
      return t.activeElement || t.body;
    } catch (e) {
      return t.body;
    }
  }
  var Zd = /[\n"\\]/g;
  function ye(t) {
    return t.replace(
      Zd,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function nu(t, e, l, n, a, i, u, c) {
    t.name = "", u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" ? t.type = u : t.removeAttribute("type"), e != null ? u === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + ge(e)) : t.value !== "" + ge(e) && (t.value = "" + ge(e)) : u !== "submit" && u !== "reset" || t.removeAttribute("value"), e != null ? au(t, u, ge(e)) : l != null ? au(t, u, ge(l)) : n != null && t.removeAttribute("value"), a == null && i != null && (t.defaultChecked = !!i), a != null && (t.checked = a && typeof a != "function" && typeof a != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.name = "" + ge(c) : t.removeAttribute("name");
  }
  function Rr(t, e, l, n, a, i, u, c) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (t.type = i), e != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || e != null))
        return;
      l = l != null ? "" + ge(l) : "", e = e != null ? "" + ge(e) : l, c || e === t.value || (t.value = e), t.defaultValue = e;
    }
    n = n != null ? n : a, n = typeof n != "function" && typeof n != "symbol" && !!n, t.checked = c ? t.checked : !!n, t.defaultChecked = !!n, u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (t.name = u);
  }
  function au(t, e, l) {
    e === "number" && Ba(t.ownerDocument) === t || t.defaultValue === "" + l || (t.defaultValue = "" + l);
  }
  function Wl(t, e, l, n) {
    if (t = t.options, e) {
      e = {};
      for (var a = 0; a < l.length; a++)
        e["$" + l[a]] = !0;
      for (l = 0; l < t.length; l++)
        a = e.hasOwnProperty("$" + t[l].value), t[l].selected !== a && (t[l].selected = a), a && n && (t[l].defaultSelected = !0);
    } else {
      for (l = "" + ge(l), e = null, a = 0; a < t.length; a++) {
        if (t[a].value === l) {
          t[a].selected = !0, n && (t[a].defaultSelected = !0);
          return;
        }
        e !== null || t[a].disabled || (e = t[a]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function Hr(t, e, l) {
    if (e != null && (e = "" + ge(e), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? "" + ge(l) : "";
  }
  function qr(t, e, l, n) {
    if (e == null) {
      if (n != null) {
        if (l != null) throw Error(r(92));
        if (Kt(n)) {
          if (1 < n.length) throw Error(r(93));
          n = n[0];
        }
        l = n;
      }
      l == null && (l = ""), e = l;
    }
    l = ge(e), t.defaultValue = l, n = t.textContent, n === l && n !== "" && n !== null && (t.value = n);
  }
  function Fl(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Kd = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function jr(t, e, l) {
    var n = e.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? n ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : n ? t.setProperty(e, l) : typeof l != "number" || l === 0 || Kd.has(e) ? e === "float" ? t.cssFloat = l : t[e] = ("" + l).trim() : t[e] = l + "px";
  }
  function Yr(t, e, l) {
    if (e != null && typeof e != "object")
      throw Error(r(62));
    if (t = t.style, l != null) {
      for (var n in l)
        !l.hasOwnProperty(n) || e != null && e.hasOwnProperty(n) || (n.indexOf("--") === 0 ? t.setProperty(n, "") : n === "float" ? t.cssFloat = "" : t[n] = "");
      for (var a in e)
        n = e[a], e.hasOwnProperty(a) && l[a] !== n && jr(t, a, n);
    } else
      for (var i in e)
        e.hasOwnProperty(i) && jr(t, i, e[i]);
  }
  function iu(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Jd = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), $d = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function ka(t) {
    return $d.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  var uu = null;
  function cu(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var Il = null, Pl = null;
  function Br(t) {
    var e = Zl(t);
    if (e && (t = e.stateNode)) {
      var l = t[It] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (nu(
            t,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), e = l.name, l.type === "radio" && e != null) {
            for (l = t; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + ye(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < l.length; e++) {
              var n = l[e];
              if (n !== t && n.form === t.form) {
                var a = n[It] || null;
                if (!a) throw Error(r(90));
                nu(
                  n,
                  a.value,
                  a.defaultValue,
                  a.defaultValue,
                  a.checked,
                  a.defaultChecked,
                  a.type,
                  a.name
                );
              }
            }
            for (e = 0; e < l.length; e++)
              n = l[e], n.form === t.form && Ur(n);
          }
          break t;
        case "textarea":
          Hr(t, l.value, l.defaultValue);
          break t;
        case "select":
          e = l.value, e != null && Wl(t, !!l.multiple, e, !1);
      }
    }
  }
  var ru = !1;
  function kr(t, e, l) {
    if (ru) return t(e, l);
    ru = !0;
    try {
      var n = t(e);
      return n;
    } finally {
      if (ru = !1, (Il !== null || Pl !== null) && (Ai(), Il && (e = Il, t = Pl, Pl = Il = null, Br(e), t)))
        for (e = 0; e < t.length; e++) Br(t[e]);
    }
  }
  function qn(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var n = l[It] || null;
    if (n === null) return null;
    l = n[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (n = !n.disabled) || (t = t.type, n = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !n;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (l && typeof l != "function")
      throw Error(
        r(231, e, typeof l)
      );
    return l;
  }
  var je = !(typeof window == "undefined" || typeof window.document == "undefined" || typeof window.document.createElement == "undefined"), ou = !1;
  if (je)
    try {
      var jn = {};
      Object.defineProperty(jn, "passive", {
        get: function() {
          ou = !0;
        }
      }), window.addEventListener("test", jn, jn), window.removeEventListener("test", jn, jn);
    } catch (t) {
      ou = !1;
    }
  var Pe = null, su = null, Ca = null;
  function Cr() {
    if (Ca) return Ca;
    var t, e = su, l = e.length, n, a = "value" in Pe ? Pe.value : Pe.textContent, i = a.length;
    for (t = 0; t < l && e[t] === a[t]; t++) ;
    var u = l - t;
    for (n = 1; n <= u && e[l - n] === a[i - n]; n++) ;
    return Ca = a.slice(t, 1 < n ? 1 - n : void 0);
  }
  function Va(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Ga() {
    return !0;
  }
  function Vr() {
    return !1;
  }
  function Pt(t) {
    function e(l, n, a, i, u) {
      this._reactName = l, this._targetInst = a, this.type = n, this.nativeEvent = i, this.target = u, this.currentTarget = null;
      for (var c in t)
        t.hasOwnProperty(c) && (l = t[c], this[c] = l ? l(i) : i[c]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Ga : Vr, this.isPropagationStopped = Vr, this;
    }
    return m(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Ga);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Ga);
      },
      persist: function() {
      },
      isPersistent: Ga
    }), e;
  }
  var zl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, La = Pt(zl), Yn = m({}, zl, { view: 0, detail: 0 }), Wd = Pt(Yn), fu, du, Bn, Xa = m({}, Yn, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: vu,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== Bn && (Bn && t.type === "mousemove" ? (fu = t.screenX - Bn.screenX, du = t.screenY - Bn.screenY) : du = fu = 0, Bn = t), fu);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : du;
    }
  }), Gr = Pt(Xa), Fd = m({}, Xa, { dataTransfer: 0 }), Id = Pt(Fd), Pd = m({}, Yn, { relatedTarget: 0 }), hu = Pt(Pd), th = m({}, zl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), eh = Pt(th), lh = m({}, zl, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), nh = Pt(lh), ah = m({}, zl, { data: 0 }), Lr = Pt(ah), ih = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, uh = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, ch = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function rh(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = ch[t]) ? !!e[t] : !1;
  }
  function vu() {
    return rh;
  }
  var oh = m({}, Yn, {
    key: function(t) {
      if (t.key) {
        var e = ih[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = Va(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? uh[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: vu,
    charCode: function(t) {
      return t.type === "keypress" ? Va(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? Va(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), sh = Pt(oh), fh = m({}, Xa, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), Xr = Pt(fh), dh = m({}, Yn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: vu
  }), hh = Pt(dh), vh = m({}, zl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), gh = Pt(vh), yh = m({}, Xa, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), ph = Pt(yh), mh = m({}, zl, {
    newState: 0,
    oldState: 0
  }), bh = Pt(mh), Sh = [9, 13, 27, 32], gu = je && "CompositionEvent" in window, kn = null;
  je && "documentMode" in document && (kn = document.documentMode);
  var xh = je && "TextEvent" in window && !kn, Qr = je && (!gu || kn && 8 < kn && 11 >= kn), Zr = " ", Kr = !1;
  function Jr(t, e) {
    switch (t) {
      case "keyup":
        return Sh.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function $r(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var tn = !1;
  function Eh(t, e) {
    switch (t) {
      case "compositionend":
        return $r(e);
      case "keypress":
        return e.which !== 32 ? null : (Kr = !0, Zr);
      case "textInput":
        return t = e.data, t === Zr && Kr ? null : t;
      default:
        return null;
    }
  }
  function Th(t, e) {
    if (tn)
      return t === "compositionend" || !gu && Jr(t, e) ? (t = Cr(), Ca = su = Pe = null, tn = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return Qr && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Ah = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Wr(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!Ah[t.type] : e === "textarea";
  }
  function Fr(t, e, l, n) {
    Il ? Pl ? Pl.push(n) : Pl = [n] : Il = n, e = _i(e, "onChange"), 0 < e.length && (l = new La(
      "onChange",
      "change",
      null,
      l,
      n
    ), t.push({ event: l, listeners: e }));
  }
  var Cn = null, Vn = null;
  function Oh(t) {
    Rf(t, 0);
  }
  function Qa(t) {
    var e = Hn(t);
    if (Ur(e)) return t;
  }
  function Ir(t, e) {
    if (t === "change") return e;
  }
  var Pr = !1;
  if (je) {
    var yu;
    if (je) {
      var pu = "oninput" in document;
      if (!pu) {
        var to = document.createElement("div");
        to.setAttribute("oninput", "return;"), pu = typeof to.oninput == "function";
      }
      yu = pu;
    } else yu = !1;
    Pr = yu && (!document.documentMode || 9 < document.documentMode);
  }
  function eo() {
    Cn && (Cn.detachEvent("onpropertychange", lo), Vn = Cn = null);
  }
  function lo(t) {
    if (t.propertyName === "value" && Qa(Vn)) {
      var e = [];
      Fr(
        e,
        Vn,
        t,
        cu(t)
      ), kr(Oh, e);
    }
  }
  function zh(t, e, l) {
    t === "focusin" ? (eo(), Cn = e, Vn = l, Cn.attachEvent("onpropertychange", lo)) : t === "focusout" && eo();
  }
  function wh(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Qa(Vn);
  }
  function Mh(t, e) {
    if (t === "click") return Qa(e);
  }
  function Dh(t, e) {
    if (t === "input" || t === "change")
      return Qa(e);
  }
  function _h(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var ce = typeof Object.is == "function" ? Object.is : _h;
  function Gn(t, e) {
    if (ce(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var l = Object.keys(t), n = Object.keys(e);
    if (l.length !== n.length) return !1;
    for (n = 0; n < l.length; n++) {
      var a = l[n];
      if (!Zi.call(e, a) || !ce(t[a], e[a]))
        return !1;
    }
    return !0;
  }
  function no(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function ao(t, e) {
    var l = no(t);
    t = 0;
    for (var n; l; ) {
      if (l.nodeType === 3) {
        if (n = t + l.textContent.length, t <= e && n >= e)
          return { node: l, offset: e - t };
        t = n;
      }
      t: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break t;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = no(l);
    }
  }
  function io(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? io(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function uo(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = Ba(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == "string";
      } catch (n) {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = Ba(t.document);
    }
    return e;
  }
  function mu(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var Nh = je && "documentMode" in document && 11 >= document.documentMode, en = null, bu = null, Ln = null, Su = !1;
  function co(t, e, l) {
    var n = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Su || en == null || en !== Ba(n) || (n = en, "selectionStart" in n && mu(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = {
      anchorNode: n.anchorNode,
      anchorOffset: n.anchorOffset,
      focusNode: n.focusNode,
      focusOffset: n.focusOffset
    }), Ln && Gn(Ln, n) || (Ln = n, n = _i(bu, "onSelect"), 0 < n.length && (e = new La(
      "onSelect",
      "select",
      null,
      e,
      l
    ), t.push({ event: e, listeners: n }), e.target = en)));
  }
  function wl(t, e) {
    var l = {};
    return l[t.toLowerCase()] = e.toLowerCase(), l["Webkit" + t] = "webkit" + e, l["Moz" + t] = "moz" + e, l;
  }
  var ln = {
    animationend: wl("Animation", "AnimationEnd"),
    animationiteration: wl("Animation", "AnimationIteration"),
    animationstart: wl("Animation", "AnimationStart"),
    transitionrun: wl("Transition", "TransitionRun"),
    transitionstart: wl("Transition", "TransitionStart"),
    transitioncancel: wl("Transition", "TransitionCancel"),
    transitionend: wl("Transition", "TransitionEnd")
  }, xu = {}, ro = {};
  je && (ro = document.createElement("div").style, "AnimationEvent" in window || (delete ln.animationend.animation, delete ln.animationiteration.animation, delete ln.animationstart.animation), "TransitionEvent" in window || delete ln.transitionend.transition);
  function Ml(t) {
    if (xu[t]) return xu[t];
    if (!ln[t]) return t;
    var e = ln[t], l;
    for (l in e)
      if (e.hasOwnProperty(l) && l in ro)
        return xu[t] = e[l];
    return t;
  }
  var oo = Ml("animationend"), so = Ml("animationiteration"), fo = Ml("animationstart"), Uh = Ml("transitionrun"), Rh = Ml("transitionstart"), Hh = Ml("transitioncancel"), ho = Ml("transitionend"), vo = /* @__PURE__ */ new Map(), Eu = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Eu.push("scrollEnd");
  function Oe(t, e) {
    vo.set(t, e), Ol(e, [t]);
  }
  var go = /* @__PURE__ */ new WeakMap();
  function pe(t, e) {
    if (typeof t == "object" && t !== null) {
      var l = go.get(t);
      return l !== void 0 ? l : (e = {
        value: t,
        source: e,
        stack: _r(e)
      }, go.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: _r(e)
    };
  }
  var me = [], nn = 0, Tu = 0;
  function Za() {
    for (var t = nn, e = Tu = nn = 0; e < t; ) {
      var l = me[e];
      me[e++] = null;
      var n = me[e];
      me[e++] = null;
      var a = me[e];
      me[e++] = null;
      var i = me[e];
      if (me[e++] = null, n !== null && a !== null) {
        var u = n.pending;
        u === null ? a.next = a : (a.next = u.next, u.next = a), n.pending = a;
      }
      i !== 0 && yo(l, a, i);
    }
  }
  function Ka(t, e, l, n) {
    me[nn++] = t, me[nn++] = e, me[nn++] = l, me[nn++] = n, Tu |= n, t.lanes |= n, t = t.alternate, t !== null && (t.lanes |= n);
  }
  function Au(t, e, l, n) {
    return Ka(t, e, l, n), Ja(t);
  }
  function an(t, e) {
    return Ka(t, null, null, e), Ja(t);
  }
  function yo(t, e, l) {
    t.lanes |= l;
    var n = t.alternate;
    n !== null && (n.lanes |= l);
    for (var a = !1, i = t.return; i !== null; )
      i.childLanes |= l, n = i.alternate, n !== null && (n.childLanes |= l), i.tag === 22 && (t = i.stateNode, t === null || t._visibility & 1 || (a = !0)), t = i, i = i.return;
    return t.tag === 3 ? (i = t.stateNode, a && e !== null && (a = 31 - ue(l), t = i.hiddenUpdates, n = t[a], n === null ? t[a] = [e] : n.push(e), e.lane = l | 536870912), i) : null;
  }
  function Ja(t) {
    if (50 < va)
      throw va = 0, _c = null, Error(r(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var un = {};
  function qh(t, e, l, n) {
    this.tag = t, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = n, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function re(t, e, l, n) {
    return new qh(t, e, l, n);
  }
  function Ou(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Ye(t, e) {
    var l = t.alternate;
    return l === null ? (l = re(
      t.tag,
      e,
      t.key,
      t.mode
    ), l.elementType = t.elementType, l.type = t.type, l.stateNode = t.stateNode, l.alternate = t, t.alternate = l) : (l.pendingProps = e, l.type = t.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = t.flags & 65011712, l.childLanes = t.childLanes, l.lanes = t.lanes, l.child = t.child, l.memoizedProps = t.memoizedProps, l.memoizedState = t.memoizedState, l.updateQueue = t.updateQueue, e = t.dependencies, l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, l.sibling = t.sibling, l.index = t.index, l.ref = t.ref, l.refCleanup = t.refCleanup, l;
  }
  function po(t, e) {
    t.flags &= 65011714;
    var l = t.alternate;
    return l === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = l.childLanes, t.lanes = l.lanes, t.child = l.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = l.memoizedProps, t.memoizedState = l.memoizedState, t.updateQueue = l.updateQueue, t.type = l.type, e = l.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function $a(t, e, l, n, a, i) {
    var u = 0;
    if (n = t, typeof t == "function") Ou(t) && (u = 1);
    else if (typeof t == "string")
      u = Yv(
        t,
        l,
        X.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case At:
          return t = re(31, l, e, a), t.elementType = At, t.lanes = i, t;
        case q:
          return Dl(l.children, a, i, e);
        case I:
          u = 8, a |= 24;
          break;
        case V:
          return t = re(12, l, e, a | 2), t.elementType = V, t.lanes = i, t;
        case G:
          return t = re(13, l, e, a), t.elementType = G, t.lanes = i, t;
        case J:
          return t = re(19, l, e, a), t.elementType = J, t.lanes = i, t;
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case rt:
              case ht:
                u = 10;
                break t;
              case tt:
                u = 9;
                break t;
              case et:
                u = 11;
                break t;
              case St:
                u = 14;
                break t;
              case Gt:
                u = 16, n = null;
                break t;
            }
          u = 29, l = Error(
            r(130, t === null ? "null" : typeof t, "")
          ), n = null;
      }
    return e = re(u, l, e, a), e.elementType = t, e.type = n, e.lanes = i, e;
  }
  function Dl(t, e, l, n) {
    return t = re(7, t, n, e), t.lanes = l, t;
  }
  function zu(t, e, l) {
    return t = re(6, t, null, e), t.lanes = l, t;
  }
  function wu(t, e, l) {
    return e = re(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = l, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var cn = [], rn = 0, Wa = null, Fa = 0, be = [], Se = 0, _l = null, Be = 1, ke = "";
  function Nl(t, e) {
    cn[rn++] = Fa, cn[rn++] = Wa, Wa = t, Fa = e;
  }
  function mo(t, e, l) {
    be[Se++] = Be, be[Se++] = ke, be[Se++] = _l, _l = t;
    var n = Be;
    t = ke;
    var a = 32 - ue(n) - 1;
    n &= ~(1 << a), l += 1;
    var i = 32 - ue(e) + a;
    if (30 < i) {
      var u = a - a % 5;
      i = (n & (1 << u) - 1).toString(32), n >>= u, a -= u, Be = 1 << 32 - ue(e) + a | l << a | n, ke = i + t;
    } else
      Be = 1 << i | l << a | n, ke = t;
  }
  function Mu(t) {
    t.return !== null && (Nl(t, 1), mo(t, 1, 0));
  }
  function Du(t) {
    for (; t === Wa; )
      Wa = cn[--rn], cn[rn] = null, Fa = cn[--rn], cn[rn] = null;
    for (; t === _l; )
      _l = be[--Se], be[Se] = null, ke = be[--Se], be[Se] = null, Be = be[--Se], be[Se] = null;
  }
  var Ft = null, Dt = null, vt = !1, Ul = null, _e = !1, _u = Error(r(519));
  function Rl(t) {
    var e = Error(r(418, ""));
    throw Zn(pe(e, t)), _u;
  }
  function bo(t) {
    var e = t.stateNode, l = t.type, n = t.memoizedProps;
    switch (e[Jt] = t, e[It] = n, l) {
      case "dialog":
        it("cancel", e), it("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        it("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < ya.length; l++)
          it(ya[l], e);
        break;
      case "source":
        it("error", e);
        break;
      case "img":
      case "image":
      case "link":
        it("error", e), it("load", e);
        break;
      case "details":
        it("toggle", e);
        break;
      case "input":
        it("invalid", e), Rr(
          e,
          n.value,
          n.defaultValue,
          n.checked,
          n.defaultChecked,
          n.type,
          n.name,
          !0
        ), Ya(e);
        break;
      case "select":
        it("invalid", e);
        break;
      case "textarea":
        it("invalid", e), qr(e, n.value, n.defaultValue, n.children), Ya(e);
    }
    l = n.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || e.textContent === "" + l || n.suppressHydrationWarning === !0 || Yf(e.textContent, l) ? (n.popover != null && (it("beforetoggle", e), it("toggle", e)), n.onScroll != null && it("scroll", e), n.onScrollEnd != null && it("scrollend", e), n.onClick != null && (e.onclick = Ni), e = !0) : e = !1, e || Rl(t);
  }
  function So(t) {
    for (Ft = t.return; Ft; )
      switch (Ft.tag) {
        case 5:
        case 13:
          _e = !1;
          return;
        case 27:
        case 3:
          _e = !0;
          return;
        default:
          Ft = Ft.return;
      }
  }
  function Xn(t) {
    if (t !== Ft) return !1;
    if (!vt) return So(t), vt = !0, !1;
    var e = t.tag, l;
    if ((l = e !== 3 && e !== 27) && ((l = e === 5) && (l = t.type, l = !(l !== "form" && l !== "button") || Zc(t.type, t.memoizedProps)), l = !l), l && Dt && Rl(t), So(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (l = t.data, l === "/$") {
              if (e === 0) {
                Dt = we(t.nextSibling);
                break t;
              }
              e--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || e++;
          t = t.nextSibling;
        }
        Dt = null;
      }
    } else
      e === 27 ? (e = Dt, gl(t.type) ? (t = Wc, Wc = null, Dt = t) : Dt = e) : Dt = Ft ? we(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Qn() {
    Dt = Ft = null, vt = !1;
  }
  function xo() {
    var t = Ul;
    return t !== null && (le === null ? le = t : le.push.apply(
      le,
      t
    ), Ul = null), t;
  }
  function Zn(t) {
    Ul === null ? Ul = [t] : Ul.push(t);
  }
  var Nu = R(null), Hl = null, Ce = null;
  function tl(t, e, l) {
    j(Nu, e._currentValue), e._currentValue = l;
  }
  function Ve(t) {
    t._currentValue = Nu.current, B(Nu);
  }
  function Uu(t, e, l) {
    for (; t !== null; ) {
      var n = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, n !== null && (n.childLanes |= e)) : n !== null && (n.childLanes & e) !== e && (n.childLanes |= e), t === l) break;
      t = t.return;
    }
  }
  function Ru(t, e, l, n) {
    var a = t.child;
    for (a !== null && (a.return = t); a !== null; ) {
      var i = a.dependencies;
      if (i !== null) {
        var u = a.child;
        i = i.firstContext;
        t: for (; i !== null; ) {
          var c = i;
          i = a;
          for (var d = 0; d < e.length; d++)
            if (c.context === e[d]) {
              i.lanes |= l, c = i.alternate, c !== null && (c.lanes |= l), Uu(
                i.return,
                l,
                t
              ), n || (u = null);
              break t;
            }
          i = c.next;
        }
      } else if (a.tag === 18) {
        if (u = a.return, u === null) throw Error(r(341));
        u.lanes |= l, i = u.alternate, i !== null && (i.lanes |= l), Uu(u, l, t), u = null;
      } else u = a.child;
      if (u !== null) u.return = a;
      else
        for (u = a; u !== null; ) {
          if (u === t) {
            u = null;
            break;
          }
          if (a = u.sibling, a !== null) {
            a.return = u.return, u = a;
            break;
          }
          u = u.return;
        }
      a = u;
    }
  }
  function Kn(t, e, l, n) {
    t = null;
    for (var a = e, i = !1; a !== null; ) {
      if (!i) {
        if ((a.flags & 524288) !== 0) i = !0;
        else if ((a.flags & 262144) !== 0) break;
      }
      if (a.tag === 10) {
        var u = a.alternate;
        if (u === null) throw Error(r(387));
        if (u = u.memoizedProps, u !== null) {
          var c = a.type;
          ce(a.pendingProps.value, u.value) || (t !== null ? t.push(c) : t = [c]);
        }
      } else if (a === ae.current) {
        if (u = a.alternate, u === null) throw Error(r(387));
        u.memoizedState.memoizedState !== a.memoizedState.memoizedState && (t !== null ? t.push(Ea) : t = [Ea]);
      }
      a = a.return;
    }
    t !== null && Ru(
      e,
      t,
      l,
      n
    ), e.flags |= 262144;
  }
  function Ia(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!ce(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function ql(t) {
    Hl = t, Ce = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function $t(t) {
    return Eo(Hl, t);
  }
  function Pa(t, e) {
    return Hl === null && ql(t), Eo(t, e);
  }
  function Eo(t, e) {
    var l = e._currentValue;
    if (e = { context: e, memoizedValue: l, next: null }, Ce === null) {
      if (t === null) throw Error(r(308));
      Ce = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else Ce = Ce.next = e;
    return l;
  }
  var jh = typeof AbortController != "undefined" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(l, n) {
        t.push(n);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(l) {
        return l();
      });
    };
  }, Yh = z.unstable_scheduleCallback, Bh = z.unstable_NormalPriority, jt = {
    $$typeof: ht,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Hu() {
    return {
      controller: new jh(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Jn(t) {
    t.refCount--, t.refCount === 0 && Yh(Bh, function() {
      t.controller.abort();
    });
  }
  var $n = null, qu = 0, on = 0, sn = null;
  function kh(t, e) {
    if ($n === null) {
      var l = $n = [];
      qu = 0, on = Yc(), sn = {
        status: "pending",
        value: void 0,
        then: function(n) {
          l.push(n);
        }
      };
    }
    return qu++, e.then(To, To), e;
  }
  function To() {
    if (--qu === 0 && $n !== null) {
      sn !== null && (sn.status = "fulfilled");
      var t = $n;
      $n = null, on = 0, sn = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Ch(t, e) {
    var l = [], n = {
      status: "pending",
      value: null,
      reason: null,
      then: function(a) {
        l.push(a);
      }
    };
    return t.then(
      function() {
        n.status = "fulfilled", n.value = e;
        for (var a = 0; a < l.length; a++) (0, l[a])(e);
      },
      function(a) {
        for (n.status = "rejected", n.reason = a, a = 0; a < l.length; a++)
          (0, l[a])(void 0);
      }
    ), n;
  }
  var Ao = D.S;
  D.S = function(t, e) {
    typeof e == "object" && e !== null && typeof e.then == "function" && kh(t, e), Ao !== null && Ao(t, e);
  };
  var jl = R(null);
  function ju() {
    var t = jl.current;
    return t !== null ? t : Tt.pooledCache;
  }
  function ti(t, e) {
    e === null ? j(jl, jl.current) : j(jl, e.pool);
  }
  function Oo() {
    var t = ju();
    return t === null ? null : { parent: jt._currentValue, pool: t };
  }
  var Wn = Error(r(460)), zo = Error(r(474)), ei = Error(r(542)), Yu = { then: function() {
  } };
  function wo(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function li() {
  }
  function Mo(t, e, l) {
    switch (l = t[l], l === void 0 ? t.push(e) : l !== e && (e.then(li, li), e = l), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, _o(t), t;
      default:
        if (typeof e.status == "string") e.then(li, li);
        else {
          if (t = Tt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(r(482));
          t = e, t.status = "pending", t.then(
            function(n) {
              if (e.status === "pending") {
                var a = e;
                a.status = "fulfilled", a.value = n;
              }
            },
            function(n) {
              if (e.status === "pending") {
                var a = e;
                a.status = "rejected", a.reason = n;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, _o(t), t;
        }
        throw Fn = e, Wn;
    }
  }
  var Fn = null;
  function Do() {
    if (Fn === null) throw Error(r(459));
    var t = Fn;
    return Fn = null, t;
  }
  function _o(t) {
    if (t === Wn || t === ei)
      throw Error(r(483));
  }
  var el = !1;
  function Bu(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function ku(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function ll(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function nl(t, e, l) {
    var n = t.updateQueue;
    if (n === null) return null;
    if (n = n.shared, (gt & 2) !== 0) {
      var a = n.pending;
      return a === null ? e.next = e : (e.next = a.next, a.next = e), n.pending = e, e = Ja(t), yo(t, null, l), e;
    }
    return Ka(t, n, e, l), Ja(t);
  }
  function In(t, e, l) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (l & 4194048) !== 0)) {
      var n = e.lanes;
      n &= t.pendingLanes, l |= n, e.lanes = l, Er(t, l);
    }
  }
  function Cu(t, e) {
    var l = t.updateQueue, n = t.alternate;
    if (n !== null && (n = n.updateQueue, l === n)) {
      var a = null, i = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var u = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          i === null ? a = i = u : i = i.next = u, l = l.next;
        } while (l !== null);
        i === null ? a = i = e : i = i.next = e;
      } else a = i = e;
      l = {
        baseState: n.baseState,
        firstBaseUpdate: a,
        lastBaseUpdate: i,
        shared: n.shared,
        callbacks: n.callbacks
      }, t.updateQueue = l;
      return;
    }
    t = l.lastBaseUpdate, t === null ? l.firstBaseUpdate = e : t.next = e, l.lastBaseUpdate = e;
  }
  var Vu = !1;
  function Pn() {
    if (Vu) {
      var t = sn;
      if (t !== null) throw t;
    }
  }
  function ta(t, e, l, n) {
    Vu = !1;
    var a = t.updateQueue;
    el = !1;
    var i = a.firstBaseUpdate, u = a.lastBaseUpdate, c = a.shared.pending;
    if (c !== null) {
      a.shared.pending = null;
      var d = c, E = d.next;
      d.next = null, u === null ? i = E : u.next = E, u = d;
      var M = t.alternate;
      M !== null && (M = M.updateQueue, c = M.lastBaseUpdate, c !== u && (c === null ? M.firstBaseUpdate = E : c.next = E, M.lastBaseUpdate = d));
    }
    if (i !== null) {
      var U = a.baseState;
      u = 0, M = E = d = null, c = i;
      do {
        var A = c.lane & -536870913, O = A !== c.lane;
        if (O ? (ut & A) === A : (n & A) === A) {
          A !== 0 && A === on && (Vu = !0), M !== null && (M = M.next = {
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: null,
            next: null
          });
          t: {
            var $ = t, Q = c;
            A = e;
            var bt = l;
            switch (Q.tag) {
              case 1:
                if ($ = Q.payload, typeof $ == "function") {
                  U = $.call(bt, U, A);
                  break t;
                }
                U = $;
                break t;
              case 3:
                $.flags = $.flags & -65537 | 128;
              case 0:
                if ($ = Q.payload, A = typeof $ == "function" ? $.call(bt, U, A) : $, A == null) break t;
                U = m({}, U, A);
                break t;
              case 2:
                el = !0;
            }
          }
          A = c.callback, A !== null && (t.flags |= 64, O && (t.flags |= 8192), O = a.callbacks, O === null ? a.callbacks = [A] : O.push(A));
        } else
          O = {
            lane: A,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          }, M === null ? (E = M = O, d = U) : M = M.next = O, u |= A;
        if (c = c.next, c === null) {
          if (c = a.shared.pending, c === null)
            break;
          O = c, c = O.next, O.next = null, a.lastBaseUpdate = O, a.shared.pending = null;
        }
      } while (!0);
      M === null && (d = U), a.baseState = d, a.firstBaseUpdate = E, a.lastBaseUpdate = M, i === null && (a.shared.lanes = 0), fl |= u, t.lanes = u, t.memoizedState = U;
    }
  }
  function No(t, e) {
    if (typeof t != "function")
      throw Error(r(191, t));
    t.call(e);
  }
  function Uo(t, e) {
    var l = t.callbacks;
    if (l !== null)
      for (t.callbacks = null, t = 0; t < l.length; t++)
        No(l[t], e);
  }
  var fn = R(null), ni = R(0);
  function Ro(t, e) {
    t = Je, j(ni, t), j(fn, e), Je = t | e.baseLanes;
  }
  function Gu() {
    j(ni, Je), j(fn, fn.current);
  }
  function Lu() {
    Je = ni.current, B(fn), B(ni);
  }
  var al = 0, lt = null, pt = null, Rt = null, ai = !1, dn = !1, Yl = !1, ii = 0, ea = 0, hn = null, Vh = 0;
  function Nt() {
    throw Error(r(321));
  }
  function Xu(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++)
      if (!ce(t[l], e[l])) return !1;
    return !0;
  }
  function Qu(t, e, l, n, a, i) {
    return al = i, lt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, D.H = t === null || t.memoizedState === null ? ys : ps, Yl = !1, i = l(n, a), Yl = !1, dn && (i = qo(
      e,
      l,
      n,
      a
    )), Ho(t), i;
  }
  function Ho(t) {
    D.H = fi;
    var e = pt !== null && pt.next !== null;
    if (al = 0, Rt = pt = lt = null, ai = !1, ea = 0, hn = null, e) throw Error(r(300));
    t === null || kt || (t = t.dependencies, t !== null && Ia(t) && (kt = !0));
  }
  function qo(t, e, l, n) {
    lt = t;
    var a = 0;
    do {
      if (dn && (hn = null), ea = 0, dn = !1, 25 <= a) throw Error(r(301));
      if (a += 1, Rt = pt = null, t.updateQueue != null) {
        var i = t.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      D.H = Jh, i = e(l, n);
    } while (dn);
    return i;
  }
  function Gh() {
    var t = D.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? la(e) : e, t = t.useState()[0], (pt !== null ? pt.memoizedState : null) !== t && (lt.flags |= 1024), e;
  }
  function Zu() {
    var t = ii !== 0;
    return ii = 0, t;
  }
  function Ku(t, e, l) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~l;
  }
  function Ju(t) {
    if (ai) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      ai = !1;
    }
    al = 0, Rt = pt = lt = null, dn = !1, ea = ii = 0, hn = null;
  }
  function te() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Rt === null ? lt.memoizedState = Rt = t : Rt = Rt.next = t, Rt;
  }
  function Ht() {
    if (pt === null) {
      var t = lt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = pt.next;
    var e = Rt === null ? lt.memoizedState : Rt.next;
    if (e !== null)
      Rt = e, pt = t;
    else {
      if (t === null)
        throw lt.alternate === null ? Error(r(467)) : Error(r(310));
      pt = t, t = {
        memoizedState: pt.memoizedState,
        baseState: pt.baseState,
        baseQueue: pt.baseQueue,
        queue: pt.queue,
        next: null
      }, Rt === null ? lt.memoizedState = Rt = t : Rt = Rt.next = t;
    }
    return Rt;
  }
  function $u() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function la(t) {
    var e = ea;
    return ea += 1, hn === null && (hn = []), t = Mo(hn, t, e), e = lt, (Rt === null ? e.memoizedState : Rt.next) === null && (e = e.alternate, D.H = e === null || e.memoizedState === null ? ys : ps), t;
  }
  function ui(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return la(t);
      if (t.$$typeof === ht) return $t(t);
    }
    throw Error(r(438, String(t)));
  }
  function Wu(t) {
    var e = null, l = lt.updateQueue;
    if (l !== null && (e = l.memoCache), e == null) {
      var n = lt.alternate;
      n !== null && (n = n.updateQueue, n !== null && (n = n.memoCache, n != null && (e = {
        data: n.data.map(function(a) {
          return a.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), l === null && (l = $u(), lt.updateQueue = l), l.memoCache = e, l = e.data[e.index], l === void 0)
      for (l = e.data[e.index] = Array(t), n = 0; n < t; n++)
        l[n] = wt;
    return e.index++, l;
  }
  function Ge(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function ci(t) {
    var e = Ht();
    return Fu(e, pt, t);
  }
  function Fu(t, e, l) {
    var n = t.queue;
    if (n === null) throw Error(r(311));
    n.lastRenderedReducer = l;
    var a = t.baseQueue, i = n.pending;
    if (i !== null) {
      if (a !== null) {
        var u = a.next;
        a.next = i.next, i.next = u;
      }
      e.baseQueue = a = i, n.pending = null;
    }
    if (i = t.baseState, a === null) t.memoizedState = i;
    else {
      e = a.next;
      var c = u = null, d = null, E = e, M = !1;
      do {
        var U = E.lane & -536870913;
        if (U !== E.lane ? (ut & U) === U : (al & U) === U) {
          var A = E.revertLane;
          if (A === 0)
            d !== null && (d = d.next = {
              lane: 0,
              revertLane: 0,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }), U === on && (M = !0);
          else if ((al & A) === A) {
            E = E.next, A === on && (M = !0);
            continue;
          } else
            U = {
              lane: 0,
              revertLane: E.revertLane,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }, d === null ? (c = d = U, u = i) : d = d.next = U, lt.lanes |= A, fl |= A;
          U = E.action, Yl && l(i, U), i = E.hasEagerState ? E.eagerState : l(i, U);
        } else
          A = {
            lane: U,
            revertLane: E.revertLane,
            action: E.action,
            hasEagerState: E.hasEagerState,
            eagerState: E.eagerState,
            next: null
          }, d === null ? (c = d = A, u = i) : d = d.next = A, lt.lanes |= U, fl |= U;
        E = E.next;
      } while (E !== null && E !== e);
      if (d === null ? u = i : d.next = c, !ce(i, t.memoizedState) && (kt = !0, M && (l = sn, l !== null)))
        throw l;
      t.memoizedState = i, t.baseState = u, t.baseQueue = d, n.lastRenderedState = i;
    }
    return a === null && (n.lanes = 0), [t.memoizedState, n.dispatch];
  }
  function Iu(t) {
    var e = Ht(), l = e.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = t;
    var n = l.dispatch, a = l.pending, i = e.memoizedState;
    if (a !== null) {
      l.pending = null;
      var u = a = a.next;
      do
        i = t(i, u.action), u = u.next;
      while (u !== a);
      ce(i, e.memoizedState) || (kt = !0), e.memoizedState = i, e.baseQueue === null && (e.baseState = i), l.lastRenderedState = i;
    }
    return [i, n];
  }
  function jo(t, e, l) {
    var n = lt, a = Ht(), i = vt;
    if (i) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = e();
    var u = !ce(
      (pt || a).memoizedState,
      l
    );
    u && (a.memoizedState = l, kt = !0), a = a.queue;
    var c = ko.bind(null, n, a, t);
    if (na(2048, 8, c, [t]), a.getSnapshot !== e || u || Rt !== null && Rt.memoizedState.tag & 1) {
      if (n.flags |= 2048, vn(
        9,
        ri(),
        Bo.bind(
          null,
          n,
          a,
          l,
          e
        ),
        null
      ), Tt === null) throw Error(r(349));
      i || (al & 124) !== 0 || Yo(n, e, l);
    }
    return l;
  }
  function Yo(t, e, l) {
    t.flags |= 16384, t = { getSnapshot: e, value: l }, e = lt.updateQueue, e === null ? (e = $u(), lt.updateQueue = e, e.stores = [t]) : (l = e.stores, l === null ? e.stores = [t] : l.push(t));
  }
  function Bo(t, e, l, n) {
    e.value = l, e.getSnapshot = n, Co(e) && Vo(t);
  }
  function ko(t, e, l) {
    return l(function() {
      Co(e) && Vo(t);
    });
  }
  function Co(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !ce(t, l);
    } catch (n) {
      return !0;
    }
  }
  function Vo(t) {
    var e = an(t, 2);
    e !== null && he(e, t, 2);
  }
  function Pu(t) {
    var e = te();
    if (typeof t == "function") {
      var l = t;
      if (t = l(), Yl) {
        Fe(!0);
        try {
          l();
        } finally {
          Fe(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ge,
      lastRenderedState: t
    }, e;
  }
  function Go(t, e, l, n) {
    return t.baseState = l, Fu(
      t,
      pt,
      typeof n == "function" ? n : Ge
    );
  }
  function Lh(t, e, l, n, a) {
    if (si(t)) throw Error(r(485));
    if (t = e.action, t !== null) {
      var i = {
        payload: a,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(u) {
          i.listeners.push(u);
        }
      };
      D.T !== null ? l(!0) : i.isTransition = !1, n(i), l = e.pending, l === null ? (i.next = e.pending = i, Lo(e, i)) : (i.next = l.next, e.pending = l.next = i);
    }
  }
  function Lo(t, e) {
    var l = e.action, n = e.payload, a = t.state;
    if (e.isTransition) {
      var i = D.T, u = {};
      D.T = u;
      try {
        var c = l(a, n), d = D.S;
        d !== null && d(u, c), Xo(t, e, c);
      } catch (E) {
        tc(t, e, E);
      } finally {
        D.T = i;
      }
    } else
      try {
        i = l(a, n), Xo(t, e, i);
      } catch (E) {
        tc(t, e, E);
      }
  }
  function Xo(t, e, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(n) {
        Qo(t, e, n);
      },
      function(n) {
        return tc(t, e, n);
      }
    ) : Qo(t, e, l);
  }
  function Qo(t, e, l) {
    e.status = "fulfilled", e.value = l, Zo(e), t.state = l, e = t.pending, e !== null && (l = e.next, l === e ? t.pending = null : (l = l.next, e.next = l, Lo(t, l)));
  }
  function tc(t, e, l) {
    var n = t.pending;
    if (t.pending = null, n !== null) {
      n = n.next;
      do
        e.status = "rejected", e.reason = l, Zo(e), e = e.next;
      while (e !== n);
    }
    t.action = null;
  }
  function Zo(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Ko(t, e) {
    return e;
  }
  function Jo(t, e) {
    if (vt) {
      var l = Tt.formState;
      if (l !== null) {
        t: {
          var n = lt;
          if (vt) {
            if (Dt) {
              e: {
                for (var a = Dt, i = _e; a.nodeType !== 8; ) {
                  if (!i) {
                    a = null;
                    break e;
                  }
                  if (a = we(
                    a.nextSibling
                  ), a === null) {
                    a = null;
                    break e;
                  }
                }
                i = a.data, a = i === "F!" || i === "F" ? a : null;
              }
              if (a) {
                Dt = we(
                  a.nextSibling
                ), n = a.data === "F!";
                break t;
              }
            }
            Rl(n);
          }
          n = !1;
        }
        n && (e = l[0]);
      }
    }
    return l = te(), l.memoizedState = l.baseState = e, n = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ko,
      lastRenderedState: e
    }, l.queue = n, l = hs.bind(
      null,
      lt,
      n
    ), n.dispatch = l, n = Pu(!1), i = ic.bind(
      null,
      lt,
      !1,
      n.queue
    ), n = te(), a = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, n.queue = a, l = Lh.bind(
      null,
      lt,
      a,
      i,
      l
    ), a.dispatch = l, n.memoizedState = t, [e, l, !1];
  }
  function $o(t) {
    var e = Ht();
    return Wo(e, pt, t);
  }
  function Wo(t, e, l) {
    if (e = Fu(
      t,
      e,
      Ko
    )[0], t = ci(Ge)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var n = la(e);
      } catch (u) {
        throw u === Wn ? ei : u;
      }
    else n = e;
    e = Ht();
    var a = e.queue, i = a.dispatch;
    return l !== e.memoizedState && (lt.flags |= 2048, vn(
      9,
      ri(),
      Xh.bind(null, a, l),
      null
    )), [n, i, t];
  }
  function Xh(t, e) {
    t.action = e;
  }
  function Fo(t) {
    var e = Ht(), l = pt;
    if (l !== null)
      return Wo(e, l, t);
    Ht(), e = e.memoizedState, l = Ht();
    var n = l.queue.dispatch;
    return l.memoizedState = t, [e, n, !1];
  }
  function vn(t, e, l, n) {
    return t = { tag: t, create: l, deps: n, inst: e, next: null }, e = lt.updateQueue, e === null && (e = $u(), lt.updateQueue = e), l = e.lastEffect, l === null ? e.lastEffect = t.next = t : (n = l.next, l.next = t, t.next = n, e.lastEffect = t), t;
  }
  function ri() {
    return { destroy: void 0, resource: void 0 };
  }
  function Io() {
    return Ht().memoizedState;
  }
  function oi(t, e, l, n) {
    var a = te();
    n = n === void 0 ? null : n, lt.flags |= t, a.memoizedState = vn(
      1 | e,
      ri(),
      l,
      n
    );
  }
  function na(t, e, l, n) {
    var a = Ht();
    n = n === void 0 ? null : n;
    var i = a.memoizedState.inst;
    pt !== null && n !== null && Xu(n, pt.memoizedState.deps) ? a.memoizedState = vn(e, i, l, n) : (lt.flags |= t, a.memoizedState = vn(
      1 | e,
      i,
      l,
      n
    ));
  }
  function Po(t, e) {
    oi(8390656, 8, t, e);
  }
  function ts(t, e) {
    na(2048, 8, t, e);
  }
  function es(t, e) {
    return na(4, 2, t, e);
  }
  function ls(t, e) {
    return na(4, 4, t, e);
  }
  function ns(t, e) {
    if (typeof e == "function") {
      t = t();
      var l = e(t);
      return function() {
        typeof l == "function" ? l() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function as(t, e, l) {
    l = l != null ? l.concat([t]) : null, na(4, 4, ns.bind(null, e, t), l);
  }
  function ec() {
  }
  function is(t, e) {
    var l = Ht();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    return e !== null && Xu(e, n[1]) ? n[0] : (l.memoizedState = [t, e], t);
  }
  function us(t, e) {
    var l = Ht();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    if (e !== null && Xu(e, n[1]))
      return n[0];
    if (n = t(), Yl) {
      Fe(!0);
      try {
        t();
      } finally {
        Fe(!1);
      }
    }
    return l.memoizedState = [n, e], n;
  }
  function lc(t, e, l) {
    return l === void 0 || (al & 1073741824) !== 0 ? t.memoizedState = e : (t.memoizedState = l, t = sf(), lt.lanes |= t, fl |= t, l);
  }
  function cs(t, e, l, n) {
    return ce(l, e) ? l : fn.current !== null ? (t = lc(t, l, n), ce(t, e) || (kt = !0), t) : (al & 42) === 0 ? (kt = !0, t.memoizedState = l) : (t = sf(), lt.lanes |= t, fl |= t, e);
  }
  function rs(t, e, l, n, a) {
    var i = Y.p;
    Y.p = i !== 0 && 8 > i ? i : 8;
    var u = D.T, c = {};
    D.T = c, ic(t, !1, e, l);
    try {
      var d = a(), E = D.S;
      if (E !== null && E(c, d), d !== null && typeof d == "object" && typeof d.then == "function") {
        var M = Ch(
          d,
          n
        );
        aa(
          t,
          e,
          M,
          de(t)
        );
      } else
        aa(
          t,
          e,
          n,
          de(t)
        );
    } catch (U) {
      aa(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: U },
        de()
      );
    } finally {
      Y.p = i, D.T = u;
    }
  }
  function Qh() {
  }
  function nc(t, e, l, n) {
    if (t.tag !== 5) throw Error(r(476));
    var a = os(t).queue;
    rs(
      t,
      a,
      e,
      K,
      l === null ? Qh : function() {
        return ss(t), l(n);
      }
    );
  }
  function os(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: K,
      baseState: K,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ge,
        lastRenderedState: K
      },
      next: null
    };
    var l = {};
    return e.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ge,
        lastRenderedState: l
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function ss(t) {
    var e = os(t).next.queue;
    aa(t, e, {}, de());
  }
  function ac() {
    return $t(Ea);
  }
  function fs() {
    return Ht().memoizedState;
  }
  function ds() {
    return Ht().memoizedState;
  }
  function Zh(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = de();
          t = ll(l);
          var n = nl(e, t, l);
          n !== null && (he(n, e, l), In(n, e, l)), e = { cache: Hu() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function Kh(t, e, l) {
    var n = de();
    l = {
      lane: n,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, si(t) ? vs(e, l) : (l = Au(t, e, l, n), l !== null && (he(l, t, n), gs(l, e, n)));
  }
  function hs(t, e, l) {
    var n = de();
    aa(t, e, l, n);
  }
  function aa(t, e, l, n) {
    var a = {
      lane: n,
      revertLane: 0,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (si(t)) vs(e, a);
    else {
      var i = t.alternate;
      if (t.lanes === 0 && (i === null || i.lanes === 0) && (i = e.lastRenderedReducer, i !== null))
        try {
          var u = e.lastRenderedState, c = i(u, l);
          if (a.hasEagerState = !0, a.eagerState = c, ce(c, u))
            return Ka(t, e, a, 0), Tt === null && Za(), !1;
        } catch (d) {
        } finally {
        }
      if (l = Au(t, e, a, n), l !== null)
        return he(l, t, n), gs(l, e, n), !0;
    }
    return !1;
  }
  function ic(t, e, l, n) {
    if (n = {
      lane: 2,
      revertLane: Yc(),
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, si(t)) {
      if (e) throw Error(r(479));
    } else
      e = Au(
        t,
        l,
        n,
        2
      ), e !== null && he(e, t, 2);
  }
  function si(t) {
    var e = t.alternate;
    return t === lt || e !== null && e === lt;
  }
  function vs(t, e) {
    dn = ai = !0;
    var l = t.pending;
    l === null ? e.next = e : (e.next = l.next, l.next = e), t.pending = e;
  }
  function gs(t, e, l) {
    if ((l & 4194048) !== 0) {
      var n = e.lanes;
      n &= t.pendingLanes, l |= n, e.lanes = l, Er(t, l);
    }
  }
  var fi = {
    readContext: $t,
    use: ui,
    useCallback: Nt,
    useContext: Nt,
    useEffect: Nt,
    useImperativeHandle: Nt,
    useLayoutEffect: Nt,
    useInsertionEffect: Nt,
    useMemo: Nt,
    useReducer: Nt,
    useRef: Nt,
    useState: Nt,
    useDebugValue: Nt,
    useDeferredValue: Nt,
    useTransition: Nt,
    useSyncExternalStore: Nt,
    useId: Nt,
    useHostTransitionStatus: Nt,
    useFormState: Nt,
    useActionState: Nt,
    useOptimistic: Nt,
    useMemoCache: Nt,
    useCacheRefresh: Nt
  }, ys = {
    readContext: $t,
    use: ui,
    useCallback: function(t, e) {
      return te().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: $t,
    useEffect: Po,
    useImperativeHandle: function(t, e, l) {
      l = l != null ? l.concat([t]) : null, oi(
        4194308,
        4,
        ns.bind(null, e, t),
        l
      );
    },
    useLayoutEffect: function(t, e) {
      return oi(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      oi(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var l = te();
      e = e === void 0 ? null : e;
      var n = t();
      if (Yl) {
        Fe(!0);
        try {
          t();
        } finally {
          Fe(!1);
        }
      }
      return l.memoizedState = [n, e], n;
    },
    useReducer: function(t, e, l) {
      var n = te();
      if (l !== void 0) {
        var a = l(e);
        if (Yl) {
          Fe(!0);
          try {
            l(e);
          } finally {
            Fe(!1);
          }
        }
      } else a = e;
      return n.memoizedState = n.baseState = a, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: a
      }, n.queue = t, t = t.dispatch = Kh.bind(
        null,
        lt,
        t
      ), [n.memoizedState, t];
    },
    useRef: function(t) {
      var e = te();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Pu(t);
      var e = t.queue, l = hs.bind(null, lt, e);
      return e.dispatch = l, [t.memoizedState, l];
    },
    useDebugValue: ec,
    useDeferredValue: function(t, e) {
      var l = te();
      return lc(l, t, e);
    },
    useTransition: function() {
      var t = Pu(!1);
      return t = rs.bind(
        null,
        lt,
        t.queue,
        !0,
        !1
      ), te().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, l) {
      var n = lt, a = te();
      if (vt) {
        if (l === void 0)
          throw Error(r(407));
        l = l();
      } else {
        if (l = e(), Tt === null)
          throw Error(r(349));
        (ut & 124) !== 0 || Yo(n, e, l);
      }
      a.memoizedState = l;
      var i = { value: l, getSnapshot: e };
      return a.queue = i, Po(ko.bind(null, n, i, t), [
        t
      ]), n.flags |= 2048, vn(
        9,
        ri(),
        Bo.bind(
          null,
          n,
          i,
          l,
          e
        ),
        null
      ), l;
    },
    useId: function() {
      var t = te(), e = Tt.identifierPrefix;
      if (vt) {
        var l = ke, n = Be;
        l = (n & ~(1 << 32 - ue(n) - 1)).toString(32) + l, e = "«" + e + "R" + l, l = ii++, 0 < l && (e += "H" + l.toString(32)), e += "»";
      } else
        l = Vh++, e = "«" + e + "r" + l.toString(32) + "»";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: ac,
    useFormState: Jo,
    useActionState: Jo,
    useOptimistic: function(t) {
      var e = te();
      e.memoizedState = e.baseState = t;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = l, e = ic.bind(
        null,
        lt,
        !0,
        l
      ), l.dispatch = e, [t, e];
    },
    useMemoCache: Wu,
    useCacheRefresh: function() {
      return te().memoizedState = Zh.bind(
        null,
        lt
      );
    }
  }, ps = {
    readContext: $t,
    use: ui,
    useCallback: is,
    useContext: $t,
    useEffect: ts,
    useImperativeHandle: as,
    useInsertionEffect: es,
    useLayoutEffect: ls,
    useMemo: us,
    useReducer: ci,
    useRef: Io,
    useState: function() {
      return ci(Ge);
    },
    useDebugValue: ec,
    useDeferredValue: function(t, e) {
      var l = Ht();
      return cs(
        l,
        pt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = ci(Ge)[0], e = Ht().memoizedState;
      return [
        typeof t == "boolean" ? t : la(t),
        e
      ];
    },
    useSyncExternalStore: jo,
    useId: fs,
    useHostTransitionStatus: ac,
    useFormState: $o,
    useActionState: $o,
    useOptimistic: function(t, e) {
      var l = Ht();
      return Go(l, pt, t, e);
    },
    useMemoCache: Wu,
    useCacheRefresh: ds
  }, Jh = {
    readContext: $t,
    use: ui,
    useCallback: is,
    useContext: $t,
    useEffect: ts,
    useImperativeHandle: as,
    useInsertionEffect: es,
    useLayoutEffect: ls,
    useMemo: us,
    useReducer: Iu,
    useRef: Io,
    useState: function() {
      return Iu(Ge);
    },
    useDebugValue: ec,
    useDeferredValue: function(t, e) {
      var l = Ht();
      return pt === null ? lc(l, t, e) : cs(
        l,
        pt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Iu(Ge)[0], e = Ht().memoizedState;
      return [
        typeof t == "boolean" ? t : la(t),
        e
      ];
    },
    useSyncExternalStore: jo,
    useId: fs,
    useHostTransitionStatus: ac,
    useFormState: Fo,
    useActionState: Fo,
    useOptimistic: function(t, e) {
      var l = Ht();
      return pt !== null ? Go(l, pt, t, e) : (l.baseState = t, [t, l.queue.dispatch]);
    },
    useMemoCache: Wu,
    useCacheRefresh: ds
  }, gn = null, ia = 0;
  function di(t) {
    var e = ia;
    return ia += 1, gn === null && (gn = []), Mo(gn, t, e);
  }
  function ua(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function hi(t, e) {
    throw e.$$typeof === w ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function ms(t) {
    var e = t._init;
    return e(t._payload);
  }
  function bs(t) {
    function e(S, p) {
      if (t) {
        var x = S.deletions;
        x === null ? (S.deletions = [p], S.flags |= 16) : x.push(p);
      }
    }
    function l(S, p) {
      if (!t) return null;
      for (; p !== null; )
        e(S, p), p = p.sibling;
      return null;
    }
    function n(S) {
      for (var p = /* @__PURE__ */ new Map(); S !== null; )
        S.key !== null ? p.set(S.key, S) : p.set(S.index, S), S = S.sibling;
      return p;
    }
    function a(S, p) {
      return S = Ye(S, p), S.index = 0, S.sibling = null, S;
    }
    function i(S, p, x) {
      return S.index = x, t ? (x = S.alternate, x !== null ? (x = x.index, x < p ? (S.flags |= 67108866, p) : x) : (S.flags |= 67108866, p)) : (S.flags |= 1048576, p);
    }
    function u(S) {
      return t && S.alternate === null && (S.flags |= 67108866), S;
    }
    function c(S, p, x, _) {
      return p === null || p.tag !== 6 ? (p = zu(x, S.mode, _), p.return = S, p) : (p = a(p, x), p.return = S, p);
    }
    function d(S, p, x, _) {
      var k = x.type;
      return k === q ? M(
        S,
        p,
        x.props.children,
        _,
        x.key
      ) : p !== null && (p.elementType === k || typeof k == "object" && k !== null && k.$$typeof === Gt && ms(k) === p.type) ? (p = a(p, x.props), ua(p, x), p.return = S, p) : (p = $a(
        x.type,
        x.key,
        x.props,
        null,
        S.mode,
        _
      ), ua(p, x), p.return = S, p);
    }
    function E(S, p, x, _) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== x.containerInfo || p.stateNode.implementation !== x.implementation ? (p = wu(x, S.mode, _), p.return = S, p) : (p = a(p, x.children || []), p.return = S, p);
    }
    function M(S, p, x, _, k) {
      return p === null || p.tag !== 7 ? (p = Dl(
        x,
        S.mode,
        _,
        k
      ), p.return = S, p) : (p = a(p, x), p.return = S, p);
    }
    function U(S, p, x) {
      if (typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint")
        return p = zu(
          "" + p,
          S.mode,
          x
        ), p.return = S, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case N:
            return x = $a(
              p.type,
              p.key,
              p.props,
              null,
              S.mode,
              x
            ), ua(x, p), x.return = S, x;
          case H:
            return p = wu(
              p,
              S.mode,
              x
            ), p.return = S, p;
          case Gt:
            var _ = p._init;
            return p = _(p._payload), U(S, p, x);
        }
        if (Kt(p) || L(p))
          return p = Dl(
            p,
            S.mode,
            x,
            null
          ), p.return = S, p;
        if (typeof p.then == "function")
          return U(S, di(p), x);
        if (p.$$typeof === ht)
          return U(
            S,
            Pa(S, p),
            x
          );
        hi(S, p);
      }
      return null;
    }
    function A(S, p, x, _) {
      var k = p !== null ? p.key : null;
      if (typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint")
        return k !== null ? null : c(S, p, "" + x, _);
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case N:
            return x.key === k ? d(S, p, x, _) : null;
          case H:
            return x.key === k ? E(S, p, x, _) : null;
          case Gt:
            return k = x._init, x = k(x._payload), A(S, p, x, _);
        }
        if (Kt(x) || L(x))
          return k !== null ? null : M(S, p, x, _, null);
        if (typeof x.then == "function")
          return A(
            S,
            p,
            di(x),
            _
          );
        if (x.$$typeof === ht)
          return A(
            S,
            p,
            Pa(S, x),
            _
          );
        hi(S, x);
      }
      return null;
    }
    function O(S, p, x, _, k) {
      if (typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint")
        return S = S.get(x) || null, c(p, S, "" + _, k);
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case N:
            return S = S.get(
              _.key === null ? x : _.key
            ) || null, d(p, S, _, k);
          case H:
            return S = S.get(
              _.key === null ? x : _.key
            ) || null, E(p, S, _, k);
          case Gt:
            var nt = _._init;
            return _ = nt(_._payload), O(
              S,
              p,
              x,
              _,
              k
            );
        }
        if (Kt(_) || L(_))
          return S = S.get(x) || null, M(p, S, _, k, null);
        if (typeof _.then == "function")
          return O(
            S,
            p,
            x,
            di(_),
            k
          );
        if (_.$$typeof === ht)
          return O(
            S,
            p,
            x,
            Pa(p, _),
            k
          );
        hi(p, _);
      }
      return null;
    }
    function $(S, p, x, _) {
      for (var k = null, nt = null, C = p, Z = p = 0, Vt = null; C !== null && Z < x.length; Z++) {
        C.index > Z ? (Vt = C, C = null) : Vt = C.sibling;
        var dt = A(
          S,
          C,
          x[Z],
          _
        );
        if (dt === null) {
          C === null && (C = Vt);
          break;
        }
        t && C && dt.alternate === null && e(S, C), p = i(dt, p, Z), nt === null ? k = dt : nt.sibling = dt, nt = dt, C = Vt;
      }
      if (Z === x.length)
        return l(S, C), vt && Nl(S, Z), k;
      if (C === null) {
        for (; Z < x.length; Z++)
          C = U(S, x[Z], _), C !== null && (p = i(
            C,
            p,
            Z
          ), nt === null ? k = C : nt.sibling = C, nt = C);
        return vt && Nl(S, Z), k;
      }
      for (C = n(C); Z < x.length; Z++)
        Vt = O(
          C,
          S,
          Z,
          x[Z],
          _
        ), Vt !== null && (t && Vt.alternate !== null && C.delete(
          Vt.key === null ? Z : Vt.key
        ), p = i(
          Vt,
          p,
          Z
        ), nt === null ? k = Vt : nt.sibling = Vt, nt = Vt);
      return t && C.forEach(function(Sl) {
        return e(S, Sl);
      }), vt && Nl(S, Z), k;
    }
    function Q(S, p, x, _) {
      if (x == null) throw Error(r(151));
      for (var k = null, nt = null, C = p, Z = p = 0, Vt = null, dt = x.next(); C !== null && !dt.done; Z++, dt = x.next()) {
        C.index > Z ? (Vt = C, C = null) : Vt = C.sibling;
        var Sl = A(S, C, dt.value, _);
        if (Sl === null) {
          C === null && (C = Vt);
          break;
        }
        t && C && Sl.alternate === null && e(S, C), p = i(Sl, p, Z), nt === null ? k = Sl : nt.sibling = Sl, nt = Sl, C = Vt;
      }
      if (dt.done)
        return l(S, C), vt && Nl(S, Z), k;
      if (C === null) {
        for (; !dt.done; Z++, dt = x.next())
          dt = U(S, dt.value, _), dt !== null && (p = i(dt, p, Z), nt === null ? k = dt : nt.sibling = dt, nt = dt);
        return vt && Nl(S, Z), k;
      }
      for (C = n(C); !dt.done; Z++, dt = x.next())
        dt = O(C, S, Z, dt.value, _), dt !== null && (t && dt.alternate !== null && C.delete(dt.key === null ? Z : dt.key), p = i(dt, p, Z), nt === null ? k = dt : nt.sibling = dt, nt = dt);
      return t && C.forEach(function($v) {
        return e(S, $v);
      }), vt && Nl(S, Z), k;
    }
    function bt(S, p, x, _) {
      if (typeof x == "object" && x !== null && x.type === q && x.key === null && (x = x.props.children), typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case N:
            t: {
              for (var k = x.key; p !== null; ) {
                if (p.key === k) {
                  if (k = x.type, k === q) {
                    if (p.tag === 7) {
                      l(
                        S,
                        p.sibling
                      ), _ = a(
                        p,
                        x.props.children
                      ), _.return = S, S = _;
                      break t;
                    }
                  } else if (p.elementType === k || typeof k == "object" && k !== null && k.$$typeof === Gt && ms(k) === p.type) {
                    l(
                      S,
                      p.sibling
                    ), _ = a(p, x.props), ua(_, x), _.return = S, S = _;
                    break t;
                  }
                  l(S, p);
                  break;
                } else e(S, p);
                p = p.sibling;
              }
              x.type === q ? (_ = Dl(
                x.props.children,
                S.mode,
                _,
                x.key
              ), _.return = S, S = _) : (_ = $a(
                x.type,
                x.key,
                x.props,
                null,
                S.mode,
                _
              ), ua(_, x), _.return = S, S = _);
            }
            return u(S);
          case H:
            t: {
              for (k = x.key; p !== null; ) {
                if (p.key === k)
                  if (p.tag === 4 && p.stateNode.containerInfo === x.containerInfo && p.stateNode.implementation === x.implementation) {
                    l(
                      S,
                      p.sibling
                    ), _ = a(p, x.children || []), _.return = S, S = _;
                    break t;
                  } else {
                    l(S, p);
                    break;
                  }
                else e(S, p);
                p = p.sibling;
              }
              _ = wu(x, S.mode, _), _.return = S, S = _;
            }
            return u(S);
          case Gt:
            return k = x._init, x = k(x._payload), bt(
              S,
              p,
              x,
              _
            );
        }
        if (Kt(x))
          return $(
            S,
            p,
            x,
            _
          );
        if (L(x)) {
          if (k = L(x), typeof k != "function") throw Error(r(150));
          return x = k.call(x), Q(
            S,
            p,
            x,
            _
          );
        }
        if (typeof x.then == "function")
          return bt(
            S,
            p,
            di(x),
            _
          );
        if (x.$$typeof === ht)
          return bt(
            S,
            p,
            Pa(S, x),
            _
          );
        hi(S, x);
      }
      return typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint" ? (x = "" + x, p !== null && p.tag === 6 ? (l(S, p.sibling), _ = a(p, x), _.return = S, S = _) : (l(S, p), _ = zu(x, S.mode, _), _.return = S, S = _), u(S)) : l(S, p);
    }
    return function(S, p, x, _) {
      try {
        ia = 0;
        var k = bt(
          S,
          p,
          x,
          _
        );
        return gn = null, k;
      } catch (C) {
        if (C === Wn || C === ei) throw C;
        var nt = re(29, C, null, S.mode);
        return nt.lanes = _, nt.return = S, nt;
      } finally {
      }
    };
  }
  var yn = bs(!0), Ss = bs(!1), xe = R(null), Ne = null;
  function il(t) {
    var e = t.alternate;
    j(Yt, Yt.current & 1), j(xe, t), Ne === null && (e === null || fn.current !== null || e.memoizedState !== null) && (Ne = t);
  }
  function xs(t) {
    if (t.tag === 22) {
      if (j(Yt, Yt.current), j(xe, t), Ne === null) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (Ne = t);
      }
    } else ul();
  }
  function ul() {
    j(Yt, Yt.current), j(xe, xe.current);
  }
  function Le(t) {
    B(xe), Ne === t && (Ne = null), B(Yt);
  }
  var Yt = R(0);
  function vi(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || $c(l)))
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  function uc(t, e, l, n) {
    e = t.memoizedState, l = l(n, e), l = l == null ? e : m({}, e, l), t.memoizedState = l, t.lanes === 0 && (t.updateQueue.baseState = l);
  }
  var cc = {
    enqueueSetState: function(t, e, l) {
      t = t._reactInternals;
      var n = de(), a = ll(n);
      a.payload = e, l != null && (a.callback = l), e = nl(t, a, n), e !== null && (he(e, t, n), In(e, t, n));
    },
    enqueueReplaceState: function(t, e, l) {
      t = t._reactInternals;
      var n = de(), a = ll(n);
      a.tag = 1, a.payload = e, l != null && (a.callback = l), e = nl(t, a, n), e !== null && (he(e, t, n), In(e, t, n));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var l = de(), n = ll(l);
      n.tag = 2, e != null && (n.callback = e), e = nl(t, n, l), e !== null && (he(e, t, l), In(e, t, l));
    }
  };
  function Es(t, e, l, n, a, i, u) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(n, i, u) : e.prototype && e.prototype.isPureReactComponent ? !Gn(l, n) || !Gn(a, i) : !0;
  }
  function Ts(t, e, l, n) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(l, n), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(l, n), e.state !== t && cc.enqueueReplaceState(e, e.state, null);
  }
  function Bl(t, e) {
    var l = e;
    if ("ref" in e) {
      l = {};
      for (var n in e)
        n !== "ref" && (l[n] = e[n]);
    }
    if (t = t.defaultProps) {
      l === e && (l = m({}, l));
      for (var a in t)
        l[a] === void 0 && (l[a] = t[a]);
    }
    return l;
  }
  var gi = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  };
  function As(t) {
    gi(t);
  }
  function Os(t) {
    console.error(t);
  }
  function zs(t) {
    gi(t);
  }
  function yi(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function ws(t, e, l) {
    try {
      var n = t.onCaughtError;
      n(l.value, {
        componentStack: l.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function rc(t, e, l) {
    return l = ll(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      yi(t, e);
    }, l;
  }
  function Ms(t) {
    return t = ll(t), t.tag = 3, t;
  }
  function Ds(t, e, l, n) {
    var a = l.type.getDerivedStateFromError;
    if (typeof a == "function") {
      var i = n.value;
      t.payload = function() {
        return a(i);
      }, t.callback = function() {
        ws(e, l, n);
      };
    }
    var u = l.stateNode;
    u !== null && typeof u.componentDidCatch == "function" && (t.callback = function() {
      ws(e, l, n), typeof a != "function" && (dl === null ? dl = /* @__PURE__ */ new Set([this]) : dl.add(this));
      var c = n.stack;
      this.componentDidCatch(n.value, {
        componentStack: c !== null ? c : ""
      });
    });
  }
  function $h(t, e, l, n, a) {
    if (l.flags |= 32768, n !== null && typeof n == "object" && typeof n.then == "function") {
      if (e = l.alternate, e !== null && Kn(
        e,
        l,
        a,
        !0
      ), l = xe.current, l !== null) {
        switch (l.tag) {
          case 13:
            return Ne === null ? Uc() : l.alternate === null && _t === 0 && (_t = 3), l.flags &= -257, l.flags |= 65536, l.lanes = a, n === Yu ? l.flags |= 16384 : (e = l.updateQueue, e === null ? l.updateQueue = /* @__PURE__ */ new Set([n]) : e.add(n), Hc(t, n, a)), !1;
          case 22:
            return l.flags |= 65536, n === Yu ? l.flags |= 16384 : (e = l.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([n])
            }, l.updateQueue = e) : (l = e.retryQueue, l === null ? e.retryQueue = /* @__PURE__ */ new Set([n]) : l.add(n)), Hc(t, n, a)), !1;
        }
        throw Error(r(435, l.tag));
      }
      return Hc(t, n, a), Uc(), !1;
    }
    if (vt)
      return e = xe.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = a, n !== _u && (t = Error(r(422), { cause: n }), Zn(pe(t, l)))) : (n !== _u && (e = Error(r(423), {
        cause: n
      }), Zn(
        pe(e, l)
      )), t = t.current.alternate, t.flags |= 65536, a &= -a, t.lanes |= a, n = pe(n, l), a = rc(
        t.stateNode,
        n,
        a
      ), Cu(t, a), _t !== 4 && (_t = 2)), !1;
    var i = Error(r(520), { cause: n });
    if (i = pe(i, l), ha === null ? ha = [i] : ha.push(i), _t !== 4 && (_t = 2), e === null) return !0;
    n = pe(n, l), l = e;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, t = a & -a, l.lanes |= t, t = rc(l.stateNode, n, t), Cu(l, t), !1;
        case 1:
          if (e = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (dl === null || !dl.has(i))))
            return l.flags |= 65536, a &= -a, l.lanes |= a, a = Ms(a), Ds(
              a,
              t,
              l,
              n
            ), Cu(l, a), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var _s = Error(r(461)), kt = !1;
  function Lt(t, e, l, n) {
    e.child = t === null ? Ss(e, null, l, n) : yn(
      e,
      t.child,
      l,
      n
    );
  }
  function Ns(t, e, l, n, a) {
    l = l.render;
    var i = e.ref;
    if ("ref" in n) {
      var u = {};
      for (var c in n)
        c !== "ref" && (u[c] = n[c]);
    } else u = n;
    return ql(e), n = Qu(
      t,
      e,
      l,
      u,
      i,
      a
    ), c = Zu(), t !== null && !kt ? (Ku(t, e, a), Xe(t, e, a)) : (vt && c && Mu(e), e.flags |= 1, Lt(t, e, n, a), e.child);
  }
  function Us(t, e, l, n, a) {
    if (t === null) {
      var i = l.type;
      return typeof i == "function" && !Ou(i) && i.defaultProps === void 0 && l.compare === null ? (e.tag = 15, e.type = i, Rs(
        t,
        e,
        i,
        n,
        a
      )) : (t = $a(
        l.type,
        null,
        n,
        e,
        e.mode,
        a
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (i = t.child, !yc(t, a)) {
      var u = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Gn, l(u, n) && t.ref === e.ref)
        return Xe(t, e, a);
    }
    return e.flags |= 1, t = Ye(i, n), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Rs(t, e, l, n, a) {
    if (t !== null) {
      var i = t.memoizedProps;
      if (Gn(i, n) && t.ref === e.ref)
        if (kt = !1, e.pendingProps = n = i, yc(t, a))
          (t.flags & 131072) !== 0 && (kt = !0);
        else
          return e.lanes = t.lanes, Xe(t, e, a);
    }
    return oc(
      t,
      e,
      l,
      n,
      a
    );
  }
  function Hs(t, e, l) {
    var n = e.pendingProps, a = n.children, i = t !== null ? t.memoizedState : null;
    if (n.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (n = i !== null ? i.baseLanes | l : l, t !== null) {
          for (a = e.child = t.child, i = 0; a !== null; )
            i = i | a.lanes | a.childLanes, a = a.sibling;
          e.childLanes = i & ~n;
        } else e.childLanes = 0, e.child = null;
        return qs(
          t,
          e,
          n,
          l
        );
      }
      if ((l & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && ti(
          e,
          i !== null ? i.cachePool : null
        ), i !== null ? Ro(e, i) : Gu(), xs(e);
      else
        return e.lanes = e.childLanes = 536870912, qs(
          t,
          e,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (ti(e, i.cachePool), Ro(e, i), ul(), e.memoizedState = null) : (t !== null && ti(e, null), Gu(), ul());
    return Lt(t, e, a, l), e.child;
  }
  function qs(t, e, l, n) {
    var a = ju();
    return a = a === null ? null : { parent: jt._currentValue, pool: a }, e.memoizedState = {
      baseLanes: l,
      cachePool: a
    }, t !== null && ti(e, null), Gu(), xs(e), t !== null && Kn(t, e, n, !0), null;
  }
  function pi(t, e) {
    var l = e.ref;
    if (l === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(r(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function oc(t, e, l, n, a) {
    return ql(e), l = Qu(
      t,
      e,
      l,
      n,
      void 0,
      a
    ), n = Zu(), t !== null && !kt ? (Ku(t, e, a), Xe(t, e, a)) : (vt && n && Mu(e), e.flags |= 1, Lt(t, e, l, a), e.child);
  }
  function js(t, e, l, n, a, i) {
    return ql(e), e.updateQueue = null, l = qo(
      e,
      n,
      l,
      a
    ), Ho(t), n = Zu(), t !== null && !kt ? (Ku(t, e, i), Xe(t, e, i)) : (vt && n && Mu(e), e.flags |= 1, Lt(t, e, l, i), e.child);
  }
  function Ys(t, e, l, n, a) {
    if (ql(e), e.stateNode === null) {
      var i = un, u = l.contextType;
      typeof u == "object" && u !== null && (i = $t(u)), i = new l(n, i), e.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = cc, e.stateNode = i, i._reactInternals = e, i = e.stateNode, i.props = n, i.state = e.memoizedState, i.refs = {}, Bu(e), u = l.contextType, i.context = typeof u == "object" && u !== null ? $t(u) : un, i.state = e.memoizedState, u = l.getDerivedStateFromProps, typeof u == "function" && (uc(
        e,
        l,
        u,
        n
      ), i.state = e.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (u = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), u !== i.state && cc.enqueueReplaceState(i, i.state, null), ta(e, n, i, a), Pn(), i.state = e.memoizedState), typeof i.componentDidMount == "function" && (e.flags |= 4194308), n = !0;
    } else if (t === null) {
      i = e.stateNode;
      var c = e.memoizedProps, d = Bl(l, c);
      i.props = d;
      var E = i.context, M = l.contextType;
      u = un, typeof M == "object" && M !== null && (u = $t(M));
      var U = l.getDerivedStateFromProps;
      M = typeof U == "function" || typeof i.getSnapshotBeforeUpdate == "function", c = e.pendingProps !== c, M || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c || E !== u) && Ts(
        e,
        i,
        n,
        u
      ), el = !1;
      var A = e.memoizedState;
      i.state = A, ta(e, n, i, a), Pn(), E = e.memoizedState, c || A !== E || el ? (typeof U == "function" && (uc(
        e,
        l,
        U,
        n
      ), E = e.memoizedState), (d = el || Es(
        e,
        l,
        d,
        n,
        A,
        E,
        u
      )) ? (M || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = n, e.memoizedState = E), i.props = n, i.state = E, i.context = u, n = d) : (typeof i.componentDidMount == "function" && (e.flags |= 4194308), n = !1);
    } else {
      i = e.stateNode, ku(t, e), u = e.memoizedProps, M = Bl(l, u), i.props = M, U = e.pendingProps, A = i.context, E = l.contextType, d = un, typeof E == "object" && E !== null && (d = $t(E)), c = l.getDerivedStateFromProps, (E = typeof c == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== U || A !== d) && Ts(
        e,
        i,
        n,
        d
      ), el = !1, A = e.memoizedState, i.state = A, ta(e, n, i, a), Pn();
      var O = e.memoizedState;
      u !== U || A !== O || el || t !== null && t.dependencies !== null && Ia(t.dependencies) ? (typeof c == "function" && (uc(
        e,
        l,
        c,
        n
      ), O = e.memoizedState), (M = el || Es(
        e,
        l,
        M,
        n,
        A,
        O,
        d
      ) || t !== null && t.dependencies !== null && Ia(t.dependencies)) ? (E || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(n, O, d), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        n,
        O,
        d
      )), typeof i.componentDidUpdate == "function" && (e.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === t.memoizedProps && A === t.memoizedState || (e.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === t.memoizedProps && A === t.memoizedState || (e.flags |= 1024), e.memoizedProps = n, e.memoizedState = O), i.props = n, i.state = O, i.context = d, n = M) : (typeof i.componentDidUpdate != "function" || u === t.memoizedProps && A === t.memoizedState || (e.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === t.memoizedProps && A === t.memoizedState || (e.flags |= 1024), n = !1);
    }
    return i = n, pi(t, e), n = (e.flags & 128) !== 0, i || n ? (i = e.stateNode, l = n && typeof l.getDerivedStateFromError != "function" ? null : i.render(), e.flags |= 1, t !== null && n ? (e.child = yn(
      e,
      t.child,
      null,
      a
    ), e.child = yn(
      e,
      null,
      l,
      a
    )) : Lt(t, e, l, a), e.memoizedState = i.state, t = e.child) : t = Xe(
      t,
      e,
      a
    ), t;
  }
  function Bs(t, e, l, n) {
    return Qn(), e.flags |= 256, Lt(t, e, l, n), e.child;
  }
  var sc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function fc(t) {
    return { baseLanes: t, cachePool: Oo() };
  }
  function dc(t, e, l) {
    return t = t !== null ? t.childLanes & ~l : 0, e && (t |= Ee), t;
  }
  function ks(t, e, l) {
    var n = e.pendingProps, a = !1, i = (e.flags & 128) !== 0, u;
    if ((u = i) || (u = t !== null && t.memoizedState === null ? !1 : (Yt.current & 2) !== 0), u && (a = !0, e.flags &= -129), u = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (vt) {
        if (a ? il(e) : ul(), vt) {
          var c = Dt, d;
          if (d = c) {
            t: {
              for (d = c, c = _e; d.nodeType !== 8; ) {
                if (!c) {
                  c = null;
                  break t;
                }
                if (d = we(
                  d.nextSibling
                ), d === null) {
                  c = null;
                  break t;
                }
              }
              c = d;
            }
            c !== null ? (e.memoizedState = {
              dehydrated: c,
              treeContext: _l !== null ? { id: Be, overflow: ke } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, d = re(
              18,
              null,
              null,
              0
            ), d.stateNode = c, d.return = e, e.child = d, Ft = e, Dt = null, d = !0) : d = !1;
          }
          d || Rl(e);
        }
        if (c = e.memoizedState, c !== null && (c = c.dehydrated, c !== null))
          return $c(c) ? e.lanes = 32 : e.lanes = 536870912, null;
        Le(e);
      }
      return c = n.children, n = n.fallback, a ? (ul(), a = e.mode, c = mi(
        { mode: "hidden", children: c },
        a
      ), n = Dl(
        n,
        a,
        l,
        null
      ), c.return = e, n.return = e, c.sibling = n, e.child = c, a = e.child, a.memoizedState = fc(l), a.childLanes = dc(
        t,
        u,
        l
      ), e.memoizedState = sc, n) : (il(e), hc(e, c));
    }
    if (d = t.memoizedState, d !== null && (c = d.dehydrated, c !== null)) {
      if (i)
        e.flags & 256 ? (il(e), e.flags &= -257, e = vc(
          t,
          e,
          l
        )) : e.memoizedState !== null ? (ul(), e.child = t.child, e.flags |= 128, e = null) : (ul(), a = n.fallback, c = e.mode, n = mi(
          { mode: "visible", children: n.children },
          c
        ), a = Dl(
          a,
          c,
          l,
          null
        ), a.flags |= 2, n.return = e, a.return = e, n.sibling = a, e.child = n, yn(
          e,
          t.child,
          null,
          l
        ), n = e.child, n.memoizedState = fc(l), n.childLanes = dc(
          t,
          u,
          l
        ), e.memoizedState = sc, e = a);
      else if (il(e), $c(c)) {
        if (u = c.nextSibling && c.nextSibling.dataset, u) var E = u.dgst;
        u = E, n = Error(r(419)), n.stack = "", n.digest = u, Zn({ value: n, source: null, stack: null }), e = vc(
          t,
          e,
          l
        );
      } else if (kt || Kn(t, e, l, !1), u = (l & t.childLanes) !== 0, kt || u) {
        if (u = Tt, u !== null && (n = l & -l, n = (n & 42) !== 0 ? 1 : Wi(n), n = (n & (u.suspendedLanes | l)) !== 0 ? 0 : n, n !== 0 && n !== d.retryLane))
          throw d.retryLane = n, an(t, n), he(u, t, n), _s;
        c.data === "$?" || Uc(), e = vc(
          t,
          e,
          l
        );
      } else
        c.data === "$?" ? (e.flags |= 192, e.child = t.child, e = null) : (t = d.treeContext, Dt = we(
          c.nextSibling
        ), Ft = e, vt = !0, Ul = null, _e = !1, t !== null && (be[Se++] = Be, be[Se++] = ke, be[Se++] = _l, Be = t.id, ke = t.overflow, _l = e), e = hc(
          e,
          n.children
        ), e.flags |= 4096);
      return e;
    }
    return a ? (ul(), a = n.fallback, c = e.mode, d = t.child, E = d.sibling, n = Ye(d, {
      mode: "hidden",
      children: n.children
    }), n.subtreeFlags = d.subtreeFlags & 65011712, E !== null ? a = Ye(E, a) : (a = Dl(
      a,
      c,
      l,
      null
    ), a.flags |= 2), a.return = e, n.return = e, n.sibling = a, e.child = n, n = a, a = e.child, c = t.child.memoizedState, c === null ? c = fc(l) : (d = c.cachePool, d !== null ? (E = jt._currentValue, d = d.parent !== E ? { parent: E, pool: E } : d) : d = Oo(), c = {
      baseLanes: c.baseLanes | l,
      cachePool: d
    }), a.memoizedState = c, a.childLanes = dc(
      t,
      u,
      l
    ), e.memoizedState = sc, n) : (il(e), l = t.child, t = l.sibling, l = Ye(l, {
      mode: "visible",
      children: n.children
    }), l.return = e, l.sibling = null, t !== null && (u = e.deletions, u === null ? (e.deletions = [t], e.flags |= 16) : u.push(t)), e.child = l, e.memoizedState = null, l);
  }
  function hc(t, e) {
    return e = mi(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function mi(t, e) {
    return t = re(22, t, null, e), t.lanes = 0, t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }, t;
  }
  function vc(t, e, l) {
    return yn(e, t.child, null, l), t = hc(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function Cs(t, e, l) {
    t.lanes |= e;
    var n = t.alternate;
    n !== null && (n.lanes |= e), Uu(t.return, e, l);
  }
  function gc(t, e, l, n, a) {
    var i = t.memoizedState;
    i === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: n,
      tail: l,
      tailMode: a
    } : (i.isBackwards = e, i.rendering = null, i.renderingStartTime = 0, i.last = n, i.tail = l, i.tailMode = a);
  }
  function Vs(t, e, l) {
    var n = e.pendingProps, a = n.revealOrder, i = n.tail;
    if (Lt(t, e, n.children, l), n = Yt.current, (n & 2) !== 0)
      n = n & 1 | 2, e.flags |= 128;
    else {
      if (t !== null && (t.flags & 128) !== 0)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13)
            t.memoizedState !== null && Cs(t, l, e);
          else if (t.tag === 19)
            Cs(t, l, e);
          else if (t.child !== null) {
            t.child.return = t, t = t.child;
            continue;
          }
          if (t === e) break t;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e)
              break t;
            t = t.return;
          }
          t.sibling.return = t.return, t = t.sibling;
        }
      n &= 1;
    }
    switch (j(Yt, n), a) {
      case "forwards":
        for (l = e.child, a = null; l !== null; )
          t = l.alternate, t !== null && vi(t) === null && (a = l), l = l.sibling;
        l = a, l === null ? (a = e.child, e.child = null) : (a = l.sibling, l.sibling = null), gc(
          e,
          !1,
          a,
          l,
          i
        );
        break;
      case "backwards":
        for (l = null, a = e.child, e.child = null; a !== null; ) {
          if (t = a.alternate, t !== null && vi(t) === null) {
            e.child = a;
            break;
          }
          t = a.sibling, a.sibling = l, l = a, a = t;
        }
        gc(
          e,
          !0,
          l,
          null,
          i
        );
        break;
      case "together":
        gc(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function Xe(t, e, l) {
    if (t !== null && (e.dependencies = t.dependencies), fl |= e.lanes, (l & e.childLanes) === 0)
      if (t !== null) {
        if (Kn(
          t,
          e,
          l,
          !1
        ), (l & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(r(153));
    if (e.child !== null) {
      for (t = e.child, l = Ye(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        t = t.sibling, l = l.sibling = Ye(t, t.pendingProps), l.return = e;
      l.sibling = null;
    }
    return e.child;
  }
  function yc(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && Ia(t)));
  }
  function Wh(t, e, l) {
    switch (e.tag) {
      case 3:
        Ot(e, e.stateNode.containerInfo), tl(e, jt, t.memoizedState.cache), Qn();
        break;
      case 27:
      case 5:
        Qi(e);
        break;
      case 4:
        Ot(e, e.stateNode.containerInfo);
        break;
      case 10:
        tl(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 13:
        var n = e.memoizedState;
        if (n !== null)
          return n.dehydrated !== null ? (il(e), e.flags |= 128, null) : (l & e.child.childLanes) !== 0 ? ks(t, e, l) : (il(e), t = Xe(
            t,
            e,
            l
          ), t !== null ? t.sibling : null);
        il(e);
        break;
      case 19:
        var a = (t.flags & 128) !== 0;
        if (n = (l & e.childLanes) !== 0, n || (Kn(
          t,
          e,
          l,
          !1
        ), n = (l & e.childLanes) !== 0), a) {
          if (n)
            return Vs(
              t,
              e,
              l
            );
          e.flags |= 128;
        }
        if (a = e.memoizedState, a !== null && (a.rendering = null, a.tail = null, a.lastEffect = null), j(Yt, Yt.current), n) break;
        return null;
      case 22:
      case 23:
        return e.lanes = 0, Hs(t, e, l);
      case 24:
        tl(e, jt, t.memoizedState.cache);
    }
    return Xe(t, e, l);
  }
  function Gs(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        kt = !0;
      else {
        if (!yc(t, l) && (e.flags & 128) === 0)
          return kt = !1, Wh(
            t,
            e,
            l
          );
        kt = (t.flags & 131072) !== 0;
      }
    else
      kt = !1, vt && (e.flags & 1048576) !== 0 && mo(e, Fa, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          t = e.pendingProps;
          var n = e.elementType, a = n._init;
          if (n = a(n._payload), e.type = n, typeof n == "function")
            Ou(n) ? (t = Bl(n, t), e.tag = 1, e = Ys(
              null,
              e,
              n,
              t,
              l
            )) : (e.tag = 0, e = oc(
              null,
              e,
              n,
              t,
              l
            ));
          else {
            if (n != null) {
              if (a = n.$$typeof, a === et) {
                e.tag = 11, e = Ns(
                  null,
                  e,
                  n,
                  t,
                  l
                );
                break t;
              } else if (a === St) {
                e.tag = 14, e = Us(
                  null,
                  e,
                  n,
                  t,
                  l
                );
                break t;
              }
            }
            throw e = Tl(n) || n, Error(r(306, e, ""));
          }
        }
        return e;
      case 0:
        return oc(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 1:
        return n = e.type, a = Bl(
          n,
          e.pendingProps
        ), Ys(
          t,
          e,
          n,
          a,
          l
        );
      case 3:
        t: {
          if (Ot(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(r(387));
          n = e.pendingProps;
          var i = e.memoizedState;
          a = i.element, ku(t, e), ta(e, n, null, l);
          var u = e.memoizedState;
          if (n = u.cache, tl(e, jt, n), n !== i.cache && Ru(
            e,
            [jt],
            l,
            !0
          ), Pn(), n = u.element, i.isDehydrated)
            if (i = {
              element: n,
              isDehydrated: !1,
              cache: u.cache
            }, e.updateQueue.baseState = i, e.memoizedState = i, e.flags & 256) {
              e = Bs(
                t,
                e,
                n,
                l
              );
              break t;
            } else if (n !== a) {
              a = pe(
                Error(r(424)),
                e
              ), Zn(a), e = Bs(
                t,
                e,
                n,
                l
              );
              break t;
            } else {
              switch (t = e.stateNode.containerInfo, t.nodeType) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (Dt = we(t.firstChild), Ft = e, vt = !0, Ul = null, _e = !0, l = Ss(
                e,
                null,
                n,
                l
              ), e.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (Qn(), n === a) {
              e = Xe(
                t,
                e,
                l
              );
              break t;
            }
            Lt(
              t,
              e,
              n,
              l
            );
          }
          e = e.child;
        }
        return e;
      case 26:
        return pi(t, e), t === null ? (l = Kf(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = l : vt || (l = e.type, t = e.pendingProps, n = Ui(
          W.current
        ).createElement(l), n[Jt] = e, n[It] = t, Qt(n, l, t), Bt(n), e.stateNode = n) : e.memoizedState = Kf(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return Qi(e), t === null && vt && (n = e.stateNode = Xf(
          e.type,
          e.pendingProps,
          W.current
        ), Ft = e, _e = !0, a = Dt, gl(e.type) ? (Wc = a, Dt = we(
          n.firstChild
        )) : Dt = a), Lt(
          t,
          e,
          e.pendingProps.children,
          l
        ), pi(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && vt && ((a = n = Dt) && (n = Av(
          n,
          e.type,
          e.pendingProps,
          _e
        ), n !== null ? (e.stateNode = n, Ft = e, Dt = we(
          n.firstChild
        ), _e = !1, a = !0) : a = !1), a || Rl(e)), Qi(e), a = e.type, i = e.pendingProps, u = t !== null ? t.memoizedProps : null, n = i.children, Zc(a, i) ? n = null : u !== null && Zc(a, u) && (e.flags |= 32), e.memoizedState !== null && (a = Qu(
          t,
          e,
          Gh,
          null,
          null,
          l
        ), Ea._currentValue = a), pi(t, e), Lt(t, e, n, l), e.child;
      case 6:
        return t === null && vt && ((t = l = Dt) && (l = Ov(
          l,
          e.pendingProps,
          _e
        ), l !== null ? (e.stateNode = l, Ft = e, Dt = null, t = !0) : t = !1), t || Rl(e)), null;
      case 13:
        return ks(t, e, l);
      case 4:
        return Ot(
          e,
          e.stateNode.containerInfo
        ), n = e.pendingProps, t === null ? e.child = yn(
          e,
          null,
          n,
          l
        ) : Lt(
          t,
          e,
          n,
          l
        ), e.child;
      case 11:
        return Ns(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 7:
        return Lt(
          t,
          e,
          e.pendingProps,
          l
        ), e.child;
      case 8:
        return Lt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 12:
        return Lt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 10:
        return n = e.pendingProps, tl(e, e.type, n.value), Lt(
          t,
          e,
          n.children,
          l
        ), e.child;
      case 9:
        return a = e.type._context, n = e.pendingProps.children, ql(e), a = $t(a), n = n(a), e.flags |= 1, Lt(t, e, n, l), e.child;
      case 14:
        return Us(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 15:
        return Rs(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 19:
        return Vs(t, e, l);
      case 31:
        return n = e.pendingProps, l = e.mode, n = {
          mode: n.mode,
          children: n.children
        }, t === null ? (l = mi(
          n,
          l
        ), l.ref = e.ref, e.child = l, l.return = e, e = l) : (l = Ye(t.child, n), l.ref = e.ref, e.child = l, l.return = e, e = l), e;
      case 22:
        return Hs(t, e, l);
      case 24:
        return ql(e), n = $t(jt), t === null ? (a = ju(), a === null && (a = Tt, i = Hu(), a.pooledCache = i, i.refCount++, i !== null && (a.pooledCacheLanes |= l), a = i), e.memoizedState = {
          parent: n,
          cache: a
        }, Bu(e), tl(e, jt, a)) : ((t.lanes & l) !== 0 && (ku(t, e), ta(e, null, null, l), Pn()), a = t.memoizedState, i = e.memoizedState, a.parent !== n ? (a = { parent: n, cache: n }, e.memoizedState = a, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = a), tl(e, jt, n)) : (n = i.cache, tl(e, jt, n), n !== a.cache && Ru(
          e,
          [jt],
          l,
          !0
        ))), Lt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(r(156, e.tag));
  }
  function Qe(t) {
    t.flags |= 4;
  }
  function Ls(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !If(e)) {
      if (e = xe.current, e !== null && ((ut & 4194048) === ut ? Ne !== null : (ut & 62914560) !== ut && (ut & 536870912) === 0 || e !== Ne))
        throw Fn = Yu, zo;
      t.flags |= 8192;
    }
  }
  function bi(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Sr() : 536870912, t.lanes |= e, Sn |= e);
  }
  function ca(t, e) {
    if (!vt)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var l = null; e !== null; )
            e.alternate !== null && (l = e), e = e.sibling;
          l === null ? t.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = t.tail;
          for (var n = null; l !== null; )
            l.alternate !== null && (n = l), l = l.sibling;
          n === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : n.sibling = null;
      }
  }
  function Mt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, l = 0, n = 0;
    if (e)
      for (var a = t.child; a !== null; )
        l |= a.lanes | a.childLanes, n |= a.subtreeFlags & 65011712, n |= a.flags & 65011712, a.return = t, a = a.sibling;
    else
      for (a = t.child; a !== null; )
        l |= a.lanes | a.childLanes, n |= a.subtreeFlags, n |= a.flags, a.return = t, a = a.sibling;
    return t.subtreeFlags |= n, t.childLanes = l, e;
  }
  function Fh(t, e, l) {
    var n = e.pendingProps;
    switch (Du(e), e.tag) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Mt(e), null;
      case 1:
        return Mt(e), null;
      case 3:
        return l = e.stateNode, n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), Ve(jt), We(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (t === null || t.child === null) && (Xn(e) ? Qe(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, xo())), Mt(e), null;
      case 26:
        return l = e.memoizedState, t === null ? (Qe(e), l !== null ? (Mt(e), Ls(e, l)) : (Mt(e), e.flags &= -16777217)) : l ? l !== t.memoizedState ? (Qe(e), Mt(e), Ls(e, l)) : (Mt(e), e.flags &= -16777217) : (t.memoizedProps !== n && Qe(e), Mt(e), e.flags &= -16777217), null;
      case 27:
        _a(e), l = W.current;
        var a = e.type;
        if (t !== null && e.stateNode != null)
          t.memoizedProps !== n && Qe(e);
        else {
          if (!n) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Mt(e), null;
          }
          t = X.current, Xn(e) ? bo(e) : (t = Xf(a, n, l), e.stateNode = t, Qe(e));
        }
        return Mt(e), null;
      case 5:
        if (_a(e), l = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== n && Qe(e);
        else {
          if (!n) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Mt(e), null;
          }
          if (t = X.current, Xn(e))
            bo(e);
          else {
            switch (a = Ui(
              W.current
            ), t) {
              case 1:
                t = a.createElementNS(
                  "http://www.w3.org/2000/svg",
                  l
                );
                break;
              case 2:
                t = a.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  l
                );
                break;
              default:
                switch (l) {
                  case "svg":
                    t = a.createElementNS(
                      "http://www.w3.org/2000/svg",
                      l
                    );
                    break;
                  case "math":
                    t = a.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      l
                    );
                    break;
                  case "script":
                    t = a.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild);
                    break;
                  case "select":
                    t = typeof n.is == "string" ? a.createElement("select", { is: n.is }) : a.createElement("select"), n.multiple ? t.multiple = !0 : n.size && (t.size = n.size);
                    break;
                  default:
                    t = typeof n.is == "string" ? a.createElement(l, { is: n.is }) : a.createElement(l);
                }
            }
            t[Jt] = e, t[It] = n;
            t: for (a = e.child; a !== null; ) {
              if (a.tag === 5 || a.tag === 6)
                t.appendChild(a.stateNode);
              else if (a.tag !== 4 && a.tag !== 27 && a.child !== null) {
                a.child.return = a, a = a.child;
                continue;
              }
              if (a === e) break t;
              for (; a.sibling === null; ) {
                if (a.return === null || a.return === e)
                  break t;
                a = a.return;
              }
              a.sibling.return = a.return, a = a.sibling;
            }
            e.stateNode = t;
            t: switch (Qt(t, l, n), l) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                t = !!n.autoFocus;
                break t;
              case "img":
                t = !0;
                break t;
              default:
                t = !1;
            }
            t && Qe(e);
          }
        }
        return Mt(e), e.flags &= -16777217, null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== n && Qe(e);
        else {
          if (typeof n != "string" && e.stateNode === null)
            throw Error(r(166));
          if (t = W.current, Xn(e)) {
            if (t = e.stateNode, l = e.memoizedProps, n = null, a = Ft, a !== null)
              switch (a.tag) {
                case 27:
                case 5:
                  n = a.memoizedProps;
              }
            t[Jt] = e, t = !!(t.nodeValue === l || n !== null && n.suppressHydrationWarning === !0 || Yf(t.nodeValue, l)), t || Rl(e);
          } else
            t = Ui(t).createTextNode(
              n
            ), t[Jt] = e, e.stateNode = t;
        }
        return Mt(e), null;
      case 13:
        if (n = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (a = Xn(e), n !== null && n.dehydrated !== null) {
            if (t === null) {
              if (!a) throw Error(r(318));
              if (a = e.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(r(317));
              a[Jt] = e;
            } else
              Qn(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Mt(e), a = !1;
          } else
            a = xo(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = a), a = !0;
          if (!a)
            return e.flags & 256 ? (Le(e), e) : (Le(e), null);
        }
        if (Le(e), (e.flags & 128) !== 0)
          return e.lanes = l, e;
        if (l = n !== null, t = t !== null && t.memoizedState !== null, l) {
          n = e.child, a = null, n.alternate !== null && n.alternate.memoizedState !== null && n.alternate.memoizedState.cachePool !== null && (a = n.alternate.memoizedState.cachePool.pool);
          var i = null;
          n.memoizedState !== null && n.memoizedState.cachePool !== null && (i = n.memoizedState.cachePool.pool), i !== a && (n.flags |= 2048);
        }
        return l !== t && l && (e.child.flags |= 8192), bi(e, e.updateQueue), Mt(e), null;
      case 4:
        return We(), t === null && Vc(e.stateNode.containerInfo), Mt(e), null;
      case 10:
        return Ve(e.type), Mt(e), null;
      case 19:
        if (B(Yt), a = e.memoizedState, a === null) return Mt(e), null;
        if (n = (e.flags & 128) !== 0, i = a.rendering, i === null)
          if (n) ca(a, !1);
          else {
            if (_t !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (i = vi(t), i !== null) {
                  for (e.flags |= 128, ca(a, !1), t = i.updateQueue, e.updateQueue = t, bi(e, t), e.subtreeFlags = 0, t = l, l = e.child; l !== null; )
                    po(l, t), l = l.sibling;
                  return j(
                    Yt,
                    Yt.current & 1 | 2
                  ), e.child;
                }
                t = t.sibling;
              }
            a.tail !== null && De() > Ei && (e.flags |= 128, n = !0, ca(a, !1), e.lanes = 4194304);
          }
        else {
          if (!n)
            if (t = vi(i), t !== null) {
              if (e.flags |= 128, n = !0, t = t.updateQueue, e.updateQueue = t, bi(e, t), ca(a, !0), a.tail === null && a.tailMode === "hidden" && !i.alternate && !vt)
                return Mt(e), null;
            } else
              2 * De() - a.renderingStartTime > Ei && l !== 536870912 && (e.flags |= 128, n = !0, ca(a, !1), e.lanes = 4194304);
          a.isBackwards ? (i.sibling = e.child, e.child = i) : (t = a.last, t !== null ? t.sibling = i : e.child = i, a.last = i);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = De(), e.sibling = null, t = Yt.current, j(Yt, n ? t & 1 | 2 : t & 1), e) : (Mt(e), null);
      case 22:
      case 23:
        return Le(e), Lu(), n = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== n && (e.flags |= 8192) : n && (e.flags |= 8192), n ? (l & 536870912) !== 0 && (e.flags & 128) === 0 && (Mt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Mt(e), l = e.updateQueue, l !== null && bi(e, l.retryQueue), l = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), n = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), n !== l && (e.flags |= 2048), t !== null && B(jl), null;
      case 24:
        return l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), Ve(jt), Mt(e), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, e.tag));
  }
  function Ih(t, e) {
    switch (Du(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return Ve(jt), We(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return _a(e), null;
      case 13:
        if (Le(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(r(340));
          Qn();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return B(Yt), null;
      case 4:
        return We(), null;
      case 10:
        return Ve(e.type), null;
      case 22:
      case 23:
        return Le(e), Lu(), t !== null && B(jl), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return Ve(jt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Xs(t, e) {
    switch (Du(e), e.tag) {
      case 3:
        Ve(jt), We();
        break;
      case 26:
      case 27:
      case 5:
        _a(e);
        break;
      case 4:
        We();
        break;
      case 13:
        Le(e);
        break;
      case 19:
        B(Yt);
        break;
      case 10:
        Ve(e.type);
        break;
      case 22:
      case 23:
        Le(e), Lu(), t !== null && B(jl);
        break;
      case 24:
        Ve(jt);
    }
  }
  function ra(t, e) {
    try {
      var l = e.updateQueue, n = l !== null ? l.lastEffect : null;
      if (n !== null) {
        var a = n.next;
        l = a;
        do {
          if ((l.tag & t) === t) {
            n = void 0;
            var i = l.create, u = l.inst;
            n = i(), u.destroy = n;
          }
          l = l.next;
        } while (l !== a);
      }
    } catch (c) {
      Et(e, e.return, c);
    }
  }
  function cl(t, e, l) {
    try {
      var n = e.updateQueue, a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var i = a.next;
        n = i;
        do {
          if ((n.tag & t) === t) {
            var u = n.inst, c = u.destroy;
            if (c !== void 0) {
              u.destroy = void 0, a = e;
              var d = l, E = c;
              try {
                E();
              } catch (M) {
                Et(
                  a,
                  d,
                  M
                );
              }
            }
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (M) {
      Et(e, e.return, M);
    }
  }
  function Qs(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        Uo(e, l);
      } catch (n) {
        Et(t, t.return, n);
      }
    }
  }
  function Zs(t, e, l) {
    l.props = Bl(
      t.type,
      t.memoizedProps
    ), l.state = t.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (n) {
      Et(t, e, n);
    }
  }
  function oa(t, e) {
    try {
      var l = t.ref;
      if (l !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var n = t.stateNode;
            break;
          case 30:
            n = t.stateNode;
            break;
          default:
            n = t.stateNode;
        }
        typeof l == "function" ? t.refCleanup = l(n) : l.current = n;
      }
    } catch (a) {
      Et(t, e, a);
    }
  }
  function Ue(t, e) {
    var l = t.ref, n = t.refCleanup;
    if (l !== null)
      if (typeof n == "function")
        try {
          n();
        } catch (a) {
          Et(t, e, a);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (a) {
          Et(t, e, a);
        }
      else l.current = null;
  }
  function Ks(t) {
    var e = t.type, l = t.memoizedProps, n = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && n.focus();
          break t;
        case "img":
          l.src ? n.src = l.src : l.srcSet && (n.srcset = l.srcSet);
      }
    } catch (a) {
      Et(t, t.return, a);
    }
  }
  function pc(t, e, l) {
    try {
      var n = t.stateNode;
      bv(n, t.type, l, e), n[It] = e;
    } catch (a) {
      Et(t, t.return, a);
    }
  }
  function Js(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && gl(t.type) || t.tag === 4;
  }
  function mc(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || Js(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && gl(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function bc(t, e, l) {
    var n = t.tag;
    if (n === 5 || n === 6)
      t = t.stateNode, e ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(t, e) : (e = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, e.appendChild(t), l = l._reactRootContainer, l != null || e.onclick !== null || (e.onclick = Ni));
    else if (n !== 4 && (n === 27 && gl(t.type) && (l = t.stateNode, e = null), t = t.child, t !== null))
      for (bc(t, e, l), t = t.sibling; t !== null; )
        bc(t, e, l), t = t.sibling;
  }
  function Si(t, e, l) {
    var n = t.tag;
    if (n === 5 || n === 6)
      t = t.stateNode, e ? l.insertBefore(t, e) : l.appendChild(t);
    else if (n !== 4 && (n === 27 && gl(t.type) && (l = t.stateNode), t = t.child, t !== null))
      for (Si(t, e, l), t = t.sibling; t !== null; )
        Si(t, e, l), t = t.sibling;
  }
  function $s(t) {
    var e = t.stateNode, l = t.memoizedProps;
    try {
      for (var n = t.type, a = e.attributes; a.length; )
        e.removeAttributeNode(a[0]);
      Qt(e, n, l), e[Jt] = t, e[It] = l;
    } catch (i) {
      Et(t, t.return, i);
    }
  }
  var Ze = !1, Ut = !1, Sc = !1, Ws = typeof WeakSet == "function" ? WeakSet : Set, Ct = null;
  function Ph(t, e) {
    if (t = t.containerInfo, Xc = Bi, t = uo(t), mu(t)) {
      if ("selectionStart" in t)
        var l = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          l = (l = t.ownerDocument) && l.defaultView || window;
          var n = l.getSelection && l.getSelection();
          if (n && n.rangeCount !== 0) {
            l = n.anchorNode;
            var a = n.anchorOffset, i = n.focusNode;
            n = n.focusOffset;
            try {
              l.nodeType, i.nodeType;
            } catch (Q) {
              l = null;
              break t;
            }
            var u = 0, c = -1, d = -1, E = 0, M = 0, U = t, A = null;
            e: for (; ; ) {
              for (var O; U !== l || a !== 0 && U.nodeType !== 3 || (c = u + a), U !== i || n !== 0 && U.nodeType !== 3 || (d = u + n), U.nodeType === 3 && (u += U.nodeValue.length), (O = U.firstChild) !== null; )
                A = U, U = O;
              for (; ; ) {
                if (U === t) break e;
                if (A === l && ++E === a && (c = u), A === i && ++M === n && (d = u), (O = U.nextSibling) !== null) break;
                U = A, A = U.parentNode;
              }
              U = O;
            }
            l = c === -1 || d === -1 ? null : { start: c, end: d };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Qc = { focusedElem: t, selectionRange: l }, Bi = !1, Ct = e; Ct !== null; )
      if (e = Ct, t = e.child, (e.subtreeFlags & 1024) !== 0 && t !== null)
        t.return = e, Ct = t;
      else
        for (; Ct !== null; ) {
          switch (e = Ct, i = e.alternate, t = e.flags, e.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && i !== null) {
                t = void 0, l = e, a = i.memoizedProps, i = i.memoizedState, n = l.stateNode;
                try {
                  var $ = Bl(
                    l.type,
                    a,
                    l.elementType === l.type
                  );
                  t = n.getSnapshotBeforeUpdate(
                    $,
                    i
                  ), n.__reactInternalSnapshotBeforeUpdate = t;
                } catch (Q) {
                  Et(
                    l,
                    l.return,
                    Q
                  );
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (t = e.stateNode.containerInfo, l = t.nodeType, l === 9)
                  Jc(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Jc(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(r(163));
          }
          if (t = e.sibling, t !== null) {
            t.return = e.return, Ct = t;
            break;
          }
          Ct = e.return;
        }
  }
  function Fs(t, e, l) {
    var n = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        rl(t, l), n & 4 && ra(5, l);
        break;
      case 1:
        if (rl(t, l), n & 4)
          if (t = l.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (u) {
              Et(l, l.return, u);
            }
          else {
            var a = Bl(
              l.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                a,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (u) {
              Et(
                l,
                l.return,
                u
              );
            }
          }
        n & 64 && Qs(l), n & 512 && oa(l, l.return);
        break;
      case 3:
        if (rl(t, l), n & 64 && (t = l.updateQueue, t !== null)) {
          if (e = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                e = l.child.stateNode;
                break;
              case 1:
                e = l.child.stateNode;
            }
          try {
            Uo(t, e);
          } catch (u) {
            Et(l, l.return, u);
          }
        }
        break;
      case 27:
        e === null && n & 4 && $s(l);
      case 26:
      case 5:
        rl(t, l), e === null && n & 4 && Ks(l), n & 512 && oa(l, l.return);
        break;
      case 12:
        rl(t, l);
        break;
      case 13:
        rl(t, l), n & 4 && tf(t, l), n & 64 && (t = l.memoizedState, t !== null && (t = t.dehydrated, t !== null && (l = rv.bind(
          null,
          l
        ), zv(t, l))));
        break;
      case 22:
        if (n = l.memoizedState !== null || Ze, !n) {
          e = e !== null && e.memoizedState !== null || Ut, a = Ze;
          var i = Ut;
          Ze = n, (Ut = e) && !i ? ol(
            t,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : rl(t, l), Ze = a, Ut = i;
        }
        break;
      case 30:
        break;
      default:
        rl(t, l);
    }
  }
  function Is(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Is(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Pi(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var zt = null, ee = !1;
  function Ke(t, e, l) {
    for (l = l.child; l !== null; )
      Ps(t, e, l), l = l.sibling;
  }
  function Ps(t, e, l) {
    if (ie && typeof ie.onCommitFiberUnmount == "function")
      try {
        ie.onCommitFiberUnmount(_n, l);
      } catch (i) {
      }
    switch (l.tag) {
      case 26:
        Ut || Ue(l, e), Ke(
          t,
          e,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ut || Ue(l, e);
        var n = zt, a = ee;
        gl(l.type) && (zt = l.stateNode, ee = !1), Ke(
          t,
          e,
          l
        ), ma(l.stateNode), zt = n, ee = a;
        break;
      case 5:
        Ut || Ue(l, e);
      case 6:
        if (n = zt, a = ee, zt = null, Ke(
          t,
          e,
          l
        ), zt = n, ee = a, zt !== null)
          if (ee)
            try {
              (zt.nodeType === 9 ? zt.body : zt.nodeName === "HTML" ? zt.ownerDocument.body : zt).removeChild(l.stateNode);
            } catch (i) {
              Et(
                l,
                e,
                i
              );
            }
          else
            try {
              zt.removeChild(l.stateNode);
            } catch (i) {
              Et(
                l,
                e,
                i
              );
            }
        break;
      case 18:
        zt !== null && (ee ? (t = zt, Gf(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          l.stateNode
        ), za(t)) : Gf(zt, l.stateNode));
        break;
      case 4:
        n = zt, a = ee, zt = l.stateNode.containerInfo, ee = !0, Ke(
          t,
          e,
          l
        ), zt = n, ee = a;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ut || cl(2, l, e), Ut || cl(4, l, e), Ke(
          t,
          e,
          l
        );
        break;
      case 1:
        Ut || (Ue(l, e), n = l.stateNode, typeof n.componentWillUnmount == "function" && Zs(
          l,
          e,
          n
        )), Ke(
          t,
          e,
          l
        );
        break;
      case 21:
        Ke(
          t,
          e,
          l
        );
        break;
      case 22:
        Ut = (n = Ut) || l.memoizedState !== null, Ke(
          t,
          e,
          l
        ), Ut = n;
        break;
      default:
        Ke(
          t,
          e,
          l
        );
    }
  }
  function tf(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        za(t);
      } catch (l) {
        Et(e, e.return, l);
      }
  }
  function tv(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new Ws()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new Ws()), e;
      default:
        throw Error(r(435, t.tag));
    }
  }
  function xc(t, e) {
    var l = tv(t);
    e.forEach(function(n) {
      var a = ov.bind(null, t, n);
      l.has(n) || (l.add(n), n.then(a, a));
    });
  }
  function oe(t, e) {
    var l = e.deletions;
    if (l !== null)
      for (var n = 0; n < l.length; n++) {
        var a = l[n], i = t, u = e, c = u;
        t: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (gl(c.type)) {
                zt = c.stateNode, ee = !1;
                break t;
              }
              break;
            case 5:
              zt = c.stateNode, ee = !1;
              break t;
            case 3:
            case 4:
              zt = c.stateNode.containerInfo, ee = !0;
              break t;
          }
          c = c.return;
        }
        if (zt === null) throw Error(r(160));
        Ps(i, u, a), zt = null, ee = !1, i = a.alternate, i !== null && (i.return = null), a.return = null;
      }
    if (e.subtreeFlags & 13878)
      for (e = e.child; e !== null; )
        ef(e, t), e = e.sibling;
  }
  var ze = null;
  function ef(t, e) {
    var l = t.alternate, n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        oe(e, t), se(t), n & 4 && (cl(3, t, t.return), ra(3, t), cl(5, t, t.return));
        break;
      case 1:
        oe(e, t), se(t), n & 512 && (Ut || l === null || Ue(l, l.return)), n & 64 && Ze && (t = t.updateQueue, t !== null && (n = t.callbacks, n !== null && (l = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = l === null ? n : l.concat(n))));
        break;
      case 26:
        var a = ze;
        if (oe(e, t), se(t), n & 512 && (Ut || l === null || Ue(l, l.return)), n & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (n = t.memoizedState, l === null)
            if (n === null)
              if (t.stateNode === null) {
                t: {
                  n = t.type, l = t.memoizedProps, a = a.ownerDocument || a;
                  e: switch (n) {
                    case "title":
                      i = a.getElementsByTagName("title")[0], (!i || i[Rn] || i[Jt] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = a.createElement(n), a.head.insertBefore(
                        i,
                        a.querySelector("head > title")
                      )), Qt(i, n, l), i[Jt] = t, Bt(i), n = i;
                      break t;
                    case "link":
                      var u = Wf(
                        "link",
                        "href",
                        a
                      ).get(n + (l.href || ""));
                      if (u) {
                        for (var c = 0; c < u.length; c++)
                          if (i = u[c], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            u.splice(c, 1);
                            break e;
                          }
                      }
                      i = a.createElement(n), Qt(i, n, l), a.head.appendChild(i);
                      break;
                    case "meta":
                      if (u = Wf(
                        "meta",
                        "content",
                        a
                      ).get(n + (l.content || ""))) {
                        for (c = 0; c < u.length; c++)
                          if (i = u[c], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            u.splice(c, 1);
                            break e;
                          }
                      }
                      i = a.createElement(n), Qt(i, n, l), a.head.appendChild(i);
                      break;
                    default:
                      throw Error(r(468, n));
                  }
                  i[Jt] = t, Bt(i), n = i;
                }
                t.stateNode = n;
              } else
                Ff(
                  a,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = $f(
                a,
                n,
                t.memoizedProps
              );
          else
            i !== n ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, n === null ? Ff(
              a,
              t.type,
              t.stateNode
            ) : $f(
              a,
              n,
              t.memoizedProps
            )) : n === null && t.stateNode !== null && pc(
              t,
              t.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        oe(e, t), se(t), n & 512 && (Ut || l === null || Ue(l, l.return)), l !== null && n & 4 && pc(
          t,
          t.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (oe(e, t), se(t), n & 512 && (Ut || l === null || Ue(l, l.return)), t.flags & 32) {
          a = t.stateNode;
          try {
            Fl(a, "");
          } catch (O) {
            Et(t, t.return, O);
          }
        }
        n & 4 && t.stateNode != null && (a = t.memoizedProps, pc(
          t,
          a,
          l !== null ? l.memoizedProps : a
        )), n & 1024 && (Sc = !0);
        break;
      case 6:
        if (oe(e, t), se(t), n & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          n = t.memoizedProps, l = t.stateNode;
          try {
            l.nodeValue = n;
          } catch (O) {
            Et(t, t.return, O);
          }
        }
        break;
      case 3:
        if (qi = null, a = ze, ze = Ri(e.containerInfo), oe(e, t), ze = a, se(t), n & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            za(e.containerInfo);
          } catch (O) {
            Et(t, t.return, O);
          }
        Sc && (Sc = !1, lf(t));
        break;
      case 4:
        n = ze, ze = Ri(
          t.stateNode.containerInfo
        ), oe(e, t), se(t), ze = n;
        break;
      case 12:
        oe(e, t), se(t);
        break;
      case 13:
        oe(e, t), se(t), t.child.flags & 8192 && t.memoizedState !== null != (l !== null && l.memoizedState !== null) && (wc = De()), n & 4 && (n = t.updateQueue, n !== null && (t.updateQueue = null, xc(t, n)));
        break;
      case 22:
        a = t.memoizedState !== null;
        var d = l !== null && l.memoizedState !== null, E = Ze, M = Ut;
        if (Ze = E || a, Ut = M || d, oe(e, t), Ut = M, Ze = E, se(t), n & 8192)
          t: for (e = t.stateNode, e._visibility = a ? e._visibility & -2 : e._visibility | 1, a && (l === null || d || Ze || Ut || kl(t)), l = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                d = l = e;
                try {
                  if (i = d.stateNode, a)
                    u = i.style, typeof u.setProperty == "function" ? u.setProperty("display", "none", "important") : u.display = "none";
                  else {
                    c = d.stateNode;
                    var U = d.memoizedProps.style, A = U != null && U.hasOwnProperty("display") ? U.display : null;
                    c.style.display = A == null || typeof A == "boolean" ? "" : ("" + A).trim();
                  }
                } catch (O) {
                  Et(d, d.return, O);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                d = e;
                try {
                  d.stateNode.nodeValue = a ? "" : d.memoizedProps;
                } catch (O) {
                  Et(d, d.return, O);
                }
              }
            } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              l === e && (l = null), e = e.return;
            }
            l === e && (l = null), e.sibling.return = e.return, e = e.sibling;
          }
        n & 4 && (n = t.updateQueue, n !== null && (l = n.retryQueue, l !== null && (n.retryQueue = null, xc(t, l))));
        break;
      case 19:
        oe(e, t), se(t), n & 4 && (n = t.updateQueue, n !== null && (t.updateQueue = null, xc(t, n)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        oe(e, t), se(t);
    }
  }
  function se(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, n = t.return; n !== null; ) {
          if (Js(n)) {
            l = n;
            break;
          }
          n = n.return;
        }
        if (l == null) throw Error(r(160));
        switch (l.tag) {
          case 27:
            var a = l.stateNode, i = mc(t);
            Si(t, i, a);
            break;
          case 5:
            var u = l.stateNode;
            l.flags & 32 && (Fl(u, ""), l.flags &= -33);
            var c = mc(t);
            Si(t, c, u);
            break;
          case 3:
          case 4:
            var d = l.stateNode.containerInfo, E = mc(t);
            bc(
              t,
              E,
              d
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (M) {
        Et(t, t.return, M);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function lf(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        lf(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function rl(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        Fs(t, e.alternate, e), e = e.sibling;
  }
  function kl(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          cl(4, e, e.return), kl(e);
          break;
        case 1:
          Ue(e, e.return);
          var l = e.stateNode;
          typeof l.componentWillUnmount == "function" && Zs(
            e,
            e.return,
            l
          ), kl(e);
          break;
        case 27:
          ma(e.stateNode);
        case 26:
        case 5:
          Ue(e, e.return), kl(e);
          break;
        case 22:
          e.memoizedState === null && kl(e);
          break;
        case 30:
          kl(e);
          break;
        default:
          kl(e);
      }
      t = t.sibling;
    }
  }
  function ol(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var n = e.alternate, a = t, i = e, u = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          ol(
            a,
            i,
            l
          ), ra(4, i);
          break;
        case 1:
          if (ol(
            a,
            i,
            l
          ), n = i, a = n.stateNode, typeof a.componentDidMount == "function")
            try {
              a.componentDidMount();
            } catch (E) {
              Et(n, n.return, E);
            }
          if (n = i, a = n.updateQueue, a !== null) {
            var c = n.stateNode;
            try {
              var d = a.shared.hiddenCallbacks;
              if (d !== null)
                for (a.shared.hiddenCallbacks = null, a = 0; a < d.length; a++)
                  No(d[a], c);
            } catch (E) {
              Et(n, n.return, E);
            }
          }
          l && u & 64 && Qs(i), oa(i, i.return);
          break;
        case 27:
          $s(i);
        case 26:
        case 5:
          ol(
            a,
            i,
            l
          ), l && n === null && u & 4 && Ks(i), oa(i, i.return);
          break;
        case 12:
          ol(
            a,
            i,
            l
          );
          break;
        case 13:
          ol(
            a,
            i,
            l
          ), l && u & 4 && tf(a, i);
          break;
        case 22:
          i.memoizedState === null && ol(
            a,
            i,
            l
          ), oa(i, i.return);
          break;
        case 30:
          break;
        default:
          ol(
            a,
            i,
            l
          );
      }
      e = e.sibling;
    }
  }
  function Ec(t, e) {
    var l = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== l && (t != null && t.refCount++, l != null && Jn(l));
  }
  function Tc(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Jn(t));
  }
  function Re(t, e, l, n) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        nf(
          t,
          e,
          l,
          n
        ), e = e.sibling;
  }
  function nf(t, e, l, n) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Re(
          t,
          e,
          l,
          n
        ), a & 2048 && ra(9, e);
        break;
      case 1:
        Re(
          t,
          e,
          l,
          n
        );
        break;
      case 3:
        Re(
          t,
          e,
          l,
          n
        ), a & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Jn(t)));
        break;
      case 12:
        if (a & 2048) {
          Re(
            t,
            e,
            l,
            n
          ), t = e.stateNode;
          try {
            var i = e.memoizedProps, u = i.id, c = i.onPostCommit;
            typeof c == "function" && c(
              u,
              e.alternate === null ? "mount" : "update",
              t.passiveEffectDuration,
              -0
            );
          } catch (d) {
            Et(e, e.return, d);
          }
        } else
          Re(
            t,
            e,
            l,
            n
          );
        break;
      case 13:
        Re(
          t,
          e,
          l,
          n
        );
        break;
      case 23:
        break;
      case 22:
        i = e.stateNode, u = e.alternate, e.memoizedState !== null ? i._visibility & 2 ? Re(
          t,
          e,
          l,
          n
        ) : sa(t, e) : i._visibility & 2 ? Re(
          t,
          e,
          l,
          n
        ) : (i._visibility |= 2, pn(
          t,
          e,
          l,
          n,
          (e.subtreeFlags & 10256) !== 0
        )), a & 2048 && Ec(u, e);
        break;
      case 24:
        Re(
          t,
          e,
          l,
          n
        ), a & 2048 && Tc(e.alternate, e);
        break;
      default:
        Re(
          t,
          e,
          l,
          n
        );
    }
  }
  function pn(t, e, l, n, a) {
    for (a = a && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var i = t, u = e, c = l, d = n, E = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          pn(
            i,
            u,
            c,
            d,
            a
          ), ra(8, u);
          break;
        case 23:
          break;
        case 22:
          var M = u.stateNode;
          u.memoizedState !== null ? M._visibility & 2 ? pn(
            i,
            u,
            c,
            d,
            a
          ) : sa(
            i,
            u
          ) : (M._visibility |= 2, pn(
            i,
            u,
            c,
            d,
            a
          )), a && E & 2048 && Ec(
            u.alternate,
            u
          );
          break;
        case 24:
          pn(
            i,
            u,
            c,
            d,
            a
          ), a && E & 2048 && Tc(u.alternate, u);
          break;
        default:
          pn(
            i,
            u,
            c,
            d,
            a
          );
      }
      e = e.sibling;
    }
  }
  function sa(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t, n = e, a = n.flags;
        switch (n.tag) {
          case 22:
            sa(l, n), a & 2048 && Ec(
              n.alternate,
              n
            );
            break;
          case 24:
            sa(l, n), a & 2048 && Tc(n.alternate, n);
            break;
          default:
            sa(l, n);
        }
        e = e.sibling;
      }
  }
  var fa = 8192;
  function mn(t) {
    if (t.subtreeFlags & fa)
      for (t = t.child; t !== null; )
        af(t), t = t.sibling;
  }
  function af(t) {
    switch (t.tag) {
      case 26:
        mn(t), t.flags & fa && t.memoizedState !== null && kv(
          ze,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        mn(t);
        break;
      case 3:
      case 4:
        var e = ze;
        ze = Ri(t.stateNode.containerInfo), mn(t), ze = e;
        break;
      case 22:
        t.memoizedState === null && (e = t.alternate, e !== null && e.memoizedState !== null ? (e = fa, fa = 16777216, mn(t), fa = e) : mn(t));
        break;
      default:
        mn(t);
    }
  }
  function uf(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function da(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var n = e[l];
          Ct = n, rf(
            n,
            t
          );
        }
      uf(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        cf(t), t = t.sibling;
  }
  function cf(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        da(t), t.flags & 2048 && cl(9, t, t.return);
        break;
      case 3:
        da(t);
        break;
      case 12:
        da(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, xi(t)) : da(t);
        break;
      default:
        da(t);
    }
  }
  function xi(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var n = e[l];
          Ct = n, rf(
            n,
            t
          );
        }
      uf(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          cl(8, e, e.return), xi(e);
          break;
        case 22:
          l = e.stateNode, l._visibility & 2 && (l._visibility &= -3, xi(e));
          break;
        default:
          xi(e);
      }
      t = t.sibling;
    }
  }
  function rf(t, e) {
    for (; Ct !== null; ) {
      var l = Ct;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          cl(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var n = l.memoizedState.cachePool.pool;
            n != null && n.refCount++;
          }
          break;
        case 24:
          Jn(l.memoizedState.cache);
      }
      if (n = l.child, n !== null) n.return = l, Ct = n;
      else
        t: for (l = t; Ct !== null; ) {
          n = Ct;
          var a = n.sibling, i = n.return;
          if (Is(n), n === l) {
            Ct = null;
            break t;
          }
          if (a !== null) {
            a.return = i, Ct = a;
            break t;
          }
          Ct = i;
        }
    }
  }
  var ev = {
    getCacheForType: function(t) {
      var e = $t(jt), l = e.data.get(t);
      return l === void 0 && (l = t(), e.data.set(t, l)), l;
    }
  }, lv = typeof WeakMap == "function" ? WeakMap : Map, gt = 0, Tt = null, at = null, ut = 0, yt = 0, fe = null, sl = !1, bn = !1, Ac = !1, Je = 0, _t = 0, fl = 0, Cl = 0, Oc = 0, Ee = 0, Sn = 0, ha = null, le = null, zc = !1, wc = 0, Ei = 1 / 0, Ti = null, dl = null, Xt = 0, hl = null, xn = null, En = 0, Mc = 0, Dc = null, of = null, va = 0, _c = null;
  function de() {
    if ((gt & 2) !== 0 && ut !== 0)
      return ut & -ut;
    if (D.T !== null) {
      var t = on;
      return t !== 0 ? t : Yc();
    }
    return Tr();
  }
  function sf() {
    Ee === 0 && (Ee = (ut & 536870912) === 0 || vt ? br() : 536870912);
    var t = xe.current;
    return t !== null && (t.flags |= 32), Ee;
  }
  function he(t, e, l) {
    (t === Tt && (yt === 2 || yt === 9) || t.cancelPendingCommit !== null) && (Tn(t, 0), vl(
      t,
      ut,
      Ee,
      !1
    )), Un(t, l), ((gt & 2) === 0 || t !== Tt) && (t === Tt && ((gt & 2) === 0 && (Cl |= l), _t === 4 && vl(
      t,
      ut,
      Ee,
      !1
    )), He(t));
  }
  function ff(t, e, l) {
    if ((gt & 6) !== 0) throw Error(r(327));
    var n = !l && (e & 124) === 0 && (e & t.expiredLanes) === 0 || Nn(t, e), a = n ? iv(t, e) : Rc(t, e, !0), i = n;
    do {
      if (a === 0) {
        bn && !n && vl(t, e, 0, !1);
        break;
      } else {
        if (l = t.current.alternate, i && !nv(l)) {
          a = Rc(t, e, !1), i = !1;
          continue;
        }
        if (a === 2) {
          if (i = e, t.errorRecoveryDisabledLanes & i)
            var u = 0;
          else
            u = t.pendingLanes & -536870913, u = u !== 0 ? u : u & 536870912 ? 536870912 : 0;
          if (u !== 0) {
            e = u;
            t: {
              var c = t;
              a = ha;
              var d = c.current.memoizedState.isDehydrated;
              if (d && (Tn(c, u).flags |= 256), u = Rc(
                c,
                u,
                !1
              ), u !== 2) {
                if (Ac && !d) {
                  c.errorRecoveryDisabledLanes |= i, Cl |= i, a = 4;
                  break t;
                }
                i = le, le = a, i !== null && (le === null ? le = i : le.push.apply(
                  le,
                  i
                ));
              }
              a = u;
            }
            if (i = !1, a !== 2) continue;
          }
        }
        if (a === 1) {
          Tn(t, 0), vl(t, e, 0, !0);
          break;
        }
        t: {
          switch (n = t, i = a, i) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              vl(
                n,
                e,
                Ee,
                !sl
              );
              break t;
            case 2:
              le = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((e & 62914560) === e && (a = wc + 300 - De(), 10 < a)) {
            if (vl(
              n,
              e,
              Ee,
              !sl
            ), Ha(n, 0, !0) !== 0) break t;
            n.timeoutHandle = Cf(
              df.bind(
                null,
                n,
                l,
                le,
                Ti,
                zc,
                e,
                Ee,
                Cl,
                Sn,
                sl,
                i,
                2,
                -0,
                0
              ),
              a
            );
            break t;
          }
          df(
            n,
            l,
            le,
            Ti,
            zc,
            e,
            Ee,
            Cl,
            Sn,
            sl,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    He(t);
  }
  function df(t, e, l, n, a, i, u, c, d, E, M, U, A, O) {
    if (t.timeoutHandle = -1, U = e.subtreeFlags, (U & 8192 || (U & 16785408) === 16785408) && (xa = { stylesheets: null, count: 0, unsuspend: Bv }, af(e), U = Cv(), U !== null)) {
      t.cancelPendingCommit = U(
        bf.bind(
          null,
          t,
          e,
          i,
          l,
          n,
          a,
          u,
          c,
          d,
          M,
          1,
          A,
          O
        )
      ), vl(t, i, u, !E);
      return;
    }
    bf(
      t,
      e,
      i,
      l,
      n,
      a,
      u,
      c,
      d
    );
  }
  function nv(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if ((l === 0 || l === 11 || l === 15) && e.flags & 16384 && (l = e.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var n = 0; n < l.length; n++) {
          var a = l[n], i = a.getSnapshot;
          a = a.value;
          try {
            if (!ce(i(), a)) return !1;
          } catch (u) {
            return !1;
          }
        }
      if (l = e.child, e.subtreeFlags & 16384 && l !== null)
        l.return = e, e = l;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function vl(t, e, l, n) {
    e &= ~Oc, e &= ~Cl, t.suspendedLanes |= e, t.pingedLanes &= ~e, n && (t.warmLanes |= e), n = t.expirationTimes;
    for (var a = e; 0 < a; ) {
      var i = 31 - ue(a), u = 1 << i;
      n[i] = -1, a &= ~u;
    }
    l !== 0 && xr(t, l, e);
  }
  function Ai() {
    return (gt & 6) === 0 ? (ga(0), !1) : !0;
  }
  function Nc() {
    if (at !== null) {
      if (yt === 0)
        var t = at.return;
      else
        t = at, Ce = Hl = null, Ju(t), gn = null, ia = 0, t = at;
      for (; t !== null; )
        Xs(t.alternate, t), t = t.return;
      at = null;
    }
  }
  function Tn(t, e) {
    var l = t.timeoutHandle;
    l !== -1 && (t.timeoutHandle = -1, xv(l)), l = t.cancelPendingCommit, l !== null && (t.cancelPendingCommit = null, l()), Nc(), Tt = t, at = l = Ye(t.current, null), ut = e, yt = 0, fe = null, sl = !1, bn = Nn(t, e), Ac = !1, Sn = Ee = Oc = Cl = fl = _t = 0, le = ha = null, zc = !1, (e & 8) !== 0 && (e |= e & 32);
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var a = 31 - ue(n), i = 1 << a;
        e |= t[a], n &= ~i;
      }
    return Je = e, Za(), l;
  }
  function hf(t, e) {
    lt = null, D.H = fi, e === Wn || e === ei ? (e = Do(), yt = 3) : e === zo ? (e = Do(), yt = 4) : yt = e === _s ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, fe = e, at === null && (_t = 1, yi(
      t,
      pe(e, t.current)
    ));
  }
  function vf() {
    var t = D.H;
    return D.H = fi, t === null ? fi : t;
  }
  function gf() {
    var t = D.A;
    return D.A = ev, t;
  }
  function Uc() {
    _t = 4, sl || (ut & 4194048) !== ut && xe.current !== null || (bn = !0), (fl & 134217727) === 0 && (Cl & 134217727) === 0 || Tt === null || vl(
      Tt,
      ut,
      Ee,
      !1
    );
  }
  function Rc(t, e, l) {
    var n = gt;
    gt |= 2;
    var a = vf(), i = gf();
    (Tt !== t || ut !== e) && (Ti = null, Tn(t, e)), e = !1;
    var u = _t;
    t: do
      try {
        if (yt !== 0 && at !== null) {
          var c = at, d = fe;
          switch (yt) {
            case 8:
              Nc(), u = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              xe.current === null && (e = !0);
              var E = yt;
              if (yt = 0, fe = null, An(t, c, d, E), l && bn) {
                u = 0;
                break t;
              }
              break;
            default:
              E = yt, yt = 0, fe = null, An(t, c, d, E);
          }
        }
        av(), u = _t;
        break;
      } catch (M) {
        hf(t, M);
      }
    while (!0);
    return e && t.shellSuspendCounter++, Ce = Hl = null, gt = n, D.H = a, D.A = i, at === null && (Tt = null, ut = 0, Za()), u;
  }
  function av() {
    for (; at !== null; ) yf(at);
  }
  function iv(t, e) {
    var l = gt;
    gt |= 2;
    var n = vf(), a = gf();
    Tt !== t || ut !== e ? (Ti = null, Ei = De() + 500, Tn(t, e)) : bn = Nn(
      t,
      e
    );
    t: do
      try {
        if (yt !== 0 && at !== null) {
          e = at;
          var i = fe;
          e: switch (yt) {
            case 1:
              yt = 0, fe = null, An(t, e, i, 1);
              break;
            case 2:
            case 9:
              if (wo(i)) {
                yt = 0, fe = null, pf(e);
                break;
              }
              e = function() {
                yt !== 2 && yt !== 9 || Tt !== t || (yt = 7), He(t);
              }, i.then(e, e);
              break t;
            case 3:
              yt = 7;
              break t;
            case 4:
              yt = 5;
              break t;
            case 7:
              wo(i) ? (yt = 0, fe = null, pf(e)) : (yt = 0, fe = null, An(t, e, i, 7));
              break;
            case 5:
              var u = null;
              switch (at.tag) {
                case 26:
                  u = at.memoizedState;
                case 5:
                case 27:
                  var c = at;
                  if (!u || If(u)) {
                    yt = 0, fe = null;
                    var d = c.sibling;
                    if (d !== null) at = d;
                    else {
                      var E = c.return;
                      E !== null ? (at = E, Oi(E)) : at = null;
                    }
                    break e;
                  }
              }
              yt = 0, fe = null, An(t, e, i, 5);
              break;
            case 6:
              yt = 0, fe = null, An(t, e, i, 6);
              break;
            case 8:
              Nc(), _t = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        uv();
        break;
      } catch (M) {
        hf(t, M);
      }
    while (!0);
    return Ce = Hl = null, D.H = n, D.A = a, gt = l, at !== null ? 0 : (Tt = null, ut = 0, Za(), _t);
  }
  function uv() {
    for (; at !== null && !Md(); )
      yf(at);
  }
  function yf(t) {
    var e = Gs(t.alternate, t, Je);
    t.memoizedProps = t.pendingProps, e === null ? Oi(t) : at = e;
  }
  function pf(t) {
    var e = t, l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = js(
          l,
          e,
          e.pendingProps,
          e.type,
          void 0,
          ut
        );
        break;
      case 11:
        e = js(
          l,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          ut
        );
        break;
      case 5:
        Ju(e);
      default:
        Xs(l, e), e = at = po(e, Je), e = Gs(l, e, Je);
    }
    t.memoizedProps = t.pendingProps, e === null ? Oi(t) : at = e;
  }
  function An(t, e, l, n) {
    Ce = Hl = null, Ju(e), gn = null, ia = 0;
    var a = e.return;
    try {
      if ($h(
        t,
        a,
        e,
        l,
        ut
      )) {
        _t = 1, yi(
          t,
          pe(l, t.current)
        ), at = null;
        return;
      }
    } catch (i) {
      if (a !== null) throw at = a, i;
      _t = 1, yi(
        t,
        pe(l, t.current)
      ), at = null;
      return;
    }
    e.flags & 32768 ? (vt || n === 1 ? t = !0 : bn || (ut & 536870912) !== 0 ? t = !1 : (sl = t = !0, (n === 2 || n === 9 || n === 3 || n === 6) && (n = xe.current, n !== null && n.tag === 13 && (n.flags |= 16384))), mf(e, t)) : Oi(e);
  }
  function Oi(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        mf(
          e,
          sl
        );
        return;
      }
      t = e.return;
      var l = Fh(
        e.alternate,
        e,
        Je
      );
      if (l !== null) {
        at = l;
        return;
      }
      if (e = e.sibling, e !== null) {
        at = e;
        return;
      }
      at = e = t;
    } while (e !== null);
    _t === 0 && (_t = 5);
  }
  function mf(t, e) {
    do {
      var l = Ih(t.alternate, t);
      if (l !== null) {
        l.flags &= 32767, at = l;
        return;
      }
      if (l = t.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !e && (t = t.sibling, t !== null)) {
        at = t;
        return;
      }
      at = t = l;
    } while (t !== null);
    _t = 6, at = null;
  }
  function bf(t, e, l, n, a, i, u, c, d) {
    t.cancelPendingCommit = null;
    do
      zi();
    while (Xt !== 0);
    if ((gt & 6) !== 0) throw Error(r(327));
    if (e !== null) {
      if (e === t.current) throw Error(r(177));
      if (i = e.lanes | e.childLanes, i |= Tu, Bd(
        t,
        l,
        i,
        u,
        c,
        d
      ), t === Tt && (at = Tt = null, ut = 0), xn = e, hl = t, En = l, Mc = i, Dc = a, of = n, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, sv(Na, function() {
        return Af(), null;
      })) : (t.callbackNode = null, t.callbackPriority = 0), n = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || n) {
        n = D.T, D.T = null, a = Y.p, Y.p = 2, u = gt, gt |= 4;
        try {
          Ph(t, e, l);
        } finally {
          gt = u, Y.p = a, D.T = n;
        }
      }
      Xt = 1, Sf(), xf(), Ef();
    }
  }
  function Sf() {
    if (Xt === 1) {
      Xt = 0;
      var t = hl, e = xn, l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        l = D.T, D.T = null;
        var n = Y.p;
        Y.p = 2;
        var a = gt;
        gt |= 4;
        try {
          ef(e, t);
          var i = Qc, u = uo(t.containerInfo), c = i.focusedElem, d = i.selectionRange;
          if (u !== c && c && c.ownerDocument && io(
            c.ownerDocument.documentElement,
            c
          )) {
            if (d !== null && mu(c)) {
              var E = d.start, M = d.end;
              if (M === void 0 && (M = E), "selectionStart" in c)
                c.selectionStart = E, c.selectionEnd = Math.min(
                  M,
                  c.value.length
                );
              else {
                var U = c.ownerDocument || document, A = U && U.defaultView || window;
                if (A.getSelection) {
                  var O = A.getSelection(), $ = c.textContent.length, Q = Math.min(d.start, $), bt = d.end === void 0 ? Q : Math.min(d.end, $);
                  !O.extend && Q > bt && (u = bt, bt = Q, Q = u);
                  var S = ao(
                    c,
                    Q
                  ), p = ao(
                    c,
                    bt
                  );
                  if (S && p && (O.rangeCount !== 1 || O.anchorNode !== S.node || O.anchorOffset !== S.offset || O.focusNode !== p.node || O.focusOffset !== p.offset)) {
                    var x = U.createRange();
                    x.setStart(S.node, S.offset), O.removeAllRanges(), Q > bt ? (O.addRange(x), O.extend(p.node, p.offset)) : (x.setEnd(p.node, p.offset), O.addRange(x));
                  }
                }
              }
            }
            for (U = [], O = c; O = O.parentNode; )
              O.nodeType === 1 && U.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof c.focus == "function" && c.focus(), c = 0; c < U.length; c++) {
              var _ = U[c];
              _.element.scrollLeft = _.left, _.element.scrollTop = _.top;
            }
          }
          Bi = !!Xc, Qc = Xc = null;
        } finally {
          gt = a, Y.p = n, D.T = l;
        }
      }
      t.current = e, Xt = 2;
    }
  }
  function xf() {
    if (Xt === 2) {
      Xt = 0;
      var t = hl, e = xn, l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        l = D.T, D.T = null;
        var n = Y.p;
        Y.p = 2;
        var a = gt;
        gt |= 4;
        try {
          Fs(t, e.alternate, e);
        } finally {
          gt = a, Y.p = n, D.T = l;
        }
      }
      Xt = 3;
    }
  }
  function Ef() {
    if (Xt === 4 || Xt === 3) {
      Xt = 0, Dd();
      var t = hl, e = xn, l = En, n = of;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? Xt = 5 : (Xt = 0, xn = hl = null, Tf(t, t.pendingLanes));
      var a = t.pendingLanes;
      if (a === 0 && (dl = null), Fi(l), e = e.stateNode, ie && typeof ie.onCommitFiberRoot == "function")
        try {
          ie.onCommitFiberRoot(
            _n,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch (d) {
        }
      if (n !== null) {
        e = D.T, a = Y.p, Y.p = 2, D.T = null;
        try {
          for (var i = t.onRecoverableError, u = 0; u < n.length; u++) {
            var c = n[u];
            i(c.value, {
              componentStack: c.stack
            });
          }
        } finally {
          D.T = e, Y.p = a;
        }
      }
      (En & 3) !== 0 && zi(), He(t), a = t.pendingLanes, (l & 4194090) !== 0 && (a & 42) !== 0 ? t === _c ? va++ : (va = 0, _c = t) : va = 0, ga(0);
    }
  }
  function Tf(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Jn(e)));
  }
  function zi(t) {
    return Sf(), xf(), Ef(), Af();
  }
  function Af() {
    if (Xt !== 5) return !1;
    var t = hl, e = Mc;
    Mc = 0;
    var l = Fi(En), n = D.T, a = Y.p;
    try {
      Y.p = 32 > l ? 32 : l, D.T = null, l = Dc, Dc = null;
      var i = hl, u = En;
      if (Xt = 0, xn = hl = null, En = 0, (gt & 6) !== 0) throw Error(r(331));
      var c = gt;
      if (gt |= 4, cf(i.current), nf(
        i,
        i.current,
        u,
        l
      ), gt = c, ga(0, !1), ie && typeof ie.onPostCommitFiberRoot == "function")
        try {
          ie.onPostCommitFiberRoot(_n, i);
        } catch (d) {
        }
      return !0;
    } finally {
      Y.p = a, D.T = n, Tf(t, e);
    }
  }
  function Of(t, e, l) {
    e = pe(l, e), e = rc(t.stateNode, e, 2), t = nl(t, e, 2), t !== null && (Un(t, 2), He(t));
  }
  function Et(t, e, l) {
    if (t.tag === 3)
      Of(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Of(
            e,
            t,
            l
          );
          break;
        } else if (e.tag === 1) {
          var n = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (dl === null || !dl.has(n))) {
            t = pe(l, t), l = Ms(2), n = nl(e, l, 2), n !== null && (Ds(
              l,
              n,
              e,
              t
            ), Un(n, 2), He(n));
            break;
          }
        }
        e = e.return;
      }
  }
  function Hc(t, e, l) {
    var n = t.pingCache;
    if (n === null) {
      n = t.pingCache = new lv();
      var a = /* @__PURE__ */ new Set();
      n.set(e, a);
    } else
      a = n.get(e), a === void 0 && (a = /* @__PURE__ */ new Set(), n.set(e, a));
    a.has(l) || (Ac = !0, a.add(l), t = cv.bind(null, t, e, l), e.then(t, t));
  }
  function cv(t, e, l) {
    var n = t.pingCache;
    n !== null && n.delete(e), t.pingedLanes |= t.suspendedLanes & l, t.warmLanes &= ~l, Tt === t && (ut & l) === l && (_t === 4 || _t === 3 && (ut & 62914560) === ut && 300 > De() - wc ? (gt & 2) === 0 && Tn(t, 0) : Oc |= l, Sn === ut && (Sn = 0)), He(t);
  }
  function zf(t, e) {
    e === 0 && (e = Sr()), t = an(t, e), t !== null && (Un(t, e), He(t));
  }
  function rv(t) {
    var e = t.memoizedState, l = 0;
    e !== null && (l = e.retryLane), zf(t, l);
  }
  function ov(t, e) {
    var l = 0;
    switch (t.tag) {
      case 13:
        var n = t.stateNode, a = t.memoizedState;
        a !== null && (l = a.retryLane);
        break;
      case 19:
        n = t.stateNode;
        break;
      case 22:
        n = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    n !== null && n.delete(e), zf(t, l);
  }
  function sv(t, e) {
    return Ki(t, e);
  }
  var wi = null, On = null, qc = !1, Mi = !1, jc = !1, Vl = 0;
  function He(t) {
    t !== On && t.next === null && (On === null ? wi = On = t : On = On.next = t), Mi = !0, qc || (qc = !0, dv());
  }
  function ga(t, e) {
    if (!jc && Mi) {
      jc = !0;
      do
        for (var l = !1, n = wi; n !== null; ) {
          if (t !== 0) {
            var a = n.pendingLanes;
            if (a === 0) var i = 0;
            else {
              var u = n.suspendedLanes, c = n.pingedLanes;
              i = (1 << 31 - ue(42 | t) + 1) - 1, i &= a & ~(u & ~c), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, _f(n, i));
          } else
            i = ut, i = Ha(
              n,
              n === Tt ? i : 0,
              n.cancelPendingCommit !== null || n.timeoutHandle !== -1
            ), (i & 3) === 0 || Nn(n, i) || (l = !0, _f(n, i));
          n = n.next;
        }
      while (l);
      jc = !1;
    }
  }
  function fv() {
    wf();
  }
  function wf() {
    Mi = qc = !1;
    var t = 0;
    Vl !== 0 && (Sv() && (t = Vl), Vl = 0);
    for (var e = De(), l = null, n = wi; n !== null; ) {
      var a = n.next, i = Mf(n, e);
      i === 0 ? (n.next = null, l === null ? wi = a : l.next = a, a === null && (On = l)) : (l = n, (t !== 0 || (i & 3) !== 0) && (Mi = !0)), n = a;
    }
    ga(t);
  }
  function Mf(t, e) {
    for (var l = t.suspendedLanes, n = t.pingedLanes, a = t.expirationTimes, i = t.pendingLanes & -62914561; 0 < i; ) {
      var u = 31 - ue(i), c = 1 << u, d = a[u];
      d === -1 ? ((c & l) === 0 || (c & n) !== 0) && (a[u] = Yd(c, e)) : d <= e && (t.expiredLanes |= c), i &= ~c;
    }
    if (e = Tt, l = ut, l = Ha(
      t,
      t === e ? l : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), n = t.callbackNode, l === 0 || t === e && (yt === 2 || yt === 9) || t.cancelPendingCommit !== null)
      return n !== null && n !== null && Ji(n), t.callbackNode = null, t.callbackPriority = 0;
    if ((l & 3) === 0 || Nn(t, l)) {
      if (e = l & -l, e === t.callbackPriority) return e;
      switch (n !== null && Ji(n), Fi(l)) {
        case 2:
        case 8:
          l = pr;
          break;
        case 32:
          l = Na;
          break;
        case 268435456:
          l = mr;
          break;
        default:
          l = Na;
      }
      return n = Df.bind(null, t), l = Ki(l, n), t.callbackPriority = e, t.callbackNode = l, e;
    }
    return n !== null && n !== null && Ji(n), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Df(t, e) {
    if (Xt !== 0 && Xt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var l = t.callbackNode;
    if (zi() && t.callbackNode !== l)
      return null;
    var n = ut;
    return n = Ha(
      t,
      t === Tt ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), n === 0 ? null : (ff(t, n, e), Mf(t, De()), t.callbackNode != null && t.callbackNode === l ? Df.bind(null, t) : null);
  }
  function _f(t, e) {
    if (zi()) return null;
    ff(t, e, !0);
  }
  function dv() {
    Ev(function() {
      (gt & 6) !== 0 ? Ki(
        yr,
        fv
      ) : wf();
    });
  }
  function Yc() {
    return Vl === 0 && (Vl = br()), Vl;
  }
  function Nf(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : ka("" + t);
  }
  function Uf(t, e) {
    var l = e.ownerDocument.createElement("input");
    return l.name = e.name, l.value = e.value, t.id && l.setAttribute("form", t.id), e.parentNode.insertBefore(l, e), t = new FormData(t), l.parentNode.removeChild(l), t;
  }
  function hv(t, e, l, n, a) {
    if (e === "submit" && l && l.stateNode === a) {
      var i = Nf(
        (a[It] || null).action
      ), u = n.submitter;
      u && (e = (e = u[It] || null) ? Nf(e.formAction) : u.getAttribute("formAction"), e !== null && (i = e, u = null));
      var c = new La(
        "action",
        "action",
        null,
        n,
        a
      );
      t.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (n.defaultPrevented) {
                if (Vl !== 0) {
                  var d = u ? Uf(a, u) : new FormData(a);
                  nc(
                    l,
                    {
                      pending: !0,
                      data: d,
                      method: a.method,
                      action: i
                    },
                    null,
                    d
                  );
                }
              } else
                typeof i == "function" && (c.preventDefault(), d = u ? Uf(a, u) : new FormData(a), nc(
                  l,
                  {
                    pending: !0,
                    data: d,
                    method: a.method,
                    action: i
                  },
                  i,
                  d
                ));
            },
            currentTarget: a
          }
        ]
      });
    }
  }
  for (var Bc = 0; Bc < Eu.length; Bc++) {
    var kc = Eu[Bc], vv = kc.toLowerCase(), gv = kc[0].toUpperCase() + kc.slice(1);
    Oe(
      vv,
      "on" + gv
    );
  }
  Oe(oo, "onAnimationEnd"), Oe(so, "onAnimationIteration"), Oe(fo, "onAnimationStart"), Oe("dblclick", "onDoubleClick"), Oe("focusin", "onFocus"), Oe("focusout", "onBlur"), Oe(Uh, "onTransitionRun"), Oe(Rh, "onTransitionStart"), Oe(Hh, "onTransitionCancel"), Oe(ho, "onTransitionEnd"), Jl("onMouseEnter", ["mouseout", "mouseover"]), Jl("onMouseLeave", ["mouseout", "mouseover"]), Jl("onPointerEnter", ["pointerout", "pointerover"]), Jl("onPointerLeave", ["pointerout", "pointerover"]), Ol(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ol(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ol("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ol(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ol(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ol(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ya = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), yv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ya)
  );
  function Rf(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var n = t[l], a = n.event;
      n = n.listeners;
      t: {
        var i = void 0;
        if (e)
          for (var u = n.length - 1; 0 <= u; u--) {
            var c = n[u], d = c.instance, E = c.currentTarget;
            if (c = c.listener, d !== i && a.isPropagationStopped())
              break t;
            i = c, a.currentTarget = E;
            try {
              i(a);
            } catch (M) {
              gi(M);
            }
            a.currentTarget = null, i = d;
          }
        else
          for (u = 0; u < n.length; u++) {
            if (c = n[u], d = c.instance, E = c.currentTarget, c = c.listener, d !== i && a.isPropagationStopped())
              break t;
            i = c, a.currentTarget = E;
            try {
              i(a);
            } catch (M) {
              gi(M);
            }
            a.currentTarget = null, i = d;
          }
      }
    }
  }
  function it(t, e) {
    var l = e[Ii];
    l === void 0 && (l = e[Ii] = /* @__PURE__ */ new Set());
    var n = t + "__bubble";
    l.has(n) || (Hf(e, t, 2, !1), l.add(n));
  }
  function Cc(t, e, l) {
    var n = 0;
    e && (n |= 4), Hf(
      l,
      t,
      n,
      e
    );
  }
  var Di = "_reactListening" + Math.random().toString(36).slice(2);
  function Vc(t) {
    if (!t[Di]) {
      t[Di] = !0, Or.forEach(function(l) {
        l !== "selectionchange" && (yv.has(l) || Cc(l, !1, t), Cc(l, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Di] || (e[Di] = !0, Cc("selectionchange", !1, e));
    }
  }
  function Hf(t, e, l, n) {
    switch (ad(e)) {
      case 2:
        var a = Lv;
        break;
      case 8:
        a = Xv;
        break;
      default:
        a = er;
    }
    l = a.bind(
      null,
      e,
      l,
      t
    ), a = void 0, !ou || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (a = !0), n ? a !== void 0 ? t.addEventListener(e, l, {
      capture: !0,
      passive: a
    }) : t.addEventListener(e, l, !0) : a !== void 0 ? t.addEventListener(e, l, {
      passive: a
    }) : t.addEventListener(e, l, !1);
  }
  function Gc(t, e, l, n, a) {
    var i = n;
    if ((e & 1) === 0 && (e & 2) === 0 && n !== null)
      t: for (; ; ) {
        if (n === null) return;
        var u = n.tag;
        if (u === 3 || u === 4) {
          var c = n.stateNode.containerInfo;
          if (c === a) break;
          if (u === 4)
            for (u = n.return; u !== null; ) {
              var d = u.tag;
              if ((d === 3 || d === 4) && u.stateNode.containerInfo === a)
                return;
              u = u.return;
            }
          for (; c !== null; ) {
            if (u = Ql(c), u === null) return;
            if (d = u.tag, d === 5 || d === 6 || d === 26 || d === 27) {
              n = i = u;
              continue t;
            }
            c = c.parentNode;
          }
        }
        n = n.return;
      }
    kr(function() {
      var E = i, M = cu(l), U = [];
      t: {
        var A = vo.get(t);
        if (A !== void 0) {
          var O = La, $ = t;
          switch (t) {
            case "keypress":
              if (Va(l) === 0) break t;
            case "keydown":
            case "keyup":
              O = sh;
              break;
            case "focusin":
              $ = "focus", O = hu;
              break;
            case "focusout":
              $ = "blur", O = hu;
              break;
            case "beforeblur":
            case "afterblur":
              O = hu;
              break;
            case "click":
              if (l.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              O = Gr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = Id;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = hh;
              break;
            case oo:
            case so:
            case fo:
              O = eh;
              break;
            case ho:
              O = gh;
              break;
            case "scroll":
            case "scrollend":
              O = Wd;
              break;
            case "wheel":
              O = ph;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = nh;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = Xr;
              break;
            case "toggle":
            case "beforetoggle":
              O = bh;
          }
          var Q = (e & 4) !== 0, bt = !Q && (t === "scroll" || t === "scrollend"), S = Q ? A !== null ? A + "Capture" : null : A;
          Q = [];
          for (var p = E, x; p !== null; ) {
            var _ = p;
            if (x = _.stateNode, _ = _.tag, _ !== 5 && _ !== 26 && _ !== 27 || x === null || S === null || (_ = qn(p, S), _ != null && Q.push(
              pa(p, _, x)
            )), bt) break;
            p = p.return;
          }
          0 < Q.length && (A = new O(
            A,
            $,
            null,
            l,
            M
          ), U.push({ event: A, listeners: Q }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (A = t === "mouseover" || t === "pointerover", O = t === "mouseout" || t === "pointerout", A && l !== uu && ($ = l.relatedTarget || l.fromElement) && (Ql($) || $[Xl]))
            break t;
          if ((O || A) && (A = M.window === M ? M : (A = M.ownerDocument) ? A.defaultView || A.parentWindow : window, O ? ($ = l.relatedTarget || l.toElement, O = E, $ = $ ? Ql($) : null, $ !== null && (bt = b($), Q = $.tag, $ !== bt || Q !== 5 && Q !== 27 && Q !== 6) && ($ = null)) : (O = null, $ = E), O !== $)) {
            if (Q = Gr, _ = "onMouseLeave", S = "onMouseEnter", p = "mouse", (t === "pointerout" || t === "pointerover") && (Q = Xr, _ = "onPointerLeave", S = "onPointerEnter", p = "pointer"), bt = O == null ? A : Hn(O), x = $ == null ? A : Hn($), A = new Q(
              _,
              p + "leave",
              O,
              l,
              M
            ), A.target = bt, A.relatedTarget = x, _ = null, Ql(M) === E && (Q = new Q(
              S,
              p + "enter",
              $,
              l,
              M
            ), Q.target = x, Q.relatedTarget = bt, _ = Q), bt = _, O && $)
              e: {
                for (Q = O, S = $, p = 0, x = Q; x; x = zn(x))
                  p++;
                for (x = 0, _ = S; _; _ = zn(_))
                  x++;
                for (; 0 < p - x; )
                  Q = zn(Q), p--;
                for (; 0 < x - p; )
                  S = zn(S), x--;
                for (; p--; ) {
                  if (Q === S || S !== null && Q === S.alternate)
                    break e;
                  Q = zn(Q), S = zn(S);
                }
                Q = null;
              }
            else Q = null;
            O !== null && qf(
              U,
              A,
              O,
              Q,
              !1
            ), $ !== null && bt !== null && qf(
              U,
              bt,
              $,
              Q,
              !0
            );
          }
        }
        t: {
          if (A = E ? Hn(E) : window, O = A.nodeName && A.nodeName.toLowerCase(), O === "select" || O === "input" && A.type === "file")
            var k = Ir;
          else if (Wr(A))
            if (Pr)
              k = Dh;
            else {
              k = wh;
              var nt = zh;
            }
          else
            O = A.nodeName, !O || O.toLowerCase() !== "input" || A.type !== "checkbox" && A.type !== "radio" ? E && iu(E.elementType) && (k = Ir) : k = Mh;
          if (k && (k = k(t, E))) {
            Fr(
              U,
              k,
              l,
              M
            );
            break t;
          }
          nt && nt(t, A, E), t === "focusout" && E && A.type === "number" && E.memoizedProps.value != null && au(A, "number", A.value);
        }
        switch (nt = E ? Hn(E) : window, t) {
          case "focusin":
            (Wr(nt) || nt.contentEditable === "true") && (en = nt, bu = E, Ln = null);
            break;
          case "focusout":
            Ln = bu = en = null;
            break;
          case "mousedown":
            Su = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Su = !1, co(U, l, M);
            break;
          case "selectionchange":
            if (Nh) break;
          case "keydown":
          case "keyup":
            co(U, l, M);
        }
        var C;
        if (gu)
          t: {
            switch (t) {
              case "compositionstart":
                var Z = "onCompositionStart";
                break t;
              case "compositionend":
                Z = "onCompositionEnd";
                break t;
              case "compositionupdate":
                Z = "onCompositionUpdate";
                break t;
            }
            Z = void 0;
          }
        else
          tn ? Jr(t, l) && (Z = "onCompositionEnd") : t === "keydown" && l.keyCode === 229 && (Z = "onCompositionStart");
        Z && (Qr && l.locale !== "ko" && (tn || Z !== "onCompositionStart" ? Z === "onCompositionEnd" && tn && (C = Cr()) : (Pe = M, su = "value" in Pe ? Pe.value : Pe.textContent, tn = !0)), nt = _i(E, Z), 0 < nt.length && (Z = new Lr(
          Z,
          t,
          null,
          l,
          M
        ), U.push({ event: Z, listeners: nt }), C ? Z.data = C : (C = $r(l), C !== null && (Z.data = C)))), (C = xh ? Eh(t, l) : Th(t, l)) && (Z = _i(E, "onBeforeInput"), 0 < Z.length && (nt = new Lr(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          M
        ), U.push({
          event: nt,
          listeners: Z
        }), nt.data = C)), hv(
          U,
          t,
          E,
          l,
          M
        );
      }
      Rf(U, e);
    });
  }
  function pa(t, e, l) {
    return {
      instance: t,
      listener: e,
      currentTarget: l
    };
  }
  function _i(t, e) {
    for (var l = e + "Capture", n = []; t !== null; ) {
      var a = t, i = a.stateNode;
      if (a = a.tag, a !== 5 && a !== 26 && a !== 27 || i === null || (a = qn(t, l), a != null && n.unshift(
        pa(t, a, i)
      ), a = qn(t, e), a != null && n.push(
        pa(t, a, i)
      )), t.tag === 3) return n;
      t = t.return;
    }
    return [];
  }
  function zn(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function qf(t, e, l, n, a) {
    for (var i = e._reactName, u = []; l !== null && l !== n; ) {
      var c = l, d = c.alternate, E = c.stateNode;
      if (c = c.tag, d !== null && d === n) break;
      c !== 5 && c !== 26 && c !== 27 || E === null || (d = E, a ? (E = qn(l, i), E != null && u.unshift(
        pa(l, E, d)
      )) : a || (E = qn(l, i), E != null && u.push(
        pa(l, E, d)
      ))), l = l.return;
    }
    u.length !== 0 && t.push({ event: e, listeners: u });
  }
  var pv = /\r\n?/g, mv = /\u0000|\uFFFD/g;
  function jf(t) {
    return (typeof t == "string" ? t : "" + t).replace(pv, `
`).replace(mv, "");
  }
  function Yf(t, e) {
    return e = jf(e), jf(t) === e;
  }
  function Ni() {
  }
  function mt(t, e, l, n, a, i) {
    switch (l) {
      case "children":
        typeof n == "string" ? e === "body" || e === "textarea" && n === "" || Fl(t, n) : (typeof n == "number" || typeof n == "bigint") && e !== "body" && Fl(t, "" + n);
        break;
      case "className":
        ja(t, "class", n);
        break;
      case "tabIndex":
        ja(t, "tabindex", n);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        ja(t, l, n);
        break;
      case "style":
        Yr(t, n, i);
        break;
      case "data":
        if (e !== "object") {
          ja(t, "data", n);
          break;
        }
      case "src":
      case "href":
        if (n === "" && (e !== "a" || l !== "href")) {
          t.removeAttribute(l);
          break;
        }
        if (n == null || typeof n == "function" || typeof n == "symbol" || typeof n == "boolean") {
          t.removeAttribute(l);
          break;
        }
        n = ka("" + n), t.setAttribute(l, n);
        break;
      case "action":
      case "formAction":
        if (typeof n == "function") {
          t.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof i == "function" && (l === "formAction" ? (e !== "input" && mt(t, e, "name", a.name, a, null), mt(
            t,
            e,
            "formEncType",
            a.formEncType,
            a,
            null
          ), mt(
            t,
            e,
            "formMethod",
            a.formMethod,
            a,
            null
          ), mt(
            t,
            e,
            "formTarget",
            a.formTarget,
            a,
            null
          )) : (mt(t, e, "encType", a.encType, a, null), mt(t, e, "method", a.method, a, null), mt(t, e, "target", a.target, a, null)));
        if (n == null || typeof n == "symbol" || typeof n == "boolean") {
          t.removeAttribute(l);
          break;
        }
        n = ka("" + n), t.setAttribute(l, n);
        break;
      case "onClick":
        n != null && (t.onclick = Ni);
        break;
      case "onScroll":
        n != null && it("scroll", t);
        break;
      case "onScrollEnd":
        n != null && it("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (n != null) {
          if (typeof n != "object" || !("__html" in n))
            throw Error(r(61));
          if (l = n.__html, l != null) {
            if (a.children != null) throw Error(r(60));
            t.innerHTML = l;
          }
        }
        break;
      case "multiple":
        t.multiple = n && typeof n != "function" && typeof n != "symbol";
        break;
      case "muted":
        t.muted = n && typeof n != "function" && typeof n != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (n == null || typeof n == "function" || typeof n == "boolean" || typeof n == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        l = ka("" + n), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        n != null && typeof n != "function" && typeof n != "symbol" ? t.setAttribute(l, "" + n) : t.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        n && typeof n != "function" && typeof n != "symbol" ? t.setAttribute(l, "") : t.removeAttribute(l);
        break;
      case "capture":
      case "download":
        n === !0 ? t.setAttribute(l, "") : n !== !1 && n != null && typeof n != "function" && typeof n != "symbol" ? t.setAttribute(l, n) : t.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        n != null && typeof n != "function" && typeof n != "symbol" && !isNaN(n) && 1 <= n ? t.setAttribute(l, n) : t.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        n == null || typeof n == "function" || typeof n == "symbol" || isNaN(n) ? t.removeAttribute(l) : t.setAttribute(l, n);
        break;
      case "popover":
        it("beforetoggle", t), it("toggle", t), qa(t, "popover", n);
        break;
      case "xlinkActuate":
        qe(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          n
        );
        break;
      case "xlinkArcrole":
        qe(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          n
        );
        break;
      case "xlinkRole":
        qe(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          n
        );
        break;
      case "xlinkShow":
        qe(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          n
        );
        break;
      case "xlinkTitle":
        qe(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          n
        );
        break;
      case "xlinkType":
        qe(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          n
        );
        break;
      case "xmlBase":
        qe(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          n
        );
        break;
      case "xmlLang":
        qe(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          n
        );
        break;
      case "xmlSpace":
        qe(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          n
        );
        break;
      case "is":
        qa(t, "is", n);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = Jd.get(l) || l, qa(t, l, n));
    }
  }
  function Lc(t, e, l, n, a, i) {
    switch (l) {
      case "style":
        Yr(t, n, i);
        break;
      case "dangerouslySetInnerHTML":
        if (n != null) {
          if (typeof n != "object" || !("__html" in n))
            throw Error(r(61));
          if (l = n.__html, l != null) {
            if (a.children != null) throw Error(r(60));
            t.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof n == "string" ? Fl(t, n) : (typeof n == "number" || typeof n == "bigint") && Fl(t, "" + n);
        break;
      case "onScroll":
        n != null && it("scroll", t);
        break;
      case "onScrollEnd":
        n != null && it("scrollend", t);
        break;
      case "onClick":
        n != null && (t.onclick = Ni);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!zr.hasOwnProperty(l))
          t: {
            if (l[0] === "o" && l[1] === "n" && (a = l.endsWith("Capture"), e = l.slice(2, a ? l.length - 7 : void 0), i = t[It] || null, i = i != null ? i[l] : null, typeof i == "function" && t.removeEventListener(e, i, a), typeof n == "function")) {
              typeof i != "function" && i !== null && (l in t ? t[l] = null : t.hasAttribute(l) && t.removeAttribute(l)), t.addEventListener(e, n, a);
              break t;
            }
            l in t ? t[l] = n : n === !0 ? t.setAttribute(l, "") : qa(t, l, n);
          }
    }
  }
  function Qt(t, e, l) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        it("error", t), it("load", t);
        var n = !1, a = !1, i;
        for (i in l)
          if (l.hasOwnProperty(i)) {
            var u = l[i];
            if (u != null)
              switch (i) {
                case "src":
                  n = !0;
                  break;
                case "srcSet":
                  a = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, e));
                default:
                  mt(t, e, i, u, l, null);
              }
          }
        a && mt(t, e, "srcSet", l.srcSet, l, null), n && mt(t, e, "src", l.src, l, null);
        return;
      case "input":
        it("invalid", t);
        var c = i = u = a = null, d = null, E = null;
        for (n in l)
          if (l.hasOwnProperty(n)) {
            var M = l[n];
            if (M != null)
              switch (n) {
                case "name":
                  a = M;
                  break;
                case "type":
                  u = M;
                  break;
                case "checked":
                  d = M;
                  break;
                case "defaultChecked":
                  E = M;
                  break;
                case "value":
                  i = M;
                  break;
                case "defaultValue":
                  c = M;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (M != null)
                    throw Error(r(137, e));
                  break;
                default:
                  mt(t, e, n, M, l, null);
              }
          }
        Rr(
          t,
          i,
          c,
          d,
          E,
          u,
          a,
          !1
        ), Ya(t);
        return;
      case "select":
        it("invalid", t), n = u = i = null;
        for (a in l)
          if (l.hasOwnProperty(a) && (c = l[a], c != null))
            switch (a) {
              case "value":
                i = c;
                break;
              case "defaultValue":
                u = c;
                break;
              case "multiple":
                n = c;
              default:
                mt(t, e, a, c, l, null);
            }
        e = i, l = u, t.multiple = !!n, e != null ? Wl(t, !!n, e, !1) : l != null && Wl(t, !!n, l, !0);
        return;
      case "textarea":
        it("invalid", t), i = a = n = null;
        for (u in l)
          if (l.hasOwnProperty(u) && (c = l[u], c != null))
            switch (u) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                a = c;
                break;
              case "children":
                i = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(r(91));
                break;
              default:
                mt(t, e, u, c, l, null);
            }
        qr(t, n, a, i), Ya(t);
        return;
      case "option":
        for (d in l)
          if (l.hasOwnProperty(d) && (n = l[d], n != null))
            switch (d) {
              case "selected":
                t.selected = n && typeof n != "function" && typeof n != "symbol";
                break;
              default:
                mt(t, e, d, n, l, null);
            }
        return;
      case "dialog":
        it("beforetoggle", t), it("toggle", t), it("cancel", t), it("close", t);
        break;
      case "iframe":
      case "object":
        it("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < ya.length; n++)
          it(ya[n], t);
        break;
      case "image":
        it("error", t), it("load", t);
        break;
      case "details":
        it("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        it("error", t), it("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (E in l)
          if (l.hasOwnProperty(E) && (n = l[E], n != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                mt(t, e, E, n, l, null);
            }
        return;
      default:
        if (iu(e)) {
          for (M in l)
            l.hasOwnProperty(M) && (n = l[M], n !== void 0 && Lc(
              t,
              e,
              M,
              n,
              l,
              void 0
            ));
          return;
        }
    }
    for (c in l)
      l.hasOwnProperty(c) && (n = l[c], n != null && mt(t, e, c, n, l, null));
  }
  function bv(t, e, l, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var a = null, i = null, u = null, c = null, d = null, E = null, M = null;
        for (O in l) {
          var U = l[O];
          if (l.hasOwnProperty(O) && U != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                d = U;
              default:
                n.hasOwnProperty(O) || mt(t, e, O, null, n, U);
            }
        }
        for (var A in n) {
          var O = n[A];
          if (U = l[A], n.hasOwnProperty(A) && (O != null || U != null))
            switch (A) {
              case "type":
                i = O;
                break;
              case "name":
                a = O;
                break;
              case "checked":
                E = O;
                break;
              case "defaultChecked":
                M = O;
                break;
              case "value":
                u = O;
                break;
              case "defaultValue":
                c = O;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(r(137, e));
                break;
              default:
                O !== U && mt(
                  t,
                  e,
                  A,
                  O,
                  n,
                  U
                );
            }
        }
        nu(
          t,
          u,
          c,
          d,
          E,
          M,
          i,
          a
        );
        return;
      case "select":
        O = u = c = A = null;
        for (i in l)
          if (d = l[i], l.hasOwnProperty(i) && d != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                O = d;
              default:
                n.hasOwnProperty(i) || mt(
                  t,
                  e,
                  i,
                  null,
                  n,
                  d
                );
            }
        for (a in n)
          if (i = n[a], d = l[a], n.hasOwnProperty(a) && (i != null || d != null))
            switch (a) {
              case "value":
                A = i;
                break;
              case "defaultValue":
                c = i;
                break;
              case "multiple":
                u = i;
              default:
                i !== d && mt(
                  t,
                  e,
                  a,
                  i,
                  n,
                  d
                );
            }
        e = c, l = u, n = O, A != null ? Wl(t, !!l, A, !1) : !!n != !!l && (e != null ? Wl(t, !!l, e, !0) : Wl(t, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        O = A = null;
        for (c in l)
          if (a = l[c], l.hasOwnProperty(c) && a != null && !n.hasOwnProperty(c))
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                mt(t, e, c, null, n, a);
            }
        for (u in n)
          if (a = n[u], i = l[u], n.hasOwnProperty(u) && (a != null || i != null))
            switch (u) {
              case "value":
                A = a;
                break;
              case "defaultValue":
                O = a;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (a != null) throw Error(r(91));
                break;
              default:
                a !== i && mt(t, e, u, a, n, i);
            }
        Hr(t, A, O);
        return;
      case "option":
        for (var $ in l)
          if (A = l[$], l.hasOwnProperty($) && A != null && !n.hasOwnProperty($))
            switch ($) {
              case "selected":
                t.selected = !1;
                break;
              default:
                mt(
                  t,
                  e,
                  $,
                  null,
                  n,
                  A
                );
            }
        for (d in n)
          if (A = n[d], O = l[d], n.hasOwnProperty(d) && A !== O && (A != null || O != null))
            switch (d) {
              case "selected":
                t.selected = A && typeof A != "function" && typeof A != "symbol";
                break;
              default:
                mt(
                  t,
                  e,
                  d,
                  A,
                  n,
                  O
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var Q in l)
          A = l[Q], l.hasOwnProperty(Q) && A != null && !n.hasOwnProperty(Q) && mt(t, e, Q, null, n, A);
        for (E in n)
          if (A = n[E], O = l[E], n.hasOwnProperty(E) && A !== O && (A != null || O != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(r(137, e));
                break;
              default:
                mt(
                  t,
                  e,
                  E,
                  A,
                  n,
                  O
                );
            }
        return;
      default:
        if (iu(e)) {
          for (var bt in l)
            A = l[bt], l.hasOwnProperty(bt) && A !== void 0 && !n.hasOwnProperty(bt) && Lc(
              t,
              e,
              bt,
              void 0,
              n,
              A
            );
          for (M in n)
            A = n[M], O = l[M], !n.hasOwnProperty(M) || A === O || A === void 0 && O === void 0 || Lc(
              t,
              e,
              M,
              A,
              n,
              O
            );
          return;
        }
    }
    for (var S in l)
      A = l[S], l.hasOwnProperty(S) && A != null && !n.hasOwnProperty(S) && mt(t, e, S, null, n, A);
    for (U in n)
      A = n[U], O = l[U], !n.hasOwnProperty(U) || A === O || A == null && O == null || mt(t, e, U, A, n, O);
  }
  var Xc = null, Qc = null;
  function Ui(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Bf(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function kf(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Zc(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Kc = null;
  function Sv() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Kc ? !1 : (Kc = t, !0) : (Kc = null, !1);
  }
  var Cf = typeof setTimeout == "function" ? setTimeout : void 0, xv = typeof clearTimeout == "function" ? clearTimeout : void 0, Vf = typeof Promise == "function" ? Promise : void 0, Ev = typeof queueMicrotask == "function" ? queueMicrotask : typeof Vf != "undefined" ? function(t) {
    return Vf.resolve(null).then(t).catch(Tv);
  } : Cf;
  function Tv(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function gl(t) {
    return t === "head";
  }
  function Gf(t, e) {
    var l = e, n = 0, a = 0;
    do {
      var i = l.nextSibling;
      if (t.removeChild(l), i && i.nodeType === 8)
        if (l = i.data, l === "/$") {
          if (0 < n && 8 > n) {
            l = n;
            var u = t.ownerDocument;
            if (l & 1 && ma(u.documentElement), l & 2 && ma(u.body), l & 4)
              for (l = u.head, ma(l), u = l.firstChild; u; ) {
                var c = u.nextSibling, d = u.nodeName;
                u[Rn] || d === "SCRIPT" || d === "STYLE" || d === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = c;
              }
          }
          if (a === 0) {
            t.removeChild(i), za(e);
            return;
          }
          a--;
        } else
          l === "$" || l === "$?" || l === "$!" ? a++ : n = l.charCodeAt(0) - 48;
      else n = 0;
      l = i;
    } while (l);
    za(e);
  }
  function Jc(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (e = e.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Jc(l), Pi(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(l);
    }
  }
  function Av(t, e, l, n) {
    for (; t.nodeType === 1; ) {
      var a = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!n && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (n) {
        if (!t[Rn])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (i = t.getAttribute("rel"), i === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (i !== a.rel || t.getAttribute("href") !== (a.href == null || a.href === "" ? null : a.href) || t.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin) || t.getAttribute("title") !== (a.title == null ? null : a.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (i = t.getAttribute("src"), (i !== (a.src == null ? null : a.src) || t.getAttribute("type") !== (a.type == null ? null : a.type) || t.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin)) && i && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var i = a.name == null ? null : "" + a.name;
        if (a.type === "hidden" && t.getAttribute("name") === i)
          return t;
      } else return t;
      if (t = we(t.nextSibling), t === null) break;
    }
    return null;
  }
  function Ov(t, e, l) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l || (t = we(t.nextSibling), t === null)) return null;
    return t;
  }
  function $c(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState === "complete";
  }
  function zv(t, e) {
    var l = t.ownerDocument;
    if (t.data !== "$?" || l.readyState === "complete")
      e();
    else {
      var n = function() {
        e(), l.removeEventListener("DOMContentLoaded", n);
      };
      l.addEventListener("DOMContentLoaded", n), t._reactRetry = n;
    }
  }
  function we(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")
          break;
        if (e === "/$") return null;
      }
    }
    return t;
  }
  var Wc = null;
  function Lf(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (e === 0) return t;
          e--;
        } else l === "/$" && e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Xf(t, e, l) {
    switch (e = Ui(l), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(r(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(r(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function ma(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    Pi(t);
  }
  var Te = /* @__PURE__ */ new Map(), Qf = /* @__PURE__ */ new Set();
  function Ri(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var $e = Y.d;
  Y.d = {
    f: wv,
    r: Mv,
    D: Dv,
    C: _v,
    L: Nv,
    m: Uv,
    X: Hv,
    S: Rv,
    M: qv
  };
  function wv() {
    var t = $e.f(), e = Ai();
    return t || e;
  }
  function Mv(t) {
    var e = Zl(t);
    e !== null && e.tag === 5 && e.type === "form" ? ss(e) : $e.r(t);
  }
  var wn = typeof document == "undefined" ? null : document;
  function Zf(t, e, l) {
    var n = wn;
    if (n && typeof e == "string" && e) {
      var a = ye(e);
      a = 'link[rel="' + t + '"][href="' + a + '"]', typeof l == "string" && (a += '[crossorigin="' + l + '"]'), Qf.has(a) || (Qf.add(a), t = { rel: t, crossOrigin: l, href: e }, n.querySelector(a) === null && (e = n.createElement("link"), Qt(e, "link", t), Bt(e), n.head.appendChild(e)));
    }
  }
  function Dv(t) {
    $e.D(t), Zf("dns-prefetch", t, null);
  }
  function _v(t, e) {
    $e.C(t, e), Zf("preconnect", t, e);
  }
  function Nv(t, e, l) {
    $e.L(t, e, l);
    var n = wn;
    if (n && t && e) {
      var a = 'link[rel="preload"][as="' + ye(e) + '"]';
      e === "image" && l && l.imageSrcSet ? (a += '[imagesrcset="' + ye(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (a += '[imagesizes="' + ye(
        l.imageSizes
      ) + '"]')) : a += '[href="' + ye(t) + '"]';
      var i = a;
      switch (e) {
        case "style":
          i = Mn(t);
          break;
        case "script":
          i = Dn(t);
      }
      Te.has(i) || (t = m(
        {
          rel: "preload",
          href: e === "image" && l && l.imageSrcSet ? void 0 : t,
          as: e
        },
        l
      ), Te.set(i, t), n.querySelector(a) !== null || e === "style" && n.querySelector(ba(i)) || e === "script" && n.querySelector(Sa(i)) || (e = n.createElement("link"), Qt(e, "link", t), Bt(e), n.head.appendChild(e)));
    }
  }
  function Uv(t, e) {
    $e.m(t, e);
    var l = wn;
    if (l && t) {
      var n = e && typeof e.as == "string" ? e.as : "script", a = 'link[rel="modulepreload"][as="' + ye(n) + '"][href="' + ye(t) + '"]', i = a;
      switch (n) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Dn(t);
      }
      if (!Te.has(i) && (t = m({ rel: "modulepreload", href: t }, e), Te.set(i, t), l.querySelector(a) === null)) {
        switch (n) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Sa(i)))
              return;
        }
        n = l.createElement("link"), Qt(n, "link", t), Bt(n), l.head.appendChild(n);
      }
    }
  }
  function Rv(t, e, l) {
    $e.S(t, e, l);
    var n = wn;
    if (n && t) {
      var a = Kl(n).hoistableStyles, i = Mn(t);
      e = e || "default";
      var u = a.get(i);
      if (!u) {
        var c = { loading: 0, preload: null };
        if (u = n.querySelector(
          ba(i)
        ))
          c.loading = 5;
        else {
          t = m(
            { rel: "stylesheet", href: t, "data-precedence": e },
            l
          ), (l = Te.get(i)) && Fc(t, l);
          var d = u = n.createElement("link");
          Bt(d), Qt(d, "link", t), d._p = new Promise(function(E, M) {
            d.onload = E, d.onerror = M;
          }), d.addEventListener("load", function() {
            c.loading |= 1;
          }), d.addEventListener("error", function() {
            c.loading |= 2;
          }), c.loading |= 4, Hi(u, e, n);
        }
        u = {
          type: "stylesheet",
          instance: u,
          count: 1,
          state: c
        }, a.set(i, u);
      }
    }
  }
  function Hv(t, e) {
    $e.X(t, e);
    var l = wn;
    if (l && t) {
      var n = Kl(l).hoistableScripts, a = Dn(t), i = n.get(a);
      i || (i = l.querySelector(Sa(a)), i || (t = m({ src: t, async: !0 }, e), (e = Te.get(a)) && Ic(t, e), i = l.createElement("script"), Bt(i), Qt(i, "link", t), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, n.set(a, i));
    }
  }
  function qv(t, e) {
    $e.M(t, e);
    var l = wn;
    if (l && t) {
      var n = Kl(l).hoistableScripts, a = Dn(t), i = n.get(a);
      i || (i = l.querySelector(Sa(a)), i || (t = m({ src: t, async: !0, type: "module" }, e), (e = Te.get(a)) && Ic(t, e), i = l.createElement("script"), Bt(i), Qt(i, "link", t), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, n.set(a, i));
    }
  }
  function Kf(t, e, l, n) {
    var a = (a = W.current) ? Ri(a) : null;
    if (!a) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (e = Mn(l.href), l = Kl(
          a
        ).hoistableStyles, n = l.get(e), n || (n = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(e, n)), n) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          t = Mn(l.href);
          var i = Kl(
            a
          ).hoistableStyles, u = i.get(t);
          if (u || (a = a.ownerDocument || a, u = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(t, u), (i = a.querySelector(
            ba(t)
          )) && !i._p && (u.instance = i, u.state.loading = 5), Te.has(t) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Te.set(t, l), i || jv(
            a,
            t,
            l,
            u.state
          ))), e && n === null)
            throw Error(r(528, ""));
          return u;
        }
        if (e && n !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return e = l.async, l = l.src, typeof l == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = Dn(l), l = Kl(
          a
        ).hoistableScripts, n = l.get(e), n || (n = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(e, n)), n) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, t));
    }
  }
  function Mn(t) {
    return 'href="' + ye(t) + '"';
  }
  function ba(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Jf(t) {
    return m({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function jv(t, e, l, n) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? n.loading = 1 : (e = t.createElement("link"), n.preload = e, e.addEventListener("load", function() {
      return n.loading |= 1;
    }), e.addEventListener("error", function() {
      return n.loading |= 2;
    }), Qt(e, "link", l), Bt(e), t.head.appendChild(e));
  }
  function Dn(t) {
    return '[src="' + ye(t) + '"]';
  }
  function Sa(t) {
    return "script[async]" + t;
  }
  function $f(t, e, l) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var n = t.querySelector(
            'style[data-href~="' + ye(l.href) + '"]'
          );
          if (n)
            return e.instance = n, Bt(n), n;
          var a = m({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return n = (t.ownerDocument || t).createElement(
            "style"
          ), Bt(n), Qt(n, "style", a), Hi(n, l.precedence, t), e.instance = n;
        case "stylesheet":
          a = Mn(l.href);
          var i = t.querySelector(
            ba(a)
          );
          if (i)
            return e.state.loading |= 4, e.instance = i, Bt(i), i;
          n = Jf(l), (a = Te.get(a)) && Fc(n, a), i = (t.ownerDocument || t).createElement("link"), Bt(i);
          var u = i;
          return u._p = new Promise(function(c, d) {
            u.onload = c, u.onerror = d;
          }), Qt(i, "link", n), e.state.loading |= 4, Hi(i, l.precedence, t), e.instance = i;
        case "script":
          return i = Dn(l.src), (a = t.querySelector(
            Sa(i)
          )) ? (e.instance = a, Bt(a), a) : (n = l, (a = Te.get(i)) && (n = m({}, l), Ic(n, a)), t = t.ownerDocument || t, a = t.createElement("script"), Bt(a), Qt(a, "link", n), t.head.appendChild(a), e.instance = a);
        case "void":
          return null;
        default:
          throw Error(r(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (n = e.instance, e.state.loading |= 4, Hi(n, l.precedence, t));
    return e.instance;
  }
  function Hi(t, e, l) {
    for (var n = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), a = n.length ? n[n.length - 1] : null, i = a, u = 0; u < n.length; u++) {
      var c = n[u];
      if (c.dataset.precedence === e) i = c;
      else if (i !== a) break;
    }
    i ? i.parentNode.insertBefore(t, i.nextSibling) : (e = l.nodeType === 9 ? l.head : l, e.insertBefore(t, e.firstChild));
  }
  function Fc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Ic(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var qi = null;
  function Wf(t, e, l) {
    if (qi === null) {
      var n = /* @__PURE__ */ new Map(), a = qi = /* @__PURE__ */ new Map();
      a.set(l, n);
    } else
      a = qi, n = a.get(l), n || (n = /* @__PURE__ */ new Map(), a.set(l, n));
    if (n.has(t)) return n;
    for (n.set(t, null), l = l.getElementsByTagName(t), a = 0; a < l.length; a++) {
      var i = l[a];
      if (!(i[Rn] || i[Jt] || t === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var u = i.getAttribute(e) || "";
        u = t + u;
        var c = n.get(u);
        c ? c.push(i) : n.set(u, [i]);
      }
    }
    return n;
  }
  function Ff(t, e, l) {
    t = t.ownerDocument || t, t.head.insertBefore(
      l,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function Yv(t, e, l) {
    if (l === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        switch (e.rel) {
          case "stylesheet":
            return t = e.disabled, typeof e.precedence == "string" && t == null;
          default:
            return !0;
        }
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function If(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  var xa = null;
  function Bv() {
  }
  function kv(t, e, l) {
    if (xa === null) throw Error(r(475));
    var n = xa;
    if (e.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var a = Mn(l.href), i = t.querySelector(
          ba(a)
        );
        if (i) {
          t = i._p, t !== null && typeof t == "object" && typeof t.then == "function" && (n.count++, n = ji.bind(n), t.then(n, n)), e.state.loading |= 4, e.instance = i, Bt(i);
          return;
        }
        i = t.ownerDocument || t, l = Jf(l), (a = Te.get(a)) && Fc(l, a), i = i.createElement("link"), Bt(i);
        var u = i;
        u._p = new Promise(function(c, d) {
          u.onload = c, u.onerror = d;
        }), Qt(i, "link", l), e.instance = i;
      }
      n.stylesheets === null && (n.stylesheets = /* @__PURE__ */ new Map()), n.stylesheets.set(e, t), (t = e.state.preload) && (e.state.loading & 3) === 0 && (n.count++, e = ji.bind(n), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  function Cv() {
    if (xa === null) throw Error(r(475));
    var t = xa;
    return t.stylesheets && t.count === 0 && Pc(t, t.stylesheets), 0 < t.count ? function(e) {
      var l = setTimeout(function() {
        if (t.stylesheets && Pc(t, t.stylesheets), t.unsuspend) {
          var n = t.unsuspend;
          t.unsuspend = null, n();
        }
      }, 6e4);
      return t.unsuspend = e, function() {
        t.unsuspend = null, clearTimeout(l);
      };
    } : null;
  }
  function ji() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Pc(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var Yi = null;
  function Pc(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Yi = /* @__PURE__ */ new Map(), e.forEach(Vv, t), Yi = null, ji.call(t));
  }
  function Vv(t, e) {
    if (!(e.state.loading & 4)) {
      var l = Yi.get(t);
      if (l) var n = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Yi.set(t, l);
        for (var a = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < a.length; i++) {
          var u = a[i];
          (u.nodeName === "LINK" || u.getAttribute("media") !== "not all") && (l.set(u.dataset.precedence, u), n = u);
        }
        n && l.set(null, n);
      }
      a = e.instance, u = a.getAttribute("data-precedence"), i = l.get(u) || n, i === n && l.set(null, a), l.set(u, a), this.count++, n = ji.bind(this), a.addEventListener("load", n), a.addEventListener("error", n), i ? i.parentNode.insertBefore(a, i.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(a, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Ea = {
    $$typeof: ht,
    Provider: null,
    Consumer: null,
    _currentValue: K,
    _currentValue2: K,
    _threadCount: 0
  };
  function Gv(t, e, l, n, a, i, u, c) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $i(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $i(0), this.hiddenUpdates = $i(null), this.identifierPrefix = n, this.onUncaughtError = a, this.onCaughtError = i, this.onRecoverableError = u, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Pf(t, e, l, n, a, i, u, c, d, E, M, U) {
    return t = new Gv(
      t,
      e,
      l,
      u,
      c,
      d,
      E,
      U
    ), e = 1, i === !0 && (e |= 24), i = re(3, null, null, e), t.current = i, i.stateNode = t, e = Hu(), e.refCount++, t.pooledCache = e, e.refCount++, i.memoizedState = {
      element: n,
      isDehydrated: l,
      cache: e
    }, Bu(i), t;
  }
  function td(t) {
    return t ? (t = un, t) : un;
  }
  function ed(t, e, l, n, a, i) {
    a = td(a), n.context === null ? n.context = a : n.pendingContext = a, n = ll(e), n.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (n.callback = i), l = nl(t, n, e), l !== null && (he(l, t, e), In(l, t, e));
  }
  function ld(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function tr(t, e) {
    ld(t, e), (t = t.alternate) && ld(t, e);
  }
  function nd(t) {
    if (t.tag === 13) {
      var e = an(t, 67108864);
      e !== null && he(e, t, 67108864), tr(t, 67108864);
    }
  }
  var Bi = !0;
  function Lv(t, e, l, n) {
    var a = D.T;
    D.T = null;
    var i = Y.p;
    try {
      Y.p = 2, er(t, e, l, n);
    } finally {
      Y.p = i, D.T = a;
    }
  }
  function Xv(t, e, l, n) {
    var a = D.T;
    D.T = null;
    var i = Y.p;
    try {
      Y.p = 8, er(t, e, l, n);
    } finally {
      Y.p = i, D.T = a;
    }
  }
  function er(t, e, l, n) {
    if (Bi) {
      var a = lr(n);
      if (a === null)
        Gc(
          t,
          e,
          n,
          ki,
          l
        ), id(t, n);
      else if (Zv(
        a,
        t,
        e,
        l,
        n
      ))
        n.stopPropagation();
      else if (id(t, n), e & 4 && -1 < Qv.indexOf(t)) {
        for (; a !== null; ) {
          var i = Zl(a);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var u = Al(i.pendingLanes);
                  if (u !== 0) {
                    var c = i;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; u; ) {
                      var d = 1 << 31 - ue(u);
                      c.entanglements[1] |= d, u &= ~d;
                    }
                    He(i), (gt & 6) === 0 && (Ei = De() + 500, ga(0));
                  }
                }
                break;
              case 13:
                c = an(i, 2), c !== null && he(c, i, 2), Ai(), tr(i, 2);
            }
          if (i = lr(n), i === null && Gc(
            t,
            e,
            n,
            ki,
            l
          ), i === a) break;
          a = i;
        }
        a !== null && n.stopPropagation();
      } else
        Gc(
          t,
          e,
          n,
          null,
          l
        );
    }
  }
  function lr(t) {
    return t = cu(t), nr(t);
  }
  var ki = null;
  function nr(t) {
    if (ki = null, t = Ql(t), t !== null) {
      var e = b(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (t = h(e), t !== null) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ki = t, null;
  }
  function ad(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (_d()) {
          case yr:
            return 2;
          case pr:
            return 8;
          case Na:
          case Nd:
            return 32;
          case mr:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ar = !1, yl = null, pl = null, ml = null, Ta = /* @__PURE__ */ new Map(), Aa = /* @__PURE__ */ new Map(), bl = [], Qv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function id(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        yl = null;
        break;
      case "dragenter":
      case "dragleave":
        pl = null;
        break;
      case "mouseover":
      case "mouseout":
        ml = null;
        break;
      case "pointerover":
      case "pointerout":
        Ta.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Aa.delete(e.pointerId);
    }
  }
  function Oa(t, e, l, n, a, i) {
    return t === null || t.nativeEvent !== i ? (t = {
      blockedOn: e,
      domEventName: l,
      eventSystemFlags: n,
      nativeEvent: i,
      targetContainers: [a]
    }, e !== null && (e = Zl(e), e !== null && nd(e)), t) : (t.eventSystemFlags |= n, e = t.targetContainers, a !== null && e.indexOf(a) === -1 && e.push(a), t);
  }
  function Zv(t, e, l, n, a) {
    switch (e) {
      case "focusin":
        return yl = Oa(
          yl,
          t,
          e,
          l,
          n,
          a
        ), !0;
      case "dragenter":
        return pl = Oa(
          pl,
          t,
          e,
          l,
          n,
          a
        ), !0;
      case "mouseover":
        return ml = Oa(
          ml,
          t,
          e,
          l,
          n,
          a
        ), !0;
      case "pointerover":
        var i = a.pointerId;
        return Ta.set(
          i,
          Oa(
            Ta.get(i) || null,
            t,
            e,
            l,
            n,
            a
          )
        ), !0;
      case "gotpointercapture":
        return i = a.pointerId, Aa.set(
          i,
          Oa(
            Aa.get(i) || null,
            t,
            e,
            l,
            n,
            a
          )
        ), !0;
    }
    return !1;
  }
  function ud(t) {
    var e = Ql(t.target);
    if (e !== null) {
      var l = b(e);
      if (l !== null) {
        if (e = l.tag, e === 13) {
          if (e = h(l), e !== null) {
            t.blockedOn = e, kd(t.priority, function() {
              if (l.tag === 13) {
                var n = de();
                n = Wi(n);
                var a = an(l, n);
                a !== null && he(a, l, n), tr(l, n);
              }
            });
            return;
          }
        } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Ci(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = lr(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var n = new l.constructor(
          l.type,
          l
        );
        uu = n, l.target.dispatchEvent(n), uu = null;
      } else
        return e = Zl(l), e !== null && nd(e), t.blockedOn = l, !1;
      e.shift();
    }
    return !0;
  }
  function cd(t, e, l) {
    Ci(t) && l.delete(e);
  }
  function Kv() {
    ar = !1, yl !== null && Ci(yl) && (yl = null), pl !== null && Ci(pl) && (pl = null), ml !== null && Ci(ml) && (ml = null), Ta.forEach(cd), Aa.forEach(cd);
  }
  function Vi(t, e) {
    t.blockedOn === e && (t.blockedOn = null, ar || (ar = !0, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      Kv
    )));
  }
  var Gi = null;
  function rd(t) {
    Gi !== t && (Gi = t, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      function() {
        Gi === t && (Gi = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e], n = t[e + 1], a = t[e + 2];
          if (typeof n != "function") {
            if (nr(n || l) === null)
              continue;
            break;
          }
          var i = Zl(l);
          i !== null && (t.splice(e, 3), e -= 3, nc(
            i,
            {
              pending: !0,
              data: a,
              method: l.method,
              action: n
            },
            n,
            a
          ));
        }
      }
    ));
  }
  function za(t) {
    function e(d) {
      return Vi(d, t);
    }
    yl !== null && Vi(yl, t), pl !== null && Vi(pl, t), ml !== null && Vi(ml, t), Ta.forEach(e), Aa.forEach(e);
    for (var l = 0; l < bl.length; l++) {
      var n = bl[l];
      n.blockedOn === t && (n.blockedOn = null);
    }
    for (; 0 < bl.length && (l = bl[0], l.blockedOn === null); )
      ud(l), l.blockedOn === null && bl.shift();
    if (l = (t.ownerDocument || t).$$reactFormReplay, l != null)
      for (n = 0; n < l.length; n += 3) {
        var a = l[n], i = l[n + 1], u = a[It] || null;
        if (typeof i == "function")
          u || rd(l);
        else if (u) {
          var c = null;
          if (i && i.hasAttribute("formAction")) {
            if (a = i, u = i[It] || null)
              c = u.formAction;
            else if (nr(a) !== null) continue;
          } else c = u.action;
          typeof c == "function" ? l[n + 1] = c : (l.splice(n, 3), n -= 3), rd(l);
        }
      }
  }
  function ir(t) {
    this._internalRoot = t;
  }
  Li.prototype.render = ir.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(r(409));
    var l = e.current, n = de();
    ed(l, n, t, e, null, null);
  }, Li.prototype.unmount = ir.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      ed(t.current, 2, null, t, null, null), Ai(), e[Xl] = null;
    }
  };
  function Li(t) {
    this._internalRoot = t;
  }
  Li.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = Tr();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < bl.length && e !== 0 && e < bl[l].priority; l++) ;
      bl.splice(l, 0, t), l === 0 && ud(t);
    }
  };
  var od = o.version;
  if (od !== "19.1.1")
    throw Error(
      r(
        527,
        od,
        "19.1.1"
      )
    );
  Y.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
    return t = g(e), t = t !== null ? f(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Jv = {
    bundleType: 0,
    version: "19.1.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: D,
    reconcilerVersion: "19.1.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ != "undefined") {
    var Xi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Xi.isDisabled && Xi.supportsFiber)
      try {
        _n = Xi.inject(
          Jv
        ), ie = Xi;
      } catch (t) {
      }
  }
  return wa.createRoot = function(t, e) {
    if (!v(t)) throw Error(r(299));
    var l = !1, n = "", a = As, i = Os, u = zs, c = null;
    return e != null && (e.unstable_strictMode === !0 && (l = !0), e.identifierPrefix !== void 0 && (n = e.identifierPrefix), e.onUncaughtError !== void 0 && (a = e.onUncaughtError), e.onCaughtError !== void 0 && (i = e.onCaughtError), e.onRecoverableError !== void 0 && (u = e.onRecoverableError), e.unstable_transitionCallbacks !== void 0 && (c = e.unstable_transitionCallbacks)), e = Pf(
      t,
      1,
      !1,
      null,
      null,
      l,
      n,
      a,
      i,
      u,
      c,
      null
    ), t[Xl] = e.current, Vc(t), new ir(e);
  }, wa.hydrateRoot = function(t, e, l) {
    if (!v(t)) throw Error(r(299));
    var n = !1, a = "", i = As, u = Os, c = zs, d = null, E = null;
    return l != null && (l.unstable_strictMode === !0 && (n = !0), l.identifierPrefix !== void 0 && (a = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (u = l.onCaughtError), l.onRecoverableError !== void 0 && (c = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (d = l.unstable_transitionCallbacks), l.formState !== void 0 && (E = l.formState)), e = Pf(
      t,
      1,
      !0,
      e,
      l != null ? l : null,
      n,
      a,
      i,
      u,
      c,
      d,
      E
    ), e.context = td(null), l = e.current, n = de(), n = Wi(n), a = ll(n), a.callback = null, nl(l, a, n), l = n, e.current.lanes = l, Un(e, l), He(e), t[Xl] = e.current, Vc(t), new Li(e);
  }, wa.version = "19.1.1", wa;
}
var pd;
function a0() {
  if (pd) return cr.exports;
  pd = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (o) {
        console.error(o);
      }
  }
  return z(), cr.exports = n0(), cr.exports;
}
var i0 = a0(), fr = { exports: {} }, Ma = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var md;
function u0() {
  if (md) return Ma;
  md = 1;
  var z = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function s(r, v, b) {
    var h = null;
    if (b !== void 0 && (h = "" + b), v.key !== void 0 && (h = "" + v.key), "key" in v) {
      b = {};
      for (var T in v)
        T !== "key" && (b[T] = v[T]);
    } else b = v;
    return v = b.ref, {
      $$typeof: z,
      type: r,
      key: h,
      ref: v !== void 0 ? v : null,
      props: b
    };
  }
  return Ma.Fragment = o, Ma.jsx = s, Ma.jsxs = s, Ma;
}
var bd;
function c0() {
  return bd || (bd = 1, fr.exports = u0()), fr.exports;
}
var ct = c0();
let r0;
const o0 = () => r0;
function F(z, o, s, r) {
  return new (s || (s = Promise))(function(v, b) {
    function h(f) {
      try {
        g(r.next(f));
      } catch (m) {
        b(m);
      }
    }
    function T(f) {
      try {
        g(r.throw(f));
      } catch (m) {
        b(m);
      }
    }
    function g(f) {
      var m;
      f.done ? v(f.value) : (m = f.value, m instanceof s ? m : new s(function(w) {
        w(m);
      })).then(h, T);
    }
    g((r = r.apply(z, o || [])).next());
  });
}
const Td = "NON_LOCAL_STORAGE_LOCAL_ID", s0 = (z, o) => typeof window != "undefined" && window.localStorage ? window.localStorage.getItem(`${Td}:${z}:${o}`) : null, f0 = (z, o, s) => {
  typeof window != "undefined" && window.localStorage && window.localStorage.setItem(`${Td}:${z}:${o}`, s);
};
function d0(z, o, s) {
  return F(this, arguments, void 0, function* (r, v, b, h = { iterations: 1e5, hash: "SHA-512", derivedKeyType: { name: "AES-GCM", length: 256 } }) {
    const T = new TextEncoder(), g = yield crypto.subtle.importKey("raw", T.encode(r + ":" + v), "PBKDF2", !1, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt: b, iterations: (h == null ? void 0 : h.iterations) || 1e5, hash: (h == null ? void 0 : h.hash) || "SHA-512" }, g, (h == null ? void 0 : h.derivedKeyType) || { name: "AES-GCM", length: 256 }, !1, ["encrypt", "decrypt"]);
  });
}
function h0(z, o) {
  return F(this, arguments, void 0, function* (s, r, v = { algorithm: "AES-GCM" }) {
    const b = new TextEncoder(), h = crypto.getRandomValues(new Uint8Array(12)), T = yield crypto.subtle.encrypt({ name: (v == null ? void 0 : v.algorithm) || "AES-GCM", iv: h }, s, b.encode(r));
    return JSON.stringify({ iv: btoa(String.fromCharCode(...h)), data: btoa(String.fromCharCode(...new Uint8Array(T))) });
  });
}
function v0(z, o) {
  return F(this, arguments, void 0, function* (s, r, v = { algorithm: "AES-GCM" }) {
    const b = JSON.parse(r), h = new TextDecoder(), T = Uint8Array.from(atob(b.iv), (m) => m.charCodeAt(0)), g = Uint8Array.from(atob(b.data), (m) => m.charCodeAt(0)), f = yield crypto.subtle.decrypt({ name: (v == null ? void 0 : v.algorithm) || "AES-GCM", iv: T }, s, g);
    return h.decode(f);
  });
}
let Ad;
Ad = typeof crypto != "undefined" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (z) => {
  const o = 16 * Math.random() | 0;
  return (z === "x" ? o : 3 & o | 8).toString(16);
});
var Sd = Ad;
const xd = ["error", "warn", "info", "debug"];
let g0 = class {
  constructor(o) {
    this.level = o;
  }
  log(o, s) {
    xd.indexOf(this.level) < xd.indexOf(o) || console[o](s);
  }
};
var Ed = (z = "warn") => new g0(z);
function dr(z) {
  let o = z.replace(/-/g, "+").replace(/_/g, "/");
  for (; o.length % 4 != 0; ) o += "=";
  return atob(o);
}
function y0(z) {
  if (typeof z != "string") throw new Error("JWT must be a string");
  const o = z.split(".");
  if (o.length !== 3) throw new Error("JWT should consist of three parts: header.payload.signature");
  const [s, r, v] = o, b = dr(s);
  let h;
  try {
    h = JSON.parse(b);
  } catch (f) {
    throw new Error("Invalid JWT header JSON: " + f.message);
  }
  const T = dr(r);
  let g;
  try {
    g = JSON.parse(T);
  } catch (f) {
    throw new Error("Invalid JWT payload JSON: " + f.message);
  }
  return { header: h, payload: g, signatureHex: function(f) {
    let m = "";
    for (let w = 0; w < f.length; w++) m += f.charCodeAt(w).toString(16).padStart(2, "0");
    return m;
  }(dr(v)) };
}
const st = Symbol("vaultrice/credentials"), Zt = Symbol("vaultrice/encryptionSettings"), Gl = Symbol("vaultrice/previousEncryptionSettings"), Me = Symbol("vaultrice/errorHandlers"), qt = Symbol("vaultrice/ws"), Ae = Symbol("vaultrice/eventHandlers"), Da = Symbol("vaultrice/accessTokenExpiringHandlers"), p0 = { enabled: !0, maxOperations: 100, windowMs: 6e4, operationDelay: 0 };
let m0 = class {
  constructor(o) {
    this.operationHistory = [], this.lastOperationTime = 0, this.operationConfig = Object.assign(Object.assign({}, p0), o || {});
  }
  updateConfig(o) {
    this.operationConfig = Object.assign(Object.assign({}, this.operationConfig), o);
  }
  cleanupHistory(o, s) {
    const r = Date.now() - s, v = o.findIndex((b) => b.timestamp > r);
    v > 0 ? o.splice(0, v) : v === -1 && (o.length = 0);
  }
  isAllowed(o, s, r) {
    return this.cleanupHistory(o, r), o.length < s;
  }
  calculateDelay(o, s) {
    if (s === 0) return 0;
    const r = Date.now() - o;
    return Math.max(0, s - r);
  }
  throttleOperation() {
    return F(this, void 0, void 0, function* () {
      if (!this.operationConfig.enabled) return;
      if (!this.isAllowed(this.operationHistory, this.operationConfig.maxOperations, this.operationConfig.windowMs)) throw new Error(`Operation rate limit exceeded. Maximum ${this.operationConfig.maxOperations} operations per ${this.operationConfig.windowMs}ms allowed.`);
      const o = this.calculateDelay(this.lastOperationTime, this.operationConfig.operationDelay);
      var s;
      o > 0 && (yield (s = o, new Promise((v) => setTimeout(v, s))));
      const r = Date.now();
      this.operationHistory.push({ timestamp: r }), this.lastOperationTime = r;
    });
  }
  getOperationStatus() {
    return this.cleanupHistory(this.operationHistory, this.operationConfig.windowMs), { enabled: this.operationConfig.enabled, currentCount: this.operationHistory.length, maxOperations: this.operationConfig.maxOperations, windowMs: this.operationConfig.windowMs, remaining: Math.max(0, this.operationConfig.maxOperations - this.operationHistory.length) };
  }
  reset() {
    this.operationHistory.length = 0, this.lastOperationTime = 0;
  }
};
var Od;
function b0(z, o) {
  return s0(z, o) || `${Sd()}-${Sd()}`;
}
const Ll = "_undefined_";
class xl {
  constructor(o, s = { class: Ll, autoUpdateOldEncryptedValues: !0, logLevel: "warn" }) {
    this.class = Ll, this[Od] = [];
    let r = { class: Ll, logLevel: "warn" };
    if (typeof s == "string" ? (this.id = s, r = { class: Ll, logLevel: "warn" }) : (this.id = s.id || b0(o.projectId, s.class || Ll), r = s), this.logger = Ed(r.logLevel), !o || typeof o != "object" || typeof o.projectId != "string") throw new Error("Invalid credentials!");
    const v = typeof o.apiKey == "string" && typeof o.apiSecret == "string", b = typeof o.accessToken == "string", h = typeof o.getAccessToken == "function", T = [v, h].filter(Boolean).length, g = b && !h;
    if (T === 0 && !g) throw new Error("Invalid credentials! Must provide one of: (apiKey + apiSecret), accessToken, or getAccessToken function");
    if (T > 1 || g && T > 0) throw new Error("Invalid credentials! Provide only one primary authentication method. You can combine getAccessToken with an initial accessToken for performance.");
    if ((o.apiKey || o.apiSecret) && !v) throw new Error("Invalid credentials! Both apiKey and apiSecret are required when using direct authentication");
    if (this.throttleManager = new m0(r.throttling), typeof s == "string" || s != null && s.id || f0(o.projectId, s.class || Ll, this.id), this[st] = Object.assign({}, o), typeof this[st].apiKey == "string" || typeof this[st].apiSecret == "string" || typeof this[st].accessToken != "string" && !o.getAccessToken || (delete this[st].apiKey, delete this[st].apiSecret), o.getAccessToken && (this.getAccessTokenFn = o.getAccessToken, delete this[st].getAccessToken), this.class = r.class || Ll, r.passphrase && r.getEncryptionHandler) throw new Error("Either define a passphrase or a getEncryptionHandler, but not both!");
    if (r.getEncryptionHandler && (this.getEncryptionHandler = r.getEncryptionHandler), r.passphrase && (this.getEncryptionHandler = (f) => F(this, void 0, void 0, function* () {
      var m, w, N, H;
      const q = yield d0(r.passphrase, this.id, f.salt, r.keyDerivationOptions), I = !((w = (m = r.keyDerivationOptions) === null || m === void 0 ? void 0 : m.derivedKeyType) === null || w === void 0) && w.name ? { algorithm: (H = (N = r.keyDerivationOptions) === null || N === void 0 ? void 0 : N.derivedKeyType) === null || H === void 0 ? void 0 : H.name } : void 0;
      return { encrypt: (V) => h0(q, V, I), decrypt: (V) => v0(q, V, I) };
    })), r.autoUpdateOldEncryptedValues === void 0 && (r.autoUpdateOldEncryptedValues = !0), this.autoUpdateOldEncryptedValues = r.autoUpdateOldEncryptedValues, r.idSignature && (this.idSignature = r.idSignature), this.idSignature && (this.idSignatureKeyVersion = r.idSignatureKeyVersion), h) if (b) {
      this.logger.log("debug", "Using token provider with initial access token");
      try {
        this.useAccessTokenAndRememberToAcquireTheNext(this[st].accessToken);
      } catch (f) {
        this.logger.log("warn", "Initial access token is invalid, acquiring new token"), this[st].accessToken = void 0, this.isGettingAccessToken = this.acquireAccessToken(), this.isGettingAccessToken.then(() => {
          this.isGettingAccessToken = void 0;
        }).catch(() => {
          this.isGettingAccessToken = void 0;
        });
      }
    } else this.isGettingAccessToken = this.acquireAccessToken(), this.isGettingAccessToken.then(() => {
      this.isGettingAccessToken = void 0;
    }).catch(() => {
      this.isGettingAccessToken = void 0;
    });
    else b || (this.isGettingAccessToken = this.acquireAccessToken(), this.isGettingAccessToken.then(() => {
      this.isGettingAccessToken = void 0;
    }).catch(() => {
      this.isGettingAccessToken = void 0;
    }));
  }
  static executeWithRetry(o, s, r) {
    return F(this, arguments, void 0, function* (v, b, h, T = {}) {
      var g, f, m, w;
      const { maxRetries: N = 3, initialDelay: H = 100, maxDelay: q = 2e3, backoffMultiplier: I = 2 } = T;
      let V, rt = 0;
      for (; rt <= N; ) try {
        return yield v();
      } catch (tt) {
        V = tt;
        let ht = !1, et = "";
        const G = ["Please try again in a moment", "Please retry", "Service temporarily unavailable", "temporarily unavailable", "try again later"];
        if (tt && typeof tt == "object") {
          et = tt.message || tt.toString();
          const J = (g = tt == null ? void 0 : tt.cause) === null || g === void 0 ? void 0 : g.code;
          J && J.indexOf("retry") > -1 ? ht = !0 : et && (ht = G.some((St) => et.toLowerCase().includes(St.toLowerCase())));
        } else typeof tt == "string" ? (et = tt, ht = G.some((J) => et.toLowerCase().includes(J.toLowerCase()))) : (ht = (tt == null ? void 0 : tt.name) === "TypeError" || ((f = tt == null ? void 0 : tt.message) === null || f === void 0 ? void 0 : f.includes("fetch")) || ((m = tt == null ? void 0 : tt.message) === null || m === void 0 ? void 0 : m.includes("network")) || ((w = tt == null ? void 0 : tt.message) === null || w === void 0 ? void 0 : w.includes("timeout")), et = (tt == null ? void 0 : tt.message) || "Unknown error");
        if (ht && rt < N) {
          h && h.log("warn", `${b} failed (attempt ${rt + 1}/${N + 1}): ${et}. Retrying...`), rt++;
          const J = Math.min(H * Math.pow(I, rt - 1), q), St = J + Math.random() * (0.1 * J);
          h && h.log("debug", `Waiting ${Math.round(St)}ms before retry attempt ${rt + 1}`), yield new Promise((Gt) => setTimeout(Gt, St));
          continue;
        }
        throw tt;
      }
      throw V;
    });
  }
  static retrieveAccessToken(o, s, r, v) {
    return F(this, void 0, void 0, function* () {
      if (typeof o != "string" || !o) throw new Error("projectId not valid!");
      if (typeof s != "string" || !s) throw new Error("apiKey not valid!");
      if (typeof r != "string" || !r) throw new Error("apiSecret not valid!");
      const b = { Authorization: `Basic ${btoa(`${s}:${r}`)}` };
      return typeof (v == null ? void 0 : v.origin) == "string" && (v == null ? void 0 : v.origin.length) > 0 && (b.Origin = v.origin), xl.executeWithRetry(() => F(this, void 0, void 0, function* () {
        var h;
        const T = yield fetch(`${xl.basePath}/project/${o}/auth/token`, { method: "GET", headers: b }), g = T.headers.get("content-type");
        let f;
        if (g) try {
          g.indexOf("text/plain") === 0 ? f = yield T.text() : g.indexOf("application/json") === 0 && (f = yield T.json());
        } catch (m) {
          f = `${T.status} - ${T.statusText}`;
        }
        if (!T.ok) {
          if (T.status === 403 && f && ((h = f == null ? void 0 : f.cause) === null || h === void 0 ? void 0 : h.code) === "authorizationError.origin.server.notFound" && (f.message = 'Failed to retrieve access token: access denied. This is due to an API key origin restriction. If minting a token from a backend for use in a browser, pass the browser-origin when calling retrieveAccessToken() e.g. NonLocalStorage.retrieveAccessToken("projectId", "apiKey", "apiSecret", { origin: req.headers.origin }).'), typeof f == "string") throw new Error(f);
          if (f) throw f;
          if (T.status !== 404) throw new Error(`${T.status} - ${T.statusText}`);
        }
        return f;
      }), "Token retrieval", Ed("warn"));
    });
  }
  useAccessTokenAndRememberToAcquireTheNext(o) {
    if (!o) throw new Error("No accessToken!");
    const s = this.useAccessToken(o), r = Math.max(s - 12e4, 1e3);
    this.logger.log("debug", `Scheduling next token refresh in ${r}ms`), setTimeout(() => {
      this.isGettingAccessToken = this.acquireAccessToken(), this.isGettingAccessToken.then(() => {
        this.isGettingAccessToken = void 0;
      }).catch(() => {
        this.isGettingAccessToken = void 0;
      });
    }, r);
  }
  acquireAccessToken() {
    return F(this, void 0, void 0, function* () {
      try {
        let o;
        if (this.getAccessTokenFn) {
          if (this.logger.log("debug", "Acquiring access token via custom provider"), o = yield this.getAccessTokenFn(), typeof o != "string" || !o) throw new Error("getAccessToken function must return a non-empty string");
        } else {
          if (!this[st].apiKey || !this[st].apiSecret) throw new Error("No authentication method available for token acquisition");
          this.logger.log("debug", "Acquiring access token via API key/secret"), o = yield xl.retrieveAccessToken(this[st].projectId, this[st].apiKey, this[st].apiSecret);
        }
        this.useAccessTokenAndRememberToAcquireTheNext(o);
      } catch (o) {
        throw this.logger.log("error", `Access token acquisition failed: ${(o == null ? void 0 : o.message) || (o == null ? void 0 : o.name) || (o == null ? void 0 : o.type) || o}`), o;
      }
    });
  }
  useAccessToken(o) {
    if (typeof o != "string" || !o) throw new Error("accessToken not valid!");
    const s = y0(o);
    this[st].accessToken = o;
    const r = s.payload.exp - Date.now();
    if (r - 12e4 < 0) throw new Error("accessToken not valid anymore");
    return setTimeout(() => {
      this[Da].forEach((v) => v());
    }, Math.max(r - 12e4, 0)), r;
  }
  onAccessTokenExpiring(o) {
    this[Da].push(o);
  }
  offAccessTokenExpiring(o) {
    const s = this[Da].indexOf(o);
    s !== -1 && this[Da].splice(s, 1);
  }
  getEncryptionHandlerForKeyVersion(o) {
    return F(this, void 0, void 0, function* () {
      var s, r, v, b;
      if (o > -1 && (o !== ((s = this[Zt]) === null || s === void 0 ? void 0 : s.keyVersion) && (this[Gl] && this[Gl].length !== 0 || (yield this.getEncryptionSettings())), o !== ((r = this[Zt]) === null || r === void 0 ? void 0 : r.keyVersion))) {
        if (!this[Gl] || this[Gl].length === 0) throw new Error(`Wrong keyVersion! Found ${o} but you're using ${(v = this[Zt]) === null || v === void 0 ? void 0 : v.keyVersion}`);
        let h = this[Gl].find((T) => T.keyVersion === o);
        if (h || (yield this.getEncryptionSettings()), h = (this[Gl] || []).find((T) => T.keyVersion === o), !h) throw new Error(`Wrong keyVersion! Found ${o} but you're using ${(b = this[Zt]) === null || b === void 0 ? void 0 : b.keyVersion}`);
        return this.getEncryptionHandler ? this.getEncryptionHandler(h) : void 0;
      }
      return this.encryptionHandler;
    });
  }
  handleEncryptionSettings(o) {
    return F(this, void 0, void 0, function* () {
      if (!this.getEncryptionHandler) throw new Error("No getEncryptionHandler defined!");
      this[Zt] = o.encryptionSettings, this[Gl] = o.previousEncryptionSettings, this.encryptionHandler = yield this.getEncryptionHandler(o.encryptionSettings);
    });
  }
  prepareEncryptionSettings(o) {
    var s, r, v;
    return { encryptionSettings: { salt: Uint8Array.from(atob((s = o == null ? void 0 : o.encryptionSettings) === null || s === void 0 ? void 0 : s.salt), (b) => b.charCodeAt(0)), keyVersion: (r = o == null ? void 0 : o.encryptionSettings) === null || r === void 0 ? void 0 : r.keyVersion, createdAt: (v = o == null ? void 0 : o.encryptionSettings) === null || v === void 0 ? void 0 : v.createdAt }, previousEncryptionSettings: ((o == null ? void 0 : o.previousEncryptionSettings) || []).map((b) => ({ salt: Uint8Array.from(atob(b == null ? void 0 : b.salt), (h) => h.charCodeAt(0)), keyVersion: b == null ? void 0 : b.keyVersion, createdAt: b == null ? void 0 : b.createdAt })) };
  }
  getEncryptionSettings(o) {
    return F(this, void 0, void 0, function* () {
      if (!this.getEncryptionHandler) throw new Error("No passphrase and no getEncryptionHandler passed! This function is only allowed with e2e encryption!");
      const s = yield this.request("POST", `/cache-encryption/${this.class}/${this.id}`, o && o > 0 ? { saltLength: o } : {}), r = this.prepareEncryptionSettings(s);
      return yield this.handleEncryptionSettings(r), r;
    });
  }
  rotateEncryption(o) {
    return F(this, void 0, void 0, function* () {
      if (!this.getEncryptionHandler) throw new Error("No passphrase and no getEncryptionHandler passed! This function is only allowed with e2e encryption!");
      const s = yield this.request("POST", `/cache-encryption-rotate/${this.class}/${this.id}`, o && o > 0 ? { saltLength: o } : {}), r = this.prepareEncryptionSettings(s);
      return yield this.handleEncryptionSettings(r), r;
    });
  }
  request(o, s, r, v) {
    return F(this, void 0, void 0, function* () {
      !this[st].accessToken && this.isGettingAccessToken && (yield this.isGettingAccessToken);
      try {
        yield this.throttleManager.throttleOperation();
      } catch (b) {
        throw this.logger.log("error", `Request throttled: ${b == null ? void 0 : b.message}`), b;
      }
      return xl.executeWithRetry(() => F(this, void 0, void 0, function* () {
        var b;
        const h = this[st].apiKey && this[st].apiSecret ? `Basic ${btoa(`${this[st].apiKey}:${this[st].apiSecret}`)}` : void 0, T = this[st].accessToken ? `Bearer ${this[st].accessToken}` : void 0;
        let g = this[st].accessToken ? T : h;
        if (s === "/auth/token" && (g = h), !g) throw new Error("No authentication option provided! (apiKey + apiSecret or accessToken)");
        const f = Object.assign({ Authorization: g }, v || {}), m = typeof r == "string", w = (b = this[Zt]) === null || b === void 0 ? void 0 : b.keyVersion;
        w !== void 0 && w > -1 && (f["X-Enc-KV"] = w.toString()), this.idSignature && (f["X-Id-Sig"] = this.idSignature, this.idSignatureKeyVersion !== void 0 && (f["X-Id-Sig-KV"] = this.idSignatureKeyVersion.toString())), r && (f["Content-Type"] = m ? "text/plain" : "application/json");
        const N = yield fetch(`${xl.basePath}/project/${this[st].projectId}${s}`, { method: o, headers: f, body: r ? m ? r : JSON.stringify(r) : void 0 }), H = N.headers.get("content-type");
        let q;
        if (H) try {
          H.indexOf("text/plain") === 0 ? q = yield N.text() : H.indexOf("application/json") === 0 && (q = yield N.json());
        } catch (I) {
          q = `${N.status} - ${N.statusText}`;
        }
        if (!N.ok) {
          if (typeof q == "string") throw new Error(q);
          if (q) throw q;
          if (N.status !== 404) throw new Error(`${N.status} - ${N.statusText}`);
        }
        return q;
      }), "API request", this.logger);
    });
  }
}
Od = Da, xl.basePath = "https://api.vaultrice.app";
var zd;
let S0 = class wd extends xl {
  constructor(o, s) {
    var r, v, b, h, T, g, f, m, w, N;
    super(o, s), this[zd] = /* @__PURE__ */ new Map(), this.pendingEventSetups = /* @__PURE__ */ new Map(), this.reconnectAttempts = 0, this.reconnectBaseDelay = 1e3, this.reconnectMaxDelay = 6e4, this.isConnected = !1, this.pingInterval = 2e4, this.pongTimeout = 1e4, this.cancelPendingLeave = !1, this.hasJoined = !1, this[Me] = [], this[Ae] = /* @__PURE__ */ new Map();
    const H = typeof s == "object" ? s : {};
    this.configuredAutoReconnect = (v = (r = H.connectionSettings) === null || r === void 0 ? void 0 : r.autoReconnect) === null || v === void 0 || v, this.autoReconnect = this.configuredAutoReconnect, this.reconnectBaseDelay = (h = (b = H.connectionSettings) === null || b === void 0 ? void 0 : b.reconnectBaseDelay) !== null && h !== void 0 ? h : 1e3, this.reconnectMaxDelay = (g = (T = H.connectionSettings) === null || T === void 0 ? void 0 : T.reconnectMaxDelay) !== null && g !== void 0 ? g : 3e4, this.pingInterval = (m = (f = H.connectionSettings) === null || f === void 0 ? void 0 : f.pingInterval) !== null && m !== void 0 ? m : 2e4, this.pongTimeout = (N = (w = H.connectionSettings) === null || w === void 0 ? void 0 : w.pongTimeout) !== null && N !== void 0 ? N : 1e4;
  }
  send(o) {
    return F(this, arguments, void 0, function* (s, r = { transport: "ws" }) {
      var v, b, h, T, g, f;
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      const m = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(s)) : s;
      if (r.transport === "http") {
        const H = {};
        !((v = r.auth) === null || v === void 0) && v.identityToken && (H["x-vaultrice-auth-token"] = r.auth.identityToken), !((b = r.auth) === null || b === void 0) && b.userIdSignature && (H["x-vaultrice-auth-signature"] = r.auth.userIdSignature);
        try {
          yield this.request("POST", `/message/${this.class}/${this.id}`, m, H);
        } catch (q) {
          if (!q || ((h = q == null ? void 0 : q.cause) === null || h === void 0 ? void 0 : h.code) !== "conflictError.keyVersion.mismatch") throw q;
          this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), yield this.request("POST", `/message/${this.class}/${this.id}`, m, H);
        }
        return;
      }
      const w = yield this.getWebSocket();
      try {
        yield this.throttleManager.throttleOperation();
      } catch (H) {
        throw this.logger.log("error", `WebSocket message throttled: ${H == null ? void 0 : H.message}`), H;
      }
      const N = { event: "message", payload: m };
      r.auth && (N.auth = r.auth), this[Zt] && ((T = this[Zt]) === null || T === void 0 ? void 0 : T.keyVersion) > -1 && (N.keyVersion = (g = this[Zt]) === null || g === void 0 ? void 0 : g.keyVersion), !((f = r.auth) === null || f === void 0) && f.userIdSignature && typeof m == "string" && (this.encryptionHandler ? this.logger.log("warn", "User id signature verification will not work in combination with e2e encryption.") : this.logger.log("warn", "User id signature verification will not work with this payload.")), w.send(JSON.stringify(N));
    });
  }
  on(o, s, r) {
    this[Ae].has(o) || this[Ae].set(o, /* @__PURE__ */ new Set());
    const v = this[Ae].get(o);
    this.pendingEventSetups.has(o) || this.pendingEventSetups.set(o, /* @__PURE__ */ new Set());
    const b = this.pendingEventSetups.get(o);
    let h;
    if (o === "error") {
      if (typeof s != "function") throw new Error("No event handler defined!");
      const g = s;
      return this[Me].push(g), h = { handler: g, wsListener: (m) => {
        try {
          const w = (m == null ? void 0 : m.message) || (m == null ? void 0 : m.data) || (m == null ? void 0 : m.type) || (typeof m == "string" ? m : "WebSocket error occurred");
          g(new Error(w));
        } catch (w) {
          g(new Error("WebSocket error occurred"));
        }
      } }, v.add(h), b.add(h), void this.getWebSocket(!1).then((m) => {
        v.has(h) && b.has(h) && (m.addEventListener("error", h.wsListener), b.delete(h));
      });
    }
    if (o === "connect") {
      if (typeof s != "function") throw new Error("No event handler defined!");
      return h = { handler: s }, v.add(h), b.add(h), void this.getWebSocket(!1).then((g) => {
        b.delete(h);
      });
    }
    if (o === "disconnect") {
      if (typeof s != "function") throw new Error("No event handler defined!");
      const g = s;
      return h = { handler: g, wsListener: () => g() }, v.add(h), b.add(h), void this.getWebSocket(!1).then((m) => {
        v.has(h) && b.has(h) && (m.addEventListener("close", h.wsListener), b.delete(h));
      });
    }
    const T = (g, f, m = !1) => {
      const w = m ? g.keyVersion : g.payload.keyVersion;
      if (w === void 0) return f(g.payload);
      if (w > -1) {
        if (!this.getEncryptionHandler) return this[Me].forEach((H) => H(new Error("Encrypted data, but no passphrase or getEncryptionHandler configured!")));
        if (!this.encryptionHandler) return this[Me].forEach((H) => H(new Error("Encrypted data, but getEncryptionSettings() not called!")));
        let N = g.payload.value;
        m && (N = g.payload), this.getEncryptionHandlerForKeyVersion(w).then((H) => H == null ? void 0 : H.decrypt(N)).then((H) => {
          m ? g.payload = JSON.parse(H) : g.payload.value = JSON.parse(H), f(g.payload);
        }).catch((H) => {
          this[Me].forEach((q) => q(H));
        });
      }
    };
    if (o === "message") {
      if (typeof s != "function") throw new Error("No event handler defined!");
      const g = s;
      return h = { handler: g, wsListener: (f) => {
        const m = JSON.parse(f.data);
        m.event === "message" && T(m, g, !0);
      } }, v.add(h), b.add(h), void this.getWebSocket(!1).then((f) => {
        v.has(h) && b.has(h) && (f.addEventListener("message", h.wsListener), b.delete(h));
      });
    }
    if (o === "presence:join") {
      if (typeof s != "function") throw new Error("No event handler defined!");
      const g = s;
      return h = { handler: g, wsListener: (m) => {
        const w = JSON.parse(m.data);
        w.event === "presence:join" && T(w, (N) => {
          g({ connectionId: w == null ? void 0 : w.connectionId, joinedAt: w == null ? void 0 : w.joinedAt, data: N });
        }, !0);
      } }, v.add(h), b.add(h), void this.getWebSocket(!1).then((m) => {
        v.has(h) && b.has(h) && (m.addEventListener("message", h.wsListener), b.delete(h));
      });
    }
    if (o === "presence:leave") {
      if (typeof s != "function") throw new Error("No event handler defined!");
      const g = s;
      return h = { handler: g, wsListener: (m) => {
        const w = JSON.parse(m.data);
        w.event === "presence:leave" && T(w, (N) => {
          g({ connectionId: w == null ? void 0 : w.connectionId, data: N });
        }, !0);
      } }, v.add(h), b.add(h), void this.getWebSocket(!1).then((m) => {
        v.has(h) && b.has(h) && (m.addEventListener("message", h.wsListener), b.delete(h));
      });
    }
    if (o !== "setItem") {
      if (o === "removeItem") if (r === void 0) {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const g = s;
        h = { handler: g, wsListener: (m) => {
          const w = JSON.parse(m.data);
          w.event === "removeItem" && g(w.payload);
        } }, v.add(h), b.add(h), this.getWebSocket(!1).then((m) => {
          v.has(h) && b.has(h) && (m.addEventListener("message", h.wsListener), b.delete(h));
        });
      } else {
        if (typeof r != "function") throw new Error("No event handler defined!");
        const g = r, f = s;
        h = { handler: g, wsListener: (w) => {
          const N = JSON.parse(w.data);
          N.event === "removeItem" && N.payload.prop === f && g(N.payload);
        }, itemName: f }, v.add(h), b.add(h), this.getWebSocket(!1).then((w) => {
          v.has(h) && b.has(h) && (w.addEventListener("message", h.wsListener), b.delete(h));
        });
      }
    } else if (r === void 0) {
      if (typeof s != "function") throw new Error("No event handler defined!");
      const g = s;
      h = { handler: g, wsListener: (f) => {
        const m = JSON.parse(f.data);
        m.event === "setItem" && T(m, g);
      } }, v.add(h), b.add(h), this.getWebSocket(!1).then((f) => {
        v.has(h) && b.has(h) && (f.addEventListener("message", h.wsListener), b.delete(h));
      });
    } else {
      if (typeof r != "function") throw new Error("No event handler defined!");
      const g = r, f = s;
      h = { handler: g, wsListener: (m) => {
        const w = JSON.parse(m.data);
        w.event === "setItem" && w.payload.prop === f && T(w, g);
      }, itemName: f }, v.add(h), b.add(h), this.getWebSocket(!1).then((m) => {
        v.has(h) && b.has(h) && (m.addEventListener("message", h.wsListener), b.delete(h));
      });
    }
  }
  off(o, s, r) {
    const v = this[Ae].get(o), b = this.pendingEventSetups.get(o);
    if (v) {
      if (o === "error") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const h = s, T = this[Me].indexOf(h);
        T > -1 && this[Me].splice(T, 1);
        for (const g of v) if (g.handler === h) {
          this[qt] && g.wsListener && this[qt].removeEventListener("error", g.wsListener), v.delete(g), b == null || b.delete(g);
          break;
        }
      } else {
        let h, T;
        if (r === void 0) {
          if (typeof s != "function") throw new Error("No event handler defined!");
          h = s;
        } else {
          if (typeof r != "function") throw new Error("No event handler defined!");
          h = r, T = s;
        }
        for (const g of v) {
          const f = g.handler === h, m = T === void 0 || g.itemName === T;
          if (f && m) {
            if (this[qt] && g.wsListener) {
              const w = o === "connect" ? "open" : o === "disconnect" ? "close" : o === "error" ? "error" : "message";
              this[qt].removeEventListener(w, g.wsListener);
            }
            v.delete(g), b == null || b.delete(g);
            break;
          }
        }
      }
      v.size === 0 && (this[Ae].delete(o), this.pendingEventSetups.delete(o)), this[Ae].size === 0 && this[Me].length === 0 && setTimeout(() => {
        this[Ae].size === 0 && this[Me].length === 0 && this.disconnect();
      }, 200);
    }
  }
  connect() {
    return F(this, void 0, void 0, function* () {
      this[qt] || (yield this.getWebSocket());
    });
  }
  disconnect() {
    return F(this, void 0, void 0, function* () {
      this.autoReconnect = !1, this[qt] && (this.hasJoined && (yield this.leave()), this[qt].close(), delete this[qt], this[Ae].clear(), this[Me].length = 0);
    });
  }
  getWebSocket() {
    return F(this, arguments, void 0, function* (o = !0) {
      if (!this[st].accessToken && this.isGettingAccessToken && (yield this.isGettingAccessToken), this[qt]) return o && this[qt].readyState === WebSocket.CONNECTING ? new Promise((m, w) => {
        const N = this[qt], H = () => {
          N.removeEventListener("open", q), N.removeEventListener("error", I), N.removeEventListener("close", V);
        }, q = () => {
          H(), m(N);
        }, I = (rt) => {
          H(), w(rt || new Error("WebSocket connection failed"));
        }, V = () => {
          H(), w(new Error("WebSocket connection closed during opening"));
        };
        N.readyState !== WebSocket.OPEN ? (N.addEventListener("open", q, { once: !0 }), N.addEventListener("error", I, { once: !0 }), N.addEventListener("close", V, { once: !0 })) : m(N);
      }) : this[qt];
      this.autoReconnect = this.configuredAutoReconnect;
      const s = wd.basePath.replace("http", "ws"), r = this[st].apiKey && this[st].apiSecret ? `Basic ${btoa(`${this[st].apiKey}:${this[st].apiSecret}`)}` : void 0, v = this[st].accessToken ? `Bearer ${this[st].accessToken}` : void 0, b = { auth: this[st].accessToken ? v : r };
      this.idSignature && (b.idSignature = this.idSignature, this.idSignatureKeyVersion !== void 0 && (b.idSignatureKeyVersion = this.idSignatureKeyVersion));
      const h = new URLSearchParams(b), T = this[qt] = new WebSocket(`${s}/project/${this[st].projectId}/ws/${this.class}/${this.id}?${h}`);
      this.logger.log("info", "initializing WebSocket connection...");
      let g;
      T.addEventListener("message", (m) => {
        let w;
        try {
          w = typeof m.data == "string" ? JSON.parse(m.data) : void 0;
        } catch (H) {
          w = void 0;
        }
        if (!w || typeof w != "object") return;
        const N = w.event;
        if (N) {
          if (N !== "pong") if (N !== "connected" && N !== "resume:ack" || !w.connectionId) {
            if (N === "error") {
              const H = w.payload;
              if (typeof H == "string" && H.toLowerCase().includes("invalid resume") && (this.logger.log("warn", "server signalled invalid resume token — clearing saved connectionId"), this.connectionId = void 0, typeof m.stopImmediatePropagation == "function")) try {
                m.stopImmediatePropagation();
              } catch (q) {
              }
            }
          } else {
            this.connectionId = w.connectionId, this.isConnected = !0;
            const H = this[Ae].get("connect");
            if (H) for (const q of H) try {
              q.handler();
            } catch (I) {
              this.logger.log("error", I);
            }
            if (typeof m.stopImmediatePropagation == "function") try {
              m.stopImmediatePropagation();
            } catch (q) {
            }
          }
          else if (this.logger.log("debug", "received pong"), this.clearPongTimer(), typeof m.stopImmediatePropagation == "function") try {
            m.stopImmediatePropagation();
          } catch (H) {
          }
        }
      });
      const f = new Promise((m) => {
        g = m;
      });
      return T.addEventListener("open", () => {
        if (this.reconnectAttempts = 0, this.connectionId) try {
          T.send(JSON.stringify({ event: "resume", connectionId: this.connectionId }));
        } catch (m) {
        }
        this.startHeartbeat(), typeof g == "function" && g(T);
      }, { once: !0 }), T.addEventListener("close", (m) => {
        this.isConnected = !1, this.stopHeartbeat();
      }, { once: !0 }), T.addEventListener("close", (m) => {
        (m == null ? void 0 : m.code) === 1008 && (this.logger.log("warn", "WebSocket closed with 1008 during reconnection"), this.connectionId = void 0), m != null && m.reason && (m == null ? void 0 : m.reason.indexOf("TierLimitExceeded")) > -1 && (this.autoReconnect = !1, this.logger.log("error", m.reason), this[Me].forEach((q) => q(new Error(m.reason)))), delete this[qt];
        const w = this.hasJoined || this.pendingPresenceOperation === "join", N = this.pendingPresenceOperation === "leave", H = N ? void 0 : this.currentJoinData || this.lastJoinData;
        if (this.autoReconnect) {
          const q = () => F(this, void 0, void 0, function* () {
            const I = Math.min(this.reconnectBaseDelay * Math.pow(2, this.reconnectAttempts), this.reconnectMaxDelay);
            setTimeout(() => F(this, void 0, void 0, function* () {
              let V;
              this.reconnectAttempts++, this.logger.log("warn", `${this.reconnectAttempts}. reconnection attempt...`);
              try {
                delete this[qt], V = yield this.getWebSocket(!1);
              } catch (J) {
                return this.logger.log("error", (J == null ? void 0 : J.message) || (J == null ? void 0 : J.name) || (J == null ? void 0 : J.type) || J), void q();
              }
              const rt = () => F(this, void 0, void 0, function* () {
                if (this.reconnectAttempts = 0, !this[qt]) return;
                const J = this[qt];
                for (const [St, Gt] of this[Ae]) for (const At of Gt) {
                  let wt;
                  St === "connect" || (St === "disconnect" ? (wt = () => At.handler(), J.addEventListener("close", wt)) : St === "error" ? (wt = (ot) => {
                    try {
                      const L = (ot == null ? void 0 : ot.message) || (ot == null ? void 0 : ot.data) || (ot == null ? void 0 : ot.type) || (typeof ot == "string" ? ot : "WebSocket error occurred");
                      At.handler(new Error(L));
                    } catch (L) {
                      At.handler(new Error("WebSocket error occurred"));
                    }
                  }, J.addEventListener("error", wt)) : St === "message" ? (wt = (ot) => {
                    let L;
                    try {
                      L = typeof ot.data == "string" ? JSON.parse(ot.data) : void 0;
                    } catch (ve) {
                      L = void 0;
                    }
                    L && L.event === "message" && At.handler(L.payload);
                  }, J.addEventListener("message", wt)) : St === "presence:join" ? (wt = (ot) => {
                    let L;
                    try {
                      L = typeof ot.data == "string" ? JSON.parse(ot.data) : void 0;
                    } catch (ve) {
                      L = void 0;
                    }
                    L && L.event === "presence:join" && At.handler(L.payload);
                  }, J.addEventListener("message", wt)) : St === "presence:leave" ? (wt = (ot) => {
                    let L;
                    try {
                      L = typeof ot.data == "string" ? JSON.parse(ot.data) : void 0;
                    } catch (ve) {
                      L = void 0;
                    }
                    L && L.event === "presence:leave" && At.handler(L.payload);
                  }, J.addEventListener("message", wt)) : St === "setItem" ? (wt = (ot) => {
                    let L;
                    try {
                      L = typeof ot.data == "string" ? JSON.parse(ot.data) : void 0;
                    } catch (ve) {
                      L = void 0;
                    }
                    L && L.event === "setItem" && (At.itemName && L.payload.prop !== At.itemName || At.handler(L.payload));
                  }, J.addEventListener("message", wt)) : St === "removeItem" && (wt = (ot) => {
                    let L;
                    try {
                      L = typeof ot.data == "string" ? JSON.parse(ot.data) : void 0;
                    } catch (ve) {
                      L = void 0;
                    }
                    L && L.event === "removeItem" && (At.itemName && L.payload.prop !== At.itemName || At.handler(L.payload));
                  }, J.addEventListener("message", wt))), wt && (At.wsListener = wt);
                }
                w && !N && H && (yield this.join(H));
              }), tt = () => {
                V == null || V.removeEventListener("open", ht), V == null || V.removeEventListener("close", et), V == null || V.removeEventListener("error", G);
              }, ht = () => F(this, void 0, void 0, function* () {
                yield rt(), tt();
              }), et = () => {
                tt(), q();
              }, G = (J) => {
                this.logger.log("error", (J == null ? void 0 : J.message) || (J == null ? void 0 : J.name) || (J == null ? void 0 : J.type) || J), tt(), q();
              };
              V.addEventListener("open", ht, { once: !0 }), V.addEventListener("close", et, { once: !0 }), V.addEventListener("error", G, { once: !0 }), V.readyState !== WebSocket.CLOSING && V.readyState !== WebSocket.CLOSED ? V.readyState === WebSocket.OPEN && (yield rt(), tt()) : q();
            }), I);
          });
          q();
        }
      }), o ? f : T;
    });
  }
  clearPongTimer() {
    this.pongTimer && (clearTimeout(this.pongTimer), this.pongTimer = void 0);
  }
  startPongTimer() {
    this.clearPongTimer(), this.pongTimer = setTimeout(() => {
      var o;
      this.logger.log("warn", "pong timeout — closing socket to reconnect");
      try {
        (o = this[qt]) === null || o === void 0 || o.close(1006, "pong timeout");
      } catch (s) {
      }
    }, this.pongTimeout);
  }
  stopHeartbeat() {
    this.pingTimer && (clearInterval(this.pingTimer), this.pingTimer = void 0), this.clearPongTimer();
  }
  startHeartbeat() {
    this.stopHeartbeat();
    const o = this[qt];
    if (o && o.readyState === WebSocket.OPEN) try {
      o.send(JSON.stringify({ event: "ping" })), this.startPongTimer();
    } catch (s) {
    }
    this.pingTimer = setInterval(() => {
      const s = this[qt];
      if (s && s.readyState === WebSocket.OPEN) try {
        s.send(JSON.stringify({ event: "ping" })), this.startPongTimer();
      } catch (r) {
      }
    }, this.pingInterval);
  }
  join(o, s) {
    return F(this, void 0, void 0, function* () {
      if (this.pendingPresenceOperation === "join") return this.currentJoinData = o, this.lastJoinData = o, this.cancelPendingLeave = !0, void (yield this.pendingPresencePromise);
      if (this.pendingPresenceOperation === "leave" && (this.cancelPendingLeave = !0, yield this.pendingPresencePromise), this.pendingPresenceOperation = "join", this.currentJoinData = o, this.lastJoinData = o, this.cancelPendingLeave = !1, this.getEncryptionHandler && !this.encryptionHandler) throw this.pendingPresenceOperation = void 0, new Error("Call getEncryptionSettings() first!");
      try {
        yield this.throttleManager.throttleOperation();
      } catch (v) {
        throw this.pendingPresenceOperation = void 0, this.logger.log("error", `Request throttled: ${v == null ? void 0 : v.message}`), v;
      }
      const r = F(this, void 0, void 0, function* () {
        const v = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(this.currentJoinData)) : this.currentJoinData, b = yield this.getWebSocket(), h = { event: "presence:join", payload: v };
        s && (h.auth = s), this[Zt] && this[Zt].keyVersion > -1 && (h.keyVersion = this[Zt].keyVersion), s != null && s.userIdSignature && typeof v == "string" && (this.encryptionHandler ? this.logger.log("warn", "User id signature verification will not work in combination with e2e encryption.") : this.logger.log("warn", "User id signature verification will not work with this payload."));
        try {
          b.send(JSON.stringify(h)), this.hasJoined = !0;
        } finally {
          this.pendingPresenceOperation === "join" && (this.pendingPresenceOperation = void 0);
        }
      });
      this.pendingPresencePromise = r;
      try {
        yield r;
      } finally {
        this.pendingPresencePromise = void 0;
      }
    });
  }
  leave() {
    return F(this, void 0, void 0, function* () {
      if (this.pendingPresenceOperation === "leave") return void (yield this.pendingPresencePromise);
      if (this.pendingPresenceOperation === "join") {
        if (yield this.pendingPresencePromise, this.cancelPendingLeave) return void this.logger.log("warn", "leave() cancelled - join called while waiting");
      } else if (!this.hasJoined) return;
      try {
        yield this.throttleManager.throttleOperation();
      } catch (s) {
        throw this.logger.log("error", `Request throttled: ${s == null ? void 0 : s.message}`), s;
      }
      this.pendingPresenceOperation = "leave", this.cancelPendingLeave = !1;
      const o = F(this, void 0, void 0, function* () {
        if (this.cancelPendingLeave) return void this.logger.log("warn", "leave() cancelled before sending - join called");
        const s = yield this.getWebSocket(), r = { event: "presence:leave" };
        this[Zt] && this[Zt].keyVersion > -1 && (r.keyVersion = this[Zt].keyVersion);
        try {
          s.send(JSON.stringify(r)), this.hasJoined = !1, this.currentJoinData = void 0;
        } finally {
          this.pendingPresenceOperation === "leave" && (this.pendingPresenceOperation = void 0);
        }
      });
      this.pendingPresencePromise = o;
      try {
        yield o;
      } finally {
        this.pendingPresencePromise = void 0;
      }
    });
  }
  getJoinedConnections() {
    return F(this, void 0, void 0, function* () {
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      const o = yield this.request("GET", `/presence-list/${this.class}/${this.id}`);
      if (!o || !Array.isArray(o)) return [];
      const s = [];
      for (const v of o) {
        if (!(v != null && v.data)) {
          s.push(v);
          continue;
        }
        const b = yield this.getEncryptionHandlerForKeyVersion(v.keyVersion), h = b && typeof v.data == "string" ? JSON.parse(yield b.decrypt(v.data)) : v.data;
        s.push(Object.assign(Object.assign({}, v), { data: h }));
      }
      const r = this.connectionId;
      if (r) {
        const v = s.findIndex((b) => b.connectionId === r);
        if (v > 0) {
          const b = s.splice(v, 1)[0];
          s.unshift(b);
        }
      }
      return s;
    });
  }
};
zd = Ae;
let x0 = class extends S0 {
  constructor(o, s) {
    typeof s == "string" ? super(o, s) : (super(o, s), s != null && s.ttl && (this.ttl = s == null ? void 0 : s.ttl));
  }
  setItem(o, s, r) {
    return F(this, void 0, void 0, function* () {
      var v, b;
      if (!o) throw new Error("No name passed!");
      if (!s && s !== 0 && s !== "" && s !== !1) throw new Error("No value passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      const h = (r == null ? void 0 : r.ttl) || this.ttl, T = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(s)) : s;
      let g;
      try {
        g = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}`, { value: T, ttl: h, ifAbsent: r == null ? void 0 : r.ifAbsent, updatedAt: r == null ? void 0 : r.updatedAt });
      } catch (m) {
        if (!m || ((v = m == null ? void 0 : m.cause) === null || v === void 0 ? void 0 : v.code) !== "conflictError.keyVersion.mismatch") throw m;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), g = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}`, { value: T, ttl: h, ifAbsent: r == null ? void 0 : r.ifAbsent });
      }
      const f = g;
      return f && { value: f == null ? void 0 : f.value, expiresAt: f == null ? void 0 : f.expiresAt, keyVersion: (b = f == null ? void 0 : f.keyVersion) !== null && b !== void 0 ? b : void 0, createdAt: f == null ? void 0 : f.createdAt, updatedAt: f == null ? void 0 : f.updatedAt };
    });
  }
  setItems(o) {
    return F(this, void 0, void 0, function* () {
      var s, r;
      if (!o || Object.keys(o).length === 0) throw new Error("No items passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      for (const h of Object.keys(o)) {
        const T = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(o[h].value)) : o[h].value;
        o[h].value = T, (r = o[h]).ttl || (r.ttl = this.ttl);
      }
      let v;
      try {
        v = yield this.request("POST", `/cache/${this.class}/${this.id}`, o);
      } catch (h) {
        if (!h || ((s = h == null ? void 0 : h.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw h;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), v = yield this.request("POST", `/cache/${this.class}/${this.id}`, o);
      }
      const b = v;
      return Object.keys(b).reduce((h, T) => {
        var g, f, m, w, N, H, q, I, V, rt;
        return h[T] = { value: (f = (g = b[T]) === null || g === void 0 ? void 0 : g.value) !== null && f !== void 0 ? f : null, expiresAt: (w = (m = b[T]) === null || m === void 0 ? void 0 : m.expiresAt) !== null && w !== void 0 ? w : 0, keyVersion: (H = (N = b[T]) === null || N === void 0 ? void 0 : N.keyVersion) !== null && H !== void 0 ? H : void 0, createdAt: (I = (q = b[T]) === null || q === void 0 ? void 0 : q.createdAt) !== null && I !== void 0 ? I : 0, updatedAt: (rt = (V = b[T]) === null || V === void 0 ? void 0 : V.updatedAt) !== null && rt !== void 0 ? rt : 0 }, h;
      }, {});
    });
  }
  getItem(o) {
    return F(this, void 0, void 0, function* () {
      var s, r;
      if (!o) throw new Error("No name passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      let v;
      try {
        v = yield this.request("GET", `/cache/${this.class}/${this.id}/${o}`);
      } catch (f) {
        if (!f || ((s = f == null ? void 0 : f.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw f;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), v = yield this.request("GET", `/cache/${this.class}/${this.id}/${o}`);
      }
      const b = v, h = b == null ? void 0 : b.value;
      if (!h) return;
      const T = yield this.getEncryptionHandlerForKeyVersion(b.keyVersion), g = T ? JSON.parse(yield T.decrypt(h)) : h;
      return (b == null ? void 0 : b.keyVersion) > -1 && b.keyVersion !== ((r = this[Zt]) === null || r === void 0 ? void 0 : r.keyVersion) && (this.autoUpdateOldEncryptedValues ? (this.logger.log("info", `Item "${o}" has an old encryption and will be automatically updated now by setting it again.`), yield this.setItem(o, g, { ttl: b.expiresAt - Date.now() })) : this.logger.log("warn", `Item "${o}" has an old encryption and can be updated by setting it again.`)), { value: g, expiresAt: b.expiresAt, keyVersion: b.keyVersion, createdAt: b.createdAt, updatedAt: b.updatedAt };
    });
  }
  getItems(o) {
    return F(this, void 0, void 0, function* () {
      var s, r;
      if (!o || o.length === 0) throw new Error("No names passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      let v;
      try {
        v = yield this.request("POST", `/cache-query/${this.class}/${this.id}`, o);
      } catch (f) {
        if (!f || ((s = f == null ? void 0 : f.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw f;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), v = yield this.request("POST", `/cache-query/${this.class}/${this.id}`, o);
      }
      const b = v;
      if (Object.keys(b).length === 0) return;
      const h = {}, T = {};
      for (const f of Object.keys(b)) {
        const m = b[f], w = m == null ? void 0 : m.value;
        if (!w) continue;
        const N = yield this.getEncryptionHandlerForKeyVersion(m.keyVersion), H = N ? JSON.parse(yield N.decrypt(w)) : w;
        (m == null ? void 0 : m.keyVersion) > -1 && m.keyVersion !== ((r = this[Zt]) === null || r === void 0 ? void 0 : r.keyVersion) && (h[f] = m), T[f] = { value: H, expiresAt: m.expiresAt, keyVersion: m.keyVersion, createdAt: m.createdAt, updatedAt: m.updatedAt };
      }
      const g = Object.keys(h);
      if (g.length > 0) if (this.autoUpdateOldEncryptedValues) {
        this.logger.log("info", `These items "${g.join(",")}" have an old encryption and will be automatically updated now by setting them again.`);
        const f = g.reduce((m, w) => (m[w] = { value: T[w].value, ttl: h[w].expiresAt - Date.now() }, m), {});
        yield this.setItems(f);
      } else this.logger.log("warn", `These items "${g.join(",")}" have an old encryption and can be updated by setting them again.`);
      return T;
    });
  }
  getAllItems(o) {
    return F(this, void 0, void 0, function* () {
      var s, r;
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      let v;
      try {
        v = yield this.request("GET", `/cache/${this.class}/${this.id}${o != null && o.prefix ? `?prefix=${o == null ? void 0 : o.prefix}` : ""}`);
      } catch (T) {
        if (!T || ((s = T == null ? void 0 : T.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw T;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), v = yield this.request("GET", `/cache/${this.class}/${this.id}${o != null && o.prefix ? `?prefix=${o == null ? void 0 : o.prefix}` : ""}`);
      }
      const b = v;
      if (Object.keys(b).length === 0) return;
      const h = {};
      for (const T of Object.keys(b)) {
        const g = b[T], f = g == null ? void 0 : g.value;
        if (!f) continue;
        const m = yield this.getEncryptionHandlerForKeyVersion(g.keyVersion), w = m ? JSON.parse(yield m.decrypt(f)) : f;
        h[T] = { value: w, expiresAt: g.expiresAt, keyVersion: (r = g.keyVersion) !== null && r !== void 0 ? r : void 0, createdAt: g.createdAt, updatedAt: g.updatedAt };
      }
      return h;
    });
  }
  getAllKeys(o) {
    return F(this, void 0, void 0, function* () {
      return yield this.request("GET", `/cache-keys/${this.class}/${this.id}${o != null && o.prefix ? `?prefix=${o == null ? void 0 : o.prefix}` : ""}`);
    });
  }
  removeItem(o) {
    return F(this, void 0, void 0, function* () {
      if (!o) throw new Error("No name passed!");
      yield this.request("DELETE", `/cache/${this.class}/${this.id}/${o}`);
    });
  }
  removeItems(o) {
    return F(this, void 0, void 0, function* () {
      if (!o || o.length === 0) throw new Error("No names passed!");
      yield this.request("DELETE", `/cache/${this.class}/${this.id}`, o);
    });
  }
  incrementItem(o) {
    return F(this, arguments, void 0, function* (s, r = 1, v) {
      var b;
      if (!s) throw new Error("No name passed!");
      if (r == null) throw new Error("No value passed!");
      if (typeof r != "number") throw new Error("Value needs to be a number!");
      const h = (v == null ? void 0 : v.ttl) || this.ttl, T = yield this.request("POST", `/cache/${this.class}/${this.id}/${s}/increment`, { value: r, ttl: h, updatedAt: v == null ? void 0 : v.updatedAt });
      return { value: T == null ? void 0 : T.value, expiresAt: T == null ? void 0 : T.expiresAt, keyVersion: (b = T == null ? void 0 : T.keyVersion) !== null && b !== void 0 ? b : void 0, createdAt: T == null ? void 0 : T.createdAt, updatedAt: T == null ? void 0 : T.updatedAt };
    });
  }
  decrementItem(o) {
    return F(this, arguments, void 0, function* (s, r = 1, v) {
      var b;
      if (!s) throw new Error("No name passed!");
      if (r == null) throw new Error("No value passed!");
      if (typeof r != "number") throw new Error("Value needs to be a number!");
      const h = (v == null ? void 0 : v.ttl) || this.ttl, T = yield this.request("POST", `/cache/${this.class}/${this.id}/${s}/decrement`, { value: r, ttl: h, updatedAt: v == null ? void 0 : v.updatedAt });
      return { value: T == null ? void 0 : T.value, expiresAt: T == null ? void 0 : T.expiresAt, keyVersion: (b = T == null ? void 0 : T.keyVersion) !== null && b !== void 0 ? b : void 0, createdAt: T == null ? void 0 : T.createdAt, updatedAt: T == null ? void 0 : T.updatedAt };
    });
  }
  push(o, s, r) {
    return F(this, void 0, void 0, function* () {
      var v;
      if (!o) throw new Error("No name passed!");
      const b = (r == null ? void 0 : r.ttl) || this.ttl, h = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/push`, { value: s, ttl: b, updatedAt: r == null ? void 0 : r.updatedAt });
      return { value: h == null ? void 0 : h.value, expiresAt: h == null ? void 0 : h.expiresAt, keyVersion: (v = h == null ? void 0 : h.keyVersion) !== null && v !== void 0 ? v : void 0, createdAt: h == null ? void 0 : h.createdAt, updatedAt: h == null ? void 0 : h.updatedAt };
    });
  }
  splice(o, s, r, v, b) {
    return F(this, void 0, void 0, function* () {
      var h;
      if (!o) throw new Error("No name passed!");
      const T = (b == null ? void 0 : b.ttl) || this.ttl, g = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/splice`, { startIndex: s, deleteCount: r, items: v, ttl: T, updatedAt: b == null ? void 0 : b.updatedAt });
      return { value: g == null ? void 0 : g.value, expiresAt: g == null ? void 0 : g.expiresAt, keyVersion: (h = g == null ? void 0 : g.keyVersion) !== null && h !== void 0 ? h : void 0, createdAt: g == null ? void 0 : g.createdAt, updatedAt: g == null ? void 0 : g.updatedAt };
    });
  }
  merge(o, s, r) {
    return F(this, void 0, void 0, function* () {
      var v;
      if (!o) throw new Error("No name passed!");
      const b = (r == null ? void 0 : r.ttl) || this.ttl, h = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/merge`, { value: s, ttl: b, updatedAt: r == null ? void 0 : r.updatedAt });
      return { value: h == null ? void 0 : h.value, expiresAt: h == null ? void 0 : h.expiresAt, keyVersion: (v = h == null ? void 0 : h.keyVersion) !== null && v !== void 0 ? v : void 0, createdAt: h == null ? void 0 : h.createdAt, updatedAt: h == null ? void 0 : h.updatedAt };
    });
  }
  setIn(o, s, r, v) {
    return F(this, void 0, void 0, function* () {
      var b;
      if (!o) throw new Error("No name passed!");
      if (!s || s.length === 0) throw new Error("Path must not be empty.");
      const h = (v == null ? void 0 : v.ttl) || this.ttl, T = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/set-in`, { path: s, value: r, ttl: h, updatedAt: v == null ? void 0 : v.updatedAt });
      return { value: T == null ? void 0 : T.value, expiresAt: T == null ? void 0 : T.expiresAt, keyVersion: (b = T == null ? void 0 : T.keyVersion) !== null && b !== void 0 ? b : void 0, createdAt: T == null ? void 0 : T.createdAt, updatedAt: T == null ? void 0 : T.updatedAt };
    });
  }
  clear() {
    return F(this, void 0, void 0, function* () {
      yield this.request("DELETE", `/cache/${this.class}/${this.id}`);
    });
  }
};
const hr = {};
function E0(z, o) {
  return `${`${o.projectId}-${o.apiKey}`}-${`${z.class || "_undefined_"}-${z.id}`}`;
}
const vr = (z, o) => {
  const s = o || o0(), r = E0(z, s);
  if (hr[r]) return hr[r];
  const v = new x0(s, z);
  return hr[r] = v, v;
};
function T0(z, o, s) {
  var w;
  const [r, v] = ne.useState(), [b, h] = ne.useState(), [T, g] = ne.useState(!0), f = vr({ ...s == null ? void 0 : s.instanceOptions, id: z }, s == null ? void 0 : s.credentials), m = (w = s == null ? void 0 : s.bind) != null ? w : !0;
  if (ne.useEffect(() => {
    if (!f) return;
    g(!0);
    try {
      (async function(H, q, I) {
        let V;
        typeof q == "string" ? (V = await H.getItem(q), I && I({ [`${q}`]: V })) : (V = await H.getItems(q), I && I(V));
      })(f, o, (H) => {
        v(H), g(!1);
      });
    } catch (H) {
      h(H), g(!1);
    }
    const N = {};
    return m && (Array.isArray(o) ? o : [o]).forEach((H) => {
      const q = /* @__PURE__ */ ((I) => function(V) {
        v((rt) => ({ ...rt, [`${I}`]: V }));
      })(H);
      N[H] = q, f.on("setItem", H, q);
    }), () => {
      m && Object.keys(N).forEach((H) => {
        f.off("setItem", H, N[H]);
      });
    };
  }, [o]), typeof o == "string") {
    const N = async () => {
      g(!0);
      try {
        const q = await f.getItem(o);
        return g(!1), q;
      } catch (q) {
        h(q), g(!1);
      }
    }, H = (q) => {
      q && v((I) => ({ ...I, [`${o}`]: q }));
    };
    return [f, r ? r[o] : void 0, H, N, b, h, T];
  }
  return [f, r, v, async () => {
    g(!0);
    try {
      const N = await f.getItems(o);
      return g(!1), N;
    } catch (N) {
      h(N), g(!1);
    }
  }, b, h, T];
}
const A0 = (z, o, s) => {
  const [r, v, b, , h, T, g] = T0(z, o, s);
  return [v, async (f) => {
    try {
      const m = await r.setItems(f);
      b({ ...v, ...m });
    } catch (m) {
      T(m);
    }
  }, h, g];
};
function El(z, o) {
  o === void 0 && (o = {});
  var s = o.insertAt;
  if (z && typeof document != "undefined") {
    var r = document.head || document.getElementsByTagName("head")[0], v = document.createElement("style");
    v.type = "text/css", s === "top" && r.firstChild ? r.insertBefore(v, r.firstChild) : r.appendChild(v), v.styleSheet ? v.styleSheet.cssText = z : v.appendChild(document.createTextNode(z));
  }
}
var O0 = `/* Vaultrice Component Theming */

/* Light theme (default) */
:root,
[data-theme="light"] {
  /* Primary colors */
  --vaultrice-primary-color: rgba(55, 0, 255, 0.8);
  --vaultrice-primary-color-hover: rgba(55, 0, 255, 0.9);
  --vaultrice-primary-color-light: rgba(55, 0, 255, 0.2);
  
  /* Background colors */
  --vaultrice-background: rgba(255, 255, 255, 0.6);
  --vaultrice-background-secondary: rgba(255, 255, 255, 0.4);
  --vaultrice-background-blur: rgba(255, 255, 255, 0.2);
  --vaultrice-background-overlay: rgba(0, 0, 0, 0.02);
  --vaultrice-background-input: rgba(255, 255, 255, 0.2);
  --vaultrice-background-disabled: rgba(255, 255, 255, 0.3);
  
  /* Glassmorphism gradient colors - Light theme */
  --vaultrice-glass-color-1: rgba(103, 167, 193, 0.25);
  --vaultrice-glass-color-2: rgba(14, 114, 148, 0.25);
  --vaultrice-glass-color-3: rgba(176, 68, 197, 0.25);
  
  /* Text colors */
  --vaultrice-text-color: rgba(0, 0, 0, 0.9);
  --vaultrice-text-secondary: rgba(0, 0, 0, 0.6);
  --vaultrice-text-muted: rgba(0, 0, 0, 0.5);
  --vaultrice-text-disabled: rgba(0, 0, 0, 0.3);
  --vaultrice-text-disabled-button: rgba(0, 0, 0, 0.4);
  
  /* Border and shadow */
  --vaultrice-border-color: rgba(0, 0, 0, 0.12);
  --vaultrice-border-color-focus: rgba(55, 0, 255, 0.6);
  --vaultrice-border-light: rgba(0, 0, 0, 0.08);
  --vaultrice-border-disabled: rgba(0, 0, 0, 0.06);
  --vaultrice-shadow: rgba(0, 0, 0, 0.15);
  --vaultrice-shadow-strong: rgba(0, 0, 0, 0.3);
  --vaultrice-shadow-light: rgba(0, 0, 0, 0.1);
  
  /* Avatar borders */
  --vaultrice-avatar-border: rgba(255, 255, 255, 0.4);
  --vaultrice-avatar-shadow: rgba(0, 0, 0, 0.15);
  
  /* Status colors */
  --vaultrice-success-color: #28a745;
  --vaultrice-error-color: #dc3545;
  --vaultrice-warning-color: #ffc107;
}

/* Dark theme */
[data-theme="dark"] {
  /* Primary colors */
  --vaultrice-primary-color: #4dabf7;
  --vaultrice-primary-color-hover: #339af0;
  --vaultrice-primary-color-light: rgba(77, 171, 247, 0.25);
  
  /* Background colors */
  --vaultrice-background: rgba(255, 255, 255, 0.08);
  --vaultrice-background-secondary: rgba(255, 255, 255, 0.05);
  --vaultrice-background-blur: rgba(255, 255, 255, 0.02);
  --vaultrice-background-overlay: rgba(0, 0, 0, 0.15);
  --vaultrice-background-input: rgba(255, 255, 255, 0.05);
  --vaultrice-background-disabled: rgba(255, 255, 255, 0.1);
  
  /* Glassmorphism gradient colors - MORE VIBRANT and similar to light mode */
  --vaultrice-glass-color-1: rgba(103, 167, 193, 0.35);
  --vaultrice-glass-color-2: rgba(14, 114, 148, 0.35);
  --vaultrice-glass-color-3: rgba(176, 68, 197, 0.35);
  
  /* Text colors */
  --vaultrice-text-color: rgba(255, 255, 255, 0.95);
  --vaultrice-text-secondary: rgba(255, 255, 255, 0.7);
  --vaultrice-text-muted: rgba(255, 255, 255, 0.5);
  --vaultrice-text-disabled: rgba(255, 255, 255, 0.3);
  --vaultrice-text-disabled-button: rgba(255, 255, 255, 0.5);
  
  /* Border and shadow */
  --vaultrice-border-color: rgba(255, 255, 255, 0.2);
  --vaultrice-border-color-focus: #4dabf7;
  --vaultrice-border-light: rgba(255, 255, 255, 0.08);
  --vaultrice-border-disabled: rgba(255, 255, 255, 0.1);
  --vaultrice-shadow: rgba(0, 0, 0, 0.4);
  --vaultrice-shadow-strong: rgba(0, 0, 0, 0.6);
  --vaultrice-shadow-light: rgba(0, 0, 0, 0.3);
  
  /* Avatar borders */
  --vaultrice-avatar-border: rgba(255, 255, 255, 0.3);
  --vaultrice-avatar-shadow: rgba(0, 0, 0, 0.4);
  
  /* Status colors */
  --vaultrice-success-color: #51cf66;
  --vaultrice-error-color: #ff6b6b;
  --vaultrice-warning-color: #ffd43b;
}`;
El(O0);
var z0 = `.vaultrice-card {
  display: block;

  position: relative;
  font-family: -apple-system, 'system-ui', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;

  border-radius: 20px;
  overflow: hidden;
  padding: 20px;

  backdrop-filter: blur(4px);
  /* Use the same glassmorphism variables as ChatRoom */
  background: linear-gradient(125deg, var(--vaultrice-glass-color-1) -22%, var(--vaultrice-glass-color-2) 45%, var(--vaultrice-glass-color-3) 125%);
  box-shadow: inset 1px 1px 1px rgba(255,255,255, 0.2), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.2),
            0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.vaultrice-card:hover {
  box-shadow: inset 1px 1px 1px rgba(255,255,255, 0.4), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.4),
            0 2px 15px 3px rgba(0, 0, 0, 0.7);
  transform: translateY(-2px);
}

/* Enhanced Dark Mode for Card */
[data-theme="dark"] .vaultrice-card {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: inset 1px 1px 1px rgba(255,255,255, 0.08), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.6),
            0 4px 20px rgba(0, 0, 0, 0.7);
}

[data-theme="dark"] .vaultrice-card:hover {
  box-shadow: inset 1px 1px 1px rgba(255,255,255, 0.12), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.8),
            0 6px 25px rgba(0, 0, 0, 0.8);
}
`;
El(z0);
function w0({ style: z, children: o }) {
  return ct.jsx("div", { className: "vaultrice-card", style: z, children: o });
}
var M0 = `.vaultrice-meter-container {
  display: block;
  position: relative;
  width: 100%;
}

.vaultrice-meter-control {
  position: relative;
  --track-width: 100%;
  --track-height: 18px;
  --thumb-size: 16px;
  
  display: flex;
  align-items: center;

  border-radius: 16px;
}

/* Toggle Track */
.vaultrice-meter-track {
  position: relative;
  max-width: var(--track-width);
  height: var(--track-height);
  border-radius: 16px;
  overflow: hidden;
  
  transition: width 1s ease;

  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 25px rgba(55, 0, 255, 0.05);
}

/* Toggle Thumb */
.vaultrice-meter-state {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 4;
  top: 1px;
  left: 1px;
  min-width: var(--thumb-size);
  max-width: calc(100% - 2px);
  height: var(--thumb-size);
  border-radius: 14px;
  transition: width 1s ease;
  overflow: hidden;

  background-color: rgba(255, 255, 255, 0.8);
}

.vaultrice-meter-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(55, 0, 255, 0.8), rgba(55, 0, 255, 0.6));
  border-radius: 5px;
  transition: width 0.6s ease-in-out;
  box-shadow: 0 2px 8px rgba(55, 0, 255, 0.3);
}

.vaultrice-meter-control-error .vaultrice-meter-track {
  border-radius: 16px 0 0 16px;
}

/* Enhanced Dark Mode for Meter */
[data-theme="dark"] .vaultrice-meter-track {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .vaultrice-meter-state {
  background-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .vaultrice-meter-bar {
  background: linear-gradient(90deg, #4dabf7, #339af0);
  box-shadow: 0 2px 8px rgba(77, 171, 247, 0.4);
}
`;
El(M0);
function D0({ percentage: z = 0, style: o }) {
  const [s, r] = ne.useState(0);
  return ne.useEffect(() => {
    setTimeout(() => {
      r(z);
    }, 1300);
  }, [z]), ct.jsx("div", { className: "vaultrice-meter-container", style: o, children: ct.jsxs("div", { className: "vaultrice-meter-control " + (s > 100 ? "vaultrice-meter-control-error" : s > 90 ? "vaultrice-meter-control-warning" : ""), children: [ct.jsx("div", { className: "vaultrice-meter-track", style: { width: s < 100 ? "100%" : 100 / (s / 100) + "%" } }), ct.jsx("div", { className: "vaultrice-meter-state", style: { width: `${s}%`, borderRadius: s >= 100 ? "14px" : "14px 0 0 14px", opacity: s === 0 ? 0 : 1 } })] }) });
}
var _0 = `.vaultrice-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--vaultrice-background), var(--vaultrice-background-secondary));
  border: 1px solid var(--vaultrice-border-color);
  border-radius: 12px;
  color: var(--vaultrice-text-color);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px var(--vaultrice-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease, transform 0.1s ease;
}

.vaultrice-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--vaultrice-background-secondary), var(--vaultrice-primary-color));
  border-color: var(--vaultrice-primary-color);
  box-shadow: 0 8px 25px var(--vaultrice-shadow);
  transform: translateY(-2px);
}

.vaultrice-button:disabled {
  cursor: not-allowed;
  color: var(--vaultrice-text-muted);
  background: var(--vaultrice-background-blur);
  box-shadow: none;
  transform: none;
}

.vaultrice-button:disabled:hover {
  background: var(--vaultrice-background-blur);
  box-shadow: none;
  transform: none;
}
`;
El(_0);
function N0({ onClick: z, disabled: o, style: s, children: r }) {
  return ct.jsx("button", { className: "vaultrice-button", style: s, type: "button", disabled: o, onClick: z, children: r });
}
var U0 = `.vaultrice-voting-title {
  margin-top: 0;
}

.vaultrice-voting-description {
  color: #666;
}

.vaultrice-voting-choice {
  display: flex;
  align-items: center;
  margin: 15px 5px;
}

.vaultrice-voting-choices {
  margin: 30px 0;
}

.vaultrice-voting-choice input {
  appearance: none;

  border-radius: 50%;
  width: 16px;
  height: 16px;

  border: 2px solid #999;
  transition: 0.2s all linear;
  margin-right: 10px;
  margin-top: -1px;

  position: relative;
}

.vaultrice-voting-choice input:checked {
  border: 6px solid #000;
}

.vaultrice-voting-result {
  margin: 30px 0;
}

.vaultrice-voting-result .vaultrice-voting--result-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vaultrice-voting-result .vaultrice-voting-result-label-tag {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 15px;
  font-weight: 600;

  box-shadow: 0 8px 25px rgba(55, 0, 255, 0.05);
}

.vaultrice-voting-result .vaultrice-meter-container {
  margin: 15px 0;
}

.vaultrice-voting-disclaimer {
  display: flex;
  justify-content: flex-end;
  font-size: 11px;
  color: #666;
  margin-top: 30px;
}

.vaultrice-voting-disclaimer a {
  color: rgba(55, 0, 255, 0.718);
  margin: 0 2px;
}

.vaultrice-voting-expired .vaultrice-voting--result-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.vaultrice-voting-expired-icon {
  font-size: 1.2em;
  margin-right: 8px;
  opacity: 0.7;
}

.vaultrice-voting-expired-label {
  color: #888;
  font-weight: 600;
  font-size: 1.1em;
  margin-right: auto;
}

.vaultrice-voting-expired .vaultrice-voting-result-label-tag {
  background: #e0d7ff;
  color: #6c3cff;
  font-weight: 700;
  font-size: 1em;
  margin-left: 8px;
}

.vaultrice-voting-expired-text {
  margin-top: 18px;
  font-size: 1.07em;
  color: #888;
}
`;
El(U0);
function R0(z, o, s, r, v, b) {
  const [h, T] = ne.useState(), [g, f] = ne.useState(!1), [m, w] = ne.useState(!1), [N, H] = ne.useState(!1);
  s || (s = o);
  const q = r ? r.class || "_undefined_" : (v == null ? void 0 : v.class) || "_undefined_", I = r ? r.ttl || 36e5 : (v == null ? void 0 : v.ttl) || 36e5, V = `${z}-user-${o}-voted`, rt = `vaultrice-${z}-user-${s}-${q}-voted`, tt = `${z}-user-${o}`, ht = z, et = o ? vr({ ...r, id: tt }, b) : void 0;
  return ne.useEffect(() => {
    try {
      (async () => {
        if (f(!1), o) {
          const G = await (et == null ? void 0 : et.getItem(V));
          w(!!G);
        } else {
          let G = window.localStorage.getItem(rt);
          G && parseInt(G) + 2 * I < Date.now() && (window.localStorage.removeItem(rt), G = null), w(!!G);
        }
        f(!0);
      })();
    } catch (G) {
      T(G);
    }
  }, [V, et, o, s, rt, I]), [g, N, m, async (G) => {
    try {
      if (m) return;
      H(!0), await vr({ ...v, id: ht }, b).incrementItem(`${ht}-choices-${G}`), o ? await (et == null ? void 0 : et.setItem(V, Date.now())) : window.localStorage.setItem(rt, Date.now().toString()), H(!1), w(!0);
    } catch (J) {
      T(J);
    }
  }, h];
}
const H0 = ({ id: z, choices: o = [], choicesInstanceOptions: s, credentials: r, bind: v = !0, showPercentage: b = !1, showTotalVotes: h = !0 }) => {
  const [T] = ne.useState(o.map((w) => `${z}-choices-${w.id}`)), [g, , , f] = A0(z, T, { credentials: r, instanceOptions: s, bind: v });
  if (!f && !g) return ct.jsxs("div", { className: "vaultrice-voting-result vaultrice-voting-expired", children: [ct.jsxs("div", { className: "vaultrice-voting--result-label", children: [ct.jsx("span", { className: "vaultrice-voting-expired-icon", "aria-label": "Voting closed", role: "img", children: "🔒" }), ct.jsx("label", { className: "vaultrice-voting-expired-label", children: "Voting closed" }), ct.jsx("span", { className: "vaultrice-voting-result-label-tag", children: "Expired" })] }), ct.jsx("p", { className: "vaultrice-voting-expired-text", children: "This voting has expired and is no longer accepting responses." })] });
  if (f) return "loading...";
  if (!g) return null;
  const m = Object.values(g).reduce((w, N) => N != null && N.value ? w + N.value : w, 0);
  return ct.jsxs("div", { className: "vaultrice-voting-results", children: [o.map((w) => {
    const N = g[`${z}-choices-${w.id}`], H = N != null && N.value ? N.value / m * 100 : 0;
    return ct.jsxs("div", { className: "vaultrice-voting-result", children: [ct.jsxs("div", { className: "vaultrice-voting--result-label", children: [ct.jsx("label", { children: w.label }), ct.jsx("span", { className: "vaultrice-voting-result-label-tag", children: b ? `${H.toFixed(1)}%` : (N == null ? void 0 : N.value) || 0 })] }), ct.jsx(D0, { percentage: H })] }, w.id);
  }), h && ct.jsxs("div", { style: { marginTop: 12, textAlign: "right", color: "#666", fontSize: 13 }, children: ["Total votes: ", ct.jsx("b", { children: m })] })] });
}, q0 = ({ id: z, title: o, description: s, voteLabel: r = "vote", choices: v = [], choicesInstanceOptions: b, userId: h, userIdForLocalStorage: T, userInstanceOptions: g, credentials: f, bind: m = !0, showPercentage: w = !1, showTotalVotes: N = !0 }) => {
  var ht;
  const [H, q] = ne.useState((ht = v == null ? void 0 : v[0]) == null ? void 0 : ht.id), [I, V, rt, tt] = R0(z, h, T, g, b, f);
  return I ? ct.jsxs(w0, { children: [!!o && ct.jsx("h3", { className: "vaultrice-voting-title", children: o }), !!s && ct.jsx("p", { className: "vaultrice-voting-description", children: s }), !!rt && ct.jsx(H0, { id: z, choices: v, choicesInstanceOptions: b, credentials: f, bind: m, showPercentage: w, showTotalVotes: N }), !rt && ct.jsxs(ct.Fragment, { children: [ct.jsx("div", { className: "vaultrice-voting-choices", children: v.map((et) => ct.jsxs("div", { className: "vaultrice-voting-choice", onClick: (G) => {
    G.target.tagName !== "INPUT" && q(et.id);
  }, style: { cursor: "pointer" }, children: [ct.jsx("input", { type: "radio", name: et.id, value: et.id, checked: et.id === H, onChange: () => {
    q(et.id);
  }, style: { cursor: "pointer" } }), ct.jsx("label", { htmlFor: et.id, style: { cursor: "pointer" }, children: et.label })] }, et.id)) }), ct.jsx(N0, { onClick: () => {
    tt(H);
  }, disabled: V, children: V ? "...voting" : r })] }), ct.jsxs("div", { className: "vaultrice-voting-disclaimer", children: ["Powered by ", ct.jsx("a", { href: "https://www.vaultrice.com", target: "_blank", rel: "noreferrer", children: "vaultrice.com" }), " - get yours ", ct.jsx("a", { href: "https://www.vaultrice.app/register", target: "_bland", children: "for free!" })] })] }) : null;
};
var j0 = `.vaultrice-presence {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vaultrice-presence-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.vaultrice-presence-pile {
  display: flex;
  align-items: center;
  /* padding: 8px 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); */
}

/* Use a more generic approach for the first avatar */
.vaultrice-presence-pile > *:first-child .vaultrice-presence-avatar,
.vaultrice-presence-pile > *:first-child .vaultrice-presence-avatar-fallback {
  margin-left: 0;
}

.vaultrice-presence-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  margin-left: -10px;
  background-color: #f0f0f0;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.vaultrice-presence-avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.vaultrice-presence-avatar-fallback {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  margin-left: -10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.vaultrice-presence-avatar-fallback:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Own connection styling */
.vaultrice-presence-own .vaultrice-presence-avatar {
  border: 3px solid rgba(55, 0, 255, 0.8);
  box-shadow: 0 0 0 2px rgba(55, 0, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.vaultrice-presence-own .vaultrice-presence-avatar-fallback {
  border: 3px solid rgba(55, 0, 255, 0.8);
  box-shadow: 0 0 0 2px rgba(55, 0, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.vaultrice-presence-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
}

.vaultrice-presence-more {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-left: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.vaultrice-presence-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.vaultrice-presence-stack {
  display: flex;
  position: relative;
}

.vaultrice-presence-stack::after {
  content: '+';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #666;
}

/* Offline user styling */
.vaultrice-presence-offline .vaultrice-presence-avatar {
  opacity: 0.5;
  filter: grayscale(50%);
}

.vaultrice-presence-offline .vaultrice-presence-avatar-fallback {
  opacity: 0.5;
  filter: grayscale(50%);
}

/* Add a small badge for predefined team members */
.vaultrice-presence-predefined {
  position: relative;
}

/* Enhanced Dark Mode for Presence */
[data-theme="dark"] .vaultrice-presence-pile {
  /* background: rgba(255, 255, 255, 0.1); */
  /* border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); */
}

[data-theme="dark"] .vaultrice-presence-avatar {
  border-color: rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .vaultrice-presence-avatar:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

[data-theme="dark"] .vaultrice-presence-avatar-fallback {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  /* Keep the gradient backgrounds as they look good in dark mode */
}

[data-theme="dark"] .vaultrice-presence-avatar-fallback:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

[data-theme="dark"] .vaultrice-presence-own .vaultrice-presence-avatar {
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.4), 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .vaultrice-presence-own .vaultrice-presence-avatar-fallback {
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.4), 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .vaultrice-presence-name {
  color: rgba(255, 255, 255, 0.9);
}

[data-theme="dark"] .vaultrice-presence-more {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .vaultrice-presence-more:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

[data-theme="dark"] .vaultrice-presence-offline .vaultrice-presence-avatar {
  opacity: 0.4;
  filter: grayscale(70%) brightness(0.7);
}

[data-theme="dark"] .vaultrice-presence-offline .vaultrice-presence-avatar-fallback {
  opacity: 0.4;
  filter: grayscale(70%) brightness(0.7);
}
`;
El(j0);
var Y0 = `.vaultrice-chat {
  display: flex;
  flex-direction: column;
  font-family: -apple-system, 'system-ui', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  /* Use CSS variables for the glassmorphism background */
  background: linear-gradient(125deg, var(--vaultrice-glass-color-1) -22%, var(--vaultrice-glass-color-2) 45%, var(--vaultrice-glass-color-3) 125%);
  box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.2), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.2),
            0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%; /* Take full height of parent */
  min-height: 300px; /* Minimum height when standalone */
}

/* When Chat is inside ChatRoom, remove the min-height constraint */
.vaultrice-chatroom-chat .vaultrice-chat {
  min-height: 0;
}

.vaultrice-chat-messages {
  flex: 1; /* Take all available space */
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth;
  background: var(--vaultrice-background-overlay);
  backdrop-filter: blur(4px);
  min-height: 0; /* Allow shrinking below content size */
}

.vaultrice-chat-messages::-webkit-scrollbar {
  width: 6px;
}

.vaultrice-chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.vaultrice-chat-messages::-webkit-scrollbar-thumb {
  background: var(--vaultrice-border-color);
  border-radius: 3px;
}

.vaultrice-chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--vaultrice-text-muted);
}

.vaultrice-chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: var(--vaultrice-text-secondary);
}

.vaultrice-chat-empty-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--vaultrice-text-color);
}

.vaultrice-chat-empty-subtext {
  font-size: 14px;
  opacity: 0.7;
  color: var(--vaultrice-text-muted);
}

.vaultrice-chat-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: slideIn 0.2s ease-out;
}

.vaultrice-chat-message-own {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.vaultrice-chat-message-content {
  flex: 1;
  min-width: 0;
}

.vaultrice-chat-message-user {
  font-size: 12px;
  font-weight: 600;
  color: var(--vaultrice-text-secondary);
  margin-bottom: 4px;
}

.vaultrice-chat-message-own .vaultrice-chat-message-user {
  text-align: right;
  color: var(--vaultrice-primary-color);
}

.vaultrice-chat-message-text {
  background: var(--vaultrice-background-secondary);
  backdrop-filter: blur(8px);
  padding: 10px 14px;
  border-radius: 16px;
  color: var(--vaultrice-text-color);
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  border: 1px solid var(--vaultrice-border-color);
  box-shadow: 0 2px 12px var(--vaultrice-shadow);
}

.vaultrice-chat-message-own .vaultrice-chat-message-text {
  background: linear-gradient(135deg, var(--vaultrice-primary-color), var(--vaultrice-primary-color-hover));
  border-color: var(--vaultrice-primary-color);
  color: white;
  box-shadow: 0 2px 12px var(--vaultrice-shadow);
}

.vaultrice-chat-message-timestamp {
  font-size: 11px;
  color: var(--vaultrice-text-muted);
  margin-top: 4px;
}

.vaultrice-chat-message-own .vaultrice-chat-message-timestamp {
  text-align: right;
  color: var(--vaultrice-primary-color);
}

.vaultrice-chat-input-container {
  display: flex;
  padding: 16px;
  gap: 12px;
  background: var(--vaultrice-background-input);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--vaultrice-border-light);
  flex-shrink: 0; /* Don't shrink input area */
}

.vaultrice-chat-input {
  flex: 1;
  padding: 12px 16px;
  background: var(--vaultrice-background);
  backdrop-filter: blur(4px);
  border: 1px solid var(--vaultrice-border-color);
  border-radius: 12px;
  color: var(--vaultrice-text-color);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.vaultrice-chat-input::placeholder {
  color: var(--vaultrice-text-muted);
}

.vaultrice-chat-input:focus {
  border-color: var(--vaultrice-primary-color);
  box-shadow: 0 0 0 2px var(--vaultrice-primary-color-light);
  background: var(--vaultrice-background-secondary);
}

.vaultrice-chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--vaultrice-background-disabled);
}

/* Dark mode specific improvements */
[data-theme="dark"] .vaultrice-chat-input-container {
  background: rgba(0, 0, 0, 0.2);
  border-top-color: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .vaultrice-chat-input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
}

[data-theme="dark"] .vaultrice-chat-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.25);
}

[data-theme="dark"] .vaultrice-chat-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.vaultrice-chat-send-button {
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--vaultrice-primary-color), var(--vaultrice-primary-color-hover));
  border: 1px solid var(--vaultrice-primary-color);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  box-shadow: 0 4px 15px var(--vaultrice-shadow);
  backdrop-filter: blur(4px);
}

.vaultrice-chat-send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--vaultrice-primary-color-hover), var(--vaultrice-primary-color));
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--vaultrice-shadow);
}

.vaultrice-chat-send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  background: var(--vaultrice-background-disabled);
  border-color: var(--vaultrice-border-disabled);
  box-shadow: none;
  color: var(--vaultrice-text-disabled-button);
}

.vaultrice-chat-send-button:active:not(:disabled) {
  transform: translateY(0);
}

.vaultrice-chat-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.vaultrice-chat-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--vaultrice-avatar-border);
  box-shadow: 0 2px 8px var(--vaultrice-avatar-shadow);
}

.vaultrice-chat-avatar-fallback {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  border: 2px solid var(--vaultrice-avatar-border);
  box-shadow: 0 2px 8px var(--vaultrice-avatar-shadow);
}

.vaultrice-chat-message-grouped {
  margin-top: 2px;
}

.vaultrice-chat-avatar-spacer {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.vaultrice-chat-message-grouped .vaultrice-chat-message-text {
  margin-top: 2px;
}

.vaultrice-chat-typing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: var(--vaultrice-text-secondary);
  font-size: 12px;
  font-style: italic;
}

.vaultrice-chat-typing-dots {
  display: flex;
  gap: 2px;
}

.vaultrice-chat-typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vaultrice-text-secondary);
  animation: typingDot 1.4s infinite ease-in-out;
}

.vaultrice-chat-typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.vaultrice-chat-typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typingDot {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Dark Mode for Chat */`;
El(Y0);
var B0 = `.vaultrice-chatroom {
  display: flex;
  flex-direction: column;
  font-family: -apple-system, 'system-ui', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  /* Use CSS variables for consistent glassmorphism */
  background: linear-gradient(125deg, var(--vaultrice-glass-color-1) -22%, var(--vaultrice-glass-color-2) 45%, var(--vaultrice-glass-color-3) 125%);
  box-shadow: inset 1px 1px 1px rgba(255,255,255, 0.2), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.2),
            0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%; /* Take full height of parent */
  min-height: 400px; /* Minimum height fallback */
}

.vaultrice-chatroom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0; /* Don't shrink header */
  min-height: 0; /* Allow flex to work properly */
}

.vaultrice-chatroom-header-text {
  flex: 1;
  min-width: 0;
}

.vaultrice-chatroom-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vaultrice-text-color);
  line-height: 1.2;
}

.vaultrice-chatroom-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--vaultrice-text-secondary);
  line-height: 1.2;
}

.vaultrice-chatroom-presence {
  flex-shrink: 0;
  margin-left: 16px;
}

.vaultrice-chatroom-chat {
  flex: 1; /* Take all remaining space */
  min-height: 0; /* Allow flex item to shrink below content size */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensure proper containment */
}

/* Override chat styles to remove duplicate glassmorphism and make it flex properly */
.vaultrice-chatroom-chat .vaultrice-chat {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  border-radius: 0;
  height: 100%; /* Take full height of parent */
  min-height: 0; /* Allow shrinking */
  flex: 1; /* Ensure it takes available space */
}

/* Ensure the messages container in ChatRoom context takes available space */
.vaultrice-chatroom-chat .vaultrice-chat .vaultrice-chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* Enhanced Dark Mode for ChatRoom - now uses CSS variables */
[data-theme="dark"] .vaultrice-chatroom {
  /* CSS variables automatically provide the colorful gradient */
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: inset 1px 1px 1px rgba(255,255,255, 0.08), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.6),
            0 4px 20px rgba(0, 0, 0, 0.7);
}

[data-theme="dark"] .vaultrice-chatroom-header {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}`;
El(B0);
function k0(z, o) {
  const s = i0.createRoot(z);
  function r(v) {
    const b = {
      id: v.votingId || v.id || "",
      title: v.title || "",
      description: v.description || "",
      choices: v.choices || [],
      voteLabel: v.voteLabel || "vote",
      bind: !0,
      showPercentage: !!v.showPercentages,
      showTotalVotes: !!v.showTotalVotes,
      userIdForLocalStorage: "gitbook-user",
      credentials: v.credentials,
      choicesInstanceOptions: {
        class: v.votingClass || "_undefined_",
        ttl: v.tll || 36e5
        // 1 hour in ms
      }
    };
    try {
      typeof b.choices == "string" && (b.choices = JSON.parse(b.choices));
    } catch (h) {
      b.choices = [];
    }
    try {
      s.render(Iv.createElement(q0, b));
    } catch (h) {
      const T = document.createElement("div");
      T.textContent = "Failed to render voting widget", z.innerHTML = "", z.appendChild(T);
    }
  }
  return r(o || {}), { render: r, root: s };
}
function L0() {
  if (typeof window == "undefined" || typeof document == "undefined") return;
  let z = null, o = !1, s = null, r = null;
  function v(g) {
    try {
      window.parent.postMessage({ action: g }, "*");
    } catch (f) {
    }
  }
  function b(g) {
    if (!g.data || typeof g.data != "object") return;
    const f = g.data.state;
    f && typeof f == "object" && (z = f, typeof z.credentials == "string" && (z.credentials = JSON.parse(z.credentials)), o ? r && r.render(z) : (s = document.getElementById("root"), s || (s = document.createElement("div"), s.id = "root", document.body.appendChild(s)), r = k0(s, z), o = !0), h());
  }
  function h() {
    try {
      const g = document.body.scrollHeight || (s ? s.scrollHeight : 300);
      v({
        action: "@webframe.resize",
        size: { height: Math.max(g, 200) }
      });
    } catch (g) {
    }
  }
  function T() {
    v({ action: "@webframe.ready" });
  }
  if (window.addEventListener("message", b), typeof window.ResizeObserver != "undefined")
    try {
      new window.ResizeObserver(() => h()).observe(document.body);
    } catch (g) {
    }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", T) : T(), {
    getState: () => z,
    destroy: () => {
      window.removeEventListener("message", b);
    }
  };
}
export {
  L0 as default
};
