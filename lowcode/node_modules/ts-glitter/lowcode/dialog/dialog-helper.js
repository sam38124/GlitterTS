export class DialogHelper {
    static dataLoading(obj) {
        const glitter = window.glitter;
        glitter.runJsInterFace("dataLoading", {
            show: obj.visible,
            text: (obj.text && obj.text !== '') ? obj.text : undefined
        }, () => {
        }, {
            webFunction(data, callback) {
                if (obj.visible) {
                    glitter.openDiaLog(new URL('./dialog.js', import.meta.url), 'dataLoading', { type: 'dataLoading', obj: obj });
                }
                else {
                    glitter.closeDiaLog('dataLoading');
                }
            }
        });
    }
}
