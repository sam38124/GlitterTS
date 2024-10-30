"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../modules/response.js"));
const openai_1 = __importDefault(require("openai"));
const router = express_1.default.Router();
router.post('/generate-html', async (req, resp) => {
    try {
        const openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response1 = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    "role": "user",
                    "content": "以下對話內容，您只要回覆我HTML代碼就好，請不用回覆我多餘項目，依照HTML In line style結構，" + req.body.search
                }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        let data = '';
        if (response1.choices.length > 0) {
            if (response1.choices[0].message.content.indexOf('```html') !== -1) {
                data = response1.choices[0].message.content.substring(response1.choices[0].message.content.indexOf('```html') + 7, response1.choices[0].message.content.lastIndexOf('```'));
            }
            else {
                data = response1.choices[0].message.content;
            }
        }
        return response_js_1.default.succ(resp, { result: true, data: data });
    }
    catch (err) {
        console.log(err);
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=ai.js.map