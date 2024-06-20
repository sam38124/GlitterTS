var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { getInitialData } from "../../official_view_component/initial_data.js";
import { ApiPost } from "../../glitter-base/route/post.js";
import { WebConfigSetting } from "../../cms-plugin/web-config-setting.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            object.tag = (_a = object.tag) !== null && _a !== void 0 ? _a : {};
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
            });
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    TriggerEvent.editer(gvc, widget, object.tag, {
                                        hover: false,
                                        option: [],
                                        title: "配置檔標籤"
                                    })
                                ].join('');
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const tag = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.tag, subData: subData
                        });
                        ApiPost.getManagerPost({
                            page: 0,
                            limit: 20,
                            type: WebConfigSetting.tag,
                            search: [`key-|>${tag}`]
                        }).then((data) => {
                            resolve(data.response.data[0]);
                        });
                    }));
                },
            };
        },
    };
});
