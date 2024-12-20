var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Tool } from '../../modules/tool.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Ad } from '../public/ad.js';
import { Language } from "../../glitter-base/global/language.js";
const html = String.raw;
export class PdClass {
    static jumpAlert(obj) {
        var _a, _b;
        const className = Tool.randomString(5);
        const fixedStyle = (() => {
            let style = '';
            if (obj.justify === 'top') {
                style += `top: 90px;`;
            }
            else if (obj.justify === 'bottom') {
                style += `bottom: 24px;`;
            }
            if (obj.align === 'left') {
                style += `left: 12px;`;
            }
            else if (obj.align === 'center') {
                style += `left: 50%; right: 50%;`;
            }
            else if (obj.align === 'right') {
                style += `right: 12px;`;
            }
            return style;
        })();
        const transX = obj.align === 'center' ? '-50%' : '0';
        obj.gvc.addStyle(`
            .bounce-effect-${className} {
                animation: bounce 0.5s alternate;
                animation-iteration-count: 2;
                position: fixed;
                ${fixedStyle}
                background-color: #393939;
                opacity: 0.85;
                color: white;
                padding: 10px;
                border-radius: 8px;
                width: ${(_a = obj.width) !== null && _a !== void 0 ? _a : 120}px;
                text-align: center;
                z-index: 100001;
                transform: translateX(${transX});
            }

            @keyframes bounce {
                0% {
                    transform: translate(${transX}, 0);
                }
                100% {
                    transform: translate(${transX}, -6px);
                }
            }
        `);
        const htmlString = html `<div class="bounce-effect-${className}">${obj.text}</div>`;
        obj.gvc.glitter.document.body.insertAdjacentHTML('beforeend', htmlString);
        setTimeout(() => {
            const element = document.querySelector(`.bounce-effect-${className}`);
            if (element) {
                element.remove();
            }
        }, (_b = obj.timeout) !== null && _b !== void 0 ? _b : 2000);
    }
    static ObjCompare(obj1, obj2) {
        const Obj1_keys = Object.keys(obj1);
        const Obj2_keys = Object.keys(obj2);
        if (Obj1_keys.length !== Obj2_keys.length) {
            return false;
        }
        for (let k of Obj1_keys) {
            if (obj1[k] !== obj2[k]) {
                return false;
            }
        }
        return true;
    }
    static lightenColor(color, percent) {
        var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = ((num >> 8) & 0x00ff) + amt, B = (num & 0x0000ff) + amt;
        return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
    }
    static addSpecStyle(gvc) {
        var _a, _b, _c, _d, _e;
        const glitter = gvc.glitter;
        const titleFontColor = (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333';
        const borderButtonBgr = (_b = glitter.share.globalValue['theme_color.0.border-button-bg']) !== null && _b !== void 0 ? _b : '#fff';
        const borderButtonText = (_c = glitter.share.globalValue['theme_color.0.border-button-text']) !== null && _c !== void 0 ? _c : '#333333';
        const solidButtonBgr = (_d = glitter.share.globalValue['theme_color.0.solid-button-bg']) !== null && _d !== void 0 ? _d : '#dddddd';
        const solidButtonText = (_e = glitter.share.globalValue['theme_color.0.solid-button-text']) !== null && _e !== void 0 ? _e : '#000000';
        gvc.addStyle(`
            .add-wish-container {
                align-items: center;
                justify-content: center;
                gap: 5px;
                cursor: pointer;
                font-size: 15px;
                text-decoration: none !important;
                color: ${titleFontColor};
            }

            .spec-option {
                display: flex;
                padding: 10px;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
                gap: 10px;
                border: 1px solid ${borderButtonBgr};
                color: ${borderButtonText};
                cursor: pointer;
                transition: 0.3s;
            }

            .spec-option.selected-option {
                background: ${solidButtonBgr};
                color: ${solidButtonText};
            }

            .spec-option:not(.selected-option):hover {
                background: ${this.lightenColor(solidButtonBgr, 50)};
            }

            .add-cart-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border-radius: 5px;
                border: 1px solid ${solidButtonBgr};
                background: ${solidButtonBgr};
                color: ${solidButtonText};
                width: 200px;
                height: 100%;
                transition: 0.3s;
            }

            .add-cart-btn:hover {
                background: ${this.lightenColor(solidButtonBgr, 50)};
                border: 1px solid ${this.lightenColor(solidButtonBgr, 50)};
            }

            .no-stock {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border-radius: 5px;
                border: 1px solid ${this.lightenColor(solidButtonBgr, 50)};
                background: ${this.lightenColor(solidButtonBgr, 50)};
                color: ${solidButtonText};
                width: 200px;
                height: 100%;
                cursor: not-allowed;
            }

            .custom-select {
                -webkit-appearance: none;
                -moz-appearance: none;
                background: transparent;
                background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
                background-repeat: no-repeat;
                background-position-x: 97.5%;
                background-position-y: 0.75rem;
                border: 1px solid #dfdfdf;
                border-radius: 2px;
                margin-right: 2rem;
                padding: 0.5rem 1rem;
                padding-right: 2rem;
                height: 46px;
            }

            .swiper-slide.swiper-slide-sm {
                opacity: 0.5;
            }

            .swiper-slide.swiper-slide-sm.swiper-slide-thumb-active {
                opacity: 1;
            }

            .swiper-button-prev {
                --swiper-theme-color: ${this.lightenColor(borderButtonBgr, 50)};
            }

            .swiper-button-next {
                --swiper-theme-color: ${this.lightenColor(borderButtonBgr, 50)};
            }
        `);
    }
    static changePage(prod, gvc) {
        const glitter = gvc.glitter;
        let path = '';
        if (!(prod.seo && prod.seo.domain)) {
            glitter.setUrlParameter('product_id', prod.id);
            path = 'products';
        }
        else {
            glitter.setUrlParameter('product_id', undefined);
            if (prod.language_data && prod.language_data[Language.getLanguage()].seo) {
                path = `products/${prod.language_data[Language.getLanguage()].seo.domain}`;
            }
            else {
                path = `products/${prod.seo.domain}`;
            }
        }
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            cl.changePage(path, 'page', {});
        });
    }
    static selectSpec(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const titleFontColor = obj.titleFontColor;
        const prod = obj.prod;
        const vm = obj.vm;
        const ids = {
            price: glitter.getUUID(),
            wishStatus: glitter.getUUID(),
            addCartButton: glitter.getUUID(),
        };
        obj.gvc.addStyle(`

.insignia {
    border-radius: 0.5rem;
    padding: 6px 8px;
    font-size: 14px;
    display: inline-block;
    font-weight: 500;
    line-height: 1.5;
    text-align: center;
    white-space: normal;
    vertical-align: baseline;
}
`);
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });
        return html `
            <h1 style="color: ${titleFontColor}">${prod.title}</h1>
            ${prod.min_qty ? `<div class="insignia w-auto mt-n2 mb-2 fw-500 fs-6 py-2" style="background: #ffe9b2;margin-left:5px;">${Language.text('min_p_count').replace('_c_', prod.min_qty)}</div>` : ``}
            <h2 style="color: ${titleFontColor}">
                ${gvc.bindView({
            bind: ids.price,
            view: () => {
                const v = prod.variants.find((variant) => {
                    return PdClass.ObjCompare(variant.spec, vm.specs);
                });
                return v ? `$ ${v.sale_price.toLocaleString()}` : '錯誤';
            },
        })}
            </h2>
            ${gvc.map(prod.specs.map((spec, index1) => {
            return html `<div>
                            <h5>${(spec.language_title && spec.language_title[Language.getLanguage()]) || spec.title}</h5>
                            <div class="d-flex gap-2 flex-wrap">
                                ${gvc.map(spec.option.map((opt) => {
                return html `<div
                                            gvc-option="spec-option-${index1}"
                                            class="spec-option ${vm.specs[index1] === opt.title ? 'selected-option' : ''}"
                                            onclick="${gvc.event((e) => {
                    const allOptions = document.querySelectorAll(`div[gvc-option=spec-option-${index1}]`);
                    allOptions.forEach((option) => {
                        option.classList.remove('selected-option');
                    });
                    e.classList.toggle('selected-option');
                    vm.specs[index1] = opt.title;
                    const v = prod.variants.find((variant) => {
                        return PdClass.ObjCompare(variant.spec, vm.specs);
                    });
                    if (v === null || v === void 0 ? void 0 : v.preview_image) {
                        let index = prod.preview_image.findIndex((src) => { return src == v.preview_image; });
                        if (index >= 0) {
                            vm.swiper.slideTo(index);
                        }
                    }
                    gvc.notifyDataChange(ids.price);
                    gvc.notifyDataChange(ids.addCartButton);
                })}"
                                        >
                                            <span style="font-size: 15px; font-weight: 500; letter-spacing: 1.76px;">${(opt.language_title && opt.language_title[Language.getLanguage()]) || opt.title}</span>
                                        </div>`;
            }))}
                            </div>
                        </div>
                        <div class="mt-3"></div>`;
        }))}
            <div class="d-flex gap-3" style="${document.body.clientWidth > 768 ? 'height: 46px;' : 'flex-direction: column;'} ">
                <div class=" gap-2 align-items-center ${(obj.with_qty === false) ? `d-none` : `d-flex`}">
                    <span>${Language.text('quantity')}</span>
                    <select
                        class="form-select custom-select"
                        style="border-radius: 5px; color: #575757; width: 100px;"
                        onchange="${gvc.event((e) => {
            vm.quantity = e.value;
            gvc.notifyDataChange(ids.addCartButton);
        })}"
                    >
                        ${gvc.map([...new Array(50)].map((item, index) => {
            return html ` <option value="${index + 1}">${index + 1}</option>`;
        }))}
                    </select>
                </div>
                ${gvc.bindView({
            bind: ids.addCartButton,
            view: () => {
                const variant = prod.variants.find((item) => PdClass.ObjCompare(item.spec, vm.specs));
                const cartItem = ApiCart.cart.line_items.find((item) => PdClass.ObjCompare(item.spec, vm.specs));
                if (!variant) {
                    return html `<button class="no-stock" disabled>發生錯誤</button>`;
                }
                Ad.gtagEvent('view_item', {
                    currency: 'TWD',
                    value: variant.sale_price,
                    items: [
                        {
                            item_id: prod.id,
                            item_name: prod.title,
                            item_variant: variant.spec.length > 0 ? variant.spec.join('-') : '',
                            price: variant.sale_price,
                        },
                    ],
                });
                Ad.fbqEvent('ViewContent', {
                    content_ids: [prod.id],
                    content_type: 'product',
                    contents: [
                        {
                            id: prod.id,
                            quantity: 1,
                        },
                    ],
                    value: variant.sale_price,
                    currency: 'TWD',
                });
                if ((variant.stock < parseInt(vm.quantity, 10) || (cartItem && variant.stock < cartItem.count + parseInt(vm.quantity, 10))) && `${variant.show_understocking}` !== 'false') {
                    return html `<button class="no-stock" disabled>${Language.text('out_of_stock')}</button>`;
                }
                return html `<button
                            class="add-cart-btn"
                            onclick="${gvc.event(() => {
                    if (obj.only_select) {
                        obj.only_select({ id: prod.id, specs: vm.specs });
                    }
                    else {
                        ApiCart.addToCart(`${prod.id}`, vm.specs, vm.quantity);
                        gvc.glitter.recreateView('.js-cart-count');
                        gvc.glitter.recreateView('.shopping-cart');
                        PdClass.jumpAlert({
                            gvc,
                            text: html `${Language.text('add_to_cart_success')}`,
                            justify: 'top',
                            align: 'center',
                            width: 300,
                        });
                        obj.callback && obj.callback();
                    }
                })}"
                        >
                            ${Language.text('add_to_cart')}
                        </button>`;
            },
            divCreate: {
                style: 'height: 46px;',
            },
        })}
            </div>
            <div class="d-flex py-3" style="color: #554233">
                <span
                    class="d-flex nav-link p-0 add-wish-container"
                    onclick="${gvc.event(() => {
            if (CheckInput.isEmpty(GlobalUser.token)) {
                changePage('login', 'page', {});
                return;
            }
            ApiShop.getWishList().then((getRes) => {
                var _a;
                if (getRes.result && getRes.response.data) {
                    if (getRes.response.data.find((item) => item.id === prod.id)) {
                        ApiShop.deleteWishList(`${prod.id}`).then(() => __awaiter(this, void 0, void 0, function* () {
                            PdClass.jumpAlert({
                                gvc,
                                text: '刪除成功',
                                justify: 'top',
                                align: 'center',
                            });
                            vm.wishStatus = false;
                            gvc.notifyDataChange(ids.wishStatus);
                        }));
                    }
                    else {
                        const variant = (_a = prod.variants.find((item) => PdClass.ObjCompare(item.spec, vm.specs))) !== null && _a !== void 0 ? _a : prod.variants[0];
                        Ad.gtagEvent('add_to_wishlist', {
                            currency: 'TWD',
                            value: variant.sale_price,
                            items: [
                                {
                                    item_id: prod.id,
                                    item_name: prod.title,
                                    item_variant: variant.spec.length > 0 ? variant.spec.join('-') : '',
                                    price: variant.sale_price,
                                },
                            ],
                        });
                        Ad.fbqEvent('AddToWishlist', {
                            content_ids: [prod.id],
                            contents: [
                                {
                                    id: prod.id,
                                    quantity: 1,
                                },
                            ],
                            value: variant.sale_price,
                            currency: 'TWD',
                        });
                        ApiShop.postWishList(`${prod.id}`).then(() => __awaiter(this, void 0, void 0, function* () {
                            PdClass.jumpAlert({
                                gvc,
                                text: '新增成功',
                                justify: 'top',
                                align: 'center',
                            });
                            vm.wishStatus = true;
                            gvc.notifyDataChange(ids.wishStatus);
                        }));
                    }
                }
            });
        })}"
                >
                    ${gvc.bindView({
            bind: ids.wishStatus,
            view: () => {
                if (window.store_info.wishlist == false) {
                    return ``;
                }
                else {
                    if (vm.wishStatus) {
                        return html ` <i class="fa-solid fa-heart"></i>
                                    <span>${Language.text('remove_to_wishlist')}</span>`;
                    }
                    else {
                        return html ` <i class="fa-regular fa-heart"></i>
                                    <span>${Language.text('add_to_wishlist')}</span>`;
                    }
                }
            },
        })}
                </span>
            </div>`;
    }
    static isPhone() {
        return document.body.clientWidth < 768;
    }
    static isPad() {
        return document.body.clientWidth >= 768 && document.body.clientWidth <= 960;
    }
}
