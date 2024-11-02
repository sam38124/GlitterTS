'use strict';
import { Glitter } from './glitterBundle/Glitter.js';
import { config } from './config.js';
import { ApiPageConfig } from './api/pageConfig.js';
import { BaseApi } from './glitterBundle/api/base.js';
import { GlobalUser } from './glitter-base/global/global-user.js';
import { EditorConfig } from './editor-config.js';
import { ShareDialog } from './glitterBundle/dialog/ShareDialog.js';

export class Entry {
    public static onCreate(glitter: Glitter) {
        glitter.share.top_inset = 0;
        glitter.share.bottom_inset = 0;
        glitter.share.reload_code_hash = function () {
            const hashCode = (window as any).preloadData.eval_code_hash || {};
            Object.keys(hashCode).map((dd, index) => {
                if (typeof hashCode[dd] === 'string') {
                    try {
                        hashCode[dd] = new Function(`return {
                        execute:(gvc,widget,object,subData,element,window,document,glitter,$)=>{
                         return (() => { ${hashCode[dd]} })()
                        }
                        }`)().execute;
                    } catch (e) {
                        // console.log(
                        //     `error->`,
                        //     `return {
                        // execute:(gvc,widget,object,subData,element,window,document,glitter,$)=>{
                        //  return (() => { ${hashCode[dd]} })()
                        // }
                        // }`
                        // );
                    }
                }
            });
        };
        glitter.share.reload_code_hash();
        glitter.share.editor_util = {
            baseApi: BaseApi,
        };
        glitter.page = (window as any).glitter_page;
        glitter.share.GlobalUser = GlobalUser;

        Entry.checkRedirectPage(glitter);
        glitter.share.logID = glitter.getUUID();
        glitter.addStyle(`
            @media (prefers-reduced-motion: no-preference) {
                :root {
                    scroll-behavior: auto !important;
                }
            }
<<<<<<< HEAD
            .hide-elem {
                display: none !important;
            }
=======
              .hide-elem {
            display: none !important;
        }
        .hy-drawer-left {
        left:-1000px !important;
        }
>>>>>>> d311c294 (update glitter version)
        `);
        if (glitter.getUrlParameter('appName')) {
            (window as any).appName = glitter.getUrlParameter('appName');
            config.appName = glitter.getUrlParameter('appName');
        }
        (window as any).renderClock = (window as any).renderClock ?? clockF();
        console.log(`Entry-time:`, (window as any).renderClock.stop());
        glitter.share.editerVersion = 'V_13.8.52';
        glitter.share.start = new Date();
        const vm: {
            appConfig: any;
        } = {
            appConfig: [],
        };
        (window as any).saasConfig = {
            config: ((window as any).config = config),
            api: ApiPageConfig,
            appConfig: undefined,
        };
        // 設定SAAS管理員請求API
        config.token = GlobalUser.saas_token;

        // 資源初始化
        Entry.resourceInitial(glitter, vm, async (dd) => {
            glitter.addStyle(`
                ${
                    parseInt((window.parent as any).glitter.share.bottom_inset, 10)
                        ? `
                              .update-bar-container {
                                  padding-bottom: ${(window.parent as any).glitter.share.bottom_inset}px !important;
                              }
                          `
                        : ``
                }

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
                .editor_item.active {
                    background: #ddd;
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

                ul {
                    list-style: none;
                }
                li {
                    list-style: none;
                }
            `);

            // 載入全域資源
            await Entry.globalStyle(glitter, dd);
            if (glitter.getUrlParameter('type') === 'editor') {
                const dialog = new ShareDialog(glitter);
                dialog.dataLoading({ visible: true, text: '後台載入中' });
                // 頁面編輯器
                Entry.toBackendEditor(glitter, () => {});
            } else if (glitter.getUrlParameter('type') === 'htmlEditor') {
                // Iframe預覽區塊
                Entry.toHtmlEditor(glitter, vm, () => {
                    Entry.checkIframe(glitter);
                });
            } else {
                // 一般頁面
                Entry.toNormalRender(glitter, vm, () => {
                    Entry.checkIframe(glitter);
                });
            }
        });
    }

    // 判斷是否為Iframe來覆寫Glitter代碼
    public static checkIframe(glitter: Glitter) {
        if (glitter.getUrlParameter('isIframe') === 'true') {
            console.log('checkIframe:' + glitter.share.logID);
            glitter.goBack = (window.parent as any).glitter.goBack;
            setInterval(() => {
                (window.parent as any).glitter.share.iframeHeightChange[glitter.getUrlParameter('iframe_id')](document.body.scrollHeight);
                $(`body`).height(`${document.body.scrollHeight}px`);
            }, 100);
            glitter.addStyle(`
                html,
                body {
                    overflow: hidden !important;
                }
            `);
        } else {
            glitter.addStyle(`
                html,
                body {
                    height: 100vh !important;
                }
            `);
        }
    }

