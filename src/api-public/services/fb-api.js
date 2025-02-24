"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FbApi = void 0;
const user_js_1 = require("./user.js");
const axios_1 = __importDefault(require("axios"));
const tool_js_1 = __importDefault(require("../../services/tool.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
class FbApi {
    constructor(app_name, token) {
        this.app_name = app_name;
        this.token = token;
    }
    async config() {
        const cf = await new user_js_1.User(this.app_name).getConfigV2({
            key: 'login_fb_setting',
            user_id: 'manager'
        });
        return {
            link: `https://graph.facebook.com/v22.0/${cf.pixel}/events`.trim(),
            api_token: cf.api_token
        };
    }
    async checkOut(data) {
        const cf = await this.config();
        if (cf.link && cf.api_token) {
            return await new Promise(async (resolve, reject) => {
                try {
                    axios_1.default
                        .post(cf.link, JSON.stringify({
                        data: [{
                                "event_name": "Purchase",
                                "event_time": (new Date().getTime() / 1000).toFixed(0),
                                "action_source": "website",
                                "user_data": {
                                    "em": [
                                        tool_js_1.default.hashSHA256(data.customer_info.email)
                                    ],
                                    "ph": [
                                        tool_js_1.default.hashSHA256(data.customer_info.phone)
                                    ],
                                    "client_ip_address": data.client_ip_address,
                                    "fbc": data.fbc,
                                    "fbp": data.fbp
                                },
                                "custom_data": {
                                    "currency": "TWD",
                                    "value": data.total
                                }
                            }],
                        access_token: cf.api_token
                    }), {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((response) => {
                        console.log('FB APIC已成功發送:', response.data);
                        resolve(response.data);
                    })
                        .catch((error) => {
                        console.error('發送FB APIC發生錯誤:', error.response ? error.response.data : error.message);
                        resolve(false);
                    });
                }
                catch (e) {
                    console.error(e);
                    resolve(false);
                }
            });
        }
    }
    async post(data, req) {
        var _a;
        try {
            const cf = await this.config();
            console.log(`cf.link=>`, this.app_name);
            console.log(`cf.link=>`, cf.link);
            console.log(`cf.api_token=>`, cf.api_token);
            if (cf.link && cf.api_token) {
                data.user_data = {
                    "client_ip_address": (req.query.ip || req.headers['x-real-ip'] || req.ip),
                    "fbc": req.cookies._fbc,
                    "fbp": req.cookies._fbp
                };
                if (this.token) {
                    const dd = (await new user_js_1.User(this.app_name).getUserData(this.token.userID, 'userID'));
                    if (dd && dd.userData) {
                        const email = dd.userData.email;
                        const phone = dd.userData.phone;
                        email && (data.user_data.email = [tool_js_1.default.hashSHA256(email)]);
                        phone && (data.user_data.ph = [tool_js_1.default.hashSHA256(phone)]);
                    }
                }
                data.event_time = (new Date().getTime() / 1000).toFixed(0);
                return await new Promise(async (resolve, reject) => {
                    try {
                        axios_1.default
                            .post(cf.link, JSON.stringify({
                            data: [data],
                            access_token: cf.api_token,
                        }), {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                            console.log('FB APIC已成功發送:', response.data);
                            resolve(response.data);
                        })
                            .catch((error) => {
                            console.error('發送FB APIC發生錯誤:', error.response ? error.response.data : error.message);
                            resolve(false);
                        });
                    }
                    catch (e) {
                        console.error(e);
                        resolve(false);
                    }
                });
            }
        }
        catch (e) {
            console.error(e);
            throw exception_js_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
}
exports.FbApi = FbApi;
//# sourceMappingURL=fb-api.js.map