import db, { limit, queryLambada } from '../../modules/database';
import exception from '../../modules/exception';
import { IToken } from '../models/Auth.js';
import { App } from '../../services/app.js';
import { Shopping } from './shopping.js';
import { UtDatabase } from '../utils/ut-database.js';
import { ManagerNotify } from './notify.js';

export class Post {
    public app: string;
    public token: IToken;
    public static postObserverList: ((data: any, app: string) => void)[] = [];
    public static lambda_function: any = {};

    public static addPostObserver(callback: (data: any, app: string) => void) {
        Post.postObserverList.push(callback);
    }

    public async postContent(content: any, tb: string = 't_post') {
        try {
            const data = await db.query(
                `INSERT INTO \`${this.app}\`.\`${tb}\`
                 SET ?`,
                [content],
            );
            const reContent = JSON.parse(content.content);
            if (reContent.type === 'product' && tb === 't_manager_post') {
                await new Shopping(this.app, this.token).postVariantsAndPriceValue(reContent);
            }
            if (reContent.type === 'post-form-config') {
                await new ManagerNotify(this.app).formSubmit({
                    user_id: content.userID,
                });
            }
            reContent.id = data.insertId;
            content.content = JSON.stringify(reContent);
            await db.query(
                `update \`${this.app}\`.\`${tb}\`
                 SET ?
                 WHERE id = ${data.insertId}`,
                [content],
            );

            Post.postObserverList.map((value, index, array) => {
                value(content, this.app);
            });
            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }

    public async sqlApi(router: string, datasource: any) {
        try {
            const apConfig = await App.getAdConfig(this.app, 'sql_api_config_post');
            const sq = apConfig.apiList.find((dd: any) => {
                return dd.route === router;
            });
            const sql = (() => {
                return eval(sq.sql);
            })().replaceAll('$app', `\`${this.app}\``);
            await db.query(sql, []);
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'SqlApi Error:' + e, null);
        }
    }

