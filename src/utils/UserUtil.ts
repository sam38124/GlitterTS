'use strict';
import jwt from 'jsonwebtoken';
import exception from '../modules/exception';
import Logger from '../modules/logger';
import tool from '../modules/tool';
import db from '../modules/database';
import redis from '../modules/redis';
import config from '../config';
import axios from 'axios';
import { Crypter } from '../modules/CryptoJS';
import {IToken} from "../models/Auth.js";

export default class UserUtil {
    static async insertNewUser(
        trans: any,
        id: string,
        email: string,
        pwd: string,
        firstName: string,
        lastName: string,
        gender: number,
        birth?: string
    ) {
        const SQL = `
            INSERT INTO t_user (id, email,
                                first_name,
                                last_name,
                                gender,
                                ${birth ? 'birth,' : ''}
                                pwd)
            VALUES (${id}, ${db.escape(email)},
                    ${db.escape(firstName)},
                    ${db.escape(lastName)},
                    ${gender},
                    ${birth ? `${db.escape(birth)},` : ''}
                    ${db.escape(pwd)})
        `;
        await trans.execute(SQL, {});
        return;
    }

    static async updateUser({
        trans,
        id,
        email,
        pwd,
        firstName,
        lastName,
        gender,
        phone,
        birth,
    }: {
        trans: any;
        id: number;
        email: string;
        phone: string;
        pwd?: string;
        firstName: string;
        lastName: string;
        gender?: number;
        birth?: string;
    }) {
        const SQL = `
            update t_user
            set first_name= ${db.escape(firstName)},
                last_name= ${db.escape(lastName)},
                phone=${db.escape(phone)},
                ${pwd ? `pwd=${db.escape(pwd)},` : ''}
                    ${gender ? `gender= ${gender},` : ''} ${birth ? `birth= ${db.escape(birth)},` : ''}
                id=${id}
            where email = ${db.escape(email)}
        `;
        await trans.execute(SQL, {});
        return;
    }

    static async generateToken(userObj: IUser): Promise<string> {
        // gen token
        const iat = Math.floor(Date.now() / 1000);
        const expTime = 5 * 60 * 60; // 5 hours = 60 (seconds) * 60 * (min) = 3600 * 5
        const payload: IToken = {
            account:userObj.account,
            userID: userObj.user_id,
            iat: iat,
            exp: iat + expTime,
            userData:userObj.userData
        };
        // sign token
        const signedToken = jwt.sign(payload, config.SECRET_KEY);
        // set redis
        await redis.setValue(signedToken, String(iat));

        return signedToken;
    }

    static async expireToken(token: string): Promise<void> {
        const logger = new Logger();
        const TAG = 'ExpireToken';
        logger.info(TAG, 'Expire token in redis.');
        redis.expire(token, 0);
    }
}

export interface IUser {
    user_id: number;
    account:string;
    userData:any
}
