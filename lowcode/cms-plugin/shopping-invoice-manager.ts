import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { Tool } from '../modules/tool.js';
import { ShoppingAllowanceManager } from './shopping-allowance-manager.js';
import { IminModule } from './pos-pages/imin-module.js';
import { TableStorage } from './module/table-storage.js';

interface ViewModel {
  id: string;
  filterId: string;
  type: 'list' | 'add' | 'replace' | 'viewAllowance';
  data: any;
  dataList: any;
  query?: string;
  queryType?: string;
  orderString?: string;
  filter?: any;
  filter_type: 'normal' | 'block' | 'pos';
  listLimit: number;
}

const html = String.raw;

export class ShoppingInvoiceManager {
  public static supportShipmentMethod() {
    return [
      {
        title: '門市立即取貨',
        value: 'now',
        name: '',
      },
      {
        title: '一般宅配',
        value: 'normal',
        name: '',
      },
      {
        title: '全家店到店',
        value: 'FAMIC2C',
        name: '',
      },
      {
        title: '萊爾富店到店',
        value: 'HILIFEC2C',
        name: '',
      },
      {
        title: 'OK超商店到店',
        value: 'OKMARTC2C',
        name: '',
      },
      {
        title: '7-ELEVEN超商交貨便',
        value: 'UNIMARTC2C',
        name: '',
      },
      {
        title: '實體門市取貨',
        value: 'shop',
        name: '',
      },
    ].map(dd => {
      dd.name = dd.title;
      return dd;
    });
  }

