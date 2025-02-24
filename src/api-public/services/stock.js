"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const shopping_1 = require("./shopping");
const share_permission_1 = require("./share-permission");
const typeConfig = {
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
class Stock {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async productList(json) {
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;
        try {
            const sqlArr = ['1=1'];
            if (json.variant_id_list) {
                sqlArr.push(`(v.id in (${json.variant_id_list}))`);
            }
            const sqlText = sqlArr.join(' AND ');
            const getStockTotal = await database_1.default.query(`SELECT count(v.id) as c
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.content ->>'$.stockList.${json.search || 'store'}.count' > 0
                   AND v.product_id = p.id
                   AND ${sqlText}
                `, []);
            let data = await database_1.default.query(`SELECT v.*, p.content as product_content
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.content ->>'$.stockList.${json.search || 'store'}.count' > 0
                   AND v.product_id = p.id
                   AND ${sqlText}
                     LIMIT ${page * limit}
                     , ${limit};
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
    async productStock(json) {
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;
        try {
            const sqlArr = ['1=1'];
            if (json.variant_id_list) {
                sqlArr.push(`(v.id in (${json.variant_id_list}))`);
            }
            const sqlText = sqlArr.join(' AND ');
            const getStockTotal = await database_1.default.query(`SELECT count(v.id) as c
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.product_id = p.id
                   AND ${sqlText}
                `, []);
            let data = await database_1.default.query(`SELECT v.*, p.content as product_content
                 FROM \`${this.app}\`.t_variants as v,
                      \`${this.app}\`.t_manager_post as p
                 WHERE v.product_id = p.id
                   AND ${sqlText}
                     LIMIT ${page * limit}
                     , ${limit};
                `, []);
            data.map((item) => {
                item.count = Object.values(item.content.stockList).reduce((sum, stock) => sum + stock.count, 0);
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
            const productList = {};
            const variants = await database_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_variants
                 WHERE content ->>'$.stockList.${store_id}.count' is not null;
                `, []);
            if (variants.length == 0) {
                return { data: true, process: '' };
            }
            const promise = await new Promise((resolve) => {
                let n = 0;
                for (const variant of variants) {
                    delete variant.content.stockList[store_id];
                    database_1.default.query(`UPDATE \`${this.app}\`.t_variants
                         SET ?
                         WHERE id = ?
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
                    const products = await database_1.default.query(`SELECT *
                         FROM \`${this.app}\`.t_manager_post
                         WHERE id in (${idString});
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
    async recoverStock(variant) {
        const sql = variant.spec.length > 0
            ? `AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(${variant.spec
                .map((data) => {
                return `\"${data}\"`;
            })
                .join(',')}));`
            : '';
        let variantData = await database_1.default.query(`
            SELECT *
            FROM \`${this.app}\`.t_variants
            WHERE \`product_id\` = "${variant.id}" ${sql}
        `, []);
        const pdDqlData = (await new shopping_1.Shopping(this.app, this.token).getProduct({
            page: 0,
            limit: 50,
            id: variant.id,
            status: 'inRange',
        })).data;
        const pd = pdDqlData.content;
        const pbVariant = pd.variants.find((dd) => {
            return dd.spec.join('-') === variant.spec.join('-');
        });
        variantData = variantData[0];
        Object.entries(variant.deduction_log).forEach(([key, value]) => {
            pbVariant.stockList[key].count = parseInt(pbVariant.stockList[key].count) + parseInt(value);
            pbVariant.stock = parseInt(pbVariant.stock) + parseInt(value);
            variantData.content.stockList[key].count = parseInt(variantData.content.stockList[key].count) + parseInt(value);
            variantData.content.stock = parseInt(variantData.content.stock) + parseInt(value);
        });
        await new shopping_1.Shopping(this.app, this.token).updateVariantsWithSpec(variantData.content, variant.id, variant.spec);
        await database_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                                     SET ?
                                     WHERE 1 = 1
                                       and id = ${pdDqlData.id}`, [{ content: JSON.stringify(pd) }]);
    }
    async shippingStock(variant) {
        const sql = variant.spec.length > 0
            ? `AND JSON_CONTAINS(content->'$.spec', JSON_ARRAY(${variant.spec
                .map((data) => {
                return `\"${data}\"`;
            })
                .join(',')}));`
            : '';
        let variantData = await database_1.default.query(`
            SELECT *
            FROM \`${this.app}\`.t_variants
            WHERE \`product_id\` = "${variant.id}" ${sql}
        `, []);
        const pdDqlData = (await new shopping_1.Shopping(this.app, this.token).getProduct({
            page: 0,
            limit: 50,
            id: variant.id,
            status: 'inRange',
        })).data;
        const pd = pdDqlData.content;
        const pbVariant = pd.variants.find((dd) => {
            return dd.spec.join('-') === variant.spec.join('-');
        });
        variantData = variantData[0];
        Object.entries(variant.deduction_log).forEach(([key, value]) => {
            pbVariant.stockList[key].count = parseInt(pbVariant.stockList[key].count) - parseInt(value);
            pbVariant.stock = parseInt(pbVariant.stock) - parseInt(value);
            variantData.content.stockList[key].count = parseInt(variantData.content.stockList[key].count) - parseInt(value);
            variantData.content.stock = parseInt(variantData.content.stock) - parseInt(value);
        });
        await new shopping_1.Shopping(this.app, this.token).updateVariantsWithSpec(variantData.content, variant.id, variant.spec);
        await database_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                                     SET ?
                                     WHERE 1 = 1
                                       and id = ${pdDqlData.id}`, [{ content: JSON.stringify(pd) }]);
    }
    async getHistory(json) {
        const page = json.page ? parseInt(`${json.page}`, 10) : 0;
        const limit = json.limit ? parseInt(`${json.limit}`, 10) : 20;
        function formatDate(sqlDatetime) {
            const date = new Date(sqlDatetime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        }
        const sqlArr = ['(status <> -1)', `(type = '${json.type}')`];
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
            const getHistoryTotal = await database_1.default.query(`SELECT count(id) as c FROM \`${this.app}\`.t_stock_history
                WHERE 1=1 AND ${sqlString}
                `, []);
            const data = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_stock_history
                    WHERE 1=1 AND ${sqlString}
                    ORDER BY order_id DESC
                    LIMIT ${page * limit}, ${limit};
                `, []);
            const getPermission = (await new share_permission_1.SharePermission(this.app, this.token).getPermission({
                page: 0,
                limit: 9999,
            }));
            data.map((rowData) => {
                rowData.created_time = formatDate(rowData.created_time);
                rowData.content.changeLogs.map((log) => {
                    const findManager = getPermission.data.find((m) => `${m.user}` === `${log.user}`);
                    log.user_name = findManager ? findManager.config.name : '';
                    return log;
                });
            });
            return {
                total: getHistoryTotal[0].c,
                data,
            };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('stock getHistory Error: ', error.message, null);
            }
        }
    }
    async postHistory(json) {
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
                    time: tool_js_1.default.getCurrentDateTime(),
                    status: json.status,
                    text: `${typeData.name}單建立`,
                    user: this.token ? this.token.userID : 0,
                },
                {
                    time: tool_js_1.default.getCurrentDateTime({ addSeconds: 1 }),
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
            await database_1.default.query(`INSERT INTO \`${this.app}\`.\`t_stock_history\` SET ?;
                `, [formatJson]);
            return { data: formatJson };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('stock postHistory Error: ', error.message, null);
            }
        }
    }
    async putHistory(json) {
        var _a, _b;
        try {
            if (!this.token) {
                return { data: false };
            }
            const typeData = typeConfig[json.type];
            const getHistory = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_stock_history WHERE order_id = ?;
                `, [json.order_id]);
            if (!getHistory || getHistory.length !== 1) {
                return { data: false };
            }
            const originHistory = getHistory[0];
            const originList = originHistory.content.product_list;
            json.content.product_list.map((item) => {
                delete item.title;
                delete item.spec;
                delete item.sku;
                delete item.barcode;
                return item;
            });
            json.content.changeLogs.push({
                time: tool_js_1.default.getCurrentDateTime(),
                status: json.status,
                text: `進貨單狀態改為「${typeData.status[json.status].title}」`,
                user: this.token.userID,
                product_list: (() => {
                    if (json.status === 1 || json.status === 5) {
                        const updateList = JSON.parse(JSON.stringify(json.content.product_list));
                        return updateList.map((item1) => {
                            var _a, _b;
                            const originVariant = originList.find((item2) => item1.variant_id === item2.variant_id);
                            if (originVariant) {
                                return Object.assign({ replenishment_count: ((_a = item1.recent_count) !== null && _a !== void 0 ? _a : 0) - ((_b = originVariant.recent_count) !== null && _b !== void 0 ? _b : 0) }, item1);
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
            const _shop = new shopping_1.Shopping(this.app, this.token);
            const variants = await _shop.getVariants({
                page: 0,
                limit: 9999,
                id_list: json.content.product_list.map((item) => item.variant_id).join(','),
            });
            const dataList = [];
            const createStockEntry = (type, store, count, variant) => (Object.assign({ id: variant.id, product_id: variant.product_id }, Stock.formatStockContent({
                type,
                store,
                count,
                product_content: variant.product_content,
                variant_content: variant.variant_content,
            })));
            for (const variant of variants.data) {
                const item = json.content.product_list.find((item) => item.variant_id === variant.id);
                if (item) {
                    const originVariant = originList.find((origin) => item.variant_id === origin.variant_id);
                    const recent_count = (_a = item.recent_count) !== null && _a !== void 0 ? _a : 0;
                    const count = originVariant ? recent_count - ((_b = originVariant.recent_count) !== null && _b !== void 0 ? _b : 0) : recent_count;
                    const { type, content } = json;
                    const { store_in, store_out } = content;
                    if (type === 'restocking') {
                        dataList.push(createStockEntry('plus', store_in, count, variant));
                    }
                    else if (type === 'transfer') {
                        dataList.push(createStockEntry('plus', store_in, count, variant));
                        dataList.push(createStockEntry('minus', store_out, count, variant));
                    }
                    else if (type === 'checking' && (json.status === 0 || json.status === 1)) {
                        dataList.push(createStockEntry('equal', store_out, recent_count, variant));
                    }
                }
            }
            await _shop.putVariants(dataList);
            await database_1.default.query(`UPDATE \`${this.app}\`.t_stock_history SET ? WHERE order_id = ?
                `, [formatJson, json.order_id]);
            return { data: true };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('stock postHistory Error: ', error.message, null);
            }
        }
    }
    static formatStockContent(data) {
        const type = data.type;
        const store = data.store;
        const count = data.count;
        const product_content = data.product_content;
        const variant_content = data.variant_content;
        const stockList = variant_content.stockList;
        if (stockList[store]) {
            if (type === 'plus') {
                if (stockList[store].count) {
                    stockList[store].count += count;
                }
                else {
                    stockList[store].count = count;
                }
            }
            else if (type === 'minus') {
                if (stockList[store].count) {
                    stockList[store].count -= count;
                }
                else {
                    stockList[store].count = -count;
                }
            }
            else {
                stockList[store].count = count;
            }
        }
        variant_content.stock = Object.keys(stockList).reduce((sum, key) => {
            if (stockList[key] && stockList[key].count) {
                return sum + stockList[key].count;
            }
            return sum;
        }, 0);
        const productVariant = product_content.variants.find((item) => {
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
    async deleteHistory(json) {
        try {
            await database_1.default.query(`UPDATE \`${this.app}\`.t_stock_history SET ? WHERE id = ?
                `, [{ status: -1 }, json.id]);
            return { data: false };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('stock postHistory Error: ', error.message, null);
            }
        }
    }
}
exports.Stock = Stock;
//# sourceMappingURL=stock.js.map