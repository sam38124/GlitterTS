"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphApi = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
class GraphApi {
    constructor(appName) {
        this.appName = appName;
    }
    async insert(data) {
        try {
            data.info = JSON.stringify(data.info);
            if ((await database_js_1.default.query(`
                select count(1)
                from \`${this.appName}\`.t_graph_api
                where route = ?
                  and method = ?
            `, [data.route, data.method]))[0]['count(1)'] === 1) {
                throw exception_js_1.default.BadRequestError('ALREADY_EXISTS', "THIS API ALREADY EXISTS.", null);
            }
            const result = await database_js_1.default.query(`insert into \`${this.appName}\`.t_graph_api
                                           set ?`, [data]);
            return {
                result: true,
                inertID: result.insertId
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError(e.code || 'BAD_REQUEST', e.message, null);
        }
    }
    async update(data) {
        try {
            data.info = JSON.stringify(data.info);
            if ((await database_js_1.default.query(`
                select count(1)
                from \`${this.appName}\`.t_graph_api
                where id = ?
            `, [data.id]))[0]['count(1)'] === 0) {
                throw exception_js_1.default.BadRequestError('NOT_EXISTS', "THIS API NOT EXISTS.", null);
            }
            await database_js_1.default.query(`update \`${this.appName}\`.t_graph_api
                            set ?
                            where id = ?`, [data, data.id]);
            return {
                result: true
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError(e.code || 'BAD_REQUEST', e.message, null);
        }
    }
}
exports.GraphApi = GraphApi;
//# sourceMappingURL=graph-api.js.map