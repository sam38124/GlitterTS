import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {User} from "../services/user";
import exception from "../../modules/exception";

const router: express.Router = express.Router();

export = router;

// router.post('/', async (req: express.Request, resp: express.Response) => {
//     try {
//         const user = new User(req.get('g-app') as string);
//         if((await user.checkUserExists(req.body.account))){
//             throw exception.BadRequestError('BAD_REQUEST', 'user is already exists.', null);
//         }else{
//             return response.succ(resp, { result:true , token:(await user.createUser(req.body.account,req.body.pwd,req.body.userData)).token});
//         }
//     } catch (err) {
//         return response.fail(resp, err);
//     }
// });