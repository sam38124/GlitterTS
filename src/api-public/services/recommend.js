"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommend = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const shopping_js_1 = require("./shopping.js");
const config_js_1 = require("../../config.js");
class Recommend {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    calculatePercentage(numerator, denominator, decimalPlaces = 2) {
        if (denominator === 0) {
            return `0%`;
        }
        const percentage = (numerator / denominator) * 100;
        return `${percentage.toFixed(decimalPlaces)}%`;
    }
    async getLinkList(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            let search = ['1=1'];
            if (query === null || query === void 0 ? void 0 : query.code) {
                search.push(`(code = "${query.code}")`);
            }
            if (query === null || query === void 0 ? void 0 : query.status) {
                search.push(`(JSON_EXTRACT(content, '$.status') = ${query.status})`);
            }
            if (query === null || query === void 0 ? void 0 : query.user_id) {
                search.push(`(JSON_EXTRACT(content, '$.recommend_user.id') = ${query.user_id})`);
            }
            const links = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE ${search.join(' AND ')}
                ${query.page !== undefined && query.limit !== undefined ? `LIMIT ${query.page * query.limit}, ${query.limit}` : ''};
            `, []);
            const total = await database_1.default.query(`SELECT count(*) as c FROM \`${this.app}\`.t_recommend_links WHERE ${search.join(' AND ')};
            `, []);
            const shopping = new shopping_js_1.Shopping(this.app, this.token);
            if (!query.no_detail) {
                const orderList = await shopping.getCheckOut({
                    page: 0,
                    limit: 5000,
                    distribution_code: links.map((data) => data.code).join(','),
                });
                const monitors = await (async () => {
                    if (links.length === 0) {
                        return [];
                    }
                    return await database_1.default.query(`SELECT id, mac_address, base_url 
                        FROM \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor
                        WHERE app_name = "${this.app}"
                        AND base_url in (${links.map((data) => `"/${this.app}/distribution/${data.content.link}"`).join(',')})
                     `, []);
                })();
                for (const data of links) {
                    const orders = orderList.data.filter((d) => {
                        try {
                            return d.orderData.distribution_info.code === data.code;
                        }
                        catch (error) {
                            return false;
                        }
                    });
                    const monitor = monitors.filter((d) => d.base_url === `/${this.app}/distribution/${data.content.link}`);
                    const monitorLength = monitor.length;
                    const macAddrSize = new Set(monitor.map((item) => item.mac_address)).size;
                    const totalOrders = orders.filter((order) => {
                        return order.status === 1;
                    }).length;
                    const totalPrice = orders.reduce((sum, order) => {
                        if (order.status === 1) {
                            return sum + order.orderData.total - order.orderData.shipment_fee;
                        }
                        return sum;
                    }, 0);
                    data.orders = totalOrders;
                    data.click_times = monitorLength;
                    data.mac_address_count = macAddrSize;
                    data.conversion_rate = this.calculatePercentage(totalOrders, monitor.length, 1);
                    data.total_price = totalPrice;
                    data.sharing_bonus = 0;
                    if (data.content.lineItems) {
                        function arraysAreEqualIgnoringOrder(arr1, arr2) {
                            if (arr1.length !== arr2.length)
                                return false;
                            const set1 = new Set(arr1);
                            const set2 = new Set(arr2);
                            return arr1.every((value) => set2.has(value)) && arr2.every((value) => set1.has(value));
                        }
                        let idArray = [];
                        let variants = data.content.lineItems.map((item) => {
                            idArray.push(item.id);
                            return {
                                id: item.id,
                                spec: item.content.variants[item.selectIndex].spec,
                            };
                        });
                        orders.map((order) => {
                            order.orderData.lineItems.forEach((item) => {
                                if (idArray.includes(item.id)) {
                                    variants.forEach((variant) => {
                                        if (variant.id === item.id && arraysAreEqualIgnoringOrder(variant.spec, item.spec)) {
                                            data.sharing_bonus += Math.floor((item.sale_price * item.count * parseFloat(data.content.share_value)) / 100);
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
            }
            return { data: links, total: total[0].c };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getLinkList Error: ' + error, null);
        }
    }
    async postLink(data) {
        try {
            data.token && delete data.token;
            const getLinks = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ?;
            `, [data.code]);
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
            const links = await database_1.default.query(`INSERT INTO \`${this.app}\`.t_recommend_links SET ?`, [
                {
                    code: data.code,
                    content: JSON.stringify(data),
                },
            ]);
            return { result: true, data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend postLink Error: ' + error, null);
        }
    }
    async putLink(id, data) {
        try {
            data.token && delete data.token;
            const getLinks = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE code = ? AND id <> ?;
            `, [data.code, id]);
            if (getLinks.length > 0) {
                return { result: false, message: '此分銷代碼已被建立' };
            }
            const links = await database_1.default.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                {
                    code: data.code,
                    content: JSON.stringify(data),
                },
                id,
            ]);
            return { result: true, data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putLink Error: ' + error, null);
        }
    }
    async toggleLink(id) {
        try {
            const getLinks = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links WHERE id = ?;
            `, [id]);
            if (getLinks.length === 0) {
                return { result: false, message: '此分銷連結不存在' };
            }
            const content = getLinks[0].content;
            content.status = !content.status;
            const links = await database_1.default.query(`UPDATE \`${this.app}\`.t_recommend_links SET ? WHERE (id = ?);`, [
                {
                    content: JSON.stringify(content),
                },
                id,
            ]);
            return { result: true, data: links };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend toggleLink Error: ' + error, null);
        }
    }
    async deleteLink(data) {
        try {
            data.token && delete data.token;
            if (data.id && data.id.length > 0) {
                const links = await database_1.default.query(`DELETE FROM \`${this.app}\`.t_recommend_links 
                    WHERE id in (${data.id.join(',')});
                `, []);
                return { result: true, data: links };
            }
            return { result: false, message: '刪除失敗' };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
    async getUserList(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
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
            const data = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_users
                    WHERE ${search.join(' AND ')}
                    ORDER BY ${orderBy}
                    ${query.page !== undefined && query.limit !== undefined ? `LIMIT ${query.page * query.limit}, ${query.limit}` : ''};
                `, []);
            const total = await database_1.default.query(`SELECT count(id) as c FROM \`${this.app}\`.t_recommend_users
                    WHERE ${search.join(' AND ')}
                `, []);
            const allOrders = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_checkout WHERE orderData->>'$.distribution_info' is not null;
                `, []);
            if (data.length === 0) {
                return {
                    data: [],
                    total: 0,
                };
            }
            let n = 0;
            await new Promise((resolve) => {
                data.map(async (user) => {
                    database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_links
                        WHERE (JSON_EXTRACT(content, '$.recommend_user.id') = ${user.id});
                        `, []).then((results) => {
                        const orders = allOrders.filter((order) => {
                            try {
                                return order.orderData.distribution_info.recommend_user.id === user.id;
                            }
                            catch (error) {
                                return false;
                            }
                        });
                        const totalList = results.map((result) => {
                            const code = result.code;
                            const content = result.content;
                            const total = orders.reduce((sum, order) => {
                                if (order.status === 1 && order.orderData.distribution_info.code === code) {
                                    return sum + order.orderData.total - order.orderData.shipment_fee;
                                }
                                return sum;
                            }, 0);
                            return { code, total, content };
                        });
                        user.sharing_bonus = totalList.reduce((sum, obj) => {
                            return sum + Math.floor((obj.total * parseFloat(obj.content.share_value)) / 100);
                        }, 0);
                        user.total_price = totalList.reduce((sum, obj) => sum + obj.total, 0);
                        user.links = results.length;
                        n++;
                        if (n === data.length) {
                            resolve();
                        }
                    });
                });
            });
            return {
                data: data,
                total: total[0].c,
            };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend getUserList Error: ' + error, null);
        }
    }
    async postUser(data) {
        try {
            data.token && delete data.token;
            data.id !== undefined && delete data.id;
            const getUsers = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_users WHERE email = ?;
            `, [data.email]);
            if (getUsers.length > 0) {
                return { result: false, message: '信箱已被建立' };
            }
            const user = await database_1.default.query(`INSERT INTO \`${this.app}\`.t_recommend_users SET ?`, [
                {
                    email: data.email,
                    content: JSON.stringify(data),
                },
            ]);
            return { result: true, data: user };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend postUser Error: ' + error, null);
        }
    }
    async putUser(id, data) {
        try {
            data.token && delete data.token;
            const getUsers = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_recommend_users WHERE email = ? AND id <> ?;
            `, [data.email, id]);
            if (getUsers.length > 0) {
                return { result: false, message: '信箱已被建立' };
            }
            const user = await database_1.default.query(`UPDATE \`${this.app}\`.t_recommend_users SET ? WHERE (id = ?);`, [
                {
                    email: data.email,
                    content: JSON.stringify(data),
                },
                id,
            ]);
            return { result: true, data: user };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
    async deleteUser(data) {
        try {
            data.token && delete data.token;
            if (data.id && data.id.length > 0) {
                await database_1.default.query(`DELETE FROM \`${this.app}\`.t_recommend_links 
                    WHERE JSON_EXTRACT(content, '$.recommend_user.id') in (${data.id.join(',')});
                `, []);
                const user = await database_1.default.query(`DELETE FROM \`${this.app}\`.t_recommend_users WHERE (id in (${data.id.join(',')}));
                    `, []);
                return { result: true, data: user };
            }
            return { result: false, message: '刪除失敗' };
        }
        catch (error) {
            throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error, null);
        }
    }
}
exports.Recommend = Recommend;
//# sourceMappingURL=recommend.js.map