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
    async getWorkStatus() {
        var _a;
        try {
            const status = await database_js_1.default.query(`SELECT *
                                           FROM \`${this.app}\`.t_check_in_pos
                                           where staff = ?
                                           order by id desc limit 0,1;`, [(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID]);
            return (status[0] && status[0].execute) || 'off_work';
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e, null);
        }
    }
    async setWorkStatus(obj) {
        var _a;
        try {
            await database_js_1.default.query(`insert into \`${this.app}\`.t_check_in_pos (staff,execute) values (?,?)`, [
                (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID,
                obj.status
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
    async getSummary() {
        try {
            return (await database_js_1.default.query(`select * from \`${this.app}\`.\`t_pos_summary\` order by id desc`, [])).map((dd) => {
                dd.created_time = dd.created_time.toISOString();
                return dd;
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'setSummary is Failed. ' + e, null);
        }
    }
}
exports.Pos = Pos;
//# sourceMappingURL=pos.js.map