import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { PdClass, Product, FileList } from './pd-class.js';

const html = String.raw;

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

    public static main(gvc: GVC, widget: any, subData: any) {
        //移除所有查詢
        const url = new URL(location.href);
        for (const b of url.searchParams.keys()) {
            gvc.glitter.setUrlParameter(b, undefined);
        }
        const glitter = gvc.glitter;
        const isPhone = document.body.clientWidth < 768;

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
                    const titleFontColor = glitter.share.globalValue['theme_color.0.title'] ?? '#333333';
                    PdClass.addSpecStyle(gvc);
                    vm.specs =
                        vm.specs.length > 0
                            ? vm.specs
                            : prod.specs.map((spec) => {
                                  return spec.option[0].title;
                              });

                    return html`<div class="container">
                        <div class="row" style="${isPhone ? 'margin: 1rem 0; width: 100%;' : 'margin: 7rem;'}">
                            <div class="col-12 col-md-6 px-0 px-md-3" id="swiper-container">
                                <div class="swiper" id="dynamic-swiper">
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
                                <div class="swiper-sm mt-2" style="height: ${isPhone ? 75 : 100}px; overflow: hidden;">
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
                            <div class="col-12 col-md-6 px-0 px-md-3 d-flex flex-column gap-2 mt-4 mt-md-0">${PdClass.selectSpec({ gvc, titleFontColor, prod, vm })}</div>
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
                                        if (!template) {
                                            return '';
                                        }

                                        let htmlString = template.data.content;
                                        if (jsonData) {
                                            jsonData.list.map((data) => {
                                                const cssStyle = template.data.tags.find((item) => item.key === data.key);
                                                const regex = new RegExp(`@{{${data.key}}}`, 'g');
                                                htmlString = htmlString.replace(
                                                    regex,
                                                    html`<span
                                                        style="font-size: ${cssStyle?.font_size ?? 16}px; color: ${cssStyle?.font_color ?? '#393939'}; background: ${cssStyle?.font_bgr ?? '#fff'};"
                                                        >${data.value}</span
                                                    >`
                                                );
                                            });
                                        }
                                        return htmlString.replace(/@{{[^}]+}}/g, '');
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

                    function updateSwiperHeight() {
                        const size = setTimeout(() => {
                            const container = document.getElementById('swiper-container');
                            const swiper = document.getElementById('dynamic-swiper');
                            if (swiper && container) {
                                const rem = document.body.clientWidth > 768 ? '2rem' : '0rem';
                                swiper.style.height = `calc(${container.clientWidth}px - ${rem})`;
                                clearInterval(size);
                            }
                        }, 200);
                    }
                    updateSwiperHeight();
                    window.addEventListener('resize', updateSwiperHeight);
                }
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ProductDetail);
