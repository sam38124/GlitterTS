"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const axios_1 = __importDefault(require("axios"));
const rebate_1 = require("./rebate");
const user_1 = require("./user");
const shopping_1 = require("./shopping");
const mail_js_1 = require("../services/mail.js");
const auto_send_email_js_1 = require("./auto-send-email.js");
const config_1 = require("../../config");
const initial_fake_data_js_1 = require("./initial-fake-data.js");
const line_message_1 = require("./line-message");
class Schedule {
    async perload(app) {
        if (!(await this.isDatabasePass(app)))
            return false;
        if (!(await this.isDatabaseExists(app)))
            return false;
        if (!(await this.isTableExists('t_user_public_config', app)))
            return false;
        if (!(await this.isTableExists('t_voucher_history', app)))
            return false;
        if (!(await this.isTableExists('t_triggers', app)))
            return false;
        return true;
    }
    async isDatabaseExists(app) {
        return (await database_1.default.query(`SHOW DATABASES LIKE \'${app}\';`, [])).length > 0;
    }
    async isDatabasePass(app) {
        const SQL = `
            SELECT *
            FROM ${config_1.saasConfig.SAAS_NAME}.app_config
            WHERE appName = \'${app}\'
              AND (refer_app is null OR refer_app = appName);
        `;
        return (await database_1.default.query(SQL, [])).length > 0;
    }
    async isTableExists(table, app) {
        return (await database_1.default.query(`SHOW TABLES IN \`${app}\` LIKE \'${table}\';`, [])).length > 0;
    }
    async example(sec) {
        try {
            for (const app of Schedule.app) {
                if (await this.perload(app)) {
                }
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Example Error: ' + e, null);
        }
        setTimeout(() => this.example(sec), sec * 1000);
    }
    async autoCancelOrder(sec) {
        try {
            console.log('===== TEST autoCancelOrder ======');
            for (const app of Schedule.app) {
                if (app !== 't_1725992531001') {
                    continue;
                }
                if (await this.perload(app)) {
                    const config = await new user_1.User(app).getConfigV2({ key: 'login_config', user_id: 'manager' });
                    if ((config === null || config === void 0 ? void 0 : config.auto_cancel_order_timer) && config.auto_cancel_order_timer > 0) {
                        const orders = await database_1.default.query(`SELECT * FROM \`${app}\`.t_checkout
                                WHERE 
                                    status = 0 
                                    AND created_time < NOW() - INTERVAL ${config.auto_cancel_order_timer} HOUR
                                    AND (orderData->>'$.proof_purchase' IS NULL)
                                    AND (orderData->>'$.orderStatus' = 0 OR orderData->>'$.orderStatus' IS NULL)
                                    AND (orderData->>'$.progress' = 'wait' OR orderData->>'$.progress' IS NULL)
                                    AND (orderData->>'$.customer_info.payment_select' <> 'cash_on_delivery')
                                ORDER BY id DESC;`, []);
                        await Promise.all(orders.map(async (order) => {
                            console.log([app, config.auto_cancel_order_timer, order.cart_token]);
                            order.orderData.orderStatus = '-1';
                            order.orderData.archived = 'true';
                            return database_1.default.query(`UPDATE \`${app}\`.t_checkout SET orderData = ? WHERE cart_token = ?
                                    `, [JSON.stringify(order.orderData), order.cart_token]);
                        }));
                    }
                }
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Example Error: ' + e, null);
        }
        setTimeout(() => this.autoCancelOrder(sec), sec * 1000);
    }
    async renewMemberLevel(sec) {
        try {
            for (const app of Schedule.app) {
                if (await this.perload(app)) {
                    const users = await database_1.default.query(`select * from \`${app}\`.t_user  `, []);
                    for (const user of users) {
                        await new user_1.User(app).checkMember(user, true);
                    }
                }
            }
        }
        catch (e) {
            console.error('BAD_REQUEST', 'renewMemberLevel Error: ' + e, null);
        }
        setTimeout(() => this.renewMemberLevel(sec), sec * 1000);
    }
    async birthRebate(sec) {
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const rebateClass = new rebate_1.Rebate(app);
                    const userClass = new user_1.User(app);
                    if (await rebateClass.mainStatus()) {
                        const getRS = await userClass.getConfig({ key: 'rebate_setting', user_id: 'manager' });
                        const rgs = getRS[0] && getRS[0].value.birth ? getRS[0].value.birth : {};
                        if (rgs && rgs.switch) {
                            async function postUserRebate(id, value) {
                                const used = await rebateClass.canUseRebate(id, 'birth');
                                if (used === null || used === void 0 ? void 0 : used.result) {
                                    if (value !== 0) {
                                        await rebateClass.insertRebate(id, value, '生日禮', {
                                            type: 'birth',
                                            deadTime: rgs.unlimited ? undefined : (0, moment_1.default)().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
                                        });
                                    }
                                }
                            }
                            const users = await database_1.default.query(`SELECT *
                             FROM \`${app}\`.t_user
                             WHERE MONTH (JSON_EXTRACT(userData, '$.birth')) = MONTH (CURDATE());`, []);
                            if (rgs.type === 'base') {
                                for (const user of users) {
                                    await postUserRebate(user.userID, rgs.value);
                                }
                            }
                            const levelData = await userClass.getConfigV2({ key: 'member_level_config', user_id: 'manager' });
                            levelData.levels = levelData.levels || [];
                            if (rgs.type === 'levels') {
                                const usersLevel = await userClass.getUserLevel(users.map((item) => {
                                    return { userId: item.userID };
                                }));
                                for (const user of users) {
                                    const member = usersLevel.find((item) => item.id == user.userID);
                                    if (member && member.data.id === '') {
                                        continue;
                                    }
                                    const data = rgs.level.find((item) => item.id == (member === null || member === void 0 ? void 0 : member.data.id));
                                    if (!data) {
                                        continue;
                                    }
                                    await postUserRebate(user.userID, data.value);
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.error('BAD_REQUEST', 'birthRebate Error: ' + e, null);
            }
        }
        setTimeout(() => this.birthRebate(sec), sec * 1000);
    }
    async birthBlessMail(sec) {
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const mailType = 'auto-email-birthday';
                    const customerMail = await auto_send_email_js_1.AutoSendEmail.getDefCompare(app, mailType, 'zh-TW');
                    if (customerMail.toggle) {
                        const mailClass = new mail_js_1.Mail(app);
                        const sendRecords = await mailClass.getMail({
                            type: 'download',
                            page: 0,
                            limit: 0,
                            mailType: mailType,
                        });
                        const users = await database_1.default.query(`SELECT *
                            FROM \`${app}\`.t_user
                            WHERE MONTH (JSON_EXTRACT(userData, '$.birth')) = MONTH (CURDATE());`, []);
                        const now = new Date();
                        const oneYearAgo = new Date(now);
                        oneYearAgo.setFullYear(now.getFullYear() - 1);
                        const filteredData = sendRecords.data.filter((item) => {
                            const triggerTime = new Date(item.trigger_time);
                            return triggerTime > oneYearAgo;
                        });
                        let hasBless = [];
                        filteredData.map((item) => {
                            hasBless = hasBless.concat(item.content.email);
                        });
                        hasBless = [...new Set(hasBless)];
                        for (const user of users) {
                            if (!hasBless.includes(user.userData.email)) {
                                await mailClass.postMail({
                                    name: customerMail.name,
                                    title: customerMail.title.replace(/@\{\{user_name\}\}/g, user.userData.name),
                                    content: customerMail.content.replace(/@\{\{user_name\}\}/g, user.userData.name),
                                    email: [user.userData.email],
                                    type: mailType,
                                });
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.error('BAD_REQUEST', 'birthBlessMail Error: ' + e, null);
            }
        }
        setTimeout(() => this.birthBlessMail(sec), sec * 1000);
    }
    async resetVoucherHistory(sec) {
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    await new shopping_1.Shopping(app).resetVoucherHistory();
                }
            }
            catch (e) {
                console.error('BAD_REQUEST', 'resetVoucherHistory Error: ' + e, null);
            }
        }
        setTimeout(() => this.resetVoucherHistory(sec), sec * 1000);
    }
    async autoSendMail(sec) {
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const emails = await database_1.default.query(`SELECT * FROM \`${app}\`.t_triggers
                     WHERE 
                        tag = 'sendMailBySchedule' AND 
                        status = 0 AND
                        DATE_FORMAT(trigger_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i');`, []);
                    for (const email of emails) {
                        if (email.status === 0) {
                            new mail_js_1.Mail(app).chunkSendMail(email.content, email.id);
                        }
                    }
                }
            }
            catch (e) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'autoSendMail Error: ' + e, null);
            }
        }
        setTimeout(() => this.autoSendMail(sec), sec * 1000);
    }
    async autoSendLine(sec) {
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const emails = await database_1.default.query(`SELECT * FROM \`${app}\`.t_triggers
                     WHERE 
                        tag = 'sendLineBySchedule' AND 
                        DATE_FORMAT(trigger_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i');`, []);
                    for (const email of emails) {
                        if (email.status === 0) {
                            new line_message_1.LineMessage(app).chunkSendLine(email.userList, {
                                data: {
                                    text: email.content,
                                },
                            }, email.id);
                        }
                    }
                }
            }
            catch (e) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'autoSendLine Error: ' + e, null);
            }
        }
        setTimeout(() => this.autoSendLine(sec), sec * 1000);
    }
    async initialSampleApp(sec) {
        await new initial_fake_data_js_1.InitialFakeData(`t_1725992531001`).run();
        setTimeout(() => this.initialSampleApp(sec), sec * 1000);
    }
    async currenciesUpdate(sec) {
        const date = new Date();
        const date_index = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        if ((await database_1.default.query(`select count(1) from \`${config_1.saasConfig.SAAS_NAME}\`.currency_config where updated='${date_index}'`, []))[0]['count(1)'] === 0) {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://data.fixer.io/api/latest?access_key=0ced797dd1cc136b22d6cfee7e2d6476',
                headers: {},
            };
            axios_1.default
                .request(config)
                .then(async (response) => {
                await database_1.default.query(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.currency_config (\`json\`,updated) values (?,?)`, [JSON.stringify(response.data), date_index]);
                setTimeout(() => this.currenciesUpdate(sec), sec * 1000);
            })
                .catch((error) => {
                console.error(error);
                setTimeout(() => this.currenciesUpdate(sec), sec * 1000);
            });
        }
        else {
            setTimeout(() => this.currenciesUpdate(sec), sec * 1000);
        }
    }
    main() {
        const scheduleList = [
            { second: 5, status: true, func: 'autoCancelOrder', desc: '自動取消未付款未出貨訂單' },
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
Schedule.app = [];
//# sourceMappingURL=schedule.js.map