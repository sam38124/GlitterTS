"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEvent = void 0;
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const database_js_1 = __importDefault(require("../modules/database.js"));
class GlobalEvent {
    constructor(appName, token) {
        this.appName = appName;
        this.token = token;
    }
    async addEvent(data) {
        try {
            if (!((await database_js_1.default.checkExists(`\`${this.appName}\`.t_global_event where tag=${database_js_1.default.escape(data.tag)}`)))) {
                await database_js_1.default.execute(`insert into \`${this.appName}\`.t_global_event (\`tag\`, \`name\`, \`json\`) value (?,?,?)`, [
                    data.tag,
                    data.name,
                    JSON.stringify(data.json)
                ]);
                return {
                    result: true
                };
            }
            else {
                throw exception_js_1.default.BadRequestError("ERROR", "ERROR.THIS TAG ALREADY USE.", null);
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async putEvent(data) {
        try {
            await database_js_1.default.execute(`replace into \`${this.appName}\`.t_global_event (\`tag\`, \`name\`, \`json\`) value (?,?,?)`, [
                data.tag,
                data.name,
                JSON.stringify(data.json)
            ]);
            return {
                result: true
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async deleteEvent(data) {
        try {
            await database_js_1.default.execute(`delete from \`${this.appName}\`.t_global_event where tag=?`, [
                data.tag
            ]);
            return {
                result: true
            };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async getEvent(query) {
        try {
            if (query.tag) {
                return {
                    result: await database_js_1.default.execute(`select *
                                              from \`${this.appName}\`.t_global_event
                                              where \`tag\` = ${database_js_1.default.escape(query.tag)}
                    `, [])
                };
            }
            else {
                return {
                    result: await database_js_1.default.execute(`select \`tag\`, \`name\`, \`json\`->'$.group' AS \`group\`
                                              from \`${this.appName}\`.t_global_event`, [])
                };
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
}
exports.GlobalEvent = GlobalEvent;
//# sourceMappingURL=global-event.js.map