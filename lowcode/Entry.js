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
        glitter.share.logID = glitter.getUUID();
        glitter.addStyle(`@media (prefers-reduced-motion: no-preference) {
          :root {
            scroll-behavior: auto !important;
          }
        }`);
        if (glitter.getUrlParameter('appName')) {
            window.appName = glitter.getUrlParameter('appName');
            config.appName = glitter.getUrlParameter('appName');
        }
        window.renderClock = (_a = window.renderClock) !== null && _a !== void 0 ? _a : clockF();
        console.log(`Entry-time:`, window.renderClock.stop());
        glitter.share.editerVersion = "V_6.2.7";
        glitter.share.start = (new Date());
        const vm = {
            appConfig: []
        };
        window.saasConfig = {
            config: window.config = config,
            api: ApiPageConfig,
            appConfig: undefined
        };
        config.token = GlobalUser.saas_token;
        Entry.resourceInitial(glitter, vm, (dd) => __awaiter(this, void 0, void 0, function* () {
            glitter.addStyle(`  /* 隐藏子元素 */
          .editorParent .editorChild {
            display: none;
          }
          .editorChild::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index:99999;
          }

          /* 当父元素悬停时显示子元素 */
         
          .editorParent:hover > .editorChild {
            display: block;
            border: 2px dashed  #FFB400 ;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          
          .editorItemActive{
            display: block !important;
            border: 2px solid #FFB400 !important;
            z-index:99999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            background: linear-gradient(143deg, rgba(255, 180, 0, 0.20) -22.7%, rgba(255, 108, 2, 0.20) 114.57%);
          }

          .editorItemActive > .badge_it{
            display:flex;
          }
          .badge_it{
            display:none;
          }
          .relativePosition{
            position: relative;
          }`);
            yield Entry.globalStyle(glitter, dd);
            if (glitter.getUrlParameter("type") === 'editor') {
                Entry.toBackendEditor(glitter, () => {
                });
            }
            else if (glitter.getUrlParameter("type") === 'htmlEditor') {
                Entry.toHtmlEditor(glitter, vm, () => {
                    Entry.checkIframe(glitter);
                });
            }
            else {
                Entry.toNormalRender(glitter, vm, () => {
                    Entry.checkIframe(glitter);
                });
            }
        }));
    }
    static checkIframe(glitter) {
        if (glitter.getUrlParameter('isIframe') === 'true') {
            console.log('checkIframe' + glitter.share.logID);
            glitter.goBack = window.parent.glitter.goBack;
            setInterval(() => {
                window.parent.glitter.share.iframeHeightChange[glitter.getUrlParameter('iframe_id')](document.body.scrollHeight);
                $(`body`).height(`${document.body.scrollHeight}px`);
            }, 100);
            glitter.addStyle(`html,body{
            overflow:hidden !important;
            }`);
        }
        else {
            glitter.addStyle(`html,body{
        height: 100vh !important;
    }`);
        }
    }
    static toBackendEditor(glitter, callback) {
        const css = String.raw;
        glitter.addStyle(css `@media (prefers-reduced-motion: no-preference) {
          :root {
            scroll-behavior: auto !important;
          }
        }

          ::-webkit-scrollbar {
            width: 0px !important; /* 滚动条宽度 */
            height: 0px !important;
          }
        `);
        glitter.share.EditorMode = true;
        glitter.share.evalPlace = ((evals) => {
            return eval(evals);
        });
        function running() {
            return __awaiter(this, void 0, void 0, function* () {
                glitter.addStyleLink([
                    'assets/vendor/boxicons/css/boxicons.min.css',
                    'assets/css/theme.css',
                    'css/editor.css'
                ]);
                yield new Promise((resolve, reject) => {
                    glitter.addMtScript([
                        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
                        'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                        'assets/vendor/swiper/swiper-bundle.min.js',
                        'assets/js/theme.min.js',
                        'https://kit.fontawesome.com/cccedec0f8.js',
                        'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
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
                {
                    let data = yield ApiPageConfig.getPage({
                        appName: config.appName,
                        tag: glitter.getUrlParameter('page')
                    });
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
    static toHtmlEditor(glitter, vm, callback) {
        var _a;
        const css = String.raw;
        glitter.addStyle(css `@media (prefers-reduced-motion: no-preference) {
          :root {
            scroll-behavior: auto !important;
          }
        }
        
        `);
        console.log('timer');
        window.parent.glitter.share.editerGlitter = glitter;
        const clock = glitter.ut.clock();
        function scrollToItem(element) {
            if (element) {
                element.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                });
            }
        }
        const interVal = setInterval(() => {
            if (document.querySelector('.editorItemActive')) {
                scrollToItem(document.querySelector('.editorItemActive'));
            }
            if (clock.stop() > 2000) {
                clearInterval(interVal);
            }
        });
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
        callback();
    }
    static toNormalRender(glitter, vm, callback) {
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
                callback();
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
            if ((window.memberType !== 'noLimit') && vm.appConfig.dead_line && (new Date(vm.appConfig.dead_line).getTime()) < new Date().getTime()) {
                authError('使用權限已過期，請前往後台執行續費。');
            }
            else {
                authPass();
            }
        });
    }
    static resourceInitial(glitter, vm, callback) {
        window.glitterInitialHelper.getPlugin((dd) => {
            var _a, _b;
            console.log(`getPlugin-time:`, window.renderClock.stop());
            window.saasConfig.appConfig = dd.response.data;
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
            callback(dd);
        });
    }
    static globalStyle(glitter, dd) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
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
            for (const data of ((_a = dd.response.data.initialList) !== null && _a !== void 0 ? _a : [])) {
                try {
                    if (data.type === 'script') {
                        const url = new URL(glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(data.src.link)));
                        glitter.share.callBackList = (_b = glitter.share.callBackList) !== null && _b !== void 0 ? _b : {};
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
