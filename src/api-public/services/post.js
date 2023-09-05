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
const app_js_1 = require("../../services/app.js");
const message_js_1 = require("../../firebase/message.js");
class Post {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    static addPostObserver(callback) {
        Post.postObserverList.push(callback);
    }
    async postContent(content) {
        try {
            const data = await database_1.default.query(`INSERT INTO \`${this.app}\`.\`t_post\`
                                         SET ?`, [content]);
            const reContent = JSON.parse(content.content);
            reContent.id = data.insertId;
            content.content = JSON.stringify(reContent);
            await database_1.default.query(`update \`${this.app}\`.t_post
                            SET ?
                            WHERE id = ${data.insertId}`, [content]);
            Post.postObserverList.map((value, index, array) => {
                value(content, this.app);
            });
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }
    async sqlApi(router, datasource) {
        try {
            const apConfig = await app_js_1.App.getAdConfig(this.app, "sql_api_config_post");
            const sq = apConfig.apiList.find((dd) => {
                return dd.route === router;
            });
            const sql = ((() => {
                return eval(sq.sql);
            })()).replaceAll('$app', `\`${this.app}\``);
            console.log(`sqlApi:`, sql);
            (await database_1.default.query(sql, []));
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'SqlApi Error:' + e, null);
        }
    }
    async lambda(query, router, datasource, type) {
        try {
            return await database_1.default.queryLambada({
                database: this.app
            }, async (sql) => {
                var _a, _b;
                const apConfig = await app_js_1.App.getAdConfig(this.app, "sql_api_config_post");
                console.log(apConfig.apiList);
                const sq = apConfig.apiList.find((dd) => {
                    return dd.route === router && dd.type === type;
                });
                if (!sq) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', `Router ${router} not exist.`, null);
                }
                let user = undefined;
                if (this.token) {
                    user = (_b = (await sql.query(`select *
                                             from user
                                             where userID = ${(_a = this.token.userID) !== null && _a !== void 0 ? _a : 0}`, []))[0]) !== null && _b !== void 0 ? _b : user;
                }
                const html = String.raw;
                const myFunction = new Function(html `try {
                return ${sq.sql.replace(/new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i, 'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })')}
                } catch (error) {
                return 'error';
                }`);
                const sqlType = ((() => {
                    try {
                        return myFunction();
                    }
                    catch (e) {
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'SqlApi Error', null);
                    }
                })());
                if (!sqlType) {
                    throw exception_1.default.BadRequestError('BAD_REQUEST', 'SqlApi Error', null);
                }
                else {
                    return new Promise(async (resolve, reject) => {
                        try {
                            (sqlType.execute(sql, {
                                user: user,
                                data: datasource,
                                app: this.app,
                                query: query,
                                firebase: {
                                    sendMessage: (message) => {
                                        (0, message_js_1.sendMessage)(apConfig.firebase, message, this.app);
                                    }
                                }
                            })).then((data) => {
                                resolve({ result: true, data: data });
                            }).catch((e) => {
                                resolve({ result: false, message: e });
                            });
                        }
                        catch (e) {
                            console.log(e);
                            reject(e);
                        }
                    });
                }
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'SqlApi Error:' + e, null);
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
            content.updated_time = new Date();
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
        return await (0, database_1.queryLambada)({
            database: this.app
        }, async (v) => {
            var _a;
            try {
                const apConfig = await app_js_1.App.getAdConfig(this.app, "sql_api_config");
                let userData = {};
                let countSql = "";
                let sql = (() => {
                    if (content.queryType === 'sql') {
                        const datasource = JSON.parse(content.datasource);
                        const sq = apConfig.apiList.find((dd) => {
                            return dd.route === datasource.route;
                        });
                        return eval(sq.sql).replaceAll('$app', `\`${this.app}\``);
                    }
                    else {
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
                            else if (dd.type === 'in') {
                                return `and JSON_EXTRACT(content, '$.${dd.key}') in (${dd.query.map((dd) => {
                                    return (typeof dd.value === 'string') ? `'${dd.value}'` : dd.value;
                                }).join(',')})`;
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
                            else if (dd.type === 'AVG') {
                                return ` AVG(JSON_EXTRACT(content, '$.${dd.key}')) AS ${dd.value}`;
                            }
                            else {
                                return ` JSON_EXTRACT(content, '$.${dd.key}') AS '${dd.value}' `;
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
                        countSql = `select count(1)
                                    from \`${this.app}\`.\`t_post\`
                                    where 1 = 1
                                        ${query}
                                    order by id desc ${(0, database_1.limit)(content)}`;
                        return `select ${selectOnly}
                                from \`${this.app}\`.\`t_post\`
                                where 1 = 1
                                    ${query}
                                order by id desc ${(0, database_1.limit)(content)}`;
                    }
                })();
                console.log(`sql---${sql.replace('$countIndex', '')}`);
                const data = (await v.query(sql.replace('$countIndex', ''), []));
                for (const dd of data) {
                    if (!dd.userID) {
                        continue;
                    }
                    if (!userData[dd.userID]) {
                        try {
                            userData[dd.userID] = (await v.query(`select userData
                                                                  from \`${this.app}\`.\`user\`
                                                                  where userID = ${dd.userID}`, []))[0]['userData'];
                        }
                        catch (e) {
                        }
                    }
                    dd.userData = userData[dd.userID];
                }
                let countText = (() => {
                    if (sql.indexOf('$countIndex') !== -1) {
                        const index = sql.indexOf('$countIndex');
                        return `select count(1)
                                from ${sql.substring(index + 11)}`;
                    }
                    else {
                        return `select count(1)
                                     ${sql.substring(sql.lastIndexOf(' from '))}`;
                    }
                })();
                countText = countText.substring(0, (_a = countText.indexOf(' order ')) !== null && _a !== void 0 ? _a : countText.length);
                console.log(`countText:${countText}`);
                console.log(`countSql:${countSql}`);
                return {
                    data: data,
                    count: (countSql) ? (await v.query(countSql, [content]))[0]["count(1)"]
                        :
                            (await v.query(countText, [
                                content
                            ]))[0]["count(1)"]
                };
            }
            catch (e) {
                console.log(e);
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
            }
        });
    }
}
exports.Post = Post;
Post.postObserverList = [];
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
//# sourceMappingURL=post.js.map