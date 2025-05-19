"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSchedule = void 0;
const exception_1 = __importDefault(require("../modules/exception"));
const database_1 = __importDefault(require("../modules/database"));
const ssh_1 = require("../modules/ssh");
class SystemSchedule {
    async checkMysqlStatus(sec) {
        const prepared_stmt_count = (await database_1.default.query(`show global status like 'prepared_stmt_count';`, []))[0]['Value'];
        if (parseInt(prepared_stmt_count, 10) > 200000) {
            const response = await new Promise((resolve, reject) => {
                ssh_1.Ssh.exec([
                    `sudo docker restart $(sudo docker ps --filter "expose=3080" --format "{{.ID}}")`
                ]).then((res) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                });
            });
        }
        else {
            setTimeout(() => {
                this.checkMysqlStatus(sec);
            }, sec);
        }
    }
    start() {
        const scheduleList = [
            { second: 60, status: true, func: 'checkMysqlStatus', desc: 'MYSQL狀態檢查' }
        ];
        try {
            scheduleList.forEach((schedule) => {
                if (schedule.status && typeof this[schedule.func] === 'function') {
                    this[schedule.func](schedule.second);
                }
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Init Schedule Error: ' + e, null);
        }
    }
}
exports.SystemSchedule = SystemSchedule;
//# sourceMappingURL=system-schedule.js.map