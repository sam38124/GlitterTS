import {IToken} from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import {sendmail} from '../../services/ses.js';
import {AutoSendEmail} from './auto-send-email.js';
import config from "../../config";
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {Mail} from "./mail";
import {App} from "../../services/app.js";
import Tool from "../../modules/tool.js";
import {Chat} from "./chat";
import {User} from "./user";
import Logger from "../../modules/logger";
import s3bucket from "../../modules/AWSLib";

const mime = require('mime');
interface FbResponse {
    // 定義 response 物件的結構，根據實際 API 回應的格式進行調整
    clientid?: string,
    msgid?: string,
    statuscode: number,
    accountPoint?: number,
    Duplicate?: string,
    smsPoint?: number,
    message?: string;
}

export interface ChatRoom {
    chat_id: string;
    type: 'user' | 'group';
    info: any;
    participant: string[];
}

interface Config {
    method: 'post' | 'get';
    url: string;
    headers: Record<string, string>;
    data: any;
}

interface FbData {
    username: string,
    password: string,
    dstaddr: string
    smbody: string
    smsPointFlag: number
}

export class FbMessage {
    public app;
    public token ?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async chunkSendMessage(userList: any, content: any, id: number, date?: string) {
        try {
            // let msgid = ""

            let check = userList.length;
            await new Promise((resolve) => {
                for (const d of userList) {
                    this.sendMessage({data: content, fbID: d.lineID}, (res) => {
                        check--;
                        if (check === 0) {
                            db.query(`UPDATE \`${this.app}\`.t_triggers
                                      SET status = ${date ? 0 : 1},
                                          content = JSON_SET(content, '$.name', '${res.msgid}')
                                      WHERE id = ?;`, [id]);
                            resolve(true);
                        }
                    })
                }
            });

        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e, null);
        }
    }

    async sendMessage(obj: {
        data: {
            text?: string;
            image?: string;
            attachment: any;
        }, fbID: string
    }, callback: (data: any) => void) {
        try {
            const payload = {
                recipient: {id: obj.fbID},
                message: {}
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
                }

            } else {
                payload.message = {
                    text: obj.data.text
                }
            }
            const post = new User(this.app, this.token);


            let tokenData = await post.getConfig({
                key: "login_fb_setting",
                user_id: "manager",
            })

            let token = `${tokenData[0].value.fans_token}`;
            const urlConfig: Config = {
                method: 'post',
                url: "https://graph.facebook.com/v12.0/me/messages",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                data: JSON.stringify(payload)
            };
            return new Promise<boolean>((resolve, reject) => {
                axios.request(urlConfig)
                    .then((response) => {
                        // let result = response.data.split('\r\n')
                        callback(response)
                        resolve(response.data)
                    })
                    .catch((error) => {
                        console.log("error -- ", error.response.data.error)
                        resolve(false)
                    });
            })

        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }

    async sendUserInf(fbID: string, callback: (data: any) => void) {
        try {

            let token = "Bearer EAAjqQPeQMmUBO0Xwr3p0BVWtkhm5RlWDZC9GleHtSaUZCAbjxsw3plF5lkn8XEpurozNeamiqSOUgnDeZCFVf2fnnMXSluos0gnnLK3pMTi7JYP44KulLIocGwxvlxFGVOW2dZB1xWS2oWerE2cc13ANqjcaGumZBl6PSVUKOOZByjVu31oD42zOB3DHbXbLoKZAGhZAFRxZCmDEy6ZC1dyQZDZD"
            const urlConfig: Config = {
                method: 'post',
                url: `https://graph.facebook.com/v12.0/${fbID}?fields=first_name,last_name,profile_pic`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                data: JSON.stringify({})
            };
            return new Promise<boolean>((resolve, reject) => {
                axios.request(urlConfig)
                    .then((response) => {
                        // let result = response.data.split('\r\n')
                        callback(response)
                        resolve(response.data)
                    })
                    .catch((error) => {
                        console.log("error -- ", error.data)
                        resolve(false)
                    });
            })

        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }

    async deleteSNS(obj: { id: string }, callback: (data: any) => void) {
        try {

            const urlConfig: Config = {
                method: 'post',
                url: config.SNS_URL + `/api/mtk/SmCancel?username=${config.SNSAccount}&password=${config.SNSPWD}&msgid=${obj.id}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: []
            };

            return new Promise<boolean>((resolve, reject) => {
                axios.request(urlConfig)
                    .then((response) => {


                        callback(response.data)
                        resolve(response.data)
                    })
                    .catch((error) => {
                        console.log("error -- ", error)
                        resolve(false)
                    });
            })
            //
            // var settings = {
            //     "url": "https://smsapi.mitake.com.tw/api/mtk/SmSend",
            //     "method": "POST",
            //     "timeout": 0,
            //     "headers": {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     "data": {
            //         "username": `${config.SNSAccount}`,
            //         "password": `${config.SNSPWD}`,
            //         "dstaddr": `${phone}`,
            //         "smbody": `${data}`
            //     }
            // };
            //
            // $.ajax(settings).done(function (response:any) {
            //     console.log(response);
            // });

        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'send SNS Error:' + e, null);
        }
    }

    public parseResponse(response: any) {
        const regex = /\[([0-9]+)\]\r\nmsgid=([^\r\n]+)\r\nstatuscode=([0-9]+)\r\nAccountPoint=([0-9]+)\r\n/;
        const match = response.match(regex);


    }

    async getLine(query: {
        type: string;
        page: number;
        limit: number;
        search?: string;
        searchType?: string;
        mailType?: string;
        status?: string
    }) {
        try {
            const whereList: string[] = ['1 = 1'];
            switch (query.searchType) {
                case 'phone':
                    whereList.push(`(JSON_SEARCH(content->'$.phone', 'one', '%${query.search ?? ''}%', NULL, '$[*]') IS NOT NULL)`);
                    break;
                case 'name':
                    whereList.push(`(UPPER(JSON_EXTRACT(content, '$.name')) LIKE UPPER('%${query.search ?? ''}%'))`);
                    break;
                case 'title':
                    whereList.push(`(UPPER(JSON_EXTRACT(content, '$.title')) LIKE UPPER('%${query.search ?? ''}%'))`);
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

            const emails = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL}
                 ORDER BY id DESC
                     ${query.type === 'download' ? '' : `LIMIT ${query.page * query.limit}, ${query.limit}`};`,
                []
            );

            const total = await db.query(
                `SELECT count(id) as c
                 FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL};`,
                []
            );

            let n = 0;
            await new Promise<void>((resolve) => {
                for (const email of emails) {
                    AutoSendEmail.getDefCompare(this.app, email.content.type).then((dd) => {
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

            return {data: emails, total: total[0].c};
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
        }
    }

    async postLine(data: any): Promise<{ result: boolean; message: string }> {

        data.msgid = ""
        try {
            if (Boolean(data.sendTime)) {
                if (isLater(data.sendTime)) {
                    return {result: false, message: '排定發送的時間需大於現在時間'};
                }
                const insertData = await db.query(`INSERT INTO \`${this.app}\`.\`t_triggers\`
                                                   SET ?;`, [
                    {
                        tag: 'sendLineBySchedule',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(data.sendTime),
                        status: 0,
                    },
                ]);

                // this.chunkSendLine(data.userList , data.content , insertData.insertId , formatDateTime(data.sendTime));
            } else {
                const insertData = await db.query(`INSERT INTO \`${this.app}\`.\`t_triggers\`
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
            return {result: true, message: '寄送成功'};
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }

    async deleteSns(data: any): Promise<{ result: boolean; message: string }> {
        try {
            const emails = await db.query(
                `SELECT *
                 FROM \`${this.app}\`.t_triggers
                 WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`,
                []
            );
            await new Promise((resolve) => {
                this.deleteSNS({id: data.id}, (res) => {
                    resolve(true);
                })
            });

            await db.query(`UPDATE \`${this.app}\`.t_triggers
                            SET status = 2
                            WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`, [])
            return {result: true, message: '取消預約成功'};
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }

    async listenMessage(body: any): Promise<{ result: boolean; message: string }> {
        async function downloadImageFromFacebook(imageUrl: string): Promise<Buffer> {
            try {
                const response = await axios.get(imageUrl, {
                    headers: { },
                    responseType: 'arraybuffer', // 下載二進制資料
                });

                return Buffer.from(response.data);
            } catch (error) {
                console.error('下載圖片時出錯:', error);
                throw error;
            }
        }
        function getFileExtension(url: string): string | null {
            // 使用正規表達式匹配文件副檔名
            const matches = url.match(/\.(jpg|jpeg|png|gif|bmp|webp)(?=[\?&]|$)/i);
            return matches ? matches[1].toLowerCase() : null;
        }

        let that = this;
        const post = new User(this.app, this.token);
        let tokenData = await post.getConfig({
            key: "login_fb_setting",
            user_id: "manager",
        })
        try {
            if (body.object === 'page') {
                for (const entry of body.entry) {
                    const messagingEvents = entry.messaging;
                    // 使用 for...of 來處理每個 messaging 事件
                    for (const event of messagingEvents) {
                        if (event.message){
                            if (((`${event.sender.id}`) == tokenData[0].value.fans_id)){
                                const recipient = "fb_" + event.recipient.id;
                                let chatData: any = {
                                    chat_id: [recipient, "manager"].sort().join('-'),
                                    type: "user",
                                    user_id: recipient,
                                    info: {},
                                    participant: [recipient, "manager"]
                                }
                                await this.getFBInf({fbID: event.recipient.id}, (data) => {
                                    chatData.info = {
                                        fb: {
                                            name: data.last_name + data.first_name,
                                            head: data.profile_pic,
                                            update:new Date().getTime(),
                                        }
                                    }
                                })
                                chatData.info = JSON.stringify(chatData.info);
                                let DBdata = await db.query(
                                    `
                                        SELECT *
                                        FROM \`${this.app}\`.\`t_chat_list\`
                                        WHERE chat_id = ?
                                    `,
                                    [

                                        chatData.chat_id
                                    ]
                                );
                                DBdata = DBdata[0];
                                const now = new Date();
                                if (!DBdata.info.fb.update || new Date().getTime() - DBdata.info.fb.update > (1000 * 60 * 60 * 24)){
                                    await this.getFBInf({fbID: event.recipient.id}, (data) => {
                                        chatData.info = {
                                            fb: {
                                                name: data.last_name + data.first_name,
                                                head: data.profile_pic,
                                                update: new Date().getTime()
                                            }
                                        }

                                    })
                                    // chatData.info = JSON.stringify(chatData.info);
                                    DBdata.info.fb.update = new Date().getTime();
                                    chatData.info = JSON.stringify(chatData.info);
                                    await db.query(
                                        `
                                            UPDATE \`${this.app}\`.\`t_chat_list\`
                                            SET ?
                                            WHERE chat_id = ?
                                        `,
                                        [
                                            {
                                                info: chatData.info,
                                            },
                                            chatData.chat_id
                                        ]
                                    );
                                }

                            }else {
                                const senderId = "fb_" + event.sender.id;
                                let chatData: any = {
                                    chat_id: [senderId, "manager"].sort().join('-'),
                                    type: "user",
                                    user_id: senderId,
                                    info: {},
                                    participant: [senderId, "manager"]
                                }
                                await this.getFBInf({fbID: event.sender.id}, (data) => {
                                    chatData.info = {
                                        fb: {
                                            name: data.last_name + data.first_name,
                                            head: data.profile_pic
                                        }
                                    }

                                })
                                chatData.info = JSON.stringify(chatData.info);

                                const result = await new Chat(this.app).addChatRoom(chatData);
                                if (!result.create) {
                                    await db.query(
                                        `
                                            UPDATE \`${this.app}\`.\`t_chat_list\`
                                            SET ?
                                            WHERE chat_id = ?
                                        `,
                                        [
                                            {
                                                info: chatData.info,
                                            },
                                            chatData.chat_id
                                        ]
                                    );
                                }
                                if (event.message.text){
                                    const messageText = event.message.text;
                                    chatData.message = {
                                        "text": messageText
                                    };
                                    await new Chat(this.app).addMessage(chatData);
                                }
                                if (event.message.attachments){
                                    const attachments = event.message.attachments;
                                    attachments.forEach((attachment: any) => {
                                        if (attachment.type === 'image' && attachment.payload) {
                                            let imageUrl = attachment.payload.url;

                                            downloadImageFromFacebook(imageUrl)
                                                .then((buffer) => {
                                                    const fileExtension = getFileExtension(imageUrl);
                                                    this.uploadFile(`line/${new Date().getTime()}.${fileExtension}`,buffer)
                                                        .then(async (data) => {
                                                            const senderId = "fb_" + event.sender.id;
                                                            chatData.message = {
                                                                "image": data
                                                            };
                                                            await new Chat(this.app).addMessage(chatData);

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
            } else {
                return {result: true, message: 'body error'};
            }

            return {result: true, message: 'accept message'};
        } catch (e) {
            console.log(e)
            throw exception.BadRequestError('BAD_REQUEST', 'Error:' + e, null);
        }
    }

    public async sendCustomerLine(tag: string, order_id: string, lineID: string) {
        const customerMail = await AutoSendEmail.getDefCompare(this.app, tag);
        if (customerMail.toggle) {
            await new Promise(async (resolve) => {
                resolve(await this.sendMessage({
                    data: customerMail.content.replace(/@\{\{訂單號碼\}\}/g, order_id),
                    fbID: lineID
                }, (res) => {

                }))
            })
        }
    }

    async uploadFile(file_name:string,fileData: Buffer) {
        const TAG = `[AWS-S3][Upload]`
        const logger = new Logger();
        const s3bucketName = config.AWS_S3_NAME;
        const s3path = file_name;
        const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            //If you use other contentType will response 403 error
            ContentType: (() => {
                if (config.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`
                } else {
                    return mime.getType(<string>fullUrl.split('.').pop())
                }
            })()
        };
        return new Promise<string>((resolve, reject) => {
            s3bucket.getSignedUrl('putObject', params, async (err: any, url: any) => {
                if (err) {
                    logger.error(TAG, String(err));
                    // use console.log here because logger.info cannot log err.stack correctly
                    console.log(err, err.stack);
                    reject(false)
                } else {
                    axios({
                        method: 'PUT',
                        url: url,
                        data: fileData,
                        headers: {
                            "Content-Type": params.ContentType
                        }
                    }).then(() => {
                        console.log(fullUrl);
                        resolve(fullUrl)
                    }).catch(() => {
                        console.log(`convertError:${fullUrl}`)
                    });

                }
            })
        });
    }

    async getFBInf(obj:{fbID: string  } , callback: (data:any)=>void) {

        try {
            const post = new User(this.app, this.token);

            let tokenData = await post.getConfig({
                key: "login_fb_setting",
                user_id: "manager",
            })

            let token = `Bearer ${tokenData[0].value.fans_token}`;
            const urlConfig: Config = {
                method: 'get',
                url: `https://graph.facebook.com/v16.0/${obj.fbID}?fields=first_name,last_name,profile_pic`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                data: {}
            };

            return new Promise<boolean>((resolve, reject) => {
                axios.request(urlConfig)
                    .then((response) => {
                        callback(response.data)
                        resolve(response.data)
                    })
                    .catch((error) => {
                        console.log("error -- ", error)
                        resolve(false)
                    });
            })

        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', 'send line Error:' + e.data, null);
        }
    }

    //判斷餘額是否足夠
    public async checkPoints(message: string, user_count: number) {
        const brandAndMemberType = await App.checkBrandAndMemberType(this.app);
        // 判斷錢包是否有餘額
        const sum =
            (
                await db.query(
                    `SELECT sum(money)
                     FROM \`${brandAndMemberType.brand}\`.t_sms_points
                     WHERE status in (1, 2)
                       and userID = ?`,
                    [brandAndMemberType.user_id]
                )
            )[0]['sum(money)'] || 0;
        return sum > (this.getUsePoints(message, user_count))
    }

    //點數扣除
    public async usePoints(obj: { message: string, user_count: number, order_id?: string, phone: string }) {
        if (!obj.phone) {
            return 0
        }
        let total = this.getUsePoints(obj.message, obj.user_count)
        const brandAndMemberType = await App.checkBrandAndMemberType(this.app);
        await db.query(`insert into \`${brandAndMemberType.brand}\`.t_sms_points
                        set ?`, [
            {
                orderID: obj.order_id || Tool.randomNumber(8),
                money: total * -1,
                userID: brandAndMemberType.user_id,
                status: 1,
                note: JSON.stringify({
                    message: obj.message,
                    phone: obj.phone
                })
            }
        ])
        return total * -1
    }

    public getUsePoints(text: string, user_count: number) {
        let pointCount = 0
        const maxSize = 160;
        const longSMS = 153;
        let totalSize = 0
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (/[\u4e00-\u9fa5\uFF00-\uFFEF]/.test(char)) {
                totalSize += 2;
            } else {
                totalSize += 1;
            }
        }
        if (totalSize < maxSize) {
            pointCount = 1;
        } else {
            pointCount = Math.ceil(totalSize / longSMS);
        }
        return pointCount * 15 * user_count
    }

}

function formatDate(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function formatDateTime(sendTime?: { date: string; time: string }) {
    const dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
    const dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
    return formatDate(dateObject);
}

function chunkArray(array: any, groupSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}

function isLater(dateTimeObj: { date: string; time: string }) {
    const currentDateTime = new Date();
    const {date, time} = dateTimeObj;
    const dateTimeString = `${date}T${time}:00`;
    const providedDateTime = new Date(dateTimeString);
    return currentDateTime > providedDateTime;
}


