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
const shopping_1 = require("./shopping");
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
                                        text: `NT$ ${product.price.toLocaleString()}`,
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
                                            text: option.label,
                                            size: "sm",
                                            color: "#0D6EFD",
                                            align: "center",
                                            action: {
                                                type: "postback",
                                                data: `action=selectSpec&productID=${product.id}&spec=${option.value}&g-app=${appName}&scheduledID=${scheduledID}`
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
                        label: v.spec.join(','),
                        value: v.spec.join(',')
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
        async function getSel() {
            var _a;
            try {
                return await database_js_1.default.query(`
                SELECT * FROM \`${appName}\`.\`t_live_purchase_interactions\`
                `, []);
            }
            catch (err) {
                console.error('取得資料錯誤:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
        }
        return await getSel();
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
                        `, [oridata.content.from.id]);
                        const preview = await new shopping_1.Shopping(this.app, this.token).toCheckout({
                            code_array: [],
                            return_url: "",
                            user_info: undefined,
                            line_items: oridata.content.cart.map((item) => {
                                return {
                                    id: item.id,
                                    spec: item.spec.split(","),
                                    count: item.count,
                                    sale_price: item.price,
                                    sku: "",
                                    shipment_obj: {
                                        type: 'volume',
                                        value: 1,
                                    },
                                    weight: 0,
                                    stock: 1,
                                    show_understocking: 'true',
                                    designated_logistics: {
                                        type: 'all',
                                        list: [],
                                    },
                                };
                            })
                        }, "preview");
                        return {
                            interaction: interaction[0],
                            cartData: oridata,
                            preview_order: preview.data,
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
    async listenChatRoom() {
    }
}
exports.CustomerSessions = CustomerSessions;
//# sourceMappingURL=customer-sessions.js.map