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
import {Live_source} from "../../live_source.js";
import {IToken} from "../models/Auth.js";
import {ApiPublic} from "../services/public-table-check.js";


/*********SET UP Router*************/
router.use('/api-public/*', doAuthAction);
router.use(config.getRoute(config.public_route.user, 'public'), userRouter);
router.use(config.getRoute(config.public_route.post, 'public'), postRouter);

/******************************/
const whiteList: {}[] = [
    {url: config.getRoute(config.public_route.user + "/register", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.user + "/login", 'public'), method: 'POST'},
    {url: config.getRoute(config.public_route.post, 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user + "/checkMail", 'public'), method: 'GET'},
    {url: config.getRoute(config.public_route.user+"/userdata", 'public'), method: 'GET'}
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
    if (
        matches.length > 0
    ) {
        next();
        return;
    }
    const token = req.get('Authorization')?.replace('Bearer ', '') as string;
    try {
        req.body.token = jwt.verify(token, config.SECRET_KEY) as IToken;
        const redisToken = await redis.getValue(token);
        if (!redisToken) {
            logger.error(TAG, 'Token is not match in redis.');
            return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'invalid token'));
        }
        next()
    } catch (err) {
        logger.error(TAG, `Unexpected exception occurred because ${err}.`);
        return response.fail(resp, exception.PermissionError('INVALID_TOKEN', 'invalid token'));
    }
}


export = router;