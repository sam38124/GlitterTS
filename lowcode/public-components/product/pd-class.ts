import { GVC } from '../../glitterBundle/GVController.js';
import { Tool } from '../../modules/tool.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Ad } from '../public/ad.js';
import { Language } from '../../glitter-base/global/language.js';
import { Currency } from '../../glitter-base/global/currency.js';
import { Product, ProductInitial } from '../../public-models/product.js';
import { VoucherContent } from '../user-manager/um-voucher.js';

const html = String.raw;
const css = String.raw;

export type Seo = {
    title: string;
    domain: string;
    content: string;
    keywords: string;
};

export type SpecOption = {
    title: string;
    expand?: boolean;
    language_title: {
        'en-US': string;
        'zh-CN': string;
        'zh-TW': string;
    };
};

export type Spec = {
    title: string;
    option: SpecOption[];
    language_title: {
        'en-US': string;
        'zh-CN': string;
        'zh-TW': string;
    };
};

export type Token = {
    exp: number;
    iat: number;
    userID: number;
    account: string;
    userData: Record<string, unknown>;
};

export type Variant = {
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
};

export type ContentJsonList = {
    key: string;
    value: string;
};

export type ContentJson = {
    id: string;
    list: ContentJsonList[];
};

export type ProductType = {
    product: boolean;
    giveaway: boolean;
    addProduct: boolean;
};

export type Product_l = {
    id: number;
    userID: number;
    content: Product;
    created_time: string;
    updated_time: string;
    status: number;
    total_sales?: number;
};

export type ContentTag = {
    key: string;
    title: string;
    font_bgr: string;
    font_size: string;
    font_color: string;
};

export type ContentData = {
    tags: ContentTag[];
    content: string;
};

export type FileItem = {
    id: string;
    data: ContentData;
    type: string;
    title: string;
    status: boolean;
    updated_time: string;
};

export type FileList = FileItem[];

