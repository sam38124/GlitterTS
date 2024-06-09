import { IToken } from '../models/Auth.js';
import response from '../../modules/response.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import FinancialService from './financial-service.js';
import { Private_config } from '../../services/private_config.js';
import redis from '../../modules/redis.js';
import { User } from './user.js';
import { Post } from './post.js';
import Tool from '../../modules/tool.js';
import { Invoice } from './invoice.js';
import e from 'express';

interface VoucherData {
    title: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free';
    trigger: 'auto' | 'code';
    value: string;
    for: 'collection' | 'product' | 'all';
    rule: 'min_price' | 'min_count';
    forKey: string[];
    ruleValue: number;
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
    status: 0 | 1 | -1;
    type: 'voucher';
    code?: string;
    overlay: boolean;
    bind?: {
        id: string;
        spec: string[];
        count: number;
        sale_price: number;
        collection: string[];
        discount_price: number;
        rebate: number;
        shipment_fee: number;
    }[];
    start_ISO_Date: string;
    end_ISO_Date: string;
    discount_total: number;
    rebate_total: number;
}

export class Shopping {
    public app: string;
    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    public async deleteRebate(cf: { id: string }) {
        try {
            await db.query(
                `update \`${this.app}\`.t_rebate
                            set status= -2
                            where id in (?)`,
                [cf.id.split(',')]
            );
        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }

    public async getProduct(query: {
        page: number;
        limit: number;
        sku?: string;
        id?: string;
        search?: string;
        collection?: string;
        min_price?: string;
        max_price?: string;
        status?: string;
        order_by?: string;
        id_list?: string;
        with_hide_index?: string;
    }) {
        try {
            let querySql = [`(content->>'$.type'='product')`];
            query.search && querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`);
            query.id && querySql.push(`(content->>'$.id' = ${query.id})`);
            query.collection &&
                querySql.push(
                    `(${query.collection
                        .split(',')
                        .map((dd) => {
                            return `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
                        })
                        .join(' or ')})`
                );
            console.log(`select content->>'$.product_id' as id from \`${this.app}\`.t_manager_post where content->>'$.sku'=${db.escape(query.sku)}`);
            query.sku && querySql.push(`id in (select CAST(content->>'$.product_id' AS UNSIGNED) as id from \`${this.app}\`.t_manager_post where content->>'$.sku'=${db.escape(query.sku)})`);
            if (!query.id && query.status === 'active' && query.with_hide_index !== 'true') {
                querySql.push(`((content->>'$.hideIndex' is NULL) || (content->>'$.hideIndex'='false'))`);
            }
            query.id_list && querySql.push(`(content->>'$.id' in (${query.id_list}))`);
            query.status && querySql.push(`(JSON_EXTRACT(content, '$.status') = '${query.status}')`);
            query.min_price && querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)>=${query.min_price}) `);
            query.max_price && querySql.push(`(CAST(JSON_UNQUOTE(JSON_EXTRACT(content, '$.variants[0].sale_price')) AS SIGNED)<=${query.max_price}) `);
            const data = await this.querySql(querySql, query);
            //產品清單
            const productList = Array.isArray(data.data) ? data.data : [data.data];
            //許願清單判斷
            if (this.token && this.token.userID) {
                for (const b of productList) {
                    b.content.in_wish_list =
                        (
                            await db.query(
                                `select count(1)
                                                               FROM \`${this.app}\`.t_post
                                                               where (content ->>'$.type'='wishlist')
                                                                 and userID = ${this.token.userID}
                                                                 and (content ->>'$.product_id'=${b.id})
                    `,
                                []
                            )
                        )[0]['count(1)'] == '1';
                }
            }
            if (productList.length > 0) {
                //尋找過期訂單
                const stockList = await db.query(
                    `SELECT *, \`${this.app}\`.t_stock_recover.id as recoverID
                                                    FROM \`${this.app}\`.t_stock_recover,
                                                         \`${this.app}\`.t_checkout
                                                    where product_id in (${productList
                                                        .map((dd) => {
                                                            return dd.id;
                                                        })
                                                        .join(',')})
                                                      and order_id = cart_token
                                                      and dead_line < ?;`,
                    [new Date()]
                );
                const trans = await db.Transaction.build();
                for (const stock of stockList) {
                    const product = productList.find((dd) => {
                        return `${dd.id}` === `${stock.product_id}`;
                    });
                    const variant = product.content.variants.find((dd: any) => {
                        return dd.spec.join('-') === stock.spec;
                    });
                    if (variant) {
                        variant.stock += stock.count;
                        if (stock.status != 1) {
                            //回寫商品訂單
                            await trans.execute(
                                `update \`${this.app}\`.\`t_manager_post\`
                                             SET ?
                                             where 1 = 1
                                               and id = ${stock.product_id}`,
                                [
                                    {
                                        content: JSON.stringify(product.content),
                                    },
                                ]
                            );
                        }
                        //移除紀錄
                        await trans.execute(
                            `delete
                                         from \`${this.app}\`.t_stock_recover
                                         where id = ?`,
                            [stock.recoverID]
                        );
                    }
                }
                await trans.commit();
            }

            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }

    public async querySql(querySql: string[], query: { page: number; limit: number; id?: string; order_by?: string }) {
        let sql = `SELECT *
                   FROM \`${this.app}\`.t_manager_post
                   where ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
        `;
        if (query.id) {
            const data = (
                await db.query(
                    `SELECT *
                                          FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
                    []
                )
            )[0];
            return {
                data: data,
                result: !!data,
            };
        } else {
            return {
                data: await db.query(
                    `SELECT *
                                       FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
                    []
                ),
                total: (
                    await db.query(
                        `SELECT count(1)
                                        FROM (${sql}) as subqyery`,
                        []
                    )
                )[0]['count(1)'],
            };
        }
    }

    public async deleteProduct(query: { id: string }) {
        try {
            await db.query(
                `delete
                            FROM \`${this.app}\`.t_manager_post
                            where id in (?)`,
                [query.id.split(',')]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }

    public async deleteVoucher(query: { id: string }) {
        try {
            await db.query(
                `delete
                            FROM \`${this.app}\`.t_manager_post
                            where id in (?)`,
                [query.id.split(',')]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }

    public async toCheckout(
        data: {
            lineItems: {
                id: string;
                spec: string[];
                count: number;
                sale_price: number;
                collection?: string[];
                title?: string;
                preview_image?: string;
                sku: string;
                shipment_fee: number;
            }[];
            email?: string;
            return_url: string;
            user_info: any;
            code?: string;
            use_rebate?: number;
            use_wallet?: number;
        },
        type: 'add' | 'preview' = 'add'
    ) {
        try {
            if(type!=='preview' && (!(this.token && this.token.userID)&&!data.email&& !(data.user_info && data.user_info.email))){
                throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error:No email address.', null);
            }

            const userData = await (async ()=>{
                if(type!=='preview'){
                    return ((this.token && this.token.userID) ? await new User(this.app).getUserData(this.token.userID as any, 'userID'):await new User(this.app).getUserData(data.email! || data.user_info.email, 'account'))
                }else{
                    return  {}
                }
            })()
            if(!data.email && (userData && userData.account)){
                data.email=userData.account
            }
            if (!data.email && type !== 'preview') {
                if (data.user_info && data.user_info.email) {
                    data.email = data.user_info.email;
                } else {
                    throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error:No email address.', null);
                }
            }
                if(!data.email && type!=='preview'){
                throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error:No email address.', null);
            }
            //判斷回饋金是否可用
            if (data.use_rebate && data.use_rebate > 0) {
                if (userData) {
                    const sum =
                        (
                            await db.query(
                                `SELECT sum(money)
                                                 FROM \`${this.app}\`.t_rebate
                                                 where status in (1, 2)
                                                   and userID = ?`,
                                [userData.userID]
                            )
                        )[0]['sum(money)'] || 0;
                    if (sum < data.use_rebate) {
                        data.use_rebate = 0;
                    }
                } else {
                    data.use_rebate = 0;
                }
            }

            //運費設定
            const shipment: {
                basic_fee: number;
                weight: number;
            } = ((await Private_config.getConfig({
                appName: this.app,
                key: 'glitter_shipment',
            })) ?? [
                {
                    basic_fee: 0,
                    weight: 0,
                },
            ])[0].value;
            //物流設定
            const shipment_setting: string[] = await new Promise(async (resolve, reject) => {
                try {
                    resolve(
                        ((await Private_config.getConfig({
                            appName: this.app,
                            key: 'logistics_setting',
                        })) ?? [
                            {
                                value: {
                                    support: [],
                                },
                            },
                        ])[0].value.support
                    );
                } catch (e) {
                    resolve([]);
                }
            });
            //購物車資料
            const carData: {
                lineItems: {
                    id: string;
                    spec: string[];
                    count: number;
                    sale_price: number;
                    collection: string[];
                    title: string;
                    preview_image: string;
                    shipment_fee: number;
                }[];
                total: number;
                email: string;
                user_info: any;
                code?: string;
                shipment_fee: number;
                rebate: number;
                use_rebate: number;
                orderID: string;
                shipment_support: string[];
                use_wallet: number;
                user_email: string;
                method: string;
            } = {
                lineItems: [],
                total: 0,
                email: data.email ?? ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: shipment.basic_fee,
                rebate: 0,
                use_rebate: data.use_rebate || 0,
                orderID: `${new Date().getTime()}`,
                shipment_support: shipment_setting as any,
                use_wallet: 0,
                method: data.user_info && data.user_info.method,
                user_email: (userData && userData.account) || (data.email ?? ((data.user_info && data.user_info.email) || '')),
            };
            for (const b of data.lineItems) {
                try {
                    const pdDqlData = (
                        await this.getProduct({
                            page: 0,
                            limit: 50,
                            id: b.id,
                            status: 'active',
                        })
                    ).data;

                    if (pdDqlData) {
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd: any) => {
                            return dd.spec.join('-') === b.spec.join('-');
                        });
                        if ((Number.isInteger(variant.stock) || variant.show_understocking === 'false') && Number.isInteger(b.count)) {
                            // 當超過庫存數量則調整為庫存上限
                            if (variant.stock < b.count && variant.show_understocking !== 'false') {
                                b.count = variant.stock;
                            }

                            if (variant && b.count > 0) {
                                b.preview_image = variant.preview_image || pd.preview_image[0];
                                b.title = pd.title;
                                b.sale_price = variant.sale_price;
                                b.collection = pd['collection'];
                                b.sku = variant.sku;
                                b.shipment_fee = variant.shipment_weight * shipment.weight * b.count || 0;
                                variant.shipment_weight = parseInt(variant.shipment_weight || 0);
                                carData.shipment_fee! += b.shipment_fee;
                                carData.lineItems.push(b as any);
                                carData.total += variant.sale_price * b.count;
                            }
                            // 當為結帳時則更改商品庫存數量
                            if (type !== 'preview') {
                                const countless = variant.stock - b.count;
                                variant.stock = countless > 0 ? countless : 0;
                                await db.query(
                                    `update \`${this.app}\`.\`t_manager_post\`
                                                SET ?
                                                where 1 = 1
                                                  and id = ${pdDqlData.id}`,
                                    [
                                        {
                                            content: JSON.stringify(pd),
                                        },
                                    ]
                                );
                                // 獲取當前時間
                                let deadTime = new Date();
                                // 添加10分鐘
                                deadTime.setMinutes(deadTime.getMinutes() + 15);
                                // 設定15分鐘後回寫訂單庫存
                                await db.query(`insert into \`${this.app}\`.\`t_stock_recover\` set ?`, [
                                    {
                                        product_id: pdDqlData.id,
                                        spec: variant.spec.join('-'),
                                        dead_line: deadTime,
                                        order_id: carData.orderID,
                                        count: b.count,
                                    },
                                ]);
                            }
                        }
                    }
                } catch (e) {}
            }
            carData.total += carData.shipment_fee!;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            const voucherList = await this.checkVoucher(carData);
            if (type === 'preview') {
                return {
                    data: carData,
                };
            }
            if (carData.use_rebate && userData && userData.userID) {
                await db.query(
                    `insert into \`${this.app}\`.t_rebate (orderID, userID, money, status, note)
                                values (?, ?, ?, ?, ?);`,
                    [
                        carData.orderID,
                        userData.userID,
                        carData.use_rebate * -1,
                        1,
                        JSON.stringify({
                            note: '使用回饋金購物',
                        }),
                    ]
                );
            }
            if(userData && userData.userID){
                //判斷錢包是否有餘額
                const sum =
                    (
                        await db.query(
                            `SELECT sum(money)
                                         FROM \`${this.app}\`.t_wallet
                                         where status in (1, 2)
                                           and userID = ?`,
                            [userData.userID]
                        )
                    )[0]['sum(money)'] || 0;

                if (sum < carData.total) {
                    carData.use_wallet = sum;
                } else {
                    carData.use_wallet = carData.total;
                }
                if(carData.rebate>0){
                    //消費返還回饋金
                    await db.query(
                        `insert into \`${this.app}\`.t_rebate (orderID, userID, money, status, note)
                         values (?, ?, ?, ?, ?);`,
                        [
                            carData.orderID,
                            userData.userID,
                            carData.rebate,
                            -1,
                            JSON.stringify({
                                note: '消費返還回饋金',
                            }),
                        ]
                    );
                }

            }

            //當不需付款時直接寫入，並開發票
            if (carData.use_wallet === carData.total) {
                await db.query(
                    `insert into \`${this.app}\`.t_wallet (orderID, userID, money, status, note)
                                values (?, ?, ?, ?, ?);`,
                    [
                        carData.orderID,
                        userData.userID,
                        carData.use_wallet * -1,
                        1,
                        JSON.stringify({
                            note: '使用錢包購物',
                            orderData: carData,
                        }),
                    ]
                );
                await db.execute(
                    `insert into \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                                  values (?, ?, ?, ?)`,
                    [carData.orderID, 1, carData.email, carData]
                );
                if (carData.use_wallet > 0) {
                    new Invoice(this.app).postCheckoutInvoice(carData.orderID);
                }
                return {
                    is_free: true,
                };
            } else {
                const id = 'redirect_' + Tool.randomString(6);
                await redis.setValue(id, data.return_url);
                const keyData = (
                    await Private_config.getConfig({
                        appName: this.app,
                        key: 'glitter_finance',
                    })
                )[0].value;

                const subMitData = await new FinancialService(this.app, {
                    HASH_IV: keyData.HASH_IV,
                    HASH_KEY: keyData.HASH_KEY,
                    ActionURL: keyData.ActionURL,
                    NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`,
                    ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                    MERCHANT_ID: keyData.MERCHANT_ID,
                    TYPE: keyData.TYPE,
                }).createOrderPage(carData);
                //線下付款
                if (keyData.TYPE === 'off_line') {
                    return {
                        off_line: true,
                    };
                }
                return {
                    form: subMitData,
                };
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout Error:' + e, null);
        }
    }

    public async checkVoucher(cart: {
        lineItems: {
            id: string;
            spec: string[];
            count: number;
            sale_price: number;
            collection: string[];
            discount_price?: number;
            shipment_fee: number;
            rebate?: number;
        }[];
        discount?: number;
        rebate?: number;
        total: number;
        email: string;
        user_info: any;
        shipment_fee: number;
        voucherList?: VoucherData[];
        code?: string;
    }) {
        //運費資料
        const shipment: {
            basic_fee: number;
            weight: number;
        } = ((await Private_config.getConfig({
            appName: this.app,
            key: 'glitter_shipment',
        })) ?? [
            {
                basic_fee: 0,
                weight: 0,
            },
        ])[0].value;
        cart.discount = 0;
        cart.lineItems.map((dd) => {
            dd.discount_price = 0;
            dd.rebate = 0;
        });
        let overlay = false;
        //用戶輸入的代碼
        const code = cart.code;
        //過濾可使用優惠券
        const voucherList = (
            await this.querySql([`(content->>'$.type'='voucher')`], {
                page: 0,
                limit: 10000,
            })
        ).data
            .map((dd: any) => {
                return dd.content;
            })
            .filter((dd: VoucherData) => {
                //判斷有效期限
                return new Date(dd.start_ISO_Date).getTime() < new Date().getTime() && (!dd.end_ISO_Date || new Date(dd.end_ISO_Date).getTime() > new Date().getTime());
            })
            .filter((dd: VoucherData) => {
                //綁定商品
                let item: any = [];
                //判斷符合商品類型
                switch (dd.for) {
                    case 'collection':
                        item = cart.lineItems.filter((dp) => {
                            return dd.forKey.filter((d1) => {
                                return dp.collection.find((d2) => {
                                    return d2 === d1;
                                });
                            });
                        });
                        dd.bind = item;
                        return item.length > 0;
                    case 'product':
                        item = cart.lineItems.filter((dp) => {
                            return (
                                dd.forKey
                                    .map((dd) => {
                                        return `${dd}`;
                                    })
                                    .indexOf(`${dp.id}`) !== -1
                            );
                        });
                        dd.bind = item;
                        return item.length > 0;
                    case 'all':
                        item = cart.lineItems.filter((dp) => {
                            return true;
                        });
                        dd.bind = item;
                        return item.length > 0;
                }
            })
            .filter((dd: VoucherData) => {
                //判斷是自動發放還是優惠碼。
                return dd.trigger === 'auto' || dd.code === `${code}`;
            })
            .filter((dd: VoucherData) => {
                //判斷最低消費金額或數量。
                return dd.rule === 'min_count' ? cart.lineItems.length >= parseInt(`${dd.ruleValue}`, 10) : cart.total >= parseInt(`${dd.ruleValue}`, 10);
            })
            .sort(function (a: VoucherData, b: VoucherData) {
                let compareB = b
                    .bind!.map((dd) => {
                        if (b.reBackType === 'shipment_free') {
                            return dd.shipment_fee;
                        } else {
                            return b.method === 'percent' ? (dd.sale_price * parseFloat(b.value)) / 100 : parseFloat(b.value);
                        }
                    })
                    .reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue;
                    }, 0);
                let compareA = a
                    .bind!.map((dd) => {
                        if (a.reBackType === 'shipment_free') {
                            return dd.shipment_fee;
                        } else {
                            return a.method === 'percent' ? (dd.sale_price * parseFloat(a.value)) / 100 : parseFloat(a.value);
                        }
                    })
                    .reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue;
                    }, 0);
                //排序折扣金額
                return compareB - compareA;
            })
            .filter((dd: VoucherData) => {
                //是否可疊加
                if (!overlay && !dd.overlay) {
                    overlay = true;
                    return true;
                }
                return dd.overlay;
            })
            .filter((dd: VoucherData) => {
                dd.discount_total = dd.discount_total ?? 0;
                dd.rebate_total = dd.rebate_total ?? 0;
                //進行折扣(判斷商品金額必須大於折扣金額)
                dd.bind = dd.bind!.filter((d2) => {
                    //運費折扣
                    if (dd.reBackType === 'shipment_free') {
                        cart.shipment_fee -= d2.shipment_fee;
                        cart.total -= d2.shipment_fee;
                        return true;
                    } else {
                        let discount = dd.method === 'percent' ? (d2.sale_price * parseFloat(dd.value)) / 100 : parseFloat(dd.value);
                        //單項商品折扣金額必須小於商品單價
                        if (d2.discount_price + discount < d2.sale_price) {
                            if (dd.reBackType === 'rebate') {
                                d2.rebate += discount;
                                cart.rebate! += discount * d2.count;
                                dd.rebate_total += discount * d2.count;
                            } else {
                                d2.discount_price += discount;
                                cart.discount! += discount * d2.count;
                                dd.discount_total += discount * d2.count;
                            }
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                return dd.bind.length > 0;
            });
        //判斷優惠碼無效
        if (
            !voucherList.find((d2: any) => {
                return d2.code === `${cart.code}`;
            })
        ) {
            cart.code = undefined;
        }
        //如果有折扣運費，刪除基本運費
        if (
            voucherList.find((d2: VoucherData) => {
                return d2.reBackType === 'shipment_free';
            })
        ) {
            const basic = shipment.basic_fee;
            cart.shipment_fee = cart.shipment_fee - basic;
            cart.total -= basic;
        }
        cart.total = cart.total - cart.discount;
        cart.voucherList = voucherList;
    }

    public async putOrder(data: {
        id: string;
        orderData: {
            id: number;
            cart_token: string;
            status: number;
            email: string;
            orderData: {
                email: string;
                total: number;
                lineItems: {
                    id: number;
                    spec: string[];
                    count: string;
                    sale_price: number;
                }[];
                user_info: {
                    name: string;
                    email: string;
                    phone: string;
                    address: string;
                };
            };
            created_time: string;
            progress: 'finish' | 'wait' | 'shipping';
        };
        status: number;
    }) {
        try {
            const update: any = {};
            data.orderData && (update.orderData = JSON.stringify(data.orderData));
            data.status && (update.status = data.status);
            await db.query(
                `update \`${this.app}\`.t_checkout
                            set ?
                            where id = ?`,
                [update, data.id]
            );
            return {
                result: 'success',
                orderData: data.orderData,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
        }
    }

    public async deleteOrder(req: { id: string }) {
        try {
            await db.query(
                `delete
                            FROM \`${this.app}\`.t_checkout
                            where id in (?)`,
                [req.id.split(',')]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'deleteOrder Error:' + e, null);
        }
    }

    public async getCheckOut(query: { page: number; limit: number; id?: string; search?: string; email?: string; status?: string }) {
        try {
            let querySql = ['1=1'];
            query.email && querySql.push(`email=${db.escape(query.email)}`);
            query.search &&
                querySql.push(
                    [
                        `((UPPER(Cart_token) LIKE UPPER('%${query.search}%'))`,
                        `(UPPER(JSON_UNQUOTE(orderData->>'$.email')) LIKE UPPER('%${query.search}%')))`,
                        `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.name')) LIKE UPPER('%${query.search}%')))`,
                    ].join('||')
                );
            query.status && querySql.push(`status=${query.status}`);
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);
            let sql = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       where ${querySql.join(' and ')}
                       order by id desc`;
            if (query.id) {
                const data = (
                    await db.query(
                        `SELECT *
                                              FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
                        []
                    )
                )[0];
                return {
                    data: data,
                    result: !!data,
                };
            } else {
                return {
                    data: await db.query(
                        `SELECT *
                                           FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
                        []
                    ),
                    total: (
                        await db.query(
                            `SELECT count(1)
                                            FROM (${sql}) as subqyery`,
                            []
                        )
                    )[0]['count(1)'],
                };
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }

    public async postVariantsAndPriceValue(content: any) {
        content.variants = content.variants ?? [];
        content.id &&
            (await db.query(
                `delete
                                       from \`${this.app}\`.t_manager_post
                                       where (content ->>'$.product_id'=${content.id})`,
                []
            ));
        for (const a of content.variants) {
            content.min_price = content.min_price ?? a.sale_price;
            content.max_price = content.max_price ?? a.sale_price;
            if (a.sale_price < content.min_price) {
                content.min_price = a.sale_price;
            }
            if (a.sale_price > content.max_price) {
                content.max_price = a.sale_price;
            }
            a.type = 'variants';
            a.product_id = content.id;
            await db.query(
                `insert into \`${this.app}\`.t_manager_post
                            SET ?`,
                [
                    {
                        content: JSON.stringify(a),
                        userID: this.token!.userID,
                    },
                ]
            );
        }
    }

    async getDataAnalyze(tags: string[]) {
        try {
            if (tags.length > 0) {
                const result = {} as any;
                for (const tag of tags) {
                    switch (tag) {
                        case 'recent_active_user':
                            result[tag] = await this.getRecentActiveUser();
                            break;
                        case 'recent_sales':
                            result[tag] = await this.getSalesInRecentMonth();
                            break;
                        case 'recent_orders':
                            result[tag] = await this.getOrdersInRecentMonth();
                            break;
                        case 'hot_products':
                            result[tag] = await this.getHotProducts();
                            break;
                        case 'order_avg_sale_price':
                            result[tag] = await this.getOrderAvgSalePrice();
                            break;
                        case 'orders_per_month_1_year':
                            result[tag] = await this.getOrdersPerMonth1Year();
                            break;
                        case 'sales_per_month_1_year':
                            result[tag] = await this.getSalesPerMonth1Year();
                        case 'order_today':
                            result[tag] = await this.getOrderToDay();
                            break;
                    }
                }
                return result;
            }
            return { result: false };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getDataAnalyze Error:' + e, null);
        }
    }
    async getOrderToDay() {
        try {
            const order = await db.query(`SELECT * FROM \`${this.app}\`.t_checkout  WHERE DATE(created_time) = CURDATE()`, []);

            return {
                //訂單總數
                total_count: order.filter((dd: any) => {
                    return dd.status === 1;
                }).length,
                //未出貨訂單
                un_shipment: (await db.query(`select count(1) from \`${this.app}\`.t_checkout where (orderData->'$.progress' is null || orderData->'$.progress'='wait') and status=1`, []))[0][
                    'count(1)'
                ],
                //未付款訂單
                un_pay: order.filter((dd: any) => {
                    return dd.status === 0;
                }).length,
                //今日成交金額
                total_amount: (() => {
                    let amount = 0;
                    order
                        .filter((dd: any) => {
                            return dd.status === 1;
                        })
                        .map((dd: any) => {
                            amount += dd.orderData.total;
                        });
                    return amount;
                })(),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }
    async getRecentActiveUser() {
        try {
            const recentSQL = `
                SELECT * FROM \`${this.app}\`.t_user
                WHERE online_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW();
            `;
            const recent_users = await db.query(recentSQL, []);
            const monthSQL = `
                SELECT * FROM \`${this.app}\`.t_user
                WHERE MONTH(online_time) = MONTH(NOW()) AND YEAR(online_time) = YEAR(NOW());
            `;
            const month_users = await db.query(monthSQL, []);
            return { recent: recent_users.length, months: month_users.length };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getSalesInRecentMonth() {
        try {
            const recentMonthSQL = `
                SELECT * FROM \`${this.app}\`.t_checkout
                WHERE MONTH(created_time) = MONTH(NOW()) AND YEAR(created_time) = YEAR(NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await db.query(recentMonthSQL, []);
            let recent_month_total = 0;
            recentMonthCheckouts.map((checkout: any) => {
                recent_month_total += parseInt(checkout.orderData.total, 10);
            });

            const previousMonthSQL = `
                SELECT * FROM \`${this.app}\`.t_checkout
                WHERE 
                    MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH)) 
                    AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
                    AND status = 1;
            `;
            const previousMonthCheckouts = await db.query(previousMonthSQL, []);
            let previous_month_total = 0;
            previousMonthCheckouts.map((checkout: any) => {
                previous_month_total += parseInt(checkout.orderData.total, 10);
            });

            let gap = 0;
            if (recent_month_total !== 0 && previous_month_total !== 0) {
                gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
            }

            return { recent_month_total, previous_month_total, gap };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getHotProducts() {
        try {
            const checkoutSQL = `
                SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems FROM \`${this.app}\`.t_checkout
                WHERE created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();
            `;
            const checkouts = await db.query(checkoutSQL, []);
            const series = [];
            const categories = [];
            const product_list: { title: string; count: number }[] = [];

            for (const checkout of checkouts) {
                for (const item1 of checkout.lineItems) {
                    const index = product_list.findIndex((item2) => item1.title === item2.title);
                    if (index === -1) {
                        product_list.push({ title: item1.title, count: item1.count });
                    } else {
                        product_list[index].count += item1.count;
                    }
                }
            }

            const final_product_list = product_list.sort((a, b) => (a.count < b.count ? 1 : -1));
            for (let index = 0; index < 10; index++) {
                if (final_product_list[index]) {
                    const element = final_product_list[index];
                    series.push(element.count);
                    categories.push(element.title);
                }
            }

            return { series, categories };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrdersInRecentMonth() {
        try {
            const recentMonthSQL = `
                SELECT id FROM \`${this.app}\`.t_checkout
                WHERE MONTH(created_time) = MONTH(NOW()) AND YEAR(created_time) = YEAR(NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await db.query(recentMonthSQL, []);
            let recent_month_total = recentMonthCheckouts.length;

            const previousMonthSQL = `
                SELECT id FROM \`${this.app}\`.t_checkout
                WHERE 
                    MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH)) 
                    AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
                    AND status = 1;
            `;
            const previousMonthCheckouts = await db.query(previousMonthSQL, []);
            let previous_month_total = previousMonthCheckouts.length;

            let gap = 0;
            if (recent_month_total !== 0 && previous_month_total !== 0) {
                gap = Math.floor(((recent_month_total - previous_month_total) / previous_month_total) * 10000) / 10000;
            }

            return { recent_month_total, previous_month_total, gap };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrdersPerMonth1Year() {
        try {
            const countArray = [];

            for (let index = 0; index < 12; index++) {
                const orderCountSQL = `
                    SELECT count(id) as c FROM \`${this.app}\`.t_checkout
                    WHERE 
                        MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${index} MONTH)) 
                        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${index} MONTH))
                        AND status = 1;
                `;
                const orders = await db.query(orderCountSQL, []);
                countArray.unshift(orders[0].c);
            }

            return { countArray };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getSalesPerMonth1Year() {
        try {
            const countArray = [];

            for (let index = 0; index < 12; index++) {
                const monthCheckoutSQL = `
                    SELECT orderData FROM \`${this.app}\`.t_checkout
                    WHERE 
                        MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${index} MONTH)) 
                        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${index} MONTH))
                        AND status = 1;
                `;
                const monthCheckout = await db.query(monthCheckoutSQL, []);
                let total = 0;
                monthCheckout.map((checkout: any) => {
                    total += parseInt(checkout.orderData.total, 10);
                });
                countArray.unshift(total);
            }

            return { countArray };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrderAvgSalePrice() {
        try {
            const countArray = [];

            for (let index = 0; index < 14; index++) {
                const monthCheckoutSQL = `
                    SELECT orderData FROM \`${this.app}\`.t_checkout
                    WHERE 
                        DAY(created_time) = DAY(DATE_SUB(NOW(), INTERVAL ${index} DAY))
                        AND MONTH(created_time) = MONTH(DATE_SUB(NOW(), INTERVAL ${index} DAY)) 
                        AND YEAR(created_time) = YEAR(DATE_SUB(NOW(), INTERVAL ${index} DAY))
                        AND status = 1;
                `;
                const monthCheckout = await db.query(monthCheckoutSQL, []);
                let total = 0;
                monthCheckout.map((checkout: any) => {
                    total += parseInt(checkout.orderData.total, 10);
                });
                if (monthCheckout.length == 0) {
                    countArray.unshift(0);
                } else {
                    countArray.unshift(Math.floor((total / monthCheckout.length) * 100) / 100);
                }
            }

            return { countArray };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getCollectionProducts(tag: string) {
        try {
            const products_sql = `SELECT * FROM \`${this.app}\`.t_manager_post WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await db.query(products_sql, []);
            return products.filter((product: any) => product.content.collection.includes(tag));
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }

    async putCollection(data: any) {
        try {
            const config = (await db.query(`SELECT * FROM \`${this.app}\`.public_config WHERE \`key\` = 'collection';`, []))[0];

            if (data.id == -1 || data.parent_name !== data.origin.parent_name || data.name !== data.origin.item_name) {
                if (data.parent_id === undefined && config.value.find((item: { title: string }) => item.title === data.name)) {
                    return { result: false, message: `上層分類已存在「${data.name}」類別名稱` };
                }
                if (data.parent_id !== undefined && config.value[data.parent_id].array.find((item: { title: string }) => item.title === data.name)) {
                    return { result: false, message: `上層分類「${config.value[data.parent_id].title}」已存在「${data.name}」類別名稱` };
                }
            }

            if (data.id == -1) {
                if (data.parent_id === undefined) {
                    // 新增父層類別
                    config.value.push({ array: [], title: data.name });
                } else {
                    // 新增子層類別
                    config.value[data.parent_id].array.push({ array: [], title: data.name });
                }
            } else if (data.origin.parent_id === undefined) {
                // 編輯父層類別
                config.value[data.origin.item_id] = {
                    array: data.children_collections.map((col: { name: string }) => ({ array: [], title: col.name })),
                    title: data.name,
                };
            } else {
                if (data.origin.parent_id === data.parent_id) {
                    // 編輯子層類別，沒有調整父層
                    config.value[data.origin.parent_id].array[data.origin.item_id] = { array: [], title: data.name };
                } else {
                    // 編輯子層類別，有調整父層
                    config.value[data.origin.parent_id].array.splice(data.origin.item_id, 1);
                    config.value[data.parent_id].array.push({ array: [], title: data.name });
                }
            }

            // 更新父層的子類別
            if (data.id != -1 && data.origin.children_collections) {
                const filter_childrens = data.origin.children_collections
                    .filter((child: any) => {
                        return data.children_collections.find((child2: any) => child2.id === child.id) === undefined;
                    })
                    .map((child: any) => {
                        return child.name;
                    });
                await this.deleteCollectionProduct(data.origin.item_name, filter_childrens);
            }

            // 更新商品類別 config
            const update_col_sql = `UPDATE \`${this.app}\`.public_config SET value = ? WHERE \`key\` = 'collection';`;
            await db.execute(update_col_sql, [config.value]);

            // 類別刪除產品
            if (data.id != -1) {
                const delete_id_list = data.origin.product_list
                    .filter((o_prod: { id: number }) => {
                        return data.product_list.find((prod: { id: number }) => prod.id === o_prod.id) === undefined;
                    })
                    .map((o_prod: { id: number }) => {
                        return o_prod.id;
                    });
                if (delete_id_list.length > 0) {
                    const products_sql = `SELECT * FROM \`${this.app}\`.t_manager_post WHERE id in (${delete_id_list.join(',')});`;
                    const delete_product_list = await db.query(products_sql, []);
                    for (const product of delete_product_list) {
                        product.content.collection = product.content.collection.filter((str: string) => {
                            if (data.origin.parent_name) {
                                if (str.includes(data.origin.item_name) || str.includes(`${data.origin.item_name} /`)) {
                                    return false;
                                }
                            } else {
                                if (str.includes(data.origin.item_name) || str.includes(`${data.origin.item_name} /`) || str.includes(data.origin.parent_name)) {
                                    return false;
                                }
                            }
                            return true;
                        });
                        await this.updateProductCollection(product.content, product.id);
                    }
                }
            }

            // 更新類別下商品
            const get_product_sql = `SELECT * FROM \`${this.app}\`.t_manager_post WHERE id = ?`;
            for (const p of data.product_list) {
                const get_product = await db.query(get_product_sql, [p.id]);
                if (get_product[0]) {
                    const product = get_product[0];

                    if (data.id != -1) {
                        product.content.collection = product.content.collection
                            .filter((str: string) => {
                                if (data.origin.parent_name === data.parent_name) {
                                    return true;
                                }
                                if (data.parent_name) {
                                    if (str === data.origin.parent_name || str.includes(`${data.origin.parent_name} / ${data.origin.item_name}`)) {
                                        return false;
                                    }
                                } else {
                                    if (str === data.origin.item_name || str.includes(`${data.origin.item_name} /`)) {
                                        return false;
                                    }
                                }
                                return true;
                            })
                            .map((str: string) => {
                                if (data.parent_name) {
                                    if (str.includes(`${data.origin.parent_name} / ${data.origin.item_name}`)) {
                                        return str.replace(data.origin.item_name, data.name);
                                    }
                                } else {
                                    if (str === data.origin.item_name || str.includes(`${data.origin.item_name} /`)) {
                                        return str.replace(data.origin.item_name, data.name);
                                    }
                                }
                                return str;
                            });
                    }

                    if (data.parent_id === undefined) {
                        product.content.collection.push(data.name);
                    } else {
                        product.content.collection.push(data.parent_name);
                        product.content.collection.push(`${data.parent_name} / ${data.name}`);
                    }

                    product.content.collection = [...new Set(product.content.collection)];

                    await this.updateProductCollection(product.content, product.id);
                }
            }
            return { result: true };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }

    async deleteCollection(id_array: any) {
        try {
            const config = (await db.query(`SELECT * FROM \`${this.app}\`.public_config WHERE \`key\` = 'collection';`, []))[0];
            const delete_index_array: { parent: number; child: number[] }[] = [];

            // format 刪除類別 index
            id_array.map((id: string | number) => {
                if (typeof id === 'number') {
                    delete_index_array.push({ parent: id, child: [-1] });
                } else {
                    const arr = id.split('_').map((str) => parseInt(str, 10));
                    const n = delete_index_array.findIndex((obj) => obj.parent === arr[0]);
                    if (n === -1) {
                        delete_index_array.push({ parent: arr[0], child: [arr[1]] });
                    } else {
                        delete_index_array[n].child.push(arr[1]);
                    }
                }
            });

            // 刪除類別之產品
            for (const d of delete_index_array) {
                const collection = config.value[d.parent];
                for (const index of d.child) {
                    if (index !== -1) {
                        await this.deleteCollectionProduct(collection.title, [`${collection.array[index].title}`]);
                    }
                }
                if (d.child.length === collection.array.length || d.child[0] === -1) {
                    await this.deleteCollectionProduct(collection.title);
                }
            }

            // 取得新的類別 config 陣列
            delete_index_array.map((obj) => {
                config.value[obj.parent].array = config.value[obj.parent].array.filter((col: any, index: number) => {
                    return !obj.child.includes(index);
                });
            });
            config.value = config.value.filter((col: any, index: number) => {
                const find_collection = delete_index_array.find((obj) => obj.parent === index);
                if (find_collection) {
                    if (col.array.length === 0 || find_collection.child[0] === -1) {
                        return false;
                    }
                }
                return true;
            });

            // 更新商品類別
            const update_col_sql = `UPDATE \`${this.app}\`.public_config SET value = ? WHERE \`key\` = 'collection';`;
            await db.execute(update_col_sql, [config.value]);

            return { result: true };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }

    async deleteCollectionProduct(parent_name: string, children_list?: string[]) {
        try {
            if (children_list) {
                for (const children of children_list) {
                    const tag_name = `${parent_name} / ${children}`;
                    for (const product of await db.query(this.containsTagSQL(tag_name), [])) {
                        product.content.collection = product.content.collection.filter((str: string) => str != tag_name);
                        await this.updateProductCollection(product.content, product.id);
                    }
                }
            } else {
                for (const product of await db.query(this.containsTagSQL(parent_name), [])) {
                    product.content.collection = product.content.collection.filter((str: string) => !(str === parent_name));
                    await this.updateProductCollection(product.content, product.id);
                }
                for (const product of await db.query(this.containsTagSQL(`${parent_name} /`), [])) {
                    product.content.collection = product.content.collection.filter((str: string) => str.includes(`${parent_name} / `));
                    await this.updateProductCollection(product.content, product.id);
                }
            }
            return { result: true };
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'deleteCollectionProduct Error:' + e, null);
        }
    }

    containsTagSQL(name: string) {
        return `SELECT * FROM \`${this.app}\`.t_manager_post WHERE JSON_CONTAINS(content->'$.collection', '"${name}"');`;
    }

    async updateProductCollection(content: string[], id: number) {
        try {
            const updateProdSQL = `UPDATE \`${this.app}\`.t_manager_post SET content = ? WHERE \`id\` = ?;`;
            await db.execute(updateProdSQL, [content, id]);
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'updateProductCollection Error:' + e, null);
        }
    }
}
