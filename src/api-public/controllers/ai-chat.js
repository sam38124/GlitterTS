"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../../modules/response.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const shopping_js_1 = require("../services/shopping.js");
const moment_1 = __importDefault(require("moment"));
const private_config_js_1 = require("../../services/private_config.js");
const router = express_1.default.Router();
router.post('/sync-data', async (req, resp) => {
    var _a;
    const file1 = tool_js_1.default.randomString(10) + '.json';
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const type = req.body.type;
    try {
        const exportData = [];
        let cf = ((_a = (await private_config_js_1.Private_config.getConfig({
            appName: req.get('g-app'),
            key: 'ai_config',
        }))[0]) !== null && _a !== void 0 ? _a : {
            value: {
                order_files: '',
                "writer": '',
                "order_analysis": '',
                "operation_guide": ""
            },
        }).value;
        cf[type] = (await openai.beta.threads.create()).id;
        async function syncOrderData() {
            (await new shopping_js_1.Shopping(req.get('g-app'), req.body.token).getCheckOut({
                page: 0,
                limit: 5000,
                shipment: req.query.shipment,
            })).data.map((order) => {
                var _a, _b, _c;
                const orderData = order.orderData;
                orderData.customer_info = (_a = orderData.customer_info) !== null && _a !== void 0 ? _a : {};
                exportData.push({
                    訂單編號: order.cart_token,
                    訂單建立時間: (0, moment_1.default)(order.created_time).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                    會員信箱: (_b = order.email) !== null && _b !== void 0 ? _b : 'none',
                    訂單處理狀態: (() => {
                        var _a;
                        switch ((_a = orderData.orderStatus) !== null && _a !== void 0 ? _a : '0') {
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
                        var _a;
                        switch ((_a = order.status) !== null && _a !== void 0 ? _a : 0) {
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
                        var _a;
                        switch ((_a = orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
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
                    訂單使用優惠券: orderData.voucherList.map((voucher) => voucher.title).join(', '),
                    訂單折扣: orderData.discount,
                    訂單使用購物金: orderData.use_rebate,
                    訂單總計: orderData.total,
                    購買商品列表: orderData.lineItems.map((item) => {
                        var _a;
                        return {
                            商品名稱: item.title,
                            商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
                            商品SKU: (_a = item.sku) !== null && _a !== void 0 ? _a : '',
                            商品購買數量: item.count,
                            商品價格: item.sale_price,
                            商品折扣: item.discount_price,
                        };
                    }),
                    顧客姓名: orderData.customer_info.name,
                    顧客手機: orderData.customer_info.phone,
                    顧客信箱: orderData.customer_info.email,
                    收件人姓名: orderData.user_info.name,
                    收件人手機: orderData.user_info.phone,
                    收件人信箱: orderData.user_info.email,
                    備註: (_c = orderData.user_info.note) !== null && _c !== void 0 ? _c : '',
                });
            });
            fs_1.default.writeFileSync(file1, JSON.stringify(exportData));
            const file = await openai.files.create({
                file: fs_1.default.createReadStream(file1),
                purpose: 'assistants',
            });
            fs_1.default.rmSync(file1);
            cf.order_files = file.id;
        }
        if (type === 'order_analysis') {
            await syncOrderData();
        }
        for (const b of (await database_js_1.default.query(`SELECT *
                                        FROM \`${req.get('g-app')}\`.t_chat_detail where chat_id=? order by id desc limit 0,5`, [
            [type, 'manager'].sort().join('-')
        ])).reverse()) {
            if (b.message.text) {
                await openai.beta.threads.messages.create(cf[type], { role: (b.user_id === 'robot') ? 'assistant' : 'user', content: b.message.text });
            }
        }
        await new private_config_js_1.Private_config(req.body.token).setConfig({
            appName: req.get('g-app'),
            key: 'ai_config',
            value: cf,
        });
        return response_js_1.default.succ(resp, {
            result: true
        });
    }
    catch (err) {
        console.log(err);
        try {
            fs_1.default.rmSync(file1);
        }
        catch (e) {
        }
        return response_js_1.default.fail(resp, err);
    }
});
router.delete('/reset', async (req, resp) => {
    const file1 = tool_js_1.default.randomString(10) + '.json';
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const type = req.body.type;
    try {
        (await database_js_1.default.query(`delete FROM \`${req.get('g-app')}\`.t_chat_detail where chat_id=? and id>0`, [
            [type, 'manager'].sort().join('-')
        ]));
        return response_js_1.default.succ(resp, {
            result: true
        });
    }
    catch (err) {
        console.log(err);
        fs_1.default.rmSync(file1);
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=ai-chat.js.map