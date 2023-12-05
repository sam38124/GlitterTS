import {IToken} from "../models/Auth.js";
import response from "../../modules/response.js";
import exception from "../../modules/exception.js";
import db from "../../modules/database.js";
import Newebpay from "./newebpay.js";
import {Private_config} from "../../services/private_config.js";
import redis from "../../modules/redis.js";

interface VoucherData {
    title: string,
    method: 'percent' | 'fixed',
    trigger: 'auto' | "code"
    value: string,
    for: 'collection' | 'product',
    rule: 'min_price' | 'min_count'
    forKey: string[],
    ruleValue: number,
    startDate: string,
    startTime: string,
    endDate?: string,
    endTime?: string,
    status: 0 | 1 | -1,
    type: 'voucher',
    code?: string,
    overlay: boolean,
    bind?: {
        "id": string,
        "spec": string[],
        "count": number,
        "sale_price": number,
        "collection": string[],
        "discount_price": number
    }[],
    start_ISO_Date: string,
    end_ISO_Date: string,
    discount_total: number
}

export class Shopping {
    public app: string
    public token: IToken

    constructor(app: string, token: IToken) {
        this.app = app
        this.token = token
    }

    public async getProduct(query: {
        page: number,
        limit: number,
        id?: string,
        search?: string,
        collection?: string,
        minPrice?: string,
        maxPrice?: string,
        status?:string
    }) {
        try {
            let querySql = [
                `(content->>'$.type'='product')`
            ]
            query.search && querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`)
            query.id && querySql.push(`(content->>'$.id'=${query.id})`)
            query.collection && querySql.push(`(JSON_EXTRACT(content, '$.collection') LIKE '%${query.collection}%')`)
            query.status && querySql.push(`(JSON_EXTRACT(content, '$.status') = '${query.status}')`)
            query.minPrice && querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)>=${query.minPrice}) `)
            query.maxPrice && querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)<=${query.maxPrice}) `)
            return await this.querySql(querySql, query)
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }

    public async querySql(querySql: string[], query: { page: number, limit: number, id?: string }) {
        let sql = `SELECT *
                   FROM \`${this.app}\`.t_manager_post
                   where ${querySql.join(' & ')}
                   order by id desc`
        if (query.id) {
            const data = (await db.query(`SELECT *
                                          FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []))[0]
            return {
                data: data,
                result: !!(data)
            }
        } else {
            return {
                data: (await db.query(`SELECT *
                                       FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, [])),
                total: (await db.query(`SELECT count(1)
                                        FROM (${sql}) as subqyery`, []))[0]['count(1)']
            }
        }
    }

    public async deleteProduct(query: {
        id: string
    }) {
        try {
            await db.query(`delete
                            FROM \`${this.app}\`.t_manager_post
                            where id in (?)`, [query.id.split(',')])
            return {
                result: true
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
    public async deleteVoucher(query: {
        id: string
    }) {
        try {
            await db.query(`delete
                            FROM \`${this.app}\`.t_manager_post
                            where id in (?)`, [query.id.split(',')])
            return {
                result: true
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }


    public async toCheckout(data: {
        lineItems: {
            "id": string,
            "spec": string[],
            "count": number,
            "sale_price": number,
            "collection"?: string[],
            title?: string,
            preview_image?: string
        }[],
        "email"?: string,
        "return_url": string,
        "user_info": any,
        "code"?: string
    }, type: 'add' | 'preview' = 'add') {
        try {
            //運費設定
            const shipment: {
                basic_fee: number;
                weight: number,
            } = ((await Private_config.getConfig({
                appName: this.app, key: 'glitter_shipment'
            })) ?? [{
                basic_fee: 0,
                weight: 0
            }])[0].value
            //購物車資料
            const carData: {
                lineItems: {
                    "id": string,
                    "spec": string[],
                    "count": number,
                    "sale_price": number,
                    "collection": string[],
                    title: string,
                    preview_image: string
                }[],
                total: number,
                email: string,
                user_info: any,
                "code"?: string,
                shipment_fee: number
            } = {
                lineItems: [],
                total: 0,
                email: data.email ?? ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: shipment.basic_fee
            }
            for (const b of data.lineItems) {
                const pd = (await this.getProduct({page: 0, limit: 50, id: b.id})).data.content
                const variant = pd.variants.find((dd: any) => {
                    return dd.spec.join('-') === b.spec.join('-')
                })
                b.preview_image = variant.preview_image || pd.preview_image[0]
                b.title = pd.title
                b.sale_price = variant.sale_price
                b.collection = pd['collection']
                variant.shipment_weight = parseInt(variant.shipment_weight || 0)
                carData.shipment_fee! += (variant.shipment_weight * shipment.weight) * b.count
                carData.lineItems.push(b as any)
                carData.total += variant.sale_price * b.count
            }
            carData.total += carData.shipment_fee!
            carData.code = data.code
            const voucherList = await this.checkVoucher(carData);
            if (type === 'preview') {
                return {
                    data: carData
                }
            }
            const keyData = (await Private_config.getConfig({
                appName: this.app, key: 'glitter_finance'
            }))[0].value
            const subMitData = await (new Newebpay(this.app, {
                "HASH_IV": keyData.HASH_IV,
                "HASH_KEY": keyData.HASH_KEY,
                "ActionURL": keyData.ActionURL,
                "NotifyURL": `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`,
                "ReturnURL": `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${data.return_url}`,
                "MERCHANT_ID": keyData.MERCHANT_ID,
            }).createNewebPage(carData));


            return {
                form: `<form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
                            <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}" />
                            <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}" />
                            <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}" />
                            <input type="hidden" name="Version" value="${subMitData.Version}" />
                            <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}" />
                            <button
                                type="submit"
                                class="btn btn-secondary custom-btn beside-btn"
                                id="submit"
                                hidden
                            ></button>
                        </form>`
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error:' + e, null);
        }
    }

    public async checkVoucher(cart: {
        lineItems: {
            "id": string,
            "spec": string[],
            "count": number,
            "sale_price": number,
            "collection": string[],
            "discount_price"?: number
        }[],
        discount?: number,
        total: number,
        email: string,
        user_info: any,
        voucherList?: VoucherData[],
        code?: string
    }) {
        cart.discount = 0
        cart.lineItems.map((dd) => {
            dd.discount_price = 0
        })
        let overlay = false
        //用戶輸入的代碼
        const code = cart.code;
        //過濾可使用優惠券
        const voucherList = (await this.querySql([
            `(content->>'$.type'='voucher')`
        ], {
            page: 0,
            limit: 10000
        })).data.map((dd: any) => {
            return dd.content
        }).filter((dd: VoucherData) => {
            //判斷有效期限
            return (new Date(dd.start_ISO_Date).getTime() < new Date().getTime()) && (!dd.end_ISO_Date || ((new Date(dd.end_ISO_Date).getTime() > new Date().getTime())))
        }).filter((dd: VoucherData) => {
            //綁定商品
            let item: any = [];
            //判斷符合商品類型
            switch (dd.for) {
                case 'collection':
                    item = cart.lineItems.filter((dp) => {
                        return dd.forKey.filter((d1) => {
                            return dp.collection.find((d2) => {
                                return d2 === d1
                            })
                        })
                    });
                    (dd).bind = item
                    return item.length > 0
                case 'product':
                    item = cart.lineItems.filter((dp) => {
                        return dd.forKey.map((dd) => {
                            return `${dd}`
                        }).indexOf(`${dp.id}`) !== -1
                    });
                    (dd).bind = item;
                    return item.length > 0
            }
        }).filter((dd: VoucherData) => {
            //判斷是自動發放還是優惠碼。
            return (dd.trigger === 'auto') || (dd.code === `${code}`)
        }).filter((dd: VoucherData) => {
            //判斷最低消費金額或數量。
            return (dd.rule === 'min_count') ? (cart.lineItems.length >= parseInt(`${dd.ruleValue}`, 10)) : (cart.total >= parseInt(`${dd.ruleValue}`, 10))
        }).sort(function (a: VoucherData, b: VoucherData) {
            let compareB = b.bind!.map((dd) => {
                return (b.method === 'percent') ? (dd.sale_price * (parseFloat(b.value))) / 100 : parseFloat(b.value)
            }).reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0)
            let compareA = a.bind!.map((dd) => {
                return (a.method === 'percent') ? (dd.sale_price * (parseFloat(a.value))) / 100 : parseFloat(a.value)
            }).reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0)
            //排序折扣金額
            return compareB - compareA;
        }).filter((dd: VoucherData) => {
            //是否可疊加
            if (!overlay && (!dd.overlay)) {
                overlay = true
                return true
            }
            return (dd.overlay)
        }).filter((dd: VoucherData) => {
            dd.discount_total = dd.discount_total ?? 0
            //進行折扣(判斷商品金額必須大於折扣金額)
            dd.bind = dd.bind!.filter((d2) => {
                let discount = (dd.method === 'percent') ? (d2.sale_price * (parseFloat(dd.value))) / 100 : parseFloat(dd.value)
                //單項商品折扣金額必須小於商品單價
                if ((d2.discount_price + discount) < d2.sale_price) {
                    d2.discount_price += discount
                    cart.discount! += discount * d2.count
                    dd.discount_total += discount * d2.count
                    return true
                } else {
                    return false
                }
            })
            return dd.bind.length > 0
        })
        if (!voucherList.find((d2: any) => {
            return d2.code === `${cart.code}`
        })) {
            cart.code = undefined
        }
        cart.total = cart.total - cart.discount
        cart.voucherList = voucherList
    }

    public async putOrder(data: {
        id: string,
        orderData: {
            "id": number,
            "cart_token": string,
            "status": number,
            "email": string,
            "orderData": {
                "email": string,
                "total": number,
                "lineItems": {
                    "id": number,
                    "spec": string[],
                    "count": string,
                    "sale_price": number
                }[],
                "user_info": {
                    "name": string,
                    "email": string,
                    "phone": string,
                    "address": string
                }
            },
            "created_time": string,
            "progress": 'finish' | 'wait' | 'shipping'
        },
        status: number
    }) {
        try {
            const update: any = {}
            data.orderData && (update.orderData = JSON.stringify(data.orderData));
            data.status && (update.status = data.status)
            await db.query(`update \`${this.app}\`.t_checkout
                            set ?
                            where id = ?`, [
                update
                , data.id])
            return {
                result: 'success',
                orderData: data.orderData
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
        }
    }

    public async deleteOrder(req:{id:string}){
        try {
            await db.query(`delete
                            FROM \`${this.app}\`.t_checkout
                            where id in (?)`, [req.id.split(',')])
            return {
                result: true
            }
        }catch (e){
            throw exception.BadRequestError('BAD_REQUEST', 'deleteOrder Error:' + e, null);
        }
    }


    public async getCheckOut(query: {
        page: number,
        limit: number,
        id?: string,
        search?: string,
        email?: string
    }) {
        try {
            let querySql = [
                '1=1'
            ]
            query.email && querySql.push(`(email=${db.escape(query.email)})`)
            query.search && querySql.push(
                [
                    `((UPPER(Cart_token) LIKE UPPER('%${query.search}%'))`,
                    `(UPPER(JSON_UNQUOTE(orderData->>'$.email')) LIKE UPPER('%${query.search}%')))`,
                    `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.name')) LIKE UPPER('%${query.search}%')))`
                ].join('||')
            )
            query.id && querySql.push(`(content->>'$.id'=${query.id})`)
            let sql = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       where ${querySql.join(' & ')}
                       order by id desc`
            if (query.id) {
                const data = (await db.query(`SELECT *
                                              FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []))[0]
                return {
                    data: data,
                    result: !!(data)
                }
            } else {
                return {
                    data: (await db.query(`SELECT *
                                           FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, [])),
                    total: (await db.query(`SELECT count(1)
                                            FROM (${sql}) as subqyery`, []))[0]['count(1)']
                }
            }

        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }
}