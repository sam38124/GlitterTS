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

    public static registerFCM(userID: string, deviceToken: string) {
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

    public static getSubScribe(json: { limit: number; page: number; search?: string; id?: string }) {
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
        if (obj.created_time.length > 1 && obj.created_time[0].length > 0 && obj.created_time[1].length > 0) {
            list.push(`created_time=${obj.created_time[0]},${obj.created_time[1]}`);
        }
        if (obj.birth.length > 0) {
            list.push(`birth=${obj.birth.join(',')}`);
        }
        if (obj.rank.length > 0) {
            list.push(`rank=${obj.rank.join(',')}`);
        }
        if (obj.rebate.key && obj.rebate.value) {
            list.push(`rebate=${obj.rebate.key},${obj.rebate.value}`);
        }
        if (obj.total_amount.key && obj.total_amount.value) {
            list.push(`total_amount=${obj.total_amount.key},${obj.total_amount.value}`);
        }
        return list;
    }

    public static getUserListOrders(json: { limit: number; page: number; search?: string; id?: string; searchType?: string; orderString?: string; filter?: any; status?: number; group?: string }) {
        const filterString = this.userListFilterString(json.filter);
        const userData = BaseApi.create({
            url:
                getBaseUrl() +
                `/api-public/v1/user?${(() => {
                    let par = [`type=list`, `limit=${json.limit}`, `page=${json.page}`];
                    json.search && par.push(`search=${json.search}`);
                    json.id && par.push(`id=${json.id}`);
                    json.searchType && par.push(`searchType=${json.searchType}`);
                    json.orderString && par.push(`order_string=${json.orderString}`);
                    json.group && par.push(`group=${json.group}`);
                    filterString.length > 0 && par.push(filterString.join('&'));
                    return par.join('&');
                })()}`,
            type: 'GET',
            headers: {
                'g-app': getConfig().config.appName,
                'Content-Type': 'application/json',
                Authorization: getConfig().config.token,
            },
        }).then(async (data) => {
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
                                    ApiUser.getPublicUserData(array[index].userID).then((dd) => {
                                        if (dd.result) {
                                            array[index].tag_name =
                                                (
                                                    dd.response.member.find((dd: any) => {
                                                        return dd.trigger;
                                                    }) || {}
                                                ).tag_name || '一般會員';
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
                },
            };
        });

        return userData;
    }

    public static deleteUser(json: { id: string }) {
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

    public static login(json: { account?: string; pwd?: string; login_type?: 'fb' | 'normal' | 'line' | 'google'; google_token?: string; fb_token?: string; line_token?: string; redirect?: string }) {
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

    public static setPublicConfig(cf: { key: string; value: any; user_id?: string; token?: string }) {
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

    public static getPublicConfig(key: string, user_id: string) {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/public/config?key=${key}&user_id=${user_id}`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
            },
        });
    }

    public static getUserGroupList() {
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/user/group`,
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'g-app': getConfig().config.appName,
                Authorization: getConfig().config.token,
            },
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
