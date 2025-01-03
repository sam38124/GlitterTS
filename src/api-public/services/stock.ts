import db from '../../modules/database';
import exception from '../../modules/exception';
import UserUtil from '../../utils/UserUtil';
import config from '../../config.js';
import { sendmail } from '../../services/ses.js';
import App from '../../app.js';
import redis from '../../modules/redis.js';
import Tool from '../../modules/tool.js';
import process from 'process';
import { IToken } from '../models/Auth.js';
import { Shopping } from './shopping';

type StockList = {
    [key: string]: { count: number };
};

export type StockHistoryType = 'restocking' | 'transfer' | 'checking';

type ContentProduct = {
    variant_id: number;
    cost: number;
    note: string;
    transfer_count: number; // 預計進貨數, 預計調入數
    recent_count: number; // 實際進貨數, 實際調入數
    check_count: number; // 盤點數
    title?: string;
    spec?: string;
    sku?: '';
};

type StockHistoryData = {
    id: string;
    type: StockHistoryType;
    status: number;
    order_id: string;
    created_time: string;
    content: {
        vendor: string;
        store_in: string; // 調入庫存點
        store_in_name?: string; // 調入庫存點名稱
        store_out: string; // 調出庫存點
        store_out_name?: string; // 調出庫存點名稱
        check_member: string; // 盤點人
        check_according: 'all' | 'collection' | 'product'; // 商品盤點類型
        note: string;
        total_price?: number;
        product_list: ContentProduct[];
    };
};

export class Stock {
    public app;
    public token;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async productList(json: { page: string; limit: string; search: string }) {
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;

        try {
            const getStockTotal = await db.query(
                `SELECT count(v.id) as c
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.content ->>'$.stockList.${json.search ?? 'store'}.count'
                     > 0
                   AND v.product_id = p.id
                `,
                []
            );

            let data = await db.query(
                `SELECT v.*, p.content as product_content
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.content ->>'$.stockList.${json.search ?? 'store'}.count'
                     > 0
                   AND v.product_id = p.id
                     LIMIT ${page * limit}
                     , ${limit};
                `,
                []
            );

            data.map((item: any) => {
                item.count = item.content.stockList[json.search].count;
                item.title = (() => {
                    try {
                        return item.product_content.language_data['zh-TW'].title;
                    } catch (error) {
                        console.error(`product id ${item.product_id} 沒有 zh-TW 的標題，使用原標題`);
                        return item.product_content.title;
                    }
                })();
                return item;
            });

            return {
                total: getStockTotal[0].c,
                data,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('stock productList Error: ', error.message, null);
            }
        }
    }