    public async lambda(query: any, router: string, datasource: any, type: string) {
        try {
            return await db.queryLambada(
                {
                    database: this.app,
                },
                async (sql) => {
                    let user: any = undefined;
                    if (!Post.lambda_function[this.app]) {
                        Post.lambda_function[this.app] = await App.getAdConfig(this.app, 'sql_api_config_post');
                    }
                    if (this.token) {
                        user =
                            (
                                await sql.query(
                                    `select *
                                     from t_user
                                     where userID = ${this.token.userID ?? 0}`,
                                    [],
                                )
                            )[0] ?? user;
                    }
                    const sqlType = await (async () => {
                        const sq = Post.lambda_function[this.app].apiList.find((dd: any) => {
                            return dd.route === router && dd.type === type;
                        });
                        if (!sq) {
                            throw exception.BadRequestError('BAD_REQUEST', `Router ${router} not exist.`, null);
                        }
                        const html = String.raw;
                        const myFunction = new Function(html`try { return
                        ${sq.sql.replace(
                            /new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i,
                            'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })',
                        )}
                        } catch (error) { return 'error'; }`);

                        return (() => {
                            try {
                                return myFunction();
                            } catch (e) {
                                throw exception.BadRequestError('BAD_REQUEST', e as any, null);
                            }
                        })();
                    })();
                    if (!sqlType) {
                        throw exception.BadRequestError('BAD_REQUEST', 'SqlApi Error', null);
                    } else {
                        return new Promise<any>(async (resolve, reject) => {
                            try {
                                sqlType
                                    .execute(sql, {
                                        user: user,
                                        data: datasource,
                                        app: this.app,
                                        query: query,
                                        firebase: {
                                            sendMessage: (message: {
                                                notification: {
                                                    title: string;
                                                    body: string;
                                                };
                                                type: 'topic' | 'token';
                                                for: string;
                                            }) => {
                                            },
                                        },
                                    })
                                    .then((data: any) => {
                                        resolve({ result: true, data: data });
                                    })
                                    .catch((e: any) => {
                                        resolve({ result: false, message: e });
                                    });
                            } catch (e) {
                                console.error(e);
                                reject(e);
                            }
                        });
                    }
                },
            );
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'SqlApi Error:' + e, null);
        }
    }

    public async putContent(content: any, tb: string = 't_post') {
        try {
            const reContent = JSON.parse(content.content);
            if (reContent.type === 'product' && tb === 't_manager_post') {
                await new Shopping(this.app, this.token).postVariantsAndPriceValue(reContent);
                content.content = JSON.stringify(reContent);
            }
            content.updated_time = new Date();
            const data = await db.query(
                `update \`${this.app}\`.\`${tb}\`
                 SET ?
                 where 1 = 1
                   and userID = ${this.token.userID}
                   and id = ${reContent.id}`,
                [content],
            );
            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }

    public async getContentV2(query: any, manager: boolean) {
        try {
            query.page = query.page ?? 0;
            query.limit = query.limit ?? 10;
            let querySql: any = [];
            query.id && querySql.push(`id=${query.id}`);
            query.search &&
            query.search.split(',').map((dd: any) => {
                if (dd.includes('->')) {
                    const qu = dd.split('->');
                    querySql.push(`(content->>'$.${qu[0]}'='${qu[1]}')`);
                } else if (dd.includes('-|>')) {
                    const qu = dd.split('-|>');
                    querySql.push(`(content->>'$.${qu[0]}' like '%${qu[1]}%')`);
                } else if (dd.includes('-[]>')) {
                    const qu = dd.split('-[]>');
                    querySql.push(`(JSON_CONTAINS(content, '"${qu[1]}"', '$.${qu[0]}'))`);
                }
            });
            return await new UtDatabase(this.app, manager ? `t_manager_post` : `t_post`).querySql(querySql, query);
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GetContentV2 Error:' + e, null);
        }
    }

    public async getContent(content: any) {
        return await queryLambada(
            {
                database: this.app,
            },
            async (v) => {
                try {
                    const apConfig = await App.getAdConfig(this.app, 'sql_api_config');
                    let userData: any = {};
                    let countSql = '';
                    let sql = (() => {
                        if (content.queryType === 'sql') {
                            const datasource = JSON.parse(content.datasource);
                            const sq = apConfig.apiList.find((dd: any) => {
                                return dd.route === datasource.route;
                            });
                            return eval(sq.sql).replaceAll('$app', `\`${this.app}\``);
                        } else {
                            let query = ``;
                            const app = this.app;
                            let selectOnly = ` * `;

                            function getQueryString(dd: any): any {
                                if (!dd || dd.length === 0 || dd.key === '') {
                                    return ``;
                                }

                                if (dd.type === 'relative_post') {
                                    dd.query = dd.query ?? [];
                                    return ` and JSON_EXTRACT(content, '$.${dd.key}') in (SELECT JSON_EXTRACT(content, '$.${dd.value}') AS datakey
 from \`${app}\`.t_post where 1=1 ${dd.query
                                        .map((dd: any) => {
                                            return getQueryString(dd);
                                        })
                                        .join(`  `)})`;
                                } else if (dd.type === 'in') {
                                    return `and JSON_EXTRACT(content, '$.${dd.key}') in (${dd.query
                                        .map((dd: any) => {
                                            return typeof dd.value === 'string' ? `'${dd.value}'` : dd.value;
                                        })
                                        .join(',')})`;
                                } else if (dd.type) {
                                    return ` and JSON_EXTRACT(content, '$.${dd.key}') ${dd.type} ${typeof dd.value === 'string' ? `'${dd.value}'` : dd.value}`;
                                } else {
                                    return ` and JSON_EXTRACT(content, '$.${dd.key}') LIKE '%${dd.value}%'`;
                                }
                            }

                            function getSelectString(dd: any): any {
                                if (!dd || dd.length === 0) {
                                    return ``;
                                }
                                if (dd.type === 'SUM') {
                                    return ` SUM(JSON_EXTRACT(content, '$.${dd.key}')) AS ${dd.value}`;
                                } else if (dd.type === 'count') {
                                    return ` count(1)`;
                                } else if (dd.type === 'AVG') {
                                    return ` AVG(JSON_EXTRACT(content, '$.${dd.key}')) AS ${dd.value}`;
                                } else {
                                    return ` JSON_EXTRACT(content, '$.${dd.key}') AS '${dd.value}' `;
                                }
                            }

                            if (content.query) {
                                content.query = JSON.parse(content.query);
                                content.query.map((dd: any) => {
                                    query += getQueryString(dd);
                                });
                            }

                            if (content.selectOnly) {
                                content.selectOnly = JSON.parse(content.selectOnly);
                                content.selectOnly.map((dd: any, index: number) => {
                                    if (index === 0) {
                                        selectOnly = '';
                                    }
                                    selectOnly += getSelectString(dd);
                                });
                            }
                            if (content.datasource) {
                                content.datasource = JSON.parse(content.datasource);
                                if (content.datasource.length > 0) {
                                    query += ` and userID in ('${content.datasource
                                        .map((dd: any) => {
                                            return dd;
                                        })
                                        .join('\',\'')}')`;
                                }
                            }
                            countSql = `select count(1)
                                        from \`${this.app}\`.\`t_post\`
                                        where 1 = 1
                                            ${query}
                                        order by id desc ${limit(content)}`;

                            return `select ${selectOnly}
                                    from \`${this.app}\`.\`t_post\`
                                    where 1 = 1
                                        ${query}
                                    order by id desc ${limit(content)}`;
                        }
                    })();

                    const data = await v.query(sql.replace('$countIndex', ''), []);
                    for (const dd of data) {
                        if (!dd.userID) {
                            continue;
                        }
                        if (!userData[dd.userID]) {
                            try {
                                userData[dd.userID] = (
                                    await v.query(
                                        `select userData
                                         from \`${this.app}\`.\`t_user\`
                                         where userID = ${dd.userID}`,
                                        [],
                                    )
                                )[0]['userData'];
                            } catch (e) {
                            }
                        }
                        dd.userData = userData[dd.userID];
                    }
                    let countText = (() => {
                        if (sql.indexOf('$countIndex') !== -1) {
                            const index = sql.indexOf('$countIndex');
                            return `select count(1)
                                    from ${sql.substring(index + 11)}`;
                        } else {
                            return `select count(1)
                                     ${sql.substring(sql.lastIndexOf(' from '))}`;
                        }
                    })();
                    countText = countText.substring(0, countText.indexOf(' order ') ?? countText.length);
                    return {
                        data: data,
                        count: countSql ? (await v.query(countSql, [content]))[0]['count(1)'] : (await v.query(countText, [content]))[0]['count(1)'],
                    };
                } catch (e) {
                    console.error(e);
                    throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
                }
            },
        );
    }

    constructor(app: string, token: IToken) {
        this.app = app;
        this.token = token;
    }
}
