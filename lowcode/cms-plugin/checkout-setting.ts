import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { Tool } from '../modules/tool.js';

export class MemberSetting {
  public static main(gvc: GVC) {
    const html = String.raw;
    const vm: {
      id: string;
      data: any;
      loading: boolean;
    } = {
      id: gvc.glitter.getUUID(),
      data: {},
      loading: true,
    };

    ApiUser.getPublicConfig('login_config', 'manager').then(dd => {
      vm.loading = false;
      vm.data = {
        sorted_voucher: {
          toggle: false,
          array: [],
        },
        ...(dd.response.value ?? {}),
      };
      gvc.notifyDataChange(vm.id);
    });

    function saveEvent() {
      ApiUser.setPublicConfig({ key: 'login_config', value: vm.data, user_id: 'manager' });
    }

    return gvc.bindView({
      bind: vm.id,
      view: () => {
        if (vm.loading) {
          return '';
        }
        return BgWidget.container(html`
          <div class="title-container">
            ${BgWidget.title('結帳設定')}
            <div class="flex-fill"></div>
          </div>
          ${BgWidget.container(
            [
              BgWidget.mainCard(
                [
                  html`<div class="tx_normal fw-bolder">允許訪客結帳</div>`,
                  BgWidget.grayNote('關閉代表必須是註冊會員後才可進行結帳，開啟則允許訪客結帳'),
                  html` <div class="d-flex align-items-center w-100 mt-3">
                    <div class="tx_normal me-2">${vm.data.login_in_to_order ? '關閉' : '開啟'}</div>
                    <div class="cursor_pointer form-check form-switch m-0">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        onchange="${gvc.event(() => {
                          vm.data.login_in_to_order = !vm.data.login_in_to_order;
                          saveEvent();
                          gvc.notifyDataChange(vm.id);
                        })}"
                        ${vm.data.login_in_to_order ? '' : 'checked'}
                      />
                    </div>
                    <div class="flex-fill"></div>
                  </div>`,
                ].join('')
              ),
              BgWidget.mainCard(
                [
                  html`<div class="tx_normal fw-bolder">顧客手動取消訂單</div>`,
                  BgWidget.grayNote('顧客可自行取消自己未付款未出貨的訂單'),
                  html` <div class="d-flex align-items-center w-100 mt-3">
                    <div class="tx_normal me-2">${vm.data.customer_cancel_order ? '開啟' : '關閉'}</div>
                    <div class="cursor_pointer form-check form-switch m-0">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        onchange="${gvc.event(() => {
                          vm.data.customer_cancel_order = !vm.data.customer_cancel_order;
                          saveEvent();
                          gvc.notifyDataChange(vm.id);
                        })}"
                        ${vm.data.customer_cancel_order ? 'checked' : ''}
                      />
                    </div>
                    <div class="flex-fill"></div>
                  </div>`,
                ].join('')
              ),
              BgWidget.mainCard(
                [
                  html`<div class="tx_normal fw-bolder">系統自動取消訂單</div>`,
                  BgWidget.grayNote('若顧客在指定時間內未付款，系統會自動取消訂單，輸入 0 則永不取消訂單'),
                  html` <div class="d-flex align-items-center w-100 mt-1">
                    ${BgWidget.editeInput({
                      gvc: gvc,
                      title: '',
                      default: `${vm.data.auto_cancel_order_timer ?? 0}`,
                      endText: '小時',
                      placeHolder: `請輸入自動取消訂單時效`,
                      callback: text => {
                        const n = Number.parseInt(text, 10);
                        vm.data.auto_cancel_order_timer = isNaN(n) || n < 0 ? 0 : n;
                        saveEvent();
                        gvc.notifyDataChange(vm.id);
                      },
                    })}
                  </div>`,
                ].join('')
              ),
              BgWidget.mainCard(
                [
                  html` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                    優惠卷優先級
                  </div>`,
                  BgWidget.multiCheckboxContainer(
                    gvc,
                    [
                      {
                        key: 'false',
                        name: '優先使用折扣較高的優惠',
                      },
                      {
                        key: 'true',
                        name: '手動調整優惠卷順序',
                        innerHtml: gvc.bindView(
                          (() => {
                            const id = gvc.glitter.getUUID();
                            const dragId = Tool.randomString(7);
                            const dataList: any = [];
                            let loading = true;

                            return {
                              bind: id,
                              view: () => {
                                if (loading) {
                                  return BgWidget.spinner();
                                }

                                return dataList
                                  .map((item: any) => {
                                    return html`<div data-index="${item.id}" class="drag-badge drag-badge-warning">
                                      <i class="fa-solid fa-grip-dots-vertical me-1"></i>
                                      ${item.content.title}
                                    </div>`;
                                  })
                                  .join('');
                              },
                              divCreate: {
                                class: 'd-flex flex-wrap gap-2',
                                option: [{ key: 'id', value: dragId }],
                              },
                              onCreate: () => {
                                if (loading) {
                                  ApiShop.getVoucher({
                                    page: 0,
                                    limit: 9999,
                                    date_confirm: true,
                                  }).then(r => {
                                    const voucherMap = new Map(r.response.data.map((item: any) => [item.id, item]));
                                    const sortedIds = new Set(vm.data.sorted_voucher.array); // 使用 Set 提高查找效率

                                    // 先按照 sorted_voucher.array 順序填充 dataList
                                    vm.data.sorted_voucher.array.forEach((id: number) => {
                                      const data = voucherMap.get(id);
                                      if (data) dataList.push(data);
                                    });

                                    // 加入其他未排序的 voucher
                                    r.response.data.forEach((item: any) => {
                                      if (!sortedIds.has(item.id)) {
                                        dataList.push(item);
                                      }
                                    });

                                    // 更新 sorted_voucher.array
                                    vm.data.sorted_voucher.array = dataList.map((item: any) => item.id);

                                    loading = false;
                                    gvc.notifyDataChange(id);
                                  });
                                } else if (dataList.length > 0) {
                                  gvc.addMtScript(
                                    [{ src: 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js' }],
                                    () => {
                                      const interval = setInterval(() => {
                                        const Sortable = (window as any).Sortable;
                                        if (!Sortable) return;

                                        clearInterval(interval);

                                        try {
                                          function swapArray(arr: any[], index1: number, index2: number) {
                                            if (index1 === index2) return;
                                            const [item] = arr.splice(index1, 1);
                                            arr.splice(index2, 0, item);
                                            vm.data.sorted_voucher.array = arr.map(item => item.id);
                                          }

                                          const dragEl = document.getElementById(dragId);
                                          if (!dragEl) {
                                            console.warn(`Element with id '${dragId}' not found.`);
                                            return;
                                          }

                                          Sortable.create(dragEl, {
                                            group: 'foo',
                                            animation: 150,
                                            onEnd(evt: any) {
                                              swapArray(dataList, evt.oldIndex, evt.newIndex);
                                            },
                                          });
                                        } catch (e) {
                                          console.error('SortableJS initialization error:', e);
                                        }
                                      }, 100);
                                    },
                                    () => console.error('Failed to load SortableJS')
                                  );
                                }
                              },
                            };
                          })()
                        ),
                      },
                    ],
                    [vm.data.sorted_voucher.toggle ? 'true' : 'false'],
                    text => {
                      vm.data.sorted_voucher.toggle = text[0] === 'true';
                    },
                    {
                      single: true,
                    }
                  ),
                ].join('')
              ),
              ...(() => {
                const form = BgWidget.customForm(gvc, [
                  {
                    key: 'custom_form_checkout',
                    title: html`<div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                      顧客資訊表單
                      <span style="color: #8D8D8D; font-size: 12px;">於結帳頁面中設定顧客必須填寫的顧客資訊表單</span>
                    </div>`,
                  },
                  {
                    key: 'custom_form_checkout_recipient',
                    title: html`
                      <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                        收件資訊表單
                        <span style="color: #8D8D8D; font-size: 12px;"
                          >於結帳頁面中設定顧客必須填寫的收件人資訊表單</span
                        >
                      </div>
                    `,
                  },
                ]);
                return [
                  form.view,
                  html` <div class="update-bar-container">
                    ${BgWidget.save(
                      gvc.event(async () => {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        saveEvent();
                        await form.save();
                        dialog.dataLoading({ visible: false });
                        dialog.successMessage({ text: '設定成功' });
                      })
                    )}
                  </div>`,
                ];
              })(),
              BgWidget.mbContainer(240),
            ].join(BgWidget.mbContainer(18))
          )}
        `);
      },
    });
  }
}

(window as any).glitter.setModule(import.meta.url, MemberSetting);
