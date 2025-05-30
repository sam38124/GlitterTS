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
import { Language } from '../../glitter-base/global/language.js';
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
        const currentPage = decodeURIComponent((obj.gvc.glitter.getUrlParameter('page') || '').split('/').reverse()[0]);
        obj.gvc.addStyle(`
      .box-item:hover {
        background-color: #dddddd;
      }
      .box-container-${text} {
        position: relative;
        height: ${closeHeight}px;
        transition: height 0.3s ease-out;
      }
      .box-container-${text}.open-box {
        max-height: ${height}px;
        height: ${height}px;
      }
      .box-navbar {
        position: sticky;
        top: 0;
        min-height: 20px;
        z-index: 10;
        display: flex;
        padding: 16px;
        align-items: flex-start;
        justify-content: space-between;
      }
      .box-navbar:hover {
        background-color: #f5f5f5;
      }
      .arrow-icon-${text} {
        color: #393939 !important;
        box-shadow: none !important;
        background: transparent;
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
        padding: 0 0 1.5rem 1.5rem;
        min-height: 56px;
      }

      @media (max-width: 768px) {
        .box-inside-${text} {
          padding: 0 1rem 0.5rem;
        }
      }
    `);
        return html ` <div class="box-tag-${obj.tag} box-container-${text} ${obj.openOnInit ? 'open-box' : ''}">
      <div
        class="box-navbar ${(_a = obj.guideClass) !== null && _a !== void 0 ? _a : ''}"
        style="${currentPage === (obj.code || obj.title) ? 'background-color: #dddddd' : ''}"
        onclick="${obj.gvc.event(e => {
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
                const inside = window.document.querySelector(`.box-inside-${text}`);
                if (e.parentElement.classList.contains('open-box')) {
                    const si = setInterval(() => {
                        if (inside) {
                            const insideHeight = inside.clientHeight;
                            if (insideHeight + closeHeight < height) {
                            }
                            else {
                            }
                            container.style.height = `${height}px`;
                            inside.style.display = 'block';
                            clearInterval(si);
                        }
                    }, 100);
                }
                else {
                    container.style.height = `${closeHeight}px`;
                    inside.style.display = 'none';
                }
            }, 50);
        })}"
      >
        <div
          class="d-flex tx_700"
          style="color: ${obj.fontColor}; cursor: pointer;"
          onclick="${obj.gvc.event(() => {
            obj.changePage('collections/' + obj.code, 'page', {});
            obj.gvc.glitter.closeDrawer();
        })}"
        >
          ${obj.title}
        </div>
        <div class="d-flex">
          <button class="box-tag-${obj.tag} arrow-icon-${text} ${obj.openOnInit ? 'open-box' : ''}"></button>
        </div>
      </div>
      <div
        class="box-inside-${text} ${obj.guideClass ? `box-inside-${obj.guideClass}` : ''} "
        style="${obj.openOnInit ? '' : 'display: none;'}"
      >
        ${obj.insideHTML}
      </div>
    </div>`;
    }
    static spinner() {
        return html `<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
      <div class="spinner-border" role="status"></div>
      <span class="mt-3">${Language.text('loading')}</span>
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
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            changePage = (index, type, subData) => {
                gvc.glitter.setUrlParameter('ai-search', undefined);
                cl.changePage(index, type, subData);
            };
        });
        const currentPage = decodeURIComponent((glitter.getUrlParameter('page') || '').split('/').reverse()[0]);
        function updateCollections(data) {
            const flattenCollections = (collections, parentTitles = [], topLevelCollections = []) => {
                let flattened = [];
                collections.forEach(col => {
                    const { title, array, product_id, code, language_data } = col;
                    const flattenedCol = Object.assign(Object.assign({}, col), { title: (() => {
                            if (language_data &&
                                language_data[Language.getLanguage()] &&
                                language_data[Language.getLanguage()].title) {
                                return language_data[Language.getLanguage()].title;
                            }
                            else {
                                return title;
                            }
                        })(), array: array, product_id: product_id !== null && product_id !== void 0 ? product_id : [], checked: false, parentTitles: parentTitles.length ? [...parentTitles] : [], allCollections: parentTitles.length ? [...topLevelCollections] : [], subCollections: array.map(subCol => (() => {
                            const language_data = subCol.language_data;
                            if (language_data &&
                                language_data[Language.getLanguage()] &&
                                language_data[Language.getLanguage()].title) {
                                return language_data[Language.getLanguage()].title;
                            }
                            else {
                                return subCol.title;
                            }
                        })()), code: (() => {
                            if (language_data &&
                                language_data[Language.getLanguage()] &&
                                language_data[Language.getLanguage()].title) {
                                return language_data[Language.getLanguage()].seo.domain;
                            }
                            else {
                                return code;
                            }
                        })() });
                    if (flattenedCol.title.includes(vm.query) ||
                        flattenedCol.parentTitles.find(title => {
                            return title.includes(vm.query);
                        }) ||
                        flattenedCol.subCollections.find(title => {
                            return title.includes(vm.query);
                        })) {
                        flattened.push(flattenedCol);
                    }
                    if (array.length) {
                        flattened = flattened.concat(flattenCollections(array, [
                            ...parentTitles,
                            (() => {
                                if (language_data &&
                                    language_data[Language.getLanguage()] &&
                                    language_data[Language.getLanguage()].title) {
                                    return language_data[Language.getLanguage()].title;
                                }
                                else {
                                    return title;
                                }
                            })(),
                        ], topLevelCollections));
                    }
                });
                return flattened;
            };
            const topLevelCollections = data.collections.map(col => (() => {
                const language_data = col.language_data;
                if (language_data &&
                    language_data[Language.getLanguage()] &&
                    language_data[Language.getLanguage()].title) {
                    return language_data[Language.getLanguage()].title;
                }
                else {
                    return col.title;
                }
            })());
            return flattenCollections(data.collections, [], topLevelCollections);
        }
        function getTotalChildCount(item) {
            if (item.array.length === 0) {
                return 0;
            }
            const arr = item.array.filter(child => !child.hidden);
            return arr.reduce((sum, child) => sum + getTotalChildCount(child), arr.length);
        }
        function getProductList() {
            return __awaiter(this, void 0, void 0, function* () {
                const orderByParam = glitter.getUrlParameter('order_by');
                const page = parseInt(`${vm.pageIndex}`, 10) - 1;
                const limit = vm.limit;
                const collection = encodeURIComponent(getURICollectionName());
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
                    ApiShop.getProduct(inputObj).then(data => {
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
            const id = glitter.getUUID();
            const undefinedOption = '請選擇項目';
            let loading = true;
            return gvc.bindView({
                bind: id,
                view: () => {
                    if (loading) {
                        return ProductList.spinner();
                    }
                    const firstCols = vm.collections.filter((item) => item.parentTitles.length === 0 && !Boolean(item.hidden));
                    function printUL(col) {
                        return html `<div
              class="box-navbar"
              style="${currentPage === (col.code || col.title) ? 'background: #dddddd;' : ''}"
              onclick="${gvc.event(() => {
                            changePage(`collections/${col.code || col.title}`, 'page', {});
                            gvc.glitter.closeDrawer();
                        })}"
            >
              <div style="font-weight: 500;">
                <div class="d-flex tx_700" style="color: ${fontColor}; cursor: pointer;">${col.title}</div>
              </div>
            </div>`;
                    }
                    function renderItem(item, depth, index) {
                        let subHTML = '';
                        try {
                            if (item.array.length > 0) {
                                item.array.map((col, index) => {
                                    if (!Boolean(col.hidden)) {
                                        subHTML += col.array.length > 0 ? renderItem(col, depth + 1, index) : printUL(col);
                                    }
                                });
                            }
                            const openOnInit = (() => {
                                const currentItem = vm.collections.find((col) => (col.code || col.title) === currentPage);
                                if (!currentItem)
                                    return false;
                                return currentItem.parentTitles.includes(item.title);
                            })();
                            return html ` <div
                class="${index + 1 === firstCols.length ? '' : ''}"
                style="${item.array.length > 0 && subHTML.length > 0 ? '' : 'padding: 16px;'}"
              >
                ${item.array.length > 0 && subHTML.length > 0
                                ? ProductList.openBoxContainer({
                                    gvc,
                                    tag: `collection-box-${depth}-${index}`,
                                    title: item.title,
                                    code: item.code,
                                    insideHTML: subHTML,
                                    length: getTotalChildCount(item),
                                    changePage,
                                    fontColor,
                                    openOnInit,
                                })
                                : html `<div
                      class="d-flex tx_700"
                      style="color: ${fontColor}; cursor: pointer;"
                      onclick="${gvc.event(() => {
                                    changePage('collections/' + item.code, 'page', {});
                                    gvc.glitter.closeDrawer();
                                })}"
                    >
                      ${item.title}
                    </div>`}
              </div>`;
                        }
                        catch (error) {
                            console.error('Product-list RenderItem Error: ', error);
                            return '發生錯誤';
                        }
                    }
                    return html `<div class="${PdClass.isPhone() ? '' : 'border'} navbar-nav me-auto mb-2 mb-lg-0">
            <div style="padding: 16px;">
              <div
                class="d-flex tx_700"
                style="color: ${fontColor}; cursor: pointer;"
                onclick="${gvc.event(() => {
                        changePage('all-product', 'page', {});
                        gvc.glitter.closeDrawer();
                    })}"
              >
                ${(() => {
                        if (gvc.glitter.getUrlParameter('ai-search')) {
                            return Language.text('ai_choose');
                        }
                        else if (gvc.glitter.getUrlParameter('search')) {
                            return `${Language.text('search')}: ${gvc.glitter.getUrlParameter('search')}`;
                        }
                        else {
                            return Language.text('all_products');
                        }
                    })()}
              </div>
            </div>
            ${firstCols.map((item, index) => renderItem(item, 0, index)).join('')}
          </div>`;
                },
                divCreate: {
                    style: PdClass.isPhone() ? '' : 'position: sticky; top: 7.5rem;',
                },
                onCreate: () => {
                    if (loading) {
                        ApiShop.getCollection().then((data) => {
                            if (data.result && data.response.value.length > 0) {
                                setAdTag();
                                vm.allParents = [undefinedOption].concat(data.response.value.map((item) => item.title));
                                vm.collections = updateCollections({
                                    collections: data.response.value,
                                });
                                updatePageTitle();
                            }
                            loading = false;
                            gvc.notifyDataChange(id);
                        });
                    }
                },
            });
        }
        function collectionTitle(titleText) {
            var _a, _b, _c;
            if (!((_a = vm.collections) === null || _a === void 0 ? void 0 : _a.length))
                return titleText;
            try {
                const collectionName = getURICollectionName();
                const collectionHidden = getCollectionShowMap();
                if (!collectionHidden.get(collectionName)) {
                    return titleText;
                }
                const hasCollection = vm.collections.find((item) => {
                    var _a, _b;
                    const languageData = (_a = item.language_data) === null || _a === void 0 ? void 0 : _a[Language.getLanguage()];
                    const possibleNames = [(_b = languageData === null || languageData === void 0 ? void 0 : languageData.seo) === null || _b === void 0 ? void 0 : _b.domain, item.code, languageData === null || languageData === void 0 ? void 0 : languageData.title, item.title];
                    return possibleNames.find(name => name === collectionName);
                });
                return ((_c = (_b = hasCollection === null || hasCollection === void 0 ? void 0 : hasCollection.language_data) === null || _b === void 0 ? void 0 : _b[Language.getLanguage()]) === null || _c === void 0 ? void 0 : _c.title) || (hasCollection === null || hasCollection === void 0 ? void 0 : hasCollection.title) || titleText;
            }
            catch (error) {
                console.error('collectionTitle Error:', error);
                return titleText;
            }
        }
        function updatePageTitle() {
            const titleText = (() => {
                if (gvc.glitter.getUrlParameter('ai-search')) {
                    return Language.text('ai_choose');
                }
                else if (gvc.glitter.getUrlParameter('search')) {
                    return `${Language.text('search')}: ${gvc.glitter.getUrlParameter('search')}`;
                }
                else {
                    return Language.text('all_products');
                }
            })();
            vm.title = collectionTitle(titleText);
            gvc.notifyDataChange(ids.pageTitle);
        }
        function getURICollectionName() {
            const path = location.pathname;
            const pathParts = path.split('/');
            const collectionIndex = pathParts.indexOf('collections');
            const index = collectionIndex + 1;
            const collection = pathParts[index];
            const collectionName = decodeURIComponent(collection);
            return collectionName;
        }
        function setAdTag() {
            try {
                const collectionName = getURICollectionName();
                if (window.gtag) {
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
            catch (e) {
                console.error(e);
            }
        }
        function getCollectionShowMap() {
            const getLanguage = Language.getLanguage();
            return new Map(vm.collections.map((item) => {
                const domain = (() => {
                    var _a;
                    const defaultName = (_a = item.code) !== null && _a !== void 0 ? _a : item.title;
                    try {
                        if (item.language_data && item.language_data[getLanguage].seo.domain) {
                            return item.language_data[getLanguage].seo.domain;
                        }
                        return defaultName;
                    }
                    catch (error) {
                        return defaultName;
                    }
                })();
                return [domain, !Boolean(item.hidden)];
            }));
        }
        return html `
      <div class="container d-flex mt-2" style="min-height: 1000px;">
        <div
          class="d-none d-sm-block mt-4"
          style="${PdClass.isPad()
            ? 'width: 180px; min-width: 180px;'
            : 'width: 282px; min-width: 282px; margin-bottom: 300px;'}"
        >
          ${getCollectionHTML()}
        </div>
        <div class="flex-fill my-4 mx-1 mx-md-5">
          ${document.body.clientWidth > 768
            ? ''
            : html `<div
                class="fw-500 fw-bold"
                style="font-size: 24px; color: ${fontColor}; text-align: center; margin-bottom: 20px;"
              >
                ${gvc.bindView({
                bind: ids.pageTitle,
                view: () => vm.title,
            })}
              </div>`}
          <div class="d-flex justify-content-between mb-3">
            ${PdClass.isPhone()
            ? html `<button
                  class="filter-btn"
                  onclick="${gvc.event(() => {
                glitter.setDrawer(html `<div class="py-3 px-2" style="height: 100vh; overflow: scroll;">
                        <div
                          class="fw-500 mb-3"
                          style="font-size: 24px; color: ${fontColor};padding-top:${gvc.glitter.share
                    .top_inset}px !important;"
                        >
                          ${Language.text('product_categories')}
                        </div>
                        ${getCollectionHTML()}
                      </div>`, () => {
                    gvc.glitter.openDrawer();
                });
            })}"
                >
                  <i class="fa-regular fa-filter-list me-1"></i>
                  ${Language.text('filter')}
                </button>`
            : html `<div class="fw-500" style="font-size: 24px; color: ${fontColor}">
                  ${gvc.bindView({
                bind: ids.pageTitle,
                view: () => vm.title,
            })}
                </div>`}
            <select
              class="form-select form-select-xs"
              style="width: 200px;"
              onchange="${gvc.event(e => {
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
                            : html `<div
                              class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto"
                            >
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
                      ${this.pageSplitV2(gvc, vm.pageSize, vm.pageIndex, p => {
                            vm.pageIndex = p;
                            loadings.product = true;
                            gvc.notifyDataChange(ids.product);
                            document.querySelector('html').scrollTo(0, 0);
                        })}
                      <div style="margin-top: 240px;"></div>`;
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (loadings.product) {
                        gvc.addMtScript([{ src: `${gvc.glitter.root_path}/jslib/lottie-player.js` }], () => {
                            Promise.all([
                                getProductList(),
                                new Promise(resolve => {
                                    ApiShop.getWishList().then(data => {
                                        try {
                                            resolve(data.response.data);
                                        }
                                        catch (error) {
                                            resolve([]);
                                        }
                                    });
                                }),
                            ]).then(dataList => {
                                vm.dataList = dataList[0];
                                const collectionName = getURICollectionName();
                                if (collectionName) {
                                    const collectionHidden = getCollectionShowMap();
                                    if (!collectionHidden.get(collectionName)) {
                                        vm.dataList = [];
                                    }
                                }
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
        border: 1px solid #393939;
        color: #393939;
      }

      .page-link-prev {
        border-radius: 7px 0px 0px 7px;
        border: 1px solid #393939;
        background: #fff;
        color: #393939;
      }

      .page-link-next {
        border-radius: 0px 7px 7px 0px;
        border: 1px solid #393939;
        background: #fff;
        color: #393939;
      }

      .page-link-active {
        background: #393939;
        color: #fff;
      }

      .angle-style {
        font-size: 12px;
        color: #393939;
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
                    let result = '';
                    for (let i = Math.max(1, nowPage - 4); i < nowPage; i++) {
                        result += generator(i);
                    }
                    return result;
                })}
                <li class="page-item active mx-0" style="border-radius: 100%">
                  <div class="page-link-v2 page-link-active">${nowPage}</div>
                </li>
                ${glitter.print(() => {
                    let result = '';
                    for (let i = nowPage + 1; i <= Math.min(nowPage + 4, countPage); i++) {
                        result += generator(i);
                    }
                    return result;
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
