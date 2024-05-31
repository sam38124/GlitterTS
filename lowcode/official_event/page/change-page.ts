import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalData} from "../event.js";
import {GVC} from "../../glitterBundle/GVController.js";

const html = String.raw
class ChangePage {
    public static changePage(link: string, type: 'home' | 'page', subData: any) {
        const glitter=(window as any).glitter;
        return new Promise(async (resolve, reject) => {
            const url = new URL('./', location.href);
            url.searchParams.set('page', link);
            const saasConfig: {
                config: any;
                api: any;
                appConfig: any
            } = (window as any).saasConfig;
            (window as any).glitterInitialHelper.getPageData(link, (data: any) => {
                if (data.response.result.length === 0) {
                    const url = new URL("./", location.href)
                    url.searchParams.set('page', data.response.redirect)
                    location.href = url.href;
                    return
                }
                if (type === 'home') {
                    const cf = {
                        app_config: saasConfig.appConfig,
                        page_config: data.response.result[0].page_config,
                        config: data.response.result[0].config,
                        data: subData ?? {},
                        tag: link
                    }
                    if (glitter.getUrlParameter('isIframe') === 'true') {
                        (window.parent as any).glitter.htmlGenerate.setHome(cf)
                    } else {
                        glitter.htmlGenerate.setHome(cf)
                    }
                    resolve(true)
                } else {
                    const cf = {
                        app_config: saasConfig.appConfig,
                        page_config: data.response.result[0].page_config,
                        config: data.response.result[0].config,
                        data: subData ?? {},
                        tag: link,
                        goBack: true
                    }
                    if (glitter.getUrlParameter('isIframe') === 'true') {
                        (window.parent as any).glitter.htmlGenerate.changePage(cf)
                    } else {
                        glitter.htmlGenerate.changePage(cf)
                    }
                    resolve(true)
                }
            })
        })
    }
}
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();

                        function recursive() {
                            if (GlobalData.data.pageList.length === 0) {
                                GlobalData.data.run();
                                setTimeout(() => {
                                    recursive();
                                }, 200);
                            } else {
                                gvc.notifyDataChange(id);
                            }
                        }

                        recursive();
                        setTimeout(() => {
                            gvc.notifyDataChange(id)
                        }, 1000)
                        return {
                            bind: id,
                            view: () => {
                                if (![
                                    {title: '內部連結', value: 'inlink'},
                                    {title: '外部連結', value: 'outlink'},
                                    {title: 'HashTag', value: 'hashTag'},
                                ].find((dd) => {
                                    return dd.value === object.link_change_type
                                })) {
                                    object.link_change_type = 'inlink'
                                }
                                return /*html*/ ` ${EditorElem.h3('跳轉方式')}
                                    <select
                                        class="form-control form-select"
                                        onchange="${gvc.event((e) => {
                                    object.link_change_type = e.value;
                                    gvc.notifyDataChange(id);
                                })}"
                                    >
                                        ${[
                                    {title: '內部連結', value: 'inlink'},
                                    {title: '外部連結', value: 'outlink'},
                                    {title: 'HashTag', value: 'hashTag'},
                                ]
                                    .map((dd) => {
                                        return /*html*/ `<option value="${dd.value}" ${dd.value == object.link_change_type ? `selected` : ``}>
                                            ${dd.title}
                                        </option>`;
                                    })
                                    .join('')}
                                    </select>
                                    ${(() => {
                                    if (object.link_change_type === 'inlink') {
                                        object.stackControl = object.stackControl ?? "home"
                                        object.switchType = object.switchType ?? 'template'
                                        object.linkFrom = object.linkFrom ?? 'manual'
                                        object.linkFromEvent = object.linkFromEvent ?? {}
                                        return html`
                                            ${EditorElem.select({
                                                title: '堆棧控制',
                                                gvc: gvc,
                                                def: object.stackControl,
                                                callback: (text: string) => {
                                                    object.stackControl = text
                                                    widget.refreshComponent();
                                                },
                                                array: [{title: '設為首頁', value: "home"}, {
                                                    title: '頁面跳轉',
                                                    value: "page"
                                                }],
                                            })}
                                            ${[
                                                EditorElem.select({
                                                    title: '連結來源',
                                                    gvc: gvc,
                                                    def: object.linkFrom,
                                                    array: [
                                                        {title: '手動設定', value: 'manual'},
                                                        {title: '觸發事件', value: 'code'}
                                                    ],
                                                    callback: (text) => {
                                                        object.linkFrom = text
                                                        gvc.notifyDataChange(id)
                                                    }
                                                }),
                                                (object.linkFrom === 'manual') ? [
                                                    EditorElem.select({
                                                        title: '跳轉類型',
                                                        gvc: gvc,
                                                        def: object.switchType,
                                                        array: [
                                                            {title: '設計頁面', value: 'template'},
                                                            {title: 'Blog / 網誌', value: 'article'}
                                                        ],
                                                        callback: (text) => {
                                                            object.switchType = text
                                                            gvc.notifyDataChange(id)
                                                        }
                                                    }),
                                                    `<select
                                                    class="form-select form-control mt-2"
                                                    onchange="${gvc.event((e) => {
                                                        object.link = (window as any).$(e).val();
                                                    })}"
                                            >
                                                ${GlobalData.data.pageList.filter((dd: any) => {
                                                        if (object.switchType === 'template') {
                                                            return dd.group !== 'glitter-article'
                                                        } else {
                                                            return dd.group === 'glitter-article'
                                                        }
                                                    }).map((dd: any) => {
                                                        object.link = object.link || dd.tag;
                                                        return /*html*/ `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${(`${dd.group}-${dd.name}`).replace('glitter-article', '')}
                                                </option>`;
                                                    })}
                                            </select>`
                                                ].join('<div class="my-2"></div>') : [
                                                    TriggerEvent.editer(gvc, widget, object.linkFromEvent, {
                                                        title: '獲取連結來源'
                                                    })
                                                ].join('')
                                            ].join(`<div class="my-2"></div>`)}
                                        `;
                                    } else if (object.link_change_type === 'outlink') {
                                        return gvc.glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: object.link,
                                            placeHolder: '輸入跳轉的連結',
                                            callback: (text: string) => {
                                                object.link = text;
                                                widget.refreshAll();
                                            },
                                        }) + EditorElem.select({
                                            gvc: gvc,
                                            title: '跳轉方式',
                                            def: object.changeType ?? "location",
                                            array: [
                                                {title: "本地跳轉", value: "location"},
                                                {title: "打開新頁面", value: "newTab"}
                                            ],
                                            callback: (text: string) => {
                                                object.changeType = text;
                                                widget.refreshAll();
                                            },
                                        });
                                    } else {
                                        return gvc.glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: object.link,
                                            placeHolder: '輸入跳轉的HashTag',
                                            callback: (text: string) => {
                                                object.link = text;
                                                widget.refreshAll();
                                            },
                                        });
                                    }
                                })()}`;
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    try {
                        (window as any).resetClock()
                    } catch (e) {

                    }
                    console.log(`changePage-Plugin-Time:`, (window as any).renderClock.stop());
                    object.link_change_type = object.link_change_type ?? object.type
                    /**
                     * 網頁直接跳轉連結，如為APP則打開WEBVIEW
                     * */
                    if (object.link_change_type === 'inlink') {
                        return new Promise(async (resolve, reject) => {
                            const link: string = (object.linkFrom === 'code') ? (await TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.linkFromEvent, subData: subData
                            })) : (object.link);
                            if (link) {
                                resolve(await ChangePage.changePage( link, object.stackControl, subData))
                            }
                        })
                    } else if (object.link_change_type === 'hashTag') {
                        const yOffset = $("header").length > 0 ? -($("header") as any).height() : 0;
                        const element: any = document.getElementsByClassName(`glitterTag${object.link}`)[0];
                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({top: y, behavior: "smooth"});
                        return true
                    } else {
                        if (object.changeType === 'newTab') {
                            gvc.glitter.openNewTab(object.link)
                        } else {
                            gvc.glitter.location.href = object.link
                        }
                        return true
                    }
                },
            };
        },
    }
});




(window as any).glitter.setModule(import.meta.url, ChangePage)