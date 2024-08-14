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
    async getLinkList(obj) {
        try {
            let search = ['1=1'];
            if (obj === null || obj === void 0 ? void 0 : obj.code) {
                search.push(`code = "${obj.code}"`);
            }
            const links = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE ${search.join(' AND ')};
            `, []);
            return { data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getLinkList Error: ' + error, null);
        }
    }
    async postLink(data) {
        try {
            data.token && delete data.token;
            const getLinks = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ?;
            `, [data.code]);
            if (getLinks.length > 0) {
                return { result: false, message: '此分銷代碼已被建立' };
            }
            if (data.recommend_status === 'new' && data.recommend_user && data.recommend_user.id === 0) {
                const register = await this.postUser(data.recommend_user);
                if (!register.result) {
                    return { result: false, message: '信箱已被建立' };
                }
            }
            const links = await database_1.default.query(`INSERT INTO \`${this.app}\`.t_recommend_links SET ?`, [
                {
                    code: data.code,
                    content: JSON.stringify(data),
                },
            ]);
            return { result: true, data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend postLink Error: ' + error, null);
        }
    }
    async putLink(id, data) {
        try {
            data.token && delete data.token;
            const getLinks = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ? AND id <> ?;
            `, [data.code, id]);
            if (getLinks.length > 0) {
                return { result: false, message: '此分銷代碼已被建立' };
            }
            const links = await database_1.default.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                {
                    code: data.code,
                    content: JSON.stringify(data),
                },
                id,
            ]);
            return { result: true, data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putLink Error: ' + error, null);
        }
    }
    async toggleLink(id) {
        try {
            const getLinks = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE id = ?;
            `, [id]);
            if (getLinks.length === 0) {
                return { result: false, message: '此分銷連結不存在' };
            }
            const content = getLinks[0].content;
            content.status = !content.status;
            const links = await database_1.default.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                {
                    content: JSON.stringify(content),
                },
                id,
            ]);
            return { result: true, data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend toggleLink Error: ' + error, null);
        }
    }
    async getUserList() {
        try {
            const users = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_users;
            `, []);
            return { data: users };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getUserList Error: ' + error, null);
        }
    }
    async postUser(data) {
        try {
            data.token && delete data.token;
            const getUsers = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_users WHERE email = ?;
            `, [data.email]);
            if (getUsers.length > 0) {
                return { result: false, message: '信箱已被建立' };
            }
            const user = await database_1.default.query(`INSERT INTO \`${this.app}\`.t_recommend_users SET ?`, [
                {
                    email: data.email,
                    content: JSON.stringify(data),
                },
            ]);
            return { result: true, data: user };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend postUser Error: ' + error, null);
        }
    }
    async putUser(id, data) {
        try {
            data.token && delete data.token;
            const getUsers = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_users WHERE email = ? AND id <> ?;
            `, [data.email, id]);
            if (getUsers.length > 0) {
                return { result: false, message: '信箱已被建立' };
            }
            const user = await database_1.default.query(`UPDATE \`${this.app}\`.t_recommend_users SET ? WHERE (id = ?);`, [
                {
                    email: data.email,
                    content: JSON.stringify(data),
                },
                id,
            ]);
            return { result: true, data: user };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
}
exports.Recommend = Recommend;
//# sourceMappingURL=recommend.js.map