"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdate = void 0;
const user_js_1 = require("./user.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
class UserUpdate {
    static async update(app_name, userID) {
        const levels = await new user_js_1.User(app_name).getUserLevel([{ userId: userID }]);
        const dd_ = levels.find((dd) => {
            return `${dd.id}` === `${userID}`;
        });
        if (dd_ === null || dd_ === void 0 ? void 0 : dd_.data.id) {
            {
                await database_js_1.default.query(`update \`${app_name}\`.t_user set member_level=? where userID=?`, [
                    dd_ === null || dd_ === void 0 ? void 0 : dd_.data.id,
                    userID
                ]);
            }
        }
    }
}
exports.UserUpdate = UserUpdate;
//# sourceMappingURL=user-update.js.map