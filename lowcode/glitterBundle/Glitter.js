"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Animation } from "./module/Animation.js";
import { GVCType, PageManager, DefaultSetting } from "./module/PageManager.js";
import { AppearType } from "./module/Enum.js";
import { HtmlGenerate } from "./module/html-generate.js";
export class Glitter {
    constructor(window) {
        var _a;
        this.root_path = (() => {
            return new URL('../', import.meta.url).href;
        })();
        this.gvcType = GVCType;
        this.deviceTypeEnum = AppearType;
        this.animation = Animation;
        this.page = '';
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
        this.config = {};
        this.webUrl = '';
        this.goBackStack = [];
        this.parameter = { styleList: [], styleLinks: [] };
        this.callBackId = 0;
        this.callBackList = new Map();
        this.debugMode = localStorage.getItem('glitter-db-mode') || 'false';
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
        this.html = String.raw;
        this.promiseValueMap = {};
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
            queue: {},
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
            setQueue: (tag, fun, callback) => {
                var _a;
                const queue = this.ut.queue;
                queue[tag] = (_a = queue[tag]) !== null && _a !== void 0 ? _a : {
                    callback: [],
                    data: undefined,
                    isRunning: false
                };
                if (queue[tag].data) {
                    callback && callback((() => {
                        try {
                            return JSON.parse(JSON.stringify(queue[tag].data));
                        }
                        catch (e) {
                            console.log(`parseError`, queue[tag].data);
                        }
                    })());
                }
                else {
                    queue[tag].callback.push(callback);
                    if (!queue[tag].isRunning) {
                        queue[tag].isRunning = true;
                        fun((response) => {
                            queue[tag].callback.map((callback) => {
                                callback && callback((() => {
                                    try {
                                        return JSON.parse(JSON.stringify(response));
                                    }
                                    catch (e) {
                                        console.log(`parseError`, queue[tag].data);
                                    }
                                })());
                            });
                            queue[tag].data = response;
                            queue[tag].callback = [];
                        });
                    }
                }
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
            tryMethod(method) {
                method.map((dd) => {
                    try {
                        dd();
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
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
                let returnSize = def;
                var wi = $('html').width();
                var lastIndex = 0;
                Object.keys(sizeMap).map((dd) => {
                    var _a;
                    let index = { sm: 576, me: 768, lg: 992, xl: 1200, xxl: 1400 };
                    let sizeCompare = ((_a = index[dd]) !== null && _a !== void 0 ? _a : parseInt(dd, 10));
                    if (wi >= sizeCompare && sizeCompare > lastIndex) {
                        returnSize = sizeMap[dd];
                        lastIndex = sizeCompare;
                    }
                });
                return returnSize;
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
        this.renderView = {
            replaceGlobalValue: function (inputString) {
                const glitter = Glitter.glitter;
                if ((glitter.share.EditorMode === true)) {
                    return inputString;
                }
                let convert = inputString;
                function replaceString(pattern) {
                    let match;
                    while ((match = pattern.exec(convert)) !== null) {
                        const placeholder = match[0];
                        const value = match[1];
                        if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                            convert = convert.replace(placeholder, glitter.share.globalValue[value]);
                        }
                    }
                }
                replaceString(/\/\**@{{(.*?)}}\*\//g);
                replaceString(/@{{(.*?)}}/g);
                return convert;
            },
            replacePromiseValue: function (inputString) {
                const glitter = Glitter.glitter;
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const pattern = /@PROMISE{{(.*?)}}/g;
                    let match;
                    let convert = inputString;
                    while ((match = pattern.exec(inputString)) !== null) {
                        const placeholder = match[0];
                        const value = match[1];
                        inputString = inputString.replace(placeholder, yield glitter.promiseValueMap[value]);
                    }
                    resolve(inputString);
                }));
            },
            replaceAttributeValue: function (dd, element) {
                var _a;
                try {
                    dd = JSON.parse(JSON.stringify(dd));
                    if (dd.value && (typeof dd.value !== 'string')) {
                        dd.value = `${dd.value}`;
                    }
                    if (!element) {
                        return;
                    }
                    const glitter = Glitter.glitter;
                    element.replaceAtMemory = (_a = element.replaceAtMemory) !== null && _a !== void 0 ? _a : {};
                    if (dd.value && ((dd.value.includes('clickMap') || dd.value.includes('editorEvent')) && (dd.key.substring(0, 2) === 'on'))) {
                        try {
                            const funString = `${dd.value}`;
                            if (!(element.replaceAtMemory[dd.key])) {
                                element.addEventListener(dd.key.substring(2), function () {
                                    if (glitter.htmlGenerate.isEditMode() && !glitter.share.EditorMode && glitter.getUrlParameter('type') === 'htmlEditor') {
                                        if (funString.indexOf('editorEvent') !== -1) {
                                            eval(funString.replace('editorEvent', 'clickMap'));
                                        }
                                        else if (dd.key !== 'onclick') {
                                            eval(funString);
                                        }
                                    }
                                    else {
                                        eval(funString);
                                    }
                                });
                            }
                            element.removeAttribute(dd.key);
                            element.replaceAtMemory[dd.key] = true;
                        }
                        catch (e) {
                            console.log(e);
                            glitter.deBugMessage(e);
                        }
                    }
                    else {
                        try {
                            if (dd.value) {
                                element.setAttribute(dd.key, dd.value);
                            }
                        }
                        catch (e) {
                        }
                    }
                    if (dd.key && dd.key.includes('@PROMISE')) {
                        glitter.renderView.replacePromiseValue(dd.key).then((data) => {
                            element.setAttribute(data, dd.value);
                            console.log(`setPromise->${data} to ${dd.value}`);
                        });
                    }
                    if (dd.value && dd.value.includes('@PROMISE')) {
                        glitter.renderView.replacePromiseValue(dd.value).then((data) => {
                            element.setAttribute(dd.key, data);
                        });
                    }
                }
                catch (e) {
                    console.log(e);
                }
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
    get href() {
        return location.href;
    }
    set href(value) {
        const link = new URL(value, location.href);
        if ((location.origin) === (link.origin)) {
            window.history.replaceState({}, document.title, link.href);
            this.getModule(new URL('../official_event/page/change-page.js', import.meta.url).href, (cl) => {
                cl.changePage(link.searchParams.get('page') || location.pathname.substring(1), 'page', {});
            });
        }
        else {
            location.href = value;
        }
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
    get macAddress() {
        if (!localStorage.getItem('mac_address')) {
            localStorage.setItem('mac_address', this.getUUID('xxxxxxxx'));
        }
        return localStorage.getItem('mac_address');
    }
    promiseValue(fun) {
        const index = Object.keys(this.promiseValueMap).length + 1;
        this.promiseValueMap[`${index}`] = fun;
        return `@PROMISE{{${index}}}`;
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
        return localStorage.getItem(name);
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
    deBugMessage(error) {
        if (this.debugMode === 'true') {
            try {
                if (error && error.message) {
                    console.error(`${error}
${(!error.message) ? `` : `錯誤訊息:${error.message}`}${(!error.lineNumber) ? `` : `錯誤行數:${!error.lineNumber}`}${(!error.columnNumber) ? `` : `錯誤位置:${error.columnNumber}`}\n${this.ut.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")}
                `);
                }
                else {
                    console.log(error);
                }
            }
            catch (e) {
            }
        }
    }
    consoleLog(text) {
        if (this.debugMode === 'true') {
            console.log(text);
        }
    }
    setUrlParameter(tag, value) {
        if (tag === 'page' && value) {
            try {
                this.page = value;
                const url = new URL(this.root_path + value + window.location.search);
                url.searchParams.delete('page');
                window.history.replaceState({}, document.title, url.href);
            }
            catch (e) {
            }
        }
        else {
            const url = new URL(location.href);
            url.searchParams.delete(tag);
            if (value) {
                url.searchParams.set(tag, value);
            }
            try {
                window.history.replaceState({}, document.title, url.href);
            }
            catch (e) {
            }
        }
    }
    setDrawer(src, callback) {
        const gliter = this;
        $("#Navigation").hide();
        if (window.drawer === undefined) {
            gliter.addMtScript([new URL('./plugins/NaviGation.js', import.meta.url)], () => {
                callback();
                $("#Navigation").html(src);
            }, () => {
            });
        }
        else {
            callback();
            $("#Navigation").html(src);
        }
    }
    ;
    openDrawer() {
        if (window.drawer !== undefined) {
            $("#Navigation").show();
            window.drawer.open();
        }
        else {
            var timer = setInterval(function () {
                if (window.drawer !== undefined) {
                    $("#Navigation").show();
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
        catch (e) {
        }
    }
    ;
    toggleDrawer() {
        try {
            window.drawer.toggle();
        }
        catch (e) {
        }
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
                if ((option !== null && option !== void 0 ? option : []).find((dd) => {
                    return dd.key === 'async';
                })) {
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
                    scritem.id && (script.setAttribute('id', (_d = scritem.id) !== null && _d !== void 0 ? _d : undefined));
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                else {
                    script.setAttribute('src', (_e = scritem.src) !== null && _e !== void 0 ? _e : scritem);
                    scritem.id && (script.setAttribute('id', (_f = scritem.id) !== null && _f !== void 0 ? _f : undefined));
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
    generateCheckSum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash = hash & hash;
        }
        hash = Math.abs(hash);
        let checksum = hash.toString().slice(0, 6);
        while (checksum.length < 6) {
            checksum = '0' + checksum;
        }
        return checksum;
    }
    getUrlParameter(sParam) {
        function next() {
            let sPageURL = window.location.search.substring(1), sURLVariables = sPageURL.split('&'), sParameterName, i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        }
        if (sParam === 'page') {
            this.page = this.page || next();
            this.setUrlParameter('page', undefined);
            return this.page;
        }
        else {
            return next();
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
    getUUID(format) {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return (format !== null && format !== void 0 ? format : 'xxxxxxxx').replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return "s" + (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
    }
    addStyle(style) {
        var _a, _b;
        const glitter = window.glitter;
        glitter.share.style_memory = (_a = glitter.share.style_memory) !== null && _a !== void 0 ? _a : {};
        const checkSum = glitter.generateCheckSum(style);
        if (glitter.share.style_memory[checkSum]) {
            return;
        }
        glitter.share.style_memory[checkSum] = true;
        glitter.share.wait_add_style_string = (_b = glitter.share.wait_add_style_string) !== null && _b !== void 0 ? _b : style;
        glitter.share.wait_add_style_string += style;
        const css = document.createElement('style');
        css.type = 'text/css';
        if (css.styleSheet)
            css.styleSheet.cssText = glitter.share.wait_add_style_string;
        else
            css.appendChild(document.createTextNode(glitter.share.wait_add_style_string));
        glitter.share.wait_add_style_string = '';
        document.getElementsByTagName("head")[0].appendChild(css);
    }
    addStyleLink(data, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = doc !== null && doc !== void 0 ? doc : (window.document);
            const glitter = this;
            const head = document.head || document;
            function add(filePath) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => {
                        const id = glitter.getUUID();
                        let allLinks = document.querySelectorAll("link");
                        let pass = true;
                        for (let i = 0; i < allLinks.length; i++) {
                            const hrefValue = allLinks[i].getAttribute("href");
                            if (hrefValue === filePath) {
                                pass = false;
                                break;
                            }
                        }
                        if (pass) {
                            let link = (window.document).createElement("link");
                            link.type = "text/css";
                            link.rel = "stylesheet";
                            link.href = filePath;
                            link.id = id;
                            link.onload = function () {
                                resolve(true);
                            };
                            link.onerror = function () {
                                resolve(false);
                            };
                            glitter.parameter.styleLinks.push({
                                id: id,
                                src: filePath
                            });
                            head.appendChild(link);
                        }
                        else {
                            resolve(true);
                        }
                    });
                });
            }
            if (typeof data == "string") {
                yield add(data);
            }
            else {
                for (const d3 of data) {
                    yield add(d3);
                }
            }
        });
    }
    setCookie(key, value) {
        localStorage.setItem(key, value);
    }
    removeCookie(keyList) {
        if (Array.isArray(keyList)) {
            keyList.map((k) => (localStorage.removeItem(k)));
        }
        else if (keyList === undefined) {
            localStorage.clear();
        }
    }
    setModule(key, value) {
        var _a;
        this.share.glitterModule = (_a = this.share.glitterModule) !== null && _a !== void 0 ? _a : {};
        this.share.glitterModule[key] = value;
    }
    getModule(js, callback) {
        var _a, _b, _c;
        const glitter = this;
        glitter.share.glitterModule = (_a = glitter.share.glitterModule) !== null && _a !== void 0 ? _a : {};
        glitter.share.glitterModuleCallback = (_b = glitter.share.glitterModuleCallback) !== null && _b !== void 0 ? _b : {};
        if (glitter.share.glitterModule[js]) {
            callback(glitter.share.glitterModule[js]);
        }
        else {
            glitter.share.glitterModuleCallback[js] = (_c = glitter.share.glitterModuleCallback[js]) !== null && _c !== void 0 ? _c : [];
            glitter.share.glitterModuleCallback[js].push(callback);
            Object.defineProperty(glitter.share.glitterModule, js, {
                get() {
                    return glitter.share.glitterModule['init_' + js];
                },
                set(newValue) {
                    glitter.share.glitterModule['init_' + js] = newValue;
                    glitter.share.glitterModuleCallback[js].map((callback) => {
                        callback && callback(newValue);
                    });
                    glitter.share.glitterModuleCallback[js] = [];
                },
                enumerable: true,
                configurable: true
            });
            glitter.addMtScript([{
                    type: 'module',
                    src: js
                }], () => {
            }, () => {
            }, [
                { key: "async", value: "true" }
            ]);
        }
    }
}
