var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { PdClass } from './pd-class.js';
import { Tool } from '../../modules/tool.js';
const html = String.raw;
export class ProductCardC01 {
    static main(gvc, widget, subData) {
        var _a, _b;
        const glitter = gvc.glitter;
        const wishId = glitter.getUUID();
        const prod = subData.content;
        const titleFontColor = (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333';
        const vm = {
            quantity: '1',
            data: prod,
            specs: prod.specs.map((spec) => {
                return spec.option[0].title;
            }),
            wishStatus: ((_b = glitter.share.wishList) !== null && _b !== void 0 ? _b : []).some((item) => {
                return item.id === prod.id;
            }),
        };
        let ratio = widget.formData.ratio || '1:1';
        if (ratio.split(':').length !== 2) {
            ratio = '1:1';
        }
        const rsp = ratio.split(':').map((dd) => Number(dd));
        let radius = widget.formData.border.split(',');
        if (radius.length !== 4) {
            radius = [20, 20, 20, 20];
        }
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });
        PdClass.addSpecStyle(gvc);
        gvc.addStyle(`
            .card-border {
                cursor: pointer;
                border-radius: 0;
                border: 0;
                overflow: hidden;
                background: none !important;
            }
            .card-image {
                border-radius: ${radius.map((dd) => `${dd}px`).join(' ')};
                padding-bottom: ${((rsp[1] / rsp[0]) * 100).toFixed(0)}%;
                cursor: pointer;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                position: relative;
                overflow: hidden;
            }
            .add-cart-child {
                width: 100%;
                height: 45px;
                cursor: pointer;
                position: absolute;
                bottom: 0px;
                z-index: 2;
            }
            .add-cart-text {
                font-size: 16px;
                font-weight: 500;
                word-wrap: break-word;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #322b25;
                color: #ffffff;
            }
            .wish-button {
                position: absolute;
                right: 15px;
                top: 15px;
                min-height: 40px;
                min-width: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border-radius: 50%;
            }
            .card-tag {
                left: -3px;
                top: 25px;
            }
            .card-title-container {
                min-height: 55px;
                align-items: center;
                padding-bottom: 10px;
                padding-top: 10px;
            }
            .card-title-text {
                text-align: start;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: 1.76px;
                color: #322b25;
            }
            .card-price-container {
                gap: 10px;
                align-items: baseline;
                justify-content: start;
            }
            .card-sale-price {
                text-align: center;
                font-style: normal;
                line-height: normal;
                font-size: 16px;
                opacity: 0.9;
                color: #322b25;
            }
            .card-cost-price {
                text-align: center;
                color: #d45151;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                font-size: 14px;
                margin-right: 4px;
                letter-spacing: -0.98px;
            }
        `);
        return html `<div class="card mb-7 card-border">
            <div
                class="card-img-top parent card-image"
                style="background-image: url('${(() => {
            const innerText = prod.preview_image[0] || this.noImageURL;
            let rela_link = innerText;
            if (innerText.includes('size1440_s*px$_')) {
                [150, 600, 1200, 1440].reverse().map((dd) => {
                    if (document.body.clientWidth < dd) {
                        rela_link = innerText.replace('size1440_s*px$_', `size${dd}_s*px$_`);
                    }
                });
            }
            return rela_link;
        })()}')"
                onclick="${gvc.event(() => {
            let path = '';
            if (!(prod.seo && prod.seo.domain)) {
                glitter.setUrlParameter('product_id', subData.id);
                path = 'products';
            }
            else {
                glitter.setUrlParameter('product_id', undefined);
                path = `products/${prod.seo.domain}`;
            }
            changePage(path, 'page', {});
        })}"
            >
                <div class="child add-cart-child">
                    <div
                        class="w-100 h-100 p-3 add-cart-text"
                        onclick="${gvc.event((e, event) => {
            event.stopPropagation();
            return gvc.glitter.innerDialog((gvc) => {
                return html ` <div
                                    class="bg-white shadow rounded-3"
                                    style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: 600px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
                                >
                                    <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                                        <div class="w-100 d-flex align-items-center p-3 border-bottom" style="position: sticky; top: 0; background: #fff;">
                                            <div class="flex-fill"></div>
                                            <i
                                                class="fa-regular fa-circle-xmark fs-5 text-dark"
                                                style="cursor: pointer"
                                                onclick="${gvc.event(() => {
                    gvc.closeDialog();
                })}"
                                            ></i>
                                        </div>
                                        <div class="c_dialog">
                                            <div class="c_dialog_body">
                                                <div class="c_dialog_main" style="gap: 24px; height: auto; max-height: 500px; padding: 12px 20px;">
                                                    ${PdClass.selectSpec({
                    gvc,
                    titleFontColor,
                    prod,
                    vm,
                })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            }, Tool.randomString(7));
        })}"
                    >
                        <i class="fa-regular fa-cart-shopping me-2"></i>加入購物車
                    </div>
                </div>
            </div>
            <div
                class="wishBt wish-button"
                onclick="${gvc.event(() => {
            if (CheckInput.isEmpty(GlobalUser.token)) {
                changePage('login', 'page', {});
                return;
            }
            if (vm.wishStatus) {
                ApiShop.deleteWishList(`${prod.id}`).then(() => __awaiter(this, void 0, void 0, function* () {
                    PdClass.jumpAlert({
                        gvc,
                        text: '刪除成功',
                        justify: 'top',
                        align: 'center',
                    });
                    vm.wishStatus = !vm.wishStatus;
                    gvc.notifyDataChange(wishId);
                }));
            }
            else {
                ApiShop.postWishList(`${prod.id}`).then(() => __awaiter(this, void 0, void 0, function* () {
                    PdClass.jumpAlert({
                        gvc,
                        text: '新增成功',
                        justify: 'top',
                        align: 'center',
                    });
                    vm.wishStatus = !vm.wishStatus;
                    gvc.notifyDataChange(wishId);
                }));
            }
        })}"
            >
                ${gvc.bindView({
            bind: wishId,
            view: () => {
                if (vm.wishStatus) {
                    return html ` <i class="fa-solid fa-heart" style="color: #da1313"></i>`;
                }
                else {
                    return html ` <i class="fa-regular fa-heart"></i>`;
                }
            },
        })}
            </div>
            <div class="d-none card-tag">限時特價</div>
            <div class="card-collapse-parent cursor_pointer">
                <div class="px-1">
                    <div class="row gx-0 card-title-container mb-1">
                        <div class="col-12 mb-1">
                            <div class="d-block fs-6 card-title-text">${prod.title}</div>
                        </div>
                        <div class="d-flex col-12 p-0 card-price-container">
                            <div class="fs-6 fw-500 card-sale-price">
                                ${(() => {
            const minPrice = Math.min(...prod.variants.map((dd) => {
                return dd.sale_price;
            }));
            return `NT.$ ${minPrice.toLocaleString()}`;
        })()}
                            </div>
                            <div class="text-decoration-line-through d-none card-cost-price">
                                ${(() => {
            var _a, _b;
            const minPrice = Math.min(...prod.variants.map((dd) => {
                return dd.sale_price;
            }));
            const comparePrice = (_b = ((_a = prod.variants.find((dd) => {
                return dd.sale_price === minPrice;
            })) !== null && _a !== void 0 ? _a : {}).compare_price) !== null && _b !== void 0 ? _b : 0;
            return `NT.$ ${(minPrice < comparePrice ? comparePrice : minPrice).toLocaleString()}`;
        })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-container"></div>
        </div>`;
    }
}
ProductCardC01.noImageURL = 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png';
window.glitter.setModule(import.meta.url, ProductCardC01);
