import db from '../../modules/database';
import exception from '../../modules/exception';
import Tool from '../../modules/tool.js';
import { IToken } from '../models/Auth.js';
import { Shopping } from './shopping';
import { SharePermission } from './share-permission';

type StockList = {
    [key: string]: { count: number };
};

export type StockHistoryType = 'restocking' | 'transfer' | 'checking';

type ContentProduct = {
    variant_id: number;
    cost: number;
    note: string;
    transfer_count: number; // 預計進貨數, 預計調入數
    recent_count?: number; // 實際進貨數, 實際調入數
    check_count: number; // 盤點數
    replenishment_count?: number; // 此次補貨數
    title?: string;
    spec?: string;
    sku?: '';
    barcode?: '';
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
        store_out: string; // 調出庫存點、盤點庫存點
        check_member: string; // 盤點人
        check_according: '' | 'all' | 'collection' | 'product'; // 商品盤點類型
        note: string;
        total_price?: number;
        product_list: ContentProduct[];
        changeLogs: {
            time: string;
            text: string;
            user: number;
            status: number;
            user_name?: string;
            product_list?: ContentProduct[];
        }[];
    };
};

const typeConfig: {
    [key in StockHistoryType]: {
        name: string;
        prefixId: string;
        status: {
            [key in number]: {
                title: string;
                badge: string;
            };
        };
    };
} = {
    restocking: {
        name: '進貨',
        prefixId: 'IC',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已補貨',
                badge: 'info',
            },
            2: {
                title: '待進貨',
                badge: 'warning',
            },
            3: {
                title: '核對中',
                badge: 'warning',
            },
            4: {
                title: '已暫停',
                badge: 'normal',
            },
            5: {
                title: '待補貨',
                badge: 'notify',
            },
            6: {
                title: '已取消',
                badge: 'notify',
            },
        },
    },
    transfer: {
        name: '調撥',
        prefixId: 'TB',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已補貨',
                badge: 'info',
            },
            2: {
                title: '待調撥',
                badge: 'warning',
            },
            3: {
                title: '核對中',
                badge: 'warning',
            },
            4: {
                title: '已暫停',
                badge: 'normal',
            },
            5: {
                title: '待補貨',
                badge: 'notify',
            },
            6: {
                title: '已取消',
                badge: 'notify',
            },
        },
    },
    checking: {
        name: '盤點',
        prefixId: 'PD',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已修正',
                badge: 'info',
            },
            2: {
                title: '待盤點',
                badge: 'warning',
            },
            3: {
                title: '盤點中',
                badge: 'warning',
            },
            4: {
                title: '已暫停',
                badge: 'normal',
            },
            5: {
                title: '異常',
                badge: 'notify',
            },
            6: {
                title: '已取消',
                badge: 'notify',
            },
        },
    },
};

