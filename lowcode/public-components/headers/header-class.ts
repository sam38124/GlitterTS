import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Tool } from '../../modules/tool.js';
import { Language } from '../../glitter-base/global/language.js';

const html = String.raw;

export class HeaderClass {
    static spinner(obj?: {
        container?: {
            class?: string;
            style?: string;
        };
        circle?: {
            visible?: boolean;
            width?: number;
            borderSize?: number;
        };
        text?: {
            value?: string;
            visible?: boolean;
            fontSize?: number;
        };
    }) {
        const container = {
            class: `${obj?.container?.class ?? ''}`,
            style: `margin-top: 2rem ;${obj?.container?.style}`,
        };
        const circleAttr = {
            visible: obj?.circle?.visible === false ? false : true,
            width: obj?.circle?.width ?? 20,
            borderSize: obj?.circle?.borderSize ?? 16,
        };

        const textAttr = {
            value: obj?.text?.value ?? Language.text('loading'),
            visible: obj?.text?.visible === false ? false : true,
            fontSize: obj?.text?.fontSize ?? 16,
        };
        return html` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}" style="${container.style}">
            <div
                class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
                style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
                role="status"
            ></div>
            <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}" style="font-size: ${textAttr.fontSize}px;">${textAttr.value}</span>
        </div>`;
    }

