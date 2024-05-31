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
import { ApiPageConfig } from "../../api/pageConfig.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            object.token = (_a = object.token) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.token, {
                            hover: false,
                            option: [],
                            title: "取得TOKEN"
                        })
                    ].join('');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const appList = yield ApiPageConfig.getAppList(undefined, (yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.token, subData: subData, element: element
                        })));
                        resolve(appList.response.result);
                    }));
                }
            };
        }
    };
});
