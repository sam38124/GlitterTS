"use strict";
import {Animation, AnimationConfig} from "./module/Animation.js";
import {PageConfig, GVCType, PageManager, DefaultSetting} from "./module/PageManager.js";
import {AppearType} from "./module/Enum.js"
import {HtmlGenerate} from "./module/html-generate.js"
import {Language} from "../glitter-base/global/language.js";


export class Glitter {
    public root_path = (() => {
        return new URL('../', import.meta.url).href
    })()
    public static glitter: Glitter
    /*ENUM*/
    public gvcType = GVCType
    public deviceTypeEnum = AppearType;
    public animation = Animation;
    public page: string = ''
    /*DefaultSetting*/
    public defaultSetting = new DefaultSetting({
        pageBgColor: "white",
        pageAnimation: this.animation.none,
        dialogAnimation: this.animation.none,
        pageLoading: () => {
        },
        pageLoadingFinish: () => {
        }
    })
    /*Parameter*/
    public htmlGenerate = HtmlGenerate
    public window: Window;
    public config: any = {};
    public $: any;
    public document: any;
    public webUrl: string = '';
    public goBackStack: (() => void)[] = [];
    public parameter: any = {styleList: [], styleLinks: []}
    public callBackId: number = 0;
    public callBackList = new Map();
    public location: any;
    public debugMode = localStorage.getItem('glitter-db-mode') || 'false'
    public publicBeans = {};
    public share: any = {};
    public deviceType = this.deviceTypeEnum.Web
    public modelJsList: { src: string, create: (glitter: Glitter) => void }[] = []
    public pageIndex = 0
    public getBoundingClientRect = {}
    public changePageCallback: ((tag: string) => void)[] = []
    public pageConfig: PageConfig[] = []
    public nowPageConfig?: PageConfig
    public waitChangePage = false
    public elementCallback: {
        [name: string]: {
            onCreate: () => void,
            onInitial: () => void,
            notifyDataChange: () => void,
            getView: () => string | Promise<string>,
            updateAttribute: () => void,
            onDestroy: () => void,
            rendered: boolean,
            recreateView: () => void,
            element: any,
            doc: any,
            initial_view?: string | Promise<string>
        }
    } = {}
    public html = String.raw
    public promiseValueMap: any = {}

    get href() {
        return location.href
    }

    set href(value) {
        const link = new URL(value, location.href);
        if ((location.origin) === (link.origin)) {
            if (link.searchParams.get("page")) {
                const page = link.searchParams.get("page")
                link.searchParams.delete("page");
                link.pathname += page
            }
            window.history.replaceState({}, document.title, link.href);
            this.getModule(new URL('../official_event/page/change-page.js', import.meta.url).href, (cl) => {
                cl.changePage(link.searchParams.get('page') || location.pathname.substring(1), 'page', {})
            })
        } else {
            location.href = value;
        }
    }

    /*Getter*/

    //@ts-ignore
    get baseUrl() {
        var getUrl = window.location;
        return getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    }

