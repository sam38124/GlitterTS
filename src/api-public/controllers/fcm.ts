import express from "express";
import response from "../../modules/response";
import db from '../../modules/database';
import {saasConfig} from "../../config";
import {User} from "../services/user";
import exception from "../../modules/exception";
import {UtPermission} from "../utils/ut-permission.js";
import {sendmail} from "../../services/ses.js";
import {compare_sql_table} from "../../services/saas-table-check.js";
import {Firebase} from "../../modules/firebase";
import { SMS } from '../services/sms.js';
import { Mail } from '../services/mail.js';

const router: express.Router = express.Router();

export = router;

router.post('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            const post = await new Firebase(req.get('g-app') as string).postFCM(req.body);
            return response.succ(resp, { data: "check OK" });
        } else {
            return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
        }
    } catch (err) {
        return response.fail(resp, err);
    }
});

router.get('/', async (req: express.Request, resp: express.Response) => {
    try {
        if (await UtPermission.isManager(req)) {
            return response.succ(
              resp,
              await new Firebase(req.get('g-app') as string).getFCM({
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


function chunkArray(array: any, groupSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}