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
const app_js_1 = require("../../services/app.js");
const web_socket_js_1 = require("../../services/web-socket.js");
const firebase_js_1 = require("../../modules/firebase.js");
class Chat {
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
                    await database_1.default.query(`
                        insert into \`${this.app}\`.\`t_chat_last_read\`
                        set ?
                    `, [
                        {
                            chat_id: room.chat_id,
                            user_id: b,
                            last_read: new Date()
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
        var _a, _b, _c;
        try {
            let query = [];
            qu.befor_id && query.push(`id<${qu.befor_id}`);
            qu.after_id && query.push(`id>${qu.after_id}`);
            qu.chat_id && query.push(`chat_id=${database_1.default.escape(qu.chat_id)}`);
            query.push(`chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${database_1.default.escape(userID)})`);
            qu.order_string = `order by updated_time desc`;
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_chat_list`).querySql(query, qu);
            for (const b of data.data) {
                if (b.type === 'user') {
                    const user = b.chat_id.split('-').find((dd) => {
                        return dd !== userID;
                    });
                    b.topMessage = ((await database_1.default.query(`SELECT message, created_time
                                                     FROM \`${this.app}\`.t_chat_detail
                                                     where chat_id = ${database_1.default.escape(b.chat_id)}
                                                     order by id desc limit 0,1;`, []))[0]);
                    b.unread = (await database_1.default.query(`SELECT count(1) FROM \`${this.app}\`.t_chat_detail,\`${this.app}\`.t_chat_last_read where t_chat_detail.chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${database_1.default.escape(userID)})
            and (t_chat_detail.chat_id != 'manager-preview') and t_chat_detail.user_id!=${database_1.default.escape(userID)} and t_chat_detail.chat_id=${database_1.default.escape(b.chat_id)} and t_chat_detail.chat_id=t_chat_last_read.chat_id and t_chat_last_read.last_read < created_time `, []))[0]['count(1)'];
                    if (b.topMessage) {
                        b.topMessage.message.created_time = b.topMessage.created_time;
                        b.topMessage = b.topMessage && b.topMessage.message;
                    }
                    b.who = user;
                    if (user) {
                        try {
                            b.user_data = (_b = ((_a = (await new user_js_1.User(this.app).getUserData(user, 'userID'))) !== null && _a !== void 0 ? _a : {}).userData) !== null && _b !== void 0 ? _b : {};
                        }
                        catch (e) {
                        }
                    }
                }
            }
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_c = e.code) !== null && _c !== void 0 ? _c : 'BAD_REQUEST', 'GetChatRoom Error:' + e.message, null);
        }
    }
    async addMessage(room) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            const chatRoom = ((await database_1.default.query(`select *
                                               from \`${this.app}\`.t_chat_list
                                               where chat_id = ?`, [room.chat_id])))[0];
            if (!chatRoom) {
                throw exception_1.default.BadRequestError('NO_CHATROOM', 'THIS CHATROOM DOES NOT EXISTS.', null);
            }
            const user = (await database_1.default.query(`SELECT userID,userData
                                          FROM \`${this.app}\`.t_user
                                          where userID = ?`, [room.user_id]))[0];
            const particpant = await database_1.default.query(`SELECT *
                                               FROM \`${this.app}\`.t_chat_participants
                                               where chat_id = ?`, [room.chat_id]);
            await database_1.default.query(`update \`${this.app}\`.t_chat_list set updated_time=NOW() where chat_id = ?`, [room.chat_id]);
            const insert = await database_1.default.query(`
                insert into \`${this.app}\`.\`t_chat_detail\`
                set ?
            `, [
                {
                    chat_id: room.chat_id,
                    user_id: room.user_id,
                    message: JSON.stringify(room.message),
                    created_time: new Date()
                }
            ]);
            for (const dd of ((_a = web_socket_js_1.WebSocket.chatMemory[room.chat_id]) !== null && _a !== void 0 ? _a : [])) {
                await this.updateLastRead(dd.user_id, room.chat_id);
                const userData = (await database_1.default.query(`select userData
                                                  from \`${this.app}\`.t_user
                                                  where userID = ?`, [room.user_id]))[0];
                dd.callback({
                    id: insert.insertId,
                    chat_id: room.chat_id,
                    user_id: room.user_id,
                    message: room.message,
                    created_time: new Date(),
                    user_data: (userData && userData.userData) || {},
                    type: "message"
                });
            }
            const lastRead = await this.getLastRead(room.chat_id);
            for (const dd of ((_b = web_socket_js_1.WebSocket.chatMemory[room.chat_id]) !== null && _b !== void 0 ? _b : [])) {
                dd.callback({
                    type: 'update_read_count',
                    data: lastRead
                });
            }
            for (const b of particpant) {
                if (b.user_id !== room.user_id) {
                    const post = new user_js_1.User(this.app, this.token);
                    const robot = (_d = ((_c = (await post.getConfig({
                        key: 'robot_auto_reply',
                        user_id: b.user_id
                    }))[0]) !== null && _c !== void 0 ? _c : {})['value']) !== null && _d !== void 0 ? _d : {};
                    if (robot.question) {
                        for (const d of robot.question) {
                            if (d.ask === room.message.text) {
                                const insert = await database_1.default.query(`
                                    insert into \`${this.app}\`.\`t_chat_detail\`
                                    set ?
                                `, [
                                    {
                                        chat_id: room.chat_id,
                                        user_id: b.user_id,
                                        message: JSON.stringify({
                                            text: d.response
                                        }),
                                        created_time: new Date()
                                    }
                                ]);
                                for (const dd of (_e = web_socket_js_1.WebSocket.chatMemory[room.chat_id]) !== null && _e !== void 0 ? _e : []) {
                                    const userData = (await database_1.default.query(`select userData
                                                                      from \`${this.app}\`.t_user
                                                                      where userID = ?`, [b.user_id]))[0];
                                    await this.updateLastRead(dd.user_id, room.chat_id);
                                    dd.callback({
                                        id: insert.insertId,
                                        chat_id: room.chat_id,
                                        user_id: b.user_id,
                                        message: {
                                            text: d.response
                                        },
                                        created_time: new Date(),
                                        user_data: (userData && userData.userData) || {},
                                        type: "message"
                                    });
                                }
                                const lastRead = await this.getLastRead(room.chat_id);
                                for (const dd of (_f = web_socket_js_1.WebSocket.chatMemory[room.chat_id]) !== null && _f !== void 0 ? _f : []) {
                                    dd.callback({
                                        type: 'update_read_count',
                                        data: lastRead
                                    });
                                }
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
            const userData = await database_1.default.query(`SELECT userData,userID
                                             FROM \`${this.app}\`.t_user
                                             where userID in (${(() => {
                const id = ['0'].concat(notifyUser);
                return id.join(',');
            })()});`, []);
            for (const dd of userData) {
                ((_g = web_socket_js_1.WebSocket.messageChangeMem[`${dd.userID}`]) !== null && _g !== void 0 ? _g : []).map((d2) => {
                    d2.callback({
                        type: 'update_message_count'
                    });
                });
                if (dd.userData.email) {
                    if (chatRoom.type === 'user') {
                        if (room.message.text) {
                            if (user) {
                                if (!web_socket_js_1.WebSocket.chatMemory[room.chat_id].find((d1) => {
                                    return `${d1.user_id}` === `${dd.userID}`;
                                })) {
                                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, dd.userData.email, `${user.userData.name}:傳送訊息給您`, this.templateWithCustomerMessage(`收到訊息`, `${user.userData.name}傳送訊息給您:`, room.message.text));
                                    console.log(`收到訊息->${user.userID}`);
                                    await new firebase_js_1.Firebase(this.app).sendMessage({
                                        title: `收到訊息`,
                                        userID: dd.userID,
                                        tag: 'message',
                                        link: `./?page=message&userID=${user.userID}`,
                                        body: `${user.userData.name}傳送訊息給您:${room.message.text}`
                                    });
                                }
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
                const managerUser = (await app_js_1.App.checkBrandAndMemberType(this.app));
                if (user) {
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, managerUser['userData'].email, `有一則客服訊息`, this.templateWithCustomerMessage('收到客服訊息', ` ${user.userData.name}傳送一則客服訊息:`, room.message.text));
                }
                else {
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, managerUser['userData'].email, "有一則匿名客服訊息", this.templateWithCustomerMessage('收到客服訊息', `收到一則匿名客服訊息:`, room.message.text));
                }
            }
        }
        catch (e) {
            console.log(e);
            throw exception_1.default.BadRequestError((_h = e.code) !== null && _h !== void 0 ? _h : 'BAD_REQUEST', 'AddMessage Error:' + e.message, null);
        }
    }
    async updateLastRead(userID, chat_id) {
        await database_1.default.query(`replace
        into  \`${this.app}\`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,?);`, [
            userID,
            chat_id,
            new Date()
        ]);
    }
    async getLastRead(chat_id) {
        return await database_1.default.query(`select *
                               from \`${this.app}\`.t_chat_last_read
                               where chat_id = ?;`, [
            chat_id
        ]);
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
        var _a, _b;
        try {
            let query = [
                `chat_id=${database_1.default.escape(qu.chat_id)}`
            ];
            qu.befor_id && query.push(`id<${qu.befor_id}`);
            qu.after_id && query.push(`id>${qu.after_id}`);
            await database_1.default.query(`replace
            into  \`${this.app}\`.t_chat_last_read (user_id,chat_id,last_read) values (?,?,?);`, [
                qu.user_id,
                qu.chat_id,
                new Date()
            ]);
            if (!qu.befor_id) {
                const lastRead = await this.getLastRead(qu.chat_id);
                for (const dd of (_a = web_socket_js_1.WebSocket.chatMemory[qu.chat_id]) !== null && _a !== void 0 ? _a : []) {
                    dd.callback({
                        type: 'update_read_count',
                        data: lastRead
                    });
                }
            }
            const res = await new ut_database_js_1.UtDatabase(this.app, `t_chat_detail`).querySql(query, qu);
            const userID = [];
            res.data.map((dd) => {
                if (userID.indexOf(dd.user_id) === -1) {
                    userID.push(dd.user_id);
                }
            });
            let userDataStorage = {};
            for (const b of userID) {
                userDataStorage[b] = (await database_1.default.query(`select userData
                                                      from \`${this.app}\`.t_user
                                                      where userID = ?`, [b]))[0];
                userDataStorage[b] = userDataStorage[b] && userDataStorage[b].userData;
            }
            res.data.map((dd) => {
                var _a;
                dd.user_data = (_a = userDataStorage[dd.user_id]) !== null && _a !== void 0 ? _a : {};
            });
            res.lastRead = await this.getLastRead(qu.chat_id);
            (web_socket_js_1.WebSocket.messageChangeMem[qu.user_id] || []).map((dd) => {
                dd.callback({
                    type: 'update_message_count'
                });
            });
            return res;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_b = e.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', 'GetMessage Error:' + e.message, null);
        }
    }
    async unReadMessage(user_id) {
        return await database_1.default.query(`SELECT \`${this.app}\`.t_chat_detail.* FROM \`${this.app}\`.t_chat_detail,\`${this.app}\`.t_chat_last_read where t_chat_detail.chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${database_1.default.escape(user_id)})
            and (t_chat_detail.chat_id != 'manager-preview') and t_chat_detail.user_id!=${database_1.default.escape(user_id)} and t_chat_detail.chat_id=t_chat_last_read.chat_id and t_chat_last_read.last_read < created_time order by id desc`, []);
    }
    async unReadMessageCount(user_id) {
        return await database_1.default.query(`SELECT \`${this.app}\`.t_chat_detail.* FROM \`${this.app}\`.t_chat_detail,\`${this.app}\`.t_chat_last_read where t_chat_detail.chat_id in (SELECT chat_id FROM \`${this.app}\`.t_chat_participants where user_id=${database_1.default.escape(user_id)})
            and (t_chat_detail.chat_id != 'manager-preview') and t_chat_detail.user_id!=${database_1.default.escape(user_id)} and t_chat_detail.chat_id=t_chat_last_read.chat_id and t_chat_last_read.last_read < created_time order by id desc`, []);
    }
    constructor(app, token) {
        this.app = app;
        this.token = token;
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