"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayNowLogistics = void 0;
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const process_1 = __importDefault(require("process"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const crypto_1 = require("crypto");
const private_config_js_1 = require("../../services/private_config.js");
const shipment_config_js_1 = require("../config/shipment-config.js");
const axios_1 = __importDefault(require("axios"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const shopping_js_1 = require("./shopping.js");
const user_js_1 = require("./user.js");
const html = String.raw;
class PayNowLogistics {
    constructor(app_name) {
        this.app_name = app_name;
    }
    async config() {
        const deliveryConfig = (await private_config_js_1.Private_config.getConfig({
            appName: this.app_name,
            key: 'glitter_delivery',
        }))[0];
        return {
            pwd: deliveryConfig.value.pay_now.pwd,
            link: deliveryConfig.value.pay_now.Action === 'test' ? `https://testlogistic.paynow.com.tw` : `https://logistic.paynow.com.tw`,
            toggle: deliveryConfig.value.pay_now.toggle,
            account: deliveryConfig.value.pay_now.account,
            sender_name: deliveryConfig.value.pay_now.SenderName,
            sender_phone: deliveryConfig.value.pay_now.SenderCellPhone,
            sender_address: deliveryConfig.value.pay_now.SenderAddress,
            sender_email: deliveryConfig.value.pay_now.SenderEmail,
        };
    }
    async choseLogistics(type, return_url) {
        const key = tool_js_1.default.randomString(6);
        await redis_js_1.default.setValue('redirect_' + key, return_url);
        const code = await this.encrypt(process_1.default.env.logistic_apicode);
        const shipment_config = (await new user_js_1.User(this.app_name).getConfigV2({
            key: `shipment_config_${type}`,
            user_id: 'manager'
        }));
        const cf = {
            user_account: process_1.default.env.logistic_account,
            apicode: encodeURIComponent(code),
            Logistic_serviceID: (() => {
                const paynow_id = shipment_config_js_1.ShipmentConfig.list.find((dd) => {
                    return dd.value === type;
                }).paynow_id;
                if (shipment_config.bulk) {
                    if (paynow_id === '01') {
                        return '02';
                    }
                    else if (paynow_id === '21') {
                        return '22';
                    }
                    else if (paynow_id === '03') {
                        return '04';
                    }
                    else if (paynow_id === '23') {
                        return '24';
                    }
                    else {
                        return `-1`;
                    }
                }
                else {
                    return paynow_id;
                }
            })(),
            returnUrl: `${process_1.default.env.DOMAIN}/api-public/v1/ec/logistics/redirect?g-app=${this.app_name}&return=${key}`
        };
        console.log(`Logistic_serviceID`, cf.Logistic_serviceID);
        return html `
            <form action="https://logistic.paynow.com.tw/Member/Order/Choselogistics" method="post"
                  enctype="application/x-www-form-urlencoded"
                  accept="text/html">
                ${Object.keys(cf).map((dd) => {
            return `<input type="hidden" name="${dd}" id="${dd}" value="${cf[dd]}"/>`;
        }).join('\n')}
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit"
                        hidden></button>
            </form>
        `;
    }
    async deleteLogOrder(orderNO, logisticNumber, totalAmount) {
        const l_config = await this.config();
        const url = `${l_config.link}/api/Orderapi/CancelOrder`;
        const data = {
            LogisticNumber: logisticNumber,
            sno: 1,
            PassCode: await this.sha1Encrypt([l_config.account, orderNO, totalAmount, l_config.pwd].join(''))
        };
        Object.keys(data).map((dd) => {
            data[dd] = `${data[dd]}`;
        });
        const config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'application/JSON'
            },
            data: data
        };
        const response = await (0, axios_1.default)(config);
        console.log(`response_data==>`, response.data);
        if (response.data && !(response.data.includes('已繳費')) && !(response.data.includes('已寄件'))) {
            const order = (await database_js_1.default.query(`select *
                                           from \`${this.app_name}\`.t_checkout
                                           where cart_token = ?`, [orderNO]))[0];
            delete order.orderData.user_info.shipment_number;
            delete order.orderData.user_info.shipment_refer;
            await new shopping_js_1.Shopping(this.app_name).putOrder({
                cart_token: orderNO,
                orderData: order.orderData,
                status: undefined
            });
        }
        return response.data;
    }
    async getOrderInfo(orderNO) {
        try {
            const l_config = await this.config();
            const url = `${l_config.link}/api/Orderapi/Get_Order_Info_orderno?orderno=${orderNO}&user_account=${l_config.account}&sno=1`;
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: url,
                headers: {
                    'Content-Type': 'application/JSON'
                }
            };
            const response = await (0, axios_1.default)(config);
            return response.data;
        }
        catch (e) {
            console.log(e);
            return {
                status: e.status
            };
        }
    }
    async printLogisticsOrder(carData) {
        const l_config = await this.config();
        const url = `${l_config.link}/api/Orderapi/Add_Order`;
        const shipment_config = (await new user_js_1.User(this.app_name).getConfigV2({
            key: `shipment_config_${carData.user_info.shipment}`,
            user_id: 'manager'
        }));
        const service = (() => {
            const paynow_id = shipment_config_js_1.ShipmentConfig.list.find((dd) => {
                return dd.value === carData.user_info.shipment;
            }).paynow_id;
            if (shipment_config.bulk) {
                if (paynow_id === '01') {
                    return '02';
                }
                else if (paynow_id === '21') {
                    return '22';
                }
                else if (paynow_id === '03') {
                    return '04';
                }
                else if (paynow_id === '23') {
                    return '24';
                }
                else {
                    return `-1`;
                }
            }
            else {
                return paynow_id;
            }
        })();
        const data = await (async () => {
            if (service === '36') {
                return {
                    user_account: l_config.account,
                    apicode: l_config.pwd,
                    Logistic_service: service,
                    OrderNo: carData.orderID,
                    DeliverMode: (carData.customer_info.payment_select == 'cash_on_delivery') ? '01' : '02',
                    TotalAmount: carData.total,
                    receiver_storeid: carData.user_info.CVSStoreID,
                    receiver_storename: carData.user_info.CVSStoreName,
                    return_storeid: '',
                    Receiver_Name: carData.user_info.name,
                    Receiver_Phone: carData.user_info.phone,
                    Receiver_Email: carData.user_info.email,
                    Receiver_address: carData.user_info.address,
                    Sender_Name: l_config.sender_name,
                    Sender_Phone: l_config.sender_phone,
                    Sender_Email: l_config.sender_email,
                    Sender_address: l_config.sender_address,
                    Length: carData.user_info.length,
                    Wide: carData.user_info.wide,
                    High: carData.user_info.high,
                    Weight: carData.user_info.weight,
                    DeliveryType: (() => {
                        switch (carData.user_info.shipment) {
                            case 'black_cat':
                                return '0001';
                            case 'black_cat_ice':
                                return '0002';
                            case 'black_cat_freezing':
                                return '0003';
                        }
                    })(),
                    "Remark": "",
                    "Description": "",
                    PassCode: await this.sha1Encrypt([l_config.account, carData.orderID, carData.total, l_config.pwd].join(''))
                };
            }
            else {
                return {
                    user_account: l_config.account,
                    apicode: l_config.pwd,
                    Logistic_service: service,
                    OrderNo: carData.orderID,
                    DeliverMode: (carData.customer_info.payment_select == 'cash_on_delivery') ? '01' : '02',
                    TotalAmount: carData.total,
                    receiver_storeid: carData.user_info.CVSStoreID,
                    receiver_storename: carData.user_info.CVSStoreName,
                    return_storeid: '',
                    Receiver_Name: carData.user_info.name,
                    Receiver_Phone: carData.user_info.phone,
                    Receiver_Email: carData.user_info.email,
                    Receiver_address: carData.user_info.CVSAddress,
                    Sender_Name: l_config.sender_name,
                    Sender_Phone: l_config.sender_phone,
                    Sender_Email: l_config.sender_email,
                    Sender_address: l_config.sender_address,
                    "Remark": "",
                    "Description": "",
                    PassCode: await this.sha1Encrypt([l_config.account, carData.orderID, carData.total, l_config.pwd].join(''))
                };
            }
        })();
        function getDaysDifference(date1, date2) {
            const timeDifference = Math.abs(date2.getTime() - date1.getTime());
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            return daysDifference;
        }
        if (service === '36') {
            data.Deadline = '0';
        }
        else if (['02', '22', '04', '24'].includes(service)) {
            data.Deadline = getDaysDifference(new Date(), new Date(carData.user_info.shipment_date));
        }
        Object.keys(data).map((dd) => {
            data[dd] = `${data[dd]}`;
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Content-Type': 'application/JSON'
            },
            data: {
                JsonOrder: await this.encrypt(JSON.stringify(data))
            }
        };
        const response = await (0, axios_1.default)(config);
        console.log(`response_data==>`, response.data);
        return response.data;
    }
    async encrypt(content) {
        try {
            var ivbyte = crypto_js_1.default.enc.Utf8.parse("12345678");
            console.log(`ivbyte=>`, ivbyte);
            const encrypted = crypto_js_1.default.TripleDES.encrypt(crypto_js_1.default.enc.Utf8.parse(content), crypto_js_1.default.enc.Utf8.parse("123456789070828783123456"), {
                iv: ivbyte,
                mode: crypto_js_1.default.mode.ECB,
                padding: crypto_js_1.default.pad.ZeroPadding
            });
            return encrypted.toString();
        }
        catch (e) {
            console.error(e);
        }
    }
    async sha1Encrypt(data) {
        const hash = (0, crypto_1.createHash)('sha1').update(data, 'utf8').digest('hex');
        return hash.toUpperCase();
    }
}
exports.PayNowLogistics = PayNowLogistics;
//# sourceMappingURL=paynow-logistics.js.map