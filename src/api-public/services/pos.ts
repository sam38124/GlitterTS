import {IToken} from "../models/Auth.js";
import db from '../../modules/database.js';
import exception from "../../modules/exception.js";
import {Shopping} from "./shopping.js";

export class Pos {
    public app: string;

    public token?: IToken;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }

    //取得上下班狀態
    public async getWorkStatus(query:{
        userID:string,
        store:string
    }) {
        try {
            const status = await db.query(`SELECT *
                                           FROM \`${this.app}\`.t_check_in_pos
                                           where staff = ? and store=?
                                           order by id desc limit 0,1;`, [query.userID,query.store]);
            return (status[0] && status[0].execute) || 'off_work'
        } catch (e) {
            throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e, null);
        }
    }

    //取得上下班列表
    public async getWorkStatusList(query: {
        store:string;
        page: number;
        limit: number;
    }) {
        try {

            let querySql:string[]=[`1=1`];
            if(query.store){
                querySql.push(`store=${db.escape(query.store)}`)
            }
            return   await this.querySql(querySql, query,'t_check_in_pos');
        } catch (e) {
            throw exception.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e, null);
        }
    }
    //設定上下班狀態
    public async setWorkStatus(obj:{
        user_id?:string,
        status:'off_work'|'on_work',
        store:string
    }){
        try {
            await db.query(`insert into \`${this.app}\`.t_check_in_pos (staff,execute,store) values (?,?,?)`,[
                this.token?.userID,
                obj.status,
                obj.store
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

    public async querySql(querySql: string[], query: { page: number; limit: number; id?: string; order_by?: string },db_n:string) {
        let sql = `SELECT *
                   FROM \`${this.app}\`.\`${db_n}\`
                   WHERE ${querySql.join(' and ')} ${query.order_by || `order by id desc`}
        `;
        console.log(`query=string=>`,sql)
        if (query.id) {
            const data = (
                await db.query(
                    `SELECT *
                     FROM (${sql}) as subqyery
                         limit ${query.page * query.limit}
                        , ${query.limit}`,
                    []
                )
            )[0];
            return { data: data, result: !!data };
        } else {
            return {
                data: (
                    await db.query(
                        `SELECT *
                         FROM (${sql}) as subqyery
                             limit ${query.page * query.limit}
                            , ${query.limit}`,
                        []
                    )
                ).map((dd: any) => {
                    return dd;
                }),
                total: (
                    await db.query(
                        `SELECT count(1)
                         FROM (${sql}) as subqyery`,
                        []
                    )
                )[0]['count(1)'],
            };
        }
    }
}