import s3bucket from '../modules/AWSLib';
import express from "express";
import {App} from "../services/app.js";
import response from "../modules/response.js";

const {Configuration, OpenAIApi} = require("openai");
const router: express.Router = express.Router();
export = router;

router.post('/generate-html', async (req: express.Request, resp: express.Response) => {
    try {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response1 = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `使用HTML`+req.body.search,
            "temperature": 1,
            "max_tokens": 3700,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        });
        let data = ''
        console.log(response1.data)
        if (response1.data.choices.length > 0) {
            data = response1.data.choices[0].text
        }
        return response.succ(resp, {result: true, data: data});
    } catch (err) {
        return response.fail(resp, err);
    }
})