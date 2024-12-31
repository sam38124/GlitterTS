"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
class Stock {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async productList(json) {
        var _a, _b;
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;
        try {
            const getStockTotal = await database_1.default.query(`SELECT count(v.id) as c
                    FROM \`${this.app}\`.t_variants as v, \`${this.app}\`.t_manager_post as p
                    WHERE v.content->>'$.stockList.${(_a = json.search) !== null && _a !== void 0 ? _a : 'store'}.count' > 0 
                    AND v.product_id = p.id
                `, []);
            let data = await database_1.default.query(`SELECT v.*, p.content as product_content 
                    FROM \`${this.app}\`.t_variants as v, \`${this.app}\`.t_manager_post as p
                    WHERE v.content->>'$.stockList.${(_b = json.search) !== null && _b !== void 0 ? _b : 'store'}.count' > 0 
                    AND v.product_id = p.id
                    LIMIT ${page * limit}, ${limit};
                `, []);
            data.map((item) => {
                item.count = item.content.stockList[json.search].count;
                item.title = (() => {
                    try {
                        return item.product_content.language_data['zh-TW'].title;
                    }
                    catch (error) {
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
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('stock productList Error: ', error.message, null);
            }
        }
    }
    async deleteStoreProduct(store_id) {
        try {
            const start = new Date();
            const productList = {};
            const variants = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_variants
                 WHERE content->>'$.stockList.${store_id}.count' is not null;
                `, []);
            if (variants.length == 0) {
                return { data: true, process: '' };
            }
            const promise = await new Promise((resolve) => {
                let n = 0;
                for (const variant of variants) {
                    delete variant.content.stockList[store_id];
                    database_1.default.query(`UPDATE \`${this.app}\`.t_variants SET ? WHERE id = ?
                        `, [{ content: JSON.stringify(variant.content) }, variant.id]).then(() => {
                        const p = productList[`${variant.product_id}`];
                        if (p) {
                            p.push(variant.content);
                        }
                        else {
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
                    const products = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_manager_post WHERE id in (${idString});
                        `, []);
                    return await new Promise((resolve) => {
                        let n = 0;
                        for (const product of products) {
                            product.content.variants = productList[`${product.id}`];
                            database_1.default.query(`UPDATE \`${this.app}\`.t_manager_post
                                 SET ?
                                 WHERE id = ?`, [{ content: JSON.stringify(product.content) }, product.id]).then(() => {
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
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('stock deleteStore Error: ', error.message, null);
            }
        }
    }
    allocateStock(stockList, requiredCount) {
        let remainingCount = requiredCount;
        let totalDeduction = 0;
        const deductionLog = {};
        const sortedStock = Object.entries(stockList).sort(([, a], [, b]) => b.count - a.count);
        for (const [key, stock] of sortedStock) {
            if (remainingCount === 0)
                break;
            const deduction = Math.min(stock.count, remainingCount);
            remainingCount -= deduction;
            totalDeduction += deduction;
            stock.count -= deduction;
            deductionLog[key] = deduction;
        }
        const maxDeduction = Math.max(...Object.values(deductionLog), 0);
        return {
            stockList,
            deductionLog,
            totalDeduction,
            remainingCount,
        };
    }
}
exports.Stock = Stock;
//# sourceMappingURL=stock.js.map