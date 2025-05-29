import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgProduct } from '../backend-manager/bg-product.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { CheckInput } from '../modules/checkInput.js';
import { Language } from '../glitter-base/global/language.js';
const html = String.raw;
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
            collectionList: [],
            query: '',
            allParents: [],
            cloneTarget: null,
        };
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
                        vm.cloneTarget = null;
                        return BgWidget.container(html `
              <div class="title-container">
                ${BgWidget.title('商品分類')}
                <div class="flex-fill"></div>
                <div class="d-flex gap-2">
                  ${BgWidget.grayButton('編輯順序', gvc.event(() => {
                            const cloneCollectionList = vm.collectionList.slice();
                            return BgWidget.settingDialog({
                                gvc,
                                title: '編輯順序',
                                width: 700,
                                innerHTML: (iGVC) => {
                                    const id = glitter.getUUID();
                                    let loading = true;
                                    this.addStyle(iGVC);
                                    return iGVC.bindView({
                                        bind: id,
                                        view: () => {
                                            if (loading) {
                                                return BgWidget.spinner();
                                            }
                                            return html `
                                <div class="p-2">
                                  ${BgWidget.grayNote('提示：左鍵拖曳可排列順序，點擊可顯示向下一層類別')}
                                  <div class="d-flex justify-content-start mt-3">
                                    <div class="layer-container">
                                      ${[0, 1, 2]
                                                .map(depth => {
                                                const title = ['第一層類別', '第二層類別', '第三層類別'][depth];
                                                return html ` <div class="flex-1 layer-block">
                                            <div class="tx_700 fs-4 text-center mb-2">${title}</div>
                                            <ul class="ul-style" id="layer-list-${depth}"></ul>
                                          </div>`;
                                            })
                                                .join('')}
                                    </div>
                                  </div>
                                </div>
                              `;
                                        },
                                        onCreate: () => {
                                            var _a;
                                            if (loading) {
                                                iGVC.addMtScript([{ src: 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js' }], () => {
                                                    const si = setInterval(() => {
                                                        if (window.parent.Sortable !== undefined) {
                                                            loading = false;
                                                            clearInterval(si);
                                                            iGVC.notifyDataChange(id);
                                                        }
                                                    }, 300);
                                                }, () => { });
                                            }
                                            else {
                                                const document = window.parent.document;
                                                function createListItem(item, index) {
                                                    var _a;
                                                    const li = document.createElement('li');
                                                    li.className = 'li-style';
                                                    li.setAttribute('data-index', index.toString());
                                                    li.setAttribute('data-path', [...((_a = item.parentTitles) !== null && _a !== void 0 ? _a : []), item.title].join(' / '));
                                                    li.innerHTML = `<span class="drag-icon"></span><span class="tx_normal">${item.title}</span>`;
                                                    li.addEventListener('click', (e) => {
                                                        var _a;
                                                        const target = e.currentTarget;
                                                        const ul = target.closest('ul');
                                                        if (ul) {
                                                            Array.from(ul.children).forEach((element) => {
                                                                element.style.backgroundColor = '#dddddd';
                                                            });
                                                        }
                                                        target.style.backgroundColor = '#d8ecda';
                                                        loadChildLayer([...((_a = item.parentTitles) !== null && _a !== void 0 ? _a : []), item.title]);
                                                    });
                                                    return li;
                                                }
                                                function initSortable(containerId) {
                                                    const el = document.getElementById(containerId);
                                                    window.parent.Sortable.create(el, {
                                                        animation: 200,
                                                        scroll: true,
                                                        onEnd: () => {
                                                            const items = [...el.children].map(child => { var _a; return (_a = vm.dataList) === null || _a === void 0 ? void 0 : _a[parseInt(child.getAttribute('data-index'))]; });
                                                            vm.collectionList = ShoppingCollections.sortedCollectionConfig(vm.collectionList, items);
                                                        },
                                                    });
                                                }
                                                function loadChildLayer(parentPath) {
                                                    var _a;
                                                    const nextDepth = parentPath.length;
                                                    const nextId = `layer-list-${nextDepth}`;
                                                    for (let i = nextDepth; i < 3; i++) {
                                                        const el = document.getElementById(`layer-list-${i}`);
                                                        if (el)
                                                            el.innerHTML = '';
                                                    }
                                                    const container = document.getElementById(nextId);
                                                    container.innerHTML = '';
                                                    (_a = vm.dataList) === null || _a === void 0 ? void 0 : _a.forEach((item, index) => {
                                                        var _a;
                                                        const path = (_a = item.parentTitles) !== null && _a !== void 0 ? _a : [];
                                                        if (path.length === parentPath.length &&
                                                            path.every((p, i) => p === parentPath[i])) {
                                                            container.appendChild(createListItem(item, index));
                                                            container.appendChild(createListItem(item, index));
                                                            container.appendChild(createListItem(item, index));
                                                            container.appendChild(createListItem(item, index));
                                                            container.appendChild(createListItem(item, index));
                                                        }
                                                    });
                                                    initSortable(nextId);
                                                }
                                                const root = document.getElementById('layer-list-0');
                                                root.innerHTML = '';
                                                (_a = vm.dataList) === null || _a === void 0 ? void 0 : _a.forEach((item, index) => {
                                                    var _a;
                                                    if (((_a = item.parentTitles) !== null && _a !== void 0 ? _a : []).length === 0) {
                                                        root.appendChild(createListItem(item, index));
                                                    }
                                                });
                                                initSortable('layer-list-0');
                                            }
                                        },
                                    });
                                },
                                footer_html: (fGVC) => {
                                    return [
                                        BgWidget.cancel(fGVC.event(() => {
                                            vm.collectionList = cloneCollectionList;
                                            fGVC.closeDialog();
                                        })),
                                        BgWidget.save(fGVC.event(() => {
                                            dialog.dataLoading({ visible: true });
                                            ApiShop.sortCollections({
                                                data: { list: vm.collectionList },
                                                token: window.parent.config.token,
                                            }).then(res => {
                                                dialog.dataLoading({ visible: false });
                                                if (res.result && !res.response) {
                                                    dialog.errorMessage({ text: '更改順序失敗' });
                                                }
                                                else {
                                                    dialog.successMessage({ text: '更改順序成功' });
                                                    fGVC.closeDialog();
                                                    gvc.notifyDataChange(vm.id);
                                                }
                                            });
                                        })),
                                    ].join('');
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
                                                    vm.collectionList = data.response.value;
                                                    vm.allParents = [this.undefinedOption].concat(data.response.value.map((item) => item.title));
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
                                                                }).then(() => {
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
                                          ${(() => {
                                                                        switch (true) {
                                                                            case dd.parentTitles.length === 1:
                                                                                return BgWidget.customInsignia('2', {
                                                                                    size: 'sm',
                                                                                    style: 'background: #c8e6c9; width: 25px;',
                                                                                });
                                                                            case dd.parentTitles.length === 2:
                                                                                return BgWidget.customInsignia('3', {
                                                                                    size: 'sm',
                                                                                    style: 'background: #a5d6a7; width: 30px;',
                                                                                });
                                                                            default:
                                                                                return BgWidget.customInsignia('1', {
                                                                                    size: 'sm',
                                                                                    style: 'background: #a5d6a7; width: 20px;',
                                                                                });
                                                                        }
                                                                    })()}
                                          ${dd.title}
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
                                rowClick: (_, index) => {
                                    if (vm.dataList) {
                                        vm.data = vm.dataList[index];
                                    }
                                    vm.type = 'replace';
                                },
                                filter: [
                                    {
                                        name: '批量移除',
                                        event: () => {
                                            dialog.checkYesOrNot({
                                                text: '確定要刪除商品類別嗎？<br/>（若此類別包含子類別，也將一併刪除）',
                                                callback: response => {
                                                    var _a;
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        ApiShop.deleteCollections({
                                                            data: { data: (_a = vm.dataList) === null || _a === void 0 ? void 0 : _a.filter(dd => dd.checked) },
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
                        vm.cloneTarget = null;
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
    static addStyle(gvc) {
        gvc.addStyle(`
      .layer-container {
        display: flex;
        gap: 18px;
        margin-right: 20px;
      }

      .ul-style {
        list-style-type: none;
        padding: 8px;
        margin: 0;
        min-height: 200px;
        border: 1px solid #ccc;
        border-radius: 10px;
        width: 190px;
        height: 380px;
        overflow-y: auto;
      }

      .li-style {
        width: 100%;
        padding: 6px 10px;
        margin-bottom: 6px;
        background-color: #dddddd;
        cursor: move;
        display: flex;
        align-items: center;
        border-radius: 10px;
      }

      .drag-icon {
        margin-right: 10px;
        cursor: move;
      }

      .drag-icon::before {
        content: '⠿';
        font-size: 20px;
        cursor: grab;
      }
    `);
    }
    static editorDetail(obj) {
        var _a;
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vm = obj.vm;
        const dialog = new ShareDialog(glitter);
        const original = JSON.parse(JSON.stringify(vm.data));
        const originDataList = JSON.parse(JSON.stringify((_a = vm.dataList) !== null && _a !== void 0 ? _a : []));
        const language_setting = window.parent.store_info.language_setting;
        let select_lan = language_setting.def;
        function getValidLangDomain() {
            const supports = language_setting.support;
            const targetData = vm.cloneTarget && vm.cloneTarget.title === vm.data.title ? vm.cloneTarget : original;
            const dataList = originDataList.filter(item => {
                return [...item.parentTitles, item.title].join('') !== [...targetData.parentTitles, targetData.title].join('');
            });
            const lagDomain = supports.map(lang => {
                const domainMap = dataList === null || dataList === void 0 ? void 0 : dataList.map(item => {
                    try {
                        return item.language_data ? item.language_data[lang].seo.domain : '';
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
                    const text = Language.getLanguageText({
                        local: true,
                        compare: data.lang,
                    });
                    return {
                        result: false,
                        text: `語系「${text}」的連結網址「${vm.data.language_data[data.lang].seo.domain}」<br />已存在於其他類別，請更換連結網址`,
                    };
                }
            }
            return { result: true, text: '' };
        }
        return gvc.bindView(() => {
            const viewID = gvc.glitter.getUUID();
            const domainID = gvc.glitter.getUUID();
            const refresh = () => gvc.notifyDataChange(viewID);
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
                <div class="d-flex align-items-center gap-2">
                  ${BgWidget.grayButton(html `<div class="d-flex align-items-center gap-2">
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
                                        return {
                                            bind: id,
                                            view: () => {
                                                return html ` <div
                                    style="position: relative; word-break: break-all; white-space: normal;"
                                  >
                                    ${BgWidget.grayNote('前往商店設定->商店訊息中，設定支援的語言。')}
                                    ${gvc.bindView(() => {
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
                                                                .sort(dd => {
                                                                return dd.key === select_lan ? -1 : 1;
                                                            });
                                                            return html ` <div
                                            class="d-flex mt-3 flex-wrap align-items-center justify-content-center"
                                            style="gap:15px;"
                                          >
                                            ${sup
                                                                .map(dd => {
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
                                                                    ? 'd-none'
                                                                    : ''}"
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
                                        };
                                    })());
                                },
                                title: '切換語系',
                                footer_html: gvc => {
                                    return '';
                                },
                                width: 300,
                            });
                        }))}
                  ${vm.type === 'add'
                            ? BgWidget.grayButton('代入現有類別', gvc.event(() => {
                                BgProduct.collectionsDialog({
                                    gvc: gvc,
                                    default: [],
                                    callback: value => {
                                        var _a;
                                        const data = (_a = vm.dataList) === null || _a === void 0 ? void 0 : _a.find(item => [...item.parentTitles, item.title].join(' / ') === value[0]);
                                        if (data) {
                                            vm.data = data;
                                            vm.cloneTarget = structuredClone(data);
                                        }
                                        gvc.notifyDataChange(viewID);
                                    },
                                    single: true,
                                });
                            }))
                            : ''}
                </div>
              </div>`,
                        BgWidget.container1x2({
                            html: [
                                BgWidget.mainCard(html ` <div class="tx_700" style="margin-bottom: 12px">分類標籤 ${BgWidget.requiredStar()}</div>
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
                                    placeHolder: vm.data.title || '預設為「分類標籤」輸入值',
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
                                                html ` <div class="tx_700 mb-2">
                                連結網址 ${BgWidget.requiredStar()} ${BgWidget.languageInsignia(select_lan)}
                              </div>`,
                                                gvc.bindView({
                                                    bind: domainID,
                                                    view: () => {
                                                        return html `<div
                                      class="${document.body.clientWidth < 800
                                                            ? 'w-100'
                                                            : ''} justify-content-start justify-content-lg-center"
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
                                                        style: `width: 100%; justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document.body.clientWidth > 768 ? 'gap: 18px;' : 'flex-direction: column; gap: 0px;'}`,
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
                                            class: `${gvc.glitter.ut.frSize({ sm: '' }, 'p-0')}`,
                                        },
                                    };
                                }),
                                BgWidget.mainCard((() => {
                                    const pvm = {
                                        id: gvc.glitter.getUUID(),
                                        loading: true,
                                        dataList: vm.data.product_id,
                                        productList: [],
                                    };
                                    return html `
                          <div class="d-flex flex-column">
                            <div class="d-flex align-items-center" style="justify-content: space-between;">
                              <div class="tx_700" style="margin-bottom: 12px">商品</div>
                              ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                        BgProduct.productsDialog({
                                            gvc: gvc,
                                            default: vm.data.product_id,
                                            callback: value => {
                                                pvm.dataList = value;
                                                vm.data.product_id = value;
                                                pvm.loading = true;
                                                gvc.notifyDataChange(pvm.id);
                                            },
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
                                                return html ` <div
                                      class="form-check-label c_updown_label"
                                      style="display: flex; align-items: center; min-height: 60px; gap: 8px;"
                                    >
                                      <span class="tx_normal" style="min-width: 30px;">${index + 1}.</span>
                                      ${BgWidget.validImageBox({ gvc, image: opt.image, width: 40 })}
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
                                })()),
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
                                    html ` <div class="tx_normal fw-normal">SEO 描述</div>
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
                                    html ` <div class="tx_normal fw-normal">SEO 圖片</div>
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
                            ].join(BgWidget.mbContainer(24)),
                            ratio: 75,
                        }, {
                            html: gvc.bindView((() => {
                                const summaryId = glitter.getUUID();
                                return {
                                    bind: summaryId,
                                    view: () => {
                                        function firstParentView() {
                                            var _a;
                                            return [
                                                html `<div class="tx_700" style="margin-bottom: 12px">父層</div>`,
                                                BgWidget.select({
                                                    gvc: gvc,
                                                    callback: text => {
                                                        vm.data.parentTitles[0] = text;
                                                        gvc.notifyDataChange(summaryId);
                                                    },
                                                    default: (_a = vm.data.parentTitles[0]) !== null && _a !== void 0 ? _a : '',
                                                    options: vm.data.allCollections.map((item) => {
                                                        return { key: item, value: item };
                                                    }),
                                                    style: 'margin: 8px 0;',
                                                    readonly: vm.type === 'replace',
                                                }),
                                                BgWidget.mbContainer(12),
                                            ].join('');
                                        }
                                        function secondParentView(subs) {
                                            var _a;
                                            return [
                                                html `<div class="tx_700" style="margin-bottom: 12px">第二層</div>`,
                                                BgWidget.select({
                                                    gvc: gvc,
                                                    callback: text => {
                                                        vm.data.parentTitles[1] = text;
                                                        gvc.notifyDataChange(summaryId);
                                                    },
                                                    default: (_a = vm.data.parentTitles[1]) !== null && _a !== void 0 ? _a : '',
                                                    options: [ShoppingCollections.undefinedOption, ...subs].map((item) => {
                                                        return { key: item, value: item };
                                                    }),
                                                    style: 'margin: 8px 0;',
                                                    readonly: vm.type === 'replace',
                                                }),
                                            ].join('');
                                        }
                                        function editSubCollection() {
                                            const id = gvc.glitter.getUUID();
                                            if (!vm.data.subCollections || vm.data.subCollections.length === 0) {
                                                return '';
                                            }
                                            return [
                                                html `<div class="tx_700" style="margin-bottom: 12px">子分類</div>`,
                                                gvc.bindView({
                                                    bind: id,
                                                    view: () => vm.data.subCollections
                                                        .map((item) => {
                                                        return html `<div class="d-flex align-items-center justify-content-between mt-2">
                                        ${item}<i
                                          class="fa-regular fa-trash cursor_pointer"
                                          onclick="${gvc.event(() => {
                                                            vm.data.subCollections = vm.data.subCollections.filter((sub) => item !== sub);
                                                            gvc.notifyDataChange(id);
                                                        })}"
                                        ></i>
                                      </div>`;
                                                    })
                                                        .join(''),
                                                }),
                                            ].join('');
                                        }
                                        function levelSetting() {
                                            var _a;
                                            const parentTitles = Array.isArray(vm.data.parentTitles) ? vm.data.parentTitles : [];
                                            const parentTab = (_a = vm.dataList) === null || _a === void 0 ? void 0 : _a.find(item => item.title === parentTitles[0]);
                                            const parentSubs = parentTab && Array.isArray(parentTab.subCollections) ? parentTab.subCollections : [];
                                            if (vm.type === 'add') {
                                                return [
                                                    firstParentView(),
                                                    parentSubs.length > 0 ? secondParentView(parentSubs) : '',
                                                ].join('');
                                            }
                                            if (vm.type === 'replace' && parentTitles.length > 0) {
                                                return [
                                                    firstParentView(),
                                                    parentTitles[1] && parentSubs.length > 0 ? secondParentView(parentSubs) : '',
                                                    editSubCollection(),
                                                ].join('');
                                            }
                                            return editSubCollection();
                                        }
                                        return [BgWidget.summaryCard(levelSetting())].join(BgWidget.mbContainer(24));
                                    },
                                };
                            })()),
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
                            const updateDataPath = [...vm.data.parentTitles, vm.data.title].join('');
                            if ([...original.parentTitles, original.title].join('') !== updateDataPath) {
                                const somePath = originDataList.some(item => {
                                    return [...item.parentTitles, item.title].join('') === updateDataPath;
                                });
                                if (somePath) {
                                    dialog.infoMessage({ text: '此「分類標籤」已存在' });
                                    return;
                                }
                            }
                            const forbiddenRegex = /[,/\\]/;
                            if (forbiddenRegex.test(vm.data.title)) {
                                dialog.infoMessage({ text: '標題不可包含空白格與以下符號：<br />「 , 」「 / 」「 \\ 」' });
                                return;
                            }
                            const no_fill_language = window.parent.store_info.language_setting.support.find((dd) => !vm.data.language_data[dd].seo.domain);
                            if (no_fill_language) {
                                select_lan = no_fill_language;
                                refresh();
                                dialog.infoMessage({ text: '請重新填寫「連結網址」' });
                                return;
                            }
                            if (window.parent.store_info.language_setting.support.find((dd) => {
                                if (CheckInput.isChineseEnglishNumberHyphen(vm.data.language_data[dd].seo.domain)) {
                                    return false;
                                }
                                select_lan = dd;
                                return true;
                            })) {
                                refresh();
                                dialog.infoMessage({ text: '連結僅限使用中英文數字與連接號' });
                                return;
                            }
                            const validLangDomain = getValidLangDomain();
                            if (!validLangDomain.result) {
                                refresh();
                                dialog.infoMessage({ text: validLangDomain.text });
                                return;
                            }
                            function putEvent() {
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
                            }
                            if (vm.cloneTarget && vm.cloneTarget.title === vm.data.title) {
                                dialog.checkYesOrNot({
                                    text: [
                                        '本次新增的「分類標籤」與代入的類別標籤相同，',
                                        '將刪除原本存在的類別，並新增本次的類別資料，',
                                        '<b>附帶的子類別將不會保留</b>，確定要執行嗎？',
                                    ].join('<br/>'),
                                    callback: bool => {
                                        if (bool && vm.cloneTarget) {
                                            ApiShop.deleteCollections({
                                                data: { data: [vm.cloneTarget] },
                                                token: window.parent.config.token,
                                            }).then(() => {
                                                putEvent();
                                            });
                                        }
                                    },
                                });
                                return;
                            }
                            putEvent();
                        }))}
              </div>`,
                    ].join(BgWidget.mbContainer(24)));
                },
            };
        });
    }
    static sortedCollectionConfig(config, dataArray) {
        var _a;
        if (!(dataArray === null || dataArray === void 0 ? void 0 : dataArray.length))
            return config;
        const parentTitles = (_a = dataArray[0].parentTitles) !== null && _a !== void 0 ? _a : [];
        function updateTree(currentLevel, depth) {
            if (depth === parentTitles.length) {
                const sorted = dataArray
                    .map(item => {
                    return currentLevel.find(c => c.title === item.title);
                })
                    .filter(Boolean);
                for (let i = 0; i < sorted.length; i++) {
                    currentLevel[i] = sorted[i];
                }
                currentLevel.length = sorted.length;
                return true;
            }
            const next = currentLevel.find(c => c.title === parentTitles[depth]);
            if (!next)
                return false;
            return updateTree(next.array, depth + 1);
        }
        const updated = updateTree(config, 0);
        if (!updated)
            throw new Error('找不到對應的父節點進行排序');
        return config;
    }
}
ShoppingCollections.undefinedOption = '請選擇項目';
window.glitter.setModule(import.meta.url, ShoppingCollections);
