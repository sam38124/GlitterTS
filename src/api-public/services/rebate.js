"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rebate = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const user_js_1 = require("./user.js");
const app_js_1 = require("../../services/app.js");
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
        return (date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            date.getHours() === hour &&
            date.getMinutes() === minute &&
            date.getSeconds() === second);
    }
    async getConfig() {
        try {
            const getRS = await new user_js_1.User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' });
            if (getRS[0] && getRS[0].value) {
                return getRS[0].value;
            }
            return {};
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Insert Rebate Error: ', error.message, null);
            }
        }
    }
    async mainStatus() {
        var _a, _b;
        try {
            const config = await app_js_1.App.checkBrandAndMemberType(this.app);
            if (config.plan === 'light-year')
                return false;
            const rs = await new user_js_1.User(this.app).getConfig({ key: 'rebate_setting', user_id: 'manager' });
            return Boolean((_b = (_a = rs[0]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.main);
        }
        catch (error) {
            console.error('mainStatus error: ' + error);
            return false;
        }
    }
    async getOneRebate(obj) {
        const nowTime = Rebate.nowTime();
        let user_id = 0;
        let point = 0;
        let recycle = 0;
        let pending = 0;
        if (obj.quickPass && obj.user_id) {
            user_id = obj.user_id;
        }
        else {
            if (obj.user_id && !isNaN(obj.user_id)) {
                user_id = obj.user_id;
            }
            else if (obj.email) {
                const user = await database_1.default.query(`SELECT userID FROM \`${this.app}\`.t_user 
          WHERE account = '${obj.email}' OR email = '${obj.email}'`, []);
                if (user[0]) {
                    user_id = user[0].userID;
                }
            }
        }
        if (user_id === 0) {
            return undefined;
        }
        try {
            const cbList = await database_1.default.query(`
          SELECT remain, created_at, deadline FROM \`${this.app}\`.t_rebate_point
          WHERE user_id = ? AND remain > 0
        `, [user_id, nowTime]);
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
        var _a, _b, _c, _d;
        const limit = (_a = query.limit) !== null && _a !== void 0 ? _a : 20;
        const start = ((query.page || 1) - 1) * limit;
        const end = start + limit;
        const search = (_b = query.search) !== null && _b !== void 0 ? _b : '';
        const low = (_c = query.low) !== null && _c !== void 0 ? _c : 0;
        const high = (_d = query.high) !== null && _d !== void 0 ? _d : 10000000000;
        const dataArray = [];
        const searchSQL = search
            ? ` AND (JSON_EXTRACT(userData, '$.name') LIKE '%${search !== null && search !== void 0 ? search : ''}%'
                OR email LIKE '%${search !== null && search !== void 0 ? search : ''}%')`
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
    async getRebateListByRow(query) {
        var _a, _b, _c, _d, _e, _f;
        const page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
        const limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 20;
        const low = (_c = query.low) !== null && _c !== void 0 ? _c : 0;
        const high = (_d = query.high) !== null && _d !== void 0 ? _d : 10000000000;
        let rebateSearchSQL = '';
        const getUsersSQL = query.email_or_phone
            ? `
        SELECT userID, JSON_EXTRACT(userData, '$.name') as name
        FROM \`${this.app}\`.t_user
        WHERE
            (phone = ${database_1.default.escape(query.email_or_phone)}
            OR email = ${database_1.default.escape(query.email_or_phone)});
    `
            : `
            SELECT userID, JSON_EXTRACT(userData, '$.name') as name 
            FROM \`${this.app}\`.t_user 
            WHERE 
                (JSON_EXTRACT(userData, '$.name') LIKE '%${(_e = query.search) !== null && _e !== void 0 ? _e : ''}%'
                OR email LIKE '%${(_f = query.search) !== null && _f !== void 0 ? _f : ''}%');
        `;
        try {
            if (query.search || query.email_or_phone) {
                const users = (await database_1.default.query(getUsersSQL, [])).map((user) => user.userID);
                if (users.length > 0) {
                    rebateSearchSQL = `AND r.user_id in (${users.join(',')})`;
                }
            }
            const rebateCountSQL = `SELECT count(r.id) as c FROM \`${this.app}\`.t_rebate_point as r
                                    WHERE 1 = 1 ${rebateSearchSQL};`;
            const rebateSQL = `
                SELECT r.*, JSON_EXTRACT(u.userData, '$.name') as name
                FROM \`${this.app}\`.t_rebate_point as r 
                JOIN \`${this.app}\`.t_user as u 
                ON r.user_id = u.userID
                WHERE 1 = 1 ${rebateSearchSQL} 
                ORDER BY created_at DESC
                LIMIT ${page * limit}, ${limit};
            `;
            const data = await database_1.default.query(rebateSQL, []);
            const total = (await database_1.default.query(rebateCountSQL, []))[0].c;
            return { total, data };
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
    async getCustomerRebateHistory(obj) {
        const searchSQL = `SELECT userID FROM \`${this.app}\`.t_user 
                            WHERE email = ? OR userID = ?`;
        const rebateSQL = `SELECT * FROM \`${this.app}\`.t_rebate_point where user_id = ? order by id desc`;
        try {
            const search = await database_1.default.query(searchSQL, [obj.email, obj.user_id]);
            if (search.length == 1) {
                const data = (await database_1.default.query(rebateSQL, [search[0].userID])).map((x) => {
                    var _a;
                    x.deadline = (_a = x.deadline) !== null && _a !== void 0 ? _a : null;
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
    async getOldestRebate(user_id) {
        user_id = parseInt(`${user_id}`, 10);
        const nowTime = Rebate.nowTime();
        const getSQL = `SELECT * FROM \`${this.app}\`.t_rebate_point WHERE user_id = ? AND deadline > ? AND remain > 0 ORDER BY deadline`;
        try {
            const get = await database_1.default.query(getSQL, [user_id, nowTime]);
            return { data: get.length > 0 ? get[0] : {} };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Update Oldest Rebate Error: ', error.message, null);
            }
        }
    }
    async updateOldestRebate(user_id, order_id, originMinus) {
        user_id = parseInt(`${user_id}`, 10);
        const nowTime = Rebate.nowTime();
        try {
            let minus = -originMinus;
            do {
                const oldest = await this.getOldestRebate(user_id);
                if (oldest === null || oldest === void 0 ? void 0 : oldest.data) {
                    const { id, remain, content, deadline } = oldest === null || oldest === void 0 ? void 0 : oldest.data;
                    if (id && remain !== undefined) {
                        const calc_remain = remain - minus;
                        const after_remain = remain - minus > 0 ? remain - minus : 0;
                        const new_record = {
                            order_id: order_id !== null && order_id !== void 0 ? order_id : '',
                            use_rebate: remain - after_remain,
                            remain: after_remain,
                            origin_deadline: deadline,
                            updated_at: new Date().toISOString(),
                        };
                        content.record = [...(content.record || []), new_record];
                        await database_1.default.execute(`
                UPDATE \`${this.app}\`.t_rebate_point 
                SET remain = ?, content = ?, updated_at = ? WHERE id = ?;
              `, [after_remain, JSON.stringify(content), nowTime, id]);
                        minus = calc_remain > 0 ? 0 : -calc_remain;
                    }
                }
                else {
                    return false;
                }
            } while (minus > 0);
            return true;
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Update Oldest Rebate Error: ', error.message, null);
            }
        }
    }
    async minusCheck(user_id, amount) {
        user_id = parseInt(`${user_id}`, 10);
        const getUserRebate = await this.getOneRebate({ user_id });
        return getUserRebate && getUserRebate.point + amount >= 0;
    }
    async insertRebate(user_id, amount, note, proof) {
        user_id = parseInt(`${user_id}`, 10);
        const nowTime = (proof === null || proof === void 0 ? void 0 : proof.setCreatedAt) ? proof.setCreatedAt : Rebate.nowTime();
        const deadTime = (proof === null || proof === void 0 ? void 0 : proof.deadTime) && Rebate.isValidDateTimeString(proof === null || proof === void 0 ? void 0 : proof.deadTime)
            ? (0, moment_timezone_1.default)(proof === null || proof === void 0 ? void 0 : proof.deadTime).format('YYYY-MM-DD HH:mm:ss')
            : '2999-12-31 00:00:00';
        const insertSQL = `
            insert into \`${this.app}\`.t_rebate_point
            (user_id, origin, remain, note, content, created_at, updated_at, deadline)
            values (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const getUserRebate = await this.getOneRebate({ user_id });
            const recentRebate = getUserRebate ? getUserRebate.point : 0;
            const errorObj = {
                result: false,
                user_id: user_id,
                before_point: recentRebate,
                amount,
                msg: '',
            };
            if (!(await this.mainStatus())) {
                errorObj.msg = '購物金功能關閉中';
                return errorObj;
            }
            if (recentRebate + amount < 0) {
                errorObj.msg = (proof === null || proof === void 0 ? void 0 : proof.order_id) ? '購物金餘額不足' : '扣除金額請勿大於餘額';
                return errorObj;
            }
            if (amount > 0) {
                if (proof) {
                    delete proof.deadTime;
                    delete proof.setCreatedAt;
                }
                await database_1.default.execute(insertSQL, [user_id, amount, amount, note, proof !== null && proof !== void 0 ? proof : {}, nowTime, nowTime, deadTime]);
            }
            else if (amount < 0) {
                await this.updateOldestRebate(user_id, proof === null || proof === void 0 ? void 0 : proof.order_id, amount);
                await database_1.default.execute(insertSQL, [user_id, amount, 0, note, proof !== null && proof !== void 0 ? proof : {}, nowTime, nowTime, null]);
            }
            return {
                result: true,
                user_id: user_id,
                before_point: recentRebate,
                amount,
                after_point: recentRebate + amount,
                deadTime: amount > 0 ? deadTime : undefined,
                msg: `${amount > 0 ? '增加' : '扣除'}購物金成功`,
            };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Insert Rebate Error: ', error.message, null);
            }
        }
    }
    async canUseRebate(user_id, type, search) {
        try {
            const userExist = await new user_js_1.User(this.app).checkUserIdExists(user_id);
            if (!userExist) {
                return { result: false, msg: '此使用者不存在' };
            }
            const SQL = `SELECT * FROM \`${this.app}\`.t_rebate_point WHERE user_id = ${user_id} AND origin > 0`;
            if (type === 'voucher' && search) {
                const { voucher_id, order_id, sku, quantity } = search;
                const data = await database_1.default.query(`${SQL} 
            AND JSON_EXTRACT(content, '$.voucher_id') = ?
            AND JSON_EXTRACT(content, '$.order_id') = ?
            AND JSON_EXTRACT(content, '$.sku') = ?
            AND JSON_EXTRACT(content, '$.quantity') = ?;
          `, [voucher_id, order_id, sku, quantity]);
                if (data.length > 0)
                    return { result: false, msg: '此優惠券已使用過' };
            }
            if (type === 'cancelOrder' && search) {
                const { voucher_id, order_id, sku, quantity } = search;
                const data = await database_1.default.query(`${SQL} 
            AND JSON_EXTRACT(content, '$.voucher_id') = ?
            AND JSON_EXTRACT(content, '$.order_id') = ?
            AND JSON_EXTRACT(content, '$.sku') = ?
            AND JSON_EXTRACT(content, '$.quantity') = ?;
          `, [voucher_id, order_id, sku, quantity]);
                if (data.length > 0)
                    return { result: false, msg: '此訂單取消已回補過' };
            }
            if (type === 'birth') {
                const data = await database_1.default.query(`${SQL} 
            AND JSON_EXTRACT(content, '$.type') = 'birth' 
            AND YEAR(created_at) = YEAR(CURDATE());
          `, []);
                if (data.length > 0)
                    return { result: false, msg: '生日購物金已發放過' };
            }
            if (type === 'first_regiser') {
                const data = await database_1.default.query(`${SQL} AND JSON_EXTRACT(content, '$.type') = 'first_regiser';`, []);
                if (data.length > 0)
                    return { result: false, msg: '首次註冊購物金已發放過' };
            }
            return { result: true, msg: '可以使用' };
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Check Rebate Error: ', error.message, null);
            }
        }
    }
    async searchRebate(json) {
        try {
            const query = ['1=1'];
            if (json.user_id) {
                query.push(`user_id = ${database_1.default.escape(json.user_id)}`);
            }
            if (json.order_id) {
                query.push(`content->>'$.order_id' = ${database_1.default.escape(json.order_id)}`);
            }
            const getData = await database_1.default.query(`
          SELECT * FROM \`${this.app}\`.t_rebate_point 
          WHERE ${query.map(str => `(${str})`).join(' AND ')};
        `, []);
            return getData;
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                throw exception_1.default.BadRequestError('Search Rebate Error: ', error.message, null);
            }
        }
    }
}
exports.Rebate = Rebate;
Rebate.nowTime = (timeZone) => {
    return (0, moment_timezone_1.default)(new Date()).format('YYYY-MM-DD HH:mm:ss');
};
//# sourceMappingURL=rebate.js.map