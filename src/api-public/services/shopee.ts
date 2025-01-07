import { IToken } from '../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { AutoSendEmail } from './auto-send-email.js';
import config from '../../config.js';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { App } from '../../services/app.js';
import Tool from '../../modules/tool.js';
import { Chat } from './chat.js';
import { User } from './user.js';
import Logger from '../../modules/logger.js';
import s3bucket from '../../modules/AWSLib.js';
import { Jimp } from 'jimp';
import redis from "../../modules/redis.js";

const mime = require('mime');


export class LineMessage {
    public app;
    public token: IToken | undefined;

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token ?? undefined;
    }
    public generateAuth (){
        const partner_id = "1249034";//測試版是test partner_id;

        // const path = "https://partner.shopeemobile.com/ "//正式版環境
        const path = "https://partner.test-stable.shopeemobile.com/";
        const timestamp = Math.floor(Date.now() / 1000);

        const redirectUrl = "https://3013f93153a1.ngrok.app/api-public/v1/shopee/listenMessage?g-app=t_1725992531001";
        const  baseString = `${partner_id}${redirectUrl}${timestamp}`;
    }
}
