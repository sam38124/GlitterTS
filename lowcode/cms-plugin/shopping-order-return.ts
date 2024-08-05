import {ShoppingFinanceSetting} from './shopping-finance-setting.js';
import {GVC} from '../glitterBundle/GVController.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {ApiShop} from '../glitter-base/route/shopping.js';
import {EditorElem} from '../glitterBundle/plugins/editor-elem.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {BgListComponent} from "../backend-manager/bg-list-component.js";
import {FilterOptions} from "./filter-options.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {UserList} from "./user-list.js";
import {ApiPost} from "../glitter-base/route/post.js";
import {Article} from "../glitter-base/route/article.js";
import {BgNotify} from "../backend-manager/bg-notify";

interface VoucherData {
    id: number;
    title: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free';
    trigger: 'auto' | 'code';
    value: number;
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
    bind?: {
        id: string;
        spec: string[];
        count: number;
        sale_price: number;
        collection: string[];
        discount_price: number;
        rebate: number;
        shipment_fee: number;
    }[];
    start_ISO_Date: string;
    end_ISO_Date: string;
    discount_total: number;
    rebate_total: number;
    target: string;
    targetList: string[];
}


const html = String.raw;


interface ViewModel {
    id: string;
    filterId: string;
    type: 'list' | 'add' | 'replace' | 'select' | 'addSearch';
    data: any;
    dataList: any;
    query?: string;
    queryType?: string;
    orderString?: string;
    filter?: any;
    filter_type: 'normal' | 'bloack'
}


export class ShoppingOrderManager {
    public static main(gvc: GVC) {
        const filterID = gvc.glitter.getUUID();
        const glitter = gvc.glitter;

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
            filter_type: 'normal'
        };

        const ListComp = new BgListComponent(gvc, vm, FilterOptions.returnOrderFilterFrame);

        vm.filter = ListComp.getFilterObject();
        gvc.addMtScript([{src: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"}], () => {

        }, () => {

        })

        function importDataTo(event: Event) {
            const input = event.target as HTMLInputElement;
            const XLSX = (window as any).XLSX;
            if (!input.files || input.files.length === 0) {
                console.log("No file selected");
                return;
            }

            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (!e.target) {
                    console.log("Failed to read file");
                    return;
                }
                const data = new Uint8Array(e.target.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type: 'array'});

                // 假設我們只讀取第一個工作表
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // 將工作表轉換為 JSON
                const json = XLSX.utils.sheet_to_json(worksheet);

            };

