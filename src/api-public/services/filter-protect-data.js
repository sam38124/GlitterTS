"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterProtectData = void 0;
class FilterProtectData {
    static filter(key, data) {
        if (data) {
            switch (key) {
                case 'login_line_setting':
                    data['secret'] = undefined;
                    data['message_token'] = undefined;
                    break;
            }
        }
        return data;
    }
}
exports.FilterProtectData = FilterProtectData;
//# sourceMappingURL=filter-protect-data.js.map