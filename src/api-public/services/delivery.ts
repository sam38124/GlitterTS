import Tool from '../../modules/tool.js';
import redis from '../../modules/redis.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { Private_config } from '../../services/private_config.js';
import crypto from 'crypto';
import axios from 'axios';
import moment from 'moment-timezone';

const html = String.raw;

type StoreBrand = 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C' | 'TCAT' | 'POST';

type EcPayOrder = {
    LogisticsType: 'CVS' | 'HOME';
    LogisticsSubType: StoreBrand;
    GoodsAmount: number;
    GoodsName: string;
    GoodsWeight?: number;
    ReceiverName: string;
    ReceiverCellPhone: string;
    ReceiverStoreID?: string;
    CollectionAmount?: number;
    IsCollection?: 'N' | 'Y';
    ReceiverZipCode?: string;
    ReceiverAddress?: string;
    SenderZipCode?: string;
    SenderAddress?: string;
};

export type DeliveryData = {
    AllPayLogisticsID: string;
    BookingNote: string;
    CheckMacValue: string;
    CVSPaymentNo: string;
    CVSValidationNo: string;
    GoodsAmount: string;
    LogisticsSubType: string;
    LogisticsType: string;
    MerchantID: string;
    MerchantTradeNo: string;
    ReceiverAddress: string;
    ReceiverCellPhone: string;
    ReceiverEmail: string;
    ReceiverName: string;
    ReceiverPhone: string;
    RtnCode: string;
    RtnMsg: string;
    UpdateStatusDate: string;
};

export class EcPay {
    appName: string;
    constructor(appName: string) {
        this.appName = appName;
    }

    static generateCheckMacValue(params: Record<string, any>, HashKey: string, HashIV: string): string {
        // 將傳遞參數依字母順序排序
        const sortedKeys = Object.keys(params).sort();
        const sortedParams = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');

        // 在最前面加上 HashKey，最後加上 HashIV
        const stringToEncode = `HashKey=${HashKey}&${sortedParams}&HashIV=${HashIV}`;

        // 進行 URL encode，並轉成小寫
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

        // 用 MD5 加密
        const md5Hash = crypto.createHash('md5').update(urlEncodedString).digest('hex');

        // 轉大寫並返回結果
        return md5Hash.toUpperCase();
    }

    static generateForm(json: { actionURL: string; params: Record<string, any>; checkMacValue?: string }) {
        const formId = `form_ecpay_${Tool.randomString(10)}`;
        const inputHTML = Object.entries(json.params)
            .map(([key, value]) => html`<input type="hidden" name="${key}" id="${key}" value="${value}" />`)
            .join('\n');

        return html`
            <form id="${formId}" action="${json.actionURL}" method="post" enctype="application/x-www-form-urlencoded" accept="text/html">
                ${inputHTML} ${json.checkMacValue ? html`<input type="hidden" name="CheckMacValue" id="CheckMacValue" value="${json.checkMacValue}" />` : ''}
                <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit" hidden></button>
            </form>
        `;
    }

