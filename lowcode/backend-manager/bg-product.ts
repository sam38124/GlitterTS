import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from './bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';

const html = String.raw;
export const noImageURL = 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png';

export type OptionsItem = {
    key: number | string;
    value: string;
    image: string;
    note?: string;
};

type CollectionItem = {
    title: string;
    array: CollectionItem[];
};

export class BgProduct {
    static productsDialog(obj: { gvc: GVC; title?: string; default: (number | string)[]; callback: (value: any) => void }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: BgWidget.randomString(5),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [] as OptionsItem[],
                query: '',
                orderString: '',
            };

            obj.gvc.addStyle(`
                .${vm.checkClass}:checked[type='checkbox'] {
                    border: 2px solid #000;
                    background-color: #fff;
                    background-image: url(${BgWidget.checkedDataImage('#000')});
                    background-position: center center;
                }
            `);

            return html`<div class="bg-white shadow rounded-3" style="min-width: 400px; width: 600px; overflow-y: auto;">
                ${obj.gvc.bindView({
                    bind: vm.id,
                    view: () => {
                        if (vm.loading) {
                            return BgWidget.spinner();
                        }
                        return html`<div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                <div class="tx_700">${obj.title ?? '產品列表'}</div>
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
                                            ${BgWidget.searchFilter(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    vm.loading = true;
                                                    obj.gvc.notifyDataChange(vm.id);
                                                }),
                                                vm.query || '',
                                                '搜尋'
                                            )}
                                            ${BgWidget.updownFilter({
                                                gvc,
                                                callback: (value: any) => {
                                                    vm.orderString = value;
                                                    vm.loading = true;
                                                    obj.gvc.notifyDataChange(vm.id);
                                                },
                                                default: vm.orderString || 'default',
                                                options: FilterOptions.productOrderBy,
                                            })}
                                        </div>
                                        ${obj.gvc.map(
                                            vm.options.map((opt) => {
                                                function call() {
                                                    if (obj.default.includes(opt.key)) {
                                                        obj.default = obj.default.filter((item) => item !== opt.key);
                                                    } else {
                                                        obj.default.push(opt.key);
                                                    }
                                                    obj.gvc.notifyDataChange(vm.id);
                                                }
                                                return html`<div class="d-flex align-items-center" style="gap: 24px">
                                                    <input
                                                        class="form-check-input mt-0 ${vm.checkClass}"
                                                        type="checkbox"
                                                        id="${opt.key}"
                                                        name="radio_${vm.id}"
                                                        onclick="${obj.gvc.event(() => call())}"
                                                        ${obj.default.includes(opt.key) ? 'checked' : ''}
                                                    />
                                                    <div class="d-flex align-items-center form-check-label c_updown_label cursor_pointer gap-3" onclick="${obj.gvc.event(() => call())}">
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
                                                        ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                    </div>
                                                </div>`;
                                            })
                                        )}
                                    </div>
                                    <div class="c_dialog_bar">
                                        ${BgWidget.cancel(
                                            obj.gvc.event(() => {
                                                obj.callback([]);
                                                gvc.closeDialog();
                                            }),
                                            '清除全部'
                                        )}
                                        ${BgWidget.cancel(
                                            obj.gvc.event(() => {
                                                obj.callback(vm.def);
                                                gvc.closeDialog();
                                            })
                                        )}
                                        ${BgWidget.save(
                                            obj.gvc.event(() => {
                                                obj.callback(
                                                    obj.default.filter((item) => {
                                                        return vm.options.find((opt: OptionsItem) => opt.key === item);
                                                    })
                                                );
                                                gvc.closeDialog();
                                            }),
                                            '確認'
                                        )}
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
                                vm.options = data.response.data.map((product: { content: { id: number; title: string; preview_image: string[] } }) => {
                                    return {
                                        key: product.content.id,
                                        value: product.content.title,
                                        image: product.content.preview_image[0] ?? noImageURL,
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

    static getProductOpts = (def: (number | string)[]) => {
        return new Promise<OptionsItem[]>((resolve) => {
            ApiShop.getProduct({
                page: 0,
                limit: 99999,
                id_list: def.map((d) => `'${d}'`).join(','),
            }).then((data) => {
                resolve(
                    data.response.data.map((product: { content: { id: number; title: string; preview_image: string[] } }) => {
                        return {
                            key: product.content.id,
                            value: product.content.title,
                            image: product.content.preview_image[0] ?? noImageURL,
                        };
                    })
                );
            });
        });
    };

    static collectionsDialog(obj: { gvc: GVC; title?: string; default: (number | string)[]; callback: (value: any) => void }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: BgWidget.randomString(5),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [] as OptionsItem[],
                query: '',
                orderString: '',
            };

            obj.gvc.addStyle(`
                .${vm.checkClass}:checked[type='checkbox'] {
                    border: 2px solid #000;
                    background-color: #fff;
                    background-image: url(${BgWidget.checkedDataImage('#000')});
                    background-position: center center;
                }
            `);

            return html`<div class="bg-white shadow rounded-3" style="min-width: 400px; width: 600px; overflow-y: auto;">
                ${obj.gvc.bindView({
                    bind: vm.id,
                    view: () => {
                        if (vm.loading) {
                            return BgWidget.spinner();
                        }
                        return html`<div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                <div class="tx_700">${obj.title ?? '產品列表'}</div>
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
                                            ${BgWidget.searchFilter(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    vm.loading = true;
                                                    obj.gvc.notifyDataChange(vm.id);
                                                }),
                                                vm.query || '',
                                                '搜尋'
                                            )}
                                        </div>
                                        ${obj.gvc.map(
                                            vm.options.map((opt: OptionsItem) => {
                                                function call() {
                                                    if (obj.default.includes(opt.key)) {
                                                        obj.default = obj.default.filter((item) => item !== opt.key);
                                                    } else {
                                                        obj.default.push(opt.key);
                                                    }
                                                    obj.gvc.notifyDataChange(vm.id);
                                                }
                                                return html`<div class="d-flex align-items-center" style="gap: 24px">
                                                    <input
                                                        class="form-check-input mt-0 ${vm.checkClass}"
                                                        type="checkbox"
                                                        id="${opt.key}"
                                                        name="radio_${vm.id}"
                                                        onclick="${obj.gvc.event(() => call())}"
                                                        ${obj.default.includes(opt.key) ? 'checked' : ''}
                                                    />
                                                    <div class="d-flex align-items-center form-check-label c_updown_label cursor_pointer gap-3" onclick="${obj.gvc.event(() => call())}">
                                                        <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                        ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                    </div>
                                                </div>`;
                                            })
                                        )}
                                    </div>
                                    <div class="c_dialog_bar">
                                        ${BgWidget.cancel(
                                            obj.gvc.event(() => {
                                                obj.callback([]);
                                                gvc.closeDialog();
                                            }),
                                            '清除全部'
                                        )}
                                        ${BgWidget.cancel(
                                            obj.gvc.event(() => {
                                                obj.callback(vm.def);
                                                gvc.closeDialog();
                                            })
                                        )}
                                        ${BgWidget.save(
                                            obj.gvc.event(() => {
                                                obj.callback(
                                                    obj.default.filter((item) => {
                                                        return vm.options.find((opt: OptionsItem) => opt.key === item);
                                                    })
                                                );
                                                gvc.closeDialog();
                                            }),
                                            '確認'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    },
                    onCreate: () => {
                        if (vm.loading) {
                            function cc(cols: CollectionItem, pre: string) {
                                const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
                                vm.options.push({ key: str, value: str, image: noImageURL });
                                for (const col of cols.array ?? []) {
                                    cc(col, str);
                                }
                            }

                            ApiShop.getCollection().then((data) => {
                                for (const value of data.response.value) {
                                    cc(value, '');
                                }
                                vm.loading = false;
                                obj.gvc.notifyDataChange(vm.id);
                            });
                        }
                    },
                })}
            </div>`;
        }, 'collectionsDialog');
    }

    static getCollectiosOpts = (def: (number | string)[]) => {
        const opts: OptionsItem[] = [];
        function cc(cols: CollectionItem, pre: string) {
            const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
            def.includes(str) && opts.push({ key: str, value: str, image: noImageURL });
            for (const col of cols.array ?? []) {
                cc(col, str);
            }
        }

        return new Promise<OptionsItem[]>((resolve) => {
            ApiShop.getCollection().then((data) => {
                for (const value of data.response.value) {
                    cc(value, '');
                }
                resolve(opts);
            });
        });
    };
}