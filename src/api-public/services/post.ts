import db, {limit} from '../../modules/database';
import exception from "../../modules/exception";
import tool from "../../services/tool";
import UserUtil from "../../utils/UserUtil";
import {IToken} from "../models/Auth.js";

export class Post {
    public app: string
    public token: IToken

    public async postContent(content: any) {
        try {

            const data = await db.query(`INSERT INTO \`${this.app}\`.\`t_post\`
                                         SET ?`, [
                content
            ])
            const reContent = JSON.parse(content.content)
            reContent.id = data.insertId
            content.content = JSON.stringify(reContent)
            await db.query(`update \`${this.app}\`.t_post
                            SET ?
                            WHERE id = ${data.insertId}`, [content])
            return data
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }

    public async putContent(content: any) {
        try {

            const reContent = JSON.parse(content.content)
            const data = await db.query(`update \`${this.app}\`.\`t_post\`
                                         SET ?
                                         where 1 = 1
                                           and id = ${reContent.id}`, [
                content
            ])
            reContent.id = data.insertId
            content.content = JSON.stringify(reContent)

            await db.query(`update \`${this.app}\`.t_post
                            SET ?
                            WHERE id = ${data.insertId}`, [content])
            return data
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }

    public async getContent(content: any) {
        try {
            let userData: any = {}
            let query = ``;
            const app = this.app
            let selectOnly = ` * `
            function getQueryString(dd: any): any {
                if (!dd || dd.length === 0 || dd.key==='') {
                    return ``
                }
                if (dd.type === 'relative_post') {
                    dd.query = dd.query ?? []
                    return ` and JSON_EXTRACT(content, '$.${dd.key}') in (SELECT JSON_EXTRACT(content, '$.${dd.value}') AS datakey
 from \`${app}\`.t_post where 1=1 ${dd.query.map((dd: any) => {
                        return getQueryString(dd)
                    }).join(`  `)})`
                } else if (dd.type) {
                    return ` and JSON_EXTRACT(content, '$.${dd.key}') ${dd.type} ${(typeof dd.value === 'string') ? `'${dd.value}'` : dd.value}`
                } else {
                    return ` and JSON_EXTRACT(content, '$.${dd.key}') LIKE '%${dd.value}%'`
                }
            }

            function getSelectString(dd: any): any {
                if (!dd || dd.length === 0) {
                    return ``
                }
                if (dd.type === 'SUM') {
                    return ` SUM(JSON_EXTRACT(content, '$.${dd.key}')) AS ${dd.value}`
                } else if(dd.type === 'count'){
                    return  ` count(1)`
                }else{
                    return `  JSON_EXTRACT(content, '$.${dd.key}') AS '${dd.value}' `
                }
            }
            if (content.query) {
                content.query = JSON.parse(content.query)
                content.query.map((dd: any) => {
                    query += getQueryString(dd)
                })
            }
            console.log(`query---`,query)
            if (content.selectOnly) {
                content.selectOnly = JSON.parse(content.selectOnly)
                content.selectOnly.map((dd: any,index:number) => {
                    if(index===0){selectOnly=''}
                    selectOnly += getSelectString(dd)
                })
            }
            if (content.datasource) {
                content.datasource = JSON.parse(content.datasource)
                if (content.datasource.length > 0) {
                    query += ` and userID in ('${content.datasource.map((dd: any) => {
                        return dd
                    }).join("','")}')`
                }
            }
            const data = (await db.query(`select ${selectOnly}
                                          from \`${this.app}\`.\`t_post\`
                                          where userID in (select userID
                                                           from \`${this.app}\`.\`user\`)
                                              ${query}
                                          order by id desc ${limit(content)}`, [
                content
            ]))

            for (const dd of data) {
                if (!userData[dd.userID]) {
                    userData[dd.userID] = (await db.query(`select userData
                                                           from \`${this.app}\`.\`user\`
                                                           where userID = ${dd.userID}`, []))[0]['userData']
                }
                dd.userData = userData[dd.userID]
            }
            return {
                data: data,
                count: (await db.query(`select count(1)
                                        from \`${this.app}\`.\`t_post\`
                                        where userID in (select userID
                                                         from \`${this.app}\`.\`user\`)
                                            ${query}`, [
                    content
                ]))[0]["count(1)"]
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }

    constructor(app: string, token: IToken) {
        this.app = app
        this.token = token
    }
}

function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`
    return userID;
}