    static async axiosRequest(json: { actionURL: string; params: Record<string, any>; checkMacValue?: string }) {
        try {
            return new Promise<{ result: boolean; data: string }>((resolve) => {
                axios
                    .request({
                        method: 'post',
                        url: json.actionURL,
                        data: {
                            ...json.params,
                            checkMacValue: json.checkMacValue,
                        },
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
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'EcPay axiosRequest error', null);
        }
    }

    async notifyOrder(json: any) {
        try {
            const checkouts = await db.query(
                `SELECT * FROM \`${this.appName}\`.t_checkout 
                WHERE JSON_EXTRACT(orderData, '$.deliveryData.AllPayLogisticsID') = ?
                  AND JSON_EXTRACT(orderData, '$.deliveryData.MerchantTradeNo') = ?;`,
                [json.AllPayLogisticsID, json.MerchantTradeNo]
            );
            if (checkouts[0]) {
                const checkout = checkouts[0];
                if (checkout.orderData.deliveryNotifyList && checkout.orderData.deliveryNotifyList.length > 0) {
                    checkout.orderData.deliveryNotifyList.push(json);
                } else {
                    checkout.orderData.deliveryNotifyList = [json];
                }

                await db.query(
                    `UPDATE \`${this.appName}\`.t_checkout SET ? WHERE id = ?
                    `,
                    [
                        {
                            orderData: JSON.stringify(checkout.orderData),
                        },
                        checkout.id,
                    ]
                );
            }
            return '1|OK';
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'EcPay notifyOrder error:' + error, null);
        }
    }
}

export class Delivery {
    appName: string;

    constructor(appName: string) {
        this.appName = appName;
    }

    async getC2CMap(returnURL: string, logistics: string) {
        const id = 'redirect_' + Tool.randomString(10);
        await redis.setValue(id, returnURL);

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

    async postStoreOrder(json?: EcPayOrder) {
        const keyData = (
            await Private_config.getConfig({
                appName: this.appName,
                key: 'glitter_delivery',
            })
        )[0].value;

        const actionURL = keyData.Action === 'main' ? 'https://logistics.ecpay.com.tw/Express/Create' : 'https://logistics-stage.ecpay.com.tw/Express/Create';

        const originParams = {
            MerchantID: keyData.MERCHANT_ID,
            MerchantTradeDate: moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
            ServerReplyURL: `${process.env.DOMAIN}/api-public/v1/delivery/c2cNotify?g-app=${this.appName}`,
            SenderName: keyData.SenderName,
            SenderCellPhone: keyData.SenderCellPhone,
            ...json,
        };

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
        const getJSON = Object.fromEntries(
            cleanedString.split('&').map((pair: string) => {
                const [key, value] = pair.split('=');
                return [key, decodeURIComponent(value)];
            })
        );
        return {
            result: true,
            data: getJSON as DeliveryData,
        };
    }

    async getOrderInfo(json: { LogisticsSubType: StoreBrand; AllPayLogisticsID: string; CVSPaymentNo: string; CVSValidationNo: string }) {
        const keyData = (
            await Private_config.getConfig({
                appName: this.appName,
                key: 'glitter_delivery',
            })
        )[0].value;

        const originParams = {
            MerchantID: keyData.MERCHANT_ID,
            AllPayLogisticsID: json.AllPayLogisticsID,
            CVSPaymentNo: json.CVSPaymentNo,
            CVSValidationNo: json.CVSValidationNo,
        };

        const params = Delivery.removeUndefined(originParams);

        const storePath: Record<StoreBrand, string> = {
            FAMIC2C: 'Express/PrintFAMIC2COrderInfo',
            UNIMARTC2C: 'Express/PrintUniMartC2COrderInfo',
            HILIFEC2C: 'Express/PrintHILIFEC2COrderInfo',
            OKMARTC2C: 'Express/PrintOKMARTC2COrderInfo',
            TCAT: 'helper/printTradeDocument',
            POST: 'helper/printTradeDocument',
        };

        const actionURL = keyData.Action === 'main' ? `https://logistics.ecpay.com.tw/${storePath[json.LogisticsSubType]}` : `https://logistics-stage.ecpay.com.tw/${storePath[json.LogisticsSubType]}`;

        const checkMacValue = EcPay.generateCheckMacValue(params, keyData.HASH_KEY, keyData.HASH_IV);

        const random_id = Tool.randomString(6);

        await redis.setValue(
            'delivery_' + random_id,
            JSON.stringify({
                actionURL,
                params,
                checkMacValue,
            })
        );
        return random_id;
    }

    static removeUndefined(originParams: any) {
        const params = Object.fromEntries(Object.entries(originParams).filter(([_, value]) => value !== undefined));
        return params;
    }

    async notify(json: any) {
        try {
            // 存入通知紀錄
            const getNotification = await db.query(
                `SELECT * FROM \`${this.appName}\`.public_config WHERE \`key\` = "ecpay_delivery_notify";
                `,
                []
            );

            json.token && delete json.token;
            const notification = getNotification[0];
            if (notification) {
                notification.value.push(json);
                await db.query(
                    `UPDATE \`${this.appName}\`.public_config SET ? WHERE \`key\` = "ecpay_delivery_notify";
                    `,
                    [
                        {
                            value: JSON.stringify(notification.value),
                            updated_at: new Date(),
                        },
                    ]
                );
            } else {
                await db.query(
                    `INSERT INTO \`${this.appName}\`.public_config SET ?;
                    `,
                    [
                        {
                            key: 'ecpay_delivery_notify',
                            value: JSON.stringify([json]),
                            updated_at: new Date(),
                        },
                    ]
                );
            }

            const ecpayResult = new EcPay(this.appName).notifyOrder(json);
            return ecpayResult;
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'Delivery notify error:' + error, null);
        }
    }
}
