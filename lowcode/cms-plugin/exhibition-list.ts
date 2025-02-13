import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiStock } from '../glitter-base/route/stock.js';
import { CheckInput } from '../modules/checkInput.js';
import { Tool } from '../modules/tool.js';

const html = String.raw;

type ExhibitionObj = {
    variantID: number;
    storeFrom: string;
    saleStock: number;
    salePrice: number;
    personBuyLimit: number;
};

export type ExhibitionData = {
    id: string;
    name: string;
    address: string;
    startDate: string;
    endDate: string;
    note: string;
    dataList: ExhibitionObj[];
};

type VM = {
    id: string;
    tableId: string;
    type: 'list' | 'create' | 'replace';
    data: ExhibitionData;
    dataList: any;
    filter: any;
    query: string;
    queryType: string;
    orderString: string;
    storeData: any;
};

export class ExhibitionManager {
    static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: VM = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            data: ExhibitionManager.emptyData(),
            dataList: [],
            query: '',
            queryType: 'name',
            filter: {},
            orderString: '',
            storeData: {},
        };

        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return this.list(gvc, vm);
                }

                if (vm.type === 'replace') {
                    return this.detailPage(gvc, vm, 'replace');
                }

                if (vm.type === 'create') {
                    vm.data = ExhibitionManager.emptyData();
                    return this.detailPage(gvc, vm, 'create');
                }

                return '';
            },
        });
    }

    static emptyData(): ExhibitionData {
        return {
            id: '',
            name: '',
            address: '',
            startDate: '',
            endDate: '',
            note: '',
            dataList: [],
        };
    }

    static list(gvc: GVC, vm: VM) {
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.exhibitionFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi: any = undefined;

        const stateBadge = {
            beforeStart: BgWidget.warningInsignia('準備中'),
            afterEnd: BgWidget.secondaryInsignia('已結束'),
            inRange: BgWidget.successInsignia('展覽中'),
        };

        function getTimeState(startDate: string, endDate: string): 'beforeStart' | 'inRange' | 'afterEnd' {
            const now = new Date();
            const start = new Date(`${startDate}T00:00:00`);
            const end = new Date(`${endDate}T23:59:59`);

            if (now < start) return 'beforeStart'; // 待上架
            if (now > end) return 'afterEnd'; // 下架
            return 'inRange'; // 上架
        }

        function getDatalist() {
            return vm.dataList.map((dd: ExhibitionData) => {
                return [
                    {
                        key: '展場名稱',
                        value: `<span class="fs-7">${dd.name}</span>`,
                    },
                    {
                        key: '展場時間',
                        value: `<span class="fs-7">${`${dd.startDate} ~ ${dd.endDate}`}</span>`,
                    },
                    {
                        key: '總銷售額',
                        value: `<span class="fs-7">$ ${(1000).toLocaleString()}</span>`,
                    },
                    {
                        key: '總訂單數',
                        value: `<span class="fs-7">${100}</span>`,
                    },
                    {
                        key: '狀態',
                        value: html`<span class="fs-7"
                            >${(() => {
                                const key = getTimeState(dd.startDate, dd.endDate);
                                return stateBadge[key];
                            })()}</span
                        >`,
                    },
                ];
            });
        }

        return BgWidget.container(
            html` <div class="title-container">
                    ${BgWidget.title('展場列表')}
                    <div class="flex-fill"></div>
                    ${BgWidget.grayButton(
                        '建立展場',
                        gvc.event(() => {
                            vm.type = 'create';
                        })
                    )}
                </div>
                ${BgWidget.container(
                    BgWidget.mainCard(
                        [
                            (() => {
                                const id = gvc.glitter.getUUID();
                                return gvc.bindView({
                                    bind: id,
                                    view: () => {
                                        const filterList = [
                                            BgWidget.selectFilter({
                                                gvc,
                                                callback: (value: any) => {
                                                    vm.queryType = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(id);
                                                },
                                                default: vm.queryType,
                                                options: [
                                                    {
                                                        key: 'name',
                                                        value: '展場名稱',
                                                    },
                                                ],
                                            }),
                                            BgWidget.searchFilter(
                                                gvc.event((e) => {
                                                    vm.query = `${e.value}`.trim();
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋展場名稱'
                                            ),
                                        ];

                                        const filterTags = ListComp.getFilterTags(FilterOptions.exhibitionFunnel);

                                        if (document.body.clientWidth < 768) {
                                            // 手機版
                                            return html` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                    <div>${filterList[0]}</div>
                                                    <div style="display: flex;">${filterList[2] ? `<div class="me-2">${filterList[2]}</div>` : ''} ${filterList[3] ?? ''}</div>
                                                </div>
                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                <div>${filterTags}</div>`;
                                        } else {
                                            // 電腦版
                                            return html` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                <div>${filterTags}</div>`;
                                        }
                                    },
                                });
                            })(),
                            gvc.bindView({
                                bind: vm.tableId,
                                view: () => {
                                    return BgWidget.tableV3({
                                        gvc: gvc,
                                        getData: (vd) => {
                                            vmi = vd;
                                            const limit = 100;

                                            function callback(list: ExhibitionData[]) {
                                                vm.dataList = list;
                                                vmi.pageSize = Math.ceil(list.length / limit);
                                                vmi.originalData = vm.dataList;
                                                vmi.tableData = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                            }

                                            this.getPublicData().then((data: any) => {
                                                if (data.list && data.list.length > 0) {
                                                    data.list = data.list.filter((item: ExhibitionData) => {
                                                        return vm.query === '' || item.name.includes(vm.query);
                                                    });
                                                    callback(data.list);
                                                } else {
                                                    const defaultList: ExhibitionData[] = [];
                                                    ApiUser.setPublicConfig({
                                                        key: 'exhibition_manager',
                                                        value: {
                                                            list: defaultList,
                                                        },
                                                        user_id: 'manager',
                                                    }).then(() => {
                                                        callback(defaultList);
                                                    });
                                                }
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            vm.data = vm.dataList[index];
                                            vm.type = 'replace';
                                        },
                                        filter: [],
                                    });
                                },
                            }),
                        ].join('')
                    )
                )}`
        );
    }

    static detailPage(gvc: GVC, vm: VM, type: 'replace' | 'create') {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const st_name = '展場';
        const tableID = glitter.getUUID();

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                const data = vm.data.dataList.find((item) => item.variantID == dd.id);
                const ids = {
                    stock: `stock_${dd.id}`,
                    saleStock: `sale_stock_${dd.id}`,
                    salePrice: `sale_price_${dd.id}`,
                    personBuyLimit: `person_buy_limit_${dd.id}`,
                };
                const content = dd.content;

                if (!data) {
                    return [];
                }

                data.storeFrom = data.storeFrom || vm.storeData[0].key;

                return [
                    {
                        key: '商品',
                        value: `<span class="fs-7">${dd.title || '－'}</span>`,
                    },
                    {
                        key: '商品規格',
                        value: html`<span class="fs-7">${content.spec.length > 0 ? content.spec.join('/') : '單一規格'}</span>`,
                    },
                    {
                        key: '來自哪個門市',
                        value: html`<span class="fs-7"
                            >${BgWidget.select({
                                gvc: gvc,
                                default: data.storeFrom,
                                options: vm.storeData,
                                callback: (text) => {
                                    function resetSaleStock() {
                                        try {
                                            if (!data) return;

                                            data.storeFrom = text;
                                            const stock = content.stockList[data.storeFrom]?.count ?? 0;

                                            data.saleStock = Math.min(data.saleStock, stock);
                                        } catch (error) {
                                            console.error(`variant id ${dd.id} stockList 設值有誤`);
                                        }
                                    }

                                    resetSaleStock();
                                    gvc.notifyDataChange([ids.stock, ids.saleStock]);
                                },
                            })}</span
                        >`,
                    },
                    {
                        key: '庫存',
                        value:
                            content.show_understocking === 'false'
                                ? '-'
                                : gvc.bindView({
                                      bind: ids.stock,
                                      view: () => {
                                          try {
                                              return `${content.stockList[data.storeFrom].count}`;
                                          } catch (error) {
                                              return '0';
                                          }
                                      },
                                      divCreate: {
                                          class: 'fs-7',
                                          style: 'width: 100px;',
                                      },
                                  }),
                    },
                    {
                        key: '現場可售數量',
                        value:
                            content.show_understocking === 'false'
                                ? '-'
                                : gvc.bindView({
                                      bind: ids.saleStock,
                                      view: () => {
                                          return BgWidget.editeInput({
                                              gvc: gvc,
                                              title: '',
                                              type: 'number',
                                              default: `${data.saleStock ?? ''}`,
                                              placeHolder: '',
                                              callback: (text) => {
                                                  const n = parseInt(`${text}`, 10);
                                                  const max = content.stockList[data.storeFrom].count;
                                                  if (n > max || n < 0) {
                                                      gvc.notifyDataChange(ids.saleStock);
                                                      return;
                                                  }
                                                  data.saleStock = n;
                                              },
                                          });
                                      },
                                      divCreate: {
                                          elem: 'span',
                                          class: 'fs-7',
                                      },
                                  }),
                    },
                    {
                        key: '原售價',
                        value: html`<span class="fs-7">${parseInt(`${content.sale_price ?? 0}`, 10).toLocaleString()}</span>`,
                    },
                    {
                        key: '現場售價',
                        value: gvc.bindView({
                            bind: ids.salePrice,
                            view: () => {
                                return BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    type: 'number',
                                    default: `${data.salePrice ?? ''}`,
                                    placeHolder: '',
                                    callback: (text) => {
                                        const n = parseInt(`${text}`, 10);
                                        if (n < 0) {
                                            gvc.notifyDataChange(ids.salePrice);
                                            return;
                                        }
                                        data.salePrice = parseInt(`${text}`, 10);
                                    },
                                });
                            },
                            divCreate: {
                                elem: 'span',
                                class: 'fs-7',
                            },
                        }),
                    },
                    {
                        key: '每人限購',
                        value: gvc.bindView({
                            bind: ids.personBuyLimit,
                            view: () => {
                                return BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    type: 'number',
                                    default: `${data.personBuyLimit ?? ''}`,
                                    placeHolder: '',
                                    callback: (text) => {
                                        const n = parseInt(`${text}`, 10);
                                        if (n < 0) {
                                            gvc.notifyDataChange(ids.personBuyLimit);
                                            return;
                                        }
                                        data.personBuyLimit = parseInt(`${text}`, 10);
                                    },
                                });
                            },
                            divCreate: {
                                elem: 'span',
                                class: 'fs-7',
                            },
                        }),
                    },
                ];
            });
        }

        return BgWidget.container(
            [
                html` <div class="title-container">
                        <div>
                            ${BgWidget.goBack(
                                gvc.event(() => {
                                    vm.type = 'list';
                                })
                            )}
                        </div>
                        <div>${BgWidget.title(type === 'create' ? `新增${st_name}` : vm.data.name)}</div>
                    </div>
                    <div class="flex-fill"></div>`,
                html` <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                    ${BgWidget.container(
                        [
                            BgWidget.mainCard(
                                [
                                    html` <div class="tx_700">${st_name}資訊</div>`,
                                    html` <div class="row">
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">${st_name}名稱</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: vm.data.name ?? '',
                                                placeHolder: `請輸入${st_name}名稱`,
                                                callback: (text) => {
                                                    vm.data.name = text;
                                                },
                                            })}
                                        </div>
                                        ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">${st_name}地址</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: vm.data.address ?? '',
                                                placeHolder: `請輸入${st_name}地址`,
                                                callback: (text) => {
                                                    vm.data.address = text;
                                                },
                                            })}
                                        </div>
                                    </div>`,
                                    html` <div class="row">
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">展場開始時間</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'date',
                                                default: vm.data.startDate ?? '',
                                                placeHolder: '請輸入展場開始時間',
                                                callback: (text) => {
                                                    vm.data.startDate = text;
                                                },
                                            })}
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">展場結束時間</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'date',
                                                default: vm.data.endDate ?? '',
                                                placeHolder: '請輸入展場結束時間',
                                                callback: (text) => {
                                                    vm.data.endDate = text;
                                                },
                                            })}
                                        </div>
                                    </div>`,
                                    html` <div class="tx_normal">備註</div>
                                        ${EditorElem.editeText({
                                            gvc: gvc,
                                            title: '',
                                            default: vm.data.note ?? '',
                                            placeHolder: '請輸入備註',
                                            callback: (text) => {
                                                vm.data.note = text;
                                            },
                                        })}`,
                                ]
                                    .filter((dd) => {
                                        return dd;
                                    })
                                    .join(BgWidget.mbContainer(18))
                            ),
                            BgWidget.mainCard(
                                [
                                    html`<div class="tx_700">展場商品</div>`,
                                    html`${BgWidget.select({
                                        gvc: gvc,
                                        default: '',
                                        options: [].map((dd) => {
                                            return {
                                                key: dd,
                                                value: dd,
                                            };
                                        }),
                                        callback: (text) => {
                                            console.log('選擇類別', text);
                                        },
                                    })}`,
                                    html`<div class="d-flex align-items-center gap-2">
                                        <div style="width: 90%">
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: '',
                                                placeHolder: '搜尋',
                                                callback: (text) => {
                                                    console.log('搜尋', text);
                                                },
                                            })}
                                        </div>
                                        <div style="width: auto">
                                            ${BgWidget.grayButton(
                                                '查看全部',
                                                gvc.event(() => {
                                                    BgWidget.variantDialog({
                                                        gvc,
                                                        title: '所有商品',
                                                        default: vm.data.dataList.slice().map(({ variantID }) => `${variantID}`),
                                                        callback: (resultData) => {
                                                            const existingDataMap = new Map(vm.data.dataList.map((item) => [item.variantID, item]));

                                                            vm.data.dataList = resultData.map((id: string) => {
                                                                const variantID = parseInt(id, 10);
                                                                return (
                                                                    existingDataMap.get(variantID) ?? {
                                                                        variantID,
                                                                        storeFrom: '',
                                                                        saleStock: 0,
                                                                        salePrice: 0,
                                                                        personBuyLimit: 0,
                                                                    }
                                                                );
                                                            });

                                                            gvc.notifyDataChange(tableID);
                                                        },
                                                    });
                                                })
                                            )}
                                        </div>
                                    </div> `,
                                    gvc.bindView({
                                        bind: tableID,
                                        view: () => {
                                            return BgWidget.tableV3({
                                                gvc: gvc,
                                                getData: (vd) => {
                                                    let vmi = vd;
                                                    const limit = 10;

                                                    const resetData = () => {
                                                        vm.dataList = [];
                                                        vmi.pageSize = 0;
                                                        vmi.originalData = [];
                                                        vmi.tableData = [];
                                                    };

                                                    const setTableData = () => {
                                                        if (vm.data.dataList.length === 0) {
                                                            resetData();
                                                            vmi.loading = false;
                                                            vmi.callback();
                                                        } else {
                                                            ApiStock.getStoreProductStock({
                                                                page: vmi.page - 1,
                                                                limit: limit,
                                                                variant_id_list: vm.data.dataList.map((d) => d.variantID),
                                                            }).then((r) => {
                                                                if (r.result && r.response.data) {
                                                                    vm.dataList = r.response.data;
                                                                    vmi.pageSize = Math.ceil(r.response.total / limit);
                                                                    vmi.originalData = vm.dataList;
                                                                    vmi.tableData = getDatalist();
                                                                } else {
                                                                    resetData();
                                                                }
                                                                vmi.loading = false;
                                                                vmi.callback();
                                                            });
                                                        }
                                                    };

                                                    this.getStoreData().then((data) => {
                                                        vm.storeData = data.list.map((dd: any) => {
                                                            return {
                                                                key: dd.id,
                                                                value: dd.name,
                                                            };
                                                        });
                                                        setTableData();
                                                    });
                                                },
                                                rowClick: () => {},
                                                filter: [
                                                    {
                                                        name: '移除',
                                                        event: (checkedData) => {
                                                            dialog.warningMessage({
                                                                text: '確認移除所選商品嗎？',
                                                                callback: (response) => {
                                                                    if (!response) return;
                                                                    const checkedIDs = new Set(checkedData.map((item: any) => item.id));
                                                                    vm.data.dataList = vm.data.dataList.filter((data) => !checkedIDs.has(data.variantID));
                                                                    gvc.notifyDataChange(tableID);
                                                                },
                                                            });
                                                        },
                                                    },
                                                ],
                                            });
                                        },
                                    }),
                                ].join(BgWidget.mbContainer(18))
                            ),
                        ].join(BgWidget.mbContainer(24))
                    )}
                </div>`,
                BgWidget.mbContainer(240),
                html` <div class="update-bar-container">
                    ${type === 'replace'
                        ? BgWidget.danger(
                              gvc.event(() => {
                                  const cleanDelete = () => {
                                      dialog.checkYesOrNot({
                                          text: html`此操作無法恢復此展場資料<br />確定要刪除此庫存點？`,
                                          callback: (bool) => {
                                              if (bool) {
                                                  dialog.dataLoading({ visible: true });
                                                  this.getPublicData().then((stores: any) => {
                                                      const filterList = stores.list.filter((item: ExhibitionData) => item.id !== vm.data.id);
                                                      ApiStock.deleteStore({ id: vm.data.id }).then((d) => {
                                                          ApiUser.setPublicConfig({
                                                              key: 'exhibition_manager',
                                                              value: {
                                                                  list: filterList,
                                                              },
                                                              user_id: 'manager',
                                                          }).then(() => {
                                                              dialog.dataLoading({ visible: false });
                                                              dialog.successMessage({ text: '刪除成功' });
                                                              setTimeout(() => {
                                                                  vm.type = 'list';
                                                              }, 500);
                                                          });
                                                      });
                                                  });
                                              }
                                          },
                                      });
                                  };

                                  cleanDelete();
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
                            this.verifyStoreForm(glitter, type, vm, () => {
                                vm.type = 'list';
                            });
                        })
                    )}
                </div>`,
            ].join('<div class="my-2"></div>')
        );
    }

    static getPublicData() {
        return new Promise<any>((resolve, reject) => {
            ApiUser.getPublicConfig('exhibition_manager', 'manager').then((dd: any) => {
                if (dd.result && dd.response.value) {
                    resolve(dd.response.value);
                } else {
                    resolve({});
                }
            });
        });
    }

    static getStoreData() {
        return new Promise<any>((resolve, reject) => {
            ApiUser.getPublicConfig('store_manager', 'manager').then((dd: any) => {
                if (dd.result && dd.response.value) {
                    resolve(dd.response.value);
                } else {
                    resolve({});
                }
            });
        });
    }

    static getNewID(list: ExhibitionData[]) {
        let newId: string;
        do {
            newId = `exhibition_${Tool.randomString(6)}`;
        } while (list.some((item: ExhibitionData) => item.id === newId));
        return newId;
    }

    static verifyStoreForm(glitter: any, type: 'create' | 'replace', vm: VM, callback: (data: any) => void): void {
        const data = vm.data;
        const dialog = new ShareDialog(glitter);
        // 名稱未填寫驗證
        if (CheckInput.isEmpty(data.name)) {
            dialog.infoMessage({ text: '展場名稱不得為空白' });
            return;
        }

        // 地址未填寫驗證
        if (CheckInput.isEmpty(data.address)) {
            dialog.infoMessage({ text: '展場地址不得為空白' });
            return;
        }

        const start = new Date(`${data.startDate}T00:00:00`);
        const end = new Date(`${data.endDate}T23:59:59`);
        if (start > end) {
            dialog.infoMessage({ text: '結束時間不可晚於開始時間' });
            return;
        }

        dialog.dataLoading({ visible: true });
        this.getPublicData().then((exhibitions: any) => {
            if (type === 'replace') {
                const exhibition = exhibitions.list.find((item: ExhibitionData) => item.id === data.id);
                if (exhibition) {
                    Object.assign(exhibition, data);
                }
            } else {
                data.id = this.getNewID(exhibitions.list);
                exhibitions.list.push(data);
            }

            ApiUser.setPublicConfig({
                key: 'exhibition_manager',
                value: {
                    list: exhibitions.list,
                },
                user_id: 'manager',
            }).then(() => {
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: type === 'create' ? '新增成功' : '更新成功' });
                setTimeout(() => {
                    callback(data);
                }, 500);
            });
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ExhibitionManager);
