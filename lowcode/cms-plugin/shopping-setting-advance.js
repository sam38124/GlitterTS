var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgProduct } from '../backend-manager/bg-product.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { QuestionInfo } from './module/question-info.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class ShoppingSettingAdvance {
    static main(obj) {
        const gvc = obj.gvc;
        const postMD = obj.postMD;
        const vm = obj.vm2;
        const categoryTitles = {
            commodity: '商品',
            course: '課程',
        };
        const carTitle = categoryTitles[postMD.product_category] || '商品';
        return BgWidget.container(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a, _b;
                    return [
                        BgWidget.mainCard([
                            html `
                    <div class="guide5-4">
                      <div class="d-flex align-items-center justify-content-between">
                        <div>
                          <div class="d-flex align-items-center">
                            <div style="color: #393939; font-weight: 700;">${carTitle}標籤</div>
                            ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                          </div>
                          ${BgWidget.grayNote('用戶於前台搜尋標籤，即可搜尋到此' + carTitle)} ${BgWidget.mbContainer(4)}
                        </div>
                        ${BgWidget.blueNote('使用現有標籤', gvc.event(() => {
                                var _a;
                                BgProduct.useProductTags({
                                    gvc,
                                    config_key: 'product_general_tags',
                                    config_lang: vm.language,
                                    def: (_a = postMD.product_tag.language[vm.language]) !== null && _a !== void 0 ? _a : [],
                                    callback: tags => {
                                        postMD.product_tag.language[vm.language] = tags;
                                        gvc.notifyDataChange(id);
                                    },
                                });
                            }))}
                      </div>
                      ${BgWidget.multipleInput(gvc, postMD.product_tag.language[vm.language], {
                                save: def => {
                                    postMD.product_tag.language[vm.language] = def;
                                },
                            })}
                    </div>
                  `,
                            html `
                    <div class="d-flex align-items-center justify-content-between">
                      <div>
                        <div style="color: #393939; font-weight: 700;">${carTitle}管理員標籤</div>
                        ${BgWidget.grayNote('操作後台人員登記與分類用，不會顯示於前台')} ${BgWidget.mbContainer(4)}
                      </div>
                      ${BgWidget.blueNote('使用現有標籤', gvc.event(() => {
                                var _a;
                                BgProduct.useProductTags({
                                    gvc,
                                    config_key: 'product_manager_tags',
                                    def: (_a = postMD.product_customize_tag) !== null && _a !== void 0 ? _a : [],
                                    callback: tags => {
                                        postMD.product_customize_tag = tags;
                                        gvc.notifyDataChange(id);
                                    },
                                });
                            }))}
                    </div>
                    ${BgWidget.multipleInput(gvc, (_a = postMD.product_customize_tag) !== null && _a !== void 0 ? _a : [], {
                                save: def => {
                                    postMD.product_customize_tag = [...new Set(def)];
                                },
                            }, true)}
                  `,
                            html ` <div class="d-flex align-items-center gap-2">
                      <div style="color: #393939; font-weight: 700;">${carTitle}促銷標籤</div>
                      ${BgWidget.questionButton(gvc.event(() => {
                                QuestionInfo.promoteLabel(gvc);
                            }))}
                    </div>
                    ${BgWidget.mbContainer(8)}
                    ${gvc.bindView((() => {
                                const id = gvc.glitter.getUUID();
                                let options = [];
                                ApiUser.getPublicConfig('promo-label', 'manager').then(data => {
                                    var _a;
                                    if (data.result && Array.isArray((_a = data.response) === null || _a === void 0 ? void 0 : _a.value)) {
                                        options = [
                                            ...data.response.value.map(({ id, title }) => ({
                                                key: id,
                                                value: title,
                                            })),
                                            { key: '', value: '不設定' },
                                        ];
                                    }
                                    gvc.notifyDataChange(id);
                                });
                                return {
                                    bind: id,
                                    view: () => {
                                        return BgWidget.select({
                                            gvc: obj.gvc,
                                            default: postMD.label || '',
                                            options: options,
                                            callback: (text) => {
                                                postMD.label = text || undefined;
                                                gvc.notifyDataChange(id);
                                            },
                                        });
                                    },
                                };
                            })())}`,
                            postMD.product_category === 'course'
                                ? ''
                                : html ` <div class="d-flex align-items-center">
                          <div style="color: #393939; font-weight: 700;">數量單位</div>
                          ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                        </div>
                        ${BgWidget.grayNote('例如 : 坪、件、個、打，預設單位為件。')}
                        ${BgWidget.editeInput({
                                    gvc: obj.gvc,
                                    default: `${postMD.unit[vm.language] || ''}`,
                                    title: '',
                                    type: 'text',
                                    placeHolder: '件',
                                    callback: (text) => {
                                        postMD.unit[vm.language] = text;
                                        gvc.notifyDataChange(id);
                                    },
                                })}`,
                            html `
                    <div class="d-flex align-items-center">
                      <div style="color: #393939; font-weight: 700;">排序權重</div>
                    </div>
                    ${BgWidget.grayNote('數字越大商品排序會越靠前。')}
                    ${BgWidget.editeInput({
                                gvc: obj.gvc,
                                default: `${postMD.sort_weight || ''}`,
                                title: '',
                                type: 'text',
                                placeHolder: '數字越大商品排序會越靠前',
                                callback: (text) => {
                                    postMD.sort_weight = text;
                                    gvc.notifyDataChange(id);
                                },
                            })}
                  `,
                        ]
                            .filter(Boolean)
                            .join(BgWidget.mbContainer(18))),
                        BgWidget.mainCard([
                            html `
                    <div class="d-flex flex-column guide5-4">
                      <div style="font-weight: 700;" class="mb-2">${carTitle}購買限制</div>
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
                                        title: `需連同特定${carTitle}一併購買`,
                                        key: 'match_by_with',
                                        checked: postMD.match_by_with,
                                    },
                                    {
                                        title: `過往購買過特定${carTitle}才能購買此${carTitle}`,
                                        key: 'legacy_by_with',
                                        checked: postMD.legacy_by_with,
                                    },
                                ].map(dd => {
                                    const stringArray = [
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
                                            callback: () => {
                                                const handleToggle = (key, defaultValue) => {
                                                    if (postMD[key]) {
                                                        delete postMD[key];
                                                    }
                                                    else {
                                                        postMD[key] = defaultValue;
                                                    }
                                                    gvc.notifyDataChange(id);
                                                };
                                                switch (dd.key) {
                                                    case 'min_qty':
                                                    case 'max_qty':
                                                        handleToggle(dd.key, 1);
                                                        break;
                                                    case 'match_by_with':
                                                    case 'legacy_by_with':
                                                        handleToggle(dd.key, []);
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
                                                stringArray.push(html ` <div class="d-flex align-items-center fw-500" style="gap:10px;">
                                  ${BgWidget.editeInput({
                                                    gvc: obj.gvc,
                                                    default: `${postMD[dd.key] || ''}`,
                                                    title: '',
                                                    type: 'number',
                                                    placeHolder: `1`,
                                                    callback: (text) => {
                                                        postMD[dd.key] = parseInt(text, 10);
                                                        gvc.notifyDataChange(id);
                                                    },
                                                })}
                                  件
                                </div>`);
                                                break;
                                            case 'match_by_with':
                                                stringArray.push(obj.gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            try {
                                                                return html `
                                          <div style="font-weight: 700;" class=" d-flex flex-column">
                                            ${BgWidget.grayNote(`購物車必須連同包含以下其中一個${postMD.product_category === 'course' ? `課程或商品` : `商品`}才可結帳`)}
                                          </div>
                                          <div
                                            class="d-flex align-items-center gray-bottom-line-18"
                                            style="gap: 24px; justify-content: space-between;"
                                          >
                                            <div class="form-check-label c_updown_label">
                                              <div class="tx_normal">商品列表</div>
                                            </div>
                                            ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                                                    BgProduct.productsDialog({
                                                                        gvc: gvc,
                                                                        default: postMD.match_by_with,
                                                                        callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                                            postMD.match_by_with = value;
                                                                            gvc.notifyDataChange(id);
                                                                        }),
                                                                        filter: dd => dd.key !== postMD.id,
                                                                    });
                                                                }), { textStyle: 'font-weight: 400;' })}
                                          </div>
                                          ${gvc.bindView(() => {
                                                                    const vm = {
                                                                        id: gvc.glitter.getUUID(),
                                                                        loading: true,
                                                                        data: [],
                                                                    };
                                                                    BgProduct.getProductOpts(postMD.match_by_with).then(res => {
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
                                                                                return html ` <div
                                                      class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                    >
                                                      <span class="tx_normal">${index + 1} .</span>
                                                      ${BgWidget.validImageBox({
                                                                                    gvc: gvc,
                                                                                    image: opt.image,
                                                                                    width: 40,
                                                                                })}
                                                      <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                        ${opt.value}
                                                      </div>
                                                      ${opt.note
                                                                                    ? html ` <div class="tx_gray_12">${opt.note}</div> `
                                                                                    : ''}
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
                                                }));
                                                break;
                                            case 'legacy_by_with':
                                                stringArray.push(obj.gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            try {
                                                                return html `
                                          <div style="font-weight: 700;" class=" d-flex flex-column">
                                            ${BgWidget.grayNote(`已購買過的訂單記錄中，必須包含以下${postMD.product_category === 'course' ? `課程或商品` : `商品`}才可以結帳`)}
                                          </div>
                                          <div
                                            class="d-flex align-items-center gray-bottom-line-18"
                                            style="gap: 24px; justify-content: space-between;"
                                          >
                                            <div class="form-check-label c_updown_label">
                                              <div class="tx_normal">商品列表</div>
                                            </div>
                                            ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                                                    BgProduct.productsDialog({
                                                                        gvc: gvc,
                                                                        default: postMD.match_by_with,
                                                                        callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                                            postMD.match_by_with = value;
                                                                            gvc.notifyDataChange(id);
                                                                        }),
                                                                        filter: dd => dd.key !== postMD.id,
                                                                    });
                                                                }), { textStyle: 'font-weight: 400;' })}
                                          </div>
                                          ${gvc.bindView(() => {
                                                                    const vm = {
                                                                        id: gvc.glitter.getUUID(),
                                                                        loading: true,
                                                                        data: [],
                                                                    };
                                                                    BgProduct.getProductOpts(postMD.match_by_with).then(res => {
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
                                                                                return html ` <div
                                                      class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                    >
                                                      <span class="tx_normal">${index + 1} .</span>
                                                      ${BgWidget.validImageBox({
                                                                                    gvc: gvc,
                                                                                    image: opt.image,
                                                                                    width: 40,
                                                                                })}
                                                      <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                        ${opt.value}
                                                      </div>
                                                      ${opt.note
                                                                                    ? html ` <div class="tx_gray_12">${opt.note}</div> `
                                                                                    : ''}
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
                                                }));
                                                break;
                                        }
                                    }
                                    return stringArray.join('');
                                })),
                        ].join(``)),
                        BgWidget.mainCard([
                            html `
                    <div class="d-flex flex-column guide5-4">
                      <div style="font-weight: 700;" class="mb-2">商品稅額</div>
                    </div>
                  `,
                            BgWidget.select({
                                gvc: gvc,
                                callback: text => {
                                    postMD.tax = text;
                                },
                                default: (_b = postMD.tax) !== null && _b !== void 0 ? _b : '5',
                                options: [
                                    {
                                        key: '5',
                                        value: '一般稅額(5%)',
                                    },
                                    {
                                        key: '0',
                                        value: '免稅商品(0%)',
                                    },
                                ],
                            }),
                        ].join(``)),
                        BgWidget.mainCard((() => {
                            const priceVM = {
                                id: gvc.glitter.getUUID(),
                                loading: true,
                                typeData: [],
                                showPriceDetail: false,
                            };
                            const isDesktop = document.body.clientWidth > 768;
                            const getIndexStyle = (index) => index === 0
                                ? `height: 100%; padding: 0; min-width: ${isDesktop ? 250 : 200}px; max-width: ${isDesktop ? 250 : 200}px;position: sticky; left: 0; background: #fff; box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.10);`
                                : 'height: 100%; padding: 0; text-align: center; justify-content: center; min-width: 126px;';
                            const resetPostList = (result, type) => {
                                var _a, _b, _c;
                                const existingPrices = new Map((_a = postMD.multi_sale_price) === null || _a === void 0 ? void 0 : _a.filter(m => {
                                    return m.type === type;
                                }).map(m => {
                                    return [m.key, new Map(m.variants.map(v => [v.spec.join(','), v.price]))];
                                }));
                                postMD.multi_sale_price = [
                                    ...((_c = (_b = postMD.multi_sale_price) === null || _b === void 0 ? void 0 : _b.filter(item => item.type !== type)) !== null && _c !== void 0 ? _c : []),
                                    ...result.map(key => ({
                                        type,
                                        key,
                                        variants: postMD.variants.map(v => {
                                            var _a, _b;
                                            return ({
                                                spec: v.spec,
                                                price: (_b = (_a = existingPrices.get(key)) === null || _a === void 0 ? void 0 : _a.get(v.spec.join(','))) !== null && _b !== void 0 ? _b : 0,
                                            });
                                        }),
                                    })),
                                ];
                                gvc.notifyDataChange(priceVM.id);
                            };
                            const toggleObject = (type) => {
                                return {
                                    gvc,
                                    postData: postMD.multi_sale_price
                                        ? postMD.multi_sale_price.filter(item => item.type === type).map(item => item.key)
                                        : [],
                                    callback: (result) => resetPostList(result, type),
                                };
                            };
                            const createToggleList = () => [
                                {
                                    title: '會員等級價格開啟',
                                    note: '開啟後即可為各個會員等級設置專屬的價格',
                                    type: 'level',
                                    event: () => {
                                        BgProduct.setMemberPriceSetting(toggleObject('level'));
                                    },
                                },
                                {
                                    title: '門市專屬價格開啟',
                                    note: '開啟後即可為各個門市設置專屬的價格',
                                    type: 'store',
                                    event: () => {
                                        BgProduct.setStorePriceSetting(toggleObject('store'));
                                    },
                                },
                                {
                                    title: '顧客標籤價格開啟',
                                    note: '開啟後即可為各個顧客標籤設置專屬的價格',
                                    type: 'tags',
                                    event: () => {
                                        BgProduct.setUserTagPriceSetting(toggleObject('tags'));
                                    },
                                },
                            ];
                            return gvc.bindView({
                                bind: priceVM.id,
                                view: () => {
                                    if (priceVM.loading)
                                        return BgWidget.spinner();
                                    const toggleList = createToggleList();
                                    const particularKeys = priceVM.typeData.filter(item => {
                                        var _a;
                                        return (_a = postMD.multi_sale_price) === null || _a === void 0 ? void 0 : _a.some(m => m.type === item.type && m.key === item.key);
                                    });
                                    try {
                                        return html `
                          <div class="title-container px-0 mb-2">
                            <div style="color:#393939;font-weight: 700;">專屬價格</div>
                            <div class="flex-fill"></div>
                          </div>
                          ${toggleList
                                            .map(item => {
                                            var _a;
                                            return html `
                                <div class="d-flex align-items-center">
                                  <div>
                                    <div class="d-flex align-items-center gap-2 mb-1">
                                      <span class="tx_normal">${item.title}</span>
                                      <div class="cursor_pointer form-check form-switch m-0">
                                        <input
                                          class="form-check-input"
                                          style="cursor: pointer;"
                                          type="checkbox"
                                          onchange="${gvc.event(e => {
                                                var _a;
                                                if (e.checked) {
                                                    item.event();
                                                }
                                                else {
                                                    postMD.multi_sale_price = (_a = postMD.multi_sale_price) === null || _a === void 0 ? void 0 : _a.filter(m => m.type !== item.type);
                                                    gvc.notifyDataChange(priceVM.id);
                                                }
                                            })}"
                                          ${((_a = postMD.multi_sale_price) === null || _a === void 0 ? void 0 : _a.some(m => m.type === item.type)) ? `checked` : ``}
                                        />
                                      </div>
                                    </div>
                                    ${BgWidget.grayNote(item.note)}
                                  </div>
                                  <div class="flex-fill"></div>
                                  <div style="cursor: pointer;" onclick="${gvc.event(item.event)}">
                                    設定<i class="fa-regular fa-gear ms-1"></i>
                                  </div>
                                </div>
                              `;
                                        })
                                            .join(`<div class="w-100 my-3 border-top"></div>`)}
                          ${particularKeys.length > 1
                                            ? html `
                                <div
                                  class="d-flex justify-content-start align-items-center mt-2 my-1"
                                  style="border-radius: 10px; padding: 10px 20px; background: #F7F7F7;"
                                >
                                  <span style="font-weight: 700;"
                                    >※ 若是規則有重疊，例 : VIP客戶在大安門市消費，則取兩者之中最低價格</span
                                  >
                                </div>
                              `
                                            : ''}
                          ${postMD.multi_sale_price && postMD.multi_sale_price.length > 0
                                            ? html ` <div class="mt-3 d-grid" style="overflow: scroll;" id="scrollDiv">
                                <div class="d-flex">
                                  ${['商品名稱', '成本', '原價', '售價', ...particularKeys.map(item => item.name)]
                                                .map((item, index) => html `
                                        <div style="${getIndexStyle(index)}">
                                          <div>${item}</div>
                                          ${BgWidget.horizontalLine({ margin: '1rem 0 0;' })}
                                        </div>
                                      `)
                                                .join('')}
                                </div>
                                <div class="w-100 d-flex flex-column">
                                  ${postMD.variants
                                                .map((variant, index) => {
                                                const { spec, cost = 0, sale_price, preview_image, compare_price } = variant;
                                                return html ` <div class="d-flex align-items-center">
                                        ${[
                                                    [
                                                        BgWidget.validImageBox({
                                                            gvc,
                                                            image: preview_image,
                                                            width: 40,
                                                            style: 'border-radius: 5px;',
                                                        }),
                                                        gvc.bindView({
                                                            bind: `spec-bar-${index}`,
                                                            dataList: [{ obj: priceVM, key: 'showPriceDetail' }],
                                                            view: () => {
                                                                return html `
                                                  <div>
                                                    ${spec && spec.length > 0
                                                                    ? spec.join(' / ')
                                                                    : Tool.truncateString(postMD.title, 10)}
                                                  </div>
                                                  ${priceVM.showPriceDetail
                                                                    ? html ` <div style="color: #8D8D8D;">
                                                        定價 : ${compare_price.toLocaleString()} / 售價 :
                                                        ${sale_price.toLocaleString()}
                                                      </div>`
                                                                    : ''}
                                                `;
                                                            },
                                                            divCreate: {
                                                                class: 'ms-2',
                                                                style: 'font-size: 14px;',
                                                            },
                                                        }),
                                                    ].join(''),
                                                    `$ ${cost.toLocaleString()}`,
                                                    `$ ${compare_price.toLocaleString()}`,
                                                    `$ ${sale_price.toLocaleString()}`,
                                                    ...particularKeys.map(item => gvc.bindView((() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                var _a, _b;
                                                                const priceObj = (_a = postMD.multi_sale_price) === null || _a === void 0 ? void 0 : _a.find(m => m.type === item.type && m.key === item.key);
                                                                const variantObj = priceObj === null || priceObj === void 0 ? void 0 : priceObj.variants.find(v => v.spec.join(',') === spec.join(','));
                                                                return BgWidget.editeInput({
                                                                    gvc,
                                                                    title: '',
                                                                    default: `${(_b = variantObj === null || variantObj === void 0 ? void 0 : variantObj.price) !== null && _b !== void 0 ? _b : 0}`,
                                                                    placeHolder: '',
                                                                    callback: value => {
                                                                        const n = parseInt(`${value !== null && value !== void 0 ? value : 0}`, 10);
                                                                        if (variantObj && !isNaN(n) && n > 0) {
                                                                            variantObj.price = n;
                                                                        }
                                                                        gvc.notifyDataChange(id);
                                                                    },
                                                                });
                                                            },
                                                            divCreate: {
                                                                style: 'width: 120px;',
                                                            },
                                                        };
                                                    })())),
                                                ]
                                                    .map((item, index) => html `
                                              <div class="d-flex align-items-center" style="${getIndexStyle(index)}">
                                                ${item}
                                              </div>
                                            `)
                                                    .join('')}
                                      </div>`;
                                            })
                                                .join('')}
                                </div>
                              </div>`
                                            : ''}
                        `;
                                    }
                                    catch (error) {
                                        console.error(error);
                                        return '';
                                    }
                                },
                                onCreate: () => {
                                    if (priceVM.loading) {
                                        Promise.all([
                                            ApiUser.getUserGroupList('level').then(r => {
                                                if (r.result && r.response && Array.isArray(r.response.data)) {
                                                    return r.response.data.map((item) => ({
                                                        type: 'level',
                                                        key: item.tag || 'default',
                                                        name: item.title.replace('會員等級 - ', ''),
                                                    }));
                                                }
                                                return [];
                                            }),
                                            ApiUser.getPublicConfig('store_manager', 'manager').then((r) => {
                                                if (r.result && Array.isArray(r.response.value.list)) {
                                                    return r.response.value.list.map((d) => ({
                                                        type: 'store',
                                                        key: d.id,
                                                        name: d.name,
                                                    }));
                                                }
                                                return [];
                                            }),
                                            ApiUser.getPublicConfig('user_general_tags', 'manager').then((r) => {
                                                if (r.result && Array.isArray(r.response.value.list)) {
                                                    return r.response.value.list.map((tag) => ({
                                                        type: 'tags',
                                                        key: tag,
                                                        name: tag,
                                                    }));
                                                }
                                                return [];
                                            }),
                                        ]).then((dlist) => {
                                            priceVM.typeData = dlist.flat();
                                            priceVM.loading = false;
                                            gvc.notifyDataChange(priceVM.id);
                                        });
                                    }
                                    else {
                                        const scrollDiv = document.getElementById('scrollDiv');
                                        if (scrollDiv) {
                                            function setStatus(scrollDiv, delta = 360) {
                                                const status = scrollDiv.scrollLeft > delta;
                                                if (priceVM.showPriceDetail !== status) {
                                                    priceVM.showPriceDetail = status;
                                                }
                                            }
                                            if (isDesktop) {
                                                scrollDiv.addEventListener('scroll', () => {
                                                    setStatus(scrollDiv);
                                                });
                                            }
                                            else {
                                                scrollDiv.addEventListener('touchmove', () => {
                                                    setStatus(scrollDiv);
                                                });
                                            }
                                        }
                                    }
                                },
                            });
                        })()),
                        postMD.product_category === 'commodity'
                            ? BgWidget.mainCard(obj.gvc.bindView(() => {
                                var _a;
                                let loading = true;
                                let dataList = [];
                                postMD.designated_logistics = (_a = postMD.designated_logistics) !== null && _a !== void 0 ? _a : { group: '' };
                                return {
                                    bind: 'designatedLogistics',
                                    view: () => {
                                        if (loading) {
                                            return '';
                                        }
                                        return html ` <div class="tx_700">指定物流配送方式</div>
                            ${BgWidget.mbContainer(18)}
                            ${gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return html `
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                      ${BgWidget.selectFilter({
                                                        gvc: gvc,
                                                        callback: text => {
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
                                                        ].filter(item => {
                                                            return !(item.key === 'designated' && dataList.length === 0);
                                                        }),
                                                        style: 'width: 100%;',
                                                    })}
                                      <div>
                                        ${(() => {
                                                        switch (postMD.designated_logistics.type) {
                                                            case 'designated':
                                                                return BgWidget.selectFilter({
                                                                    gvc: gvc,
                                                                    callback: text => {
                                                                        postMD.designated_logistics.group = text;
                                                                        gvc.notifyDataChange(id);
                                                                    },
                                                                    default: postMD.designated_logistics.group,
                                                                    options: dataList.map((data) => {
                                                                        return {
                                                                            key: data.key,
                                                                            value: data.name,
                                                                        };
                                                                    }),
                                                                    style: 'width: 100%;',
                                                                });
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
                                            ApiUser.getPublicConfig('logistics_group', 'manager').then(r => {
                                                dataList = (() => {
                                                    try {
                                                        return r.response.value;
                                                    }
                                                    catch (error) {
                                                        return dataList;
                                                    }
                                                })();
                                                loading = false;
                                                gvc.notifyDataChange('designatedLogistics');
                                            });
                                        }
                                    },
                                };
                            }))
                            : ``,
                        BgWidget.mainCard(obj.gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    var _a;
                                    postMD.relative_product = (_a = postMD.relative_product) !== null && _a !== void 0 ? _a : [];
                                    try {
                                        return html `
                          <div style="font-weight: 700;" class="mb-3 d-flex flex-column">
                            相關商品 ${BgWidget.grayNote('相關商品將會顯示於商品頁底部')}
                          </div>
                          <div
                            class="d-flex align-items-center gray-bottom-line-18"
                            style="gap: 24px; justify-content: space-between;"
                          >
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
                                                filter: dd => dd.key !== postMD.id,
                                            });
                                        }), { textStyle: 'font-weight: 400;' })}
                          </div>
                          ${gvc.bindView(() => {
                                            const vm = {
                                                id: gvc.glitter.getUUID(),
                                                loading: true,
                                                data: [],
                                            };
                                            BgProduct.getProductOpts(postMD.relative_product).then(res => {
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
                                                        return html ` <div
                                      class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                    >
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
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    var _a, _b;
                                    postMD.relative_product = (_a = postMD.relative_product) !== null && _a !== void 0 ? _a : [];
                                    try {
                                        return html `
                          <div style="font-weight: 700;" class="mb-3 d-flex flex-column">
                            ${carTitle}通知 ${BgWidget.grayNote(`購買此${carTitle}會收到的通知信，內容為空則不寄送。`)}
                          </div>
                          ${BgWidget.richTextEditor({
                                            gvc: gvc,
                                            content: (_b = postMD.email_notice) !== null && _b !== void 0 ? _b : '',
                                            callback: content => {
                                                postMD.email_notice = content;
                                            },
                                            title: '內容編輯',
                                            quick_insert: BgWidget.richTextQuickList.filter(item => {
                                                return !['訂單號碼', '訂單金額'].includes(item.title);
                                            }),
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
                            const id = obj.gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return [
                                        html ` <div class="title-container px-0">
                          <div style="color:#393939;font-weight: 700;">AI 選品</div>
                          <div class="flex-fill"></div>
                          ${BgWidget.grayButton('設定描述語句', gvc.event(() => {
                                            let description = postMD.ai_description;
                                            BgWidget.settingDialog({
                                                gvc: gvc,
                                                title: '描述語句',
                                                innerHTML: gvc => {
                                                    return BgWidget.textArea({
                                                        gvc: gvc,
                                                        title: '',
                                                        default: postMD.ai_description || '',
                                                        placeHolder: `請告訴我這是什麼商品，範例:現代極簡風格的淺灰色布藝沙發，可以同時乘坐3個人，配金屬腳座，採用鈦合金製作十分的堅固。`,
                                                        callback: text => {
                                                            description = text;
                                                        },
                                                        style: `min-height:100px;`,
                                                    });
                                                },
                                                footer_html: gvc => {
                                                    return [
                                                        BgWidget.save(gvc.event(() => {
                                                            postMD.ai_description = description;
                                                            gvc.notifyDataChange(id);
                                                            gvc.closeDialog();
                                                        })),
                                                    ].join('');
                                                },
                                            });
                                        }), {
                                            textStyle: 'width:100%;',
                                        })}
                        </div>`,
                                        html `
                          <div>
                            ${postMD.ai_description
                                            ? `您設定的描述語句：${postMD.ai_description}`
                                            : BgWidget.grayNote('尚未設定描述語句，透過設定描述語句，可以幫助AI更準確的定位產品。')}
                          </div>
                        `,
                                    ].join(BgWidget.mbContainer(18));
                                },
                            };
                        })),
                    ]
                        .filter(Boolean)
                        .join(html ` <div class="my-3"></div>`);
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        }));
    }
}
