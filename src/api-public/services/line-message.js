"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineMessage = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const auto_send_email_js_1 = require("./auto-send-email.js");
const config_js_1 = __importDefault(require("../../config.js"));
const axios_1 = __importDefault(require("axios"));
const app_js_1 = require("../../services/app.js");
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const chat_js_1 = require("./chat.js");
const user_js_1 = require("./user.js");
const logger_js_1 = __importDefault(require("../../modules/logger.js"));
const AWSLib_js_1 = __importDefault(require("../../modules/AWSLib.js"));
const jimp_1 = require("jimp");
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const mime = require('mime');
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
    async getLineInf(obj, callback) {
        try {
            const post = new user_js_1.User(this.app, this.token);
            let tokenData = await post.getConfig({
                key: 'login_line_setting',
                user_id: 'manager',
            });
            let token = `Bearer ${tokenData[0].value.message_token}`;
            const urlConfig = {
                method: 'get',
                url: `https://api.line.me/v2/bot/profile/${obj.lineID}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {},
            };
            return new Promise((resolve, reject) => {
                axios_1.default
                    .request(urlConfig)
                    .then((response) => {
                    callback(response.data);
                    resolve(response.data);
                })
                    .catch((error) => {
                    console.log('error -- ', error.data);
                    resolve(false);
                });
            });
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }
    async sendLine(obj, callback) {
        obj.data.attachment = obj.data.attachment || '';
        try {
            obj.data.text = obj.data.text ? obj.data.text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '') : undefined;
            const post = new user_js_1.User(this.app, this.token);
            let tokenData = await post.getConfig({
                key: 'login_line_setting',
                user_id: 'manager',
            });
            let token = `${tokenData[0].value.message_token}`;
            if (obj.data.image) {
                const imageUrl = obj.data.image;
                const outputFilePath = 'image_cropped.jpeg';
                axios_1.default
                    .get(imageUrl, { responseType: 'arraybuffer' })
                    .then((response) => jimp_1.Jimp.read(Buffer.from(response.data)))
                    .then(async (image) => {
                    const small = await image.clone().scaleToFit({ w: 240, h: 240 }).getBuffer('image/jpeg');
                    const large = await image.clone().scaleToFit({ w: 1024, h: 1024 }).getBuffer('image/jpeg');
                    return [small, large];
                })
                    .then((base64) => {
                    this.uploadFile(`line/${new Date().getTime()}.jpeg`, base64[0]).then((smallUrl) => {
                        this.uploadFile(`line/${new Date().getTime()}.jpeg`, base64[1]).then((largeUrl) => {
                            const message = {
                                to: obj.lineID,
                                messages: [
                                    {
                                        type: 'image',
                                        originalContentUrl: largeUrl,
                                        previewImageUrl: smallUrl,
                                    },
                                ],
                            };
                            return new Promise((resolve, reject) => {
                                axios_1.default
                                    .post('https://api.line.me/v2/bot/message/push', message, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                    .then((response) => {
                                    console.log('圖片消息已成功發送:', response.data);
                                    callback(response);
                                    resolve(response.data);
                                })
                                    .catch((error) => {
                                    console.error('發送圖片消息時發生錯誤:', error.response ? error.response.data : error.message);
                                });
                            });
                        });
                    });
                })
                    .catch((err) => {
                    console.error('處理圖片時發生錯誤:', err);
                });
            }
            else {
                let postData = {
                    to: obj.lineID,
                    messages: [
                        {
                            type: 'text',
                            text: obj.data.text,
                        },
                    ],
                };
                const urlConfig = {
                    method: 'post',
                    url: 'https://api.line.me/v2/bot/message/push',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    data: JSON.stringify(postData),
                };
                return new Promise((resolve, reject) => {
                    axios_1.default
                        .request(urlConfig)
                        .then((response) => {
                        callback(response);
                        resolve(response.data);
                    })
                        .catch((error) => {
                        console.log(error);
                        console.log('error -- ', error.data);
                        resolve(false);
                    });
                });
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }
    async deleteSNS(obj, callback) {
        try {
            const urlConfig = {
                method: 'post',
                url: config_js_1.default.SNS_URL + `/api/mtk/SmCancel?username=${config_js_1.default.SNSAccount}&password=${config_js_1.default.SNSPWD}&msgid=${obj.id}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: [],
            };
            return new Promise((resolve, reject) => {
                axios_1.default
                    .request(urlConfig)
                    .then((response) => {
                    callback(response.data);
                    resolve(response.data);
                })
                    .catch((error) => {
                    console.log('error -- ', error);
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
        data.msgid = '';
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
                this.chunkSendLine(data.userList, {
                    text: data.content
                }, insertData.insertId);
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
    async listenMessage(data) {
        var _a, _b;
        try {
            let message = data.events[0].message;
            let userID = 'line_' + data.events[0].source.userId;
            let chatData = {
                chat_id: [userID, 'manager'].sort().join(''),
                type: 'user',
                info: {},
                user_id: userID,
                participant: [userID, 'manager'],
            };
            const post = new user_js_1.User(this.app, this.token);
            let tokenData = await post.getConfig({
                key: 'login_line_setting',
                user_id: 'manager',
            });
            let token = `${tokenData[0].value.message_token}`;
            if (data.events[0].source.type == 'group') {
                if ((_b = (_a = data.events[0]) === null || _a === void 0 ? void 0 : _a.postback) === null || _b === void 0 ? void 0 : _b.data) {
                    console.log("data.events[0] -- ", JSON.stringify(data.events[0]));
                    const replyToken = data.events[0].replyToken;
                    await this.createOrderWithLineFlexMessage(data.events[0], "您已經購買了商品");
                    return { result: true, message: 'accept message' };
                }
                if (message.text == "product + 1") {
                }
                if (message.text == "test") {
                    const replyToken = data.events[0].replyToken;
                    const multiPageMessage = {
                        type: 'flex',
                        altText: '這是多頁圖文訊息',
                        contents: {
                            type: 'carousel',
                            contents: [
                                {
                                    type: 'bubble',
                                    hero: {
                                        type: 'image',
                                        url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.18.59-AnelegantElizabethsolidwoodwardrobewithaclassic,timelessdesign.Thewardrobefeatureshigh-qualitywoodconstructionwithapolishedfinis.webp',
                                        size: 'full',
                                        aspectRatio: '20:13',
                                        aspectMode: 'cover',
                                    },
                                    body: {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            {
                                                type: 'text',
                                                text: '伊麗莎白 實木衣櫃',
                                                weight: 'bold',
                                                size: 'xl',
                                            },
                                            {
                                                type: 'text',
                                                text: '伊麗莎白 實木衣櫃完美結合了實用與美觀，適合多種室內風格，提供黑色、白色及胡桃木色供您選擇。',
                                                size: 'sm',
                                                wrap: true,
                                            },
                                            {
                                                type: "text",
                                                text: "NT 3500",
                                                size: "sm",
                                                color: "#111111",
                                                align: "end"
                                            }
                                        ],
                                    },
                                    footer: {
                                        type: 'box',
                                        layout: 'vertical',
                                        spacing: 'sm',
                                        contents: [
                                            {
                                                type: 'button',
                                                style: 'primary',
                                                action: {
                                                    type: 'postback',
                                                    label: '我要購買商品一',
                                                    data: JSON.stringify({
                                                        "id": 709,
                                                        "spec": [
                                                            "深棕",
                                                            "100cm"
                                                        ],
                                                        "title": "伊麗莎白 實木衣櫃"
                                                    }),
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    type: 'bubble',
                                    hero: {
                                        type: 'image',
                                        url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                                        size: 'full',
                                        aspectRatio: '20:13',
                                        aspectMode: 'cover',
                                    },
                                    body: {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            {
                                                type: 'text',
                                                text: '溫德米爾 茶几"',
                                                weight: 'bold',
                                                size: 'xl',
                                            },
                                            {
                                                type: 'text',
                                                text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                                                size: 'sm',
                                                wrap: true,
                                            },
                                            {
                                                type: "text",
                                                text: "NT 5200",
                                                size: "sm",
                                                color: "#111111",
                                                align: "end"
                                            }
                                        ],
                                    },
                                    footer: {
                                        type: 'box',
                                        layout: 'vertical',
                                        spacing: 'sm',
                                        contents: [
                                            {
                                                type: 'button',
                                                style: 'primary',
                                                action: {
                                                    type: 'postback',
                                                    label: '我要購買商品二',
                                                    data: JSON.stringify({
                                                        "id": 710,
                                                        "sku": "",
                                                        "count": 1,
                                                        "spec": [
                                                            "黑色",
                                                            "小號"
                                                        ],
                                                        "title": "溫德米爾 茶几",
                                                        "sale_price": 5200,
                                                    }),
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    type: 'bubble',
                                    hero: {
                                        type: 'image',
                                        url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                                        size: 'full',
                                        aspectRatio: '20:13',
                                        aspectMode: 'cover',
                                    },
                                    body: {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            {
                                                type: 'text',
                                                text: '溫德米爾 茶几2"',
                                                weight: 'bold',
                                                size: 'xl',
                                            },
                                            {
                                                type: 'text',
                                                text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                                                size: 'sm',
                                                wrap: true,
                                            },
                                            {
                                                type: "text",
                                                text: "NT 5200",
                                                size: "sm",
                                                color: "#111111",
                                                align: "end"
                                            }
                                        ],
                                    },
                                    footer: {
                                        type: 'box',
                                        layout: 'vertical',
                                        spacing: 'sm',
                                        contents: [
                                            {
                                                type: 'button',
                                                style: 'primary',
                                                action: {
                                                    type: 'postback',
                                                    label: '我要購買商品二',
                                                    data: JSON.stringify({
                                                        "id": 710,
                                                        "sku": "",
                                                        "count": 1,
                                                        "spec": [
                                                            "黑色",
                                                            "小號"
                                                        ],
                                                        "title": "溫德米爾 茶几",
                                                        "sale_price": 5200,
                                                    }),
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    type: 'bubble',
                                    hero: {
                                        type: 'image',
                                        url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp',
                                        size: 'full',
                                        aspectRatio: '20:13',
                                        aspectMode: 'cover',
                                    },
                                    body: {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                            {
                                                type: 'text',
                                                text: '溫德米爾 茶几"',
                                                weight: 'bold',
                                                size: 'xl',
                                            },
                                            {
                                                type: 'text',
                                                text: '選擇溫德米爾茶几，讓您的居家生活更具格調。擁有多種顏色和尺寸，適合各種家庭裝飾需求。',
                                                size: 'sm',
                                                wrap: true,
                                            },
                                            {
                                                type: "text",
                                                text: "NT 5200",
                                                size: "sm",
                                                color: "#111111",
                                                align: "end"
                                            }
                                        ],
                                    },
                                    footer: {
                                        type: 'box',
                                        layout: 'vertical',
                                        spacing: 'sm',
                                        contents: [
                                            {
                                                type: 'button',
                                                style: 'primary',
                                                action: {
                                                    type: 'postback',
                                                    label: '我要購買商品二',
                                                    data: JSON.stringify({
                                                        "id": 710,
                                                        "sku": "",
                                                        "count": 1,
                                                        "spec": [
                                                            "黑色",
                                                            "小號"
                                                        ],
                                                        "title": "溫德米爾 茶几",
                                                        "sale_price": 5200,
                                                    }),
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    };
                    try {
                        await axios_1.default.post('https://api.line.me/v2/bot/message/reply', {
                            replyToken: replyToken,
                            messages: [
                                multiPageMessage
                            ]
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        });
                    }
                    catch (e) {
                        console.log("e -- ", e.response.data);
                    }
                }
                return { result: true, message: 'accept message' };
            }
            await this.getLineInf({ lineID: data.events[0].source.userId }, (data) => {
                chatData.info = {
                    line: {
                        name: data.displayName,
                        head: data.pictureUrl,
                    },
                };
                chatData.info = JSON.stringify(chatData.info);
            });
            let result = await new chat_js_1.Chat(this.app).addChatRoom(chatData);
            if (!result.create) {
                await database_js_1.default.query(`
                        UPDATE \`${this.app}\`.\`t_chat_list\`
                        SET ?
                        WHERE ?
                    `, [
                    {
                        info: chatData.info,
                    },
                    {
                        chat_id: chatData.chat_id,
                    },
                ]);
            }
            if (message.type == 'image') {
                const post = new user_js_1.User(this.app, this.token);
                let tokenData = await post.getConfig({
                    key: 'login_line_setting',
                    user_id: 'manager',
                });
                let token = `${tokenData[0].value.message_token}`;
                let imageUrl = await this.getImageContent(message.id, token);
                chatData.message = {
                    image: imageUrl,
                };
            }
            else {
                chatData.message = {
                    text: message.text,
                };
            }
            await new chat_js_1.Chat(this.app).addMessage(chatData);
            return { result: true, message: 'accept message' };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Error:' + e, null);
        }
    }
    async createOrderWithLineFlexMessage(messageData, message) {
        console.log("message -- ", messageData);
        function areSpecsEqual(spec1, spec2) {
            if (spec1.length !== spec2.length) {
                return false;
            }
            const sortedSpec1 = [...spec1].sort();
            const sortedSpec2 = [...spec2].sort();
            return sortedSpec1.every((value, index) => value === sortedSpec2[index]);
        }
        const replyToken = messageData.replyToken;
        const post = new user_js_1.User(this.app, this.token);
        const groupId = messageData.source.groupId;
        const userId = messageData.source.userId || '未知使用者';
        const dataKey = groupId + "-" + userId;
        const cart = await redis_js_1.default.getValue(dataKey);
        const newData = JSON.parse(messageData.postback.data);
        let productData = [];
        let lineItems;
        let tokenData = await post.getConfig({
            key: 'login_line_setting',
            user_id: 'manager',
        });
        if (cart) {
            if (typeof cart === "string") {
                productData = JSON.parse(cart);
            }
        }
        productData.forEach((data) => {
            var _a;
            console.log(data.id, newData.id);
            console.log(data.spec, newData.spec);
            if (data.id == newData.id && areSpecsEqual(data.spec, newData.spec)) {
                data.count = (_a = data.count) !== null && _a !== void 0 ? _a : 1;
                data.count++;
            }
        });
        productData.push(JSON.parse(messageData.postback.data));
        console.log("productData -- ", productData);
        await redis_js_1.default.setValue(dataKey, JSON.stringify(productData));
        let token = `${tokenData[0].value.message_token}`;
    }
    async sendCustomerLine(tag, order_id, lineID) {
        const customerMail = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, tag);
        if (customerMail.toggle) {
            await new Promise(async (resolve) => {
                resolve(await this.sendLine({
                    data: {
                        text: customerMail.content.replace(/@\{\{訂單號碼\}\}/g, order_id)
                    },
                    lineID: lineID
                }, (res) => {
                }));
            });
        }
    }
    async sendMessage(token, userId, message) {
        var _a;
        const url = 'https://api.line.me/v2/bot/message/push';
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const body = {
            to: userId,
            messages: [
                {
                    type: 'text',
                    text: message,
                },
            ],
        };
        try {
            const response = await axios_1.default.post(url, body, { headers });
            console.log('訊息發送成功:', response.data);
        }
        catch (error) {
            console.error('發送訊息時出錯:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    }
    async getImageContent(messageId, accessToken) {
        try {
            const response = await axios_1.default.get(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: 'arraybuffer',
            });
            console.log('response.data -- ', response.data);
            return await this.uploadFile(`line/${messageId}/${new Date().getTime()}.png`, response.data);
        }
        catch (error) {
            console.error('Failed to get image content:', error);
            throw error;
        }
    }
    async uploadFile(file_name, fileData) {
        const TAG = `[AWS-S3][Upload]`;
        const logger = new logger_js_1.default();
        const s3bucketName = config_js_1.default.AWS_S3_NAME;
        const s3path = file_name;
        const fullUrl = config_js_1.default.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            ContentType: (() => {
                if (config_js_1.default.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`;
                }
                else {
                    return mime.getType(fullUrl.split('.').pop());
                }
            })(),
        };
        return new Promise((resolve, reject) => {
            AWSLib_js_1.default.getSignedUrl('putObject', params, async (err, url) => {
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
                            'Content-Type': params.ContentType,
                        },
                    })
                        .then(() => {
                        console.log(fullUrl);
                        resolve(fullUrl);
                    })
                        .catch(() => {
                        console.log(`convertError:${fullUrl}`);
                    });
                }
            });
        });
    }
    async checkPoints(message, user_count) {
        const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(this.app);
        const sum = (await database_js_1.default.query(`SELECT sum(money)
                     FROM \`${brandAndMemberType.brand}\`.t_sms_points
                     WHERE status in (1, 2)
                       and userID = ?`, [brandAndMemberType.user_id]))[0]['sum(money)'] || 0;
        return sum > this.getUsePoints(message, user_count);
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
                    phone: obj.phone,
                }),
            },
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