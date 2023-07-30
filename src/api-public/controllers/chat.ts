import express from "express";
import {Chat, ChatRoom} from "../services/chat";
import response from "../../modules/response.js";

const router: express.Router = express.Router();

export = router;
router.get('/', async (req: express.Request, resp: express.Response) => {

})

router.post('/addChatRoom', async (req: express.Request, resp: express.Response) => {
    try {
        const chat=new Chat(req.get('g-app') as string,req.body.token)
        const result=await chat.addChatRoom(req.body.data)
        return response.succ(resp, {result: true});
    } catch (e) {
        return response.fail(resp, e);
    }
})