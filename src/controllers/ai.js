"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const response_js_1 = __importDefault(require("../modules/response.js"));
const { Configuration, OpenAIApi } = require("openai");
const router = express_1.default.Router();
router.post('/generate-html', async (req, resp) => {
    try {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response1 = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `使用HTML` + req.body.search,
            "temperature": 1,
            "max_tokens": 3700,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        });
        let data = '';
        console.log(response1.data);
        if (response1.data.choices.length > 0) {
            data = response1.data.choices[0].text;
        }
        return response_js_1.default.succ(resp, { result: true, data: data });
    }
    catch (err) {
        return response_js_1.default.fail(resp, err);
    }
});
module.exports = router;
//# sourceMappingURL=ai.js.map