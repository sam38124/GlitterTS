import moment from 'moment-timezone';
import db from '../../modules/database';
import exception from '../../modules/exception';
import { IToken } from '../models/Auth.js';

interface OneUserRebate {
    user_id: number;
    point: number;
    recycle: number;
    pending: number;
}

export interface IRebateSearch {
    search: string;
    limit: number;
    page: number;
    low?: number;
    high?: number;
    type?: string;
}

export class Rebate {
    public app: string;

    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    static isValidDateTimeString(dateTimeString: string): boolean {
        // 使用正規表達式驗證格式 YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        let formattedDateTimeString = dateTimeString;

        if (dateRegex.test(dateTimeString)) {
            // 如果是 YYYY-MM-DD 格式，補上 00:00:00
            formattedDateTimeString = `${dateTimeString} 00:00:00`;
        } else if (!dateTimeRegex.test(dateTimeString)) {
            // 如果既不是 YYYY-MM-DD 也不是 YYYY-MM-DD HH:mm:ss 格式，直接返回 false
            return false;
        }

        // 嘗試解析日期
        const date = new Date(formattedDateTimeString.replace(' ', 'T'));

        // 檢查解析後的日期是否有效
        if (isNaN(date.getTime())) {
            return false;
        }

        // 檢查月份和日期是否正確（避免如2023-02-30這種不合法日期）
        const [year, month, day, hour, minute, second] = formattedDateTimeString.split(/[- :]/).map(Number);

        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date.getHours() === hour && date.getMinutes() === minute && date.getSeconds() === second;
    }

    // 現在時間
    static nowTime = (timeZone?: string) =>
        moment()
            .tz(timeZone ?? 'Asia/Taipei')
            .format('YYYY-MM-DD HH:mm:ss');

