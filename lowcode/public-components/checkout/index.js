var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Tool } from '../../modules/tool.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { ApiDelivery } from '../../glitter-base/route/delivery.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { PdClass } from '../product/pd-class.js';
import { Ad } from '../public/ad.js';
import { ApiWallet } from '../../glitter-base/route/wallet.js';
import { Language } from '../../glitter-base/global/language.js';
import { FakeOrder } from './fake-order.js';
const html = String.raw;
export class CheckoutIndex {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const ids = {
            page: glitter.getUUID(),
            cart: glitter.getUUID(),
            shipping: glitter.getUUID(),
        };
        const loadings = {
            page: true,
        };
        const vm = {
            cartData: {},
            rebateConfig: {
                title: '購物金',
            },
            goodsWeight: 0,
        };
        const classPrefix = Tool.randomString(6);
        PdClass.addSpecStyle(gvc);
        function spinner(obj) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const container = {
                class: `${(_b = (_a = obj === null || obj === void 0 ? void 0 : obj.container) === null || _a === void 0 ? void 0 : _a.class) !== null && _b !== void 0 ? _b : ''}`,
                style: `margin-top: 2rem ;${(_c = obj === null || obj === void 0 ? void 0 : obj.container) === null || _c === void 0 ? void 0 : _c.style}`,
            };
            const circleAttr = {
                visible: ((_d = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _d === void 0 ? void 0 : _d.visible) === false ? false : true,
                width: (_f = (_e = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _e === void 0 ? void 0 : _e.width) !== null && _f !== void 0 ? _f : 20,
                borderSize: (_h = (_g = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _g === void 0 ? void 0 : _g.borderSize) !== null && _h !== void 0 ? _h : 16,
            };
            const textAttr = {
                value: (_k = (_j = obj === null || obj === void 0 ? void 0 : obj.text) === null || _j === void 0 ? void 0 : _j.value) !== null && _k !== void 0 ? _k : Language.text('loading'),
                visible: ((_l = obj === null || obj === void 0 ? void 0 : obj.text) === null || _l === void 0 ? void 0 : _l.visible) === false ? false : true,
                fontSize: (_o = (_m = obj === null || obj === void 0 ? void 0 : obj.text) === null || _m === void 0 ? void 0 : _m.fontSize) !== null && _o !== void 0 ? _o : 16,
            };
            return html ` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}" style="${container.style}">
                <div
                    class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
                    style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
                    role="status"
                ></div>
                <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}" style="font-size: ${textAttr.fontSize}px;">${textAttr.value}</span>
            </div>`;
        }
        function gClass(text) {
            if (Array.isArray(text)) {
                return text.map((c) => gClass(c)).join(' ');
            }
            return `${classPrefix}-${text}`;
        }
        function addItemBadge() {
            return html ` <div class="${gClass('add-item-badge')}">
                <div class="${gClass('add-item-text')}">${Language.text('addon')}</div>
            </div>`;
        }
        function giftBadge() {
            return html ` <div class="${gClass('add-item-badge')}" style="background: #95ffe0;">
                <div class="${gClass('add-item-text')}">${Language.text('gift')}</div>
            </div>`;
        }
        function addStyle() {
            gvc.addStyle(`
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
                    background: #dddddd;
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
                    color:#393939;
                }

                .${classPrefix}-select:focus {
                    outline: 0;
                }

                .${classPrefix}-group-input {
                    border: none;
                    background: none;
                    text-align: start;
                    color: #393939;
                    font-size: 16px;
                    font-weight: 400;
                    word-wrap: break-word;
                    padding-left: 12px;
                }

                .${classPrefix}-first-td {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30%;
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

                .${classPrefix}-shipping-hint {
                    white-space: normal;
                    word-break: break-all;
                    color: #8d8d8d;
                    font-size: 14px;
                    font-weight: 400;
                    margin: 4px 0;
                }

                .img-106px {
                    width: 106px;
                    min-width: 106px;
                    height: 106px;
                    border-radius: 3px;
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                }

                .banner-font-15 {
                    font-size: 15px;
                    font-style: normal;
                    font-weight: 400;
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 130px;
                    text-overflow: ellipsis;
                }

                .ntd-font-14 {
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 140%;
                }
            `);
            gvc.addStyle(`
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

                    .${classPrefix}-price-container {
                        display: flex;
                        flex-direction: column;
                        width: 100% !important;
                        align-items: center;
                        padding: 0;
                        gap: 12px;
                        margin: 24px 0;
                    }
                }
            `);
        }
        function refreshCartData() {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ visible: true });
            const beta = false;
            if (!beta) {
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(ApiCart.cart);
                        });
                    }).then((res) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const cartData = {
                            line_items: [],
                            total: 0,
                            user_info: {
                                shipment: localStorage.getItem('shipment-select'),
                            },
                        };
                        if (res.line_items) {
                            res.user_info = {
                                shipment: localStorage.getItem('shipment-select'),
                            };
                            const cart = res;
                            ApiShop.getCheckout(cart).then((res) => {
                                if (res.result) {
                                    resolve(res.response.data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }
                        else {
                            for (const b of Object.keys(res)) {
                                cartData.line_items.push({
                                    id: b.split('-')[0],
                                    count: res[b],
                                    spec: b.split('-').filter((dd, index) => {
                                        return index !== 0;
                                    }),
                                });
                            }
                            const voucher = ApiCart.cart.code;
                            const rebate = ApiCart.cart.use_rebate || 0;
                            const distributionCode = (_a = localStorage.getItem('distributionCode')) !== null && _a !== void 0 ? _a : '';
                            ApiShop.getCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count,
                                    };
                                }),
                                code: voucher,
                                use_rebate: GlobalUser.token && rebate ? rebate : undefined,
                                distribution_code: distributionCode,
                                user_info: {
                                    shipment: localStorage.getItem('shipment-select'),
                                },
                            }).then((res) => {
                                if (res.result) {
                                    resolve(res.response.data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }
                    }));
                })).then((data) => {
                    vm.cartData = data;
                    ApiWallet.getRebateConfig({ type: 'me' }).then((res) => __awaiter(this, void 0, void 0, function* () {
                        if (res.result && res.response.data) {
                            vm.rebateConfig = res.response.data;
                        }
                        vm.rebateConfig.title = CheckInput.isEmpty(vm.rebateConfig.title) ? Language.text('shopping_credit') : vm.rebateConfig.title;
                        gvc.addMtScript([
                            {
                                src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`,
                            },
                        ], () => { }, () => { });
                        loadings.page = false;
                        dialog.dataLoading({ visible: false });
                        gvc.notifyDataChange(['js-cart-count', ids.page]);
                    }));
                });
            }
            else {
                gvc.addMtScript([
                    {
                        src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`,
                    },
                ], () => { }, () => { });
                vm.cartData = FakeOrder.data;
                ApiWallet.getRebateConfig({ type: 'me' }).then((res) => __awaiter(this, void 0, void 0, function* () {
                    if (res.result && res.response.data) {
                        vm.rebateConfig = res.response.data;
                    }
                    vm.rebateConfig.title = CheckInput.isEmpty(vm.rebateConfig.title) ? Language.text('shopping_credit') : vm.rebateConfig.title;
                    gvc.addMtScript([
                        {
                            src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`,
                        },
                    ], () => { }, () => { });
                    loadings.page = false;
                    dialog.dataLoading({ visible: false });
                    gvc.notifyDataChange(['js-cart-count', ids.page]);
                }));
                loadings.page = false;
                dialog.dataLoading({ visible: false });
                gvc.notifyDataChange(ids.page);
            }
            gvc.glitter.recreateView('.js-cart-count');
        }
        refreshCartData();
        glitter.share.reloadCartData = () => {
            refreshCartData();
        };
        return gvc.bindView((() => {
            return {
                bind: ids.page,
                view: () => {
                    try {
                        if (loadings.page) {
                            return spinner();
                        }
                        this.initial(vm.cartData);
                        addStyle();
                        if (vm.cartData.lineItems.length === 0) {
                            return html `
                                    <div class="container ${gClass(['container', 'null-container'])}">
                                        <div class="${gClass('header')}">${Language.text('shopping_details')}</div>
                                        <lottie-player
                                            style="max-width: 100%; width: 300px; height: 300px;"
                                            src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
                                            speed="1"
                                            loop=""
                                            autoplay=""
                                            background="transparent"
                                        ></lottie-player>
                                        <div class="mt-3 fw-bold">${Language.text('empty_cart_message')}</div>
                                    </div>
                                `;
                        }
                        return html ` <div class="container ${gClass('container')}">
                                ${gvc.bindView((() => {
                            return {
                                bind: ids.cart,
                                view: () => {
                                    return html `
                                                    <section>
                                                        <div class="${gClass('banner-bgr')}">
                                                            <span class="${gClass('banner-text')}">${Language.text('your_shopping_cart')}</span>
                                                        </div>
                                                        <div class="d-none d-sm-flex align-items-center p-3 border-bottom">
                                                            <div class="${gClass('first-td')} justify-content-start">${Language.text('product_name')}</div>
                                                            <div class="${gClass('td')}">${Language.text('specification')}</div>
                                                            <div class="${gClass('td')}">${Language.text('unit_price')}</div>
                                                            <div class="${gClass('td')}">${Language.text('quantity')}</div>
                                                            <div class="${gClass('td')}">${Language.text('subtotal')}</div>
                                                        </div>
                                                        ${gvc.bindView({
                                        bind: glitter.getUUID(),
                                        view: () => {
                                            try {
                                                vm.goodsWeight = 0;
                                                return vm.cartData.lineItems
                                                    .map((item, index) => {
                                                    function getBadgeClass() {
                                                        if (item.is_add_on_items) {
                                                            return addItemBadge();
                                                        }
                                                        else if (item.is_gift) {
                                                            return giftBadge();
                                                        }
                                                        else {
                                                            return ``;
                                                        }
                                                    }
                                                    const title = (item.language_data && item.language_data[Language.getLanguage()].title) || item.title;
                                                    const spec = (() => {
                                                        if (item.spec) {
                                                            return item.spec.map((dd, index) => {
                                                                try {
                                                                    return (item.specs[index].option.find((d1) => {
                                                                        return d1.title === dd;
                                                                    }).language_title[Language.getLanguage()] || dd);
                                                                }
                                                                catch (e) {
                                                                    return dd;
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            return ``;
                                                        }
                                                    })();
                                                    if (item.shipment_obj.type === 'weight') {
                                                        vm.goodsWeight += item.count * item.shipment_obj.value;
                                                    }
                                                    if (vm.cartData.lineItems.length === index + 1) {
                                                        gvc.notifyDataChange(ids.shipping);
                                                    }
                                                    return html `
                                                                                <div class="d-flex flex-column border-bottom p-lg-3 px-1 py-3 gap-3">
                                                                                    <div class="d-flex w-100   position-relative" style="gap:20px;">
                                                                                        <div class="${gClass('first-td')} justify-content-start  d-sm-none">
                                                                                            <div
                                                                                                style="width: 88px;height: 88px;border-radius: 20px;background: 50%/cover url('${item.preview_image}')"
                                                                                            ></div>
                                                                                            <span class="ms-2 d-none">${getBadgeClass()}${item.title}</span>
                                                                                        </div>
                                                                                        <div class="d-flex flex-sm-row    flex-column w-100 position-relative" style="gap: 8px; position: relative;">
                                                                                            <div class="${gClass('first-td')} justify-content-start d-none d-sm-flex" style="">
                                                                                                <div
                                                                                                    style="width: 88px;height: 88px;border-radius: 20px;background: 50%/cover url('${item.preview_image}')"
                                                                                                ></div>
                                                                                                <span class="ms-2 d-flex align-items-start flex-column " style="gap:5px;"
                                                                                                    >${getBadgeClass()}${title}</span
                                                                                                >
                                                                                            </div>
                                                                                            <span class="d-flex align-items-start flex-column d-lg-none fw-bold" style="gap:5px;font-size:17px;"
                                                                                                >${getBadgeClass()}${title}</span
                                                                                            >
                                                                                            <div class="${gClass('td')}">${spec ? spec.join(' / ') : ''}</div>
                                                                                            <div class="${gClass('td')} d-flex flex-column align-items-start align-items-sm-center" style="gap:10px;">
                                                                                                <div class="">
                                                                                                    ${(() => {
                                                        if (item.is_gift) {
                                                            return `NT.0`;
                                                        }
                                                        return `NT.${parseInt(item.sale_price, 10).toLocaleString()}`;
                                                    })()}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="${gClass('td')}">
                                                                                                <select
                                                                                                    class="${gClass('select')}"
                                                                                                    style="width: 100px;"
                                                                                                    onchange="${gvc.event((e) => {
                                                        ApiCart.setCart((cartItem) => {
                                                            cartItem.line_items.find((dd) => {
                                                                return dd.id === item.id && item.spec.join('') === dd.spec.join('');
                                                            }).count = parseInt(e.value, 10);
                                                            refreshCartData();
                                                        });
                                                    })}"
                                                                                                    ${item.is_gift ? `disabled` : ``}
                                                                                                >
                                                                                                    ${[...new Array(99)]
                                                        .map((_, index) => {
                                                        return html ` <option value="${index + 1}" ${index + 1 === item.count ? `selected` : ``}>
                                                                                                                ${index + 1}
                                                                                                            </option>`;
                                                    })
                                                        .join('')}
                                                                                                </select>
                                                                                            </div>
                                                                                            <div class="d-block d-md-none" style="position: absolute; right: 0px; top:0px;">
                                                                                                <i
                                                                                                    class="fa-solid fa-xmark-large"
                                                                                                    style="cursor: pointer;"
                                                                                                    onclick="${gvc.event(() => {
                                                        ApiCart.setCart((cartItem) => {
                                                            cartItem.line_items = cartItem.line_items.filter((dd) => {
                                                                return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                                            });
                                                            refreshCartData();
                                                        });
                                                    })}"
                                                                                                ></i>
                                                                                            </div>
                                                                                            <span class="d-block d-md-none" style="position: absolute;bottom:0px;right:0px;"
                                                                                                >${Language.text('total')} NT.
                                                                                                ${(item.discount_price
                                                        ? (item.sale_price - item.discount_price) * item.count
                                                        : item.sale_price * item.count).toLocaleString()}</span
                                                                                            >
                                                                                            <div class="${gClass('td')}  d-none d-md-flex" style="bottom:0px;right:10px;">
                                                                                                <span class="d-none d-md-block"
                                                                                                    >${Language.text('total')} NT. ${(item.sale_price * item.count).toLocaleString()}</span
                                                                                                >
                                                                                                <div
                                                                                                    class="d-none d-md-block"
                                                                                                    style="position: absolute; right: -10px; transform: translateY(-50%); top: 50%;"
                                                                                                >
                                                                                                    <i
                                                                                                        class="fa-solid fa-xmark-large"
                                                                                                        style="cursor: pointer;"
                                                                                                        onclick="${gvc.event(() => {
                                                        ApiCart.setCart((cartItem) => {
                                                            cartItem.line_items = cartItem.line_items.filter((dd) => {
                                                                return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                                            });
                                                            refreshCartData();
                                                        });
                                                    })}"
                                                                                                    ></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        ${vm.cartData.voucherList
                                                        .filter((dd) => {
                                                        return (dd.bind.find((d2) => {
                                                            return d2.id === item.id;
                                                        }) &&
                                                            dd.reBackType !== 'giveaway' &&
                                                            dd.reBackType !== 'add_on_items');
                                                    })
                                                        .map((dd) => {
                                                        return `<div class="fs-6 w-100 " ><i class="fa-solid fa-tickets-perforated  me-2"></i>${dd.title}</div>`;
                                                    })
                                                        .join('<div class="my-1"></div>')}
                                                                                    </div>
                                                                                </div>
                                                                            `;
                                                })
                                                    .join('');
                                            }
                                            catch (e) {
                                                console.log(`error=>`, e);
                                                return ``;
                                            }
                                        },
                                    })}
                                                    </section>
                                                    <section class="d-flex">
                                                        <div class="flex-fill"></div>
                                                        <div class="${gClass('price-container')}">
                                                            <div class="${gClass(['price-row', 'text-2'])}">
                                                                <div>${Language.text('total_products')}</div>
                                                                <div>NT. ${(vm.cartData.total + vm.cartData.discount - vm.cartData.shipment_fee + vm.cartData.use_rebate).toLocaleString()}</div>
                                                            </div>
                                                            <div class="${gClass(['price-row', 'text-2'])}">
                                                                <div>${Language.text('shipping_fee')}</div>
                                                                <div>NT. ${vm.cartData.shipment_fee.toLocaleString()}</div>
                                                            </div>
                                                            <div class="${gClass(['price-row', 'text-2'])}">
                                                                <div>${Language.text('discount_coupon')}</div>
                                                                <div>- NT. ${vm.cartData.discount.toLocaleString()}</div>
                                                            </div>
                                                            <div class="${gClass(['price-row', 'text-2'])}">
                                                                <div>${Language.text('promo_code')}</div>
                                                                <div
                                                                    style="cursor: pointer; color: #3564c0;"
                                                                    onclick="${gvc.event(() => {
                                        this.viewDialog({
                                            gvc: gvc,
                                            title: Language.text('available_coupons'),
                                            tag: '',
                                            innerHTML: (gvc) => {
                                                return gvc.bindView((() => {
                                                    const id = glitter.getUUID();
                                                    const vmi = {
                                                        dataList: [],
                                                    };
                                                    const isWebsite = document.body.clientWidth > 768;
                                                    let loading = true;
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            try {
                                                                if (loading) {
                                                                    return html ` <div style="height: 400px">${spinner()}</div>`;
                                                                }
                                                                else {
                                                                    const header = [
                                                                        {
                                                                            title: Language.text('coupon_name'),
                                                                        },
                                                                        {
                                                                            title: Language.text('coupon_code'),
                                                                        },
                                                                        {
                                                                            title: Language.text('expiration_date'),
                                                                        },
                                                                        {
                                                                            title: '',
                                                                        },
                                                                    ];
                                                                    function formatText(item) {
                                                                        return [
                                                                            item.title,
                                                                            item.code,
                                                                            (() => {
                                                                                const endText = item.end_ISO_Date
                                                                                    ? glitter.ut.dateFormat(new Date(item.end_ISO_Date), 'yyyy/MM/dd')
                                                                                    : Language.text('no_expiration');
                                                                                return `${glitter.ut.dateFormat(new Date(item.start_ISO_Date), 'yyyy/MM/dd')} ~ ${endText}`;
                                                                            })(),
                                                                            item.usePass
                                                                                ? html ` <button
                                                                                                                          class="${gClass('button-bgr')} my-2"
                                                                                                                          style="max-width: 150px;"
                                                                                                                          onclick="${gvc.event(() => {
                                                                                    ApiCart.setCart((cartItem) => {
                                                                                        cartItem.code = item.code;
                                                                                        refreshCartData();
                                                                                        gvc.closeDialog();
                                                                                    });
                                                                                })}"
                                                                                                                      >
                                                                                                                          <span class="${gClass('button-text')}"
                                                                                                                              >${Language.text('select_to_use')}</span
                                                                                                                          >
                                                                                                                      </button>`
                                                                                : html ` <button
                                                                                                                          class="${gClass('button-bgr-disable')} my-2"
                                                                                                                          style="max-width: 150px; cursor: not-allowed"
                                                                                                                      >
                                                                                                                          <span class="${gClass('button-text')}"
                                                                                                                              >${Language.text('not_meet_usage_criteria')}</span
                                                                                                                          >
                                                                                                                      </button>`,
                                                                        ];
                                                                    }
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    const cloneCart = JSON.parse(JSON.stringify(vm.cartData));
                                                                    function checkCodeValue(code) {
                                                                        cloneCart.code = code;
                                                                        cloneCart.line_items = cloneCart.lineItems;
                                                                        dialog.dataLoading({ visible: true });
                                                                        ApiShop.getCheckout(cloneCart).then((r) => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            if (r.result &&
                                                                                r.response.data &&
                                                                                r.response.data.voucherList.some((dd) => {
                                                                                    return dd.code === code;
                                                                                })) {
                                                                                ApiCart.setCart((cartItem) => {
                                                                                    cartItem.code = code;
                                                                                    refreshCartData();
                                                                                    gvc.closeDialog();
                                                                                });
                                                                            }
                                                                            else {
                                                                                dialog.errorMessage({
                                                                                    text: Language.text('code_unusable'),
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                    if (isWebsite) {
                                                                        const flexList = [1.2, 1, 1.5, 1.5];
                                                                        return html `
                                                                                                                <div>
                                                                                                                    <div class="d-flex align-items-center mb-2">
                                                                                                                        <label class="${gClass('label')} mb-0 me-2" style="min-width: 80px;"
                                                                                                                            >${Language.text('enter_code')}</label
                                                                                                                        >
                                                                                                                        <input
                                                                                                                            class="${gClass('input')}"
                                                                                                                            type="text"
                                                                                                                            onchange="${gvc.event((e) => {
                                                                            checkCodeValue(e.value);
                                                                        })}"
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div class="w-100 d-sm-flex py-4 um-th-bar">
                                                                                                                    ${header
                                                                            .map((item, index) => {
                                                                            return html ` <div class="um-th" style="flex: ${flexList[index]};">
                                                                                                                                ${item.title}
                                                                                                                            </div>`;
                                                                        })
                                                                            .join('')}
                                                                                                                </div>
                                                                                                                ${vmi.dataList
                                                                            .map((item, t1) => {
                                                                            const fText = formatText(item.content);
                                                                            return html ` <div class="w-100 d-sm-flex py-1 align-items-center">
                                                                                                                            ${fText
                                                                                .map((dd, t2) => {
                                                                                return html ` <div
                                                                                                                                        class="um-td ${t2 === fText.length - 1 ? 'text-center' : ''}"
                                                                                                                                        style="flex: ${flexList[t2]}"
                                                                                                                                    >
                                                                                                                                        ${dd}
                                                                                                                                    </div>`;
                                                                            })
                                                                                .join('')}
                                                                                                                        </div>`;
                                                                        })
                                                                            .join('')}
                                                                                                            `;
                                                                    }
                                                                    return html ` <div>
                                                                                                            <div class="d-flex flex-column flex-sm-row align-items-center ">
                                                                                                                <div class="d-flex align-items-center">
                                                                                                                    <input
                                                                                                                        class="${gClass('input')}"
                                                                                                                        type="text"
                                                                                                                        style="border-top-right-radius: 0;border-bottom-right-radius: 0px;"
                                                                                                                        placeholder="${Language.text('enter_promo_code')}"
                                                                                                                    />
                                                                                                                    <button
                                                                                                                        class="${gClass('button-bgr')}"
                                                                                                                        style="width:100px;border-top-left-radius: 0;border-bottom-left-radius: 0px;"
                                                                                                                        onclick="${gvc.event((e) => {
                                                                        checkCodeValue(e.value);
                                                                    })}"
                                                                                                                    >
                                                                                                                        <span class="${gClass('button-text')}">${Language.text('confirm')}</span>
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="w-100 d-sm-none mb-3 s162413">
                                                                                                                ${vmi.dataList
                                                                        .map((item) => {
                                                                        return html ` <div class="um-mobile-area">
                                                                                                                            ${formatText(item.content)
                                                                            .map((dd, index) => {
                                                                            if (header[index].title === '') {
                                                                                return dd;
                                                                            }
                                                                            return html ` <div class="um-mobile-text">
                                                                                                                                        ${header[index].title} : ${dd}
                                                                                                                                    </div>`;
                                                                        })
                                                                            .join('')}
                                                                                                                        </div>`;
                                                                    })
                                                                        .join('')}
                                                                                                            </div>
                                                                                                        </div>`;
                                                                }
                                                            }
                                                            catch (e) {
                                                                return ``;
                                                            }
                                                        },
                                                        divCreate: {},
                                                        onCreate: () => {
                                                            if (loading) {
                                                                function isNowBetweenDates(startIso, endIso) {
                                                                    const now = new Date();
                                                                    const startDate = new Date(startIso);
                                                                    const endDate = new Date(endIso);
                                                                    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                                                                        return true;
                                                                    }
                                                                    return now >= startDate && now <= endDate;
                                                                }
                                                                gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                                                                    ApiShop.getVoucher({
                                                                        page: 0,
                                                                        limit: 10000,
                                                                        data_from: 'user',
                                                                    }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                                                        if (res.result && res.response.data) {
                                                                            vmi.dataList = res.response.data.filter((item) => {
                                                                                return (item.content.trigger === 'code' &&
                                                                                    isNowBetweenDates(item.content.start_ISO_Date, item.content.end_ISO_Date));
                                                                            });
                                                                        }
                                                                        else {
                                                                            vmi.dataList = [];
                                                                        }
                                                                        const cloneCart = JSON.parse(JSON.stringify(vm.cartData));
                                                                        Promise.all(vmi.dataList.map((voucher, index) => {
                                                                            return new Promise((resolve) => {
                                                                                const code = voucher.content.code;
                                                                                cloneCart.code = code;
                                                                                cloneCart.line_items = cloneCart.lineItems;
                                                                                ApiShop.getCheckout(cloneCart).then((response) => {
                                                                                    resolve({
                                                                                        code,
                                                                                        response,
                                                                                    });
                                                                                });
                                                                            });
                                                                        })).then((resolveArray) => {
                                                                            vmi.dataList = vmi.dataList.map((item) => {
                                                                                const f = resolveArray.find((res) => {
                                                                                    return item.content.code === res.code;
                                                                                });
                                                                                if (f) {
                                                                                    const r = f.response;
                                                                                    if (r.result && r.response.data) {
                                                                                        item.content.usePass = r.response.data.voucherList.some((dd) => {
                                                                                            return dd.code === f.code;
                                                                                        });
                                                                                    }
                                                                                }
                                                                                return item;
                                                                            });
                                                                            loading = false;
                                                                            gvc.notifyDataChange(id);
                                                                        });
                                                                    }));
                                                                }, () => { });
                                                            }
                                                        },
                                                    };
                                                })());
                                            },
                                        });
                                    })}"
                                                                >
                                                                    ${vm.cartData.code
                                        ? html `${vm.cartData.code}<i
                                                                                  class="fa-solid fa-xmark-large ms-2"
                                                                                  style="cursor: pointer;"
                                                                                  onclick="${gvc.event((e, event) => {
                                            event.stopPropagation();
                                            ApiCart.setCart((cartItem) => {
                                                cartItem.code = '';
                                                refreshCartData();
                                            });
                                        })}"
                                                                              ></i>`
                                        : Language.text('add')}
                                                                </div>
                                                            </div>
                                                            ${(() => {
                                        if (!GlobalUser.token) {
                                            return ``;
                                        }
                                        else {
                                            return html ` ${(() => {
                                                let tempRebate = 0;
                                                const dialog = new ShareDialog(gvc.glitter);
                                                return html ` <div class="${gClass(['price-row', 'text-2'])}">
                                                                                    <div>${Language.text('special_discount')} : ${vm.rebateConfig.title}</div>
                                                                                    <div>- NT. ${vm.cartData.use_rebate.toLocaleString()}</div>
                                                                                </div>

                                                                                <div class="${gClass(['price-row', 'text-2'])}">
                                                                                    <div
                                                                                        style="  justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                                    .body.clientWidth > 768
                                                    ? 'gap: 18px;'
                                                    : 'gap: 0px;'}"
                                                                                        class="w-100"
                                                                                    >
                                                                                        <input
                                                                                            class="flex-fill ${gClass('group-input')}"
                                                                                            placeholder="${Language.text('please_enter')}${vm.rebateConfig.title}"
                                                                                            style="${document.body.clientWidth < 800 ? `width:calc(100% - 150px) !important;` : ``}"
                                                                                            value="${vm.cartData.use_rebate || ''}"
                                                                                            onchange="${gvc.event((e, event) => {
                                                    if (CheckInput.isNumberString(e.value)) {
                                                        tempRebate = parseInt(e.value, 10);
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: Language.text('enter_value') });
                                                        gvc.notifyDataChange(ids.page);
                                                    }
                                                })}"
                                                                                        />
                                                                                        <div class="${gClass('group-button')}">
                                                                                            <div
                                                                                                class="${gClass('button-text')}"
                                                                                                onclick="${gvc.event((e) => __awaiter(this, void 0, void 0, function* () {
                                                    const sum = yield new Promise((resolve, reject) => {
                                                        ApiShop.getRebate({}).then((res) => __awaiter(this, void 0, void 0, function* () {
                                                            if (res.result && res.response.sum) {
                                                                resolve(res.response.sum);
                                                            }
                                                            else {
                                                                resolve(0);
                                                            }
                                                        }));
                                                    });
                                                    const limit = vm.cartData.total - vm.cartData.shipment_fee + vm.cartData.use_rebate;
                                                    if (sum === 0) {
                                                        dialog.errorMessage({ text: `您的 ${vm.rebateConfig.title} 為 0 點，無法折抵` });
                                                        return;
                                                    }
                                                    if (tempRebate > Math.min(sum, limit)) {
                                                        dialog.errorMessage({
                                                            text: `${Language.text('please_enter')} 0 到 ${Math.min(sum, limit)} 的數值`,
                                                        });
                                                        return;
                                                    }
                                                    ApiCart.setCart((cartItem) => {
                                                        cartItem.use_rebate = tempRebate;
                                                        refreshCartData();
                                                    });
                                                }))}"
                                                                                            >
                                                                                                ${Language.text('apply')}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>`;
                                            })()}
                                                                        <div class="${gClass(['price-row', 'text-2'])}">
                                                                            ${(() => {
                                                return gvc.bindView(() => {
                                                    return {
                                                        bind: gvc.glitter.getUUID(),
                                                        view: () => __awaiter(this, void 0, void 0, function* () {
                                                            const sum = yield new Promise((resolve, reject) => {
                                                                ApiShop.getRebate({}).then((res) => __awaiter(this, void 0, void 0, function* () {
                                                                    if (res.result && res.response.sum) {
                                                                        resolve(res.response.sum);
                                                                    }
                                                                    else {
                                                                        resolve(0);
                                                                    }
                                                                }));
                                                            });
                                                            if (!vm.cartData.useRebateInfo) {
                                                                return '';
                                                            }
                                                            const info = vm.cartData.useRebateInfo;
                                                            if (info.condition) {
                                                                return html `${Language.text('distance_from_target_amount')}$ ${info.condition.toLocaleString()}
                                                                                                ${Language.text('can_use_now')} ${vm.rebateConfig.title} ${Language.text('discount')}`;
                                                            }
                                                            if (info.limit) {
                                                                return html `${Language.text('remaining_balance')} ${sum || 0} ${Language.text('point')}
                                                                                                    ${vm.rebateConfig.title} <br />${Language.text('max_discount_order')} ${info.limit.toLocaleString()}
                                                                                                    ${Language.text('point')} ${vm.rebateConfig.title}`;
                                                            }
                                                            else {
                                                                return `${Language.text('remaining_balance')} ${sum || 0} ${Language.text('point')} ${vm.rebateConfig.title}`;
                                                            }
                                                        }),
                                                    };
                                                });
                                            })()}
                                                                        </div>`;
                                        }
                                    })()}
                                                        </div>
                                                    </section>
                                                `;
                                },
                            };
                        })())}
                                <section class="border-bottom"></section>
                                <section class="d-flex">
                                    <div class="flex-fill"></div>
                                    <div class="${gClass('price-container')}">
                                        <div class="${gClass(['price-row', 'text-1', 'bold'])}">
                                            <div>${Language.text('total_amount')}</div>
                                            <div>NT. ${vm.cartData.total.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </section>
                                <!--加購品-->
                                ${(() => {
                            let add_on = [];
                            vm.cartData.voucherList.filter((dd) => {
                                if (dd.reBackType === 'add_on_items') {
                                    add_on = add_on.concat(dd.add_on_products);
                                }
                            });
                            if (add_on.length) {
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => __awaiter(this, void 0, void 0, function* () {
                                            const add_products = yield ApiShop.getProduct({
                                                page: 0,
                                                limit: 100,
                                                productType: 'addProduct',
                                                id_list: add_on.join(','),
                                            });
                                            if (!add_products.response.data.length) {
                                                return ``;
                                            }
                                            return html `
                                                        <div class="${gClass('banner-bgr')}">
                                                            <span class="${gClass('banner-text')}">${Language.text('additional_purchase_items')}</span>
                                                        </div>
                                                        <div class="d-flex align-items-center w-100" style="overflow-x:auto;gap:10px;">
                                                            ${add_products.response.data
                                                .map((dd) => {
                                                return html ` <div class="d-flex py-3 align-items-center" style="gap:10px;">
                                                                        <div class="img-fluid img-106px" style="background-image: url('${dd.content.preview_image[0]}');"></div>
                                                                        <div class="d-flex flex-column" style="gap:5px;">
                                                                            <div class="${gClass('banner-text')} banner-font-15">${dd.content.title}</div>
                                                                            <div class="ntd-font-14">NT.${dd.content.min_price.toLocaleString()}</div>
                                                                            <button
                                                                                class="${gClass('button-bgr')} mb-0 mt-2"
                                                                                onclick="${gvc.event(() => {
                                                    return gvc.glitter.innerDialog((gvc) => {
                                                        var _a, _b;
                                                        return html ` <div
                                                                                            class="bg-white shadow rounded-3"
                                                                                            style="overflow-y: auto; ${document.body.clientWidth > 768
                                                            ? `min-width: 400px; width: 600px;`
                                                            : 'min-width: 90vw; max-width: 92.5vw;'}"
                                                                                        >
                                                                                            <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                                                                                                <div
                                                                                                    class="w-100 d-flex align-items-center p-3 border-bottom"
                                                                                                    style="position: sticky; top: 0; background: #fff;"
                                                                                                >
                                                                                                    <div class="flex-fill"></div>
                                                                                                    <i
                                                                                                        class="fa-regular fa-circle-xmark fs-5 text-dark"
                                                                                                        style="cursor: pointer"
                                                                                                        onclick="${gvc.event(() => {
                                                            gvc.closeDialog();
                                                        })}"
                                                                                                    ></i>
                                                                                                </div>
                                                                                                <div class="c_dialog">
                                                                                                    <div class="c_dialog_body">
                                                                                                        <div
                                                                                                            class="c_dialog_main"
                                                                                                            style="gap: 24px; height: auto; max-height: 500px; padding: 12px 20px;"
                                                                                                        >
                                                                                                            ${PdClass.selectSpec({
                                                            gvc,
                                                            titleFontColor: (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333',
                                                            prod: dd.content,
                                                            vm: {
                                                                specs: dd.content.specs.map((spec) => {
                                                                    return spec.option[0].title;
                                                                }),
                                                                quantity: '1',
                                                                wishStatus: ((_b = glitter.share.wishList) !== null && _b !== void 0 ? _b : []).some((item) => {
                                                                    return item.id === dd.id;
                                                                }),
                                                            },
                                                            callback: () => {
                                                                gvc.closeDialog();
                                                                refreshCartData();
                                                            },
                                                        })}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>`;
                                                    }, Tool.randomString(7));
                                                })}"
                                                                            >
                                                                                <span class="${gClass('button-text')}">${Language.text('add_to_cart')}</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>`;
                                            })
                                                .join('')}
                                                        </div>
                                                    `;
                                        }),
                                    };
                                });
                            }
                            else {
                                return '';
                            }
                        })()}
                                <!--贈品-->
                                ${(() => {
                            let already_add = vm.cartData.lineItems.filter((dd) => {
                                return dd.is_gift;
                            });
                            return vm.cartData.voucherList
                                .filter((d1) => {
                                return d1.reBackType === 'giveaway';
                            })
                                .map((dd) => {
                                let isSelected = already_add.find((d2) => {
                                    return dd.add_on_products.find((d1) => {
                                        return d1.id === d2.id;
                                    });
                                });
                                already_add = already_add.filter((dd) => {
                                    return !dd === isSelected;
                                });
                                return html `
                                                <div class="${gClass('banner-bgr')}">
                                                    <span class="${gClass('banner-text')}">${dd.title}</span>
                                                </div>
                                                <div class="d-flex align-items-center w-100" style="overflow-x:auto;gap:10px;">
                                                    ${dd.add_on_products
                                    .map((pd) => {
                                    try {
                                        return html ` <div class="d-flex py-3 align-items-center" style="gap:10px;">
                                                                    <div class="img-fluid img-106px" style="background-image: url('${pd.preview_image[0]}');"></div>
                                                                    <div class="d-flex flex-column" style="gap:5px;">
                                                                        <div class="${gClass('banner-text')} banner-font-15">${pd.title}</div>
                                                                        <div class="text-decoration-line-through text-danger ntd-font-14">NT.${pd.min_price.toLocaleString()}</div>
                                                                        <button
                                                                            class="${gClass('button-bgr')} mb-0 mt-2"
                                                                            style="${isSelected ? (isSelected.id === pd.id ? `background: gray !important;` : ``) : ``}"
                                                                            onclick="${gvc.event(() => {
                                            if (isSelected && isSelected.id === pd.id) {
                                                return;
                                            }
                                            return gvc.glitter.innerDialog((gvc) => {
                                                var _a, _b;
                                                return html ` <div
                                                                                        class="bg-white shadow rounded-3"
                                                                                        style="overflow-y: auto; ${document.body.clientWidth > 768
                                                    ? `min-width: 400px; width: 600px;`
                                                    : 'min-width: 90vw; max-width: 92.5vw;'}"
                                                                                    >
                                                                                        <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                                                                                            <div
                                                                                                class="w-100 d-flex align-items-center p-3 border-bottom"
                                                                                                style="position: sticky; top: 0; background: #fff;"
                                                                                            >
                                                                                                <div class="flex-fill"></div>
                                                                                                <i
                                                                                                    class="fa-regular fa-circle-xmark fs-5 text-dark"
                                                                                                    style="cursor: pointer"
                                                                                                    onclick="${gvc.event(() => {
                                                    gvc.closeDialog();
                                                })}"
                                                                                                ></i>
                                                                                            </div>
                                                                                            <div class="c_dialog">
                                                                                                <div class="c_dialog_body">
                                                                                                    <div class="c_dialog_main" style="gap: 24px; height: auto; max-height: 500px; padding: 12px 20px;">
                                                                                                        ${PdClass.selectSpec({
                                                    gvc,
                                                    titleFontColor: (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333',
                                                    prod: pd,
                                                    vm: {
                                                        specs: pd.specs.map((spec) => {
                                                            return spec.option[0].title;
                                                        }),
                                                        quantity: '1',
                                                        wishStatus: ((_b = glitter.share.wishList) !== null && _b !== void 0 ? _b : []).some((item) => {
                                                            return item.id === dd.id;
                                                        }),
                                                    },
                                                    with_qty: false,
                                                    callback: () => {
                                                        let find = vm.cartData.lineItems.find((d1) => {
                                                            return dd.add_on_products.find((d2) => {
                                                                return d2.id === d1.id;
                                                            });
                                                        });
                                                        if (find) {
                                                            ApiCart.setCart((cartItem) => {
                                                                cartItem.line_items.map((dd) => {
                                                                    if (dd.id === find.id) {
                                                                        dd.count--;
                                                                    }
                                                                });
                                                                cartItem.line_items = cartItem.line_items.filter((dd) => {
                                                                    return dd.count > 0;
                                                                });
                                                                refreshCartData();
                                                                gvc.closeDialog();
                                                            });
                                                        }
                                                        else {
                                                            refreshCartData();
                                                            gvc.closeDialog();
                                                        }
                                                    },
                                                })}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>`;
                                            }, Tool.randomString(7));
                                        })}"
                                                                        >
                                                                            <span class="${gClass('button-text')}"
                                                                                >${isSelected
                                            ? isSelected.id === pd.id
                                                ? Language.text('selected')
                                                : Language.text('change_gift')
                                            : Language.text('select_gift')}</span
                                                                            >
                                                                        </button>
                                                                    </div>
                                                                </div>`;
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                })
                                    .join('')}
                                                </div>
                                            `;
                            })
                                .join('');
                        })()}
                                <section>
                                    <div class="${gClass('banner-bgr')}">
                                        <span class="${gClass('banner-text')}">${Language.text('payment_and_shipping_methods')}</span>
                                    </div>
                                    ${vm.cartData.shipment_info ? html `<div class="pt-2 mx-2 mx-sm-3">${vm.cartData.shipment_info}</div>` : ''}
                                    <div class="row m-0 my-md-3">
                                        <div class="col-12 col-md-6 mb-2 mb-sm-0">
                                            <label class="${gClass('label')}">${Language.text('payment_method')}</label>
                                            <div>
                                                <select
                                                    class="w-100 ${gClass('select')}"
                                                    onchange="${gvc.event((e, event) => {
                            vm.cartData.customer_info.payment_select = e.value;
                            this.storeLocalData(vm.cartData);
                            refreshCartData();
                        })}"
                                                >
                                                    ${(() => {
                            return this.getPaymentMethod(vm.cartData)
                                .map((dd) => {
                                return html ` <option value="${dd.value}" ${localStorage.getItem('checkout-payment') === dd.value ? `selected` : ``}>
                                                                    ${dd.name}
                                                                </option>`;
                            })
                                .join('');
                        })()}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-6 mb-2">
                                            <label class="${gClass('label')}">${Language.text('shipping_method')}</label>
                                            ${gvc.bindView({
                            bind: ids.shipping,
                            view: () => {
                                return html ` <div>
                                                            <select
                                                                class="w-100 ${gClass('select')}"
                                                                onchange="${gvc.event((e) => {
                                    [
                                        'CVSStoreName',
                                        'MerchantTradeNo',
                                        'LogisticsSubType',
                                        'CVSStoreID',
                                        'CVSStoreName',
                                        'CVSTelephone',
                                        'CVSOutSide',
                                        'ExtraData',
                                        'CVSAddress',
                                    ].map((dd) => {
                                        gvc.glitter.setUrlParameter(dd);
                                    });
                                    vm.cartData.user_info.shipment = e.value;
                                    this.storeLocalData(vm.cartData);
                                    refreshCartData();
                                })}"
                                                            >
                                                                ${(() => {
                                    return this.getShipmentMethod(vm.cartData)
                                        .filter((dd) => {
                                        if (vm.cartData.total > 20000 && ['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(dd.value)) {
                                            return false;
                                        }
                                        if (vm.goodsWeight > 20 && ['normal', 'black_cat'].includes(dd.value)) {
                                            return false;
                                        }
                                        return true;
                                    })
                                        .map((dd) => {
                                        return html `<option value="${dd.value}" ${vm.cartData.user_info.shipment === dd.value ? `selected` : ``}>
                                                                                ${Language.text(`ship_${dd.value}`) || dd.name}
                                                                            </option>`;
                                    })
                                        .join('');
                                })()}
                                                            </select>
                                                        </div>
                                                        ${vm.cartData.total > 20000 ? html `<p class="${gClass('shipping-hint')}">若總金額超過20,000元，無法提供四大超商配送</p>` : ''}
                                                        ${vm.goodsWeight > 20 ? html `<p class="${gClass('shipping-hint')}">若訂單總重超過20公斤，無法提供中華郵政/黑貓宅配服務</p>` : ''}`;
                            },
                        })}
                                        </div>
                                        ${['normal', 'black_cat'].includes(vm.cartData.user_info.shipment)
                            ? html ` <div class="col-12 col-md-6 mb-2">
                                                  <label class="${gClass('label')}">${Language.text('shipping_address')}</label>
                                                  <input
                                                      class="${gClass('input')}"
                                                      type="address"
                                                      placeholder="${Language.text('please_enter_delivery_address')}"
                                                      value="${vm.cartData.user_info.address || ''}"
                                                      onchange="${gvc.event((e, event) => {
                                vm.cartData.user_info.address = e.value;
                                this.storeLocalData(vm.cartData);
                            })}"
                                                  />
                                              </div>`
                            : ``}
                                        <div class="col-12 ${['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(vm.cartData.user_info.shipment) ? `` : `d-none`}">
                                            <button
                                                class="${gClass('button-bgr')}"
                                                onclick="${gvc.event(() => {
                            ApiDelivery.storeMaps({
                                returnURL: location.href,
                                logistics: vm.cartData.user_info.shipment,
                            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                $('body').html(res.response.form);
                                document.querySelector('#submit').click();
                            }));
                        })}"
                                            >
                                                <span class="${gClass('button-text')}"
                                                    >${(() => {
                            let cvs = glitter.getUrlParameter('CVSStoreName') || '';
                            if (decodeURIComponent(cvs)) {
                                return `${decodeURIComponent(cvs)} 『 ${Language.text('click_to_reselct_store')} 』`;
                            }
                            else {
                                return Language.text('select_pickup_store');
                            }
                        })()}</span
                                                >
                                            </button>
                                        </div>
                                        ${(() => {
                            var _a;
                            try {
                                vm.cartData.user_info.custom_form_delivery = (_a = vm.cartData.user_info.custom_form_delivery) !== null && _a !== void 0 ? _a : {};
                                const form_array = JSON.parse(JSON.stringify(this.getShipmentMethod(vm.cartData).find((dd) => {
                                    return vm.cartData.user_info.shipment === dd.value;
                                }).form));
                                form_array.map((dd) => {
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
                                            this.storeLocalData(vm.cartData);
                                        },
                                        formData: vm.cartData.user_info.custom_form_delivery,
                                    }),
                                ].join('');
                            }
                            catch (e) {
                                console.error(e);
                                return ``;
                            }
                        })()}
                                    </div>
                                </section>
                                <section class="${['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(vm.cartData.user_info.shipment) ? `` : `mt-4`}">
                                    <div class="${gClass('banner-bgr')}">
                                        <span class="${gClass('banner-text')}">${Language.text('customer_info')}</span>
                                    </div>
                                    <div class="row m-0 mt-3 mb-2">
                                        ${[
                            {
                                name: Language.text('name'),
                                key: 'name',
                            },
                            {
                                name: Language.text('contact_number'),
                                key: 'phone',
                            },
                            {
                                name: Language.text('email'),
                                key: 'email',
                            },
                        ]
                            .map((dd) => {
                            return html ` <div class="col-12 col-md-4 mb-2">
                                                    <label class="${gClass('label')}">${dd.name}</label>
                                                    <input
                                                        class="${gClass('input')}"
                                                        type="${dd.key}"
                                                        value="${vm.cartData.customer_info[dd.key] || ''}"
                                                        onchange="${gvc.event((e, event) => {
                                vm.cartData.customer_info[dd.key] = e.value;
                                this.storeLocalData(vm.cartData);
                            })}"
                                                    />
                                                </div>`;
                        })
                            .join('')}
                                    </div>
                                    ${gvc.bindView(() => {
                            var _a;
                            const id = gvc.glitter.getUUID();
                            const vm_info = {
                                loading: true,
                                list: [],
                                login_config: {},
                            };
                            vm_info.list = (_a = widget.share.custom_form_checkout) !== null && _a !== void 0 ? _a : vm_info.list;
                            if (widget.share.custom_form_checkout) {
                                gvc.notifyDataChange(id);
                            }
                            else {
                                ApiUser.getPublicConfig('custom_form_checkout', 'manager').then((res) => {
                                    var _a;
                                    vm_info.list = ((_a = res.response.value) !== null && _a !== void 0 ? _a : { list: [] }).list;
                                    vm.cartData.custom_form_format = vm_info.list;
                                    widget.share.custom_form_checkout = vm_info.list;
                                    gvc.notifyDataChange(id);
                                });
                            }
                            return {
                                bind: id,
                                view: () => {
                                    const form_array = JSON.parse(JSON.stringify(vm_info.list));
                                    form_array.map((dd) => {
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
                                                this.storeLocalData(vm.cartData);
                                            },
                                            formData: vm.cartData.custom_form_data,
                                        }),
                                    ].join('');
                                },
                                divCreate: {
                                    class: `w-100 `,
                                },
                            };
                        })}
                                </section>
                                <section>
                                    <div class="${gClass('banner-bgr')}">
                                        <span class="${gClass('banner-text')}">${Language.text('recipient_info')}</span>
                                    </div>
                                    ${gvc.bindView(() => {
                            const id = 'invoice_place';
                            const vm_info = {
                                loading: true,
                                list: [],
                                login_config: {},
                            };
                            let method = widget.share.invoice_method || '';
                            if (widget.share.invoice_method) {
                                vm_info.loading = false;
                                gvc.notifyDataChange(id);
                            }
                            else {
                                ApiShop.getInvoiceType().then((res) => {
                                    method = res.response.method;
                                    vm_info.loading = false;
                                    widget.share.invoice_method = method;
                                    gvc.notifyDataChange(id);
                                });
                            }
                            const checkbox = this.getCheckedClass(gvc, '#393939');
                            return {
                                bind: id,
                                view: () => {
                                    try {
                                        if (vm_info.loading) {
                                            return ``;
                                        }
                                        vm_info.list = [
                                            {
                                                col: '3',
                                                key: 'name',
                                                page: 'input',
                                                type: 'form_plugin_v2',
                                                group: '',
                                                title: Language.text('name'),
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
                                                    input_style: { list: [], version: 'v2' },
                                                    title_style: { list: [], version: 'v2' },
                                                    place_holder: Language.text('please_enter_name'),
                                                },
                                                hidden_code: '',
                                            },
                                            {
                                                col: '3',
                                                key: 'phone',
                                                page: 'input',
                                                type: 'form_plugin_v2',
                                                group: '',
                                                title: Language.text('contact_number'),
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
                                                    type: 'phone',
                                                    title: '',
                                                    input_style: { list: [], version: 'v2' },
                                                    title_style: { list: [], version: 'v2' },
                                                    place_holder: Language.text('please_enter_contact_number'),
                                                },
                                                hidden_code: '',
                                            },
                                            {
                                                col: '6',
                                                key: 'email',
                                                page: 'input',
                                                type: 'form_plugin_v2',
                                                group: '',
                                                title: Language.text('email'),
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
                                                    type: 'email',
                                                    title: '',
                                                    input_style: { list: [], version: 'v2' },
                                                    title_style: { list: [], version: 'v2' },
                                                    place_holder: Language.text('please_enter_email'),
                                                },
                                                hidden_code: '',
                                            },
                                            ...(method === 'nouse'
                                                ? []
                                                : [
                                                    {
                                                        col: '6',
                                                        key: 'invoice_type',
                                                        page: 'form-select',
                                                        type: 'form_plugin_v2',
                                                        group: '',
                                                        title: Language.text('invoice_recipient'),
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
                                                            option: [
                                                                {
                                                                    name: Language.text('personal'),
                                                                    index: 0,
                                                                    value: 'me',
                                                                },
                                                                {
                                                                    name: Language.text('company'),
                                                                    index: 1,
                                                                    value: 'company',
                                                                },
                                                                {
                                                                    name: Language.text('donate_invoice'),
                                                                    index: 2,
                                                                    value: 'donate',
                                                                },
                                                            ],
                                                            input_style: { list: [], version: 'v2' },
                                                            title_style: { list: [], version: 'v2' },
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
                                                        title: Language.text('invoice_method'),
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
                                                            option: [
                                                                {
                                                                    name: Language.text('send_to_user_email'),
                                                                    index: 0,
                                                                    value: 'email',
                                                                },
                                                                {
                                                                    name: Language.text('mobile_barcode_device'),
                                                                    index: 1,
                                                                    value: 'carrier',
                                                                },
                                                            ],
                                                            input_style: { list: [], version: 'v2' },
                                                            title_style: { list: [], version: 'v2' },
                                                            place_holder: '',
                                                        },
                                                        hidden_code: "    if(form_data['invoice_type']!=='me' || (form_data['invoice_method']==='nouse') || (form_data['invoice_method']==='off_line')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                    },
                                                    {
                                                        key: 'carrier_num',
                                                        page: 'input',
                                                        type: 'form_plugin_v2',
                                                        group: '',
                                                        title: Language.text('carrier_number'),
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
                                                            input_style: { list: [], version: 'v2' },
                                                            title_style: { list: [], version: 'v2' },
                                                            place_holder: Language.text('please_enter_carrier_number'),
                                                        },
                                                        hidden_code: "    \n    if(form_data['invoice_type']!=='me' || form_data['send_type']!=='carrier'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                    },
                                                    {
                                                        key: 'company',
                                                        page: 'input',
                                                        type: 'form_plugin_v2',
                                                        group: '',
                                                        title: Language.text('company_name'),
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
                                                            input_style: { list: [], version: 'v2' },
                                                            title_style: { list: [], version: 'v2' },
                                                            place_holder: Language.text('please_enter_company_name'),
                                                        },
                                                        hidden_code: "    if(form_data['invoice_type']!=='company' || (form_data['invoice_method']==='nouse')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                    },
                                                    {
                                                        key: 'gui_number',
                                                        page: 'input',
                                                        type: 'form_plugin_v2',
                                                        group: '',
                                                        title: Language.text('company_tax_id'),
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
                                                            input_style: { list: [], version: 'v2' },
                                                            title_style: { list: [], version: 'v2' },
                                                            place_holder: Language.text('please_enter_company_tax_id'),
                                                        },
                                                        hidden_code: "    if(form_data['invoice_type']!=='company'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                    },
                                                    {
                                                        col: '6',
                                                        key: 'love_code',
                                                        page: 'input',
                                                        type: 'form_plugin_v2',
                                                        group: '',
                                                        title: Language.text('donation_code'),
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
                                                            input_style: { list: [], version: 'v2' },
                                                            title_style: { list: [], version: 'v2' },
                                                            place_holder: Language.text('please_enter_donation_code'),
                                                        },
                                                        hidden_code: "    if(form_data['invoice_type']!=='donate' || (form_data['invoice_method']==='nouse')){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                    },
                                                ]),
                                            {
                                                col: '12',
                                                key: 'note',
                                                page: 'multiple_line_text',
                                                type: 'form_plugin_v2',
                                                group: '',
                                                title: Language.text('delivery_notes'),
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
                                                    type: 'text',
                                                    title: '',
                                                    title_style: { list: [], version: 'v2' },
                                                    place_holder: Language.text('enter_delivery_notes'),
                                                },
                                                hidden_code: 'return false',
                                            },
                                        ].filter((dd) => {
                                            return (dd.key !== 'name' && dd.key !== 'phone' && dd.key !== 'email') || !vm.cartData.user_info_same;
                                        });
                                        console.log(`vm_info.list=>`, vm_info.list);
                                        vm.cartData.user_info.invoice_method = method;
                                        vm.cartData.user_info.invoice_type = vm.cartData.user_info.invoice_type || 'me';
                                        vm.cartData.user_info.send_type = vm.cartData.user_info.send_type || 'email';
                                        const form_array = JSON.parse(JSON.stringify(vm_info.list));
                                        form_array.map((dd) => {
                                            if (dd.key === 'send_type' && vm.cartData.user_info.send_type === 'carrier') {
                                                dd.col = 3;
                                            }
                                            dd.form_config.title_style = {
                                                list: [
                                                    {
                                                        class: ['company', 'gui_number', 'carrier_num'].includes(dd.key) ? gClass('label') + ' mt-2' : gClass('label') + ' mb-2',
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
                                            return dd;
                                        });
                                        return [
                                            html ` <div
                                                            class="d-flex ms-2 my-3"
                                                            style="gap:10px;cursor:pointer;"
                                                            onclick="${gvc.event(() => {
                                                vm.cartData.user_info_same = !vm.cartData.user_info_same;
                                                if (vm.cartData.user_info_same) {
                                                    vm.cartData.user_info.name = vm.cartData.customer_info.name;
                                                    vm.cartData.user_info.phone = vm.cartData.customer_info.phone;
                                                    vm.cartData.user_info.email = vm.cartData.customer_info.email;
                                                }
                                                gvc.notifyDataChange(id);
                                            })}"
                                                        >
                                                            <input class="form-check-input form-checkbox  ${checkbox}" type="checkbox" ${vm.cartData.user_info_same ? `checked` : ''} />
                                                            ${Language.text('same_as_buyer_info')}
                                                        </div>`,
                                            FormWidget.editorView({
                                                gvc: gvc,
                                                array: form_array,
                                                refresh: () => {
                                                    this.storeLocalData(vm.cartData);
                                                    gvc.notifyDataChange(id);
                                                },
                                                formData: vm.cartData.user_info,
                                            }),
                                        ].join('<div class="my-2"></div>');
                                    }
                                    catch (e) {
                                        console.log(`error==>`, e);
                                        return ``;
                                    }
                                },
                                divCreate: {
                                    class: `w-100 mt-2`,
                                },
                            };
                        })}
                                    <div class="w-100 d-flex align-items-center justify-content-end px-2 mt-3">
                                        <button
                                            class="${gClass('button-bgr')}"
                                            onclick="${gvc.event(() => {
                            if (!this.checkFormData(gvc, vm.cartData, widget)) {
                                return;
                            }
                            if (vm.cartData.user_info_same) {
                                vm.cartData.user_info.name = vm.cartData.customer_info.name;
                                vm.cartData.user_info.phone = vm.cartData.customer_info.phone;
                                vm.cartData.user_info.email = vm.cartData.customer_info.email;
                            }
                            ['MerchantTradeNo', 'LogisticsSubType', 'CVSStoreID', 'CVSStoreName', 'CVSTelephone', 'CVSOutSide', 'ExtraData', 'CVSAddress'].map((dd) => {
                                if (gvc.glitter.getUrlParameter(dd)) {
                                    vm.cartData.user_info[dd] = decodeURI(glitter.getUrlParameter(dd));
                                }
                            });
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            ApiShop.toCheckout({
                                line_items: vm.cartData.lineItems.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count,
                                    };
                                }),
                                customer_info: vm.cartData.customer_info,
                                return_url: (() => {
                                    const originalUrl = glitter.root_path + 'order_detail' + location.search;
                                    const urlObject = new URL(originalUrl);
                                    urlObject.searchParams.set('EndCheckout', '1');
                                    const newUrl = urlObject.toString();
                                    return newUrl;
                                })(),
                                user_info: vm.cartData.user_info,
                                code: ApiCart.cart.code,
                                use_rebate: ApiCart.cart.use_rebate,
                                custom_form_format: vm.cartData.custom_form_format,
                                custom_form_data: vm.cartData.custom_form_data,
                                distribution_code: ApiCart.cart.distribution_code,
                                give_away: ApiCart.cart.give_away,
                            }).then((res) => {
                                dialog.dataLoading({ visible: false });
                                if (res.response.off_line || res.response.is_free) {
                                    ApiCart.clearCart();
                                    location.href = res.response.return_url;
                                }
                                else {
                                    ApiCart.clearCart();
                                    if (res.response.returnCode == '0000' && vm.cartData.customer_info.payment_select == 'line_pay') {
                                        console.log('res.response.form.info.paymentUrl.web -- ', res.response.info.paymentUrl.web);
                                        location.href = res.response.info.paymentUrl.web;
                                    }
                                    else if (res.response.approveLink) {
                                        location.href = res.response.approveLink;
                                    }
                                    else {
                                        const id = gvc.glitter.getUUID();
                                        $('body').append(html ` <div id="${id}" style="display: none;">${res.response.form}</div>`);
                                        document.querySelector(`#${id} #submit`).click();
                                    }
                                }
                            });
                        })}"
                                            style="width:200px;"
                                        >
                                            <span class="${gClass('button-text')}">${Language.text('next')}</span>
                                        </button>
                                    </div>
                                </section>
                            </div>`;
                    }
                    catch (e) {
                        console.log(e);
                        return ``;
                    }
                },
                divCreate: {
                    class: `check_out_cart_data`,
                },
                onCreate: () => {
                    Ad.gtagEvent('view_cart', {
                        currency: 'TWD',
                        value: vm.cartData.total,
                        items: vm.cartData.lineItems.map((item) => {
                            return {
                                item_id: item.id,
                                item_name: item.title,
                                item_variant: item.spec.join('-'),
                                price: item.sale_price,
                                quantity: item.count,
                                discount: item.discount_price,
                            };
                        }),
                    });
                    Ad.fbqEvent('AddPaymentInfo', {
                        value: vm.cartData.total,
                        currency: 'TWD',
                        contents: vm.cartData.lineItems.map((item) => {
                            return {
                                id: item.id,
                                quantity: item.count,
                            };
                        }),
                        content_ids: vm.cartData.lineItems.map((item) => item.id),
                    });
                },
            };
        })());
    }
    static checkFormData(gvc, cartData, widget) {
        var _a;
        const userData = cartData.customer_info;
        const subData = cartData.user_info;
        const dialog = new ShareDialog(gvc.glitter);
        function checkEmailPattern(input) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(input);
        }
        function checkPhonePattern(input) {
            const phonePattern = /^09\d{8}$/;
            return phonePattern.test(input);
        }
        function checkReceiverPattern(input) {
            const receiverPattern = /^[\u4e00-\u9fa5]{2,5}|[a-zA-Z]{4,10}$/;
            return receiverPattern.test(input);
        }
        function checkAddressPattern(input) {
            const addressPattern = /^.{6,60}$/;
            return addressPattern.test(input);
        }
        let pass = true;
        function checkString(text, errorMessage, type = '') {
            if ((pass && !text) || text === '') {
                pass = false;
                dialog.errorMessage({
                    text: `${Language.text('please_enter')}「${errorMessage}」`,
                });
            }
            if (pass && type === 'email' && !checkEmailPattern(text)) {
                pass = false;
                dialog.errorMessage({
                    text: `「${errorMessage}」${Language.text('format_error')}`,
                });
            }
            if (pass && type === 'phone' && !checkPhonePattern(text)) {
                pass = false;
                dialog.errorMessage({
                    text: html ` <div class="text-center">
                        「${errorMessage} 」${Language.text('format_error')}<br />${Language.text('please_enter')} ${Language.text('phone_format_starting_with_09')}
                    </div>`,
                });
            }
            if (pass && type === 'name' && !checkReceiverPattern(text)) {
                pass = false;
                dialog.errorMessage({
                    text: Language.text('name_length_restrictions'),
                });
            }
        }
        if (['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(subData['shipment'])) {
            ['MerchantID', 'MerchantTradeNo', 'LogisticsSubType', 'CVSStoreID', 'CVSAddress', 'CVSTelephone', 'CVSOutSide', 'CVSStoreName'].map((dd) => {
                if (window.glitter.getUrlParameter(dd)) {
                    subData[dd] = decodeURIComponent(window.glitter.getUrlParameter(dd));
                }
                else {
                    subData[dd] = undefined;
                }
            });
        }
        if (subData['shipment'] === 'normal' && (!subData['address'] || subData['address'] === '')) {
            dialog.errorMessage({
                text: `${Language.text('please_enter')}「${Language.text('shipping_address')}」`,
            });
            return false;
        }
        if (subData['shipment'] === 'normal' && !checkAddressPattern(subData['address'])) {
            dialog.errorMessage({
                text: Language.text('address_length_requirements'),
            });
            return false;
        }
        if (['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(subData['shipment']) && !subData['CVSStoreName']) {
            dialog.errorMessage({
                text: Language.text('select_delivery_store'),
            });
            return false;
        }
        const form = this.getShipmentMethod(cartData).find((dd) => dd.value === subData['shipment']).form;
        if (FormWidget.checkLeakData(form, subData.custom_form_delivery)) {
            dialog.errorMessage({
                text: `${Language.text('please_enter')}「${FormWidget.checkLeakData(form, subData)}」`,
            });
            return false;
        }
        const leakData = FormWidget.checkLeakData(cartData.custom_form_format, cartData.custom_form_data);
        if (leakData) {
            dialog.errorMessage({
                text: `${Language.text('please_enter')}「${leakData}」`,
            });
            return false;
        }
        if ((() => {
            let gift_need = cartData.voucherList.filter((dd) => {
                return dd.reBackType === 'giveaway';
            }).length;
            let gift = 0;
            cartData.lineItems
                .filter((dd) => {
                return dd.is_gift;
            })
                .map((dd) => {
                gift += dd.count;
            });
            return false && gift < gift_need;
        })()) {
            dialog.errorMessage({
                text: Language.text('please_select_gift'),
            });
            return false;
        }
        checkString(userData.name, Language.text('customer_name'), 'name');
        checkString(userData.phone, Language.text('customer_phone'), 'phone');
        checkString(userData.email, Language.text('customer_email'), 'email');
        checkString(subData.name, Language.text('recipient_name'), 'name');
        checkString(subData.phone, Language.text('recipient_phone'), 'phone');
        checkString(subData.email, Language.text('recipient_email'), 'email');
        if (!pass) {
            return false;
        }
        Ad.gtagEvent('begin_checkout', {
            currency: 'TWD',
            value: cartData.total,
            coupon: (_a = cartData.code) !== null && _a !== void 0 ? _a : '',
            items: cartData.lineItems.map((item) => {
                return {
                    item_id: item.id,
                    item_name: item.title,
                    item_variant: item.spec.join('-'),
                    price: item.sale_price,
                    quantity: item.count,
                    discount: item.discount_price,
                };
            }),
        });
        Ad.fbqEvent('Purchase', {
            value: cartData.total,
            currency: 'TWD',
            contents: cartData.lineItems.map((item) => {
                return {
                    id: item.id,
                    quantity: item.count,
                };
            }),
            content_type: 'product',
        });
        return true;
    }
    static viewDialog(obj) {
        return obj.gvc.glitter.innerDialog((gvc) => {
            var _a;
            return html ` <div class="bg-white shadow rounded-3" style="overflow-y: auto;${document.body.clientWidth > 768 ? `min-width: 600px; width: 700px;` : 'min-width: 90vw; max-width: 92.5vw;'}">
                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                    <div class="w-100 d-flex align-items-center p-3 border-bottom" style="position: sticky; top: 0; background: #fff;">
                        <div style="font-size: 16px; font-weight: 700; color: #292218;">${(_a = obj.title) !== null && _a !== void 0 ? _a : ''}</div>
                        <div class="flex-fill"></div>
                        <i
                            class="fa-regular fa-circle-xmark fs-5 text-dark"
                            style="cursor: pointer"
                            onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}"
                        ></i>
                    </div>
                    <div class="c_dialog">
                        <div class="c_dialog_body">
                            <div class="c_dialog_main" style="gap: 24px; height: auto; max-height: 500px; padding: 12px 20px;">${obj.innerHTML(gvc)}</div>
                        </div>
                    </div>
                </div>
            </div>`;
        }, obj.tag);
    }
    static getPaymentMethod(cartData) {
        var _a;
        let array = [];
        cartData.payment_setting.map((dd) => {
            switch (dd.key) {
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
                case 'paypal':
                    array.push({
                        name: 'PayPal',
                        value: 'paypal',
                    });
                    break;
                case 'line_pay':
                    array.push({
                        name: 'Line Pay',
                        value: 'line_pay',
                    });
                    break;
            }
        });
        cartData.off_line_support = (_a = cartData.off_line_support) !== null && _a !== void 0 ? _a : {};
        cartData.off_line_support.atm &&
            array.push({
                name: '銀行轉帳',
                value: 'atm',
            });
        cartData.off_line_support.line &&
            array.push({
                name: 'Line轉帳',
                value: 'line',
            });
        cartData.off_line_support.cash_on_delivery &&
            array.push({
                name: '貨到付款',
                value: 'cash_on_delivery',
            });
        if (!array.find((dd) => {
            return dd.value === localStorage.getItem('checkout-payment');
        })) {
            localStorage.setItem('checkout-payment', array[0].value);
        }
        cartData.customer_info.payment_select = localStorage.getItem('checkout-payment');
        return array;
    }
    static getShipmentMethod(cartData) {
        if (!cartData.shipment_selector.find((dd) => {
            return dd.value === localStorage.getItem('shipment-select');
        })) {
            localStorage.setItem('shipment-select', cartData.shipment_selector[0].value);
        }
        cartData.user_info.shipment = localStorage.getItem('shipment-select');
        return cartData.shipment_selector;
    }
    static storeLocalData(cartData) {
        localStorage.setItem('cart_customer_info', JSON.stringify(cartData.customer_info));
        localStorage.setItem('shipment-select', cartData.user_info.shipment);
        localStorage.setItem('checkout-payment', cartData.customer_info.payment_select);
        localStorage.setItem('custom_form_data', JSON.stringify(cartData.custom_form_data));
        localStorage.setItem('custom_user_info', JSON.stringify(cartData.user_info));
        localStorage.setItem('give_away', JSON.stringify(cartData.give_away));
    }
    static initial(cartData) {
        cartData.customer_info = JSON.parse(localStorage.getItem('cart_customer_info') || '{}');
        cartData.custom_form_data = JSON.parse(localStorage.getItem('custom_form_data') || '{}');
        cartData.user_info = JSON.parse(localStorage.getItem('custom_user_info') || '{}');
        cartData.give_away = JSON.parse(localStorage.getItem('give_away') || '[]');
        this.getPaymentMethod(cartData);
        this.getShipmentMethod(cartData);
    }
    static getCheckedClass(gvc, color) {
        const className = Tool.randomString(6);
        gvc.addStyle(`
            .${className} {
                min-width: 1rem;
                min-height: 1rem;
            }
            .${className}:checked[type='checkbox'] {
                border: 2px solid ${color !== null && color !== void 0 ? color : '#000'};
                background-color: #fff;
                background-image: url(${this.checkedDataImage(color !== null && color !== void 0 ? color : '#000')}) !important;
                background-position: center center;
            }
        `);
        return className;
    }
    static checkedDataImage(color) {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='${color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"`;
    }
}
window.glitter.setModule(import.meta.url, CheckoutIndex);
