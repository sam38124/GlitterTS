import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalData} from "../event.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            widget.data.action=widget.data.action??"auto"
            return {
                editor: () => {
                    const id = gvc.glitter.getUUID()

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
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                return `${EditorElem.h3("選擇頁面")}
                       ${[
                                    `<select
                                            class="form-select form-control mt-2"
                                            onchange="${gvc.event((e) => {
                                        console.log((window as any).$(e).val())
                                        object.link = (window as any).$(e).val();
                                    })}"
                                        >
                                            ${GlobalData.data.pageList.map((dd: any) => {
                                        object.link = object.link ?? dd.tag;
                                        return /*html*/ `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${dd.group}-${dd.name}
                                                </option>`;
                                    })}
                                        </select>`,
                                    gvc.glitter.htmlGenerate.styleEditor(object, gvc).editor(gvc, () => {
                                        widget.refreshComponent()
                                    }, "背景樣式"),
                                    EditorElem.select({
                                        title: '行為',
                                        gvc: gvc,
                                        def:widget.data.action,
                                        array: [{
                                            title: "設置導覽列",
                                            value: "manual"
                                        }, {
                                            title: "設置並開啟導覽列",
                                            value: "auto"
                                        }],
                                        callback: (text) => {
                                            widget.data.action= text;
                                            widget.refreshComponent();
                                        }
                                    })
                                ].join(`<div class="my-2"></div>`)}
`
                            },
                            divCreate: {}
                        }
                    })
                },
                event: () => {
                    let fal = 0
                    let data: any = undefined

                    async function getData() {
                        return new Promise(async (resolve, reject) => {
                            const saasConfig = (window as any).saasConfig
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${object.link}`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                if (!d2.result) {
                                    fal += 1
                                    if (fal < 20) {
                                        setTimeout(() => {
                                            getData()
                                        }, 200)
                                    }
                                } else {
                                    data = d2.response.result[0]
                                    resolve(data)
                                }

                            })
                        })
                    }

                    getData().then((data: any) => {
                        const id = gvc.glitter.getUUID()
                        gvc.glitter.setDrawer(`  <!-- tag=${object.link} -->
  <div class="w-100 h-100 ${gvc.glitter.htmlGenerate.styleEditor(object, gvc).class()}"
style="${gvc.glitter.htmlGenerate.styleEditor(object, gvc).style()}"
>${
                            gvc.bindView(() => {
                                return {
                                    bind: id,
                                    view: () => {
                                        if (!data) {
                                            return ``
                                        }
                                        return new (window as any).glitter.htmlGenerate(data.config, [], subData ?? {}).render(gvc);
                                    },
                                    divCreate: {}
                                }
                            })
                        }</div>`, () => {
                            if(widget.data.action==='auto'){
                                gvc.glitter.openDrawer()
                            }
                        })
                    })

                },
            };
        }
    }
})