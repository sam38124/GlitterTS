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
import { ApiUser } from '../../glitter-base/route/user.js';
import { PdClass } from './pd-class.js';
import { Language } from '../../glitter-base/global/language.js';
const html = String.raw;
export class ProductDetail {
    static tab(data, gvc, select, callback, style) {
        return html ` <div
            style="width: 100%; justify-content: center; align-items: flex-start; gap: 22px; display: inline-flex;cursor: pointer;margin-top: 24px;margin-bottom: 24px;font-size: 18px; ${style !== null && style !== void 0 ? style : ''};"
        >
            ${data
            .map((dd) => {
            if (select === dd.key) {
                return html ` <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                            <div
                                style="align-self: stretch; text-align: center; color: ${ProductDetail.titleFontColor}; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word;white-space: nowrap;margin: 0 20px;"
                                onclick="${gvc.event(() => {
                    callback(dd.key);
                })}"
                            >
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px; border: 1px ${ProductDetail.titleFontColor} solid"></div>
                        </div>`;
            }
            else {
                return html ` <div
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
    static main(gvc, widget, subData) {
        var _a;
        ProductDetail.titleFontColor = (_a = gvc.glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333';
        const css = String.raw;
        gvc.addStyle(css `
            .pd_detail_content iframe {
                max-width: 100%;
            }
            .pd_detail_content img {
                max-width: 100%;
            }
        `);
        const product_id = gvc.glitter.getUrlParameter('product_id');
        const url = new URL(location.href);
        for (const b of url.searchParams.keys()) {
            if (b !== 'appName') {
                gvc.glitter.setUrlParameter(b, undefined);
            }
        }
        const glitter = gvc.glitter;
        const isPhone = document.body.clientWidth < 768;
        const vm = {
            data: {},
            content_manager: [],
            content_tag: 'default',
            specs: [],
            wishStatus: false,
            swiper: undefined,
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
            return html ` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto mt-5">
                <div class="spinner-border" role="status"></div>
                <span class="mt-3">${Language.text('loading')}</span>
            </div>`;
        }
        return gvc.bindView({
            bind: ids.page,
            view: () => __awaiter(this, void 0, void 0, function* () {
                var _b;
                if (loadings.page) {
                    return spinner();
                }
                if (Object.keys(vm.data).length === 0) {
                    return html ` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                        <lottie-player
                            style="max-width: 100%;width: 300px;"
                            src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                            speed="1"
                            loop="true"
                            background="transparent"
                        ></lottie-player>
                        <span class="mb-5 fs-5">這個商品目前尚未上架喔！</span>
                    </div>`;
                }
                const prod = vm.data.content;
                PdClass.addSpecStyle(gvc);
                vm.specs =
                    vm.specs.length > 0
                        ? vm.specs
                        : prod.specs.map((spec) => {
                            return spec.option[0].title;
                        });
                const book_mark = [
                    {
                        title: Language.text('all_products'),
                        event: () => {
                            gvc.glitter.href = '/all-product';
                        },
                    },
                ];
                const d_ = ((_b = prod.collection) !== null && _b !== void 0 ? _b : []).sort((a, b) => {
                    const countSlashes = (str) => (str.match(/\//g) || []).length;
                    return countSlashes(b) - countSlashes(a);
                });
                const collections = yield ApiShop.getCollection();
                function getCollectionLink(title) {
                    let domain = '';
                    function loop(array) {
                        for (const b of array) {
                            if (b.title === title) {
                                domain = (b.language_data && b.language_data[Language.getLanguage()] && b.language_data[Language.getLanguage()].seo.domain) || b.code;
                                title = (b.language_data && b.language_data[Language.getLanguage()] && b.language_data[Language.getLanguage()].title) || title;
                                break;
                            }
                            else if (b.array) {
                                loop(b.array);
                            }
                        }
                    }
                    loop(collections.response.value);
                    return {
                        title: title,
                        event: () => {
                            if (domain) {
                                gvc.glitter.href = `/collections/${domain}`;
                            }
                        },
                    };
                }
                if (d_[0]) {
                    d_[0].split(' / ').map((dd) => {
                        book_mark.push(getCollectionLink(dd));
                    });
                }
                return html ` <div class="container mx-auto " style="max-width:1100px;">
                    <div class="breadcrumb mb-0   d-flex align-items-center py-3" style="cursor:pointer;gap:10px;">
                        ${book_mark
                    .map((dd) => {
                    return html ` <li
                                    class="breadcrumb-item "
                                    style="margin-top: 0px;color:${ProductDetail.titleFontColor};"
                                    onclick="${gvc.event(() => {
                        dd.event();
                    })}"
                                >
                                    ${dd.title}
                                </li>`;
                })
                    .join('<i class="fa-solid fa-angle-right"></i>')}
                    </div>
                    ${PdClass.selectSpec({
                    gvc,
                    titleFontColor: ProductDetail.titleFontColor,
                    prod,
                    vm,
                    preview: true,
                })}
                    <div class="d-flex flex-column align-items-center mt-2" style="width:100%;">
                        ${gvc.bindView((() => {
                    const id = glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return this.tab([
                                {
                                    title: Language.text('product_description'),
                                    key: 'default',
                                },
                            ].concat(vm.content_manager
                                .filter((cont) => {
                                return prod.content_array.includes(cont.id);
                            })
                                .map((cont) => {
                                return {
                                    title: cont.title,
                                    key: cont.id,
                                };
                            })), gvc, vm.content_tag, (text) => {
                                vm.content_tag = text;
                                gvc.notifyDataChange(id);
                                gvc.notifyDataChange(ids.content);
                            });
                        },
                        divCreate: {
                            class: `pt-3`,
                        },
                    };
                })())}
                        ${gvc.bindView({
                    bind: ids.content,
                    view: () => {
                        if (vm.content_tag === 'default') {
                            return prod.content;
                        }
                        else {
                            const template = vm.content_manager.find((cont) => cont.id === vm.content_tag);
                            const jsonData = prod.content_json.find((data) => data.id === vm.content_tag);
                            if (!template) {
                                return '';
                            }
                            let htmlString = template.data.content;
                            if (jsonData) {
                                jsonData.list.map((data) => {
                                    var _a, _b, _c;
                                    const cssStyle = template.data.tags.find((item) => item.key === data.key);
                                    const regex = new RegExp(`@{{${data.key}}}`, 'g');
                                    htmlString = htmlString.replace(regex, html `<span
                                                    style="font-size: ${(_a = cssStyle === null || cssStyle === void 0 ? void 0 : cssStyle.font_size) !== null && _a !== void 0 ? _a : 16}px; color: ${(_b = cssStyle === null || cssStyle === void 0 ? void 0 : cssStyle.font_color) !== null && _b !== void 0 ? _b : '${titleFontColor}'}; background: ${(_c = cssStyle === null || cssStyle === void 0 ? void 0 : cssStyle.font_bgr) !== null && _c !== void 0 ? _c : '#fff'};"
                                                    >${data.value}</span
                                                >`);
                                });
                            }
                            return htmlString.replace(/@{{[^}]+}}/g, '');
                        }
                    },
                    divCreate: {
                        style: (() => {
                            if (PdClass.isPad()) {
                                return 'margin: 0 60px;';
                            }
                            if (PdClass.isPhone()) {
                                return '';
                            }
                            return 'margin: 0 10%;';
                        })() + `max-width:100%;`,
                        class: `pd_detail_content fr-view`,
                    },
                })}
                    </div>
                    <div style="margin-top: 150px;"></div>
                    ${prod.relative_product.length
                    ? gvc.bindView(() => {
                        const swipID = gvc.glitter.getUUID();
                        return {
                            bind: gvc.glitter.getUUID(),
                            view: () => __awaiter(this, void 0, void 0, function* () {
                                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                    const product = (yield ApiShop.getProduct({
                                        limit: 50,
                                        page: 0,
                                        id_list: prod.relative_product.join(','),
                                    })).response.data;
                                    setTimeout(() => {
                                        const swiper = new window.Swiper('#' + swipID, {
                                            slidesPerView: glitter.ut.frSize({
                                                sm: product.length < 4 ? product.length : 4,
                                                lg: product.length < 6 ? product.length : 6,
                                            }, product.length < 2 ? product.length : 2),
                                            spaceBetween: glitter.ut.frSize({
                                                sm: 10,
                                                lg: 30,
                                            }, 10),
                                        });
                                    }, 100);
                                    if (!product.length) {
                                        return ``;
                                    }
                                    resolve(html `
                                              <div class="w-100 d-flex align-items-center justify-content-center ">
                                                  <div class="mx-auto" style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                                      <div
                                                          style="font-size:18px;align-self: stretch; text-align: center; color: ${ProductDetail.titleFontColor}; font-weight: 700; line-height: 18px; word-wrap: break-word;white-space: nowrap;margin: 0 20px;"
                                                      >
                                                          ${Language.text('related_products')}
                                                      </div>
                                                      <div style="align-self: stretch; height: 0px; border: 1px ${ProductDetail.titleFontColor} solid"></div>
                                                  </div>
                                              </div>
                                              <div class="w-100 d-flex align-items-center justify-content-center py-3 py-sm-4">
                                                  <div
                                                      class=""
                                                      style="${product.length <
                                        glitter.ut.frSize({
                                            sm: 4,
                                            lg: 6,
                                        }, 2)
                                        ? `width:${200 * product.length}px;`
                                        : `width:100%;`}"
                                                  >
                                                      <div class="swiper w-100" id="${swipID}">
                                                          <div class="swiper-wrapper">
                                                              ${product
                                        .map((dd, index) => {
                                        return html ` <div class="swiper-slide" style="width:100%;height: 350px;">
                                                                          ${glitter.htmlGenerate.renderComponent({
                                            appName: window.appName,
                                            tag: 'product_widget',
                                            gvc: gvc,
                                            subData: dd,
                                        })}
                                                                      </div>`;
                                    })
                                        .join('')}
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          `);
                                }));
                            }),
                            divCreate: {
                                class: `w-100`,
                            },
                            onCreate: () => { },
                        };
                    })
                    : ''}
                    <div style="margin-top: 100px;"></div>
                </div>`;
            }),
            divCreate: {
                style: 'min-height: 1000px;',
            },
            onCreate: () => {
                if (loadings.page) {
                    const title = glitter.getUrlParameter('page').split('products/')[1];
                    if (title || product_id) {
                        const inputObj = Object.assign(Object.assign({ page: 0, limit: 1, collection: '', maxPrice: '', minPrice: '' }, (() => {
                            if (product_id) {
                                return {
                                    id: product_id,
                                };
                            }
                            else {
                                return {
                                    domain: decodeURIComponent(title),
                                };
                            }
                        })()), { status: 'inRange', channel: 'normal', orderBy: '', with_hide_index: 'true', show_hidden: true });
                        Promise.all([
                            new Promise((resolve, reject) => {
                                ApiUser.getPublicConfig('text-manager', 'manager', window.appName).then((data) => {
                                    resolve(data);
                                });
                            }),
                            new Promise((resolve, reject) => {
                                ApiShop.getProduct(inputObj).then((data) => {
                                    resolve(data);
                                });
                            }),
                            new Promise((resolve, reject) => {
                                ApiShop.getWishList().then((data) => {
                                    resolve(data);
                                });
                            }),
                        ]).then((dataArray) => {
                            var _a, _b;
                            if (dataArray[0].result && dataArray[0].response.value) {
                                vm.content_manager = dataArray[0].response.value;
                            }
                            if (dataArray[1].result && dataArray[1].response.data) {
                                try {
                                    if (Array.isArray(dataArray[1].response.data)) {
                                        vm.data = dataArray[1].response.data[0];
                                    }
                                    else {
                                        vm.data = dataArray[1].response.data;
                                    }
                                    glitter.setUrlParameter('page', 'products/' + encodeURIComponent(vm.data.content.seo.domain || vm.data.content.title), [
                                        (_a = window.home_seo.title_prefix) !== null && _a !== void 0 ? _a : "",
                                        (vm.data.content.seo.domain || vm.data.content.title),
                                        (_b = window.home_seo.title_suffix) !== null && _b !== void 0 ? _b : "",
                                    ].join(''));
                                    const json_ld = document.querySelector('script[type="application/ld+json"]');
                                    if (json_ld) {
                                        json_ld.remove();
                                    }
                                    ;
                                    document.querySelector('head').innerHTML += vm.data.json_ld;
                                    console.log(`(vm.data as any).json_ld=>`, vm.data.json_ld);
                                }
                                catch (e) {
                                    vm.data = {};
                                }
                            }
                            if (dataArray[2].result && dataArray[2].response.data) {
                                vm.wishStatus = dataArray[2].response.data.some((item) => item.id === vm.data.id);
                            }
                            loadings.page = false;
                            gvc.notifyDataChange(ids.page);
                        });
                    }
                }
            },
        });
    }
}
ProductDetail.titleFontColor = '';
window.glitter.setModule(import.meta.url, ProductDetail);
