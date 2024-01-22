"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const ut_database_js_1 = require("../utils/ut-database.js");
const user_js_1 = require("./user.js");
const ses_js_1 = require("../../services/ses.js");
class Chat {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async addChatRoom(room) {
        try {
            if (room.type === 'user') {
                room.chat_id = room.participant.sort().join('-');
            }
            else {
                room.chat_id = generateChatID();
            }
            if (((await database_1.default.query(`select count(1)
                                  from \`${this.app}\`.t_chat_list
                                  where chat_id = ?`, [room.chat_id]))[0]['count(1)']) === 1) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'THIS CHATROOM ALREADY EXISTS.', null);
            }
            else {
                const data = await database_1.default.query(`INSERT INTO \`${this.app}\`.\`t_chat_list\`
                                             SET ?`, [
                    {
                        chat_id: room.chat_id,
                        type: room.type,
                        info: room.info
                    }
                ]);
                for (const b of room.participant) {
                    await database_1.default.query(`
                        insert into \`${this.app}\`.\`t_chat_participants\`
                        set ?
                    `, [
                        {
                            chat_id: room.chat_id,
                            user_id: b
                        }
                    ]);
                }
                return data;
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'AddChatRoom Error:' + e, null);
        }
    }
    async getChatRoom(qu, userID) {
        var _a;
        try {
            let query = [];
            qu.befor_id && query.push(`id<${qu.befor_id}`);
            qu.after_id && query.push(`id>${qu.after_id}`);
            query.push(`chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${database_1.default.escape(userID)})`);
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_chat_list`).querySql(query, qu);
            for (const b of data.data) {
                if (b.type === 'user') {
                    const user = b.chat_id.split('-').find((dd) => {
                        return dd !== userID;
                    });
                    b.topMessage = ((await database_1.default.query(`SELECT message
                                                     FROM \`${this.app}\`.t_chat_detail
                                                     where chat_id = ${database_1.default.escape(b.chat_id)}
                                                     order by id desc limit 0,1;`, []))[0]);
                    b.topMessage = b.topMessage && b.topMessage.message;
                    b.who = user;
                    if (user) {
                        try {
                            b.user_data = await new user_js_1.User(this.app).getUserData(user, 'userID');
                        }
                        catch (e) {
                        }
                    }
                }
            }
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', 'GetChatRoom Error:' + e.message, null);
        }
    }
    async addMessage(room) {
        var _a, _b, _c;
        try {
            const chatRoom = ((await database_1.default.query(`select *
                                               from \`${this.app}\`.t_chat_list
                                               where chat_id = ?`, [room.chat_id])))[0];
            if (!chatRoom) {
                throw exception_1.default.BadRequestError('NO_CHATROOM', 'THIS CHATROOM DOES NOT EXISTS.', null);
            }
            const user = (await database_1.default.query(`SELECT userData
                                          FROM \`${this.app}\`.t_user
                                          where userID = ?`, [room.user_id]))[0];
            const particpant = await database_1.default.query(`SELECT *
                                               FROM \`${this.app}\`.t_chat_participants
                                               where chat_id = ?`, [room.chat_id]);
            await database_1.default.query(`
                insert into \`${this.app}\`.\`t_chat_detail\`
                set ?
            `, [
                {
                    chat_id: room.chat_id,
                    user_id: room.user_id,
                    message: JSON.stringify(room.message)
                }
            ]);
            for (const b of particpant) {
                if (b.user_id !== room.user_id) {
                    const post = new user_js_1.User(this.app, this.token);
                    const robot = (_b = ((_a = (await post.getConfig({
                        key: 'robot_auto_reply',
                        user_id: b.user_id
                    }))[0]) !== null && _a !== void 0 ? _a : {})['value']) !== null && _b !== void 0 ? _b : {};
                    if (robot.question) {
                        for (const d of robot.question) {
                            if (d.ask === room.message.text) {
                                await database_1.default.query(`
                                    insert into \`${this.app}\`.\`t_chat_detail\`
                                    set ?
                                `, [
                                    {
                                        chat_id: room.chat_id,
                                        user_id: b.user_id,
                                        message: JSON.stringify({
                                            text: d.response
                                        })
                                    }
                                ]);
                                break;
                            }
                        }
                    }
                }
            }
            const notifyUser = particpant.filter((dd) => {
                return dd.user_id && (!isNaN(dd.user_id) && !isNaN(parseFloat(dd.user_id))) && (`${dd.user_id}` !== `${room.user_id}`);
            }).map((dd) => {
                return dd.user_id;
            });
            const userData = await database_1.default.query(`SELECT userData
                                             FROM \`${this.app}\`.t_user
                                             where userID in (${(() => {
                const id = ['0'].concat(notifyUser);
                return id.join(',');
            })()});`, []);
            for (const dd of userData) {
                if (dd.userData.email) {
                    if (chatRoom.type === 'user') {
                        if (room.message.text) {
                            if (user) {
                                await (0, ses_js_1.sendmail)(`service@ncdesign.info`, dd.userData.email, `${user.userData.name}:傳送訊息給您`, this.templateWithCustomerMessage(`收到訊息`, `${user.userData.name}傳送訊息給您:`, room.message.text));
                            }
                            else if (room.user_id === 'manager') {
                                await (0, ses_js_1.sendmail)(`service@ncdesign.info`, dd.userData.email, `官方客服訊息`, this.templateWithCustomerMessage('客服訊息', `收到客服回覆:`, room.message.text));
                            }
                            else {
                                await (0, ses_js_1.sendmail)(`service@ncdesign.info`, dd.userData.email, "有人傳送訊息給您", this.templateWithCustomerMessage('收到匿名訊息', `有一則匿名訊息:`, room.message.text));
                            }
                        }
                    }
                }
            }
            if (particpant.find((dd) => {
                return dd.user_id === 'manager';
            }) && room.user_id !== 'manager') {
                const managerUser = (await database_1.default.query(`select userData
                                                     from ${process.env.GLITTER_DB}.t_user
                                                     where userID in (select user
                                                                      from ${process.env.GLITTER_DB}.app_config
                                                                      where appName = ${database_1.default.escape(this.app)})`, []))[0];
                if (user) {
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, managerUser['userData'].email, `有一則客服訊息`, this.templateWithCustomerMessage('收到客服訊息', ` ${user.userData.name}傳送一則客服訊息:`, room.message.text));
                }
                else {
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, managerUser['userData'].email, "有一則匿名客服訊息", this.templateWithCustomerMessage('收到客服訊息', `收到一則匿名客服訊息:`, room.message.text));
                }
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_c = e.code) !== null && _c !== void 0 ? _c : 'BAD_REQUEST', 'AddMessage Error:' + e.message, null);
        }
    }
    templateWithCustomerMessage(subject, title, message) {
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
    async getMessage(qu) {
        var _a;
        try {
            let query = [
                `chat_id=${database_1.default.escape(qu.chat_id)}`
            ];
            qu.befor_id && query.push(`id<${qu.befor_id}`);
            qu.after_id && query.push(`id>${qu.after_id}`);
            return await new ut_database_js_1.UtDatabase(this.app, `t_chat_detail`).querySql(query, qu);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', 'GetMessage Error:' + e.message, null);
        }
    }
}
exports.Chat = Chat;
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
//# sourceMappingURL=chat.js.map