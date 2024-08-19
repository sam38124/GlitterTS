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
import { ApiShop } from "../../glitter-base/route/shopping.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a;
            object.ctype = (_a = object.ctype) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                let map = [
                                    TriggerEvent.editer(gvc, widget, object.ctype, {
                                        hover: false,
                                        option: [],
                                        title: '取得門市類型'
                                    })
                                ];
                                return EditorElem.container(map);
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const ctype = yield TriggerEvent.trigger({ gvc: gvc, widget: widget, clickEvent: object.ctype, subData: subData });
                        ApiShop.selectC2cMap({
                            returnURL: location.href,
                            logistics: ctype
                        }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            $('body').html(res.response.form);
                            document.querySelector('#submit').click();
                            localStorage.setItem('block-refresh-cart', 'true');
                        }));
                    }));
                },
            };
        },
    };
});
