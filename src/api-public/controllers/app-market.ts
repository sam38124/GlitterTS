import express, { query } from 'express';
import response from '../../modules/response';
import exception from '../../modules/exception';
import { UtPermission } from '../utils/ut-permission.js';
import { Mail } from '../services/mail.js';
import {SMS} from "../services/sms.js";
import {LineMessage} from "../services/line-message";
import { MarketService } from '../services/app-market';

const router: express.Router = express.Router();

export = router;

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
          return response.succ(
            resp,
            await new MarketService(req.get('g-app') as string, req.body.token).getAppList()
          )
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/install', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {

      return response.succ(
        resp,
        await new MarketService(req.get('g-app') as string, req.body.token).getInstallAppList()
      )
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.get('/published', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {

      return response.succ(
        resp,
        await new MarketService(req.get('g-app') as string, req.body.token).getPublishtdAppList()
      )
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
