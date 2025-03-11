"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSessions = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const shopnex_line_message_1 = require("./model/shopnex-line-message");
const axios_1 = __importDefault(require("axios"));
const shopping_js_1 = require("./shopping.js");
const stock_js_1 = require("./stock.js");
const shopee_js_1 = require("./shopee.js");
const mime = require('mime');
class CustomerSessions {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async createScheduled(data) {
        var _a;
        try {
            const appName = this.app;
            function generateProductCarousel(products, appName, scheduledID) {
                const maxOptions = Math.max(...products.map(p => p.options.length));
                return {
                    type: "flex",
                    altText: "團購商品列表",
                    contents: {
                        type: "carousel",
                        contents: products.map((product, index) => ({
                            type: "bubble",
                            hero: {
                                type: "image",
                                url: product.imageUrl,
                                size: "full",
                                aspectRatio: "16:9",
                                aspectMode: "cover"
                            },
                            body: {
                                type: "box",
                                layout: "vertical",
                                spacing: "lg",
                                height: "120px",
                                justifyContent: "space-between",
                                flex: 1,
                                contents: [
                                    {
                                        type: "text",
                                        text: `${product.name}`,
                                        weight: "bold",
                                        size: "xl",
                                        "wrap": true,
                                        "maxLines": 2
                                    },
                                    {
                                        type: "text",
                                        text: `$ ${product.price.toLocaleString()}起`,
                                        size: "md",
                                        "align": "end"
                                    },
                                ]
                            },
                            footer: {
                                type: "box",
                                layout: "vertical",
                                spacing: "lg",
                                flex: 1,
                                justifyContent: "flex-start",
                                contents: [
                                    ...product.options.flatMap((option, idx) => [
                                        {
                                            type: "text",
                                            text: (option.label.length > 0) ? option.label : "單一規格",
                                            size: "sm",
                                            color: "#0D6EFD",
                                            align: "center",
                                            action: {
                                                type: "postback",
                                                data: `action=selectSpec&productID=${product.id}&spec=${(option.value.length > 0) ? option.value : "單一規格"}&g-app=${appName}&scheduledID=${scheduledID}&price=${option.price}`,
                                            }
                                        },
                                        ...(idx < product.options.length - 1 ? [{ type: "separator", margin: "sm" }] : [])
                                    ])
                                ]
                            }
                        }))
                    }
                };
            }
            function convertToProductFormat(rawData) {
                return rawData.map(item => {
                    const id = item.content.id;
                    const content = item.content;
                    const name = content.title || "未知商品";
                    const variants = content.variants || [];
                    const price = variants.length > 0 ? Math.min(...variants.map(v => v.sale_price)) : 0;
                    const imageUrl = variants.length > 0 ? variants[0].preview_image : "";
                    const options = variants.map(v => ({
                        label: v.spec.length > 0 ? v.spec.join(',') : "",
                        value: v.spec.length > 0 ? v.spec.join(',') : "",
                        price: v.sale_price,
                    }));
                    return {
                        id,
                        name,
                        price,
                        imageUrl,
                        selectedSpec: undefined,
                        options
                    };
                });
            }
            const { type, name } = data, content = __rest(data, ["type", "name"]);
            for (const item of content.item_list) {
                const pdDqlData = (await new shopping_js_1.Shopping(this.app, this.token).getProduct({
                    page: 0,
                    limit: 50,
                    id: item.id,
                    status: 'inRange',
                })).data;
                const pd = pdDqlData.content;
                Promise.all(item.content.variants.map(async (variant, i) => {
                    const returnData = new stock_js_1.Stock(this.app, this.token).allocateStock(variant.stockList, variant.live_model.available_Qty);
                    const updateVariant = pd.variants.find((dd) => dd.spec.join('-') === variant.spec.join('-'));
                    updateVariant.stockList = returnData.stockList;
                    variant.stockList = {};
                    Object.entries(returnData.deductionLog).forEach(([key, value]) => {
                        variant.stockList[key] = {
                            count: value
                        };
                    });
                    if (updateVariant.deduction_log) {
                        delete updateVariant.deduction_log;
                    }
                    let newContent = item.content;
                })).then(async () => {
                    var _a;
                    try {
                        await database_js_1.default.query(`UPDATE \`${this.app}\`.\`t_manager_post\`
                             SET content = ?
                             WHERE id = ?
                            `, [JSON.stringify(pd), item.id]);
                    }
                    catch (error) {
                        console.error('發送訊息錯誤:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                    }
                    if (pd.shopee_id) {
                        await new shopee_js_1.Shopee(this.app, this.token).asyncStockToShopee({
                            product: pdDqlData,
                            callback: () => {
                            },
                        });
                    }
                });
            }
            const message = [
                {
                    "type": "text",
                    "text": `📢 團購開始囉！ 🎉\n團購名稱： ${name}\n團購日期： ${content.start_date} ${content.start_time} ~ ${content.end_date} ${content.end_time}\n\n📍 下方查看完整商品清單`
                }
            ];
            await this.sendMessageToGroup(data.lineGroup.groupId, message);
            const transProducts = convertToProductFormat(content.item_list);
            const queryData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_live_purchase_interactions\`
                                              SET ?;`, [{
                    type: data.type,
                    name: data.name,
                    status: "1",
                    content: JSON.stringify(content)
                }]);
            const flexMessage = generateProductCarousel(transProducts, this.app, queryData.insertId);
            try {
                const res = await axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                    to: data.lineGroup.groupId,
                    messages: [flexMessage]
                }, {
                    headers: { Authorization: `Bearer ${shopnex_line_message_1.ShopnexLineMessage.token}` }
                });
            }
            catch (error) {
                console.error('發送訊息錯誤:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            }
            return {
                result: true,
                message: "OK"
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'createScheduled Error:' + e, null);
        }
    }
    async getScheduled() {
        const appName = this.app;
        function isPastEndTime(end_date, end_time) {
            const now = new Date();
            const taipeiNow = new Date(new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Taipei",
                year: "numeric", month: "2-digit", day: "2-digit",
                hour: "2-digit", minute: "2-digit", second: "2-digit",
                hour12: false
            }).format(now));
            const endDateTime = new Date(`${end_date}T${end_time}:00+08:00`);
            return taipeiNow > endDateTime;
        }
        async function getSel() {
            var _a;
            try {
                let data = await database_js_1.default.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_live_purchase_interactions\`
                    order by id desc
                `, []);
                const expiredItems = data.filter((item) => isPastEndTime(item.content.end_date, item.content.end_time));
                if (expiredItems.length === 0) {
                    console.log("✅ 沒有需要更新的團購");
                    return;
                }
                else {
                    await Promise.all(expiredItems.map((item) => {
                        item.status = 2;
                        database_js_1.default.query(`
                                UPDATE \`${appName}\`.\`t_live_purchase_interactions\`
                                SET \`status\` = 2
                                WHERE \`id\` = ?;
                            `, [item.id]);
                    }));
                }
                return data;
            }
            catch (err) {
                console.error('取得資料錯誤:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
        }
        async function getTotal() {
            var _a;
            try {
                return (await database_js_1.default.query(`
                            SELECT count(*)
                            FROM \`${appName}\`.\`t_live_purchase_interactions\`
                    `, []))[0]["count(*)"];
            }
            catch (err) {
                console.error('取得總數錯誤:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
        }
        async function getDataAndTotal() {
            var _a;
            try {
                const [data, total] = await Promise.all([getSel(), getTotal()]);
                return { data, total };
            }
            catch (err) {
                console.error('獲取資料失敗:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                return { data: [], total: 0 };
            }
        }
        return await getDataAndTotal();
    }
    async getOneScheduled(scheduleID) {
        const appName = this.app;
        async function getSel() {
            var _a;
            try {
                return await database_js_1.default.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_live_purchase_interactions\`
                    WHERE id = ?
                `, [scheduleID]);
            }
            catch (err) {
                console.error('取得資料錯誤:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
        }
        const data = await getSel();
        if (data.length > 0) {
            return data[0];
        }
        else {
            return false;
        }
    }
    async changeScheduledStatus(scheduleID, status) {
        var _a;
        try {
            await database_js_1.default.query(`
                UPDATE \`${this.app}\`.\`t_live_purchase_interactions\`
                SET \`status\` = ?
                WHERE (\`id\` = ?);
            `, [status, scheduleID]);
        }
        catch (err) {
            console.error('更新失敗:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
        }
    }
    async closeScheduled(scheduleID) {
        await this.changeScheduledStatus(scheduleID, "2");
        const data = await this.getOneScheduled(scheduleID);
        const groupID = data.content.lineGroup.groupId;
        const message = [
            {
                type: "text",
                text: `📢【${data.name}團購已結束】📢\n\n感謝大家的熱情參與！🎉 此次團購已正式結束 🛒\n\n📍 請已下單的朋友們儘快完成結帳，這將確保您的訂單保留，不會被取消哦！。\n📍 \n📍 完成結帳後，您將收到訂單確認通知，接著我們會安排出貨事宜。 📦\n📍 若有任何問題，請聯繫管理員\n\n💡 期待下次與大家一起搶好康！🎁`
            }
        ];
        await this.sendMessageToGroup(groupID, message);
    }
    async finishScheduled(scheduleID) {
        await this.changeScheduledStatus(scheduleID, "3");
    }
    async sendMessageToGroup(groupID, message) {
        var _a;
        try {
            const res = await axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                to: groupID,
                messages: message
            }, {
                headers: { Authorization: `Bearer ${shopnex_line_message_1.ShopnexLineMessage.token}` }
            });
        }
        catch (error) {
            console.error('發送訊息錯誤:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    }
    async getOnlineCart(cartID) {
        var _a;
        async function getTempCart(app, cartID) {
            var _a;
            try {
                return await database_js_1.default.query(`
                    SELECT *
                    FROM ${app}.t_temporary_cart
                    WHERE cart_id = ?
                `, [cartID]);
            }
            catch (err) {
                console.error('get temp cart error:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
        }
        const cartData = await getTempCart(this.app, cartID);
        if (cartData.length > 0) {
            let oridata = cartData[0];
            switch (oridata.content.from.purchase) {
                case "group_buy": {
                    try {
                        const interaction = await database_js_1.default.query(`
                            SELECT *
                            FROM ${this.app}.t_live_purchase_interactions
                            WHERE id = ?
                        `, [oridata.content.from.scheduled_id]);
                        return {
                            interaction: interaction[0],
                            cartData: oridata,
                        };
                    }
                    catch (err) {
                        console.error('get t_live_purchase_interactions error:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                    }
                    break;
                }
                default: {
                }
            }
            return cartData[0];
        }
        return "";
    }
    async getCartList(scheduleID) {
        const appName = this.app;
        const token = this.token;
        async function getSel() {
            var _a;
            try {
                const data = await database_js_1.default.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_temporary_cart\`
                    WHERE JSON_EXTRACT(content, '$.from.scheduled_id') = ?
                `, [scheduleID]);
                if (data.length === 0)
                    return [];
                const orderIds = data
                    .map((item) => {
                    var _a;
                    try {
                        const parsedContent = item.content;
                        return (_a = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.cart_data) === null || _a === void 0 ? void 0 : _a.order_id;
                    }
                    catch (error) {
                        console.error("JSON 解析失敗:", error);
                        return undefined;
                    }
                })
                    .filter((id) => Boolean(id));
                if (orderIds.length == 0) {
                    return data;
                }
                const checkoutData = await database_js_1.default.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_checkout\`
                    WHERE cart_token IN (${orderIds.join(",")})
                `, []);
                const checkoutMap = new Map(checkoutData.map(item => [item.cart_token, item]));
                return data.map((cartItem) => {
                    var _a;
                    try {
                        const parsedContent = cartItem.content;
                        const orderId = (_a = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.cart_data) === null || _a === void 0 ? void 0 : _a.order_id;
                        return Object.assign(Object.assign({}, cartItem), { checkoutInfo: orderId ? checkoutMap.get(orderId) || null : null });
                    }
                    catch (error) {
                        console.error("JSON 解析失敗:", error);
                        return Object.assign(Object.assign({}, cartItem), { checkoutInfo: null });
                    }
                });
            }
            catch (err) {
                console.error('取得資料錯誤:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
        }
        async function getTotal() {
            var _a;
            try {
                return (await database_js_1.default.query(`
                            SELECT count(*)
                            FROM \`${appName}\`.\`t_temporary_cart\`
                            WHERE JSON_EXTRACT(content, '$.from.scheduled_id') = ?
                    `, [scheduleID]))[0]["count(*)"];
            }
            catch (err) {
                console.error('取得總數錯誤:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
        }
        async function getDataAndTotal() {
            try {
                const [data, total] = await Promise.all([getSel(), getTotal()]);
                return { data, total };
            }
            catch (err) {
                console.error('獲取資料失敗:', err);
                return { data: [], total: 0 };
            }
        }
        return await getDataAndTotal();
    }
    async getRealOrder(cart_array) {
        return await database_js_1.default.query(`SELECT *
                               FROM \`${this.app}\`.\`t_checkout\`
                               WHERE JSON_EXTRACT(orderData, '$.temp_cart_id') IN (${cart_array.map((cart) => {
            return JSON.stringify(cart);
        }).join(',')});`, []);
    }
    async listenChatRoom() {
    }
}
exports.CustomerSessions = CustomerSessions;
//# sourceMappingURL=customer-sessions.js.map