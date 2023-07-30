'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../modules/logger"));
const database_1 = __importDefault(require("../modules/database"));
const redis_1 = __importDefault(require("../modules/redis"));
const config_1 = __importDefault(require("../config"));
class UserUtil {
    static async insertNewUser(trans, id, email, pwd, firstName, lastName, gender, birth) {
        const SQL = `
            INSERT INTO t_user (id, email,
                                first_name,
                                last_name,
                                gender,
                                ${birth ? 'birth,' : ''}
                                pwd)
            VALUES (${id}, ${database_1.default.escape(email)},
                    ${database_1.default.escape(firstName)},
                    ${database_1.default.escape(lastName)},
                    ${gender},
                    ${birth ? `${database_1.default.escape(birth)},` : ''}
                    ${database_1.default.escape(pwd)})
        `;
        await trans.execute(SQL, {});
        return;
    }
    static async updateUser({ trans, id, email, pwd, firstName, lastName, gender, phone, birth, }) {
        const SQL = `
            update t_user
            set first_name= ${database_1.default.escape(firstName)},
                last_name= ${database_1.default.escape(lastName)},
                phone=${database_1.default.escape(phone)},
                ${pwd ? `pwd=${database_1.default.escape(pwd)},` : ''}
                    ${gender ? `gender= ${gender},` : ''} ${birth ? `birth= ${database_1.default.escape(birth)},` : ''}
                id=${id}
            where email = ${database_1.default.escape(email)}
        `;
        await trans.execute(SQL, {});
        return;
    }
    static async generateToken(userObj) {
        const iat = Math.floor(Date.now() / 1000);
        const expTime = 5 * 60 * 60;
        const payload = {
            account: userObj.account,
            userID: userObj.user_id,
            iat: iat,
            exp: iat + expTime,
            userData: userObj.userData
        };
        const signedToken = jsonwebtoken_1.default.sign(payload, config_1.default.SECRET_KEY);
        await redis_1.default.setValue(signedToken, String(iat));
        return signedToken;
    }
    static async expireToken(token) {
        const logger = new logger_1.default();
        const TAG = 'ExpireToken';
        logger.info(TAG, 'Expire token in redis.');
        redis_1.default.expire(token, 0);
    }
}
exports.default = UserUtil;
//# sourceMappingURL=UserUtil.js.map