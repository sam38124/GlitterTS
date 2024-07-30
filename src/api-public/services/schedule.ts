import moment from 'moment';
import db from '../../modules/database';
import exception from '../../modules/exception';
import { Rebate } from './rebate';
import { User } from './user';
import { Shopping } from './shopping';
import { Mail } from '../services/mail.js';

type ScheduleItem = {
    second: number;
    status: boolean;
    func: keyof Schedule;
    desc: string;
};

export class Schedule {
    app: string;

    constructor(app: string) {
        this.app = app;
    }

    async perload() {
        if (!(await this.isDatabasePass())) return false;
        if (!(await this.isDatabaseExists())) return false;
        if (!(await this.isTableExists('t_user_public_config'))) return false;
        if (!(await this.isTableExists('t_voucher_history'))) return false;
        if (!(await this.isTableExists('t_triggers'))) return false;
        return true;
    }

    async isDatabaseExists() {
        return (await db.query(`SHOW DATABASES LIKE \'${this.app}\';`, [])).length > 0;
    }

    async isDatabasePass() {
        const SQL = `
            SELECT *
            FROM glitter.app_config
            WHERE appName = \'${this.app}\'
              AND (refer_app is null OR refer_app = appName);
        `;
        return (await db.query(SQL, [])).length > 0;
    }

    async isTableExists(table: string) {
        return (await db.query(`SHOW TABLES IN \`${this.app}\` LIKE \'${table}\';`, [])).length > 0;
    }

    async refreshMember(sec: number) {
        try {
            console.log(this.app, 'refreshMember');
            if (await this.perload()) {
                const userClass = new User(this.app);
                //紀錄當前分級會員的數量
                const member_count: any = {};
                for (const user of await db.query(
                    `select *
                                                    from \`${this.app}\`.t_user`,
                    []
                )) {
                    const member_levels = (await userClass.refreshMember(user)).find((dd: any) => {
                        return dd.trigger;
                    });
                    if (member_levels) {
                        member_count[member_levels.id] = member_count[member_levels.id] || 0;
                        member_count[member_levels.id]++;
                    }
                }
                await userClass.setConfig({
                    key: 'member_levels_count_list',
                    value: member_count,
                    user_id: 'manager',
                });
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'refreshMember Error: ' + e, null);
        }
        setTimeout(() => this.refreshMember(sec), sec * 1000);
    }

    async example(sec: number) {
        try {
            if (await this.perload()) {
                // 排程範例
                // await
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Example Error: ' + e, null);
        }
        setTimeout(() => this.example(sec), sec * 1000);
    }

    async birthRebate(sec: number) {
        try {
            if (await this.perload()) {
                const rebateClass = new Rebate(this.app);
                const userClass = new User(this.app);

                if (await rebateClass.mainStatus()) {
                    const getRS = await userClass.getConfig({ key: 'rebate_setting', user_id: 'manager' });
                    const rgs = getRS[0] && getRS[0].value.birth ? getRS[0].value.birth : {};
                    if (rgs && rgs.switch) {
                        async function postUserRebate(id: number, value: number) {
                            const used = await rebateClass.canUseRebate(id, 'birth');
                            if (used?.result) {
                                if (value !== 0) {
                                    await rebateClass.insertRebate(id, value, '生日禮', {
                                        type: 'birth',
                                        deadTime: rgs.unlimited ? undefined : moment().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
                                    });
                                }
                            }
                        }

                        const users = await db.query(
                            `SELECT *
                             FROM \`${this.app}\`.t_user
                             WHERE MONTH (JSON_EXTRACT(userData, '$.birth')) = MONTH (CURDATE());`,
                            []
                        );

                        if (rgs.type === 'base') {
                            for (const user of users) {
                                await postUserRebate(user.userID, rgs.value);
                            }
                        }

                        if (rgs.type === 'levels') {
                            for (const user of users) {
                                const member = await userClass.refreshMember(user);
                                const level = member.find((dd: any) => dd.trigger);
                                if (!level) continue;
                                const data = rgs.level.find((item: { id: string }) => item.id === level.id);
                                if (!data) continue;
                                await postUserRebate(user.userID, data.value);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'birthRebate Error: ' + e, null);
        }
        setTimeout(() => this.birthRebate(sec), sec * 1000);
    }

    async resetVoucherHistory(sec: number) {
        try {
            if (await this.perload()) {
                await new Shopping(this.app).resetVoucherHistory();
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'resetVoucherHistory Error: ' + e, null);
        }
        setTimeout(() => this.resetVoucherHistory(sec), sec * 1000);
    }

    async autoSendMail(sec: number) {
        try {
            if (await this.perload()) {
                const emails = await db.query(
                    `SELECT * FROM \`${this.app}\`.t_triggers
                     WHERE 
                        tag = 'sendMailBySchedule' AND 
                        DATE_FORMAT(trigger_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i');`,
                    []
                );
                for (const email of emails) {
                    if (email.status === 0) {
                        new Mail(this.app).chunkSendMail(email.content, email.id);
                    }
                }
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'autoSendMail Error: ' + e, null);
        }
        setTimeout(() => this.autoSendMail(sec), sec * 1000);
    }

    async main() {
        const scheduleList: ScheduleItem[] = [
            { second: 10, status: false, func: 'example', desc: '排程啟用範例' },
            { second: 3600, status: true, func: 'birthRebate', desc: '生日禮發放購物金' },
            { second: 600, status: true, func: 'refreshMember', desc: '更新會員分級' },
            { second: 30, status: true, func: 'resetVoucherHistory', desc: '未付款歷史優惠券重設' },
            { second: 30, status: true, func: 'autoSendMail', desc: '自動排程寄送信件' },
        ];

        try {
            scheduleList.forEach((schedule) => {
                if (schedule.status && typeof this[schedule.func] === 'function') {
                    (this[schedule.func] as (sec: number) => void)(schedule.second);
                }
            });
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Init Schedule Error: ' + e, null);
        }
    }
}
