import {init} from '../GVController.js';
import {TriggerEvent} from "./trigger-event.js";
import {EditorConfig} from "../../editor-config.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

init(import.meta.url, (gvc, glitter, gBundle) => {
    glitter.share.htmlExtension = glitter.share.htmlExtension ?? {};
    gBundle.app_config = gBundle.app_config ?? {}
    gBundle.app_config.globalStyle = gBundle.app_config.globalStyle ?? []
    gBundle.app_config.globalScript = gBundle.app_config.globalScript ?? []
    const vm = {
        loading: true,
        mainView: ''
    };

    console.log(`the-page`,gvc.glitter.getUrlParameter('page'))
    console.log(`waitCreateView-time:`, (window as any).renderClock.stop())

    async function load() {
        await (new Promise(async (resolve, reject) => {
            for (const b of gBundle.app_config.initialList ?? []) {
                try {
                    await TriggerEvent.trigger({
                        gvc: gvc, widget: b as any, clickEvent: b.src.event
                    }).then(() => {
                    }).catch(() => {
                    })
                } catch (e) {
                }
            }
            resolve(true)
        }));
        await (new Promise(async (resolve, reject) => {
            (gBundle.page_config.initialList ?? []).map((dd: any) => {
                if (dd.when === 'initial') {
                    if (dd.type === 'script') {
                        try {
                            TriggerEvent.trigger({
                                gvc: gvc, widget: (undefined as any), clickEvent: dd
                            })
                        } catch (e) {
                        }
                    } else {
                        try {
                            eval(dd.src.official)
                        } catch (e) {

                        }
                    }
                }
            })
            resolve(true)
        }));
        (gBundle.page_config.initialStyleSheet ?? []).map(async (data: any) => {
            if (data.type === 'script') {
                try {
                    gvc.addStyleLink(data)
                } catch (e) {
                }
            } else {
                try {
                    gvc.addStyle(data.src.official)
                } catch (e) {
                }
            }
        })
    };
    if(!gBundle.data){
        gBundle.data={}
    }
    return {
        onCreateView: () => {
            //判斷如果是帳號頁面，且未登入則重新導向
            if(gvc.glitter.getUrlParameter('page')==='account_userinfo' && !GlobalUser.token){
                gvc.glitter.href='/login'
                return ``
            }
            document.querySelector('body')!.style.background=gBundle.app_config._background || glitter.share.globalValue[`theme_color.0.background`];
            console.log(`onCreateView-time:`, (window as any).renderClock.stop())
            const mainId = glitter.getUUID()
            let map = [];
            if (gBundle.page_config.resource_from !== 'own') {
                map.push(new glitter.htmlGenerate(gBundle.app_config.globalScript ?? [], [], gBundle.data, true).render(gvc, {
                    class: ``,
                    style: ``,
                    jsFinish: () => {
                        console.log(`jsFinish-time:`, (window as any).renderClock.stop())
                        load().then(() => {
                            if (vm.loading) {
                                vm.loading = false
                                gvc.notifyDataChange(mainId)
                                window.history.replaceState({}, glitter.document.title, location.href);
                            }

                        })
                    }
                }));
                let globalStyleLink = (gBundle.app_config.globalStyle ?? []).filter((dd: any) => {
                    return dd.data.elem === 'link'
                });
                let check = globalStyleLink.length;
                globalStyleLink.map((dd: any) => {
                    try {
                        $('#glitterPage').hide()
                        glitter.addStyleLink(dd.data.attr.find((dd: any) => {
                            return dd.attr === 'href'
                        }).value).then(() => {
                            check--
                            if (check === 0) {
                                $('#glitterPage').show()
                            }
                        })
                    } catch (e) {
                        return ``
                    }
                });
                map.push(new glitter.htmlGenerate(gBundle.app_config.globalStyle, [], gBundle.data, true).render(gvc, {
                    class: ``,
                    style: ``,
                    app_config: gBundle.app_config,
                    page_config: gBundle.page_config,
                    onCreate:()=>{
                        console.log(`createRender`)
                    }
                }))
            } else {
                vm.loading = false
            }
            map.push(gvc.bindView({
                bind: mainId,
                view: () => {
                    if (vm.loading) {
                        return ``
                    }
                    return new Promise(async (resolve, reject) => {
                        console.log(`Render-time:`, (window as any).renderClock.stop());
                        (gBundle.config.formData = gBundle.page_config.formData)
                        if (gBundle.page_config.template) {
                            (window as any).glitterInitialHelper.getPageData(gBundle.page_config.template, (data: any) => {
                                const template_config = JSON.parse(JSON.stringify(data.response.result[0].config))
                                function findContainer(set: any) {
                                    set.map((dd: any, index: number) => {
                                        if (dd.type === 'glitter_article') {
                                            if (gBundle.page_config.meta_article.view_type === "rich_text") {
                                                set[index].type = 'widget'
                                                set[index].data.inner = gBundle.page_config.meta_article.content
                                            } else {
                                                if (gBundle.editMode) {
                                                    set[index].type = 'widget'
                                                    set[index].data.inner = (gBundle.editMode && gBundle.editMode.render(gvc, {
                                                        class: ``,
                                                        style: ``,
                                                        app_config: gBundle.app_config,
                                                        page_config: gBundle.page_config
                                                    }))
                                                } else {
                                                    set[index].type = 'container'
                                                    set[index].data = {
                                                        "setting": gBundle.config,
                                                        "elem": "div",
                                                        "style_from": set[index].style_from,
                                                        "class": set[index].class,
                                                        "style": set[index].style,
                                                        "classDataType": set[index].classDataType,
                                                        "dataType": set[index].dataType
                                                    }
                                                }

                                                function loopFormData(dd: any) {
                                                    dd.formData = gBundle.page_config.formData;
                                                    if (dd.type === 'container') {
                                                        loopFormData(dd.data.setting)
                                                    }
                                                }

                                                loopFormData(set[index]);
                                            }
                                        } else if (dd.type === 'container') {
                                            dd.data.setting = dd.data.setting ?? [];
                                            dd.formData = data.response.result[0].page_config.formData;
                                            findContainer(dd.data.setting);
                                        }
                                    });
                                }
                                findContainer(template_config);
                                resolve(new glitter.htmlGenerate(template_config, [], gBundle.data, true).render(gvc, {
                                    class: ``,
                                    style: ``,
                                    app_config: gBundle.app_config,
                                    page_config: gBundle.page_config
                                }))
                            })
                        } else {
                            function editorView() {
                                // console.log(`gBundle.editMode.render->`,gBundle.editMode.render)
                                return gBundle.editMode.render(gvc, {
                                    class: ``,
                                    style: ``,
                                    containerID: `MainView`,
                                    app_config: gBundle.app_config,
                                    page_config: gBundle.page_config
                                })
                            }

                            resolve((
                                (gBundle.editMode && editorView())
                                ||
                                new glitter.htmlGenerate(gBundle.config, [], gBundle.data, true).render(gvc, {
                                    class: ``,
                                    style: ``,
                                    app_config: gBundle.app_config,
                                    page_config: gBundle.page_config,
is_page:true
                                })
                            ));
                        }


                    })

                },
                divCreate: {
                    class: glitter.htmlGenerate.styleEditor(gBundle.page_config).class()+' d-none',
                    style: `overflow-x:hidden;min-height: 100%;min-width: 100%;${glitter.htmlGenerate.styleEditor(gBundle.page_config).style()}`
                },
                onCreate: () => {
                    (gBundle.page_config.initialList ?? []).map((dd: any) => {
                        if (dd.when === 'onCreate') {
                            try {
                                eval(dd.src.official)
                            } catch (e) {
                            }
                        }
                    })
                    setTimeout(()=>{
                        (document.querySelector(`[gvc-id='${gvc.id(mainId)}']`) as any).classList.remove('d-none')
                    },20)
                }
            }))
            return map.join('');

        }
    };
});

