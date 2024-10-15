"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineMessage = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const auto_send_email_js_1 = require("./auto-send-email.js");
const config_1 = __importDefault(require("../../config"));
const axios_1 = __importDefault(require("axios"));
const app_js_1 = require("../../services/app.js");
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const chat_1 = require("./chat");
const user_1 = require("./user");
class LineMessage {
    constructor(app, token) {
        this.app = app;
        this.token = token !== null && token !== void 0 ? token : undefined;
    }
    async chunkSendLine(userList, content, id, date) {
        try {
            let check = userList.length;
            await new Promise((resolve) => {
                for (const d of userList) {
                    this.sendLine({ data: content, lineID: d.lineID }, (res) => {
                        check--;
                        if (check === 0) {
                            database_js_1.default.query(`UPDATE \`${this.app}\`.t_triggers SET status = ${date ? 0 : 1} , content = JSON_SET(content, '$.name', '${res.msgid}') WHERE id = ?;`, [id]);
                            resolve(true);
                        }
                    });
                }
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e, null);
        }
    }
    async sendLine(obj, callback) {
        try {
            const post = new user_1.User(this.app, this.token);
            let postData = {
                "to": obj.lineID,
                "messages": [
                    {
                        "type": "text",
                        "text": obj.data
                    }
                ]
            };
            let token = "Bearer XBcCOSLLaQuVIQ8O6BR/KV8MSqHlOs5lqdu/fWkJGwRuEUItbWtfkt920OX49wtNzD9GP1dl0LqgqnT2GmGRinnk3Z7stN84gCSrDTnUAtgxfmd8Lsd/QfwfdIGwTg4cTicgQ88DVEJDZK5FKi6rZwdB04t89/1O/w1cDnyilFU=";
            const urlConfig = {
                method: 'post',
                url: "https://api.line.me/v2/bot/message/push",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                data: JSON.stringify(postData)
            };
            return new Promise((resolve, reject) => {
                axios_1.default.request(urlConfig)
                    .then((response) => {
                    callback(response);
                    resolve(response.data);
                })
                    .catch((error) => {
                    console.log("error -- ", error.data);
                    resolve(false);
                });
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }
    async deleteSNS(obj, callback) {
        try {
            const urlConfig = {
                method: 'post',
                url: config_1.default.SNS_URL + `/api/mtk/SmCancel?username=${config_1.default.SNSAccount}&password=${config_1.default.SNSPWD}&msgid=${obj.id}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: []
            };
            return new Promise((resolve, reject) => {
                axios_1.default.request(urlConfig)
                    .then((response) => {
                    callback(response.data);
                    resolve(response.data);
                })
                    .catch((error) => {
                    console.log("error -- ", error);
                    resolve(false);
                });
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send SNS Error:' + e, null);
        }
    }
    parseResponse(response) {
        const regex = /\[([0-9]+)\]\r\nmsgid=([^\r\n]+)\r\nstatuscode=([0-9]+)\r\nAccountPoint=([0-9]+)\r\n/;
        const match = response.match(regex);
    }
    async getLine(query) {
        var _a, _b, _c;
        try {
            const whereList = ['1 = 1'];
            switch (query.searchType) {
                case 'phone':
                    whereList.push(`(JSON_SEARCH(content->'$.phone', 'one', '%${(_a = query.search) !== null && _a !== void 0 ? _a : ''}%', NULL, '$[*]') IS NOT NULL)`);
                    break;
                case 'name':
                    whereList.push(`(UPPER(JSON_EXTRACT(content, '$.name')) LIKE UPPER('%${(_b = query.search) !== null && _b !== void 0 ? _b : ''}%'))`);
                    break;
                case 'title':
                    whereList.push(`(UPPER(JSON_EXTRACT(content, '$.title')) LIKE UPPER('%${(_c = query.search) !== null && _c !== void 0 ? _c : ''}%'))`);
                    break;
            }
            if (query.status) {
                whereList.push(`(status in (${query.status}))`);
            }
            if (query.mailType) {
                const maiTypeString = query.mailType.replace(/[^,]+/g, "'$&'");
                whereList.push(`(JSON_EXTRACT(content, '$.type') in (${maiTypeString}))`);
            }
            const whereSQL = `(tag = 'sendLine' OR tag = 'sendLineBySchedule') AND ${whereList.join(' AND ')}`;
            const emails = await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL}
                 ORDER BY id DESC
                 ${query.type === 'download' ? '' : `LIMIT ${query.page * query.limit}, ${query.limit}`};`, []);
            const total = await database_js_1.default.query(`SELECT count(id) as c FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL};`, []);
            let n = 0;
            await new Promise((resolve) => {
                for (const email of emails) {
                    auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, email.content.type).then((dd) => {
                        email.content.typeName = dd && dd.tag_name ? dd.tag_name : '手動發送';
                        n++;
                    });
                }
                const si = setInterval(() => {
                    if (n === emails.length) {
                        resolve();
                        clearInterval(si);
                    }
                }, 300);
            });
            return { data: emails, total: total[0].c };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
        }
    }
    async postLine(data) {
        data.msgid = "";
        try {
            if (Boolean(data.sendTime)) {
                if (isLater(data.sendTime)) {
                    return { result: false, message: '排定發送的時間需大於現在時間' };
                }
                const insertData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
                    {
                        tag: 'sendLineBySchedule',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(data.sendTime),
                        status: 0,
                    },
                ]);
            }
            else {
                const insertData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
                    {
                        tag: 'sendLine',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(),
                        status: 0,
                    },
                ]);
                this.chunkSendLine(data.userList, data.content, insertData.insertId);
            }
            return { result: true, message: '寄送成功' };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
    async deleteSns(data) {
        try {
            const emails = await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.t_triggers
                 WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`, []);
            await new Promise((resolve) => {
                this.deleteSNS({ id: data.id }, (res) => {
                    resolve(true);
                });
            });
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_triggers SET status = 2 WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`, []);
            return { result: true, message: '取消預約成功' };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
    async listenMessage(data) {
        try {
            let message = data.events[0].message;
            let userID = "line_" + data.events[0].source.userId;
            let chatData = {
                chat_id: [userID, "manager"].sort().join(''),
                type: "user",
                user_id: userID,
                participant: [userID, "manager"]
            };
            await new chat_1.Chat(this.app).addChatRoom(chatData);
            chatData.message = {
                "text": message.text
            };
            await new chat_1.Chat(this.app).addMessage(chatData);
            return { result: true, message: 'accept message' };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Error:' + e, null);
        }
    }
    async sendCustomerLine(tag, order_id, lineID) {
        const customerMail = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, tag);
        if (customerMail.toggle) {
            await new Promise(async (resolve) => {
                resolve(await this.sendLine({ data: customerMail.content.replace(/@\{\{訂單號碼\}\}/g, order_id), lineID: lineID }, (res) => {
                }));
            });
        }
    }
    async checkPoints(message, user_count) {
        const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(this.app);
        const sum = (await database_js_1.default.query(`SELECT sum(money)
                     FROM \`${brandAndMemberType.brand}\`.t_sms_points
                     WHERE status in (1, 2)
                       and userID = ?`, [brandAndMemberType.user_id]))[0]['sum(money)'] || 0;
        return sum > (this.getUsePoints(message, user_count));
    }
    async usePoints(obj) {
        if (!obj.phone) {
            return 0;
        }
        let total = this.getUsePoints(obj.message, obj.user_count);
        const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(this.app);
        await database_js_1.default.query(`insert into \`${brandAndMemberType.brand}\`.t_sms_points
                        set ?`, [
            {
                orderID: obj.order_id || tool_js_1.default.randomNumber(8),
                money: total * -1,
                userID: brandAndMemberType.user_id,
                status: 1,
                note: JSON.stringify({
                    message: obj.message,
                    phone: obj.phone
                })
            }
        ]);
        return total * -1;
    }
    getUsePoints(text, user_count) {
        let pointCount = 0;
        const maxSize = 160;
        const longSMS = 153;
        let totalSize = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (/[\u4e00-\u9fa5\uFF00-\uFFEF]/.test(char)) {
                totalSize += 2;
            }
            else {
                totalSize += 1;
            }
        }
        if (totalSize < maxSize) {
            pointCount = 1;
        }
        else {
            pointCount = Math.ceil(totalSize / longSMS);
        }
        return pointCount * 15 * user_count;
    }
}
exports.LineMessage = LineMessage;
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
function formatDateTime(sendTime) {
    const dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
    const dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
    return formatDate(dateObject);
}
function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
function isLater(dateTimeObj) {
    const currentDateTime = new Date();
    const { date, time } = dateTimeObj;
    const dateTimeString = `${date}T${time}:00`;
    const providedDateTime = new Date(dateTimeString);
    return currentDateTime > providedDateTime;
}
//# sourceMappingURL=line-message.js.map