export class PdClass {
    static jumpAlert(obj: { gvc: GVC; text: string; justify: 'top' | 'bottom'; align: 'left' | 'center' | 'right'; timeout?: number; width?: number }) {
        const className = 'pd-class';

        const fixedStyle = (() => {
            const styles = [];

            // 處理垂直對齊
            if (obj.justify === 'top') {
                styles.push('top: 90px;');
            } else if (obj.justify === 'bottom') {
                styles.push('bottom: 24px;');
            }

            // 處理水平對齊
            if (obj.align === 'left') {
                styles.push('left: 12px;');
            } else if (obj.align === 'center') {
                styles.push('left: 50%; right: 50%;');
            } else if (obj.align === 'right') {
                styles.push('right: 12px;');
            }

            return styles.join(' '); // 將樣式數組轉換為字串
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
                width: ${obj.width ?? 120}px;
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

        const htmlString = html` <div class="bounce-effect-${className}">${obj.text}</div>`;
        obj.gvc.glitter.document.body.insertAdjacentHTML('beforeend', htmlString);
        setTimeout(() => {
            const element = document.querySelector(`.bounce-effect-${className}`) as HTMLElement;
            if (element) {
                element.remove();
            }
        }, obj.timeout ?? 2000);
    }

    static ObjCompare(obj1: { [k: string]: any }, obj2: { [k: string]: any }, sort?: boolean) {
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

    static lightenColor(color: string, percent: number) {
        var num = parseInt(color.slice(1), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = ((num >> 8) & 0x00ff) + amt,
            B = (num & 0x0000ff) + amt;

        return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
    }

    static addSpecStyle(gvc: GVC) {
        const glitter = gvc.glitter;
        const titleFontColor = glitter.share.globalValue['theme_color.0.title'] ?? '#333333';
        const borderButtonBgr = glitter.share.globalValue['theme_color.0.border-button-bg'] ?? '#fff';
        const borderButtonText = glitter.share.globalValue['theme_color.0.border-button-text'] ?? '#333333';
        const solidButtonBgr = glitter.share.globalValue['theme_color.0.solid-button-bg'] ?? '#dddddd';
        const solidButtonText = glitter.share.globalValue['theme_color.0.solid-button-text'] ?? '#000000';
        gvc.glitter.addStyle(css`
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

    static addCartAction(obj: { gvc: GVC; titleFontColor: any; prod: any; vm: any }) {
        obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html` <div class="bg-white shadow rounded-3" style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: 1000px;` : 'width:calc(100vw - 20px);'}">
                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                    <div class="w-100 d-flex align-items-center p-3 border-bottom" style="position: sticky; top: 0; background: #fff;z-index:12;">
                        <div class="fw-bold fs-5" style="color:${obj.titleFontColor}; white-space: nowrap;text-overflow: ellipsis;max-width: calc(100% - 40px); overflow: hidden;">
                            ${obj.prod.title}
                        </div>
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
                            <div class="c_dialog_main" style="gap: 24px;  max-height: calc(100vh - 100px); ${document.body.clientWidth < 800 ? `padding: 12px 20px;` : `padding: 30px;`}">
                                ${PdClass.selectSpec({
                                    gvc,
                                    titleFontColor: obj.titleFontColor,
                                    prod: obj.prod,
                                    vm: obj.vm,
                                    preview: true,
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }, Tool.randomString(7));
    }

    static showSwiper(obj: { gvc: GVC; prod: Product; vm: any }) {
        const isPhone = document.body.clientWidth < 768;
        obj.gvc.glitter.addStyleLink(['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css']);
        obj.gvc.glitter.addMtScript(
            [
                {
                    src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`,
                },
                {
                    src: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`,
                },
            ],
            () => {},
            () => {}
        );

        obj.prod.variants.forEach((variant) => {
            variant.preview_image = (variant as any)[`preview_image_${Language.getLanguage()}`] || variant.preview_image;
            if (variant.preview_image && !obj.prod.preview_image.includes(variant.preview_image)) {
                obj.prod.preview_image.push(variant.preview_image);
            }
        });
        PdClass.addSpecStyle(obj.gvc);
        obj.gvc.glitter.addStyle(css`
            .swiper {
                width: 100%;
                height: 100%;
            }

            .swiper-slide {
                text-align: center;
                font-size: 18px;
                background: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .swiper-slide img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .swiper {
                width: 100%;
                height: 300px;
                margin-left: auto;
                margin-right: auto;
            }

            .swiper-slide {
                background-size: cover;
                background-position: center;
            }

            .mySwiper2 {
                height: 80%;
                width: 100%;
            }

            .mySwiper {
                height: 20%;
                box-sizing: border-box;
                padding: 10px 0;
            }

            .mySwiper .swiper-slide {
                width: 25%;
                height: 100%;
                opacity: 0.4;
            }

            .mySwiper .swiper-slide-thumb-active {
                opacity: 1;
            }

            .swiper-slide img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        `);

        // 更新規格
        if (obj.vm.specs.length === 0) {
            obj.vm.specs = obj.vm.specs.map((spec: any) => spec.option[0].title);
        }

        // 過濾預覽圖片
        obj.prod.preview_image = obj.prod.preview_image.filter((image) => {
            return image !== 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
        });

        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html`
                        <div class="swiper${id}" id="dynamic-swiper${id}" style="width: 500px;position:relative;overflow: hidden;max-width: 100%;">
                            <div class="swiper-wrapper">
                                ${obj.prod.preview_image
                                    .map((image, index) => {
                                        return html` <div class="swiper-slide swiper-slide-def">
                                            <img src="${image}" alt="${obj.prod.title}-${index}" />
                                        </div>`;
                                    })
                                    .join('')}
                            </div>
                            <div class="swiper-button-prev"></div>
                            <div class="swiper-button-next"></div>
                        </div>
                        ${obj.prod.preview_image.length > 1
                            ? html` <div class="swiper-sm${id} mt-2" style="height: ${isPhone ? 75 : 100}px; overflow: hidden;">
                                  <div class="swiper-wrapper">
                                      ${obj.prod.preview_image
                                          .map((image, index) => {
                                              return html` <div class="swiper-slide swiper-slide-sm" data-image-index="${index}">
                                                  <img src="${image}" alt="${obj.prod.title}-${index}-sm" style="height: ${isPhone ? 75 : 100}px;width: auto !important;" />
                                              </div>`;
                                          })
                                          .join('')}
                                  </div>
                              </div>`
                            : ``}
                    `;
                },
                divCreate: {
                    class: ``,
                    option: [{ key: 'id', value: id }],
                    style: `overflow:hidden;position:relative;${document.body.clientWidth > 800 ? `width:500px;` : `width:100%:`}`,
                },
                onCreate: () => {
                    const si = setInterval(() => {
                        const Swiper = (window as any).Swiper;
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
                            } else {
                                obj.vm.swiper = new Swiper(`.swiper${id}`, {
                                    loop: true,
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    },
                                });
                            }

                            const prod = obj.prod;
                            const v = prod.variants.find((variant) => {
                                return PdClass.ObjCompare(
                                    variant.spec,
                                    prod.specs.map((spec) => {
                                        return spec.option[0].title;
                                    }),
                                    true
                                );
                            });
                            if (v?.preview_image) {
                                let index = prod.preview_image.findIndex((variant) => {
                                    return variant == v.preview_image;
                                });
                                if (index && obj.vm.swiper) {
                                    // (obj.vm.swiper as any).slideTo(index);
                                }
                            }
                            clearInterval(si);
                        }
                    }, 200);

                    // function updateSwiperHeight() {
                    //     const size = setTimeout(() => {
                    //         const container = document.getElementById(id);
                    //         const swiper = document.getElementById('dynamic-swiper' + id);
                    //         if (swiper && container) {
                    //             const rem = document.body.clientWidth > 768 ? '2rem' : '0rem';
                    //             // swiper.style.height = `calc(${container.clientWidth}px - ${rem})`;
                    //             clearInterval(size);
                    //         }
                    //     }, 200);
                    // }

                    // updateSwiperHeight();
                    // window.addEventListener('resize', updateSwiperHeight);
                },
            };
        });
    }

    static changePage(prod: any, gvc: GVC) {
        const glitter = gvc.glitter;
        let path = '';
        if (!(prod.seo && prod.seo.domain)) {
            glitter.setUrlParameter('product_id', prod.id);
            path = 'products';
        } else {
            glitter.setUrlParameter('product_id', undefined);
            if (prod.language_data && prod.language_data[Language.getLanguage()].seo) {
                path = `products/${prod.language_data[Language.getLanguage()].seo.domain}`;
            } else {
                path = `products/${prod.seo.domain}`;
            }
        }
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            cl.changePage(path, 'page', {});
        });
    }

    static selectSpec(obj: {
        gvc: GVC;
        titleFontColor: string;
        prod: Product;
        vm: {
            data?: Product_l;
            specs: string[];
            quantity: string;
            wishStatus: boolean;
            swiper?: any;
        };
        with_qty?: boolean;
        callback?: () => void;
        preview?: boolean;
        only_select?: (data: any) => void;
    }) {
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

            .insignia-gray {
                background: #dddddd;
                color: #393939;
            }
        `);
        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });
        const language_data = (prod as any).language_data && (prod as any).language_data[Language.getLanguage()];
        ProductInitial.initial(prod);

        function eventName(voucher_type: string) {
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

        const aboutVoucherHTML =
            vm.data && vm.data.content.about_vouchers && vm.data.content.about_vouchers.length > 0
                ? html`<div class="d-flex flex-column gap-1 mt-3">
                      ${vm.data.content.about_vouchers
                          .map((v) => {
                              return html`
                                  <div class="d-flex gap-2 align-items-center">
                                      <div class="insignia insignia-gray">${eventName(v.reBackType)}</div>
                                      <div style="font-size: 12px; font-weight: 500;">${v.title}</div>
                                  </div>
                              `;
                          })
                          .join('')}
                  </div>`
                : '';
        return html`
            <div class="d-flex flex-column flex-lg-row w-100" style="gap:${this.isPhone() ? 20 : 40}px;">
                <div class="w-100">
                    <div class="w-100">
                        ${obj.preview
                            ? PdClass.showSwiper({
                                  gvc: gvc,
                                  prod: obj.prod,
                                  vm: obj.vm,
                              })
                            : ``}
                    </div>
                    <div class="w-100">${aboutVoucherHTML}</div>
                </div>
                <div class="w-100">
                    <h1 style="color: ${titleFontColor};font-size:${document.body.clientWidth > 991 ? `36` : `24`}px;">${prod.title}</h1>
                    <div class="d-flex flex-wrap" style="gap:10px;">
                        ${(prod.product_tag as any).language[Language.getLanguage()]
                            .map((tag: any) => {
                                return html`<div
                                    class="mb-3 rounded-1 text-white d-flex align-items-center justify-content-center px-2 "
                                    style="background: ${glitter.share.globalValue['theme_color.0.solid-button-bg']};font-size: 13px;"
                                >
                                    ${tag}
                                </div>`;
                            })
                            .join('')}
                    </div>
                    ${prod.min_qty && `${prod.min_qty}` > `1`
                        ? html` <div class="insignia mx-0 w-auto mt-0 mb-3 fw-500  py-2 me-1" style="background: #ffe9b2;margin-left:5px;">
                              ${Language.text('min_p_count').replace('_c_', `<span class="fw-bold mx-1">${prod.min_qty}</span>`)}
                          </div>`
                        : ``}
                    ${prod.max_qty && `${prod.max_qty}` > `1`
                        ? html` <div class="insignia mx-0 w-auto mt-0 mb-3 fw-500  py-2" style="background: #ffe9b2;margin-left:5px;">
                              ${Language.text('max_p_count').replace('_c_', `<span class="fw-bold mx-1">${prod.max_qty}</span>`)}
                          </div>`
                        : ``}
                    ${language_data && language_data.sub_title ? html` <div class="mb-3">${language_data.sub_title}</div> ` : ``}
                    <h2 style="color: ${titleFontColor};font-size: 24px;">
                        ${gvc.bindView({
                            bind: ids.price,
                            view: () => {
                                const v = prod.variants.find((variant) => {
                                    return PdClass.ObjCompare(variant.spec, vm.specs, true);
                                });
                                return v ? Currency.convertCurrencyText(v.sale_price) : '錯誤';
                            },
                        })}
                    </h2>
                    ${gvc.map(
                        prod.specs.map((spec, index1) => {
                            return html` <div>
                                    <h5 class="mb-2" style="color: ${titleFontColor};font-size:14px;">
                                        ${(spec.language_title && (spec.language_title as any)[Language.getLanguage()]) || spec.title}
                                    </h5>
                                    <div class="d-flex gap-2 flex-wrap">
                                        ${gvc.map(
                                            spec.option.map((opt: any) => {
                                                return html` <div
                                                    gvc-option="spec-option-${index1}"
                                                    class="spec-option ${vm.specs[index1] === opt.title ? 'selected-option' : ''}"
                                                    onclick="${gvc.event((e) => {
                                                        const allOptions = document.querySelectorAll(`div[gvc-option=spec-option-${index1}]`);
                                                        allOptions.forEach((option: any) => {
                                                            option.classList.remove('selected-option');
                                                        });
                                                        e.classList.toggle('selected-option');
                                                        vm.specs[index1] = opt.title;
                                                        const v = prod.variants.find((variant) => {
                                                            return PdClass.ObjCompare(variant.spec, vm.specs, true);
                                                        });
                                                        if (v?.preview_image) {
                                                            let index = prod.preview_image.findIndex((src) => {
                                                                return src == v.preview_image;
                                                            });
                                                            if (index >= 0) {
                                                                vm.swiper.slideTo(index);
                                                            }
                                                        }
                                                        gvc.notifyDataChange([ids.price, ids.addCartButton, ids.stock_count, ids.qty_count]);
                                                    })}"
                                                >
                                                    <span style="font-size: 15px; font-weight: 500; letter-spacing: 1.76px;"
                                                        >${(opt.language_title && (opt.language_title as any)[Language.getLanguage()]) || opt.title}</span
                                                    >
                                                </div>`;
                                            })
                                        )}
                                    </div>
                                </div>
                                <div class="mt-3"></div>`;
                        })
                    )}
                    ${[
                        //數量按鈕
                        gvc.bindView(() => {
                            return {
                                bind: ids.qty_count,
                                view: () => {
                                    const variant = prod.variants.find((item) => PdClass.ObjCompare(item.spec, vm.specs, true));
                                    const cartItem = new ApiCart().cart.line_items.find((item) => PdClass.ObjCompare(item.spec, vm.specs, true));
                                    if (
                                        variant &&
                                        (variant.stock < parseInt(vm.quantity, 10) || (cartItem && variant.stock < cartItem.count + parseInt(vm.quantity, 10))) &&
                                        `${variant.show_understocking}` !== 'false'
                                    ) {
                                        return '';
                                    }
                                    return html`
                                        <h5 class="mb-0" style="color: ${titleFontColor};font-size:14px;">${Language.text('quantity')}</h5>
                                        <div class="d-flex align-items-center" style="color:${titleFontColor};">
                                            <select
                                                class="form-select custom-select me-2"
                                                style="border-radius: 5px; color: #575757; width: 100px;height:38px;"
                                                onchange="${gvc.event((e) => {
                                                    vm.quantity = e.value;
                                                    gvc.notifyDataChange([ids.addCartButton, ids.stock_count]);
                                                })}"
                                            >
                                                ${gvc.map(
                                                    [
                                                        ...new Array(
                                                            (() => {
                                                                const variant = prod.variants.find((item) => PdClass.ObjCompare(item.spec, vm.specs, true));
                                                                if (!variant || variant.show_understocking === 'false') {
                                                                    return 50;
                                                                }
                                                                return variant.stock < 50 ? variant.stock : 50;
                                                            })()
                                                        ),
                                                    ].map((item, index) => {
                                                        return html` <option value="${index + 1}">${index + 1}</option>`;
                                                    })
                                                )}
                                            </select>
                                            ${(prod.unit as any)[Language.getLanguage()] || Language.text('pieces')}
                                        </div>
                                    `;
                                },
                                divCreate: {
                                    class: `flex-column gap-2  ${obj.with_qty === false ? `d-none` : `d-flex`} `,
                                },
                            };
                        }),
                        //庫存顯示
                        gvc.bindView(() => {
                            return {
                                bind: ids.stock_count,
                                view: () => {
                                    return [
                                        (() => {
                                            const variant = prod.variants.find((item) => PdClass.ObjCompare(item.spec, vm.specs, true));

                                            if (variant && variant.show_understocking !== 'false') {
                                                const stockClass = `${variant.stock}` === '0' ? 'text-danger' : '';
                                                return html`
                                                    <div class="${stockClass} fw-500 mt-2" style="font-size: 14px; color: ${titleFontColor};">${Language.text('stock_count')}：${variant.stock}</div>
                                                `;
                                            }

                                            return '';
                                        })(),
                                    ].join('');
                                },
                                divCreate: {},
                            };
                        }),
                        //購物車按鈕
                        gvc.bindView({
                            bind: ids.addCartButton,
                            view: () => {
                                const variant = prod.variants.find((item) => {
                                    return PdClass.ObjCompare(item.spec, vm.specs, true);
                                });
                                const cartItem = new ApiCart().cart.line_items.find((item) => {
                                    return PdClass.ObjCompare(item.spec, vm.specs, true);
                                });
                                if (!variant) {
                                    return html` <button class="no-stock w-100" disabled>發生錯誤</button>`;
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

                                if (
                                    (variant.stock < parseInt(vm.quantity, 10) || (cartItem && variant.stock < cartItem.count + parseInt(vm.quantity, 10))) &&
                                    `${variant.show_understocking}` !== 'false'
                                ) {
                                    return html` <button class="no-stock w-100" disabled>${Language.text('out_of_stock')}</button>`;
                                }

                                return html`
                                    <div
                                        class="add-cart-imd-btn fw-bold h-100 "
                                        style="width:calc(50% - 5px);cursor: pointer;"
                                        onclick="${gvc.event(() => {
                                            const buy_it = new ApiCart(ApiCart.buyItNow);
                                            buy_it.clearCart();
                                            buy_it.addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                            ApiCart.toCheckOutPage(ApiCart.buyItNow);
                                            gvc.closeDialog();
                                        })}"
                                    >
                                        ${Language.text('buy_it_now')}
                                    </div>
                                    <div class="flex-fill"></div>
                                    <button
                                        class="add-cart-btn fw-bold "
                                        style="width:calc(50% - 5px);"
                                        onclick="${gvc.event(() => {
                                            if (obj.only_select) {
                                                obj.only_select({ id: prod.id, specs: vm.specs });
                                            } else {
                                                new ApiCart().addToCart(`${prod.id}`, vm.specs, vm.quantity);
                                                gvc.glitter.recreateView('.js-cart-count');
                                                gvc.glitter.recreateView('.shopping-cart');
                                                PdClass.jumpAlert({
                                                    gvc,
                                                    text: html`${Language.text('add_to_cart_success')}`,
                                                    justify: 'top',
                                                    align: 'center',
                                                    width: 300,
                                                });
                                                obj.callback && obj.callback();
                                            }
                                        })}"
                                    >
                                        ${Language.text('add_to_cart')}
                                    </button>
                                `;
                            },
                            divCreate: {
                                style: `height: 38px;width:${document.body.clientWidth > 800 ? `400px` : `100%`};`,
                                class: `d-flex mt-3`,
                            },
                        }),
                    ].join('')}
                    <div class="d-flex py-3" style="color: #554233">
                        <span
                            class="d-flex nav-link p-0 add-wish-container"
                            onclick="${gvc.event(() => {
                                if (CheckInput.isEmpty(GlobalUser.token)) {
                                    changePage('login', 'page', {});
                                    return;
                                }

                                ApiShop.getWishList().then((getRes) => {
                                    if (getRes.result && getRes.response.data) {
                                        if (getRes.response.data.find((item: Product_l) => `${item.id}` === `${prod.id}`)) {
                                            ApiShop.deleteWishList(`${prod.id}`).then(async () => {
                                                PdClass.jumpAlert({
                                                    gvc,
                                                    text: '刪除成功',
                                                    justify: 'top',
                                                    align: 'center',
                                                });
                                                vm.wishStatus = false;
                                                gvc.notifyDataChange(ids.wishStatus);
                                            });
                                        } else {
                                            const variant = prod.variants.find((item) => PdClass.ObjCompare(item.spec, vm.specs, true)) ?? prod.variants[0];
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

                                            ApiShop.postWishList(`${prod.id}`).then(async () => {
                                                PdClass.jumpAlert({
                                                    gvc,
                                                    text: '新增成功',
                                                    justify: 'top',
                                                    align: 'center',
                                                });
                                                vm.wishStatus = true;
                                                gvc.notifyDataChange(ids.wishStatus);
                                            });
                                        }
                                    }
                                });
                            })}"
                        >
                            ${gvc.bindView({
                                bind: ids.wishStatus,
                                view: () => {
                                    if ((window as any).store_info.wishlist == false) {
                                        return ``;
                                    } else {
                                        if (vm.wishStatus) {
                                            return html` <i class="fa-solid fa-heart"></i>
                                                <span>${Language.text('remove_to_wishlist')}</span>`;
                                        } else {
                                            return html` <i class="fa-regular fa-heart"></i>
                                                <span>${Language.text('add_to_wishlist')}</span>`;
                                        }
                                    }
                                },
                            })}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    static isPhone() {
        return document.body.clientWidth < 768;
    }

    static isPad() {
        return document.body.clientWidth >= 768 && document.body.clientWidth <= 960;
    }
}
