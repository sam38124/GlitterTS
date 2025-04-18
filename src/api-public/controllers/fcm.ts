import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {User} from "../services/user";
import exception from "../../modules/exception";
import {UtPermission} from "../utils/ut-permission.js";
import {sendmail} from "../../services/ses.js";
import {compare_sql_table} from "../../services/saas-table-check.js";
import {Firebase} from "../../modules/firebase";

const router: express.Router = express.Router();

export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        console.log(`req==>`,req.body)
        return  response.succ(resp,{result:true})
        if (await UtPermission.isManager(req)) {
            const app=req.get('g-app') as string
            let device_token_stack:any=[];
            for (const b of req.body.device_token){
                //所有用戶
                if(b==='all'){
                    device_token_stack=device_token_stack.concat((await db.query(`select * from \`${app}\`.t_fcm`,[])).map((dd:any)=>{
                        return dd.deviceToken
                    }));
                }else{
                    device_token_stack.push(b)
                }
            }
            req.body.device_token=device_token_stack;
            for (const b of chunkArray(Array.from(new Set(req.body.device_token)), 20)) {
                let check = b.length;
                let t_notice_insert:any={}
                await new Promise(async (resolve) => {
                    for (const d of b) {
                        const userID=((await db.query(`select userID from \`${app}\`.t_fcm where deviceToken=?`,[d]))[0] ?? {}).userID
                        if(userID && !t_notice_insert[userID]){
                            t_notice_insert[userID]=true
                            await db.query(`insert into \`${app}\`.t_notice (user_id, tag, title, content, link)
                                        values (?, ?, ?, ?, ?)`, [
                                userID,
                                'manual',
                                req.body.title,
                                req.body.content,
                                req.body.link || ''
                            ])
                        }
                        if(d){
                            new Firebase(req.get('g-app') as string).sendMessage({
                                title:req.body.title,
                                token:d,
                                tag:req.body.tag || '',
                                link:req.body.link || '',
                                body:req.body.content
                            }).then(()=>{
                                check--
                                if (check === 0) {
                                    resolve(true);
                                }
                            })
                        }else{
                            check--
                            if (check === 0) {
                                resolve(true);
                            }
                        }
                    }
                });
            }
            return response.succ(resp,{result:true})
        }else{
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});


function chunkArray(array: any, groupSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}