    static isImageUrlValid(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    static noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';

    static rightCartMenu(gvc: GVC, widget: any) {
        gvc.glitter.setDrawer(
            gvc.bindView(
                (() => {
                    const vm = {
                        id: gvc.glitter.getUUID(),
                        imageId: gvc.glitter.getUUID(),
                        dataList: [] as {
                            id: number;
                            title: string;
                            count: number;
                            spec: string[];
                            price: number;
                            image: string;
                        }[],
                        loading: true,
                    };

                    const classPrefix = Tool.randomString(6);

                    gvc.addStyle(`
                        .${classPrefix}-wh {
                            display: flex;
                            min-width: 70px;
                            min-height: 70px;
                            max-width: 70px;
                            max-height: 70px;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            object-position: center;
                        }

                        .${classPrefix}-select {
                            display: flex;
                            padding: 7px 30px 7px 18px;
                            max-height: 40px;
                            align-items: center;
                            gap: 6px;
                            border-radius: 10px;
                            border: 1px solid #ddd;
                            background: transparent url('https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1718100926212-Vector 89.png') no-repeat;
                            background-position-x: calc(100% - 12px);
                            background-position-y: 16px;
                            appearance: none;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            color: #393939;
                        }

                        .${classPrefix}-select:focus {
                            outline: 0;
                        }

                        .${classPrefix}-cart-container {
                            display: flex;
                            width: 100%;
                            align-items: center;
                            padding: 0;
                            margin-bottom: 18px;
                            padding: 12px;
                            border-bottom: 1px solid #dddddd;
                        }

                        .${classPrefix}-cart-title {
                            letter-spacing: 4px;
                            font-size: 22px;
                            font-weight: 700;
                        }

                        .${classPrefix}-title {
                            font-size: 16px;
                        }

                        .${classPrefix}-spec {
                            font-size: 14px;
                            color: #8d8d8d;
                        }

                        .${classPrefix}-button {
                            display: flex;
                            padding: 8px 14px;
                            max-height: 36px;
                            justify-content: center;
                            align-items: center;
                            gap: 8px;
                            border: 0;
                            border-radius: 10px;
                            background: ${widget.formData.theme_color['solid-button-bg'] ?? '#000'};
                            cursor: pointer;
                            color: ${widget.formData.theme_color['solid-button-text'] ?? '#fff'};
                        }
                    `);

                    function refreshView() {
                        setTimeout(() => {
                            vm.loading = true;
                            gvc.glitter.recreateView('.js-cart-count');
                            gvc.glitter.recreateView('.shopping-cart');
                            gvc.notifyDataChange(vm.id);
                        }, 200);
                    }

                    return {
                        bind: vm.id,
                        view: () => {
                            try {
                                if (vm.loading) {
                                    return html`<div class="w-100 vh-100 bg-white">${this.spinner()}</div>`;
                                } else {
                                    return html` <div class="" style="position: relative;">
                                        <div class="${classPrefix}-cart-container align-items-center">
                                            <div
                                                class="d-flex align-items-center justify-content-center fs-5 py-3 px-2"
                                                style="cursor:pointer;"
                                                onclick="${gvc.event(() => {
                                                    gvc.glitter.closeDrawer();
                                                })}"
                                            >
                                                <i class="fa-sharp fa-solid fa-angle-left"></i>
                                            </div>
                                            <div class="${classPrefix}-cart-title">${Language.text('cart')}</div>
                                            <div class="flex-fill"></div>
                                            <button
                                                class="${classPrefix}-button"
                                                type="button"
                                                onclick="${gvc.event(() => {
                                                    (window as any).drawer.close();
                                                    gvc.glitter.href = '/checkout';
                                                })}"
                                            >
                                                ${Language.text('proceed_to_checkout')}
                                            </button>
                                        </div>
                                        ${(() => {
                                            if (vm.dataList.length === 0) {
                                                return html`<div class="container d-flex align-items-center justify-content-center flex-column">
                                                    <lottie-player
                                                        style="max-width: 100%; width: 300px; height: 300px;"
                                                        src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
                                                        speed="1"
                                                        loop=""
                                                        autoplay=""
                                                        background="transparent"
                                                    ></lottie-player>
                                                    <div class="mt-3 fw-bold">${Language.text('empty_cart_message')}</div>
                                                </div>`;
                                            } else {
                                                return vm.dataList
                                                    .map((item, index) => {
                                                        return html` <div class="d-flex align-items-center  px-3 position-relative" style="gap:12px;">
                                                            <div
                                                                class="position-absolute"
                                                                style="right:13px;top:0px;cursor:pointer;"
                                                                onclick="${gvc.event(() => {
                                                                    ApiCart.setCart((cartItem) => {
                                                                        cartItem.line_items = cartItem.line_items.filter((dd) => {
                                                                            return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                                                        });
                                                                        refreshView();
                                                                    });
                                                                })}"
                                                            >
                                                                <i class="fa-regular fa-trash-can"></i>
                                                            </div>
                                                            <div class="d-none" style="width: 10%">
                                                                <i
                                                                    class="fa-solid fa-xmark-large"
                                                                    style="cursor: pointer;"
                                                                    onclick="${gvc.event(() => {
                                                                        ApiCart.setCart((cartItem) => {
                                                                            cartItem.line_items = cartItem.line_items.filter((dd) => {
                                                                                return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                                                            });
                                                                            refreshView();
                                                                        });
                                                                    })}"
                                                                ></i>
                                                            </div>
                                                            <div class="d-flex" style="">
                                                                <img src="${item.image}" class="${classPrefix}-wh rounded-3" />
                                                            </div>
                                                            <div class="d-flex flex-column gap-1 flex-fill">
                                                                <div class="${classPrefix}-title">${item.title}</div>
                                                                <div class="${classPrefix}-spec">${item.spec.join(' / ')}</div>
                                                                <div class="d-flex align-items-center justify-content-between">
                                                                    <div class="d-flex align-items-center gap-1">
                                                                        數量：<select
                                                                            class="${classPrefix}-select"
                                                                            style="width: 100px;"
                                                                            onchange="${gvc.event((e) => {
                                                                                ApiCart.setCart((cartItem) => {
                                                                                    cartItem.line_items.find((dd) => {
                                                                                        return `${dd.id}` === `${item.id}` && item.spec.join('') === dd.spec.join('');
                                                                                    })!.count = parseInt(e.value, 10);
                                                                                    refreshView();
                                                                                });
                                                                            })}"
                                                                        >
                                                                            ${[...new Array(99)]
                                                                                .map((_, index) => {
                                                                                    return html` <option value="${index + 1}" ${index + 1 === item.count ? `selected` : ``}>${index + 1}</option>`;
                                                                                })
                                                                                .join('')}
                                                                        </select>
                                                                    </div>
                                                                    NT$ ${(item.price * item.count).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>`;
                                                    })
                                                    .join(html`<div class="w-100 border-top my-3"></div>`);
                                            }
                                        })()}
                                    </div>`;
                                }
                            } catch (e) {
                                console.log(e);
                                return `${e}`;
                            }
                        },
                        divCreate: {},
                        onCreate: () => {
                            if (vm.loading) {
                                vm.dataList = [];
                                const cart = ApiCart.cart;
                                new Promise<void>((resolve, reject) => {
                                    ApiShop.getProduct({
                                        page: 0,
                                        limit: 10000,
                                        status: 'inRange',
                                        show_hidden: true,
                                        id_list: [...new Set(cart.line_items.map((item) => item.id))].join(','),
                                    })
                                        .then(async (data) => {
                                            if (data.result && data.response) {
                                                const products = data.response.data;
                                                for (const item of cart.line_items) {
                                                    const product = products.find((p: { id: number }) => `${p.id}` === `${item.id}`);

                                                    if (product) {
                                                        const variant = product.content.variants.find((v: any) => {
                                                            return v.spec.join(',') === item.spec.join(',');
                                                        });
                                                        vm.dataList.push({
                                                            id: item.id,
                                                            title: product.content.title,
                                                            count: item.count,
                                                            spec: item.spec,
                                                            price: variant ? variant.sale_price : 0,
                                                            image: await (async () => {
                                                                if (!variant) {
                                                                    return this.noImageURL;
                                                                }
                                                                const img = await this.isImageUrlValid(variant.preview_image).then((isValid) => {
                                                                    return isValid ? variant.preview_image : product.content.preview_image[0] || this.noImageURL;
                                                                });
                                                                return img;
                                                            })(),
                                                        });
                                                    }
                                                }
                                                resolve();
                                            }
                                        })
                                        .then(() => {
                                            (document.querySelector('.hy-drawer-content') as any).style.background = '#ffffff';
                                            vm.loading = false;
                                            gvc.notifyDataChange(vm.id);
                                        });
                                });
                            }
                        },
                    };
                })()
            ),
            () => {
                if (document.body.clientWidth > 800) {
                    gvc.glitter.openDrawer(400);
                } else if (document.body.clientWidth < 600) {
                    gvc.glitter.openDrawer(document.body.clientWidth);
                } else {
                    gvc.glitter.openDrawer(document.body.clientWidth * 0.8);
                }
            }
        );
    }
}