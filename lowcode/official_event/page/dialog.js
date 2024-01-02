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
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            object.coverData = (_a = object.coverData) !== null && _a !== void 0 ? _a : {};
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
                                return [`<select
                                            class="form-select form-control mt-2"
                                            onchange="${gvc.event((e) => {
                                        object.link = window.$(e).val();
                                    })}"
                                        >
                                            ${GlobalData.data.pageList.map((dd) => {
                                        var _a;
                                        object.link = (_a = object.link) !== null && _a !== void 0 ? _a : dd.tag;
                                        return `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${dd.group}-${dd.name}
                                                </option>`;
                                    })}
                                        </select>`, TriggerEvent.editer(gvc, widget, object.coverData, {
                                        hover: true,
                                        option: [],
                                        title: "夾帶資料"
                                    })].join('<div class="my-2"></div>');
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
                        gvc.glitter.innerDialog((gvc) => {
                            gvc.getBundle().carryData = data;
                            return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                const view = yield component.render(gvc, {
                                    data: {
                                        tag: object.link
                                    }
                                }, [], [], subData).view();
                                resolve(view);
                            }));
                        }, gvc.glitter.getUUID(), {
                            dismiss: () => {
                                resolve(true);
                            }
                        });
                    }));
                }
            };
        }
    };
});
