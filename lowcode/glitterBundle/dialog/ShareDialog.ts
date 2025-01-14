import { Glitter } from '../Glitter.js';

export class ShareDialog {
    public dataLoading = (obj: { text?: string; visible: boolean ,BG?:string}) => {};
    public infoMessage = (obj: { text?: string }) => {};
    public errorMessage = (obj: { text?: string,tag?:string,callback?: () => void }) => {};
    public successMessage = (obj: { text?: string }) => {};
    public warningMessage: (obj: { callback: (response: boolean) => void; text: string }) => void;
    public checkYesOrNot: (obj: { callback: (response: boolean) => void; text: string; icon?: string }) => void;
    public policy: () => void;
    public customCheck: (obj: { callback:(response:boolean)=>void, text: string }) => void;
    constructor(glitter: Glitter) {
        if (glitter.getUrlParameter('cms') === 'true' || glitter.getUrlParameter('type')==='htmlEditor') {
            glitter = (window.parent as any).glitter;
        }
        this.dataLoading = (obj: { text?: string; visible: boolean ,BG?:string}) => {
            if (obj.visible) {
              glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'dataLoading', {
                    type: 'dataLoading',
                    obj: obj,
                });
            } else {
                glitter.closeDiaLog('dataLoading');
            }
        };
        this.infoMessage = (obj: { text?: string }) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'infoMessage', {
                type: 'infoMessage',
                obj: obj,
            });
        };
        this.errorMessage = (obj: { text?: string,tag?:string,callback?: () => void }) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', obj.tag || 'errorMessage', {
                type: 'errorMessage',
                obj: obj,
            });
        };
        this.successMessage = (obj: { text?: string }) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'successMessage', {
                type: 'successMessage',
                obj: obj,
            });
        };
        this.warningMessage = (obj: { text: string; callback: (response: boolean) => void }) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'warningMessage', {
                type: 'warningMessage',
                callback: (response: boolean) => {
                    glitter.closeDiaLog('warningMessage');
                    obj.callback(response);
                },
                title: obj.text,
            });
        };
        this.checkYesOrNot = (obj: { icon?: string; text: string; callback: (response: boolean) => void }) => {
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'checkYesOrNot', {
                type: 'checkYesOrNot',
                callback: (response: boolean) => {
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
        this.customCheck = (obj:{text:string,callback:(response:boolean)=>void})=>{
            glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'input_text', {
                type: 'input_text', callback: (response: boolean) => {
                    glitter.closeDiaLog('input_text')
                    obj.callback(response)
                },title:obj.text
            })
        }
    }
}
