import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';
import {SMS} from "../services/sms.js";
import {LineMessage} from "../services/line-message";
import httpStatus from "http-status-codes";
import {FbMessage} from "../services/fb-message";
import { FacebookService } from '../services/fb-service';

const router: express.Router = express.Router();

export = router;

router.get('/oauth', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
                resp,
                await new FacebookService(req.get('g-app') as string, req.body.token).getOauth({code: req.query.code as string})
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/pages', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
              resp,
              await new FacebookService(req.get('g-app') as string, req.body.token).getAuthPage()
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.post('/live/start', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
              resp,
              await new FacebookService(req.get('g-app') as string, req.body.token).launchFacebookLive(req.body)
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
router.get('/live/comments', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
              resp,
              await new FacebookService(req.get('g-app') as string, req.body.token).getLiveComments(req.query.scheduled_id as string, req.query.liveID as string , req.query.accessToken as string , req.query?.after as string??"")
            );
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});
