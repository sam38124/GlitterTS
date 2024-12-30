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
type StockList = {
    [key: string]: { count: number };
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
                `
                    SELECT count(id) as c FROM \`${this.app}\`.t_variants
                    WHERE content->>'$.stockList.${json.search ?? 'store'}.count' > 0;
                `,
                []
            );

            let data = await db.query(
                `
                    SELECT * FROM \`${this.app}\`.t_variants
                    WHERE content->>'$.stockList.${json.search ?? 'store'}.count' > 0
                    LIMIT ${page * limit}, ${limit};
                `,
                []
            );

            if (data.length > 0) {
                const idString = data.map((item: any) => `"${item.product_id}"`).join(',');
                const productData = await db.query(
                    `SELECT id, content FROM \`${this.app}\`.t_manager_post
                    WHERE id in (${idString})
                    `,
                    []
                );
                data = data.filter((item: any) => {
                    const prod = productData.find((p: any) => p.id === item.product_id);
                    if (!prod) {
                        return false;
                    }
                    item.title = (() => {
                        try {
                            return prod.content.language_data['zh-TW'].title;
                        } catch (error) {
                            console.error(`product id ${prod.id} 沒有 zh-TW 的標題，使用原標題`);
                            return prod.content.title;
                        }
                    })();
                    item.count = item.content.stockList[json.search].count;
                    return true;
                });
            }

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
            const start = new Date();
            const productList: { [k: string]: any } = {};
            const variants = await db.query(
                `SELECT * FROM \`${this.app}\`.t_variants
                 WHERE content->>'$.stockList.${store_id}.count' is not null;
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
                        `UPDATE \`${this.app}\`.t_variants SET ? WHERE id = ?
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
                        `SELECT * FROM \`${this.app}\`.t_manager_post WHERE id in (${idString});
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

    public allocateStock(stockList: StockList, requiredCount: number){
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
}
