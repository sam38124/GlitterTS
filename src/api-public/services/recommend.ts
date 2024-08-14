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

    async getLinkList(obj?: { code?: string }) {
        try {
            let search = ['1=1'];
            if (obj?.code) {
                search.push(`code = "${obj.code}"`);
            }

            const links = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links WHERE ${search.join(' AND ')};
            `,
                []
            );
            return { data: links };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend getLinkList Error: ' + error, null);
        }
    }

    async postLink(data: any) {
        try {
            data.token && delete data.token;
            const getLinks = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ?;
            `,
                [data.code]
            );
            if (getLinks.length > 0) {
                return { result: false, message: '此分銷代碼已被建立' };
            }
            if (data.recommend_status === 'new' && data.recommend_user && data.recommend_user.id === 0) {
                const register = await this.postUser(data.recommend_user);
                if (!register.result) {
                    return { result: false, message: '信箱已被建立' };
                }
            }
            const links = await db.query(`INSERT INTO \`${this.app}\`.t_recommend_links SET ?`, [
                {
                    code: data.code,
                    content: JSON.stringify(data),
                },
            ]);
            return { result: true, data: links };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend postLink Error: ' + error, null);
        }
    }

    async putLink(id: string, data: any) {
        try {
            data.token && delete data.token;
            const getLinks = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ? AND id <> ?;
            `,
                [data.code, id]
            );
            if (getLinks.length > 0) {
                return { result: false, message: '此分銷代碼已被建立' };
            }
            const links = await db.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                {
                    code: data.code,
                    content: JSON.stringify(data),
                },
                id,
            ]);
            return { result: true, data: links };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend putLink Error: ' + error, null);
        }
    }

    async toggleLink(id: string) {
        try {
            const getLinks = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links WHERE id = ?;
            `,
                [id]
            );
            if (getLinks.length === 0) {
                return { result: false, message: '此分銷連結不存在' };
            }
            const content = getLinks[0].content;
            content.status = !content.status;
            const links = await db.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                {
                    content: JSON.stringify(content),
                },
                id,
            ]);
            return { result: true, data: links };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend toggleLink Error: ' + error, null);
        }
    }

    async getUserList() {
        try {
            const users = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_users;
            `,
                []
            );
            return { data: users };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend getUserList Error: ' + error, null);
        }
    }

    async postUser(data: any) {
        try {
            data.token && delete data.token;
            const getUsers = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_users WHERE email = ?;
            `,
                [data.email]
            );
            if (getUsers.length > 0) {
                return { result: false, message: '信箱已被建立' };
            }
            const user = await db.query(`INSERT INTO \`${this.app}\`.t_recommend_users SET ?`, [
                {
                    email: data.email,
                    content: JSON.stringify(data),
                },
            ]);
            return { result: true, data: user };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend postUser Error: ' + error, null);
        }
    }

    async putUser(id: string, data: any) {
        try {
            data.token && delete data.token;
            const getUsers = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_users WHERE email = ? AND id <> ?;
            `,
                [data.email, id]
            );
            if (getUsers.length > 0) {
                return { result: false, message: '信箱已被建立' };
            }
            const user = await db.query(`UPDATE \`${this.app}\`.t_recommend_users SET ? WHERE (id = ?);`, [
                {
                    email: data.email,
                    content: JSON.stringify(data),
                },
                id,
            ]);
            return { result: true, data: user };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
}
