import db from '../../modules/database';
import exception from '../../modules/exception';
import { IToken } from '../models/Auth.js';

export class Recommend {
    public app: string;

    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async getList() {
        try {
            const links = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links;
            `,
                []
            );
            return { data: links };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend getList Error: ' + error, null);
        }
    }

    async postList(data: any) {
        try {
            console.log(data);
            const getLinks = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ?;
            `,
                [data.code]
            );
            if (getLinks.length === 0) {
                const links = await db.query(`INSERT INTO \`${this.app}\`.t_recommend_links SET ?`, [
                    {
                        code: data.code,
                        content: JSON.stringify(data),
                    },
                ]);
                return { result: true, data: links };
            }
            return { result: false };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend getList Error: ' + error, null);
        }
    }

    async putList(id: string, data: any) {
        try {
            const getLinks = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ? AND id <> ?;
            `,
                [data.code, id]
            );
            console.log(id, data);
            if (getLinks.length === 0) {
                const links = await db.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                    {
                        code: data.code,
                        content: JSON.stringify(data),
                    },
                    id,
                ]);
                return { result: true, data: links };
            }
            return { result: false };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend getList Error: ' + error, null);
        }
    }
}
