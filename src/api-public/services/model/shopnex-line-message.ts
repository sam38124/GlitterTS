import db from '../../../modules/database.js';
import {saasConfig} from '../../../config.js';
import axios from 'axios';
import {App} from '../../../services/app.js';
import process from "process";
import {User} from "../user";
import { CustomerSessions } from '../customer-sessions';

const mime = require('mime');

interface LineResponse {
    // 定義 response 物件的結構，根據實際 API 回應的格式進行調整
    clientid?: string;
    msgid?: string;
    statuscode: number;
    accountPoint?: number;
    Duplicate?: string;
    smsPoint?: number;
    message?: string;
}

export interface CartInfo {
    id:string,
    cart_id:string,
    content:{
        cart:{
            id:string,
            spec:string,
            count:number
        }[],
        from:{
            purchase:string,
            scheduled_id:string,
            source:string,
            user_id:string,
            user_photo:string,
            user_name:string
        },
        total:number,
        checkUrl:string,
    },
    created_time:string
}

export interface ScheduledInfo {
    id:string,
    type:string,
    status:number,
    content:{
        stock:{
            period:number,
            reserve:boolean,
            expiry_date:string
        },
        purpose:string,
        start_date:string,
        start_time:string,
        end_date:string,
        end_time:string,
        item_list:{
            id:string,
            content:{
                name:string,
                variants:any
            }
        }[],
        lineGroup?:{
            groupId:string,
            groupName:string
        },
        discount_set:boolean,
        pending_order:string[],
        pending_order_total:number,
    },
    created_time:string
}


export class ShopnexLineMessage {
    public static get token() {
        return process.env.line_bot_token
    }

    public static async handleJoinEvent(event: any, app: string) {
        async function checkGroupInfo(app: string, groupId: string) {
            try {
                const result = await db.query(
                    `SELECT *
                     FROM \`shopnex\`.t_line_group_inf
                     WHERE group_id = ?`,
                    [groupId]
                );

                return result.length > 0 ? result : null; // 如果無結果則回傳 null
            } catch (error: any) {
                console.error("❌ 取得 t_line_group_inf 資訊錯誤:", error.response?.data || error.message);
                return null; // 確保發生錯誤時回傳 null，而不是 undefined
            }
        }

        const replyToken = event.replyToken;
        const groupId = event.source.groupId;
        //確認此groupID是否已經被綁過 todo 解綁還沒做
        const groupData = await checkGroupInfo(app, groupId);
        if (!groupData) {
            //取得line上 此群組的資訊
            const groupData = await ShopnexLineMessage.getLineGroupInf(groupId);

            try {
                // 建立此groupID的資訊表
                await db.query(
                    `insert into \`shopnex\`.t_line_group_inf
                     set ?`,
                    [
                        {
                            group_id: groupId,
                            group_name: groupData.groupName,
                            shopnex_user_name: "shopnex",
                            shopnex_user_id: "shopnex",
                            shopnex_app: "shopnex"
                        },
                    ]
                );
            } catch (err: any) {
                console.log("error create t_line_group_inf -- ", err.response?.data || err.message)
            }
            try {
                // 透過 Reply API 送出歡迎訊息
                await axios.post("https://api.line.me/v2/bot/message/reply", {
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
                                                "uri": `${process.env.saas_domain}/shopnex-line-oauth?groupId=${groupId}`
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
                    headers: {Authorization: `Bearer ${ShopnexLineMessage.token}`}
                });
            } catch (err: any) {
                console.log("error reply line group -- ", err.response?.data || err.message)
            }
        } else {

        }
    }

