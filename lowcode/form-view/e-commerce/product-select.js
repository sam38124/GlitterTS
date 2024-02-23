var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreateForm } from "../create-form.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { ApiShop } from "../../glitter-base/route/shopping.js";
CreateForm.setFormModule(import.meta.url, (bundle) => {
    var _a;
    const glitter = bundle.gvc.glitter;
    bundle.formData[bundle.key] = (_a = bundle.formData[bundle.key]) !== null && _a !== void 0 ? _a : '';
    return bundle.gvc.bindView(() => {
        const id = glitter.getUUID();
        let interval = 0;
        function refresh() {
            bundle.gvc.notifyDataChange(id);
        }
        return {
            bind: id,
            view: () => {
                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                    const title = yield new Promise((resolve, reject) => {
                        ApiShop.getProduct({
                            page: 0,
                            limit: 50,
                            id: bundle.formData[bundle.key]
                        }).then((data) => {
                            if (data.result && data.response.result) {
                                resolve(data.response.data.content.title);
                            }
                            else {
                                resolve('');
                            }
                        });
                    });
                    resolve(EditorElem.searchInputDynamic({
                        title: '搜尋商品',
                        gvc: bundle.gvc,
                        def: title,
                        search: (text, callback) => {
                            clearInterval(interval);
                            interval = setTimeout(() => {
                                ApiShop.getProduct({
                                    page: 0,
                                    limit: 50,
                                    search: ''
                                }).then((data) => {
                                    callback(data.response.data.map((dd) => {
                                        return dd.content.title;
                                    }));
                                });
                            }, 100);
                        },
                        callback: (text) => {
                            ApiShop.getProduct({
                                page: 0,
                                limit: 50,
                                search: text
                            }).then((data) => {
                                bundle.formData[bundle.key] = data.response.data.find((dd) => {
                                    return dd.content.title === text;
                                }).id;
                            });
                        },
                        placeHolder: '請輸入商品名稱'
                    }));
                }));
            },
            divCreate: {
                style: 'min-height:200px;'
            }
        };
    });
});
