import s3bucket from '../modules/AWSLib';
import express from "express";
import {App} from "../services/app.js";
import response from "../modules/response.js";

import OpenAI from "openai";

const router: express.Router = express.Router();
export = router;

router.post('/generate-html', async (req: express.Request, resp: express.Response) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response1 = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    "role": "user",
                    "content": "以下對話內容，您只要回覆我HTML代碼就好，請不用回覆我多餘項目，依照HTML In line style結構，"+req.body.search
                }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        let data = ''
        if (response1.choices.length > 0) {
            if(response1.choices[0].message.content!.indexOf('```html')!==-1){
                data = response1.choices[0].message.content!.substring(response1.choices[0].message.content!.indexOf('```html')+7,
                    response1.choices[0].message.content!.lastIndexOf('```'))
            }else {
                data=response1.choices[0].message.content!
            }
        }
        return response.succ(resp, {result: true, data: data});
    } catch (err) {
        console.log(err)
        return response.fail(resp, err);
    }
})

