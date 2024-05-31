import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {FormWidget} from "../../official_view_component/official/form.js";
import {getInitialData} from "../../official_view_component/initial_data.js";
import {ApiPost} from "../../glitter-base/route/post.js";
import {WebConfigSetting} from "../../cms-plugin/web-config-setting.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData,element) => {
            object.tag = object.tag ?? {}
            const config = getInitialData({
                obj: object,
                key: 'formSetting',
                def: {
                    array: [
                        {
                            title: '標題', key: '', readonly: 'read', type: 'text', require: "true",
                            style_data: {
                                label: {
                                    class: `form-label fs-base `,
                                    style: ``
                                },
                                input: {
                                    class: ``,
                                    style: ``
                                },
                                container: {
                                    class: ``,
                                    style: ``
                                }
                            }
                        }
                    ],
                    style: {},
                    formID: 'formID',
                    formData: {}
                },
            })
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
                                        title: "配置檔標籤"
                                    })
                                ].join('')
                            }
                        }
                    })

                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        
                        const tag=await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.tag, subData: subData
                        })
                        ApiPost.getManagerPost({
                            page: 0,
                            limit: 20,
                            type: WebConfigSetting.tag,
                            search: [`key-|>${tag}`]
                        }).then((data) => {
                            console.log(`get-web-config`,data.response.data[0])
                            resolve(data.response.data[0])
                        })
                    })
                },
            };
        },
    };
});

