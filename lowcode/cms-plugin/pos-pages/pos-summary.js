var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { PosWidget } from '../pos-widget.js';
import { PosFunction } from './pos-function.js';
import { ApiPos } from '../../glitter-base/route/pos.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { POSSetting } from '../POS-setting.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiUser } from '../../glitter-base/route/user.js';
const html = String.raw;
export class PosSummary {
    static in_pos() {
        return window.parent.glitter.getUrlParameter('page') !== 'cms';
    }
    static addSummary(gvc, refresh) {
        const dialog = new ShareDialog(gvc.glitter);
        const oGvc = gvc;
        dialog.dataLoading({ visible: true });
        ApiPos.getSummary(POSSetting.config.where_store).then((r) => __awaiter(this, void 0, void 0, function* () {
            const saasConfig = window.parent.saasConfig;
            const data = (yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_finance')).response
                .result[0].value;
            dialog.dataLoading({ visible: false });
            if (r.response.data.length) {
                const check_list = [
                    {
                        title: `現金`,
                        value: 'cash',
                        key: 'cash',
                        real: 0,
                    },
                    {
                        title: `刷卡`,
                        value: 'creditCard',
                        key: 'ut_credit_card',
                        real: 0,
                    },
                    {
                        title: `Line Pay`,
                        value: 'line',
                        key: 'line_pay_scan',
                        real: 0,
                    },
                ].filter(dd => {
                    return dd.key === 'cash' || data[dd.key].toggle;
                });
                BgWidget.settingDialog({
                    gvc: gvc,
                    d_main_style: 'padding-left:0px;padding-right:0px;',
                    title: '清點金額',
                    innerHTML: gvc => {
                        return html ` <div class="row m-0 p-0">
              <div class="col-6 d-flex flex-column" style="gap:5px;">
                <div class="fs-6 fw-500" style="color:#585858;">清點區間</div>
                <div class=" fw-500 fs-6">
                  ${gvc.glitter.ut.dateFormat(new Date(r.response.data[0].created_time), 'yyyy-MM-dd')}
                  ${gvc.glitter.ut.dateFormat(new Date(r.response.data[0].created_time), 'hh:mm')} -
                  ${gvc.glitter.ut.dateFormat(new Date(), 'hh:mm')}
                </div>
              </div>
              <div class="col-6 d-flex flex-column" style="gap:5px;">
                <div class="fs-6 fw-500" style="color:#585858;">操作人員</div>
                <div class=" fw-500 fs-6">
                  ${gvc.glitter.share.member_auth_list.find((d1) => {
                            return `${d1.user}` === `${POSSetting.config.who}`;
                        }).config.name}
                </div>
              </div>
              <div class="col-12 border-top my-2"></div>
              <div class="col-12 d-flex flex-column" style="gap:5px;">
                <div class="fs-6 fw-500" style="color:#585858;">付款方式</div>
                <div class="text-black fw-500 fs-6">
                  ${BgWidget.grayNote('請確實填寫清點金額，若留白自動填0，點擊下一步將無法修改金額')}
                </div>
              </div>
              <div class="col-12 border-top my-2"></div>
              ${check_list
                            .map(dd => {
                            return html `<div class="d-flex align-items-center col-12">
                    ${dd.title}
                    <div class="flex-fill"></div>
                    <div>
                      <input
                        class="form-control"
                        style="width:100px;"
                        placeholder="0"
                        onclick="${gvc.event((e, event) => {
                                PosFunction.setMoney(gvc, response => {
                                    dd.real = response || 0;
                                    e.value = response || 0;
                                }, '設定清點金額');
                            })}"
                      />
                    </div>
                  </div>`;
                        })
                            .join('  <div class="col-12 border-top my-2"></div>')}
            </div>`;
                    },
                    footer_html: gvc => {
                        return html ` <div class="d-flex align-items-center" style="gap:10px;">
              ${BgWidget.cancel(gvc.event(() => {
                            gvc.closeDialog();
                        }, '取消'))}
              ${BgWidget.save(gvc.event(() => {
                            PosSummary.checkSummary(check_list, oGvc, refresh);
                            gvc.closeDialog();
                        }), '下一步')}
            </div>`;
                    },
                });
            }
            else {
                let money = 0;
                const dialog = new ShareDialog(gvc.glitter);
                dialog.customCheck({
                    text: html `${PosWidget.fontBold('請先填寫備用金')}
            <div style="font-size:12px;color:gray;">備用金為開店前已存於錢箱中的錢</div>
            <input
              class="form-control mt-2"
              onclick="${gvc.event((e, event) => {
                        PosFunction.setMoney(gvc, response => {
                            e.value = `${response}`;
                            money = response || 0;
                        }, '設定備用金額');
                    })}"
              placeholder="請輸入金額"
            /> `,
                    callback: (response) => __awaiter(this, void 0, void 0, function* () {
                        if (response) {
                            const staff = GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID;
                            dialog.dataLoading({ visible: true });
                            yield ApiPos.setSummary({
                                staff: staff,
                                summary_type: 'reserve',
                                content: {
                                    need: money,
                                    real: money,
                                    store: POSSetting.config.where_store,
                                },
                            });
                            dialog.dataLoading({ visible: false });
                            dialog.successMessage({ text: '備用金新增成功' });
                            refresh();
                        }
                    }),
                });
            }
        }));
    }
    static checkSummary(check_list, gvc, refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ visible: true });
            ApiPos.getSummary(POSSetting.config.where_store).then((r) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const last_ = r.response.data[0].content;
                last_.check_list = (_a = last_.check_list) !== null && _a !== void 0 ? _a : [
                    {
                        key: 'cash',
                        real: last_.real,
                    },
                ];
                let order = yield ApiShop.getOrder({
                    page: 0,
                    limit: 1000,
                    filter: {
                        created_time: [new Date(r.response.data[0].created_time).toISOString(), new Date().toISOString()],
                    },
                });
                check_list.map((dd) => {
                    const fi_ = last_.check_list.find((d1) => {
                        return d1.key === dd.key;
                    });
                    dd.last_ = ((fi_ && fi_.real) || 0) - ((fi_ && fi_.export) || 0);
                    dd.payment = 0;
                });
                if (!order.result) {
                    dialog.dataLoading({ visible: false });
                    dialog.errorMessage({ text: '請檢查網路連線' });
                    return;
                }
                order.response.data
                    .filter((dd) => {
                    return dd.orderData.pos_info;
                })
                    .map((dd) => {
                    dd.orderData.pos_info.payment.map((dd) => {
                        const fi_ = check_list.find((d1) => {
                            return d1.key === dd.method;
                        });
                        fi_ && (fi_.payment += dd.total);
                    });
                });
                dialog.dataLoading({ visible: false });
                localStorage.setItem('checkSummaryDir', JSON.stringify({
                    check_list: check_list,
                    start: r.response.data[0].created_time,
                    end: new Date().toISOString(),
                }));
                this.checkSummaryDir(gvc);
            }));
        });
    }
    static checkSummaryDir(gvc) {
        function refresh() {
            gvc.recreateView();
        }
        const checkSummaryDir = JSON.parse(localStorage.getItem('checkSummaryDir'));
        BgWidget.settingDialog({
            gvc: gvc,
            d_main_style: 'padding-left:0px;padding-right:0px;',
            title: '確認金額',
            innerHTML: gvc => {
                try {
                    return html ` <div class="row m-0 p-0">
            <div class="col-6 d-flex flex-column" style="gap:5px;">
              <div class="fs-6 fw-500" style="color:#585858;">清點區間</div>
              <div class=" fw-500 fs-6">
                ${gvc.glitter.ut.dateFormat(new Date(checkSummaryDir.start), 'yyyy-MM-dd')}
                ${gvc.glitter.ut.dateFormat(new Date(checkSummaryDir.start), 'hh:mm')} -
                ${gvc.glitter.ut.dateFormat(new Date(checkSummaryDir.end), 'hh:mm')}
              </div>
            </div>
            <div class="col-6 d-flex flex-column" style="gap:5px;">
              <div class="fs-6 fw-500" style="color:#585858;">操作人員</div>
              <div class=" fw-500 fs-6">
                ${gvc.glitter.share.member_auth_list.find((d1) => {
                        return `${d1.user}` === `${POSSetting.config.who}`;
                    }).config.name}
              </div>
            </div>
            <div class="col-12 border-top my-2"></div>
            <div class="col-12 d-flex flex-column" style="gap:5px;">
              <div class="fs-6 fw-500" style="color:#585858;">付款方式</div>
              <div class="text-black fw-500 fs-6">${BgWidget.grayNote('若清點不符合，請填寫差額原因')}</div>
            </div>
            <div class="col-12 border-top my-2"></div>
            ${checkSummaryDir.check_list
                        .map((dd) => {
                        const last_m = dd.last_;
                        return html `<div class=" col-12">
                  <div class="d-flex align-items-center p-2">
                    ${dd.title}
                    <div class="flex-fill"></div>
                    ${last_m + dd.payment === dd.real
                            ? BgWidget.successInsignia('符合')
                            : BgWidget.dangerInsignia('不符合')}
                  </div>
                  <div class="d-flex flex-column ms-2 px-2 border-start">
                    ${[
                            html `<div class="d-flex w-100 align-items-center">
                        上期留存金額
                        <div class="flex-fill"></div>
                        $${last_m.toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        + 現金支付金額
                        <div class="flex-fill"></div>
                        $${dd.payment.toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        = 應有金額
                        <div class="flex-fill"></div>
                        $${(last_m + dd.payment).toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        實點金額
                        <div class="flex-fill"></div>
                        $${dd.real.toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        差異金額
                        <div class="flex-fill"></div>
                        ${dd.real - (last_m + dd.payment) === 0
                                ? '$0'
                                : `<span class="text-danger">${(dd.real - (last_m + dd.payment)).toLocaleString()}</span>`}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        <div style="white-space: nowrap;">備註</div>
                        <input
                          class="form-control flex-fill ms-2"
                          style=""
                          placeholder="請輸入備註"
                          onchange="${gvc.event((e, event) => {
                                dd.note = e.value;
                            })}"
                          value="${dd.note || ''}"
                        />
                      </div>`,
                        ].join(html `<div class="my-2"></div>`)}
                  </div>
                </div>`;
                    })
                        .join(html ` <div class="col-12 border-top my-2"></div> `)}
          </div>`;
                }
                catch (e) {
                    console.error(e);
                    return `${e}`;
                }
            },
            footer_html: gvc => {
                return html ` <div class="d-flex align-items-center" style="gap:10px;">
          ${BgWidget.cancel(gvc.event(() => {
                    gvc.closeDialog();
                }, '取消'))}
          ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                    const staff = GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID;
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.dataLoading({ visible: true });
                    yield ApiPos.setSummary({
                        staff: staff,
                        summary_type: 'summary',
                        content: {
                            need: checkSummaryDir.check_list
                                .map((dd) => {
                                return dd.last_ + dd.payment;
                            })
                                .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
                            real: checkSummaryDir.check_list
                                .map((dd) => {
                                return dd.real;
                            })
                                .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
                            check_list: checkSummaryDir.check_list,
                            start: checkSummaryDir.start,
                            end: checkSummaryDir.end,
                            store: POSSetting.config.where_store,
                        },
                    });
                    dialog.dataLoading({ visible: false });
                    gvc.closeDialog();
                    localStorage.removeItem('checkSummaryDir');
                    refresh();
                })), '完成')}
        </div>`;
            },
        });
    }
    static showInfo(gvc, data, last) {
        function refresh() {
            gvc.recreateView();
        }
        const checkSummaryDir = data.content;
        const export_ = checkSummaryDir.check_list.find((dd) => {
            return dd.key === 'cash';
        }).export || 0;
        BgWidget.settingDialog({
            gvc: gvc,
            d_main_style: 'padding-left:0px;padding-right:0px;',
            title: '確認金額',
            innerHTML: gvc => {
                try {
                    return html ` <div class="row m-0 p-0">
            <div class="col-6 d-flex flex-column" style="gap:5px;">
              <div class="fs-6 fw-500" style="color:#585858;">清點區間</div>
              <div class=" fw-500 fs-6">
                ${gvc.glitter.ut.dateFormat(new Date(checkSummaryDir.start), 'yyyy-MM-dd')}
                ${gvc.glitter.ut.dateFormat(new Date(checkSummaryDir.start), 'hh:mm')} -
                ${gvc.glitter.ut.dateFormat(new Date(checkSummaryDir.end), 'hh:mm')}
              </div>
            </div>
            <div class="col-6 d-flex flex-column" style="gap:5px;">
              <div class="fs-6 fw-500" style="color:#585858;">操作人員</div>
              <div class=" fw-500 fs-6">
                ${gvc.glitter.share.member_auth_list.find((d1) => {
                        return `${d1.user}` === `${data.staff}`;
                    }).config.name}
              </div>
            </div>
            <div class="col-12 ${export_ ? `d-flex` : `d-none`} flex-column mt-2" style="gap:5px;">
              <div class="fs-6 fw-500" style="color:#585858;">現金匯出</div>
              <div class="text-success fw-500 fs-6 ">$${export_.toLocaleString()}</div>
            </div>

            <div class="col-12 border-top my-2"></div>
            ${checkSummaryDir.check_list
                        .map((dd) => {
                        const last_m = dd.last_;
                        return html `<div class=" col-12">
                  <div class="d-flex align-items-center p-2">
                    ${dd.title}
                    <div class="flex-fill"></div>
                    ${dd.last_ + dd.payment === dd.real
                            ? BgWidget.successInsignia('符合')
                            : BgWidget.dangerInsignia('不符合')}
                  </div>
                  <div class="d-flex flex-column ms-2 px-2 border-start">
                    ${[
                            html `<div class="d-flex w-100 align-items-center">
                        上期留存金額
                        <div class="flex-fill"></div>
                        $${last_m.toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        + 現金支付金額
                        <div class="flex-fill"></div>
                        $${dd.payment.toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        = 應有金額
                        <div class="flex-fill"></div>
                        $${(last_m + dd.payment).toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        實點金額
                        <div class="flex-fill"></div>
                        $${dd.real.toLocaleString()}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        差異金額
                        <div class="flex-fill"></div>
                        ${dd.real - (last_m + dd.payment) === 0
                                ? '$0'
                                : `<span class="text-danger">${(dd.real - (last_m + dd.payment)).toLocaleString()}</span>`}
                      </div>`,
                            html `<div class="d-flex w-100 align-items-center">
                        <div style="white-space: nowrap;">備註</div>
                        <input
                          class="form-control flex-fill ms-2"
                          style=""
                          placeholder="請輸入備註"
                          value="${dd.note || ''}"
                          readonly
                        />
                      </div>`,
                        ].join(html `<div class="my-2"></div>`)}
                  </div>
                </div>`;
                    })
                        .join(html `<div class="col-12 border-top my-2"></div>`)}
          </div>`;
                }
                catch (e) {
                    console.error(e);
                    return `${e}`;
                }
            },
            footer_html: gvc => {
                const dialog = new ShareDialog(gvc.glitter);
                return html ` <div class="d-flex align-items-center" style="gap:10px;">
          ${BgWidget.cancel(gvc.event(() => {
                    gvc.closeDialog();
                }), '關閉')}
          ${data.summary_type === 'daily' || !last
                    ? ''
                    : BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                        let money = 0;
                        let min_ = checkSummaryDir.check_list.find((dd) => {
                            return dd.key === 'cash';
                        }).real;
                        dialog.customCheck({
                            text: html `${PosWidget.fontBold('要從錢箱匯出的金額')}
                      <input
                        class="form-control mt-2"
                        onclick="${gvc.event((e, event) => {
                                PosFunction.setMoney(gvc, response => {
                                    if (response > min_) {
                                        dialog.errorMessage({ text: '錢箱金額不足' });
                                    }
                                    else {
                                        e.value = `${response}`;
                                        money = response || 0;
                                    }
                                }, '匯出金額');
                            })}"
                        placeholder="請輸入金額"
                      /> `,
                            callback: (response) => __awaiter(this, void 0, void 0, function* () {
                                if (response) {
                                    const staff = GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID;
                                    dialog.dataLoading({ visible: true });
                                    checkSummaryDir.check_list.find((dd) => {
                                        return dd.key === 'cash';
                                    }).export = money;
                                    yield ApiPos.setSummary({
                                        id: data.id,
                                        staff: staff,
                                        summary_type: 'daily',
                                        content: {
                                            need: checkSummaryDir.check_list
                                                .map((dd) => {
                                                return dd.last_ + dd.payment;
                                            })
                                                .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
                                            real: checkSummaryDir.check_list
                                                .map((dd) => {
                                                return dd.real;
                                            })
                                                .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
                                            check_list: checkSummaryDir.check_list,
                                            start: checkSummaryDir.start,
                                            end: checkSummaryDir.end,
                                            store: POSSetting.config.where_store,
                                        },
                                    });
                                    dialog.dataLoading({ visible: false });
                                    gvc.closeDialog();
                                    localStorage.removeItem('checkSummaryDir');
                                    refresh();
                                }
                            }),
                        });
                    })), '設為日結單')}
        </div>`;
            },
        });
    }
    static main(obj) {
        const gvc = obj.gvc;
        const table_id = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            const init_id = gvc.glitter.getUUID();
            let store_list = [];
            const vm = {
                loading: PosSummary.in_pos(),
            };
            function initialStore() {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    if (!PosSummary.in_pos()) {
                        const [store_d, member_auth] = yield Promise.all([
                            ApiUser.getPublicConfig('store_manager', 'manager'),
                            ApiUser.getPermission({
                                page: 0,
                                limit: 100,
                            }),
                        ]);
                        gvc.glitter.share.member_auth_list = member_auth.response.data.filter((dd) => {
                            return dd.invited && dd.status;
                        });
                        window.parent.glitter.share.member_auth_list = gvc.glitter.share.member_auth_list;
                        const store = (_a = store_d.response.value.list) !== null && _a !== void 0 ? _a : [];
                        store_list = store.filter((dd) => {
                            return dd.is_shop;
                        });
                        if (!store_list.length) {
                            vm.loading = true;
                            gvc.notifyDataChange(init_id);
                            return;
                        }
                        POSSetting.config.where_store = store.find((dd) => {
                            return dd.is_shop;
                        }).id;
                        vm.loading = true;
                        gvc.notifyDataChange(init_id);
                    }
                });
            }
            initialStore();
            return {
                bind: init_id,
                view: () => {
                    if (!vm.loading) {
                        return BgWidget.spinner();
                    }
                    if (!store_list.length && !this.in_pos()) {
                        return `<div class="mt-5">${BgWidget.warningInsignia('尚未設定任何門市，請先前往門市設定新增門市。')}</div>`;
                    }
                    return BgWidget.container(html `
            <div class="title-container ${PosSummary.in_pos() ? `mb-4` : ''}">
              ${BgWidget.title('小結紀錄')}
              <div class="flex-fill"></div>
              ${PosSummary.in_pos()
                        ? BgWidget.darkButton('新增小結單', obj.gvc.event(() => {
                            if (localStorage.getItem('checkSummaryDir')) {
                                this.checkSummaryDir(gvc);
                            }
                            else {
                                this.addSummary(gvc, () => {
                                    gvc.notifyDataChange(table_id);
                                });
                            }
                        }))
                        : ''}
            </div>
            ${PosSummary.in_pos()
                        ? ''
                        : BgWidget.tab(store_list.map((dd) => {
                            return {
                                title: dd.name,
                                key: dd.id,
                            };
                        }), gvc, POSSetting.config.where_store, dd => {
                            POSSetting.config.where_store = dd;
                            gvc.notifyDataChange(init_id);
                        })}
            ${BgWidget.mainCard(gvc.bindView(() => {
                        let data = [];
                        return {
                            bind: table_id,
                            view: () => {
                                return BgWidget.tableV3({
                                    gvc: obj.gvc,
                                    getData: vd => {
                                        let vmi = vd;
                                        const limit = 10;
                                        ApiPos.getSummary(POSSetting.config.where_store).then(r => {
                                            function getDatalist() {
                                                return r.response.data
                                                    .map((dd) => {
                                                    try {
                                                        const content = dd.content;
                                                        return [
                                                            {
                                                                key: '建立日期',
                                                                value: html `<span class="fs-7"
                                        >${obj.gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span
                                      >`,
                                                            },
                                                            {
                                                                key: '操作人員',
                                                                value: html `<span class="fs-7"
                                        >${gvc.glitter.share.member_auth_list.find((d1) => {
                                                                    return `${d1.user}` === `${dd.staff}`;
                                                                }).config.name}</span
                                      >`,
                                                            },
                                                            {
                                                                key: '應有金額',
                                                                value: html `<span class="fs-7"> ${content.need.toLocaleString()} </span>`,
                                                            },
                                                            {
                                                                key: '實點金額',
                                                                value: html `<span class="fs-7"> ${content.real.toLocaleString()} </span>`,
                                                            },
                                                            {
                                                                key: '小結結果',
                                                                value: html `<span class="fs-7"
                                        >${(() => {
                                                                    switch (dd.summary_type) {
                                                                        case 'reserve':
                                                                            return BgWidget.infoInsignia('備用金');
                                                                        default:
                                                                            if (content.real !== content.need) {
                                                                                return BgWidget.dangerInsignia('不符合');
                                                                            }
                                                                            else {
                                                                                return BgWidget.successInsignia('符合');
                                                                            }
                                                                    }
                                                                })()}</span
                                      >`,
                                                            },
                                                            {
                                                                key: '當日最終筆',
                                                                value: html ` <div
                                        class="fs-5 ${dd.summary_type === 'daily'
                                                                    ? `d-flex`
                                                                    : `d-none`} align-items-center justify-content-center  rounded-circle bg-success text-white rounded-circle"
                                        style="width:30px;height:30px;"
                                      >
                                        <i class="fa-solid fa-check"></i>
                                      </div>`,
                                                            },
                                                        ];
                                                    }
                                                    catch (e) {
                                                        return [];
                                                    }
                                                })
                                                    .filter((dd) => {
                                                    return dd.length;
                                                });
                                            }
                                            if (r.result && r.response.data) {
                                                data = r.response.data;
                                                vmi.pageSize = Math.ceil(r.response.total / limit);
                                                vmi.tableData = getDatalist();
                                            }
                                            else {
                                                vmi.pageSize = 0;
                                                vmi.originalData = [];
                                                vmi.tableData = [];
                                            }
                                            vmi.loading = false;
                                            vmi.callback();
                                        });
                                    },
                                    rowClick: (s, index) => {
                                        if (data[index].summary_type !== 'reverse') {
                                            this.showInfo(gvc, data[index], index === 0);
                                        }
                                    },
                                    filter: [],
                                });
                            },
                        };
                    }))}
          `);
                },
                divCreate: {
                    class: 'w-100 justify-content-center d-flex',
                    style: PosSummary.in_pos() ? 'padding: 0 1rem;' : '',
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, PosSummary);
