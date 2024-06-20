"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = void 0;
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
class Delivery {
    constructor(appName) {
        this.appName = appName;
    }
    async getC2CMap(returnURL, logistics) {
        const appName = this.appName;
        const id = 'redirect_' + tool_js_1.default.randomString(10);
        await redis_js_1.default.setValue(id, returnURL);
        return new Promise((resolve, reject) => {
            resolve(`<form name="Newebpay" action="https://logistics.ecpay.com.tw/Express/map" method="POST" class="payment">
                            <input type="hidden" name="MerchantID" value="${process.env.EC_SHIPMENT_ID}" />
                            <input type="hidden" name="MerchantTradeNo" value="${new Date().getTime()}" />
                            <input type="hidden" name="LogisticsType" value="CVS" />
                            <input type="hidden" name="LogisticsSubType" value="${logistics}" />
                            <input type="hidden" name="IsCollection" value="N" />
                            <input type="hidden" name="ServerReplyURL" value="${process.env.DOMAIN}/api-public/v1/delivery/c2cRedirect?g-app=${appName}&return=${encodeURIComponent(id)}" />
                            <button
                                type="submit"
                                class="btn btn-secondary custom-btn beside-btn"
                                id="submit"
                                hidden
                            ></button>
                        </form>`);
        });
    }
}
exports.Delivery = Delivery;
//# sourceMappingURL=delivery.js.map