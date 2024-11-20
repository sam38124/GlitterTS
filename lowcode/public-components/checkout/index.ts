import {GVC} from '../../glitterBundle/GVController.js';
import {ApiShop} from '../../glitter-base/route/shopping.js';
import {GlobalUser} from '../../glitter-base/global/global-user.js';
import {CheckInput} from '../../modules/checkInput.js';
import {Tool} from '../../modules/tool.js';
import {ApiCart, CartItem} from '../../glitter-base/route/api-cart.js';
import {ApiDelivery} from "../../glitter-base/route/delivery.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {FormCheck} from "../../cms-plugin/module/form-check.js";
import {UmClass} from "../user-manager/um-class.js";
import {FormWidget} from "../../official_view_component/official/form.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {Voucher as OriginVoucher,VoucherContent} from '../user-manager/um-voucher.js'

const html = String.raw;
const css = String.raw;

interface UserVoucher extends VoucherContent {
    usePass: boolean;
}
interface Voucher extends OriginVoucher {
    content: UserVoucher;
}

export class CheckoutIndex {
    static main(gvc: GVC, widget: any, subData: any) {
        const glitter = gvc.glitter;
        const ids = {
            page: glitter.getUUID(),
            cart: glitter.getUUID(),
        };
        const loadings = {
            page: true,
        };
        const vm = {
            cartData: {
                customer_info: {},
                lineItems: [
                    {
                        spec: ['黑色', '小號'],
                        id: 710,
                        count: 1,
                        preview_image:
                            'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                        title: '溫德米爾 茶几',
                        sale_price: 1800,
                        collection: ['折扣專區'],
                        sku: '',
                        shipment_obj: {
                            type: 'weight',
                            value: 1,
                        },
                        discount_price: 0,
                        rebate: 0,
                    },
                ],
                total: 1800,
                email: 'daniel.lin@ncdesign.info',
                user_info: {
                    shipment: '',
                },
                shipment_fee: 0,
                rebate: 0,
                use_rebate: 0,
                orderID: '1732015169389',
                shipment_support: ['OKMARTC2C', 'shop', 'FAMIC2C', 'UNIMARTC2C'],
                shipment_info:
                    '<p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\' id="isPasted">感謝您在 SHOPNEX 購買商品，商品的包裝與配送</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>預計花費約 3 到 6 週，煩請耐心等候！</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>若約定配送日當天未能聯繫到你，因而無法完成配送</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>商家會約定再次配送的時間，您將支付額外的運費。</p>',
                shipment_selector: [
                    {
                        name: '全家店到店',
                        value: 'FAMIC2C',
                    },
                    {
                        name: 'OK超商店到店',
                        value: 'OKMARTC2C',
                    },
                    {
                        name: '7-ELEVEN超商交貨便',
                        value: 'UNIMARTC2C',
                    },
                    {
                        name: '實體門市取貨',
                        value: 'shop',
                    },
                ],
                use_wallet: 0,
                user_email: 'daniel.lin@ncdesign.info',
                useRebateInfo: {
                    point: 0,
                },
                orderSource: '',
                code_array: [],
                give_away: [],
                user_rebate_sum: 0,
                voucherList: [],
                discount: 0,
                payment_setting: {
                    TYPE: 'newWebPay',
                },
                off_line_support: {
                    atm: true,
                    line: true,
                    cash_on_delivery: true,
                },
                payment_info_line_pay: {
                    text: '<p>您選擇了線下Line Pay付款。請完成付款後，提供證明截圖(圖一)，或是照著(圖二)的流程擷取『付款詳細資訊』並上傳，以便我們核款。&nbsp;</p><p><br><img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924978722-Frame%205078.png" class="fr-fic fr-dii" style="width: 230px;">&nbsp;<img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924973580-Frame%205058.png" class="fr-fic fr-dii" style="width: 582px;"></p><p><br></p>',
                },
                payment_info_atm: {
                    text: '<p id="isPasted">當日下單匯款，隔日出貨，後天到貨。</p><p>若有需要統一編號 請提早告知</p><p>------------------------------------------------------------------</p><p>＊採臨櫃匯款者，電匯單上匯款人姓名與聯絡電話請務必填寫。</p>',
                    bank_code: '812',
                    bank_name: '台新銀行',
                    bank_user: '陳女士',
                    bank_account: '888800004567',
                },
            } as any,
        };
        const noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
        const classPrefix = Tool.randomString(6);

        function spinner(obj?: {
            container?: {
                class?: string;
                style?: string;
            };
            circle?: {
                visible?: boolean;
                width?: number;
                borderSize?: number;
            };
            text?: {
                value?: string;
                visible?: boolean;
                fontSize?: number;
            };
        }) {
            const container = {
                class: `${obj?.container?.class ?? ''}`,
                style: `margin-top: 2rem ;${obj?.container?.style}`,
            };
            const circleAttr = {
                visible: obj?.circle?.visible === false ? false : true,
                width: obj?.circle?.width ?? 20,
                borderSize: obj?.circle?.borderSize ?? 16,
            };
            const textAttr = {
                value: obj?.text?.value ?? '載入中...',
                visible: obj?.text?.visible === false ? false : true,
                fontSize: obj?.text?.fontSize ?? 16,
            };
            return html`
                <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}"
                     style="${container.style}">
                    <div
                            class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
                            style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
                            role="status"
                    ></div>
                    <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}"
                          style="font-size: ${textAttr.fontSize}px;">${textAttr.value}</span>
                </div>`;
        }

        function isImageUrlValid(url: string): Promise<boolean> {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        }

        function validImageBox(obj: {
            gvc: GVC;
            image: string;
            width: number;
            height?: number;
            class?: string;
            style?: string
        }) {
            const imageVM = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                url: noImageURL,
            };
            const wh = `
                display: flex;
                min-width: ${obj.width}px;
                min-height: ${obj.height ?? obj.width}px;
                max-width: ${obj.width}px;
                max-height: ${obj.height ?? obj.width}px;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            `;
            return obj.gvc.bindView({
                bind: imageVM.id,
                view: () => {
                    if (imageVM.loading) {
                        return obj.gvc.bindView(() => {
                            return {
                                bind: obj.gvc.glitter.getUUID(),
                                view: () => {
                                    return spinner({
                                        container: {class: 'mt-0'},
                                        text: {visible: false},
                                    });
                                },
                                divCreate: {
                                    style: `${wh}${obj.style ?? ''}`,
                                    class: obj.class ?? '',
                                },
                            };
                        });
                    } else {
                        return obj.gvc.bindView(() => {
                            return {
                                bind: obj.gvc.glitter.getUUID(),
                                view: () => {
                                    return '';
                                },
                                divCreate: {
                                    elem: 'img',
                                    style: `${wh}${obj.style ?? ''}`,
                                    class: obj.class ?? '',
                                    option: [
                                        {
                                            key: 'src',
                                            value: imageVM.url,
                                        },
                                    ],
                                },
                            };
                        });
                    }
                },
                onCreate: () => {
                    if (imageVM.loading) {
                        isImageUrlValid(obj.image).then((isValid) => {
                            if (isValid) {
                                imageVM.url = obj.image;
                            }
                            imageVM.loading = false;
                            obj.gvc.notifyDataChange(imageVM.id);
                        });
                    }
                },
            });
        }

