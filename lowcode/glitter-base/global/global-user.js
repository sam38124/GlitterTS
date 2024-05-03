export class GlobalUser {
    static getTag(tag) {
        if (window.glitter.getUrlParameter('type') === 'editor') {
            return `${window.glitterBase}${GlobalUser.tagId}${tag}`;
        }
        else {
            return `${window.appName}${GlobalUser.tagId}${tag}`;
        }
    }
    static get saas_token() {
        return window.glitter.getCookieByName(`${window.glitterBase}${GlobalUser.tagId}token`);
    }
    static get token() {
        return window.glitter.getCookieByName(GlobalUser.getTag('token'));
    }
    static set token(value) {
        window.glitter.setCookie(GlobalUser.getTag('token'), value);
    }
    static get language() {
        return window.glitter.getCookieByName(GlobalUser.getTag('language'));
    }
    static set language(value) {
        window.glitter.setCookie(GlobalUser.getTag('language'), value);
    }
}
GlobalUser.tagId = 'sjnsannsai23ij3as';
GlobalUser.userInfo = undefined;
GlobalUser.updateUserData = {};
