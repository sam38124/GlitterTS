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
                case 'login_fb_setting':
                    data['secret'] = undefined;
                    data['fans_token'] = undefined;
                    data['fans_id'] = undefined;
                    break;
                case 'login_google_setting':
                    data['secret'] = undefined;
                    break;
                case 'login_apple_setting':
                    data['secret'] = undefined;
                    data['team_id'] = undefined;
                    data['bundle_id'] = undefined;
                    data['secret'] = undefined;
                    data['key_id'] = undefined;
                    break;
            }
        }
        return data;
    }
}
exports.FilterProtectData = FilterProtectData;
//# sourceMappingURL=filter-protect-data.js.map