    public static async handlePostbackEvent(event: any, app: string) {
        const userId = event.source.userId;
        const data = event.postback.data;
        console.log("data -- " , data);
        const userData = await this.getUserProfile(userId)
        // const brandAndMemberType = await App.checkBrandAndMemberType(app);
        console.log(`🔹 Postback 事件來自: ${userId}, data: ${data}`);
        console.log("saasConfig.SAAS_NAME -- ", saasConfig.SAAS_NAME)
        // 解析 `data` 參數
        const queryParams = new URLSearchParams(data);
        const action = queryParams.get("action");

        switch (action) {
            case "verify":

                // await this.sendPrivateMessage(userId, "🔐 請輸入驗證碼以完成群組綁定。");
                break;

            case "order_status":
                await this.sendPrivateMessage(userId, "📦 您的訂單正在處理中！");
                break;
            case "selectSpec": {

                function isNowWithinRange(
                    start_date: string,
                    start_time: string,
                    end_date: string,
                    end_time: string
                ): boolean {
                    // 合成開始時間與結束時間
                    const startDateTime = new Date(`${start_date}T${start_time}:00`);
                    const endDateTime = new Date(`${end_date}T${end_time}:00`);

                    // 獲取當前時間
                    const now = new Date();
                    const gmt8Now = new Date(
                        new Intl.DateTimeFormat("en-US", {
                            timeZone: "Asia/Taipei",
                            hourCycle: "h23",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }).format(now)
                    );
                    // 判斷現在時間是否介於開始和結束時間之間
                    return gmt8Now >= startDateTime && gmt8Now <= endDateTime;
                }
                async function checkTempCart(scheduledID: string, userId: string) {
                    if (scheduledID == "" || userId == "") {
                        return ``
                    }
                    return await db.query(`
                        SELECT *
                        FROM ${appName}.t_temporary_cart
                        WHERE JSON_EXTRACT(content, '$.from.purchase') = 'group_buy'
                          AND JSON_EXTRACT(content, '$.from.scheduled_id') = '${scheduledID}'
                          AND JSON_EXTRACT(content, '$.from.source') = 'LINE'
                          AND JSON_EXTRACT(content, '$.from.user_id') = ?
                          AND JSON_EXTRACT(content, '$.cart_data') IS NULL
                    `, [userId])
                }

                function generateRandomNumberCode(length: number = 12): string {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let code = '';
                    for (let i = 0; i < length; i++) {
                        const randomIndex = Math.floor(Math.random() * chars.length);
                        code += chars[randomIndex];
                    }
                    return code;
                }

                async function checkCartIdExists(cartId: string, appName: string): Promise<boolean> {
                    try {
                        const result = await db.query(`
                            SELECT COUNT(*) AS count
                            FROM \`${appName}\`.t_temporary_cart
                            WHERE cart_id = ?
                        `, [cartId]);

                        return result[0].count > 0; // 如果 count 大於 0，表示 cart_id 已存在
                    } catch (err: any) {
                        console.error("Error checking cart_id:", err.response?.data || err.message);
                        return false;
                    }
                }

                async function insertCart(cartId: string, content: object, appName: string): Promise<void> {
                    const exists = await checkCartIdExists(cartId, appName);

                    if (exists) {
                        console.log(`Cart ID ${cartId} already exists.`);
                        return;
                    }

                    try {
                        await db.query(`
                            INSERT INTO \`${appName}\`.t_temporary_cart (cart_id, content)
                            VALUES (?, ?)
                        `, [cartId, JSON.stringify(content)]);

                        console.log(`Cart ID ${cartId} inserted successfully.`);
                    } catch (err: any) {
                        console.error("Error inserting cart data:", err.response?.data || err.message);
                    }
                }

                async function insertUniqueCart(content: any, appName: string): Promise<string> {
                    let cartId: string = "";
                    let unique = false;

                    while (!unique) {
                        cartId = generateRandomNumberCode();
                        unique = !(await checkCartIdExists(cartId, appName));
                    }
                    content.checkUrl = `https://${brandAndMemberType.domain}/checkout?source=group_buy&cart_id=${cartId}`
                    await insertCart(cartId, content, appName);
                    return cartId
                }

                async function getScheduled(scheduledID: string) {
                    try {
                        return (await db.query(`SELECT *
                                                FROM ${appName}.t_live_purchase_interactions
                                                WHERE \`id\` = ${scheduledID}`, []))[0] || 0;
                    } catch (err: any) {
                        console.error("Error get data:", err.response?.data || err.message);
                    }
                }

                async function updateScheduled(content: any) {
                    try {
                        await db.query(`
                            UPDATE ${appName}.t_live_purchase_interactions
                            SET ?
                            WHERE \`id\` = ?
                        `, [{content: JSON.stringify(content)}, scheduledID])
                    } catch (err: any) {
                        console.log("UPDATE t_live_purchase_interactions error : ", err.response?.data || err.message)
                    }
                }
                function calcPrice(cartData:any){
                    //初始化scheduled的pending_order_total
                    scheduledData.content.pending_order_total = scheduledData.content.pending_order_total ?? 0;
                    //這張購物車的總價增加
                    cartData.total = parseInt(cartData.total , 10) + parseInt(price as string, 10);
                    //scheduled裡的賣出總價增加
                    scheduledData.content.pending_order_total = scheduledData.content.pending_order_total ?? 0;
                    scheduledData.content.pending_order_total += parseInt(price as string, 10);
                    //在scheduled這個表裡的這個商品售出量++
                    variant.live_model.sold++;
                }


                //團購單ID
                const scheduledID = queryParams.get('scheduledID');
                //哪個商店的
                const appName = queryParams.get('g-app') ?? "";
                //點擊哪個商品
                const productID = queryParams.get('productID');
                //點擊商品的規格
                const spec = queryParams.get('spec') === "單一規格" ? "" : queryParams.get('spec');
                //點擊商品的價格
                const price = queryParams.get('price');

                //先取得團購單上的內容
                const scheduledData:ScheduledInfo = await getScheduled(scheduledID as string);
                await new CustomerSessions(appName).checkAndRestoreCart(scheduledData)
                if (scheduledData.status!=1 || !isNowWithinRange(scheduledData.content.start_date,scheduledData.content.start_time,scheduledData.content.end_date,scheduledData.content.end_time)){
                    await this.sendPrivateMessage(userId, `🚫【團購已結束】🚫\n感謝您的關注！此次團購已經結束，無法再下單。\n請稍後關注群組內的新活動通知，期待您下一次的參與！🎉`)
                    return
                }
                //比對商品資訊
                const item_list = scheduledData.content.item_list;
                //找到確切點到哪個商品 放到購物車 (但購物車內容比較簡單 或許這邊的過程可以省略 直接放在點擊事件上)
                const item = item_list.find((item: any) => {
                    return item.id == productID
                });

                let variant = item!.content.variants.find((item: any) => {
                    return item.spec.join(',') == spec
                });

                //製作購物車
                const cart = {
                    id: productID,
                    spec: spec,
                    count: 1
                }

                const brandAndMemberType = await App.checkBrandAndMemberType(appName);

                //確認現在的團購單 這個用戶是否已經有購物車了
                let cartData = await checkTempCart(scheduledID ?? "", userId);
                let cartID = ""
                variant.live_model.sold = variant.live_model.sold ?? 0;
                //todo 若是這項商品已經完售 要做怎樣通知

                if (variant.live_model.sold == variant.live_model.available_Qty) {
                    await this.sendPrivateMessage(userId, `⚠️ 很抱歉，您選擇的商品已售完！😭\n\n請查看其他商品，或關注下一波補貨通知！🔔`)
                //沒有購物車 做插入購物車的動作
                } else if (!cartData || cartData.length == 0) {
                    let content = {
                        from: {
                            purchase: "group_buy",
                            scheduled_id: scheduledID,
                            source: "LINE",
                            user_id: userId,
                            user_photo: userData.pictureUrl,
                            user_name: userData.displayName
                        },
                        cart: [cart],
                        total: price,
                    };
                    calcPrice(content);
                    cartID = await insertUniqueCart(content, appName);
                    //取得購物車資訊之後 推進待定表中
                    scheduledData.content.pending_order = scheduledData.content.pending_order ?? [];
                    scheduledData.content.pending_order.push(cartID);
                    await updateScheduled(scheduledData.content);
                    await this.sendPrivateMessage(userId, `🛒 您的商品已成功加入購物車，\n\nhttps://${brandAndMemberType.domain}/checkout?source=group_buy&cart_id=${cartID}\n\n請點擊上方連結查看您的購物車內容！`)
                } else {
                    //若是已經有購物車了 就開始尋找購物車裡跟這次商品相同的
                    let changeData = cartData[0].content.cart.find((item: any) => {
                        return item.id == productID && item.spec == spec
                    });
                    //有在購物車裡面找到的話 做購物車內容的修改
                    if (changeData) {
                        //判定條件 個人可買數量還有剩 而且全部統一售量也還有剩
                        if (changeData.count <= variant.live_model.limit && variant.live_model.available_Qty > variant.live_model.sold) {
                            changeData.count++;
                        }else{
                            await this.sendPrivateMessage(userId, `⚠️ 很抱歉，您已經達到可購買的數量上限。`)
                            return
                        }
                    } else {
                        //若是沒找到商品就推進購物車
                        cartData[0].content.cart.push(cart);
                    }
                    calcPrice(cartData[0].content);
                    await updateScheduled(scheduledData.content);
                    await this.sendPrivateMessage(userId, `🛒 您的商品已成功加入購物車，\n\nhttps://${brandAndMemberType.domain}/checkout?source=group_buy&cart_id=${cartData[0].cart_id}\n\n請點擊上方連結查看您的購物車內容！`)
                    try {
                        await db.query(`
                            UPDATE ${appName}.t_temporary_cart
                            SET ?
                            WHERE cart_id = ?
                        `, [{content: JSON.stringify(cartData[0].content)}, cartData[0].cart_id])
                    } catch (err: any) {
                        console.log("UPDATE t_temporary_cart error : ", err.response?.data || err.message)
                    }
                }
                break
            }
            default:
                console.log("⚠️ 未知的 Postback 事件");
                break;
        }
    }

