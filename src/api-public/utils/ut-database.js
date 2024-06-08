"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtDatabase = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
class UtDatabase {
    constructor(app, table) {
        this.app = app;
        this.table = table;
    }
    async querySql(querySql, query, select) {
        if (querySql.length === 0) {
            querySql.push(`1=1`);
        }
        let sql = `SELECT ${select || '*'}
                   FROM \`${this.app}\`.\`${this.table}\`
                   where ${querySql.join(' and ')}
                   ${query.order_string ? query.order_string : `order by id desc`}`;
        if (query.id) {
            const data = (await database_js_1.default.query(`SELECT  ${select || '*'}
                                          FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []))[0];
            return {
                data: data,
                result: !!data,
            };
        }
        else {
            return {
                data: await database_js_1.default.query(`SELECT  ${select || '*'}
                                       FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []),
                total: (await database_js_1.default.query(`SELECT count(1)
                                        FROM (${sql}) as subqyery`, []))[0]['count(1)'],
            };
        }
    }
}
exports.UtDatabase = UtDatabase;
//# sourceMappingURL=ut-database.js.map