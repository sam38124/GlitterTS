"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const database_1 = __importStar(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
class Post {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async postContent(content) {
        try {
            const data = await database_1.default.query(`INSERT INTO \`${this.app}\`.\`t_post\`
                                         SET ?`, [
                content
            ]);
            const reContent = JSON.parse(content.content);
            reContent.id = data.insertId;
            content.content = JSON.stringify(reContent);
            await database_1.default.query(`update \`${this.app}\`.t_post
                            SET ?
                            WHERE id = ${data.insertId}`, [content]);
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }
    async putContent(content) {
        try {
            const reContent = JSON.parse(content.content);
            const data = await database_1.default.query(`update \`${this.app}\`.\`t_post\`
                                         SET ?
                                         where 1 = 1
                                           and id = ${reContent.id}`, [
                content
            ]);
            reContent.id = data.insertId;
            content.content = JSON.stringify(reContent);
            await database_1.default.query(`update \`${this.app}\`.t_post
                            SET ?
                            WHERE id = ${data.insertId}`, [content]);
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }
    async getContent(content) {
        try {
            let userData = {};
            let query = ``;
            const app = this.app;
            let selectOnly = ` * `;
            function getQueryString(dd) {
                var _a;
                if (!dd || dd.length === 0 || dd.key === '') {
                    return ``;
                }
                if (dd.type === 'relative_post') {
                    dd.query = (_a = dd.query) !== null && _a !== void 0 ? _a : [];
                    return ` and JSON_EXTRACT(content, '$.${dd.key}') in (SELECT JSON_EXTRACT(content, '$.${dd.value}') AS datakey
 from \`${app}\`.t_post where 1=1 ${dd.query.map((dd) => {
                        return getQueryString(dd);
                    }).join(`  `)})`;
                }
                else if (dd.type) {
                    return ` and JSON_EXTRACT(content, '$.${dd.key}') ${dd.type} ${(typeof dd.value === 'string') ? `'${dd.value}'` : dd.value}`;
                }
                else {
                    return ` and JSON_EXTRACT(content, '$.${dd.key}') LIKE '%${dd.value}%'`;
                }
            }
            function getSelectString(dd) {
                if (!dd || dd.length === 0) {
                    return ``;
                }
                if (dd.type === 'SUM') {
                    return ` SUM(JSON_EXTRACT(content, '$.${dd.key}')) AS ${dd.value}`;
                }
                else if (dd.type === 'count') {
                    return ` count(1)`;
                }
                else {
                    return `  JSON_EXTRACT(content, '$.${dd.key}') AS '${dd.value}' `;
                }
            }
            if (content.query) {
                content.query = JSON.parse(content.query);
                content.query.map((dd) => {
                    query += getQueryString(dd);
                });
            }
            console.log(`query---`, query);
            if (content.selectOnly) {
                content.selectOnly = JSON.parse(content.selectOnly);
                content.selectOnly.map((dd, index) => {
                    if (index === 0) {
                        selectOnly = '';
                    }
                    selectOnly += getSelectString(dd);
                });
            }
            if (content.datasource) {
                content.datasource = JSON.parse(content.datasource);
                if (content.datasource.length > 0) {
                    query += ` and userID in ('${content.datasource.map((dd) => {
                        return dd;
                    }).join("','")}')`;
                }
            }
            const data = (await database_1.default.query(`select ${selectOnly}
                                          from \`${this.app}\`.\`t_post\`
                                          where userID in (select userID
                                                           from \`${this.app}\`.\`user\`)
                                              ${query}
                                          order by id desc ${(0, database_1.limit)(content)}`, [
                content
            ]));
            for (const dd of data) {
                if (!userData[dd.userID]) {
                    userData[dd.userID] = (await database_1.default.query(`select userData
                                                           from \`${this.app}\`.\`user\`
                                                           where userID = ${dd.userID}`, []))[0]['userData'];
                }
                dd.userData = userData[dd.userID];
            }
            return {
                data: data,
                count: (await database_1.default.query(`select count(1)
                                        from \`${this.app}\`.\`t_post\`
                                        where userID in (select userID
                                                         from \`${this.app}\`.\`user\`)
                                            ${query}`, [
                    content
                ]))[0]["count(1)"]
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }
}
exports.Post = Post;
function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`;
    return userID;
}