    // 跳轉至頁面編輯器
    public static toBackendEditor(glitter: Glitter, callback: () => void) {
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
        glitter.share.evalPlace = (evals: string) => eval(evals);

        async function running() {
            glitter.addStyleLink([
                'assets/vendor/boxicons/css/boxicons.min.css',
                'assets/css/theme.css',
                'css/editor.css',
                'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css',
                'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/monolith.min.css',
                'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css',
            ]);
            await new Promise((resolve, reject) => {
                glitter.addMtScript(
                    [
                        'jslib/pickr.min.js',
                        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
                        'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                        'assets/vendor/swiper/swiper-bundle.min.js',
                        'assets/js/theme.min.js',
                        'https://kit.fontawesome.com/cccedec0f8.js',
                        'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
                    ],
                    () => {
                        resolve(true);
                    },
                    () => {
                        resolve(true);
                    }
                );
            });
            return;
        }

        (window as any).mode = 'light';
        (window as any).root = document.getElementsByTagName('html')[0];
        (window as any).root.classList.add('light-mode');

        function toNext() {
            console.log(`to-next-time:`, (window as any).renderClock.stop());
            running().then(async () => {
                {
                    console.log(`to-page-time:`, (window as any).renderClock.stop());
                    let data = await ApiPageConfig.getPage({
                        appName: config.appName,
                        tag: glitter.getUrlParameter('page'),
                    });
                    // console.log(`data===>`,data)
                    if (data.response.result.length === 0 && glitter.getUrlParameter('page') !== 'cms') {
                        glitter.setUrlParameter('page', data.response.redirect);
                    }

                    glitter.setHome(
                        'jspage/main.js',
                        glitter.getUrlParameter('page'),
                        {
                            appName: config.appName,
                        },
                        {
                            backGroundColor: `transparent;`,
                        }
                    );
                }
            });
        }

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
                location.href = `${url.origin}/${(window as any).glitterBase}/login`;
            } else {
                toNext();
            }
        });
    }

    // 跳轉至頁面編輯器Iframe顯示
    public static toHtmlEditor(glitter: Glitter, vm: any, callback: () => void) {
        (window as any).preloadData.eval_code_hash = (window.parent as any).preloadData.eval_code_hash;
        glitter.share.reload_code_hash();
        glitter.addMtScript(
            [
                {
                    src: 'https://kit.fontawesome.com/cccedec0f8.js',
                },
            ],
            () => {},
            () => {}
        );
        glitter.addStyle(`
            @media (prefers-reduced-motion: no-preference) {
                :root {
                    scroll-behavior: auto !important;
                }
            }
        `);
        (window.parent as any).glitter.share.editerGlitter = glitter;
        const clock = glitter.ut.clock();

        function scrollToItem(element: any) {
            if (element) {
                element.scrollIntoView({
                    behavior: 'auto', // 使用平滑滾動效果
                    block: 'center', // 將元素置中
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

        (window.parent as any).glitter.share.evalPlace = (evals: string) => {
            return eval(evals);
        };

        glitter.addMtScript(
            (window.parent as any).editerData.setting.map((dd: any) => {
                return {
                    src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                    type: 'module',
                };
            }),
            () => {},
            () => {},
            [{ key: 'async', value: 'true' }]
        );

        // Preload page script
        glitter.htmlGenerate.loadScript(
            glitter,
            (window.parent as any).editerData.setting
                .filter((dd: any) => {
                    return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
                })
                .map((dd: any) => {
                    return {
                        src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                        type: 'module',
                    };
                })
        );
        glitter.share.evalPlace = (evals: string) => {
            return eval(evals);
        };
        setTimeout(() => {
            (window.parent as any).glitter.share.loading_dialog.dataLoading({ text: '', visible: false });
        }, 2000);
        glitter.htmlGenerate.setHome({
            app_config: vm.appConfig,
            page_config: (window.parent as any).page_config ?? {},
            get config() {
                return (window.parent as any).editerData.setting;
            },
            get editMode() {
                return (window.parent as any).editerData;
            },
            data: {},
            tag: (window.parent as any).glitter.getUrlParameter('page'),
        });

        callback();
    }

    public static toNormalRender(glitter: Glitter, vm: any, callback: () => void) {
        if (glitter.getUrlParameter('token') && glitter.getUrlParameter('return_type') === 'resetPassword') {
            GlobalUser.token = glitter.getUrlParameter('token');
            glitter.setUrlParameter('token');
            glitter.setUrlParameter('return_type');
        }
        glitter.share.evalPlace = (evals: string) => {
            return eval(evals);
        };
        console.log(`exePlugin-time:`, (window as any).renderClock.stop());
        (window as any).glitterInitialHelper.getPageData(glitter.getUrlParameter('page'), (data: any) => {
            console.log(`getPageData-time:`, (window as any).renderClock.stop());
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
            // Preload page script
            glitter.htmlGenerate.loadScript(
                glitter,
                data.response.result[0].config
                    .filter((dd: any) => {
                        return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
                    })
                    .map((dd: any) => {
                        return {
                            src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                            callback: () => {},
                        };
                    })
            );

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

            function authError(message: string) {
                glitter.addStyleLink(['assets/vendor/boxicons/css/boxicons.min.css', 'assets/css/theme.css', 'css/editor.css']);

                glitter.setHome('jspage/alert.js', glitter.getUrlParameter('page'), message, {
                    backGroundColor: `transparent;`,
                });
            }

            // 判斷APP是否過期
            if (
                (window as any).memberType !== 'noLimit' &&
                vm.appConfig.dead_line &&
                new Date(vm.appConfig.dead_line).getTime() < new Date().getTime() &&
                (!vm.appConfig.refer_app || vm.appConfig.refer_app === vm.appConfig.appName)
            ) {
                authError('使用權限已過期，請前往後台執行續費。');
            } else {
                authPass();
            }
        });
    }

    // 資源初始化
    public static resourceInitial(glitter: Glitter, vm: any, callback: (data: any) => void) {
        (window as any).glitterInitialHelper.getPlugin((dd: any) => {
            console.log(`getPlugin-time:`, (window as any).renderClock.stop());
            (window as any).saasConfig.appConfig = dd.response.data;
            // 設定預設的多國語言
            GlobalUser.language = GlobalUser.language || navigator.language;
            vm.appConfig = dd.response.data;
            glitter.share.appConfigresponse = dd;
            glitter.share.globalValue = {};
            glitter.share.globalStyle = {};
            const config = glitter.share.appConfigresponse.response.data;
            config.color_theme = config.color_theme ?? [];
            config.container_theme = config.container_theme ?? [];
            config.font_theme = config.font_theme ?? [];
            config.globalValue = config.globalValue ?? [];
            config.globalStyleTag = config.globalStyleTag ?? [];
            config.color_theme.map((dd: any, index: number) => {
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
                    ${glitter.share.font_theme
                        .map((dd: any) => {
                            glitter.share.initial_fonts.push(dd.value);
                            return `@import url('https://fonts.googleapis.com/css2?family=${dd.value}&display=swap');`;
                        })
                        .join('\n')}
                    body {
                        font-family: '${glitter.share.font_theme[0].value}' !important;
                        font-optical-sizing: auto;
                        font-style: normal;
                        color: #393939;
                    }
                `);
            }

            function loopCheckGlobalValue(array: any, tag: string) {
                try {
                    array.map((dd: any) => {
                        if (dd.type === 'container') {
                            loopCheckGlobalValue(dd.data.setting, tag);
                        } else {
                            if (dd.data.tagType === 'language') {
                                if (dd.data.value.length > 0) {
                                    glitter.share[tag][dd.data.tag] = (
                                        dd.data.value.find((dd: any) => {
                                            return dd.lan.toLowerCase().indexOf(GlobalUser.language.toLowerCase()) !== -1;
                                        }) || dd.data.value[0]
                                    ).text;
                                }
                            } else {
                                glitter.share[tag][dd.data.tag] = dd.data.value;
                            }
                        }
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            if (glitter.getUrlParameter('type') === 'htmlEditor') {
                loopCheckGlobalValue((window.parent as any).glitter.share.editorViewModel.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue((window.parent as any).glitter.share.editorViewModel.globalValue, 'globalValue');
            } else {
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalValue, 'globalValue');
            }
            callback(dd);
        });
    }

    // 載入全域資源
    public static globalStyle(glitter: Glitter, dd: any) {
        return new Promise(async (resolve, reject) => {
            // Initial Global style
            // if (glitter.getUrlParameter("type") !== 'editor') {
            //     for (const data of (dd.response.data.initialStyleSheet ?? [])) {
            //         try {
            //             if (data.type === 'script') {
            //                 glitter.addStyleLink(data.src.link)
            //             } else {
            //                 glitter.addStyle(data.src.official)
            //             }
            //         } catch (e) {
            //             console.error(e)
            //         }
            //     }
            // }
            let countI = dd.response.data.initialList.length;
            const vm = {
                // @ts-ignore
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
            for (const data of dd.response.data.initialList ?? []) {
                try {
                    if (data.type === 'script') {
                        const url = new URL(glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(data.src.link)));
                        glitter.share.callBackList = glitter.share.callBackList ?? {};
                        const callbackID = glitter.getUUID();
                        url.searchParams.set('callback', callbackID);
                        glitter.share.callBackList[callbackID] = () => {
                            vm.count--;
                        };
                        glitter.addMtScript(
                            [
                                {
                                    src: url.href,
                                    type: 'module',
                                },
                            ],
                            () => {
                                vm.count--;
                            },
                            () => {
                                vm.count--;
                            }
                        );
                    } else {
                        vm.count--;
                    }
                } catch (e) {
                    console.error(e);
                    vm.count--;
                }
            }
            if (countI === 0) {
                resolve(true);
            }
        });
    }

    // 判斷是否要重新定義頁面
    public static checkRedirectPage(glitter: Glitter) {
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
