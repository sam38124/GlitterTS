import {IToken} from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import {ShopnexLineMessage} from "./model/shopnex-line-message";
import axios from "axios";
import {Shopping} from "./shopping";

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
    }
}

interface RawProduct {
    content: {
        id: string,
        title: string;
        variants: {
            spec: string[];
            sale_price: number;
            preview_image: string;
        }[];
    };
}

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    selectedSpec?: string;
    options: { label: string; value: string }[];
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
                options: { label: string; value: string }[];
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
                    const price = variants.length > 0 ? Math.min(...variants.map(v => v.sale_price)) : 0;

                    // 取得第一張商品圖片
                    const imageUrl = variants.length > 0 ? variants[0].preview_image : "";

                    // 轉換規格選項
                    const options = variants.map(v => ({
                        label: v.spec.join(','), // 規格名稱
                        value: v.spec.join(',') // 規格值
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

            const transProducts: Product[] = convertToProductFormat(content.item_list);
            const queryData = await db.query(`INSERT INTO \`${this.app}\`.\`t_live_purchase_interactions\`
                                              SET ?;`, [{
                type: data.type,
                name: data.name,
                status: "1",
                content: JSON.stringify(content)
            }])
            const flexMessage = generateProductCarousel(transProducts, this.app, queryData.insertId);
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

    async getScheduled(){
        const appName = this.app;
        async function getSel(){
            try {
                return await db.query(`
                SELECT * FROM \`${appName}\`.\`t_live_purchase_interactions\`
                `,[])
            }catch (err:any){
                console.error('取得資料錯誤:', err.response?.data || err.message);
            }
        }
        return await getSel();

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
                        id: string,
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
                        `, [oridata.content.from.id])
                        const preview = await new Shopping(this.app, this.token).toCheckout({
                            code_array: [],
                            return_url: "",
                            user_info: undefined,
                            line_items:oridata.content.cart.map((item:any)=>{
                                return{
                                    id:item.id,
                                    spec:item.spec.split(","),
                                    count:item.count,
                                    sale_price:item.price,
                                    sku:"",
                                    shipment_obj:{
                                        type:'volume',
                                        value:1,
                                    },
                                    weight: 0,
                                    stock: 1,
                                    show_understocking: 'true' ,
                                    designated_logistics: {
                                        type: 'all' ,
                                        list: [],
                                    },
                                }
                            })
                        },"preview");
                        return {
                            interaction : interaction[0],
                            cartData : oridata,
                            preview_order : preview.data,
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

    async listenChatRoom() {

    }

}