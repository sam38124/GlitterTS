import {Private_config} from '../../services/private_config.js';
import OpenAI from 'openai';
import moment from 'moment';
import {Ai} from '../../services/ai';
import db from "../../modules/database.js";
import {App} from "../../services/app.js";
import Tool from "../../modules/tool.js";

export class AiRobot {
    // 操作引導
    public static async guide(app_name: string, question: string) {
        if (!await AiRobot.checkPoints(app_name)) {
            return  {text:`您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]`}
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
        await this.usePoints(app_name, use_tokens, question, answer)
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        }
    }

    // 訂單分析
    public static async orderAnalysis(app_name: string, question: string) {

        if (!await AiRobot.checkPoints(app_name)) {
            return  {text:`您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]`}
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
        const query = `現在時間為${moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss')}，你是一個訂單資料分析師，請依照我給你的檔案，進行訂單資料的分析。`;
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
        await this.usePoints(app_name, use_tokens, question, answer)
        return {
            text: answer,
            usage: await this.usePoints(app_name, use_tokens, question, answer)
        }
    }

    // 寫手
    public static async writer(app_name: string, question: string) {
        if (!await AiRobot.checkPoints(app_name)) {
            return  {text:`您的AI Points點數餘額不足，請先[ <a href="./?type=editor&appName=${app_name}&function=backend-manger&tab=ai-point">前往加值</a> ]`}
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
        if(total<1){
            total=1
        }
        total=Math.ceil(total * -1)
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
                    token_number:token_number
                })
            }
        ])
        return total * -1
    }
}
