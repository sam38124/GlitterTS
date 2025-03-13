export class ShareDialog {
    constructor(glitter) {
        this.glitter = glitter;
        if (glitter.getUrlParameter('cms') === 'true' || glitter.getUrlParameter('type') === 'htmlEditor') {
            this.glitter = window.parent.glitter;
        }
        this.dataLoading = (obj) => {
            if (obj.visible) {
                this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'dataLoading', {
                    type: 'dataLoading',
                    obj,
                });
            }
            else {
                this.glitter.closeDiaLog('dataLoading');
            }
        };
        this.infoMessage = (obj) => {
            this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'infoMessage', {
                type: 'infoMessage',
                obj,
            });
        };
        this.errorMessage = (obj) => {
            this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', obj.tag || 'errorMessage', {
                type: 'errorMessage',
                obj,
            });
        };
        this.successMessage = (obj) => {
            this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'successMessage', {
                type: 'successMessage',
                obj,
            });
        };
        this.warningMessage = (obj) => {
            this.openConfirmDialog('warningMessage', obj);
        };
        this.checkYesOrNot = (obj) => {
            this.openConfirmDialog('checkYesOrNot', obj);
        };
        this.customCheck = (obj) => {
            this.openConfirmDialog('input_text', obj);
        };
    }
    openConfirmDialog(type, obj) {
        this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', type, {
            type,
            title: obj.text,
            icon: obj.icon,
            yesString: obj.yesString,
            notString: obj.notString,
            callback: (response) => {
                this.glitter.closeDiaLog(type);
                obj.callback(response);
            },
        });
    }
}
