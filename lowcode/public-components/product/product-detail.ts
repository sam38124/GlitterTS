import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Tool } from '../../modules/tool.js';

const html = String.raw;

type Seo = {
    title: string;
    domain: string;
    content: string;
    keywords: string;
};

type SpecOption = {
    title: string;
    expand?: boolean;
};

type Spec = {
    title: string;
    option: SpecOption[];
};

type Token = {
    exp: number;
    iat: number;
    userID: number;
    account: string;
    userData: Record<string, unknown>;
};

type Variant = {
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

type ContentJsonList = {
    key: string;
    value: string;
};

type ContentJson = {
    id: string;
    list: ContentJsonList[];
};

type ProductType = {
    product: boolean;
    giveaway: boolean;
    addProduct: boolean;
};

type Content = {
    id: number;
    seo: Seo;
    type: string;
    specs: Spec[];
    title: string;
    token: Token;
    status: string;
    userID: number;
    content: string;
    visible: string;
    template: string;
    variants: Variant[];
    hideIndex: string;
    max_price: number;
    min_price: number;
    collection: unknown[];
    productType: ProductType;
    content_json: ContentJson[];
    in_wish_list: boolean;
    content_array: string[];
    preview_image: string[];
    relative_product: unknown[];
};

type Product = {
    id: number;
    userID: number;
    content: Content;
    created_time: string;
    updated_time: string;
    status: number;
    total_sales?: number;
};

type ContentTag = {
    key: string;
    title: string;
    font_bgr: string;
    font_size: string;
    font_color: string;
};

type ContentData = {
    tags: ContentTag[];
    content: string;
};

type FileItem = {
    id: string;
    data: ContentData;
    type: string;
    title: string;
    status: boolean;
    updated_time: string;
};

type FileList = FileItem[];

export class ProductDetail {
    static tab(
        data: {
            title: string;
            key: string;
        }[],
        gvc: GVC,
        select: string,
        callback: (key: string) => void,
        style?: string
    ) {
        return html` <div
            style="width: 100%; justify-content: center; align-items: flex-start; gap: 22px; display: inline-flex;cursor: pointer;margin-top: 24px;margin-bottom: 24px;font-size: 18px; ${style ?? ''};"
        >
            ${data
                .map((dd) => {
                    if (select === dd.key) {
                        return html` <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                            <div
                                style="align-self: stretch; text-align: center; color: #393939; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word;white-space: nowrap;margin: 0 20px;"
                                onclick="${gvc.event(() => {
                                    callback(dd.key);
                                })}"
                            >
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px; border: 1px #393939 solid"></div>
                        </div>`;
                    } else {
                        return html` <div
                            style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex"
                            onclick="${gvc.event(() => {
                                callback(dd.key);
                            })}"
                        >
                            <div
                                style="align-self: stretch; text-align: center; color: #8D8D8D; font-family: Noto Sans; font-weight: 400; line-height: 18px; word-wrap: break-word;white-space: nowrap;margin: 0 20px;"
                            >
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px"></div>
                        </div>`;
                    }
                })
                .join('')}
        </div>`;
    }

    static jumpAlert(obj: { gvc: GVC; text: string; justify: 'top' | 'bottom'; align: 'left' | 'center' | 'right'; timeout?: number; width?: number }) {
        const className = Tool.randomString(5);
        const fixedStyle = (() => {
            let style = '';
            if (obj.justify === 'top') {
                style += `top: 90px;`;
            } else if (obj.justify === 'bottom') {
                style += `bottom: 24px;`;
            }
            if (obj.align === 'left') {
                style += `left: 12px;`;
            } else if (obj.align === 'center') {
                style += `left: 50%; right: 50%;`;
            } else if (obj.align === 'right') {
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
                width: ${obj.width ?? 120}px;
                text-align: center;
                z-index: 11;
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
        const htmlString = html`<div class="bounce-effect-${className}">${obj.text}</div>`;
        obj.gvc.glitter.document.body.insertAdjacentHTML('beforeend', htmlString);
        setTimeout(() => {
            const element = document.querySelector(`.bounce-effect-${className}`) as HTMLElement;
            if (element) {
                element.remove();
            }
        }, obj.timeout ?? 2000);
    }

    public static main(gvc: GVC, widget: any, subData: any) {
        const glitter = gvc.glitter;
        const isPhone = document.body.clientWidth < 768;

        let changePage = (index: string, type: 'page' | 'home', subData: any) => {
            alert('change_page_origin');
        };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });

        const vm = {
            data: {} as Product,
            content_manager: [] as FileList,
            content_tag: 'default' as string,
            specs: [] as string[],
            wishStatus: false,
            quantity: '1',
        };
        const ids = {
            page: glitter.getUUID(),
            content: glitter.getUUID(),
            price: glitter.getUUID(),
            wishStatus: glitter.getUUID(),
            addCartButton: glitter.getUUID(),
        };
        const loadings = {
            page: true,
        };

        gvc.addStyle(`
            .add-wish-container {
                align-items: center;
                justify-content: center;
                gap: 5px;
                cursor: pointer;
                font-size: 15px;
                text-decoration: none !important;
                color: #333333;
            }

            .spec-option {
                display: flex;
                padding: 10px;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
                gap: 10px;
                border: 1px solid #333333;
                cursor: pointer;
                transition: 0.3s;
            }

            .spec-option.selected-option {
                background: #333333;
                color: #fff;
            }

            .spec-option:not(.selected-option):hover {
                background: #ddd;
            }

            .add-cart-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border-radius: 5px;
                border: 1px solid #333333;
                background: #fff;
                color: #333333;
                width: 200px;
                height: 100%;
                transition: 0.3s;
            }

            .add-cart-btn:hover {
                background: #ddd;
            }

            .no-stock {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border-radius: 5px;
                border: 1px solid #333333;
                background: #dddddd;
                color: #333333;
                width: 200px;
                height: 100%;
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
                --swiper-theme-color: #dddddd;
            }

            .swiper-button-next {
                --swiper-theme-color: #dddddd;
            }
        `);

        // 比較兩個 Object 是否相同
        function ObjCompare(obj1: { [k: string]: any }, obj2: { [k: string]: any }) {
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

        function spinner() {
            return html`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto mt-5">
                <div class="spinner-border" role="status"></div>
                <span class="mt-3">載入中</span>
            </div>`;
        }

        return gvc.bindView({
            bind: ids.page,
            view: () => {
                if (loadings.page) {
                    return spinner();
                } else {
                    const prod = vm.data.content;
                    vm.specs =
                        vm.specs.length > 0
                            ? vm.specs
                            : prod.specs.map((spec) => {
                                  return spec.option[0].title;
                              });
                    return html`<div class="container">
                        <div class="row" style="${isPhone ? 'margin: 1rem 0; width: 100%;' : 'margin: 7rem;'}">
                            <div class="col-12 col-md-6 px-0 px-md-3">
                                <div class="swiper" style="height: 450px;">
                                    <div class="swiper-wrapper">
                                        ${prod.preview_image
                                            .map((image, index) => {
                                                return html` <div class="swiper-slide swiper-slide-def">
                                                    <img src="${image}" alt="${prod.title}-${index}" />
                                                </div>`;
                                            })
                                            .join('')}
                                    </div>
                                    <div class="swiper-button-prev"></div>
                                    <div class="swiper-button-next"></div>
                                </div>
                                <div class="swiper-sm mt-2" style="height: ${isPhone ? 75 : 100}px; overflow: scroll;">
                                    <div class="swiper-wrapper">
                                        ${prod.preview_image
                                            .map((image, index) => {
                                                return html` <div class="swiper-slide swiper-slide-sm" data-image-index="${index}">
                                                    <img src="${image}" alt="${prod.title}-${index}-sm" />
                                                </div>`;
                                            })
                                            .join('')}
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 px-0 px-md-3 d-flex flex-column gap-2 mt-4 mt-md-0">
                                <h1>${prod.title}</h1>
                                <h2>
                                    ${gvc.bindView({
                                        bind: ids.price,
                                        view: () => {
                                            const v = prod.variants.find((variant) => {
                                                return ObjCompare(variant.spec, vm.specs);
                                            });
                                            return v ? `$ ${v.sale_price.toLocaleString()}` : '錯誤';
                                        },
                                    })}
                                </h2>
                                ${gvc.map(
                                    prod.specs.map((spec, index1) => {
                                        return html`<div>
                                                <h5>${spec.title}</h5>
                                                <div class="d-flex gap-2">
                                                    ${gvc.map(
                                                        spec.option.map((opt) => {
                                                            return html`<div
                                                                gvc-option="spec-option-${index1}"
                                                                class="spec-option ${vm.specs[index1] === opt.title ? 'selected-option' : ''}"
                                                                onclick="${gvc.event((e) => {
                                                                    const allOptions = document.querySelectorAll(`div[gvc-option=spec-option-${index1}]`);
                                                                    allOptions.forEach((option: any) => {
                                                                        option.classList.remove('selected-option');
                                                                    });
                                                                    e.classList.toggle('selected-option');
                                                                    vm.specs[index1] = opt.title;
                                                                    gvc.notifyDataChange(ids.price);
                                                                    gvc.notifyDataChange(ids.addCartButton);
                                                                })}"
                                                            >
                                                                <span style="font-size: 15px; font-weight: 500; letter-spacing: 1.76px;">${opt.title}</span>
                                                            </div>`;
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                            <div class="mt-3"></div>`;
                                    })
                                )}
                                <div class="d-flex gap-2" style="height: 46px;">
                                    <div class="d-flex gap-2 align-items-center">
                                        <span>數量</span>
                                        <select
                                            class="form-select custom-select"
                                            style="border-radius: 5px; color: #575757; width: 100px;"
                                            onchange="${gvc.event((e) => {
                                                vm.quantity = e.value;
                                                gvc.notifyDataChange(ids.addCartButton);
                                            })}"
                                        >
                                            ${gvc.map(
                                                [...new Array(50)].map((item, index) => {
                                                    return html` <option value="${index + 1}">${index + 1}</option>`;
                                                })
                                            )}
                                        </select>
                                    </div>
                                    ${gvc.bindView({
                                        bind: ids.addCartButton,
                                        view: () => {
                                            const variant = prod.variants.find((item) => ObjCompare(item.spec, vm.specs));
                                            const cartItem = ApiCart.cart.line_items.find((item) => ObjCompare(item.spec, vm.specs));
                                            if (!variant) {
                                                return html`<button class="no-stock" disabled>發生錯誤</button>`;
                                            }
                                            if (variant.stock < parseInt(vm.quantity, 10) || (cartItem && variant.stock < cartItem.count + parseInt(vm.quantity, 10))) {
                                                return html`<button class="no-stock" disabled>庫存不足</button>`;
                                            }
                                            return html`<button
                                                class="add-cart-btn"
                                                onclick="${gvc.event(() => {
                                                    ApiCart.addToCart(`${vm.data.id}`, vm.specs, vm.quantity);
                                                    gvc.glitter.recreateView('.js-cart-count');
                                                    gvc.glitter.recreateView('.shopping-cart');
                                                    this.jumpAlert({
                                                        gvc,
                                                        text: html`${vm.data.content.title} (${vm.specs.join('/')})<br />加入成功`,
                                                        justify: 'top',
                                                        align: 'center',
                                                        width: 300,
                                                    });
                                                })}"
                                            >
                                                加入購物車
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
                                                if (getRes.result && getRes.response.data) {
                                                    if (getRes.response.data.find((item: Product) => item.id === vm.data.id)) {
                                                        ApiShop.deleteWishList(`${vm.data.id}`).then(async () => {
                                                            this.jumpAlert({
                                                                gvc,
                                                                text: '刪除成功',
                                                                justify: 'top',
                                                                align: 'center',
                                                            });
                                                            vm.wishStatus = false;
                                                            gvc.notifyDataChange(ids.wishStatus);
                                                        });
                                                    } else {
                                                        ApiShop.postWishList(`${vm.data.id}`).then(async () => {
                                                            this.jumpAlert({
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
                                                if (vm.wishStatus) {
                                                    return html` <i class="fa-solid fa-heart"></i>
                                                        <span>從心願單移除</span>`;
                                                } else {
                                                    return html` <i class="fa-regular fa-heart"></i>
                                                        <span>添加至心願單</span>`;
                                                }
                                            },
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="d-flex flex-column align-items-center mt-4">
                            ${gvc.bindView(
                                (() => {
                                    const id = glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return this.tab(
                                                [{ title: '商品描述', key: 'default' }].concat(
                                                    vm.content_manager
                                                        .filter((cont) => {
                                                            return prod.content_array.includes(cont.id);
                                                        })
                                                        .map((cont) => {
                                                            return { title: cont.title, key: cont.id };
                                                        })
                                                ),
                                                gvc,
                                                vm.content_tag,
                                                (text) => {
                                                    vm.content_tag = text;
                                                    gvc.notifyDataChange(id);
                                                    gvc.notifyDataChange(ids.content);
                                                }
                                            );
                                        },
                                    };
                                })()
                            )}
                            ${gvc.bindView({
                                bind: ids.content,
                                view: () => {
                                    if (vm.content_tag === 'default') {
                                        return prod.content;
                                    } else {
                                        const template = vm.content_manager.find((cont) => cont.id === vm.content_tag);
                                        const jsonData = prod.content_json.find((data) => data.id === vm.content_tag);
                                        if (!template || !jsonData) {
                                            return '';
                                        }
                                        let htmlString = template.data.content;

                                        jsonData.list.map((data) => {
                                            const cssStyle = template.data.tags.find((item) => item.key === data.key);
                                            const regex = new RegExp(`@{{${data.key}}}`, 'g');
                                            htmlString = htmlString.replace(
                                                regex,
                                                html`<span style="font-size: ${cssStyle?.font_size ?? 16}px; color: ${cssStyle?.font_color ?? '#393939'}; background: ${cssStyle?.font_bgr ?? '#fff'};"
                                                    >${data.value}</span
                                                >`
                                            );
                                        });
                                        return htmlString;
                                    }
                                },
                                divCreate: {
                                    style: document.body.clientWidth > 768 ? 'margin: 0 240px;' : '',
                                },
                            })}
                        </div>
                        <div style="margin-top: 240px;"></div>
                    </div>`;
                }
            },
            divCreate: {
                style: 'min-height: 1000px;',
            },
            onCreate: () => {
                if (loadings.page) {
                    const title = glitter.getUrlParameter('page').split('/')[1];
                    if (title) {
                        const inputObj = {
                            page: 0,
                            limit: 1,
                            collection: '',
                            maxPrice: '',
                            minPrice: '',
                            search: decodeURIComponent(title) as string,
                            status: 'active',
                            orderBy: '',
                            with_hide_index: 'false',
                        };

                        Promise.all([
                            new Promise<{ result: boolean; response: any }>((resolve, reject) => {
                                ApiUser.getPublicConfig('text-manager', 'manager', (window as any).appName).then((data) => {
                                    resolve(data);
                                });
                            }),
                            new Promise<{ result: boolean; response: any }>((resolve, reject) => {
                                ApiShop.getProduct(inputObj).then((data) => {
                                    resolve(data);
                                });
                            }),
                            new Promise<{ result: boolean; response: any }>((resolve, reject) => {
                                ApiShop.getWishList().then((data) => {
                                    resolve(data);
                                });
                            }),
                        ]).then((dataArray) => {
                            if (dataArray[0].result && dataArray[0].response.value) {
                                vm.content_manager = dataArray[0].response.value;
                            }
                            if (dataArray[1].result && dataArray[1].response.data.length === 1) {
                                vm.data = dataArray[1].response.data[0];
                            }
                            if (dataArray[2].result && dataArray[2].response.data) {
                                vm.wishStatus = dataArray[2].response.data.some((item: Product) => item.id === vm.data.id);
                            }
                            loadings.page = false;
                            gvc.notifyDataChange(ids.page);
                        });
                    }
                } else {
                    const si = setInterval(() => {
                        const Swiper = (window as any).Swiper;
                        if (Swiper) {
                            const thumbs = new Swiper('.swiper-sm', {
                                slidesPerView: 4,
                                spaceBetween: 8,
                                watchSlidesVisibility: true,
                            });

                            new Swiper('.swiper', {
                                loop: true,
                                navigation: {
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                },
                                thumbs: {
                                    swiper: thumbs,
                                },
                            });

                            clearInterval(si);
                        }
                    }, 200);
                }
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ProductDetail);
