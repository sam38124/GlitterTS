import {IToken} from "../models/Auth.js";
import express from "express";
import response from "../modules/response.js";
import {Template} from "../services/template.js";
import {Private_config} from "../services/private_config.js";
import {App} from "../services/app.js";
import {UtPermission} from "../api-public/utils/ut-permission.js";
import {GlobalEvent} from "../services/global-event.js";
const router: express.Router = express.Router();
export = router;
router.get('/',async (req: express.Request, resp: express.Response) =>{
    try {
        const event=new GlobalEvent(req.get('g-app') as string,req.body.token as any);
        return response.succ(resp, await event.getEvent({
            tag:req.query.tag as string
        }));
    } catch (err) {
        return response.fail(resp, err);
    }
})

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        if(await UtPermission.isManager(req)){
            const event=new GlobalEvent(req.get('g-app') as string,req.body.token as any);
            return response.succ(resp, await event.addEvent(req.body));
        }else{
            return response.fail(resp, {message:"No Permission!"});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});


router.put('/', async (req: express.Request, resp: express.Response) => {
    try {
        if(await UtPermission.isManager(req)){
            const event=new GlobalEvent(req.get('g-app') as string,req.body.token as any);
            return response.succ(resp, await event.putEvent(req.body));
        }else{
            return response.fail(resp, {message:"No Permission!"});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        if(await UtPermission.isManager(req)){
            const event=new GlobalEvent(req.get('g-app') as string,req.body.token as any);
            return response.succ(resp, await event.deleteEvent(req.body));
        }else{
            return response.fail(resp, {message:"No Permission!"});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
