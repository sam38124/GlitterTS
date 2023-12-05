"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
class Manager {
    constructor(token) {
        this.token = token;
    }
    async setConfig(config) {
        try {
            await database_js_1.default.execute(`replace
            into \`${config.appName}\`.public_config (\`key\`,\`value\`,updated_at)
            values (?,?,?)
            `, [
                config.key,
                config.value,
                new Date()
            ]);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async getConfig(config) {
        try {
            return await database_js_1.default.execute(`select * from \`${config.appName}\`.public_config where \`key\`=${database_js_1.default.escape(config.key)}
            `, []);
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
}
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map