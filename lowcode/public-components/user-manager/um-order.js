import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Ad } from '../public/ad.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../../official_view_component/official/form.js';
const html = String.raw;
const css = String.raw;
export class UMOrder {
    static addStyle(gvc) {
        gvc.addStyle(`
            .o-h1 {
                text-align: center;
                font-weight: 700;
                letter-spacing: 2px;
                color: #393939;
                font-size: 36px;
                margin: 20px 0;
            }
            .o-h2 {
                text-align: center;
                font-weight: 700;
                letter-spacing: 2px;
                color: #393939;
                font-size: 28px;
                margin: 20px 0;
            }
            .o-title-container {
                display: flex;
                align-items: center;
                min-height: 36px;
            }
            .o-title {
                color: #393939;
                font-size: 16px;
                font-weight: 400;
            }
            .o-card {
                border-radius: 10px;
                border: 1px solid #ddd;
                background: #fff;
                width: 100%;
                max-width: 1100px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                margin: 0 30px;
            }
            .o-card-row {
                border-radius: 10px;
                border: 1px solid #ddd;
                background: #fff;
                width: 100%;
                max-width: 1100px;
                padding: 20px;
                display: flex;
                flex-wrap: wrap;
                margin: 0 30px;
            }
            .o-line-item {
                display: flex;
                width: 100%;
                padding: 1.25rem 1rem;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #dddddd;
            }
            .o-item-title {
                font-size: 16px;
                font-weight: 500;
                color: #fe5541;
                margin-bottom: 0.25rem;
            }
            .o-item-spec {
                font-size: 16px;
                font-weight: 400;
                color: #858585;
                margin-bottom: 0;
            }
            .o-total-container {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                margin-top: 1.25rem;
                margin-right: 1rem;
            }
            .o-total-item {
                display: flex;
                width: 100%;
                max-width: 350px;
                justify-content: space-between;
            }
            .o-subtotal {
                min-width: 80px;
                text-align: end;
            }
            .o-total {
                min-width: 80px;
                text-align: end;
                font-weight: 700;
            }
            .o-total-text {
                font-weight: 700;
            }
            .o-button {
                border-radius: 10px;
                background: #393939;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 14px 0;
                cursor: pointer;
                height: 48px;
            }
            .o-button:hover {
                background: #656565;
            }
            .o-button-text {
                color: #fff;
                text-align: center;
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 0.64px;
            }
            .o-gray-line {
                border-bottom: 1px solid #dddddd;
                padding-bottom: 6px;
                margin-bottom: 12px;
            }
            .o-gray-text {
                white-space: normal;
                word-break: break-all;
                color: #8d8d8d;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 1px;
            }
            .go-back-text {
                color: #1e1e1e;
                font-family: 'Open Sans', sans-serif;
                cursor: pointer;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: 1px;
            }
            .go-to-checkout {
                height: 32px;
                padding: 6px 14px;
                background: #393939;
                border-radius: 10px;
                justify-content: center;
                align-items: center;
                display: inline-flex;
                cursor: pointer;
            }
            .go-to-checkout-text {
                text-align: center;
                color: white;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.56px;
            }
        `);
    }
    static repay(gvc, id) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ visible: true, text: '取得結帳連結中' });
        const redirect = gvc.glitter.root_path + 'order_detail' + location.search;
        const l = new URL(redirect, location.href);
        return new Promise(() => {
            ApiShop.repay(id, l.href).then((res) => {
                dialog.dataLoading({ visible: false });
                const id = gvc.glitter.getUUID();
                $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                document.querySelector(`#${id} #submit`).click();
                ApiCart.clearCart();
            });
        });
    }
    static main(gvc, widget, subData) {
        this.addStyle(gvc);
        UmClass.addStyle(gvc);
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        const vm = {
            data: {},
            type: '',
        };
        return html `<div class="container py-4">
            ${gvc.bindView({
            bind: ids.view,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner({
                        container: {
                            style: 'height: 100%;',
                        },
                    });
                }
                if (!vm.data || !vm.data.orderData || !vm.data.cart_token) {
                    return html ` <section class="o-h2">查無此訂單</section> `;
                }
                const orderData = vm.data.orderData;
                function payInfo() {
                    let arr = [];
                    if (orderData.customer_info.payment_select === 'atm') {
                        arr = [
                            {
                                title: '銀行名稱',
                                value: orderData.payment_info_atm.bank_name,
                            },
                            {
                                title: '銀行代碼',
                                value: orderData.payment_info_atm.bank_code,
                            },
                            {
                                title: '匯款戶名',
                                value: orderData.payment_info_atm.bank_user,
                            },
                            {
                                title: '匯款帳號',
                                value: orderData.payment_info_atm.bank_code,
                            },
                            {
                                title: '匯款金額',
                                value: orderData.total.toLocaleString(),
                            },
                            {
                                title: '付款說明',
                                value: orderData.payment_info_atm.text,
                            },
                        ];
                    }
                    else if (orderData.customer_info.payment_select === 'line') {
                        arr = [
                            {
                                title: '付款說明',
                                value: orderData.payment_info_line_pay.text,
                            },
                        ];
                    }
                    else {
                        arr = [
                            {
                                title: '付款說明',
                                value: orderData.payment_info_text,
                            },
                        ];
                    }
                    return gvc.map(arr.map((item) => {
                        return html `
                                    <div class="o-title-container ${item.title === '付款說明' ? 'align-items-start mt-2' : ''}">
                                        <div class="o-title me-1">${item.title}：</div>
                                        <div class="o-title">${item.value}</div>
                                    </div>
                                `;
                    }));
                }
                function validateForm(data) {
                    const paymentTime = data['pay-date'];
                    const bankName = data.bank_name;
                    const accountName = data.bank_account;
                    const accountLastFive = data.trasaction_code;
                    let isValid = true;
                    let errorMessage = '';
                    if (!paymentTime) {
                        isValid = false;
                        errorMessage += '付款時間未填寫<br/>';
                    }
                    if (!bankName) {
                        isValid = false;
                        errorMessage += '銀行名稱未填寫<br/>';
                    }
                    if (!accountName) {
                        isValid = false;
                        errorMessage += '銀行戶名未填寫<br/>';
                    }
                    if (!/^\d{5}$/.test(accountLastFive)) {
                        isValid = false;
                        errorMessage += '銀行帳號後五碼需為五位數字<br/>';
                    }
                    if (!isValid) {
                        dialog.errorMessage({ text: html `<div class="text-center">${errorMessage}</div>` });
                    }
                    return isValid;
                }
                if (vm.type === 'upload') {
                    let formData = {};
                    return html `
                            <section class="o-h1">訂單編號<br />#${vm.data.cart_token}</section>
                            <section class="o-card-row" style="max-width: 100%;">
                                <div class="col-12 col-md-6 px-2">
                                    <h3 class="mb-3 text-center">付款資訊</h3>
                                    <div class="o-gray-line"></div>
                                    ${payInfo()}
                                </div>
                                <div class="col-12 col-md-6 px-2">
                                    <h3 class="mb-3 text-center">付款證明</h3>
                                    <div class="o-gray-line"></div>
                                    <span class="o-gray-text"
                                        >${(() => {
                        if (orderData.customer_info.payment_select === 'atm') {
                            return html `＊請確認您的匯款銀行帳戶資料是否正確，以確保付款順利完成`;
                        }
                        else if (orderData.customer_info.payment_select === 'line') {
                            return html `＊請上傳截圖，以便我們進行核款。`;
                        }
                        return html `＊請確認您的匯款銀行帳戶資料是否正確，以確保付款順利完成<br />＊請上傳截圖或輸入轉帳證明，例如:帳號末五碼，與付款人資訊。`;
                    })()}</span
                                    >
                                    ${gvc.bindView((() => {
                        const id = glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return FormWidget.editorView({
                                    gvc: gvc,
                                    array: (() => {
                                        if (orderData.customer_info.payment_select === 'line') {
                                            return UMOrder.lineFormList;
                                        }
                                        if (orderData.customer_info.payment_select === 'atm') {
                                            return UMOrder.atmFormList;
                                        }
                                        return [];
                                    })(),
                                    refresh: () => {
                                        setTimeout(() => {
                                            gvc.notifyDataChange(id);
                                        });
                                    },
                                    formData: formData,
                                });
                            },
                            divCreate: {
                                class: 'mt-2 mb-3',
                            },
                        };
                    })())}
                                    <div
                                        class="o-button mx-2"
                                        onclick="${gvc.event(() => {
                        if (!validateForm(formData)) {
                            return;
                        }
                        dialog.dataLoading({ visible: true, text: '資料送出中' });
                        ApiShop.proofPurchase(vm.data.cart_token, formData).then((result) => {
                            dialog.dataLoading({ visible: false });
                            location.reload();
                        });
                    })}"
                                    >
                                        <span class="o-button-text">確認送出</span>
                                    </div>
                                </div>
                            </section>
                            <section
                                class="m-auto d-flex align-items-center justify-content-center my-5"
                                style="cursor: pointer;"
                                onclick="${gvc.event(() => {
                        setTimeout(() => {
                            $('html').scrollTop(0);
                        }, 100);
                        vm.type = '';
                    })}"
                            >
                                <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                                <span class="go-back-text">返回訂單詳情</span>
                            </section>
                        `;
                }
                return html `
                        <section class="o-h1">訂單編號<br />#${vm.data.cart_token}</section>
                        <section class="o-card">
                            <h3 class="mb-3">訂單明細</h3>
                            ${gvc.map(orderData.lineItems.map((item) => {
                    return html `
                                        <div class="o-line-item">
                                            <div class="d-flex gap-3">
                                                <div>
                                                    ${UmClass.validImageBox({
                        gvc,
                        image: item.preview_image,
                        width: 60,
                        style: 'border-radius: 10px;',
                    })}
                                                </div>
                                                <div>
                                                    <p class="o-item-title">${item.title}</p>
                                                    <p class="o-item-spec">${item.spec.length > 0 ? `規格：${item.spec.join(' / ')}` : '單一規格'}</p>
                                                </div>
                                            </div>
                                            <div class="d-flex">
                                                <span class="me-3">$ ${item.sale_price.toLocaleString()} × ${item.count}</span>
                                                <span class="o-subtotal">NT$ ${(item.sale_price * item.count).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    `;
                }))}
                            <div class="o-total-container">
                                <div class="o-total-item">
                                    <span>小計總額(合計)</span>
                                    <span class="o-subtotal">NT$ ${(orderData.total - orderData.shipment_fee + orderData.discount + orderData.use_rebate).toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>回饋金折抵</span>
                                    <span class="o-subtotal">− NT$ ${orderData.use_rebate.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>優惠折扣</span>
                                    <span class="o-subtotal">− NT$ ${orderData.discount.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>運費</span>
                                    <span class="o-subtotal">NT$ ${orderData.shipment_fee.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span class="o-total-text">總付款金額</span>
                                    <span class="o-total">NT$ ${orderData.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>
                        ${orderData.method === 'off_line' && orderData.customer_info.payment_select !== 'cash_on_delivery'
                    ? html `<section class="o-card">
                                  <h3 class="mb-3">付款資訊</h3>
                                  ${payInfo()}
                                  <div
                                      class="o-button"
                                      onclick="${gvc.event(() => {
                        setTimeout(() => {
                            $('html').scrollTop(0);
                        }, 100);
                        vm.type = 'upload';
                    })}"
                                  >
                                      <span class="o-button-text">${orderData.proof_purchase ? '重新上傳結帳證明' : '上傳結帳證明'}</span>
                                  </div>
                              </section>`
                    : ''}
                        <section class="o-card-row">
                            <div class="col-12 col-md-6 mb-3 px-0">
                                <h3 class="mb-3">訂單資訊</h3>
                                ${(() => {
                    function checkAndRemoveURLParameter() {
                        let key = 'EndCheckout';
                        let url = window.location.href;
                        let urlParts = url.split('?');
                        if (urlParts.length >= 2) {
                            let params = urlParts[1].split('&');
                            let existParams = params.find((param) => {
                                return param.split('=')[0] === key;
                            });
                            let updatedParams = params.filter((param) => {
                                return param.split('=')[0] !== key;
                            });
                            url = urlParts[0] + (updatedParams.length > 0 ? '?' + updatedParams.join('&') : '');
                            window.history.replaceState({}, document.title, url);
                            if (existParams && vm.data.status) {
                                Ad.gtagEvent('purchase', {
                                    transaction_id: vm.data.cart_token,
                                    value: orderData.total,
                                    shipping: orderData.shipment_fee,
                                    currency: 'TWD',
                                    coupon: orderData.voucherList && orderData.voucherList.length > 0 ? orderData.voucherList[0].title : '',
                                    items: orderData.lineItems.map((item, index) => {
                                        return {
                                            item_id: item.id,
                                            item_name: item.title,
                                            discount: item.discount_price,
                                            index: index,
                                            item_variant: item.spec.join('-'),
                                            price: item.sale_price,
                                            quantity: item.count,
                                        };
                                    }),
                                });
                            }
                        }
                    }
                    checkAndRemoveURLParameter();
                    const arr = [
                        {
                            title: '訂單號碼',
                            value: vm.data.cart_token,
                        },
                        {
                            title: '訂單日期',
                            value: gvc.glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd'),
                        },
                        {
                            title: '訂單狀態',
                            value: (() => {
                                switch (orderData.orderStatus) {
                                    case '-1':
                                        return '已取消';
                                    case '1':
                                        return '已完成';
                                    case '-99':
                                        return '已刪除';
                                    default:
                                        return '處理中';
                                }
                            })(),
                        },
                        {
                            title: '付款狀態',
                            value: (() => {
                                if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                                    return '貨到付款';
                                }
                                switch (vm.data.status) {
                                    case 0:
                                        return orderData.proof_purchase
                                            ? '等待核款'
                                            : `尚未付款${orderData.method === 'off_line'
                                                ? ''
                                                : html `<div
                                                                            class="go-to-checkout ms-3"
                                                                            onclick="${gvc.event(() => {
                                                    UMOrder.repay(gvc, vm.data.cart_token);
                                                })}"
                                                                        >
                                                                            <div class="go-to-checkout-text">前往結帳</div>
                                                                        </div>`}`;
                                    case 1:
                                        return '已付款';
                                    case -1:
                                        return '付款失敗';
                                    case -2:
                                        return '已退款';
                                }
                            })(),
                        },
                    ];
                    return gvc.map(arr.map((item) => {
                        return html `
                                                <div class="o-title-container">
                                                    <div class="o-title me-1">${item.title}：</div>
                                                    <div class="o-title">${item.value}</div>
                                                </div>
                                            `;
                    }));
                })()}
                            </div>
                            <div class="col-12 col-md-6 mb-3 px-0">
                                <h3 class="mb-3">顧客資訊</h3>
                                ${(() => {
                    var _a;
                    const arr = [
                        {
                            title: '姓名',
                            value: orderData.customer_info.name,
                        },
                        {
                            title: '電話',
                            value: orderData.customer_info.phone,
                        },
                        {
                            title: '信箱',
                            value: orderData.customer_info.email,
                        },
                    ].concat(((_a = orderData.custom_form_format) !== null && _a !== void 0 ? _a : [])
                        .map((dd) => {
                        return {
                            title: dd.title,
                            value: orderData.custom_form_data[dd.key],
                        };
                    })
                        .filter((d1) => {
                        return d1.value;
                    }));
                    return gvc.map(arr.map((item) => {
                        return html `
                                                <div class="o-title-container">
                                                    <div class="o-title me-1">${item.title}：</div>
                                                    <div class="o-title">${item.value}</div>
                                                </div>
                                            `;
                    }));
                })()}
                            </div>
                            <div class="col-12 col-md-6 mb-3 px-0">
                                <h3 class="mb-3">配送資訊</h3>
                                ${(() => {
                    const selector = orderData.shipment_selector.find((dd) => {
                        return dd.value === orderData.user_info.shipment;
                    });
                    let arr = [
                        {
                            title: '配送方式',
                            value: (() => {
                                if (selector) {
                                    return selector.name;
                                }
                                switch (orderData.user_info.shipment) {
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
                                    case 'shop':
                                        return '實體門市取貨';
                                    default:
                                        return '宅配到府';
                                }
                            })(),
                        },
                    ];
                    if (['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].find((dd) => {
                        return dd === orderData.user_info.shipment;
                    })) {
                        arr = [
                            ...arr,
                            ...[
                                { title: '門市店號', value: decodeURI(orderData.user_info.CVSStoreID) },
                                { title: '門市名稱', value: decodeURI(orderData.user_info.CVSStoreName) },
                                { title: '門市地址', value: decodeURI(orderData.user_info.CVSAddress) },
                            ],
                        ];
                    }
                    else if (orderData.user_info.address) {
                        arr.push({ title: '收件地址', value: orderData.user_info.address });
                    }
                    arr.push({
                        title: '配送狀態',
                        value: (() => {
                            switch (orderData.progress) {
                                case 'shipping':
                                    return '已出貨';
                                case 'finish':
                                    return '已取貨';
                                case 'arrived':
                                    return '已送達';
                                case 'returns':
                                    return '已退貨';
                                default:
                                    return '揀貨中';
                            }
                        })(),
                    });
                    if (orderData.user_info.shipment_info) {
                        arr.push({ title: '配送說明', value: orderData.user_info.shipment_info });
                    }
                    arr = [
                        ...arr,
                        ...[
                            { title: '收件人姓名', value: orderData.user_info.name },
                            { title: '收件人信箱', value: orderData.user_info.email },
                            { title: '收件人電話', value: orderData.user_info.phone },
                        ],
                    ];
                    if (selector && selector.form) {
                        arr = arr.concat(selector.form.map((dd) => {
                            return {
                                title: dd.title,
                                value: orderData.user_info.custom_form_delivery[dd.key],
                            };
                        }));
                    }
                    if (orderData.user_info.note) {
                        arr.push({ title: '配送備註', value: orderData.user_info.note });
                    }
                    return gvc.map(arr.map((item) => {
                        return html `
                                                <div class="o-title-container">
                                                    <div class="o-title me-1">${item.title}：</div>
                                                    <div class="o-title">${item.value}</div>
                                                </div>
                                            `;
                    }));
                })()}
                            </div>
                        </section>
                        <section
                            class="m-auto d-flex align-items-center justify-content-center my-5"
                            style="cursor: pointer;"
                            onclick="${gvc.event(() => {
                    location.href = './order_list';
                })}"
                        >
                            <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                            <span class="go-back-text">返回訂單列表</span>
                        </section>
                    `;
            },
            divCreate: {
                class: 'd-flex align-items-center justify-content-center gap-3 flex-column',
                style: 'min-height: 50vh;',
            },
            onCreate: () => {
                if (loadings.view) {
                    ApiShop.getOrder({
                        limit: 1,
                        page: 0,
                        data_from: 'user',
                        search: glitter.getUrlParameter('cart_token'),
                        searchType: 'cart_token',
                    }).then((res) => {
                        if (res.result && res.response.data) {
                            vm.data = res.response.data[0];
                        }
                        else {
                            vm.data = {};
                        }
                        loadings.view = false;
                        gvc.notifyDataChange(ids.view);
                    });
                }
            },
        })}
        </div>`;
    }
}
UMOrder.atmFormList = [
    {
        col: '12',
        key: 'pay-date',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '付款時間*',
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
                version: 'v2',
            },
            label: {
                list: [],
                class: 'form-label fs-base ',
                style: '',
                version: 'v2',
            },
            container: {
                list: [],
                class: '',
                style: '',
                version: 'v2',
            },
        },
        form_config: {
            type: 'date',
            title: '',
            input_style: {},
            title_style: {},
            place_holder: '請輸入付款時間',
        },
    },
    {
        col: '12',
        key: 'bank_name',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '我的銀行名稱*',
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
                version: 'v2',
            },
            label: {
                list: [],
                class: 'form-label fs-base ',
                style: '',
                version: 'v2',
            },
            container: {
                list: [],
                class: '',
                style: '',
                version: 'v2',
            },
        },
        form_config: {
            type: 'name',
            title: '',
            input_style: {},
            title_style: {},
            place_holder: '請輸入我的銀行名稱',
        },
    },
    {
        col: '12',
        key: 'bank_account',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '我的銀行戶名*',
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
                version: 'v2',
            },
            label: {
                list: [],
                class: 'form-label fs-base ',
                style: '',
                version: 'v2',
            },
            container: {
                list: [],
                class: '',
                style: '',
                version: 'v2',
            },
        },
        form_config: {
            type: 'name',
            title: '',
            input_style: {},
            title_style: {},
            place_holder: '請輸入我的銀行戶名',
        },
    },
    {
        col: '12',
        key: 'trasaction_code',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '銀行帳號後五碼*',
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
                version: 'v2',
            },
            label: {
                list: [],
                class: 'form-label fs-base ',
                style: '',
                version: 'v2',
            },
            container: {
                list: [],
                class: '',
                style: '',
                version: 'v2',
            },
        },
        form_config: {
            type: 'name',
            title: '',
            input_style: {},
            title_style: {},
            place_holder: '請輸入銀行帳號後五碼',
        },
    },
];
UMOrder.lineFormList = [
    {
        col: '12',
        key: 'image',
        page: 'image_uploader_widget',
        type: 'form_plugin_v2',
        group: '',
        title: '',
        col_sm: '12',
        appName: 'cms_system',
        require: 'true',
        readonly: 'write',
        formFormat: '{}',
        moduleName: '檔案上傳',
        style_data: {
            input: {
                list: [],
                class: '',
                style: '',
                version: 'v2',
            },
            label: {
                list: [],
                class: 'form-label fs-base ',
                style: '',
                version: 'v2',
            },
            container: {
                list: [],
                class: '',
                style: '',
                version: 'v2',
            },
        },
        form_config: {
            type: 'image/*',
            title: '',
            input_style: {},
            title_style: {},
            place_holder: '請輸入銀行帳號後五碼',
        },
    },
];
window.glitter.setModule(import.meta.url, UMOrder);
