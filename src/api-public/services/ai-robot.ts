import {Private_config} from '../../services/private_config.js';
import OpenAI from 'openai';
import moment from 'moment';
import {Ai} from '../../services/ai';
import db from "../../modules/database.js";
import {App} from "../../services/app.js";
import Tool from "../../modules/tool.js";
import tool from "../../modules/tool.js";
import process from "process";
import fs from "fs";
import {User} from "./user.js";
import {Shopping} from "./shopping.js";
import {Beta, ResponseFormatJSONSchema} from "openai/resources";
import {z} from "zod";
import {zodResponseFormat} from "openai/helpers/zod";
import ResponseFormatText = OpenAI.ResponseFormatText;
import axios from "axios";
import {Jimp} from "jimp";
import Logger from "../../modules/logger.js";
import config from "../../config.js";
import s3bucket from "../../modules/AWSLib.js";

const mime = require('mime');

export class AiRobot {
    // 操作引導
    public static async guide(app_name: string, question: string) {
        if (!await AiRobot.checkPoints(app_name)) {
            return {text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]`}
        }
        let cf = (
            (
                await Private_config.getConfig({
                    appName: app_name,
                    key: 'ai_config',
                })
            )[0] ?? {
                value: {
                    writer: '',
                    order_analysis: '',
                    operation_guide: '',
                },
            }
        ).value;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建客服小姐
        let use_tokens = 0
        const query = `你是一個後台引導員，請用我提供給你的檔案來回覆問題，檔案中包含一個陣列request與一個response字串。當用戶提出了問題，請先遍歷所有request陣列，判斷提問的內容包含了哪些request的可能，並直接給予response回答，若無法直接從文件中判斷問題的具體內容，也不用解釋，尋找最接近問題的答案即可。`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            tools: [{type: 'code_interpreter'}],
            tool_resources: {
                code_interpreter: {
                    file_ids: [Ai.files.guide],
                },
            },
            model: 'gpt-4o-mini',
        });

        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(cf.operation_guide, {
            role: 'user',
            content: question
        });
        //建立數據流
        const stream = await openai.beta.threads.runs.create(cf.operation_guide, {
            assistant_id: myAssistant.id,
            stream: true
        });
        let text = '';
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
            if ((event.data as any).usage) {
                use_tokens += (event.data as any).usage.total_tokens;
            }
        }
        const regex = /【[^】]*】/g;
        const answer = text.replace(regex, '')
        await openai.beta.assistants.del(myAssistant.id);
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        }
    }

    // 訂單分析
    public static async orderAnalysis(app_name: string, question: string) {

        if (!await AiRobot.checkPoints(app_name)) {
            return {text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]`}
        }
        let cf = (
            (
                await Private_config.getConfig({
                    appName: app_name,
                    key: 'ai_config',
                })
            )[0] ?? {
                value: {
                    order_files: '',
                    order_analysis: '',
                },
            }
        ).value;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建客服小姐
        const query = `現在時間為${moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss')}，你是一個訂單資料分析師，請依照我給你的檔案，進行訂單資料的分析。
        另外以下3點請注意
        1.如果問題是有關消費金額的計算，僅計算已付款的訂單
        2.我提供給你的檔案類型是csv，相同的order_id代表同一筆訂單
        3.我所有問題都跟檔案內容有關，請不要回答無關內容
        `;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            tools: [{type: 'code_interpreter'}],
            tool_resources: {
                code_interpreter: {
                    file_ids: [cf.order_files],
                },
            },
            model: 'gpt-4o-mini',
        });

        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(cf.order_analysis, {
            role: 'user',
            content: question
        });
        //建立數據流
        const stream = await openai.beta.threads.runs.create(cf.order_analysis, {
            assistant_id: myAssistant.id,
            stream: true
        });
        let text = '';
        let use_tokens = 0
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
            if ((event.data as any).usage) {
                use_tokens += (event.data as any).usage.total_tokens;
            }
        }
        console.log(`use_tokens==>`, use_tokens)
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        const answer = text.replace(regex, '');
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        }
    }


    // 圖片生成
    public static async design(app_name: string, question: string) {

        if (!await AiRobot.checkPoints(app_name)) {
            return {text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]`}
        }
        let cf = (
            (
                await Private_config.getConfig({
                    appName: app_name,
                    key: 'ai_config',
                })
            )[0] ?? {
                value: {
                    design: ''
                },
            }
        ).value;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建平面設計師
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
        //對話線程ID
        const threads_id = cf.design;
        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(threads_id, {role: 'user', content: question});
        //建立數據流
        const stream = await openai.beta.threads.runs.create(threads_id, {assistant_id: myAssistant.id, stream: true});
        let text: any = undefined;
        let use_tokens = 0
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = JSON.parse((event.data as any).content[0].text.value);
            }
            if ((event.data as any).usage) {
                use_tokens += (event.data as any).usage.total_tokens;
            }
        }
        await openai.beta.assistants.del(myAssistant.id);
        if (text) {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: text.prompt,
                n: 1,
                size: "1024x1024",
            });
            if (response.data[0]) {
                return {
                    prompt: text.prompt,
                    image: await this.convertS3Link(response.data[0].url!),
                    usage: await this.usePoints(app_name, 100000 + use_tokens, question, `使用AI進行圖片生成`)
                }
            } else {
                return {
                    text: '生成失敗，請輸入更具體一點的描述',
                    usage: 0
                }
            }
        } else {
            return {
                text: '生成失敗，請輸入更具體一點的描述',
                usage: 0
            }
        }
    }

    // 寫手
    public static async writer(app_name: string, question: string) {
        if (!await AiRobot.checkPoints(app_name)) {
            return {text: `您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]`}
        }
        let cf = (
            (
                await Private_config.getConfig({
                    appName: app_name,
                    key: 'ai_config',
                })
            )[0] ?? {
                value: {
                    order_files: '',
                    writer: '',
                },
            }
        ).value;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建客服小姐
        const query = '你是一個電商文案寫手，專門協助撰寫商品描述、行銷文案。';
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            model: 'gpt-4o-mini',
        });

        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(cf.writer, {role: 'user', content: question});
        //建立數據流
        const stream = await openai.beta.threads.runs.create(cf.writer, {assistant_id: myAssistant.id, stream: true});
        let text = '';
        let use_tokens = 0
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
            if ((event.data as any).usage) {
                use_tokens += (event.data as any).usage.total_tokens;
            }
        }
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        const answer = text.replace(regex, '')
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        }
    }

    //判斷AI代幣是否足夠
    public static async checkPoints(app_name: string) {
        const brandAndMemberType = await App.checkBrandAndMemberType(app_name);
        // 判斷錢包是否有餘額
        const sum =
            (
                await db.query(
                    `SELECT sum(money)
                     FROM \`${brandAndMemberType.brand}\`.t_ai_points
                     WHERE status in (1, 2)
                       and userID = ?`,
                    [brandAndMemberType.user_id]
                )
            )[0]['sum(money)'] || 0;
        return sum > 0
    }

    //點數扣除
    public static async usePoints(app_name: string, token_number: number, ask: string, response: string) {
        let total = token_number * 0.000018 * 10
        if (total < 1) {
            total = 1
        }
        total = Math.ceil(total * -1)
        const brandAndMemberType = await App.checkBrandAndMemberType(app_name);
        await db.query(`insert into \`${brandAndMemberType.brand}\`.t_ai_points
                        set ?`, [
            {
                orderID: Tool.randomNumber(8),
                money: total,
                userID: brandAndMemberType.user_id,
                status: 1,
                note: JSON.stringify({
                    ask: ask,
                    response: response,
                    token_number: token_number
                })
            }
        ])
        return total * -1
    }

    //AI客服設定
    public static async syncAiRobot(app: string) {
        try {
            const copy = await (new User(app)).getConfigV2({key: 'robot_ai_reply', user_id: 'manager'})
            copy.ai_refer_file = undefined
            const refer_question = JSON.parse(JSON.stringify(copy))
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
            ])
            const jsonStringQA = JSON.stringify(refer_question);
            const file1 = tool.randomString(10) + '.json';

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            fs.writeFileSync(file1, jsonStringQA);
            const file = await openai.files.create({
                file: fs.createReadStream(file1),
                purpose: 'assistants',
            });
            fs.rmSync(file1);
            copy.ai_refer_file = file.id;
            await (new User(app)).setConfig({key: 'robot_ai_reply', value: copy, user_id: 'manager'})
            return file.id;
        } catch (e) {

        }
    }

    //AI回覆
    public static async aiResponse(app_name: string, question: string) {
        if (!await AiRobot.checkPoints(app_name)) {
            return undefined;
        }
        let cf = await (new User(app_name)).getConfigV2({
            key: 'robot_ai_reply',
            user_id: 'manager'
        })
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建客服小姐
        let use_tokens = 0
        const query = `你是一個AI客服，請用我提供給你的檔案來回覆問題，檔案中包含一個question的陣列，當用戶提出了問題，請先遍歷question陣列，判斷提問的內容是否與ask或者keywords相關，
        請不要經過任何修改直接回覆response欄位，另外這點請你非常注意若無法找到相關資料，請直接回答『no-data』就好，不要回答其他文字內容。`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: 'AI客服',
            tools: [{type: 'code_interpreter'}],
            tool_resources: {
                code_interpreter: {
                    file_ids: [cf.ai_refer_file],
                },
            },
            model: 'gpt-4o-mini',
        });
        //對話線程ID
        const threads_id = (await openai.beta.threads.create()).id
        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(threads_id, {
            role: 'user',
            content: question
        });
        //建立數據流
        const stream = await openai.beta.threads.runs.create(threads_id, {
            assistant_id: myAssistant.id,
            stream: true
        });
        let text = '';
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
            if ((event.data as any).usage) {
                use_tokens += (event.data as any).usage.total_tokens;
            }
        }
        const regex = /【[^】]*】/g;
        const answer = text.replace(regex, '')
        await openai.beta.assistants.del(myAssistant.id);
        if (answer === 'orders-search') {
            function extractNumbers(text: any) {
                // 使用正則表達式 \d+ 來找到數字
                const numbers = text.match(/\d+/g);
                // 將找到的數字從字串轉換成數字
                return numbers ? numbers.map(Number) : '';
            }

            if (extractNumbers(question)) {
                const order_data = await new Shopping(app_name).getCheckOut({
                    page: 0,
                    limit: 5000,
                    returnSearch: 'true',
                    search: extractNumbers(question)
                })
                if (order_data) {
                    return {
                        text: [
                            `這筆訂單建立於${moment(order_data.created_time).tz('Asia/Taipei').format('YYYY/MM/DD HH:mm')}`,
                            `付款狀態為『 ${(() => {
                                switch (order_data.status ?? 0) {
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
                                switch (order_data.orderData.progress ?? 'wait') {
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
                            `購買項目有:\n${order_data.orderData.lineItems.map((item: any) => {
                                return `${item.title} * ${item.count}`
                            }).join('\n')} `
                        ].join('\n'),
                        usage: await this.usePoints(app_name, use_tokens, question, answer)
                    }
                } else {
                    return {
                        text: '查物相關訂單',
                        usage: await this.usePoints(app_name, use_tokens, question, answer)
                    }
                }
            } else {
                return {
                    text: '您好，查詢訂單相關資料必須同時告知訂單號碼，例如:『 訂單號碼1723274721的配送狀態 』',
                    usage: await this.usePoints(app_name, use_tokens, question, answer)
                }
            }

        }
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        }
    }

    //代碼生成
    public static async codeGenerator(app_name: string, question: string) {
        if (!await AiRobot.checkPoints(app_name)) {
            return {usage: 0}
        }
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建網頁設計師
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
        //對話線程ID
        const threads_id = (await openai.beta.threads.create()).id
        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(threads_id, {role: 'user', content: question});
        //建立數據流
        const stream = await openai.beta.threads.runs.create(threads_id, {assistant_id: myAssistant.id, stream: true});
        let text = '';
        let use_tokens = 0
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = JSON.parse((event.data as any).content[0].text.value);
            }
            if ((event.data as any).usage) {
                use_tokens += (event.data as any).usage.total_tokens;
            }
        }
        await openai.beta.assistants.del(myAssistant.id);
        return {
            obj: text,
            usage: await this.usePoints(app_name, use_tokens, question, text)
        }
    }

    //上傳檔案
    public static async uploadFile(file_name: string, fileData: Buffer) {
        const TAG = `[AWS-S3][Upload]`;
        const logger = new Logger();
        const s3bucketName = config.AWS_S3_NAME;
        const s3path = file_name;
        const fullUrl = config.AWS_S3_PREFIX_DOMAIN_NAME + s3path;
        const params = {
            Bucket: s3bucketName,
            Key: s3path,
            Expires: 300,
            //If you use other contentType will response 403 error
            ContentType: (() => {
                if (config.SINGLE_TYPE) {
                    return `application/x-www-form-urlencoded; charset=UTF-8`;
                } else {
                    return mime.getType(<string>fullUrl.split('.').pop());
                }
            })(),
        };
        return new Promise<string>((resolve, reject) => {
            s3bucket.getSignedUrl('putObject', params, async (err: any, url: any) => {
                if (err) {
                    logger.error(TAG, String(err));
                    // use console.log here because logger.info cannot log err.stack correctly
                    console.log(err, err.stack);
                    reject(false);
                } else {
                    axios({
                        method: 'PUT',
                        url: url,
                        data: fileData,
                        headers: {
                            'Content-Type': params.ContentType,
                        },
                    })
                        .then(() => {
                            console.log(fullUrl);
                            resolve(fullUrl);
                        })
                        .catch(() => {
                            console.log(`convertError:${fullUrl}`);
                        });
                }
            });
        });
    }

    //轉換檔案連結至s3
    public static async convertS3Link(link: string) {
        // 下載圖片並讀取
        return await new Promise(async (resolve, reject) => {
            axios
                .get(link, {responseType: 'arraybuffer'})
                .then((response) => Buffer.from(response.data))
                .then((buffer) => {
                    this.uploadFile(`ai/file/${new Date().getTime()}.png`, buffer).then((url) => {
                        resolve(url)
                    });
                })
                .catch((err) => {
                    console.error('處理圖片時發生錯誤:', err);
                    resolve(false)
                });
        })
    }

    //頁面調整
    public static async codeEditor(app_name: string, question: string, format: any,assistant?:string) {
        if (!await AiRobot.checkPoints(app_name)) {
            return {usage: 0}
        }
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建網頁設計師
        const query = assistant || `幫我過濾出我要調整的項目和內容`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '網頁設計師',
            model: 'gpt-4o-mini',
            response_format: {
                "type": "json_schema", "json_schema": format
            }
        });
        //對話線程ID
        const threads_id = (await openai.beta.threads.create()).id
        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(threads_id, {role: 'user', content: question});
        //建立數據流
        const stream = await openai.beta.threads.runs.create(threads_id, {assistant_id: myAssistant.id, stream: true});
        let text = '';
        let use_tokens = 0
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = JSON.parse((event.data as any).content[0].text.value);
            }
            if ((event.data as any).usage) {
                use_tokens += (event.data as any).usage.total_tokens;
            }
        }
        await openai.beta.assistants.del(myAssistant.id);
        return {
            obj: text,
            usage: await this.usePoints(app_name, use_tokens, question, text)
        }
    }

    //搜尋商品
    public static async searchProduct(app_name: string, question: string, thread:string) {
        try {
            if (!await AiRobot.checkPoints(app_name)) {
                return {usage: 0}
            }
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            //建立客服
            const myAssistant = await openai.beta.assistants.create({
                instructions: `你是一個商品搜索員，首先我會提供給你多個商品資訊，請先協助將商品加入分析資料庫，最後我會向你提出問題，請找出符合規則的商品。`,
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
            });
            //對話線程ID
            const threads_id = thread
            //添加訊息
            const threadMessages = await openai.beta.threads.messages.create(threads_id, {role: 'user', content: `幫我尋找`+question});
            //建立數據流
            const stream = await openai.beta.threads.runs.create(threads_id, {assistant_id: myAssistant.id, stream: true});
            let text:any = '';
            let use_tokens = 0
            for await (const event of stream) {
                if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                    text =  JSON.parse((event.data as any).content[0].text.value)
                }
                if ((event.data as any).usage) {
                    use_tokens += (event.data as any).usage.total_tokens;
                }
            }
            await openai.beta.assistants.del(myAssistant.id);
            return {
                obj:text,
                usage: await this.usePoints(app_name, use_tokens, question, text)
            }
        }catch (e){
            console.log(e)
        }

    }
}
