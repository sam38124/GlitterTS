import express from "express";
import response from "../modules/response";
import db from '../modules/database';
import {saasConfig} from "../config";
import {User} from "../services/user";
import exception from "../modules/exception";
const router: express.Router = express.Router();

export = router;

router.post('/register', async (req: express.Request, resp: express.Response) => {
    try {
        if((await User.checkUserExists(req.body.account))){
            throw exception.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
        }else{

            return response.succ(resp, { result:true , token:(await User.createUser(req.body.account,req.body.pwd)).token});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/login', async (req: express.Request, resp: express.Response) => {
    try {
        if(!(await User.checkUserExists(req.body.account))){
            throw exception.BadRequestError('NO_AD', 'Account not found.', null);
        }else{
            return response.succ(resp, { userData:await User.login(req.body.account,req.body.pwd)});
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/checkToken', async (req: express.Request, resp: express.Response) => {
    try {
       return response.succ(resp, { result:true});
    } catch (err) {
        return response.fail(resp, err);
    }
});

