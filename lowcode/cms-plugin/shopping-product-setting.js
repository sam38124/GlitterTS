var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { BgProduct } from '../backend-manager/bg-product.js';
import { FilterOptions } from './filter-options.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { Tool } from '../modules/tool.js';
import { CheckInput } from '../modules/checkInput.js';
import { imageLibrary } from '../modules/image-library.js';
import { ProductAi } from './ai-generator/product-ai.js';
import { ProductExcel } from './module/product-excel.js';
export class ShoppingProductSetting {
    static main(gvc, type = 'product') {
        const html = String.raw;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const excelHeader = ProductExcel.exampleHeader();
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            dataList: undefined,
            query: '',
            last_scroll: 0,
            queryType: 'title',
            orderString: '',
            filter: {},
            replaceData: '',
            ai_initial: {},
        };
        const rowInitData = {
            name: '',
            status: '',
            category: '',
            productType: ``,
            img: '',
            SEO_domain: '',
            SEO_title: '',
            SEO_desc: '',
            spec1: '',
            spec1Value: '',
            spec2: '',
            spec2Value: '',
            spec3: '',
            spec3Value: '',
            sku: '',
            cost: '',
            sale_price: '',
            compare_price: '',
            benefit: '',
            shipment_type: '',
            length: '',
            width: '',
            height: '',
            weight: '',
            weightUnit: '',
            stockPolicy: '',
            stock: '',
            save_stock: '',
            barcode: '',
        };
        const excel = new ProductExcel(gvc, excelHeader.filter((item) => item !== '商品ID'), Object.keys(rowInitData));
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.productFilterFrame);
        vm.filter = ListComp.getFilterObject();
        return gvc.bindView(() => {
            return {
                dataList: [{ obj: vm, key: 'type' }],
                bind: vm.id,
                view: () => {
                    gvc.addStyle(`
                        input[type='number']::-webkit-outer-spin-button,
                        input[type='number']::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }
                        input[type='number'] {
                            -moz-appearance: textfield;
                        }
                    `);
                    switch (vm.type) {
                        case 'ai-initial':
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'add',
                                product_type: type,
                                initial_data: vm.ai_initial,
                            });
                        case 'add':
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'add',
                                product_type: type,
                            });
                        case 'list':
                            window.parent.glitter.share.checkData = () => true;
                            vm.tableId = gvc.glitter.getUUID();
                            vm.dataList = [];
                            const vmlist = {
                                id: glitter.getUUID(),
                                loading: true,
                                collections: [],
                            };
                            return gvc.bindView({
                                bind: vmlist.id,
                                view: () => {
                                    if (vmlist.loading) {
                                        return '';
                                    }
                                    else {
                                        let importInput = {};
                                        if (FilterOptions.productFunnel.findIndex((item) => item.key === 'collection') === -1) {
                                            FilterOptions.productFunnel.push({
                                                key: 'collection',
                                                type: 'multi_checkbox',
                                                name: '商品分類',
                                                data: vmlist.collections.map((item) => {
                                                    return {
                                                        key: `${item.key}`,
                                                        name: item.value,
                                                    };
                                                }),
                                            });
                                        }
                                        return BgWidget.container(html `
                                                <div class="title-container">
                                                    ${BgWidget.title((() => {
                                            switch (type) {
                                                case 'addProduct':
                                                    return '加購品';
                                                case 'giveaway':
                                                    return '贈品';
                                                case 'product':
                                                    return '商品列表';
                                                case 'hidden':
                                                    return '隱形賣場商品';
                                            }
                                        })())}
                                                    <div class="flex-fill"></div>
                                                    <div style="display: flex; gap: 10px;">
                                                        ${[
                                            BgWidget.grayButton('匯入', gvc.event(() => {
                                                gvc.glitter.innerDialog((gvc) => {
                                                    return gvc.bindView({
                                                        bind: 'importView',
                                                        view: () => {
                                                            return html `
                                                                                    <div
                                                                                        style="display: flex;width:100%;padding: 12px 0 12px 20px;align-items: center;border-radius: 10px 10px 0px 0px;background: #F2F2F2;color:#393939;font-size: 16px;font-weight: 700;"
                                                                                    >
                                                                                        匯入商品
                                                                                    </div>
                                                                                    <div style="display: flex;width: 100%;align-items: flex-start;gap: 16px;padding:20px;flex-direction: column">
                                                                                        <div style="display: flex;align-items: baseline;gap: 12px;align-self: stretch;">
                                                                                            <div style="color:#393939;font-size: 16px;font-weight: 400;">透過XLSX檔案匯入商品</div>
                                                                                            <div
                                                                                                class="cursor_pointer"
                                                                                                style="color: #36B; font-size: 14px; font-style: normal; font-weight: 400; line-height: normal; text-decoration-line: underline;"
                                                                                                onclick="${gvc.event(() => {
                                                                excel.exportData(ProductExcel.exampleSheet(), `範例_商品詳細列表_${ProductExcel.getFileTime()}`);
                                                            })}"
                                                                                            >
                                                                                                下載範例
                                                                                            </div>
                                                                                        </div>
                                                                                        <input
                                                                                            class="d-none"
                                                                                            type="file"
                                                                                            id="upload-excel"
                                                                                            onchange="${gvc.event((e, event) => {
                                                                importInput = event.target;
                                                                gvc.notifyDataChange('importView');
                                                            })}"
                                                                                        />
                                                                                        <div
                                                                                            style="display: flex;justify-content: center;padding: 59px 0px 58px 0px;align-items: center;flex-direction: column;gap: 10px;width: 100%;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                        >
                                                                                            ${(() => {
                                                                if (importInput.files && importInput.files.length > 0) {
                                                                    return html `
                                                                                                        <div
                                                                                                            class="cursor_pointer"
                                                                                                            style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                            onclick="${gvc.event(() => {
                                                                        document.querySelector('#upload-excel').click();
                                                                    })}"
                                                                                                        >
                                                                                                            更換檔案
                                                                                                        </div>
                                                                                                        <div style="color:#8D8D8D;">${importInput.files[0].name}</div>
                                                                                                    `;
                                                                }
                                                                else {
                                                                    return html `
                                                                                                        <div
                                                                                                            class="cursor_pointer"
                                                                                                            style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                            onclick="${gvc.event(() => {
                                                                        document.querySelector('#upload-excel').click();
                                                                    })}"
                                                                                                        >
                                                                                                            新增檔案
                                                                                                        </div>
                                                                                                        <div style="color:#8D8D8D;"></div>
                                                                                                    `;
                                                                }
                                                            })()}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style="display: flex;justify-content: end;padding-right: 20px;padding-bottom: 20px;gap: 14px;">
                                                                                        ${BgWidget.cancel(gvc.event(() => {
                                                                gvc.glitter.closeDiaLog();
                                                            }))}
                                                                                        ${BgWidget.save(gvc.event(() => {
                                                                if (importInput.files && importInput.files.length > 0) {
                                                                    vm.dataList = undefined;
                                                                    excel.importData(vm.tableId, importInput.files[0]);
                                                                }
                                                                else {
                                                                    dialog.infoMessage({ text: '尚未上傳檔案' });
                                                                }
                                                            }), '匯入')}
                                                                                    </div>
                                                                                `;
                                                        },
                                                        divCreate: { style: `border-radius: 10px;background: #FFF;width: 569px;min-height: 368px;max-width: 90%;` },
                                                    });
                                                }, 'import');
                                                return ``;
                                            })),
                                            BgWidget.grayButton('匯出', gvc.event(() => {
                                                gvc.glitter.innerDialog((gvc) => {
                                                    const check = {
                                                        select: 'all',
                                                        file: 'excel',
                                                    };
                                                    return html `
                                                                            <div
                                                                                style="width: 569px; max-width: calc(100% - 20px);height: 408px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;color: #393939;"
                                                                            >
                                                                                <div
                                                                                    class="w-100"
                                                                                    style="padding: 12px 20px;display: flex;align-items: center;font-size: 16px;font-weight: 700;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                >
                                                                                    匯出商品
                                                                                </div>
                                                                                <div class="w-100" style="display: flex;flex-direction: column;align-items: flex-start;gap: 24px;padding: 20px;">
                                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-items: flex-start">
                                                                                        <div>匯出</div>
                                                                                        ${BgWidget.multiCheckboxContainer(gvc, [
                                                        {
                                                            key: 'all',
                                                            name: '全部商品',
                                                        },
                                                        {
                                                            key: 'search',
                                                            name: '目前搜尋與篩選的結果',
                                                        },
                                                        {
                                                            key: 'check',
                                                            name: `勾選的 ${vm.dataList.filter((item) => item.checked).length} 件商品`,
                                                        },
                                                    ], [check.select], (res) => {
                                                        check.select = res[0];
                                                    }, { single: true })}
                                                                                    </div>
                                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-self: stretch;">
                                                                                        <div>匯出為</div>
                                                                                        ${BgWidget.multiCheckboxContainer(gvc, [
                                                        {
                                                            key: 'excel',
                                                            name: 'Excel檔案',
                                                        },
                                                    ], [check.file], (res) => {
                                                        check.file = res[0];
                                                    }, { single: true })}
                                                                                    </div>
                                                                                </div>
                                                                                <div style="display: flex;justify-content: flex-end;align-items: flex-start;gap: 14px;padding: 20px">
                                                                                    ${BgWidget.cancel(gvc.event(() => {
                                                        gvc.glitter.closeDiaLog();
                                                    }))}
                                                                                    ${BgWidget.save(gvc.event(() => {
                                                        if (check.select === 'check' && vm.dataList.filter((item) => item.checked).length === 0) {
                                                            dialog.infoMessage({ text: '請勾選至少一件以上的商品' });
                                                            return;
                                                        }
                                                        dialog.dataLoading({ visible: true });
                                                        const getFormData = (() => {
                                                            var _b, _c, _d;
                                                            switch (check.select) {
                                                                case 'search':
                                                                    return {
                                                                        page: 0,
                                                                        limit: 1000,
                                                                        search: (_b = vm.query) !== null && _b !== void 0 ? _b : '',
                                                                        searchType: (_c = vm.queryType) !== null && _c !== void 0 ? _c : '',
                                                                        orderBy: (_d = vm.orderString) !== null && _d !== void 0 ? _d : '',
                                                                        status: (() => {
                                                                            if (vm.filter.status && vm.filter.status.length > 0) {
                                                                                return vm.filter.status.join(',');
                                                                            }
                                                                            return undefined;
                                                                        })(),
                                                                        collection: vm.filter.collection,
                                                                        accurate_search_collection: true,
                                                                        productType: type,
                                                                    };
                                                                case 'check':
                                                                    return {
                                                                        page: 0,
                                                                        limit: 1000,
                                                                        id_list: vm.dataList
                                                                            .filter((item) => item.checked)
                                                                            .map((item) => item.id),
                                                                        productType: type,
                                                                    };
                                                                case 'all':
                                                                default:
                                                                    return {
                                                                        page: 0,
                                                                        limit: 1000,
                                                                        productType: type,
                                                                    };
                                                            }
                                                        })();
                                                        ApiShop.getProduct(getFormData).then((response) => {
                                                            dialog.dataLoading({ visible: false });
                                                            const expo = new ProductExcel(gvc, excelHeader, Object.keys(rowInitData));
                                                            let exportData = [];
                                                            response.response.data.forEach((productData) => {
                                                                const baseRowData = (index) => {
                                                                    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
                                                                    return ({
                                                                        id: index === 0 ? productData.content.id || '' : '',
                                                                        name: index === 0 ? productData.content.title || '未命名商品' : '',
                                                                        status: index === 0 ? (((_b = productData.content) === null || _b === void 0 ? void 0 : _b.status) === 'draft' ? '草稿' : '啟用') : '',
                                                                        category: index === 0 ? expo.checkString(productData.content.collection.join(' , ')) : '',
                                                                        productType: index === 0 ? expo.checkString(this.getProductTypeString(productData.content)) : '',
                                                                        img: index === 0 ? expo.checkString(productData.content.preview_image[0]) : '',
                                                                        SEO_domain: index === 0 ? expo.checkString((_d = (_c = productData.content) === null || _c === void 0 ? void 0 : _c.seo) === null || _d === void 0 ? void 0 : _d.domain) : '',
                                                                        SEO_title: index === 0 ? expo.checkString((_f = (_e = productData.content) === null || _e === void 0 ? void 0 : _e.seo) === null || _f === void 0 ? void 0 : _f.title) : '',
                                                                        SEO_desc: index === 0 ? expo.checkString((_h = (_g = productData.content) === null || _g === void 0 ? void 0 : _g.seo) === null || _h === void 0 ? void 0 : _h.content) : '',
                                                                        spec1: index === 0 ? expo.checkString((_k = (_j = productData.content) === null || _j === void 0 ? void 0 : _j.specs[0]) === null || _k === void 0 ? void 0 : _k.title) : '',
                                                                        spec1Value: expo.checkString((_l = productData.content.variants[index]) === null || _l === void 0 ? void 0 : _l.spec[0]),
                                                                        spec2: index === 0 ? expo.checkString((_o = (_m = productData.content) === null || _m === void 0 ? void 0 : _m.specs[1]) === null || _o === void 0 ? void 0 : _o.title) : '',
                                                                        spec2Value: expo.checkString((_p = productData.content.variants[index]) === null || _p === void 0 ? void 0 : _p.spec[1]),
                                                                        spec3: index === 0 ? expo.checkString((_r = (_q = productData.content) === null || _q === void 0 ? void 0 : _q.specs[2]) === null || _r === void 0 ? void 0 : _r.title) : '',
                                                                        spec3Value: expo.checkString((_s = productData.content.variants[index]) === null || _s === void 0 ? void 0 : _s.spec[2]),
                                                                        sku: expo.checkString((_t = productData.content.variants[index]) === null || _t === void 0 ? void 0 : _t.sku),
                                                                        cost: expo.checkNumber((_u = productData.content.variants[index]) === null || _u === void 0 ? void 0 : _u.cost),
                                                                        sale_price: expo.checkNumber((_v = productData.content.variants[index]) === null || _v === void 0 ? void 0 : _v.sale_price),
                                                                        compare_price: expo.checkNumber((_w = productData.content.variants[index]) === null || _w === void 0 ? void 0 : _w.compare_price),
                                                                        benefit: expo.checkNumber((_x = productData.content.variants[index]) === null || _x === void 0 ? void 0 : _x.profit),
                                                                        shipment_type: getShipmentType((_y = productData.content.variants[index]) === null || _y === void 0 ? void 0 : _y.shipment_type),
                                                                        length: expo.checkNumber(((_z = productData.content.variants[index]) === null || _z === void 0 ? void 0 : _z.v_length) || 0),
                                                                        width: expo.checkNumber(((_0 = productData.content.variants[index]) === null || _0 === void 0 ? void 0 : _0.v_width) || 0),
                                                                        height: expo.checkNumber(((_1 = productData.content.variants[index]) === null || _1 === void 0 ? void 0 : _1.v_height) || 0),
                                                                        weight: expo.checkNumber(((_2 = productData.content.variants[index]) === null || _2 === void 0 ? void 0 : _2.weight) || 0),
                                                                        weightUnit: expo.checkString(((_3 = productData.content.variants[index]) === null || _3 === void 0 ? void 0 : _3.weightUnit) || 'KG'),
                                                                        stockPolicy: ((_4 = productData.content.variants[index]) === null || _4 === void 0 ? void 0 : _4.show_understocking) === 'true' ? '追蹤' : '不追蹤',
                                                                        stock: expo.checkNumber((_5 = productData.content.variants[index]) === null || _5 === void 0 ? void 0 : _5.stock),
                                                                        save_stock: expo.checkNumber((_6 = productData.content.variants[index]) === null || _6 === void 0 ? void 0 : _6.save_stock),
                                                                        barcode: expo.checkString((_7 = productData.content.variants[index]) === null || _7 === void 0 ? void 0 : _7.barcode),
                                                                    });
                                                                };
                                                                const getShipmentType = (type) => {
                                                                    switch (type) {
                                                                        case 'volume':
                                                                            return '依材積計算';
                                                                        case 'none':
                                                                            return '不計算運費';
                                                                        default:
                                                                            return '依重量計算';
                                                                    }
                                                                };
                                                                productData.content.variants.forEach((variant, index) => {
                                                                    const rowData = baseRowData(index);
                                                                    exportData.push(rowData);
                                                                });
                                                            });
                                                            expo.exportData(exportData, `商品詳細列表_${ProductExcel.getFileTime()}`);
                                                        });
                                                    }), '匯出')}
                                                                                </div>
                                                                            </div>
                                                                        `;
                                                }, 'export');
                                                return;
                                            })),
                                            BgWidget.darkButton('新增', gvc.event(() => {
                                                vm.type = 'add';
                                            }), {
                                                class: `guide5-3`,
                                            }),
                                        ].join('')}
                                                    </div>
                                                </div>
                                                ${BgWidget.container(BgWidget.mainCard([
                                            (() => {
                                                const id = gvc.glitter.getUUID();
                                                return gvc.bindView({
                                                    bind: id,
                                                    view: () => {
                                                        const filterList = [
                                                            BgWidget.selectFilter({
                                                                gvc,
                                                                callback: (value) => {
                                                                    vm.queryType = value;
                                                                    gvc.notifyDataChange(vm.tableId);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                default: vm.queryType || 'title',
                                                                options: FilterOptions.productSelect,
                                                                style: 'min-width: 160px;',
                                                            }),
                                                            BgWidget.searchFilter(gvc.event((e) => {
                                                                vm.query = e.value;
                                                                gvc.notifyDataChange(vm.tableId);
                                                                gvc.notifyDataChange(id);
                                                            }), vm.query || '', '搜尋'),
                                                            BgWidget.funnelFilter({
                                                                gvc,
                                                                callback: () => ListComp.showRightMenu(FilterOptions.productFunnel),
                                                            }),
                                                            BgWidget.updownFilter({
                                                                gvc,
                                                                callback: (value) => {
                                                                    vm.orderString = value;
                                                                    gvc.notifyDataChange(vm.tableId);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                default: vm.orderString || 'default',
                                                                options: FilterOptions.productListOrderBy,
                                                            }),
                                                        ];
                                                        const filterTags = ListComp.getFilterTags(FilterOptions.productFunnel);
                                                        if (document.body.clientWidth < 768) {
                                                            return html ` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                                    <div>${filterList[0]}</div>
                                                                                    <div style="display: flex;">
                                                                                        <div class="me-2">${filterList[2]}</div>
                                                                                        ${filterList[3]}
                                                                                    </div>
                                                                                </div>
                                                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                                                <div>${filterTags}</div>`;
                                                        }
                                                        else {
                                                            return html ` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                                                <div>${filterTags}</div>`;
                                                        }
                                                    },
                                                });
                                            })(),
                                            gvc.bindView({
                                                bind: vm.tableId,
                                                view: () => {
                                                    const limit = 20;
                                                    return BgWidget.tableV3({
                                                        gvc: gvc,
                                                        getData: (vmi) => {
                                                            ApiShop.getProduct({
                                                                page: vmi.page - 1,
                                                                limit: limit,
                                                                search: vm.query || undefined,
                                                                searchType: vm.queryType || undefined,
                                                                orderBy: vm.orderString || undefined,
                                                                status: (() => {
                                                                    if (vm.filter.status && vm.filter.status.length > 0) {
                                                                        return vm.filter.status.join(',');
                                                                    }
                                                                    return undefined;
                                                                })(),
                                                                filter_visible: `${type !== 'hidden'}`,
                                                                collection: vm.filter.collection,
                                                                accurate_search_collection: true,
                                                                productType: type === 'hidden' ? 'product' : type,
                                                            }).then((data) => {
                                                                function getDatalist() {
                                                                    return data.response.data.map((dd) => {
                                                                        var _b;
                                                                        return [
                                                                            {
                                                                                key: '商品',
                                                                                value: html ` <div class="d-flex">
                                                                                                    ${BgWidget.validImageBox({
                                                                                    gvc: gvc,
                                                                                    image: dd.content.preview_image[0],
                                                                                    width: 40,
                                                                                    class: 'rounded border me-4',
                                                                                })}${Tool.truncateString(dd.content.title)}
                                                                                                </div>`,
                                                                            },
                                                                            {
                                                                                key: '售價',
                                                                                value: (() => {
                                                                                    var _b;
                                                                                    const numArray = ((_b = dd.content.variants) !== null && _b !== void 0 ? _b : [])
                                                                                        .map((dd) => {
                                                                                        return parseInt(`${dd.sale_price}`, 10);
                                                                                    })
                                                                                        .filter((dd) => {
                                                                                        return !isNaN(dd);
                                                                                    });
                                                                                    if (numArray.length == 0) {
                                                                                        return '尚未設定';
                                                                                    }
                                                                                    return `$ ${Math.min(...numArray).toLocaleString()}`;
                                                                                })(),
                                                                            },
                                                                            {
                                                                                key: '庫存',
                                                                                value: (() => {
                                                                                    const sum = dd.content.variants.reduce((acc, curr) => acc + curr.stock, 0);
                                                                                    return html `${dd.content.variants.length > 1 ? `${dd.content.variants.length}個子類` : ``}${sum > 1
                                                                                        ? `有${sum}件庫存`
                                                                                        : html `<span style="color:#8E0E2B">有${sum}件庫存</span>`}`;
                                                                                })(),
                                                                            },
                                                                            {
                                                                                key: '已售出',
                                                                                value: ((_b = dd.total_sales) !== null && _b !== void 0 ? _b : '0').toLocaleString(),
                                                                            },
                                                                            {
                                                                                key: '狀態',
                                                                                value: gvc.bindView(() => {
                                                                                    const id = gvc.glitter.getUUID();
                                                                                    return {
                                                                                        bind: id,
                                                                                        view: () => {
                                                                                            if (dd.content.status === 'draft') {
                                                                                                return BgWidget.secondaryInsignia('草稿');
                                                                                            }
                                                                                            if (!dd.content.active_schedule) {
                                                                                                return BgWidget.infoInsignia('上架');
                                                                                            }
                                                                                            const state = ShoppingProductSetting.getTimeState(dd.content.active_schedule);
                                                                                            switch (state) {
                                                                                                case 'afterEnd':
                                                                                                    return BgWidget.secondaryInsignia('下架');
                                                                                                case 'beforeStart':
                                                                                                    return BgWidget.warningInsignia('待上架');
                                                                                                case 'inRange':
                                                                                                    return BgWidget.infoInsignia('上架');
                                                                                                default:
                                                                                                    return BgWidget.secondaryInsignia('草稿');
                                                                                            }
                                                                                        },
                                                                                        divCreate: {
                                                                                            option: [
                                                                                                {
                                                                                                    key: 'onclick',
                                                                                                    value: gvc.event((e, event) => {
                                                                                                        event.stopPropagation();
                                                                                                    }),
                                                                                                },
                                                                                            ],
                                                                                        },
                                                                                    };
                                                                                }),
                                                                            },
                                                                        ].map((dd) => {
                                                                            dd.value = html ` <div style="line-height:40px;">${dd.value}</div>`;
                                                                            return dd;
                                                                        });
                                                                    });
                                                                }
                                                                vm.dataList = data.response.data;
                                                                vmi.pageSize = Math.ceil(data.response.total / limit);
                                                                vmi.originalData = vm.dataList;
                                                                vmi.tableData = getDatalist();
                                                                vmi.loading = false;
                                                                vmi.callback();
                                                            });
                                                        },
                                                        rowClick: (data, index) => {
                                                            vm.replaceData = vm.dataList[index].content;
                                                            vm.type = 'replace';
                                                        },
                                                        filter: [
                                                            {
                                                                name: '啟用',
                                                                event: (checkedData) => {
                                                                    const selCount = checkedData.length;
                                                                    dialog.dataLoading({ visible: true });
                                                                    new Promise((resolve) => {
                                                                        let n = 0;
                                                                        checkedData.map((dd) => {
                                                                            dd.content.status = 'active';
                                                                            function run() {
                                                                                return __awaiter(this, void 0, void 0, function* () {
                                                                                    return ApiPost.put({
                                                                                        postData: dd.content,
                                                                                        token: window.parent.config.token,
                                                                                        type: 'manager',
                                                                                    }).then((res) => {
                                                                                        res.result ? n++ : run();
                                                                                    });
                                                                                });
                                                                            }
                                                                            run();
                                                                        });
                                                                        setInterval(() => {
                                                                            n === selCount && setTimeout(() => resolve(), 200);
                                                                        }, 500);
                                                                    }).then(() => {
                                                                        dialog.dataLoading({ visible: false });
                                                                        gvc.notifyDataChange(vm.id);
                                                                    });
                                                                },
                                                                option: true,
                                                            },
                                                            {
                                                                name: '草稿',
                                                                event: (checkedData) => {
                                                                    const selCount = checkedData.length;
                                                                    dialog.dataLoading({ visible: true });
                                                                    new Promise((resolve) => {
                                                                        let n = 0;
                                                                        checkedData.map((dd) => {
                                                                            dd.content.status = 'draft';
                                                                            function run() {
                                                                                return __awaiter(this, void 0, void 0, function* () {
                                                                                    return ApiPost.put({
                                                                                        postData: dd.content,
                                                                                        token: window.parent.config.token,
                                                                                        type: 'manager',
                                                                                    }).then((res) => {
                                                                                        res.result ? n++ : run();
                                                                                    });
                                                                                });
                                                                            }
                                                                            run();
                                                                        });
                                                                        setInterval(() => {
                                                                            n === selCount && setTimeout(() => resolve(), 200);
                                                                        }, 500);
                                                                    }).then(() => {
                                                                        dialog.dataLoading({ visible: false });
                                                                        gvc.notifyDataChange(vm.id);
                                                                    });
                                                                },
                                                                option: true,
                                                            },
                                                            {
                                                                name: '刪除',
                                                                event: (checkedData) => {
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認刪除所選項目？',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({ visible: true });
                                                                                ApiShop.delete({
                                                                                    id: checkedData
                                                                                        .map((dd) => {
                                                                                        return dd.id;
                                                                                    })
                                                                                        .join(`,`),
                                                                                }).then((res) => {
                                                                                    dialog.dataLoading({ visible: false });
                                                                                    if (res.result) {
                                                                                        vm.dataList = undefined;
                                                                                        gvc.notifyDataChange(vm.id);
                                                                                    }
                                                                                    else {
                                                                                        dialog.errorMessage({
                                                                                            text: '刪除失敗',
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        },
                                                                    });
                                                                },
                                                            },
                                                        ],
                                                    });
                                                },
                                            }),
                                        ].join('')))}
                                                ${BgWidget.mbContainer(240)}
                                            `);
                                    }
                                },
                                divCreate: {},
                                onCreate: () => {
                                    if (vmlist.loading) {
                                        BgProduct.getCollectionAllOpts(vmlist.collections, () => {
                                            vmlist.loading = false;
                                            gvc.notifyDataChange(vmlist.id);
                                        });
                                    }
                                },
                            });
                        case 'replace':
                            setTimeout(() => {
                                document.querySelector('.pd-w-c').scrollTop = vm.last_scroll;
                                vm.last_scroll = 0;
                            }, 200);
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'replace',
                                defData: vm.replaceData,
                            });
                        case 'editSpec':
                            vm.last_scroll = document.querySelector('.pd-w-c').scrollTop;
                            return ShoppingProductSetting.editProductSpec({
                                vm: vm,
                                gvc: gvc,
                                defData: vm.replaceData,
                            });
                    }
                },
                divCreate: {
                    class: `w-100 h-100`,
                },
                onCreate: () => { },
            };
        });
    }
    static editProductSpec(obj) {
        var _b, _c;
        const html = String.raw;
        let postMD = obj.defData;
        let variant = {};
        let orignData = {};
        let index = 0;
        const gvc = obj.gvc;
        postMD.variants.map((data, ind) => {
            if (data.editable) {
                index = ind;
                variant = obj.single ? data : JSON.parse(JSON.stringify(data));
                orignData = data;
            }
        });
        function checkStore(next, cancel) {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(orignData) !== JSON.stringify(variant)) {
                dialog.checkYesOrNot({
                    text: '內容已變更是否儲存?',
                    callback: (response) => {
                        if (response) {
                            postMD.variants[index] = variant;
                        }
                        if (cancel) {
                            cancel();
                            return;
                        }
                        obj && obj.goBackEvent ? obj.goBackEvent.save(postMD) : next();
                    },
                });
            }
            else {
                next();
            }
        }
        document.querySelector('.pd-w-c').scrollTop = 0;
        return html ` <div class="d-flex" style="font-size: 16px;color:#393939;font-weight: 400;position: relative;padding:0;padding-bottom: ${obj.single ? `0px` : `80px`};">
            ${BgWidget.container(html `
                    <div class="title-container ${obj.single ? 'd-none' : ''}">
                        ${BgWidget.goBack(obj.gvc.event(() => {
            checkStore(obj && obj.goBackEvent
                ? obj.goBackEvent.cancel
                : () => {
                    obj.vm.type = 'replace';
                });
        }))}
                        ${BgWidget.title(variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格')}
                        <div class="flex-fill"></div>
                    </div>
                    <div class="d-flex flex-column ${obj.single ? `flex-column-reverse` : `flex-sm-row mt-4`} w-100 p-0" style="gap: 24px;">
                        <div class="leftBigArea d-flex flex-column flex-fill" style="gap: 18px;">
                            ${!obj.single
            ? BgWidget.mainCard(gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return html `
                                                      <div style="font-weight: 700;">規格</div>
                                                      <div>${variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格'}</div>
                                                      <div style="font-weight: 700;">規格圖片</div>
                                                      <div
                                                          class="d-flex align-items-center justify-content-center rounded-3 shadow"
                                                          style="min-width:135px;135px;height:135px;cursor:pointer;background: 50%/cover url('${variant.preview_image || BgWidget.noImageURL}');"
                                                      >
                                                          <div
                                                              class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image"
                                                              style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                                                          >
                                                              <i
                                                                  class="fa-regular fa-eye"
                                                                  onclick="${obj.gvc.event(() => {
                            obj.gvc.glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', variant.preview_image || BgWidget.noImageURL);
                        })}"
                                                              ></i>
                                                          </div>
                                                      </div>
                                                      <div
                                                          style="width: 136px;text-align: center;color: #36B;cursor: pointer;"
                                                          onclick="${obj.gvc.event(() => {
                            imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                if (urlArray.length > 0) {
                                    variant.preview_image = urlArray[0].data;
                                    gvc.notifyDataChange(id);
                                }
                                else {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                }
                            }, html ` <div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">圖片庫</div>`, { mul: false });
                        })}"
                                                      >
                                                          變更
                                                      </div>
                                                  `;
                    },
                    divCreate: {
                        style: `display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;`,
                    },
                };
            }))
            : ''}
                            ${BgWidget.mainCard(html `
                                <div class="w-100" style="display: flex;gap: 18px;flex-direction: column;">
                                    <div style="font-weight: 700;">定價</div>
                                    <div class="d-flex w-100" style="gap:18px;">
                                        <div class="d-flex w-50 flex-column guide5-5" style="gap: 8px;">
                                            <div>售價*</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入售價"
                                                onchange="${gvc.event((e) => {
            variant.sale_price = e.value;
        })}"
                                                min="0"
                                                value="${variant.sale_price || '0'}"
                                                type="number"
                                            />
                                        </div>
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>原價</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入原價"
                                                min="0"
                                                onchange="${gvc.event((e) => {
            variant.compare_price = e.value;
        })}"
                                                value="${variant.compare_price || '0'}"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                    <div class="d-flex w-100" style="gap:18px;">
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>成本</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入成本"
                                                min="0"
                                                onchange="${gvc.event((e) => {
            variant.cost = e.value;
        })}"
                                                value="${variant.cost || 0}"
                                                type="number"
                                            />
                                        </div>
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>利潤</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                min="0"
                                                onchange="${gvc.event((e) => {
            variant.profit = e.value;
        })}"
                                                placeholder="-"
                                                value="${variant.profit}"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            `)}
                            ${BgWidget.mainCard(gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
            };
            return {
                bind: vm.id,
                view: () => {
                    return html ` <div style="font-weight: 700;margin-bottom: 6px;">運費計算</div>
                                                ${BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'volume',
                            name: '依材積計算',
                            customerClass: 'guide5-6',
                        },
                        {
                            key: 'weight',
                            name: '依重量計算',
                        },
                        {
                            key: 'none',
                            name: '不計算運費',
                        },
                    ], [variant.shipment_type], (data) => {
                        variant.shipment_type = data[0];
                        gvc.notifyDataChange(vm.id);
                    }, { single: true })}`;
                },
                divCreate: {
                    class: `d-flex flex-column `,
                    style: `gap:12px;`,
                },
            };
        }))}
                            ${BgWidget.mainCard(html `
                                <div class="d-flex flex-column " style="gap:18px;">
                                    <div class="d-flex flex-column guide5-7" style="gap:18px;">
                                        <div style="font-weight: 700;">商品材積</div>
                                        <div class="row">
                                            ${[
            {
                title: '長度',
                value: 'v_length',
                unit: '公分',
            },
            {
                title: '寬度',
                value: 'v_width',
                unit: '公分',
            },
            {
                title: '高度',
                value: 'v_height',
                unit: '公分',
            },
        ]
            .map((dd) => {
            return html ` <div style="display: flex;justify-content: center;align-items: center;gap: 10px;position: relative;" class=" col-12 col-sm-4 mb-2">
                                                        <div style="white-space: nowrap;">${dd.title}</div>
                                                        <input
                                                            class="ps-3"
                                                            style="border-radius: 10px;border: 1px solid #DDD;height: 40px;width: calc(100% - 50px);"
                                                            type="number"
                                                            onchange="${gvc.event((e) => {
                variant[dd.value] = e.value;
            })}"
                                                            value="${variant[dd.value]}"
                                                        />
                                                        <div style="color: #8D8D8D;position: absolute;right: 25px;top: 7px;">${dd.unit}</div>
                                                    </div>`;
        })
            .join('')}
                                        </div>
                                    </div>
                                    <div style="font-weight: 700;">商品重量</div>
                                    <div class="w-100 row m-0" style="color:#393939;">
                                        <input
                                            class="col-6"
                                            style="display: flex;height: 40px;padding: 10px 18px;align-items: center;gap: 10px;border-radius: 10px;border: 1px solid #DDD;"
                                            placeholder="請輸入商品重量"
                                            value="${variant.weight || 0}"
                                            onchange="${gvc.event((e) => {
            variant.weight = e.value;
        })}"
                                        />
                                        <div class="col-6" style="display: flex;align-items: center;gap: 10px;">
                                            <div style="white-space: nowrap;">單位</div>
                                            <select class="form-select d-flex align-items-center flex-fill" style="border-radius: 10px;border: 1px solid #DDD;padding-left: 18px;">
                                                <option value="kg">公斤</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            `)}
                            ${BgWidget.mainCard(html `
                                <div class="d-flex flex-column" style="gap: 18px;">
                                    <div style="font-weight: 700;">庫存政策</div>
                                    ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _b, _c;
                    return html `
                                                    <div class="d-flex flex-column w-100">
                                                        <div
                                                            class="d-flex align-items-center"
                                                            style="gap:6px;cursor: pointer;"
                                                            onclick="${gvc.event(() => {
                        variant.show_understocking = 'true';
                        gvc.notifyDataChange(id);
                    })}"
                                                        >
                                                            ${variant.show_understocking != 'false'
                        ? html ` <div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                        : html ` <div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                            追蹤商品庫存
                                                        </div>
                                                        ${variant.show_understocking != 'false'
                        ? html ` <div
                                                                  class="w-100 align-items-center"
                                                                  style="display: flex;padding-left: 8px;align-items: flex-start;gap: 14px;align-self: stretch;margin-top: 8px;"
                                                              >
                                                                  <div style="background-color: #E5E5E5;height: 80px;width: 1px;"></div>
                                                                  <div class="flex-fill d-flex flex-column" style="gap: 8px">
                                                                      <div>庫存數量</div>
                                                                      <input
                                                                          class="w-100"
                                                                          value="${(_b = variant.stock) !== null && _b !== void 0 ? _b : '0'}"
                                                                          style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                          placeholder="請輸入庫存數量"
                                                                          onchange="${gvc.event((e) => {
                            variant.stock = e.value;
                        })}"
                                                                      />
                                                                  </div>
                                                                  <div class="flex-fill d-flex flex-column" style="gap: 8px">
                                                                      <div>安全庫存</div>
                                                                      <input
                                                                          class="w-100"
                                                                          value="${(_c = variant.save_stock) !== null && _c !== void 0 ? _c : '0'}"
                                                                          style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                          placeholder="請輸入安全庫存"
                                                                          onchange="${gvc.event((e) => {
                            variant.save_stock = e.value;
                        })}"
                                                                      />
                                                                  </div>
                                                              </div>`
                        : ``}
                                                    </div>
                                                    <div
                                                        class="d-flex align-items-center"
                                                        style="gap:6px;cursor: pointer;"
                                                        onclick="${gvc.event(() => {
                        variant.show_understocking = 'false';
                        gvc.notifyDataChange(id);
                    })}"
                                                    >
                                                        ${variant.show_understocking == 'false'
                        ? html ` <div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                        : html ` <div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                        不追蹤
                                                    </div>
                                                `;
                },
                divCreate: { style: `display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;` },
            };
        })}
                                </div>
                            `)}
                            ${BgWidget.mainCard(html `
                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                    <div class="title-container px-0">
                                        <div style="color:#393939;font-weight: 700;">商品管理</div>
                                        <div class="flex-fill"></div>
                                        ${BgWidget.grayButton('商品條碼', gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            if (!variant.barcode) {
                dialog.errorMessage({ text: '請先設定商品條碼' });
                return;
            }
            window.parent.glitter.addMtScript([
                {
                    src: 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js',
                },
            ], () => {
                window.parent.QRCode.toDataURL(`variants-` + variant.barcode, {
                    width: 200,
                    margin: 2,
                }, function (err, url) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    window.parent.glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', url);
                });
            }, () => { });
        }), { icon: `fa-regular fa-eye` })}
                                    </div>
                                    <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                        <div style="font-weight: 400;font-size: 16px;">存貨單位 (SKU)</div>
                                        <input
                                            style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                            placeholder="請輸入存貨單位"
                                            value="${(_b = variant.sku) !== null && _b !== void 0 ? _b : ''}"
                                            onchange="${gvc.event((e) => {
            variant.sku = e.value;
        })}"
                                        />
                                    </div>
                                    <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                        <div style="font-weight: 400;font-size: 16px;">商品條碼 (ISBN、UPC、GTIN等)</div>
                                        <input
                                            style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                            placeholder="請輸入商品條碼"
                                            value="${(_c = variant.barcode) !== null && _c !== void 0 ? _c : ''}"
                                            onchange="${gvc.event((e) => {
            const regex = /^[a-zA-Z0-9]+$/;
            if (!regex.test(e.value)) {
                e.value = '';
                const dialog = new ShareDialog(gvc.glitter);
                dialog.errorMessage({ text: '條碼僅能輸入英數字' });
            }
            else {
                variant.barcode = e.value;
            }
        })}"
                                        />
                                    </div>
                                </div>
                            `)}
                            ${document.body.clientWidth > 768 && obj.single === undefined ? BgWidget.mbContainer(120) : ''}
                        </div>
                        <div class="${obj.single ? `d-none` : ``}" style="min-width:300px; max-width:100%;">
                            ${BgWidget.summaryCard(gvc.bindView({
            bind: 'right',
            view: () => {
                let rightHTML = postMD.variants
                    .map((data) => {
                    if (!data.editable) {
                        return html `
                                                        <div
                                                            class="d-flex align-items-center"
                                                            style="gap: 10px;cursor: pointer"
                                                            onmouseover="${gvc.event((e) => {
                            e.style.background = '#F7F7F7';
                        })}"
                                                            onmouseout="${gvc.event((e) => {
                            e.style.background = '#FFFFFF';
                        })}"
                                                            onclick="${gvc.event(() => {
                            checkStore(() => {
                                postMD.variants.map((dd) => {
                                    dd.editable = false;
                                });
                                data.editable = true;
                                obj.vm.type = 'editSpec';
                            }, () => { });
                        })}"
                                                        >
                                                            ${BgWidget.validImageBox({
                            gvc,
                            image: data.preview_image || BgWidget.noImageURL,
                            width: 40,
                            style: 'border-radius: 10px',
                        })}
                                                            <div>${data.spec.join(' / ')}</div>
                                                        </div>
                                                    `;
                    }
                    else {
                        return ``;
                    }
                })
                    .join('');
                return html `
                                            <div style="font-weight: 700;">其他規格</div>
                                            <div class="d-flex flex-column mt-3" style="gap:16px">${rightHTML}</div>
                                        `;
            },
        }))}
                        </div>
                        ${obj.single ? '' : BgWidget.mbContainer(240)}
                    </div>
                `, {
            style: obj.vm.type === 'editSpec' ? '' : 'margin-top: 0 !important;',
        })}
            <div class="update-bar-container ${obj.single ? `d-none` : ``}">
                ${BgWidget.cancel(obj.gvc.event(() => {
            checkStore(obj && obj.goBackEvent
                ? obj.goBackEvent.cancel
                : () => {
                    variant = orignData;
                    obj.vm.type = 'replace';
                });
        }))}
                ${BgWidget.save(obj.gvc.event(() => {
            let checkPass = true;
            if (checkPass) {
                postMD.variants[index] = variant;
                if (obj && obj.goBackEvent) {
                    obj.goBackEvent.save(postMD);
                }
                else {
                    obj.vm.type = 'replace';
                }
            }
        }))}
            </div>
        </div>`;
    }
    static editProduct(obj) {
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let postMD = obj.initial_data || {
                title: '',
                ai_description: '',
                productType: {
                    product: true,
                    addProduct: false,
                    giveaway: false,
                },
                content: '',
                visible: 'true',
                status: 'draft',
                collection: [],
                hideIndex: 'false',
                preview_image: [],
                specs: [],
                variants: [],
                seo: {
                    title: '',
                    content: '',
                    keywords: '',
                    domain: '',
                },
                relative_product: [],
                template: '',
                content_array: [],
                content_json: [],
                active_schedule: {},
            };
            function setProductType() {
                switch (obj.product_type) {
                    case 'product':
                        postMD.visible = 'true';
                        postMD.productType = { product: true, addProduct: false, giveaway: false };
                        break;
                    case 'addProduct':
                        postMD.visible = 'true';
                        postMD.productType = { product: false, addProduct: true, giveaway: false };
                        break;
                    case 'giveaway':
                        postMD.visible = 'true';
                        postMD.productType = { product: false, addProduct: false, giveaway: true };
                        break;
                    case 'hidden':
                        postMD.visible = 'false';
                        postMD.productType = { product: true, addProduct: false, giveaway: false };
                        break;
                }
            }
            setProductType();
            postMD.content_array = (_b = postMD.content_array) !== null && _b !== void 0 ? _b : [];
            postMD.content_json = (_c = postMD.content_json) !== null && _c !== void 0 ? _c : [];
            if (obj.type === 'replace') {
                postMD = Object.assign(Object.assign({}, postMD), obj.defData);
            }
            else {
                obj.vm.replaceData = postMD;
            }
            const origin_data = JSON.stringify(postMD);
            window.parent.glitter.share.checkData = () => origin_data === JSON.stringify(postMD);
            const html = String.raw;
            const gvc = obj.gvc;
            const variantsViewID = gvc.glitter.getUUID();
            const saasConfig = window.parent.saasConfig;
            let selectFunRow = false;
            let shipment_config = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
            if (shipment_config.response.result[0]) {
                shipment_config = shipment_config.response.result[0].value || {};
            }
            else {
                shipment_config = {};
            }
            let createPage = {
                page: 'add',
            };
            function updateVariants() {
                const remove_indexs = [];
                let complexity = 1;
                postMD.specs = postMD.specs.filter((dd) => {
                    return dd.option && dd.option.length !== 0;
                });
                postMD.specs.map((spec) => {
                    complexity *= spec.option.length;
                });
                const cType = [];
                function generateCombinations(specs, currentCombination, index = 0) {
                    if (index === specs.length &&
                        currentCombination.length > 0 &&
                        cType.findIndex((ct) => {
                            return JSON.stringify(ct) === JSON.stringify(currentCombination);
                        }) === -1) {
                        cType.push(JSON.parse(JSON.stringify(currentCombination)));
                        return;
                    }
                    const currentSpecOptions = specs[index];
                    if (currentSpecOptions) {
                        for (const option of currentSpecOptions) {
                            currentCombination[index] = option;
                            generateCombinations(specs, currentCombination, index + 1);
                        }
                    }
                }
                function checkSpecInclude(spec, index) {
                    if (postMD.specs[index]) {
                        for (const { title } of postMD.specs[index].option) {
                            if (spec === title)
                                return true;
                        }
                        return false;
                    }
                    return false;
                }
                for (let n = 0; n < complexity; n++) {
                    let currentCombination = [];
                    generateCombinations(postMD.specs.map((dd) => {
                        return dd.option.map((dd) => {
                            return dd.title;
                        });
                    }), currentCombination);
                    const waitAdd = cType.find((dd) => {
                        return !postMD.variants.find((d2) => {
                            return JSON.stringify(d2.spec) === JSON.stringify(dd);
                        });
                    });
                    if (waitAdd) {
                        postMD.variants.push({
                            show_understocking: 'true',
                            type: 'variants',
                            sale_price: 0,
                            compare_price: 0,
                            cost: 0,
                            spec: waitAdd,
                            profit: 0,
                            v_length: 0,
                            v_width: 0,
                            v_height: 0,
                            weight: 0,
                            shipment_type: shipment_config.selectCalc || 'weight',
                            sku: '',
                            barcode: '',
                            stock: 0,
                            preview_image: '',
                        });
                    }
                }
                if (postMD.variants && postMD.variants.length > 0) {
                    postMD.variants.map((variant, index1) => {
                        if (variant.spec.length !== postMD.specs.length) {
                            remove_indexs.push(index1);
                        }
                        variant.spec.map((sp, index2) => {
                            if (!checkSpecInclude(sp, index2)) {
                                remove_indexs.push(index1);
                            }
                        });
                    });
                }
                postMD.variants = postMD.variants.filter((variant) => {
                    let pass = true;
                    let index = 0;
                    for (const b of variant.spec) {
                        if (!postMD.specs[index] ||
                            !postMD.specs[index].option.find((dd) => {
                                return dd.title === b;
                            })) {
                            pass = false;
                            break;
                        }
                        index++;
                    }
                    return pass && variant.spec.length === postMD.specs.length;
                });
                if (postMD.variants.length === 0) {
                    postMD.variants.push({
                        show_understocking: 'true',
                        type: 'variants',
                        sale_price: 0,
                        compare_price: 0,
                        cost: 0,
                        spec: [],
                        profit: 0,
                        v_length: 0,
                        v_width: 0,
                        v_height: 0,
                        weight: 0,
                        shipment_type: shipment_config.selectCalc || 'weight',
                        sku: '',
                        barcode: '',
                        stock: 0,
                        preview_image: '',
                    });
                }
                obj.vm.replaceData = postMD;
                obj.gvc.notifyDataChange(variantsViewID);
            }
            function checkSpecSingle() {
                if (postMD.specs.length > 0) {
                    const uniqueTitlesMap = new Map();
                    postMD.specs.forEach((item) => {
                        if (!uniqueTitlesMap.has(item.title)) {
                            uniqueTitlesMap.set(item.title, item.option);
                        }
                        else {
                            const existingOptions = uniqueTitlesMap.get(item.title);
                            item.option.forEach((option) => {
                                if (!existingOptions.find((existingOption) => existingOption.title === option.title)) {
                                    existingOptions.push(option);
                                }
                            });
                        }
                    });
                    postMD.specs = Array.from(uniqueTitlesMap, ([title, option]) => ({ title, option }));
                }
            }
            gvc.addStyle(`
            .specInput:focus {
                outline: none;
            }
        `);
            const vm = {
                id: gvc.glitter.getUUID(),
            };
            return gvc.bindView(() => {
                return {
                    bind: vm.id,
                    view: () => {
                        var _b;
                        updateVariants();
                        return [
                            BgWidget.container(html `
                                <div class="title-container flex-column" style="gap:10px;">
                                    <div class="d-flex align-items-center w-100">
                                        ${BgWidget.goBack(obj.gvc.event(() => {
                                if (window.parent.glitter.share.checkData && !window.parent.glitter.share.checkData()) {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.checkYesOrNot({
                                        text: '尚未儲存內容，是否確認跳轉?',
                                        callback: (response) => {
                                            if (response) {
                                                window.parent.glitter.share.checkData = () => {
                                                    return true;
                                                };
                                                obj.vm.type = 'list';
                                            }
                                        },
                                    });
                                }
                                else {
                                    obj.vm.type = 'list';
                                }
                            }))}
                                        <h3 class="mb-0 me-3 tx_title">${obj.type === 'replace' ? postMD.title || '編輯商品' : `新增商品`}</h3>
                                        <div class="flex-fill"></div>
                                    </div>
                                    <div class="d-flex w-100">
                                        <div class="flex-fill"></div>
                                        ${[
                                obj.type === 'replace'
                                    ? ''
                                    : BgWidget.grayButton('複製現有商品', gvc.event(() => {
                                        BgProduct.productsDialog({
                                            gvc: gvc,
                                            default: [],
                                            single: true,
                                            callback: (value) => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.dataLoading({ visible: true });
                                                ApiShop.getProduct({
                                                    page: 0,
                                                    limit: 1,
                                                    id: value[0],
                                                }).then((data) => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (data.result && data.response.data && data.response.data.content) {
                                                        postMD = Object.assign(Object.assign({}, postMD), data.response.data.content);
                                                        postMD.id = undefined;
                                                        setProductType();
                                                        gvc.notifyDataChange(vm.id);
                                                    }
                                                });
                                            },
                                            show_product_type: true,
                                        });
                                    }), {}),
                                BgWidget.grayButton('AI 生成', gvc.event(() => {
                                    ProductAi.setProduct(gvc, postMD, () => {
                                        gvc.notifyDataChange(vm.id);
                                    });
                                }), {}),
                                postMD.id
                                    ? BgWidget.grayButton(document.body.clientWidth > 768 ? '預覽商品' : '預覽', gvc.event(() => {
                                        const href = `https://${window.parent.glitter.share.editorViewModel.domain}/products/${postMD.seo.domain}`;
                                        window.parent.glitter.openNewTab(href);
                                    }), { icon: document.body.clientWidth > 768 ? 'fa-regular fa-eye' : undefined })
                                    : '',
                            ]
                                .filter((str) => str.length > 0)
                                .join(html `<div class="mx-1"></div>`)}
                                    </div>
                                </div>
                                ${BgWidget.container1x2({
                                html: [
                                    BgWidget.mainCard(html `
                                                <div class="d-flex flex-column guide5-4">
                                                    <div style="font-weight: 700;">商品名稱</div>
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        type: 'text',
                                        default: (_b = postMD.title) !== null && _b !== void 0 ? _b : '',
                                        placeHolder: '請輸入商品名稱',
                                        callback: (text) => {
                                            if (postMD.seo.domain === postMD.title) {
                                                postMD.seo.domain = text;
                                            }
                                            postMD.title = text;
                                            gvc.notifyDataChange('seo');
                                        },
                                    })}
                                                </div>
                                            `),
                                    BgWidget.mainCard([
                                        obj.gvc.bindView(() => {
                                            var _b, _c;
                                            const dialog = new ShareDialog(gvc.glitter);
                                            const vm = {
                                                id: obj.gvc.glitter.getUUID(),
                                                type: 'product-detail',
                                                loading: true,
                                                documents: [],
                                            };
                                            postMD.content_array = (_b = postMD.content_array) !== null && _b !== void 0 ? _b : [];
                                            postMD.content_json = (_c = postMD.content_json) !== null && _c !== void 0 ? _c : [];
                                            return {
                                                bind: vm.id,
                                                view: () => __awaiter(this, void 0, void 0, function* () {
                                                    if (vm.loading) {
                                                        return BgWidget.spinner();
                                                    }
                                                    function formatRichtext(text, tags, jsonData) {
                                                        var _b, _c, _d;
                                                        let gText = `${text}`;
                                                        if (tags && tags.length > 0) {
                                                            for (const item of tags) {
                                                                const data = jsonData.find((j) => j.key === item.key);
                                                                const textImage = data && data.value
                                                                    ? html `<span
                                                                                          style="font-size: ${(_b = item.font_size) !== null && _b !== void 0 ? _b : '14'}px; color: ${(_c = item.font_color) !== null && _c !== void 0 ? _c : '#393939'}; background: ${(_d = item.font_bgr) !== null && _d !== void 0 ? _d : '#fff'}"
                                                                                          >${data.value}</span
                                                                                      >`
                                                                    : html `#${item.title}#`;
                                                                const regex = new RegExp(`@{{${item.key}}}`, 'g');
                                                                gText = gText.replace(regex, textImage);
                                                            }
                                                        }
                                                        return gText;
                                                    }
                                                    return html ` <div class="d-flex align-items-center justify-content-end mb-3">
                                                                        <div class="d-flex align-items-center gap-2">
                                                                            <div style="color: #393939; font-weight: 700;">商品描述</div>
                                                                        </div>
                                                                        <div class="flex-fill"></div>
                                                                        <div
                                                                            class="cursor_pointer"
                                                                            onclick="${gvc.event(() => {
                                                        BgWidget.dialog({
                                                            gvc: gvc,
                                                            title: '設定',
                                                            xmark: () => {
                                                                return new Promise((resolve) => {
                                                                    gvc.notifyDataChange(vm.id);
                                                                    resolve(true);
                                                                });
                                                            },
                                                            innerHTML: (gvc) => {
                                                                const id = gvc.glitter.getUUID();
                                                                return gvc.bindView(() => {
                                                                    return {
                                                                        bind: id,
                                                                        view: () => {
                                                                            return vm.documents
                                                                                .map((dd) => {
                                                                                return html ` <li class="w-100 px-2">
                                                                                                                <div class="w-100 d-flex justify-content-between">
                                                                                                                    <div class="d-flex justify-content-start align-items-center gap-3">
                                                                                                                        <i class="fa-solid fa-grip-dots-vertical dragItem cursor_pointer"></i>
                                                                                                                        <div class="tx_normal">${dd.title}</div>
                                                                                                                    </div>
                                                                                                                    ${gvc.bindView((() => {
                                                                                    const iconId = gvc.glitter.getUUID();
                                                                                    return {
                                                                                        bind: iconId,
                                                                                        view: () => {
                                                                                            return html ` <i
                                                                                                                                        class="${postMD.content_array.includes(dd.id)
                                                                                                ? 'fa-solid fa-eye'
                                                                                                : 'fa-sharp fa-solid fa-eye-slash'} d-flex align-items-center justify-content-center cursor_pointer"
                                                                                                                                        onclick="${gvc.event(() => {
                                                                                                if (postMD.content_array.includes(dd.id)) {
                                                                                                    postMD.content_array = postMD.content_array.filter((d) => d !== dd.id);
                                                                                                }
                                                                                                else {
                                                                                                    postMD.content_array.push(dd.id);
                                                                                                }
                                                                                                gvc.notifyDataChange(iconId);
                                                                                            })}"
                                                                                                                                    ></i>`;
                                                                                        },
                                                                                        divCreate: {
                                                                                            class: 'd-flex',
                                                                                        },
                                                                                    };
                                                                                })())}
                                                                                                                </div>
                                                                                                            </li>`;
                                                                            })
                                                                                .join('');
                                                                        },
                                                                        divCreate: {
                                                                            elem: 'ul',
                                                                            class: 'w-100 my-2 d-flex flex-column gap-4',
                                                                        },
                                                                        onCreate: () => {
                                                                            if (!vm.loading) {
                                                                                gvc.glitter.addMtScript([
                                                                                    {
                                                                                        src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                                                    },
                                                                                ], () => { }, () => { });
                                                                                const interval = setInterval(() => {
                                                                                    if (window.Sortable) {
                                                                                        try {
                                                                                            gvc.addStyle(`
                                                                                                                        ul {
                                                                                                                            list-style: none;
                                                                                                                            padding: 0;
                                                                                                                        }
                                                                                                                    `);
                                                                                            function swapArr(arr, t1, t2) {
                                                                                                const data = arr[t1];
                                                                                                arr.splice(t1, 1);
                                                                                                arr.splice(t2, 0, data);
                                                                                            }
                                                                                            let startIndex = 0;
                                                                                            Sortable.create(gvc.getBindViewElem(id).get(0), {
                                                                                                group: id,
                                                                                                animation: 100,
                                                                                                handle: '.dragItem',
                                                                                                onEnd: (evt) => {
                                                                                                    swapArr(vm.documents, startIndex, evt.newIndex);
                                                                                                    ApiUser.setPublicConfig({
                                                                                                        key: 'text-manager',
                                                                                                        user_id: 'manager',
                                                                                                        value: vm.documents,
                                                                                                    }).then((result) => {
                                                                                                        if (!result.response.result) {
                                                                                                            dialog.errorMessage({ text: '設定失敗' });
                                                                                                        }
                                                                                                    });
                                                                                                },
                                                                                                onStart: (evt) => {
                                                                                                    startIndex = evt.oldIndex;
                                                                                                },
                                                                                            });
                                                                                        }
                                                                                        catch (e) { }
                                                                                        clearInterval(interval);
                                                                                    }
                                                                                }, 100);
                                                                            }
                                                                        },
                                                                    };
                                                                });
                                                            },
                                                        });
                                                    })}"
                                                                        >
                                                                            設定<i class="fa-regular fa-gear ms-1"></i>
                                                                        </div>
                                                                    </div>
                                                                    <div class="my-3">
                                                                        ${gvc.bindView((() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return html ` <div
                                                                                            class="d-flex justify-content-between align-items-center gap-3 mb-1"
                                                                                            style="cursor: pointer;"
                                                                                            onclick="${gvc.event(() => {
                                                                    const originContent = `${postMD.content}`;
                                                                    BgWidget.fullDialog({
                                                                        gvc: gvc,
                                                                        title: (gvc2) => {
                                                                            return `<div class="d-flex align-items-center me-2" style="gap:10px;">商品描述${BgWidget.aiChatButton({
                                                                                gvc: gvc2,
                                                                                select: 'writer',
                                                                                click: () => {
                                                                                    ProductAi.generateRichText(gvc, (text) => {
                                                                                        postMD.content += text;
                                                                                        gvc.notifyDataChange(vm.id);
                                                                                        gvc2.recreateView();
                                                                                    });
                                                                                },
                                                                            })}</div>`;
                                                                        },
                                                                        innerHTML: (gvc2) => {
                                                                            return html ` <div>
                                                                                                            ${EditorElem.richText({
                                                                                gvc: gvc2,
                                                                                def: postMD.content,
                                                                                setHeight: '100vh',
                                                                                hiddenBorder: true,
                                                                                insertImageEvent: (editor) => {
                                                                                    const mark = `{{${Tool.randomString(8)}}}`;
                                                                                    editor.selection.setAtEnd(editor.$el.get(0));
                                                                                    editor.html.insert(mark);
                                                                                    editor.undo.saveStep();
                                                                                    imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                                                                        if (urlArray.length > 0) {
                                                                                            const imgHTML = urlArray
                                                                                                .map((url) => {
                                                                                                return html ` <img src="${url.data}" />`;
                                                                                            })
                                                                                                .join('');
                                                                                            editor.html.set(editor.html
                                                                                                .get(0)
                                                                                                .replace(mark, html `<div class="d-flex flex-column">${imgHTML}</div>`));
                                                                                            editor.undo.saveStep();
                                                                                        }
                                                                                        else {
                                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                                            dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                                                                        }
                                                                                    }, html ` <div
                                                                                                                            class="d-flex flex-column"
                                                                                                                            style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                        >
                                                                                                                            圖片庫
                                                                                                                        </div>`, {
                                                                                        mul: true,
                                                                                        cancelEvent: () => {
                                                                                            editor.html.set(editor.html.get(0).replace(mark, ''));
                                                                                            editor.undo.saveStep();
                                                                                        },
                                                                                    });
                                                                                },
                                                                                callback: (text) => {
                                                                                    postMD.content = text;
                                                                                },
                                                                                rich_height: `calc(${window.parent.innerHeight}px - 70px - 58px - 49px - 64px - 40px + ${document.body.clientWidth < 800 ? `70` : `0`}px)`,
                                                                            })}
                                                                                                        </div>`;
                                                                        },
                                                                        footer_html: (gvc2) => {
                                                                            return [
                                                                                BgWidget.cancel(gvc2.event(() => {
                                                                                    postMD.content = originContent;
                                                                                    gvc2.closeDialog();
                                                                                })),
                                                                                BgWidget.save(gvc2.event(() => {
                                                                                    gvc2.closeDialog();
                                                                                    gvc.notifyDataChange(id);
                                                                                })),
                                                                            ].join('');
                                                                        },
                                                                        closeCallback: () => {
                                                                            postMD.content = originContent;
                                                                        },
                                                                    });
                                                                })}"
                                                                                        >
                                                                                            ${(() => {
                                                                    const text = gvc.glitter.utText.removeTag(postMD.content);
                                                                    return BgWidget.richTextView(Tool.truncateString(text, 100));
                                                                })()}
                                                                                        </div>`;
                                                            },
                                                        };
                                                    })())}
                                                                    </div>
                                                                    ${(vm.documents || [])
                                                        .filter((item) => {
                                                        return postMD.content_array.includes(item.id);
                                                    })
                                                        .map((item, index) => {
                                                        return BgWidget.openBoxContainer({
                                                            gvc,
                                                            tag: 'content_array',
                                                            title: item.title,
                                                            insideHTML: (() => {
                                                                if (item.data.tags && item.data.tags.length > 0) {
                                                                    const id = obj.gvc.glitter.getUUID();
                                                                    return html ` <div
                                                                                                class="cursor_pointer text-end me-1 mb-2"
                                                                                                onclick="${gvc.event(() => {
                                                                        const originJson = JSON.parse(JSON.stringify(postMD.content_json));
                                                                        BgWidget.settingDialog({
                                                                            gvc: gvc,
                                                                            title: '設定',
                                                                            innerHTML: (gvc) => {
                                                                                return html ` <div>
                                                                                                                ${item.data.tags
                                                                                    .map((tag) => {
                                                                                    return html ` <div>
                                                                                                                            ${BgWidget.editeInput({
                                                                                        gvc,
                                                                                        title: tag.title,
                                                                                        default: (() => {
                                                                                            const docIndex = postMD.content_json.findIndex((c) => c.id === item.id);
                                                                                            if (docIndex === -1) {
                                                                                                return '';
                                                                                            }
                                                                                            if (postMD.content_json[docIndex].list === undefined) {
                                                                                                return '';
                                                                                            }
                                                                                            const keyIndex = postMD.content_json[docIndex].list.findIndex((l) => l.key === tag.key);
                                                                                            if (keyIndex === -1) {
                                                                                                return '';
                                                                                            }
                                                                                            return postMD.content_json[docIndex].list[keyIndex].value;
                                                                                        })(),
                                                                                        callback: (text) => {
                                                                                            const docIndex = postMD.content_json.findIndex((c) => c.id === item.id);
                                                                                            if (docIndex === -1) {
                                                                                                postMD.content_json.push({
                                                                                                    id: item.id,
                                                                                                    list: [
                                                                                                        {
                                                                                                            key: tag.key,
                                                                                                            value: text,
                                                                                                        },
                                                                                                    ],
                                                                                                });
                                                                                                return;
                                                                                            }
                                                                                            if (postMD.content_json[docIndex].list === undefined) {
                                                                                                postMD.content_json[docIndex].list = [
                                                                                                    {
                                                                                                        key: tag.key,
                                                                                                        value: text,
                                                                                                    },
                                                                                                ];
                                                                                                return;
                                                                                            }
                                                                                            const keyIndex = postMD.content_json[docIndex].list.findIndex((l) => l.key === tag.key);
                                                                                            if (keyIndex === -1) {
                                                                                                postMD.content_json[docIndex].list.push({
                                                                                                    key: tag.key,
                                                                                                    value: text,
                                                                                                });
                                                                                                return;
                                                                                            }
                                                                                            postMD.content_json[docIndex].list[keyIndex].value = text;
                                                                                        },
                                                                                        placeHolder: '輸入文本標籤',
                                                                                    })}
                                                                                                                        </div>`;
                                                                                })
                                                                                    .join(BgWidget.mbContainer(12))}
                                                                                                            </div>`;
                                                                            },
                                                                            footer_html: (gvc2) => {
                                                                                return [
                                                                                    BgWidget.cancel(gvc2.event(() => {
                                                                                        postMD.content_json = originJson;
                                                                                        gvc2.closeDialog();
                                                                                    })),
                                                                                    BgWidget.save(gvc2.event(() => {
                                                                                        gvc2.closeDialog();
                                                                                        gvc.notifyDataChange(`${id}-${index}`);
                                                                                    })),
                                                                                ].join('');
                                                                            },
                                                                            closeCallback: () => {
                                                                                postMD.content_json = originJson;
                                                                            },
                                                                        });
                                                                    })}"
                                                                                            >
                                                                                                標籤設值
                                                                                            </div>
                                                                                            ${gvc.bindView((() => {
                                                                        return {
                                                                            bind: `${id}-${index}`,
                                                                            view: () => {
                                                                                const content = item.data.content || '';
                                                                                const tags = item.data.tags;
                                                                                const jsonData = postMD.content_json.find((c) => c.id === item.id);
                                                                                return html ` <div style="border: 2px #DDDDDD solid; border-radius: 6px; padding: 12px;">
                                                                                                                ${tags ? formatRichtext(content, tags, jsonData ? jsonData.list : []) : content}
                                                                                                            </div>`;
                                                                            },
                                                                        };
                                                                    })())}`;
                                                                }
                                                                return html ` <div style="border: 1px #DDDDDD solid; border-radius: 6px; padding: 12px">
                                                                                        ${item.data.content || ''}
                                                                                    </div>`;
                                                            })(),
                                                        });
                                                    })
                                                        .join(BgWidget.mbContainer(8))}`;
                                                }),
                                                divCreate: {},
                                                onCreate: () => {
                                                    if (vm.loading) {
                                                        ApiUser.getPublicConfig('text-manager', 'manager').then((data) => {
                                                            vm.documents = data.response.value;
                                                            postMD.content_array = postMD.content_array.filter((id) => {
                                                                return vm.documents.some((item) => item.id === id);
                                                            });
                                                            postMD.content_json = postMD.content_json.filter((d) => {
                                                                return vm.documents.some((item) => item.id === d.id);
                                                            });
                                                            vm.loading = false;
                                                            gvc.notifyDataChange(vm.id);
                                                        });
                                                    }
                                                },
                                            };
                                        }),
                                    ].join(BgWidget.mbContainer(12))),
                                    BgWidget.mainCard(html `
                                                    <div class="d-flex align-items-center justify-content-between" style="color: #393939;font-size: 16px;font-weight: 700;margin-bottom: 18px;">
                                                        圖片
                                                        ${BgWidget.customButton({
                                        button: {
                                            color: 'black',
                                            size: 'sm',
                                        },
                                        text: {
                                            name: '新增圖片',
                                        },
                                        event: gvc.event(() => {
                                            imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                                if (urlArray.length > 0) {
                                                    postMD.preview_image.push(...urlArray.map((data) => {
                                                        return data.data;
                                                    }));
                                                    obj.gvc.notifyDataChange('image_view');
                                                }
                                                else {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                                }
                                            }, html ` <div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">圖片庫</div>`, { mul: true });
                                        }),
                                    })}
                                                    </div>
                                                    ${obj.gvc.bindView(() => {
                                        return {
                                            bind: 'image_view',
                                            view: () => {
                                                return (html ` <div class="my-2"></div>` +
                                                    EditorElem.flexMediaManagerV2({
                                                        gvc: obj.gvc,
                                                        data: postMD.preview_image,
                                                    }));
                                            },
                                            divCreate: {
                                                class: `d-flex w-100`,
                                                style: `overflow-y:scroll`,
                                            },
                                        };
                                    })}
                                                `),
                                    BgWidget.mainCard(obj.gvc.bindView(() => {
                                        const specid = obj.gvc.glitter.getUUID();
                                        let editIndex = -1;
                                        return {
                                            bind: specid,
                                            dataList: [{ obj: createPage, key: 'page' }],
                                            view: () => {
                                                let returnHTML = html ` <div style="font-size: 16px;font-weight: 700;">商品規格</div> `;
                                                let editSpectPage = [];
                                                if (postMD.specs.length > 0) {
                                                    postMD.specs.map((d, index) => {
                                                        editSpectPage.push({
                                                            type: index === editIndex ? 'edit' : 'show',
                                                        });
                                                    });
                                                    returnHTML += html `
                                                                    ${EditorElem.arrayItem({
                                                        customEditor: true,
                                                        gvc: obj.gvc,
                                                        title: '',
                                                        hoverGray: true,
                                                        position: 'front',
                                                        height: 100,
                                                        originalArray: postMD.specs,
                                                        expand: true,
                                                        copyable: false,
                                                        hr: true,
                                                        minus: false,
                                                        refreshComponent: (fromIndex, toIndex) => {
                                                            postMD.variants.map((item) => {
                                                                if (fromIndex === undefined ||
                                                                    toIndex === undefined ||
                                                                    fromIndex < 0 ||
                                                                    fromIndex >= item.spec.length ||
                                                                    toIndex < 0 ||
                                                                    toIndex >= item.spec.length) {
                                                                    throw new Error('索引超出範圍');
                                                                }
                                                                let element = item.spec.splice(fromIndex, 1)[0];
                                                                item.spec.splice(toIndex, 0, element);
                                                                return item;
                                                            });
                                                            obj.gvc.notifyDataChange([specid, 'productInf']);
                                                        },
                                                        array: () => {
                                                            return postMD.specs.map((dd, specIndex) => {
                                                                let temp = {
                                                                    title: '',
                                                                    option: [],
                                                                };
                                                                return {
                                                                    title: gvc.bindView({
                                                                        bind: `editSpec${specIndex}`,
                                                                        dataList: [
                                                                            {
                                                                                obj: editSpectPage[specIndex],
                                                                                key: 'type',
                                                                            },
                                                                        ],
                                                                        view: () => {
                                                                            if (editSpectPage[specIndex].type == 'show') {
                                                                                gvc.addStyle(`
                                                                                                    .option {
                                                                                                        background-color: #f7f7f7;
                                                                                                    }
                                                                                                    .pen {
                                                                                                        display: none;
                                                                                                    }
                                                                                                `);
                                                                                return html ` <div class="d-flex flex-column" style="gap:6px;align-items: flex-start;padding: 12px 0;">
                                                                                                    <div style="font-size: 16px;">${dd.title}</div>
                                                                                                    ${(() => {
                                                                                    let returnHTML = ``;
                                                                                    dd.option.map((opt) => {
                                                                                        returnHTML += html `
                                                                                                                <div class="option" style="border-radius: 5px;;padding: 1px 9px;font-size: 14px;">
                                                                                                                    ${opt.title}
                                                                                                                </div>
                                                                                                            `;
                                                                                    });
                                                                                    return html `
                                                                                                            <div class="d-flex w-100 " style="gap:8px; flex-wrap: wrap">
                                                                                                                ${returnHTML}
                                                                                                                <div
                                                                                                                    class="position-absolute "
                                                                                                                    style="right:12px;top:50%;transform: translateY(-50%);"
                                                                                                                    onclick="${gvc.event(() => {
                                                                                        createPage.page = 'add';
                                                                                        editIndex = specIndex;
                                                                                        gvc.notifyDataChange(specid);
                                                                                    })}"
                                                                                                                >
                                                                                                                    <svg
                                                                                                                        class="pen"
                                                                                                                        style="cursor:pointer"
                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                        width="16"
                                                                                                                        height="17"
                                                                                                                        viewBox="0 0 16 17"
                                                                                                                        fill="none"
                                                                                                                    >
                                                                                                                        <g clip-path="url(#clip0_8114_2928)">
                                                                                                                            <path
                                                                                                                                d="M1.13728 11.7785L0.418533 14.2191L0.0310334 15.5379C-0.0470916 15.8035 0.0247834 16.0879 0.218533 16.2816C0.412283 16.4754 0.696658 16.5473 0.959158 16.4723L2.28103 16.0816L4.72166 15.3629C5.04666 15.2691 5.34978 15.1129 5.61541 14.9098L5.62478 14.916L5.64041 14.891C5.68416 14.8566 5.72478 14.8223 5.76541 14.7879C5.80916 14.7504 5.84978 14.7098 5.89041 14.6691L15.3967 5.16602C16.081 4.48164 16.1654 3.42852 15.6529 2.65039C15.581 2.54102 15.4935 2.43477 15.3967 2.33789L14.1654 1.10352C13.3842 0.322266 12.1185 0.322266 11.3373 1.10352L1.83103 10.6098C1.75291 10.6879 1.67791 10.7723 1.60916 10.8598L1.58416 10.8754L1.59041 10.8848C1.38728 11.1504 1.23416 11.4535 1.13728 11.7785ZM11.9685 6.46914L6.16853 12.2691L4.61853 11.8816L4.23103 10.3316L10.031 4.53164L11.9685 6.46914ZM3.03103 11.716L3.27166 12.6848C3.33728 12.9535 3.54978 13.1629 3.81853 13.2316L4.78728 13.4723L4.55603 13.8223C4.47478 13.866 4.39041 13.9035 4.30291 13.9285L3.57166 14.1441L1.85603 14.6441L2.35916 12.9316L2.57478 12.2004C2.59978 12.1129 2.63728 12.0254 2.68103 11.9473L3.03103 11.716ZM9.85291 7.33477C10.0467 7.14102 10.0467 6.82227 9.85291 6.62852C9.65916 6.43477 9.34041 6.43477 9.14666 6.62852L6.14666 9.62852C5.95291 9.82227 5.95291 10.141 6.14666 10.3348C6.34041 10.5285 6.65916 10.5285 6.85291 10.3348L9.85291 7.33477Z"
                                                                                                                                fill="#393939"
                                                                                                                            />
                                                                                                                        </g>
                                                                                                                        <defs>
                                                                                                                            <clipPath id="clip0_8114_2928">
                                                                                                                                <rect
                                                                                                                                    width="16"
                                                                                                                                    height="16"
                                                                                                                                    fill="white"
                                                                                                                                    transform="translate(0 0.5)"
                                                                                                                                />
                                                                                                                            </clipPath>
                                                                                                                        </defs>
                                                                                                                    </svg>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        `;
                                                                                })()}
                                                                                                </div>`;
                                                                            }
                                                                            temp = JSON.parse(JSON.stringify(dd));
                                                                            return html `
                                                                                                <div
                                                                                                    style="background-color:white;display: flex;padding: 20px;flex-direction: column;align-items: flex-end;gap: 24px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                >
                                                                                                    <div
                                                                                                        style="display: flex;flex-direction: column;align-items: flex-end;gap: 18px;align-self: stretch;"
                                                                                                    >
                                                                                                        <div style="width:100%;display: flex;flex-direction: column;align-items: flex-end;gap: 18px;">
                                                                                                            ${ShoppingProductSetting.specInput(gvc, temp, {
                                                                                cancel: () => {
                                                                                    editSpectPage[specIndex].type = 'show';
                                                                                    editIndex = -1;
                                                                                    gvc.notifyDataChange(specid);
                                                                                },
                                                                                save: () => {
                                                                                    editSpectPage[specIndex].type = 'show';
                                                                                    postMD.specs[specIndex] = temp;
                                                                                    checkSpecSingle();
                                                                                    updateVariants();
                                                                                    gvc.notifyDataChange(vm.id);
                                                                                },
                                                                            })}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            `;
                                                                        },
                                                                        divCreate: { class: `w-100 position-relative` },
                                                                    }),
                                                                    innerHtml: (gvc) => {
                                                                        return ``;
                                                                    },
                                                                    editTitle: `編輯規格`,
                                                                    draggable: editSpectPage[specIndex].type === 'show',
                                                                };
                                                            });
                                                        },
                                                    })}
                                                                `;
                                                }
                                                if (createPage.page == 'edit' && editIndex === -1) {
                                                    let temp = {
                                                        title: '',
                                                        option: [],
                                                    };
                                                    returnHTML += html `
                                                                    ${BgWidget.mainCard(html `
                                                                        <div style="display: flex;flex-direction: column;align-items: flex-end;gap: 18px;align-self: stretch;">
                                                                            <div style="width:100%;display: flex;flex-direction: column;align-items: flex-end;gap: 18px;">
                                                                                ${ShoppingProductSetting.specInput(gvc, temp, {
                                                        cancel: () => {
                                                            createPage.page = 'add';
                                                        },
                                                        save: () => {
                                                            postMD.specs.push(temp);
                                                            createPage.page = 'add';
                                                            checkSpecSingle();
                                                            updateVariants();
                                                            gvc.notifyDataChange([vm.id]);
                                                        },
                                                    })}
                                                                            </div>
                                                                        </div>
                                                                    `)}
                                                                `;
                                                }
                                                else {
                                                    returnHTML += html `
                                                                    <div
                                                                        style="width:100%;display:flex;align-items: center;justify-content: center;color: #36B;gap:6px;cursor: pointer;"
                                                                        onclick="${gvc.event(() => {
                                                        editIndex = -1;
                                                        createPage.page = 'edit';
                                                    })}"
                                                                    >
                                                                        新增規格
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                            <path d="M1.5 7.23926H12.5" stroke="#3366BB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                            <path d="M6.76172 1.5L6.76172 12.5" stroke="#3366BB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                }
                                                return returnHTML;
                                            },
                                            divCreate: {
                                                class: `d-flex flex-column`,
                                                style: `gap:18px;`,
                                            },
                                        };
                                    })),
                                    (() => {
                                        if (postMD.variants.length === 1) {
                                            try {
                                                postMD.variants[0].editable = true;
                                                return ShoppingProductSetting.editProductSpec({
                                                    vm: obj.vm,
                                                    defData: postMD,
                                                    gvc: gvc,
                                                    single: true,
                                                });
                                            }
                                            catch (e) {
                                                console.error(e);
                                                return '';
                                            }
                                        }
                                        return '';
                                    })(),
                                    postMD.variants.length > 1
                                        ? BgWidget.mainCard(html ` <div style="font-size: 16px;font-weight: 700;color:#393939;margin-bottom: 18px;">規格設定</div>` +
                                            obj.gvc.bindView(() => {
                                                var _b;
                                                function getPreviewImage(img) {
                                                    return img || BgWidget.noImageURL;
                                                }
                                                postMD.specs[0].option = (_b = postMD.specs[0].option) !== null && _b !== void 0 ? _b : [];
                                                return {
                                                    bind: variantsViewID,
                                                    view: () => {
                                                        return gvc.bindView({
                                                            bind: 'productInf',
                                                            view: () => {
                                                                try {
                                                                    return [
                                                                        gvc.bindView({
                                                                            bind: 'selectFunRow',
                                                                            view: () => {
                                                                                let selected = postMD.variants.filter((dd) => {
                                                                                    return dd.checked;
                                                                                });
                                                                                if (selected.length) {
                                                                                    function saveQueue(key, value) {
                                                                                        postMD.variants.filter((dd) => {
                                                                                            if (dd.checked) {
                                                                                                if (key == 'volume') {
                                                                                                    dd.v_length = value.v_length;
                                                                                                    dd.v_width = value.v_width;
                                                                                                    dd.v_height = value.v_height;
                                                                                                }
                                                                                                dd[key] = value;
                                                                                            }
                                                                                        });
                                                                                        gvc.notifyDataChange('productInf');
                                                                                        gvc.glitter.closeDiaLog();
                                                                                    }
                                                                                    function editDialog(type) {
                                                                                        let inputTemp = {};
                                                                                        switch (type) {
                                                                                            case 'price': {
                                                                                                inputTemp = 0;
                                                                                                return html `
                                                                                                                  <div
                                                                                                                      style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                                  >
                                                                                                                      <div
                                                                                                                          style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                      >
                                                                                                                          編輯售價
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 d-flex flex-column"
                                                                                                                          style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                      >
                                                                                                                          將價格套用到所有選取的規格中
                                                                                                                          <input
                                                                                                                              class="w-100"
                                                                                                                              style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px 9px 18px;"
                                                                                                                              placeholder="請輸入金額"
                                                                                                                              onchange="${gvc.event((e) => {
                                                                                                    inputTemp = e.value;
                                                                                                })}"
                                                                                                                          />
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 justify-content-end d-flex"
                                                                                                                          style="padding-right: 20px;gap: 14px;"
                                                                                                                      >
                                                                                                                          ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                          ${BgWidget.save(gvc.event(() => {
                                                                                                    saveQueue('sale_price', inputTemp);
                                                                                                }))}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                              `;
                                                                                            }
                                                                                            case 'compare_price': {
                                                                                                inputTemp = 0;
                                                                                                return html `
                                                                                                                  <div
                                                                                                                      style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                                  >
                                                                                                                      <div
                                                                                                                          style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                      >
                                                                                                                          編輯原價
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 d-flex flex-column"
                                                                                                                          style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                      >
                                                                                                                          將此原價套用到所有選取的規格中
                                                                                                                          <input
                                                                                                                              class="w-100"
                                                                                                                              style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px 9px 18px;"
                                                                                                                              placeholder="請輸入金額"
                                                                                                                              onchange="${gvc.event((e) => {
                                                                                                    inputTemp = e.value;
                                                                                                })}"
                                                                                                                          />
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 justify-content-end d-flex"
                                                                                                                          style="padding-right: 20px;gap: 14px;"
                                                                                                                      >
                                                                                                                          ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                          ${BgWidget.save(gvc.event(() => {
                                                                                                    saveQueue('compare_price', inputTemp);
                                                                                                }))}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                              `;
                                                                                            }
                                                                                            case 'stock': {
                                                                                                inputTemp = 0;
                                                                                                return html ` <div
                                                                                                                  style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯庫存數量
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                  >
                                                                                                                      將存貨數量套用到所有選取的規格中
                                                                                                                      <input
                                                                                                                          class="w-100"
                                                                                                                          style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px 9px 18px;"
                                                                                                                          placeholder="請輸入數量"
                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                    inputTemp = e.value;
                                                                                                })}"
                                                                                                                      />
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                      ${BgWidget.save(gvc.event((e) => {
                                                                                                    saveQueue('stock', inputTemp);
                                                                                                }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                            }
                                                                                            case 'volume': {
                                                                                                inputTemp = {
                                                                                                    v_height: 0,
                                                                                                    v_length: 0,
                                                                                                    v_width: 0,
                                                                                                };
                                                                                                return html ` <div
                                                                                                                  style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;cursor: pointer;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯售價
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                  >
                                                                                                                      將商品材積套用到所有選取的規格中
                                                                                                                      <div class="row">
                                                                                                                          ${[
                                                                                                    {
                                                                                                        title: '長度',
                                                                                                        value: 'v_length',
                                                                                                        unit: '公分',
                                                                                                    },
                                                                                                    {
                                                                                                        title: '寬度',
                                                                                                        value: 'v_width',
                                                                                                        unit: '公分',
                                                                                                    },
                                                                                                    {
                                                                                                        title: '高度',
                                                                                                        value: 'v_height',
                                                                                                        unit: '公分',
                                                                                                    },
                                                                                                ]
                                                                                                    .map((dd) => {
                                                                                                    return html ` <div
                                                                                                                                      style="display: flex;justify-content: center;align-items: center;gap: 10px;position: relative;"
                                                                                                                                      class=" col-12 col-sm-4 mb-2"
                                                                                                                                  >
                                                                                                                                      <div style="white-space: nowrap;">${dd.title}</div>
                                                                                                                                      <input
                                                                                                                                          class="ps-3"
                                                                                                                                          style="border-radius: 10px;border: 1px solid #DDD;height: 40px;width: calc(100% - 50px);"
                                                                                                                                          type="number"
                                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                        inputTemp[dd.value] = e.value;
                                                                                                    })}"
                                                                                                                                          value="${inputTemp[dd.value]}"
                                                                                                                                      />
                                                                                                                                      <div
                                                                                                                                          style="color: #8D8D8D;position: absolute;right: 25px;top: 7px;"
                                                                                                                                      >
                                                                                                                                          ${dd.unit}
                                                                                                                                      </div>
                                                                                                                                  </div>`;
                                                                                                })
                                                                                                    .join('')}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                      ${BgWidget.save(gvc.event(() => {
                                                                                                    saveQueue('volume', inputTemp);
                                                                                                }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                            }
                                                                                            case 'weight': {
                                                                                                inputTemp = 0;
                                                                                                return html ` <div
                                                                                                                  style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯商品重量
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                  >
                                                                                                                      將商品重量套用到所有選取的規格中
                                                                                                                      <div class="w-100 row m-0" style="color:#393939;">
                                                                                                                          <input
                                                                                                                              class="col-6"
                                                                                                                              style="display: flex;height: 40px;padding: 10px 18px;align-items: center;gap: 10px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                                              placeholder="請輸入商品重量"
                                                                                                                              onchange="${gvc.event((e) => {
                                                                                                    inputTemp = e.value;
                                                                                                })}"
                                                                                                                          />
                                                                                                                          <div class="col-6" style="display: flex;align-items: center;gap: 10px;">
                                                                                                                              <div style="white-space: nowrap;">單位</div>
                                                                                                                              <select
                                                                                                                                  class="form-select d-flex align-items-center flex-fill"
                                                                                                                                  style="border-radius: 10px;border: 1px solid #DDD;padding-left: 18px;"
                                                                                                                              >
                                                                                                                                  <option value="kg">公斤</option>
                                                                                                                              </select>
                                                                                                                          </div>
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                      ${BgWidget.save(gvc.event((e) => {
                                                                                                    saveQueue('weight', inputTemp);
                                                                                                }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                            }
                                                                                            case 'sku': {
                                                                                                inputTemp = 0;
                                                                                                return html ` <div
                                                                                                                  style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF; max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯存貨單位(SKU)
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:18px;color:#393939;"
                                                                                                                  >
                                                                                                                      ${(() => {
                                                                                                    let arrayHTML = ``;
                                                                                                    postMD.specs[0].option.map((option) => {
                                                                                                        option.sortQueue.map((data) => {
                                                                                                            var _b;
                                                                                                            if (data.select) {
                                                                                                                let name = data.spec.slice(1).join('/');
                                                                                                                arrayHTML += html `
                                                                                                                                          <div
                                                                                                                                              style="display: flex;padding: 0px 20px;align-items: center;align-self: stretch;width:100%"
                                                                                                                                          >
                                                                                                                                              <div style="width: 40%;">${name}</div>
                                                                                                                                              <input
                                                                                                                                                  value="${(_b = data.sku) !== null && _b !== void 0 ? _b : ''}"
                                                                                                                                                  style="height:22px;border-radius: 10px;border: 1px solid #DDD;width:60%;padding: 18px;"
                                                                                                                                                  placeholder="請輸入存貨單位"
                                                                                                                                                  onchange="${gvc.event((e) => {
                                                                                                                    data.sku = e.value;
                                                                                                                })}"
                                                                                                                                              />
                                                                                                                                          </div>
                                                                                                                                      `;
                                                                                                            }
                                                                                                        });
                                                                                                    });
                                                                                                    return arrayHTML;
                                                                                                })()}
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                      ${BgWidget.save(gvc.event((e) => {
                                                                                                    saveQueue('weight', inputTemp);
                                                                                                }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                            }
                                                                                            case 'delete': {
                                                                                                return html ` <div
                                                                                                                  style="cursor: pointer;position:relative;display: flex;width: 432px;height: 255px;border-radius: 10px;background: #FFF;background: #FFF;align-items: center;justify-content: center;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="display: inline-flex;flex-direction: column;align-items: center;gap: 24px;"
                                                                                                                  >
                                                                                                                      <svg
                                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                                          width="76"
                                                                                                                          height="75"
                                                                                                                          viewBox="0 0 76 75"
                                                                                                                          fill="none"
                                                                                                                      >
                                                                                                                          <g clip-path="url(#clip0_8482_116881)">
                                                                                                                              <path
                                                                                                                                  d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z"
                                                                                                                                  fill="#393939"
                                                                                                                              />
                                                                                                                          </g>
                                                                                                                          <defs>
                                                                                                                              <clipPath id="clip0_8482_116881">
                                                                                                                                  <rect
                                                                                                                                      width="75"
                                                                                                                                      height="75"
                                                                                                                                      fill="white"
                                                                                                                                      transform="translate(0.5)"
                                                                                                                                  />
                                                                                                                              </clipPath>
                                                                                                                          </defs>
                                                                                                                      </svg>
                                                                                                                      <div
                                                                                                                          style="color: #393939;text-align: center;font-size: 16px;font-weight: 400;line-height: 160%;"
                                                                                                                      >
                                                                                                                          確定要刪除這個商品規格嗎？此操作將無法復原
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 justify-content-center d-flex"
                                                                                                                          style="padding-right: 20px;gap: 14px;"
                                                                                                                      >
                                                                                                                          ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                          ${BgWidget.save(gvc.event(() => {
                                                                                                    postMD.specs[0].option.map((option) => {
                                                                                                        option.sortQueue = option.sortQueue.filter((data) => !data.select);
                                                                                                    });
                                                                                                    saveQueue('delete', '');
                                                                                                }))}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  <svg
                                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                                      width="14"
                                                                                                                      height="14"
                                                                                                                      viewBox="0 0 14 14"
                                                                                                                      fill="none"
                                                                                                                      style="position: absolute;top:12px;right:12px;"
                                                                                                                      onclick="${gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                })}"
                                                                                                                  >
                                                                                                                      <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                                                                                                      <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                                                                                                  </svg>
                                                                                                              </div>`;
                                                                                            }
                                                                                            case 'shipment_type': {
                                                                                                inputTemp = 'volume';
                                                                                                let windowsid = gvc.glitter.getUUID();
                                                                                                return html ` <div
                                                                                                                  style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;font-size: 16px;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      更改運費計算方式
                                                                                                                  </div>
                                                                                                                  ${gvc.bindView({
                                                                                                    bind: windowsid,
                                                                                                    view: () => {
                                                                                                        return html `
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                            inputTemp = 'volume';
                                                                                                            gvc.notifyDataChange(windowsid);
                                                                                                        })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'volume'
                                                                                                            ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                            : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  依材積計算
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                            inputTemp = 'weight';
                                                                                                            gvc.notifyDataChange(windowsid);
                                                                                                        })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'weight'
                                                                                                            ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                            : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  依重量計算
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                            inputTemp = 'none';
                                                                                                            gvc.notifyDataChange(windowsid);
                                                                                                        })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'none'
                                                                                                            ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                            : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  不計算
                                                                                                                              </div>
                                                                                                                          `;
                                                                                                    },
                                                                                                    divCreate: {
                                                                                                        class: `w-100 d-flex flex-column`,
                                                                                                        style: `padding: 0px 20px;gap:8px;color:#393939;`,
                                                                                                    },
                                                                                                })}

                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                      ${BgWidget.save(gvc.event(() => {
                                                                                                    saveQueue('shipment_type', inputTemp);
                                                                                                }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                            }
                                                                                            case 'trace_stock_type': {
                                                                                                inputTemp = 'volume';
                                                                                                let windowsid = gvc.glitter.getUUID();
                                                                                                return html ` <div
                                                                                                                  style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;font-size: 16px;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯庫存政策
                                                                                                                  </div>

                                                                                                                  ${gvc.bindView({
                                                                                                    bind: windowsid,
                                                                                                    view: () => {
                                                                                                        return html `
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                            inputTemp = 'product';
                                                                                                            gvc.notifyDataChange(windowsid);
                                                                                                        })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'product'
                                                                                                            ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                            : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  不追蹤庫存
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                            inputTemp = 'store';
                                                                                                            gvc.notifyDataChange(windowsid);
                                                                                                        })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'store'
                                                                                                            ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                            : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  追蹤商品庫存
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                            inputTemp = 'none';
                                                                                                            gvc.notifyDataChange(windowsid);
                                                                                                        })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'none'
                                                                                                            ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                            : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  追蹤門市庫存
                                                                                                                              </div>
                                                                                                                          `;
                                                                                                    },
                                                                                                    divCreate: {
                                                                                                        class: `w-100 d-flex flex-column`,
                                                                                                        style: `padding: 0px 20px;gap:8px;color:#393939;`,
                                                                                                    },
                                                                                                })}

                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                }))}
                                                                                                                      ${BgWidget.save(gvc.event(() => {
                                                                                                    saveQueue('trace_stock_type', inputTemp);
                                                                                                }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                            }
                                                                                        }
                                                                                        return html ` <div
                                                                                                          style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;"
                                                                                                      >
                                                                                                          <div
                                                                                                              style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                          >
                                                                                                              編輯售價
                                                                                                          </div>
                                                                                                          <div
                                                                                                              class="w-100 d-flex flex-column"
                                                                                                              style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                          >
                                                                                                              將價格套用到所有選取的規格中
                                                                                                              <input
                                                                                                                  class="w-100"
                                                                                                                  style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px 9px 18px;"
                                                                                                                  placeholder="請輸入金額"
                                                                                                              />
                                                                                                          </div>
                                                                                                          <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;">
                                                                                                              ${BgWidget.cancel(gvc.event(() => {
                                                                                            gvc.glitter.closeDiaLog();
                                                                                        }))}
                                                                                                              ${BgWidget.save(gvc.event(() => { }))}
                                                                                                          </div>
                                                                                                      </div>`;
                                                                                    }
                                                                                    return html `
                                                                                                      <div
                                                                                                          style="display: flex;height: 40px;padding: 8px 17px 8px 18px;align-items: center;justify-content: space-between;gap: 4px;align-self: stretch;border-radius: 10px;background: #F7F7F7;"
                                                                                                      >
                                                                                                          <div style="display: flex; gap: 12px;align-items: center;">
                                                                                                              <i
                                                                                                                  class="fa-solid fa-square-check"
                                                                                                                  style="width: 16px;height: 16px; margin-left: 3px; cursor: pointer;color: #393939;font-size: 18px;"
                                                                                                                  onclick="${gvc.event(() => {
                                                                                        postMD.variants.map((dd) => {
                                                                                            dd.checked = false;
                                                                                        });
                                                                                        gvc.notifyDataChange(variantsViewID);
                                                                                    })}"
                                                                                                              ></i>
                                                                                                              已選取 ${selected.length} 項
                                                                                                          </div>
                                                                                                          <div
                                                                                                              style="position: relative"
                                                                                                              onclick="${gvc.event(() => {
                                                                                        selectFunRow = !selectFunRow;
                                                                                        gvc.notifyDataChange('selectFunRow');
                                                                                    })}"
                                                                                                          >
                                                                                                              <svg
                                                                                                                  style="cursor: pointer;"
                                                                                                                  width="19"
                                                                                                                  height="20"
                                                                                                                  viewBox="0 0 19 20"
                                                                                                                  fill="none"
                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                              >
                                                                                                                  <rect x="0.5" y="8" width="4" height="4" rx="2" fill="#393939" />
                                                                                                                  <rect x="7.5" y="8" width="4" height="4" rx="2" fill="#393939" />
                                                                                                                  <rect x="14.5" y="8" width="4" height="4" rx="2" fill="#393939" />
                                                                                                              </svg>
                                                                                                              ${selectFunRow
                                                                                        ? html `
                                                                                                                        <div
                                                                                                                            style="cursor: pointer;z-index:2;width:200px;gap:16px;color: #393939;font-size: 16px;font-weight: 400;position: absolute;right:-17px;top: calc(100% + 23px);display: flex;padding: 24px 24px 42px 24px;flex-direction: column;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);"
                                                                                                                        >
                                                                                                                            <div
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('price');
                                                                                            }, 'edit');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                編輯售價
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('compare_price');
                                                                                            }, 'edit');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                編輯原價
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('stock');
                                                                                            }, '');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                編輯庫存數量
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                class="d-none"
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('sku');
                                                                                            }, 'sku');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                編輯存貨單位(SKU)
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                class="d-none"
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('delete');
                                                                                            }, 'delete');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                刪除規格
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('trace_stock_type');
                                                                                            }, 'trace_stock_type');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                編輯庫存政策
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('shipment_type');
                                                                                            }, 'shipment_type');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                運費計算方式
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('volume');
                                                                                            }, 'volume');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                編輯商品材積
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                                return editDialog('weight');
                                                                                            }, 'weight');
                                                                                        })}"
                                                                                                                            >
                                                                                                                                編輯商品重量
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    `
                                                                                        : ``}
                                                                                                          </div>
                                                                                                      </div>
                                                                                                  `;
                                                                                }
                                                                                return html `
                                                                                                  <div
                                                                                                      style="border-radius: 10px;border: 1px solid #DDD;width: 100%;display: flex;height: 40px;padding: 8px 0px 8px 18px;align-items: center;"
                                                                                                  >
                                                                                                      <i
                                                                                                          class="${selected.length ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                                          style="width: 16px;height: 16px;margin-left:2px;margin-right:18px;cursor: pointer; color: ${selected.length
                                                                                    ? `#393939`
                                                                                    : `#DDD`};font-size: 18px;"
                                                                                                          onclick="${gvc.event(() => {
                                                                                    postMD.variants.map((dd) => {
                                                                                        dd.checked = !selected.length;
                                                                                    });
                                                                                    gvc.notifyDataChange([variantsViewID]);
                                                                                })}"
                                                                                                      ></i>
                                                                                                      <div style="flex:1 0 0;font-size: 16px;font-weight: 400;">規格</div>
                                                                                                      ${document.body.clientWidth < 768
                                                                                    ? html ` <div style="color:#393939;font-size: 16px;font-weight: 400;" class="me-3">售價*</div>`
                                                                                    : `${['售價*', '庫存數量*', '運費計算方式']
                                                                                        .map((dd) => {
                                                                                        return html ` <div
                                                                                                                        style="color:#393939;font-size: 16px;font-weight: 400;width: 20%; "
                                                                                                                    >
                                                                                                                        ${dd}
                                                                                                                    </div>`;
                                                                                    })
                                                                                        .join('')}`}
                                                                                                  </div>
                                                                                              `;
                                                                            },
                                                                            divCreate: { style: `` },
                                                                        }),
                                                                        gvc.bindView(() => {
                                                                            const vm = {
                                                                                id: gvc.glitter.getUUID(),
                                                                            };
                                                                            return {
                                                                                bind: vm.id,
                                                                                view: () => {
                                                                                    function cartesianProductSort(arrays) {
                                                                                        const getCombinations = (arrays, index) => {
                                                                                            if (index === arrays.length) {
                                                                                                return [[]];
                                                                                            }
                                                                                            const currentArray = arrays[index];
                                                                                            const nextCombinations = getCombinations(arrays, index + 1);
                                                                                            const currentCombinations = [];
                                                                                            for (const value of currentArray) {
                                                                                                for (const combination of nextCombinations) {
                                                                                                    currentCombinations.push([value, ...combination]);
                                                                                                }
                                                                                            }
                                                                                            return currentCombinations;
                                                                                        };
                                                                                        return getCombinations(arrays, 0);
                                                                                    }
                                                                                    function compareArrays(arr1, arr2) {
                                                                                        if (arr1.length !== arr2.length) {
                                                                                            return false;
                                                                                        }
                                                                                        for (let i = 0; i < arr1.length; i++) {
                                                                                            if (arr1[i] !== arr2[i]) {
                                                                                                return false;
                                                                                            }
                                                                                        }
                                                                                        return true;
                                                                                    }
                                                                                    return postMD.specs[0].option
                                                                                        .map((spec) => {
                                                                                        var _b;
                                                                                        const viewList = [];
                                                                                        spec.expand = (_b = spec.expand) !== null && _b !== void 0 ? _b : true;
                                                                                        if (postMD.specs.length > 1) {
                                                                                            let isCheck = !postMD.variants
                                                                                                .filter((dd) => {
                                                                                                return dd.spec[0] === spec.title;
                                                                                            })
                                                                                                .find((dd) => {
                                                                                                return !dd.checked;
                                                                                            });
                                                                                            viewList.push(html ` <div
                                                                                                                  style="display: flex;padding: 8px 0px;align-items: center;border-radius: 10px;background: #FFF;width:100%;"
                                                                                                              >
                                                                                                                  <i
                                                                                                                      class="${isCheck ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                                                      style="width: 16px;height: 16px;margin-left:19px;margin-right:18px;cursor: pointer;color: ${isCheck
                                                                                                ? `#393939`
                                                                                                : `#DDD`};font-size: 18px;"
                                                                                                                      onclick="${gvc.event(() => {
                                                                                                postMD.variants
                                                                                                    .filter((dd) => {
                                                                                                    return dd.spec[0] === spec.title;
                                                                                                })
                                                                                                    .map((dd) => {
                                                                                                    dd.checked = !isCheck;
                                                                                                });
                                                                                                gvc.notifyDataChange([vm.id, 'selectFunRow']);
                                                                                            })}"
                                                                                                                  ></i>
                                                                                                                  <div
                                                                                                                      style="flex:1 0 0;font-size: 16px;font-weight: 400;display: flex;align-items: center;
                                                                                                                              gap:${document.body.clientWidth < 800 ? 10 : 24}px;"
                                                                                                                  >
                                                                                                                      <div
                                                                                                                          onclick="${gvc.event(() => {
                                                                                                imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                                                                                    if (urlArray.length > 0) {
                                                                                                        postMD.variants
                                                                                                            .filter((dd) => {
                                                                                                            return dd.spec[0] === spec.title;
                                                                                                        })
                                                                                                            .forEach((d1) => {
                                                                                                            d1.preview_image = urlArray[0].data;
                                                                                                        });
                                                                                                        obj.gvc.notifyDataChange(vm.id);
                                                                                                    }
                                                                                                    else {
                                                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                                                        dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                                                                                    }
                                                                                                }, html ` <div
                                                                                                                                      class="d-flex flex-column"
                                                                                                                                      style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                                  >
                                                                                                                                      統一設定圖片
                                                                                                                                  </div>`, {});
                                                                                            })}"
                                                                                                                      >
                                                                                                                          ${BgWidget.validImageBox({
                                                                                                gvc,
                                                                                                image: getPreviewImage(postMD.variants.filter((dd) => dd.spec[0] === spec.title)[0]
                                                                                                    .preview_image),
                                                                                                width: 50,
                                                                                                style: 'border-radius: 10px;cursor:pointer;',
                                                                                            })}
                                                                                                                      </div>

                                                                                                                      <div
                                                                                                                          class="me-2"
                                                                                                                          style="display: flex;align-items: center;gap: 8px;cursor: pointer;overflow-wrap: anywhere;"
                                                                                                                          onclick="${gvc.event(() => {
                                                                                                spec.expand = !spec.expand;
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            })}"
                                                                                                                      >
                                                                                                                          ${spec.title}
                                                                                                                          ${spec.expand
                                                                                                ? html ` <i class="fa-regular fa-chevron-up"></i>`
                                                                                                : html ` <i class="fa-regular fa-chevron-down"></i>`}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  ${[
                                                                                                {
                                                                                                    title: '統一設定價格',
                                                                                                    key: 'sale_price',
                                                                                                },
                                                                                                {
                                                                                                    title: '統一設定存貨',
                                                                                                    key: 'stock',
                                                                                                },
                                                                                            ]
                                                                                                .filter((dd) => {
                                                                                                return dd.key === 'sale_price' || document.body.clientWidth > 768;
                                                                                            })
                                                                                                .map((dd) => {
                                                                                                let minPrice = Infinity;
                                                                                                let maxPrice = 0;
                                                                                                let stock = 0;
                                                                                                postMD.variants
                                                                                                    .filter((dd) => {
                                                                                                    return dd.spec[0] === spec.title;
                                                                                                })
                                                                                                    .map((d1) => {
                                                                                                    minPrice = Math.min(d1.sale_price, minPrice);
                                                                                                    maxPrice = Math.max(d1.sale_price, maxPrice);
                                                                                                    stock = stock + parseInt(d1.stock, 10);
                                                                                                });
                                                                                                if (dd.key == 'sale_price') {
                                                                                                    dd.title = `${minPrice} ~ ${maxPrice}`;
                                                                                                }
                                                                                                else {
                                                                                                    dd.title = `${stock}`;
                                                                                                }
                                                                                                return html ` <div
                                                                                                                              style="color:#393939;font-size: 16px;font-weight: 400;width:  ${document
                                                                                                    .body.clientWidth > 800
                                                                                                    ? `20%;`
                                                                                                    : 'auto;max-width:140px;'}padding-right: ${document.body.clientWidth >
                                                                                                    768
                                                                                                    ? `10px`
                                                                                                    : '0px'};"
                                                                                                                          >
                                                                                                                              <input
                                                                                                                                  style="height: 40px;width:100%;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;font-size: 13px;"
                                                                                                                                  placeholder="${dd.title}"
                                                                                                                                  type="number"
                                                                                                                                  min="0"
                                                                                                                                  onchange="${gvc.event((e) => {
                                                                                                    postMD.variants
                                                                                                        .filter((dd) => {
                                                                                                        return dd.spec[0] === spec.title;
                                                                                                    })
                                                                                                        .map((d1) => {
                                                                                                        d1[dd.key] = e.value;
                                                                                                    });
                                                                                                    gvc.notifyDataChange(vm.id);
                                                                                                })}"
                                                                                                                              />
                                                                                                                          </div>`;
                                                                                            })
                                                                                                .join('')}
                                                                                                                  <div
                                                                                                                      class="d-none d-sm-block"
                                                                                                                      style="color:#393939;font-size: 16px;font-weight: 400;width: 20%;"
                                                                                                                  >
                                                                                                                      <select
                                                                                                                          class="form-select"
                                                                                                                          style="height: 40px;width: 100%;padding: 0 18px;border-radius: 10px;"
                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                postMD.variants
                                                                                                    .filter((dd) => {
                                                                                                    return dd.spec[0] === spec.title;
                                                                                                })
                                                                                                    .map((dd) => {
                                                                                                    dd.shipment_type = e.value;
                                                                                                });
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            })}"
                                                                                                                      >
                                                                                                                          ${(() => {
                                                                                                let checkVolume = false;
                                                                                                let checkWeight = false;
                                                                                                postMD.variants
                                                                                                    .filter((dd) => {
                                                                                                    return dd.spec[0] === spec.title;
                                                                                                })
                                                                                                    .forEach((dd) => {
                                                                                                    if (dd.shipment_type == 'weight') {
                                                                                                        checkWeight = true;
                                                                                                    }
                                                                                                    if (dd.shipment_type == 'volume') {
                                                                                                        checkVolume = true;
                                                                                                    }
                                                                                                });
                                                                                                const data = [
                                                                                                    {
                                                                                                        class: 'd-none',
                                                                                                        value: 'all',
                                                                                                        text: '依重量,運費',
                                                                                                        select: checkVolume && checkWeight,
                                                                                                    },
                                                                                                    {
                                                                                                        class: '',
                                                                                                        value: 'none',
                                                                                                        text: '無運費',
                                                                                                        select: !checkVolume && !checkWeight,
                                                                                                    },
                                                                                                    {
                                                                                                        class: '',
                                                                                                        value: 'volume',
                                                                                                        text: '依材積',
                                                                                                        select: checkVolume && !checkWeight,
                                                                                                    },
                                                                                                    {
                                                                                                        class: '',
                                                                                                        value: 'weight',
                                                                                                        text: '依重量',
                                                                                                        select: !checkVolume && checkWeight,
                                                                                                    },
                                                                                                ];
                                                                                                return data.map((value) => {
                                                                                                    var _b;
                                                                                                    return html `
                                                                                                                                      <option
                                                                                                                                          value="${value.value}"
                                                                                                                                          class="${(_b = value.class) !== null && _b !== void 0 ? _b : ''}"
                                                                                                                                          ${value.select ? 'selected' : ''}
                                                                                                                                      >
                                                                                                                                          ${value.text}
                                                                                                                                      </option>
                                                                                                                                  `;
                                                                                                });
                                                                                            })()}
                                                                                                                      </select>
                                                                                                                  </div>
                                                                                                              </div>`);
                                                                                        }
                                                                                        if (spec.expand || postMD.specs.length === 1) {
                                                                                            postMD.variants = cartesianProductSort(postMD.specs.map((item) => {
                                                                                                return item.option.map((item2) => item2.title);
                                                                                            }))
                                                                                                .map((item) => {
                                                                                                return postMD.variants.find((variant) => {
                                                                                                    return compareArrays(variant.spec, item);
                                                                                                });
                                                                                            })
                                                                                                .filter((item) => item !== undefined);
                                                                                            viewList.push(postMD.variants
                                                                                                .filter((dd) => {
                                                                                                return dd.spec[0] === spec.title;
                                                                                            })
                                                                                                .map((data, index) => {
                                                                                                const viewID = gvc.glitter.getUUID();
                                                                                                return gvc.bindView({
                                                                                                    bind: viewID,
                                                                                                    view: () => {
                                                                                                        return html `
                                                                                                                                      <div
                                                                                                                                          style="background-color: white;position:relative;display: flex;padding: 8px 0px;align-items: center;border-radius: 10px;width:100%;"
                                                                                                                                      >
                                                                                                                                          <div
                                                                                                                                              style="flex:1 0 0;font-size: 16px;font-weight: 400;gap:14px;display: flex;align-items: center;padding-left: ${postMD
                                                                                                            .specs.length > 1 && document.body.clientWidth > 768
                                                                                                            ? `32px`
                                                                                                            : `12px`};"
                                                                                                                                              onclick="${gvc.event(() => {
                                                                                                            postMD.variants.map((dd) => {
                                                                                                                dd.editable = false;
                                                                                                            });
                                                                                                            data.editable = true;
                                                                                                            obj.vm.type = 'editSpec';
                                                                                                        })}"
                                                                                                                                          >
                                                                                                                                              <i
                                                                                                                                                  class="${data.checked
                                                                                                            ? `fa-solid fa-square-check`
                                                                                                            : `fa-regular fa-square`}"
                                                                                                                                                  style="width: 16px;height: 16px;margin-left:19px;margin-right:0px;cursor: pointer;color: ${data.checked
                                                                                                            ? `#393939`
                                                                                                            : `#DDD`};font-size: 18px;"
                                                                                                                                                  onclick="${gvc.event((e, event) => {
                                                                                                            data.checked = !data.checked;
                                                                                                            event.stopPropagation();
                                                                                                            gvc.notifyDataChange([vm.id, 'selectFunRow']);
                                                                                                        })}"
                                                                                                                                              ></i>
                                                                                                                                              ${BgWidget.validImageBox({
                                                                                                            gvc,
                                                                                                            image: getPreviewImage(data.preview_image),
                                                                                                            width: 40,
                                                                                                            style: 'border-radius: 10px',
                                                                                                        })}
                                                                                                                                              <div class="hover-underline">
                                                                                                                                                  <span>
                                                                                                                                                      ${Tool.truncateString(data.spec.join(' / '), 14)}</span
                                                                                                                                                  >
                                                                                                                                              </div>
                                                                                                                                          </div>
                                                                                                                                          ${['sale_price', 'stock']
                                                                                                            .filter((dd) => {
                                                                                                            return (dd === 'sale_price' ||
                                                                                                                document.body.clientWidth > 768);
                                                                                                        })
                                                                                                            .map((dd) => {
                                                                                                            var _b;
                                                                                                            return html ` <div
                                                                                                                                                      style="color:#393939;font-size: 16px;font-weight: 400;width:   ${document
                                                                                                                .body.clientWidth > 800
                                                                                                                ? `20%;`
                                                                                                                : 'auto;max-width:140px;'}padding-right: ${document
                                                                                                                .body.clientWidth > 800
                                                                                                                ? `12px`
                                                                                                                : '0px'};"
                                                                                                                                                  >
                                                                                                                                                      <input
                                                                                                                                                          style="width: 100%;height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                                                                                          value="${(_b = data[dd]) !== null && _b !== void 0 ? _b : 0}"
                                                                                                                                                          min="0"
                                                                                                                                                          oninput="${gvc.event((e) => {
                                                                                                                const regex = /^[0-9]*$/;
                                                                                                                if (!regex.test(e.value)) {
                                                                                                                    e.value = e.value
                                                                                                                        .replace(/[^0-9]/g, '')
                                                                                                                        .replace(/e/gi, '');
                                                                                                                }
                                                                                                            })}"
                                                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                                data[dd] = e.value;
                                                                                                                gvc.notifyDataChange(vm.id);
                                                                                                            })}"
                                                                                                                                                      />
                                                                                                                                                  </div>`;
                                                                                                        })
                                                                                                            .join('')}
                                                                                                                                          <div
                                                                                                                                              class="d-none d-sm-block"
                                                                                                                                              style="color:#393939;font-size: 16px;font-weight: 400;width: 20%;"
                                                                                                                                          >
                                                                                                                                              <select
                                                                                                                                                  class="form-select"
                                                                                                                                                  style="height: 40px;width: 100%;padding: 0 18px;border-radius: 10px;"
                                                                                                                                                  onchange="${gvc.event((e) => {
                                                                                                            data.shipment_type = e.value;
                                                                                                        })}"
                                                                                                                                              >
                                                                                                                                                  <option
                                                                                                                                                      value="none"
                                                                                                                                                      ${data.shipment_type == 'none' ? `selected` : ``}
                                                                                                                                                  >
                                                                                                                                                      無運費
                                                                                                                                                  </option>
                                                                                                                                                  <option
                                                                                                                                                      value="volume"
                                                                                                                                                      ${data.shipment_type == 'volume'
                                                                                                            ? `selected`
                                                                                                            : ``}
                                                                                                                                                  >
                                                                                                                                                      依材積
                                                                                                                                                  </option>
                                                                                                                                                  <option
                                                                                                                                                      value="weight"
                                                                                                                                                      ${data.shipment_type == 'weight'
                                                                                                            ? `selected`
                                                                                                            : ``}
                                                                                                                                                  >
                                                                                                                                                      依重量
                                                                                                                                                  </option>
                                                                                                                                              </select>
                                                                                                                                          </div>
                                                                                                                                      </div>
                                                                                                                                  `;
                                                                                                    },
                                                                                                    divCreate: {
                                                                                                        class: `w-100 ${viewID} ${index === 0 && postMD.specs.length > 1 ? `border-top` : ``}`,
                                                                                                    },
                                                                                                });
                                                                                            })
                                                                                                .join('<div class="border-bottom my-1 w-100"></div>'));
                                                                                        }
                                                                                        return viewList.join('');
                                                                                    })
                                                                                        .join('<div class="border-bottom mx-n2 my-1 w-100"></div>');
                                                                                },
                                                                                divCreate: {},
                                                                            };
                                                                        }),
                                                                    ].join('');
                                                                }
                                                                catch (e) {
                                                                    return `${e}`;
                                                                }
                                                            },
                                                            divCreate: {},
                                                        });
                                                    },
                                                    divCreate: {
                                                        class: '',
                                                        style: 'overflow: visible;',
                                                    },
                                                };
                                            }))
                                        : '',
                                    BgWidget.mainCard(obj.gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                var _b;
                                                postMD.relative_product = (_b = postMD.relative_product) !== null && _b !== void 0 ? _b : [];
                                                try {
                                                    return html `
                                                                    <div style="font-weight: 700;" class="mb-3 d-flex flex-column">相關商品 ${BgWidget.grayNote('相關商品將會顯示於商品頁底部')}</div>
                                                                    <div class="d-flex align-items-center gray-bottom-line-18" style="gap: 24px; justify-content: space-between;">
                                                                        <div class="form-check-label c_updown_label">
                                                                            <div class="tx_normal">商品列表</div>
                                                                        </div>
                                                                        ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                                        BgProduct.productsDialog({
                                                            gvc: gvc,
                                                            default: postMD.relative_product,
                                                            callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                                postMD.relative_product = value;
                                                                gvc.notifyDataChange(id);
                                                            }),
                                                            filter: (dd) => {
                                                                return dd.key !== postMD.id;
                                                            },
                                                        });
                                                    }), { textStyle: 'font-weight: 400;' })}
                                                                    </div>
                                                                    ${gvc.bindView(() => {
                                                        const vm = {
                                                            id: gvc.glitter.getUUID(),
                                                            loading: true,
                                                            data: [],
                                                        };
                                                        BgProduct.getProductOpts(postMD.relative_product).then((res) => {
                                                            vm.data = res;
                                                            vm.loading = false;
                                                            gvc.notifyDataChange(vm.id);
                                                        });
                                                        return {
                                                            bind: vm.id,
                                                            view: () => __awaiter(this, void 0, void 0, function* () {
                                                                if (vm.loading) {
                                                                    return BgWidget.spinner();
                                                                }
                                                                return vm.data
                                                                    .map((opt, index) => {
                                                                    return html ` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                            <span class="tx_normal">${index + 1} .</span>
                                                                                            ${BgWidget.validImageBox({
                                                                        gvc: gvc,
                                                                        image: opt.image,
                                                                        width: 40,
                                                                    })}
                                                                                            <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                                                            ${opt.note ? html ` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                                                        </div>`;
                                                                })
                                                                    .join('');
                                                            }),
                                                            divCreate: {
                                                                class: `d-flex py-2 flex-column`,
                                                                style: `gap:10px;`,
                                                            },
                                                        };
                                                    })}
                                                                `;
                                                }
                                                catch (e) {
                                                    console.error(e);
                                                    return '';
                                                }
                                            },
                                            divCreate: {
                                                class: `w-100`,
                                            },
                                        };
                                    })),
                                    BgWidget.mainCard(obj.gvc.bindView(() => {
                                        var _b;
                                        postMD.seo = (_b = postMD.seo) !== null && _b !== void 0 ? _b : {
                                            title: '',
                                            content: '',
                                        };
                                        return {
                                            bind: 'seo',
                                            view: () => {
                                                var _b, _c, _d;
                                                try {
                                                    postMD.seo.domain = postMD.seo.domain || postMD.title;
                                                    const href = `https://${window.parent.glitter.share.editorViewModel.domain}/products`;
                                                    return html ` <div style="font-weight: 700;" class="mb-3">搜尋引擎列表</div>
                                                                    ${[
                                                        html ` <div class="tx_normal fw-normal mb-2" style="">商品網址</div>`,
                                                        html ` <div
                                                                            style="  justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                                            .body.clientWidth > 768
                                                            ? 'gap: 18px; '
                                                            : 'flex-direction: column; gap: 0px; '}"
                                                                            class="w-100"
                                                                        >
                                                                            <div
                                                                                style="padding: 9px 18px;background: #EAEAEA;  align-items: center; gap: 5px; display: flex;${document.body
                                                            .clientWidth < 800
                                                            ? `font-size:14px;width:100%;justify-content: start;`
                                                            : `font-size: 16px;justify-content: center;`}"
                                                                            >
                                                                                <div style="text-align: right; color: #393939;  font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                                    ${href}/
                                                                                </div>
                                                                            </div>
                                                                            <input
                                                                                class="flex-fill"
                                                                                style="border:none;background:none;text-align: start; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word;${document
                                                            .body.clientWidth > 768
                                                            ? ''
                                                            : 'padding: 9px 18px;width:100%;'}"
                                                                                placeholder="請輸入商品連結"
                                                                                value="${postMD.seo.domain || ''}"
                                                                                onchange="${gvc.event((e) => {
                                                            let text = e.value;
                                                            if (!CheckInput.isChineseEnglishNumberHyphen(text)) {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.infoMessage({ text: '連結僅限使用中英文數字與連接號' });
                                                            }
                                                            else {
                                                                postMD.seo.domain = text;
                                                            }
                                                            gvc.notifyDataChange('seo');
                                                        })}"
                                                                            />
                                                                        </div>`,
                                                        html ` <div class="mt-2 mb-1">
                                                                            <span class="tx_normal me-1">網址預覽</span>
                                                                            ${BgWidget.greenNote(href + `/${postMD.seo.domain}`, gvc.event(() => {
                                                            window.parent.glitter.openNewTab(href + `/${postMD.seo.domain}`);
                                                        }))}
                                                                        </div>`,
                                                    ].join('')}
                                                                    <div class="w-100" style="margin: 18px 0 8px;">SEO標題</div>
                                                                    <input
                                                                        value="${(_b = postMD.seo.title) !== null && _b !== void 0 ? _b : ''}"
                                                                        style="width: 100%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                                        postMD.seo.title = e.value;
                                                        obj.gvc.notifyDataChange('seo');
                                                    })}"
                                                                    />
                                                                    <div class="w-100" style="margin: 18px 0 8px;">SEO描述</div>
                                                                    <textarea
                                                                        rows="4"
                                                                        value="${(_c = postMD.seo.content) !== null && _c !== void 0 ? _c : ''}"
                                                                        style="width: 100%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                                        postMD.seo.content = e.value;
                                                        obj.gvc.notifyDataChange('seo');
                                                    })}"
                                                                    >
${(_d = postMD.seo.content) !== null && _d !== void 0 ? _d : ''}</textarea
                                                                    >`;
                                                }
                                                catch (e) {
                                                    console.error(e);
                                                    return '';
                                                }
                                            },
                                        };
                                    })),
                                ]
                                    .filter((str) => str.length > 0)
                                    .join(BgWidget.mbContainer(18)),
                                ratio: 75,
                            }, {
                                html: html ` <div class="summary-card p-0">
                                            ${[
                                    BgWidget.mainCard(html `
                                                        <div style="font-weight: 700;" class="mb-2">商品類型</div>
                                                        <div style="font-weight: 400;" class="mb-2">${this.getProductTypeString(postMD)}</div>
                                                    `),
                                    BgWidget.mainCard(html ` <div class="mb-2" style="font-weight: 700;">商品狀態</div>
                                                        ${gvc.bindView((() => {
                                        const id = gvc.glitter.getUUID();
                                        const inputStyle = 'display: block; width: 200px;';
                                        function settingSchedule(activeSchedule) {
                                            const original = JSON.parse(JSON.stringify(activeSchedule));
                                            const originalState = ShoppingProductSetting.getTimeState(original);
                                            return BgWidget.settingDialog({
                                                gvc: gvc,
                                                title: '設定上下架時間',
                                                closeCallback: () => {
                                                    postMD.active_schedule = original;
                                                },
                                                innerHTML: (gvc) => {
                                                    var _b, _c;
                                                    return html `<div class="d-flex flex-column gap-3">
                                                                                ${BgWidget.grayNote('若系統時間大於設定的開始時間，商品狀態將會從「待上架」自動變成「上架」')}
                                                                                <div class="d-flex mb-1 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                                                    <div class="d-flex flex-column">
                                                                                        <span class="tx_normal me-2">開始日期</span>
                                                                                        ${BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'date',
                                                        style: inputStyle,
                                                        default: `${original.startDate}`,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            postMD.active_schedule.startDate = text;
                                                        },
                                                    })}
                                                                                    </div>
                                                                                    <div class="d-flex flex-column">
                                                                                        <span class="tx_normal me-2">開始時間</span>
                                                                                        ${BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'time',
                                                        style: inputStyle,
                                                        default: `${original.startTime}`,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            postMD.active_schedule.startTime = text;
                                                        },
                                                    })}
                                                                                    </div>
                                                                                </div>
                                                                                ${BgWidget.multiCheckboxContainer(gvc, [
                                                        {
                                                            key: 'noEnd',
                                                            name: '無期限',
                                                        },
                                                        {
                                                            key: 'withEnd',
                                                            name: '結束時間',
                                                            innerHtml: html ` <div
                                                                                                class="d-flex mt-0 mt-md-1 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                                                                                style="gap: 12px"
                                                                                            >
                                                                                                <div class="d-flex flex-column">
                                                                                                    <span class="tx_normal me-2">結束日期</span>
                                                                                                    ${BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                type: 'date',
                                                                style: inputStyle,
                                                                default: `${(_b = original.endDate) !== null && _b !== void 0 ? _b : ''}`,
                                                                placeHolder: '',
                                                                callback: (text) => {
                                                                    postMD.active_schedule.endDate = text;
                                                                },
                                                            })}
                                                                                                </div>
                                                                                                <div class="d-flex flex-column">
                                                                                                    <span class="tx_normal me-2">結束時間</span>
                                                                                                    ${BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                type: 'time',
                                                                style: inputStyle,
                                                                default: `${(_c = original.endTime) !== null && _c !== void 0 ? _c : ''}`,
                                                                placeHolder: '',
                                                                callback: (text) => {
                                                                    postMD.active_schedule.endTime = text;
                                                                },
                                                            })}
                                                                                                </div>
                                                                                            </div>`,
                                                        },
                                                    ], [original.endDate ? `withEnd` : `noEnd`], (text) => {
                                                        if (text[0] === 'noEnd') {
                                                            postMD.active_schedule.endDate = undefined;
                                                            postMD.active_schedule.endTime = undefined;
                                                        }
                                                    }, { single: true })}
                                                                            </div>`;
                                                },
                                                footer_html: (gvc) => {
                                                    return [
                                                        BgWidget.save(gvc.event(() => {
                                                            const realGVC = obj.gvc;
                                                            const dialog = new ShareDialog(obj.gvc.glitter);
                                                            const state = ShoppingProductSetting.getTimeState(postMD.active_schedule);
                                                            function refresh(bool) {
                                                                if (!postMD.active_schedule.startDate || !postMD.active_schedule.startTime) {
                                                                    dialog.errorMessage({ text: '請輸入開始日期與時間' });
                                                                    return;
                                                                }
                                                                if ((postMD.active_schedule.endDate && !postMD.active_schedule.endTime) ||
                                                                    (!postMD.active_schedule.endDate && postMD.active_schedule.endTime)) {
                                                                    dialog.errorMessage({ text: '請輸入結束日期與時間' });
                                                                    return;
                                                                }
                                                                if (bool) {
                                                                    gvc.closeDialog();
                                                                    realGVC.notifyDataChange(id);
                                                                }
                                                            }
                                                            if (originalState !== state) {
                                                                switch (state) {
                                                                    case 'afterEnd':
                                                                        dialog.warningMessage({
                                                                            text: '您的時間設定將會更改商品狀態為「下架」<br/>是否確定更改嗎？',
                                                                            callback: (bool) => {
                                                                                refresh(bool);
                                                                            },
                                                                        });
                                                                        return;
                                                                    case 'inRange':
                                                                        dialog.warningMessage({
                                                                            text: '您的時間設定將會更改商品狀態為「上架」<br/>是否確定更改嗎？',
                                                                            callback: (bool) => {
                                                                                refresh(bool);
                                                                            },
                                                                        });
                                                                        return;
                                                                    case 'beforeStart':
                                                                        dialog.warningMessage({
                                                                            text: '您的時間設定將會更改商品狀態為「待上架」<br/>是否確定更改嗎？',
                                                                            callback: (bool) => {
                                                                                refresh(bool);
                                                                            },
                                                                        });
                                                                        return;
                                                                    default:
                                                                        refresh(true);
                                                                        return;
                                                                }
                                                            }
                                                            else {
                                                                refresh(true);
                                                            }
                                                        })),
                                                    ].join('');
                                                },
                                            });
                                        }
                                        return {
                                            bind: id,
                                            view: () => {
                                                const state = ShoppingProductSetting.getTimeState(postMD.active_schedule);
                                                return [
                                                    BgWidget.select({
                                                        gvc: obj.gvc,
                                                        default: (() => {
                                                            if (postMD.status === 'draft') {
                                                                return 'draft';
                                                            }
                                                            switch (state) {
                                                                case 'afterEnd':
                                                                    return 'inactive';
                                                                case 'beforeStart':
                                                                    return 'schedule';
                                                                case 'inRange':
                                                                default:
                                                                    return 'active';
                                                            }
                                                        })(),
                                                        options: [
                                                            { key: 'active', value: '上架' },
                                                            { key: 'schedule', value: '待上架' },
                                                            { key: 'inactive', value: '下架' },
                                                            { key: 'draft', value: '草稿' },
                                                        ],
                                                        callback: (text) => {
                                                            switch (text) {
                                                                case 'active':
                                                                    postMD.active_schedule = this.getActiveDatetime();
                                                                    postMD.status = 'active';
                                                                    break;
                                                                case 'schedule':
                                                                    settingSchedule(postMD.active_schedule);
                                                                    postMD.status = 'active';
                                                                    break;
                                                                case 'inactive':
                                                                    postMD.active_schedule = this.getInactiveDatetime();
                                                                    postMD.status = 'active';
                                                                    break;
                                                                default:
                                                                    postMD.active_schedule = {};
                                                                    postMD.status = 'draft';
                                                                    break;
                                                            }
                                                            gvc.notifyDataChange(id);
                                                        },
                                                    }),
                                                    (() => {
                                                        const state = ShoppingProductSetting.getTimeState(postMD.active_schedule);
                                                        const upload = postMD.active_schedule.startDate
                                                            ? `預計上架時間：${postMD.active_schedule.startDate} ${postMD.active_schedule.startTime}`
                                                            : '';
                                                        const remove = postMD.active_schedule.endDate
                                                            ? `預計下架時間：${postMD.active_schedule.endDate} ${postMD.active_schedule.endTime}`
                                                            : '';
                                                        if (state === 'beforeStart') {
                                                            return BgWidget.grayNote(`${upload} <br /> ${remove}`);
                                                        }
                                                        if (state === 'inRange' && remove.length > 0) {
                                                            return BgWidget.grayNote(remove);
                                                        }
                                                        return '';
                                                    })(),
                                                    state !== 'draft'
                                                        ? BgWidget.darkButton('設定上下架時間', gvc.event(() => {
                                                            settingSchedule(postMD.active_schedule);
                                                        }), {
                                                            style: 'width:100%;',
                                                        })
                                                        : '',
                                                ]
                                                    .filter((str) => str.length > 0)
                                                    .join(BgWidget.mbContainer(12));
                                            },
                                        };
                                    })())}`),
                                    BgWidget.mainCard(obj.gvc.bindView(() => {
                                        const id = obj.gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return [
                                                    html ` <div style="font-weight: 700;" class="mb-2">商品分類</div>`,
                                                    postMD.collection
                                                        .map((dd) => {
                                                        return html `<span style="font-size: 14px;">${dd}</span>`;
                                                    })
                                                        .join(html `<div class="my-1"></div>`),
                                                    html ` <div class="w-100 mt-3">
                                                                        ${BgWidget.darkButton(`設定商品分類`, gvc.event(() => {
                                                        BgProduct.collectionsDialog({
                                                            gvc: gvc,
                                                            default: postMD.collection.map((dd) => {
                                                                return dd;
                                                            }),
                                                            callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                                postMD.collection = value;
                                                                gvc.notifyDataChange(id);
                                                            }),
                                                        });
                                                    }), {
                                                        style: 'width:100%;',
                                                    })}
                                                                    </div>`,
                                                ].join('');
                                            },
                                            divCreate: {},
                                        };
                                    })),
                                    BgWidget.mainCard(obj.gvc.bindView(() => {
                                        const id = obj.gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return [
                                                    html `<div style="font-weight: 700;" class="mb-2">AI 選品</div>`,
                                                    BgWidget.grayNote(postMD.ai_description || '尚未設定描述語句，透過設定描述語句，可以幫助AI更準確的定位產品。'),
                                                    html `<div class="my-2"></div>`,
                                                    BgWidget.darkButton(`設定描述語句`, gvc.event(() => {
                                                        function refresh() {
                                                            gvc.notifyDataChange(id);
                                                        }
                                                        let description = postMD.ai_description;
                                                        BgWidget.settingDialog({
                                                            gvc: gvc,
                                                            title: '描述語句',
                                                            innerHTML: (gvc) => {
                                                                return BgWidget.textArea({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    default: postMD.ai_description || '',
                                                                    placeHolder: `請告訴我這是什麼商品，範例:現代極簡風格的淺灰色布藝沙發，可以同時乘坐3個人，配金屬腳座，採用鈦合金製作十分的堅固。`,
                                                                    callback: (text) => {
                                                                        description = text;
                                                                    },
                                                                    style: `min-height:100px;`,
                                                                });
                                                            },
                                                            footer_html: (gvc) => {
                                                                return [
                                                                    BgWidget.save(gvc.event(() => {
                                                                        postMD.ai_description = description;
                                                                        refresh();
                                                                        gvc.closeDialog();
                                                                    })),
                                                                ].join('');
                                                            },
                                                        });
                                                    }), {
                                                        style: 'width:100%;',
                                                    }),
                                                ].join('');
                                            },
                                        };
                                    })),
                                ]
                                    .filter((str) => str.length > 0)
                                    .join(BgWidget.mbContainer(18))}
                                        </div>`,
                                ratio: 25,
                            })}
                            `),
                            html ` <div class="update-bar-container">
                            ${obj.type === 'replace'
                                ? BgWidget.danger(obj.gvc.event(() => {
                                    const dialog = new ShareDialog(obj.gvc.glitter);
                                    dialog.checkYesOrNot({
                                        text: '是否確認刪除商品?',
                                        callback: (response) => {
                                            if (response) {
                                                dialog.dataLoading({ visible: true });
                                                ApiShop.delete({
                                                    id: postMD.id,
                                                }).then((res) => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (res.result) {
                                                        obj.vm.type = 'list';
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '刪除失敗' });
                                                    }
                                                });
                                            }
                                        },
                                    });
                                }), '刪除商品')
                                : ''}
                            ${BgWidget.cancel(obj.gvc.event(() => {
                                obj.vm.type = 'list';
                            }))}
                            ${BgWidget.save(obj.gvc.event(() => {
                                setTimeout(() => {
                                    function checkEmpty() {
                                        const checkList = ['title'];
                                        const variantsCheckList = ['sale_price'];
                                        const dialog = new ShareDialog(gvc.glitter);
                                        const obj = checkList.find((checkItem) => {
                                            return postMD[checkItem] == undefined || postMD[checkItem].length == 0;
                                        });
                                        for (const checkItem of checkList) {
                                            if (postMD[checkItem] == undefined || postMD[checkItem].length == 0) {
                                                dialog.infoMessage({
                                                    text: '商品名稱未填',
                                                });
                                                return false;
                                            }
                                        }
                                        for (const checkItem of variantsCheckList) {
                                            if (postMD['variants'][0][checkItem] == undefined || postMD['variants'][0][checkItem] == 0) {
                                                dialog.infoMessage({
                                                    text: '售價未填',
                                                });
                                                return false;
                                            }
                                        }
                                        for (const index in postMD['variants']) {
                                            const variant = postMD['variants'][index];
                                            if (variant['shipment_type'] == 'volume') {
                                                if (variant['v_height'] == undefined ||
                                                    Number(variant['v_height']) == 0 ||
                                                    variant['v_width'] == undefined ||
                                                    Number(variant['v_width']) == 0 ||
                                                    variant['v_length'] == undefined ||
                                                    Number(variant['v_length']) == 0) {
                                                    dialog.infoMessage({
                                                        text: `規格 ${variant.spec.join(',')} 材積資訊未填`,
                                                    });
                                                    return false;
                                                }
                                            }
                                            if (variant['shipment_type'] == 'weight') {
                                                if (variant['weight'] == undefined || Number(variant['weight']) == 0) {
                                                    dialog.infoMessage({
                                                        text: `${variant.spec.length > 1 ? variant.spec.join(',') : ''}重量未填`,
                                                    });
                                                    return false;
                                                }
                                            }
                                        }
                                        return true;
                                    }
                                    if (postMD.id && postMD.status !== 'draft' && Object.keys(postMD.active_schedule).length === 0) {
                                        postMD.active_schedule = this.getActiveDatetime();
                                    }
                                    postMD.active_schedule.start_ISO_Date = (() => {
                                        try {
                                            return new Date(`${postMD.active_schedule.startDate} ${postMD.active_schedule.startTime}`).toISOString();
                                        }
                                        catch (error) {
                                            return undefined;
                                        }
                                    })();
                                    postMD.active_schedule.end_ISO_Date = (() => {
                                        try {
                                            return new Date(`${postMD.active_schedule.endDate} ${postMD.active_schedule.endTime}`).toISOString();
                                        }
                                        catch (error) {
                                            return undefined;
                                        }
                                    })();
                                    if (checkEmpty()) {
                                        if (postMD.id) {
                                            ShoppingProductSetting.putEvent(postMD, obj.gvc, obj.vm);
                                        }
                                        else {
                                            ShoppingProductSetting.postEvent(postMD, obj.gvc, obj.vm);
                                        }
                                    }
                                }, 500);
                            }), '儲存', 'guide5-8')}
                        </div>`,
                        ].join('');
                    },
                    divCreate: {
                        class: `d-flex`,
                        style: `font-size: 16px;color:#393939;position: relative;padding-bottom:240px;`,
                    },
                };
            });
        });
    }
    static specInput(gvc, temp, cb) {
        const html = String.raw;
        const vm = {
            viewId: Tool.randomString(7),
            enterId: Tool.randomString(7),
        };
        let keyboard = '';
        return html ` <div class="bg-white w-100">
            ${[
            html ` <div class="w-100" style="display: flex;gap: 8px;flex-direction: column;">
                    <div style="width: 70px">規格種類</div>
                    <input
                        class="w-100"
                        style="height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;"
                        placeholder="例如 : 顏色、大小"
                        value="${temp.title}"
                        onchange="${gvc.event((e) => {
                var _b;
                temp.title = (_b = e === null || e === void 0 ? void 0 : e.value) !== null && _b !== void 0 ? _b : '';
            })}"
                    />
                </div>`,
            gvc.bindView({
                bind: vm.viewId,
                view: () => {
                    return html `
                            <div class="w-100" style="margin-top: 8px;">選項 (輸入完請按enter)</div>
                            <div
                                class="w-100 d-flex align-items-center position-relative"
                                style="line-height: 40px;min-height: 40px;padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;gap: 10px; flex-wrap: wrap;"
                            >
                                <div class="d-flex align-items-center" style="gap: 10px; flex-wrap: wrap;">
                                    ${(() => {
                        const tempHTML = [];
                        temp.option.map((data, index) => {
                            tempHTML.push(html `
                                                    <div
                                                        class="d-flex align-items-center"
                                                        style="height: 24px;border-radius: 5px;background: #F2F2F2;display: flex;padding: 1px 6px;justify-content: center;align-items: center;gap: 4px;"
                                                    >
                                                        ${data.title}<i
                                                            class="fa-solid fa-xmark ms-1 fs-5"
                                                            style="font-size: 12px;cursor: pointer;"
                                                            onclick="${gvc.event(() => {
                                temp.option.splice(index, 1);
                                gvc.notifyDataChange(vm.viewId);
                            })}"
                                                        ></i>
                                                    </div>
                                                `);
                        });
                        tempHTML.push(html `<input
                                            id="${vm.enterId}"
                                            class="flex-fill d-flex align-items-center border-0 specInput-${vm.enterId} h-100"
                                            value=""
                                            placeholder="${temp.option.length > 0 ? '請繼續輸入' : ''}"
                                        />`);
                        return tempHTML.join('');
                    })()}
                                </div>
                                <div
                                    class="d-flex align-items-center ${temp.option.length > 0 ? 'd-none' : ''}"
                                    style="color: #8D8D8D;width: 100%;height:100%;position: absolute;left: 18px;top: 0"
                                    onclick="${gvc.event((e) => {
                        e.classList.add('d-none');
                        setTimeout(() => {
                            document.querySelector('.specInput-${vm.enterId}').focus();
                        }, 100);
                    })}"
                                >
                                    例如 : 黑色、S號
                                </div>
                            </div>
                        `;
                },
                divCreate: {
                    class: 'w-100 bg-white',
                    style: 'display: flex;gap: 8px;flex-direction: column;',
                },
                onCreate: () => {
                    var _b;
                    let enterPass = true;
                    const inputElement = document.getElementById(vm.enterId);
                    gvc.glitter.share.keyDownEvent = (_b = gvc.glitter.share.keyDownEvent) !== null && _b !== void 0 ? _b : {};
                    keyboard === 'Enter' && inputElement && inputElement.focus();
                    inputElement.addEventListener('compositionupdate', function () {
                        enterPass = false;
                    });
                    inputElement.addEventListener('compositionend', function () {
                        enterPass = true;
                    });
                    document.removeEventListener('keydown', gvc.glitter.share.keyDownEvent[vm.enterId]);
                    gvc.glitter.share.keyDownEvent[vm.enterId] = (event) => {
                        keyboard = event.key;
                        if (enterPass && inputElement && inputElement.value.length > 0 && event.key === 'Enter') {
                            setTimeout(() => {
                                temp.option.push({
                                    title: inputElement.value,
                                });
                                inputElement.value = '';
                                temp.option = temp.option.reduce((acc, current) => {
                                    const isTitleExist = acc.find((item) => item.title === current.title);
                                    if (!isTitleExist) {
                                        acc.push(current);
                                    }
                                    return acc;
                                }, []);
                                gvc.notifyDataChange(vm.viewId);
                            }, 30);
                        }
                    };
                    document.addEventListener('keydown', gvc.glitter.share.keyDownEvent[vm.enterId]);
                },
            }),
            html ` <div class="d-flex w-100 justify-content-end align-items-center w-100 bg-white" style="gap:14px; margin-top: 12px;">
                    ${BgWidget.cancel(gvc.event(() => {
                cb.cancel();
            }))}
                    ${BgWidget.save(gvc.event(() => {
                cb.save();
            }), '完成')}
                </div>`,
        ].join('')}
        </div>`;
    }
    static putEvent(postMD, gvc, vm) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiShop.putProduct({
            data: postMD,
            token: window.parent.config.token,
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                dialog.successMessage({ text: `更改成功` });
                vm.type = 'list';
            }
            else if (re.response.data.code === '733') {
                dialog.errorMessage({ text: `此網域已被使用` });
            }
            else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }
    static postEvent(postMD, gvc, vm) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiShop.postProduct({
            data: postMD,
            token: window.parent.config.token,
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                dialog.successMessage({ text: `上傳成功` });
                vm.type = 'list';
            }
            else if (re.response.data.code === '733') {
                dialog.errorMessage({ text: `此網域已被使用` });
            }
            else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }
    static getProductTypeString(product) {
        var _b;
        product.productType = (_b = product.productType) !== null && _b !== void 0 ? _b : {
            product: true,
            addProduct: false,
            giveaway: false,
        };
        if (product.productType['product']) {
            if ((product.visible || 'true') === 'false') {
                return '隱形賣場';
            }
            else {
                return '前台商品';
            }
        }
        else if (product.productType['addProduct']) {
            return '加購品';
        }
        else if (product.productType['giveaway']) {
            return '贈品';
        }
        return '未知';
    }
    static getTimeState(jsonData) {
        const now = new Date();
        const { startDate, startTime, endDate, endTime } = jsonData;
        const start = startDate && startTime ? new Date(`${startDate}T${startTime}`) : null;
        const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;
        if (!start)
            return 'draft';
        if (start && now < start) {
            return 'beforeStart';
        }
        if (end && now > end) {
            return 'afterEnd';
        }
        if (start && now >= start && (!end || now <= end)) {
            return 'inRange';
        }
        return 'draft';
    }
}
_a = ShoppingProductSetting;
ShoppingProductSetting.getActiveDatetime = () => {
    return {
        startDate: _a.getDateTime().date,
        startTime: '00:00',
        endDate: undefined,
        endTime: undefined,
    };
};
ShoppingProductSetting.getScheduleDatetime = () => {
    return {
        startDate: _a.getDateTime(7).date,
        startTime: _a.getDateTime(7).time,
        endDate: _a.getDateTime(14).date,
        endTime: _a.getDateTime(14).time,
    };
};
ShoppingProductSetting.getInactiveDatetime = () => {
    return {
        startDate: _a.getDateTime(-1).date,
        startTime: '00:00',
        endDate: _a.getDateTime(-1).date,
        endTime: '00:00',
    };
};
ShoppingProductSetting.getDateTime = (n = 0) => {
    const now = new Date();
    now.setDate(now.getDate() + n);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:00`;
    return { date: dateStr, time: timeStr };
};
window.glitter.setModule(import.meta.url, ShoppingProductSetting);
