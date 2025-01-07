"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineMessage = void 0;
const mime = require('mime');
class LineMessage {
    constructor(app, token) {
        this.app = app;
        this.token = token !== null && token !== void 0 ? token : undefined;
    }
    generateAuth() {
        const partner_id = "1249034";
        const path = "https://partner.test-stable.shopeemobile.com/";
        const timestamp = Math.floor(Date.now() / 1000);
        const redirectUrl = "https://3013f93153a1.ngrok.app/api-public/v1/shopee/listenMessage?g-app=t_1725992531001";
        const baseString = `${partner_id}${redirectUrl}${timestamp}`;
    }
}
exports.LineMessage = LineMessage;
//# sourceMappingURL=shopee.js.map