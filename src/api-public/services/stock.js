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
            const getStockTotal = await database_1.default.query(`
                    SELECT count(id) as c FROM \`${this.app}\`.t_variants
                    WHERE content->>'$.stockList.${(_a = json.search) !== null && _a !== void 0 ? _a : 'store'}.count' > 0;
                `, []);
            let data = await database_1.default.query(`
                    SELECT * FROM \`${this.app}\`.t_variants
                    WHERE content->>'$.stockList.${(_b = json.search) !== null && _b !== void 0 ? _b : 'store'}.count' > 0
                    LIMIT ${page * limit}, ${limit};
                `, []);
            if (data.length > 0) {
                const idString = data.map((item) => `"${item.product_id}"`).join(',');
                const productData = await database_1.default.query(`SELECT id, content->>'$.title' AS title FROM \`${this.app}\`.t_manager_post
                    WHERE id in (${idString})
                    `, []);
                data = data.filter((item) => {
                    const prod = productData.find((p) => p.id === item.product_id);
                    if (!prod) {
                        return false;
                    }
                    item.title = prod.title;
                    item.count = item.content.stockList[json.search].count;
                    return true;
                });
            }
            return {
                total: getStockTotal[0].c,
                data,
            };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('store productList Error: ', error.message, null);
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