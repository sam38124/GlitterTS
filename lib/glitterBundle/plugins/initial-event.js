export class InitialEvent {
    static execute(url, fun) {
        fun(() => {
            const glitter = window.glitter;
            const ur = new URL(url);
            glitter.share.callBackList[ur.searchParams.get("callback")]();
        });
    }
}
