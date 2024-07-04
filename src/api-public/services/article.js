"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
class Article {
    constructor(app_name, token) {
        this.app_name = app_name;
        this.token = token;
    }
    async addArticle(tData, status) {
        try {
            if ((await database_js_1.default.query(`select count(1) from \`${this.app_name}\`.t_manager_post where (content->>'$.type'='article') and (content->>'$.tag'='${tData.tag}')`, []))[0]['count(1)'] === 0) {
                tData.type = 'article';
                const data = (await database_js_1.default.query(`insert into \`${this.app_name}\`.t_manager_post (userID,content,status) values (${this.token.userID},?,?)`, [JSON.stringify(tData), status || 0]));
                return data.insertId;
            }
            else {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Already exists.', null);
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
    async putArticle(tData) {
        try {
            tData.content.type = 'article';
            await database_js_1.default.query(`update \`${this.app_name}\`.t_manager_post set content=? , updated_time=? ,status=? where id=? `, [JSON.stringify(tData.content), new Date(), tData.status || 1, tData.id]);
            return true;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
}
exports.Article = Article;
//# sourceMappingURL=article.js.map