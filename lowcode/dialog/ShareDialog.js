export class ShareDialog {
    constructor(glitter) {
        this.dataLoading = (obj) => {
        };
        this.errorMessage = (obj) => {
        };
        this.successMessage = (obj) => {
        };
        this.dataLoading = (obj) => {
            if (obj.visible) {
                glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'dataLoading', { type: 'dataLoading', obj: obj });
            }
            else {
                glitter.closeDiaLog('dataLoading');
            }
        };
        this.errorMessage = (obj) => {
            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'errorMessage', { type: 'errorMessage', obj: obj });
        };
        this.successMessage = (obj) => {
            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'successMessage', { type: 'successMessage', obj: obj });
        };
        this.policy = () => {
            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'policy', { type: 'policy' });
        };
        this.checkYesOrNot = (obj) => {
            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'checkYesOrNot', {
                type: 'checkYesOrNot', callback: (response) => {
                    glitter.closeDiaLog('checkYesOrNot');
                    obj.callback(response);
                }, title: obj.text
            });
        };
    }
}
