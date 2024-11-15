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
const json2csv_1 = require("json2csv");
const ai_robot_js_1 = require("../services/ai-robot.js");
const router = express_1.default.Router();
router.post('/sync-data', async (req, resp) => {
    var _a;
    const file1 = tool_js_1.default.randomString(10) + '.csv';
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
                var _a, _b;
                const orderData = order.orderData;
                orderData.customer_info = (_a = orderData.customer_info) !== null && _a !== void 0 ? _a : {};
                exportData.push({
                    order_id: order.cart_token,
                    order_date: (0, moment_1.default)(order.created_time).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'),
                    payment_status: (() => {
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
                    shipment_status: (() => {
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
                    shipping_cost: orderData.shipment_fee,
                    voucher_list: orderData.voucherList.map((voucher) => {
                        return voucher.title;
                    }).join('|'),
                    total_discount: orderData.discount,
                    use_rebate: orderData.use_rebate,
                    total_amount: orderData.total,
                    items: orderData.lineItems.map((item) => {
                        var _a;
                        return {
                            product_name: item.title,
                            spec: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
                            sku: (_a = item.sku) !== null && _a !== void 0 ? _a : '',
                            quantity: item.count,
                            unit_price: item.sale_price,
                            discount: item.discount_price,
                        };
                    }),
                    customer_name: orderData.customer_info.name,
                    customer_phone: orderData.customer_info.phone,
                    customer_email: orderData.customer_info.email,
                    note: (_b = orderData.user_info.note) !== null && _b !== void 0 ? _b : '',
                });
            });
            console.log(`exportData=>`, JSON.stringify(exportData));
            const json2csvParser = new json2csv_1.Parser();
            const csv = json2csvParser.parse(exportData);
            fs_1.default.writeFileSync(file1, csv);
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
            if (b.message.prompt) {
                await openai.beta.threads.messages.create(cf[type], { role: (b.user_id === 'robot') ? 'assistant' : 'user', content: b.message.prompt });
            }
            else if (b.message.text) {
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
router.post('/generate-html', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, {
            result: true,
            data: await ai_robot_js_1.AiRobot.codeGenerator(req.get('g-app'), req.body.text)
        });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/search-product', async (req, resp) => {
    try {
        const openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const thread = (await openai.beta.threads.create()).id;
        const pd = await new shopping_js_1.Shopping(req.get('g-app'), req.body.token).getProduct({ page: 0, limit: 10000 });
        for (const b of pd.data) {
            let qu = [`商品名稱為:${b.content.title}`, `商品ID為:${b.content.id}`, `商品價格為:${b.content.min_price}`];
            if (b.content.ai_description) {
                qu.push(`商品描述為:${b.content.ai_description}`);
            }
            const content = `新增一件商品，${qu.join('，')}
`;
            console.log(`content+`, content);
            await openai.beta.threads.messages.create(thread, { role: 'user', content: content });
        }
        return response_js_1.default.succ(resp, {
            result: true,
            data: await ai_robot_js_1.AiRobot.searchProduct(req.get('g-app'), req.body.text, thread)
        });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
router.post('/edit-component', async (req, resp) => {
    try {
        return response_js_1.default.succ(resp, {
            result: true,
            data: await ai_robot_js_1.AiRobot.codeEditor(req.get('g-app'), req.body.text, req.body.format, req.body.assistant)
        });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=ai-chat.js.map