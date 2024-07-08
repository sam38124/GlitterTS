'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import Logger from '../modules/logger';
import db from '../modules/database';
import redis from '../modules/redis';
import config from '../config';
export default class UserUtil {
    static insertNewUser(trans, id, email, pwd, firstName, lastName, gender, birth) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield trans.execute(SQL, {});
            return;
        });
    }
    static updateUser({ trans, id, email, pwd, firstName, lastName, gender, phone, birth, }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield trans.execute(SQL, {});
            return;
        });
    }
    static generateToken(userObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const iat = Math.floor(Date.now() / 1000);
            const expTime = 365 * 24 * 60 * 60;
            const payload = {
                account: userObj.account,
                userID: userObj.user_id,
                iat: iat,
                exp: iat + expTime,
                userData: userObj.userData
            };
            const signedToken = jwt.sign(payload, config.SECRET_KEY);
            yield redis.setValue(signedToken, String(iat));
            return signedToken;
        });
    }
    static expireToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new Logger();
            const TAG = 'ExpireToken';
            logger.info(TAG, 'Expire token in redis.');
            redis.expire(token, 0);
        });
    }
}
