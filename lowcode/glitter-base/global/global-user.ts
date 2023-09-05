export class GlobalUser {
    public static tagId = "sjnsannsai23ij3as"

    public static getTag(tag: string) {
        return `${GlobalUser.tagId}${tag}`
    }

    public static get token() {
        return (window as any).glitter.getCookieByName(GlobalUser.getTag('token'))
    }

    public static set token(value) {
        (window as any).glitter.setCookie(GlobalUser.getTag('token'), value)
    }

    public static userInfo: any = {}

    public static updateUserData: any = {}
}