    // 單一會員回饋金
    async getOneRebate(obj: { user_id?: number; email?: string }): Promise<OneUserRebate | undefined> {
        const nowTime = Rebate.nowTime();
        let user_id = 0;
        let point = 0;
        let recycle = 0;
        let pending = 0;

        if (obj.user_id && !isNaN(obj.user_id)) {
            user_id = obj.user_id;
        } else if (obj.email) {
            const user = await db.query(
                `SELECT userID FROM \`${this.app}\`.t_user 
                    WHERE account = '${obj.email}' OR JSON_EXTRACT(userData, '$.email') = '${obj.email}'`,
                []
            );
            if (user[0]) {
                user_id = user[0].userID;
            }
        }

        if (user_id === 0) {
            return undefined;
        }

        try {
            const cbList = await db.query(
                `SELECT remain, created_at, deadline FROM \`${this.app}\`.t_rebate_point 
                    WHERE user_id = ? AND remain > 0`,
                [user_id, nowTime]
            );
            cbList.map((data: { remain: number; created_at: string; deadline: string }) => {
                const { remain, created_at, deadline } = data;
                if (moment(created_at).isAfter(nowTime)) {
                    pending += remain;
                } else if (moment(nowTime).isAfter(deadline)) {
                    recycle += remain;
                } else {
                    point += remain;
                }
            });
            return { user_id, point, recycle, pending };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('Get One Rebate Error: ', error.message, null);
            }
        }
    }

    // 取得回饋金列表
    async getRebateList(query: IRebateSearch) {
        const limit = query.limit ?? 20;
        const start = ((query.page ?? 1) - 1) * limit;
        const end = start + limit;
        const search = query.search ?? '';
        const low = query.low ?? 0;
        const high = query.high ?? 10000000000;
        const dataArray: OneUserRebate[] = [];
        const searchSQL = search
            ? ` AND (JSON_EXTRACT(userData, '$.name') LIKE '%${search ?? ''}%'
                OR JSON_EXTRACT(userData, '$.email') LIKE '%${search ?? ''}%')`
            : '';
        const getUsersSQL = `SELECT * FROM \`${this.app}\`.t_user WHERE 1 = 1 ` + searchSQL;

        try {
            const sum = await this.totalRebateValue();
            const users = await db.query(getUsersSQL, []);
            for (const user of users) {
                delete user.pwd;
                const getOne = await this.getOneRebate({ user_id: user.userID });
                if (getOne && getOne.point >= low && getOne.point <= high) {
                    dataArray.push({ ...user, ...getOne });
                }
            }
            const data = query.type === 'download' ? dataArray : dataArray.slice(start, end);
            const total = dataArray.length;

            return { total, data, sum };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('Get Rebate List Error: ', error.message, null);
            }
        }
    }

    // 取得總計項目
    async totalRebateValue() {
        const nowTime = Rebate.nowTime();
        const remainsSQL = `SELECT remain, created_at, deadline FROM \`${this.app}\`.t_rebate_point WHERE remain > 0;`;
        let point = 0;
        let recycle = 0;
        let pending = 0;

        try {
            const remains = await db.query(remainsSQL, []);
            remains.map((data: { remain: string | number; created_at: string; deadline: string }) => {
                const { remain, created_at, deadline } = data;
                const n = parseInt(remain + '', 10);
                if (moment(created_at).isAfter(nowTime)) {
                    pending += n;
                } else if (moment(nowTime).isAfter(deadline)) {
                    recycle += n;
                } else {
                    point += n;
                }
            });
            return { point, recycle, pending };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('Total Rebate Value Error: ', error.message, null);
            }
        }
    }

    // 單一會員回饋金歷史紀錄
    async getCustomerRebateHistory(email: string) {
        const searchSQL = `SELECT userID FROM \`${this.app}\`.t_user where JSON_EXTRACT(userData, '$.email') = ?`;
        const rebateSQL = `SELECT * FROM \`${this.app}\`.t_rebate_point where user_id = ? order by id desc`;

        try {
            const search = await db.query(searchSQL, [email]);
            if (search.length == 1) {
                const data = (await db.query(rebateSQL, [search[0].userID])).map((x: any) => {
                    x.created_at = moment(x.created_at).format('YYYY-MM-DD HH:mm:ss');
                    x.updated_at = moment(x.updated_at).format('YYYY-MM-DD HH:mm:ss');
                    x.deadline = x.deadline ? moment(x.deadline).format('YYYY-MM-DD HH:mm:ss') : null;
                    return x;
                });
                return { result: true, data };
            } else {
                return { result: false, message: '此信箱尚未建立' };
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('Get Customer Rebate History Error: ', error.message, null);
            }
        }
    }

    // 減少最舊一筆的餘額並更新
    async updateOldestRebate(user_id: number, originMinus: number) {
        const nowTime = Rebate.nowTime();
        const getSQL = `SELECT * FROM \`${this.app}\`.t_rebate_point WHERE user_id = ? AND deadline > ? AND remain > 0 ORDER BY created_at`;
        const updateSQL = `UPDATE \`${this.app}\`.t_rebate_point SET remain = ?, updated_at = ? WHERE id = ?`;
        const get = await db.query(getSQL, [user_id, nowTime]);
        let n = 0;
        let minus = -originMinus;
        try {
            if (get.length > 0) {
                do {
                    const { id, remain } = get[n];
                    if (remain - minus > 0) {
                        await db.execute(updateSQL, [remain - minus, nowTime, id]);
                        minus = 0;
                    } else {
                        await db.execute(updateSQL, [0, nowTime, id]);
                        minus = minus - remain;
                    }
                    n++;
                } while (minus > 0);
            }
            return;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('Update Oldest Rebate Error: ', error.message, null);
            }
        }
    }

    // 增加或減少會員回饋金
    async insertRebate(
        user_id: number,
        amount: number,
        note: string,
        proof?: {
            cart_token?: string;
            orderNO?: string;
            sku?: string;
            quantity?: number;
            setCreatedAt?: string;
            deadTime?: string;
        }
    ) {
        const nowTime = proof?.setCreatedAt ? proof.setCreatedAt : Rebate.nowTime();
        const deadTime = proof?.deadTime && Rebate.isValidDateTimeString(proof?.deadTime) ? moment(proof?.deadTime).format('YYYY-MM-DD HH:mm:ss') : '2999-12-31 00:00:00';
        const insertSQL = `
            insert into \`${this.app}\`.t_rebate_point
            (user_id, origin, remain, note, orderNO, sku, quantity, created_at, updated_at, deadline)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            const getUserRebate = await this.getOneRebate({ user_id });
            const recentRebate = getUserRebate ? getUserRebate.point : 0;
            const errorObj = { result: false, total: recentRebate, msg: '' };
            if (recentRebate + amount < 0) {
                errorObj.msg = proof?.cart_token ? '回饋金餘額不足' : '扣除金額請勿大於餘額';
                return errorObj;
            }
            if (amount > 0) {
                await db.execute(insertSQL, [
                    user_id,
                    amount,
                    amount,
                    note,
                    proof && proof.orderNO ? proof.orderNO : null,
                    proof && proof.sku ? proof.sku : null,
                    proof && proof.quantity ? proof.quantity : null,
                    nowTime,
                    nowTime,
                    deadTime,
                ]);
            } else {
                await this.updateOldestRebate(user_id, amount);
                await db.execute(insertSQL, [user_id, amount, 0, note, null, null, null, nowTime, nowTime, null]);
            }

            return {
                result: true,
                before_point: recentRebate,
                amount,
                after_point: recentRebate + amount,
                deadTime: amount > 0 ? deadTime : undefined,
                msg: `${amount > 0 ? '增加' : '扣除'}回饋金成功`,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception.BadRequestError('Insert Rebate Error: ', error.message, null);
            }
        }
    }
}
