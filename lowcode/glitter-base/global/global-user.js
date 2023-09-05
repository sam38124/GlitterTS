export class GlobalUser {
    static getTag(tag) {
        return `${GlobalUser.tagId}${tag}`;
    }
    static get token() {
        return window.glitter.getCookieByName(GlobalUser.getTag('token'));
    }
    static set token(value) {
        window.glitter.setCookie(GlobalUser.getTag('token'), value);
    }
}
GlobalUser.tagId = "sjnsannsai23ij3as";
GlobalUser.userInfo = {};
GlobalUser.updateUserData = {};
