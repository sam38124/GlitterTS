import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { Tool } from '../../modules/tool.js';
import { PdClass } from './pd-class.js';
import { Ad } from '../public/ad.js';
import { Language } from '../../glitter-base/global/language.js';

/*
 * Page: sy01_pd_collection
 */

const html = String.raw;

type Product = {
    id: number;
    content: {
        collection: string[];
    };
};
interface LanguageData {
    title: string;
    seo: {
        domain: string;
        title: string;
        content: string;
    };
}
type Collection = {
    title: string;
    code: string;
    array: Collection[];
    product_id: number[];
    parentTitles: string[];
    subCollections: string[];
    allCollections: string[];
    seo_title: string;
    seo_content: string;
    seo_image: string;
    checked: boolean;
    language_data: LanguageData;
};

export class ProductList {
    static arrowDownDataImage(color: string): string {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='${color}'%3e%3cpath d='M225.813 48.907L128 146.72 30.187 48.907 0 79.093l128 128 128-128z'/%3e%3c/svg%3e"`;
    }

    static openBoxContainer(obj: {
        gvc: GVC;
        tag: string;
        title: string;
        code: string;
        insideHTML: string;
        length: number;
        changePage: any;
        fontColor: string;
        autoClose?: boolean;
        guideClass?: string;
        openOnInit?: boolean;
    }): string {
        const text = Tool.randomString(5);
        const height = (document.body.clientWidth > 768 ? 56 : 59) * (obj.length + 1);
        const closeHeight = 56;

        obj.gvc.addStyle(`
            .box-item:hover {
                background-color: #f5f5f5;
            }
            .box-container-${text} {
                position: relative;
                height: ${closeHeight}px;
                overflow-y: hidden;
                transition: height 0.3s ease-out;
            }
            .box-container-${text}.open-box {
                max-height: ${height}px;
                height: ${height}px;
                overflow-y: auto;
            }
            .box-navbar-${text} {
                position: sticky;
                top: 0;
                min-height: 20px;
                z-index: 10;
                display: flex;
                padding: 16px;
                align-items: flex-start;
                justify-content: space-between;
                cursor: pointer;
            }
            .arrow-icon-${text} {
                color: #393939 !important;
                box-shadow: none !important;
                background-color: #fff !important;
                background-image: url(${this.arrowDownDataImage('#000')}) !important;
                background-repeat: no-repeat;
                cursor: pointer;
                height: 1rem;
                border: 0;
                margin-top: 0.35rem;
                transition: transform 0.3s;
            }
            .arrow-icon-${text}.open-box {
                margin-top: 0.15rem;
                transform: rotate(180deg);
            }
            .box-inside-${text} {
                padding: 0 1.5rem 1.5rem;
                overflow-y: auto;
            }

            @media (max-width: 768px) {
                .box-inside-${text} {
                    padding: 0 1rem 0.5rem;
                    overflow-x: hidden;
                }
            }
        `);
        return html` <div class="box-tag-${obj.tag} box-container-${text} ${obj.openOnInit ? `open-box` : ''}">
            <div
                class="box-navbar-${text} ${obj.guideClass ?? ''}"
                onclick="${obj.gvc.event((e) => {
                    if (!obj.autoClose) {
                        const boxes = document.querySelectorAll(`.box-tag-${obj.tag}`);
                        boxes.forEach((box: any) => {
                            const isOpening = box.classList.contains('open-box');
                            const isSelf = box.classList.contains(`box-container-${text}`) || box.classList.contains(`arrow-icon-${text}`);
                            if (isOpening && !isSelf) {
                                box.classList.remove('open-box');
                                if (box.tagName === 'DIV') {
                                    box.style.height = `${closeHeight}px`;
                                }
                            }
                        });
                    }
                    setTimeout(() => {
                        e.parentElement.classList.toggle('open-box');
                        e.parentElement.querySelector(`.arrow-icon-${text}`).classList.toggle('open-box');
                        const container = window.document.querySelector(`.box-container-${text}`) as any;
                        if (e.parentElement.classList.contains('open-box')) {
                            const si = setInterval(() => {
                                const inside = window.document.querySelector(`.box-inside-${text}`) as any;
                                if (inside) {
                                    const insideHeight = inside.clientHeight;
                                    if (insideHeight + closeHeight < height) {
                                        container.style.height = `${insideHeight + closeHeight + 20}px`;
                                    } else {
                                        container.style.height = `${height}px`;
                                    }
                                    clearInterval(si);
                                }
                            }, 100);
                        } else {
                            container.style.height = `${closeHeight}px`;
                        }
                    }, 50);
                })}"
            >
                <div
                    class="d-flex tx_700"
                    style="color: ${obj.fontColor};"
                    onclick="${obj.gvc.event(() => {
                        obj.changePage('collections/' + obj.code, 'page', {});
                        obj.gvc.glitter.closeDrawer();
                    })}"
                >
                    ${obj.title}
                </div>
                <div class="d-flex">
                    <button class="box-tag-${obj.tag} arrow-icon-${text}"></button>
                </div>
            </div>
            <div class="box-inside-${text} ${obj.guideClass ? `box-inside-${obj.guideClass}` : ''} ">${obj.insideHTML}</div>
        </div>`;
    }

