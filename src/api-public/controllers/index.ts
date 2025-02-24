import express from 'express';
import response from '../../modules/response';
import jwt from 'jsonwebtoken';
import redis from '../../modules/redis';
import db from '../../modules/database';
import { config, saasConfig } from '../../config';

const router: express.Router = express.Router();
import Logger from '../../modules/logger';
import _ from 'underscore';
import exception from '../../modules/exception';
import userRouter = require('./user');
import postRouter = require('./post');
import messageRouter = require('./chat');
import invoiceRouter = require('./invoice');
import sql_apiRouter = require('./sql_api');
import lambda_apiRouter = require('./lambda');
import shop_apiRouter = require('./shop');
import manager_apiRouter = require('./manager');
import app_release = require('./app-release');
import smtp = require('./smtp');
import sms = require('./sms');
import line_message = require('./line-message');
import fb_message = require('./fb-message');
import fcm = require('./fcm');
import wallet = require('./wallet');
import article = require('./article');
import delivery = require('./delivery');
import rebate = require('./rebate');
import recommend = require('./recommend');
import stock = require('./stock');
import shopee = require('./shopee');
import customer_sessions = require('./customer-sessions');
import { Live_source } from '../../live_source.js';
import { IToken } from '../models/Auth.js';
import { ApiPublic } from '../services/public-table-check.js';
import { Monitor } from '../services/monitor.js';
import { LanguageSetting } from '../services/language-setting.js';

/*********SET UP Router*************/
router.use('/api-public/*', doAuthAction);
router.use(config.getRoute(config.public_route.user, 'public'), userRouter);
router.use(config.getRoute(config.public_route.post, 'public'), postRouter);
router.use(config.getRoute(config.public_route.chat, 'public'), messageRouter);
router.use(config.getRoute(config.public_route.invoice, 'public'), invoiceRouter);
router.use(config.getRoute(config.public_route.sql_api, 'public'), sql_apiRouter);
router.use(config.getRoute(config.public_route.lambda, 'public'), lambda_apiRouter);
router.use(config.getRoute(config.public_route.ec, 'public'), shop_apiRouter);
router.use(config.getRoute(config.public_route.manager, 'public'), manager_apiRouter);
router.use(config.getRoute(config.public_route.app, 'public'), app_release);
router.use(config.getRoute(config.public_route.smtp, 'public'), smtp);
router.use(config.getRoute(config.public_route.sms, 'public'), sms);
router.use(config.getRoute(config.public_route.line_message, 'public'), line_message);
router.use(config.getRoute(config.public_route.fb_message, 'public'), fb_message);
router.use(config.getRoute(config.public_route.fcm, 'public'), fcm);
router.use(config.getRoute(config.public_route.wallet, 'public'), wallet);
router.use(config.getRoute(config.public_route.article, 'public'), article);
router.use(config.getRoute(config.public_route.delivery, 'public'), delivery);
router.use(config.getRoute(config.public_route.rebate, 'public'), rebate);
router.use(config.getRoute(config.public_route.recommend, 'public'), recommend);
router.use(config.getRoute(config.public_route.stock, 'public'), stock);
router.use(config.getRoute(config.public_route.shopee, 'public'), shopee);
router.use(config.getRoute(config.public_route.customer_sessions, 'public'), customer_sessions);
router.use(config.getRoute(config.public_route.graph_api, 'public'), require('./graph-api'));
router.use(config.getRoute(config.public_route.ai_chat, 'public'), require('./ai-chat'));
router.use(config.getRoute(config.public_route.ai_points, 'public'), require('./ai-points'));
router.use(config.getRoute(config.public_route.sms_points, 'public'), require('./sms-points'));
router.use(config.getRoute(config.public_route.track, 'public'), require('./track'));

