import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiRecommend } from '../glitter-base/route/recommend.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { Tool } from '../modules/tool.js';
import { BgProduct } from './bg-product.js';
import { CheckInput } from '../modules/checkInput.js';
import { ShoppingOrderManager } from '../cms-plugin/shopping-order-manager.js';
import { TableStorage } from '../cms-plugin/module/table-storage.js';

export type OptionsItem = {
  key: number | string;
  value: string;
  image: string;
  note?: string;
};

type RecommendLink = {
  lineItems: any;
  code: string;
  link: string;
  redirect: string;
  title: string;
  condition: number;
  share_type: 'none' | 'fix' | 'percent';
  voucher_status: 'no' | 'yes';
  recommend_status: 'old' | 'new';
  relative: 'collection' | 'product' | 'all';
  share_value: number;
  voucher: number;
  startDate: string;
  startTime: string;
  start_ISO_Date: string;
  endDate: string | undefined;
  endTime: string | undefined;
  end_ISO_Date: string | undefined;
  recommend_medium: string[];
  relative_data: string[] | string;
  recommend_user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  status: boolean;
};

type RecommendUser = {
  name: string;
  email: string;
  phone: string;
  note: string;
};

type LinkVM = {
  id: string;
  filterId: string;
  type: 'list' | 'userList' | 'add' | 'replace' | 'select' | 'order';
  loading: boolean;
  users: any[];
  orderData: any;
  editData: any;
  dataList: any;
  query?: string;
};

export class BgRecommend {
  public static linkList(gvc: GVC, widget: any) {
    const html = String.raw;
    const glitter = gvc.glitter;
    const vm: LinkVM = {
      id: glitter.getUUID(),
      filterId: glitter.getUUID(),
      type: 'list',
      loading: true,
      orderData: {},
      users: [],
      editData: {},
      dataList: undefined,
      query: '',
    };

    return gvc.bindView(() => {
      return {
        bind: vm.id,
        dataList: [{ obj: vm, key: 'type' }],
        view: () => {
          if (vm.loading) {
            return BgWidget.spinner();
          }
          if (vm.type === 'list') {
            return BgWidget.container(html`
              <div class="title-container">
                ${BgWidget.title('分銷連結')}
                <div class="flex-fill"></div>
                ${BgWidget.darkButton(
                  '新增',
                  gvc.event(() => {
                    vm.type = 'add';
                    gvc.notifyDataChange(vm.id);
                  })
                )}
              </div>
              ${BgWidget.container(
                BgWidget.mainCard(
                  this.linkTable({
                    gvc,
                    vm,
                    rowCallback: (data, index: number) => {
                      vm.editData = vm.dataList[index];
                      vm.type = 'replace';
                    },
                  })
                )
              )}
            `);
          } else if (vm.type === 'add') {
            return this.editorLink({
              gvc: gvc,
              data: {},
              callback: () => {
                vm.type = 'list';
              },
            });
          } else if (vm.type === 'order') {
            return ShoppingOrderManager.replaceOrder(gvc, vm, vm.orderData, () => {
              vm.type = 'replace';
            });
          }
          return this.editorLink({
            gvc: gvc,
            data: vm.editData,
            callback: () => {
              vm.type = 'list';
            },
            vm: vm,
          });
        },
        divCreate: {},
        onCreate: () => {
          if (vm.loading) {
            new Promise<any[]>(resolve => {
              ApiRecommend.getUsers({
                data: {},
                page: 0,
                limit: 99999,
                token: (window.parent as any).config.token,
              }).then(data => {
                if (data.result) {
                  resolve(data.response.data);
                } else {
                  resolve([]);
                }
              });
            }).then(data => {
              vm.users = data;
              vm.loading = false;
              gvc.notifyDataChange(vm.id);
            });
          }
        },
      };
    });
  }

