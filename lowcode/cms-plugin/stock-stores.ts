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

export type StoreData = {
    id: string;
    name: string;
    address: string;
    manager_name: string;
    manager_phone: string;
    note: string;
};

type VM = {
    id: string;
    tableId: string;
    type: 'list' | 'create' | 'replace';
    data: StoreData;
    dataList: any;
    filter: any;
    query: string;
    queryType: string;
    orderString: string;
};

export class StockStores {
    static main(gvc: GVC) {
        const glitter = gvc.glitter;

        const vm: VM = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            data: StockStores.emptyData(),
            dataList: [],
            query: '',
            queryType: '',
            filter: {},
            orderString: '',
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
                    vm.data = StockStores.emptyData();
                    return this.detailPage(gvc, vm, 'create');
                }

                return '';
            },
        });
    }

    static emptyData(): StoreData {
        return {
            id: '',
            name: '',
            address: '',
            manager_name: '',
            manager_phone: '',
            note: '',
        };
    }

    static list(gvc: GVC, vm: VM) {
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.storesFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: '庫存點名稱',
                        value: `<span class="fs-7">${dd.name}</span>`,
                    },
                    {
                        key: '地址',
                        value: `<span class="fs-7">${dd.address || '-'}</span>`,
                    },
                    {
                        key: '電話',
                        value: `<span class="fs-7">${dd.manager_phone || '-'}</span>`,
                    },
                    {
                        key: '聯絡人姓名',
                        value: `<span class="fs-7">${dd.manager_name || '-'}</span>`,
                    },
                ];
            });
        }

        return BgWidget.container(
            html` <div class="title-container">
                    ${BgWidget.title('庫存點管理')}
                    <div class="flex-fill"></div>
                    ${BgWidget.grayButton(
                        '新增庫存點',
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
                                                default: vm.queryType || 'name',
                                                options: FilterOptions.storesSelect,
                                            }),
                                            BgWidget.searchFilter(
                                                gvc.event((e) => {
                                                    vm.query = `${e.value}`.trim();
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋庫存點名稱'
                                            ),
                                            // BgWidget.funnelFilter({
                                            //     gvc,
                                            //     callback: () => ListComp.showRightMenu(FilterOptions.storesFunnel),
                                            // }),
                                            // BgWidget.updownFilter({
                                            //     gvc,
                                            //     callback: (value: any) => {
                                            //         vm.orderString = value;
                                            //         gvc.notifyDataChange(vm.tableId);
                                            //         gvc.notifyDataChange(id);
                                            //     },
                                            //     default: vm.orderString || 'default',
                                            //     options: FilterOptions.storesOrderBy,
                                            // }),
                                        ];

                                        const filterTags = ListComp.getFilterTags(FilterOptions.storesFunnel);

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

                                            function callback(list: StoreData[]) {
                                                vm.dataList = list;
                                                vmi.pageSize = Math.ceil(list.length / limit);
                                                vmi.originalData = vm.dataList;
                                                vmi.tableData = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                            }

                                            this.getPublicData().then((data: any) => {
                                                if (data.list && data.list.length > 0) {
                                                    data.list = data.list.filter((item: StoreData) => {
                                                        return vm.query === '' || item.name.includes(vm.query);
                                                    });
                                                    callback(data.list);
                                                } else {
                                                    const defaultList = [
                                                        {
                                                            id: this.getNewID([]),
                                                            name: '庫存點1(預設)',
                                                            address: '',
                                                            manager_name: '',
                                                            manager_phone: '',
                                                            note: '',
                                                        },
                                                    ];
                                                    ApiUser.setPublicConfig({
                                                        key: 'store_manager',
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

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: '商品',
                        value: `<span class="fs-7">${dd.title || '－'}</span>`,
                    },
                    {
                        key: '規格',
                        value: `<span class="fs-7">${dd.content.spec.length > 0 ? dd.content.spec.join('/') : '單一規格'}</span>`,
                    },
                    {
                        key: '存貨單位(SKU)',
                        value: `<span class="fs-7">${dd.content.sku || '－'}</span>`,
                    },
                    {
                        key: '商品條碼',
                        value: `<span class="fs-7">${dd.content.barcode || '－'}</span>`,
                    },
                    {
                        key: '庫存數量',
                        value: `<span class="fs-7">${dd.count}</span>`,
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
                        <div>${BgWidget.title(type === 'create' ? '新增庫存點' : vm.data.name)}</div>
                    </div>
                    <div class="flex-fill"></div>`,
                html` <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                    ${BgWidget.container(
                        [
                            BgWidget.mainCard(
                                [
                                    html` <div class="tx_700">庫存點資訊</div>`,
                                    html` <div class="row">
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">庫存點名稱</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: vm.data.name ?? '',
                                                placeHolder: '請輸入庫存點名稱',
                                                callback: (text) => {
                                                    vm.data.name = text;
                                                },
                                            })}
                                        </div>
                                        ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">庫存點地址</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: vm.data.address ?? '',
                                                placeHolder: '請輸入庫存點地址',
                                                callback: (text) => {
                                                    vm.data.address = text;
                                                },
                                            })}
                                        </div>
                                    </div>`,
                                    html`<div class="row">
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">聯絡人姓名</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: vm.data.manager_name ?? '',
                                                placeHolder: '請輸入聯絡人姓名',
                                                callback: (text) => {
                                                    vm.data.manager_name = text;
                                                },
                                            })}
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <div class="tx_normal">電話</div>
                                            ${BgWidget.mbContainer(8)}
                                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: vm.data.manager_phone ?? '',
                                                placeHolder: '請輸入電話',
                                                callback: (text) => {
                                                    vm.data.manager_phone = text;
                                                },
                                            })}
                                        </div>
                                    </div> `,
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
                                ].join(BgWidget.mbContainer(18))
                            ),
                            type === 'create'
                                ? ''
                                : BgWidget.mainCard(
                                      [
                                          html` <div class="tx_700">追蹤此庫存點的商品</div>`,
                                          BgWidget.tableV3({
                                              gvc: gvc,
                                              getData: (vd) => {
                                                  let vmi = vd;
                                                  const limit = 10;
                                                  ApiStock.getStoreProductList({
                                                      page: vmi.page - 1,
                                                      limit: limit,
                                                      search: vm.data.id,
                                                  }).then((r) => {
                                                      if (r.result && r.response.data) {
                                                          vm.dataList = r.response.data;
                                                          vmi.pageSize = Math.ceil(r.response.total / limit);
                                                          vmi.originalData = vm.dataList;
                                                          vmi.tableData = getDatalist();
                                                      } else {
                                                          vm.dataList = [];
                                                          vmi.pageSize = 0;
                                                          vmi.originalData = [];
                                                          vmi.tableData = [];
                                                      }
                                                      vmi.loading = false;
                                                      vmi.callback();
                                                  });
                                              },
                                              rowClick: () => {},
                                              filter: [],
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
                                          text: html`此操作無法恢復此庫存點<br />以及商品庫存數<br />確定要刪除此庫存點？`,
                                          callback: (bool) => {
                                              if (bool) {
                                                  dialog.dataLoading({ visible: true });
                                                  this.getPublicData().then((stores: any) => {
                                                      const filterList = stores.list.filter((item: StoreData) => item.id !== vm.data.id);

                                                      if (filterList.length === 0) {
                                                          dialog.dataLoading({ visible: false });
                                                          dialog.errorMessage({ text: '庫存點數量不可小於0' });
                                                          return;
                                                      }

                                                      ApiStock.deleteStore({ id: vm.data.id }).then((d) => {
                                                          ApiUser.setPublicConfig({
                                                              key: 'store_manager',
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

                                  if (vm.dataList.length === 0) {
                                      cleanDelete();
                                  } else {
                                      dialog.warningMessage({
                                          text: html`此庫存點還有商品庫存<br />建議刪除前透過「調撥單」清理所有庫存商品<br />或按下「確定」即可強制刪除庫存點`,
                                          callback: (b) => {
                                              if (b) {
                                                  cleanDelete();
                                              }
                                          },
                                      });
                                  }
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
                            this.verifyStoreForm(glitter, type, vm.data, () => {
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
            ApiUser.getPublicConfig('store_manager', 'manager').then((dd: any) => {
                if (dd.result && dd.response.value) {
                    resolve(dd.response.value);
                } else {
                    resolve({});
                }
            });
        });
    }

    static getNewID(list: StoreData[]) {
        let newId: string;
        do {
            newId = `store_${Tool.randomString(6)}`;
        } while (list.some((item: StoreData) => item.id === newId));
        return newId;
    }

    static verifyStoreForm(glitter: any, type: 'create' | 'replace', data: StoreData, callback: (data: any) => void): void {
        const dialog = new ShareDialog(glitter);
        // 名稱未填寫驗證
        if (CheckInput.isEmpty(data.name)) {
            dialog.infoMessage({ text: '庫存點名稱不得為空白' });
            return;
        }

        // 地址未填寫驗證
        if (CheckInput.isEmpty(data.address)) {
            dialog.infoMessage({ text: '地址不得為空白' });
            return;
        }

        // 正則表達式來驗證台灣行動電話號碼格式
        if (!CheckInput.isTaiwanPhone(data.manager_phone)) {
            dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
            return;
        }

        dialog.dataLoading({ visible: true });
        this.getPublicData().then((stores: any) => {
            if (type === 'replace') {
                const store = stores.list.find((item: StoreData) => item.id === data.id);
                if (store) {
                    Object.assign(store, data);
                }
            } else {
                data.id = this.getNewID(stores.list);
                stores.list.push(data);
            }

            ApiUser.setPublicConfig({
                key: 'store_manager',
                value: {
                    list: stores.list,
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

(window as any).glitter.setModule(import.meta.url, StockStores);