/******************************/
const whiteList: {}[] = [
    { url: config.getRoute(config.public_route.customer_sessions + '/online_cart', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.shopee, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.shopee + '/listenMessage', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.shopee + '/listenMessage', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.shopee+'/stock-hook', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.shopee+'/stock-hook', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.line_message + '/listenMessage', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.fb_message + '/listenMessage', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.fb_message + '/listenMessage', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/check-admin-auth', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.chat, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.invoice + '/invoice-type', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.chat + '/message', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.chat + '/unread', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.chat + '/message', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.chat, 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/register', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/login', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/email-verify', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/phone-verify', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/forget', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/forget/check-code', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/reset/pwd', 'public'), method: 'PUT' },
    { url: config.getRoute(config.public_route.post, 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.post, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.post + '/user', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.post + '/manager', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.post, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.post + '/public/config', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.post + '/user', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/checkMail', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/check/email/exists', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/check/phone/exists', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/checkMail/updateAccount', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/userdata', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/subscribe', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/fcm', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/public/config', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/forget', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.user + '/ip/info', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.user + '/permission/redirect', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.sql_api, 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.sql_api, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.lambda, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.lambda, 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.lambda, 'public'), method: 'DELETE' },
    { url: config.getRoute(config.public_route.lambda, 'public'), method: 'PUT' },
    { url: config.getRoute(config.public_route.ec + '/product', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/product/variants', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/checkout', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/checkout/repay', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/checkout/preview', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/redirect', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/logistics/redirect', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/order', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/order/cancel', 'public'), method: 'PUT' },
    { url: config.getRoute(config.public_route.ec + '/order/proof-purchase', 'public'), method: 'PUT' },
    { url: config.getRoute(config.public_route.ec + '/order/payment-method', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/redirect', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/apple-webhook', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/notify', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/shippingMethod', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ai_points + '/notify', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ec + '/payment/method', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/currency-covert', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/check-login-for-order', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ec + '/verification-code', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.sms_points + '/notify', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.wallet + '/notify', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.manager + '/config', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.article, 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.article + '/manager', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.delivery + '/formView', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.delivery + '/c2cRedirect', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.delivery + '/c2cNotify', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.delivery + '/storeMaps', 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.graph_api, 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.graph_api, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.graph_api, 'public'), method: 'PUT' },
    { url: config.getRoute(config.public_route.graph_api, 'public'), method: 'DELETE' },
    { url: config.getRoute(config.public_route.graph_api, 'public'), method: 'PATCH' },
    { url: config.getRoute(config.public_route.track, 'public'), method: 'POST' },
    { url: config.getRoute(config.public_route.ai_chat + '/ask-order', 'public'), method: 'GET' },
    { url: config.getRoute(config.public_route.ai_chat + '/search-product', 'public'), method: 'POST' },

];

async function doAuthAction(req: express.Request, resp: express.Response, next_step: express.NextFunction) {
    //將請求紀錄插入SQL，監測用戶數量與避免DDOS攻擊。
    async function next() {
        await Monitor.insertHistory({ req: req, token: req.body.token, req_type: 'api' });
        next_step();
    }

    if (Live_source.liveAPP.indexOf(`${(req.get('g-app') as any) ?? req.query['g-app']}`) === -1) {
        return response.fail(resp, exception.PermissionError('INVALID_APP', 'invalid app'));
    }
    //Check database scheme
    await ApiPublic.createScheme((req.get('g-app') as any) ?? req.query['g-app']);
    const refer_app = ApiPublic.checkApp.find((dd) => {
        return (dd.app_name as any) === (req.headers['g-app'] as any);
    });
    req.headers['g-app'] = (refer_app && refer_app.refer_app) || ((req.get('g-app') as any) ?? req.query['g-app']);
    req.headers['language'] = await LanguageSetting.getLanguage(req.headers['language'] as string, req.headers['g-app'] as string);
    const logger = new Logger();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;
    const matches = _.where(whiteList, { url: url, method: req.method });
    const token = req.get('Authorization')?.replace('Bearer ', '') as string;

    async function checkBlockUser() {
        if (
            (
                await db.query(
                    `SELECT count(1)
                             FROM \`${(req.get('g-app') as any) ?? req.query['g-app']}\`.t_user
                             where userID = ?
                               and status = 0`,
                    [req.body.token.userID]
                )
            )[0]['count(1)'] === 1
        ) {
            await redis.deleteKey(token);
            return true;
        }
        await db.execute(
            `update \`${(req.get('g-app') as any) ?? req.query['g-app']}\`.t_user
                          set online_time=NOW()
                          where userID = ?`,
            [req.body.token.userID || '-1']
        );
        return false;
    }

    if (matches.length > 0) {
        try {
            req.body.token = jwt.verify(token, config.SECRET_KEY) as IToken;
            if (req.body.token) {
                if (await checkBlockUser()) {
                    return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'this user has been block.'));
                }
            }
        } catch (e) {
            console.error('matchTokenError', e);
        }
        await next();
        return;
    }

    try {
        req.body.token = jwt.verify(token, config.SECRET_KEY) as IToken;
        if (req.body.token) {
            if (await checkBlockUser()) {
                return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'this user has been block.'));
            }
        }
        const redisToken = await redis.getValue(token);
        if (!redisToken) {
            const tokenCheck = await db.query(
                `select count(1)
                                               from \`${saasConfig.SAAS_NAME}\`.user
                                               where editor_token = ?`,
                [token]
            );
            if (tokenCheck[0]['count(1)'] !== 1) {
                logger.error(TAG, 'Token is not match in redis.');
                return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'invalid token'));
            }
        }
        await next();
    } catch (err) {
        logger.error(TAG, `Unexpected exception occurred because ${err}.`);
        return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'invalid token'));
    }
}

export = router;
