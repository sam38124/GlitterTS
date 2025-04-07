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
            console.error('Uncaught Exception:', err);
            console.error('uncaughtException', err.message, err.stack);
            await database_1.default.query(`insert into \`${process_1.default.env.GLITTER_DB}\`.error_log (message, stack) values (?, ?)`, [
                err.message,
                err.stack
            ]);
            process_1.default.exit(1);
        });
    }
}
exports.CaughtError = CaughtError;
//# sourceMappingURL=caught-error.js.map