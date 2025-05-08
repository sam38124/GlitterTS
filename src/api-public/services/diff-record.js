"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffRecord = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const user_js_1 = require("./user.js");
class DiffRecord {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async createChangedLog(json) {
        try {
            const { entity_table, entity_id, type, note, changed_json, changed_source, changed_by } = json;
            await database_js_1.default.execute(`
          INSERT INTO \`${this.app}\`.t_changed_logs 
          (entity_table, entity_id, type, note, changed_json, changed_source, changed_by)
          values (?, ?, ?, ?, ?, ?, ?)
        `, [entity_table, entity_id, type || null, note, JSON.stringify(changed_json), changed_source, changed_by]);
        }
        catch (error) {
            console.error(error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'createChangedLog Error:' + error, null);
        }
    }
    async getProdcutRecord(product_id) {
        try {
            const records = await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.t_changed_logs WHERE entity_table = 't_manager_post' AND entity_id = ?;
        `, [product_id]);
            return records;
        }
        catch (error) {
            console.error(error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getProdcutRecord Error:' + error, null);
        }
    }
    async postProdcutRecord(updater_id, product_id, update_content) {
        var _a;
        try {
            const originProduct = (await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.\`t_manager_post\` WHERE id = ?
          `, [product_id]))[0];
            if (!originProduct) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'PRODUCT IS NOT EXISTS:', {
                    message: '商品不存在',
                    code: '400',
                });
            }
            const userClass = new user_js_1.User(this.app);
            const diff = tool_js_1.default.deepDiff(originProduct.content, update_content);
            console.log(JSON.stringify(diff));
            if (diff.variants) {
                const variantsEntries = Object.entries(diff.variants);
                const store_config = await userClass.getConfigV2({
                    key: 'store_manager',
                    user_id: 'manager',
                });
                for (const [diffIndex, diffData] of variantsEntries) {
                    const update_variant = (_a = update_content === null || update_content === void 0 ? void 0 : update_content.variants) === null || _a === void 0 ? void 0 : _a[Number(diffIndex)];
                    if (update_variant) {
                        const spec = update_variant.spec;
                        if (diffData.show_understocking) {
                            await this.createChangedLog({
                                entity_table: 't_manager_post',
                                entity_id: product_id,
                                note: '更新追蹤庫存模式',
                                changed_json: Object.assign({ spec }, diffData.show_understocking),
                                changed_source: 'management',
                                changed_by: `${updater_id}`,
                            });
                        }
                        if (diffData.stockList) {
                            const changeDataArray = DiffRecord.changedStockListLog(diffData.stockList, store_config);
                            for (const changeData of changeDataArray) {
                                await this.createChangedLog({
                                    entity_table: 't_manager_post',
                                    entity_id: product_id,
                                    note: '更新庫存',
                                    changed_json: Object.assign({ spec }, changeData),
                                    changed_source: 'management',
                                    changed_by: `${updater_id}`,
                                });
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postProdcutRecord Error:' + error, null);
        }
    }
    async postProdcutVariantRecord(updater_id, variant_id, update_variant) {
        try {
            const originVariant = (await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.\`t_variants\` WHERE id = ?
          `, [variant_id]))[0];
            if (!originVariant) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Variant IS NOT EXISTS:', {
                    message: '商品規格不存在',
                    code: '400',
                });
            }
            const userClass = new user_js_1.User(this.app);
            const diff = tool_js_1.default.deepDiff(originVariant.content, update_variant);
            if (diff.stockList) {
                const store_config = await userClass.getConfigV2({
                    key: 'store_manager',
                    user_id: 'manager',
                });
                const changeData = DiffRecord.changedStockListLog(diff.stockList, store_config)[0];
                if (changeData) {
                    this.createChangedLog({
                        entity_table: 't_manager_post',
                        entity_id: originVariant.product_id,
                        note: '更新庫存',
                        changed_json: Object.assign({ spec: update_variant.spec }, changeData),
                        changed_source: 'management',
                        changed_by: `${updater_id}`,
                    });
                }
            }
        }
        catch (error) {
            console.error(error);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postProdcutVariantRecord Error:' + error, null);
        }
    }
    static changedStockListLog(stock_list, store_config) {
        const logDataArray = [];
        Object.entries(stock_list).map(([store_id, data]) => {
            var _a, _b;
            const store = store_config.list.find((s) => s.id === store_id);
            if (data.count) {
                const { before: before_count = 0, after: after_count = 0 } = (_a = data === null || data === void 0 ? void 0 : data.count) !== null && _a !== void 0 ? _a : {};
                if (Number(before_count) !== Number(after_count)) {
                    logDataArray.push({
                        store_name: store.name,
                        before_count: Number(before_count),
                        after_count: Number(after_count),
                    });
                }
            }
            if (((_b = data.after) === null || _b === void 0 ? void 0 : _b.count) && data.after.count > 0) {
                logDataArray.push({
                    store_name: store.name,
                    before_count: 0,
                    after_count: Number(data.after.count),
                });
            }
        });
        return logDataArray;
    }
}
exports.DiffRecord = DiffRecord;
//# sourceMappingURL=diff-record.js.map