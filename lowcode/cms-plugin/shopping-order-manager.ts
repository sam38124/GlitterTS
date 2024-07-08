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

interface VoucherData {
    id: number;
    title: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free';
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
            type: 'add',
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
        let newOrder: any = {
            id: glitter.getUUID(),
            productArray: [],
            productCheck: [],
            productTemp: [],
            orderProductArray: [],
            orderString: '',
            query: '',
        };

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
                                <button
                                        class="btn "
                                        style="display: flex;
    padding: 6px 18px;
    align-items: center;
    gap: 8px;border-radius: 10px;color: #FFF;
    background: #393939;font-size: 16px;font-weight: 700;"
                                        onclick="${gvc.event(() => {
                                            vm.type = 'add';
                                        })}">
                                    新增
                                </button>
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
                                                        value: dd.orderData.total,
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
                        class OrderDetail {
                            subtotal: number;
                            shipment: number;
                            cart_token: string;
                            lineItems: {
                                id: number;
                                spec: string[];
                                count: string;
                                sale_price: number;
                            }[];
                            user_info?: {
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
                            };

                            constructor(subtotal: number, shipment: number) {
                                this.subtotal = subtotal;
                                this.shipment = shipment;
                                this.cart_token = "";
                                this.lineItems = [];

                            }

                            get total(): number {
                                return this.subtotal + this.shipment;
                            }
                        }

                        let newVoucher: VoucherData;
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
                            value: "",


                        };
                        const orderData: {
                            id: number;
                            cart_token: string;
                            status: number;
                            email: string;
                            orderData: {
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
                                };
                                progress: string;
                                // progress: 'finish' | 'wait' | 'shipping' | "returns";
                                order_note: string;
                                voucherList: [
                                    {
                                        title: string

                                        method: 'percent' | 'fixed';
                                        trigger: 'auto' | 'code' | 'manual';
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

                        let orderDetail = new OrderDetail(0, 0);
                        let showDiscountEdit = false;
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

                        function showOrderDetail() {
                            function showDiscount() {
                                return html`
                                    <div style="color: #4D86DB;position: relative;">
                                        <div style="cursor: pointer;margin-bottom: 12px;" onclick="${gvc.event(() => {
                                            showDiscountEdit = !showDiscountEdit;
                                            gvc.notifyDataChange('orderDetail')
                                        })}">新增折扣
                                        </div>
                                        ${(showDiscountEdit) ? `` : gvc.bindView({
                                            bind: `editDiscount`,
                                            view: () => {
                                                let tempData: {
                                                    title: string,
                                                    reBackType: "discount" | "rebate" | "shipment_free",
                                                    method: 'percent' | 'fixed';
                                                    value: string
                                                } = {
                                                    title: "",
                                                    reBackType: "discount",
                                                    method: 'percent',
                                                    value: ""
                                                }
                                                let discountHTML = ``;
                                                let checkBox = html`
                                                    <div style="margin-right:6px;display: flex;width: 16px;height: 16px;justify-content: center;align-items: center;border-radius: 20px;border: 4px solid #393939"></div>`
                                                let uncheckBox = html`
                                                    <div style="margin-right:6px;width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`
                                                showArray.map((rowData: any, index: number) => {

                                                    if (rowData.select) {
                                                        function drawVoucherDetail(rowData: any) {
                                                            switch (rowData.value) {
                                                                case "discount": {
                                                                    
                                                                    return html`
                                                                        <div class="w-100 d-flex"
                                                                             style="padding-left: 8px;margin-top: 8px;">
                                                                            <div style="height: 100%;width:1px;background-color: #E5E5E5;margin-right: 14px;"></div>
                                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;flex: 1 0 0;">
                                                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;align-self: stretch;">
                                                                                    <div style="display: flex;align-items: center;gap: 6px;" onclick="${gvc.event(()=>{
                                                                                        
                                                                                        rowData.method = "percent";
                                                                                        tempData.method = "percent";
                                                                                        gvc.notifyDataChange('editDiscount');
                                                                                    })}">
                                                                                        ${(rowData.method == "percent")?checkBox:uncheckBox}百分比
                                                                                    </div>
                                                                                    <div style="${(rowData.method == "percent")?'display: flex':'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                                             width="2" height="40"
                                                                                             viewBox="0 0 2 40"
                                                                                             fill="none">
                                                                                            <path d="M1 0V40"
                                                                                                  stroke="#E5E5E5"/>
                                                                                        </svg>
                                                                                        <input class="w-100"
                                                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                                                               onchange="${gvc.event((e) => {
                                                                                                   rowData.discount = e.value
                                                                                               })}">
                                                                                        <div class="h-100 d-flex align-items-center"
                                                                                             style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;">
                                                                                            %
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div style="display: flex;gap: 6px;flex-direction: column;width: 100%;">
                                                                                    <div style="display: flex;align-items: center;gap: 6px;" onclick="${gvc.event(()=>{
                                                                                        rowData.method = "fixed";
                                                                                        tempData.method = "fixed",
                                                                                        gvc.notifyDataChange('editDiscount')
                                                                                    })}">
                                                                                        ${(rowData.method == "fixed")?checkBox:uncheckBox}固定金額
                                                                                    </div>
                                                                                    <div style="${(rowData.method == "fixed")?'display: flex':'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                                             width="2" height="40"
                                                                                             viewBox="0 0 2 40"
                                                                                             fill="none">
                                                                                            <path d="M1 0V40"
                                                                                                  stroke="#E5E5E5"/>
                                                                                        </svg>
                                                                                        <input class="w-100"
                                                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                                                                               onchange="${gvc.event((e) => {
                                                                                                   rowData.discount = e.value
                                                                                               })}">
                                                                                        <div class="h-100 d-flex align-items-center"
                                                                                             style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;">
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>`
                                                                }
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
                                                               style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
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
                                                        }), '取消')}
                                                        ${BgWidget.save(gvc.event(() => {
                                                            console.log(tempData)
                                                        }), '確定')}
                                                    </div>
                                                `
                                            }, divCreate: {
                                                style: `display: flex;color:#393939;text-align: left;width: 348px;padding: 24px;flex-direction: column;gap: 18px;border-radius: 10px;background: #FFF;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);position:absolute;right:0;top:33px;gap:18px;`
                                            }
                                        })}
                                        <div style="">
                                            <div></div>
                                        </div>
                                    </div>
                                `
                            }


                            return gvc.bindView({
                                bind: "orderDetail",
                                view: () => {
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
                                        {
                                            left: "折扣 ",
                                            right: showDiscount(),
                                        },
                                        {
                                            left: "額外運費 ",
                                            right: orderDetail.subtotal
                                        },
                                        {
                                            left: "手續費",
                                            right: orderDetail.subtotal
                                        },
                                    ]
                                    showArray.map((rowData) => {
                                        returnHTML += html`
                                            <div class="w-100 d-flex align-items-center justify-content-end"
                                                 style="height: 21px;">
                                                <div style="text-align: right;">${rowData.left}</div>
                                                <div style="width:158px;text-align: right">${rowData.right}</div>
                                            </div>
                                        `
                                    })
                                    return returnHTML
                                }, divCreate: {class: `d-flex flex-column w-100`, style: `gap:12px;`}
                            })
                        }

                        return BgWidget.container(html`
                                    <div class="d-flex align-items-center" style="margin-bottom: 24px;">
                                        ${BgWidget.goBack(
                                                gvc.event(() => {
                                                    vm.type = 'list';
                                                })
                                        )}
                                        ${BgWidget.title('新增訂單')}
                                    </div>
                                    <div style="color: #393939;width: 100%;display: flex;padding: 20px;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);">
                                        <div style="font-size: 16px;font-weight: 700;">訂單內容</div>
                                        <div style="width: 100%;display: flex;align-items: center">
                                            <div class="flex-fill d-flex align-items-center col-5"
                                                 style="font-size: 16px;font-weight: 700;">商品
                                            </div>
                                            <div class="col-3"
                                                 style="display: flex;padding-right: 40px;align-items: flex-start;font-size: 16px;font-weight: 700;">
                                                單價
                                            </div>
                                            <div class="col-2" style="font-size: 16px;font-weight: 700;">數量</div>
                                            <div class="col-1" style="font-size: 16px;font-weight: 700;">小計</div>
                                        </div>
                                        ${gvc.bindView({
                                            bind: "listProduct",
                                            view: () => {
                                                let returnHTML = "";
                                                if (newOrder.productCheck.length) {
                                                    newOrder.productCheck.map((product: any) => {
                                                        returnHTML += html`
                                                            <div style="width: 100%;display: flex;align-items: center">
                                                                <div class="flex-fill d-flex align-items-center col-5"
                                                                     style="font-size: 16px;font-weight: 700;">
                                                                    <div style="width: 54px;height: 54px;"></div>
                                                                </div>
                                                                <div class="col-3"
                                                                     style="display: flex;padding-right: 40px;align-items: flex-start;font-size: 16px;font-weight: 700;">
                                                                    單價
                                                                </div>
                                                                <div class="col-2" style="font-size: 16px;font-weight: 700;">
                                                                    數量
                                                                </div>
                                                                <div class="col-1" style="font-size: 16px;font-weight: 700;">
                                                                    小計
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
                                                                    if (newOrder.productArray.length == 0) {
                                                                        ApiShop.getProduct({
                                                                            page: 0,
                                                                            limit: 20,
                                                                            search: newOrder.query,
                                                                            orderBy: newOrder.orderString
                                                                        }).then((data) => {
                                                                            newOrder.productArray = data.response.data;

                                                                        });
                                                                    }
                                                                    return html`
                                                                        <div style="display: flex;width: 690px;padding-bottom: 24px;flex-direction: column;align-items: flex-start;gap: 24px;border-radius: 10px;background: #FFF;">
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
                                                                                                                    return `
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" onclick="${gvc.event(() => {
                                                                                                                        product.select = false;
                                                                                                                        gvc.notifyDataChange(`product${productIndex}`);
                                                                                                                    })}">
                                                                                                    <rect width="16" height="16" rx="3" fill="#393939"/>
                                                                                                    <path d="M4.5 8.5L7 11L11.5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                                                </svg>`
                                                                                                                } else {
                                                                                                                    return `<div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;" onclick="${gvc.event(() => {
                                                                                                                        product.select = true;
                                                                                                                        (document.querySelector('.varitantSelect') as HTMLInputElement)!.value;
                                                                                                                        if (product.content.variants.length > 1) {
                                                                                                                            product.selectIndex = (document.querySelector('.varitantSelect') as HTMLInputElement).value;
                                                                                                                        }
                                                                                                                        gvc.notifyDataChange(`product${productIndex}`);
                                                                                                                    })}"></div>`
                                                                                                                }
                                                                                                            })()}
                                                                                                            <div style="width: 50px;height: 50px;border-radius: 5px;background: url('${product.content.preview_image[0]}') lightgray 50% / cover no-repeat;"></div>
                                                                                                            <div class="flex-fill d-flex flex-column">
                                                                                                                <div style="color:#393939;font-size: 14px;font-weight: 400;margin-bottom: 4px;">
                                                                                                                    ${product.content.title}
                                                                                                                </div>
                                                                                                                ${(() => {
                                                                                                                    if (product.content.variants.length > 1) {
                                                                                                                        return `
                                                                                                        <select class="w-100 d-flex align-items-center form-select varitantSelect" style="border-radius: 10px;border: 1px solid #DDD;padding: 6px 18px;">
                                                                                                            ${(() => {
                                                                                                                            let optionHTML = ``
                                                                                                                            product.content.variants.map((variant: any, index: number) => {
                                                                                                                                optionHTML += `
                                                                                                                    <option value="${index}" ${(() => {
                                                                                                                                    if (product.selectIndex == index) return `selected`; else return ``;
                                                                                                                                })()}>${variant.spec.join(", ")}</option>
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
                                                                newOrder.productCheck.push(...newOrder.productTemp)
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
                                                style: `width: 100%;display: flex;align-items: center;margin:24px 0;`,
                                                class: ``
                                            }
                                        })}
                                        <div style="width:100%;height: 1px;background-color:#DDD;margin-bottom:24px;"></div>
                                        ${showOrderDetail()}
                                    </div>
                            `
                            , 1200);
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
                };
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
                if (orderData.orderData.progress === 'finish') {
                    return drawBadge('green', "已出貨");
                } else if (orderData.orderData.progress === 'shipping') {
                    return drawBadge('yellow', "配送中");
                } else {
                    return drawBadge('red', "未出貨");
                }
            },
            orderStatusBadge: () => {
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
                                                                            console.log(" dd  --- ", dd)
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
                                                                        console.log(orderData.status)
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
                                                            ${(() => {
                                                                let payMethod: any = {
                                                                    credit: "信用卡付款"
                                                                }
                                                                return payMethod[orderData.orderData.method] ?? "線下付款";
                                                            })()}
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
                                                                    {title: '配送中', value: 'shipping'},
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
                                                                        <div class="d-flex">門市名稱:
                                                                            ${orderData.orderData.user_info.CVSStoreName}
                                                                        </div>
                                                                        <div class="d-flex">門市店號:
                                                                            ${orderData.orderData.user_info.CVSStoreID}
                                                                        </div>
                                                                        <div class="d-flex">地址:
                                                                            ${orderData.orderData.user_info.CVSAddress}
                                                                        </div>
                                                                    `
                                                                }
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
                                                                `<div class="d-flex flex-column" style="gap:8px;">
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
                                            <div class="" style="color: #4D86DB;font-weight: 400;">${orderData.orderData.user_info.name}</div>
                                            <div class="" style="color: #393939;font-weight: 400;">${orderData.orderData.user_info.phone || "電話未填"}</div>
<!--                                            <div class="fw-normal fs-6">Email:${orderData.orderData.user_info.email}</div>-->
                                        </div>`,
                                                                `<div class="" style="font-size: 16px;font-weight: 700;">付款方式</div>`,
                                                                `<div style="">${(() => {
                                                                    let payMethod: any = {
                                                                        credit: "信用卡付款"
                                                                    }
                                                                    return payMethod[orderData.orderData.method];
                                                                })()}</div>`,
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
                                                                                `<div class="fw-normal fs-6">名稱:${orderData.orderData.user_info.CVSStoreName}</div>`,
                                                                                `<div class="fw-normal fs-6">代號:${orderData.orderData.user_info.CVSStoreID}</div>`,
                                                                                `<div class="fw-normal fs-6">地址:${orderData.orderData.user_info.CVSAddress}</div>`,
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
                                                                            class: `p-2 fw-normal`,
                                                                        },
                                                                    };
                                                                })
                                                            ].join('')}
                                                        </div>
                                                    </div>
                                                `)}

                                                <div class="mt-2"></div>
                                                ${BgWidget.card(
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
                                                                            <div class="fw-bold fs-6">訂單備註</div>
                                                                            <div class="flex-fill"></div>

                                                                        </div>
                                                                        <div class="fs-6 w-100 mt-2  lh-lg fw-normal"
                                                                             style="word-break: break-all;white-space:normal;">
                                                                            ${(orderData.orderData.order_note ?? '尚未填寫').replace(/\n/g, `<br>`)}
                                                                        </div>
                                                                    `;
                                                                },
                                                                divCreate: {
                                                                    class: `p-2 fw-normal`,
                                                                },
                                                            };
                                                        })
                                                )}
                                                <div class="mt-2"></div>
                                                ${BgWidget.card(html`
                                                    <div class="p-2">
                                                        <div class="d-flex align-items-center">
                                                            <div class="fw-bold fs-6">預計送達日期</div>
                                                            <div class="flex-fill"></div>
                                                        </div>
                                                        <div class="w-100 d-flex flex-column mt-2" style="gap:5px;">
                                                            ${[
                                                                EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    default: orderData.orderData.expectDate as string,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        orderData.orderData.expectDate = text;
                                                                    },
                                                                    type: 'date',
                                                                }),
                                                            ].join('')}
                                                        </div>
                                                    </div>
                                                `)}
                                                <div class="mt-2"></div>

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
}

(window as any).glitter.setModule(import.meta.url, ShoppingOrderManager);