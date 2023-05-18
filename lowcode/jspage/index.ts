import {init} from "../glitterBundle/GVController.js";
import {config} from "../config.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {Plugin} from "../glitterBundle/plugins/plugin-creater.js";
import {Glitter} from "../glitterBundle/Glitter.js";
import {ApiUser} from "../api/user.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";
import {BaseApi} from "../api/base.js";

init((gvc, glitter, gBundle)=>{
    return {
        onCreateView:()=>{
            return ``
        },
        onCreate:()=>{

            (window as any).saasConfig = {
                config: (window as any).config = config,
                api: ApiPageConfig
            }

            ApiPageConfig.getPlugin(config.appName).then((dd) => {
                const plugin = Plugin;
                (async () => {
                    return new Promise(async (resolve, reject) => {
                        setTimeout(() => {
                            resolve(true)
                        }, 4000)
                        for (const data of (dd.response.data.initialStyleSheet ?? [])) {
                            try {
                                if (data.type === 'script') {
                                   glitter.addStyleLink(data.src.link)
                                } else{
                                    glitter.addStyle(data.src.official)
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        for (const data of (dd.response.data.initialList ?? [])) {
                            try {
                                if (data.type === 'script') {
                                    const url =new URL(glitter.htmlGenerate.resourceHook(data.src.link))
                                    glitter.share.callBackList=glitter.share.callBackList??{}
                                    const callbackID=glitter.getUUID()
                                    url.searchParams.set('callback',callbackID)
                                    glitter.share.callBackList[callbackID]=(()=>{resolve(true)})
                                    await new Promise((resolve, reject) => {
                                        glitter.addMtScript([{
                                            src:url.href , type: 'module'
                                        }], () => { }, () => {
                                            resolve(true)
                                        })
                                    })
                                } else if(data.type === 'event'){
                                    try {
                                        await TriggerEvent.trigger({
                                            gvc:gvc,widget:dd as any,clickEvent:data.src.event
                                        })
                                    }catch (e) {
                                        console.log(e)
                                    }
                                }else{
                                    const dd = await eval(data.src.official)
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        resolve(true)
                    })
                })().then(() => {
                    if (glitter.getUrlParameter("type") === 'editor') {
                        toBackendEditor(glitter)
                    } else if (glitter.getUrlParameter("type") === 'htmlEditor') {
                        glitter.htmlGenerate.setHome(
                            {
                                page_config: (window.parent as any).page_config ?? {},
                                config: (window.parent as any).editerData.setting,
                                editMode: (window.parent as any).editerData,
                                data: {},
                                tag: 'htmlEditor'
                            }
                        );
                    } else {
                        async function render() {
                            let data = await ApiPageConfig.getPage(config.appName, glitter.getUrlParameter('page') ?? glitter.getUUID())
                            if (data.response.result.length === 0) {
                                const url = new URL("./", location.href)

                                url.searchParams.set('page', data.response.redirect)
                                location.href = url.href;
                                return
                            }
                            glitter.htmlGenerate.setHome(
                                {
                                    page_config: data.response.result[0].page_config,
                                    config: data.response.result[0].config,
                                    data: {},
                                    tag: glitter.getUrlParameter('page')
                                }
                            );
                        }

                        render().then()
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
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/androidstudio.min.css',
            'https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css',
        ]);
        await new Promise((resolve, reject) => {
            glitter.addMtScript(
                [
                    'assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
                    'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                    'assets/vendor/swiper/swiper-bundle.min.js',
                    'assets/js/theme.min.js',
                    'https://kit.fontawesome.com/02e2dc09e3.js',
                    'https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js',
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
    function toNext(){
        running().then(async ()=>{
            {
                let data = await ApiPageConfig.getPage(config.appName, glitter.getUrlParameter('page') ?? glitter.getUUID())
                if (data.response.result.length === 0) {
                    glitter.setUrlParameter('page',data.response.redirect)
                }
                glitter.setHome('jspage/main.js', glitter.getUrlParameter('page'), {
                    appName: config.appName
                }, {
                    backGroundColor: `transparent;`
                });

            }
        })
    }
    if(glitter.getUrlParameter('account')){
        ApiUser.login({
            "account": glitter.getUrlParameter('account'),
            "pwd": glitter.getUrlParameter('pwd')
        }).then((re)=>{
            if(re.result){
                glitter.setCookie('glitterToken',re.response.userData.token)
                toNext()
            }else{
                const url=new URL(glitter.location.href)
                location.href=`${url.origin}/glitter/?page=signin`
            }
        })
    }else{
        if(!glitter.getCookieByName('glitterToken')){
            const url=new URL(glitter.location.href)
            location.href=`${url.origin}/glitter/?page=signin`
        }else{
            BaseApi.create({
                "url": config.url + `/api/v1/user/checkToken`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization":glitter.getCookieByName('glitterToken')
                }
            }).then((d2) => {
                if (!d2.result) {
                    const url=new URL(glitter.location.href)
                    location.href=`${url.origin}/glitter/?page=signin`
                }else{
                    toNext()
                }
            })

        }
    }
}