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
import { FileSystemGet } from "../../modules/file-system-get.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a;
            object.id_from = (_a = object.id_from) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    let view = [];
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                view.push(TriggerEvent.editer(gvc, widget, object.id_from, { title: '文本ID來源', hover: false, option: [] }));
                                return view.join('');
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const id = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.id_from,
                            subData: subData
                        });
                        const text_array = yield FileSystemGet.getFile({
                            id: id,
                            key: 'text-manager'
                        });
                        resolve(text_array);
                    }));
                },
            };
        },
    };
});
