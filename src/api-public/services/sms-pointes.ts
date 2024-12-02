import FinancialService from "./financial-service.js";
import {Private_config} from "../../services/private_config.js";
import {IToken} from "../models/Auth.js";
import exception from "../../modules/exception.js";
import db from "../../modules/database.js";
import redis from "../../modules/redis.js";
import Tool from "../../modules/tool.js";
import {Invoice} from "./invoice.js";

export class SmsPoints {
    public app

    public token: IToken

    constructor(app: string, token: IToken) {
        this.app = app
        this.token = token
    }

    public async store(cf: {
        return_url: string,
        total: number,
        note: any,
        method?:string
    }) {
        const id='redirect_'+Tool.randomString(6)
        await redis.setValue(id,cf.return_url)
        const keyData = ((await Private_config.getConfig({
            appName: this.app, key: 'glitter_finance'
        }))[0].value);
        const kd=keyData[keyData.TYPE]
        return {
            form: (await (new FinancialService(this.app, {
                "HASH_IV": kd.HASH_IV,
                "HASH_KEY": kd.HASH_KEY,
                "ActionURL": kd.ActionURL,
                "NotifyURL": `${process.env.DOMAIN}/api-public/v1/sms/points/notify?g-app=${this.app}&type=${keyData.TYPE}`,
                "ReturnURL": `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${keyData.TYPE}`,
                "MERCHANT_ID": kd.MERCHANT_ID,
                TYPE:keyData.TYPE
            }).saveWallet({
                total: cf.total,
                userID: this.token.userID!,
                note: cf.note,
                method:cf.method || '',
                table:'t_sms_points',
                title:'SMS Points加值',ratio:10
            })))
        }
    }

    public async withdraw(cf: {
        money: number,
        note: any
    }) {
        try {
            const sum = (await db.query(`SELECT sum(money)
                                         FROM \`${this.app}\`.t_wallet
                                         where status in (1, 2)
                                           and userID = ?`, [this.token.userID]))[0]['sum(money)'] || 0
            if (sum < cf.money) {
                throw exception.BadRequestError('NO_MONEY', "No money.", null);
            } else {
                await db.query(`insert into \`${this.app}\`.t_withdraw (userID, money, status, note)
                                values (?, ?, ?, ?)`, [
                    `${this.token.userID}`,
                    cf.money,
                    0,
                    JSON.stringify(cf.note)
                ])
            }
        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }

    public async putWithdraw(cf: {
        id: number,
        status: number,
        note: any
    }) {
        try {
            const data = (await db.query(`select *
                                          from \`${this.app}\`.t_withdraw
                                          where id = ${cf.id};`, []))[0]
            if (['1', '-2'].indexOf(`${data.status}`) !== -1) {
                throw exception.BadRequestError('BAD_REQUEST', "Already use.", null);
            } else {
                const sum = (await db.query(`SELECT sum(money)
                                             FROM \`${this.app}\`.t_wallet
                                             where status in (1, 2)
                                               and userID = ?`, [data.userID]))[0]['sum(money)'] || 0
                if (sum < data.money) {
                    throw exception.BadRequestError('NO_MONEY', "No money.", null);
                } else {
                    const trans = await db.Transaction.build();
                    if (`${cf.status}` === '1') {
                        await trans.execute(`insert into \`${this.app}\`.t_wallet (orderID, userID, money, status, note)
                                             values (?, ?, ?, ?, ?)`, [
                            new Date().getTime(),
                            data.userID,
                            data.money * -1,
                            2,
                            JSON.stringify("用戶提款")
                        ]);
                    }
                    console.log(`update \`${this.app}\`.t_withdraw
                                 set status=1
                                 where id = ${cf.id}`)
                    await trans.execute(`update \`${this.app}\`.t_withdraw
                                         set status=${cf.status},
                                             note=?
                                         where id = ?`, [JSON.stringify(cf.note), cf.id])
                    await trans.commit()
                    await trans.release()
                }

            }
        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }

    public async delete(cf: {
        id: string
    }) {
        try {
            await db.query(`update \`${this.app}\`.t_wallet
                            set status= -2
                            where id in (?)`, [cf.id.split(',')])
        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }

    public async deleteWithDraw(cf: {
        id: string
    }) {
        try {
            await db.query(`update \`${this.app}\`.t_withdraw
                            set status= -2
                            where id in (?)`, [cf.id.split(',')])
        } catch (e: any) {
            throw exception.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
}