export class Stock {
    public app;
    public token;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async productList(json: { page: string; limit: string; search: string; variant_id_list?: string }) {
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;

        try {
            const sqlArr = ['1=1'];
            if (json.variant_id_list) {
                sqlArr.push(`(v.id in (${json.variant_id_list}))`);
            }
            const sqlText = sqlArr.join(' AND ');

            const getStockTotal = await db.query(
                `SELECT count(v.id) as c
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.content ->>'$.stockList.${json.search || 'store'}.count' > 0
                   AND v.product_id = p.id
                   AND ${sqlText}
                `,
                []
            );

            let data = await db.query(
                `SELECT v.*, p.content as product_content
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.content ->>'$.stockList.${json.search || 'store'}.count' > 0
                   AND v.product_id = p.id
                   AND ${sqlText}
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

    async productStock(json: { page: string; limit: string; variant_id_list: string }) {
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;

        try {
            const sqlArr = ['1=1'];
            if (json.variant_id_list) {
                sqlArr.push(`(v.id in (${json.variant_id_list}))`);
            }
            const sqlText = sqlArr.join(' AND ');

            const getStockTotal = await db.query(
                `SELECT count(v.id) as c
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.product_id = p.id
                   AND ${sqlText}
                `,
                []
            );

            let data = await db.query(
                `SELECT v.*, p.content as product_content
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.product_id = p.id
                   AND ${sqlText}
                     LIMIT ${page * limit}
                     , ${limit};
                `,
                []
            );

            data.map((item: any) => {
                item.count = Object.values(item.content.stockList).reduce((sum: number, stock: any) => sum + stock.count, 0);
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
            pbVariant.stockList[key].count = parseInt(pbVariant.stockList[key].count as string) + parseInt(value as string);
            pbVariant.stock = parseInt(pbVariant.stock as string) + parseInt(value as string);
            variantData.content.stockList[key].count = parseInt(variantData.content.stockList[key].count) + parseInt(value as string);
            variantData.content.stock = parseInt(variantData.content.stock) + parseInt(value as string);
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

    public async shippingStock(variant: any) {
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
            pbVariant.stockList[key].count = parseInt(pbVariant.stockList[key].count as string) - parseInt(value as string);
            pbVariant.stock = parseInt(pbVariant.stock as string) - parseInt(value as string);
            variantData.content.stockList[key].count = parseInt(variantData.content.stockList[key].count) - parseInt(value as string);
            variantData.content.stock = parseInt(variantData.content.stock) - parseInt(value as string);
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

    async getHistory(json: { page: string; limit: string; search: string; type: StockHistoryType; order_id: string; queryType: string }) {
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

        const sqlArr: string[] = ['(status <> -1)', `(type = '${json.type}')`];

        if (json.order_id) {
            sqlArr.push(`(order_id = '${json.order_id}')`);
        }

        if (json.queryType && json.search) {
            switch (json.queryType) {
                case 'order_id':
                    sqlArr.push(`(order_id like '%${json.search}%')`);
                    break;
                case 'note':
                    sqlArr.push(`(JSON_EXTRACT(content, '$.note') like '%${json.search}%')`);
                    break;
            }
        }

        const sqlString = sqlArr.join(' AND ');

        try {
            if (!this.token) {
                return {
                    total: 0,
                    data: [],
                };
            }

            const getHistoryTotal = await db.query(
                `SELECT count(id) as c FROM \`${this.app}\`.t_stock_history
                WHERE 1=1 AND ${sqlString}
                `,
                []
            );

            const data = await db.query(
                `SELECT * FROM \`${this.app}\`.t_stock_history
                    WHERE 1=1 AND ${sqlString}
                    ORDER BY order_id DESC
                    LIMIT ${page * limit}, ${limit};
                `,
                []
            );

            const getPermission = (await new SharePermission(this.app, this.token).getPermission({
                page: 0,
                limit: 9999,
            })) as any;

            data.map((rowData: StockHistoryData) => {
                rowData.created_time = formatDate(rowData.created_time);
                rowData.content.changeLogs.map((log) => {
                    const findManager = getPermission.data.find((m: any) => `${m.user}` === `${log.user}`);
                    log.user_name = findManager ? findManager.config.name : '';
                    return log;
                });
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
        try {
            const typeData = typeConfig[json.type];

            json.content.product_list.map((item) => {
                delete item.title;
                delete item.spec;
                delete item.sku;
                return item;
            });
            json.content.changeLogs = [
                {
                    time: Tool.getCurrentDateTime(),
                    status: json.status,
                    text: `${typeData.name}單建立`,
                    user: this.token ? this.token.userID : 0,
                },
                {
                    time: Tool.getCurrentDateTime({ addSeconds: 1 }),
                    status: json.status,
                    text: `${typeData.name}單狀態改為「${typeData.status[json.status].title}」`,
                    user: this.token ? this.token.userID : 0,
                },
            ];

            const formatJson = JSON.parse(JSON.stringify(json));
            formatJson.order_id = `${typeData.prefixId}${new Date().getTime()}`;
            formatJson.content = JSON.stringify(json.content);
            formatJson.created_time = `${json.created_time} 00:00:00`;
            delete formatJson.id;

            await db.query(
                `INSERT INTO \`${this.app}\`.\`t_stock_history\` SET ?;
                `,
                [formatJson]
            );

            return { data: formatJson };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('stock postHistory Error: ', error.message, null);
            }
        }
    }

    async putHistory(json: StockHistoryData) {
        try {
            if (!this.token) {
                return { data: false };
            }
            const typeData = typeConfig[json.type];

            // 取得原始資料
            const getHistory = await db.query(
                `SELECT * FROM \`${this.app}\`.t_stock_history WHERE order_id = ?;
                `,
                [json.order_id]
            );
            if (!getHistory || getHistory.length !== 1) {
                return { data: false };
            }
            const originHistory = getHistory[0] as StockHistoryData;
            const originList = originHistory.content.product_list;

            // 格式化更新資料
            json.content.product_list.map((item) => {
                delete item.title;
                delete item.spec;
                delete item.sku;
                delete item.barcode;
                return item;
            });

            json.content.changeLogs.push({
                time: Tool.getCurrentDateTime(),
                status: json.status,
                text: `進貨單狀態改為「${typeData.status[json.status].title}」`,
                user: this.token.userID,
                product_list: (() => {
                    if (json.status === 1 || json.status === 5) {
                        const updateList = JSON.parse(JSON.stringify(json.content.product_list)) as ContentProduct[];

                        return updateList.map((item1) => {
                            const originVariant = originList.find((item2) => item1.variant_id === item2.variant_id);
                            if (originVariant) {
                                return {
                                    replenishment_count: (item1.recent_count ?? 0) - (originVariant.recent_count ?? 0),
                                    ...item1,
                                };
                            }
                            return item1;
                        });
                    }
                    return undefined;
                })(),
            });

            const formatJson = JSON.parse(JSON.stringify(json));
            formatJson.content = JSON.stringify(json.content);
            delete formatJson.id;

            // 改變商品與規格庫存
            const _shop = new Shopping(this.app, this.token);
            const variants = await _shop.getVariants({
                page: 0,
                limit: 9999,
                id_list: json.content.product_list.map((item) => item.variant_id).join(','),
            });
            const dataList: {
                id: number;
                product_id: number;
                product_content: any;
                variant_content: any;
            }[] = [];

            const createStockEntry = (type: 'plus' | 'minus' | 'equal', store: string, count: number, variant: any) => ({
                id: variant.id,
                product_id: variant.product_id,
                ...Stock.formatStockContent({
                    type,
                    store,
                    count,
                    product_content: variant.product_content,
                    variant_content: variant.variant_content,
                }),
            });

            for (const variant of variants.data) {
                const item = json.content.product_list.find((item) => item.variant_id === variant.id);

                if (item) {
                    const originVariant = originList.find((origin) => item.variant_id === origin.variant_id);
                    const recent_count = item.recent_count ?? 0;
                    const count = originVariant ? recent_count - (originVariant.recent_count ?? 0) : recent_count;
                    const { type, content } = json;
                    const { store_in, store_out } = content;

                    if (type === 'restocking') {
                        dataList.push(createStockEntry('plus', store_in, count, variant));
                    } else if (type === 'transfer') {
                        dataList.push(createStockEntry('plus', store_in, count, variant));
                        dataList.push(createStockEntry('minus', store_out, count, variant));
                    } else if (type === 'checking' && (json.status === 0 || json.status === 1)) {
                        dataList.push(createStockEntry('equal', store_out, recent_count, variant));
                    }
                }
            }

            // 更新產品與規格庫存
            await _shop.putVariants(dataList);

            // 更新庫存單
            await db.query(
                `UPDATE \`${this.app}\`.t_stock_history SET ? WHERE order_id = ?
                `,
                [formatJson, json.order_id]
            );

            return { data: true };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('stock postHistory Error: ', error.message, null);
            }
        }
    }

    static formatStockContent(data: { type: 'plus' | 'minus' | 'equal'; store: string; count: number; product_content: any; variant_content: any }) {
        const type = data.type;
        const store = data.store;
        const count = data.count;
        const product_content = data.product_content;
        const variant_content = data.variant_content;
        const stockList = variant_content.stockList;

        // 修改 variant stockList
        if (stockList[store]) {
            if (type === 'plus') {
                if (stockList[store].count) {
                    stockList[store].count += count;
                } else {
                    stockList[store].count = count;
                }
            } else if (type === 'minus') {
                if (stockList[store].count) {
                    stockList[store].count -= count;
                } else {
                    stockList[store].count = -count;
                }
            } else {
                stockList[store].count = count;
            }
        }

        // 修改 variant stock
        variant_content.stock = Object.keys(stockList).reduce((sum: number, key: string) => {
            if (stockList[key] && stockList[key].count) {
                return sum + stockList[key].count;
            }
            return sum;
        }, 0);

        // 修改 product variant 的 stock, stockList
        const productVariant = product_content.variants.find((item: any) => {
            return item.spec.join(',') === variant_content.spec.join(',');
        });
        if (productVariant) {
            productVariant.stockList = variant_content.stockList;
            productVariant.stock = variant_content.stock;
        }

        return {
            product_content,
            variant_content,
        };
    }

    async deleteHistory(json: StockHistoryData) {
        try {
            await db.query(
                `UPDATE \`${this.app}\`.t_stock_history SET ? WHERE id = ?
                `,
                [{ status: -1 }, json.id]
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