    static spinner() {
        return html`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
            <div class="spinner-border" role="status"></div>
            <span class="mt-3">${Language.text('loading')}</span>
        </div>`;
    }

    static pageSplitV2 = (gvc: GVC, countPage: number, nowPage: number, callback: (p: number) => void) => {
        const generator = (n: number) => {
            return html`<li class="page-item my-0 mx-0">
                <div class="page-link-v2" onclick="${gvc.event(() => callback(n))}">${n}</div>
            </li>`;
        };
        const glitter = gvc.glitter;

        let vm = {
            id: glitter.getUUID(),
            loading: false,
            dataList: <any>[],
        };

        gvc.addStyle(`
            .page-link-v2 {
                display: inline-flex;
                height: 32px;
                padding: 10px;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                background: #fff;
                border:1px solid #393939;
                color: #393939;
            }

            .page-link-prev {
                border-radius: 7px 0px 0px 7px;
                border: 1px solid #d8d8d8;
                background: #fff;
                color: #393939;
            }

            .page-link-next {
                border-radius: 0px 7px 7px 0px;
                border: 1px solid #d8d8d8;
                background: #fff;
                color: #393939;
            }

            .page-link-active {
                background: #393939;
                color: #fff;
            }

            .angle-style {
                font-size: 12px;
                color: #d8d8d8;
            }
        `);

        return gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return html`<div class="w-100 d-flex align-items-center justify-content-center p-3">
                        <div class="spinner-border"></div>
                    </div>`;
                } else {
                    return html`
                        <nav class="d-flex my-3 justify-content-center">
                            <ul class="pagination pagination-rounded mb-0">
                                <li class="page-item me-0">
                                    <div
                                        class="page-link-v2 page-link-prev"
                                        aria-label="Previous"
                                        style="cursor:pointer"
                                        onclick="${gvc.event(() => {
                                            nowPage - 1 > 0 && callback(nowPage - 1);
                                        })}"
                                    >
                                        <i class="fa-solid fa-angle-left angle-style"></i>
                                    </div>
                                </li>
                                ${glitter.print(() => {
                                    if (nowPage - 2 > 0) {
                                        return generator(nowPage - 2) + generator(nowPage - 1);
                                    } else if (nowPage - 1 > 0) {
                                        return generator(nowPage - 1);
                                    } else {
                                        return ``;
                                    }
                                })}
                                <li class="page-item active mx-0" style="border-radius: 100%">
                                    <div class="page-link-v2 page-link-active">${nowPage}</div>
                                </li>
                                ${glitter.print(() => {
                                    if (nowPage + 2 <= countPage) {
                                        return generator(nowPage + 1) + generator(nowPage + 2);
                                    } else if (nowPage + 1 <= countPage) {
                                        return generator(nowPage + 1);
                                    } else {
                                        return ``;
                                    }
                                })}
                                <li class="page-item ms-0">
                                    <div
                                        class="page-link-v2 page-link-next"
                                        aria-label="Next"
                                        style="cursor:pointer"
                                        onclick="${gvc.event(() => {
                                            nowPage + 1 <= countPage && callback(nowPage + 1);
                                        })}"
                                    >
                                        <i class="fa-solid fa-angle-right angle-style"></i>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    `;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (vm.loading) {
                    vm.loading = false;
                    gvc.notifyDataChange(vm.id);
                }
            },
        });
    };

    static main(gvc: GVC, widget: any, subData: any) {
        const glitter = gvc.glitter;

        const vm: any = {
            title: '',
            dataList: [],
            query: '',
            allParents: [],
            collections: [],
            pageIndex: 1,
            pageSize: 1,
            limit: 16,
        };

        const ids = {
            product: glitter.getUUID(),
            pageTitle: glitter.getUUID(),
        };

        const loadings = {
            product: true,
        };

        const fontColor = glitter.share.globalValue['theme_color.0.title'] ?? '#333333';

        gvc.addStyle(`
            .filter-btn {
                white-space: nowrap;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 8px 12px;
                border-radius: none !important;
                background-color: black;
                border-radius: 5px;
                background: ${glitter.share.globalValue['theme_color.0.solid-button-bg']};
                color: ${glitter.share.globalValue['theme_color.0.solid-button-text']};
                font-size: 16px;
            }
        `);

        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = (index: string, type: 'page' | 'home', subData: any) => {
                gvc.glitter.setUrlParameter('ai-search', undefined);
                cl.changePage(index, type, subData);
            };
        });

        function updateCollections(data: { products: Product[]; collections: Collection[] }): Collection[] {
            const findCollection = (collections: Collection[], path: string[]): Collection | undefined => {
                let currentCollections = collections;
                let currentCollection: Collection | undefined;

                for (const title of path) {
                    currentCollection = currentCollections.find((col) => col.title === title);
                    if (!currentCollection) return undefined;
                    currentCollections = currentCollection.array;
                }

                return currentCollection;
            };

            const addProductToCollection = (collection: Collection, productId: number) => {
                if (!collection.product_id) {
                    collection.product_id = [];
                }
                if (!collection.product_id.includes(productId)) {
                    collection.product_id.push(productId);
                }
            };

            const flattenCollections = (collections: Collection[], parentTitles: string[] = [], topLevelCollections: string[] = []): Collection[] => {
                let flattened: Collection[] = [];
                collections.forEach((col) => {
                    const { title, array, product_id, seo_title, seo_content, seo_image, code, language_data } = col;
                    const flattenedCol: Collection = {
                        title: (() => {
                            if (language_data && (language_data as any)[Language.getLanguage()] && (language_data as any)[Language.getLanguage()].title) {
                                return (language_data as any)[Language.getLanguage()].title;
                            } else {
                                return title;
                            }
                        })(),
                        array: [],
                        product_id: product_id ?? [],
                        checked: false,
                        parentTitles: parentTitles.length ? [...parentTitles] : [],
                        allCollections: parentTitles.length ? [...topLevelCollections] : [],
                        subCollections: array.map((subCol) =>
                            (() => {
                                const language_data = subCol.language_data;
                                if (language_data && (language_data as any)[Language.getLanguage()] && (language_data as any)[Language.getLanguage()].title) {
                                    return (language_data as any)[Language.getLanguage()].title;
                                } else {
                                    return subCol.title;
                                }
                            })()
                        ),
                        seo_title: seo_title,
                        seo_content: seo_content,
                        seo_image: seo_image,
                        code: (() => {
                            if (language_data && (language_data as any)[Language.getLanguage()] && (language_data as any)[Language.getLanguage()].title) {
                                return (language_data as any)[Language.getLanguage()].seo.domain;
                            } else {
                                return code;
                            }
                        })(),
                        language_data: language_data,
                    };
                    if (
                        flattenedCol.title.includes(vm.query) ||
                        flattenedCol.parentTitles.find((title) => {
                            return title.includes(vm.query);
                        }) ||
                        flattenedCol.subCollections.find((title) => {
                            return title.includes(vm.query);
                        })
                    ) {
                        flattened.push(flattenedCol);
                    }
                    if (array.length) {
                        flattened = flattened.concat(
                            flattenCollections(
                                array,
                                [
                                    ...parentTitles,
                                    (() => {
                                        if (language_data && (language_data as any)[Language.getLanguage()] && (language_data as any)[Language.getLanguage()].title) {
                                            return (language_data as any)[Language.getLanguage()].title;
                                        } else {
                                            return title;
                                        }
                                    })(),
                                ],
                                topLevelCollections
                            )
                        );
                    }
                });
                return flattened;
            };

            data.products.forEach((product) => {
                product.content.collection.forEach((category) => {
                    const path = category.split('/').map((item) => {
                        return item.replace(/\s/g, '');
                    });
                    for (let i = 0; i < path.length; i++) {
                        const subPath = path.slice(0, i + 1);
                        const collection = findCollection(data.collections, subPath);
                        if (collection) {
                            addProductToCollection(collection, product.id);
                        }
                    }
                });
            });

            const topLevelCollections = data.collections.map((col) =>
                (() => {
                    const language_data = col.language_data;
                    if (language_data && (language_data as any)[Language.getLanguage()] && (language_data as any)[Language.getLanguage()].title) {
                        return (language_data as any)[Language.getLanguage()].title;
                    } else {
                        return col.title;
                    }
                })()
            );
            return flattenCollections(data.collections, [], topLevelCollections);
        }

        function extractCategoryTitleFromUrl(url: string) {
            const urlParts = url.split('/');
            const collectionIndex = urlParts.indexOf('collections');

            if (collectionIndex !== -1 && collectionIndex < urlParts.length - 1) {
                return urlParts[collectionIndex + 1].split('/')[0].split('?')[0];
            } else {
                return '';
            }
        }

        async function getProductList() {
            const orderByParam = glitter.getUrlParameter('order_by');
            const page = parseInt(`${vm.pageIndex}`, 10) - 1;
            const limit = vm.limit;
            const collection = extractCategoryTitleFromUrl(location.href);
            if (collection) {
                gvc.glitter.setUrlParameter('search', undefined);
            }
            const titleMatch = gvc.glitter.getUrlParameter('search');
            const maxPrice = '';
            const minPrice = '';
            const orderBy = orderByParam ?? '';
            const inputObj = {
                page: page as any,
                limit: limit as any,
                collection: collection as string,
                maxPrice: maxPrice as string,
                minPrice: minPrice as string,
                search: titleMatch as string,
                status: 'inRange',
                channel: 'normal',
                orderBy: orderBy as string,
                with_hide_index: 'false',
                id_list: gvc.glitter.getUrlParameter('ai-search') || undefined,
            };
            return new Promise<[]>((resolve, reject) => {
                ApiShop.getProduct(inputObj).then((data) => {
                    try {
                        vm.pageSize = Math.ceil(data.response.total / parseInt(limit as any, 10));
                        if (parseInt(`${vm.pageIndex}`, 10) >= data.response.data.pageSize) {
                            vm.pageIndex = vm.pageSize - 1;
                        }
                        resolve(data.response.data);
                    } catch (error) {
                        resolve([]);
                    }
                });
            });
        }

        function getCollectionHTML() {
            return gvc.bindView(
                (() => {
                    const id = glitter.getUUID();
                    let loading = true;
                    return {
                        bind: id,
                        view: () => {
                            if (loading) {
                                return ProductList.spinner();
                            } else {
                                const cols = vm.collections.filter((item: any) => {
                                    return item.parentTitles.length === 0;
                                });
                                return html`<ul class="border navbar-nav me-auto mb-2 mb-lg-0">
                                    <li class="border-bottom" style="padding: 16px; cursor: pointer;">
                                        <div
                                            class="d-flex tx_700"
                                            style="color: ${fontColor};"
                                            onclick="${gvc.event(() => {
                                                changePage('all-product', 'page', {});
                                                gvc.glitter.closeDrawer();
                                            })}"
                                        >
                                            ${(() => {
                                                if (gvc.glitter.getUrlParameter('ai-search')) {
                                                    return Language.text('ai_choose');
                                                } else if (gvc.glitter.getUrlParameter('search')) {
                                                    return `${Language.text('search')}: ${gvc.glitter.getUrlParameter('search')}`;
                                                } else {
                                                    return Language.text('all_products');
                                                }
                                            })()}
                                        </div>
                                    </li>
                                    ${cols
                                        .map((item: any, index: number) => {
                                            let subHTML = '';
                                            if (item.subCollections.length > 0) {
                                                for (const col of vm.collections) {
                                                    if (item.subCollections.includes(col.title) && col.parentTitles[0] === item.title) {
                                                        subHTML += html`<ul
                                                            class="mt-1 pt-2 mx-n4 px-4 mb-n2 pb-2 box-item"
                                                            style="${decodeURIComponent((glitter.getUrlParameter('page') || '').split('/').reverse()[0]) === (col.code || col.title)
                                                                ? `background:#f5f5f5;`
                                                                : ``}"
                                                            onclick="${gvc.event(() => {
                                                                changePage(`collections/${col.code || col.title}`, 'page', {});
                                                                gvc.glitter.closeDrawer();
                                                            })}"
                                                        >
                                                            <li style="font-weight: 500; line-height: 40px;">
                                                                <div class="d-flex tx_700" style="color: ${fontColor};">${col.title}</div>
                                                            </li>
                                                        </ul>`;
                                                    }
                                                }
                                            }
                                            
                                            return html` <li
                                                class="${index + 1 === cols.length ? '' : 'border-bottom'}"
                                                style="${item.subCollections.length > 0 ? '' : 'padding: 16px;'} cursor: pointer;"
                                            >
                                                ${item.subCollections.length > 0
                                                    ? ProductList.openBoxContainer({
                                                          gvc,
                                                          tag: 'collection-box',
                                                          title: item.title,
                                                          code: item.code,
                                                          insideHTML: subHTML,
                                                          length: item.subCollections.length,
                                                          changePage,
                                                          fontColor,
                                                          openOnInit: [item.code]
                                                              .concat(
                                                                  vm.collections
                                                                      .filter((col: any) => {
                                                                          return item.subCollections.includes(col.title) && col.parentTitles[0] === item.title;
                                                                      })
                                                                      .map((dd: any) => {
                                                                          return dd.code || dd.title;
                                                                      })
                                                              )
                                                              .includes(decodeURIComponent((glitter.getUrlParameter('page') || '').split('/').reverse()[0])),
                                                      })
                                                    : html`<div
                                                          class="d-flex tx_700"
                                                          style="color: ${fontColor};"
                                                          onclick="${gvc.event(() => {
                                                              changePage('collections/' + item.code, 'page', {});
                                                              gvc.glitter.closeDrawer();
                                                          })}"
                                                      >
                                                          ${item.title}
                                                      </div>`}
                                            </li>`;
                                        })
                                        .join('')}
                                </ul>`;
                            }
                        },
                        divCreate: {
                            style: 'position: sticky; top: 7.5rem;',
                        },
                        onCreate: () => {
                            if (loading) {
                                ApiShop.getCollection().then((data: any) => {
                                    if (data.result && data.response.value.length > 0) {
                                        setAdTag(data.response.value);
                                        vm.allParents = ['(無)'].concat(data.response.value.map((item: { title: string }) => item.title));
                                        vm.collections = updateCollections({
                                            products: [],
                                            collections: data.response.value,
                                        });
                                        updatePageTitle();
                                    }
                                    loading = false;
                                    gvc.notifyDataChange(id);
                                });
                            }
                        },
                    };
                })()
            );
        }

        function updatePageTitle() {
            const all_text = (() => {
                if (gvc.glitter.getUrlParameter('ai-search')) {
                    return Language.text('ai_choose');
                } else if (gvc.glitter.getUrlParameter('search')) {
                    return `${Language.text('search')}: ${gvc.glitter.getUrlParameter('search')}`;
                } else {
                    return Language.text('all_products');
                }
            })();
            if (!vm.collections || vm.collections.length === 0) {
                vm.title = all_text;
            } else {
                let collectionObj = vm.collections.find((item: any) => {
                    const language_data = item.language_data && item.language_data[Language.getLanguage()];
                    const code = (language_data && language_data.seo && language_data.seo.domain) || item.code || (language_data && language_data.title) || item.title;
                    return code === decodeURIComponent(extractCategoryTitleFromUrl(location.href));
                });
                try {
                    if (!collectionObj) {
                        collectionObj = vm.collections.find((item: { code: string; title: string }) => {
                            return item.title === decodeURIComponent(extractCategoryTitleFromUrl(location.href));
                        });
                    }
                } catch (e) {}
                if (collectionObj) {
                    const language_data = collectionObj.language_data;
                    vm.title = (language_data && language_data[Language.getLanguage()] && language_data[Language.getLanguage()].title) || collectionObj.title;
                } else {
                    vm.title = all_text;
                }
            }
            gvc.notifyDataChange(ids.pageTitle);
        }

        function setAdTag(data: any) {
            try {
                const path = location.pathname;
                const pathParts = path.split('/');
                const collectionIndex = pathParts.indexOf('collections');
                const index = collectionIndex + 1;
                const collection = pathParts[index];
                const collectionName = decodeURIComponent(collection);

                function findObjectByValue(arr: any, value: string): any {
                    for (const item of arr) {
                        const language_data = item.language_data;
                        const code =
                            (language_data && language_data[Language.getLanguage()] && language_data[Language.getLanguage()].seo && language_data[Language.getLanguage()].seo.domain) || item.code;
                        if (code === value) {
                            return item;
                        }
                        if (item.array.length > 0) {
                            const found = findObjectByValue(item.array, value);
                            if (found) {
                                return found;
                            }
                        }
                    }
                    return null;
                }

                if ((window as any).gtag) {
                    if (collectionName) {
                        Ad.gtagEvent('view_item_list', {
                            items: [
                                {
                                    item_id: collectionName,
                                    item_name: collectionName,
                                },
                            ],
                        });
                        Ad.fbqEvent('ViewContent', {
                            content_ids: [collectionName],
                            content_type: 'product_group',
                        });
                    } else {
                        Ad.gtagEvent('view_item_list', {
                            items: [
                                {
                                    item_id: 'all-product',
                                    item_name: '所有商品',
                                },
                            ],
                        });
                        Ad.fbqEvent('ViewContent', {
                            content_ids: ['all-product'],
                            content_type: 'product_group',
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }

        return html`
            <div class="container d-flex mt-2" style="min-height: 1000px;">
                <div
                    class="d-none d-sm-block mt-4"
                    style="${(() => {
                        if (PdClass.isPad()) {
                            return `width: 180px; min-width: 180px;`;
                        }
                        return `width: 282px; min-width: 282px;`;
                    })()}"
                >
                    ${getCollectionHTML()}
                </div>
                <div class="flex-fill my-4 mx-1 mx-md-5">
                    ${document.body.clientWidth > 768
                        ? ''
                        : html`<div class="fw-500 fw-bold" style="font-size: 24px; color: ${fontColor}; text-align: center; margin-bottom: 20px;">
                              ${gvc.bindView({
                                  bind: ids.pageTitle,
                                  view: () => vm.title,
                              })}
                          </div>`}
                    <div class="d-flex justify-content-between mb-3">
                        ${document.body.clientWidth > 768
                            ? html`<div class="fw-500" style="font-size: 24px; color: ${fontColor}">
                                  ${gvc.bindView({
                                      bind: ids.pageTitle,
                                      view: () => vm.title,
                                  })}
                              </div>`
                            : html`<button
                                  class="filter-btn"
                                  onclick="${gvc.event(() => {
                                      glitter.setDrawer(
                                          html`<div class="p-3">
                                              <div class="fw-500 mb-3" style="font-size: 24px; color: ${fontColor}">${Language.text('product_categories')}</div>
                                              ${getCollectionHTML()}
                                          </div>`,
                                          () => {
                                              gvc.glitter.openDrawer();
                                          }
                                      );
                                  })}"
                              >
                                  <i class="fa-regular fa-filter-list me-1"></i>
                                  ${Language.text('filter')}
                              </button>`}
                        <select
                            class="form-select form-select-xs"
                            style="width: 200px;"
                            onchange="${gvc.event((e) => {
                                vm.pageIndex = 1;
                                glitter.setUrlParameter('order_by', e.value);
                                loadings.product = true;
                                gvc.notifyDataChange(ids.product);
                            })}"
                        >
                            <option value="time">${Language.text('sort_by_date')}</option>
                            <option value="sales_desc">${Language.text('sort_by_sales_desc')}</option>
                            <option value="min_price">${Language.text('sort_by_price_asc')}</option>
                            <option value="max_price">${Language.text('sort_by_price_desc')}</option>
                        </select>
                    </div>
                    ${gvc.bindView(
                        (() => {
                            return {
                                bind: ids.product,
                                view: () => {
                                    if (loadings.product) {
                                        return this.spinner();
                                    } else {
                                        return html`<div class="row mx-n2 mx-sm-auto">
                                                ${vm.dataList.length > 0
                                                    ? gvc.map(
                                                          vm.dataList.map((item: any) => {
                                                              return html`<div class="col-6 col-sm-4 col-lg-3 px-1">
                                                                  <div class="m-1">
                                                                      ${glitter.htmlGenerate.renderComponent({
                                                                          appName: (window as any).appName,
                                                                          tag: 'product_widget',
                                                                          gvc: gvc,
                                                                          subData: item,
                                                                      })}
                                                                  </div>
                                                              </div>`;
                                                          })
                                                      )
                                                    : html`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                                                          <lottie-player
                                                              style="max-width: 100%;width: 300px;"
                                                              src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                              speed="1"
                                                              loop="true"
                                                              background="transparent"
                                                          ></lottie-player>
                                                          <span class="mb-5 fs-5">${Language.text('no_related_products')}</span>
                                                      </div>`}
                                            </div>
                                            ${this.pageSplitV2(gvc, vm.pageSize, vm.pageIndex, (p) => {
                                                vm.pageIndex = p;
                                                loadings.product = true;
                                                gvc.notifyDataChange(ids.product);
                                                (document.querySelector('html') as any).scrollTo(0, 0);
                                            })}
                                            <div style="margin-top: 240px;"></div>`;
                                    }
                                },
                                divCreate: {},
                                onCreate: () => {
                                    if (loadings.product) {
                                       
                                        gvc.addMtScript(
                                            [{ src: `${ gvc.glitter.root_path}/jslib/lottie-player.js` }],
                                            () => {
                                                Promise.all([
                                                    getProductList(),
                                                    new Promise<[]>((resolve) => {
                                                        ApiShop.getWishList().then((data) => {
                                                            try {
                                                                resolve(data.response.data);
                                                            } catch (error) {
                                                                resolve([]);
                                                            }
                                                        });
                                                    }),
                                                ]).then((dataList) => {
                                                    vm.dataList = dataList[0];
                                                    (window as any).glitter.share.wishList = dataList[1];
                                                    loadings.product = false;
                                                    gvc.notifyDataChange(ids.product);
                                                });
                                            },
                                            () => {}
                                        );
                                    }
                                },
                            };
                        })()
                    )}
                </div>
            </div>
        `;
    }
}

(window as any).glitter.setModule(import.meta.url, ProductList);
