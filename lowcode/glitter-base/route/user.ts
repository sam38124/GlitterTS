import { BaseApi } from '../../glitterBundle/api/base.js';
import { GlobalUser } from '../global/global-user.js';
import { ApiShop } from './shopping.js';

export class ApiUser {
    constructor() {}

    public static register(json: { account: string; pwd: string; userData: any }) {
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

    public static quickRegister(json: { account: string; pwd: string; userData: any }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/manager/register`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: (window.parent as any).saasConfig.config.token,
            },
            data: JSON.stringify(json),
        });
    }

    public static getNotice(cf: { page: number; limit: number }) {
        if ((window as any).glitter.getUrlParameter('cms') === 'true') {
            return BaseApi.create({
                url: getBaseUrl() + `/api-public/v1/user/notice?page=${cf.page}&limit=${cf.limit}`,
                type: 'GET',
                headers: {
                    'g-app': (window.parent as any).glitterBase,
                    'Content-Type': 'application/json',
                    Authorization: (window.parent as any).saasConfig.config.token,
                },
            });
        } else {
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

    public static getNoticeUnread(appName?: string, token?: string) {
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

    public static getUserData(token: string, type: 'list' | 'me') {
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

    public static getUserLevel(token: string, user_id: string) {
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

    public static getLevelConfig(token: string) {
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

    public static getEmailCount(email: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/check/email/exists?email=${email}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
        });
    }
    public static getPhoneCount(phone: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/check/phone/exists?phone=${phone}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
        });
    }


    public static getSaasUserData(token: string, type: 'list' | 'me') {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user?type=${type}`,
            type: 'GET',
            headers: {
                'g-app': (window as any).glitterBase,
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
    }

    public static setSaasUserData(json: any) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user`,
            type: 'PUT',
            headers: {
                'g-app': (window as any).glitterBase,
                'Content-Type': 'application/json',
                Authorization: GlobalUser.saas_token,
            },
            data: JSON.stringify({
                userData: json,
            }),
        });
    }

    public static getUsersData(userID: string) {
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

    public static getUsersDataWithEmail(email: string) {
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
    public static getUsersDataWithEmailOrPhone(search_s: string) {
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

    public static subScribe(email: string, tag: string) {
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
    public static emailVerify(email: string, app_name?: string) {
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
    public static phoneVerify(phone_number: string) {
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

    public static registerFCM(userID: string, deviceToken: string, app_name?: string) {
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

    public static getFCM(json: { limit: number; page: number; search?: string; id?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
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

    static getFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
        if (obj) {
            if (obj.account && obj.account.length > 0) {
                list.push(`account=${obj.account}`);
            }
        }
        return list;
    }

    public static getSubScribe(json: { limit: number; page: number; search?: string; id?: string; filter?: any }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
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

    public static getSubScribeMailSettingList(json: { limit: number; page: number; search?: string; id?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
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

    public static deleteSubscribe(json: { email: string }) {
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

    public static getUserList(json: { limit: number; page: number; search?: string; id?: string; search_type?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
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

    public static userListFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
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

    public static userListGroupString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
        if (obj.type && obj.type.length > 0) {
            list.push(`groupType=${obj.type}`);
        }
        if (obj.tag && obj.tag.length > 0) {
            list.push(`groupTag=${obj.tag}`);
        }
        return list;
    }

    public static getUserListOrders(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        searchType?: string;
        orderString?: string;
        filter?: any;
        status?: number;
        group?: any;
        filter_type?: string;
    }) {
        const filterString = this.userListFilterString(json.filter);
        const groupString = this.userListGroupString(json.group);
        const userData = BaseApi.create({
            url:
                getBaseUrl() +
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
        }).then(async (data) => {
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
                await new Promise((resolve, reject) => {
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
                                new Promise<void>((resolve) => {
                                    ApiUser.getUserLevel(getConfig().config.token, array[index].userID).then((dd) => {
                                        if (dd.result) {
                                            array[index].tag_name = dd.response[0] ? dd.response[0].data.tag_name : '一般會員';
                                            resolve();
                                        } else {
                                            execute();
                                        }
                                    });
                                }),
                                new Promise<void>((resolve) => {
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
                                            array[index].checkout_count = data.response.total as number;
                                            resolve();
                                        } else {
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
        });

        return userData;
    }

    public static deleteUser(json: { id?: string; email?: string; code?: string; app_name?: string }) {
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

    public static getPublicUserData(id: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/userdata?userID=${id}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
            },
        });
    }

    public static forgetPwd(email: string) {
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

    public static forgetPwdCheckCode(email: string, code: string) {
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

    public static resetPwdV2(email: string, code: string, pwd: string) {
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

    public static resetPwd(pwd: string) {
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

    public static resetPwdCheck(oldPwd: string, pwd: string) {
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

    public static updateUserData(json: any) {
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

    public static updateUserDataManager(json: any, userID: string) {
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

    public static login(json: {
        app_name?: string;
        account?: string;
        user_id?:string;
        pwd?: string;
        login_type?: 'fb' | 'normal' | 'line' | 'google' | 'apple' | 'pin';
        google_token?: string;
        fb_token?: string;
        token?: string;
        line_token?: string;
        pin?:string;
        redirect?: string;
    }) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/login`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': json.app_name || getConfig().config.appName,
                Authorization:json.token
            },
            data: JSON.stringify(json),
        });
    }

    public static checkAdminAuth(cg: { app: string; token: string }) {
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

    public static setPublicConfig(cf: { key: string; value: any; user_id?: string; token?: string }) {
        (window as any).glitter.share._public_config = (window as any).glitter.share._public_config ?? {};
        const config = (window as any).glitter.share._public_config;
        config[cf.key + cf.user_id]=undefined;
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

    public static getPublicConfig(key: string, user_id: string, appName: string = getConfig().config.appName) {
        return new Promise<{ result: boolean; response: any }>((resolve, reject) => {
            (window as any).glitter.share._public_config = (window as any).glitter.share._public_config ?? {};
            const config = (window as any).glitter.share._public_config;
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
                        if(!Array.isArray(res.response.value)){
                            res.response.value=[]
                        }
                        break
                }
                if(key.indexOf('alt_')===0){
                    config[key + user_id] = res;
                }
                resolve(res);
            });
        });
    }

    public static getUserGroupList(type?: string, tag?: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/group?type=${type ?? ''}&tag=${tag ?? ''}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
        });
    }

    public static getUserRebate(json: { id?: string; email?: string }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
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

    static permissionFilterString(obj: any): string[] {
        if (!obj) return [];
        let list = [] as string[];
        if (obj) {
            if (obj.status.length > 0) {
                list.push(`status=${obj.status.join(',')}`);
            }
        }
        return list;
    }

    public static getPermission(json: { page: number; limit: number; self?: boolean; queryType?: string; query?: string; orderBy?: string; filter?: any }) {
        return BaseApi.create({
            url:
                getBaseUrl() +
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

    public static setPermission(json: {
        email: string;
        config: {
            name: string;
            title: string;
            phone: string;
            auth: any;
            member_id:any,
            pin:any,
            is_manager?:boolean
        };
        status: number;
    }) {
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

    public static deletePermission(email: string) {
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

    public static togglePermissionStatus(email: string) {
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
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}