            reader.readAsArrayBuffer(file);
        }

        function exportDataTo(firstRow: string[], data: any) {
            if ((window as any).XLSX) {
                // 將資料轉換成工作表
                let XLSX = (window as any).XLSX;

                const worksheet = XLSX.utils.json_to_sheet(data, {skipHeader: true});
                XLSX.utils.sheet_add_aoa(worksheet, [firstRow], {origin: "A1"});

                // 創建一個新的工作簿
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                // 將工作簿轉換成二進制數據
                const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});

                // 將二進制數據轉換成 Blob 物件
                function s2ab(s: any) {
                    const buf = new ArrayBuffer(s.length);
                    const view = new Uint8Array(buf);
                    for (let i = 0; i < s.length; i++) {
                        view[i] = s.charCodeAt(i) & 0xFF;
                    }
                    return buf;
                }

                // 建立 Blob 物件
                const blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});

                // 建立下載連結
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = "data.xlsx";
                link.click();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 100);
            }
        }

        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: vm.id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center  ">
                                ${BgWidget.title('退貨單列表')}
                                <div class="flex-fill"></div>
                                <div style="display: flex; gap: 14px;">

                                    <input class="d-none" type="file" id="upload-excel"
                                           onchange="${gvc.event((e, event) => {
                                               importDataTo(event)
                                           })}"/>
                                    ${BgWidget.grayButton(
                                            '匯出',
                                            gvc.event(() => {
                                                let dialog = new ShareDialog(glitter);
                                                dialog.dataLoading({visible: true})
                                                ApiShop.getOrder({
                                                    page: 0,
                                                    limit: 100,
                                                    search: undefined,
                                                    searchType: 'name',
                                                    orderString: '',
                                                    filter: '',
                                                    archived: (vm.filter_type === 'normal') ? `false` : `true`
                                                }).then(response => {
                                                    dialog.dataLoading({visible: false})
                                                    let firstRow = ["訂單編號", "訂購人", "訂購人email", "訂單金額", "付款狀態", "出貨狀態", "訂單狀態"];
                                                    let exportData: any = [];
                                                    response.response.data.map((orderData: any) => {
                                                        let rowData: {
                                                            orderID: string;
                                                            order_name: string;
                                                            order_email: string;
                                                            total: string;
                                                            pay_status: string;
                                                            progress: string;
                                                            order_status: string
                                                        } = {
                                                            orderID: orderData.cart_token,
                                                            order_name: orderData?.customer_info?.name ?? orderData.orderData.user_info.name,
                                                            order_email: orderData.orderData.user_email,
                                                            total: orderData.orderData.total,
                                                            pay_status: (() => {
                                                                switch (orderData.status) {
                                                                    case 0:
                                                                        return `未付款`;
                                                                    case 1:
                                                                        return `已付款`;
                                                                    case -1:
                                                                        return `付款失敗`;
                                                                    case -2:
                                                                        return `已退款`;
                                                                }
                                                                return ``
                                                            })(),
                                                            progress: (() => {
                                                                switch (orderData.orderData.progress ?? 'wait') {
                                                                    case 'wait':
                                                                        return `未出貨`;
                                                                    case 'shipping':
                                                                        return `已出貨`;
                                                                    case 'finish':
                                                                        return `已取貨`;
                                                                    case 'arrived':
                                                                        return `已送達`;
                                                                    case 'returns':
                                                                        return `已退貨`;
                                                                }
                                                                return ``
                                                            })(),
                                                            order_status: (() => {
                                                                switch (orderData.orderData.orderStatus ?? '0') {
                                                                    case '-1':
                                                                        return `已取消`;
                                                                    case '0':
                                                                        return `處理中`;
                                                                    case '1':
                                                                        return `已完成`;
                                                                }
                                                                return ``
                                                            })(),
                                                        };
                                                        exportData.push(rowData)
                                                    })
                                                    exportDataTo(firstRow, exportData);
                                                })
                                            })
                                    )}
                                    ${BgWidget.darkButton(
                                            '新增',
                                            gvc.event(() => {
                                                vm.type = 'addSearch';
                                            })
                                    )}
                                </div>
                            </div>
                            ${BgWidget.tab([{
                                title: '一般列表',
                                key: 'normal'
                            }, {
                                title: '封存列表',
                                key: 'block'
                            }], gvc, vm.filter_type, (text) => {

                                vm.filter_type = text as any;
                                gvc.notifyDataChange(vm.id)
                            })}
                            <!--                            vm.query || vm.queryType-->
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiShop.getReturnOrder({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query??'',
                                        searchType: vm.queryType || 'name',
                                        orderString: vm.orderString??'',
                                        filter: vm.filter,
                                        archived: (vm.filter_type === 'normal') ? `false` : `true`
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
                                                            style: 'height:40px;',
                                                        }),
                                                    },
                                                    {
                                                        key: '退貨單編號',
                                                        value: dd.return_order_id,
                                                    },
                                                    {
                                                        key: '訂單編號',
                                                        value: dd.order_id,
                                                    },
                                                    {
                                                        key: '申請日期',
                                                        value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                                    },
                                                    {
                                                        key: '申請人',
                                                        value: dd.orderData.user_info ? dd.orderData.user_info.name : `匿名`,
                                                    },
                                                    {
                                                        key: '退貨狀態',
                                                        value: (() => {
                                                            switch (dd.orderData.returnProgress ?? "1") {
                                                                case "0":
                                                                    return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">退貨中</div>`
                                                                case "-1":
                                                                    return `<div class="badge" style="border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已退貨</div>`;
                                                                default:
                                                                    return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">處理中</div>`;
                                                            }

                                                        })(),
                                                    },
                                                    {
                                                        key: '退款狀態',
                                                        value: (() => {
                                                            switch (dd.status ?? 0) {
                                                                case 1:
                                                                    return `<div class="badge " style="font-size: 14px;color:#393939;border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;">已退款</div>`;
                                                                default:
                                                                    return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">退款中</div>`;
                                                            }
                                                        })(),
                                                    },

                                                ].map((dd: any) => {
                                                    dd.value = `<div style="line-height:40px;">${dd.value}</div>`;
                                                    return dd;
                                                });
                                            });
                                        }

                                        vmi.data = getDatalist();
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => {
                                    vm.data = vm.dataList[index];
                                    vm.type = 'replace';
                                },
                                filter: html`
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            ${BgWidget.selectFilter({
                                                gvc,
                                                callback: (value: any) => {
                                                    vm.queryType = value;
                                                    gvc.notifyDataChange(vm.id);
                                                },
                                                default: vm.queryType || 'name',
                                                options: FilterOptions.returnOrderSelect,
                                            })}
                                            ${BgWidget.searchFilter(
                                                    gvc.event((e, event) => {
                                                        vm.query = e.value;
                                                        gvc.notifyDataChange(vm.id);
                                                    }),
                                                    vm.query || '',
                                                    '搜尋所有訂單 按下Enter後執行'
                                            )}
                                            ${BgWidget.funnelFilter({
                                                gvc,
                                                callback: () => ListComp.showRightMenu(FilterOptions.returnOrderFunnel),
                                            })}
                                            ${BgWidget.updownFilter({
                                                gvc,
                                                callback: (value: any) => {
                                                    vm.orderString = value;
                                                    gvc.notifyDataChange(vm.id);
                                                },
                                                default: vm.orderString || 'created_time_desc',
                                                options: FilterOptions.returnOrderOrderBy,
                                            })}
                                        </div>
                                        <div>${ListComp.getFilterTags(FilterOptions.returnOrderFunnel)}</div>
                                    </div>
                                    ${gvc.bindView(() => {
                                        return {
                                            bind: vm.filterId,
                                            view: () => {
                                                return [
                                                    html`<span class="fs-7 fw-bold">操作選項</span
                                                    >
                                                    <button
                                                            class="btn btn-danger fs-7 px-2"
                                                            style="height: 30px; border: none;"
                                                            onclick="${gvc.event(() => {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.checkYesOrNot({
                                                                    text: `是否確認${(vm.filter_type === 'normal') ? `封存` : `解除封存`}所選項目?`,
                                                                    callback: async (response) => {
                                                                        if (response) {
                                                                            dialog.dataLoading({visible: true});
                                                                            const check = vm.dataList.filter((dd: any) => {
                                                                                return dd.checked;
                                                                            });
                                                                            for (const b of check) {
                                                                                b.orderData.archived = (vm.filter_type === 'normal') ? `true` : `false`
                                                                                await ApiShop.putOrder({
                                                                                    id: `${b.id}`,
                                                                                    order_data: b.orderData
                                                                                })
                                                                            }
                                                                            setTimeout(() => {
                                                                                dialog.dataLoading({visible: false});
                                                                                gvc.notifyDataChange(vm.id)
                                                                            }, 100)
                                                                        }
                                                                    },
                                                                });
                                                            })}"
                                                    >
                                                        ${(vm.filter_type === 'normal') ? ` 批量封存` : `解除封存`}
                                                    </button>`,
                                                ].join(``);
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
                                                    style: `height: 40px; gap: 10px; margin-top: 10px;`,
                                                };
                                            },
                                        };
                                    })}
                                `,

                            })}
                        `, 1200);
                    } else if (vm.type == 'replace') {
                        return this.replaceOrder(gvc, vm, id);
                    } else if (vm.type == "addSearch") {
                        return this.searchOrder(gvc, vm)
                    } else {
                        return ``;
                    }
                },
            };
        });
    }

    public static replaceOrder(gvc: GVC, vm: any, id: string) {
        const glitter = gvc.glitter;
        const orderData: {
            id: number;
            order_id: string;
            return_order_id: string
            status: number;
            email: string;
            orderData: {
                refundTime?: string;
                bank_info?: any;
                customer_info: any;
                editRecord: any;
                method: string;
                orderStatus: string;
                use_wallet: number;
                email: string;
                return_discount: number;
                return_rebate: number;
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
                    return_count: number;
                    return_reason: string;

                }[];
                user_info: {
                    name: string;
                    email: string;
                    phone: string;
                    address: string;
                    shipment: 'normal' | 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C';
                    CVSStoreName: string;
                    CVSStoreID: string;
                    CVSTelephone: string;
                    MerchantTradeNo: string;
                    CVSAddress: string;
                    note?: string;
                    code_note?: string
                };
                custom_form_format?: any,
                custom_form_data?: any,
                proof_purchase: any,
                progress: string;
                returnProgress: string;
                order_note: string;
                return_order_remark: string;
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
                    }
                ];
            };
            created_time: string;
        } = vm.data;
        let userData: any = {};
        const mainViewID = gvc.glitter.getUUID();
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);
        let userDataLoading = true;

        function formatDateString(isoDate?: string): string {
            // 使用給定的 ISO 8601 日期字符串，或創建一個當前時間的 Date 對象
            const date = isoDate ? new Date(isoDate) : new Date();

            // 提取年、月、日、時、分
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            // 格式化為所需的字符串
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }

        function drawBadge(color: string, text: string) {
            switch (color) {
                case 'green':
                    return `<div class="badge  fs-6" style="background:#D8ECDA;color: #393939;max-height:34px;border-radius: 7px;">${text}</div>`
                case 'red':
                    return `<div class="badge fs-6" style="border-radius: 7px;background: #FFD5D0;color: #393939;max-height:34px;">${text}</div>`
                case 'yellow':
                    return `<div class="badge fs-6" style="max-height:34px;border-radius: 7px;color: #393939;background: #FFE9B2;">${text}</div>`
                default:
                    return `<div class="badge fs-6" style="max-height:34px;border-radius: 7px;color: #393939;background: ${color};">${text}</div>`
            }
        }

        function drawInputRow(text: string, value: any, readonly: boolean): string {
            return html`
                <div class=" d-flex flex-column" style="gap:8px;flex:1">
                    <div style="font-size: 16px;font-weight: 400;">
                        ${text}
                    </div>
                    ${(() => {
                        if (readonly) {
                            return html`
                                <div class="w-100"
                                     style="display: flex;height: 40px;padding: 9px 18px;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;">
                                    ${value}
                                </div>
                            `
                        } else {
                            return html`
                                <input class="w-100"
                                       style="display: flex;height: 40px;padding: 9px 18px;align-items: center;border-radius: 10px;border: 1px solid #DDD;"
                                       value="${value}" onchange="${gvc.event((e) => {
                                    value = e.value;
                                })}">
                            `
                        }
                    })()}
                </div>
            `
        }

        const vt = {
            paymentBadge: () => {
                if (orderData.status === 0) {
                    return drawBadge('red', '尚未退款');
                } else if (orderData.status === 1) {
                    return drawBadge('green', '已退款');
                }
            },
            outShipBadge: () => {
                switch (orderData.orderData.returnProgress ?? '1') {
                    case '1':
                        return drawBadge('#FFD5D0', '申請中')
                    case '0':
                        return drawBadge('#FFD5D0', '退貨中')
                    case '-1':
                        return drawBadge('#D8ECDA', '已退貨')
                }
            },
        };
        ApiUser.getUsersDataWithEmail(orderData.email)
            .then((res) => {

                userData = res.response
                userDataLoading = false;
                gvc.notifyDataChange(mainViewID)
            })
        const child_vm: {
            type: 'order' | 'user',
            userID: string
        } = {
            type: 'order',
            userID: ''
        }


        return gvc.bindView({
            bind: mainViewID,
            dataList: [
                {
                    obj: child_vm, key: 'type'
                }
            ],
            view: () => {
                try {
                    if (child_vm.type === 'user') {
                        return UserList.userInformationDetail({
                            userID: child_vm.userID,
                            callback: () => {
                                child_vm.type = 'order';
                            },
                            gvc: gvc,
                        });
                    }
                    return BgWidget.container(
                        html`
                            <div class="d-flex flex-column" style="">
                                ${BgWidget.container(
                                        html`
                                            <div class="d-flex w-100 align-items-center mb-3 ">
                                                ${BgWidget.goBack(
                                                        gvc.event(() => {
                                                            vm.type = 'list';
                                                        })
                                                )}
                                                ${BgWidget.title(html`
                                                    <div class="d-flex align-items-center">
                                                        <div class="d-flex flex-column">
                                                            <div class="align-items-center"
                                                                 style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;">
                                                                    #${orderData.return_order_id}
                                                            </div>
                                                            <div class="d-flex align-items-center"
                                                                 style="color: #8D8D8D;font-size: 16px;font-weight: 400;gap:10px;">
                                                                訂單成立時間 :
                                                                ${glitter.ut.dateFormat(new Date(orderData.created_time), 'yyyy-MM-dd hh:mm')}${vt.paymentBadge()}${vt.outShipBadge()}
                                                            </div>
                                                        </div>
                                                    </div>`)}
                                                <div class="flex-fill"></div>
                                                <button
                                                        class="btn btn-primary-c d-none"
                                                        style="height:38px;font-size: 14px;"
                                                        onclick="${gvc.event(() => {
                                                            const now = new Date();

                                                            function writeEdit(origData: any, orderData: any) {
                                                                let editArray: any = []
                                                                let temp: any = {}
                                                                if (orderData.status != origData.status) {
                                                                    let text: any = {
                                                                        "1": "付款成功",
                                                                        "-2": "退款成功",
                                                                        "0": "修改為未付款"
                                                                    }
                                                                    editArray.push({
                                                                        time: formatDateString(),
                                                                        record: text[orderData.status]
                                                                    })
                                                                }
                                                                if (orderData.orderData.orderStatus != origData.orderData.orderStatus) {
                                                                    let text: any = {
                                                                        "1": "訂單完成",
                                                                        "0": "訂單改為處理中",
                                                                        "-1": "訂單已取消"
                                                                    }
                                                                    editArray.push({
                                                                        time: formatDateString(),
                                                                        record: text[orderData.orderData.orderStatus]
                                                                    })
                                                                }
                                                                if (orderData.orderData.progress != origData.orderData.progress) {
                                                                    let text: any = {
                                                                        "shipping": "訂單完成",
                                                                        "wait": "訂單改為處理中",
                                                                        "finish": "商品已取貨",
                                                                        "returns": "商品已退貨",
                                                                        "arrived": "商品已到貨"
                                                                    }
                                                                    editArray.push({
                                                                        time: formatDateString(),
                                                                        record: text[orderData.orderData.progress]
                                                                    })
                                                                }
                                                                if (orderData.orderData?.editRecord) {
                                                                    editArray.length && orderData.orderData.editRecord.push(...editArray);
                                                                } else {
                                                                    editArray.length && (orderData.orderData.editRecord = editArray);
                                                                }
                                                            }

                                                            // writeEdit(origData, orderData)
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.dataLoading({text: '上傳中', visible: true});
                                                            ApiShop.putOrder({
                                                                id: `${orderData.id}`,
                                                                order_data: orderData.orderData,
                                                                status: orderData.status,
                                                            }).then((response) => {
                                                                dialog.dataLoading({text: '上傳中', visible: false});
                                                                if (response.result) {
                                                                    dialog.successMessage({text: '更新成功!'});
                                                                    gvc.notifyDataChange(id);
                                                                } else {
                                                                    dialog.errorMessage({text: '更新異常!'});
                                                                }
                                                            });
                                                        })}"
                                                >
                                                    儲存並更改
                                                </button>
                                            </div>
                                            <div class="d-flex flex-column" style="gap:20px;">
                                                ${BgWidget.mainCard(html`
                                                    <div class="d-flex flex-column" style="gap:18px;">
                                                        <div class="d-flex flex-column" style="gap: 12px;">
                                                            <div style="color:#393939;font-size: 16px;font-weight: 700;">
                                                                退貨狀態
                                                            </div>
                                                            <select class="form-select"
                                                                    style="width: 100%;display: flex;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;" onchange="${gvc.event((e)=>{
                                                                orderData.orderData.returnProgress = e.value;
                                                            })}">
                                                                ${(() => {
                                                                    let dataArray = [
                                                                        ["申請中", "1"],
                                                                        ["退貨中", "0"],
                                                                        ["已退貨", "-1"],
                                                                    ]
                                                                    orderData.orderData.returnProgress = orderData.orderData.returnProgress ?? "1";
                                                                    return dataArray.map((data) => {
                                                                        return html`
                                                                            <option value="${data[1]}"
                                                                                    ${((orderData.orderData.returnProgress == data[1]) ? `selected` : ``)}>
                                                                                ${data[0]}
                                                                            </option>
                                                                        `
                                                                    })
                                                                })()}
                                                            </select>
                                                        </div>
                                                        <div class="d-flex" style="gap:18px;">
                                                            ${drawInputRow("退貨單編號", orderData.return_order_id, true)}
                                                            ${drawInputRow("原訂單編號", orderData.order_id, true)}
                                                        </div>
                                                        <div class="d-flex" style="gap:18px;">
                                                            ${drawInputRow("顧客姓名", orderData.orderData.customer_info.name, true)}
                                                            ${drawInputRow("顧客電話", orderData.orderData.customer_info.phone??"", false)}
                                                        </div>
                                                        <div class="d-flex" style="gap:18px;">
                                                            ${drawInputRow("顧客電子信箱", orderData.orderData.customer_info.email, true)}
                                                        </div>
                                                    </div>
                                                `)}
                                                ${BgWidget.mainCard(html`
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                                        <div style="font-weight: 700;">
                                                            退貨明細
                                                        </div>
                                                        <div style="display: flex;height: 34px;padding-right: 12px;align-items: center;gap: 18px;border-bottom: 1px solid #DDD;background: #FFF;width: 100%">
                                                            <div style="flex:1 0 0">商品名稱</div>
                                                            <div style="width:13%;text-align: center;margin-right: 20px;">
                                                                退貨原因
                                                            </div>
                                                            <div style="width:5%;">單價</div>
                                                            <div style="width:10%;text-align: center;">退貨數量</div>
                                                            <div style="width:10%;text-align: center;">退回庫存數量
                                                            </div>
                                                            <div style="width:50px;text-align: right;">小計</div>
                                                        </div>
                                                    </div>

                                                    ${(() => {
                                                        return orderData.orderData.lineItems.map((data: any, index: number) => {
                                                            return gvc.bindView({
                                                                bind: `lineItem${index}`,
                                                                view: () => {
                                                                    gvc.addStyle(`
                                                        input[type=number]::-webkit-outer-spin-button,
                                                        input[type=number]::-webkit-inner-spin-button {
                                                            -webkit-appearance: none;
                                                            margin: 0;
                                                        }
                                                        
                                                        /* Firefox */
                                                        input[type=number] {
                                                            -moz-appearance: textfield;
                                                        }
                                                    `)
                                                                    return html`
                                                                        <div style="flex:1 0 0;display: flex;align-items: center;gap: 12px;">
                                                                            <img style="width: 54px;height: 54px;"
                                                                                 src="${data.preview_image}">
                                                                            <div class="d-flex justify-content-center flex-column"
                                                                                 style="gap: 4px;">
                                                                                <div style="color:#393939;font-weight: 400;">
                                                                                    ${data.title}
                                                                                </div>
                                                                                <div class="d-flex " style="gap:4px;">
                                                                                    ${(() => {
                                                                                        if (data.spec.length == 0) {
                                                                                            return html`
                                                                                                <div style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;">
                                                                                                    單一規格
                                                                                                </div>
                                                                                            `
                                                                                        }
                                                                                        return data.spec.map((spec: string) => {
                                                                                            data.return_count = data.return_count ?? data.count;
                                                                                            return html`
                                                                                                <div style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;">
                                                                                                    ${spec}
                                                                                                </div>`
                                                                                        }).join();
                                                                                    })()}
                                                                                </div>
                                                                                <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                                                                                    存貨單位 (SKU): ${data.sku ?? ""}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div style="width:13%;margin-right: 20px;"
                                                                             class="d-flex align-items-center justify-content-center">
                                                                            ${(() => {
                                                                                let options: {
                                                                                    value: string,
                                                                                    text: string,
                                                                                }[] = [
                                                                                    {
                                                                                        value: 'not_as_described',
                                                                                        text: '商品不符合',
                                                                                    },
                                                                                    {
                                                                                        value: 'damaged_in_shipping',
                                                                                        text: '運送中毀損',
                                                                                    },
                                                                                    {
                                                                                        value: 'not_as_described',
                                                                                        text: '商品有瑕疵',
                                                                                    },
                                                                                    {
                                                                                        value: 'not_as_described',
                                                                                        text: '訂單有誤',
                                                                                    },
                                                                                ]


                                                                                return html`
                                                                                    <div style="font-size: 16px;font-weight: 400;">
                                                                                        ${options.filter(data2 => data2.value == data.return_reason)[0].text}
                                                                                    </div>
                                                                                `
                                                                            })()}
                                                                        </div>
                                                                        <div style="width:5%;">${data.sale_price}</div>
                                                                        <div style="width:10%;"
                                                                             class="d-flex align-items-center justify-content-center">
                                                                            <div style="font-size: 16px;font-weight: 400;">
                                                                                ${data.return_count}
                                                                            </div>
                                                                        </div>
                                                                        <div style="width:10%;"
                                                                             class="d-flex align-items-center justify-content-center">
                                                                            <input type="number"
                                                                                   style="text-align: center;width:94px;border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px;"
                                                                                   value="${data.return_stock ?? 0}"
                                                                                   max="${data.return_count}" min="0"
                                                                                   onchange="${gvc.event((e) => {
                                                                                       data.return_stock = e.value;
                                                                                       gvc.notifyDataChange(`lineItem${index}`)
                                                                                   })}">
                                                                        </div>
                                                                        <div style="width:50px;text-align: right;">
                                                                            ${data.return_count * data.sale_price}
                                                                        </div>`
                                                                },
                                                                divCreate: {style: `display: flex;padding: 0px 4px 12px 0px;align-items: center;gap: 18px;background: #FFF;width: 100%;padding-right:12px;`}
                                                            })

                                                        })
                                                    })()}
                                                    <div style="width: 100%;height: 1px;background-color: #DDD;margin-bottom:18px;"></div>
                                                    ${gvc.bindView({
                                                        bind: `checkout`,
                                                        view: () => {
                                                            let subTotal = 0

                                                            orderData.orderData.lineItems.map((data: any, index: number) => {
                                                                subTotal += data.sale_price * data.return_count
                                                            })
                                                            orderData.orderData.return_rebate = orderData.orderData.return_rebate ?? "0";
                                                            orderData.orderData.return_discount = orderData.orderData.return_discount ?? "0";

                                                            let returnTotal = subTotal + orderData.orderData.return_rebate as number + orderData.orderData.return_discount as number

                                                            return html`
                                                                <div class="d-flex" style="gap: 24px;">
                                                                    <div style="font-size: 16px;font-weight: 400;">
                                                                        小計總額
                                                                    </div>
                                                                    <div style="width:158px;text-align: right;">
                                                                        ${subTotal}
                                                                    </div>
                                                                </div>
                                                                <div class="d-flex" style="gap: 24px;">
                                                                    <div style="font-size: 16px;font-weight: 400;">
                                                                        運費
                                                                    </div>
                                                                    <div style="width:158px;text-align: right;">
                                                                        ${orderData.orderData.shipment_fee}
                                                                    </div>
                                                                </div>
                                                                ${(() => {
                                                                    return [["折扣", "discount"], ["購物金", "rebate"]].map((item: any, index: number) => {
                                                                        let des = orderData.orderData.voucherList.filter((orderitem: any) => orderitem.reBackType == item[1]).map((orderitem: any) => {
                                                                            return orderitem.title;
                                                                        }).join(' , ');
                                                                        des = des ?? ""

                                                                        return html`
                                                                            <div class="d-flex" style="gap: 70px;">
                                                                                <div class="d-flex flex-column justify-content-center "
                                                                                     style="font-size: 16px;font-weight: 400;">
                                                                                    <div style="text-align: right;">
                                                                                        ${item[0]}
                                                                                    </div>
                                                                                    <div class="${des.length ? '' : 'd-none'}"
                                                                                         style="font-size: 14px;font-weight: 400;color: #8D8D8D;">
                                                                                        ${des}
                                                                                    </div>
                                                                                </div>
                                                                                <input style="text-align: right;width: 112px;padding: 9px 11px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                       type="number" max="0"
                                                                                       value="${(orderData.orderData as any)[`return_${item[1]}`]}"
                                                                                       min="${-(orderData.orderData as any)[item[1] ?? 0]}"
                                                                                       onchange="${gvc.event((e) => {
                                                                                           (orderData.orderData as any)[`return_${item[1]}`] = Number(e.value);
                                                                                           gvc.notifyDataChange('checkout')
                                                                                       })}">
                                                                            </div>
                                                                        `
                                                                    }).join('');
                                                                })()}
                                                                <div class="d-flex"
                                                                     style="gap: 24px;color:#393939;font-size: 16px;font-weight: 700;">
                                                                    <div style="">退款總金額</div>
                                                                    <div style="width:158px;text-align: right;">
                                                                        ${returnTotal}
                                                                    </div>
                                                                </div>
                                                            `
                                                        },
                                                        divCreate: {style: `display: flex;flex-direction: column;gap: 12px;width:100%;justify-content: center;align-items: end`}
                                                    })}

                                                `)}
                                                ${BgWidget.mainCard(html`
                                                    <div class="d-flex flex-column"
                                                         style="color: #393939;font-size: 16px;font-weight: 400;gap: 8px;">
                                                        <div style="font-weight: 700;">退貨備註</div>
                                                        <textarea
                                                                style="height: 102px;border-radius: 10px;border: 1px solid #DDD;padding: 15px;"
                                                                disabled
                                                            ">${orderData.orderData?.return_order_remark ?? ""}</textarea>
                                                    </div>
                                                `)}
                                                ${BgWidget.mainCard(html`
                                                    <div class="d-flex flex-column"
                                                         style="color: #393939;font-size: 16px;font-weight: 700;gap: 12px;">
                                                     
                                                            ${gvc.bindView({
                                                                bind: `refundTime`,
                                                                view: () => {
                                                                    return html`
                                                                        <div class="d-flex flex-column w-50"
                                                                             style="gap: 12px;">
                                                                            <div>退款狀態</div>
                                                                            <select class="form-select"
                                                                                    style="font-size: 16px;padding: 11px 12px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                    onchange="${gvc.event((e) => {
                                                                                        orderData.status = e.value;
                                                                                        if (e.value == "0"){
                                                                                            orderData.orderData.refundTime = "";
                                                                                        }
                                                                                        gvc.notifyDataChange('refundTime')
                                                                                    })}">
                                                                                ${(() => {
                                                                                    let dataArray = [
                                                                                        ["未退款", "0"],
                                                                                        ["已退款", "1"],
                                                                                    ]
                                                                                    return dataArray.map((data) => {
                                                                                        return html`
                                                                                            <option value="${data[1]}"
                                                                                                    ${(data[1] == `${orderData.status}`) ? 'selected' : ''}>
                                                                                                ${data[0]}
                                                                                            </option>
                                                                                        `
                                                                                    })
                                                                                })()}
                                                                            </select>
                                                                        </div>
                                                                        <div class="d-flex flex-column w-50"
                                                                             style="gap: 12px;">
                                                                            <div style="">退款時間</div>
                                                                            <input type="date" id="datetime"
                                                                                   name="datetime"
                                                                                   ${(orderData.status==1)?'':'disabled'}
                                                                                   value="${orderData.orderData.refundTime ?? ""}"
                                                                                   style="font-size: 16px;padding: 11px 12px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                   onchange="${gvc.event((e) => {
                                                                                       orderData.orderData.refundTime = e.value;
                                                                                   })}">
                                                                        </div>`
                                                                }, divCreate: {class: `d-flex`, style: `gap: 18px;`}
                                                            })}



                                                        <div style="margin-top: 12px;">退款銀行帳號</div>
                                                        ${gvc.bindView({
                                                            bind: "return_Info",
                                                            view: () => {
                                                                let dateArray: string[][] = [
                                                                    ["銀行代碼:", "bankCode"],
                                                                    ["銀行名稱:", "bankName"],
                                                                    ["銀行分行:", "bankBranch"],
                                                                    ["銀行戶名:", "bankAccountName"],
                                                                    ["銀行帳號:", "bankAccountNumber"],
                                                                ]
                                                                orderData.orderData.bank_info = orderData.orderData.bank_info ?? {
                                                                    "bankCode": "8321",
                                                                    "bankName": "萊恩銀行",
                                                                    "bankBranch": "台中分行",
                                                                    "bankAccountName": "王萊恩",
                                                                    "bankAccountNumber": "1234432112344321"
                                                                }
                                                                // orderData.bank_info = orderData.bank_info ??{
                                                                //     "bankCode": "",
                                                                //     "bankName": "",
                                                                //     "bankBranch": "",
                                                                //     "bankAccountName": "",
                                                                //     "bankAccountNumber": ""
                                                                // }

                                                                return dateArray.map((data) => {
                                                                    return html`
                                                                        <div class="d-flex flex-column"
                                                                             style="gap:8px;width: calc(50% - 10px);">
                                                                            <div style="text-align: left;">
                                                                                ${data[0]}
                                                                            </div>
                                                                            <input class=" "
                                                                                   value="${orderData.orderData.bank_info[data[1]]}"
                                                                                   style="display: flex;height: 44px;padding: 11px 12px;align-items: center;gap: 21px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                   placeholder=""
                                                                                   disabled
                                                                                   onchange="${gvc.event((e) => {
                                                                                       orderData.orderData.bank_info[data[1]] = e.value;
                                                                                   })}">
                                                                        </div>
                                                                    `
                                                                }).join('');
                                                            },
                                                            divCreate: {
                                                                class: `d-flex  `,
                                                                style: `font-weight: 400;flex-wrap: wrap;gap:18px;`
                                                            }
                                                        })}
                                                    </div>
                                                `)}
                                            </div> `,
                                        1200,
                                        `position: relative;`
                                )}
                                ${BgWidget.mbContainer(240)}
                                <div class="testLine d-flex align-items-center justify-content-end"
                                     style="gap:14px;max-height:48px; position:fixed;bottom:0;right:0;width: 100%;height:50px;background: #FFF;box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);padding: 14px 16px 14px 0;">
                                    <button style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;font-size: 16px;font-weight: 700;color:#393939;"
                                            onclick="${gvc.event(() => {
                                                vm.type = 'list';
                                            })}">取消
                                    </button>
                                    <button
                                            class="btn bt_c39"
                                            style="color: #FFF;font-size: 16px;font-weight: 700;padding: 6px 18px;align-items: center;gap: 8px;"
                                            onclick="${gvc.event(() => {
                                                const now = new Date();
                                                //
                                                // const dialog = new ShareDialog(gvc.glitter);
                                                // dialog.dataLoading({text: '上傳中', visible: true});
                                                let passData = {
                                                    data: orderData,
                                                }
                                                ApiShop.putReturnOrder(passData).then((response) => {
                                                    let dialog = new ShareDialog(gvc.glitter);
                                                    dialog.dataLoading({text: '上傳中', visible: false});
                                                    
                                                    if (response.result) {
                                                        dialog.successMessage({text: '更新成功!'});
                                                        // gvc.notifyDataChange(mainViewID)
                                                    } else {
                                                        dialog.errorMessage({text: '更新異常!'});
                                                    }
                                                });
                                            })}"
                                    >
                                        送出
                                    </button>
                                </div>
                            </div>
                        `,
                        1200
                    );
                } catch (e) {
                    console.log(e)
                    return ``
                }
            }, divCreate: {}
        })

    }

    public static searchOrder(gvc: GVC, vm: any) {
        let viewModel: any = {
            searchOrder: "1722101420709",
            searchData: "",
        }
        return BgWidget.container(html`
            <!--                                標頭 --- 新增訂單標題和返回  -->
            <div class="d-flex align-items-center" style="margin-bottom: 24px;">
                ${BgWidget.goBack(
                        gvc.event(() => {
                            vm.type = 'list';
                        })
                )}
                ${BgWidget.title('新增退貨單')}
            </div>
            ${BgWidget.mainCard(html`
                <div style="display: flex;padding: 20px;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                    <div style="font-size: 16px;font-weight: 700;">訂單編號*</div>
                    <input style="display: flex;height: 40px;padding: 9px 18px;align-items: flex-start;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 400;"
                           placeholder="請輸入訂單編號" value="${viewModel.searchOrder}" onchange="${gvc.event((e) => {
                        viewModel.searchOrder = e.value;
                    })}">
                    <div style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;background: #EAEAEA;font-weight: 700;cursor: pointer;"
                         onclick="${gvc.event(() => {
                             if (viewModel.searchOrder == "") {
                                 return
                             }
                             ApiShop.getOrder({
                                 page: 0,
                                 limit: 100,
                                 search: viewModel.searchOrder,
                                 searchType: 'cart_token',
                                 archived: `false`
                             }).then((response: any) => {
                                 viewModel.searchData = response.response.data.find((data: any) => data.cart_token == viewModel.searchOrder)
                                 gvc.notifyDataChange(['notFind', 'orderDetail']);
                             })
                         })}">
                        查詢訂單
                    </div>

                    ${gvc.bindView({
                        bind: "notFind",
                        view: () => {
                            if (viewModel.searchOrder.length > 0 && !viewModel.searchData) {
                                return html`
                                    <div style="display: flex;padding: 24px 0px;justify-content: center;align-items: center;gap: 10px;align-self: stretch;color:#8D8D8D;">
                                        查無此訂單
                                    </div>
                                `
                            } else {
                                return ``;
                            }

                        }, divCreate: {style: `width:100%`}
                    })}
                </div>
            `)}
            <div style="margin-top: 24px;"></div>
            ${gvc.bindView({
                bind: 'orderDetail',
                view: () => {
                    if (viewModel.searchData) {
                        let orderData = viewModel.searchData.orderData;
                        let lineItems = orderData.lineItems;
                        return html`
                            <div style="display: flex;flex-direction: column;gap: 24px">
                                ${BgWidget.mainCard(html`
                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                        <div style="font-weight: 700;">
                                            顧客資訊
                                        </div>
                                        ${(() => {
                                            // viewModel.searchData.orderData.customer_info
                                            return [["姓名", "name"], ["電話", "phone"], ["電子信箱", "email"]].map((data) => {
                                                return html`
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;width:100%">
                                                        <div>${data[0]}</div>
                                                        <input style="width: 100%;height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                               value="${(orderData.customer_info as any)[data[1]] ?? ""}"
                                                               onchange="${gvc.event((e) => {
                                                                   (orderData.customer_info as any)[data[1]] = e.value;
                                                               })}">
                                                    </div>
                                                `
                                            }).join('')
                                        })()}
                                    </div>
                                `)}
                                ${BgWidget.mainCard(html`
                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                        <div style="font-weight: 700;">
                                            退貨明細
                                        </div>
                                        <div style="display: flex;height: 34px;padding-right: 12px;align-items: center;gap: 18px;border-bottom: 1px solid #DDD;background: #FFF;width: 100%">
                                            <div style="flex:1 0 0">商品名稱</div>
                                            <div style="width:13%;text-align: center;margin-right: 20px;">退貨原因</div>
                                            <div style="width:5%;">單價</div>
                                            <div style="width:10%;text-align: center;">退貨數量</div>
                                            <div style="width:10%;text-align: center;">退回庫存數量</div>
                                            <div style="width:50px;text-align: right;">小計</div>
                                        </div>
                                    </div>

                                    ${(() => {
                                        return lineItems.map((data: any, index: number) => {
                                            return gvc.bindView({
                                                bind: `lineItem${index}`,
                                                view: () => {
                                                    gvc.addStyle(`
                                                        input[type=number]::-webkit-outer-spin-button,
                                                        input[type=number]::-webkit-inner-spin-button {
                                                            -webkit-appearance: none;
                                                            margin: 0;
                                                        }
                                                        
                                                        /* Firefox */
                                                        input[type=number] {
                                                            -moz-appearance: textfield;
                                                        }
                                                    `)
                                                    return html`
                                                        <div style="flex:1 0 0;display: flex;align-items: center;gap: 12px;">
                                                            <img style="width: 54px;height: 54px;"
                                                                 src="${data.preview_image}">
                                                            <div class="d-flex justify-content-center flex-column"
                                                                 style="gap: 4px;">
                                                                <div style="color:#393939;font-weight: 400;">
                                                                    ${data.title}
                                                                </div>
                                                                <div class="d-flex " style="gap:4px;">
                                                                    ${(() => {
                                                                        if (data.spec.length == 0) {
                                                                            return html`
                                                                                <div style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;">
                                                                                    單一規格
                                                                                </div>
                                                                            `
                                                                        }
                                                                        return data.spec.map((spec: string) => {
                                                                            data.return_count = data.return_count ?? data.count;
                                                                            return html`
                                                                                <div style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;">
                                                                                    ${spec}
                                                                                </div>`
                                                                        }).join();
                                                                    })()}
                                                                </div>
                                                                <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                                                                    存貨單位 (SKU): ${data.sku ?? ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style="width:13%;margin-right: 20px;"
                                                             class="d-flex align-items-center justify-content-center">
                                                            <select class="form-select"
                                                                    style="width:80%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                    onchange="${gvc.event((e) => {
                                                                        data.return_reason = e.value;
                                                                    })}">
                                                                ${(() => {
                                                                    let options: any = [
                                                                        {
                                                                            value: 'not_as_described',
                                                                            text: '商品不符合',
                                                                        },
                                                                        {
                                                                            value: 'damaged_in_shipping',
                                                                            text: '運送中毀損',
                                                                        },
                                                                        {
                                                                            value: 'not_as_described',
                                                                            text: '商品有瑕疵',
                                                                        },
                                                                        {
                                                                            value: 'not_as_described',
                                                                            text: '訂單有誤',
                                                                        },
                                                                    ]
                                                                    data.return_reason = data.return_reason ?? "not_as_described";

                                                                    return options.map((option: any) => {
                                                                        return html`
                                                                            <option value="${option.value}"
                                                                                    ${(data.return_reason == option.value) ? "selected" : ""}>
                                                                                ${option.text}
                                                                            </option>
                                                                        `
                                                                    })
                                                                })()}
                                                            </select>
                                                        </div>
                                                        <div style="width:5%;">${data.sale_price}</div>
                                                        <div style="width:10%;"
                                                             class="d-flex align-items-center justify-content-center">
                                                            <input type="number"
                                                                   style="text-align: center;width:94px;border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px;"
                                                                   value="${data.return_count ?? data.count}" min="0"
                                                                   onchange="${gvc.event((e) => {
                                                                       data.return_count = e.value;
                                                                       gvc.notifyDataChange(`lineItem${index}`)
                                                                   })}">
                                                        </div>
                                                        <div style="width:10%;"
                                                             class="d-flex align-items-center justify-content-center">
                                                            <input type="number"
                                                                   style="text-align: center;width:94px;border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px;"
                                                                   value="${data.return_stock ?? 0}"
                                                                   max="${data.return_count}" min="0"
                                                                   onchange="${gvc.event((e) => {
                                                                       data.return_stock = e.value;
                                                                       gvc.notifyDataChange(`lineItem${index}`)
                                                                   })}">
                                                        </div>
                                                        <div style="width:50px;text-align: right;">
                                                            ${data.return_count * data.sale_price}
                                                        </div>`
                                                },
                                                divCreate: {style: `display: flex;padding: 0px 4px 12px 0px;align-items: center;gap: 18px;background: #FFF;width: 100%`}
                                            })

                                        })
                                    })()}
                                    <div style="width: 100%;height: 1px;background-color: #DDD;margin-bottom:18px;"></div>
                                    ${gvc.bindView({
                                        bind: `checkout`,
                                        view: () => {
                                            let subTotal = 0

                                            lineItems.map((data: any, index: number) => {
                                                subTotal += data.sale_price * data.return_count
                                            })
                                            orderData.return_rebate = orderData.return_rebate ?? -orderData.rebate;
                                            orderData.return_discount = orderData.return_discount ?? -orderData.discount;

                                            let returnTotal = subTotal + orderData.return_rebate as number + orderData.return_discount as number

                                            return html`
                                                <div class="d-flex" style="gap: 24px;">
                                                    <div style="font-size: 16px;font-weight: 400;">小計總額</div>
                                                    <div style="width:158px;text-align: right;">${subTotal}</div>
                                                </div>
                                                <div class="d-flex" style="gap: 24px;">
                                                    <div style="font-size: 16px;font-weight: 400;">運費</div>
                                                    <div style="width:158px;text-align: right;">
                                                        ${orderData.shipment_fee}
                                                    </div>
                                                </div>
                                                ${(() => {
                                                    return [["折扣", "discount"], ["購物金", "rebate"]].map((item: any, index: number) => {
                                                        let des = orderData.voucherList.filter((orderitem: any) => orderitem.reBackType == item[1]).map((orderitem: any) => {
                                                            return orderitem.title;
                                                        }).join(' , ');
                                                        des = des ?? ""
                                                        return html`
                                                            <div class="d-flex" style="gap: 70px;">
                                                                <div class="d-flex flex-column justify-content-center "
                                                                     style="font-size: 16px;font-weight: 400;">
                                                                    <div style="text-align: right;">
                                                                        ${item[0]}
                                                                    </div>
                                                                    <div class="${des.length ? '' : 'd-none'}"
                                                                         style="font-size: 14px;font-weight: 400;color: #8D8D8D;">
                                                                        ${des}
                                                                    </div>
                                                                </div>
                                                                <input style="text-align: right;width: 112px;padding: 9px 11px;border-radius: 10px;border: 1px solid #DDD;"
                                                                       type="number" max="0"
                                                                       value="${orderData[`return_${item[1]}`]}"
                                                                       min="${-orderData[item[1] ?? 0]}"
                                                                       onchange="${gvc.event((e) => {
                                                                           orderData[`return_${item[1]}`] = Number(e.value);
                                                                           gvc.notifyDataChange('checkout')
                                                                       })}">
                                                            </div>
                                                        `
                                                    }).join('');
                                                })()}
                                                <div class="d-flex"
                                                     style="gap: 24px;color:#393939;font-size: 16px;font-weight: 700;">
                                                    <div style="">退款總金額</div>
                                                    <div style="width:158px;text-align: right;">${returnTotal}</div>
                                                </div>
                                            `
                                        },
                                        divCreate: {style: `display: flex;flex-direction: column;gap: 12px;width:100%;justify-content: center;align-items: end`}
                                    })}
                                `)}
                                ${BgWidget.mainCard(html`
                                    <div class="d-flex flex-column"
                                         style="color: #393939;font-size: 16px;font-weight: 400;gap: 8px;">
                                        <div style="font-weight: 700;">退貨備註</div>
                                        <textarea
                                                style="height: 102px;border-radius: 10px;border: 1px solid #DDD;padding: 15px;"
                                                onchange="${gvc.event((e) => {
                                                    orderData.return_order_remark = e.value;
                                                })}">${orderData?.return_order_remark ?? ""}</textarea>
                                    </div>
                                `)}
                                ${BgWidget.mainCard(html`
                                    <div class="d-flex flex-column"
                                         style="color: #393939;font-size: 16px;font-weight: 700;gap: 12px;">
                                        <div style="">退款銀行帳號</div>
                                        <div class="d-flex flex-wrap"></div>
                                        ${gvc.bindView({
                                            bind: "return_Info",
                                            view: () => {
                                                let dateArray: string[][] = [
                                                    ["銀行代碼:", "bankCode"],
                                                    ["銀行名稱:", "bankName"],
                                                    ["銀行分行:", "bankBranch"],
                                                    ["銀行戶名:", "bankAccountName"],
                                                    ["銀行帳號:", "bankAccountNumber"],
                                                ]
                                                orderData.bank_info = orderData.bank_info ?? {
                                                    "bankCode": "8321",
                                                    "bankName": "萊恩銀行",
                                                    "bankBranch": "台中分行",
                                                    "bankAccountName": "王萊恩",
                                                    "bankAccountNumber": "1234432112344321"
                                                }
                                                // orderData.bank_info = orderData.bank_info ??{
                                                //     "bankCode": "",
                                                //     "bankName": "",
                                                //     "bankBranch": "",
                                                //     "bankAccountName": "",
                                                //     "bankAccountNumber": ""
                                                // }

                                                return dateArray.map((data) => {
                                                    return html`
                                                        <div class="d-flex flex-column"
                                                             style="gap:8px;width: calc(50% - 9px)">
                                                            <div style=text-align:left;">${data[0]}</div>
                                                            <input class=""
                                                                   value="${orderData.bank_info[data[1]]}"
                                                                   style="display: flex;height: 44px;padding: 11px 12px;align-items: center;gap: 21px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                   placeholder="" onchange="${gvc.event((e) => {
                                                                orderData.bank_info[data[1]] = e.value;
                                                            })}">
                                                        </div>
                                                    `
                                                }).join('');
                                            },
                                            divCreate: {
                                                class: `d-flex d-flex flex-wrap `,
                                                style: `gap:18px;font-weight: 400;`
                                            }
                                        })}
                                    </div>
                                `)}
                                ${BgWidget.mb240()}
                                <div class="testLine d-flex align-items-center justify-content-end"
                                     style="gap:14px;max-height:48px; position:fixed;bottom:0;right:0;width: 100%;height:50px;background: #FFF;box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);padding: 14px 16px 14px 0;">
                                    <button style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;font-size: 16px;font-weight: 700;color:#393939;"
                                            onclick="${gvc.event(() => {
                                                vm.type = 'list';
                                            })}">取消
                                    </button>
                                    <button
                                            class="btn bt_c39"
                                            style="color: #FFF;font-size: 16px;font-weight: 700;padding: 6px 18px;align-items: center;gap: 8px;"
                                            onclick="${gvc.event(() => {
                                                viewModel.searchData.orderData.returnProgress = "1";
                                                ApiShop.postReturnOrder(viewModel.searchData).then(r => {
                                                    vm.type = 'list';
                                                })
                                                // dialog.dataLoading({text: '上傳中', visible: true});
                                                // ApiShop.putOrder({
                                                //     id: `${orderData.id}`,
                                                //     order_data: orderData.orderData,
                                                //     status: orderData.status,
                                                // }).then((response) => {
                                                //     dialog.dataLoading({text: '上傳中', visible: false});
                                                //     if (response.result) {
                                                //         dialog.successMessage({text: '更新成功!'});
                                                //         gvc.notifyDataChange(mainViewID)
                                                //     } else {
                                                //         dialog.errorMessage({text: '更新異常!'});
                                                //     }
                                                // });
                                            })}"
                                    >
                                        儲存
                                    </button>
                                </div>
                            </div>

                        `
                    }
                    return ``
                }, divCreate: {}
            })}

        `, 1200)
    }

    public static getPaymentMethodText(key: string, orderData: any) {
        switch (key) {
            case 'off_line':
                switch (orderData.customer_info.payment_select) {
                    case 'atm':
                        return `銀行轉帳`
                    case 'line':
                        return `Line Pay`
                    case 'cash_on_delivery':
                        return `貨到付款`
                }
                return `線下付款`
            case 'newWebPay':
                return `藍新金流`
            case 'ecPay':
                return `綠界金流`
            default:
                return `線下付款`
        }
    }

    public static getProofPurchaseString(orderData: any, gvc: GVC) {
        if (orderData.method !== 'off_line' || orderData.customer_info.payment_select === 'cash_on_delivery') {
            return ``
        } else {
            return [
                BgWidget.title_16('付款證明回傳'),
                `<div class="border rounded-3 w-100 p-3" style="color: #393939;font-size: 16px;font-weight: 400; line-height: 120%;">
