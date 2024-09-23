import db, { limit } from '../../modules/database';
import exception from '../../modules/exception';
import tool from '../../services/tool';
import UserUtil from '../../utils/UserUtil';
import { IToken } from '../models/Auth.js';
import { UtDatabase } from '../utils/ut-database.js';
import { User } from './user.js';
import { sendmail } from '../../services/ses.js';
import { App } from '../../services/app.js';
import { WebSocket } from '../../services/web-socket.js';
import { sendMessage } from '../../firebase/message.js';
import { Firebase } from '../../modules/firebase.js';
import { AutoSendEmail } from './auto-send-email.js';
import OpenAI from 'openai';
import moment from 'moment/moment.js';
import { Private_config } from '../../services/private_config.js';
import { Ai } from '../../services/ai.js';

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
        text: string;
        attachment: any;
    };
}

export class Chat {
    public app: string;
    public token: IToken;

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
                )[0]['count(1)'] === 1
            ) {
                throw exception.BadRequestError('BAD_REQUEST', 'THIS CHATROOM ALREADY EXISTS.', null);
            } else {
                const data = await db.query(
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
                        `
                        insert into \`${this.app}\`.\`t_chat_last_read\`
                        set ?
                    `,
                        [
                            {
                                chat_id: room.chat_id,
                                user_id: b,
                                last_read: new Date(),
                            },
                        ]
                    );
                }
                return data;
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'AddChatRoom Error:' + e, null);
        }
    }

    public async getChatRoom(qu: any, userID: string) {
        try {
            let query: string[] = [];
            qu.befor_id && query.push(`id<${qu.befor_id}`);
            qu.after_id && query.push(`id>${qu.after_id}`);
            qu.chat_id && query.push(`chat_id=${db.escape(qu.chat_id)}`);
            query.push(`chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${db.escape(userID)})`);
            qu.order_string = `order by updated_time desc`;
            const data = await new UtDatabase(this.app, `t_chat_list`).querySql(query, qu);
            for (const b of data.data) {
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
                    b.unread = (
                        await db.query(
                            `SELECT count(1) FROM \`${this.app}\`.t_chat_detail,\`${this.app}\`.t_chat_last_read where t_chat_detail.chat_id in (SELECT chat_id FROM \`${
                                this.app
                            }\`.t_chat_participants where user_id=${db.escape(userID)})
            and (t_chat_detail.chat_id != 'manager-preview') and t_chat_detail.user_id!=${db.escape(userID)} and t_chat_detail.chat_id=${db.escape(
                                b.chat_id
                            )} and t_chat_detail.chat_id=t_chat_last_read.chat_id and t_chat_last_read.last_read < created_time `,
                            []
                        )
                    )[0]['count(1)'];
                    if (b.topMessage) {
                        b.topMessage.message.created_time = b.topMessage.created_time;
                        b.topMessage = b.topMessage && b.topMessage.message;
                    }
                    b.who = user;
                    if (user) {
                        try {
                            b.user_data = ((await new User(this.app).getUserData(user, 'userID')) ?? {}).userData ?? {};
                        } catch (e) {}
                    }
                }
            }
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
            //傳送者
            const user = (
                await db.query(
                    `SELECT userID,userData
                                          FROM \`${this.app}\`.t_user
                                          where userID = ?`,
                    [room.user_id]
                )
            )[0];
            //參加者
            const particpant = await db.query(
                `SELECT *
                                               FROM \`${this.app}\`.t_chat_participants
                                               where chat_id = ?`,
                [room.chat_id]
            );
            //更新聊天內容的時間點
            await db.query(`update \`${this.app}\`.t_chat_list set updated_time=NOW() where chat_id = ?`, [room.chat_id]);
            const insert = await db.query(
                `
                insert into \`${this.app}\`.\`t_chat_detail\`
                set ?
            `,
                [
                    {
                        chat_id: room.chat_id,
                        user_id: room.user_id,
                        message: JSON.stringify(room.message),
                        created_time: new Date(),
                    },
                ]
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
                    //AI問答
                    if (b.user_id === 'robot') {
                        const response = await this.askAI(room.message.text);
                        const insert = await db.query(
                            `
                                    insert into \`${this.app}\`.\`t_chat_detail\`
                                    set ?
                                `,
                            [
                                {
                                    chat_id: room.chat_id,
                                    user_id: b.user_id,
                                    message: JSON.stringify({
                                        text: response,
                                    }),
                                    created_time: new Date(),
                                },
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
                                    text: response,
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
                                    set ?
                                `,
                                        [
                                            {
                                                chat_id: room.chat_id,
                                                user_id: b.user_id,
                                                message: JSON.stringify({
                                                    text: d.response,
                                                }),
                                                created_time: new Date(),
                                            },
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
                `SELECT userData,userID
                                             FROM \`${this.app}\`.t_user
                                             where userID in (${(() => {
                                                 const id = ['0'].concat(notifyUser);
                                                 return id.join(',');
                                             })()});`,
                []
            );
            //SAAS品牌和用戶類型
            const managerUser = await App.checkBrandAndMemberType(this.app);

            for (const dd of userData) {
                (WebSocket.messageChangeMem[`${dd.userID}`] ?? []).map((d2) => {
                    d2.callback({
                        type: 'update_message_count',
                    });
                });
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
            //客服訊息區塊
            if (
                particpant.find((dd: any) => {
                    return dd.user_id === 'manager';
                }) &&
                room.user_id !== 'manager'
            ) {
                const template = await AutoSendEmail.getDefCompare(this.app, 'get-customer-message');
                await sendmail(
                    `service@ncdesign.info`,
                    managerUser['userData'].email,
                    template.title,
                    template.content.replace(/@{{text}}/g, room.message.text).replace(/@{{link}}/g, managerUser.domain)
                );
            }
        } catch (e: any) {
            console.log(e);
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', 'AddMessage Error:' + e!.message, null);
        }
    }

    public async updateLastRead(userID: string, chat_id: string) {
        await db.query(
            `replace
        into  \`${this.app}\`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,?);`,
            [userID, chat_id, new Date()]
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
            into  \`${this.app}\`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,?);`,
                [qu.user_id, qu.chat_id, new Date()]
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
            `SELECT \`${this.app}\`.t_chat_detail.* FROM \`${this.app}\`.t_chat_detail,\`${this.app}\`.t_chat_last_read where t_chat_detail.chat_id in (SELECT chat_id FROM \`${
                this.app
            }\`.t_chat_participants where user_id=${db.escape(user_id)})
            and (t_chat_detail.chat_id != 'manager-preview') and t_chat_detail.user_id!=${db.escape(
                user_id
            )} and t_chat_detail.chat_id=t_chat_last_read.chat_id and t_chat_last_read.last_read < created_time order by id desc`,
            []
        );
    }

    public async unReadMessageCount(user_id: string) {
        return await db.query(
            `SELECT \`${this.app}\`.t_chat_detail.* FROM \`${this.app}\`.t_chat_detail,\`${this.app}\`.t_chat_last_read where t_chat_detail.chat_id in (SELECT chat_id FROM \`${
                this.app
            }\`.t_chat_participants where user_id=${db.escape(user_id)})
            and (t_chat_detail.chat_id != 'manager-preview') and t_chat_detail.user_id!=${db.escape(
                user_id
            )} and t_chat_detail.chat_id=t_chat_last_read.chat_id and t_chat_last_read.last_read < created_time order by id desc`,
            []
        );
    }

    //AI問答功能
    public async askAI(question: string) {
        let cf = (
            (
                await Private_config.getConfig({
                    appName: this.app,
                    key: 'ai_config',
                })
            )[0] ?? {
                value: {
                    order_files: '',
                    messageThread: '',
                },
            }
        ).value;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建客服小姐
        const query = `現在時間為${moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss')}，你擔任的是一個電商後台的AI機器人，能協助處理任何問題。

所有問答只需要回傳結果就好，不需要顯示code_interpreter與解釋程式碼。

我會提供你2個檔案，第一個檔案是訂單列表，第二個檔案是操作導引。

訂單列表: 用來做訂單分析的JSON陣列檔案，陣列中每個物件皆代表一份訂單，訂單中的購買商品列表是這個訂單中購買商品，會有一件或多件商品。使用者會查詢出貨狀態、付款狀態、收件人資訊、顧客資訊。

操作導引: 用來做進行操作導引與關鍵字搜尋的JSON陣列檔案，其中包含question
, answer欄位，當用戶提出的問題，先判斷問題性質包含了哪些question的可能，判斷question後，最後直接給予answer回答。

如果用戶提問的內容跟這兩個檔案有關，請選擇檔案類型進行分析並回答結果。`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            tools: [{ type: 'code_interpreter' }],
            tool_resources: {
                code_interpreter: {
                    file_ids: [cf.order_files, Ai.files.guide],
                },
            },
            model: 'gpt-4o-mini',
        });

        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(cf.messageThread, { role: 'user', content: question });
        //建立數據流
        const stream = await openai.beta.threads.runs.create(cf.messageThread, { assistant_id: myAssistant.id, stream: true });

        let text = '';
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
        }
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        return text.replace(regex, '');
    }
    constructor(app: string, token: IToken) {
        this.app = app;
        this.token = token;
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
