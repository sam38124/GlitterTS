import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import FinancialService, { LinePay, PayPal } from './financial-service.js';
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
import { DeliveryData } from './delivery.js';
import { saasConfig } from '../../config.js';
import { SMS } from './sms.js';
import { LineMessage } from './line-message';
import { EcInvoice } from './EcInvoice';
import app from '../../app';
import { onlinePayArray, paymentInterface } from '../models/glitter-finance.js';
import { App } from '../../services/app.js';
import { Stock } from './stock';

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

export interface VoucherData {
    id: number;
    title: string;
    code?: string;
    method: 'percent' | 'fixed';
    reBackType: 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
    add_on_products?: string[] | ProductItem[];
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

interface seo {
    title: string;
    seo: {
        domain: string;
        title: string;
        content: string;
    };
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
    language_data: {
        'en-US': seo;
        'zh-CN': seo;
        'zh-TW': seo;
    };
};

type CartItem = {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    is_gift?: boolean;
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
    shipment_selector: { name: string; value: string }[];
    shipment_info: any;
    use_wallet: number;
    user_email: string;
    method: string;
    useRebateInfo?: { point: number; limit?: number; condition?: number };
    user_rebate_sum: number;
    voucherList?: VoucherData[];
    custom_form_format?: any;
    custom_receipt_form?: any;
    custom_form_data?: any;
    distribution_id?: number;
    distribution_info?: any;
    orderSource: '' | 'manual' | 'normal' | 'POS';
    code_array: string[];
    deliveryData?: DeliveryData;
    give_away: CartItem[];
    language?: string;
    pos_info?: any; //POS結帳資訊
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
        domain?: string;
        search?: string;
        searchType?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        accurate_search_text?: boolean;
        min_price?: string;
        max_price?: string;
        status?: string;
        channel?: string;
        order_by?: string;
        id_list?: string;
        with_hide_index?: string;
        is_manger?: boolean;
        show_hidden?: string;
        productType?: string;
        filter_visible?: string;
        language?: string;
        currency_code?: string;
    }) {
        try {
            let store_info = await new User(this.app).getConfigV2({
                key: 'store-information',
                user_id: 'manager',
            });
            const store_config = await new User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            query.language = query.language ?? store_info.language_setting.def;
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
                                `(UPPER(content->>'$.language_data."${query.language}".title') LIKE UPPER('%${query.search}%'))`,
                                `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                                `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                            ].join(' or ')})`
                        );
                        break;
                }
            }
            if (query.domain) {
                let sql_join_search = [];
                // querySql.push();
                sql_join_search.push(`content->>'$.seo.domain'='${decodeURIComponent(query.domain)}'`);
                sql_join_search.push(`content->>'$.language_data."${query.language}".seo.domain'='${decodeURIComponent(query.domain)}'`);
                querySql.push(
                    `(${sql_join_search
                        .map((dd) => {
                            return `(${dd})`;
                        })
                        .join(' or ')})`
                );
            }
            if (`${query.id || ''}`) {
                if (`${query.id}`.includes(',')) {
                    querySql.push(`id in (${query.id})`);
                    console.log('query.id -- ', query.id);
                } else {
                    querySql.push(`id = ${query.id}`);
                }
            }

            //當非管理員時，檢查是否顯示隱形商品
            if (query.filter_visible) {
                if (query.filter_visible === 'true') {
                    querySql.push(`(content->>'$.visible' is null || content->>'$.visible' = 'true')`);
                } else {
                    querySql.push(`(content->>'$.visible' = 'false')`);
                }
            } else if (!query.is_manger && `${query.show_hidden}` !== 'true') {
                querySql.push(`(content->>'$.visible' is null || content->>'$.visible' = 'true')`);
            }

            //判斷有帶入商品類型時，顯示商品類型，反之預設折是一班商品
            if (query.productType) {
                query.productType.split(',').map((dd) => {
                    if (dd === 'hidden') {
                        querySql.push(`(content->>'$.visible' = "false")`);
                    } else if (dd !== 'all') {
                        querySql.push(`(content->>'$.productType.${dd}' = "true")`);
                    }
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
                                return (d1.language_data && d1.language_data[query.language as any].seo.domain === dd) || d1.code === dd;
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
            if (query.id_list) {
                query.order_by = ` order by id in (${query.id_list})`;
            }
            if (query.status) {
                const statusSplit = query.status.split(',').map((status) => status.trim());
                const statusJoin = statusSplit.map((status) => `"${status}"`).join(',');

                // 基本條件
                const statusCondition = `JSON_EXTRACT(content, '$.status') IN (${statusJoin})`;

                // 時間條件
                const scheduleConditions = statusSplit
                    .map((status) => {
                        switch (status) {
                            case 'inRange':
                                return `
                                OR (
                                    JSON_EXTRACT(content, '$.status') = 'active'
                                    AND (
                                        content->>'$.active_schedule' IS NULL OR (
                                            (
                                            CONCAT(content->>'$.active_schedule.start_ISO_Date') IS NULL OR
                                            CONCAT(content->>'$.active_schedule.start_ISO_Date') <= ${convertTimeZone('NOW()')}
                                            )
                                            AND (
                                                CONCAT(content->>'$.active_schedule.end_ISO_Date') IS NULL
                                                OR CONCAT(content->>'$.active_schedule.end_ISO_Date') >= ${convertTimeZone('NOW()')}
                                            )
                                        )
                                    )
                                )
                            `;
                            case 'beforeStart':
                                return `
                                OR (
                                    JSON_EXTRACT(content, '$.status') = 'active'
                                    AND CONCAT(content->>'$.active_schedule.start_ISO_Date') > ${convertTimeZone('NOW()')}
                                )
                            `;
                            case 'afterEnd':
                                return `
                                OR (
                                    JSON_EXTRACT(content, '$.status') = 'active'
                                    AND CONCAT(content->>'$.active_schedule.end_ISO_Date') < ${convertTimeZone('NOW()')}
                                )
                            `;
                            default:
                                return '';
                        }
                    })
                    .join('');

                // 組合 SQL 條件
                querySql.push(`(${statusCondition} ${scheduleConditions})`);
            }
            if (query.channel) {
                const channelSplit = query.channel.split(',').map((channel) => channel.trim());
                const channelJoin = channelSplit.map((channel) => {
                    return `OR JSON_CONTAINS(content->>'$.channel', '"${channel}"')`;
                });
                querySql.push(`(content->>'$.channel' IS NULL ${channelJoin})`);
            }

            query.id_list && querySql.push(`(id in (${query.id_list}))`);
            query.min_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'>=${query.min_price})) `);
            query.max_price && querySql.push(`(id in (select product_id from \`${this.app}\`.t_variants where content->>'$.sale_price'<=${query.max_price})) `);
            const products = await this.querySql(querySql, query);

            // 產品清單
            const productList = (Array.isArray(products.data) ? products.data : [products.data]).filter((product) => product);

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
            // const checkoutSQL = `
            //     SELECT JSON_EXTRACT(orderData, '$.lineItems') as lineItems
            //     FROM \`${this.app}\`.t_checkout
            //     WHERE status = 1;
            // `;
            // const checkouts = await db.query(checkoutSQL, []);
            // const itemRecord: { id: number; count: number }[] = [];

            // for (const checkout of checkouts) {
            //     if (Array.isArray(checkout.lineItems)) {
            //         for (const item1 of checkout.lineItems) {
            //             const index = itemRecord.findIndex((item2) => item1.id === item2.id);
            //             if (index === -1) {
            //                 itemRecord.push({id: parseInt(`${item1.id}`, 10), count: item1.count});
            //             } else {
            //                 itemRecord[index].count += item1.count;
            //             }
            //         }
            //     }
            // }

            if (query.id_list) {
                let tempData: any = [];
                query.id_list.split(',').map((id) => {
                    const find = products.data.find((product: { id: number }) => {
                        return `${product.id}` === `${id}`;
                    });
                    if (find) {
                        tempData.push(find);
                    }
                });
                products.data = tempData;
            }
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

            //判斷需要多國語言
            for (const dd of Array.isArray(products.data) ? products.data : [products.data]) {
                if (query.language && dd.content.language_data && dd.content.language_data[`${query.language}`]) {
                    dd.content.seo = dd.content.language_data[`${query.language}`].seo;
                    dd.content.title = dd.content.language_data[`${query.language}`].title || dd.content.title;
                    dd.content.content = dd.content.language_data[`${query.language}`].content || dd.content.content;
                    dd.content.content_array = dd.content.language_data[`${query.language}`].content_array || dd.content.content_array;
                    dd.content.content_json = dd.content.language_data[`${query.language}`].content_json || dd.content.content_json;
                    dd.content.preview_image = dd.content.language_data[`${query.language}`].preview_image || dd.content.preview_image;

                    (dd.content.variants || []).map((variant: any) => {
                        variant.stock = 0;
                        variant.preview_image = variant[`preview_image_${query.language}`] || variant.preview_image;
                        if (variant.preview_image === 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg') {
                            variant.preview_image = dd.content.preview_image[0];
                        }
                        Object.keys(variant.stockList).map((dd) => {
                            if (
                                !store_config.list.find((d1: any) => {
                                    return d1.id === dd;
                                })
                            ) {
                                delete variant.stockList[dd];
                            } else if (!variant.stockList[dd] || !variant.stockList[dd].count) {
                                delete variant.stockList[dd];
                            } else {
                                //避免存字串導致的異常
                                variant.stockList[dd].count = parseInt(variant.stockList[dd].count, 10);
                                variant.stock += variant.stockList[dd].count;
                            }
                        });
                        store_config.list.map((d1: any) => {
                            if (!variant.stockList[d1.id]) {
                                variant.stockList[d1.id] = { count: 0 };
                            }
                        });
                    });
                }
            }

            if (query.domain && products.data[0]) {
                products.data = products.data[0];
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

    public async querySqlBySEO(
        querySql: string[],
        query: {
            page: number;
            limit: number;
            id?: string;
            order_by?: string;
        }
    ) {
        let sql = `SELECT id, content ->>'$.title' as title, content->>'$.seo' as seo
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
                          v.content                                            as variant_content,
                          p.content                                            as product_content,
                          CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock,
                          JSON_EXTRACT(v.content, '$.stockList')               as stockList
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
            throw exception.BadRequestError('BAD_REQUEST', 'DeleteProduct Error:' + e, null);
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
            throw exception.BadRequestError('BAD_REQUEST', 'DeleteVoucher Error:' + e, null);
        }
    }

    private generateOrderID() {
        return `${new Date().getTime()}`;
    }

    public async linePay(data: any) {
        return new Promise(async (resolve, reject) => {
            const keyData: any = (
                await Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_finance',
                })
            )[0].value.line_pay_scan;

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: keyData.BETA == 'true' ? 'https://sandbox-api-pay.line.me/v2/payments/oneTimeKeys/pay' : 'https://api-pay.line.me/v2/payments/oneTimeKeys/pay',
                headers: {
                    'X-LINE-ChannelId': keyData.CLIENT_ID,
                    'X-LINE-ChannelSecret': keyData.SECRET,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(data),
            };
            axios
                .request(config)
                .then((response: any) => {
                    console.log(response);
                    resolve(response.data.returnCode === '0000');
                })
                .catch((error: any) => {
                    resolve(false);
                });
        });
    }

    public async getPostAddressData(address: string) {
        try {
            const url = `http://zip5.5432.tw/zip5json.py?adrs=${encodeURIComponent(address)}`;
            const response = await axios.get(url);

            // 確保回應包含 JSON 資料
            if (response && response.data) {
                return response.data; // 返回 JSON 資料
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    public async toCheckout(
        data: {
            line_items: {
                deduction_log?: { [p: string]: number };
                id: string;
                spec: string[];
                count: number;
                sale_price: number;
                min_qty?: number;
                collection?: string[];
                title?: string;
                preview_image?: string;
                sku: string;
                shipment_obj: {
                    type: string;
                    value: number;
                };
                is_gift?: boolean;
                stock: number;
                show_understocking: 'true' | 'false';
            }[];
            customer_info?: any; //顧客資訊 訂單人
            email?: string;
            return_url: string;
            order_id?: string;
            user_info: any; //取貨人資訊
            code?: string;
            use_rebate?: number;
            use_wallet?: number;
            checkOutType?: 'manual' | 'auto' | 'POS';
            pos_store?: string;
            voucher?: any; //自定義的voucher
            discount?: number; //自定義金額
            total?: number; //自定義總額
            pay_status?: number; //自定義訂單狀態
            custom_form_format?: any; //自定義表單格式
            custom_form_data?: any; //自定義表單資料
            custom_receipt_form?: any; //自定義配送表單格式
            distribution_code?: string; //分銷連結代碼
            code_array: string[]; // 優惠券代碼列表
            give_away?: {
                id: number;
                spec: string[];
                count: number;
                voucher_id: string;
            }[];
            language?: 'en-US' | 'zh-CN' | 'zh-TW';
            pos_info?: any; //POS結帳資訊;
            invoice_select?: string;
            pre_order?: boolean;
        },
        type: 'add' | 'preview' | 'manual' | 'manual-preview' | 'POS' = 'add',
        replace_order_id?: string
    ) {
        const check_time = new Date().getTime();
        try {
            data.line_items = (data.line_items || (data as any).lineItems) ?? [];
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
                    data.line_items = orderData.orderData.lineItems;
                    data.email = orderData.email;
                    data.user_info = orderData.orderData.user_info;
                    data.code = orderData.orderData.code;
                    data.customer_info = orderData.orderData.customer_info;
                    data.use_rebate = orderData.orderData.use_rebate;
                } else {
                    throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 1 Error:Cant find this orderID.', null);
                }
            }
            //判斷是POS重新支付<例如:預購單>，則把原先商品庫存加回去
            if (data.order_id && type === 'POS') {
                const order = (await db.query(`select * from \`${this.app}\`.t_checkout where cart_token='${data.order_id}'`, []))[0];
                if (order) {
                    for (const b of order.orderData.lineItems) {
                        const pdDqlData = (
                            await this.getProduct({
                                page: 0,
                                limit: 50,
                                id: b.id,
                                status: 'inRange',
                                channel: data.checkOutType === 'POS' ? 'pos' : undefined,
                            })
                        ).data;
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd: any) => {
                            return dd.spec.join('-') === b.spec.join('-');
                        });
                        Object.keys(b.deduction_log).map((dd) => {
                            try {
                                variant.stockList[dd].count += b.deduction_log[dd];
                            } catch (e) {}
                        });
                        await this.updateVariantsWithSpec(variant, b.id, b.spec);
                        //這裡更新資訊
                        await db.query(
                            `UPDATE \`${this.app}\`.\`t_manager_post\`
                                             SET ?
                                             WHERE 1 = 1
                                               and id = ${pdDqlData.id}`,
                            [{ content: JSON.stringify(pd) }]
                        );
                    }
                }
            }
            //判斷是checkOutType 是POS則清空token，因為結帳對象不是結帳人
            if (data.checkOutType === 'POS') {
                this.token = undefined;
            }
            console.log(`checkout-time-1=>`, new Date().getTime() - check_time);
            const userClass = new User(this.app);
            const rebateClass = new Rebate(this.app);
            //電話信箱擇一
            if (type !== 'preview' && !(this.token && this.token.userID) && !data.email && !(data.user_info && data.user_info.email)) {
                if (data.user_info.phone) {
                    data.email = data.user_info.phone;
                } else {
                    throw exception.BadRequestError('BAD_REQUEST', 'ToCheckout 2 Error:No email address.', null);
                }
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
            console.log(`checkout-time-2=>`, new Date().getTime() - check_time);
            if (userData && userData.account) {
                data.email = userData.account;
            }

            if (!data.email && type !== 'preview') {
                if (data.user_info && data.user_info.email) {
                    data.email = data.user_info.email;
                } else {
                    data.email = data.email || 'no-email';
                }
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
            console.log(`checkout-time-3=>`, new Date().getTime() - check_time);
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
                const refer =
                    data.user_info.shipment === 'global_express'
                        ? (
                              (
                                  await Private_config.getConfig({
                                      appName: this.app,
                                      key: 'glitter_shipment_global_' + data.user_info.country,
                                  })
                              )[0] ?? {
                                  value: {
                                      volume: [],
                                      weight: [],
                                      selectCalc: 'volume',
                                  },
                              }
                          ).value
                        : (
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
            console.log(`checkout-time-4=>`, new Date().getTime() - check_time);
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
            console.log(`checkout-time-5=>`, new Date().getTime() - check_time);
            //載入自訂配送表單
            shipment_setting.custom_delivery = shipment_setting.custom_delivery ?? [];
            for (const form of shipment_setting.custom_delivery) {
                form.form =
                    (
                        await new User(this.app).getConfigV2({
                            user_id: 'manager',
                            key: `form_delivery_${form.id}`,
                        })
                    ).list || [];
            }
            shipment_setting.support = shipment_setting.support ?? [];
            shipment_setting.info =
                (shipment_setting.language_data && shipment_setting.language_data[data.language as any] && shipment_setting.language_data[data.language as any].info) ?? shipment_setting.info;
            console.log(`checkout-time-6=>`, new Date().getTime() - check_time);
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
                orderID: data.order_id || this.generateOrderID(),
                shipment_support: shipment_setting.support as any,
                shipment_info: shipment_setting.info as any,
                shipment_selector: [
                    {
                        name: '中華郵政',
                        value: 'normal',
                    },
                    {
                        name: '黑貓到府',
                        value: 'black_cat',
                    },
                    {
                        name: '全家店到店',
                        value: 'FAMIC2C',
                    },
                    {
                        name: '萊爾富店到店',
                        value: 'HILIFEC2C',
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
                    {
                        name: '國際快遞',
                        value: 'global_express',
                    },
                ]
                    .concat(
                        (shipment_setting.custom_delivery ?? []).map((dd: any) => {
                            return {
                                form: dd.form,
                                name: dd.name,
                                value: dd.id,
                            };
                        })
                    )
                    .filter((d1) => {
                        return shipment_setting.support.find((d2: any) => {
                            return d2 === d1.value;
                        });
                    }),
                use_wallet: 0,
                method: data.user_info && data.user_info.method,
                user_email: (userData && userData.account) || data.email || (data.user_info && data.user_info.email) || '',
                useRebateInfo: { point: 0 },
                custom_form_format: data.custom_form_format,
                custom_form_data: data.custom_form_data,
                custom_receipt_form: data.custom_receipt_form,
                orderSource: data.checkOutType === 'POS' ? `POS` : ``,
                code_array: data.code_array,
                give_away: data.give_away as any,
                user_rebate_sum: 0,
                language: data.language,
                pos_info: data.pos_info,
            };

            if (!data.user_info.name && userData && userData.userData) {
                carData.user_info.name = userData.userData.name;
                carData.user_info.phone = userData.userData.phone;
            }

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

            const add_on_items: any[] = [];
            let gift_product: any[] = [];

            let saveStockArray: (() => Promise<boolean>)[] = [];
            for (const b of data.line_items) {
                try {
                    const pdDqlData = (
                        await this.getProduct({
                            page: 0,
                            limit: 50,
                            id: b.id,
                            status: 'inRange',
                            channel: data.checkOutType === 'POS' ? 'pos' : undefined,
                        })
                    ).data;
                    if (pdDqlData) {
                        const pd = pdDqlData.content;
                        const variant = pd.variants.find((dd: any) => {
                            return dd.spec.join('-') === b.spec.join('-');
                        });
                        console.log(`variant1===>`, variant);
                        if ((Number.isInteger(variant.stock) || variant.show_understocking === 'false') && Number.isInteger(b.count)) {
                            console.log(`variant2===>`, variant);
                            if (data.checkOutType === 'POS' && variant.show_understocking !== 'false') {
                                variant.stock = variant.stockList && (variant.stockList as any)[data.pos_store!].count;
                            }
                            // 當超過庫存數量則調整為庫存上限
                            if (variant.stock < b.count && variant.show_understocking !== 'false' && type !== 'manual' && type !== 'manual-preview') {
                                if (data.checkOutType === 'POS') {
                                    (b as any).pre_order = true;
                                } else {
                                    b.count = variant.stock;
                                }
                            }
                            if (variant && b.count > 0) {
                                (b as any).specs = pd.specs;
                                (b as any).language_data = pd.language_data;
                                b.preview_image = variant.preview_image || pd.preview_image[0];
                                b.title = pd.title;
                                b.sale_price = variant.sale_price;
                                b.collection = pd['collection'];
                                b.sku = variant.sku;
                                b.stock = variant.stock;
                                b.show_understocking = variant.show_understocking;
                                (b as any).stockList = variant.stockList;
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
                                if (type !== 'manual' && !pd.productType.giveaway) {
                                    carData.total += variant.sale_price * b.count;
                                }
                                if (pd.productType.giveaway) {
                                    b.sale_price = 0;
                                }
                            }
                            // 當為結帳時則更改商品庫存數量
                            console.log(`type=>`, type);
                            if (type !== 'preview' && type !== 'manual' && type !== 'manual-preview' && variant.show_understocking !== 'false') {
                                console.log(`variant資訊=>`, type);

                                const countless = variant.stock - b.count;
                                variant.stock = countless > 0 ? countless : 0;
                                if (type === 'POS') {
                                    //POS的話依據分店去扣除庫存
                                    variant.deduction_log = {};
                                    (variant.deduction_log as any)[data.pos_store!!] = b.count;
                                    variant.stockList[data.pos_store!!].count -= b.count;
                                    b.deduction_log = variant.deduction_log;
                                } else {
                                    //找到最大的倉儲量 順序式
                                    const returnData = new Stock(this.app, this.token).allocateStock(variant.stockList, b.count);
                                    variant.deduction_log = returnData.deductionLog;
                                    b.deduction_log = returnData.deductionLog;
                                }
                                saveStockArray.push(() => {
                                    return new Promise<boolean>(async (resolve, reject) => {
                                        await this.updateVariantsWithSpec(variant, b.id, b.spec);
                                        //這裡更新資訊
                                        await db.query(
                                            `UPDATE \`${this.app}\`.\`t_manager_post\`
                                             SET ?
                                             WHERE 1 = 1
                                               and id = ${pdDqlData.id}`,
                                            [{ content: JSON.stringify(pd) }]
                                        );
                                        resolve(true);
                                    });
                                });
                            }
                        }
                        if (!pd.productType.product && pd.productType.addProduct) {
                            (b as any).is_add_on_items = true;
                            add_on_items.push(b);
                        }
                        if (pd.visible === 'false') {
                            (b as any).is_hidden = true;
                        }
                        if (pd.productType.giveaway) {
                            (b as any).is_gift = true;
                            b.sale_price = 0;
                            gift_product.push(b);
                        }
                        if (pd.min_qty) {
                            b.min_qty = pd.min_qty;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            console.log(`checkout-time-7=>`, new Date().getTime() - check_time);
            carData.shipment_fee = (() => {
                if (data.user_info.shipment === 'now') {
                    return 0;
                }
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
            console.log(`checkout-time-8=>`, new Date().getTime() - check_time);
            carData.useRebateInfo = f_rebate;
            carData.use_rebate = f_rebate.point;
            carData.total -= carData.use_rebate;
            carData.code = data.code;
            carData.voucherList = [];
            if (userData && userData.account) {
                const data = await rebateClass.getOneRebate({ user_id: userData.userID });
                carData.user_rebate_sum = data?.point || 0;
            }
            console.log(`checkout-time-9=>`, new Date().getTime() - check_time);
            // 判斷是否有分銷連結
            if (data.distribution_code) {
                const linkList = await new Recommend(this.app, this.token).getLinkList({
                    page: 0,
                    limit: 99999,
                    code: data.distribution_code,
                    status: true,
                    no_detail: true,
                });
                if (linkList.data.length > 0) {
                    const content = linkList.data[0].content;
                    if (this.checkDuring(content)) {
                        carData.distribution_info = content;
                    }
                }
            }
            console.log(`checkout-time-10=>`, new Date().getTime() - check_time);
            // 手動新增訂單的優惠卷設定
            if (type !== 'manual' && type !== 'manual-preview') {
                //過濾加購品
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !add_on_items.includes(dd);
                });
                //過濾贈品
                carData.lineItems = carData.lineItems.filter((dd) => {
                    return !gift_product.includes(dd);
                });

                // 濾出可用的加購商品，避免折扣被double所以要stringify
                const c_carData = await this.checkVoucher(JSON.parse(JSON.stringify(carData)));
                console.log(`checkout-time-check-voucher=>`, new Date().getTime() - check_time);
                add_on_items.map((dd) => {
                    try {
                        if (
                            c_carData.voucherList?.find((d1) => {
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
                console.log(`checkout-time-check-voucher2=>`, new Date().getTime() - check_time);
                //過濾可選贈品
                let can_add_gift: any[] = [];
                carData
                    .voucherList!!.filter((dd) => {
                        return dd.reBackType === 'giveaway';
                    })
                    .map((dd) => {
                        can_add_gift.push(dd.add_on_products);
                    });
                gift_product.map((dd) => {
                    let max_count = can_add_gift.filter((d1) => {
                        return d1.includes(dd.id);
                    }).length;
                    if (dd.count <= max_count) {
                        for (let a = 0; a < dd.count; a++) {
                            let find = false;
                            can_add_gift = can_add_gift.filter((d1) => {
                                if (d1.includes(dd.id) || find) {
                                    find = true;
                                    return false;
                                } else {
                                    return true;
                                }
                            });
                        }
                        carData.lineItems.push(dd);
                    }
                });
                for (const dd of carData.voucherList!!.filter((dd) => {
                    return dd.reBackType === 'giveaway';
                })) {
                    let index = -1;
                    for (const b of dd.add_on_products ?? []) {
                        index++;
                        const pdDqlData = (
                            (
                                await this.getProduct({
                                    page: 0,
                                    limit: 50,
                                    id: `${b}`,
                                    status: 'inRange',
                                    channel: data.checkOutType === 'POS' ? 'pos' : undefined,
                                })
                            ).data ?? { content: {} }
                        ).content;
                        pdDqlData.voucher_id = dd.id;
                        (dd.add_on_products as any)[index] = pdDqlData;
                    }
                }
            }
            console.log(`checkout-time-11=>`, new Date().getTime() - check_time);
            // 付款資訊設定
            const keyData: paymentInterface = (
                await Private_config.getConfig({
                    appName: this.app,
                    key: 'glitter_finance',
                })
            )[0].value;
            (carData as any).payment_info_custom = keyData.payment_info_custom;

            await new Promise<void>((resolve) => {
                let n = 0;
                (carData as any).payment_customer_form = (carData as any).payment_customer_form ?? [];
                keyData.payment_info_custom.map((item, index) => {
                    new User(this.app)
                        .getConfigV2({
                            user_id: 'manager',
                            key: `form_finance_${item.id}`,
                        })
                        .then((data) => {
                            (carData as any).payment_customer_form[index] = {
                                id: item.id,
                                list: data.list,
                            };
                            n++;
                            if (keyData.payment_info_custom.length === n) {
                                resolve();
                            }
                        });
                });
                if (n === 0) {
                    resolve();
                }
            });

            (carData as any).payment_setting = onlinePayArray
                .filter((dd) => {
                    return (keyData as any)[dd.key] && (keyData as any)[dd.key].toggle;
                })
                .filter((dd) => {
                    if (carData.orderSource === 'POS') {
                        if (dd.key === 'ut_credit_card') {
                            (dd as any).pwd = (keyData as any)[dd.key]['pwd'];
                        }
                        return dd.type === 'pos';
                    } else {
                        return dd.type !== 'pos';
                    }
                });
            (carData as any).off_line_support = keyData.off_line_support;
            (carData as any).payment_info_line_pay = keyData.payment_info_line_pay;
            (carData as any).payment_info_atm = keyData.payment_info_atm;

            // 防止帶入購物金時，總計小於0
            let subtotal = 0;
            carData.lineItems.map((item) => {
                if (item.is_gift) {
                    item.sale_price = 0;
                }
                if (!item.is_gift) {
                    subtotal += item.count * (item.sale_price - (item.discount_price ?? 0));
                }
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
            console.log(`checkout-time-12=>`, new Date().getTime() - check_time);

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
                console.log(`checkout-time-13=>`, new Date().getTime() - check_time);
                return {
                    data: carData,
                };
            } else if (type === 'POS') {
                console.log(`pre_order`);
                carData.orderSource = 'POS';
                const trans = await db.Transaction.build();
                if (data.pre_order) {
                    (carData as any).progress = 'pre_order';
                    (carData as any).orderStatus = '0';
                    const payTotal = data.pos_info.payment
                        .map((dd: any) => {
                            return dd.total;
                        })
                        .reduce((acc: any, val: any) => acc + val, 0);
                    if (carData.total <= payTotal) {
                        data.pay_status = 1;
                    } else {
                        data.pay_status = 3;
                    }
                } else if (carData.user_info.shipment === 'now') {
                    (carData as any).orderStatus = '1';
                    (carData as any).progress = 'finish';
                }
                await trans.execute(
                    `replace INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                     values (?, ?, ?, ?)`,
                    [carData.orderID, data.pay_status, carData.email, JSON.stringify(carData)]
                );

                if (data.invoice_select !== 'nouse') {
                    (carData as any).invoice = await new Invoice(this.app).postCheckoutInvoice(carData, carData.user_info.send_type !== 'carrier');
                }
                await trans.commit();
                await trans.release();
                await Promise.all(
                    saveStockArray.map((dd) => {
                        return dd();
                    })
                );
                return { result: 'SUCCESS', message: 'POS訂單新增成功', data: carData };
            } else {
                if (userData && userData.userID) {
                    await rebateClass.insertRebate(userData.userID, carData.use_rebate * -1, '使用折抵', {
                        order_id: carData.orderID,
                    });

                    if (carData.voucherList && (carData as any).voucherList.length > 0) {
                        for (const voucher of (carData as any).voucherList) {
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
                await Promise.all(
                    saveStockArray.map((dd) => {
                        return dd();
                    })
                );
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
                let kd = keyData[carData.customer_info.payment_select];
                // 線下付款
                switch (carData.customer_info.payment_select) {
                    case 'ecPay':
                    case 'newWebPay':
                        const subMitData = await new FinancialService(this.app, {
                            HASH_IV: kd.HASH_IV,
                            HASH_KEY: kd.HASH_KEY,
                            ActionURL: kd.ActionURL,
                            NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`,
                            ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                            MERCHANT_ID: kd.MERCHANT_ID,
                            TYPE: carData.customer_info.payment_select,
                        }).createOrderPage(carData);
                        await Promise.all(
                            saveStockArray.map((dd) => {
                                return dd();
                            })
                        );
                        return {
                            form: subMitData,
                        };
                    case 'paypal':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`;
                        await Promise.all(
                            saveStockArray.map((dd) => {
                                return dd();
                            })
                        );
                        return await new PayPal(this.app, kd).checkout(carData);
                    case 'line_pay':
                        kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
                        kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}`;
                        await Promise.all(
                            saveStockArray.map((dd) => {
                                return dd();
                            })
                        );
                        return await new LinePay(this.app, kd).createOrder(carData);
                    case 'paynow':
                    default:
                        carData.method = 'off_line';
                        // 訂單成立信件通知
                        new ManagerNotify(this.app).checkout({
                            orderData: carData,
                            status: 0,
                        });
                        if (carData.customer_info.phone) {
                            let sns = new SMS(this.app);
                            await sns.sendCustomerSns('auto-sns-order-create', carData.orderID, carData.customer_info.phone);
                            console.log('訂單簡訊寄送成功');
                        }
                        if (carData.customer_info.lineID) {
                            let line = new LineMessage(this.app);
                            await line.sendCustomerLine('auto-line-order-create', carData.orderID, carData.customer_info.lineID);
                            console.log('訂單line訊息寄送成功');
                        }
                        // if (carData.customer_info.fb_id) {
                        //     let fb = new FbMessage(this.app)
                        //     await fb.sendCustomerFB('auto-fb-order-create', carData.orderID, carData.customer_info.fb_id);
                        //     console.log('訂單FB訊息寄送成功');
                        // }
                        await AutoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, carData.email, carData.language!!);

                        await db.execute(
                            `INSERT INTO \`${this.app}\`.t_checkout (cart_token, status, email, orderData)
                             values (?, ?, ?, ?)`,
                            [carData.orderID, 0, carData.email, carData]
                        );
                        await Promise.all(
                            saveStockArray.map((dd) => {
                                return dd();
                            })
                        );
                        return {
                            off_line: true,
                            return_url: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                        };
                }

                // await new PayPal(this.app, keyData).checkout(orderData);
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
            //退貨單封存相關
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
            throw exception.BadRequestError('BAD_REQUEST', 'getReturnOrder Error:' + e, null);
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
        console.log(`cart.email==>`, cart.email);
        const userData = (await userClass.getUserData(cart.email, 'email_or_phone')) ?? { userID: -1 };
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
                    return userData && userData.id && dd.targetList.includes(userData.userID);
                }
                if (dd.target === 'levels') {
                    if (userData && userData.member) {
                        const find = userData.member.find((dd: any) => {
                            return dd.trigger;
                        });
                        return find && dd.targetList.includes(find.id);
                    } else {
                        return false;
                    }
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
                                discount = Math.round(remain * ((d2.sale_price * d2.count) / dd.bind_subtotal));
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
        return cart;
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
            const store_config = await new User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            const origin = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE id = ?;
                `,
                [data.id]
            );

            if (update.orderData && JSON.parse(update.orderData)) {
                // 商品出貨信件通知（消費者）
                let sns = new SMS(this.app);
                const updateProgress = JSON.parse(update.orderData).progress;

                //Migrate舊版和新版訂單
                function migrateOrder(lineItems: any) {
                    for (const lineItem of lineItems) {
                        lineItem.stockList = undefined;
                        lineItem.deduction_log = lineItem.deduction_log || {};
                        if (Object.keys(lineItem.deduction_log).length === 0) {
                            //將舊版回填migrate成新版本
                            lineItem.deduction_log[store_config.list[0].id] = { count: lineItem.count };
                        }
                    }
                }

                console.log(`update.orderData=>`, update.orderData);
                migrateOrder(data.orderData.lineItems);
                migrateOrder(origin[0].orderData.lineItems);

                //當訂單變成已取消的當下去執行
                if (origin[0].orderData.orderStatus !== '-1' && data.orderData.orderStatus === '-1') {
                    for (const lineItem of origin[0].orderData.lineItems) {
                        //回填所有庫存點數量
                        for (const b of Object.keys(lineItem.deduction_log)) {
                            await new Shopping(this.app, this.token).calcVariantsStock(lineItem.deduction_log[b] || 0, b, lineItem.id, lineItem.spec);
                        }
                    }
                    await AutoSendEmail.customerOrder(this.app, 'auto-email-order-cancel-success', data.orderData.orderID, data.orderData.email, data.orderData.language);
                } else if (origin[0].orderData.progress !== 'shipping' && updateProgress === 'shipping') {
                    if (data.orderData.customer_info.phone) {
                        await sns.sendCustomerSns('auto-sns-shipment', data.orderData.orderID, data.orderData.customer_info.phone);
                        console.log('出貨簡訊寄送成功');
                    }
                    if (data.orderData.customer_info.lineID) {
                        let line = new LineMessage(this.app);
                        await line.sendCustomerLine('auto-line-shipment', data.orderData.orderID, data.orderData.customer_info.lineID);
                        console.log('付款成功line訊息寄送成功');
                    }

                    await AutoSendEmail.customerOrder(this.app, 'auto-email-shipment', data.orderData.orderID, data.orderData.email, data.orderData.language);
                } else if (origin[0].orderData.progress !== 'arrived' && updateProgress === 'arrived') {
                    if (data.orderData.customer_info.phone) {
                        await sns.sendCustomerSns('auto-sns-shipment-arrival', data.orderData.orderID, data.orderData.customer_info.phone);
                        console.log('到貨簡訊寄送成功');
                    }
                    if (data.orderData.customer_info.lineID) {
                        let line = new LineMessage(this.app);
                        await line.sendCustomerLine('auto-line-shipment-arrival', data.orderData.orderID, data.orderData.customer_info.lineID);
                        console.log('付款成功line訊息寄送成功');
                    }
                    await AutoSendEmail.customerOrder(this.app, 'auto-email-shipment-arrival', data.orderData.orderID, data.orderData.email, data.orderData.language);
                } else {
                    if (data.orderData.orderStatus !== '-1') {
                        for (const new_line_item of data.orderData.lineItems) {
                            const og_line_items = origin[0].orderData.lineItems.find((dd: any) => {
                                return dd.id === new_line_item.id && dd.spec.join('') === new_line_item.spec.join('');
                            });
                            for (const key of Object.keys(new_line_item.deduction_log)) {
                                const u_: number = new_line_item.deduction_log[key];
                                const o_: number = og_line_items.deduction_log[key];
                                await new Shopping(this.app, this.token).calcVariantsStock((u_ - o_) * -1, key, new_line_item.id, new_line_item.spec);
                            }
                        }
                    }
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
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'putOrder Error:' + e, null);
        }
    }

    public async cancelOrder(order_id: string) {
        try {
            const orderList = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_checkout
                 WHERE cart_token = ?;
                `,
                [order_id]
            );

            if (orderList.length !== 1) {
                return { data: false };
            }

            const origin = orderList[0];
            const orderData = origin.orderData;
            const proofPurchase = orderData.proof_purchase === undefined;
            const paymentStatus = origin.status === undefined || origin.status === 0 || origin.status === -1;
            const progressStatus = orderData.progress === undefined || orderData.progress === 'wait';
            const orderStatus = orderData.orderStatus === undefined || `${orderData.orderStatus}` === '0';

            if (proofPurchase && paymentStatus && progressStatus && orderStatus) {
                orderData.orderStatus = '-1';
                const record = { time: this.formatDateString(), record: '顧客手動取消訂單' };
                if (orderData.editRecord) {
                    orderData.editRecord.push(record);
                } else {
                    orderData.editRecord = [record];
                }
            }

            await db.query(
                `UPDATE \`${this.app}\`.t_checkout
                 SET orderData = ?
                 WHERE cart_token = ?;`,
                [JSON.stringify(orderData), order_id]
            );

            return { data: true };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'cancelOrder Error:' + e, null);
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
            await AutoSendEmail.customerOrder(this.app, 'proof-purchase', order_id, orderData.email, orderData.language);

            if (orderData.customer_info.phone) {
                let sns = new SMS(this.app);
                await sns.sendCustomerSns('sns-proof-purchase', order_id, orderData.customer_info.phone);
                console.log('訂單待核款簡訊寄送成功');
            }
            if (orderData.customer_info.lineID) {
                let line = new LineMessage(this.app);
                await line.sendCustomerLine('line-proof-purchase', order_id, orderData.customer_info.lineID);
                console.log('付款成功line訊息寄送成功');
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
        phone?: string;
        status?: string;
        searchType?: string;
        shipment?: string;
        progress?: string;
        orderStatus?: string;
        created_time?: string;
        orderString?: string;
        archived?: string;
        returnSearch?: string;
        distribution_code?: string;
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

            if (query.distribution_code) {
                let codes = query.distribution_code.split(',');
                let temp = '';
                temp += `JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.distribution_info.code')) IN (${codes.map((code) => `"${code}"`).join(',')})`;
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
                        (created_time BETWEEN ${db.escape(`${created_time[0]}`)} 
                        AND ${db.escape(`${created_time[1]}`)})
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
            const orderMath = [];

            // JSON_EXTRACT(orderData, '$.customer_info.phone')
            query.email && orderMath.push(`(email=${db.escape(query.email)})`);
            query.phone && orderMath.push(`(email=${db.escape(query.phone)})`);
            if (orderMath.length) {
                querySql.push(`(${orderMath.join(' or ')})`);
            }
            query.id && querySql.push(`(content->>'$.id'=${query.id})`);

            if (query.filter_type === 'true' || query.archived) {
                if (query.archived === 'true') {
                    querySql.push(`(orderData->>'$.archived'="${query.archived}") AND (JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) IS NULL 
OR JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.orderStatus')) NOT IN (-99)) `);
                } else {
                    querySql.push(`((orderData->>'$.archived'="${query.archived}") or (orderData->>'$.archived' is null))`);
                }
            } else if (query.filter_type === 'normal') {
                querySql.push(`((orderData->>'$.archived' is null) or (orderData->>'$.archived'!='true'))`);
            }
            if (!(query.filter_type === 'true' || query.archived)) {
                querySql.push(`((orderData->>'$.orderStatus' is null) or (orderData->>'$.orderStatus' NOT IN (-99)))`);
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
            throw exception.BadRequestError('BAD_REQUEST', 'getCheckOut Error:' + e, null);
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

                await AutoSendEmail.customerOrder(this.app, 'auto-email-payment-successful', order_id, cartData.email, cartData.orderData.language);

                if (cartData.orderData.customer_info.phone) {
                    let sns = new SMS(this.app);
                    await sns.sendCustomerSns('auto-sns-payment-successful', order_id, cartData.orderData.customer_info.phone);
                    console.log('付款成功簡訊寄送成功');
                }
                if (cartData.orderData.customer_info.lineID) {
                    let line = new LineMessage(this.app);
                    await line.sendCustomerLine('auto-line-payment-successful', order_id, cartData.orderData.customer_info.lineID);
                    console.log('付款成功line訊息寄送成功');
                }

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
        try {
            content.variants = content.variants ?? [];
            content.min_price = undefined;
            content.max_price = undefined;
            if (content.id) {
                await db.query(
                    `DELETE
                     FROM \`${this.app}\`.t_variants
                     WHERE (product_id = ${content.id})
                       AND id > 0
                    `,
                    []
                );
            }
            const store_config = await new User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            await Promise.all(
                content.variants.map((a: any) => {
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
                    a.stockList = a.stockList || {};
                    if (a.show_understocking === 'false') {
                        a.stock = 0;
                        a.stockList = {};
                    } else if (Object.keys(a.stockList).length === 0) {
                        //適應舊版庫存更新
                        a.stockList[store_config.list[0].id] = { count: a.stock };
                    }
                    return new Promise(async (resolve, reject) => {
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
                        resolve(true);
                    });
                })
            );

            await db.query(
                `UPDATE \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 WHERE id = ?
                `,
                [
                    {
                        content: JSON.stringify(content),
                    },
                    content.id,
                ]
            );
        } catch (error) {
            throw exception.BadRequestError('BAD_REQUEST', 'postVariantsAndPriceValue Error:' + e, null);
        }
    }

    public async updateVariantsWithSpec(data: any, product_id: string, spec: string[]) {
        const sql =
            spec.length > 0
                ? `AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(${spec
                      .map((data: string) => {
                          return `\"${data}\"`;
                      })
                      .join(',')}));`
                : '';

        try {
            await db.query(
                `UPDATE \`${this.app}\`.\`t_variants\`
                 SET ?
                 WHERE product_id = ? ${sql}
                `,
                [
                    {
                        content: JSON.stringify(data),
                    },
                    product_id,
                ]
            );
        } catch (e: any) {
            console.error('error -- ', e);
        }
    }

    //更新庫存數量
    public async calcVariantsStock(calc: number, stock_id: string, product_id: string, spec: string[]) {
        try {
            const pd_data = (
                await db.query(
                    `select *
                 from \`${this.app}\`.t_manager_post
                 where id = ?`,
                    [product_id]
                )
            )[0]['content'];
            const store_config = await new User(this.app).getConfigV2({ key: 'store_manager', user_id: 'manager' });
            const variant_s: any = pd_data.variants.find((dd: any) => {
                return dd.spec.join('-') === spec.join('-');
            });
            if (Object.keys(variant_s.stockList).length === 0) {
                //適應舊版庫存更新
                variant_s.stockList[store_config.list[0].id] = { count: variant_s.stock };
            }
            if (variant_s.stockList[stock_id]) {
                variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count || 0;
                variant_s.stockList[stock_id].count = variant_s.stockList[stock_id].count + calc;
                if (variant_s.stockList[stock_id].count < 0) {
                    variant_s.stockList[stock_id].count = 0;
                }
            }
            await this.postVariantsAndPriceValue(pd_data);
        } catch (e) {
            console.log('error -- cant find variants', e);
        }
    }

    async getDataAnalyze(tags: string[], query?: any) {
        try {
            console.log('AnalyzeTimer Start');
            const timer: any = {};
            query = query || '{}';

            if (tags.length > 0) {
                const result = {} as any;
                let pass = 0;
                await new Promise(async (resolve, reject) => {
                    for (const tag of tags) {
                        console.log(`tag ===> ${tag}`);
                        new Promise(async (resolve, reject) => {
                            const start = new Date();
                            try {
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
                                    case 'hot_products_all':
                                        result[tag] = await this.getHotProducts('all', query);
                                        break;
                                    case 'hot_products_today':
                                        result[tag] = await this.getHotProducts('day');
                                        break;
                                    // 訂單平均
                                    case 'order_avg_sale_price':
                                        result[tag] = await this.getOrderAvgSalePrice(query);
                                        break;
                                    case 'order_avg_sale_price_month':
                                        result[tag] = await this.getOrderAvgSalePriceMonth(query);
                                        break;
                                    case 'order_avg_sale_price_year':
                                        result[tag] = await this.getOrderAvgSalePriceYear(query);
                                        break;
                                    case 'order_avg_sale_price_custom':
                                        result[tag] = await this.getOrderAvgSalePriceCustomer(query);
                                        break;
                                    // 總訂單
                                    case 'orders_per_month_1_year':
                                        result[tag] = await this.getOrdersPerMonth1Year(query);
                                        break;
                                    case 'orders_per_month_2_week':
                                        result[tag] = await this.getOrdersPerMonth2week(query);
                                        break;
                                    case 'orders_per_month':
                                        result[tag] = await this.getOrdersPerMonth(query);
                                        break;
                                    case 'orders_per_month_custom':
                                        result[tag] = await this.getOrdersPerMonthCostom(query);
                                        break;
                                    // 總銷售額
                                    case 'sales_per_month_2_week':
                                        result[tag] = await this.getSalesPerMonth2week(query);
                                        break;
                                    case 'sales_per_month_1_year':
                                        result[tag] = await this.getSalesPerMonth1Year(query);
                                        break;
                                    case 'sales_per_month_1_month':
                                        result[tag] = await this.getSalesPerMonth(query);
                                        break;
                                    case 'sales_per_month_custom':
                                        result[tag] = await this.getSalesPerMonthCustom(query);
                                        break;
                                    // xxxx
                                    case 'order_today':
                                        result[tag] = await this.getOrderToDay();
                                        break;
                                    // 註冊數
                                    case 'recent_register_today':
                                        result[tag] = await this.getRegisterYear();
                                        break;
                                    case 'recent_register_week':
                                        result[tag] = await this.getRegisterYear();
                                        break;
                                    case 'recent_register_month':
                                        result[tag] = await this.getRegisterMonth();
                                        break;
                                    case 'recent_register_year':
                                        result[tag] = await this.getRegisterYear();
                                        break;
                                    case 'recent_register_custom':
                                        result[tag] = await this.getRegisterCustom(query);
                                        break;
                                    // 瀏覽人數
                                    case 'active_recent_custom':
                                        result[tag] = await this.getActiveRecentCustom(query);
                                        break;
                                    case 'active_recent_month':
                                        result[tag] = await this.getActiveRecentMonth();
                                        break;
                                    case 'active_recent_year':
                                        result[tag] = await this.getActiveRecentYear();
                                        break;
                                    case 'active_recent_2week':
                                        result[tag] = await this.getActiveRecentWeek();
                                        break;
                                }
                                timer[tag] = (new Date().getTime() - start.getTime()) / 1000;
                                resolve(true);
                            } catch (e) {
                                resolve(false);
                            }
                        }).then(() => {
                            pass++;
                            if (pass === tags.length) {
                                resolve(true);
                            }
                        });
                    }
                    if (pass === tags.length) {
                        resolve(true);
                    }
                });

                function wasteTimeRank(obj: Record<string, number>, n: number): { key: string; value: number }[] {
                    const sortedEntries = Object.entries(obj)
                        .map(([key, value]) => ({ key, value }))
                        .sort((a, b) => b.value - a.value);
                    return sortedEntries.slice(0, n);
                }

                console.log('AnalyzeTimer ==>', timer);

                return result;
            }
            return { result: false };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getDataAnalyze Error:' + e, null);
        }
    }

    generateTimeRange(index: number): { startISO: string; endISO: string } {
        const now = new Date();
        const ONE_DAY_TIME = 24 * 60 * 60 * 1000;

        // 計算當天的開始和結束時間
        const startDate = new Date(now.getTime() - (index + 1) * ONE_DAY_TIME); // 往前推指定天數
        const endDate = new Date(startDate.getTime() + ONE_DAY_TIME); // 往後加一天

        // 設定開始時間為當天的 16:00:00.000Z
        startDate.setUTCHours(16, 0, 0, 0);

        // 設定結束時間為隔天的 16:00:00.000Z
        endDate.setUTCHours(16, 0, 0, 0);

        // 格式化為 ISO 字串
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();

        return { startISO, endISO };
    }

    formatDateString(isoDate?: string): string {
        // 使用給定的 ISO 8601 日期字符串，或建立一個當前時間的 Date 對象
        const date = isoDate ? new Date(isoDate) : new Date();

        // 提取年、月、日、時、分
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // 格式化為所需的字符串
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    async getActiveRecentYear() {
        const endDate = moment.tz('Asia/Taipei').toDate();
        endDate.setMonth(endDate.getMonth() + 1, 1);

        const startDate = moment.tz('Asia/Taipei').toDate();
        startDate.setMonth(endDate.getMonth() - 12);

        const sql = `
            SELECT mac_address, created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
            AND req_type = 'file'
            AND created_time BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
            GROUP BY id, mac_address
        `;
        const queryData = await db.query(sql, []);

        const now = moment.tz('Asia/Taipei').toDate(); // 當前時間
        const dataList = Array.from({ length: 12 }, (_, index) => {
            // 計算第 index 個月前的日期
            const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1);

            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1

            // 篩選該月份的資料
            const filteredData = queryData.filter((item: any) => {
                const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month;
            });

            // 計算不重複的 mac_address
            const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

            return {
                year,
                month,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });

        const result = dataList.map((data) => data.unique_count);

        return {
            count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
        };
    }

    async getActiveRecentWeek() {
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL 14 DAY)) AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;

        const queryData = await db.query(sql, []);

        const now = moment.tz('Asia/Taipei').toDate(); // 當前時間
        const dataList = Array.from({ length: 14 }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期

            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
            const day = targetDate.getDate();

            // 篩選該日期的資料
            const filteredData = queryData.filter((item: any) => {
                const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });

            // 計算不重複的 mac_address
            const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });

        const result = dataList.map((data) => data.unique_count);

        return {
            count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
        };
    }

    async getActiveRecentMonth() {
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} BETWEEN (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL 30 DAY)) AND ${convertTimeZone('NOW()')}
            GROUP BY id, mac_address
        `;

        const queryData = await db.query(sql, []);

        const now = moment.tz('Asia/Taipei').toDate(); // 當前時間
        const dataList = Array.from({ length: 30 }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期

            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
            const day = targetDate.getDate();

            // 篩選該日期的資料
            const filteredData = queryData.filter((item: any) => {
                const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });

            // 計算不重複的 mac_address
            const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });

        const result = dataList.map((data) => data.unique_count);

        return {
            count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
        };
    }

    async getActiveRecentCustom(query: string) {
        const qData = JSON.parse(query);
        const formatStartDate = `"${Tool.replaceDatetime(qData.start)}"`;
        const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;
        const days = this.diffDates(new Date(qData.start), new Date(qData.end));
        const sql = `
            SELECT mac_address, ${convertTimeZone('created_time')} AS created_time
            FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
            WHERE app_name = ${db.escape(this.app)}
              AND ip != 'ffff:127.0.0.1'
                AND req_type = 'file'
                AND ${convertTimeZone('created_time')} 
                BETWEEN ${convertTimeZone(formatStartDate)} 
                AND ${convertTimeZone(formatEndDate)}
            GROUP BY id, mac_address
        `;

        const queryData = await db.query(sql, []);

        const now = moment(qData.end).tz('Asia/Taipei').clone().toDate(); // 當前時間
        const dataList = Array.from({ length: days }, (_, index) => {
            const targetDate = new Date(now.getTime());
            targetDate.setDate(new Date(now.getTime()).getDate() - index); // 設定為第 index 天前的日期

            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1; // 月份從 0 開始，需要加 1
            const day = targetDate.getDate();

            // 篩選該日期的資料
            const filteredData = queryData.filter((item: any) => {
                const date = moment.tz(item.created_time, 'UTC').clone().tz('Asia/Taipei').toDate();
                return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
            });

            // 計算不重複的 mac_address
            const uniqueMacAddresses = new Set(filteredData.map((item: any) => item.mac_address));

            return {
                year,
                month,
                day,
                total_count: filteredData.length,
                unique_count: uniqueMacAddresses.size,
            };
        });

        const result = dataList.map((data) => data.unique_count);

        return {
            count_array: result.reverse(), // 將結果反轉，保證時間順序為最近到最遠
        };
    }

    async getRegisterMonth() {
        try {
            const countArray: any = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        countArray[index] = data[0]['count(1)'];
                        pass++;
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .map((dd) => {
                        return parseInt(dd);
                    })
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    })
                    .reverse(),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getRegisterCustom(query: string) {
        try {
            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;

            const countArray: any = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        countArray[index] = data[0]['count(1)'];
                        pass++;
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .map((dd) => {
                        return parseInt(dd);
                    })
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    })
                    .reverse(),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getRegister2week() {
        try {
            const countArray: any = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        countArray[index] = data[0]['count(1)'];
                        pass++;
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .map((dd) => {
                        return parseInt(dd);
                    })
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    })
                    .reverse(),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getRegisterYear() {
        try {
            const formatJsonData: { sql: string; data: any[] }[] = [];
            const countArray: any = {};
            const order = await db.query(
                `SELECT count(1)
                 FROM \`${this.app}\`.t_user
                 WHERE DATE (created_time) = CURDATE()`,
                []
            );

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthRegisterSQL = `
                        SELECT count(1)
                        FROM \`${this.app}\`.t_user
                        WHERE MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                    `;
                    db.query(monthRegisterSQL, []).then((data) => {
                        pass++;
                        countArray[index] = data[0]['count(1)'];
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                //用戶總數
                today: order[0]['count(1)'],
                //每月紀錄
                count_register: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    })
                    .reverse(),
                //兩週紀錄
                count_2_week_register: (await this.getRegister2week()).countArray,
            };
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'getOrderToDay Error:' + e, null);
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

    async getHotProducts(duration: 'month' | 'day' | 'all', query?: string) {
        try {
            const qData = JSON.parse(query || '{}');
            console.log(qData);

            const sqlArray = ['1=1'];
            if (qData.filter_date === 'custom' && qData.start && qData.end) {
                const formatStartDate = `"${Tool.replaceDatetime(qData.start)}"`;
                const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;

                sqlArray.push(`
                    (${convertTimeZone('created_time')} 
                    BETWEEN ${convertTimeZone(formatStartDate)} 
                    AND ${convertTimeZone(formatEndDate)})
                `);
            }

            if (qData.come_from) {
                switch (qData.come_from) {
                    case 'all':
                        break;
                    case 'website':
                        sqlArray.push(`
                            (orderData->>'$.orderSource' <> 'POS')
                        `);
                        break;
                    case 'store':
                        sqlArray.push(`
                            (orderData->>'$.orderSource' = 'POS')
                        `);
                        break;
                    default:
                        sqlArray.push(`
                            (orderData->>'$.pos_info.where_store' = '${qData.come_from}')
                        `);
                        break;
                }
            }

            if (qData.filter_date) {
                const text = (() => {
                    switch (qData.filter_date) {
                        case 'today':
                            return '1 DAY';
                        case 'week':
                            return '7 DAY';
                        case '1m':
                            return '30 DAY';
                        case 'year':
                            return '1 YEAR';
                    }
                })();

                if (text) {
                    sqlArray.push(`
                        ${convertTimeZone('created_time')} 
                        BETWEEN (DATE_SUB(${convertTimeZone('CURDATE()')}, INTERVAL ${text})) 
                        AND ${convertTimeZone('CURDATE()')}
                    `);
                }
            }

            const checkoutSQL = `
                SELECT *
                FROM \`${this.app}\`.t_checkout
                WHERE status = 1
                  AND ${(() => {
                      switch (duration) {
                          case 'day':
                              return `created_time BETWEEN  CURDATE() AND CURDATE() + INTERVAL 1 DAY - INTERVAL 1 SECOND`;
                          case 'month':
                              return `(created_time BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW())`;
                          case 'all':
                              return sqlArray.join(' AND ');
                      }
                  })()};
            `;

            const checkouts = await db.query(checkoutSQL, []);
            const series = [];
            const categories = [];
            const product_list: {
                title: string;
                count: number;
                preview_image: string;
                sale_price: number;
                pos_info: any;
            }[] = [];

            for (const checkout of checkouts) {
                if (Array.isArray(checkout.orderData.lineItems)) {
                    for (const item1 of checkout.orderData.lineItems) {
                        const index = product_list.findIndex((item2) => item1.title === item2.title);
                        if (index === -1) {
                            product_list.push({
                                title: item1.title,
                                count: item1.count,
                                preview_image: (item1 as any).preview_image,
                                sale_price: item1.sale_price,
                                pos_info: checkout.orderData.pos_info,
                            });
                        } else {
                            product_list[index].count += item1.count;
                            product_list[index].sale_price += item1.sale_price;
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

            return { series, categories, product_list: final_product_list };
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

    async getOrdersPerMonth2week(query: string) {
        try {
            const qData = JSON.parse(query);
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT id, orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            } else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrdersPerMonth(query: string) {
        try {
            const qData = JSON.parse(query);
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            } else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrdersPerMonthCostom(query: string) {
        try {
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${formatEndDate}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            } else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrdersPerMonth1Year(query: string) {
        try {
            const qData = JSON.parse(query);
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += 1;
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += 1;
                                }
                            } else {
                                total_web += 1;
                            }
                            total += 1;
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    static isComeStore(checkout: any, qData: any) {
        try {
            return checkout.pos_info.where_store === qData.come_from;
        } catch (error) {
            return false;
        }
    }

    async getSalesPerMonth1Year(query: string) {
        try {
            const qData = JSON.parse(query);
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getSalesPerMonth2week(query: string) {
        try {
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            const qData = JSON.parse(query);

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getSalesPerMonth(query: string) {
        try {
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            const qData = JSON.parse(query);

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from && qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    diffDates(startDateObj: Date, endDateObj: Date) {
        var timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    async getSalesPerMonthCustom(query: string) {
        try {
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            const qData = JSON.parse(query);

            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = total_store;
                        countArrayPos[index] = total_pos;
                        countArrayWeb[index] = total_web;
                        countArray[index] = total;
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrderAvgSalePriceYear(query: string) {
        try {
            const qData = JSON.parse(query);
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};
            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 12; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} MONTH))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === 12) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrderAvgSalePrice(query: string) {
        try {
            const qData = JSON.parse(query);
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 14; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === 14) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrderAvgSalePriceMonth(query: string) {
        try {
            const qData = JSON.parse(query);
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < 30; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone('NOW()')}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let store_count = 0;
                        let web_count = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === 30) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getOrderAvgSalePriceCustomer(query: string) {
        try {
            const countArray: any = {};
            const countArrayPos: any = {};
            const countArrayWeb: any = {};
            const countArrayStore: any = {};

            const qData = JSON.parse(query);
            const days = this.diffDates(new Date(qData.start), new Date(qData.end));
            const formatEndDate = `"${Tool.replaceDatetime(qData.end)}"`;

            let pass = 0;
            await new Promise((resolve, reject) => {
                for (let index = 0; index < days; index++) {
                    const monthCheckoutSQL = `
                        SELECT orderData
                        FROM \`${this.app}\`.t_checkout
                        WHERE
                            DAY (${convertTimeZone('created_time')}) = DAY (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND MONTH (${convertTimeZone('created_time')}) = MONTH (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND YEAR (${convertTimeZone('created_time')}) = YEAR (DATE_SUB(${convertTimeZone(formatEndDate)}
                            , INTERVAL ${index} DAY))
                          AND status = 1;
                    `;
                    db.query(monthCheckoutSQL, []).then((data) => {
                        pass++;
                        let total = 0;
                        let total_pos = 0;
                        let total_web = 0;
                        let total_store = 0;
                        let pos_count = 0;
                        let web_count = 0;
                        let store_count = 0;
                        data.map((checkout: any) => {
                            if (checkout.orderData.orderSource === 'POS') {
                                pos_count++;
                                total_pos += parseInt(checkout.orderData.total, 10);
                                if (qData.come_from.includes('store_') && Shopping.isComeStore(checkout.orderData, qData)) {
                                    store_count++;
                                    total_store += parseInt(checkout.orderData.total, 10);
                                }
                            } else {
                                web_count++;
                                total_web += parseInt(checkout.orderData.total, 10);
                            }
                            total += parseInt(checkout.orderData.total, 10);
                        });
                        countArrayStore[index] = Math.floor(total_store / store_count);
                        countArrayPos[index] = Math.floor(total_pos / pos_count);
                        countArrayWeb[index] = Math.floor(total_web / web_count);
                        countArray[index] = Math.floor(total / data.length);
                        if (pass === days) {
                            resolve(true);
                        }
                    });
                }
            });

            return {
                countArray: Object.keys(countArray)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArray[dd];
                    }),
                countArrayPos: Object.keys(countArrayPos)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayPos[dd];
                    }),
                countArrayStore: Object.keys(countArrayStore)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayStore[dd];
                    }),
                countArrayWeb: Object.keys(countArrayWeb)
                    .sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10))
                    .map((dd) => {
                        return countArrayWeb[dd];
                    }),
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getRecentActiveUser Error:' + e, null);
        }
    }

    async getCollectionProducts(tags: string) {
        try {
            const products_sql = `SELECT *
                                  FROM \`${this.app}\`.t_manager_post
                                  WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await db.query(products_sql, []);
            const tagArray = tags.split(',');
            return products.filter((product: any) => {
                return tagArray.some((tag) => product.content.collection.includes(tag));
            });
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getCollectionProducts Error:' + e, null);
        }
    }

    async getCollectionProductVariants(tags: string) {
        try {
            const products_sql = `SELECT *
                                  FROM \`${this.app}\`.t_manager_post
                                  WHERE JSON_EXTRACT(content, '$.type') = 'product';`;
            const products = await db.query(products_sql, []);
            const tagArray = tags.split(',');
            const filterProducts = products.filter((product: any) => {
                return tagArray.some((tag) => product.content.collection.includes(tag));
            });

            if (filterProducts.length === 0) {
                return [];
            }

            const sql = `
                SELECT v.id,
                       v.product_id,
                       v.content                                            as variant_content,
                       p.content                                            as product_content,
                       CAST(JSON_EXTRACT(v.content, '$.stock') AS UNSIGNED) as stock
                FROM \`${this.app}\`.t_variants AS v
                         JOIN
                     \`${this.app}\`.t_manager_post AS p ON v.product_id = p.id
                WHERE product_id in (${filterProducts.map((item: { id: number }) => item.id).join(',')})
                ORDER BY id DESC
            `;

            const data = await db.query(sql, []);
            return data;
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

            const formatData = {
                array: [],
                code: replace.code,
                title: replace.title,
                seo_title: replace.seo_title,
                seo_content: replace.seo_content,
                seo_image: replace.seo_image,
                language_data: replace.language_data,
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
        content.seo = content.seo ?? {};
        content.seo.domain = content.seo.domain || content.title;
        const language = await App.getSupportLanguage(this.app);
        for (const b of language) {
            const find_conflict = await db.query(
                `select count(1)
                 from \`${this.app}\`.\`t_manager_post\`
                 where content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
                `,
                []
            );
            if (find_conflict[0]['count(1)'] > 0) {
                throw exception.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
                    message: '網域已被使用',
                    code: '733',
                });
            }
        }
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
            const store_info = await new User(this.app).getConfigV2({
                key: 'store-information',
                user_id: 'manager',
            });

            if (content.collection.length > 0) {
                //有新類別要處理
                await this.updateCollectionFromUpdateProduct(content.collection);
            }

            let productArray: any = content.data;
            await Promise.all(
                productArray.map((product: any, index: number) => {
                    return new Promise(async (resolve, reject) => {
                        product.type = 'product';
                        //判斷是更新時
                        if (product.id) {
                            const og_data = (
                                await db.query(
                                    `select *
                                     from \`${this.app}\`.\`t_manager_post\`
                                     where id = ?`,
                                    [product.id]
                                )
                            )[0];

                            if (og_data) {
                                delete product['content'];
                                delete product['preview_image'];
                                const og_content = og_data['content'];
                                if (og_content.language_data && og_content.language_data[store_info.language_setting.def]) {
                                    og_content.language_data[store_info.language_setting.def].seo = product.seo;
                                    og_content.language_data[store_info.language_setting.def].title = product.title;
                                }

                                product = {
                                    ...og_content,
                                    ...product,
                                };
                                product.preview_image = og_data['content'].preview_image || [];
                                productArray[index] = product;
                            } else {
                                console.log(`product-not-in==>`, product);
                            }
                        } else {
                            console.log(`no-product-id==>`, product);
                        }
                        resolve(true);
                    });
                })
            );
            // return
            let max_id =
                (
                    await db.query(
                        `select max(id)
                                          from \`${this.app}\`.t_manager_post`,
                        []
                    )
                )[0]['max(id)'] || 0;
            const data = await db.query(
                `replace
                INTO \`${this.app}\`.\`t_manager_post\` (id,userID,content) values ?`,
                [
                    productArray.map((product: any) => {
                        if (!product.id) {
                            product.id = max_id++;
                        }
                        product.type = 'product';
                        this.checkVariantDataType(product.variants);
                        return [product.id || null, this.token?.userID, JSON.stringify(product)];
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
            product.id = product.id || insertIDStart++;
            return new Shopping(this.app, this.token).postVariantsAndPriceValue(product);
        });
        await Promise.all(promises);
    }

    async putProduct(content: any) {
        if (content.language_data) {
            const language = await App.getSupportLanguage(this.app);
            for (const b of language) {
                const find_conflict = await db.query(
                    `select count(1)
                     from \`${this.app}\`.\`t_manager_post\`
                     where content ->>'$.language_data."${b}".seo.domain'='${decodeURIComponent(content.language_data[b].seo.domain)}'
                       and id != ${content.id}`,
                    []
                );
                if (find_conflict[0]['count(1)'] > 0) {
                    throw exception.BadRequestError('BAD_REQUEST', 'DOMAIN ALREADY EXISTS:', {
                        message: '網域已被使用',
                        code: '733',
                    });
                }
            }
        }

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

    checkDuring(jsonData: { startDate: string; startTime: string; endDate?: string; endTime?: string }): boolean {
        const now = new Date().getTime();
        const startDateTime = new Date(`${jsonData.startDate}T${jsonData.startTime}`).getTime();
        if (isNaN(startDateTime)) return false;

        if (!jsonData.endDate || !jsonData.endTime) return true;

        const endDateTime = new Date(`${jsonData.endDate}T${jsonData.endTime}`).getTime();
        if (isNaN(endDateTime)) return false;

        return now >= startDateTime && now <= endDateTime;
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
        productType?: string;
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

            //判斷有帶入商品類型時，顯示商品類型，反之預設折是一班商品
            if (query.productType !== 'all') {
                const queryOR = [];
                if (query.productType) {
                    query.productType.split(',').map((dd) => {
                        if (dd === 'hidden') {
                            queryOR.push(`(p.content->>'$.visible' = "false")`);
                        } else {
                            queryOR.push(`(p.content->>'$.productType.${dd}' = "true")`);
                        }
                    });
                } else if (!query.id) {
                    queryOR.push(`(p.content->>'$.productType.product' = "true")`);
                }
                querySql.push(
                    `(${queryOR
                        .map((dd) => {
                            return ` ${dd} `;
                        })
                        .join(' or ')})`
                );
            }

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

    async getDomain(query: { id?: string; search?: string; domain?: string }) {
        try {
            let querySql = [`(content->>'$.type'='product')`];

            if (query.search) {
                querySql.push(
                    `(${[
                        `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${query.search}%'))`,
                        `JSON_EXTRACT(content, '$.variants[*].sku') LIKE '%${query.search}%'`,
                        `JSON_EXTRACT(content, '$.variants[*].barcode') LIKE '%${query.search}%'`,
                    ].join(' or ')})`
                );
            }
            if (query.domain) {
                querySql.push(`content->>'$.seo.domain'='${decodeURIComponent(query.domain)}'`);
            }
            if (`${query.id || ''}`) {
                if (`${query.id}`.includes(',')) {
                    querySql.push(`id in (${query.id})`);
                } else {
                    querySql.push(`id = ${query.id}`);
                }
            }

            const data = await this.querySqlBySEO(querySql, {
                limit: 10000,
                page: 0,
                ...query,
            });
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

    async postCustomerInvoice(obj: { orderID: any; invoice_data: any; orderData: any }) {
        await this.putOrder({
            id: obj.orderData.id,
            orderData: obj.orderData.orderData,
            status: obj.orderData.status,
        });
        await new Invoice(this.app).postCheckoutInvoice(obj.orderID, obj.invoice_data.getPaper == 'Y');
        await new Invoice(this.app).updateInvoice({
            orderID: obj.orderData.cart_token,
            invoice_data: obj.invoice_data,
        });
    }

    async voidInvoice(obj: { invoice_no: string; reason: string; createDate: string }) {
        const config = await app.getAdConfig(this.app, 'invoice_setting');
        const passData = {
            MerchantID: config.merchNO,
            InvoiceNo: obj.invoice_no,
            InvoiceDate: obj.createDate,
            Reason: obj.reason,
        };
        let dbData = await db.query(
            `SELECT *
             FROM \`${this.app}\`.t_invoice_memory
             WHERE invoice_no = ?`,
            [obj.invoice_no]
        );
        dbData = dbData[0];
        dbData.invoice_data.remark = dbData.invoice_data?.remark ?? {};
        dbData.invoice_data.remark.voidReason = obj.reason;
        await EcInvoice.voidInvoice({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            app_name: this.app,
            invoice_data: passData,
            beta: config.point === 'beta',
        });
        await db.query(
            `UPDATE \`${this.app}\`.t_invoice_memory
             SET ?
             WHERE invoice_no = ?`,
            [{ status: 2, invoice_data: JSON.stringify(dbData.invoice_data) }, obj.invoice_no]
        );
    }

    async allowanceInvoice(obj: { invoiceID: string; allowanceData: any; orderID: string; orderData: any; allowanceInvoiceTotalAmount: string; itemList: any; invoiceDate: string }) {
        const config = await app.getAdConfig(this.app, 'invoice_setting');
        let invoiceData = await db.query(
            `
                SELECT *
                FROM \`${this.app}\`.t_invoice_memory
                WHERE invoice_no = "${obj.invoiceID}"
            `,
            []
        );
        invoiceData = invoiceData[0];
        const passData = {
            MerchantID: config.merchNO,
            InvoiceNo: obj.invoiceID,
            InvoiceDate: invoiceData.invoice_data.response.InvoiceDate.split('+')[0],
            AllowanceNotify: 'E',
            CustomerName: invoiceData.invoice_data.original_data.CustomerName,
            NotifyPhone: invoiceData.invoice_data.original_data.CustomerPhone,
            NotifyMail: invoiceData.invoice_data.original_data.CustomerEmail,
            AllowanceAmount: obj.allowanceInvoiceTotalAmount,
            Items: obj.allowanceData.invoiceArray,
        };
        return await EcInvoice.allowanceInvoice({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            app_name: this.app,
            allowance_data: passData,
            beta: config.point === 'beta',
            db_data: obj.allowanceData,
            order_id: obj.orderID,
        });
    }

    async voidAllowance(obj: { invoiceNo: string; allowanceNo: string; voidReason: string }) {
        const config = await app.getAdConfig(this.app, 'invoice_setting');
        const passData = {
            MerchantID: config.merchNO,
            InvoiceNo: obj.invoiceNo,
            AllowanceNo: obj.allowanceNo,
            Reason: obj.voidReason,
        };
        await EcInvoice.voidAllowance({
            hashKey: config.hashkey,
            hash_IV: config.hashiv,
            merchNO: config.merchNO,
            app_name: this.app,
            allowance_data: passData,
            beta: config.point === 'beta',
        });
    }

    static async currencyCovert(base: string) {
        const data: any = (
            await db.query(
                `SELECT *
                 FROM ${saasConfig.SAAS_NAME}.currency_config
                 order by id desc limit 0,1;`,
                []
            )
        )[0]['json']['rates'];
        const base_m = data[base];
        Object.keys(data).map((dd) => {
            data[dd] = data[dd] / base_m;
        });
        return data;
    }
}

function convertTimeZone(date: string) {
    return `CONVERT_TZ(${date}, '+00:00', '+08:00')`;
}