  public static main(
    gvc: GVC,
    query: {
      isPOS?: boolean;
      isArchived?: boolean;
    }
  ) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);
    query.isArchived = Boolean(query.isArchived);

    const vm: ViewModel = {
      id: glitter.getUUID(),
      type: 'list',
      data: {},
      dataList: undefined,
      query: '',
      queryType: '',
      orderString: '',
      filter: {},
      filterId: glitter.getUUID(),
      filter_type: query.isPOS ? 'pos' : 'normal',
      listLimit: TableStorage.getLimit(),
    };
    const ListComp = new BgListComponent(gvc, vm, FilterOptions.invoiceFilterFrame);
    vm.filter = ListComp.getFilterObject();

    gvc.addMtScript(
      [{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }],
      () => {},
      () => {}
    );

    function exportDataTo(firstRow: string[], data: any) {
      if ((window as any).XLSX) {
        // 將資料轉換成工作表
        let XLSX = (window as any).XLSX;
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.sheet_add_aoa(worksheet, [firstRow], { origin: 'A1' });

        // 建立一個新的工作簿
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 將工作簿轉換成二進制數據
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

        // 將二進制數據轉換成 Blob 物件
        function s2ab(s: any) {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        }

        // 建立 Blob 物件

        const saasConfig: { config: any; api: any } = (window as any).saasConfig;
        const fileName = `訂單列表_${glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`;
        saasConfig.api.uploadFile(fileName).then((data: any) => {
          const blobData = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
          const data1 = data.response;
          dialog.dataLoading({ visible: true });
          $.ajax({
            url: data1.url,
            type: 'put',
            data: blobData,
            processData: false,
            headers: {
              'Content-Type': data1.type,
            },
            crossDomain: true,
            success: () => {
              dialog.dataLoading({ visible: false });
              const link = document.createElement('a');
              link.href = data1.fullUrl;
              link.download = fileName;
              link.click();
            },
            error: () => {
              dialog.dataLoading({ visible: false });
              dialog.errorMessage({ text: '上傳失敗' });
            },
          });
        });
      }
    }

    return gvc.bindView({
      bind: vm.id,
      dataList: [{ obj: vm, key: 'type' }],
      view: () => {
        if (vm.type === 'list') {
          return BgWidget.container(html`
            <div class="title-container">
              ${BgWidget.title('發票列表')}
              <div class="flex-fill"></div>
              <div style="display: flex; gap: 14px;">
                ${BgWidget.grayButton(
                  '匯出',
                  gvc.event(() => {
                    const limit = 1000;
                    dialog.warningMessage({
                      text: `系統將以目前列表搜尋的訂單結果匯出<br />最多匯出${limit}筆資料，是否匯出？`,
                      callback: bool => {
                        if (bool) {
                          dialog.dataLoading({ visible: true });
                          ApiShop.getInvoice({
                            page: 0,
                            limit: limit,
                            search: vm.query || undefined,
                            searchType: vm.queryType || 'order_number',
                            orderString: vm.orderString,
                            filter: vm.filter,
                          }).then(res => {
                            dialog.dataLoading({ visible: false });
                            if (!res.result) {
                              dialog.errorMessage({ text: '訂單資料讀取錯誤' });
                            }
                            const exportData: any = [];
                            const firstRow = [
                              // value by order
                              '訂單編號',
                              '訂單來源',
                              '訂單建立時間',
                              '會員信箱',
                              '訂單處理狀態',
                              '付款狀態',
                              '出貨狀態',
                              '訂單小計',
                              '訂單運費',
                              '訂單使用優惠券',
                              '訂單折扣',
                              '訂單使用購物金',
                              '訂單總計',
                              // value by lineitem
                              '商品名稱',
                              '商品規格',
                              '商品SKU',
                              '商品購買數量',
                              '商品價格',
                              '商品折扣',
                              // value by user
                              '顧客姓名',
                              '顧客手機',
                              '顧客信箱',
                              '收件人姓名',
                              '收件人手機',
                              '收件人信箱',
                              '備註',
                            ];
                            res.response.data.map((order: any) => {
                              const orderData = order.orderData;
                              orderData.lineItems.map((item: any) => {
                                exportData.push({
                                  // value by order
                                  訂單編號: order.cart_token,
                                  訂單來源: orderData.orderSource === 'POS' ? 'POS' : '手動',
                                  訂單建立時間: glitter.ut.dateFormat(
                                    new Date(order.created_time),
                                    'yyyy-MM-dd hh:mm:ss'
                                  ),
                                  會員信箱: order.email ?? 'no-email',
                                  訂單處理狀態: (() => {
                                    switch (orderData.orderStatus ?? '0') {
                                      case '-1':
                                        return '已取消';
                                      case '1':
                                        return '已完成';
                                      case '0':
                                      default:
                                        return '處理中';
                                    }
                                  })(),
                                  付款狀態: (() => {
                                    switch (order.status ?? 0) {
                                      case 1:
                                        return '已付款';
                                      case -1:
                                        return '付款失敗';
                                      case -2:
                                        return '已退款';
                                      case 0:
                                      default:
                                        return '未付款';
                                    }
                                  })(),
                                  出貨狀態: (() => {
                                    switch (orderData.progress ?? 'wait') {
                                      case 'shipping':
                                        return '已出貨';
                                      case 'finish':
                                        return '已取貨';
                                      case 'arrived':
                                        return '已送達';
                                      case 'returns':
                                        return '已退貨';
                                      case 'wait':
                                      default:
                                        return '未出貨';
                                    }
                                  })(),
                                  訂單小計:
                                    orderData.total +
                                    orderData.discount -
                                    orderData.shipment_fee +
                                    orderData.use_rebate,
                                  訂單運費: orderData.shipment_fee,
                                  訂單使用優惠券: orderData.voucherList.map((voucher: any) => voucher.title).join(', '),
                                  訂單折扣: orderData.discount,
                                  訂單使用購物金: orderData.use_rebate,
                                  訂單總計: orderData.total,
                                  // value by lineitem
                                  商品名稱: item.title,
                                  商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
                                  商品SKU: item.sku ?? '',
                                  商品購買數量: item.count,
                                  商品價格: item.sale_price,
                                  商品折扣: item.discount_price,
                                  // value by user
                                  顧客姓名: orderData.customer_info.name,
                                  顧客手機: orderData.customer_info.phone,
                                  顧客信箱: orderData.customer_info.email,
                                  收件人姓名: orderData.user_info.name,
                                  收件人手機: orderData.user_info.phone,
                                  收件人信箱: orderData.user_info.email,
                                  備註: orderData.user_info.note ?? '',
                                });
                              });
                            });
                            exportDataTo(firstRow, exportData);
                          });
                        }
                      },
                    });
                  })
                )}
                ${BgWidget.darkButton(
                  '手動開立發票',
                  gvc.event(() => {
                    vm.type = 'add';
                  })
                )}
              </div>
            </div>
            <div style="margin-top: 24px;"></div>
            ${BgWidget.mainCard(
              [
                (() => {
                  const id = glitter.getUUID();
                  return gvc.bindView({
                    bind: id,
                    view: () => {
                      const filterList = [
                        BgWidget.selectFilter({
                          gvc,
                          callback: (value: any) => {
                            vm.queryType = value;
                            gvc.notifyDataChange(vm.id);
                          },
                          default: vm.queryType || 'order_number',
                          options: FilterOptions.invoiceSelect,
                        }),
                        BgWidget.searchFilter(
                          gvc.event(e => {
                            vm.query = `${e.value}`.trim();
                            gvc.notifyDataChange(vm.id);
                          }),
                          vm.query || '',
                          '搜尋發票'
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
                            ListComp.showRightMenu(FilterOptions.invoiceFunnel);
                          },
                        }),
                        BgWidget.updownFilter({
                          gvc,
                          callback: (value: any) => {
                            vm.orderString = value;
                            gvc.notifyDataChange(vm.id);
                          },
                          default: vm.orderString || 'created_time_desc',
                          options: FilterOptions.invoiceOrderBy,
                        }),
                      ];

                      const filterTags = ListComp.getFilterTags(FilterOptions.invoiceFunnel);
                      return BgListComponent.listBarRWD(filterList, filterTags);
                    },
                  });
                })(),
                BgWidget.tableV3({
                  gvc: gvc,
                  getData: vmi => {
                    ApiShop.getInvoice({
                      page: vmi.page - 1,
                      limit: vm.listLimit,
                      search: vm.query || '',
                      searchType: vm.queryType ?? 'order_number',
                      orderString: vm.orderString,
                      filter: vm.filter,
                    }).then(data => {
                      function getDatalist() {
                        return data.response.data.map((dd: any) => {
                          return [
                            {
                              key: '發票號碼',
                              value: dd.invoice_no,
                            },
                            {
                              key: '訂單編號',
                              value: dd.order_id,
                            },
                            {
                              key: '含稅總計',
                              value: html` <div style="padding-left: 5px;">
                                $ ${dd.invoice_data.original_data.SalesAmount.toLocaleString()}
                              </div>`,
                            },
                            {
                              key: '買受人',
                              value: html` <div style="padding-left: 5px;">
                                ${Tool.truncateString(dd.invoice_data.original_data.CustomerName ?? '', 7)}
                              </div>`,
                            },
                            {
                              key: '發票日期',
                              value: glitter.ut.dateFormat(new Date(dd.create_date), 'yyyy-MM-dd'),
                            },
                            {
                              key: '發票種類',
                              value: (() => {
                                return html`
                                  <div class="d-flex" style="padding-left: 10px;">
                                    ${(() => {
                                      let no = dd.invoice_data.original_data.CustomerIdentifier;
                                      return no && no.length > 0
                                        ? BgWidget.warningInsignia('B2B')
                                        : BgWidget.notifyInsignia('B2C');
                                    })()}
                                  </div>
                                `;
                              })(),
                            },
                            {
                              key: '開立方式',
                              value: (() => {
                                console.log('dd.invoice_data.remark --', dd.invoice_data.remark);
                                switch (dd.invoice_data.remark?.issueType ?? 'auto') {
                                  case 'auto':
                                    return html` <div style="padding-left: 5px;">自動</div>`;
                                  default:
                                    return html` <div style="padding-left: 5px;">手動</div>`;
                                }
                              })(),
                            },
                            {
                              key: '發票狀態',
                              value: (() => {
                                switch (dd.status ?? '0') {
                                  // case -1:
                                  //     return BgWidget.notifyInsignia('已作廢');
                                  // case 0:
                                  //     return BgWidget.warningInsignia('處理中');
                                  case 1:
                                    return BgWidget.infoInsignia('已開立');
                                  case 2:
                                    return BgWidget.notifyInsignia('已作廢');
                                }
                              })(),
                            },
                          ].map((dd: any) => {
                            dd.value = html` <div style="line-height:40px;">${dd.value}</div>`;
                            return dd;
                          });
                        });
                      }

                      vm.dataList = data.response.data;
                      vmi.pageSize = Math.ceil(data.response.total / vm.listLimit);
                      vmi.originalData = vm.dataList;
                      vmi.tableData = getDatalist();
                      vmi.loading = false;
                      vmi.callback();
                    });
                  },
                  rowClick: (data, index) => {
                    vm.data = vm.dataList[index];
                    vm.type = 'replace';
                  },
                  filter: [
                    // 放批量編輯的地方
                  ],
                }),
              ].join('')
            )}
            ${BgWidget.mbContainer(240)}
          `);
        } else if (vm.type == 'replace') {
          return this.replaceOrder(gvc, vm);
        } else if (vm.type == 'add') {
          return this.createOrder(gvc, vm);
        } else if (vm.type == 'viewAllowance') {
          return ShoppingAllowanceManager.replaceOrder(gvc, vm);
        }
        return '';
      },
    });
  }

  public static replaceOrder(gvc: GVC, vm: any, searchOrder?: any) {
    const glitter = gvc.glitter;

    let orderData_: {
      id: number;
      cart_token: string;
      status: number;
      email: string;
      orderData: {
        archived: 'true' | 'false';
        customer_info: any;
        editRecord: any;
        method: string;
        shipment_selector: {
          name: string;
          value: string;
          form: any;
        }[];
        orderStatus: string;
        use_wallet: number;
        email: string;
        total: number;
        discount: number;
        expectDate: string;
        shipment_fee: number;
        use_rebate: number;
        lineItems: {
          id: number;
          spec: string[];
          count: string;
          sale_price: number;
        }[];
        user_info: {
          name: string;
          email: string;
          phone: string;
          address: string;
          custom_form_delivery?: any;
          shipment: 'normal' | 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C';
          CVSStoreName: string;
          CVSStoreID: string;
          CVSTelephone: string;
          MerchantTradeNo: string;
          CVSAddress: string;
          note?: string;
          print_invoice?: string;
          code_note?: string;
          gui_number?: string;
        };
        custom_form_format?: any;
        custom_form_data?: any;
        proof_purchase: any;
        progress: string;
        // progress: 'finish' | 'wait' | 'shipping' | "returns";
        order_note: string;
        voucherList: [
          {
            title: string;
            method: 'percent' | 'fixed';
            trigger: 'auto' | 'code';
            value: string;
            for: 'collection' | 'product';
            rule: 'min_price' | 'min_count';
            forKey: string[];
            ruleValue: number;
            startDate: string;
            startTime: string;
            endDate?: string;
            endTime?: string;
            status: 0 | 1 | -1;
            type: 'voucher';
            code?: string;
            overlay: boolean;
            bind?: {
              id: string;
              spec: string[];
              count: number;
              sale_price: number;
              collection: string[];
              discount_price: number;
            }[];
            start_ISO_Date: string;
            end_ISO_Date: string;
          },
        ];
        deliveryData: Record<string, string>;
      };
      created_time: string;
    };
    const mainViewID = gvc.glitter.getUUID();
    let dataLoading = true;
    const invoiceData = vm.invoiceData;
    ApiShop.getOrder({
      page: 0,
      limit: 100,
      search: invoiceData.order_id,
      searchType: 'cart_token',
      returnSearch: 'true',
    }).then((response: any) => {
      orderData_ = response.response;

      orderData_.orderData.user_info = invoiceData.invoice_data.original_data;
      orderData_.orderData.user_info.print_invoice = invoiceData.invoice_data.original_data.Print;
      dataLoading = false;
      gvc.notifyDataChange([mainViewID, 'invoiceContent']);
    });
    const vt = {
      paymentBadge: () => {
        if (invoiceData.status === 0) {
          return BgWidget.notifyInsignia('待審核');
        } else if (invoiceData.status === 1) {
          return BgWidget.infoInsignia('已開立');
        } else if (invoiceData.status === 0) {
          return BgWidget.notifyInsignia('待審核');
        } else {
          return BgWidget.notifyInsignia('已作廢');
        }
      },
    };

    const child_vm: {
      type: 'order' | 'user';
      userID: string;
    } = {
      type: 'order',
      userID: '',
    };

    return gvc.bindView({
      bind: mainViewID,
      dataList: [{ obj: child_vm, key: 'type' }],
      view: () => {
        try {
          if (dataLoading) {
            return BgWidget.spinner();
          }

          function getBadgeList() {
            return html` <div style="display:flex; gap:10px;">${vt.paymentBadge()}</div>`;
          }

          return BgWidget.container(html`
            <div class="title-container">
              ${BgWidget.goBack(
                gvc.event(() => {
                  vm.type = 'list';
                })
              )}
              <div class="d-flex flex-column">
                <div class="align-items-center" style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;">
                  #${invoiceData.invoice_no}
                </div>
                <div style="height: 22px;">
                  ${BgWidget.grayNote(
                    `發票時間 : ${glitter.ut.dateFormat(new Date(invoiceData.create_date), 'yyyy-MM-dd hh:mm')}`,
                    `font-size: 16px;`
                  )}
                </div>
              </div>
              <div class="h-100 d-flex align-items-end" style="margin-left: 10px;">
                ${document.body.clientWidth > 768 ? getBadgeList() : ''}
              </div>
            </div>
            <div style="margin-top: 24px;"></div>
            ${gvc.bindView({
              bind: 'invoiceContent',
              view: () => {
                if (orderData_) {
                  const orderData = invoiceData.invoice_data.orderData || orderData_.orderData;
                  console.log(`orderData_.orderData===>`, orderData_.orderData);
                  console.log(`invoiceData.invoice_data.orderData=>`, invoiceData.invoice_data);
                  orderData.user_info.invoice_type = invoiceData.invoice_data.original_data.CustomerIdentifier
                    ? `company`
                    : `customer`;
                  orderData.user_info.company = invoiceData.invoice_data.original_data.CustomerName;
                  orderData.user_info.print_invoice = invoiceData.invoice_data.original_data.Print;
                  let tax_total = (() => {
                    let total = 0;
                    orderData.lineItems
                      .filter((product: any) => {
                        product.tax = product.tax ?? '5';
                        return `${product.tax}` === '0';
                      })
                      .map((dd: any) => {
                        total += parseInt(dd.sale_price, 10);
                      });

                    return Math.round((orderData.total - total) * 0.05);
                  })();
                  let sale = orderData.total - tax_total;
                  let allowanceLoading = true;
                  let allowanceData: any[] = [];

                  console.log('orderData.user_info===>', orderData);
                  // CustomerIdentifier
                  try {
                    return [
                      BgWidget.mainCard(html`
                        <div
                          style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;"
                        >
                          <div style="font-weight: 700;">發票內容</div>
                          <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;">
                            <div>發票種類</div>
                            <div style="display: flex;align-items: flex-start;gap: 12px;">
                              ${(() => {
                                let checkKey = orderData.user_info.invoice_type === 'company' ? 'B2B' : 'B2C';
                                return ['B2C', 'B2B']
                                  .map(data => {
                                    return html`
                                      <div class="d-flex align-items-center" style="gap: 6px; cursor: pointer;">
                                        ${checkKey == data
                                          ? html` <div
                                              style="width: 16px;height: 16px;border-radius: 20px;border:solid 4px #393939"
                                            ></div>`
                                          : html` <div
                                              style="width: 16px;height: 16px;border-radius: 20px;border:solid 1px #DDD"
                                            ></div>`}
                                        <label class="m-0" style="" for="${data}">${data}</label>
                                      </div>
                                    `;
                                  })
                                  .join('');
                              })()}
                            </div>
                          </div>
                          <div class="row p-0">
                            ${[
                              ...(orderData.user_info.invoice_type !== 'company'
                                ? [
                                    BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '買受人姓名',
                                      default: orderData.user_info.name ?? '',
                                      placeHolder: '請輸入買受人姓名',
                                      callback: data => {
                                        orderData.user_info.name = data;
                                      },
                                      readonly: true,
                                    }),
                                  ]
                                : [
                                    BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '公司抬頭',
                                      default: orderData.user_info.company ?? '',
                                      placeHolder: '請輸入公司抬頭',
                                      callback: data => {
                                        orderData.user_info.company = data;
                                      },
                                      readonly: true,
                                    }),
                                    BgWidget.editeInput({
                                      gvc: gvc,
                                      title: '公司統編',
                                      default: orderData.user_info.gui_number ?? '',
                                      placeHolder: '請輸入公司統編',
                                      callback: data => {
                                        orderData.user_info.gui_number = data;
                                      },
                                      readonly: true,
                                    }),
                                  ]),
                              BgWidget.editeInput({
                                gvc: gvc,
                                title: '買受人電話',
                                default: orderData.user_info.phone ?? '',
                                placeHolder: '請輸入買受人電話',
                                callback: data => {
                                  orderData.user_info.phone = data;
                                },
                                readonly: true,
                              }),
                              BgWidget.editeInput({
                                gvc: gvc,
                                title: '買受人地址',
                                default: orderData.user_info.address ?? '',
                                placeHolder: '請輸入買受人地址',
                                callback: data => {
                                  orderData.user_info.address = data;
                                },
                                readonly: true,
                              }),
                              BgWidget.editeInput({
                                gvc: gvc,
                                title: '買受人電子信箱',
                                default: orderData.user_info.email ?? '',
                                placeHolder: '請輸入買受人電子信箱',
                                callback: data => {
                                  orderData.user_info.email = data;
                                },
                                readonly: true,
                              }),
                              // BgWidget.editeInput({
                              //   gvc: gvc,
                              //   title: '發票開立日期',
                              //   default: orderData.user_info.invoice_date ?? '',
                              //   placeHolder: '請輸入發票開立日期',
                              //   type: 'date',
                              //   callback: data => {
                              //     orderData.user_info.invoice_date = data;
                              //   },
                              // }),
                              // BgWidget.editeInput({
                              //   gvc: gvc,
                              //   title: '發票開立時間',
                              //   type: 'time',
                              //   default: orderData.user_info.invoice_time ?? '',
                              //   placeHolder: '請輸入發票開立時間',
                              //   callback: data => {
                              //     orderData.user_info.invoice_time = data;
                              //   },
                              // }),
                              BgWidget.select({
                                gvc: gvc,
                                title: '列印發票',
                                callback: text => {
                                  orderData.user_info.print_invoice = text;
                                },
                                default:
                                  orderData.user_info.print_invoice === '1' ||
                                  orderData.user_info.invoice_type === 'company'
                                    ? 'Y'
                                    : 'N',
                                options: [
                                  { key: 'Y', value: 'Y' },
                                  { key: 'N', value: 'N' },
                                ],
                                readonly: true,
                                style: ``,
                              }),
                              BgWidget.select({
                                gvc: gvc,
                                title: '稅率方式',
                                callback: text => {},
                                default: (() => {
                                  // order.lineItems
                                  return orderData.lineItems.find((product: any) => {
                                    return `${product.tax}` === '0';
                                  })
                                    ? `免稅`
                                    : `應稅`;
                                })(),
                                options: [
                                  { key: '應稅', value: '應稅' },
                                  { key: '免稅', value: '免稅' },
                                ],
                                style: ``,
                                readonly: true,
                              }),
                              BgWidget.editeInput({
                                gvc: gvc,
                                title: '稅率',
                                default: (() => {
                                  const tax5 = orderData.lineItems.find((product: any) => {
                                    product.tax = product.tax ?? '5';
                                    return `${product.tax}` === '5';
                                  });
                                  const tax0 = orderData.lineItems.find((product: any) => {
                                    product.tax = product.tax ?? '5';
                                    return `${product.tax}` === '0';
                                  });
                                  if (tax5 && tax0) {
                                    return `混合稅率`;
                                  } else if (tax5) {
                                    return `5%`;
                                  } else {
                                    return `0%`;
                                  }
                                })(),
                                placeHolder: '請輸入稅率',
                                readonly: true,
                                callback: data => {},
                              }),
                              BgWidget.editeInput({
                                gvc: gvc,
                                title: '稅額',
                                default: `${tax_total}`,
                                placeHolder: '請輸入稅額',
                                readonly: true,
                                callback: data => {},
                              }),
                              BgWidget.editeInput({
                                gvc: gvc,
                                title: '銷售額',
                                default: `${orderData.total - tax_total}`,
                                placeHolder: '請輸入銷售額',
                                readonly: true,
                                callback: data => {},
                              }),
                              BgWidget.editeInput({
                                gvc: gvc,
                                title: '總金額',
                                default: `${orderData.total}`,
                                placeHolder: '請輸入總金額',
                                readonly: true,
                                callback: data => {},
                              }),
                            ]
                              .map(dd => {
                                return `<div class="col-12 col-lg-6">${dd}</div>`;
                              })
                              .join('')}
                          </div>
                        </div>
                      `),
                      html` <div style="margin-top: 24px;"></div>`,
                      gvc.bindView({
                        bind: 'allowanceTable',
                        view: () => {
                          if (allowanceLoading) {
                            allowanceLoading = false;
                            ApiShop.getAllowance({
                              page: 0,
                              limit: 10,
                              search: invoiceData.invoice_no,
                              searchType: 'invoice_no',
                              orderString: '',
                              filter: '',
                            }).then(r => {
                              allowanceData = r.response.data;
                              vm.allowanceDataArray = allowanceData;
                              allowanceLoading = false;
                              gvc.notifyDataChange('allowanceTable');
                            });
                          }
                          if (allowanceData.length) {
                            return BgWidget.mainCard(html`
                              <div class="" style="display: flex;flex-direction: column;">
                                <div style="font-weight: 700;font-size: 16px;margin-bottom: 18px;">折讓單</div>
                                <div class="d-flex" style="margin-bottom: 12px;">
                                  <div class="col-2">折讓日期</div>
                                  <div class="col-2 text-center">折讓單號</div>
                                  <div class="col-2 text-center">折讓金額</div>
                                  <div class="col-2 text-center">狀態</div>
                                </div>
                                ${(() => {
                                  return allowanceData
                                    .map((data: any) => {
                                      return html`
                                        <div class="w-100">
                                          <div class="w-100" style="background-color: #DDD;height: 1px;"></div>
                                          <div class="d-flex" style="padding: 24px 0;">
                                            <div class="col-2 d-flex align-items-center ">
                                              ${data.create_date.split('T')[0]}
                                            </div>
                                            <div
                                              class="col-2 text-center d-flex align-items-center justify-content-center"
                                              style="color: #4D86DB;"
                                            >
                                              ${data.allowance_no}
                                            </div>
                                            <div
                                              class="col-2 text-center d-flex align-items-center justify-content-center"
                                            >
                                              ${data.allowance_data.invoiceAmount ?? 0}
                                            </div>
                                            <div
                                              class="col-2 text-center d-flex align-items-center justify-content-center"
                                            >
                                              ${data.status == 1
                                                ? html` <div class="" style="color:#10931D">已完成</div>`
                                                : html` <div class="" style="color:#DA1313">已作廢</div>`}
                                            </div>
                                            <div class="flex-fill d-flex justify-content-end align-items-center">
                                              <div style="margin-right: 14px;">
                                                ${BgWidget.grayButton(
                                                  '查閱',
                                                  gvc.event(() => {
                                                    vm.type = 'viewAllowance';
                                                  }),
                                                  { textStyle: `` }
                                                )}
                                              </div>

                                              ${BgWidget.darkButton(
                                                '折讓單作廢',
                                                gvc.event(() => {
                                                  const dialog = new ShareDialog(gvc.glitter);

                                                  if (data.status == 1) {
                                                    glitter.innerDialog((gvc: GVC) => {
                                                      let step = 1;
                                                      let reason = '';

                                                      return gvc.bindView({
                                                        bind: 'voidDialog',
                                                        view: () => {
                                                          return html`
                                                            <div
                                                              class="d-flex align-items-center justify-content-center"
                                                              style="width: 100vw;height: 100vw;"
                                                              onclick="${gvc.event(() => {
                                                                glitter.closeDiaLog();
                                                              })}"
                                                            >
                                                              ${(() => {
                                                                switch (step) {
                                                                  case 2:
                                                                    return html`
                                                                      <div
                                                                        class="d-flex flex-column"
                                                                        style="width: 532px;height: 409px;flex-shrink: 0;border-radius: 10px;background: #FFF;position: relative;padding: 36px 64px;gap: 24px;"
                                                                        onclick="${gvc.event(() => {
                                                                          event!.stopPropagation();
                                                                        })}"
                                                                      >
                                                                        <div
                                                                          style="position: absolute;right: 20px;top: 17px;"
                                                                        >
                                                                          <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="14"
                                                                            height="14"
                                                                            viewBox="0 0 14 14"
                                                                            fill="none"
                                                                          >
                                                                            <path
                                                                              d="M1 1L13 13"
                                                                              stroke="#393939"
                                                                              stroke-linecap="round"
                                                                            />
                                                                            <path
                                                                              d="M13 1L1 13"
                                                                              stroke="#393939"
                                                                              stroke-linecap="round"
                                                                            />
                                                                          </svg>
                                                                        </div>
                                                                        <div
                                                                          class="w-100 d-flex align-items-center justify-content-center"
                                                                          style=""
                                                                        >
                                                                          <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="76"
                                                                            height="75"
                                                                            viewBox="0 0 76 75"
                                                                            fill="none"
                                                                          >
                                                                            <g clip-path="url(#clip0_14571_27453)">
                                                                              <path
                                                                                d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z"
                                                                                fill="#393939"
                                                                              />
                                                                            </g>
                                                                            <defs>
                                                                              <clipPath id="clip0_14571_27453">
                                                                                <rect
                                                                                  width="75"
                                                                                  height="75"
                                                                                  fill="white"
                                                                                  transform="translate(0.5)"
                                                                                />
                                                                              </clipPath>
                                                                            </defs>
                                                                          </svg>
                                                                        </div>
                                                                        <div
                                                                          class="w-100"
                                                                          style="text-align: center;font-size: 16px;"
                                                                        >
                                                                          <div>
                                                                            確定要將此折讓單作廢嗎？<br />
                                                                            作廢後，相關交易和記錄將無法恢復。
                                                                          </div>
                                                                          <div
                                                                            style="display: flex;padding: 11px 18px;align-items: center;border-radius: 10px;background: #F7F7F7;margin: 8px 0;"
                                                                          >
                                                                            <div
                                                                              class="d-flex flex-column"
                                                                              style="font-size: 14px;"
                                                                            >
                                                                              <div class="d-flex">
                                                                                <div style="margin-right: 41px;">
                                                                                  折讓單號碼
                                                                                </div>
                                                                                <div>${data.allowance_no}</div>
                                                                              </div>
                                                                              <div class="d-flex">
                                                                                <div style="margin-right: 18px;">
                                                                                  總金額(不含稅)
                                                                                </div>
                                                                                <div>
                                                                                  ${data.allowance_data.invoiceAmount}
                                                                                </div>
                                                                              </div>
                                                                              <div class="d-flex">
                                                                                <div style="margin-right: 55px;">
                                                                                  作廢原因
                                                                                </div>
                                                                                <div>${reason}</div>
                                                                              </div>
                                                                            </div>
                                                                          </div>
                                                                          <div
                                                                            style="color: #8D8D8D;text-align: center;font-size: 13px;line-height: 160%; "
                                                                          >
                                                                            ※提醒您，請務必將已印出的折讓單銷毀，以免引起混淆或誤用。
                                                                          </div>
                                                                        </div>
                                                                        <div
                                                                          class="d-flex align-items-center justify-content-center w-100"
                                                                          style="gap: 14px;"
                                                                        >
                                                                          <div
                                                                            class="btn btn-white"
                                                                            style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 700;color: #393939;"
                                                                            onclick="${gvc.event(() => {
                                                                              step = 1;
                                                                              gvc.notifyDataChange(`voidDialog`);
                                                                            })}"
                                                                          >
                                                                            上一步
                                                                          </div>
                                                                          <div
                                                                            class="btn btn-red"
                                                                            style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-weight: 700;"
                                                                            onclick="${gvc.event(() => {
                                                                              dialog.dataLoading({
                                                                                visible: true,
                                                                              });
                                                                              ApiShop.voidAllowance(
                                                                                data.invoice_no,
                                                                                data.allowance_no,
                                                                                reason
                                                                              ).then(r => {
                                                                                dialog.dataLoading({
                                                                                  visible: false,
                                                                                });
                                                                                glitter.closeDiaLog();
                                                                              });
                                                                            })}"
                                                                          >
                                                                            作廢
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    `;
                                                                  default:
                                                                    return html`
                                                                      <div
                                                                        class="d-flex flex-column"
                                                                        style="width: 532px;height: 270px;flex-shrink: 0;border-radius: 10px;background: #FFF;position: relative;padding: 36px 64px;gap: 24px;"
                                                                        onclick="${gvc.event(() => {
                                                                          event!.stopPropagation();
                                                                        })}"
                                                                      >
                                                                        <div
                                                                          style="position: absolute;right: 20px;top: 17px;"
                                                                        >
                                                                          <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="14"
                                                                            height="14"
                                                                            viewBox="0 0 14 14"
                                                                            fill="none"
                                                                          >
                                                                            <path
                                                                              d="M1 1L13 13"
                                                                              stroke="#393939"
                                                                              stroke-linecap="round"
                                                                            />
                                                                            <path
                                                                              d="M13 1L1 13"
                                                                              stroke="#393939"
                                                                              stroke-linecap="round"
                                                                            />
                                                                          </svg>
                                                                        </div>
                                                                        <div
                                                                          class="w-100 d-flex flex-column"
                                                                          style="text-align: center;font-size: 16px;gap:12px;"
                                                                        >
                                                                          <div>請填寫作廢原因</div>
                                                                          <textarea
                                                                            style="display: flex;height: 100px;padding: 5px 18px;justify-content: center;align-items: center;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                                                                            onchange="${gvc.event(e => {
                                                                              reason = e.value;
                                                                            })}"
                                                                          >
${reason}</textarea
                                                                          >
                                                                        </div>
                                                                        <div
                                                                          class="d-flex align-items-center justify-content-center w-100"
                                                                          style="gap: 14px;"
                                                                        >
                                                                          <div
                                                                            class="btn btn-white"
                                                                            style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 700;color: #393939;"
                                                                            onclick="${gvc.event(() => {
                                                                              glitter.closeDiaLog();
                                                                            })}"
                                                                          >
                                                                            取消
                                                                          </div>
                                                                          <div
                                                                            class="btn btn-red"
                                                                            style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-weight: 700;"
                                                                            onclick="${gvc.event(() => {
                                                                              step = 2;
                                                                              gvc.notifyDataChange('voidDialog');
                                                                            })}"
                                                                          >
                                                                            下一步
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    `;
                                                                }
                                                              })()}
                                                            </div>
                                                          `;
                                                        },
                                                        divCreate: {},
                                                      });
                                                    }, 'voidWarning');
                                                  } else {
                                                    dialog.infoMessage({
                                                      text: '此折讓單已作廢',
                                                    });
                                                  }
                                                })
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      `;
                                    })
                                    .join('');
                                })()}
                              </div>
                            `);
                          }
                          return '';
                        },
                        divCreate: {},
                      }),
                      html` <div style="margin-top: 24px;"></div>`,
                      BgWidget.mainCard(
                        html` <div style="font-size: 16px;font-weight: 700;margin-bottom:18px;">商品列表</div>
                          <div class="d-flex w-100 align-items-center">
                            <div class="col-7 ">商品名稱</div>
                            <div class="col-2 text-center">規格</div>
                            <div class="col-1 text-center">單價</div>
                            <div class="col-1 text-center">數量</div>
                            <div class="col-1 text-end">小計</div>
                          </div>
                          <div
                            style="width: 100%;height: 1px;margin-top: 12px;margin-bottom: 18px;background-color: #DDD"
                          ></div>
                          ${(() => {
                            let itemArray = orderData.lineItems;
                            return itemArray
                              .map((item: any) => {
                                let sale_price = Math.ceil(item.sale_price * 0.95);
                                return html`
                                  <div class="d-flex w-100 align-items-center" style="">
                                    <div class="col-7 d-flex align-items-center">
                                      <img
                                        src="${item.preview_image}"
                                        style="width: 40px;height: 40px;border-radius: 5px;margin-right:12px;"
                                      />
                                      ${item.title}
                                    </div>
                                    <div class="col-2 text-center">${item.spec.join(',') ?? '單一規格'}</div>
                                    <div class="col-1 text-center">${sale_price}</div>
                                    <div class="col-1 text-center">${item.count}</div>
                                    <div class="col-1 text-end">${item.count * sale_price}</div>
                                  </div>
                                `;
                              })
                              .join('');
                          })()}
                          <div
                            style="width: 100%;height: 1px;margin-top: 18px;margin-bottom: 18px;background-color: #DDD"
                          ></div>
                          ${(() => {
                            let itemArray = [
                              { key: '運費', value: orderData.shipment_fee },
                              { key: '銷售額', value: sale },
                              {
                                key: '稅額',
                                value: tax_total,
                              },
                            ];
                            return itemArray
                              .map(item => {
                                return html`
                                  <div class="d-flex flex-row-reverse" style="width: 100%;margin-bottom:18px;">
                                    <div class="col-1 text-end">${item.value}</div>
                                    <div class="col-1"></div>
                                    <div class="col-1 text-end" style="">${item.key}</div>
                                  </div>
                                `;
                              })
                              .join('');
                          })()}
                          <div class="d-flex flex-row-reverse" style="width: 100%;">
                            <div class="col-1 text-end" style="font-weight: 700;">${orderData.total}</div>
                            <div class="col-1"></div>
                            <div class="col-1 text-end" style="font-weight: 700;">總金額</div>
                          </div>`
                      ),
                      html` <div class="w-100 " style="margin-top: 24px;"></div>`,
                      BgWidget.mainCard(html`
                        <div style="margin-bottom: 12px;">發票備註</div>
                        <textarea
                          style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                          rows="3"
                          disabled
                        >
