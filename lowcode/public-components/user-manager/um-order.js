import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Ad } from '../public/ad.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { Language } from '../../glitter-base/global/language.js';
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
                cursor: pointer;
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
        dialog.dataLoading({ visible: true, text: Language.text('loading') });
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
                    return html ` <section class="o-h2">${Language.text('order_not_found')}</section> `;
                }
                const orderData = vm.data.orderData;
                function payInfo() {
                    let arr = [];
                    if (orderData.customer_info.payment_select === 'atm') {
                        arr = [
                            {
                                title: Language.text('bank_name'),
                                value: orderData.payment_info_atm.bank_name,
                            },
                            {
                                title: Language.text('bank_code'),
                                value: orderData.payment_info_atm.bank_code,
                            },
                            {
                                title: Language.text('remittance_account_name'),
                                value: orderData.payment_info_atm.bank_user,
                            },
                            {
                                title: Language.text('remittance_account_number'),
                                value: orderData.payment_info_atm.bank_account,
                            },
                            {
                                title: Language.text('remittance_amount'),
                                value: orderData.total.toLocaleString(),
                            },
                            {
                                title: Language.text('payment_instructions'),
                                value: orderData.payment_info_atm.text,
                            },
                        ];
                    }
                    else if (orderData.customer_info.payment_select === 'line') {
                        arr = [
                            {
                                title: Language.text('payment_instructions'),
                                value: orderData.payment_info_line_pay.text,
                            },
                        ];
                    }
                    else {
                        arr = [
                            {
                                title: Language.text('payment_instructions'),
                                value: orderData.payment_info_text,
                            },
                        ];
                    }
                    return gvc.map(arr.map((item) => {
                        return html `
                                    <div class="o-title-container ${item.title === Language.text('payment_instructions') ? 'align-items-start mt-2' : ''}">
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
                    if (!paymentTime) {
                        dialog.errorMessage({ text: Language.text('payment_time_not_filled') });
                        return false;
                    }
                    if (!bankName) {
                        dialog.errorMessage({ text: Language.text('bank_name_not_filled') });
                        return false;
                    }
                    if (!accountName) {
                        dialog.errorMessage({ text: Language.text('bank_account_name_not_filled') });
                        return false;
                    }
                    if (!/^\d{5}$/.test(accountLastFive)) {
                        dialog.errorMessage({ text: Language.text('last_five_digits_five_digits') });
                        return false;
                    }
                    return true;
                }
                if (vm.type === 'upload') {
                    let formData = {};
                    return html `
                            <section class="o-h1">${Language.text('order_number')}<br />#${vm.data.cart_token}</section>
                            <section class="o-card-row" style="max-width: 100%;">
                                <div class="col-12 col-md-6 px-2">
                                    <h3 class="mb-3 text-center">${Language.text('payment_info')}</h3>
                                    <div class="o-gray-line"></div>
                                    ${payInfo()}
                                </div>
                                <div class="col-12 col-md-6 px-2">
                                    <h3 class="mb-3 text-center">${Language.text('payment_proof')}</h3>
                                    <div class="o-gray-line"></div>
                                    <span class="o-gray-text"
                                        >${(() => {
                        if (orderData.customer_info.payment_select === 'atm') {
                            return html `＊${Language.text('please_confirm_bank_account_details')}`;
                        }
                        else if (orderData.customer_info.payment_select === 'line') {
                            return html `＊${Language.text('upload_screenshot_for_verification')}`;
                        }
                        return html `＊${Language.text('please_confirm_bank_account_details')}<br />＊${Language.text('upload_screenshot_or_transfer_proof')}`;
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
                        dialog.dataLoading({ visible: true, text: Language.text('data_submitting') });
                        ApiShop.proofPurchase(vm.data.cart_token, formData).then(() => {
                            dialog.dataLoading({ visible: false });
                            location.reload();
                        });
                    })}"
                                    >
                                        <span class="o-button-text">${Language.text('confirm')}</span>
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
                                <span class="go-back-text">${Language.text('return_to_order_details')}</span>
                            </section>
                        `;
                }
                return html `
                        <section class="o-h1">${Language.text('order_number')}<br />#${vm.data.cart_token}</section>
                        <section class="o-card">
                            <h3 class="mb-3">${Language.text('order_details')}</h3>
                            ${gvc.map(orderData.lineItems.map((item) => {
                    return html `
                                        <div class="o-line-item ${(document.body.clientWidth < 800) ? `p-2` : ``}">
                                            <div class="d-flex gap-3 align-items-center">
                                                <div>
                                                    ${UmClass.validImageBox({
                        gvc,
                        image: item.preview_image,
                        width: 60,
                        style: 'border-radius: 10px;',
                    })}
                                                </div>
                                                <div class="">
                                                    <p
                                                        class="o-item-title"
                                                        onclick="${gvc.event(() => {
                        dialog.dataLoading({ visible: true, text: Language.text('loading') });
                        ApiShop.getProduct({
                            page: 0,
                            limit: 1,
                            id: `${item.id}`,
                        }).then((data) => {
                            dialog.dataLoading({ visible: false });
                            try {
                                if (data.result && data.response.data) {
                                    location.href = `.${Language.getLanguageLinkPrefix(false)}/products/${data.response.data.content.seo.domain}`;
                                }
                            }
                            catch (error) {
                                dialog.errorMessage({ text: Language.text('product_not_found') });
                            }
                        });
                    })}"
                                                    >
                                                        ${item.title}
                                                    </p>
                                                    <p class="o-item-spec">
                                                        ${item.spec.length > 0 ? `${Language.text('specification')}：${item.spec.join(' / ')}` : Language.text('single_specification')}
                                                    </p>
                                                    <span class="me-3  d-sm-none">NT ${item.sale_price.toLocaleString()} × ${item.count}</span>
                                                </div>
                                            </div>
                                            <div class="d-none d-sm-flex">
                                                <span class="me-3 d-none d-sm-block">$ ${item.sale_price.toLocaleString()} × ${item.count}</span>
                                                <span class="o-subtotal">NT$ ${(item.sale_price * item.count).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    `;
                }))}
                            <div class="o-total-container">
                                <div class="o-total-item">
                                    <span>${Language.text('subtotal_amount')}</span>
                                    <span class="o-subtotal">NT$ ${(orderData.total - orderData.shipment_fee + orderData.discount + orderData.use_rebate).toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>${Language.text('shopping_credit_offset')}</span>
                                    <span class="o-subtotal">− NT$ ${orderData.use_rebate.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>${Language.text('discount_coupon')}</span>
                                    <span class="o-subtotal">− NT$ ${orderData.discount.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>${Language.text('shipping_fee')}</span>
                                    <span class="o-subtotal">NT$ ${orderData.shipment_fee.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span class="o-total-text">${Language.text('total_amount')}</span>
                                    <span class="o-total">NT$ ${orderData.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>
                        ${orderData.method === 'off_line' && orderData.customer_info.payment_select !== 'cash_on_delivery'
                    ? html `<section class="o-card">
                                  <h3 class="mb-3">${Language.text('payment_info')}</h3>
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
                                      <span class="o-button-text">${orderData.proof_purchase ? Language.text('reupload_checkout_proof') : Language.text('upload_checkout_proof')}</span>
                                  </div>
                              </section>`
                    : ''}
                        <section class="o-card-row">
                            <div class="col-12 col-md-6 mb-3 px-0">
                                <h3 class="mb-3">${Language.text('order_information')}</h3>
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
                            title: Language.text('order_number'),
                            value: vm.data.cart_token,
                        },
                        {
                            title: Language.text('order_date'),
                            value: gvc.glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd'),
                        },
                        {
                            title: Language.text('order_status'),
                            value: (() => {
                                switch (orderData.orderStatus) {
                                    case '-1':
                                        return Language.text('cancelled');
                                    case '1':
                                        return Language.text('completed');
                                    case '-99':
                                        return Language.text('deleted');
                                    default:
                                        return Language.text('processing');
                                }
                            })(),
                        },
                        {
                            title: Language.text('payment_status'),
                            value: (() => {
                                if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                                    return Language.text('cash_on_delivery');
                                }
                                switch (vm.data.status) {
                                    case 0:
                                        return orderData.proof_purchase
                                            ? Language.text('awaiting_verification')
                                            : `${Language.text('unpaid')}${orderData.method === 'off_line'
                                                ? ''
                                                : html `<div
                                                                            class="go-to-checkout ms-3"
                                                                            onclick="${gvc.event(() => {
                                                    UMOrder.repay(gvc, vm.data.cart_token);
                                                })}"
                                                                        >
                                                                            <div class="go-to-checkout-text">${Language.text('proceed_to_checkout')}</div>
                                                                        </div>`}`;
                                    case 1:
                                        return Language.text('paid');
                                    case -1:
                                        return Language.text('payment_failed');
                                    case -2:
                                        return Language.text('refunded');
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
                                <h3 class="mb-3">${Language.text('customer_information')}</h3>
                                ${(() => {
                    var _a;
                    const arr = [
                        {
                            title: Language.text('name'),
                            value: orderData.customer_info.name,
                        },
                        {
                            title: Language.text('contact_number'),
                            value: orderData.customer_info.phone,
                        },
                        {
                            title: Language.text('email'),
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
                                <h3 class="mb-3">${Language.text('shipping_information')}</h3>
                                ${(() => {
                    const selector = orderData.shipment_selector.find((dd) => {
                        return dd.value === orderData.user_info.shipment;
                    });
                    let arr = [
                        {
                            title: Language.text('shipping_method'),
                            value: (() => {
                                if (selector) {
                                    return selector.name;
                                }
                                switch (orderData.user_info.shipment) {
                                    case 'FAMIC2C':
                                        return Language.text('ship_FAMIC2C');
                                    case 'HILIFEC2C':
                                        return Language.text('ship_HILIFEC2C');
                                    case 'OKMARTC2C':
                                        return Language.text('ship_OKMARTC2C');
                                    case 'UNIMARTC2C':
                                        return Language.text('ship_UNIMARTC2C');
                                    case 'shop':
                                        return Language.text('ship_shop');
                                    default:
                                        return Language.text('ship_normal');
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
                                {
                                    title: Language.text('store_number'),
                                    value: decodeURI(orderData.user_info.CVSStoreID),
                                },
                                {
                                    title: Language.text('store_name'),
                                    value: decodeURI(orderData.user_info.CVSStoreName),
                                },
                                {
                                    title: Language.text('store_address'),
                                    value: decodeURI(orderData.user_info.CVSAddress),
                                },
                            ],
                        ];
                    }
                    else if (orderData.user_info.address) {
                        arr.push({
                            title: Language.text('receiving_address'),
                            value: orderData.user_info.address,
                        });
                    }
                    arr.push({
                        title: Language.text('shipping_status'),
                        value: (() => {
                            switch (orderData.progress) {
                                case 'shipping':
                                    return Language.text('shipped');
                                case 'finish':
                                    return Language.text('delivered');
                                case 'arrived':
                                    return Language.text('picked_up');
                                case 'returns':
                                    return Language.text('returned');
                                default:
                                    return Language.text('picking');
                            }
                        })(),
                    });
                    if (orderData.user_info.shipment_info) {
                        arr.push({
                            title: Language.text('shipping_instructions'),
                            value: orderData.user_info.shipment_info,
                        });
                    }
                    arr = [
                        ...arr,
                        ...[
                            {
                                title: Language.text('recipient_name'),
                                value: orderData.user_info.name,
                            },
                            {
                                title: Language.text('recipient_phone'),
                                value: orderData.user_info.email,
                            },
                            {
                                title: Language.text('recipient_email'),
                                value: orderData.user_info.phone,
                            },
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
                        arr.push({
                            title: Language.text('shipping_notes'),
                            value: orderData.user_info.note,
                        });
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
                    location.href = `.${Language.getLanguageLinkPrefix(true)}/order_list`;
                })}"
                        >
                            <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                            <span class="go-back-text">${Language.text('return_to_order_list')}</span>
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
        title: Language.text('payment_time'),
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
            place_holder: '',
        },
    },
    {
        col: '12',
        key: 'bank_name',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: Language.text('my_bank_name'),
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
            place_holder: Language.text('enter_your_bank_name'),
        },
    },
    {
        col: '12',
        key: 'bank_account',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: Language.text('my_bank_account_name'),
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
            place_holder: Language.text('enter_your_bank_account_name'),
        },
    },
    {
        col: '12',
        key: 'trasaction_code',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: Language.text('last_five_digits_of_bank_account'),
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
            place_holder: Language.text('enter_five_digits'),
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
        moduleName: Language.text('file_upload'),
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
            place_holder: '',
        },
    },
];
window.glitter.setModule(import.meta.url, UMOrder);