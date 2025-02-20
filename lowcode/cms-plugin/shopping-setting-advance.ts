import { BgWidget } from '../backend-manager/bg-widget.js';
import { GVC } from '../glitterBundle/GVController.js';
import { QuestionInfo } from './module/question-info.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { BgProduct, OptionsItem } from '../backend-manager/bg-product.js';
import { Product, MultiSalePrice, MultiSaleType } from '../public-models/product.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { ShipmentConfig } from '../glitter-base/global/shipment-config.js';

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
        const start = gvc.glitter.ut.clock()
        function updateVariants() {
            postMD.specs=postMD.specs.filter((dd)=>{
                return dd.option && dd.option.length
            })
            const specs: any = {};

            // 生成所有可能的規格組合
            const combinations = getCombinations(specs);

            // 新增不存在的變體
            combinations.forEach((combination) => {
                const spec = postMD.specs.map((dd) => combination[dd.title]);
                if (!postMD.variants.some((variant) => variant.spec.join('') === spec.join(''))) {
                    postMD.variants.push(createVariant(spec));
                }
            });

            // 過濾無效的變體
            postMD.variants = postMD.variants.filter((variant) => isValidVariant(variant, postMD.specs));

            // 如果沒有變體，新增一個預設的變體
            if (postMD.variants.length === 0) {
                postMD.variants.push(createVariant([]));
            }
            if (postMD.product_category === 'kitchen' && (postMD.variants.length>1)) {
                postMD.variants.map((dd) => {
                    dd.compare_price=0
                    dd.sale_price = dd.spec.map((d1, index) => {
                        return parseInt(postMD.specs[index].option.find((d2:any) => {
                            return d2.title === d1
                        }).price ?? "0",10)
                    }).reduce((acc, cur) => acc + cur, 0);
                    dd.weight=parseFloat(postMD.weight ?? '0');
                    dd.v_height=parseFloat(postMD.v_height ?? '0');
                    dd.v_width=parseFloat(postMD.v_width ?? '0');
                    dd.v_length=parseFloat(postMD.v_length ?? '0');
                    (dd.shipment_type as any)=postMD.shipment_type!!
                })
            }

            // 更新變體狀態並通知資料變更
            postMD.variants.forEach((variant) => (variant.checked = undefined));
            obj.vm.replaceData = postMD;
            console.log(`end-time`, start.stop())
            console.log(`postMD.variants=>`,postMD.variants)
            // if((postMD.specs.length) && postMD.variants.length===1){
            //     postMD.specs=[]
            //     const dialog=new ShareDialog(gvc.glitter)
            //     dialog.errorMessage({
            //         text:'設定規格必須包含兩種以上的組合!'
            //     })
            //     return
            // }
            obj.gvc.notifyDataChange(variantsViewID);
        }

        // 生成所有規格組合
        function getCombinations(specs: Record<string, string[]>): Record<string, string>[] {
            const keys = Object.keys(specs);
            const result: Record<string, string>[] = [];

            function combine(index: number, current: Record<string, string>) {
                if (index === keys.length) {
                    result.push({ ...current });
                    return;
                }
                const key = keys[index];
                specs[key].forEach((value) => {
                    current[key] = value;
                    combine(index + 1, current);
                });
            }

            combine(0, {});
            return result;
        }

        // 創建一個新的變體
        function createVariant(spec: string[]) {
            return {
                show_understocking: 'true',
                type: 'variants',
                sale_price: 0,
                compare_price: 0,
                origin_price: 0,
                cost: 0,
                spec: JSON.parse(JSON.stringify(spec)),
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
            };
        }

        // 檢查變體是否有效
        function isValidVariant(variant: any, specs: any[]) {
            return (
                variant.spec.length === specs.length &&
                variant.spec.every((value: string, index: number) => {
                    return specs[index]?.option.some((dd: any) => dd.title === value);
                })
            );
        }

        // 更新特定產品類別的變體
        function updateKitchenVariant(variant: any, postMD: any) {
            variant.compare_price = 0;
            variant.sale_price = variant.spec
                .map((value: string, index: number) => {
                    const option = postMD.specs[index].option.find((dd: any) => dd.title === value);
                    return parseInt(option?.price ?? '0', 10);
                })
                .reduce((acc: number, cur: number) => acc + cur, 0);
            variant.weight = parseFloat(postMD.weight ?? '0');
            variant.v_height = parseFloat(postMD.v_height ?? '0');
            variant.v_width = parseFloat(postMD.v_width ?? '0');
            variant.v_length = parseFloat(postMD.v_length ?? '0');
            variant.shipment_type = postMD.shipment_type || 'weight';
        }

        updateVariants();

        const categoryTitles: Record<string, string> = {
            commodity: '商品',
            course: '課程',
        };

        const carTitle = categoryTitles[postMD.product_category] || '商品';

        return BgWidget.container(
            gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return [
                            BgWidget.mainCard(
                                [
                                    html`
                                        <div class="d-flex flex-column guide5-4">
                                            <div style="font-weight: 700;" class="mb-1">${carTitle}標籤 ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}</div>
                                            ${BgWidget.grayNote('用戶於前台搜尋標籤，即可搜尋到此' + carTitle)}
                                            <div class="mb-2"></div>
                                            ${BgWidget.multipleInput(gvc, (postMD.product_tag.language as any)[vm.language], {
                                                save: (def) => {
                                                    (postMD.product_tag.language as any)[vm.language] = def;
                                                },
                                            })}
                                        </div>
                                    `,
                                    html` <div class="mt-2 mb-2 position-relative" style="font-weight: 700;">
                                            ${carTitle}促銷標籤
                                            ${BgWidget.questionButton(
                                                gvc.event(() => {
                                                    QuestionInfo.promoteLabel(gvc);
                                                })
                                            )}
                                        </div>
                                        ${gvc.bindView(
                                            (() => {
                                                const id = gvc.glitter.getUUID();
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
                                    postMD.product_category === 'course'
                                        ? ``
                                        : html`<div class="d-flex flex-column mt-2">
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
                                          </div>`,
                                ].join('')
                            ),
                            BgWidget.mainCard(
                                [
                                    html`
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
                                                      callback: () => {
                                                          const handleToggle = (key: string, defaultValue: any) => {
                                                              if ((postMD as any)[key]) {
                                                                  delete (postMD as any)[key];
                                                              } else {
                                                                  (postMD as any)[key] = defaultValue;
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
                                                          text_.push(
                                                              html`<div class="d-flex align-items-center fw-500" style="gap:10px;">
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
                                                              </div>`
                                                          );
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
                                                                                  <div style="font-weight: 700;" class=" d-flex flex-column">
                                                                                      ${BgWidget.grayNote(
                                                                                          `購物車必須連同包含以下其中一個${postMD.product_category === 'course' ? `課程或商品` : `商品`}才可結帳`
                                                                                      )}
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center gray-bottom-line-18" style="gap: 24px; justify-content: space-between;">
                                                                                      <div class="form-check-label c_updown_label">
                                                                                          <div class="tx_normal">商品列表</div>
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
                                                                                                  filter: (dd) => dd.key !== postMD.id,
                                                                                              });
                                                                                          }),
                                                                                          { textStyle: 'font-weight: 400;' }
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
                                                                                                      return html` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                          <span class="tx_normal">${index + 1} .</span>
                                                                                                          ${BgWidget.validImageBox({
                                                                                                              gvc: gvc,
                                                                                                              image: opt.image,
                                                                                                              width: 40,
                                                                                                          })}
                                                                                                          <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                                                                          ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
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
                                                                                  <div style="font-weight: 700;" class=" d-flex flex-column">
                                                                                      ${BgWidget.grayNote(
                                                                                          `已購買過的訂單記錄中，必須包含以下${postMD.product_category === 'course' ? `課程或商品` : `商品`}才可以結帳`
                                                                                      )}
                                                                                  </div>
                                                                                  <div class="d-flex align-items-center gray-bottom-line-18" style="gap: 24px; justify-content: space-between;">
                                                                                      <div class="form-check-label c_updown_label">
                                                                                          <div class="tx_normal">商品列表</div>
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
                                                                                          { textStyle: 'font-weight: 400;' }
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
                                                                                                      return html` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                          <span class="tx_normal">${index + 1} .</span>
                                                                                                          ${BgWidget.validImageBox({
                                                                                                              gvc: gvc,
                                                                                                              image: opt.image,
                                                                                                              width: 40,
                                                                                                          })}
                                                                                                          <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                                                                          ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
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
                            BgWidget.mainCard(
                                (() => {
                                    const priceVM = {
                                        id: gvc.glitter.getUUID(),
                                        loading: true,
                                        levelData: [] as any,
                                        storeData: [] as { key: string; name: string }[],
                                    };

                                    const getIndexStyle = (index: number) =>
                                        index === 0
                                            ? 'height: 100%; padding: 8px 0 0; min-width: 216px; position: sticky; left: 0; background: #fff; box-shadow: 2px 0px 0px 0px rgba(0, 0, 0, 0.10);'
                                            : 'height: 100%; padding: 8px 0 0; text-align: center; justify-content: center; min-width: 126px;';

                                    const resetPostList = (result: string[], type: MultiSaleType) => {
                                        const existingPrices = new Map(
                                            postMD.multi_sale_price
                                                ?.filter((m) => {
                                                    return m.type === type;
                                                })
                                                .map((m) => {
                                                    return [m.key, new Map(m.variants.map((v) => [v.spec.join(','), v.price]))];
                                                })
                                        );

                                        postMD.multi_sale_price = [
                                            ...(postMD.multi_sale_price?.filter((item) => item.type !== type) ?? []),
                                            ...result.map((key) => ({
                                                type,
                                                key,
                                                variants: postMD.variants.map((v) => ({
                                                    spec: v.spec,
                                                    price: existingPrices.get(key)?.get(v.spec.join(',')) ?? 0,
                                                })),
                                            })),
                                        ];

                                        gvc.notifyDataChange(priceVM.id);
                                    };

                                    const createToggleList = () => [
                                        {
                                            title: '會員等級價格開啟',
                                            note: '開啟後即可為各個會員等級設置專屬的價格',
                                            type: 'level',
                                            event: () => {
                                                BgProduct.setMemberPriceSetting({
                                                    gvc,
                                                    postData: postMD.multi_sale_price ? postMD.multi_sale_price.map((item) => item.key) : [],
                                                    callback: (result) => resetPostList(result, 'level'),
                                                });
                                            },
                                        },
                                        {
                                            title: '門市專屬價格開啟',
                                            note: '開啟後即可為各個門市設置專屬的價格',
                                            type: 'store',
                                            event: () => {
                                                BgProduct.setStorePriceSetting({
                                                    gvc,
                                                    postData: postMD.multi_sale_price ? postMD.multi_sale_price.map((item) => item.key) : [],
                                                    callback: (result) => resetPostList(result, 'store'),
                                                });
                                            },
                                        },
                                        // {
                                        //     title: '顧客標籤價格開啟',
                                        //     note: '開啟後即可為各個顧客標籤設置專屬的價格',
                                        //     type: 'tag',
                                        //     event: () => {},
                                        // },
                                    ];

                                    return gvc.bindView({
                                        bind: priceVM.id,
                                        view: () => {
                                            if (priceVM.loading) {
                                                return BgWidget.spinner();
                                            }

                                            const toggleList = createToggleList();

                                            const particularKeys: { type: MultiSaleType; key: string; name: string }[] = [
                                                ...priceVM.levelData
                                                    .filter((item: any) => postMD.multi_sale_price?.some((m) => m.type === 'level' && m.key === item.tag))
                                                    .map((item: any) => ({
                                                        type: 'level',
                                                        key: item.tag || 'default',
                                                        name: item.title.replace('會員等級 - ', ''),
                                                    })),
                                                ...priceVM.storeData.filter((item: any) => postMD.multi_sale_price?.some((m) => m.type === 'store' && m.key === item.key)),
                                            ];

                                            return html`
                                                <div class="title-container px-0 mb-2">
                                                    <div style="color:#393939;font-weight: 700;">專屬價格</div>
                                                    <div class="flex-fill"></div>
                                                </div>
                                                ${toggleList
                                                    .map(
                                                        (item) => html`
                                                            <div class="d-flex align-items-center">
                                                                <div>
                                                                    <div class="d-flex align-items-center gap-2 mb-1">
                                                                        <span class="tx_normal">${item.title}</span>
                                                                        <div class="cursor_pointer form-check form-switch m-0">
                                                                            <input
                                                                                class="form-check-input"
                                                                                style="cursor: pointer;"
                                                                                type="checkbox"
                                                                                onchange="${gvc.event((e) => {
                                                                                    if (e.checked) {
                                                                                        item.event();
                                                                                    } else {
                                                                                        postMD.multi_sale_price = postMD.multi_sale_price?.filter((m) => m.type !== item.type);
                                                                                        gvc.notifyDataChange(priceVM.id);
                                                                                    }
                                                                                })}"
                                                                                ${postMD.multi_sale_price?.some((m) => m.type === item.type) ? `checked` : ``}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    ${BgWidget.grayNote(item.note)}
                                                                </div>
                                                                <div class="flex-fill"></div>
                                                                <div style="cursor: pointer;" onclick="${gvc.event(item.event)}">設定<i class="fa-regular fa-gear ms-1"></i></div>
                                                            </div>
                                                        `
                                                    )
                                                    .join(BgWidget.mbContainer(18))}
                                                ${postMD.multi_sale_price && postMD.multi_sale_price.length > 0
                                                    ? html`<div class="mt-3 d-grid" style="overflow: scroll;">
                                                          <div class="d-flex">
                                                              ${['商品名稱', '成本', '原價', '售價', ...particularKeys.map((item) => item.name)]
                                                                  .map(
                                                                      (item, index) => html`
                                                                          <div style="${getIndexStyle(index)}">
                                                                              <div>${item}</div>
                                                                              ${BgWidget.horizontalLine({ margin: '1rem 0 0;' })}
                                                                          </div>
                                                                      `
                                                                  )
                                                                  .join('')}
                                                          </div>
                                                          <div class="w-100 d-flex flex-column">
                                                              ${postMD.variants
                                                                  .map((variant) => {
                                                                      const { spec, cost, sale_price, preview_image, compare_price } = variant;
                                                                      return html` <div class="d-flex align-items-center">
                                                                          ${[
                                                                              html`
                                                                                  <div>${BgWidget.validImageBox({ gvc, image: preview_image, width: 40 })}</div>
                                                                                  <div class="ms-2">${spec.join(' / ')}</div>
                                                                              `,
                                                                              `$ ${cost.toLocaleString()}`,
                                                                              `$ ${compare_price.toLocaleString()}`,
                                                                              `$ ${sale_price.toLocaleString()}`,
                                                                              ...particularKeys.map((item) =>
                                                                                  gvc.bindView(
                                                                                      (() => {
                                                                                          const id = gvc.glitter.getUUID();
                                                                                          return {
                                                                                              bind: id,
                                                                                              view: () => {
                                                                                                  const priceObj = postMD.multi_sale_price?.find((m) => m.type === item.type && m.key === item.key);
                                                                                                  const variantObj = priceObj?.variants.find((v) => v.spec.join(',') === spec.join(','));
                                                                                                  return BgWidget.editeInput({
                                                                                                      gvc,
                                                                                                      title: '',
                                                                                                      default: `${variantObj?.price ?? 0}`,
                                                                                                      placeHolder: '',
                                                                                                      callback: (value) => {
                                                                                                          const n = parseInt(`${value ?? 0}`, 10);
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
                                                                                      })()
                                                                                  )
                                                                              ),
                                                                          ]
                                                                              .map((item, index) => html` <div class="d-flex align-items-center" style="${getIndexStyle(index)}">${item}</div> `)
                                                                              .join('')}
                                                                      </div>`;
                                                                  })
                                                                  .join('')}
                                                          </div>
                                                      </div>`
                                                    : ''}
                                            `;
                                        },
                                        onCreate: () => {
                                            if (priceVM.loading) {
                                                Promise.all([
                                                    ApiUser.getUserGroupList('level').then((r) => {
                                                        if (r.result && r.response && Array.isArray(r.response.data)) {
                                                            return r.response.data;
                                                        }
                                                        return [];
                                                    }),
                                                    ApiUser.getPublicConfig('store_manager', 'manager').then((r: any) => {
                                                        if (r.result && Array.isArray(r.response.value.list)) {
                                                            return r.response.value.list.map((d: { id: string; name: string }) => ({
                                                                type: 'store',
                                                                key: d.id,
                                                                name: d.name,
                                                            }));
                                                        }
                                                        return [];
                                                    }),
                                                ]).then((dlist) => {
                                                    priceVM.levelData = dlist[0];
                                                    priceVM.storeData = dlist[1];
                                                    priceVM.loading = false;
                                                    gvc.notifyDataChange(priceVM.id);
                                                });
                                            }
                                        },
                                    });
                                })(),
                                'd-none'
                            ),
                            postMD.product_category === 'commodity'
                                ? BgWidget.mainCard(
                                      obj.gvc.bindView(() => {
                                          let loading = true;
                                          let dataList: any = [];
                                          postMD.designated_logistics = postMD.designated_logistics ?? { type: 'all', list: [] };
                                          return {
                                              bind: 'designatedLogistics',
                                              view: () => {
                                                  if (loading) {
                                                      return '';
                                                  }
                                                  return html` <div class="tx_700">指定物流配送方式</div>
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
                                                                                                          return BgWidget.spinner({ text: { visible: false } });
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
                                                                                                          ApiPageConfig.getPrivateConfig((window.parent as any).appName, 'logistics_setting')
                                                                                                              .then((dd: any) => {
                                                                                                                  if (!dd.result || !dd.response.result[0]) {
                                                                                                                      throw new Error('Failed to fetch logistics setting or empty result.');
                                                                                                                  }

                                                                                                                  const shipment_setting = dd.response.result[0].value;

                                                                                                                  // 合併 ShipmentConfig.list 和 shipment_setting.custom_delivery
                                                                                                                  const combinedList = [
                                                                                                                      ...ShipmentConfig.list.map((dd) => ({
                                                                                                                          name: dd.title,
                                                                                                                          value: dd.value,
                                                                                                                      })),
                                                                                                                      ...(shipment_setting.custom_delivery ?? []).map((dd: any) => ({
                                                                                                                          form: dd.form,
                                                                                                                          name: dd.name,
                                                                                                                          value: dd.id,
                                                                                                                      })),
                                                                                                                  ];

                                                                                                                  // 過濾出 shipment_setting.support 中支援的項目
                                                                                                                  const supportedList = combinedList.filter((d1) =>
                                                                                                                      shipment_setting.support.some((d2: any) => d2 === d1.value)
                                                                                                                  );

                                                                                                                  // 轉換為 designatedVM.dataList 所需的格式
                                                                                                                  designatedVM.dataList = supportedList.map((item) => ({
                                                                                                                      key: item.value,
                                                                                                                      value: item.name,
                                                                                                                  }));

                                                                                                                  // 更新狀態並通知資料變更
                                                                                                                  designatedVM.loading = false;
                                                                                                                  gvc.notifyDataChange(designatedVM.id);
                                                                                                              })
                                                                                                              .catch((error) => {
                                                                                                                  console.error('Error fetching logistics setting:', error);
                                                                                                                  designatedVM.loading = false;
                                                                                                                  gvc.notifyDataChange(designatedVM.id);
                                                                                                              });
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
                                  )
                                : ``,
                            BgWidget.mainCard(
                                obj.gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            postMD.relative_product = postMD.relative_product ?? [];
                                            try {
                                                return html`
                                                    <div style="font-weight: 700;" class="mb-3 d-flex flex-column">相關商品 ${BgWidget.grayNote('相關商品將會顯示於商品頁底部')}</div>
                                                    <div class="d-flex align-items-center gray-bottom-line-18" style="gap: 24px; justify-content: space-between;">
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
                                                            { textStyle: 'font-weight: 400;' }
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
                                                                        return html` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                            <span class="tx_normal">${index + 1} .</span>
                                                                            ${BgWidget.validImageBox({
                                                                                gvc: gvc,
                                                                                image: opt.image,
                                                                                width: 40,
                                                                            })}
                                                                            <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                                            ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
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
                                                        ${carTitle}通知 ${BgWidget.grayNote(`購買此${carTitle}會收到的通知信，內容為空則不寄送。`)}
                                                    </div>
                                                    ${BgWidget.richTextEditor({
                                                        gvc: gvc,
                                                        content: postMD.email_notice ?? '',
                                                        callback: (content) => {
                                                            postMD.email_notice = content;
                                                        },
                                                        title: '內容編輯',
                                                        quick_insert: (() => {
                                                            return [
                                                                {
                                                                    title: '商家名稱',
                                                                    value: '@{{app_name}}',
                                                                },
                                                                {
                                                                    title: '會員姓名',
                                                                    value: '@{{user_name}}',
                                                                },
                                                                {
                                                                    title: '姓名',
                                                                    value: '@{{姓名}}',
                                                                },
                                                                {
                                                                    title: '電話',
                                                                    value: '@{{電話}}',
                                                                },
                                                                {
                                                                    title: '地址',
                                                                    value: '@{{地址}}',
                                                                },
                                                                {
                                                                    title: '信箱',
                                                                    value: '@{{信箱}}',
                                                                },
                                                            ];
                                                        })(),
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
                                                html` <div class="title-container px-0">
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
                        ]
                            .filter((dd) => {
                                return dd;
                            })
                            .join('<div class="my-3"></div>');
                    },
                    divCreate: {
                        class: `w-100`,
                    },
                };
            })
        );
    }
}
