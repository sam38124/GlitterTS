import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { StockStores } from './stock-stores.js';
import { ApiReconciliation } from '../glitter-base/route/api-reconciliation.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { FilterOptions } from './filter-options.js';
import { OrderExcel } from './module/order-excel.js';
import { ListHeaderOption } from './list-header-option.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { OrderSetting } from './module/order-setting.js';
import { ApiDelivery } from '../glitter-base/route/delivery.js';
import { DeliveryHTML } from './module/delivery-html.js';
import { ShoppingInvoiceManager } from './shopping-invoice-manager.js';
import { BgRecommend } from '../backend-manager/bg-recommend.js';
import { ShoppingOrderManager } from './shopping-order-manager.js';
import { PaymentConfig } from '../glitter-base/global/payment-config.js';
import { POSSetting } from './POS-setting.js';
import { PosFunction } from './pos-pages/pos-function.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { OrderInfo } from '../public-models/order-info.js';

const html = String.raw;

interface ViewModel {
  id: string;
  loading: boolean;
  filterId: string;
  type: 'list' | 'add' | 'replace' | 'select' | 'createInvoice' | 'viewInvoice' | 'recommend';
  data: any;
  invoiceData: any;
  orderData: any;
  distributionData: any;
  dataList: any;
  query?: string;
  queryType?: string;
  orderString?: string;
  return_order?: boolean;
  filter?: any;
  tempOrder?: string;
  filter_type: 'normal' | 'block' | 'pos';
  apiJSON: any;
  checkedData: any[];
  headerConfig: string[];
}

//共用樣式
const globalStyle = {
  header_title: `
        color: #393939;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    `,
  sub_title: `
        color: #393939;
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    `,
  sub_14: `
        color: #393939;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    `,
  chart_width: 223,
  select_date: `
        color: #393939;
        font-size: 14.497px;
        font-style: normal;
        cursor: pointer;
        font-weight: 700;
        line-height: normal;
    `,
  un_select_date: `
        color: #8d8d8d;
        cursor: pointer;
        font-size: 14.497px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    `,
};

export class ReconciliationArea {
  public static vm = {
    page: 1,
  };

