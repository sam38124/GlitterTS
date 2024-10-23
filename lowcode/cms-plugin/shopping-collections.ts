import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { OptionsItem } from '../backend-manager/bg-product.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { CheckInput } from '../modules/checkInput.js';

type ViewModel = {
    id: string;
    filterID: string;
    type: 'list' | 'add' | 'replace';
    data: Collection;
    dataList: any;
    query: string;
    allParents: string[];
};

type Product = {
    id: number;
    content: {
        collection: string[];
    };
};

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
};

export class ShoppingCollections {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: ViewModel = {
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
            },
            dataList: undefined,
            query: '',
            allParents: [],
        };
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);

        const updateCollections = (data: { products: Product[]; collections: Collection[] }): Collection[] => {
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
                    const { title, array, product_id, seo_title, seo_content, seo_image, code } = col;
                    const flattenedCol: Collection = {
                        title,
                        array: [],
                        product_id: product_id ?? [],
                        checked: false,
                        parentTitles: parentTitles.length ? [...parentTitles] : [],
                        allCollections: parentTitles.length ? [...topLevelCollections] : [],
                        subCollections: array.map((subCol) => subCol.title),
                        seo_title: seo_title,
                        seo_content: seo_content,
                        seo_image: seo_image,
                        code: code,
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
        };

        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center" style="gap: 14px;">
                                    ${BgWidget.title('商品分類')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.grayButton(
                                        '編輯順序',
                                        gvc.event(() => {
                                            return BgWidget.infoDialog({
                                                gvc,
                                                title: '編輯順序',
                                                innerHTML: gvc.bindView(
                                                    (() => {
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
                                                                } else {
                                                                    return html`<div class="d-flex">
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
                                                                    gvc.addMtScript(
                                                                        [
                                                                            {
                                                                                src: 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js',
                                                                            },
                                                                        ],
                                                                        () => {
                                                                            const si = setInterval(() => {
                                                                                if ((window as any).Sortable !== undefined) {
                                                                                    loading = false;
                                                                                    clearInterval(si);
                                                                                    gvc.notifyDataChange(id);
                                                                                }
                                                                            }, 300);
                                                                        },
                                                                        () => {}
                                                                    );
                                                                } else {
                                                                    // 建立列表項目
                                                                    function createListItem(item: any, index: number): HTMLLIElement {
                                                                        const li = document.createElement('li');
                                                                        li.className = 'li-style';
                                                                        li.setAttribute('data-index', index.toString());
                                                                        li.setAttribute('data-parent', item.parentTitles[0] || 'root');
                                                                        li.innerHTML = `<span class="drag-icon"></span><span class="tx_normal">${item.title}</span>`;
                                                                        return li;
                                                                    }

                                                                    // 初始化 Sortable 功能
                                                                    function initSortable(containerId: string) {
                                                                        const el = document.querySelector(`#${containerId}`) as HTMLElement;
                                                                        (window as any).Sortable.create(el, {
                                                                            animation: 150,
                                                                            onEnd: function () {
                                                                                const items = [...el.children].map((child) => vm.dataList[parseInt(child.getAttribute('data-index') as string)]);
                                                                                ApiShop.sortCollections({
                                                                                    data: { list: items },
                                                                                    token: (window.parent as any).config.token,
                                                                                }).then((res) => {
                                                                                    if (res.result && !res.response) {
                                                                                        dialog.errorMessage({ text: '更改順序失敗' });
                                                                                    }
                                                                                });
                                                                            },
                                                                        });
                                                                    }

                                                                    function loadChildItems(parentTitle: string) {
                                                                        const childContainer = document.getElementById('child-list') as HTMLElement;
                                                                        childContainer.innerHTML = '';

                                                                        vm.dataList.forEach((item: any, index: number) => {
                                                                            if (item.parentTitles[0] === parentTitle) {
                                                                                childContainer.appendChild(createListItem(item, index));
                                                                            }
                                                                        });

                                                                        initSortable('child-list');
                                                                    }

                                                                    const parentContainer = document.getElementById('parent-list') as HTMLElement;

                                                                    // 初始化父層類別列表
                                                                    vm.dataList.forEach((item: any, index: number) => {
                                                                        if (item.parentTitles.length === 0) {
                                                                            // 如果是父層類別
                                                                            const li = createListItem(item, index);
                                                                            li.addEventListener('click', () => {
                                                                                loadChildItems(item.title);
                                                                                document.querySelectorAll('#parent-list li').forEach((li) => li.classList.remove('selectCol'));
                                                                                li.classList.add('selectCol');
                                                                            });
                                                                            parentContainer.appendChild(li);
                                                                        }
                                                                    });

                                                                    initSortable('parent-list');
                                                                }
                                                            },
                                                        };
                                                    })()
                                                ),
                                                closeCallback: () => {
                                                    gvc.notifyDataChange(vm.id);
                                                },
                                            });
                                        })
                                    )}
                                    ${BgWidget.darkButton(
                                        '新增',
                                        gvc.event(() => {
                                            vm.data = {
                                                title: '',
                                                array: [],
                                                product_id: [],
                                                parentTitles: [],
                                                subCollections: [],
                                                checked: false,
                                                seo_title: '',
                                                seo_content: '',
                                                seo_image: '',
                                                code: '',
                                                allCollections: vm.allParents,
                                            };
                                            vm.type = 'add';
                                        })
                                    )}
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        [
                                            BgWidget.searchPlace(
                                                gvc.event((e) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(vm.id);
                                                }),
                                                vm.query || '',
                                                '搜尋類別'
                                            ),
                                            BgWidget.tableV3({
                                                gvc: gvc,
                                                getData: (vmi) => {
                                                    ApiShop.getProduct({
                                                        page: 0,
                                                        limit: 999999,
                                                    }).then((d) => {
                                                        if (d.result) {
                                                            const products: Product[] = d.response.data;
                                                            ApiShop.getCollection().then((data) => {
                                                                if (data.result && data.response.value.length > 0) {
                                                                    vm.allParents = ['(無)'].concat(data.response.value.map((item: { title: string }) => item.title));
                                                                    const collections = updateCollections({
                                                                        products,
                                                                        collections: data.response.value,
                                                                    });

                                                                    function getDatalist() {
                                                                        return collections.map((dd) => {
                                                                            return [
                                                                                {
                                                                                    key: '標題',
                                                                                    value: html`<span class="fs-7"
                                                                                        >${(() => {
                                                                                            if (dd.parentTitles && dd.parentTitles.length > 0) {
                                                                                                return html`<i class="fa-solid fa-arrow-turn-down-right me-2"></i>${dd.parentTitles.join(' / ')} /
                                                                                                    ${dd.title}`;
                                                                                            }
                                                                                            return dd.title;
                                                                                        })()}</span
                                                                                    >`,
                                                                                },
                                                                                {
                                                                                    key: '商品數量',
                                                                                    value: html`<span class="fs-7">${dd.product_id ? dd.product_id.length : 0}</span>`,
                                                                                },
                                                                            ];
                                                                        });
                                                                    }
                                                                    vm.dataList = collections;
                                                                    vmi.tableData = getDatalist();
                                                                } else {
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
                                                                callback: (response) => {
                                                                    if (response) {
                                                                        dialog.dataLoading({ visible: true });
                                                                        ApiShop.deleteCollections({
                                                                            data: { data: vm.dataList.filter((dd: any) => dd.checked) },
                                                                            token: (window.parent as any).config.token,
                                                                        }).then((res) => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            if (res.result) {
                                                                                vm.query = '';
                                                                                vm.dataList = undefined;
                                                                                gvc.notifyDataChange(vm.id);
                                                                            } else {
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
                                        ].join('')
                                    )
                                )}
                                ${BgWidget.mbContainer(120)}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace') {
                        return this.editorDetail({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    } else {
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

    public static editorDetail(obj: { vm: ViewModel; gvc: GVC; type?: 'add' | 'replace' }) {
        const html = String.raw;
        const gvc = obj.gvc;
        const vm = obj.vm;
        const original = JSON.parse(JSON.stringify(vm.data));
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            const viewID = gvc.glitter.getUUID();
            return {
                bind: viewID,
                view: () => {
                    const prefixURL = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/collections/`;
                    return BgWidget.container(
                        [
                            // 上層導覽
                            html` <div class="d-flex w-100 align-items-center">
                                ${BgWidget.goBack(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.title(obj.type === 'add' ? '新增類別' : '編輯類別')}
                            </div>`,
                            // 左右容器
                            html` <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                                ${BgWidget.container(
                                    // 左容器
                                    [
                                        BgWidget.mainCard(html` <div class="tx_700" style="margin-bottom: 18px">分類標題</div>
                                            ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: vm.data.title,
                                                placeHolder: '請輸入分類名稱',
                                                callback: (text) => {
                                                    vm.data.title = text;
                                                },
                                            })}`),
                                        gvc.bindView(() => {
                                            const viewID = gvc.glitter.getUUID();
                                            return {
                                                bind: viewID,
                                                view: () => {
                                                    return BgWidget.mainCard(
                                                        [
                                                            html` <div class="tx_normal fw-normal mb-2">連結網址</div>`,
                                                            html` <div
                                                                style="  justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                                                    .body.clientWidth > 768
                                                                    ? 'gap: 18px; '
                                                                    : 'flex-direction: column; gap: 0px; '}"
                                                                class="w-100"
                                                            >
                                                                <div
                                                                    class="${document.body.clientWidth < 800 ? `w-100` : ``} justify-content-start justify-content-lg-center"
                                                                    style="padding: 9px 18px;background: #EAEAEA; justify-content: center; align-items: center; gap: 5px; display: flex"
                                                                >
                                                                    <div style="text-align: right; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
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
                                                                    value="${vm.data.code || ''}"
                                                                    onchange="${gvc.event((e) => {
                                                                        let text = e.value;
                                                                        if (!CheckInput.isChineseEnglishNumberHyphen(text)) {
                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                            dialog.infoMessage({ text: '連結僅限使用中英文數字與連接號' });
                                                                        } else {
                                                                            vm.data.code = text;
                                                                        }
                                                                        gvc.notifyDataChange(viewID);
                                                                    })}"
                                                                />
                                                            </div>`,
                                                            html` <div class="mt-2 mb-1">
                                                                <span class="tx_normal me-1">網址預覽</span>
                                                                ${BgWidget.greenNote(
                                                                    prefixURL + (vm.data.code ?? ''),
                                                                    gvc.event(() => {
                                                                        window.parent.open(prefixURL + (vm.data.code ?? ''), '_blank');
                                                                    })
                                                                )}
                                                            </div>`,
                                                        ].join('')
                                                    );
                                                },
                                                divCreate: {
                                                    class: `${gvc.glitter.ut.frSize(
                                                        {
                                                            sm: ``,
                                                        },
                                                        `p-0`
                                                    )}`,
                                                },
                                            };
                                        }),
                                        BgWidget.mainCard(html` <div class="tx_700" style="margin-bottom: 18px">商品</div>
                                            ${(() => {
                                                const pvm = {
                                                    id: gvc.glitter.getUUID(),
                                                    loading: true,
                                                    dataList: vm.data.product_id,
                                                    productList: [],
                                                };
                                                return html`
                                                    <div class="d-flex flex-column p-2" style="gap: 18px;">
                                                        <div class="d-flex align-items-center gray-bottom-line-18" style="justify-content: space-between;">
                                                            <div class="form-check-label c_updown_label">
                                                                <div class="tx_normal">商品名稱</div>
                                                            </div>
                                                            ${BgWidget.grayButton(
                                                                '選擇商品',
                                                                gvc.event(() => {
                                                                    BgWidget.selectDropDialog({
                                                                        gvc: gvc,
                                                                        title: '搜尋商品',
                                                                        tag: 'select_users',
                                                                        updownOptions: FilterOptions.productOrderBy,
                                                                        callback: (value) => {
                                                                            pvm.dataList = value;
                                                                            vm.data.product_id = value;
                                                                            pvm.loading = true;
                                                                            gvc.notifyDataChange(pvm.id);
                                                                        },
                                                                        default: vm.data.product_id.map((id) => `${id}`),
                                                                        api: (data: { query: string; orderString: string }) => {
                                                                            return new Promise((resolve) => {
                                                                                ApiShop.getProduct({
                                                                                    page: 0,
                                                                                    limit: 99999,
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
                                                                                }).then((data) => {
                                                                                    resolve(
                                                                                        data.response.data.map(
                                                                                            (product: {
                                                                                                content: {
                                                                                                    id: number;
                                                                                                    title: string;
                                                                                                    preview_image: string[];
                                                                                                };
                                                                                            }) => {
                                                                                                return {
                                                                                                    key: product.content.id + '',
                                                                                                    value: product.content.title,
                                                                                                    image: product.content.preview_image[0] ?? BgWidget.noImageURL,
                                                                                                };
                                                                                            }
                                                                                        )
                                                                                    );
                                                                                });
                                                                            });
                                                                        },
                                                                        style: 'width: 100%;',
                                                                    });
                                                                })
                                                            )}
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
                                                                return gvc.map(
                                                                    pvm.productList.map((opt: OptionsItem, index: number) => {
                                                                        return html` <div
                                                                            class="form-check-label c_updown_label"
                                                                            style="display: flex; align-items: center; min-height: 56px; gap: 8px;"
                                                                        >
                                                                            <span class="tx_normal">${index + 1} .</span>
                                                                            <div style="line-height: 40px;">
                                                                                <img class="rounded border me-1" src="${opt.image ?? BgWidget.noImageURL}" style="width:40px; height:40px;" />
                                                                            </div>
                                                                            <span class="tx_normal">${opt.value}</span>
                                                                            ${opt.note ? html` <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
                                                                        </div>`;
                                                                    })
                                                                );
                                                            },
                                                            onCreate: () => {
                                                                if (pvm.loading) {
                                                                    if (pvm.dataList.length === 0) {
                                                                        pvm.productList = [];
                                                                        pvm.loading = false;
                                                                        setTimeout(() => gvc.notifyDataChange(pvm.id), 100);
                                                                    } else {
                                                                        ApiShop.getProduct({
                                                                            page: 0,
                                                                            limit: 99999,
                                                                            id_list: pvm.dataList.join(','),
                                                                        }).then((data) => {
                                                                            pvm.productList = data.response.data.map(
                                                                                (product: {
                                                                                    content: {
                                                                                        id: number;
                                                                                        title: string;
                                                                                        preview_image: string[];
                                                                                    };
                                                                                }) => {
                                                                                    return {
                                                                                        key: product.content.id,
                                                                                        value: product.content.title,
                                                                                        image: product.content.preview_image[0] ?? BgWidget.noImageURL,
                                                                                    };
                                                                                }
                                                                            );
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
                                        BgWidget.mainCard(
                                            [
                                                html` <div class="tx_700" style="margin-bottom: 18px">SEO 標題</div>
                                                    ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        default: vm.data.seo_title ?? '',
                                                        placeHolder: '請輸入 SEO 標題',
                                                        callback: (text) => {
                                                            vm.data.seo_title = text;
                                                        },
                                                    })}`,
                                                ,
                                                html` <div class="tx_700" style="margin-bottom: 18px">SEO 描述</div>
                                                    ${EditorElem.editeText({
                                                        gvc: gvc,
                                                        title: '',
                                                        default: vm.data.seo_content ?? '',
                                                        placeHolder: '請輸入 SEO 描述',
                                                        callback: (text) => {
                                                            vm.data.seo_content = text;
                                                        },
                                                    })}`,
                                                ,
                                                html` <div class="tx_700" style="margin-bottom: 18px">SEO 圖片</div>
                                                    ${EditorElem.uploadImageContainer({
                                                        gvc: gvc,
                                                        title: '',
                                                        def: vm.data.seo_image ?? '',
                                                        callback: (text) => {
                                                            vm.data.seo_image = text;
                                                        },
                                                    })}`,
                                                ,
                                            ].join(BgWidget.mbContainer(18))
                                        ),
                                    ].join(html` <div style="margin-top: 24px;"></div>`),
                                    undefined,
                                    'padding: 0 ; margin: 0 !important; width: 68.5%;'
                                )}
                                ${BgWidget.container(
                                    // 右容器
                                    [
                                        BgWidget.mainCard(
                                            (() => {
                                                if ((vm.data.allCollections && vm.data.allCollections.length > 0 && vm.data.parentTitles && vm.data.parentTitles.length > 0) || vm.type === 'add') {
                                                    return html` <div class="tx_700" style="margin-bottom: 18px">父層</div>
                                                        ${BgWidget.select({
                                                            gvc: gvc,
                                                            callback: (text) => {
                                                                vm.data.parentTitles[0] = text;
                                                            },
                                                            default: vm.data.parentTitles[0] ?? '',
                                                            options: vm.data.allCollections.map((item: string) => {
                                                                return { key: item, value: item };
                                                            }),
                                                            style: 'margin: 8px 0;',
                                                        })}`;
                                                }
                                                const id = gvc.glitter.getUUID();
                                                return html`
                                                    <div class="tx_700" style="margin-bottom: 18px">子分類</div>
                                                    ${gvc.bindView({
                                                        bind: id,
                                                        view: () => {
                                                            return gvc.map(
                                                                vm.data.subCollections.map((item: string) => {
                                                                    return html` <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                                                                        ${item}<i
                                                                            class="fa-regular fa-trash cursor_pointer"
                                                                            onclick="${gvc.event(() => {
                                                                                vm.data.subCollections = vm.data.subCollections.filter((sub: string) => item !== sub);
                                                                                gvc.notifyDataChange(id);
                                                                            })}"
                                                                        ></i>
                                                                    </div>`;
                                                                })
                                                            );
                                                        },
                                                    })}
                                                `;
                                            })()
                                        ),
                                    ].join(html` <div style="margin-top: 24px;"></div>`),
                                    undefined,
                                    'padding: 0 ; margin: 0 !important; width: 26.5%;'
                                )}
                            </div>`,
                            // 空白容器
                            BgWidget.mbContainer(240),
                            // 儲存資料
                            html` <div class="update-bar-container">
                                ${obj.type === 'replace'
                                    ? BgWidget.redButton(
                                          '刪除類別',
                                          gvc.event(() => {
                                              dialog.checkYesOrNot({
                                                  text: '確定要刪除商品類別嗎？<br/>（若此類別包含子類別，也將一併刪除）',
                                                  callback: (bool) => {
                                                      if (bool) {
                                                          dialog.dataLoading({ visible: true });
                                                          ApiShop.deleteCollections({
                                                              data: { data: [vm.data] },
                                                              token: (window.parent as any).config.token,
                                                          }).then((res) => {
                                                              dialog.dataLoading({ visible: false });
                                                              if (res.result) {
                                                                  vm.type = 'list';
                                                                  dialog.successMessage({ text: '更新成功' });
                                                              } else {
                                                                  dialog.errorMessage({ text: '更新失敗' });
                                                              }
                                                          });
                                                      }
                                                  },
                                              });
                                          })
                                      )
                                    : ''}
                                ${BgWidget.cancel(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.save(
                                    gvc.event(() => {
                                        if (CheckInput.isEmpty(vm.data.title)) {
                                            dialog.infoMessage({ text: '標題不可為空' });
                                            return;
                                        }

                                        const regexTitle = /[\s,\/\\]+/g;
                                        if (regexTitle.test(vm.data.title)) {
                                            dialog.infoMessage({ text: '標題不可包含空白格與以下符號：<br />「 , 」「 / 」「 \\ 」' });
                                            return;
                                        }

                                        if (CheckInput.isEmpty(vm.data.code)) {
                                            dialog.infoMessage({ text: '請輸入分類連結' });
                                            return;
                                        }

                                        if (!CheckInput.isChineseEnglishNumberHyphen(vm.data.code)) {
                                            dialog.infoMessage({ text: '連結僅限使用中英文數字與連接號' });
                                            return;
                                        }

                                        dialog.dataLoading({ visible: true });
                                        ApiShop.putCollections({
                                            data: { replace: vm.data, original },
                                            token: (window.parent as any).config.token,
                                        }).then((res) => {
                                            dialog.dataLoading({ visible: false });
                                            if (res.result) {
                                                if (res.response.result) {
                                                    vm.type = 'list';
                                                    dialog.successMessage({ text: '更新成功' });
                                                } else {
                                                    dialog.errorMessage({ text: res.response.message });
                                                }
                                            } else {
                                                dialog.errorMessage({ text: '更新失敗' });
                                            }
                                        });
                                    })
                                )}
                            </div>`,
                        ].join(html` <div style="margin-top: 24px;"></div>`),
                        BgWidget.getContainerWidth()
                    );
                },
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingCollections);
