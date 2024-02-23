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
        if (await UtPermission.isManager(req)) {
            for (const b of chunkArray(Array.from(new Set(req.body.device_token)), 20)) {
                let check = b.length;
                await new Promise((resolve) => {
                    for (const d of b) {
                        if(d){
                            new Firebase(req.get('g-app') as string).sendMessage({
                                title:req.body.title,
                                token:d,
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