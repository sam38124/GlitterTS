import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {GlobalData} from "../event.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {component} from "../../official_view_component/official/component.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.coverData = object.coverData ?? {}
            return {
                editor: () => {
                    const id = gvc.glitter.getUUID()
                    const glitter = gvc.glitter

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

                                return [`<select
                                            class="form-select form-control mt-2"
                                            onchange="${gvc.event((e) => {
                                    object.link = (window as any).$(e).val();
                                })}"
                                        >
                                            ${GlobalData.data.pageList.map((dd: any) => {
                                    object.link = object.link ?? dd.tag;
                                    return /*html*/ `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${dd.group}-${dd.name}
                                                </option>`;
                                })}
                                        </select>`, TriggerEvent.editer(gvc, widget, object.coverData, {
                                    hover: true,
                                    option: [],
                                    title: "夾帶資料"
                                })].join('<div class="my-2"></div>')
                            },
                            divCreate: {}
                        }
                    })
                },
                event: () => {
                    subData = subData ?? {}

                    return new Promise(async (resolve, reject) => {
                        const data = await TriggerEvent.trigger({
                            gvc, widget, clickEvent: object.coverData, subData
                        })
                        gvc.glitter.innerDialog((gvc: GVC) => {
                            gvc.getBundle().carryData = data
                            return new Promise<string>(async (resolve, reject) => {
                                const view = await component.render(gvc, ({
                                    data: {
                                        tag: object.link
                                    }
                                } as any), ([] as any), [], subData).view()
                                resolve(view)
                            })

                        }, gvc.glitter.getUUID(), {
                            dismiss: () => {
                                resolve(true)
                            }
                        })
                    })


                }
            }
        }
    }
})