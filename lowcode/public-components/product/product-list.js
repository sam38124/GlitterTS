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
import { Tool } from '../../modules/tool.js';
import { PdClass } from './pd-class.js';
import { Ad } from '../public/ad.js';
const html = String.raw;
export class ProductList {
    static arrowDownDataImage(color) {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='${color}'%3e%3cpath d='M225.813 48.907L128 146.72 30.187 48.907 0 79.093l128 128 128-128z'/%3e%3c/svg%3e"`;
    }
    static openBoxContainer(obj) {
        var _a;
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
        return html ` <div class="box-tag-${obj.tag} box-container-${text}">
            <div
                class="box-navbar-${text} ${(_a = obj.guideClass) !== null && _a !== void 0 ? _a : ''}"
                onclick="${obj.gvc.event((e) => {
            if (!obj.autoClose) {
                const boxes = document.querySelectorAll(`.box-tag-${obj.tag}`);
                boxes.forEach((box) => {
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
                const container = window.document.querySelector(`.box-container-${text}`);
                if (e.parentElement.classList.contains('open-box')) {
                    const si = setInterval(() => {
                        const inside = window.document.querySelector(`.box-inside-${text}`);
                        if (inside) {
                            const insideHeight = inside.clientHeight;
                            if (insideHeight + closeHeight < height) {
                                container.style.height = `${insideHeight + closeHeight + 20}px`;
                            }
                            else {
                                container.style.height = `${height}px`;
                            }
                            clearInterval(si);
                        }
                    }, 100);
                }
                else {
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
            <div class="box-inside-${text} ${obj.guideClass ? `box-inside-${obj.guideClass}` : ''}">${obj.insideHTML}</div>
        </div>`;
    }
    static spinner() {
        return html `<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
            <div class="spinner-border" role="status"></div>
            <span class="mt-3">載入中</span>
        </div>`;
    }
    static main(gvc, widget, subData) {
        var _a;
        const glitter = gvc.glitter;
        const vm = {
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
        const fontColor = (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333';
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
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = (index, type, subData) => {
                gvc.glitter.setUrlParameter('ai-search', undefined);
                cl.changePage(index, type, subData);
            };
        });
        function updateCollections(data) {
            const findCollection = (collections, path) => {
                let currentCollections = collections;
                let currentCollection;
                for (const title of path) {
                    currentCollection = currentCollections.find((col) => col.title === title);
                    if (!currentCollection)
                        return undefined;
                    currentCollections = currentCollection.array;
                }
                return currentCollection;
            };
            const addProductToCollection = (collection, productId) => {
                if (!collection.product_id) {
                    collection.product_id = [];
                }
                if (!collection.product_id.includes(productId)) {
                    collection.product_id.push(productId);
                }
            };
            const flattenCollections = (collections, parentTitles = [], topLevelCollections = []) => {
                let flattened = [];
                collections.forEach((col) => {
                    const { title, array, product_id, seo_title, seo_content, seo_image, code } = col;
                    const flattenedCol = {
                        title,
                        array: [],
                        product_id: product_id !== null && product_id !== void 0 ? product_id : [],
                        checked: false,
                        parentTitles: parentTitles.length ? [...parentTitles] : [],
                        allCollections: parentTitles.length ? [...topLevelCollections] : [],
                        subCollections: array.map((subCol) => subCol.title),
                        seo_title: seo_title,
                        seo_content: seo_content,
                        seo_image: seo_image,
                        code: code,
                    };
                    if (flattenedCol.title.includes(vm.query) ||
                        flattenedCol.parentTitles.find((title) => {
                            return title.includes(vm.query);
                        }) ||
                        flattenedCol.subCollections.find((title) => {
                            return title.includes(vm.query);
                        })) {
                        flattened.push(flattenedCol);
                    }
                    if (array.length) {
                        flattened = flattened.concat(flattenCollections(array, [...parentTitles, title], topLevelCollections));
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
            const topLevelCollections = data.collections.map((col) => col.title);
            return flattenCollections(data.collections, [], topLevelCollections);
        }
        function extractCategoryTitleFromUrl(url) {
            const urlParts = url.split('/');
            const collectionIndex = urlParts.indexOf('collections');
            if (collectionIndex !== -1 && collectionIndex < urlParts.length - 1) {
                return urlParts[collectionIndex + 1].split('/')[0].split('?')[0];
            }
            else {
                return '';
            }
        }
        function getProductList() {
            return __awaiter(this, void 0, void 0, function* () {
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
                const orderBy = orderByParam !== null && orderByParam !== void 0 ? orderByParam : '';
                const inputObj = {
                    page: page,
                    limit: limit,
                    collection: collection,
                    maxPrice: maxPrice,
                    minPrice: minPrice,
                    search: titleMatch,
                    status: 'inRange',
                    channel: 'normal',
                    orderBy: orderBy,
                    with_hide_index: 'false',
                    id_list: gvc.glitter.getUrlParameter('ai-search') || undefined,
                };
                return new Promise((resolve, reject) => {
                    ApiShop.getProduct(inputObj).then((data) => {
                        try {
                            vm.pageSize = Math.ceil(data.response.total / parseInt(limit, 10));
                            if (parseInt(`${vm.pageIndex}`, 10) >= data.response.data.pageSize) {
                                vm.pageIndex = vm.pageSize - 1;
                            }
                            resolve(data.response.data);
                        }
                        catch (error) {
                            resolve([]);
                        }
                    });
                });
            });
        }
        function getCollectionHTML() {
            return gvc.bindView((() => {
                const id = glitter.getUUID();
                let loading = true;
                return {
                    bind: id,
                    view: () => {
                        if (loading) {
                            return ProductList.spinner();
                        }
                        else {
                            const cols = vm.collections.filter((item) => {
                                return item.parentTitles.length === 0;
                            });
                            return html `<ul class="border navbar-nav me-auto mb-2 mb-lg-0">
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
                                    return `AI 選品`;
                                }
                                else if (gvc.glitter.getUrlParameter('search')) {
                                    return `搜尋 : ${gvc.glitter.getUrlParameter('search')}`;
                                }
                                else {
                                    return `所有商品`;
                                }
                            })()}
                                        </div>
                                    </li>
                                    ${cols
                                .map((item, index) => {
                                let subHTML = '';
                                if (item.subCollections.length > 0) {
                                    for (const col of vm.collections) {
                                        if (item.subCollections.includes(col.title) && col.parentTitles[0] === item.title) {
                                            subHTML += html `<ul class="mt-1 pt-2 mx-n4 px-4 mb-n2 pb-2 box-item">
                                                            <li style="font-weight: 500; line-height: 40px;">
                                                                <div
                                                                    class="d-flex tx_700"
                                                                    style="color: ${fontColor};"
                                                                    onclick="${gvc.event(() => {
                                                changePage('collections/' + col.code, 'page', {});
                                                gvc.glitter.closeDrawer();
                                            })}"
                                                                >
                                                                    ${col.title}
                                                                </div>
                                                            </li>
                                                        </ul>`;
                                        }
                                    }
                                }
                                return html ` <li
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
                                    })
                                    : html `<div
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
                            ApiShop.getCollection().then((data) => {
                                if (data.result && data.response.value.length > 0) {
                                    setAdTag(data.response.value);
                                    vm.allParents = ['(無)'].concat(data.response.value.map((item) => item.title));
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
            })());
        }
        function updatePageTitle() {
            const all_text = (() => {
                if (gvc.glitter.getUrlParameter('ai-search')) {
                    return `AI 選品`;
                }
                else if (gvc.glitter.getUrlParameter('search')) {
                    return `搜尋 : ${gvc.glitter.getUrlParameter('search')}`;
                }
                else {
                    return `所有商品`;
                }
            })();
            if (!vm.collections || vm.collections.length === 0) {
                vm.title = all_text;
            }
            else {
                const collectionObj = vm.collections.find((item) => {
                    return item.code === decodeURIComponent(extractCategoryTitleFromUrl(location.href));
                });
                vm.title = collectionObj ? collectionObj.title : all_text;
            }
            gvc.notifyDataChange(ids.pageTitle);
        }
        function setAdTag(data) {
            const path = location.pathname;
            const pathParts = path.split('/');
            const collectionIndex = pathParts.indexOf('collections');
            const index = collectionIndex + 1;
            const collection = pathParts[index];
            const collectionName = decodeURIComponent(collection);
            function findObjectByValue(arr, value) {
                for (const item of arr) {
                    if (item.code === value) {
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
            if (window.gtag) {
                if (collectionName) {
                    const foundObject = findObjectByValue(data, collectionName);
                    Ad.gtagEvent('view_item_list', {
                        items: [
                            {
                                item_id: foundObject.code,
                                item_name: foundObject.title,
                            },
                        ],
                    });
                    Ad.fbqEvent('ViewContent', {
                        content_ids: [foundObject.code],
                        content_type: 'product_group',
                    });
                }
                else {
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
        }
        return html `
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
            : html `<div class="fw-500 fw-bold" style="font-size: 24px; color: ${fontColor}; text-align: center; margin-bottom: 20px;">
                              ${gvc.bindView({
                bind: ids.pageTitle,
                view: () => vm.title,
            })}
                          </div>`}
                    <div class="d-flex justify-content-between mb-3">
                        ${document.body.clientWidth > 768
            ? html `<div class="fw-500" style="font-size: 24px; color: ${fontColor}">
                                  ${gvc.bindView({
                bind: ids.pageTitle,
                view: () => vm.title,
            })}
                              </div>`
            : html `<button
                                  class="filter-btn"
                                  onclick="${gvc.event(() => {
                glitter.setDrawer(html `<div class="p-3">
                                              <div class="fw-500 mb-3" style="font-size: 24px; color: ${fontColor}">商品分類</div>
                                              ${getCollectionHTML()}
                                          </div>`, () => {
                    gvc.glitter.openDrawer();
                });
            })}"
                              >
                                  <i class="fa-regular fa-filter-list me-1"></i>
                                  篩選
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
                            <option value="time">依照上架時間</option>
                            <option value="min_price">價格由低至高</option>
                            <option value="max_price">價格由高至低</option>
                        </select>
                    </div>
                    ${gvc.bindView((() => {
            return {
                bind: ids.product,
                view: () => {
                    if (loadings.product) {
                        return this.spinner();
                    }
                    else {
                        return html `<div class="row mx-n2 mx-sm-auto">
                                                ${vm.dataList.length > 0
                            ? gvc.map(vm.dataList.map((item) => {
                                return html `<div class="col-6 col-sm-4 col-lg-3 px-1">
                                                                  <div class="m-1">
                                                                      ${glitter.htmlGenerate.renderComponent({
                                    appName: window.appName,
                                    tag: 'product_widget',
                                    gvc: gvc,
                                    subData: item,
                                })}
                                                                  </div>
                                                              </div>`;
                            }))
                            : html `<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                                                          <lottie-player
                                                              style="max-width: 100%;width: 300px;"
                                                              src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                              speed="1"
                                                              loop="true"
                                                              background="transparent"
                                                          ></lottie-player>
                                                          <span class="mb-5 fs-5">查無相關商品</span>
                                                      </div>`}
                                            </div>
                                            ${this.pageSplitV2(gvc, vm.pageSize, vm.pageIndex, (p) => {
                            vm.pageIndex = p;
                            loadings.product = true;
                            gvc.notifyDataChange(ids.product);
                        })}
                                            <div style="margin-top: 240px;"></div>`;
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (loadings.product) {
                        gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                            Promise.all([
                                getProductList(),
                                new Promise((resolve) => {
                                    ApiShop.getWishList().then((data) => {
                                        try {
                                            resolve(data.response.data);
                                        }
                                        catch (error) {
                                            resolve([]);
                                        }
                                    });
                                }),
                            ]).then((dataList) => {
                                vm.dataList = dataList[0];
                                window.glitter.share.wishList = dataList[1];
                                loadings.product = false;
                                gvc.notifyDataChange(ids.product);
                            });
                        }, () => { });
                    }
                },
            };
        })())}
                </div>
            </div>
        `;
    }
}
ProductList.pageSplitV2 = (gvc, countPage, nowPage, callback) => {
    const generator = (n) => {
        return html `<li class="page-item my-0 mx-0">
                <div class="page-link-v2" onclick="${gvc.event(() => callback(n))}">${n}</div>
            </li>`;
    };
    const glitter = gvc.glitter;
    let vm = {
        id: glitter.getUUID(),
        loading: false,
        dataList: [],
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
                return html `<div class="w-100 d-flex align-items-center justify-content-center p-3">
                        <div class="spinner-border"></div>
                    </div>`;
            }
            else {
                return html `
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
                    }
                    else if (nowPage - 1 > 0) {
                        return generator(nowPage - 1);
                    }
                    else {
                        return ``;
                    }
                })}
                                <li class="page-item active mx-0" style="border-radius: 100%">
                                    <div class="page-link-v2 page-link-active">${nowPage}</div>
                                </li>
                                ${glitter.print(() => {
                    if (nowPage + 2 <= countPage) {
                        return generator(nowPage + 1) + generator(nowPage + 2);
                    }
                    else if (nowPage + 1 <= countPage) {
                        return generator(nowPage + 1);
                    }
                    else {
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
window.glitter.setModule(import.meta.url, ProductList);
