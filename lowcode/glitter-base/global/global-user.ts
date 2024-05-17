export class GlobalUser {
    public static tagId = 'sjnsannsai23ij3as';

    public static getWindow():any{
        if((window as any).glitter.getUrlParameter('cms') === 'true'){
            return window.parent
        }else{
            return  window
        }
    }
    public static getTag(tag: string) {
        if ((window as any).glitter.getUrlParameter('type') === 'editor') {
            return `${GlobalUser.getWindow().glitterBase}${GlobalUser.tagId}${tag}`;
        } else {
            return `${GlobalUser.getWindow().appName}${GlobalUser.tagId}${tag}`;
        }
    }
    public static get saas_token() {
        return GlobalUser.getWindow().glitter.getCookieByName(`${GlobalUser.getWindow().glitterBase}${GlobalUser.tagId}token`);
    }
    public static set saas_token(value){
         GlobalUser.getWindow().glitter.setCookie(`${GlobalUser.getWindow().glitterBase}${GlobalUser.tagId}token`,value);
    }
    public static get token() {
        return GlobalUser.getWindow().glitter.getCookieByName(GlobalUser.getTag('token'));
    }

    public static get userToken() {
        return GlobalUser.getWindow().glitter.getCookieByName(GlobalUser.getTag('token'));
    }


    public static set token(value) {
        GlobalUser.getWindow().glitter.setCookie(GlobalUser.getTag('token'), value);
    }
    //@ts-ignore
    public static get language() {
        return GlobalUser.getWindow().glitter.getCookieByName(GlobalUser.getTag('language'));
    }

    public static set language(value) {
        GlobalUser.getWindow().glitter.setCookie(GlobalUser.getTag('language'), value);
    }

    public static userInfo: any = undefined;

    public static updateUserData: any = {};
}
