import db from '../../modules/database';
import exception from '../../modules/exception';
import { IToken } from '../models/Auth.js';
import { Shopping } from './shopping.js';
import { saasConfig } from '../../config.js';

export class Recommend {
    public app: string;

    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async getLinkList(query: { code?: string; status?: boolean; page: number; limit: number; user_id?: string }) {
        try {
            query.page = query.page ?? 0;
            query.limit = query.limit ?? 50;

            let search = ['1=1'];
            if (query?.code) {
                search.push(`(code = "${query.code}")`);
            }
            if (query?.status) {
                search.push(`(JSON_EXTRACT(content, '$.status') = ${query.status})`);
            }
            if (query?.user_id) {
                search.push(`(JSON_EXTRACT(content, '$.recommend_user.id') = ${query.user_id})`);
            }

            const links = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_links WHERE ${search.join(' AND ')}
                ${query.page !== undefined && query.limit !== undefined ? `LIMIT ${query.page * query.limit}, ${query.limit}` : ''};
            `,
                []
            );

            const total = await db.query(
                `SELECT count(*) as c FROM \`${this.app}\`.t_recommend_links WHERE ${search.join(' AND ')};
            `,
                []
            );

            function calculatePercentage(numerator: number, denominator: number, decimalPlaces: number = 2): string {
                if (denominator === 0) {
                    return '0%';
                }
                const percentage = (numerator / denominator) * 100;
                return `${percentage.toFixed(decimalPlaces)}%`;
            }

            for (const data of links) {
                const shopping = new Shopping(this.app, this.token);
                const orders = await shopping.getCheckOut({
                    page: 0,
                    limit: 5000,
                    distribution_code: data.code,
                });

                const monitor = await db.query(
                    `SELECT id, mac_address 
                     FROM \`${saasConfig.SAAS_NAME}\`.t_monitor
                     WHERE app_name = ? AND base_url = ?`,
                    [this.app, `/${this.app}/distribution/${data.content.link}`]
                );

                const monitorLength = monitor.length;
                const macAddrSize = new Set(monitor.map((item: any) => item.mac_address)).size;
                const totalOrders = orders.data.length;
                const totalPrice = orders.data.reduce((sum: number, order: any) => sum + order.orderData.total - order.orderData.shipment_fee, 0);

                data.orders = totalOrders;
                data.click_times = monitorLength;
                data.mac_address_count = macAddrSize;
                data.conversion_rate = calculatePercentage(totalOrders, monitor.length, 1);
                data.total_price = totalPrice;
                data.sharing_bonus = Math.floor((totalPrice * parseFloat(data.content.share_value)) / 100);
            }

            return { data: links, total: total[0].c };
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
                data.recommend_user.id = register.data.insertId;
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

    async deleteLink(data: any) {
        try {
            data.token && delete data.token;
            if (data.id && data.id.length > 0) {
                const links = await db.query(
                    `DELETE FROM \`${this.app}\`.t_recommend_links 
                    WHERE id in (${data.id.join(',')});
                `,
                    []
                );
                return { result: true, data: links };
            }
            return { result: false, message: '刪除失敗' };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }

    async getUserList(query: { limit: number; page: number; search?: string; searchType?: string; orderBy?: string }) {
        try {
            query.page = query.page ?? 0;
            query.limit = query.limit ?? 50;

            let search = ['1=1'];
            if (query.search) {
                switch (query.searchType) {
                    case 'phone':
                        search.push(`(JSON_EXTRACT(content, '$.phone') like '%${query.search}%')`);
                        break;
                    case 'name':
                        search.push(`(JSON_EXTRACT(content, '$.name') like '%${query.search}%')`);
                        break;
                    case 'email':
                    default:
                        search.push(`(email like '%${query.search}%')`);
                        break;
                }
            }

            let orderBy = 'id DESC';
            if (query.orderBy) {
                orderBy = (() => {
                    switch (query.orderBy) {
                        case 'name':
                            return `JSON_EXTRACT(content, '$.name')`;
                        case 'created_time_asc':
                            return `created_time`;
                        case 'created_time_desc':
                            return `created_time DESC`;
                        default:
                            return `id DESC`;
                    }
                })();
            }

            const data = await db.query(
                `SELECT * FROM \`${this.app}\`.t_recommend_users
                WHERE ${search.join(' AND ')}
                ORDER BY ${orderBy}
                ${query.page !== undefined && query.limit !== undefined ? `LIMIT ${query.page * query.limit}, ${query.limit}` : ''};
            `,
                []
            );
            const total = await db.query(
                `SELECT count(id) as c FROM \`${this.app}\`.t_recommend_users
                WHERE ${search.join(' AND ')}
            `,
                []
            );

            let n = 0;
            await new Promise<void>((resolve) => {
                const si = setInterval(() => {
                    if (n === data.length) {
                        resolve();
                        clearInterval(si);
                    }
                }, 100);
                data.map(async (user: any) => {
                    const links = await db.query(
                        `SELECT count(id) as c FROM \`${this.app}\`.t_recommend_links
                        WHERE (JSON_EXTRACT(content, '$.recommend_user.id') = ${user.id});
                        `,
                        []
                    );
                    user.orders = links.length > 0 ? links[0].c : 0;
                    n++;
                });
            });

            return {
                data: data,
                total: total[0].c,
            };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend getUserList Error: ' + error, null);
        }
    }

    async postUser(data: any) {
        try {
            data.token && delete data.token;
            data.id !== undefined && delete data.id;
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

    async deleteUser(data: any) {
        try {
            data.token && delete data.token;
            if (data.id && data.id.length > 0) {
                await db.query(
                    `DELETE FROM \`${this.app}\`.t_recommend_links 
                    WHERE JSON_EXTRACT(content, '$.recommend_user.id') in (${data.id.join(',')});
                `,
                    []
                );
                const user = await db.query(
                    `DELETE FROM \`${this.app}\`.t_recommend_users WHERE (id in (${data.id.join(',')}));
                    `,
                    []
                );
                return { result: true, data: user };
            }
            return { result: false, message: '刪除失敗' };
        } catch (error) {
            throw exception.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
}
