"use strict";
import { Animation } from "./module/Animation.js";
import { GVCType, PageManager, DefaultSetting } from "./module/PageManager.js";
import { AppearType } from "./module/Enum.js";
import { HtmlGenerate } from "./module/Html_generate.js";
export class Glitter {
    constructor(window) {
        var _a;
        this.gvcType = GVCType;
        this.deviceTypeEnum = AppearType;
        this.animation = Animation;
        this.defaultSetting = new DefaultSetting({
            pageBgColor: "white",
            pageAnimation: this.animation.none,
            dialogAnimation: this.animation.none,
            pageLoading: () => {
            },
            pageLoadingFinish: () => {
            }
        });
        this.htmlGenerate = HtmlGenerate;
        this.webUrl = '';
        this.goBackStack = [];
        this.parameter = { styleList: [], styleLinks: [] };
        this.callBackId = 0;
        this.callBackList = new Map();
        this.debugMode = false;
        this.publicBeans = {};
        this.share = {};
        this.deviceType = this.deviceTypeEnum.Web;
        this.modelJsList = [];
        this.pageIndex = 0;
        this.getBoundingClientRect = {};
        this.changePageCallback = [];
        this.pageConfig = [];
        this.waitChangePage = false;
        this.elementCallback = {};
        this.hidePageView = PageManager.hidePageView;
        this.showPageView = PageManager.showPageView;
        this.setHome = PageManager.setHome;
        this.setLoadingView = PageManager.setLoadingView;
        this.changePageListener = PageManager.changePageListener;
        this.showLoadingView = PageManager.showLoadingView;
        this.changeWait = PageManager.changeWait;
        this.setAnimation = PageManager.setAnimation;
        this.changePage = PageManager.changePage;
        this.removePage = PageManager.removePage;
        this.openDiaLog = PageManager.openDiaLog;
        this.innerDialog = PageManager.innerDialog;
        this.closeDiaLog = PageManager.closeDiaLog;
        this.hideLoadingView = PageManager.hideLoadingView;
        this.goBack = PageManager.goBack;
        this.goMenu = PageManager.goMenu;
        this.addChangePageListener = PageManager.addChangePageListener;
        this.ut = {
            glitter: this,
            clock() {
                return {
                    start: new Date(),
                    stop: function () {
                        return ((new Date()).getTime() - (this.start).getTime());
                    },
                    zeroing: function () {
                        this.start = new Date();
                    }
                };
            },
            dateFormat(date, fmt) {
                const o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
            copyText(text) {
                if (!document.getElementById("imageSelect")) {
                    this.glitter.$('body').append(`<input type="text"   style="display: none" id="copyText" multiple>`);
                }
                this.glitter.$('#copyText').val(text);
                this.glitter.$('#copyText').show();
                this.glitter.$('#copyText').select();
                document.execCommand("Copy");
                this.glitter.$('#copyText').hide();
            },
            toJson(data, defaultData) {
                const glitter = this.glitter;
                if (data === undefined) {
                    return defaultData;
                }
                else if (typeof data !== 'string') {
                    return data;
                }
                try {
                    var dd = JSON.parse(data.replace(/\n/g, "\\n").replace(/\t/g, "\\t"));
                    if ((typeof dd) !== (typeof defaultData)) {
                        return defaultData;
                    }
                    else {
                        return dd !== null && dd !== void 0 ? dd : defaultData;
                    }
                }
                catch (e) {
                    glitter.deBugMessage(e);
                    return defaultData;
                }
            },
            downloadFile(href) {
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', 'image.jpg');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            frSize(sizeMap, def) {
                var _a, _b, _c, _d, _e;
                var wi = $('html').width();
                var sm = ((_a = sizeMap.sm) !== null && _a !== void 0 ? _a : def);
                var me = ((_b = sizeMap.me) !== null && _b !== void 0 ? _b : sm);
                var lg = ((_c = sizeMap.lg) !== null && _c !== void 0 ? _c : me);
                var xl = ((_d = sizeMap.xl) !== null && _d !== void 0 ? _d : lg);
                var xxl = ((_e = sizeMap.xxl) !== null && _e !== void 0 ? _e : xl);
                if (wi < 576) {
                    return def;
                }
                else if ((wi >= 576 && wi < 768)) {
                    return sm;
                }
                else if ((wi >= 768 && wi < 992)) {
                    return me;
                }
                else if ((wi >= 992 && wi < 1200)) {
                    return lg;
                }
                else if ((wi >= 1200 && wi < 1400)) {
                    return xl;
                }
                else if ((wi >= 1400)) {
                    return xxl;
                }
            },
            chooseMediaCallback(option) {
                const $ = this.glitter.$;
                $('#imageSelect').remove();
                if (!document.getElementById("imageSelect")) {
                    $('body').append(`<input type="file" accept="${option.accept}"  style="display: none" id="imageSelect" ${(option.single) ? `` : `multiple`}>`);
                    $('#imageSelect').change(function (e) {
                        let files = $('#imageSelect').get(0).files;
                        let imageMap = [];
                        for (let a = 0; a < files.length; a++) {
                            let reader = new FileReader();
                            reader.readAsDataURL(files[a]);
                            reader.onload = function getFileInfo(evt) {
                                imageMap = imageMap.concat({
                                    file: files[a],
                                    data: evt.target.result,
                                    type: option.accept,
                                    name: files[a].name,
                                    extension: files[a].name.split('.').pop()
                                });
                                if (imageMap.length === files.length) {
                                    option.callback(imageMap);
                                }
                            };
                        }
                    });
                }
                $('#imageSelect').val(undefined);
                $('#imageSelect').click();
            }
        };
        this.utText = {
            filterNumber(number) {
                return number.replace(/[^0-9]/ig, "");
            },
            removeTag(str) {
                try {
                    return str.replace(/<[^>]+>/g, "");
                }
                catch (e) {
                    return str;
                }
            },
            addTextChangeListener(e, callback) {
                e.bind('input porpertychange', function () {
                    callback(e);
                });
            },
            urlify(text, open) {
                return text.replace(/(https?:\/\/[^\s]+)/g, function (url) {
                    if (open) {
                        return open(url);
                    }
                    else {
                        return `<a style="color: dodgerblue;cursor:pointer;border-bottom: 1px solid dodgerblue;"  onclick="glitter.openNewTab('${url}')">${url}</a>`;
                    }
                }).replace(/(http?:\/\/[^\s]+)/g, function (url) {
                    if (open) {
                        return open(url);
                    }
                    else {
                        return `<a style="color: dodgerblue;cursor:pointer;border-bottom: 1px solid dodgerblue;"  onclick="glitter.openNewTab('${url}')">${url}</a>`;
                    }
                });
            },
            isEmpty(data) {
                return ((data === '') || (data === undefined));
            },
            emptyToDefault(data, defaultData) {
                if (((data === '') || (data === undefined))) {
                    return defaultData;
                }
                else {
                    return data;
                }
            },
        };
        this.utRandom = {
            getRandom(items) {
                return items[Math.floor(Math.random() * items.length)];
            },
            getRandomInt(min, max) {
                return (min + Math.floor(Math.random() * (max - min)));
            }
        };
        this.scroll = {
            glitter: this,
            addScrollListener(e, obj) {
                const glitter = this.glitter;
                e.scroll(function () {
                    var map = {
                        scrollTop: glitter.$(e)[0].scrollTop,
                        scrollHeight: glitter.$(e)[0].scrollHeight,
                        windowHeight: glitter.$(e).height()
                    };
                    if (map.scrollTop + map.windowHeight >= map.scrollHeight) {
                        if (obj.scrollBtn !== undefined) {
                            obj.scrollBtn();
                        }
                    }
                    if (map.scrollTop === 0) {
                        if (obj.scrollTp !== undefined) {
                            obj.scrollTp();
                        }
                    }
                    if (obj.position !== undefined) {
                        obj.position(map.scrollTop);
                    }
                });
            },
            isScrollBtn(e) {
                var map = {
                    scrollTop: e[0].scrollTop,
                    scrollHeight: e[0].scrollHeight,
                    windowHeight: e.height()
                };
                return map.scrollTop + map.windowHeight >= map.scrollHeight - 1;
            },
            isScrollTp(e) {
                var map = {
                    scrollTop: e[0].scrollTop,
                    scrollHeight: e[0].scrollHeight,
                    windowHeight: e.height()
                };
                return map.scrollTop === 0;
            },
            scrollToBtn(e) {
                var map = {
                    scrollTop: e[0].scrollTop,
                    scrollHeight: e[0].scrollHeight,
                    windowHeight: e.height()
                };
                e.scrollTop(map.scrollHeight - map.windowHeight);
            },
            scrollToFixed(scrollContainer, rowTop, y) {
                var toggle = false;
                scrollContainer.scroll(function () {
                    function open() {
                        rowTop.addClass('position-fixed');
                        rowTop.css('width', rowTop.parent().width());
                        rowTop.parent().css('padding-top', `${rowTop.height()}px`);
                        rowTop.css('top', y + 'px');
                    }
                    function close() {
                        rowTop.removeClass('position-fixed');
                        rowTop.css('width', '100%');
                        rowTop.parent().css('padding-top', '0px');
                    }
                    var cut = (rowTop.parent().offset().top - scrollContainer.scrollTop());
                    if (cut < y && (!toggle)) {
                        open();
                        toggle = true;
                    }
                    else if (cut > y && (toggle)) {
                        close();
                        toggle = false;
                    }
                });
            }
        };
        this.windowUtil = {
            es: undefined,
            glitter: this,
            get e() {
                return this.es;
            },
            get nowWindowHeight() {
                return this.e.innerHeight;
            },
            windowHeightChangeListener: [],
            addWindowHeightChangeListener(callback) {
                this.windowHeightChangeListener.push(callback);
            },
            getBrowserFrom() {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                    if (bIsIpad || bIsIphoneOs) {
                        return "ios";
                    }
                    else if (bIsAndroid) {
                        return "android";
                    }
                    else {
                        return "phone";
                    }
                }
                else {
                    return "pc";
                }
            },
            getBrowserDeviceType() {
                const glitter = this;
                const a = navigator.userAgent;
                const isAndroid = a.indexOf('Android') > -1 || a.indexOf('Adr') > -1;
                const isiOS = !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if (isAndroid) {
                    return "android";
                }
                if (isiOS) {
                    if (glitter.getBrowserFrom() === "pc") {
                        return "mac";
                    }
                    else {
                        return "iphone";
                    }
                }
                return "desktop";
            },
            reload() {
                this.e.reload();
            }
        };
        this.$ = window.$;
        this.location = window.location;
        this.windowUtil.es = window;
        this.window = window;
        this.document = window.document;
        Glitter.glitter = this;
        Glitter.glitter.share.htmlExtension = (_a = Glitter.glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
    }
    get baseUrl() {
        var getUrl = window.location;
        return getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    }
    get uuid() {
        function _uuid() {
            var d = Date.now();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now();
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
            });
        }
        let uuid = this.getCookieByName("uuid");
        if (uuid === undefined) {
            uuid = _uuid();
            let oneYear = 2592000 * 12;
            this.document.cookie = `uuid=${uuid}; max-age=${oneYear}; path=/`;
        }
        return uuid;
    }
    parseCookie() {
        var cookieObj = {};
        var cookieAry = this.document.cookie.split(';');
        var cookie;
        for (let i = 0, l = cookieAry.length; i < l; ++i) {
            cookie = cookieAry[i].trim().split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
        return cookieObj;
    }
    getCookieByName(name) {
        var value = this.parseCookie()[name];
        if (value) {
            value = decodeURIComponent(value);
        }
        return value;
    }
    setPro(tag, data = "", callBack, option = {
        webFunction: (data, callback) => {
            Glitter.glitter.setCookie(tag, data.data.data);
            callback({ result: true });
        }
    }) {
        this.runJsInterFace("setPro", {
            uuid: this.uuid,
            name: tag,
            data: data,
        }, callBack, option);
    }
    getPro(tag, callBack, option = {
        webFunction: (data, callback) => {
            callback({ result: true, data: Glitter.glitter.getCookieByName(tag) });
        }
    }) {
        this.runJsInterFace("getPro", {
            uuid: this.uuid,
            name: tag
        }, callBack, option);
    }
    ;
    runJsInterFace(functionName, data, callBack, option = {}) {
        var _a;
        const glitter = this;
        let id = this.callBackId += 1;
        this.callBackList.set(id, callBack);
        let map = {
            functionName: functionName,
            callBackId: id,
            data: data
        };
        switch ((_a = option.defineType) !== null && _a !== void 0 ? _a : glitter.deviceType) {
            case glitter.deviceTypeEnum.Web: {
                if (option.webFunction) {
                    let data = option.webFunction(map, callBack);
                    if (data) {
                        callBack(data);
                    }
                }
                else {
                    glitter.$.ajax({
                        type: "POST",
                        url: glitter.webUrl + "/RunJsInterFace",
                        data: JSON.stringify(map),
                        timeout: 60 * 1000,
                        success: function (data) {
                            callBack(JSON.parse(data));
                        },
                        error: function (data) {
                            callBack(data);
                        }
                    });
                }
                return;
            }
            case glitter.deviceTypeEnum.Android: {
                glitter.window.GL.runJsInterFace(JSON.stringify(map));
                return;
            }
            case glitter.deviceTypeEnum.Ios: {
                glitter.window.webkit.messageHandlers.addJsInterFace.postMessage(JSON.stringify(map));
                break;
            }
        }
    }
    setSearchParam(search, name, value) {
        search = this.removeSearchParam(search, name);
        if (search === '') {
            search = '?';
        }
        if (search.length > 1) {
            search += '&';
        }
        return search + name + '=' + encodeURIComponent(value);
    }
    removeSearchParam(search, name) {
        if (search[0] === '?') {
            search = search.substring(1);
        }
        var parts = search.split('&');
        var res = [];
        for (var i = 0; i < parts.length; i++) {
            var pair = parts[i].split('=');
            if (pair[0] === name) {
                continue;
            }
            res.push(parts[i]);
        }
        search = res.join('&');
        if (search.length > 0) {
            search = '?' + search;
        }
        return search;
    }
    rootRout() {
        return this.location.href.substring(0, this.location.href.indexOf('index.html'));
    }
    goBackOnRootPage() {
        let glitter = this;
        if (glitter.deviceType === glitter.deviceTypeEnum.Web) {
            glitter.deBugMessage('window.history.back');
            window.history.back();
        }
    }
    ;
    deBugMessage(text) {
        if (this.debugMode) {
            console.log(text + ` : ${this.ut.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")}`);
        }
    }
    setUrlParameter(tag, value) {
        var search = (value !== undefined) ? this.setSearchParam(this.removeSearchParam(window.location.search, tag), tag, value) :
            this.removeSearchParam(window.location.search, tag);
        try {
            window.history.pushState({}, document.title, search);
        }
        catch (e) {
        }
    }
    setDrawer(src, callback) {
        const gliter = this;
        this.$("#Navigation").html(src);
        if (window.drawer === undefined) {
            gliter.addMtScript(['glitterBundle/plugins/NaviGation.js'], () => {
                callback();
            }, () => {
            });
        }
        else {
            callback();
        }
    }
    ;
    openDrawer() {
        if (window.drawer !== undefined) {
            window.drawer.open();
        }
        else {
            var timer = setInterval(function () {
                if (window.drawer !== undefined) {
                    window.drawer.open();
                    clearInterval(timer);
                }
            }, 100);
        }
    }
    ;
    closeDrawer() {
        try {
            window.drawer.close();
        }
        catch (e) { }
    }
    ;
    toggleDrawer() {
        try {
            window.drawer.toggle();
        }
        catch (e) { }
    }
    ;
    addScript(url, success, error) {
        const script = document.createElement('script');
        script.setAttribute('src', url);
        try {
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        success();
                    }
                };
            }
            else {
                script.onload = function () {
                    if (error !== undefined) {
                        error();
                    }
                };
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        catch (e) {
            if (null !== error) {
                alert(e);
                if (error !== undefined) {
                    error();
                }
            }
        }
    }
    ;
    addMtScript(urlArray, success, error, option) {
        var _a;
        Glitter.glitter.share.scriptMemory = (_a = Glitter.glitter.share.scriptMemory) !== null && _a !== void 0 ? _a : [];
        const glitter = this;
        let index = 0;
        function addScript() {
            var _a, _b, _c, _d, _e, _f;
            if (index === urlArray.length) {
                success();
                return;
            }
            var scritem = urlArray[index];
            if (Glitter.glitter.share.scriptMemory.indexOf(((_a = scritem.src) !== null && _a !== void 0 ? _a : scritem)) !== -1) {
                index++;
                addScript();
                return;
            }
            else {
                Glitter.glitter.share.scriptMemory.push(((_b = scritem.src) !== null && _b !== void 0 ? _b : scritem));
            }
            let script = document.createElement('script');
            try {
                if ((option !== null && option !== void 0 ? option : []).find((dd) => { return dd.key === 'async'; })) {
                    index++;
                    addScript();
                }
                else {
                    if (script.readyState) {
                        script.onreadystatechange = () => {
                            if (script.readyState === "loaded" || script.readyState === "complete") {
                                script.onreadystatechange = null;
                                index++;
                                addScript();
                            }
                            else {
                                alert(script.readyState);
                            }
                        };
                    }
                    else {
                        script.onload = () => {
                            index++;
                            addScript();
                        };
                    }
                }
                (option !== null && option !== void 0 ? option : []).map((dd) => {
                    script.setAttribute(dd.key, dd.value);
                });
                script.addEventListener('error', () => {
                    error("");
                });
                if (scritem.type === 'text/babel') {
                    glitter.$('body').append(`<script type="text/babel" src="${scritem.src}"></script>`);
                }
                else if (scritem.type !== undefined) {
                    script.setAttribute('type', scritem.type);
                    script.setAttribute('src', (_c = scritem.src) !== null && _c !== void 0 ? _c : undefined);
                    script.setAttribute('crossorigin', true);
                    script.setAttribute('id', (_d = scritem.id) !== null && _d !== void 0 ? _d : undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                else {
                    script.setAttribute('src', (_e = scritem.src) !== null && _e !== void 0 ? _e : scritem);
                    script.setAttribute('id', (_f = scritem.id) !== null && _f !== void 0 ? _f : undefined);
                    script.setAttribute('crossorigin', true);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
            }
            catch (e) {
                error(`Add ${urlArray[index]} ERROR!!`);
            }
        }
        addScript();
    }
    ;
    addCSS(fileName) {
        var head = document.head;
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = fileName;
        head.appendChild(link);
    }
    ;
    onBackPressed() {
        this.goBack();
    }
    ;
    closeApp() {
        const glitter = this;
        glitter.runJsInterFace("closeAPP", {}, function (response) {
        });
    }
    getUrlParameter(sParam) {
        let sPageURL = window.location.search.substring(1), sURLVariables = sPageURL.split('&'), sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }
    openNewTab(link) {
        const glitter = this;
        switch (glitter.deviceType) {
            case glitter.deviceTypeEnum.Web:
                window.open(link);
                break;
            case glitter.deviceTypeEnum.Android:
            case glitter.deviceTypeEnum.Ios:
                glitter.runJsInterFace("intentWebview", {
                    url: link
                }, function () {
                });
                break;
        }
    }
    print(fun, tryReturn) {
        if (tryReturn !== undefined) {
            try {
                return fun();
            }
            catch (e) {
                return tryReturn;
            }
        }
        else {
            return fun();
        }
    }
    getUUID() {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return "s" + (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
    }
    addStyle(style) {
        const glitter = this;
        let sl = {
            id: glitter.getUUID(),
            style: style
        };
        if (!glitter.parameter.styleList.find((dd) => {
            return dd.style === style;
        })) {
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = sl.id;
            if (css.styleSheet)
                css.styleSheet.cssText = style;
            else
                css.appendChild(document.createTextNode(style));
            document.getElementsByTagName("head")[0].appendChild(css);
            glitter.parameter.styleList.push(sl);
        }
    }
    async addStyleLink(data) {
        const glitter = this;
        var head = document.head;
        function add(filePath) {
            const id = glitter.getUUID();
            var haveURL = glitter.parameter.styleLinks.find((dd) => {
                return dd.src === filePath;
            });
            if (!haveURL) {
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = filePath;
                link.id = id;
                glitter.parameter.styleLinks.push({
                    id: id,
                    src: filePath
                });
                head.appendChild(link);
            }
        }
        if (typeof data == "string") {
            add(data);
        }
        else {
            data.map((d3) => {
                add(d3);
            });
        }
    }
    setCookie(key, value) {
        let oneYear = 2592000 * 12;
        this.document.cookie = `${key}=${value}; max-age=${oneYear}; path=/`;
    }
    removeCookie(keyList) {
        if (Array.isArray(keyList)) {
            keyList.map((k) => (this.document.cookie = `${k}=''; max-age=-99999999; path=/`));
        }
        else if (keyList === undefined) {
            let list = this.document.cookie.split('; ');
            list.map((l) => (this.document.cookie = `${l.split('=')[0]}=''; max-age=-99999999; path=/`));
        }
    }
}
