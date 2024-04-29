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
        const vm = {
            title: ''
        };
        ApiShop.getProduct({
            page: 0,
            limit: 50,
            id: bundle.formData[bundle.key]
        }).then((data) => {
            if (data.result && data.response.result) {
                vm.title = (data.response.data.content.title);
            }
            else {
                vm.title = ('');
            }
            bundle.gvc.notifyDataChange(id);
        });
        return {
            bind: id,
            view: () => {
                return EditorElem.searchInputDynamic({
                    title: '搜尋商品',
                    gvc: bundle.gvc,
                    def: vm.title,
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
                            bundle.formData['product_title'] = text;
                            bundle.formData[bundle.key] = data.response.data.find((dd) => {
                                return dd.content.title === text;
                            }).id;
                        });
                    },
                    placeHolder: '請輸入商品名稱'
                });
            },
            divCreate: {
                style: ''
            }
        };
    });
});
