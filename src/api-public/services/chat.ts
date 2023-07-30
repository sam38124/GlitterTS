import db, {limit} from '../../modules/database';
import exception from "../../modules/exception";
import tool from "../../services/tool";
import UserUtil from "../../utils/UserUtil";
import {IToken} from "../models/Auth.js";

export interface ChatRoom {
    chat_id: string,
    info: any,
    participant: any
}

export class Chat {
    public app: string
    public token: IToken
    public static postObserverList: ((data: any, app: string) => void)[] = []

    public static addPostObserver(callback: (data: any, app: string) => void) {
        Chat.postObserverList.push(callback)
    }

    public async addChatRoom(room: ChatRoom) {
        try {
            room.participant=JSON.stringify(room.participant)
            room.info=JSON.stringify(room.info)
            const data = await db.query(`INSERT ignore INTO \`${this.app}\`.\`t_chat_list\`
                                         SET ?`, [
                room
            ])
            Chat.postObserverList.map((value, index, array) => {
                value({
                    type: 'addChat',
                    data: room
                }, this.app)
            })
            return data
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }

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
            Chat.postObserverList.map((value, index, array) => {
                value(content, this.app)
            })
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
                if (!dd || dd.length === 0 || dd.key === '') {
                    return ``
                }

                if (dd.type === 'relative_post') {
                    dd.query = dd.query ?? []
                    return ` and JSON_EXTRACT(content, '$.${dd.key}') in (SELECT JSON_EXTRACT(content, '$.${dd.value}') AS datakey
 from \`${app}\`.t_post where 1=1 ${dd.query.map((dd: any) => {
                        return getQueryString(dd)
                    }).join(`  `)})`
                } else if (dd.type === 'in') {

                    return `and JSON_EXTRACT(content, '$.${dd.key}') in (${dd.query.map((dd: any) => {
                        return (typeof dd.value === 'string') ? `'${dd.value}'` : dd.value
                    }).join(',')})`
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
                } else if (dd.type === 'count') {
                    return ` count(1)`
                } else if (dd.type === 'AVG') {
                    return ` AVG(JSON_EXTRACT(content, '$.${dd.key}')) AS ${dd.value}`
                } else {
                    return `  JSON_EXTRACT(content, '$.${dd.key}') AS '${dd.value}' `
                }
            }

            if (content.query) {
                content.query = JSON.parse(content.query)
                content.query.map((dd: any) => {
                    query += getQueryString(dd)
                })
            }
            console.log(`query---`, query)
            if (content.selectOnly) {
                content.selectOnly = JSON.parse(content.selectOnly)
                content.selectOnly.map((dd: any, index: number) => {
                    if (index === 0) {
                        selectOnly = ''
                    }
                    selectOnly += getSelectString(dd)
                })
            }
            console.log(`selectOnly---`, JSON.stringify(selectOnly))
            console.log(`select---`, selectOnly)
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
                                          where 1 = 1
                                              ${query}
                                          order by id desc ${limit(content)}`, [
                content
            ]))

            for (const dd of data) {
                if (!dd.userID) {
                    continue
                }
                if (!userData[dd.userID]) {
                    try {
                        userData[dd.userID] = (await db.query(`select userData
                                                               from \`${this.app}\`.\`user\`
                                                               where userID = ${dd.userID}`, []))[0]['userData']
                    } catch (e) {

                    }
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