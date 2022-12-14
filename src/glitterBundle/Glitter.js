"use strict";
class AppearType {
    constructor() {
        this.Web = 0;
        this.Android = 1;
        this.Ios = 2;
    }
}
class HtmlType {
    constructor() {
        this.Page = 0;
        this.Dialog = 1;
        this.Frag = 2;
    }
}
class Animator {
    constructor() {
        this.translation = "translation";
        this.rotation = 1;
        this.verticalTranslation = 2;
        this.none = undefined;
    }
}
export class Glitter {
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
    changePageListener(tag) {
        for (const data of this.changePageCallback) {
            try {
                data(tag);
            }
            catch (e) {
            }
        }
    }
    ;
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
    setPro(tag, data, callBack, option) {
        this.runJsInterFace("setPro", {
            uuid: this.uuid,
            name: tag,
            data: data,
        }, callBack, option);
    }
    getPro(tag, callBack, option) {
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
    showLoadingView() {
        this.$('#loadingView').show();
    }
    ;
    hidePageView(id, del = false) {
        try {
            const index = this.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            this.pageConfig[index].deleteResource();
            if (del) {
                this.$(`#page` + this.pageConfig[index].id).remove();
                this.$(`#` + this.pageConfig[index].id).remove();
                this.pageConfig.splice(index, 1);
            }
            else {
                this.$(`#page` + this.pageConfig[index].id).hide();
                this.$(`#` + this.pageConfig[index].id).hide();
            }
        }
        catch (e) {
        }
    }
    showPageView(id) {
        try {
            const index = this.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            this.$(`#page` + this.pageConfig[index].id).show();
            this.$(`#` + this.pageConfig[index].id).show();
            this.pageConfig[index].createResource();
            this.setUrlParameter('page', this.pageConfig[index].tag);
        }
        catch (e) {
        }
    }
    setHome(url, tag, obj) {
        const glitter = this;
        for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
            glitter.hidePageView(glitter.pageConfig[a].id, true);
        }
        const config = {
            id: glitter.getUUID(),
            obj: obj,
            goBack: true,
            src: url,
            tag: tag,
            createResource: () => {
            },
            deleteResource: () => {
            }
        };
        glitter.nowPageConfig = config;
        let module = this.modelJsList.find((dd) => {
            return dd.src === url;
        });
        if (module) {
            module.create(this);
            const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
            try {
                glitter.window.history.pushState({}, glitter.document.title, search);
            }
            catch (e) {
            }
            glitter.pageConfig = [];
            glitter.pageConfig.push(config);
            glitter.setUrlParameter('page', tag);
        }
        else {
            this.addMtScript([{
                    src: url,
                    type: 'module',
                    id: config.id
                }], () => {
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
                try {
                    glitter.window.history.pushState({}, glitter.document.title, search);
                }
                catch (e) {
                }
                glitter.pageConfig = [];
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('page', tag);
            }, () => {
                console.log("can't find script src:" + url);
            }, { multiple: true });
        }
    }
    ;
    setLoadingView(link) {
        this.$('#loadingView').hide();
        this.$('#loadingView').append('<iframe  src="' + link + '" style="width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);"></iframe>');
    }
    hideLoadingView() {
        this.$('#loadingView').hide();
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
        var search = this.setSearchParam(this.removeSearchParam(window.location.search, tag), tag, value);
        try {
            window.history.pushState({}, document.title, search);
        }
        catch (e) {
        }
    }
    changePage(url, tag, goBack, obj) {
        const glitter = this;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.changePage(url, tag, goBack, obj);
            }, 100);
        }
        else {
            glitter.waitChangePage = true;
            const config = {
                id: glitter.getUUID(),
                obj: obj,
                goBack: true,
                src: url,
                tag: tag,
                deleteResource: () => {
                },
                createResource: () => {
                }
            };
            glitter.nowPageConfig = config;
            let module = this.modelJsList.find((dd) => {
                return dd.src === url;
            });
            if (module) {
                module.create(this);
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
                glitter.window.history.pushState({}, glitter.document.title, search);
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('page', tag);
                glitter.waitChangePage = false;
            }
            else {
                this.addMtScript([{
                        src: url,
                        type: 'module',
                        id: config.id
                    }], () => {
                    const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
                    glitter.window.history.pushState({}, glitter.document.title, search);
                    glitter.pageConfig.push(config);
                    glitter.waitChangePage = false;
                }, () => {
                    console.log("can't find script src:" + url);
                    glitter.waitChangePage = false;
                }, { multiple: true });
            }
        }
    }
    removePage(tag) {
        const pg = this.pageConfig.find((dd) => {
            return dd.tag === tag;
        });
        if (pg) {
            this.hidePageView(pg.id, true);
        }
    }
    ;
    openDiaLog(url, tag, swipe, cancelable, obj, dismiss) {
        const glitter = this;
        if (glitter.dialog.filter(function (item) {
            return item.id === `Dialog-${tag}`;
        }).length !== 0) {
            return;
        }
        const map = {
            id: `Dialog-${tag}`,
            obj: obj,
            dismiss: dismiss,
            pageIndex: glitter.pageIndex++,
            cancelable: cancelable
        };
        glitter.dialog.push(map);
        glitter.$('#diaPlace').show();
        glitter.$('#diaPlace').append(`<iframe name="${map.id}" src="${url}?tag=${map.id}&pageIndex=${map.pageIndex}&type=Dialog"  id="${map.id}" style="display: none;z-index:${map.pageIndex};position: absolute;"></iframe>`);
        let element = document.getElementById(map.id);
        if (!swipe) {
            element.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        }
        glitter.changeWait = function () {
            glitter.$(`#${map.id}`).show();
        };
    }
    ;
    closeDiaLog(tag) {
        const glitter = this;
        if (tag !== undefined) {
            glitter.closeDiaLogWithTag(tag);
            return;
        }
        var tempDialog = glitter.dialog;
        glitter.dialog = [];
        for (var i = 0; i < tempDialog.length; i++) {
            if (tempDialog[i].dismiss !== undefined) {
                tempDialog[i].dismiss();
            }
            try {
                glitter.document.getElementById(`#${tempDialog[i].id}`).contentWindow.lifeCycle.onDestroy();
            }
            catch (e) {
            }
            glitter.$(`#${tempDialog[i].id}`).remove();
        }
        glitter.$('#diaPlace').html('');
        glitter.$('#diaPlace').hide();
    }
    closeDiaLogWithTag(tag) {
        const glitter = this;
        let tempArray = [];
        for (var i = 0; i < glitter.dialog.length; i++) {
            var id = glitter.dialog[i].id;
            if (id === `Dialog-${tag}` || id === tag) {
                if (glitter.dialog[i].dismiss !== undefined) {
                    glitter.dialog[i].dismiss();
                }
                try {
                    glitter.document.getElementById(`#${id}`).contentWindow.lifeCycle.onDestroy();
                }
                catch (e) {
                }
                glitter.$('#' + id).remove();
            }
            else {
                tempArray = tempArray.concat(glitter.dialog[i]);
            }
        }
        glitter.dialog = tempArray;
        if (glitter.dialog.length === 0) {
            glitter.$('#diaPlace').html('');
            glitter.$('#diaPlace').hide();
        }
    }
    ;
    getDialog(tag) {
        const glitter = this;
        for (let i = 0; i < glitter.dialog.length; i++) {
            if (glitter.dialog[i].id === `Dialog-${tag}` || (glitter.dialog[i].id === tag)) {
                return this.dialog[i];
            }
        }
    }
    ;
    goBack(tag = undefined) {
        if (tag === undefined && this.pageConfig.length > 1) {
            const pageHide = this.pageConfig[this.pageConfig.length - 1];
            const pageShow = this.pageConfig[this.pageConfig.length - 2];
            this.hidePageView(pageHide.id, true);
            this.showPageView(pageShow.id);
        }
        else if (this.pageConfig.find((dd) => {
            return dd.tag === tag;
        })) {
            for (let a = this.pageConfig.length - 1; a >= 0; a--) {
                if (this.pageConfig[a].tag == tag) {
                    this.showPageView(this.pageConfig[a].id);
                    break;
                }
                else {
                    this.hidePageView(this.pageConfig[a].id, true);
                }
            }
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
        const glitter = this;
        let index = 0;
        function addScript() {
            var _a, _b, _c, _d, _e;
            if (index === urlArray.length) {
                success();
                return;
            }
            var scritem = urlArray[index];
            var haveURL = false;
            if ((_a = !option) !== null && _a !== void 0 ? _a : { multiple: false }.multiple) {
                glitter.$('head').children().map(function (data) {
                    var _a;
                    if (glitter.$('head').children().get(data).src === ((_a = scritem.src) !== null && _a !== void 0 ? _a : scritem)) {
                        haveURL = true;
                    }
                });
            }
            if (haveURL) {
                index++;
                addScript();
                return;
            }
            let script = document.createElement('script');
            try {
                if (script.readyState) {
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            index++;
                            addScript();
                        }
                    };
                }
                else {
                    script.onload = () => {
                        if (success !== undefined) {
                            index++;
                            addScript();
                        }
                    };
                }
                if (scritem.type === 'text/babel') {
                    glitter.$('body').append(`<script type="text/babel" src="${scritem.src}"></script>`);
                }
                else if (scritem.type !== undefined) {
                    script.setAttribute('type', scritem.type);
                    script.setAttribute('src', (_b = scritem.src) !== null && _b !== void 0 ? _b : undefined);
                    script.setAttribute('id', (_c = scritem.id) !== null && _c !== void 0 ? _c : undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                else {
                    script.setAttribute('src', (_d = scritem.src) !== null && _d !== void 0 ? _d : scritem);
                    script.setAttribute('id', (_e = scritem.id) !== null && _e !== void 0 ? _e : undefined);
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
    goMenu() {
        for (let a = this.pageConfig.length - 1; a >= 0; a--) {
            if (a == 0) {
                this.showPageView(this.pageConfig[a].id);
                break;
            }
            else {
                this.hidePageView(this.pageConfig[a].id, true);
            }
        }
    }
    addChangePageListener(callback) {
        this.changePageCallback.push(callback);
    }
    showToast(string, sec) {
        const glitter = this;
        this.$('#toast').html(string);
        this.$('#toast').show();
        setTimeout(function () {
            glitter.$('#toast').hide();
        }, sec === undefined ? 2000 : sec);
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
    getPage(tag) {
        const glitter = this;
        var page = undefined;
        for (var a = 0; a < glitter.iframe.length; a++) {
            if (glitter.iframe[a].id === tag) {
                return glitter.document.getElementById(glitter.iframe[a].pageIndex).contentWindow;
            }
        }
        return page;
    }
    getNowPage() {
        const glitter = this;
        return {
            tag: glitter.iframe[glitter.iframe.length - 1].id,
            window: glitter.document.getElementById(glitter.iframe[glitter.iframe.length - 1].pageIndex).contentWindow
        };
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
    addStyleLink(data) {
        const gvc = this;
        var head = document.head;
        const id = gvc.getUUID();
        function add(filePath) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = filePath;
            link.id = id;
            gvc.parameter.styleLinks.push({
                id: id,
                src: filePath
            });
            head.appendChild(link);
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
        else if (keyList == '*') {
            let list = this.document.cookie.split('; ');
            list.map((l) => (this.document.cookie = `${l.split('=')[0]}=''; max-age=-99999999; path=/`));
        }
    }
    constructor(window) {
        this.deviceTypeEnum = new AppearType();
        this.htmlType = new HtmlType();
        this.animator = new Animator();
        this.webUrl = '';
        this.goBackStack = [];
        this.parameter = { styleList: [], styleLinks: [] };
        this.callBackId = 0;
        this.callBackList = new Map();
        this.debugMode = false;
        this.publicBeans = {};
        this.share = {};
        this.defaultAnimator = this.animator.none;
        this.deviceType = this.deviceTypeEnum.Web;
        this.iframe = [];
        this.ifrag = [];
        this.dialog = [];
        this.sheetList = [];
        this.webPro = {};
        this.modelJsList = [];
        this.pageIndex = 0;
        this.getBoundingClientRect = {};
        this.changePageCallback = [];
        this.pageConfig = [];
        this.waitChangePage = false;
        this.changeWait = function () {
        };
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
                var wi = this.glitter.$('html').width();
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
    }
}
