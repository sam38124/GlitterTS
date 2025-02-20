var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';
import { Currency } from '../../glitter-base/global/currency.js';
const html = String.raw;
export class UMWishList {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const vm = {
            dataList: [],
        };
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });
        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                }
                else {
                    const isWebsite = document.body.clientWidth > 768;
                    return html `
                        <div class="um-container row mx-auto">
                            <div class="col-12">${UmClass.nav(gvc)}</div>
                            <div class="col-12 mt-2" style="min-height: 500px;">
                                <div class="mx-auto orderList pt-3 mb-4 row">
                                    ${(() => {
                        if (vm.dataList.length === 0) {
                            return html `<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
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
                            .map((item) => {
                            return html ` <div
                                                    class="col-6 col-md-3 px-1 px-md-2"
                                                    gvc-prod-id="${item.id}"
                                                    onclick="${gvc.event(() => {
                                let path = '';
                                if (!(item.content.seo && item.content.seo.domain)) {
                                    glitter.setUrlParameter('product_id', subData.id);
                                    path = 'products';
                                }
                                else {
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
                                ApiShop.deleteWishList(`${item.id}`).then(() => __awaiter(this, void 0, void 0, function* () {
                                    UmClass.jumpAlert({
                                        gvc,
                                        text: Language.text('delete_success'),
                                        justify: 'top',
                                        align: 'center',
                                    });
                                    const elem = document.querySelector(`div[gvc-prod-id="${item.id}"]`);
                                    if (elem) {
                                        elem.remove();
                                    }
                                }));
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
                                const minPrice = Math.min(...item.content.variants.map((dd) => {
                                    return dd.sale_price;
                                }));
                                return `NT.$ ${minPrice.toLocaleString()}`;
                            })()}
                                                                </div>
                                                                ${(() => {
                                var _a, _b;
                                const minPrice = Math.min(...item.content.variants.map((dd) => {
                                    return dd.sale_price;
                                }));
                                const comparePrice = (_b = ((_a = item.content.variants.find((dd) => {
                                    return dd.sale_price === minPrice;
                                })) !== null && _a !== void 0 ? _a : {}).compare_price) !== null && _b !== void 0 ? _b : 0;
                                if (comparePrice > 0 && minPrice < comparePrice) {
                                    return html `<div class="text-decoration-line-through card-cost-price mb-1">${Currency.convertCurrencyText(comparePrice)}</div>`;
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
            divCreate: {
                class: 'container',
            },
            onCreate: () => {
                if (loadings.view) {
                    gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                        ApiShop.getWishList().then((res) => __awaiter(this, void 0, void 0, function* () {
                            console.log(res);
                            if (res.result && res.response.data) {
                                vm.dataList = res.response.data;
                            }
                            else {
                                vm.dataList = [];
                            }
                            loadings.view = false;
                            gvc.notifyDataChange(ids.view);
                        }));
                    }, () => { });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, UMWishList);
