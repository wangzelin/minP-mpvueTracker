const Utils = {
    devVer: 1,
    guid: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
        let e = 16 * Math.random() | 0;
        return ("x" == t ? e : 3 & e | 8).toString(16)
      })
    },
    getScreenHeight: function (t) {
      return t.pixelRatio ? Math.round(t.screenHeight * t.pixelRatio) : t.screenHeight
    },
    getScreenWidth: function (t) {
      return t.pixelRatio ? Math.round(t.screenWidth * t.pixelRatio) : t.screenWidth
    },
    getOS: function (t) {
      if (t) {
        let e = t.toLowerCase();
        return -1 != e.indexOf("android") ? `${gioGlobal.platformConfig.name}-Android` : -1 != e.indexOf("ios") ? `${gioGlobal.platformConfig.name}-iOS` : t
      }
    },
    getOSV: t => `${gioGlobal.platformConfig.name} ${t}`,
    isEmpty: t => {
      for (let e in t)
        if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
      return !0
    },
    compareVersion(t, e) {
      t = t.split("."), e = e.split(".");
      const i = Math.max(t.length, e.length);
      for (; i > t.length;) t.push("0");
      for (; i > e.length;) e.push("0");
      for (let n = 0; i > n; n++) {
        const i = parseInt(t[n]),
          o = parseInt(e[n]);
        if (i > o) return 1;
        if (o > i) return -1
      }
      return 0
    },
    queryParse(t) {
      let e = {};
      if (t) {
        let i = t.split("&");
        for (let t of i) {
          let i = t.split("="),
            n = i.length;
          2 == n ? e[i[0]] = i[1] : 1 == n && i[0] && (e[i[0]] = "")
        }
      }
      return e
    },
    queryStringify: t => Object.keys(t).map(e => `${e}=${t[e]}`).join("&"),
    clearShareQuery(t) {
      if (!t) return;
      let e = Utils.queryParse(t);
      return delete e.shareId, delete e.contentId, delete e.contentType, Utils.queryStringify(e)
    }
  },
  initGlobal = t => {
    Object.defineProperty(Object.prototype, "gioGlobal", {
      get: () => "quickApp" === t ? global.__proto__ : "my" === t ? $global : global,
      configurable: !1,
      enumerable: !1
    })
  },
  firstLowerCase = t => t.replace(t[0], t[0].toLowerCase()),
  getDataByPath = (t, e) => {
    if (!t) return t;
    const i = e.split(".");
    let n = t[i.shift()];
    for (let t = 0, e = i.length; e > t; t++) {
      const t = i.shift();
      if (!n) return n;
      n = n[t]
    }
    return n
  },
  getManualImpInfo = t => {
    let e = {
      eventId: void 0,
      properties: {}
    };
    try {
      if (t.hasOwnProperty("gioTrack") && "object" == typeof t.gioTrack) return e.eventId = t.gioTrack.name, e.properties = t.gioTrack.properties, e;
      if (!t.gioImpTrack) return e;
      e.eventId = t.gioImpTrack;
      const i = /^gioTrack(.+)/,
        n = /^\w+$/;
      for (let o in t) {
        let r, s = o.match(i);
        if (s && ("track" === (r = firstLowerCase(s[1])) ? e.eventId = t[o] : e.properties[r] = t[o]), !n.test(e.eventId) || 10 > parseInt(e.eventId[0])) throw e.eventId = null, Error()
      }
    } catch (t) {
      console.warn("半打点IMP格式不正确, 事件名只能包含数字，字母和下划线，且不以数字开头, 请参考文档")
    }
    return e
  },
  isString = t => t && "string" == typeof t && t.constructor === String,
  normalPath = t => /^\//.test(t) ? t : "/" + t;
if (!Object.hasOwnProperty("getOwnPropertyDescriptors")) {
  let t;
  t = "object" == typeof Reflect && "function" == typeof Reflect.ownKeys ? Reflect.ownKeys : "function" == typeof Object.getOwnPropertySymbols ? function (t) {
    return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))
  } : Object.getOwnPropertyNames, Object.defineProperty(Object, "getOwnPropertyDescriptors", {
    configurable: !0,
    writable: !0,
    value: function (e) {
      return t(e).reduce((t, i) => Object.defineProperty(t, i, {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: Object.getOwnPropertyDescriptor(e, i)
      }), {})
    }
  })
}
const sdkVersion = "3.6.1",
  platformConfig = {
    wx: {
      name: "Weixin",
      path: "./weixin"
    },
    qq: {
      name: "QQ",
      path: "./qq"
    },
    my: {
      name: "Alipay",
      path: "./alipay"
    },
    swan: {
      name: "Baidu",
      path: "./baidu"
    },
    tt: {
      name: "Bytedance",
      path: "./bytedance"
    },
    quickApp: {
      name: "Quickapp",
      path: "./quickApp"
    },
    frame: {
      name: "Frame",
      path: "./multipleFrame"
    }
  },
  Config = Object.assign({}, platformConfig.wx, {
    platform: "MinP",
    scnPrefix: "",
    appHandlers: ["onShow", "onHide", "onError"],
    pageHandlers: ["onLoad", "onShow", "onShareAppMessage", "onShareTimeline", "onTabItemTap", "onHide", "onUnload"],
    actionEventTypes: ["onclick", "tap", "longpress", "blur", "change", "submit", "confirm", "getuserinfo", "getphonenumber", "contact"],
    originalApp: App,
    originalPage: Page,
    originalComponent: Component,
    originalBehavior: Behavior,
    canHook: !0,
    hooks: {
      App: !0,
      Page: !0,
      Component: !0,
      Behavior: !0
    },
    lisiteners: {
      app: {
        appShow: "onShow",
        appClose: "onHide",
        appError: "onError"
      },
      page: {
        pageLoad: "onLoad",
        pageShow: "onShow",
        pageHide: "onHide",
        pageClose: "onUnload",
        tabTap: "onTabItemTap",
        shareApp: "onShareAppMessage",
        shareTime: "onShareTimeline"
      },
      actions: {
        click: ["onclick", "tap", "longpress", "getuserinfo", "getphonenumber", "contact"],
        change: ["blur", "change", "confirm"],
        submit: ["submit"]
      }
    }
  });
