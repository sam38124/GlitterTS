import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {getInitialData} from "../../official_view_component/initial_data.js";
import {ApiPost} from "../../glitter-base/route/post.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.tag = object.tag ?? {}
            object.data = object.data ?? {}
            object.form_title = object.form_title ?? {}
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID()
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    TriggerEvent.editer(gvc, widget, object.tag, {
                                        hover: false,
                                        option: [],
                                        title: "配置檔來源"
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.data, {
                                        hover: false,
                                        option: [],
                                        title: "資料內容"
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.form_title, {
                                        hover: false,
                                        option: [],
                                        title: "表單標題"
                                    })
                                ].join(`<div class="my-2"></div>`)
                            }
                        }
                    })

                },
                event: () => {
                    return new Promise(async (resolve, reject) => {

                        const config = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.tag, subData: subData
                        })
                        const data = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.data, subData: subData
                        })
                        const form_title = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.form_title, subData: subData
                        })
                        ApiPost.post({
                            postData: {
                                form_config: config,
                                form_data: data,
                                type: 'post-form-config',
                                form_title: form_title
                            },
                            type: "normal"
                        }).then((data) => {
                            resolve(true)
                        })
                    })
                },
            };
        },
    };
});

