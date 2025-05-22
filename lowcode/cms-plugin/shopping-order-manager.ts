import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { BgRecommend } from '../backend-manager/bg-recommend.js';
import { Language } from '../glitter-base/global/language.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiDelivery } from '../glitter-base/route/delivery.js';
import { ApiRecommend } from '../glitter-base/route/recommend.js';
import { PaymentConfig } from '../glitter-base/global/payment-config.js';
import { ShipmentConfig } from '../glitter-base/global/shipment-config.js';
import { OrderInfo } from '../public-models/order-info.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { Tool } from '../modules/tool.js';
import { CheckInput } from '../modules/checkInput.js';
import { CountryTw } from '../modules/country-language/country-tw.js';
import { OrderExcel } from './module/order-excel.js';
import { DeliveryHTML, PrintType } from './module/delivery-html.js';
import { OrderSetting } from './module/order-setting.js';
import { PosFunction } from './pos-pages/pos-function.js';
import { UserList } from './user-list.js';
import { FilterOptions } from './filter-options.js';
import { ListHeaderOption } from './list-header-option.js';
import { ShoppingInvoiceManager } from './shopping-invoice-manager.js';
import { OrderModule } from './order/order-module.js';
import { TableStorage } from './module/table-storage.js';

const html = String.raw;
const css = String.raw;

class OrderDetail {
  subtotal: number;
  shipment: number;
  total: number;
  discount: number;
  shipment_fee: number;
  use_rebate: number;
  lineItems: LineItem[];
  rebate: number;
  cart_token: string;
  tag: 'manual';
  voucher: VoucherData;
  customer_info: {
    name: string;
    email: string;
    phone: string;
    payment_select?: string;
  };
  user_info: {
    name: string;
    email: string;
    phone: string;
    address: string;
    shipment: 'normal' | 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C';
    CVSStoreName: string;
    CVSStoreID: string;
    CVSTelephone: string;
    MerchantTradeNo: string;
    CVSAddress: string;
    note: string;
  };
  pay_status: any;

  constructor(subtotal: number, shipment: number, newVoucher: any) {
    this.subtotal = subtotal;
    this.discount = 0;
    this.rebate = 0;
    this.shipment_fee = 0;
    this.use_rebate = 0;
    this.shipment = shipment;
    this.cart_token = '';
    this.lineItems = [];
    this.voucher = newVoucher;
    this.tag = 'manual';
    this.user_info = {
      CVSAddress: '',
      CVSStoreID: '',
      CVSStoreName: '',
      CVSTelephone: '',
      MerchantTradeNo: '',
      address: '',
      email: '',
      name: '',
      note: '',
      phone: '',
      shipment: 'normal',
    };
    this.customer_info = {
      name: '',
      phone: '',
      email: '',
    };
    this.total = 0;
  }
}

export class ShoppingOrderManager {
  static vm = {
    page: 1,
  };

  static main(gvc: GVC, query: OrderQuery) {
    const glitter = gvc.glitter;
    query.isArchived = Boolean(query.isArchived);

    const vm: ViewModel = {
      id: glitter.getUUID(),
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
      filter: {},
      filterId: glitter.getUUID(),
      filter_type: query.isPOS ? 'pos' : 'all',
      return_order: false,
      apiJSON: {},
      checkedData: [],
      headerConfig: [],
      listLimit: TableStorage.getLimit(),
    };
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
    } else {
      const url = window.parent.location.href;
      const urlParams = new URLSearchParams(new URL(url).search);
      [
        'MerchantID',
        'MerchantTradeNo',
        'LogisticsSubType',
        'CVSStoreID',
        'CVSAddress',
        'CVSTelephone',
        'CVSOutSide',
        'CVSStoreName',
      ].forEach(key => {
        if (vm.type !== 'add' && urlParams.get(key)) {
          vm.type = 'add';
        }
      });
    }
    const thathis = this;