        function gClass(text: string | string[]): string {
            if (Array.isArray(text)) {
                return text.map((c) => gClass(c)).join(' ');
            }
            return `${classPrefix}-${text}`;
        }

        function addItemBadge() {
            return html`
                <div class="${gClass('add-item-badge')}">
                    <div class="${gClass('add-item-text')}">加購品</div>
                </div>`;
        }

        function addStyle() {
            gvc.addStyle(css`
            .${classPrefix}-container {
                max-width: 70% !important;
                margin: 2.5rem auto !important;
            }

            .${classPrefix}-null-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100vh !important;
            }

            .${classPrefix}-header {
                color: #393939;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 12px;
                text-align: center;
                margin-bottom: 24px;
            }

            .${classPrefix}-banner-bgr {
                padding: 1rem;
                border-radius: 10px;
                background: #f6f6f6;
            }

            .${classPrefix}-banner-text {
                color: #393939;
                font-size: 18px;
                font-weight: 700;
                letter-spacing: 2px;
            }

            .${classPrefix}-text-1 {
                color: #393939;
                font-size: 20px;
            }

            .${classPrefix}-text-2 {
                color: #393939;
                font-size: 16px;
            }

            .${classPrefix}-text-3 {
                color: #393939;
                font-size: 14px;
            }

            .${classPrefix}-label {
                color: #393939;
                font-size: 16px;
                margin-bottom: 8px;
            }

            .${classPrefix}-bold {
                font-weight: 700;
            }

            .${classPrefix}-button-bgr {
                width: 100%;
                border: 0;
                border-radius: 0.375rem;
                height: 40px;
                background: #393939;
                padding: 0 24px;
                margin: 18px 0;
            }

            .${classPrefix}-button-bgr-disable {
                width: 100%;
                border: 0;
                border-radius: 0.375rem;
                height: 40px;
                background: #DDDDDD;
                padding: 0 24px;
                margin: 18px 0;
            }

            .${classPrefix}-button-text {
                color: #fff;
                font-size: 16px;
            }

            .${classPrefix}-input {
                width: 100%;
                border-radius: 10px;
                border: 1px solid #ddd;
                height: 40px;
                padding: 0px 18px;
            }

            .${classPrefix}-select {
                display: flex;
                padding: 7px 30px 7px 18px;
                max-height: 40px;
                align-items: center;
                gap: 6px;
                border-radius: 10px;
                border: 1px solid #ddd;
                background: transparent url('https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1718100926212-Vector 89.png') no-repeat;
                background-position-x: calc(100% - 12px);
                background-position-y: 16px;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
            }

            .${classPrefix}-select:focus {
                outline: 0;
            }

            .${classPrefix}-group-input {
                border:none;
                background:none;
                text-align: start; 
                color: #393939; 
                font-size: 16px; 
                font-weight: 400; 
                word-wrap: break-word;
                padding-left: 12px;
            }

            .${classPrefix}-group-input:focus {
                outline: 0;
            }

            .${classPrefix}-group-button {
                padding: 9px 18px;
                background: #393939;
                align-items: center;
                gap: 5px;
                display: flex;
                font-size: 16px;
                justify-content: center;
                cursor: pointer;
            }

            .${classPrefix}-td {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 15%;
            }

            .${classPrefix}-first-td {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40%;
            }

            .${classPrefix}-price-container {
                display: flex;
                flex-direction: column;
                width: 400px;
                align-items: center;
                padding: 0;
                gap: 12px;
                margin: 24px 0;
            }

            .${classPrefix}-price-row {
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: space-between;
            }

            .${classPrefix}-origin-price {
                text-align: end;
                font-weight: 400;
                word-wrap: break-word;
                text-decoration: line-through;
                color: #636363;
                font-style: italic;
                margin-top: auto;
            }

            .${classPrefix}-add-item-badge {
                height: 22px;
                padding-left: 6px;
                padding-right: 6px;
                padding-top: 4px;
                padding-bottom: 4px;
                background: #ffe9b2;
                border-radius: 7px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                display: inline-flex;
            }

            .${classPrefix}-add-item-text {
                color: #393939;
                font-size: 14px;
                font-weight: 400;
                word-wrap: break-word;
            }
            `);
            gvc.addStyle(css`
                @media (max-width: 768px) {
                    .${classPrefix}-container {
                        max-width: 100% !important;
                        margin: 2.5rem auto !important;
                    }
                    .${classPrefix}-td {
                        display: flex;
                        align-items: center;
                        justify-content: start;
                        width: 100%;
                    }
                }`)
        }

        function refreshCartData() {
            loadings.page=true;
            gvc.notifyDataChange(ids.page)
        }

