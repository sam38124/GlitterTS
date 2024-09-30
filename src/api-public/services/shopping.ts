import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import FinancialService from './financial-service.js';
import { Private_config } from '../../services/private_config.js';
import redis from '../../modules/redis.js';
import { User } from './user.js';
import Tool from '../../modules/tool.js';
import { Invoice } from './invoice.js';
import e from 'express';
import { Rebate } from './rebate.js';
import { CustomCode } from '../services/custom-code.js';
import moment from 'moment';
import { ManagerNotify } from './notify.js';
import { AutoSendEmail } from './auto-send-email.js';
import { Recommend } from './recommend.js';
import { Workers } from './workers.js';
import axios from 'axios';
import { Delivery, DeliveryData } from './delivery.js';
import {Sns} from "./sns.js";

type BindItem = {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    collection: string[];
    discount_price: number;
    rebate: number;
    shipment_fee: number;
    times: number;
};

interface VoucherData {
    id: number;
    title: string;
    code?: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
    add_on_products?:string[] | ProductItem[]
    trigger: 'auto' | 'code' | 'distribution';
    value: string;
    for: 'collection' | 'product' | 'all';
    rule: 'min_price' | 'min_count';
    conditionType: 'order' | 'item';
    counting: 'each' | 'single';
    forKey: string[];
    ruleValue: number;
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
    status: 0 | 1 | -1;
    type: 'voucher';
    overlay: boolean;
    bind: BindItem[];
    bind_subtotal: number;
    times: number;
    start_ISO_Date: string;
    end_ISO_Date: string;
    discount_total: number;
    rebate_total: number;
    target: string;
    targetList: string[];
    device: ('normal' | 'pos')[];
}

interface ShipmentConfig {
    volume: { key: string; value: string }[];
    weight: { key: string; value: string }[];
    selectCalc: 'volume' | 'weight';
}

interface ProductItem {
    id: number;
    userID: number;
    content: any;
    created_time: Date | string;
    updated_time: Date | string;
    status: number;
    total_sales?: number;
}

type Collection = {
    title: string;
    array: Collection[];
    checked: boolean;
    product_id?: number[];
    parentTitles: string[];
    subCollections: string[];
    allCollections: string[];
    seo_title: string;
    seo_content: string;
    seo_image: string;
    code: string;
};

type CartItem = {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    collection: string[];
    title: string;
    preview_image: string;
    shipment_obj: { type: string; value: number };
    discount_price?: number;
    rebate: number;
};

type Cart = {
    customer_info: any;
    lineItems: CartItem[];
    discount?: number;
    total: number;
    email: string;
    user_info: any;
    code?: string;
    shipment_fee: number;
    rebate: number;
    use_rebate: number;
    orderID: string;
    shipment_support: string[];
    shipment_info: any;
    use_wallet: number;
    user_email: string;
    method: string;
    useRebateInfo?: { point: number; limit?: number; condition?: number };
    voucherList?: VoucherData[];
    custom_form_format?: any;
    custom_form_data?: any;
    distribution_id?: number;
    distribution_info?: any;
    orderSource: '' | 'manual' | 'normal' | 'POS';
    code_array: string[];
    deliveryData?: DeliveryData;
    give_away: CartItem[];
};

