import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { CheckInput } from '../modules/checkInput.js';
import { Language } from '../glitter-base/global/language.js';
function getEmptyLanguageData() {
    return {
        title: '',
        seo: {
            domain: '',
            title: '',
            content: '',
        },
    };
}
export class ShoppingCollections {
    static main(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            filterID: glitter.getUUID(),
            type: 'list',
            data: {
                title: '',
                array: [],
                product_id: [],
                parentTitles: [],
                subCollections: [],
                allCollections: [],
                seo_title: '',
                seo_content: '',
                seo_image: '',
                code: '',
                checked: false,
                language_data: {
                    'zh-CN': getEmptyLanguageData(),
                    'zh-TW': getEmptyLanguageData(),
                    'en-US': getEmptyLanguageData(),
                },
            },
            dataList: undefined,
            query: '',
            allParents: [],
        };
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        const updateCollections = (data) => {
            const findCollection = (collections, path) => {
                let currentCollections = collections;
                let currentCollection;
                for (const title of path) {
                    currentCollection = currentCollections.find(col => col.title === title);
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
                collections.forEach(col => {
                    const { title, array, product_id } = col;
                    const flattenedCol = Object.assign(Object.assign({}, col), { array: [], product_id: product_id !== null && product_id !== void 0 ? product_id : [], checked: false, parentTitles: parentTitles.length ? [...parentTitles] : [], allCollections: parentTitles.length ? [...topLevelCollections] : [], subCollections: array.map(subCol => subCol.title), hidden: Boolean(col.hidden) });
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
                        flattened = flattened.concat(flattenCollections(array, [...parentTitles, title], topLevelCollections));
                    }
                });
                return flattened;
            };
            data.products.forEach(product => {
                product.content.collection.forEach(category => {
                    const path = category.split('/').map(item => {
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
            const topLevelCollections = data.collections.map(col => col.title);
            return flattenCollections(data.collections, [], topLevelCollections);
        };
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
              <div class="title-container">
                ${BgWidget.title('商品分類')}
                <div class="flex-fill"></div>
                <div class="d-flex gap-2">
                  ${BgWidget.grayButton('編輯順序', gvc.event(() => {
                            return BgWidget.infoDialog({
                                gvc,
                                title: '編輯順序',
                                innerHTML: gvc.bindView((() => {
                                    const id = glitter.getUUID();
                                    let loading = true;
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (loading) {
                                                gvc.addStyle(`
                                    .parent-container,
                                    .child-container {
                                      flex: 1;
                                      margin-right: 20px;
                                    }

                                    .parent-container:last-child,
                                    .child-container:last-child {
                                      margin-right: 0;
                                    }

                                    .ul-style {
                                      list-style-type: none;
                                      padding: 0;
                                      margin: 0;
                                      min-height: 200px;
                                      border: 1px solid #ccc;
                                    }

                                    .li-style {
                                      padding: 6px 10px;
                                      margin-bottom: 5px;
                                      background-color: #eee;
                                      cursor: move;
                                      border: 1px solid #ccc;
                                      display: flex;
                                      align-items: center;
                                    }

                                    .drag-icon {
                                      margin-right: 10px;
                                      cursor: move;
                                    }

                                    .drag-icon::before {
                                      content: '↕';
                                      font-size: 18px;
                                      margin-right: 10px;
                                    }

                                    .selectCol {
                                      background-color: #dcdcdc;
                                    }
                                  `);
                                                return '';
                                            }
                                            else {
                                                return html ` <div class="d-flex">
                                    <div class="parent-container">
                                      <div class="tx_title text-center mb-2">父層類別</div>
                                      <ul class="ul-style" id="parent-list">
                                        <!-- TS 生成的父層類別列表 -->
                                      </ul>
                                    </div>
                                    <div class="child-container">
                                      <div class="tx_title text-center mb-2">子層類別</div>
                                      <ul class="ul-style" id="child-list">
                                        <!-- TS 生成的子層類別列表 -->
                                      </ul>
                                    </div>
                                  </div>`;
                                            }
                                        },
                                        divCreate: {},
                                        onCreate: () => {
                                            if (loading) {
                                                gvc.addMtScript([
                                                    {
                                                        src: 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js',
                                                    },
                                                ], () => {
                                                    const si = setInterval(() => {
                                                        if (window.Sortable !== undefined) {
                                                            loading = false;
                                                            clearInterval(si);
                                                            gvc.notifyDataChange(id);
                                                        }
                                                    }, 300);
                                                }, () => { });
                                            }
                                            else {
                                                function createListItem(item, index) {
                                                    const li = document.createElement('li');
                                                    li.className = 'li-style';
                                                    li.setAttribute('data-index', index.toString());
                                                    li.setAttribute('data-parent', item.parentTitles[0] || 'root');
                                                    li.innerHTML = `<span class="drag-icon"></span><span class="tx_normal">${item.title}</span>`;
                                                    return li;
                                                }
                                                function initSortable(containerId) {
                                                    const el = document.querySelector(`#${containerId}`);
                                                    window.Sortable.create(el, {
                                                        animation: 150,
                                                        onEnd: function () {
                                                            const items = [...el.children].map(child => vm.dataList[parseInt(child.getAttribute('data-index'))]);
                                                            ApiShop.sortCollections({
                                                                data: { list: items },
                                                                token: window.parent.config.token,
                                                            }).then(res => {
                                                                if (res.result && !res.response) {
                                                                    dialog.errorMessage({ text: '更改順序失敗' });
                                                                }
                                                            });
                                                        },
                                                    });
                                                }
                                                function loadChildItems(parentTitle) {
                                                    const childContainer = document.getElementById('child-list');
                                                    childContainer.innerHTML = '';
                                                    vm.dataList.forEach((item, index) => {
                                                        if (item.parentTitles[0] === parentTitle) {
                                                            childContainer.appendChild(createListItem(item, index));
                                                        }
                                                    });
                                                    initSortable('child-list');
                                                }
                                                const parentContainer = document.getElementById('parent-list');
                                                vm.dataList.forEach((item, index) => {
                                                    if (item.parentTitles.length === 0) {
                                                        const li = createListItem(item, index);
                                                        li.addEventListener('click', () => {
                                                            loadChildItems(item.title);
                                                            document
                                                                .querySelectorAll('#parent-list li')
                                                                .forEach(li => li.classList.remove('selectCol'));
                                                            li.classList.add('selectCol');
                                                        });
                                                        parentContainer.appendChild(li);
                                                    }
                                                });
                                                initSortable('parent-list');
                                            }
                                        },
                                    };
                                })()),
                                closeCallback: () => {
                                    gvc.notifyDataChange(vm.id);
                                },
                            });
                        }))}
                  ${BgWidget.darkButton('新增', gvc.event(() => {
                            vm.data = {
                                title: '',
                                array: [],
                                product_id: [],
                                parentTitles: [],
                                subCollections: [],
                                checked: false,
                                seo_title: '',
                                seo_content: '',
                                language_data: {
                                    'zh-CN': getEmptyLanguageData(),
                                    'zh-TW': getEmptyLanguageData(),
                                    'en-US': getEmptyLanguageData(),
                                },
                                seo_image: '',
                                code: '',
                                allCollections: vm.allParents,
                            };
                            vm.type = 'add';
                        }))}
                </div>
              </div>
              ${BgWidget.container(BgWidget.mainCard([
                            BgWidget.searchPlace(gvc.event(e => {
                                vm.query = e.value;
                                gvc.notifyDataChange(vm.id);
                            }), vm.query || '', '搜尋類別'),
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: vmi => {
                                    ApiShop.getProduct({
                                        page: 0,
                                        limit: 999999,
                                    }).then(d => {
                                        if (d.result) {
                                            const products = d.response.data;
                                            ApiShop.getCollection().then(data => {
                                                if (data.result && data.response.value.length > 0) {
                                                    vm.allParents = ['(無)'].concat(data.response.value.map((item) => item.title));
                                                    const collections = updateCollections({
                                                        products,
                                                        collections: data.response.value,
                                                    });
                                                    const collectionsMap = new Map(collections.map(col => [col.title, col]));
                                                    function getDatalist() {
                                                        return collections.map(dd => {
                                                            const original = structuredClone(dd);
                                                            const isChildren = dd.parentTitles && dd.parentTitles.length > 0;
                                                            function triggerHidden() {
                                                                dd.hidden = !Boolean(dd.hidden);
                                                                dialog.dataLoading({ visible: true });
                                                                ApiShop.putCollections({
                                                                    data: { replace: dd, original },
                                                                    token: window.parent.config.token,
                                                                }).then(r => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    gvc.notifyDataChange(vm.id);
                                                                });
                                                            }
                                                            function setHiddenEvent() {
                                                                if (isChildren) {
                                                                    const parent = collectionsMap.get(dd.parentTitles[0]);
                                                                    if ((parent === null || parent === void 0 ? void 0 : parent.hidden) && dd.hidden) {
                                                                        dialog.infoMessage({ text: '請先開啟顯示父層類別' });
                                                                    }
                                                                    else {
                                                                        triggerHidden();
                                                                    }
                                                                }
                                                                else {
                                                                    if (dd.hidden) {
                                                                        triggerHidden();
                                                                    }
                                                                    else {
                                                                        dialog.checkYesOrNot({
                                                                            text: '若關閉顯示該父層類別，所有子層也將會關閉顯示，是否確定要執行？',
                                                                            callback: bool => bool && triggerHidden(),
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                            return [
                                                                {
                                                                    key: '標題',
                                                                    value: html `<div
                                          class="fs-7"
                                          style="min-width: ${document.body.clientWidth > 768 ? 400 : 225}px;"
                                        >
                                          ${isChildren
                                                                        ? html ` <i class="fa-solid fa-arrow-turn-down-right me-2"></i
                                                >${dd.parentTitles.join(' / ')} / ${dd.title}`
                                                                        : dd.title}
                                        </div>`,
                                                                },
                                                                {
                                                                    key: '商品數量',
                                                                    value: html `<span class="fs-7"
                                          >${dd.product_id ? dd.product_id.length : 0}</span
                                        >`,
                                                                },
                                                                {
                                                                    key: '是否顯示',
                                                                    value: html `<i
                                          class="${dd.hidden ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}"
                                          style="cursor: pointer;"
                                          onclick="${gvc.event(() => setHiddenEvent())}"
                                        ></i>`,
                                                                    stopClick: true,
                                                                },
                                                            ];
                                                        });
                                                    }
                                                    vm.dataList = collections;
                                                    vmi.tableData = getDatalist();
                                                }
                                                else {
                                                    vm.dataList = [];
                                                    vmi.tableData = [];
                                                }
                                                vmi.pageSize = 1;
                                                vmi.originalData = vm.dataList;
                                                vmi.loading = false;
                                                vmi.callback();
                                            });
                                        }
                                    });
                                },
                                rowClick: (data, index) => {
                                    vm.data = vm.dataList[index];
                                    vm.type = 'replace';
                                },
                                filter: [
                                    {
                                        name: '批量移除',
                                        event: () => {
                                            dialog.checkYesOrNot({
                                                text: '確定要刪除商品類別嗎？<br/>（若此類別包含子類別，也將一併刪除）',
                                                callback: response => {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        ApiShop.deleteCollections({
                                                            data: { data: vm.dataList.filter((dd) => dd.checked) },
                                                            token: window.parent.config.token,
                                                        }).then(res => {
                                                            dialog.dataLoading({ visible: false });
                                                            if (res.result) {
                                                                vm.query = '';
                                                                vm.dataList = undefined;
                                                                gvc.notifyDataChange(vm.id);
                                                            }
                                                            else {
                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                            }
                                                        });
                                                    }
                                                },
                                            });
                                        },
                                    },
                                ],
                                hiddenPageSplit: true,
                            }),
                        ].join('')))}
              ${BgWidget.mbContainer(120)}
            `);
                    }
                    else if (vm.type == 'replace') {
                        return this.editorDetail({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    }
                    else {
                        return this.editorDetail({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                        });
                    }
                },
            };
        });
    }
    static editorDetail(obj) {
        const html = String.raw;
        const gvc = obj.gvc;
        const vm = obj.vm;
        const original = JSON.parse(JSON.stringify(vm.data));
        const dialog = new ShareDialog(gvc.glitter);
        const language_setting = window.parent.store_info.language_setting;
        let select_lan = language_setting.def;
        function getValidLangDomain() {
            const supports = language_setting.support;
            const dataList = vm.dataList.filter((data) => data.title !== vm.data.title);
            const lagDomain = supports.map(lang => {
                const domainMap = dataList.map((item) => {
                    if (!item.language_data) {
                        return '';
                    }
                    try {
                        return item.language_data[lang].seo.domain;
                    }
                    catch (error) {
                        return '';
                    }
                });
                const domains = [...new Set(domainMap)].filter(domain => domain !== '');
                return { lang, domains };
            });
            for (const data of lagDomain) {
                if (data.domains.includes(vm.data.language_data[data.lang].seo.domain)) {
                    const langTExt = Language.getLanguageText({
                        local: true,
                        compare: data.lang,
                    });
                    return {
                        result: false,
                        text: `語系「${langTExt}」的連結網址「${vm.data.language_data[data.lang].seo.domain}」<br/>已存在於其他類別，請更換連結網址`,
                    };
                }
            }
            return { result: true, text: '' };
        }
        return gvc.bindView(() => {
            const viewID = gvc.glitter.getUUID();
            const domainID = gvc.glitter.getUUID();
            function refresh() {
                gvc.notifyDataChange(viewID);
            }
            return {
                bind: viewID,
                view: () => {
                    var _a, _b, _c, _d;
                    if (obj.type === 'replace') {
                        vm.data.language_data = (_a = vm.data.language_data) !== null && _a !== void 0 ? _a : {
                            'zh-TW': {
                                title: '',
                                seo: {
                                    title: vm.data.seo_title,
                                    content: vm.data.seo_content,
                                    domain: vm.data.code,
                                },
                            },
                            'zh-CN': getEmptyLanguageData(),
                            'en-US': getEmptyLanguageData(),
                        };
                    }
                    const language_data = vm.data.language_data[select_lan];
                    const prefixURL = `https://${window.parent.glitter.share.editorViewModel.domain}/${Language.getLanguageLinkPrefix(true, select_lan)}collections/`;
                    return BgWidget.container([
                        html ` <div class="title-container">
                ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                ${BgWidget.title(obj.type === 'add' ? '新增類別' : '編輯類別')}
                <div class="flex-fill"></div>
                <div class="me-2 ">
                  ${BgWidget.grayButton(html `<div class="d-flex align-items-center" style="gap:5px;">
                      <i class="fa-duotone fa-solid fa-earth-americas"></i>${Language.getLanguageText({
                            local: true,
                            compare: select_lan,
                        })}
                    </div>`, gvc.event(() => {
                            BgWidget.settingDialog({
                                gvc: gvc,
                                innerHTML: (gvc) => {
                                    return gvc.bindView((() => {
                                        const id = gvc.glitter.getUUID();
                                        const glitter = gvc.glitter;
                                        const html = String.raw;
                                        return {
                                            bind: id,
                                            view: () => {
                                                return html ` <div
                                    style="position: relative;word-break: break-all;white-space: normal;"
                                  >
                                    ${BgWidget.grayNote('前往商店設定->商店訊息中，設定支援的語言。')}
                                    ${gvc.bindView(() => {
                                                    const html = String.raw;
                                                    return {
                                                        bind: glitter.getUUID(),
                                                        view: () => {
                                                            const sup = [
                                                                {
                                                                    key: 'en-US',
                                                                    value: '英文',
                                                                },
                                                                {
                                                                    key: 'zh-CN',
                                                                    value: '簡體中文',
                                                                },
                                                                {
                                                                    key: 'zh-TW',
                                                                    value: '繁體中文',
                                                                },
                                                            ]
                                                                .filter(dd => {
                                                                return window.parent.store_info.language_setting.support.includes(dd.key);
                                                            })
                                                                .sort((dd) => {
                                                                return dd.key === select_lan ? -1 : 1;
                                                            });
                                                            return html ` <div
                                            class="d-flex mt-3 flex-wrap align-items-center justify-content-center"
                                            style="gap:15px;"
                                          >
                                            ${sup
                                                                .map((dd) => {
                                                                return html `
                                                  <div
                                                    class="px-3 py-1 text-white position-relative d-flex align-items-center justify-content-center"
                                                    style="border-radius: 20px;background: #393939;cursor: pointer;width:100px;"
                                                    onclick="${gvc.event(() => {
                                                                    select_lan = dd.key;
                                                                    gvc.closeDialog();
                                                                    refresh();
                                                                })}"
                                                  >
                                                    ${dd.value}
                                                    <div
                                                      class="position-absolute  text-white rounded-2 px-2 d-flex align-items-center rounded-3 ${dd.key !==
                                                                    select_lan
                                                                    ? `d-none`
                                                                    : ``}"
                                                      style="top: -12px;right: -10px; height:20px;font-size: 11px;background: #ff6c02;"
                                                    >
                                                      已選擇
                                                    </div>
                                                  </div>
                                                `;
                                                            })
                                                                .join('')}
                                          </div>`;
                                                        },
                                                    };
                                                })}
                                  </div>`;
                                            },
                                            divCreate: {},
                                            onCreate: () => { },
                                        };
                                    })());
                                },
                                title: '切換語系',
                                footer_html: gvc => {
                                    return ``;
                                },
                                width: 300,
                            });
                        }))}
                </div>
              </div>`,
                        BgWidget.container1x2({
                            html: [
                                BgWidget.mainCard(html ` <div class="tx_700" style="margin-bottom: 18px">分類標籤 ${BgWidget.requiredStar()}</div>
                        ${EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: vm.data.title,
                                    placeHolder: '請輸入分類標籤',
                                    callback: text => {
                                        vm.data.title = text;
                                    },
                                })}`),
                                BgWidget.mainCard(html ` <div class="d-flex flex-column" style="margin-bottom: 12px; gap:5px;">
                          <div class="tx_700">前台分類顯示名稱 ${BgWidget.languageInsignia(select_lan)}</div>
                          ${BgWidget.grayNote(`未設定則參照分類標籤顯示`)}
                        </div>
                        ${EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: language_data.title,
                                    placeHolder: vm.data.title || '',
                                    callback: text => {
                                        language_data.title = text;
                                        if (language_data.seo.domain === '') {
                                            language_data.seo.domain = language_data.title;
                                            gvc.notifyDataChange(domainID);
                                        }
                                    },
                                })}`),
                                gvc.bindView(() => {
                                    const viewID = gvc.glitter.getUUID();
                                    return {
                                        bind: viewID,
                                        view: () => {
                                            return BgWidget.mainCard([
                                                html ` <div class="tx_normal fw-normal mb-2">
                                連結網址 ${BgWidget.requiredStar()} ${BgWidget.languageInsignia(select_lan)}
                              </div>`,
                                                gvc.bindView({
                                                    bind: domainID,
                                                    view: () => {
                                                        return html `<div
                                      class="${document.body.clientWidth < 800
                                                            ? `w-100`
                                                            : ``} justify-content-start justify-content-lg-center"
                                      style="padding: 9px 18px;background: #EAEAEA; justify-content: center; align-items: center; gap: 5px; display: flex"
                                    >
                                      <div
                                        style="text-align: right; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                      >
                                        ${prefixURL}
                                      </div>
                                    </div>
                                    <input
                                      class="flex-fill ${document.body.clientWidth < 800 ? `w-100` : ``}"
                                      style="border:none;background:none;text-align: start; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word; ${document
                                                            .body.clientWidth > 768
                                                            ? ''
                                                            : 'padding: 9px 18px;'}"
                                      placeholder="請輸入連結網址"
                                      value="${language_data.seo.domain || ''}"
                                      onchange="${gvc.event(e => {
                                                            let text = e.value;
                                                            if (text.length > 0 && !CheckInput.isChineseEnglishNumberHyphen(text)) {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.infoMessage({ text: '連結僅限使用中英文數字與連接號' });
                                                            }
                                                            else {
                                                                language_data.seo.domain = text;
                                                            }
                                                            gvc.notifyDataChange(viewID);
                                                        })}"
                                    />`;
                                                    },
                                                    divCreate: {
                                                        style: `width: 100%; justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document.body.clientWidth > 768
                                                            ? 'gap: 18px; '
                                                            : 'flex-direction: column; gap: 0px; '}`,
                                                    },
                                                }),
                                                html ` <div class="mt-2 mb-1">
                                <span class="tx_normal me-1">網址預覽</span>
                                ${BgWidget.greenNote(prefixURL + language_data.seo.domain, gvc.event(() => {
                                                    var _a;
                                                    gvc.glitter.openNewTab(prefixURL + ((_a = language_data.seo.domain) !== null && _a !== void 0 ? _a : ''));
                                                }))}
                              </div>`,
                                            ].join(BgWidget.mbContainer(12)));
                                        },
                                        divCreate: {
                                            class: `${gvc.glitter.ut.frSize({
                                                sm: ``,
                                            }, `p-0`)}`,
                                        },
                                    };
                                }),
                                BgWidget.mainCard(html ` <div class="tx_700" style="margin-bottom: 18px">商品</div>
                        ${(() => {
                                    const pvm = {
                                        id: gvc.glitter.getUUID(),
                                        loading: true,
                                        dataList: vm.data.product_id,
                                        productList: [],
                                    };
                                    return html `
                            <div class="d-flex flex-column p-2" style="gap: 18px;">
                              <div
                                class="d-flex align-items-center gray-bottom-line-18"
                                style="justify-content: space-between;"
                              >
                                <div class="form-check-label c_updown_label">
                                  <div class="tx_normal">商品名稱</div>
                                </div>
                                ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                        BgWidget.selectDropDialog({
                                            gvc: gvc,
                                            title: '搜尋商品',
                                            tag: 'select_users',
                                            updownOptions: FilterOptions.productOrderBy,
                                            callback: value => {
                                                pvm.dataList = value;
                                                vm.data.product_id = value;
                                                pvm.loading = true;
                                                gvc.notifyDataChange(pvm.id);
                                            },
                                            default: vm.data.product_id.map(id => `${id}`),
                                            api: (data) => {
                                                return new Promise(resolve => {
                                                    ApiShop.getProduct({
                                                        page: 0,
                                                        limit: 99999,
                                                        productType: 'product',
                                                        filter_visible: 'true',
                                                        search: data.query,
                                                        orderBy: (() => {
                                                            switch (data.orderString) {
                                                                case 'max_price':
                                                                case 'min_price':
                                                                    return data.orderString;
                                                                default:
                                                                    return '';
                                                            }
                                                        })(),
                                                    }).then(data => {
                                                        resolve(data.response.data.map((product) => {
                                                            var _a;
                                                            return {
                                                                key: product.content.id + '',
                                                                value: product.content.title,
                                                                image: (_a = product.content.preview_image[0]) !== null && _a !== void 0 ? _a : BgWidget.noImageURL,
                                                            };
                                                        }));
                                                    });
                                                });
                                            },
                                            style: 'width: 100%;',
                                        });
                                    }))}
                              </div>
                              ${gvc.bindView({
                                        bind: pvm.id,
                                        view: () => {
                                            if (pvm.loading) {
                                                return '資料載入中';
                                            }
                                            if (pvm.productList.length === 0) {
                                                return '目前無選取任何商品';
                                            }
                                            return gvc.map(pvm.productList.map((opt, index) => {
                                                var _a;
                                                return html ` <div
                                        class="form-check-label c_updown_label"
                                        style="display: flex; align-items: center; min-height: 56px; gap: 8px;"
                                      >
                                        <span class="tx_normal">${index + 1} .</span>
                                        <div style="line-height: 40px;">
                                          <img
                                            class="rounded border me-1"
                                            src="${(_a = opt.image) !== null && _a !== void 0 ? _a : BgWidget.noImageURL}"
                                            style="width:40px; height:40px;"
                                          />
                                        </div>
                                        <span class="tx_normal">${opt.value}</span>
                                        ${opt.note ? html ` <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
                                      </div>`;
                                            }));
                                        },
                                        onCreate: () => {
                                            if (pvm.loading) {
                                                if (pvm.dataList.length === 0) {
                                                    pvm.productList = [];
                                                    pvm.loading = false;
                                                    setTimeout(() => gvc.notifyDataChange(pvm.id), 100);
                                                }
                                                else {
                                                    ApiShop.getProduct({
                                                        page: 0,
                                                        limit: 99999,
                                                        id_list: pvm.dataList.join(','),
                                                    }).then(data => {
                                                        pvm.productList = data.response.data.map((product) => {
                                                            var _a;
                                                            return {
                                                                key: product.content.id,
                                                                value: product.content.title,
                                                                image: (_a = product.content.preview_image[0]) !== null && _a !== void 0 ? _a : BgWidget.noImageURL,
                                                            };
                                                        });
                                                        pvm.loading = false;
                                                        gvc.notifyDataChange(pvm.id);
                                                    });
                                                }
                                            }
                                        },
                                    })}
                            </div>
                          `;
                                })()}`),
                                BgWidget.mainCard([
                                    html ` <div style="font-weight: 700;" class="mb-3">
                            搜尋引擎列表 ${BgWidget.languageInsignia(select_lan, 'margin-left:5px;')}
                          </div>
                          <div class="tx_normal fw-normal" style="margin: 18px 0 8px;">SEO 標題</div>
                          ${EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        default: (_b = language_data.seo.title) !== null && _b !== void 0 ? _b : '',
                                        placeHolder: '請輸入 SEO 標題',
                                        callback: text => {
                                            language_data.seo.title = text;
                                        },
                                    })}`,
                                    ,
                                    html ` <div class="tx_normal fw-normal" >SEO 描述</div>
                          ${EditorElem.editeText({
                                        gvc: gvc,
                                        title: '',
                                        default: (_c = language_data.seo.content) !== null && _c !== void 0 ? _c : '',
                                        placeHolder: '請輸入 SEO 描述',
                                        callback: text => {
                                            language_data.seo.content = text;
                                        },
                                    })}`,
                                    ,
                                    html ` <div class="tx_normal fw-normal" >SEO 圖片</div>
                          ${EditorElem.uploadImageContainer({
                                        gvc: gvc,
                                        title: '',
                                        def: (_d = vm.data.seo_image) !== null && _d !== void 0 ? _d : '',
                                        callback: text => {
                                            vm.data.seo_image = text;
                                        },
                                    })}`,
                                    ,
                                ].join(BgWidget.mbContainer(10))),
                            ].join(html ` <div style="margin-top: 24px;"></div>`),
                            ratio: 75,
                        }, {
                            html: [
                                BgWidget.summaryCard((() => {
                                    var _a;
                                    if ((vm.data.allCollections &&
                                        vm.data.allCollections.length > 0 &&
                                        vm.data.parentTitles &&
                                        vm.data.parentTitles.length > 0) ||
                                        vm.type === 'add') {
                                        return html ` <div class="tx_700" style="margin-bottom: 18px">父層</div>
                            ${BgWidget.select({
                                            gvc: gvc,
                                            callback: text => {
                                                vm.data.parentTitles[0] = text;
                                            },
                                            default: (_a = vm.data.parentTitles[0]) !== null && _a !== void 0 ? _a : '',
                                            options: vm.data.allCollections.map((item) => {
                                                return { key: item, value: item };
                                            }),
                                            style: 'margin: 8px 0;',
                                        })}`;
                                    }
                                    const id = gvc.glitter.getUUID();
                                    return html `
                          <div class="tx_700" style="margin-bottom: 18px">子分類</div>
                          ${gvc.bindView({
                                        bind: id,
                                        view: () => {
                                            return gvc.map(vm.data.subCollections.map((item) => {
                                                return html ` <div
                                    style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;"
                                  >
                                    ${item}<i
                                      class="fa-regular fa-trash cursor_pointer"
                                      onclick="${gvc.event(() => {
                                                    vm.data.subCollections = vm.data.subCollections.filter((sub) => item !== sub);
                                                    gvc.notifyDataChange(id);
                                                })}"
                                    ></i>
                                  </div>`;
                                            }));
                                        },
                                    })}
                        `;
                                })()),
                            ].join(html ` <div style="margin-top: 24px;"></div>`),
                            ratio: 25,
                        }),
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                ${obj.type === 'replace'
                            ? BgWidget.redButton('刪除類別', gvc.event(() => {
                                dialog.checkYesOrNot({
                                    text: '確定要刪除商品類別嗎？<br/>（若此類別包含子類別，也將一併刪除）',
                                    callback: bool => {
                                        if (bool) {
                                            dialog.dataLoading({ visible: true });
                                            ApiShop.deleteCollections({
                                                data: { data: [vm.data] },
                                                token: window.parent.config.token,
                                            }).then(res => {
                                                dialog.dataLoading({ visible: false });
                                                if (res.result) {
                                                    vm.type = 'list';
                                                    dialog.successMessage({ text: '更新成功' });
                                                }
                                                else {
                                                    dialog.errorMessage({ text: '更新失敗' });
                                                }
                                            });
                                        }
                                    },
                                });
                            }))
                            : ''}
                ${BgWidget.cancel(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                ${BgWidget.save(gvc.event(() => {
                            if (CheckInput.isEmpty(vm.data.title)) {
                                dialog.infoMessage({ text: '請填寫「分類標籤」' });
                                return;
                            }
                            const forbiddenRegex = /[,/\\]/;
                            if (forbiddenRegex.test(vm.data.title)) {
                                dialog.infoMessage({ text: '標題不可包含空白格與以下符號：<br />「 , 」「 / 」「 \\ 」' });
                                return;
                            }
                            const no_fill_language = window.parent.store_info.language_setting.support.find((dd) => {
                                return !vm.data.language_data[dd].seo.domain;
                            });
                            if (no_fill_language) {
                                select_lan = no_fill_language;
                                refresh();
                                dialog.infoMessage({ text: '請重新填寫「連結網址」' });
                                return;
                            }
                            if (window.parent.store_info.language_setting.support.find((dd) => {
                                if (!CheckInput.isChineseEnglishNumberHyphen(vm.data.language_data[dd].seo.domain)) {
                                    select_lan = dd;
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            })) {
                                refresh();
                                dialog.infoMessage({ text: '連結僅限使用中英文數字與連接號' });
                                return;
                            }
                            const validLangDomain = getValidLangDomain();
                            if (!validLangDomain.result) {
                                refresh();
                                dialog.warningMessage({ text: validLangDomain.text, callback: () => { } });
                                return;
                            }
                            dialog.dataLoading({ visible: true });
                            ApiShop.putCollections({
                                data: { replace: vm.data, original },
                                token: window.parent.config.token,
                            }).then(res => {
                                dialog.dataLoading({ visible: false });
                                if (res.result) {
                                    if (res.response.result) {
                                        vm.type = 'list';
                                        dialog.successMessage({ text: '更新成功' });
                                    }
                                    else {
                                        dialog.errorMessage({ text: res.response.message });
                                    }
                                }
                                else {
                                    dialog.errorMessage({ text: '更新失敗' });
                                }
                            });
                        }))}
              </div>`,
                    ].join(BgWidget.mbContainer(24)));
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingCollections);
