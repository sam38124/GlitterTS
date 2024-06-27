import moment from 'moment';
import db from '../../modules/database';
import exception from '../../modules/exception';
import { Rebate } from './rebate';
import { User } from './user';

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

    example(sec: number) {
        try {
            console.log(`${this.app} 排程範例`);
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Example Error: ' + e, null);
        }
        setTimeout(() => this.example(sec), sec * 1000);
    }

    async birthRebate(sec: number) {
        try {
            const rebateClass = new Rebate(this.app);
            const userClass = new User(this.app);

            if (await rebateClass.mainStatus()) {
                const getRS = await userClass.getConfig({ key: 'rebate_setting', user_id: 'manager' });
                const rgs = getRS[0] && getRS[0].value.birth ? getRS[0].value.birth : {};
                if (rgs && rgs.switch) {
                    async function postUserRebate(id: number, value: number) {
                        const used = await rebateClass.canUseRebate(id, 'birth');
                        console.log(id, used);
                        if (used?.result) {
                            await rebateClass.insertRebate(id, value, '生日禮', {
                                type: 'birth',
                                deadTime: rgs.unlimited ? undefined : moment().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
                            });
                        }
                    }

                    const users = await db.query(
                        `SELECT * FROM \`${this.app}\`.t_user 
                            WHERE MONTH(JSON_EXTRACT(userData, '$.birth')) = MONTH(CURDATE());`,
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
                            console.log(user.userID, level);
                            if (!level) continue;
                            const data = rgs.level.find((item: { id: string }) => item.id === level.id);
                            if (!data) continue;
                            await postUserRebate(user.userID, data.value);
                        }
                    }
                }
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'birthRebate Error: ' + e, null);
        }
        setTimeout(() => this.birthRebate(sec), sec * 1000);
    }

    async isDatabaseExists() {
        return (await db.query(`SHOW DATABASES LIKE \'${this.app}\';`, [])).length > 0;
    }

    async isDatabasePass() {
        const SQL = `
            SELECT * FROM glitter.app_config
            WHERE appName = \'${this.app}\' AND (refer_app is null OR refer_app = appName);
        `;
        return (await db.query(SQL, [])).length > 0;
    }

    async isTableExists(table: string) {
        return (await db.query(`SHOW TABLES IN \`${this.app}\` LIKE \'${table}\';`, [])).length > 0;
    }

    async main() {
        if (!(await this.isDatabaseExists())) return;
        if (!(await this.isDatabasePass())) return;
        if (!(await this.isTableExists('t_user_public_config'))) return;

        const scheduleList: ScheduleItem[] = [
            { second: 10, status: false, func: 'example', desc: '排程1啟用的方法' },
            { second: 15, status: true, func: 'birthRebate', desc: '生日禮發放購物金' },
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
