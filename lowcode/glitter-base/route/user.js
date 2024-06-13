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
import { ApiShop } from './shopping.js';
export class ApiUser {
    constructor() { }
    static register(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/register`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
            data: JSON.stringify(json),
        });
    }
    static getNotice(cf) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/notice?page=${cf.page}&limit=${cf.limit}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: GlobalUser.userToken,
            },
        });
    }
    static getNoticeUnread() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/notice/unread/count`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: GlobalUser.userToken,
            },
        });
    }
    static getUserData(token, type) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user?type=${type}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
    }
    static getEmailCount(email) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/check/email/exists?email=${email}`,
            "type": "GET",
            "headers": {
                "g-app": getConfig().config.appName,
                "Content-Type": "application/json",
            }
        });
    }
    static getSaasUserData(token, type) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user?type=${type}`,
            type: 'GET',
            headers: {
                'g-app': window.glitterBase,
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
    }
    static getUsersData(userID) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/userdata?userID=${userID}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token || GlobalUser.token,
            },
        });
    }
    static subScribe(email, tag) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/subscribe`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                email: email,
                tag: tag,
            }),
        });
    }
    static registerFCM(userID, deviceToken) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/fcm`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                userID: userID,
                deviceToken: deviceToken,
            }),
        });
    }
    static getFCM(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user/fcm?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    static getSubScribe(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user/subscribe?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    static getSubScribeMailSettingList(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user/subscribe?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    static deleteSubscribe(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/subscribe`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static getUserList(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user?${(() => {
                    let par = [`type=list`, `limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    static getUserListOrders(json) {
        const userData = BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user?${(() => {
                    let par = [`type=list`, `limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        }).then((data) => __awaiter(this, void 0, void 0, function* () {
            const array = data.response.data;
            yield new Promise((resolve, reject) => {
                let pass = 0;
                function checkPass() {
                    if (pass === array.length) {
                        resolve(true);
                    }
                    pass++;
                }
                for (let index = 0; index < array.length; index++) {
                    function execute() {
                        const res = array[index];
                        Promise.all([
                            new Promise((resolve) => {
                                ApiUser.getPublicUserData(res.userID).then((dd) => {
                                    array[index].tag_name =
                                        (dd.response.member.find((dd) => {
                                            return dd.trigger;
                                        }) || {}).tag_name || '一般會員';
                                    resolve();
                                });
                            }),
                            new Promise((resolve) => {
                                ApiShop.getOrder({
                                    page: 0,
                                    limit: 99999,
                                    data_from: 'manager',
                                    email: res.account,
                                }).then((data) => {
                                    if (data.result) {
                                        array[index].checkout_total = (() => {
                                            let t = 0;
                                            for (const d of data.response.data) {
                                                t += d.orderData.total;
                                            }
                                            return t;
                                        })();
                                        array[index].checkout_count = data.response.total;
                                        checkPass();
                                    }
                                    else {
                                        execute();
                                    }
                                });
                            }),
                        ]);
                    }
                    execute();
                }
                checkPass();
            });
            return {
                response: {
                    data: array,
                    total: data.response.total,
                },
            };
        }));
        return userData;
    }
    static deleteUser(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user`,
            type: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static getPublicUserData(id) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/userdata?userID=${id}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
        });
    }
    static forgetPwd(email) {
        const href = new URL('./index.html', location.href);
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/forget`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                email: email,
                host_name: href,
            }),
        });
    }
    static resetPwd(pwd) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/resetPwd`,
            type: 'PUT',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify({
                pwd: pwd,
            }),
        });
    }
    static resetPwdCheck(oldPwd, pwd) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/resetPwdNeedCheck`,
            type: 'PUT',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify({
                pwd: pwd,
                old_pwd: oldPwd,
            }),
        });
    }
    static updateUserData(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user`,
            type: 'PUT',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: GlobalUser.token,
            },
            data: JSON.stringify({
                userData: json,
            }),
        });
    }
    static updateUserDataManager(json, userID) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user?userID=${userID}`,
            type: 'PUT',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                userData: json,
            }),
        });
    }
    static login(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/login`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
            data: JSON.stringify(json),
        });
    }
    static setPublicConfig(cf) {
        return BaseApi.create({
            "url": getBaseUrl() + `/api-public/v1/user/public/config`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "g-app": getConfig().config.appName,
                "Authorization": cf.token || ((cf.user_id) ? getConfig().config.token : GlobalUser.token)
            },
            data: JSON.stringify({
                key: cf.key,
                value: cf.value,
                user_id: cf.user_id,
            }),
        });
    }
    static getPublicConfig(key, user_id) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/public/config?key=${key}&user_id=${user_id}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
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
