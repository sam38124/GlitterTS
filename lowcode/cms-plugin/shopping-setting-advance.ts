import {BgWidget} from '../backend-manager/bg-widget.js';
import {GVC} from '../glitterBundle/GVController.js';
import {QuestionInfo} from './module/question-info.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {BgProduct, OptionsItem} from '../backend-manager/bg-product.js';
import {Product} from '../public-models/product.js';
import {ApiPageConfig} from '../api/pageConfig.js';

const html = String.raw;

export class ShoppingSettingAdvance {
    public static main(obj: {
        gvc: GVC;
        vm: any;
        vm2: {
            id: string;
            language: any;
            content_detail: any;
        };
        reload: () => void;
        language_data: any;
        postMD: Product;
        shipment_config: any;
    }) {
        const gvc = obj.gvc;
        const postMD = obj.postMD;
        const vm = obj.vm2;
        const shipment_config = obj.shipment_config;
        const variantsViewID = gvc.glitter.getUUID();

        function updateVariants() {
            const remove_indexs: number[] = [];
            let complexity = 1;
            postMD.specs = postMD.specs.filter((dd) => {
                return dd.option && dd.option.length !== 0;
            });
            postMD.specs.map((spec) => {
                complexity *= spec.option.length;
            });
            const cType: string[][] = [];

            function generateCombinations(specs: any, currentCombination: any, index = 0) {
                if (
                    index === specs.length &&
                    currentCombination.length > 0 &&
                    cType.findIndex((ct: string[]) => {
                        return JSON.stringify(ct) === JSON.stringify(currentCombination);
                    }) === -1
                ) {
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

            function checkSpecInclude(spec: string, index: number) {
                if (postMD.specs[index]) {
                    for (const {title} of postMD.specs[index].option) {
                        if (spec === title) return true;
                    }
                    return false;
                }
                return false;
            }

            for (let n = 0; n < complexity; n++) {
                let currentCombination: any = [];
                generateCombinations(
                    postMD.specs.map((dd) => {
                        return dd.option.map((dd: any) => {
                            return dd.title;
                        });
                    }),
                    currentCombination
                );
                const waitAdd = cType.find((dd: any) => {
                    return !postMD.variants.find((d2) => {
                        return JSON.stringify(d2.spec) === JSON.stringify(dd);
                    });
                });
                if (waitAdd && postMD.variants[0].spec.length == 0) {
                    postMD.variants[0].spec = waitAdd;
                } else if (waitAdd) {
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
                        stockList: {},
                        preview_image: '',
                    });
                }
            }

            if (postMD.variants && postMD.variants.length > 0) {
                postMD.variants.map((variant: any, index1: number) => {
                    if (variant.spec.length !== postMD.specs.length) {
                        remove_indexs.push(index1);
                    }
                    variant.spec.map((sp: string, index2: number) => {
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
                    if (
                        !postMD.specs[index] ||
                        !postMD.specs[index].option.find((dd: any) => {
                            return dd.title === b;
                        })
                    ) {
                        pass = false;
                        break;
                    }
                    index++;
                }
                return pass && variant.spec.length === postMD.specs.length;
            });

            // 當規格為空時，需補一個進去
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
                    stockList: {},
                    preview_image: '',
                });
            }
            postMD.variants.map((dd: any) => {
                dd.checked = undefined;
                return dd;
            });
            obj.vm.replaceData = postMD;
            obj.gvc.notifyDataChange(variantsViewID);
        }

        updateVariants();

