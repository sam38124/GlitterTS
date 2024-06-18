"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rebate = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
class Rebate {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    static isValidDateTimeString(dateTimeString) {
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        let formattedDateTimeString = dateTimeString;
        if (dateRegex.test(dateTimeString)) {
            formattedDateTimeString = `${dateTimeString} 00:00:00`;
        }
        else if (!dateTimeRegex.test(dateTimeString)) {
            return false;
        }
        const date = new Date(formattedDateTimeString.replace(' ', 'T'));
        if (isNaN(date.getTime())) {
            return false;
        }
        const [year, month, day, hour, minute, second] = formattedDateTimeString.split(/[- :]/).map(Number);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date.getHours() === hour && date.getMinutes() === minute && date.getSeconds() === second;
    }
    async getOneRebate(obj) {
        const nowTime = Rebate.nowTime();
        let user_id = 0;
        let point = 0;
        let recycle = 0;
        let pending = 0;
        if (obj.user_id && !isNaN(obj.user_id)) {
            user_id = obj.user_id;
        }
        else if (obj.email) {
            const user = await database_1.default.query(`SELECT userID FROM \`${this.app}\`.t_user 
                    WHERE account = '${obj.email}' OR JSON_EXTRACT(userData, '$.email') = '${obj.email}'`, []);
            if (user[0]) {
                user_id = user[0].userID;
            }
        }
        if (user_id === 0) {
            return undefined;
        }
        try {
            const cbList = await database_1.default.query(`SELECT remain, created_at, deadline FROM \`${this.app}\`.t_rebate_point 
                    WHERE user_id = ? AND remain > 0`, [user_id, nowTime]);
            cbList.map((data) => {
                const { remain, created_at, deadline } = data;
                if ((0, moment_timezone_1.default)(created_at).isAfter(nowTime)) {
                    pending += remain;
                }
                else if ((0, moment_timezone_1.default)(nowTime).isAfter(deadline)) {
                    recycle += remain;
                }
                else {
                    point += remain;
                }
            });
            return { user_id, point, recycle, pending };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Get One Rebate Error: ', error.message, null);
            }
        }
    }
    async getRebateList(query) {
        var _a, _b, _c, _d, _e;
        const limit = (_a = query.limit) !== null && _a !== void 0 ? _a : 20;
        const start = (((_b = query.page) !== null && _b !== void 0 ? _b : 1) - 1) * limit;
        const end = start + limit;
        const search = (_c = query.search) !== null && _c !== void 0 ? _c : '';
        const low = (_d = query.low) !== null && _d !== void 0 ? _d : 0;
        const high = (_e = query.high) !== null && _e !== void 0 ? _e : 10000000000;
        const dataArray = [];
        const searchSQL = search
            ? ` AND (JSON_EXTRACT(userData, '$.name') LIKE '%${search !== null && search !== void 0 ? search : ''}%'
                OR JSON_EXTRACT(userData, '$.email') LIKE '%${search !== null && search !== void 0 ? search : ''}%')`
            : '';
        const getUsersSQL = `SELECT * FROM \`${this.app}\`.t_user WHERE 1 = 1 ` + searchSQL;
        try {
            const sum = await this.totalRebateValue();
            const users = await database_1.default.query(getUsersSQL, []);
            for (const user of users) {
                delete user.pwd;
                const getOne = await this.getOneRebate({ user_id: user.userID });
                if (getOne && getOne.point >= low && getOne.point <= high) {
                    dataArray.push(Object.assign(Object.assign({}, user), getOne));
                }
            }
            const data = query.type === 'download' ? dataArray : dataArray.slice(start, end);
            const total = dataArray.length;
            return { total, data, sum };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Get Rebate List Error: ', error.message, null);
            }
        }
    }
    async totalRebateValue() {
        const nowTime = Rebate.nowTime();
        const remainsSQL = `SELECT remain, created_at, deadline FROM \`${this.app}\`.t_rebate_point WHERE remain > 0;`;
        let point = 0;
        let recycle = 0;
        let pending = 0;
        try {
            const remains = await database_1.default.query(remainsSQL, []);
            remains.map((data) => {
                const { remain, created_at, deadline } = data;
                const n = parseInt(remain + '', 10);
                if ((0, moment_timezone_1.default)(created_at).isAfter(nowTime)) {
                    pending += n;
                }
                else if ((0, moment_timezone_1.default)(nowTime).isAfter(deadline)) {
                    recycle += n;
                }
                else {
                    point += n;
                }
            });
            return { point, recycle, pending };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Total Rebate Value Error: ', error.message, null);
            }
        }
    }
    async getCustomerRebateHistory(email) {
        const searchSQL = `SELECT userID FROM \`${this.app}\`.t_user where JSON_EXTRACT(userData, '$.email') = ?`;
        const rebateSQL = `SELECT * FROM \`${this.app}\`.t_rebate_point where user_id = ? order by id desc`;
        try {
            const search = await database_1.default.query(searchSQL, [email]);
            if (search.length == 1) {
                const data = (await database_1.default.query(rebateSQL, [search[0].userID])).map((x) => {
                    x.created_at = (0, moment_timezone_1.default)(x.created_at).format('YYYY-MM-DD HH:mm:ss');
                    x.updated_at = (0, moment_timezone_1.default)(x.updated_at).format('YYYY-MM-DD HH:mm:ss');
                    x.deadline = x.deadline ? (0, moment_timezone_1.default)(x.deadline).format('YYYY-MM-DD HH:mm:ss') : null;
                    return x;
                });
                return { result: true, data };
            }
            else {
                return { result: false, message: '此信箱尚未建立' };
            }
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Get Customer Rebate History Error: ', error.message, null);
            }
        }
    }
    async updateOldestRebate(user_id, originMinus) {
        const nowTime = Rebate.nowTime();
        const getSQL = `SELECT * FROM \`${this.app}\`.t_rebate_point WHERE user_id = ? AND deadline > ? AND remain > 0 ORDER BY created_at`;
        const updateSQL = `UPDATE \`${this.app}\`.t_rebate_point SET remain = ?, updated_at = ? WHERE id = ?`;
        const get = await database_1.default.query(getSQL, [user_id, nowTime]);
        let n = 0;
        let minus = -originMinus;
        try {
            if (get.length > 0) {
                do {
                    const { id, remain } = get[n];
                    if (remain - minus > 0) {
                        await database_1.default.execute(updateSQL, [remain - minus, nowTime, id]);
                        minus = 0;
                    }
                    else {
                        await database_1.default.execute(updateSQL, [0, nowTime, id]);
                        minus = minus - remain;
                    }
                    n++;
                } while (minus > 0);
            }
            return;
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Update Oldest Rebate Error: ', error.message, null);
            }
        }
    }
    async insertRebate(user_id, amount, note, proof) {
        const nowTime = (proof === null || proof === void 0 ? void 0 : proof.setCreatedAt) ? proof.setCreatedAt : Rebate.nowTime();
        const deadTime = (proof === null || proof === void 0 ? void 0 : proof.deadTime) && Rebate.isValidDateTimeString(proof === null || proof === void 0 ? void 0 : proof.deadTime) ? (0, moment_timezone_1.default)(proof === null || proof === void 0 ? void 0 : proof.deadTime).format('YYYY-MM-DD HH:mm:ss') : '2999-12-31 00:00:00';
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
                errorObj.msg = (proof === null || proof === void 0 ? void 0 : proof.cart_token) ? '回饋金餘額不足' : '扣除金額請勿大於餘額';
                return errorObj;
            }
            if (amount > 0) {
                await database_1.default.execute(insertSQL, [
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
            }
            else {
                await this.updateOldestRebate(user_id, amount);
                await database_1.default.execute(insertSQL, [user_id, amount, 0, note, null, null, null, nowTime, nowTime, null]);
            }
            return {
                result: true,
                before_point: recentRebate,
                amount,
                after_point: recentRebate + amount,
                deadTime: amount > 0 ? deadTime : undefined,
                msg: `${amount > 0 ? '增加' : '扣除'}回饋金成功`,
            };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Insert Rebate Error: ', error.message, null);
            }
        }
    }
}
exports.Rebate = Rebate;
Rebate.nowTime = (timeZone) => (0, moment_timezone_1.default)()
    .tz(timeZone !== null && timeZone !== void 0 ? timeZone : 'Asia/Taipei')
    .format('YYYY-MM-DD HH:mm:ss');
//# sourceMappingURL=rebate.js.map