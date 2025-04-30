import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { FilterOptions } from '../filter-options.js';

export type ViewModel = {
  id: string;
  tableId: string;
  filterId: string;
  type: 'basic' | 'function' | 'global';
  data: any;
  SEOData: any;
  domain: any;
  dataList: any;
  query?: string;
  mainLoading: boolean;
  SEOLoading: boolean;
  domainLoading: boolean;
  save_info: () => Promise<any>;
};

const html = String.raw;

export class InformationModule {
  gvc: GVC;
  vm: ViewModel;
  ShoppingInformation: any;

  constructor(gvc: GVC, vm: any, ShoppingInformation: any) {
    this.gvc = gvc;
    this.vm = vm;
    this.ShoppingInformation = ShoppingInformation;
  }

  pickUpMode(title: string) {
    const gvc = this.gvc;
    const vm = this.vm;
    const dialog = new ShareDialog(gvc.glitter);

    return gvc.event(() => {
      BgWidget.settingDialog({
        gvc,
        title,
        width: 600,
        innerHTML: gvc => {
          return html`<div class="d-flex flex-column" style="gap:5px;">
            ${[
              html` <div class="d-flex align-items-center" style="gap:10px;">
                <div style="color: #393939; font-size: 16px;">啟用功能</div>
                <div class="cursor_pointer form-check form-switch m-0 p-0" style="min-width: 50px;">
                  <input
                    class="form-check-input m-0"
                    type="checkbox"
                    onchange="${gvc.event(() => {
                      vm.data.pickup_mode = !vm.data.pickup_mode;
                      gvc.recreateView();
                    })}"
                    ${vm.data.pickup_mode ? `checked` : ''}
                  />
                </div>
                ${vm.data.pickup_mode
                  ? html`<div class="fw-bold fs-6 d-flex align-items-center">
                      當前號碼 : ${vm.data.pickup_now || vm.data.pickup_start || 0}
                      <div class="mx-2"></div>
                      ${BgWidget.customButton({
                        button: {
                          color: 'snow',
                          size: 'sm',
                        },
                        text: {
                          name: '重置號碼',
                        },
                        event: gvc.event(() => {
                          const dialog = new ShareDialog(gvc.glitter);
                          dialog.checkYesOrNot({
                            text: '是否確認重置號碼?',
                            callback: response => {
                              if (response) {
                                vm.data.pickup_now = vm.data.pickup_start || '0';
                                gvc.recreateView();
                              }
                            },
                          });
                        }),
                      })}
                    </div>`
                  : ``}
              </div>`,
              ...(() => {
                if (vm.data.pickup_mode) {
                  return [
                    BgWidget.editeInput({
                      gvc: gvc,
                      title: '初始號碼',
                      default: vm.data.pickup_start || '0',
                      callback: text => {
                        vm.data.pickup_start = text;
                      },
                      placeHolder: '請輸入初始號碼',
                      type: 'number',
                    }),
                    BgWidget.editeInput({
                      gvc: gvc,
                      title: html`<div class="d-flex flex-column">
                        ${['結束號碼', BgWidget.grayNote('輸入零則無上限')].join('')}
                      </div>`,
                      default: vm.data.pickup_end || '0',
                      callback: text => {
                        vm.data.pickup_end = text;
                      },
                      placeHolder: '請輸入結束號碼',
                      type: 'number',
                    }),
                  ];
                } else {
                  return [];
                }
              })(),
            ].join(BgWidget.horizontalLine())}
          </div>`;
        },
        footer_html: gvc => {
          return [
            BgWidget.cancel(
              gvc.event(() => {
                gvc.closeDialog();
              })
            ),
            BgWidget.save(
              gvc.event(async () => {
                dialog.dataLoading({ visible: true });
                await vm.save_info();
                await Promise.all(this.ShoppingInformation.saveArray.map((dd: any) => dd()));
                this.ShoppingInformation.saveArray = [];
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: '儲存成功' });
                gvc.closeDialog();
              })
            ),
          ].join('');
        },
      });
    });
  }

  checkoutMode(title: string) {
    const gvc = this.gvc;
    const vm = this.vm;
    const dialog = new ShareDialog(gvc.glitter);

    return gvc.event(() => {
      const originData = structuredClone(vm.data);
      BgWidget.settingDialog({
        gvc,
        title,
        width: 600,
        innerHTML: gvc => {
          const modes = vm.data.checkout_mode;
          const arr = [
            {
              key: 'orderStatus',
              name: '訂單狀態',
              data: FilterOptions.orderStatusOptions,
            },
            {
              key: 'payload',
              name: '付款狀態',
              data: FilterOptions.payloadStatusOptions,
            },
            {
              key: 'progress',
              name: '出貨狀況',
              data: FilterOptions.progressOptions,
            },
          ];

          return html`${BgWidget.grayNote('提示：勾選項目後，該項目將會作為訂單累積與分析數據的篩選條件')}
            <div class="d-flex flex-column gap-1">
              ${arr
                .map(obj => {
                  return BgWidget.inlineCheckBox({
                    gvc,
                    title: obj.name,
                    def: modes[obj.key],
                    array: obj.data.map(item => ({ title: item.name, value: item.key })),
                    callback: (array: any) => {
                      modes[obj.key] = array;
                    },
                    type: 'multiple',
                  });
                })
                .join(BgWidget.mbContainer(12))}
            </div>`;
        },
        footer_html: gvc => {
          return [
            BgWidget.cancel(
              gvc.event(() => {
                vm.data = originData;
                gvc.closeDialog();
              })
            ),
            BgWidget.save(
              gvc.event(async () => {
                dialog.dataLoading({ visible: true });
                await vm.save_info();
                await Promise.all(this.ShoppingInformation.saveArray.map((dd: any) => dd()));
                this.ShoppingInformation.saveArray = [];
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: '儲存成功' });
                gvc.closeDialog();
              })
            ),
          ].join('');
        },
      });
    });
  }

  invoiceMode(title: string) {
    const gvc = this.gvc;
    const vm = this.vm;
    const dialog = new ShareDialog(gvc.glitter);

    return gvc.event(() => {
      const originData = structuredClone(vm.data);
      BgWidget.settingDialog({
        gvc,
        title,
        width: 600,
        innerHTML: gvc => {
          const modes = vm.data.invoice_mode;
          const arr = [
            {
              key: 'orderStatus',
              name: '訂單狀態',
              data: FilterOptions.orderStatusOptions,
            },
            {
              key: 'payload',
              name: '付款狀態',
              data: FilterOptions.payloadStatusOptions,
            },
            {
              key: 'progress',
              name: '出貨狀況',
              data: FilterOptions.progressOptions,
            },
          ];

          return html`${BgWidget.grayNote('提示：勾選項目後，該項目將會作為開立發票時的篩選條件')}
            <div class="d-flex flex-column gap-1">
              ${arr
                .map(obj => {
                  return BgWidget.inlineCheckBox({
                    gvc,
                    title: obj.name,
                    def: modes[obj.key],
                    array: obj.data.map(item => ({ title: item.name, value: item.key })),
                    callback: (array: any) => {
                      modes[obj.key] = array;
                    },
                    type: 'multiple',
                  });
                })
                .join(BgWidget.mbContainer(12))}
              ${BgWidget.editeInput({
                gvc,
                title: '若達成觸發時機，幾天後發送',
                default: `${modes.afterDays || 0}`,
                placeHolder: '輸入 0 則立即發送',
                callback: value => {
                  const n = parseInt(`${value}`, 0);
                  if (isNaN(n) || n < 0) {
                    dialog.errorMessage({ text: '請輸入 0 或大於 0 的數字' });
                    return;
                  }
                  modes.afterDays = n;
                },
                divStyle: 'margin-top: 12px;',
              })}
            </div>`;
        },
        footer_html: gvc => {
          return [
            BgWidget.cancel(
              gvc.event(() => {
                vm.data = originData;
                gvc.closeDialog();
              })
            ),
            BgWidget.save(
              gvc.event(async () => {
                dialog.dataLoading({ visible: true });
                await vm.save_info();
                await Promise.all(this.ShoppingInformation.saveArray.map((dd: any) => dd()));
                this.ShoppingInformation.saveArray = [];
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: '儲存成功' });
                gvc.closeDialog();
              })
            ),
          ].join('');
        },
      });
    });
  }
}