        const cat_title = (() => {
            switch (postMD.product_category) {
                case "commodity":
                    return '商品'
                case 'course':
                    return '課程'
                default:
                    return '商品'
            }
        })()
        return BgWidget.container(
            gvc.bindView(() => {
                const id = gvc.glitter.getUUID();

                function refresh() {
                    gvc.notifyDataChange(id);
                }

                return {
                    bind: id,
                    view: () => {
                        return [
                            BgWidget.mainCard(
                                [
                                    html`
                                        <div class="d-flex flex-column guide5-4">
                                            <div style="font-weight: 700;" class="mb-1">${cat_title}標籤
                                                ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                                            </div>
                                            ${BgWidget.grayNote('用戶於前台搜尋標籤，即可搜尋到此' + cat_title)}
                                            <div class="mb-2"></div>
                                            ${BgWidget.multipleInput(gvc, (postMD.product_tag.language as any)[vm.language], {
                                                save: (def) => {
                                                    (postMD.product_tag.language as any)[vm.language] = def;
                                                },
                                            })}
                                        </div>
                                    `,
                                    html`
                                        <div class="mt-2 mb-2 position-relative" style="font-weight: 700;">
                                            ${cat_title}促銷標籤
                                            ${BgWidget.questionButton(
                                                    gvc.event(() => {
                                                        QuestionInfo.promoteLabel(gvc);
                                                    })
                                            )}
                                        </div>
                                        ${gvc.bindView(
                                                (() => {
                                                    const id = gvc.glitter.getUUID();
                                                    const inputStyle = 'display: block; width: 200px;';
                                                    let options: any[] = [];
                                                    ApiUser.getPublicConfig('promo-label', 'manager').then((data: any) => {
                                                        options = data.response.value
                                                                .map((label: any) => {
                                                                    return {
                                                                        key: label.id,
                                                                        value: label.title,
                                                                    };
                                                                })
                                                                .concat([
                                                                    {
                                                                        key: '',
                                                                        value: '不設定',
                                                                    },
                                                                ]);
                                                        gvc.notifyDataChange(id);
                                                    });
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return BgWidget.select({
                                                                gvc: obj.gvc,
                                                                default: postMD.label || '',
                                                                options: options,
                                                                callback: (text: any) => {
                                                                    postMD.label = text || undefined;
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                            });
                                                        },
                                                    };
                                                })()
                                        )}`,
                                    (postMD.product_category === 'course') ? `` : `<div class="d-flex flex-column mt-2">
                                        <div style="font-weight: 700;" class="mb-1">數量單位 ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}</div>
                                        ${BgWidget.grayNote('例如 : 坪、件、個、打，預設單位為件。')}
                                        <div class="mb-2"></div>
                                        ${BgWidget.editeInput({
                                        gvc: obj.gvc,
                                        default: `${(postMD.unit as any)[vm.language] || ''}`,
                                        title: '',
                                        type: 'text',
                                        placeHolder: `件`,
                                        callback: (text: any) => {
                                            (postMD.unit as any)[vm.language] = text;
                                            gvc.notifyDataChange(id);
                                        },
                                    })}
                                    </div>`
                                ].join('')
                            ),
                            BgWidget.mainCard(
                                [
                                    html`
                                        <div class="d-flex flex-column guide5-4">
                                            <div style="font-weight: 700;" class="mb-2">${cat_title}購買限制</div>
                                        </div>
                                    `,
                                    ...(postMD.productType.giveaway
                                        ? []
                                        : [
                                            {
                                                title: '最低需要購買多少',
                                                key: 'min_qty',
                                                checked: postMD.min_qty,
                                            },
                                            {
                                                title: '最高只能購買多少',
                                                key: 'max_qty',
                                                checked: postMD.max_qty,
                                            },
                                            {
                                                title: `需連同特定${cat_title}一併購買`,
                                                key: 'match_by_with',
                                                checked: postMD.match_by_with,
                                            },
                                            {
                                                title: `過往購買過特定${cat_title}才能購買此${cat_title}`,
                                                key: 'legacy_by_with',
                                                checked: postMD.legacy_by_with,
                                            },
                                        ].map((dd) => {
                                            const text_ = [
                                                BgWidget.inlineCheckBox({
                                                    title: '',
                                                    gvc: gvc,
                                                    def: [dd.checked ? dd.key : ``],
                                                    array: [
                                                        {
                                                            title: dd.title,
                                                            value: dd.key,
                                                        },
                                                    ],
                                                    callback: (text) => {
                                                        switch (dd.key) {
                                                            case 'min_qty':
                                                            case 'max_qty':
                                                                if ((postMD as any)[dd.key]) {
                                                                    delete (postMD as any)[dd.key];
                                                                } else {
                                                                    (postMD as any)[dd.key] = 1;
                                                                }
                                                                gvc.notifyDataChange(id);
                                                                break;
                                                            case 'match_by_with':
                                                                if ((postMD as any)['match_by_with']) {
                                                                    delete (postMD as any)['match_by_with'];
                                                                } else {
                                                                    (postMD as any)['match_by_with'] = [];
                                                                }
                                                                gvc.notifyDataChange(id);
                                                                break;
                                                            case 'legacy_by_with':
                                                                if ((postMD as any)['legacy_by_with']) {
                                                                    delete (postMD as any)['legacy_by_with'];
                                                                } else {
                                                                    (postMD as any)['legacy_by_with'] = [];
                                                                }
                                                                gvc.notifyDataChange(id);
                                                                break;
                                                        }
                                                    },
                                                    type: 'multiple',
                                                }),
                                            ];
                                            if (dd.checked) {
                                                switch (dd.key) {
                                                    case 'min_qty':
                                                    case 'max_qty':
                                                        text_.push(`<div class="d-flex align-items-center fw-500"
                                                                                     style="gap:10px;">
                                                                                    ${BgWidget.editeInput({
                                                            gvc: obj.gvc,
                                                            default: `${postMD[dd.key] || ''}`,
                                                            title: '',
                                                            type: 'number',
                                                            placeHolder: `1`,
                                                            callback: (text: any) => {
                                                                (postMD as any)[dd.key] = parseInt(text, 10);
                                                                gvc.notifyDataChange(id);
                                                            },
                                                        })}
                                                                                    件
                                                                                </div>`);
                                                        break;
                                                    case 'match_by_with':
                                                        text_.push(
                                                            obj.gvc.bindView(() => {
                                                                const id = gvc.glitter.getUUID();
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        try {
                                                                            return html`
                                                                                <div style="font-weight: 700;"
                                                                                     class=" d-flex flex-column">
                                                                                    ${BgWidget.grayNote(`購物車必須連同包含以下其中一個${postMD.product_category === 'course' ? `課程或商品` : `商品`}才可結帳`)}
                                                                                </div>
                                                                                <div class="d-flex align-items-center gray-bottom-line-18"
                                                                                     style="gap: 24px; justify-content: space-between;">
                                                                                    <div class="form-check-label c_updown_label">
                                                                                        <div class="tx_normal">
                                                                                            商品列表
                                                                                        </div>
                                                                                    </div>
                                                                                    ${BgWidget.grayButton(
                                                                                            '選擇商品',
                                                                                            gvc.event(() => {
                                                                                                BgProduct.productsDialog({
                                                                                                    gvc: gvc,
                                                                                                    default: postMD.match_by_with!,
                                                                                                    callback: async (value) => {
                                                                                                        postMD.match_by_with = value;
                                                                                                        gvc.notifyDataChange(id);
                                                                                                    },
                                                                                                    filter: (dd) => {
                                                                                                        return dd.key !== postMD.id;
                                                                                                    },
                                                                                                });
                                                                                            }),
                                                                                            {textStyle: 'font-weight: 400;'}
                                                                                    )}
                                                                                </div>
                                                                                ${gvc.bindView(() => {
                                                                                    const vm: {
                                                                                        id: string;
                                                                                        loading: boolean;
                                                                                        data: OptionsItem[];
                                                                                    } = {
                                                                                        id: gvc.glitter.getUUID(),
                                                                                        loading: true,
                                                                                        data: [],
                                                                                    };
                                                                                    BgProduct.getProductOpts(postMD.match_by_with!).then((res) => {
                                                                                        vm.data = res;
                                                                                        vm.loading = false;
                                                                                        gvc.notifyDataChange(vm.id);
                                                                                    });
                                                                                    return {
                                                                                        bind: vm.id,
                                                                                        view: async () => {
                                                                                            if (vm.loading) {
                                                                                                return BgWidget.spinner();
                                                                                            }
                                                                                            return vm.data
                                                                                                    .map((opt: OptionsItem, index) => {
                                                                                                        return html`
                                                                                                            <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                                <span class="tx_normal">${index + 1} .</span>
                                                                                                                ${BgWidget.validImageBox({
                                                                                                                    gvc: gvc,
                                                                                                                    image: opt.image,
                                                                                                                    width: 40,
                                                                                                                })}
                                                                                                                <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                                                                    ${opt.value}
                                                                                                                </div>
                                                                                                                ${opt.note ? html`
                                                                                                                    <div class="tx_gray_12">
                                                                                                                        ${opt.note}
                                                                                                                    </div> ` : ''}
                                                                                                            </div>`;
                                                                                                    })
                                                                                                    .join('');
                                                                                        },
                                                                                        divCreate: {
                                                                                            class: `d-flex py-2 flex-column`,
                                                                                            style: `gap:10px;`,
                                                                                        },
                                                                                    };
                                                                                })}
                                                                            `;
                                                                        } catch (e) {
                                                                            console.error(e);
                                                                            return '';
                                                                        }
                                                                    },
                                                                    divCreate: {
                                                                        class: `w-100`,
                                                                    },
                                                                };
                                                            })
                                                        );
                                                        break;
                                                    case 'legacy_by_with':
                                                        text_.push(
                                                            obj.gvc.bindView(() => {
                                                                const id = gvc.glitter.getUUID();
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        try {
                                                                            return html`
                                                                                <div style="font-weight: 700;"
                                                                                     class=" d-flex flex-column">
                                                                                    ${BgWidget.grayNote(`已購買過的訂單記錄中，必須包含以下${postMD.product_category === 'course' ? `課程或商品` : `商品`}才可以結帳`)}
                                                                                </div>
                                                                                <div class="d-flex align-items-center gray-bottom-line-18"
                                                                                     style="gap: 24px; justify-content: space-between;">
                                                                                    <div class="form-check-label c_updown_label">
                                                                                        <div class="tx_normal">
                                                                                            商品列表
                                                                                        </div>
                                                                                    </div>
                                                                                    ${BgWidget.grayButton(
                                                                                            '選擇商品',
                                                                                            gvc.event(() => {
                                                                                                BgProduct.productsDialog({
                                                                                                    gvc: gvc,
                                                                                                    default: postMD.match_by_with!,
                                                                                                    callback: async (value) => {
                                                                                                        postMD.match_by_with = value;
                                                                                                        gvc.notifyDataChange(id);
                                                                                                    },
                                                                                                    filter: (dd) => {
                                                                                                        return dd.key !== postMD.id;
                                                                                                    },
                                                                                                });
                                                                                            }),
                                                                                            {textStyle: 'font-weight: 400;'}
                                                                                    )}
                                                                                </div>
                                                                                ${gvc.bindView(() => {
                                                                                    const vm: {
                                                                                        id: string;
                                                                                        loading: boolean;
                                                                                        data: OptionsItem[];
                                                                                    } = {
                                                                                        id: gvc.glitter.getUUID(),
                                                                                        loading: true,
                                                                                        data: [],
                                                                                    };
                                                                                    BgProduct.getProductOpts(postMD.match_by_with!).then((res) => {
                                                                                        vm.data = res;
                                                                                        vm.loading = false;
                                                                                        gvc.notifyDataChange(vm.id);
                                                                                    });
                                                                                    return {
                                                                                        bind: vm.id,
                                                                                        view: async () => {
                                                                                            if (vm.loading) {
                                                                                                return BgWidget.spinner();
                                                                                            }
                                                                                            return vm.data
                                                                                                    .map((opt: OptionsItem, index) => {
                                                                                                        return html`
                                                                                                            <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                                <span class="tx_normal">${index + 1} .</span>
                                                                                                                ${BgWidget.validImageBox({
                                                                                                                    gvc: gvc,
                                                                                                                    image: opt.image,
                                                                                                                    width: 40,
                                                                                                                })}
                                                                                                                <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                                                                    ${opt.value}
                                                                                                                </div>
                                                                                                                ${opt.note ? html`
                                                                                                                    <div class="tx_gray_12">
                                                                                                                        ${opt.note}
                                                                                                                    </div> ` : ''}
                                                                                                            </div>`;
                                                                                                    })
                                                                                                    .join('');
                                                                                        },
                                                                                        divCreate: {
                                                                                            class: `d-flex py-2 flex-column`,
                                                                                            style: `gap:10px;`,
                                                                                        },
                                                                                    };
                                                                                })}
                                                                            `;
                                                                        } catch (e) {
                                                                            console.error(e);
                                                                            return '';
                                                                        }
                                                                    },
                                                                    divCreate: {
                                                                        class: `w-100`,
                                                                    },
                                                                };
                                                            })
                                                        );
                                                        break;
                                                }
                                            }
                                            return text_.join('');
                                        })),
                                ].join(``)
                            ),
                            (postMD.product_category === 'commodity') ? BgWidget.mainCard(
                                obj.gvc.bindView(() => {
                                    let loading = true;
                                    let dataList: any = [];
                                    postMD.designated_logistics = postMD.designated_logistics ?? {
                                        type: 'all',
                                        list: [],
                                    };
                                    return {
                                        bind: 'designatedLogistics',
                                        view: () => {
                                            if (loading) {
                                                return '';
                                            }
                                            return html`
                                                <div class="tx_700">指定物流配送方式</div>
                                                ${BgWidget.mbContainer(18)}
                                                ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return html`
                                                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                                                    ${BgWidget.selectFilter({
                                                                        gvc: gvc,
                                                                        callback: (text) => {
                                                                            postMD.designated_logistics.type = text;
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                        default: postMD.designated_logistics.type,
                                                                        options: [
                                                                            {
                                                                                key: 'all',
                                                                                value: '全部',
                                                                            },
                                                                            {
                                                                                key: 'designated',
                                                                                value: '指定物流',
                                                                            },
                                                                        ],
                                                                        style: 'width: 100%;',
                                                                    })}
                                                                    <div>
                                                                        ${(() => {
                                                                            switch (postMD.designated_logistics.type) {
                                                                                case 'designated':
                                                                                    return (() => {
                                                                                        const designatedVM = {
                                                                                            id: gvc.glitter.getUUID(),
                                                                                            loading: true,
                                                                                            dataList: [] as any,
                                                                                        };
                                                                                        return gvc.bindView({
                                                                                            bind: designatedVM.id,
                                                                                            view: () => {
                                                                                                if (designatedVM.loading) {
                                                                                                    return BgWidget.spinner({text: {visible: false}});
                                                                                                } else {
                                                                                                    return BgWidget.selectDropList({
                                                                                                        gvc: gvc,
                                                                                                        callback: (value: []) => {
                                                                                                            postMD.designated_logistics.list = value;
                                                                                                            gvc.notifyDataChange(id);
                                                                                                        },
                                                                                                        default: postMD.designated_logistics.list ?? [],
                                                                                                        options: designatedVM.dataList,
                                                                                                        style: 'width: 100%;',
                                                                                                    });
                                                                                                }
                                                                                            },
                                                                                            divCreate: {
                                                                                                style: 'width: 100%;',
                                                                                            },
                                                                                            onCreate: () => {
                                                                                                if (designatedVM.loading) {
                                                                                                    ApiPageConfig.getPrivateConfig((window.parent as any).appName, 'logistics_setting').then(
                                                                                                            (dd: any) => {
                                                                                                                if (dd.result && dd.response.result[0]) {
                                                                                                                    const shipment_setting = dd.response.result[0].value;

                                                                                                                    designatedVM.dataList = [
                                                                                                                        {
                                                                                                                            name: '中華郵政',
                                                                                                                            value: 'normal'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: '黑貓到府',
                                                                                                                            value: 'black_cat'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: '全家店到店',
                                                                                                                            value: 'FAMIC2C'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: '萊爾富店到店',
                                                                                                                            value: 'HILIFEC2C'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: 'OK超商店到店',
                                                                                                                            value: 'OKMARTC2C'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: '7-ELEVEN超商交貨便',
                                                                                                                            value: 'UNIMARTC2C'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: '實體門市取貨',
                                                                                                                            value: 'shop'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            name: '國際快遞',
                                                                                                                            value: 'global_express'
                                                                                                                        },
                                                                                                                    ]
                                                                                                                            .concat(
                                                                                                                                    (shipment_setting.custom_delivery ?? []).map((dd: any) => {
                                                                                                                                        return {
                                                                                                                                            form: dd.form,
                                                                                                                                            name: dd.name,
                                                                                                                                            value: dd.id,
                                                                                                                                        };
                                                                                                                                    })
                                                                                                                            )
                                                                                                                            .filter((d1) => {
                                                                                                                                return shipment_setting.support.some((d2: any) => {
                                                                                                                                    return d2 === d1.value;
                                                                                                                                });
                                                                                                                            })
                                                                                                                            .map((item) => {
                                                                                                                                return {
                                                                                                                                    key: item.value,
                                                                                                                                    value: item.name,
                                                                                                                                };
                                                                                                                            });

                                                                                                                    designatedVM.loading = false;
                                                                                                                    gvc.notifyDataChange(designatedVM.id);
                                                                                                                }
                                                                                                            }
                                                                                                    );
                                                                                                }
                                                                                            },
                                                                                        });
                                                                                    })();
                                                                                default:
                                                                                    return '';
                                                                            }
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            `;
                                                        },
                                                    };
                                                })}`;
                                        },
                                        onCreate: () => {
                                            if (loading) {
                                                ApiPageConfig.getPrivateConfig((window.parent as any).appName, 'glitter_delivery').then((res) => {
                                                    dataList = (() => {
                                                        try {
                                                            return res.response.result[0].value;
                                                        } catch (error) {
                                                            return dataList;
                                                        }
                                                    })();
                                                    loading = false;
                                                    gvc.notifyDataChange('designatedLogistics');
                                                });
                                            }
                                        },
                                    };
                                })
                            ) : ``,
                            BgWidget.mainCard(
                                obj.gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            postMD.relative_product = postMD.relative_product ?? [];
                                            try {
                                                return html`
                                                    <div style="font-weight: 700;" class="mb-3 d-flex flex-column">相關商品
                                                        ${BgWidget.grayNote('相關商品將會顯示於商品頁底部')}
                                                    </div>
                                                    <div class="d-flex align-items-center gray-bottom-line-18"
                                                         style="gap: 24px; justify-content: space-between;">
                                                        <div class="form-check-label c_updown_label">
                                                            <div class="tx_normal">商品列表</div>
                                                        </div>
                                                        ${BgWidget.grayButton(
                                                                '選擇商品',
                                                                gvc.event(() => {
                                                                    BgProduct.productsDialog({
                                                                        gvc: gvc,
                                                                        default: postMD.relative_product,
                                                                        callback: async (value) => {
                                                                            postMD.relative_product = value;
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                        filter: (dd) => {
                                                                            return dd.key !== postMD.id;
                                                                        },
                                                                    });
                                                                }),
                                                                {textStyle: 'font-weight: 400;'}
                                                        )}
                                                    </div>
                                                    ${gvc.bindView(() => {
                                                        const vm: {
                                                            id: string;
                                                            loading: boolean;
                                                            data: OptionsItem[];
                                                        } = {
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
                                                            view: async () => {
                                                                if (vm.loading) {
                                                                    return BgWidget.spinner();
                                                                }
                                                                return vm.data
                                                                        .map((opt: OptionsItem, index) => {
                                                                            return html`
                                                                                <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                    <span class="tx_normal">${index + 1} .</span>
                                                                                    ${BgWidget.validImageBox({
                                                                                        gvc: gvc,
                                                                                        image: opt.image,
                                                                                        width: 40,
                                                                                    })}
                                                                                    <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                                        ${opt.value}
                                                                                    </div>
                                                                                    ${opt.note ? html`
                                                                                        <div class="tx_gray_12">
                                                                                            ${opt.note}
                                                                                        </div> ` : ''}
                                                                                </div>`;
                                                                        })
                                                                        .join('');
                                                            },
                                                            divCreate: {
                                                                class: `d-flex py-2 flex-column`,
                                                                style: `gap:10px;`,
                                                            },
                                                        };
                                                    })}
                                                `;
                                            } catch (e) {
                                                console.error(e);
                                                return '';
                                            }
                                        },
                                        divCreate: {
                                            class: `w-100`,
                                        },
                                    };
                                })
                            ),
                            BgWidget.mainCard(
                                obj.gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            postMD.relative_product = postMD.relative_product ?? [];
                                            try {
                                                return html`
                                                    <div style="font-weight: 700;" class="mb-3 d-flex flex-column">
                                                        ${cat_title}通知
                                                        ${BgWidget.grayNote(`購買此${cat_title}會收到的通知信，內容為空則不寄送。`)}
                                                    </div>
                                                    ${BgWidget.richTextEditor({
                                                        gvc: gvc,
                                                        content: postMD.email_notice ?? '',
                                                        callback: (content) => {
                                                            postMD.email_notice = content
                                                        },
                                                        title: '內容編輯',
                                                        quick_insert: (() => {
                                                            return [
                                                                {
                                                                    title: '商家名稱',
                                                                    value: '@{{app_name}}'
                                                                },
                                                                {
                                                                    title: '會員姓名',
                                                                    value: '@{{user_name}}'
                                                                },
                                                                {
                                                                    title: '姓名',
                                                                    value: '@{{姓名}}'
                                                                },
                                                                {
                                                                    title: '電話',
                                                                    value: '@{{電話}}'
                                                                },
                                                                {
                                                                    title: '地址',
                                                                    value: '@{{地址}}'
                                                                },
                                                                {
                                                                    title: '信箱',
                                                                    value: '@{{信箱}}'
                                                                }
                                                            ]
                                                        })()
                                                    })}
                                                `;
                                            } catch (e) {
                                                console.error(e);
                                                return '';
                                            }
                                        },
                                        divCreate: {
                                            class: `w-100`,
                                        },
                                    };
                                })
                            ),
                            BgWidget.mainCard(
                                obj.gvc.bindView(() => {
                                    const id = obj.gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return [
                                                html`
                                                    <div class="title-container px-0">
                                                        <div style="color:#393939;font-weight: 700;">AI 選品</div>
                                                        <div class="flex-fill"></div>
                                                        ${BgWidget.grayButton(
                                                                '設定描述語句',
                                                                gvc.event(() => {
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
                                                                                BgWidget.save(
                                                                                        gvc.event(() => {
                                                                                            postMD.ai_description = description;
                                                                                            refresh();
                                                                                            gvc.closeDialog();
                                                                                        })
                                                                                ),
                                                                            ].join('');
                                                                        },
                                                                    });
                                                                }),
                                                                {
                                                                    textStyle: 'width:100%;',
                                                                }
                                                        )}
                                                    </div>`,
                                                html`
                                                    <div>
                                                        ${postMD.ai_description
                                                                ? `您設定的描述語句：${postMD.ai_description}`
                                                                : BgWidget.grayNote('尚未設定描述語句，透過設定描述語句，可以幫助AI更準確的定位產品。')}
                                                    </div>
                                                `,
                                            ].join(BgWidget.mbContainer(18));
                                        },
                                    };
                                })
                            ),
                        ].filter((dd) => {
                            return dd
                        }).join('<div class="my-3"></div>');
                    },
                    divCreate: {
                        class: `w-100`,
                    },
                };
            })
        );
    }
}
