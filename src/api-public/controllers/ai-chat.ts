import express from 'express';
import { Chat, ChatRoom } from '../services/chat';
import response from '../../modules/response.js';
import { UtDatabase } from '../utils/ut-database.js';
import { UtPermission } from '../utils/ut-permission.js';
import db from '../../modules/database.js';
import exception from '../../modules/exception.js';
import tool from '../../modules/tool.js';
import OpenAI from 'openai';
import fs from 'fs';
import { Shopping } from '../services/shopping.js';
import * as util from 'node:util';
import moment from 'moment';
import { Private_config } from '../../services/private_config.js';
import {Ai} from "../../services/ai.js";
import { Parser } from 'json2csv';
const router: express.Router = express.Router();

export = router;

router.post('/sync-data', async (req: express.Request, resp: express.Response) => {
    const file1 = tool.randomString(10) + '.csv';
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const  type:'writer' | 'order_analysis' | 'operation_guide'=req.body.type
    try {
        const exportData: any = [];
        let cf = (
            (
                await Private_config.getConfig({
                    appName: req.get('g-app') as string,
                    key: 'ai_config',
                })
            )[0] ?? {
                value: {
                    order_files: '',
                    "writer": '',
                    "order_analysis":'',
                    "operation_guide":""
                },
            }
        ).value;
        cf[type] = (await openai.beta.threads.create()).id;
        async function syncOrderData(){
            (
                await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                    page: 0,
                    limit: 5000,
                    shipment: req.query.shipment as string,
                })
            ).data.map((order: any) => {
                const orderData = order.orderData;
                orderData.customer_info=orderData.customer_info??{}
                exportData.push({
                    order_id: order.cart_token,
                    order_date: moment(order.created_time).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                    payment_status: (() => {
                        switch (order.status ?? 0) {
                            case 1:
                                return '已付款';
                            case -1:
                                return '付款失敗';
                            case -2:
                                return '已退款';
                            case 0:
                            default:
                                return '未付款';
                        }
                    })(),
                    shipment_status: (() => {
                        switch (orderData.progress ?? 'wait') {
                            case 'shipping':
                                return '已出貨';
                            case 'finish':
                                return '已取貨';
                            case 'arrived':
                                return '已送達';
                            case 'returns':
                                return '已退貨';
                            case 'wait':
                            default:
                                return '未出貨';
                        }
                    })(),
                    shipping_cost: orderData.shipment_fee,
                    voucher_list: orderData.voucherList.map((voucher: any) => {
                        return voucher.title
                    }).join('|'),
                    total_discount: orderData.discount,
                    use_rebate: orderData.use_rebate,
                    total_amount: orderData.total,
                    items: orderData.lineItems.map((item:any)=>{
return {
    product_name: item.title,
    spec: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
    sku: item.sku ?? '',
    quantity: item.count,
    unit_price: item.sale_price,
    discount: item.discount_price,
}
                    }),
                    customer_name: orderData.customer_info.name,
                    customer_phone: orderData.customer_info.phone,
                    customer_email: orderData.customer_info.email,
                    note: orderData.user_info.note ?? '',
                });


            });
            console.log(`exportData=>`,JSON.stringify(exportData))
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(exportData);
            //寫入
            fs.writeFileSync(file1, csv);
            //上傳訂單數據檔案
            const file = await openai.files.create({
                file: fs.createReadStream(file1),
                purpose: 'assistants',
            });
            fs.rmSync(file1);
            cf.order_files=file.id;
        }
        if(type==='order_analysis'){
            await syncOrderData()
        }

        for (const b of (await db.query(`SELECT *
                                        FROM \`${req.get('g-app') as string}\`.t_chat_detail where chat_id=? order by id desc limit 0,5`,[
                                            [type,'manager'].sort().join('-')
        ])).reverse()){
            if(b.message.text){
                await openai.beta.threads.messages.create(cf[type], { role: (b.user_id==='robot') ? 'assistant':'user', content: b.message.text })
            }
        }
        await new Private_config(req.body.token).setConfig({
            appName: req.get('g-app') as string,
            key: 'ai_config',
            value: cf,
        });
        return response.succ(resp, {
            result: true
        });
    } catch (err) {
        console.log(err);
        try {
            fs.rmSync(file1);
        }catch (e) {

        }
        return response.fail(resp, err);
    }
});

router.delete('/reset',async (req: express.Request, resp: express.Response) => {
    const file1 = tool.randomString(10) + '.json';
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const  type:'writer' | 'order_analysis' | 'operation_guide'=req.body.type
    try {
        (await db.query(`delete FROM \`${req.get('g-app') as string}\`.t_chat_detail where chat_id=? and id>0`,[
            [type,'manager'].sort().join('-')
        ]))
        return response.succ(resp, {
            result: true
        });
    } catch (err) {
        console.log(err);
        fs.rmSync(file1);
        return response.fail(resp, err);
    }
})
