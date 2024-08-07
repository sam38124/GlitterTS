import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgProduct, OptionsItem } from '../backend-manager/bg-product.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';

export class ShoppingDiscountSetting {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
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
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('優惠券管理')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton(
                                        '新增優惠券',
                                        gvc.event(() => {
                                            vm.data = undefined;
                                            vm.type = 'add';
                                        })
                                    )}
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        BgWidget.tableV2({
                                            gvc: gvc,
                                            getData: (vmi) => {
                                                ApiShop.getVoucher({
                                                    page: vmi.page - 1,
                                                    limit: 20,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                                    vm.dataList = data.response.data;

                                                    function getDatalist() {
                                                        return data.response.data.map((dd: any) => {
                                                            return [
                                                                {
                                                                    key: EditorElem.checkBoxOnly({
                                                                        gvc: gvc,
                                                                        def: !data.response.data.find((dd: any) => {
                                                                            return !dd.checked;
                                                                        }),
                                                                        callback: (result) => {
                                                                            data.response.data.map((dd: any) => {
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
                                                                    value: html`<span class="fs-7">${dd.content.title}</span>`,
                                                                },
                                                                {
                                                                    key: '狀態',
                                                                    value: dd.content.status
                                                                        ? html`<div class="badge badge-success fs-7">啟用中</div>`
                                                                        : html`<div class="badge bg-secondary fs-7">已停用</div>`,
                                                                },
                                                                {
                                                                    key: '觸發方式',
                                                                    value: html`<span class="fs-7">${dd.content.trigger === 'code' ? `輸入代碼` : `自動`}</span>`,
                                                                },
                                                                {
                                                                    key: '對象',
                                                                    value: html`<span class="fs-7">${dd.content.for === 'product' ? `指定商品` : `商品分類`}</span>`,
                                                                },
                                                                {
                                                                    key: '折扣項目',
                                                                    value: html`<span class="fs-7">${dd.content.method === 'percent' ? `折扣${dd.content.value}%` : `折扣$${dd.content.value}`}</span>`,
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
                                            filter: html` ${BgWidget.searchPlace(
                                                gvc.event((e) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋所有折扣'
                                            )}
                                            ${gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (
                                                            !vm.dataList ||
                                                            !vm.dataList.find((dd: any) => {
                                                                return dd.checked;
                                                            })
                                                        ) {
                                                            return ``;
                                                        } else {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                            return BgWidget.selNavbar({
                                                                count: selCount,
                                                                buttonList: [
                                                                    BgWidget.selEventButton(
                                                                        '批量移除',
                                                                        gvc.event(() => {
                                                                            dialog.checkYesOrNot({
                                                                                text: '是否確認刪除所選項目？',
                                                                                callback: (response) => {
                                                                                    if (response) {
                                                                                        dialog.dataLoading({ visible: true });
                                                                                        ApiShop.deleteVoucher({
                                                                                            id: vm.dataList
                                                                                                .filter((dd: any) => {
                                                                                                    return dd.checked;
                                                                                                })
                                                                                                .map((dd: any) => {
                                                                                                    return dd.id;
                                                                                                })
                                                                                                .join(`,`),
                                                                                        }).then((res) => {
                                                                                            dialog.dataLoading({ visible: false });
                                                                                            if (res.result) {
                                                                                                vm.dataList = undefined;
                                                                                                gvc.notifyDataChange(id);
                                                                                            } else {
                                                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                },
                                                                            });
                                                                        })
                                                                    ),
                                                                ],
                                                            });
                                                        }
                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex align-items-center p-2 py-3 ${
                                                                !vm.dataList ||
                                                                !vm.dataList.find((dd: any) => {
                                                                    return dd.checked;
                                                                })
                                                                    ? `d-none`
                                                                    : ``
                                                            }`,
                                                            style: ``,
                                                        };
                                                    },
                                                };
                                            })}`,
                                        })
                                    )
                                )}
                                ${BgWidget.mbContainer(120)}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace') {
                        return this.voucherEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    } else {
                        return this.voucherEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                        });
                    }
                },
            };
        });
    }

    public static getDateTime = (n = 0) => {
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

    public static voucherEditor(obj: { vm: any; gvc: GVC; type?: 'add' | 'replace'; defData?: any }) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vm = obj.vm;
        const html = String.raw;
        const voucherData: {
            id: string;
            title: string;
            reBackType: 'rebate' | 'discount' | 'shipment_free';
            method: 'percent' | 'fixed';
            trigger: 'auto' | 'code' | 'distribution';
            value: string;
            for: 'collection' | 'product' | 'all';
            rule: 'min_price' | 'min_count';
            forKey: (number | string)[];
            ruleValue: number;
            startDate: string;
            startTime: string;
            endDate?: string;
            endTime?: string;
            status: 0 | 1 | -1;
            type: 'voucher';
            code?: string;
            overlay: boolean;
            start_ISO_Date: string;
            end_ISO_Date: string;
            rebateEndDay: string;
            target: string;
            targetList: [];
            macroLimited: number;
            microLimited: number;
        } = vm.data ?? {
            title: '',
            code: '',
            trigger: 'auto',
            method: 'fixed',
            value: '0',
            for: 'all',
            forKey: [],
            rule: 'min_price',
            ruleValue: 0,
            startDate: this.getDateTime().date,
            startTime: this.getDateTime().time,
            endDate: this.getDateTime(7).date,
            endTime: this.getDateTime(7).time,
            status: 1,
            type: 'voucher',
            overlay: false,
            start_ISO_Date: '',
            end_ISO_Date: '',
            reBackType: 'discount',
            rebateEndDay: '0',
            target: 'all',
            targetList: [],
            macroLimited: 0,
            microLimited: 0,
        };
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);
        const productForList = [
            { title: '所有商品', value: 'all' },
            { title: '商品分類', value: 'collection' },
            { title: '單一商品', value: 'product' },
        ];

        function getVoucherTextList() {
            return [
                `活動標題：${voucherData.title && voucherData.title.length > 0 ? voucherData.title : '尚無標題'}`,
                `適用商品：${(() => {
                    const forData = productForList.find((item) => item.value === voucherData.for);
                    return forData ? forData.title : '';
                })()}`,
                `折扣方式：${(() => {
                    if (voucherData.trigger === 'auto') return '自動折扣';
                    if (voucherData.trigger === 'distribution') return '分銷連結';
                    if (voucherData.trigger === 'code') return `優惠代碼「${voucherData.code ?? ''}」`;
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
                    if (voucherData.rule === 'min_price') return '最少消費金額';
                    if (voucherData.rule === 'min_count') return '最少購買數量';
                    return '';
                })()}`,
                `條件值：${(() => {
                    if (voucherData.rule === 'min_price') return voucherData.ruleValue + ' 元';
                    if (voucherData.rule === 'min_count') return voucherData.ruleValue + ' 個';
                    return '';
                })()}`,
                `折扣優惠：${(() => {
                    switch (voucherData.reBackType) {
                        case 'rebate':
                            return voucherData.method === 'fixed' ? `${voucherData.value} 點購物金` : `訂單總額的 ${voucherData.value} ％作為購物金`;
                        case 'discount':
                            return voucherData.method === 'fixed' ? `折扣 ${voucherData.value} 元` : `訂單總額折扣 ${voucherData.value} ％`;
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
                `啟用時間：${voucherData.startDate ?? '未設定日期'} ${voucherData.startTime ?? '尚未設定時間'}`,
                `結束時間：${(() => {
                    if (!voucherData.endDate) return '無期限';
                    return `${voucherData.endDate ?? '未設定日期'} ${voucherData.endTime ?? '尚未設定時間'}`;
                })()}`,
            ];
        }

        return gvc.bindView(() => {
            const viewID = gvc.glitter.getUUID();
            return {
                bind: viewID,
                view: () => {
                    return BgWidget.container(
                        [
                            // 上層導覽
                            html`<div class="d-flex w-100 align-items-center">
                                ${BgWidget.goBack(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.title(obj.type === 'add' ? '新增優惠券' : '編輯優惠券')}
                            </div>`,
                            // 左右容器
                            html`<div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                                ${BgWidget.container(
                                    // 優惠券設定
                                    [
                                        BgWidget.mainCard(
                                            html` <div class="tx_700" style="margin-bottom: 18px">活動標題</div>
                                                ${EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: voucherData.title,
                                                    placeHolder: '請輸入活動標題',
                                                    callback: (text) => {
                                                        voucherData.title = text;
                                                    },
                                                })}
                                                ${BgWidget.grayNote('顧客將會在「購物車」與「結帳」看見此標題', 'font-size: 14px; margin-left: 4px;')}`
                                        ),
                                        BgWidget.mainCard(
                                            html`<div style="display: flex; flex-direction: column; gap: 18px;">
                                                <div class="gray-bottom-line-18">
                                                    ${EditorElem.radio({
                                                        gvc: gvc,
                                                        title: '折扣方式',
                                                        def: voucherData.trigger,
                                                        array: [
                                                            { title: '自動折扣', value: 'auto', innerHtml: BgWidget.grayNote('顧客將在結帳時自動獲得折扣', 'font-size: 14px; margin-left: 22px;') },
                                                            {
                                                                title: '優惠代碼',
                                                                value: 'code',
                                                                innerHtml: (() => {
                                                                    const id = glitter.getUUID();
                                                                    return gvc.bindView({
                                                                        bind: id,
                                                                        view: () => html`<div style="position: relative">
                                                                            ${gvc.map([
                                                                                BgWidget.leftLineBar(),
                                                                                BgWidget.grayNote('顧客可在結帳時輸入優惠代碼以獲得折扣', 'font-size: 14px; margin-left: 22px;'),
                                                                                EditorElem.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: '',
                                                                                    default: voucherData.code ?? '',
                                                                                    placeHolder: '請輸入優惠券代碼',
                                                                                    callback: (text) => {
                                                                                        voucherData.code = text;
                                                                                    },
                                                                                    style: 'margin-left: 22px; margin-top: 8px; width: calc(100% - 22px);',
                                                                                }),
                                                                                html`<div class="d-flex justify-content-end" style="margin-top: 8px;">
                                                                                    ${BgWidget.blueNote('隨機產生優惠代碼', () =>
                                                                                        gvc.event(() => {
                                                                                            voucherData.code = BgWidget.randomString(6).toUpperCase();
                                                                                            gvc.notifyDataChange(id);
                                                                                        })
                                                                                    )}
                                                                                </div>`,
                                                                            ])}
                                                                        </div>`,
                                                                    });
                                                                })(),
                                                            },
                                                            {
                                                                title: '供分銷連結或一頁式網頁使用',
                                                                value: 'distribution',
                                                                innerHtml: BgWidget.grayNote('顧客將在結帳時自動獲得折扣', 'font-size: 14px; margin-left: 22px;'),
                                                            },
                                                        ],
                                                        callback: (text) => {
                                                            if (text === 'auto') {
                                                                voucherData.code = undefined;
                                                            }
                                                            if (text === 'distribution') {
                                                                voucherData.for = 'all';
                                                            }
                                                            voucherData.trigger = text as any;
                                                            gvc.notifyDataChange(viewID);
                                                        },
                                                    })}
                                                </div>
                                                <div>
                                                    <div class="tx_700 " style="margin-bottom: 18px">活動對象</div>
                                                    ${gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return html`
                                                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                                                        ${BgWidget.selectFilter({
                                                                            gvc: gvc,
                                                                            callback: (text) => {
                                                                                voucherData.target = text;
                                                                                gvc.notifyDataChange(id);
                                                                            },
                                                                            default: voucherData.target ?? 'all',
                                                                            options: [
                                                                                { key: 'all', value: '所有顧客' },
                                                                                { key: 'customer', value: '特定顧客' },
                                                                                { key: 'levels', value: '會員等級' },
                                                                                { key: 'group', value: '顧客分群' },
                                                                            ],
                                                                            style: 'width: 100%; background-position-x: 97.5%;',
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
                                                                                                dataList: [] as OptionsItem[],
                                                                                            };
                                                                                            return {
                                                                                                bind: customVM.id,
                                                                                                view: () => {
                                                                                                    if (customVM.loading) {
                                                                                                        return BgWidget.spinner();
                                                                                                    }
                                                                                                    return html`
                                                                                                        <div class="d-flex flex-column p-2" style="gap: 18px;">
                                                                                                            <div
                                                                                                                class="d-flex align-items-center gray-bottom-line-18"
                                                                                                                style="justify-content: space-between;"
                                                                                                            >
                                                                                                                <div class="form-check-label c_updown_label">
                                                                                                                    <div class="tx_normal">顧客名稱</div>
                                                                                                                </div>
                                                                                                                ${BgWidget.grayButton(
                                                                                                                    '查看全部',
                                                                                                                    gvc.event(() => {
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
                                                                                                                            default: voucherData.targetList ?? [],
                                                                                                                            api: (data: { query: string; orderString: string }) => {
                                                                                                                                return new Promise((resolve) => {
                                                                                                                                    ApiUser.getUserListOrders({
                                                                                                                                        page: 0,
                                                                                                                                        limit: 99999,
                                                                                                                                        search: data.query,
                                                                                                                                        orderString: data.orderString,
                                                                                                                                    }).then((dd) => {
                                                                                                                                        if (dd.response.data) {
                                                                                                                                            resolve(
                                                                                                                                                dd.response.data.map(
                                                                                                                                                    (item: {
                                                                                                                                                        userID: number;
                                                                                                                                                        userData: { name: string; email: string };
                                                                                                                                                    }) => {
                                                                                                                                                        return {
                                                                                                                                                            key: item.userID,
                                                                                                                                                            value: item.userData.name ?? '（尚無姓名）',
                                                                                                                                                            note: item.userData.email,
                                                                                                                                                        };
                                                                                                                                                    }
                                                                                                                                                )
                                                                                                                                            );
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                });
                                                                                                                            },
                                                                                                                            style: 'width: 100%; background-position-x: 97.5%;',
                                                                                                                        });
                                                                                                                    }),
                                                                                                                    { textStyle: 'font-weight: 400;' }
                                                                                                                )}
                                                                                                            </div>
                                                                                                            ${obj.gvc.map(
                                                                                                                customVM.dataList.map((opt: OptionsItem, index) => {
                                                                                                                    return html`<div class="form-check-label c_updown_label">
                                                                                                                        <span class="tx_normal">${index + 1}. ${opt.value}</span>
                                                                                                                        ${opt.note ? html` <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
                                                                                                                    </div>`;
                                                                                                                })
                                                                                                            )}
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
                                                                                                            }, 300);
                                                                                                        } else {
                                                                                                            ApiUser.getUserList({
                                                                                                                page: 0,
                                                                                                                limit: 99999,
                                                                                                                id: voucherData.targetList.join(','),
                                                                                                            }).then((dd) => {
                                                                                                                if (dd.response.data) {
                                                                                                                    customVM.dataList = dd.response.data.map(
                                                                                                                        (item: { userID: string; userData: { name: string; email: string } }) => {
                                                                                                                            return {
                                                                                                                                key: item.userID,
                                                                                                                                value: item.userData.name,
                                                                                                                                note: item.userData.email,
                                                                                                                            };
                                                                                                                        }
                                                                                                                    );
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
                                                                                                    if (levelVM.loading) {
                                                                                                        return BgWidget.spinner({ textNone: true });
                                                                                                    } else {
                                                                                                        return BgWidget.selectDropList({
                                                                                                            gvc: gvc,
                                                                                                            callback: (value: []) => {
                                                                                                                voucherData.targetList = value;
                                                                                                                gvc.notifyDataChange(id);
                                                                                                            },
                                                                                                            default: voucherData.targetList ?? [],
                                                                                                            options: levelVM.dataList,
                                                                                                            style: 'width: 100%; background-position-x: 97.5%;',
                                                                                                        });
                                                                                                    }
                                                                                                },
                                                                                                divCreate: {
                                                                                                    style: 'width: 100%;',
                                                                                                },
                                                                                                onCreate: () => {
                                                                                                    if (levelVM.loading) {
                                                                                                        ApiUser.getPublicConfig('member_level_config', 'manager').then((dd: any) => {
                                                                                                            if (dd.result && dd.response.value) {
                                                                                                                levelVM.dataList = dd.response.value.levels.map(
                                                                                                                    (item: { id: string; tag_name: string }) => {
                                                                                                                        return {
                                                                                                                            key: item.id,
                                                                                                                            value: item.tag_name,
                                                                                                                            // note.txt: '人數'
                                                                                                                        };
                                                                                                                    }
                                                                                                                );
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
                                                                                                    if (levelVM.loading) {
                                                                                                        return BgWidget.spinner({ textNone: true });
                                                                                                    } else {
                                                                                                        return BgWidget.selectDropList({
                                                                                                            gvc: gvc,
                                                                                                            callback: (value: []) => {
                                                                                                                voucherData.targetList = value;
                                                                                                                gvc.notifyDataChange(id);
                                                                                                            },
                                                                                                            default: voucherData.targetList ?? [],
                                                                                                            options: levelVM.dataList,
                                                                                                            style: 'width: 100%; background-position-x: 97.5%;',
                                                                                                        });
                                                                                                    }
                                                                                                },
                                                                                                divCreate: {
                                                                                                    style: 'width: 100%;',
                                                                                                },
                                                                                                onCreate: () => {
                                                                                                    if (levelVM.loading) {
                                                                                                        ApiUser.getUserGroupList().then((dd: any) => {
                                                                                                            console.log(dd);
                                                                                                            if (dd.result && dd.response.data) {
                                                                                                                levelVM.dataList = dd.response.data
                                                                                                                    .filter((item: any) => {
                                                                                                                        return item.type !== 'level';
                                                                                                                    })
                                                                                                                    .map((item: any) => {
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
                                                    })}
                                                </div>
                                            </div>`
                                        ),
                                        BgWidget.mainCard(
                                            gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                let defKeys: any = {
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
                                                            html`<div class="gray-bottom-line-18">
                                                                <h6 class="tx_700">折扣優惠</h6>
                                                                ${EditorElem.radio({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    def: voucherData.reBackType,
                                                                    array: [
                                                                        { title: '訂單折扣', value: 'discount' },
                                                                        { title: '購物金', value: 'rebate' },
                                                                        { title: '免運費', value: 'shipment_free' },
                                                                    ],
                                                                    callback: (text) => {
                                                                        voucherData.reBackType = text as any;
                                                                    },
                                                                    oneLine: true,
                                                                })}
                                                                <div class="${voucherData.reBackType === 'rebate' ? 'd-block' : 'd-none'}" style="margin-top: 18px;">
                                                                    <h3 class="tx_700">購物金使用期限</h3>
                                                                    <div class="d-flex align-items-center">
                                                                        ${EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            type: 'number',
                                                                            style: `width:125px;`,
                                                                            title: '',
                                                                            default: voucherData.rebateEndDay,
                                                                            placeHolder: '',
                                                                            callback: (text) => {
                                                                                voucherData.rebateEndDay = text;
                                                                            },
                                                                        })}
                                                                        <div style="width: 32px;" class="d-flex align-items-center justify-content-center">
                                                                            <span style="font-size: 16px;">天</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>`,
                                                            (() => {
                                                                if (voucherData.reBackType === 'shipment_free') {
                                                                    return ``;
                                                                } else {
                                                                    return html`<div class="${voucherData.trigger === 'distribution' ? `` : `gray-bottom-line-18`}">
                                                                        ${[
                                                                            html`<h6 class="tx_700 mt-2">折扣金額</h6>`,
                                                                            EditorElem.radio({
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                def: voucherData.method,
                                                                                array: [
                                                                                    { title: '固定金額', value: 'fixed' },
                                                                                    { title: '百分比', value: 'percent' },
                                                                                ],
                                                                                callback: (text) => {
                                                                                    voucherData.value = '0';
                                                                                    voucherData.method = text as any;
                                                                                },
                                                                                oneLine: true,
                                                                            }),
                                                                            html` <h3 class="tx_700">值</h3>
                                                                                <div
                                                                                    class="d-flex align-items-center"
                                                                                    style="${voucherData.method === 'fixed' ? 'flex-direction: row-reverse; justify-content: flex-end;' : ''}"
                                                                                >
                                                                                    ${EditorElem.editeInput({
                                                                                        gvc: gvc,
                                                                                        type: 'number',
                                                                                        style: `width:125px;`,
                                                                                        title: '',
                                                                                        default: voucherData.value,
                                                                                        placeHolder: '',
                                                                                        callback: (text) => {
                                                                                            if (voucherData.method === 'percent' && parseInt(text, 10) >= 100) {
                                                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                                                dialog.infoMessage({ text: '數值不得大於100%' });
                                                                                                gvc.notifyDataChange(id);
                                                                                            } else {
                                                                                                voucherData.value = text;
                                                                                            }
                                                                                        },
                                                                                    })}
                                                                                    <div style="width: 32px;" class="d-flex align-items-center justify-content-center">
                                                                                        <span style="font-size: 16px;">${voucherData.method === 'fixed' ? `$` : `%`}</span>
                                                                                    </div>
                                                                                </div>`,
                                                                        ].join(html`<div style="margin-top: 18px;"></div>`)}
                                                                    </div>`;
                                                                }
                                                            })(),
                                                            ...(() => {
                                                                if (voucherData.trigger !== 'distribution') {
                                                                    return [
                                                                        html`
                                                                            <h3 class="tx_700">套用至</h3>
                                                                            ${EditorElem.radio({
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                def: voucherData.for,
                                                                                array: productForList,
                                                                                callback: (text) => {
                                                                                    voucherData.forKey = defKeys[text];
                                                                                    voucherData.for = text as 'collection' | 'product' | 'all';
                                                                                    gvc.notifyDataChange(id);
                                                                                },
                                                                                oneLine: true,
                                                                            })}
                                                                        `,
                                                                    ];
                                                                } else {
                                                                    return [];
                                                                }
                                                            })(),
                                                            html`${(() => {
                                                                switch (voucherData.for) {
                                                                    case 'collection':
                                                                        return gvc.bindView(() => {
                                                                            const subVM = {
                                                                                id: gvc.glitter.getUUID(),
                                                                                loading: true,
                                                                                dataList: [] as OptionsItem[],
                                                                            };
                                                                            return {
                                                                                bind: subVM.id,
                                                                                view: () => {
                                                                                    if (subVM.loading) {
                                                                                        return BgWidget.spinner();
                                                                                    }
                                                                                    return html`
                                                                                        <div class="d-flex flex-column p-2" style="gap: 18px;">
                                                                                            <div
                                                                                                class="d-flex align-items-center gray-bottom-line-18"
                                                                                                style="gap: 24px; justify-content: space-between;"
                                                                                            >
                                                                                                <div class="form-check-label c_updown_label">
                                                                                                    <div class="tx_normal">分類列表</div>
                                                                                                </div>
                                                                                                ${BgWidget.grayButton(
                                                                                                    '選擇分類',
                                                                                                    gvc.event(() => {
                                                                                                        BgProduct.collectionsDialog({
                                                                                                            gvc: gvc,
                                                                                                            default: voucherData.forKey ?? [],
                                                                                                            callback: async (value) => {
                                                                                                                voucherData.forKey = value;
                                                                                                                defKeys.collection = value;
                                                                                                                subVM.dataList = await BgProduct.getCollectiosOpts(value);
                                                                                                                subVM.loading = true;
                                                                                                                gvc.notifyDataChange(subVM.id);
                                                                                                            },
                                                                                                        });
                                                                                                    }),
                                                                                                    { textStyle: 'font-weight: 400;' }
                                                                                                )}
                                                                                            </div>
                                                                                            ${obj.gvc.map(
                                                                                                subVM.dataList.map((opt: OptionsItem, index) => {
                                                                                                    return html`<div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                        <span class="tx_normal">${index + 1}. ${opt.value}</span>
                                                                                                        ${opt.note ? html` <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
                                                                                                    </div>`;
                                                                                                })
                                                                                            )}
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
                                                                                            }, 300);
                                                                                        } else {
                                                                                            new Promise<OptionsItem[]>((resolve) => {
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
                                                                                dataList: [] as OptionsItem[],
                                                                            };
                                                                            return {
                                                                                bind: subVM.id,
                                                                                view: () => {
                                                                                    if (subVM.loading) {
                                                                                        return BgWidget.spinner();
                                                                                    }
                                                                                    return html`
                                                                                        <div class="d-flex flex-column p-2" style="gap: 18px;">
                                                                                            <div
                                                                                                class="d-flex align-items-center gray-bottom-line-18"
                                                                                                style="gap: 24px; justify-content: space-between;"
                                                                                            >
                                                                                                <div class="form-check-label c_updown_label">
                                                                                                    <div class="tx_normal">商品列表</div>
                                                                                                </div>
                                                                                                ${BgWidget.grayButton(
                                                                                                    '選擇商品',
                                                                                                    gvc.event(() => {
                                                                                                        BgProduct.productsDialog({
                                                                                                            gvc: gvc,
                                                                                                            default: voucherData.forKey ?? [],
                                                                                                            callback: async (value) => {
                                                                                                                voucherData.forKey = value;
                                                                                                                defKeys.product = value;
                                                                                                                subVM.dataList = await BgProduct.getProductOpts(voucherData.forKey);
                                                                                                                subVM.loading = true;
                                                                                                                gvc.notifyDataChange(subVM.id);
                                                                                                            },
                                                                                                        });
                                                                                                    }),
                                                                                                    { textStyle: 'font-weight: 400;' }
                                                                                                )}
                                                                                            </div>
                                                                                            ${obj.gvc.map(
                                                                                                subVM.dataList.map((opt: OptionsItem, index) => {
                                                                                                    return html`<div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                        <span class="tx_normal">${index + 1}.</span>
                                                                                                        ${BgWidget.validImageBox({ gvc: gvc, image: opt.image, width: 40 })}
                                                                                                        <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                                                                        ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                                                                    </div>`;
                                                                                                })
                                                                                            )}
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
                                                                                            }, 300);
                                                                                        } else {
                                                                                            new Promise<OptionsItem[]>((resolve) => {
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
                                                            })()}`,
                                                        ].join(html`<div style="margin-top: 18px;"></div>`);
                                                    },
                                                    divCreate: {},
                                                };
                                            })
                                        ),
                                        BgWidget.mainCard(
                                            gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return [
                                                            html` <h6 class="tx_700">消費條件</h6>`,
                                                            EditorElem.radio({
                                                                gvc: gvc,
                                                                title: '',
                                                                def: voucherData.rule,
                                                                array: [
                                                                    {
                                                                        title: '最低消費金額',
                                                                        value: 'min_price',
                                                                        innerHtml: html`<div class="d-flex align-items-center border rounded-3 mx-2">
                                                                            <input
                                                                                class="form-control border-0 bg-transparent shadow-none"
                                                                                type="number"
                                                                                style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                                                                placeholder=""
                                                                                onchange="${gvc.event((e) => {
                                                                                    voucherData.ruleValue = parseInt(e.value, 10);
                                                                                })}"
                                                                                value="${voucherData.ruleValue ?? 0}"
                                                                            />
                                                                            <div class="py-2 pe-3">元</div>
                                                                        </div>`,
                                                                    },
                                                                    {
                                                                        title: '最少購買數量',
                                                                        value: 'min_count',
                                                                        innerHtml: html`<div class="d-flex align-items-center border rounded-3 mx-2">
                                                                            <input
                                                                                class="form-control border-0 bg-transparent shadow-none"
                                                                                type="number"
                                                                                style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                                                                placeholder=""
                                                                                onchange="${gvc.event((e) => {
                                                                                    voucherData.ruleValue = parseInt(e.value, 10);
                                                                                })}"
                                                                                value="${voucherData.ruleValue ?? 0}"
                                                                            />
                                                                            <div class="py-2 pe-3">個</div>
                                                                        </div>`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    voucherData.ruleValue = 0;
                                                                    voucherData.rule = text as any;
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                            }),
                                                        ].join('');
                                                    },
                                                };
                                            })
                                        ),
                                        BgWidget.mainCard(
                                            gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return [
                                                            html`<h6 class="tx_700">是否可疊加使用</h6>`,
                                                            EditorElem.radio({
                                                                gvc: gvc,
                                                                title: '',
                                                                def: voucherData.overlay ? `true` : `false`,
                                                                array: [
                                                                    { title: '不可疊加', value: 'false' },
                                                                    { title: '可以疊加', value: 'true' },
                                                                ],
                                                                callback: (text) => {
                                                                    voucherData.overlay = text === 'true';
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                            }),
                                                            voucherData.overlay ? BgWidget.grayNote('系統將以最大優惠排序進行判定', 'font-size: 14px; margin-left: 22px;') : '',
                                                        ].join('');
                                                    },
                                                };
                                            })
                                        ),
                                        BgWidget.mainCard(
                                            gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        const inputStyle = 'font-size: 16px; height:40px; width:200px;';
                                                        return [
                                                            html`<h6 class="tx_700">全館總使用次數</h6>`,
                                                            EditorElem.radio({
                                                                gvc: gvc,
                                                                title: '',
                                                                def: voucherData.macroLimited === 0 ? 'noLimited' : 'hasLimited',
                                                                array: [
                                                                    {
                                                                        title: '無限制',
                                                                        value: 'noLimited',
                                                                    },
                                                                    {
                                                                        title: '限制次數',
                                                                        value: 'hasLimited',
                                                                        innerHtml: html`<div class="my-3">
                                                                            ${EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: html`<h6 class="tx_700">可使用次數</h6>`,
                                                                                type: 'number',
                                                                                style: 'width: 125px;',
                                                                                default: `${voucherData.macroLimited ?? 0}`,
                                                                                placeHolder: '',
                                                                                callback: (text) => {
                                                                                    voucherData.macroLimited = parseInt(text, 10);
                                                                                },
                                                                                unit: '次',
                                                                            })}
                                                                        </div>`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    if (text === 'noLimited') {
                                                                        voucherData.macroLimited = 0;
                                                                    }
                                                                },
                                                            }),
                                                            html`<div class="gray-top-bottom-line-18"></div>`,
                                                            html`<h6 class="tx_700">個人總使用次數</h6>`,
                                                            EditorElem.radio({
                                                                gvc: gvc,
                                                                title: '',
                                                                def: voucherData.microLimited === 0 ? 'noLimited' : 'hasLimited',
                                                                array: [
                                                                    {
                                                                        title: '無限制',
                                                                        value: 'noLimited',
                                                                    },
                                                                    {
                                                                        title: '限制次數',
                                                                        value: 'hasLimited',
                                                                        innerHtml: html`<div class="my-3">
                                                                            ${EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: html`<h6 class="tx_700">可使用次數</h6>`,
                                                                                type: 'number',
                                                                                style: 'width: 125px;',
                                                                                default: `${voucherData.microLimited ?? 0}`,
                                                                                placeHolder: '',
                                                                                callback: (text) => {
                                                                                    voucherData.microLimited = parseInt(text, 10);
                                                                                },
                                                                                unit: '次',
                                                                            })}
                                                                        </div>`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    if (text === 'noLimited') {
                                                                        voucherData.microLimited = 0;
                                                                    }
                                                                },
                                                            }),
                                                            html`<div class="gray-top-bottom-line-18"></div>`,
                                                            html`<h6 class="tx_700">有效日期</h6>`,
                                                            html`<div class="d-flex mb-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                                ${EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '<span class="tx_normal">開始日期</span>',
                                                                    type: 'date',
                                                                    style: inputStyle,
                                                                    default: `${voucherData.startDate}`,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        voucherData.startDate = text;
                                                                    },
                                                                })}
                                                                ${EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '<span class="tx_normal">開始時間</span>',
                                                                    type: 'time',
                                                                    style: inputStyle,
                                                                    default: `${voucherData.startTime}`,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        voucherData.startTime = text;
                                                                    },
                                                                })}
                                                            </div>`,
                                                            (() => {
                                                                const endDate = voucherData.endDate ? `withEnd` : `noEnd`;
                                                                return EditorElem.radio({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    def: endDate,
                                                                    array: [
                                                                        {
                                                                            title: '無期限',
                                                                            value: 'noEnd',
                                                                        },
                                                                        {
                                                                            title: '有效期限',
                                                                            value: 'withEnd',
                                                                            innerHtml: html`<div class="d-flex mt-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                                                ${EditorElem.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: '<span class="tx_normal">結束日期</span>',
                                                                                    type: 'date',
                                                                                    style: inputStyle,
                                                                                    default: `${voucherData.endDate}`,
                                                                                    placeHolder: '',
                                                                                    callback: (text) => {
                                                                                        voucherData.endDate = text;
                                                                                    },
                                                                                })}
                                                                                ${EditorElem.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: '<span class="tx_normal">結束時間</span>',
                                                                                    type: 'time',
                                                                                    style: inputStyle,
                                                                                    default: `${voucherData.endTime}`,
                                                                                    placeHolder: '',
                                                                                    callback: (text) => {
                                                                                        voucherData.endTime = text;
                                                                                    },
                                                                                })}
                                                                            </div>`,
                                                                        },
                                                                    ],
                                                                    callback: (text) => {
                                                                        if (text === 'noEnd') {
                                                                            voucherData.endDate = undefined;
                                                                            voucherData.endTime = undefined;
                                                                        }
                                                                    },
                                                                });
                                                            })(),
                                                        ].join('');
                                                    },
                                                };
                                            })
                                        ),
                                    ].join(html`<div style="margin-top: 24px;"></div>`),
                                    undefined,
                                    'padding: 0 ; margin: 0 !important; width: 68.5%;'
                                )}
                                ${BgWidget.container(
                                    // 摘要預覽
                                    gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            dataList: Object.keys(voucherData).map((key) => {
                                                return { obj: voucherData, key };
                                            }),
                                            view: () => {
                                                return BgWidget.mainCard(
                                                    gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return html`
                                                                    <h3 class="tx_700" style="margin-bottom: 18px;">摘要</h3>
                                                                    <div style="display: flex; gap: 12px; flex-direction: column;">
                                                                        ${gvc.map(
                                                                            getVoucherTextList().map((text) => {
                                                                                return html` <div class="${text.length > 0 ? 'tx_normal' : 'gray-top-bottom-line-6'}">${text}</div>`;
                                                                            })
                                                                        )}
                                                                    </div>
                                                                `;
                                                            },
                                                        };
                                                    })
                                                );
                                            },
                                            divCreate: {
                                                class: 'summary-card p-0',
                                            },
                                        };
                                    }),
                                    undefined,
                                    'padding: 0; margin: 0 !important; width: 26.5%;'
                                )}
                            </div>`,
                            // 空白容器
                            BgWidget.mb240(),
                            // 儲存資料
                            html` <div class="update-bar-container">
                                ${obj.type === 'replace'
                                    ? BgWidget.cancel(
                                          gvc.event(() => {
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
                                                              } else {
                                                                  dialog.errorMessage({ text: '刪除失敗' });
                                                              }
                                                          });
                                                      }
                                                  },
                                              });
                                          }),
                                          '刪除優惠券'
                                      )
                                    : ''}
                                ${BgWidget.cancel(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.save(
                                    gvc.event(() => {
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
                                            dialog.dataLoading({ text: '變更優換券', visible: true });
                                            ApiPost.put({
                                                postData: voucherData,
                                                token: (window.parent as any).saasConfig.config.token,
                                                type: 'manager',
                                            }).then((re) => {
                                                dialog.dataLoading({ visible: false });
                                                if (re.result) {
                                                    vm.status = 'list';
                                                    dialog.successMessage({ text: `上傳成功` });
                                                } else {
                                                    dialog.errorMessage({ text: `上傳失敗` });
                                                }
                                            });
                                        } else {
                                            dialog.dataLoading({ text: '新增優換券', visible: true });
                                            ApiPost.post({
                                                postData: voucherData,
                                                token: (window.parent as any).saasConfig.config.token,
                                                type: 'manager',
                                            }).then((re) => {
                                                dialog.dataLoading({ visible: false });
                                                if (re.result) {
                                                    vm.type = 'list';
                                                    dialog.successMessage({ text: `上傳成功` });
                                                } else {
                                                    dialog.errorMessage({ text: `上傳失敗` });
                                                }
                                            });
                                        }
                                    })
                                )}
                            </div>`,
                        ].join(html`<div style="margin-top: 24px;"></div>`),
                        BgWidget.getContainerWidth()
                    );
                },
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingDiscountSetting);
