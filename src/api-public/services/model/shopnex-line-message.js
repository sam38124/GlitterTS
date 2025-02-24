"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopnexLineMessage = void 0;
const database_js_1 = __importDefault(require("../../../modules/database.js"));
const config_js_1 = require("../../../config.js");
const axios_1 = __importDefault(require("axios"));
const app_js_1 = require("../../../services/app.js");
const process_1 = __importDefault(require("process"));
const mime = require('mime');
class ShopnexLineMessage {
    static get token() {
        return process_1.default.env.line_bot_token;
    }
    static async handleJoinEvent(event, app) {
        var _a, _b;
        async function checkGroupInfo(app, groupId) {
            var _a;
            try {
                const result = await database_js_1.default.query(`SELECT *
                     FROM \`shopnex\`.t_line_group_inf
                     WHERE group_id = ?`, [groupId]);
                return result.length > 0 ? result : null;
            }
            catch (error) {
                console.error("❌ 取得 t_line_group_inf 資訊錯誤:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                return null;
            }
        }
        const replyToken = event.replyToken;
        const groupId = event.source.groupId;
        const groupData = await checkGroupInfo(app, groupId);
        if (!groupData) {
            const groupData = await ShopnexLineMessage.getLineGroupInf(groupId);
            try {
                await database_js_1.default.query(`insert into \`shopnex\`.t_line_group_inf
                     set ?`, [
                    {
                        group_id: groupId,
                        group_name: groupData.groupName,
                        shopnex_user_name: "shopnex",
                        shopnex_user_id: "shopnex",
                        shopnex_app: "shopnex"
                    },
                ]);
            }
            catch (err) {
                console.log("error create t_line_group_inf -- ", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            }
            try {
                await axios_1.default.post("https://api.line.me/v2/bot/message/reply", {
                    replyToken: replyToken,
                    messages: [
                        {
                            "type": "flex",
                            "altText": "請點擊驗證按鈕來完成綁定",
                            "contents": {
                                "type": "bubble",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "📢 Shopnex 團購機器人",
                                            "weight": "bold",
                                            "size": "md",
                                            "align": "center",
                                            "margin": "xs"
                                        },
                                        {
                                            "type": "text",
                                            "text": "已準備開始為您服務！🚀",
                                            "weight": "bold",
                                            "size": "md",
                                            "align": "center"
                                        },
                                        {
                                            "type": "text",
                                            "text": "請讓管理員點擊按鈕進行驗證",
                                            "size": "md",
                                            "align": "center",
                                            "wrap": true,
                                            "margin": "sm"
                                        },
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "style": "primary",
                                            "color": "#007BFF",
                                            "action": {
                                                "type": "uri",
                                                "label": "🌍 開啟網頁",
                                                "uri": `http://127.0.0.1:4000/shopnex/shopnex-line-oauth?groupId=${groupId}`
                                            }
                                        },
                                        {
                                            "type": "text",
                                            "text": "請確保您是群組管理員再進行驗證。",
                                            "size": "xs",
                                            "color": "#aaaaaa",
                                            "align": "center",
                                            "wrap": true
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }, {
                    headers: { Authorization: `Bearer ${ShopnexLineMessage.token}` }
                });
            }
            catch (err) {
                console.log("error reply line group -- ", ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message);
            }
        }
        else {
        }
    }
    static async handlePostbackEvent(event, app) {
        var _a, _b;
        const userId = event.source.userId;
        const data = event.postback.data;
        console.log(`🔹 Postback 事件來自: ${userId}, data: ${data}`);
        console.log("saasConfig.SAAS_NAME -- ", config_js_1.saasConfig.SAAS_NAME);
        const queryParams = new URLSearchParams(data);
        const action = queryParams.get("action");
        switch (action) {
            case "verify":
                const userData = (await database_js_1.default.query(`SELECT *
                         FROM shopnex.t_user
                         WHERE userData ->>'$.lineID' = ?;`, [userId]));
                console.log("userData -- ", userData);
                localStorage.setItem('', '');
                break;
            case "order_status":
                await this.sendPrivateMessage(userId, "📦 您的訂單正在處理中！");
                break;
            case "selectSpec": {
                async function checkTempCart(scheduledID, userId) {
                    if (scheduledID == "" || userId == "") {
                        return ``;
                    }
                    return await database_js_1.default.query(`
                        SELECT *
                        FROM ${appName}.t_temporary_cart
                        WHERE JSON_EXTRACT(content, '$.from.purchase') = 'group_buy'
                          AND JSON_EXTRACT(content, '$.from.id') = ?
                          AND JSON_EXTRACT(content, '$.from.source') = 'LINE'
                          AND JSON_EXTRACT(content, '$.from.user_id') = ?;
                    `, [scheduledID, userId]);
                }
                function generateRandomNumberCode(length = 12) {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let code = '';
                    for (let i = 0; i < length; i++) {
                        const randomIndex = Math.floor(Math.random() * chars.length);
                        code += chars[randomIndex];
                    }
                    return code;
                }
                async function checkCartIdExists(cartId, appName) {
                    var _a;
                    try {
                        const result = await database_js_1.default.query(`
                            SELECT COUNT(*) AS count
                            FROM \`${appName}\`.t_temporary_cart
                            WHERE cart_id = ?
                        `, [cartId]);
                        return result[0].count > 0;
                    }
                    catch (err) {
                        console.error("Error checking cart_id:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                        return false;
                    }
                }
                async function insertCart(cartId, content, appName) {
                    var _a;
                    const exists = await checkCartIdExists(cartId, appName);
                    if (exists) {
                        console.log(`Cart ID ${cartId} already exists.`);
                        return;
                    }
                    try {
                        await database_js_1.default.query(`
                            INSERT INTO \`${appName}\`.t_temporary_cart (cart_id, content)
                            VALUES (?, ?)
                        `, [cartId, JSON.stringify(content)]);
                        console.log(`Cart ID ${cartId} inserted successfully.`);
                    }
                    catch (err) {
                        console.error("Error inserting cart data:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                    }
                }
                async function insertUniqueCart(content, appName) {
                    let cartId = "";
                    let unique = false;
                    while (!unique) {
                        cartId = generateRandomNumberCode();
                        unique = !(await checkCartIdExists(cartId, appName));
                    }
                    await insertCart(cartId, content, appName);
                    return cartId;
                }
                const scheduledID = queryParams.get('scheduledID');
                const appName = (_a = queryParams.get('g-app')) !== null && _a !== void 0 ? _a : "";
                const productID = queryParams.get('productID');
                const spec = queryParams.get('spec');
                const data = (await database_js_1.default.query(`SELECT *
                                              FROM ${appName}.t_live_purchase_interactions
                                              WHERE \`id\` = ${scheduledID}`, []))[0] || 0;
                const item_list = data.content.item_list;
                const item = item_list.find((item) => {
                    return item.id == productID;
                });
                const variant = item.content.variants.find((item) => {
                    return item.spec.join(',') == spec;
                });
                const cart = {
                    id: productID,
                    spec: spec,
                    count: 1
                };
                let cartData = await checkTempCart(scheduledID !== null && scheduledID !== void 0 ? scheduledID : "", userId);
                let cartID = "";
                if (!cartData || cartData.length == 0) {
                    let content = {
                        from: {
                            purchase: "group_buy",
                            id: scheduledID,
                            source: "LINE",
                            user_id: userId,
                        },
                        cart: [cart]
                    };
                    cartID = await insertUniqueCart(content, appName);
                }
                else {
                    let changeData = cartData[0].content.cart.find((item) => { return item.id == productID && item.spec == spec; });
                    if (changeData) {
                        if (changeData.count < variant.live_model.available_Qty) {
                            changeData.count++;
                        }
                    }
                    else {
                        cartData[0].content.cart.push(cart);
                    }
                    cartID = cartData[0].cart_id;
                    try {
                        await database_js_1.default.query(`
                            UPDATE ${appName}.t_temporary_cart
                            SET ?
                            WHERE cart_id = ?
                        `, [{ content: JSON.stringify(cartData[0].content) }, cartData[0].cart_id]);
                    }
                    catch (err) {
                        console.log("UPDATE t_temporary_cart error : ", ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message);
                    }
                }
                const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(appName);
                console.log("cartID -- ", cartID);
                console.log("appName -- ", appName);
                console.log(brandAndMemberType.domain);
                const returnURL = `https://${brandAndMemberType.domain}/order_detail?source=group_buy&cart_id=${cartID}`;
                await this.sendPrivateMessage(userId, `🛒 您的商品已成功加入購物車，
${returnURL}
請點擊上方連結查看您的購物車內容！`);
                break;
            }
            default:
                console.log("⚠️ 未知的 Postback 事件");
                break;
        }
    }
    static async sendPrivateMessage(userId, message) {
        await axios_1.default.post("https://api.line.me/v2/bot/message/push", {
            to: userId,
            messages: [{ type: "text", text: message }]
        }, {
            headers: { Authorization: `Bearer ${ShopnexLineMessage.token}` }
        });
    }
    static async getLineGroupInf(groupId) {
        var _a;
        const url = `https://api.line.me/v2/bot/group/${groupId}/summary`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ShopnexLineMessage.token}`,
        };
        try {
            const response = await axios_1.default.get(url, { headers });
            return response.data;
        }
        catch (error) {
            console.error('取得群組資訊錯誤:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    }
    static async generateVerificationCode(app) {
        async function getOrGenerateVerificationCode(appName) {
            const existingCode = await findExistingCode(appName);
            if (existingCode) {
                return existingCode;
            }
            const newCode = await generateUniqueCode();
            await storeVerificationCode(appName, newCode);
            return newCode;
        }
        async function findExistingCode(appName) {
            try {
                const rows = await database_js_1.default.query(`
                    SELECT verification_code
                    FROM shopnex.t_app_line_group_verification
                    WHERE app_name = ? LIMIT 1
                `, [appName]);
                return rows.length > 0 ? rows[0].verification_code : null;
            }
            catch (e) {
                console.error("❌ 查詢現有驗證碼錯誤:", e.message);
                return null;
            }
        }
        async function generateUniqueCode() {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            let code = "";
            function generateCode() {
                let newCode = "";
                for (let i = 0; i < 8; i++) {
                    const randomIndex = Math.floor(Math.random() * chars.length);
                    newCode += chars[randomIndex];
                }
                return newCode;
            }
            do {
                code = generateCode();
            } while (await findRepeatCode(code));
            return code;
        }
        async function findRepeatCode(code) {
            try {
                const rows = await database_js_1.default.query(`
                    SELECT 1
                    FROM shopnex.t_app_line_group_verification
                    WHERE verification_code = ? LIMIT 1
                `, [code]);
                return rows.length > 0;
            }
            catch (e) {
                console.error("❌ 查詢重複驗證碼錯誤:", e.message);
                return false;
            }
        }
        async function storeVerificationCode(appName, code) {
            try {
                await database_js_1.default.execute(`
                    INSERT INTO shopnex.t_app_line_group_verification (app_name, verification_code)
                    VALUES (?, ?)
                `, [appName, code]);
            }
            catch (e) {
                console.error("❌ 插入驗證碼錯誤:", e.message);
            }
        }
        const code = await getOrGenerateVerificationCode(app);
        return code;
    }
    static async verifyVerificationCode(data) {
        var _a;
        async function getShopnexLineGroupInf() {
            var _a;
            try {
                const rawData = await database_js_1.default.query(`
                    SELECT *
                    FROM shopnex.t_line_group_inf
                    WHERE group_id = ?
                `, [data.groupId]);
                return rawData.length > 0 ? rawData[0] : null;
            }
            catch (err) {
                console.error("❌ 查詢 app_name 失敗:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                return null;
            }
        }
        async function getShopnexVerificationCode() {
            var _a, _b;
            try {
                const rawData = await database_js_1.default.query(`
                    SELECT *
                    FROM shopnex.t_app_line_group_verification
                    WHERE verification_code = ?
                `, [(_a = data.code) !== null && _a !== void 0 ? _a : ""]);
                return rawData.length > 0 ? rawData[0] : null;
            }
            catch (err) {
                console.error("❌ 查詢 app_name 失敗:", ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message);
                return null;
            }
        }
        const lineGroupData = await getShopnexLineGroupInf();
        if (!lineGroupData) {
            return {
                result: "error",
                data: "查無此Group ID"
            };
        }
        if (lineGroupData.shopnex_app != "shopnex") {
            return {
                result: "error",
                data: "此LINE群組已綁定"
            };
        }
        let verificationData = await getShopnexVerificationCode();
        if (verificationData) {
            const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(verificationData.app_name);
            try {
                await database_js_1.default.query(`
                    UPDATE shopnex.t_line_group_inf
                    SET ?
                    WHERE group_id = ?
                `, [{
                        shopnex_user_name: brandAndMemberType.userData.name,
                        shopnex_app: verificationData.app_name,
                        shopnex_user_id: brandAndMemberType.user_id
                    }, data.groupId]);
            }
            catch (err) {
                console.error("❌ 更新 t_line_group_inf 失敗:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                return {
                    result: "error",
                    data: "更新 t_line_group_inf 失敗"
                };
            }
        }
        else {
            return {
                result: "error",
                data: "驗證碼錯誤"
            };
        }
        return {
            data: "OK"
        };
    }
    static async getLineGroup(app) {
        var _a;
        try {
            return await database_js_1.default.query(`
                select *
                FROM shopnex.t_line_group_inf
                WHERE shopnex_app = ?
            `, [app]);
        }
        catch (err) {
            console.error("❌ 查詢 line 群組 失敗:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            return null;
        }
    }
}
exports.ShopnexLineMessage = ShopnexLineMessage;
//# sourceMappingURL=shopnex-line-message.js.map