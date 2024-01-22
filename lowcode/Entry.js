'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from "./api/user.js";
import { config } from "./config.js";
import { ApiPageConfig } from "./api/pageConfig.js";
import { BaseApi } from "./glitterBundle/api/base.js";
import { GlobalUser } from "./glitter-base/global/global-user.js";
export class Entry {
    static onCreate(glitter) {
        var _a;
        if (glitter.getUrlParameter('appName')) {
            window.appName = glitter.getUrlParameter('appName');
            config.appName = glitter.getUrlParameter('appName');
        }
        glitter.addStyle(glitter.html `@media (prefers-reduced-motion: no-preference) {
    :root {
        scroll-behavior: auto !important;
    }
}`);
        window.renderClock = (_a = window.renderClock) !== null && _a !== void 0 ? _a : clockF();
        console.log(`Entry-time:`, window.renderClock.stop());
        glitter.share.editerVersion = "V_4.5.5";
        glitter.share.start = new Date();
        glitter.debugMode = false;
        const vm = {
            appConfig: []
        };
        window.saasConfig = {
            config: window.config = config,
            api: ApiPageConfig,
            appConfig: undefined
        };
        window.glitterInitialHelper.getPlugin((dd) => {
            var _a, _b;
            console.log(`getPlugin-time:`, window.renderClock.stop());
            GlobalUser.language = GlobalUser.language || navigator.language;
            vm.appConfig = dd.response.data;
            glitter.share.appConfigresponse = dd;
            glitter.share.globalValue = {};
            glitter.share.globalStyle = {};
            glitter.share.appConfigresponse.response.data.globalValue = (_a = glitter.share.appConfigresponse.response.data.globalValue) !== null && _a !== void 0 ? _a : [];
            glitter.share.appConfigresponse.response.data.globalStyleTag = (_b = glitter.share.appConfigresponse.response.data.globalStyleTag) !== null && _b !== void 0 ? _b : [];
            function loopCheckGlobalValue(array, tag) {
                try {
                    array.map((dd) => {
                        if (dd.type === 'container') {
                            loopCheckGlobalValue(dd.data.setting, tag);
                        }
                        else {
                            if (dd.data.tagType === 'language') {
                                if (dd.data.value.length > 0) {
                                    glitter.share[tag][dd.data.tag] = (dd.data.value.find((dd) => {
                                        return dd.lan.toLowerCase().indexOf(GlobalUser.language.toLowerCase()) !== -1;
                                    }) || dd.data.value[0]).text;
                                }
                            }
                            else {
                                glitter.share[tag][dd.data.tag] = dd.data.value;
                            }
                        }
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
            ;
            if (glitter.getUrlParameter("type") === 'htmlEditor') {
                loopCheckGlobalValue(window.parent.glitter.share.editorViewModel.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue(window.parent.glitter.share.editorViewModel.globalValue, 'globalValue');
            }
            else {
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalValue, 'globalValue');
            }
            console.log(glitter.share.appConfigresponse.response.data.globalStyleTag);
            window.saasConfig.appConfig = dd.response.data;
            (() => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var _c, _d, _e;
                    if (glitter.getUrlParameter("type") !== 'editor') {
                        for (const data of ((_c = dd.response.data.initialStyleSheet) !== null && _c !== void 0 ? _c : [])) {
                            try {
                                if (data.type === 'script') {
                                    glitter.addStyleLink(data.src.link);
                                }
                                else {
                                    glitter.addStyle(data.src.official);
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    }
                    let countI = dd.response.data.initialList.length;
                    const vm = {
                        get count() {
                            return countI;
                        },
                        set count(v) {
                            countI = v;
                            if (countI === 0) {
                                resolve(true);
                            }
                        }
                    };
                    for (const data of ((_d = dd.response.data.initialList) !== null && _d !== void 0 ? _d : [])) {
                        try {
                            if (data.type === 'script') {
                                const url = new URL(glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(data.src.link)));
                                glitter.share.callBackList = (_e = glitter.share.callBackList) !== null && _e !== void 0 ? _e : {};
                                const callbackID = glitter.getUUID();
                                url.searchParams.set('callback', callbackID);
                                glitter.share.callBackList[callbackID] = (() => {
                                    vm.count--;
                                });
                                glitter.addMtScript([{
                                        src: url.href, type: 'module'
                                    }], () => {
                                    vm.count--;
                                }, () => {
                                    vm.count--;
                                });
                            }
                            else {
                                const dd = yield eval(data.src.official);
                                vm.count--;
                            }
                        }
                        catch (e) {
                            console.log(e);
                            vm.count--;
                        }
                    }
                    if (countI === 0) {
                        resolve(true);
                    }
                }));
            }))().then(() => {
                var _a;
                if (glitter.getUrlParameter("type") === 'editor') {
                    glitter.share.EditorMode = true;
                    glitter.share.evalPlace = ((evals) => {
                        return eval(evals);
                    });
                    toBackendEditor(glitter);
                }
                else if (glitter.getUrlParameter("type") === 'htmlEditor') {
                    window.parent.glitter.share.editerGlitter = glitter;
                    let timer = 0;
                    var bodyElement = document.body;
                    var observer = new ResizeObserver(function (entries, observer) {
                        function scrollToItem(element) {
                            if (element) {
                                element.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                });
                            }
                        }
                        clearInterval(timer);
                        timer = setTimeout(() => {
                            scrollToItem(document.querySelector('.selectComponentHover'));
                        }, 100);
                    });
                    observer.observe(bodyElement);
                    window.parent.glitter.share.evalPlace = ((evals) => {
                        return eval(evals);
                    });
                    glitter.addMtScript(window.parent.editerData.setting.map((dd) => {
                        return {
                            src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                            type: 'module'
                        };
                    }), () => {
                    }, () => {
                    }, [
                        { key: "async", value: "true" }
                    ]);
                    glitter.htmlGenerate.loadScript(glitter, window.parent.editerData.setting.filter((dd) => {
                        return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
                    }).map((dd) => {
                        return {
                            src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                            type: 'module'
                        };
                    }));
                    glitter.share.evalPlace = ((evals) => {
                        return eval(evals);
                    });
                    glitter.htmlGenerate.setHome({
                        app_config: vm.appConfig,
                        page_config: (_a = window.parent.page_config) !== null && _a !== void 0 ? _a : {},
                        config: window.parent.editerData.setting,
                        editMode: window.parent.editerData,
                        data: {},
                        tag: window.parent.glitter.getUrlParameter('page')
                    });
                }
                else {
                    if (glitter.getUrlParameter('token') && glitter.getUrlParameter('return_type') === 'resetPassword') {
                        GlobalUser.token = glitter.getUrlParameter('token');
                        glitter.setUrlParameter('token');
                        glitter.setUrlParameter('return_type');
                    }
                    glitter.share.evalPlace = ((evals) => {
                        return eval(evals);
                    });
                    console.log(`exePlugin-time:`, window.renderClock.stop());
                    window.glitterInitialHelper.getPageData(glitter.getUrlParameter('page'), (data) => {
                        console.log(`getPageData-time:`, window.renderClock.stop());
                        if (data.response.result.length === 0) {
                            const url = new URL("./", location.href);
                            url.searchParams.set('page', data.response.redirect);
                            if (glitter.getUrlParameter('appName')) {
                                url.searchParams.set('appName', glitter.getUrlParameter('appName'));
                            }
                            location.href = url.href;
                            return;
                        }
                        glitter.htmlGenerate.loadScript(glitter, data.response.result[0].config.filter((dd) => {
                            return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
                        }).map((dd) => {
                            return {
                                src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                                callback: () => {
                                }
                            };
                        }));
                        function authPass() {
                            glitter.htmlGenerate.setHome({
                                app_config: vm.appConfig,
                                page_config: data.response.result[0].page_config,
                                config: data.response.result[0].config,
                                data: {},
                                tag: glitter.getUrlParameter('page')
                            });
                        }
                        function authError(message) {
                            glitter.addStyleLink([
                                'assets/vendor/boxicons/css/boxicons.min.css',
                                'assets/css/theme.css',
                                'css/editor.css',
                            ]);
                            glitter.setHome('jspage/alert.js', glitter.getUrlParameter('page'), message, {
                                backGroundColor: `transparent;`
                            });
                        }
                        const glitterAuth = window.glitterAuth;
                        if ((window.appName !== window.glitterBase) && (glitterAuth)) {
                            if (glitterAuth.overdue) {
                                authError('使用權限已過期，請前往後台執行續費。');
                            }
                            else {
                                glitterAuth.memberType = glitterAuth.memberType || 'free';
                                const memberCheck = {
                                    vip: 10,
                                    basic: 2,
                                    company: 4,
                                    free: 1,
                                    noLimit: Infinity
                                };
                                if (memberCheck[glitterAuth.memberType] < glitterAuth.appCount) {
                                    authError(`當前可建立應用數量為${memberCheck[glitterAuth.memberType]}個，請前往後台升級方案，或者刪除不要使用的應用。`);
                                }
                                else {
                                    authPass();
                                }
                            }
                        }
                        else {
                            authPass();
                        }
                    });
                }
            });
        });
    }
}
function toBackendEditor(glitter) {
    function running() {
        return __awaiter(this, void 0, void 0, function* () {
            config.token = GlobalUser.token;
            glitter.addStyleLink([
                'assets/vendor/boxicons/css/boxicons.min.css',
                'assets/css/theme.css',
                'css/editor.css',
            ]);
            yield new Promise((resolve, reject) => {
                glitter.addMtScript([
                    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
                    'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
                    'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                    'assets/vendor/swiper/swiper-bundle.min.js',
                    'assets/js/theme.min.js',
                    'https://kit.fontawesome.com/cccedec0f8.js'
                ], () => {
                    resolve(true);
                }, () => {
                    resolve(true);
                });
            });
            return;
        });
    }
    window.mode = 'light';
    window.root = document.getElementsByTagName('html')[0];
    window.root.classList.add('light-mode');
    function toNext() {
        running().then(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            {
                let data = yield ApiPageConfig.getPage(config.appName, (_a = glitter.getUrlParameter('page')) !== null && _a !== void 0 ? _a : glitter.getUUID());
                if (data.response.result.length === 0) {
                    glitter.setUrlParameter('page', data.response.redirect);
                }
                glitter.ut.frSize({
                    sm: () => {
                        glitter.setHome('jspage/main.js', glitter.getUrlParameter('page'), {
                            appName: config.appName
                        }, {
                            backGroundColor: `transparent;`
                        });
                    }
                }, () => {
                    glitter.setHome('jspage/nosupport.js', glitter.getUrlParameter('page'), {
                        appName: config.appName
                    }, {
                        backGroundColor: `transparent;`
                    });
                })();
            }
        }));
    }
    if (glitter.getUrlParameter('account')) {
        ApiUser.login({
            "account": glitter.getUrlParameter('account'),
            "pwd": glitter.getUrlParameter('pwd')
        }).then((re) => {
            if (re.result) {
                GlobalUser.token = re.response.userData.token;
                toNext();
            }
            else {
                const url = new URL(glitter.location.href);
                location.href = `${url.origin}/glitter/?page=signin`;
            }
        });
    }
    else {
        if (!GlobalUser.token) {
            const url = new URL(glitter.location.href);
            location.href = `${url.origin}/glitter/?page=signin`;
        }
        else {
            BaseApi.create({
                "url": config.url + `/api/v1/user/checkToken`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": GlobalUser.token
                }
            }).then((d2) => {
                if (!d2.result) {
                    const url = new URL(glitter.location.href);
                    location.href = `${url.origin}/glitter/?page=signin`;
                }
                else {
                    toNext();
                }
            });
        }
    }
}
let clockF = () => {
    return {
        start: new Date(),
        stop: function () {
            return ((new Date()).getTime() - (this.start).getTime());
        },
        zeroing: function () {
            this.start = new Date();
        }
    };
};
