"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pos = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
class Pos {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async getWorkStatus(query) {
        try {
            const status = await database_js_1.default.query(`SELECT *
                                           FROM \`${this.app}\`.t_check_in_pos
                                           where staff = ? and store=?
                                           order by id desc limit 0,1;`, [query.userID, query.store]);
            return (status[0] && status[0].execute) || 'off_work';
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e, null);
        }
    }
    async getWorkStatusList(query) {
        try {
            let querySql = [`1=1`];
            if (query.store) {
                querySql.push(`store=${database_js_1.default.escape(query.store)}`);
            }
            return await this.querySql(querySql, query, 't_check_in_pos');
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e, null);
        }
    }
    async setWorkStatus(obj) {
        var _a;
        try {
            await database_js_1.default.query(`insert into \`${this.app}\`.t_check_in_pos (staff,execute,store) values (?,?,?)`, [
                (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID,
                obj.status,
                obj.store
            ]);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'setWorkStatus is Failed. ' + e, null);
        }
    }
    async setSummary(obj) {
        try {
            if (obj.id) {
                await database_js_1.default.query(`update \`${this.app}\`.\`t_pos_summary\` set staff=?,summary_type=?,content=? where id=?`, [
                    obj.staff,
                    obj.summary_type,
                    JSON.stringify(obj.content),
                    obj.id
                ]);
            }
            else {
                await database_js_1.default.query(`insert into \`${this.app}\`.\`t_pos_summary\` (staff,\`summary_type\`,content) values (?,?,?)`, [
                    obj.staff,
                    obj.summary_type,
                    JSON.stringify(obj.content)
                ]);
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'setSummary is Failed. ' + e, null);
        }
    }
    async getSummary(shop) {
        try {
            return (await database_js_1.default.query(`select * from \`${this.app}\`.\`t_pos_summary\` where content->>'$.store'=? order by id desc`, [shop])).map((dd) => {
                dd.created_time = dd.created_time.toISOString();
                return dd;
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'setSummary is Failed. ' + e, null);
        }
    }
    async querySql(querySql, query, db_n) {
        let sql = `SELECT *
                   FROM \`${this.app}\`.\`${db_n}\`
                   WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
        `;
        console.log(`query=string=>`, sql);
        if (query.id) {
            const data = (await database_js_1.default.query(`SELECT *
                     FROM (${sql}) as subqyery
                         limit ${query.page * query.limit}
                        , ${query.limit}`, []))[0];
            return { data: data, result: !!data };
        }
        else {
            return {
                data: (await database_js_1.default.query(`SELECT *
                         FROM (${sql}) as subqyery
                             limit ${query.page * query.limit}
                            , ${query.limit}`, [])).map((dd) => {
                    return dd;
                }),
                total: (await database_js_1.default.query(`SELECT count(1)
                         FROM (${sql}) as subqyery`, []))[0]['count(1)'],
            };
        }
    }
}
exports.Pos = Pos;
//# sourceMappingURL=pos.js.map