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
import { GlobalUser } from '../global/global-user.js';
export class ApiFbService extends BaseApi {
    static getOauth(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const gapp = localStorage.getItem('gapp');
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/fb/oauth?code=${code}`,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': gapp,
                    Authorization: GlobalUser.userToken,
                },
            });
        });
    }
    static getPageAuthList() {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/fb/pages`,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
            });
        });
    }
    static launchFacebookLive(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/fb/live/start`,
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
                data: JSON.stringify(data),
            });
        });
    }
    static getLiveComments(scheduled_id, liveID, accessToken, after) {
        return __awaiter(this, void 0, void 0, function* () {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/fb/live/comments?scheduled_id=${scheduled_id}&liveID=${liveID}&accessToken=${accessToken}${after ? `&after=${after}` : ''}`,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                    Authorization: getConfig().config.token,
                },
            });
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
