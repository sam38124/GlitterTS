var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseApi } from '../../glitterBundle/api/base.js';
export class ApiLiveInteraction extends BaseApi {
    static createScheduled(json) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/customer_sessions`,
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
                data: JSON.stringify({ data: json }),
            });
        });
    }
    static getScheduled(json) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/customer_sessions?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`orderString=${json.orderString}`);
                    par.push(`type=${json.type}`);
                    return par.join('&');
                })()}`,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
                data: JSON.stringify({ data: json }),
            });
        });
    }
    static getOnlineCart(cartID) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/customer_sessions/online_cart?cartID=${cartID}`,
                type: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
            });
        });
    }
    static getCartList(scheduleID) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/customer_sessions/online_cart_list?scheduleID=${scheduleID}`,
                type: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
            });
        });
    }
    static closeSchedule(scheduleID) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/customer_sessions/close`,
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
                data: JSON.stringify({
                    scheduleID: scheduleID,
                }),
            });
        });
    }
    static finishSchedule(scheduleID) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/customer_sessions/finish`,
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
                data: JSON.stringify({
                    scheduleID: scheduleID,
                }),
            });
        });
    }
    static getRealCart(cartArray) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/customer_sessions/realOrder`,
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
                data: JSON.stringify({ cartArray: cartArray }),
            });
        });
    }
    static send(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/line_message`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static delete(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/sns`,
            type: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
}
function getConfig() {
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}