  public static linkTable(obj: {
    gvc: GVC;
    vm: LinkVM;
    rowCallback: (data: any, index: number) => void;
    user_id?: number;
  }) {
    const html = String.raw;
    const gvc = obj.gvc;
    const vm = obj.vm;
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(glitter);
    let vmi: any = undefined;

    function getDatalist() {
      const prefixURL = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/distribution/`;
      return vm.dataList.map((dd: any) => {
        const url = prefixURL + (dd.content.link ?? '');
        return [
          {
            key: '連結名稱',
            value: `<span class="fs-7">${dd.content.title}</span>`,
          },
          {
            key: '連結網址',
            value: gvc.bindView(
              (() => {
                const id = glitter.getUUID();
                return {
                  bind: id,
                  view: () => {
                    return html`<span
                      style="cursor: pointer; color: #4D86DB;"
                      onclick="${gvc.event(() => {
                        glitter.openNewTab(url);
                      })}"
                    >
                      ${url}
                    </span>`;
                  },
                  divCreate: {
                    class: 'me-4',
                    option: [
                      {
                        key: 'onclick',
                        value: gvc.event((e, event) => {
                          event.stopPropagation();
                        }),
                      },
                    ],
                  },
                };
              })()
            ),
          },
          {
            key: '下單數',
            value: html` <div class="me-3">${dd.orders ? dd.orders.toLocaleString() : 0}</div>`,
          },
          {
            key: '總金額',
            value: html` <div class="me-3">${dd.total_price ? dd.total_price.toLocaleString() : 0}</div>`,
          },
          {
            key: '被點擊次數',
            value: html` <div class="me-3">${dd.click_times ? dd.click_times.toLocaleString() : 0}</div>`,
          },
          {
            key: '裝置來源數',
            value: html` <div class="me-3">${dd.mac_address_count ? dd.mac_address_count.toLocaleString() : 0}個</div>`,
          },
          {
            key: '轉換率',
            value: html` <div class="me-3">${dd.conversion_rate ?? '0%'}</div>`,
          },
          {
            key: '分潤獎金',
            value: html` <div class="me-3">${dd.sharing_bonus ? dd.sharing_bonus.toLocaleString() : 0}</div>`,
          },
          {
            key: '推薦人',
            value: html` <div class="me-3">${getRecommender(vm.users, dd.content.recommend_user)}</div>`,
          },
          {
            key: '期限',
            value: html` <div class="me-3">${dd.content.startDate} ~ ${dd.content.endDate ?? '永不過期'}</div>`,
          },
          {
            key: '狀態',
            value: gvc.bindView(
              (() => {
                const id = glitter.getUUID();
                return {
                  bind: id,
                  view: () => {
                    return BgWidget.switchTextButton(
                      gvc,
                      dd.content.status,
                      {
                        left: dd.content.status ? '啟用' : '關閉',
                      },
                      () => {
                        dialog.dataLoading({ visible: true });
                        ApiRecommend.toggleListData({ id: dd.id }).then(data => {
                          dialog.dataLoading({ visible: false });
                          if (data.result) {
                            dd.content.status = !dd.content.status;
                            dialog.successMessage({ text: `${dd.content.status ? '啟用' : '關閉'}成功` });
                          } else {
                            dialog.errorMessage({ text: `${dd.content.status ? '啟用' : '關閉'}失敗` });
                          }
                          gvc.notifyDataChange(id);
                        });
                      }
                    );
                  },
                  divCreate: {
                    option: [
                      {
                        key: 'onclick',
                        value: gvc.event((e, event) => {
                          event.stopPropagation();
                        }),
                      },
                    ],
                  },
                };
              })()
            ),
          },
        ];
      });
    }

    return BgWidget.tableV3({
      gvc: gvc,
      getData: async vd => {
        vmi = vd;
        const limit = 10;
        ApiRecommend.getList({
          data: {},
          limit: limit,
          page: vmi.page - 1,
          user_id: obj.user_id,
          token: (window.parent as any).config.token,
        }).then(data => {
          vm.dataList = data.result ? data.response.data : [];
          vmi.pageSize = Math.ceil(data.response.total / limit);
          vmi.originalData = vm.dataList;
          vmi.tableData = getDatalist();
          vmi.loading = false;
          vmi.callback();
        });
      },
      rowClick: (data, index) => {
        obj.rowCallback(data, index);
      },
      filter: [
        {
          name: '批量移除',
          event: checkedData => {
            this.deleteLink({
              gvc: gvc,
              ids: checkedData.map((dd: any) => dd.id),
              callback: () => {
                gvc.notifyDataChange(vm.id);
              },
            });
          },
        },
      ],
    });
  }

  public static userList(gvc: GVC, widget: any) {
    const html = String.raw;
    const glitter = gvc.glitter;
    const vm: {
      id: string;
      tableId: string;
      filterId: string;
      type: 'list' | 'userList' | 'add' | 'replace' | 'select';
      editData: any;
      dataList: any;
      query?: string;
      queryType?: string;
      group: { type: string; title: string; tag: string };
      filter: any;
      orderString: string;
      listLimit: number;
    } = {
      id: glitter.getUUID(),
      tableId: glitter.getUUID(),
      filterId: glitter.getUUID(),
      type: 'list',
      editData: {},
      dataList: undefined,
      query: '',
      queryType: 'name',
      group: { type: 'level', title: '', tag: '' },
      filter: {},
      orderString: 'default',
      listLimit: TableStorage.getLimit(),
    };

    const ListComp = new BgListComponent(gvc, vm, FilterOptions.recommendUserFilterFrame);
    vm.filter = ListComp.getFilterObject();
    let vmi: any = undefined;

    function getDatalist() {
      return vm.dataList.map((dd: any) => {
        return [
          {
            key: '推薦人名稱',
            value: html`<span class="fs-7">${dd.content.name}</span>`,
          },
          {
            key: '所有訂單總計',
            value: html`<span class="fs-7">${dd.total_price ? dd.total_price.toLocaleString() : 0}</span>`,
          },
          {
            key: '分潤獎金',
            value: html`<span class="fs-7">${dd.sharing_bonus ? dd.sharing_bonus.toLocaleString() : 0}</span>`,
          },
          {
            key: '分銷連結數',
            value: html`<span class="fs-7">${dd.links}</span>`,
          },
        ];
      });
    }

    return gvc.bindView(() => {
      return {
        bind: vm.id,
        dataList: [{ obj: vm, key: 'type' }],
        view: () => {
          if (vm.type === 'list') {
            return BgWidget.container(html`
              <div class="title-container">
                ${BgWidget.title('推薦人列表')}
                <div class="flex-fill"></div>
                ${BgWidget.darkButton(
                  '新增',
                  gvc.event(() => {
                    vm.type = 'add';
                    gvc.notifyDataChange(vm.id);
                  })
                )}
              </div>
              ${BgWidget.container(
                BgWidget.mainCard(
                  [
                    (() => {
                      const fvm = {
                        id: gvc.glitter.getUUID(),
                        loading: true,
                        levelList: [] as any,
                      };
                      return gvc.bindView({
                        bind: fvm.id,
                        view: () => {
                          if (fvm.loading) {
                            return '';
                          }
                          const filterList = [
                            BgWidget.selectFilter({
                              gvc,
                              callback: (value: any) => {
                                vm.queryType = value;
                                gvc.notifyDataChange([vm.tableId, fvm.id]);
                              },
                              default: vm.queryType || 'name',
                              options: FilterOptions.recommendUserSelect,
                            }),
                            BgWidget.searchFilter(
                              gvc.event(e => {
                                vm.query = `${e.value}`.trim();
                                gvc.notifyDataChange([vm.tableId, fvm.id]);
                              }),
                              vm.query || '',
                              '搜尋推薦人'
                            ),
                            BgWidget.countingFilter({
                              gvc,
                              callback: value => {
                                vm.listLimit = value;
                                gvc.notifyDataChange([vm.tableId, fvm.id]);
                              },
                              default: vm.listLimit,
                            }),
                            BgWidget.updownFilter({
                              gvc,
                              callback: (value: any) => {
                                vm.orderString = value;
                                gvc.notifyDataChange([vm.tableId, fvm.id]);
                              },
                              default: vm.orderString || 'default',
                              options: FilterOptions.recommendUserOrderBy,
                            }),
                          ];

                          return BgListComponent.listBarRWD(filterList, '');
                        },
                        divCreate: {
                          class: 'mb-3',
                        },
                        onCreate: () => {
                          if (fvm.loading) {
                            setTimeout(() => {
                              fvm.loading = false;
                              gvc.notifyDataChange(fvm.id);
                            }, 100);
                          }
                        },
                      });
                    })(),
                    gvc.bindView({
                      bind: vm.tableId,
                      view: () => {
                        return BgWidget.tableV3({
                          gvc: gvc,
                          getData: async vd => {
                            vmi = vd;
                            ApiRecommend.getUsers({
                              data: {},
                              limit: vm.listLimit,
                              page: vmi.page - 1,
                              token: (window.parent as any).config.token,
                              search: vm.query,
                              searchType: vm.queryType,
                              orderBy: vm.orderString,
                            }).then(data => {
                              vm.dataList = data.response.data;
                              vmi.pageSize = Math.ceil(data.response.total / vm.listLimit);
                              vmi.originalData = vm.dataList;
                              vmi.tableData = getDatalist();
                              vmi.loading = false;
                              vmi.callback();
                            });
                          },
                          rowClick: (data, index) => {
                            vm.editData = vm.dataList[index];
                            vm.type = 'replace';
                          },
                          filter: [
                            {
                              name: '批量移除',
                              event: checkedData => {
                                this.deleteUser({
                                  gvc: gvc,
                                  ids: checkedData.map((dd: any) => dd.id),
                                  callback: () => {
                                    gvc.notifyDataChange(vm.id);
                                  },
                                });
                              },
                            },
                          ],
                        });
                      },
                    }),
                  ].join('')
                )
              )}
            `);
          } else if (vm.type === 'add') {
            return this.editorUser({
              gvc: gvc,
              widget: widget,
              data: {},
              callback: () => {
                vm.type = 'list';
              },
            });
          }
          return this.editorUser({
            gvc: gvc,
            widget: widget,
            data: vm.editData,
            callback: () => {
              vm.type = 'list';
            },
          });
        },
        divCreate: {
          class: 'mx-auto',
          style: 'max-width: 100%; width: 960px;',
        },
      };
    });
  }

  public static editorLink(cf: { gvc: GVC; data: any; callback: () => void; vm?: any }) {
    const html = String.raw;
    const gvc = cf.gvc;
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(glitter);
    const vm: {
      id: string;
      previewId: string;
      noteId: string;
      data: RecommendLink;
      loading: boolean;
      voucherList: any[];
      users: any[];
      readonly: boolean;
    } = {
      id: glitter.getUUID(),
      previewId: glitter.getUUID(),
      noteId: glitter.getUUID(),
      data: cf.data.content ?? {
        code: '',
        link: '',
        title: '',
        condition: 0,
        share_type: 'none',
        voucher_status: 'yes',
        relative: 'all',
        relative_data: [],
        recommend_status: 'old',
        share_value: 0,
        voucher: 0,
        startDate: getDateTime().date,
        startTime: getDateTime().time,
        endDate: undefined,
        endTime: undefined,
        recommend_medium: [],
        recommend_user: {
          id: 0,
          name: '',
          email: '',
          phone: '',
        },
      },
      loading: true,
      voucherList: [],
      users: [],
      readonly: cf.data.id !== undefined,
    };

    let newOrder: any = {
      id: glitter.getUUID(),
      productArray: [],
      productCheck: (() => {
        if (!cf.data.content) {
          return [];
        }
        return cf.data.content.lineItems ?? [];
      })(),
      productTemp: [],
      orderProductArray: [],
      orderString: '',
      query: '',
    };

    const mediumList = [
      { key: 'youtube', value: 'Youtube' },
      { key: 'facebook', value: 'Facebook' },
      { key: 'instagram', value: 'Instagram' },
      { key: 'threads', value: 'Threads' },
      { key: 'dcard', value: 'Dcard' },
      { key: 'ptt', value: 'PTT' },
      { key: 'other', value: '其他' },
    ];

    function getOrderlist(data: any) {
      return data.map((dd: any) => {
        return [
          {
            key: '訂單編號',
            value: html` <div style="overflow: hidden;white-space: normal;color: #4D86DB;word-break: break-all;">
              ${dd.orderData.orderID}
            </div>`,
          },
          {
            key: '訂單日期',
            value: html` <div style="overflow: hidden;white-space: normal;word-break: break-all;">
              ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd')}
            </div>`,
          },
          {
            key: '總金額',
            value: parseInt(dd.orderData.total, 10).toLocaleString(),
          },
          {
            key: '訂單狀態',
            value: (() => {
              if (dd.orderData.progress) {
                const status = ApiShop.getShippingStatusArray().find(item => item.value === dd.orderData.progress);
                if (status) {
                  return status ? status.title : '未設定出貨狀態';
                }
              }
              return '未設定出貨狀態';
            })(),
          },
          {
            key: '',
            value: BgWidget.grayButton(
              '查閱',
              gvc.event(() => {
                cf.vm.orderData = dd;
                cf.vm.type = 'order';
              })
            ),
          },
        ];
      });
    }

    return gvc.bindView(() => {
      return {
        bind: vm.id,
        view: () => {
          if (vm.loading) {
            return BgWidget.spinner({ text: { visible: false } });
          }
          return BgWidget.container(
            [
              html` <div class="title-container">
                ${BgWidget.goBack(
                  gvc.event(() => {
                    cf.callback();
                  })
                )}
                ${BgWidget.title(vm.data.title || '新增分銷連結')}
                <div class="flex-fill"></div>
              </div>`,
              BgWidget.container1x2(
                {
                  html: gvc.bindView(() => {
                    const id = glitter.getUUID();
                    return {
                      bind: id,
                      view: () => {
                        const inputStyle = 'font-size: 16px; height:40px;';
                        let map: any = [
                          BgWidget.mainCard(
                            [
                              html` <div class="tx_700 mb-2">連結網址</div>
                                <div class="tx_normal">分銷代碼</div>
                                <div style="margin: 4px 0 8px;">
                                  ${BgWidget.grayNote('是一段唯一的識別碼，用於系統追蹤和記錄通過該代碼完成的銷售')}
                                </div>
                                ${BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '',
                                  default: vm.data.code ?? '',
                                  placeHolder: '請輸入分銷代碼',
                                  callback: text => {
                                    vm.data.code = text;
                                  },
                                  readonly: vm.readonly,
                                })}`,
                              html` <div class="tx_normal">導向網頁</div>
                                ${BgWidget.linkList({
                                  gvc: gvc,
                                  title: '',
                                  default: vm.data.redirect ?? '',
                                  placeHolder: '選擇或貼上外部連結',
                                  callback: text => {
                                    vm.data.redirect = text;
                                    gvc.notifyDataChange(vm.previewId);
                                  },
                                  filter: {
                                    page: ['一頁商店', '隱形賣場', '所有商品'],
                                  },
                                })}`,
                              gvc.bindView({
                                bind: vm.previewId,
                                view: () => {
                                  const prefixURL = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/distribution/`;
                                  return [
                                    html` <div class="tx_normal fw-normal mb-2">自訂網址</div>`,
                                    html` <div
                                      style="  justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                        .body.clientWidth > 768
                                        ? 'gap: 18px; '
                                        : 'flex-direction: column; gap: 0px; '}"
                                      class="w-100"
                                    >
                                      <div
                                        style="width:100%;padding: 9px 18px;background: #EAEAEA; justify-content: flex-start; align-items: center; gap: 5px; display: flex"
                                      >
                                        <div
                                          style="text-align: right; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                        >
                                          ${prefixURL}
                                        </div>
                                      </div>
                                      <input
                                        class="flex-fill"
                                        style="border:none;background:none;text-align: start; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word; ${document
                                          .body.clientWidth > 768
                                          ? ''
                                          : 'padding: 9px 18px;'}"
                                        value="${vm.data.link || ''}"
                                        onchange="${gvc.event(e => {
                                          let text = e.value;
                                          if (!CheckInput.isEnglishNumberHyphen(text)) {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.infoMessage({ text: '僅能輸入英文或數字與連接號' });
                                            gvc.notifyDataChange(id);
                                          } else {
                                            vm.data.link = text;
                                            gvc.notifyDataChange(id);
                                          }
                                        })}"
                                      />
                                    </div>`,
                                    html` <div class="mt-2 mb-1">
                                      <span class="tx_normal me-2">網址預覽</span>${BgWidget.greenNote(
                                        prefixURL + (vm.data.link ?? ''),
                                        gvc.event(() => {
                                          gvc.glitter.openNewTab(prefixURL + (vm.data.link ?? ''));
                                        })
                                      )}
                                    </div>`,
                                  ].join('');
                                },
                              }),
                              html` <div class="tx_700 mb-2">基本設定</div>
                                <div class="tx_normal">分銷連結名稱</div>
                                ${BgWidget.mbContainer(8)}
                                ${BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '',
                                  default: vm.data.title ?? '',
                                  placeHolder: '請輸入分銷連結名稱',
                                  callback: text => {
                                    vm.data.title = text;
                                  },
                                })}`,
                            ].join(BgWidget.mbContainer(18))
                          ),
                          BgWidget.mainCard(
                            [
                              html` <div class="tx_700">分潤條件</div>`,
                              html` <div class="tx_700">訂單滿額</div>
                                ${BgWidget.mbContainer(8)}
                                ${EditorElem.numberInput({
                                  gvc: gvc,
                                  title: '',
                                  default: vm.data.condition ?? 0,
                                  placeHolder: '請輸入分銷代碼',
                                  callback: text => {
                                    vm.data.condition = text;
                                  },
                                  min: 0,
                                  unit: '元',
                                  readonly: vm.readonly,
                                })}`,
                              BgWidget.horizontalLine(),
                              html` <div class="tx_700">分潤類型</div>
                                ${BgWidget.mbContainer(8)}
                                ${BgWidget.multiCheckboxContainer(
                                  gvc,
                                  [
                                    { key: 'none', name: '沒有分潤' },
                                    {
                                      key: 'fix',
                                      name: '固定金額',
                                      innerHtml: html` <div style="margin: 4px 0 8px;">
                                          ${BgWidget.grayNote('每筆訂單分潤固定金額')}
                                        </div>
                                        ${EditorElem.numberInput({
                                          gvc: gvc,
                                          title: '',
                                          default: vm.data.share_value ?? 0,
                                          placeHolder: '請輸入數值',
                                          callback: text => {
                                            vm.data.share_value = text;
                                            gvc.notifyDataChange(id);
                                          },
                                          min: 0,
                                          unit: '元',
                                        })}`,
                                    },
                                    {
                                      key: 'percent',
                                      name: '百分比',
                                      innerHtml: html` <div style="margin: 4px 0 8px;">
                                          ${BgWidget.grayNote('分潤計算方式為: (訂單結算金額 - 運費)*分潤百分比')}
                                        </div>
                                        ${EditorElem.numberInput({
                                          gvc: gvc,
                                          title: '',
                                          default: vm.data.share_value ?? 0,
                                          placeHolder: '請輸入數值',
                                          callback: text => {
                                            vm.data.share_value = text;
                                            gvc.notifyDataChange(id);
                                          },
                                          max: 100,
                                          min: 0,
                                          unit: '%',
                                        })}`,
                                    },
                                  ],
                                  [vm.data.share_type ?? ''],
                                  (data: any) => {
                                    vm.data.share_type = data[0];
                                  },
                                  { single: true, readonly: vm.readonly }
                                )}`,
                            ].join(BgWidget.mbContainer(18))
                          ),
                          BgWidget.mainCard(
                            [
                              BgWidget.title('分潤商品', 'font-size: 16px;'),
                              html` <div class="my-2"></div>`,
                              gvc.bindView(() => {
                                const subVM = {
                                  id: gvc.glitter.getUUID(),
                                  loading: true,
                                  dataList: [] as OptionsItem[],
                                };

                                async function getSelectProducts(id_array: number[]) {
                                  const products_data = await ApiShop.getProduct({
                                    page: 0,
                                    limit: 99999,
                                    id_list: id_array.join(','),
                                  }).then(data => data.response.data);

                                  return products_data;
                                }

                                newOrder.productCheck ??= [];
                                const relativeCloneData = structuredClone(newOrder.productCheck);

                                return {
                                  bind: subVM.id,
                                  view: () => {
                                    if (subVM.loading) {
                                      return BgWidget.spinner();
                                    }

                                    return html`
                                      <div class="d-flex flex-column p-2" style="gap: 18px;">
                                        <div
                                          class="d-flex align-items-center gray-bottom-line-18"
                                          style="gap: 24px; justify-content: space-between;"
                                        >
                                          <div class="form-check-label c_updown_label">
                                            <div class="tx_normal">產品列表</div>
                                          </div>
                                          ${BgWidget.grayButton(
                                            '選擇商品',
                                            gvc.event(() => {
                                              BgProduct.productsDialog({
                                                gvc: gvc,
                                                default: relativeCloneData.map((dd: any) => dd.id),
                                                callback: product_array => {
                                                  getSelectProducts(product_array).then(resp => {
                                                    newOrder.productCheck = resp;
                                                    subVM.loading = true;
                                                    gvc.notifyDataChange(subVM.id);
                                                  });
                                                },
                                              });
                                            }),
                                            { textStyle: 'font-weight: 400;' }
                                          )}
                                        </div>
                                        ${subVM.dataList
                                          .map((opt, index) => {
                                            return html`
                                              <div
                                                class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                              >
                                                <span class="tx_normal" style="min-width: 20px;">${index + 1}.</span>
                                                ${BgWidget.validImageBox({
                                                  gvc: gvc,
                                                  image: opt.image,
                                                  width: 40,
                                                })}
                                                <div class="tx_normal ${opt.note ? 'mb-1' : ''} d-flex flex-column">
                                                  ${opt.value}
                                                  ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                </div>
                                                <div class="flex-fill"></div>
                                                ${BgWidget.cancel(
                                                  gvc.event(() => {
                                                    newOrder.productCheck.splice(index, 1);
                                                    subVM.dataList.splice(index, 1);
                                                    gvc.notifyDataChange(subVM.id);
                                                  }),
                                                  '移除'
                                                )}
                                              </div>
                                            `;
                                          })
                                          .join('') ||
                                        html`<div class="w-100 d-flex align-content-center justify-content-center">
                                          尚未加入任何賣場商品
                                        </div>`}
                                      </div>
                                    `;
                                  },
                                  onCreate: () => {
                                    if (subVM.loading) {
                                      if (newOrder.productCheck.length === 0) {
                                        setTimeout(() => {
                                          subVM.dataList = [];
                                          subVM.loading = false;
                                          gvc.notifyDataChange(subVM.id);
                                        }, 100);
                                      } else {
                                        new Promise<OptionsItem[]>(async resolve => {
                                          const products_data = await getSelectProducts(
                                            newOrder.productCheck.map((p: any) => p.id)
                                          );

                                          newOrder.productCheck = products_data;

                                          subVM.dataList = products_data.map((product: any) => {
                                            return {
                                              key: product.id,
                                              value: product.content.title,
                                              image: product.content.preview_image[0] || BgWidget.noImageURL,
                                            };
                                          });

                                          resolve(subVM.dataList);
                                        }).then(data => {
                                          subVM.dataList = data;
                                          subVM.loading = false;
                                          gvc.notifyDataChange(subVM.id);
                                        });
                                      }
                                    }
                                  },
                                };
                              }),
                            ].join('')
                          ),
                          // 訂單記錄
                          vm.readonly
                            ? gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                  bind: id,
                                  view: () => {
                                    return BgWidget.mainCard(
                                      html` <div style="display: flex; margin-bottom: 8px;padding-left:0.25rem;">
                                        <span class="tx_700">訂單記錄</span>
                                      </div>` +
                                        gvc.bindView(() => {
                                          const id = gvc.glitter.getUUID();
                                          return {
                                            bind: id,
                                            view: () => {
                                              const limit = 10;
                                              return new Promise(async resolve => {
                                                const h = BgWidget.tableV3({
                                                  gvc: gvc,
                                                  getData: vd => {
                                                    ApiShop.getOrder({
                                                      page: vd.page - 1,
                                                      limit: limit,
                                                      data_from: 'manager',
                                                      distribution_code: vm.data.code,
                                                      status: 1,
                                                    }).then(data => {
                                                      vd.pageSize = Math.ceil(data.response.total / limit);
                                                      vd.originalData = data.response.data;
                                                      vd.tableData = getOrderlist(data.response.data);
                                                      vd.loading = false;
                                                      vd.callback();
                                                    });
                                                  },
                                                  rowClick: () => {},
                                                  filter: [],
                                                });
                                                resolve(
                                                  html` <div style="display:flex; gap: 18px; flex-direction: column;">
                                                    ${h}
                                                  </div>`
                                                );
                                              });
                                            },
                                          };
                                        })
                                    );
                                  },
                                  divCreate: {
                                    class: 'p-0',
                                  },
                                };
                              })
                            : '',
                          BgWidget.mainCard(
                            (() => {
                              const id = gvc.glitter.getUUID();
                              return gvc.bindView({
                                bind: id,
                                view: () => {
                                  return html` <div class="tx_700">分銷專屬折扣</div>
                                    ${BgWidget.mbContainer(8)}
                                    ${BgWidget.multiCheckboxContainer(
                                      gvc,
                                      [
                                        { key: 'no', name: '不套用折扣' },
                                        {
                                          key: 'yes',
                                          name: '套用折扣',
                                          innerHtml: html`
                                            <div style="margin: 4px 0 8px;">
                                              ${BgWidget.grayNote(
                                                '請至「優惠促銷」新增折扣，折扣方式必須勾選「供分銷連結使用」'
                                              )}
                                            </div>
                                            ${BgWidget.select({
                                              gvc: gvc,
                                              callback: text => {
                                                vm.data.voucher = parseInt(text, 10);
                                                gvc.notifyDataChange(id);
                                              },
                                              default: vm.data.voucher ? `${vm.data.voucher}` : '',
                                              options: [
                                                {
                                                  key: '',
                                                  value: '（請選擇優惠券）',
                                                },
                                              ].concat(
                                                vm.voucherList.map((item: any) => {
                                                  return {
                                                    key: `${item.id}`,
                                                    value: item.content.title,
                                                  };
                                                })
                                              ),
                                            })}
                                            ${[
                                              BgWidget.title(
                                                html`折扣商品
                                                  <div
                                                    class="badge ms-2 mt-3"
                                                    style="background:#eaeaea;color:#393939;"
                                                  >
                                                    僅以下設定的商品會套用折扣
                                                  </div>`,
                                                'font-size: 16px;'
                                              ),
                                              html` <div style="height: 10px;"></div>`,
                                              gvc.bindView(
                                                (() => {
                                                  const id = glitter.getUUID();
                                                  return {
                                                    bind: id,
                                                    view: () => {
                                                      vm.data.relative = vm.data.relative ?? 'all';
                                                      vm.data.relative_data = vm.data.relative_data ?? [];
                                                      return [
                                                        EditorElem.radio({
                                                          gvc: gvc,
                                                          title: '',
                                                          def: vm.data.relative,
                                                          array: [
                                                            {
                                                              title: '所有商品',
                                                              value: 'all',
                                                            },
                                                            {
                                                              title: '商品系列',
                                                              value: 'collection',
                                                            },
                                                            {
                                                              title: '特定商品',
                                                              value: 'product',
                                                            },
                                                          ],
                                                          callback: text => {
                                                            vm.data.relative = text as 'collection' | 'product' | 'all';
                                                            gvc.notifyDataChange(id);
                                                          },
                                                          oneLine: true,
                                                        }),
                                                        (() => {
                                                          switch (vm.data.relative) {
                                                            case 'collection':
                                                              return gvc.bindView(() => {
                                                                const subVM = {
                                                                  id: gvc.glitter.getUUID(),
                                                                  loading: true,
                                                                  dataList: [] as OptionsItem[],
                                                                };
                                                                return {
                                                                  bind: subVM.id,
                                                                  view: () => {
                                                                    if (subVM.loading) {
                                                                      return BgWidget.spinner();
                                                                    }
                                                                    return html`
                                                                      <div
                                                                        class="d-flex flex-column p-2"
                                                                        style="gap: 18px;"
                                                                      >
                                                                        <div
                                                                          class="d-flex align-items-center gray-bottom-line-18"
                                                                          style="gap: 24px; justify-content: space-between;"
                                                                        >
                                                                          <div class="form-check-label c_updown_label">
                                                                            <div class="tx_normal">系列列表</div>
                                                                          </div>
                                                                          ${BgWidget.grayButton(
                                                                            '選擇系列',
                                                                            gvc.event(() => {
                                                                              BgProduct.collectionsDialog({
                                                                                gvc: gvc,
                                                                                default: vm.data
                                                                                  .relative_data as string[],
                                                                                callback: async value => {
                                                                                  vm.data.relative_data = value;
                                                                                  subVM.dataList =
                                                                                    await BgProduct.getCollectiosOpts(
                                                                                      value
                                                                                    );
                                                                                  subVM.loading = true;
                                                                                  gvc.notifyDataChange(subVM.id);
                                                                                },
                                                                              });
                                                                            }),
                                                                            { textStyle: 'font-weight: 400;' }
                                                                          )}
                                                                        </div>
                                                                        ${gvc.map(
                                                                          subVM.dataList.map(
                                                                            (opt: OptionsItem, index) => {
                                                                              return html` <div
                                                                                class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                                              >
                                                                                <span class="tx_normal"
                                                                                  >${index + 1} . ${opt.value}</span
                                                                                >
                                                                                ${opt.note
                                                                                  ? html`
                                                                                      <span class="tx_gray_12 ms-2"
                                                                                        >${opt.note}</span
                                                                                      >
                                                                                    `
                                                                                  : ''}
                                                                              </div>`;
                                                                            }
                                                                          )
                                                                        )}
                                                                      </div>
                                                                    `;
                                                                  },
                                                                  onCreate: () => {
                                                                    if (subVM.loading) {
                                                                      if (vm.data.relative_data.length === 0) {
                                                                        setTimeout(() => {
                                                                          subVM.dataList = [];
                                                                          subVM.loading = false;
                                                                          gvc.notifyDataChange(subVM.id);
                                                                        }, 300);
                                                                      } else {
                                                                        new Promise<OptionsItem[]>(resolve => {
                                                                          resolve(
                                                                            BgProduct.getCollectiosOpts(
                                                                              vm.data.relative_data as string[]
                                                                            )
                                                                          );
                                                                        }).then(data => {
                                                                          subVM.dataList = data;
                                                                          subVM.loading = false;
                                                                          gvc.notifyDataChange(subVM.id);
                                                                        });
                                                                      }
                                                                    }
                                                                  },
                                                                };
                                                              });
                                                            case 'product':
                                                              return gvc.bindView(() => {
                                                                const subVM = {
                                                                  id: gvc.glitter.getUUID(),
                                                                  loading: true,
                                                                  dataList: [] as OptionsItem[],
                                                                };
                                                                return {
                                                                  bind: subVM.id,
                                                                  view: () => {
                                                                    if (subVM.loading) {
                                                                      return BgWidget.spinner();
                                                                    }
                                                                    return html`
                                                                      <div
                                                                        class="d-flex flex-column p-2"
                                                                        style="gap: 18px;"
                                                                      >
                                                                        <div
                                                                          class="d-flex align-items-center gray-bottom-line-18 "
                                                                          style="gap: 24px; justify-content: space-between;"
                                                                        >
                                                                          <div class="form-check-label c_updown_label">
                                                                            <div class="tx_normal">產品列表</div>
                                                                          </div>
                                                                          ${BgWidget.grayButton(
                                                                            '選擇商品',
                                                                            gvc.event(() => {
                                                                              BgProduct.productsDialog({
                                                                                gvc: gvc,
                                                                                default:
                                                                                  (vm.data.relative_data as string[]) ??
                                                                                  [],
                                                                                callback: async value => {
                                                                                  vm.data.relative_data = value;
                                                                                  subVM.dataList =
                                                                                    await BgProduct.getProductOpts(
                                                                                      vm.data.relative_data as string[]
                                                                                    );
                                                                                  subVM.loading = true;
                                                                                  gvc.notifyDataChange(subVM.id);
                                                                                },
                                                                              });
                                                                            }),
                                                                            { textStyle: 'font-weight: 400;' }
                                                                          )}
                                                                        </div>
                                                                        ${subVM.dataList
                                                                          .map((opt: OptionsItem, index) => {
                                                                            return html` <div
                                                                              class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                                            >
                                                                              <span
                                                                                class="tx_normal"
                                                                                style="min-width: 20px;"
                                                                                >${index + 1} .</span
                                                                              >
                                                                              ${BgWidget.validImageBox({
                                                                                gvc: gvc,
                                                                                image: opt.image,
                                                                                width: 40,
                                                                              })}
                                                                              <div
                                                                                class="tx_normal ${opt.note
                                                                                  ? 'mb-1'
                                                                                  : ''}"
                                                                              >
                                                                                ${opt.value}
                                                                              </div>
                                                                              ${opt.note
                                                                                ? html`
                                                                                    <div class="tx_gray_12">
                                                                                      ${opt.note}
                                                                                    </div>
                                                                                  `
                                                                                : ''}
                                                                            </div>`;
                                                                          })
                                                                          .join('') ||
                                                                        html` <div
                                                                          class="w-100 d-flex align-content-center justify-content-center"
                                                                        >
                                                                          尚未加入任何賣場商品
                                                                        </div>`}
                                                                      </div>
                                                                    `;
                                                                  },
                                                                  onCreate: () => {
                                                                    if (subVM.loading) {
                                                                      if (vm.data.relative_data.length === 0) {
                                                                        setTimeout(() => {
                                                                          subVM.dataList = [];
                                                                          subVM.loading = false;
                                                                          gvc.notifyDataChange(subVM.id);
                                                                        }, 300);
                                                                      } else {
                                                                        new Promise<OptionsItem[]>(resolve => {
                                                                          resolve(
                                                                            BgProduct.getProductOpts(
                                                                              vm.data.relative_data as string[]
                                                                            )
                                                                          );
                                                                        }).then(data => {
                                                                          subVM.dataList = data;
                                                                          subVM.loading = false;
                                                                          gvc.notifyDataChange(subVM.id);
                                                                        });
                                                                      }
                                                                    }
                                                                  },
                                                                };
                                                              });
                                                            case 'all':
                                                            default:
                                                              return '';
                                                          }
                                                        })(),
                                                      ].join('');
                                                    },
                                                  };
                                                })()
                                              ),
                                            ].join('')}
                                          `,
                                        },
                                      ],
                                      [vm.data.voucher_status ?? ''],
                                      (data: any) => {
                                        vm.data.voucher_status = data[0];
                                      },
                                      { single: true }
                                    )}`;
                                },
                              });
                            })()
                          ),
                          BgWidget.mainCard(
                            [
                              html` <div class="tx_700">推薦人帳號</div>
                                ${BgWidget.mbContainer(8)}
                                ${BgWidget.multiCheckboxContainer(
                                  gvc,
                                  [
                                    {
                                      key: 'old',
                                      name: '現有推薦人',
                                      innerHtml: (() => {
                                        const id = glitter.getUUID();
                                        return gvc.bindView({
                                          bind: id,
                                          view: () => {
                                            const user = vm.users.find(user => user.id === vm.data.recommend_user.id);
                                            return html` <div>
                                              ${BgWidget.select({
                                                gvc: gvc,
                                                callback: text => {
                                                  vm.data.recommend_user.id = parseInt(text, 10);
                                                  gvc.notifyDataChange(id);
                                                  gvc.notifyDataChange(vm.noteId);
                                                },
                                                default: `${vm.data.recommend_user.id ?? 0}`,
                                                options: [
                                                  {
                                                    key: '',
                                                    value: '（請選擇推薦人）',
                                                  },
                                                ].concat(
                                                  vm.users.map((item: any) => {
                                                    return {
                                                      key: `${item.id}`,
                                                      value: `${item.content.name}（${item.email}）`,
                                                    };
                                                  })
                                                ),
                                                readonly: vm.readonly,
                                              })}
                                              ${user && vm.data.recommend_user.id !== 0
                                                ? [
                                                    '',
                                                    html` <div class="tx_normal">名字</div>`,
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '',
                                                      default: user.content.name,
                                                      placeHolder: '請輸入名字',
                                                      callback: () => {},
                                                      readonly: true,
                                                    }),
                                                    html` <div class="tx_normal">電子信箱</div>
                                                      ${BgWidget.grayNote('將作為登入帳號，系統會寄送隨機密碼至此信箱')}`,
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '',
                                                      default: user.email,
                                                      placeHolder: '',
                                                      callback: () => {},
                                                      readonly: true,
                                                    }),
                                                    html` <div class="tx_normal">電話</div>`,
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '',
                                                      default: user.content.phone,
                                                      placeHolder: '',
                                                      callback: () => {},
                                                      readonly: true,
                                                    }),
                                                  ].join(BgWidget.mbContainer(8))
                                                : ''}
                                            </div>`;
                                          },
                                        });
                                      })(),
                                    },
                                    {
                                      key: 'new',
                                      name: '添加新推薦人',
                                      innerHtml: (() => {
                                        const user = vm.users.find(user => user.id === vm.data.recommend_user.id);
                                        return html` <div>
                                          ${[
                                            html` <div class="tx_normal">名字</div>`,
                                            BgWidget.editeInput({
                                              gvc: gvc,
                                              title: '',
                                              default: user ? user.content.name : (vm.data.recommend_user.name ?? ''),
                                              placeHolder: '請輸入名字',
                                              callback: text => {
                                                vm.data.recommend_user.name = text;
                                                gvc.notifyDataChange(vm.noteId);
                                              },
                                              readonly: vm.readonly,
                                            }),
                                            html` <div class="tx_normal">電子信箱</div>
                                              ${BgWidget.grayNote('將作為登入帳號，系統會寄送隨機密碼至此信箱')}`,
                                            gvc.bindView(
                                              (() => {
                                                const id = glitter.getUUID();
                                                return {
                                                  bind: id,
                                                  view: () => {
                                                    return BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '',
                                                      default: user
                                                        ? user.content.email
                                                        : (vm.data.recommend_user.email ?? ''),
                                                      placeHolder: '請輸入電子信箱',
                                                      callback: text => {
                                                        if (vm.users.find(user => user.email === text)) {
                                                          dialog.infoMessage({
                                                            text: '此推薦人信箱已建立<br />請更換其他信箱',
                                                          });
                                                          gvc.notifyDataChange(id);
                                                        } else {
                                                          vm.data.recommend_user.email = text;
                                                        }
                                                      },
                                                      readonly: vm.readonly,
                                                    });
                                                  },
                                                };
                                              })()
                                            ),
                                            html` <div class="tx_normal">電話</div>`,
                                            BgWidget.editeInput({
                                              gvc: gvc,
                                              title: '',
                                              default: user ? user.content.phone : (vm.data.recommend_user.phone ?? ''),
                                              placeHolder: '請輸入電話',
                                              callback: text => {
                                                vm.data.recommend_user.phone = text;
                                              },
                                              readonly: vm.readonly,
                                            }),
                                          ].join(BgWidget.mbContainer(8))}
                                        </div>`;
                                      })(),
                                    },
                                  ],
                                  [vm.data.recommend_status ?? ''],
                                  (data: any) => {
                                    vm.data.recommend_status = data[0];
                                    if (!vm.readonly && vm.data.recommend_status === 'new') {
                                      vm.data.recommend_user = {
                                        id: 0,
                                        name: '',
                                        email: '',
                                        phone: '',
                                      };
                                    }
                                  },
                                  { single: true, readonly: vm.readonly }
                                )}`,
                              html` <div class="tx_700">推薦媒介（可複選）</div>
                                ${BgWidget.mbContainer(8)}
                                ${BgWidget.selectDropList({
                                  gvc: gvc,
                                  callback: (value: []) => {
                                    vm.data.recommend_medium = value;
                                  },
                                  default: vm.data.recommend_medium ?? [],
                                  options: mediumList,
                                  style: 'width: 100%;',
                                })}`,
                            ].join(BgWidget.mbContainer(18))
                          ),
                          BgWidget.mainCard(
                            [
                              html` <div class="tx_700">活動時間</div>`,
                              BgWidget.mbContainer(18),
                              html` <div class="tx_normal">開始時間</div>`,
                              html` <div
                                class="d-flex mb-2 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                style="gap: 12px"
                              >
                                ${BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '',
                                  type: 'date',
                                  style: inputStyle,
                                  default: vm.data.startDate ?? getDateTime().date,
                                  placeHolder: '',
                                  callback: text => {
                                    vm.data.startDate = text;
                                  },
                                })}
                                ${BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '',
                                  type: 'time',
                                  style: inputStyle,
                                  default: vm.data.startTime ?? getDateTime().time,
                                  placeHolder: '',
                                  callback: text => {
                                    vm.data.startTime = text;
                                  },
                                })}
                              </div>`,
                              BgWidget.multiCheckboxContainer(
                                gvc,
                                [
                                  {
                                    key: 'withEnd',
                                    name: '設定結束時間',
                                    innerHtml: html` <div
                                      class="d-flex mt-1 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                      style="gap: 12px"
                                    >
                                      ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        type: 'date',
                                        style: inputStyle,
                                        default: vm.data.endDate ?? getDateTime(7).date,
                                        placeHolder: '',
                                        callback: text => {
                                          vm.data.endDate = text;
                                        },
                                      })}
                                      ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        type: 'time',
                                        style: inputStyle,
                                        default: vm.data.endTime ?? getDateTime(7).time,
                                        placeHolder: '',
                                        callback: text => {
                                          vm.data.endTime = text;
                                        },
                                      })}
                                    </div>`,
                                  },
                                ],
                                [vm.data.endDate ? 'withEnd' : ''],
                                data => {
                                  if (data[0] === 'withEnd') {
                                    vm.data.endDate = vm.data.endDate ?? getDateTime(7).date;
                                    vm.data.endTime = vm.data.endTime ?? getDateTime(7).time;
                                  } else {
                                    vm.data.endDate = undefined;
                                    vm.data.endTime = undefined;
                                  }
                                },
                                { single: false }
                              ),
                            ].join('')
                          ),
                        ];
                        return map.filter((item: string) => item.length > 0).join(BgWidget.mbContainer(24));
                      },
                      divCreate: { class: 'p-0' },
                    };
                  }),
                  ratio: 65,
                },
                {
                  html: gvc.bindView(() => {
                    return {
                      bind: vm.noteId,
                      dataList: [
                        { obj: vm.data, key: 'code' },
                        { obj: vm.data, key: 'title' },
                        { obj: vm.data, key: 'voucher_status' },
                        { obj: vm.data, key: 'voucher' },
                        { obj: vm.data, key: 'share_type' },
                        { obj: vm.data, key: 'share_value' },
                        { obj: vm.data, key: 'recommend_medium' },
                        { obj: vm.data, key: 'startDate' },
                      ],
                      view: () => {
                        return BgWidget.mainCard(
                          BgWidget.summaryHTML([
                            [
                              `分銷代碼: ${vm.data.code.length > 0 ? vm.data.code : '尚未輸入分銷代碼'}`,
                              `分銷連結名稱: ${vm.data.title.length > 0 ? vm.data.title : '尚未輸入分銷連結名稱'}`,
                            ],
                            [
                              vm.data.voucher_status === 'yes'
                                ? `套用折扣: ${(() => {
                                    const voucher = vm.voucherList.find(v => v.id === vm.data.voucher);
                                    return voucher && voucher.content && voucher.content.title
                                      ? voucher.content.title
                                      : '尚未選擇優惠券';
                                  })()}`
                                : '不套用折扣',
                            ],
                            [
                              (() => {
                                switch (vm.data.share_type) {
                                  case 'fix':
                                    return `分潤按固定金額 ${vm.data.share_value} 元`;
                                  case 'percent':
                                    return `分潤按百分比 ${vm.data.share_value} %`;
                                  case 'none':
                                  default:
                                    return '沒有分潤';
                                }
                              })(),
                              `推薦人: ${
                                vm.data.recommend_user.id
                                  ? getRecommender(vm.users, vm.data.recommend_user)
                                  : vm.data.recommend_user.name.length > 0
                                    ? vm.data.recommend_user.name
                                    : '尚未選擇推薦人'
                              }`,
                              `推薦媒介: ${
                                vm.data.recommend_medium.length > 0
                                  ? mediumList
                                      .filter(item => {
                                        return vm.data.recommend_medium.includes(item.key);
                                      })
                                      .map(item => {
                                        return item.value;
                                      })
                                  : ' 尚未選擇推薦媒介'
                              }`,
                              `啟用時間: ${vm.data.startDate}`,
                            ],
                          ])
                        );
                      },
                      divCreate: { class: 'summary-card p-0' },
                    };
                  }),
                  ratio: 35,
                }
              ),
              BgWidget.mbContainer(240),
              html` <div class="update-bar-container">
                ${cf.data.id
                  ? BgWidget.danger(
                      gvc.event(() => {
                        this.deleteLink({
                          gvc: gvc,
                          ids: [cf.data.id],
                          callback: () => {
                            cf.callback();
                          },
                        });
                      })
                    )
                  : ''}
                ${BgWidget.cancel(
                  gvc.event(() => {
                    cf.callback();
                  })
                )}
                ${BgWidget.save(
                  gvc.event(() => {
                    // 不可為空白
                    const valids: { key: 'code' | 'title'; text: string }[] = [
                      { key: 'code', text: '分銷代碼不得為空白' },
                      { key: 'title', text: '分銷連結名稱不得為空白' },
                    ];
                    for (const v of valids) {
                      if (vm.data[v.key] === undefined || vm.data[v.key].length === 0 || vm.data[v.key] === null) {
                        dialog.infoMessage({ text: v.text });
                        return;
                      }
                    }

                    // 需選擇推薦人
                    if (vm.data.recommend_status === 'old' && vm.data.recommend_user.id === 0) {
                      dialog.infoMessage({ text: '請選擇推薦人' });
                      return;
                    }

                    // 需選擇連結
                    if (!vm.data.redirect) {
                      dialog.infoMessage({ text: '請選擇導向連結' });
                      return;
                    }

                    if (vm.data.recommend_status === 'new') {
                      // 不可為空白
                      if (
                        vm.data.recommend_user.email === '' ||
                        vm.data.recommend_user.email === '' ||
                        vm.data.recommend_user.email === ''
                      ) {
                        dialog.infoMessage({ text: '請確實填寫推薦人資訊' });
                        return;
                      }

                      // 正則表達式來驗證電子郵件地址格式
                      if (!CheckInput.isEmail(vm.data.recommend_user.email)) {
                        dialog.infoMessage({ text: '請輸入正確的電子信箱格式' });
                        return;
                      }

                      // 正則表達式來驗證台灣行動電話號碼格式
                      if (!CheckInput.isTaiwanPhone(vm.data.recommend_user.phone)) {
                        dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                        return;
                      }
                    }

                    vm.data.lineItems = newOrder.productCheck;

                    vm.data.start_ISO_Date = new Date(`${vm.data.startDate} ${vm.data.startTime}`).toISOString();
                    if (vm.data.endDate && vm.data.endTime) {
                      vm.data.end_ISO_Date = new Date(`${vm.data.endDate} ${vm.data.endTime}`).toISOString();
                    } else {
                      vm.data.end_ISO_Date = '';
                    }

                    dialog.dataLoading({ visible: true });
                    if (vm.readonly) {
                      ApiRecommend.putListData({
                        id: cf.data.id,
                        data: vm.data,
                      }).then(data => {
                        dialog.dataLoading({ visible: false });
                        if (data.result) {
                          cf.callback();
                          dialog.successMessage({ text: '儲存成功' });
                        } else {
                          dialog.errorMessage({ text: '儲存失敗' });
                        }
                      });
                    } else {
                      vm.data.status = true;
                      ApiRecommend.postListData({
                        data: vm.data,
                      }).then(data => {
                        dialog.dataLoading({ visible: false });
                        if (data.result) {
                          if (data.response.result) {
                            cf.callback();
                            dialog.successMessage({ text: '儲存成功' });
                          } else {
                            dialog.errorMessage({ text: data.response.message ?? '儲存失敗' });
                          }
                        } else {
                          dialog.errorMessage({ text: '儲存失敗' });
                        }
                      });
                    }
                  })
                )}
              </div>`,
            ].join('<div class="my-2"></div>')
          );
        },
        onCreate: () => {
          if (vm.loading) {
            Promise.all([
              new Promise<any[]>(resolve => {
                ApiShop.getVoucher({
                  page: 0,
                  limit: 99999,
                }).then(data => {
                  if (data.result) {
                    resolve(
                      data.response.data.filter((item: any) => {
                        return item.content.trigger === 'distribution';
                      })
                    );
                  } else {
                    resolve([]);
                  }
                });
              }),
              new Promise<any[]>(resolve => {
                ApiRecommend.getUsers({
                  data: {},
                  page: 0,
                  limit: 99999,
                  token: (window.parent as any).config.token,
                }).then(data => {
                  if (data.result) {
                    resolve(data.response.data);
                  } else {
                    resolve([]);
                  }
                });
              }),
            ]).then(data => {
              vm.voucherList = data[0];
              vm.users = data[1];
              vm.loading = false;
              gvc.notifyDataChange(vm.id);
            });
          }
        },
      };
    });
  }

  public static editorUser(cf: { gvc: GVC; widget: any; data: any; callback: () => void }) {
    const html = String.raw;
    const gvc = cf.gvc;
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(glitter);
    const vm: {
      id: string;
      previewId: string;
      noteId: string;
      type: 'user' | 'link';
      data: RecommendUser;
      loading: boolean;
      voucherList: any[];
      readonly: boolean;
    } = {
      id: glitter.getUUID(),
      previewId: glitter.getUUID(),
      noteId: glitter.getUUID(),
      type: 'user',
      data: cf.data.content ?? {},
      loading: true,
      voucherList: [],
      readonly: cf.data.id !== undefined,
    };

    const linkVM: LinkVM = {
      id: glitter.getUUID(),
      filterId: glitter.getUUID(),
      type: 'list',
      loading: true,
      users: [],
      orderData: {},
      editData: {},
      dataList: undefined,
      query: '',
    };

    return gvc.bindView(() => {
      return {
        bind: vm.id,
        dataList: [{ obj: vm, key: 'type' }],
        view: () => {
          if (vm.loading) {
            return BgWidget.spinner({ text: { visible: false } });
          }
          if (vm.type === 'user') {
            return BgWidget.container(
              [
                html` <div class="title-container">
                    <div class="mt-1">
                      ${BgWidget.goBack(
                        gvc.event(() => {
                          cf.callback();
                        })
                      )}
                    </div>
                    <div>
                      ${BgWidget.title(vm.data.name || '新增推薦人')}${cf.data.id
                        ? BgWidget.grayNote(`建立時間: ${Tool.formatDateTime(cf.data.created_time)}`)
                        : ''}
                    </div>
                  </div>
                  <div class="flex-fill"></div>`,
                html` <div
                  class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                  style="gap: 24px"
                >
                  ${BgWidget.container(
                    gvc.bindView(() => {
                      const id = glitter.getUUID();
                      return {
                        bind: id,
                        view: () => {
                          return [
                            BgWidget.mainCard(
                              [
                                html` <div class="tx_700">推薦人資訊</div>`,
                                html` <div class="row">
                                  <div class="col-12 col-md-6">
                                    <div class="tx_normal">姓名</div>
                                    ${BgWidget.mbContainer(8)}
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      default: vm.data.name ?? '',
                                      placeHolder: '請輸入推薦人姓名',
                                      callback: text => {
                                        vm.data.name = text;
                                      },
                                    })}
                                  </div>
                                  ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                                  <div class="col-12 col-md-6">
                                    <div class="tx_normal">電子信箱</div>
                                    ${BgWidget.mbContainer(8)}
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      default: vm.data.email ?? '',
                                      placeHolder: '請輸入推薦人電子信箱',
                                      callback: text => {
                                        vm.data.email = text;
                                      },
                                    })}
                                  </div>
                                </div>`,
                                html` <div class="tx_normal">電話</div>
                                  ${BgWidget.mbContainer(8)}
                                  ${BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: vm.data.phone ?? '',
                                    placeHolder: '請輸入推薦人電話',
                                    callback: text => {
                                      vm.data.phone = text;
                                    },
                                  })}`,
                                html` <div class="tx_normal">推薦人備註</div>
                                  <div style="margin: 4px 0 8px;">${BgWidget.grayNote('只有後台管理員看得見')}</div>
                                  ${EditorElem.editeText({
                                    gvc: gvc,
                                    title: '',
                                    default: vm.data.note ?? '',
                                    placeHolder: '請輸入備註',
                                    callback: text => {
                                      vm.data.note = text;
                                    },
                                  })}`,
                              ].join(BgWidget.mbContainer(18))
                            ),
                            cf.data.id
                              ? BgWidget.mainCard(
                                  [
                                    html` <div class="tx_700">分銷連結</div>`,
                                    this.linkTable({
                                      gvc,
                                      vm: linkVM,
                                      rowCallback: (data, index: number) => {
                                        linkVM.editData = linkVM.dataList[index];
                                        vm.type = 'link';
                                      },
                                      user_id: cf.data.id,
                                    }),
                                  ].join('')
                                )
                              : '',
                          ]
                            .filter(item => {
                              return item.length > 0;
                            })
                            .join(BgWidget.mbContainer(24));
                        },
                        divCreate: { class: 'p-0' },
                      };
                    })
                  )}
                </div>`,
                BgWidget.mbContainer(240),
                html` <div class="update-bar-container">
                  ${vm.readonly
                    ? BgWidget.danger(
                        gvc.event(() => {
                          this.deleteUser({
                            gvc: gvc,
                            ids: [cf.data.id],
                            callback: () => {
                              cf.callback();
                            },
                          });
                        })
                      )
                    : ''}
                  ${BgWidget.cancel(
                    gvc.event(() => {
                      cf.callback();
                    })
                  )}
                  ${BgWidget.save(
                    gvc.event(() => {
                      // 未填寫驗證
                      const valids: {
                        key: 'name' | 'email' | 'phone';
                        text: string;
                      }[] = [
                        { key: 'name', text: '姓名不得為空白' },
                        { key: 'email', text: '信箱不得為空白' },
                        { key: 'phone', text: '電話不得為空白' },
                      ];
                      for (const v of valids) {
                        if (vm.data[v.key] === undefined || vm.data[v.key].length === 0 || vm.data[v.key] === null) {
                          dialog.infoMessage({ text: v.text });
                          return;
                        }
                      }

                      // 正則表達式來驗證電子郵件地址格式
                      if (!CheckInput.isEmail(vm.data.email)) {
                        dialog.infoMessage({ text: '請輸入正確的電子信箱格式' });
                        return;
                      }

                      // 正則表達式來驗證台灣行動電話號碼格式
                      if (!CheckInput.isTaiwanPhone(vm.data.phone)) {
                        dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                        return;
                      }

                      dialog.dataLoading({ visible: true });
                      if (vm.readonly) {
                        ApiRecommend.putUserData({
                          id: cf.data.id,
                          data: vm.data,
                        }).then(data => {
                          dialog.dataLoading({ visible: false });
                          if (data.result) {
                            cf.callback();
                            dialog.successMessage({ text: '儲存成功' });
                          } else {
                            dialog.errorMessage({ text: '儲存失敗' });
                          }
                        });
                      } else {
                        ApiRecommend.postUserData({
                          data: vm.data,
                        }).then(data => {
                          dialog.dataLoading({ visible: false });
                          if (data.result) {
                            cf.callback();
                            dialog.successMessage({ text: '儲存成功' });
                          } else {
                            dialog.errorMessage({ text: '儲存失敗' });
                          }
                        });
                      }
                    })
                  )}
                </div>`,
              ].join('<div class="my-2"></div>')
            );
          }
          if (vm.type === 'link') {
            return this.editorLink({
              gvc: gvc,
              data: linkVM.editData,
              callback: () => {
                vm.type = 'user';
              },
            });
          }
          return '';
        },
        onCreate: () => {
          if (vm.loading) {
            Promise.all([
              new Promise<any[]>(resolve => {
                ApiShop.getVoucher({
                  page: 0,
                  limit: 99999,
                }).then(data => {
                  if (data.result) {
                    resolve(
                      data.response.data.filter((item: any) => {
                        return item.content.trigger === 'distribution';
                      })
                    );
                  } else {
                    resolve([]);
                  }
                });
              }),
            ]).then(data => {
              vm.voucherList = data[0];
              vm.loading = false;
              gvc.notifyDataChange(vm.id);
            });
          }
        },
      };
    });
  }

  public static deleteLink(obj: { gvc: GVC; ids: number[]; callback: () => void }) {
    const dialog = new ShareDialog(obj.gvc.glitter);
    dialog.checkYesOrNot({
      text: '是否確認刪除所選項目？',
      callback: response => {
        if (response) {
          dialog.dataLoading({ visible: true });
          ApiRecommend.deleteLinkData({
            token: (window.parent as any).config.token,
            data: { id: obj.ids },
          }).then(data => {
            dialog.dataLoading({ visible: false });
            if (data.result) {
              if (data.response.result) {
                dialog.successMessage({ text: '刪除成功' });
                obj.callback();
              } else {
                dialog.errorMessage({ text: data.response.message ?? '刪除失敗' });
              }
            } else {
              dialog.errorMessage({ text: '刪除失敗' });
            }
          });
        }
      },
    });
  }

  public static deleteUser(obj: { gvc: GVC; ids: number[]; callback: () => void }) {
    const dialog = new ShareDialog(obj.gvc.glitter);
    dialog.checkYesOrNot({
      text: '若刪除推薦人，也將同時刪除與此推薦人相關的分銷連結，<br />是否確認刪除所選項目？',
      callback: response => {
        if (response) {
          dialog.dataLoading({ visible: true });
          ApiRecommend.deleteUserData({
            token: (window.parent as any).config.token,
            data: { id: obj.ids },
          }).then(data => {
            dialog.dataLoading({ visible: false });
            if (data.result) {
              if (data.response.result) {
                dialog.successMessage({ text: '刪除成功' });
                obj.callback();
              } else {
                dialog.errorMessage({ text: data.response.message ?? '刪除失敗' });
              }
            } else {
              dialog.errorMessage({ text: '刪除失敗' });
            }
          });
        }
      },
    });
  }
}

function getRecommender(
  userList: any[],
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
  }
) {
  if (data.name && data.name.length > 0) {
    return data.name;
  }
  const user = userList.find(u => u.id === data.id);
  return user ? user.content.name : '';
}

function getDateTime(n = 0) {
  const now = new Date();
  now.setDate(now.getDate() + n);
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hours}:00`;
  return { date: dateStr, time: timeStr };
}

(window as any).glitter.setModule(import.meta.url, BgRecommend);