    get uuid(): string {
        function _uuid() {
            var d = Date.now();

            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
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
        return uuid
    }

    get macAddress(): string {
        if (!localStorage.getItem('mac_address')) {
            localStorage.setItem('mac_address', this.getUUID('xxxxxxxx'))
        }
        return localStorage.getItem('mac_address')!
    }

    /*PageManager*/
    public hidePageView = PageManager.hidePageView
    public showPageView = PageManager.showPageView
    public setHome = PageManager.setHome
    public setLoadingView = PageManager.setLoadingView
    public changePageListener = PageManager.changePageListener
    public showLoadingView = PageManager.showLoadingView
    public changeWait = PageManager.changeWait
    public setAnimation = PageManager.setAnimation
    public changePage = PageManager.changePage
    public removePage = PageManager.removePage
    public openDiaLog = PageManager.openDiaLog
    public innerDialog = PageManager.innerDialog
    public closeDiaLog = PageManager.closeDiaLog
    public hideLoadingView = PageManager.hideLoadingView
    public goBack = PageManager.goBack
    public goMenu = PageManager.goMenu
    public addChangePageListener = PageManager.addChangePageListener
    public recreateView = (selector: string) => {
        for (const a of document.querySelectorAll(`${selector}`)) {
            (a as any).recreateView()
        }
    }

    public promiseValue(fun: Promise<any> | string) {
        const index = Object.keys(this.promiseValueMap).length + 1
        this.promiseValueMap[`${index}`] = fun
        return `@PROMISE{{${index}}}`
    }

    /*Function*/
    public parseCookie(): any {
        var cookieObj: any = {};
        var cookieAry = this.document.cookie.split(';');
        var cookie: any[];
        for (let i = 0, l = cookieAry.length; i < l; ++i) {
            cookie = cookieAry[i].trim().split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
        return cookieObj;
    }

    public getCookieByName(name: string): string {
        return localStorage.getItem(name) as string;
    }

    public setPro(tag: string, data: string = "", callBack: (data: {}) => void, option:
        { defineType?: any, webFunction: (data: any, callback: (data: any) => void) => any }
        = {
        webFunction: (data: any, callback: (data: any) => void) => {
            Glitter.glitter.setCookie(tag, data.data.data)
            callback({result: true})
        }
    }) {
        this.runJsInterFace("setPro", {
            uuid: this.uuid,
            name: tag,
            data: data,
        }, callBack, option);
    }

    public getPro(tag: string, callBack: (response: { data: any }) => void, option: {
        defineType?: any,
        webFunction: (data: any, callback: (data: any) => void) => any
    }
        = {
        webFunction: (data: any, callback: (data: any) => void) => {
            callback({result: true, data: Glitter.glitter.getCookieByName(tag)})
        }
    }) {
        this.runJsInterFace("getPro", {
            uuid: this.uuid,
            name: tag
        }, callBack, option);
    };

    public runJsInterFace(functionName: string, data: {}, callBack: (data: any) => void, option: {
        defineType?: any,
        webFunction?(data: any, callback: (data: any) => void): any
    } = {}) {
        const glitter = this
        let id = this.callBackId += 1;
        this.callBackList.set(id, callBack);
        let map = {
            functionName: functionName,
            callBackId: id,
            data: data
        };
        switch (option.defineType ?? glitter.deviceType) {
            case glitter.deviceTypeEnum.Web: {
                if (option.webFunction) {
                    let data = option.webFunction(map, callBack)
                    if (data) {
                        callBack(data)
                    }
                }
                return;
            }
            case glitter.deviceTypeEnum.Android: {
                (glitter.window as any).GL.runJsInterFace(JSON.stringify(map));
                return;
            }
            case glitter.deviceTypeEnum.Ios: {
                (glitter.window as any).webkit.messageHandlers.addJsInterFace.postMessage(JSON.stringify(map));
                break;
            }
        }
    }

    public setSearchParam(search: string, name: string, value: string) {
        search = this.removeSearchParam(search, name);
        if (search === '') {
            search = '?';
        }
        if (search.length > 1) {
            search += '&';
        }
        return search + name + '=' + encodeURIComponent(value);
    }

    public removeSearchParam(search: string, name: string) {
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

    public rootRout() {
        return this.location.href.substring(0, this.location.href.indexOf('index.html'))
    }

    public goBackOnRootPage() {
        let glitter = this
        if (glitter.deviceType === glitter.deviceTypeEnum.Web) {
            glitter.deBugMessage('window.history.back')
            window.history.back()
        }
    };

    public deBugMessage(error: any) {
        if (this.debugMode === 'true') {
            try {
                if (error && error.message) {
                    console.error(`${error}
${(!error.message) ? `` : `錯誤訊息:${error.message}`}${(!error.lineNumber) ? `` : `錯誤行數:${!error.lineNumber}`}${(!error.columnNumber) ? `` : `錯誤位置:${error.columnNumber}`}\n${this.ut.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")}
                `)
                } else {
                    console.log(error)
                }

                // console.error('錯誤訊息:', error.message);
                // console.error('錯誤行數:', error.lineNumber);
                // console.error('錯誤位置:', error.columnNumber);
            } catch (e) {

            }
        }
    }

    public consoleLog(text: string) {
        if (this.debugMode === 'true') {
            console.log(text)
        }
    }

    public setUrlParameter(tag: string, value?: string) {
        if (tag === 'page' && value) {
            try {
                this.page = value;
                const url = new URL((() => {
                    if (value === 'index') {
                        return this.root_path.substring(0, this.root_path.length - 1) + Language.getLanguageLinkPrefix(false) + window.location.search
                    } else {
                        return this.root_path + Language.getLanguageLinkPrefix() + value + window.location.search
                    }
                })())
                url.searchParams.delete('page')
                window.history.replaceState({}, document.title, url.href);
            } catch (e) {
            }
        } else {
            const url = new URL(location.href)
            url.searchParams.delete(tag)
            if (value) {
                url.searchParams.set(tag, value)
            }
            try {
                window.history.replaceState({}, document.title, url.href);
            } catch (e) {
            }
        }
    }

    public setDrawer(src: string, callback: () => void) {
        const gliter = this;
        if ((window as any).drawer && (window as any).drawer.opened) {
            $("#Navigation").show()
        } else {
            $("#Navigation").hide()
        }

        if ((window as any).drawer === undefined) {
            gliter.addMtScript([new URL('./plugins/NaviGation.js', import.meta.url).href], () => {
                callback()
                $("#Navigation").html(src);
            }, () => {
            })
        } else {
            callback()
            $("#Navigation").html(src);
        }
    };

    public openDrawer(width?: number,align?:'left'|'right') {
        width = width || 300;

        function showDrawer() {
            (window as any).drawer.align=align
            if (align === 'right') {
                $('.hy-drawer-content').hide();
                setTimeout(() => {
                    $("#Navigation").show();
                    $('.hy-drawer-content').show();
                }, 300)
            } else {
                $('.hy-drawer-content').show();
                $("#Navigation").hide();
            }
        }

        if ((window as any).drawer !== undefined) {
            showDrawer();
            (window as any).drawer.open();
            if (width) {
                (document.querySelector('.hy-drawer-content') as any).style.width = width + 'px'
            }
        } else {
            var timer = setInterval(function () {
                if ((window as any).drawer !== undefined) {
                    showDrawer();
                    (window as any).drawer.open();
                    if (width) {
                        (document.querySelector('.hy-drawer-content') as any).style.width = width + 'px'
                    }
                    clearInterval(timer);
                }
            }, 100);
        }
    }; //關閉側滑選單

    public closeDrawer() {

        try {
            if ((window as any).drawer.align === 'right') {
                $('.hy-drawer-content').hide();
                $("#Navigation").hide();
            }
            (window as any).drawer.close();
        } catch (e) {
        }

    }; //開關側滑選單


    public toggleDrawer() {
        try {
            (window as any).drawer.toggle();
        } catch (e) {
        }
    }; //按鈕監聽


    public addScript(url: string, success: () => void, error: () => void) {
        const script: any = document.createElement('script');
        script.setAttribute('src', url);
        try {
            if (script.readyState) {
                //IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        success();
                    }
                };
            } else {
                //其餘瀏覽器支援onload
                script.onload = function () {
                    if (error !== undefined) {
                        error();
                    }
                };
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        } catch (e) {
            if (null !== error) {
                alert(e);
                if (error !== undefined) {
                    error();
                }
            }
        }
    };

    public addMtScript(urlArray: any[], success: () => void, error: (message: string) => void, option?: {
        key: string,
        value: string
    }[]) {
        Glitter.glitter.share.scriptMemory = Glitter.glitter.share.scriptMemory ?? []
        const glitter = this;
        let index = 0

        function addScript() {
            if (index === urlArray.length) {
                success()
                return
            }
            let scritem: any = urlArray[index]
            if (typeof scritem === 'string') {
                scritem = new URL(scritem, glitter.root_path).href
            } else {
                scritem.src = new URL(scritem.src, glitter.root_path).href
            }

            if (Glitter.glitter.share.scriptMemory.indexOf((scritem.src ?? scritem)) !== -1) {
                index++
                addScript()
                return;
            } else {
                Glitter.glitter.share.scriptMemory.push((scritem.src ?? scritem));
            }
            let script: any = document.createElement('script');
            try {
                if ((option ?? []).find((dd) => {
                    return dd.key === 'async'
                })) {
                    index++
                    addScript()
                } else {
                    if (script.readyState) {  //IE
                        script.onreadystatechange = () => {
                            if (script.readyState === "loaded" || script.readyState === "complete") {
                                script.onreadystatechange = null;
                                index++
                                addScript()
                            } else {
                                alert(script.readyState)
                            }
                        }
                    } else {
                        //其餘瀏覽器支援onload
                        script.onload = () => {
                            index++
                            addScript()
                        }
                    }
                }
                (option ?? []).map((dd) => {
                    script.setAttribute(dd.key, dd.value)
                })
                script.addEventListener('error', () => {
                    error("")
                });
                if (scritem.type === 'text/babel') {
                    glitter.$('body').append(`<script type="text/babel" src="${scritem.src}"></script>`)
                } else if (scritem.type !== undefined) {
                    script.setAttribute('type', scritem.type);
                    script.setAttribute('src', scritem.src ?? undefined);
                    script.setAttribute('crossorigin', true);
                    scritem.id && (script.setAttribute('id', scritem.id ?? undefined));


                    document.getElementsByTagName("head")[0].appendChild(script);
                } else {
                    script.setAttribute('src', scritem.src ?? scritem);
                    scritem.id && (script.setAttribute('id', scritem.id ?? undefined));
                    script.setAttribute('crossorigin', true)
                    document.getElementsByTagName("head")[0].appendChild(script);
                }

            } catch (e) {
                error(`Add ${urlArray[index]} ERROR!!`);
            }
        }

        addScript()
    };

    public addCSS(fileName: string) {
        var head = document.head;
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = fileName;
        head.appendChild(link);
    };

    public onBackPressed() {
        this.goBack()
    };

    public closeApp() {
        const glitter = this;
        glitter.runJsInterFace("closeAPP", {}, function (response: any) {
        })
    }

    public generateCheckSum(str: string, count?: number) {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash = hash & hash; // 轉換為32位整數
        }

        // 將hash轉換為正整數
        hash = Math.abs(hash);

        // 將hash轉換為6碼字串
        let checksum = hash.toString().slice(0, (count ?? 6));

        // 如果不足6碼，則補零
        while (checksum.length < (count ?? 6)) {
            checksum = '0' + checksum;
        }

        return checksum;
    }

    public getUrlParameter(sParam: string): any {
        function next(): any {
            let sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        }

        if (sParam === 'page') {
            this.page = this.page || next()
            this.setUrlParameter('page', undefined)
            return this.page
        } else {
            return next()
        }

    }

    public openNewTab(link: string) {
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
                })
                break;
        }
    }

    public print(fun: () => any, tryReturn?: () => any): any {
        if (tryReturn !== undefined) {
            try {
                return fun()
            } catch (e) {
                return tryReturn
            }
        } else {
            return fun()
        }
    }

    public isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || ((navigator as any).msMaxTouchPoints > 0);
    }

    public getUUID(format?: string): string {
        let d = Date.now();

        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }

        return (format ?? 'xxxxxxxx').replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return "s" + (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
    }

    public addStyle(style: string, id?: string) {
        const glitter = (window as any).glitter;
        glitter.share.style_memory = glitter.share.style_memory ?? {};
        const checkSum = glitter.generateCheckSum(style)
        if (glitter.share.style_memory[checkSum]) {
            return
        }
        glitter.share.style_memory[checkSum] = true
        glitter.share.wait_add_style_string = glitter.share.wait_add_style_string ?? style;
        glitter.share.wait_add_style_string += style
        // clearInterval(glitter.share.wait_add_style)
        const css = document.createElement('style');
        css.id = id || glitter.getUUID()
        css.type = 'text/css';
        if ((css as any).styleSheet)
            (css as any).styleSheet.cssText = glitter.share.wait_add_style_string;
        else
            css.appendChild(document.createTextNode(glitter.share.wait_add_style_string));
        glitter.share.wait_add_style_string = ''
        document.head.appendChild(css);

        // setTimeout(()=>{
        //     document.querySelector('#style_base')!.innerHTML+=`\n${style}`
        // })

        /* Append style to the tag name */

    }

    public async addStyleLink(data: string | string[], doc?: any) {
        const document = doc ?? (window.document)
        const glitter = this;
        const head = document.head || document;

        async function add(filePath: string) {
            filePath = new URL(filePath, glitter.root_path).href
            return new Promise((resolve, reject) => {
                const id = glitter.getUUID()
                // 获取所有<a>标签
                let allLinks: any = document.querySelectorAll("link");
                let pass = true
                // 遍历所有<a>标签并输出其href属性值
                for (let i = 0; i < allLinks.length; i++) {
                    const hrefValue = allLinks[i].getAttribute("href");
                    if (hrefValue === filePath) {
                        pass = false
                        break
                    }
                }
                if (pass) {
                    let link = (window.document).createElement("link");
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    link.href = filePath;
                    link.id = id;
                    link.onload = function () {
                        resolve(true); // 样式表加载完毕
                    };
                    link.onerror = function () {
                        resolve(false)
                    }
                    glitter.parameter.styleLinks.push({
                        id: id,
                        src: filePath
                    })
                    head.appendChild(link);
                } else {
                    resolve(true)
                }
            })
        }

        if (typeof data == "string") {
            await add(data)
        } else {
            for (const d3 of data) {
                await add(d3)
            }
        }
    }

    /*util*/
    public ut = {
        glitter: this,
        queue: {},
        resize_img_url: (link: string) => {
            let rela_link = link;
            [150, 600, 1200, 1440].reverse().map((dd) => {
                if (document.body.clientWidth < dd) {
                    rela_link = link.replace('size1440_s*px$_', `size${dd}_s*px$_`)
                }
            })
            return rela_link
        },
        clock() {
            return {
                start: new Date(),
                stop: function () {
                    return ((new Date()).getTime() - (this.start).getTime())
                },
                zeroing: function () {
                    this.start = new Date()
                }
            }
        },
        setQueue: (tag: string, fun: any, callback: any) => {
            const queue: any = this.ut.queue;
            queue[tag] = queue[tag] ?? {
                callback: [],
                data: undefined,
                isRunning: false
            }
            if (queue[tag].data) {
                callback && callback((() => {
                    try {
                        return JSON.parse(JSON.stringify(queue[tag].data))
                    } catch (e) {
                        console.log(`parseError`, queue[tag].data)
                    }
                })())
            } else {
                queue[tag].callback.push(callback)
                if (!queue[tag].isRunning) {
                    queue[tag].isRunning = true
                    fun((response: any) => {
                        queue[tag].callback.map((callback: any) => {
                            callback && callback((() => {
                                try {
                                    return JSON.parse(JSON.stringify(response))
                                } catch (e) {
                                    console.log(`parseError`, queue[tag].data)
                                }
                            })())
                        })
                        queue[tag].data = response
                        queue[tag].callback = []
                    })
                }
            }

        },
        dateFormat(date: Date, fmt: string): string {
            const o: any = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小時
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        copyText(text: string) {
            if (!document.getElementById("imageSelect")) {
                this.glitter.$('body').append(`<input type="text"   style="display: none" id="copyText" multiple>`);
            }
            this.glitter.$('#copyText').val(text)
            this.glitter.$('#copyText').show()
            this.glitter.$('#copyText').select()
            document.execCommand("Copy");
            this.glitter.$('#copyText').hide()
        },
        toJson(data: any, defaultData: any) {
            const glitter = this.glitter;
            if (data === undefined) {
                return defaultData
            } else if (typeof data !== 'string') {
                return data
            }
            try {
                var dd = JSON.parse(data.replace(/\n/g, "\\n").replace(/\t/g, "\\t"))
                if ((typeof dd) !== (typeof defaultData)) {
                    return defaultData
                } else {
                    return dd ?? defaultData
                }
            } catch (e) {
                glitter.deBugMessage(e)
                return defaultData
            }
        },
        tryMethod(method: (() => void)[]) {
            method.map((dd) => {
                try {
                    dd()
                } catch (e) {
                    console.log(e)
                }
            })
        },
        downloadFile(href: string) {
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'image.jpg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        frSize(sizeMap: any, def: any) {
            let returnSize = def;
            var wi = $('html').width() as number
            var lastIndex = 0
            Object.keys(sizeMap).map((dd) => {
                let index: any = {sm: 576, me: 768, lg: 992, xl: 1200, xxl: 1400}
                let sizeCompare = (index[dd] ?? parseInt(dd, 10))
                if (wi >= sizeCompare && sizeCompare > lastIndex) {
                    returnSize = sizeMap[dd]
                    lastIndex = sizeCompare
                }
            })
            return returnSize
        },
        chooseMediaCallback(option: {
            single?: boolean,
            accept: string,
            callback(data: { data: any, file: any, type: string, name: string, extension: string }[]): void
        }) {
            const $ = this.glitter.$
            $('#imageSelect').remove()
            if (!document.getElementById("imageSelect")) {
                $('body').append(`<input type="file" accept="${option.accept}"  style="display: none" id="imageSelect" ${(option.single) ? `` : `multiple`}>`);
                $('#imageSelect').change(function (e: any) {
                    let files = $('#imageSelect').get(0).files;
                    let imageMap: any[] = [];
                    for (let a = 0; a < files.length; a++) {
                        let reader = new FileReader();
                        reader.readAsDataURL(files[a]);
                        reader.onload = function getFileInfo(evt: any) {
                            imageMap = imageMap.concat({
                                file: files[a],
                                data: evt.target.result,
                                type: option.accept,
                                name: files[a].name,
                                extension: files[a].name.split('.').pop()
                            });
                            if (imageMap.length === files.length) {
                                option.callback(imageMap)
                            }
                        };
                    }
                });
            }
            $('#imageSelect').val(undefined);
            $('#imageSelect').click();
        }
    }
    public utText = {
        filterNumber(number: string) {
            return number.replace(/[^0-9]/ig, "");
        },
        removeTag(str: string): string {
            try {
                return str.replace(/<[^>]+>/g, ""); //去掉所有的html標記
            } catch (e) {
                return str
            }
        },
        addTextChangeListener(e: any, callback: (e: any) => void) {
            e.bind('input porpertychange', function () {
                callback(e);
            });
        },
        urlify(text: string, open?: ((e: string) => string)): string {
            return text.replace(/(https?:\/\/[^\s]+)/g, function (url) {
                if (open) {
                    return open(url)
                } else {
                    return `<a style="color: dodgerblue;cursor:pointer;border-bottom: 1px solid dodgerblue;"  onclick="glitter.openNewTab('${url}')">${url}</a>`;
                }
            }).replace(/(http?:\/\/[^\s]+)/g, function (url) {
                if (open) {
                    return open(url)
                } else {
                    return `<a style="color: dodgerblue;cursor:pointer;border-bottom: 1px solid dodgerblue;"  onclick="glitter.openNewTab('${url}')">${url}</a>`;
                }
            })
        },
        isEmpty(data: any): boolean {
            return ((data === '') || (data === undefined))
        },
        emptyToDefault(data: any, defaultData: any): any {
            if (((data === '') || (data === undefined))) {
                return defaultData;
            } else {
                return data;
            }
        },
    }
    public utRandom = {
        getRandom(items: any) {
            return items[Math.floor(Math.random() * items.length)];
        },
        getRandomInt(min: number, max: number) {
            return (min + Math.floor(Math.random() * (max - min)))
        }
    }
    /*scroll*/
    public scroll = {
        glitter: this,
        addScrollListener(e: any, obj: any) {
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
        isScrollBtn(e: any): boolean {
            var map = {
                scrollTop: e[0].scrollTop,
                scrollHeight: e[0].scrollHeight,
                windowHeight: e.height()
            };
            return map.scrollTop + map.windowHeight >= map.scrollHeight - 1;
        },
        isScrollTp(e: any): boolean {
            var map = {
                scrollTop: e[0].scrollTop,
                scrollHeight: e[0].scrollHeight,
                windowHeight: e.height()
            };
            return map.scrollTop === 0;
        },
        scrollToBtn(e: any) {
            var map = {
                scrollTop: e[0].scrollTop,
                scrollHeight: e[0].scrollHeight,
                windowHeight: e.height()
            };
            e.scrollTop(map.scrollHeight - map.windowHeight);
        },
        scrollToFixed(scrollContainer: any, rowTop: any, y: number) {
            var toggle = false
            scrollContainer.scroll(function () {
                function open() {
                    rowTop.addClass('position-fixed')
                    rowTop.css('width', rowTop.parent().width())
                    rowTop.parent().css('padding-top', `${rowTop.height()}px`)
                    rowTop.css('top', y + 'px')
                }

                function close() {
                    rowTop.removeClass('position-fixed')
                    rowTop.css('width', '100%')
                    rowTop.parent().css('padding-top', '0px')
                }

                var cut = (rowTop.parent().offset().top - scrollContainer.scrollTop())
                // glitter.deBugMessage(cut)
                if (cut < y && (!toggle)) {
                    open()
                    toggle = true
                } else if (cut > y && (toggle)) {
                    close()
                    toggle = false
                }
            })
        }
    }

    public setCookie(key: string, value: any) {
        localStorage.setItem(key, value)
    }

    public removeCookie(keyList?: string[]) {
        if (Array.isArray(keyList)) {
            keyList.map((k) => (localStorage.removeItem(k)));
        } else if (keyList === undefined) {
            localStorage.clear()
        }
    }

    /*window*/
    public windowUtil = {
        es: undefined,
        glitter: this,
        get e(): any {
            return this.es as any
        },
        get nowWindowHeight(): number {
            return this.e.innerHeight;
        },
        windowHeightChangeListener: [],
        addWindowHeightChangeListener(callback: (e: any) => void) {
            (this.windowHeightChangeListener as any).push(callback)
        },
        getBrowserFrom(): string {
            var sUserAgent: any = navigator.userAgent.toLowerCase();
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
                    return "ios"
                } else if (bIsAndroid) {
                    return "android"
                } else {
                    return "phone"
                }

            } else {
                return "pc"
            }
        },
        getBrowserDeviceType(): string {
            const glitter = this;
            const a = navigator.userAgent;
            const isAndroid = a.indexOf('Android') > -1 || a.indexOf('Adr') > -1; //android终端

            const isiOS = !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                return "android";
            }
            if (isiOS) {
                if (glitter.getBrowserFrom() === "pc") {
                    return "mac";
                } else {
                    return "iphone";
                }
            }
            return "desktop";
        },
        reload() {
            this.e.reload()
        }
    }
    public renderView = {
        replaceGlobalValue: function (inputString: string) {
            const glitter: any = Glitter.glitter;
            if ((glitter.share.EditorMode === true)) {
                return inputString
            }
            let convert = inputString

            function replaceString(pattern: any) {
                let match;
                while ((match = pattern.exec(convert)) !== null) {
                    const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
                    const value = match[1]; // 提取的值，例如 "value"
                    if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                        convert = convert.replace(placeholder, glitter.share.globalValue[value])
                    }
                }
            }

            replaceString(/\/\**@{{(.*?)}}\*\//g)
            replaceString(/@{{(.*?)}}/g)
            return convert
        },
        replacePromiseValue: function (inputString: string) {
            const glitter: any = Glitter.glitter;
            return new Promise(async (resolve, reject) => {
                const pattern = /@PROMISE{{(.*?)}}/g;
                // 使用正则表达式的 exec 方法来提取匹配项
                let match;
                let convert = inputString
                while ((match = pattern.exec(inputString)) !== null) {
                    const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
                    const value = match[1]; // 提取的值，例如 "value"
                    inputString = inputString.replace(placeholder, await glitter.promiseValueMap[value])
                }
                resolve(inputString)
            })
        },
        replaceAttributeValue: function (dd: any, element: Element) {
            try {
                dd = JSON.parse(JSON.stringify(dd))
                if (dd.value && (typeof dd.value !== 'string')) {
                    dd.value = `${dd.value}`
                }
                if (!element) {
                    return
                }
                const glitter: any = Glitter.glitter;
                (element as any).replaceAtMemory = (element as any).replaceAtMemory ?? {}
                if (dd.value && ((dd.value.includes('clickMap') || dd.value.includes('editorEvent')) && (dd.key.substring(0, 2) === 'on'))) {
                    try {
                        const funString = `${dd.value}`;
                        if (!((element as any).replaceAtMemory[dd.key])) {
                            element.addEventListener(dd.key.substring(2), function () {
                                if ((glitter.htmlGenerate.isEditMode() || glitter.htmlGenerate.isIdeaMode()) && !glitter.share.EditorMode && (['htmlEditor', 'find_idea'].includes(glitter.getUrlParameter('type')))) {
                                    if (funString.indexOf('editorEvent') !== -1) {
                                        eval(funString.replace('editorEvent', 'clickMap'))
                                    } else if (dd.key !== 'onclick') {
                                        eval(funString)
                                    }
                                } else {
                                    eval(funString)
                                }
                            })
                        }
                        element.removeAttribute(dd.key);
                        (element as any).replaceAtMemory[dd.key] = true
                    } catch (e) {
                        console.log(e)
                        glitter.deBugMessage(e)
                    }
                } else {
                    try {
                        if (dd.value) {
                            element.setAttribute(dd.key, dd.value)
                        }
                    } catch (e) {
                    }
                }
                if (dd.key && dd.key.includes('@PROMISE')) {

                    glitter.renderView.replacePromiseValue(dd.key).then((data: string) => {
                        element.setAttribute(data, dd.value)
                        console.log(`setPromise->${data} to ${dd.value}`)
                    })
                }
                if (dd.value && dd.value.includes('@PROMISE')) {
                    glitter.renderView.replacePromiseValue(dd.value).then((data: string) => {
                        element.setAttribute(dd.key, data)
                    })
                }

                // if (!(glitter.share.EditorMode === true)) {
                //     const inputString = dd.value;
                //     // 正则表达式模式
                //     const pattern = /@{{(.*?)}}/g;
                //     // 使用正则表达式的 exec 方法来提取匹配项
                //     let match;
                //     while ((match = pattern.exec(inputString)) !== null) {
                //         const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
                //         const value = match[1]; // 提取的值，例如 "value"
                //         if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                //             console.log(`match->`,value)
                //
                //             dd.value = dd.value.replace(placeholder, glitter.share.globalValue[value])
                //             console.log(`natch->in_.`,dd.value )
                //         }
                //     }
                // }
            } catch (e) {
                console.log(e)
            }


        }
    }

    public setModule(key: string, value: any) {
        this.share.glitterModule = this.share.glitterModule ?? {}
        this.share.glitterModule[key] = value
    }

    public getModule(js: string, callback: (module: any) => void) {
        const glitter = this;
        glitter.share.glitterModule = glitter.share.glitterModule ?? {}
        glitter.share.glitterModuleCallback = glitter.share.glitterModuleCallback ?? {}
        if (glitter.share.glitterModule[js]) {
            callback(glitter.share.glitterModule[js])
        } else {
            glitter.share.glitterModuleCallback[js] = glitter.share.glitterModuleCallback[js] ?? []
            glitter.share.glitterModuleCallback[js].push(callback)
            Object.defineProperty(glitter.share.glitterModule, js, {
                // getter 函数返回属性的值
                get() {
                    return glitter.share.glitterModule['init_' + js];
                },
                // setter 函数设置属性的值，并触发监听事件
                set(newValue) {
                    glitter.share.glitterModule['init_' + js] = newValue
                    glitter.share.glitterModuleCallback[js].map((callback: any) => {
                        callback && callback(newValue)
                    })
                    glitter.share.glitterModuleCallback[js] = []
                },
                // 可选：指定属性是否可枚举
                enumerable: true,
                // 可选：指定属性是否可配置
                configurable: true
            })
            glitter.addMtScript(
                [{
                    type: 'module',
                    src: new URL(js, this.root_path).href
                }],
                () => {
                },
                () => {
                },
                [
                    {key: "async", value: "true"}
                ]
            );
        }
    }

    /********/
    constructor(window: any) {
        this.$ = window.$
        this.location = window.location;
        this.windowUtil.es = window;
        this.window = window;
        this.document = window.document
        Glitter.glitter = this
        Glitter.glitter.share.htmlExtension = Glitter.glitter.share.htmlExtension ?? {}
    }
}
