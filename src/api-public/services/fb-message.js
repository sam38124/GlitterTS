"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FbMessage = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const auto_send_email_js_1 = require("./auto-send-email.js");
const config_1 = __importDefault(require("../../config"));
const axios_1 = __importDefault(require("axios"));
const chat_1 = require("./chat");
const user_1 = require("./user");
const logger_1 = __importDefault(require("../../modules/logger"));
const AWSLib_1 = __importDefault(require("../../modules/AWSLib"));
const mime = require('mime');
class FbMessage {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async chunkSendMessage(userList, content, id, date) {
        try {
            let check = userList.length;
            await new Promise((resolve) => {
                for (const d of userList) {
                    this.sendMessage({ data: content, fbID: d.lineID }, (res) => {
                        check--;
                        if (check === 0) {
                            database_js_1.default.query(`UPDATE \`${this.app}\`.t_triggers
                                      SET status = ${date ? 0 : 1},
                                          content = JSON_SET(content, '$.name', '${res.msgid}')
                                      WHERE id = ?;`, [id]);
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
    async sendMessage(obj, callback) {
        try {
            const payload = {
                recipient: { id: obj.fbID },
                message: {},
                tag: "POST_PURCHASE_UPDATE"
            };
            if (obj.data.image) {
                payload.message = {
                    attachment: {
                        type: 'image',
                        payload: {
                            url: obj.data.image,
                            is_reusable: true
                        }
                    }
                };
            }
            else {
                payload.message = {
                    text: obj.data.text
                };
            }
            if (obj.data.tag) {
                payload.tag = obj.data.tag;
            }
            const post = new user_1.User(this.app, this.token);
            let tokenData = await post.getConfig({
                key: "login_fb_setting",
                user_id: "manager",
            });
            let token = `${tokenData[0].value.fans_token}`;
            const urlConfig = {
                method: 'post',
                url: "https://graph.facebook.com/v12.0/me/messages",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                data: JSON.stringify(payload)
            };
            return new Promise((resolve, reject) => {
                axios_1.default.request(urlConfig)
                    .then((response) => {
                    callback(response);
                    resolve(response.data);
                })
                    .catch((error) => {
                    console.log("error -- ", error.response.data.error);
                    resolve(false);
                });
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }
    async sendUserInf(fbID, callback) {
        try {
            let token = "Bearer EAAjqQPeQMmUBO0Xwr3p0BVWtkhm5RlWDZC9GleHtSaUZCAbjxsw3plF5lkn8XEpurozNeamiqSOUgnDeZCFVf2fnnMXSluos0gnnLK3pMTi7JYP44KulLIocGwxvlxFGVOW2dZB1xWS2oWerE2cc13ANqjcaGumZBl6PSVUKOOZByjVu31oD42zOB3DHbXbLoKZAGhZAFRxZCmDEy6ZC1dyQZDZD";
            const urlConfig = {
                method: 'post',
                url: `https://graph.facebook.com/v12.0/${fbID}?fields=first_name,last_name,profile_pic`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                data: JSON.stringify({})
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
            const emails = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL}
                 ORDER BY id DESC
                     ${query.type === 'download' ? '' : `LIMIT ${query.page * query.limit}, ${query.limit}`};`, []);
            const total = await database_js_1.default.query(`SELECT count(id) as c
                 FROM \`${this.app}\`.t_triggers
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
                const insertData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\`
                                                   SET ?;`, [
                    {
                        tag: 'sendLineBySchedule',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(data.sendTime),
                        status: 0,
                    },
                ]);
            }
            else {
                const insertData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\`
                                                   SET ?;`, [
                    {
                        tag: 'sendLine',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(),
                        status: 0,
                    },
                ]);
                this.chunkSendMessage(data.userList, data.content, insertData.insertId);
            }
            return { result: true, message: '寄送成功' };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
    async deleteSns(data) {
        try {
            const emails = await database_js_1.default.query(`SELECT *
                 FROM \`${this.app}\`.t_triggers
                 WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`, []);
            await new Promise((resolve) => {
                this.deleteSNS({ id: data.id }, (res) => {
                    resolve(true);
                });
            });
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_triggers
                            SET status = 2
                            WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`, []);
            return { result: true, message: '取消預約成功' };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
    async listenMessage(body) {
        async function downloadImageFromFacebook(imageUrl) {
            try {
                const response = await axios_1.default.get(imageUrl, {
                    headers: {},
                    responseType: 'arraybuffer',
                });
                return Buffer.from(response.data);
            }
            catch (error) {
                console.error('下載圖片時出錯:', error);
                throw error;
            }
        }
        function getFileExtension(url) {
            const matches = url.match(/\.(jpg|jpeg|png|gif|bmp|webp)(?=[\?&]|$)/i);
            return matches ? matches[1].toLowerCase() : null;
        }
        let that = this;
        const post = new user_1.User(this.app, this.token);
        let tokenData = await post.getConfig({
            key: "login_fb_setting",
            user_id: "manager",
        });
        try {
            if (body.object === 'page') {
                for (const entry of body.entry) {
                    const messagingEvents = entry.messaging;
                    for (const event of messagingEvents) {
                        if (event.message) {
                            if (((`${event.sender.id}`) == tokenData[0].value.fans_id)) {
                                const recipient = "fb_" + event.recipient.id;
                                let chatData = {
                                    chat_id: [recipient, "manager"].sort().join('-'),
                                    type: "user",
                                    user_id: recipient,
                                    info: {},
                                    participant: [recipient, "manager"]
                                };
                                await this.getFBInf({ fbID: event.recipient.id }, (data) => {
                                    chatData.info = {
                                        fb: {
                                            name: data.last_name + data.first_name,
                                            head: data.profile_pic,
                                            update: new Date().getTime(),
                                        }
                                    };
                                });
                                chatData.info = JSON.stringify(chatData.info);
                                let DBdata = await database_js_1.default.query(`
                                        SELECT *
                                        FROM \`${this.app}\`.\`t_chat_list\`
                                        WHERE chat_id = ?
                                    `, [
                                    chatData.chat_id
                                ]);
                                DBdata = DBdata[0];
                                const now = new Date();
                                if (!DBdata.info.fb.update || new Date().getTime() - DBdata.info.fb.update > (1000 * 60 * 60 * 24)) {
                                    await this.getFBInf({ fbID: event.recipient.id }, (data) => {
                                        chatData.info = {
                                            fb: {
                                                name: data.last_name + data.first_name,
                                                head: data.profile_pic,
                                                update: new Date().getTime()
                                            }
                                        };
                                    });
                                    DBdata.info.fb.update = new Date().getTime();
                                    chatData.info = JSON.stringify(chatData.info);
                                    await database_js_1.default.query(`
                                            UPDATE \`${this.app}\`.\`t_chat_list\`
                                            SET ?
                                            WHERE chat_id = ?
                                        `, [
                                        {
                                            info: chatData.info,
                                        },
                                        chatData.chat_id
                                    ]);
                                }
                            }
                            else {
                                const senderId = "fb_" + event.sender.id;
                                let chatData = {
                                    chat_id: [senderId, "manager"].sort().join('-'),
                                    type: "user",
                                    user_id: senderId,
                                    info: {},
                                    participant: [senderId, "manager"]
                                };
                                await this.getFBInf({ fbID: event.sender.id }, (data) => {
                                    chatData.info = {
                                        fb: {
                                            name: data.last_name + data.first_name,
                                            head: data.profile_pic
                                        }
                                    };
                                });
                                chatData.info = JSON.stringify(chatData.info);
                                const result = await new chat_1.Chat(this.app).addChatRoom(chatData);
                                if (!result.create) {
                                    await database_js_1.default.query(`
                                            UPDATE \`${this.app}\`.\`t_chat_list\`
                                            SET ?
                                            WHERE chat_id = ?
                                        `, [
                                        {
                                            info: chatData.info,
                                        },
                                        chatData.chat_id
                                    ]);
                                }
                                if (event.message.text) {
                                    const messageText = event.message.text;
                                    chatData.message = {
                                        "text": messageText
                                    };
                                    await new chat_1.Chat(this.app).addMessage(chatData);
                                }
                                if (event.message.attachments) {
                                    const attachments = event.message.attachments;
                                    attachments.forEach((attachment) => {
                                        if (attachment.type === 'image' && attachment.payload) {
                                            let imageUrl = attachment.payload.url;
                                            downloadImageFromFacebook(imageUrl)
                                                .then((buffer) => {
                                                const fileExtension = getFileExtension(imageUrl);
                                                this.uploadFile(`line/${new Date().getTime()}.${fileExtension}`, buffer)
                                                    .then(async (data) => {
                                                    const senderId = "fb_" + event.sender.id;
                                                    chatData.message = {
                                                        "image": data
                                                    };
                                                    await new chat_1.Chat(this.app).addMessage(chatData);
                                                });
                                            })
                                                .catch((error) => {
                                                console.error('下載失敗:', error);
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
            else {
                return { result: true, message: 'body error' };
            }
            return { result: true, message: 'accept message' };
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Error:' + e, null);
        }
    }
    async sendCustomerFB(tag, order_id, fb_id) {
        const customerMail = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, tag);
        customerMail.tag = "POST_PURCHASE_UPDATE";
        if (customerMail.toggle) {
            await new Promise(async (resolve) => {
                resolve(await this.sendMessage({
                    data: {
                        text: "出貨訊息",
                        attachment: [],
                        tag: 'POST_PURCHASE_UPDATE'
                    },
                    fbID: fb_id,
                }, (res) => {
                }));
            });
        }
    }
    async uploadFile(file_name, fileData) {
        const TAG = `[AWS-S3][Upload]`;
        const logger = new logger_1.default();
        const s3bucketName = config_1.default.AWS_S3_NAME;
        const s3path = file_name;
        const fullUrl = config_1.default.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            ContentType: (() => {
                if (config_1.default.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`;
                }
                else {
                    return mime.getType(fullUrl.split('.').pop());
                }
            })()
        };
        return new Promise((resolve, reject) => {
            AWSLib_1.default.getSignedUrl('putObject', params, async (err, url) => {
                if (err) {
                    logger.error(TAG, String(err));
                    console.log(err, err.stack);
                    reject(false);
                }
                else {
                    (0, axios_1.default)({
                        method: 'PUT',
                        url: url,
                        data: fileData,
                        headers: {
                            "Content-Type": params.ContentType
                        }
                    }).then(() => {
                        console.log(fullUrl);
                        resolve(fullUrl);
                    }).catch(() => {
                        console.log(`convertError:${fullUrl}`);
                    });
                }
            });
        });
    }
    async getFBInf(obj, callback) {
        try {
            const post = new user_1.User(this.app, this.token);
            let tokenData = await post.getConfig({
                key: "login_fb_setting",
                user_id: "manager",
            });
            let token = `Bearer ${tokenData[0].value.fans_token}`;
            const urlConfig = {
                method: 'get',
                url: `https://graph.facebook.com/v16.0/${obj.fbID}?fields=first_name,last_name,profile_pic`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                data: {}
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
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }
}
exports.FbMessage = FbMessage;
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
//# sourceMappingURL=fb-message.js.map