    // 發送私訊給用戶
    public static async sendPrivateMessage(userId: string, message: string) {
        await axios.post("https://api.line.me/v2/bot/message/push", {
            to: userId,
            messages: [{type: "text", text: message}]
        }, {
            headers: {Authorization: `Bearer ${ShopnexLineMessage.token}`}
        });
    }

    private static async getLineGroupInf(groupId: string) {
        const url = `https://api.line.me/v2/bot/group/${groupId}/summary`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ShopnexLineMessage.token}`,
        };
        try {
            const response = await axios.get(url, {headers});
            return response.data;
        } catch (error: any) {
            console.error('取得群組資訊錯誤:', error.response?.data || error.message);
        }
    }

    public static async generateVerificationCode(app: string,) {
        async function getOrGenerateVerificationCode(appName: string): Promise<string> {
            // **🔍 1️⃣ 檢查是否已有驗證碼**
            const existingCode = await findExistingCode(appName);
            if (existingCode) {
                return existingCode;
            }

            // **🔹 2️⃣ 若無驗證碼，則生成唯一驗證碼**
            const newCode = await generateUniqueCode();
            await storeVerificationCode(appName, newCode);

            return newCode;
        }

        // **🔍 查詢 `app_name` 是否已有驗證碼**
        async function findExistingCode(appName: string): Promise<string | null> {
            try {
                const rows: any = await db.query(`
                    SELECT verification_code
                    FROM shopnex.t_app_line_group_verification
                    WHERE app_name = ? LIMIT 1
                `, [appName]);

                return rows.length > 0 ? rows[0].verification_code : null;
            } catch (e: any) {
                console.error("❌ 查詢現有驗證碼錯誤:", e.message);
                return null;
            }
        }

        // **🔹 生成 8 碼唯一驗證碼**
        async function generateUniqueCode(): Promise<string> {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789"; // 小寫字母 + 數字
            let code = "";

            function generateCode(): string {
                let newCode = "";
                for (let i = 0; i < 8; i++) {
                    const randomIndex = Math.floor(Math.random() * chars.length);
                    newCode += chars[randomIndex];
                }
                return newCode;
            }

            // 迴圈檢查是否重複
            do {
                code = generateCode();
            } while (await findRepeatCode(code));

            return code;
        }

        // **🔹 檢查是否有重複的驗證碼**
        async function findRepeatCode(code: string): Promise<boolean> {
            try {
                const rows: any = await db.query(`
                    SELECT 1
                    FROM shopnex.t_app_line_group_verification
                    WHERE verification_code = ? LIMIT 1
                `, [code]);
                return rows.length > 0;
            } catch (e: any) {
                console.error("❌ 查詢重複驗證碼錯誤:", e.message);
                return false;
            }
        }

        // **🔹 插入新驗證碼**
        async function storeVerificationCode(appName: string, code: string) {
            try {
                await db.execute(`
                    INSERT INTO shopnex.t_app_line_group_verification (app_name, verification_code)
                    VALUES (?, ?)
                `, [appName, code]);
            } catch (e: any) {
                console.error("❌ 插入驗證碼錯誤:", e.message);
            }
        }

        // **🔹 測試：取得或生成驗證碼**
        const code = await getOrGenerateVerificationCode(app);
        return code
    }

    public static async verifyVerificationCode(data: any) {
        async function getShopnexLineGroupInf() {
            try {
                const rawData = await db.query(`
                    SELECT *
                    FROM shopnex.t_line_group_inf
                    WHERE group_id = ?
                `, [data.groupId])
                return rawData.length > 0 ? rawData[0] : null;
            } catch (err: any) {
                console.error("❌ 查詢 app_name 失敗:", err.response?.data || err.message);
                return null;
            }
        }

        async function getShopnexVerificationCode() {
            try {
                const rawData = await db.query(`
                    SELECT *
                    FROM shopnex.t_app_line_group_verification
                    WHERE verification_code = ?
                `, [data.code ?? ""])
                return rawData.length > 0 ? rawData[0] : null;
            } catch (err: any) {
                console.error("❌ 查詢 app_name 失敗:", err.response?.data || err.message);
                return null;
            }
        }

        const lineGroupData = await getShopnexLineGroupInf();
        if (!lineGroupData) {
            return {
                result: "error",
                data: "查無此Group ID"
            }
        }
        if (lineGroupData.shopnex_app != "shopnex") {
            return {
                result: "error",
                data: "此LINE群組已綁定"
            }
        }
        let verificationData = await getShopnexVerificationCode();
        if (verificationData) {
            const brandAndMemberType = await App.checkBrandAndMemberType(verificationData.app_name);
            try {
                await db.query(`
                    UPDATE shopnex.t_line_group_inf
                    SET ?
                    WHERE group_id = ?
                `, [{
                    shopnex_user_name: brandAndMemberType.userData.name,
                    shopnex_app: verificationData.app_name,
                    shopnex_user_id: brandAndMemberType.user_id
                }, data.groupId])
            } catch (err: any) {
                console.error("❌ 更新 t_line_group_inf 失敗:", err.response?.data || err.message);
                return {
                    result: "error",
                    data: "更新 t_line_group_inf 失敗"
                }
            }
        } else {
            return {
                result: "error",
                data: "驗證碼錯誤"
            }
        }
        return {
            data: "OK"
        }
    }

    public static async getLineGroup(app: string) {
        try {
            return await db.query(`
                select *
                FROM shopnex.t_line_group_inf
                WHERE shopnex_app = ?
            `, [app]);
        } catch (err: any) {
            console.error("❌ 查詢 line 群組 失敗:", err.response?.data || err.message);
            return null;
        }

    }

    public static async getUserProfile(userId: string) {

        const url = `https://api.line.me/v2/bot/profile/${userId}`;
        const headers = {
            "Authorization": `Bearer ${ShopnexLineMessage.token}`
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data; // 返回使用者資訊
        } catch (error:any) {
            console.error("無法獲取使用者資訊:", error.response?.data || error.message);
            return null;
        }
    }
}


