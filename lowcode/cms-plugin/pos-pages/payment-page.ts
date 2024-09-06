import {OrderDetail, ViewModel} from "./models.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {PosWidget} from "../pos-widget.js";
import {UserList} from "../user-list.js";
import {LinePay} from "./pay-method/line-pay.js";

const html = String.raw

export class PaymentPage {

    public static shipment_support(orderDetail: any) {
        return [{
            title: '立即取貨', value: 'now'
        }].concat([
            {
                title: '一般宅配', value: 'normal'
            },
            {
                title: '全家店到店', value: 'FAMIC2C'
            },
            {
                title: '萊爾富店到店', value: 'HILIFEC2C'
            }, {
                title: 'OK超商店到店', value: 'OKMARTC2C'
            }, {
                title: '7-ELEVEN超商交貨便', value: 'UNIMARTC2C'
            },
            {
                title: '門市取貨', value: 'shop'
            }
        ].filter((dd) => {
            return (orderDetail as any).shipment_support.includes(dd.value)
        }))
    }

    public static main(obj: { gvc: GVC, vm: ViewModel, ogOrderData: OrderDetail }) {

        const gvc = obj.gvc
        const vm = obj.vm
        const dialog = new ShareDialog(gvc.glitter);
        PaymentPage.storeHistory(obj.ogOrderData)
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: async () => {
                    dialog.dataLoading({visible: true});
                    (obj.ogOrderData.user_info as any) = (obj.ogOrderData.user_info as any) || {};
                    (obj.ogOrderData.user_info as any).shipment = (obj.ogOrderData.user_info as any).shipment || 'now';
                    const orderDetail: any = (await ApiShop.getCheckout({
                        line_items: obj.ogOrderData.lineItems,
                        checkOutType: 'POS',
                        user_info: obj.ogOrderData.user_info
                    })).response.data;
                    dialog.dataLoading({visible: false})
                    if (!PaymentPage.shipment_support(orderDetail).find((dd) => {
                        return dd.value === (obj.ogOrderData).user_info.shipment
                    })) {
                        ((obj.ogOrderData).user_info.shipment as any) = 'now';
                    }
                    let interval:any=0
                    return `<div class="left-panel"
                     style="${(document.body.offsetWidth < 800) ? `width:calc(100%);padding: 32px 20px;height:auto;` : `width:calc(100% - 446px);padding: 32px 36px;`}overflow: auto;">
                    ${PosWidget.bigTitle('訂單明細')}
                    <div class="d-flex flex-column ${(document.body.offsetWidth < 800) ? `mx-n4` : ``}"
                         style="margin-top: ${((document.body.offsetWidth < 800)) ? `20px` : `32px`};padding:24px;${(document.body.offsetWidth < 800) ? `` : `border-radius: 10px;`}background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);">
                        <div class="d-flex"
                             style="padding:15px 0;background: #F6F6F6;border-radius: 10px;font-weight: 700;">
                            <div class="col-6 text-left" style="padding-left: 23px;">
                                商品名稱
                            </div>
                            <div class="col-2 text-center d-none">規格</div>
                            <div class="col-2 text-start">單價</div>
                            <div class="col-2 text-center">數量</div>
                            <div class="col-2 text-center">小計</div>
                        </div>
                        <div class="d-flex flex-column">
                            ${(() => {
                        let image = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';

                        if (orderDetail.lineItems.length > 0) {
                            return orderDetail.lineItems.map((data: any) => {
                                return html`
                                    <div class="d-flex"
                                         style="margin-top: 26px;">
                                        <div class="col-6 d-flex align-items-center">
                                            <div style="width: 54px;height: 54px;border-radius: 5px;background: 50%/cover url('${data.preview_image}')"></div>
                                            <div class="d-flex flex-column"
                                                 style="font-size: 16px;font-style: normal;font-weight: 500;letter-spacing: 0.64px;margin-left: 12px;">
                                                ${data.title}
                                                <span style="color: #949494;
                                                                                font-size: 16px;
                                                                                font-style: normal;
                                                                                font-weight: 500;
                                                                                line-height: normal;
                                                                                letter-spacing: 0.64px;
                                                                                text-transform: uppercase;">
                                                                                     ${(() => {
                                                                                         return (data.spec.length > 0) ? data.spec.map((spec: any) => {
                                                                                                     return html`
                                                                                                         ${spec}`
                                                                                                 }).join(',')
                                                                                                 : html``
                                                                                     })()}
                                                                                </span>

                                            </div>
                                        </div>
                                        <div class="col-2 d-flex align-items-center justify-content-start">
                                                $${parseInt(data.sale_price as any, 10).toLocaleString()}
                                        </div>
                                        <div class="col-2 d-flex align-items-center justify-content-center">
                                            ${data.count}
                                        </div>
                                        <div class="col-2 d-flex align-items-center justify-content-center">
                                                $${parseInt((data.sale_price * data.count as any), 10).toLocaleString()}
                                        </div>
                                    </div>
                                `
                            }).join('')
                        }
                        return ``
                    })()}
                        </div>
                    </div>
                     ${PosWidget.bigTitle('會員','margin-top:24px;margin-bottom:24px;')}
                     <div class=" mx-n4 mx-sm-0" style="border-radius: 10px;overflow: hidden;
background: #EAEAEA;">
<div class="w-100 d-flex flex-fill">
<div class="w-100 d-flex align-items-center justify-content-center" style="flex:1; height: 65px; background: white; border-radius: 0px 10px 0px 0px;
background: #FFF;">${PosWidget.bigTextItem('已有會員')}</div>
<div class="w-100 d-flex align-items-center justify-content-center" style="flex:1; height: 65px;">${PosWidget.bigTextItem('新建會員')}</div>
</div>
<div class="w-100 bg-white p-2 p-sm-3" style="min-height:178px;">
<div class="d-flex align-items-center" style="gap:14px;">
${EditorElem.searchInputDynamicV2({
                        title: '',
                        gvc: gvc,
                        def: '',
                        search: (text, callback) => {
                            clearInterval(interval);
                            interval = setTimeout(() => {
                                ApiShop.getProduct({
                                    page: 0,
                                    limit: 50,
                                    search: '',
                                }).then((data) => {
                                    console.log(`pd-==`,data.response.data.map((dd: any) => {
                                        return dd.content.title;
                                    }))
                                    callback(
                                        data.response.data.map((dd: any) => {
                                            return dd.content.title;
                                        })
                                    );
                                });
                            }, 100);
                        },
                        callback: (text) => {

                        },
                        placeHolder: '搜尋或掃描 會員信箱/電話/編號/名稱',
                    })}
<div class="" style="display: flex;
width: 44px;
height: 44px;
padding: 8px 10px;
border-radius: 10px;
border: 1px solid #DDD;
justify-content: center;
align-items: center;
gap: 8px;
flex-shrink: 0;">
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
<path d="M3.50016 10.5002C2.80016 10.5002 2.3335 10.0335 2.3335 9.3335V4.66683C2.3335 3.3835 3.3835 2.3335 4.66683 2.3335H9.3335C10.0335 2.3335 10.5002 2.80016 10.5002 3.50016C10.5002 4.20016 10.0335 4.66683 9.3335 4.66683H4.66683V9.3335C4.66683 10.0335 4.20016 10.5002 3.50016 10.5002Z" fill="#393939"/>
<path d="M9.3335 25.6667H4.66683C3.3835 25.6667 2.3335 24.6167 2.3335 23.3333V18.6667C2.3335 17.9667 2.80016 17.5 3.50016 17.5C4.20016 17.5 4.66683 17.9667 4.66683 18.6667V23.3333H9.3335C10.0335 23.3333 10.5002 23.8 10.5002 24.5C10.5002 25.2 10.0335 25.6667 9.3335 25.6667Z" fill="#393939"/>
<path d="M23.3333 25.6667H18.6667C17.9667 25.6667 17.5 25.2 17.5 24.5C17.5 23.8 17.9667 23.3333 18.6667 23.3333H23.3333V18.6667C23.3333 17.9667 23.8 17.5 24.5 17.5C25.2 17.5 25.6667 17.9667 25.6667 18.6667V23.3333C25.6667 24.6167 24.6167 25.6667 23.3333 25.6667Z" fill="#393939"/>
<path d="M24.5 10.5002C23.8 10.5002 23.3333 10.0335 23.3333 9.3335V4.66683H18.6667C17.9667 4.66683 17.5 4.20016 17.5 3.50016C17.5 2.80016 17.9667 2.3335 18.6667 2.3335H23.3333C24.6167 2.3335 25.6667 3.3835 25.6667 4.66683V9.3335C25.6667 10.0335 25.2 10.5002 24.5 10.5002Z" fill="#393939"/>
<path d="M19.8333 15.1668H8.16667C7.46667 15.1668 7 14.7002 7 14.0002C7 13.3002 7.46667 12.8335 8.16667 12.8335H19.8333C20.5333 12.8335 21 13.3002 21 14.0002C21 14.7002 20.5333 15.1668 19.8333 15.1668Z" fill="#393939"/>
<path d="M15.7502 10.5003H12.2502C11.5502 10.5003 11.0835 10.0337 11.0835 9.33366C11.0835 8.63366 11.5502 8.16699 12.2502 8.16699H15.7502C16.4502 8.16699 16.9168 8.63366 16.9168 9.33366C16.9168 10.0337 16.4502 10.5003 15.7502 10.5003Z" fill="#393939"/>
<path d="M15.7502 19.8333H12.2502C11.5502 19.8333 11.0835 19.3667 11.0835 18.6667C11.0835 17.9667 11.5502 17.5 12.2502 17.5H15.7502C16.4502 17.5 16.9168 17.9667 16.9168 18.6667C16.9168 19.3667 16.4502 19.8333 15.7502 19.8333Z" fill="#393939"/>
</svg>

</div>
</div>
</div>
</div>
                </div>
                <div class=""
                     style="${(document.body.offsetWidth < 800) ? `width:100%` : `width: 446px;height: 100%;overflow: auto;`};padding: 36px 24px;background: #FFF;box-shadow: 1px 0 10px 0 rgba(0, 0, 0, 0.10);">
                    ${PosWidget.bigTitle('訂單款項')}
                 
                    <div style="margin-top: 32px;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;">
                        付款方式
                    </div>
                    ${gvc.bindView({
                        bind: "payment",
                        dataList: [{obj: vm, key: 'paySelect'}],
                        view: () => {
                            function drawIcon(black: boolean, type: string) {
                                switch (type) {
                                    case "cash" :
                                        return html`
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 width="28"
                                                 height="28" viewBox="0 0 28 28"
                                                 fill="none">
                                                <path d="M9.625 4.8125C9.625 4.81797 9.63047 4.84531 9.65781 4.89453C9.69063 4.96016 9.76719 5.06406 9.91484 5.19531C9.93672 5.21172 9.95859 5.23359 9.98047 5.25C8.95781 5.27187 7.9625 5.34297 7.00547 5.47422L7 4.8125C7 3.82812 7.53047 3.04062 8.15391 2.47734C8.77734 1.91406 9.61406 1.46562 10.5328 1.11563C12.3813 0.410156 14.8477 0 17.5 0C20.1523 0 22.6187 0.410156 24.4617 1.11016C25.3805 1.46016 26.2172 1.90859 26.8406 2.47187C27.4641 3.03516 28 3.82812 28 4.8125V10.5V16.1875C28 17.1719 27.4695 17.9594 26.8461 18.5227C26.2227 19.0859 25.3859 19.5344 24.4672 19.8844C23.9422 20.0867 23.368 20.2617 22.7555 20.4094V17.6914C23.0344 17.6094 23.2914 17.5219 23.532 17.4289C24.2758 17.1445 24.7898 16.8383 25.0906 16.5703C25.2383 16.4391 25.3148 16.3352 25.3477 16.2695C25.3805 16.2094 25.3805 16.1875 25.3805 16.1875V13.8031C25.0906 13.9453 24.7844 14.0766 24.4672 14.1969C23.9422 14.3992 23.368 14.5742 22.7555 14.7219V12.0039C23.0344 11.9219 23.2914 11.8344 23.532 11.7414C24.2758 11.457 24.7898 11.1508 25.0906 10.8828C25.2383 10.7516 25.3148 10.6477 25.3477 10.582C25.375 10.5328 25.3805 10.5055 25.3805 10.5V8.11562C25.0906 8.25781 24.7844 8.38906 24.4672 8.50938C23.718 8.79375 22.8594 9.03438 21.9352 9.21484C21.6562 8.80469 21.3336 8.45469 21.0164 8.17031C20.4641 7.67266 19.8242 7.26797 19.157 6.93438C20.8906 6.80859 22.4 6.48594 23.532 6.05391C24.2758 5.76953 24.7898 5.46328 25.0906 5.19531C25.2383 5.06406 25.3148 4.96016 25.3477 4.89453C25.375 4.84531 25.3805 4.81797 25.3805 4.8125C25.3805 4.8125 25.3805 4.78516 25.3477 4.73047C25.3148 4.66484 25.2383 4.56094 25.0906 4.42969C24.7898 4.15625 24.2758 3.85 23.532 3.57109C22.05 3.00234 19.9172 2.625 17.5 2.625C15.0828 2.625 12.95 3.00234 11.4734 3.56562C10.7297 3.85 10.2156 4.15625 9.91484 4.42422C9.76719 4.55547 9.69063 4.65938 9.65781 4.725C9.625 4.78516 9.625 4.80703 9.625 4.80703V4.8125ZM2.625 11.8125C2.625 11.818 2.63047 11.8453 2.65781 11.8945C2.69062 11.9602 2.76719 12.0641 2.91484 12.1953C3.21563 12.4688 3.72969 12.775 4.47344 13.0539C5.95 13.6172 8.08281 13.9945 10.5 13.9945C12.9172 13.9945 15.05 13.6172 16.5266 13.0539C17.2703 12.7695 17.7844 12.4633 18.0852 12.1953C18.2328 12.0641 18.3094 11.9602 18.3422 11.8945C18.3695 11.8453 18.375 11.818 18.375 11.8125C18.375 11.8125 18.375 11.7852 18.3422 11.7305C18.3094 11.6648 18.2328 11.5609 18.0852 11.4297C17.7844 11.1562 17.2703 10.85 16.5266 10.5711C15.05 10.0078 12.9172 9.63047 10.5 9.63047C8.08281 9.63047 5.95 10.0078 4.47344 10.5711C3.72969 10.8555 3.21563 11.1617 2.91484 11.4297C2.76719 11.5609 2.69062 11.6648 2.65781 11.7305C2.625 11.7906 2.625 11.8125 2.625 11.8125ZM0 11.8125C0 10.8281 0.530469 10.0406 1.15391 9.47734C1.77734 8.91406 2.61406 8.46562 3.53281 8.11562C5.38125 7.41016 7.84766 7 10.5 7C13.1523 7 15.6187 7.41016 17.4617 8.11016C18.3805 8.46016 19.2172 8.90859 19.8406 9.47188C20.4641 10.0352 21 10.8281 21 11.8125V17.5V23.1875C21 24.1719 20.4695 24.9594 19.8461 25.5227C19.2227 26.0859 18.3859 26.5344 17.4672 26.8844C15.6187 27.5898 13.1523 28 10.5 28C7.84766 28 5.38125 27.5898 3.53828 26.8898C2.61953 26.5398 1.78828 26.0914 1.15938 25.5281C0.530469 24.9648 0 24.1719 0 23.1875V17.5V11.8125ZM18.375 17.5V15.1156C18.0852 15.2578 17.7789 15.3891 17.4617 15.5094C15.6187 16.2148 13.1523 16.625 10.5 16.625C7.84766 16.625 5.38125 16.2148 3.53828 15.5148C3.22109 15.3945 2.91484 15.2633 2.625 15.1211V17.5C2.625 17.5055 2.63047 17.5328 2.65781 17.582C2.69062 17.6477 2.76719 17.7516 2.91484 17.8828C3.21563 18.1562 3.72969 18.4625 4.47344 18.7414C5.95 19.3047 8.08281 19.682 10.5 19.682C12.9172 19.682 15.05 19.3047 16.5266 18.7414C17.2703 18.457 17.7844 18.1508 18.0852 17.8828C18.2328 17.7516 18.3094 17.6477 18.3422 17.582C18.3695 17.5328 18.375 17.5055 18.375 17.5ZM3.53828 21.2023C3.22109 21.082 2.91484 20.9508 2.625 20.8086V23.1875C2.625 23.1875 2.625 23.2148 2.65781 23.2695C2.69062 23.3352 2.76719 23.4391 2.91484 23.5703C3.21563 23.8438 3.72969 24.15 4.47344 24.4289C5.95 24.9922 8.08281 25.3695 10.5 25.3695C12.9172 25.3695 15.05 24.9922 16.5266 24.4289C17.2703 24.1445 17.7844 23.8383 18.0852 23.5703C18.2328 23.4391 18.3094 23.3352 18.3422 23.2695C18.375 23.2094 18.375 23.1875 18.375 23.1875V20.8031C18.0852 20.9453 17.7789 21.0766 17.4617 21.1969C15.6187 21.9023 13.1523 22.3125 10.5 22.3125C7.84766 22.3125 5.38125 21.9023 3.53828 21.2023Z"
                                                      fill="${black ? `#393939` : `#8D8D8D`}"/>
                                            </svg>
                                        `
                                    case "creditCard" :
                                        return html`
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 width="28"
                                                 height="28" viewBox="0 0 28 28"
                                                 fill="none">
                                                <path d="M24.8889 5.84375C25.3167 5.84375 25.6667 6.19531 25.6667 6.625V8.1875H2.33333V6.625C2.33333 6.19531 2.68333 5.84375 3.11111 5.84375H24.8889ZM25.6667 12.875V22.25C25.6667 22.6797 25.3167 23.0312 24.8889 23.0312H3.11111C2.68333 23.0312 2.33333 22.6797 2.33333 22.25V12.875H25.6667ZM3.11111 3.5C1.39514 3.5 0 4.90137 0 6.625V22.25C0 23.9736 1.39514 25.375 3.11111 25.375H24.8889C26.6049 25.375 28 23.9736 28 22.25V6.625C28 4.90137 26.6049 3.5 24.8889 3.5H3.11111ZM5.83333 18.3437C5.18681 18.3437 4.66667 18.8662 4.66667 19.5156C4.66667 20.165 5.18681 20.6875 5.83333 20.6875H8.16667C8.81319 20.6875 9.33333 20.165 9.33333 19.5156C9.33333 18.8662 8.81319 18.3437 8.16667 18.3437H5.83333ZM12.0556 18.3437C11.409 18.3437 10.8889 18.8662 10.8889 19.5156C10.8889 20.165 11.409 20.6875 12.0556 20.6875H17.5C18.1465 20.6875 18.6667 20.165 18.6667 19.5156C18.6667 18.8662 18.1465 18.3437 17.5 18.3437H12.0556Z"
                                                      fill="${black ? `#393939` : `#8D8D8D`}"/>
                                            </svg>
                                        `
                                    default:
                                        return html`
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 width="28"
                                                 height="28" viewBox="0 0 28 28"
                                                 fill="none">
                                                <g clip-path="url(#clip0_12384_217611)">
                                                    <path d="M3.5 0C2.53203 0 1.75 0.782031 1.75 1.75V5.25C1.75 6.21797 2.53203 7 3.5 7H7.875V8.75H4.78516C3.04609 8.75 1.56406 10.0297 1.31797 11.7523L0.0328125 20.7539C0.0109375 20.918 0 21.082 0 21.2461V24.5C0 26.4305 1.56953 28 3.5 28H24.5C26.4305 28 28 26.4305 28 24.5V21.2461C28 21.082 27.9891 20.9125 27.9672 20.7539L26.6766 11.7523C26.4305 10.0297 24.9539 8.75 23.2094 8.75H11.375V7H15.75C16.718 7 17.5 6.21797 17.5 5.25V1.75C17.5 0.782031 16.718 0 15.75 0H3.5ZM5.25 2.625H14C14.4813 2.625 14.875 3.01875 14.875 3.5C14.875 3.98125 14.4813 4.375 14 4.375H5.25C4.76875 4.375 4.375 3.98125 4.375 3.5C4.375 3.01875 4.76875 2.625 5.25 2.625ZM2.625 24.5V23.625H25.375V24.5C25.375 24.9813 24.9813 25.375 24.5 25.375H3.5C3.01875 25.375 2.625 24.9813 2.625 24.5ZM24.0789 12.1242L25.3477 21H2.65234L3.92109 12.1242C3.98125 11.6922 4.35312 11.375 4.78516 11.375H23.2148C23.6523 11.375 24.0187 11.6977 24.0789 12.1242ZM6.125 12.6875C5.7769 12.6875 5.44306 12.8258 5.19692 13.0719C4.95078 13.3181 4.8125 13.6519 4.8125 14C4.8125 14.3481 4.95078 14.6819 5.19692 14.9281C5.44306 15.1742 5.7769 15.3125 6.125 15.3125C6.4731 15.3125 6.80694 15.1742 7.05308 14.9281C7.29922 14.6819 7.4375 14.3481 7.4375 14C7.4375 13.6519 7.29922 13.3181 7.05308 13.0719C6.80694 12.8258 6.4731 12.6875 6.125 12.6875ZM10.0625 14C10.0625 14.3481 10.2008 14.6819 10.4469 14.9281C10.6931 15.1742 11.0269 15.3125 11.375 15.3125C11.7231 15.3125 12.0569 15.1742 12.3031 14.9281C12.5492 14.6819 12.6875 14.3481 12.6875 14C12.6875 13.6519 12.5492 13.3181 12.3031 13.0719C12.0569 12.8258 11.7231 12.6875 11.375 12.6875C11.0269 12.6875 10.6931 12.8258 10.4469 13.0719C10.2008 13.3181 10.0625 13.6519 10.0625 14ZM8.75 17.0625C8.4019 17.0625 8.06806 17.2008 7.82192 17.4469C7.57578 17.6931 7.4375 18.0269 7.4375 18.375C7.4375 18.7231 7.57578 19.0569 7.82192 19.3031C8.06806 19.5492 8.4019 19.6875 8.75 19.6875C9.0981 19.6875 9.43194 19.5492 9.67808 19.3031C9.92422 19.0569 10.0625 18.7231 10.0625 18.375C10.0625 18.0269 9.92422 17.6931 9.67808 17.4469C9.43194 17.2008 9.0981 17.0625 8.75 17.0625ZM15.3125 14C15.3125 14.3481 15.4508 14.6819 15.6969 14.9281C15.9431 15.1742 16.2769 15.3125 16.625 15.3125C16.9731 15.3125 17.3069 15.1742 17.5531 14.9281C17.7992 14.6819 17.9375 14.3481 17.9375 14C17.9375 13.6519 17.7992 13.3181 17.5531 13.0719C17.3069 12.8258 16.9731 12.6875 16.625 12.6875C16.2769 12.6875 15.9431 12.8258 15.6969 13.0719C15.4508 13.3181 15.3125 13.6519 15.3125 14ZM14 17.0625C13.6519 17.0625 13.3181 17.2008 13.0719 17.4469C12.8258 17.6931 12.6875 18.0269 12.6875 18.375C12.6875 18.7231 12.8258 19.0569 13.0719 19.3031C13.3181 19.5492 13.6519 19.6875 14 19.6875C14.3481 19.6875 14.6819 19.5492 14.9281 19.3031C15.1742 19.0569 15.3125 18.7231 15.3125 18.375C15.3125 18.0269 15.1742 17.6931 14.9281 17.4469C14.6819 17.2008 14.3481 17.0625 14 17.0625ZM20.5625 14C20.5625 14.1724 20.5964 14.343 20.6624 14.5023C20.7284 14.6615 20.825 14.8062 20.9469 14.9281C21.0688 15.05 21.2135 15.1466 21.3727 15.2126C21.532 15.2786 21.7026 15.3125 21.875 15.3125C22.0474 15.3125 22.218 15.2786 22.3773 15.2126C22.5365 15.1466 22.6812 15.05 22.8031 14.9281C22.925 14.8062 23.0216 14.6615 23.0876 14.5023C23.1536 14.343 23.1875 14.1724 23.1875 14C23.1875 13.8276 23.1536 13.657 23.0876 13.4977C23.0216 13.3385 22.925 13.1938 22.8031 13.0719C22.6812 12.95 22.5365 12.8534 22.3773 12.7874C22.218 12.7214 22.0474 12.6875 21.875 12.6875C21.7026 12.6875 21.532 12.7214 21.3727 12.7874C21.2135 12.8534 21.0688 12.95 20.9469 13.0719C20.825 13.1938 20.7284 13.3385 20.6624 13.4977C20.5964 13.657 20.5625 13.8276 20.5625 14ZM19.25 17.0625C18.9019 17.0625 18.5681 17.2008 18.3219 17.4469C18.0758 17.6931 17.9375 18.0269 17.9375 18.375C17.9375 18.7231 18.0758 19.0569 18.3219 19.3031C18.5681 19.5492 18.9019 19.6875 19.25 19.6875C19.5981 19.6875 19.9319 19.5492 20.1781 19.3031C20.4242 19.0569 20.5625 18.7231 20.5625 18.375C20.5625 18.0269 20.4242 17.6931 20.1781 17.4469C19.9319 17.2008 19.5981 17.0625 19.25 17.0625Z"
                                                          fill="${black ? `#393939` : `#8D8D8D`}"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_12384_217611">
                                                        <rect width="28" height="28"
                                                              fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        `
                                }
                            }

                            let btnArray = [
                                {
                                    title: `現金`,
                                    value: 'cash',
                                    event: () => {
                                        vm.paySelect = 'cash';
                                    }
                                },
                                {
                                    title: `刷卡`,
                                    value: 'creditCard',
                                    event: () => {
                                        vm.paySelect = 'creditCard';
                                    }
                                },
                                {
                                    title: `Line pay`,
                                    value: 'line',
                                    event: () => {
                                        vm.paySelect = 'line';
                                    }
                                },
                            ]
                            return btnArray.map((btn) => {
                                return html`
                                    <div style="flex:1;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 20px 20px;border-radius: 10px;background: #F6F6F6;${(vm.paySelect == btn.value) ? `color:#393939;border-radius: 10px;border: 3px solid #393939;box-shadow: 2px 2px 15px 0px rgba(0, 0, 0, 0.20);` : 'color:#8D8D8D;'}"
                                         onclick="${gvc.event(() => {
                                             btn.event();
                                             console.log(vm.paySelect);
                                         })}">
                                        <div style="width: 28px;height: 28px;">
                                            ${drawIcon(vm.paySelect == btn.value, btn.value)}
                                        </div>
                                        <div style="font-size: 16px;font-weight: 500;letter-spacing: 0.64px;">
                                            ${btn.title}
                                        </div>
                                    </div>
                                `
                            }).join('')
                        },
                        divCreate: {
                            class: ``,
                            style: `display: flex;justify-content: space-between;margin-top: 24px;gap:15px;`
                        }
                    })}
                      ${PaymentPage.spaceView()}
                    <div class="mb-2" style="margin-top: 32px;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;">
                        配送方式
                    </div>
                    ${EditorElem.select({
                        title: '',
                        def: (obj.ogOrderData).user_info.shipment,
                        gvc: gvc,
                        array: PaymentPage.shipment_support(orderDetail),
                        callback: (text) => {
                            ((obj.ogOrderData).user_info.shipment as any) = text;
                            PaymentPage.storeHistory(obj.ogOrderData);
                            gvc.notifyDataChange(id)

                        }
                    })}
                    ${(() => {
                        if (['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].includes(obj.ogOrderData.user_info.shipment)) {
                            return `<div class="mb-2" style="margin-top: 14px;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;">
                        門市選擇
                    </div>
