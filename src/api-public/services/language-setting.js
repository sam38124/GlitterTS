"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageSetting = void 0;
const user_js_1 = require("./user.js");
class LanguageSetting {
    static async getLanguage(prefer, appName) {
        let store_info = await new user_js_1.User(appName).getConfigV2({
            key: 'store-information',
            user_id: 'manager',
        });
        if (store_info.language_setting.support.includes(prefer)) {
            return prefer;
        }
        else {
            return store_info.language_setting.def;
        }
    }
}
exports.LanguageSetting = LanguageSetting;
//# sourceMappingURL=language-setting.js.map