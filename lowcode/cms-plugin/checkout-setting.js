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
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { Tool } from '../modules/tool.js';
export class MemberSetting {
    static main(gvc) {
        const html = String.raw;
        const vm = {
            id: gvc.glitter.getUUID(),
            data: {},
            loading: true,
        };
        ApiUser.getPublicConfig('login_config', 'manager').then(dd => {
            var _a;
            vm.loading = false;
            vm.data = Object.assign({ sorted_voucher: {
                    toggle: false,
                    array: [],
                } }, ((_a = dd.response.value) !== null && _a !== void 0 ? _a : {}));
            gvc.notifyDataChange(vm.id);
        });
        function saveEvent() {
            ApiUser.setPublicConfig({ key: 'login_config', value: vm.data, user_id: 'manager' });
        }
        return gvc.bindView({
            bind: vm.id,
            view: () => {
                var _a;
                if (vm.loading) {
                    return '';
                }
                return BgWidget.container(html `
          <div class="title-container">
            ${BgWidget.title('結帳設定')}
            <div class="flex-fill"></div>
          </div>
          ${BgWidget.container([
                    BgWidget.mainCard([
                        html `<div class="tx_normal fw-bolder">允許訪客結帳</div>`,
                        BgWidget.grayNote('關閉代表必須是註冊會員後才可進行結帳，開啟則允許訪客結帳'),
                        html ` <div class="d-flex align-items-center w-100 mt-3">
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
                    ].join('')),
                    BgWidget.mainCard([
                        html `<div class="tx_normal fw-bolder">顧客手動取消訂單</div>`,
                        BgWidget.grayNote('顧客可自行取消自己未付款未出貨的訂單'),
                        html ` <div class="d-flex align-items-center w-100 mt-3">
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
                    ].join('')),
                    BgWidget.mainCard([
                        html `<div class="tx_normal fw-bolder">系統自動取消訂單</div>`,
                        BgWidget.grayNote('若顧客在指定時間內未付款，系統會自動取消訂單，輸入 0 則永不取消訂單'),
                        html ` <div class="d-flex align-items-center w-100 mt-1">
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
                    BgWidget.mainCard([
                        html ` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                    優惠卷優先級
                  </div>`,
                        BgWidget.multiCheckboxContainer(gvc, [
                            {
                                key: 'false',
                                name: '優先使用折扣較高的優惠',
                            },
                            {
                                key: 'true',
                                name: '手動調整優惠卷順序',
                                innerHtml: gvc.bindView((() => {
                                    const id = gvc.glitter.getUUID();
                                    const dragId = Tool.randomString(7);
                                    const dataList = [];
                                    let loading = true;
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (loading) {
                                                return BgWidget.spinner();
                                            }
                                            return dataList
                                                .map((item) => {
                                                return html `<div data-index="${item.id}" class="drag-badge drag-badge-warning">
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
                                                    const voucherMap = new Map(r.response.data.map((item) => [item.id, item]));
                                                    const sortedIds = new Set(vm.data.sorted_voucher.array);
                                                    vm.data.sorted_voucher.array.forEach((id) => {
                                                        const data = voucherMap.get(id);
                                                        if (data)
                                                            dataList.push(data);
                                                    });
                                                    r.response.data.forEach((item) => {
                                                        if (!sortedIds.has(item.id)) {
                                                            dataList.push(item);
                                                        }
                                                    });
                                                    vm.data.sorted_voucher.array = dataList.map((item) => item.id);
                                                    loading = false;
                                                    gvc.notifyDataChange(id);
                                                });
                                            }
                                            else if (dataList.length > 0) {
                                                gvc.addMtScript([{ src: 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js' }], () => {
                                                    const interval = setInterval(() => {
                                                        const Sortable = window.Sortable;
                                                        if (!Sortable)
                                                            return;
                                                        clearInterval(interval);
                                                        try {
                                                            function swapArray(arr, index1, index2) {
                                                                if (index1 === index2)
                                                                    return;
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
                                                                onEnd(evt) {
                                                                    swapArray(dataList, evt.oldIndex, evt.newIndex);
                                                                },
                                                            });
                                                        }
                                                        catch (e) {
                                                            console.error('SortableJS initialization error:', e);
                                                        }
                                                    }, 100);
                                                }, () => console.error('Failed to load SortableJS'));
                                            }
                                        },
                                    };
                                })()),
                            },
                        ], [vm.data.sorted_voucher.toggle ? 'true' : 'false'], text => {
                            vm.data.sorted_voucher.toggle = text[0] === 'true';
                        }, {
                            single: true,
                        }),
                    ].join('')),
                    ...(() => {
                        const form = BgWidget.customForm(gvc, [
                            {
                                key: 'custom_form_checkout',
                                title: html `<div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                      顧客資訊表單
                      <span style="color: #8D8D8D; font-size: 12px;">於結帳頁面中設定顧客必須填寫的顧客資訊表單</span>
                    </div>`,
                            },
                            {
                                key: 'custom_form_checkout_recipient',
                                title: html `
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
                ].join(BgWidget.mbContainer(18)))}
        `);
            },
        });
    }
}
window.glitter.setModule(import.meta.url, MemberSetting);
