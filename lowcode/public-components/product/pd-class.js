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
import { Language } from '../../glitter-base/global/language.js';
import { Currency } from '../../glitter-base/global/currency.js';
import { ProductInitial } from '../../public-models/product.js';
import { ApiTrack } from '../../glitter-base/route/api-track.js';
import { Animation } from '../../glitterBundle/module/Animation.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class PdClass {
    static jumpAlert(obj) {
        var _a, _b;
        const className = 'pd-class';
        const fixedStyle = (() => {
            const styles = [];
            if (obj.justify === 'top') {
                styles.push('top: 90px;');
            }
            else if (obj.justify === 'bottom') {
                styles.push('bottom: 24px;');
            }
            if (obj.align === 'left') {
                styles.push('left: 12px;');
            }
            else if (obj.align === 'center') {
                styles.push('left: 50%; right: 50%;');
            }
            else if (obj.align === 'right') {
                styles.push('right: 12px;');
            }
            return styles.join(' ');
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
        const htmlString = html ` <div class="bounce-effect-${className}">${obj.text}</div>`;
        obj.gvc.glitter.document.body.insertAdjacentHTML('beforeend', htmlString);
        setTimeout(() => {
            const element = document.querySelector(`.bounce-effect-${className}`);
            if (element) {
                element.remove();
            }
        }, (_b = obj.timeout) !== null && _b !== void 0 ? _b : 2000);
    }
    static ObjCompare(obj1, obj2, sort) {
        let Obj1_keys = Object.keys(obj1);
        let Obj2_keys = Object.keys(obj2);
        if (Obj1_keys.length !== Obj2_keys.length) {
            return false;
        }
        if (sort) {
            Obj1_keys = Obj1_keys.sort();
            Obj2_keys = Obj2_keys.sort();
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
        return ('#' +
            (0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16)
                .slice(1));
    }
    static addSpecStyle(gvc) {
        var _a, _b, _c, _d, _e;
        const glitter = gvc.glitter;
        const titleFontColor = (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333';
        const borderButtonBgr = (_b = glitter.share.globalValue['theme_color.0.border-button-bg']) !== null && _b !== void 0 ? _b : '#fff';
        const borderButtonText = (_c = glitter.share.globalValue['theme_color.0.border-button-text']) !== null && _c !== void 0 ? _c : '#333333';
        const solidButtonBgr = (_d = glitter.share.globalValue['theme_color.0.solid-button-bg']) !== null && _d !== void 0 ? _d : '#dddddd';
        const solidButtonText = (_e = glitter.share.globalValue['theme_color.0.solid-button-text']) !== null && _e !== void 0 ? _e : '#000000';
        gvc.glitter.addStyle(`
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
        height: 38px;
        padding-left: 10px;
        padding-right: 10px;
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
        border-radius: 5px;
        border: 1px solid ${borderButtonBgr};
        color: ${borderButtonText};
        background: none;
        height: 100%;
        transition: 0.3s;
      }

      .add-cart-imd-btn {
        border: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        background: ${solidButtonBgr};
        color: ${solidButtonText};
        height: 100%;
        transition: 0.3s;
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
        background-position-y: 0.5rem;
        border: 1px solid #dfdfdf;
        border-radius: 2px;
        margin-right: 2rem;
        padding: 0.5rem 1rem;
        padding-right: 2rem;
        height: 38px;
      }

      .swiper-slide.swiper-slide-sm {
        opacity: 0.5;
        background: none !important;
        padding: 0 !important;
        width: auto !important;
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
    static addCartAction(obj) {
        obj.gvc.glitter.innerDialog((gvc) => {
            return html ` <div
          class=" bg-white shadow  ${document.body.clientWidth > 768 ? `rounded-3` : ` position-absolute bottom-0`}"
          style=" ${document.body.clientWidth > 768
                ? `min-width: 400px; width: 1000px;max-height:calc(100% - 150px);overflow-y: auto;`
                : 'width:calc(100vw);height:100%;'}"
        >
          <div
            class="bg-white shadow  ${document.body.clientWidth > 768 ? `rounded-3` : `h-100`}"
            style="
                width: 100%;  position: relative;${document.body.clientWidth > 768 ? `` : `overflow-y: auto;`}"
          >
            <div
              class="w-100 d-flex align-items-center p-3 border-bottom"
              style="position: sticky; top: 0; background: #fff;z-index:12;height: calc(60px + ${gvc.glitter.share
                .top_inset}px);
              ${gvc.glitter.share.top_inset ? `padding-top: ${gvc.glitter.share.top_inset}px !important;` : ``}

"
            >
              <div
                class="fw-bold fs-5"
                style="color:${obj.titleFontColor}; white-space: nowrap;text-overflow: ellipsis;max-width: calc(100% - 40px); overflow: hidden;"
              >
                ${obj.prod.title}
              </div>
              <div class="flex-fill"></div>
              <div class="d-flex align-items-center justify-content-center" style="width:40px;height: 40px;">
                <i
                  class="fa-regular fa-circle-xmark fs-5 text-dark"
                  style="cursor: pointer"
                  onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}"
                ></i>
              </div>
            </div>
            <div
              class="c_dialog_main"
              style="gap: 24px;  max-height: calc(100% - 100px); ${document.body.clientWidth < 800
                ? `padding: 12px 20px;`
                : `padding: 30px;`}"
            >
              ${PdClass.selectSpec({
                gvc,
                titleFontColor: obj.titleFontColor,
                prod: obj.prod,
                vm: obj.vm,
                preview: true,
            })}
              <div class="d-sm-none" style="height:100px;"></div>
            </div>
          </div>
        </div>`;
        }, Tool.randomString(7), {
            animation: document.body.clientWidth < 768 ? Animation.popup : Animation.fade,
        });
    }
    static showSwiper(obj) {
        var _a;
        const isPhone = document.body.clientWidth < 768;
        obj.gvc.glitter.addStyleLink(['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css']);
        obj.gvc.glitter.addMtScript([
            {
                src: `${window.glitter.root_path}/jslib/lottie-player.js`,
            },
            {
                src: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`,
            },
        ], () => { }, () => { });
        obj.prod.variants.forEach(variant => {
            variant.preview_image = variant[`preview_image_${Language.getLanguage()}`] || variant.preview_image;
            if (variant.preview_image && !obj.prod.preview_image.includes(variant.preview_image)) {
                obj.prod.preview_image.push(variant.preview_image);
            }
        });
        PdClass.addSpecStyle(obj.gvc);
        const invisibleVariants = obj.prod.variants.filter(v => v.invisible);
        const visibleVariants = obj.prod.variants.filter(v => !v.invisible);
        if (obj.vm.specs.length === 0 || invisibleVariants.find(iv => Tool.ObjCompare(iv.spec, obj.vm.specs))) {
            obj.vm.specs = (_a = visibleVariants === null || visibleVariants === void 0 ? void 0 : visibleVariants[0].spec) !== null && _a !== void 0 ? _a : [];
        }
        obj.prod.preview_image = obj.prod.preview_image.filter(image => {
            return image !== 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
        });
        if (obj.prod.preview_image.length === 0) {
            obj.prod.preview_image = ['https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'];
        }
        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
            <div
              class="swiper${id}"
              id="dynamic-swiper${id}"
              style="width: 500px;position:relative;overflow: hidden;max-width: 100%;"
            >
              <div class="swiper-wrapper">
                ${obj.prod.preview_image
                        .map((image, index) => {
                        return html ` <div class="swiper-slide swiper-slide-def">
                      <img src="${image}" alt="${obj.prod.title}-${index}" />
                    </div>`;
                    })
                        .join('')}
              </div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
            ${obj.prod.preview_image.length > 1
                        ? html ` <div class="swiper-sm${id} mt-2" style="height: ${isPhone ? 75 : 100}px; overflow: hidden;">
                  <div class="swiper-wrapper">
                    ${obj.prod.preview_image
                            .map((image, index) => {
                            return html ` <div class="swiper-slide swiper-slide-sm" data-image-index="${index}">
                          <img
                            src="${image}"
                            alt="${obj.prod.title}-${index}-sm"
                            style="height: ${isPhone ? 75 : 100}px;width: auto !important;"
                          />
                        </div>`;
                        })
                            .join('')}
                  </div>
                </div>`
                        : ``}
          `;
                },
                divCreate: {
                    option: [{ key: 'id', value: id }],
                    style: `overflow:hidden;position:relative;${document.body.clientWidth > 800 ? `width:500px;` : `width:100%:`}`,
                },
                onCreate: () => {
                    const si = setInterval(() => {
                        const Swiper = window.Swiper;
                        if (Swiper) {
                            if (obj.prod.preview_image.length > 1) {
                                const thumbs = new Swiper(`.swiper-sm${id}`, {
                                    slidesPerView: 4,
                                    spaceBetween: 8,
                                    watchSlidesVisibility: true,
                                });
                                obj.vm.swiper = new Swiper(`.swiper${id}`, {
                                    loop: true,
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    },
                                    thumbs: {
                                        swiper: thumbs,
                                    },
                                });
                            }
                            else {
                                obj.vm.swiper = new Swiper(`.swiper${id}`, {
                                    loop: true,
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    },
                                });
                            }
                            const prod = obj.prod;
                            if (prod.product_category !== 'kitchen') {
                                const v = prod.variants.find(variant => {
                                    return PdClass.ObjCompare(variant.spec, prod.specs.map(spec => {
                                        return spec.option[0].title;
                                    }), true);
                                });
                                if (v === null || v === void 0 ? void 0 : v.preview_image) {
                                    let index = prod.preview_image.findIndex(variant => {
                                        return variant == v.preview_image;
                                    });
                                    if (index && obj.vm.swiper) {
                                    }
                                }
                            }
                            clearInterval(si);
                        }
                    }, 200);
                },
            };
        });
    }
    static isShoppingPage() {
        const glitter = window.glitter;
        return ['hidden/', 'shop/'].find(dd => {
            return ((glitter.getUrlParameter('page') || '').startsWith(dd) ||
                (glitter.getUrlParameter('page_refer') || '').startsWith(dd));
        });
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
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            cl.changePage(path, 'page', {});
        });
    }
    static getVariant(prod, vm) {
        var _a;
        if (prod.product_category === 'kitchen') {
            let price = 0;
            let show_understocking = 'false';
            let stock = Infinity;
            if (prod.specs.length) {
                price = vm.specs
                    .map((spec, index) => {
                    var _a, _b;
                    const dpe = prod.specs[index].option.find((dd) => {
                        return dd.title === spec;
                    });
                    if (((_a = dpe.stock) !== null && _a !== void 0 ? _a : '') !== '' && stock > parseInt(dpe.stock, 10)) {
                        stock = parseInt(dpe.stock, 10);
                    }
                    if (((_b = dpe.stock) !== null && _b !== void 0 ? _b : '') !== '') {
                        show_understocking = `true`;
                    }
                    return parseInt(dpe.price, 10);
                })
                    .reduce((a, b) => a + b, 0);
            }
            else {
                price = parseInt(prod.price, 10);
                show_understocking = `${((_a = prod.stock) !== null && _a !== void 0 ? _a : '') !== ''}`;
                stock = parseInt(prod.stock, 10);
            }
            return {
                sku: '',
                spec: [],
                type: 'variants',
                stock: stock,
                v_width: 0,
                product_id: prod.id,
                sale_price: price,
                compare_price: 0,
                shipment_type: 'none',
                show_understocking: show_understocking,
            };
        }
        else {
            return prod.variants.find(item => PdClass.ObjCompare(item.spec, vm.specs, true));
        }
    }
    static showCanBuyStock(variant, titleFontColor) {
        if (variant && variant.show_understocking !== 'false' && window.store_info.stock_view) {
            const stockInt = parseInt(`${variant.stock}`, 10);
            const stockValue = !isNaN(stockInt) && stockInt > 0 ? stockInt : 0;
            const stockClass = stockValue === 0 ? 'text-danger' : '';
            return html `
        <div class="${stockClass} fw-500 mt-2 mb-1 fs-6" style="color: ${titleFontColor};">
          ${Language.text('can_buy')}：${stockValue}
        </div>
      `;
        }
        return html `<div class=" fw-500 mt-2 mb-1 fs-6">&ensp;</div>`;
    }
    static selectSpec(obj) {
        var _a, _b;
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const titleFontColor = obj.titleFontColor;
        const prod = obj.prod;
        const vm = obj.vm;
        const dialog = new ShareDialog(gvc.glitter);
        const ids = {
            price: glitter.getUUID(),
            wishStatus: glitter.getUUID(),
            addCartButton: glitter.getUUID(),
            stock_count: glitter.getUUID(),
            qty_count: glitter.getUUID(),
            ids_spec: glitter.getUUID(),
        };
        obj.gvc.addStyle(`
      .insignia {
        border-radius: 0.5rem;
        padding: 6px 8px;
        font-size: 0.875rem;
        display: inline-block;
        font-weight: 500;
        line-height: 1.5;
        text-align: center;
        white-space: normal;
        vertical-align: baseline;
      }

      .insignia-voucher {
        display: flex;
        height: 22px;
        padding: 4px 6px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 2px;
        font-size: 14px;
      }
    `);
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            changePage = cl.changePage;
        });
        const language_data = prod.language_data && prod.language_data[Language.getLanguage()];
        ProductInitial.initial(prod);
        function eventName(voucher_type) {
            switch (voucher_type) {
                case 'giveaway':
                    return `贈品活動`;
                case 'add_on_items':
                    return `加價購活動`;
                case 'discount':
                    return `折扣活動`;
                case 'rebate':
                    return `回饋金活動`;
                case 'shipment_free':
                    return `免運費活動`;
            }
        }
        function refreshAll() {
            gvc.notifyDataChange([ids.price, ids.addCartButton, ids.stock_count, ids.qty_count, ids.ids_spec]);
        }
        const solidButtonBgr = (_a = glitter.share.globalValue['theme_color.0.solid-button-bg']) !== null && _a !== void 0 ? _a : '#dddddd';
        const solidButtonText = (_b = glitter.share.globalValue['theme_color.0.solid-button-text']) !== null && _b !== void 0 ? _b : '#000000';
        const aboutVoucherHTML = vm.data && vm.data.content.about_vouchers && vm.data.content.about_vouchers.length > 0
            ? html ` <div class="d-flex flex-column gap-2 mt-3">
            ${vm.data.content.about_vouchers
                .map(v => {
                return html `
                  <div class="d-flex gap-2 align-items-center">
                    <div
                      class="insignia insignia-voucher"
                      style="background:${solidButtonBgr};color:${solidButtonText};font-size:12px;"
                    >
                      ${eventName(v.reBackType)}
                    </div>
                    <div class="fs-sm" style="font-weight: 500;color:${titleFontColor};">${v.title}</div>
                  </div>
                `;
            })
                .join('')}
          </div>`
            : '';
        let viewMap = [
            html ` <div class="w-100">
        <div class="w-100">
          ${obj.preview
                ? PdClass.showSwiper({
                    gvc: gvc,
                    prod: obj.prod,
                    vm: obj.vm,
                })
                : ``}
        </div>
      </div>`,
            html ` <div class="w-100">
        <h1 style="color: ${titleFontColor};font-size:${document.body.clientWidth > 991 ? `28` : `20`}px;">
          ${prod.title}
        </h1>
        <div class="d-flex flex-wrap" style="gap:10px;">
          ${prod.product_tag.language[Language.getLanguage()]
                .map((tag) => {
                return html ` <div
                class="mb-3 rounded-1 text-white d-flex align-items-center justify-content-center px-2 "
                style="background: ${glitter.share.globalValue['theme_color.0.solid-button-bg']};font-size: 12px;"
              >
                ${tag}
              </div>`;
            })
                .join('')}
        </div>
        ${prod.min_qty && `${prod.min_qty}` > `1`
                ? html ` <div
              class="insignia mx-0 w-auto mt-0 mb-3 fw-500  py-2 me-1"
              style="background: #ffe9b2;margin-left:5px;"
            >
              ${Language.text('min_p_count').replace('_c_', `<span class="fw-bold mx-1">${prod.min_qty}</span>`)}
            </div>`
                : ``}
        ${prod.max_qty && `${prod.max_qty}` > `1`
                ? html ` <div class="insignia mx-0 w-auto mt-0 mb-3 fw-500  py-2" style="background: #ffe9b2;margin-left:5px;">
              ${Language.text('max_p_count').replace('_c_', `<span class="fw-bold mx-1">${prod.max_qty}</span>`)}
            </div>`
                : ``}
        ${language_data && language_data.sub_title ? html ` <div class="mb-3">${language_data.sub_title}</div> ` : ``}
        ${gvc.bindView({
                bind: ids.price,
                view: () => {
                    var _a, _b;
                    const v = PdClass.getVariant(prod, vm);
                    if (!v)
                        return '錯誤';
                    const comparePrice = parseInt(`${(_a = v.compare_price) !== null && _a !== void 0 ? _a : 0}`, 10);
                    const originPrice = parseInt(`${(_b = v.origin_price) !== null && _b !== void 0 ? _b : 0}`, 10);
                    const lineThroughPrice = comparePrice > originPrice ? originPrice : comparePrice;
                    return html `
              <div class="d-flex align-items-end" style="font-family: 'Noto Sans'; gap: 8px;">
                <div
                  style="color: ${lineThroughPrice > 0 && lineThroughPrice > v.sale_price
                        ? '#ff5353'
                        : titleFontColor}; font-size: 24px; font-weight: 700; line-height: normal"
                >
                  ${Currency.convertCurrencyText(prod.productType.giveaway ? 0 : v.sale_price)}
                </div>
                ${lineThroughPrice > 0 && lineThroughPrice > v.sale_price
                        ? html `
                      <div style="color: #8D8D8D; font-size: 16px; text-decoration: line-through;">
                        ${Currency.convertCurrencyText(lineThroughPrice)}
                      </div>
                    `
                        : ''}
              </div>
            `;
                },
                divCreate: {
                    style: 'margin-bottom: 12px;',
                },
            })}
        ${gvc.bindView(() => {
                return {
                    bind: ids.ids_spec,
                    view: () => {
                        const invisibleVariants = prod.variants.filter(v => v.invisible).map(v => v.spec);
                        return prod.specs
                            .map((spec, index1) => {
                            return html ` <div>
                      <h5 class="mb-2" style="color: ${titleFontColor};font-size:14px;">
                        ${(spec.language_title && spec.language_title[Language.getLanguage()]) || spec.title}
                      </h5>
                      <div class="d-flex gap-2 flex-wrap">
                        ${gvc.map(spec.option.map((opt) => {
                                const cloneSpecs = vm.specs.slice();
                                cloneSpecs[index1] = opt.title;
                                if (invisibleVariants.find(iv => Tool.ObjCompare(iv, cloneSpecs))) {
                                    return '';
                                }
                                return html ` <div
                              gvc-option="spec-option-${index1}"
                              class="spec-option ${vm.specs[index1] === opt.title ? 'selected-option' : ''}"
                              onclick="${gvc.event(e => {
                                    const allOptions = document.querySelectorAll(`div[gvc-option=spec-option-${index1}]`);
                                    allOptions.forEach((option) => {
                                        option.classList.remove('selected-option');
                                    });
                                    e.classList.toggle('selected-option');
                                    vm.specs[index1] = opt.title;
                                    const v = PdClass.getVariant(prod, vm);
                                    if (v === null || v === void 0 ? void 0 : v.preview_image) {
                                        let index = prod.preview_image.findIndex(src => {
                                            return src == v.preview_image;
                                        });
                                        if (index >= 0) {
                                            vm.swiper.slideTo(index);
                                        }
                                    }
                                    refreshAll();
                                })}"
                            >
                              <span style="font-size: 15px; font-weight: 500; letter-spacing: 1.76px;"
                                >${(opt.language_title && opt.language_title[Language.getLanguage()]) ||
                                    opt.title}</span
                              >
                            </div>`;
                            }))}
                      </div>
                    </div>
                    <div class="mt-3"></div>`;
                        })
                            .join('');
                    },
                    divCreate: {
                        class: `w-100`,
                    },
                };
            })}
        ${[
                gvc.bindView(() => {
                    return {
                        bind: ids.qty_count,
                        view: () => {
                            const variant = PdClass.getVariant(prod, vm);
                            const cartItem = new ApiCart().cart.line_items.find(item => PdClass.ObjCompare(item.spec, vm.specs, true));
                            const quantity = parseInt(vm.quantity, 10);
                            const isOverStock = variant && (variant.stock < quantity || (cartItem && variant.stock < cartItem.count + quantity));
                            const showUnderStocking = `${variant === null || variant === void 0 ? void 0 : variant.show_understocking}` !== 'false';
                            const isPreOrderEnabled = window.store_info.pre_order_status;
                            if (isOverStock && showUnderStocking && !isPreOrderEnabled) {
                                return '';
                            }
                            return html `
                  <h5 class="mb-0" style="color: ${titleFontColor};font-size:14px;">${Language.text('quantity')}</h5>
                  <div class="d-flex align-items-center" style="color:${titleFontColor};">
                    <select
                      class="form-select custom-select me-2"
                      style="border-radius: 5px; color: #575757; width: 100px;height:38px;"
                      onchange="${gvc.event(e => {
                                vm.quantity = e.value;
                                gvc.notifyDataChange([ids.addCartButton, ids.stock_count]);
                            })}"
                    >
                      ${gvc.map([
                                ...new Array((() => {
                                    const variant = PdClass.getVariant(prod, vm);
                                    if (!variant || variant.show_understocking === 'false') {
                                        return 50;
                                    }
                                    if (variant.stock < 1 && isPreOrderEnabled) {
                                        return 20;
                                    }
                                    return variant.stock < 50 ? variant.stock : 50;
                                })()),
                            ].map((item, index) => {
                                return html ` <option value="${index + 1}">${index + 1}</option>`;
                            }))}
                    </select>
                    ${prod.unit[Language.getLanguage()] || Language.text('pieces')}
                  </div>
                `;
                        },
                        divCreate: {
                            class: `flex-column gap-2  ${obj.with_qty === false ? `d-none` : `d-none d-sm-flex`} `,
                        },
                    };
                }),
                gvc.bindView({
                    bind: ids.stock_count,
                    view: () => {
                        const variant = PdClass.getVariant(prod, vm);
                        return this.showCanBuyStock(variant, titleFontColor);
                    },
                }),
                gvc.bindView({
                    bind: ids.addCartButton,
                    view: () => {
                        const variant = PdClass.getVariant(prod, vm);
                        const cartItem = new ApiCart().cart.line_items.find(item => {
                            return PdClass.ObjCompare(item.spec, vm.specs, true);
                        });
                        if (!variant) {
                            return html ` <button class="no-stock w-100" disabled>發生錯誤</button>`;
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
                            content_ids: [variant.sku || prod.id],
                            content_type: 'product',
                            value: variant.sale_price,
                            currency: 'TWD',
                        });
                        const isOutOfStock = variant.stock < parseInt(vm.quantity, 10) && `${variant.show_understocking}` !== 'false';
                        if (!window.store_info.pre_order_status && isOutOfStock) {
                            return html ` <button class="no-stock w-100" disabled>${Language.text('out_of_stock')}</button>`;
                        }
                        if (obj.is_gift) {
                            return html `<button
                  class="add-cart-imd-btn fw-bold"
                  style="width:calc(100% - 10px);cursor: pointer;height:48px;"
                  onclick="${gvc.event(() => {
                                if (obj.only_select) {
                                    obj.only_select({ id: prod.id, specs: vm.specs });
                                }
                                else {
                                    new ApiCart(ApiCart.checkoutCart).addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                    gvc.glitter.recreateView('.js-cart-count');
                                    gvc.glitter.recreateView('.shopping-cart');
                                    PdClass.jumpAlert({
                                        gvc,
                                        text: html `${Language.text('add_to_cart_success')}`,
                                        justify: 'top',
                                        align: 'center',
                                        width: 300,
                                    });
                                    ApiTrack.track({
                                        event_name: 'AddToCart',
                                        custom_data: {
                                            currency: 'TWD',
                                            value: variant.sale_price,
                                            content_ids: [variant.sku || `${prod.id}-${vm.specs.join('-')}`],
                                            content_name: prod.title,
                                            content_type: 'product',
                                        },
                                    });
                                    obj.callback && obj.callback();
                                }
                            })}"
                >
                  ${Language.text('confirm_select')}
                </button>`;
                        }
                        let viewMap = [];
                        if (document.body.clientWidth < 800 && window.store_info.chat_toggle) {
                            viewMap.push(html `<div
                    class="rounded-3 d-flex flex-column align-items-center justify-content-center fs-6 add-cart-btn fw-bold "
                    style="height:44px;width:44px;"
                    onclick="${gvc.event(() => {
                                if (!GlobalUser.token) {
                                    gvc.glitter.href = '/login';
                                }
                                const userID = (() => {
                                    if (GlobalUser.token) {
                                        return GlobalUser.parseJWT(GlobalUser.token).payload.userID;
                                    }
                                    else {
                                        return gvc.glitter.macAddress;
                                    }
                                })();
                                gvc.glitter.getModule(new URL('./cms-plugin/customer-message-user.js', gvc.glitter.root_path).href, cl => {
                                    cl.mobileChat({
                                        gvc: gvc,
                                        chat: {
                                            chat_id: [`${userID}`, 'manager'].sort().join('-'),
                                            type: 'user',
                                        },
                                        user_id: `${userID}`,
                                    });
                                });
                            })}"
                  >
                    <i class="fa-brands fa-rocketchat"></i>
                    <div style="font-size:10px;">${Language.text('chat')}</div>
                  </div>`);
                        }
                        viewMap.push(html `<div
                  class="rounded-3 d-flex flex-column align-items-center justify-content-center fs-6 add-cart-btn fw-bold "
                  style="height:44px;width:44px;cursor: pointer;"
                  onclick="${gvc.event(() => {
                            navigator.clipboard.writeText(`${window.location.href}`);
                            dialog.successMessage({ text: Language.text('copy_link_success') });
                        })}"
                >
                  <i class="fa-solid fa-share"></i>
                  <div style="font-size:10px;">${Language.text('share')}</div>
                </div>`);
                        if (window.store_info.wishlist) {
                            viewMap.push(gvc.bindView(() => {
                                return {
                                    bind: ids.wishStatus,
                                    view: () => {
                                        return html `${vm.wishStatus
                                            ? html `<i class="fa-solid fa-heart" style="color:white;"></i>`
                                            : html `<i class="fa-regular fa-heart"></i>`}
                          <div style="font-size:10px; ${vm.wishStatus ? `color:white;` : ``}">
                            ${vm.wishStatus ? Language.text('h_collect') : Language.text('collect')}
                          </div>`;
                                    },
                                    divCreate: () => {
                                        return {
                                            option: [
                                                {
                                                    key: 'onclick',
                                                    value: gvc.event(() => {
                                                        if (CheckInput.isEmpty(GlobalUser.token)) {
                                                            changePage('login', 'page', {});
                                                            GlobalUser.loginRedirect = location.href;
                                                            return;
                                                        }
                                                        dialog.dataLoading({ visible: true });
                                                        ApiShop.getWishList().then(getRes => {
                                                            if (getRes.result && getRes.response.data) {
                                                                if (getRes.response.data.find((item) => `${item.id}` === `${prod.id}`)) {
                                                                    ApiShop.deleteWishList(`${prod.id}`).then(() => __awaiter(this, void 0, void 0, function* () {
                                                                        PdClass.jumpAlert({
                                                                            gvc,
                                                                            text: '刪除成功',
                                                                            justify: 'top',
                                                                            align: 'center',
                                                                        });
                                                                        vm.wishStatus = false;
                                                                        gvc.notifyDataChange(ids.wishStatus);
                                                                        dialog.dataLoading({ visible: false });
                                                                    }));
                                                                }
                                                                else {
                                                                    const variant = PdClass.getVariant(prod, vm);
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
                                                                        dialog.dataLoading({ visible: false });
                                                                    }));
                                                                }
                                                            }
                                                        });
                                                    }),
                                                },
                                            ],
                                            class: `rounded-3 d-flex flex-column align-items-center justify-content-center fs-6 add-cart-btn fw-bold`,
                                            style: `height:44px;width:44px;cursor:pointer; ${vm.wishStatus ? `background: #ff5353;border:1px solid white;` : ``}`,
                                        };
                                    },
                                };
                            }));
                        }
                        viewMap.push(html `<button
                  class="${PdClass.isShoppingPage() ? `add-cart-imd-btn` : `add-cart-btn`} fw-bold fs-sm"
                  style="flex: 1;height:44px;"
                  onclick="${gvc.event(() => {
                            if (document.body.clientWidth < 800) {
                                this.addProductPopUp(obj, 'addCart', () => refreshAll());
                                return;
                            }
                            if (obj.only_select) {
                                obj.only_select({ id: prod.id, specs: vm.specs });
                            }
                            else {
                                new ApiCart().addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                gvc.glitter.recreateView('.js-cart-count');
                                gvc.glitter.recreateView('.shopping-cart');
                                PdClass.jumpAlert({
                                    gvc,
                                    text: html `${Language.text('add_to_cart_success')}`,
                                    justify: 'top',
                                    align: 'center',
                                    width: 300,
                                });
                                ApiTrack.track({
                                    event_name: 'AddToCart',
                                    custom_data: {
                                        currency: 'TWD',
                                        value: variant.sale_price,
                                        content_ids: [variant.sku || `${prod.id}-${vm.specs.join('-')}`],
                                        content_name: prod.title,
                                        content_type: 'product',
                                    },
                                });
                                obj.callback && obj.callback();
                            }
                        })}"
                >
                  ${isOutOfStock ? Language.text('preorder_item') : Language.text('add_to_cart')}
                </button>`);
                        if (!PdClass.isShoppingPage()) {
                            viewMap.push(html `<button
                    class="add-cart-imd-btn fw-bold fs-sm"
                    style="cursor: pointer; flex: 1;height:44px;"
                    onclick="${gvc.event(() => {
                                if (document.body.clientWidth < 800) {
                                    this.addProductPopUp(obj, 'buyNow', () => {
                                        refreshAll();
                                    });
                                    return;
                                }
                                const buy_it = new ApiCart(ApiCart.buyItNow);
                                buy_it.clearCart();
                                buy_it.addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                ApiCart.toCheckOutPage(ApiCart.buyItNow);
                                gvc.closeDialog();
                                ApiTrack.track({
                                    event_name: 'AddToCart',
                                    custom_data: {
                                        currency: 'TWD',
                                        value: variant.sale_price,
                                        content_ids: [variant.sku || `${prod.id}-${vm.specs.join('-')}`],
                                        content_name: prod.title,
                                        content_type: 'product',
                                    },
                                });
                            })}"
                  >
                    ${Language.text('buy_it_now')}
                  </button>`);
                        }
                        return viewMap.join('');
                    },
                    divCreate: {
                        style: `${document.body.clientWidth > 800 ? `width:100%;height: 38px;` : `width:100%;z-index:10;`}gap:6px;`,
                        class: `d-flex ${document.body.clientWidth < 800 ? `position-fixed bottom-0 start-0 px-2 py-2 pb-4 bg-white shadow border-top` : `mt-3`}`,
                    },
                }),
                aboutVoucherHTML
                    ? html ` <div
                  class="w-100 border-top"
                  style="margin-top:${this.isPhone() ? 10 : 20}px;margin-bottom:${this.isPhone() ? 10 : 10}px;"
                ></div>
                <div class="w-100">
                  <h1 style="color: ${titleFontColor};font-size:16px;">本商品適用活動</h1>
                  ${aboutVoucherHTML}
                </div>`
                    : ``,
            ].join('')}
      </div>`,
        ];
        return html `
      <div class="d-flex flex-column flex-lg-row w-100" style="gap:${this.isPhone() ? 20 : 40}px">
        ${viewMap.join(``)}
      </div>
    `;
    }
    static addProductPopUp(obj, type, close_event) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const titleFontColor = obj.titleFontColor;
        const prod = obj.prod;
        const vm = obj.vm;
        const ids = {
            price: glitter.getUUID(),
            wishStatus: glitter.getUUID(),
            addCartButton: glitter.getUUID(),
            stock_count: glitter.getUUID(),
            qty_count: glitter.getUUID(),
        };
        obj.gvc.addStyle(`
      .insignia {
        border-radius: 0.5rem;
        padding: 6px 8px;
        font-size: 0.875rem;
        display: inline-block;
        font-weight: 500;
        line-height: 1.5;
        text-align: center;
        white-space: normal;
        vertical-align: baseline;
      }

      .insignia-voucher {
        display: flex;
        height: 22px;
        padding: 4px 6px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 2px;
        font-size: 14px;
      }
    `);
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            changePage = cl.changePage;
        });
        obj.gvc.glitter.innerDialog((gvc) => {
            const variant = PdClass.getVariant(prod, vm);
            return html `
          <div
            class="w-100 h-100 position-absolute bottom-0 left-0"
            onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}"
          ></div>
          <div
            class="rounded-top bg-white w-100 position-absolute bottom-0 left-0 px-3 pt-3"
            style="padding-bottom:100px;max-height:calc(100vh - 100px);overflow-y:auto;"
          >
            <div class="d-flex align-items-center mb-3 " style="margin-top:20px;gap:10px;">
              <div
                style="width: 88px;height: 88px;border-radius: 10px;background: 50%/cover url('${(variant === null || variant === void 0 ? void 0 : variant.preview_image) ===
                'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'
                ? prod.preview_image[0]
                : variant === null || variant === void 0 ? void 0 : variant.preview_image}');"
              ></div>
              <div class="d-flex flex-column" style="gap:5px;">
                <div class="fw-bold" style="color: ${titleFontColor};font-size:14px;">${prod.title}</div>
                ${gvc.bindView({
                bind: ids.price,
                view: () => {
                    var _a, _b;
                    const v = PdClass.getVariant(prod, vm);
                    if (!v)
                        return '錯誤';
                    const comparePrice = parseInt(`${(_a = v.compare_price) !== null && _a !== void 0 ? _a : 0}`, 10);
                    const originPrice = parseInt(`${(_b = v.origin_price) !== null && _b !== void 0 ? _b : 0}`, 10);
                    const lineThroughPrice = comparePrice > originPrice ? originPrice : comparePrice;
                    return html `
                      <div class="d-flex align-items-end" style=" gap: 8px;">
                        <div
                          style="color: ${lineThroughPrice > 0 && lineThroughPrice > v.sale_price
                        ? '#ff5353'
                        : titleFontColor}; font-size: 16px; font-weight: 700; "
                        >
                          ${Currency.convertCurrencyText(v.sale_price)}
                        </div>
                        ${lineThroughPrice > 0 && lineThroughPrice > v.sale_price
                        ? html `
                              <div style="color: #8D8D8D; font-size: 14px; text-decoration: line-through;">
                                ${Currency.convertCurrencyText(lineThroughPrice)}
                              </div>
                            `
                        : ''}
                      </div>
                    `;
                },
            })}
              </div>
            </div>
            ${[
                prod.specs
                    .map((spec, index1) => {
                    return html ` <div>
                      <h5 class="mb-2" style="color: ${titleFontColor};font-size:14px;">
                        ${(spec.language_title && spec.language_title[Language.getLanguage()]) || spec.title}
                      </h5>
                      <div class="d-flex gap-2 flex-wrap">
                        ${gvc.map(spec.option.map((opt) => {
                        return html ` <div
                              gvc-option="spec-option-${index1}"
                              class="spec-option ${vm.specs[index1] === opt.title ? 'selected-option' : ''}"
                              onclick="${gvc.event(e => {
                            const allOptions = document.querySelectorAll(`div[gvc-option=spec-option-${index1}]`);
                            allOptions.forEach((option) => {
                                option.classList.remove('selected-option');
                            });
                            e.classList.toggle('selected-option');
                            vm.specs[index1] = opt.title;
                            const v = PdClass.getVariant(prod, vm);
                            if (v === null || v === void 0 ? void 0 : v.preview_image) {
                                let index = prod.preview_image.findIndex(src => {
                                    return src == v.preview_image;
                                });
                                if (index >= 0) {
                                    vm.swiper.slideTo(index);
                                }
                            }
                            gvc.recreateView();
                        })}"
                            >
                              <span style="font-size: 15px; font-weight: 500; letter-spacing: 1.76px;"
                                >${(opt.language_title && opt.language_title[Language.getLanguage()]) ||
                            opt.title}</span
                              >
                            </div>`;
                    }))}
                      </div>
                    </div>
                    <div class="mt-3"></div>`;
                })
                    .join(''),
                gvc.bindView({
                    bind: ids.stock_count,
                    view: () => {
                        const variant = PdClass.getVariant(prod, vm);
                        return this.showCanBuyStock(variant, titleFontColor);
                    },
                }),
                gvc.bindView({
                    bind: ids.addCartButton,
                    view: () => {
                        const variant = PdClass.getVariant(prod, vm);
                        const cartItem = new ApiCart().cart.line_items.find(item => PdClass.ObjCompare(item.spec, vm.specs, true));
                        const quantity = parseInt(vm.quantity, 10);
                        const isOverStock = variant && (variant.stock < quantity || (cartItem && variant.stock < cartItem.count + quantity));
                        const showUnderStocking = `${variant === null || variant === void 0 ? void 0 : variant.show_understocking}` !== 'false';
                        const isPreOrderEnabled = window.store_info.pre_order_status;
                        if (!variant) {
                            return html ` <button class="no-stock w-100" disabled>發生錯誤</button>`;
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
                            content_ids: [variant.sku || prod.id],
                            content_type: 'product',
                            value: variant.sale_price,
                            currency: 'TWD',
                        });
                        if (obj.is_gift) {
                            return html `<button
                      class="add-cart-imd-btn fw-bold h-100"
                      style="width:calc(100% - 10px);cursor: pointer;"
                      onclick="${gvc.event(() => {
                                if (obj.only_select) {
                                    obj.only_select({ id: prod.id, specs: vm.specs });
                                }
                                else {
                                    new ApiCart(ApiCart.checkoutCart).addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                    gvc.glitter.recreateView('.js-cart-count');
                                    gvc.glitter.recreateView('.shopping-cart');
                                    PdClass.jumpAlert({
                                        gvc,
                                        text: html `${Language.text('add_to_cart_success')}`,
                                        justify: 'top',
                                        align: 'center',
                                        width: 300,
                                    });
                                    ApiTrack.track({
                                        event_name: 'AddToCart',
                                        custom_data: {
                                            currency: 'TWD',
                                            value: variant.sale_price,
                                            content_ids: [variant.sku || `${prod.id}-${vm.specs.join('-')}`],
                                            content_name: prod.title,
                                            content_type: 'product',
                                        },
                                    });
                                    obj.callback && obj.callback();
                                }
                            })}"
                    >
                      ${Language.text('confirm_select')}
                    </button>`;
                        }
                        let viewMap = [];
                        viewMap.push(gvc.bindView(() => {
                            return {
                                bind: ids.qty_count,
                                view: () => {
                                    vm.quantity = vm.quantity || '1';
                                    const supportMinus = parseInt(vm.quantity, 10) > 1;
                                    function getSupportAdd() {
                                        return (!(variant.stock < parseInt(vm.quantity, 10) + 1 &&
                                            `${variant.show_understocking}` !== 'false') || isPreOrderEnabled);
                                    }
                                    function hasStock() {
                                        return (!((variant.stock < parseInt(vm.quantity, 10) || variant.stock < 1) &&
                                            `${variant.show_understocking}` !== 'false') || isPreOrderEnabled);
                                    }
                                    let supportAdds = getSupportAdd();
                                    if (!hasStock()) {
                                        vm.quantity = `${variant.stock}`;
                                    }
                                    if (!hasStock() && isOverStock && showUnderStocking && !isPreOrderEnabled) {
                                        return ``;
                                    }
                                    return html `
                            <div class="d-flex align-items-center" style="color:${titleFontColor};">
                              <div
                                class="d-flex align-items-center justify-content-center"
                                style="width:44px;height: 44px;cursor: pointer;"
                                onclick="${gvc.event(() => {
                                        if (supportMinus) {
                                            vm.quantity = `${parseInt(vm.quantity, 10) - 1}`;
                                            gvc.recreateView();
                                        }
                                    })}"
                              >
                                <i class="fa-solid fa-minus" style="color:${supportMinus ? `#ff5353` : `#999`};"></i>
                              </div>
                              <select
                                class="form-select custom-select mx-0 p-0 "
                                style="border-radius: 5px; color: #575757; width: 100px;height:38px;background-image:none;${parseInt(vm.quantity, 10) < 10
                                        ? `text-indent: 43%;`
                                        : `text-indent: 40%;`}"
                                onchange="${gvc.event(e => {
                                        vm.quantity = e.value;
                                        gvc.notifyDataChange([ids.addCartButton, ids.stock_count]);
                                    })}"
                              >
                                ${gvc.map([
                                        ...new Array((() => {
                                            const variant = PdClass.getVariant(prod, vm);
                                            if (!variant || variant.show_understocking === 'false') {
                                                return 50;
                                            }
                                            if (variant.stock < 1 && isPreOrderEnabled) {
                                                return 20;
                                            }
                                            return variant.stock < 50 ? variant.stock : 50;
                                        })()),
                                    ].map((item, index) => {
                                        return html ` <option
                                      value="${index + 1}"
                                      ${`${vm.quantity}` === `${index + 1}` ? `selected` : ``}
                                    >
                                      ${index + 1}
                                    </option>`;
                                    }))}
                              </select>
                              <div
                                class="d-flex align-items-center justify-content-center"
                                style="width:44px;height: 44px;cursor: pointer;"
                                onclick="${gvc.event(() => {
                                        if (supportAdds) {
                                            vm.quantity = `${parseInt(vm.quantity, 10) + 1}`;
                                            gvc.recreateView();
                                        }
                                    })}"
                              >
                                <i class="fa-solid fa-plus" style="color:${supportAdds ? `#ff5353` : `#999`};"></i>
                              </div>
                            </div>
                          `;
                                },
                                divCreate: {
                                    class: `flex-column gap-2 d-flex `,
                                },
                            };
                        }));
                        const isOutOfStock = variant.stock < parseInt(vm.quantity, 10) && `${variant.show_understocking}` !== 'false';
                        if (!window.store_info.pre_order_status && isOutOfStock) {
                            viewMap.push(html ` <button class="no-stock w-100 " style="height:44px;" disabled>
                        ${Language.text('out_of_stock')}
                      </button>`);
                        }
                        else if (type === 'addCart') {
                            viewMap.push(html `<button
                        class="add-cart-imd-btn fw-bold fs-sm"
                        style=" flex: 1;height:44px;"
                        onclick="${gvc.event(() => {
                                if (obj.only_select) {
                                    obj.only_select({ id: prod.id, specs: vm.specs });
                                }
                                else {
                                    new ApiCart().addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                    gvc.glitter.recreateView('.js-cart-count');
                                    gvc.glitter.recreateView('.shopping-cart');
                                    PdClass.jumpAlert({
                                        gvc,
                                        text: html `${Language.text('add_to_cart_success')}`,
                                        justify: 'top',
                                        align: 'center',
                                        width: 300,
                                    });
                                    ApiTrack.track({
                                        event_name: 'AddToCart',
                                        custom_data: {
                                            currency: 'TWD',
                                            value: variant.sale_price,
                                            content_ids: [variant.sku || `${prod.id}-${vm.specs.join('-')}`],
                                            content_name: prod.title,
                                            content_type: 'product',
                                        },
                                    });
                                    obj.callback && obj.callback();
                                }
                                gvc.closeDialog();
                            })}"
                      >
                        ${isOutOfStock ? Language.text('preorder_item') : Language.text('add_to_cart')}
                      </button>`);
                        }
                        else if (type === 'buyNow') {
                            viewMap.push(html `<button
                        class="add-cart-imd-btn fw-bold fs-sm"
                        style="cursor: pointer; flex: 1;height:44px;"
                        onclick="${gvc.event(() => {
                                const buy_it = new ApiCart(ApiCart.buyItNow);
                                buy_it.clearCart();
                                buy_it.addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                gvc.glitter.closeDiaLog();
                                setTimeout(() => {
                                    ApiCart.toCheckOutPage(ApiCart.buyItNow);
                                }, 100);
                                ApiTrack.track({
                                    event_name: 'AddToCart',
                                    custom_data: {
                                        currency: 'TWD',
                                        value: variant.sale_price,
                                        content_ids: [variant.sku || `${prod.id}-${vm.specs.join('-')}`],
                                        content_name: prod.title,
                                        content_type: 'product',
                                    },
                                });
                            })}"
                      >
                        ${Language.text('buy_it_now')}
                      </button>`);
                        }
                        return viewMap.join('');
                    },
                    divCreate: {
                        style: `${document.body.clientWidth > 800 ? `width:100%;height: 38px;` : `width:100%;z-index:10;`}gap:6px;`,
                        class: `d-flex ${document.body.clientWidth < 800 ? `position-fixed bottom-0 start-0 px-2 py-2 pb-4 bg-white shadow border-top` : `mt-3`}  align-items-center`,
                    },
                }),
            ].join('')}
            <div
              class="position-absolute d-flex align-items-center justify-content-center "
              style="top:10px;right:10px;width:30px;height:30px;"
              onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}"
            >
              <i class="fa-solid fa-xmark text-black fs-5"></i>
            </div>
          </div>
        `;
        }, 'addProductPopUp', {
            animation: Animation.popup,
            dismiss: () => {
                close_event();
            },
        });
    }
    static getSpecPriceRange(variants) {
        const specPriceMap = new Map();
        let minVariant = null;
        let maxVariant = null;
        for (const variant of variants) {
            const { sale_price, origin_price, invisible } = variant;
            specPriceMap.set(sale_price, { sale_price, origin_price });
            if (invisible) {
                continue;
            }
            if (!minVariant || sale_price < minVariant.sale_price) {
                minVariant = { sale_price, origin_price };
            }
            if (!maxVariant || sale_price > maxVariant.sale_price) {
                maxVariant = { sale_price, origin_price };
            }
        }
        return { minVariant, maxVariant };
    }
    static priceViewer(minVariant, maxVariant) {
        const { interval_price_card: isInterval, independent_special_price: isIndependent } = window.store_info;
        const isLower = minVariant.sale_price < minVariant.origin_price;
        const formatPrice = (price) => Currency.convertCurrencyText(price).toLocaleString();
        const formatPriceRange = (minPrice, maxPrice) => {
            const min = formatPrice(minPrice);
            const max = formatPrice(maxPrice);
            return isInterval && minPrice < maxPrice ? `${min} ~ ${max}` : min;
        };
        const basePrice = html `
      <div class="fs-6 fw-500 card-sale-price" style="color: ${isIndependent && isLower ? '#DA1313' : '#393939'}">
        ${formatPriceRange(minVariant.sale_price, maxVariant.sale_price)}
      </div>
    `;
        const lineThroughPrice = !isIndependent && isLower
            ? html `<div class="text-decoration-line-through card-cost-price">
            ${formatPriceRange(minVariant.origin_price, maxVariant.origin_price)}
          </div>`
            : '';
        return basePrice + lineThroughPrice;
    }
    static isPhone() {
        return document.body.clientWidth < 768;
    }
    static isPad() {
        return document.body.clientWidth >= 768 && document.body.clientWidth <= 960;
    }
    static menuVisibleVerify(userData, linkData) {
        var _a;
        const { visible_type, visible_data_array = [] } = linkData;
        if (!visible_type || visible_type === 'all')
            return true;
        if (!userData.result)
            return false;
        const user = userData.response;
        if (linkData.visible_type === 'user') {
            const user_id = user.userID;
            return visible_data_array.includes(user_id);
        }
        if (linkData.visible_type === 'level') {
            const user_level = (_a = user.member.find((d) => d.trigger)) === null || _a === void 0 ? void 0 : _a.id;
            return visible_data_array.includes(user_level || 'default');
        }
        return true;
    }
}