<div class="btn  w-100 text-white" style="background: ${(decodeURI(gvc.glitter.getUrlParameter('CVSStoreName') || '')) ? `#393939` : `#d6293e`};" onclick="${gvc.event(() => {
                                ApiShop.selectC2cMap(
                                    {
                                        returnURL: location.href,
                                        logistics: (obj.ogOrderData).user_info.shipment
                                    }
                                ).then(async (res) => {
                                    $('body').html(res.response.form);
                                    (document.querySelector('#submit') as any).click();
                                })
                            })}">
${(decodeURI(gvc.glitter.getUrlParameter('CVSStoreName') || '')) || '請選擇到店門市'}
</div>
`
                        } else if (obj.ogOrderData.user_info.shipment === 'normal') {
                            return `<input class="form-control mt-2" value="${obj.ogOrderData.user_info.address ?? ""}" onchange="${gvc.event((e, event) => {
                                obj.ogOrderData.user_info.address = e.value;
                            })}" placeholder="請輸入宅配地址">`
                        } else {
                            return ``
                        }
                    })()}
                    ${(() => {
                        if (obj.ogOrderData.user_info.shipment === 'now') {
                            return ``
                        } else {
                            return html`
                                ${PaymentPage.spaceView()}
                                <div class="mb-2" style="margin-top: 14px;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;">
                                    配送資訊
                                </div>
                                <div class="row  m-0 p-0 mb-n2">
                                  ${[{
                                      title:'收件人姓名',
                                      col:'6',
                                      type:'name',
                                      key:'name'
                                  },{
                                      title:'收件人電話',
                                      col:'6',
                                      type:'phone',
                                      key:'phone'
                                  },{
                                      title:'聯絡信箱',
                                      col:'12',
                                      type:'email',
                                      key:'email'
                                  }].map((dd)=>{
                                      return `<div class="mb-2 col-${dd.col} ps-0" style="">
                                        <div class="" style="  ">
                                            <div class="fw-normal mb-2 fs-6" style="color: black;
margin-bottom: 5px;
white-space: normal;">${dd.title}
                                            </div>
                                            <input class="form-control" style="form-control" placeholder="請輸入${dd.title}"
                                                   type="${dd.type}" value="${(obj.ogOrderData.user_info as any)[dd.key] || ''}" onchange="${gvc.event((e,event)=>{
                                          (obj.ogOrderData.user_info as any)[dd.key]=e.value;
                                      })}"></div>
                                    </div>`
                                  }).join('')}
                                </div>`
                        }
                    })()}
                  ${PaymentPage.spaceView()}
                    <div class="d-flex flex-column w-100" style="gap:16px;">
                        <div class="d-flex">
                            <div style="font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.72px;
