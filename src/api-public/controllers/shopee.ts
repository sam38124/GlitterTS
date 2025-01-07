import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';
import {SMS} from "../services/sms.js";
import {LineMessage} from "../services/line-message";

const router: express.Router = express.Router();

export = router;
//
// router.get('/', async (req: express.Request, resp: express.Response) => {
//     try {
//         console.log("req.body in get -- ", req.body)
//     } catch (err) {
//         return response.fail(resp, err);
//     }
// });
// router.post('/listenMessage', async (req: express.Request, resp: express.Response) => {
//     try {
//         console.log("req.body in post -- ", req.body)
//         return response.succ(
//             resp,
//             {
//                 "result":"OK"
//             }
//         )
//     } catch (err) {
//         return response.fail(resp, err);
//     }
// });
// router.get('/listenMessage', async (req: express.Request, resp: express.Response) => {
//     try {
//         console.log("req.body in post -- ", req)
//         return response.succ(
//             resp,
//             {
//                 "result":"OK"
//             }
//         )
//     } catch (err) {
//         return response.fail(resp, err);
//     }
// });
