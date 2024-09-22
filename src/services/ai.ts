import fs from "fs";
import OpenAI from "openai";
import path from "path";
import tool from "../modules/tool.js";

export class Ai{
    public static files={
        guide:''
    }
    public static async  initial(){
        const file1=tool.randomString(10)+'.json'
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        fs.writeFileSync(file1,JSON.stringify([
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
        ]))
        //上傳訂單數據檔案
        const file = await openai.files.create({
            file: fs.createReadStream(file1),
            purpose: "fine-tune",
        });
        Ai.files.guide=file.id
        fs.rmSync(file1)
    }
}