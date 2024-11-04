import db from '../../modules/database';
import exception from '../../modules/exception';
import {IToken} from '../models/Auth.js';
import {UtDatabase} from '../utils/ut-database.js';
import {User} from './user.js';
import {sendmail} from '../../services/ses.js';
import {App} from '../../services/app.js';
import {WebSocket} from '../../services/web-socket.js';
import {Firebase} from '../../modules/firebase.js';
import {AutoSendEmail} from './auto-send-email.js';
import {AiRobot} from './ai-robot.js';
import {FbMessage} from './fb-message.js';
import {LineMessage} from './line-message.js';
import {ManagerNotify} from './notify.js';

const Jimp = require('jimp');

export interface ChatRoom {
    chat_id: string;
    type: 'user' | 'group';
    info: any;
    participant: string[];
}

export interface ChatMessage {
    chat_id: string;
    user_id: string;
    message: {
        text?: string;
        image?: string;
        attachment: any;
        ai_usage?:any;
        type?:'robot'|'manual'
    };
}

export class Chat {
    public app: string;
    public token?: IToken;

    public async addChatRoom(room: ChatRoom) {
        try {
            if (room.type === 'user') {
                room.chat_id = room.participant.sort().join('-');
            } else {
                room.chat_id = generateChatID();
            }

            if (
                (
                    await db.query(
                        `select count(1)
                         from \`${this.app}\`.t_chat_list
                         where chat_id = ?`,
                        [room.chat_id]
                    )
                )[0]['count(1)'] === 0
            ) {
                await db.query(
                    `INSERT INTO \`${this.app}\`.\`t_chat_list\`
                     SET ?`,
                    [
                        {
                            chat_id: room.chat_id,
                            type: room.type,
                            info: room.info,
                        },
                    ]
                );

                for (const b of room.participant) {
                    await db.query(
                        `
                            insert into \`${this.app}\`.\`t_chat_participants\`
                            set ?
                        `,
                        [
                            {
                                chat_id: room.chat_id,
                                user_id: b,
                            },
                        ]
                    );
                    await db.query(
                        `delete
                         from \`${this.app}\`.\`t_chat_last_read\`
                         where user_id = ?
                           and chat_id = ?`,
                        [b, room.chat_id]
                    );
                    await db.query(
                        `
                            insert into \`${this.app}\`.\`t_chat_last_read\`
                            set ?
                        `,
                        [
                            {
                                chat_id: room.chat_id,
                                user_id: b,
                                last_read: (() => {
                                    const today = new Date();
                                    // 设置昨天的日期
                                    today.setDate(today.getDate() - 2);
                                    return today;
                                })(),
                            },
                        ]
                    );
                }
                return {
                    result: 'OK',
                    create: true,
                };
            } else {
                return {
                    result: 'OK',
                    create: false,
                };
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'AddChatRoom Error:' + e, null);
        }
    }

    public async getChatRoom(qu: any, userID: string) {
        try {
            const start = new Date().getTime();
            let query: string[] = [];
            qu.befor_id && query.push(`id<${qu.befor_id}`);
            qu.after_id && query.push(`id>${qu.after_id}`);
            qu.chat_id && query.push(`chat_id=${db.escape(qu.chat_id)}`);
            query.push(`chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${db.escape(userID)})`);
            qu.order_string = `order by updated_time desc`;
            const data = await new UtDatabase(this.app, `t_chat_list`).querySql(query, qu);
            // console.log(`查詢Chat-list:${((new Date().getTime()) - start) / 1000}`)
            await new Promise(async (resolve, reject) => {
                let pass = 0;
                for (const b of data.data) {
                    new Promise(async (resolve, reject) => {
                        try {
                            if (b.type === 'user') {
                                const user = b.chat_id.split('-').find((dd: any) => {
                                    return dd !== userID;
                                });
                                b.topMessage = (
                                    await db.query(
                                        `SELECT message, created_time
                                         FROM \`${this.app}\`.t_chat_detail
                                         where chat_id = ${db.escape(b.chat_id)}
                                         order by id desc limit 0,1;`,
                                        []
                                    )
                                )[0];
                                // console.log(`查詢topMessage:${((new Date().getTime()) - start) / 1000}`)
                                b.unread = (
                                    await db.query(
                                        `SELECT count(1)
                                         FROM \`${this.app}\`.t_chat_detail,
                                              \`${this.app}\`.t_chat_last_read
                                         where t_chat_detail.chat_id in (SELECT chat_id
                                                                         FROM \`${this.app}\`.t_chat_participants
                                                                         where user_id = ${db.escape(userID)})
                                           and (t_chat_detail.chat_id != 'manager-preview')
                                           and t_chat_detail.user_id!=${db.escape(userID)}
                                           and t_chat_detail.chat_id=${db.escape(b.chat_id)}
                                           and t_chat_detail.chat_id=t_chat_last_read.chat_id
                                           and t_chat_last_read.last_read
                                             < created_time `,
                                        []
                                    )
                                )[0]['count(1)'];
                                // console.log(`查詢unread:${((new Date().getTime()) - start) / 1000}`)
                                if (b.topMessage) {
                                    b.topMessage.message.created_time = b.topMessage.created_time;
                                    b.topMessage = b.topMessage && b.topMessage.message;
                                }
                                b.who = user;
                                if (user) {
                                    try {
                                        b.user_data = ((await new User(this.app).getUserData(user, 'userID')) ?? {}).userData ?? {};
                                        // console.log(`查詢user:${((new Date().getTime()) - start) / 1000}`)
                                    } catch (e) {
                                    }
                                }
                            }
                            resolve(true);
                        } catch (e) {
                            resolve(false);
                        }
                    }).then(() => {
                        pass++;
                        if (pass === data.data.length) {
                            resolve(true);
                        }
                    });
                }
                if (pass === data.data.length) {
                    resolve(true);
                }
            });
            // console.log(`查詢Chat-DATA:${((new Date().getTime()) - start) / 1000}`)
            return data;
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', 'GetChatRoom Error:' + e!.message, null);
        }
    }

