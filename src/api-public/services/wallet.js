"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const newebpay_js_1 = __importDefault(require("./newebpay.js"));
const private_config_js_1 = require("../../services/private_config.js");
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
class Wallet {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async store(cf) {
        const keyData = (await private_config_js_1.Private_config.getConfig({
            appName: this.app, key: 'glitter_finance'
        }))[0].value;
        const subMitData = await (new newebpay_js_1.default(this.app, {
            "HASH_IV": keyData.HASH_IV,
            "HASH_KEY": keyData.HASH_KEY,
            "ActionURL": keyData.ActionURL,
            "NotifyURL": `${process.env.DOMAIN}/api-public/v1/wallet/notify?g-app=${this.app}`,
            "ReturnURL": `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${cf.return_url}`,
            "MERCHANT_ID": keyData.MERCHANT_ID,
        }).saveMoney({
            total: cf.total,
            userID: this.token.userID,
            note: cf.note
        }));
        return {
            form: `<form name="Newebpay" action="${subMitData.actionURL}" method="POST" class="payment">
                            <input type="hidden" name="MerchantID" value="${subMitData.MerchantID}" />
                            <input type="hidden" name="TradeInfo" value="${subMitData.TradeInfo}" />
                            <input type="hidden" name="TradeSha" value="${subMitData.TradeSha}" />
                            <input type="hidden" name="Version" value="${subMitData.Version}" />
                            <input type="hidden" name="MerchantOrderNo" value="${subMitData.MerchantOrderNo}" />
                            <button
                                type="submit"
                                class="btn btn-secondary custom-btn beside-btn"
                                id="submit"
                                hidden
                            ></button>
                        </form>`
        };
    }
    async withdraw(cf) {
        try {
            const sum = (await database_js_1.default.query(`SELECT sum(money)
                                         FROM \`${this.app}\`.t_wallet
                                         where status in (1, 2)
                                           and userID = ?`, [this.token.userID]))[0]['sum(money)'] || 0;
            if (sum < cf.money) {
                throw exception_js_1.default.BadRequestError('NO_MONEY', "No money.", null);
            }
            else {
                await database_js_1.default.query(`insert into \`${this.app}\`.t_withdraw (userID, money, status, note)
                                values (?, ?, ?, ?)`, [
                    `${this.token.userID}`,
                    cf.money,
                    0,
                    JSON.stringify(cf.note)
                ]);
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
    async putWithdraw(cf) {
        try {
            const data = (await database_js_1.default.query(`select *
                                          from \`${this.app}\`.t_withdraw
                                          where id = ${cf.id};`, []))[0];
            if (['1', '-2'].indexOf(`${data.status}`) !== -1) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', "Already use.", null);
            }
            else {
                const sum = (await database_js_1.default.query(`SELECT sum(money)
                                             FROM \`${this.app}\`.t_wallet
                                             where status in (1, 2)
                                               and userID = ?`, [data.userID]))[0]['sum(money)'] || 0;
                if (sum < data.money) {
                    throw exception_js_1.default.BadRequestError('NO_MONEY', "No money.", null);
                }
                else {
                    const trans = await database_js_1.default.Transaction.build();
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
                                 where id = ${cf.id}`);
                    await trans.execute(`update \`${this.app}\`.t_withdraw
                                         set status=${cf.status},
                                             note=?
                                         where id = ?`, [JSON.stringify(cf.note), cf.id]);
                    await trans.commit();
                    await trans.release();
                }
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
    async delete(cf) {
        try {
            await database_js_1.default.query(`update \`${this.app}\`.t_wallet
                            set status= -2
                            where id in (?)`, [cf.id.split(',')]);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
    async deleteWithDraw(cf) {
        try {
            await database_js_1.default.query(`update \`${this.app}\`.t_withdraw
                            set status= -2
                            where id in (?)`, [cf.id.split(',')]);
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.js.map