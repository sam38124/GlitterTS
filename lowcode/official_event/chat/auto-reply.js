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
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            object.who = (_a = object.who) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.who, {
                            hover: false,
                            option: [],
                            title: "取得USER_ID"
                        })
                    ].join('');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        const who = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.who
                        });
                        resolve((_a = ((yield ApiUser.getPublicConfig('robot_auto_reply', who)).response.value.question)) !== null && _a !== void 0 ? _a : []);
                    }));
                }
            };
        }
    };
});
