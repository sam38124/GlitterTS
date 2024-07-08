var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import exception from "../modules/exception.js";
import db from "../modules/database.js";
import { saasConfig } from "../config.js";
import moment from "moment/moment.js";
export class Private_config {
    constructor(token) {
        this.token = token;
    }
    setConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.verifyPermission(config.appName))) {
                throw exception.BadRequestError("Forbidden", "No Permission.", null);
            }
            try {
                yield db.execute(`replace
            into \`${saasConfig.SAAS_NAME}\`.private_config (app_name,\`key\`,\`value\`,updated_at)
            values (?,?,?,?)
            `, [
                    config.appName,
                    config.key,
                    config.value,
                    moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                ]);
            }
            catch (e) {
                console.log(e);
                throw exception.BadRequestError("ERROR", "ERROR." + e, null);
            }
        });
    }
    getConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.verifyPermission(config.appName))) {
                throw exception.BadRequestError("Forbidden", "No Permission.", null);
            }
            try {
                return yield db.execute(`select * from \`${saasConfig.SAAS_NAME}\`.private_config where app_name=${db.escape(config.appName)} and 
                                             \`key\`=${db.escape(config.key)}
            `, []);
            }
            catch (e) {
                console.log(e);
                throw exception.BadRequestError("ERROR", "ERROR." + e, null);
            }
        });
    }
    static getConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db.execute(`select * from \`${saasConfig.SAAS_NAME}\`.private_config where app_name=${db.escape(config.appName)} and 
                                             \`key\`=${db.escape(config.key)}
            `, []);
            }
            catch (e) {
                console.log(e);
                throw exception.BadRequestError("ERROR", "ERROR." + e, null);
            }
        });
    }
    verifyPermission(appName) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield db.execute(`
            select count(1)
            from \`${saasConfig.SAAS_NAME}\`.app_config
            where (user = ${this.token.userID} and appName = ${db.escape(appName)})
        `, []);
            return count[0]["count(1)"] === 1;
        });
    }
}
