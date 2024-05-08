import db from '../../modules/database.js';
import exception from "../../modules/exception.js";
import {IToken} from "../models/Auth.js";
export class Article {
    public app_name: string
    public token:IToken

    constructor(app_name: string,token:any) {
        this.app_name = app_name
        this.token=token
    }

    public async addArticle(tData:any){
       try {
           if((await db.query(`select count(1) from \`${this.app_name}\`.t_manager_post where (content->>'$.type'='article') and (content->>'$.tag'='${tData.tag}')`,[]))[0]['count(1)']===0){
               tData.type='article';
               await db.query(`insert into \`${this.app_name}\`.t_manager_post (userID,content) values (${this.token.userID},?)`,[JSON.stringify(tData)]);
               return true;
           }else{
               throw exception.BadRequestError('BAD_REQUEST', 'Already exists.', null);
           }

       }catch (e:any) {
           throw exception.BadRequestError('BAD_REQUEST', e.message, null);
       }
    }

    public async putArticle(tData:any){
        try {
            await db.query(`update \`${this.app_name}\`.t_manager_post set content=? where id=? and userID=${this.token.userID}`,[JSON.stringify(tData.content),tData.id]);
            return true;

        }catch (e:any) {
            throw exception.BadRequestError('BAD_REQUEST', e.message, null);
        }
    }
}