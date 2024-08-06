var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { ApiShop } from "../../glitter-base/route/shopping.js";
import { BgWidget } from "../../backend-manager/bg-widget.js";
import { BgProduct } from "../../backend-manager/bg-product.js";
export class ProductSelect {
    static getData(bundle) {
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
                                bundle.callback(bundle.formData[bundle.key]);
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
    }
    static getProducts(bundle) {
        const html = String.raw;
        const gvc = bundle.gvc;
        if ((Array.isArray(bundle.formData[bundle.key])) || (typeof bundle.formData[bundle.key] !== 'object')) {
            bundle.formData[bundle.key] = {
                select: 'product'
            };
        }
        const subVM = {
            dataList: [],
            id: gvc.glitter.getUUID()
        };
        return gvc.bindView(() => {
            return {
                bind: subVM.id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        subVM.dataList = yield (() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                switch (bundle.formData[bundle.key].select) {
                                    case 'product':
                                        return yield BgProduct.getProductOpts(bundle.formData[bundle.key].value);
                                    case 'collection':
                                        return bundle.formData[bundle.key].value;
                                    default:
                                        return [];
                                }
                            }
                            catch (e) {
                                return [];
                            }
                        }))();
                        resolve(`<div class="d-flex flex-column py-2 my-2 border-top" style="gap: 18px;">
                <div class="d-flex align-items-center gray-bottom-line-18 pb-2"
                     style="gap: 10px; justify-content: space-between;">
<div class="flex-fill">${EditorElem.select({
                            title: bundle.title,
                            gvc: gvc,
                            def: bundle.formData[bundle.key].select,
                            array: [
                                { value: 'collection', title: '商品系列' },
                                { value: 'product', title: '單一商品' },
                                { value: 'all', title: '所有商品' }
                            ],
                            callback: (text) => {
                                bundle.formData[bundle.key].select = text;
                                bundle.formData[bundle.key].value = [];
                                gvc.notifyDataChange(subVM.id);
                            },
                        })}</div>
                   <div class="${bundle.formData[bundle.key].select === 'all' ? `d-none` : ``}" style="margin-top: 30px;">
                    ${BgWidget.grayButton((() => {
                            switch (bundle.formData[bundle.key].select) {
                                case 'product':
                                    return `選取`;
                                case "collection":
                                    return `選取`;
                            }
                            return ``;
                        })(), gvc.event(() => {
                            var _a, _b;
                            if (bundle.formData[bundle.key].select === 'product') {
                                bundle.formData[bundle.key].value = (_a = bundle.formData[bundle.key].value) !== null && _a !== void 0 ? _a : [];
                                BgProduct.productsDialog({
                                    gvc: gvc,
                                    default: bundle.formData[bundle.key].value,
                                    callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                        bundle.formData[bundle.key].value = value;
                                        bundle.callback(bundle.formData[bundle.key].value);
                                        gvc.notifyDataChange(subVM.id);
                                    }),
                                });
                            }
                            else if (bundle.formData[bundle.key].select === 'collection') {
                                bundle.formData[bundle.key].value = (_b = bundle.formData[bundle.key].value) !== null && _b !== void 0 ? _b : [];
                                BgProduct.collectionsDialog({
                                    gvc: gvc,
                                    default: bundle.formData[bundle.key].value,
                                    callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                        bundle.formData[bundle.key].value = value;
                                        bundle.callback(bundle.formData[bundle.key].value);
                                        gvc.notifyDataChange(subVM.id);
                                    }),
                                });
                            }
                        }), { textStyle: 'font-weight: 400;' })}
</div>
                </div>
                ${gvc.map(subVM.dataList.map((opt, index) => {
                            switch (bundle.formData[bundle.key].select) {
                                case "collection":
                                    return `<div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                        <span class="tx_normal">${index + 1}. ${opt}</span>
                                                                                                    </div>`;
                                case "product":
                                    return html `
                                    <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                        <span class="tx_normal">${index + 1}.</span>
                                        <div
                                                style="
                                                                                                    width: 40px;
                                                                                                    height: 40px;
                                                                                                    border-radius: 5px;
                                                                                                    background-color: #fff;
                                                                                                    background-image: url('${opt.image}');
                                                                                                    background-position: center center;
                                                                                                    background-size: contain;
                                                                                                "
                                        ></div>
                                        <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                        ${opt.note ? html `
                                            <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                    </div>`;
                                case "all":
                                    return ``;
                            }
                        }))}
            </div>`);
                    }));
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, ProductSelect);
