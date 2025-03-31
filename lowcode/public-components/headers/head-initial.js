export class HeadInitial {
    static initial(cf) {
        const gvc = cf.gvc;
        if (gvc.glitter.share.is_application) {
            return cf.mobile();
        }
        else {
            return cf.browser();
        }
    }
}
