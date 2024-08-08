import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { OptionsItem } from '../backend-manager/bg-product.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';

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
                    const { title, array, product_id, seo_title, seo_content, seo_image } = col;
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
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('商品分類')}
                                    <div class="flex-fill"></div>
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
                                                allCollections: vm.allParents,
                                            };
                                            vm.type = 'add';
                                        })
                                    )}
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        BgWidget.tableV2({
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
                                                                const collections = updateCollections({ products, collections: data.response.value });
                                                                function getDatalist() {
                                                                    return collections.map((dd) => {
                                                                        return [
                                                                            {
                                                                                key: EditorElem.checkBoxOnly({
                                                                                    gvc: gvc,
                                                                                    def: !collections.find((dd: any) => !dd.checked),
                                                                                    callback: (result) => {
                                                                                        collections.map((dd: any) => {
                                                                                            dd.checked = result;
                                                                                        });
                                                                                        vmi.data = getDatalist();
                                                                                        vmi.callback();
                                                                                        gvc.notifyDataChange(vm.filterID);
                                                                                    },
                                                                                }),
                                                                                value: EditorElem.checkBoxOnly({
                                                                                    gvc: gvc,
                                                                                    def: dd.checked,
                                                                                    callback: (result) => {
                                                                                        dd.checked = result;
                                                                                        vmi.data = getDatalist();
                                                                                        vmi.callback();
                                                                                        gvc.notifyDataChange(vm.filterID);
                                                                                    },
                                                                                    style: 'height: 25px;',
                                                                                }),
                                                                            },
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
                                                                vmi.data = getDatalist();
                                                            } else {
                                                                vm.dataList = [];
                                                                vmi.data = [];
                                                            }
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
                                                BgWidget.searchPlace(
                                                    gvc.event((e) => {
                                                        vm.query = e.value;
                                                        gvc.notifyDataChange(vm.id);
                                                    }),
                                                    vm.query || '',
                                                    '搜尋類別'
                                                ),
                                                gvc.bindView(() => {
                                                    return {
                                                        bind: vm.filterID,
                                                        view: () => {
                                                            if (!vm.dataList || !vm.dataList.find((dd: any) => dd.checked)) {
                                                                return '';
                                                            }
                                                            const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                            return BgWidget.selNavbar({
                                                                count: selCount,
                                                                buttonList: [
                                                                    BgWidget.selEventButton(
                                                                        '批量移除',
                                                                        gvc.event(() => {
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
                                                                        })
                                                                    ),
                                                                ],
                                                            });
                                                        },
                                                        divCreate: () => {
                                                            return {
                                                                class: `d-flex align-items-center p-2 py-3 ${
                                                                    !vm.dataList ||
                                                                    !vm.dataList.find((dd: any) => {
                                                                        return dd.checked;
                                                                    })
                                                                        ? `d-none`
                                                                        : ``
                                                                }`,
                                                                style: ``,
                                                            };
                                                        },
                                                    };
                                                }),
                                            ].join(''),
                                            hiddenPageSplit: true,
                                        })
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
                    return BgWidget.container(
                        [
                            // 上層導覽
                            html`<div class="d-flex w-100 align-items-center">
                                ${BgWidget.goBack(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.title(obj.type === 'add' ? '新增類別' : '編輯類別')}
                            </div>`,
                            // 左右容器
                            html`<div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
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
                                                                                        data.response.data.map((product: { content: { id: number; title: string; preview_image: string[] } }) => {
                                                                                            return {
                                                                                                key: product.content.id + '',
                                                                                                value: product.content.title,
                                                                                                image: product.content.preview_image[0] ?? BgWidget.noImageURL,
                                                                                            };
                                                                                        })
                                                                                    );
                                                                                });
                                                                            });
                                                                        },
                                                                        style: 'width: 100%; background-position-x: 97.5%;',
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
                                                                        return html`<div
                                                                            class="form-check-label c_updown_label"
                                                                            style="display: flex; align-items: center; min-height: 56px; gap: 8px;"
                                                                        >
                                                                            <span class="tx_normal">${index + 1}.</span>
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
                                                                            pvm.productList = data.response.data.map((product: { content: { id: number; title: string; preview_image: string[] } }) => {
                                                                                return {
                                                                                    key: product.content.id,
                                                                                    value: product.content.title,
                                                                                    image: product.content.preview_image[0] ?? BgWidget.noImageURL,
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
                                    ].join(html`<div style="margin-top: 24px;"></div>`),
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
                                                                    return html`<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
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
                                    ].join(html`<div style="margin-top: 24px;"></div>`),
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
                                        const regex = /[\s,\/\\]+/g;
                                        if (vm.data.title === undefined || vm.data.title === '') {
                                            dialog.infoMessage({ text: '標題不可為空' });
                                            return;
                                        }

                                        if (regex.test(vm.data.title)) {
                                            dialog.infoMessage({ text: '標題不可包含空白格與以下符號：<br />「 , 」「 / 」「 \\ 」' });
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
                        ].join(html`<div style="margin-top: 24px;"></div>`),
                        BgWidget.getContainerWidth()
                    );
                },
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingCollections);
