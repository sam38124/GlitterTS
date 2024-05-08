import express from "express";
import response from "../../modules/response";
import jwt from 'jsonwebtoken';
import redis from '../../modules/redis';
import db from '../../modules/database';
import path from 'path';
import {config, saasConfig} from "../../config";

const router: express.Router = express.Router();
import Logger from "../../modules/logger";
import _ from "underscore";
import exception from "../../modules/exception";
import userRouter = require('./user');
import postRouter = require('./post');
import messageRouter = require('./chat');
import invoiceRouter = require('./invoice');
import sql_apiRouter = require('./sql_api');
import lambda_apiRouter = require('./lambda');
import shop_apiRouter = require('./shop');
import manager_apiRouter = require('./manager');
import app_release =require('./app-release')
import smtp =require('./smtp')
import fcm =require('./fcm')
import wallet =require('./wallet')
import article=require('./article')
import delivery=require('./delivery')
import {Live_source} from "../../live_source.js";
import {IToken} from "../models/Auth.js";
import {ApiPublic} from "../services/public-table-check.js";
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
router.use(config.getRoute(config.public_route.fcm, 'public'), fcm);
router.use(config.getRoute(config.public_route.wallet, 'public'), wallet);
router.use(config.getRoute(config.public_route.article, 'public'), article);
router.use(config.getRoute(config.public_route.delivery, 'public'), delivery);
router.use(config.getRoute(config.public_route.graph_api, 'public'), require('./graph-api'));
/******************************/
const whiteList: {}[] = [
    {url: config.getRoute(config.public_route.chat, 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.chat+'/message', 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.chat+'/unread', 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.chat+'/message', 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.chat, 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user + "/register", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.user + "/login", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.user + "/forget", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.post, 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.post+'/user', 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.post+'/manager', 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.post, 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.post+'/public/config', 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.post+'/user', 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user + "/checkMail", 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user + "/checkMail/updateAccount", 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user+"/userdata", 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user+"/subscribe", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.user+"/fcm", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.user + "/public/config", 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user + "/forget", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.sql_api, 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.sql_api, 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.lambda, 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.lambda, 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.lambda, 'public'), method: 'DELETE'},
    {url: config.getRoute(config.public_route.lambda, 'public'), method: 'PUT'},
    {url: config.getRoute(config.public_route.ec+"/product", 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.ec+"/checkout", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.ec+"/checkout/preview", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.ec+"/redirect", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.ec+"/notify", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.wallet+"/notify", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.manager+"/config", 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.article, 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.article+'/manager', 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.delivery+'/c2cMap', 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.delivery+'/c2cRedirect', 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.graph_api, 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.graph_api, 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.graph_api, 'public'), method: 'PUT'},
    {url: config.getRoute(config.public_route.graph_api, 'public'), method: 'DELETE'},
    {url: config.getRoute(config.public_route.graph_api, 'public'), method: 'PATCH'},
];

async function doAuthAction(req: express.Request, resp: express.Response, next: express.NextFunction) {
    if (Live_source.liveAPP.indexOf(`${req.get('g-app') as any ?? req.query['g-app']}`) === -1) {
        return response.fail(resp, exception.PermissionError('INVALID_APP', 'invalid app'));
    }
    //Check database scheme
    await ApiPublic.createScheme(req.get('g-app') as any ?? req.query['g-app'])
    const logger = new Logger();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;
    const matches = _.where(whiteList, {url: url, method: req.method});
    const token = req.get('Authorization')?.replace('Bearer ', '') as string;
    if (
        matches.length > 0
    ) {
        try {
            req.body.token = jwt.verify(token, config.SECRET_KEY) as IToken;
            if(req.body.token){
                await db.execute(`update \`${req.get('g-app') as any ?? req.query['g-app']}\`.t_user set online_time=NOW() where userID=?`,[
                    req.body.token.userID || '-1'
                ]);
            }
        }catch (e) {
            console.log('matchTokenError',e)
        }
        next();
        return;
    }

    try {
        req.body.token = jwt.verify(token, config.SECRET_KEY) as IToken;
        if(req.body.token){
            await db.execute(`update \`${req.get('g-app') as any ?? req.query['g-app']}\`.t_user set online_time=NOW() where userID=?`,[
                req.body.token.userID || '-1'
            ]);
        }
        const redisToken = await redis.getValue(token);
        if (!redisToken) {
            const tokenCheck=await db.query(`select count(1)  from  \`${saasConfig.SAAS_NAME}\`.user where editor_token=?`,[token])
            if(tokenCheck[0]['count(1)']!==1){
                logger.error(TAG, 'Token is not match in redis.');
                return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'invalid token'));
            }
        }
        next()
    } catch (err) {
        logger.error(TAG, `Unexpected exception occurred because ${err}.`);
        return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'invalid token'));
    }
}


export = router;