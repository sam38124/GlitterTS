"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaughtError = void 0;
const process_1 = __importDefault(require("process"));
const database_1 = __importDefault(require("../modules/database"));
class CaughtError {
    static initial() {
        process_1.default.on('uncaughtException', async (err) => {
            if (process_1.default.env.is_local !== 'true') {
                console.error('Uncaught Exception:', err);
                if (err.message.includes('Too many connections')) {
                    process_1.default.exit(1);
                }
                else {
                    await database_1.default.query(`insert into \`${process_1.default.env.GLITTER_DB}\`.error_log (message, stack)
                        values (?, ?)`, [err.message, err.stack]);
                    process_1.default.exit(1);
                }
            }
            else {
                console.error('Uncaught Exception:', err);
                process_1.default.exit(1);
            }
        });
    }
    static warning(tag, message, stack) {
        database_1.default.query(`insert into \`${process_1.default.env.GLITTER_DB}\`.warning_log (tag, message, stack)
              values (?, ?, ?)`, [tag, message, stack]);
    }
}
exports.CaughtError = CaughtError;
//# sourceMappingURL=caught-error.js.map