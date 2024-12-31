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
    }
    static get language() {
        return GlobalUser.getWindow().glitter.getCookieByName(GlobalUser.getTag('language'));
    }
    static set language(value) {
        GlobalUser.getWindow().glitter.setCookie(GlobalUser.getTag('language'), value);
    }
    static parseJWT(token) {
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
        }
        const header = base64UrlDecode(parts[0]);
        const payload = base64UrlDecode(parts[1]);
        const signature = parts[2];
        return {
            header,
            payload,
            signature
        };
    }
}
GlobalUser.tagId = 'sjnsannsai23ij3as';
GlobalUser.userInfo = undefined;
GlobalUser.updateUserData = {};
function base64UrlDecode(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
