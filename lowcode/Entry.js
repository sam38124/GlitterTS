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
import { ApiUser } from './api/user.js';
import { config } from './config.js';
import { ApiPageConfig } from './api/pageConfig.js';
import { BaseApi } from './glitterBundle/api/base.js';
import { GlobalUser } from './glitter-base/global/global-user.js';
import { EditorConfig } from './editor-config.js';
export class Entry {
    static onCreate(glitter) {
        var _a;
        glitter.share.reload_code_hash = function () {
            const hashCode = window.preloadData.eval_code_hash || {};
            Object.keys(hashCode).map((dd, index) => {
                if (typeof hashCode[dd] === 'string') {
                    try {
                        hashCode[dd] = new Function(`return {
                        execute:(gvc,widget,object,subData,element,window,document,glitter,$)=>{
                         return (() => { ${hashCode[dd]} })()
                        }
                        }`)().execute;
                    }
                    catch (e) {
                    }
                }
            });
        };
        glitter.share.reload_code_hash();
        glitter.share.editor_util = {
            baseApi: BaseApi,
        };
        glitter.page = window.glitter_page;
        glitter.share.GlobalUser = GlobalUser;
        Entry.checkRedirectPage(glitter);
        glitter.share.logID = glitter.getUUID();
        glitter.addStyle(`
            @media (prefers-reduced-motion: no-preference) {
                :root {
                    scroll-behavior: auto !important;
                }
            }
        `);
        if (glitter.getUrlParameter('appName')) {
            window.appName = glitter.getUrlParameter('appName');
            config.appName = glitter.getUrlParameter('appName');
        }
        window.renderClock = (_a = window.renderClock) !== null && _a !== void 0 ? _a : clockF();
        console.log(`Entry-time:`, window.renderClock.stop());
        glitter.share.editerVersion = "V_11.0.9";
        glitter.share.start = (new Date());
        const vm = {
            appConfig: [],
        };
        window.saasConfig = {
            config: (window.config = config),
            api: ApiPageConfig,
            appConfig: undefined,
        };
        config.token = GlobalUser.saas_token;
        Entry.resourceInitial(glitter, vm, (dd) => __awaiter(this, void 0, void 0, function* () {
            glitter.addStyle(`
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
                    z-index: 99999;
                }

                .editorParent:hover > .editorChild {
                    display: block;
                    border: 2px dashed #ffb400;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    
                }

                .editorItemActive {
                    display: block !important;
                    border: 2px solid #ffb400 !important;
                    z-index: 99999;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                   
                }

                .editorItemActive > .badge_it {
                    display: flex;
                }

                .editorItemActive > .plus_btn {
                    display: none;
                }

                .editorParent:hover > .editorChild > .plus_btn {
                    display: block !important;
                }

                .badge_it {
                    display: none;
                }

                .relativePosition {
                    position: relative;
                }
                .sel_normal {
    cursor: pointer;
    border-radius: 7px;
    border: 1px solid #ddd;
    padding: 2px 14px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

            `);
            yield Entry.globalStyle(glitter, dd);
            if (glitter.getUrlParameter('type') === 'editor') {
                Entry.toBackendEditor(glitter, () => { });
            }
            else if (glitter.getUrlParameter('type') === 'htmlEditor') {
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
            console.log('checkIframe:' + glitter.share.logID);
            glitter.goBack = window.parent.glitter.goBack;
            setInterval(() => {
                window.parent.glitter.share.iframeHeightChange[glitter.getUrlParameter('iframe_id')](document.body.scrollHeight);
                $(`body`).height(`${document.body.scrollHeight}px`);
            }, 100);
            glitter.addStyle(`
                html,
                body {
                    overflow: hidden !important;
                }
            `);
        }
        else {
            glitter.addStyle(`
                html,
                body {
                    height: 100vh !important;
                }
            `);
        }
    }
    static toBackendEditor(glitter, callback) {
        if (!glitter.getUrlParameter('function')) {
            glitter.setUrlParameter('function', 'backend-manger');
        }
        glitter.addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
            @media (prefers-reduced-motion: no-preference) {
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
        glitter.share.evalPlace = (evals) => eval(evals);
        function running() {
            return __awaiter(this, void 0, void 0, function* () {
                glitter.addStyleLink(['assets/vendor/boxicons/css/boxicons.min.css', 'assets/css/theme.css', 'css/editor.css']);
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
                        tag: glitter.getUrlParameter('page'),
                    });
                    if (data.response.result.length === 0) {
                        glitter.setUrlParameter('page', data.response.redirect);
                    }
                    glitter.setHome('jspage/main.js', glitter.getUrlParameter('page'), {
                        appName: config.appName,
                    }, {
                        backGroundColor: `transparent;`,
                    });
                }
            }));
        }
        if (glitter.getUrlParameter('account')) {
            ApiUser.login({
                account: glitter.getUrlParameter('account'),
                pwd: glitter.getUrlParameter('pwd'),
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
            if (!GlobalUser.saas_token) {
                const url = new URL(glitter.location.href);
                location.href = `${url.origin}/glitter/?page=signin`;
            }
            else {
                BaseApi.create({
                    url: config.url + `/api/v1/user/checkToken`,
                    type: 'GET',
                    timeout: 0,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: GlobalUser.saas_token,
                    },
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
        window.preloadData.eval_code_hash = window.parent.preloadData.eval_code_hash;
        glitter.share.reload_code_hash();
        glitter.addMtScript([
            {
                src: 'https://kit.fontawesome.com/cccedec0f8.js',
            },
        ], () => { }, () => { });
        glitter.addStyle(`
            @media (prefers-reduced-motion: no-preference) {
                :root {
                    scroll-behavior: auto !important;
                }
            }
        `);
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
        window.parent.glitter.share.evalPlace = (evals) => {
            return eval(evals);
        };
        glitter.addMtScript(window.parent.editerData.setting.map((dd) => {
            return {
                src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                type: 'module',
            };
        }), () => { }, () => { }, [{ key: 'async', value: 'true' }]);
        glitter.htmlGenerate.loadScript(glitter, window.parent.editerData.setting
            .filter((dd) => {
            return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
        })
            .map((dd) => {
            return {
                src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                type: 'module',
            };
        }));
        glitter.share.evalPlace = (evals) => {
            return eval(evals);
        };
        glitter.htmlGenerate.setHome({
            app_config: vm.appConfig,
            page_config: (_a = window.parent.page_config) !== null && _a !== void 0 ? _a : {},
            get config() {
                return window.parent.editerData.setting;
            },
            get editMode() {
                return window.parent.editerData;
            },
            data: {},
            tag: window.parent.glitter.getUrlParameter('page'),
        });
        callback();
    }
    static toNormalRender(glitter, vm, callback) {
        if (glitter.getUrlParameter('token') && glitter.getUrlParameter('return_type') === 'resetPassword') {
            GlobalUser.token = glitter.getUrlParameter('token');
            glitter.setUrlParameter('token');
            glitter.setUrlParameter('return_type');
        }
        glitter.share.evalPlace = (evals) => {
            return eval(evals);
        };
        console.log(`exePlugin-time:`, window.renderClock.stop());
        window.glitterInitialHelper.getPageData(glitter.getUrlParameter('page'), (data) => {
            console.log(`getPageData-time:`, window.renderClock.stop());
            if (data.response.result.length === 0) {
                const url = new URL('./', location.href);
                url.searchParams.set('page', data.response.redirect);
                if (glitter.getUrlParameter('appName')) {
                    url.searchParams.set('appName', glitter.getUrlParameter('appName'));
                }
                if (glitter.getUrlParameter('function')) {
                    url.searchParams.set('function', glitter.getUrlParameter('function'));
                }
                if (data.response.redirect) {
                    location.href = url.href;
                }
                return;
            }
            glitter.htmlGenerate.loadScript(glitter, data.response.result[0].config
                .filter((dd) => {
                return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
            })
                .map((dd) => {
                return {
                    src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                    callback: () => { },
                };
            }));
            function authPass() {
                glitter.htmlGenerate.setHome({
                    app_config: vm.appConfig,
                    page_config: data.response.result[0].page_config,
                    config: data.response.result[0].config,
                    data: {},
                    tag: glitter.getUrlParameter('page'),
                });
                callback();
            }
            function authError(message) {
                glitter.addStyleLink(['assets/vendor/boxicons/css/boxicons.min.css', 'assets/css/theme.css', 'css/editor.css']);
                glitter.setHome('jspage/alert.js', glitter.getUrlParameter('page'), message, {
                    backGroundColor: `transparent;`,
                });
            }
            if (window.memberType !== 'noLimit' &&
                vm.appConfig.dead_line &&
                new Date(vm.appConfig.dead_line).getTime() < new Date().getTime() &&
                (!vm.appConfig.refer_app || vm.appConfig.refer_app === vm.appConfig.appName)) {
                authError('使用權限已過期，請前往後台執行續費。');
            }
            else {
                authPass();
            }
        });
    }
    static resourceInitial(glitter, vm, callback) {
        window.glitterInitialHelper.getPlugin((dd) => {
            var _a, _b, _c, _d, _e;
            console.log(`getPlugin-time:`, window.renderClock.stop());
            window.saasConfig.appConfig = dd.response.data;
            GlobalUser.language = GlobalUser.language || navigator.language;
            vm.appConfig = dd.response.data;
            glitter.share.appConfigresponse = dd;
            glitter.share.globalValue = {};
            glitter.share.globalStyle = {};
            const config = glitter.share.appConfigresponse.response.data;
            config.color_theme = (_a = config.color_theme) !== null && _a !== void 0 ? _a : [];
            config.container_theme = (_b = config.container_theme) !== null && _b !== void 0 ? _b : [];
            config.font_theme = (_c = config.font_theme) !== null && _c !== void 0 ? _c : [];
            config.globalValue = (_d = config.globalValue) !== null && _d !== void 0 ? _d : [];
            config.globalStyleTag = (_e = config.globalStyleTag) !== null && _e !== void 0 ? _e : [];
            config.color_theme.map((dd, index) => {
                EditorConfig.color_setting_config.map((d2) => {
                    glitter.share.globalValue[`theme_color.${index}.${d2.key}`] = dd[d2.key];
                });
            });
            glitter.share.font_theme = config.font_theme;
            glitter.share.global_container_theme = config.container_theme;
            glitter.share.initial_fonts = [];
            if (glitter.share.font_theme[0]) {
                glitter.addStyle(`
@charset "UTF-8";
${glitter.share.font_theme.map((dd) => {
                    glitter.share.initial_fonts.push(dd.value);
                    return `@import url('https://fonts.googleapis.com/css2?family=${dd.value}&display=swap');`;
                }).join('\n')}
body {
    font-family: "${glitter.share.font_theme[0].value}" !important;
    font-optical-sizing: auto;
    font-style: normal;
    color: #393939;
}`);
            }
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
                    console.error(e);
                }
            }
            if (glitter.getUrlParameter('type') === 'htmlEditor') {
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
                },
            };
            for (const data of (_a = dd.response.data.initialList) !== null && _a !== void 0 ? _a : []) {
                try {
                    if (data.type === 'script') {
                        const url = new URL(glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(data.src.link)));
                        glitter.share.callBackList = (_b = glitter.share.callBackList) !== null && _b !== void 0 ? _b : {};
                        const callbackID = glitter.getUUID();
                        url.searchParams.set('callback', callbackID);
                        glitter.share.callBackList[callbackID] = () => {
                            vm.count--;
                        };
                        glitter.addMtScript([
                            {
                                src: url.href,
                                type: 'module',
                            },
                        ], () => {
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
                    console.error(e);
                    vm.count--;
                }
            }
            if (countI === 0) {
                resolve(true);
            }
        }));
    }
    static checkRedirectPage(glitter) {
        const url = new URL(location.href);
        if (url.searchParams.get('state') === 'google_login') {
            glitter.setUrlParameter('page', 'login');
        }
    }
}
let clockF = () => {
    return {
        start: new Date(),
        stop: function () {
            return new Date().getTime() - this.start.getTime();
        },
        zeroing: function () {
            this.start = new Date();
        },
    };
};
