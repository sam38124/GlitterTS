import express from "express";
import response from "../modules/response";
import jwt from 'jsonwebtoken';
import redis from '../modules/redis';
import db from '../modules/database';
import {config, saasConfig} from "../config";
const router: express.Router = express.Router();
import Logger from "../modules/logger";
import _ from "underscore";
import exception from "../modules/exception";
import {IToken} from "../models/Auth.js";
import {Ai} from "../services/ai.js";

router.use('/api/*', doAuthAction);
router.use(config.getRoute(config.route.user), require('./user'));
router.use(config.getRoute(config.route.template), require('./template'));
router.use(config.getRoute(config.route.app), require('./app'));
router.use(config.getRoute(config.route.fileManager),require('./filemanager'))
router.use(config.getRoute(config.route.private),require('./private_config'))
router.use(config.getRoute(config.route.ai),require('./ai'))
router.use(config.getRoute(config.route.globalEvent),require('./global-event'))
router.use(config.getRoute(config.route.backendServer),require('./backend-server'))
router.use(config.getRoute(config.route.page),require('./page'))

/******************************/

const whiteList:{}[] = [
    { url: config.getRoute(config.route.user)+"/login", method: 'POST' },
    { url: config.getRoute(config.route.user)+"/register", method: 'POST' },
    { url: config.getRoute(config.route.app)+"/plugin", method: 'GET' },
    { url: config.getRoute(config.route.app)+"/version", method: 'GET' },
    { url: config.getRoute(config.route.app)+"/template", method: 'GET' },
    { url: config.getRoute(config.route.template), method: 'GET' },
    { url: config.getRoute(config.route.fileManager)+"/upload", method: 'POST' },
    { url: config.getRoute(config.route.app)+"/official/plugin", method: 'GET' },
    { url: config.getRoute(config.route.globalEvent), method: 'GET' },
    { url: config.getRoute(config.route.page), method: 'GET' },
];

async function doAuthAction(req: express.Request, resp: express.Response, next: express.NextFunction) {
    const logger = new Logger();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;

    const matches = _.where(whiteList, { url: url, method: req.method });
    const token = req.get('Authorization')?.replace('Bearer ', '') as string;
    if (
        matches.length > 0
    ) {
        try {
            req.body.token = jwt.verify(token, config.SECRET_KEY) as IToken;
        }catch (e) {}
        next();
        return;
    }
    try {
        req.body.token = jwt.verify(token, config.SECRET_KEY) as IToken;
        const redisToken = await redis.getValue(token);
        if (!redisToken&&process.env.editorToken!==req.body.token) {
            const tokenCheck=await db.query(`select count(1) from \`${saasConfig.SAAS_NAME}\`.t_user where userData->>'$.editor_token'=?`,[token])
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