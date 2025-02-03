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
    static history(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/line_message?${(() => {
                    let par = [`type=list`, `limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.sendTime && par.push(`sendDate=${json.sendTime.date}&sendTime=${json.sendTime.time}`);
                    json.status && par.push(`status=${json.status.join(',')}`);
                    json.mailType && par.push(`mailType=${json.mailType.join(',')}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
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
