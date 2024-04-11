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
import { GlobalData } from "../event.js";
import { component } from "../../official_view_component/official/component.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { EditorConfig } from "../../editor-config.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c;
            object.coverData = (_a = object.coverData) !== null && _a !== void 0 ? _a : {};
            object.dialogTag = (_b = object.dialogTag) !== null && _b !== void 0 ? _b : {};
            object.waitType = (_c = object.waitType) !== null && _c !== void 0 ? _c : 'block';
            return {
                editor: () => {
                    const id = gvc.glitter.getUUID();
                    const glitter = gvc.glitter;
                    function recursive() {
                        if (GlobalData.data.pageList.length === 0) {
                            GlobalData.data.run();
                            setTimeout(() => {
                                recursive();
                            }, 200);
                        }
                        else {
                            gvc.notifyDataChange(id);
                        }
                    }
                    recursive();
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                object.select_page_type = object.select_page_type || 'page';
                                return [
                                    EditorElem.select({
                                        title: '嵌入類型',
                                        gvc: gvc,
                                        def: '',
                                        array: EditorConfig.page_type_list,
                                        callback: (text) => {
                                            object.select_page_type = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    EditorElem.pageSelect(gvc, '', object.link, (tag) => {
                                        object.link = tag;
                                    }, (data) => {
                                        return data.page_type === object.select_page_type;
                                    }), TriggerEvent.editer(gvc, widget, object.coverData, {
                                        hover: true,
                                        option: [],
                                        title: "夾帶資料"
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.dialogTag, {
                                        hover: true,
                                        option: [],
                                        title: "視窗標籤"
                                    }),
                                    EditorElem.select({
                                        title: "是否阻塞事件，直到視窗關閉?",
                                        gvc: gvc,
                                        def: object.waitType,
                                        array: [
                                            {
                                                title: '是',
                                                value: 'block'
                                            },
                                            {
                                                title: '否',
                                                value: 'async'
                                            }
                                        ],
                                        callback: (text) => {
                                            object.waitType = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    })
                                ].join('<div class="my-2"></div>');
                            },
                            divCreate: {}
                        };
                    });
                },
                event: () => {
                    subData = subData !== null && subData !== void 0 ? subData : {};
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const data = yield TriggerEvent.trigger({
                            gvc, widget, clickEvent: object.coverData, subData
                        });
                        const tag = (yield TriggerEvent.trigger({
                            gvc, widget, clickEvent: object.dialogTag, subData
                        })) || gvc.glitter.getUUID();
                        gvc.glitter.innerDialog((gvc) => {
                            gvc.getBundle().carryData = data;
                            return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                const view = component.render(gvc, {
                                    data: {
                                        tag: object.link
                                    }
                                }, [], [], subData).view();
                                resolve(view);
                            }));
                        }, tag, {
                            dismiss: () => {
                                resolve(true);
                            }
                        });
                        if (object.waitType !== 'block') {
                            resolve(true);
                        }
                    }));
                }
            };
        }
    };
});
