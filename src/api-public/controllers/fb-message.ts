import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';
import {SMS} from "../services/sms.js";
import {LineMessage} from "../services/line-message";
import httpStatus from "http-status-codes";
import {FbMessage} from "../services/fb-message";

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new LineMessage(req.get('g-app') as string, req.body.token).getLine({
                    type: req.query.list ? `${req.query.list}` : '',
                    page: req.query.page ? parseInt(`${req.query.page}`, 10) : 0,
                    limit: req.query.limit ? parseInt(`${req.query.limit}`, 10) : 99999,
                    search: req.query.search ? `${req.query.search}` : '',
                    status: req.query.status !== undefined ? `${req.query.status}` : '',
                    searchType: req.query.searchType ? `${req.query.searchType}` : '',
                    mailType: req.query.mailType ? `${req.query.mailType}` : '',
                })
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/listenMessage', async (req: express.Request, resp: express.Response) => {
    try {
        //FB webhook 驗證，記得網頁上的
        if (req.query['hub.verify_token'] === 'my_secret_token') {
            let challenge = req.query["hub.challenge"];

            return resp.status(httpStatus.OK).send(challenge)
        }
      // https://www.facebook.com/dialog/oauth?client_id=556137570735606&redirect_uri=https%3A%2F%2Fshopnex.cc%2F&scope=pages_read_engagement%2Cpages_manage_metadata%2Cpages_read_user_content%2Cpages_show_list&state=test
      // https://www.facebook.com/dialog/oauth?
      //   client_id=556137570735606&
      //   redirect_uri=https://08e5ebd30cf4.ngrok.app/api-public/v1/fb_message/listenMessage?g-app=t_1725992531001&
      // scope=pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_show_list&
      // state=test
      // https://shopnex.tw/#_=_?code=AQAuNqckNF5AjMwBCZB--xamyoAt9MMzM_Pz-cxfUpRw6Syy0ry7uu6KeS5REtEqyAv_RrXCt7WerYM8FqjpD7ObOBUYPRWqCKa9I0ja6H4-TA9qOVm0hu0-8zYRxmMo4UqCB6iOO6SiLVC33WPoHKcSPYAwXWcYVUimGwEflGHnFWB_lHvVFjG-rygSa74o3NyuejXdH8I8LRKq2yJyzLltc604nJwM63-n7siKfjwQJYkaJ3ityMeVAbhS0Z9GaifbfAatYfqbBNqkn0hsGiDy-rxsWJbB8O0NO0qNaVUYLCU7aXhNFMmpj-sYksNZkfOF9a_t3m3K4k7jUd1XjmQgyovEnsfPWUsflQsoV3d4eJ1jJqgn_2o_qmK0RH1XNR4&state=test
      // https://shopnex.tw/#_=_?code=AQCbDv2wFIm2B-LONfMaPdb7WhNNu33k6Jb1R2XE76hPinG0LSq8aND1QAj_X9-bI4PAdOn97DNfgHhfkI50cYa7rHLhams7JjQTCJDbCcQQx3Pbz1CTQdRhkUo2zK0CtzUVM5VSSSnX_fOINPIti_R9e_2upwSeRwzOPgTPCymAiE7cNglrwqie7fq3oXC8I17GMy4-YQh8yVcabiHs2oFcCYmt4RPyp0jqMUN9Nes4KgbgiHvQRLjnCe0ioPl6r17SkfN1_wJQ4c823FYdGA_3Ak-AgvG6N_rbcfCIeVNY3h2LuoipigJHQya-Q_Cz3A_YD93WB0rj71hQ5kTho8q7JJGO2WQf3dzOoAv13oKRBHgHRI2m_AOq3hIXzDEdtuE
      //       // &state=test
      //
      //   https://graph.facebook.com/v22.0/oauth/access_token?client_id=556137570735606&redirect_uri=https%3A%2F%2Fshopnex.cc%2F&client_secret=861f9adf9c3c147a5f78246d03e6dabe&code=AQAo3dKiL9TR_lBG0MMFCVk9TqRDH9xWVF164XbB4V-xCYT3GC8peOdx-xwu3xj0vDRuM8RUyoSOIJ3J_Jv9b2LTy54l12WzjzZAme7y16PvbiJMEv0q49M_nENlLpPWF47LSsLJ6QCVoZLBONFge0irZnGDoMjlAww2NJASknaczDFj0WHdno-SUWgPMTZJkUFSTFOeRjGpl2olp5gDYXG1XoDr1RWw5AkZ0kMsJd-4nrSfoJkS7LORlgZ0YIIMh0rlLqCw7abIGpqA7sd3Obx16u7ijvw8sGsnBnqZJ1_OqFoqKkuYGpAWCnWnsuW98wbsnjut8OQ2ytQH0siBkK9rKJgvZNIMyShe7lwJVLK2iKRcs0_w_Gn1iAr7GVGSGyw

      // await new LineMessage(req.get('g-app') as string, req.body.token).listenMessage(req.body)
        // return response.succ(
        //     resp,
        //     {
        //         "result":"OK"
        //     }
        // )
        return response.succ(resp,{
                  "result":"OK"
              });
    } catch (err:any) {
        return response.fail(resp, err.response?.data || err.message)
    }
});

router.post('/listenMessage', async (req: express.Request, resp: express.Response) => {
    try {
        await new FbMessage(req.get('g-app') as string, req.body.token).listenMessage(req.body)
        return resp.status(httpStatus.OK).send("收到你的訊息")
    } catch (err:any) {
        return response.fail(resp, err.response?.data || err.message);
    }
});

