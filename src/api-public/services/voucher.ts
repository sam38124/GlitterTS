import { Shopping } from './shopping.js';
import db from '../../modules/database.js';
import exception from '../../modules/exception.js';
import { IToken } from '../models/Auth.js';

export class Voucher {
    public app: string;
    public token: IToken;

    constructor(app_name: string, token: IToken) {
        this.app = app_name;
        this.token = token;
    }

    public async putVoucher(content: any) {
        try {
            const reContent = JSON.parse(content.content);
            if (reContent.type === 'product') {
                await new Shopping(this.app, this.token).postVariantsAndPriceValue(reContent);
                content.content = JSON.stringify(reContent);
            }
            content.updated_time = new Date();
            const data = await db.query(
                `update \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 where 1 = 1
                   and id = ${reContent.id}`,
                [content],
            );
            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PutVoucher Error:' + e, null);
        }
    }
}