    return gvc.bindView({
      bind: vm.id,
      dataList: [{ obj: vm, key: 'type' }],
      view: () => {
        if (vm.loading) {
          return '';
        }

        try {
          const viewMap: Record<string, () => string> = {
            list: () => thathis.tableOrder(gvc, vm, query, ListComp),
            replace: () => thathis.replaceOrder(gvc, vm, vm.data.cart_token),
            add: () => thathis.createOrder(gvc, vm),
            createInvoice: () => {
              vm.return_order = true;
              return ShoppingInvoiceManager.createOrder(gvc, vm, (vm as any).tempOrder);
            },
            recommend: () => {
              return BgRecommend.editorLink({
                gvc: gvc,
                data: vm.distributionData.data[0],
                callback: () => {
                  vm.type = 'replace';
                },
                vm,
              });
            },
            viewInvoice: () => {
              vm.return_order = true;
              return ShoppingInvoiceManager.replaceOrder(gvc, vm, vm.invoiceData);
            },
          };

          return viewMap[vm.type]() ?? '';
        } catch (e) {
          console.error(e);
          return `${e}`;
        }
      },
      onCreate: () => {
        if (vm.loading) {
          ApiUser.getPublicConfig('list-header-view', 'manager').then((dd: any) => {
            vm.headerConfig = dd.response.value['order-list'];
            vm.loading = false;
            gvc.notifyDataChange(vm.id);
          });
        }
      },
    });
  }

  static tableOrder(gvc: GVC, vm: ViewModel, query: OrderQuery, ListComp: BgListComponent) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(glitter);

    if (vm.return_order) {
      vm.return_order = false;
      vm.data = {
        cart_token: (window.parent as any).glitter.getUrlParameter('orderID'),
      };
      setTimeout(() => {
        vm.type = 'replace';
      }, 10);
    }

    return BgWidget.container(html`
      <div class="title-container">
        ${BgWidget.title(
          (() => {
            if (query.isShipment && query.isArchived) {
              return '已封存出貨單';
            } else if (query.isShipment) {
              return '出貨單列表';
            } else if (query.isArchived) {
              return '已封存訂單';
            } else {
              return '訂單列表';
            }
          })()
        )}
        <div class="flex-fill"></div>
        <div class="d-flex" style="gap: 14px;">
          ${query.isShipment
            ? BgWidget.grayButton(
                '匯入',
                gvc.event(() => {
                  OrderExcel.importDialog(gvc, query, () => gvc.notifyDataChange(vm.id));
                })
              )
            : ''}
          ${BgWidget.grayButton(
            '匯出',
            gvc.event(() => {
              OrderExcel.exportDialog(gvc, vm.apiJSON, vm.checkedData);
            })
          )}
          ${query.isArchived || query.isShipment
            ? ''
            : BgWidget.darkButton(
                '新增',
                gvc.event(() => {
                  vm.type = 'add';
                })
              )}
        </div>
      </div>
      <div class="${query.isShipment ? '' : 'd-none'} mb-3"></div>
      ${BgWidget.tab(
        query.isPOS
          ? [
              { title: '所有訂單', key: 'all' },
              { title: 'POS訂單', key: 'pos' },
              { title: '線上訂單', key: 'normal' },
            ]
          : [
              { title: '所有訂單', key: 'all' },
              { title: '線上訂單', key: 'normal' },
              { title: 'POS訂單', key: 'pos' },
            ],
        gvc,
        vm.filter_type,
        text => {
          vm.filter_type = text as any;
          gvc.notifyDataChange(vm.id);
        },
        query.isShipment ? 'display: none;' : ''
      )}
      ${BgWidget.mainCard(
        [
          gvc.bindView({
            bind: glitter.getUUID(),
            view: async () => {
              const orderFunnel = await FilterOptions.getOrderFunnel();

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
                BgWidget.countingFilter({
                  gvc,
                  callback: value => {
                    vm.listLimit = value;
                    gvc.notifyDataChange(vm.id);
                  },
                  default: vm.listLimit,
                }),
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
                query.isShipment
                  ? ''
                  : BgWidget.columnFilter({
                      gvc,
                      callback: () =>
                        BgListComponent.rightMenu({
                          menuTitle: '表格設定',
                          items: ListHeaderOption.orderListItems,
                          frame: ListHeaderOption.orderListFrame,
                          default: {
                            headerColumn: vm.headerConfig,
                          },
                          cancelType: 'default',
                          save: data => {
                            if (data.headerColumn) {
                              dialog.dataLoading({ visible: true });
                              ApiUser.getPublicConfig('list-header-view', 'manager').then((dd: any) => {
                                ApiUser.setPublicConfig({
                                  key: 'list-header-view',
                                  value: {
                                    ...dd.response.value,
                                    'order-list': data.headerColumn,
                                  },
                                  user_id: 'manager',
                                }).then(() => {
                                  dialog.dataLoading({ visible: false });
                                  vm.loading = true;
                                  gvc.notifyDataChange(vm.id);
                                });
                              });
                            }
                          },
                        }),
                    }),
              ];

              const filterTags = ListComp.getFilterTags(orderFunnel);
              return BgListComponent.listBarRWD(filterList, filterTags);
            },
          }),
          BgWidget.tableV3({
            gvc: gvc,
            defPage: ShoppingOrderManager.vm.page,

            getData: vmi => {
              ShoppingOrderManager.vm.page = vmi.page;
              vm.apiJSON = {
                page: vmi.page - 1,
                limit: vm.listLimit,
                search: vm.query || undefined,
                searchType: vm.queryType || 'cart_token',
                orderString: vm.orderString,
                filter: vm.filter,
                archived: `${query.isArchived}`,
                is_shipment: query.isShipment,
              };
              if (vm.filter_type !== 'all') {
                vm.apiJSON.is_pos = vm.filter_type === 'pos';
              }

              ApiShop.getOrder(vm.apiJSON).then(async data => {
                async function getDatalist() {
                  const [payment_support, watchUserList] = await Promise.all([
                    PaymentConfig.getSupportPayment(),
                    ApiUser.getUserListOrders({
                      page: 0,
                      limit: 99999,
                      filter_type: 'watch',
                      only_id: true,
                    }),
                  ]).then(dataArray => {
                    return [dataArray[0], dataArray[1].response.data];
                  });

                  const watchUsers = [
                    ...new Set(
                      watchUserList
                        .map((item: any) => {
                          return [item.account, item.email, item.phone];
                        })
                        .flat()
                    ),
                  ];

                  function cartTokenComponent(cart_token: any, source_badge: string, is_watch_user: boolean) {
                    return html`<div style="min-width:200px;">
                      <div style="position: relative; height: 40px;">
                        <div
                          style="position: absolute; bottom: 9px; height: 9px; width: 127px; ${is_watch_user
                            ? 'background-color: #ffe9b2'
                            : ''}"
                        ></div>
                        <span style="position: absolute; bottom: 0;">${cart_token}${source_badge}</span>
                      </div>
                    </div>`;
                  }

                  return data.response.data.map((dd: any) => {
                    const vt = OrderSetting.getAllStatusBadge(dd);
                    dd.orderData.total = dd.orderData.total || 0;
                    dd.orderData.customer_info = dd.orderData.customer_info ?? {};

                    const isWatchUser = watchUsers.includes(dd.orderData.email);
                    const tooltipText = isWatchUser ? '此份訂單的顧客為觀察名單' : '';

                    // 顧客資料 | 訂購人資料
                    const userName = dd.orderData.customer_info ? dd.orderData.customer_info.name || '未填寫' : '匿名';
                    // 收件人資料
                    const receiveName = dd.orderData.user_info ? dd.orderData.user_info.name || '未填寫' : '匿名';

                    if (query.isShipment) {
                      return [
                        {
                          key: '訂單編號',
                          value: cartTokenComponent(dd.cart_token, vt.sourceBadge(), isWatchUser),
                          tooltip: tooltipText,
                        },
                        {
                          key: '出貨日期',
                          value: dd.orderData.user_info.shipment_date
                            ? glitter.ut.dateFormat(new Date(dd.orderData.user_info.shipment_date), 'yyyy-MM-dd hh:mm')
                            : '尚未設定',
                        },
                        {
                          key: '訂購人',
                          value: dd.orderData.orderSource === 'POS' ? receiveName : userName,
                        },
                        {
                          key: '收件人',
                          value: receiveName,
                        },
                        {
                          key: '出貨狀態',
                          value: vt.outShipBadge(),
                        },
                        {
                          key: '出貨單號碼',
                          value: dd.orderData.user_info.shipment_number,
                        },
                      ].map((dd: any) => {
                        dd.value = html` <div style="line-height:40px;">${dd.value}</div>`;
                        return dd;
                      });
                    } else {
                      return [
                        {
                          key: '訂單編號',
                          value: cartTokenComponent(dd.cart_token, vt.sourceBadge(), isWatchUser),
                          tooltip: tooltipText,
                        },
                        {
                          key: '訂單日期',
                          value: html` <div style="width: 120px;">
                            ${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd')}
                          </div>`,
                        },
                        {
                          key: '訂購人',
                          value: dd.orderData.orderSource === 'POS' ? receiveName : userName,
                        },
                        {
                          key: '收件人',
                          value: receiveName,
                        },
                        {
                          key: '訂單金額',
                          value: `$ ${dd.orderData.total.toLocaleString()}`,
                        },
                        {
                          key: '付款狀態',
                          value: vt.paymentBadge(),
                        },
                        {
                          key: '出貨狀態',
                          value: vt.outShipBadge(),
                        },
                        {
                          key: '訂單狀態',
                          value: vt.orderStatusBadge(),
                        },
                        {
                          key: '運送方式',
                          value: html` <div style="width: 120px;">
                            ${OrderInfo.shipmetSelector(dd, OrderModule.supportShipmentMethod())}
                          </div>`,
                        },
                        {
                          key: '付款方式',
                          value: OrderInfo.paymentSelector(gvc, dd, payment_support),
                        },
                        {
                          key: '付款時間',
                          value: html` <div style="width: 160px;">
                            ${(() => {
                              if (!dd.orderData.editRecord) {
                                return '-';
                              }
                              const record = dd.orderData.editRecord.find(
                                (item: { record: string }) => item.record === '付款成功'
                              );
                              return record ? Tool.formatDateTime(record.time) : '-';
                            })()}
                          </div>`,
                        },
                        {
                          key: '對帳狀態',
                          value: OrderInfo.reconciliationStatus(dd),
                        },
                        {
                          key: '發票號碼',
                          value: dd.invoice_no || '-',
                        },
                      ]
                        .filter(item => {
                          return vm.headerConfig.includes(item.key);
                        })
                        .map((dd: any) => {
                          dd.value = html`<div style="line-height: 40px;">${dd.value}</div>`;
                          return dd;
                        });
                    }
                  });
                }

                vm.dataList = data.response.data;
                vmi.pageSize = Math.ceil(data.response.total / vm.listLimit);
                vmi.originalData = vm.dataList;
                vmi.tableData = await getDatalist();
                vmi.loading = false;
                if (vmi.pageSize != 0 && vmi.page > vmi.pageSize) {
                  ShoppingOrderManager.vm.page = 1;
                  gvc.notifyDataChange(vm.id);
                }
                vmi.callback();
              });
            },
            rowClick: (_, index) => {
              vm.data = vm.dataList[index];
              vm.type = 'replace';
            },
            filter: (() => {
              async function updateOrders(orders: Order[]) {
                dialog.dataLoading({ visible: true });
                Promise.all(
                  orders.map(order => {
                    return new Promise<void>((resolve, reject) => {
                      ApiShop.putOrder({
                        id: `${order.id}`,
                        order_data: order.orderData,
                        status: order.status,
                      }).then(response => {
                        response.result ? resolve() : reject();
                      });
                    });
                  })
                )
                  .then(() => {
                    dialog.dataLoading({ visible: false });
                    dialog.successMessage({ text: '更新成功' });
                    gvc.notifyDataChange(vm.id);
                  })
                  .catch(() => {
                    dialog.dataLoading({ visible: false });
                    dialog.errorMessage({ text: '更新失敗' });
                  });
              }

              const normalArray = [
                {
                  name: '開立發票',
                  option: true,
                  event: (checkArray: any) => {
                    dialog.dataLoading({ visible: true, text: '取得訂單資料中' });
                    ApiShop.getOrder({
                      page: 0,
                      limit: 9999,
                      id_list: checkArray.map((order: any) => order.id).join(','),
                    }).then(r => {
                      dialog.dataLoading({ visible: false });

                      if (r.result && Array.isArray(r.response.data)) {
                        const orders: Invoice[] = r.response.data;

                        const hasInvoiceOrder = orders.find(order => order.invoice_number);
                        if (hasInvoiceOrder) {
                          dialog.infoMessage({
                            text: `訂單編號 #${hasInvoiceOrder.cart_token} 已開立發票，請重新選取`,
                          });
                          return;
                        }

                        const hasCancelOrder = orders.find(order => `${order.orderData.orderStatus}` === '-1');
                        if (hasCancelOrder) {
                          dialog.infoMessage({
                            text: `訂單編號 #${hasCancelOrder.cart_token} 已取消，不可開立發票`,
                          });
                          return;
                        }

                        const hasReturnOrder = orders.find(order => `${order.status}` === '-2');
                        if (hasReturnOrder) {
                          dialog.infoMessage({
                            text: `訂單編號 #${hasReturnOrder.cart_token} 已退款，不可開立發票`,
                          });
                          return;
                        }

                        orders.forEach(order => {
                          order.orderData.user_info.address ??= '無地址';
                        });

                        dialog.dataLoading({ visible: true, text: '開立發票中' });
                        return ApiShop.batchPostInvoice(
                          orders.map(order => {
                            return { orderID: order.cart_token, orderData: order };
                          })
                        ).then(r => {
                          dialog.dataLoading({ visible: false });
                          if (r.result) {
                            dialog.successMessage({ text: '開立成功' });
                            gvc.notifyDataChange(vm.id);
                          } else {
                            dialog.errorMessage({ text: '開立失敗' });
                          }
                        });
                      }
                    });
                  },
                },
                {
                  name: '合併訂單',
                  option: true,
                  event: (checkArray: any) => {
                    return OrderSetting.combineOrders(gvc, checkArray, () => gvc.notifyDataChange(vm.id));
                  },
                },
                {
                  name: '更改付款狀態',
                  option: true,
                  event: (checkArray: any) => {
                    OrderSetting.allEditDialog({
                      gvc,
                      title: '批量更改付款狀態',
                      options: OrderSetting.getPaymentStatusOpt(),
                      callback: (value: any) => {
                        checkArray.forEach((order: any) => {
                          order.status = Number(value);
                        });
                        updateOrders(checkArray);
                      },
                    });
                  },
                },
                {
                  name: '更改出貨狀態',
                  option: true,
                  event: (checkArray: any) => {
                    OrderSetting.allEditDialog({
                      gvc,
                      title: '批量更改出貨狀態',
                      options: OrderSetting.getShippmentOpt(),
                      callback: (value: any) => {
                        checkArray.forEach((order: any) => {
                          order.orderData.progress = value;
                          if (['wait', 'returns', undefined].includes(value)) {
                            order.orderData.user_info.shipment_number = '';
                          }
                        });
                        updateOrders(checkArray);
                      },
                    });
                  },
                },
                {
                  name: '更改訂單狀態',
                  option: true,
                  event: (checkArray: any) => {
                    OrderSetting.allEditDialog({
                      gvc,
                      title: '批量更改訂單狀態',
                      options: OrderSetting.getOrderStatusOpt(),
                      callback: (value: any) => {
                        checkArray.forEach((order: any) => {
                          order.orderData.orderStatus = value;
                        });
                        updateOrders(checkArray);
                      },
                    });
                  },
                },
                {
                  name: '批改訂單各項狀態',
                  option: true,
                  event: (checkArray: any) => {
                    OrderSetting.batchEditOrders({
                      gvc,
                      orders: checkArray,
                      callback: (orders: any) => {
                        setTimeout(() => updateOrders(orders), 150);
                      },
                    });
                  },
                },
                {
                  name: '自動生成出貨單',
                  option: true,
                  event: (checkArray: any) => {
                    const strArray = checkArray.map((order: any) => {
                      try {
                        return order.orderData.user_info.shipment;
                      } catch (error) {
                        return undefined;
                      }
                    });

                    const allEqual = strArray.every((val: string) => val && val === strArray[0]);

                    if (!allEqual) {
                      dialog.errorMessage({ text: '配送的方式必須相同' });
                      return;
                    }
                    if (checkArray.find((dd: any) => dd.orderData.user_info.shipment_number)) {
                      dialog.errorMessage({ text: `已取號訂單無法再次取號` });
                      return;
                    }

                    OrderModule.printStoreOrderInfo({
                      gvc,
                      cart_token: checkArray.map((order: any) => order.cart_token).join(','),
                      print: false,
                      callback: () => gvc.notifyDataChange(vm.id),
                    });
                  },
                },
                {
                  name: '手動生成出貨單',
                  option: true,
                  event: (checkArray: any) => {
                    if (checkArray.find((dd: any) => dd.orderData.user_info.shipment_number)) {
                      dialog.errorMessage({ text: `已取號訂單無法再次取號` });
                      return;
                    }
                    if (checkArray.find((dd: any) => !['', 'wait'].includes(dd.orderData.progress ?? ''))) {
                      dialog.errorMessage({ text: `未出貨的訂單才可以進行取號` });
                      return;
                    }

                    dialog.checkYesOrNot({
                      text: '系統將自動生成配號並產生出貨單',
                      callback: response => {
                        if (response) {
                          let shipment_date = gvc.glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd');
                          let shipment_time = gvc.glitter.ut.dateFormat(new Date(), 'hh:mm');

                          async function next() {
                            dialog.dataLoading({
                              visible: true,
                            });
                            let index_number = 0;
                            await Promise.all(
                              checkArray.map((order: any) => {
                                return new Promise(async (resolve, reject) => {
                                  order.orderData.user_info.shipment_number = `${new Date().getTime()}${index_number++}`;
                                  order.orderData.user_info.shipment_date = new Date(
                                    `${shipment_date} ${shipment_time}:00`
                                  ).toISOString();

                                  ApiShop.putOrder({
                                    id: `${order.id}`,
                                    order_data: order.orderData,
                                  }).then(response => {
                                    resolve(true);
                                  });
                                });
                              })
                            );
                            dialog.dataLoading({
                              visible: false,
                            });
                            gvc.notifyDataChange(vm.id);
                          }

                          BgWidget.settingDialog({
                            gvc: gvc,
                            title: '設定出貨日期',
                            innerHTML: (gvc: GVC) => {
                              return [
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '出貨日期',
                                  default: shipment_date,
                                  callback: text => {
                                    shipment_date = text;
                                  },
                                  type: 'date',
                                  placeHolder: '請輸入出貨日期',
                                }),
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '出貨時間',
                                  default: shipment_time,
                                  callback: text => {
                                    shipment_time = text;
                                  },
                                  type: 'time',
                                  placeHolder: '請輸入出貨時間',
                                }),
                              ].join('');
                            },
                            footer_html: (gvc: GVC) => {
                              return [
                                BgWidget.cancel(
                                  gvc.event(() => {
                                    gvc.closeDialog();
                                  }),
                                  '取消'
                                ),
                                BgWidget.save(
                                  gvc.event(() => {
                                    gvc.closeDialog();
                                    next();
                                  }),
                                  '儲存'
                                ),
                              ].join('');
                            },
                            width: 350,
                          });
                        }
                      },
                    });
                  },
                },
              ];

              const shipmentArray = [
                {
                  name: '取消配號/出貨',
                  option: true,
                  event: async (checkArray: any) => {
                    if (checkArray.find((dd: any) => dd.progress !== 'wait')) {
                      dialog.errorMessage({ text: '未出貨訂單才能取消配號與出貨' });
                      return;
                    }
                    dialog.dataLoading({ visible: true });
                    await Promise.all(
                      checkArray.map((order: any) => {
                        return new Promise(async resolve => {
                          ApiDelivery.cancelOrder({
                            cart_token: order.cart_token,
                            logistic_number: order.orderData.user_info.shipment_number as any,
                            total_amount: order.orderData.total as any,
                          })
                            .then(() => resolve(true))
                            .catch(() => resolve(true));
                        });
                      })
                    );
                    dialog.dataLoading({ visible: false });
                    gvc.recreateView();
                  },
                },
                {
                  name: '列印托運單',
                  option: true,
                  event: (checkArray: any) => {
                    const strArray = checkArray.map((dd: any) => {
                      try {
                        return dd.orderData.user_info.shipment;
                      } catch (error) {
                        return undefined;
                      }
                    });

                    if (strArray.includes(undefined)) {
                      dialog.errorMessage({
                        text: html` <div class="text-center">已勾選訂單中不可含有<br />非超商店到店的配送方式</div>`,
                      });
                      return;
                    }

                    const allEqual = strArray.every((val: string) => val && val === strArray[0]);

                    if (!allEqual) {
                      dialog.errorMessage({ text: '配送的方式必須相同' });
                      return;
                    }

                    if (strArray.includes('HILIFEC2C') && strArray.length > 1) {
                      dialog.errorMessage({ text: '萊爾富不支援一次列印多張托運單' });
                      return;
                    }

                    return OrderModule.printStoreOrderInfo({
                      gvc,
                      cart_token: checkArray.map((order: any) => order.cart_token).join(','),
                      print: true,
                    });
                  },
                },
                {
                  name: '更改出貨狀態',
                  option: true,
                  event: (checkArray: any) => {
                    function showDialog(orders: Order[]) {
                      let progress = '';
                      BgWidget.settingDialog({
                        gvc: gvc,
                        title: '批量更改出貨狀態',
                        innerHTML: (gvc: GVC) => {
                          return html` <div>
                            <div class="tx_700 mb-2">更改為 ${BgWidget.requiredStar()}</div>
                            ${BgWidget.select({
                              gvc,
                              callback: (value: any) => {
                                progress = value;
                              },
                              default: progress,
                              options: [
                                { title: '變更出貨狀態', value: '' },
                                { title: '已出貨', value: 'shipping' },
                                { title: '備貨中', value: 'wait' },
                                { title: '已取貨', value: 'finish' },
                                { title: '已退貨', value: 'returns' },
                                { title: '已到貨', value: 'arrived' },
                              ].map(item => {
                                return {
                                  key: item.value,
                                  value: item.title,
                                };
                              }),
                            })}
                          </div>`;
                        },
                        footer_html: (gvc: GVC) => {
                          return [
                            BgWidget.cancel(
                              gvc.event(() => {
                                gvc.closeDialog();
                              }),
                              '取消'
                            ),
                            BgWidget.save(
                              gvc.event(() => {
                                if (progress === '') {
                                  dialog.infoMessage({ text: '請選擇欲更改的出貨狀態' });
                                  return;
                                }
                                gvc.closeDialog();
                                orders.forEach(order => {
                                  if (['wait', 'returns', undefined].includes(progress)) {
                                    order.orderData.user_info.shipment_number = '';
                                  }

                                  order.orderData.progress = progress;
                                });
                                updateOrders(orders);
                              }),
                              '儲存'
                            ),
                          ].join('');
                        },
                        width: 350,
                      });
                    }

                    function main() {
                      dialog.dataLoading({ visible: true });
                      ApiShop.getOrder({
                        page: 0,
                        limit: 1000,
                        id_list: checkArray.map((order: any) => order.id).join(','),
                      }).then(d => {
                        dialog.dataLoading({ visible: false });
                        if (d.result && Array.isArray(d.response.data)) {
                          const orders = d.response.data as Order[];
                          const hasPaynowShipping = orders.find(order => {
                            try {
                              return order.orderData.user_info.shipment_refer === 'paynow';
                            } catch (error) {
                              return false;
                            }
                          });

                          if (hasPaynowShipping) {
                            dialog.infoMessage({
                              text: `自動物流追蹤之出貨單，不可手動更改<br/>（訂單編號：${hasPaynowShipping.cart_token}）`,
                            });
                          } else {
                            showDialog(d.response.data);
                          }
                        } else {
                          dialog.errorMessage({ text: '取得訂單資料錯誤' });
                        }
                      });
                    }

                    main();
                  },
                },
              ];

              const defaultArray = [
                {
                  name: '列印出貨明細 / 地址貼條',
                  event: (checkArray: any) => {
                    let type = '';

                    BgWidget.settingDialog({
                      gvc: gvc,
                      title: '列印模式',
                      innerHTML: (gvc: GVC) =>
                        BgWidget.select({
                          gvc,
                          callback: (value: any) => {
                            type = value;
                          },
                          default: '',
                          options: [
                            { title: '選擇列印模式', value: '' },
                            { title: '出貨明細', value: 'shipment' },
                            { title: '地址貼條', value: 'address' },
                            { title: '出貨明細 + 地址貼條', value: 'shipAddr' },
                          ].map(item => {
                            return {
                              key: item.value,
                              value: item.title,
                            };
                          }),
                        }),
                      footer_html: (gvc: GVC) => {
                        return [
                          BgWidget.cancel(
                            gvc.event(() => {
                              gvc.closeDialog();
                            }),
                            '取消'
                          ),
                          BgWidget.save(
                            gvc.event(() => {
                              if (['shipment', 'address', 'shipAddr'].includes(type)) {
                                gvc.closeDialog();
                                DeliveryHTML.print(gvc, checkArray, type as PrintType);
                              } else {
                                dialog.infoMessage({ text: '請選擇列印模式' });
                              }
                            }),
                            '列印'
                          ),
                        ].join('');
                      },
                      width: 350,
                    });
                  },
                },
                {
                  name: query.isArchived ? '解除封存' : '批量封存',
                  event: (checkArray: any) => {
                    const action_with = ['order_list', 'order_list_archive'].includes(
                      (window as any).glitter.getUrlParameter('page')
                    )
                      ? '出貨單'
                      : '訂單';
                    dialog.checkYesOrNot({
                      text: html` <div class="d-flex flex-column" style="gap:5px;">
                        是否確認${query.isArchived ? '解除封存' : '封存'}所選項目?
                        ${BgWidget.grayNote(
                          `**請注意**  將連同${action_with}一併${query.isArchived ? '解除封存' : '封存'}`
                        )}
                      </div>`,
                      callback: (response: boolean) => {
                        if (response) {
                          dialog.dataLoading({ visible: true });
                          new Promise<void>(resolve => {
                            let n = 0;
                            for (const b of checkArray) {
                              b.orderData.archived = `${!query.isArchived}`;
                              ApiShop.putOrder({
                                id: `${b.id}`,
                                order_data: b.orderData,
                              }).then(resp => {
                                if (resp.result && ++n == checkArray.length) {
                                  resolve();
                                }
                              });
                            }
                          }).then(() => {
                            dialog.dataLoading({ visible: false });
                            gvc.notifyDataChange(vm.id);
                          });
                        }
                      },
                    });
                  },
                },
                {
                  name: '列印揀貨單',
                  option: true,
                  event: (checkArray: any) => {
                    DeliveryHTML.print(gvc, checkArray, 'pick');
                  },
                },
              ];

              return [...defaultArray, ...(query.isShipment ? shipmentArray : normalArray)];
            })(),
            filterCallback: (dataArray: any) => {
              vm.checkedData = dataArray;
            },
          }),
        ].join('')
      )}
      ${BgWidget.mbContainer(240)}
    `);
  }

  static replaceOrder(gvc: GVC, vm: any, passOrderData?: any, backCallback?: () => any) {
    async function replaceView() {
      try {
        let orderData = {} as Order;
        let originData = {} as Order;
        let userDataLoading = true;
        let invoiceLoading = true;
        let storeLoading = true;
        let productLoading = true;
        let userData: any = {};
        let invoiceDataList: any = [];
        let storeList: any = [];
        let mainViewId = gvc.glitter.getUUID();
        let productData: any = [];
        let is_shipment = ['shipment_list_archive', 'shipment_list'].includes(
          (window as any).glitter.getUrlParameter('page')
        );

        const dialog = new ShareDialog(gvc.glitter);
        const saasConfig = (window.parent as any).saasConfig;
        const child_vm: {
          type: 'order' | 'user';
          userID: string;
        } = {
          type: 'order',
          userID: '',
        };

        const cart_token: string =
          typeof passOrderData === 'string'
            ? passOrderData
            : structuredClone(passOrderData ?? vm.data ?? { cart_token: '-1' }).cart_token;

        (window.parent as any).glitter.setUrlParameter('orderID', cart_token);
        (window.parent as any).glitter.setUrlParameter(cart_token);

        if (cart_token) {
          const orderDataNew = await ApiShop.getOrder({
            page: 0,
            limit: 1,
            search: cart_token,
            data_from: 'manager',
            searchType: 'cart_token_exact',
          });
          orderData = structuredClone(orderDataNew.response.data[0]);
          originData = structuredClone(orderData);
        }

        orderData.orderData.progress = orderData.orderData.progress ?? 'wait';
        if (
          orderData.orderData.shipment_selector &&
          !orderData.orderData.shipment_selector.some(dd => dd.value === 'now')
        ) {
          orderData.orderData.shipment_selector.push({
            name: '立即取貨',
            value: 'now',
            form: undefined,
          });
        }

        ApiUser.getUsersDataWithEmailOrPhone(orderData.email).then(res => {
          userData = res.response;
          userDataLoading = false;
          gvc.notifyDataChange(mainViewId);
        });

        ApiShop.getInvoice({
          page: 0,
          limit: 1000,
          search: orderData.cart_token,
          searchType: 'order_number',
        }).then((data: any) => {
          invoiceDataList = data.response.data;
          invoiceLoading = false;
          gvc.notifyDataChange('invoiceView');
        });

        ApiShop.getProduct({
          page: 0,
          limit: 99,
          productType: 'all',
          status: 'inRange',
          id_list: orderData.orderData.lineItems.map((dd: any) => dd.id) as any,
        }).then(r => {
          productData = r.response.data;
          productLoading = false;
          gvc.notifyDataChange(mainViewId);
        });

        function saveEvent() {
          dialog.dataLoading({ text: '上傳中', visible: true });
          ApiShop.putOrder({
            id: `${orderData.id}`,
            order_data: orderData.orderData,
            status: orderData.status,
          }).then(response => {
            dialog.dataLoading({ text: '上傳中', visible: false });
            if (response.result) {
              if (orderData.orderData.method && originData.status == 0 && orderData.status == 1) {
                dialog.successMessage({
                  text: html` <div class="text-center">訂單付款完成！<br />若需要可透過下方按鈕手動建立發票</div>`,
                });
              } else {
                dialog.successMessage({ text: '更新成功' });
              }
              gvc.notifyDataChange('orderDetailRefresh');
            } else {
              dialog.errorMessage({ text: '更新異常' });
            }
          });
        }

        const funBTN = () => {
          gvc.addStyle(css`
            .funInsignia {
              border-radius: 10px;
              background: #eaeaea;
              display: flex;
              padding: 6px 18px;
              justify-content: center;
              align-items: center;
              gap: 8px;
              font-size: 16px;
              font-weight: 700;
              cursor: pointer;
            }
          `);
          return {
            splitOrder: () => {
              return html` <div
                class="funInsignia"
                onclick="${gvc.event(() => {
                  if (orderData.orderData.orderSource == 'split') {
                    return;
                  }
                  OrderSetting.splitOrder(gvc, orderData.orderData, () => gvc.notifyDataChange(vm.id));
                })}"
              >
                拆分訂單
              </div>`;
            },
          };
        };

        function getBadgeList() {
          const vt = OrderSetting.getAllStatusBadge(orderData as any, 'sm');
          return html` <div class="d-flex justify-content-end align-items-center gap-3">
            ${vt.archivedBadge()}
            ${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}${OrderInfo.reconciliationStatus(
              orderData,
              false,
              'sm'
            )}
          </div>`;
        }

        if (
          !['CVSStoreID', 'CVSStoreName', 'CVSAddress'].find(dd => {
            return !(window.parent as any).glitter.getUrlParameter(dd);
          })
        ) {
          await new Promise(resolve => {
            dialog.checkYesOrNot({
              text: '是否確認更換門市?',
              callback: response => {
                if (response) {
                  ['CVSStoreID', 'CVSStoreName', 'CVSAddress'].map(dd => {
                    (orderData.orderData.user_info as any)[dd] = (window.parent as any).glitter.getUrlParameter(dd);
                    (window.parent as any).glitter.setUrlParameter(dd);
                  });
                  saveEvent();
                } else {
                  ['CVSStoreID', 'CVSStoreName', 'CVSAddress'].map(dd => {
                    (window.parent as any).glitter.setUrlParameter(dd);
                  });
                  resolve(false);
                }
              },
            });
          });
        }

        return gvc.bindView({
          bind: mainViewId,
          dataList: [{ obj: child_vm, key: 'type' }],
          view: () => {
            try {
              if (userDataLoading || productLoading) {
                return BgWidget.spinner();
              }

              if (child_vm.type === 'user') {
                return UserList.userInformationDetail({
                  userID: child_vm.userID,
                  callback: () => {
                    child_vm.type = 'order';
                  },
                  gvc: gvc,
                });
              }

              const is_archive = orderData.orderData.archived === 'true';

              const shipment_card = BgWidget.mainCard(
                (() => {
                  let loading = true;
                  const vm: { mode: 'edit' | 'read' } = { mode: 'read' };

                  return gvc.bindView({
                    bind: 'Edit',
                    dataList: [{ obj: vm, key: 'mode' }],
                    view: () => {
                      if (loading) {
                        return '';
                      }
                      return [
                        is_shipment
                          ? html`
                              <div class="tx_700 d-flex align-items-center" style="gap:5px;">訂單號碼</div>
                              ${BgWidget.mbContainer(12)}
                              <div
                                style="color: #4D86DB; cursor: pointer;"
                                onclick="${gvc.event(() => {
                                  is_shipment = false;
                                  gvc.notifyDataChange('orderDetailRefresh');
                                })}"
                              >
                                ${(orderData.orderData as any).combineOrderID || (orderData.orderData as any).orderID}
                              </div>
                            `
                          : '',
                        is_shipment ? '' : html` <div class="tx_700">配送 / 出貨單資訊</div>`,
                        html` <div class="tx_700 d-flex align-items-center flex-wrap" style="gap:10px;">
                            出貨狀態
                            ${orderData.orderData.user_info.shipment_refer === 'paynow'
                              ? BgWidget.warningInsignia('已啟用物流追蹤將自動追蹤出貨狀態')
                              : ''}
                          </div>
                          ${BgWidget.mbContainer(12)}
                          <div class="ms-auto w-100">
                            ${BgWidget.select({
                              gvc,
                              default: (() => {
                                if (!orderData.orderData.progress) {
                                  return 'wait';
                                }

                                if (
                                  orderData.orderData.progress === 'wait' &&
                                  orderData.orderData.user_info.shipment_number
                                ) {
                                  return 'in_stock';
                                }

                                return orderData.orderData.progress;
                              })(),
                              options: OrderSetting.getShippmentOpt(),
                              callback: (text: any) => {
                                const emptyStatus = ['wait', 'returns', undefined, ''];
                                const addNumberStatus = ['arrived', 'finish', 'shipping', 'in_stock'];

                                function next() {
                                  if (text && text !== `${orderData.orderData.progress}`) {
                                    orderData.orderData.progress = text;
                                  }
                                }

                                if (
                                  emptyStatus.includes(orderData.orderData.progress) &&
                                  addNumberStatus.includes(text) &&
                                  !orderData.orderData.user_info.shipment_number
                                ) {
                                  dialog.checkYesOrNot({
                                    text: '尚未新增出貨單，是否隨機取號並變更出貨狀態?',
                                    callback: response => {
                                      if (response) {
                                        next();

                                        orderData.orderData.user_info.shipment_number = emptyStatus.includes(text)
                                          ? ''
                                          : `${new Date().getTime()}`;

                                        if (orderData.orderData.progress === 'in_stock') {
                                          orderData.orderData.progress = 'wait';
                                        }

                                        saveEvent();
                                      }
                                      gvc.notifyDataChange('Edit');
                                    },
                                  });
                                } else {
                                  next();
                                }
                              },
                              readonly: orderData.orderData.user_info.shipment_refer === 'paynow' || is_archive,
                            })}
                          </div>`,
                        html` <div class="tx_700">配送方式</div>
                          ${BgWidget.mbContainer(12)}
                          <div class="d-flex w-100 align-items-center gap-2">
                            <div style="tx_normal">
                              ${Language.getLanguageCustomText(
                                ((orderData.orderData.shipment_selector || OrderModule.supportShipmentMethod()).find(
                                  (dd: any) => {
                                    return dd.value === orderData.orderData.user_info.shipment;
                                  }
                                ) || { name: '門市取貨' })!.name
                              )}
                            </div>
                            ${BgWidget.customButton({
                              button: {
                                color: 'gray',
                                size: 'sm',
                              },
                              text: {
                                name: '列印出貨明細',
                              },
                              event: gvc.event(() => {
                                DeliveryHTML.print(gvc, [orderData as any], 'shipment');
                              }),
                            })}
                          </div>`,
                        html`
                          <div class="tx_700 d-flex align-items-center" style="gap:5px;">出貨單號碼</div>
                          ${is_shipment ? '' : BgWidget.grayNote('取號後將自動生成出貨單，於出貨單列表單中。')}
                          ${BgWidget.mbContainer(12)}
                          <div class="d-flex align-items-center" style="gap:10px;">
                            ${orderData.orderData.user_info.shipment_number || '尚未取號'}
                            ${ShipmentConfig.supportPrintList.includes(orderData.orderData.user_info.shipment) &&
                            !(
                              orderData.orderData.user_info.shipment_number &&
                              orderData.orderData.user_info.shipment_refer !== 'paynow'
                            )
                              ? BgWidget.customButton({
                                  button: {
                                    color: 'gray',
                                    size: 'sm',
                                  },
                                  text: {
                                    name: orderData.orderData.user_info.shipment_number ? '列印出貨單' : '出貨單取號',
                                  },
                                  event: gvc.event(() => {
                                    return OrderModule.printStoreOrderInfo({
                                      gvc,
                                      cart_token: orderData.cart_token,
                                      print: !!orderData.orderData.user_info.shipment_number,
                                    });
                                  }),
                                })
                              : ''}
                            ${BgWidget.customButton({
                              button: {
                                color: 'gray',
                                size: 'sm',
                              },
                              text: {
                                name:
                                  orderData.orderData.user_info.shipment_number &&
                                  orderData.orderData.user_info.shipment_refer === 'paynow'
                                    ? '取消配號'
                                    : '手動輸入',
                              },
                              event: gvc.event(() => {
                                if (
                                  orderData.orderData.user_info.shipment_number &&
                                  orderData.orderData.user_info.shipment_refer === 'paynow'
                                ) {
                                  dialog.checkYesOrNot({
                                    text: '是否確認取消配號?',
                                    callback: response => {
                                      if (response) {
                                        dialog.dataLoading({ visible: true });
                                        ApiDelivery.cancelOrder({
                                          cart_token: orderData.cart_token,
                                          logistic_number: orderData.orderData.user_info.shipment_number as any,
                                          total_amount: orderData.orderData.total as any,
                                        }).then(res => {
                                          dialog.dataLoading({ visible: false });
                                          if (res.result && res.response.data.includes('F,')) {
                                            dialog.errorMessage({
                                              text: res.response.data.replace('F,', ''),
                                            });
                                          } else {
                                            dialog.successMessage({ text: '已成功取消配號' });
                                          }
                                          gvc.notifyDataChange('orderDetailRefresh');
                                        });
                                      }
                                    },
                                  });
                                } else {
                                  let shipnumber = orderData.orderData.user_info.shipment_number ?? '';
                                  BgWidget.settingDialog({
                                    gvc: gvc,
                                    title: '手動出貨',
                                    innerHTML: (gvc: GVC) => {
                                      return [
                                        BgWidget.editeInput({
                                          gvc: gvc,
                                          title: '出貨單號碼',
                                          default: `${shipnumber ?? ''}`,
                                          callback: text => {
                                            shipnumber = text;
                                          },
                                          placeHolder: '請輸入托運單號碼',
                                        }),
                                      ].join('');
                                    },
                                    footer_html: (gvc: GVC) => {
                                      return [
                                        BgWidget.cancel(
                                          gvc.event(() => {
                                            gvc.closeDialog();
                                          }),
                                          '取消'
                                        ),
                                        BgWidget.save(
                                          gvc.event(() => {
                                            orderData.orderData.user_info.shipment_number = shipnumber;
                                            gvc.closeDialog();
                                            saveEvent();
                                          }),
                                          '儲存'
                                        ),
                                      ].join('');
                                    },
                                    width: 350,
                                  });
                                }
                              }),
                            })}
                          </div>
                          ${(() => {
                            try {
                              if (
                                ShipmentConfig.supportPrintList.includes(orderData.orderData.user_info.shipment) &&
                                orderData.orderData.user_info.shipment_number &&
                                orderData.orderData.user_info.shipment_refer === 'paynow'
                              ) {
                                return html`
                                  ${BgWidget.mbContainer(12)}
                                  <div class="tx_700 d-flex align-items-end" style="gap:5px;">物流追蹤</div>
                                  ${BgWidget.mbContainer(12)}
                                  ${[
                                    `狀態: ${orderData.orderData.user_info.shipment_detail.Detail_Status_Description ?? '追蹤異常'}`,
                                    `追蹤碼: ${orderData.orderData.user_info.shipment_detail.paymentno ?? '尚未生成'}`,
                                  ].join(`<div class="w-100  my-1"></div>`)}
                                `;
                              }
                              return '';
                            } catch (e) {
                              console.error(e);
                              return `${e}`;
                            }
                          })()}
                        `,
                        orderData.orderData.user_info.shipment_number
                          ? html`
                              <div class="tx_700 d-flex align-items-center" style="gap:5px;">出貨日期</div>
                              ${BgWidget.mbContainer(12)}
                              <div class="d-flex" style="gap:5px;">
                                ${orderData.orderData.user_info.shipment_date
                                  ? gvc.glitter.ut.dateFormat(
                                      new Date(orderData.orderData.user_info.shipment_date),
                                      'yyyy-MM-dd hh:mm'
                                    )
                                  : '尚未設定'}
                                ${BgWidget.customButton({
                                  button: {
                                    color: 'gray',
                                    size: 'sm',
                                  },
                                  text: {
                                    name: '設定出貨日期',
                                  },
                                  event: gvc.event(() => {
                                    let shipment_date = orderData.orderData.user_info.shipment_date
                                      ? gvc.glitter.ut.dateFormat(
                                          new Date(orderData.orderData.user_info.shipment_date),
                                          'yyyy-MM-dd'
                                        )
                                      : gvc.glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd');
                                    let shipment_time = orderData.orderData.user_info.shipment_date
                                      ? gvc.glitter.ut.dateFormat(
                                          new Date(orderData.orderData.user_info.shipment_date),
                                          'hh:mm'
                                        )
                                      : gvc.glitter.ut.dateFormat(new Date(), 'hh:mm');
                                    BgWidget.settingDialog({
                                      gvc: gvc,
                                      title: '設定出貨日期',
                                      innerHTML: (gvc: GVC) => {
                                        return [
                                          BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '出貨日期',
                                            default: shipment_date,
                                            callback: text => {
                                              shipment_date = text;
                                            },
                                            type: 'date',
                                            placeHolder: '請輸入出貨日期',
                                          }),
                                          BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '出貨時間',
                                            default: shipment_time,
                                            callback: text => {
                                              shipment_time = text;
                                            },
                                            type: 'time',
                                            placeHolder: '請輸入出貨時間',
                                          }),
                                        ].join('');
                                      },
                                      footer_html: (gvc: GVC) => {
                                        return [
                                          BgWidget.cancel(
                                            gvc.event(() => {
                                              gvc.closeDialog();
                                            }),
                                            '取消'
                                          ),
                                          BgWidget.save(
                                            gvc.event(() => {
                                              orderData.orderData.user_info.shipment_date = new Date(
                                                `${shipment_date} ${shipment_time}:00`
                                              ).toISOString();
                                              gvc.closeDialog();
                                              saveEvent();
                                            }),
                                            '儲存'
                                          ),
                                        ].join('');
                                      },
                                      width: 350,
                                    });
                                  }),
                                })}
                              </div>
                            `
                          : '',
                        html`${[
                            'UNIMARTC2C',
                            'FAMIC2C',
                            'OKMARTC2C',
                            'HILIFEC2C',
                            'UNIMARTFREEZE',
                            'FAMIC2CFREEZE',
                            'normal',
                            'black_cat',
                            'black_cat_freezing',
                          ].includes(orderData.orderData.user_info.shipment)
                            ? html` <div class="tx_700 d-flex align-items-end" style="gap:5px;">
                                  配送資訊
                                  <div
                                    style="cursor:pointer;color:#4D86DB;font-size: 14px;"
                                    class="${ShipmentConfig.supermarketList.includes(
                                      orderData.orderData.user_info.shipment
                                    )
                                      ? ''
                                      : 'd-none'} fw-500"
                                    onclick="${gvc.event(() => {
                                      if (orderData.orderData.user_info.shipment_number) {
                                        dialog.errorMessage({ text: '請先取消配號' });
                                        return;
                                      }
                                      const url = new URL((window.parent as any).location.href);
                                      url.searchParams.set('orderID', orderData.cart_token);
                                      ApiDelivery.storeMaps({
                                        returnURL: url.href,
                                        logistics: orderData.orderData.user_info.shipment,
                                      }).then(async res => {
                                        let newDiv = document.createElement('div');
                                        newDiv.innerHTML = res.response.form;
                                        (window.parent as any).document.body.appendChild(newDiv);
                                        ((window.parent as any).document.querySelector('#submit') as any).click();
                                      });
                                    })}"
                                  >
                                    更換門市
                                  </div>
                                </div>
                                ${BgWidget.mbContainer(12)}`
                            : ''}
                          <div class="d-flex flex-column tx_normal" style="gap: 4px;">
                            ${(() => {
                              if (
                                ['normal', 'black_cat', 'global_express', 'black_cat_freezing'].includes(
                                  orderData.orderData.user_info.shipment
                                )
                              ) {
                                let map: any = [];
                                if (
                                  CountryTw.find(dd => {
                                    return dd.countryCode === (orderData.orderData.user_info as any).country;
                                  })?.countryName
                                ) {
                                  map.push(
                                    `國家 : ${
                                      CountryTw.find(dd => {
                                        return dd.countryCode === (orderData.orderData.user_info as any).country;
                                      })?.countryName
                                    }`
                                  );
                                }
                                if ((orderData.orderData.user_info as any).city) {
                                  map.push(`城市 : ${(orderData.orderData.user_info as any).city}`);
                                }
                                if ((orderData.orderData.user_info as any).state) {
                                  map.push(`州/省 : ${(orderData.orderData.user_info as any).state}`);
                                }
                                if ((orderData.orderData.user_info as any).postal_code) {
                                  map.push(`郵遞區號 : ${(orderData.orderData.user_info as any).postal_code}`);
                                }
                                if ((orderData.orderData.user_info as any).address) {
                                  map.push(`地址 : ${(orderData.orderData.user_info as any).address}`);
                                }
                                return map.join('<div class="w-100 border-top my-1"></div>');
                              }
                              const formData: any = (
                                orderData.orderData.shipment_selector || OrderModule.supportShipmentMethod()
                              ).find(dd => {
                                return dd.value === orderData.orderData.user_info.shipment;
                              });
                              if (
                                [
                                  'UNIMARTC2C',
                                  'FAMIC2C',
                                  'OKMARTC2C',
                                  'HILIFEC2C',
                                  'UNIMARTFREEZE',
                                  'FAMIC2CFREEZE',
                                ].includes(orderData.orderData.user_info.shipment)
                              ) {
                                return html`
                                  <div class="d-flex flex-wrap">
                                    <span class="me-2">門市名稱:</span>
                                    <div style="white-space: normal;word-break: break-all;">
                                      ${orderData.orderData.user_info.CVSStoreName}
                                    </div>
                                  </div>
                                  <div class="d-flex">門市店號: ${orderData.orderData.user_info.CVSStoreID}</div>
                                  <div class="d-flex" style="white-space: normal;word-break: break-all;">
                                    地址: ${orderData.orderData.user_info.CVSAddress}
                                  </div>
                                `;
                              } else if (formData.form) {
                                return formData.form
                                  .map((dd: any) => {
                                    return html` <div class="d-flex flex-wrap">
                                      <span class="me-2">${Language.getLanguageCustomText(dd.title)} :</span>
                                      <div style="white-space: normal;word-break: break-all;">
                                        ${Language.getLanguageCustomText(
                                          orderData.orderData.user_info.custom_form_delivery[dd.key]
                                        )}
                                      </div>
                                    </div>`;
                                  })
                                  .join('');
                              }
                              return '';
                            })()}
                          </div>`,
                        html`
                          <div class="d-flex w-100 align-items-center gap-2">
                            <div class="tx_700">收件人資訊</div>
                            ${vm.mode === 'edit'
                              ? BgWidget.customButton({
                                  button: {
                                    color: 'black',
                                    size: 'sm',
                                  },
                                  text: {
                                    name: '確認',
                                  },
                                  event: gvc.event(() => {
                                    gvc.notifyDataChange('user_info');
                                    vm.mode = 'read';
                                  }),
                                })
                              : BgWidget.customButton({
                                  button: {
                                    color: 'gray',
                                    size: 'sm',
                                  },
                                  text: {
                                    name: '編輯',
                                  },
                                  event: gvc.event(() => {
                                    vm.mode = 'edit';
                                  }),
                                })}
                          </div>
                          ${BgWidget.mbContainer(8)}
                          ${gvc.bindView(() => {
                            return {
                              bind: gvc.glitter.getUUID(),
                              view: async () => {
                                const noNeedAddress = [
                                  'now',
                                  'shop',
                                  'UNIMARTC2C',
                                  'FAMIC2C',
                                  'HILIFEC2C',
                                  'OKMARTC2C',
                                  'UNIMARTFREEZE',
                                  'FAMIC2CFREEZE',
                                ].includes(orderData.orderData.user_info.shipment);

                                const viewModel = [
                                  ['姓名', 'name'],
                                  ['電話', 'phone'],
                                  ['信箱', 'email'],
                                  ['縣市', 'city'],
                                  ['鄉鎮', 'area'],
                                  ['地址', 'address'],
                                ].filter(item => {
                                  return !noNeedAddress || !['city', 'area', 'address'].includes(item[1]);
                                });

                                const receipt = (
                                  await ApiUser.getPublicConfig('custom_form_checkout_recipient', 'manager')
                                ).response.value;

                                receipt.list.map((d1: any) => {
                                  if (!viewModel.find(dd => dd[1] === d1.key)) {
                                    viewModel.push([d1.title, d1.key]);
                                  }
                                });

                                return viewModel
                                  .map(item => {
                                    return vm.mode == 'read'
                                      ? html` <div>
                                            ${item[0]} : ${(orderData.orderData.user_info as any)[item[1]] || '未填寫'}
                                          </div>
                                          ${BgWidget.mbContainer(4)}`
                                      : html`
                                          <div class="d-flex flex-column w-100" style="gap: 8px;">
                                            <div style="${item[0] == '姓名' ? '' : 'margin-top: 12px;'}">
                                              ${item[0]}
                                            </div>
                                            <input
                                              style="display: flex;padding: 9px 18px;align-items: flex-start;gap: 10px;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                                              value="${(orderData.orderData.user_info as any)[item[1]]}"
                                              onchange="${gvc.event(e => {
                                                (orderData.orderData.user_info as any)[item[1]] = e.value;
                                              })}"
                                            />
                                          </div>
                                        `;
                                  })
                                  .join('');
                              },
                              divCreate: {
                                class: 'tx_normal',
                              },
                            };
                          })}
                        `,
                        (() => {
                          if (
                            orderData.orderData.custom_receipt_form &&
                            orderData.orderData.custom_receipt_form.filter((dd: any) => {
                              return (orderData.orderData.user_info as any)[dd.key];
                            }).length > 0
                          ) {
                            return html` <div class="tx_700">自訂配送資訊表單</div>
                              ${BgWidget.mbContainer(8)}
                              <div class="tx_normal" style="color: #393939;font-size: 16px;">
                                ${orderData.orderData.custom_receipt_form
                                  .filter((dd: any) => {
                                    return (orderData.orderData.user_info as any)[dd.key];
                                  })
                                  .map((dd: any) => {
                                    return html` <div>
                                      ${Language.getLanguageCustomText(dd.title)} :
                                      ${(orderData.orderData.user_info as any)[dd.key]}
                                    </div>`;
                                  })
                                  .join('')}
                              </div>`;
                          } else {
                            return '';
                          }
                        })(),
                        (() => {
                          if (
                            orderData.orderData.custom_form_format &&
                            orderData.orderData.custom_form_format.filter((dd: any) => {
                              return (orderData.orderData.custom_form_data as any)[dd.key];
                            }).length > 0
                          ) {
                            return html` <div class="tx_700">自訂顧客資料表單</div>
                              ${BgWidget.mbContainer(8)}
                              <div class="tx_normal" style="color: #393939;font-size: 16px;">
                                ${orderData.orderData.custom_form_format
                                  .filter((dd: any) => {
                                    return (orderData.orderData.custom_form_data as any)[dd.key];
                                  })
                                  .map((dd: any) => {
                                    return html`
                                      <div>
                                        ${Language.getLanguageCustomText(dd.title)} :
                                        ${(orderData.orderData.custom_form_data as any)[dd.key]}
                                      </div>
                                    `;
                                  })
                                  .join('')}
                              </div>`;
                          } else {
                            return '';
                          }
                        })(),
                        (() => {
                          let map = [];

                          if ((orderData.orderData.user_info as any).invoice_method) {
                            map.push(html` <div class="tx_700">發票開立資訊</div>`);
                            map.push(
                              `開立時機: ${(() => {
                                switch ((orderData.orderData.user_info as any).invoice_method) {
                                  case 'nouse':
                                    return '不開立發票';
                                  case 'off_line':
                                    return '線下自行開立';
                                  default:
                                    return `付款時開立`;
                                }
                              })()}`
                            );
                          }

                          if (
                            (orderData.orderData.user_info as any).invoice_method &&
                            (orderData.orderData.user_info as any).invoice_method !== 'nouse'
                          ) {
                            map.push(
                              `開立對象: ${(() => {
                                switch ((orderData.orderData.user_info as any).invoice_type) {
                                  case 'donate':
                                    return '捐贈';
                                  case 'company':
                                    return '公司';
                                  default:
                                    return '個人';
                                }
                              })()}`
                            );
                            map.push(
                              `${(() => {
                                switch ((orderData.orderData.user_info as any).invoice_type) {
                                  case 'donate':
                                    return '發票捐贈單位: ' + (orderData.orderData.user_info as any).love_code;
                                  case 'company':
                                    return [
                                      `公司抬頭: ${(orderData.orderData.user_info as any).company}`,
                                      `統編號碼: ${(orderData.orderData.user_info as any).gui_number}`,
                                      `發票寄送信箱: ${(orderData.orderData.user_info as any).email || '未填寫'}`,
                                    ]
                                      .map(dd => {
                                        return html` <div>${dd}</div>`;
                                      })
                                      .join(BgWidget.mbContainer(8));
                                  default:
                                    return [`發票寄送信箱: ${(orderData.orderData.user_info as any).email || '未填寫'}`]
                                      .map(dd => {
                                        return html` <div>${dd}</div>`;
                                      })
                                      .join(BgWidget.mbContainer(8));
                                }
                              })()}`
                            );
                          }

                          return map
                            .map(dd => {
                              return html` <div>${dd}</div>`;
                            })
                            .join(BgWidget.mbContainer(8));
                        })(),
                      ]
                        .filter(Boolean)
                        .join(BgWidget.mbContainer(18));
                    },
                    divCreate: { class: 'd-flex flex-column' },
                    onCreate: () => {
                      if (loading) {
                        ApiPageConfig.getPrivateConfig((window.parent as any).appName, 'glitter_delivery').then(res => {
                          loading = false;
                          gvc.notifyDataChange('Edit');
                        });
                      }
                    },
                  });
                })()
              );

              return BgWidget.container(
                html` <div class="title-container">
                    ${BgWidget.goBack(
                      gvc.event(() => {
                        if (!is_shipment && (window as any).glitter.getUrlParameter('page') === 'shipment_list') {
                          is_shipment = true;
                          gvc.notifyDataChange('orderDetailRefresh');
                          return;
                        }
                        (window.parent as any).glitter.setUrlParameter('orderID', undefined);

                        if (backCallback) {
                          backCallback();
                        } else {
                          vm.type = 'list';
                        }
                      })
                    )}
                    <div class="d-flex flex-column">
                      <div class="align-items-center" style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;">
                        #${is_shipment ? orderData.orderData.user_info.shipment_number : orderData.cart_token}
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        ${BgWidget.grayNote(`訂單成立時間 : ${Tool.formatDateTime(orderData.created_time)}`)}
                        ${document.body.clientWidth > 768 ? getBadgeList() : ''}
                      </div>
                    </div>
                    <div class="flex-fill"></div>
                    <div
                      class="${orderData.orderData.orderSource === 'split' ? 'd-none' : 'd-flex'} justify-content-end"
                    >
                      ${funBTN().splitOrder()}
                    </div>
                  </div>
                  ${document.body.clientWidth > 768
                    ? BgWidget.mbContainer(18)
                    : html` <div class="mt-1 mb-3 mx-1">${getBadgeList()}</div>`}
                  ${BgWidget.container1x2(
                    {
                      html: [
                        !is_shipment ? '' : shipment_card,
                        BgWidget.mainCard(html`
                          <div
                            style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                          >
                            <div class="tx_700">訂單狀態</div>
                            <div class="ms-auto w-100">
                              ${is_shipment
                                ? [
                                    {
                                      title: '變更訂單狀態',
                                      value: '',
                                    },
                                  ]
                                    .concat(ApiShop.getOrderStatusArray())
                                    .find(dd => {
                                      return dd.value == (orderData.orderData.orderStatus ?? '0');
                                    })?.title
                                : BgWidget.select({
                                    title: '',
                                    gvc: gvc,
                                    default: orderData.orderData.orderStatus ?? '0',
                                    options: [
                                      {
                                        title: '變更訂單狀態',
                                        value: '',
                                      },
                                    ]
                                      .concat(ApiShop.getOrderStatusArray())
                                      .map(item => {
                                        return {
                                          key: item.value,
                                          value: item.title,
                                        };
                                      }),
                                    callback: text => {
                                      orderData.orderData.orderStatus = orderData.orderData.orderStatus || '0';
                                      if (text && text !== orderData.orderData.orderStatus) {
                                        orderData.orderData.orderStatus = text;
                                      }
                                    },
                                    readonly: is_shipment || is_archive,
                                  })}
                            </div>
                          </div>
                          <div class="d-flex align-items-center justify-content-between mt-3 mb-2">
                            <div class="tx_700">訂單明細</div>
                            ${BgWidget.customButton({
                              button: {
                                color: 'gray',
                                size: 'sm',
                              },
                              text: {
                                name: '編輯明細',
                              },
                              event: gvc.event(() => {
                                OrderModule.editOrderLineItems(gvc, structuredClone(orderData), () => {
                                  gvc.notifyDataChange(vm.id);
                                });
                              }),
                            })}
                          </div>
                          ${BgWidget.horizontalLine()}
                          <div class="d-flex flex-column">
                            ${orderData.orderData.lineItems
                              .map((dd: any) => {
                                return gvc.bindView({
                                  bind: gvc.glitter.getUUID(),
                                  view: () => {
                                    function showTag(color: string, text: string) {
                                      return html`
                                        <div class="product-show-tag" style="background:${color};">${text}</div>
                                      `;
                                    }

                                    return html` <div
                                        class="d-flex flex-column align-items-center justify-content-center"
                                        style="gap:5px;margin-right:12px;"
                                      >
                                        ${BgWidget.validImageBox({
                                          gvc,
                                          image: dd.preview_image,
                                          width: 60,
                                          class: 'border rounded',
                                          style: '',
                                        })}
                                      </div>
                                      <div class="d-flex flex-column">
                                        ${dd.is_hidden
                                          ? html` <div style="width:auto;">
                                              ${BgWidget.secondaryInsignia('隱形商品')}
                                            </div>`
                                          : ''}
                                        <div class="tx_700 d-flex align-items-center" style="gap:4px;">
                                          <div>${dd.title}</div>
                                          ${dd.is_gift ? html` <div>${showTag('#FFE9B2', '贈品')}</div>` : ''}
                                          ${dd.is_add_on_items ? html` <div>${showTag('#D8E7EC', '加購品')}</div>` : ''}
                                          ${dd.pre_order ? html` <div>${showTag('#D8E7EC', '預購')}</div>` : ''}
                                        </div>
                                        ${dd.spec.length > 0 ? BgWidget.grayNote(dd.spec.join(', ')) : ''}
                                        ${BgWidget.grayNote(
                                          `存貨單位 (SKU)：${dd.sku && dd.sku.length > 0 ? dd.sku : '無'}`
                                        )}
                                      </div>
                                      <div class="flex-fill"></div>
                                      <div
                                        class="tx_normal_16 d-none d-lg-flex justify-content-end"
                                        style="min-width: 80px;"
                                      >
                                        ${dd.origin_price && dd.origin_price > dd.sale_price
                                          ? html` <div style="margin-right: 8px; text-decoration: line-through;">
                                              $${dd.origin_price.toLocaleString()}
                                            </div>`
                                          : ''}
                                        <div>$${dd.sale_price.toLocaleString()} × ${dd.count}</div>
                                      </div>
                                      <div
                                        class="tx_normal d-sm-none d-flex flex-column align-items-end justify-content-end"
                                        style="min-width: 110px"
                                      >
                                        ${dd.origin_price && dd.origin_price > dd.sale_price
                                          ? html` <div style="margin-right: 6px; text-decoration: line-through;">
                                              $${dd.origin_price.toLocaleString()}
                                            </div>`
                                          : ''}
                                        <div>$${dd.sale_price.toLocaleString()} × ${dd.count}</div>
                                      </div>
                                      <div
                                        class="tx_normal d-none d-sm-flex"
                                        style="display: flex;justify-content: end;${document.body.clientWidth > 800
                                          ? 'width: 110px'
                                          : ''}"
                                      >
                                        $${(dd.sale_price * dd.count).toLocaleString()}
                                      </div>`;
                                  },
                                  divCreate: { class: `d-flex align-items-center gap-1` },
                                });
                              })
                              .join(html` <div style="margin-top: 12px;"></div>`)}
                            ${BgWidget.horizontalLine()}
                            ${[
                              {
                                title: '小計',
                                description: `${orderData.orderData.lineItems
                                  .map(dd => dd.count)
                                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} 件商品`,
                                total: `$${(
                                  orderData.orderData.total +
                                  orderData.orderData.discount -
                                  orderData.orderData.shipment_fee +
                                  orderData.orderData.use_rebate
                                ).toLocaleString()}`,
                              },
                              {
                                title: '運費',
                                description: '',
                                total: `$${orderData.orderData.shipment_fee.toLocaleString()}`,
                              },
                              ...(() => {
                                if (orderData.orderData.use_rebate) {
                                  return [
                                    {
                                      title: '回饋金',
                                      description: '',
                                      total: `- $${orderData.orderData.use_rebate.toLocaleString()}`,
                                    },
                                  ];
                                } else {
                                  return [];
                                }
                              })(),
                              ...(() => {
                                if (orderData.orderData.use_wallet && `${orderData.orderData.use_wallet}` !== '0') {
                                  return [
                                    {
                                      title: '錢包',
                                      description: `使用錢包扣款`,
                                      total: `- $${orderData.orderData.use_wallet.toLocaleString()}`,
                                    },
                                  ];
                                } else {
                                  return [];
                                }
                              })(),
                              ...(orderData.orderData.voucherList || []).map((dd: any) => {
                                const descHTML = dd.title
                                  ? html` <div
                                      style="color: #8D8D8D; font-size: 14px; white-space: nowrap; text-overflow: ellipsis;"
                                    >
                                      ${dd.title}
                                    </div>`
                                  : '';
                                const rebackMaps: Record<
                                  string,
                                  {
                                    title: string;
                                    description: string;
                                    total: string;
                                  }
                                > = {
                                  add_on_items: {
                                    title: '加購優惠',
                                    description: descHTML,
                                    total: '－',
                                  },
                                  giveaway: {
                                    title: '滿額贈送',
                                    description: descHTML,
                                    total: '－',
                                  },
                                  rebate: {
                                    title: '回饋購物金',
                                    description: descHTML,
                                    total: `${dd.rebate_total} 點`,
                                  },
                                  default: {
                                    title: dd.id == 0 ? '手動調整' : '折扣',
                                    description: descHTML,
                                    total: (() => {
                                      if (orderData.orderData.orderSource === 'split') {
                                        return `- $${orderData.orderData.discount.toLocaleString()}`;
                                      }

                                      const status = dd.discount_total > 0;
                                      const isMinus = status ? '-' : '';
                                      const isNegative = status ? 1 : -1;
                                      return `${isMinus} $${(Math.floor(dd.discount_total) * isNegative).toLocaleString()}`;
                                    })(),
                                  },
                                };

                                return rebackMaps[dd.reBackType] ?? rebackMaps.default;
                              }),
                              {
                                title: html`<span class="tx_700">總金額</span>`,
                                description: '',
                                total: html`<span class="tx_700">$${orderData.orderData.total.toLocaleString()}</span>`,
                              },
                            ]
                              .map(dd => {
                                return html` <div class="d-flex align-items-center justify-content-end">
                                  <div class="tx_normal_16 " style="text-align: end;">
                                    ${dd.title} ${dd.description ?? ''}
                                  </div>
                                  <div class="tx_normal" style="width: 114px;display: flex;justify-content: end;">
                                    ${dd.total}
                                  </div>
                                </div>`;
                              })
                              .join(BgWidget.mbContainer(18))}
                            ${`${orderData.orderData.orderStatus ?? 0}` === '0'
                              ? html` <div class="d-flex justify-content-end mt-3">
                                  ${BgWidget.blueNote(
                                    '手動調整訂單價格',
                                    gvc.event(() => {
                                      const cloneData = orderData.orderData;
                                      PosFunction.manualDiscount({
                                        gvc,
                                        orderDetail: cloneData,
                                        reload: voucher => {
                                          cloneData.total -= voucher.discount_total;
                                          cloneData.discount += voucher.discount_total;
                                          dialog.dataLoading({ visible: true });
                                          ApiShop.putOrder({
                                            id: `${orderData.id}`,
                                            order_data: cloneData,
                                          }).then(() => {
                                            dialog.dataLoading({ visible: false });
                                            gvc.notifyDataChange(vm.id);
                                          });
                                        },
                                      });
                                    })
                                  )}
                                </div>`
                              : ''}
                          </div>
                        `),
                        orderData.orderData.lineItems.find((dd: any) => dd.deduction_log)
                          ? BgWidget.mainCard(html`
                              <div
                                style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                              >
                                <div class="w-100 d-flex tx_700 align-items-center justify-content-between">
                                  <div>分倉出貨</div>
                                  <div
                                    class="${is_shipment ? 'd-none' : ''}"
                                    style="display: flex;padding: 4px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                                    onclick="${gvc.event(() => {
                                      OrderSetting.showEditShip({
                                        gvc: gvc,
                                        postMD: orderData.orderData.lineItems,
                                        productData: productData,
                                        callback: () => {
                                          gvc.notifyDataChange('storehouseList');
                                        },
                                      });
                                    })}"
                                  >
                                    編輯
                                  </div>
                                </div>
                                ${gvc.bindView({
                                  bind: 'storehouseList',
                                  view: () => {
                                    try {
                                      if (storeLoading) {
                                        ApiUser.getPublicConfig('store_manager', 'manager').then((dd: any) => {
                                          if (dd.result && dd.response.value) {
                                            storeList = dd.response.value.list;
                                            storeLoading = false;
                                            gvc.notifyDataChange('storehouseList');
                                          }
                                        });
                                        return '讀取中...';
                                      } else if (storeList.length == 0) {
                                        return '倉儲資訊錯誤';
                                      } else {
                                        return storeList
                                          .map((store: any) => {
                                            let returnHtml = '';
                                            orderData.orderData.lineItems.map((item: any) => {
                                              try {
                                                if (item.deduction_log[store.id]) {
                                                  returnHtml += html`
                                                    <div
                                                      class="d-flex justify-content-between"
                                                      style="font-size: 16px;font-weight: 400;"
                                                    >
                                                      <div>${item.title} - ${item.spec.join(',')}</div>
                                                      <div>${item.deduction_log[store.id]}</div>
                                                    </div>
                                                  `;
                                                }
                                              } catch (e) {
                                                return '';
                                              }
                                            });
                                            if (!returnHtml) {
                                              return '';
                                            }
                                            return html`
                                              <div
                                                class="d-flex flex-column w-100"
                                                style="gap:8px;padding: 18px;border-radius: 10px;border: 1px solid #DDD;"
                                              >
                                                <div class="d-flex w-100 align-items-center" style="gap:8px;">
                                                  出貨地點
                                                  <div
                                                    style="font-size: 14px;color:#333;border-radius: 7px;background: rgba(221, 221, 221, 0.87);padding: 4px 6px;"
                                                  >
                                                    ${store.name}
                                                  </div>
                                                </div>
                                                <div class="w-100" style="background-color: #DDD;height: 1px;"></div>
                                                <div class="d-flex flex-column">${returnHtml}</div>
                                              </div>
                                            `;
                                          })
                                          .join('');
                                      }
                                    } catch (e) {
                                      console.error(e);
                                      return `storehouseList error: ${e}`;
                                    }
                                  },
                                  divCreate: {
                                    class: 'w-100 d-flex flex-column',
                                    style: 'gap: 18px;',
                                  },
                                })}
                              </div>
                            `)
                          : '',
                        is_shipment
                          ? ''
                          : BgWidget.mainCard(
                              [
                                html` <div
                                  style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                >
                                  <div class="tx_700">付款狀態</div>
                                  <div class="ms-auto w-100">
                                    ${is_shipment || is_archive
                                      ? [
                                          {
                                            title: '變更付款狀態',
                                            value: '',
                                          },
                                        ]
                                          .concat(ApiShop.getStatusArray(orderData.orderData.proof_purchase))
                                          .find(dd => {
                                            return dd.value === `${orderData.status}`;
                                          })?.title
                                      : BgWidget.select({
                                          title: '',
                                          gvc: gvc,
                                          default: `${orderData.status}`,
                                          options: (() => {
                                            const paymentOptions = OrderSetting.getPaymentStatusOpt();
                                            const unpayOption = paymentOptions.find(item => item.key === '0');

                                            if (unpayOption) {
                                              if (orderData.orderData.proof_purchase) {
                                                unpayOption.value = '待核款';
                                              } else if (
                                                orderData.orderData.customer_info.payment_select == 'cash_on_delivery'
                                              ) {
                                                unpayOption.value = '貨到付款';
                                              } else {
                                                unpayOption.value = '未付款';
                                              }
                                            }

                                            return paymentOptions;
                                          })(),
                                          callback: text => {
                                            dialog.checkYesOrNot({
                                              text: '是否確認變更付款狀態?',
                                              callback: response => {
                                                if (response) {
                                                  if (text && text !== `${orderData.status}`) {
                                                    orderData.status = parseInt(text, 10);
                                                    saveEvent();
                                                  }
                                                } else {
                                                  gvc.notifyDataChange(mainViewId);
                                                }
                                              },
                                            });
                                          },
                                        })}
                                  </div>
                                </div>`,
                                html` <div
                                  style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                >
                                  <div class="tx_700">付款方式</div>
                                  <div class="tx_normal">
                                    ${OrderModule.getPaymentMethodText(gvc, orderData.orderData)}
                                  </div>
                                  ${OrderModule.getProofPurchaseString(gvc, orderData.orderData)}
                                </div>`,
                                (() => {
                                  if (orderData.orderData.customer_info.payment_select === 'ecPay') {
                                    const cash_flow = orderData.orderData.cash_flow || {};
                                    return html` <div
                                      style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                    >
                                      <div class="tx_700">金流對帳</div>
                                      <div>
                                        ${(cash_flow.TradeStatus === '1'
                                          ? [
                                              html` <div class="d-flex align-items-center">
                                                金流交易結果:
                                                ${(cash_flow.credit_receipt && cash_flow.credit_receipt.status) ||
                                                '已付款'}
                                                <button
                                                  class="btn btn-gray rounded-2 ms-2 ${cash_flow.PaymentType.toLowerCase().includes(
                                                    'credit'
                                                  ) &&
                                                  cash_flow.credit_receipt &&
                                                  cash_flow.credit_receipt.status === '已授權'
                                                    ? ''
                                                    : 'd-none'}"
                                                  type="button"
                                                  style="height:22px;"
                                                  onclick="${gvc.event(() => {
                                                    const doalog = new ShareDialog(gvc.glitter);
                                                    doalog.checkYesOrNot({
                                                      text: '是否確認退刷交易?',
                                                      callback: response => {
                                                        if (response) {
                                                          doalog.dataLoading({ visible: true });
                                                          ApiShop.ecPayBrushOrders({
                                                            tradNo: cash_flow.TradeNo,
                                                            orderID: orderData.cart_token,
                                                            total: cash_flow.TradeAmt,
                                                          }).then(res => {
                                                            doalog.dataLoading({ visible: false });
                                                            orderData.status = -2;
                                                            saveEvent();
                                                          });
                                                        }
                                                      },
                                                    });
                                                  })}"
                                                >
                                                  <span class=" tx_700" style="font-size:13px;">退刷</span>
                                                </button>
                                              </div>`,
                                              html`金流交易方式:
                                              ${[
                                                {
                                                  title: 'WebATM',
                                                  key: 'WebATM',
                                                },
                                                {
                                                  title: 'ATM',
                                                  key: 'ATM',
                                                },
                                                {
                                                  title: '超商代碼',
                                                  key: 'CVS',
                                                },
                                                {
                                                  title: '超商條碼',
                                                  key: 'BARCODE',
                                                },
                                                {
                                                  title: '信用卡',
                                                  key: 'Credit',
                                                },
                                                {
                                                  title: '未知付款方式',
                                                  key: '',
                                                },
                                              ].find(dd => {
                                                return cash_flow.PaymentType.toLowerCase().includes(
                                                  dd.key.toLowerCase()
                                                );
                                              })?.title}`,
                                              `交易手續費: ${cash_flow.HandlingCharge}`,
                                              `交易總金額: ${cash_flow.TradeAmt}`,
                                              `交易時間: ${cash_flow.PaymentDate}`,
                                            ]
                                          : [`金流交易結果: 未付款`]
                                        ).join(`<div class="my-2"></div>`)}
                                      </div>
                                    </div>`;
                                  } else if (orderData.orderData.customer_info.payment_select === 'paynow') {
                                    const cash_flow = orderData.orderData.cash_flow || {};
                                    return html`
                                      <div
                                        style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                      >
                                        <div class="tx_700">金流對帳</div>
                                        <div>
                                          ${(cash_flow.status === 'success'
                                            ? [
                                                html` <div class="d-flex align-items-center">
                                                  金流交易結果: 已付款
                                                </div>`,
                                                html`金流交易方式:
                                                ${[
                                                  {
                                                    title: 'ATM',
                                                    key: 'ATM',
                                                  },
                                                  {
                                                    title: '信用卡',
                                                    key: 'CreditCard',
                                                  },
                                                  {
                                                    title: '超商代碼',
                                                    key: 'ConvenienceStore',
                                                  },
                                                ].find(dd => {
                                                  return cash_flow.payment.paymentMethod === dd.key;
                                                })?.title}`,
                                                `交易總金額: ${cash_flow.amount}`,
                                                `交易時間: ${gvc.glitter.ut.dateFormat(new Date(cash_flow.payment.paidAt), 'yyyy-MM-dd hh:mm:ss')}`,
                                              ]
                                            : [`金流交易結果: 未付款`]
                                          ).join(`<div class="my-2"></div>`)}
                                        </div>
                                      </div>
                                    `;
                                  } else {
                                    return '';
                                  }
                                })(),
                              ]
                                .filter(Boolean)
                                .join(BgWidget.mbContainer(18))
                            ),
                        is_shipment ? '' : shipment_card,
                        BgWidget.mainCard(
                          gvc.bindView(
                            (() => {
                              const id = gvc.glitter.getUUID();
                              return {
                                bind: id,
                                view: () => {
                                  return html`
                                    <div class="d-flex align-items-center justify-content-between">
                                      <div>
                                        <div style="color: #393939; font-weight: 700;">訂單標籤</div>
                                        ${BgWidget.grayNote('操作後台人員登記與分類用，不會顯示於前台')}
                                        ${BgWidget.mbContainer(4)}
                                      </div>
                                      ${BgWidget.blueNote(
                                        '使用現有標籤',
                                        gvc.event(() => {
                                          OrderModule.useOrderTags({
                                            gvc,
                                            config_key: 'order_manager_tags',
                                            def: orderData.orderData.tags ?? [],
                                            callback: tags => {
                                              orderData.orderData.tags = tags;
                                              gvc.notifyDataChange(id);
                                            },
                                          });
                                        })
                                      )}
                                    </div>
                                    ${BgWidget.multipleInput(
                                      gvc,
                                      orderData.orderData.tags ?? [],
                                      {
                                        save: def => {
                                          orderData.orderData.tags = [...new Set(def)];
                                        },
                                      },
                                      true
                                    )}
                                  `;
                                },
                              };
                            })()
                          )
                        ),
                        BgWidget.mainCard(
                          gvc.bindView(() => {
                            const vm = {
                              edit_mode: false,
                              id: gvc.glitter.getUUID(),
                            };
                            return {
                              bind: vm.id,
                              view: () => {
                                return html`
                                  <div class="w-100 d-flex tx_700 align-items-center justify-content-between">
                                    <div>顧客備註</div>
                                    <div
                                      style="display: flex;padding: 4px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                                      onclick="${gvc.event(() => {
                                        vm.edit_mode = !vm.edit_mode;
                                        gvc.notifyDataChange(vm.id);
                                      })}"
                                    >
                                      ${vm.edit_mode ? '取消編輯' : '編輯'}
                                    </div>
                                  </div>
                                  ${BgWidget.mbContainer(18)}
                                  <div style="position: relative; color: #8d8d8d;">
                                    ${vm.edit_mode
                                      ? EditorElem.editeText({
                                          gvc: gvc,
                                          title: '',
                                          default: orderData.orderData.user_info.note || '',
                                          placeHolder: '請輸入備註',
                                          callback: text => {
                                            orderData.orderData.user_info.note = text;
                                          },
                                        })
                                      : orderData.orderData.user_info.note || '顧客尚未填寫備註'}
                                  </div>
                                `;
                              },
                            };
                          })
                        ),
                        BgWidget.mainCard(
                          gvc.bindView(() => {
                            const vm = {
                              edit_mode: false,
                              id: gvc.glitter.getUUID(),
                            };
                            return {
                              bind: vm.id,
                              view: () => {
                                return html`
                                  <div class="w-100 d-flex tx_700 align-items-center justify-content-between">
                                    訂單備註
                                  </div>
                                  ${BgWidget.mbContainer(18)}
                                  <div style="position: relative;">
                                    ${EditorElem.editeText({
                                      gvc: gvc,
                                      title: '',
                                      default: orderData.orderData.order_note || '',
                                      placeHolder: '請輸入備註',
                                      callback: text => {
                                        orderData.orderData.order_note = text;
                                      },
                                    })}
                                  </div>
                                `;
                              },
                            };
                          })
                        ),
                        gvc.bindView({
                          bind: 'invoiceView',
                          view: () => {
                            if (invoiceLoading) {
                              dialog.dataLoading({ visible: true });
                              return '';
                            }
                            dialog.dataLoading({ visible: false });

                            return BgWidget.mainCard(html`
                              <div class="tx_700">發票資訊</div>
                              ${BgWidget.mbContainer(18)}
                              <div class="d-flex" style="margin-bottom: 12px;">
                                <div class="col-3">開立日期</div>
                                <div class="col-3 text-center">發票單號</div>
                                <div class="col-3 text-center">發票金額</div>
                                <div class="col-2 text-center">狀態</div>
                              </div>
                              ${invoiceDataList
                                .map((invoiceData: any) => {
                                  return html` <div class="d-flex" style="height:55px;">
                                    <div class="col-3 d-flex align-items-center ">
                                      ${invoiceData.create_date.split('T')[0]}
                                    </div>
                                    <div
                                      class="col-3 text-center d-flex align-items-center justify-content-center"
                                      style="color: #4D86DB;"
                                    >
                                      ${invoiceData.invoice_no}
                                    </div>
                                    <div class="col-3 text-center d-flex align-items-center justify-content-center">
                                      ${invoiceData.invoice_data.invoiceAmount ?? orderData.orderData.total}
                                    </div>
                                    <div class="col-2 text-center d-flex align-items-center justify-content-center">
                                      ${invoiceData.status == 1
                                        ? html` <div style="color:#10931D">已完成</div>`
                                        : html` <div style="color:#DA1313">已作廢</div>`}
                                    </div>
                                    <div class="flex-fill d-flex justify-content-end align-items-center">
                                      <div style="margin-right: 14px;">
                                        ${BgWidget.grayButton(
                                          '查閱',
                                          gvc.event(() => {
                                            vm.invoiceData = invoiceData;
                                            vm.type = 'viewInvoice';
                                          }),
                                          { textStyle: '' }
                                        )}
                                      </div>
                                    </div>
                                  </div>`;
                                })
                                .join('')}
                            `);
                          },
                        }),
                        BgWidget.mainCard(html`
                          <div class="tx_700">訂單記錄</div>
                          ${BgWidget.mbContainer(18)}
                          <div class="d-flex flex-column" style="gap: 8px">
                            ${orderData.orderData?.editRecord
                              ? gvc.map(
                                  orderData.orderData.editRecord
                                    .sort((a: any, b: any) => {
                                      return Tool.formatDateTime(a.time, true) < Tool.formatDateTime(b.time, true)
                                        ? 1
                                        : -1;
                                    })
                                    .map((r: any) => {
                                      const record = OrderModule.formatRecord(
                                        gvc,
                                        vm,
                                        (orderData.orderData as any).orderID,
                                        structuredClone(r.record)
                                      );

                                      return html`
                                        <div class="d-flex" style="gap: 42px">
                                          <div>${Tool.formatDateTime(r.time, true)}</div>
                                          <div>${record.replace(/\\n/g, '<br/>')}</div>
                                        </div>
                                      `;
                                    })
                                )
                              : ''}
                            <div class="d-flex" style="gap: 42px">
                              <div>${Tool.formatDateTime(orderData.created_time, true)}</div>
                              <div>訂單成立</div>
                            </div>
                          </div>
                        `),
                        (() => {
                          const renderReconciliationInfo = (orderData: any) => {
                            if (!orderData.reconciliation_date) {
                              return html` <div>尚未入帳</div>`;
                            }

                            return html`
                              <div class="rounded-3 w-100 border p-2" style="background: whitesmoke;">
                                <div class="col-12 d-flex flex-column" style="gap:5px;">
                                  <div>入帳日期</div>
                                  <div class="fw-500 fs-6">
                                    ${gvc.glitter.ut.dateFormat(
                                      new Date(orderData.reconciliation_date),
                                      'yyyy-MM-dd hh:mm'
                                    )}
                                  </div>
                                </div>
                                <div class="my-2 border-top w-100"></div>
                                <div class="col-12 d-flex flex-column" style="gap:5px;">
                                  <div>入帳金額</div>
                                  <div class="fw-500 fs-6">
                                    $ ${parseInt(orderData.total_received, 10).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            `;
                          };

                          const renderOffsetRecord = (record: any) => {
                            return html`
                              <div class="rounded-3 w-100 border p-2" style="background: whitesmoke;">
                                <div class="col-12 d-flex flex-column" style="gap:5px;">
                                  <div>沖帳日期</div>
                                  <div class="fw-500 fs-6">
                                    ${gvc.glitter.ut.dateFormat(new Date(record.offset_date), 'yyyy-MM-dd hh:mm:ss')}
                                  </div>
                                </div>
                                <div class="my-2 border-top w-100"></div>
                                <div class="col-12 d-flex flex-column" style="gap:5px;">
                                  <div>沖帳人員</div>
                                  <div class="fw-500 fs-6">${(record.user && record.user.name) || '未知'}</div>
                                </div>
                                <div class="my-2 border-top w-100"></div>
                                <div class="col-12 d-flex flex-column" style="gap:5px;">
                                  <div>沖帳金額</div>
                                  <div class="fw-500 fs-6">
                                    $ ${parseInt(record.offset_amount, 10).toLocaleString()}
                                  </div>
                                </div>
                                <div class="my-2 border-top w-100"></div>
                                <div class="col-12 d-flex flex-column" style="gap:5px;">
                                  <div>沖帳原因</div>
                                  <div class="fw-500 fs-6">${record.offset_reason}</div>
                                </div>
                                <div class="my-2 border-top w-100"></div>
                                <div class="col-12 d-flex flex-column" style="gap:5px;">
                                  <div>沖帳備註</div>
                                  <div class="fw-500 fs-6">${record.offset_note || '未填寫'}</div>
                                </div>
                              </div>
                            `;
                          };

                          const records = orderData['offset_records'] ?? [];
                          const renderedRecords = records
                            .slice() // 避免改變原始資料
                            .reverse()
                            .map(renderOffsetRecord)
                            .map(dd => html` <div class="w-100">${dd}</div>`)
                            .join(html` <div class="w-100 border-top my-2"></div>`);

                          BgWidget.mainCard(html`
                            <div class="tx_700">對帳記錄</div>
                            ${BgWidget.mbContainer(18)}
                            <div class="mt-n2">${renderReconciliationInfo(orderData)} ${renderedRecords}</div>
                          `);
                        })(),
                      ]
                        .filter(Boolean)
                        .join(BgWidget.mbContainer(24)),
                      ratio: 75,
                    },
                    {
                      html: html` <div class="summary-card">
                        ${[
                          BgWidget.mainCard(html`
                            <div style="font-size: 16px;font-weight: 700;">訂單來源</div>
                            <div class="d-flex flex-column gap-1 mt-1">
                              ${(() => {
                                if (orderData.orderData.fbc) {
                                  return html`
                                    <div>FB廣告</div>
                                    ${BgWidget.blueNote(
                                      html`複製追蹤碼<i class="fa-regular fa-copy ms-1"></i>`,
                                      gvc.event(() => {
                                        navigator.clipboard.writeText(`${orderData.orderData.fbc}`);
                                        BgWidget.jumpAlert({
                                          gvc,
                                          text: '複製成功',
                                          justify: 'top',
                                          align: 'center',
                                        });
                                      }),
                                      'font-weight: 500;'
                                    )}
                                  `;
                                }
                                if (!orderData.orderData.orderSource) {
                                  return '線上';
                                }
                                const source: Record<string, string> = {
                                  pos: 'POS',
                                  combine: '合併訂單',
                                  split: '拆分訂單',
                                  manual: '手動新增',
                                };
                                return source[orderData.orderData.orderSource] ?? '線上';
                              })()}
                            </div>
                          `),
                          BgWidget.mainCard(html`
                            <div style="color: #393939;font-size: 16px;">
                              <div class="d-flex align-items-center mb-3">
                                <div class="tx_700">訂購人資料</div>
                                <div class="flex-fill"></div>
                              </div>
                              <div class="w-100 d-flex flex-column mt-2" style="gap:6px;">
                                ${[
                                  html` <div class="d-flex flex-column" style="gap:8px;">
                                    <div
                                      class="d-flex align-items-center"
                                      style="gap: 8px; cursor: pointer;"
                                      onclick="${gvc.event(() => {
                                        if (userData.userID) {
                                          child_vm.userID = userData.userID;
                                          child_vm.type = 'user';
                                        }
                                      })}"
                                    >
                                      ${[
                                        (() => {
                                          const name = userData?.userData?.name;
                                          if (name) {
                                            return html`<span style="font-weight: 500; color: #4D86DB;">${name}</span>`;
                                          }
                                          return html`<span style="font-weight: normal; color: #393939;"
                                            >${orderData.orderData?.customer_info?.name || '訪客'}</span
                                          >`;
                                        })(),
                                        (() => {
                                          if (userData.status === 0) {
                                            return '';
                                          }
                                          if (userDataLoading) {
                                            return BgWidget.grayInsignia('讀取中');
                                          }
                                          if (userData.member === undefined) {
                                            return BgWidget.grayInsignia('訪客');
                                          }
                                          if (userData?.member.length > 0) {
                                            for (let i = 0; i < userData.member.length; i++) {
                                              if (userData.member[i].trigger) {
                                                return BgWidget.darkInsignia(userData.member[i].tag_name);
                                              }
                                            }
                                          }
                                          return BgWidget.darkInsignia('一般會員');
                                        })(),
                                        (() => {
                                          if (userData.status === 0) {
                                            return BgWidget.dangerInsignia('黑名單');
                                          }
                                          if (userData.status === 2) {
                                            return BgWidget.watchingInsignia('觀察名單');
                                          }
                                          return '';
                                        })(),
                                      ].join('')}
                                    </div>
                                    <div style="color: #393939;font-weight: 400;">
                                      ${userData?.userData?.phone ??
                                      orderData.orderData.user_info.phone ??
                                      '此會員未填手機'}
                                    </div>
                                    <div style="color: #393939;font-weight: 400;word-break:break-all;">
                                      ${userData?.userData?.email ?? orderData.orderData.user_info.email ?? ''}
                                    </div>
                                  </div>`,
                                  BgWidget.horizontalLine({ margin: 0.5 }),
                                  gvc.bindView({
                                    bind: `user_info`,
                                    view: () => {
                                      let view: string[] = [];
                                      if (orderData.orderData.user_info.shipment !== 'now') {
                                        view.push(
                                          [
                                            html` <div style="font-size: 16px;font-weight: 700;color:#393939">
                                              收件人資料
                                            </div>`,
                                            gvc.bindView(() => {
                                              return {
                                                bind: gvc.glitter.getUUID(),
                                                view: async () => {
                                                  let viewModel = [
                                                    ['姓名', 'name'],
                                                    ['電話', 'phone'],
                                                    ['信箱', 'email'],
                                                  ];
                                                  const receipt = (
                                                    await ApiUser.getPublicConfig(
                                                      'custom_form_checkout_recipient',
                                                      'manager'
                                                    )
                                                  ).response.value;
                                                  receipt.list.map((d1: any) => {
                                                    if (
                                                      !viewModel.find(dd => {
                                                        return dd[1] === d1.key;
                                                      })
                                                    ) {
                                                      viewModel.push([d1.title, d1.key]);
                                                    }
                                                  });
                                                  return viewModel
                                                    .map(item => {
                                                      return html`
                                                        <div style="word-break: break-all;">
                                                          ${item[0]} :
                                                          ${(orderData.orderData.user_info as any)[item[1]] || '未填寫'}
                                                        </div>
                                                      `;
                                                    })
                                                    .join('');
                                                },
                                                divCreate: {
                                                  class: 'd-flex flex-column tx_normal',
                                                  style: 'gap: 8px;',
                                                },
                                              };
                                            }),
                                          ].join('')
                                        );
                                      }
                                      view.push(html`
                                        <div class="tx_700">付款方式</div>
                                        <div>${OrderModule.getPaymentMethodText(gvc, orderData.orderData)}</div>
                                        <div class="tx_700">配送方式</div>
                                        <div class="tx_normal" style="line-height: 140%;">
                                          ${Language.getLanguageCustomText(
                                            (
                                              orderData.orderData.shipment_selector ||
                                              OrderModule.supportShipmentMethod()
                                            ).find(dd => {
                                              return dd.value === orderData.orderData.user_info.shipment;
                                            })?.name ?? ''
                                          )}
                                        </div>
                                        ${(() => {
                                          switch (orderData.orderData.user_info.shipment) {
                                            case 'FAMIC2C':
                                            case 'HILIFEC2C':
                                            case 'OKMARTC2C':
                                            case 'UNIMARTC2C':
                                            case 'UNIMARTFREEZE':
                                            case 'FAMIC2CFREEZE':
                                              return html` <div class="tx_700">配送資訊</div>
                                                <div class="d-flex flex-wrap w-100">
                                                  <div
                                                    class="fw-normal fs-6"
                                                    style="white-space: normal;word-break: break-all;"
                                                  >
                                                    ${decodeURI(
                                                      orderData.orderData.user_info.CVSStoreName
                                                    )}（${orderData.orderData.user_info.CVSStoreID}）
                                                  </div>
                                                </div>
                                                <div
                                                  class="fw-normal fs-6 w-100"
                                                  style="white-space: normal;word-break: break-all;"
                                                >
                                                  ${orderData.orderData.user_info.CVSAddress}
                                                </div>`;
                                            case 'global_express':
                                            case 'black_cat_freezing':
                                            case 'normal':
                                            default:
                                              const mapView = [];
                                              if (orderData.orderData.user_info.address) {
                                                mapView.push(
                                                  html`<div class="tx_700">配送資訊</div>
                                                    <div class="fw-normal fs-6" style="white-space: normal;">
                                                      ${[
                                                        orderData.orderData.user_info.city,
                                                        orderData.orderData.user_info.area,
                                                        orderData.orderData.user_info.address,
                                                      ]
                                                        .filter(Boolean)
                                                        .join('')}
                                                    </div>`
                                                );
                                              }
                                              const formData: any = (
                                                orderData.orderData.shipment_selector ||
                                                OrderModule.supportShipmentMethod()
                                              ).find(dd => {
                                                return dd.value === orderData.orderData.user_info.shipment;
                                              });
                                              if (formData.form) {
                                                mapView.push(
                                                  formData.form
                                                    .map((dd: any) => {
                                                      return html` <div class="d-flex flex-wrap w-100">
                                                        <span class="me-2 fw-normal fs-6"
                                                          >${Language.getLanguageCustomText(dd.title)}:</span
                                                        >
                                                        <div
                                                          class="fw-normal fs-6"
                                                          style="white-space: normal;word-break: break-all;"
                                                        >
                                                          ${Language.getLanguageCustomText(
                                                            orderData.orderData.user_info.custom_form_delivery[dd.key]
                                                          )}
                                                        </div>
                                                      </div>`;
                                                    })
                                                    .join('')
                                                );
                                              } else {
                                                mapView.push('');
                                              }
                                              return mapView.join('');
                                          }
                                        })()}
                                        ${orderData.orderData.orderSource === 'POS'
                                          ? html`
                                              <div class="tx_700">結帳人員</div>
                                              <div class="tx_normal" style="line-height: 140%;">
                                                ${orderData.orderData.pos_info.who.config.name === 'manager'
                                                  ? `店長`
                                                  : [
                                                      orderData.orderData.pos_info.who.config.title,
                                                      orderData.orderData.pos_info.who.config.name,
                                                      orderData.orderData.pos_info.who.config.member_id,
                                                    ].join(' / ')}
                                              </div>
                                              <div class="tx_700">結帳門市</div>
                                              ${gvc.bindView(() => {
                                                return {
                                                  bind: gvc.glitter.getUUID(),
                                                  view: async () => {
                                                    return (
                                                      await ApiUser.getPublicConfig('store_manager', 'manager')
                                                    ).response.value.list.find((dd: any) => {
                                                      return (
                                                        dd.id === (orderData.orderData.pos_info as any).where_store
                                                      );
                                                    }).name;
                                                  },
                                                };
                                              })}
                                            `
                                          : ''}
                                      `);
                                      return view.join(BgWidget.horizontalLine({ margin: 0.5 }));
                                    },
                                    divCreate: {
                                      class: 'd-flex flex-column',
                                      style: 'gap:8px;',
                                    },
                                  }),
                                ].join('')}
                              </div>
                            </div>
                          `),
                          gvc.bindView({
                            bind: 'distribution_info',
                            view: () => {
                              if (
                                orderData.orderData.distribution_info &&
                                Object.keys(orderData.orderData.distribution_info).length > 0
                              ) {
                                let viewArray: {
                                  title: string;
                                  value: string;
                                }[] = [
                                  {
                                    title: '分銷代碼',
                                    value: orderData.orderData.distribution_info?.code ?? '',
                                  },
                                  {
                                    title: '分銷連結名稱',
                                    value:
                                      html` <div
                                        style="color: #006621; font-weight: 400; cursor:pointer; overflow-wrap: break-word; text-decoration: underline; "
                                        onclick="${gvc.event(() => {
                                          dialog.dataLoading({
                                            visible: true,
                                          });
                                          ApiRecommend.getList({
                                            data: {},
                                            limit: 25,
                                            page: 0,
                                            code: orderData.orderData.distribution_info?.code,
                                            token: (window.parent as any).config.token,
                                          }).then(r => {
                                            vm.distributionData = r.response;
                                            dialog.dataLoading({
                                              visible: false,
                                            });
                                            vm.orderData = JSON.parse(JSON.stringify(orderData));
                                            vm.type = 'recommend';
                                          });
                                        })}"
                                      >
                                        ${orderData.orderData.distribution_info.title}
                                      </div>` ?? '',
                                  },
                                ];
                                return BgWidget.mainCard(html`
                                  <div class="d-flex flex-column" style="gap:12px">
                                    ${viewArray
                                      .map(data => {
                                        return html`
                                          <div
                                            style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;color:#393939;"
                                          >
                                            <div class="tx_700">${data.title}</div>
                                            <div
                                              style="color:#393939;font-size: 16px;font-weight: 400;line-height: 140%;"
                                            >
                                              ${data.value ?? ''}
                                            </div>
                                          </div>
                                        `;
                                      })
                                      .join('')}
                                  </div>
                                `);
                              } else {
                                return '';
                              }
                            },
                          }),
                        ]
                          .filter(dd => {
                            return dd;
                          })
                          .join(BgWidget.mbContainer(24))}
                      </div>`,
                      ratio: 25,
                    }
                  )}
                  <div style="height:240px;"></div>
                  <div class="update-bar-container">
                    <div>
                      ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        const vc: {
                          data: any;
                        } = {
                          data: {},
                        };
                        return {
                          bind: id,
                          view: () => {
                            return new Promise(async resolve => {
                              const data = await saasConfig.api.getPrivateConfig(
                                saasConfig.config.appName,
                                'invoice_setting'
                              );
                              if (data.response.result[0]) {
                                vc.data = data.response.result[0].value;
                              }
                              resolve(
                                gvc.bindView(() => {
                                  vc.data.fincial = vc.data.fincial ?? 'ezpay';
                                  const id = gvc.glitter.getUUID();
                                  return {
                                    bind: id,
                                    view: () => {
                                      if (
                                        (vc.data.fincial == 'ezpay' || vc.data.fincial == 'ecpay') &&
                                        orderData.invoice_status !== 1
                                      ) {
                                        return BgWidget.grayButton(
                                          '開立發票',
                                          gvc.event(() => {
                                            vm.tempOrder = orderData.cart_token;
                                            vm.type = 'createInvoice';
                                          })
                                        );
                                      }
                                      return '';
                                    },
                                  };
                                })
                              );
                            });
                          },
                          divCreate: {
                            class: 'd-flex flex-column flex-column-reverse flex-md-row px-0',
                            style: 'gap:10px;',
                          },
                        };
                      })}
                    </div>
                    ${orderData.orderData.archived === 'true'
                      ? BgWidget.redButton(
                          '刪除',
                          gvc.event(() => {
                            function deleteOrder() {
                              orderData.orderData.orderStatus = '-99';
                              dialog.dataLoading({
                                text: '刪除中',
                                visible: true,
                              });
                              ApiShop.putOrder({
                                id: `${orderData.id}`,
                                order_data: orderData.orderData,
                                status: orderData.status,
                              }).then(response => {
                                dialog.dataLoading({
                                  text: '刪除中',
                                  visible: false,
                                });
                                if (response.result) {
                                  dialog.infoMessage({ text: '刪除成功' });
                                  vm.type = 'list';
                                } else {
                                  dialog.errorMessage({ text: '刪除異常' });
                                }
                              });
                            }

                            dialog.checkYesOrNot({
                              callback: response => {
                                if (response) {
                                  deleteOrder();
                                }
                              },
                              text: '是否要刪除訂單',
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
                        saveEvent();
                      })
                    )}
                  </div>`
              );
            } catch (e) {
              console.error(e);
              return BgWidget.maintenance();
            }
          },
          divCreate: {
            style: vm.filter_type === 'pos' ? 'padding: 0 1.25rem;' : '',
          },
        });
      } catch (e) {
        console.error(`replaceView error: ${e}`);
        return '訂單編輯頁面發生錯誤';
      }
    }

    return gvc.bindView({
      bind: 'orderDetailRefresh',
      view: replaceView,
      divCreate: { class: 'w-100' },
    });
  }

  static createOrder(gvc: GVC, vm: any) {
    const dialog = new ShareDialog(gvc.glitter);
    const newVoucher: VoucherData = OrderModule.newVocuher();
    const url = window.parent.location.href;
    const urlParams = new URLSearchParams(new URL(url).search);
    const tempData: {
      title: string;
      reBackType: 'discount' | 'rebate' | 'shipment_free';
      method: 'percent' | 'fixed';
      value: string;
      discount: number;
    } = {
      title: '',
      reBackType: 'discount',
      method: 'percent',
      value: '',
      discount: 0,
    };

    let showDiscountEdit = true;
    let CVSCheck = false;
    let orderDetailRefresh = false;
    let orderDetail = new OrderDetail(0, 0, newVoucher);
    let newOrder: any = OrderModule.newOrder(gvc);
    let showArray: any = [
      {
        value: 'discount',
        text: '折扣活動',
        method: 'percent',
      },
      {
        value: 'rebate',
        text: '購物金活動',
        method: 'percent',
      },
      {
        value: 'shipment_free',
        text: '免運費活動',
      },
    ];
    let customerData: {
      receiver: any;
      sameCustomer: boolean;
      pageType: string;
      customer: any;
      type: 'auto' | 'manual';
      info: any;
    } = {
      sameCustomer: false,
      pageType: 'none',
      type: 'auto',
      customer: [],
      info: {},
      receiver: {},
    };
    let tempUserData: any = {
      auto: {},
      manual: {},
    };

    [
      'MerchantID',
      'MerchantTradeNo',
      'LogisticsSubType',
      'CVSStoreID',
      'CVSAddress',
      'CVSTelephone',
      'CVSOutSide',
      'CVSStoreName',
    ].forEach(key => {
      const value = urlParams.get(key);

      if (value) {
        if (!CVSCheck) {
          const localData1 = JSON.parse(localStorage.getItem('orderDetail') ?? '');
          newOrder = JSON.parse(localStorage.getItem('newOrder') ?? '');
          orderDetail = localData1;
        }

        CVSCheck = true;
        (orderDetail.user_info as any)[key] = decodeURIComponent(value);
      }
      urlParams.delete(key);
    });

    if (CVSCheck) {
      const { origin, pathname } = window.parent.location;
      const newUrl = origin + pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.parent.window.history.replaceState(null, '', newUrl);
    }

    function selectCVS(cvsCode: string) {
      ApiDelivery.storeMaps({
        returnURL: window.parent.location.href,
        logistics: cvsCode,
      }).then(async res => {
        let newDiv = document.createElement('div');
        localStorage.setItem('orderDetail', JSON.stringify(orderDetail));
        localStorage.setItem('newOrder', JSON.stringify(newOrder));
        newDiv.innerHTML = res.response.form;
        (window.parent as any).document.body.appendChild(newDiv);
        ((window.parent as any).document.querySelector('#submit') as any).click();
      });
    }

    // 計算優惠金的總扣除額 運費資訊 還有點擊和完成折扣填值之後所顯示的前端頁面
    function showOrderDetail() {
      function showDiscount(): { left: string; right: string } {
        let leftHTML = newVoucher.title
          ? html`
              <div>折扣</div>
              <div style="font-size: 14px;color:#8D8D8D;font-weight: 400;">${newVoucher.title}</div>
            `
          : '折扣';
        let rightTitle = '新增折扣';

        //整理總扣除額 還有折扣輸入時 所有折扣都是以value 並沒有區分 這邊也要拆分開
        if (newVoucher.value) {
          // 重設相關值
          orderDetail.rebate = 0;
          orderDetail.discount = 0;
          newVoucher.rebate_total = 0;
          newVoucher.discount_total = 0;

          if (newVoucher.reBackType === 'discount') {
            // 折扣處理
            if (newVoucher.method === 'percent') {
              // 百分比折扣計算
              newVoucher.discount_total = Math.round(orderDetail.subtotal * Number(newVoucher.value) * 0.01);
            } else {
              // 固定金額折扣，不超過消費金額
              newVoucher.discount_total = Math.min(orderDetail.subtotal, Number(newVoucher.value));
            }

            // 更新訂單折扣
            orderDetail.discount = newVoucher.discount_total;
            rightTitle = `-$ ${orderDetail.discount.toLocaleString()}`;
          } else if (newVoucher.reBackType === 'rebate') {
            if (newVoucher.method === 'fixed') {
              // 固定金額回饋
              newVoucher.rebate_total = Math.min(Number(newVoucher.value), orderDetail.subtotal);
              orderDetail.rebate = newVoucher.rebate_total;
            } else {
              // 百分比回饋計算
              newVoucher.rebate_total = Math.round(orderDetail.subtotal * Number(newVoucher.value) * 0.01);
              orderDetail.rebate = newVoucher.rebate_total;
            }

            // 回饋處理
            rightTitle = `獲得購物金 ${newVoucher.rebate_total} 點`;
          }
        }

        if (newVoucher.reBackType === 'shipment_free') {
          rightTitle = '免運費';
        }

        let rightHTML = html`
          <div style="color: #4D86DB;position: relative;">
            <div
              style="cursor: pointer;width:158px;text-align: right"
              onclick="${gvc.event(() => {
                showDiscountEdit = !showDiscountEdit;
                gvc.notifyDataChange('orderDetail');
              })}"
            >
              ${rightTitle}
            </div>
            ${showDiscountEdit
              ? ''
              : gvc.bindView({
                  bind: `editDiscount`,
                  view: () => {
                    let discountHTML = '';
                    let checkBox = html` <div
                      style="margin-right:6px;display: flex;width: 16px;height: 16px;justify-content: center;align-items: center;border-radius: 20px;border: 4px solid #393939"
                    ></div>`;
                    let uncheckBox = html` <div
                      style="margin-right:6px;width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"
                    ></div>`;
                    showArray.map((rowData: any, index: number) => {
                      if (rowData.select) {
                        function drawVoucherDetail(rowData: any) {
                          switch (rowData.value) {
                            case 'rebate':
                            case 'discount': {
                              return html` <div class="w-100 d-flex" style="padding-left: 8px;margin-top: 8px;">
                                <div style="height: 100%;width:1px;background-color: #E5E5E5;margin-right: 14px;"></div>
                                <div
                                  style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;flex: 1 0 0;"
                                >
                                  <div
                                    style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;align-self: stretch;"
                                  >
                                    <div
                                      style="display: flex;align-items: center;gap: 6px;"
                                      onclick="${gvc.event(() => {
                                        rowData.method = 'percent';
                                        tempData.method = 'percent';
                                        gvc.notifyDataChange('editDiscount');
                                      })}"
                                    >
                                      ${rowData.method == 'percent' ? checkBox : uncheckBox} 百分比
                                    </div>
                                    <div
                                      style="${rowData.method == 'percent'
                                        ? 'display: flex'
                                        : 'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="2"
                                        height="40"
                                        viewBox="0 0 2 40"
                                        fill="none"
                                      >
                                        <path d="M1 0V40" stroke="#E5E5E5" />
                                      </svg>
                                      <input
                                        class="w-100"
                                        style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                        type="number"
                                        max="100"
                                        min="1"
                                        value="${tempData.discount}"
                                        onchange="${gvc.event(e => {
                                          e.value = Math.min(e.value, 100);
                                          rowData.discount = e.value;
                                          tempData.discount = e.value;
                                        })}"
                                      />
                                      <div
                                        class="h-100 d-flex align-items-center"
                                        style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;"
                                      >
                                        %
                                      </div>
                                    </div>
                                  </div>
                                  <div style="display: flex;gap: 6px;flex-direction: column;width: 100%;">
                                    <div
                                      style="display: flex;align-items: center;gap: 6px;"
                                      onclick="${gvc.event(() => {
                                        rowData.method = 'fixed';
                                        tempData.method = 'fixed';
                                        gvc.notifyDataChange('editDiscount');
                                      })}"
                                    >
                                      ${rowData.method == 'fixed' ? checkBox : uncheckBox} 固定金額
                                    </div>
                                    <div
                                      style="${rowData.method == 'fixed'
                                        ? 'display: flex'
                                        : 'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="2"
                                        height="40"
                                        viewBox="0 0 2 40"
                                        fill="none"
                                      >
                                        <path d="M1 0V40" stroke="#E5E5E5" />
                                      </svg>
                                      <input
                                        class="w-100"
                                        style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                        type="number"
                                        value="${tempData.discount}"
                                        min="1"
                                        onchange="${gvc.event(e => {
                                          rowData.discount = e.value;
                                          tempData.discount = e.value;
                                        })}"
                                      />
                                      <div
                                        class="h-100 d-flex align-items-center"
                                        style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;"
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>`;
                            }
                            default:
                              return '';
                          }
                        }

                        tempData.reBackType = rowData.value;
                        discountHTML += html`
                          <div class="w-100 d-flex align-items-center flex-wrap" style="color:#393939">
                            ${checkBox}
                            <div>${rowData.text}</div>
                            ${drawVoucherDetail(rowData)}
                          </div>
                        `;
                      } else {
                        discountHTML += html`
                          <div
                            class="w-100 d-flex align-items-center"
                            style="color:#393939;cursor: pointer;"
                            onclick="${gvc.event(() => {
                              showArray = [
                                {
                                  value: 'discount',
                                  text: '折扣活動',
                                  method: 'percent',
                                },
                                {
                                  value: 'rebate',
                                  text: '購物金活動',
                                  method: 'percent',
                                },
                                {
                                  value: 'shipment_free',
                                  text: '免運費活動',
                                },
                              ];
                              showArray[index].select = true;
                              gvc.notifyDataChange('editDiscount');
                            })}"
                          >
                            ${uncheckBox}
                            <div>${rowData.text}</div>
                          </div>
                        `;
                      }
                    });

                    return html`
                      <div class="d-flex flex-column " style="font-weight: 700;">
                        折扣名稱
                        <input
                          class="w-100"
                          style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;margin-top:12px;"
                          value="${tempData.title ?? ''}"
                          onchange="${gvc.event(e => {
                            tempData.title = e.value;
                          })}"
                        />
                      </div>
                      <div class="d-flex flex-column" style="font-weight: 700;gap:8px;">折扣方式 ${discountHTML}</div>
                      <div class="d-flex w-100 justify-content-end" style="gap:14px;">
                        ${BgWidget.cancel(
                          gvc.event(() => {
                            showDiscountEdit = !showDiscountEdit;
                            gvc.notifyDataChange('orderDetail');
                          })
                        )}
                        ${BgWidget.save(
                          gvc.event(() => {
                            if (!tempData.title) {
                              dialog.errorMessage({ text: '請輸入折扣名稱' });
                              return;
                            }
                            showDiscountEdit = !showDiscountEdit;
                            newVoucher.reBackType = tempData.reBackType;
                            newVoucher.method = tempData.method;
                            newVoucher.value = tempData.discount;
                            newVoucher.title = tempData.title;
                            orderDetailRefresh = true;
                            gvc.notifyDataChange(['listProduct', 'orderDetail']);
                          }),
                          '確定'
                        )}
                      </div>
                    `;
                  },
                  divCreate: {
                    style: `display: flex;color:#393939;text-align: left;width: 348px;padding: 24px;flex-direction: column;gap: 18px;border-radius: 10px;background: #FFF;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);position:absolute;right:0;top:33px;gap:18px;z-index:3;`,
                  },
                })}
          </div>
        `;
        return {
          left: leftHTML,
          right: rightHTML,
        };
      }

      return gvc.bindView({
        bind: 'orderDetail',
        view: () => {
          orderDetail.subtotal = 0;
          orderDetail.lineItems = [];
          newOrder.productCheck.map((data: any, index: number) => {
            const variant = data.content.variants[parseInt(data.selectIndex ?? 0)];
            orderDetail.lineItems.push({
              preview_image: '',
              title: '',
              id: data.id,
              spec: variant.spec,
              count: variant.qty ?? '1',
              sale_price: variant.sale_price,
              sku: variant.sku,
              deduction_log: {},
              rebate: 0,
              weight: 0,
              is_gift: false,
              origin_price: variant.cost || variant.sale_price,
              discount_price: 0,
            });
            orderDetail.subtotal +=
              Number(orderDetail.lineItems[index].count) * orderDetail.lineItems[index].sale_price;
          });
          // 取得這些商品運費
          if (orderDetailRefresh) {
            dialog.dataLoading({ text: '計算中', visible: true });
            ApiShop.getManualCheckout({
              line_items: orderDetail.lineItems,
              user_info: orderDetail.user_info,
            }).then(r => {
              dialog.dataLoading({ visible: false });
              if (r.result) {
                orderDetailRefresh = false;
                orderDetail.shipment = r.response.data.shipment_fee;
                gvc.notifyDataChange('orderDetail');
              }
            });
          }
          if (newVoucher.reBackType == 'shipment_free') {
            orderDetail.shipment = 0;
          }
          orderDetail.total = orderDetail.subtotal + orderDetail.shipment - orderDetail.discount;
          let returnHTML = '';
          let showArray: {
            left: string;
            right: string | number;
          }[] = [
            {
              left: '小計總額',
              right: orderDetail.subtotal,
            },
            {
              left: '運費',
              right: orderDetail.shipment,
            },
            showDiscount(),
            {
              left: '總金額',
              right: orderDetail.total ?? orderDetail.subtotal + orderDetail.shipment - orderDetail.discount,
            },
          ];
          showArray.map(rowData => {
            returnHTML += html`
              <div class="w-100 d-flex align-items-center justify-content-end" style="min-height: 21px;">
                <div style="text-align: right;">${rowData.left}</div>
                <div style="width:158px;text-align: right">
                  ${rowData.left.includes('折扣') ? rowData.right : `$${rowData.right.toLocaleString()}`}
                </div>
              </div>
            `;
          });
          return returnHTML;
        },
        divCreate: {
          class: 'd-flex flex-column w-100',
          style: 'gap: 12px;',
        },
      });
    }

    // 訂單資訊驗證
    function checkOrderEmpty(passData: OrderDetail) {
      if (passData.lineItems.length < 1) {
        dialog.infoMessage({ text: '請添加商品' });
        return false;
      }
      if (!passData.customer_info.name || !passData.customer_info.email) {
        dialog.infoMessage({ text: '「顧客資料」姓名與信箱尚未填寫' });
        return false;
      }
      if (!CheckInput.isEmail(passData.customer_info.email)) {
        dialog.infoMessage({ text: '「顧客資料」信箱格式錯誤' });
        return false;
      }
      if (CheckInput.isEmpty(passData.customer_info.payment_select)) {
        dialog.infoMessage({ text: '請選擇「付款方式」' });
        return false;
      }
      if (CheckInput.isEmpty(passData.user_info.shipment)) {
        dialog.infoMessage({ text: '請選擇「配送方式」' });
        return false;
      }
      if (!passData.user_info.name || !passData.user_info.email) {
        dialog.infoMessage({ text: '「收件人資料」姓名與信箱尚未填寫' });
        return false;
      }
      if (CheckInput.isEmpty(passData.user_info.phone) && !CheckInput.isTaiwanPhone(passData.user_info.phone)) {
        dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert('「收件人資料」電話格式有誤或未填') });
        return false;
      }
      if (!CheckInput.isEmail(passData.user_info.email)) {
        dialog.infoMessage({ text: '「收件人資料」信箱格式錯誤' });
        return false;
      }
      if (!ShipmentConfig.supermarketList.includes(passData.user_info.shipment) && !passData.user_info.address) {
        dialog.infoMessage({ text: '「收件人資料」請填寫宅配地址' });
        return false;
      }
      if (ShipmentConfig.supermarketList.includes(passData.user_info.shipment) && !passData.user_info.CVSAddress) {
        dialog.infoMessage({ text: '「收件人資料」請選擇取貨門市' });
        return false;
      }
      return true;
    }

    return BgWidget.container(html`
      <!-- 標頭 --- 新增訂單標題和返回 -->
      <div class="title-container mb-4">
        ${BgWidget.goBack(
          gvc.event(() => {
            vm.type = 'list';
          })
        )}
        ${BgWidget.title('新增訂單')}
      </div>
      <!-- 訂單內容 --- 商品資訊 -->
      <div
        style="color: #393939;width: 100%;display: flex;padding: 20px;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);"
      >
        <div class="tx_700">訂單內容 ${BgWidget.requiredStar()}</div>
        <div style="width: 100%;display: flex;align-items: center;padding-right: 20px;">
          <div class="flex-fill d-flex align-items-center col-5 tx_700">商品</div>
          <div class="col-3 pe-lg-3" style="display: flex;align-items: flex-start;font-size: 16px;font-weight: 700;">
            單價
          </div>
          <div class="col-2 tx_700">數量</div>
          <div class="tx_700" style="width: 50px; text-align: right;">小計</div>
        </div>
        ${gvc.bindView({
          bind: 'listProduct',
          view: () => {
            let returnHTML = '';
            gvc.notifyDataChange('orderDetail');
            if (newOrder.productCheck.length) {
              newOrder.productCheck.map((product: any, index: number) => {
                let selectVariant = product.content.variants[parseInt(product.selectIndex ?? 0)];
                let productIMG =
                  typeof selectVariant.preview_image == 'string'
                    ? selectVariant.preview_image
                    : selectVariant.preview_image[0];
                productIMG = productIMG
                  ? productIMG
                  : product.content.preview_image[0]
                    ? product.content.preview_image[0]
                    : BgWidget.noImageURL;
                selectVariant.qty = selectVariant.qty || 1;
                returnHTML += html`
                  <div style="width: 100%;display: flex;align-items: center;position: relative;padding-right: 20px;">
                    <div
                      class="flex-fill d-flex align-items-center col-5"
                      style="font-size: 16px;font-weight: 700;gap: 12px;"
                    >
                      <div
                        style="width: 54px;height: 54px; background: url('${productIMG}') lightgray 50% / cover no-repeat;"
                      ></div>
                      <div
                        style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;width: calc(100% - 54px);padding-right: 15px;"
                      >
                        <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 100%;">
                          ${product.content.title}
                        </div>
                        <div class="d-flex" style="gap:8px;font-weight: 400;">
                          ${(() => {
                            if (selectVariant.spec.length > 0) {
                              let tempHTML = '';
                              selectVariant.spec.map((spec: string) => {
                                tempHTML += html` <div
                                  style="display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;background: #EAEAEA;"
                                >
                                  ${spec}
                                </div>`;
                              });
                              return tempHTML;
                            } else {
                              return html`
                                <div
                                  style="display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;background: #EAEAEA;"
                                >
                                  單一規格
                                </div>
                              `;
                            }
                          })()}
                        </div>
                        <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                          存貨單位 (SKU): ${selectVariant.sku.length ? selectVariant.sku : 'sku未指定'}
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-3"
                      style="display: flex;padding-right: 40px;align-items: flex-start;font-size: 16px;font-weight: 400;"
                    >
                      $${(() => {
                        const price = parseInt(`${selectVariant.sale_price}`, 10);
                        return isNaN(price) ? 0 : price.toLocaleString();
                      })()}
                    </div>
                    <div class="tx_700" style="width:15%">
                      <input
                        type="number"
                        value="${selectVariant.qty}"
                        style="width: 80px;transform: translateX(-16px);text-align: center;display: flex;padding: 9px 18px;align-items: center;gap: 32px;border-radius: 10px;border: 1px solid #DDD;"
                        min="0"
                        onchange="${gvc.event(e => {
                          if (e.value < 1) {
                            dialog.warningMessage({
                              text: '更改數量為 0 將會刪除該商品。<br />確定要刪除此商品嗎？',
                              callback: response => {
                                if (response) {
                                  newOrder.productCheck.splice(index, 1);
                                  orderDetailRefresh = true;
                                  gvc.notifyDataChange(['listProduct', 'orderDetail']);
                                } else {
                                  e.value = 1;
                                }
                              },
                            });
                          } else {
                            selectVariant.qty = parseInt(e.value, 10);
                            orderDetailRefresh = true;
                            gvc.notifyDataChange(['listProduct', 'orderDetail']);
                          }
                        })}"
                      />
                    </div>
                    <div style="min-width: 6%;font-size: 16px;font-weight: 400;width: 50px;text-align: right;">
                      <span>$${(selectVariant.sale_price * selectVariant.qty).toLocaleString()}</span>
                      <div
                        class="d-flex align-items-center cursor_pointer"
                        style="position: absolute;right:0;top:50%;transform: translateY(-50%)"
                        onclick="${gvc.event(() => {
                          newOrder.productCheck.splice(index, 1);
                          gvc.notifyDataChange('listProduct');
                        })}"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                          <path
                            d="M1.51367 9.24219L9.99895 0.756906"
                            stroke="#DDDDDD"
                            stroke-width="1.3"
                            stroke-linecap="round"
                          />
                          <path
                            d="M9.99805 9.24219L1.51276 0.756907"
                            stroke="#DDDDDD"
                            stroke-width="1.3"
                            stroke-linecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                `;
              });
            }
            return returnHTML;
          },
          divCreate: {
            style: `display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;`,
          },
        })}
        ${gvc.bindView({
          bind: 'addProduct',
          view: () => {
            return BgWidget.plusButton({
              title: '新增一個商品',
              event: gvc.event(() => {
                BgWidget.dialog({
                  gvc,
                  title: '選擇商品種類',
                  innerHTML: gvc => {
                    const buttonHTML = [
                      { title: '一般商品', value: 'product' },
                      { title: '加購品', value: 'addProduct' },
                      { title: '贈品', value: 'giveaway' },
                      { title: '隱形商品', value: 'hidden' },
                    ]
                      .map(item => {
                        return html`<div class="col-6 p-2">
                          ${BgWidget.customButton({
                            button: {
                              color: 'snow',
                              size: 'md',
                              class: 'w-100',
                              style: 'min-height: 60px;',
                            },
                            text: {
                              name: item.title,
                            },
                            event: gvc.event(() => {
                              gvc.closeDialog();
                              productDialog(item.value);
                            }),
                          })}
                        </div>`;
                      })
                      .join('');
                    return html`<div class="row px-1">${buttonHTML}</div>`;
                  },
                });

                function productDialog(type: string) {
                  let confirm = true;
                  return (window.parent as any).glitter.innerDialog(
                    (gvc: GVC) => {
                      newOrder.query = '';
                      newOrder.search = '';
                      newOrder.productArray = [];
                      return gvc.bindView({
                        bind: 'addDialog',
                        view: () => {
                          let width = window.innerWidth > 1000 ? 690 : 350;
                          let searchLoading: any = false;

                          return html` <div
                            style="display: flex;width: ${width}px;flex-direction: column;align-items: flex-start;gap: 18px;border-radius: 10px;background: #FFF;"
                          >
                            <div
                              class="w-100"
                              style="display: flex;height: 46px;padding: 20px 20px 12px;align-items: center;align-self: stretch;color: #393939;font-size: 16px;font-weight: 700;"
                            >
                              搜尋商品
                            </div>
                            <div
                              class="w-100"
                              style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;"
                            >
                              <div
                                class="w-100"
                                style="display: flex;padding: 0px 24px;flex-direction: column;align-items: center;gap: 18px;"
                              >
                                <div
                                  style="display: flex;justify-content: center;align-items: flex-start;gap: 12px;align-self: stretch;"
                                >
                                  <div class="w-100 position-relative">
                                    <i
                                      class="fa-regular fa-magnifying-glass"
                                      style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);"
                                      aria-hidden="true"
                                    ></i>
                                    <input
                                      class="form-control h-100"
                                      style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;"
                                      placeholder="輸入商品名稱或商品貨號"
                                      oninput="${gvc.event(e => {
                                        searchLoading = false;
                                        newOrder.query = e.value;
                                        newOrder.productArray = [];
                                        gvc.notifyDataChange('productArray');
                                      })}"
                                      value="${newOrder.query ?? ''}"
                                    />
                                  </div>
                                  ${BgWidget.updownFilter({
                                    gvc,
                                    callback: (value: any) => {
                                      searchLoading = false;
                                      newOrder.orderString = value;
                                      newOrder.productArray = [];
                                      gvc.notifyDataChange('productArray');
                                    },
                                    default: newOrder.orderString || 'default',
                                    options: FilterOptions.productOrderBy,
                                  })}
                                </div>
                                <div
                                  style="height:350px;display: flex;justify-content: center;align-items: flex-start;padding-right: 24px;align-self: stretch;overflow-y: scroll;"
                                >
                                  ${gvc.bindView({
                                    bind: 'productArray',
                                    view: () => {
                                      if (!searchLoading) {
                                        ApiShop.getProduct({
                                          page: 0,
                                          limit: 50,
                                          search: newOrder.query,
                                          orderBy: newOrder.orderString,
                                          status: 'inRange',
                                          filter_visible: `${type !== 'hidden'}`,
                                          productType: type === 'hidden' ? 'product' : type,
                                        }).then(data => {
                                          searchLoading = true;
                                          newOrder.productArray = data.response.data;
                                          gvc.notifyDataChange('productArray');
                                        });
                                        return BgWidget.spinner();
                                      }
                                      if (newOrder.productArray.length == 0) {
                                        return html` <div
                                          class="w-100 h-100 d-flex align-items-center justify-content-center"
                                          style="color:#8D8D8D;"
                                        >
                                          查無此商品
                                        </div>`;
                                      }
                                      return newOrder.productArray
                                        .map((product: any, productIndex: number) => {
                                          return gvc.bindView({
                                            bind: `product${productIndex}`,
                                            view: () => {
                                              return html`
                                                ${(() => {
                                                  if (product.select) {
                                                    return html` <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      viewBox="0 0 16 16"
                                                      fill="none"
                                                      onclick="${gvc.event(() => {
                                                        product.select = false;
                                                        gvc.notifyDataChange(`product${productIndex}`);
                                                      })}"
                                                    >
                                                      <rect width="16" height="16" rx="3" fill="#393939" />
                                                      <path
                                                        d="M4.5 8.5L7 11L11.5 5"
                                                        stroke="white"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      />
                                                    </svg>`;
                                                  } else {
                                                    return html`
                                                      <div
                                                        style="display: flex;align-items: center;justify-content: center;height: 60px;width: 16px;cursor: pointer;"
                                                        onclick="${gvc.event(() => {
                                                          product.select = true;
                                                          if (product.content.variants.length > 1) {
                                                            product.selectIndex = (
                                                              (window.parent as any).document.querySelector(
                                                                '.varitantSelect'
                                                              ) as HTMLInputElement
                                                            ).value;
                                                          }
                                                          gvc.notifyDataChange(`product${productIndex}`);
                                                        })}"
                                                      >
                                                        <div
                                                          style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;"
                                                        ></div>
                                                      </div>
                                                    `;
                                                  }
                                                })()}
                                                <div
                                                  style="width: 50px;height: 50px;border-radius: 5px;background: url('${product
                                                    .content.preview_image[0]}') lightgray 50% / cover no-repeat;"
                                                ></div>
                                                <div class="flex-fill d-flex flex-column">
                                                  <div
                                                    style="color:#393939;font-size: 14px;font-weight: 400;margin-bottom: 4px;"
                                                  >
                                                    ${product.content.title}
                                                  </div>
                                                  ${product.content.variants.length > 1
                                                    ? html`
                                                        <select
                                                          class="w-100 d-flex align-items-center form-select varitantSelect"
                                                          style="border-radius: 10px;border: 1px solid #DDD;padding: 6px 18px;"
                                                          onchange="${gvc.event(e => {
                                                            product.selectIndex = e.value;
                                                          })}"
                                                        >
                                                          ${product.content.variants
                                                            .map((variant: any, index: number) => {
                                                              return html`
                                                                <option
                                                                  value="${index}"
                                                                  ${product.selectIndex == index ? 'selected' : ''}
                                                                >
                                                                  ${variant.spec.join(', ')}
                                                                </option>
                                                              `;
                                                            })
                                                            .join('')}
                                                        </select>
                                                      `
                                                    : html` <div
                                                        class="d-flex align-items-center"
                                                        style="height: 34px;color: #8D8D8D;font-size: 14px;font-weight: 400;"
                                                      >
                                                        單一規格
                                                      </div>`}
                                                </div>
                                              `;
                                            },
                                            divCreate: {
                                              style: `
                                                display: flex;
                                                padding: 0px 12px;
                                                align-items: center;
                                                gap: 18px;
                                                align-self: stretch;
                                              `,
                                            },
                                          });
                                        })
                                        .join('');
                                    },
                                    divCreate: {
                                      class: `d-flex flex-column h-100`,
                                      style: `gap: 18px;width:100%;`,
                                    },
                                  })}
                                </div>
                              </div>
                              <div
                                class="w-100"
                                style="display: flex;padding: 12px 20px;align-items: center;justify-content: end;gap: 10px;"
                              >
                                ${BgWidget.cancel(
                                  gvc.event(() => {
                                    confirm = false;
                                    gvc.closeDialog();
                                  })
                                )}
                                ${BgWidget.save(
                                  gvc.event(() => {
                                    confirm = true;
                                    newOrder.productTemp = [];
                                    newOrder.productArray.map((product: any) => {
                                      if (product.select) {
                                        if (type === 'giveaway') {
                                          product.content.variants.forEach((item: any) => (item.sale_price = 0));
                                        }
                                        newOrder.productTemp.push(product);
                                      }
                                    });
                                    gvc.closeDialog();
                                  })
                                )}
                              </div>
                            </div>
                          </div>`;
                        },
                      });
                    },
                    'addProduct',
                    {
                      dismiss: () => {
                        if (confirm) {
                          orderDetailRefresh = true;
                          if (newOrder.productCheck.length > 0) {
                            const updateProductCheck = (tempData: any) => {
                              const productData = newOrder.productCheck.find((p: any) => {
                                return p.id === tempData.id && p.selectIndex === tempData.selectIndex;
                              });
                              if (productData) {
                                const index = parseInt(productData.selectIndex ?? '0', 10);
                                productData.content.variants[index].qty++;
                                tempData.add = true;
                              } else {
                                newOrder.productCheck.push(tempData);
                              }
                            };

                            newOrder.productTemp.forEach(updateProductCheck);
                          } else {
                            newOrder.productCheck = newOrder.productTemp;
                          }

                          gvc.notifyDataChange(['listProduct', 'addProduct']);
                        }
                      },
                    }
                  );
                }
              }),
            });
          },
          divCreate: {
            style: 'width: 100%; display: flex; align-items: center; margin: 24px 0;',
          },
        })}
        ${BgWidget.horizontalLine({ margin: 0.5 })} ${showOrderDetail()}
      </div>
      <!-- 選擇顧客 --- 顧客資料填寫 -->
      <div style="margin-top: 24px"></div>
      ${BgWidget.mainCard(
        gvc.bindView({
          bind: 'userBlock',
          dataList: [{ obj: customerData, key: 'type' }],
          view: () => {
            customerData.info.searchable = true;
            let checkBox = html` <div
              style="display: flex;width: 16px;height: 16px;justify-content: center;align-items: center;border-radius: 20px;border: solid 4px #393939"
            ></div>`;
            let uncheckBox = html` <div
              style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"
            ></div>`;

            function syncUserData() {
              if (CVSCheck) {
                return;
              }
              orderDetail.user_info.name = tempUserData[customerData.type].name;
              orderDetail.user_info.phone = tempUserData[customerData.type].phone;
              orderDetail.user_info.email = tempUserData[customerData.type].email;
            }

            syncUserData();
            return html`
              <div class="tx_700">顧客資料 ${BgWidget.requiredStar()}</div>
              <div class="d-flex flex-column">
                ${customerData.type == 'auto'
                  ? html`
                      <div class="d-flex align-items-center" style="cursor: pointer;">
                        ${checkBox}
                        <div style="margin-left: 6px">現有的顧客</div>
                      </div>
                      <div
                        class="d-flex align-items-center position-relative"
                        style="min-height:40px;padding-left: 22px;margin-top: 8px;"
                      >
                        <div
                          style="height: 100%;width:1px;background-color: #E5E5E5;position: absolute;left: 8px;top: 0;"
                        ></div>
                        <div class="position-relative w-100 d-flex flex-column">
                          <div class="bg-white" style="gap: 14px;">
                            ${(() => {
                              const inView: string[] = [
                                html` <div class="d-flex align-items-center" style="gap:14px;">
                                  <div
                                    style="flex:1;height: 44px; padding: 8px 18px;border-radius: 10px; border: 1px #DDDDDD solid; justify-content: center; align-items: center; gap: 8px; display: inline-flex;cursor:pointer;"
                                    onclick="${gvc.event(() => {
                                      BgWidget.selectDropDialog({
                                        gvc: gvc,
                                        title: '搜尋特定顧客',
                                        tag: 'select_users',
                                        updownOptions: FilterOptions.userOrderBy,
                                        callback: () => {},
                                        custom_line_items: (data: any) => {
                                          return html` <div
                                            class="w-100 border-bottom pb-3"
                                            style="padding-left: 8px; padding-right: 8px; background: white;  justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex;cursor: pointer;"
                                            onclick="${gvc.event(() => {
                                              orderDetail.customer_info.name = data.user_data.name;
                                              orderDetail.customer_info.email = data.user_data.email;
                                              orderDetail.customer_info.phone = data.user_data.phone;
                                              gvc.notifyDataChange('userBlock');
                                              gvc.glitter.closeDiaLog('select_users');
                                            })}"
                                          >
                                            <div
                                              style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex"
                                            >
                                              <div
                                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 6px; display: inline-flex"
                                              >
                                                <div
                                                  style="color: #393939; font-size: 20px;  font-weight: 400; word-wrap: break-word"
                                                >
                                                  ${data.user_data.name}
                                                </div>
                                              </div>
                                              <div
                                                style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex"
                                              >
                                                <div
                                                  style="align-self: stretch; color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                >
                                                  ${data.user_data.phone || ''}
                                                </div>
                                                <div
                                                  style="align-self: stretch; color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                >
                                                  ${data.user_data.email}
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              style="padding: 4px 10px;background: #393939; border-radius: 7px; justify-content: center; align-items: center; gap: 10px; display: flex"
                                            >
                                              <div
                                                style="color: white; font-size: 16px;  font-weight: 700; word-wrap: break-word"
                                              >
                                                ${data.tag_name}
                                              </div>
                                            </div>
                                          </div>`;
                                        },
                                        default: [''],
                                        single: true,
                                        api: (data: { query: string; orderString: string }) => {
                                          return new Promise(resolve => {
                                            ApiUser.getUserList({
                                              page: 0,
                                              limit: 99999,
                                              search: data.query,
                                              only_id: true,
                                            }).then(dd => {
                                              if (dd.response.data) {
                                                resolve(
                                                  dd.response.data.map(
                                                    (item: {
                                                      userID: number;
                                                      userData: {
                                                        name: string;
                                                        email: string;
                                                      };
                                                    }) => {
                                                      return {
                                                        key: item.userID,
                                                        value: item.userData.name ?? '（尚無姓名）',
                                                        note: item.userData.email,
                                                        user_data: item.userData,
                                                        tag_name: (item as any).tag_name,
                                                      };
                                                    }
                                                  )
                                                );
                                              }
                                            });
                                          });
                                        },
                                        style: 'width: 100%;',
                                      });
                                    })}"
                                  >
                                    <div
                                      style="flex: 1 1 0; height: 22px; justify-content: center; align-items: center; gap: 8px; display: flex"
                                    >
                                      <i class="fa-solid fa-magnifying-glass" style="color: #8D8D8D;"></i>
                                      <div
                                        style="flex: 1 1 0; color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                      >
                                        搜尋會員信箱 / 電話 / 編號
                                      </div>
                                    </div>
                                  </div>
                                </div>`,
                              ];
                              if (orderDetail.customer_info.email || orderDetail.customer_info.phone) {
                                inView.push(
                                  gvc.bindView(() => {
                                    const vm: {
                                      loading: boolean;
                                      id: string;
                                      user_data: any;
                                      rebate: number;
                                    } = {
                                      loading: true,
                                      id: gvc.glitter.getUUID(),
                                      user_data: {},
                                      rebate: 0,
                                    };
                                    ApiUser.getUsersDataWithEmailOrPhone(
                                      orderDetail.customer_info.email || orderDetail.customer_info.phone
                                    ).then(res => {
                                      vm.user_data = res.response;
                                      vm.loading = false;
                                      ApiUser.getUserRebate({ id: vm.user_data.userID }).then(res => {
                                        vm.rebate = res.response.data.point;
                                        gvc.notifyDataChange(vm.id);
                                      });
                                    });
                                    return {
                                      bind: vm.id,
                                      view: () => {
                                        try {
                                          if (vm.loading) {
                                            return html` <div
                                              class="w-100 d-flex align-items-center justify-content-center"
                                            >
                                              <div class="spinner-border"></div>
                                            </div>`;
                                          } else {
                                            return html` <div
                                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 6px; display: inline-flex"
                                              >
                                                <div
                                                  class="d-flex align-items-center"
                                                  style="flex: 1 1 0; color: #393939; font-size: 24px;  font-weight: 400; word-wrap: break-word;gap:10px;"
                                                >
                                                  ${vm.user_data.userData.name}
                                                </div>
                                                <div
                                                  style="width: 68px; padding-left: 6px; padding-right: 6px; padding-top: 4px; padding-bottom: 4px; background: #393939; border-radius: 7px; justify-content: center; align-items: center; gap: 10px; display: flex"
                                                >
                                                  <div
                                                    style="color: white; font-size: 14px;  font-weight: 700; word-wrap: break-word"
                                                  >
                                                    ${vm.user_data.member_level.tag_name}
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                style="align-self: stretch;  flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 6px; display: flex"
                                              >
                                                ${[
                                                  {
                                                    title: '會員編號',
                                                    value: vm.user_data.userID,
                                                  },
                                                  {
                                                    title: '會員生日',
                                                    value: vm.user_data.userData.birth || '未填寫',
                                                  },
                                                  {
                                                    title: '會員電話',
                                                    value: vm.user_data.userData.phone || '未填寫',
                                                  },
                                                  {
                                                    title: '會員信箱',
                                                    value: vm.user_data.userData.email || '未填寫',
                                                  },
                                                  {
                                                    title: '會員地址',
                                                    value: vm.user_data.userData.address || '未填寫',
                                                  },
                                                  {
                                                    title: '持有購物金',
                                                    value: `${vm.rebate.toLocaleString()}點`,
                                                  },
                                                  ...(() => {
                                                    const leadData = JSON.parse(JSON.stringify(vm.user_data.member))
                                                      .reverse()
                                                      .find((dd: any) => {
                                                        return !dd.trigger;
                                                      });
                                                    if (leadData) {
                                                      return [
                                                        {
                                                          title: (() => {
                                                            return html`
                                                              <div
                                                                style=" flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex"
                                                              >
                                                                升等條件
                                                                <div
                                                                  style="color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                                >
                                                                  ${(() => {
                                                                    const condition_val =
                                                                      leadData.og.condition.value.toLocaleString();
                                                                    if (leadData.og.condition.type === 'total') {
                                                                      if (leadData.og.duration.type === 'noLimit') {
                                                                        return `*累積消費額達${condition_val}`;
                                                                      } else {
                                                                        return `*${leadData.og.duration.value}天內累積消費額達${condition_val}`;
                                                                      }
                                                                    } else {
                                                                      return `*單筆消費達${condition_val}`;
                                                                    }
                                                                  })()}
                                                                </div>
                                                              </div>
                                                            `;
                                                          })(),
                                                          value: `還差${(leadData.leak ?? 0).toLocaleString()}`,
                                                        },
                                                      ];
                                                    } else {
                                                      return [];
                                                    }
                                                  })(),
                                                  ...(() => {
                                                    if (
                                                      vm.user_data.member_level.dead_line &&
                                                      vm.user_data.member_level.re_new_member
                                                    ) {
                                                      return [
                                                        {
                                                          title: (() => {
                                                            return html`
                                                              <div
                                                                style=" flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex"
                                                              >
                                                                續等條件
                                                                <div
                                                                  style="color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                                >
                                                                  ${(() => {
                                                                    const leadData = JSON.parse(
                                                                      JSON.stringify(
                                                                        vm.user_data.member_level.re_new_member
                                                                      )
                                                                    );
                                                                    const condition_val =
                                                                      leadData.og.condition.value.toLocaleString();
                                                                    if (leadData.og.condition.type === 'total') {
                                                                      if (leadData.og.duration.type === 'noLimit') {
                                                                        return `*累積消費額達${condition_val}`;
                                                                      } else {
                                                                        return `*${leadData.og.duration.value}天內累積消費額達${condition_val}`;
                                                                      }
                                                                    } else {
                                                                      return `*單筆消費達${condition_val}`;
                                                                    }
                                                                  })()}
                                                                </div>
                                                              </div>
                                                            `;
                                                          })(),
                                                          value: (() => {
                                                            if (!vm.user_data.member_level.re_new_member.leak) {
                                                              return `已達成`;
                                                            } else {
                                                              return `還差${Number(vm.user_data.member_level.re_new_member.leak).toLocaleString()}`;
                                                            }
                                                          })(),
                                                        },
                                                      ];
                                                    } else {
                                                      return [];
                                                    }
                                                  })(),
                                                  {
                                                    title: '會員備註',
                                                    value: vm.user_data.userData.note || '無',
                                                  },
                                                ]
                                                  .map(dd => {
                                                    return html` <div
                                                      style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 2px; display: flex"
                                                    >
                                                      <div
                                                        style="color: #393939; font-size: 18px;  font-weight: 400; word-wrap: break-word;min-width: 113px;"
                                                      >
                                                        ${dd.title}
                                                      </div>
                                                      <div class="flex-fill"></div>
                                                      <div
                                                        style="color: #393939; font-size: 18px;  font-weight: 400; word-break: break-all;white-space: normal;text-align: right;"
                                                      >
                                                        ${dd.value}
                                                      </div>
                                                    </div>`;
                                                  })
                                                  .join('')}
                                              </div>`;
                                          }
                                        } catch (e) {
                                          console.error(e);
                                          return `${e}`;
                                        }
                                      },
                                      divCreate: {
                                        class: `w-100 my-3`,
                                        style: `padding: 20px; border-radius: 10px; border: 1px #DDDDDD solid; flex-direction: column; justify-content: flex-start; align-items: flex-end; gap: 18px; display: inline-flex;`,
                                      },
                                    };
                                  })
                                );
                              }
                              return inView.join('');
                            })()}
                          </div>
                        </div>
                      </div>
                    `
                  : html` <div
                      class="d-flex align-items-center"
                      style="margin-bottom: 12px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                        if (customerData.type == 'manual') {
                          orderDetail.user_info = {
                            CVSAddress: '',
                            CVSStoreID: '',
                            CVSStoreName: '',
                            CVSTelephone: '',
                            MerchantTradeNo: '',
                            address: '',
                            email: '',
                            name: '',
                            note: '',
                            phone: '',
                            shipment: 'normal',
                          };
                        }

                        customerData.type = 'auto';
                        customerData.sameCustomer = false;
                        gvc.notifyDataChange('setLogistics');
                      })}"
                    >
                      ${uncheckBox}
                      <div style="margin-left: 6px">現有的顧客</div>
                    </div>`}
                ${customerData.type == 'manual'
                  ? html`
                      <div class="d-flex align-items-center" style="cursor: pointer;">
                        ${checkBox}
                        <div style="margin-left: 6px">手動加入顧客</div>
                      </div>
                      <div
                        class="d-flex align-items-center position-relative"
                        style="min-height:40px;padding-left: 22px;margin-top: 8px;"
                      >
                        <div
                          style="height: 100%;width:1px;background-color: #E5E5E5;position: absolute;left: 8px;top: 0;"
                        ></div>
                        <div class="position-relative w-100 d-flex flex-column" style="gap:8px;">
                          ${[
                            BgWidget.editeInput({
                              gvc: gvc,
                              title: '姓名',
                              default: orderDetail.customer_info.name,
                              placeHolder: '請輸入姓名',
                              callback: dd => {
                                orderDetail.customer_info.name = dd;
                              },
                              type: 'name',
                            }),
                            BgWidget.editeInput({
                              gvc: gvc,
                              title: '電話',
                              type: 'phone',
                              default: orderDetail.customer_info.phone,
                              placeHolder: '請輸入電話',
                              callback: dd => {
                                ApiUser.getPhoneCount(dd).then(r => {
                                  if (r.response.result) {
                                    dialog.errorMessage({ text: '此電話已經被註冊' });
                                    gvc.notifyDataChange('userBlock');
                                  } else {
                                    orderDetail.customer_info.phone = dd;
                                  }
                                });
                              },
                            }),
                            BgWidget.editeInput({
                              gvc: gvc,
                              title: '電子信箱',
                              type: 'email',
                              default: orderDetail.customer_info.email,
                              placeHolder: '請輸入電子信箱',
                              callback: dd => {
                                ApiUser.getEmailCount(dd).then(r => {
                                  if (r.response.result) {
                                    dialog.errorMessage({ text: '此信箱已經被註冊' });
                                    gvc.notifyDataChange('userBlock');
                                  } else {
                                    orderDetail.customer_info.email = dd;
                                  }
                                });
                              },
                            }),
                          ].join('')}
                        </div>
                      </div>
                    `
                  : html` <div
                      class="d-flex align-items-center"
                      style="margin-top: 12px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                        if (customerData.type == 'auto') {
                          orderDetail.user_info = {
                            CVSAddress: '',
                            CVSStoreID: '',
                            CVSStoreName: '',
                            CVSTelephone: '',
                            MerchantTradeNo: '',
                            address: '',
                            email: '',
                            name: '',
                            note: '',
                            phone: '',
                            shipment: 'normal',
                          };
                        }

                        customerData.type = 'manual';
                        customerData.sameCustomer = false;
                        gvc.notifyDataChange(['setLogistics']);
                      })}"
                    >
                      ${uncheckBox}
                      <div style="margin-left: 6px;">手動加入顧客</div>
                    </div>`}
              </div>
            `;
          },
          divCreate: { class: `d-flex flex-column`, style: `gap:18px;` },
        })
      )}
      <!-- 設定金物流 --- 顧客運送資料和付款方式 -->
      <div style="margin-top: 24px"></div>
      ${BgWidget.mainCard(
        gvc.bindView({
          bind: 'setLogistics',
          view: async () => {
            orderDetail.pay_status = '0';
            return html`
              <div class="tx_700">設定金物流</div>
              <div class="d-flex flex-column" style="gap: 18px">
                <div class="d-flex align-items-center w-100" style="gap:18px;">
                  <div class="row w-100">
                    ${[
                      BgWidget.select({
                        gvc: gvc,
                        callback: dd => {
                          orderDetail.customer_info.payment_select = dd;
                        },
                        title: `付款方式 ${BgWidget.requiredStar()}`,
                        default: orderDetail.customer_info.payment_select ?? '',
                        options: (await PaymentConfig.getSupportPayment()).map(dd => {
                          return { key: dd.key, value: dd.name };
                        }),
                      }),
                      BgWidget.select({
                        gvc: gvc,
                        title: `配送方式 ${BgWidget.requiredStar()}`,
                        callback: dd => {
                          orderDetail.user_info.shipment = dd;
                          orderDetailRefresh = true;
                          gvc.notifyDataChange(['listProduct', 'orderDetail']);
                        },
                        default: orderDetail.user_info.shipment,
                        options: (await ShipmentConfig.shipmentMethod({ type: 'support' })).map(dd => {
                          return { key: dd.key, value: dd.name };
                        }),
                      }),
                    ]
                      .map(dd => {
                        return html` <div class="col-12 col-lg-6">${dd}</div>`;
                      })
                      .join('')}
                  </div>
                </div>

                <div class="tx_700">收件人資料</div>
                <div
                  class="d-flex align-items-center"
                  style="gap:6px;cursor: pointer;"
                  onclick="${gvc.event(() => {
                    customerData.sameCustomer = !customerData.sameCustomer;
                    if (customerData.sameCustomer) {
                      orderDetail.user_info.name = orderDetail.customer_info.name || orderDetail.user_info.name;
                      orderDetail.user_info.phone = orderDetail.customer_info.phone || orderDetail.user_info.phone;
                      orderDetail.user_info.email = orderDetail.customer_info.email || orderDetail.user_info.email;
                    }
                    gvc.notifyDataChange('setLogistics');
                  })}"
                >
                  ${customerData.sameCustomer
                    ? html` <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <rect width="16" height="16" rx="3" fill="#393939" />
                        <path
                          d="M4.5 8.5L7 11L11.5 5"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>`
                    : html` <div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;"></div>`}
                  同顧客資料
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  <div>姓名 ${BgWidget.requiredStar()}</div>
                  <input
                    style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                    value="${orderDetail.user_info.name ?? ''}"
                    placeholder="請輸入姓名"
                    onchange="${gvc.event(e => {
                      orderDetail.user_info.name = e.value;
                    })}"
                    ${customerData.sameCustomer ? 'disabled' : ''}
                  />
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  <div>電話 ${BgWidget.requiredStar()}</div>
                  <input
                    style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                    value="${orderDetail.user_info.phone ?? ''}"
                    placeholder="請輸入電話"
                    onchange="${gvc.event(e => {
                      orderDetail.user_info.phone = e.value;
                    })}"
                  />
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  <div>電子信箱 ${BgWidget.requiredStar()}</div>
                  <input
                    style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                    value="${orderDetail.customer_info.email ?? ''}"
                    placeholder="請輸入電子信箱"
                    onchange="${gvc.event(e => {
                      orderDetail.customer_info.email = e.value;
                    })}"
                    ${customerData.sameCustomer ? 'disabled' : ''}
                  />
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  ${gvc.bindView({
                    bind: 'CVSStore',
                    dataList: [{ obj: orderDetail.user_info, key: 'shipment' }],
                    view: () => {
                      if (ShipmentConfig.supermarketList.includes(orderDetail.user_info?.shipment)) {
                        let returnHTML = '';
                        if (orderDetail.user_info!.CVSStoreID) {
                          returnHTML = html`
                            <div class="d-flex flex-column">
                              ${[
                                html` <div class="d-flex align-items-center pt-2">
                                  <img
                                    style="width: 23px;height: 23px;margin-right: 8px;"
                                    src="${ShipmentConfig.list.find(dd => {
                                      return dd.value === orderDetail.user_info.shipment;
                                    })?.src}"
                                    alt="icon"
                                  />
                                  <div
                                    style="color:#4D86DB"
                                    onclick="${gvc.event(() => {
                                      selectCVS(orderDetail.user_info.shipment);
                                    })}"
                                  >
                                    點擊更換門市
                                  </div>
                                </div>`,
                                html` <div class="d-flex">門市名稱: ${orderDetail.user_info.CVSStoreName}</div>`,
                                html` <div class="d-flex">門市店號: ${orderDetail.user_info.CVSStoreID}</div>`,
                                html` <div class="d-flex">門市地址: ${orderDetail.user_info.CVSAddress}</div>`,
                              ].join(html` <div class="my-2 w-100 border-top"></div>`)}
                            </div>
                          `;
                          return html`
                            <div>配送門市 ${BgWidget.requiredStar()}</div>
                            ${returnHTML}
                          `;
                        } else {
                          return html`
                            <div>配送門市 ${BgWidget.requiredStar()}</div>
                            <div
                              style="color: #4D86DB;cursor: pointer;margin-top:8px;cursor: pointer"
                              onclick="${gvc.event(() => {
                                selectCVS(orderDetail.user_info.shipment);
                              })}"
                            >
                              請選擇配送門市
                            </div>
                          `;
                        }
                      } else {
                        return html`
                          <div>宅配地址 ${BgWidget.requiredStar()}</div>
                          <input
                            style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;margin-top:8px;width: 100%;"
                            value="${orderDetail.user_info!.address ?? ''}"
                            placeholder="請輸入宅配地址"
                            onchange="${gvc.event(e => {
                              orderDetail.user_info!.address = e.value;
                            })}"
                          />
                        `;
                      }
                    },
                  })}
                </div>
              </div>
            `;
          },
          divCreate: {
            class: `d-flex flex-column`,
            style: `color:#393939;gap:18px;`,
          },
        })
      )}
      <div style="margin-top: 24px"></div>
      ${BgWidget.mainCard(html`
        <div class="d-flex flex-column" style="gap: 8px">
          <div class="tx_700">訂單備註</div>
          <textarea
            style="cursor: pointer;height: 80px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
            onchange="${gvc.event(e => {
              orderDetail.user_info!.note = e.value;
            })}"
          ></textarea>
        </div>
      `)}
      ${BgWidget.mbContainer(240)}
      <div class="update-bar-container">
        ${BgWidget.cancel(
          gvc.event(() => {
            vm.type = 'list';
          })
        )}
        ${BgWidget.save(
          gvc.event(() => {
            let passData = JSON.parse(JSON.stringify(orderDetail));
            passData.total = orderDetail.total;
            passData.orderStatus = 1;
            delete passData.tag;
            passData.line_items = passData.lineItems;
            dialog.dataLoading({ visible: true });
            if (checkOrderEmpty(passData)) {
              ApiShop.toManualCheckout(passData).then(() => {
                dialog.dataLoading({ visible: false });
                dialog.successMessage({
                  text: `訂單新增成功<br />已將訂單明細發送至顧客信箱`,
                });
                setTimeout(() => {
                  vm.type = 'list';
                }, 1200);
              });
            } else {
              dialog.dataLoading({ visible: false });
            }
          })
        )}
      </div>
    `);
  }
}

(window as any).glitter.setModule(import.meta.url, ShoppingOrderManager);
