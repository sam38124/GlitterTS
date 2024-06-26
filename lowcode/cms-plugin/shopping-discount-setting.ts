import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget, OptionsItem } from '../backend-manager/bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../dialog/ShareDialog.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { ApiUser } from '../glitter-base/route/user.js';
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
                                <div class="d-flex w-100 align-items-center" style="margin-bottom: 24px;">
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
                                ${BgWidget.mainCard(
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
                                                                value: `<span class="fs-7">${dd.content.title}</span>`,
                                                            },
                                                            {
                                                                key: '狀態',
                                                                value: dd.content.status ? `<div class="badge badge-success fs-7" >啟用中</div>` : `<div class="badge bg-secondary fs-7">已停用</div>`,
                                                            },
                                                            {
                                                                key: '觸發方式',
                                                                value: `<span class="fs-7">${dd.content.trigger === 'code' ? `輸入代碼` : `自動`}</span>`,
                                                            },
                                                            {
                                                                key: '對象',
                                                                value: `<span class="fs-7">${dd.content.for === 'product' ? `指定商品` : `商品系列`}</span>`,
                                                            },
                                                            {
                                                                key: '折扣項目',
                                                                value: `<span class="fs-7">${dd.content.method === 'percent' ? `折扣${dd.content.value}%` : `折扣$${dd.content.value}`}</span>`,
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
                                            gvc.event((e, event) => {
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
                                                        return [
                                                            html`<span class="fs-7 fw-bold">操作選項</span>`,
                                                            html`<button
                                                                class="btn btn-danger fs-7 px-2"
                                                                style="height:30px;border:none;"
                                                                onclick="${gvc.event(() => {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認移除所選項目?',
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
                                                                })}"
                                                            >
                                                                批量移除
                                                            </button>`,
                                                        ].join(``);
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
                                                        style: `height:40px;gap:10px;margin-top:10px;`,
                                                    };
                                                },
                                            };
                                        })}`,
                                    })
                                )}
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
            trigger: 'auto' | 'code';
            value: string;
            for: 'collection' | 'product' | 'all';
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
            start_ISO_Date: string;
            end_ISO_Date: string;
            rebateEndDay: string;
            target: string;
            targetList: [];
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
            startDate: '',
            startTime: '',
            endTime: '',
            endDate: '',
            status: 1,
            type: 'voucher',
            overlay: false,
            start_ISO_Date: '',
            end_ISO_Date: '',
            reBackType: 'discount',
            rebateEndDay: '0',
            target: 'all',
            targetList: [],
        };
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);
        const productForList = [
            { title: '所有商品', value: 'all' },
            { title: '商品系列', value: 'collection' },
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
                    if (voucherData.trigger === 'code') return `優惠代碼「${voucherData.code ?? ''}」`;
                    return '';
                })()}`,
                `活動對象：${(() => {
                    switch (voucherData.target) {
                        case 'all':
                            return '所有顧客';
                        case 'customer':
                            return '特定顧客';
                        case 'levels':
                            return '會員等級';
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
                '',
                voucherData.overlay ? '不可疊加，套用最大優惠' : '可以疊加，以最大優惠排序優先',
                `啟用時間：${voucherData.startDate ?? '未設定日期'} ${voucherData.startTime ?? '尚未設定時間'}`,
                `結束時間：${(() => {
                    if (!voucherData.endDate) return '無期限';
                    return `${voucherData.endDate ?? '未設定日期'} ${voucherData.endTime ?? '尚未設定時間'}`;
                })()}`,
            ];
        }

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
                html`<div class="d-flex justify-content-center" style="gap: 24px">
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
                                                                                // 輸入位數產生隨機字串，首字為英文字母
                                                                                const randomString = (max: number) => {
                                                                                    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
                                                                                    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
                                                                                    for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
                                                                                    return text;
                                                                                };
                                                                                voucherData.code = randomString(6).toUpperCase();
                                                                                gvc.notifyDataChange(id);
                                                                            })
                                                                        )}
                                                                    </div>`,
                                                                ])}
                                                            </div>`,
                                                        });
                                                    })(),
                                                },
                                            ],
                                            callback: (text) => {
                                                if (text === 'auto') {
                                                    voucherData.code = undefined;
                                                }
                                                voucherData.trigger = text as any;
                                            },
                                        })}
                                    </div>
                                    <div>
                                        <div class="tx_700" style="margin-bottom: 18px">活動對象</div>
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
                                                                                            <div style="display: flex; width: 100%; gap: 12px;">
                                                                                                <div class="w-100 position-relative m-0">
                                                                                                    <i
                                                                                                        class="fa-regular fa-magnifying-glass"
                                                                                                        style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);"
                                                                                                        aria-hidden="true"
                                                                                                    ></i>
                                                                                                    <input
                                                                                                        class="form-control h-100"
                                                                                                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;"
                                                                                                        placeholder="搜尋特定顧客"
                                                                                                    />
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
                                                                                                                return new Promise<{ key: string; value: string; note: string }[]>((resolve) => {
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
                                                                                            <div class="d-flex flex-column p-2" style="margin-top: 18px; gap: 18px;">
                                                                                                <div class="d-flex align-items-center gray-bottom-line-18" style="gap: 24px;">
                                                                                                    <input class="form-check-input mt-0" type="checkbox" onclick="${obj.gvc.event(() => {})}" />
                                                                                                    <div class="form-check-label c_updown_label cursor_pointer">
                                                                                                        <div class="tx_normal">顧客名稱</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                ${obj.gvc.map(
                                                                                                    customVM.dataList.map((opt: OptionsItem) => {
                                                                                                        return html` <div class="d-flex align-items-center" style="gap: 24px">
                                                                                                            <input
                                                                                                                class="form-check-input mt-0 ${vm.checkClass}"
                                                                                                                type="checkbox"
                                                                                                                id="${opt.key}"
                                                                                                                name="radio_${vm.id}"
                                                                                                            />
                                                                                                            <div class="d-flex align-items-center" style="gap: 24px">
                                                                                                                <div class="form-check-label c_updown_label cursor_pointer">
                                                                                                                    <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                                                                                    ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                                                                                </div>
                                                                                                            </div>
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
                                                                                                }, 500);
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
                                                                                                    levelVM.dataList = dd.response.value.levels.map((item: { id: string; tag_name: string }) => {
                                                                                                        return {
                                                                                                            key: item.id,
                                                                                                            value: item.tag_name,
                                                                                                            // note: '人數'
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
                                                        return html`<div class="gray-bottom-line-18">
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
                                                                                    alert('數值不得大於100%');
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
                                                html`
                                                    <h3 class="tx_700">套用至</h3>
                                                    ${EditorElem.radio({
                                                        gvc: gvc,
                                                        title: '',
                                                        def: voucherData.for,
                                                        array: productForList,
                                                        callback: (text) => {
                                                            voucherData.forKey = [];
                                                            voucherData.for = text as any;
                                                            gvc.notifyDataChange(id);
                                                        },
                                                        oneLine: true,
                                                    })}
                                                `,
                                                voucherData.for === 'collection'
                                                    ? gvc.bindView(() => {
                                                          let interval: any = 0;
                                                          const id2 = glitter.getUUID();
                                                          return {
                                                              bind: id2,
                                                              view: () => {
                                                                  return new Promise(async (resolve, reject) => {
                                                                      resolve(
                                                                          EditorElem.arrayItem({
                                                                              gvc: gvc,
                                                                              title: '',
                                                                              height: 45,
                                                                              copyable: false,
                                                                              array: () => {
                                                                                  return voucherData.forKey.map((dd: any, index: number) => {
                                                                                      return {
                                                                                          title: EditorElem.searchInputDynamic({
                                                                                              title: '',
                                                                                              gvc: gvc,
                                                                                              def: dd,
                                                                                              search: (text, callback) => {
                                                                                                  clearInterval(interval);
                                                                                                  interval = setTimeout(() => {
                                                                                                      ApiShop.getCollection().then((data) => {
                                                                                                          if (data.result && data.response.value) {
                                                                                                              let keyIndex: any = [];

                                                                                                              function loopCValue(data: any, ind: string) {
                                                                                                                  data.map((dd: any) => {
                                                                                                                      const indt = ind ? `${ind} / ${dd.title}` : dd.title;
                                                                                                                      dd.collectionTag = indt;
                                                                                                                      keyIndex.push(indt);
                                                                                                                      if (dd.array && dd.array.length > 0) {
                                                                                                                          loopCValue(dd.array, indt);
                                                                                                                      }
                                                                                                                  });
                                                                                                              }

                                                                                                              loopCValue(data.response.value, '');
                                                                                                              callback(
                                                                                                                  keyIndex.filter((d2: string) => {
                                                                                                                      return dd.indexOf(dd) !== -1;
                                                                                                                  })
                                                                                                              );
                                                                                                          } else {
                                                                                                              callback([]);
                                                                                                          }
                                                                                                      });
                                                                                                  }, 100);
                                                                                              },
                                                                                              callback: (text) => {
                                                                                                  voucherData.forKey[index] = text;
                                                                                              },
                                                                                              placeHolder: '請輸入商品名稱',
                                                                                          }),
                                                                                      };
                                                                                  });
                                                                              },
                                                                              originalArray: voucherData.forKey,
                                                                              expand: {},
                                                                              refreshComponent: () => {
                                                                                  gvc.notifyDataChange(id2);
                                                                              },
                                                                              plus: {
                                                                                  title: '新增商品系列',
                                                                                  event: gvc.event(() => {
                                                                                      voucherData.forKey.push('');
                                                                                      gvc.notifyDataChange(id2);
                                                                                  }),
                                                                              },
                                                                          })
                                                                      );
                                                                  });
                                                              },
                                                              divCreate: {
                                                                  style: `pt-2`,
                                                              },
                                                          };
                                                      })
                                                    : gvc.bindView(() => {
                                                          let interval: any = 0;
                                                          let mapPdName: any = {};
                                                          const id2 = glitter.getUUID();
                                                          return {
                                                              bind: id2,
                                                              view: () => {
                                                                  return new Promise(async (resolve, reject) => {
                                                                      if (voucherData.for === 'all') {
                                                                          resolve('');
                                                                      } else {
                                                                          resolve(
                                                                              EditorElem.arrayItem({
                                                                                  gvc: gvc,
                                                                                  title: '',
                                                                                  height: 45,
                                                                                  copyable: false,
                                                                                  array: () => {
                                                                                      return voucherData.forKey.map((dd: any, index: number) => {
                                                                                          return {
                                                                                              title: gvc.bindView(() => {
                                                                                                  const id = glitter.getUUID();
                                                                                                  return {
                                                                                                      bind: id,
                                                                                                      view: () => {
                                                                                                          return new Promise(async (resolve, reject) => {
                                                                                                              const title = await new Promise(async (resolve, reject) => {
                                                                                                                  if (mapPdName[dd]) {
                                                                                                                      resolve(mapPdName[dd]);
                                                                                                                      return;
                                                                                                                  } else if (!dd) {
                                                                                                                      resolve('');
                                                                                                                      return;
                                                                                                                  }
                                                                                                                  ApiShop.getProduct({
                                                                                                                      page: 0,
                                                                                                                      limit: 50,
                                                                                                                      id: dd,
                                                                                                                  }).then((data) => {
                                                                                                                      if (data.result && data.response.result) {
                                                                                                                          mapPdName[dd] = data.response.data.content.title;
                                                                                                                          resolve(data.response.data.content.title);
                                                                                                                      } else {
                                                                                                                          mapPdName[dd] = '';
                                                                                                                          resolve('');
                                                                                                                      }
                                                                                                                  });
                                                                                                              });
                                                                                                              resolve(
                                                                                                                  EditorElem.searchInputDynamic({
                                                                                                                      title: '',
                                                                                                                      gvc: gvc,
                                                                                                                      def: title as string,
                                                                                                                      search: (text, callback) => {
                                                                                                                          clearInterval(interval);
                                                                                                                          interval = setTimeout(() => {
                                                                                                                              ApiShop.getProduct({
                                                                                                                                  page: 0,
                                                                                                                                  limit: 50,
                                                                                                                                  search: '',
                                                                                                                              }).then((data) => {
                                                                                                                                  callback(
                                                                                                                                      data.response.data.map((dd: any) => {
                                                                                                                                          return dd.content.title;
                                                                                                                                      })
                                                                                                                                  );
                                                                                                                              });
                                                                                                                          }, 100);
                                                                                                                      },
                                                                                                                      callback: (text) => {
                                                                                                                          ApiShop.getProduct({
                                                                                                                              page: 0,
                                                                                                                              limit: 50,
                                                                                                                              search: text,
                                                                                                                          }).then((data) => {
                                                                                                                              voucherData.forKey[index] = data.response.data.find((dd: any) => {
                                                                                                                                  return dd.content.title === text;
                                                                                                                              }).id;
                                                                                                                              mapPdName[voucherData.forKey[index]] = text;
                                                                                                                          });
                                                                                                                      },
                                                                                                                      placeHolder: '請輸入商品名稱',
                                                                                                                  })
                                                                                                              );
                                                                                                          });
                                                                                                      },
                                                                                                  };
                                                                                              }),
                                                                                          };
                                                                                      });
                                                                                  },
                                                                                  originalArray: voucherData.forKey,
                                                                                  expand: {},
                                                                                  refreshComponent: () => {
                                                                                      gvc.notifyDataChange(id2);
                                                                                  },
                                                                                  plus: {
                                                                                      title: '新增商品',
                                                                                      event: gvc.event(() => {
                                                                                          voucherData.forKey.push('');
                                                                                          gvc.notifyDataChange(id2);
                                                                                      }),
                                                                                  },
                                                                              })
                                                                          );
                                                                      }
                                                                  });
                                                              },
                                                              divCreate: {
                                                                  style: `pt-2`,
                                                              },
                                                          };
                                                      }),
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
                                            const inputStyle = 'font-size: 16px; height: 40px; width: 100%;';
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
                                                html` <h6 class="tx_700">有效日期</h6>`,
                                                html`<div class="d-flex align-items-center mb-3">
                                                    <div>
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
                                                    </div>
                                                    <div class="ms-3">
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
                                                    </div>
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
                                                                innerHtml: html`<div class="d-flex align-items-center mb-2">
                                                                    <div>
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
                                                                    </div>
                                                                    <div class="ms-3">
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
                                                                    </div>
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
                        ].join(html`<div style="margin-top: 24px"></div>`),
                        undefined,
                        'padding: 0; margin: 0 !important; width: 68.5%;'
                    )}
                    ${BgWidget.container(
                        // 摘要預覽
                        html`<div>
                            ${gvc.bindView(() => {
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
                                };
                            })}
                        </div>`,
                        undefined,
                        'padding: 0; margin: 0 !important; width: 26.5%;'
                    )}
                </div>`,
                // 空白容器
                html`<div style="margin-bottom: 240px"></div>`,
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
            ].join(html`<div style="margin-top: 24px"></div>`),
            BgWidget.getContainerWidth()
        );
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingDiscountSetting);
