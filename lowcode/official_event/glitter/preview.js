var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    var _a;
                    object.comefrom = (_a = object.comefrom) !== null && _a !== void 0 ? _a : {};
                    return TriggerEvent.editer(gvc, widget, object.comefrom, {
                        hover: false,
                        option: [],
                        title: '預覽專案來源'
                    });
                },
                event: () => {
                    const saasConfig = window.saasConfig;
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const createAPP = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.comefrom,
                            subData: subData,
                        });
                        const url = new URL(location.href);
                        url.searchParams.set('appName', createAPP);
                        gvc.glitter.openNewTab(url.href);
                        resolve(true);
                    }));
                }
            };
        }
    };
});
