import db, {limit} from '../../modules/database';
import exception from "../../modules/exception";
import tool from "../../services/tool";
import UserUtil from "../../utils/UserUtil";
import {IToken} from "../models/Auth.js";
import {UtDatabase} from "../utils/ut-database.js";
import {User} from "./user.js";

export interface ChatRoom {
    chat_id: string,
    type: 'user' | 'group'
    info: any,
    participant: string[]
}

export interface ChatMessage {
    chat_id: string,
    user_id: string,
    message: {
        text: string,
        attachment: any
    }
}


export class Chat {
    public app: string
    public token: IToken

    public async addChatRoom(room: ChatRoom) {
        try {
            if (room.type === 'user') {
                room.chat_id = room.participant.sort().join('-')
            } else {
                room.chat_id = generateChatID()
            }
            if (((await db.query(`select count(1)
                                  from \`${this.app}\`.t_chat_list
                                  where chat_id = ?`, [room.chat_id]))[0]['count(1)']) === 1) {
                throw exception.BadRequestError('BAD_REQUEST', 'THIS CHATROOM ALREADY EXISTS.', null);
            } else {
                const data = await db.query(`INSERT INTO \`${this.app}\`.\`t_chat_list\`
                                             SET ?`, [
                    {
                        chat_id: room.chat_id,
                        type: room.type,
                        info: room.info
                    }
                ])
                for (const b of room.participant) {
                    await db.query(`
                        insert into \`${this.app}\`.\`t_chat_participants\`
                        set ?
                    `, [
                        {
                            chat_id: room.chat_id,
                            user_id: b
                        }
                    ])
                }
                return data
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'AddChatRoom Error:' + e, null);
        }
    }

    public async getChatRoom(qu: any, userID: string) {
        try {
            let query: string[] = []
            qu.befor_id && query.push(`id<${qu.befor_id}`)
            qu.after_id && query.push(`id>${qu.after_id}`)
            query.push(`chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${db.escape(userID)})`)
            const data = await new UtDatabase(this.app, `t_chat_list`).querySql(query, qu)
            for (const b of data.data) {
                if (b.type === 'user') {
                    const user = b.chat_id.split('-').find((dd: any) => {
                        return dd !== userID
                    })
                    b.topMessage = ((await db.query(`SELECT message
                                                     FROM \`${this.app}\`.t_chat_detail
                                                     where chat_id = ${db.escape(b.chat_id)}
                                                     order by id desc limit 0,1;`, []))[0])
                    b.topMessage = b.topMessage && b.topMessage.message
                    b.who = user
                    if (user) {
                        try {
                            b.user_data = await new User(this.app).getUserData(user, 'userID');
                        } catch (e) {

                        }
                    }
                }
            }
            return data
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', 'GetChatRoom Error:' + e!.message, null);
        }

    }

    public async addMessage(room: ChatMessage) {
        try {
            const chatRoom = ((await db.query(`select *
                                               from \`${this.app}\`.t_chat_list
                                               where chat_id = ?`, [room.chat_id])))[0]
            if (!chatRoom) {
                throw exception.BadRequestError('NO_CHATROOM', 'THIS CHATROOM DOES NOT EXISTS.', null);
            }
            const particpant = await db.query(`SELECT *
                                               FROM \`${this.app}\`.t_chat_participants
                                               where chat_id = ?`, [room.chat_id]);
            await db.query(`
                insert into \`${this.app}\`.\`t_chat_detail\`
                set ?
            `, [
                {
                    chat_id: room.chat_id,
                    user_id: room.user_id,
                    message: JSON.stringify(room.message)
                }
            ])

            for (const b of particpant) {
                //機器人問答
                if (b.user_id !== room.user_id) {
                    const post = new User(this.app, this.token);
                    const robot = ((await post.getConfig({
                        key: 'robot_auto_reply',
                        user_id: b.user_id
                    }))[0] ?? {})['value'] ?? {}
                    if (robot.question) {
                        for (const d of robot.question) {
                            if (d.ask === room.message.text) {
                                await db.query(`
                                    insert into \`${this.app}\`.\`t_chat_detail\`
                                    set ?
                                `, [
                                    {
                                        chat_id: room.chat_id,
                                        user_id: b.user_id,
                                        message: JSON.stringify({
                                            text:d.response
                                        })
                                    }
                                ])
                                break
                            }
                        }
                    }
                }
            }
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', 'AddMessage Error:' + e!.message, null);
        }

    }

    public async getMessage(qu: any) {
        try {
            let query: string[] = [
                `chat_id=${db.escape(qu.chat_id)}`
            ]
            qu.befor_id && query.push(`id<${qu.befor_id}`)
            qu.after_id && query.push(`id>${qu.after_id}`)
            return await new UtDatabase(this.app, `t_chat_detail`).querySql(query, qu)
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', 'GetMessage Error:' + e!.message, null);
        }

    }

    constructor(app: string, token: IToken) {
        this.app = app
        this.token = token
    }
}

function generateChatID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`
    return userID;
}