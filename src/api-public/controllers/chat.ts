import express from "express";
import {Chat, ChatRoom} from "../services/chat";
import response from "../../modules/response.js";
import {UtDatabase} from "../utils/ut-database.js";
import {UtPermission} from "../utils/ut-permission.js";
import db from "../../modules/database.js";
import exception from "../../modules/exception.js";

const router: express.Router = express.Router();

export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        const chat=new Chat(req.get('g-app') as string,req.body.token)
        await chat.addChatRoom(req.body)
        return response.succ(resp, {result: true});
    } catch (e) {
        return response.fail(resp, e);
    }
})
router.post('/message', async (req: express.Request, resp: express.Response) => {
    try {
        const chat=new Chat(req.get('g-app') as string,req.body.token)
        await chat.addMessage(req.body)
        return response.succ(resp, {result: true});
    } catch (e) {
        return response.fail(resp, e);
    }
})
router.get('/message', async (req: express.Request, resp: express.Response) => {
    try {
        const chat=new Chat(req.get('g-app') as string,req.body.token)
        return response.succ(resp, await chat.getMessage(req.query));
    } catch (e) {
        return response.fail(resp, e);
    }
})

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        const chat=new Chat(req.get('g-app') as string,req.body.token)
        if(await UtPermission.isManager(req)){
            return response.succ(resp, await chat.getChatRoom(req.query,req.query.user_id as any));
        }else{
            return response.succ(resp, await chat.getChatRoom(req.query,req.body.token.userID));
        }

    } catch (e) {
        return response.fail(resp, e);
    }
})

router.delete('/', async (req: express.Request, resp: express.Response) => {
    try {
        if ((await UtPermission.isManager(req))) {
            await db.query(`delete
                            FROM \`${req.get('g-app') as string}\`.t_chat_list
                            where id in (?)`, [(req.query.id as string).split(',')])
            return response.succ(resp, {result: true});
        } else{
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
})