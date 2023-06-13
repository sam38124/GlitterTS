import express from "express";
import response from "../modules/response";
import db from '../modules/database';
import {saasConfig} from "../config";
const router: express.Router = express.Router();
export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        return response.succ(resp, { test:true});
    } catch (err) {
        return response.fail(resp, err);
    }
});