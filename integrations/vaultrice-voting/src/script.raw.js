function Wv(z) {
  return z && z.__esModule && Object.prototype.hasOwnProperty.call(z, "default") ? z.default : z;
}
var ur = { exports: {} }, F = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fd;
function Fv() {
  if (fd) return F;
  fd = 1;
  var z = Symbol.for("react.transitional.element"), o = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), E = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), _ = Symbol.iterator;
  function U(v) {
    return v === null || typeof v != "object" ? null : (v = _ && v[_] || v["@@iterator"], typeof v == "function" ? v : null);
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
  }, G = Object.assign, k = {};
  function J(v, R, B) {
    this.props = v, this.context = R, this.refs = k, this.updater = B || H;
  }
  J.prototype.isReactComponent = {}, J.prototype.setState = function(v, R) {
    if (typeof v != "object" && typeof v != "function" && v != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, v, R, "setState");
  }, J.prototype.forceUpdate = function(v) {
    this.updater.enqueueForceUpdate(this, v, "forceUpdate");
  };
  function it() {
  }
  it.prototype = J.prototype;
  function lt(v, R, B) {
    this.props = v, this.context = R, this.refs = k, this.updater = B || H;
  }
  var dt = lt.prototype = new it();
  dt.constructor = lt, G(dt, J.prototype), dt.isPureReactComponent = !0;
  var P = Array.isArray, q = { H: null, A: null, T: null, S: null, V: null }, rt = Object.prototype.hasOwnProperty;
  function Rt(v, R, B, j, X, ft) {
    return B = ft.ref, {
      $$typeof: z,
      type: v,
      key: R,
      ref: B !== void 0 ? B : null,
      props: ft
    };
  }
  function gt(v, R) {
    return Rt(
      v.type,
      R,
      void 0,
      void 0,
      void 0,
      v.props
    );
  }
  function xt(v) {
    return typeof v == "object" && v !== null && v.$$typeof === z;
  }
  function vt(v) {
    var R = { "=": "=0", ":": "=2" };
    return "$" + v.replace(/[=:]/g, function(B) {
      return R[B];
    });
  }
  var $ = /\/+/g;
  function _t(v, R) {
    return typeof v == "object" && v !== null && v.key != null ? vt("" + v.key) : R.toString(36);
  }
  function El() {
  }
  function Tl(v) {
    switch (v.status) {
      case "fulfilled":
        return v.value;
      case "rejected":
        throw v.reason;
      default:
        switch (typeof v.status == "string" ? v.then(El, El) : (v.status = "pending", v.then(
          function(R) {
            v.status === "pending" && (v.status = "fulfilled", v.value = R);
          },
          function(R) {
            v.status === "pending" && (v.status = "rejected", v.reason = R);
          }
        )), v.status) {
          case "fulfilled":
            return v.value;
          case "rejected":
            throw v.reason;
        }
    }
    throw v;
  }
  function Kt(v, R, B, j, X) {
    var ft = typeof v;
    (ft === "undefined" || ft === "boolean") && (v = null);
    var W = !1;
    if (v === null) W = !0;
    else
      switch (ft) {
        case "bigint":
        case "string":
        case "number":
          W = !0;
          break;
        case "object":
          switch (v.$$typeof) {
            case z:
            case o:
              W = !0;
              break;
            case p:
              return W = v._init, Kt(
                W(v._payload),
                R,
                B,
                j,
                X
              );
          }
      }
    if (W)
      return X = X(v), W = j === "" ? "." + _t(v, 0) : j, P(X) ? (B = "", W != null && (B = W.replace($, "$&/") + "/"), Kt(X, R, B, "", function($e) {
        return $e;
      })) : X != null && (xt(X) && (X = gt(
        X,
        B + (X.key == null || v && v.key === X.key ? "" : ("" + X.key).replace(
          $,
          "$&/"
        ) + "/") + W
      )), R.push(X)), 1;
    W = 0;
    var ae = j === "" ? "." : j + ":";
    if (P(v))
      for (var Ot = 0; Ot < v.length; Ot++)
        j = v[Ot], ft = ae + _t(j, Ot), W += Kt(
          j,
          R,
          B,
          ft,
          X
        );
    else if (Ot = U(v), typeof Ot == "function")
      for (v = Ot.call(v), Ot = 0; !(j = v.next()).done; )
        j = j.value, ft = ae + _t(j, Ot++), W += Kt(
          j,
          R,
          B,
          ft,
          X
        );
    else if (ft === "object") {
      if (typeof v.then == "function")
        return Kt(
          Tl(v),
          R,
          B,
          j,
          X
        );
      throw R = String(v), Error(
        "Objects are not valid as a React child (found: " + (R === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : R) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return W;
  }
  function w(v, R, B) {
    if (v == null) return v;
    var j = [], X = 0;
    return Kt(v, j, "", "", function(ft) {
      return R.call(B, ft, X++);
    }), j;
  }
  function Y(v) {
    if (v._status === -1) {
      var R = v._result;
      R = R(), R.then(
        function(B) {
          (v._status === 0 || v._status === -1) && (v._status = 1, v._result = B);
        },
        function(B) {
          (v._status === 0 || v._status === -1) && (v._status = 2, v._result = B);
        }
      ), v._status === -1 && (v._status = 0, v._result = R);
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var Z = typeof reportError == "function" ? reportError : function(v) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var R = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof v == "object" && v !== null && typeof v.message == "string" ? String(v.message) : String(v),
        error: v
      });
      if (!window.dispatchEvent(R)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", v);
      return;
    }
    console.error(v);
  };
  function Et() {
  }
  return F.Children = {
    map: w,
    forEach: function(v, R, B) {
      w(
        v,
        function() {
          R.apply(this, arguments);
        },
        B
      );
    },
    count: function(v) {
      var R = 0;
      return w(v, function() {
        R++;
      }), R;
    },
    toArray: function(v) {
      return w(v, function(R) {
        return R;
      }) || [];
    },
    only: function(v) {
      if (!xt(v))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return v;
    }
  }, F.Component = J, F.Fragment = s, F.Profiler = h, F.PureComponent = lt, F.StrictMode = r, F.Suspense = m, F.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = q, F.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(v) {
      return q.H.useMemoCache(v);
    }
  }, F.cache = function(v) {
    return function() {
      return v.apply(null, arguments);
    };
  }, F.cloneElement = function(v, R, B) {
    if (v == null)
      throw Error(
        "The argument must be a React element, but you passed " + v + "."
      );
    var j = G({}, v.props), X = v.key, ft = void 0;
    if (R != null)
      for (W in R.ref !== void 0 && (ft = void 0), R.key !== void 0 && (X = "" + R.key), R)
        !rt.call(R, W) || W === "key" || W === "__self" || W === "__source" || W === "ref" && R.ref === void 0 || (j[W] = R[W]);
    var W = arguments.length - 2;
    if (W === 1) j.children = B;
    else if (1 < W) {
      for (var ae = Array(W), Ot = 0; Ot < W; Ot++)
        ae[Ot] = arguments[Ot + 2];
      j.children = ae;
    }
    return Rt(v.type, X, void 0, void 0, ft, j);
  }, F.createContext = function(v) {
    return v = {
      $$typeof: E,
      _currentValue: v,
      _currentValue2: v,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, v.Provider = v, v.Consumer = {
      $$typeof: S,
      _context: v
    }, v;
  }, F.createElement = function(v, R, B) {
    var j, X = {}, ft = null;
    if (R != null)
      for (j in R.key !== void 0 && (ft = "" + R.key), R)
        rt.call(R, j) && j !== "key" && j !== "__self" && j !== "__source" && (X[j] = R[j]);
    var W = arguments.length - 2;
    if (W === 1) X.children = B;
    else if (1 < W) {
      for (var ae = Array(W), Ot = 0; Ot < W; Ot++)
        ae[Ot] = arguments[Ot + 2];
      X.children = ae;
    }
    if (v && v.defaultProps)
      for (j in W = v.defaultProps, W)
        X[j] === void 0 && (X[j] = W[j]);
    return Rt(v, ft, void 0, void 0, null, X);
  }, F.createRef = function() {
    return { current: null };
  }, F.forwardRef = function(v) {
    return { $$typeof: y, render: v };
  }, F.isValidElement = xt, F.lazy = function(v) {
    return {
      $$typeof: p,
      _payload: { _status: -1, _result: v },
      _init: Y
    };
  }, F.memo = function(v, R) {
    return {
      $$typeof: f,
      type: v,
      compare: R === void 0 ? null : R
    };
  }, F.startTransition = function(v) {
    var R = q.T, B = {};
    q.T = B;
    try {
      var j = v(), X = q.S;
      X !== null && X(B, j), typeof j == "object" && j !== null && typeof j.then == "function" && j.then(Et, Z);
    } catch (ft) {
      Z(ft);
    } finally {
      q.T = R;
    }
  }, F.unstable_useCacheRefresh = function() {
    return q.H.useCacheRefresh();
  }, F.use = function(v) {
    return q.H.use(v);
  }, F.useActionState = function(v, R, B) {
    return q.H.useActionState(v, R, B);
  }, F.useCallback = function(v, R) {
    return q.H.useCallback(v, R);
  }, F.useContext = function(v) {
    return q.H.useContext(v);
  }, F.useDebugValue = function() {
  }, F.useDeferredValue = function(v, R) {
    return q.H.useDeferredValue(v, R);
  }, F.useEffect = function(v, R, B) {
    var j = q.H;
    if (typeof B == "function")
      throw Error(
        "useEffect CRUD overload is not enabled in this build of React."
      );
    return j.useEffect(v, R);
  }, F.useId = function() {
    return q.H.useId();
  }, F.useImperativeHandle = function(v, R, B) {
    return q.H.useImperativeHandle(v, R, B);
  }, F.useInsertionEffect = function(v, R) {
    return q.H.useInsertionEffect(v, R);
  }, F.useLayoutEffect = function(v, R) {
    return q.H.useLayoutEffect(v, R);
  }, F.useMemo = function(v, R) {
    return q.H.useMemo(v, R);
  }, F.useOptimistic = function(v, R) {
    return q.H.useOptimistic(v, R);
  }, F.useReducer = function(v, R, B) {
    return q.H.useReducer(v, R, B);
  }, F.useRef = function(v) {
    return q.H.useRef(v);
  }, F.useState = function(v) {
    return q.H.useState(v);
  }, F.useSyncExternalStore = function(v, R, B) {
    return q.H.useSyncExternalStore(
      v,
      R,
      B
    );
  }, F.useTransition = function() {
    return q.H.useTransition();
  }, F.version = "19.1.1", F;
}
var sd;
function gr() {
  return sd || (sd = 1, ur.exports = Fv()), ur.exports;
}
var ne = gr();
const Iv = /* @__PURE__ */ Wv(ne);
var cr = { exports: {} }, Ma = {}, rr = { exports: {} }, or = {};
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
    function o(w, Y) {
      var Z = w.length;
      w.push(Y);
      t: for (; 0 < Z; ) {
        var Et = Z - 1 >>> 1, v = w[Et];
        if (0 < h(v, Y))
          w[Et] = Y, w[Z] = v, Z = Et;
        else break t;
      }
    }
    function s(w) {
      return w.length === 0 ? null : w[0];
    }
    function r(w) {
      if (w.length === 0) return null;
      var Y = w[0], Z = w.pop();
      if (Z !== Y) {
        w[0] = Z;
        t: for (var Et = 0, v = w.length, R = v >>> 1; Et < R; ) {
          var B = 2 * (Et + 1) - 1, j = w[B], X = B + 1, ft = w[X];
          if (0 > h(j, Z))
            X < v && 0 > h(ft, j) ? (w[Et] = ft, w[X] = Z, Et = X) : (w[Et] = j, w[B] = Z, Et = B);
          else if (X < v && 0 > h(ft, Z))
            w[Et] = ft, w[X] = Z, Et = X;
          else break t;
        }
      }
      return Y;
    }
    function h(w, Y) {
      var Z = w.sortIndex - Y.sortIndex;
      return Z !== 0 ? Z : w.id - Y.id;
    }
    if (z.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var S = performance;
      z.unstable_now = function() {
        return S.now();
      };
    } else {
      var E = Date, y = E.now();
      z.unstable_now = function() {
        return E.now() - y;
      };
    }
    var m = [], f = [], p = 1, _ = null, U = 3, H = !1, G = !1, k = !1, J = !1, it = typeof setTimeout == "function" ? setTimeout : null, lt = typeof clearTimeout == "function" ? clearTimeout : null, dt = typeof setImmediate != "undefined" ? setImmediate : null;
    function P(w) {
      for (var Y = s(f); Y !== null; ) {
        if (Y.callback === null) r(f);
        else if (Y.startTime <= w)
          r(f), Y.sortIndex = Y.expirationTime, o(m, Y);
        else break;
        Y = s(f);
      }
    }
    function q(w) {
      if (k = !1, P(w), !G)
        if (s(m) !== null)
          G = !0, rt || (rt = !0, _t());
        else {
          var Y = s(f);
          Y !== null && Kt(q, Y.startTime - w);
        }
    }
    var rt = !1, Rt = -1, gt = 5, xt = -1;
    function vt() {
      return J ? !0 : !(z.unstable_now() - xt < gt);
    }
    function $() {
      if (J = !1, rt) {
        var w = z.unstable_now();
        xt = w;
        var Y = !0;
        try {
          t: {
            G = !1, k && (k = !1, lt(Rt), Rt = -1), H = !0;
            var Z = U;
            try {
              e: {
                for (P(w), _ = s(m); _ !== null && !(_.expirationTime > w && vt()); ) {
                  var Et = _.callback;
                  if (typeof Et == "function") {
                    _.callback = null, U = _.priorityLevel;
                    var v = Et(
                      _.expirationTime <= w
                    );
                    if (w = z.unstable_now(), typeof v == "function") {
                      _.callback = v, P(w), Y = !0;
                      break e;
                    }
                    _ === s(m) && r(m), P(w);
                  } else r(m);
                  _ = s(m);
                }
                if (_ !== null) Y = !0;
                else {
                  var R = s(f);
                  R !== null && Kt(
                    q,
                    R.startTime - w
                  ), Y = !1;
                }
              }
              break t;
            } finally {
              _ = null, U = Z, H = !1;
            }
            Y = void 0;
          }
        } finally {
          Y ? _t() : rt = !1;
        }
      }
    }
    var _t;
    if (typeof dt == "function")
      _t = function() {
        dt($);
      };
    else if (typeof MessageChannel != "undefined") {
      var El = new MessageChannel(), Tl = El.port2;
      El.port1.onmessage = $, _t = function() {
        Tl.postMessage(null);
      };
    } else
      _t = function() {
        it($, 0);
      };
    function Kt(w, Y) {
      Rt = it(function() {
        w(z.unstable_now());
      }, Y);
    }
    z.unstable_IdlePriority = 5, z.unstable_ImmediatePriority = 1, z.unstable_LowPriority = 4, z.unstable_NormalPriority = 3, z.unstable_Profiling = null, z.unstable_UserBlockingPriority = 2, z.unstable_cancelCallback = function(w) {
      w.callback = null;
    }, z.unstable_forceFrameRate = function(w) {
      0 > w || 125 < w ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : gt = 0 < w ? Math.floor(1e3 / w) : 5;
    }, z.unstable_getCurrentPriorityLevel = function() {
      return U;
    }, z.unstable_next = function(w) {
      switch (U) {
        case 1:
        case 2:
        case 3:
          var Y = 3;
          break;
        default:
          Y = U;
      }
      var Z = U;
      U = Y;
      try {
        return w();
      } finally {
        U = Z;
      }
    }, z.unstable_requestPaint = function() {
      J = !0;
    }, z.unstable_runWithPriority = function(w, Y) {
      switch (w) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          w = 3;
      }
      var Z = U;
      U = w;
      try {
        return Y();
      } finally {
        U = Z;
      }
    }, z.unstable_scheduleCallback = function(w, Y, Z) {
      var Et = z.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? Et + Z : Et) : Z = Et, w) {
        case 1:
          var v = -1;
          break;
        case 2:
          v = 250;
          break;
        case 5:
          v = 1073741823;
          break;
        case 4:
          v = 1e4;
          break;
        default:
          v = 5e3;
      }
      return v = Z + v, w = {
        id: p++,
        callback: Y,
        priorityLevel: w,
        startTime: Z,
        expirationTime: v,
        sortIndex: -1
      }, Z > Et ? (w.sortIndex = Z, o(f, w), s(m) === null && w === s(f) && (k ? (lt(Rt), Rt = -1) : k = !0, Kt(q, Z - Et))) : (w.sortIndex = v, o(m, w), G || H || (G = !0, rt || (rt = !0, _t()))), w;
    }, z.unstable_shouldYield = vt, z.unstable_wrapCallback = function(w) {
      var Y = U;
      return function() {
        var Z = U;
        U = Y;
        try {
          return w.apply(this, arguments);
        } finally {
          U = Z;
        }
      };
    };
  }(or)), or;
}
var hd;
function t0() {
  return hd || (hd = 1, rr.exports = Pv()), rr.exports;
}
var fr = { exports: {} }, Wt = {};
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
  function o(m) {
    var f = "https://react.dev/errors/" + m;
    if (1 < arguments.length) {
      f += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var p = 2; p < arguments.length; p++)
        f += "&args[]=" + encodeURIComponent(arguments[p]);
    }
    return "Minified React error #" + m + "; visit " + f + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
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
  }, h = Symbol.for("react.portal");
  function S(m, f, p) {
    var _ = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: h,
      key: _ == null ? null : "" + _,
      children: m,
      containerInfo: f,
      implementation: p
    };
  }
  var E = z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function y(m, f) {
    if (m === "font") return "";
    if (typeof f == "string")
      return f === "use-credentials" ? f : "";
  }
  return Wt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, Wt.createPortal = function(m, f) {
    var p = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!f || f.nodeType !== 1 && f.nodeType !== 9 && f.nodeType !== 11)
      throw Error(o(299));
    return S(m, f, null, p);
  }, Wt.flushSync = function(m) {
    var f = E.T, p = r.p;
    try {
      if (E.T = null, r.p = 2, m) return m();
    } finally {
      E.T = f, r.p = p, r.d.f();
    }
  }, Wt.preconnect = function(m, f) {
    typeof m == "string" && (f ? (f = f.crossOrigin, f = typeof f == "string" ? f === "use-credentials" ? f : "" : void 0) : f = null, r.d.C(m, f));
  }, Wt.prefetchDNS = function(m) {
    typeof m == "string" && r.d.D(m);
  }, Wt.preinit = function(m, f) {
    if (typeof m == "string" && f && typeof f.as == "string") {
      var p = f.as, _ = y(p, f.crossOrigin), U = typeof f.integrity == "string" ? f.integrity : void 0, H = typeof f.fetchPriority == "string" ? f.fetchPriority : void 0;
      p === "style" ? r.d.S(
        m,
        typeof f.precedence == "string" ? f.precedence : void 0,
        {
          crossOrigin: _,
          integrity: U,
          fetchPriority: H
        }
      ) : p === "script" && r.d.X(m, {
        crossOrigin: _,
        integrity: U,
        fetchPriority: H,
        nonce: typeof f.nonce == "string" ? f.nonce : void 0
      });
    }
  }, Wt.preinitModule = function(m, f) {
    if (typeof m == "string")
      if (typeof f == "object" && f !== null) {
        if (f.as == null || f.as === "script") {
          var p = y(
            f.as,
            f.crossOrigin
          );
          r.d.M(m, {
            crossOrigin: p,
            integrity: typeof f.integrity == "string" ? f.integrity : void 0,
            nonce: typeof f.nonce == "string" ? f.nonce : void 0
          });
        }
      } else f == null && r.d.M(m);
  }, Wt.preload = function(m, f) {
    if (typeof m == "string" && typeof f == "object" && f !== null && typeof f.as == "string") {
      var p = f.as, _ = y(p, f.crossOrigin);
      r.d.L(m, p, {
        crossOrigin: _,
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
  }, Wt.preloadModule = function(m, f) {
    if (typeof m == "string")
      if (f) {
        var p = y(f.as, f.crossOrigin);
        r.d.m(m, {
          as: typeof f.as == "string" && f.as !== "script" ? f.as : void 0,
          crossOrigin: p,
          integrity: typeof f.integrity == "string" ? f.integrity : void 0
        });
      } else r.d.m(m);
  }, Wt.requestFormReset = function(m) {
    r.d.r(m);
  }, Wt.unstable_batchedUpdates = function(m, f) {
    return m(f);
  }, Wt.useFormState = function(m, f, p) {
    return E.H.useFormState(m, f, p);
  }, Wt.useFormStatus = function() {
    return E.H.useHostTransitionStatus();
  }, Wt.version = "19.1.1", Wt;
}
var gd;
function l0() {
  if (gd) return fr.exports;
  gd = 1;
  function z() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z);
      } catch (o) {
        console.error(o);
      }
  }
  return z(), fr.exports = e0(), fr.exports;
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
  if (yd) return Ma;
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
  function h(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function S(t) {
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
  function E(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function y(t) {
    if (S(t) !== t)
      throw Error(r(188));
  }
  function m(t) {
    var e = t.alternate;
    if (!e) {
      if (e = S(t), e === null) throw Error(r(188));
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
          if (i === l) return y(a), t;
          if (i === n) return y(a), e;
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
  var p = Object.assign, _ = Symbol.for("react.element"), U = Symbol.for("react.transitional.element"), H = Symbol.for("react.portal"), G = Symbol.for("react.fragment"), k = Symbol.for("react.strict_mode"), J = Symbol.for("react.profiler"), it = Symbol.for("react.provider"), lt = Symbol.for("react.consumer"), dt = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), q = Symbol.for("react.suspense"), rt = Symbol.for("react.suspense_list"), Rt = Symbol.for("react.memo"), gt = Symbol.for("react.lazy"), xt = Symbol.for("react.activity"), vt = Symbol.for("react.memo_cache_sentinel"), $ = Symbol.iterator;
  function _t(t) {
    return t === null || typeof t != "object" ? null : (t = $ && t[$] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var El = Symbol.for("react.client.reference");
  function Tl(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === El ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case G:
        return "Fragment";
      case J:
        return "Profiler";
      case k:
        return "StrictMode";
      case q:
        return "Suspense";
      case rt:
        return "SuspenseList";
      case xt:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case H:
          return "Portal";
        case dt:
          return (t.displayName || "Context") + ".Provider";
        case lt:
          return (t._context.displayName || "Context") + ".Consumer";
        case P:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case Rt:
          return e = t.displayName || null, e !== null ? e : Tl(t.type) || "Memo";
        case gt:
          e = t._payload, t = t._init;
          try {
            return Tl(t(e));
          } catch (l) {
          }
      }
    return null;
  }
  var Kt = Array.isArray, w = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Et = [], v = -1;
  function R(t) {
    return { current: t };
  }
  function B(t) {
    0 > v || (t.current = Et[v], Et[v] = null, v--);
  }
  function j(t, e) {
    v++, Et[v] = t.current, t.current = e;
  }
  var X = R(null), ft = R(null), W = R(null), ae = R(null);
  function Ot(t, e) {
    switch (j(W, e), j(ft, t), j(X, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? Bs(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = Bs(e), t = Vs(e, t);
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
  function $e() {
    B(X), B(ft), B(W);
  }
  function Qi(t) {
    t.memoizedState !== null && j(ae, t);
    var e = X.current, l = Vs(e, t.type);
    e !== l && (j(ft, t), j(X, l));
  }
  function _a(t) {
    ft.current === t && (B(X), B(ft)), ae.current === t && (B(ae), Ea._currentValue = Z);
  }
  var Zi = Object.prototype.hasOwnProperty, Ki = z.unstable_scheduleCallback, Ji = z.unstable_cancelCallback, wd = z.unstable_shouldYield, Dd = z.unstable_requestPaint, Me = z.unstable_now, _d = z.unstable_getCurrentPriorityLevel, yr = z.unstable_ImmediatePriority, pr = z.unstable_UserBlockingPriority, Na = z.unstable_NormalPriority, Nd = z.unstable_LowPriority, mr = z.unstable_IdlePriority, Ud = z.log, Rd = z.unstable_setDisableYieldValue, _n = null, ie = null;
  function We(t) {
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
    var c = t.entanglements, d = t.expirationTimes, T = t.hiddenUpdates;
    for (l = u & ~l; 0 < l; ) {
      var M = 31 - ue(l), N = 1 << M;
      c[M] = 0, d[M] = -1;
      var A = T[M];
      if (A !== null)
        for (T[M] = null, M = 0; M < A.length; M++) {
          var O = A[M];
          O !== null && (O.lane &= -536870913);
        }
      l &= ~N;
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
  function Vd(t, e) {
    var l = Y.p;
    try {
      return Y.p = t, e();
    } finally {
      Y.p = l;
    }
  }
  var Fe = Math.random().toString(36).slice(2), Jt = "__reactFiber$" + Fe, It = "__reactProps$" + Fe, Ll = "__reactContainer$" + Fe, Ii = "__reactEvents$" + Fe, Cd = "__reactListeners$" + Fe, Gd = "__reactHandles$" + Fe, Ar = "__reactResources$" + Fe, Rn = "__reactMarker$" + Fe;
  function Pi(t) {
    delete t[Jt], delete t[It], delete t[Ii], delete t[Cd], delete t[Gd];
  }
  function Ql(t) {
    var e = t[Jt];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if (e = l[Ll] || l[Jt]) {
        if (l = e.alternate, e.child !== null || l !== null && l.child !== null)
          for (t = Xs(t); t !== null; ) {
            if (l = t[Jt]) return l;
            t = Xs(t);
          }
        return e;
      }
      t = l, l = t.parentNode;
    }
    return null;
  }
  function Zl(t) {
    if (t = t[Jt] || t[Ll]) {
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
  function Vt(t) {
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
  var kd = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Mr = {}, wr = {};
  function Xd(t) {
    return Zi.call(wr, t) ? !0 : Zi.call(Mr, t) ? !1 : kd.test(t) ? wr[t] = !0 : (Mr[t] = !0, !1);
  }
  function qa(t, e, l) {
    if (Xd(e))
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
  function He(t, e, l, n) {
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
              var N = function() {
                throw Error();
              };
              if (Object.defineProperty(N.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(N, []);
                } catch (O) {
                  var A = O;
                }
                Reflect.construct(t, [], N);
              } else {
                try {
                  N.call();
                } catch (O) {
                  A = O;
                }
                t.call(N.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (O) {
                A = O;
              }
              (N = t()) && typeof N.catch == "function" && N.catch(function() {
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
`), T = c.split(`
`);
        for (a = n = 0; n < d.length && !d[n].includes("DetermineComponentFrameRoot"); )
          n++;
        for (; a < T.length && !T[a].includes(
          "DetermineComponentFrameRoot"
        ); )
          a++;
        if (n === d.length || a === T.length)
          for (n = d.length - 1, a = T.length - 1; 1 <= n && 0 <= a && d[n] !== T[a]; )
            a--;
        for (; 1 <= n && 0 <= a; n--, a--)
          if (d[n] !== T[a]) {
            if (n !== 1 || a !== 1)
              do
                if (n--, a--, 0 > a || d[n] !== T[a]) {
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
  function Ld(t) {
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
        e += Ld(t), t = t.return;
      while (t);
      return e;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  function ve(t) {
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
  function ge(t) {
    return t.replace(
      Zd,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function nu(t, e, l, n, a, i, u, c) {
    t.name = "", u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" ? t.type = u : t.removeAttribute("type"), e != null ? u === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + ve(e)) : t.value !== "" + ve(e) && (t.value = "" + ve(e)) : u !== "submit" && u !== "reset" || t.removeAttribute("value"), e != null ? au(t, u, ve(e)) : l != null ? au(t, u, ve(l)) : n != null && t.removeAttribute("value"), a == null && i != null && (t.defaultChecked = !!i), a != null && (t.checked = a && typeof a != "function" && typeof a != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.name = "" + ve(c) : t.removeAttribute("name");
  }
  function Rr(t, e, l, n, a, i, u, c) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (t.type = i), e != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || e != null))
        return;
      l = l != null ? "" + ve(l) : "", e = e != null ? "" + ve(e) : l, c || e === t.value || (t.value = e), t.defaultValue = e;
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
      for (l = "" + ve(l), e = null, a = 0; a < t.length; a++) {
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
    if (e != null && (e = "" + ve(e), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? "" + ve(l) : "";
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
    l = ve(e), t.defaultValue = l, n = t.textContent, n === l && n !== "" && n !== null && (t.value = n);
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
  function Va(t) {
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
              'input[name="' + ge(
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
  function Vr(t, e, l) {
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
  var qe = !(typeof window == "undefined" || typeof window.document == "undefined" || typeof window.document.createElement == "undefined"), ou = !1;
  if (qe)
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
  var Ie = null, fu = null, Ca = null;
  function Cr() {
    if (Ca) return Ca;
    var t, e = fu, l = e.length, n, a = "value" in Ie ? Ie.value : Ie.textContent, i = a.length;
    for (t = 0; t < l && e[t] === a[t]; t++) ;
    var u = l - t;
    for (n = 1; n <= u && e[l - n] === a[i - n]; n++) ;
    return Ca = a.slice(t, 1 < n ? 1 - n : void 0);
  }
  function Ga(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function ka() {
    return !0;
  }
  function Gr() {
    return !1;
  }
  function Pt(t) {
    function e(l, n, a, i, u) {
      this._reactName = l, this._targetInst = a, this.type = n, this.nativeEvent = i, this.target = u, this.currentTarget = null;
      for (var c in t)
        t.hasOwnProperty(c) && (l = t[c], this[c] = l ? l(i) : i[c]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? ka : Gr, this.isPropagationStopped = Gr, this;
    }
    return p(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = ka);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = ka);
      },
      persist: function() {
      },
      isPersistent: ka
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
  }, Xa = Pt(zl), Yn = p({}, zl, { view: 0, detail: 0 }), Wd = Pt(Yn), su, du, Bn, La = p({}, Yn, {
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
      return "movementX" in t ? t.movementX : (t !== Bn && (Bn && t.type === "mousemove" ? (su = t.screenX - Bn.screenX, du = t.screenY - Bn.screenY) : du = su = 0, Bn = t), su);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : du;
    }
  }), kr = Pt(La), Fd = p({}, La, { dataTransfer: 0 }), Id = Pt(Fd), Pd = p({}, Yn, { relatedTarget: 0 }), hu = Pt(Pd), th = p({}, zl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), eh = Pt(th), lh = p({}, zl, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), nh = Pt(lh), ah = p({}, zl, { data: 0 }), Xr = Pt(ah), ih = {
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
  var oh = p({}, Yn, {
    key: function(t) {
      if (t.key) {
        var e = ih[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = Ga(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? uh[t.keyCode] || "Unidentified" : "";
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
      return t.type === "keypress" ? Ga(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? Ga(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), fh = Pt(oh), sh = p({}, La, {
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
  }), Lr = Pt(sh), dh = p({}, Yn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: vu
  }), hh = Pt(dh), vh = p({}, zl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), gh = Pt(vh), yh = p({}, La, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), ph = Pt(yh), mh = p({}, zl, {
    newState: 0,
    oldState: 0
  }), bh = Pt(mh), Sh = [9, 13, 27, 32], gu = qe && "CompositionEvent" in window, Vn = null;
  qe && "documentMode" in document && (Vn = document.documentMode);
  var xh = qe && "TextEvent" in window && !Vn, Qr = qe && (!gu || Vn && 8 < Vn && 11 >= Vn), Zr = " ", Kr = !1;
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
      return t === "compositionend" || !gu && Jr(t, e) ? (t = Cr(), Ca = fu = Ie = null, tn = !1, t) : null;
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
    Il ? Pl ? Pl.push(n) : Pl = [n] : Il = n, e = _i(e, "onChange"), 0 < e.length && (l = new Xa(
      "onChange",
      "change",
      null,
      l,
      n
    ), t.push({ event: l, listeners: e }));
  }
  var Cn = null, Gn = null;
  function Oh(t) {
    Rs(t, 0);
  }
  function Qa(t) {
    var e = Hn(t);
    if (Ur(e)) return t;
  }
  function Ir(t, e) {
    if (t === "change") return e;
  }
  var Pr = !1;
  if (qe) {
    var yu;
    if (qe) {
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
    Cn && (Cn.detachEvent("onpropertychange", lo), Gn = Cn = null);
  }
  function lo(t) {
    if (t.propertyName === "value" && Qa(Gn)) {
      var e = [];
      Fr(
        e,
        Gn,
        t,
        cu(t)
      ), Vr(Oh, e);
    }
  }
  function zh(t, e, l) {
    t === "focusin" ? (eo(), Cn = e, Gn = l, Cn.attachEvent("onpropertychange", lo)) : t === "focusout" && eo();
  }
  function Mh(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Qa(Gn);
  }
  function wh(t, e) {
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
  function kn(t, e) {
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
  var Nh = qe && "documentMode" in document && 11 >= document.documentMode, en = null, bu = null, Xn = null, Su = !1;
  function co(t, e, l) {
    var n = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Su || en == null || en !== Ba(n) || (n = en, "selectionStart" in n && mu(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = {
      anchorNode: n.anchorNode,
      anchorOffset: n.anchorOffset,
      focusNode: n.focusNode,
      focusOffset: n.focusOffset
    }), Xn && kn(Xn, n) || (Xn = n, n = _i(bu, "onSelect"), 0 < n.length && (e = new Xa(
      "onSelect",
      "select",
      null,
      e,
      l
    ), t.push({ event: e, listeners: n }), e.target = en)));
  }
  function Ml(t, e) {
    var l = {};
    return l[t.toLowerCase()] = e.toLowerCase(), l["Webkit" + t] = "webkit" + e, l["Moz" + t] = "moz" + e, l;
  }
  var ln = {
    animationend: Ml("Animation", "AnimationEnd"),
    animationiteration: Ml("Animation", "AnimationIteration"),
    animationstart: Ml("Animation", "AnimationStart"),
    transitionrun: Ml("Transition", "TransitionRun"),
    transitionstart: Ml("Transition", "TransitionStart"),
    transitioncancel: Ml("Transition", "TransitionCancel"),
    transitionend: Ml("Transition", "TransitionEnd")
  }, xu = {}, ro = {};
  qe && (ro = document.createElement("div").style, "AnimationEvent" in window || (delete ln.animationend.animation, delete ln.animationiteration.animation, delete ln.animationstart.animation), "TransitionEvent" in window || delete ln.transitionend.transition);
  function wl(t) {
    if (xu[t]) return xu[t];
    if (!ln[t]) return t;
    var e = ln[t], l;
    for (l in e)
      if (e.hasOwnProperty(l) && l in ro)
        return xu[t] = e[l];
    return t;
  }
  var oo = wl("animationend"), fo = wl("animationiteration"), so = wl("animationstart"), Uh = wl("transitionrun"), Rh = wl("transitionstart"), Hh = wl("transitioncancel"), ho = wl("transitionend"), vo = /* @__PURE__ */ new Map(), Eu = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Eu.push("scrollEnd");
  function Te(t, e) {
    vo.set(t, e), Ol(e, [t]);
  }
  var go = /* @__PURE__ */ new WeakMap();
  function ye(t, e) {
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
  var pe = [], nn = 0, Tu = 0;
  function Za() {
    for (var t = nn, e = Tu = nn = 0; e < t; ) {
      var l = pe[e];
      pe[e++] = null;
      var n = pe[e];
      pe[e++] = null;
      var a = pe[e];
      pe[e++] = null;
      var i = pe[e];
      if (pe[e++] = null, n !== null && a !== null) {
        var u = n.pending;
        u === null ? a.next = a : (a.next = u.next, u.next = a), n.pending = a;
      }
      i !== 0 && yo(l, a, i);
    }
  }
  function Ka(t, e, l, n) {
    pe[nn++] = t, pe[nn++] = e, pe[nn++] = l, pe[nn++] = n, Tu |= n, t.lanes |= n, t = t.alternate, t !== null && (t.lanes |= n);
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
  function je(t, e) {
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
        case xt:
          return t = re(31, l, e, a), t.elementType = xt, t.lanes = i, t;
        case G:
          return Dl(l.children, a, i, e);
        case k:
          u = 8, a |= 24;
          break;
        case J:
          return t = re(12, l, e, a | 2), t.elementType = J, t.lanes = i, t;
        case q:
          return t = re(13, l, e, a), t.elementType = q, t.lanes = i, t;
        case rt:
          return t = re(19, l, e, a), t.elementType = rt, t.lanes = i, t;
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case it:
              case dt:
                u = 10;
                break t;
              case lt:
                u = 9;
                break t;
              case P:
                u = 11;
                break t;
              case Rt:
                u = 14;
                break t;
              case gt:
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
  function Mu(t, e, l) {
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
  var cn = [], rn = 0, Wa = null, Fa = 0, me = [], be = 0, _l = null, Ye = 1, Be = "";
  function Nl(t, e) {
    cn[rn++] = Fa, cn[rn++] = Wa, Wa = t, Fa = e;
  }
  function mo(t, e, l) {
    me[be++] = Ye, me[be++] = Be, me[be++] = _l, _l = t;
    var n = Ye;
    t = Be;
    var a = 32 - ue(n) - 1;
    n &= ~(1 << a), l += 1;
    var i = 32 - ue(e) + a;
    if (30 < i) {
      var u = a - a % 5;
      i = (n & (1 << u) - 1).toString(32), n >>= u, a -= u, Ye = 1 << 32 - ue(e) + a | l << a | n, Be = i + t;
    } else
      Ye = 1 << i | l << a | n, Be = t;
  }
  function wu(t) {
    t.return !== null && (Nl(t, 1), mo(t, 1, 0));
  }
  function Du(t) {
    for (; t === Wa; )
      Wa = cn[--rn], cn[rn] = null, Fa = cn[--rn], cn[rn] = null;
    for (; t === _l; )
      _l = me[--be], me[be] = null, Be = me[--be], me[be] = null, Ye = me[--be], me[be] = null;
  }
  var Ft = null, wt = null, ht = !1, Ul = null, we = !1, _u = Error(r(519));
  function Rl(t) {
    var e = Error(r(418, ""));
    throw Zn(ye(e, t)), _u;
  }
  function bo(t) {
    var e = t.stateNode, l = t.type, n = t.memoizedProps;
    switch (e[Jt] = t, e[It] = n, l) {
      case "dialog":
        at("cancel", e), at("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        at("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < ya.length; l++)
          at(ya[l], e);
        break;
      case "source":
        at("error", e);
        break;
      case "img":
      case "image":
      case "link":
        at("error", e), at("load", e);
        break;
      case "details":
        at("toggle", e);
        break;
      case "input":
        at("invalid", e), Rr(
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
        at("invalid", e);
        break;
      case "textarea":
        at("invalid", e), qr(e, n.value, n.defaultValue, n.children), Ya(e);
    }
    l = n.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || e.textContent === "" + l || n.suppressHydrationWarning === !0 || Ys(e.textContent, l) ? (n.popover != null && (at("beforetoggle", e), at("toggle", e)), n.onScroll != null && at("scroll", e), n.onScrollEnd != null && at("scrollend", e), n.onClick != null && (e.onclick = Ni), e = !0) : e = !1, e || Rl(t);
  }
  function So(t) {
    for (Ft = t.return; Ft; )
      switch (Ft.tag) {
        case 5:
        case 13:
          we = !1;
          return;
        case 27:
        case 3:
          we = !0;
          return;
        default:
          Ft = Ft.return;
      }
  }
  function Ln(t) {
    if (t !== Ft) return !1;
    if (!ht) return So(t), ht = !0, !1;
    var e = t.tag, l;
    if ((l = e !== 3 && e !== 27) && ((l = e === 5) && (l = t.type, l = !(l !== "form" && l !== "button") || Zc(t.type, t.memoizedProps)), l = !l), l && wt && Rl(t), So(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (l = t.data, l === "/$") {
              if (e === 0) {
                wt = Oe(t.nextSibling);
                break t;
              }
              e--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || e++;
          t = t.nextSibling;
        }
        wt = null;
      }
    } else
      e === 27 ? (e = wt, vl(t.type) ? (t = Wc, Wc = null, wt = t) : wt = e) : wt = Ft ? Oe(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Qn() {
    wt = Ft = null, ht = !1;
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
  var Nu = R(null), Hl = null, Ve = null;
  function Pe(t, e, l) {
    j(Nu, e._currentValue), e._currentValue = l;
  }
  function Ce(t) {
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
    Hl = t, Ve = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function $t(t) {
    return Eo(Hl, t);
  }
  function Pa(t, e) {
    return Hl === null && ql(t), Eo(t, e);
  }
  function Eo(t, e) {
    var l = e._currentValue;
    if (e = { context: e, memoizedValue: l, next: null }, Ve === null) {
      if (t === null) throw Error(r(308));
      Ve = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else Ve = Ve.next = e;
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
  }, Yh = z.unstable_scheduleCallback, Bh = z.unstable_NormalPriority, Yt = {
    $$typeof: dt,
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
  var $n = null, qu = 0, on = 0, fn = null;
  function Vh(t, e) {
    if ($n === null) {
      var l = $n = [];
      qu = 0, on = Yc(), fn = {
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
      fn !== null && (fn.status = "fulfilled");
      var t = $n;
      $n = null, on = 0, fn = null;
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
  var Ao = w.S;
  w.S = function(t, e) {
    typeof e == "object" && e !== null && typeof e.then == "function" && Vh(t, e), Ao !== null && Ao(t, e);
  };
  var jl = R(null);
  function ju() {
    var t = jl.current;
    return t !== null ? t : At.pooledCache;
  }
  function ti(t, e) {
    e === null ? j(jl, jl.current) : j(jl, e.pool);
  }
  function Oo() {
    var t = ju();
    return t === null ? null : { parent: Yt._currentValue, pool: t };
  }
  var Wn = Error(r(460)), zo = Error(r(474)), ei = Error(r(542)), Yu = { then: function() {
  } };
  function Mo(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function li() {
  }
  function wo(t, e, l) {
    switch (l = t[l], l === void 0 ? t.push(e) : l !== e && (e.then(li, li), e = l), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, _o(t), t;
      default:
        if (typeof e.status == "string") e.then(li, li);
        else {
          if (t = At, t !== null && 100 < t.shellSuspendCounter)
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
  var tl = !1;
  function Bu(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Vu(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function el(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ll(t, e, l) {
    var n = t.updateQueue;
    if (n === null) return null;
    if (n = n.shared, (yt & 2) !== 0) {
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
  var Gu = !1;
  function Pn() {
    if (Gu) {
      var t = fn;
      if (t !== null) throw t;
    }
  }
  function ta(t, e, l, n) {
    Gu = !1;
    var a = t.updateQueue;
    tl = !1;
    var i = a.firstBaseUpdate, u = a.lastBaseUpdate, c = a.shared.pending;
    if (c !== null) {
      a.shared.pending = null;
      var d = c, T = d.next;
      d.next = null, u === null ? i = T : u.next = T, u = d;
      var M = t.alternate;
      M !== null && (M = M.updateQueue, c = M.lastBaseUpdate, c !== u && (c === null ? M.firstBaseUpdate = T : c.next = T, M.lastBaseUpdate = d));
    }
    if (i !== null) {
      var N = a.baseState;
      u = 0, M = T = d = null, c = i;
      do {
        var A = c.lane & -536870913, O = A !== c.lane;
        if (O ? (ut & A) === A : (n & A) === A) {
          A !== 0 && A === on && (Gu = !0), M !== null && (M = M.next = {
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: null,
            next: null
          });
          t: {
            var K = t, L = c;
            A = e;
            var St = l;
            switch (L.tag) {
              case 1:
                if (K = L.payload, typeof K == "function") {
                  N = K.call(St, N, A);
                  break t;
                }
                N = K;
                break t;
              case 3:
                K.flags = K.flags & -65537 | 128;
              case 0:
                if (K = L.payload, A = typeof K == "function" ? K.call(St, N, A) : K, A == null) break t;
                N = p({}, N, A);
                break t;
              case 2:
                tl = !0;
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
          }, M === null ? (T = M = O, d = N) : M = M.next = O, u |= A;
        if (c = c.next, c === null) {
          if (c = a.shared.pending, c === null)
            break;
          O = c, c = O.next, O.next = null, a.lastBaseUpdate = O, a.shared.pending = null;
        }
      } while (!0);
      M === null && (d = N), a.baseState = d, a.firstBaseUpdate = T, a.lastBaseUpdate = M, i === null && (a.shared.lanes = 0), fl |= u, t.lanes = u, t.memoizedState = N;
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
  var sn = R(null), ni = R(0);
  function Ro(t, e) {
    t = Ke, j(ni, t), j(sn, e), Ke = t | e.baseLanes;
  }
  function ku() {
    j(ni, Ke), j(sn, sn.current);
  }
  function Xu() {
    Ke = ni.current, B(sn), B(ni);
  }
  var nl = 0, tt = null, mt = null, Ht = null, ai = !1, dn = !1, Yl = !1, ii = 0, ea = 0, hn = null, Gh = 0;
  function Nt() {
    throw Error(r(321));
  }
  function Lu(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++)
      if (!ce(t[l], e[l])) return !1;
    return !0;
  }
  function Qu(t, e, l, n, a, i) {
    return nl = i, tt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, w.H = t === null || t.memoizedState === null ? pf : mf, Yl = !1, i = l(n, a), Yl = !1, dn && (i = qo(
      e,
      l,
      n,
      a
    )), Ho(t), i;
  }
  function Ho(t) {
    w.H = si;
    var e = mt !== null && mt.next !== null;
    if (nl = 0, Ht = mt = tt = null, ai = !1, ea = 0, hn = null, e) throw Error(r(300));
    t === null || Ct || (t = t.dependencies, t !== null && Ia(t) && (Ct = !0));
  }
  function qo(t, e, l, n) {
    tt = t;
    var a = 0;
    do {
      if (dn && (hn = null), ea = 0, dn = !1, 25 <= a) throw Error(r(301));
      if (a += 1, Ht = mt = null, t.updateQueue != null) {
        var i = t.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      w.H = Jh, i = e(l, n);
    } while (dn);
    return i;
  }
  function kh() {
    var t = w.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? la(e) : e, t = t.useState()[0], (mt !== null ? mt.memoizedState : null) !== t && (tt.flags |= 1024), e;
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
    nl = 0, Ht = mt = tt = null, dn = !1, ea = ii = 0, hn = null;
  }
  function te() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ht === null ? tt.memoizedState = Ht = t : Ht = Ht.next = t, Ht;
  }
  function qt() {
    if (mt === null) {
      var t = tt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = mt.next;
    var e = Ht === null ? tt.memoizedState : Ht.next;
    if (e !== null)
      Ht = e, mt = t;
    else {
      if (t === null)
        throw tt.alternate === null ? Error(r(467)) : Error(r(310));
      mt = t, t = {
        memoizedState: mt.memoizedState,
        baseState: mt.baseState,
        baseQueue: mt.baseQueue,
        queue: mt.queue,
        next: null
      }, Ht === null ? tt.memoizedState = Ht = t : Ht = Ht.next = t;
    }
    return Ht;
  }
  function $u() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function la(t) {
    var e = ea;
    return ea += 1, hn === null && (hn = []), t = wo(hn, t, e), e = tt, (Ht === null ? e.memoizedState : Ht.next) === null && (e = e.alternate, w.H = e === null || e.memoizedState === null ? pf : mf), t;
  }
  function ui(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return la(t);
      if (t.$$typeof === dt) return $t(t);
    }
    throw Error(r(438, String(t)));
  }
  function Wu(t) {
    var e = null, l = tt.updateQueue;
    if (l !== null && (e = l.memoCache), e == null) {
      var n = tt.alternate;
      n !== null && (n = n.updateQueue, n !== null && (n = n.memoCache, n != null && (e = {
        data: n.data.map(function(a) {
          return a.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), l === null && (l = $u(), tt.updateQueue = l), l.memoCache = e, l = e.data[e.index], l === void 0)
      for (l = e.data[e.index] = Array(t), n = 0; n < t; n++)
        l[n] = vt;
    return e.index++, l;
  }
  function Ge(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function ci(t) {
    var e = qt();
    return Fu(e, mt, t);
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
      var c = u = null, d = null, T = e, M = !1;
      do {
        var N = T.lane & -536870913;
        if (N !== T.lane ? (ut & N) === N : (nl & N) === N) {
          var A = T.revertLane;
          if (A === 0)
            d !== null && (d = d.next = {
              lane: 0,
              revertLane: 0,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }), N === on && (M = !0);
          else if ((nl & A) === A) {
            T = T.next, A === on && (M = !0);
            continue;
          } else
            N = {
              lane: 0,
              revertLane: T.revertLane,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }, d === null ? (c = d = N, u = i) : d = d.next = N, tt.lanes |= A, fl |= A;
          N = T.action, Yl && l(i, N), i = T.hasEagerState ? T.eagerState : l(i, N);
        } else
          A = {
            lane: N,
            revertLane: T.revertLane,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null
          }, d === null ? (c = d = A, u = i) : d = d.next = A, tt.lanes |= N, fl |= N;
        T = T.next;
      } while (T !== null && T !== e);
      if (d === null ? u = i : d.next = c, !ce(i, t.memoizedState) && (Ct = !0, M && (l = fn, l !== null)))
        throw l;
      t.memoizedState = i, t.baseState = u, t.baseQueue = d, n.lastRenderedState = i;
    }
    return a === null && (n.lanes = 0), [t.memoizedState, n.dispatch];
  }
  function Iu(t) {
    var e = qt(), l = e.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = t;
    var n = l.dispatch, a = l.pending, i = e.memoizedState;
    if (a !== null) {
      l.pending = null;
      var u = a = a.next;
      do
        i = t(i, u.action), u = u.next;
      while (u !== a);
      ce(i, e.memoizedState) || (Ct = !0), e.memoizedState = i, e.baseQueue === null && (e.baseState = i), l.lastRenderedState = i;
    }
    return [i, n];
  }
  function jo(t, e, l) {
    var n = tt, a = qt(), i = ht;
    if (i) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = e();
    var u = !ce(
      (mt || a).memoizedState,
      l
    );
    u && (a.memoizedState = l, Ct = !0), a = a.queue;
    var c = Vo.bind(null, n, a, t);
    if (na(2048, 8, c, [t]), a.getSnapshot !== e || u || Ht !== null && Ht.memoizedState.tag & 1) {
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
      ), At === null) throw Error(r(349));
      i || (nl & 124) !== 0 || Yo(n, e, l);
    }
    return l;
  }
  function Yo(t, e, l) {
    t.flags |= 16384, t = { getSnapshot: e, value: l }, e = tt.updateQueue, e === null ? (e = $u(), tt.updateQueue = e, e.stores = [t]) : (l = e.stores, l === null ? e.stores = [t] : l.push(t));
  }
  function Bo(t, e, l, n) {
    e.value = l, e.getSnapshot = n, Co(e) && Go(t);
  }
  function Vo(t, e, l) {
    return l(function() {
      Co(e) && Go(t);
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
  function Go(t) {
    var e = an(t, 2);
    e !== null && he(e, t, 2);
  }
  function Pu(t) {
    var e = te();
    if (typeof t == "function") {
      var l = t;
      if (t = l(), Yl) {
        We(!0);
        try {
          l();
        } finally {
          We(!1);
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
  function ko(t, e, l, n) {
    return t.baseState = l, Fu(
      t,
      mt,
      typeof n == "function" ? n : Ge
    );
  }
  function Xh(t, e, l, n, a) {
    if (fi(t)) throw Error(r(485));
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
      w.T !== null ? l(!0) : i.isTransition = !1, n(i), l = e.pending, l === null ? (i.next = e.pending = i, Xo(e, i)) : (i.next = l.next, e.pending = l.next = i);
    }
  }
  function Xo(t, e) {
    var l = e.action, n = e.payload, a = t.state;
    if (e.isTransition) {
      var i = w.T, u = {};
      w.T = u;
      try {
        var c = l(a, n), d = w.S;
        d !== null && d(u, c), Lo(t, e, c);
      } catch (T) {
        tc(t, e, T);
      } finally {
        w.T = i;
      }
    } else
      try {
        i = l(a, n), Lo(t, e, i);
      } catch (T) {
        tc(t, e, T);
      }
  }
  function Lo(t, e, l) {
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
    e.status = "fulfilled", e.value = l, Zo(e), t.state = l, e = t.pending, e !== null && (l = e.next, l === e ? t.pending = null : (l = l.next, e.next = l, Xo(t, l)));
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
    if (ht) {
      var l = At.formState;
      if (l !== null) {
        t: {
          var n = tt;
          if (ht) {
            if (wt) {
              e: {
                for (var a = wt, i = we; a.nodeType !== 8; ) {
                  if (!i) {
                    a = null;
                    break e;
                  }
                  if (a = Oe(
                    a.nextSibling
                  ), a === null) {
                    a = null;
                    break e;
                  }
                }
                i = a.data, a = i === "F!" || i === "F" ? a : null;
              }
              if (a) {
                wt = Oe(
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
    }, l.queue = n, l = vf.bind(
      null,
      tt,
      n
    ), n.dispatch = l, n = Pu(!1), i = ic.bind(
      null,
      tt,
      !1,
      n.queue
    ), n = te(), a = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, n.queue = a, l = Xh.bind(
      null,
      tt,
      a,
      i,
      l
    ), a.dispatch = l, n.memoizedState = t, [e, l, !1];
  }
  function $o(t) {
    var e = qt();
    return Wo(e, mt, t);
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
    e = qt();
    var a = e.queue, i = a.dispatch;
    return l !== e.memoizedState && (tt.flags |= 2048, vn(
      9,
      ri(),
      Lh.bind(null, a, l),
      null
    )), [n, i, t];
  }
  function Lh(t, e) {
    t.action = e;
  }
  function Fo(t) {
    var e = qt(), l = mt;
    if (l !== null)
      return Wo(e, l, t);
    qt(), e = e.memoizedState, l = qt();
    var n = l.queue.dispatch;
    return l.memoizedState = t, [e, n, !1];
  }
  function vn(t, e, l, n) {
    return t = { tag: t, create: l, deps: n, inst: e, next: null }, e = tt.updateQueue, e === null && (e = $u(), tt.updateQueue = e), l = e.lastEffect, l === null ? e.lastEffect = t.next = t : (n = l.next, l.next = t, t.next = n, e.lastEffect = t), t;
  }
  function ri() {
    return { destroy: void 0, resource: void 0 };
  }
  function Io() {
    return qt().memoizedState;
  }
  function oi(t, e, l, n) {
    var a = te();
    n = n === void 0 ? null : n, tt.flags |= t, a.memoizedState = vn(
      1 | e,
      ri(),
      l,
      n
    );
  }
  function na(t, e, l, n) {
    var a = qt();
    n = n === void 0 ? null : n;
    var i = a.memoizedState.inst;
    mt !== null && n !== null && Lu(n, mt.memoizedState.deps) ? a.memoizedState = vn(e, i, l, n) : (tt.flags |= t, a.memoizedState = vn(
      1 | e,
      i,
      l,
      n
    ));
  }
  function Po(t, e) {
    oi(8390656, 8, t, e);
  }
  function tf(t, e) {
    na(2048, 8, t, e);
  }
  function ef(t, e) {
    return na(4, 2, t, e);
  }
  function lf(t, e) {
    return na(4, 4, t, e);
  }
  function nf(t, e) {
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
  function af(t, e, l) {
    l = l != null ? l.concat([t]) : null, na(4, 4, nf.bind(null, e, t), l);
  }
  function ec() {
  }
  function uf(t, e) {
    var l = qt();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    return e !== null && Lu(e, n[1]) ? n[0] : (l.memoizedState = [t, e], t);
  }
  function cf(t, e) {
    var l = qt();
    e = e === void 0 ? null : e;
    var n = l.memoizedState;
    if (e !== null && Lu(e, n[1]))
      return n[0];
    if (n = t(), Yl) {
      We(!0);
      try {
        t();
      } finally {
        We(!1);
      }
    }
    return l.memoizedState = [n, e], n;
  }
  function lc(t, e, l) {
    return l === void 0 || (nl & 1073741824) !== 0 ? t.memoizedState = e : (t.memoizedState = l, t = fs(), tt.lanes |= t, fl |= t, l);
  }
  function rf(t, e, l, n) {
    return ce(l, e) ? l : sn.current !== null ? (t = lc(t, l, n), ce(t, e) || (Ct = !0), t) : (nl & 42) === 0 ? (Ct = !0, t.memoizedState = l) : (t = fs(), tt.lanes |= t, fl |= t, e);
  }
  function of(t, e, l, n, a) {
    var i = Y.p;
    Y.p = i !== 0 && 8 > i ? i : 8;
    var u = w.T, c = {};
    w.T = c, ic(t, !1, e, l);
    try {
      var d = a(), T = w.S;
      if (T !== null && T(c, d), d !== null && typeof d == "object" && typeof d.then == "function") {
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
    } catch (N) {
      aa(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: N },
        de()
      );
    } finally {
      Y.p = i, w.T = u;
    }
  }
  function Qh() {
  }
  function nc(t, e, l, n) {
    if (t.tag !== 5) throw Error(r(476));
    var a = ff(t).queue;
    of(
      t,
      a,
      e,
      Z,
      l === null ? Qh : function() {
        return sf(t), l(n);
      }
    );
  }
  function ff(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: Z,
      baseState: Z,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ge,
        lastRenderedState: Z
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
  function sf(t) {
    var e = ff(t).next.queue;
    aa(t, e, {}, de());
  }
  function ac() {
    return $t(Ea);
  }
  function df() {
    return qt().memoizedState;
  }
  function hf() {
    return qt().memoizedState;
  }
  function Zh(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = de();
          t = el(l);
          var n = ll(e, t, l);
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
    }, fi(t) ? gf(e, l) : (l = Au(t, e, l, n), l !== null && (he(l, t, n), yf(l, e, n)));
  }
  function vf(t, e, l) {
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
    if (fi(t)) gf(e, a);
    else {
      var i = t.alternate;
      if (t.lanes === 0 && (i === null || i.lanes === 0) && (i = e.lastRenderedReducer, i !== null))
        try {
          var u = e.lastRenderedState, c = i(u, l);
          if (a.hasEagerState = !0, a.eagerState = c, ce(c, u))
            return Ka(t, e, a, 0), At === null && Za(), !1;
        } catch (d) {
        } finally {
        }
      if (l = Au(t, e, a, n), l !== null)
        return he(l, t, n), yf(l, e, n), !0;
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
    }, fi(t)) {
      if (e) throw Error(r(479));
    } else
      e = Au(
        t,
        l,
        n,
        2
      ), e !== null && he(e, t, 2);
  }
  function fi(t) {
    var e = t.alternate;
    return t === tt || e !== null && e === tt;
  }
  function gf(t, e) {
    dn = ai = !0;
    var l = t.pending;
    l === null ? e.next = e : (e.next = l.next, l.next = e), t.pending = e;
  }
  function yf(t, e, l) {
    if ((l & 4194048) !== 0) {
      var n = e.lanes;
      n &= t.pendingLanes, l |= n, e.lanes = l, Er(t, l);
    }
  }
  var si = {
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
  }, pf = {
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
        nf.bind(null, e, t),
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
        We(!0);
        try {
          t();
        } finally {
          We(!1);
        }
      }
      return l.memoizedState = [n, e], n;
    },
    useReducer: function(t, e, l) {
      var n = te();
      if (l !== void 0) {
        var a = l(e);
        if (Yl) {
          We(!0);
          try {
            l(e);
          } finally {
            We(!1);
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
        tt,
        t
      ), [n.memoizedState, t];
    },
    useRef: function(t) {
      var e = te();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Pu(t);
      var e = t.queue, l = vf.bind(null, tt, e);
      return e.dispatch = l, [t.memoizedState, l];
    },
    useDebugValue: ec,
    useDeferredValue: function(t, e) {
      var l = te();
      return lc(l, t, e);
    },
    useTransition: function() {
      var t = Pu(!1);
      return t = of.bind(
        null,
        tt,
        t.queue,
        !0,
        !1
      ), te().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, l) {
      var n = tt, a = te();
      if (ht) {
        if (l === void 0)
          throw Error(r(407));
        l = l();
      } else {
        if (l = e(), At === null)
          throw Error(r(349));
        (ut & 124) !== 0 || Yo(n, e, l);
      }
      a.memoizedState = l;
      var i = { value: l, getSnapshot: e };
      return a.queue = i, Po(Vo.bind(null, n, i, t), [
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
      var t = te(), e = At.identifierPrefix;
      if (ht) {
        var l = Be, n = Ye;
        l = (n & ~(1 << 32 - ue(n) - 1)).toString(32) + l, e = "«" + e + "R" + l, l = ii++, 0 < l && (e += "H" + l.toString(32)), e += "»";
      } else
        l = Gh++, e = "«" + e + "r" + l.toString(32) + "»";
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
        tt,
        !0,
        l
      ), l.dispatch = e, [t, e];
    },
    useMemoCache: Wu,
    useCacheRefresh: function() {
      return te().memoizedState = Zh.bind(
        null,
        tt
      );
    }
  }, mf = {
    readContext: $t,
    use: ui,
    useCallback: uf,
    useContext: $t,
    useEffect: tf,
    useImperativeHandle: af,
    useInsertionEffect: ef,
    useLayoutEffect: lf,
    useMemo: cf,
    useReducer: ci,
    useRef: Io,
    useState: function() {
      return ci(Ge);
    },
    useDebugValue: ec,
    useDeferredValue: function(t, e) {
      var l = qt();
      return rf(
        l,
        mt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = ci(Ge)[0], e = qt().memoizedState;
      return [
        typeof t == "boolean" ? t : la(t),
        e
      ];
    },
    useSyncExternalStore: jo,
    useId: df,
    useHostTransitionStatus: ac,
    useFormState: $o,
    useActionState: $o,
    useOptimistic: function(t, e) {
      var l = qt();
      return ko(l, mt, t, e);
    },
    useMemoCache: Wu,
    useCacheRefresh: hf
  }, Jh = {
    readContext: $t,
    use: ui,
    useCallback: uf,
    useContext: $t,
    useEffect: tf,
    useImperativeHandle: af,
    useInsertionEffect: ef,
    useLayoutEffect: lf,
    useMemo: cf,
    useReducer: Iu,
    useRef: Io,
    useState: function() {
      return Iu(Ge);
    },
    useDebugValue: ec,
    useDeferredValue: function(t, e) {
      var l = qt();
      return mt === null ? lc(l, t, e) : rf(
        l,
        mt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Iu(Ge)[0], e = qt().memoizedState;
      return [
        typeof t == "boolean" ? t : la(t),
        e
      ];
    },
    useSyncExternalStore: jo,
    useId: df,
    useHostTransitionStatus: ac,
    useFormState: Fo,
    useActionState: Fo,
    useOptimistic: function(t, e) {
      var l = qt();
      return mt !== null ? ko(l, mt, t, e) : (l.baseState = t, [t, l.queue.dispatch]);
    },
    useMemoCache: Wu,
    useCacheRefresh: hf
  }, gn = null, ia = 0;
  function di(t) {
    var e = ia;
    return ia += 1, gn === null && (gn = []), wo(gn, t, e);
  }
  function ua(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function hi(t, e) {
    throw e.$$typeof === _ ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function bf(t) {
    var e = t._init;
    return e(t._payload);
  }
  function Sf(t) {
    function e(b, g) {
      if (t) {
        var x = b.deletions;
        x === null ? (b.deletions = [g], b.flags |= 16) : x.push(g);
      }
    }
    function l(b, g) {
      if (!t) return null;
      for (; g !== null; )
        e(b, g), g = g.sibling;
      return null;
    }
    function n(b) {
      for (var g = /* @__PURE__ */ new Map(); b !== null; )
        b.key !== null ? g.set(b.key, b) : g.set(b.index, b), b = b.sibling;
      return g;
    }
    function a(b, g) {
      return b = je(b, g), b.index = 0, b.sibling = null, b;
    }
    function i(b, g, x) {
      return b.index = x, t ? (x = b.alternate, x !== null ? (x = x.index, x < g ? (b.flags |= 67108866, g) : x) : (b.flags |= 67108866, g)) : (b.flags |= 1048576, g);
    }
    function u(b) {
      return t && b.alternate === null && (b.flags |= 67108866), b;
    }
    function c(b, g, x, D) {
      return g === null || g.tag !== 6 ? (g = zu(x, b.mode, D), g.return = b, g) : (g = a(g, x), g.return = b, g);
    }
    function d(b, g, x, D) {
      var V = x.type;
      return V === G ? M(
        b,
        g,
        x.props.children,
        D,
        x.key
      ) : g !== null && (g.elementType === V || typeof V == "object" && V !== null && V.$$typeof === gt && bf(V) === g.type) ? (g = a(g, x.props), ua(g, x), g.return = b, g) : (g = $a(
        x.type,
        x.key,
        x.props,
        null,
        b.mode,
        D
      ), ua(g, x), g.return = b, g);
    }
    function T(b, g, x, D) {
      return g === null || g.tag !== 4 || g.stateNode.containerInfo !== x.containerInfo || g.stateNode.implementation !== x.implementation ? (g = Mu(x, b.mode, D), g.return = b, g) : (g = a(g, x.children || []), g.return = b, g);
    }
    function M(b, g, x, D, V) {
      return g === null || g.tag !== 7 ? (g = Dl(
        x,
        b.mode,
        D,
        V
      ), g.return = b, g) : (g = a(g, x), g.return = b, g);
    }
    function N(b, g, x) {
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint")
        return g = zu(
          "" + g,
          b.mode,
          x
        ), g.return = b, g;
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case U:
            return x = $a(
              g.type,
              g.key,
              g.props,
              null,
              b.mode,
              x
            ), ua(x, g), x.return = b, x;
          case H:
            return g = Mu(
              g,
              b.mode,
              x
            ), g.return = b, g;
          case gt:
            var D = g._init;
            return g = D(g._payload), N(b, g, x);
        }
        if (Kt(g) || _t(g))
          return g = Dl(
            g,
            b.mode,
            x,
            null
          ), g.return = b, g;
        if (typeof g.then == "function")
          return N(b, di(g), x);
        if (g.$$typeof === dt)
          return N(
            b,
            Pa(b, g),
            x
          );
        hi(b, g);
      }
      return null;
    }
    function A(b, g, x, D) {
      var V = g !== null ? g.key : null;
      if (typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint")
        return V !== null ? null : c(b, g, "" + x, D);
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case U:
            return x.key === V ? d(b, g, x, D) : null;
          case H:
            return x.key === V ? T(b, g, x, D) : null;
          case gt:
            return V = x._init, x = V(x._payload), A(b, g, x, D);
        }
        if (Kt(x) || _t(x))
          return V !== null ? null : M(b, g, x, D, null);
        if (typeof x.then == "function")
          return A(
            b,
            g,
            di(x),
            D
          );
        if (x.$$typeof === dt)
          return A(
            b,
            g,
            Pa(b, x),
            D
          );
        hi(b, x);
      }
      return null;
    }
    function O(b, g, x, D, V) {
      if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
        return b = b.get(x) || null, c(g, b, "" + D, V);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case U:
            return b = b.get(
              D.key === null ? x : D.key
            ) || null, d(g, b, D, V);
          case H:
            return b = b.get(
              D.key === null ? x : D.key
            ) || null, T(g, b, D, V);
          case gt:
            var et = D._init;
            return D = et(D._payload), O(
              b,
              g,
              x,
              D,
              V
            );
        }
        if (Kt(D) || _t(D))
          return b = b.get(x) || null, M(g, b, D, V, null);
        if (typeof D.then == "function")
          return O(
            b,
            g,
            x,
            di(D),
            V
          );
        if (D.$$typeof === dt)
          return O(
            b,
            g,
            x,
            Pa(g, D),
            V
          );
        hi(g, D);
      }
      return null;
    }
    function K(b, g, x, D) {
      for (var V = null, et = null, C = g, Q = g = 0, kt = null; C !== null && Q < x.length; Q++) {
        C.index > Q ? (kt = C, C = null) : kt = C.sibling;
        var st = A(
          b,
          C,
          x[Q],
          D
        );
        if (st === null) {
          C === null && (C = kt);
          break;
        }
        t && C && st.alternate === null && e(b, C), g = i(st, g, Q), et === null ? V = st : et.sibling = st, et = st, C = kt;
      }
      if (Q === x.length)
        return l(b, C), ht && Nl(b, Q), V;
      if (C === null) {
        for (; Q < x.length; Q++)
          C = N(b, x[Q], D), C !== null && (g = i(
            C,
            g,
            Q
          ), et === null ? V = C : et.sibling = C, et = C);
        return ht && Nl(b, Q), V;
      }
      for (C = n(C); Q < x.length; Q++)
        kt = O(
          C,
          b,
          Q,
          x[Q],
          D
        ), kt !== null && (t && kt.alternate !== null && C.delete(
          kt.key === null ? Q : kt.key
        ), g = i(
          kt,
          g,
          Q
        ), et === null ? V = kt : et.sibling = kt, et = kt);
      return t && C.forEach(function(bl) {
        return e(b, bl);
      }), ht && Nl(b, Q), V;
    }
    function L(b, g, x, D) {
      if (x == null) throw Error(r(151));
      for (var V = null, et = null, C = g, Q = g = 0, kt = null, st = x.next(); C !== null && !st.done; Q++, st = x.next()) {
        C.index > Q ? (kt = C, C = null) : kt = C.sibling;
        var bl = A(b, C, st.value, D);
        if (bl === null) {
          C === null && (C = kt);
          break;
        }
        t && C && bl.alternate === null && e(b, C), g = i(bl, g, Q), et === null ? V = bl : et.sibling = bl, et = bl, C = kt;
      }
      if (st.done)
        return l(b, C), ht && Nl(b, Q), V;
      if (C === null) {
        for (; !st.done; Q++, st = x.next())
          st = N(b, st.value, D), st !== null && (g = i(st, g, Q), et === null ? V = st : et.sibling = st, et = st);
        return ht && Nl(b, Q), V;
      }
      for (C = n(C); !st.done; Q++, st = x.next())
        st = O(C, b, Q, st.value, D), st !== null && (t && st.alternate !== null && C.delete(st.key === null ? Q : st.key), g = i(st, g, Q), et === null ? V = st : et.sibling = st, et = st);
      return t && C.forEach(function($v) {
        return e(b, $v);
      }), ht && Nl(b, Q), V;
    }
    function St(b, g, x, D) {
      if (typeof x == "object" && x !== null && x.type === G && x.key === null && (x = x.props.children), typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case U:
            t: {
              for (var V = x.key; g !== null; ) {
                if (g.key === V) {
                  if (V = x.type, V === G) {
                    if (g.tag === 7) {
                      l(
                        b,
                        g.sibling
                      ), D = a(
                        g,
                        x.props.children
                      ), D.return = b, b = D;
                      break t;
                    }
                  } else if (g.elementType === V || typeof V == "object" && V !== null && V.$$typeof === gt && bf(V) === g.type) {
                    l(
                      b,
                      g.sibling
                    ), D = a(g, x.props), ua(D, x), D.return = b, b = D;
                    break t;
                  }
                  l(b, g);
                  break;
                } else e(b, g);
                g = g.sibling;
              }
              x.type === G ? (D = Dl(
                x.props.children,
                b.mode,
                D,
                x.key
              ), D.return = b, b = D) : (D = $a(
                x.type,
                x.key,
                x.props,
                null,
                b.mode,
                D
              ), ua(D, x), D.return = b, b = D);
            }
            return u(b);
          case H:
            t: {
              for (V = x.key; g !== null; ) {
                if (g.key === V)
                  if (g.tag === 4 && g.stateNode.containerInfo === x.containerInfo && g.stateNode.implementation === x.implementation) {
                    l(
                      b,
                      g.sibling
                    ), D = a(g, x.children || []), D.return = b, b = D;
                    break t;
                  } else {
                    l(b, g);
                    break;
                  }
                else e(b, g);
                g = g.sibling;
              }
              D = Mu(x, b.mode, D), D.return = b, b = D;
            }
            return u(b);
          case gt:
            return V = x._init, x = V(x._payload), St(
              b,
              g,
              x,
              D
            );
        }
        if (Kt(x))
          return K(
            b,
            g,
            x,
            D
          );
        if (_t(x)) {
          if (V = _t(x), typeof V != "function") throw Error(r(150));
          return x = V.call(x), L(
            b,
            g,
            x,
            D
          );
        }
        if (typeof x.then == "function")
          return St(
            b,
            g,
            di(x),
            D
          );
        if (x.$$typeof === dt)
          return St(
            b,
            g,
            Pa(b, x),
            D
          );
        hi(b, x);
      }
      return typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint" ? (x = "" + x, g !== null && g.tag === 6 ? (l(b, g.sibling), D = a(g, x), D.return = b, b = D) : (l(b, g), D = zu(x, b.mode, D), D.return = b, b = D), u(b)) : l(b, g);
    }
    return function(b, g, x, D) {
      try {
        ia = 0;
        var V = St(
          b,
          g,
          x,
          D
        );
        return gn = null, V;
      } catch (C) {
        if (C === Wn || C === ei) throw C;
        var et = re(29, C, null, b.mode);
        return et.lanes = D, et.return = b, et;
      } finally {
      }
    };
  }
  var yn = Sf(!0), xf = Sf(!1), Se = R(null), De = null;
  function al(t) {
    var e = t.alternate;
    j(Bt, Bt.current & 1), j(Se, t), De === null && (e === null || sn.current !== null || e.memoizedState !== null) && (De = t);
  }
  function Ef(t) {
    if (t.tag === 22) {
      if (j(Bt, Bt.current), j(Se, t), De === null) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (De = t);
      }
    } else il();
  }
  function il() {
    j(Bt, Bt.current), j(Se, Se.current);
  }
  function ke(t) {
    B(Se), De === t && (De = null), B(Bt);
  }
  var Bt = R(0);
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
    e = t.memoizedState, l = l(n, e), l = l == null ? e : p({}, e, l), t.memoizedState = l, t.lanes === 0 && (t.updateQueue.baseState = l);
  }
  var cc = {
    enqueueSetState: function(t, e, l) {
      t = t._reactInternals;
      var n = de(), a = el(n);
      a.payload = e, l != null && (a.callback = l), e = ll(t, a, n), e !== null && (he(e, t, n), In(e, t, n));
    },
    enqueueReplaceState: function(t, e, l) {
      t = t._reactInternals;
      var n = de(), a = el(n);
      a.tag = 1, a.payload = e, l != null && (a.callback = l), e = ll(t, a, n), e !== null && (he(e, t, n), In(e, t, n));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var l = de(), n = el(l);
      n.tag = 2, e != null && (n.callback = e), e = ll(t, n, l), e !== null && (he(e, t, l), In(e, t, l));
    }
  };
  function Tf(t, e, l, n, a, i, u) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(n, i, u) : e.prototype && e.prototype.isPureReactComponent ? !kn(l, n) || !kn(a, i) : !0;
  }
  function Af(t, e, l, n) {
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
      l === e && (l = p({}, l));
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
  function Of(t) {
    gi(t);
  }
  function zf(t) {
    console.error(t);
  }
  function Mf(t) {
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
  function wf(t, e, l) {
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
    return l = el(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      yi(t, e);
    }, l;
  }
  function Df(t) {
    return t = el(t), t.tag = 3, t;
  }
  function _f(t, e, l, n) {
    var a = l.type.getDerivedStateFromError;
    if (typeof a == "function") {
      var i = n.value;
      t.payload = function() {
        return a(i);
      }, t.callback = function() {
        wf(e, l, n);
      };
    }
    var u = l.stateNode;
    u !== null && typeof u.componentDidCatch == "function" && (t.callback = function() {
      wf(e, l, n), typeof a != "function" && (sl === null ? sl = /* @__PURE__ */ new Set([this]) : sl.add(this));
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
      ), l = Se.current, l !== null) {
        switch (l.tag) {
          case 13:
            return De === null ? Uc() : l.alternate === null && Dt === 0 && (Dt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = a, n === Yu ? l.flags |= 16384 : (e = l.updateQueue, e === null ? l.updateQueue = /* @__PURE__ */ new Set([n]) : e.add(n), Hc(t, n, a)), !1;
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
    if (ht)
      return e = Se.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = a, n !== _u && (t = Error(r(422), { cause: n }), Zn(ye(t, l)))) : (n !== _u && (e = Error(r(423), {
        cause: n
      }), Zn(
        ye(e, l)
      )), t = t.current.alternate, t.flags |= 65536, a &= -a, t.lanes |= a, n = ye(n, l), a = rc(
        t.stateNode,
        n,
        a
      ), Cu(t, a), Dt !== 4 && (Dt = 2)), !1;
    var i = Error(r(520), { cause: n });
    if (i = ye(i, l), ha === null ? ha = [i] : ha.push(i), Dt !== 4 && (Dt = 2), e === null) return !0;
    n = ye(n, l), l = e;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, t = a & -a, l.lanes |= t, t = rc(l.stateNode, n, t), Cu(l, t), !1;
        case 1:
          if (e = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (sl === null || !sl.has(i))))
            return l.flags |= 65536, a &= -a, l.lanes |= a, a = Df(a), _f(
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
  var Nf = Error(r(461)), Ct = !1;
  function Xt(t, e, l, n) {
    e.child = t === null ? xf(e, null, l, n) : yn(
      e,
      t.child,
      l,
      n
    );
  }
  function Uf(t, e, l, n, a) {
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
    ), c = Zu(), t !== null && !Ct ? (Ku(t, e, a), Xe(t, e, a)) : (ht && c && wu(e), e.flags |= 1, Xt(t, e, n, a), e.child);
  }
  function Rf(t, e, l, n, a) {
    if (t === null) {
      var i = l.type;
      return typeof i == "function" && !Ou(i) && i.defaultProps === void 0 && l.compare === null ? (e.tag = 15, e.type = i, Hf(
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
      if (l = l.compare, l = l !== null ? l : kn, l(u, n) && t.ref === e.ref)
        return Xe(t, e, a);
    }
    return e.flags |= 1, t = je(i, n), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Hf(t, e, l, n, a) {
    if (t !== null) {
      var i = t.memoizedProps;
      if (kn(i, n) && t.ref === e.ref)
        if (Ct = !1, e.pendingProps = n = i, yc(t, a))
          (t.flags & 131072) !== 0 && (Ct = !0);
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
  function qf(t, e, l) {
    var n = e.pendingProps, a = n.children, i = t !== null ? t.memoizedState : null;
    if (n.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (n = i !== null ? i.baseLanes | l : l, t !== null) {
          for (a = e.child = t.child, i = 0; a !== null; )
            i = i | a.lanes | a.childLanes, a = a.sibling;
          e.childLanes = i & ~n;
        } else e.childLanes = 0, e.child = null;
        return jf(
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
        ), i !== null ? Ro(e, i) : ku(), Ef(e);
      else
        return e.lanes = e.childLanes = 536870912, jf(
          t,
          e,
          i !== null ? i.baseLanes | l : l,
          l
        );
    } else
      i !== null ? (ti(e, i.cachePool), Ro(e, i), il(), e.memoizedState = null) : (t !== null && ti(e, null), ku(), il());
    return Xt(t, e, a, l), e.child;
  }
  function jf(t, e, l, n) {
    var a = ju();
    return a = a === null ? null : { parent: Yt._currentValue, pool: a }, e.memoizedState = {
      baseLanes: l,
      cachePool: a
    }, t !== null && ti(e, null), ku(), Ef(e), t !== null && Kn(t, e, n, !0), null;
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
    ), n = Zu(), t !== null && !Ct ? (Ku(t, e, a), Xe(t, e, a)) : (ht && n && wu(e), e.flags |= 1, Xt(t, e, l, a), e.child);
  }
  function Yf(t, e, l, n, a, i) {
    return ql(e), e.updateQueue = null, l = qo(
      e,
      n,
      l,
      a
    ), Ho(t), n = Zu(), t !== null && !Ct ? (Ku(t, e, i), Xe(t, e, i)) : (ht && n && wu(e), e.flags |= 1, Xt(t, e, l, i), e.child);
  }
  function Bf(t, e, l, n, a) {
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
      var T = i.context, M = l.contextType;
      u = un, typeof M == "object" && M !== null && (u = $t(M));
      var N = l.getDerivedStateFromProps;
      M = typeof N == "function" || typeof i.getSnapshotBeforeUpdate == "function", c = e.pendingProps !== c, M || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c || T !== u) && Af(
        e,
        i,
        n,
        u
      ), tl = !1;
      var A = e.memoizedState;
      i.state = A, ta(e, n, i, a), Pn(), T = e.memoizedState, c || A !== T || tl ? (typeof N == "function" && (uc(
        e,
        l,
        N,
        n
      ), T = e.memoizedState), (d = tl || Tf(
        e,
        l,
        d,
        n,
        A,
        T,
        u
      )) ? (M || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = n, e.memoizedState = T), i.props = n, i.state = T, i.context = u, n = d) : (typeof i.componentDidMount == "function" && (e.flags |= 4194308), n = !1);
    } else {
      i = e.stateNode, Vu(t, e), u = e.memoizedProps, M = Bl(l, u), i.props = M, N = e.pendingProps, A = i.context, T = l.contextType, d = un, typeof T == "object" && T !== null && (d = $t(T)), c = l.getDerivedStateFromProps, (T = typeof c == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== N || A !== d) && Af(
        e,
        i,
        n,
        d
      ), tl = !1, A = e.memoizedState, i.state = A, ta(e, n, i, a), Pn();
      var O = e.memoizedState;
      u !== N || A !== O || tl || t !== null && t.dependencies !== null && Ia(t.dependencies) ? (typeof c == "function" && (uc(
        e,
        l,
        c,
        n
      ), O = e.memoizedState), (M = tl || Tf(
        e,
        l,
        M,
        n,
        A,
        O,
        d
      ) || t !== null && t.dependencies !== null && Ia(t.dependencies)) ? (T || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(n, O, d), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
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
    )) : Xt(t, e, l, a), e.memoizedState = i.state, t = e.child) : t = Xe(
      t,
      e,
      a
    ), t;
  }
  function Vf(t, e, l, n) {
    return Qn(), e.flags |= 256, Xt(t, e, l, n), e.child;
  }
  var fc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function sc(t) {
    return { baseLanes: t, cachePool: Oo() };
  }
  function dc(t, e, l) {
    return t = t !== null ? t.childLanes & ~l : 0, e && (t |= xe), t;
  }
  function Cf(t, e, l) {
    var n = e.pendingProps, a = !1, i = (e.flags & 128) !== 0, u;
    if ((u = i) || (u = t !== null && t.memoizedState === null ? !1 : (Bt.current & 2) !== 0), u && (a = !0, e.flags &= -129), u = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (ht) {
        if (a ? al(e) : il(), ht) {
          var c = wt, d;
          if (d = c) {
            t: {
              for (d = c, c = we; d.nodeType !== 8; ) {
                if (!c) {
                  c = null;
                  break t;
                }
                if (d = Oe(
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
              treeContext: _l !== null ? { id: Ye, overflow: Be } : null,
              retryLane: 536870912,
              hydrationErrors: null
            }, d = re(
              18,
              null,
              null,
              0
            ), d.stateNode = c, d.return = e, e.child = d, Ft = e, wt = null, d = !0) : d = !1;
          }
          d || Rl(e);
        }
        if (c = e.memoizedState, c !== null && (c = c.dehydrated, c !== null))
          return $c(c) ? e.lanes = 32 : e.lanes = 536870912, null;
        ke(e);
      }
      return c = n.children, n = n.fallback, a ? (il(), a = e.mode, c = mi(
        { mode: "hidden", children: c },
        a
      ), n = Dl(
        n,
        a,
        l,
        null
      ), c.return = e, n.return = e, c.sibling = n, e.child = c, a = e.child, a.memoizedState = sc(l), a.childLanes = dc(
        t,
        u,
        l
      ), e.memoizedState = fc, n) : (al(e), hc(e, c));
    }
    if (d = t.memoizedState, d !== null && (c = d.dehydrated, c !== null)) {
      if (i)
        e.flags & 256 ? (al(e), e.flags &= -257, e = vc(
          t,
          e,
          l
        )) : e.memoizedState !== null ? (il(), e.child = t.child, e.flags |= 128, e = null) : (il(), a = n.fallback, c = e.mode, n = mi(
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
        ), n = e.child, n.memoizedState = sc(l), n.childLanes = dc(
          t,
          u,
          l
        ), e.memoizedState = fc, e = a);
      else if (al(e), $c(c)) {
        if (u = c.nextSibling && c.nextSibling.dataset, u) var T = u.dgst;
        u = T, n = Error(r(419)), n.stack = "", n.digest = u, Zn({ value: n, source: null, stack: null }), e = vc(
          t,
          e,
          l
        );
      } else if (Ct || Kn(t, e, l, !1), u = (l & t.childLanes) !== 0, Ct || u) {
        if (u = At, u !== null && (n = l & -l, n = (n & 42) !== 0 ? 1 : Wi(n), n = (n & (u.suspendedLanes | l)) !== 0 ? 0 : n, n !== 0 && n !== d.retryLane))
          throw d.retryLane = n, an(t, n), he(u, t, n), Nf;
        c.data === "$?" || Uc(), e = vc(
          t,
          e,
          l
        );
      } else
        c.data === "$?" ? (e.flags |= 192, e.child = t.child, e = null) : (t = d.treeContext, wt = Oe(
          c.nextSibling
        ), Ft = e, ht = !0, Ul = null, we = !1, t !== null && (me[be++] = Ye, me[be++] = Be, me[be++] = _l, Ye = t.id, Be = t.overflow, _l = e), e = hc(
          e,
          n.children
        ), e.flags |= 4096);
      return e;
    }
    return a ? (il(), a = n.fallback, c = e.mode, d = t.child, T = d.sibling, n = je(d, {
      mode: "hidden",
      children: n.children
    }), n.subtreeFlags = d.subtreeFlags & 65011712, T !== null ? a = je(T, a) : (a = Dl(
      a,
      c,
      l,
      null
    ), a.flags |= 2), a.return = e, n.return = e, n.sibling = a, e.child = n, n = a, a = e.child, c = t.child.memoizedState, c === null ? c = sc(l) : (d = c.cachePool, d !== null ? (T = Yt._currentValue, d = d.parent !== T ? { parent: T, pool: T } : d) : d = Oo(), c = {
      baseLanes: c.baseLanes | l,
      cachePool: d
    }), a.memoizedState = c, a.childLanes = dc(
      t,
      u,
      l
    ), e.memoizedState = fc, n) : (al(e), l = t.child, t = l.sibling, l = je(l, {
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
  function Gf(t, e, l) {
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
  function kf(t, e, l) {
    var n = e.pendingProps, a = n.revealOrder, i = n.tail;
    if (Xt(t, e, n.children, l), n = Bt.current, (n & 2) !== 0)
      n = n & 1 | 2, e.flags |= 128;
    else {
      if (t !== null && (t.flags & 128) !== 0)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13)
            t.memoizedState !== null && Gf(t, l, e);
          else if (t.tag === 19)
            Gf(t, l, e);
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
    switch (j(Bt, n), a) {
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
      for (t = e.child, l = je(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        t = t.sibling, l = l.sibling = je(t, t.pendingProps), l.return = e;
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
        Ot(e, e.stateNode.containerInfo), Pe(e, Yt, t.memoizedState.cache), Qn();
        break;
      case 27:
      case 5:
        Qi(e);
        break;
      case 4:
        Ot(e, e.stateNode.containerInfo);
        break;
      case 10:
        Pe(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 13:
        var n = e.memoizedState;
        if (n !== null)
          return n.dehydrated !== null ? (al(e), e.flags |= 128, null) : (l & e.child.childLanes) !== 0 ? Cf(t, e, l) : (al(e), t = Xe(
            t,
            e,
            l
          ), t !== null ? t.sibling : null);
        al(e);
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
            return kf(
              t,
              e,
              l
            );
          e.flags |= 128;
        }
        if (a = e.memoizedState, a !== null && (a.rendering = null, a.tail = null, a.lastEffect = null), j(Bt, Bt.current), n) break;
        return null;
      case 22:
      case 23:
        return e.lanes = 0, qf(t, e, l);
      case 24:
        Pe(e, Yt, t.memoizedState.cache);
    }
    return Xe(t, e, l);
  }
  function Xf(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Ct = !0;
      else {
        if (!yc(t, l) && (e.flags & 128) === 0)
          return Ct = !1, Wh(
            t,
            e,
            l
          );
        Ct = (t.flags & 131072) !== 0;
      }
    else
      Ct = !1, ht && (e.flags & 1048576) !== 0 && mo(e, Fa, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          t = e.pendingProps;
          var n = e.elementType, a = n._init;
          if (n = a(n._payload), e.type = n, typeof n == "function")
            Ou(n) ? (t = Bl(n, t), e.tag = 1, e = Bf(
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
              if (a = n.$$typeof, a === P) {
                e.tag = 11, e = Uf(
                  null,
                  e,
                  n,
                  t,
                  l
                );
                break t;
              } else if (a === Rt) {
                e.tag = 14, e = Rf(
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
        ), Bf(
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
          a = i.element, Vu(t, e), ta(e, n, null, l);
          var u = e.memoizedState;
          if (n = u.cache, Pe(e, Yt, n), n !== i.cache && Ru(
            e,
            [Yt],
            l,
            !0
          ), Pn(), n = u.element, i.isDehydrated)
            if (i = {
              element: n,
              isDehydrated: !1,
              cache: u.cache
            }, e.updateQueue.baseState = i, e.memoizedState = i, e.flags & 256) {
              e = Vf(
                t,
                e,
                n,
                l
              );
              break t;
            } else if (n !== a) {
              a = ye(
                Error(r(424)),
                e
              ), Zn(a), e = Vf(
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
              for (wt = Oe(t.firstChild), Ft = e, ht = !0, Ul = null, we = !0, l = xf(
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
            Xt(
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
        return pi(t, e), t === null ? (l = Ks(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = l : ht || (l = e.type, t = e.pendingProps, n = Ui(
          W.current
        ).createElement(l), n[Jt] = e, n[It] = t, Qt(n, l, t), Vt(n), e.stateNode = n) : e.memoizedState = Ks(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return Qi(e), t === null && ht && (n = e.stateNode = Ls(
          e.type,
          e.pendingProps,
          W.current
        ), Ft = e, we = !0, a = wt, vl(e.type) ? (Wc = a, wt = Oe(
          n.firstChild
        )) : wt = a), Xt(
          t,
          e,
          e.pendingProps.children,
          l
        ), pi(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && ht && ((a = n = wt) && (n = Av(
          n,
          e.type,
          e.pendingProps,
          we
        ), n !== null ? (e.stateNode = n, Ft = e, wt = Oe(
          n.firstChild
        ), we = !1, a = !0) : a = !1), a || Rl(e)), Qi(e), a = e.type, i = e.pendingProps, u = t !== null ? t.memoizedProps : null, n = i.children, Zc(a, i) ? n = null : u !== null && Zc(a, u) && (e.flags |= 32), e.memoizedState !== null && (a = Qu(
          t,
          e,
          kh,
          null,
          null,
          l
        ), Ea._currentValue = a), pi(t, e), Xt(t, e, n, l), e.child;
      case 6:
        return t === null && ht && ((t = l = wt) && (l = Ov(
          l,
          e.pendingProps,
          we
        ), l !== null ? (e.stateNode = l, Ft = e, wt = null, t = !0) : t = !1), t || Rl(e)), null;
      case 13:
        return Cf(t, e, l);
      case 4:
        return Ot(
          e,
          e.stateNode.containerInfo
        ), n = e.pendingProps, t === null ? e.child = yn(
          e,
          null,
          n,
          l
        ) : Xt(
          t,
          e,
          n,
          l
        ), e.child;
      case 11:
        return Uf(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 7:
        return Xt(
          t,
          e,
          e.pendingProps,
          l
        ), e.child;
      case 8:
        return Xt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 12:
        return Xt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 10:
        return n = e.pendingProps, Pe(e, e.type, n.value), Xt(
          t,
          e,
          n.children,
          l
        ), e.child;
      case 9:
        return a = e.type._context, n = e.pendingProps.children, ql(e), a = $t(a), n = n(a), e.flags |= 1, Xt(t, e, n, l), e.child;
      case 14:
        return Rf(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 15:
        return Hf(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 19:
        return kf(t, e, l);
      case 31:
        return n = e.pendingProps, l = e.mode, n = {
          mode: n.mode,
          children: n.children
        }, t === null ? (l = mi(
          n,
          l
        ), l.ref = e.ref, e.child = l, l.return = e, e = l) : (l = je(t.child, n), l.ref = e.ref, e.child = l, l.return = e, e = l), e;
      case 22:
        return qf(t, e, l);
      case 24:
        return ql(e), n = $t(Yt), t === null ? (a = ju(), a === null && (a = At, i = Hu(), a.pooledCache = i, i.refCount++, i !== null && (a.pooledCacheLanes |= l), a = i), e.memoizedState = {
          parent: n,
          cache: a
        }, Bu(e), Pe(e, Yt, a)) : ((t.lanes & l) !== 0 && (Vu(t, e), ta(e, null, null, l), Pn()), a = t.memoizedState, i = e.memoizedState, a.parent !== n ? (a = { parent: n, cache: n }, e.memoizedState = a, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = a), Pe(e, Yt, n)) : (n = i.cache, Pe(e, Yt, n), n !== a.cache && Ru(
          e,
          [Yt],
          l,
          !0
        ))), Xt(
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
  function Le(t) {
    t.flags |= 4;
  }
  function Lf(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !Is(e)) {
      if (e = Se.current, e !== null && ((ut & 4194048) === ut ? De !== null : (ut & 62914560) !== ut && (ut & 536870912) === 0 || e !== De))
        throw Fn = Yu, zo;
      t.flags |= 8192;
    }
  }
  function bi(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Sr() : 536870912, t.lanes |= e, Sn |= e);
  }
  function ca(t, e) {
    if (!ht)
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
        return l = e.stateNode, n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), Ce(Yt), $e(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (t === null || t.child === null) && (Ln(e) ? Le(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, xo())), Mt(e), null;
      case 26:
        return l = e.memoizedState, t === null ? (Le(e), l !== null ? (Mt(e), Lf(e, l)) : (Mt(e), e.flags &= -16777217)) : l ? l !== t.memoizedState ? (Le(e), Mt(e), Lf(e, l)) : (Mt(e), e.flags &= -16777217) : (t.memoizedProps !== n && Le(e), Mt(e), e.flags &= -16777217), null;
      case 27:
        _a(e), l = W.current;
        var a = e.type;
        if (t !== null && e.stateNode != null)
          t.memoizedProps !== n && Le(e);
        else {
          if (!n) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Mt(e), null;
          }
          t = X.current, Ln(e) ? bo(e) : (t = Ls(a, n, l), e.stateNode = t, Le(e));
        }
        return Mt(e), null;
      case 5:
        if (_a(e), l = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== n && Le(e);
        else {
          if (!n) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Mt(e), null;
          }
          if (t = X.current, Ln(e))
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
            t && Le(e);
          }
        }
        return Mt(e), e.flags &= -16777217, null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== n && Le(e);
        else {
          if (typeof n != "string" && e.stateNode === null)
            throw Error(r(166));
          if (t = W.current, Ln(e)) {
            if (t = e.stateNode, l = e.memoizedProps, n = null, a = Ft, a !== null)
              switch (a.tag) {
                case 27:
                case 5:
                  n = a.memoizedProps;
              }
            t[Jt] = e, t = !!(t.nodeValue === l || n !== null && n.suppressHydrationWarning === !0 || Ys(t.nodeValue, l)), t || Rl(e);
          } else
            t = Ui(t).createTextNode(
              n
            ), t[Jt] = e, e.stateNode = t;
        }
        return Mt(e), null;
      case 13:
        if (n = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (a = Ln(e), n !== null && n.dehydrated !== null) {
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
            return e.flags & 256 ? (ke(e), e) : (ke(e), null);
        }
        if (ke(e), (e.flags & 128) !== 0)
          return e.lanes = l, e;
        if (l = n !== null, t = t !== null && t.memoizedState !== null, l) {
          n = e.child, a = null, n.alternate !== null && n.alternate.memoizedState !== null && n.alternate.memoizedState.cachePool !== null && (a = n.alternate.memoizedState.cachePool.pool);
          var i = null;
          n.memoizedState !== null && n.memoizedState.cachePool !== null && (i = n.memoizedState.cachePool.pool), i !== a && (n.flags |= 2048);
        }
        return l !== t && l && (e.child.flags |= 8192), bi(e, e.updateQueue), Mt(e), null;
      case 4:
        return $e(), t === null && Gc(e.stateNode.containerInfo), Mt(e), null;
      case 10:
        return Ce(e.type), Mt(e), null;
      case 19:
        if (B(Bt), a = e.memoizedState, a === null) return Mt(e), null;
        if (n = (e.flags & 128) !== 0, i = a.rendering, i === null)
          if (n) ca(a, !1);
          else {
            if (Dt !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (i = vi(t), i !== null) {
                  for (e.flags |= 128, ca(a, !1), t = i.updateQueue, e.updateQueue = t, bi(e, t), e.subtreeFlags = 0, t = l, l = e.child; l !== null; )
                    po(l, t), l = l.sibling;
                  return j(
                    Bt,
                    Bt.current & 1 | 2
                  ), e.child;
                }
                t = t.sibling;
              }
            a.tail !== null && Me() > Ei && (e.flags |= 128, n = !0, ca(a, !1), e.lanes = 4194304);
          }
        else {
          if (!n)
            if (t = vi(i), t !== null) {
              if (e.flags |= 128, n = !0, t = t.updateQueue, e.updateQueue = t, bi(e, t), ca(a, !0), a.tail === null && a.tailMode === "hidden" && !i.alternate && !ht)
                return Mt(e), null;
            } else
              2 * Me() - a.renderingStartTime > Ei && l !== 536870912 && (e.flags |= 128, n = !0, ca(a, !1), e.lanes = 4194304);
          a.isBackwards ? (i.sibling = e.child, e.child = i) : (t = a.last, t !== null ? t.sibling = i : e.child = i, a.last = i);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = Me(), e.sibling = null, t = Bt.current, j(Bt, n ? t & 1 | 2 : t & 1), e) : (Mt(e), null);
      case 22:
      case 23:
        return ke(e), Xu(), n = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== n && (e.flags |= 8192) : n && (e.flags |= 8192), n ? (l & 536870912) !== 0 && (e.flags & 128) === 0 && (Mt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Mt(e), l = e.updateQueue, l !== null && bi(e, l.retryQueue), l = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), n = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), n !== l && (e.flags |= 2048), t !== null && B(jl), null;
      case 24:
        return l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), Ce(Yt), Mt(e), null;
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
        return Ce(Yt), $e(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return _a(e), null;
      case 13:
        if (ke(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(r(340));
          Qn();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return B(Bt), null;
      case 4:
        return $e(), null;
      case 10:
        return Ce(e.type), null;
      case 22:
      case 23:
        return ke(e), Xu(), t !== null && B(jl), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return Ce(Yt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Qf(t, e) {
    switch (Du(e), e.tag) {
      case 3:
        Ce(Yt), $e();
        break;
      case 26:
      case 27:
      case 5:
        _a(e);
        break;
      case 4:
        $e();
        break;
      case 13:
        ke(e);
        break;
      case 19:
        B(Bt);
        break;
      case 10:
        Ce(e.type);
        break;
      case 22:
      case 23:
        ke(e), Xu(), t !== null && B(jl);
        break;
      case 24:
        Ce(Yt);
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
      Tt(e, e.return, c);
    }
  }
  function ul(t, e, l) {
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
              var d = l, T = c;
              try {
                T();
              } catch (M) {
                Tt(
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
      Tt(e, e.return, M);
    }
  }
  function Zf(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        Uo(e, l);
      } catch (n) {
        Tt(t, t.return, n);
      }
    }
  }
  function Kf(t, e, l) {
    l.props = Bl(
      t.type,
      t.memoizedProps
    ), l.state = t.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (n) {
      Tt(t, e, n);
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
      Tt(t, e, a);
    }
  }
  function _e(t, e) {
    var l = t.ref, n = t.refCleanup;
    if (l !== null)
      if (typeof n == "function")
        try {
          n();
        } catch (a) {
          Tt(t, e, a);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (a) {
          Tt(t, e, a);
        }
      else l.current = null;
  }
  function Jf(t) {
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
      Tt(t, t.return, a);
    }
  }
  function pc(t, e, l) {
    try {
      var n = t.stateNode;
      bv(n, t.type, l, e), n[It] = e;
    } catch (a) {
      Tt(t, t.return, a);
    }
  }
  function $f(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && vl(t.type) || t.tag === 4;
  }
  function mc(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || $f(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && vl(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function bc(t, e, l) {
    var n = t.tag;
    if (n === 5 || n === 6)
      t = t.stateNode, e ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(t, e) : (e = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, e.appendChild(t), l = l._reactRootContainer, l != null || e.onclick !== null || (e.onclick = Ni));
    else if (n !== 4 && (n === 27 && vl(t.type) && (l = t.stateNode, e = null), t = t.child, t !== null))
      for (bc(t, e, l), t = t.sibling; t !== null; )
        bc(t, e, l), t = t.sibling;
  }
  function Si(t, e, l) {
    var n = t.tag;
    if (n === 5 || n === 6)
      t = t.stateNode, e ? l.insertBefore(t, e) : l.appendChild(t);
    else if (n !== 4 && (n === 27 && vl(t.type) && (l = t.stateNode), t = t.child, t !== null))
      for (Si(t, e, l), t = t.sibling; t !== null; )
        Si(t, e, l), t = t.sibling;
  }
  function Wf(t) {
    var e = t.stateNode, l = t.memoizedProps;
    try {
      for (var n = t.type, a = e.attributes; a.length; )
        e.removeAttributeNode(a[0]);
      Qt(e, n, l), e[Jt] = t, e[It] = l;
    } catch (i) {
      Tt(t, t.return, i);
    }
  }
  var Qe = !1, Ut = !1, Sc = !1, Ff = typeof WeakSet == "function" ? WeakSet : Set, Gt = null;
  function Ph(t, e) {
    if (t = t.containerInfo, Lc = Bi, t = uo(t), mu(t)) {
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
            } catch (L) {
              l = null;
              break t;
            }
            var u = 0, c = -1, d = -1, T = 0, M = 0, N = t, A = null;
            e: for (; ; ) {
              for (var O; N !== l || a !== 0 && N.nodeType !== 3 || (c = u + a), N !== i || n !== 0 && N.nodeType !== 3 || (d = u + n), N.nodeType === 3 && (u += N.nodeValue.length), (O = N.firstChild) !== null; )
                A = N, N = O;
              for (; ; ) {
                if (N === t) break e;
                if (A === l && ++T === a && (c = u), A === i && ++M === n && (d = u), (O = N.nextSibling) !== null) break;
                N = A, A = N.parentNode;
              }
              N = O;
            }
            l = c === -1 || d === -1 ? null : { start: c, end: d };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Qc = { focusedElem: t, selectionRange: l }, Bi = !1, Gt = e; Gt !== null; )
      if (e = Gt, t = e.child, (e.subtreeFlags & 1024) !== 0 && t !== null)
        t.return = e, Gt = t;
      else
        for (; Gt !== null; ) {
          switch (e = Gt, i = e.alternate, t = e.flags, e.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && i !== null) {
                t = void 0, l = e, a = i.memoizedProps, i = i.memoizedState, n = l.stateNode;
                try {
                  var K = Bl(
                    l.type,
                    a,
                    l.elementType === l.type
                  );
                  t = n.getSnapshotBeforeUpdate(
                    K,
                    i
                  ), n.__reactInternalSnapshotBeforeUpdate = t;
                } catch (L) {
                  Tt(
                    l,
                    l.return,
                    L
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
            t.return = e.return, Gt = t;
            break;
          }
          Gt = e.return;
        }
  }
  function If(t, e, l) {
    var n = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        cl(t, l), n & 4 && ra(5, l);
        break;
      case 1:
        if (cl(t, l), n & 4)
          if (t = l.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (u) {
              Tt(l, l.return, u);
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
              Tt(
                l,
                l.return,
                u
              );
            }
          }
        n & 64 && Zf(l), n & 512 && oa(l, l.return);
        break;
      case 3:
        if (cl(t, l), n & 64 && (t = l.updateQueue, t !== null)) {
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
            Tt(l, l.return, u);
          }
        }
        break;
      case 27:
        e === null && n & 4 && Wf(l);
      case 26:
      case 5:
        cl(t, l), e === null && n & 4 && Jf(l), n & 512 && oa(l, l.return);
        break;
      case 12:
        cl(t, l);
        break;
      case 13:
        cl(t, l), n & 4 && es(t, l), n & 64 && (t = l.memoizedState, t !== null && (t = t.dehydrated, t !== null && (l = rv.bind(
          null,
          l
        ), zv(t, l))));
        break;
      case 22:
        if (n = l.memoizedState !== null || Qe, !n) {
          e = e !== null && e.memoizedState !== null || Ut, a = Qe;
          var i = Ut;
          Qe = n, (Ut = e) && !i ? rl(
            t,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : cl(t, l), Qe = a, Ut = i;
        }
        break;
      case 30:
        break;
      default:
        cl(t, l);
    }
  }
  function Pf(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Pf(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Pi(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var zt = null, ee = !1;
  function Ze(t, e, l) {
    for (l = l.child; l !== null; )
      ts(t, e, l), l = l.sibling;
  }
  function ts(t, e, l) {
    if (ie && typeof ie.onCommitFiberUnmount == "function")
      try {
        ie.onCommitFiberUnmount(_n, l);
      } catch (i) {
      }
    switch (l.tag) {
      case 26:
        Ut || _e(l, e), Ze(
          t,
          e,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ut || _e(l, e);
        var n = zt, a = ee;
        vl(l.type) && (zt = l.stateNode, ee = !1), Ze(
          t,
          e,
          l
        ), ma(l.stateNode), zt = n, ee = a;
        break;
      case 5:
        Ut || _e(l, e);
      case 6:
        if (n = zt, a = ee, zt = null, Ze(
          t,
          e,
          l
        ), zt = n, ee = a, zt !== null)
          if (ee)
            try {
              (zt.nodeType === 9 ? zt.body : zt.nodeName === "HTML" ? zt.ownerDocument.body : zt).removeChild(l.stateNode);
            } catch (i) {
              Tt(
                l,
                e,
                i
              );
            }
          else
            try {
              zt.removeChild(l.stateNode);
            } catch (i) {
              Tt(
                l,
                e,
                i
              );
            }
        break;
      case 18:
        zt !== null && (ee ? (t = zt, ks(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          l.stateNode
        ), za(t)) : ks(zt, l.stateNode));
        break;
      case 4:
        n = zt, a = ee, zt = l.stateNode.containerInfo, ee = !0, Ze(
          t,
          e,
          l
        ), zt = n, ee = a;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ut || ul(2, l, e), Ut || ul(4, l, e), Ze(
          t,
          e,
          l
        );
        break;
      case 1:
        Ut || (_e(l, e), n = l.stateNode, typeof n.componentWillUnmount == "function" && Kf(
          l,
          e,
          n
        )), Ze(
          t,
          e,
          l
        );
        break;
      case 21:
        Ze(
          t,
          e,
          l
        );
        break;
      case 22:
        Ut = (n = Ut) || l.memoizedState !== null, Ze(
          t,
          e,
          l
        ), Ut = n;
        break;
      default:
        Ze(
          t,
          e,
          l
        );
    }
  }
  function es(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        za(t);
      } catch (l) {
        Tt(e, e.return, l);
      }
  }
  function tv(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new Ff()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new Ff()), e;
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
              if (vl(c.type)) {
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
        ts(i, u, a), zt = null, ee = !1, i = a.alternate, i !== null && (i.return = null), a.return = null;
      }
    if (e.subtreeFlags & 13878)
      for (e = e.child; e !== null; )
        ls(e, t), e = e.sibling;
  }
  var Ae = null;
  function ls(t, e) {
    var l = t.alternate, n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        oe(e, t), fe(t), n & 4 && (ul(3, t, t.return), ra(3, t), ul(5, t, t.return));
        break;
      case 1:
        oe(e, t), fe(t), n & 512 && (Ut || l === null || _e(l, l.return)), n & 64 && Qe && (t = t.updateQueue, t !== null && (n = t.callbacks, n !== null && (l = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = l === null ? n : l.concat(n))));
        break;
      case 26:
        var a = Ae;
        if (oe(e, t), fe(t), n & 512 && (Ut || l === null || _e(l, l.return)), n & 4) {
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
                      )), Qt(i, n, l), i[Jt] = t, Vt(i), n = i;
                      break t;
                    case "link":
                      var u = Ws(
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
                      if (u = Ws(
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
                  i[Jt] = t, Vt(i), n = i;
                }
                t.stateNode = n;
              } else
                Fs(
                  a,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = $s(
                a,
                n,
                t.memoizedProps
              );
          else
            i !== n ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, n === null ? Fs(
              a,
              t.type,
              t.stateNode
            ) : $s(
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
        oe(e, t), fe(t), n & 512 && (Ut || l === null || _e(l, l.return)), l !== null && n & 4 && pc(
          t,
          t.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (oe(e, t), fe(t), n & 512 && (Ut || l === null || _e(l, l.return)), t.flags & 32) {
          a = t.stateNode;
          try {
            Fl(a, "");
          } catch (O) {
            Tt(t, t.return, O);
          }
        }
        n & 4 && t.stateNode != null && (a = t.memoizedProps, pc(
          t,
          a,
          l !== null ? l.memoizedProps : a
        )), n & 1024 && (Sc = !0);
        break;
      case 6:
        if (oe(e, t), fe(t), n & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          n = t.memoizedProps, l = t.stateNode;
          try {
            l.nodeValue = n;
          } catch (O) {
            Tt(t, t.return, O);
          }
        }
        break;
      case 3:
        if (qi = null, a = Ae, Ae = Ri(e.containerInfo), oe(e, t), Ae = a, fe(t), n & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            za(e.containerInfo);
          } catch (O) {
            Tt(t, t.return, O);
          }
        Sc && (Sc = !1, ns(t));
        break;
      case 4:
        n = Ae, Ae = Ri(
          t.stateNode.containerInfo
        ), oe(e, t), fe(t), Ae = n;
        break;
      case 12:
        oe(e, t), fe(t);
        break;
      case 13:
        oe(e, t), fe(t), t.child.flags & 8192 && t.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Mc = Me()), n & 4 && (n = t.updateQueue, n !== null && (t.updateQueue = null, xc(t, n)));
        break;
      case 22:
        a = t.memoizedState !== null;
        var d = l !== null && l.memoizedState !== null, T = Qe, M = Ut;
        if (Qe = T || a, Ut = M || d, oe(e, t), Ut = M, Qe = T, fe(t), n & 8192)
          t: for (e = t.stateNode, e._visibility = a ? e._visibility & -2 : e._visibility | 1, a && (l === null || d || Qe || Ut || Vl(t)), l = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                d = l = e;
                try {
                  if (i = d.stateNode, a)
                    u = i.style, typeof u.setProperty == "function" ? u.setProperty("display", "none", "important") : u.display = "none";
                  else {
                    c = d.stateNode;
                    var N = d.memoizedProps.style, A = N != null && N.hasOwnProperty("display") ? N.display : null;
                    c.style.display = A == null || typeof A == "boolean" ? "" : ("" + A).trim();
                  }
                } catch (O) {
                  Tt(d, d.return, O);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                d = e;
                try {
                  d.stateNode.nodeValue = a ? "" : d.memoizedProps;
                } catch (O) {
                  Tt(d, d.return, O);
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
        oe(e, t), fe(t), n & 4 && (n = t.updateQueue, n !== null && (t.updateQueue = null, xc(t, n)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        oe(e, t), fe(t);
    }
  }
  function fe(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, n = t.return; n !== null; ) {
          if ($f(n)) {
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
            var d = l.stateNode.containerInfo, T = mc(t);
            bc(
              t,
              T,
              d
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (M) {
        Tt(t, t.return, M);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function ns(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        ns(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function cl(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        If(t, e.alternate, e), e = e.sibling;
  }
  function Vl(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ul(4, e, e.return), Vl(e);
          break;
        case 1:
          _e(e, e.return);
          var l = e.stateNode;
          typeof l.componentWillUnmount == "function" && Kf(
            e,
            e.return,
            l
          ), Vl(e);
          break;
        case 27:
          ma(e.stateNode);
        case 26:
        case 5:
          _e(e, e.return), Vl(e);
          break;
        case 22:
          e.memoizedState === null && Vl(e);
          break;
        case 30:
          Vl(e);
          break;
        default:
          Vl(e);
      }
      t = t.sibling;
    }
  }
  function rl(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var n = e.alternate, a = t, i = e, u = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          rl(
            a,
            i,
            l
          ), ra(4, i);
          break;
        case 1:
          if (rl(
            a,
            i,
            l
          ), n = i, a = n.stateNode, typeof a.componentDidMount == "function")
            try {
              a.componentDidMount();
            } catch (T) {
              Tt(n, n.return, T);
            }
          if (n = i, a = n.updateQueue, a !== null) {
            var c = n.stateNode;
            try {
              var d = a.shared.hiddenCallbacks;
              if (d !== null)
                for (a.shared.hiddenCallbacks = null, a = 0; a < d.length; a++)
                  No(d[a], c);
            } catch (T) {
              Tt(n, n.return, T);
            }
          }
          l && u & 64 && Zf(i), oa(i, i.return);
          break;
        case 27:
          Wf(i);
        case 26:
        case 5:
          rl(
            a,
            i,
            l
          ), l && n === null && u & 4 && Jf(i), oa(i, i.return);
          break;
        case 12:
          rl(
            a,
            i,
            l
          );
          break;
        case 13:
          rl(
            a,
            i,
            l
          ), l && u & 4 && es(a, i);
          break;
        case 22:
          i.memoizedState === null && rl(
            a,
            i,
            l
          ), oa(i, i.return);
          break;
        case 30:
          break;
        default:
          rl(
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
  function Ne(t, e, l, n) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        as(
          t,
          e,
          l,
          n
        ), e = e.sibling;
  }
  function as(t, e, l, n) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Ne(
          t,
          e,
          l,
          n
        ), a & 2048 && ra(9, e);
        break;
      case 1:
        Ne(
          t,
          e,
          l,
          n
        );
        break;
      case 3:
        Ne(
          t,
          e,
          l,
          n
        ), a & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Jn(t)));
        break;
      case 12:
        if (a & 2048) {
          Ne(
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
            Tt(e, e.return, d);
          }
        } else
          Ne(
            t,
            e,
            l,
            n
          );
        break;
      case 13:
        Ne(
          t,
          e,
          l,
          n
        );
        break;
      case 23:
        break;
      case 22:
        i = e.stateNode, u = e.alternate, e.memoizedState !== null ? i._visibility & 2 ? Ne(
          t,
          e,
          l,
          n
        ) : fa(t, e) : i._visibility & 2 ? Ne(
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
        Ne(
          t,
          e,
          l,
          n
        ), a & 2048 && Tc(e.alternate, e);
        break;
      default:
        Ne(
          t,
          e,
          l,
          n
        );
    }
  }
  function pn(t, e, l, n, a) {
    for (a = a && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var i = t, u = e, c = l, d = n, T = u.flags;
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
          ) : fa(
            i,
            u
          ) : (M._visibility |= 2, pn(
            i,
            u,
            c,
            d,
            a
          )), a && T & 2048 && Ec(
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
          ), a && T & 2048 && Tc(u.alternate, u);
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
  function fa(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t, n = e, a = n.flags;
        switch (n.tag) {
          case 22:
            fa(l, n), a & 2048 && Ec(
              n.alternate,
              n
            );
            break;
          case 24:
            fa(l, n), a & 2048 && Tc(n.alternate, n);
            break;
          default:
            fa(l, n);
        }
        e = e.sibling;
      }
  }
  var sa = 8192;
  function mn(t) {
    if (t.subtreeFlags & sa)
      for (t = t.child; t !== null; )
        is(t), t = t.sibling;
  }
  function is(t) {
    switch (t.tag) {
      case 26:
        mn(t), t.flags & sa && t.memoizedState !== null && Vv(
          Ae,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        mn(t);
        break;
      case 3:
      case 4:
        var e = Ae;
        Ae = Ri(t.stateNode.containerInfo), mn(t), Ae = e;
        break;
      case 22:
        t.memoizedState === null && (e = t.alternate, e !== null && e.memoizedState !== null ? (e = sa, sa = 16777216, mn(t), sa = e) : mn(t));
        break;
      default:
        mn(t);
    }
  }
  function us(t) {
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
          Gt = n, rs(
            n,
            t
          );
        }
      us(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        cs(t), t = t.sibling;
  }
  function cs(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        da(t), t.flags & 2048 && ul(9, t, t.return);
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
          Gt = n, rs(
            n,
            t
          );
        }
      us(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          ul(8, e, e.return), xi(e);
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
  function rs(t, e) {
    for (; Gt !== null; ) {
      var l = Gt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          ul(8, l, e);
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
      if (n = l.child, n !== null) n.return = l, Gt = n;
      else
        t: for (l = t; Gt !== null; ) {
          n = Gt;
          var a = n.sibling, i = n.return;
          if (Pf(n), n === l) {
            Gt = null;
            break t;
          }
          if (a !== null) {
            a.return = i, Gt = a;
            break t;
          }
          Gt = i;
        }
    }
  }
  var ev = {
    getCacheForType: function(t) {
      var e = $t(Yt), l = e.data.get(t);
      return l === void 0 && (l = t(), e.data.set(t, l)), l;
    }
  }, lv = typeof WeakMap == "function" ? WeakMap : Map, yt = 0, At = null, nt = null, ut = 0, pt = 0, se = null, ol = !1, bn = !1, Ac = !1, Ke = 0, Dt = 0, fl = 0, Cl = 0, Oc = 0, xe = 0, Sn = 0, ha = null, le = null, zc = !1, Mc = 0, Ei = 1 / 0, Ti = null, sl = null, Lt = 0, dl = null, xn = null, En = 0, wc = 0, Dc = null, os = null, va = 0, _c = null;
  function de() {
    if ((yt & 2) !== 0 && ut !== 0)
      return ut & -ut;
    if (w.T !== null) {
      var t = on;
      return t !== 0 ? t : Yc();
    }
    return Tr();
  }
  function fs() {
    xe === 0 && (xe = (ut & 536870912) === 0 || ht ? br() : 536870912);
    var t = Se.current;
    return t !== null && (t.flags |= 32), xe;
  }
  function he(t, e, l) {
    (t === At && (pt === 2 || pt === 9) || t.cancelPendingCommit !== null) && (Tn(t, 0), hl(
      t,
      ut,
      xe,
      !1
    )), Un(t, l), ((yt & 2) === 0 || t !== At) && (t === At && ((yt & 2) === 0 && (Cl |= l), Dt === 4 && hl(
      t,
      ut,
      xe,
      !1
    )), Ue(t));
  }
  function ss(t, e, l) {
    if ((yt & 6) !== 0) throw Error(r(327));
    var n = !l && (e & 124) === 0 && (e & t.expiredLanes) === 0 || Nn(t, e), a = n ? iv(t, e) : Rc(t, e, !0), i = n;
    do {
      if (a === 0) {
        bn && !n && hl(t, e, 0, !1);
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
          Tn(t, 0), hl(t, e, 0, !0);
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
              hl(
                n,
                e,
                xe,
                !ol
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
          if ((e & 62914560) === e && (a = Mc + 300 - Me(), 10 < a)) {
            if (hl(
              n,
              e,
              xe,
              !ol
            ), Ha(n, 0, !0) !== 0) break t;
            n.timeoutHandle = Cs(
              ds.bind(
                null,
                n,
                l,
                le,
                Ti,
                zc,
                e,
                xe,
                Cl,
                Sn,
                ol,
                i,
                2,
                -0,
                0
              ),
              a
            );
            break t;
          }
          ds(
            n,
            l,
            le,
            Ti,
            zc,
            e,
            xe,
            Cl,
            Sn,
            ol,
            i,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Ue(t);
  }
  function ds(t, e, l, n, a, i, u, c, d, T, M, N, A, O) {
    if (t.timeoutHandle = -1, N = e.subtreeFlags, (N & 8192 || (N & 16785408) === 16785408) && (xa = { stylesheets: null, count: 0, unsuspend: Bv }, is(e), N = Cv(), N !== null)) {
      t.cancelPendingCommit = N(
        bs.bind(
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
      ), hl(t, i, u, !T);
      return;
    }
    bs(
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
  function hl(t, e, l, n) {
    e &= ~Oc, e &= ~Cl, t.suspendedLanes |= e, t.pingedLanes &= ~e, n && (t.warmLanes |= e), n = t.expirationTimes;
    for (var a = e; 0 < a; ) {
      var i = 31 - ue(a), u = 1 << i;
      n[i] = -1, a &= ~u;
    }
    l !== 0 && xr(t, l, e);
  }
  function Ai() {
    return (yt & 6) === 0 ? (ga(0), !1) : !0;
  }
  function Nc() {
    if (nt !== null) {
      if (pt === 0)
        var t = nt.return;
      else
        t = nt, Ve = Hl = null, Ju(t), gn = null, ia = 0, t = nt;
      for (; t !== null; )
        Qf(t.alternate, t), t = t.return;
      nt = null;
    }
  }
  function Tn(t, e) {
    var l = t.timeoutHandle;
    l !== -1 && (t.timeoutHandle = -1, xv(l)), l = t.cancelPendingCommit, l !== null && (t.cancelPendingCommit = null, l()), Nc(), At = t, nt = l = je(t.current, null), ut = e, pt = 0, se = null, ol = !1, bn = Nn(t, e), Ac = !1, Sn = xe = Oc = Cl = fl = Dt = 0, le = ha = null, zc = !1, (e & 8) !== 0 && (e |= e & 32);
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var a = 31 - ue(n), i = 1 << a;
        e |= t[a], n &= ~i;
      }
    return Ke = e, Za(), l;
  }
  function hs(t, e) {
    tt = null, w.H = si, e === Wn || e === ei ? (e = Do(), pt = 3) : e === zo ? (e = Do(), pt = 4) : pt = e === Nf ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, se = e, nt === null && (Dt = 1, yi(
      t,
      ye(e, t.current)
    ));
  }
  function vs() {
    var t = w.H;
    return w.H = si, t === null ? si : t;
  }
  function gs() {
    var t = w.A;
    return w.A = ev, t;
  }
  function Uc() {
    Dt = 4, ol || (ut & 4194048) !== ut && Se.current !== null || (bn = !0), (fl & 134217727) === 0 && (Cl & 134217727) === 0 || At === null || hl(
      At,
      ut,
      xe,
      !1
    );
  }
  function Rc(t, e, l) {
    var n = yt;
    yt |= 2;
    var a = vs(), i = gs();
    (At !== t || ut !== e) && (Ti = null, Tn(t, e)), e = !1;
    var u = Dt;
    t: do
      try {
        if (pt !== 0 && nt !== null) {
          var c = nt, d = se;
          switch (pt) {
            case 8:
              Nc(), u = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Se.current === null && (e = !0);
              var T = pt;
              if (pt = 0, se = null, An(t, c, d, T), l && bn) {
                u = 0;
                break t;
              }
              break;
            default:
              T = pt, pt = 0, se = null, An(t, c, d, T);
          }
        }
        av(), u = Dt;
        break;
      } catch (M) {
        hs(t, M);
      }
    while (!0);
    return e && t.shellSuspendCounter++, Ve = Hl = null, yt = n, w.H = a, w.A = i, nt === null && (At = null, ut = 0, Za()), u;
  }
  function av() {
    for (; nt !== null; ) ys(nt);
  }
  function iv(t, e) {
    var l = yt;
    yt |= 2;
    var n = vs(), a = gs();
    At !== t || ut !== e ? (Ti = null, Ei = Me() + 500, Tn(t, e)) : bn = Nn(
      t,
      e
    );
    t: do
      try {
        if (pt !== 0 && nt !== null) {
          e = nt;
          var i = se;
          e: switch (pt) {
            case 1:
              pt = 0, se = null, An(t, e, i, 1);
              break;
            case 2:
            case 9:
              if (Mo(i)) {
                pt = 0, se = null, ps(e);
                break;
              }
              e = function() {
                pt !== 2 && pt !== 9 || At !== t || (pt = 7), Ue(t);
              }, i.then(e, e);
              break t;
            case 3:
              pt = 7;
              break t;
            case 4:
              pt = 5;
              break t;
            case 7:
              Mo(i) ? (pt = 0, se = null, ps(e)) : (pt = 0, se = null, An(t, e, i, 7));
              break;
            case 5:
              var u = null;
              switch (nt.tag) {
                case 26:
                  u = nt.memoizedState;
                case 5:
                case 27:
                  var c = nt;
                  if (!u || Is(u)) {
                    pt = 0, se = null;
                    var d = c.sibling;
                    if (d !== null) nt = d;
                    else {
                      var T = c.return;
                      T !== null ? (nt = T, Oi(T)) : nt = null;
                    }
                    break e;
                  }
              }
              pt = 0, se = null, An(t, e, i, 5);
              break;
            case 6:
              pt = 0, se = null, An(t, e, i, 6);
              break;
            case 8:
              Nc(), Dt = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        uv();
        break;
      } catch (M) {
        hs(t, M);
      }
    while (!0);
    return Ve = Hl = null, w.H = n, w.A = a, yt = l, nt !== null ? 0 : (At = null, ut = 0, Za(), Dt);
  }
  function uv() {
    for (; nt !== null && !wd(); )
      ys(nt);
  }
  function ys(t) {
    var e = Xf(t.alternate, t, Ke);
    t.memoizedProps = t.pendingProps, e === null ? Oi(t) : nt = e;
  }
  function ps(t) {
    var e = t, l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Yf(
          l,
          e,
          e.pendingProps,
          e.type,
          void 0,
          ut
        );
        break;
      case 11:
        e = Yf(
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
        Qf(l, e), e = nt = po(e, Ke), e = Xf(l, e, Ke);
    }
    t.memoizedProps = t.pendingProps, e === null ? Oi(t) : nt = e;
  }
  function An(t, e, l, n) {
    Ve = Hl = null, Ju(e), gn = null, ia = 0;
    var a = e.return;
    try {
      if ($h(
        t,
        a,
        e,
        l,
        ut
      )) {
        Dt = 1, yi(
          t,
          ye(l, t.current)
        ), nt = null;
        return;
      }
    } catch (i) {
      if (a !== null) throw nt = a, i;
      Dt = 1, yi(
        t,
        ye(l, t.current)
      ), nt = null;
      return;
    }
    e.flags & 32768 ? (ht || n === 1 ? t = !0 : bn || (ut & 536870912) !== 0 ? t = !1 : (ol = t = !0, (n === 2 || n === 9 || n === 3 || n === 6) && (n = Se.current, n !== null && n.tag === 13 && (n.flags |= 16384))), ms(e, t)) : Oi(e);
  }
  function Oi(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        ms(
          e,
          ol
        );
        return;
      }
      t = e.return;
      var l = Fh(
        e.alternate,
        e,
        Ke
      );
      if (l !== null) {
        nt = l;
        return;
      }
      if (e = e.sibling, e !== null) {
        nt = e;
        return;
      }
      nt = e = t;
    } while (e !== null);
    Dt === 0 && (Dt = 5);
  }
  function ms(t, e) {
    do {
      var l = Ih(t.alternate, t);
      if (l !== null) {
        l.flags &= 32767, nt = l;
        return;
      }
      if (l = t.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !e && (t = t.sibling, t !== null)) {
        nt = t;
        return;
      }
      nt = t = l;
    } while (t !== null);
    Dt = 6, nt = null;
  }
  function bs(t, e, l, n, a, i, u, c, d) {
    t.cancelPendingCommit = null;
    do
      zi();
    while (Lt !== 0);
    if ((yt & 6) !== 0) throw Error(r(327));
    if (e !== null) {
      if (e === t.current) throw Error(r(177));
      if (i = e.lanes | e.childLanes, i |= Tu, Bd(
        t,
        l,
        i,
        u,
        c,
        d
      ), t === At && (nt = At = null, ut = 0), xn = e, dl = t, En = l, wc = i, Dc = a, os = n, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, fv(Na, function() {
        return As(), null;
      })) : (t.callbackNode = null, t.callbackPriority = 0), n = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || n) {
        n = w.T, w.T = null, a = Y.p, Y.p = 2, u = yt, yt |= 4;
        try {
          Ph(t, e, l);
        } finally {
          yt = u, Y.p = a, w.T = n;
        }
      }
      Lt = 1, Ss(), xs(), Es();
    }
  }
  function Ss() {
    if (Lt === 1) {
      Lt = 0;
      var t = dl, e = xn, l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        l = w.T, w.T = null;
        var n = Y.p;
        Y.p = 2;
        var a = yt;
        yt |= 4;
        try {
          ls(e, t);
          var i = Qc, u = uo(t.containerInfo), c = i.focusedElem, d = i.selectionRange;
          if (u !== c && c && c.ownerDocument && io(
            c.ownerDocument.documentElement,
            c
          )) {
            if (d !== null && mu(c)) {
              var T = d.start, M = d.end;
              if (M === void 0 && (M = T), "selectionStart" in c)
                c.selectionStart = T, c.selectionEnd = Math.min(
                  M,
                  c.value.length
                );
              else {
                var N = c.ownerDocument || document, A = N && N.defaultView || window;
                if (A.getSelection) {
                  var O = A.getSelection(), K = c.textContent.length, L = Math.min(d.start, K), St = d.end === void 0 ? L : Math.min(d.end, K);
                  !O.extend && L > St && (u = St, St = L, L = u);
                  var b = ao(
                    c,
                    L
                  ), g = ao(
                    c,
                    St
                  );
                  if (b && g && (O.rangeCount !== 1 || O.anchorNode !== b.node || O.anchorOffset !== b.offset || O.focusNode !== g.node || O.focusOffset !== g.offset)) {
                    var x = N.createRange();
                    x.setStart(b.node, b.offset), O.removeAllRanges(), L > St ? (O.addRange(x), O.extend(g.node, g.offset)) : (x.setEnd(g.node, g.offset), O.addRange(x));
                  }
                }
              }
            }
            for (N = [], O = c; O = O.parentNode; )
              O.nodeType === 1 && N.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof c.focus == "function" && c.focus(), c = 0; c < N.length; c++) {
              var D = N[c];
              D.element.scrollLeft = D.left, D.element.scrollTop = D.top;
            }
          }
          Bi = !!Lc, Qc = Lc = null;
        } finally {
          yt = a, Y.p = n, w.T = l;
        }
      }
      t.current = e, Lt = 2;
    }
  }
  function xs() {
    if (Lt === 2) {
      Lt = 0;
      var t = dl, e = xn, l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        l = w.T, w.T = null;
        var n = Y.p;
        Y.p = 2;
        var a = yt;
        yt |= 4;
        try {
          If(t, e.alternate, e);
        } finally {
          yt = a, Y.p = n, w.T = l;
        }
      }
      Lt = 3;
    }
  }
  function Es() {
    if (Lt === 4 || Lt === 3) {
      Lt = 0, Dd();
      var t = dl, e = xn, l = En, n = os;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? Lt = 5 : (Lt = 0, xn = dl = null, Ts(t, t.pendingLanes));
      var a = t.pendingLanes;
      if (a === 0 && (sl = null), Fi(l), e = e.stateNode, ie && typeof ie.onCommitFiberRoot == "function")
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
        e = w.T, a = Y.p, Y.p = 2, w.T = null;
        try {
          for (var i = t.onRecoverableError, u = 0; u < n.length; u++) {
            var c = n[u];
            i(c.value, {
              componentStack: c.stack
            });
          }
        } finally {
          w.T = e, Y.p = a;
        }
      }
      (En & 3) !== 0 && zi(), Ue(t), a = t.pendingLanes, (l & 4194090) !== 0 && (a & 42) !== 0 ? t === _c ? va++ : (va = 0, _c = t) : va = 0, ga(0);
    }
  }
  function Ts(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Jn(e)));
  }
  function zi(t) {
    return Ss(), xs(), Es(), As();
  }
  function As() {
    if (Lt !== 5) return !1;
    var t = dl, e = wc;
    wc = 0;
    var l = Fi(En), n = w.T, a = Y.p;
    try {
      Y.p = 32 > l ? 32 : l, w.T = null, l = Dc, Dc = null;
      var i = dl, u = En;
      if (Lt = 0, xn = dl = null, En = 0, (yt & 6) !== 0) throw Error(r(331));
      var c = yt;
      if (yt |= 4, cs(i.current), as(
        i,
        i.current,
        u,
        l
      ), yt = c, ga(0, !1), ie && typeof ie.onPostCommitFiberRoot == "function")
        try {
          ie.onPostCommitFiberRoot(_n, i);
        } catch (d) {
        }
      return !0;
    } finally {
      Y.p = a, w.T = n, Ts(t, e);
    }
  }
  function Os(t, e, l) {
    e = ye(l, e), e = rc(t.stateNode, e, 2), t = ll(t, e, 2), t !== null && (Un(t, 2), Ue(t));
  }
  function Tt(t, e, l) {
    if (t.tag === 3)
      Os(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Os(
            e,
            t,
            l
          );
          break;
        } else if (e.tag === 1) {
          var n = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (sl === null || !sl.has(n))) {
            t = ye(l, t), l = Df(2), n = ll(e, l, 2), n !== null && (_f(
              l,
              n,
              e,
              t
            ), Un(n, 2), Ue(n));
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
    n !== null && n.delete(e), t.pingedLanes |= t.suspendedLanes & l, t.warmLanes &= ~l, At === t && (ut & l) === l && (Dt === 4 || Dt === 3 && (ut & 62914560) === ut && 300 > Me() - Mc ? (yt & 2) === 0 && Tn(t, 0) : Oc |= l, Sn === ut && (Sn = 0)), Ue(t);
  }
  function zs(t, e) {
    e === 0 && (e = Sr()), t = an(t, e), t !== null && (Un(t, e), Ue(t));
  }
  function rv(t) {
    var e = t.memoizedState, l = 0;
    e !== null && (l = e.retryLane), zs(t, l);
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
    n !== null && n.delete(e), zs(t, l);
  }
  function fv(t, e) {
    return Ki(t, e);
  }
  var Mi = null, On = null, qc = !1, wi = !1, jc = !1, Gl = 0;
  function Ue(t) {
    t !== On && t.next === null && (On === null ? Mi = On = t : On = On.next = t), wi = !0, qc || (qc = !0, dv());
  }
  function ga(t, e) {
    if (!jc && wi) {
      jc = !0;
      do
        for (var l = !1, n = Mi; n !== null; ) {
          if (t !== 0) {
            var a = n.pendingLanes;
            if (a === 0) var i = 0;
            else {
              var u = n.suspendedLanes, c = n.pingedLanes;
              i = (1 << 31 - ue(42 | t) + 1) - 1, i &= a & ~(u & ~c), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, _s(n, i));
          } else
            i = ut, i = Ha(
              n,
              n === At ? i : 0,
              n.cancelPendingCommit !== null || n.timeoutHandle !== -1
            ), (i & 3) === 0 || Nn(n, i) || (l = !0, _s(n, i));
          n = n.next;
        }
      while (l);
      jc = !1;
    }
  }
  function sv() {
    Ms();
  }
  function Ms() {
    wi = qc = !1;
    var t = 0;
    Gl !== 0 && (Sv() && (t = Gl), Gl = 0);
    for (var e = Me(), l = null, n = Mi; n !== null; ) {
      var a = n.next, i = ws(n, e);
      i === 0 ? (n.next = null, l === null ? Mi = a : l.next = a, a === null && (On = l)) : (l = n, (t !== 0 || (i & 3) !== 0) && (wi = !0)), n = a;
    }
    ga(t);
  }
  function ws(t, e) {
    for (var l = t.suspendedLanes, n = t.pingedLanes, a = t.expirationTimes, i = t.pendingLanes & -62914561; 0 < i; ) {
      var u = 31 - ue(i), c = 1 << u, d = a[u];
      d === -1 ? ((c & l) === 0 || (c & n) !== 0) && (a[u] = Yd(c, e)) : d <= e && (t.expiredLanes |= c), i &= ~c;
    }
    if (e = At, l = ut, l = Ha(
      t,
      t === e ? l : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), n = t.callbackNode, l === 0 || t === e && (pt === 2 || pt === 9) || t.cancelPendingCommit !== null)
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
      return n = Ds.bind(null, t), l = Ki(l, n), t.callbackPriority = e, t.callbackNode = l, e;
    }
    return n !== null && n !== null && Ji(n), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Ds(t, e) {
    if (Lt !== 0 && Lt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var l = t.callbackNode;
    if (zi() && t.callbackNode !== l)
      return null;
    var n = ut;
    return n = Ha(
      t,
      t === At ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), n === 0 ? null : (ss(t, n, e), ws(t, Me()), t.callbackNode != null && t.callbackNode === l ? Ds.bind(null, t) : null);
  }
  function _s(t, e) {
    if (zi()) return null;
    ss(t, e, !0);
  }
  function dv() {
    Ev(function() {
      (yt & 6) !== 0 ? Ki(
        yr,
        sv
      ) : Ms();
    });
  }
  function Yc() {
    return Gl === 0 && (Gl = br()), Gl;
  }
  function Ns(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Va("" + t);
  }
  function Us(t, e) {
    var l = e.ownerDocument.createElement("input");
    return l.name = e.name, l.value = e.value, t.id && l.setAttribute("form", t.id), e.parentNode.insertBefore(l, e), t = new FormData(t), l.parentNode.removeChild(l), t;
  }
  function hv(t, e, l, n, a) {
    if (e === "submit" && l && l.stateNode === a) {
      var i = Ns(
        (a[It] || null).action
      ), u = n.submitter;
      u && (e = (e = u[It] || null) ? Ns(e.formAction) : u.getAttribute("formAction"), e !== null && (i = e, u = null));
      var c = new Xa(
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
                if (Gl !== 0) {
                  var d = u ? Us(a, u) : new FormData(a);
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
                typeof i == "function" && (c.preventDefault(), d = u ? Us(a, u) : new FormData(a), nc(
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
    var Vc = Eu[Bc], vv = Vc.toLowerCase(), gv = Vc[0].toUpperCase() + Vc.slice(1);
    Te(
      vv,
      "on" + gv
    );
  }
  Te(oo, "onAnimationEnd"), Te(fo, "onAnimationIteration"), Te(so, "onAnimationStart"), Te("dblclick", "onDoubleClick"), Te("focusin", "onFocus"), Te("focusout", "onBlur"), Te(Uh, "onTransitionRun"), Te(Rh, "onTransitionStart"), Te(Hh, "onTransitionCancel"), Te(ho, "onTransitionEnd"), Jl("onMouseEnter", ["mouseout", "mouseover"]), Jl("onMouseLeave", ["mouseout", "mouseover"]), Jl("onPointerEnter", ["pointerout", "pointerover"]), Jl("onPointerLeave", ["pointerout", "pointerover"]), Ol(
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
  function Rs(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var n = t[l], a = n.event;
      n = n.listeners;
      t: {
        var i = void 0;
        if (e)
          for (var u = n.length - 1; 0 <= u; u--) {
            var c = n[u], d = c.instance, T = c.currentTarget;
            if (c = c.listener, d !== i && a.isPropagationStopped())
              break t;
            i = c, a.currentTarget = T;
            try {
              i(a);
            } catch (M) {
              gi(M);
            }
            a.currentTarget = null, i = d;
          }
        else
          for (u = 0; u < n.length; u++) {
            if (c = n[u], d = c.instance, T = c.currentTarget, c = c.listener, d !== i && a.isPropagationStopped())
              break t;
            i = c, a.currentTarget = T;
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
  function at(t, e) {
    var l = e[Ii];
    l === void 0 && (l = e[Ii] = /* @__PURE__ */ new Set());
    var n = t + "__bubble";
    l.has(n) || (Hs(e, t, 2, !1), l.add(n));
  }
  function Cc(t, e, l) {
    var n = 0;
    e && (n |= 4), Hs(
      l,
      t,
      n,
      e
    );
  }
  var Di = "_reactListening" + Math.random().toString(36).slice(2);
  function Gc(t) {
    if (!t[Di]) {
      t[Di] = !0, Or.forEach(function(l) {
        l !== "selectionchange" && (yv.has(l) || Cc(l, !1, t), Cc(l, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Di] || (e[Di] = !0, Cc("selectionchange", !1, e));
    }
  }
  function Hs(t, e, l, n) {
    switch (ad(e)) {
      case 2:
        var a = Xv;
        break;
      case 8:
        a = Lv;
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
  function kc(t, e, l, n, a) {
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
    Vr(function() {
      var T = i, M = cu(l), N = [];
      t: {
        var A = vo.get(t);
        if (A !== void 0) {
          var O = Xa, K = t;
          switch (t) {
            case "keypress":
              if (Ga(l) === 0) break t;
            case "keydown":
            case "keyup":
              O = fh;
              break;
            case "focusin":
              K = "focus", O = hu;
              break;
            case "focusout":
              K = "blur", O = hu;
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
              O = kr;
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
            case fo:
            case so:
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
              O = Lr;
              break;
            case "toggle":
            case "beforetoggle":
              O = bh;
          }
          var L = (e & 4) !== 0, St = !L && (t === "scroll" || t === "scrollend"), b = L ? A !== null ? A + "Capture" : null : A;
          L = [];
          for (var g = T, x; g !== null; ) {
            var D = g;
            if (x = D.stateNode, D = D.tag, D !== 5 && D !== 26 && D !== 27 || x === null || b === null || (D = qn(g, b), D != null && L.push(
              pa(g, D, x)
            )), St) break;
            g = g.return;
          }
          0 < L.length && (A = new O(
            A,
            K,
            null,
            l,
            M
          ), N.push({ event: A, listeners: L }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (A = t === "mouseover" || t === "pointerover", O = t === "mouseout" || t === "pointerout", A && l !== uu && (K = l.relatedTarget || l.fromElement) && (Ql(K) || K[Ll]))
            break t;
          if ((O || A) && (A = M.window === M ? M : (A = M.ownerDocument) ? A.defaultView || A.parentWindow : window, O ? (K = l.relatedTarget || l.toElement, O = T, K = K ? Ql(K) : null, K !== null && (St = S(K), L = K.tag, K !== St || L !== 5 && L !== 27 && L !== 6) && (K = null)) : (O = null, K = T), O !== K)) {
            if (L = kr, D = "onMouseLeave", b = "onMouseEnter", g = "mouse", (t === "pointerout" || t === "pointerover") && (L = Lr, D = "onPointerLeave", b = "onPointerEnter", g = "pointer"), St = O == null ? A : Hn(O), x = K == null ? A : Hn(K), A = new L(
              D,
              g + "leave",
              O,
              l,
              M
            ), A.target = St, A.relatedTarget = x, D = null, Ql(M) === T && (L = new L(
              b,
              g + "enter",
              K,
              l,
              M
            ), L.target = x, L.relatedTarget = St, D = L), St = D, O && K)
              e: {
                for (L = O, b = K, g = 0, x = L; x; x = zn(x))
                  g++;
                for (x = 0, D = b; D; D = zn(D))
                  x++;
                for (; 0 < g - x; )
                  L = zn(L), g--;
                for (; 0 < x - g; )
                  b = zn(b), x--;
                for (; g--; ) {
                  if (L === b || b !== null && L === b.alternate)
                    break e;
                  L = zn(L), b = zn(b);
                }
                L = null;
              }
            else L = null;
            O !== null && qs(
              N,
              A,
              O,
              L,
              !1
            ), K !== null && St !== null && qs(
              N,
              St,
              K,
              L,
              !0
            );
          }
        }
        t: {
          if (A = T ? Hn(T) : window, O = A.nodeName && A.nodeName.toLowerCase(), O === "select" || O === "input" && A.type === "file")
            var V = Ir;
          else if (Wr(A))
            if (Pr)
              V = Dh;
            else {
              V = Mh;
              var et = zh;
            }
          else
            O = A.nodeName, !O || O.toLowerCase() !== "input" || A.type !== "checkbox" && A.type !== "radio" ? T && iu(T.elementType) && (V = Ir) : V = wh;
          if (V && (V = V(t, T))) {
            Fr(
              N,
              V,
              l,
              M
            );
            break t;
          }
          et && et(t, A, T), t === "focusout" && T && A.type === "number" && T.memoizedProps.value != null && au(A, "number", A.value);
        }
        switch (et = T ? Hn(T) : window, t) {
          case "focusin":
            (Wr(et) || et.contentEditable === "true") && (en = et, bu = T, Xn = null);
            break;
          case "focusout":
            Xn = bu = en = null;
            break;
          case "mousedown":
            Su = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Su = !1, co(N, l, M);
            break;
          case "selectionchange":
            if (Nh) break;
          case "keydown":
          case "keyup":
            co(N, l, M);
        }
        var C;
        if (gu)
          t: {
            switch (t) {
              case "compositionstart":
                var Q = "onCompositionStart";
                break t;
              case "compositionend":
                Q = "onCompositionEnd";
                break t;
              case "compositionupdate":
                Q = "onCompositionUpdate";
                break t;
            }
            Q = void 0;
          }
        else
          tn ? Jr(t, l) && (Q = "onCompositionEnd") : t === "keydown" && l.keyCode === 229 && (Q = "onCompositionStart");
        Q && (Qr && l.locale !== "ko" && (tn || Q !== "onCompositionStart" ? Q === "onCompositionEnd" && tn && (C = Cr()) : (Ie = M, fu = "value" in Ie ? Ie.value : Ie.textContent, tn = !0)), et = _i(T, Q), 0 < et.length && (Q = new Xr(
          Q,
          t,
          null,
          l,
          M
        ), N.push({ event: Q, listeners: et }), C ? Q.data = C : (C = $r(l), C !== null && (Q.data = C)))), (C = xh ? Eh(t, l) : Th(t, l)) && (Q = _i(T, "onBeforeInput"), 0 < Q.length && (et = new Xr(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          M
        ), N.push({
          event: et,
          listeners: Q
        }), et.data = C)), hv(
          N,
          t,
          T,
          l,
          M
        );
      }
      Rs(N, e);
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
  function qs(t, e, l, n, a) {
    for (var i = e._reactName, u = []; l !== null && l !== n; ) {
      var c = l, d = c.alternate, T = c.stateNode;
      if (c = c.tag, d !== null && d === n) break;
      c !== 5 && c !== 26 && c !== 27 || T === null || (d = T, a ? (T = qn(l, i), T != null && u.unshift(
        pa(l, T, d)
      )) : a || (T = qn(l, i), T != null && u.push(
        pa(l, T, d)
      ))), l = l.return;
    }
    u.length !== 0 && t.push({ event: e, listeners: u });
  }
  var pv = /\r\n?/g, mv = /\u0000|\uFFFD/g;
  function js(t) {
    return (typeof t == "string" ? t : "" + t).replace(pv, `
`).replace(mv, "");
  }
  function Ys(t, e) {
    return e = js(e), js(t) === e;
  }
  function Ni() {
  }
  function bt(t, e, l, n, a, i) {
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
        n = Va("" + n), t.setAttribute(l, n);
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
          typeof i == "function" && (l === "formAction" ? (e !== "input" && bt(t, e, "name", a.name, a, null), bt(
            t,
            e,
            "formEncType",
            a.formEncType,
            a,
            null
          ), bt(
            t,
            e,
            "formMethod",
            a.formMethod,
            a,
            null
          ), bt(
            t,
            e,
            "formTarget",
            a.formTarget,
            a,
            null
          )) : (bt(t, e, "encType", a.encType, a, null), bt(t, e, "method", a.method, a, null), bt(t, e, "target", a.target, a, null)));
        if (n == null || typeof n == "symbol" || typeof n == "boolean") {
          t.removeAttribute(l);
          break;
        }
        n = Va("" + n), t.setAttribute(l, n);
        break;
      case "onClick":
        n != null && (t.onclick = Ni);
        break;
      case "onScroll":
        n != null && at("scroll", t);
        break;
      case "onScrollEnd":
        n != null && at("scrollend", t);
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
        l = Va("" + n), t.setAttributeNS(
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
        at("beforetoggle", t), at("toggle", t), qa(t, "popover", n);
        break;
      case "xlinkActuate":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          n
        );
        break;
      case "xlinkArcrole":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          n
        );
        break;
      case "xlinkRole":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          n
        );
        break;
      case "xlinkShow":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          n
        );
        break;
      case "xlinkTitle":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          n
        );
        break;
      case "xlinkType":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          n
        );
        break;
      case "xmlBase":
        He(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          n
        );
        break;
      case "xmlLang":
        He(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          n
        );
        break;
      case "xmlSpace":
        He(
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
  function Xc(t, e, l, n, a, i) {
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
        n != null && at("scroll", t);
        break;
      case "onScrollEnd":
        n != null && at("scrollend", t);
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
        at("error", t), at("load", t);
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
                  bt(t, e, i, u, l, null);
              }
          }
        a && bt(t, e, "srcSet", l.srcSet, l, null), n && bt(t, e, "src", l.src, l, null);
        return;
      case "input":
        at("invalid", t);
        var c = i = u = a = null, d = null, T = null;
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
                  T = M;
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
                  bt(t, e, n, M, l, null);
              }
          }
        Rr(
          t,
          i,
          c,
          d,
          T,
          u,
          a,
          !1
        ), Ya(t);
        return;
      case "select":
        at("invalid", t), n = u = i = null;
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
                bt(t, e, a, c, l, null);
            }
        e = i, l = u, t.multiple = !!n, e != null ? Wl(t, !!n, e, !1) : l != null && Wl(t, !!n, l, !0);
        return;
      case "textarea":
        at("invalid", t), i = a = n = null;
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
                bt(t, e, u, c, l, null);
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
                bt(t, e, d, n, l, null);
            }
        return;
      case "dialog":
        at("beforetoggle", t), at("toggle", t), at("cancel", t), at("close", t);
        break;
      case "iframe":
      case "object":
        at("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < ya.length; n++)
          at(ya[n], t);
        break;
      case "image":
        at("error", t), at("load", t);
        break;
      case "details":
        at("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        at("error", t), at("load", t);
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
        for (T in l)
          if (l.hasOwnProperty(T) && (n = l[T], n != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                bt(t, e, T, n, l, null);
            }
        return;
      default:
        if (iu(e)) {
          for (M in l)
            l.hasOwnProperty(M) && (n = l[M], n !== void 0 && Xc(
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
      l.hasOwnProperty(c) && (n = l[c], n != null && bt(t, e, c, n, l, null));
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
        var a = null, i = null, u = null, c = null, d = null, T = null, M = null;
        for (O in l) {
          var N = l[O];
          if (l.hasOwnProperty(O) && N != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                d = N;
              default:
                n.hasOwnProperty(O) || bt(t, e, O, null, n, N);
            }
        }
        for (var A in n) {
          var O = n[A];
          if (N = l[A], n.hasOwnProperty(A) && (O != null || N != null))
            switch (A) {
              case "type":
                i = O;
                break;
              case "name":
                a = O;
                break;
              case "checked":
                T = O;
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
                O !== N && bt(
                  t,
                  e,
                  A,
                  O,
                  n,
                  N
                );
            }
        }
        nu(
          t,
          u,
          c,
          d,
          T,
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
                n.hasOwnProperty(i) || bt(
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
                i !== d && bt(
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
                bt(t, e, c, null, n, a);
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
                a !== i && bt(t, e, u, a, n, i);
            }
        Hr(t, A, O);
        return;
      case "option":
        for (var K in l)
          if (A = l[K], l.hasOwnProperty(K) && A != null && !n.hasOwnProperty(K))
            switch (K) {
              case "selected":
                t.selected = !1;
                break;
              default:
                bt(
                  t,
                  e,
                  K,
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
                bt(
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
        for (var L in l)
          A = l[L], l.hasOwnProperty(L) && A != null && !n.hasOwnProperty(L) && bt(t, e, L, null, n, A);
        for (T in n)
          if (A = n[T], O = l[T], n.hasOwnProperty(T) && A !== O && (A != null || O != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(r(137, e));
                break;
              default:
                bt(
                  t,
                  e,
                  T,
                  A,
                  n,
                  O
                );
            }
        return;
      default:
        if (iu(e)) {
          for (var St in l)
            A = l[St], l.hasOwnProperty(St) && A !== void 0 && !n.hasOwnProperty(St) && Xc(
              t,
              e,
              St,
              void 0,
              n,
              A
            );
          for (M in n)
            A = n[M], O = l[M], !n.hasOwnProperty(M) || A === O || A === void 0 && O === void 0 || Xc(
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
    for (var b in l)
      A = l[b], l.hasOwnProperty(b) && A != null && !n.hasOwnProperty(b) && bt(t, e, b, null, n, A);
    for (N in n)
      A = n[N], O = l[N], !n.hasOwnProperty(N) || A === O || A == null && O == null || bt(t, e, N, A, n, O);
  }
  var Lc = null, Qc = null;
  function Ui(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Bs(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Vs(t, e) {
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
  var Cs = typeof setTimeout == "function" ? setTimeout : void 0, xv = typeof clearTimeout == "function" ? clearTimeout : void 0, Gs = typeof Promise == "function" ? Promise : void 0, Ev = typeof queueMicrotask == "function" ? queueMicrotask : typeof Gs != "undefined" ? function(t) {
    return Gs.resolve(null).then(t).catch(Tv);
  } : Cs;
  function Tv(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function vl(t) {
    return t === "head";
  }
  function ks(t, e) {
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
      if (t = Oe(t.nextSibling), t === null) break;
    }
    return null;
  }
  function Ov(t, e, l) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l || (t = Oe(t.nextSibling), t === null)) return null;
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
  function Oe(t) {
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
  function Xs(t) {
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
  function Ls(t, e, l) {
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
  var Ee = /* @__PURE__ */ new Map(), Qs = /* @__PURE__ */ new Set();
  function Ri(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var Je = Y.d;
  Y.d = {
    f: Mv,
    r: wv,
    D: Dv,
    C: _v,
    L: Nv,
    m: Uv,
    X: Hv,
    S: Rv,
    M: qv
  };
  function Mv() {
    var t = Je.f(), e = Ai();
    return t || e;
  }
  function wv(t) {
    var e = Zl(t);
    e !== null && e.tag === 5 && e.type === "form" ? sf(e) : Je.r(t);
  }
  var Mn = typeof document == "undefined" ? null : document;
  function Zs(t, e, l) {
    var n = Mn;
    if (n && typeof e == "string" && e) {
      var a = ge(e);
      a = 'link[rel="' + t + '"][href="' + a + '"]', typeof l == "string" && (a += '[crossorigin="' + l + '"]'), Qs.has(a) || (Qs.add(a), t = { rel: t, crossOrigin: l, href: e }, n.querySelector(a) === null && (e = n.createElement("link"), Qt(e, "link", t), Vt(e), n.head.appendChild(e)));
    }
  }
  function Dv(t) {
    Je.D(t), Zs("dns-prefetch", t, null);
  }
  function _v(t, e) {
    Je.C(t, e), Zs("preconnect", t, e);
  }
  function Nv(t, e, l) {
    Je.L(t, e, l);
    var n = Mn;
    if (n && t && e) {
      var a = 'link[rel="preload"][as="' + ge(e) + '"]';
      e === "image" && l && l.imageSrcSet ? (a += '[imagesrcset="' + ge(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (a += '[imagesizes="' + ge(
        l.imageSizes
      ) + '"]')) : a += '[href="' + ge(t) + '"]';
      var i = a;
      switch (e) {
        case "style":
          i = wn(t);
          break;
        case "script":
          i = Dn(t);
      }
      Ee.has(i) || (t = p(
        {
          rel: "preload",
          href: e === "image" && l && l.imageSrcSet ? void 0 : t,
          as: e
        },
        l
      ), Ee.set(i, t), n.querySelector(a) !== null || e === "style" && n.querySelector(ba(i)) || e === "script" && n.querySelector(Sa(i)) || (e = n.createElement("link"), Qt(e, "link", t), Vt(e), n.head.appendChild(e)));
    }
  }
  function Uv(t, e) {
    Je.m(t, e);
    var l = Mn;
    if (l && t) {
      var n = e && typeof e.as == "string" ? e.as : "script", a = 'link[rel="modulepreload"][as="' + ge(n) + '"][href="' + ge(t) + '"]', i = a;
      switch (n) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Dn(t);
      }
      if (!Ee.has(i) && (t = p({ rel: "modulepreload", href: t }, e), Ee.set(i, t), l.querySelector(a) === null)) {
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
        n = l.createElement("link"), Qt(n, "link", t), Vt(n), l.head.appendChild(n);
      }
    }
  }
  function Rv(t, e, l) {
    Je.S(t, e, l);
    var n = Mn;
    if (n && t) {
      var a = Kl(n).hoistableStyles, i = wn(t);
      e = e || "default";
      var u = a.get(i);
      if (!u) {
        var c = { loading: 0, preload: null };
        if (u = n.querySelector(
          ba(i)
        ))
          c.loading = 5;
        else {
          t = p(
            { rel: "stylesheet", href: t, "data-precedence": e },
            l
          ), (l = Ee.get(i)) && Fc(t, l);
          var d = u = n.createElement("link");
          Vt(d), Qt(d, "link", t), d._p = new Promise(function(T, M) {
            d.onload = T, d.onerror = M;
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
    Je.X(t, e);
    var l = Mn;
    if (l && t) {
      var n = Kl(l).hoistableScripts, a = Dn(t), i = n.get(a);
      i || (i = l.querySelector(Sa(a)), i || (t = p({ src: t, async: !0 }, e), (e = Ee.get(a)) && Ic(t, e), i = l.createElement("script"), Vt(i), Qt(i, "link", t), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, n.set(a, i));
    }
  }
  function qv(t, e) {
    Je.M(t, e);
    var l = Mn;
    if (l && t) {
      var n = Kl(l).hoistableScripts, a = Dn(t), i = n.get(a);
      i || (i = l.querySelector(Sa(a)), i || (t = p({ src: t, async: !0, type: "module" }, e), (e = Ee.get(a)) && Ic(t, e), i = l.createElement("script"), Vt(i), Qt(i, "link", t), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, n.set(a, i));
    }
  }
  function Ks(t, e, l, n) {
    var a = (a = W.current) ? Ri(a) : null;
    if (!a) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (e = wn(l.href), l = Kl(
          a
        ).hoistableStyles, n = l.get(e), n || (n = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(e, n)), n) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          t = wn(l.href);
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
          )) && !i._p && (u.instance = i, u.state.loading = 5), Ee.has(t) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Ee.set(t, l), i || jv(
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
  function wn(t) {
    return 'href="' + ge(t) + '"';
  }
  function ba(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Js(t) {
    return p({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function jv(t, e, l, n) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? n.loading = 1 : (e = t.createElement("link"), n.preload = e, e.addEventListener("load", function() {
      return n.loading |= 1;
    }), e.addEventListener("error", function() {
      return n.loading |= 2;
    }), Qt(e, "link", l), Vt(e), t.head.appendChild(e));
  }
  function Dn(t) {
    return '[src="' + ge(t) + '"]';
  }
  function Sa(t) {
    return "script[async]" + t;
  }
  function $s(t, e, l) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var n = t.querySelector(
            'style[data-href~="' + ge(l.href) + '"]'
          );
          if (n)
            return e.instance = n, Vt(n), n;
          var a = p({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return n = (t.ownerDocument || t).createElement(
            "style"
          ), Vt(n), Qt(n, "style", a), Hi(n, l.precedence, t), e.instance = n;
        case "stylesheet":
          a = wn(l.href);
          var i = t.querySelector(
            ba(a)
          );
          if (i)
            return e.state.loading |= 4, e.instance = i, Vt(i), i;
          n = Js(l), (a = Ee.get(a)) && Fc(n, a), i = (t.ownerDocument || t).createElement("link"), Vt(i);
          var u = i;
          return u._p = new Promise(function(c, d) {
            u.onload = c, u.onerror = d;
          }), Qt(i, "link", n), e.state.loading |= 4, Hi(i, l.precedence, t), e.instance = i;
        case "script":
          return i = Dn(l.src), (a = t.querySelector(
            Sa(i)
          )) ? (e.instance = a, Vt(a), a) : (n = l, (a = Ee.get(i)) && (n = p({}, l), Ic(n, a)), t = t.ownerDocument || t, a = t.createElement("script"), Vt(a), Qt(a, "link", n), t.head.appendChild(a), e.instance = a);
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
  function Ws(t, e, l) {
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
  function Fs(t, e, l) {
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
  function Is(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  var xa = null;
  function Bv() {
  }
  function Vv(t, e, l) {
    if (xa === null) throw Error(r(475));
    var n = xa;
    if (e.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var a = wn(l.href), i = t.querySelector(
          ba(a)
        );
        if (i) {
          t = i._p, t !== null && typeof t == "object" && typeof t.then == "function" && (n.count++, n = ji.bind(n), t.then(n, n)), e.state.loading |= 4, e.instance = i, Vt(i);
          return;
        }
        i = t.ownerDocument || t, l = Js(l), (a = Ee.get(a)) && Fc(l, a), i = i.createElement("link"), Vt(i);
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
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Yi = /* @__PURE__ */ new Map(), e.forEach(Gv, t), Yi = null, ji.call(t));
  }
  function Gv(t, e) {
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
    $$typeof: dt,
    Provider: null,
    Consumer: null,
    _currentValue: Z,
    _currentValue2: Z,
    _threadCount: 0
  };
  function kv(t, e, l, n, a, i, u, c) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $i(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $i(0), this.hiddenUpdates = $i(null), this.identifierPrefix = n, this.onUncaughtError = a, this.onCaughtError = i, this.onRecoverableError = u, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Ps(t, e, l, n, a, i, u, c, d, T, M, N) {
    return t = new kv(
      t,
      e,
      l,
      u,
      c,
      d,
      T,
      N
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
    a = td(a), n.context === null ? n.context = a : n.pendingContext = a, n = el(e), n.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (n.callback = i), l = ll(t, n, e), l !== null && (he(l, t, e), In(l, t, e));
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
  function Xv(t, e, l, n) {
    var a = w.T;
    w.T = null;
    var i = Y.p;
    try {
      Y.p = 2, er(t, e, l, n);
    } finally {
      Y.p = i, w.T = a;
    }
  }
  function Lv(t, e, l, n) {
    var a = w.T;
    w.T = null;
    var i = Y.p;
    try {
      Y.p = 8, er(t, e, l, n);
    } finally {
      Y.p = i, w.T = a;
    }
  }
  function er(t, e, l, n) {
    if (Bi) {
      var a = lr(n);
      if (a === null)
        kc(
          t,
          e,
          n,
          Vi,
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
                    Ue(i), (yt & 6) === 0 && (Ei = Me() + 500, ga(0));
                  }
                }
                break;
              case 13:
                c = an(i, 2), c !== null && he(c, i, 2), Ai(), tr(i, 2);
            }
          if (i = lr(n), i === null && kc(
            t,
            e,
            n,
            Vi,
            l
          ), i === a) break;
          a = i;
        }
        a !== null && n.stopPropagation();
      } else
        kc(
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
  var Vi = null;
  function nr(t) {
    if (Vi = null, t = Ql(t), t !== null) {
      var e = S(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (t = E(e), t !== null) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return Vi = t, null;
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
  var ar = !1, gl = null, yl = null, pl = null, Ta = /* @__PURE__ */ new Map(), Aa = /* @__PURE__ */ new Map(), ml = [], Qv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function id(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        gl = null;
        break;
      case "dragenter":
      case "dragleave":
        yl = null;
        break;
      case "mouseover":
      case "mouseout":
        pl = null;
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
        return gl = Oa(
          gl,
          t,
          e,
          l,
          n,
          a
        ), !0;
      case "dragenter":
        return yl = Oa(
          yl,
          t,
          e,
          l,
          n,
          a
        ), !0;
      case "mouseover":
        return pl = Oa(
          pl,
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
      var l = S(e);
      if (l !== null) {
        if (e = l.tag, e === 13) {
          if (e = E(l), e !== null) {
            t.blockedOn = e, Vd(t.priority, function() {
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
    ar = !1, gl !== null && Ci(gl) && (gl = null), yl !== null && Ci(yl) && (yl = null), pl !== null && Ci(pl) && (pl = null), Ta.forEach(cd), Aa.forEach(cd);
  }
  function Gi(t, e) {
    t.blockedOn === e && (t.blockedOn = null, ar || (ar = !0, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      Kv
    )));
  }
  var ki = null;
  function rd(t) {
    ki !== t && (ki = t, z.unstable_scheduleCallback(
      z.unstable_NormalPriority,
      function() {
        ki === t && (ki = null);
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
      return Gi(d, t);
    }
    gl !== null && Gi(gl, t), yl !== null && Gi(yl, t), pl !== null && Gi(pl, t), Ta.forEach(e), Aa.forEach(e);
    for (var l = 0; l < ml.length; l++) {
      var n = ml[l];
      n.blockedOn === t && (n.blockedOn = null);
    }
    for (; 0 < ml.length && (l = ml[0], l.blockedOn === null); )
      ud(l), l.blockedOn === null && ml.shift();
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
  Xi.prototype.render = ir.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(r(409));
    var l = e.current, n = de();
    ed(l, n, t, e, null, null);
  }, Xi.prototype.unmount = ir.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      ed(t.current, 2, null, t, null, null), Ai(), e[Ll] = null;
    }
  };
  function Xi(t) {
    this._internalRoot = t;
  }
  Xi.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = Tr();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < ml.length && e !== 0 && e < ml[l].priority; l++) ;
      ml.splice(l, 0, t), l === 0 && ud(t);
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
    return t = m(e), t = t !== null ? f(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Jv = {
    bundleType: 0,
    version: "19.1.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: w,
    reconcilerVersion: "19.1.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ != "undefined") {
    var Li = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Li.isDisabled && Li.supportsFiber)
      try {
        _n = Li.inject(
          Jv
        ), ie = Li;
      } catch (t) {
      }
  }
  return Ma.createRoot = function(t, e) {
    if (!h(t)) throw Error(r(299));
    var l = !1, n = "", a = Of, i = zf, u = Mf, c = null;
    return e != null && (e.unstable_strictMode === !0 && (l = !0), e.identifierPrefix !== void 0 && (n = e.identifierPrefix), e.onUncaughtError !== void 0 && (a = e.onUncaughtError), e.onCaughtError !== void 0 && (i = e.onCaughtError), e.onRecoverableError !== void 0 && (u = e.onRecoverableError), e.unstable_transitionCallbacks !== void 0 && (c = e.unstable_transitionCallbacks)), e = Ps(
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
    ), t[Ll] = e.current, Gc(t), new ir(e);
  }, Ma.hydrateRoot = function(t, e, l) {
    if (!h(t)) throw Error(r(299));
    var n = !1, a = "", i = Of, u = zf, c = Mf, d = null, T = null;
    return l != null && (l.unstable_strictMode === !0 && (n = !0), l.identifierPrefix !== void 0 && (a = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (u = l.onCaughtError), l.onRecoverableError !== void 0 && (c = l.onRecoverableError), l.unstable_transitionCallbacks !== void 0 && (d = l.unstable_transitionCallbacks), l.formState !== void 0 && (T = l.formState)), e = Ps(
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
      T
    ), e.context = td(null), l = e.current, n = de(), n = Wi(n), a = el(n), a.callback = null, ll(l, a, n), l = n, e.current.lanes = l, Un(e, l), Ue(e), t[Ll] = e.current, Gc(t), new Xi(e);
  }, Ma.version = "19.1.1", Ma;
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
var i0 = a0(), sr = { exports: {} }, wa = {};
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
  if (md) return wa;
  md = 1;
  var z = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function s(r, h, S) {
    var E = null;
    if (S !== void 0 && (E = "" + S), h.key !== void 0 && (E = "" + h.key), "key" in h) {
      S = {};
      for (var y in h)
        y !== "key" && (S[y] = h[y]);
    } else S = h;
    return h = S.ref, {
      $$typeof: z,
      type: r,
      key: E,
      ref: h !== void 0 ? h : null,
      props: S
    };
  }
  return wa.Fragment = o, wa.jsx = s, wa.jsxs = s, wa;
}
var bd;
function c0() {
  return bd || (bd = 1, sr.exports = u0()), sr.exports;
}
var ct = c0();
let r0;
const o0 = () => r0;
function I(z, o, s, r) {
  return new (s || (s = Promise))(function(h, S) {
    function E(f) {
      try {
        m(r.next(f));
      } catch (p) {
        S(p);
      }
    }
    function y(f) {
      try {
        m(r.throw(f));
      } catch (p) {
        S(p);
      }
    }
    function m(f) {
      var p;
      f.done ? h(f.value) : (p = f.value, p instanceof s ? p : new s(function(_) {
        _(p);
      })).then(E, y);
    }
    m((r = r.apply(z, o || [])).next());
  });
}
const Td = "NON_LOCAL_STORAGE_LOCAL_ID", f0 = (z, o) => typeof window != "undefined" && window.localStorage ? window.localStorage.getItem(`${Td}:${z}:${o}`) : null, s0 = (z, o, s) => {
  typeof window != "undefined" && window.localStorage && window.localStorage.setItem(`${Td}:${z}:${o}`, s);
};
function d0(z, o, s) {
  return I(this, arguments, void 0, function* (r, h, S, E = { iterations: 1e5, hash: "SHA-512", derivedKeyType: { name: "AES-GCM", length: 256 } }) {
    const y = new TextEncoder(), m = yield crypto.subtle.importKey("raw", y.encode(r + ":" + h), "PBKDF2", !1, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt: S, iterations: (E == null ? void 0 : E.iterations) || 1e5, hash: (E == null ? void 0 : E.hash) || "SHA-512" }, m, (E == null ? void 0 : E.derivedKeyType) || { name: "AES-GCM", length: 256 }, !1, ["encrypt", "decrypt"]);
  });
}
function h0(z, o) {
  return I(this, arguments, void 0, function* (s, r, h = { algorithm: "AES-GCM" }) {
    const S = new TextEncoder(), E = crypto.getRandomValues(new Uint8Array(12)), y = yield crypto.subtle.encrypt({ name: (h == null ? void 0 : h.algorithm) || "AES-GCM", iv: E }, s, S.encode(r));
    return JSON.stringify({ iv: btoa(String.fromCharCode(...E)), data: btoa(String.fromCharCode(...new Uint8Array(y))) });
  });
}
function v0(z, o) {
  return I(this, arguments, void 0, function* (s, r, h = { algorithm: "AES-GCM" }) {
    const S = JSON.parse(r), E = new TextDecoder(), y = Uint8Array.from(atob(S.iv), (p) => p.charCodeAt(0)), m = Uint8Array.from(atob(S.data), (p) => p.charCodeAt(0)), f = yield crypto.subtle.decrypt({ name: (h == null ? void 0 : h.algorithm) || "AES-GCM", iv: y }, s, m);
    return E.decode(f);
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
  const [s, r, h] = o, S = dr(s);
  let E;
  try {
    E = JSON.parse(S);
  } catch (f) {
    throw new Error("Invalid JWT header JSON: " + f.message);
  }
  const y = dr(r);
  let m;
  try {
    m = JSON.parse(y);
  } catch (f) {
    throw new Error("Invalid JWT payload JSON: " + f.message);
  }
  return { header: E, payload: m, signatureHex: function(f) {
    let p = "";
    for (let _ = 0; _ < f.length; _++) p += f.charCodeAt(_).toString(16).padStart(2, "0");
    return p;
  }(dr(h)) };
}
const ot = Symbol("vaultrice/credentials"), Zt = Symbol("vaultrice/encryptionSettings"), kl = Symbol("vaultrice/previousEncryptionSettings"), Re = Symbol("vaultrice/errorHandlers"), jt = Symbol("vaultrice/ws"), ze = Symbol("vaultrice/eventHandlers"), Da = Symbol("vaultrice/accessTokenExpiringHandlers"), p0 = { enabled: !0, maxOperations: 100, windowMs: 6e4, operationDelay: 0 };
let m0 = class {
  constructor(o) {
    this.operationHistory = [], this.lastOperationTime = 0, this.operationConfig = Object.assign(Object.assign({}, p0), o || {});
  }
  updateConfig(o) {
    this.operationConfig = Object.assign(Object.assign({}, this.operationConfig), o);
  }
  cleanupHistory(o, s) {
    const r = Date.now() - s, h = o.findIndex((S) => S.timestamp > r);
    h > 0 ? o.splice(0, h) : h === -1 && (o.length = 0);
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
    return I(this, void 0, void 0, function* () {
      if (!this.operationConfig.enabled) return;
      if (!this.isAllowed(this.operationHistory, this.operationConfig.maxOperations, this.operationConfig.windowMs)) throw new Error(`Operation rate limit exceeded. Maximum ${this.operationConfig.maxOperations} operations per ${this.operationConfig.windowMs}ms allowed.`);
      const o = this.calculateDelay(this.lastOperationTime, this.operationConfig.operationDelay);
      var s;
      o > 0 && (yield (s = o, new Promise((h) => setTimeout(h, s))));
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
  return f0(z, o) || `${Sd()}-${Sd()}`;
}
const Xl = "_undefined_";
class Sl {
  constructor(o, s = { class: Xl, autoUpdateOldEncryptedValues: !0, logLevel: "warn" }) {
    this.class = Xl, this[Od] = [];
    let r = { class: Xl, logLevel: "warn" };
    if (typeof s == "string" ? (this.id = s, r = { class: Xl, logLevel: "warn" }) : (this.id = s.id || b0(o.projectId, s.class || Xl), r = s), this.logger = Ed(r.logLevel), !o || typeof o != "object" || typeof o.projectId != "string") throw new Error("Invalid credentials!");
    const h = typeof o.apiKey == "string" && typeof o.apiSecret == "string", S = typeof o.accessToken == "string", E = typeof o.getAccessToken == "function", y = [h, E].filter(Boolean).length, m = S && !E;
    if (y === 0 && !m) throw new Error("Invalid credentials! Must provide one of: (apiKey + apiSecret), accessToken, or getAccessToken function");
    if (y > 1 || m && y > 0) throw new Error("Invalid credentials! Provide only one primary authentication method. You can combine getAccessToken with an initial accessToken for performance.");
    if ((o.apiKey || o.apiSecret) && !h) throw new Error("Invalid credentials! Both apiKey and apiSecret are required when using direct authentication");
    if (this.throttleManager = new m0(r.throttling), typeof s == "string" || s != null && s.id || s0(o.projectId, s.class || Xl, this.id), this[ot] = Object.assign({}, o), typeof this[ot].apiKey == "string" || typeof this[ot].apiSecret == "string" || typeof this[ot].accessToken != "string" && !o.getAccessToken || (delete this[ot].apiKey, delete this[ot].apiSecret), o.getAccessToken && (this.getAccessTokenFn = o.getAccessToken, delete this[ot].getAccessToken), this.class = r.class || Xl, r.passphrase && r.getEncryptionHandler) throw new Error("Either define a passphrase or a getEncryptionHandler, but not both!");
    if (r.getEncryptionHandler && (this.getEncryptionHandler = r.getEncryptionHandler), r.passphrase && (this.getEncryptionHandler = (f) => I(this, void 0, void 0, function* () {
      var p, _, U, H;
      const G = yield d0(r.passphrase, this.id, f.salt, r.keyDerivationOptions), k = !((_ = (p = r.keyDerivationOptions) === null || p === void 0 ? void 0 : p.derivedKeyType) === null || _ === void 0) && _.name ? { algorithm: (H = (U = r.keyDerivationOptions) === null || U === void 0 ? void 0 : U.derivedKeyType) === null || H === void 0 ? void 0 : H.name } : void 0;
      return { encrypt: (J) => h0(G, J, k), decrypt: (J) => v0(G, J, k) };
    })), r.autoUpdateOldEncryptedValues === void 0 && (r.autoUpdateOldEncryptedValues = !0), this.autoUpdateOldEncryptedValues = r.autoUpdateOldEncryptedValues, r.idSignature && (this.idSignature = r.idSignature), this.idSignature && (this.idSignatureKeyVersion = r.idSignatureKeyVersion), E) if (S) {
      this.logger.log("debug", "Using token provider with initial access token");
      try {
        this.useAccessTokenAndRememberToAcquireTheNext(this[ot].accessToken);
      } catch (f) {
        this.logger.log("warn", "Initial access token is invalid, acquiring new token"), this[ot].accessToken = void 0, this.isGettingAccessToken = this.acquireAccessToken(), this.isGettingAccessToken.then(() => {
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
    else S || (this.isGettingAccessToken = this.acquireAccessToken(), this.isGettingAccessToken.then(() => {
      this.isGettingAccessToken = void 0;
    }).catch(() => {
      this.isGettingAccessToken = void 0;
    }));
  }
  static executeWithRetry(o, s, r) {
    return I(this, arguments, void 0, function* (h, S, E, y = {}) {
      var m, f, p, _;
      const { maxRetries: U = 3, initialDelay: H = 100, maxDelay: G = 2e3, backoffMultiplier: k = 2 } = y;
      let J, it = 0;
      for (; it <= U; ) try {
        return yield h();
      } catch (lt) {
        J = lt;
        let dt = !1, P = "";
        const q = ["Please try again in a moment", "Please retry", "Service temporarily unavailable", "temporarily unavailable", "try again later"];
        if (lt && typeof lt == "object") {
          P = lt.message || lt.toString();
          const rt = (m = lt == null ? void 0 : lt.cause) === null || m === void 0 ? void 0 : m.code;
          rt && rt.indexOf("retry") > -1 ? dt = !0 : P && (dt = q.some((Rt) => P.toLowerCase().includes(Rt.toLowerCase())));
        } else typeof lt == "string" ? (P = lt, dt = q.some((rt) => P.toLowerCase().includes(rt.toLowerCase()))) : (dt = (lt == null ? void 0 : lt.name) === "TypeError" || ((f = lt == null ? void 0 : lt.message) === null || f === void 0 ? void 0 : f.includes("fetch")) || ((p = lt == null ? void 0 : lt.message) === null || p === void 0 ? void 0 : p.includes("network")) || ((_ = lt == null ? void 0 : lt.message) === null || _ === void 0 ? void 0 : _.includes("timeout")), P = (lt == null ? void 0 : lt.message) || "Unknown error");
        if (dt && it < U) {
          E && E.log("warn", `${S} failed (attempt ${it + 1}/${U + 1}): ${P}. Retrying...`), it++;
          const rt = Math.min(H * Math.pow(k, it - 1), G), Rt = rt + Math.random() * (0.1 * rt);
          E && E.log("debug", `Waiting ${Math.round(Rt)}ms before retry attempt ${it + 1}`), yield new Promise((gt) => setTimeout(gt, Rt));
          continue;
        }
        throw lt;
      }
      throw J;
    });
  }
  static retrieveAccessToken(o, s, r, h) {
    return I(this, void 0, void 0, function* () {
      if (typeof o != "string" || !o) throw new Error("projectId not valid!");
      if (typeof s != "string" || !s) throw new Error("apiKey not valid!");
      if (typeof r != "string" || !r) throw new Error("apiSecret not valid!");
      const S = { Authorization: `Basic ${btoa(`${s}:${r}`)}` };
      return typeof (h == null ? void 0 : h.origin) == "string" && (h == null ? void 0 : h.origin.length) > 0 && (S.Origin = h.origin), Sl.executeWithRetry(() => I(this, void 0, void 0, function* () {
        var E;
        const y = yield fetch(`${Sl.basePath}/project/${o}/auth/token`, { method: "GET", headers: S }), m = y.headers.get("content-type");
        let f;
        if (m) try {
          m.indexOf("text/plain") === 0 ? f = yield y.text() : m.indexOf("application/json") === 0 && (f = yield y.json());
        } catch (p) {
          f = `${y.status} - ${y.statusText}`;
        }
        if (!y.ok) {
          if (y.status === 403 && f && ((E = f == null ? void 0 : f.cause) === null || E === void 0 ? void 0 : E.code) === "authorizationError.origin.server.notFound" && (f.message = 'Failed to retrieve access token: access denied. This is due to an API key origin restriction. If minting a token from a backend for use in a browser, pass the browser-origin when calling retrieveAccessToken() e.g. NonLocalStorage.retrieveAccessToken("projectId", "apiKey", "apiSecret", { origin: req.headers.origin }).'), typeof f == "string") throw new Error(f);
          if (f) throw f;
          if (y.status !== 404) throw new Error(`${y.status} - ${y.statusText}`);
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
    return I(this, void 0, void 0, function* () {
      try {
        let o;
        if (this.getAccessTokenFn) {
          if (this.logger.log("debug", "Acquiring access token via custom provider"), o = yield this.getAccessTokenFn(), typeof o != "string" || !o) throw new Error("getAccessToken function must return a non-empty string");
        } else {
          if (!this[ot].apiKey || !this[ot].apiSecret) throw new Error("No authentication method available for token acquisition");
          this.logger.log("debug", "Acquiring access token via API key/secret"), o = yield Sl.retrieveAccessToken(this[ot].projectId, this[ot].apiKey, this[ot].apiSecret);
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
    this[ot].accessToken = o;
    const r = s.payload.exp - Date.now();
    if (r - 12e4 < 0) throw new Error("accessToken not valid anymore");
    return setTimeout(() => {
      this[Da].forEach((h) => h());
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
    return I(this, void 0, void 0, function* () {
      var s, r, h, S;
      if (o > -1 && (o !== ((s = this[Zt]) === null || s === void 0 ? void 0 : s.keyVersion) && (this[kl] && this[kl].length !== 0 || (yield this.getEncryptionSettings())), o !== ((r = this[Zt]) === null || r === void 0 ? void 0 : r.keyVersion))) {
        if (!this[kl] || this[kl].length === 0) throw new Error(`Wrong keyVersion! Found ${o} but you're using ${(h = this[Zt]) === null || h === void 0 ? void 0 : h.keyVersion}`);
        let E = this[kl].find((y) => y.keyVersion === o);
        if (E || (yield this.getEncryptionSettings()), E = (this[kl] || []).find((y) => y.keyVersion === o), !E) throw new Error(`Wrong keyVersion! Found ${o} but you're using ${(S = this[Zt]) === null || S === void 0 ? void 0 : S.keyVersion}`);
        return this.getEncryptionHandler ? this.getEncryptionHandler(E) : void 0;
      }
      return this.encryptionHandler;
    });
  }
  handleEncryptionSettings(o) {
    return I(this, void 0, void 0, function* () {
      if (!this.getEncryptionHandler) throw new Error("No getEncryptionHandler defined!");
      this[Zt] = o.encryptionSettings, this[kl] = o.previousEncryptionSettings, this.encryptionHandler = yield this.getEncryptionHandler(o.encryptionSettings);
    });
  }
  prepareEncryptionSettings(o) {
    var s, r, h;
    return { encryptionSettings: { salt: Uint8Array.from(atob((s = o == null ? void 0 : o.encryptionSettings) === null || s === void 0 ? void 0 : s.salt), (S) => S.charCodeAt(0)), keyVersion: (r = o == null ? void 0 : o.encryptionSettings) === null || r === void 0 ? void 0 : r.keyVersion, createdAt: (h = o == null ? void 0 : o.encryptionSettings) === null || h === void 0 ? void 0 : h.createdAt }, previousEncryptionSettings: ((o == null ? void 0 : o.previousEncryptionSettings) || []).map((S) => ({ salt: Uint8Array.from(atob(S == null ? void 0 : S.salt), (E) => E.charCodeAt(0)), keyVersion: S == null ? void 0 : S.keyVersion, createdAt: S == null ? void 0 : S.createdAt })) };
  }
  getEncryptionSettings(o) {
    return I(this, void 0, void 0, function* () {
      if (!this.getEncryptionHandler) throw new Error("No passphrase and no getEncryptionHandler passed! This function is only allowed with e2e encryption!");
      const s = yield this.request("POST", `/cache-encryption/${this.class}/${this.id}`, o && o > 0 ? { saltLength: o } : {}), r = this.prepareEncryptionSettings(s);
      return yield this.handleEncryptionSettings(r), r;
    });
  }
  rotateEncryption(o) {
    return I(this, void 0, void 0, function* () {
      if (!this.getEncryptionHandler) throw new Error("No passphrase and no getEncryptionHandler passed! This function is only allowed with e2e encryption!");
      const s = yield this.request("POST", `/cache-encryption-rotate/${this.class}/${this.id}`, o && o > 0 ? { saltLength: o } : {}), r = this.prepareEncryptionSettings(s);
      return yield this.handleEncryptionSettings(r), r;
    });
  }
  request(o, s, r) {
    return I(this, void 0, void 0, function* () {
      !this[ot].accessToken && this.isGettingAccessToken && (yield this.isGettingAccessToken);
      try {
        yield this.throttleManager.throttleOperation();
      } catch (h) {
        throw this.logger.log("error", `Request throttled: ${h == null ? void 0 : h.message}`), h;
      }
      return Sl.executeWithRetry(() => I(this, void 0, void 0, function* () {
        var h;
        const S = this[ot].apiKey && this[ot].apiSecret ? `Basic ${btoa(`${this[ot].apiKey}:${this[ot].apiSecret}`)}` : void 0, E = this[ot].accessToken ? `Bearer ${this[ot].accessToken}` : void 0;
        let y = this[ot].accessToken ? E : S;
        if (s === "/auth/token" && (y = S), !y) throw new Error("No authentication option provided! (apiKey + apiSecret or accessToken)");
        const m = { Authorization: y }, f = typeof r == "string", p = (h = this[Zt]) === null || h === void 0 ? void 0 : h.keyVersion;
        p !== void 0 && p > -1 && (m["X-Enc-KV"] = p.toString()), this.idSignature && (m["X-Id-Sig"] = this.idSignature, this.idSignatureKeyVersion !== void 0 && (m["X-Id-Sig-KV"] = this.idSignatureKeyVersion.toString())), r && (m["Content-Type"] = f ? "text/plain" : "application/json");
        const _ = yield fetch(`${Sl.basePath}/project/${this[ot].projectId}${s}`, { method: o, headers: m, body: r ? f ? r : JSON.stringify(r) : void 0 }), U = _.headers.get("content-type");
        let H;
        if (U) try {
          U.indexOf("text/plain") === 0 ? H = yield _.text() : U.indexOf("application/json") === 0 && (H = yield _.json());
        } catch (G) {
          H = `${_.status} - ${_.statusText}`;
        }
        if (!_.ok) {
          if (typeof H == "string") throw new Error(H);
          if (H) throw H;
          if (_.status !== 404) throw new Error(`${_.status} - ${_.statusText}`);
        }
        return H;
      }), "API request", this.logger);
    });
  }
}
Od = Da, Sl.basePath = "https://api.vaultrice.app";
var zd;
let S0 = class Md extends Sl {
  constructor(o, s) {
    var r, h, S, E, y, m, f, p, _, U;
    super(o, s), this[zd] = /* @__PURE__ */ new Map(), this.reconnectAttempts = 0, this.reconnectBaseDelay = 1e3, this.reconnectMaxDelay = 6e4, this.isConnected = !1, this.pingInterval = 2e4, this.pongTimeout = 1e4, this.hasJoined = !1, this[Re] = [], this[ze] = /* @__PURE__ */ new Map();
    const H = typeof s == "object" ? s : {};
    this.configuredAutoReconnect = (h = (r = H.connectionSettings) === null || r === void 0 ? void 0 : r.autoReconnect) === null || h === void 0 || h, this.autoReconnect = this.configuredAutoReconnect, this.reconnectBaseDelay = (E = (S = H.connectionSettings) === null || S === void 0 ? void 0 : S.reconnectBaseDelay) !== null && E !== void 0 ? E : 1e3, this.reconnectMaxDelay = (m = (y = H.connectionSettings) === null || y === void 0 ? void 0 : y.reconnectMaxDelay) !== null && m !== void 0 ? m : 3e4, this.pingInterval = (p = (f = H.connectionSettings) === null || f === void 0 ? void 0 : f.pingInterval) !== null && p !== void 0 ? p : 2e4, this.pongTimeout = (U = (_ = H.connectionSettings) === null || _ === void 0 ? void 0 : _.pongTimeout) !== null && U !== void 0 ? U : 1e4;
  }
  send(o) {
    return I(this, arguments, void 0, function* (s, r = { transport: "ws" }) {
      var h, S, E;
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      const y = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(s)) : s;
      if (r.transport === "http") {
        try {
          yield this.request("POST", `/message/${this.class}/${this.id}`, y);
        } catch (p) {
          if (!p || ((h = p == null ? void 0 : p.cause) === null || h === void 0 ? void 0 : h.code) !== "conflictError.keyVersion.mismatch") throw p;
          this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), yield this.request("POST", `/message/${this.class}/${this.id}`, y);
        }
        return;
      }
      const m = yield this.getWebSocket();
      try {
        yield this.throttleManager.throttleOperation();
      } catch (p) {
        throw this.logger.log("error", `WebSocket message throttled: ${p == null ? void 0 : p.message}`), p;
      }
      const f = { event: "message", payload: y };
      this[Zt] && ((S = this[Zt]) === null || S === void 0 ? void 0 : S.keyVersion) > -1 && (f.keyVersion = (E = this[Zt]) === null || E === void 0 ? void 0 : E.keyVersion), m.send(JSON.stringify(f));
    });
  }
  on(o, s, r) {
    this.getWebSocket(!1).then((h) => {
      this[ze].has(o) || this[ze].set(o, /* @__PURE__ */ new Set());
      const S = this[ze].get(o);
      if (o === "error") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s;
        this[Re].push(y);
        const m = (f) => {
          try {
            const p = (f == null ? void 0 : f.message) || (f == null ? void 0 : f.data) || (f == null ? void 0 : f.type) || (typeof f == "string" ? f : "WebSocket error occurred");
            y(new Error(p));
          } catch (p) {
            y(new Error("WebSocket error occurred"));
          }
        };
        h.addEventListener("error", m), S.add({ handler: y, wsListener: m });
      }
      if (o === "connect") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s;
        S.add({ handler: y });
      }
      if (o === "disconnect") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s, m = () => y();
        h.addEventListener("close", m), S.add({ handler: y, wsListener: m });
      }
      const E = (y, m, f = !1) => {
        const p = f ? y.keyVersion : y.payload.keyVersion;
        if (p === void 0) return m(y.payload);
        if (p > -1) {
          if (!this.getEncryptionHandler) return this[Re].forEach((U) => U(new Error("Encrypted data, but no passphrase or getEncryptionHandler configured!")));
          if (!this.encryptionHandler) return this[Re].forEach((U) => U(new Error("Encrypted data, but getEncryptionSettings() not called!")));
          let _ = y.payload.value;
          f && (_ = y.payload), this.getEncryptionHandlerForKeyVersion(p).then((U) => U == null ? void 0 : U.decrypt(_)).then((U) => {
            f ? y.payload = JSON.parse(U) : y.payload.value = JSON.parse(U), m(y.payload);
          }).catch((U) => {
            this[Re].forEach((H) => H(U));
          });
        }
      };
      if (o === "message") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s, m = (f) => {
          const p = JSON.parse(f.data);
          p.event === "message" && E(p, y, !0);
        };
        h.addEventListener("message", m), S.add({ handler: y, wsListener: m });
      }
      if (o === "presence:join") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s, m = (f) => {
          const p = JSON.parse(f.data);
          p.event === "presence:join" && E(p, (_) => {
            y({ connectionId: p == null ? void 0 : p.connectionId, joinedAt: p == null ? void 0 : p.joinedAt, data: _ });
          }, !0);
        };
        h.addEventListener("message", m), S.add({ handler: y, wsListener: m });
      }
      if (o === "presence:leave") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s, m = (f) => {
          const p = JSON.parse(f.data);
          p.event === "presence:leave" && E(p, (_) => {
            y({ connectionId: p == null ? void 0 : p.connectionId, data: _ });
          }, !0);
        };
        h.addEventListener("message", m), S.add({ handler: y, wsListener: m });
      }
      if (o === "setItem") if (r === void 0) {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s, m = (f) => {
          const p = JSON.parse(f.data);
          p.event === "setItem" && E(p, y);
        };
        h.addEventListener("message", m), S.add({ handler: y, wsListener: m });
      } else {
        if (typeof r != "function") throw new Error("No event handler defined!");
        const y = r, m = s, f = (p) => {
          const _ = JSON.parse(p.data);
          _.event === "setItem" && _.payload.prop === m && E(_, y);
        };
        h.addEventListener("message", f), S.add({ handler: y, wsListener: f, itemName: m });
      }
      if (o === "removeItem") if (r === void 0) {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const y = s, m = (f) => {
          const p = JSON.parse(f.data);
          p.event === "removeItem" && y(p.payload);
        };
        h.addEventListener("message", m), S.add({ handler: y, wsListener: m });
      } else {
        if (typeof r != "function") throw new Error("No event handler defined!");
        const y = r, m = s, f = (p) => {
          const _ = JSON.parse(p.data);
          _.event === "removeItem" && _.payload.prop === m && y(_.payload);
        };
        h.addEventListener("message", f), S.add({ handler: y, wsListener: f, itemName: m });
      }
    });
  }
  off(o, s, r) {
    const h = this[ze].get(o);
    if (h) {
      if (o === "error") {
        if (typeof s != "function") throw new Error("No event handler defined!");
        const S = s, E = this[Re].indexOf(S);
        E > -1 && this[Re].splice(E, 1);
        for (const y of h) if (y.handler === S) {
          this[jt] && y.wsListener && this[jt].removeEventListener("error", y.wsListener), h.delete(y);
          break;
        }
      } else {
        if (!this[jt]) return;
        const S = this[jt];
        let E, y;
        if (r === void 0) {
          if (typeof s != "function") throw new Error("No event handler defined!");
          E = s;
        } else {
          if (typeof r != "function") throw new Error("No event handler defined!");
          E = r, y = s;
        }
        for (const m of h) {
          const f = m.handler === E, p = y === void 0 || m.itemName === y;
          if (f && p) {
            if (m.wsListener) {
              const _ = o === "connect" ? "open" : o === "disconnect" ? "close" : o === "error" ? "error" : "message";
              S.removeEventListener(_, m.wsListener);
            }
            h.delete(m);
            break;
          }
        }
      }
      h.size === 0 && this[ze].delete(o), this[ze].size === 0 && this[Re].length === 0 && this.disconnect();
    }
  }
  connect() {
    return I(this, void 0, void 0, function* () {
      this[jt] || (yield this.getWebSocket());
    });
  }
  disconnect() {
    return I(this, void 0, void 0, function* () {
      this.autoReconnect = !1, this[jt] && (this.hasJoined && (yield this.leave()), this[jt].close(), delete this[jt], this[ze].clear(), this[Re].length = 0);
    });
  }
  getWebSocket() {
    return I(this, arguments, void 0, function* (o = !0) {
      if (!this[ot].accessToken && this.isGettingAccessToken && (yield this.isGettingAccessToken), this[jt]) return o && this[jt].readyState === WebSocket.CONNECTING ? new Promise((p, _) => {
        const U = this[jt], H = () => {
          U.removeEventListener("open", G), U.removeEventListener("error", k), U.removeEventListener("close", J);
        }, G = () => {
          H(), p(U);
        }, k = (it) => {
          H(), _(it || new Error("WebSocket connection failed"));
        }, J = () => {
          H(), _(new Error("WebSocket connection closed during opening"));
        };
        U.readyState !== WebSocket.OPEN ? (U.addEventListener("open", G, { once: !0 }), U.addEventListener("error", k, { once: !0 }), U.addEventListener("close", J, { once: !0 })) : p(U);
      }) : this[jt];
      this.autoReconnect = this.configuredAutoReconnect;
      const s = Md.basePath.replace("http", "ws"), r = this[ot].apiKey && this[ot].apiSecret ? `Basic ${btoa(`${this[ot].apiKey}:${this[ot].apiSecret}`)}` : void 0, h = this[ot].accessToken ? `Bearer ${this[ot].accessToken}` : void 0, S = { auth: this[ot].accessToken ? h : r };
      this.idSignature && (S.idSignature = this.idSignature, this.idSignatureKeyVersion !== void 0 && (S.idSignatureKeyVersion = this.idSignatureKeyVersion));
      const E = new URLSearchParams(S), y = this[jt] = new WebSocket(`${s}/project/${this[ot].projectId}/ws/${this.class}/${this.id}?${E}`);
      this.logger.log("info", "initializing WebSocket connection...");
      let m;
      y.addEventListener("message", (p) => {
        let _;
        try {
          _ = typeof p.data == "string" ? JSON.parse(p.data) : void 0;
        } catch (H) {
          _ = void 0;
        }
        if (!_ || typeof _ != "object") return;
        const U = _.event;
        if (U) {
          if (U !== "pong") if (U !== "connected" && U !== "resume:ack" || !_.connectionId) {
            if (U === "error") {
              const H = _.payload;
              if (typeof H == "string" && H.toLowerCase().includes("invalid resume") && (this.logger.log("warn", "server signalled invalid resume token — clearing saved connectionId"), this.connectionId = void 0, typeof p.stopImmediatePropagation == "function")) try {
                p.stopImmediatePropagation();
              } catch (G) {
              }
            }
          } else {
            this.connectionId = _.connectionId, this.isConnected = !0;
            const H = this[ze].get("connect");
            if (H) for (const G of H) try {
              G.handler();
            } catch (k) {
              this.logger.log("error", k);
            }
            if (typeof p.stopImmediatePropagation == "function") try {
              p.stopImmediatePropagation();
            } catch (G) {
            }
          }
          else if (this.logger.log("debug", "received pong"), this.clearPongTimer(), typeof p.stopImmediatePropagation == "function") try {
            p.stopImmediatePropagation();
          } catch (H) {
          }
        }
      });
      const f = new Promise((p) => {
        m = p;
      });
      return y.addEventListener("open", () => {
        if (this.reconnectAttempts = 0, this.connectionId) try {
          y.send(JSON.stringify({ event: "resume", connectionId: this.connectionId }));
        } catch (p) {
        }
        this.startHeartbeat(), typeof m == "function" && m(y);
      }, { once: !0 }), y.addEventListener("close", (p) => {
        this.isConnected = !1, this.stopHeartbeat();
      }, { once: !0 }), y.addEventListener("close", (p) => {
        (p == null ? void 0 : p.code) === 1008 && (this.logger.log("warn", "WebSocket closed with 1008 during reconnection"), this.connectionId = void 0), p != null && p.reason && (p == null ? void 0 : p.reason.indexOf("TierLimitExceeded")) > -1 && (this.autoReconnect = !1, this.logger.log("error", p.reason), this[Re].forEach((H) => H(new Error(p.reason)))), delete this[jt];
        const _ = this.hasJoined, U = this.lastJoinData;
        if (this.hasJoined && (this.hasJoined = !1), this.autoReconnect) {
          const H = () => I(this, void 0, void 0, function* () {
            const G = Math.min(this.reconnectBaseDelay * Math.pow(2, this.reconnectAttempts), this.reconnectMaxDelay);
            setTimeout(() => I(this, void 0, void 0, function* () {
              let k;
              this.reconnectAttempts++, this.logger.log("warn", `${this.reconnectAttempts}. reconnection attempt...`);
              try {
                delete this[jt], k = yield this.getWebSocket(!1);
              } catch (q) {
                return this.logger.log("error", (q == null ? void 0 : q.message) || (q == null ? void 0 : q.name) || (q == null ? void 0 : q.type) || q), void H();
              }
              const J = () => I(this, void 0, void 0, function* () {
                if (this.reconnectAttempts = 0, !this[jt]) return;
                const q = this[jt];
                for (const [rt, Rt] of this[ze]) for (const gt of Rt) {
                  let xt;
                  rt === "connect" || (rt === "disconnect" ? (xt = () => gt.handler(), q.addEventListener("close", xt)) : rt === "error" ? (xt = (vt) => {
                    try {
                      const $ = (vt == null ? void 0 : vt.message) || (vt == null ? void 0 : vt.data) || (vt == null ? void 0 : vt.type) || (typeof vt == "string" ? vt : "WebSocket error occurred");
                      gt.handler(new Error($));
                    } catch ($) {
                      gt.handler(new Error("WebSocket error occurred"));
                    }
                  }, q.addEventListener("error", xt)) : rt === "message" ? (xt = (vt) => {
                    let $;
                    try {
                      $ = typeof vt.data == "string" ? JSON.parse(vt.data) : void 0;
                    } catch (_t) {
                      $ = void 0;
                    }
                    $ && $.event === "message" && gt.handler($.payload);
                  }, q.addEventListener("message", xt)) : rt === "presence:join" ? (xt = (vt) => {
                    let $;
                    try {
                      $ = typeof vt.data == "string" ? JSON.parse(vt.data) : void 0;
                    } catch (_t) {
                      $ = void 0;
                    }
                    $ && $.event === "presence:join" && gt.handler($.payload);
                  }, q.addEventListener("message", xt)) : rt === "presence:leave" ? (xt = (vt) => {
                    let $;
                    try {
                      $ = typeof vt.data == "string" ? JSON.parse(vt.data) : void 0;
                    } catch (_t) {
                      $ = void 0;
                    }
                    $ && $.event === "presence:leave" && gt.handler($.payload);
                  }, q.addEventListener("message", xt)) : rt === "setItem" ? (xt = (vt) => {
                    let $;
                    try {
                      $ = typeof vt.data == "string" ? JSON.parse(vt.data) : void 0;
                    } catch (_t) {
                      $ = void 0;
                    }
                    $ && $.event === "setItem" && (gt.itemName && $.payload.prop !== gt.itemName || gt.handler($.payload));
                  }, q.addEventListener("message", xt)) : rt === "removeItem" && (xt = (vt) => {
                    let $;
                    try {
                      $ = typeof vt.data == "string" ? JSON.parse(vt.data) : void 0;
                    } catch (_t) {
                      $ = void 0;
                    }
                    $ && $.event === "removeItem" && (gt.itemName && $.payload.prop !== gt.itemName || gt.handler($.payload));
                  }, q.addEventListener("message", xt))), xt && (gt.wsListener = xt);
                }
                _ && U && (yield this.join(U));
              }), it = () => {
                k == null || k.removeEventListener("open", lt), k == null || k.removeEventListener("close", dt), k == null || k.removeEventListener("error", P);
              }, lt = () => I(this, void 0, void 0, function* () {
                yield J(), it();
              }), dt = () => {
                it(), H();
              }, P = (q) => {
                this.logger.log("error", (q == null ? void 0 : q.message) || (q == null ? void 0 : q.name) || (q == null ? void 0 : q.type) || q), it(), H();
              };
              k.addEventListener("open", lt, { once: !0 }), k.addEventListener("close", dt, { once: !0 }), k.addEventListener("error", P, { once: !0 }), k.readyState !== WebSocket.CLOSING && k.readyState !== WebSocket.CLOSED ? k.readyState === WebSocket.OPEN && (yield J(), it()) : H();
            }), G);
          });
          H();
        }
      }), o ? f : y;
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
        (o = this[jt]) === null || o === void 0 || o.close(1006, "pong timeout");
      } catch (s) {
      }
    }, this.pongTimeout);
  }
  stopHeartbeat() {
    this.pingTimer && (clearInterval(this.pingTimer), this.pingTimer = void 0), this.clearPongTimer();
  }
  startHeartbeat() {
    this.stopHeartbeat();
    const o = this[jt];
    if (o && o.readyState === WebSocket.OPEN) try {
      o.send(JSON.stringify({ event: "ping" })), this.startPongTimer();
    } catch (s) {
    }
    this.pingTimer = setInterval(() => {
      const s = this[jt];
      if (s && s.readyState === WebSocket.OPEN) try {
        s.send(JSON.stringify({ event: "ping" })), this.startPongTimer();
      } catch (r) {
      }
    }, this.pingInterval);
  }
  join(o) {
    return I(this, void 0, void 0, function* () {
      var s, r;
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      try {
        yield this.throttleManager.throttleOperation();
      } catch (y) {
        throw this.logger.log("error", `Request throttled: ${y == null ? void 0 : y.message}`), y;
      }
      this.hasJoined = !0, this.lastJoinData = o;
      const h = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(o)) : o, S = yield this.getWebSocket(), E = { event: "presence:join", payload: h };
      this[Zt] && ((s = this[Zt]) === null || s === void 0 ? void 0 : s.keyVersion) > -1 && (E.keyVersion = (r = this[Zt]) === null || r === void 0 ? void 0 : r.keyVersion), S.send(JSON.stringify(E));
    });
  }
  leave() {
    return I(this, void 0, void 0, function* () {
      var o, s;
      if (!this.hasJoined) return;
      try {
        yield this.throttleManager.throttleOperation();
      } catch (S) {
        throw this.logger.log("error", `Request throttled: ${S == null ? void 0 : S.message}`), S;
      }
      this.hasJoined = !1;
      const r = yield this.getWebSocket(), h = { event: "presence:leave" };
      this[Zt] && ((o = this[Zt]) === null || o === void 0 ? void 0 : o.keyVersion) > -1 && (h.keyVersion = (s = this[Zt]) === null || s === void 0 ? void 0 : s.keyVersion), r.send(JSON.stringify(h));
    });
  }
  getJoinedConnections() {
    return I(this, void 0, void 0, function* () {
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      const o = yield this.request("GET", `/presence-list/${this.class}/${this.id}`);
      if (!o || !Array.isArray(o)) return [];
      const s = [];
      for (const h of o) {
        if (!(h != null && h.data)) {
          s.push(h);
          continue;
        }
        const S = yield this.getEncryptionHandlerForKeyVersion(h.keyVersion), E = S && typeof h.data == "string" ? JSON.parse(yield S.decrypt(h.data)) : h.data;
        s.push(Object.assign(Object.assign({}, h), { data: E }));
      }
      const r = this.connectionId;
      if (r) {
        const h = s.findIndex((S) => S.connectionId === r);
        if (h > 0) {
          const S = s.splice(h, 1)[0];
          s.unshift(S);
        }
      }
      return s;
    });
  }
};
zd = ze;
let x0 = class extends S0 {
  constructor(o, s) {
    typeof s == "string" ? super(o, s) : (super(o, s), s != null && s.ttl && (this.ttl = s == null ? void 0 : s.ttl));
  }
  setItem(o, s, r) {
    return I(this, void 0, void 0, function* () {
      var h, S;
      if (!o) throw new Error("No name passed!");
      if (!s && s !== 0 && s !== "" && s !== !1) throw new Error("No value passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      const E = (r == null ? void 0 : r.ttl) || this.ttl, y = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(s)) : s;
      let m;
      try {
        m = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}`, { value: y, ttl: E, ifAbsent: r == null ? void 0 : r.ifAbsent, updatedAt: r == null ? void 0 : r.updatedAt });
      } catch (p) {
        if (!p || ((h = p == null ? void 0 : p.cause) === null || h === void 0 ? void 0 : h.code) !== "conflictError.keyVersion.mismatch") throw p;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), m = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}`, { value: y, ttl: E, ifAbsent: r == null ? void 0 : r.ifAbsent });
      }
      const f = m;
      return f && { value: f == null ? void 0 : f.value, expiresAt: f == null ? void 0 : f.expiresAt, keyVersion: (S = f == null ? void 0 : f.keyVersion) !== null && S !== void 0 ? S : void 0, createdAt: f == null ? void 0 : f.createdAt, updatedAt: f == null ? void 0 : f.updatedAt };
    });
  }
  setItems(o) {
    return I(this, void 0, void 0, function* () {
      var s, r;
      if (!o || Object.keys(o).length === 0) throw new Error("No items passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      for (const E of Object.keys(o)) {
        const y = this.encryptionHandler ? yield this.encryptionHandler.encrypt(JSON.stringify(o[E].value)) : o[E].value;
        o[E].value = y, (r = o[E]).ttl || (r.ttl = this.ttl);
      }
      let h;
      try {
        h = yield this.request("POST", `/cache/${this.class}/${this.id}`, o);
      } catch (E) {
        if (!E || ((s = E == null ? void 0 : E.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw E;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), h = yield this.request("POST", `/cache/${this.class}/${this.id}`, o);
      }
      const S = h;
      return Object.keys(S).reduce((E, y) => {
        var m, f, p, _, U, H, G, k, J, it;
        return E[y] = { value: (f = (m = S[y]) === null || m === void 0 ? void 0 : m.value) !== null && f !== void 0 ? f : null, expiresAt: (_ = (p = S[y]) === null || p === void 0 ? void 0 : p.expiresAt) !== null && _ !== void 0 ? _ : 0, keyVersion: (H = (U = S[y]) === null || U === void 0 ? void 0 : U.keyVersion) !== null && H !== void 0 ? H : void 0, createdAt: (k = (G = S[y]) === null || G === void 0 ? void 0 : G.createdAt) !== null && k !== void 0 ? k : 0, updatedAt: (it = (J = S[y]) === null || J === void 0 ? void 0 : J.updatedAt) !== null && it !== void 0 ? it : 0 }, E;
      }, {});
    });
  }
  getItem(o) {
    return I(this, void 0, void 0, function* () {
      var s, r;
      if (!o) throw new Error("No name passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      let h;
      try {
        h = yield this.request("GET", `/cache/${this.class}/${this.id}/${o}`);
      } catch (f) {
        if (!f || ((s = f == null ? void 0 : f.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw f;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), h = yield this.request("GET", `/cache/${this.class}/${this.id}/${o}`);
      }
      const S = h, E = S == null ? void 0 : S.value;
      if (!E) return;
      const y = yield this.getEncryptionHandlerForKeyVersion(S.keyVersion), m = y ? JSON.parse(yield y.decrypt(E)) : E;
      return (S == null ? void 0 : S.keyVersion) > -1 && S.keyVersion !== ((r = this[Zt]) === null || r === void 0 ? void 0 : r.keyVersion) && (this.autoUpdateOldEncryptedValues ? (this.logger.log("info", `Item "${o}" has an old encryption and will be automatically updated now by setting it again.`), yield this.setItem(o, m, { ttl: S.expiresAt - Date.now() })) : this.logger.log("warn", `Item "${o}" has an old encryption and can be updated by setting it again.`)), { value: m, expiresAt: S.expiresAt, keyVersion: S.keyVersion, createdAt: S.createdAt, updatedAt: S.updatedAt };
    });
  }
  getItems(o) {
    return I(this, void 0, void 0, function* () {
      var s, r;
      if (!o || o.length === 0) throw new Error("No names passed!");
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      let h;
      try {
        h = yield this.request("POST", `/cache-query/${this.class}/${this.id}`, o);
      } catch (f) {
        if (!f || ((s = f == null ? void 0 : f.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw f;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), h = yield this.request("POST", `/cache-query/${this.class}/${this.id}`, o);
      }
      const S = h;
      if (Object.keys(S).length === 0) return;
      const E = {}, y = {};
      for (const f of Object.keys(S)) {
        const p = S[f], _ = p == null ? void 0 : p.value;
        if (!_) continue;
        const U = yield this.getEncryptionHandlerForKeyVersion(p.keyVersion), H = U ? JSON.parse(yield U.decrypt(_)) : _;
        (p == null ? void 0 : p.keyVersion) > -1 && p.keyVersion !== ((r = this[Zt]) === null || r === void 0 ? void 0 : r.keyVersion) && (E[f] = p), y[f] = { value: H, expiresAt: p.expiresAt, keyVersion: p.keyVersion, createdAt: p.createdAt, updatedAt: p.updatedAt };
      }
      const m = Object.keys(E);
      if (m.length > 0) if (this.autoUpdateOldEncryptedValues) {
        this.logger.log("info", `These items "${m.join(",")}" have an old encryption and will be automatically updated now by setting them again.`);
        const f = m.reduce((p, _) => (p[_] = { value: y[_].value, ttl: E[_].expiresAt - Date.now() }, p), {});
        yield this.setItems(f);
      } else this.logger.log("warn", `These items "${m.join(",")}" have an old encryption and can be updated by setting them again.`);
      return y;
    });
  }
  getAllItems(o) {
    return I(this, void 0, void 0, function* () {
      var s, r;
      if (this.getEncryptionHandler && !this.encryptionHandler) throw new Error("Call getEncryptionSettings() first!");
      let h;
      try {
        h = yield this.request("GET", `/cache/${this.class}/${this.id}${o != null && o.prefix ? `?prefix=${o == null ? void 0 : o.prefix}` : ""}`);
      } catch (y) {
        if (!y || ((s = y == null ? void 0 : y.cause) === null || s === void 0 ? void 0 : s.code) !== "conflictError.keyVersion.mismatch") throw y;
        this.logger.log("warn", "Your local keyVersion does not match! Will attempt to fetch the new encryption settings..."), yield this.getEncryptionSettings(), h = yield this.request("GET", `/cache/${this.class}/${this.id}${o != null && o.prefix ? `?prefix=${o == null ? void 0 : o.prefix}` : ""}`);
      }
      const S = h;
      if (Object.keys(S).length === 0) return;
      const E = {};
      for (const y of Object.keys(S)) {
        const m = S[y], f = m == null ? void 0 : m.value;
        if (!f) continue;
        const p = yield this.getEncryptionHandlerForKeyVersion(m.keyVersion), _ = p ? JSON.parse(yield p.decrypt(f)) : f;
        E[y] = { value: _, expiresAt: m.expiresAt, keyVersion: (r = m.keyVersion) !== null && r !== void 0 ? r : void 0, createdAt: m.createdAt, updatedAt: m.updatedAt };
      }
      return E;
    });
  }
  getAllKeys(o) {
    return I(this, void 0, void 0, function* () {
      return yield this.request("GET", `/cache-keys/${this.class}/${this.id}${o != null && o.prefix ? `?prefix=${o == null ? void 0 : o.prefix}` : ""}`);
    });
  }
  removeItem(o) {
    return I(this, void 0, void 0, function* () {
      if (!o) throw new Error("No name passed!");
      yield this.request("DELETE", `/cache/${this.class}/${this.id}/${o}`);
    });
  }
  removeItems(o) {
    return I(this, void 0, void 0, function* () {
      if (!o || o.length === 0) throw new Error("No names passed!");
      yield this.request("DELETE", `/cache/${this.class}/${this.id}`, o);
    });
  }
  incrementItem(o) {
    return I(this, arguments, void 0, function* (s, r = 1, h) {
      var S;
      if (!s) throw new Error("No name passed!");
      if (r == null) throw new Error("No value passed!");
      if (typeof r != "number") throw new Error("Value needs to be a number!");
      const E = (h == null ? void 0 : h.ttl) || this.ttl, y = yield this.request("POST", `/cache/${this.class}/${this.id}/${s}/increment`, { value: r, ttl: E, updatedAt: h == null ? void 0 : h.updatedAt });
      return { value: y == null ? void 0 : y.value, expiresAt: y == null ? void 0 : y.expiresAt, keyVersion: (S = y == null ? void 0 : y.keyVersion) !== null && S !== void 0 ? S : void 0, createdAt: y == null ? void 0 : y.createdAt, updatedAt: y == null ? void 0 : y.updatedAt };
    });
  }
  decrementItem(o) {
    return I(this, arguments, void 0, function* (s, r = 1, h) {
      var S;
      if (!s) throw new Error("No name passed!");
      if (r == null) throw new Error("No value passed!");
      if (typeof r != "number") throw new Error("Value needs to be a number!");
      const E = (h == null ? void 0 : h.ttl) || this.ttl, y = yield this.request("POST", `/cache/${this.class}/${this.id}/${s}/decrement`, { value: r, ttl: E, updatedAt: h == null ? void 0 : h.updatedAt });
      return { value: y == null ? void 0 : y.value, expiresAt: y == null ? void 0 : y.expiresAt, keyVersion: (S = y == null ? void 0 : y.keyVersion) !== null && S !== void 0 ? S : void 0, createdAt: y == null ? void 0 : y.createdAt, updatedAt: y == null ? void 0 : y.updatedAt };
    });
  }
  push(o, s, r) {
    return I(this, void 0, void 0, function* () {
      var h;
      if (!o) throw new Error("No name passed!");
      const S = (r == null ? void 0 : r.ttl) || this.ttl, E = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/push`, { value: s, ttl: S, updatedAt: r == null ? void 0 : r.updatedAt });
      return { value: E == null ? void 0 : E.value, expiresAt: E == null ? void 0 : E.expiresAt, keyVersion: (h = E == null ? void 0 : E.keyVersion) !== null && h !== void 0 ? h : void 0, createdAt: E == null ? void 0 : E.createdAt, updatedAt: E == null ? void 0 : E.updatedAt };
    });
  }
  splice(o, s, r, h, S) {
    return I(this, void 0, void 0, function* () {
      var E;
      if (!o) throw new Error("No name passed!");
      const y = (S == null ? void 0 : S.ttl) || this.ttl, m = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/splice`, { startIndex: s, deleteCount: r, items: h, ttl: y, updatedAt: S == null ? void 0 : S.updatedAt });
      return { value: m == null ? void 0 : m.value, expiresAt: m == null ? void 0 : m.expiresAt, keyVersion: (E = m == null ? void 0 : m.keyVersion) !== null && E !== void 0 ? E : void 0, createdAt: m == null ? void 0 : m.createdAt, updatedAt: m == null ? void 0 : m.updatedAt };
    });
  }
  merge(o, s, r) {
    return I(this, void 0, void 0, function* () {
      var h;
      if (!o) throw new Error("No name passed!");
      const S = (r == null ? void 0 : r.ttl) || this.ttl, E = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/merge`, { value: s, ttl: S, updatedAt: r == null ? void 0 : r.updatedAt });
      return { value: E == null ? void 0 : E.value, expiresAt: E == null ? void 0 : E.expiresAt, keyVersion: (h = E == null ? void 0 : E.keyVersion) !== null && h !== void 0 ? h : void 0, createdAt: E == null ? void 0 : E.createdAt, updatedAt: E == null ? void 0 : E.updatedAt };
    });
  }
  setIn(o, s, r, h) {
    return I(this, void 0, void 0, function* () {
      var S;
      if (!o) throw new Error("No name passed!");
      if (!s || s.length === 0) throw new Error("Path must not be empty.");
      const E = (h == null ? void 0 : h.ttl) || this.ttl, y = yield this.request("POST", `/cache/${this.class}/${this.id}/${o}/set-in`, { path: s, value: r, ttl: E, updatedAt: h == null ? void 0 : h.updatedAt });
      return { value: y == null ? void 0 : y.value, expiresAt: y == null ? void 0 : y.expiresAt, keyVersion: (S = y == null ? void 0 : y.keyVersion) !== null && S !== void 0 ? S : void 0, createdAt: y == null ? void 0 : y.createdAt, updatedAt: y == null ? void 0 : y.updatedAt };
    });
  }
  clear() {
    return I(this, void 0, void 0, function* () {
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
  const h = new x0(s, z);
  return hr[r] = h, h;
};
function T0(z, o, s) {
  var _;
  const [r, h] = ne.useState(), [S, E] = ne.useState(), [y, m] = ne.useState(!0), f = vr({ ...s == null ? void 0 : s.instanceOptions, id: z }, s == null ? void 0 : s.credentials), p = (_ = s == null ? void 0 : s.bind) != null ? _ : !0;
  if (ne.useEffect(() => {
    if (!f) return;
    m(!0);
    try {
      (async function(H, G, k) {
        let J;
        typeof G == "string" ? (J = await H.getItem(G), k && k({ [`${G}`]: J })) : (J = await H.getItems(G), k && k(J));
      })(f, o, (H) => {
        h(H), m(!1);
      });
    } catch (H) {
      E(H), m(!1);
    }
    const U = {};
    return p && (Array.isArray(o) ? o : [o]).forEach((H) => {
      const G = /* @__PURE__ */ ((k) => function(J) {
        h((it) => ({ ...it, [`${k}`]: J }));
      })(H);
      U[H] = G, f.on("setItem", H, G);
    }), () => {
      p && Object.keys(U).forEach((H) => {
        f.off("setItem", H, U[H]);
      });
    };
  }, [o]), typeof o == "string") {
    const U = async () => {
      m(!0);
      try {
        const G = await f.getItem(o);
        return m(!1), G;
      } catch (G) {
        E(G), m(!1);
      }
    }, H = (G) => {
      G && h((k) => ({ ...k, [`${o}`]: G }));
    };
    return [f, r ? r[o] : void 0, H, U, S, E, y];
  }
  return [f, r, h, async () => {
    m(!0);
    try {
      const U = await f.getItems(o);
      return m(!1), U;
    } catch (U) {
      E(U), m(!1);
    }
  }, S, E, y];
}
const A0 = (z, o, s) => {
  const [r, h, S, , E, y, m] = T0(z, o, s);
  return [h, async (f) => {
    try {
      const p = await r.setItems(f);
      S({ ...h, ...p });
    } catch (p) {
      y(p);
    }
  }, E, m];
};
function xl(z, o) {
  o === void 0 && (o = {});
  var s = o.insertAt;
  if (z && typeof document != "undefined") {
    var r = document.head || document.getElementsByTagName("head")[0], h = document.createElement("style");
    h.type = "text/css", s === "top" && r.firstChild ? r.insertBefore(h, r.firstChild) : r.appendChild(h), h.styleSheet ? h.styleSheet.cssText = z : h.appendChild(document.createTextNode(z));
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
xl(O0);
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
xl(z0);
function M0({ style: z, children: o }) {
  return ct.jsx("div", { className: "vaultrice-card", style: z, children: o });
}
var w0 = `.vaultrice-meter-container {
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
xl(w0);
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
xl(_0);
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
xl(U0);
function R0(z, o, s, r, h, S) {
  const [E, y] = ne.useState(), [m, f] = ne.useState(!1), [p, _] = ne.useState(!1), [U, H] = ne.useState(!1);
  s || (s = o);
  const G = r ? r.class || "_undefined_" : (h == null ? void 0 : h.class) || "_undefined_", k = r ? r.ttl || 36e5 : (h == null ? void 0 : h.ttl) || 36e5, J = `${z}-user-${o}-voted`, it = `vaultrice-${z}-user-${s}-${G}-voted`, lt = `${z}-user-${o}`, dt = z, P = o ? vr({ ...r, id: lt }, S) : void 0;
  return ne.useEffect(() => {
    try {
      (async () => {
        if (f(!1), o) {
          const q = await (P == null ? void 0 : P.getItem(J));
          _(!!q);
        } else {
          let q = window.localStorage.getItem(it);
          q && parseInt(q) + 2 * k < Date.now() && (window.localStorage.removeItem(it), q = null), _(!!q);
        }
        f(!0);
      })();
    } catch (q) {
      y(q);
    }
  }, [J, P, o, s, it, k]), [m, U, p, async (q) => {
    try {
      if (p) return;
      H(!0), await vr({ ...h, id: dt }, S).incrementItem(`${dt}-choices-${q}`), o ? await (P == null ? void 0 : P.setItem(J, Date.now())) : window.localStorage.setItem(it, Date.now().toString()), H(!1), _(!0);
    } catch (rt) {
      y(rt);
    }
  }, E];
}
const H0 = ({ id: z, choices: o = [], choicesInstanceOptions: s, credentials: r, bind: h = !0, showPercentage: S = !1, showTotalVotes: E = !0 }) => {
  const [y] = ne.useState(o.map((_) => `${z}-choices-${_.id}`)), [m, , , f] = A0(z, y, { credentials: r, instanceOptions: s, bind: h });
  if (!f && !m) return ct.jsxs("div", { className: "vaultrice-voting-result vaultrice-voting-expired", children: [ct.jsxs("div", { className: "vaultrice-voting--result-label", children: [ct.jsx("span", { className: "vaultrice-voting-expired-icon", "aria-label": "Voting closed", role: "img", children: "🔒" }), ct.jsx("label", { className: "vaultrice-voting-expired-label", children: "Voting closed" }), ct.jsx("span", { className: "vaultrice-voting-result-label-tag", children: "Expired" })] }), ct.jsx("p", { className: "vaultrice-voting-expired-text", children: "This voting has expired and is no longer accepting responses." })] });
  if (f) return "loading...";
  if (!m) return null;
  const p = Object.values(m).reduce((_, U) => U != null && U.value ? _ + U.value : _, 0);
  return ct.jsxs("div", { className: "vaultrice-voting-results", children: [o.map((_) => {
    const U = m[`${z}-choices-${_.id}`], H = U != null && U.value ? U.value / p * 100 : 0;
    return ct.jsxs("div", { className: "vaultrice-voting-result", children: [ct.jsxs("div", { className: "vaultrice-voting--result-label", children: [ct.jsx("label", { children: _.label }), ct.jsx("span", { className: "vaultrice-voting-result-label-tag", children: S ? `${H.toFixed(1)}%` : (U == null ? void 0 : U.value) || 0 })] }), ct.jsx(D0, { percentage: H })] }, _.id);
  }), E && ct.jsxs("div", { style: { marginTop: 12, textAlign: "right", color: "#666", fontSize: 13 }, children: ["Total votes: ", ct.jsx("b", { children: p })] })] });
}, q0 = ({ id: z, title: o, description: s, voteLabel: r = "vote", choices: h = [], choicesInstanceOptions: S, userId: E, userIdForLocalStorage: y, userInstanceOptions: m, credentials: f, bind: p = !0, showPercentage: _ = !1, showTotalVotes: U = !0 }) => {
  var dt;
  const [H, G] = ne.useState((dt = h == null ? void 0 : h[0]) == null ? void 0 : dt.id), [k, J, it, lt] = R0(z, E, y, m, S, f);
  return k ? ct.jsxs(M0, { children: [!!o && ct.jsx("h3", { className: "vaultrice-voting-title", children: o }), !!s && ct.jsx("p", { className: "vaultrice-voting-description", children: s }), !!it && ct.jsx(H0, { id: z, choices: h, choicesInstanceOptions: S, credentials: f, bind: p, showPercentage: _, showTotalVotes: U }), !it && ct.jsxs(ct.Fragment, { children: [ct.jsx("div", { className: "vaultrice-voting-choices", children: h.map((P) => ct.jsxs("div", { className: "vaultrice-voting-choice", onClick: (q) => {
    q.target.tagName !== "INPUT" && G(P.id);
  }, style: { cursor: "pointer" }, children: [ct.jsx("input", { type: "radio", name: P.id, value: P.id, checked: P.id === H, onChange: () => {
    G(P.id);
  }, style: { cursor: "pointer" } }), ct.jsx("label", { htmlFor: P.id, style: { cursor: "pointer" }, children: P.label })] }, P.id)) }), ct.jsx(N0, { onClick: () => {
    lt(H);
  }, disabled: J, children: J ? "...voting" : r })] }), ct.jsxs("div", { className: "vaultrice-voting-disclaimer", children: ["Powered by ", ct.jsx("a", { href: "https://www.vaultrice.com", target: "_blank", rel: "noreferrer", children: "vaultrice.com" }), " - get yours ", ct.jsx("a", { href: "https://www.vaultrice.app/register", target: "_bland", children: "for free!" })] })] }) : null;
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
xl(j0);
var Y0 = `.vaultrice-chat {
  display: flex;
  flex-direction: column;
  font-family: -apple-system, 'system-ui', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border-radius: 16px;
  overflow: hidden;
  min-height: 300px;
  backdrop-filter: blur(8px);
  /* Use CSS variables for the glassmorphism background */
  background: linear-gradient(125deg, var(--vaultrice-glass-color-1) -22%, var(--vaultrice-glass-color-2) 45%, var(--vaultrice-glass-color-3) 125%);
  box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.2), 
            inset -1px -1px 1px rgba(0, 0, 0, 0.2),
            0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.vaultrice-chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth;
  background: var(--vaultrice-background-overlay);
  backdrop-filter: blur(4px);
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
xl(Y0);
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
}

.vaultrice-chatroom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  flex: 1;
  min-height: 0;
}

/* Override chat styles to remove duplicate glassmorphism */
.vaultrice-chatroom-chat .vaultrice-chat {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  border-radius: 0;
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
xl(B0);
function V0(z, o) {
  const s = i0.createRoot(z);
  function r(h) {
    const S = {
      id: h.votingId || h.id || "",
      title: h.title || "",
      description: h.description || "",
      choices: h.choices || [],
      voteLabel: h.voteLabel || "vote",
      bind: !0,
      showPercentage: !!h.showPercentages,
      showTotalVotes: !!h.showTotalVotes,
      userIdForLocalStorage: "gitbook-user",
      credentials: h.credentials,
      choicesInstanceOptions: {
        class: h.votingClass || "_undefined_",
        ttl: h.tll || 36e5
        // 1 hour in ms
      }
    };
    try {
      typeof S.choices == "string" && (S.choices = JSON.parse(S.choices));
    } catch (E) {
      S.choices = [];
    }
    try {
      s.render(Iv.createElement(q0, S));
    } catch (E) {
      const y = document.createElement("div");
      y.textContent = "Failed to render voting widget", z.innerHTML = "", z.appendChild(y);
    }
  }
  return r(o || {}), { render: r, root: s };
}
function X0() {
  if (typeof window == "undefined" || typeof document == "undefined") return;
  let z = null, o = !1, s = null, r = null;
  function h(m) {
    try {
      window.parent.postMessage({ action: m }, "*");
    } catch (f) {
    }
  }
  function S(m) {
    if (!m.data || typeof m.data != "object") return;
    const f = m.data.state;
    f && typeof f == "object" && (z = f, typeof z.credentials == "string" && (z.credentials = JSON.parse(z.credentials)), o ? r && r.render(z) : (s = document.getElementById("root"), s || (s = document.createElement("div"), s.id = "root", document.body.appendChild(s)), r = V0(s, z), o = !0), E());
  }
  function E() {
    try {
      const m = document.body.scrollHeight || (s ? s.scrollHeight : 300);
      h({
        action: "@webframe.resize",
        size: { height: Math.max(m, 200) }
      });
    } catch (m) {
    }
  }
  function y() {
    h({ action: "@webframe.ready" });
  }
  if (window.addEventListener("message", S), typeof window.ResizeObserver != "undefined")
    try {
      new window.ResizeObserver(() => E()).observe(document.body);
    } catch (m) {
    }
  return document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", y) : y(), {
    getState: () => z,
    destroy: () => {
      window.removeEventListener("message", S);
    }
  };
}
export {
  X0 as default
};
