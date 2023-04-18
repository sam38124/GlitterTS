import express from "express";
import response from "../modules/response";
import jwt from 'jsonwebtoken';
import redis from '../modules/redis';
import db from '../modules/database';
import path from 'path';
import {config, saasConfig} from "../config";
const router: express.Router = express.Router();

import Logger from "../modules/logger";
import _ from "underscore";
import exception from "../modules/exception";

/*********SET UP Router*************/
import userRouter=require('./user');
import template=require('./template');
import app=require('./app');
import filemanager=require('./filemanager')
import * as fs from "fs";
import {Express} from "express-serve-static-core";
router.use('/api/*', doAuthAction);
router.use(config.getRoute(config.route.user), userRouter);
router.use(config.getRoute(config.route.template), template);
router.use(config.getRoute(config.route.app), app);
router.use(config.getRoute(config.route.fileManager),filemanager)
/******************************/

const whiteList:{}[] = [
    { url: config.getRoute(config.route.user)+"/login", method: 'POST' },
    { url: config.getRoute(config.route.user)+"/register", method: 'POST' },
    { url: config.getRoute(config.route.app)+"/plugin", method: 'GET' },
    { url: config.getRoute(config.route.template), method: 'GET' },
    { url: config.getRoute(config.route.fileManager)+"/upload", method: 'POST' },
];
async function doAuthAction(req: express.Request, resp: express.Response, next: express.NextFunction) {
    const logger = new Logger();
    const TAG = '[DoAuthAction]';
    const url = req.baseUrl;
    const matches = _.where(whiteList, { url: url, method: req.method });
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