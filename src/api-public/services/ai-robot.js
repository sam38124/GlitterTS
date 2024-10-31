"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRobot = void 0;
const private_config_js_1 = require("../../services/private_config.js");
const openai_1 = __importDefault(require("openai"));
const moment_1 = __importDefault(require("moment"));
const ai_1 = require("../../services/ai");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const app_js_1 = require("../../services/app.js");
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const tool_js_2 = __importDefault(require("../../modules/tool.js"));
const process_1 = __importDefault(require("process"));
const fs_1 = __importDefault(require("fs"));
const user_js_1 = require("./user.js");
const shopping_js_1 = require("./shopping.js");
class AiRobot {
    static async guide(app_name, question) {
        var _a, e_1, _b, _c;
        var _d;
        if (!await AiRobot.checkPoints(app_name)) {
            return { text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]` };
        }
        let cf = ((_d = (await private_config_js_1.Private_config.getConfig({
            appName: app_name,
            key: 'ai_config',
        }))[0]) !== null && _d !== void 0 ? _d : {
            value: {
                writer: '',
                order_analysis: '',
                operation_guide: '',
            },
        }).value;
        const openai = new openai_1.default({
            apiKey: process_1.default.env.OPENAI_API_KEY,
        });
        let use_tokens = 0;
        const query = `你是一個後台引導員，請用我提供給你的檔案來回覆問題，檔案中包含一個陣列request與一個response字串。當用戶提出了問題，請先遍歷所有request陣列，判斷提問的內容包含了哪些request的可能，並直接給予response回答，若無法直接從文件中判斷問題的具體內容，也不用解釋，尋找最接近問題的答案即可。`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            tools: [{ type: 'code_interpreter' }],
            tool_resources: {
                code_interpreter: {
                    file_ids: [ai_1.Ai.files.guide],
                },
            },
            model: 'gpt-4o-mini',
        });
        const threadMessages = await openai.beta.threads.messages.create(cf.operation_guide, {
            role: 'user',
            content: question
        });
        const stream = await openai.beta.threads.runs.create(cf.operation_guide, {
            assistant_id: myAssistant.id,
            stream: true
        });
        let text = '';
        try {
            for (var _e = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = await stream_1.next(), _a = stream_1_1.done, !_a; _e = true) {
                _c = stream_1_1.value;
                _e = false;
                const event = _c;
                if (event.data && event.data.content && event.data.content[0] && event.data.content[0].text) {
                    text = event.data.content[0].text.value;
                }
                if (event.data.usage) {
                    use_tokens += event.data.usage.total_tokens;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = stream_1.return)) await _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const regex = /【[^】]*】/g;
        const answer = text.replace(regex, '');
        await openai.beta.assistants.del(myAssistant.id);
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        };
    }
    static async orderAnalysis(app_name, question) {
        var _a, e_2, _b, _c;
        var _d;
        if (!await AiRobot.checkPoints(app_name)) {
            return { text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]` };
        }
        let cf = ((_d = (await private_config_js_1.Private_config.getConfig({
            appName: app_name,
            key: 'ai_config',
        }))[0]) !== null && _d !== void 0 ? _d : {
            value: {
                order_files: '',
                order_analysis: '',
            },
        }).value;
        const openai = new openai_1.default({
            apiKey: process_1.default.env.OPENAI_API_KEY,
        });
        const query = `現在時間為${(0, moment_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss')}，你是一個訂單資料分析師，請依照我給你的檔案，進行訂單資料的分析。
        另外以下3點請注意
        1.如果問題是有關消費金額的計算，僅計算已付款的訂單
        2.我提供給你的檔案類型是csv，相同的order_id代表同一筆訂單
        3.我所有問題都跟檔案內容有關，請不要回答無關內容
        `;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            tools: [{ type: 'code_interpreter' }],
            tool_resources: {
                code_interpreter: {
                    file_ids: [cf.order_files],
                },
            },
            model: 'gpt-4o-mini',
        });
        const threadMessages = await openai.beta.threads.messages.create(cf.order_analysis, {
            role: 'user',
            content: question
        });
        const stream = await openai.beta.threads.runs.create(cf.order_analysis, {
            assistant_id: myAssistant.id,
            stream: true
        });
        let text = '';
        let use_tokens = 0;
        try {
            for (var _e = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = await stream_2.next(), _a = stream_2_1.done, !_a; _e = true) {
                _c = stream_2_1.value;
                _e = false;
                const event = _c;
                if (event.data && event.data.content && event.data.content[0] && event.data.content[0].text) {
                    text = event.data.content[0].text.value;
                }
                if (event.data.usage) {
                    use_tokens += event.data.usage.total_tokens;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = stream_2.return)) await _b.call(stream_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        console.log(`use_tokens==>`, use_tokens);
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        const answer = text.replace(regex, '');
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        };
    }
    static async design(app_name, question) {
        var _a, e_3, _b, _c;
        var _d;
        if (!await AiRobot.checkPoints(app_name)) {
            return { text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]` };
        }
        let cf = ((_d = (await private_config_js_1.Private_config.getConfig({
            appName: app_name,
            key: 'ai_config',
        }))[0]) !== null && _d !== void 0 ? _d : {
            value: {
                design: ''
            },
        }).value;
        const openai = new openai_1.default({
            apiKey: process_1.default.env.OPENAI_API_KEY,
        });
        const query = `你是一個平面設計師，請依據我提供給你的描述，產生prompt，我會利用你提供的資訊去呼叫圖片生成模型`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '平面設計師',
            model: 'gpt-4o-mini',
            response_format: {
                "type": "json_schema", "json_schema": {
                    "name": "prompt",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "繁體中文的prompt"
                            }
                        },
                        "required": [
                            "prompt"
                        ],
                        "additionalProperties": false
                    }
                }
            }
        });
        const threads_id = cf.design;
        const threadMessages = await openai.beta.threads.messages.create(threads_id, { role: 'user', content: question });
        const stream = await openai.beta.threads.runs.create(threads_id, { assistant_id: myAssistant.id, stream: true });
        let text = undefined;
        let use_tokens = 0;
        try {
            for (var _e = true, stream_3 = __asyncValues(stream), stream_3_1; stream_3_1 = await stream_3.next(), _a = stream_3_1.done, !_a; _e = true) {
                _c = stream_3_1.value;
                _e = false;
                const event = _c;
                if (event.data && event.data.content && event.data.content[0] && event.data.content[0].text) {
                    text = JSON.parse(event.data.content[0].text.value);
                }
                if (event.data.usage) {
                    use_tokens += event.data.usage.total_tokens;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = stream_3.return)) await _b.call(stream_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        await openai.beta.assistants.del(myAssistant.id);
        if (text) {
            console.log(text.prompt);
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: text.prompt,
                n: 1,
                size: "1024x1024",
            });
            if (response.data[0]) {
                return {
                    prompt: text.prompt,
                    image: response.data[0].url,
                    usage: await this.usePoints(app_name, 100000 + use_tokens, question, `使用AI進行圖片生成`)
                };
            }
            else {
                return {
                    text: '生成失敗，請輸入更具體一點的描述',
                    usage: 0
                };
            }
        }
        else {
            return {
                text: '生成失敗，請輸入更具體一點的描述',
                usage: 0
            };
        }
    }
    static async writer(app_name, question) {
        var _a, e_4, _b, _c;
        var _d;
        if (!await AiRobot.checkPoints(app_name)) {
            return { text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]` };
        }
        let cf = ((_d = (await private_config_js_1.Private_config.getConfig({
            appName: app_name,
            key: 'ai_config',
        }))[0]) !== null && _d !== void 0 ? _d : {
            value: {
                order_files: '',
                writer: '',
            },
        }).value;
        const openai = new openai_1.default({
            apiKey: process_1.default.env.OPENAI_API_KEY,
        });
        const query = '你是一個電商文案寫手，專門協助撰寫商品描述、行銷文案。';
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            model: 'gpt-4o-mini',
        });
        const threadMessages = await openai.beta.threads.messages.create(cf.writer, { role: 'user', content: question });
        const stream = await openai.beta.threads.runs.create(cf.writer, { assistant_id: myAssistant.id, stream: true });
        let text = '';
        let use_tokens = 0;
        try {
            for (var _e = true, stream_4 = __asyncValues(stream), stream_4_1; stream_4_1 = await stream_4.next(), _a = stream_4_1.done, !_a; _e = true) {
                _c = stream_4_1.value;
                _e = false;
                const event = _c;
                if (event.data && event.data.content && event.data.content[0] && event.data.content[0].text) {
                    text = event.data.content[0].text.value;
                }
                if (event.data.usage) {
                    use_tokens += event.data.usage.total_tokens;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = stream_4.return)) await _b.call(stream_4);
            }
            finally { if (e_4) throw e_4.error; }
        }
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        const answer = text.replace(regex, '');
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        };
    }
    static async checkPoints(app_name) {
        const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(app_name);
        const sum = (await database_js_1.default.query(`SELECT sum(money)
                     FROM \`${brandAndMemberType.brand}\`.t_ai_points
                     WHERE status in (1, 2)
                       and userID = ?`, [brandAndMemberType.user_id]))[0]['sum(money)'] || 0;
        return sum > 0;
    }
    static async usePoints(app_name, token_number, ask, response) {
        let total = token_number * 0.000018 * 10;
        if (total < 1) {
            total = 1;
        }
        total = Math.ceil(total * -1);
        const brandAndMemberType = await app_js_1.App.checkBrandAndMemberType(app_name);
        await database_js_1.default.query(`insert into \`${brandAndMemberType.brand}\`.t_ai_points
                        set ?`, [
            {
                orderID: tool_js_1.default.randomNumber(8),
                money: total,
                userID: brandAndMemberType.user_id,
                status: 1,
                note: JSON.stringify({
                    ask: ask,
                    response: response,
                    token_number: token_number
                })
            }
        ]);
        return total * -1;
    }
    static async syncAiRobot(app) {
        try {
            const copy = await (new user_js_1.User(app)).getConfigV2({ key: 'robot_ai_reply', user_id: 'manager' });
            copy.ai_refer_file = undefined;
            const refer_question = JSON.parse(JSON.stringify(copy));
            refer_question.question = refer_question.question.concat([
                {
                    ask: '查詢我的訂單狀態',
                    response: 'orders-search'
                },
                {
                    ask: '查詢我的訂單配送狀態',
                    response: 'orders-search'
                },
                {
                    ask: '查詢我的訂單付款狀態',
                    response: 'orders-search'
                },
                {
                    ask: '訂單號碼##########的配送狀態',
                    response: 'orders-search'
                },
                {
                    ask: '訂單號碼##########的付款狀態',
                    response: 'orders-search'
                },
                {
                    ask: '訂單號碼##########的狀態',
                    response: 'orders-search'
                }
            ]);
            const jsonStringQA = JSON.stringify(refer_question);
            const file1 = tool_js_2.default.randomString(10) + '.json';
            const openai = new openai_1.default({
                apiKey: process_1.default.env.OPENAI_API_KEY,
            });
            fs_1.default.writeFileSync(file1, jsonStringQA);
            const file = await openai.files.create({
                file: fs_1.default.createReadStream(file1),
                purpose: 'assistants',
            });
            fs_1.default.rmSync(file1);
            copy.ai_refer_file = file.id;
            await (new user_js_1.User(app)).setConfig({ key: 'robot_ai_reply', value: copy, user_id: 'manager' });
            return file.id;
        }
        catch (e) {
        }
    }
    static async aiResponse(app_name, question) {
        var _a, e_5, _b, _c;
        if (!await AiRobot.checkPoints(app_name)) {
            return undefined;
        }
        let cf = await (new user_js_1.User(app_name)).getConfigV2({
            key: 'robot_ai_reply',
            user_id: 'manager'
        });
        const openai = new openai_1.default({
            apiKey: process_1.default.env.OPENAI_API_KEY,
        });
        let use_tokens = 0;
        const query = `你是一個AI客服，請用我提供給你的檔案來回覆問題，檔案中包含一個question的陣列，當用戶提出了問題，請先遍歷question陣列，判斷提問的內容是否與ask或者keywords相關，
        請不要經過任何修改直接回覆response欄位，另外這點請你非常注意若無法找到相關資料，請直接回答『no-data』就好，不要回答其他文字內容。`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: 'AI客服',
            tools: [{ type: 'code_interpreter' }],
            tool_resources: {
                code_interpreter: {
                    file_ids: [cf.ai_refer_file],
                },
            },
            model: 'gpt-4o-mini',
        });
        const threads_id = (await openai.beta.threads.create()).id;
        const threadMessages = await openai.beta.threads.messages.create(threads_id, {
            role: 'user',
            content: question
        });
        const stream = await openai.beta.threads.runs.create(threads_id, {
            assistant_id: myAssistant.id,
            stream: true
        });
        let text = '';
        try {
            for (var _d = true, stream_5 = __asyncValues(stream), stream_5_1; stream_5_1 = await stream_5.next(), _a = stream_5_1.done, !_a; _d = true) {
                _c = stream_5_1.value;
                _d = false;
                const event = _c;
                if (event.data && event.data.content && event.data.content[0] && event.data.content[0].text) {
                    text = event.data.content[0].text.value;
                }
                if (event.data.usage) {
                    use_tokens += event.data.usage.total_tokens;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_5.return)) await _b.call(stream_5);
            }
            finally { if (e_5) throw e_5.error; }
        }
        const regex = /【[^】]*】/g;
        const answer = text.replace(regex, '');
        await openai.beta.assistants.del(myAssistant.id);
        if (answer === 'orders-search') {
            function extractNumbers(text) {
                const numbers = text.match(/\d+/g);
                return numbers ? numbers.map(Number) : '';
            }
            if (extractNumbers(question)) {
                const order_data = await new shopping_js_1.Shopping(app_name).getCheckOut({
                    page: 0,
                    limit: 5000,
                    returnSearch: 'true',
                    search: extractNumbers(question)
                });
                if (order_data) {
                    return {
                        text: [
                            `這筆訂單建立於${(0, moment_1.default)(order_data.created_time).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm')}`,
                            `付款狀態為『 ${(() => {
                                var _a;
                                switch ((_a = order_data.status) !== null && _a !== void 0 ? _a : 0) {
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
                            })()} 』`,
                            `訂單狀態為『 ${(() => {
                                var _a;
                                switch ((_a = order_data.orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
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
                            })()} 』`,
                            `訂單總金額為『 ${order_data.orderData.total} 』`,
                            `購買項目有:\n${order_data.orderData.lineItems.map((item) => {
                                return `${item.title} * ${item.count}`;
                            }).join('\n')} `
                        ].join('\n'),
                        usage: await this.usePoints(app_name, use_tokens, question, answer)
                    };
                }
                else {
                    return {
                        text: '查物相關訂單',
                        usage: await this.usePoints(app_name, use_tokens, question, answer)
                    };
                }
            }
            else {
                return {
                    text: '您好，查詢訂單相關資料必須同時告知訂單號碼，例如:『 訂單號碼1723274721的配送狀態 』',
                    usage: await this.usePoints(app_name, use_tokens, question, answer)
                };
            }
        }
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        };
    }
    static async codeGenerator(app_name, question) {
        var _a, e_6, _b, _c;
        if (!await AiRobot.checkPoints(app_name)) {
            return { usage: 0 };
        }
        const openai = new openai_1.default({
            apiKey: process_1.default.env.OPENAI_API_KEY,
        });
        const query = `你是一個網頁設計師，請依據我提供給你的資訊，生成HTML元件，另外這兩點請你非常注意，元素的樣式請直接用inline-style，不要引用class`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '網頁設計師',
            model: 'gpt-4o-mini',
            response_format: {
                "type": "json_schema", "json_schema": {
                    "name": "html_element_modification",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "html": {
                                "type": "string",
                                "description": "HTML元素字串"
                            },
                            "inner_html": {
                                "type": "string",
                                "description": "DIV內部子元件的html字串"
                            },
                            "result": {
                                "type": "boolean",
                                "description": "是否有成功執行"
                            },
                            "position": {
                                "type": "string",
                                "enum": [
                                    "left",
                                    "center",
                                    "right",
                                    "auto"
                                ],
                                "description": "元素顯示位置，預設值為center"
                            }
                        },
                        "required": [
                            "html",
                            "result",
                            "inner_html",
                            "position"
                        ],
                        "additionalProperties": false
                    }
                }
            }
        });
        const threads_id = (await openai.beta.threads.create()).id;
        const threadMessages = await openai.beta.threads.messages.create(threads_id, { role: 'user', content: question });
        const stream = await openai.beta.threads.runs.create(threads_id, { assistant_id: myAssistant.id, stream: true });
        let text = '';
        let use_tokens = 0;
        try {
            for (var _d = true, stream_6 = __asyncValues(stream), stream_6_1; stream_6_1 = await stream_6.next(), _a = stream_6_1.done, !_a; _d = true) {
                _c = stream_6_1.value;
                _d = false;
                const event = _c;
                if (event.data && event.data.content && event.data.content[0] && event.data.content[0].text) {
                    text = JSON.parse(event.data.content[0].text.value);
                }
                if (event.data.usage) {
                    use_tokens += event.data.usage.total_tokens;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_6.return)) await _b.call(stream_6);
            }
            finally { if (e_6) throw e_6.error; }
        }
        await openai.beta.assistants.del(myAssistant.id);
        return {
            obj: text,
            usage: await this.usePoints(app_name, use_tokens, question, text)
        };
    }
}
exports.AiRobot = AiRobot;
//# sourceMappingURL=ai-robot.js.map