    public async addMessage(room: ChatMessage) {
        try {
            //聊天室
            const chatRoom = (
                await db.query(
                    `select *
                     from \`${this.app}\`.t_chat_list
                     where chat_id = ?`,
                    [room.chat_id]
                )
            )[0];
            if (!chatRoom) {
                throw exception.BadRequestError('NO_CHATROOM', 'THIS CHATROOM DOES NOT EXISTS.', null);
            }
            //檢查是不是要回傳給line
            if (room.chat_id.startsWith('line') && room.user_id == 'manager') {
                const newChatId = room.chat_id.slice(5).split('-')[0];
                await new LineMessage(this.app).sendLine(
                    {
                        data: room.message,
                        lineID: newChatId,
                    },
                    () => {
                    }
                );
            }
            //檢查是不是要回傳給fb
            if (room.chat_id.startsWith('fb') && room.user_id == 'manager') {
                const newChatId = room.chat_id.slice(3).split('-')[0];
                await new FbMessage(this.app).sendMessage(
                    {
                        data: room.message,
                        fbID: newChatId,
                    },
                    () => {
                    }
                );
            }
            //傳送者
            let user = (
                await db.query(
                    `SELECT userID, userData
                     FROM \`${this.app}\`.t_user
                     where userID = ?`,
                    [room.user_id]
                )
            )[0];
            //判斷第三方進行UserData的覆蓋
            if (room.user_id.startsWith('line')) {
                user = {
                    userData: (await db.query(`select info
                                               from \`${this.app}\`.t_chat_list
                                               where chat_id = ?`, [[room.user_id, 'manager'].sort().join('-')]))[0]['info']['line'],
                    userID: -1,
                };
            } else if (room.user_id.startsWith('fb')) {
                user = {
                    userData: (await db.query(`select info
                                               from \`${this.app}\`.t_chat_list
                                               where chat_id = ?`, [[room.user_id, 'manager'].sort().join('-')]))[0]['info']['fb'],
                    userID: -1,
                };
            }
            //參加者
            const particpant = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_chat_participants
                 where chat_id = ?`,
                [room.chat_id]
            );
            //更新聊天內容的時間點
            await db.query(
                `update \`${this.app}\`.t_chat_list
                 set updated_time=NOW()
                 where chat_id = ?`,
                [room.chat_id]
            );

            const insert = await db.query(
                `
                    insert into \`${this.app}\`.\`t_chat_detail\`
                        (chat_id, user_id, message, created_time)
                    values (?, ?, ?, NOW())
                `,
                [room.chat_id, room.user_id, JSON.stringify(room.message)]
            );
            for (const dd of WebSocket.chatMemory[this.app + room.chat_id] ?? []) {
                await this.updateLastRead(dd.user_id, room.chat_id);
                const userData = (
                    await db.query(
                        `select userData
                         from \`${this.app}\`.t_user
                         where userID = ?`,
                        [room.user_id]
                    )
                )[0];
                dd.callback({
                    id: insert.insertId,
                    chat_id: room.chat_id,
                    user_id: room.user_id,
                    message: room.message,
                    created_time: new Date(),
                    user_data: (userData && userData.userData) || {},
                    type: 'message',
                });
            }
            const lastRead = await this.getLastRead(room.chat_id);
            //manager-robot
            for (const dd of WebSocket.chatMemory[this.app + room.chat_id] ?? []) {
                dd.callback({
                    type: 'update_read_count',
                    data: lastRead,
                });
            }
            for (const b of particpant) {
                //發送通知
                if (b.user_id !== room.user_id) {
                    //訂單分析
                    if (['writer', 'order_analysis', 'operation_guide','design'].includes(b.user_id)) {
                        const response = await new Promise(async (resolve, reject) => {
                            switch (b.user_id) {
                                case 'writer':
                                    resolve(await AiRobot.writer(this.app, room.message.text ?? ''));
                                    return;
                                case 'order_analysis':
                                    resolve(await AiRobot.orderAnalysis(this.app, room.message.text ?? ''));
                                    return;
                                case 'operation_guide':
                                    resolve(await AiRobot.guide(this.app, room.message.text ?? ''));
                                    return;
                                case 'design':
                                    resolve(await AiRobot.design(this.app, room.message.text ?? ''));
                                    return
                            }
                        });
                        const insert = await db.query(
                            `
                                insert into \`${this.app}\`.\`t_chat_detail\`
                                    (chat_id, user_id, message, created_time)
                                values (?, ?, ?, NOW())
                            `,
                            [room.chat_id, b.user_id, JSON.stringify(response)]
                        );
                        for (const dd of WebSocket.chatMemory[this.app + room.chat_id] ?? []) {
                            const userData = (
                                await db.query(
                                    `select userData
                                     from \`${this.app}\`.t_user
                                     where userID = ?`,
                                    [b.user_id]
                                )
                            )[0];
                            await this.updateLastRead(dd.user_id, room.chat_id);
                            dd.callback({
                                id: insert.insertId,
                                chat_id: room.chat_id,
                                user_id: b.user_id,
                                message: response,
                                created_time: new Date(),
                                user_data: (userData && userData.userData) || {},
                                type: 'message',
                            });
                        }
                        const lastRead = await this.getLastRead(room.chat_id);
                        for (const dd of WebSocket.chatMemory[this.app + room.chat_id] ?? []) {
                            dd.callback({
                                type: 'update_read_count',
                                data: lastRead,
                            });
                        }
                    } else {
                        const post = new User(this.app, this.token);
                        const robot =
                            ((
                                await post.getConfig({
                                    key: 'robot_auto_reply',
                                    user_id: b.user_id,
                                })
                            )[0] ?? {})['value'] ?? {};
                        if (robot.question) {
                            for (const d of robot.question) {
                                if (d.ask === room.message.text) {
                                    const insert = await db.query(
                                        `
                                            insert into \`${this.app}\`.\`t_chat_detail\`
                                                (chat_id, user_id, message, created_time)
                                            values (?, ?, ?, NOW())
                                        `,
                                        [
                                            room.chat_id,
                                            b.user_id,
                                            JSON.stringify({
                                                text: d.response,
                                            }),
                                        ]
                                    );
                                    for (const dd of WebSocket.chatMemory[this.app + room.chat_id] ?? []) {
                                        const userData = (
                                            await db.query(
                                                `select userData
                                                 from \`${this.app}\`.t_user
                                                 where userID = ?`,
                                                [b.user_id]
                                            )
                                        )[0];
                                        await this.updateLastRead(dd.user_id, room.chat_id);
                                        dd.callback({
                                            id: insert.insertId,
                                            chat_id: room.chat_id,
                                            user_id: b.user_id,
                                            message: {
                                                text: d.response,
                                            },
                                            created_time: new Date(),
                                            user_data: (userData && userData.userData) || {},
                                            type: 'message',
                                        });
                                    }
                                    const lastRead = await this.getLastRead(room.chat_id);
                                    for (const dd of WebSocket.chatMemory[this.app + room.chat_id] ?? []) {
                                        dd.callback({
                                            type: 'update_read_count',
                                            data: lastRead,
                                        });
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // askAI
                }
            }
            //要傳送通知的對象
            const notifyUser = particpant
                .filter((dd: any) => {
                    return dd.user_id && !isNaN(dd.user_id) && !isNaN(parseFloat(dd.user_id)) && `${dd.user_id}` !== `${room.user_id}`;
                })
                .map((dd: any) => {
                    return dd.user_id;
                });
            //傳送信件通知
            const userData = await db.query(
                `SELECT userData, userID
                 FROM \`${this.app}\`.t_user
                 where userID in (${(() => {
                     const id = ['0'].concat(notifyUser);
                     return id.join(',');
                 })()});`,
                []
            );
            //通知更新訊息紅點
            particpant.map((dd: any) => {
                if (`${dd.user_id}` !== `${room.user_id}`) {
                    (WebSocket.messageChangeMem[`${dd.user_id}`] ?? []).map((d2) => {
                        d2.callback({
                            type: 'update_message_count',
                        });
                    });
                }
            });
            //SAAS品牌和用戶類型
            const managerUser = await App.checkBrandAndMemberType(this.app);
            for (const dd of userData) {
                if (dd.userData.email) {
                    if (chatRoom.type === 'user') {
                        if (room.message.text) {
                            if (user) {
                                if (
                                    !WebSocket.chatMemory[this.app + room.chat_id].find((d1) => {
                                        return `${d1.user_id}` === `${dd.userID}`;
                                    })
                                ) {
                                    await sendmail(
                                        `service@ncdesign.info`,
                                        dd.userData.email,
                                        `${user.userData.name}:傳送訊息給您`,
                                        this.templateWithCustomerMessage(`收到訊息`, `${user.userData.name}傳送訊息給您:`, room.message.text)
                                    );

                                    console.log(`收到訊息->${user.userID}`);
                                    await new Firebase(this.app).sendMessage({
                                        title: `收到訊息`,
                                        userID: dd.userID,
                                        tag: 'message',
                                        link: `./message?userID=${user.userID}`,
                                        body: `${user.userData.name}傳送訊息給您:${room.message.text}`,
                                    });
                                }
                            } else if (room.user_id === 'manager') {
                                // 商家寄給消費者，消費者會收到信件
                                const template = await AutoSendEmail.getDefCompare(this.app, 'get-customer-message');
                                await sendmail(
                                    `service@ncdesign.info`,
                                    dd.userData.email,
                                    template.title,
                                    template.content.replace(/@{{text}}/g, room.message.text).replace(/@{{link}}/g, managerUser.domain)
                                );
                            } else {
                                await sendmail(`service@ncdesign.info`, dd.userData.email, '有人傳送訊息給您', this.templateWithCustomerMessage('收到匿名訊息', `有一則匿名訊息:`, room.message.text));
                            }
                        }
                    }
                }
            }
            // 消費者寄給商家，商家會收到信件
            if (
                particpant.find((dd: any) => {
                    return dd.user_id === 'manager';
                }) &&
                room.user_id !== 'manager'
            ) {
                let message_setting = await (new User(this.app)).getConfigV2({
                    key:'message_setting',
                    user_id:'manager'
                })
                //判斷是否由機器人回答
                const ai_response_toggle = message_setting.ai_toggle
                if (ai_response_toggle) {
                    if (room.message.text) {
                       new Promise(async ()=>{
                           const aiResponse = await AiRobot.aiResponse(this.app, room.message.text as string)
                           if(aiResponse){
                               if (aiResponse?.text) {
                                   if(aiResponse?.text!=='no-data'){
                                       await this.addMessage({
                                           "chat_id": room.chat_id,
                                           "user_id": "manager",
                                           "message": {"text": aiResponse?.text, "attachment": "",ai_usage:aiResponse.usage,"type":"robot"}
                                       })
                                   }
                               }
                           }
                       })
                    }
                }
                const template = await AutoSendEmail.getDefCompare(this.app, 'get-customer-message');
                await new ManagerNotify(this.app).customerMessager({
                    title: template.title,
                    content: template.content.replace(/@{{text}}/g, room.message.text).replace(/@{{link}}/g, managerUser.domain),
                    user_name: (user) ? user.userData.name:'訪客',
                    room_image: room.message.image,
                    room_text: room.message.text,
                });
            }
        } catch (e: any) {
            console.log(e);
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', 'AddMessage Error:' + e!.message, null);
        }
    }

    public async updateLastRead(userID: string, chat_id: string) {
        await db.query(
            `replace
            into  \`${this.app}\`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,NOW());`,
            [userID, chat_id]
        );
    }

    public async getLastRead(chat_id: string) {
        return await db.query(
            `select *
             from \`${this.app}\`.t_chat_last_read
             where chat_id = ?;`,
            [chat_id]
        );
    }

    public templateWithCustomerMessage(subject: string, title: string, message: string) {
        return `<div id=":14y" class="ii gt adO" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTcyNTcxNjU2NTQ4OTk2MTY3OSJd; 4:WyIjbXNnLWY6MTcyNTcxNjY3NDU2Njc0OTY2MyJd"><div id=":14x" class="a3s aiL "><div id="m_-852875620297719051MailSample1"><div class="adM">
            </div><div style="clear:left;float:left;width:500px;background-color:#999999;border:10px solid #999999;margin-bottom:5px;font-size:1.2em;text-align:center;color:#ffffff">${subject}</div>
            <div style="clear:left;float:left;width:500px;border:10px solid #999999;padding-bottom:30px">
                <div style="float:left;margin:10px;font-size:.95em;line-height:25px">
                     ${title}
                     <br>
                     ${message}
                    </div></div><div class="adL">
            </div></div><div class="HOEnZb adL"><div class="adm"><div id="q_0" class="ajR h4"><div class="ajT"></div></div></div><div class="h5">
            <div style="clear:both;float:right;font-size:.85em;margin-top:5px;color:red;width:100%;text-align:right;margin-right:10px">
                Note: This letter is automatically sent by the system. Please don't reply directly
            </div>
        
</div></div></div></div>`;
    }

    public async getMessage(qu: any) {
        try {
            let query: string[] = [`chat_id=${db.escape(qu.chat_id)}`];
            qu.befor_id && query.push(`id<${qu.befor_id}`);
            qu.after_id && query.push(`id>${qu.after_id}`);

            await db.query(
                `replace
                into  \`${this.app}\`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,NOW());`,
                [qu.user_id, qu.chat_id]
            );
            if (!qu.befor_id) {
                const lastRead = await this.getLastRead(qu.chat_id);
                for (const dd of WebSocket.chatMemory[this.app + qu.chat_id] ?? []) {
                    dd.callback({
                        type: 'update_read_count',
                        data: lastRead,
                    });
                }
            }
            const res = await new UtDatabase(this.app, `t_chat_detail`).querySql(query, qu);
            const userID: any[] = [];
            res.data.map((dd: any) => {
                if (userID.indexOf(dd.user_id) === -1) {
                    userID.push(dd.user_id);
                }
            });
            let userDataStorage: any = {};
            for (const b of userID) {
                userDataStorage[b] = (
                    await db.query(
                        `select userData
                         from \`${this.app}\`.t_user
                         where userID = ?`,
                        [b]
                    )
                )[0];
                userDataStorage[b] = userDataStorage[b] && userDataStorage[b].userData;
            }
            res.data.map((dd: any) => {
                dd.user_data = userDataStorage[dd.user_id] ?? {};
            });
            (res as any).lastRead = await this.getLastRead(qu.chat_id);
            (WebSocket.messageChangeMem[qu.user_id] || []).map((dd) => {
                dd.callback({
                    type: 'update_message_count',
                });
            });

            return res;
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', 'GetMessage Error:' + e!.message, null);
        }
    }

    public async unReadMessage(user_id: string) {
        return await db.query(
            `SELECT \`${this.app}\`.t_chat_detail.*
             FROM \`${this.app}\`.t_chat_detail,
                  \`${this.app}\`.t_chat_last_read
             where t_chat_detail.chat_id in
                   (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id = ${db.escape(user_id)})
               and (t_chat_detail.chat_id != 'manager-preview')
               and t_chat_detail.user_id!=${db.escape(user_id)}
               and t_chat_last_read.user_id= ${db.escape(user_id)}
               and t_chat_detail.chat_id=t_chat_last_read.chat_id
               and t_chat_last_read.last_read
                 < created_time
             order by id desc`,
            []
        );
    }

    public async unReadMessageCount(user_id: string) {
        return await db.query(
            `SELECT \`${this.app}\`.t_chat_detail.*
             FROM \`${this.app}\`.t_chat_detail,
                  \`${this.app}\`.t_chat_last_read
             where t_chat_detail.chat_id in
                   (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id = ${db.escape(user_id)})
               and (t_chat_detail.chat_id != 'manager-preview')
               and t_chat_detail.user_id!=${db.escape(user_id)}
               and t_chat_detail.chat_id=t_chat_last_read.chat_id
               and t_chat_last_read.last_read
                 < created_time
             order by id desc`,
            []
        );
    }

    constructor(app: string, token?: IToken) {
        this.app = app;
        if (token) {
            this.token = token;
        }
    }
}

function generateChatID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`;
    return userID;
}
