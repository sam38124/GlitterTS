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
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        ApiShop.getCart().then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            let total = 0;
                            for (const b of Object.keys(res)) {
                                const pd = (yield ApiShop.getProduct({ limit: 50, page: 0, id: b.split('-')[0] })).response.data.content;
                                const vard = pd.variants.find((d2) => {
                                    return `${pd.id}-${d2.spec.join('-')}` === b;
                                });
                                total += parseInt(res[b], 10);
                            }
                            resolve(total);
                        }));
                    }));
                },
            };
        },
    };
});
