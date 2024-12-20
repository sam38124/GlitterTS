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
    static quickRegister(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/manager/register`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: window.parent.saasConfig.config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static getNotice(cf) {
        if (window.glitter.getUrlParameter('cms') === 'true') {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/user/notice?page=${cf.page}&limit=${cf.limit}`,
                type: 'GET',
                headers: {
                    'g-app': window.parent.glitterBase,
                    'Content-Type': 'application/json',
                    Authorization: window.parent.saasConfig.config.token,
                },
            });
        }
        else {
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
    }
    static getNoticeUnread(appName, token) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/notice/unread/count`,
            type: 'GET',
            headers: {
                'g-app': appName || getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: token || GlobalUser.userToken,
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
    static getUserLevel(token, user_id) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/level?id=${user_id}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
    }
    static getLevelConfig(token) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/level/config`,
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
            url: getBaseUrl() + `/api-public/v1/user/check/email/exists?email=${email}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
        });
    }
    static getPhoneCount(phone) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/check/phone/exists?phone=${phone}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
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
    static setSaasUserData(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user`,
            type: 'PUT',
            headers: {
                'g-app': window.glitterBase,
                'Content-Type': 'application/json',
                Authorization: GlobalUser.saas_token,
            },
            data: JSON.stringify({
                userData: json,
            }),
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
    static getUsersDataWithEmail(email) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user?email=${email}&type=account`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token || GlobalUser.token,
            },
        });
    }
    static getUsersDataWithEmailOrPhone(search_s) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user?search=${search_s}&type=email_or_phone`,
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
    static emailVerify(email, app_name) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/email-verify`,
            type: 'POST',
            headers: {
                'g-app': app_name || getConfig().config.appName,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                email: email,
            }),
        });
    }
    static phoneVerify(phone_number) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/phone-verify`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                phone_number: phone_number,
            }),
        });
    }
    static registerFCM(userID, deviceToken, app_name) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/fcm`,
            type: 'POST',
            headers: {
                'g-app': app_name || getConfig().config.appName,
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
    static getFilterString(obj) {
        if (!obj)
            return [];
        let list = [];
        if (obj) {
            if (obj.account && obj.account.length > 0) {
                list.push(`account=${obj.account}`);
            }
        }
        return list;
    }
    static getSubScribe(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user/subscribe?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.filter && par.push(ApiUser.getFilterString(json.filter).join('&'));
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
                    json.search_type && par.push(`searchType=${json.search_type}`);
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
    static userListFilterString(obj) {
        if (!obj)
            return [];
        let list = [];
        if (obj.created_time && obj.created_time.length > 1 && obj.created_time[0].length > 0 && obj.created_time[1].length > 0) {
            list.push(`created_time=${obj.created_time[0]},${obj.created_time[1]}`);
        }
        if (obj.birth && obj.birth.length > 0) {
            list.push(`birth=${obj.birth.join(',')}`);
        }
        if (obj.level && obj.level.length > 0) {
            list.push(`level=${obj.level.join(',')}`);
        }
        if (obj.rebate && obj.rebate.key && obj.rebate.value) {
            list.push(`rebate=${obj.rebate.key},${obj.rebate.value}`);
        }
        if (obj.total_amount && obj.total_amount.key && obj.total_amount.value) {
            list.push(`total_amount=${obj.total_amount.key},${obj.total_amount.value}`);
        }
        return list;
    }
    static userListGroupString(obj) {
        if (!obj)
            return [];
        let list = [];
        if (obj.type && obj.type.length > 0) {
            list.push(`groupType=${obj.type}`);
        }
        if (obj.tag && obj.tag.length > 0) {
            list.push(`groupTag=${obj.tag}`);
        }
        return list;
    }
    static getUserListOrders(json) {
        const filterString = this.userListFilterString(json.filter);
        const groupString = this.userListGroupString(json.group);
        const userData = BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user?${(() => {
                    let par = [`type=list`, `limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`order_string=${json.orderString}`);
                    json.filter_type && par.push(`filter_type=${json.filter_type}`);
                    filterString.length > 0 && par.push(filterString.join('&'));
                    groupString.length > 0 && par.push(groupString.join('&'));
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        }).then((data) => __awaiter(this, void 0, void 0, function* () {
            if (!data.result) {
                return {
                    response: {
                        data: [],
                        total: 0,
                    },
                };
            }
            const array = data.response.data;
            if (array.length > 0) {
                yield new Promise((resolve, reject) => {
                    let pass = 0;
                    function checkPass() {
                        pass++;
                        if (pass === array.length) {
                            resolve(true);
                        }
                    }
                    for (let index = 0; index < array.length; index++) {
                        function execute() {
                            Promise.all([
                                new Promise((resolve) => {
                                    ApiUser.getUserLevel(getConfig().config.token, array[index].userID).then((dd) => {
                                        if (dd.result) {
                                            array[index].tag_name = dd.response[0] ? dd.response[0].data.tag_name : '一般會員';
                                            resolve();
                                        }
                                        else {
                                            execute();
                                        }
                                    });
                                }),
                                new Promise((resolve) => {
                                    ApiShop.getOrder({
                                        page: 0,
                                        limit: 99999,
                                        data_from: 'manager',
                                        email: array[index].account,
                                        status: 1,
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
                                            resolve();
                                        }
                                        else {
                                            execute();
                                        }
                                    });
                                }),
                            ]).then(() => {
                                checkPass();
                            });
                        }
                        execute();
                    }
                });
            }
            return {
                response: {
                    data: array,
                    total: data.response.total,
                    extra: data.response.extra,
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
                'g-app': json.app_name || getConfig().config.appName,
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
    static forgetPwdCheckCode(email, code) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/forget/check-code`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                email: email,
                code: code,
            }),
        });
    }
    static resetPwdV2(email, code, pwd) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/reset/pwd`,
            type: 'PUT',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                email: email,
                code: code,
                pwd: pwd,
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
                'g-app': json.app_name || getConfig().config.appName,
            },
            data: JSON.stringify(json),
        });
    }
    static checkAdminAuth(cg) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/check-admin-auth`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': cg.app,
                Authorization: cg.token,
            },
        });
    }
    static setPublicConfig(cf) {
        var _a;
        window.glitter.share._public_config = (_a = window.glitter.share._public_config) !== null && _a !== void 0 ? _a : {};
        const config = window.glitter.share._public_config;
        config[cf.key + cf.user_id] = undefined;
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/public/config`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: cf.token || (cf.user_id ? getConfig().config.token : GlobalUser.token),
            },
            data: JSON.stringify({
                key: cf.key,
                value: cf.value,
                user_id: cf.user_id,
            }),
        });
    }
    static getPublicConfig(key, user_id, appName = getConfig().config.appName) {
        return new Promise((resolve, reject) => {
            var _a;
            window.glitter.share._public_config = (_a = window.glitter.share._public_config) !== null && _a !== void 0 ? _a : {};
            const config = window.glitter.share._public_config;
            if (config[key + user_id]) {
                resolve(config[key + user_id]);
                return;
            }
            BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/user/public/config?key=${key}&user_id=${user_id}`,
                type: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': appName,
                    Authorization: getConfig().config.token,
                },
            }).then((res) => {
                switch (key) {
                    case 'collection':
                    case 'footer-setting':
                    case 'menu-setting':
                    case 'message_setting':
                        config[key + user_id] = res;
                        break;
                    case 'image-manager':
                        if (!Array.isArray(res.response.value)) {
                            res.response.value = [];
                        }
                        break;
                }
                if (key.indexOf('alt_') === 0) {
                    config[key + user_id] = res;
                }
                resolve(res);
            });
        });
    }
    static getUserGroupList(type, tag) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/group?type=${type !== null && type !== void 0 ? type : ''}&tag=${tag !== null && tag !== void 0 ? tag : ''}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }
    static getUserRebate(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/rebate?type=user&${(() => {
                    let par = [];
                    json.email && par.push(`email=${json.email}`);
                    json.id && par.push(`user_id=${json.id}`);
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
    static permissionFilterString(obj) {
        if (!obj)
            return [];
        let list = [];
        if (obj) {
            if (obj.status.length > 0) {
                list.push(`status=${obj.status.join(',')}`);
            }
        }
        return list;
    }
    static getPermission(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user/permission?page=${json.page}&limit=${json.limit}&${(() => {
                    let par = [];
                    json.queryType && par.push(`queryType=${json.queryType}`);
                    json.query && par.push(`query=${json.query}`);
                    json.orderBy && par.push(`orderBy=${json.orderBy}`);
                    json.self && par.push(`self=${json.self}`);
                    if (json.filter) {
                        par = par.concat(this.permissionFilterString(json.filter));
                    }
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
    static setPermission(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/permission`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static deletePermission(email) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/permission`,
            type: 'DELETE',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ email: email || '' }),
        });
    }
    static togglePermissionStatus(email) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/permission/status`,
            type: 'PUT',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({ email: email }),
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
