import {Private_config} from "../../services/private_config.js";
import OpenAI from "openai";
import moment from "moment";
import {Ai} from "../../services/ai";

export class AiRobot{
    //操作導引
    public static async guide(app_name:string,question: string) {
        console.log(`ask-guide`+new Date().getTime())
        let cf = (
            (
                await Private_config.getConfig({
                    appName: app_name,
                    key: 'ai_config',
                })
            )[0] ?? {
                value: {
                    "writer": '',
                    "order_analysis":'',
                    "operation_guide":""
                },
            }
        ).value;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        //創建客服小姐
        const query = `您是一個後台導引員，請用我提供給你的檔案來回覆用戶訊息，檔案中包含question與answer欄位，當用戶提出了問題，請先判斷問題性質包含了哪些question的可能，判斷question後，最後直接給予answer回答。
`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            tools: [{ type: 'code_interpreter' }],
            tool_resources: {
                code_interpreter: {
                    file_ids: [Ai.files.guide],
                },
            },
            model: 'gpt-4o-mini',
        });

        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(cf.operation_guide, { role: 'user', content: question });
        //建立數據流
        const stream = await openai.beta.threads.runs.create(cf.operation_guide, { assistant_id: myAssistant.id, stream: true });
        let text = '';
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
        }
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        return text.replace(regex, '');
    }

    //訂單分析
    public static async orderAnalysis(app_name:string,question: string) {
        console.log(`ask-ai`+new Date().getTime())
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
        const query = `現在時間為${moment().tz('Asia/Taipei').format('YYYY/MM/DD HH:mm:ss')}，您是一個訂單資料分析師，請依照我給你的檔案，進行訂單資料的分析。
`;
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

        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(cf.order_analysis, { role: 'user', content: question });
        //建立數據流
        const stream = await openai.beta.threads.runs.create(cf.order_analysis, { assistant_id: myAssistant.id, stream: true });
        let text = '';
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
        }
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        return text.replace(regex, '');
    }

    //寫手
    public static async writer(app_name:string,question: string) {
        console.log(`ask-ai`+new Date().getTime())
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
        const query = `您是一個AI文案寫手，專門協助撰寫任何商品或者行銷文案。
`;
        const myAssistant = await openai.beta.assistants.create({
            instructions: query,
            name: '數據分析師',
            model: 'gpt-4o-mini',
        });

        //添加訊息
        const threadMessages = await openai.beta.threads.messages.create(cf.writer, { role: 'user', content: question });
        //建立數據流
        const stream = await openai.beta.threads.runs.create(cf.writer, { assistant_id: myAssistant.id, stream: true });
        let text = '';
        for await (const event of stream) {
            if (event.data && (event.data as any).content && (event.data as any).content[0] && (event.data as any).content[0].text) {
                text = (event.data as any).content[0].text.value;
            }
        }
        const regex = /【[^】]*】/g;
        await openai.beta.assistants.del(myAssistant.id);
        return text.replace(regex, '');
    }
}