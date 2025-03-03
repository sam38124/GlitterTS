import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { PdClass, Product_l, FileList } from './pd-class.js';
import { Language } from '../../glitter-base/global/language.js';
import { UmClass } from '../user-manager/um-class.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';

/*
 * Page: product_show_widget
 */

const html = String.raw;

export class ProductDetail {
    public static titleFontColor: string = '';

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
                                style="align-self: stretch; text-align: center; color: ${ProductDetail.titleFontColor}; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word;white-space: nowrap;margin: 0 20px;"
                                onclick="${gvc.event(() => {
                                    callback(dd.key);
                                })}"
                            >
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px; border: 1px ${ProductDetail.titleFontColor} solid"></div>
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
        ProductDetail.titleFontColor = gvc.glitter.share.globalValue['theme_color.0.title'] ?? '#333333';
        const css = String.raw;
        const product_id = gvc.glitter.getUrlParameter('product_id');

        //移除所有查詢
        const url = new URL(location.href);
        for (const b of url.searchParams.keys()) {
            if (b !== 'appName') {
                gvc.glitter.setUrlParameter(b, undefined);
            }
        }
        const glitter = gvc.glitter;

        const vm = {
            data: {} as Product_l,
            content_manager: [] as FileList,
            content_tag: 'default' as string,
            specs: [] as string[],
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
            return html` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto mt-5">
                <div class="spinner-border" role="status"></div>
                <span class="mt-3">${Language.text('loading')}</span>
            </div>`;
        }

        return gvc.bindView({
            bind: ids.page,
            view: async () => {
                if (loadings.page) {
                    return spinner();
                }
                if (Object.keys(vm.data).length === 0) {
                    return html` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
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
                const d_: any = (prod.collection ?? []).sort((a: any, b: any) => {
                    // 計算每個字串中 `/` 的數量
                    const countSlashes = (str: any) => (str.match(/\//g) || []).length;
                    return countSlashes(b) - countSlashes(a);
                });
                const collections = await ApiShop.getCollection();

                function getCollectionLink(title: string) {
                    let domain = '';

                    function loop(array: any) {
                        for (const b of array) {
                            if (b.title === title) {
                                domain = (b.language_data && b.language_data[Language.getLanguage()] && b.language_data[Language.getLanguage()].seo.domain) || b.code;
                                title = (b.language_data && b.language_data[Language.getLanguage()] && b.language_data[Language.getLanguage()].title) || title;
                                break;
                            } else if (b.array) {
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
                    d_[0].split(' / ').map((dd: any) => {
                        book_mark.push(getCollectionLink(dd));
                    });
                }

                return html` <div class="mx-auto pb-5" style="max-width:1100px;word-break: break-all;white-space: normal;">
                    <div class="breadcrumb mb-0 d-flex align-items-center py-3" style="cursor:pointer; gap:10px;">
                        ${book_mark
                            .map((dd) => {
                                return html` <li
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
                        ${gvc.bindView(
                            (() => {
                                const id = glitter.getUUID();
                                const commentCount = vm.data.content.comments?.length ?? 0;
                                const maxDisplayCount = Math.min(commentCount, 15);

                                return {
                                    bind: id,
                                    view: () => {
                                        return this.tab(
                                            [
                                                {
                                                    title: Language.text('product_description'),
                                                    key: 'default',
                                                },
                                                ...((window as any).store_info.customer_comment) ? [
                                                    {
                                                        title: `${Language.text('customer_reviews')} (${maxDisplayCount})`,
                                                        key: 'comment',
                                                    }
                                                ]:[]
                                            ].concat(
                                                vm.content_manager
                                                    .filter((cont) => {
                                                        return prod.content_array.includes(cont.id);
                                                    })
                                                    .map((cont) => {
                                                        return {
                                                            title: cont.title,
                                                            key: cont.id,
                                                        };
                                                    })
                                            ),
                                            gvc,
                                            vm.content_tag,
                                            (text) => {
                                                vm.content_tag = text;
                                                gvc.notifyDataChange(id);
                                                gvc.notifyDataChange(ids.content);
                                            },
                                            `overflow: auto; ${document.body.clientWidth > 768 ? '' : 'justify-content: flex-start;'}`
                                        );
                                    },
                                    divCreate: {
                                        class: `pt-3 w-100`,
                                    },
                                };
                            })()
                        )}
                        ${gvc.bindView({
                            bind: ids.content,
                            view: () => {
                                if (vm.content_tag === 'default') {
                                    return prod.content;
                                }
                                if (vm.content_tag === 'comment') {
                                    UmClass.addStyle(gvc);
                                    const addCommentDialog = () => {
                                        if (!glitter.share.GlobalUser.token) {
                                            PdClass.jumpAlert({
                                                gvc,
                                                text: Language.text('login_required'),
                                                justify: 'top',
                                                align: 'center',
                                                width: 200,
                                            });
                                            return;
                                        }
                                        return UmClass.dialog({
                                            gvc,
                                            tag: '',
                                            title: '撰寫評論',
                                            innerHTML: (gvcd) => {
                                                const postData = {
                                                    product_id: vm.data.id,
                                                    rate: 5,
                                                    title: '',
                                                    comment: '',
                                                };
                                                return html`
                                                    <div class="mt-1">
                                                        <div class="tx_normal fw-normal mb-1">${Language.text('rating')}</div>
                                                        ${gvcd.bindView(
                                                            (() => {
                                                                const id = glitter.getUUID();
                                                                function setRate(rate: number) {
                                                                    postData.rate = rate;
                                                                    gvcd.notifyDataChange(id);
                                                                }
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        return [...new Array(5)]
                                                                            .fill('')
                                                                            .map((_, index) => {
                                                                                return html` <div class="rating-item">
                                                                                    ${postData.rate > index
                                                                                        ? html`<i
                                                                                              class="fa-solid fa-star fs-4"
                                                                                              style="cursor: pointer"
                                                                                              onclick="${gvcd.event(() => {
                                                                                                  setRate(index + 1);
                                                                                              })}"
                                                                                          ></i>`
                                                                                        : html`<i
                                                                                              class="fa-regular fa-star fs-4"
                                                                                              style="cursor: pointer"
                                                                                              onclick="${gvcd.event(() => {
                                                                                                  setRate(index + 1);
                                                                                              })}"
                                                                                          ></i>`}
                                                                                </div>`;
                                                                            })
                                                                            .join('');
                                                                    },
                                                                    divCreate: {
                                                                        class: 'd-flex mt-1',
                                                                    },
                                                                };
                                                            })()
                                                        )}
                                                    </div>
                                                    <div class="mt-2">
                                                        <div class="tx_normal fw-normal mb-1">${Language.text('title')}</div>
                                                        <input
                                                            class="bgw-input"
                                                            type="text"
                                                            oninput="${gvcd.event((e) => {
                                                                postData.title = e.value;
                                                            })}"
                                                        />
                                                    </div>
                                                    <div class="mt-2">
                                                        <div class="tx_normal fw-normal mb-1">${Language.text('comment')}</div>
                                                        <textarea
                                                            class="bgw-input"
                                                            rows="3"
                                                            oninput="${gvcd.event((e) => {
                                                                postData.comment = e.value;
                                                            })}"
                                                        ></textarea>
                                                    </div>
                                                    <div class="d-flex justify-content-end mt-2 mb-1">
                                                        <div
                                                            class="um-solid-btn"
                                                            onclick="${gvcd.event(() => {
                                                                if (postData.title === '' || postData.comment === '') {
                                                                    PdClass.jumpAlert({
                                                                        gvc,
                                                                        text: Language.text('complete_form'),
                                                                        justify: 'top',
                                                                        align: 'center',
                                                                        width: 200,
                                                                    });
                                                                    return;
                                                                }
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.dataLoading({ visible: true });
                                                                ApiShop.postComment(postData).then(() => {
                                                                    gvcd.closeDialog();
                                                                    dialog.dataLoading({ visible: false });
                                                                    loadings.page = true;
                                                                    gvc.notifyDataChange(ids.page);
                                                                });
                                                            })}"
                                                        >
                                                            ${Language.text('submit')}
                                                        </div>
                                                    </div>
                                                `;
                                            },
                                        });
                                    };
                                    const commentList = () => {
                                        if (!vm.data.content.comments || vm.data.content.comments.length === 0) {
                                            return html`<h3 style="margin: 60px 0;">尚無顧客評論</h3>`;
                                        }
                                        return vm.data.content.comments
                                            .sort((a, b) => {
                                                return a.date > b.date ? -1 : 1;
                                            })
                                            .slice(0, 15)
                                            .map((item) => {
                                                return html`<div style="padding: 20px; min-width: ${document.body.clientWidth > 768 ? '780px' : `calc(${document.body.clientWidth}px - 1.5rem)`};">
                                                    <div class="row">
                                                        <div class="col-12 col-md">
                                                            <div class="row mb-6">
                                                                <div class="col-12">
                                                                    <!-- Rating -->
                                                                    <div class="rating fs-sm text-dark d-flex">
                                                                        ${[...new Array(5)]
                                                                            .fill('')
                                                                            .map((_, index) => {
                                                                                return html` <div class="rating-item">
                                                                                    ${item.rate > index ? html`<i class="fa-solid fa-star"></i>` : html`<i class="fa-regular fa-star"></i>`}
                                                                                </div>`;
                                                                            })
                                                                            .join('')}
                                                                    </div>
                                                                </div>
                                                                <div class="col-12">
                                                                    <!-- Time -->
                                                                    <span class="fs-xs text-muted"> ${item.userName}, <time datetime="${item.date}">${item.date}</time> </span>
                                                                </div>
                                                            </div>
                                                            <!-- Title -->
                                                            <p class="mb-2 fs-lg fw-bold">${item.title}</p>
                                                            <!-- Text -->
                                                            <p class="text-gray-500">${item.comment.replace(/\n/g, '<br/>')}</p>
                                                        </div>
                                                    </div>
                                                </div>`;
                                            })
                                            .join('');
                                    };
                                    return html` <div class="d-flex justify-content-center">
                                            <div
                                                class="um-solid-btn"
                                                onclick="${gvc.event(() => {
                                                    addCommentDialog();
                                                })}"
                                            >
                                                ${Language.text('write_comment')}
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column gap-2">${commentList()}</div>`;
                                }
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
                                                style="font-size: ${cssStyle?.font_size ?? 16}px; color: ${cssStyle?.font_color ?? '${titleFontColor}'}; background: ${cssStyle?.font_bgr ?? '#fff'};"
                                                >${data.value}</span
                                            >`
                                        );
                                    });
                                }
                                return htmlString.replace(/@{{[^}]+}}/g, '');
                            },
                            divCreate: {
                                style:
                                    (() => {
                                        if (PdClass.isPad()) {
                                            return 'margin: 0 60px;';
                                        }
                                        if (PdClass.isPhone()) {
                                            return '';
                                        }
                                        return 'margin: 0 10%;';
                                    })() + `max-width:100%;word-break: break-all;white-space: normal;`,
                                class: `pd_detail_content fr-view`,
                            },
                        })}
                    </div>
                    <div style="margin-top: 150px;"></div>
                    ${(prod.relative_product ?? []).length
                        ? gvc.bindView(() => {
                              const swipID = gvc.glitter.getUUID();
                              return {
                                  bind: gvc.glitter.getUUID(),
                                  view: async () => {
                                      return new Promise(async (resolve, reject) => {
                                          const product = (
                                              await ApiShop.getProduct({
                                                  limit: 50,
                                                  page: 0,
                                                  id_list: prod.relative_product.join(','),
                                              })
                                          ).response.data;
                                          setTimeout(() => {
                                              const swiper = new (window as any).Swiper('#' + swipID, {
                                                  slidesPerView: glitter.ut.frSize(
                                                      {
                                                          sm: product.length < 4 ? product.length : 4,
                                                          lg: product.length < 6 ? product.length : 6,
                                                      },
                                                      product.length < 2 ? product.length : 2
                                                  ),
                                                  spaceBetween: glitter.ut.frSize(
                                                      {
                                                          sm: 10,
                                                          lg: 30,
                                                      },
                                                      10
                                                  ),
                                              });
                                          }, 100);
                                          if (!product.length) {
                                              return ``;
                                          }
                                          resolve(html`
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
                                              <div class="w-100 row p-0 align-items-center justify-content-center mt-4 mt-lg-4 mx-0">
                                                  ${product
                                                      .map((dd: any) => {
                                                          return html`<div class="col-6 col-sm-4 col-lg-3">
                                                              ${glitter.htmlGenerate.renderComponent({
                                                                  appName: (window as any).appName,
                                                                  tag: 'product_widget',
                                                                  gvc: gvc,
                                                                  subData: dd,
                                                              })}
                                                          </div>`;
                                                      })
                                                      .join('')}
                                              </div>
                                          `);
                                      });
                                  },
                                  divCreate: {
                                      class: `w-100`,
                                  },
                                  onCreate: () => {},
                              };
                          })
                        : ''}
                    <div style="margin-top: 100px;"></div>
                </div>`;
            },
            divCreate: {
                style: css`min-height: 1000px;word-break: break-all;white-space: normal;`,class:`container`
            },
            onCreate: () => {
                if (loadings.page) {
                    const title = glitter.getUrlParameter('page').split('products/')[1];
                    if (title || product_id) {
                        const inputObj = {
                            page: 0,
                            limit: 1,
                            collection: '',
                            maxPrice: '',
                            minPrice: '',
                            ...(() => {
                                if (product_id) {
                                    return { id: product_id };
                                } else {
                                    return { domain: decodeURIComponent(title) };
                                }
                            })(),
                            status: 'inRange',
                            channel: 'normal',
                            orderBy: '',
                            with_hide_index: 'true',
                            show_hidden: true,
                            view_source: 'normal',
                            distribution_code: localStorage.getItem('distributionCode') ?? '',
                        };

                        Promise.all([
                            // 商品描述
                            ApiUser.getPublicConfig('text-manager', 'manager', (window as any).appName),
                            // 商品詳細資料
                            ApiShop.getProduct(inputObj),
                            // 心願單
                            ApiShop.getWishList(),
                        ]).then((results) => {
                            const [publicConfig, productData, wishListData] = results;

                            if (publicConfig.result && publicConfig.response.value) {
                                vm.content_manager = publicConfig.response.value;
                            }
                            if (productData.result && productData.response.data) {
                                try {
                                    if (Array.isArray(productData.response.data)) {
                                        vm.data = productData.response.data[0];
                                    } else {
                                        vm.data = productData.response.data;
                                    }
                                    glitter.setUrlParameter(
                                        'page',
                                        'products/' + encodeURIComponent(vm.data.content.seo.domain || vm.data.content.title),
                                        [(window as any).home_seo.title_prefix ?? '', vm.data.content.seo.domain || vm.data.content.title, (window as any).home_seo.title_suffix ?? ''].join('')
                                    );
                                    //如有原先的JSON LD
                                    // setTimeout(()=>{
                                    //     const json_ld = document.querySelector('script[type="application/ld+json"]');
                                    //     if (json_ld) {
                                    //         json_ld.remove();
                                    //     };
                                    //     (document.querySelector('head') as any).innerHTML += (vm.data as any).json_ld;
                                    // },1000)
                                } catch (e) {
                                    (vm.data as any) = {};
                                }
                            }
                            if (wishListData.result && wishListData.response.data) {
                                vm.wishStatus = wishListData.response.data.some((item: Product_l) => item.id === vm.data.id);
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

(window as any).glitter.setModule(import.meta.url, ProductDetail);
