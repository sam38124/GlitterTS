var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { init } from "../glitterBundle/GVController.js";
import { config } from "../config.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { ApiUser } from "../api/user.js";
import { TriggerEvent } from "../glitterBundle/plugins/trigger-event.js";
import { BaseApi } from "../glitterBundle/api/base.js";
import { GlobalUser } from "../glitter-base/global/global-user.js";
init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            return ``;
        },
        onCreate: () => {
            const vm = {
                pageData: ApiPageConfig.getPage({
                    appName: config.appName,
                    tag: glitter.getUrlParameter('page')
                }),
                appConfig: []
            };
            window.saasConfig = {
                config: window.config = config,
                api: ApiPageConfig,
                appConfig: undefined
            };
            ApiPageConfig.getPlugin(config.appName).then((dd) => {
                vm.appConfig = dd.response.data;
                glitter.share.appConfigresponse = dd;
                window.saasConfig.appConfig = dd.response.data;
                (() => __awaiter(void 0, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a, _b, _c;
                        if (glitter.getUrlParameter("type") !== 'editor') {
                            for (const data of ((_a = dd.response.data.initialStyleSheet) !== null && _a !== void 0 ? _a : [])) {
                                try {
                                    if (data.type === 'script') {
                                        gvc.glitter.addStyleLink(data.src.link);
                                    }
                                    else {
                                        gvc.glitter.addStyle(data.src.official);
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
                        for (const data of ((_b = dd.response.data.initialList) !== null && _b !== void 0 ? _b : [])) {
                            try {
                                if (data.type === 'script') {
                                    const url = new URL(glitter.htmlGenerate.resourceHook(data.src.link));
                                    glitter.share.callBackList = (_c = glitter.share.callBackList) !== null && _c !== void 0 ? _c : {};
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
                                else if (data.type === 'event') {
                                    new Promise(() => __awaiter(void 0, void 0, void 0, function* () {
                                        try {
                                            yield TriggerEvent.trigger({
                                                gvc: gvc, widget: dd, clickEvent: data.src.event
                                            }).then(() => {
                                                vm.count--;
                                            }).catch(() => {
                                                vm.count--;
                                            });
                                        }
                                        catch (e) {
                                            console.log(e);
                                            vm.count--;
                                        }
                                    }));
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
                    }));
                }))().then(() => {
                    var _a;
                    if (glitter.getUrlParameter("type") === 'editor') {
                        glitter.share.evalPlace = ((evals) => {
                            return eval(evals);
                        });
                        toBackendEditor(glitter);
                    }
                    else if (glitter.getUrlParameter("type") === 'htmlEditor') {
                        window.parent.glitter.share.evalPlace = ((evals) => {
                            return eval(evals);
                        });
                        glitter.share.evalPlace = ((evals) => {
                            return eval(evals);
                        });
                        glitter.htmlGenerate.setHome({
                            app_config: vm.appConfig,
                            page_config: (_a = window.parent.page_config) !== null && _a !== void 0 ? _a : {},
                            config: window.parent.editerData.setting,
                            editMode: window.parent.editerData,
                            data: {},
                            tag: 'htmlEditor'
                        });
                    }
                    else {
                        glitter.share.evalPlace = ((evals) => {
                            return eval(evals);
                        });
                        vm.pageData.then((data) => {
                            if (data.response.result.length === 0) {
                                const url = new URL("./", location.href);
                                url.searchParams.set('page', data.response.redirect);
                                location.href = url.href;
                                return;
                            }
                            try {
                                gvc.glitter.addMtScript(data.response.result[0].config.map((dd) => {
                                    return { src: `${gvc.glitter.htmlGenerate.resourceHook(dd.js)}`, type: 'module' };
                                }), () => {
                                }, () => {
                                }, [
                                    { key: "async", value: "true" }
                                ]);
                            }
                            catch (e) {
                            }
                            glitter.htmlGenerate.setHome({
                                app_config: vm.appConfig,
                                page_config: data.response.result[0].page_config,
                                config: data.response.result[0].config,
                                data: {},
                                tag: glitter.getUrlParameter('page')
                            });
                        });
                    }
                });
            });
        }
    };
});
function toBackendEditor(glitter) {
    function running() {
        return __awaiter(this, void 0, void 0, function* () {
            config.token = GlobalUser.token;
            glitter.addStyleLink([
                'assets/vendor/boxicons/css/boxicons.min.css',
                'assets/css/theme.min.css',
                'css/editor.css',
            ]);
            yield new Promise((resolve, reject) => {
                glitter.addMtScript([
                    `${glitter.root_path}/jslib/lottie-player.js`,
                    'assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
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
