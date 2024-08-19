import { BgWidget } from './bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { StockList } from "../cms-plugin/shopping-product-stock.js";
const html = String.raw;
export class BgProduct {
    static variantsSelector(obj) {
        let add_items = [];
        return obj.gvc.glitter.innerDialog((gvc) => {
            return `  <div class="bg-white shadow rounded-3 ">
  <div class="px-3" style="max-height: calc(100vh - 100px);overflow-y: auto;">${StockList.main(gvc, {
                title: '選擇商品', select_data: add_items, select_mode: true, filter_variants: obj.filter_variants
            })}</div>
   <div class="c_dialog_bar">
                                                ${BgWidget.cancel(obj.gvc.event(() => {
                gvc.closeDialog();
            }))}
                                                ${BgWidget.save(obj.gvc.event(() => {
                obj.callback(add_items);
                gvc.closeDialog();
            }), '確認')}
                                            </div>
</div>
`;
        }, 'productsDialog');
    }
    static productsDialog(obj) {
        return obj.gvc.glitter.innerDialog((gvc) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: BgWidget.getCheckedClass(gvc),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [],
                query: '',
                orderString: '',
            };
            return html `
                <div class="bg-white shadow rounded-3"
                     style="overflow-y: auto;${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 90vw; max-width: 92.5vw;'}">
                    ${obj.gvc.bindView({
                bind: vm.id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return BgWidget.spinner();
                    }
                    return html `
                                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                                    <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                        <div class="tx_700">${(_a = obj.title) !== null && _a !== void 0 ? _a : '產品列表'}</div>
                                        <div class="flex-fill"></div>
                                        <i
                                                class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                                onclick="${gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                    })}"
                                        ></i>
                                    </div>
                                    <div class="c_dialog">
                                        <div class="c_dialog_body">
                                            <div class="c_dialog_main" style="gap: 24px; max-height: 500px;">
                                                <div class="d-flex" style="gap: 12px;">
                                                    ${BgWidget.searchFilter(gvc.event((e, event) => {
                        vm.query = e.value;
                        vm.loading = true;
                        obj.gvc.notifyDataChange(vm.id);
                    }), vm.query || '', '搜尋')}
                                                    ${BgWidget.updownFilter({
                        gvc,
                        callback: (value) => {
                            vm.orderString = value;
                            vm.loading = true;
                            obj.gvc.notifyDataChange(vm.id);
                        },
                        default: vm.orderString || 'default',
                        options: FilterOptions.productOrderBy,
                    })}
                                                </div>
                                                ${obj.gvc.map(vm.options.map((opt, index) => {
                        const id = gvc.glitter.getUUID();
                        function call() {
                            if (obj.default.includes(opt.key)) {
                                obj.default = obj.default.filter((item) => item !== opt.key);
                            }
                            else {
                                obj.default.push(opt.key);
                            }
                            gvc.notifyDataChange(id);
                        }
                        return gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    return html `<input
                                                                                class="form-check-input mt-0 ${vm.checkClass}"
                                                                                type="checkbox"
                                                                                id="${opt.key}"
                                                                                name="radio_${vm.id}_${index}"
                                                                                onclick="${obj.gvc.event(() => call())}"
                                                                                ${obj.default.includes(opt.key) ? 'checked' : ''}
                                                                        />
                                                                        <div class="d-flex align-items-center form-check-label c_updown_label cursor_pointer gap-3"
                                                                             onclick="${obj.gvc.event(() => call())}">
                                                                            ${BgWidget.validImageBox({
                                        gvc: gvc,
                                        image: opt.image,
                                        width: 40
                                    })}
                                                                            <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                                ${opt.value}
                                                                            </div>
                                                                            ${opt.note ? html `
                                                                                <div class="tx_gray_12">${opt.note}
                                                                                </div> ` : ''}
                                                                        </div>`;
                                },
                                divCreate: {
                                    class: `d-flex align-items-center`,
                                    style: `gap: 24px`,
                                },
                            };
                        });
                    }))}
                                            </div>
                                            <div class="c_dialog_bar">
                                                ${BgWidget.cancel(obj.gvc.event(() => {
                        obj.callback([]);
                        gvc.closeDialog();
                    }), '清除全部')}
                                                ${BgWidget.cancel(obj.gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                    }))}
                                                ${BgWidget.save(obj.gvc.event(() => {
                        obj.callback(obj.default.filter((item) => {
                            return vm.options.find((opt) => opt.key === item);
                        }));
                        gvc.closeDialog();
                    }), '確認')}
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                },
                onCreate: () => {
                    if (vm.loading) {
                        ApiShop.getProduct({
                            page: 0,
                            limit: 99999,
                            search: vm.query,
                            orderBy: (() => {
                                switch (vm.orderString) {
                                    case 'max_price':
                                    case 'min_price':
                                        return vm.orderString;
                                    default:
                                        return '';
                                }
                            })(),
                        }).then((data) => {
                            vm.options = data.response.data.map((product) => {
                                var _a;
                                return {
                                    key: product.content.id,
                                    value: product.content.title,
                                    image: (_a = product.content.preview_image[0]) !== null && _a !== void 0 ? _a : BgWidget.noImageURL,
                                };
                            });
                            vm.loading = false;
                            obj.gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            })}
                </div>`;
        }, 'productsDialog');
    }
    static collectionsDialog(obj) {
        return obj.gvc.glitter.innerDialog((gvc) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: BgWidget.getCheckedClass(obj.gvc),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [],
                query: '',
                orderString: '',
            };
            return html `
                <div class="bg-white shadow rounded-3"
                     style="overflow-y: auto;${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 90vw; max-width: 92.5vw;'}">
                    ${obj.gvc.bindView({
                bind: vm.id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return BgWidget.spinner();
                    }
                    return html `
                                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                                    <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                        <div class="tx_700">${(_a = obj.title) !== null && _a !== void 0 ? _a : '商品分類'}</div>
                                        <div class="flex-fill"></div>
                                        <i
                                                class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                                onclick="${gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                    })}"
                                        ></i>
                                    </div>
                                    <div class="c_dialog">
                                        <div class="c_dialog_body">
                                            <div class="c_dialog_main" style="gap: 24px; max-height: 500px;">
                                                <div class="d-flex" style="gap: 12px;">
                                                    ${BgWidget.searchFilter(gvc.event((e, event) => {
                        vm.query = e.value;
                        vm.loading = true;
                        obj.gvc.notifyDataChange(vm.id);
                    }), vm.query || '', '搜尋')}
                                                </div>
                                                ${obj.gvc.map(vm.options.map((opt) => {
                        function call() {
                            if (obj.default.includes(opt.key)) {
                                obj.default = obj.default.filter((item) => item !== opt.key);
                            }
                            else {
                                obj.default.push(opt.key);
                            }
                            obj.gvc.notifyDataChange(vm.id);
                        }
                        return html `
                                                                <div class="d-flex align-items-center"
                                                                     style="gap: 24px">
                                                                    <input
                                                                            class="form-check-input mt-0 ${vm.checkClass}"
                                                                            type="checkbox"
                                                                            id="${opt.key}"
                                                                            name="radio_${vm.id}"
                                                                            onclick="${obj.gvc.event(() => call())}"
                                                                            ${obj.default.includes(opt.key) ? 'checked' : ''}
                                                                    />
                                                                    <div class="d-flex align-items-center form-check-label c_updown_label cursor_pointer gap-3"
                                                                         onclick="${obj.gvc.event(() => call())}">
                                                                        <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                            ${opt.value}
                                                                        </div>
                                                                        ${opt.note ? html `
                                                                            <div class="tx_gray_12">${opt.note}
                                                                            </div> ` : ''}
                                                                    </div>
                                                                </div>`;
                    }))}
                                            </div>
                                            <div class="c_dialog_bar">
                                                ${BgWidget.cancel(obj.gvc.event(() => {
                        obj.callback([]);
                        gvc.closeDialog();
                    }), '清除全部')}
                                                ${BgWidget.cancel(obj.gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                    }))}
                                                ${BgWidget.save(obj.gvc.event(() => {
                        obj.callback(obj.default.filter((item) => {
                            return vm.options.find((opt) => opt.key === item);
                        }));
                        gvc.closeDialog();
                    }), '確認')}
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                },
                onCreate: () => {
                    if (vm.loading) {
                        this.getCollectionAllOpts(vm.options, () => {
                            vm.loading = false;
                            obj.gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            })}
                </div>`;
        }, 'collectionsDialog');
    }
    static replaceAngle(text) {
        return text.replace(/\//g, html `<i class="fa-solid fa-angle-right mx-1"></i>`);
    }
}
BgProduct.getProductOpts = (def) => {
    return new Promise((resolve) => {
        if (!def || def.length === 0) {
            resolve([]);
            return;
        }
        ApiShop.getProduct({
            page: 0,
            limit: 99999,
            id_list: def.map((d) => `'${d}'`).join(','),
        }).then((data) => {
            resolve(data.response.data.map((product) => {
                var _a;
                return {
                    key: product.content.id,
                    value: product.content.title,
                    image: (_a = product.content.preview_image[0]) !== null && _a !== void 0 ? _a : BgWidget.noImageURL,
                };
            }));
        });
    });
};
BgProduct.getCollectionAllOpts = (options, callback) => {
    function cc(cols, pre) {
        var _a;
        const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
        options.push({ key: str, value: BgProduct.replaceAngle(str), image: BgWidget.noImageURL });
        for (const col of (_a = cols.array) !== null && _a !== void 0 ? _a : []) {
            cc(col, str);
        }
    }
    ApiShop.getCollection().then((data) => {
        for (const value of data.response.value) {
            cc(value, '');
        }
        callback();
    });
};
BgProduct.getCollectiosOpts = (def) => {
    const opts = [];
    function cc(cols, pre) {
        var _a;
        const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
        def.includes(str) && opts.push({ key: str, value: BgProduct.replaceAngle(str), image: BgWidget.noImageURL });
        for (const col of (_a = cols.array) !== null && _a !== void 0 ? _a : []) {
            cc(col, str);
        }
    }
    return new Promise((resolve) => {
        ApiShop.getCollection().then((data) => {
            for (const value of data.response.value) {
                cc(value, '');
            }
            resolve(opts);
        });
    });
};