text-transform: uppercase;">
                                小計總額
                            </div>
                            <div class="ms-auto"
                                 style="font-size: 16px;font-style: normal;font-weight: 700;letter-spacing: 0.64px;">
                                ${(Number((orderDetail.total)) + Number((orderDetail.discount)) - Number((orderDetail.shipment_fee))).toLocaleString()}
                            </div>
                        </div>
                          <div class="d-flex ">
                            <div style="font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.72px;
text-transform: uppercase;">
                                運費
                            </div>
                            <div class="ms-auto"
                                 style="font-size: 16px;font-style: normal;font-weight: 700;letter-spacing: 0.64px;">
                                ${(Number((orderDetail.shipment_fee))).toLocaleString()}
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <div style="font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.72px;
text-transform: uppercase;">
                                活動折扣
                                  <div class="d-flex align-items-start flex-column">
                            ${(orderDetail as any).voucherList.map((dd: any) => {
                        return `<div class="d-flex align-items-center" style="color: #8D8D8D;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.64px;
text-transform: uppercase;">${dd.title}</div>`
                    }).join(`<div class="my-2"></div>`)}
                        </div>
                            </div>
                            <div class="ms-auto"
                                 style="font-size: 16px;font-style: normal;font-weight: 700;letter-spacing: 0.64px;">
                                    -${orderDetail.discount.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div class="w-100" style="margin: 32px 0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="398" height="2"
                             viewBox="0 0 398 2" fill="none">
                            <path d="M0 1H398" stroke="#DDDDDD" stroke-dasharray="8 8"/>
                        </svg>
                    </div>
                    ${gvc.bindView(() => {
                        const vm_id=gvc.glitter.getUUID()
                        let realTotal=orderDetail.total
                        return {
                            bind: vm_id,
                            dataList: [
                                {obj: vm, key: 'paySelect'}
                            ],
                            view: () => {
                                let view = [
                                    `<div class="d-flex"
                             style="font-size: 18px;font-weight: 400;margin-bottom: 12px;">
                            <div style="">總金額</div>
                            <div class="ms-auto" style="">${parseInt(orderDetail.total as any, 10).toLocaleString()}
                            </div>
                        </div>`
                                ]
                                if (vm.paySelect === 'cash') {
                                    view.push(` <div class="d-flex" style="font-size: 16px;font-weight: 400;margin-bottom: 12px;">
                            <div class="d-flex align-items-center justify-content-center"
                                 style="color: #393939;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;">
                                收取現金
                            </div>
                            <input style="display: flex;width: 143px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;text-align: right;"
                                   class="ms-auto" value="${realTotal}"
                                   onchange="${gvc.event((e) => {
                                        realTotal = e.value
                                        gvc.notifyDataChange(vm_id)
                                    })}">
                        </div>
                        <div class="d-flex"
                             style="color: #393939;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;margin-bottom: 12px;">
                            <div style="">找零</div>
                            <div class="ms-auto" style="">${realTotal - parseInt(orderDetail.total as any, 10)}</div>
                        </div>`)
                                }
                                view.push(html`
                                    <div style="margin-top: 32px;display: flex;padding: 12px 24px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;color: #FFF;font-size: 18px;font-style: normal;font-weight: 500;line-height: normal;letter-spacing: 0.72px;"
                                         onclick="${gvc.event(() => {
                                             if (orderDetail.lineItems.length <= 0) {
                                                 dialog.errorMessage({text: '請先選擇商品!'})
                                                 return
                                             }
                                             if (obj.ogOrderData.user_info.shipment === 'normal' && !obj.ogOrderData.user_info.address) {
                                                 dialog.errorMessage({text: '請輸入地址!'})
                                                 return
                                             }
                                             if (['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].includes(obj.ogOrderData.user_info.shipment) && (!gvc.glitter.getUrlParameter('CVSStoreName'))) {
                                                 dialog.errorMessage({text: '請選擇到店門市!'})
                                                 return
                                             }
                                             //設定POS機資訊
                                             orderDetail.pos_info = {};
                                             orderDetail.pos_info.payment = vm.paySelect;
                                             orderDetail.user_info = obj.ogOrderData.user_info;
                                             let passData = JSON.parse(JSON.stringify(orderDetail))
                                             passData.total = orderDetail.total;
                                             passData.orderStatus = 1;
                                             passData.pay_status = 1;
                                             if (vm.paySelect === 'cash') {
                                                 PaymentPage.cashFinish(gvc, orderDetail, vm, passData)
                                             } else if (vm.paySelect === 'creditCard') {
                                                 PaymentPage.creditFinish(gvc, orderDetail, vm, passData)
                                             } else if (vm.paySelect === 'line'){
                                                 PaymentPage.lineFinish(gvc, orderDetail, vm, passData)
                                             }else{
                                                 PaymentPage.selectInvoice(gvc, orderDetail, vm, passData)
                                             }

                                         })}">前往結賬
                                    </div>`)
                                return view.join('')
                            },
                            divCreate: {
                                class: `d-flex flex-column w-100`
                            }
                        }
                    })}


                </div>`
                },
                divCreate: {
                    class: `${((document.body.offsetWidth < 800)) ? `w-100` : `d-flex flex-column flex-sm-row w-100`}`,
                    style: `overflow-y: auto;`
                }
            }
        })
    }

    public static spaceView(){
        return `  <div class="w-100" style="margin: 16px 0;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="398" height="2"
                             viewBox="0 0 398 2" fill="none">
                            <path d="M0 1H398" stroke="#DDDDDD" stroke-dasharray="8 8"/>
                        </svg>
                    </div>`
    }
    public static storeHistory(orderDetail: OrderDetail) {
        localStorage.setItem('pos_order_detail', JSON.stringify(orderDetail))
    }

    public static clearHistory() {
        localStorage.removeItem('pos_order_detail')
        const url = new URL(location.href)
        url.search = `?app-id=${(window as any).glitter.getUrlParameter('app-id')}`
        window.history.replaceState({}, document.title, url.href);
    }

    public static cashFinish(gvc: GVC, orderDetail: any, vm: any, passData: any) {
        gvc.addStyle(`
                .dialog-box {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                }

                .dialog-absolute {
                    width: 100%;
                    border-top: 1px solid #e2e5f1;
                    position: absolute;
                    left: 0px;
                    bottom: 0px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .hover-cancel {
                    background-color: #fff;
                    border-radius: 0 0 0 0.5rem;
                }

                .hover-cancel:hover {
                    background-color: #e6e6e6;
                }

                .hover-save {
                    background-color: #393939;
                    border-radius: 0 0 0.5rem;
                }

                .hover-save:hover {
                    background-color: #646464;
                }
            `);
        const dialog = new ShareDialog(gvc.glitter)
        gvc.glitter.innerDialog((gvc: GVC) => {
            return html`
                <div class="dialog-box">
                    <div class="dialog-content position-relative pb-5"
                         style="width: 452px;max-width: calc(100% - 20px);">
                        <div class="my-3 fs-6 fw-500 text-center"
                             style="white-space: normal; overflow-wrap: anywhere;font-size: 28px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;">
                            請先收取現金後進行結帳
                        </div>
                        <div style="font-size: 18px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.72px;">
                            本次結帳金額為 <span
                                style="font-size: 28px;font-style: normal;font-weight: 700;line-height: 160%;">$${orderDetail.total.toLocaleString()}</span>
                        </div>
                        <div class="d-flex align-items-center justify-content-center"
                             style="margin-top: 24px;font-size: 16px;font-weight: 700;letter-spacing: 0.64px;">
                            <div style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;width:120px;text-align:center;"
                                 onclick="${gvc.event(() => {
                                     gvc.glitter.closeDiaLog()
                                 })}">取消
                            </div>
                            <div style="border-radius: 10px;background: #393939;padding: 12px 24px;color: #FFF;margin-left: 24px;width:120px;text-align:center;"
                                 onclick="${gvc.event(() => {
                                     gvc.closeDialog()
                                     PaymentPage.selectInvoice(gvc, orderDetail, vm, passData)
                                 })}">下一步
                            </div>
                        </div>
                    </div>
                </div>
            `
        }, 'orderFinish', {
            dismiss: () => {
                // vm.type = "list";
            }
        })
    }

    public static creditFinish(gvc: GVC, orderDetail: any, vm: any, passData: any) {
        gvc.addStyle(`
                .dialog-box {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                }

                .dialog-absolute {
                    width: 100%;
                    border-top: 1px solid #e2e5f1;
                    position: absolute;
                    left: 0px;
                    bottom: 0px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .hover-cancel {
                    background-color: #fff;
                    border-radius: 0 0 0 0.5rem;
                }

                .hover-cancel:hover {
                    background-color: #e6e6e6;
                }

                .hover-save {
                    background-color: #393939;
                    border-radius: 0 0 0.5rem;
                }

                .hover-save:hover {
                    background-color: #646464;
                }
            `);
        const dialog = new ShareDialog(gvc.glitter)
        function next(){
            PaymentPage.selectInvoice(gvc, orderDetail, vm, passData)
        }
        gvc.glitter.innerDialog((gvc: GVC) => {
            gvc.glitter.runJsInterFace('credit_card', {
                amount:`${orderDetail.total}`,
                memo:orderDetail.lineItems.map((data:any)=>{
                    return `${data.title} * ${data.count}`
                }).join(',')
            }, (res:any) => {
                if(res.result){
                    gvc.closeDialog()
                    next()
                }else{
                    gvc.closeDialog()
                    dialog.errorMessage({text:'交易失敗'})
                }
            });
            return html`
                <div class="dialog-box">
                    <div class="dialog-content position-relative "
                         style="width: 370px;max-width: calc(100% - 20px);">
                        <div class="my-3  fw-500 text-center"
                             style="white-space: normal; overflow-wrap: anywhere;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;">
                            請感應或插入信用卡進行付款
                        </div>
                        <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.72px;">
                            若逾時將重新選擇付款方式
                        </div>
                        <img class="mt-3" style="max-width:70%;"
                             src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_scsds7s8sbsfs3s8_b00f1f368f2a9b9fb067a844f940ca2a.gif"></img>
                        <div class="fw-500 w-100 mt-3"
                             style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;width:120px;text-align:center;"
                             onclick="${gvc.event(() => {
                                 // clearTimeout(timer)
                                 gvc.glitter.closeDiaLog()
                             })}">取消付款
                        </div>
                    </div>
                </div>
            `
        }, 'orderFinish', {
            dismiss: () => {
                // vm.type = "list";
            }
        })
    }

    public static lineFinish(gvc: GVC, orderDetail: any, vm: any, passData: any) {
        gvc.addStyle(`
                .dialog-box {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                }

                .dialog-absolute {
                    width: 100%;
                    border-top: 1px solid #e2e5f1;
                    position: absolute;
                    left: 0px;
                    bottom: 0px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .hover-cancel {
                    background-color: #fff;
                    border-radius: 0 0 0 0.5rem;
                }

                .hover-cancel:hover {
                    background-color: #e6e6e6;
                }

                .hover-save {
                    background-color: #393939;
                    border-radius: 0 0 0.5rem;
                }

                .hover-save:hover {
                    background-color: #646464;
                }
            `);
        const dialog = new ShareDialog(gvc.glitter)
        function next(){
            PaymentPage.selectInvoice(gvc, orderDetail, vm, passData)
        }

        gvc.glitter.innerDialog((gvc: GVC) => {
            gvc.glitter.share.scan_back=(text:string)=>{
                LinePay.pay(orderDetail.orderID,orderDetail.lineItems.map((data:any)=>{
                    return `${data.title} * ${data.count}`
                }).join(','),orderDetail.total,text)
            }
            // gvc.glitter.runJsInterFace('credit_card', {
            //     amount:`${orderDetail.total}`,
            //     memo:orderDetail.lineItems.map((data:any)=>{
            //         return `${data.title} * ${data.count}`
            //     }).join(',')
            // }, (res:any) => {
            //     if(res.result){
            //         gvc.closeDialog()
            //         next()
            //     }else{
            //         gvc.closeDialog()
            //         dialog.errorMessage({text:'交易失敗'})
            //     }
            // });
            return html`
                <div class="dialog-box">
                    <div class="dialog-content position-relative "
                         style="width: 370px;max-width: calc(100% - 20px);">
                        <div class="my-3  fw-500 text-center"
                             style="white-space: normal; overflow-wrap: anywhere;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;">
                            請掃描LINE付款條碼
                        </div>
                        <img class="mt-3" style="max-width:70%;"
                             src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s6sfs4scs5s3s0sa_Screenshot2024-09-06at12.28.00 PM.jpg"></img>
                        <div class="fw-500 w-100 mt-3"
                             style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;width:120px;text-align:center;"
                             onclick="${gvc.event(() => {
                // clearTimeout(timer)
                gvc.glitter.closeDiaLog()
            })}">取消付款
                        </div>
                    </div>
                </div>
            `
        }, 'orderFinish', {
            dismiss: () => {
                // vm.type = "list";
                gvc.glitter.share.scan_back=()=>{}
            }
        })
    }

    public static async selectInvoice(gvc: GVC, orderDetail: any, vm: any, passData: any) {
        const dialog = new ShareDialog(gvc.glitter)
        const c_vm: {
            invoice_select: 'print' | 'carry' | 'company',
            value: any
        } = {
            invoice_select: 'print',
            value: ''
        }

        function next() {
            if (c_vm.invoice_select === 'carry') {
                if (!c_vm.value) {
                    dialog.infoMessage({text: '請輸入載具!'})
                    return
                } else {
                    passData.user_info = {
                        send_type: 'carrier',
                        carrier_num: c_vm.value,
                        invoice_type: 'me'
                    }
                }
            } else if (c_vm.invoice_select === 'company') {
                if (!c_vm.value) {
                    dialog.infoMessage({text: '請輸入統一編號!'})
                    return
                } else {
                    passData.user_info = {
                        company: 'un_fill',
                        gui_number: c_vm.value,
                        invoice_type: 'company'
                    }
                }
            }
            passData.user_info.shipment = orderDetail.user_info.shipment
            if (orderDetail.user_info.shipment === 'normal') {
                passData.user_info.address = orderDetail.user_info.address;
            } else if (['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].includes(orderDetail.user_info.shipment)) {
                ['CVSAddress', 'CVSOutSide', 'CVSStoreID', 'CVSStoreName', 'LogisticsSubType'].map((dd) => {
                    passData.user_info[dd] = decodeURIComponent(gvc.glitter.getUrlParameter(dd))
                })
            }
            gvc.glitter.closeDiaLog()
            dialog.dataLoading({
                visible: true,
                text: `訂單成立中`
            });
            passData.user_info.email=passData.user_info.email || 'no-email'
            ApiShop.toPOSCheckout(passData).then(res => {
                if (!res.result) {
                    dialog.dataLoading({visible: false})
                    if (c_vm.invoice_select === 'company') {
                        dialog.errorMessage({text: '請確認統編是否輸入正確'})
                    } else if (c_vm.invoice_select === 'carry') {
                        dialog.errorMessage({text: '請確認載具是否輸入正確'})
                    } else {
                        dialog.errorMessage({text: '系統異常'})
                    }
                } else {
                    PaymentPage.clearHistory()
                    if (res.response.data.invoice && (c_vm.invoice_select !== 'carry')) {
                        gvc.glitter.runJsInterFace('print_invoice', res.response.data.invoice, () => {});
                    }
                    dialog.dataLoading({visible: false})
                    orderDetail.lineItems = [];
                    gvc.glitter.share.clearOrderData()
                    vm.type = 'menu'
                    gvc.glitter.innerDialog((gvc: GVC) => {
                        return html`
                            <div class="w-100 h-100 d-flex align-items-center justify-content-center"
                                 onclick="${gvc.event(() => {
                                     gvc.closeDialog()
                                 })}">
                                <div style="position: relative;max-width:calc(100% - 20px);width: 492px;height: 223px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;align-items: center;justify-content: center;"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="14"
                                         height="14"
                                         viewBox="0 0 14 14"
                                         fill="none"
                                         style="position: absolute;top: 12px;right: 12px;cursor: pointer;"
                                         onclick="${gvc.event(() => {
                                             gvc.glitter.closeDiaLog();
                                         })}">
                                        <path d="M1 1L13 13"
                                              stroke="#393939"
                                              stroke-linecap="round"/>
                                        <path d="M13 1L1 13"
                                              stroke="#393939"
                                              stroke-linecap="round"/>
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         width="75"
                                         height="75"
                                         viewBox="0 0 75 75"
                                         fill="none">
                                        <g clip-path="url(#clip0_9850_171427)">
                                            <path d="M37.5 7.03125C45.5808 7.03125 53.3307 10.2413 59.0447 15.9553C64.7587 21.6693 67.9688 29.4192 67.9688 37.5C67.9688 45.5808 64.7587 53.3307 59.0447 59.0447C53.3307 64.7587 45.5808 67.9688 37.5 67.9688C29.4192 67.9688 21.6693 64.7587 15.9553 59.0447C10.2413 53.3307 7.03125 45.5808 7.03125 37.5C7.03125 29.4192 10.2413 21.6693 15.9553 15.9553C21.6693 10.2413 29.4192 7.03125 37.5 7.03125ZM37.5 75C47.4456 75 56.9839 71.0491 64.0165 64.0165C71.0491 56.9839 75 47.4456 75 37.5C75 27.5544 71.0491 18.0161 64.0165 10.9835C56.9839 3.95088 47.4456 0 37.5 0C27.5544 0 18.0161 3.95088 10.9835 10.9835C3.95088 18.0161 0 27.5544 0 37.5C0 47.4456 3.95088 56.9839 10.9835 64.0165C18.0161 71.0491 27.5544 75 37.5 75ZM54.0527 30.6152C55.4297 29.2383 55.4297 27.0117 54.0527 25.6494C52.6758 24.2871 50.4492 24.2725 49.0869 25.6494L32.8271 41.9092L25.9424 35.0244C24.5654 33.6475 22.3389 33.6475 20.9766 35.0244C19.6143 36.4014 19.5996 38.6279 20.9766 39.9902L30.3516 49.3652C31.7285 50.7422 33.9551 50.7422 35.3174 49.3652L54.0527 30.6152Z"
                                                  fill="#393939"/>
                                        </g>
                                        <defs>
                                            <clipPath
                                                    id="clip0_9850_171427">
                                                <rect width="75"
                                                      height="75"
                                                      fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div style="text-align: center;color: #393939;font-size: 16px;font-weight: 400;line-height: 160%;margin-top: 24px;">
                                        訂單新增成功！
                                    </div>
                                </div>
                            </div>
                        `
                    }, 'orderFinish', {
                        dismiss: () => {
                            // vm.type = "list";
                        }
                    })
                }


            })
        }

        //不開立電子發票直接執行
        if ((await ApiShop.getInvoiceType()).response.method === 'nouse') {
            next()
        } else {
            gvc.glitter.innerDialog((gvc: GVC) => {

                return html`
                    <div class="dialog-box">
                        <div class="dialog-content position-relative"
                             style="width: 452px;max-width: calc(100% - 20px);">
                            <div class="mb-3 fs-6 fw-500 text-center"
                                 style="white-space: normal; overflow-wrap: anywhere;font-size: 28px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;">
                                選擇發票開立方式
                            </div>
                            <div class="d-flex align-items-center w-100">
                                ${(() => {
                                    let btnArray = [
                                        {
                                            title: `列印`,
                                            value: 'print',
                                            icon: `<i class="fa-regular fa-print"></i>`
                                        },
                                        {
                                            title: `載具`,
                                            value: 'carry',
                                            icon: `<i class="fa-regular fa-mobile"></i>`
                                        },
                                        {
                                            title: `統編`,
                                            value: 'company',
                                            icon: `<i class="fa-regular fa-building"></i>`
                                        },
                                    ]
                                    return btnArray.map((btn) => {
                                        return html`
                                            <div class="flex-fill"
                                                 style="display: flex;flex-direction: column;justify-content: center;align-items: center;padding:  20px;border-radius: 10px;background: #F6F6F6;${(c_vm.invoice_select == btn.value) ? `color:#393939;border-radius: 10px;border: 3px solid #393939;box-shadow: 2px 2px 15px 0px rgba(0, 0, 0, 0.20);` : 'color:#8D8D8D;'}"
                                                 onclick="${gvc.event(() => {
                                                     c_vm.invoice_select = btn.value as any
                                                     gvc.recreateView()
                                                 })}">
                                                <div style="" class="fs-2">
                                                    ${btn.icon}
                                                </div>
                                                <div style="font-size: 16px;font-weight: 500;letter-spacing: 0.64px;">
                                                    ${btn.title}
                                                </div>
                                            </div>
                                        `
                                    }).join('<div class="mx-2"></div>')
                                })()}
                            </div>
                            ${(() => {
                                if (c_vm.invoice_select === 'carry') {
                                    c_vm.value = ''
                                    return `  <div class="d-flex w-100 align-items-center mt-3" style="border:1px solid grey;height: 50px;">
                            <input class="form-control h-100" style="border: none;" placeholder="請輸入或掃描載具" oninput="${gvc.event((e, event) => {
                                        c_vm.value = e.value;
                                    })}">
                            <div class="flex-fill"></div>
                            <div style="background: grey;width: 50px;" class="d-flex align-items-center justify-content-center text-white h-100">
                                <i class="fa-regular fa-barcode-read"></i>
                            </div>
                        </div>`
                                } else if (c_vm.invoice_select === 'company') {
                                    return `<div class="d-flex w-100 align-items-center mt-3" style="border:1px solid grey;height: 50px;">
                            <input class="form-control h-100" style="border: none;" placeholder="請輸入統一編號" oninput="${gvc.event((e, event) => {
                                        c_vm.value = e.value;
                                    })}">
                            <div class="flex-fill"></div>
                            <div style="background: grey;width: 50px;" class="d-flex align-items-center justify-content-center text-white h-100">
                                <i class="fa-regular fa-barcode-read"></i>
                            </div>
                        </div>`
                                } else {
                                    return ``
                                }
                            })()}
                            <div class="d-flex align-items-center justify-content-center w-100"
                                 style="margin-top: 24px;font-size: 16px;font-weight: 700;letter-spacing: 0.64px;">
                                <div class="flex-fill"
                                     style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;text-align:center;"
                                     onclick="${gvc.event(() => {
                                         gvc.glitter.closeDiaLog()
                                     })}">取消
                                </div>
                                <div class="mx-2"></div>
                                <div class="flex-fill"
                                     style="border-radius: 10px;background: #393939;padding: 12px 24px;color: #FFF;text-align:center;"
                                     onclick="${gvc.event(() => {
                                         next()
                                     })}">確定
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }, 'selectInvoice', {
                dismiss: () => {
                    // vm.type = "list";
                }
            })
        }

    }
}