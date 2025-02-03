import {IToken} from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';

const mime = require('mime');
interface scheduled{
    type:string,
    stream_name:string,
    streamer:string,
    platform:string,
    item_list:any[],
    stock:{
        reserve:boolean,
        expiry_date?:string,
        period:string,
    },
    discount_set:boolean
}

export class CustomerSessions {
    public app;
    public token ?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    async createScheduled(data: scheduled): Promise<{ result: boolean; message: string }>{
        try {
            // console.log("data -- " , data)
            const content = {
                platform: data.platform,
                item_list: data.item_list,
                stock: data.stock,
                discount_set: data.discount_set,
            }
            await db.query(`INSERT INTO \`${this.app}\`.\`t_live_purchase_interactions\`
                           SET ?;`,[{
                type:data.type,
                stream_name:data.stream_name,
                streamer:data.streamer,
                status:"1",
                content : JSON.stringify(content)
            }])
            return { result: false, message: '' };
        }catch (e){
            throw exception.BadRequestError('BAD_REQUEST', 'createScheduled Error:' + e, null);
        }
    }
}