    async deleteStoreProduct(store_id: string) {
        try {
            const productList: { [k: string]: any } = {};
            const variants = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_variants
                 WHERE content ->>'$.stockList.${store_id}.count' is not null;
                `,
                []
            );

            if (variants.length == 0) {
                return { data: true, process: '' };
            }

            const promise = await new Promise<void>((resolve) => {
                let n = 0;
                for (const variant of variants) {
                    delete variant.content.stockList[store_id];
                    db.query(
                        `UPDATE \`${this.app}\`.t_variants
                         SET ?
                         WHERE id = ?
                        `,
                        [{ content: JSON.stringify(variant.content) }, variant.id]
                    ).then(() => {
                        const p = productList[`${variant.product_id}`];
                        if (p) {
                            p.push(variant.content);
                        } else {
                            productList[`${variant.product_id}`] = [variant.content];
                        }
                        n++;
                        if (n === variants.length) {
                            resolve();
                        }
                    });
                }
            }).then(async () => {
                const idString = Object.keys(productList)
                    .map((item) => `"${item}"`)
                    .join(',');

                if (idString.length > 0) {
                    const products = await db.query(
                        `SELECT *
                         FROM \`${this.app}\`.t_manager_post
                         WHERE id in (${idString});
                        `,
                        []
                    );

                    return await new Promise<void>((resolve) => {
                        let n = 0;
                        for (const product of products) {
                            product.content.variants = productList[`${product.id}`];
                            db.query(
                                `UPDATE \`${this.app}\`.t_manager_post
                                 SET ?
                                 WHERE id = ?`,
                                [{ content: JSON.stringify(product.content) }, product.id]
                            ).then(() => {
                                n++;
                                if (n === products.length) {
                                    resolve();
                                }
                            });
                        }
                    }).then(() => {
                        return { data: true, process: 't_variants, t_manager_post' };
                    });
                }
                return { data: true, process: 't_variants' };
            });

            return promise;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('stock deleteStore Error: ', error.message, null);
            }
        }
    }

    public allocateStock(stockList: StockList, requiredCount: number) {
        let remainingCount = requiredCount;
        let totalDeduction = 0; // 紀錄所有扣除的總數
        const deductionLog: { [key: string]: number } = {}; // 記錄每個倉庫的扣除值

        // 按照 `count` 從大到小排序倉庫
        const sortedStock = Object.entries(stockList).sort(([, a], [, b]) => b.count - a.count);

        for (const [key, stock] of sortedStock) {
            if (remainingCount === 0) break; // 如果需求已經滿足，停止迴圈

            const deduction = Math.min((stock as any).count, remainingCount); // 扣除的數量為倉庫數量或剩餘需求中的較小值
            remainingCount -= deduction; // 更新剩餘需求
            totalDeduction += deduction; // 累加扣除值
            (stock as any).count -= deduction; // 更新倉庫數量
            deductionLog[key] = deduction; // 記錄本次扣除
        }

        // 紀錄最大扣除值
        const maxDeduction = Math.max(...Object.values(deductionLog), 0);

        return {
            stockList,
            deductionLog,
            totalDeduction,
            remainingCount, // 如果需求無法完全滿足，這裡會大於 0
        };
    }

    public async recoverStock(variant: any) {
        const sql =
            variant.spec.length > 0
                ? `AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(${variant.spec
                      .map((data: string) => {
                          return `\"${data}\"`;
                      })
                      .join(',')}));`
                : '';

        let variantData = await db.query(
            `
            SELECT *
            FROM \`${this.app}\`.t_variants
            WHERE \`product_id\` = "${variant.id}" ${sql}
        `,
            []
        );
        const pdDqlData = (
            await new Shopping(this.app, this.token).getProduct({
                page: 0,
                limit: 50,
                id: variant.id,
                status: 'inRange',
            })
        ).data;
        const pd = pdDqlData.content;
        const pbVariant = pd.variants.find((dd: any) => {
            return dd.spec.join('-') === variant.spec.join('-');
        });
        variantData = variantData[0];
        Object.entries(variant.deduction_log).forEach(([key, value]) => {
            pbVariant.stockList[key].count += value;
            pbVariant.stock += value;
            variantData.content.stockList[key].count += value;
            variantData.content.stock += value;
        });
        await new Shopping(this.app, this.token).updateVariantsWithSpec(variantData.content, variant.id, variant.spec);
        await db.query(
            `UPDATE \`${this.app}\`.\`t_manager_post\`
                                     SET ?
                                     WHERE 1 = 1
                                       and id = ${pdDqlData.id}`,
            [{ content: JSON.stringify(pd) }]
        );
    }

    async getHistory(json: { page: string; limit: string; search: string; type: StockHistoryType }) {
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;

        function formatDate(sqlDatetime: string): string {
            // 將 datetime 字串轉換為 JavaScript Date 物件
            const date = new Date(sqlDatetime);

            // 取得年、月、日
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是從 0 開始的，需要加 1
            const day = String(date.getDate()).padStart(2, '0');

            // 組合成 'yyyy-mm-dd' 格式
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        }

        try {
            const getHistoryTotal = await db.query(
                `SELECT count(id) as c FROM \`${this.app}\`.t_stock_history
                WHERE 1=1
                `,
                []
            );

            const data = await db.query(
                `SELECT * FROM \`${this.app}\`.t_stock_history
                    WHERE 1=1
                    LIMIT ${page * limit}, ${limit};
                `,
                []
            );

            data.map((rowData: StockHistoryData) => {
                rowData.created_time = formatDate(rowData.created_time);
            });

            return {
                total: getHistoryTotal[0].c,
                data,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('stock getHistory Error: ', error.message, null);
            }
        }
    }

    async postHistory(json: StockHistoryData) {
        console.log('postHistory');
        console.log(json);
        try {
            json.content.product_list.map((item) => {
                delete item.title;
                delete item.spec;
                delete item.sku;
                return item;
            });

            const formatJson = JSON.parse(JSON.stringify(json));
            formatJson.order_id = `IC${new Date().getTime()}`;
            formatJson.content = JSON.stringify(json.content);
            formatJson.created_time = `${json.created_time} 00:00:00`;
            delete formatJson.id;

            await db.query(
                `INSERT INTO \`${this.app}\`.\`t_stock_history\` SET ?;
                `,
                [formatJson]
            );

            return { data: true };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('stock postHistory Error: ', error.message, null);
            }
        }
    }

    async putHistory(json: StockHistoryData) {
        console.log('putHistory');
        console.log(json);
        try {
            const formatJson = JSON.parse(JSON.stringify(json));
            formatJson.content = JSON.stringify(json.content);

            await db.query(
                `UPDATE \`${this.app}\`.t_stock_history SET ? WHERE id = ?
                `,
                [formatJson, json.id]
            );

            return { data: false };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('stock postHistory Error: ', error.message, null);
            }
        }
    }
}
