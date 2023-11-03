'use strict';
import {Glitter} from './glitterBundle/Glitter.js' ;
import {ApiUser} from "./api/user.js";
import {config} from "./config.js";
import {ApiPageConfig} from "./api/pageConfig.js";
import {BaseApi} from "./api/base.js";

export class Entry {
    public static onCreate(glitter: Glitter) {
        glitter.addStyle(glitter.html`@media (prefers-reduced-motion: no-preference) {
    :root {
        scroll-behavior: auto !important;
    }
}`);
        (window as any).renderClock = (window as any).renderClock ?? clockF()
        console.log(`Entry-time:`, (window as any).renderClock.stop())
        glitter.share.editerVersion = "V_3.1.2"
        glitter.share.start = new Date()
        glitter.debugMode = false
        const vm = {
            pageData: ApiPageConfig.getPage(config.appName, glitter.getUrlParameter('page') ?? glitter.getUUID()),
            appConfig: []
        };
        (window as any).saasConfig = {
            config: (window as any).config = config,
            api: ApiPageConfig,
            appConfig: undefined
        }
        ApiPageConfig.getPlugin(config.appName).then((dd) => {
            console.log(`getPlugin-time:`, (window as any).renderClock.stop())
            vm.appConfig = dd.response.data;
            glitter.share.appConfigresponse = dd;
            glitter.share.globalValue = {}
            glitter.share.globalStyle = {}
            glitter.share.appConfigresponse.response.data.globalValue = glitter.share.appConfigresponse.response.data.globalValue ?? []
            glitter.share.appConfigresponse.response.data.globalStyleTag = glitter.share.appConfigresponse.response.data.globalStyleTag ?? []

            function loopCheckGlobalValue(array: any, tag: string) {
                try {
                    array.map((dd: any) => {
                        if (dd.type === 'container') {
                            loopCheckGlobalValue(dd.data.setting, tag)
                        } else {
                            glitter.share[tag][dd.data.tag] = dd.data.value
                        }
                    })
                } catch (e) {
                }
            };

            if (glitter.getUrlParameter("type") === 'htmlEditor') {
                loopCheckGlobalValue((window.parent as any).glitter.share.editorViewModel.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue((window.parent as any).glitter.share.editorViewModel.globalValue, 'globalValue');

            } else {
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalValue, 'globalValue');
            }
            (window as any).saasConfig.appConfig = dd.response.data;
            (async () => {
                return new Promise(async (resolve, reject) => {
                    //Initial Global style
                    if (glitter.getUrlParameter("type") !== 'editor') {
                        for (const data of (dd.response.data.initialStyleSheet ?? [])) {
                            try {
                                if (data.type === 'script') {
                                    glitter.addStyleLink(data.src.link)
                                } else {
                                    glitter.addStyle(data.src.official)
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    }
                    let countI = dd.response.data.initialList.length
                    const vm = {
                        //@ts-ignore
                        get count() {
                            return countI
                        },
                        set count(v) {
                            countI = v
                            if (countI === 0) {
                                resolve(true)
                            }
                        }
                    }
                    for (const data of (dd.response.data.initialList ?? [])) {
                        try {
                            if (data.type === 'script') {
                                const url = new URL(glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(data.src.link)))
                                glitter.share.callBackList = glitter.share.callBackList ?? {}
                                const callbackID = glitter.getUUID()
                                url.searchParams.set('callback', callbackID)
                                glitter.share.callBackList[callbackID] = (() => {
                                    vm.count--
                                })
                                glitter.addMtScript([{
                                    src: url.href, type: 'module'
                                }], () => {
                                    vm.count--
                                }, () => {
                                    vm.count--
                                })
                            } else {
                                const dd = await eval(data.src.official)
                                vm.count--
                            }
                        } catch (e) {
                            console.log(e)
                            vm.count--
                        }
                    }
                    if (countI === 0) {
                        resolve(true)
                    }
                })
            })().then(() => {
                if (glitter.getUrlParameter("type") === 'editor') {
                    glitter.share.EditorMode = true
                    glitter.share.evalPlace = ((evals: string) => {
                        return eval(evals)
                    })
                    toBackendEditor(glitter)
                } else if (glitter.getUrlParameter("type") === 'htmlEditor') {
                    (window.parent as any).glitter.share.editerGlitter = glitter;
                    let timer: any = 0
                    // 获取<body>元素
                    var bodyElement = document.body;
                    // 创建一个ResizeObserver实例
                    var observer = new ResizeObserver(function (entries, observer) {
                        function scrollToItem(element: any) {
                            if (element) {
                                element.scrollIntoView({
                                    behavior: 'smooth', // 使用平滑滾動效果
                                    block: 'center', // 將元素置中
                                })
                            }
                        }

                        clearInterval(timer)
                        timer = setTimeout(() => {
                            scrollToItem(document.querySelector('.selectComponentHover'))
                        }, 100)

                    });
                    // 启动观察器并开始监听<body>元素的大小变化
                    observer.observe(bodyElement);
                    (window.parent as any).glitter.share.evalPlace = ((evals: string) => {
                        return eval(evals)
                    })
                    glitter.addMtScript(
                        (window.parent as any).editerData.setting.map((dd: any) => {
                            return {
                                src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                                type: 'module'
                            }
                        }),
                        () => {

                        },
                        () => {
                        },
                        [
                            {key: "async", value: "true"}
                        ]
                    );
                    //Preload page script.
                    glitter.htmlGenerate.loadScript(glitter, (window.parent as any).editerData.setting.map((dd: any) => {
                        return {
                            src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                            type: 'module'
                        }
                    }))
                    glitter.share.evalPlace = ((evals: string) => {
                        return eval(evals)
                    })
                    glitter.htmlGenerate.setHome(
                        {
                            app_config: vm.appConfig,
                            page_config: (window.parent as any).page_config ?? {},
                            config: (window.parent as any).editerData.setting,
                            editMode: (window.parent as any).editerData,
                            data: {},
                            tag: (window.parent as any).glitter.getUrlParameter('page')
                        }
                    );
                } else {

                    glitter.share.evalPlace = ((evals: string) => {
                        return eval(evals)
                    })
                    console.log(`exePlugin-time:`, (window as any).renderClock.stop())
                    vm.pageData.then((data) => {
                        console.log(`pageConfig===`, data.response.result[0]);
                        console.log(`getPageData-time:`, (window as any).renderClock.stop())
                        if (data.response.result.length === 0) {
                            const url = new URL("./", location.href)
                            url.searchParams.set('page', data.response.redirect)
                            location.href = url.href;
                            return
                        }
                        //Preload page script.
                        glitter.htmlGenerate.loadScript(glitter, data.response.result[0].config.map((dd: any) => {
                            return {
                                src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                                callback: () => {
                                }
                            }
                        }))

                        glitter.htmlGenerate.setHome(
                            {
                                app_config: vm.appConfig,
                                page_config: data.response.result[0].page_config,
                                config: data.response.result[0].config,
                                data: {},
                                tag: glitter.getUrlParameter('page')
                            }
                        );
                    })
                }
            });


        })
    }

}

function toBackendEditor(glitter: Glitter) {

    async function running() {
        config.token = glitter.getCookieByName('glitterToken')
        glitter.addStyleLink([
            'assets/vendor/boxicons/css/boxicons.min.css',
            'assets/css/theme.min.css',
            'css/editor.css',

        ]);
        await new Promise((resolve, reject) => {
            glitter.addMtScript(
                [
                    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
                    'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
                    'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                    'assets/vendor/swiper/swiper-bundle.min.js',
                    'assets/js/theme.min.js',
                    'https://kit.fontawesome.com/cccedec0f8.js'
                ],
                () => {
                    resolve(true)
                },
                () => {
                    resolve(true)
                }
            );
        })
        return
    }

    (window as any).mode = 'light';
    (window as any).root = document.getElementsByTagName('html')[0];
    (window as any).root.classList.add('light-mode');

    function toNext() {
        running().then(async () => {
            {
                let data = await ApiPageConfig.getPage(config.appName, glitter.getUrlParameter('page') ?? glitter.getUUID())
                if (data.response.result.length === 0) {
                    glitter.setUrlParameter('page', data.response.redirect)
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
                })()
            }
        })
    }

    if (glitter.getUrlParameter('account')) {
        ApiUser.login({
            "account": glitter.getUrlParameter('account'),
            "pwd": glitter.getUrlParameter('pwd')
        }).then((re) => {
            if (re.result) {
                glitter.setCookie('glitterToken', re.response.userData.token)
                toNext()
            } else {
                const url = new URL(glitter.location.href)
                location.href = `${url.origin}/glitter/?page=signin`
            }
        })
    } else {
        if (!glitter.getCookieByName('glitterToken')) {
            const url = new URL(glitter.location.href)
            location.href = `${url.origin}/glitter/?page=signin`
        } else {
            BaseApi.create({
                "url": config.url + `/api/v1/user/checkToken`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": glitter.getCookieByName('glitterToken')
                }
            }).then((d2) => {
                if (!d2.result) {
                    const url = new URL(glitter.location.href)
                    location.href = `${url.origin}/glitter/?page=signin`
                } else {
                    toNext()
                }
            })

        }
    }
}

let clockF = () => {
    return {
        start: new Date(),
        stop: function () {
            return ((new Date()).getTime() - (this.start).getTime())
        },
        zeroing: function () {
            this.start = new Date()
        }
    }
}