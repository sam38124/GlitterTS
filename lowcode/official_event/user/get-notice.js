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
import { ApiUser } from "../../glitter-base/route/user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.page = (_a = object.page) !== null && _a !== void 0 ? _a : {};
            object.limit = (_b = object.limit) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.page, { title: "當前頁面", hover: false, option: [] }),
                        TriggerEvent.editer(gvc, widget, object.limit, { title: "每頁筆數", hover: false, option: [] }),
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        let page = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.page,
                            subData: subData
                        });
                        const limit = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.limit,
                            subData: subData
                        });
                        const data = (yield ApiUser.getNotice({
                            page: page,
                            limit: limit
                        })).response;
                        console.log(`notice_data->`, data);
                        resolve(data);
                    }));
                },
            };
        },
    };
});