var platformConfig$1 = Object.assign({}, Config, {
  sdkVer: "3.6.1"
});
const proxyVue = (t, e) => {
    void 0 !== t.mixin && t.mixin({
      created: function () {
        if (!this.$options.methods) return;
        const t = Object.keys(this.$options.methods);
        for (let e of Object.keys(this)) 0 > t.indexOf(e) || "function" != typeof this[e] || (Object.defineProperty(this[e], "proxiedName", {
          value: e
        }), Object.defineProperty(this[e], "isProxied", {
          value: !0
        }))
      },
      beforeMount: function () {
        let t = this.$root;
        
        t.$mp && "page" === t.$mp.mpType ? t.$mp.page && (e.vueRootVMs[t.$mp.page.route] = t) : "page" === t.mpType && "page" === this.mpType && t.$mp.page && (e.vueRootVMs[t.$mp.page.route || t.$mp.page.is] = t
          ,
           -1 !== ["wx", "qq", "tt"].indexOf(gioGlobal.gio__platform) && VdsInstrumentAgent.instrumentPageComponent(t.$mp.page)
           )
      }
    }), console.log("prox", e.vueRootVMs)
  },
  proxyTaro = (t, e, i) => {
    const n = t.createComponent,
      o = i.usePlugin;
    if (n && (t.createComponent = function (t, i) {
        let r = t;
        for (; r && r.prototype;) {
          const i = Object.keys(Object.getOwnPropertyDescriptors(r.prototype) || {});
          for (let n = 0; i.length > n; n++)
            if (i[n].startsWith("func__")) {
              const o = r.name,
                s = i[n].slice(6);
              e.taroRootVMs[i[n]] = o + "_" + ("" + t.prototype[i[n]]).match(/this\.__triggerPropsFn\("(.+)",/)[1] + "_" + s
            } r = Object.getPrototypeOf(r)
        }
        const s = n(t, i),
          a = -1 !== ["MinP", "qq"].indexOf(platformConfig$1.platform),
          g = a ? s && s.methods : s;
        return o ? i && VdsInstrumentAgent.instrumentPageComponent(g) : i && a && VdsInstrumentAgent.instrumentPageComponent(g), s
      }), o && t.createApp) {
      const e = t.createApp;
      t.createApp = function (t) {
        let i = e(t);
        return i._growing_app_ = !0, VdsInstrumentAgent.instrument(i), i
      }
    }
  },
  needHookTaroAction = t => {
    let e;
    return !!(document && (e = document.getElementById((t.currentTarget || t.target).id)) && e.__handlers) && Array.from(e.__handlers[t.type] || []).some(t => !t._stop)
  },
  proxyCml = (t, e) => {
    const i = t.createApp,
      n = t.createComponent;
    t.createApp = function (t) {
      return t._growing_app_ = !0, i(VdsInstrumentAgent.instrument(t))
    }, t.createComponent = function (t) {
      return n(t.data && t.data.isComponent ? Object.assign({}, t, {
        methods: VdsInstrumentAgent.instrument(t.methods)
      }) : t)
    }
  },
  proxyWepy = (t, e, i) => {
    const n = t.page,
      o = function (t) {
        const n = Object.keys(t);
        for (let o = 0; n.length > o; o++) {
          const r = Object.keys(t[n[o]]);
          for (let s = 0; r.length > s; s++)
            if ("function" == typeof t[n[o]][r[s]]) {
              const a = ("" + t[n[o]][r[s]]).match(/_vm\.(.+)\(.*\)/);
              a && a[1] && (e.wepyRootVMs[n[o]] || (e.wepyRootVMs[n[o]] = {}), e.wepyRootVMs[n[o]][r[s]] = a[1]), i.usePlugin && (t[n[o]][r[s]] = VdsInstrumentAgent.hook("_proxy", t[n[o]][r[s]]))
            }
        }
      };
    t.page = function (t, e) {
      return e.handlers && o(e.handlers), VdsInstrumentAgent.instrumentPageComponent(t), n(t, e)
    };
    const r = t.component;
    if (t.component = function (t, e) {
        return e.handlers && o(e.handlers), r(t, e)
      }, i.usePlugin) {
      const e = t.app;
      t.app = function (t, i) {
        return t._growing_app_ = !0, e(VdsInstrumentAgent.instrument(t), i)
      }
    }
  };
let setShareResult = (t, e, i) => {
  let n = VdsInstrumentAgent.observer.growingio;
  if (n && n.vdsConfig.followShare) {
    i || (i = {}), i.title || (i.title = VdsInstrumentAgent.observer.info.getPageTitle(t));
    let o = t => {
        let e = Utils.queryParse(t);
        return VdsInstrumentAgent.observer.cdpObserver && (e.shareId = e.shareId || Utils.guid(), e.shareType = "0", e.contentId = e.contentId || e.title || i.title, e.contentType = e.contentType || "1"), e.suid = n.info.uid, i.queryObj = e, Utils.queryStringify(e)
      },
      r = VdsInstrumentAgent.observer.currentPage;
    if (e) i.query = o(i.query || r.cleanQuery);
    else {
      let t = i.path || r.path,
        e = r.cleanQuery;
      if (-1 != t.indexOf("?")) {
        let i = t.split("?");
        t = i[0], e = i[1]
      }
      i.path = normalPath(t + "?" + o(e))
    }
  }
  return i
};
const isPageShare = t => t == gioGlobal.platformConfig.lisiteners.page.shareApp || t == gioGlobal.platformConfig.lisiteners.page.shareTime,
  VdsInstrumentAgent = {
    defaultPageCallbacks: {},
    defaultAppCallbacks: {},
    appHandlers: null,
    pageHandlers: null,
    actionEventTypes: null,
    originalPage: null,
    originalApp: null,
    originalComponent: null,
    originalBehavior: null,
    observer: null,
    hook: function (t, e) {
      return function () {
        let i, n = arguments ? arguments[0] : void 0;
        if (n && (n.currentTarget || n.target) && -1 != VdsInstrumentAgent.actionEventTypes.indexOf(n.type))
          if (gioGlobal.vdsConfig.taro && !gioGlobal.vdsConfig.taro.createApp) needHookTaroAction(n) && VdsInstrumentAgent.observer.actionListener(n, t);
          else try {
            VdsInstrumentAgent.observer.actionListener(n, t)
          } catch (t) {
            console.error(t)
          }
        const o = gioGlobal.platformConfig.lisiteners.app,
          r = gioGlobal.platformConfig.lisiteners.page;
        if (this._growing_app_ && t !== o.appShow ? i = e.apply(this, arguments) : this._growing_page_ && -1 === [r.pageShow, r.pageClose, r.pageLoad, r.pageHide, r.tabTap].indexOf(t) ? i = e.apply(this, arguments) : this._growing_app_ || this._growing_page_ || (i = e.apply(this, arguments)), this._growing_app_) {
          if (!VdsInstrumentAgent.observer.cdpObserver && -1 !== VdsInstrumentAgent.appHandlers.indexOf(t)) try {
            VdsInstrumentAgent.defaultAppCallbacks[t].apply(this, arguments)
          } catch (t) {
            console.error(t)
          }
          t === o.appShow && (i = e.apply(this, arguments))
        }
        if (this._growing_page_ && -1 !== VdsInstrumentAgent.pageHandlers.indexOf(t)) {
          r.shareTime == t ? i = setShareResult(this, !0, i) : r.shareApp == t && (i = setShareResult(this, !1, i));
          let n = Array.prototype.slice.call(arguments);
          i && n.push(i);
          try {
            VdsInstrumentAgent.defaultPageCallbacks[t].apply(this, n)
          } catch (t) {
            console.error(t)
          } - 1 !== [r.pageShow, r.pageClose, r.pageLoad, r.pageHide, r.tabTap].indexOf(t) && (i = e.apply(this, arguments))
        }
        return i
      }
    },
    hookComponent: function (t, e) {
      return function () {
        let i, n = arguments ? arguments[0] : void 0;
        if (!VdsInstrumentAgent.observer.cdpObserver && n && (n.currentTarget || n.target) && -1 != VdsInstrumentAgent.actionEventTypes.indexOf(n.type)) try {
          VdsInstrumentAgent.observer.actionListener(n, t)
        } catch (t) {
          console.error(t)
        }
        return i = e.apply(this, arguments)
      }
    },
    hookPage: (t, e) => (function () {
      let i = e.apply(this, arguments);
      t === gioGlobal.platformConfig.lisiteners.page.shareTime ? i = setShareResult(this, !0, i) : t === gioGlobal.platformConfig.lisiteners.page.shareApp && (i = setShareResult(this, !1, i));
      let n = Array.prototype.slice.call(arguments);
      return i && n.push(i), VdsInstrumentAgent.observer.pageListener(this, t, n), i
    }),
    instrument: function (t) {
      let e = {};
      const i = i => {
        e[i] = "function" == typeof t[i] && "constructor" !== i ? this.hook(i, t[i]) : t[i]
      };
      return Object.getOwnPropertyNames(t).forEach(i), t.__proto__ !== Object.prototype && Object.getOwnPropertyNames(t.__proto__).forEach(i), e._growing_app_ && VdsInstrumentAgent.appHandlers.map(function (t) {
        e[t] || (e[t] = VdsInstrumentAgent.defaultAppCallbacks[t])
      }), e._growing_page_ && VdsInstrumentAgent.pageHandlers.map(function (t) {
        e[t] || t === gioGlobal.platformConfig.lisiteners.page.shareApp || t === gioGlobal.platformConfig.lisiteners.page.shareTime || (e[t] = VdsInstrumentAgent.defaultPageCallbacks[t])
      }), e
    },
    instrumentPageComponent: function (t) {
      if (t) return VdsInstrumentAgent.pageHandlers.map(function (e) {
        "function" == typeof t[e] ? t[e] = VdsInstrumentAgent.hookPage(e, t[e]) : e !== gioGlobal.platformConfig.lisiteners.page.shareApp && e !== gioGlobal.platformConfig.lisiteners.page.shareTime && (t[e] = function () {
          VdsInstrumentAgent.observer.pageListener(this, e, arguments)
        })
      }), t
    },
    instrumentComponent: function (t) {
      const e = t._growing_aspage_;
      let i = t.methods || {};
      return Object.entries(i).forEach(([t, n]) => {
        "function" == typeof n && (i[t] = (t => -1 != VdsInstrumentAgent.pageHandlers.indexOf(t))(t) ? e ? this.hookPage(t, n) : n : this.hookComponent(t, n))
      }), e && VdsInstrumentAgent.pageHandlers.map(t => {
        i[t] || isPageShare(t) || (i[t] = function () {
          VdsInstrumentAgent.observer.pageListener(this, t, arguments)
        })
      }), t.methods = i, t
    },
    GrowingPage: function (t) {
      return t._growing_page_ = !0, VdsInstrumentAgent.originalPage(VdsInstrumentAgent.instrument(t))
    },
    GrowingComponent: function (t) {
      return t._growing_aspage_ = gioGlobal.vdsConfig.comAsPage, VdsInstrumentAgent.originalComponent(VdsInstrumentAgent.instrumentComponent(t))
    },
    GrowingBehavior: function (t) {
      return VdsInstrumentAgent.originalBehavior(VdsInstrumentAgent.instrumentComponent(t))
    },
    GrowingApp: function (t) {
      return t._growing_app_ = !0, VdsInstrumentAgent.originalApp(VdsInstrumentAgent.instrument(t))
    },
    initPlatformInfo(t) {
      VdsInstrumentAgent.appHandlers = t.appHandlers, VdsInstrumentAgent.pageHandlers = t.pageHandlers, VdsInstrumentAgent.actionEventTypes = t.actionEventTypes, VdsInstrumentAgent.originalApp = t.originalApp, VdsInstrumentAgent.originalPage = t.originalPage, VdsInstrumentAgent.originalComponent = t.originalComponent, VdsInstrumentAgent.originalBehavior = t.originalBehavior
    },
    initInstrument: function (t) {
      if (VdsInstrumentAgent.initPlatformInfo(gioGlobal.platformConfig), VdsInstrumentAgent.observer = t, VdsInstrumentAgent.pageHandlers.forEach(function (t) {
          VdsInstrumentAgent.defaultPageCallbacks[t] = function () {
            VdsInstrumentAgent.observer.pageListener(this, t, arguments)
          }
        }), VdsInstrumentAgent.observer.cdpObserver || VdsInstrumentAgent.appHandlers.forEach(function (t) {
          VdsInstrumentAgent.defaultAppCallbacks[t] = function () {
            VdsInstrumentAgent.observer.appListener(this, t, arguments)
          }
        }), gioGlobal.platformConfig.canHook) {
        const t = gioGlobal.platformConfig.hooks;
        if (t.App && !gioGlobal.growingAppInited) {
          if (App = function () {
              return VdsInstrumentAgent.GrowingApp(arguments[0])
            }, "swan" === gioGlobal.gio__platform)
            for (const t in VdsInstrumentAgent.originalApp) App[t] = VdsInstrumentAgent.originalApp[t];
          gioGlobal.growingAppInited = !0
        }
        if (t.Page && !gioGlobal.growingPageInited) {
          if (Page = function () {
              return VdsInstrumentAgent.GrowingPage(arguments[0])
            }, "swan" === gioGlobal.gio__platform)
            for (const t in VdsInstrumentAgent.originalPage) Page[t] = VdsInstrumentAgent.originalPage[t];
          gioGlobal.growingPageInited = !0
        }
        t.Component && !gioGlobal.growingComponentInited && (Component = function () {
          return VdsInstrumentAgent.GrowingComponent(arguments[0])
        }, gioGlobal.growingComponentInited = !0), t.Behavior && !gioGlobal.growingBehaviorInited && (Behavior = function () {
          return VdsInstrumentAgent.GrowingBehavior(arguments[0])
        }, gioGlobal.growingBehaviorInited = !0)
      }
      gioGlobal.GioPage = VdsInstrumentAgent.GrowingPage, gioGlobal.GioApp = VdsInstrumentAgent.GrowingApp, gioGlobal.GioComponent = VdsInstrumentAgent.GrowingComponent, gioGlobal.GioBehavior = VdsInstrumentAgent.GrowingBehavior, gioGlobal.trackApp = function () {
        const t = arguments[0];
        return t._growing_app_ = !0, VdsInstrumentAgent.instrument(t)
      }, gioGlobal.trackPage = function () {
        const t = arguments[0];
        return t._growing_page_ = !0, VdsInstrumentAgent.instrument(t)
      }, gioGlobal.trackComponent = function () {
        return VdsInstrumentAgent.instrument(arguments[0])
      }, gioGlobal.trackBehavior = function () {
        return VdsInstrumentAgent.instrument(arguments[0])
      }
    }
  };
class Page$1 {
  constructor() {
    this.queries = {}, this.pvar = {}
  }
  touch(t) {
    this.path = t.route || t.__route__, this.time = Date.now(), this.query = this.queries[t.route] ? this.queries[t.route] : void 0, this.cleanQuery = Utils.clearShareQuery(this.query)
  }
  addQuery(t, e) {
    this.queries[t.route] = e ? this._getQuery(e) : null
  }
  _getQuery(t) {
    return Object.keys(t || {}).filter(t => "wxShoppingListScene" !== t).map(e => `${e}=${t[e]}`).join("&")
  }
  touchRelatedPvarData(t) {
    const e = `${t.p}?${t.q}`;
    this.pvar[e] ? this.pvar[e].push(t) : this.pvar[e] = [t]
  }
  equalsPage(t) {
    return t.p == this.path && t.q == this.query
  }
}
const eventTypeMap = {
    tap: ["tap", "click"],
    longtap: ["longtap"],
    input: ["input"],
    blur: ["change", "blur"],
    submit: ["submit"],
    focus: ["focus"]
  },
  fnExpRE = /^function[^\(]*\([^\)]+\).*[^\.]+\.([^\(]+)\(.*/;

function getComKey(t) {
  return t && t.$attrs ? t.$attrs.mpcomid : "0"
}

function isVmKeyMatchedCompkey(t, e, i) {
  return !(!t || !e) && (e === t || 0 === e.indexOf(t + i))
}

function getVM(t, e, i) {
  void 0 === e && (e = []);
  var n = e.slice(1);
  if (!n.length) return t;
  var o = n.join(i),
    r = "";
  return n.reduce(function (t, e) {
    for (var n = t.$children.length, s = 0; n > s; s++) {
      var a = t.$children[s],
        g = getComKey(a);
      if (r && (g = r + i + g), isVmKeyMatchedCompkey(g, o, i)) return r = g, t = a
    }
    return t
  }, t)
}

function getHandle(t, e, i) {
  void 0 === i && (i = []);
  var n = [];
  if (!t || !t.tag) return n;
  var o = t || {},
    r = o.data;
  void 0 === r && (r = {});
  var s = o.children;
  void 0 === s && (s = []);
  var a = o.componentInstance;
  a ? Object.keys(a.$slots).forEach(function (t) {
    var o = a.$slots[t];
    (Array.isArray(o) ? o : [o]).forEach(function (t) {
      n = n.concat(getHandle(t, e, i))
    })
  }) : s.forEach(function (t) {
    n = n.concat(getHandle(t, e, i))
  });
  var g = r.attrs,
    l = r.on;
  return g && l && g.eventid === e && i.forEach(function (t) {
    var e = l[t];
    "function" == typeof e ? n.push(e) : Array.isArray(e) && (n = n.concat(e))
  }), n
}
const ONCE = "~",
  CUSTOM = "^";

function isMatchEventType(t, e) {
  return t === e || "regionchange" === e && ("begin" === t || "end" === t)
}
class VueProxy {
  constructor(t) {
    this.vueVM = t
  }
  getHandle(t) {
    var e = t.type,
      i = t.target;
    void 0 === i && (i = {});
    var n = (t.currentTarget || i).dataset;
    void 0 === n && (n = {});
    var o = n.comkey;
    void 0 === o && (o = "");
    var r = n.eventid;
    const s = -1 !== o.indexOf("_") ? "_" : ",";
    var a = getVM(this.vueVM, o.split(s), s);
    if (a) {
      var g = getHandle(a._vnode, r, eventTypeMap[e] || [e]);
      if (g.length) {
        var l = g[0];
        if (l.isProxied) return l.proxiedName;
        try {
          var h = ("" + l).replace("\n", "");
          if (h.match(fnExpRE)) {
            var p = fnExpRE.exec(h);
            if (p && p.length > 1) return p[1]
          }
        } catch (t) {}
        return l.name
      }
    }
  }
  handleEvent(t) {
    const e = t.type;
    let i;
    const n = (t.currentTarget || t.target).dataset;
    return (n.eventOpts || n["event-opts"]).forEach(t => {
      let n = t[0];
      const o = t[1];
      n = (n = n.charAt(0) === CUSTOM ? n.slice(1) : n).charAt(0) === ONCE ? n.slice(1) : n, o && isMatchEventType(e, n) && o.forEach(t => {
        i = t[0]
      })
    }), i
  }
}

function EventEmitter() {}
var proto = EventEmitter.prototype,
  originalGlobalValue = exports.EventEmitter;

function indexOfListener(t, e) {
  for (var i = t.length; i--;)
    if (t[i].listener === e) return i;
  return -1
}

function alias(t) {
  return function () {
    return this[t].apply(this, arguments)
  }
}

function isValidListener(t) {
  return "function" == typeof t || t instanceof RegExp || !(!t || "object" != typeof t) && isValidListener(t.listener)
}
proto.getListeners = function (t) {
  var e, i, n = this._getEvents();
  if (t instanceof RegExp)
    for (i in e = {}, n) n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i]);
  else e = n[t] || (n[t] = []);
  return e
}, proto.flattenListeners = function (t) {
  var e, i = [];
  for (e = 0; t.length > e; e += 1) i.push(t[e].listener);
  return i
}, proto.getListenersAsObject = function (t) {
  var e, i = this.getListeners(t);
  return i instanceof Array && ((e = {})[t] = i), e || i
}, proto.addListener = function (t, e) {
  if (!isValidListener(e)) throw new TypeError("listener must be a function");
  var i, n = this.getListenersAsObject(t),
    o = "object" == typeof e;
  for (i in n) n.hasOwnProperty(i) && -1 === indexOfListener(n[i], e) && n[i].push(o ? e : {
    listener: e,
    once: !1
  });
  return this
}, proto.on = alias("addListener"), proto.addOnceListener = function (t, e) {
  return this.addListener(t, {
    listener: e,
    once: !0
  })
}, proto.once = alias("addOnceListener"), proto.defineEvent = function (t) {
  return this.getListeners(t), this
}, proto.defineEvents = function (t) {
  for (var e = 0; t.length > e; e += 1) this.defineEvent(t[e]);
  return this
}, proto.removeListener = function (t, e) {
  var i, n, o = this.getListenersAsObject(t);
  for (n in o) o.hasOwnProperty(n) && -1 !== (i = indexOfListener(o[n], e)) && o[n].splice(i, 1);
  return this
}, proto.off = alias("removeListener"), proto.addListeners = function (t, e) {
  return this.manipulateListeners(!1, t, e)
}, proto.removeListeners = function (t, e) {
  return this.manipulateListeners(!0, t, e)
}, proto.manipulateListeners = function (t, e, i) {
  var n, o, r = t ? this.removeListener : this.addListener,
    s = t ? this.removeListeners : this.addListeners;
  if ("object" != typeof e || e instanceof RegExp)
    for (n = i.length; n--;) r.call(this, e, i[n]);
  else
    for (n in e) e.hasOwnProperty(n) && (o = e[n]) && ("function" == typeof o ? r.call(this, n, o) : s.call(this, n, o));
  return this
}, proto.removeEvent = function (t) {
  var e, i = typeof t,
    n = this._getEvents();
  if ("string" === i) delete n[t];
  else if (t instanceof RegExp)
    for (e in n) n.hasOwnProperty(e) && t.test(e) && delete n[e];
  else delete this._events;
  return this
}, proto.removeAllListeners = alias("removeEvent"), proto.emitEvent = function (t, e) {
  var i, n, o, r, s = this.getListenersAsObject(t);
  for (r in s)
    if (s.hasOwnProperty(r))
      for (i = s[r].slice(0), o = 0; i.length > o; o++) !0 === (n = i[o]).once && this.removeListener(t, n.listener), n.listener.apply(this, e || []) === this._getOnceReturnValue() && this.removeListener(t, n.listener);
  return this
}, proto.trigger = alias("emitEvent"), proto.emit = function (t) {
  var e = Array.prototype.slice.call(arguments, 1);
  return this.emitEvent(t, e)
}, proto.setOnceReturnValue = function (t) {
  return this._onceReturnValue = t, this
}, proto._getOnceReturnValue = function () {
  return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
}, proto._getEvents = function () {
  return this._events || (this._events = {})
}, EventEmitter.noConflict = function () {
  return exports.EventEmitter = originalGlobalValue, EventEmitter
};
const gioEmitter = new EventEmitter;

function validVar(t) {
  return null !== t && "[object Object]" === Object.prototype.toString.call(t) && Object.keys(t).length > 0
}
class BaseObserver {
  constructor(t) {
    this.growingio = t, this.esid = 0, this.info = t.info
  }
  setUserAttributes(t) {
    throw Error("this a interface function")
  }
  setUserId(t) {
    throw Error("this a interface function")
  }
  clearUserId() {
    throw Error("this a interface function")
  }
  sendVisitEvent(t, e) {
    throw Error("this a interface function")
  }
  track(t, e) {
    throw Error("this a interface function")
  }
  _sendEvent(t) {
    throw Error("this a interface function")
  }
}
const CLICK_TYPE = {
  tap: "clck",
  longpress: "lngprss",
  longtap: "lngprss"
};
class Observer extends BaseObserver {
  constructor(t) {
    super(t), this.growingio = t, this.info = t.info, this.currentPage = new Page$1, this.scene = null, this._sessionId = null, this.cs1 = t.storage.getCs1(), this.lastPageEvent = null, this.lastVstArgs = void 0, this.lastCloseTime = null, this.lastScene = void 0, this.keepAlive = t.vdsConfig.keepAlive, this.isPauseSession = !1, this.isGettingUid = !1, this.esid = 0 === this.info.esid ? 1 : this.info.esid, this.uploadingMessages = [], this.visitSentSuccess = !1
  }
  get sessionId() {
    return null === this._sessionId && (this._sessionId = Utils.guid()), this._sessionId
  }
  resetSessionId() {
    this._sessionId = null
  }
  pauseSession() {
    this.isPauseSession = !0
  }
  getVisitorId() {
    return this.info.uid
  }
  getUserId() {
    return this.cs1
  }
  getGioInfo() {
    return `giou=${this.getVisitorId()}&giocs1=${this.getUserId()}&gios=${this.sessionId}&gioprojectid=${this.growingio.vdsConfig.projectId}&gioappid=${this.growingio.vdsConfig.appId}&gioplatform=${gioGlobal.platformConfig.platform}`
  }
  setUserId(t) {
    let e = t + "";
    e && 100 > e.length && (this.cs1 = e, gioEmitter.emitEvent("setCs1", [e]), this.lastPageEvent && this._sendEvent(this.lastPageEvent))
  }
  clearUserId() {
    this.cs1 = null, gioEmitter.emitEvent("clearCs1")
  }
  appListener(t, e, i) {
    const n = gioGlobal.platformConfig.lisiteners.app;
    this.isPauseSession || (this.growingio.vdsConfig.debug && console.log("App.", e, Date.now()), e == n.appShow ? (gioEmitter.emitEvent("appShow"), this._parseScene(i), !this.lastCloseTime || Date.now() - this.lastCloseTime > this.keepAlive || this.lastScene && this.scene !== this.lastScene ? (this.resetSessionId(), this.sendVisitEvent(i, this.growingio.vdsConfig.getLocation.type), this.lastVstArgs = i, this.useLastPageTime = !1, this.lastPageEvent = void 0) : this.lastPageEvent && (this.useLastPageTime = !0)) : e == n.appClose ? (this.lastScene = this.scene, this.growingio.forceFlush(), this.info.syncStorage(), this.isPauseSession || (this.lastCloseTime = Date.now(), this.sendVisitCloseEvent())) : e == n.appError && this.sendErrorEvent(i))
  }
  pageListener(t, e, i) {
    const n = gioGlobal.platformConfig.lisiteners.page;
    if (this.growingio.vdsConfig.wepy && (t.route = t.$is), t.route || (t.route = this.info.getPagePath(t)), this.growingio.vdsConfig.debug && console.log("Page.", t.route, "#", e, Date.now()), e === n.pageShow) {
      const e = getDataByPath(t, "$page.query");
      Utils.isEmpty(e) || "quickApp" !== gioGlobal.gio__platform || this.currentPage.addQuery(t, e), this.isPauseSession ? this.isPauseSession = !1 : (this.currentPage.touch(t), this.useLastPageTime && this.currentPage.equalsPage(this.lastPageEvent) && (this.currentPage.time = this.lastPageEvent.tm, this.useLastPageTime = !1), this.sendPage(t))
    } else if (e === n.pageLoad) {
      const e = i[0];
      Utils.isEmpty(e) || "quickApp" === gioGlobal.gio__platform || this.currentPage.addQuery(t, e)
    } else if (e === n.pageHide) this.growingio._observer && this.growingio._observer.disconnect();
    else if (e === n.pageClose) this.currentPage.pvar[`${this.currentPage.path}?${this.currentPage.query}`] = void 0;
    else if (e === n.shareApp) {
      let e = null,
        n = null;
      2 > i.length ? 1 === i.length && (i[0].from ? e = i[0] : i[0].title && (n = i[0])) : (e = i[0], n = i[1]), this.pauseSession(), this.sendPageShare(t, e, n)
    } else if ("onTabItemTap" === e) {
      this.sendTabClick(i[0])
    }
  }
  actionListener(t, e) {
    if (getDataByPath(t, "currentTarget.dataset.growingIgnore") || getDataByPath(t, "target.dataset.growingIgnore")) return;
    const i = gioGlobal.platformConfig.lisiteners.actions;
    if ("_cmlEventProxy" !== e) {
      if ("handleProxy" === e && this.growingio.vueRootVMs && this.growingio.vueRootVMs[this.currentPage.path]) {
        let i = new VueProxy(this.growingio.vueRootVMs[this.currentPage.path]).getHandle(t);
        i && (e = i)
      }
      if ("__e" === e && this.growingio.vueRootVMs && this.growingio.vueRootVMs[this.currentPage.path]) {
        let i = new VueProxy(this.growingio.vueRootVMs[this.currentPage.path]).handleEvent(t);
        i && (e = i)
      }
      if ("_proxy" === e && this.growingio.wepyRootVMs) {
        const i = t.currentTarget.dataset.wpyEvt,
          n = t.type;
        getDataByPath(this, `growingio.wepyRootVMs.${i}.${n}`) && (e = this.growingio.wepyRootVMs[i][n])
      }
      getDataByPath(this, `growingio.taroRootVMs.${e}`) && (e = this.growingio.taroRootVMs[e]), this.growingio.vdsConfig.debug && console.log("Click on ", e, Date.now()), -1 !== i.click.indexOf(t.type) ? (this.sendClick(t, e), "getuserinfo" === t.type && getDataByPath(t, "detail.userInfo") && this.setVisitor(t.detail.userInfo)) : -1 !== i.change.indexOf(t.type) ? this.sendChange(t, e) : -1 !== i.submit.indexOf(t.type) && this.sendSubmit(t, e)
    }
  }
  sendVideoCstm(t) {
    this.track(`video-${t.type}`, t.var)
  }
  track(t, e) {
    if ("string" != typeof t || null === t || void 0 === t || 0 === t.length || !t.match(/^\w+$/) || 10 > parseInt(t[0])) return void console.warn("埋点格式不正确, 事件名只能包含数字，字母和下划线，且不以数字开头, 请参考文档");
    let i = {
      t: "cstm",
      ptm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query,
      n: t
    };
    validVar(e) && (i.var = e), this._sendEvent(i)
  }
  identify(t, e) {
    if (void 0 === t || 0 === t.length) return;
    this.growingio.login(t), this._sendEvent({
      t: "vstr",
      var: {
        openid: t,
        unionid: e
      }
    })
  }
  setVisitor(t) {
    if (validVar(t)) {
      this._sendEvent({
        t: "vstr",
        var: t
      })
    }
  }
  setUser(t) {
    if (this.cs1 && validVar(t)) {
      this._sendEvent({
        t: "ppl",
        var: t
      })
    }
  }
  setPage(t) {
    if (validVar(t)) {
      let e = {
        t: "pvar",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query,
        var: t
      };
      this.currentPage.touchRelatedPvarData(e), this._sendEvent(e)
    }
  }
  setEvar(t) {
    if (validVar(t)) {
      this._sendEvent({
        t: "evar",
        var: t
      })
    }
  }
  getLocation(t) {
    this.growingio.vdsConfig.getLocation.autoGet = !0, this.sendVisitEvent(this.lastVstArgs, t)
  }
  sendVisitEvent(t, e) {
    this.info.getSystemInfo().then(i => {
      const n = i || {};
      let o = {
        t: "vst",
        tm: Date.now(),
        av: this.info.sdkVer,
        db: n.brand,
        dm: n.model && n.model.replace(/<.*>/, ""),
        sh: Utils.getScreenHeight(n),
        sw: Utils.getScreenWidth(n),
        os: Utils.getOS(n.platform),
        osv: Utils.getOSV(n.version),
        l: n.language
      };
      if (this.growingio.vdsConfig.appVer && (o.cv = this.growingio.vdsConfig.appVer + ""), t.length > 0) {
        let i = t[0];
        o.p = i.path || this.info.getPagePath(), Utils.isEmpty(i.query) || (o.q = this.currentPage._getQuery(i.query)), o.ch = `scn:${this.info.scnPrefix}${this.scene}`, "quickapp" === this.info.platform ? o.rf = this.info.appSource.packageName : i.referrerInfo && i.referrerInfo.appId && getDataByPath(i, "referrerInfo.appId") && (o.rf = i.referrerInfo.appId), this.info.getNetworkType().then(t => {
          if (t && (o.nt = t.networkType, this._sendEvent(o), this.visitSentSuccess = !0, this.growingio.vdsConfig.getLocation.autoGet)) {
            let t = JSON.parse(JSON.stringify(o));
            e && -1 !== ["wgs84", "gcj02", 0, 1, 2].indexOf(e) || (e = "my" === gioGlobal.gio__platform ? 0 : "wgs84"), this.info.getLocation(e).then(e => {
              e && (t.lat = e.latitude, t.lng = e.longitude, this._sendEvent(t))
            })
          }
        })
      }
    })
  }
  sendVisitCloseEvent() {
    this._sendEvent({
      t: "cls",
      p: this.currentPage.path,
      q: this.currentPage.query
    })
  }
  sendErrorEvent(t) {
    if (t && t.length > 0) {
      let e = t[0];
      if ("string" != typeof e) return;
      let i, n = e.split("\n");
      if (n && n.length > 1) {
        let t = n[1].split(";");
        if (t && t.length > 1) {
          let e = t[1].match(/at ([^ ]+) page (.*) function/);
          i = {
            key: n[0],
            error: t[0]
          }, e && e.length > 2 && (i.page = e[1], i.function = e[2])
        }
      } else i = {
        error: n && n[0]
      };
      this._sendEvent({
        t: "cstm",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query,
        n: "onError",
        var: i
      })
    }
  }
  sendPage(t) {
    let e = {
      t: "page",
      tm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query
    };
    e.rp = this.lastPageEvent ? this.lastPageEvent.p : this.scene ? `scn:${this.info.scnPrefix}${this.scene}` : null;
    let i = this.info.getPageTitle(t);
    i && i.length > 0 && (e.tl = i), this.visitSentSuccess ? this._sendEvent(e) : setTimeout(() => this._sendEvent(e), 100), this.lastPageEvent = e;
    const n = this.currentPage.pvar[`${this.currentPage.path}?${this.currentPage.query}`];
    n && n.length > 0 && n.map(t => {
      t.ptm = this.currentPage.time, this._sendEvent(t)
    })
  }
  sendPageShare(t, e, i) {
    this._sendEvent({
      t: "cstm",
      ptm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query,
      n: "onShareAppMessage",
      var: {
        from: e ? e.from : void 0,
        target: e && e.target ? e.target.id : void 0,
        title: i ? i.title : void 0,
        path: i ? decodeURI(i.path) : void 0
      }
    })
  }
  sendClick(t, e) {
    let i = {
        t: CLICK_TYPE[t.type] || "clck",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query
      },
      n = t.currentTarget || t.target,
      o = n.id;
    (!o || "swan" === gioGlobal.gio__platform && /^_[0-9a-f]+/.test(o)) && (o = "");
    let r = {
      x: `${o}#${e}`
    };
    n.dataset.title && (r.v = n.dataset.title), n.dataset.src && (r.h = n.dataset.src), void 0 !== n.dataset.index && (r.idx = /^[\d]+$/.test(n.dataset.index) ? parseInt(n.dataset.index) : -1), i.e = [r], this._sendEvent(i)
  }
  sendSubmit(t, e) {
    let i = {
        t: "sbmt",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query
      },
      n = (t.currentTarget || t.target).id;
    (!n || "swan" === gioGlobal.gio__platform && /^_[0-9a-f]+/.test(n)) && (n = ""), i.e = [{
      x: `${n}#${e}`
    }], this._sendEvent(i)
  }
  sendChange(t, e) {
    let i = {
        t: "chng",
        ptm: this.currentPage.time,
        p: this.currentPage.path,
        q: this.currentPage.query
      },
      n = t.currentTarget || t.target,
      o = n.id;
    (!o || "swan" === gioGlobal.gio__platform && /^_[0-9a-f]+/.test(o)) && (o = "");
    let r = {
        x: `${o}#${e}`
      },
      s = getDataByPath(t, "detail.value") || getDataByPath(t, "target.attr.value");
    n.dataset && (n.dataset.growingTrack || n.dataset.growingtrack) && ("boolean" == typeof s || s && 0 !== s.length) && ("[object Array]" === Object.prototype.toString.call(s) ? (s = s.join(",")) && (r.v = s) : r.v = s), "change" === t.type && "autoplay" === getDataByPath(t, "detail.source") || (i.e = [r], this._sendEvent(i))
  }
  sendTabClick(t) {
    let e = {
      t: "clck",
      ptm: this.currentPage.time,
      p: this.currentPage.path,
      q: this.currentPage.query,
      e: [{
        x: "#onTabItemTap",
        v: t.text,
        idx: t.index,
        h: "string" == typeof t.pagePath ? t.pagePath : JSON.stringify(t.pagePath)
      }]
    };
    this._sendEvent(e)
  }
  _sendEvent(t) {
    if (this.info.uid && this.esid) {
      const e = this._buildEvent(t, this.info);
      this.growingio.upload(e)
    } else if (this.isGettingUid) this.uploadingMessages.push(t);
    else {
      this.isGettingUid = !0;
      const e = this.info.getStorage(this.info.uidKey),
        i = this.info.getStorage(this.info.esidKey);
      Promise.all([e, i]).then(([e, i]) => {
        e || (e = Utils.guid()), i || (i = 1), this.info.uid = e, this.info.esid = i, this.isGettingUid = !1;
        const n = this._buildEvent(t, this.info);
        for (this.growingio.upload(n); 0 !== this.uploadingMessages.length;) {
          let t = this.uploadingMessages.shift();
          t = this._buildEvent(t, this.info), this.growingio.upload(t)
        }
      })
    }
  }
  _buildEvent(t, e) {
    if (t.u = e.uid, t.s = this.sessionId, t.tm = t.tm || Date.now(), t.d = this.growingio.vdsConfig.appId, t.b = e.platform, null !== this.cs1 && (t.cs1 = this.cs1), t.var) {
      let e = t.var;
      Object.keys(e).forEach(i => {
        "string" != typeof e[i] && (t.var[i] = JSON.stringify(e[i]))
      })
    }
    return t.esid = this.esid++, t
  }
  _parseScene(t) {
    if ("quickapp" === this.info.platform) {
      const t = this.info.getAppSource(),
        e = t.extra || {},
        i = t.type || "";
      this.scene = i, this.setVisitor({
        extra: JSON.stringify(e)
      })
    } else if (t.length > 0) {
      let e = t[0];
      this.scene = e.query && e.query.wxShoppingListScene ? e.query.wxShoppingListScene : e.scene ? e.scene : "NA"
    }
  }
}
class Info {
  constructor(t) {
    this.growing = t, this._uid = void 0, this._esid = void 0, this._gioId = void 0, this._userId = void 0, this._systemInfo = null, this.uidKey = "_growing_uid_", this.esidKey = "_growing_esid_", this.gioIdKey = "_growing_gioId_", this.userIdKey = "_growing_userId_", this.platform = gioGlobal.platformConfig.platform, this.sdkVer = gioGlobal.platformConfig.sdkVer, this.scnPrefix = gioGlobal.platformConfig.scnPrefix, "quickapp" !== gioGlobal.platformConfig.platform && this.initUserInfo()
  }
  set esid(t) {
    this._esid = t, this.setStorage(this.esidKey, this._esid)
  }
  get esid() {
    return this._esid
  }
  set uid(t) {
    this._uid = t, this.setStorage(this.uidKey, this._uid)
  }
  get uid() {
    return this._uid
  }
  set gioId(t) {
    this._gioId = t, this.setStorage(this.gioIdKey, this._gioId)
  }
  get userId() {
    return this._userId
  }
  set userId(t) {
    this._userId = t, this.setStorage(this.userIdKey, this._userId)
  }
  get gioId() {
    return this._gioId
  }
  get systemInfo() {
    return this._systemInfo
  }
  initUserInfo() {
    this.uid = this.getStorageSync(this.uidKey), this.esid = +this.getStorageSync(this.esidKey), this.gioId = this.getStorageSync(this.gioIdKey), this._userId = this.getStorageSync(this.userIdKey)
  }
  syncStorage() {
    this.getStorage(this.uidKey).then(t => {
      t || this.setStorage(this.uidKey, this._uid)
    })
  }
  getAppId() {
    throw Error("this a interface function")
  }
  getAppSource() {
    throw Error("this a interface function")
  }
  getPageTitle(t) {
    throw Error("this a interface function")
  }
  getPagePath(t) {
    throw Error("this a interface function")
  }
  getStorage(t) {
    throw Error("this a interface function")
  }
  getStorageSync(t) {
    throw Error("this a interface function")
  }
  setStorage(t, e) {
    throw Error("this a interface function")
  }
  getSystemInfo() {
    throw Error("this a interface function")
  }
  getNetworkType() {
    throw Error("this a interface function")
  }
  getLocation(t) {
    throw Error("this a interface function")
  }
  request({
    url: t,
    header: e,
    method: i,
    data: n,
    timeout: o,
    success: r,
    fail: s
  }) {
    throw Error("this a interface function")
  }
  collectImp(t, e = null) {
    throw Error("this a interface function")
  }
  initShareAppMessage(t) {
    throw Error("this a interface function")
  }
  getCurrentPage() {
    throw Error("this a interface function")
  }
  getQuery() {
    throw Error("this a interface function")
  }
  getReferrer() {
    throw Error("this a interface function")
  }
  getInitPath() {
    throw Error("this a interface function")
  }
  onAppShow(t) {
    throw Error("this is a interdace function")
  }
  onAppHide(t) {
    throw Error("this is a interface function")
  }
  timeoutAbort(t, e) {
    t && t.abort && setTimeout(() => {
      t.abort()
    }, (e || 1e4) + 10)
  }
}
class Weixin extends Info {
  constructor(t) {
    super(t), this.growingio = t
  }
  getAppId() {
    this._systemInfo || (this._systemInfo = wx.getSystemInfoSync());
    let t = void 0;
    return 0 > Utils.compareVersion(this._systemInfo.SDKVersion, "2.2.2") || (t = wx.getAccountInfoSync().miniProgram.appId), t
  }
  getPagePath() {
    let t = this.getCurrentPage();
    return t && t.route
  }
  getCurrentPage() {
    const t = getCurrentPages();
    return t[t.length - 1]
  }
  getPageTitle(t) {
    let e = "";
    try {
      if (t.data.title && t.data.title.length > 0 && (e = Array.isArray(t.data.title) ? t.data.title.join(" ") : t.data.title), 0 === e.length && __wxConfig) {
        if (__wxConfig.tabBar) {
          let i = __wxConfig.tabBar.list.find(e => e.pathPath == t.route || e.pagePath == `${t.route}.html`);
          i && i.text && (e = i.text)
        }
        if (0 == e.length) {
          let i = __wxConfig.page[t.route] || __wxConfig.page[`${t.route}.html`];
          e = i ? i.window.navigationBarTitleText : __wxConfig.global.window.navigationBarTitleText
        }
      }
    } catch (t) {
      return ""
    }
    return e
  }
  getStorage(t) {
    return new Promise(e => {
      wx.getStorage({
        key: t,
        success: t => e(t.data),
        fail: () => e("")
      })
    })
  }
  getStorageSync(t) {
    return wx.getStorageSync(t)
  }
  setStorage(t, e) {
    wx.setStorage({
      key: t,
      data: e
    })
  }
  getSystemInfo() {
    return new Promise(t => {
      wx.getSystemInfo({
        success: e => {
          this._systemInfo = e, t(e)
        },
        fail: () => t(null)
      })
    })
  }
  getNetworkType() {
    return new Promise(t => {
      wx.getNetworkType({
        success: e => t(e),
        fail: () => t(null)
      })
    })
  }
  getSetting() {
    return new Promise(t => {
      wx.getSetting({
        success: t,
        fail: t
      })
    })
  }
  getLocation(t) {
    return new Promise(e => {
      wx.getLocation({
        type: t,
        success: t => e(t),
        fail: () => e(null)
      })
    })
  }
  request({
    url: t,
    header: e,
    method: i,
    data: n,
    timeout: o,
    success: r,
    fail: s,
    complete: a
  }) {
    let g = wx.request({
      url: t,
      header: e,
      method: i,
      data: n,
      timeout: o,
      success: r,
      fail: s,
      complete: a
    });
    return super.timeoutAbort(g, o), g
  }
  getImageInfo(t) {
    return wx.getImageInfo(t)
  }
  collectImp(t, e = null) {
    let i = null;
    this.growingio.vdsConfig.vue && (t = t.$mp.page), this.growingio.vdsConfig.taro && (t = t.$scope);
    let n = {};
    this.growingio._observer && this.growingio._observer.disconnect(), this.growingio._observer = t.isComponent ? t.createIntersectionObserver({
      observeAll: !0
    }) : wx.createIntersectionObserver(t, {
      observeAll: !0
    }), (i = e ? this.growingio._observer.relativeTo(e) : this.growingio._observer.relativeToViewport()).observe(".growing_collect_imp", t => {
      if (!t.id || n[t.id]) return;
      const e = getManualImpInfo(t.dataset),
        {
          eventId: i,
          properties: o
        } = e;
      i && t.id && !n[t.id] && (this.growingio.observer.track(i, o), n[t.id] = !0)
    })
  }
  setStorageSync(t, e) {
    wx.setStorageSync(t, JSON.stringify(e))
  }
  removeStorageSync(t) {
    wx.removeStorageSync(t)
  }
  navigateTo(t) {
    wx.navigateTo(t)
  }
  switchTab(t) {
    wx.switchTab(t)
  }
  onAppShow(t) {
    wx.onAppShow(t)
  }
  onAppHide(t) {
    wx.onAppHide(t)
  }
}
class Uploader {
  constructor(t) {
    this.growingio = t, this.maxRequests = 3, this.requestCount = 0, this.timeout = 5e3, this.messageQueue = [], this.uploadingQueue = [], this.uploadTimer = null, this.projectId = this.growingio.vdsConfig.projectId, this.appId = this.growingio.vdsConfig.appId, this.host = this.growingio.vdsConfig.host, this.url = `${this.host}/projects/${this.projectId}/apps/${this.appId}/collect`
  }
  upload(t) {
    this.messageQueue.push(t);
    const e = this.messageQueue.length;
    e > 100 && (this.messageQueue = this.messageQueue.slice(e - 100)), this.uploadTimer || (this.uploadTimer = setTimeout(() => {
      this._flush(), this.uploadTimer = null
    }, 1e3))
  }
  forceFlush() {
    this.uploadTimer && (clearTimeout(this.uploadTimer), this.uploadTimer = null), this._flush()
  }
  _flush() {
    if (this.requestCount >= this.maxRequests) return;
    const t = () => {
      this.messageQueue.length > 0 && this._flush()
    };
    this.uploadingQueue = this.messageQueue.slice(), this.messageQueue = [], this.uploadingQueue.length > 0 && (this.requestCount++, this.growingio.info.request({
      url: `${this.url}?stm=${Date.now()}`,
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      data: this.uploadingQueue,
      timeout: this.timeout,
      success: () => {
        this.requestCount--, t()
      },
      fail: (e => i => {
        this.requestCount--, 204 !== i.status ? this.messageQueue = e.concat(this.messageQueue) : t()
      })(this.uploadingQueue)
    }))
  }
}
class Config$1 {
  constructor(t) {
    this.growingio = t
  }
  setDataCollect(t) {
    this.growingio.vdsConfig.dataCollect = t
  }
  enableDebug(t) {
    t && console && (this.growingio.vdsConfig.debug = t)
  }
  setTrackerScheme(t) {
    const e = (t + "").toLocaleLowerCase();
    "http" !== e && "https" !== e || (this.growingio.vdsConfig.scheme = `${t}://`)
  }
  setTrackerHost(t) {
    isString(t) && (this.growingio.vdsConfig.host = t)
  }
}
const duration5min = 3e5;
class GrowingIO {
  constructor() {
    this.uploadingMessages = [], this.start = !1
  }
  init(t, e, i) {
    this.start || (e && "string" != typeof e && (i = e, e = ""), e || i || (e = "", i = {}), "alip" === platformConfig$1.platform && (i.vue || i.taro || i.cml || i.wepy) && (platformConfig$1.canHook = !0), i.usePlugin && (platformConfig$1.canHook = !1), this.vdsConfig = {
      projectId: t,
      appId: e,
      appVer: i.version || "",
      debug: i.debug || !1,
      forceLogin: i.forceLogin || !1,
      followShare: void 0 === i.followShare || i.followShare,
      usePlugin: i.usePlugin || !1,
      getLocation: {
        autoGet: ("object" == typeof i.getLocation ? i.getLocation.autoGet : i.getLocation) || !1,
        type: "object" == typeof i.getLocation && i.getLocation.type || "wgs84"
      },
      dataCollect: !("boolean" == typeof i.stopTrack && i.stopTrack || "boolean" == typeof i.dataCollect && !i.dataCollect),
      keepAlive: +i.keepAlive || duration5min,
      vue: i.vue || !1,
      taro: i.taro || !1,
      cml: i.cml || !1,
      wepy: i.wepy || !1,
      host: i.host && i.host.indexOf("http") >= 0 ? `https://${i.host.slice(i.host.indexOf("://")+3)}` : "https://wxapi.growingio.com",
      sdkVer: platformConfig$1.sdkVer,
      comAsPage: i.comAsPage || !1
    }, gioGlobal.vdsConfig = this.vdsConfig, gioGlobal.platformConfig = platformConfig$1, this.info = new Weixin(this), e || (this.vdsConfig.appId = this.info.getAppId() || t), this.observer = new Observer(this), this.uploader = new Uploader(this), this.config = new Config$1(this), this.start = !0, i.vue && (this.vueRootVMs = {}, proxyVue(i.vue, this)), i.taro && (this.taroRootVMs = {}, proxyTaro(i.taro, this, this.vdsConfig)), i.cml && (gioGlobal.platformConfig.hooks.Component = !1, proxyCml(i.cml)), i.wepy && (this.wepyRootVMs = {}, proxyWepy(i.wepy, this, this.vdsConfig)), "quickapp" === gioGlobal.platformConfig.platform && this.info.initShareAppMessage(this), this._start())
  }
  setConfig(t) {
    this.init(t.projectId, t.appId, t)
  }
  setVue(t) {
    this.vueRootVMs || (this.vueRootVMs = {}), this.vdsConfig.vue = !0, proxyVue(t, this)
  }
  _start() {
    VdsInstrumentAgent.initInstrument(this.observer);
    try {
      gioGlobal && platformConfig$1.canHook && (platformConfig$1.hooks.App && (gioGlobal.App = App), platformConfig$1.hooks.Page && (gioGlobal.Page = Page), platformConfig$1.hooks.Component && (gioGlobal.Component = Component), platformConfig$1.hooks.Behavior && (gioGlobal.Behavior = Behavior))
    } catch (t) {}
  }
  setDataCollect(t) {
    this.config.setDataCollect(t)
  }
  login(t) {
    if (this.vdsConfig.forceLogin) {
      this.info.uid = t, this.vdsConfig.forceLogin = !1;
      for (let e of this.uploadingMessages) e.u = t, this.upload(e)
    }
  }
  upload(t) {
    this.vdsConfig.dataCollect ? this.vdsConfig.forceLogin ? (console.error("GrowingIO: [ForceLogin] is set to true, but openID is null, data collection has been suspended! Call the [identify] function to report openID to resume data collection."), this.uploadingMessages.push(t)) : (this.vdsConfig.debug && console.info("generate new event", JSON.stringify(t, 0, 2)), gioEmitter.emitEvent("upload", [t]), this.uploader.upload(t)) : console.warn("GrowingIO: [dataCollect] is false! not send any event.")
  }
  forceFlush() {
    this.info.esid = this.observer.esid, this.uploader.forceFlush()
  }
  proxy(t, e) {
    try {
      if ("setVue" === t) this.setVue(e[0]);
      else if ("setDataCollect" === t) this.setDataCollect(e[0]);
      else if ("setStopTrack" === t) this.setDataCollect(!e[0]);
      else if ("collectImp" === t) this.collectImp(e[0], e[1]);
      else if (this.observer && this.observer[t]) return this.observer[t].apply(this.observer, e)
    } catch (t) {
      console.error(t)
    }
  }
  collectImp(t, e = null) {
    this.info.collectImp(t, e)
  }
}

function isEqual(t, e) {
  if (typeof t != typeof e) return !1;
  if ("string" == typeof t || "number" == typeof t || "boolean" == typeof t || "function" == typeof t || void 0 == t || void 0 == e) return Object.is(t, e);
  if (Array.isArray(t) && Array.isArray(e)) return t.length === e.length && t.every((t, i) => isEqual(t, e[i]));
  if ("[object Object]" === Object.prototype.toString.call(t) && "[object Object]" === Object.prototype.toString.call(e)) {
    const i = Object.keys(t),
      n = Object.keys(e);
    return !(!i.every(i => e.hasOwnProperty(i) && isEqual(t[i], e[i])) || !n.every(i => t.hasOwnProperty(i) && isEqual(e[i], t[i])))
  }
  return !1
}
const getParameterByName = (t, e) => {
  if ("string" != typeof e) return;
  "?" !== e[0] && (e = "?" + e), t = t.replace(/[\[\]]/g, "\\$&");
  const i = RegExp("[?&]" + t + "(=([^&#]*)|&|#|$)").exec(e);
  return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/g, " ")) : "" : null
};
class BaseUserStorage {
  constructor(t) {
    this.growingio = t, this.namespace = "push-user-status", this.userTagDuration = 432e7, this.eventTagDuration = 864e5, this.handleCs1 = this.handleCs1.bind(this), this.handleClearCs1 = this.handleClearCs1.bind(this)
  }
  handleCs1(t) {
    t !== this.get("cs1") && (this.set("cs1", t), this.set("bcs", void 0), gioEmitter.emit("cs1Refresh"))
  }
  handleClearCs1() {
    this.set("cs1", void 0), this.set("bcs", void 0)
  }
  setIsPreview(t) {
    if (!t.q) return;
    const e = getParameterByName("scene", t.q);
    if (!e) return;
    const i = getParameterByName("gioMessageId", e);
    if (!i) return;
    const n = {
      s: "splash",
      pw: "popupWindow",
      p: "push",
      b: "banner",
      ab: "abTest"
    } [getParameterByName("mt", e)] || "";
    gioGlobal.__growing__.marketingPreview = {
      messageId: i,
      msgType: n
    }
  }
  storeFilters(t, e, i) {
    const n = e(),
      o = this.get(n, this.eventTagDuration) || [],
      r = i.call(this, t),
      s = [...o, ...r];
    this.set(n, s)
  }
  generateEventKey(t) {
    return `${t}#${this.get("cs1")||""}`
  }
  _get(t) {
    return this.growingio.info.getStorageSync(`${this.namespace}#${t}`)
  }
  getUserAttrs() {
    const t = this.generateEventKey("userAttrs");
    return this.get(t) || []
  }
  getTriggerAttrs() {
    const t = this.generateEventKey("triggerAttrs");
    return this.get(t) || []
  }
  set(t, e) {
    const i = this._get(t),
      n = new Date;
    n.setHours(0), n.setMinutes(0), n.setSeconds(0);
    const o = {
      startAt: n.getTime(),
      value: e
    };
    i && isEqual(o.value, JSON.parse(i).value) || this.growingio.info.setStorageSync(`${this.namespace}#${t}`, o)
  }
  get(t, e = this.userTagDuration) {
    const i = this._get(t);
    if (!i) return;
    const n = JSON.parse(i);
    return Date.now() > n.startAt + e ? void 0 : n.value
  }
  getCs1() {
    return this.get("cs1")
  }
}
class UserStorage extends BaseUserStorage {
  constructor(t) {
    super(t), this.growingio = t, this.handleEvent = this.handleEvent.bind(this), this.addEventListener()
  }
  addEventListener() {
    gioEmitter.on("appOpen", this.handleEvent), gioEmitter.on("upload", this.handleEvent), gioEmitter.on("setCs1", this.handleCs1), gioEmitter.on("clearCs1", this.handleClearCs1)
  }
  handleEvent(t) {
    if (t) switch (t.t) {
      case "vst":
      case "vstr":
      case "ppl":
        this.storeFilters(t, this.generateEventKey.bind(this, "userAttrs"), this.formatUserFilterVars);
        break;
      case "cstm":
        this.storeFilters(t, this.generateEventKey.bind(this, "triggerAttrs"), this.formatEventFilterVars);
      case "page":
        this.setIsPreview(t)
    }
  }
  formatUserFilterVars(t) {
    const e = t.var;
    return e ? Object.keys(e).map(t => ({
      key: t,
      value: e[t]
    })) : []
  }
  formatEventFilterVars(t) {
    const e = t.var;
    return [{
      key: t.n,
      value: "",
      event_variable: e ? Object.keys(e).map(t => ({
        key: t,
        value: e[t]
      })) : []
    }]
  }
}
try {
  const t = "wx";
  initGlobal(t), "frame" !== t && (gioGlobal.gio__platform = t)
} catch (t) {}
const growingio = new GrowingIO;
let gio = function () {
  let t = arguments[0];
  if (!t) return;
  let e = 2 > arguments.length ? [] : [].slice.call(arguments, 1);
  if ("init" === t) {
    if (gioGlobal.vdsConfig) return void console.warn("SDK已经初始化成功，请检查是否加载过其他平台sdk");
    if (1 > e.length) return void console.log('初始化 GrowingIO SDK 失败。请使用 gio("init", "你的GrowingIO项目ID", "你的应用APP_ID", options);');
    growingio.init(e[0], e[1], e[2])
  } else {
    if ("setConfig" !== t) return growingio.proxy(t, e);
    if (!e[0]) return void console.log("初始化 GrowingIO SDK 失败。请检查你的config文件是否引入正确");
    if (!e[0].projectId) return void console.log("初始化 GrowingIO SDK 失败。请检查你的 GrowingIO项目ID, 你的应用APP_ID 是否填写正确");
    growingio.setConfig(e[0])
  }
};
console.log("init growingio...");
const GioPage = VdsInstrumentAgent.GrowingPage,
  GioApp = VdsInstrumentAgent.GrowingApp,
  GioComponent = VdsInstrumentAgent.GrowingComponent,
  GioBehavior = VdsInstrumentAgent.GrowingBehavior,
  gioEmitter$1 = gioEmitter,
  userStorage = growingio.storage = new UserStorage(growingio);
gioGlobal.__growing__ = {
  gioEmitter: gioEmitter$1,
  gio: gio,
  growingio: growingio,
  userStorage: userStorage,
  marketingPreview: void 0,
  entry: "saas"
}, gioGlobal.gio = gio;
export default gio;
export {
  GioApp,
  GioBehavior,
  GioComponent,
  GioPage,
  gioEmitter$1 as gioEmitter,
  growingio
};
