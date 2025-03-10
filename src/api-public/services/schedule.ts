import moment from 'moment';
import db from '../../modules/database';
import exception from '../../modules/exception';
import axios from 'axios';
import { Rebate } from './rebate';
import { User } from './user';
import { Shopping } from './shopping';
import { Mail } from '../services/mail.js';
import { AutoSendEmail } from './auto-send-email.js';
import { saasConfig } from '../../config';
import { InitialFakeData } from './initial-fake-data.js';
import { LineMessage } from './line-message';
import { ApiPublic } from './public-table-check.js';

type ScheduleItem = {
    second: number;
    status: boolean;
    func: keyof Schedule;
    desc: string;
};

export class Schedule {
    static app: string[] = [];

    async perload(app: string) {
        if (!(await this.isDatabasePass(app))) return false;
        await ApiPublic.createScheme(app);
        return true;
    }

    async isDatabaseExists(app: string) {
        return (await db.query(`SHOW DATABASES LIKE \'${app}\';`, [])).length > 0;
    }

    async isDatabasePass(app: string) {
        const SQL = `
            SELECT *
            FROM ${saasConfig.SAAS_NAME}.app_config
            WHERE appName = \'${app}\'
              AND (refer_app is null OR refer_app = appName);
        `;
        return (await db.query(SQL, [])).length > 0;
    }

    async isTableExists(table: string, app: string) {
        return (await db.query(`SHOW TABLES IN \`${app}\` LIKE \'${table}\';`, [])).length > 0;
    }

