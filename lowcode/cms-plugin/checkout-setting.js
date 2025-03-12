var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
export class MemberSetting {
    static main(gvc) {
        const html = String.raw;
        const vm = {
            id: gvc.glitter.getUUID(),
            data: {},
            loading: true,
        };
        ApiUser.getPublicConfig('login_config', 'manager').then(dd => {
            vm.loading = false;
            dd.response.value && (vm.data = dd.response.value);
            gvc.notifyDataChange(vm.id);
        });
        function saveEvent() {
            ApiUser.setPublicConfig({
                key: 'login_config',
                value: vm.data,
                user_id: 'manager',
            }).then(() => { });
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return ``;
                    }
                    return BgWidget.container(html `
            <div class="title-container">
              ${BgWidget.title('結帳設定')}
              <div class="flex-fill"></div>
            </div>
            ${BgWidget.container([
                        BgWidget.mainCard([
                            html ` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                      允許訪客結帳
                      <span style="color:#8D8D8D;font-size: 12px;"
                        >關閉代表必須是註冊會員後才可進行結帳，開啟則允許訪客結帳</span
                      >
                    </div>`,
                            html ` <div class="d-flex align-items-center w-100" style="gap:4px;margin-bottom: 12px;">
                      <div class="tx_normal ms-1">${vm.data.login_in_to_order ? `關閉` : `開啟`}</div>
                      <div class="cursor_pointer form-check form-switch m-0">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          onchange="${gvc.event(() => {
                                vm.data.login_in_to_order = !vm.data.login_in_to_order;
                                saveEvent();
                                gvc.notifyDataChange(vm.id);
                            })}"
                          ${vm.data.login_in_to_order ? `` : `checked`}
                        />
                      </div>
                      <div class="flex-fill"></div>
                    </div>`,
                        ].join('')),
                        BgWidget.mainCard([
                            html ` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                      顧客手動取消訂單
                      <span class="" style="color:#8D8D8D;font-size: 12px;">顧客可自行取消自己未付款未出貨的訂單</span>
                    </div>`,
                            html ` <div class="d-flex align-items-center w-100" style="gap:4px;margin-bottom: 12px;">
                      <div class="tx_normal ms-1">${vm.data.customer_cancel_order ? `開啟` : `關閉`}</div>
                      <div class="cursor_pointer form-check form-switch m-0">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          onchange="${gvc.event(() => {
                                vm.data.customer_cancel_order = !vm.data.customer_cancel_order;
                                saveEvent();
                                gvc.notifyDataChange(vm.id);
                            })}"
                          ${vm.data.customer_cancel_order ? `checked` : ``}
                        />
                      </div>
                      <div class="flex-fill"></div>
                    </div>`,
                        ].join('')),
                        BgWidget.mainCard([
                            html ` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                      系統自動取消訂單
                      <span class="" style="color:#8D8D8D;font-size: 12px;"
                        >若顧客在指定時間內未付款，系統會自動取消訂單，輸入 0 則永不取消訂單</span
                      >
                    </div>`,
                            html ` <div class="d-flex align-items-center w-100" style="gap:4px;">
                      ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                default: `${(_a = vm.data.auto_cancel_order_timer) !== null && _a !== void 0 ? _a : 0}`,
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
                        ].join('')),
                        ...(() => {
                            const form = BgWidget.customForm(gvc, [
                                {
                                    key: 'custom_form_checkout',
                                    title: html ` <div
                        class="tx_normal fw-bolder mt-2 d-flex flex-column"
                        style="margin-bottom: 12px;"
                      >
                        顧客資訊表單
                        <span class="" style="color:#8D8D8D;font-size: 12px;"
                          >於結帳頁面中設定顧客必須填寫的顧客資訊表單</span
                        >
                      </div>`,
                                },
                                {
                                    key: 'custom_form_checkout_recipient',
                                    title: html `
                        <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                          收件資訊表單
                          <span class="" style="color:#8D8D8D;font-size: 12px;"
                            >於結帳頁面中設定顧客必須填寫的收件人資訊表單</span
                          >
                        </div>
                      `,
                                },
                            ]);
                            return [
                                form.view,
                                html ` <div class="update-bar-container">
                      ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.dataLoading({ visible: true });
                                    saveEvent();
                                    yield form.save();
                                    dialog.dataLoading({ visible: false });
                                    dialog.successMessage({ text: '設定成功' });
                                })))}
                    </div>`,
                            ];
                        })(),
                        BgWidget.mbContainer(240),
                    ].join(BgWidget.mbContainer(24)))}
          `);
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, MemberSetting);
