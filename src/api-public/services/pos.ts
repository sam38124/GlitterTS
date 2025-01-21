import {IToken} from "../models/Auth.js";
import db from '../../modules/database.js';
import exception from "../../modules/exception.js";

export class Pos {
    public app: string;

    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    //取得上下班狀態
    public async getWorkStatus() {
        try {
            const status = await db.query(`SELECT *
                                           FROM \`${this.app}\`.t_check_in_pos
                                           where staff = ?
                                           order by id desc limit 0,1;`, [this.token?.userID]);
            return (status[0] && status[0].execute) || 'off_work'
        } catch (e) {
            throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e, null);
        }
    }
    //設定上下班狀態
    public async setWorkStatus(obj:{
        user_id?:string,
        status:'off_work'|'on_work'
    }){
        try {
            await db.query(`insert into \`${this.app}\`.t_check_in_pos (staff,execute) values (?,?)`,[
                this.token?.userID,
                obj.status
            ])
        }catch (e) {
            throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'setWorkStatus is Failed. ' + e, null);
        }
    }
    //新增小結單
    public async setSummary(obj:{
        id?:string,
        staff:string,
        summary_type:string,
        content:any
    }){
        try {
            if(obj.id){
                await db.query(`update \`${this.app}\`.\`t_pos_summary\` set staff=?,summary_type=?,content=? where id=?`,[
                    obj.staff,
                    obj.summary_type,
                    JSON.stringify(obj.content),
                    obj.id
                ])
            }else{
                await db.query(`insert into \`${this.app}\`.\`t_pos_summary\` (staff,\`summary_type\`,content) values (?,?,?)`,[
                    obj.staff,
                    obj.summary_type,
                    JSON.stringify(obj.content)
                ])
            }

        }catch (e) {
            throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'setSummary is Failed. ' + e, null);
        }
    }

    //取得小結單
    public async getSummary(shop:string){
        try {
            return (await db.query(`select * from \`${this.app}\`.\`t_pos_summary\` where content->>'$.store'=? order by id desc`,[shop])).map((dd:any)=>{
                dd.created_time=dd.created_time.toISOString()
                return dd
            })
        }catch (e) {
            throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'setSummary is Failed. ' + e, null);
        }
    }
}