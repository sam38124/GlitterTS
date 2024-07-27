import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { sendmail } from '../../services/ses.js';

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

    async getMail(query: { type: string; page: number; limit: number; search: string; searchType: string; sendDate: string; sendTime: string; status: string }) {
        try {
            let searchSQL = '';
            switch (query.searchType) {
                case 'email':
                    searchSQL = ` AND JSON_SEARCH(content->'$.email', 'one', '%${query.search ?? ''}%', NULL, '$[*]') IS NOT NULL `;
                    break;
                case 'name':
                    searchSQL = ` AND UPPER(JSON_EXTRACT(content, '$.name')) LIKE UPPER('%${query.search ?? ''}%') `;
                    break;
                case 'title':
                    searchSQL = ` AND UPPER(JSON_EXTRACT(content, '$.title')) LIKE UPPER('%${query.search ?? ''}%') `;
                    break;
            }

            let statusSQL = '';
            if (query.status) {
                statusSQL = ` AND status = ${query.status}`;
            }

            const whereSQL = `(tag = 'sendMail' OR tag = 'sendMailBySchedule')${searchSQL}${statusSQL}`;

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

            return { data: emails, total: total[0].c };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
        }
    }

    async postMail(data: any): Promise<boolean> {
        delete data.token;
        try {
            if (Boolean(data.sendTime)) {
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
            return true;
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
