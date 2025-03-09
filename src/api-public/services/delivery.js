"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = exports.EcPay = void 0;
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const private_config_js_1 = require("../../services/private_config.js");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const shopping_js_1 = require("./shopping.js");
const paynow_logistics_js_1 = require("./paynow-logistics.js");
const html = String.raw;
class EcPay {
    constructor(appName) {
        this.appName = appName;
    }
    static generateCheckMacValue(params, HashKey, HashIV) {
        const sortedKeys = Object.keys(params).sort();
        const sortedParams = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
        const stringToEncode = `HashKey=${HashKey}&${sortedParams}&HashIV=${HashIV}`;
        const urlEncodedString = encodeURIComponent(stringToEncode)
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+')
            .toLowerCase();
        const md5Hash = crypto_1.default.createHash('md5').update(urlEncodedString).digest('hex');
        return md5Hash.toUpperCase();
    }
    static generateForm(json) {
        const formId = `form_ecpay_${tool_js_1.default.randomString(10)}`;
        const inputHTML = Object.entries(json.params)
            .map(([key, value]) => html `<input type="hidden" name="${key}" id="${key}" value="${value}"/>`)
            .join('\n');
        return html `
            <form id="${formId}" action="${json.actionURL}" method="post" enctype="application/x-www-form-urlencoded"
                  accept="text/html">
                ${inputHTML} ${json.checkMacValue ? html `<input type="hidden" name="CheckMacValue" id="CheckMacValue"
                                                                value="${json.checkMacValue}"/>` : ''}
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit"
                        hidden></button>
            </form>
        `;
    }
    static async axiosRequest(json) {
        try {
            return new Promise((resolve) => {
                axios_1.default
                    .request({
                    method: 'post',
                    url: json.actionURL,
                    data: Object.assign(Object.assign({}, json.params), { checkMacValue: json.checkMacValue }),
                    headers: {
                        Accept: 'text/html',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                    .then((response) => {
                    resolve(response.data);
                });
            })
                .then((response) => {
                return {
                    result: true,
                    data: response,
                };
            })
                .catch((error) => {
                return {
                    result: false,
                    data: error.message,
                };
            });
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'EcPay axiosRequest error', null);
        }
    }
    async notifyOrder(json) {
        try {
            const checkouts = await database_js_1.default.query(`SELECT *
                 FROM \`${this.appName}\`.t_checkout
                 WHERE JSON_EXTRACT(orderData, '$.deliveryData.AllPayLogisticsID') = ?
                   AND JSON_EXTRACT(orderData, '$.deliveryData.MerchantTradeNo') = ?;`, [json.AllPayLogisticsID, json.MerchantTradeNo]);
            if (checkouts[0]) {
                const checkout = checkouts[0];
                if (checkout.orderData.deliveryNotifyList && checkout.orderData.deliveryNotifyList.length > 0) {
                    checkout.orderData.deliveryNotifyList.push(json);
                }
                else {
                    checkout.orderData.deliveryNotifyList = [json];
                }
                await new shopping_js_1.Shopping(this.appName).putOrder({
                    id: checkout.id,
                    orderData: checkout.orderData,
                    status: undefined
                });
            }
            return '1|OK';
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'EcPay notifyOrder error:' + error, null);
        }
    }
}
exports.EcPay = EcPay;
class Delivery {
    constructor(appName) {
        this.appName = appName;
    }
    async getC2CMap(returnURL, logistics) {
        const id = 'redirect_' + tool_js_1.default.randomString(10);
        await redis_js_1.default.setValue(id, returnURL);
        console.log(`process.env.EC_SHIPMENT_ID=>`, process.env.EC_SHIPMENT_ID);
        if (logistics === 'UNIMARTFREEZE') {
            logistics = 'UNIMARTC2C';
        }
        console.log(`logistics=>`, logistics);
        const params = {
            MerchantID: process.env.EC_SHIPMENT_ID,
            MerchantTradeNo: new Date().getTime(),
            LogisticsType: 'CVS',
            LogisticsSubType: logistics,
            IsCollection: 'N',
            ServerReplyURL: `${process.env.DOMAIN}/api-public/v1/delivery/c2cRedirect?g-app=${this.appName}&return=${encodeURIComponent(id)}`,
        };
        return EcPay.generateForm({
            actionURL: 'https://logistics.ecpay.com.tw/Express/map',
            params,
        });
    }
    async postStoreOrder(json) {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.appName,
            key: 'glitter_delivery',
        }))[0].value.ec_pay;
        const actionURL = keyData.Action === 'main' ? 'https://logistics.ecpay.com.tw/Express/Create' : 'https://logistics-stage.ecpay.com.tw/Express/Create';
        const originParams = Object.assign({ MerchantID: keyData.MERCHANT_ID, MerchantTradeDate: (0, moment_timezone_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'), ServerReplyURL: `${process.env.DOMAIN}/api-public/v1/delivery/c2cNotify?g-app=${this.appName}`, SenderName: keyData.SenderName, SenderCellPhone: keyData.SenderCellPhone }, json);
        const params = Delivery.removeUndefined(originParams);
        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
        const response = await EcPay.axiosRequest({
            actionURL,
            params,
            checkMacValue,
        });
        if (!response.result) {
            return {
                result: false,
                message: response.data,
            };
        }
        if (response.data.substring(0, 1) === '0' || response.data.substring(0, 3) === '105') {
            return {
                result: false,
                message: response.data,
            };
        }
        const cleanedString = response.data.slice(2);
        const getJSON = Object.fromEntries(cleanedString.split('&').map((pair) => {
            const [key, value] = pair.split('=');
            return [key, decodeURIComponent(value)];
        }));
        return {
            result: true,
            data: getJSON,
        };
    }
    async generatorDeliveryId(id, carData, keyData) {
        const deliveryData = carData.deliveryData[keyData.Action];
        const originParams = {
            MerchantID: keyData.MERCHANT_ID,
            AllPayLogisticsID: deliveryData.AllPayLogisticsID,
            CVSPaymentNo: deliveryData.CVSPaymentNo,
            CVSValidationNo: deliveryData.CVSValidationNo,
        };
        const params = Delivery.removeUndefined(originParams);
        const storePath = {
            FAMIC2C: 'Express/PrintFAMIC2COrderInfo',
            UNIMARTC2C: 'Express/PrintUniMartC2COrderInfo',
            HILIFEC2C: 'Express/PrintHILIFEC2COrderInfo',
            OKMARTC2C: 'Express/PrintOKMARTC2COrderInfo',
            TCAT: 'helper/printTradeDocument',
            POST: 'helper/printTradeDocument',
        };
        const actionURL = keyData.Action === 'main'
            ? `https://logistics.ecpay.com.tw/${storePath[deliveryData.LogisticsSubType]}`
            : `https://logistics-stage.ecpay.com.tw/${storePath[deliveryData.LogisticsSubType]}`;
        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);
        const random_id = tool_js_1.default.randomString(6);
        await new shopping_js_1.Shopping(this.appName).putOrder({
            id: id,
            orderData: carData,
            status: undefined
        });
        await redis_js_1.default.setValue('delivery_' + random_id, JSON.stringify({
            actionURL,
            params,
            checkMacValue,
        }));
        return random_id;
    }
    async getOrderInfo(obj) {
        var _a;
        try {
            const deliveryConfig = (await private_config_js_1.Private_config.getConfig({
                appName: this.appName,
                key: 'glitter_delivery',
            }))[0];
            console.log(`deliveryConfig=>`, deliveryConfig);
            if (!(deliveryConfig && (`${deliveryConfig.value.ec_pay.toggle}` === 'true' || `${deliveryConfig.value.pay_now.toggle}` === 'true'))) {
                console.error('deliveryConfig 不存在 / 未開啟');
                return {
                    result: false,
                    message: '尚未開啟物流追蹤設定',
                };
            }
            const keyData = deliveryConfig.value.ec_pay;
            const shoppingClass = new shopping_js_1.Shopping(this.appName);
            const cart = (await Promise.all(obj.cart_token.split(',').map((dd) => {
                console.log(`cart_token=>${dd}`);
                return new Promise(async (resolve, reject) => {
                    const data = await shoppingClass.getCheckOut({
                        page: 0,
                        limit: 1,
                        search: dd,
                        searchType: 'cart_token',
                    });
                    resolve(data.data);
                });
            }))).filter((dd) => {
                return dd[0];
            });
            if (!(cart.length)) {
                console.error('orderData 不存在');
                return {
                    result: false,
                    message: '此訂單不存在',
                };
            }
            if (`${deliveryConfig.value.pay_now.toggle}` === 'true') {
                const pay_now = new paynow_logistics_js_1.PayNowLogistics(this.appName);
                let error_text = '';
                await Promise.all(cart.map((dd) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (obj.shipment_date) {
                                dd[0].orderData.user_info.shipment_date = obj.shipment_date;
                            }
                            const data = await pay_now.printLogisticsOrder(dd[0].orderData);
                            if (data.ErrorMsg && data.ErrorMsg !== '訂單已成立') {
                                error_text = data.ErrorMsg;
                            }
                            resolve(true);
                        }
                        catch (e) {
                            resolve(true);
                        }
                    });
                }));
                await Promise.all(cart.map(async (dd) => {
                    const carData = dd[0].orderData;
                    const config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${(await pay_now.config()).link}/${(() => {
                            switch (carData.user_info.shipment) {
                                case 'UNIMARTC2C':
                                    return 'api/Order711';
                                case 'FAMIC2C':
                                    return 'api/OrderFamiC2C';
                                case 'HILIFEC2C':
                                    return 'api/OrderHiLife';
                                case 'OKMARTC2C':
                                    return 'api/OKC2C';
                                case 'UNIMARTFREEZE':
                                    return 'Member/OrderEvent/Print711FreezingC2CLabel';
                            }
                            return ``;
                        })()}?orderNumberStr=${dd[0].cart_token}&user_account=${(await pay_now.config()).account}`,
                        headers: { 'Content-Type': 'application/json' }
                    };
                    const link_response = await (0, axios_1.default)(config);
                    try {
                        const link = link_response.data;
                        const her_ = new URL(link.replace('S,', ''));
                        if (her_.searchParams.get('LogisticNumbers')) {
                            carData.user_info.shipment_number = her_.searchParams.get('LogisticNumbers');
                            carData.user_info.shipment_refer = 'paynow';
                            if (obj.shipment_date) {
                                carData.user_info.shipment_date = obj.shipment_date;
                            }
                            await new shopping_js_1.Shopping(this.appName).putOrder({
                                cart_token: dd[0].cart_token,
                                orderData: carData,
                                status: undefined
                            });
                        }
                    }
                    catch (e) {
                    }
                }));
                const carData = cart[0][0].orderData;
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${(await pay_now.config()).link}/${(() => {
                        switch (carData.user_info.shipment) {
                            case 'UNIMARTC2C':
                                return 'api/Order711';
                            case 'FAMIC2C':
                                return 'api/OrderFamiC2C';
                            case 'HILIFEC2C':
                                return 'api/OrderHiLife';
                            case 'OKMARTC2C':
                                return 'api/OKC2C';
                            case 'UNIMARTFREEZE':
                                return 'Member/OrderEvent/Print711FreezingC2CLabel';
                        }
                        return ``;
                    })()}?orderNumberStr=${obj.cart_token}&user_account=${(await pay_now.config()).account}`,
                    headers: { 'Content-Type': 'application/json' }
                };
                const link_response = await (0, axios_1.default)(config);
                const link = link_response.data;
                if (error_text) {
                    return {
                        result: false,
                        message: error_text,
                    };
                }
                return {
                    result: true,
                    link: link.replace('S,', ''),
                };
            }
            else if (`${deliveryConfig.value.ec_pay.toggle}` === 'true') {
                const id = cart[0][0].id;
                const carData = cart[0][0].orderData;
                carData.deliveryData = (_a = carData.deliveryData) !== null && _a !== void 0 ? _a : {};
                let random_id = '';
                if (carData.deliveryData[keyData.Action] === undefined) {
                    console.log(`綠界物流單 開始建立（使用${keyData.Action === 'main' ? '正式' : '測試'}環境）`);
                    console.log(`carData.user_info.LogisticsSubType==>`, carData.user_info.shipment);
                    if (['FAMIC2C', 'UNIMARTC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTFREEZE'].includes(carData.user_info.shipment)) {
                        const delivery_cf = {
                            LogisticsType: 'CVS',
                            LogisticsSubType: carData.user_info.shipment,
                            GoodsAmount: carData.total,
                            CollectionAmount: carData.user_info.shipment === 'UNIMARTC2C' ? carData.total : undefined,
                            IsCollection: carData.customer_info.payment_select === 'cash_on_delivery' ? 'Y' : 'N',
                            GoodsName: `訂單編號 ${carData.orderID}`,
                            ReceiverName: carData.user_info.name,
                            ReceiverCellPhone: carData.user_info.phone,
                            ReceiverStoreID: keyData.Action === 'main'
                                ? carData.user_info.CVSStoreID
                                : (() => {
                                    if (carData.user_info.shipment === 'OKMARTC2C') {
                                        return '1328';
                                    }
                                    if (carData.user_info.shipment === 'FAMIC2C') {
                                        return '006598';
                                    }
                                    if (carData.user_info.shipment === 'UNIMARTFREEZE') {
                                        return `896539`;
                                    }
                                    return '131386';
                                })(),
                        };
                        const delivery = await this.postStoreOrder(delivery_cf);
                        if (delivery.result) {
                            carData.deliveryData[keyData.Action] = delivery.data;
                        }
                        else {
                            return {
                                result: false,
                                message: `建立錯誤: ${delivery.message}`,
                            };
                        }
                    }
                    if (['normal', 'black_cat', 'black_cat_ice', 'black_cat_freezing'].includes(carData.user_info.shipment)) {
                        const receiverPostData = await shoppingClass.getPostAddressData(carData.user_info.address);
                        const senderPostData = await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(shoppingClass.getPostAddressData(keyData.SenderAddress));
                            }, 2000);
                        });
                        let goodsWeight = 0;
                        carData.lineItems.map((item) => {
                            if (item.shipment_obj.type === 'weight') {
                                goodsWeight += item.shipment_obj.value;
                            }
                        });
                        const delivery_cf = {
                            LogisticsType: 'HOME',
                            LogisticsSubType: carData.user_info.shipment === 'normal' ? 'POST' : 'TCAT',
                            GoodsAmount: carData.total,
                            GoodsName: `訂單編號 ${carData.orderID}`,
                            GoodsWeight: carData.user_info.shipment === 'normal' ? goodsWeight : undefined,
                            ReceiverName: carData.user_info.name,
                            ReceiverCellPhone: carData.user_info.phone,
                            ReceiverZipCode: receiverPostData.zipcode6 || receiverPostData.zipcode,
                            ReceiverAddress: carData.user_info.address,
                            SenderZipCode: senderPostData.zipcode6 || senderPostData.zipcode,
                            SenderAddress: keyData.SenderAddress,
                            Temperature: (() => {
                                switch (carData.user_info.shipment) {
                                    case 'black_cat_ice':
                                        return '0002';
                                    case 'black_cat_freezing':
                                        return '0003';
                                    default:
                                        return '0001';
                                }
                            })()
                        };
                        const delivery = await this.postStoreOrder(delivery_cf);
                        if (delivery.result) {
                            carData.deliveryData[keyData.Action] = delivery.data;
                            console.info('綠界物流單 郵政/黑貓 建立成功');
                        }
                        else {
                            console.error(`綠界物流單 郵政/黑貓 建立錯誤: ${delivery.message}`);
                            return {
                                result: false,
                                message: `建立錯誤: ${delivery.message}`,
                            };
                        }
                    }
                }
                random_id = await this.generatorDeliveryId(id, carData, keyData);
                if (!random_id) {
                    return {
                        result: false,
                        message: '尚未啟用物流追蹤功能',
                    };
                }
            }
            return {
                result: false,
                message: '尚未啟用物流追蹤功能',
            };
        }
        catch (e) {
            console.error(`error-`, e);
            return {
                result: false,
                message: '尚未開啟物流追蹤設定',
            };
        }
    }
    static removeUndefined(originParams) {
        const params = Object.fromEntries(Object.entries(originParams).filter(([_, value]) => value !== undefined));
        return params;
    }
    async notify(json) {
        try {
            const getNotification = await database_js_1.default.query(`SELECT *
                 FROM \`${this.appName}\`.public_config
                 WHERE \`key\` = "ecpay_delivery_notify";
                `, []);
            json.token && delete json.token;
            const notification = getNotification[0];
            if (notification) {
                notification.value.push(json);
                await database_js_1.default.query(`UPDATE \`${this.appName}\`.public_config
                     SET ?
                     WHERE \`key\` = "ecpay_delivery_notify";
                    `, [
                    {
                        value: JSON.stringify(notification.value),
                        updated_at: new Date(),
                    },
                ]);
            }
            else {
                await database_js_1.default.query(`INSERT INTO \`${this.appName}\`.public_config
                     SET ?;
                    `, [
                    {
                        key: 'ecpay_delivery_notify',
                        value: JSON.stringify([json]),
                        updated_at: new Date(),
                    },
                ]);
            }
            const ecpayResult = new EcPay(this.appName).notifyOrder(json);
            return ecpayResult;
        }
        catch (error) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Delivery notify error:' + error, null);
        }
    }
}
exports.Delivery = Delivery;
//# sourceMappingURL=delivery.js.map