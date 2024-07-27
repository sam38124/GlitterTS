"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const ses_js_1 = require("../../services/ses.js");
class Mail {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async chunkSendMail(data, id) {
        try {
            for (const b of chunkArray(Array.from(new Set(data.email)), 10)) {
                let check = b.length;
                await new Promise((resolve) => {
                    for (const d of b) {
                        (0, ses_js_1.sendmail)(`${data.name} <${process.env.smtp}>`, d, data.title, data.content, () => {
                            check--;
                            if (check === 0) {
                                resolve(true);
                            }
                        });
                    }
                });
            }
            await database_js_1.default.query(`UPDATE \`${this.app}\`.t_triggers SET ? WHERE id = ?;`, [{ status: 1 }, id]);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'chunkSendMail Error:' + e, null);
        }
    }
    async getMail(query) {
        var _a, _b, _c;
        try {
            let searchSQL = '';
            switch (query.searchType) {
                case 'email':
                    searchSQL = ` AND JSON_SEARCH(content->'$.email', 'one', '%${(_a = query.search) !== null && _a !== void 0 ? _a : ''}%', NULL, '$[*]') IS NOT NULL `;
                    break;
                case 'name':
                    searchSQL = ` AND UPPER(JSON_EXTRACT(content, '$.name')) LIKE UPPER('%${(_b = query.search) !== null && _b !== void 0 ? _b : ''}%') `;
                    break;
                case 'title':
                    searchSQL = ` AND UPPER(JSON_EXTRACT(content, '$.title')) LIKE UPPER('%${(_c = query.search) !== null && _c !== void 0 ? _c : ''}%') `;
                    break;
            }
            let statusSQL = '';
            if (query.status) {
                statusSQL = ` AND status = ${query.status}`;
            }
            const whereSQL = `(tag = 'sendMail' OR tag = 'sendMailBySchedule')${searchSQL}${statusSQL}`;
            const emails = await database_js_1.default.query(`SELECT * FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL}
                 ORDER BY id DESC
                 ${query.type === 'download' ? '' : `LIMIT ${query.page * query.limit}, ${query.limit}`};`, []);
            const total = await database_js_1.default.query(`SELECT count(id) as c FROM \`${this.app}\`.t_triggers
                 WHERE ${whereSQL};`, []);
            return { data: emails, total: total[0].c };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
        }
    }
    async postMail(data) {
        data.token && delete data.token;
        console.log(JSON.stringify(data));
        try {
            if (Boolean(data.sendTime)) {
                if (isLater(data.sendTime)) {
                    return { result: false, message: '排定發送的時間需大於現在時間' };
                }
                await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
                    {
                        tag: 'sendMailBySchedule',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(data.sendTime),
                        status: 0,
                    },
                ]);
            }
            else {
                const insertData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\` SET ? ;`, [
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
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
}
exports.Mail = Mail;
function formatDateTime(sendTime) {
    const dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
    const dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
    const formattedDateTime = dateObject.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDateTime;
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
//# sourceMappingURL=mail.js.map