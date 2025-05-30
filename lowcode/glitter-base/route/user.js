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
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Ad } from '../../public-components/public/ad.js';
export class ApiUser {
    static register(json) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res_ = yield BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/user/register`,
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': getConfig().config.appName,
                },
                data: JSON.stringify(json),
            });
            if (res_.result) {
                try {
                    GlobalUser.token = res_.response.token;
                    GlobalUser.userInfo = res_.response;
                    GlobalUser.updateUserData = JSON.parse(JSON.stringify(res_.response));
                }
                catch (e) {
                }
                Ad.gtagEvent('sign_up', {
                    method: 'normal'
                });
                Ad.fbqEvent('CompleteRegistration', {
                    method: 'normal'
                });
            }
            resolve(res_);
        }));
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
        if (!token) {
            return new Promise((resolve, reject) => {
                resolve({
                    response: {},
                    result: false
                });
            });
        }
        else {
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
        return new Promise((resolve, reject) => {
            BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/user/phone-verify`,
                type: 'POST',
                headers: {
                    'g-app': getConfig().config.appName,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    phone_number: phone_number,
                }),
            }).then(res => {
                if (res.response.out_limit) {
                    const dialog = new ShareDialog(window.glitter);
                    dialog.errorMessage({
                        text: '連續驗證失敗超過三次，請聯絡客服進行修改',
                    });
                }
                else {
                    resolve(res);
                }
            });
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
    static getSubScribe(json) {
        return BaseApi.create({
            url: getBaseUrl() +
                `/api-public/v1/user/subscribe?${(() => {
                    let par = [`limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.filter && par.push(ApiUser.formatFilterString(json.filter).join('&'));
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
        const url = getBaseUrl() +
            `/api-public/v1/user?${(() => {
                let par = [`type=list`, `limit=${json.limit}`, `page=${json.page}`];
                json.search && par.push(`search=${json.search}`);
                json.search_type && par.push(`searchType=${json.search_type}`);
                json.only_id && par.push(`only_id=${json.only_id}`);
                json.id && par.push(`id=${json.id}`);
                return par.join('&');
            })()}`;
        return BaseApi.create({
            url: url,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        });
    }
    static formatFilterString(obj) {
        if (!obj)
            return [];
        return Object.entries(obj).flatMap(([key, value]) => {
            if (!value)
                return [];
            if (Array.isArray(value) && value.length > 0 && value.every(Boolean)) {
                return `${key}=${value
                    .map((dd, index) => {
                    if (['last_shipment_date', 'last_order_time'].includes(key)) {
                        if (index === 0) {
                            return new Date(`${dd} 00:00:00`).toISOString();
                        }
                        else {
                            return new Date(`${dd} 23:59:59`).toISOString();
                        }
                    }
                    return dd;
                })
                    .join(',')}`;
            }
            if (typeof value === 'object' && value !== null) {
                const valObj = value;
                if ('key' in valObj && 'value' in valObj && valObj.key && valObj.value) {
                    return `${key}=${valObj.key},${valObj.value}`;
                }
            }
            return [];
        });
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
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const filterString = this.formatFilterString(json.filter);
            const groupString = this.userListGroupString(json.group);
            const baseQuery = new URLSearchParams({
                type: 'list',
                limit: json.limit.toString(),
                page: json.page.toString(),
                search: (_a = json.search) !== null && _a !== void 0 ? _a : '',
                id: (_b = json.id) !== null && _b !== void 0 ? _b : '',
                searchType: (_c = json.searchType) !== null && _c !== void 0 ? _c : '',
                order_string: (_d = json.orderString) !== null && _d !== void 0 ? _d : '',
                filter_type: (_e = json.filter_type) !== null && _e !== void 0 ? _e : '',
                all_result: json.all_result ? `${json.all_result}` : '',
                only_id: json.only_id ? `${json.only_id}` : '',
            }).toString();
            const extraQuery = [...filterString, ...groupString].join('&');
            const finalQuery = extraQuery ? `${baseQuery}&${extraQuery}` : baseQuery;
            try {
                const data = yield BaseApi.create({
                    url: `${getBaseUrl()}/api-public/v1/user?${finalQuery}`,
                    type: 'GET',
                    headers: {
                        'g-app': getConfig().config.appName,
                        'Content-Type': 'application/json',
                        Authorization: getConfig().config.token,
                    },
                });
                if (!data.result) {
                    return {
                        response: { data: [], total: 0 },
                    };
                }
                return {
                    response: {
                        data: data.response.data,
                        allUsers: data.response.allUsers,
                        total: data.response.total,
                        extra: data.response.extra,
                    },
                };
            }
            catch (error) {
                console.error('Error fetching user list orders:', error);
                return {
                    response: { data: [], total: 0 },
                };
            }
        });
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res_ = yield BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/user/login`,
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'g-app': json.app_name || getConfig().config.appName,
                    Authorization: json.token,
                },
                data: JSON.stringify(json),
            });
            if (res_.response.create_user_success) {
                try {
                    GlobalUser.token = res_.response.token;
                    GlobalUser.userInfo = res_.response;
                    GlobalUser.updateUserData = JSON.parse(JSON.stringify(res_.response));
                }
                catch (e) {
                }
                Ad.gtagEvent('sign_up', {
                    method: json.login_type || 'normal'
                });
                Ad.fbqEvent('CompleteRegistration', {
                    method: json.login_type || 'normal'
                });
            }
            else {
                Ad.gtagEvent('login', {
                    method: json.login_type || 'normal'
                });
                Ad.fbqEvent('Login', {
                    method: json.login_type || 'normal'
                });
            }
            resolve(res_);
        }));
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
            const tag = [appName, key, user_id].join('');
            const config = window.glitter.share._public_config;
            if (config[tag]) {
                resolve(config[tag]);
                return;
            }
            function callback(res) {
                if (key.indexOf('shipment_config_') === 0 &&
                    window.parent.glitter.getUrlParameter('function') !== 'backend-manger') {
                    config[tag] = res;
                }
                switch (key) {
                    case 'app-header-config':
                    case 'collection':
                    case 'footer-setting':
                    case 'menu-setting':
                    case 'message_setting':
                    case 'promo-label':
                        if (window.parent.glitter.getUrlParameter('function') !== 'backend-manger') {
                            config[tag] = res;
                        }
                        break;
                    case 'image-manager':
                        if (!Array.isArray(res.response.value)) {
                            res.response.value = [];
                        }
                        break;
                }
                if (key.indexOf('alt_') === 0) {
                    config[tag] = res;
                }
                resolve(res);
            }
            const find_ = this.getting_config.find(dd => {
                return dd.key === tag;
            });
            if (find_) {
                find_.array.push(callback);
            }
            else {
                this.getting_config.push({ key: tag, array: [callback] });
                BaseApi.create({
                    url: getBaseUrl() + `/api-public/v1/user/public/config?key=${key}&user_id=${user_id}`,
                    type: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'g-app': appName,
                        Authorization: getConfig().config.token,
                    },
                }).then(res => {
                    this.getting_config = this.getting_config.filter(d1 => {
                        if (d1.key === tag) {
                            d1.array.map(dd => {
                                return dd(res);
                            });
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                });
            }
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
                        par = par.concat(this.formatFilterString(json.filter));
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
    static getUserPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getPermission({ page: 0, limit: 1000 }).then(data => {
                if (!data.result) {
                    return undefined;
                }
                const find_user = data.response.data.find((data) => {
                    return `${data.user}` === `${GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID}`;
                });
                return find_user;
            });
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
    static batchAddTag(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/batch/tag`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static batchRemoveTag(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/batch/tag`,
            type: 'DELETE',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
    static batchManualLevel(json) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/batch/manualLevel`,
            type: 'POST',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify(json),
        });
    }
}
ApiUser.normalMember = {
    id: '',
    duration: { type: 'noLimit', value: 0 },
    tag_name: '一般會員',
    condition: { type: 'total', value: 0 },
    dead_line: { type: 'noLimit' },
    create_date: '2024-01-01T00:00:00.000Z',
};
ApiUser.getting_config = [];
function getConfig() {
    const saasConfig = window.parent.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}
