"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const rebate_1 = require("./rebate");
const user_1 = require("./user");
class Schedule {
    constructor(app) {
        this.app = app;
    }
    async perload() {
        if (!(await this.isDatabaseExists()))
            return false;
        if (!(await this.isDatabasePass()))
            return false;
        if (!(await this.isTableExists('t_user_public_config')))
            return false;
        return true;
    }
    async isDatabaseExists() {
        return (await database_1.default.query(`SHOW DATABASES LIKE \'${this.app}\';`, [])).length > 0;
    }
    async isDatabasePass() {
        const SQL = `
            SELECT * FROM glitter.app_config
            WHERE appName = \'${this.app}\' AND (refer_app is null OR refer_app = appName);
        `;
        return (await database_1.default.query(SQL, [])).length > 0;
    }
    async isTableExists(table) {
        return (await database_1.default.query(`SHOW TABLES IN \`${this.app}\` LIKE \'${table}\';`, [])).length > 0;
    }
    async example(sec) {
        try {
            if (await this.perload()) {
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Example Error: ' + e, null);
        }
        setTimeout(() => this.example(sec), sec * 1000);
    }
    async birthRebate(sec) {
        try {
            if (await this.perload()) {
                const rebateClass = new rebate_1.Rebate(this.app);
                const userClass = new user_1.User(this.app);
                if (await rebateClass.mainStatus()) {
                    const getRS = await userClass.getConfig({ key: 'rebate_setting', user_id: 'manager' });
                    const rgs = getRS[0] && getRS[0].value.birth ? getRS[0].value.birth : {};
                    if (rgs && rgs.switch) {
                        async function postUserRebate(id, value) {
                            const used = await rebateClass.canUseRebate(id, 'birth');
                            if (used === null || used === void 0 ? void 0 : used.result) {
                                await rebateClass.insertRebate(id, value, '生日禮', {
                                    type: 'birth',
                                    deadTime: rgs.unlimited ? undefined : (0, moment_1.default)().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
                                });
                            }
                        }
                        const users = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_user 
                                WHERE MONTH(JSON_EXTRACT(userData, '$.birth')) = MONTH(CURDATE());`, []);
                        if (rgs.type === 'base') {
                            for (const user of users) {
                                await postUserRebate(user.userID, rgs.value);
                            }
                        }
                        if (rgs.type === 'levels') {
                            for (const user of users) {
                                const member = await userClass.refreshMember(user);
                                const level = member.find((dd) => dd.trigger);
                                if (!level)
                                    continue;
                                const data = rgs.level.find((item) => item.id === level.id);
                                if (!data)
                                    continue;
                                await postUserRebate(user.userID, data.value);
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'birthRebate Error: ' + e, null);
        }
        setTimeout(() => this.birthRebate(sec), sec * 1000);
    }
    async main() {
        const scheduleList = [
            { second: 10, status: false, func: 'example', desc: '排程啟用範例' },
            { second: 60 * 60, status: true, func: 'birthRebate', desc: '生日禮發放購物金' },
        ];
        try {
            scheduleList.forEach((schedule) => {
                if (schedule.status && typeof this[schedule.func] === 'function') {
                    this[schedule.func](schedule.second);
                }
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Init Schedule Error: ' + e, null);
        }
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=schedule.js.map