        return gvc.bindView(
            (() => {
                return {
                    bind: ids.page,
                    view: () => {
                        try {
                            if (loadings.page) {
                                return spinner();
                            }

                            this.initial(vm.cartData)
                            addStyle();
                            if (vm.cartData.lineItems.length === 0) {
                                return html`
                                    <div class="container ${gClass(['container', 'null-container'])}">
                                        <div class="${gClass('header')}">購物明細</div>
                                        <lottie-player
                                                style="max-width: 100%; width: 300px; height: 300px;"
                                                src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
                                                speed="1"
                                                loop=""
                                                autoplay=""
                                                background="transparent"
                                        ></lottie-player>
                                        <div class="mt-3 fw-bold">購物車是空的，趕快前往挑選您心儀的商品</div>
                                    </div> `;
                            }
                            return html`
                                <div class="container ${gClass('container')}">
                                    <div class="${gClass('header')}">購物明細</div>
                                    ${gvc.bindView(
                                            (() => {
                                                return {
                                                    bind: ids.cart,
                                                    view: () => {
                                                        return html`
                                                            <section>
                                                                <div class="${gClass('banner-bgr')}">
                                                                    <span class="${gClass('banner-text')}">購物車</span>
                                                                </div>
                                                                <div class="d-none d-sm-flex align-items-center p-3 border-bottom">
                                                                    <div class="${gClass('first-td')}">商品名稱</div>
                                                                    <div class="${gClass('td')}">規格</div>
                                                                    <div class="${gClass('td')}">單價</div>
                                                                    <div class="${gClass('td')}">數量</div>
                                                                    <div class="${gClass('td')}">小計</div>
                                                                </div>
                                                                ${gvc.bindView({
                                                                    bind: glitter.getUUID(),
                                                                    view: () => {
                                                                        return vm.cartData.lineItems
                                                                                .map((item: any,index:number) => {
                                                                                    console.log(`item=>`,item);
                                                                                    return html`
                                                                                     <div class="d-flex w-100 border-bottom p-lg-3 px-1 py-3 position-relative" style="gap:20px;">
                                                                                         <div class="${gClass('first-td')} justify-content-start  d-sm-none">
                                                                                             ${validImageBox({
                                                                                                 gvc,
                                                                                                 image: noImageURL,
                                                                                                 width: 100,
                                                                                             })}
                                                                                             <span class="ms-2 d-none">${item.title}${item.is_add_on_items ? addItemBadge() : ''}</span>
                                                                                         </div>
                                                                                           <div class="d-flex flex-sm-row    flex-column w-100 position-relative"
                                                                                             style="gap: 10px; position: relative;">
                                                                                            <div class="${gClass('first-td')} justify-content-start d-none d-sm-flex">
                                                                                                ${validImageBox({
                                                                                        gvc,
                                                                                        image: noImageURL,
                                                                                        width: 100,
                                                                                    })}
                                                                                                <span class="ms-2 ">${item.title}${item.is_add_on_items ? addItemBadge() : ''}</span>
                                                                                            </div>
                                                                                            <div class="${gClass('td')}">
                                                                                                ${item.spec ? item.spec.join(' / ') : ''}
                                                                                            </div>
                                                                                            <div class="${gClass('td')}">
                                                                                                <div class="${subData.discount_price ? ``:`d-none`}">
                                                                                                    ${(() => {
                                                                                        function financial(x: number) {
                                                                                            const parsed = Number.parseFloat(`${x}`);

                                                                                            // 如果數字是整數，直接返回帶千分位的整數
                                                                                            if (Number.isInteger(parsed)) {
                                                                                                return parsed.toLocaleString();
                                                                                            }

                                                                                            // 將數字轉換為字串，保留小數點後的原始數字以進行判斷
                                                                                            const decimalPart = parsed.toString().split('.')[1];

                                                                                            // 根據小數位數的不同情況做處理
                                                                                            if (decimalPart && decimalPart.length > 1) {
                                                                                                return parsed.toLocaleString(undefined, {
                                                                                                    minimumFractionDigits: 1,
                                                                                                    maximumFractionDigits: 1
                                                                                                });
                                                                                            } else {
                                                                                                return parsed.toLocaleString(undefined, {
                                                                                                    minimumFractionDigits: 1,
                                                                                                    maximumFractionDigits: 3
                                                                                                });
                                                                                            }
                                                                                        }

                                                                                        return `NT.${financial(subData.sale_price - subData.discount_price)}`;
                                                                                    })()}
                                                                                                </div>
                                                                                                <div>原價: NT.
                                                                                                    ${item.sale_price.toLocaleString()}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="${gClass('td')}">
                                                                                                <select
                                                                                                        class="${gClass('select')}"
                                                                                                        style="width: 100px;"
                                                                                                        onchange="${gvc.event((e) => {
                                                                                        item.count = parseInt(e.value, 10);
                                                                                        gvc.notifyDataChange(ids.cart);
                                                                                    })}"
                                                                                                >
                                                                                                    ${[...new Array(99)].map((_, index) => {
                                                                                        return html`
                                                                                                            <option value="${index + 1}" ${(index + 1 === item.count) ? `selected`:``}>
                                                                                                                ${index + 1}
                                                                                                            </option>`;
                                                                                    })}
                                                                                                </select>
                                                                                            </div>
                                                                                               <div class="d-block d-md-none" style="position: absolute; right: 0px; top:0px;">
                                                                                                   <i class="fa-solid fa-xmark-large"
                                                                                                      style="cursor: pointer;" onclick="${gvc.event(()=>{
                                                                                                       vm.cartData.lineItems.splice(index,1)
                                                                                                       refreshCartData()
                                                                                                   })}"></i>
                                                                                               </div>
                                                                                               <span class="d-block d-md-none" style="position: absolute;bottom:0px;right:0px;">合計 NT. ${(item.sale_price * item.count).toLocaleString()}</span>
                                                                                            <div class="${gClass('td')}  d-none d-md-flex" style="bottom:0px;right:10px;">
                                                                                                <span class="d-none d-md-block">合計 NT. ${(item.sale_price * item.count).toLocaleString()}</span>
                                                                                                <div class="d-none d-md-block" style="position: absolute; right: 0px; transform: translateY(-50%); top: 50%;">
                                                                                                    <i class="fa-solid fa-xmark-large"
                                                                                                       style="cursor: pointer;" onclick="${gvc.event(()=>{
                                                                                        vm.cartData.lineItems.splice(index,1)
                                                                                        refreshCartData()
                                                                                    })}"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                     </div>
                                                                                      `;
                                                                                })
                                                                                .join('');
                                                                    },
                                                                })}
                                                            </section>
                                                            <section class="d-flex">
                                                            <div class="flex-fill"></div>
                                                            <div class="${gClass('price-container')}">
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>小計總額(合計)</div>
                                                                    <div>NT. ${(vm.cartData.total + vm.cartData.discount - vm.cartData.shipment_fee + vm.cartData.use_rebate).toLocaleString()}</div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>運費</div>
                                                                    <div>NT. ${vm.cartData.shipment_fee.toLocaleString()}</div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>優惠代碼</div>
                                                                    <div style="cursor: pointer; color: #3564c0;" onclick="${gvc.event(()=>{
this.viewDialog({
    gvc: gvc,
    title: '可使用的優惠券',
    tag: '',
    innerHTML: (gvc: GVC) => {
        return gvc.bindView(
            (() => {
                const id = glitter.getUUID();
                const vmi = {
                    dataList: [] as Voucher[],
                }
                const isWebsite = document.body.clientWidth > 768;
                let loading = true;
                return {
                    bind: id,
                    view: () => {
                        if (loading) {
                            return html`<div style="height: 400px">${spinner()}</div>`;
                        } else {
                            if (vmi.dataList.length === 0) {
                                return html`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                                    <lottie-player
                                        style="max-width: 100%;width: 300px;"
                                        src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                        speed="1"
                                        loop="true"
                                        background="transparent"
                                    ></lottie-player>
                                    <span class="mb-5 fs-5">目前沒有任何優惠券呦</span>
                                </div>`;
                            }

                            const header = [
                                {
                                    title: '優惠券名稱',
                                },
                                {
                                    title: '優惠券代碼',
                                },
                                {
                                    title: '使用期限',
                                },
                                {
                                    title: '',
                                },
                            ];

                        
                            function formatText(item: UserVoucher) {
                                return [
                                    item.title,
                                    item.code,
                                    (() => {
                                        const endText = item.end_ISO_Date ? glitter.ut.dateFormat(new Date(item.end_ISO_Date), 'yyyy/MM/dd') : '無使用期限';
                                        return `${glitter.ut.dateFormat(new Date(item.start_ISO_Date), 'yyyy/MM/dd')} ~ ${endText}`;
                                    })(),
                                    item.usePass ? html`<button
                                        class="${gClass('button-bgr')} my-2"
                                        style="max-width: 150px;"
                                        onclick="${gvc.event(() => {
                                            vm.cartData.code =item.code
                                            refreshCartData();
                                            gvc.closeDialog();
                                        })}"
                                    >
                                        <span 
                                        class="${gClass('button-text')}">選擇使用</span>
                                    </button>` :
                                     html`<button
                                        class="${gClass('button-bgr-disable')} my-2"
                                        style="max-width: 150px; cursor: not-allowed"
                                    >
                                        <span 
                                        class="${gClass('button-text')}">未達使用標準</span>
                                    </button>` ,
                                ];
                            }

                            const dialog = new ShareDialog(gvc.glitter);

                            const cloneCart = JSON.parse(JSON.stringify(vm.cartData))

                            function checkCodeValue(code:string){
                                cloneCart.code = code
                                     cloneCart.line_items = cloneCart.lineItems 
                                     dialog.dataLoading({visible: true});
                                     ApiShop.getCheckout(cloneCart).then((r) => {
                                        dialog.dataLoading({visible: false});
                                        if(r.result && r.response.data && r.response.data.voucherList.length > 0){
                                            vm.cartData.code =code
                                            refreshCartData();
                                            gvc.closeDialog();
                                        }else{
                                            dialog.errorMessage({
                                                text: '此代碼無法使用'
                                            });
                                        }
                                         
                                     });
                            }

                            if (isWebsite) {
                                const flexList = [1.2, 1, 1.5, 1.5];

                                return html`
                                <div>
                                <div class="d-flex align-items-center mb-2">
                                    <label class="${gClass('label')} mb-0" style="min-width: 80px;">輸入代碼</label>
                                    <input class="${gClass('input')}" type="text" onchange="${gvc.event((e)=>{
                                         checkCodeValue(e.value)
                                    })}"/>
                                </div>
                                </div>
                                    <div class="w-100 d-sm-flex py-4 um-th-bar">
                                        ${header
                                            .map((item, index) => {
                                                return html`<div class="um-th" style="flex: ${flexList[index]};">${item.title}</div>`;
                                            })
                                            .join('')}
                                    </div>
                                    ${vmi.dataList
                                        .map((item, t1) => {
                                            const fText = formatText(item.content)
                                            return html`<div class="w-100 d-sm-flex py-1 align-items-center">
                                                ${fText
                                                    .map((dd, t2) => {
                                                        return html`<div class="um-td ${t2 === fText.length - 1 ? 'text-center':''}" style="flex: ${flexList[t2]}">${dd}</div>`;
                                                    })
                                                    .join('')}
                                            </div>`;
                                        })
                                        .join('')}
                                `;
                            }

                            return html`<div>
                                <div class="d-flex">
                                    <label class="${gClass('label')}">輸入代碼</label>
                                    <input class="${gClass('input')}" type="text" />
                                    <button class="${gClass('button-bgr')}" onclick="${gvc.event((e)=>{
                                         checkCodeValue(e.value)
                                    })}">
                                        <span class="${gClass('button-text')}">確認</span>
                                    </button>
                                </div>
                                <div class="w-100 d-sm-none mb-3 s162413">
                                        ${vmi.dataList
                                            .map((item) => {
                                                return html`<div class="um-mobile-area">
                                                    ${formatText(item.content)
                                                        .map((dd, index) => {
                                                            if (header[index].title === '') {
                                                                return dd;
                                                            }
                                                            return html`<div class="um-mobile-text">${header[index].title}: ${dd}</div>`;
                                                        })
                                                        .join('')}
                                                </div>`;
                                            })
                                            .join('')}
                                    </div> 
                            </div>`;
                        }
                    },
                    divCreate: {},
                    onCreate: () => {
                        if (loading) {
                            function isNowBetweenDates(startIso: string, endIso: string): boolean {
                                const now = new Date();
                                const startDate = new Date(startIso);
                                const endDate = new Date(endIso);
                            
                                // 確保 `startIso` 和 `endIso` 是有效的日期
                                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                                    return true
                                }
                            
                                // 判斷現在時間是否在範圍內
                                return now >= startDate && now <= endDate;
                            }

                            gvc.addMtScript(
                                [{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }],
                                () => {
                                    ApiShop.getVoucher({
                                        page: 0,
                                        limit: 10000,
                                        data_from: 'user',
                                    }).then(async (res) => {
                                        if (res.result && res.response.data) {
                                            vmi.dataList = res.response.data.filter((item: Voucher) => {
                                                return item.content.trigger === 'code' && isNowBetweenDates(item.content.start_ISO_Date, item.content.end_ISO_Date)
                                            });
                                        } else {
                                            vmi.dataList = [];
                                        }
                                        const cloneCart = JSON.parse(JSON.stringify(vm.cartData))
                                        Promise.all(vmi.dataList.map((voucher,index) => {
                                            return new Promise<{ code:string, response:any }>((resolve) => {
                                                const code = voucher.content.code
                                                cloneCart.code = code
                                                cloneCart.line_items = cloneCart.lineItems 
                                                ApiShop.getCheckout(cloneCart).then((response) => {
                                                    resolve({
                                                        code,
                                                        response
                                                    });
                                                });
                                            })
                                        })).then( (resolveArray: { code:string, response:any }[]) =>{
                                            vmi.dataList = vmi.dataList.map((item) => {
                                                const f = resolveArray.find(res => {
                                                    return item.content.code === res.code;
                                                })
                                                if(f){
                                                   const r = f.response
                                                   if(r.result && r.response.data){
                                                        item.content.usePass = r.response.data.voucherList.length > 0
                                                   }
                                                }
                                                return item
                                            })
                                            loading = false;
                                            gvc.notifyDataChange(id);
                                        })
                                    });
                                },
                                () => {}
                            );
                        }
                    },
                };
            })()
        )
    }
}
)
                                                                    })}">${vm.cartData.code ?? '新增'}</div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>購物金折抵</div>
                                                                    <div>- NT. ${vm.cartData.discount.toLocaleString()}</div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div
                                                                        style="  justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                                                                .body.clientWidth > 768
                                                                                ? 'gap: 18px; '
                                                                                : 'flex-direction: column; gap: 0px; '}"
                                                                        class="w-100"
                                                                    >
                                                                        <input
                                                                                    class="flex-fill ${gClass('group-input')}"
                                                                                    placeholder="請輸入購物金"
                                                                                    value="${vm.cartData.use_rebate || ''}"
                                                                        />
                                                                        <div class="${gClass('group-button')}" >
                                                                            <div class="${gClass('button-text')}" 
                                                                                onclick="${gvc.event((e) => {
                                                                                    let text = e.value;
                                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                                    const textNumber = parseInt(text, 10);
                                                                                    const subtotal = vm.cartData.total - vm.cartData.shipment_fee + vm.cartData.use_rebate;
                                                                                    if (!CheckInput.isNumberString(text)) {
                                                                                        dialog.infoMessage({text: '僅限輸入數字'});
                                                                                    } if(textNumber){
                                                                                        dialog.errorMessage({text:  `請輸入 0 到 ${ Math.min(textNumber, subtotal) } 的數值` })
                                                                                    } else {
                                                                                        vm.cartData.use_rebate = text;
                                                                                        refreshCartData()
                                                                                    }
                                                                                })}">
                                                                                套用
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">

    ${(()=>{
        const sum = vm.cartData.user_rebate_sum || 0
        
        if(!vm.cartData.useRebateInfo){
            return '';
        }
        
        const info = vm.cartData.useRebateInfo;
        if(info.condition){
            return `還差$ ${info.condition.toLocaleString()} 即可使用購物金折抵`
        }
        
        if(info.limit){
            return `您目前剩餘 ${sum || 0} 點購物金<br />此份訂單最多可折抵 ${info.limit.toLocaleString()} 點購物金`
        }else{
            return `您目前剩餘 ${sum || 0} 點購物金`
        }
        
    })()}
                                                                </div>
                                                            </div>
                                                        </section>`;
                                                    },
                                                };
                                            })()
                                    )}
                                   <section class="border-bottom"></section>
                                <section class="d-flex">
                                    <div class="flex-fill"></div>
                                    <div class="${gClass('price-container')}">
                                        <div class="${gClass(['price-row', 'text-1', 'bold'])}">
                                            <div>總金額</div>
                                            <div>NT. ${vm.cartData.total.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </section>
                                    <section>
                                        <div class="${gClass('banner-bgr')}">
                                            <span class="${gClass('banner-text')}">付款及配送方式</span>
                                        </div>
                                        ${vm.cartData.shipment_info ? `<div class="py-2 mx-2 mx-sm-0">${vm.cartData.shipment_info}</div>`:''}
                                        <div class="row m-0 my-md-3">
                                            <div class="col-12 col-md-6 mb-2 mb-sm-0">
                                                <label class="${gClass('label')}">付款方式</label>
                                                <div>
                                                    <select class="w-100 ${gClass('select')}"
                                                            onchange="${gvc.event((e, event) => {
                                                                vm.cartData.customer_info.payment_select = e.value;
                                                                this.storeLocalData(vm.cartData)
                                                                refreshCartData()
                                                            })}">
                                                        ${(() => {
                                                            return this.getPaymentMethod(vm.cartData).map((dd: {
                                                                name: string,
                                                                value: string
                                                            }) => {
                                                                return `<option value="${dd.value}" ${(localStorage.getItem('checkout-payment') === dd.value) ? `selected` : ``}>${dd.name}</option>`
                                                            }).join('')
                                                        })()}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6">
                                                <label class="${gClass('label')}">配送方式</label>
                                                <div>
                                                    <select class="w-100 ${gClass('select')}"
                                                            onchange="${gvc.event((e, event) => {
                                                                ['CVSStoreName','MerchantTradeNo','LogisticsSubType','CVSStoreID','CVSStoreName','CVSTelephone','CVSOutSide','ExtraData','CVSAddress'].map((dd)=>{
                                                                    gvc.glitter.setUrlParameter(dd)
                                                                });
                                                                vm.cartData.user_info.shipment = e.value;
                                                                this.storeLocalData(vm.cartData)
                                                                refreshCartData()
                                                            })}">
                                                        ${(() => {
                                                            return this.getShipmentMethod(vm.cartData).map((dd: {
                                                                name: string,
                                                                value: string
                                                            }) => {
                                                                return `<option value="${dd.value}" ${(vm.cartData.user_info.shipment === dd.value) ? `selected` : ``}>${dd.name}</option>`
                                                            }).join('')
                                                        })()}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-12 ${['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(vm.cartData.user_info.shipment) ? `` : `d-none`}">
                                                <button class="${gClass('button-bgr')}" onclick="${gvc.event(() => {
                                                    ApiDelivery.storeMaps({
                                                        returnURL: location.href,
                                                        logistics: vm.cartData.user_info.shipment,
                                                    }).then(async (res) => {
                                                        $('body').html(res.response.form);
                                                        (document.querySelector('#submit') as any).click();
                                                    })
                                                })}">
                                                    <span class="${gClass('button-text')}">${(() => {
                                                        let cvs = glitter.getUrlParameter('CVSStoreName') || ''
                                                        if (decodeURIComponent(cvs)) {
                                                            return `${decodeURIComponent(cvs)} 『 點擊重選門市 』`
                                                        } else {
                                                            return `選擇配送門市`
                                                        }
                                                    })()}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                    <section class="${['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(vm.cartData.user_info.shipment) ? `` : `mt-4`}">
                                        <div class="${gClass('banner-bgr')}">
                                            <span class="${gClass('banner-text')}">顧客資料</span>
                                        </div>
                                        <div class="row m-0 mt-3">
                                            ${[{
                                                name: '姓名',
                                                key: 'name'
                                            }, {
                                                name: '聯絡電話',
                                                key: 'phone'
                                            }, {
                                                name: '電子信箱',
                                                key: 'email'
                                            }].map((dd) => {
                                                return html`
                                                    <div class="col-12 col-md-4 mb-2">
                                                        <label class="${gClass('label')}">${dd.name}</label>
                                                        <input class="${gClass('input')}" type="${dd.key}"
                                                               value="${vm.cartData.customer_info[dd.key] || ""}"
                                                               onchange="${gvc.event((e, event) => {
                                                                   vm.cartData.customer_info[dd.key] = e.value
                                                                   this.storeLocalData(vm.cartData)
                                                               })}"/>
                                                    </div>`
                                            }).join('')}
                                        </div>
                                        ${
                                                gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    const vm_info: {
                                                        loading: boolean;
                                                        list: any[];
                                                        login_config: any;
                                                    } = {
                                                        loading: true,
                                                        list: [],
                                                        login_config: {},
                                                    };
                                                    ApiUser.getPublicConfig('custom_form_checkout', 'manager').then((res) => {
                                                        vm_info.list = (res.response.value ?? {list: []}).list;
                                                        vm.cartData.custom_form_format = vm_info.list
                                                        gvc.notifyDataChange(id)
                                                    });
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            const form_array = JSON.parse(JSON.stringify(vm_info.list));
                                                            form_array.map((dd: any) => {
                                                                dd.col = '4';
                                                                dd.form_config.title_style = {
                                                                    list: [
                                                                        {
                                                                            class: gClass('label') + ' mb-2',
                                                                            style: 'return `color:${glitter.share.globalValue[`theme_color.0.title`]} !important;font-size:16px !important;`',
                                                                            stylist: [],
                                                                            dataType: 'code',
                                                                            style_from: 'code',
                                                                            classDataType: 'static',
                                                                        },
                                                                    ],
                                                                    class: 'form-label',
                                                                    style: 'font-size: 20px;font-style: normal;font-weight: 400;line-height: 140%; color:#393939 !important;',
                                                                    stylist: [],
                                                                    version: 'v2',
                                                                    dataType: 'static',
                                                                    style_from: 'code',
                                                                    classDataType: 'static',
                                                                };
                                                                dd.form_config.input_style = {
                                                                    list: [
                                                                        {
                                                                            class: gClass('input'),
                                                                            style: 'return `border-radius: ${widget.formData.radius}px !important;`',
                                                                            stylist: [],
                                                                            dataType: 'code',
                                                                            style_from: 'code',
                                                                            classDataType: 'static',
                                                                        },
                                                                    ],
                                                                    class: ' mb-3',
                                                                    style: 'background: #FFF;',
                                                                    stylist: [],
                                                                    version: 'v2',
                                                                    dataType: 'static',
                                                                    style_from: 'code',
                                                                    classDataType: 'static',
                                                                };
                                                            });
                                                            return [
                                                                FormWidget.editorView({
                                                                    gvc: gvc,
                                                                    array: form_array,
                                                                    refresh: () => {
                                                                        this.storeLocalData(vm.cartData)
                                                                    },
                                                                    formData: vm.cartData.custom_form_data,
                                                                })
                                                            ].join('');
                                                        },
                                                        divCreate: {
                                                            class: `w-100 `,
                                                        },
                                                    };
                                                })
                                        }
                                    </section>
                                    <section>
                                        <div class="${gClass('banner-bgr')}">
                                            <span class="${gClass('banner-text')}">收件人資料</span>
                                        </div>
                                       
                                        ${
                                                gvc.bindView(() => {
                                                    const id = 'invoice_place';
                                                    const vm_info: {
                                                        loading: boolean;
                                                        list: any[];
                                                        login_config: any;
                                                    } = {
                                                        loading: true,
                                                        list: [
                                                            {
                                                                col: '3',
                                                                key: 'name',
                                                                page: 'input',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '姓名',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'true',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '輸入框',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'name',
                                                                    title: '',
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入姓名'
                                                                },
                                                                hidden_code: '',
                                                            },
                                                            {
                                                                col: '3',
                                                                key: 'phone',
                                                                page: 'input',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '聯絡電話',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'true',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '輸入框',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'phone',
                                                                    title: '',
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入聯絡電話'
                                                                },
                                                                hidden_code: '',
                                                            },
                                                            {
                                                                col: '6',
                                                                key: 'email',
                                                                page: 'input',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '電子信箱',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'true',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '輸入框',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'email',
                                                                    title: '',
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入電子信箱'
                                                                },
                                                                hidden_code: '',
                                                            },
                                                            {
                                                                col: '6',
                                                                key: 'invoice_type',
                                                                page: 'form-select',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '發票開立對象',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'true',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '下拉選單',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'name',
                                                                    title: '',
                                                                    option: [
                                                                        {name: '個人', index: 0, value: 'me'},
                                                                        {name: '公司', index: 1, value: 'company'},
                                                                        {name: '捐贈發票', index: 2, value: 'donate'},
                                                                    ],
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '',
                                                                },
                                                                hidden_code: "return (form_data['invoice_method']==='nouse')",
                                                            },
                                                            {
                                                                col: '6',
                                                                key: 'send_type',
                                                                page: 'form-select',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '開立方式',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'true',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '下拉選單',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'name',
                                                                    title: '',
                                                                    option: [
                                                                        {
                                                                            name: '傳送至用戶信箱',
                                                                            index: 0,
                                                                            value: 'email'
                                                                        },
                                                                        {
                                                                            name: '手機條碼載具',
                                                                            index: 1,
                                                                            value: 'carrier'
                                                                        },
                                                                    ],
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '',
                                                                },
                                                                hidden_code:
                                                                        "    if(form_data['invoice_type']!=='me' || (form_data['invoice_method']==='nouse') || (form_data['invoice_method']==='off_line')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                            },
                                                            {
                                                                key: 'carrier_num',
                                                                page: 'input',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '載具號碼',
                                                                appName: 'cms_system',
                                                                require: 'false',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '輸入框',
                                                                col: '3',
                                                                col_sm: '12',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'name',
                                                                    title: '',
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入載具號碼'
                                                                },
                                                                hidden_code: "    \n    if(form_data['invoice_type']!=='me' || form_data['send_type']!=='carrier'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                            },
                                                            {
                                                                key: 'company',
                                                                page: 'input',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '公司名稱',
                                                                appName: 'cms_system',
                                                                require: 'false',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '輸入框',
                                                                col: '3',
                                                                col_sm: '12',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'name',
                                                                    title: '',
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入公司名稱'
                                                                },
                                                                hidden_code:
                                                                        "    if(form_data['invoice_type']!=='company' || (form_data['invoice_method']==='nouse')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                            },
                                                            {
                                                                key: 'gui_number',
                                                                page: 'input',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '公司統一編號',
                                                                col: '3',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'false',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '輸入框',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'name',
                                                                    title: '',
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入公司統一編號'
                                                                },
                                                                hidden_code: "    if(form_data['invoice_type']!=='company'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                            },
                                                            {
                                                                col: '6',
                                                                key: 'love_code',
                                                                page: 'input',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '捐贈碼',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'false',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '輸入框',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'name',
                                                                    title: '',
                                                                    input_style: {list: [], version: 'v2'},
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入捐贈碼'
                                                                },
                                                                hidden_code:
                                                                        "    if(form_data['invoice_type']!=='donate' || (form_data['invoice_method']==='nouse')){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                            },
                                                            {
                                                                col: '12',
                                                                key: 'note',
                                                                page: 'multiple_line_text',
                                                                type: 'form_plugin_v2',
                                                                group: '',
                                                                title: '送貨備註',
                                                                col_sm: '12',
                                                                appName: 'cms_system',
                                                                require: 'false',
                                                                readonly: 'write',
                                                                formFormat: '{}',
                                                                moduleName: '多行文字區塊',
                                                                style_data: {
                                                                    input: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    label: {
                                                                        list: [],
                                                                        class: 'form-label fs-base ',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                    container: {
                                                                        list: [],
                                                                        class: '',
                                                                        style: '',
                                                                        version: 'v2'
                                                                    },
                                                                },
                                                                form_config: {
                                                                    type: 'text',
                                                                    title: '',
                                                                    title_style: {list: [], version: 'v2'},
                                                                    place_holder: '請輸入送貨備註'
                                                                },
                                                                hidden_code: 'return false',
                                                            },
                                                        ].filter((dd) => {
                                                            return (dd.key !== 'name' && dd.key !== 'phone' && dd.key !== 'email') || !widget.share.user_info_same;
                                                        }),
                                                        login_config: {},
                                                    };
                                                    //nouse
                                                    let method = '';
                                                    (ApiShop.getInvoiceType().then((response: any) => {
                                                        method = response.method;
                                                        vm_info.loading = false;
                                                        gvc.notifyDataChange(id)
                                                    }));
                                                    const checkbox=this.getCheckedClass(gvc,'#393939')
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            if (vm_info.loading) {
                                                                return ``
                                                            }
                                                            vm.cartData.user_info.invoice_method = method;
                                                            vm.cartData.user_info.invoice_type = vm.cartData.user_info.invoice_type || 'me'
                                                            vm.cartData.user_info.send_type = vm.cartData.user_info.send_type || 'email'
                                                            const form_array = JSON.parse(JSON.stringify(vm_info.list));
                                                            
                                                            form_array.map((dd: any) => {
                                                                if(dd.key==='send_type' &&   vm.cartData.user_info.send_type==='carrier'){
                                                                  dd.col=3
                                                                }
                                                                dd.form_config.title_style = {
                                                                    list: [
                                                                        {
                                                                            class: (['company','gui_number','carrier_num'].includes(dd.key)) ? (gClass('label') + ' mt-2') :(gClass('label') + ' mb-2'),
                                                                            style: 'return `color:${glitter.share.globalValue[`theme_color.0.title`]} !important;font-size:16px !important;`',
                                                                            stylist: [],
                                                                            dataType: 'code',
                                                                            style_from: 'code',
                                                                            classDataType: 'static',
                                                                        },
                                                                    ],
                                                                    class: 'form-label',
                                                                    style: 'font-size: 20px;font-style: normal;font-weight: 400;line-height: 140%; color:#393939 !important;',
                                                                    stylist: [],
                                                                    version: 'v2',
                                                                    dataType: 'static',
                                                                    style_from: 'code',
                                                                    classDataType: 'static',
                                                                };
                                                                dd.form_config.input_style = {
                                                                    list: [
                                                                        {
                                                                            class: gClass('input'),
                                                                            style: 'return `border-radius: ${widget.formData.radius}px !important;`',
                                                                            stylist: [],
                                                                            dataType: 'code',
                                                                            style_from: 'code',
                                                                            classDataType: 'static',
                                                                        },
                                                                    ],
                                                                    class: ' mb-3',
                                                                    style: 'background: #FFF;',
                                                                    stylist: [],
                                                                    version: 'v2',
                                                                    dataType: 'static',
                                                                    style_from: 'code',
                                                                    classDataType: 'static',
                                                                };
                                                            }).filter((dd:any)=>{
                                                                return !(method === 'nouse' && ['invoice_type', 'send_type', 'carrier_num', 'company', 'gui_number', 'love_code'].includes(dd.key));
                                                            });
                                                            return [
                                                                ` <div class="d-flex ms-2 my-3" style="gap:10px;cursor:pointer;" onclick="${
                                                                        gvc.event(()=>{
                                                                            widget.share.user_info_same=!widget.share.user_info_same
                                                                            if(widget.share.user_info_same){
                                                                                vm.cartData.user_info.name=vm.cartData.customer_info.name
                                                                                vm.cartData.user_info.phone=vm.cartData.customer_info.phone
                                                                                vm.cartData.user_info.email=vm.cartData.customer_info.email
                                                                            }
                                                                            this.storeLocalData(vm.cartData)
                                                                            gvc.notifyDataChange(id)
                                                                        })
                                                                }">
                                            <input class="form-check-input form-checkbox  ${checkbox}" type="checkbox"  ${(widget.share.user_info_same) ? `checked`:''}>
                                            收件人同購買人資料
                                        </div>`,
                                                                FormWidget.editorView({
                                                                    gvc: gvc,
                                                                    array: form_array,
                                                                    refresh: () => {
                                                                        this.storeLocalData(vm.cartData)
                                                                        gvc.notifyDataChange(id)
                                                                    },
                                                                    formData: vm.cartData.user_info,
                                                                })
                                                            ].join('<div class="my-2"></div>');
                                                        },
                                                        divCreate: {
                                                            class: `w-100 mt-2`,
                                                        },
                                                    };
                                                })
                                        }
                                        <div class="w-100 d-flex align-items-center justify-content-end px-2 mt-3" >
                                            <button class="${gClass('button-bgr')}" onclick="${gvc.event(() => {
                                                const dialog=new ShareDialog(gvc.glitter)
                                                dialog.dataLoading({visible:true})
                                                ApiShop.toCheckout({
                                                    line_items: vm.cartData.lineItems.map((dd:any) => {
                                                        return {
                                                            id: dd.id,
                                                            spec: dd.spec,
                                                            count: dd.count,
                                                        };
                                                    }),
                                                    customer_info: vm.cartData.customer_info,
                                                    return_url: (()=>{
                                                        const originalUrl = glitter.root_path + 'order_detail' + location.search;
                                                        const urlObject = new URL(originalUrl);
                                                        urlObject.searchParams.set('EndCheckout', '1');
                                                        const newUrl = urlObject.toString();

                                                        return newUrl
                                                    })(),
                                                    user_info: vm.cartData.user_info,
                                                    code: ApiCart.cart.code,
                                                    use_rebate: ApiCart.cart.use_rebate,
                                                    custom_form_format: vm.cartData.custom_form_format,
                                                    custom_form_data: vm.cartData.custom_form_data,
                                                    distribution_code: ApiCart.cart.distribution_code,
                                                    give_away:ApiCart.cart.give_away
                                                }).then((res) => {
                                                    if (res.response.off_line || res.response.is_free) {
                                                        ApiCart.clearCart()
                                                        location.href = res.response.return_url;
                                                    } else {
                                                        const id = gvc.glitter.getUUID();
                                                        $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                                        (document.querySelector(`#${id} #submit`) as any).click();
                                                        ApiCart.clearCart()
                                                    }
                                                })                                        
                                            })}" style="width:200px;" >
                                                <span class="${gClass('button-text')}">下一步</span>
                                            </button>
                                        </div>
                                    </section>
                                    
                                </div>`;
                        } catch (e) {
                            console.log(e)
                            return ``
                        }
                    },
                    divCreate: {},
                    onCreate: () => {
                        if (loadings.page) {
                            new Promise(async (resolve, reject) => {
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        resolve(ApiCart.cart);
                                    });
                                }).then(async (res: any) => {
                                    const cartData: {
                                        line_items: {
                                            sku: string;
                                            spec: string[];
                                            stock: number;
                                            sale_price: number;
                                            compare_price: number;
                                            preview_image: string;
                                            title: string;
                                            id: number;
                                            count: number;
                                        }[];
                                        total: number;
                                        user_info: {
                                            shipment: string;
                                        };
                                    } = {
                                        line_items: [],
                                        total: 0,
                                        user_info: {
                                            shipment: localStorage.getItem('shipment-select') as string,
                                        },
                                    };
                                    if (res.line_items) {
                                        res.user_info = {
                                            shipment: localStorage.getItem('shipment-select') as string,
                                        };
                                        const cart = res as CartItem;
                                        ApiShop.getCheckout(cart).then((res) => {
                                            if (res.result) {
                                                resolve(res.response.data);
                                            } else {
                                                resolve([]);
                                            }
                                        });
                                    } else {
                                        for (const b of Object.keys(res)) {
                                            cartData.line_items.push({
                                                id: b.split('-')[0] as any,
                                                count: res[b] as number,
                                                spec: b.split('-').filter((dd, index) => {
                                                    return index !== 0;
                                                }) as any,
                                            } as any);
                                        }
                                        const voucher = ApiCart.cart.code;
                                        const rebate = ApiCart.cart.use_rebate || 0;
                                        const distributionCode = localStorage.getItem('distributionCode') ?? '';
                                        ApiShop.getCheckout({
                                            line_items: cartData.line_items.map((dd) => {
                                                return {
                                                    id: dd.id,
                                                    spec: dd.spec,
                                                    count: dd.count,
                                                };
                                            }),
                                            code: voucher as string,
                                            use_rebate: GlobalUser.token && rebate ? rebate : undefined,
                                            distribution_code: distributionCode,
                                            user_info: {
                                                shipment: localStorage.getItem('shipment-select'),
                                            },
                                        }).then((res) => {
                                            if (res.result) {
                                                resolve(res.response.data);
                                            } else {
                                                resolve([]);
                                            }
                                        });
                                    }
                                });
                            }).then((data) => {
                                vm.cartData = data;
                                gvc.addMtScript(
                                    [
                                        {
                                            src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`,
                                        },
                                    ],
                                    () => {
                                        loadings.page = false;
                                        gvc.notifyDataChange(ids.page);
                                    },
                                    () => {}
                                );
                            });

                            // gvc.addMtScript(
                            //     [
                            //         {
                            //             src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`,
                            //         },
                            //     ],
                            //     () => {
                            //         loadings.page = false;
                            //         gvc.notifyDataChange(ids.page);
                            //     },
                            //     () => {
                            //     }
                            // );
                        }
                    },
                };
            })()
        );
    }


    //取得付款方式
    public static getPaymentMethod(cartData: any) {
        let array = [];
        switch (cartData.payment_setting.TYPE) {
            case 'newWebPay':
                array.push({
                    name: '藍新金流',
                    value: 'newWebPay',
                });
                break;
            case 'ecPay':
                array.push({
                    name: '綠界金流',
                    value: 'ecPay',
                });
                break;
        }
        cartData.off_line_support = cartData.off_line_support ?? {};
        cartData.off_line_support.atm &&
        array.push({
            name: '銀行轉帳',
            value: 'atm',
        });
        cartData.off_line_support.line &&
        array.push({
            name: 'Line Pay 付款',
            value: 'line',
        });
        cartData.off_line_support.cash_on_delivery &&
        array.push({
            name: '貨到付款',
            value: 'cash_on_delivery',
        });
        //當沒有找到付款方式實則重新inital
        if (
            !array.find((dd) => {
                return dd.value === localStorage.getItem('checkout-payment');
            })
        ) {
            localStorage.setItem('checkout-payment', array[0].value);
        }
        cartData.customer_info.payment_select = localStorage.getItem('checkout-payment');
        return array;
    }

    //取得配送方式
    public static getShipmentMethod(cartData: any) {
        if (!cartData.shipment_selector.find((dd: any) => {
            return dd.value === localStorage.getItem('shipment-select')
        })) {
            localStorage.setItem('shipment-select', cartData.shipment_selector[0].value);
        }

        cartData.user_info.shipment = localStorage.getItem('shipment-select');
        return cartData.shipment_selector
    }

    //儲存本地資料
    public static storeLocalData(cartData: any) {
        //設定顧客
        localStorage.setItem('cart_customer_info', JSON.stringify(cartData.customer_info))
        //設定配送
        localStorage.setItem('shipment-select', cartData.user_info.shipment)
        //設定付款
        localStorage.setItem('checkout-payment', cartData.customer_info.payment_select);
        //設定自訂表單
        localStorage.setItem('custom_form_data', JSON.stringify(cartData.custom_form_data))
        //設定配送資訊
        localStorage.setItem('custom_user_info', JSON.stringify(cartData.user_info))
    }


    public static initial(cartData: any) {
        cartData.customer_info = JSON.parse(localStorage.getItem('cart_customer_info') || "{}")
        cartData.custom_form_data = JSON.parse(localStorage.getItem('custom_form_data') || "{}")
        cartData.user_info = JSON.parse(localStorage.getItem('custom_user_info') || "{}")

        this.getPaymentMethod(cartData)
        this.getShipmentMethod(cartData)
    }
    static getCheckedClass(gvc: GVC, color?: string) {
        const className = Tool.randomString(6);
        gvc.addStyle(`
            .${className} {
                min-width: 1rem;
                min-height: 1rem;
            }
            .${className}:checked[type='checkbox'] {
                border: 2px solid ${color ?? '#000'};
                background-color: #fff;
                background-image: url(${this.checkedDataImage(color ?? '#000')});
                background-position: center center;
            }
        `);
        return className;
    }
    static checkedDataImage(color: string): string {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='${color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"`;
    }
}

(window as any).glitter.setModule(import.meta.url, CheckoutIndex);
