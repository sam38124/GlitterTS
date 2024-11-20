import {GVC} from '../../glitterBundle/GVController.js';
import {ApiShop} from '../../glitter-base/route/shopping.js';
import {GlobalUser} from '../../glitter-base/global/global-user.js';
import {CheckInput} from '../../modules/checkInput.js';
import {Tool} from '../../modules/tool.js';
import {ApiCart, CartItem} from '../../glitter-base/route/api-cart.js';
import {ApiDelivery} from "../../glitter-base/route/delivery.js";

const html = String.raw;
const css = String.raw;

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
        }

        function refreshCartData() {
            gvc.notifyDataChange(ids.page)
        }

        return gvc.bindView(
            (() => {
                return {
                    bind: ids.page,
                    view: () => {
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
                                    <div class="mt-3">購物車是空的，趕快前往挑選您心儀的商品</div>
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
                                                            <div class="d-flex align-items-center p-3 border-bottom">
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
                                                                            .map((item: any) => {
                                                                                console.log(item);
                                                                                return html`
                                                                                    <div class="d-flex align-items-center p-3 border-bottom"
                                                                                         style="gap: 10px; position: relative;">
                                                                                        <div class="${gClass('first-td')} justify-content-start">
                                                                                            ${validImageBox({
                                                                                                gvc,
                                                                                                image: noImageURL,
                                                                                                width: 100,
                                                                                            })}
                                                                                            <span class="ms-2">${item.title}${item.is_add_on_items ? addItemBadge() : ''}</span>
                                                                                        </div>
                                                                                        <div class="${gClass('td')}">
                                                                                            ${item.spec ? item.spec.join(' / ') : ''}
                                                                                        </div>
                                                                                        <div class="${gClass('td')}">
                                                                                            <div>
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
                                                                                                ${[...new Array(50)].map((_, index) => {
                                                                                                    return html`
                                                                                                        <option value="${index + 1}">
                                                                                                            ${index + 1}
                                                                                                        </option>`;
                                                                                                })}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div class="${gClass('td')}">
                                                                                            <span>合計 NT. ${(item.sale_price * item.count).toLocaleString()}</span>
                                                                                            <div style="position: absolute; right: 5px; transform: translateY(-50%); top: 50%;">
                                                                                                <i class="fa-solid fa-xmark-large"
                                                                                                   style="cursor: pointer;"></i>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>`;
                                                                            })
                                                                            .join('');
                                                                },
                                                            })}
                                                        </section>
                                                        <section class="d-flex">
                                                            <div class="flex-fill"></div>
                                                            <div class="${gClass('price-container')}">
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>小計</div>
                                                                    <div>NT.1,800</div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>運費</div>
                                                                    <div>NT.1,800</div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>購物金折抵</div>
                                                                    <div>NT.1,800</div>
                                                                </div>
                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                    <div>優惠代碼</div>
                                                                    <div>新增</div>
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
                                            <div>NT.1,800</div>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <div class="${gClass('banner-bgr')}">
                                        <span class="${gClass('banner-text')}">付款及配送方式</span>
                                    </div>
                                    <div class="row m-0 my-md-3">
                                        <div class="col-12 col-md-6">
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
                                                    let cvs = glitter.getUrlParameter('CVSStoreName')
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
                                <section>
                                    <div class="${gClass('banner-bgr')}">
                                        <span class="${gClass('banner-text')}">顧客資料</span>
                                    </div>
                                    ${[{
                                        name:'姓名',
                                        key:'name'
                                    },{
                                        name:'聯絡電話',
                                        key:'phone'
                                    },{
                                        name:'姓名',
                                        key:'name'
                                    }].map((dd)=>{
                                        this.storeLocalData(vm.cartData)
                                        return `<div class="col-12 col-md-6">
                                            <label class="${gClass('label')}">電子信箱</label>
                                            <input class="${gClass('input')}" type="email" onclick="${gvc.event((e,event)=>{

                                        })}"/>
                                        </div>`
                                    })}
                                    <div class="row m-0 my-md-3">
                                        
                                    </div>
                                </section>
                                <section>
                                    <div class="${gClass('banner-bgr')}">
                                        <span class="${gClass('banner-text')}">收件人資料</span>
                                    </div>
                                    <div class="row m-0 my-md-3">
                                        <div class="col-12 col-md-6">
                                            <label class="${gClass('label')}">電子信箱</label>
                                            <input class="${gClass('input')}" type="email"/>
                                        </div>
                                    </div>
                                </section>
                            </div>`;
                    },
                    divCreate: {},
                    onCreate: () => {
                        if (loadings.page) {
                            // new Promise(async (resolve, reject) => {
                            //     new Promise((resolve, reject) => {
                            //         setTimeout(() => {
                            //             resolve(ApiCart.cart);
                            //         });
                            //     }).then(async (res: any) => {
                            //         const cartData: {
                            //             line_items: {
                            //                 sku: string;
                            //                 spec: string[];
                            //                 stock: number;
                            //                 sale_price: number;
                            //                 compare_price: number;
                            //                 preview_image: string;
                            //                 title: string;
                            //                 id: number;
                            //                 count: number;
                            //             }[];
                            //             total: number;
                            //             user_info: {
                            //                 shipment: string;
                            //             };
                            //         } = {
                            //             line_items: [],
                            //             total: 0,
                            //             user_info: {
                            //                 shipment: localStorage.getItem('checkout-logistics') as string,
                            //             },
                            //         };
                            //         if (res.line_items) {
                            //             res.user_info = {
                            //                 shipment: localStorage.getItem('checkout-logistics') as string,
                            //             };
                            //             const cart = res as CartItem;
                            //             ApiShop.getCheckout(cart).then((res) => {
                            //                 if (res.result) {
                            //                     resolve(res.response.data);
                            //                 } else {
                            //                     resolve([]);
                            //                 }
                            //             });
                            //         } else {
                            //             for (const b of Object.keys(res)) {
                            //                 cartData.line_items.push({
                            //                     id: b.split('-')[0] as any,
                            //                     count: res[b] as number,
                            //                     spec: b.split('-').filter((dd, index) => {
                            //                         return index !== 0;
                            //                     }) as any,
                            //                 } as any);
                            //             }
                            //             const voucher = ApiCart.cart.code;
                            //             const rebate = ApiCart.cart.use_rebate || 0;
                            //             const distributionCode = localStorage.getItem('distributionCode') ?? '';
                            //             ApiShop.getCheckout({
                            //                 line_items: cartData.line_items.map((dd) => {
                            //                     return {
                            //                         id: dd.id,
                            //                         spec: dd.spec,
                            //                         count: dd.count,
                            //                     };
                            //                 }),
                            //                 code: voucher as string,
                            //                 use_rebate: GlobalUser.token && rebate ? rebate : undefined,
                            //                 distribution_code: distributionCode,
                            //                 user_info: {
                            //                     shipment: localStorage.getItem('checkout-logistics'),
                            //                 },
                            //             }).then((res) => {
                            //                 if (res.result) {
                            //                     resolve(res.response.data);
                            //                 } else {
                            //                     resolve([]);
                            //                 }
                            //             });
                            //         }
                            //     });
                            // }).then((data) => {
                            //     vm.cartData = data;
                            //     gvc.addMtScript(
                            //         [
                            //             {
                            //                 src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`,
                            //             },
                            //         ],
                            //         () => {
                            //             loadings.page = false;
                            //             gvc.notifyDataChange(ids.page);
                            //         },
                            //         () => {}
                            //     );
                            // });

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
                                () => {
                                }
                            );
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
    public static storeLocalData(cartData:any) {
        //設定顧客
       localStorage.setItem('cart_customer_info',JSON.parse(JSON.stringify(cartData.customer_info)))
        //設定配送
        localStorage.setItem('shipment-select',cartData.user_info.shipment)
        //設定付款
        localStorage.setItem('checkout-payment', cartData.customer_info.payment_select);
    }


    public static initial(cartData: any){
        cartData.customer_info=JSON.parse(localStorage.getItem('cart_customer_info') || "{}")
    }
}

(window as any).glitter.setModule(import.meta.url, CheckoutIndex);
