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
                search.push(`(code = "${obj.code}")`);
            }
            if (obj === null || obj === void 0 ? void 0 : obj.status) {
                search.push(`(JSON_EXTRACT(content, '$.status') = ${obj.status})`);
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
                data.recommend_user.id = register.data.insertId;
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
    async deleteLink(data) {
        try {
            data.token && delete data.token;
            if (data.id && data.id.length > 0) {
                const links = await database_1.default.query(`DELETE FROM \`${this.app}\`.t_recommend_links 
                    WHERE id in (${data.id.join(',')});
                `, []);
                return { result: true, data: links };
            }
            return { result: false, message: '刪除失敗' };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
    async getUserList(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            let search = ['1=1'];
            if (query.search) {
                switch (query.searchType) {
                    case 'phone':
                        search.push(`(JSON_EXTRACT(content, '$.phone') like '%${query.search}%')`);
                        break;
                    case 'name':
                        search.push(`(JSON_EXTRACT(content, '$.name') like '%${query.search}%')`);
                        break;
                    case 'email':
                    default:
                        search.push(`(email like '%${query.search}%')`);
                        break;
                }
            }
            const recommendUserOrderBy = [
                { key: 'name', value: '推薦人名稱' },
                { key: 'created_time_desc', value: '註冊時間新 > 舊' },
                { key: 'created_time_asc', value: '註冊時間舊 > 新' },
            ];
            let orderBy = 'id DESC';
            if (query.orderBy) {
                orderBy = (() => {
                    switch (query.orderBy) {
                        case 'name':
                            return `JSON_EXTRACT(content, '$.name')`;
                        case 'created_time_asc':
                            return `id`;
                        case 'created_time_desc':
                        default:
                            return `id DESC`;
                    }
                })();
            }
            const data = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_users
                WHERE ${search.join(' AND ')}
                ORDER BY ${orderBy}
                ${query.page !== undefined && query.limit !== undefined ? `LIMIT ${query.page * query.limit}, ${query.limit}` : ''};
            `, []);
            const total = await database_1.default.query(`SELECT count(id) as c FROM \`${this.app}\`.t_recommend_users
                WHERE ${search.join(' AND ')}
            `, []);
            return {
                data: data,
                total: total[0].c,
            };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getUserList Error: ' + error, null);
        }
    }
    async postUser(data) {
        try {
            data.token && delete data.token;
            data.id !== undefined && delete data.id;
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
    async deleteUser(data) {
        try {
            data.token && delete data.token;
            if (data.id && data.id.length > 0) {
                await database_1.default.query(`DELETE FROM \`${this.app}\`.t_recommend_links 
                    WHERE JSON_EXTRACT(content, '$.recommend_user.id') in (${data.id.join(',')});
                `, []);
                const user = await database_1.default.query(`DELETE FROM \`${this.app}\`.t_recommend_users WHERE (id in (${data.id.join(',')}));
                    `, []);
                return { result: true, data: user };
            }
            return { result: false, message: '刪除失敗' };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
}
exports.Recommend = Recommend;
//# sourceMappingURL=recommend.js.map