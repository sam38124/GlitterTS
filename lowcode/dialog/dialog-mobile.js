export class Dialog {
    constructor(gvc) {
        const glitter = window.glitter;
        this.dataLoading = (show, text) => {
            switch (glitter.deviceType) {
                case glitter.deviceTypeEnum.Web:
                    if (show) {
                        glitter.openDiaLog(new URL('./dialog.js', import.meta.url).href, 'dataLoading', { type: 'dataLoading', obj: {
                                text: text
                            } });
                    }
                    else {
                        glitter.closeDiaLog();
                    }
                    break;
                default:
                    glitter.runJsInterFace("dataLoading", { show: show, text: text }, (response) => { });
                    break;
            }
        };
        this.confirm = (title, callback) => {
            glitter.runJsInterFace("confirm", {
                title: title
            }, (response) => {
                callback(response.result);
            }, {
                webFunction(data, callback) {
                    return {
                        result: confirm(title)
                    };
                }
            });
        };
        this.showInfo = (title) => {
            glitter.runJsInterFace("showInfo", {
                title: title
            }, (response) => {
            }, {
                webFunction(data, callback) {
                    return confirm(title);
                }
            });
        };
    }
}
