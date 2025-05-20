var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgProduct } from '../backend-manager/bg-product.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { Tool } from '../modules/tool.js';
import { ShipmentConfig } from '../glitter-base/global/shipment-config.js';
const html = String.raw;
export class ShoppingDiscountSetting {
    static main(gvc, voucher_type) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const vm = {
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: undefined,
        };
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
              <div class="title-container">
                ${BgWidget.title(ShoppingDiscountSetting.getLabel(voucher_type))}
                <div class="flex-fill"></div>
                ${BgWidget.darkButton(`新增${ShoppingDiscountSetting.getLabel(voucher_type)}`, gvc.event(() => {
                            vm.data = undefined;
                            vm.type = 'add';
                        }))}
              </div>
              ${BgWidget.container(BgWidget.mainCard([
                            BgWidget.searchPlace(gvc.event(e => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有折扣'),
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: vmi => {
                                    const limit = 20;
                                    ApiShop.getVoucher({
                                        page: vmi.page - 1,
                                        limit: limit,
                                        search: vm.query || undefined,
                                        voucher_type: voucher_type,
                                    }).then(data => {
                                        const triggerLabels = {
                                            auto: '自動',
                                            code: '輸入代碼',
                                            distribution: '分銷 & 一頁式',
                                        };
                                        function getDatalist() {
                                            return data.response.data.map((dd) => {
                                                var _b, _c;
                                                return [
                                                    {
                                                        key: '標題',
                                                        value: html `<span class="fs-7">${dd.content.title}</span>`,
                                                    },
                                                    {
                                                        key: '狀態',
                                                        value: html ` <div style="min-width: 80px;">
                                    ${dd.content.status
                                                            ? BgWidget.successInsignia('啟用中')
                                                            : BgWidget.secondaryInsignia('已停用')}
                                  </div>`,
                                                    },
                                                    {
                                                        key: '觸發方式',
                                                        value: html `<span class="fs-7">
                                    ${(_b = triggerLabels[dd.content.trigger]) !== null && _b !== void 0 ? _b : '尚未設定'}
                                  </span>`,
                                                    },
                                                    {
                                                        key: '套用至',
                                                        value: html `<span class="fs-7"
                                    >${(_c = ShoppingDiscountSetting.productForList.find(item => item.value === dd.content.for)) === null || _c === void 0 ? void 0 : _c.title}</span
                                  >`,
                                                    },
                                                    {
                                                        key: '折扣項目',
                                                        value: html `<span class="fs-7"
                                    >${dd.content.method === 'percent'
                                                            ? `折扣${dd.content.value}%`
                                                            : `折扣$${dd.content.value}`}</span
                                  >`,
                                                    },
                                                ];
                                            });
                                        }
                                        vm.dataList = data.response.data;
                                        vmi.pageSize = Math.ceil(data.response.total / limit);
                                        vmi.originalData = vm.dataList;
                                        vmi.tableData = getDatalist();
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => {
                                    vm.data = vm.dataList[index].content;
                                    vm.type = 'replace';
                                },
                                filter: [
                                    {
                                        name: '批量移除',
                                        event: () => {
                                            dialog.checkYesOrNot({
                                                text: '是否確認刪除所選項目？',
                                                callback: response => {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        ApiShop.deleteVoucher({
                                                            id: vm.dataList
                                                                .filter((dd) => {
                                                                return dd.checked;
                                                            })
                                                                .map((dd) => {
                                                                return dd.id;
                                                            })
                                                                .join(`,`),
                                                        }).then(res => {
                                                            dialog.dataLoading({ visible: false });
                                                            if (res.result) {
                                                                vm.dataList = undefined;
                                                                gvc.notifyDataChange(id);
                                                            }
                                                            else {
                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                            }
                                                        });
                                                    }
                                                },
                                            });
                                        },
                                    },
                                ],
                            }),
                        ].join('')))}
              ${BgWidget.mbContainer(120)}
            `);
                    }
                    else if (vm.type == 'replace') {
                        return this.voucherEditorV2({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                            reBackType: voucher_type,
                        });
                    }
                    else {
                        return this.voucherEditorV2({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                            reBackType: voucher_type,
                        });
                    }
                },
            };
        });
    }
    static getLabel(voucher_type) {
        var _b;
        const labels = {
            giveaway: '贈品活動',
            add_on_items: '加價購活動',
            discount: '折扣活動',
            rebate: '回饋金活動',
            shipment_free: '免運費活動',
        };
        return (_b = labels[voucher_type]) !== null && _b !== void 0 ? _b : '未知活動';
    }
    static summaryTextList(voucherData) {
        var _b, _c;
        return [
            `活動標題：${voucherData.title && voucherData.title.length > 0 ? voucherData.title : '尚無標題'}`,
            `適用商品：${(() => {
                const forData = ShoppingDiscountSetting.productForList.find(item => item.value === voucherData.for);
                return forData ? forData.title : '';
            })()}`,
            `活動方式：${(() => {
                var _b;
                if (voucherData.trigger === 'auto')
                    return '自動折扣';
                if (voucherData.trigger === 'distribution')
                    return '分銷連結';
                if (voucherData.trigger === 'code')
                    return `優惠代碼「${(_b = voucherData.code) !== null && _b !== void 0 ? _b : ''}」`;
                return '';
            })()}`,
            `活動對象：${(() => {
                const targetMapping = {
                    customer: '特定顧客',
                    levels: '會員等級',
                    group: '顧客分群',
                    all: '所有顧客',
                };
                return targetMapping[voucherData.target] || targetMapping.all;
            })()}`,
            '',
            `消費條件：${(() => {
                if (voucherData.rule === 'min_price')
                    return '最少消費金額';
                if (voucherData.rule === 'min_count')
                    return '最少購買數量';
                return '';
            })()}`,
            `條件值：${(() => {
                if (voucherData.rule === 'min_price')
                    return voucherData.ruleValue + ' 元';
                if (voucherData.rule === 'min_count')
                    return voucherData.ruleValue + ' 個';
                return '';
            })()}`,
            `折扣優惠：${(() => {
                const voucherMessages = {
                    rebate: (method, value) => method === 'fixed' ? `${value} 點購物金` : `符合條件商品總額的 ${value} ％作為購物金`,
                    discount: (method, value) => (method === 'fixed' ? `折扣 ${value} 元` : `符合條件商品折扣 ${value} ％`),
                    shipment_free: () => '免運費',
                };
                const messageFunction = voucherMessages[voucherData.reBackType];
                return messageFunction ? messageFunction(voucherData.method, voucherData.value) : '';
            })()}`,
            `將此優惠套用至：${(() => {
                var _b, _c;
                const length = (_c = (_b = voucherData.forKey) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                const forMaps = {
                    collection: `指定 ${length} 種商品分類`,
                    product: `指定 ${length} 個商品`,
                    all: '所有商品',
                };
                return forMaps[voucherData.for] || forMaps.all;
            })()}`,
            '',
            voucherData.overlay ? '可以疊加，套用最大優惠' : '不可疊加',
            `啟用時間：${(_b = voucherData.startDate) !== null && _b !== void 0 ? _b : '未設定日期'} ${(_c = voucherData.startTime) !== null && _c !== void 0 ? _c : '尚未設定時間'}`,
            `結束時間：${(() => {
                var _b, _c;
                if (!voucherData.endDate)
                    return '無期限';
                return `${(_b = voucherData.endDate) !== null && _b !== void 0 ? _b : '未設定日期'} ${(_c = voucherData.endTime) !== null && _c !== void 0 ? _c : '尚未設定時間'}`;
            })()}`,
        ];
    }
    static voucherEditorV2(obj) {
        const gvc = obj.gvc;
        const vm = obj.vm;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const getUUID = glitter.getUUID;
        const pageVM = {
            viewID: getUUID(),
        };
        const voucherData = Object.assign(Object.assign({}, this.emptyVoucher(obj.reBackType)), vm.data);
        const cloneForKey = (key) => JSON.parse(JSON.stringify(key));
        const setTitle = (title) => html ` <div class="tx_700">${title}</div>`;
        const voucherSettingCard = (array) => BgWidget.mainCard(array
            .map(stringArray => stringArray.filter(Boolean))
            .filter(stringArray => stringArray.length > 0)
            .map(stringArray => stringArray.join(BgWidget.mbContainer(18)))
            .join(BgWidget.horizontalLine({ margin: '18px 0' })));
        return gvc.bindView({
            bind: pageVM.viewID,
            view: () => {
                const ruleValue = voucherData.ruleValue;
                const isPercentMethod = voucherData.method === 'percent';
                const isShipmentFree = voucherData.reBackType === 'shipment_free';
                const floor = Math.floor(ruleValue / 2);
                if (isPercentMethod || isShipmentFree) {
                    voucherData.counting = 'single';
                }
                if (isShipmentFree) {
                    voucherData.conditionType = 'order';
                }
                if (!voucherData.forKey) {
                    voucherData.forKey = [];
                }
                if (!Array.isArray(voucherData.add_on_products)) {
                    voucherData.add_on_products = [];
                }
                const defKeys = {
                    all: [],
                    collection: cloneForKey(voucherData.forKey),
                    product: cloneForKey(voucherData.forKey),
                    manager_tag: cloneForKey(voucherData.forKey),
                };
                function status() {
                    return html ` <div class="d-flex gap-1">
            <div class="tx_normal">活動啟用</div>
            ${BgWidget.switchTextButton(gvc, voucherData.status === 1, {}, bool => {
                        voucherData.status = bool ? 1 : 0;
                    })}
          </div>`;
                }
                function title() {
                    return html ` <div class="tx_normal">活動標題${BgWidget.requiredStar()}</div>
            ${BgWidget.mbContainer(8)}
            ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: voucherData.title,
                        placeHolder: '請輸入活動標題',
                        callback: text => {
                            voucherData.title = text;
                        },
                    })}`;
                }
                function trigger() {
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'auto',
                            name: '自動折扣',
                            innerHtml: BgWidget.grayNote('顧客將在結帳時自動獲得折扣'),
                        },
                        {
                            key: 'code',
                            name: '優惠代碼',
                            innerHtml: (() => {
                                const id = getUUID();
                                return gvc.bindView({
                                    bind: id,
                                    view: () => {
                                        var _b;
                                        return gvc.map([
                                            BgWidget.grayNote('顧客可在結帳時輸入優惠代碼，來獲得折扣'),
                                            BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: (_b = voucherData.code) !== null && _b !== void 0 ? _b : '',
                                                placeHolder: '請輸入優惠券代碼',
                                                callback: text => {
                                                    voucherData.code = text.toUpperCase();
                                                },
                                                endText: html ` <div class="d-flex justify-content-end">
                            ${BgWidget.mbContainer(8)}
                            ${BgWidget.blueNote(document.body.clientWidth > 768 ? '隨機產生優惠代碼' : '隨機產生', gvc.event(() => {
                                                    voucherData.code = Tool.randomString(6).toUpperCase();
                                                    gvc.notifyDataChange(id);
                                                }))}
                          </div>`,
                                            }),
                                        ]);
                                    },
                                });
                            })(),
                        },
                        {
                            key: 'distribution',
                            name: '供特定賣場優惠使用',
                            innerHtml: BgWidget.grayNote('僅限於隱形賣場 / 一頁商店 / 拼團賣場 / 分銷連結使用'),
                        },
                    ], [voucherData.trigger], text => {
                        if (text[0] === 'auto') {
                            voucherData.code = undefined;
                        }
                        if (text[0] === 'distribution') {
                            voucherData.for = 'all';
                        }
                        voucherData.trigger = text[0];
                        gvc.notifyDataChange(pageVM.viewID);
                    }, { single: true });
                }
                function target() {
                    return gvc.bindView(() => {
                        const id = getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _b;
                                return html `
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${BgWidget.selectFilter({
                                    gvc: gvc,
                                    callback: text => {
                                        voucherData.target = text;
                                        gvc.notifyDataChange(id);
                                    },
                                    default: (_b = voucherData.target) !== null && _b !== void 0 ? _b : 'all',
                                    options: [
                                        {
                                            key: 'all',
                                            value: '所有顧客',
                                        },
                                        {
                                            key: 'customer',
                                            value: '特定顧客',
                                        },
                                        {
                                            key: 'levels',
                                            value: '會員等級',
                                        },
                                    ],
                                    style: 'width: 100%;',
                                })}
                    <div>
                      ${(() => {
                                    switch (voucherData.target) {
                                        case 'all':
                                            return '';
                                        case 'customer':
                                            return gvc.bindView(() => {
                                                const customVM = {
                                                    id: getUUID(),
                                                    loading: true,
                                                    dataList: [],
                                                };
                                                return {
                                                    bind: customVM.id,
                                                    view: () => {
                                                        if (customVM.loading) {
                                                            return BgWidget.spinner();
                                                        }
                                                        return html `
                                    <div class="d-flex flex-column p-2" style="gap: 18px;">
                                      <div
                                        class="d-flex align-items-center gray-bottom-line-18"
                                        style="justify-content: space-between;"
                                      >
                                        <div class="form-check-label c_updown_label">
                                          <div class="tx_normal">顧客名稱</div>
                                        </div>
                                        ${BgWidget.grayButton('查看全部', gvc.event(() => {
                                                            var _b;
                                                            BgWidget.selectDropDialog({
                                                                gvc: gvc,
                                                                title: '搜尋特定顧客',
                                                                tag: 'select_users',
                                                                updownOptions: FilterOptions.userOrderBy,
                                                                callback: value => {
                                                                    voucherData.targetList = value;
                                                                    customVM.loading = true;
                                                                    gvc.notifyDataChange(customVM.id);
                                                                },
                                                                default: ((_b = voucherData.targetList) !== null && _b !== void 0 ? _b : []).map(id => id.toString()),
                                                                api: (data) => {
                                                                    return new Promise(resolve => {
                                                                        ApiUser.getUserListOrders({
                                                                            page: 0,
                                                                            limit: 99999,
                                                                            search: data.query,
                                                                            orderString: data.orderString,
                                                                            only_id: true,
                                                                        }).then(dd => {
                                                                            if (dd.response.data) {
                                                                                resolve(dd.response.data.map((item) => {
                                                                                    var _b;
                                                                                    return {
                                                                                        key: item.userID,
                                                                                        value: (_b = item.userData.name) !== null && _b !== void 0 ? _b : '（尚無姓名）',
                                                                                        note: item.userData.email,
                                                                                    };
                                                                                }));
                                                                            }
                                                                        });
                                                                    });
                                                                },
                                                                style: 'width: 100%;',
                                                            });
                                                        }), { textStyle: 'font-weight: 400;' })}
                                      </div>
                                      ${obj.gvc.map(customVM.dataList.map((opt, index) => {
                                                            return html ` <div class="form-check-label c_updown_label">
                                            <span class="tx_normal">${index + 1}. ${opt.value}</span>
                                            ${opt.note ? html ` <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
                                          </div>`;
                                                        }))}
                                    </div>
                                  `;
                                                    },
                                                    onCreate: () => {
                                                        if (customVM.loading) {
                                                            if (voucherData.targetList.length === 0) {
                                                                setTimeout(() => {
                                                                    customVM.dataList = [];
                                                                    customVM.loading = false;
                                                                    gvc.notifyDataChange(customVM.id);
                                                                }, 200);
                                                            }
                                                            else {
                                                                ApiUser.getUserList({
                                                                    page: 0,
                                                                    limit: 99999,
                                                                    id: voucherData.targetList.join(','),
                                                                    only_id: true,
                                                                }).then(dd => {
                                                                    if (dd.response.data) {
                                                                        customVM.dataList = dd.response.data.map((item) => {
                                                                            return {
                                                                                key: item.userID,
                                                                                value: item.userData.name,
                                                                                note: item.userData.email,
                                                                            };
                                                                        });
                                                                    }
                                                                    customVM.loading = false;
                                                                    gvc.notifyDataChange(customVM.id);
                                                                });
                                                            }
                                                        }
                                                    },
                                                };
                                            });
                                        case 'levels':
                                            return (() => {
                                                const levelVM = {
                                                    id: getUUID(),
                                                    loading: true,
                                                    dataList: [],
                                                };
                                                return gvc.bindView({
                                                    bind: levelVM.id,
                                                    view: () => {
                                                        var _b;
                                                        if (levelVM.loading) {
                                                            return BgWidget.spinner({ text: { visible: false } });
                                                        }
                                                        else {
                                                            return BgWidget.selectDropList({
                                                                gvc: gvc,
                                                                callback: value => {
                                                                    voucherData.targetList = value;
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                default: ((_b = voucherData.targetList) !== null && _b !== void 0 ? _b : []).map(id => id.toString()),
                                                                options: levelVM.dataList,
                                                                style: 'width: 100%;',
                                                            });
                                                        }
                                                    },
                                                    divCreate: {
                                                        style: 'width: 100%;',
                                                    },
                                                    onCreate: () => {
                                                        if (levelVM.loading) {
                                                            ApiUser.getPublicConfig('member_level_config', 'manager').then((dd) => {
                                                                if (dd.result && dd.response.value) {
                                                                    levelVM.dataList = dd.response.value.levels.map((item) => {
                                                                        return {
                                                                            key: item.id,
                                                                            value: item.tag_name,
                                                                        };
                                                                    });
                                                                    levelVM.loading = false;
                                                                    gvc.notifyDataChange(levelVM.id);
                                                                }
                                                            });
                                                        }
                                                    },
                                                });
                                            })();
                                        case 'group':
                                            return (() => {
                                                const levelVM = {
                                                    id: getUUID(),
                                                    loading: true,
                                                    dataList: [],
                                                };
                                                return gvc.bindView({
                                                    bind: levelVM.id,
                                                    view: () => {
                                                        var _b;
                                                        if (levelVM.loading) {
                                                            return BgWidget.spinner({ text: { visible: false } });
                                                        }
                                                        else {
                                                            return BgWidget.selectDropList({
                                                                gvc: gvc,
                                                                callback: (value) => {
                                                                    voucherData.targetList = value;
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                default: ((_b = voucherData.targetList) !== null && _b !== void 0 ? _b : []).map(id => id.toString()),
                                                                options: levelVM.dataList,
                                                                style: 'width: 100%;',
                                                            });
                                                        }
                                                    },
                                                    divCreate: {
                                                        style: 'width: 100%;',
                                                    },
                                                    onCreate: () => {
                                                        if (levelVM.loading) {
                                                            ApiUser.getUserGroupList().then((dd) => {
                                                                if (dd.result && dd.response.data) {
                                                                    levelVM.dataList = dd.response.data
                                                                        .filter((item) => {
                                                                        return item.type !== 'level';
                                                                    })
                                                                        .map((item) => {
                                                                        return {
                                                                            key: item.type,
                                                                            value: item.title,
                                                                        };
                                                                    });
                                                                    levelVM.loading = false;
                                                                    gvc.notifyDataChange(levelVM.id);
                                                                }
                                                            });
                                                        }
                                                    },
                                                });
                                            })();
                                        default:
                                            return '';
                                    }
                                })()}
                    </div>
                  </div>
                `;
                            },
                        };
                    });
                }
                function device() {
                    var _b;
                    return BgWidget.multiCheckboxContainer(gvc, [
                        { key: 'normal', name: '官網 & APP 訂單' },
                        { key: 'pos', name: 'POS 訂單' },
                    ], (_b = voucherData.device) !== null && _b !== void 0 ? _b : ['normal'], text => {
                        voucherData.device = text;
                        gvc.notifyDataChange(pageVM.viewID);
                    }, { single: false });
                }
                function selectShipment() {
                    if (voucherData.reBackType !== 'shipment_free') {
                        return '';
                    }
                    const id = getUUID();
                    return gvc.bindView({
                        bind: id,
                        view: () => {
                            var _b;
                            return [
                                BgWidget.select({
                                    gvc,
                                    callback: value => {
                                        voucherData.selectShipment.type = value;
                                        gvc.notifyDataChange(id);
                                    },
                                    default: voucherData.selectShipment.type,
                                    options: [
                                        { key: 'all', value: '所有物流' },
                                        { key: 'select', value: '指定物流' },
                                    ],
                                }),
                                voucherData.selectShipment.type === 'all'
                                    ? ''
                                    : BgWidget.selectDropList({
                                        gvc: gvc,
                                        callback: value => {
                                            voucherData.selectShipment.list = value;
                                        },
                                        default: (_b = voucherData.selectShipment.list) !== null && _b !== void 0 ? _b : [],
                                        options: ShipmentConfig.list.map(item => {
                                            return {
                                                key: item.value,
                                                value: item.title,
                                            };
                                        }),
                                        style: 'width: 100%;',
                                    }),
                            ]
                                .filter(Boolean)
                                .join(BgWidget.mbContainer(8));
                        },
                    });
                }
                function setVoucherFor() {
                    var _b;
                    let view = [
                        EditorElem.radio({
                            gvc: gvc,
                            title: '',
                            def: (_b = voucherData.for) !== null && _b !== void 0 ? _b : 'all',
                            array: ShoppingDiscountSetting.productForList,
                            callback: text => {
                                voucherData.forKey = defKeys[text];
                                voucherData.for = text;
                                gvc.notifyDataChange(pageVM.viewID);
                            },
                            oneLine: true,
                        }),
                    ];
                    if (['add_on_items', 'giveaway', 'shipment_free'].includes(voucherData.reBackType)) {
                        view.push(`<div class="mx-n2">${selectProduct()}</div>`);
                    }
                    return view.join('');
                }
                function selectProduct() {
                    if (voucherData.trigger === 'distribution') {
                        return '';
                    }
                    switch (voucherData.for) {
                        case 'manager_tag':
                            return gvc.bindView(() => {
                                const subVM = {
                                    id: getUUID(),
                                    dataList: String(voucherData.for) === 'manager_tag' ? [...defKeys.manager_tag] : [],
                                };
                                return {
                                    bind: subVM.id,
                                    view: () => {
                                        return html `
                      <div class="d-flex flex-column p-2" style="gap: 18px;">
                        <div
                          class="d-flex align-items-center gray-bottom-line-18"
                          style="gap: 24px; justify-content: space-between;"
                        >
                          <div class="form-check-label c_updown_label">
                            <div class="tx_normal">標籤列表</div>
                          </div>
                          ${BgWidget.grayButton('選擇標籤', gvc.event(() => {
                                            BgProduct.useProductTags({
                                                gvc,
                                                config_key: 'product_manager_tags',
                                                def: String(voucherData.for) === 'manager_tag' && voucherData.forKey
                                                    ? voucherData.forKey.map(item => `${item}`)
                                                    : [],
                                                callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                    voucherData.forKey = value;
                                                    defKeys.manager_tag = value;
                                                    subVM.dataList = value;
                                                    gvc.notifyDataChange(subVM.id);
                                                }),
                                            });
                                        }), { textStyle: 'font-weight: 400;' })}
                        </div>
                        ${obj.gvc.map(subVM.dataList.map((opt, index) => {
                                            return html ` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                              <span class="tx_normal">${index + 1}. #${opt}</span>
                            </div>`;
                                        }))}
                      </div>
                    `;
                                    },
                                };
                            });
                        case 'collection':
                            return gvc.bindView(() => {
                                const subVM = {
                                    id: getUUID(),
                                    loading: true,
                                    dataList: [],
                                };
                                return {
                                    bind: subVM.id,
                                    view: () => {
                                        if (subVM.loading) {
                                            return BgWidget.spinner();
                                        }
                                        return html `
                      <div class="d-flex flex-column p-2" style="gap: 18px;">
                        <div
                          class="d-flex align-items-center gray-bottom-line-18"
                          style="gap: 24px; justify-content: space-between;"
                        >
                          <div class="form-check-label c_updown_label">
                            <div class="tx_normal">分類列表</div>
                          </div>
                          ${BgWidget.grayButton('選擇分類', gvc.event(() => {
                                            var _b;
                                            BgProduct.collectionsDialog({
                                                gvc: gvc,
                                                default: (_b = voucherData.forKey) !== null && _b !== void 0 ? _b : [],
                                                callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                    voucherData.forKey = value;
                                                    defKeys.collection = value;
                                                    subVM.dataList = yield BgProduct.getCollectiosOpts(value);
                                                    subVM.loading = true;
                                                    gvc.notifyDataChange(subVM.id);
                                                }),
                                            });
                                        }), { textStyle: 'font-weight: 400;' })}
                        </div>
                        ${obj.gvc.map(subVM.dataList.map((opt, index) => {
                                            return html ` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                              <span class="tx_normal">${index + 1}. ${opt.value}</span>
                              ${opt.note ? html ` <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
                            </div>`;
                                        }))}
                      </div>
                    `;
                                    },
                                    onCreate: () => {
                                        if (subVM.loading) {
                                            if (voucherData.forKey.length === 0) {
                                                setTimeout(() => {
                                                    subVM.dataList = [];
                                                    subVM.loading = false;
                                                    gvc.notifyDataChange(subVM.id);
                                                }, 200);
                                            }
                                            else {
                                                new Promise(resolve => {
                                                    resolve(BgProduct.getCollectiosOpts(voucherData.forKey));
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
                                    id: getUUID(),
                                    loading: true,
                                    dataList: [],
                                };
                                return {
                                    bind: subVM.id,
                                    view: () => {
                                        try {
                                            if (subVM.loading) {
                                                return BgWidget.spinner();
                                            }
                                            return html `
                        <div class="d-flex flex-column p-2" style="gap: 18px;">
                          <div
                            class="d-flex align-items-center gray-bottom-line-18"
                            style="gap: 24px; justify-content: space-between;"
                          >
                            <div class="form-check-label c_updown_label">
                              <div class="tx_normal">商品列表</div>
                            </div>
                            ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                                var _b;
                                                BgProduct.productsDialog({
                                                    gvc: gvc,
                                                    default: (_b = voucherData.forKey) !== null && _b !== void 0 ? _b : [],
                                                    callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                        voucherData.forKey = value;
                                                        defKeys.product = value;
                                                        subVM.dataList = yield BgProduct.getProductOpts(voucherData.forKey);
                                                        subVM.loading = true;
                                                        gvc.notifyDataChange(subVM.id);
                                                    }),
                                                });
                                            }), { textStyle: 'font-weight: 400;' })}
                          </div>
                          ${subVM.dataList
                                                .map((opt, index) => {
                                                return html ` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                <span class="tx_normal">${index + 1}.</span>
                                ${BgWidget.validImageBox({
                                                    gvc: gvc,
                                                    image: opt.image,
                                                    width: 40,
                                                })}
                                <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                ${opt.note ? html ` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                              </div>`;
                                            })
                                                .join(``)}
                        </div>
                      `;
                                        }
                                        catch (e) {
                                            console.error(e);
                                            return `${e}`;
                                        }
                                    },
                                    onCreate: () => {
                                        if (subVM.loading) {
                                            if (voucherData.forKey.length === 0) {
                                                setTimeout(() => {
                                                    subVM.dataList = [];
                                                    subVM.loading = false;
                                                    gvc.notifyDataChange(subVM.id);
                                                }, 200);
                                            }
                                            else {
                                                new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                                    resolve(yield BgProduct.getProductOpts(voucherData.forKey));
                                                })).then(data => {
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
                            return '';
                    }
                }
                function addProductView() {
                    return obj.gvc.bindView(() => {
                        const id = getUUID();
                        return {
                            bind: id,
                            view: () => {
                                try {
                                    return html `
                    <div
                      class="d-flex align-items-center gray-bottom-line-18"
                      style="gap: 24px; justify-content: space-between;"
                    >
                      <div class="form-check-label c_updown_label">
                        <div class="tx_normal">商品列表</div>
                      </div>
                      ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                        var _b;
                                        BgProduct.productsDialog({
                                            gvc: gvc,
                                            default: (_b = voucherData.add_on_products) !== null && _b !== void 0 ? _b : [],
                                            callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                voucherData.add_on_products = value;
                                                gvc.notifyDataChange(id);
                                            }),
                                            filter: dd => {
                                                return true;
                                            },
                                            productType: voucherData.reBackType === 'add_on_items' ? 'addProduct' : 'giveaway',
                                        });
                                    }), { textStyle: 'font-weight: 400;' })}
                    </div>
                    ${gvc.bindView(() => {
                                        const vm = {
                                            viewID: getUUID(),
                                            loading: true,
                                            data: [],
                                        };
                                        BgProduct.getProductOpts(voucherData.add_on_products, voucherData.reBackType === 'add_on_items' ? 'addProduct' : 'giveaway').then(res => {
                                            vm.data = res;
                                            vm.loading = false;
                                            gvc.notifyDataChange(vm.viewID);
                                        });
                                        return {
                                            bind: vm.viewID,
                                            view: () => __awaiter(this, void 0, void 0, function* () {
                                                if (vm.loading) {
                                                    return BgWidget.spinner();
                                                }
                                                return vm.data
                                                    .map((opt, index) => {
                                                    return html ` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                <span class="tx_normal">${index + 1}.</span>
                                ${BgWidget.validImageBox({
                                                        gvc: gvc,
                                                        image: opt.image,
                                                        width: 40,
                                                    })}
                                <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                ${opt.note ? html ` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                              </div>`;
                                                })
                                                    .join('');
                                            }),
                                            divCreate: {
                                                class: `d-flex py-2 flex-column`,
                                                style: `gap:10px;`,
                                            },
                                        };
                                    })}
                  `;
                                }
                                catch (e) {
                                    console.error(e);
                                    return '';
                                }
                            },
                            divCreate: {
                                class: `w-100`,
                            },
                        };
                    });
                }
                function storeUseTimeLimit() {
                    var _b;
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'noLimited',
                            name: '無限制',
                        },
                        {
                            key: 'hasLimited',
                            name: '限制次數',
                            innerHtml: html ` <div class="d-flex align-items-center">
                  <span class="tx_normal me-2">可使用次數</span>
                  ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'number',
                                divStyle: 'width: 150px;',
                                default: `${(_b = voucherData.macroLimited) !== null && _b !== void 0 ? _b : 0}`,
                                placeHolder: '',
                                callback: text => {
                                    voucherData.macroLimited = parseInt(text, 10);
                                },
                                endText: '次',
                            })}
                </div>`,
                        },
                    ], [voucherData.macroLimited === 0 ? 'noLimited' : 'hasLimited'], text => {
                        if (text[0] === 'noLimited') {
                            voucherData.macroLimited = 0;
                        }
                    }, { single: true });
                }
                function memberUseTimeLimit() {
                    var _b;
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'noLimited',
                            name: '無限制',
                        },
                        {
                            key: 'hasLimited',
                            name: '限制次數',
                            innerHtml: html ` <div class="d-flex align-items-center">
                  <span class="tx_normal me-2">可使用次數</span>
                  ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'number',
                                divStyle: 'width: 150px;',
                                default: `${(_b = voucherData.microLimited) !== null && _b !== void 0 ? _b : 0}`,
                                placeHolder: '',
                                callback: text => {
                                    voucherData.microLimited = parseInt(text, 10);
                                },
                                endText: '次',
                            })}
                </div>`,
                        },
                    ], [voucherData.microLimited === 0 ? 'noLimited' : 'hasLimited'], text => {
                        if (text[0] === 'noLimited') {
                            voucherData.microLimited = 0;
                        }
                    }, { single: true });
                }
                function startDateTime() {
                    const inputStyle = 'display: block; width: 200px;';
                    return html ` <div
              class="d-flex mb-2 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
              style="gap: 12px"
            >
              <div class="d-flex align-items-center">
                <span class="tx_normal me-2">開始日期</span>
                ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        type: 'date',
                        style: inputStyle,
                        default: `${voucherData.startDate}`,
                        placeHolder: '',
                        callback: text => {
                            voucherData.startDate = text;
                        },
                    })}
              </div>
              <div class="d-flex align-items-center">
                <span class="tx_normal me-2">開始時間</span>
                ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        type: 'time',
                        style: inputStyle,
                        default: `${voucherData.startTime}`,
                        placeHolder: '',
                        callback: text => {
                            voucherData.startTime = text;
                        },
                    })}
              </div>
            </div>
            ${BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'noEnd',
                            name: '無期限',
                        },
                        {
                            key: 'withEnd',
                            name: '有效期限',
                            innerHtml: html ` <div
                    class="d-flex mt-0 mt-md-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                    style="gap: 12px"
                  >
                    <div class="d-flex align-items-center">
                      <span class="tx_normal me-2">結束日期</span>
                      ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'date',
                                style: inputStyle,
                                default: `${voucherData.endDate}`,
                                placeHolder: '',
                                callback: text => {
                                    voucherData.endDate = text;
                                },
                            })}
                    </div>
                    <div class="d-flex align-items-center">
                      <span class="tx_normal me-2">結束時間</span>
                      ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'time',
                                style: inputStyle,
                                default: `${voucherData.endTime}`,
                                placeHolder: '',
                                callback: text => {
                                    voucherData.endTime = text;
                                },
                            })}
                    </div>
                  </div>`,
                        },
                    ], [voucherData.endDate ? `withEnd` : `noEnd`], text => {
                        if (text[0] === 'noEnd') {
                            voucherData.endDate = undefined;
                            voucherData.endTime = undefined;
                        }
                    }, { single: true })}`;
                }
                function rebateEndDay() {
                    var _b, _c;
                    if (voucherData.reBackType !== 'rebate') {
                        return '';
                    }
                    const inputStyle = 'display: block; width: 200px;';
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'noEnd',
                            name: '無期限',
                        },
                        {
                            key: 'withEnd',
                            name: '有效期限',
                            innerHtml: html ` <div
                  class="d-flex mt-0 mt-md-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                  style="gap: 12px"
                >
                  <div class="d-flex align-items-center" style="gap:10px;">
                    ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'number',
                                style: inputStyle,
                                default: `${(_b = voucherData.rebateEndDay) !== null && _b !== void 0 ? _b : ''}`,
                                placeHolder: '0則為無期限',
                                callback: text => {
                                    voucherData.rebateEndDay = text;
                                    gvc.notifyDataChange(pageVM.viewID);
                                },
                            })}
                    <span class="tx_normal me-2">天</span>
                  </div>
                </div>`,
                        },
                    ], [parseInt((_c = voucherData.rebateEndDay) !== null && _c !== void 0 ? _c : '0', 10) ? `withEnd` : `noEnd`], text => {
                        if (text[0] === 'noEnd') {
                            voucherData.rebateEndDay = '0';
                        }
                    }, { single: true });
                }
                function overlay() {
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'false',
                            name: '不可疊加',
                            innerHtml: BgWidget.grayNote('系統將以最大優惠排序進行判定'),
                        },
                        {
                            key: 'true',
                            name: '可以疊加',
                        },
                    ], [voucherData.overlay ? 'true' : 'false'], text => {
                        voucherData.overlay = text[0] === 'true';
                        gvc.notifyDataChange(pageVM.viewID);
                    }, { single: true });
                }
                function offStart() {
                    const bool = voucherData.method === 'percent' &&
                        voucherData.conditionType === 'order' &&
                        voucherData.rule === 'min_count' &&
                        voucherData.reBackType === 'discount';
                    if (!bool) {
                        return '';
                    }
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'price_desc',
                            name: '從最高價的商品打折',
                            innerHtml: BgWidget.grayNote(`購物車訂單將會從最高價且符合優惠的${ruleText(ruleValue)}商品進行打折`),
                        },
                        {
                            key: 'price_asc',
                            name: '從最低價的商品打折',
                            innerHtml: BgWidget.grayNote(`購物車訂單將會從最低價且符合優惠的${ruleText(ruleValue)}商品進行打折`),
                        },
                        {
                            key: 'price_all',
                            name: '符合優惠的商品全部打折',
                            innerHtml: BgWidget.grayNote(`購物車訂單符合優惠的商品進行打折`),
                        },
                    ], [voucherData.productOffStart], text => {
                        voucherData.productOffStart = text[0];
                        gvc.notifyDataChange(pageVM.viewID);
                    }, {
                        single: true,
                    });
                }
                function isIncludeDiscount() {
                    if (!voucherData.overlay || voucherData.rule === 'min_count') {
                        voucherData.includeDiscount = 'before';
                        return '';
                    }
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'before',
                            name: '折扣前金額',
                            innerHtml: BgWidget.grayNote('以未套用其他優惠前的商品原始金額，來判斷是否達成此優惠券的使用門檻'),
                        },
                        {
                            key: 'after',
                            name: '折扣後金額',
                            innerHtml: BgWidget.grayNote('使用已套用其他優惠後的實際結帳，來判斷是否達成此優惠券的使用門檻'),
                        },
                    ], [voucherData.includeDiscount], text => {
                        voucherData.includeDiscount = text[0];
                        gvc.notifyDataChange(pageVM.viewID);
                    }, {
                        single: true,
                    });
                }
                function countingBoolean() {
                    if (voucherData.method === 'percent' || voucherData.reBackType === 'shipment_free') {
                        return '';
                    }
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'single',
                            name: '不重複',
                            innerHtml: BgWidget.grayNote(`購買 ${ruleText(ruleValue)}折 Y 元，額外購買至 ${ruleText(ruleValue * 2)}或 ${ruleText(ruleValue * 3)}依然是折 Y 元`),
                        },
                        {
                            key: 'each',
                            name: '重複',
                            innerHtml: BgWidget.grayNote(`購買 ${ruleText(ruleValue)}折 Y 元，購買 ${ruleText(ruleValue * 2)}則折 Y * 2 元，購買 ${ruleText(ruleValue * 3)}則折 Y * 3 元，以此類推`),
                        },
                    ], [voucherData.counting], text => {
                        voucherData.counting = text[0];
                        gvc.notifyDataChange(pageVM.viewID);
                    }, {
                        single: true,
                    });
                }
                function conditionType() {
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'order',
                            name: '以整份訂單計算',
                            innerHtml: BgWidget.grayNote((() => {
                                if (voucherData.reBackType === 'shipment_free') {
                                    return '優惠條件為整份訂單免運費';
                                }
                                return `若商品 A 購買 ${ruleText(floor)} ＋ 商品 B 購買 ${ruleText(ruleValue - floor)}，可觸發優惠`;
                            })()),
                        },
                        {
                            key: 'item',
                            name: '以商品計算',
                            innerHtml: BgWidget.grayNote(`商品 A 及 商品 B 需各滿 ${ruleText(ruleValue)}，才可觸發優惠`),
                        },
                    ], [voucherData.conditionType], text => {
                        voucherData.conditionType = text[0];
                        gvc.notifyDataChange(pageVM.viewID);
                    }, {
                        single: true,
                        readonly: voucherData.reBackType === 'shipment_free',
                    });
                }
                function method() {
                    if (['shipment_free', 'add_on_items', 'giveaway'].includes(voucherData.reBackType)) {
                        return '';
                    }
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'fixed',
                            name: '固定金額',
                            innerHtml: valueInput({ startText: '$' }),
                        },
                        {
                            key: 'percent',
                            name: '百分比',
                            innerHtml: valueInput({ endText: '%' }),
                        },
                    ], [voucherData.method], text => {
                        voucherData.value = '0';
                        voucherData.method = text[0];
                        gvc.notifyDataChange(pageVM.viewID);
                    }, { single: true });
                }
                function conditionInput(text) {
                    var _b;
                    return BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        divStyle: 'width: 150px;',
                        default: `${(_b = voucherData.ruleValue) !== null && _b !== void 0 ? _b : 0}`,
                        placeHolder: '',
                        callback: value => {
                            voucherData.ruleValue = parseInt(value, 10);
                            gvc.notifyDataChange(pageVM.viewID);
                        },
                        endText: text,
                    });
                }
                function rule() {
                    return BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'min_price',
                            name: '最低消費金額',
                            innerHtml: conditionInput('元'),
                        },
                        {
                            key: 'min_count',
                            name: '最少購買數量',
                            innerHtml: conditionInput('個'),
                        },
                    ], [voucherData.rule], text => {
                        voucherData.ruleValue = 0;
                        voucherData.rule = text[0];
                        gvc.notifyDataChange(pageVM.viewID);
                    }, { single: true });
                }
                function ruleText(sum) {
                    return `${sum} ${voucherData.rule === 'min_count' ? '個' : '元'}`;
                }
                function valueInput(obj) {
                    return BgWidget.editeInput({
                        gvc: gvc,
                        type: 'number',
                        divStyle: 'width: 150px;',
                        title: '',
                        default: voucherData.value,
                        placeHolder: '',
                        callback: text => {
                            const texInt = parseInt(text, 10);
                            if (voucherData.method === 'percent' && (texInt > 100 || texInt < 0)) {
                                dialog.infoMessage({ text: '數值需介於0~100' });
                                gvc.notifyDataChange(pageVM.viewID);
                            }
                            else {
                                voucherData.value = text;
                            }
                        },
                        startText: obj.startText,
                        endText: obj.endText,
                    });
                }
                const reBackProductView = {
                    rebate: { title: '活動商品', html: voucherData.for === 'all' ? '' : selectProduct() },
                    discount: { title: '活動商品', html: voucherData.for === 'all' ? '' : selectProduct() },
                    shipment_free: { title: '活動商品', html: '' },
                    add_on_items: { title: '加購品項', html: [addProductView()].join('') },
                    giveaway: { title: '贈品品項', html: [addProductView()].join('') },
                };
                const viewList = [
                    [
                        { title: '活動設定', html: [status(), title()] },
                        { title: '折扣方式', html: trigger() },
                        { title: '適用訂單類型', html: device() },
                    ],
                    [
                        { title: '折扣設定', html: method() },
                        { title: '使用條件', html: rule() },
                    ],
                    [
                        { title: '活動對象', html: target() },
                        { title: '優惠套用至', html: setVoucherFor() },
                        reBackProductView[voucherData.reBackType],
                        { title: '可使用物流', html: selectShipment() },
                    ],
                    [
                        { title: '計算單位', html: conditionType() },
                        { title: '打折範圍', html: offStart() },
                        { title: '重複觸發', html: countingBoolean() },
                        { title: '是否與其他優惠券疊加使用', html: overlay() },
                        { title: '優惠門檻判斷依據', html: isIncludeDiscount() },
                    ],
                    [
                        { title: '全館總使用次數', html: storeUseTimeLimit() },
                        { title: '個人總使用次數', html: memberUseTimeLimit() },
                        { title: '購物金有效天數', html: rebateEndDay() },
                        { title: '優惠卷有效日期', html: startDateTime() },
                    ],
                ];
                return BgWidget.container([
                    html ` <div class="title-container">
              ${[
                        BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                        })),
                        BgWidget.title(`${obj.type === 'add' ? '新增' : '編輯'}${ShoppingDiscountSetting.getLabel(obj.reBackType)}`),
                    ].join('')}
            </div>`,
                    BgWidget.container1x2({
                        html: viewList
                            .map(viewData => {
                            return voucherSettingCard(viewData.map(view => {
                                if (!view.html) {
                                    return [];
                                }
                                else if (Array.isArray(view.html)) {
                                    return [setTitle(view.title), ...view.html];
                                }
                                else {
                                    return [setTitle(view.title), view.html];
                                }
                            }));
                        })
                            .join(BgWidget.mbContainer(24)),
                        ratio: 68,
                    }, {
                        html: gvc.bindView({
                            bind: getUUID(),
                            dataList: Object.keys(voucherData).map(key => ({ obj: voucherData, key })),
                            view: () => {
                                const getSummary = this.summaryTextList(voucherData)
                                    .map(text => {
                                    const className = text.length > 0 ? 'tx_normal' : 'gray-top-bottom-line-6';
                                    return html ` <div class="${className}">${text}</div>`;
                                })
                                    .join('');
                                return BgWidget.mainCard([
                                    setTitle('摘要'),
                                    BgWidget.mbContainer(18),
                                    html ` <div style="display: flex; gap: 12px; flex-direction: column;">${getSummary}</div>`,
                                ].join(''));
                            },
                            divCreate: {
                                class: 'summary-card p-0',
                            },
                        }),
                        ratio: 32,
                    }),
                    BgWidget.mbContainer(240),
                    html ` <div class="update-bar-container">
              ${obj.type === 'replace'
                        ? BgWidget.cancel(gvc.event(() => {
                            dialog.checkYesOrNot({
                                text: '是否確認刪除優惠券?',
                                callback: response => {
                                    if (response) {
                                        const id = voucherData.id;
                                        dialog.dataLoading({ visible: true });
                                        ApiShop.deleteVoucher({ id }).then(res => {
                                            dialog.dataLoading({ visible: false });
                                            if (res.result) {
                                                vm.type = 'list';
                                            }
                                            else {
                                                dialog.errorMessage({ text: '刪除失敗' });
                                            }
                                        });
                                    }
                                },
                            });
                        }), '刪除優惠券')
                        : ''}
              ${BgWidget.cancel(gvc.event(() => {
                        vm.type = 'list';
                    }))}
              ${BgWidget.save(gvc.event(() => {
                        voucherData.start_ISO_Date = '';
                        voucherData.end_ISO_Date = '';
                        glitter.ut.tryMethod([
                            () => {
                                voucherData.start_ISO_Date = new Date(`${voucherData.startDate} ${voucherData.startTime}`).toISOString();
                            },
                            () => {
                                voucherData.end_ISO_Date = new Date(`${voucherData.endDate} ${voucherData.endTime}`).toISOString();
                            },
                        ]);
                        const requestBody = {
                            postData: voucherData,
                            token: window.parent.saasConfig.config.token,
                            type: 'manager',
                        };
                        function responseEvent(res) {
                            dialog.dataLoading({ visible: false });
                            if (res.result) {
                                vm.type = 'list';
                                dialog.successMessage({ text: '上傳成功' });
                            }
                            else {
                                dialog.errorMessage({ text: '上傳失敗' });
                            }
                        }
                        if (obj.type === 'replace') {
                            dialog.dataLoading({ text: '正在更新優惠券', visible: true });
                            ApiShop.putVoucher(requestBody).then(res => responseEvent(res));
                        }
                        else {
                            dialog.dataLoading({ text: '正在新增優惠券', visible: true });
                            ApiShop.postVoucher(requestBody).then(res => responseEvent(res));
                        }
                    }))}
            </div>`,
                ].join(BgWidget.mbContainer(24)));
            },
        });
    }
}
_a = ShoppingDiscountSetting;
ShoppingDiscountSetting.productForList = [
    { title: '所有商品', value: 'all' },
    { title: '商品分類', value: 'collection' },
    { title: '管理員標籤', value: 'manager_tag' },
    { title: '特定商品', value: 'product' },
];
ShoppingDiscountSetting.getDateTime = (n = 0) => {
    const now = new Date();
    now.setDate(now.getDate() + n);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:00`;
    return { date: dateStr, time: timeStr };
};
ShoppingDiscountSetting.emptyVoucher = (reBackType) => {
    return {
        title: '',
        code: '',
        trigger: 'auto',
        method: 'fixed',
        value: '0',
        for: 'all',
        forKey: [],
        device: ['normal'],
        rule: 'min_price',
        ruleValue: 1000,
        startDate: _a.getDateTime().date,
        startTime: _a.getDateTime().time,
        endDate: undefined,
        endTime: undefined,
        status: 1,
        type: 'voucher',
        overlay: false,
        start_ISO_Date: '',
        end_ISO_Date: '',
        reBackType: reBackType,
        rebateEndDay: '30',
        target: 'all',
        targetList: [],
        macroLimited: 0,
        microLimited: 0,
        counting: 'single',
        conditionType: 'order',
        includeDiscount: 'before',
        productOffStart: 'price_desc',
        selectShipment: { type: 'all', list: [] },
    };
};
window.glitter.setModule(import.meta.url, ShoppingDiscountSetting);
