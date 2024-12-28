import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { sendmail } from '../../services/ses.js';
import { AutoSendEmail } from './auto-send-email.js';

export class Mail {
    public app;
    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async chunkSendMail(data: any, id: number) {
        try {
            for (const b of chunkArray(Array.from(new Set(data.email)), 10)) {
                let check = b.length;
                await new Promise((resolve) => {
                    for (const d of b) {
                        sendmail(`${data.name} <${process.env.smtp}>`, d, data.title, data.content, () => {
                            check--;
                            if (check === 0) {
                                resolve(true);
                            }
                        });
                    }
                });
            }
            await db.query(`UPDATE \`${this.app}\`.t_triggers SET ? WHERE id = ?;`, [{ status: 1 }, id]);
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'chunkSendMail Error:' + e, null);
        }
    }

    async getMail(query: { type: string; page: number; limit: number; search?: string; searchType?: string; mailType?: string; status?: string }) {
        try {
            const whereList: string[] = ['1 = 1'];
            switch (query.searchType) {
                case 'email':
                    whereList.push(`(JSON_SEARCH(content->'$.email', 'one', '%${query.search ?? ''}%', NULL, '$[*]') IS NOT NULL)`);
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

            const whereSQL = `(tag = 'sendMail' OR tag = 'sendMailBySchedule') AND ${whereList.join(' AND ')}`;

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

    async postMail(data: any): Promise<{ result: boolean; message: string }> {
        data.token && delete data.token;
        try {
            if (Boolean(data.sendTime)) {
                if (isLater(data.sendTime)) {
                    return { result: false, message: '排定發送的時間需大於現在時間' };
                }
                await db.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
                    {
                        tag: 'sendMailBySchedule',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(data.sendTime),
                        status: 0,
                    },
                ]);
            } else {
                const insertData = await db.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
                    {
                        tag: 'sendMail',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(),
                        status: 0,
                    },
                ]);
                this.chunkSendMail(data, insertData.insertId);
            }
            return { result: true, message: '寄送成功' };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }

    async cancelSendMail(id: string): Promise<{ result: boolean; message: string }> {
        try {
            await db.query(`UPDATE \`${this.app}\`.t_triggers SET ? WHERE id = ?;`, [{ status: 2 }, id]);
            return { result: true, message: '取消排定發送成功' };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
}

function formatDateTime(sendTime?: { date: string; time: string }) {
    const dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
    const dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
    const formattedDateTime = dateObject.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDateTime;
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
