export class GlobalUser {
    public static tagId = "sjnsannsai23ij3as"

    public static getTag(tag: string) {
        if((window as any).glitter.getUrlParameter("type") === 'editor'){
            return `${(window as any).glitterBase}${GlobalUser.tagId}${tag}`
        }else{
            return `${(window as any).appName}${GlobalUser.tagId}${tag}`
        }
    }
    public static get saas_token(){
        return  (window as any).glitter.getCookieByName(`${(window as any).glitterBase}${GlobalUser.tagId}token`)
    }
    public static get token() {
        return (window as any).glitter.getCookieByName(GlobalUser.getTag('token'))
    }

    public static set token(value) {
        (window as any).glitter.setCookie(GlobalUser.getTag('token'), value)
    }
    //@ts-ignore
    public static get language() {
        return (window as any).glitter.getCookieByName(GlobalUser.getTag('language'))
    }

    public static set language(value) {
        (window as any).glitter.setCookie(GlobalUser.getTag('language'), value)
    }

    public static userInfo: any = undefined

    public static updateUserData: any = {}
}