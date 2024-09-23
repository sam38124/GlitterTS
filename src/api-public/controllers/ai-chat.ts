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

const router: express.Router = express.Router();

export = router;

router.post('/sync-data', async (req: express.Request, resp: express.Response) => {
    const file1 = tool.randomString(10) + '.json';
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
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
                    messageThread: '',
                },
            }
        ).value;
        (
            await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
                page: 0,
                limit: 5000,
                shipment: req.query.shipment as string,
            })
        ).data.map((order: any) => {
            const orderData = order.orderData;
            exportData.push({
                訂單編號: order.cart_token,
                訂單建立時間: moment(order.created_time).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                會員信箱: order.email ?? 'none',
                訂單處理狀態: (() => {
                    switch (orderData.orderStatus ?? '0') {
                        case '-1':
                            return '已取消';
                        case '1':
                            return '已完成';
                        case '0':
                        default:
                            return '處理中';
                    }
                })(),
                付款狀態: (() => {
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
                出貨狀態: (() => {
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
                訂單小計: orderData.total + orderData.discount - orderData.shipment_fee + orderData.use_rebate,
                訂單運費: orderData.shipment_fee,
                訂單使用優惠券: orderData.voucherList.map((voucher: any) => voucher.title).join(', '),
                訂單折扣: orderData.discount,
                訂單使用購物金: orderData.use_rebate,
                訂單總計: orderData.total,
                購買商品列表: orderData.lineItems.map((item: any) => {
                    return {
                        商品名稱: item.title,
                        商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
                        商品SKU: item.sku ?? '',
                        商品購買數量: item.count,
                        商品價格: item.sale_price,
                        商品折扣: item.discount_price,
                    };
                }),
                // value by user
                顧客姓名: orderData.customer_info.name,
                顧客手機: orderData.customer_info.phone,
                顧客信箱: orderData.customer_info.email,
                收件人姓名: orderData.user_info.name,
                收件人手機: orderData.user_info.phone,
                收件人信箱: orderData.user_info.email,
                備註: orderData.user_info.note ?? '',
            });
        });
        //寫入
        fs.writeFileSync(file1, JSON.stringify(exportData));
        //上傳訂單數據檔案
        const file = await openai.files.create({
            file: fs.createReadStream(file1),
            purpose: 'fine-tune',
        });
        fs.rmSync(file1);
        if (!cf.messageThread) {
            cf.messageThread = (await openai.beta.threads.create()).id;
        }
        await new Private_config(req.body.token).setConfig({
            appName: req.get('g-app') as string,
            key: 'ai_config',
            value: {
                order_files: file.id,
                messageThread: cf.messageThread,
            },
        });
        return response.succ(resp, {
            result: true,
            data: file.id,
        });
    } catch (err) {
        console.log(err);
        fs.rmSync(file1);
        return response.fail(resp, err);
    }
});

function convertToJsonLine(inputFile: string, outputFile: string) {
    return new Promise((resolve, reject) => {
        // 读取 JSON 文件
        fs.readFile(inputFile, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file: ${err}`);
                return;
            }

            // 解析 JSON 数据
            let jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (error) {
                console.error(`Error parsing JSON data: ${error}`);
                return;
            }

            // 生成 JSONL 数据
            const jsonlData = jsonData.map((entry: any) => JSON.stringify(entry)).join('\n');

            // 写入 JSONL 文件
            fs.writeFile(outputFile, jsonlData, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file: ${err}`);
                    reject();
                } else {
                    resolve(true);
                    console.log(`File has been converted to ${outputFile}`);
                }
            });
        });
    });
}
