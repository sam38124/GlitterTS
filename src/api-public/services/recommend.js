"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommend = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
class Recommend {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async getList() {
        try {
            const links = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links;
            `, []);
            return { data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getList Error: ' + error, null);
        }
    }
    async postList(data) {
        try {
            const links = await database_1.default.query(`INSERT INTO \`${this.app}\`.t_recommend_links SET ?`, [
                {
                    code: data.code,
                    content: data,
                },
            ]);
            return { data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getList Error: ' + error, null);
        }
    }
    async putList(data) {
        try {
            const getLinks = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ?;
            `, [data.code]);
            if (getLinks.length === 0) {
                const links = await database_1.default.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                    {
                        code: data.code,
                        content: data,
                    },
                    data.id,
                ]);
                return { data: links };
            }
            return { data: false };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getList Error: ' + error, null);
        }
    }
}
exports.Recommend = Recommend;
//# sourceMappingURL=recommend.js.map