  public static main(gvc: GVC) {
    const vm_o: {
      filter_date: string;
      start_date: string;
      end_date: string;
      loading: boolean;
      view_type: 'order' | 'list';
      checkedData: any;
      order_id: string;
      summary: {
        total: number;
        total_received: number;
        offset_amount: number;
        expected_received: number;
        order_count: number;
        short_total_amount: number;
        over_total_amount: number;
      };
    } = {
      filter_date: 'week',
      start_date: '',
      end_date: '',
      loading: true,
      view_type: 'list',
      checkedData: [],
      order_id: '',
      summary: {
        total: 0,
        total_received: 0,
        offset_amount: 0,
        expected_received: 0,
        order_count: 0,
        short_total_amount: 0,
        over_total_amount: 0,
      },
    };
    const vm: ViewModel = {
      id: gvc.glitter.getUUID(),
      loading: true,
      type: 'list',
      data: {},
      invoiceData: {},
      dataList: undefined,
      query: '',
      queryType: '',
      orderData: undefined,
      orderString: '',
      distributionData: {},
      filter_type: 'normal',
      filter: {},
      filterId: gvc.glitter.getUUID(),
      return_order: false,
      apiJSON: {},
      checkedData: [],
      headerConfig: [],
    };
    return gvc.bindView(() => {
      const id = gvc.glitter.getUUID();

      function loadData() {
        vm_o.loading = true;
        gvc.notifyDataChange(id);
        ApiReconciliation.getSummary(vm_o.filter_date, vm_o.start_date, vm_o.end_date).then(res => {
          vm_o.loading = false;
          vm_o.summary = res.response as any;
          gvc.notifyDataChange(id);
        });
      }

      loadData();

      return {
        bind: id,
        view: () => {
          if (vm_o.loading) {
            return BgWidget.spinner();
          } else if (vm_o.view_type === 'order') {
            return ShoppingOrderManager.replaceOrder(gvc, vm_o, vm_o.order_id, () => {
              vm_o.view_type = 'list';
              gvc.notifyDataChange(id);
            });
          } else {
            return BgWidget.container(
              [
                html`
                  <div class="title-container mb-2">
                    ${BgWidget.title(`對帳專區`)}
                    <div class="flex-fill"></div>
                    <div class="d-flex" style="gap: 14px;">
                      ${[
                        BgWidget.grayButton(
                          '匯出',
                          gvc.event(() => {
                            OrderExcel.exportDialog(gvc, vm.apiJSON, vm_o.checkedData);
                          })
                        ),
                        BgWidget.grayButton(
                          '匯入',
                          gvc.event(() => {
                            OrderExcel.importDialog(gvc, { is_reconciliation: true }, () => {
                              loadData();
                            });
                          })
                        ),
                      ].join('')}
                    </div>
                  </div>
                  <div class="px-3 px-lg-0">
                    ${BgWidget.warningInsignia(`對帳單的數據來源為已付款、已退款或已取貨的訂單。`)}
                  </div>
                `,
                BgWidget.card(
                  gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    const dateId = gvc.glitter.getUUID();
                    let loading = true;
                    return {
                      bind: id,
                      view: () => {
                        if (loading) {
                          BgWidget.spinner({
                            circle: { visible: false },
                            container: { style: 'margin: 3rem 0;' },
                          });
                        }
                        return html`
                          <div style="${globalStyle.header_title}">統計時間</div>
                          <div
                            class="d-flex flex-wrap align-items-end"
                            style="${document.body.clientWidth < 768 ? `gap: 0px;` : `gap: 12px;`}"
                          >
                            <div class="d-flex flex-column">
                              ${BgWidget.select({
                                gvc: gvc,
                                default: vm_o.filter_date,
                                callback: key => {
                                  vm_o.filter_date = key;
                                  if (vm_o.filter_date === 'custom') {
                                    gvc.notifyDataChange(dateId);
                                  } else {
                                    loadData();
                                  }
                                },
                                options: [
                                  { key: 'week', value: '近7日' },
                                  { key: '1m', value: '近1個月' },
                                  { key: 'year', value: '近12個月' },
                                  { key: 'custom', value: '自訂日期區間' },
                                ],
                                style: 'margin: 8px 0;',
                              })}
                            </div>
                            ${gvc.bindView({
                              bind: dateId,
                              view: () => {
                                return html` <div
                                  class="d-flex align-items-center flex-wrap ${vm_o.filter_date === 'custom'
                                    ? ''
                                    : 'd-none'}"
                                  style="gap: 12px;"
                                >
                                  <div class="d-flex flex-column">
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      type: 'date',
                                      style: 'display: block; width: 160px; height: 38px;',
                                      default: vm_o.start_date ? vm_o.start_date.slice(0, 10) : '',
                                      placeHolder: '',
                                      callback: text => {
                                        vm_o.start_date = text ? `${text} 00:00:00` : '';
                                      },
                                    })}
                                  </div>
                                  <div>至</div>
                                  <div class="d-flex flex-column">
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      type: 'date',
                                      style: 'display: block; width: 160px; height: 38px;',
                                      default: vm_o.end_date ? vm_o.end_date.slice(0, 10) : '',
                                      placeHolder: '',
                                      callback: text => {
                                        vm_o.end_date = text ? `${text} 23:59:59` : '';
                                      },
                                    })}
                                  </div>
                                  <div
                                    class="d-flex align-items-center justify-content-center ${document.body
                                      .clientWidth < 768
                                      ? `w-100`
                                      : ``}"
                                  >
                                    ${BgWidget.grayButton(
                                      '查詢',
                                      gvc.event(() => {
                                        loadData();
                                      }),
                                      {
                                        class: `w-100`,
                                      }
                                    )}
                                  </div>
                                </div>`;
                              },
                            })}
                          </div>
                        `;
                      },
                      divCreate: {},
                      onCreate: () => {},
                    };
                  })
                ),
                html` <div class="row p-0  mx-n2" style="">
                  ${[
                    {
                      title: '應收總金額',
                      value: vm_o.summary.total.toLocaleString(),
                      icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                    },
                    {
                      title: '實際入帳總金額',
                      value: vm_o.summary.total_received.toLocaleString(),
                      icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                    },
                    {
                      title: '待入帳總金額',
                      value: vm_o.summary.expected_received.toLocaleString(),
                      icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                    },
                    {
                      title: '訂單總數',
                      value: vm_o.summary.order_count.toLocaleString(),
                      icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                    },
                    {
                      title: '應沖總金額',
                      value: vm_o.summary.offset_amount.toLocaleString(),
                      icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                    },
                    {
                      title: '短收總金額',
                      value: vm_o.summary.short_total_amount.toLocaleString(),
                      icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                    },
                    {
                      title: '多收總金額',
                      value: vm_o.summary.over_total_amount.toLocaleString(),
                      icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                    },
                  ]
                    .map(dd => {
                      return html` <div
                        class="w-100 px-3 py-3"
                        style="align-self: stretch; background: white; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.10); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: center; align-items: flex-start; gap: 10px; display: inline-flex;"
                      >
                        <div
                          style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 16px; display: inline-flex;"
                        >
                          <div
                            style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; display: inline-flex;"
                          >
                            <div
                              style="align-self: stretch; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 500; word-wrap: break-word;"
                            >
                              ${dd.title}
                            </div>
                            <div
                              style="align-self: stretch; color: #393939; font-size: 24px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word;"
                            >
                              ${dd.value}
                            </div>
                          </div>
                        </div>
                      </div>`;
                    })
                    .map(dd => {
                      return html` <div class="col-sm-4 col-lg-3 col-12 px-0 px-sm-2 mb-sm-3 mb-1">${dd}</div>`;
                    })
                    .join('')}
                </div>`,
                (() => {
                  const glitter = gvc.glitter;
                  const ListComp = new BgListComponent(gvc, vm, FilterOptions.orderFilterFrame);
                  vm.filter = ListComp.getFilterObject();

                  gvc.addMtScript(
                    [{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }],
                    () => {},
                    () => {}
                  );

                  if ((window.parent as any).glitter.getUrlParameter('orderID')) {
                    vm.type = 'replace';
                    vm.data = {
                      cart_token: (window.parent as any).glitter.getUrlParameter('orderID'),
                    };
                  }

                  let created_time = (() => {
                    if (vm_o.filter_date === 'custom') {
                      return new Date(vm_o.start_date).toISOString();
                    }
                    const date = new Date();
                    date.setHours(0, 0, 0, 0);
                    date.setDate(date.getDate() - [7, 30, 365][['week', '1m', 'year'].indexOf(vm_o.filter_date)]);
                    return date.toISOString();
                  })();

                  let end_time = (() => {
                    if (vm_o.filter_date === 'custom') {
                      return new Date(vm_o.end_date).toISOString();
                    }
                    const date = new Date();
                    date.setHours(23, 59, 59, 999);
                    return date.toISOString();
                  })();

                  return gvc.bindView({
                    bind: vm.id,
                    dataList: [{ obj: vm, key: 'type' }],
                    view: () => {
                      return BgWidget.mainCard(
                        [
                          (() => {
                            const id = glitter.getUUID();
                            return gvc.bindView({
                              bind: id,
                              view: async () => {
                                const orderFunnel = await FilterOptions.getReconciliationFunnel();

                                const filterList = [
                                  BgWidget.selectFilter({
                                    gvc,
                                    callback: (value: any) => {
                                      vm.queryType = value;
                                      gvc.notifyDataChange(vm.id);
                                    },
                                    default: vm.queryType || 'cart_token',
                                    options: FilterOptions.orderSelect,
                                  }),
                                  BgWidget.searchFilter(
                                    gvc.event(e => {
                                      vm.query = `${e.value}`.trim();
                                      gvc.notifyDataChange(vm.id);
                                    }),
                                    vm.query || '',
                                    '搜尋訂單'
                                  ),
                                  BgWidget.funnelFilter({
                                    gvc,
                                    callback: () => {
                                      ListComp.showRightMenu(orderFunnel);
                                    },
                                  }),
                                  BgWidget.updownFilter({
                                    gvc,
                                    callback: (value: any) => {
                                      vm.orderString = value;
                                      gvc.notifyDataChange(vm.id);
                                    },
                                    default: vm.orderString || 'created_time_desc',
                                    options: FilterOptions.orderOrderBy,
                                  }),
                                ];
                                const filterTags = ListComp.getFilterTags(
                                  await FilterOptions.getReconciliationFunnel()
                                );
                                return BgListComponent.listBarRWD(filterList, filterTags);
                              },
                            });
                          })(),
                          BgWidget.tableV3({
                            gvc: gvc,
                            defPage: ReconciliationArea.vm.page,
                            getData: vmi => {
                              ReconciliationArea.vm.page = vmi.page;
                              const limit = 20;
                              vm.apiJSON = {
                                page: vmi.page - 1,
                                limit: limit,
                                search: vm.query || undefined,
                                searchType: vm.queryType || 'cart_token',
                                orderString: vm.orderString,
                                filter: {
                                  ...vm.filter,
                                  created_time: [created_time, end_time],
                                },
                                is_pos: vm.filter_type === 'pos',
                                is_reconciliation: true,
                              };

                              ApiShop.getOrder(vm.apiJSON).then(async data => {
                                const support = await PaymentConfig.getSupportPayment();

                                function getDatalist() {
                                  return data.response.data.map((dd: any) => {
                                    dd.orderData.total = dd.orderData.total || 0;
                                    dd.orderData.customer_info = dd.orderData.customer_info ?? {};
                                    return [
                                      {
                                        key: '訂單編號',
                                        value: html` <div
                                          class="d-flex align-items-center gap-2"
                                          onclick="${gvc.event((e, event) => {
                                            // vm_o.order_id=dd.cart_token;
                                            // vm_o.view_type='order';
                                            // gvc.notifyDataChange(id);
                                            // event.stopPropagation();
                                          })}"
                                        >
                                          ${dd.cart_token}${(() => {
                                            switch (dd.orderData.orderSource) {
                                              case 'manual':
                                                return BgWidget.primaryInsignia('手動', { type: 'border' });
                                              default:
                                                return '';
                                            }
                                          })()}
                                        </div>`,
                                      },
                                      {
                                        key: '訂單日期',
                                        value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd'),
                                      },
                                      {
                                        key: '出貨日期',
                                        value: dd.orderData.user_info.shipment_date
                                          ? glitter.ut.dateFormat(
                                              new Date(dd.orderData.user_info.shipment_date),
                                              'yyyy-MM-dd'
                                            )
                                          : '尚未出貨',
                                      },
                                      {
                                        key: '付款方式',
                                        value:
                                          support.find(d1 => {
                                            return d1.key === dd.payment_method;
                                          })?.name || '線下付款',
                                      },
                                      {
                                        key: '入帳日期',
                                        value: dd.reconciliation_date
                                          ? glitter.ut.dateFormat(new Date(dd.reconciliation_date), 'yyyy-MM-dd')
                                          : '-',
                                      },
                                      {
                                        key: '應收金額',
                                        value: `$${dd.total.toLocaleString()}`,
                                      },
                                      {
                                        key: '實際入帳',
                                        value: `$${((dd.total_received || 0) + (dd.offset_amount || 0)).toLocaleString()}`,
                                      },
                                      {
                                        key: '應沖金額',
                                        value: (() => {
                                          if (
                                            dd.total_received === dd.total ||
                                            dd.total_received === null ||
                                            dd.total_received === undefined
                                          ) {
                                            return '-';
                                          } else {
                                            return `$${dd.orderData.total - (dd.total_received + (dd.offset_amount || 0))}`;
                                          }
                                        })(),
                                      },
                                      {
                                        key: '付款狀態',
                                        value: OrderInfo.paymentStatus(dd),
                                      },
                                      {
                                        key: '對帳狀態',
                                        value: OrderInfo.reconciliationStatus(dd),
                                      },
                                      {
                                        key: '沖帳原因',
                                        value: dd.offset_reason ?? '-',
                                      },
                                    ].map((dd: any) => {
                                      dd.value = html` <div style="line-height:40px;">${dd.value}</div>`;
                                      return dd;
                                    });
                                  });
                                }

                                vm.dataList = data.response.data;
                                vmi.pageSize = Math.ceil(data.response.total / limit);
                                vmi.originalData = vm.dataList;
                                vmi.tableData = getDatalist();
                                vmi.loading = false;
                                if (vmi.pageSize != 0 && vmi.page > vmi.pageSize) {
                                  ReconciliationArea.vm.page = 1;
                                  gvc.notifyDataChange(vm.id);
                                }
                                vmi.callback();
                              });
                            },
                            rowClick: async (_, index) => {
                              const dialog = new ShareDialog(gvc.glitter);
                              dialog.dataLoading({ visible: true });
                              const auth = await ApiUser.getPermission({
                                page: 0,
                                limit: 100,
                              }).then(res => {
                                return res.response.data.find((dd: any) => {
                                  return (
                                    `${dd.user}` === `${GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID}`
                                  );
                                });
                              });
                              dialog.dataLoading({ visible: false });

                              if (vm.dataList[index].reconciliation_date) {
                                let records = vm.dataList[index]['offset_records'] ?? [];

                                function recon() {
                                  let put_recon: {
                                    offset_amount?: number;
                                    offset_reason?: string;
                                    offset_date?: string;
                                    note: string;
                                  } = {
                                    offset_amount: undefined,
                                    offset_reason: '支付金額異常',
                                    offset_date: undefined,
                                    note: '',
                                  };
                                  BgWidget.settingDialog({
                                    gvc: gvc,
                                    d_main_style: 'padding-left:0px;padding-right:0px;',
                                    title: '訂單沖帳',
                                    innerHTML: gvc => {
                                      return `<div class="mt-n2">
${[
  ` <div class="col-12 d-flex flex-column" style="gap:5px;">
                                    <div class="" >沖帳訂單</div>
                                    <div class=" fw-500 fs-6">${vm.dataList[index].cart_token}</div>
                                  </div>`,
  ` <div class="col-12 d-flex flex-column" style="gap:5px;">
                                    <div class="" >沖帳人員</div>
                                    <div class=" fw-500 fs-6">${auth.config.name}</div>
                                  </div>`,
  ` <div class="col-12 d-flex flex-column" style="">
                                    <div class="" >沖帳日期</div>
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      default: '',
                                      type: 'date',
                                      placeHolder: '請選擇日期',
                                      callback: text => {
                                        put_recon.offset_date = new Date().toISOString();
                                      },
                                    })}
                                  </div>`,
  ` <div class="col-12 d-flex flex-column" style="">
                                    <div class=" " style="">沖帳金額</div>
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      default: '',
                                      type: 'number',
                                      placeHolder: '',
                                      callback: text => {
                                        put_recon.offset_amount = parseInt(text, 10);
                                      },
                                    })}
                                  </div>`,
  gvc.bindView(() => {
    const l_i = gvc.glitter.getUUID();
    return {
      bind: l_i,
      view: () => {
        return ` <div class="mb-2" style="">沖帳原因</div>
                                    ${BgWidget.select({
                                      gvc,
                                      callback: (value: any) => {
                                        if (value === '其他') {
                                          put_recon.offset_reason = '';
                                        } else {
                                          put_recon.offset_reason = value;
                                        }
                                        gvc.notifyDataChange(l_i);
                                      },
                                      default: [
                                        '支付金額異常',
                                        '手續費差異',
                                        '匯率計算差異',
                                        '系統錯誤',
                                        '訂單退款',
                                      ].includes(put_recon.offset_reason!!)
                                        ? put_recon.offset_reason!!
                                        : '',
                                      options: [
                                        { title: '支付金額異常', value: '支付金額異常' },
                                        { title: '手續費差異', value: '手續費差異' },
                                        { title: '匯率計算差異', value: '匯率計算差異' },
                                        { title: '系統錯誤', value: '系統錯誤' },
                                        { title: '訂單退款', value: '訂單退款' },
                                        { title: '其他', value: '' },
                                      ].map(item => {
                                        return {
                                          key: item.value,
                                          value: item.title,
                                        };
                                      }),
                                    })}
${
  ['支付金額異常', '手續費差異', '匯率計算差異', '系統錯誤', '訂單退款'].includes(put_recon.offset_reason!!)
    ? ``
    : `<div class="">${BgWidget.editeInput({
        gvc: gvc,
        title: '',
        default: put_recon.offset_reason ?? '',
        placeHolder: '請輸入沖帳原因',
        callback: text => {
          put_recon.offset_reason = text;
        },
      })}</div>`
}
`;
      },
      divCreate: {
        class: `col-12 d-flex flex-column`,
        style: ``,
      },
    };
  }),
  ` <div class="col-12 d-flex flex-column" style="gap:5px;">
                                    <div class="" >沖帳備註</div>
                                  ${BgWidget.textArea({
                                    gvc,
                                    title: '',
                                    default: put_recon.note,
                                    placeHolder: ``,
                                    callback: text => {
                                      put_recon.note = text;
                                    },
                                  })}
                                  </div>`,
]
  .map(dd => {
    return `<div class="w-100 px-3">${dd}</div>`;
  })
  .join('<div class="w-100 border-top my-2"></div>')}
</div>`;
                                    },
                                    footer_html: gvc => {
                                      return html` <div class="d-flex align-items-center" style="gap:10px;">
                                        ${BgWidget.cancel(
                                          gvc.event(() => {
                                            gvc.closeDialog();
                                          }, '取消')
                                        )}
                                        ${BgWidget.save(
                                          gvc.event(() => {
                                            if (!put_recon.offset_date) {
                                              dialog.errorMessage({ text: '請輸入沖帳日期' });
                                              return;
                                            }
                                            if (!put_recon.offset_reason) {
                                              dialog.errorMessage({ text: '請選擇沖帳原因' });
                                              return;
                                            }

                                            dialog.checkYesOrNot({
                                              text: '是否確認進行沖帳?',
                                              callback: response => {
                                                if (response) {
                                                  dialog.dataLoading({ visible: true });
                                                  ApiReconciliation.putReconciliation({
                                                    order_id: vm.dataList[index].cart_token,
                                                    update: {
                                                      offset_amount:
                                                        vm.dataList[index].offset_amount + put_recon.offset_amount,
                                                      offset_reason: put_recon.offset_reason,
                                                      offset_records: JSON.stringify(
                                                        JSON.parse(JSON.stringify(records)).concat([
                                                          {
                                                            offset_amount: put_recon.offset_amount,
                                                            offset_reason: put_recon.offset_reason,
                                                            offset_date: put_recon.offset_date,
                                                            offset_note: put_recon.note,
                                                            user: auth.config,
                                                          },
                                                        ])
                                                      ),
                                                    },
                                                  }).then(res => {
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.successMessage({ text: '更新成功' });
                                                    loadData();
                                                    gvc.closeDialog();
                                                  });
                                                }
                                              },
                                            });
                                          }),
                                          '下一步'
                                        )}
                                      </div>`;
                                    },
                                  });
                                }

                                BgWidget.settingDialog({
                                  gvc: gvc,
                                  d_main_style: 'padding-left:0px;padding-right:0px;',
                                  title: '對帳紀錄',
                                  innerHTML: gvc => {
                                    const dd = vm.dataList[index];
                                    return html` <div class="mt-n2">
                                      ${[
                                        `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                    <div class="" >對帳訂單</div>
                                    <div class=" fw-500 fs-6">${vm.dataList[index].cart_token}</div>
                                  </div>`,
                                        html`
                                          <div class="rounded-3 w-100 border p-2 " style="background: whitesmoke;">
                                            ${[
                                              `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                                <div class="">入帳日期</div>
                                                <div class=" fw-500 fs-6">${gvc.glitter.ut.dateFormat(new Date(dd.reconciliation_date), 'yyyy-MM-dd hh:mm')}</div>
                                              </div>`,
                                              `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                                <div class="">入帳金額</div>
                                                <div class=" fw-500 fs-6">$ ${parseInt(dd.total_received, 10).toLocaleString()}</div>
                                              </div>`,
                                            ].join(`<div class="my-2 border-top w-100"></div>`)}
                                          </div>
                                        `,
                                        ...(() => {
                                          return JSON.parse(JSON.stringify(records))
                                            .reverse()
                                            .map((dd: any) => {
                                              return `<div class="rounded-3 w-100 border p-2 " style="background: whitesmoke;">
${[
  `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                                <div class="">沖帳日期</div>
                                                <div class=" fw-500 fs-6">${gvc.glitter.ut.dateFormat(new Date(dd.offset_date), 'yyyy-MM-dd hh:mm')}</div>
                                              </div>`,
  `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                                <div class="">沖帳人員</div>
                                                <div class=" fw-500 fs-6">${(dd.user && dd.user.name) || '未知'}</div>
                                              </div>`,
  `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                                <div class="">沖帳金額</div>
                                                <div class=" fw-500 fs-6">$ ${parseInt(dd.offset_amount, 10).toLocaleString()}</div>
                                              </div>`,
  `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                                <div class="">沖帳原因</div>
                                                <div class=" fw-500 fs-6">${dd.offset_reason}</div>
                                              </div>`,
  `<div class="col-12 d-flex flex-column" style="gap:5px;">
                                                <div class="">沖帳備註</div>
                                                <div class=" fw-500 fs-6">${dd.offset_note || '未填寫'}</div>
                                              </div>`,
].join(`<div class="my-2 border-top w-100"></div>`)}
</div>`;
                                            });
                                        })(),
                                      ]
                                        .map(dd => {
                                          return `<div class="w-100 px-3">${dd}</div>`;
                                        })
                                        .join('<div class="w-100 border-top my-2"></div>')}
                                    </div>`;
                                  },
                                  footer_html: gvc => {
                                    return html` <div class="d-flex align-items-center" style="gap:10px;">
                                      ${BgWidget.cancel(
                                        gvc.event(() => {
                                          gvc.closeDialog();
                                        }),
                                        '關閉'
                                      )}
                                      ${BgWidget.save(
                                        gvc.event(() => {
                                          recon();
                                          gvc.closeDialog();
                                        }),
                                        '再次沖帳'
                                      )}
                                    </div>`;
                                  },
                                });
                              } else {
                                let put_recon: {
                                  reconciliation_date?: string;
                                  total_received?: number;
                                } = {
                                  reconciliation_date: undefined,
                                  total_received: undefined,
                                };
                                BgWidget.settingDialog({
                                  gvc: gvc,
                                  d_main_style: 'padding-left:0px;padding-right:0px;',
                                  title: '清點入帳金額',
                                  innerHTML: gvc => {
                                    return `<div class="mt-n2">
${[
  ` <div class="col-12 d-flex flex-column" style="gap:5px;">
                                    <div class="" >對帳訂單</div>
                                    <div class=" fw-500 fs-6">${vm.dataList[index].cart_token}</div>
                                  </div>`,
  ` <div class="col-12 d-flex flex-column" style="gap:5px;">
                                    <div class="" >對帳人員</div>
                                    <div class=" fw-500 fs-6">${auth.config.name}</div>
                                  </div>`,
  ` <div class="col-12 d-flex flex-column" style="">
                                    <div class="" >入帳日期</div>
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      default: '',
                                      type: 'date',
                                      placeHolder: '請選擇日期',
                                      callback: text => {
                                        put_recon.reconciliation_date = new Date().toISOString();
                                      },
                                    })}
                                  </div>`,
  ` <div class="col-12 d-flex flex-column" style="">
                                    <div class=" " style="">實收金額</div>
                                    <div class="text-black fw-500 fs-6 ">
                                      ${BgWidget.grayNote('請確實填寫入帳金額，點擊下一步將無法修改金額')}
                                    </div>
                                    ${BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '',
                                      default: '',
                                      type: 'number',
                                      placeHolder: '',
                                      callback: text => {
                                        put_recon.total_received = parseInt(text, 10);
                                      },
                                    })}
                                  </div>`,
]
  .map(dd => {
    return `<div class="w-100 px-3">${dd}</div>`;
  })
  .join('<div class="w-100 border-top my-2"></div>')}
</div>`;
                                  },
                                  footer_html: gvc => {
                                    return html` <div class="d-flex align-items-center" style="gap:10px;">
                                      ${BgWidget.cancel(
                                        gvc.event(() => {
                                          gvc.closeDialog();
                                        }, '取消')
                                      )}
                                      ${BgWidget.save(
                                        gvc.event(() => {
                                          if (!put_recon.reconciliation_date) {
                                            dialog.errorMessage({ text: '請輸入對帳日期' });
                                            return;
                                          }
                                          if (!put_recon.total_received) {
                                            dialog.errorMessage({ text: '請輸入入帳金額' });
                                            return;
                                          }
                                          dialog.checkYesOrNot({
                                            text: '確認後無法再做修改，後續如有差額請進行沖帳並填寫沖帳原因!',
                                            callback: response => {
                                              if (response) {
                                                dialog.dataLoading({ visible: true });
                                                ApiReconciliation.putReconciliation({
                                                  order_id: vm.dataList[index].cart_token,
                                                  update: put_recon,
                                                }).then(res => {
                                                  dialog.dataLoading({ visible: false });
                                                  dialog.successMessage({ text: '更新成功' });
                                                  loadData();
                                                  gvc.closeDialog();
                                                });
                                              }
                                            },
                                          });
                                        }),
                                        '下一步'
                                      )}
                                    </div>`;
                                  },
                                });
                              }
                            },
                            filter: [],
                            filterCallback: (dataArray: any) => {
                              vm_o.checkedData = dataArray;
                            },
                          }),
                        ].join('')
                      );
                    },
                    onCreate: () => {},
                  });
                })(),
              ].join(`<div style="height:18px;"></div>`)
            );
          }
        },
      };
    });
  }
}

(window as any).glitter.setModule(import.meta.url, ReconciliationArea);
