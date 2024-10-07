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
            apiKey: process.env.OPENAI_API_KEY,
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
        await this.usePoints(app_name, use_tokens, question, answer);
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
            apiKey: process.env.OPENAI_API_KEY,
        });
        const query = `現在時間為${(0, moment_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss')}，你是一個訂單資料分析師，請依照我給你的檔案，進行訂單資料的分析。
        另外請你注意，如果你無法理解我的對話、找不到相對應的資料或者無法解析檔案，請一律回答『對不起，我無法理解你的意思，如錯誤持續發生，請按下重置按鈕，能幫助我重新理解對話內容』`;
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
        await this.usePoints(app_name, use_tokens, question, answer);
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        };
    }
    static async writer(app_name, question) {
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
                order_files: '',
                writer: '',
            },
        }).value;
        const openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
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
            for (var _e = true, stream_3 = __asyncValues(stream), stream_3_1; stream_3_1 = await stream_3.next(), _a = stream_3_1.done, !_a; _e = true) {
                _c = stream_3_1.value;
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
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = stream_3.return)) await _b.call(stream_3);
            }
            finally { if (e_3) throw e_3.error; }
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
}
exports.AiRobot = AiRobot;
//# sourceMappingURL=ai-robot.js.map