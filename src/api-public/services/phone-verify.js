"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneVerify = void 0;
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
class PhoneVerify {
    static async verify(phone, code) {
        if (await redis_js_1.default.getValue(`verify-phone-${phone}`) === code) {
            redis_js_1.default.deleteKey(`verify-phone-${phone}-last-count`);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.PhoneVerify = PhoneVerify;
//# sourceMappingURL=phone-verify.js.map