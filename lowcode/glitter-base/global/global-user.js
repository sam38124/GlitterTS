import { ApiUser } from '../route/user.js';
export class GlobalUser {
    static getWindow() {
        if (window.glitter.getUrlParameter('cms') === 'true') {
            return window.parent;
        }
        else {
            return window;
        }
    }
    static getTag(tag) {
        if (window.glitter.getUrlParameter('type') === 'editor') {
            return `${GlobalUser.getWindow().glitterBase}${GlobalUser.tagId}${tag}`;
        }
        else {
            return `${GlobalUser.getWindow().appName}${GlobalUser.tagId}${tag}`;
        }
    }
    static get saas_token() {
        return GlobalUser.getWindow().glitter.getCookieByName(`${GlobalUser.getWindow().glitterBase}${GlobalUser.tagId}token`);
    }
    static set saas_token(value) {
        GlobalUser.getWindow().glitter.setCookie(`${GlobalUser.getWindow().glitterBase}${GlobalUser.tagId}token`, value);
    }
    static get token() {
        return GlobalUser.getWindow().glitter.getCookieByName(GlobalUser.getTag('token'));
    }
    static get userToken() {
        return GlobalUser.getWindow().glitter.getCookieByName(GlobalUser.getTag('token'));
    }
    static set token(value) {
        GlobalUser.getWindow().glitter.setCookie(GlobalUser.getTag('token'), value);
        if (value) {
            GlobalUser.registerFCM(value);
        }
        else {
            GlobalUser.unregisterFCM();
        }
    }
    static registerFCM(value) {
        if (value) {
            try {
                window.glitter.runJsInterFace('getFireBaseToken', {}, (response) => {
                    if (response.token) {
                        ApiUser.registerFCM(GlobalUser.parseJWT(value).payload.userID, response.token);
                    }
                }, {
                    webFunction(data, callback) {
                        callback({});
                    },
                });
            }
            catch (e) { }
        }
    }
    static unregisterFCM() {
        try {
            window.glitter.runJsInterFace('deleteFireBaseToken', {}, (response) => {
            }, {
                webFunction(data, callback) {
                    callback({});
                },
            });
        }
        catch (e) { }
    }
    static get language() {
        return GlobalUser.getWindow().glitter.getCookieByName(GlobalUser.getTag('language'));
    }
    static set language(value) {
        GlobalUser.getWindow().glitter.setCookie(GlobalUser.getTag('language'), value);
    }
    static get loginRedirect() {
        return localStorage.getItem('loginRedirect');
    }
    static set loginRedirect(value) {
        if (value) {
            localStorage.setItem('loginRedirect', value);
        }
        else {
            localStorage.removeItem('loginRedirect');
        }
    }
    static parseJWT(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        const header = base64UrlDecode(parts[0]);
        const payload = base64UrlDecode(parts[1]);
        const signature = parts[2];
        return { header, payload, signature };
    }
    static getPlan() {
        var _a;
        const config = window.parent.glitter.share.editorViewModel.app_config_original;
        const planMapping = this.planMapping();
        return (_a = planMapping[config.plan]) !== null && _a !== void 0 ? _a : planMapping['app-year'];
    }
}
GlobalUser.tagId = 'sjnsannsai23ij3as';
GlobalUser.userInfo = undefined;
GlobalUser.updateUserData = {};
GlobalUser.planMapping = () => {
    return {
        'light-year': {
            id: 0,
            title: '「 輕便電商方案 」',
        },
        'basic-year': {
            id: 1,
            title: '「 標準電商方案 」',
        },
        'omo-year': {
            id: 2,
            title: '「 企業電商方案 」',
        },
        'app-year': {
            id: 3,
            title: '「 旗艦電商方案 」',
        },
    };
};
function base64UrlDecode(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
