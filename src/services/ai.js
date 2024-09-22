"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ai = void 0;
const fs_1 = __importDefault(require("fs"));
const openai_1 = __importDefault(require("openai"));
const tool_js_1 = __importDefault(require("../modules/tool.js"));
class Ai {
    static async initial() {
        const file1 = tool_js_1.default.randomString(10) + '.json';
        const openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        fs_1.default.writeFileSync(file1, JSON.stringify([
            {
                "response": "請前往訂單管理->訂單中進行操作",
                "keywords": "修改訂單、手動新增訂單、刪除訂單"
            },
            {
                "response": "請前往訂單管理->退貨單中進行操作",
                "keywords": "退貨單"
            },
            {
                "response": "如要進行顧客分群相關的操作，請前往顧客管理->顧客分群中進行操作",
                "keywords": "顧客分群"
            },
            {
                "response": "如要查詢相關顧客，請前往顧客管理->顧客列表中進行操作",
                "keywords": "顧客列表"
            }
        ]));
        const file = await openai.files.create({
            file: fs_1.default.createReadStream(file1),
            purpose: "fine-tune",
        });
        Ai.files.guide = file.id;
        fs_1.default.rmSync(file1);
    }
}
exports.Ai = Ai;
Ai.files = {
    guide: ''
};
//# sourceMappingURL=ai.js.map