export class Shopping {
    public app: string;

    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    public async workerExample(data: { type: 0 | 1; divisor: number }) {
        try {
            // 以 t_voucher_history 更新資料舉例
            const jsonData = await db.query(
                `SELECT *
                                             FROM \`${this.app}\`.t_voucher_history`,
                []
            );
            const t0 = performance.now();

            // 單線程插入資料
            if (data.type === 0) {
                for (const record of jsonData) {
                    await db.query(
                        `UPDATE \`${this.app}\`.\`t_voucher_history\`
                                    SET ?
                                    WHERE id = ?`,
                        [record, record.id]
                    );
                }
                return {
                    type: 'single',
                    divisor: 1,
                    executionTime: `${(performance.now() - t0).toFixed(3)} ms`,
                };
            }

            // 多線程插入資料
            const formatJsonData = jsonData.map((record: any) => {
                return {
                    sql: `UPDATE \`${this.app}\`.\`t_voucher_history\`
                          SET ?
                          WHERE id = ?`,
                    data: [record, record.id],
                };
            });
            const result = Workers.query({
                queryList: formatJsonData,
                divisor: data.divisor,
            });
            return result;
        } catch (error) {
            throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'Worker example is Failed. ' + error, null);
        }
    }

    public async getProduct(query: {
        page: number;
        limit: number;
        sku?: string;
        id?: string;
        search?: string;
        searchType?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        accurate_search_text?: boolean;
        min_price?: string;
        max_price?: string;
        status?: string;
        order_by?: string;
        id_list?: string;
        with_hide_index?: string;
        is_manger?: boolean;
        show_hidden?: string;
        productType?: string;
    }) {
        try {
            query.show_hidden = query.show_hidden ?? 'true';
            let querySql = [`(content->>'$.type'='product')`];
            if (query.search) {
                switch (query.searchType) {
                    case 'sku':
                        if (query.accurate_search_text) {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].sku') = '${query.search}'`);
                        } else {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`);
                        }
                        break;
                    case 'barcode':
                        if (query.accurate_search_text) {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].barcode') = '${query.search}'`);
                        } else {
                            querySql.push(`JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`);
                        }
                        break;
                    case 'title':
                    default:
                        querySql.push(
                            `(${[
                                `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                                `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                                `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                            ].join(' or ')})`
                        );
                        break;
                }
            }
            query.id && querySql.push(`id = ${query.id}`);
            //當非管理員時，檢查是否顯示隱形商品
            if (!query.is_manger && `${query.show_hidden}` !== 'true') {
                querySql.push(`(content->>'$.visible' is null || content->>'$.visible' = 'true')`);
            }
            //判斷有帶入商品類型時，顯示商品類型，反之預設折是一班商品
            if (query.productType) {
                query.productType.split(',').map((dd) => {
                    querySql.push(`(content->>'$.productType.${dd}' = "true")`);
                });
            } else if (!query.id) {
                querySql.push(`(content->>'$.productType.product' = "true")`);
            }
            //如是連結帶入則轉換成Title
            if (query.collection) {
                const collection_cf = (
                    await db.query(
                        `SELECT *
                         FROM \`${this.app}\`.public_config
                         where \`key\` = 'collection';
                        `,
                        []
                    )
                )[0]['value'];
                query.collection = decodeURI(query.collection);
                query.collection = query.collection
                    .split(',')
                    .map((dd) => {
                        function loop(array: any, prefix: string[]) {
                            const find = array.find((d1: any) => {
                                return d1.code === dd;
                            });
                            if (find) {
                                prefix.push(find.title);
                                dd = prefix.join(' / ');
                                query.accurate_search_collection = true;
                            } else {
                                array.map((d1: any) => {
                                    if (d1.array) {
                                        let prefix_i = JSON.parse(JSON.stringify(prefix));
                                        prefix_i.push(d1.title);
                                        loop(d1.array, prefix_i);
                                    }
                                });
                            }
                        }

                        loop(collection_cf, []);
                        return dd;
                    })
                    .join(',');
            }
            query.collection &&
                querySql.push(
                    `(${query.collection
                        .split(',')
                        .map((dd) => {
                            return query.accurate_search_collection ? `(JSON_CONTAINS(content->'$.collection', '"${dd}"'))` : `(JSON_EXTRACT(content, '$.collection') LIKE '%${dd}%')`;
                        })
                        .join(' or ')})`
                );
            query.sku && querySql.push(`(id in ( select product_id from \`${this.app}\`.t_variants where content->>'$.sku'=${db.escape(query.sku)}))`);
            if (!query.id && query.status === 'active' && query.with_hide_index !== 'true') {
                querySql.push(`((content->>'$.hideIndex' is NULL) || (content->>'$.hideIndex'='false'))`);
            }
            query.id_list && querySql.push(`(id in (${query.id_list}))`);
            query.status && querySql.push(`(JSON_EXTRACT(content, '$.status') = '${query.status}')`);
            query.min_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'>=${query.min_price})) `);
            query.max_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'<=${query.max_price})) `);
            const products = await this.querySql(querySql, query);

            // 產品清單
            const productList = Array.isArray(products.data) ? products.data : [products.data];

            // 許願清單判斷
            if (this.token && this.token.userID) {
                for (const b of productList) {
                    b.content.in_wish_list =
                        (
                            await db.query(
                                `SELECT count(1)
                                 FROM \`${this.app}\`.t_post
                                 WHERE (content ->>'$.type'='wishlist')
                                   and userID = ${this.token.userID}
                                   and (content ->>'$.product_id'=${b.id})`,
                                []
                            )
                        )[0]['count(1)'] == '1';
                    b.content.id = b.id;
                }
            }

            // 售出數量計算
            const checkoutSQL = `
                SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems
                FROM \`${this.app}\`.t_checkout
                WHERE status = 1;
            `;
            const checkouts = await db.query(checkoutSQL, []);
            const itemRecord: { id: number; count: number }[] = [];

            for (const checkout of checkouts) {
                if (Array.isArray(checkout.lineItems)) {
                    for (const item1 of checkout.lineItems) {
                        const index = itemRecord.findIndex((item2) => item1.id === item2.id);
                        if (index === -1) {
                            itemRecord.push({ id: parseInt(`${item1.id}`, 10), count: item1.count });
                        } else {
                            itemRecord[index].count += item1.count;
                        }
                    }
                }
            }

            // 尋找過期訂單
            if (productList.length > 0) {
                const stockList = await db.query(
                    `SELECT *, \`${this.app}\`.t_stock_recover.id as recoverID
                     FROM \`${this.app}\`.t_stock_recover,
                          \`${this.app}\`.t_checkout
                     WHERE product_id in (${productList
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
                            // 回寫商品訂單
                            await trans.execute(
                                `UPDATE \`${this.app}\`.\`t_manager_post\`
                                 SET ?
                                 WHERE 1 = 1
                                   and id = ${stock.product_id}`,
                                [{ content: JSON.stringify(product.content) }]
                            );
                        }
                        // 移除紀錄
                        await trans.execute(
                            `DELETE
                             FROM \`${this.app}\`.t_stock_recover
                             WHERE id = ?`,
                            [stock.recoverID]
                        );
                    }
                }
                await trans.commit();
            }

            productList.map((product: ProductItem) => {
                const record = itemRecord.find((item) => item.id === product.id);
                product.total_sales = record ? record.count : 0;
                return product;
            });

            if (query.id_list && query.order_by === 'order by id desc') {
                products.data = query.id_list
                    .split(',')
                    .map((id) => {
                        return products.data.find((product: { id: number }) => {
                            return `${product.id}` === `${id}`;
                        });
                    })
                    .filter((dd) => {
                        return dd;
                    });
            }

            return products;
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }

    public async querySql(querySql: string[], query: { page: number; limit: number; id?: string; order_by?: string }) {
        let sql = `SELECT *
                   FROM \`${this.app}\`.t_manager_post
                   WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
        `;
        if (query.id) {
            const data = (
                await db.query(
                    `SELECT *
                     FROM (${sql}) as subqyery
                         limit ${query.page * query.limit}
                        , ${query.limit}`,
                    []
                )
            )[0];
            return { data: data, result: !!data };
        } else {
            return {
                data: (
                    await db.query(
                        `SELECT *
                         FROM (${sql}) as subqyery
                             limit ${query.page * query.limit}
                            , ${query.limit}`,
                        []
                    )
                ).map((dd: any) => {
                    dd.content.id = dd.id;
                    return dd;
                }),
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

    public async querySqlByVariants(
        querySql: string[],
        query: {
            page: number;
            limit: number;
            id?: string;
            order_by?: string;
        }
    ) {
        let sql = `SELECT v.id,
                          v.product_id,
                          v.content as                                            variant_content,
                          p.content as                                            product_content,
                          CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock
                   FROM \`${this.app}\`.t_variants AS v
                            JOIN
                        \`${this.app}\`.t_manager_post AS p ON v.product_id = p.id
                   WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
        `;
        if (query.id) {
            const data = (
                await db.query(
                    `SELECT *
                     FROM (${sql}) as subqyery
                         limit ${query.page * query.limit}
                        , ${query.limit}`,
                    []
                )
            )[0];
            return { data: data, result: !!data };
        } else {
            return {
                data: await db.query(
                    `SELECT *
                     FROM (${sql}) as subqyery
                         limit ${query.page * query.limit}
                        , ${query.limit}`,
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
                `DELETE
                 FROM \`${this.app}\`.t_manager_post
                 WHERE id in (?)`,
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
                `DELETE
                 FROM \`${this.app}\`.t_manager_post
                 WHERE id in (?)`,
                [query.id.split(',')]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetProduct Error:' + e, null);
        }
    }

    private generateOrderID() {
        return `${new Date().getTime()}`;
    }

    public async linePay(data: any) {
        return new Promise(async (resolve, reject) => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://sandbox-api-pay.line.me/v2/payments/oneTimeKeys/pay',
                headers: {
                    'X-LINE-ChannelId': '2006263059',
                    'X-LINE-ChannelSecret': '9bcca1d8f66b9ec60cd1a3498be253e2',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(data),
            };
            axios
                .request(config)
                .then((response) => {
                    resolve(response.data.returnCode === '0000');
                })
                .catch((error) => {
                    resolve(false);
                });
        });
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
                shipment_obj: {
                    type: string;
                    value: number;
                };
            }[];
            customer_info?: any; //顧客資訊 訂單人
            email?: string;
            return_url: string;
            user_info: any; //取貨人資訊
            code?: string;
            use_rebate?: number;
            use_wallet?: number;
            checkOutType?: 'manual' | 'auto' | 'POS';
            voucher?: any; //自定義的voucher
            discount?: number; //自定義金額
            total?: number; //自定義總額
            pay_status?: number; //自定義訂單狀態
            custom_form_format?: any; //自定義表單格式
            custom_form_data?: any; //自定義表單資料
            distribution_code?: string; //分銷連結代碼
            code_array: string[]; // 優惠券代碼列表
            give_away?: {
                "id": number,
                "spec": string[],
                "count": number,
                voucher_id:string
            }[]
        },
        type: 'add' | 'preview' | 'manual' | 'manual-preview' | 'POS' = 'add',
        replace_order_id?: string
    ) {
        console.log(`data.give_away=>`, data.give_away);
        try {
            //判斷是重新付款則取代
            if (replace_order_id) {
                const orderData = (
                    await db.query(
                        `SELECT *
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?
                           AND status = 0;`,
                        [replace_order_id]
                    )
                )[0];
                if (orderData) {
                    await db.query(
                        `DELETE
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?
                           AND status = 0;`,
                        [replace_order_id]
                    );
                    data.lineItems = orderData.orderData.lineItems;
                    data.email = orderData.email;
                    data.user_info = orderData.orderData.user_info;
                    data.code = orderData.orderData.code;
                    data.customer_info = orderData.orderData.customer_info;
                    data.use_rebate = orderData.orderData.use_rebate;
                } else {
                    throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 1 Error:Cant find this orderID.', null);
                }
            }

            const userClass = new User(this.app);
            const rebateClass = new Rebate(this.app);

            if (type !== 'preview' && !(this.token && this.token.userID) && !data.email && !(data.user_info && data.user_info.email)) {
                throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 2 Error:No email address.', null);
            }

            const userData = await (async () => {
                if (type !== 'preview' || (this.token && this.token.userID)) {
                    return this.token && this.token.userID
                        ? await userClass.getUserData(this.token.userID as any, 'userID')
                        : await userClass.getUserData(data.email! || data.user_info.email, 'account');
                    //     檢查
                } else {
                    return {};
                }
            })();

            if (userData && userData.account) {
                data.email = userData.account;
            }

            if (!data.email && type !== 'preview') {
                if (data.user_info && data.user_info.email) {
                    data.email = data.user_info.email;
                } else {
                    throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 3 Error:No email address.', null);
                }
            }

            if (!data.email && type !== 'preview') {
                throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 4 Error:No email address.', null);
            }

            // 判斷購物金是否可用
            if (data.use_rebate && data.use_rebate > 0) {
                if (userData) {
                    const userRebate = await rebateClass.getOneRebate({ user_id: userData.userID });
                    const sum = userRebate ? userRebate.point : 0;
                    if (sum < data.use_rebate) {
                        data.use_rebate = 0;
                    }
                } else {
                    data.use_rebate = 0;
                }
            }

            // 運費設定
            const shipment: ShipmentConfig = await (async () => {
                data.user_info = data.user_info || {};
                let def = (
                    (
                        await Private_config.getConfig({
                            appName: this.app,
                            key: 'glitter_shipment',
                        })
                    )[0] ?? {
                        value: {
                            volume: [],
                            weight: [],
                            selectCalc: 'volume',
                        },
                    }
                ).value;

                //參照運費設定
                const refer = (
                    (
                        await Private_config.getConfig({
                            appName: this.app,
                            key: 'glitter_shipment_' + data.user_info.shipment,
                        })
                    )[0] ?? {
                        value: {
                            volume: [],
                            weight: [],
                            selectCalc: 'def',
                        },
                    }
                ).value;

                if (refer.selectCalc !== 'def') {
                    def = refer;
                }
                return def;
            })();

            // 物流設定
            const shipment_setting: any = await new Promise(async (resolve, reject) => {
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
                        ])[0].value
                    );
                } catch (e) {
                    resolve([]);
                }
            });

            // 購物車資料
            const carData: Cart = {
                customer_info: data.customer_info || {},
                lineItems: [],
                total: 0,
                email: data.email ?? ((data.user_info && data.user_info.email) || ''),
                user_info: data.user_info,
                shipment_fee: 0,
                rebate: 0,
                use_rebate: data.use_rebate || 0,
                orderID: (data as any).orderID || this.generateOrderID(),
                shipment_support: shipment_setting.support as any,
                shipment_info: shipment_setting.info as any,
                use_wallet: 0,
                method: data.user_info && data.user_info.method,
                user_email: (userData && userData.account) || (data.email ?? ((data.user_info && data.user_info.email) || '')),
                useRebateInfo: { point: 0 },
                custom_form_format: data.custom_form_format,
                custom_form_data: data.custom_form_data,
                orderSource: data.checkOutType === 'POS' ? `POS` : ``,
                code_array: data.code_array,
                give_away: data.give_away as any,
            };

            function calculateShipment(dataList: { key: string; value: string }[], value: number | string) {
                if (value === 0) {
                    return 0;
                }
                const productValue = parseFloat(`${value}`);
                if (isNaN(productValue) || dataList.length === 0) {
                    return 0;
                }
                for (let i = 0; i < dataList.length; i++) {
                    const currentKey = parseFloat(dataList[i].key);
                    const currentValue = parseFloat(dataList[i].value);

                    if (productValue < currentKey) {
                        return i === 0 ? 0 : parseFloat(dataList[i - 1].value);
                    } else if (productValue === currentKey) {
                        return currentValue;
                    }
                }

                // 如果商品值大於所有的key，返回最後一個value
                return parseInt(dataList[dataList.length - 1].value);
            }

            const add_on_items: any[] = []
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
                            if (variant.stock < b.count && variant.show_understocking !== 'false' && type !== 'manual' && type !== 'manual-preview') {
                                b.count = variant.stock;
                            }

                            if (variant && b.count > 0) {
                                b.preview_image = variant.preview_image || pd.preview_image[0];
                                b.title = pd.title;
                                b.sale_price = variant.sale_price;
                                b.collection = pd['collection'];
                                b.sku = variant.sku;
                                b.shipment_obj = {
                                    type: variant.shipment_type,
                                    value: (() => {
                                        if (!variant.shipment_type || variant.shipment_type === 'none') {
                                            return 0;
                                        }
                                        if (variant.shipment_type === 'volume') {
                                            return b.count * variant.v_length * variant.v_width * variant.v_height;
                                        }
                                        if (variant.shipment_type === 'weight') {
                                            return b.count * variant.weight;
                                        }
                                        return 0;
                                    })(),
                                };
                                variant.shipment_weight = parseInt(variant.shipment_weight || 0);
                                carData.lineItems.push(b as any);
                                if (type !== 'manual') {
                                    carData.total += variant.sale_price * b.count;
                                }
                            }
                            // 當為結帳時則更改商品庫存數量
                            if (type !== 'preview' && type !== 'manual' && type !== 'manual-preview') {
                                const countless = variant.stock - b.count;
                                variant.stock = countless > 0 ? countless : 0;
                                await db.query(
                                    `UPDATE \`${this.app}\`.\`t_manager_post\`
                                     SET ?
                                     WHERE 1 = 1
                                       and id = ${pdDqlData.id}`,
                                    [{ content: JSON.stringify(pd) }]
                                );
                                // 獲取當前時間
                                let deadTime = new Date();
                                // 添加10分鐘
                                deadTime.setMinutes(deadTime.getMinutes() + 15);
                                // 設定15分鐘後回寫訂單庫存
                                await db.query(
                                    `INSERT INTO \`${this.app}\`.\`t_stock_recover\`
                                     set ?`,
                                    [
                                        {
                                            product_id: pdDqlData.id,
                                            spec: variant.spec.join('-'),
                                            dead_line: deadTime,
                                            order_id: carData.orderID,
                                            count: b.count,
                                        },
                                    ]
                                );
                            }
                        }
                        if (!pd.productType.product && pd.productType.addProduct) {
                            (b as any).is_add_on_items = true;
                            add_on_items.push(b);
                        }
                    }
                } catch (e) {}
            }
            carData.shipment_fee = (() => {
                let total_volume = 0;
                let total_weight = 0;
                carData.lineItems.map((item) => {
                    if (item.shipment_obj.type === 'volume') {
                        total_volume += item.shipment_obj.value;
                    }
                    if (item.shipment_obj.type === 'weight') {
                        total_weight += item.shipment_obj.value;
                    }
                });
                return calculateShipment(shipment.volume, total_volume) + calculateShipment(shipment.weight, total_weight);
            })();
            carData.total += carData.shipment_fee;
            const f_rebate = await this.formatUseRebate(carData.total, carData.use_rebate);
            carData.useRebateInfo = f_rebate;
            carData.use_rebate = f_rebate.point;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            carData.voucherList = [];

            function checkDuring(jsonData: { startDate: string; startTime: string; endDate: string | undefined; endTime: string | undefined }) {
                // 獲取當前時間
                const now = new Date();
                const currentDateTime = now.getTime();

                // 設置開始時間與結束時間
                const startDateTime = new Date(`${jsonData.startDate}T${jsonData.startTime}`).getTime();
                const endDateTime = jsonData.endDate === undefined ? true : new Date(`${jsonData.endDate}T${jsonData.endTime}`).getTime();

                // 判斷當前時間是否介於開始和結束時間之間
                return currentDateTime >= startDateTime && (endDateTime || currentDateTime <= endDateTime);
            }

            // 判斷是否有分銷連結
            if (data.distribution_code) {
                const linkList = await new Recommend(this.app, this.token).getLinkList({
                    page: 0,
                    limit: 99999,
                    code: data.distribution_code,
                    status: true,
                });
                if (linkList.data.length > 0) {
                    const content = linkList.data[0].content;
                    if (checkDuring(content)) {
                        carData.distribution_info = content;
                    }
                }
            }

            // 手動新增訂單的優惠卷設定
            if (type !== 'manual' && type !== 'manual-preview') {
                //過濾贈品
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !add_on_items.includes(dd);
                });
                //過濾加購品
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !add_on_items.includes(dd);
                });
                // 濾出可用的加購商品
                await this.checkVoucher(carData);
                add_on_items.map((dd) => {
                    try {
                        if (
                            carData.voucherList?.find((d1) => {
                                return (
                                    d1.reBackType === 'add_on_items' &&
                                    (d1.add_on_products as string[]).find((d2) => {
                                        return `${dd.id}` === `${d2}`;
                                    })
                                );
                            })
                        ) {
                            //把加購品加回去
                            carData.lineItems.push(dd);
                        }
                    } catch (e) {}
                });
                // 再次更新優惠內容
                await this.checkVoucher(carData);
                const gift_product:any[]=[];
                //過濾可選贈品
                for (const dd of carData.voucherList.filter((dd)=>{
                    return dd.reBackType==='giveaway'
                })){
                    let index=-1
                    for (const b of dd.add_on_products ?? []){
                        index++
                        const pdDqlData = ((
                            await this.getProduct({
                                page: 0,
                                limit: 50,
                                id: `${b}`,
                                status: 'active',
                            })
                        ).data ?? {content:{}}).content;
                        pdDqlData.voucher_id=dd.id;
                        (dd.add_on_products as any)[index]=pdDqlData ;
                    }
                    const addGift=data.give_away?.find((d1)=> {
                        return ((dd.add_on_products ?? []) as any).find((d2:any)=>{
                            return (`${d1.id}`===`${d2.id}`) && (`${d1.voucher_id}`===`${dd.id}`) && d2.variants.find((dd:any)=>{
                               return  dd.spec.join('')===d1.spec.join('')
                            })
                        })
                    });
                    if(addGift){
                        const gift={
                            spec:addGift.spec,
                            id:addGift.id,
                            count:1,
                            voucher_id:dd.id
                        };
                        const pd=(((dd.add_on_products ?? []) as any).find((d2:any)=>{
                            return (`${gift.id}`===`${d2.id}`) && (`${gift.voucher_id}`===`${dd.id}`)
                        }) as any)
                        pd.selected=true;
                        gift_product.push(gift);
                        (dd as any).select_gif=gift;
                        for (const b of dd.add_on_products ?? []){
                            (b as any).have_select=true
                        }
                        if(type !== 'preview'){
                            const variant:any=((pd as any).variants.find((d1:any)=>{
                                return d1.spec.join('-') === gift.spec.join('-')
                            })! ?? {})
                            carData.lineItems.push({
                                "spec": gift.spec,
                                "id": gift.id as any,
                                "count": 1,
                                "preview_image": pd.preview_image,
                                "title": `《 贈品 》 ${pd.title}`,
                                "sale_price": 0,
                                "sku": (variant as any).sku
                            } as any)
                        }
                    }else{
                        (dd as any).select_gif={}
                    }
                }
                data.give_away=gift_product
            }

            // 付款資訊設定
            const keyData = (
                await Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_finance',
                })
            )[0].value;
            (carData as any).payment_setting = {
                TYPE: keyData.TYPE,
            };
            (carData as any).off_line_support = keyData.off_line_support;
            (carData as any).payment_info_line_pay = keyData.payment_info_line_pay;
            (carData as any).payment_info_atm = keyData.payment_info_atm;

            // 防止帶入購物金時，總計小於0
            let subtotal = 0;
            carData.lineItems.map((item) => {
                subtotal += item.count * (item.sale_price - (item.discount_price ?? 0));
            });
            if (carData.total < 0 || carData.use_rebate > subtotal) {
                carData.use_rebate = 0;
                carData.total = subtotal + carData.shipment_fee;
            }

            carData.code_array = (carData.code_array || []).filter((code) => {
                return (carData.voucherList || []).find((dd) => {
                    return dd.code === code;
                });
            });
            // ================================ Preview UP ================================
            if (type === 'preview' || type === 'manual-preview') return { data: carData };
            // ================================ Add DOWN ================================

            // 手動結帳地方判定
            if (type === 'manual') {
                carData.orderSource = 'manual';
                let tempVoucher: VoucherData = {
                    discount_total: data.voucher.discount_total,
                    end_ISO_Date: '',
                    for: 'all',
                    forKey: [],
                    method: data.voucher.method,
                    overlay: false,
                    rebate_total: data.voucher.rebate_total,
                    reBackType: data.voucher.reBackType,
                    rule: 'min_price',
                    ruleValue: 0,
                    startDate: '',
                    startTime: '',
                    start_ISO_Date: '',
                    status: 1,
                    target: '',
                    targetList: [],
                    title: data.voucher.title,
                    trigger: 'auto',
                    type: 'voucher',
                    value: data.voucher.value,
                    id: data.voucher.id,
                    bind: [],
                    bind_subtotal: 0,
                    times: 1,
                    counting: 'single',
                    conditionType: 'item',
                    device: ['normal'],
                };
                carData.discount = data.discount;
                carData.voucherList = [tempVoucher];
                carData.customer_info = data.customer_info;
                carData.total = data.total ?? 0;
                carData.rebate = tempVoucher.rebate_total;
                if (tempVoucher.reBackType == 'shipment_free') {
                    carData.shipment_fee = 0;
                }

                if (tempVoucher.reBackType == 'rebate') {
                    let customerData = await userClass.getUserData(data.email! || data.user_info.email, 'account');
                    if (!customerData) {
                        // 找不到data時 新建user
                        await new User(this.app).createUser(
                            data.email!,
                            Tool.randomString(8),
                            {
                                email: data.email,
                                name: data.customer_info.name,
                                phone: data.customer_info.phone,
                            },
                            {},
                            true
                        );
                        customerData = await userClass.getUserData(data.email! || data.user_info.email, 'account');
                    }
                    if (carData.rebate !== 0) {
                        await rebateClass.insertRebate(customerData.userID, carData.rebate, `手動新增訂單 - 優惠券購物金：${tempVoucher.title}`);
                    }
                }
                // 手動訂單新增
                await db.execute(
                    `INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`,
                    [carData.orderID, data.pay_status, carData.email, carData]
                );
                return {
                    data: carData,
                };
            } else if (type === 'POS') {
                carData.orderSource = 'POS';
                const trans = await db.Transaction.build();
                if (carData.user_info.shipment === 'now') {
                    (carData as any).progress = 'finish';
                }
                await trans.execute(
                    `INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`,
                    [carData.orderID, data.pay_status, carData.email, JSON.stringify(carData)]
                );
                //開立電子發票
                (carData as any).invoice = await new Invoice(this.app).postCheckoutInvoice(carData, carData.user_info.send_type !== 'carrier');
                if (!(carData as any).invoice) {
                    throw exception.BadRequestError('BAD_REQUEST', '發票開立失敗:', null);
                }
                await trans.commit();
                await trans.release();
                return { result: 'SUCCESS', message: 'POS訂單新增成功', data: carData };
            } else {
                if (userData && userData.userID) {
                    await rebateClass.insertRebate(userData.userID, carData.use_rebate * -1, '使用折抵', {
                        order_id: carData.orderID,
                    });

                    if (carData.voucherList && carData.voucherList.length > 0) {
                        for (const voucher of carData.voucherList) {
                            await this.insertVoucherHistory(userData.userID, carData.orderID, voucher.id);
                        }
                    }
                    // 判斷錢包是否有餘額
                    const sum =
                        (
                            await db.query(
                                `SELECT sum(money)
                                 FROM \`${this.app}\`.t_wallet
                                 WHERE status in (1, 2)
                                   and userID = ?`,
                                [userData.userID]
                            )
                        )[0]['sum(money)'] || 0;
                    carData.use_wallet = sum < carData.total ? sum : carData.total;
                }
            }

            // Genetate notify redirect id
            const id = 'redirect_' + Tool.randomString(6);
            const return_url = new URL(data.return_url);
            return_url.searchParams.set('cart_token', carData.orderID);
            await redis.setValue(id, return_url.href);

            // 超商物流單建立
            const del_config = (
                await Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_delivery',
                })
            )[0]
            if (['FAMIC2C', 'UNIMARTC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(carData.user_info.LogisticsSubType) && del_config) {
                const keyData=del_config.value;
                console.log(`超商物流單 開始建立（使用${keyData.Action === 'main' ? '正式' : '測試'}環境）`);

                const delivery = await new Delivery(this.app).postStoreOrder({
                    LogisticsSubType: carData.user_info.LogisticsSubType,
                    GoodsAmount: carData.total,
                    GoodsName: `訂單編號 ${carData.orderID}`,
                    ReceiverName: carData.user_info.name,
                    ReceiverCellPhone: carData.user_info.phone,
                    ReceiverStoreID:
                        keyData.Action === 'main'
                            ? carData.user_info.CVSStoreID // 正式門市
                            : (() => {
                                  // 測試門市（萊爾富不開放測試）
                                  if (carData.user_info.LogisticsSubType === 'OKMARTC2C') {
                                      return '1328'; // OK超商
                                  }
                                  if (carData.user_info.LogisticsSubType === 'FAMIC2C') {
                                      return '006598'; // 全家
                                  }
                                  return '131386'; // 7-11
                              })(),
                });
                if (delivery.result) {
                    carData.deliveryData = delivery.data;
                    console.log('綠界物流訂單 建立成功');
                } else {
                    console.log(`綠界物流訂單 建立錯誤: ${delivery.message}`);
                }
            }

            // 當不需付款時直接寫入，並開發票
            if (carData.use_wallet === carData.total) {
                await db.query(
                    `INSERT INTO \`${this.app}\`.t_wallet (orderID, userID, money, status, note)
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
                carData.method = 'off_line';
                await db.execute(
                    `INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`,
                    [carData.orderID, 1, carData.email, carData]
                );
                if (carData.use_wallet > 0) {
                    new Invoice(this.app).postCheckoutInvoice(carData.orderID, false);
                }
                return {
                    is_free: true,
                    return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                };
            } else {
                const keyData = (
                    await Private_config.getConfig({
                        appName: this.app,
                        key: 'glitter_finance',
                    })
                )[0].value;
                // 線下付款
                if (!['ecPay', 'newWebPay'].includes(carData.customer_info.payment_select)) {
                    carData.method = 'off_line';
                    // 訂單成立信件通知
                    new ManagerNotify(this.app).checkout({
                        orderData: carData,
                        status: 0,
                    });

                    if (carData.customer_info.phone){
                        let sns = new Sns(this.app);
                        await sns.sendCustomerSns('auto-email-shipment-arrival', carData.orderID, carData.customer_info.phone);
                        console.log("訂單簡訊寄送成功")
                    }
                    await AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, carData.email);

                    await db.execute(
                        `INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                         values (?, ?, ?, ?)`,
                        [carData.orderID, 0, carData.email, carData]
                    );
                    return {
                        off_line: true,
                        return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                    };
                } else {
                    const subMitData = await new FinancialService(this.app, {
                        HASH_IV: keyData.HASH_IV,
                        HASH_KEY: keyData.HASH_KEY,
                        ActionURL: keyData.ActionURL,
                        NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`,
                        ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                        MERCHANT_ID: keyData.MERCHANT_ID,
                        TYPE: keyData.TYPE,
                    }).createOrderPage(carData);
                    return {
                        form: subMitData,
                    };
                }
            }
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 5 Error:' + e, null);
        }
    }

    public async getReturnOrder(query: {
        page: number;
        limit: number;
        id?: string;
        search?: string;
        email?: string;
        status?: string;
        searchType?: string;
        progress?: string;
        created_time?: string;
        orderString?: string;
        archived?: string;
    }) {
        try {
            let querySql = ['1=1'];
            let orderString = 'order by id desc';
            if (query.search && query.searchType) {
                switch (query.searchType) {
                    case 'order_id':
                    case 'return_order_id':
                        querySql.push(`(${query.searchType} like '%${query.search}%')`);
                        break;
                    case 'name':
                    case 'phone':
                        querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.customer_info.${query.searchType}')) LIKE ('%${query.search}%')))`);
                        break;
                    default: {
                        querySql.push(
                            `JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].${query.searchType}')) REGEXP '${query.search}'`
                        );
                    }
                }
            }

            //退貨狀態 處理中:0 退貨中:-1 已退貨:1
            if (query.progress) {
                let newArray = query.progress.split(',');
                let temp = '';
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.returnProgress')) IN (${newArray.map((status) => `"${status}"`).join(',')})`;
                querySql.push(`(${temp})`);
            }

            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (created_time BETWEEN ${db.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${db.escape(`${created_time[1]} 23:59:59`)})
                    `);
                }
            }

            if (query.orderString) {
                switch (query.orderString) {
                    case 'created_time_desc':
                        orderString = 'order by created_time desc';
                        break;
                    case 'created_time_asc':
                        orderString = 'order by created_time asc';
                        break;
                }
            }
            if (query.archived === 'true') {
                querySql.push(`(orderData->>'$.archived'="${query.archived}")`);
            } else if (query.archived === 'false') {
                querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
            }
            //退貨貨款狀態
            query.status && querySql.push(`status IN (${query.status})`);
            query.email && querySql.push(`email=${db.escape(query.email)}`);
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);

            let sql = `SELECT *
                       FROM \`${this.app}\`.t_return_order
                       WHERE ${querySql.join(' and ')} ${orderString}`;
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

    public async createReturnOrder(data: any) {
        try {
            let returnOrderID = this.generateOrderID();
            let orderID: string = data.cart_token;
            let email: string = data.email;
            return await db.execute(
                `INSERT INTO \`${this.app}\`.t_return_order (order_id, return_order_id, email, orderData)
                 values (?, ?, ?, ?)`,
                [orderID, returnOrderID, email, data.orderData]
            );
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'createReturnOrder Error:' + e, null);
        }
    }

    public async putReturnOrder(data: { id: string; orderData: any; status: any }) {
        try {
            const getData = await db.execute(
                `SELECT *
                 FROM \`${this.app}\`.t_return_order
                 WHERE id = ${data.id}
                `,
                []
            );
            if (getData[0]) {
                const origData = getData[0];

                // 當退貨單都結束後，要做的購物金、優惠和庫存處理
                if (origData.status != '1' && origData.orderData.returnProgress != '-1' && data.orderData.returnProgress == '-1' && data.status == '1') {
                    const userClass = new User(this.app);
                    const rebateClass = new Rebate(this.app);
                    const userData = await userClass.getUserData(data.orderData.customer_info.email, 'account');
                    await rebateClass.insertRebate(userData.userID, data.orderData.rebateChange, `退貨單調整-退貨單號${origData.return_order_id}`);
                }

                await db.query(
                    `UPDATE \`${this.app}\`.\`t_return_order\`
                     SET ?
                     WHERE id = ?
                    `,
                    [{ status: data.status, orderData: JSON.stringify(data.orderData) }, data.id]
                );
                return {
                    result: 'success',
                    orderData: data,
                };
            }
            return {
                result: 'failure',
                orderData: data,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'putReturnOrder Error:' + e, null);
        }
    }

    public async formatUseRebate(
        total: number,
        useRebate: number
    ): Promise<{
        point: number;
        limit?: number;
        condition?: number;
    }> {
        try {
            const getRS = await new User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' });
            if (getRS[0] && getRS[0].value) {
                const configData = getRS[0].value.config;
                if (configData.condition.type === 'total_price' && configData.condition.value > total) {
                    return {
                        point: 0,
                        condition: configData.condition.value - total,
                    };
                }
                if (configData.customize) {
                    return {
                        point: useRebate,
                    };
                } else {
                    if (configData.use_limit.type === 'price') {
                        const limit = configData.use_limit.value;
                        return {
                            point: useRebate > limit ? limit : useRebate,
                            limit,
                        };
                    }
                    if (configData.use_limit.type === 'percent') {
                        const limit = parseInt(`${(total * configData.use_limit.value) / 100}`, 10);
                        return {
                            point: useRebate > limit ? limit : useRebate,
                            limit,
                        };
                    }
                    if (configData.use_limit.type === 'none') {
                        return {
                            point: useRebate,
                        };
                    }
                }
            }
            return {
                point: useRebate,
            };
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'formatUseRebate Error:' + e, null);
        }
    }

    public async checkVoucher(cart: Cart) {
        const userClass = new User(this.app);
        cart.discount = 0;
        cart.lineItems.map((dd) => {
            dd.discount_price = 0;
            dd.rebate = 0;
        });

        function switchValidProduct(caseName: string, caseList: string[]) {
            switch (caseName) {
                case 'collection':
                    return cart.lineItems.filter((dp) => {
                        return (
                            caseList.filter((d1) => {
                                return dp.collection.find((d2) => {
                                    return d2 === d1;
                                });
                            }).length > 0
                        );
                    });
                case 'product':
                    return cart.lineItems.filter((dp) => {
                        return (
                            caseList
                                .map((d2) => {
                                    return `${d2}`;
                                })
                                .indexOf(`${dp.id}`) !== -1
                        );
                    });
                case 'all':
                    return cart.lineItems;
            }
            return [] as any;
        }

        // 確認用戶資訊
        const userData = (await userClass.getUserData(cart.email, 'account')) ?? { userID: -1 };

        // 取得顧客會員等級
        const userLevels = await userClass.getUserLevel([{ email: cart.email }]);

        // 所有優惠券
        const allVoucher: VoucherData[] = (
            await this.querySql([`(content->>'$.type'='voucher')`], {
                page: 0,
                limit: 10000,
            })
        ).data
            .map((dd: { content: VoucherData }) => {
                return dd.content;
            })
            .filter((dd: VoucherData) => {
                // 判斷有效期限
                return new Date(dd.start_ISO_Date).getTime() < new Date().getTime() && (!dd.end_ISO_Date || new Date(dd.end_ISO_Date).getTime() > new Date().getTime());
            });

        // 需 async and await 的驗證
        const pass_ids: number[] = [];
        for (const voucher of allVoucher) {
            const checkLimited = await this.checkVoucherLimited(userData.userID, voucher.id);
            if (!checkLimited) {
                continue;
            }
            pass_ids.push(voucher.id);
        }

        // 過濾可使用優惠券
        let overlay = false;
        const groupList = await userClass.getUserGroups();
        const voucherList = allVoucher
            .filter((dd) => {
                // 是否啟用與通過 await 的判斷
                return pass_ids.includes(dd.id) && dd.status === 1;
            })
            .filter((dd) => {
                // 訂單來源判斷
                if (!dd.device) {
                    return true;
                }
                if (dd.device.length === 0) {
                    return false;
                }
                switch (cart.orderSource) {
                    case '':
                    case 'manual':
                    case 'normal':
                        return dd.device.includes('normal');
                    case 'POS':
                        return dd.device.includes('pos');
                }
            })
            .filter((dd) => {
                // 判斷用戶是否為指定客群
                if (dd.target === 'customer') {
                    return dd.targetList.includes(userData.userID);
                }
                if (dd.target === 'levels') {
                    if (userLevels[0]) {
                        return dd.targetList.includes(userLevels[0].data.id);
                    }
                    return false;
                }
                if (dd.target === 'group') {
                    if (!groupList.result) {
                        return false;
                    }
                    let pass = false;
                    for (const group of groupList.data.filter((item) => dd.targetList.includes(item.type))) {
                        if (!pass && group.users.some((item) => item.userID === userData.userID)) {
                            pass = true;
                        }
                    }
                    return pass;
                }
                return true; // 所有顧客皆可使用
            })
            .filter((dd) => {
                dd.bind = [];
                // 判斷符合商品類型
                switch (dd.trigger) {
                    case 'auto': // 自動填入
                        dd.bind = switchValidProduct(dd.for, dd.forKey);
                        break;
                    case 'code': // 輸入代碼
                        if (dd.code === `${cart.code}` || (cart.code_array || []).includes(`${dd.code}`)) {
                            dd.bind = switchValidProduct(dd.for, dd.forKey);
                        }
                        break;
                    case 'distribution': // 分銷優惠
                        if (cart.distribution_info && cart.distribution_info.voucher === dd.id) {
                            dd.bind = switchValidProduct(cart.distribution_info.relative, cart.distribution_info.relative_data);
                        }
                        break;
                }
                return dd.bind.length > 0;
            })
            .filter((dd) => {
                // 購物車是否達到優惠條件，與計算優惠觸發次數
                dd.times = 0;
                dd.bind_subtotal = 0;

                const ruleValue = parseInt(`${dd.ruleValue}`, 10);

                if (dd.conditionType === 'order') {
                    let cartValue = 0;
                    dd.bind.map((item) => {
                        dd.bind_subtotal += item.count * item.sale_price;
                    });
                    if (dd.rule === 'min_price') {
                        cartValue = dd.bind_subtotal;
                    }
                    if (dd.rule === 'min_count') {
                        dd.bind.map((item) => {
                            cartValue += item.count;
                        });
                    }
                    if (dd.reBackType === 'shipment_free') {
                        return cartValue >= ruleValue; // 回傳免運費判斷
                    }
                    if (cartValue >= ruleValue) {
                        if (dd.counting === 'each') {
                            dd.times = Math.floor(cartValue / ruleValue);
                        }
                        if (dd.counting === 'single') {
                            dd.times = 1;
                        }
                    }
                    // 單位為訂單的優惠觸發
                    return dd.times > 0;
                }

                if (dd.conditionType === 'item') {
                    if (dd.rule === 'min_price') {
                        dd.bind = dd.bind.filter((item) => {
                            item.times = 0;
                            if (item.count * item.sale_price >= ruleValue) {
                                if (dd.counting === 'each') {
                                    item.times = Math.floor((item.count * item.sale_price) / ruleValue);
                                }
                                if (dd.counting === 'single') {
                                    item.times = 1;
                                }
                            }
                            return item.times > 0;
                        });
                    }
                    if (dd.rule === 'min_count') {
                        dd.bind = dd.bind.filter((item) => {
                            item.times = 0;
                            if (item.count >= ruleValue) {
                                if (dd.counting === 'each') {
                                    item.times = Math.floor(item.count / ruleValue);
                                }
                                if (dd.counting === 'single') {
                                    item.times = 1;
                                }
                            }
                            return item.times > 0;
                        });
                    }
                    // 計算單位為商品的優惠觸發
                    return dd.bind.reduce((acc, item) => acc + item.times, 0) > 0;
                }

                return false;
            })
            .sort(function (a: VoucherData, b: VoucherData) {
                // 排序折扣金額
                let compareB = b.bind
                    .map((dd) => {
                        return b.method === 'percent' ? (dd.sale_price * parseFloat(b.value)) / 100 : parseFloat(b.value);
                    })
                    .reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue;
                    }, 0);
                let compareA = a.bind
                    .map((dd) => {
                        return a.method === 'percent' ? (dd.sale_price * parseFloat(a.value)) / 100 : parseFloat(a.value);
                    })
                    .reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue;
                    }, 0);
                return compareB - compareA;
            })
            .filter((dd) => {
                // 是否可疊加
                if (!overlay && !dd.overlay) {
                    overlay = true;
                    return true;
                }
                return dd.overlay;
            })
            .filter((dd) => {
                dd.discount_total = dd.discount_total ?? 0;
                dd.rebate_total = dd.rebate_total ?? 0;

                if (dd.reBackType === 'shipment_free') {
                    return true;
                }

                const disValue = dd.method === 'percent' ? parseFloat(dd.value) / 100 : parseFloat(dd.value);

                if (dd.conditionType === 'order') {
                    if (dd.method === 'fixed') {
                        dd.discount_total = disValue * dd.times;
                    }
                    if (dd.method === 'percent') {
                        dd.discount_total = dd.bind_subtotal * disValue;
                    }
                    if (dd.bind_subtotal >= dd.discount_total) {
                        let remain = parseInt(`${dd.discount_total}`, 10);
                        dd.bind.map((d2, index) => {
                            let discount = 0;
                            if (index === dd.bind.length - 1) {
                                discount = remain;
                            } else {
                                discount = Math.floor(remain * ((d2.sale_price * d2.count) / dd.bind_subtotal));
                            }
                            if (discount > 0 && discount <= d2.sale_price * d2.count) {
                                // 計算單位為訂單，優惠發放
                                if (dd.reBackType === 'rebate') {
                                    d2.rebate += discount / d2.count;
                                    cart.rebate! += discount;
                                    dd.rebate_total += discount;
                                } else {
                                    d2.discount_price += discount / d2.count;
                                    cart.discount! += discount;
                                    dd.discount_total += discount;
                                }
                            }
                            if (remain - discount > 0) {
                                remain -= discount;
                            } else {
                                remain = 0;
                            }
                        });
                        return true;
                    }
                    return false;
                }

                if (dd.conditionType === 'item') {
                    if (dd.method === 'fixed') {
                        dd.bind = dd.bind.filter((d2) => {
                            const discount = disValue * d2.times;
                            if (discount <= d2.sale_price * d2.count) {
                                // 計算單位為商品，固定折扣的優惠發放
                                if (dd.reBackType === 'rebate') {
                                    d2.rebate += discount / d2.count;
                                    cart.rebate! += discount;
                                    dd.rebate_total += discount;
                                } else {
                                    d2.discount_price += discount / d2.count;
                                    cart.discount! += discount;
                                    dd.discount_total += discount;
                                }
                                return true;
                            }
                            return false;
                        });
                    }
                    if (dd.method === 'percent') {
                        dd.bind = dd.bind.filter((d2) => {
                            const discount = Math.floor(d2.sale_price * d2.count * disValue);
                            if (discount <= d2.sale_price * d2.count) {
                                // 計算單位為商品，百分比折扣的優惠發放
                                if (dd.reBackType === 'rebate') {
                                    d2.rebate += discount / d2.count;
                                    cart.rebate! += discount;
                                    dd.rebate_total += discount;
                                } else {
                                    d2.discount_price += discount / d2.count;
                                    cart.discount! += discount;
                                    dd.discount_total += discount;
                                }
                                return true;
                            }
                            return false;
                        });
                    }
                }

                return dd.bind.length > 0;
            });

        // 判斷優惠碼無效
        if (!voucherList.find((d2: VoucherData) => d2.code === `${cart.code}`)) {
            cart.code = undefined;
        }

        // 如果有折扣運費，刪除基本運費
        if (voucherList.find((d2: VoucherData) => d2.reBackType === 'shipment_free')) {
            cart.total -= cart.shipment_fee;
            cart.shipment_fee = 0;
        }

        // 回傳折扣後總金額與優惠券陣列
        cart.total -= cart.discount;
        cart.voucherList = voucherList;
    }

    public async putOrder(data: { id: string; orderData: any; status: any }) {
        try {
            const update: any = {};
            if (data.status !== undefined) {
                update.status = data.status;
            }
            if (data.orderData) {
                update.orderData = JSON.stringify(data.orderData);
            }

            const origin = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE id = ?;
                `,
                [data.id]
            );

            if (update.orderData && JSON.parse(update.orderData)) {
                // 商品出貨信件通知（消費者）
                let sns = new Sns(this.app);
                const updateProgress = JSON.parse(update.orderData).progress;
                if (origin[0].orderData.progress !== 'shipping' && updateProgress === 'shipping') {
                    if (data.orderData.customer_info.phone){
                        await sns.sendCustomerSns('auto-sns-shipment', data.orderData.orderID, data.orderData.customer_info.phone);
                        console.log("出貨簡訊寄送成功")
                    }
                    await AutoSendEmail.customerOrder(this.app, 'auto-email-shipment', data.orderData.orderID, data.orderData.email);
                }

                // 商品到貨信件通知（消費者）
                if (origin[0].orderData.progress !== 'arrived' && updateProgress === 'arrived') {

                    if (data.orderData.customer_info.phone){
                        await sns.sendCustomerSns('auto-email-shipment-arrival', data.orderData.orderID, data.orderData.customer_info.phone);
                        console.log("到貨簡訊寄送成功")
                    }
                    await AutoSendEmail.customerOrder(this.app, 'auto-email-shipment-arrival', data.orderData.orderID, data.orderData.email);
                    // await sns.sendCustomerSns('auto-email-shipment-arrival', data.orderData.orderID, data.orderData.email);

                }
                if (origin[0].status !== 1 && update.status === 1) {
                    await this.releaseCheckout(1, data.orderData.orderID);
                }
            }

            await db.query(
                `UPDATE \`${this.app}\`.t_checkout
                 SET ?
                 WHERE id = ?
                `,
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
                `DELETE
                 FROM \`${this.app}\`.t_checkout
                 WHERE id in (?)`,
                [req.id.split(',')]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'deleteOrder Error:' + e, null);
        }
    }

    public async proofPurchase(order_id: string, text: string) {
        try {
            const orderData = (
                await db.query(
                    `select orderData
                     from \`${this.app}\`.t_checkout
                     where cart_token = ?`,
                    [order_id]
                )
            )[0]['orderData'];
            orderData.proof_purchase = text;

            // 訂單待核款信件通知
            new ManagerNotify(this.app).uploadProof({ orderData: orderData });
            await AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, orderData.email);

            if (orderData.customer_info.phone){
                let sns = new Sns(this.app);
                await sns.sendCustomerSns('auto-email-shipment-arrival', order_id, orderData.customer_info.phone);
                console.log("訂單待核款簡訊寄送成功")
            }
            await db.query(
                `update \`${this.app}\`.t_checkout
                 set orderData=?
                 where cart_token = ?`,
                [JSON.stringify(orderData), order_id]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'ProofPurchase Error:' + e, null);
        }
    }

    public async getCheckOut(query: {
        filter_type?: string;
        page: number;
        limit: number;
        is_pos?: string;
        id?: string;
        search?: string;
        email?: string;
        status?: string;
        searchType?: string;
        shipment?: string;
        progress?: string;
        orderStatus?: string;
        created_time?: string;
        orderString?: string;
        archived?: string;
        returnSearch?: string;
    }) {
        try {
            let querySql = ['1=1'];
            let orderString = 'order by id desc';

            if (query.search && query.searchType) {
                switch (query.searchType) {
                    case 'cart_token':
                        querySql.push(`(cart_token like '%${query.search}%')`);
                        break;
                    case 'name':
                    case 'invoice_number':
                    case 'phone':
                        querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.${query.searchType}')) LIKE ('%${query.search}%')))`);
                        break;
                    default: {
                        querySql.push(
                            `JSON_CONTAINS_PATH(orderData, 'one', '$.lineItems[*].title') AND JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.lineItems[*].${query.searchType}')) REGEXP '${query.search}'`
                        );
                    }
                }
            }

            if (query.orderStatus) {
                let orderArray = query.orderStatus.split(',');
                let temp = '';
                if (orderArray.includes('0')) {
                    temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IS NULL OR ";
                }
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IN (${query.orderStatus})`;
                querySql.push(`(${temp})`);
            }

            if (query.progress) {
                let newArray = query.progress.split(',');
                let temp = '';
                if (newArray.includes('wait')) {
                    temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.progress')) IS NULL OR ";
                }
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.progress')) IN (${newArray.map((status) => `"${status}"`).join(',')})`;
                querySql.push(`(${temp})`);
            }

            if (query.is_pos === 'true') {
                querySql.push(`orderData->>'$.orderSource'='POS'`);
            } else if (query.is_pos === 'false') {
                querySql.push(`orderData->>'$.orderSource'<>'POS'`);
            }

            if (query.shipment) {
                let shipment = query.shipment.split(',');
                let temp = '';
                if (shipment.includes('normal')) {
                    temp += "JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.shipment')) IS NULL OR ";
                }
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.user_info.shipment')) IN (${shipment.map((status) => `"${status}"`).join(',')})`;
                querySql.push(`(${temp})`);
            }

            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (created_time BETWEEN ${db.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${db.escape(`${created_time[1]} 23:59:59`)})
                    `);
                }
            }

            if (query.orderString) {
                switch (query.orderString) {
                    case 'created_time_desc':
                        orderString = 'order by created_time desc';
                        break;
                    case 'created_time_asc':
                        orderString = 'order by created_time asc';
                        break;
                    case 'order_total_desc':
                        orderString = "order by CAST(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.total')) AS SIGNED) desc";
                        break;
                    case 'order_total_asc':
                        orderString = "order by CAST(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.total')) AS SIGNED) asc";
                        break;
                }
            }

            query.status && querySql.push(`status IN (${query.status})`);
            query.email && querySql.push(`email=${db.escape(query.email)}`);
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);

            if (query.filter_type === 'true' || query.archived) {
                if (query.archived === 'true') {
                    querySql.push(`(orderData->>'$.archived'="${query.archived}")`);
                } else {
                    querySql.push(`((orderData->>'$.archived'="${query.archived}") or (orderData->>'$.archived' is null))`);
                }
            } else if (query.filter_type === 'normal') {
                querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
            }

            let sql = `SELECT *
                       FROM \`${this.app}\`.t_checkout
                       WHERE ${querySql.join(' and ')} ${orderString}`;
            if (query.returnSearch == 'true') {
                const data = await db.query(
                    `SELECT *
                     FROM \`${this.app}\`.t_checkout
                     WHERE cart_token = ${query.search}`,
                    []
                );

                let returnSql = `SELECT *
                                 FROM \`${this.app}\`.t_return_order
                                 WHERE order_id = ${query.search}`;

                let returnData = await db.query(returnSql, []);
                if (returnData.length > 0) {
                    returnData.forEach((returnOrder: any) => {
                        // todo 確認訂單是否被作廢
                        if (!data[0].orderData?.discard) {
                        }
                        data[0].orderData.lineItems.map((lineItem: any, index: number) => {
                            lineItem.count = lineItem.count - returnOrder.orderData.lineItems[index].return_count;
                        });
                        data[0].orderData.shipment_fee -= returnOrder.orderData.shipment_fee;
                    });
                    data[0].orderData.lineItems = data[0].orderData.lineItems.filter((dd: any) => {
                        return dd.count > 0;
                    });
                }
                return data[0];
            }

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

    public async releaseCheckout(status: 1 | 0 | -1, order_id: string) {
        try {
            if (status === -1) {
                await db.execute(
                    `UPDATE \`${this.app}\`.t_checkout
                     SET status = ?
                     WHERE cart_token = ?`,
                    [-1, order_id]
                );
                await this.releaseVoucherHistory(order_id, 0);
            }

            if (status === 1) {
                const notProgress = (
                    await db.query(
                        `SELECT count(1)
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?
                           AND status = 0;`,
                        [order_id]
                    )
                )[0]['count(1)'];

                if (!notProgress) {
                    return;
                }

                await db.execute(
                    `UPDATE \`${this.app}\`.t_checkout
                     SET status = ?
                     WHERE cart_token = ?`,
                    [1, order_id]
                );

                const cartData = (
                    await db.query(
                        `SELECT *
                         FROM \`${this.app}\`.t_checkout
                         WHERE cart_token = ?;`,
                        [order_id]
                    )
                )[0];

                // 訂單已付款信件通知（管理員, 消費者）
                new ManagerNotify(this.app).checkout({
                    orderData: cartData.orderData,
                    status: status,
                });

                await AutoSendEmail.customerOrder(this.app, 'auto-email-payment-successful', order_id, cartData.email);

                const userData = await new User(this.app).getUserData(cartData.email, 'account');
                if (userData && cartData.orderData.rebate > 0) {
                    const rebateClass = new Rebate(this.app);
                    for (let i = 0; i < cartData.orderData.voucherList.length; i++) {
                        const orderVoucher = cartData.orderData.voucherList[i];

                        const voucherRow = await db.query(
                            `SELECT *
                             FROM \`${this.app}\`.t_manager_post
                             WHERE JSON_EXTRACT(content, '$.type') = 'voucher'
                               AND id = ?;`,
                            [orderVoucher.id]
                        );

                        if (voucherRow[0]) {
                            for (const item of orderVoucher.bind) {
                                const useCheck = await rebateClass.canUseRebate(userData.userID, 'voucher', {
                                    voucher_id: orderVoucher.id,
                                    order_id: order_id,
                                    sku: item.sku,
                                    quantity: item.count,
                                });
                                if (item.rebate > 0 && useCheck?.result) {
                                    const content = voucherRow[0].content;
                                    if (item.rebate * item.count !== 0) {
                                        await rebateClass.insertRebate(userData.userID, item.rebate * item.count, `優惠券購物金：${content.title}`, {
                                            voucher_id: orderVoucher.id,
                                            order_id: order_id,
                                            sku: item.sku,
                                            quantity: item.count,
                                            deadTime: content.rebateEndDay ? moment().add(content.rebateEndDay, 'd').format('YYYY-MM-DD HH:mm:ss') : undefined,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                if (cartData.orderData.voucherList && cartData.orderData.voucherList.length > 0) {
                    await this.releaseVoucherHistory(order_id, 1);
                }

                try {
                    await new CustomCode(this.app).checkOutHook({ userData, cartData });
                } catch (e) {
                    console.error(e);
                }
                new Invoice(this.app).postCheckoutInvoice(order_id, false);
            }
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'Release Checkout Error:' + e, null);
        }
    }

    public async checkVoucherLimited(user_id: number, voucher_id: number): Promise<boolean> {
        try {
            const vouchers = await db.query(
                `SELECT id,
                        JSON_EXTRACT(content, '$.macroLimited') AS macroLimited,
                        JSON_EXTRACT(content, '$.microLimited') AS microLimited
                 FROM \`${this.app}\`.t_manager_post
                 WHERE id = ?;`,
                [voucher_id]
            );
            if (!vouchers[0]) {
                return false;
            }
            if (vouchers[0].macroLimited === 0 && vouchers[0].microLimited === 0) {
                return true;
            }
            const history = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_voucher_history
                 WHERE voucher_id = ?
                   AND status in (1, 2);`,
                [voucher_id]
            );
            if (vouchers[0].macroLimited > 0 && history.length >= vouchers[0].macroLimited) {
                return false;
            }
            if (
                vouchers[0].microLimited > 0 &&
                history.filter((item: { user_id: number }) => {
                    return item.user_id === user_id;
                }).length >= vouchers[0].microLimited
            ) {
                return false;
            }
            return true;
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'checkVoucherHistory Error:' + e, null);
        }
    }

    public async insertVoucherHistory(user_id: number, order_id: string, voucher_id: number) {
        try {
            await db.query(
                `INSERT INTO \`${this.app}\`.\`t_voucher_history\`
                 set ?`,
                [
                    {
                        user_id,
                        order_id,
                        voucher_id,
                        created_at: new Date(),
                        updated_at: new Date(),
                        status: 2,
                    },
                ]
            );
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + e, null);
        }
    }

    public async releaseVoucherHistory(order_id: string, status: 1 | 0) {
        try {
            await db.query(
                `UPDATE \`${this.app}\`.t_voucher_history
                 SET status = ?
                 WHERE order_id = ?;`,
                [status, order_id]
            );
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + e, null);
        }
    }

    public async resetVoucherHistory() {
        try {
            const resetMins = 10;
            const now = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
            await db.query(
                `
                    UPDATE \`${this.app}\`.t_voucher_history
                    SET status = 0
                    WHERE status = 2
                      AND updated_at < DATE_SUB('${now}', INTERVAL ${resetMins} MINUTE);`,
                []
            );
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'insertVoucherHistory Error:' + e, null);
        }
    }

    public async postVariantsAndPriceValue(content: any) {
        content.variants = content.variants ?? [];
        content.min_price = undefined;
        content.max_price = undefined;
        content.id &&
            (await db.query(
                `DELETE
             from \`${this.app}\`.t_variants
             WHERE (product_id = ${content.id})
               and id > 0`,
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
                `INSERT INTO \`${this.app}\`.t_variants
                 SET ?`,
                [
                    {
                        content: JSON.stringify(a),
                        product_id: content.id,
                    },
                ]
            );
        }
        await db.query(
            `update \`${this.app}\`.\`t_manager_post\`
             SET ?
             where id = ?
            `,
            [
                {
                    content: JSON.stringify(content),
                },
                content.id,
            ]
        );
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
                            result[tag] = await this.getHotProducts('month');
                            break;
                        case 'hot_products_today':
                            result[tag] = await this.getHotProducts('day');
                            break;
                        case 'order_avg_sale_price':
                            result[tag] = await this.getOrderAvgSalePrice();
                            break;
                        case 'orders_per_month_1_year':
                            result[tag] = await this.getOrdersPerMonth1Year();
                            break;
                        case 'sales_per_month_1_year':
                            result[tag] = await this.getSalesPerMonth1Year();
                            break;
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
            const order = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE DATE (created_time) = CURDATE()`,
                []
            );
            return {
                //訂單總數
                total_count: order.filter((dd: any) => {
                    return dd.status === 1;
                }).length,
                //未出貨訂單
                un_shipment: (
                    await db.query(
                        `SELECT count(1)
                         from \`${this.app}\`.t_checkout
                         WHERE (orderData ->> '$.progress' is null || orderData ->> '$.progress' = 'wait')
                           and status = 1`,
                        []
                    )
                )[0]['count(1)'],
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
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e, null);
        }
    }

    async getRecentActiveUser() {
        try {
            const recentSQL = `
                SELECT *
                FROM \`${this.app}\`.t_user
                WHERE online_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND NOW();
            `;
            const recent_users = await db.query(recentSQL, []);
            const monthSQL = `
                SELECT *
                FROM \`${this.app}\`.t_user
                WHERE MONTH (online_time) = MONTH (NOW()) AND YEAR (online_time) = YEAR (NOW());
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
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE MONTH (created_time) = MONTH (NOW()) AND YEAR (created_time) = YEAR (NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await db.query(recentMonthSQL, []);
            let recent_month_total = 0;
            recentMonthCheckouts.map((checkout: any) => {
                recent_month_total += parseInt(checkout.orderData.total, 10);
            });

            const previousMonthSQL = `
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE
                    MONTH (created_time) = MONTH (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                  AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
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

    async getHotProducts(duration: 'month' | 'day') {
        try {
            const checkoutSQL = `
                SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems
                FROM \`${this.app}\`.t_checkout
                WHERE status = 1
                  AND ${
                      duration === 'day' ? `created_time BETWEEN  CURDATE() AND CURDATE() + INTERVAL 1 DAY - INTERVAL 1 SECOND` : `(created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW())`
                  };
            `;
            const checkouts = await db.query(checkoutSQL, []);
            const series = [];
            const categories = [];
            const product_list: { title: string; count: number }[] = [];

            for (const checkout of checkouts) {
                if (Array.isArray(checkout.lineItems)) {
                    for (const item1 of checkout.lineItems) {
                        const index = product_list.findIndex((item2) => item1.title === item2.title);
                        if (index === -1) {
                            product_list.push({ title: item1.title, count: item1.count });
                        } else {
                            product_list[index].count += item1.count;
                        }
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
                SELECT id
                FROM \`${this.app}\`.t_checkout
                WHERE MONTH (created_time) = MONTH (NOW()) AND YEAR (created_time) = YEAR (NOW()) AND status = 1;
            `;
            const recentMonthCheckouts = await db.query(recentMonthSQL, []);
            let recent_month_total = recentMonthCheckouts.length;

            const previousMonthSQL = `
                SELECT id
                FROM \`${this.app}\`.t_checkout
                WHERE
                    MONTH (created_time) = MONTH (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
                  AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                    , INTERVAL 1 MONTH))
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
                    SELECT count(id) as c
                    FROM \`${this.app}\`.t_checkout
                    WHERE
                        MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
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
                    SELECT orderData
                    FROM \`${this.app}\`.t_checkout
                    WHERE
                        MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} MONTH))
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
                    SELECT orderData
                    FROM \`${this.app}\`.t_checkout
                    WHERE
                        DAY (created_time) = DAY (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND MONTH (created_time) = MONTH (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
                      AND YEAR (created_time) = YEAR (DATE_SUB(NOW()
                        , INTERVAL ${index} DAY))
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
            const products_sql = `SELECT *
                                  FROM \`${this.app}\`.t_manager_post
                                  WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await db.query(products_sql, []);
            return products.filter((product: any) => product.content.collection.includes(tag));
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }

    async putCollection(replace: Collection, original: Collection) {
        try {
            const config =
                (
                    await db.query(
                        `SELECT *
                         FROM \`${this.app}\`.public_config
                         WHERE \`key\` = 'collection';`,
                        []
                    )
                )[0] ?? {};
            config.value = config.value || [];

            if (replace.parentTitles[0] === '(無)') {
                replace.parentTitles = [];
            }

            // 標題禁止空白格與指定符號
            replace.title = replace.title.replace(/[\s,\/\\]+/g, '');

            if (replace.parentTitles.length > 0) {
                // 子類別驗證
                const oTitle = original.parentTitles[0] ?? '';
                const rTitle = replace.parentTitles[0];
                if (!(replace.title === original.title && rTitle === oTitle)) {
                    const parent = config.value.find((col: { title: string }) => col.title === rTitle);
                    const children = parent.array.find((chi: { title: string }) => chi.title === replace.title);
                    if (children) {
                        return {
                            result: false,
                            message: `上層分類「${parent.title}」已存在「${children.title}」類別名稱`,
                        };
                    }
                }
            } else {
                // 父類別驗證
                if (replace.title !== original.title) {
                    const parent = config.value.find((col: { title: string }) => col.title === replace.title);
                    if (parent) {
                        return {
                            result: false,
                            message: `上層分類已存在「${parent.title}」類別名稱`,
                        };
                    }
                }
            }

            // 判斷是否有重複使用的代號
            function findCodePath(items: Collection[], inputCode: string, path: Collection[] = []): Collection[] {
                for (const item of items) {
                    const currentPath = [...path, item]; // 儲存目前的路徑

                    if (item.code === inputCode) {
                        return currentPath; // 找到匹配的 code，返回整個路徑
                    }

                    // 遞迴檢查子層的 array
                    if (item.array.length > 0) {
                        const result = findCodePath(item.array, inputCode, currentPath);
                        if (result.length > 0) {
                            return result; // 如果找到結果，返回該路徑
                        }
                    }
                }
                return []; // 如果沒有匹配的 code，返回空陣列
            }

            let isUsedCode = false;
            const codeResult = findCodePath(config.value, replace.code);
            if (codeResult.length === 1) {
                isUsedCode = codeResult[0].title !== original.title;
            }
            if (codeResult.length === 2) {
                isUsedCode = codeResult[0].title !== original.parentTitles[0] || codeResult[1].title !== original.title;
            }
            if (isUsedCode) {
                return {
                    result: false,
                    message: `類別代號「${replace.code}」已被使用`,
                };
            }

            const formatData = {
                array: [],
                code: replace.code,
                title: replace.title,
                seo_title: replace.seo_title,
                seo_content: replace.seo_content,
                seo_image: replace.seo_image,
            };

            if (original.title.length === 0) {
                const parentIndex = config.value.findIndex((col: { title: string }) => {
                    return col.title === replace.parentTitles[0];
                });
                if (parentIndex === -1) {
                    // 新增父層類別
                    config.value.push(formatData);
                } else {
                    // 新增子層類別
                    config.value[parentIndex].array.push(formatData);
                }
            } else if (replace.parentTitles.length === 0) {
                // 編輯父層類別
                const parentIndex = config.value.findIndex((col: { title: string }) => {
                    return col.title === original.title;
                });
                config.value[parentIndex] = {
                    ...formatData,
                    array: replace.subCollections.map((col) => {
                        const sub = config.value[parentIndex].array.find((item: { title: string }) => {
                            return item.title === col;
                        });
                        return { array: [], title: col, code: sub ? sub.code : '' };
                    }),
                };
            } else {
                const oTitle = original.parentTitles[0] ?? '';
                const rTitle = replace.parentTitles[0];
                const originParentIndex = config.value.findIndex((col: { title: string }) => col.title === oTitle);
                const replaceParentIndex = config.value.findIndex((col: { title: string }) => col.title === rTitle);
                const childrenIndex = config.value[originParentIndex].array.findIndex((chi: { title: string }) => {
                    return chi.title === original.title;
                });
                if (originParentIndex === replaceParentIndex) {
                    // 編輯子層類別，沒有調整父層
                    config.value[originParentIndex].array[childrenIndex] = formatData;
                } else {
                    // 編輯子層類別，有調整父層
                    config.value[originParentIndex].array.splice(childrenIndex, 1);
                    config.value[replaceParentIndex].array.push(formatData);
                }
            }

            // 更新父層的子類別
            if (original.parentTitles[0]) {
                const filter_childrens = original.subCollections.filter((child) => {
                    return replace.subCollections.findIndex((child2) => child2 === child) === -1;
                });
                await this.deleteCollectionProduct(original.title, filter_childrens);
            }

            // 類別刪除產品
            if (original.title.length > 0) {
                const delete_id_list = (original.product_id ?? []).filter((oid) => {
                    return (replace.product_id ?? []).findIndex((rid) => rid === oid) === -1;
                });
                if (delete_id_list.length > 0) {
                    const products_sql = `SELECT *
                                          FROM \`${this.app}\`.t_manager_post
                                          WHERE id in (${delete_id_list.join(',')});`;
                    const delete_product_list = await db.query(products_sql, []);
                    for (const product of delete_product_list) {
                        product.content.collection = product.content.collection.filter((str: string) => {
                            if (original.parentTitles[0]) {
                                return str !== `${original.parentTitles[0]} / ${original.title}`;
                            } else {
                                return !(str.includes(`${original.title} /`) || str === `${original.title}`);
                            }
                        });
                        await this.updateProductCollection(product.content, product.id);
                    }
                }
            }

            // 更新類別下商品
            const get_product_sql = `SELECT *
                                     FROM \`${this.app}\`.t_manager_post
                                     WHERE id = ?`;
            for (const id of replace.product_id ?? []) {
                const get_product = await db.query(get_product_sql, [id]);
                if (get_product[0]) {
                    const product = get_product[0];
                    const originalParentTitles = original.parentTitles[0] ?? '';
                    const replaceParentTitles = replace.parentTitles[0] ?? '';

                    if (original.title.length > 0) {
                        product.content.collection = product.content.collection
                            .filter((str: string) => {
                                if (originalParentTitles === replaceParentTitles) {
                                    return true;
                                }
                                if (replaceParentTitles) {
                                    if (str === originalParentTitles || str.includes(`${originalParentTitles} / ${original.title}`)) {
                                        return false;
                                    }
                                } else {
                                    if (str === original.title || str.includes(`${original.title} /`)) {
                                        return false;
                                    }
                                }
                                return true;
                            })
                            .map((str: string) => {
                                if (replaceParentTitles) {
                                    if (str.includes(`${originalParentTitles} / ${original.title}`)) {
                                        return str.replace(original.title, replace.title);
                                    }
                                } else {
                                    if (str === original.title || str.includes(`${original.title} /`)) {
                                        return str.replace(original.title, replace.title);
                                    }
                                }
                                return str;
                            });
                    }

                    if (replaceParentTitles === '') {
                        product.content.collection.push(replace.title);
                    } else {
                        product.content.collection.push(replaceParentTitles);
                        product.content.collection.push(`${replaceParentTitles} / ${replace.title}`);
                    }

                    product.content.collection = [...new Set(product.content.collection)];

                    await this.updateProductCollection(product.content, product.id);
                }
            }

            // 更新商品類別 config
            const update_col_sql = `UPDATE \`${this.app}\`.public_config
                                    SET value = ?
                                    WHERE \`key\` = 'collection';`;
            await db.execute(update_col_sql, [config.value]);

            return { result: true };
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'putCollection Error:' + e, null);
        }
    }

    async sortCollection(data: Collection[]) {
        try {
            if (data && data[0]) {
                const parentTitle = data[0].parentTitles[0] ?? '';
                const config =
                    (
                        await db.query(
                            `SELECT *
                             FROM \`${this.app}\`.public_config
                             WHERE \`key\` = 'collection';`,
                            []
                        )
                    )[0] ?? {};
                config.value = config.value || [];

                if (parentTitle === '') {
                    config.value = data.map((item) => {
                        return config.value.find((conf: { title: string }) => conf.title === item.title);
                    });
                } else {
                    const index = config.value.findIndex((conf: { title: string }) => conf.title === parentTitle);

                    const sortList = data.map((item) => {
                        if (index > -1) {
                            return config.value[index].array.find((conf: { title: string }) => conf.title === item.title);
                        }
                        return { title: '', array: [], code: '' };
                    });

                    config.value[index].array = sortList;
                }

                await db.execute(
                    `UPDATE \`${this.app}\`.public_config
                     SET value = ?
                     WHERE \`key\` = 'collection';
                    `,
                    [config.value]
                );
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'sortCollection Error:' + e, null);
        }
    }

    checkVariantDataType(variants: any[]) {
        variants.map((dd) => {
            dd.stock && (dd.stock = parseInt(dd.stock, 10));
            dd.product_id && (dd.product_id = parseInt(dd.product_id, 10));
            dd.sale_price && (dd.sale_price = parseInt(dd.sale_price, 10));
            dd.compare_price && (dd.compare_price = parseInt(dd.compare_price, 10));
            dd.shipment_weight && (dd.shipment_weight = parseInt(dd.shipment_weight, 10));
        });
    }

    async postProduct(content: any) {
        try {
            content.type = 'product';
            this.checkVariantDataType(content.variants);
            const data = await db.query(
                `INSERT INTO \`${this.app}\`.\`t_manager_post\`
                 SET ?
                `,
                [
                    {
                        userID: this.token?.userID,
                        content: JSON.stringify(content),
                    },
                ]
            );
            content.id = data.insertId;
            await db.query(
                `update \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 where id = ?
                `,
                [
                    {
                        content: JSON.stringify(content),
                    },
                    content.id,
                ]
            );
            await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
            return data.insertId;
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'postProduct Error:' + e, null);
        }
    }

    async updateCollectionFromUpdateProduct(collection: string[]) {
        //有新類別要處理
        let config =
            (
                await db.query(
                    `SELECT *
                     FROM \`${this.app}\`.public_config
                     WHERE \`key\` = 'collection';`,
                    []
                )
            )[0] ?? {};
        config.value = config.value || [];

        function findRepeatCollection(data: any, fatherTitle: string = '') {
            let returnArray = [`${fatherTitle ? `${fatherTitle}/` : ``}${data.title}`];
            let t = [1, 2, 3];
            if (data.array && data.array.length > 0) {
                data.array.forEach((item: any) => {
                    returnArray.push(...findRepeatCollection(item, data.title));
                });
            }
            return returnArray;
        }

        let stillCollection: any[] = [];
        config.value.forEach((collection: any) => {
            stillCollection.push(...findRepeatCollection(collection));
        });
        const nonCommonElements = collection.filter((item: string) => !stillCollection.includes(item));
        type CategoryNode = {
            title: string;
            array: CategoryNode[];
        };

        function addCategory(nodes: CategoryNode[], levels: string[]): void {
            if (levels.length === 0) return;
            const title = levels[0];
            let node = nodes.find((n) => n.title === title);
            if (!node) {
                node = { title, array: [] };
                nodes.push(node);
            }
            if (levels.length > 1) {
                addCategory(node.array, levels.slice(1));
            }
        }

        function buildCategoryTree(categories: string[]): CategoryNode[] {
            const root: CategoryNode[] = [];
            categories.forEach((category) => {
                const levels = category.split('/');
                addCategory(root, levels);
            });
            return root;
        }

        const categoryTree = buildCategoryTree(nonCommonElements);

        config.value.push(...categoryTree);
        // 更新商品類別 config
        const update_col_sql = `UPDATE \`${this.app}\`.public_config
                                SET value = ?
                                WHERE \`key\` = 'collection';`;
        await db.execute(update_col_sql, [config.value]);
    }

    async postMulProduct(content: any) {
        try {
            if (content.collection.length > 0) {
                //有新類別要處理
                await this.updateCollectionFromUpdateProduct(content.collection);
            }
            let productArray = content.data;
            let passArray = [];
            productArray.forEach((product: any, index: number) => {
                product.type = 'product';
            });
            const data = await db.query(
                `INSERT INTO \`${this.app}\`.\`t_manager_post\` (userID, content)
                 VALUES ?`,
                [
                    productArray.map((product: any) => {
                        product.type = 'product';

                        this.checkVariantDataType(product.variants);
                        return [this.token?.userID, JSON.stringify(product)];
                    }),
                ]
            );

            let insertIDStart = data.insertId;

            await new Shopping(this.app, this.token).processProducts(productArray, insertIDStart);
            return insertIDStart;
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'postMulProduct Error:' + e, null);
        }
    }

    async processProducts(productArray: any, insertIDStart: any) {
        const promises = productArray.map((product: any) => {
            product.id = insertIDStart++;
            return new Shopping(this.app, this.token).postVariantsAndPriceValue(product);
        });
        await Promise.all(promises);
    }

    async putProduct(content: any) {
        try {
            content.type = 'product';
            this.checkVariantDataType(content.variants);
            const data = await db.query(
                `update \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 where id = ?`,
                [
                    {
                        content: JSON.stringify(content),
                    },
                    content.id,
                ]
            );
            await new Shopping(this.app, this.token).postVariantsAndPriceValue(content);
            return content.insertId;
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'putProduct Error:' + e, null);
        }
    }

    async deleteCollection(dataArray: Collection[]) {
        try {
            const config = (
                await db.query(
                    `SELECT *
                     FROM \`${this.app}\`.public_config
                     WHERE \`key\` = 'collection';`,
                    []
                )
            )[0];
            const deleteList: { parent: number; child: number[] }[] = [];

            // format 刪除類別 index
            dataArray.map((data) => {
                const parentTitles = data.parentTitles[0] ?? '';
                if (parentTitles.length > 0) {
                    // data 為子層
                    const parentIndex = config.value.findIndex((col: { title: string }) => col.title === parentTitles);
                    const childrenIndex = config.value[parentIndex].array.findIndex((col: { title: string }) => col.title === data.title);
                    const n = deleteList.findIndex((obj) => obj.parent === parentIndex);
                    if (n === -1) {
                        deleteList.push({ parent: parentIndex, child: [childrenIndex] });
                    } else {
                        deleteList[n].child.push(childrenIndex);
                    }
                } else {
                    // data 為父層
                    const parentIndex = config.value.findIndex((col: { title: string }) => col.title === data.title);
                    deleteList.push({ parent: parentIndex, child: [-1] });
                }
            });

            // 刪除類別之產品
            for (const d of deleteList) {
                const collection = config.value[d.parent];
                for (const index of d.child) {
                    if (index !== -1) {
                        await this.deleteCollectionProduct(collection.title, [`${collection.array[index].title}`]);
                    }
                }
                if (d.child[0] === -1) {
                    await this.deleteCollectionProduct(collection.title);
                }
            }

            // 取得新的類別 config 陣列
            deleteList.map((obj) => {
                config.value[obj.parent].array = config.value[obj.parent].array.filter((col: any, index: number) => {
                    return !obj.child.includes(index);
                });
            });
            config.value = config.value.filter((col: any, index: number) => {
                const find_collection = deleteList.find((obj) => obj.parent === index);
                return !(find_collection && find_collection.child[0] === -1);
            });

            // 更新商品類別
            const update_col_sql = `UPDATE \`${this.app}\`.public_config
                                    SET value = ?
                                    WHERE \`key\` = 'collection';`;
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
        return `SELECT *
                FROM \`${this.app}\`.t_manager_post
                WHERE JSON_CONTAINS(content ->> '$.collection', '"${name}"');`;
    }

    async updateProductCollection(content: string[], id: number) {
        try {
            const updateProdSQL = `UPDATE \`${this.app}\`.t_manager_post
                                   SET content = ?
                                   WHERE \`id\` = ?;`;
            await db.execute(updateProdSQL, [content, id]);
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'updateProductCollection Error:' + e, null);
        }
    }

    async getVariants(query: {
        page: number;
        limit: number;
        search?: string;
        searchType?: string;
        id?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        status?: string;
        id_list?: string;
        order_by?: string;
        min_price?: string;
        max_price?: string;
        stockCount?: string;
    }) {
        try {
            let querySql = ['1=1'];
            if (query.search) {
                switch (query.searchType) {
                    case 'title':
                        querySql.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.title'))) LIKE UPPER('%${query.search}%'))`);
                        break;
                    case 'sku':
                        querySql.push(`(UPPER(JSON_EXTRACT(v.content, '$.sku')) LIKE UPPER('%${query.search}%'))`);
                        break;
                }
            }

            query.id && querySql.push(`(v.id = ${query.id})`);
            query.id_list && querySql.push(`(v.id in (${query.id_list}))`);
            query.collection &&
                querySql.push(
                    `(${query.collection
                        .split(',')
                        .map((dd) => {
                            return query.accurate_search_collection ? `(JSON_CONTAINS(p.content->'$.collection', '"${dd}"'))` : `(JSON_EXTRACT(p.content, '$.collection') LIKE '%${dd}%')`;
                        })
                        .join(' or ')})`
                );
            query.status && querySql.push(`(JSON_EXTRACT(p.content, '$.status') = '${query.status}')`);
            query.min_price && querySql.push(`(v.content->>'$.sale_price' >= ${query.min_price})`);
            query.max_price && querySql.push(`(v.content->>'$.sale_price' <= ${query.min_price})`);

            if (query.stockCount) {
                const stockCount = query.stockCount?.split(',');
                switch (stockCount[0]) {
                    case 'lessThan':
                        querySql.push(`(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) < ${stockCount[1]})`);
                        break;
                    case 'moreThan':
                        querySql.push(`(cast(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) > ${stockCount[1]})`);
                        break;
                    case 'lessSafe':
                        querySql.push(`(
                            JSON_EXTRACT(v.content, '$.save_stock') is not null AND
                            (cast(JSON_EXTRACT(v.content, '$.stock') AS SIGNED) - cast(JSON_EXTRACT(v.content, '$.save_stock') AS SIGNED) < ${stockCount[1]})
                        )`);
                        break;
                }
            }

            query.order_by = (() => {
                switch (query.order_by) {
                    case 'title':
                        return `order by JSON_EXTRACT(p.content, '$.title')`;
                    case 'max_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.max_price')) AS SIGNED)) desc`;
                    case 'min_price':
                        return `order by (CAST(JSON_UNQUOTE(JSON_EXTRACT(p.content, '$.min_price')) AS SIGNED)) asc`;
                    case 'created_time_desc':
                        return `order by p.created_time desc`;
                    case 'created_time_asc':
                        return `order by p.created_time`;
                    case 'updated_time_desc':
                        return `order by p.updated_time desc`;
                    case 'updated_time_asc':
                        return `order by p.updated_time`;
                    case 'stock_desc':
                        return `order by stock desc`;
                    case 'stock_asc':
                        return `order by stock`;
                    case 'default':
                    default:
                        return `order by id desc`;
                }
            })();

            const data = await this.querySqlByVariants(querySql, query);
            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getVariants Error:' + e, null);
        }
    }

    async putVariants(query: { id: number; product_id: number; product_content: any; variant_content: any }[]) {
        try {
            for (const data of query) {
                await db.query(
                    `UPDATE \`${this.app}\`.t_variants
                     SET ?
                     WHERE id = ?`,
                    [{ content: JSON.stringify(data.variant_content) }, data.id]
                );
                await db.query(
                    `UPDATE \`${this.app}\`.t_manager_post
                     SET ?
                     WHERE id = ?`,
                    [{ content: JSON.stringify(data.product_content) }, data.product_id]
                );
            }
            return {
                result: 'success',
                orderData: query,
            };
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'putVariants Error:' + e, null);
        }
    }
}
