export class ShareDialog {
    constructor(glitter) {
        this.dataLoading = (obj) => { };
        this.infoMessage = (obj) => { };
        this.errorMessage = (obj) => { };
        this.successMessage = (obj) => { };
        if (glitter.getUrlParameter('cms') === 'true') {
            glitter = window.parent.glitter;
        }
        this.dataLoading = (obj) => {
            if (obj.visible) {
                glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'dataLoading', {
                    type: 'dataLoading',
                    obj: obj,
                });
            }
            else {
                glitter.closeDiaLog('dataLoading');
            }
        };
        this.infoMessage = (obj) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'infoMessage', {
                type: 'infoMessage',
                obj: obj,
            });
        };
        this.errorMessage = (obj) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'errorMessage', {
                type: 'errorMessage',
                obj: obj,
            });
        };
        this.successMessage = (obj) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'successMessage', {
                type: 'successMessage',
                obj: obj,
            });
        };
        this.warningMessage = (obj) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'warningMessage', {
                type: 'warningMessage',
                callback: (response) => {
                    glitter.closeDiaLog('warningMessage');
                    obj.callback(response);
                },
                title: obj.text,
            });
        };
        this.checkYesOrNot = (obj) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'checkYesOrNot', {
                type: 'checkYesOrNot',
                callback: (response) => {
                    glitter.closeDiaLog('checkYesOrNot');
                    obj.callback(response);
                },
                title: obj.text,
                icon: obj.icon,
            });
        };
        this.policy = () => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'policy', {
                type: 'policy',
            });
        };
    }
}
