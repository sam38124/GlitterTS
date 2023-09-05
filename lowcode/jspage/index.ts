import {init} from "../glitterBundle/GVController.js";
import {config} from "../config.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {Glitter} from "../glitterBundle/Glitter.js";
import {ApiUser} from "../api/user.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";
import {BaseApi} from "../api/base.js";

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            return ``
        },
        onCreate: () => {
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
                vm.appConfig = dd.response.data;
                glitter.share.appConfigresponse = dd;
                (window as any).saasConfig.appConfig = dd.response.data;

                (async () => {
                    return new Promise(async (resolve, reject) => {
                        //Initial Global style
                        if (glitter.getUrlParameter("type") !== 'editor') {
                            for (const data of (dd.response.data.initialStyleSheet ?? [])) {
                                try {
                                    if (data.type === 'script') {
                                        gvc.glitter.addStyleLink(data.src.link)
                                    } else {
                                        gvc.glitter.addStyle(data.src.official)
                                    }
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                        }
                        let countI = dd.response.data.initialList.length
                        const vm = {
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

                                    const url = new URL(glitter.htmlGenerate.resourceHook(data.src.link))
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
                                } else if (data.type === 'event') {
                                    new Promise(async () => {
                                        try {
                                            await TriggerEvent.trigger({
                                                gvc: gvc, widget: dd as any, clickEvent: data.src.event
                                            }).then(() => {
                                                vm.count--
                                            }).catch(() => {
                                                vm.count--
                                            })

                                        } catch (e) {
                                            console.log(e)
                                            vm.count--
                                        }

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


                    })
                })().then(() => {
                    if (glitter.getUrlParameter("type") === 'editor') {
                        glitter.share.evalPlace = ((evals: string) => {
                            return eval(evals)
                        })
                        toBackendEditor(glitter)
                    } else if (glitter.getUrlParameter("type") === 'htmlEditor') {
                        (window.parent as any).glitter.share.evalPlace = ((evals: string) => {
                            return eval(evals)
                        })
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
                                tag: 'htmlEditor'
                            }
                        );
                    } else {
                        glitter.share.evalPlace = ((evals: string) => {
                            return eval(evals)
                        })
                        vm.pageData.then((data) => {
                            if (data.response.result.length === 0) {
                                const url = new URL("./", location.href)

                                url.searchParams.set('page', data.response.redirect)
                                location.href = url.href;
                                return
                            }
                            try {
                                gvc.glitter.addMtScript(
                                    data.response.result[0].config.map((dd: any) => {
                                        return {src: `${gvc.glitter.htmlGenerate.resourceHook(dd.js)}`, type: 'module'}
                                    }),
                                    () => {

                                    },
                                    () => {
                                    },
                                    [
                                        {key: "async", value: "true"}
                                    ]
                                );
                            } catch (e) {

                            }

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
})

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
                    'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
                    'assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
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