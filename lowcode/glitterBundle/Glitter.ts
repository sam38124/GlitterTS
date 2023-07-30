"use strict";
import {Animation, AnimationConfig} from "./module/Animation.js";
import {PageConfig, GVCType, PageManager, DefaultSetting} from "./module/PageManager.js";
import {AppearType} from "./module/Enum.js"
import {HtmlGenerate} from "./module/Html_generate.js"


export class Glitter {
    public static glitter: Glitter
    /*ENUM*/
    public gvcType = GVCType
    public deviceTypeEnum = AppearType;
    public animation = Animation;
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
    public $: any;
    public document: any;
    public webUrl: string = '';
    public goBackStack: (() => void)[] = [];
    public parameter: any = {styleList: [], styleLinks: []}
    public callBackId: number = 0;
    public callBackList = new Map();
    public location: any;
    public debugMode = false
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
    public elementCallback: {[name:string]:{onCreate:()=>void,onInitial:()=>void,notifyDataChange:()=>void,getView:()=>string,updateAttribute:()=>void}} = {}

    /*Getter*/
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
        var value = this.parseCookie()[name];
        if (value) {
            value = decodeURIComponent(value);
        }
        return value;
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

    public getPro(tag: string, callBack: (data: {}) => void, option: { defineType?: any, webFunction: (data: any, callback: (data: any) => void) => any }
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

    public runJsInterFace(functionName: string, data: {}, callBack: (data: any) => void, option: { defineType?: any, webFunction?(data: any, callback: (data: any) => void): any } = {}) {
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
                } else {
                    glitter.$.ajax({
                        type: "POST",
                        url: glitter.webUrl + "/RunJsInterFace",
                        data: JSON.stringify(map),
                        timeout: 60 * 1000,
                        success: function (data: any) {
                            callBack(JSON.parse(data));
                        },
                        error: function (data: any) {
                            callBack(data);
                        }
                    });
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

    public deBugMessage(text: any) {
        if (this.debugMode) {
            console.log(text + ` : ${this.ut.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")}`)
        }
    }

    public setUrlParameter(tag: string, value?: string) {

        var search = (value!==undefined) ? this.setSearchParam(this.removeSearchParam(window.location.search, tag), tag, value):
            this.removeSearchParam(window.location.search, tag)
        try {
            window.history.pushState({}, document.title, search);
        } catch (e) {
        }
    }

    public setDrawer(src: string, callback: () => void) {
        const gliter = this;
        this.$("#Navigation").html(src);
        if ((window as any).drawer === undefined) {
            gliter.addMtScript(['glitterBundle/plugins/NaviGation.js'], () => {
                callback()
            }, () => {
            })
        } else {
            callback()
        }
    };

    public openDrawer() {
        if ((window as any).drawer !== undefined) {
            (window as any).drawer.open();
        } else {
            var timer = setInterval(function () {
                if ((window as any).drawer !== undefined) {
                    (window as any).drawer.open();
                    clearInterval(timer);
                }
            }, 100);
        }
    }; //關閉側滑選單

    public closeDrawer() {
        try{ (window as any).drawer.close();}catch(e){}

    }; //開關側滑選單


    public toggleDrawer() {
        try{ (window as any).drawer.toggle();}catch(e){}
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

    public addMtScript(urlArray: any[], success: () => void, error: (message: string) => void, option?: {key:string,value:string}[]) {
        Glitter.glitter.share.scriptMemory = Glitter.glitter.share.scriptMemory ?? []
        const glitter = this;
        let index = 0

        function addScript() {
            if (index === urlArray.length) {
                success()
                return
            }
            var scritem: any = urlArray[index]
            if (Glitter.glitter.share.scriptMemory.indexOf((scritem.src ?? scritem)) !== -1) {
                index++
                addScript()
                return;
            } else {
                Glitter.glitter.share.scriptMemory.push((scritem.src ?? scritem));
            }
            let script: any = document.createElement('script');
            try {
                if((option ?? []).find((dd)=>{return dd.key==='async'})){
                    index++
                    addScript()
                }else{
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
                (option ?? []).map((dd)=>{
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
                    script.setAttribute('crossorigin', true)
                    script.setAttribute('id', scritem.id ?? undefined);

                    document.getElementsByTagName("head")[0].appendChild(script);
                } else {
                    script.setAttribute('src', scritem.src ?? scritem);
                    script.setAttribute('id', scritem.id ?? undefined);
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

    public getUrlParameter(sParam: string): any {
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

    public getUUID(): string {
        let d = Date.now();

        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return "s" + (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
    }

    public addStyle(style: string) {
        const glitter = this;
        let sl = {
            id: glitter.getUUID(),
            style: style
        }
        if (!glitter.parameter.styleList.find((dd: any) => {
            return dd.style === style
        })) {
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = sl.id
            if ((css as any).styleSheet)
                (css as any).styleSheet.cssText = style;
            else
                css.appendChild(document.createTextNode(style));
            /* Append style to the tag name */
            document.getElementsByTagName("head")[0].appendChild(css);
            glitter.parameter.styleList.push(sl)
        }
    }

    public async addStyleLink(data: string | string[]) {
        const glitter = this;
        var head = document.head;

        function add(filePath: string) {
            const id = glitter.getUUID()
            var haveURL = glitter.parameter.styleLinks.find((dd: any) => {
                return dd.src === filePath
            })
            if (!haveURL) {
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = filePath;
                link.id = id;
                glitter.parameter.styleLinks.push({
                    id: id,
                    src: filePath
                })
                head.appendChild(link);
            }
        }

        if (typeof data == "string") {
            add(data)
        } else {
            data.map((d3) => {
                add(d3)
            })
        }
    }

    /*util*/
    public ut = {
        glitter: this,
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
        downloadFile(href: string) {
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'image.jpg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        frSize(sizeMap: any, def: any) {
            var wi = $('html').width() as number
            var sm = (sizeMap.sm ?? def)
            var me = (sizeMap.me ?? sm)
            var lg = (sizeMap.lg ?? me)
            var xl = (sizeMap.xl ?? lg)
            var xxl = (sizeMap.xxl ?? xl)
            if (wi < 576) {
                return def
            } else if ((wi >= 576 && wi < 768)) {
                return sm
            } else if ((wi >= 768 && wi < 992)) {
                return me
            } else if ((wi >= 992 && wi < 1200)) {
                return lg
            } else if ((wi >= 1200 && wi < 1400)) {
                return xl
            } else if ((wi >= 1400)) {
                return xxl
            }
        },
        chooseMediaCallback(option: { single?: boolean, accept: string, callback(data: { data: any, file: any, type: string, name: string, extension: string }[]): void }) {
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
        let oneYear = 2592000 * 12;
        this.document.cookie = `${key}=${value}; max-age=${oneYear}; path=/`;
    }

    public removeCookie(keyList?: string[]) {
        if (Array.isArray(keyList)) {
            keyList.map((k) => (this.document.cookie = `${k}=''; max-age=-99999999; path=/`));
        } else if (keyList === undefined) {
            let list = this.document.cookie.split('; ');
            list.map((l: any) => (this.document.cookie = `${l.split('=')[0]}=''; max-age=-99999999; path=/`));
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

