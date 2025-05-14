import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';
import { Currency } from '../../glitter-base/global/currency.js';

const html = String.raw;

interface ProductSEO {
  title: string;
  domain: string;
  content: string;
  keywords: string;
}

interface SpecOption {
  title: string;
  expand?: boolean;
}

interface ProductSpec {
  title: string;
  option: SpecOption[];
}

interface Token {
  exp: number;
  iat: number;
  userID: number;
  account: string;
  userData: Record<string, unknown>;
}

interface Variant {
  sku: string;
  cost: number;
  spec: string[];
  type: string;
  stock: number;
  profit: number;
  weight: string;
  barcode: string;
  v_width: number;
  editable: boolean;
  v_height: number;
  v_length: number;
  product_id: number;
  sale_price: number;
  compare_price: number;
  preview_image: string;
  shipment_type: string;
  shipment_weight: number;
  show_understocking: string;
}

interface ProductType {
  product: boolean;
  giveaway: boolean;
  addProduct: boolean;
}

interface ProductContent {
  id: number;
  seo: ProductSEO;
  type: string;
  specs: ProductSpec[];
  title: string;
  token: Token;
  status: string;
  content: string;
  visible: string;
  template: string;
  variants: Variant[];
  hideIndex: string;
  max_price: number;
  min_price: number;
  collection: any[];
  productType: ProductType;
  content_json: any[];
  in_wish_list: boolean;
  content_array: any[];
  preview_image: string[];
  relative_product: any[];
}

interface Product {
  id: number;
  userID: number;
  content: ProductContent;
  created_time: string;
  updated_time: string;
  status: number;
}

export class UMWishList {
  static main(gvc: GVC, widget: any, subData: any) {
    const glitter = gvc.glitter;
    const vm = {
      dataList: [] as Product[],
    };
    const ids = {
      view: glitter.getUUID(),
    };
    const loadings = {
      view: true,
    };

    let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
    gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
      changePage = cl.changePage;
    });
    gvc.addMtScript(
      [{ src: `${gvc.glitter.root_path}/jslib/lottie-player.js` }],
      () => {
        ApiShop.getWishList().then(async res => {
          if (res.result && res.response.data) {
            vm.dataList = res.response.data;
          } else {
            vm.dataList = [];
          }
          loadings.view = false;
          gvc.notifyDataChange(ids.view);
        });
      },
      () => {}
    );
    return gvc.bindView({
      bind: ids.view,
      view: () => {
        if (loadings.view) {
          return UmClass.spinner();
        } else {
          return html`
            <div class="row mx-auto p-0">
              <div class="w-100 align-items-center d-flex py-3 pb-lg-3 pt-lg-0" style="gap:10px;">
                <div
                  class="d-none d-lg-flex"
                  style="background: #FF9705;background: #FF9705;width:4px;height: 20px;"
                  onclick="${gvc.event(() => {
                    gvc.glitter.getModule(
                      new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href,
                      cl => {
                        cl.changePage('account_userinfo', 'home', {});
                      }
                    );
                  })}"
                ></div>
                <div
                  class="d-flex d-lg-none align-items-center justify-content-center"
                  style="width:20px;height: 20px;"
                  onclick="${gvc.event(() => {
                    gvc.glitter.getModule(
                      new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href,
                      cl => {
                        cl.changePage('account_userinfo', 'home', {});
                      }
                    );
                  })}"
                >
                  <i class="fa-solid fa-angle-left fs-4"></i>
                </div>
                <div class="um-info-title fw-bold " style="font-size: 24px;">${Language.text('wishlist')}</div>
              </div>
              <div class="col-12" style="min-height: 500px;">
                <div class="mx-auto orderList pt-3 mb-4 row">
                  ${(() => {
                    if (vm.dataList.length === 0) {
                      return html`<div
                        class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto"
                      >
                        <lottie-player
                          style="max-width: 100%;width: 300px;"
                          src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                          speed="1"
                          loop="true"
                          background="transparent"
                        ></lottie-player>
                        <span class="mb-5 fs-5">${Language.text('no_items_added')}</span>
                      </div>`;
                    }
                    return vm.dataList
                      .map((item, index) => {
                        return html` <div
                          class="col-6 col-md-3 px-1 px-md-2"
                          gvc-prod-id="${item.id}"
                          onclick="${gvc.event(() => {
                            let path = '';
                            if (!(item.content.seo && item.content.seo.domain)) {
                              glitter.setUrlParameter('product_id', subData.id);
                              path = 'products';
                            } else {
                              glitter.setUrlParameter('product_id', undefined);
                              path = `products/${item.content.seo.domain}`;
                            }
                            changePage(path, 'page', {});
                          })}"
                        >
                          <div class="card mb-3" style="cursor: pointer">
                            <div class="card-img">
                              <div
                                class="um-icon-container"
                                onclick="${gvc.event((e, event) => {
                                  event.stopPropagation();
                                  if (CheckInput.isEmpty(GlobalUser.token)) {
                                    changePage('login', 'page', {});
                                    return;
                                  }
                                  ApiShop.deleteWishList(`${item.id}`).then(async () => {
                                    UmClass.jumpAlert({
                                      gvc,
                                      text: Language.text('delete_success'),
                                      justify: 'top',
                                      align: 'center',
                                    });
                                    vm.dataList.splice(index, 1);
                                    gvc.notifyDataChange(ids.view);
                                  });
                                })}"
                              >
                                <i class="fa-solid fa-xmark"></i>
                              </div>
                              <div
                                class="card-img-top um-img-bgr"
                                style="background-image: url('${(() => {
                                  if (item.content.preview_image[0]) {
                                    return item.content.preview_image[0];
                                  }
                                  return 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png';
                                })()}');"
                              ></div>
                            </div>
                            <div class="card-body text-start p-2">
                              <div class="fs-6 um-card-title mb-1">${item.content.title}</div>
                              <div class="d-flex align-items-center gap-1">
                                <div class="fs-6 fw-500 card-sale-price mb-1">
                                  ${(() => {
                                    const minPrice = Math.min(
                                      ...item.content.variants.map(dd => {
                                        return dd.sale_price;
                                      })
                                    );
                                    return `NT.$ ${minPrice.toLocaleString()}`;
                                  })()}
                                </div>
                                ${(() => {
                                  const minPrice = Math.min(
                                    ...item.content.variants.map((dd: { sale_price: number }) => {
                                      return dd.sale_price;
                                    })
                                  );
                                  const comparePrice =
                                    (
                                      item.content.variants.find((dd: { sale_price: number }) => {
                                        return dd.sale_price === minPrice;
                                      }) ?? {}
                                    ).compare_price ?? 0;
                                  if (comparePrice > 0 && minPrice < comparePrice) {
                                    return html`<div class="text-decoration-line-through card-cost-price mb-1">
                                      ${Currency.convertCurrencyText(comparePrice)}
                                    </div>`;
                                  }
                                  return '';
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>`;
                      })
                      .join('');
                  })()}
                </div>
              </div>
            </div>
          `;
        }
      },
    });
  }
}

(window as any).glitter.setModule(import.meta.url, UMWishList);