${(() => {
                    const array: any = [];
                    switch (orderData.customer_info.payment_select) {
                        case 'atm':
                            ['pay-date', 'bank_name', 'bank_account', 'trasaction_code'].map((dd, index) => {
                                if (orderData.proof_purchase && orderData.proof_purchase[dd]) {
                                    array.push(`${['交易時間', '銀行名稱', '銀行戶名', '銀行帳號後五碼'][index]} : ${orderData.proof_purchase[dd]}`)
                                }
                            })
                            break
                        case 'line':
                            ['image'].map((dd, index) => {
                                if (orderData.proof_purchase[dd]) {
                                    array.push(`<img src="${orderData.proof_purchase[dd]}" style="width: 300px;cursor: pointer;" onclick="${gvc.event(() => {
                                        (window.parent as any).glitter.openDiaLog((window.parent as any).glitter.root_path + '/dialog/image-preview.js', 'preview', orderData.proof_purchase[dd])
                                    })}">`)
                                }
                            })
                            break
                        case 'cash_on_delivery':
                            return `貨到付款`
                    }
                    return array.join('<div class="my-2"></div>') || '尚未回傳付款證明'
                })()}
        </div>`
            ].join('')
        }
        // ${(orderData.orderData.proof_purchase) ?
        //                                                        [BgWidget.title_16('付款證明回傳'),`
        //                                                    <div class="border rounded-3 w-100 p-3" style="color: #393939;font-size: 16px;font-weight: 400; line-height: 120%;">
        //                                                ${orderData.orderData.proof_purchase}
        // </div>
        //     `].join('')
        //                                                         :``}
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingOrderManager)