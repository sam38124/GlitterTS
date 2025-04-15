"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRobot = void 0;
var private_config_js_1 = require("../../services/private_config.js");
var openai_1 = require("openai");
var moment_1 = require("moment");
var ai_1 = require("../../services/ai");
var database_js_1 = require("../../modules/database.js");
var app_js_1 = require("../../services/app.js");
var tool_js_1 = require("../../modules/tool.js");
var tool_js_2 = require("../../modules/tool.js");
var process_1 = require("process");
var fs_1 = require("fs");
var user_js_1 = require("./user.js");
var shopping_js_1 = require("./shopping.js");
var axios_1 = require("axios");
var logger_js_1 = require("../../modules/logger.js");
var config_js_1 = require("../../config.js");
var AWSLib_js_1 = require("../../modules/AWSLib.js");
var mime = require('mime');
var AiRobot = /** @class */ (function () {
    function AiRobot() {
    }
    // 操作引導
    AiRobot.guide = function (app_name, question) {
        return __awaiter(this, void 0, void 0, function () {
            var cf, openai, use_tokens, query, myAssistant, threadMessages, stream, text, _a, stream_1, stream_1_1, event_1, e_1_1, regex, answer;
            var _b;
            var _c, e_1, _d, _e;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_g.sent())) {
                            return [2 /*return*/, { text: "\u60A8\u7684AI Points\u9EDE\u6578\u9918\u984D\u4E0D\u8DB3\uFF0C\u8ACB\u5148[ <a href=\"./?type=editor&appName=".concat(app_name, "&function=backend-manger&tab=ai-point\">\u524D\u5F80\u52A0\u503C</a> ]") }];
                        }
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: app_name,
                                key: 'ai_config',
                            })];
                    case 2:
                        cf = ((_f = (_g.sent())[0]) !== null && _f !== void 0 ? _f : {
                            value: {
                                writer: '',
                                order_analysis: '',
                                operation_guide: '',
                            },
                        }).value;
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        use_tokens = 0;
                        query = "\u4F60\u662F\u4E00\u500B\u5F8C\u53F0\u5F15\u5C0E\u54E1\uFF0C\u8ACB\u7528\u6211\u63D0\u4F9B\u7D66\u4F60\u7684\u6A94\u6848\u4F86\u56DE\u8986\u554F\u984C\uFF0C\u6A94\u6848\u4E2D\u5305\u542B\u4E00\u500B\u9663\u5217request\u8207\u4E00\u500Bresponse\u5B57\u4E32\u3002\u7576\u7528\u6236\u63D0\u51FA\u4E86\u554F\u984C\uFF0C\u8ACB\u5148\u904D\u6B77\u6240\u6709request\u9663\u5217\uFF0C\u5224\u65B7\u63D0\u554F\u7684\u5167\u5BB9\u5305\u542B\u4E86\u54EA\u4E9Brequest\u7684\u53EF\u80FD\uFF0C\u4E26\u76F4\u63A5\u7D66\u4E88response\u56DE\u7B54\uFF0C\u82E5\u7121\u6CD5\u76F4\u63A5\u5F9E\u6587\u4EF6\u4E2D\u5224\u65B7\u554F\u984C\u7684\u5177\u9AD4\u5167\u5BB9\uFF0C\u4E5F\u4E0D\u7528\u89E3\u91CB\uFF0C\u5C0B\u627E\u6700\u63A5\u8FD1\u554F\u984C\u7684\u7B54\u6848\u5373\u53EF\u3002";
                        return [4 /*yield*/, openai.beta.assistants.create({
                                instructions: query,
                                name: '數據分析師',
                                tools: [{ type: 'code_interpreter' }],
                                tool_resources: {
                                    code_interpreter: {
                                        file_ids: [ai_1.Ai.files.guide],
                                    },
                                },
                                model: 'gpt-4o-mini',
                            })];
                    case 3:
                        myAssistant = _g.sent();
                        return [4 /*yield*/, openai.beta.threads.messages.create(cf.operation_guide, {
                                role: 'user',
                                content: question
                            })];
                    case 4:
                        threadMessages = _g.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(cf.operation_guide, {
                                assistant_id: myAssistant.id,
                                stream: true
                            })];
                    case 5:
                        stream = _g.sent();
                        text = '';
                        _g.label = 6;
                    case 6:
                        _g.trys.push([6, 11, 12, 17]);
                        _a = true, stream_1 = __asyncValues(stream);
                        _g.label = 7;
                    case 7: return [4 /*yield*/, stream_1.next()];
                    case 8:
                        if (!(stream_1_1 = _g.sent(), _c = stream_1_1.done, !_c)) return [3 /*break*/, 10];
                        _e = stream_1_1.value;
                        _a = false;
                        event_1 = _e;
                        if (event_1.data && event_1.data.content && event_1.data.content[0] && event_1.data.content[0].text) {
                            text = event_1.data.content[0].text.value;
                        }
                        if (event_1.data.usage) {
                            use_tokens += event_1.data.usage.total_tokens;
                        }
                        _g.label = 9;
                    case 9:
                        _a = true;
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _g.trys.push([12, , 15, 16]);
                        if (!(!_a && !_c && (_d = stream_1.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _d.call(stream_1)];
                    case 13:
                        _g.sent();
                        _g.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17:
                        regex = /【[^】]*】/g;
                        answer = text.replace(regex, '');
                        return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 18:
                        _g.sent();
                        _b = {
                            text: answer
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, answer)];
                    case 19: return [2 /*return*/, (_b.usage = _g.sent(),
                            _b)];
                }
            });
        });
    };
    // 訂單分析
    AiRobot.orderAnalysis = function (app_name, question) {
        return __awaiter(this, void 0, void 0, function () {
            var cf, openai, query, myAssistant, threadMessages, stream, text, use_tokens, _a, stream_2, stream_2_1, event_2, e_2_1, regex, answer;
            var _b;
            var _c, e_2, _d, _e;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_g.sent())) {
                            return [2 /*return*/, { text: "\u60A8\u7684AI Points\u9EDE\u6578\u9918\u984D\u4E0D\u8DB3\uFF0C\u8ACB\u5148[ <a href=\"./?type=editor&appName=".concat(app_name, "&function=backend-manger&tab=ai-point\">\u524D\u5F80\u52A0\u503C</a> ]") }];
                        }
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: app_name,
                                key: 'ai_config',
                            })];
                    case 2:
                        cf = ((_f = (_g.sent())[0]) !== null && _f !== void 0 ? _f : {
                            value: {
                                order_files: '',
                                order_analysis: '',
                            },
                        }).value;
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        query = "\u73FE\u5728\u6642\u9593\u70BA".concat((0, moment_1.default)().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss'), "\uFF0C\u4F60\u662F\u4E00\u500B\u8A02\u55AE\u8CC7\u6599\u5206\u6790\u5E2B\uFF0C\u8ACB\u4F9D\u7167\u6211\u7D66\u4F60\u7684\u6A94\u6848\uFF0C\u9032\u884C\u8A02\u55AE\u8CC7\u6599\u7684\u5206\u6790\u3002\n        \u53E6\u5916\u4EE5\u4E0B3\u9EDE\u8ACB\u6CE8\u610F\n        1.\u5982\u679C\u554F\u984C\u662F\u6709\u95DC\u6D88\u8CBB\u91D1\u984D\u7684\u8A08\u7B97\uFF0C\u50C5\u8A08\u7B97\u5DF2\u4ED8\u6B3E\u7684\u8A02\u55AE\n        2.\u6211\u63D0\u4F9B\u7D66\u4F60\u7684\u6A94\u6848\u985E\u578B\u662Fcsv\uFF0C\u76F8\u540C\u7684order_id\u4EE3\u8868\u540C\u4E00\u7B46\u8A02\u55AE\n        3.\u6211\u6240\u6709\u554F\u984C\u90FD\u8DDF\u6A94\u6848\u5167\u5BB9\u6709\u95DC\uFF0C\u8ACB\u4E0D\u8981\u56DE\u7B54\u7121\u95DC\u5167\u5BB9\n        ");
                        return [4 /*yield*/, openai.beta.assistants.create({
                                instructions: query,
                                name: '數據分析師',
                                tools: [{ type: 'code_interpreter' }],
                                tool_resources: {
                                    code_interpreter: {
                                        file_ids: [cf.order_files],
                                    },
                                },
                                model: 'gpt-4o-mini',
                            })];
                    case 3:
                        myAssistant = _g.sent();
                        return [4 /*yield*/, openai.beta.threads.messages.create(cf.order_analysis, {
                                role: 'user',
                                content: question
                            })];
                    case 4:
                        threadMessages = _g.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(cf.order_analysis, {
                                assistant_id: myAssistant.id,
                                stream: true
                            })];
                    case 5:
                        stream = _g.sent();
                        text = '';
                        use_tokens = 0;
                        _g.label = 6;
                    case 6:
                        _g.trys.push([6, 11, 12, 17]);
                        _a = true, stream_2 = __asyncValues(stream);
                        _g.label = 7;
                    case 7: return [4 /*yield*/, stream_2.next()];
                    case 8:
                        if (!(stream_2_1 = _g.sent(), _c = stream_2_1.done, !_c)) return [3 /*break*/, 10];
                        _e = stream_2_1.value;
                        _a = false;
                        event_2 = _e;
                        if (event_2.data && event_2.data.content && event_2.data.content[0] && event_2.data.content[0].text) {
                            text = event_2.data.content[0].text.value;
                        }
                        if (event_2.data.usage) {
                            use_tokens += event_2.data.usage.total_tokens;
                        }
                        _g.label = 9;
                    case 9:
                        _a = true;
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_2_1 = _g.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _g.trys.push([12, , 15, 16]);
                        if (!(!_a && !_c && (_d = stream_2.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _d.call(stream_2)];
                    case 13:
                        _g.sent();
                        _g.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17:
                        console.log("use_tokens==>", use_tokens);
                        regex = /【[^】]*】/g;
                        return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 18:
                        _g.sent();
                        answer = text.replace(regex, '');
                        _b = {
                            text: answer
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, answer)];
                    case 19: return [2 /*return*/, (_b.usage = _g.sent(),
                            _b)];
                }
            });
        });
    };
    // 圖片生成
    AiRobot.design = function (app_name, question) {
        return __awaiter(this, void 0, void 0, function () {
            var cf, openai, query, myAssistant, threads_id, threadMessages, stream, text, use_tokens, _a, stream_3, stream_3_1, event_3, e_3_1, response;
            var _b;
            var _c, e_3, _d, _e;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_g.sent())) {
                            return [2 /*return*/, { text: "\u60A8\u7684AI Points\u9EDE\u6578\u9918\u984D\u4E0D\u8DB3\uFF0C\u8ACB\u5148[ <a href=\"./?type=editor&appName=".concat(app_name, "&function=backend-manger&tab=ai-point\">\u524D\u5F80\u52A0\u503C</a> ]") }];
                        }
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: app_name,
                                key: 'ai_config',
                            })];
                    case 2:
                        cf = ((_f = (_g.sent())[0]) !== null && _f !== void 0 ? _f : {
                            value: {
                                design: ''
                            },
                        }).value;
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        query = "\u4F60\u662F\u4E00\u500B\u5E73\u9762\u8A2D\u8A08\u5E2B\uFF0C\u8ACB\u4F9D\u64DA\u6211\u63D0\u4F9B\u7D66\u4F60\u7684\u63CF\u8FF0\uFF0C\u7522\u751Fprompt\uFF0C\u6211\u6703\u5229\u7528\u4F60\u63D0\u4F9B\u7684\u8CC7\u8A0A\u53BB\u547C\u53EB\u5716\u7247\u751F\u6210\u6A21\u578B";
                        return [4 /*yield*/, openai.beta.assistants.create({
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
                            })];
                    case 3:
                        myAssistant = _g.sent();
                        threads_id = cf.design;
                        return [4 /*yield*/, openai.beta.threads.messages.create(threads_id, { role: 'user', content: question })];
                    case 4:
                        threadMessages = _g.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(threads_id, { assistant_id: myAssistant.id, stream: true })];
                    case 5:
                        stream = _g.sent();
                        text = undefined;
                        use_tokens = 0;
                        _g.label = 6;
                    case 6:
                        _g.trys.push([6, 11, 12, 17]);
                        _a = true, stream_3 = __asyncValues(stream);
                        _g.label = 7;
                    case 7: return [4 /*yield*/, stream_3.next()];
                    case 8:
                        if (!(stream_3_1 = _g.sent(), _c = stream_3_1.done, !_c)) return [3 /*break*/, 10];
                        _e = stream_3_1.value;
                        _a = false;
                        event_3 = _e;
                        if (event_3.data && event_3.data.content && event_3.data.content[0] && event_3.data.content[0].text) {
                            text = JSON.parse(event_3.data.content[0].text.value);
                        }
                        if (event_3.data.usage) {
                            use_tokens += event_3.data.usage.total_tokens;
                        }
                        _g.label = 9;
                    case 9:
                        _a = true;
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_3_1 = _g.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _g.trys.push([12, , 15, 16]);
                        if (!(!_a && !_c && (_d = stream_3.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _d.call(stream_3)];
                    case 13:
                        _g.sent();
                        _g.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17: return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 18:
                        _g.sent();
                        if (!text) return [3 /*break*/, 24];
                        return [4 /*yield*/, openai.images.generate({
                                model: "dall-e-3",
                                prompt: text.prompt,
                                n: 1,
                                size: "1024x1024",
                            })];
                    case 19:
                        response = _g.sent();
                        if (!response.data[0]) return [3 /*break*/, 22];
                        _b = {
                            prompt: text.prompt
                        };
                        return [4 /*yield*/, this.convertS3Link(response.data[0].url)];
                    case 20:
                        _b.image = _g.sent();
                        return [4 /*yield*/, this.usePoints(app_name, 100000 + use_tokens, question, "\u4F7F\u7528AI\u9032\u884C\u5716\u7247\u751F\u6210")];
                    case 21: return [2 /*return*/, (_b.usage = _g.sent(),
                            _b)];
                    case 22: return [2 /*return*/, {
                            text: '生成失敗，請輸入更具體一點的描述',
                            usage: 0
                        }];
                    case 23: return [3 /*break*/, 25];
                    case 24: return [2 /*return*/, {
                            text: '生成失敗，請輸入更具體一點的描述',
                            usage: 0
                        }];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    // 寫手
    AiRobot.writer = function (app_name, question) {
        return __awaiter(this, void 0, void 0, function () {
            var cf, openai, query, myAssistant, threadMessages, stream, text, use_tokens, _a, stream_4, stream_4_1, event_4, e_4_1, regex, answer;
            var _b;
            var _c, e_4, _d, _e;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_g.sent())) {
                            return [2 /*return*/, { text: "\u60A8\u7684AI Points\u9EDE\u6578\u9918\u984D\u4E0D\u8DB3\uFF0C\u8ACB\u5148[ <a href=\"./?type=editor&appName=".concat(app_name, "&function=backend-manger&tab=ai-point\">\u524D\u5F80\u52A0\u503C</a> ]") }];
                        }
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: app_name,
                                key: 'ai_config',
                            })];
                    case 2:
                        cf = ((_f = (_g.sent())[0]) !== null && _f !== void 0 ? _f : {
                            value: {
                                order_files: '',
                                writer: '',
                            },
                        }).value;
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        query = '你是一個電商文案寫手，專門協助撰寫商品描述、行銷文案。';
                        return [4 /*yield*/, openai.beta.assistants.create({
                                instructions: query,
                                name: '數據分析師',
                                model: 'gpt-4o-mini',
                            })];
                    case 3:
                        myAssistant = _g.sent();
                        return [4 /*yield*/, openai.beta.threads.messages.create(cf.writer, { role: 'user', content: question })];
                    case 4:
                        threadMessages = _g.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(cf.writer, { assistant_id: myAssistant.id, stream: true })];
                    case 5:
                        stream = _g.sent();
                        text = '';
                        use_tokens = 0;
                        _g.label = 6;
                    case 6:
                        _g.trys.push([6, 11, 12, 17]);
                        _a = true, stream_4 = __asyncValues(stream);
                        _g.label = 7;
                    case 7: return [4 /*yield*/, stream_4.next()];
                    case 8:
                        if (!(stream_4_1 = _g.sent(), _c = stream_4_1.done, !_c)) return [3 /*break*/, 10];
                        _e = stream_4_1.value;
                        _a = false;
                        event_4 = _e;
                        if (event_4.data && event_4.data.content && event_4.data.content[0] && event_4.data.content[0].text) {
                            text = event_4.data.content[0].text.value;
                        }
                        if (event_4.data.usage) {
                            use_tokens += event_4.data.usage.total_tokens;
                        }
                        _g.label = 9;
                    case 9:
                        _a = true;
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_4_1 = _g.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _g.trys.push([12, , 15, 16]);
                        if (!(!_a && !_c && (_d = stream_4.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _d.call(stream_4)];
                    case 13:
                        _g.sent();
                        _g.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_4) throw e_4.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17:
                        regex = /【[^】]*】/g;
                        return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 18:
                        _g.sent();
                        answer = text.replace(regex, '');
                        _b = {
                            text: answer
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, answer)];
                    case 19: return [2 /*return*/, (_b.usage = _g.sent(),
                            _b)];
                }
            });
        });
    };
    //判斷AI代幣是否足夠
    AiRobot.checkPoints = function (app_name) {
        return __awaiter(this, void 0, void 0, function () {
            var brandAndMemberType, sum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(app_name)];
                    case 1:
                        brandAndMemberType = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT sum(money)\n                     FROM `".concat(brandAndMemberType.brand, "`.t_ai_points\n                     WHERE status in (1, 2)\n                       and userID = ?"), [brandAndMemberType.user_id])];
                    case 2:
                        sum = (_a.sent())[0]['sum(money)'] || 0;
                        return [2 /*return*/, sum > 0];
                }
            });
        });
    };
    //點數扣除
    AiRobot.usePoints = function (app_name, token_number, ask, response) {
        return __awaiter(this, void 0, void 0, function () {
            var total, brandAndMemberType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        total = token_number * 0.000018 * 10;
                        if (total < 1) {
                            total = 1;
                        }
                        total = Math.ceil(total * -1);
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(app_name)];
                    case 1:
                        brandAndMemberType = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("insert into `".concat(brandAndMemberType.brand, "`.t_ai_points\n                        set ?"), [
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
                            ])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, total * -1];
                }
            });
        });
    };
    //AI客服設定
    AiRobot.syncAiRobot = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var copy, refer_question, jsonStringQA, file1, openai, file, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, (new user_js_1.User(app)).getConfigV2({ key: 'robot_ai_reply', user_id: 'manager' })];
                    case 1:
                        copy = _a.sent();
                        copy.ai_refer_file = undefined;
                        refer_question = JSON.parse(JSON.stringify(copy));
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
                        jsonStringQA = JSON.stringify(refer_question);
                        file1 = tool_js_2.default.randomString(10) + '.json';
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        fs_1.default.writeFileSync(file1, jsonStringQA);
                        return [4 /*yield*/, openai.files.create({
                                file: fs_1.default.createReadStream(file1),
                                purpose: 'assistants',
                            })];
                    case 2:
                        file = _a.sent();
                        fs_1.default.rmSync(file1);
                        copy.ai_refer_file = file.id;
                        return [4 /*yield*/, (new user_js_1.User(app)).setConfig({ key: 'robot_ai_reply', value: copy, user_id: 'manager' })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, file.id];
                    case 4:
                        e_5 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //AI回覆
    AiRobot.aiResponse = function (app_name, question) {
        return __awaiter(this, void 0, void 0, function () {
            function extractNumbers(text) {
                // 使用正則表達式 \d+ 來找到數字
                var numbers = text.match(/\d+/g);
                // 將找到的數字從字串轉換成數字
                return numbers ? numbers.map(Number) : '';
            }
            var cf, openai, use_tokens, query, myAssistant, threads_id, threadMessages, stream, text, _a, stream_5, stream_5_1, event_5, e_6_1, regex, answer, order_data_1;
            var _b, _c, _d, _e;
            var _f, e_6, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_j.sent())) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, (new user_js_1.User(app_name)).getConfigV2({
                                key: 'robot_ai_reply',
                                user_id: 'manager'
                            })];
                    case 2:
                        cf = _j.sent();
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        use_tokens = 0;
                        query = "\u4F60\u662F\u4E00\u500BAI\u5BA2\u670D\uFF0C\u8ACB\u7528\u6211\u63D0\u4F9B\u7D66\u4F60\u7684\u6A94\u6848\u4F86\u56DE\u8986\u554F\u984C\uFF0C\u6A94\u6848\u4E2D\u5305\u542B\u4E00\u500Bquestion\u7684\u9663\u5217\uFF0C\u7576\u7528\u6236\u63D0\u51FA\u4E86\u554F\u984C\uFF0C\u8ACB\u5148\u904D\u6B77question\u9663\u5217\uFF0C\u5224\u65B7\u63D0\u554F\u7684\u5167\u5BB9\u662F\u5426\u8207ask\u6216\u8005keywords\u76F8\u95DC\uFF0C\n        \u8ACB\u4E0D\u8981\u7D93\u904E\u4EFB\u4F55\u4FEE\u6539\u76F4\u63A5\u56DE\u8986response\u6B04\u4F4D\uFF0C\u53E6\u5916\u9019\u9EDE\u8ACB\u4F60\u975E\u5E38\u6CE8\u610F\u82E5\u7121\u6CD5\u627E\u5230\u76F8\u95DC\u8CC7\u6599\uFF0C\u8ACB\u76F4\u63A5\u56DE\u7B54\u300Eno-data\u300F\u5C31\u597D\uFF0C\u4E0D\u8981\u56DE\u7B54\u5176\u4ED6\u6587\u5B57\u5167\u5BB9\u3002";
                        return [4 /*yield*/, openai.beta.assistants.create({
                                instructions: query,
                                name: 'AI客服',
                                tools: [{ type: 'code_interpreter' }],
                                tool_resources: {
                                    code_interpreter: {
                                        file_ids: [cf.ai_refer_file],
                                    },
                                },
                                model: 'gpt-4o-mini',
                            })];
                    case 3:
                        myAssistant = _j.sent();
                        return [4 /*yield*/, openai.beta.threads.create()];
                    case 4:
                        threads_id = (_j.sent()).id;
                        return [4 /*yield*/, openai.beta.threads.messages.create(threads_id, {
                                role: 'user',
                                content: question
                            })];
                    case 5:
                        threadMessages = _j.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(threads_id, {
                                assistant_id: myAssistant.id,
                                stream: true
                            })];
                    case 6:
                        stream = _j.sent();
                        text = '';
                        _j.label = 7;
                    case 7:
                        _j.trys.push([7, 12, 13, 18]);
                        _a = true, stream_5 = __asyncValues(stream);
                        _j.label = 8;
                    case 8: return [4 /*yield*/, stream_5.next()];
                    case 9:
                        if (!(stream_5_1 = _j.sent(), _f = stream_5_1.done, !_f)) return [3 /*break*/, 11];
                        _h = stream_5_1.value;
                        _a = false;
                        event_5 = _h;
                        if (event_5.data && event_5.data.content && event_5.data.content[0] && event_5.data.content[0].text) {
                            text = event_5.data.content[0].text.value;
                        }
                        if (event_5.data.usage) {
                            use_tokens += event_5.data.usage.total_tokens;
                        }
                        _j.label = 10;
                    case 10:
                        _a = true;
                        return [3 /*break*/, 8];
                    case 11: return [3 /*break*/, 18];
                    case 12:
                        e_6_1 = _j.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 18];
                    case 13:
                        _j.trys.push([13, , 16, 17]);
                        if (!(!_a && !_f && (_g = stream_5.return))) return [3 /*break*/, 15];
                        return [4 /*yield*/, _g.call(stream_5)];
                    case 14:
                        _j.sent();
                        _j.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        if (e_6) throw e_6.error;
                        return [7 /*endfinally*/];
                    case 17: return [7 /*endfinally*/];
                    case 18:
                        regex = /【[^】]*】/g;
                        answer = text.replace(regex, '');
                        return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 19:
                        _j.sent();
                        if (!(answer === 'orders-search')) return [3 /*break*/, 27];
                        if (!extractNumbers(question)) return [3 /*break*/, 25];
                        return [4 /*yield*/, new shopping_js_1.Shopping(app_name).getCheckOut({
                                page: 0,
                                limit: 5000,
                                returnSearch: 'true',
                                search: extractNumbers(question)
                            })];
                    case 20:
                        order_data_1 = _j.sent();
                        if (!order_data_1) return [3 /*break*/, 22];
                        _b = {
                            text: [
                                "\u9019\u7B46\u8A02\u55AE\u5EFA\u7ACB\u65BC".concat((0, moment_1.default)(order_data_1.created_time).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm')),
                                "\u4ED8\u6B3E\u72C0\u614B\u70BA\u300E ".concat((function () {
                                    var _a;
                                    switch ((_a = order_data_1.status) !== null && _a !== void 0 ? _a : 0) {
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
                                })(), " \u300F"),
                                "\u8A02\u55AE\u72C0\u614B\u70BA\u300E ".concat((function () {
                                    var _a;
                                    switch ((_a = order_data_1.orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
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
                                })(), " \u300F"),
                                "\u8A02\u55AE\u7E3D\u91D1\u984D\u70BA\u300E ".concat(order_data_1.orderData.total, " \u300F"),
                                "\u8CFC\u8CB7\u9805\u76EE\u6709:\n".concat(order_data_1.orderData.lineItems.map(function (item) {
                                    return "".concat(item.title, " * ").concat(item.count);
                                }).join('\n'), " ")
                            ].join('\n')
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, answer)];
                    case 21: return [2 /*return*/, (_b.usage = _j.sent(),
                            _b)];
                    case 22:
                        _c = {
                            text: '查物相關訂單'
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, answer)];
                    case 23: return [2 /*return*/, (_c.usage = _j.sent(),
                            _c)];
                    case 24: return [3 /*break*/, 27];
                    case 25:
                        _d = {
                            text: '您好，查詢訂單相關資料必須同時告知訂單號碼，例如:『 訂單號碼1723274721的配送狀態 』'
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, answer)];
                    case 26: return [2 /*return*/, (_d.usage = _j.sent(),
                            _d)];
                    case 27:
                        _e = {
                            text: answer
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, answer)];
                    case 28: return [2 /*return*/, (_e.usage = _j.sent(),
                            _e)];
                }
            });
        });
    };
    //代碼生成
    AiRobot.codeGenerator = function (app_name, question) {
        return __awaiter(this, void 0, void 0, function () {
            var openai, query, myAssistant, threads_id, threadMessages, stream, text, use_tokens, _a, stream_6, stream_6_1, event_6, e_7_1;
            var _b;
            var _c, e_7, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_f.sent())) {
                            return [2 /*return*/, { usage: 0 }];
                        }
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        query = "\u4F60\u662F\u4E00\u500B\u7DB2\u9801\u8A2D\u8A08\u5E2B\uFF0C\u8ACB\u4F9D\u64DA\u6211\u63D0\u4F9B\u7D66\u4F60\u7684\u8CC7\u8A0A\uFF0C\u751F\u6210HTML\u5143\u4EF6\uFF0C\u53E6\u5916\u9019\u5169\u9EDE\u8ACB\u4F60\u975E\u5E38\u6CE8\u610F\uFF0C\u5143\u7D20\u7684\u6A23\u5F0F\u8ACB\u76F4\u63A5\u7528inline-style\uFF0C\u4E0D\u8981\u5F15\u7528class";
                        return [4 /*yield*/, openai.beta.assistants.create({
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
                            })];
                    case 2:
                        myAssistant = _f.sent();
                        return [4 /*yield*/, openai.beta.threads.create()];
                    case 3:
                        threads_id = (_f.sent()).id;
                        return [4 /*yield*/, openai.beta.threads.messages.create(threads_id, { role: 'user', content: question })];
                    case 4:
                        threadMessages = _f.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(threads_id, { assistant_id: myAssistant.id, stream: true })];
                    case 5:
                        stream = _f.sent();
                        text = '';
                        use_tokens = 0;
                        _f.label = 6;
                    case 6:
                        _f.trys.push([6, 11, 12, 17]);
                        _a = true, stream_6 = __asyncValues(stream);
                        _f.label = 7;
                    case 7: return [4 /*yield*/, stream_6.next()];
                    case 8:
                        if (!(stream_6_1 = _f.sent(), _c = stream_6_1.done, !_c)) return [3 /*break*/, 10];
                        _e = stream_6_1.value;
                        _a = false;
                        event_6 = _e;
                        if (event_6.data && event_6.data.content && event_6.data.content[0] && event_6.data.content[0].text) {
                            text = JSON.parse(event_6.data.content[0].text.value);
                        }
                        if (event_6.data.usage) {
                            use_tokens += event_6.data.usage.total_tokens;
                        }
                        _f.label = 9;
                    case 9:
                        _a = true;
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_7_1 = _f.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _f.trys.push([12, , 15, 16]);
                        if (!(!_a && !_c && (_d = stream_6.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _d.call(stream_6)];
                    case 13:
                        _f.sent();
                        _f.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_7) throw e_7.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17: return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 18:
                        _f.sent();
                        _b = {
                            obj: text
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, text)];
                    case 19: return [2 /*return*/, (_b.usage = _f.sent(),
                            _b)];
                }
            });
        });
    };
    //上傳檔案
    AiRobot.uploadFile = function (file_name, fileData) {
        return __awaiter(this, void 0, void 0, function () {
            var TAG, logger, s3bucketName, s3path, fullUrl, params;
            var _this = this;
            return __generator(this, function (_a) {
                TAG = "[AWS-S3][Upload]";
                logger = new logger_js_1.default();
                s3bucketName = config_js_1.default.AWS_S3_NAME;
                s3path = file_name;
                fullUrl = config_js_1.default.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
                params = {
                    Bucket: s3bucketName,
                    Key: s3path,
                    Expires: 300,
                    //If you use other contentType will response 403 error
                    ContentType: (function () {
                        if (config_js_1.default.SINGLE_TYPE) {
                            return "application/x-www-form-urlencoded; charset=UTF-8";
                        }
                        else {
                            return mime.getType(fullUrl.split('.').pop());
                        }
                    })(),
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        AWSLib_js_1.default.getSignedUrl('putObject', params, function (err, url) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (err) {
                                    logger.error(TAG, String(err));
                                    // use console.log here because logger.info cannot log err.stack correctly
                                    console.log(err, err.stack);
                                    reject(false);
                                }
                                else {
                                    (0, axios_1.default)({
                                        method: 'PUT',
                                        url: url,
                                        data: fileData,
                                        headers: {
                                            'Content-Type': params.ContentType,
                                        },
                                    })
                                        .then(function () {
                                        console.log(fullUrl);
                                        resolve(fullUrl);
                                    })
                                        .catch(function () {
                                        console.log("convertError:".concat(fullUrl));
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    })];
            });
        });
    };
    //轉換檔案連結至s3
    AiRobot.convertS3Link = function (link) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                axios_1.default
                                    .get(link, { responseType: 'arraybuffer' })
                                    .then(function (response) { return Buffer.from(response.data); })
                                    .then(function (buffer) {
                                    _this.uploadFile("ai/file/".concat(new Date().getTime(), ".png"), buffer).then(function (url) {
                                        resolve(url);
                                    });
                                })
                                    .catch(function (err) {
                                    console.error('處理圖片時發生錯誤:', err);
                                    resolve(false);
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1: 
                    // 下載圖片並讀取
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //頁面調整
    AiRobot.codeEditor = function (app_name, question, format, assistant) {
        return __awaiter(this, void 0, void 0, function () {
            var openai, query, myAssistant, threads_id, threadMessages, stream, text, use_tokens, _a, stream_7, stream_7_1, event_7, e_8_1;
            var _b;
            var _c, e_8, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_f.sent())) {
                            return [2 /*return*/, { usage: 0 }];
                        }
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        query = assistant || "\u5E6B\u6211\u904E\u6FFE\u51FA\u6211\u8981\u8ABF\u6574\u7684\u9805\u76EE\u548C\u5167\u5BB9";
                        return [4 /*yield*/, openai.beta.assistants.create({
                                instructions: query,
                                name: '網頁設計師',
                                model: 'gpt-4o-mini',
                                response_format: {
                                    "type": "json_schema", "json_schema": format
                                }
                            })];
                    case 2:
                        myAssistant = _f.sent();
                        return [4 /*yield*/, openai.beta.threads.create()];
                    case 3:
                        threads_id = (_f.sent()).id;
                        return [4 /*yield*/, openai.beta.threads.messages.create(threads_id, { role: 'user', content: question })];
                    case 4:
                        threadMessages = _f.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(threads_id, { assistant_id: myAssistant.id, stream: true })];
                    case 5:
                        stream = _f.sent();
                        text = '';
                        use_tokens = 0;
                        _f.label = 6;
                    case 6:
                        _f.trys.push([6, 11, 12, 17]);
                        _a = true, stream_7 = __asyncValues(stream);
                        _f.label = 7;
                    case 7: return [4 /*yield*/, stream_7.next()];
                    case 8:
                        if (!(stream_7_1 = _f.sent(), _c = stream_7_1.done, !_c)) return [3 /*break*/, 10];
                        _e = stream_7_1.value;
                        _a = false;
                        event_7 = _e;
                        if (event_7.data && event_7.data.content && event_7.data.content[0] && event_7.data.content[0].text) {
                            text = JSON.parse(event_7.data.content[0].text.value);
                        }
                        if (event_7.data.usage) {
                            use_tokens += event_7.data.usage.total_tokens;
                        }
                        _f.label = 9;
                    case 9:
                        _a = true;
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_8_1 = _f.sent();
                        e_8 = { error: e_8_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _f.trys.push([12, , 15, 16]);
                        if (!(!_a && !_c && (_d = stream_7.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _d.call(stream_7)];
                    case 13:
                        _f.sent();
                        _f.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_8) throw e_8.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17: return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 18:
                        _f.sent();
                        _b = {
                            obj: text
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, text)];
                    case 19: return [2 /*return*/, (_b.usage = _f.sent(),
                            _b)];
                }
            });
        });
    };
    //搜尋商品
    AiRobot.searchProduct = function (app_name, question, thread) {
        return __awaiter(this, void 0, void 0, function () {
            var openai, myAssistant, threads_id, threadMessages, stream, text, use_tokens, _a, stream_8, stream_8_1, event_8, e_9_1, e_10;
            var _b;
            var _c, e_9, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 19, , 20]);
                        return [4 /*yield*/, AiRobot.checkPoints(app_name)];
                    case 1:
                        if (!(_f.sent())) {
                            return [2 /*return*/, { usage: 0 }];
                        }
                        openai = new openai_1.default({
                            apiKey: process_1.default.env.OPENAI_API_KEY,
                        });
                        return [4 /*yield*/, openai.beta.assistants.create({
                                instructions: "\u4F60\u662F\u4E00\u500B\u5546\u54C1\u641C\u7D22\u54E1\uFF0C\u9996\u5148\u6211\u6703\u63D0\u4F9B\u7D66\u4F60\u591A\u500B\u5546\u54C1\u8CC7\u8A0A\uFF0C\u8ACB\u5148\u5354\u52A9\u5C07\u5546\u54C1\u52A0\u5165\u5206\u6790\u8CC7\u6599\u5EAB\uFF0C\u6700\u5F8C\u6211\u6703\u5411\u4F60\u63D0\u51FA\u554F\u984C\uFF0C\u8ACB\u627E\u51FA\u7B26\u5408\u898F\u5247\u7684\u5546\u54C1\u3002",
                                name: '數據分析師',
                                response_format: {
                                    "type": "json_schema", "json_schema": {
                                        "name": "product_array",
                                        "schema": {
                                            "type": "object",
                                            "properties": {
                                                "products": {
                                                    "type": "array",
                                                    "description": "代表商品的陣列，每個商品都有ID和名稱。",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "product_id": {
                                                                "type": "string",
                                                                "description": "商品的ID。"
                                                            },
                                                            "product_name": {
                                                                "type": "string",
                                                                "description": "商品的名稱。"
                                                            }
                                                        },
                                                        "required": [
                                                            "product_id",
                                                            "product_name"
                                                        ],
                                                        "additionalProperties": false
                                                    }
                                                }
                                            },
                                            "required": [
                                                "products"
                                            ],
                                            "additionalProperties": false
                                        },
                                        "strict": true
                                    }
                                },
                                model: 'gpt-4o-mini',
                            })];
                    case 2:
                        myAssistant = _f.sent();
                        threads_id = thread;
                        return [4 /*yield*/, openai.beta.threads.messages.create(threads_id, { role: 'user', content: "\u5E6B\u6211\u5C0B\u627E" + question })];
                    case 3:
                        threadMessages = _f.sent();
                        return [4 /*yield*/, openai.beta.threads.runs.create(threads_id, { assistant_id: myAssistant.id, stream: true })];
                    case 4:
                        stream = _f.sent();
                        text = '';
                        use_tokens = 0;
                        _f.label = 5;
                    case 5:
                        _f.trys.push([5, 10, 11, 16]);
                        _a = true, stream_8 = __asyncValues(stream);
                        _f.label = 6;
                    case 6: return [4 /*yield*/, stream_8.next()];
                    case 7:
                        if (!(stream_8_1 = _f.sent(), _c = stream_8_1.done, !_c)) return [3 /*break*/, 9];
                        _e = stream_8_1.value;
                        _a = false;
                        event_8 = _e;
                        if (event_8.data && event_8.data.content && event_8.data.content[0] && event_8.data.content[0].text) {
                            text = JSON.parse(event_8.data.content[0].text.value);
                        }
                        if (event_8.data.usage) {
                            use_tokens += event_8.data.usage.total_tokens;
                        }
                        _f.label = 8;
                    case 8:
                        _a = true;
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_9_1 = _f.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _f.trys.push([11, , 14, 15]);
                        if (!(!_a && !_c && (_d = stream_8.return))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _d.call(stream_8)];
                    case 12:
                        _f.sent();
                        _f.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_9) throw e_9.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [4 /*yield*/, openai.beta.assistants.del(myAssistant.id)];
                    case 17:
                        _f.sent();
                        _b = {
                            obj: text
                        };
                        return [4 /*yield*/, this.usePoints(app_name, use_tokens, question, text)];
                    case 18: return [2 /*return*/, (_b.usage = _f.sent(),
                            _b)];
                    case 19:
                        e_10 = _f.sent();
                        console.log(e_10);
                        return [3 /*break*/, 20];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    return AiRobot;
}());
exports.AiRobot = AiRobot;
