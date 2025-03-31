import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { AutoSendEmail } from './auto-send-email.js';
import config from '../../config';
import axios from 'axios';
import { App } from '../../services/app.js';
import Tool from '../../modules/tool.js';

interface SNSResponse {
    // 定義 response 物件的結構，根據實際 API 回應的格式進行調整
    clientid?: string;
    msgid?: string;
    statuscode: number;
    accountPoint?: number;
    Duplicate?: string;
    smsPoint?: number;
    message?: string;
}
interface Config {
    method: 'post';
    url: string;
    headers: Record<string, string>;
    data: any;
}

interface SNSData {
    username: string;
    password: string;
    dstaddr: string;
    smbody: string;
    smsPointFlag: number;
}

export class SMS {
    public app;

    constructor(app: string, token?: IToken) {
        this.app = app;
    }

    async chunkSendSNS(data: any, id: number, date?: string) {
        try {
            let msgid = '';
            for (const b of chunkArray(Array.from(new Set(data.phone)), 10)) {
                let check = b.length;

                await new Promise((resolve) => {
                    for (const d of b) {
                        this.sendSNS({ data: data.content, phone: d, date: date }, (res) => {
                            check--;
                            console.log(' res -- ', res);
                            if (check === 0) {
                                db.query(`UPDATE \`${this.app}\`.t_triggers SET status = ${date ? 0 : 1} , content = JSON_SET(content, '$.name', '${res.msgid}') WHERE id = ?;`, [id]);
                                resolve(true);
                            }
                        });
                    }
                });
            }
            // await db.query(`UPDATE \`${this.app}\`.t_triggers SET status = ${date?0:1} , content = JSON_SET(content, '$.name', '變數A') WHERE id = ?;`, [ id]);
            // await db.query(`-- UPDATE \`${this.app}\`.t_triggers SET ? WHERE id = ?;`, [{ status: 1 , content : `JSON_SET(content, '$.name', '變數A')`}, id]);
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e, null);
        }
    }
    async sendSNS(obj: { data: string; phone: string; date?: string; order_id?: string }, callback: (data: SNSResponse) => void) {
        try {
            //有點數再執行
            if (await this.checkPoints(obj.data, 1)) {
                let snsData: SNSData = {
                    username: config.SNSAccount ?? '',
                    password: config.SNSPWD ?? '',
                    dstaddr: obj.phone,
                    smsPointFlag: 1,
                    smbody: obj.data.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ''),
                };
                if (obj.date) {
                    (snsData as any).dlvtime = obj.date;
                }
                const urlConfig: Config = {
                    method: 'post',
                    url: config.SNS_URL + '/api/mtk/SmSend?CharsetURL=UTF8',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: snsData,
                };

                //扣除點數
                await this.usePoints({
                    message: obj.data,
                    user_count: 1,
                    order_id: obj.order_id+'_'+(await Tool.randomNumber(4)),
                    phone: obj.phone,
                });
                return new Promise<boolean>((resolve, reject) => {
                    axios
                        .request(urlConfig)
                        .then((response:any) => {
                            let result = response.data.split('\r\n');
                            let snsResponse: SNSResponse = {
                                clientid: result[0],
                                msgid: result[1].split('=')[1],
                                statuscode: result[2].split('=')[1],
                                smsPoint: result[3].split('=')[1],
                                accountPoint: result[4].split('=')[1],
                            };

                            callback(snsResponse);
                            resolve(response.data);
                        })
                        .catch((error:any) => {
                            console.error('error -- ', error);
                            resolve(false);
                        });
                });
            } else {
                return false;
            }
        } catch (e) {
            console.log(`error`,e)
            throw exception.BadRequestError('BAD_REQUEST', 'send SNS Error:' + e, null);
        }
    }
    async deleteSNS(obj: { id: string }, callback: (data: any) => void) {
        try {
            const urlConfig: Config = {
                method: 'post',
                url: config.SNS_URL + `/api/mtk/SmCancel?username=${config.SNSAccount}&password=${config.SNSPWD}&msgid=${obj.id}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: [],
            };

            return new Promise<boolean>((resolve, reject) => {
                axios
                    .request(urlConfig)
                    .then((response:any) => {
                        callback(response.data);
                        resolve(response.data);
                    })
                    .catch((error:any) => {
                        console.log('error -- ', error);
                        resolve(false);
                    });
            });
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
    async getSns(query: { type: string; page: number; limit: number; search?: string; searchType?: string; mailType?: string; status?: string }) {
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

            const whereSQL = `(tag = 'sendSNS' OR tag = 'sendSNSBySchedule') AND ${whereList.join(' AND ')}`;

            const emails = await db.query(
                `SELECT * FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL}
                 ORDER BY id DESC
                 ${query.type === 'download' ? '' : `LIMIT ${query.page * query.limit}, ${query.limit}`};`,
                []
            );

            const total = await db.query(
                `SELECT count(id) as c FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL};`,
                []
            );

            let n = 0;
            await new Promise<void>((resolve) => {
                for (const email of emails) {
                    AutoSendEmail.getDefCompare(this.app, email.content.type,'zh-TW').then((dd) => {
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
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
        }
    }
    async postSns(data: any): Promise<{ result: boolean; message: string }> {
        if (!(await this.checkPoints(data.content, data.phone.length))) {
            throw exception.BadRequestError('BAD_REQUEST', 'No_Points', {
                message: '餘額不足',
            });
        }
        data.msgid = '';
        try {
            if (Boolean(data.sendTime)) {
                if (isLater(data.sendTime)) {
                    return { result: false, message: '排定發送的時間需大於現在時間' };
                }
                const insertData = await db.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
                    {
                        tag: 'sendSNS',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(data.sendTime),
                        status: 0,
                    },
                ]);

                this.chunkSendSNS(data, insertData.insertId, formatDateTime(data.sendTime));
            } else {
                const insertData = await db.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
                    {
                        tag: 'sendSNS',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(),
                        status: 0,
                    },
                ]);
                this.chunkSendSNS(data, insertData.insertId);
            }
            return { result: true, message: '寄送成功' };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
    async deleteSns(data: any): Promise<{ result: boolean; message: string }> {
        try {
            const emails = await db.query(
                `SELECT * FROM \`${this.app}\`.t_triggers
                 WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`,
                []
            );
            await new Promise((resolve) => {
                this.deleteSNS({ id: data.id }, (res) => {
                    resolve(true);
                });
            });

            await db.query(`UPDATE \`${this.app}\`.t_triggers SET status = 2 WHERE JSON_EXTRACT(content, '$.name') = '${data.id}';`, []);
            return { result: true, message: '取消預約成功' };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
    public async sendCustomerSns(tag: string, order_id: string, phone: string) {
        const customerMail = await AutoSendEmail.getDefCompare(this.app, tag,'zh-TW');
        if (customerMail.toggle) {
            await new Promise(async (resolve) => {
                resolve(await this.sendSNS({ data: customerMail.content.replace(/@\{\{訂單號碼\}\}/g, order_id), phone: phone, order_id: order_id }, (res) => {}));
            });
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
        return sum > this.getUsePoints(message, user_count);
    }

    //點數扣除
    public async usePoints(obj: { message: string; user_count: number; order_id?: string; phone: string }) {
        if (!obj.phone) {
            return 0;
        }
        let total = this.getUsePoints(obj.message, obj.user_count);
        const brandAndMemberType = await App.checkBrandAndMemberType(this.app);

        await db.query(
            `insert into \`${brandAndMemberType.brand}\`.t_sms_points
                        set ?`,
            [
                {
                    orderID: obj.order_id || Tool.randomNumber(8),
                    money: total * -1,
                    userID: brandAndMemberType.user_id,
                    status: 1,
                    note: JSON.stringify({
                        message: obj.message,
                        phone: obj.phone,
                    }),
                },
            ]
        );
        return total * -1;
    }

    public getUsePoints(text: string, user_count: number) {
        let pointCount = 0;
        const maxSize = 160;
        const longSMS = 153;
        let totalSize = 0;
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
        return pointCount * 15 * user_count;
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
    const { date, time } = dateTimeObj;
    const dateTimeString = `${date}T${time}:00`;
    const providedDateTime = new Date(dateTimeString);
    return currentDateTime > providedDateTime;
}
