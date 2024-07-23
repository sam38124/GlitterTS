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
    type: 'list' | 'add' | 'replace' | 'select';
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
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.orderFilterFrame);
        vm.filter = ListComp.getFilterObject();
        gvc.addMtScript([{src: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"}], () => {

        }, () => {

        })
        function importDataTo(event:Event){
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
                const workbook = XLSX.read(data, { type: 'array' });

                // 假設我們只讀取第一個工作表
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // 將工作表轉換為 JSON
                const json = XLSX.utils.sheet_to_json(worksheet);

                console.log(json)
            };

            reader.readAsArrayBuffer(file);
        }
        function exportDataTo(firstRow:string[] , data:any) {
            if ((window as any).XLSX) {
                // 將資料轉換成工作表
                let XLSX = (window as any).XLSX;

                const worksheet = XLSX.utils.json_to_sheet(data , { skipHeader: true });
                XLSX.utils.sheet_add_aoa(worksheet, [firstRow], { origin: "A1" });

                // 創建一個新的工作簿
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                // 將工作簿轉換成二進制數據
                const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});

                // 將二進制數據轉換成 Blob 物件
                function s2ab(s:any) {
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
                                ${BgWidget.title('訂單列表')}
                                <div class="flex-fill"></div>
                                <div style="display: flex; gap: 14px;">

                                    <input class="d-none" type="file" id="upload-excel" onchange="${gvc.event((e , event)=>{
                                        importDataTo(event)
                                    })}"/>
                                    ${BgWidget.grayButton(
                                            '匯入',
                                            gvc.event((e) => {
                                                (document.querySelector("#upload-excel") as HTMLInputElement)!.click();
                                            })
                                    )}${BgWidget.grayButton(
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
                                                    let firstRow = ["訂單編號" , "訂購人", "訂購人email" , "訂單金額" , "付款狀態" , "出貨狀態" , "訂單狀態" ];
                                                    let exportData:any = [];
                                                    console.log(response.response.data)
                                                    response.response.data.map((orderData:any)=>{
                                                        let rowData: {
                                                            orderID: string;
                                                            order_name: string;
                                                            order_email: string;
                                                            total: string;
                                                            pay_status: string;
                                                            progress: string;
                                                            order_status: string
                                                        }={
                                                            orderID:orderData.cart_token,
                                                            order_name: orderData?.customer_info?.name??orderData.orderData.user_info.name,
                                                            order_email: orderData.orderData.user_email,
                                                            total: orderData.orderData.total,
                                                            pay_status:  (()=>{
                                                                switch (orderData.status){
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
                                                            progress: (()=>{
                                                                switch (orderData.orderData.progress ?? 'wait'){
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
                                                            order_status: (()=>{
                                                                switch (orderData.orderData.orderStatus??'0'){
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
                                                    console.log(exportData)
                                                    exportDataTo(firstRow , exportData);
                                                })
                                            })
                                    )}
                                    ${BgWidget.darkButton(
                                            '新增',
                                            gvc.event(() => {
                                                vm.type = 'add';
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
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiShop.getOrder({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined,
                                        searchType: vm.queryType || 'name',
                                        orderString: vm.orderString,
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
                                                        key: '訂單編號',
                                                        value: dd.cart_token,
                                                    },
                                                    {
                                                        key: '訂單日期',
                                                        value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                                    },
                                                    {
                                                        key: '訂購人',
                                                        value: dd.orderData.user_info ? dd.orderData.user_info.name : `匿名`,
                                                    },
                                                    {
                                                        key: '訂單金額',
                                                        value: dd.orderData.total.toLocaleString(),
                                                    },
                                                    {
                                                        key: '付款狀態',
                                                        value: (() => {

                                                            switch (dd.status) {

                                                                case 0:
                                                                    return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">未付款</div>`;
                                                                case 1:
                                                                    return `<div class="badge" style="border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已付款</div>`;
                                                                case -1:
                                                                    return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">付款失敗</div>`;
                                                                case -2:
                                                                    return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已退款</div>`;
                                                            }
                                                        })(),
                                                    },
                                                    {
                                                        key: '出貨狀態',
                                                        value: (() => {
                                                            switch (dd.orderData.progress ?? 'wait') {
                                                                case 'wait':
                                                                    return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">未出貨</div>`;
                                                                case 'shipping':
                                                                    return `<div class="badge" style="border-radius: 7px;background: #FFE9B2;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已出貨</div>`;
                                                                case 'finish':
                                                                    return `<div class="badge" style="border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已取貨</div>`;
                                                                case 'arrived':
                                                                    return `<div class="badge" style="border-radius: 7px;background: #FFE9B2;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已送達</div>`;
                                                                case 'returns':
                                                                    return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已退貨</div>`;
                                                            }
                                                        })(),
                                                    },
                                                    {
                                                        key: '訂單狀態',
                                                        value: (() => {
                                                            switch (dd.orderData.orderStatus ?? '0') {
                                                                case '-1':
                                                                    return `<div class="badge  " style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFD5D0;">已取消</div>`;
                                                                case '0':
                                                                    return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">處理中</div>`;
                                                                case '1':
                                                                    return `<div class="badge " style="font-size: 14px;color:#393939;border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;">已完成</div>`;

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
                                                options: FilterOptions.orderSelect,
                                            })}
                                            ${BgWidget.searchFilter(
                                                    gvc.event((e, event) => {
                                                        vm.query = e.value;
                                                        gvc.notifyDataChange(vm.id);
                                                    }),
                                                    vm.query || '',
                                                    '搜尋所有訂單'
                                            )}
                                            ${BgWidget.funnelFilter({
                                                gvc,
                                                callback: () => ListComp.showRightMenu(FilterOptions.orderFunnel),
                                            })}
                                            ${BgWidget.updownFilter({
                                                gvc,
                                                callback: (value: any) => {
                                                    vm.orderString = value;
                                                    gvc.notifyDataChange(vm.id);
                                                },
                                                default: vm.orderString || 'default',
                                                options: FilterOptions.orderOrderBy,
                                            })}
                                        </div>
                                        <div>${ListComp.getFilterTags(FilterOptions.orderFunnel)}</div>
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
                    } else if (vm.type == "add") {
                        return this.createOrder(gvc, vm)
                    } else {
                        return ``;
                    }
                },
            };
        });
    }

    public static replaceOrder(gvc: GVC, vm: any, id: string) {
        const glitter = gvc.glitter;
        const origData = JSON.parse(JSON.stringify(vm.data))
        const orderData: {
            id: number;
            cart_token: string;
            status: number;
            email: string;
            orderData: {
                customer_info: any;
                editRecord: any;
                method: string;
                orderStatus: string;
                use_wallet: number;
                email: string;
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
                shipment_form_format?: any,
                progress: string;
                // progress: 'finish' | 'wait' | 'shipping' | "returns";
                order_note: string;
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
        } = vm.data ?? {
            id: 3469,
            cart_token: '1699540611634',
            status: 1,
            email: 'sam38124@gmail.com',
            orderData: {
                email: 'sam38124@gmail.com',
                total: 99000,
                customer_info: {name: "", phone: "", email: ""},
                lineItems: [
                    {
                        id: 291,
                        spec: ['A', '140 * 230 cm'],
                        count: '9',
                        sale_price: 11000,
                    },
                ],
                user_info: {
                    name: '王建智',
                    email: 'sam38124@gmail.com',
                    phone: '0978028730',
                    address: '台中市潭子區昌平路三段150巷15弄12號',
                },
                progress: 'wait',
                note: `用戶備註: 我的餐椅是要亞麻灰的，可是到後面頁面都會跳成米白！再麻煩幫我送亞麻灰的 麻煩12月中旬過後再幫我送貨，確切時間再提千跟我聯繫，謝謝！！ 訂單來源裝置: app 金流來源與編號: 藍新金流 / 2311110375 11/8 告知 chloe及 PM 此請技術排查，並讓 chloe 向供應商說明緣由。`,
            },
            created_time: '2023-11-09T06:36:51.000Z',
        };
        let userData: any = {};
        const mainViewID = gvc.glitter.getUUID();
        orderData.orderData.progress = orderData.orderData.progress ?? 'wait';
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);

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

        const vt = {
            paymentBadge: () => {
                if (orderData.status === 0) {
                    return drawBadge('red', "未付款");
                } else if (orderData.status === 1) {
                    return drawBadge('green', "已付款");
                } else if (orderData.status === -2) {
                    return drawBadge('red', "已退款");
                } else {
                    return drawBadge('red', "付款失敗");
                }
            },
            outShipBadge: () => {
                switch (orderData.orderData.progress ?? 'wait') {
                    case 'wait':
                        return drawBadge('#FFD5D0', '未出貨')
                    case 'shipping':
                        return drawBadge('#FFE9B2', '已出貨')
                    case 'finish':
                        return drawBadge('#D8ECDA', '已取貨')
                    case 'arrived':
                        return drawBadge('#FFE9B2', '已送達')
                    case 'returns':
                        return drawBadge('#FFD5D0', '已退貨')
                }
            },
            orderStatusBadge: () => {
                console.log(orderData.orderData)
                if (orderData.orderData.orderStatus === '1') {
                    return drawBadge('green', "已完成");
                } else if (orderData.orderData.orderStatus === '0') {
                    return drawBadge('yellow', "處理中");
                } else {
                    return drawBadge('red', "已取消");
                }
            },
        };
        ApiUser.getUsersDataWithEmail(orderData.email)
            .then((res) => {

                userData = res.response
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
                                                                #${orderData.cart_token}
                                                        </div>
                                                        <div class="d-flex align-items-center"
                                                             style="color: #8D8D8D;font-size: 16px;font-weight: 400;gap:10px;">
                                                            訂單成立時間 :
                                                            ${glitter.ut.dateFormat(new Date(orderData.created_time), 'yyyy-MM-dd hh:mm')}${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}
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

                                                        writeEdit(origData, orderData)
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
                                        <div class="d-flex flex-column flex-column-reverse  flex-md-row"
                                             style="gap:10px;">
                                            <div style="width:900px;max-width:100%;gap:10px;"
                                                 class="d-flex flex-column">
                                                ${BgWidget.card(
                                                        [
                                                            html`
                                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;">
                                                                        訂單狀態
                                                                    </div>
                                                                    <div class="ms-auto w-100" style="">
                                                                        ${EditorElem.select({
                                                                            title: ``,
                                                                            gvc: gvc,
                                                                            def: orderData.orderData.orderStatus ?? '0',
                                                                            array: [{
                                                                                title: '變更訂單狀態',
                                                                                value: ''
                                                                            }].concat(ApiShop.getOrderStatusArray()),
                                                                            callback: (text) => {
                                                                                orderData.orderData.orderStatus = orderData.orderData.orderStatus || '0';
                                                                                if (text && text !== orderData.orderData.orderStatus) {

                                                                                    orderData.orderData.orderStatus = text;

                                                                                }
                                                                            },
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div style="color:#393939;font-size: 16px;font-weight: 700;margin: 18px 0px;">
                                                                    訂單明細
                                                                </div>
                                                                <div class="w-100"
                                                                     style="height: 1px;background-color: #DDD;margin-bottom: 18px;"></div>
                                                                <div class="d-flex flex-column" style="gap: 18px;">
                                                                    ${orderData.orderData.lineItems
                                                                            .map((dd: any) => {
                                                                                return `${gvc.bindView(() => {
                                                                                    return {
                                                                                        bind: glitter.getUUID(),
                                                                                        view: () => {
                                                                                            return new Promise(async (resolve, reject) => {
                                                                                                resolve(html`<img
                                                                                                        src="${dd.preview_image || 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png'}"
                                                                                                        class="border rounded"
                                                                                                        style="width:60px;height:60px;margin-right:12px;"
                                                                                                />
                                                                                                <div class="d-flex flex-column"
                                                                                                     style="gap:2px;">
                                                                                                    <div class="fw-bold"
                                                                                                         style="color: #393939;font-size: 16px;font-weight: 400;">
                                                                                                        ${dd.title}
                                                                                                    </div>
                                                                                                    <div class="d-flex">
                                                                                                        ${dd.spec
                                                                                                                .map((dd: any) => {
                                                                                                                    return `<div class="" style="color: #8D8D8D;font-size: 16px;font-weight: 400;">${dd}</div>`;
                                                                                                                })}
                                                                                                    </div>
                                                                                                    <div class=""
                                                                                                         style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                                                                                                        存貨單位
                                                                                                            (SKU)：${dd.sku ?? '--'}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="flex-fill"></div>
                                                                                                <div class=""
                                                                                                     style="color: #393939;font-size: 16px;font-weight: 400;">
                                                                                                        $${dd.sale_price.toLocaleString()}
                                                                                                    × ${dd.count}
                                                                                                </div>
                                                                                                <div class=""
                                                                                                     style="color: #393939;font-size: 16px;font-weight: 400;width: 114px;display: flex;justify-content: end;">
                                                                                                        $${dd.sale_price.toLocaleString()}
                                                                                                </div>`);
                                                                                            });
                                                                                        },
                                                                                        divCreate: {
                                                                                            class: `d-flex align-items-center`,
                                                                                            style: ``,
                                                                                        },
                                                                                    };
                                                                                })}
`;
                                                                            })
                                                                            .join('<div class="w-100 bgf6" style="height:1px;"></div>')}
                                                                    <div class="w-100"
                                                                         style="height: 1px;background-color: #DDD;margin-bottom: 18px;"></div>
                                                                    ${[
                                                                        {
                                                                            title: '小計',
                                                                            description: `${orderData.orderData.lineItems
                                                                                    .map((dd) => {
                                                                                        return parseInt(dd.count, 10);
                                                                                    })
                                                                                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} 件商品`,
                                                                            total: `$${(
                                                                                    orderData.orderData.total +
                                                                                    orderData.orderData.discount -
                                                                                    orderData.orderData.shipment_fee +
                                                                                    orderData.orderData.use_rebate
                                                                            ).toLocaleString()}`,
                                                                        },
                                                                        {
                                                                            title: '運送',
                                                                            description: '',
                                                                            total: `$${orderData.orderData.shipment_fee.toLocaleString()}`,
                                                                        },
                                                                        ...(() => {
                                                                            if (orderData.orderData.use_rebate) {
                                                                                return [
                                                                                    {
                                                                                        title: '回饋金',
                                                                                        description: ``,
                                                                                        total: `- $${orderData.orderData.use_rebate.toLocaleString()}`,
                                                                                    },
                                                                                ];
                                                                            } else {
                                                                                return [];
                                                                            }
                                                                        })(),
                                                                        ...(() => {
                                                                            if (orderData.orderData.use_wallet) {
                                                                                return [
                                                                                    {
                                                                                        title: '錢包',
                                                                                        description: `使用錢包扣款`,
                                                                                        total: `- $${orderData.orderData.use_wallet.toLocaleString()}`,
                                                                                    },
                                                                                ];
                                                                            } else {
                                                                                return [];
                                                                            }
                                                                        })(),
                                                                        ...orderData.orderData.voucherList.map((dd: any) => {


                                                                            return {
                                                                                title: '折扣',
                                                                                description: `<div style="color: #8D8D8D;font-size: 14px;white-space:nowrap;text-overflow:ellipsis;">${dd.title}</div>`,
                                                                                total: `- $${orderData.orderData.discount.toLocaleString()}`,
                                                                            };
                                                                        }),
                                                                        {
                                                                            title: `<span class="" style="font-weight: 700;">總金額</span>`,
                                                                            description: '',
                                                                            total: `<span class="" style="font-weight: 700;">$${orderData.orderData.total.toLocaleString()}</span>`,
                                                                        },
                                                                    ]
                                                                            .map((dd) => {
                                                                                return html`
                                                                                    <div class="d-flex align-items-center justify-content-end">
                                                                                        <div class="d-flex flex-column"
                                                                                             style="color: #393939;text-align: right;font-size: 16px;font-weight: 400;">
                                                                                            ${dd.title}
                                                                                            ${dd.description ?? ""}
                                                                                        </div>
                                                                                        <div class=""
                                                                                             style="width: 114px;display: flex;justify-content: end;">
                                                                                            ${dd.total}
                                                                                        </div>
                                                                                    </div>`;
                                                                            })
                                                                            .join('')}
                                                                </div> `,
                                                        ].join('<div class="my-2"></div>')
                                                )}
                                                ${BgWidget.card(html`
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                        <div style="color:#393939;font-size: 16px;font-weight: 700;">
                                                            付款狀態
                                                        </div>
                                                        <div class="ms-auto w-100" style="">
                                                            ${EditorElem.select({
                                                                title: ``,
                                                                gvc: gvc,
                                                                def: `${orderData.status}`,
                                                                array: [
                                                                    {title: '變更付款狀態', value: ''},
                                                                    {title: '已付款', value: '1'},
                                                                    {title: '未付款', value: '0'},
                                                                    {title: '已退款', value: '-2'},
                                                                ],
                                                                callback: (text) => {
                                                                    if (text && text !== `${orderData.status}`) {
                                                                        orderData.status = parseInt(text, 10);

                                                                    }
                                                                },
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                        <div style="color:#393939;font-size: 16px;font-weight: 700;margin-top: 18px;">
                                                            付款方式
                                                        </div>
                                                        <div style="color: #393939;font-size: 16px;font-weight: 400; line-height: 140%;">
                                                            ${ShoppingOrderManager.getPaymentMethodText(orderData.orderData.method)}
                                                        </div>
                                                    </div>
                                                `)}
                                                ${BgWidget.card(html`
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                        <div style="color:#393939;font-size: 16px;font-weight: 700;">
                                                            配送狀態
                                                        </div>
                                                        <div class="ms-auto w-100" style="">
                                                            ${EditorElem.select({
                                                                title: ``,
                                                                gvc: gvc,
                                                                def: `${orderData.orderData.progress}`,
                                                                array: [
                                                                    {title: '配送狀態', value: ''},
                                                                    {title: '已出貨', value: 'shipping'},
                                                                    {title: '未出貨', value: 'wait'},
                                                                    {title: '已取貨', value: 'finish'},
                                                                    {title: '已退貨', value: 'returns'},
                                                                    {title: '已到貨', value: 'arrived'},
                                                                ],
                                                                callback: (text) => {

                                                                    if (text && text !== `${orderData.orderData.progress}`) {
                                                                        orderData.orderData.progress = text
                                                                    }
                                                                },
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                        <div style="color:#393939;font-size: 16px;font-weight: 700;margin-top: 18px;">
                                                            配送方式
                                                        </div>
                                                        <div style="color: #393939;font-size: 16px;font-weight: 400; line-height: 140%;">
                                                            ${(() => {

                                                                let shipment: any = {
                                                                    "normal": "宅配",
                                                                    "UNIMARTC2C": "7-11店到店",
                                                                    "FAMIC2C": "全家店到店",
                                                                    "OKMARTC2C": "OK店到店",
                                                                    "HILIFEC2C": "萊爾富店到店"
                                                                }
                                                                return shipment[orderData.orderData.user_info.shipment];
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                        <div style="color:#393939;font-size: 16px;font-weight: 700;margin-top: 18px;">
                                                            配送資訊
                                                        </div>
                                                        <div class="d-flex flex-column"
                                                             style="color: #393939;font-size: 16px;font-weight: 400; line-height: 140%;gap: 4px;">
                                                            ${(() => {
                                                                if (orderData.orderData.user_info.shipment == "normal") {
                                                                    return orderData.orderData.user_info.address;
                                                                } else {
                                                                    return html`
                                                                        <div class="d-flex flex-wrap">
                                                                            <span class="me-2">門市名稱:</span>
                                                                            <div style="white-space: normal;word-break: break-all;">
                                                                                ${orderData.orderData.user_info.CVSStoreName}
                                                                            </div>
                                                                        </div>
                                                                        <div class="d-flex">門市店號:
                                                                            ${orderData.orderData.user_info.CVSStoreID}
                                                                        </div>
                                                                        <div class="d-flex"
                                                                             style="white-space: normal;word-break: break-all;">
                                                                            地址:
                                                                            ${orderData.orderData.user_info.CVSAddress}
                                                                        </div>
                                                                    `
                                                                }
                                                                // let shipment: any = {
                                                                //     "normal": "宅配",
                                                                //     "UNIMARTC2C": "7-11店到店",
                                                                //     "FAMIC2C": "全家店到店",
                                                                //     "OKMARTC2C": "OK店到店",
                                                                //     "HILIFEC2C": "萊爾富店到店"
                                                                // }
                                                                // return shipment[orderData.orderData.user_info.shipment];
                                                            })()}
                                                        </div>
                                                    </div>
                                                `)}
                                                ${BgWidget.card(html`
                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;margin-bottom: 18px">
                                                        訂單備註
                                                    </div>
                                                    <div style="position: relative;">
                                                        ${EditorElem.editeText({
                                                            gvc: gvc,
                                                            title: '',
                                                            default: orderData.orderData.order_note as string,
                                                            placeHolder: '',
                                                            callback: (text) => {
                                                                orderData.orderData.order_note = text;
                                                            },
                                                        })}
                                                    </div>

                                                `)}
                                                ${BgWidget.card(html`
                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;margin-bottom: 18px">
                                                        訂單記錄
                                                    </div>
                                                    <div class="d-flex flex-column" style="gap: 8px">
                                                        ${(() => {
                                                            let returnHTML = ``;

                                                            if (!orderData.orderData?.editRecord) {
                                                                return ``
                                                            }

                                                            orderData.orderData.editRecord.map((record: any) => {
                                                                returnHTML = `
                                                    <div class="d-flex " style="gap: 42px">
                                                        <div>${formatDateString(record.time)}</div>
                                                        <div>${record.record}</div>
                                                    </div>
                                                    ` + returnHTML
                                                            })
                                                            return returnHTML
                                                        })()}
                                                        <div class="d-flex " style="gap: 42px">
                                                            <div>${formatDateString(orderData.created_time)}</div>
                                                            <div>訂單成立</div>
                                                        </div>
                                                    </div>
                                                `)}
                                            </div>
                                            <div style="width:380px;max-width:100%;">
                                                ${BgWidget.card(html`
                                                    <div class="p-2" style="color: #393939;font-size: 16px;">
                                                        <div class="d-flex align-items-center">
                                                            <div class="" style="font-size: 16px;font-weight: 700;">
                                                                顧客資料
                                                            </div>
                                                            <div class="flex-fill"></div>
                                                        </div>
                                                        <div class="w-100 d-flex flex-column mt-2" style="gap:12px;">
                                                            ${[
                                                                html`<div class="d-flex flex-column" style="gap:8px;">
                                            <div class="d-flex align-items-center" style="color: #4D86DB;font-weight: 400; gap:8px;cursor:pointer;" onclick="${gvc.event(() => {
                                                                    child_vm.userID = userData.userID
                                                                    child_vm.type = 'user'
                                                                })}">${userData?.userData?.name ?? "訪客"}
                                                ${(() => {

                                                                    if (userData?.member) {

                                                                        for (let i = 0; i < userData.member.length; i++) {

                                                                            if (userData.member[i].trigger) {
                                                                                return `<div class="d-flex align-items-center justify-content-center" style="padding: 4px 6px;border-radius: 7px;background: #393939;color: #FFF;">${userData.member[i].tag_name}</div>`
                                                                            }
                                                                        }
                                                                    }

                                                                    return `<div style="border-radius: 7px;background: #EAEAEA;padding: 4px 6px;color:#393939;font-weight: 700;">訪客</div>`
                                                                })()}
                                                
                                            </div>
                                            <div class="" style="color: #393939;font-weight: 400;">${userData?.userData?.phone ?? orderData.orderData.user_info.phone}</div>
                                            <div class="" style="color: #393939;font-weight: 400;">${userData?.userData?.email ?? orderData.orderData.user_info.email}</div>
                                        </div>`,
                                                                `<div class="bgf6" style="height: 1px;margin: 8px 0"></div>`,
                                                                `<div class="" style="font-size: 16px;font-weight: 700;">收件人資料</div>`,
                                                                `<div class="d-flex flex-column" style="gap:8px;">
                                                                    <div class="" style="color: #4D86DB;font-weight: 400;">${orderData.orderData?.customer_info?.name ?? orderData.orderData.user_info.name}</div>
                                                                    <div class="" style="color: #393939;font-weight: 400;">${orderData.orderData.user_info.phone || "電話未填"}</div>
                        <!--                                            <div class="fw-normal fs-6">Email:${orderData.orderData.user_info.email}</div>-->
                                                                 </div>`,
                                                                `<div class="" style="font-size: 16px;font-weight: 700;">付款方式</div>`,
                                                                `<div style=""> ${ShoppingOrderManager.getPaymentMethodText(orderData.orderData.method)}</div>`,
                                                                `<div class="" style="font-size: 16px;font-weight: 700;">配送方式</div>`,
                                                                `<div class="" style="color: #393939;line-height: 140%; ">${(() => {
                                                                    switch (orderData.orderData.user_info.shipment) {
                                                                        case 'FAMIC2C':
                                                                            return '全家店到店';
                                                                        case 'HILIFEC2C':
                                                                            return '萊爾富店到店';
                                                                        case 'normal':
                                                                            return '宅配到府';
                                                                        case 'OKMARTC2C':
                                                                            return 'OK超商店到店';
                                                                        case 'UNIMARTC2C':
                                                                            return '7-ELEVEN超商交貨便';
                                                                        default:
                                                                            return '宅配到府';
                                                                    }
                                                                })()}</div>`,
                                                                `<div class="" style="font-size: 16px;font-weight: 700;">配送資訊</div>`,
                                                                (() => {
                                                                    switch (orderData.orderData.user_info.shipment) {
                                                                        case 'FAMIC2C':
                                                                        case 'HILIFEC2C':
                                                                        case 'OKMARTC2C':
                                                                        case 'UNIMARTC2C':

                                                                            return [
                                                                                `    <div class="d-flex flex-wrap w-100">
                                                                            <span class="me-2 fw-normal fs-6">門市名稱:</span>
                                                                            <div class="fw-normal fs-6" style="white-space: normal;word-break: break-all;"> ${decodeURI(orderData.orderData.user_info.CVSStoreName)}</div>
                                                                        </div>`,
                                                                                `<div class="fw-normal fs-6">代號: ${orderData.orderData.user_info.CVSStoreID}</div>`,
                                                                                `<div class="fw-normal fs-6 w-100" style="white-space: normal;word-break: break-all;">地址: ${orderData.orderData.user_info.CVSAddress}</div>`,
                                                                                `<div class="my-2 bgf6" style="height: 1px;"></div>`,
                                                                            ].join('');
                                                                        case 'normal':
                                                                        default:
                                                                            return [
                                                                                `<div class="fw-bold fs-6">配送地址</div>`,
                                                                                `<div class="fw-normal fs-6" style="white-space: normal;">${orderData.orderData.user_info.address}</div>`,
                                                                                `<div class="my-2 bgf6" style="height: 1px;"></div>`,
                                                                            ].join('');
                                                                    }
                                                                })(),
                                                                gvc.bindView(() => {
                                                                    const id = glitter.getUUID();
                                                                    const vm: {
                                                                        mode: 'edit' | 'read';
                                                                    } = {
                                                                        mode: 'read',
                                                                    };
                                                                    return {
                                                                        bind: id,
                                                                        view: () => {
                                                                            return html`
                                                                                <div class="d-flex align-items-center ">
                                                                                    <div class="fw-bold fs-6">用戶備註
                                                                                    </div>
                                                                                    <div class="flex-fill"></div>
                                                                                    <i
                                                                                            class="fa-solid fa-pencil d-none"
                                                                                            style="cursor:pointer;"
                                                                                            onclick="${gvc.event(() => {
                                                                                                vm.mode = vm.mode === 'edit' ? 'read' : 'edit';
                                                                                                gvc.notifyDataChange(id);
                                                                                            })}"
                                                                                    ></i>
                                                                                </div>
                                                                                <div class="fs-6 w-100 mt-2  lh-lg fw-normal"
                                                                                     style="word-break: break-all;white-space:normal;">
                                                                                    ${(orderData.orderData.user_info.note ?? '尚未填寫').replace(/\n/g, `<br>`)}
                                                                                </div>
                                                                            `;
                                                                        },
                                                                        divCreate: {
                                                                            class: ` fw-normal`,
                                                                        },
                                                                    };
                                                                })
                                                            ].join('')}
                                                        </div>
                                                    </div>
                                                `)}
                                                ${(() => {
                                                    if (orderData.orderData.shipment_form_format && orderData.orderData.shipment_form_format.length > 0) {
                                                        return `    <div class="mt-2"></div>` + BgWidget.card(html`

                                                            <div class="p-2" style="color: #393939;font-size: 16px;">
                                                                ${orderData.orderData.shipment_form_format.filter((dd: any) => {
                                                                    return (orderData.orderData.user_info as any)[dd.key];
                                                                }).map((dd: any) => {
                                                                    return ` <div class="d-flex align-items-center">
                                                            <div class="" style="font-size: 16px;font-weight: 700;">
                                                                ${dd.title}
                                                            </div>
                                                            <div class="flex-fill"></div>
                                                        </div>
                                                        <div class="" style="color: #393939;font-weight: 400;">${(orderData.orderData.user_info as any)[dd.key]}</div>`
                                                                }).join('')}

                                                            </div>
                                                        `)
                                                    } else {
                                                        return ``
                                                    }
                                                })()}


                                            </div>
                                        </div> `,
                                    1200
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

                                            writeEdit(origData, orderData)
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
                                                    gvc.notifyDataChange(mainViewID)
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
            }, divCreate: {}
        })

    }

    public static createOrder(gvc: GVC, vm: any) {
        const glitter = gvc.glitter;

        class OrderDetail {
            subtotal: number;
            shipment: number;
            discount: number;
            rebate: number;
            cart_token: string;
            tag: 'manual';
            voucher: VoucherData;
            lineItems: {
                id: number;
                spec: string[];
                count: number;
                sale_price: number;
                sku: string
            }[];
            customer_info: {
                name: string;
                email: string;
                phone: string;
            };
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
                note: string;
            };
            pay_status: any;

            constructor(subtotal: number, shipment: number) {
                this.subtotal = subtotal;
                this.discount = 0;
                this.rebate = 0;
                this.shipment = shipment;
                this.cart_token = "";
                this.lineItems = [];
                this.voucher = newVoucher;
                this.tag = "manual";
                this.user_info = {
                    CVSAddress: "",
                    CVSStoreID: "",
                    CVSStoreName: "",
                    CVSTelephone: "",
                    MerchantTradeNo: "",
                    address: "",
                    email: "",
                    name: "",
                    note: "",
                    phone: "",
                    shipment: 'normal',
                };
                this.customer_info = {
                    name: "",
                    phone: "",
                    email: ""
                };
                this.pay_status = 1
            }

            get total(): number {
                return this.subtotal + this.shipment - this.discount;
            }
        }

        let newVoucher: VoucherData;
        let shipmentFree = false;
        let newOrder: any = {
            id: glitter.getUUID(),
            productArray: [],
            productCheck: [],
            productTemp: [],
            orderProductArray: [],
            orderString: '',
            query: '',
        };
        newVoucher = {
            id: 0,
            discount_total: 0,
            end_ISO_Date: "",
            for: "all",
            forKey: [],
            method: "fixed",
            overlay: false,
            reBackType: "rebate",
            rebate_total: 0,
            rule: "min_price",
            ruleValue: 0,
            startDate: "",
            startTime: "",
            start_ISO_Date: "",
            status: 1,
            target: "",
            targetList: [],
            title: "",
            trigger: "auto",
            type: "voucher",
            value: 0,


        };


        let orderDetail = new OrderDetail(0, 0);
        let showDiscountEdit = true;
        let showArray: any = [
            {
                value: "discount",
                text: "折扣活動",
            },
            {
                value: "rebate",
                text: "購物金活動",
            },
            //  todo 設計中
            // {
            //     value : "add-on",
            //     text : "加價購活動",
            // },
            // {
            //     value : "giveaway",
            //     text : "贈品活動",
            // },
            {
                value: "shipment_free",
                text: "免運費活動",
            },
        ]
        // 用在優惠卷資訊
        let tempData: {
            title: string,
            reBackType: "discount" | "rebate" | "shipment_free",
            method: 'percent' | 'fixed',
            value: string,
            discount: number;
        } = {
            title: "",
            reBackType: "discount",
            method: 'percent',
            value: "",

            discount: 0,
        }

        let customerData: {
            receiver: any;
            sameCustomer: boolean;
            pageType: string;
            customer: any;
            type: "auto" | "manual",
            info: any
        } = {
            sameCustomer: false,
            pageType: 'none',
            type: "auto",
            customer: [],
            info: {},
            receiver: {}
        }
        // 顧客資料的暫時資料
        let tempUserData: any = {
            "auto": {},
            "manual": {}
        }
        let orderDetailRefresh = false

        //     todo 選擇門市
        //點擊選擇取貨門市之後 回傳門市資訊
        function selectCVS(cvsCode:string) {
            // UNIMARTC2C: `7-11`,
            // FAMIC2C: `全家`,
            // HILIFEC2C: `萊爾富`,
            // OKMARTC2C: `OK`
            let fakeData = {
                "CVSAddress": "桃園市八德區中山一路116號",
                "CVSStoreID": "256933",
                "CVSStoreName": "八德仁貴門市",
                "CVSTelephone": ""
            }

            orderDetail.user_info.CVSAddress = fakeData.CVSAddress
            orderDetail.user_info.CVSStoreID = fakeData.CVSStoreID
            orderDetail.user_info.CVSStoreName = fakeData.CVSStoreName
            orderDetail.user_info.CVSTelephone = fakeData.CVSTelephone
            gvc.notifyDataChange('CVSStore');
        }

        // 計算優惠金的總扣除額 運費資訊 還有點擊和完成折扣填值之後所顯示的前端頁面
        function showOrderDetail() {
            function showDiscount(): { left: string, right: string } {
                shipmentFree = false;

                let leftHTML = (newVoucher.title) ? html`
                            <div>折扣</div>
                            <div style="font-size: 14px;color:#8D8D8D;font-weight: 400;">${newVoucher.title}
                            </div>
                    `
                    : `折扣`
                let rightTitle = '新增折扣'
                shipmentFree = newVoucher.reBackType == "shipment_free"

                //整理總扣除額 還有折扣輸入時 所有折扣都是以value 並沒有區分 這邊也要拆分開
                if (newVoucher.value) {
                    if (newVoucher.reBackType == "discount") {
                        if (newVoucher.method == "percent") {
                            // 原本寫在discount_total的是折扣折數 要把總額算完再放回來全部的折扣金額
                            newVoucher.discount_total = Math.round(orderDetail.subtotal * (newVoucher.value) * 0.01);

                        } else {
                            // 當折扣超出消費金額時 要以消費金額為基準
                            newVoucher.discount_total = Math.min(orderDetail.subtotal, newVoucher.value);

                        }
                        orderDetail.rebate = 0
                        newVoucher.rebate_total = 0;

                        orderDetail.discount = newVoucher.discount_total;
                        rightTitle = `-${orderDetail.discount}`
                    }
                    if (newVoucher.reBackType == "rebate") {
                        rightTitle = `獲得購物金`

                        if (newVoucher.method == "fixed") {
                            orderDetail.rebate = Math.min(newVoucher.value, orderDetail.subtotal);

                            newVoucher.rebate_total = Number(orderDetail.rebate);
                            orderDetail.rebate = newVoucher.value
                        } else {
                            // 原本寫在discount_total的是回饋趴數 要把總額算完再放回來全部的回饋額
                            newVoucher.rebate_total = Math.round(orderDetail.subtotal * (newVoucher.value) * 0.01);
                        }
                        newVoucher.discount_total = 0;
                        orderDetail.discount = 0

                        orderDetail.rebate = newVoucher.rebate_total;
                    }

                }
                let rightHTML = html`
                    <div style="color: #4D86DB;position: relative;">
                        <div class=" " style="cursor: pointer;width:158px;text-align: right"
                             onclick="${gvc.event(() => {
                                 showDiscountEdit = !showDiscountEdit;
                                 gvc.notifyDataChange('orderDetail')
                             })}">${rightTitle}
                        </div>
                        <!--                                        新增折扣點擊後展開位子-->
                        ${(showDiscountEdit) ? `` : gvc.bindView({
                            bind: `editDiscount`,
                            view: () => {

                                let discountHTML = ``;
                                let checkBox = html`
                                    <div style="margin-right:6px;display: flex;width: 16px;height: 16px;justify-content: center;align-items: center;border-radius: 20px;border: 4px solid #393939"></div>`
                                let uncheckBox = html`
                                    <div style="margin-right:6px;width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`
                                showArray.map((rowData: any, index: number) => {

                                    if (rowData.select) {
                                        function drawVoucherDetail(rowData: any) {
                                            switch (rowData.value) {
                                                case "rebate":
                                                case "discount": {
                                                    return html`
                                                        <div class="w-100 d-flex"
                                                             style="padding-left: 8px;margin-top: 8px;">
                                                            <div style="height: 100%;width:1px;background-color: #E5E5E5;margin-right: 14px;"></div>
                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;flex: 1 0 0;">
                                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;align-self: stretch;">
                                                                    <div style="display: flex;align-items: center;gap: 6px;"
                                                                         onclick="${gvc.event(() => {

                                                                             rowData.method = "percent";
                                                                             tempData.method = "percent";
                                                                             gvc.notifyDataChange('editDiscount');
                                                                         })}">
                                                                        ${(rowData.method == "percent") ? checkBox : uncheckBox}
                                                                        百分比
                                                                    </div>
                                                                    <div style="${(rowData.method == "percent") ? 'display: flex' : 'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="2" height="40"
                                                                             viewBox="0 0 2 40"
                                                                             fill="none">
                                                                            <path d="M1 0V40"
                                                                                  stroke="#E5E5E5"/>
                                                                        </svg>
                                                                        <input class="w-100"
                                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                                               type="number"
                                                                               max="100"
                                                                               min="1"
                                                                               value="${rowData.discount}"
                                                                               onchange="${gvc.event((e) => {
                                                                                   e.value = Math.min(e.value, 100)
                                                                                   rowData.discount = e.value;
                                                                                   tempData.discount = e.value;
                                                                               })}">
                                                                        <div class="h-100 d-flex align-items-center"
                                                                             style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;">
                                                                            %
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style="display: flex;gap: 6px;flex-direction: column;width: 100%;">
                                                                    <div style="display: flex;align-items: center;gap: 6px;"
                                                                         onclick="${gvc.event(() => {
                                                                             rowData.method = "fixed";
                                                                             tempData.method = "fixed";
                                                                             gvc.notifyDataChange('editDiscount')
                                                                         })}">
                                                                        ${(rowData.method == "fixed") ? checkBox : uncheckBox}
                                                                        固定金額
                                                                    </div>
                                                                    <div style="${(rowData.method == "fixed") ? 'display: flex' : 'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="2" height="40"
                                                                             viewBox="0 0 2 40"
                                                                             fill="none">
                                                                            <path d="M1 0V40"
                                                                                  stroke="#E5E5E5"/>
                                                                        </svg>
                                                                        <input class="w-100"
                                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                                               type="number"
                                                                               value="${rowData.discount}"
                                                                               min="1"
                                                                               onchange="${gvc.event((e) => {

                                                                                   rowData.discount = e.value;
                                                                                   tempData.discount = e.value;
                                                                               })}">
                                                                        <div class="h-100 d-flex align-items-center"
                                                                             style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>`
                                                }
                                                default:
                                                    return ``
                                            }
                                        }

                                        tempData.reBackType = rowData.value;
                                        discountHTML += html`
                                            <div class="w-100 d-flex align-items-center flex-wrap"
                                                 style="color:#393939">
                                                ${checkBox}
                                                <div>${rowData.text}</div>
                                                ${drawVoucherDetail(rowData)}
                                            </div>
                                        `
                                    } else {
                                        discountHTML += html`
                                            <div class="w-100 d-flex align-items-center"
                                                 style="color:#393939;cursor: pointer;"
                                                 onclick="${gvc.event(() => {
                                                     showArray = [
                                                         {
                                                             value: "discount",
                                                             text: "折扣活動",
                                                         },
                                                         {
                                                             value: "rebate",
                                                             text: "購物金活動",
                                                         },
                                                         //  todo 設計中
                                                         // {
                                                         //     value : "add-on",
                                                         //     text : "加價購活動",
                                                         // },
                                                         // {
                                                         //     value : "giveaway",
                                                         //     text : "贈品活動",
                                                         // },
                                                         {
                                                             value: "shipment_free",
                                                             text: "免運費活動",
                                                         },
                                                     ]
                                                     showArray[index].select = true;
                                                     gvc.notifyDataChange('editDiscount');
                                                 })}">
                                                ${uncheckBox}
                                                <div>${rowData.text}</div>
                                            </div>
                                        `
                                    }
                                })

                                return html`
                                    <div class="d-flex flex-column " style="font-weight: 700;">
                                        折扣名稱
                                        <input class="w-100"
                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;margin-top:12px;"
                                               value="${tempData.title ?? ''}"
                                               onchange="${gvc.event((e) => {
                                                   tempData.title = e.value;
                                               })}">
                                    </div>
                                    <div class="d-flex flex-column" style="font-weight: 700;gap:8px;">
                                        折扣方式
                                        ${discountHTML}
                                    </div>
                                    <div class="d-flex w-100 justify-content-end" style="gap:14px;">
                                        ${BgWidget.cancel(gvc.event(() => {
                                            showDiscountEdit = !showDiscountEdit;

                                            gvc.notifyDataChange('orderDetail')
                                        }), '取消')}
                                        ${BgWidget.save(gvc.event(() => {
                                            showDiscountEdit = !showDiscountEdit;
                                            newVoucher.reBackType = tempData.reBackType;
                                            newVoucher.method = tempData.method;
                                            newVoucher.value = tempData.discount;

                                            newVoucher.title = tempData.title;
                                            gvc.notifyDataChange('orderDetail')
                                        }), '確定')}
                                    </div>
                                `
                            }, divCreate: {
                                style: `display: flex;color:#393939;text-align: left;width: 348px;padding: 24px;flex-direction: column;gap: 18px;border-radius: 10px;background: #FFF;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);position:absolute;right:0;top:33px;gap:18px;z-index:3;`
                            }
                        })}
                        <div style="">
                            <div></div>
                        </div>
                    </div>
                `
                return {
                    left: leftHTML,
                    right: rightHTML
                }
            }


            return gvc.bindView({
                bind: "orderDetail",
                view: () => {
                    orderDetail.subtotal = 0
                    orderDetail.lineItems = []
                    newOrder.productCheck.map((data: any, index: number) => {
                        orderDetail.lineItems.push({
                            id: data.id,
                            spec: data.content.variants[parseInt(data.selectIndex ?? 0)].spec,
                            count: data.content.variants[parseInt(data.selectIndex ?? 0)].qty ?? 1,
                            sale_price: data.content.variants[parseInt(data.selectIndex ?? 0)].sale_price,
                            sku: data.content.variants[parseInt(data.selectIndex ?? 0)].sku
                        })
                        orderDetail.subtotal += orderDetail.lineItems[index].count * orderDetail.lineItems[index].sale_price;
                    })
                    // 取得這些商品運費
                    if (orderDetailRefresh) {
                        ApiShop.getManualCheckout({
                            line_items: orderDetail.lineItems
                        }).then(r => {
                            if (r.result) {
                                orderDetailRefresh = false;
                                orderDetail.shipment += r.response.data.shipment_fee
                                gvc.notifyDataChange('orderDetail')
                            }
                        })
                    }
                    if (newVoucher.reBackType == "shipment_free") {
                        orderDetail.shipment = 0
                    }
                    let returnHTML = ``
                    let showArray: {
                        left: string,
                        right: string | number
                    }[] = [
                        {
                            left: "小計總額",
                            right: orderDetail.subtotal
                        },
                        {
                            left: "運費",
                            right: orderDetail.shipment
                        },
                        showDiscount(),
                        // todo
                        // {
                        //     left: "額外運費 ",
                        //     right: "新增額外運費"
                        // },
                        // {
                        //     left: "手續費",
                        //     right: "新增手續費"
                        // },
                        {
                            left: "總金額",
                            right: orderDetail.total
                        }
                    ];

                    showArray.map((rowData) => {
                        returnHTML += html`
                            <div class="w-100 d-flex align-items-center justify-content-end"
                                 style="min-height: 21px;">
                                <div style="text-align: right;">${rowData.left}</div>
                                <div style="width:158px;text-align: right">${rowData.right}</div>
                            </div>
                        `
                    })
                    return returnHTML
                }, divCreate: {class: `d-flex flex-column w-100`, style: `gap:12px;`}
            })
        }

        // 防傻 避免填空訂單
        function checkOrderEmpty(passData: OrderDetail) {
            if (passData.lineItems.length < 1) {
                alert("請添加商品!");
                return false;
            }
            if (!passData.customer_info.name || !passData.customer_info.email || !passData.customer_info.phone) {
                alert("收件人資訊尚未填寫完畢!");
                return false;
            }
            if (!passData.user_info.name || !passData.user_info.email) {
                alert("顧客資訊尚未填寫完畢!");
                return false;
            }
            if (passData.user_info.shipment == "normal" && !passData.user_info.address) {
                alert("地址未填!")
                return false;
            }
            if (passData.user_info.shipment != "normal" && !passData.user_info.CVSAddress) {
                alert("超商地址未填!")
                return false
            }

            return true;

        }

        return BgWidget.container(html`
                    <!--                                標頭 --- 新增訂單標題和返回  -->
                    <div class="d-flex align-items-center" style="margin-bottom: 24px;">
                        ${BgWidget.goBack(
                                gvc.event(() => {
                                    vm.type = 'list';
                                })
                        )}
                        ${BgWidget.title('新增訂單')}
                    </div>
                    <!--                                訂單內容 --- 商品資訊-->
                    <div style="color: #393939;width: 100%;display: flex;padding: 20px;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);">
                        <div style="font-size: 16px;font-weight: 700;">訂單內容</div>
                        <div style="width: 100%;display: flex;align-items: center;padding-right: 20px;">
                            <div class="flex-fill d-flex align-items-center col-5"
                                 style="font-size: 16px;font-weight: 700;">商品
                            </div>
                            <div class="col-3 pe-lg-3"
                                 style="display: flex;align-items: flex-start;font-size: 16px;font-weight: 700;">
                                單價
                            </div>
                            <div class="col-2" style="font-size: 16px;font-weight: 700;">數量</div>
                            <div class="" style="font-size: 16px;font-weight: 700;width: 50px;text-align: right;">小計</div>
                        </div>
                        ${gvc.bindView({
                            bind: "listProduct",
                            view: () => {
                                let returnHTML = "";
                                gvc.notifyDataChange('orderDetail')
                                if (newOrder.productCheck.length) {
                                    newOrder.productCheck.map((product: any, index: number) => {
                                        let selectVariant = product.content.variants[parseInt(product.selectIndex ?? 0)];
                                        let productIMG = (typeof selectVariant.preview_image == "string") ? selectVariant.preview_image : selectVariant.preview_image[0]
                                        selectVariant.qty = selectVariant.qty || 1;
                                        returnHTML += html`
                                            <div style="width: 100%;display: flex;align-items: center;position: relative;padding-right: 20px;">
                                                <div class="flex-fill d-flex align-items-center col-5"
                                                     style="font-size: 16px;font-weight: 700;gap: 12px;">
                                                    <div style="width: 54px;height: 54px; background: url('${productIMG}') lightgray 50% / cover no-repeat;"></div>
                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;width: calc(100% - 54px);padding-right: 15px;">
                                                        <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 100%;">
                                                            ${product.content.title}
                                                        </div>
                                                        <div class="d-flex" style="gap:8px;font-weight: 400;">
                                                            ${(() => {
                                                                if (selectVariant.spec.length > 0) {
                                                                    let tempHTML = ``
                                                                    selectVariant.spec.map((spec: string) => {
                                                                        tempHTML += html`
                                                                            <div style="display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;background: #EAEAEA;">
                                                                                ${spec}
                                                                            </div>`
                                                                    })
                                                                    return tempHTML
                                                                } else {
                                                                    return html`
                                                                        <div style="display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;background: #EAEAEA;">
                                                                            單一規格
                                                                        </div>
                                                                    `
                                                                }
                                                            })()}
                                                        </div>
                                                        <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                                                            存貨單位 (SKU):
                                                            ${selectVariant.sku.length ? selectVariant.sku : "sku未指定"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-3"
                                                     style="display: flex;padding-right: 40px;align-items: flex-start;font-size: 16px;font-weight: 400;">
                                                    ${selectVariant.sale_price}
                                                </div>
                                                <div class="col-2 " style="font-size: 16px;font-weight: 700;">
                                                    <input class="" type="number" value="${selectVariant.qty}"
                                                           style="width: 70px;transform: translateX(-16px);text-align: center;display: flex;padding: 9px 18px;align-items: center;gap: 32px;border-radius: 10px;border: 1px solid #DDD;"
                                                           min="0" onchange="${gvc.event((e) => {

                                                        if (e.value < 1) {
                                                            gvc.glitter.innerDialog((gvc: GVC) => {
                                                                return html`
                                                                    <div style="display: inline-flex;padding: 36px;flex-direction: column;justify-content: center;align-items: center;gap: 24px;background-color: white;">
                                                                        <div style="display: flex;width: 420px;flex-direction: column;align-items: center;gap: 24px;">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 width="76" height="75"
                                                                                 viewBox="0 0 76 75"
                                                                                 fill="none">
                                                                                <g clip-path="url(#clip0_9021_70983)">
                                                                                    <path d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z"
                                                                                          fill="#393939"/>
                                                                                </g>
                                                                                <defs>
                                                                                    <clipPath
                                                                                            id="clip0_9021_70983">
                                                                                        <rect width="75"
                                                                                              height="75"
                                                                                              fill="white"
                                                                                              transform="translate(0.5)"/>
                                                                                    </clipPath>
                                                                                </defs>
                                                                            </svg>
                                                                            <div style="display: flex;flex-direction: column;align-items: center;gap: 8px;align-self: stretch;font-size: 16px;font-weight: 400;line-height: 160%;">
                                                                                更改數量為 0 將會刪除該商品。<br>
                                                                                確定要刪除此商品嗎？
                                                                            </div>
                                                                        </div>
                                                                        <div style="display: flex;width: 360px;align-items: center;gap: 10px;justify-content: center;">
                                                                            ${BgWidget.cancel(gvc.event(() => {
                                                                                e.value = 1;
                                                                                gvc.closeDialog()
                                                                            }))}
                                                                            ${BgWidget.save(gvc.event(() => {
                                                                                newOrder.productCheck.splice(index, 1);
                                                                            }))}
                                                                        </div>
                                                                    </div>
                                                                `
                                                            }, "delete")
                                                        } else {
                                                            selectVariant.qty = e.value;
                                                            orderDetailRefresh = true;
                                                            gvc.notifyDataChange(['listProduct', 'orderDetail'])
                                                        }
                                                    })}">
                                                </div>
                                                <div class="" style="font-size: 16px;font-weight: 400;width: 50px;text-align: right;">
                                                    ${selectVariant.sale_price * selectVariant.qty}
                                                </div>
                                                <div class="d-flex align-items-center"
                                                     style="position: absolute;right:0;top:50%;transform: translateY(-50%)"
                                                     onclick="${gvc.event(() => {
                                                         newOrder.productCheck.splice(index, 1);
                                                         gvc.notifyDataChange('listProduct');
                                                     })}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="11"
                                                         height="10" viewBox="0 0 11 10" fill="none">
                                                        <path d="M1.51367 9.24219L9.99895 0.756906"
                                                              stroke="#DDDDDD" stroke-width="1.3"
                                                              stroke-linecap="round"/>
                                                        <path d="M9.99805 9.24219L1.51276 0.756907"
                                                              stroke="#DDDDDD" stroke-width="1.3"
                                                              stroke-linecap="round"/>
                                                    </svg>
                                                </div>
                                            </div>
       `
                                    })

                                }
                                return returnHTML
                            },
                            divCreate: {
                                style: `display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;`,
                                class: ``
                            }
                        })}
                        ${gvc.bindView({
                            bind: "addProduct",
                            view: () => {
                                return html`
                                    <div class="w-100 d-flex justify-content-center align-items-center"
                                         style="color: #36B;" onclick="${gvc.event(() => {
                                        gvc.glitter.innerDialog((gvc: GVC) => {
                                            newOrder.query = "";
                                            newOrder.search = "";
                                            newOrder.productArray = [];
                                            return gvc.bindView({
                                                bind: "addDialog",
                                                dataList: [{obj: newOrder, key: 'productArray'}],
                                                view: () => {
                                                    let width = (window.innerWidth > 1000) ? 690 : 350;
                                                    if (newOrder.productArray.length == 0) {
                                                        ApiShop.getProduct({
                                                            page: 0,
                                                            limit: 20,
                                                            search: newOrder.query,
                                                            orderBy: newOrder.orderString
                                                        }).then((data) => {

                                                            newOrder.productArray = data.response.data;
                                                            gvc.notifyDataChange('addDialog')
                                                        });
                                                    }

                                                    return html`
                                                        <div style="display: flex;width: ${width}px;padding-bottom: 24px;flex-direction: column;align-items: flex-start;gap: 24px;border-radius: 10px;background: #FFF;">
                                                            <div class="w-100"
                                                                 style="display: flex;height: 46px;padding: 12px 0 12px 20px;align-items: center;align-self: stretch;color: #393939;font-size: 16px;font-weight: 700;">
                                                                搜尋商品
                                                            </div>
                                                            <div class="w-100"
                                                                 style="display: flex;flex-direction: column;align-items: flex-start;gap: 42px;">
                                                                <div class="w-100"
                                                                     style="display: flex;padding: 0px 20px;flex-direction: column;align-items: center;gap: 18px;">
                                                                    <div style="display: flex;justify-content: center;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                                        ${BgWidget.searchFilter(
                                                                                gvc.event((e, event) => {
                                                                                    newOrder.query = e.value;
                                                                                    newOrder.productArray = [];

                                                                                    gvc.notifyDataChange("addOrder");
                                                                                }),
                                                                                newOrder.query || '',
                                                                                '輸入商品名稱或商品貨號'
                                                                        )}
                                                                        ${BgWidget.updownFilter({
                                                                            gvc,
                                                                            callback: (value: any) => {
                                                                                newOrder.orderString = value;
                                                                                newOrder.productArray = [];

                                                                                gvc.notifyDataChange("addOrder");
                                                                            },
                                                                            default: newOrder.orderString || 'default',
                                                                            options: FilterOptions.productOrderBy,
                                                                        })}
                                                                    </div>
                                                                    <div class=""
                                                                         style="height:350px;display: flex;justify-content: center;align-items: flex-start;padding-right: 24px;align-self: stretch;overflow-y: scroll;">
                                                                        ${(() => {
                                                                            let returnHTML = ``;
                                                                            newOrder.productArray.map((product: any, productIndex: number) => {
                                                                                returnHTML += gvc.bindView({
                                                                                    bind: `product${productIndex}`,
                                                                                    view: () => {
                                                                                        return html`
                                                                                            ${(() => {
                                                                                                if (product.select) {
                                                                                                    return html`
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                                                             width="16"
                                                                                                             height="16"
                                                                                                             viewBox="0 0 16 16"
                                                                                                             fill="none"
                                                                                                             onclick="${gvc.event(() => {
                                                                                                                 product.select = false;
                                                                                                                 gvc.notifyDataChange(`product${productIndex}`);
                                                                                                             })}">
                                                                                                            <rect width="16"
                                                                                                                  height="16"
                                                                                                                  rx="3"
                                                                                                                  fill="#393939"/>
                                                                                                            <path d="M4.5 8.5L7 11L11.5 5"
                                                                                                                  stroke="white"
                                                                                                                  stroke-width="2"
                                                                                                                  stroke-linecap="round"
                                                                                                                  stroke-linejoin="round"/>
                                                                                                        </svg>`
                                                                                                } else {
                                                                                                    return html`
                                                                                                        <div style="display: flex;align-items: center;justify-content: center;height: 60px;width: 16px;cursor: pointer;"
                                                                                                             onclick="${gvc.event(() => {
                                                                                                                 product.select = true;
                                                                                                                 (document.querySelector('.varitantSelect') as HTMLInputElement)!.value;
                                                                                                                 if (product.content.variants.length > 1) {
                                                                                                                     product.selectIndex = (document.querySelector('.varitantSelect') as HTMLInputElement).value;
                                                                                                                 }
                                                                                                                 gvc.notifyDataChange(`product${productIndex}`);
                                                                                                             })}">
                                                                                                            <div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;"></div>
                                                                                                        </div>
                                                                                                    `
                                                                                                }
                                                                                            })()}
                                                                                            <div style="width: 50px;height: 50px;border-radius: 5px;background: url('${product.content.preview_image[0]}') lightgray 50% / cover no-repeat;"></div>
                                                                                            <div class="flex-fill d-flex flex-column">
                                                                                                <div style="color:#393939;font-size: 14px;font-weight: 400;margin-bottom: 4px;">
                                                                                                    ${product.content.title}
                                                                                                </div>
                                                                                                ${(() => {
                                                                                                    if (product.content.variants.length > 1) {
                                                                                                        return html`
                                                                                                            <select class="w-100 d-flex align-items-center form-select varitantSelect"
                                                                                                                    style="border-radius: 10px;border: 1px solid #DDD;padding: 6px 18px;">
                                                                                                                ${(() => {
                                                                                                                    let optionHTML = ``
                                                                                                                    product.content.variants.map((variant: any, index: number) => {
                                                                                                                        optionHTML += html`
                                                                                                                            <option value="${index}"
                                                                                                                                    ${(() => {
                                                                                                                                        if (product.selectIndex == index) return `selected`; else return ``;
                                                                                                                                    })()}>
                                                                                                                                ${variant.spec.join(", ")}
                                                                                                                            </option>
                                                                                                                        `
                                                                                                                    })
                                                                                                                    return optionHTML
                                                                                                                })()}
                                                                                                            </select>
                                                                                                        `;
                                                                                                    } else {
                                                                                                        return `<div class="d-flex align-items-center" style="height: 34px;color: #8D8D8D;font-size: 14px;font-weight: 400;">單一規格</div>`
                                                                                                    }
                                                                                                })()}
                                                                                            </div>
                                                                                        `
                                                                                    },
                                                                                    divCreate: {style: `display: flex;padding: 0px 12px;align-items: center;gap: 18px;align-self: stretch;`}
                                                                                })
                                                                            })
                                                                            return html`
                                                                                <div class="d-flex flex-column"
                                                                                     style="gap: 18px;width:100%;">
                                                                                    ${returnHTML}
                                                                                </div>
                                                                            `
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                                <div class="w-100"
                                                                     style="display: flex;padding: 0px 20px;align-items: center;justify-content: end;gap: 10px;">
                                                                    ${BgWidget.cancel(gvc.event(() => {
                                                                        gvc.closeDialog()
                                                                    }), "取消")}
                                                                    ${BgWidget.save(gvc.event(() => {
                                                                        newOrder.productTemp = [];

                                                                        newOrder.productArray.map((product: any) => {
                                                                            if (product.select) {
                                                                                newOrder.productTemp.push(product);
                                                                            }
                                                                        })

                                                                        gvc.closeDialog()

                                                                    }))}
                                                                </div>
                                                            </div>
                                                        </div>`
                                                }, divCreate: {}
                                            })

                                        }, 'addProduct', {
                                            dismiss: () => {
                                                orderDetailRefresh = true;
                                                if (newOrder.productCheck.length > 0) {
                                                    const updateProductCheck = (tempData: any) => {
                                                        const productData = newOrder.productCheck.find((p: any) =>
                                                                p.id === tempData.id && p.selectIndex === tempData.selectIndex
                                                        );

                                                        if (productData) {
                                                            const index = parseInt(productData.selectIndex ?? "0", 10);
                                                            productData.content.variants[index].qty++;
                                                            tempData.add = true;
                                                        } else {
                                                            newOrder.productCheck.push(tempData);
                                                        }
                                                    };

                                                    newOrder.productTemp.forEach(updateProductCheck);

                                                } else {
                                                    newOrder.productCheck = newOrder.productTemp;
                                                }


                                                gvc.notifyDataChange(['listProduct', 'addProduct']);
                                            }
                                        });
                                    })}">新增一個商品
                                        <svg style="margin-left: 5px;" xmlns="http://www.w3.org/2000/svg"
                                             width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M1.5 7.23926H12.5" stroke="#3366BB" stroke-width="2"
                                                  stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M6.76172 1.5L6.76172 12.5" stroke="#3366BB"
                                                  stroke-width="2" stroke-linecap="round"
                                                  stroke-linejoin="round"/>
                                        </svg>
                                    </div>

                                `
                            },
                            divCreate: {
                                style: `width: 100%;display: flex;align-items: center;margin:24px 0;cursor: pointer;`,
                                class: ``
                            }
                        })}
                        <div style="width:100%;height: 1px;background-color:#DDD;margin-bottom:24px;"></div>
                        ${showOrderDetail()}
                    </div>
                    <!--                                選擇顧客 --- 顧客資料填寫-->
                    <div style="margin-top: 24px"></div>
                    ${BgWidget.mainCard(gvc.bindView({
                        bind: 'userBlock',
                        dataList: [{obj: customerData, key: "type"}],
                        view: () => {
                            customerData.info.searchable = true;
                            let checkBox = html`
                                <div style="display: flex;width: 16px;height: 16px;justify-content: center;align-items: center;border-radius: 20px;border: solid 4px #393939"></div>`
                            let uncheckBox = html`
                                <div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`

                            function syncUserData() {
                                orderDetail.user_info.name = tempUserData[customerData.type].name;
                                orderDetail.user_info.phone = tempUserData[customerData.type].phone;
                                orderDetail.user_info.email = tempUserData[customerData.type].email;
                            }

                            syncUserData();

                            return html`
                                <div style="font-size: 16px;font-weight: 700;">
                                    顧客資料
                                </div>
                                <div class="d-flex  flex-column" style="">
                                    ${customerData.type == "auto"
                                            ? html`
                                                <div class="d-flex align-items-center" style="cursor: pointer;">
                                                    ${checkBox}
                                                    <div style="margin-left: 6px">現有的顧客</div>
                                                </div>
                                                <div class="d-flex align-items-center position-relative"
                                                     style="min-height:40px;padding-left: 22px;margin-top: 8px;">
                                                    <div style="height: 100%;width:1px;background-color: #E5E5E5;position: absolute;left: 8px;top: 0;"></div>
                                                    <div class="position-relative w-100 d-flex flex-column">
                                                        <input class="w-100 searchInput"
                                                               placeholder="搜尋現有顧客"
                                                               value="${customerData.info.search ?? ''}"
                                                               style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                               onkeyup="${gvc.event((e) => {
                                                                   if (customerData.info.searchable) {
                                                                       customerData.info.searchable = false
                                                                       customerData.info.search = e.value
                                                                       ApiUser.getUserList({
                                                                           limit: 100,
                                                                           page: 0,
                                                                           search: e.value
                                                                       }).then((r: any) => {

                                                                           customerData.info.searchResponse = r;
                                                                           customerData.pageType = 'select';
                                                                       })
                                                                       setTimeout(() => {
                                                                           customerData.info.searchable = true

                                                                       }, 100)
                                                                   }

                                                               })}">
                                                        ${gvc.bindView({
                                                            bind: `accountSelect`,
                                                            dataList: [{obj: customerData, key: 'pageType'}],
                                                            view: () => {
                                                                switch (customerData.pageType) {
                                                                    case "select": {
                                                                        let rowData: any = undefined
                                                                        if (customerData.info.searchResponse) {
                                                                            rowData = customerData.info.searchResponse.response.data;
                                                                        } else {
                                                                            return ``
                                                                        }

                                                                        let selectHTML = ``
                                                                        rowData.map((data: any) => {
                                                                            selectHTML += html`
                                                                                <div class="w-100"
                                                                                     style="cursor: pointer;"
                                                                                     onclick="${gvc.event(() => {
                                                                                         tempUserData[customerData.type] = data;

                                                                                         orderDetail.user_info.name = data.userData.name;
                                                                                         orderDetail.user_info.phone = data.phone;
                                                                                         orderDetail.user_info.email = data.account;
                                                                                         customerData.pageType = "check";
                                                                                         (document.querySelector(`.searchInput`) as HTMLInputElement).value = `${data.userData.name ?? "uname"}(${data.account ?? "unknown email"})`;
                                                                                     })}">
                                                                                    ${data.userData.name ?? "uname"}
                                                                                        (${data.account ?? "unknown email"}
                                                                                    )
                                                                                </div>
                                                                            `
                                                                        })
                                                                        return html`
                                                                            <div class="w-100 d-flex flex-column"
                                                                                 style="gap:12px;position: absolute;right: 0; top: calc(100% + 12px);background-color: white;padding: 24px;flex-direction: column;justify-content: center;align-items: flex-start;border-radius: 10px;border: 1px solid #DDD;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);">
                                                                                ${selectHTML}
                                                                            </div>
                                                                        `
                                                                    }
                                                                    case "check": {
                                                                        return html`
                                                                            <div>姓名</div>
                                                                            <div class="w-100"
                                                                                 style="border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;padding: 9px 18px;">
                                                                                ${tempUserData[customerData.type].userData.name ?? "uname"}
                                                                            </div>
                                                                            <div>電子信箱</div>
                                                                            <div class="w-100"
                                                                                 style="border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;padding: 9px 18px;">
                                                                                ${tempUserData[customerData.type].account ?? "unknown email"}
                                                                            </div>
                                                                            <div>電話</div>
                                                                            <div class="w-100"
                                                                                 style="min-height:45px;border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;padding: 9px 18px;">
                                                                                ${tempUserData[customerData.type].phone ?? ""}
                                                                            </div>
                                                                        `
                                                                    }
                                                                    case undefined :
                                                                    case 'none': {
                                                                        return ``
                                                                    }

                                                                }
                                                                return ``
                                                            }, divCreate: {}
                                                        })}

                                                    </div>
                                                </div>
                                            `
                                            : html`
                                                <div class="d-flex align-items-center"
                                                     style="margin-bottom: 12px;cursor: pointer;"
                                                     onclick="${gvc.event(() => {
                                                         if (customerData.type == "manual") {
                                                             orderDetail.user_info = {
                                                                 CVSAddress: "",
                                                                 CVSStoreID: "",
                                                                 CVSStoreName: "",
                                                                 CVSTelephone: "",
                                                                 MerchantTradeNo: "",
                                                                 address: "",
                                                                 email: "",
                                                                 name: "",
                                                                 note: "",
                                                                 phone: "",
                                                                 shipment: 'normal',
                                                             };

                                                         }

                                                         customerData.type = "auto"
                                                         customerData.sameCustomer = false;
                                                         gvc.notifyDataChange('setLogistics');
                                                     })}">${uncheckBox}
                                                    <div style="margin-left: 6px">現有的顧客</div>
                                                </div>`
                                    }
                                    ${customerData.type == "manual"
                                            ? html`
                                                <div class="d-flex align-items-center" style="cursor: pointer;">
                                                    ${checkBox}
                                                    <div style="margin-left: 6px">手動加入顧客</div>
                                                </div>
                                                <div class="d-flex align-items-center position-relative"
                                                     style="min-height:40px;padding-left: 22px;margin-top: 8px;">
                                                    <div style="height: 100%;width:1px;background-color: #E5E5E5;position: absolute;left: 8px;top: 0;"></div>
                                                    <div class="position-relative w-100 d-flex flex-column"
                                                         style="gap:8px;">
                                                        <div>姓名</div>
                                                        <input class="w-100"
                                                               value="${orderDetail.user_info.name ?? ''}"
                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                               placeholder="請輸入姓名"
                                                               onchange="${gvc.event((e) => {
                                                                   tempUserData[customerData.type].name = e.value;
                                                                   orderDetail.user_info.name = e.value;
                                                               })}">
                                                        <div>電話</div>
                                                        <input class="w-100"
                                                               value="${orderDetail.user_info.phone ?? ''}"
                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                               placeholder="請輸入電話"
                                                               onchange="${gvc.event((e) => {
                                                                   tempUserData[customerData.type].phone = e.value;
                                                                   orderDetail.user_info.phone = e.value;
                                                               })}">
                                                        <div>電子信箱</div>
                                                        <input class="w-100"
                                                               value="${orderDetail.user_info.email ?? ''}"
                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                               placeholder="請輸入電子信箱，同時會註冊暫時會員"
                                                               onchange="${gvc.event((e) => {
                                                                   tempUserData[customerData.type].email = e.value;
                                                                   ApiUser.getEmailCount(e.value).then(r => {
                                                                       if (r.response.result) {
                                                                           alert("信箱已經被註冊")
                                                                           orderDetail.user_info.email = "";
                                                                           e.value = ""
                                                                       }
                                                                   })
                                                                   orderDetail.user_info.email = e.value;
                                                               })}">
                                                    </div>
                                                </div>
                                            `
                                            : html`
                                                <div class="d-flex align-items-center"
                                                     style="margin-top: 12px;cursor: pointer;"
                                                     onclick="${gvc.event(() => {
                                                         if (customerData.type == "auto") {
                                                             orderDetail.user_info = {
                                                                 CVSAddress: "",
                                                                 CVSStoreID: "",
                                                                 CVSStoreName: "",
                                                                 CVSTelephone: "",
                                                                 MerchantTradeNo: "",
                                                                 address: "",
                                                                 email: "",
                                                                 name: "",
                                                                 note: "",
                                                                 phone: "",
                                                                 shipment: 'normal',
                                                             };
                                                         }

                                                         customerData.type = "manual"
                                                         customerData.sameCustomer = false;

                                                         gvc.notifyDataChange(['setLogistics']);
                                                     })}">${uncheckBox}
                                                    <div style="margin-left: 6px;">手動加入顧客</div>
                                                </div>`
                                    }
                                </div>



                            `
                        }, divCreate: {class: `d-flex flex-column`, style: `gap:18px;`}
                    }))}
                    <!--                                設定金物流 --- 顧客運送資料和付款方式-->
                    <div style="margin-top: 24px"></div>
                    ${BgWidget.mainCard(gvc.bindView({
                        bind: "setLogistics",
                        view: () => {
                            return html`
                                <div style="font-weight: 700;">設定金物流</div>
                                <div class="d-flex flex-column" style="gap: 18px">
                                    <div class="d-flex align-items-center w-100" style="gap:18px;">
                                        <div class="d-flex flex-column flex-fill" style="gap: 8px;">
                                            <div>付款方式和付款狀態</div>
                                            <select class="form-select"
                                                style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;" onchange="${gvc.event((e)=>{
                                                orderDetail.pay_status = e.value;                                                      
                                            })}">
                                                <option value="1" ${(orderDetail.pay_status == 1)?'selected':''}>線下付款-已付款</option>
                                                <option value="0" ${(orderDetail.pay_status == 0)?'selected':''}>線下付款-未付款</option>
                                            </select>
                                        </div>
                                        <div class="d-flex flex-column flex-fill" style="gap: 8px;">
                                            <div>運送方法</div>
                                            <select class="form-select"
                                                    style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                    onchange="${gvc.event((e) => {
                                                        orderDetail.user_info!.shipment = e.value;
                                                    })}">
                                                <option value="normal" ${(orderDetail.user_info!.shipment  == 'normal')?'selected':''}>宅配</option>
                                                <option value="UNIMARTC2C" ${(orderDetail.user_info!.shipment  == 'UNIMARTC2C')?'selected':''}>7-11店到店</option>
                                                <option value="FAMIC2C" ${(orderDetail.user_info!.shipment  == 'FAMIC2C')?'selected':''}>全家店到店</option>
                                                <option value="OKMARTC2C" ${(orderDetail.user_info!.shipment  == 'OKMARTC2C')?'selected':''}>OK店到店</option>
                                                <option value="HILIFEC2C" ${(orderDetail.user_info!.shipment  == 'HILIFEC2C')?'selected':''}>萊爾富店到店</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style="font-size: 16px;font-weight: 700;">收件人資料</div>
                                    <div class="d-flex align-items-center" style="gap:6px;cursor: pointer;"
                                         onclick="${gvc.event(() => {
                                             customerData.sameCustomer = !customerData.sameCustomer;
                                             if (customerData.sameCustomer && !orderDetail.user_info?.email) {
                                                 alert("顧客資料沒填")
                                                 customerData.sameCustomer = !customerData.sameCustomer;
                                             }
                                             if (customerData.sameCustomer) {
                                                 orderDetail.customer_info.name = orderDetail.user_info.name;
                                                 orderDetail.customer_info.phone = orderDetail.user_info.phone;
                                                 orderDetail.customer_info.email = orderDetail.user_info.email;
                                             }
                                             gvc.notifyDataChange('setLogistics')
                                         })}">
                                        ${customerData.sameCustomer
                                                ? html`
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                         height="16" viewBox="0 0 16 16" fill="none">
                                                        <rect width="16" height="16" rx="3" fill="#393939"/>
                                                        <path d="M4.5 8.5L7 11L11.5 5" stroke="white"
                                                              stroke-width="2" stroke-linecap="round"
                                                              stroke-linejoin="round"/>
                                                    </svg>`
                                                : html`
                                                    <div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;"></div>`}
                                        同顧客資料
                                    </div>
                                    <div class="d-flex flex-column" style="gap: 8px">
                                        <div>姓名</div>
                                        <input style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                               value="${orderDetail.customer_info.name ?? ""}"
                                               placeholder="請輸入姓名" onchange="${gvc.event((e) => {
                                            orderDetail.customer_info.name = e.value
                                        })}" ${customerData.sameCustomer ? 'disabled' : ''}>
                                    </div>
                                    <div class="d-flex flex-column" style="gap: 8px">
                                        <div>電話</div>
                                        <input style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                               value="${orderDetail.customer_info.phone ?? ""}"
                                               placeholder="請輸入電話" onchange="${gvc.event((e) => {
                                            orderDetail.customer_info.phone = e.value
                                        })}">
                                    </div>
                                    <div class="d-flex flex-column" style="gap: 8px">
                                        <div>電子信箱</div>
                                        <input style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                               value="${orderDetail.customer_info.email ?? ""}"
                                               placeholder="請輸入電子信箱" onchange="${gvc.event((e) => {
                                            orderDetail.customer_info.email = e.value
                                        })}" ${customerData.sameCustomer ? 'disabled' : ''}>
                                    </div>
                                    <div class="d-flex flex-column" style="gap: 8px">
                                        ${gvc.bindView({
                                            bind: "CVSStore",
                                            dataList: [{obj: orderDetail.user_info, key: "shipment"}],
                                            view: () => {
                                                switch (orderDetail.user_info?.shipment) {
                                                    case "normal": {
                                                        return html`
                                                            <div>宅配地址</div>
                                                            <input style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;margin-top:8px;width: 100%;"
                                                                   value="${orderDetail.user_info!.address ?? ""}"
                                                                   placeholder="請輸入宅配地址"
                                                                   onchange="${gvc.event((e) => {
                                                                       orderDetail.user_info!.address = e.value;
                                                                   })}">
                                                        `
                                                    }
                                                    default: {
                                                        let returnHTML = ``
                                                        if (orderDetail.user_info!.CVSStoreID) {
                                                            let icon = {
                                                                UNIMARTC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734544575-34f72af5b441738b1f65a0597c28d9cf%20(1).png`,
                                                                FAMIC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734396302-e970be63c9acb23e41cf80c77b7ca35b.jpeg`,
                                                                HILIFEC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734423037-6e2664ad52332c40b4106868ada74646.png`,
                                                                OKMARTC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734510490-beb1c70f9e168b7bab198ea2bf226148.png`
                                                            }
                                                            returnHTML = html`
                                                                <div class="d-flex flex-column">
                                                                    <div class="d-flex align-items-center">
                                                                        <img style="width: 32px;height: 32px;margin-right: 8px;"
                                                                             src="${icon[orderDetail.user_info.shipment]}"
                                                                             alt="icon">
                                                                        <div style="color:#4D86DB" onclick="${gvc.event(() => {
                                                                            selectCVS(orderDetail.user_info.shipment)
                                                                        })}">
                                                                            點擊更換門市
                                                                        </div>
                                                                    </div>
                                                                    <div class="d-flex">
                                                                        門市名稱:
                                                                        ${orderDetail.user_info.CVSStoreName}
                                                                    </div>
                                                                    <div class="d-flex">
                                                                        門市店號:
                                                                        ${orderDetail.user_info.CVSStoreID}
                                                                    </div>
                                                                    <div class="d-flex">
                                                                        門市地址:
                                                                        ${orderDetail.user_info.CVSAddress}
                                                                    </div>
                                                                </div>
                                                            `
                                                            return html`
                                                                <div>取貨門市</div>
                                                                ${returnHTML}
                                                            `
                                                        } else {
                                                            return html`
                                                                <div>取貨門市</div>
                                                                <div style="color: #4D86DB;cursor: pointer;margin-top:8px;cursor: pointer"
                                                                     onclick="${gvc.event(() => {
                                                                         selectCVS(orderDetail.user_info.shipment)
                                                                     })}">請選擇取貨門市
                                                                </div>
                                                            `
                                                        }

                                                    }
                                                }

                                            }, divCreate: {}
                                        })}
                                    </div>


                                </div>
                            `
                        }, divCreate: {class: `d-flex flex-column`, style: `color:#393939;gap:18px;`},
                    }))}
                    <div style="margin-top: 24px"></div>
                    ${BgWidget.mainCard(html`
                        <div class="d-flex flex-column" style="gap: 8px">
                            <div>訂單備註</div>
                            <textarea
                                    style="cursor: pointer;;height: 80px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                    onchange="${gvc.event((e) => {
                                        orderDetail.user_info!.note = e.value;
                                    })}"></textarea>
                        </div>
                    `)}

                    ${BgWidget.mb240()}
                    <div class="d-flex position-fixed w-100 justify-content-end"
                         style="padding: 14px 16px;bottom: 0;right: 0;background: #FFF;box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);gap:14px;">
                        ${BgWidget.cancel(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                        ${BgWidget.save(gvc.event(() => {
                            let passData = JSON.parse(JSON.stringify(orderDetail))
                           
                            passData.total = orderDetail.total;
                            passData.orderStatus = 1;

                            delete passData.tag
                            const dialog = new ShareDialog(glitter);
                            
                            dialog.dataLoading({visible:true})
                            if (checkOrderEmpty(passData)) {
                                ApiShop.toManualCheckout(passData).then(r => {
                                    dialog.dataLoading({visible:false})
                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                        return html`
                                            <div style="position: relative;width: 492px;height: 223px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;align-items: center;justify-content: center;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                     viewBox="0 0 14 14" fill="none"
                                                     style="position: absolute;top: 12px;right: 12px;cursor: pointer;"
                                                     onclick="${gvc.event(() => {
                                                         gvc.glitter.closeDiaLog();
                                                     })}">
                                                    <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round"/>
                                                    <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round"/>
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75"
                                                     viewBox="0 0 75 75" fill="none">
                                                    <g clip-path="url(#clip0_9850_171427)">
                                                        <path d="M37.5 7.03125C45.5808 7.03125 53.3307 10.2413 59.0447 15.9553C64.7587 21.6693 67.9688 29.4192 67.9688 37.5C67.9688 45.5808 64.7587 53.3307 59.0447 59.0447C53.3307 64.7587 45.5808 67.9688 37.5 67.9688C29.4192 67.9688 21.6693 64.7587 15.9553 59.0447C10.2413 53.3307 7.03125 45.5808 7.03125 37.5C7.03125 29.4192 10.2413 21.6693 15.9553 15.9553C21.6693 10.2413 29.4192 7.03125 37.5 7.03125ZM37.5 75C47.4456 75 56.9839 71.0491 64.0165 64.0165C71.0491 56.9839 75 47.4456 75 37.5C75 27.5544 71.0491 18.0161 64.0165 10.9835C56.9839 3.95088 47.4456 0 37.5 0C27.5544 0 18.0161 3.95088 10.9835 10.9835C3.95088 18.0161 0 27.5544 0 37.5C0 47.4456 3.95088 56.9839 10.9835 64.0165C18.0161 71.0491 27.5544 75 37.5 75ZM54.0527 30.6152C55.4297 29.2383 55.4297 27.0117 54.0527 25.6494C52.6758 24.2871 50.4492 24.2725 49.0869 25.6494L32.8271 41.9092L25.9424 35.0244C24.5654 33.6475 22.3389 33.6475 20.9766 35.0244C19.6143 36.4014 19.5996 38.6279 20.9766 39.9902L30.3516 49.3652C31.7285 50.7422 33.9551 50.7422 35.3174 49.3652L54.0527 30.6152Z"
                                                              fill="#393939"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_9850_171427">
                                                            <rect width="75" height="75" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <div style="text-align: center;color: #393939;font-size: 16px;font-weight: 400;line-height: 160%;margin-top: 24px;">
                                                    訂單新增成功！<br>
                                                    已將訂單明細發送至顧客信箱
                                                </div>
                                            </div>
                                        `
                                    }, 'orderFinish', {
                                        dismiss: () => {
                                            vm.type = "list";
                                        }
                                    })

                                })
                            }

                        }), "送出")}
                    </div>
            `
            , 1200);
    }

    public static getPaymentMethodText(key: string) {
        switch (key) {
            case 'off_line':
                return `線下付款`
            case 'newWebPay':
                return `藍新金流`
            case 'ecPay':
                return `綠界金流`
            default:
                return `線下付款`
        }
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingOrderManager)