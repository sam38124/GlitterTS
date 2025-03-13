import {IToken} from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { CartInfo, ScheduledInfo, ShopnexLineMessage } from './model/shopnex-line-message';
import axios from "axios";
import {loadFont} from "jimp";
import {Shopping} from "./shopping.js";
import {Stock} from "./stock.js";
import {Shopee} from "./shopee.js";

const mime = require('mime');

interface scheduled {
    type: string,
    name: string,
    streamer: string,
    platform: string,
    item_list: any[],
    stock: {
        reserve: boolean,
        expiry_date?: string,
        period: string,
    },
    discount_set: boolean,
    lineGroup: {
        groupId: string,
        groupName: string,
    },
    start_date: string,
    start_time: string,
    end_date: string,
    end_time: string
}

interface RawProduct {
    content: {
        id: string,
        title: string;
        variants: {
            spec: string[];
            sale_price: number;
            preview_image: string;
            live_model: {
                live_price: number;
                available_Qty: number;
            };
        }[];
    };
}

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    selectedSpec?: string;
    options: { label: string; value: string, price: number }[];
}

export class CustomerSessions {
    public app;
    public token ?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async createScheduled(data: scheduled): Promise<{ result: boolean; message: string }> {
        try {
            const appName = this.app

            function generateProductCarousel(products: {
                id: string
                name: string;
                price: number;
                imageUrl: string;
                selectedSpec?: string;
                options: { label: string; value: string, price: number }[];
            }[], appName: string, scheduledID: string) {
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
                                        text: `$ ${product.price.toLocaleString()} 起`,
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
                                            text: (option.label.length > 0)?option.label:"單一規格",
                                            size: "sm",
                                            color: "#0D6EFD",
                                            align: "center",
                                            action: {
                                                type: "postback",
                                                data: `action=selectSpec&productID=${product.id}&spec=${(option.value.length > 0)?option.value:"單一規格"}&g-app=${appName}&scheduledID=${scheduledID}&price=${option.price}`,
                                            }
                                        },
                                        ...(idx < product.options.length - 1 ? [{type: "separator", margin: "sm"}] : []) // ✅ 只在 `text` 之間加 `separator`
                                    ])
                                ]
                            }
                        }))
                    }
                };
            }

            function convertToProductFormat(rawData: RawProduct[]): Product[] {
                return rawData.map(item => {
                    const id = item.content.id
                    const content = item.content;
                    const name = content.title || "未知商品";
                    const variants = content.variants || [];
                    // 取得最低價格
                    const price = variants.length > 0 ? Math.min(...variants.map(v => v.live_model.live_price)) : 0;

                    // 取得第一張商品圖片
                    const imageUrl = variants.length > 0 ? variants[0].preview_image : "";
                    // 轉換規格選項
                    const options = variants.map(v => ({
                        label: v.spec.length > 0 ? v.spec.join(',') : "", // 避免空陣列
                        value: v.spec.length > 0 ? v.spec.join(',') : "", // 避免空陣列
                        price: v.live_model.live_price,
                    }));
                    return {
                        id,
                        name,
                        price,
                        imageUrl,
                        selectedSpec: undefined, // 預設無選擇規格
                        options
                    };
                });
            }


            const {type, name, ...content} = data;


            const message = [
                {
                    "type": "text",
                    "text": `📢 團購開始囉！ 🎉\n團購名稱： ${name}\n團購日期： ${content.start_date} ${content.start_time} ~ ${content.end_date} ${content.end_time}\n\n📍 下方查看完整商品清單`
                }
            ]
            const transProducts: Product[] = convertToProductFormat(content.item_list);
            await this.sendMessageToGroup(data.lineGroup.groupId,message)


            const queryData = await db.query(`INSERT INTO \`${this.app}\`.\`t_live_purchase_interactions\`
                                              SET ?;`, [{
                type: data.type,
                name: data.name,
                status: "1",
                content: JSON.stringify(content)
            }])
            const flexMessage = generateProductCarousel(transProducts, this.app, queryData.insertId);

            for (const item of content.item_list) {
                const pdDqlData = (
                  await new Shopping(this.app , this.token).getProduct({
                      page: 0,
                      limit: 50,
                      id: item.id,
                      status: 'inRange',
                  })
                ).data;
                const pd = pdDqlData.content;

                Promise.all(item.content.variants.map(async (variant: any,i:number) => {
                    const returnData = new Stock(this.app, this.token).allocateStock(variant.stockList, variant.live_model.available_Qty);
                    const updateVariant = pd.variants.find((dd: any) => dd.spec.join('-') === variant.spec.join('-'));
                    //預先從庫存倉庫取出後的倉庫列表
                    updateVariant.stockList = returnData.stockList;
                    //將每個scheduled視做一個庫存 做轉化
                    variant.stockList = {}
                    Object.entries(returnData.deductionLog).forEach(([key, value]) => {
                        variant.stockList[key] = {
                            count : value
                        }
                    })
                    if (updateVariant.deduction_log){
                        delete updateVariant.deduction_log;
                    }
                    let newContent = item.content
                    //對t_variants進行資料庫更新
                    await new Shopping(this.app, this.token).updateVariantsWithSpec(updateVariant, item.id, variant.spec);
                })).then(async () => {
                    try {
                        await db.query(
                          `UPDATE \`${this.app}\`.\`t_manager_post\`
                             SET content = ?
                             WHERE id = ?
                            `,
                          [JSON.stringify(pd), item.id]
                        );
                    } catch (error: any) {
                        console.error('發送訊息錯誤:', error.response?.data || error.message);
                    }
                    //如果他有shopee_id 這邊還要處理同步至蝦皮的庫存 todo 還要新增一個是否同步至蝦皮的選項
                    if (pd.shopee_id) {
                        await new Shopee(this.app, this.token).asyncStockToShopee({
                            product: pdDqlData,
                            callback: () => {
                            },
                        });
                    }
                })
            }
            try {
                const res = await axios.post("https://api.line.me/v2/bot/message/push", {
                    to: data.lineGroup.groupId,
                    messages: [flexMessage]
                }, {
                    headers: {Authorization: `Bearer ${ShopnexLineMessage.token}`}
                });
            } catch (error: any) {
                console.error('發送訊息錯誤:', error.response?.data || error.message);
            }

            return {
                result: true,
                message: "OK"
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'createScheduled Error:' + e, null);
        }
    }

    async getScheduled() {
        const appName = this.app;

        function isPastEndTime(end_date: string, end_time: string): boolean {
            const now = new Date();
            const taipeiNow = new Date(
                new Intl.DateTimeFormat("en-US", {
                    timeZone: "Asia/Taipei",
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit", second: "2-digit",
                    hour12: false // 24 小時制
                }).format(now)
            );

            // 🔹 轉換 `end_date` 和 `end_time` 為台灣時間
            const endDateTime = new Date(`${end_date}T${end_time}:00+08:00`); // 明確指定 UTC+8
            // 🔹 比較時間
            return taipeiNow > endDateTime;
        }

        async function getSel() {
            try {
                let data = await db.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_live_purchase_interactions\`
                    order by id desc
                `, [])
                // ✅ 2. 篩選出已過期的團購
                const expiredItems = data.filter((item: any) =>
                    item.status === 1 &&isPastEndTime(item.content.end_date, item.content.end_time)
                );
                if (expiredItems.length !== 0) {
                    await Promise.all(
                      expiredItems.map((item: any) => {
                            item.status = 2;
                            db.query(`
                                UPDATE \`${appName}\`.\`t_live_purchase_interactions\`
                                SET \`status\` = 2
                                WHERE \`id\` = ?;
                            `, [item.id])
                        }
                      )
                    );
                }
                return data
            } catch (err: any) {
                console.error('取得資料錯誤:', err.response?.data || err.message);
            }
        }

        async function getTotal() {
            try {
                return (await db.query(`
                            SELECT count(*)
                            FROM \`${appName}\`.\`t_live_purchase_interactions\`
                    `,
                    []))[0]["count(*)"]
            } catch (err: any) {
                console.error('取得總數錯誤:', err.response?.data || err.message);
            }
        }

        // 同步執行兩個查詢
        async function getDataAndTotal() {
            try {
                const [data, total] = await Promise.all([getSel(), getTotal()]);
                return {data, total};
            } catch (err: any) {
                console.error('獲取資料失敗:', err.response?.data || err.message);
                return {data: [], total: 0};
            }
        }

        return await getDataAndTotal();

    }

    async getOneScheduled(scheduleID: string) {
        const appName = this.app;

        async function getSel() {
            try {
                return await db.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_live_purchase_interactions\`
                    WHERE id = ?
                `, [scheduleID])
            } catch (err: any) {
                console.error('取得資料錯誤:', err.response?.data || err.message);
            }
        }

        const data = await getSel();
        if (data.length > 0) {
            return data[0];
        } else {
            return false
        }
    }

    async changeScheduledStatus(scheduleID: string , status: string) {
        try {
            console.log("scheduleID -- " , scheduleID);
            await db.query(`
                UPDATE \`${this.app}\`.\`t_live_purchase_interactions\`
                SET \`status\` = ?
                WHERE (\`id\` = ?);
            `, [status , scheduleID])
        } catch (err: any) {
            console.error('更新失敗:', err.response?.data || err.message);
        }
    }

    async closeScheduled(scheduleID: string) {
        await this.changeScheduledStatus(scheduleID, "2")
        const data = await this.getOneScheduled(scheduleID);
        const groupID = data.content.lineGroup.groupId;
        const message = [
            {
                type: "text",
                text: `📢【${data.name}團購已結束】📢\n\n感謝大家的熱情參與！🎉 此次團購已正式結束 🛒\n\n📍 請已下單的朋友們儘快完成結帳，這將確保您的訂單保留，不會被取消哦！。\n📍 \n📍 完成結帳後，您將收到訂單確認通知，接著我們會安排出貨事宜。 📦\n📍 若有任何問題，請聯繫管理員\n\n💡 期待下次與大家一起搶好康！🎁`
            }
        ]
        await this.sendMessageToGroup(groupID , message)


    }

    async finishScheduled(scheduleID: string) {
        await this.changeScheduledStatus(scheduleID, "3")
    }

    async sendMessageToGroup(groupID: string , message:any[]) {
        try {
            const res = await axios.post("https://api.line.me/v2/bot/message/push", {
                to: groupID,
                messages: message
            }, {
                headers: {Authorization: `Bearer ${ShopnexLineMessage.token}`}
            });
        } catch (error: any) {
            console.error('發送訊息錯誤:', error.response?.data || error.message);
        }
    }

    async getOnlineCart(cartID: string) {
        async function getTempCart(app: string, cartID: string) {
            try {
                return await db.query(`
                    SELECT *
                    FROM ${app}.t_temporary_cart
                    WHERE cart_id = ?
                `, [cartID]);
            } catch (err: any) {
                console.error('get temp cart error:', err.response?.data || err.message);
            }
        }

        const cartData = await getTempCart(this.app, cartID);

        if (cartData.length > 0) {
            let oridata: {
                id: number,
                cart_id: string,
                content: {
                    cart: [],
                    from: {
                        scheduled_id: string,
                        source: string,
                        user_id: string,
                        purchase: string
                    }
                },
            } = cartData[0]
            switch (oridata.content.from.purchase) {
                case "group_buy": {
                    try {
                        const interaction = await db.query(`
                            SELECT *
                            FROM ${this.app}.t_live_purchase_interactions
                            WHERE id = ?
                        `, [oridata.content.from.scheduled_id])
                        return {
                            interaction: interaction[0],
                            cartData: oridata,
                        }
                    } catch (err: any) {
                        console.error('get t_live_purchase_interactions error:', err.response?.data || err.message);
                    }

                    break;
                }
                default: {

                }
            }

            return cartData[0]
        }
        return ""
    }

    async getCartList(scheduleID: string) {
        const appName = this.app;
        const token = this.token;

        async function getSel() {
            try {
                const data = await db.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_temporary_cart\`
                    WHERE JSON_EXTRACT(content, '$.from.scheduled_id') = ?
                `, [scheduleID]);
                if (data.length === 0) return [];
                const orderIds: string[] = data
                    .map((item: any) => {
                        try {
                            const parsedContent = item.content;
                            return parsedContent?.cart_data?.order_id as string | undefined;
                        } catch (error) {
                            console.error("JSON 解析失敗:", error);
                            return undefined;
                        }
                    })
                    .filter((id: any): id is string => Boolean(id));
                if (orderIds.length == 0) {
                    return data;
                }
                const checkoutData: any[] = await db.query(`
                    SELECT *
                    FROM \`${appName}\`.\`t_checkout\`
                    WHERE cart_token IN (${orderIds.join(",")})
                `, []);
                const checkoutMap = new Map<string, any>(checkoutData.map(item => [item.cart_token, item]));
                return data.map((cartItem: any) => {
                    try {
                        const parsedContent = cartItem.content;
                        const orderId = parsedContent?.cart_data?.order_id as string | undefined;
                        return {
                            ...cartItem,
                            checkoutInfo: orderId ? checkoutMap.get(orderId) || null : null
                        };
                    } catch (error) {
                        console.error("JSON 解析失敗:", error);
                        return {...cartItem, checkoutInfo: null};
                    }
                })
            } catch (err: any) {
                console.error('取得資料錯誤:', err.response?.data || err.message);
            }
        }

        async function getTotal() {
            try {
                return (await db.query(`
                            SELECT count(*)
                            FROM \`${appName}\`.\`t_temporary_cart\`
                            WHERE JSON_EXTRACT(content, '$.from.scheduled_id') = ?
                    `,
                    [scheduleID]))[0]["count(*)"]
            } catch (err: any) {
                console.error('取得總數錯誤:', err.response?.data || err.message);
            }
        }

        // 同步執行兩個查詢
        async function getDataAndTotal() {
            try {
                const [data, total] = await Promise.all([getSel(), getTotal()]);
                return {data, total};
            } catch (err: any) {
                console.error('獲取資料失敗:', err);
                return {data: [], total: 0};
            }
        }

        return await getDataAndTotal();
    }

    async getRealOrder(cart_array: string[]) {
        return await db.query(`SELECT *
                               FROM \`${this.app}\`.\`t_checkout\`
                               WHERE JSON_EXTRACT(orderData, '$.temp_cart_id') IN (${cart_array.map((cart) => {
                                   return JSON.stringify(cart)
                               }).join(',')});`, [])
    }

    async checkAndRestoreCart(scheduledData:ScheduledInfo){
        let cartDataArray:CartInfo[] =[]
        let cartIDArray:string[] =[]
        const appName = this.app;
        try {
            cartDataArray = await db.query(`
                            SELECT *
                            FROM ${this.app}.t_temporary_cart
                            WHERE cart_id in (?) 
                            AND created_time < DATE_SUB(NOW(), INTERVAL ? DAY);
                        `,[scheduledData.content.pending_order , scheduledData.content.stock.period]);
            // console.log();
            //對已經過期的購物車做庫存釋放
            if (cartDataArray.length > 0){
                cartIDArray = cartDataArray.map((item:any) => item.cart_id)
                //檢索每個過期的購物車
                await Promise.all(cartDataArray.map(async (cartData) => {
                    //檢索每樣商品
                    cartData.content.cart.forEach((cart: {
                        id: string,
                        spec: string,
                        count: number,
                    }) => {
                        //取得scheduled裡的商品列表
                        const item_list = scheduledData.content.item_list;
                        //取得列表內對應購物車的商品
                        const product = item_list.find((item: any) => {
                            return item.id == cart.id
                        });
                        //找到對應的variant
                        let variant = product!.content.variants.find((item: any) => {
                            return item.spec.join(',') == cart.spec
                        });
                        //歸還售出量
                        variant.live_model.sold = variant.live_model.sold - cart.count;
                        //歸還scheduled上的總售出價格
                        scheduledData.content.pending_order_total = scheduledData.content.pending_order_total - (cart.count * variant.live_model.live_price);

                    })
                    // console.log("scheduledData -- " ,scheduledData.content.item_list);
                })).then(async () => {
                    async function updateScheduled(content: any) {
                        try {
                            await db.query(`
                            UPDATE ${appName}.t_live_purchase_interactions
                            SET ?
                            WHERE \`id\` = ?
                        `, [{content: JSON.stringify(content)}, scheduledData.id])
                        } catch (err: any) {
                            console.log("UPDATE t_temporary_cart error : ", err.response?.data || err.message)
                        }
                    }
                    scheduledData.content.pending_order = scheduledData.content.pending_order.filter(item => !cartIDArray.includes(item));
                    console.log("cartIDArray -- " , cartIDArray);
                    console.log("scheduledData.content.pending_order -- " , scheduledData.content.pending_order);
                    await updateScheduled(scheduledData.content);

                })

            }
        }catch (err: any) {
            console.log("UPDATE t_temporary_cart error : ", err.response?.data || err.message)
        }
    }

}