${invoiceData.invoice_data?.remark?.invoice_mark ?? ''}</textarea
                        >
                        <div style="margin-top: 18px;margin-bottom: 12px;">財務備註</div>
                        <textarea
                          style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                          rows="3"
                          disabled
                        >
${invoiceData.invoice_data?.remark?.financial_mark ?? ''}</textarea
                        >
                        <div
                          class="${invoiceData.status == 2 ? '' : 'd-none'}"
                          style="margin-top: 18px;margin-bottom: 12px;"
                        >
                          作廢原因
                        </div>
                        <textarea
                          class="${invoiceData.status == 2 ? '' : 'd-none'}"
                          style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                          rows="3"
                          disabled
                        >
${invoiceData.invoice_data?.remark?.voidReason ?? ''}</textarea
                        >
                      `),
                      html` <div style="margin-top: 240px;"></div> `,
                      html` <div class="update-bar-container">
                        <!-- ${BgWidget.grayButton(
                          '列印收執聯',
                          gvc.event(() => {})
                        )}
                      ${BgWidget.grayButton(
                          '補寄發票',
                          gvc.event(() => {})
                        )}
                      ${BgWidget.grayButton(
                          '補發簡訊',
                          gvc.event(() => {})
                        )}
                      ${BgWidget.grayButton(
                          '寄送紙本',
                          gvc.event(() => {})
                        )} -->
                        ${(() => {
                          if (invoiceData.status == 2) {
                            return '';
                          }
                          let v_ = [
                            // BgWidget.save(
                            //   gvc.event(() => {}),
                            //   '發票折讓'
                            // ),
                            BgWidget.danger(
                              gvc.event(() => {
                                glitter.innerDialog((gvc: GVC) => {
                                  let step = 1;
                                  let reason = '';

                                  return gvc.bindView({
                                    bind: 'voidDialog',
                                    view: () => {
                                      try {
                                        return html`
                                          <div
                                            class="d-flex align-items-center justify-content-center"
                                            style="width: 100vw;height: 100vw;"
                                            onclick="${gvc.event(() => {})}"
                                          >
                                            ${(() => {
                                              switch (step) {
                                                case 2:
                                                  return html`
                                                    <div
                                                      class="d-flex flex-column"
                                                      style="width: 532px;height: 409px;flex-shrink: 0;border-radius: 10px;background: #FFF;position: relative;padding: 36px 64px;gap: 24px;"
                                                      onclick="${gvc.event(() => {
                                                        event!.stopPropagation();
                                                      })}"
                                                    >
                                                      <div style="position: absolute;right: 20px;top: 17px;">
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="14"
                                                          height="14"
                                                          viewBox="0 0 14 14"
                                                          fill="none"
                                                        >
                                                          <path
                                                            d="M1 1L13 13"
                                                            stroke="#393939"
                                                            stroke-linecap="round"
                                                          />
                                                          <path
                                                            d="M13 1L1 13"
                                                            stroke="#393939"
                                                            stroke-linecap="round"
                                                          />
                                                        </svg>
                                                      </div>
                                                      <div
                                                        class="w-100 d-flex align-items-center justify-content-center"
                                                        style=""
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="76"
                                                          height="75"
                                                          viewBox="0 0 76 75"
                                                          fill="none"
                                                        >
                                                          <g clip-path="url(#clip0_14571_27453)">
                                                            <path
                                                              d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z"
                                                              fill="#393939"
                                                            />
                                                          </g>
                                                          <defs>
                                                            <clipPath id="clip0_14571_27453">
                                                              <rect
                                                                width="75"
                                                                height="75"
                                                                fill="white"
                                                                transform="translate(0.5)"
                                                              />
                                                            </clipPath>
                                                          </defs>
                                                        </svg>
                                                      </div>
                                                      <div class="w-100" style="text-align: center;font-size: 16px;">
                                                        <div>
                                                          確定要將此發票作廢嗎？<br />
                                                          作廢後，相關交易和記錄將無法恢復。
                                                        </div>
                                                        <div
                                                          style="display: flex;padding: 11px 18px;align-items: center;border-radius: 10px;background: #F7F7F7;margin: 8px 0;"
                                                        >
                                                          <div class="d-flex flex-column" style="font-size: 14px;">
                                                            <div class="d-flex">
                                                              <div style="margin-right: 55px;">發票編碼</div>
                                                              <div>${invoiceData.invoice_no}</div>
                                                            </div>
                                                            <div class="d-flex">
                                                              <div style="margin-right: 18px;">總金額(不含稅)</div>
                                                              <div>${orderData.total ?? 0}</div>
                                                            </div>
                                                            <div class="d-flex">
                                                              <div style="margin-right: 55px;">作廢原因</div>
                                                              <div>${reason}</div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div
                                                          style="color: #8D8D8D;text-align: center;font-size: 13px;line-height: 160%; "
                                                        >
                                                          ※提醒您，請務必將已印出的折讓單銷毀，以免引起混淆或誤用。
                                                        </div>
                                                      </div>
                                                      <div
                                                        class="d-flex align-items-center justify-content-center w-100"
                                                        style="gap: 14px;"
                                                      >
                                                        <div
                                                          class="btn btn-white"
                                                          style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 700;color: #393939;"
                                                          onclick="${gvc.event(() => {
                                                            step = 1;
                                                            gvc.notifyDataChange(`voidDialog`);
                                                          })}"
                                                        >
                                                          上一步
                                                        </div>
                                                        <div
                                                          class="btn btn-red"
                                                          style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-weight: 700;"
                                                          onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            if (!(reason ?? '').trim()) {
                                                              dialog.errorMessage({ text: '請填寫作廢原因' });
                                                              return;
                                                            }
                                                            dialog.dataLoading({ visible: true });
                                                            ApiShop.voidInvoice(
                                                              invoiceData.invoice_no,
                                                              reason,
                                                              invoiceData.create_date
                                                            ).then(r => {
                                                              dialog.dataLoading({ visible: false });
                                                              vm.type = 'list';
                                                              glitter.closeDiaLog();
                                                            });
                                                          })}"
                                                        >
                                                          作廢
                                                        </div>
                                                      </div>
                                                    </div>
                                                  `;
                                                default:
                                                  return html`
                                                    <div
                                                      class="d-flex flex-column"
                                                      style="width: 532px;height: 270px;flex-shrink: 0;border-radius: 10px;background: #FFF;position: relative;padding: 36px 64px;gap: 24px;"
                                                      onclick="${gvc.event(() => {})}"
                                                    >
                                                      <div style="position: absolute;right: 20px;top: 17px;">
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="14"
                                                          height="14"
                                                          viewBox="0 0 14 14"
                                                          fill="none"
                                                        >
                                                          <path
                                                            d="M1 1L13 13"
                                                            stroke="#393939"
                                                            stroke-linecap="round"
                                                          />
                                                          <path
                                                            d="M13 1L1 13"
                                                            stroke="#393939"
                                                            stroke-linecap="round"
                                                          />
                                                        </svg>
                                                      </div>
                                                      <div
                                                        class="w-100 d-flex flex-column"
                                                        style="text-align: center;font-size: 16px;gap:12px;"
                                                      >
                                                        <div>請填寫作廢原因</div>
                                                        <textarea
                                                          style="display: flex;height: 100px;padding: 5px 18px;justify-content: center;align-items: center;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                                                          onchange="${gvc.event(e => {
                                                            reason = e.value;
                                                          })}"
                                                          onclick="${gvc.event((e, event) => {
                                                            event.stopPropagation();
                                                            event.preventDefault();
                                                          })}"
                                                        >
${reason}</textarea
                                                        >
                                                      </div>
                                                      <div
                                                        class="d-flex align-items-center justify-content-center w-100"
                                                        style="gap: 14px;"
                                                      >
                                                        <div
                                                          class="btn btn-white"
                                                          style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 700;color: #393939;"
                                                          onclick="${gvc.event(() => {
                                                            glitter.closeDiaLog();
                                                          })}"
                                                        >
                                                          取消
                                                        </div>
                                                        <div
                                                          class="btn btn-red"
                                                          style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-weight: 700;"
                                                          onclick="${gvc.event(() => {
                                                            step = 2;
                                                            gvc.notifyDataChange('voidDialog');
                                                          })}"
                                                        >
                                                          下一步
                                                        </div>
                                                      </div>
                                                    </div>
                                                  `;
                                              }
                                            })()}
                                          </div>
                                        `;
                                      } catch (e) {
                                        console.log(e);
                                        return `${e}`;
                                      }
                                    },
                                    divCreate: {},
                                  });
                                }, 'voidWarning');
                              }),
                              '發票作廢'
                            ),
                          ];

                          if (
                            invoiceData.invoice_data.original_data.Print === '1' &&
                            (window.parent as any).glitter.share.PayConfig.posType === 'SUNMI'
                          ) {
                            v_ = [
                              BgWidget.cancel(
                                gvc.event(() => {
                                  const dialog = new ShareDialog(gvc.glitter);
                                  dialog.dataLoading({ visible: true });
                                  ApiShop.printInvoice({
                                    order_id: invoiceData.order_id,
                                  }).then(res => {
                                    dialog.dataLoading({ visible: false });
                                    if (res.result) {
                                      IminModule.printInvoice(
                                        res.response,
                                        invoiceData.order_id,
                                        glitter.share.staff_title
                                      );
                                    } else {
                                      dialog.errorMessage({ text: '列印失敗' });
                                    }
                                  });
                                }),
                                '發票列印'
                              ),
                            ].concat(v_);
                          }
                          return v_.join('');
                        })()}
                      </div>`,
                    ].join('');
                  } catch (e) {
                    console.log(e);
                    return `${e}`;
                  }
                }
                return ``;
              },
              divCreate: {},
            })}
          `);
        } catch (e) {
          console.error(e);
          return BgWidget.maintenance();
        }
      },
      divCreate: {},
      onCreate: () => {},
      onDestroy: () => {},
    });
  }

  public static createOrder(gvc: GVC, vm: any, searchOrder?: string) {
    let viewModel: any = {
      searchOrder: searchOrder ?? '',
      searchData: '',
      errorReport: '',
      invoiceData: {
        getPaper: 'Y',
        date: '',
        time: '',
        category: '應稅',
      },
      customerInfo: {},
    };
    const dialog = new ShareDialog(gvc.glitter);
    if (viewModel.searchOrder.length > 1) {
      dialog.dataLoading({
        visible: true,
      });
      ApiShop.getOrder({
        page: 0,
        limit: 100,
        search: viewModel.searchOrder,
        searchType: 'cart_token',
        archived: `false`,
        returnSearch: 'true',
      }).then((response: any) => {
        viewModel.searchData = response.response;
        ApiUser.getUsersDataWithEmailOrPhone(response.response.email).then(res => {
          viewModel.customerInfo = res.response;
          dialog.dataLoading({
            visible: false,
          });
          gvc.notifyDataChange(['notFind', 'invoiceContent']);
        });
      });
    }
    return BgWidget.container(html`
      <!-- 標頭 --- 新增訂單標題和返回 -->
      <div class="title-container">
        ${BgWidget.goBack(
          gvc.event(() => {
            vm.type = 'list';
          })
        )}
        ${BgWidget.title('手動開立發票')}
      </div>
      <div style="margin-top: 24px;"></div>
      ${BgWidget.mainCard(html`
        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
          <div style="font-size: 16px;font-weight: 700;">訂單編號*</div>
          <input
            style="display: flex;height: 40px;padding: 9px 18px;align-items: flex-start;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 400;"
            placeholder="請輸入訂單編號"
            value="${viewModel.searchOrder}"
            onchange="${gvc.event(e => {
              viewModel.searchOrder = e.value;
            })}"
          />
          <div
            style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;background: #EAEAEA;font-weight: 700;cursor: pointer;"
            onclick="${gvc.event(() => {
              if (viewModel.searchOrder == '') {
                return;
              }
              ApiShop.getOrder({
                page: 0,
                limit: 100,
                search: viewModel.searchOrder,
                searchType: 'cart_token',
                archived: `false`,
                returnSearch: 'true',
              }).then((response: any) => {
                if (response.response.length == 0) {
                  viewModel.errorReport = '查無此訂單';
                }
                if (response.response && response.response.orderData.lineItems.length > 0) {
                  // customerInfo
                  viewModel.searchData = response.response;
                  ApiUser.getUsersDataWithEmailOrPhone(response.response.email).then(res => {
                    viewModel.customerInfo = res.response;
                    // userDataLoading = false;
                    gvc.notifyDataChange(['notFind', 'invoiceContent']);
                  });
                } else {
                  viewModel.errorReport = '此訂單已無商品可退貨';
                }

                // viewModel.searchData = response.response.data.find((data: any) => data.cart_token == viewModel.searchOrder)
                gvc.notifyDataChange(['notFind', 'invoiceContent']);
              });
            })}"
          >
            查詢訂單
          </div>

          ${gvc.bindView({
            bind: 'notFind',
            view: () => {
              if (viewModel.searchOrder.length > 0 && !viewModel.searchData) {
                return html`
                  <div
                    style="display: flex;padding: 24px 0px;justify-content: center;align-items: center;gap: 10px;align-self: stretch;color:#8D8D8D;"
                  >
                    ${viewModel.errorReport}
                  </div>
                `;
              } else {
                return ``;
              }
            },
            divCreate: { style: `width:100%` },
          })}
        </div>
      `)}
      <div style="margin-top: 24px;"></div>
      ${gvc.bindView(() => {
        function refresh() {
          gvc.notifyDataChange(['invoiceContent']);
        }

        return {
          bind: 'invoiceContent',
          view: () => {
            try {
              if (viewModel.searchData) {
                const orderData = viewModel.searchData.orderData;
                console.log(`orderData=>`, orderData);
                let tax_total = (() => {
                  let total = 0;
                  orderData.lineItems
                    .filter((product: any) => {
                      product.tax = product.tax ?? '5';
                      return `${product.tax}` === '0';
                    })
                    .map((dd: any) => {
                      total += parseInt(dd.sale_price, 10);
                    });

                  return Math.round((orderData.total - total) * 0.05);
                })();
                let sale = orderData.total - tax_total;
                let allowanceLoading = true;
                let allowanceData: any[] = [];

                return [
                  BgWidget.mainCard(html`
                    <div
                      style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;"
                    >
                      <div style="font-weight: 700;">發票內容</div>
                      <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;">
                        <div>發票種類</div>
                        <div style="display: flex;align-items: flex-start;gap: 12px;">
                          ${(() => {
                            let checkKey = orderData.user_info.invoice_type === 'company' ? 'B2B' : 'B2C';
                            return ['B2C', 'B2B']
                              .map(data => {
                                return html`
                                  <div
                                    class="d-flex align-items-center"
                                    style="gap: 6px; cursor: pointer;"
                                    onclick="${gvc.event(() => {
                                      orderData.user_info.invoice_type = data === 'B2C' ? `me` : 'company';
                                      refresh();
                                    })}"
                                  >
                                    ${checkKey == data
                                      ? html` <div
                                          style="width: 16px;height: 16px;border-radius: 20px;border:solid 4px #393939"
                                        ></div>`
                                      : html` <div
                                          style="width: 16px;height: 16px;border-radius: 20px;border:solid 1px #DDD"
                                        ></div>`}
                                    <label class="m-0" style="" for="${data}">${data}</label>
                                  </div>
                                `;
                              })
                              .join('');
                          })()}
                        </div>
                      </div>
                      <div class="row p-0">
                        ${[
                          ...(orderData.user_info.invoice_type !== 'company'
                            ? [
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '買受人姓名',
                                  default: orderData.user_info.name ?? '',
                                  placeHolder: '請輸入買受人姓名',
                                  callback: data => {
                                    orderData.user_info.name = data;
                                  },
                                }),
                              ]
                            : [
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '公司抬頭',
                                  default: orderData.user_info.company ?? '',
                                  placeHolder: '請輸入公司抬頭',
                                  callback: data => {
                                    orderData.user_info.company = data;
                                  },
                                }),
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '公司統編',
                                  default: orderData.user_info.gui_number ?? '',
                                  placeHolder: '請輸入公司統編',
                                  callback: data => {
                                    orderData.user_info.gui_number = data;
                                  },
                                }),
                              ]),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: '買受人電話',
                            default: orderData.user_info.phone ?? '',
                            placeHolder: '請輸入買受人電話',
                            callback: data => {
                              orderData.user_info.phone = data;
                            },
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: '買受人地址',
                            default: orderData.user_info.address ?? '',
                            placeHolder: '請輸入買受人地址',
                            callback: data => {
                              orderData.user_info.address = data;
                            },
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: '買受人電子信箱',
                            default: orderData.user_info.email ?? '',
                            placeHolder: '請輸入買受人電子信箱',
                            callback: data => {
                              orderData.user_info.email = data;
                            },
                          }),
                          // BgWidget.editeInput({
                          //   gvc: gvc,
                          //   title: '發票開立日期',
                          //   default: orderData.user_info.invoice_date ?? '',
                          //   placeHolder: '請輸入發票開立日期',
                          //   type: 'date',
                          //   callback: data => {
                          //     orderData.user_info.invoice_date = data;
                          //   },
                          // }),
                          // BgWidget.editeInput({
                          //   gvc: gvc,
                          //   title: '發票開立時間',
                          //   type: 'time',
                          //   default: orderData.user_info.invoice_time ?? '',
                          //   placeHolder: '請輸入發票開立時間',
                          //   callback: data => {
                          //     orderData.user_info.invoice_time = data;
                          //   },
                          // }),
                          BgWidget.select({
                            gvc: gvc,
                            title: '列印發票',
                            callback: text => {
                              orderData.user_info.print_invoice = text;
                            },
                            default:
                              orderData.user_info.print_invoice === '1' ||
                              orderData.user_info.invoice_type === 'company'
                                ? 'Y'
                                : 'N',
                            options: [
                              { key: 'Y', value: 'Y' },
                              { key: 'N', value: 'N' },
                            ],
                            readonly: orderData.user_info.invoice_type === 'company',
                            style: ``,
                          }),
                          BgWidget.select({
                            gvc: gvc,
                            title: '稅率方式',
                            callback: text => {},
                            default: (() => {
                              // order.lineItems
                              return orderData.lineItems.find((product: any) => {
                                return `${product.tax}` === '0';
                              })
                                ? `免稅`
                                : `應稅`;
                            })(),
                            options: [
                              { key: '應稅', value: '應稅' },
                              { key: '免稅', value: '免稅' },
                            ],
                            style: ``,
                            readonly: true,
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: '稅率',
                            default: (() => {
                              const tax5 = orderData.lineItems.find((product: any) => {
                                product.tax = product.tax ?? '5';
                                return `${product.tax}` === '5';
                              });
                              const tax0 = orderData.lineItems.find((product: any) => {
                                product.tax = product.tax ?? '5';
                                return `${product.tax}` === '0';
                              });
                              if (tax5 && tax0) {
                                return `混合稅率`;
                              } else if (tax5) {
                                return `5%`;
                              } else {
                                return `0%`;
                              }
                            })(),
                            placeHolder: '請輸入稅率',
                            readonly: true,
                            callback: data => {},
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: '稅額',
                            default: `${tax_total}`,
                            placeHolder: '請輸入稅額',
                            readonly: true,
                            callback: data => {},
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: '銷售額',
                            default: `${orderData.total - tax_total}`,
                            placeHolder: '請輸入銷售額',
                            readonly: true,
                            callback: data => {},
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: '總金額',
                            default: `${orderData.total}`,
                            placeHolder: '請輸入總金額',
                            readonly: true,
                            callback: data => {},
                          }),
                        ]
                          .map(dd => {
                            return `<div class="col-12 col-lg-6">${dd}</div>`;
                          })
                          .join('')}
                      </div>
                    </div>
                  `),
                  html` <div style="margin-top: 24px;"></div>`,
                  BgWidget.mainCard(
                    html` <div style="font-size: 16px;font-weight: 700;margin-bottom:18px;">商品列表</div>
                      <div class="d-flex w-100 align-items-center">
                        <div class="col-7 ">商品名稱</div>
                        <div class="col-2 text-center">規格</div>
                        <div class="col-1 text-center">單價</div>
                        <div class="col-1 text-center">數量</div>
                        <div class="col-1 text-end">小計</div>
                      </div>
                      <div
                        style="width: 100%;height: 1px;margin-top: 12px;margin-bottom: 18px;background-color: #DDD"
                      ></div>
                      ${(() => {
                        let itemArray = viewModel.searchData.orderData.lineItems;
                        return itemArray.map((item: any) => {
                          let sale_price = Math.ceil(item.sale_price * 0.95);
                          return html`
                            <div class="d-flex w-100 align-items-center" style="">
                              <div class="col-7 d-flex align-items-center">
                                <img
                                  src="${item.preview_image}"
                                  style="width: 40px;height: 40px;border-radius: 5px;margin-right:12px;"
                                />
                                ${item.title}
                              </div>
                              <div class="col-2 text-center">${item.spec.join(',') ?? '單一規格'}</div>
                              <div class="col-1 text-center">${sale_price}</div>
                              <div class="col-1 text-center">${item.count}</div>
                              <div class="col-1 text-end">${Tool.floatAdd(item.count * sale_price, 0)}</div>
                            </div>
                          `;
                        });
                      })()}
                      <div
                        style="width: 100%;height: 1px;margin-top: 18px;margin-bottom: 18px;background-color: #DDD"
                      ></div>
                      ${(() => {
                        let itemArray = [
                          { key: '運費', value: orderData.shipment_fee },
                          { key: '銷售額', value: sale },
                          { key: '稅額', value: tax_total },
                        ];
                        return itemArray
                          .map(item => {
                            return html`
                              <div class="d-flex flex-row-reverse" style="width: 100%;margin-bottom:18px;">
                                <div class="col-1 text-end">${item.value}</div>
                                <div class="col-1"></div>
                                <div class="col-1 text-end" style="">${item.key}</div>
                              </div>
                            `;
                          })
                          .join('');
                      })()}
                      <div class="d-flex flex-row-reverse" style="width: 100%;">
                        <div class="col-1 text-end" style="font-weight: 700;">${orderData.total}</div>
                        <div class="col-1"></div>
                        <div class="col-1 text-end" style="font-weight: 700;">總金額</div>
                      </div>`
                  ),
                  html` <div class="w-100 " style="margin-top: 24px;"></div>`,
                  BgWidget.mainCard(html`
                    <div style="margin-bottom: 12px;">發票備註</div>
                    <textarea
                      style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                      rows="3"
                      onchange="${gvc.event(e => {
                        viewModel.invoiceData.invoice_mark = e.value;
                      })}"
                    ></textarea>
                    <div style="margin-top: 18px;margin-bottom: 12px;">財務備註</div>
                    <textarea
                      style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                      rows="3"
                      onchange="${gvc.event(e => {
                        viewModel.invoiceData.financial_mark = e.value;
                      })}"
                    ></textarea>
                  `),
                  html` <div style="margin-top: 240px;"></div> `,
                  html` <div class="update-bar-container">
                    ${BgWidget.cancel(
                      gvc.event(() => {
                        vm.type = 'list';
                      })
                    )}
                    ${BgWidget.save(
                      gvc.event(() => {
                        dialog.dataLoading({
                          text: '發票開立中',
                          visible: true,
                        });
                        ApiShop.postInvoice({
                          orderID: viewModel.searchOrder,
                          orderData: viewModel.searchData,
                        }).then(r => {
                          dialog.dataLoading({
                            visible: false,
                          });
                          if (r.response.result) {
                            dialog.infoMessage({
                              text: '發票建立完成',
                            });
                            vm.type = 'list';
                          } else {
                            dialog.infoMessage({
                              text: '發票開立失敗',
                            });
                          }
                        });
                      }),
                      '開立'
                    )}
                  </div>`,
                ].join('');
              }
              return ``;
            } catch (e) {
              console.log(e);
              return `${e}`;
            }
          },
          divCreate: {},
        };
      })}
    `);
  }
}

(window as any).glitter.setModule(import.meta.url, ShoppingInvoiceManager);
