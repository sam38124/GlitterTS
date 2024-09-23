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
import { BgProduct } from '../backend-manager/bg-product.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { Tool } from '../modules/tool.js';
export class ShoppingDiscountSetting {
    static getLabel(voucher_type) {
        switch (voucher_type) {
            case "giveaway":
                return `贈品活動`;
            case "add_on_items":
                return `加價購活動`;
            case "discount":
                return `折扣活動`;
            case "rebate":
                return `回饋金活動`;
            case "shipment_free":
                return `免運費活動`;
        }
        return ``;
    }
    static main(gvc, voucher_type) {
        const glitter = gvc.glitter;
        const vm = {
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: undefined,
        };
        const html = String.raw;
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const filterID = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title(ShoppingDiscountSetting.getLabel(voucher_type))}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton(`新增${ShoppingDiscountSetting.getLabel(voucher_type)}`, gvc.event(() => {
                            vm.data = undefined;
                            vm.type = 'add';
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vmi) => {
                                ApiShop.getVoucher({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query || undefined,
                                    voucher_type: voucher_type
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    function getDatalist() {
                                        return data.response.data.map((dd) => {
                                            return [
                                                {
                                                    key: EditorElem.checkBoxOnly({
                                                        gvc: gvc,
                                                        def: !data.response.data.find((dd) => {
                                                            return !dd.checked;
                                                        }),
                                                        callback: (result) => {
                                                            data.response.data.map((dd) => {
                                                                dd.checked = result;
                                                            });
                                                            vmi.data = getDatalist();
                                                            vmi.callback();
                                                            gvc.notifyDataChange(filterID);
                                                        },
                                                    }),
                                                    value: EditorElem.checkBoxOnly({
                                                        gvc: gvc,
                                                        def: dd.checked,
                                                        callback: (result) => {
                                                            dd.checked = result;
                                                            vmi.data = getDatalist();
                                                            vmi.callback();
                                                            gvc.notifyDataChange(filterID);
                                                        },
                                                        style: 'height:25px;',
                                                    }),
                                                },
                                                {
                                                    key: '標題',
                                                    value: html `<span
                                                                                    class="fs-7">${dd.content.title}</span>`,
                                                },
                                                {
                                                    key: '狀態',
                                                    value: dd.content.status
                                                        ? html `
                                                                                        <div class="badge bg-success fs-7">
                                                                                            啟用中
                                                                                        </div>`
                                                        : html `
                                                                                        <div class="badge bg-secondary fs-7">
                                                                                            已停用
                                                                                        </div>`,
                                                },
                                                {
                                                    key: '觸發方式',
                                                    value: html `<span class="fs-7"
                                                                            >${(() => {
                                                        switch (dd.content.trigger) {
                                                            case 'auto':
                                                                return '自動';
                                                            case 'code':
                                                                return '輸入代碼';
                                                            case 'distribution':
                                                                return '分銷 & 一頁式';
                                                            default:
                                                                return '尚未設定';
                                                        }
                                                    })()}</span
                                                                            >`,
                                                },
                                                {
                                                    key: '對象',
                                                    value: html `<span
                                                                                    class="fs-7">${dd.content.for === 'product' ? `指定商品` : `商品分類`}</span>`,
                                                },
                                                {
                                                    key: '折扣項目',
                                                    value: html `<span
                                                                                    class="fs-7">${dd.content.method === 'percent' ? `折扣${dd.content.value}%` : `折扣$${dd.content.value}`}</span>`,
                                                },
                                            ];
                                        });
                                    }
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                                vm.data = vm.dataList[index].content;
                                vm.type = 'replace';
                            },
                            filter: html ` ${BgWidget.searchPlace(gvc.event((e) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有折扣')}
                                                    ${gvc.bindView(() => {
                                return {
                                    bind: filterID,
                                    view: () => {
                                        if (!vm.dataList ||
                                            !vm.dataList.find((dd) => {
                                                return dd.checked;
                                            })) {
                                            return ``;
                                        }
                                        else {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            const selCount = vm.dataList.filter((dd) => dd.checked).length;
                                            return BgWidget.selNavbar({
                                                count: selCount,
                                                buttonList: [
                                                    BgWidget.selEventButton('批量移除', gvc.event(() => {
                                                        dialog.checkYesOrNot({
                                                            text: '是否確認刪除所選項目？',
                                                            callback: (response) => {
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
                                                                    }).then((res) => {
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
                                                    })),
                                                ],
                                            });
                                        }
                                    },
                                    divCreate: () => {
                                        return {
                                            class: `d-flex align-items-center p-2 py-3 ${!vm.dataList ||
                                                !vm.dataList.find((dd) => {
                                                    return dd.checked;
                                                })
                                                ? `d-none`
                                                : ``}`,
                                            style: ``,
                                        };
                                    },
                                };
                            })}`,
                        })))}
                                ${BgWidget.mbContainer(120)}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type == 'replace') {
                        return this.voucherEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                            reBackType: voucher_type
                        });
                    }
                    else {
                        return this.voucherEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                            reBackType: voucher_type
                        });
                    }
                },
            };
        });
    }
    static voucherEditor(obj) {
        var _a;
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vm = obj.vm;
        const html = String.raw;
        const voucherData = (_a = vm.data) !== null && _a !== void 0 ? _a : {
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
            startDate: this.getDateTime().date,
            startTime: this.getDateTime().time,
            endDate: this.getDateTime(7).date,
            endTime: this.getDateTime(7).time,
            status: 1,
            type: 'voucher',
            overlay: false,
            start_ISO_Date: '',
            end_ISO_Date: '',
            reBackType: obj.reBackType,
            rebateEndDay: '30',
            target: 'all',
            targetList: [],
            macroLimited: 0,
            microLimited: 0,
            counting: 'single',
            conditionType: 'order',
        };
        const productForList = [
            { title: '所有商品', value: 'all' },
            { title: '商品分類', value: 'collection' },
            { title: '單一商品', value: 'product' },
        ];
        function getVoucherTextList() {
            var _a, _b;
            return [
                `活動標題：${voucherData.title && voucherData.title.length > 0 ? voucherData.title : '尚無標題'}`,
                `適用商品：${(() => {
                    const forData = productForList.find((item) => item.value === voucherData.for);
                    return forData ? forData.title : '';
                })()}`,
                `活動方式：${(() => {
                    var _a;
                    if (voucherData.trigger === 'auto')
                        return '自動折扣';
                    if (voucherData.trigger === 'distribution')
                        return '分銷連結';
                    if (voucherData.trigger === 'code')
                        return `優惠代碼「${(_a = voucherData.code) !== null && _a !== void 0 ? _a : ''}」`;
                    return '';
                })()}`,
                `活動對象：${(() => {
                    switch (voucherData.target) {
                        case 'customer':
                            return '特定顧客';
                        case 'levels':
                            return '會員等級';
                        case 'group':
                            return '顧客分群';
                        case 'all':
                        default:
                            return '所有顧客';
                    }
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
                    switch (voucherData.reBackType) {
                        case 'rebate':
                            return voucherData.method === 'fixed' ? `${voucherData.value} 點購物金` : `符合條件商品總額的 ${voucherData.value} ％作為購物金`;
                        case 'discount':
                            return voucherData.method === 'fixed' ? `折扣 ${voucherData.value} 元` : `符合條件商品折扣 ${voucherData.value} ％`;
                        case 'shipment_free':
                            return '免運費';
                        default:
                            return '';
                    }
                })()}`,
                `將此優惠套用至：${(() => {
                    switch (voucherData.for) {
                        case 'collection':
                            return `指定 ${voucherData.forKey.length} 種商品分類`;
                        case 'product':
                            return `指定 ${voucherData.forKey.length} 個商品`;
                        case 'all':
                        default:
                            return '所有商品';
                    }
                })()}`,
                '',
                voucherData.overlay ? '可以疊加，套用最大優惠' : '不可疊加',
                `啟用時間：${(_a = voucherData.startDate) !== null && _a !== void 0 ? _a : '未設定日期'} ${(_b = voucherData.startTime) !== null && _b !== void 0 ? _b : '尚未設定時間'}`,
                `結束時間：${(() => {
                    var _a, _b;
                    if (!voucherData.endDate)
                        return '無期限';
                    return `${(_a = voucherData.endDate) !== null && _a !== void 0 ? _a : '未設定日期'} ${(_b = voucherData.endTime) !== null && _b !== void 0 ? _b : '尚未設定時間'}`;
                })()}`,
            ];
        }
        const pageVM = {
            conditionId: gvc.glitter.getUUID(),
        };
        return gvc.bindView(() => {
            const viewID = gvc.glitter.getUUID();
            return {
                bind: viewID,
                view: () => {
                    var _a;
                    return BgWidget.container([
                        html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                                    ${BgWidget.title(obj.type === 'add' ? `新增${ShoppingDiscountSetting.getLabel(obj.reBackType)}` : `編輯${ShoppingDiscountSetting.getLabel(obj.reBackType)}`)}
                                </div>`,
                        html `
                                <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                     style="gap: 24px">
                                    ${BgWidget.container([
                            BgWidget.mainCard([
                                html `
                                                                <div class="tx_700">活動標題</div>
                                                                ${BgWidget.mbContainer(18)}
                                                                ${BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: voucherData.title,
                                    placeHolder: '請輸入活動標題',
                                    callback: (text) => {
                                        voucherData.title = text;
                                    },
                                })}
                                                                ${BgWidget.grayNote('顧客將會在「購物車」與「結帳」看見此標題', 'margin-left: 4px;')}`,
                                html `
                                                                <div class="tx_700">活動狀態</div>
                                                                ${BgWidget.mbContainer(12)}
                                                                ${BgWidget.switchTextButton(gvc, voucherData.status === 1, {
                                    left: '關閉',
                                    right: '啟用'
                                }, (bool) => {
                                    voucherData.status = bool ? 1 : 0;
                                })}`,
                            ].join(BgWidget.horizontalLine())),
                            BgWidget.mainCard([
                                html `
                                                                <div class="tx_700">活動方式</div>
                                                                ${BgWidget.mbContainer(18)}
                                                                ${BgWidget.multiCheckboxContainer(gvc, [
                                    {
                                        key: 'auto',
                                        name: '自動折扣',
                                        innerHtml: BgWidget.grayNote('顧客將在結帳時，自動獲得折扣'),
                                    },
                                    {
                                        key: 'code',
                                        name: '優惠代碼',
                                        innerHtml: (() => {
                                            const id = glitter.getUUID();
                                            return gvc.bindView({
                                                bind: id,
                                                view: () => {
                                                    var _a;
                                                    return gvc.map([
                                                        BgWidget.grayNote('顧客可在結帳時輸入優惠代碼，來獲得折扣'),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '',
                                                            default: (_a = voucherData.code) !== null && _a !== void 0 ? _a : '',
                                                            placeHolder: '請輸入優惠券代碼',
                                                            callback: (text) => {
                                                                voucherData.code = text;
                                                            },
                                                            endText: html `
                                                                                                            <div class="d-flex justify-content-end">
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
                                        name: '供分銷連結或一頁式網頁使用',
                                    },
                                ], [voucherData.trigger], (text) => {
                                    if (text[0] === 'auto') {
                                        voucherData.code = undefined;
                                    }
                                    if (text[0] === 'distribution') {
                                        voucherData.for = 'all';
                                    }
                                    voucherData.trigger = text[0];
                                    gvc.notifyDataChange(viewID);
                                }, { single: true })}`,
                                html `
                                                                <div class="tx_700">活動對象</div>
                                                                ${BgWidget.mbContainer(18)}
                                                                ${gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            var _a;
                                            return html `
                                                                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                                                                    ${BgWidget.selectFilter({
                                                gvc: gvc,
                                                callback: (text) => {
                                                    voucherData.target = text;
                                                    gvc.notifyDataChange(id);
                                                },
                                                default: (_a = voucherData.target) !== null && _a !== void 0 ? _a : 'all',
                                                options: [
                                                    {
                                                        key: 'all',
                                                        value: '所有顧客'
                                                    },
                                                    {
                                                        key: 'customer',
                                                        value: '特定顧客'
                                                    },
                                                    {
                                                        key: 'levels',
                                                        value: '會員等級'
                                                    },
                                                    {
                                                        key: 'group',
                                                        value: '顧客分群'
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
                                                                id: gvc.glitter.getUUID(),
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
                                                                                                                    <div class="d-flex flex-column p-2"
                                                                                                                         style="gap: 18px;">
                                                                                                                        <div
                                                                                                                                class="d-flex align-items-center gray-bottom-line-18"
                                                                                                                                style="justify-content: space-between;"
                                                                                                                        >
                                                                                                                            <div class="form-check-label c_updown_label">
                                                                                                                                <div class="tx_normal">
                                                                                                                                    顧客名稱
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            ${BgWidget.grayButton('查看全部', gvc.event(() => {
                                                                        var _a;
                                                                        BgWidget.selectDropDialog({
                                                                            gvc: gvc,
                                                                            title: '搜尋特定顧客',
                                                                            tag: 'select_users',
                                                                            updownOptions: FilterOptions.userOrderBy,
                                                                            callback: (value) => {
                                                                                voucherData.targetList = value;
                                                                                customVM.loading = true;
                                                                                gvc.notifyDataChange(customVM.id);
                                                                            },
                                                                            default: (_a = voucherData.targetList) !== null && _a !== void 0 ? _a : [],
                                                                            api: (data) => {
                                                                                return new Promise((resolve) => {
                                                                                    ApiUser.getUserListOrders({
                                                                                        page: 0,
                                                                                        limit: 99999,
                                                                                        search: data.query,
                                                                                        orderString: data.orderString,
                                                                                    }).then((dd) => {
                                                                                        if (dd.response.data) {
                                                                                            resolve(dd.response.data.map((item) => {
                                                                                                var _a;
                                                                                                return {
                                                                                                    key: item.userID,
                                                                                                    value: (_a = item.userData.name) !== null && _a !== void 0 ? _a : '（尚無姓名）',
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
                                                                        return html `
                                                                                                                                        <div class="form-check-label c_updown_label">
                                                                                                                                            <span class="tx_normal">${index + 1}
                                                                                                                                                . ${opt.value}</span>
                                                                                                                                            ${opt.note ? html `
                                                                                                                                                <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
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
                                                                            }).then((dd) => {
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
                                                                id: gvc.glitter.getUUID(),
                                                                loading: true,
                                                                dataList: [],
                                                            };
                                                            return gvc.bindView({
                                                                bind: levelVM.id,
                                                                view: () => {
                                                                    var _a;
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
                                                                            default: (_a = voucherData.targetList) !== null && _a !== void 0 ? _a : [],
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
                                                                id: gvc.glitter.getUUID(),
                                                                loading: true,
                                                                dataList: [],
                                                            };
                                                            return gvc.bindView({
                                                                bind: levelVM.id,
                                                                view: () => {
                                                                    var _a;
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
                                                                            default: (_a = voucherData.targetList) !== null && _a !== void 0 ? _a : [],
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
                                })}`,
                                html `
                                                                <div class="tx_700">可使用訂單來源</div>
                                                                ${BgWidget.mbContainer(18)}
                                                                ${BgWidget.multiCheckboxContainer(gvc, [
                                    { key: 'normal', name: 'APP & 官網' },
                                    { key: 'pos', name: 'POS' },
                                ], (_a = voucherData.device) !== null && _a !== void 0 ? _a : ['normal'], (text) => {
                                    voucherData.device = text;
                                    gvc.notifyDataChange(viewID);
                                }, { single: false })}`,
                            ]
                                .map((str) => {
                                return html `
                                                                        <div>${str}</div>`;
                            })
                                .join(BgWidget.horizontalLine())),
                            BgWidget.mainCard(gvc.bindView(() => {
                                var _a;
                                const id = glitter.getUUID();
                                voucherData.forKey = (_a = voucherData.forKey) !== null && _a !== void 0 ? _a : [];
                                let defKeys = {
                                    collection: JSON.parse(JSON.stringify(voucherData.forKey)),
                                    product: JSON.parse(JSON.stringify(voucherData.forKey)),
                                };
                                return {
                                    bind: id,
                                    dataList: [
                                        { obj: voucherData, key: 'method' },
                                        { obj: voucherData, key: 'reBackType' },
                                    ],
                                    view: () => {
                                        return [
                                            ...(() => {
                                                if (['shipment_free', 'add_on_items', 'giveaway'].includes(voucherData.reBackType)) {
                                                    return [];
                                                }
                                                const valueInput = (obj) => {
                                                    return BgWidget.editeInput({
                                                        gvc: gvc,
                                                        type: 'number',
                                                        divStyle: 'width:150px;',
                                                        title: '',
                                                        default: voucherData.value,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            const texInt = parseInt(text, 10);
                                                            if (voucherData.method === 'percent' && (texInt > 100 || texInt < 0)) {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.infoMessage({ text: '數值需介於0~100' });
                                                                gvc.notifyDataChange(id);
                                                            }
                                                            else {
                                                                voucherData.value = text;
                                                            }
                                                        },
                                                        startText: obj.startText,
                                                        endText: obj.endText,
                                                    });
                                                };
                                                return [
                                                    html `
                                                                                    <div>
                                                                                        <div class="tx_700">折扣金額
                                                                                        </div>
                                                                                        ${BgWidget.mbContainer(18)}
                                                                                        ${BgWidget.multiCheckboxContainer(gvc, [
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
                                                    ], [voucherData.method], (text) => {
                                                        voucherData.value = '0';
                                                        voucherData.method = text[0];
                                                        gvc.notifyDataChange(pageVM.conditionId);
                                                    }, { single: true })}
                                                                                    </div>`,
                                                ];
                                            })(),
                                            ...(() => {
                                                var _a;
                                                if (voucherData.trigger === 'distribution') {
                                                    return [];
                                                }
                                                return [
                                                    html `
                                                                                    <div class="tx_700">
                                                                                            套用至${voucherData.reBackType === 'shipment_free' ? BgWidget.grayNote('免運費僅限套用至所有商品', 'margin-left: 8px') : ''}
                                                                                    </div>
                                                                                    ${BgWidget.mbContainer(18)}
                                                                                    ${EditorElem.radio({
                                                        gvc: gvc,
                                                        title: '',
                                                        def: (_a = voucherData.for) !== null && _a !== void 0 ? _a : 'all',
                                                        array: productForList,
                                                        callback: (text) => {
                                                            voucherData.forKey = defKeys[text];
                                                            voucherData.for = text;
                                                            gvc.notifyDataChange(id);
                                                        },
                                                        oneLine: true,
                                                        readonly: voucherData.reBackType === 'shipment_free',
                                                    })}
                                                                                    ${BgWidget.mbContainer(8)}
                                                                                    ${(() => {
                                                        switch (voucherData.for) {
                                                            case 'collection':
                                                                return gvc.bindView(() => {
                                                                    const subVM = {
                                                                        id: gvc.glitter.getUUID(),
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
                                                                                                                <div class="d-flex flex-column p-2"
                                                                                                                     style="gap: 18px;">
                                                                                                                    <div
                                                                                                                            class="d-flex align-items-center gray-bottom-line-18"
                                                                                                                            style="gap: 24px; justify-content: space-between;"
                                                                                                                    >
                                                                                                                        <div class="form-check-label c_updown_label">
                                                                                                                            <div class="tx_normal">
                                                                                                                                分類列表
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        ${BgWidget.grayButton('選擇分類', gvc.event(() => {
                                                                                var _a;
                                                                                BgProduct.collectionsDialog({
                                                                                    gvc: gvc,
                                                                                    default: (_a = voucherData.forKey) !== null && _a !== void 0 ? _a : [],
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
                                                                                return html `
                                                                                                                                    <div
                                                                                                                                            class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                                                                                                    >
                                                                                                                                        <span class="tx_normal">${index + 1}
                                                                                                                                            . ${opt.value}</span>
                                                                                                                                        ${opt.note ? html `
                                                                                                                                            <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
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
                                                                                    new Promise((resolve) => {
                                                                                        resolve(BgProduct.getCollectiosOpts(voucherData.forKey));
                                                                                    }).then((data) => {
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
                                                                        dataList: [],
                                                                    };
                                                                    return {
                                                                        bind: subVM.id,
                                                                        view: () => {
                                                                            if (subVM.loading) {
                                                                                return BgWidget.spinner();
                                                                            }
                                                                            return html `
                                                                                                                <div class="d-flex flex-column p-2"
                                                                                                                     style="gap: 18px;">
                                                                                                                    <div
                                                                                                                            class="d-flex align-items-center gray-bottom-line-18"
                                                                                                                            style="gap: 24px; justify-content: space-between;"
                                                                                                                    >
                                                                                                                        <div class="form-check-label c_updown_label">
                                                                                                                            <div class="tx_normal">
                                                                                                                                商品列表
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                                                                var _a;
                                                                                BgProduct.productsDialog({
                                                                                    gvc: gvc,
                                                                                    default: (_a = voucherData.forKey) !== null && _a !== void 0 ? _a : [],
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
                                                                                                                    ${subVM.dataList.map((opt, index) => {
                                                                                return html `
                                                                                                                            <div
                                                                                                                                    class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                                                                                            >
                                                                                                                                <span class="tx_normal">${index + 1}
                                                                                                                                    .</span>
                                                                                                                                ${BgWidget.validImageBox({
                                                                                    gvc: gvc,
                                                                                    image: opt.image,
                                                                                    width: 40
                                                                                })}
                                                                                                                                <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                                                                                    ${opt.value}
                                                                                                                                </div>
                                                                                                                                ${opt.note ? html `
                                                                                                                                    <div class="tx_gray_12">
                                                                                                                                        ${opt.note}
                                                                                                                                    </div> ` : ''}
                                                                                                                            </div>`;
                                                                            }).join(``)}
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
                                                                                    new Promise((resolve) => {
                                                                                        resolve(BgProduct.getProductOpts(voucherData.forKey));
                                                                                    }).then((data) => {
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
                                                    })()}
                                                                                `,
                                                ];
                                            })(),
                                        ].join(BgWidget.horizontalLine());
                                    },
                                    divCreate: {},
                                };
                            })),
                            ...(() => {
                                if (['giveaway', 'add_on_items'].includes(voucherData.reBackType)) {
                                    return [BgWidget.mainCard(gvc.bindView(() => {
                                            const vm = {
                                                id: gvc.glitter.getUUID()
                                            };
                                            if (!Array.isArray(voucherData.add_on_products)) {
                                                voucherData.add_on_products = [];
                                            }
                                            return {
                                                bind: vm.id,
                                                view: () => {
                                                    return html `
                                                                        <div class="tx_700">${(voucherData.reBackType === 'add_on_items') ? `加購品項` : `贈品品項`}</div>
                                                                        ${BgWidget.mbContainer(18)}
                                                                        ${obj.gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
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
                                                                                                    <div class="tx_normal">
                                                                                                        商品列表
                                                                                                    </div>
                                                                                                </div>
                                                                                                ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                                                        var _a;
                                                                        BgProduct.productsDialog({
                                                                            gvc: gvc,
                                                                            default: (_a = voucherData.add_on_products) !== null && _a !== void 0 ? _a : [],
                                                                            callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                                                voucherData.add_on_products = value;
                                                                                gvc.notifyDataChange(id);
                                                                            }),
                                                                            filter: (dd) => {
                                                                                return true;
                                                                            },
                                                                            productType: (voucherData.reBackType === 'add_on_items') ? 'addProduct' : 'giveaway'
                                                                        });
                                                                    }), { textStyle: 'font-weight: 400;' })}
                                                                                            </div>
                                                                                            ${gvc.bindView(() => {
                                                                        const vm = {
                                                                            id: gvc.glitter.getUUID(),
                                                                            loading: true,
                                                                            data: []
                                                                        };
                                                                        BgProduct.getProductOpts(voucherData.add_on_products).then((res) => {
                                                                            vm.data = res;
                                                                            vm.loading = false;
                                                                            gvc.notifyDataChange(vm.id);
                                                                        });
                                                                        return {
                                                                            bind: vm.id,
                                                                            view: () => __awaiter(this, void 0, void 0, function* () {
                                                                                if (vm.loading) {
                                                                                    return BgWidget.spinner();
                                                                                }
                                                                                return vm.data.map((opt, index) => {
                                                                                    return html `
                                                                                                                <div
                                                                                                                        class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                                                                                >
                                                                                                                    <span class="tx_normal">${index + 1}
                                                                                                                        .</span>
                                                                                                                    ${BgWidget.validImageBox({
                                                                                        gvc: gvc,
                                                                                        image: opt.image,
                                                                                        width: 40
                                                                                    })}
                                                                                                                    <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                                                                        ${opt.value}
                                                                                                                    </div>
                                                                                                                    ${opt.note ? html `
                                                                                                                        <div class="tx_gray_12">
                                                                                                                            ${opt.note}
                                                                                                                        </div> ` : ''}
                                                                                                                </div>`;
                                                                                }).join('');
                                                                            }), divCreate: {
                                                                                class: `d-flex py-2 flex-column`,
                                                                                style: `gap:10px;`
                                                                            }
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
                                                                class: `w-100`
                                                            }
                                                        };
                                                    })}
                                                                    `;
                                                }
                                            };
                                        }))];
                                }
                                else {
                                    return [];
                                }
                            })(),
                            BgWidget.mainCard(gvc.bindView(() => {
                                return {
                                    bind: pageVM.conditionId,
                                    view: () => {
                                        const conditionInput = (text) => {
                                            var _a;
                                            return BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                divStyle: 'width:150px;',
                                                default: `${(_a = voucherData.ruleValue) !== null && _a !== void 0 ? _a : 0}`,
                                                placeHolder: '',
                                                callback: (value) => {
                                                    voucherData.ruleValue = parseInt(value, 10);
                                                    gvc.notifyDataChange(pageVM.conditionId);
                                                },
                                                endText: text,
                                            });
                                        };
                                        const n = voucherData.ruleValue;
                                        const floor = Math.floor(n / 2);
                                        const ruleText = (sum) => {
                                            return `${sum}${voucherData.rule === 'min_count' ? '個' : '元'}`;
                                        };
                                        voucherData.counting = voucherData.method === 'percent' || voucherData.reBackType === 'shipment_free' ? 'single' : voucherData.counting;
                                        voucherData.conditionType = voucherData.reBackType === 'shipment_free' ? 'order' : voucherData.conditionType;
                                        return [
                                            html `
                                                                            <div class="tx_700">消費條件</div>
                                                                            ${BgWidget.mbContainer(18)}
                                                                            ${BgWidget.multiCheckboxContainer(gvc, [
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
                                            ], [voucherData.rule], (text) => {
                                                voucherData.ruleValue = 0;
                                                voucherData.rule = text[0];
                                                gvc.notifyDataChange(pageVM.conditionId);
                                            }, { single: true })}`,
                                            html `
                                                                            <div class="tx_700">計算單位</div>
                                                                            ${BgWidget.mbContainer(18)}
                                                                            ${BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'order',
                                                    name: '以整份訂單計算',
                                                    innerHtml: BgWidget.grayNote((() => {
                                                        if (voucherData.reBackType === 'shipment_free') {
                                                            return '優惠條件為整份訂單免運費';
                                                        }
                                                        return `若商品A購買${ruleText(floor)}，加上商品B購買${ruleText(n - floor)}，可觸發優惠`;
                                                    })()),
                                                },
                                                {
                                                    key: 'item',
                                                    name: '以商品計算',
                                                    innerHtml: BgWidget.grayNote(`需要商品A購買滿${ruleText(n)}，或商品B購買滿${ruleText(n)}，即可觸發優惠<br/>若商品A購買${ruleText(floor)}，加上商品B購買${ruleText(n - floor)}，無法觸發優惠`),
                                                },
                                            ], [voucherData.conditionType], (text) => {
                                                voucherData.conditionType = text[0];
                                                gvc.notifyDataChange(pageVM.conditionId);
                                            }, {
                                                single: true,
                                                readonly: voucherData.reBackType === 'shipment_free'
                                            })}`,
                                            html `
                                                                            <div class="tx_700">重複觸發</div>
                                                                            ${BgWidget.mbContainer(18)}
                                                                            ${BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'single',
                                                    name: '不重複',
                                                    innerHtml: BgWidget.grayNote((() => {
                                                        if (voucherData.reBackType === 'shipment_free') {
                                                            return '整份訂單免運費，優惠不重複';
                                                        }
                                                        if (voucherData.method === 'percent') {
                                                            return '依百分比計算，優惠不重複';
                                                        }
                                                        return `購買${ruleText(n)}折Y元，額外購買至${ruleText(n * 2)}或${ruleText(n * 3)}依然是折Y元`;
                                                    })()),
                                                },
                                                {
                                                    key: 'each',
                                                    name: '重複',
                                                    innerHtml: BgWidget.grayNote(`購買${ruleText(n)}折Y元，購買${ruleText(n * 2)}則折Y * 2元，購買${ruleText(n * 3)}則折Y * 3元，以此類推`),
                                                },
                                            ], [voucherData.counting], (text) => {
                                                voucherData.counting = text[0];
                                                gvc.notifyDataChange(pageVM.conditionId);
                                            }, {
                                                single: true,
                                                readonly: voucherData.method === 'percent' || voucherData.reBackType === 'shipment_free'
                                            })}`,
                                        ].join(BgWidget.horizontalLine());
                                    },
                                };
                            })),
                            BgWidget.mainCard(gvc.bindView(() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return html `
                                                                        <div class="tx_700">是否與其他優惠券疊加使用
                                                                        </div>
                                                                        ${BgWidget.mbContainer(18)}
                                                                        ${BgWidget.multiCheckboxContainer(gvc, [
                                            {
                                                key: 'false',
                                                name: '不可疊加',
                                            },
                                            {
                                                key: 'true',
                                                name: '可以疊加',
                                                innerHtml: BgWidget.grayNote('系統將以最大優惠排序進行判定'),
                                            },
                                        ], [voucherData.overlay ? 'true' : 'false'], (text) => {
                                            voucherData.overlay = text[0] === 'true';
                                            gvc.notifyDataChange(id);
                                        }, { single: true })}`;
                                    },
                                };
                            })),
                            BgWidget.mainCard(gvc.bindView(() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        var _a, _b;
                                        const inputStyle = 'display: block; width:200px;';
                                        return [
                                            html `
                                                                            <div class="tx_700">全館總使用次數</div>
                                                                            ${BgWidget.mbContainer(18)}
                                                                            ${BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'noLimited',
                                                    name: '無限制',
                                                },
                                                {
                                                    key: 'hasLimited',
                                                    name: '限制次數',
                                                    innerHtml: html `
                                                                                                <div class="d-flex align-items-center">
                                                                                                    <span class="tx_normal me-2">可使用次數</span>
                                                                                                    ${BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'number',
                                                        divStyle: 'width: 150px;',
                                                        default: `${(_a = voucherData.macroLimited) !== null && _a !== void 0 ? _a : 0}`,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            voucherData.macroLimited = parseInt(text, 10);
                                                        },
                                                        endText: '次',
                                                    })}
                                                                                                </div>`,
                                                },
                                            ], [voucherData.macroLimited === 0 ? 'noLimited' : 'hasLimited'], (text) => {
                                                if (text[0] === 'noLimited') {
                                                    voucherData.macroLimited = 0;
                                                }
                                            }, { single: true })}`,
                                            html `
                                                                            <div class="tx_700">個人總使用次數</div>
                                                                            ${BgWidget.mbContainer(18)}
                                                                            ${BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'noLimited',
                                                    name: '無限制',
                                                },
                                                {
                                                    key: 'hasLimited',
                                                    name: '限制次數',
                                                    innerHtml: html `
                                                                                                <div class="d-flex align-items-center">
                                                                                                    <span class="tx_normal me-2">可使用次數</span>
                                                                                                    ${BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'number',
                                                        divStyle: 'width: 150px;',
                                                        default: `${(_b = voucherData.microLimited) !== null && _b !== void 0 ? _b : 0}`,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            voucherData.microLimited = parseInt(text, 10);
                                                        },
                                                        endText: '次',
                                                    })}
                                                                                                </div>`,
                                                },
                                            ], [voucherData.microLimited === 0 ? 'noLimited' : 'hasLimited'], (text) => {
                                                if (text[0] === 'noLimited') {
                                                    voucherData.microLimited = 0;
                                                }
                                            }, { single: true })}`,
                                            html `
                                                                            <div class="tx_700">有效日期</div>
                                                                            <div class="d-flex mb-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                                                                 style="gap: 12px">
                                                                                <div class="d-flex align-items-center">
                                                                                    <span class="tx_normal me-2">開始日期</span>
                                                                                    ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'date',
                                                style: inputStyle,
                                                default: `${voucherData.startDate}`,
                                                placeHolder: '',
                                                callback: (text) => {
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
                                                callback: (text) => {
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
                                                    innerHtml: html `
                                                                                                <div class="d-flex mt-0 mt-md-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                                                                                     style="gap: 12px">
                                                                                                    <div class="d-flex align-items-center">
                                                                                                        <span class="tx_normal me-2">結束日期</span>
                                                                                                        ${BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'date',
                                                        style: inputStyle,
                                                        default: `${voucherData.endDate}`,
                                                        placeHolder: '',
                                                        callback: (text) => {
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
                                                        callback: (text) => {
                                                            voucherData.endTime = text;
                                                        },
                                                    })}
                                                                                                    </div>
                                                                                                </div>`,
                                                },
                                            ], [voucherData.endDate ? `withEnd` : `noEnd`], (text) => {
                                                if (text[0] === 'noEnd') {
                                                    voucherData.endDate = undefined;
                                                    voucherData.endTime = undefined;
                                                }
                                            }, { single: true })}`,
                                        ].join(BgWidget.horizontalLine());
                                    },
                                };
                            })),
                        ].join(BgWidget.mbContainer(24)), undefined, 'padding: 0 ; margin: 0 !important; width: 68.5%;')}
                                    ${BgWidget.container(gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                dataList: Object.keys(voucherData).map((key) => {
                                    return { obj: voucherData, key };
                                }),
                                view: () => {
                                    return BgWidget.mainCard(gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return html `
                                                                                <div class="tx_700">摘要</div>
                                                                                ${BgWidget.mbContainer(18)}
                                                                                <div style="display: flex; gap: 12px; flex-direction: column;">
                                                                                    ${gvc.map(getVoucherTextList().map((text) => {
                                                    return html `
                                                                                                    <div class="${text.length > 0 ? 'tx_normal' : 'gray-top-bottom-line-6'}">
                                                                                                        ${text}
                                                                                                    </div>`;
                                                }))}
                                                                                </div>
                                                                            `;
                                            },
                                        };
                                    }));
                                },
                                divCreate: {
                                    class: 'summary-card p-0',
                                },
                            };
                        }), undefined, 'padding: 0; margin: 0 !important; width: 26.5%;')}
                                </div>`,
                        BgWidget.mbContainer(240),
                        html `
                                <div class="update-bar-container">
                                    ${obj.type === 'replace'
                            ? BgWidget.cancel(gvc.event(() => {
                                const dialog = new ShareDialog(obj.gvc.glitter);
                                dialog.checkYesOrNot({
                                    text: '是否確認刪除優惠券?',
                                    callback: (response) => {
                                        if (response) {
                                            dialog.dataLoading({ visible: true });
                                            ApiShop.deleteVoucher({
                                                id: voucherData.id,
                                            }).then((res) => {
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
                            const dialog = new ShareDialog(gvc.glitter);
                            if (obj.type === 'replace') {
                                dialog.dataLoading({ text: '正在更新優惠券', visible: true });
                                ApiPost.put({
                                    postData: voucherData,
                                    token: window.parent.saasConfig.config.token,
                                    type: 'manager',
                                }).then((re) => {
                                    dialog.dataLoading({ visible: false });
                                    if (re.result) {
                                        vm.status = 'list';
                                        dialog.successMessage({ text: '上傳成功' });
                                    }
                                    else {
                                        dialog.errorMessage({ text: '上傳失敗' });
                                    }
                                });
                            }
                            else {
                                dialog.dataLoading({ text: '正在新增優惠券', visible: true });
                                ApiPost.post({
                                    postData: voucherData,
                                    token: window.parent.saasConfig.config.token,
                                    type: 'manager',
                                }).then((re) => {
                                    dialog.dataLoading({ visible: false });
                                    if (re.result) {
                                        vm.type = 'list';
                                        dialog.successMessage({ text: `上傳成功` });
                                    }
                                    else {
                                        dialog.errorMessage({ text: `上傳失敗` });
                                    }
                                });
                            }
                        }))}
                                </div>`,
                    ].join(BgWidget.mbContainer(24)), BgWidget.getContainerWidth());
                },
            };
        });
    }
}
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
window.glitter.setModule(import.meta.url, ShoppingDiscountSetting);