    async example(sec: number) {
        try {
            for (const app of Schedule.app) {
                if (await this.perload(app)) {
                    // 排程範例
                    // await
                }
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Example Error: ' + e, null);
        }
        setTimeout(() => this.example(sec), sec * 1000);
    }

    async autoCancelOrder(sec: number) {
        let clock=new Date()
        console.log(`autoCancelOrder`)
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const config = await new User(app).getConfigV2({ key: 'login_config', user_id: 'manager' });
                    if (config?.auto_cancel_order_timer && config.auto_cancel_order_timer > 0) {
                        const orders = await db.query(
                          `SELECT * FROM \`${app}\`.t_checkout
                                WHERE 
                                    status = 0 
                                    AND created_time < NOW() - INTERVAL ${config.auto_cancel_order_timer} HOUR
                                    AND (orderData->>'$.proof_purchase' IS NULL)
                                    AND (orderData->>'$.orderStatus' = 0 OR orderData->>'$.orderStatus' IS NULL)
                                    AND (orderData->>'$.progress' = 'wait' OR orderData->>'$.progress' IS NULL)
                                    AND (orderData->>'$.customer_info.payment_select' <> 'cash_on_delivery')
                                ORDER BY id DESC;`,
                          []
                        );
                        await Promise.all(
                          orders.map(async (order: any) => {
                              order.orderData.orderStatus = '-1';
                              order.orderData.archived = 'true';
                              return new Shopping(app).putOrder({
                                  id: order.id,
                                  orderData: order.orderData,
                                  status: '0',
                              });
                          })
                        );
                    }
                }
            } catch (e) {
                console.error(`autoCancelOrder-Error`,e)
            }
        }
        setTimeout(() => this.autoCancelOrder(sec), sec * 1000);
        console.log(`autoCancelOrder-Stop`,(new Date().getTime() - clock.getTime())/1000)
    }

    async renewMemberLevel(sec: number) {
        let clock=new Date()
        console.log(`renewMemberLevel`)
        try {
            for (const app of Schedule.app) {
                try {
                    if (await this.perload(app)) {
                        const users = await db.query(`select * from \`${app}\`.t_user  `, []);
                        for (const user of users) {
                            await new User(app).checkMember(user, true);
                        }
                    }
                    console.log(`renewMemberLevel-finish->`,app)
                }catch (e) {
                    console.log(`renewMemberLevel-error-continue`)
                }
            }
        } catch (e) {
            console.error('BAD_REQUEST', 'renewMemberLevel Error: ' + e, null);
        }
        setTimeout(() => this.renewMemberLevel(sec), sec * 1000);
        console.log(`renewMemberLevel-Stop`,(new Date().getTime() - clock.getTime())/1000)
    }

    async birthRebate(sec: number) {
        let clock=new Date()
        console.log(`resetVoucherHistory`)
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const rebateClass = new Rebate(app);
                    const userClass = new User(app);

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
                             FROM \`${app}\`.t_user
                             WHERE MONTH (JSON_EXTRACT(userData, '$.birth')) = MONTH (CURDATE());`,
                                []
                            );

                            if (rgs.type === 'base') {
                                for (const user of users) {
                                    await postUserRebate(user.userID, rgs.value);
                                }
                            }

                            const levelData = await userClass.getConfigV2({ key: 'member_level_config', user_id: 'manager' });
                            levelData.levels = levelData.levels || [];

                            if (rgs.type === 'levels') {
                                const usersLevel = await userClass.getUserLevel(
                                    users.map((item: { userID: number }) => {
                                        return { userId: item.userID };
                                    })
                                );
                                for (const user of users) {
                                    const member = usersLevel.find((item) => item.id == user.userID);
                                    if (member && member.data.id === '') {
                                        continue;
                                    }
                                    const data = rgs.level.find((item: { id: string }) => item.id == member?.data.id);
                                    if (!data) {
                                        continue;
                                    }
                                    await postUserRebate(user.userID, data.value);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('BAD_REQUEST', 'birthRebate Error: ' + e, null);
            }
        }

        setTimeout(() => this.birthRebate(sec), sec * 1000);
        console.log(`birthRebate-Stop`,(new Date().getTime() - clock.getTime())/1000)
    }

    async birthBlessMail(sec: number) {
        let clock=new Date()
        console.log(`resetVoucherHistory`)
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const mailType = 'auto-email-birthday';
                    const customerMail = await AutoSendEmail.getDefCompare(app, mailType, 'zh-TW');
                    if (customerMail.toggle) {
                        // 歷史生日祝福寄件紀錄
                        const mailClass = new Mail(app);
                        const sendRecords = await mailClass.getMail({
                            type: 'download',
                            page: 0,
                            limit: 0,
                            mailType: mailType,
                        });

                        // 當月生日之顧客
                        const users = await db.query(
                            `SELECT *
                            FROM \`${app}\`.t_user
                            WHERE MONTH (JSON_EXTRACT(userData, '$.birth')) = MONTH (CURDATE());`,
                            []
                        );

                        // 篩選出一年內曾寄信過的顧客
                        const now = new Date();
                        const oneYearAgo = new Date(now);
                        oneYearAgo.setFullYear(now.getFullYear() - 1);
                        const filteredData = sendRecords.data.filter((item: { trigger_time: string }) => {
                            const triggerTime = new Date(item.trigger_time);
                            return triggerTime > oneYearAgo;
                        });

                        // 一年內曾寄信過的顧客信箱陣列
                        let hasBless: string[] = [];
                        filteredData.map((item: { content: { email: string } }) => {
                            hasBless = hasBless.concat(item.content.email);
                        });
                        hasBless = [...new Set(hasBless)];

                        // 進入寄信程序
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
            } catch (e) {
                console.error('BAD_REQUEST', 'birthBlessMail Error: ' + e, null);
            }
        }

        setTimeout(() => this.birthBlessMail(sec), sec * 1000);
        console.log(`birthBlessMail-Stop`,(new Date().getTime() - clock.getTime())/1000)
    }

    async resetVoucherHistory(sec: number) {
        let clock=new Date()
        console.log(`resetVoucherHistory`)
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    await new Shopping(app).resetVoucherHistory();
                }
            } catch (e) {
                console.error('BAD_REQUEST', 'resetVoucherHistory Error: ' + e, null);
            }
        }
        setTimeout(() => this.resetVoucherHistory(sec), sec * 1000);
        console.log(`resetVoucherHistory-Stop`,(new Date().getTime() - clock.getTime())/1000)
    }

    async autoSendMail(sec: number) {
        let clock=new Date()
        console.log(`autoSendLine`)
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const emails = await db.query(
                        `SELECT * FROM \`${app}\`.t_triggers
                     WHERE 
                        tag = 'sendMailBySchedule' AND 
                        status = 0 AND
                        DATE_FORMAT(trigger_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i');`,
                        []
                    );
                    for (const email of emails) {
                        if (email.status === 0) {
                            new Mail(app).chunkSendMail(email.content, email.id);
                        }
                    }
                }
            } catch (e) {
                console.error('BAD_REQUEST', 'autoSendMail Error: ' + e, null);
            }
        }
        setTimeout(() => this.autoSendMail(sec), sec * 1000);
        console.log(`autoSendMail-Stop`,(new Date().getTime() - clock.getTime())/1000)
    }

    async autoSendLine(sec: number) {
        let clock=new Date()
        console.log(`autoSendLine`)
        for (const app of Schedule.app) {
            try {
                if (await this.perload(app)) {
                    const emails = await db.query(
                        `SELECT * FROM \`${app}\`.t_triggers
                     WHERE 
                        tag = 'sendLineBySchedule' AND 
                        DATE_FORMAT(trigger_time, '%Y-%m-%d %H:%i') = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i');`,
                        []
                    );

                    for (const email of emails) {
                        if (email.status === 0) {
                            new LineMessage(app).chunkSendLine(
                                email.userList,
                                {
                                    data: {
                                        text: email.content,
                                    },
                                },
                                email.id
                            );
                        }
                    }
                }
            } catch (e) {
                console.error('BAD_REQUEST', 'autoSendLine Error: ' + e, null);
            }
        }

        setTimeout(() => this.autoSendLine(sec), sec * 1000);
        console.log(`autoSendLine-Stop`,(new Date().getTime() - clock.getTime())/1000)
    }

    async initialSampleApp(sec: number) {
        await new InitialFakeData(`t_1725992531001`).run();
        setTimeout(() => this.initialSampleApp(sec), sec * 1000);
    }

    async currenciesUpdate(sec: number) {
        const date = new Date();
        const date_index = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        let clock=new Date()
        console.log(`currenciesUpdate-Start`)
        if ((await db.query(`select count(1) from \`${saasConfig.SAAS_NAME}\`.currency_config where updated='${date_index}'`, []))[0]['count(1)'] === 0) {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://data.fixer.io/api/latest?access_key=0ced797dd1cc136b22d6cfee7e2d6476',
                headers: {},
            };

            axios
                .request(config)
                .then(async (response: any) => {
                    await db.query(`insert into \`${saasConfig.SAAS_NAME}\`.currency_config (\`json\`,updated) values (?,?)`, [JSON.stringify(response.data), date_index]);
                    setTimeout(() => this.currenciesUpdate(sec), sec * 1000);
                })
                .catch((error: any) => {
                    console.error(error);
                    setTimeout(() => this.currenciesUpdate(sec), sec * 1000);
                });
        } else {
            setTimeout(() => this.currenciesUpdate(sec), sec * 1000);
            console.log(`currenciesUpdate-Stop`,(new Date().getTime() - clock.getTime())/1000)
        }
    }

    main() {
        const scheduleList: ScheduleItem[] = [
            // { second: 10, status: false, func: 'example', desc: '排程啟用範例' },
            { second: 3600, status: true, func: 'birthRebate', desc: '生日禮發放購物金' },
            { second: 3600, status: true, func: 'birthBlessMail', desc: '生日祝福信件' },
            { second: 600, status: true, func: 'renewMemberLevel', desc: '更新會員分級' },
            { second: 30, status: true, func: 'resetVoucherHistory', desc: '未付款歷史優惠券重設' },
            { second: 30, status: true, func: 'autoSendMail', desc: '自動排程寄送信件' },
            { second: 30, status: true, func: 'autoSendLine', desc: '自動排程寄送line訊息' },
            { second: 3600 * 24, status: true, func: 'currenciesUpdate', desc: '多國貨幣的更新排程' },
            { second: 3600 * 24, status: false, func: 'initialSampleApp', desc: '重新刷新示範商店' },
            { second: 30, status: true, func: 'autoCancelOrder', desc: '自動取消未付款未出貨訂單' },
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
