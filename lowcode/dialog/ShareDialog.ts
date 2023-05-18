import {GVC} from "../glitterBundle/GVController.js";
import {Glitter} from "../glitterBundle/Glitter.js";

export class ShareDialog {
    public dataLoading = (obj: { text?: string; visible: boolean }) => {

    };
    public errorMessage = (obj: { text?: string }) => {
    };
    public successMessage = (obj: { text?: string }) => {
    };
    public checkYesOrNot: (obj: { callback:(response:boolean)=>void, text: string }) => void;
    public policy: () => void;

    constructor(glitter: Glitter) {
        this.dataLoading = (obj: { text?: string; visible: boolean }) => {
            if(obj.visible){
                glitter.openDiaLog('dialog/dialog.js', 'dataLoading', {type:'dataLoading',obj:obj})
            }else{
                glitter.closeDiaLog('dataLoading')
            }
        };
        this.errorMessage = (obj: { text?: string; }) => {
            glitter.openDiaLog('dialog/dialog.js', 'errorMessage', {type:'errorMessage',obj:obj})
        };
        this.successMessage = (obj: { text?: string; }) => {
            glitter.openDiaLog('dialog/dialog.js', 'successMessage', {type:'successMessage',obj:obj})
        };
        this.policy = () => {
            glitter.openDiaLog('dialog/dialog.js', 'policy', {type:'policy'})
        };

        this.checkYesOrNot = (obj:{text:string,callback:(response:boolean)=>void})=>{
            glitter.openDiaLog('dialog/Dialog.js', 'checkYesOrNot', {
                type: 'checkYesOrNot', callback: (response: boolean) => {
                    glitter.closeDiaLog('checkYesOrNot')
                    obj.callback(response)
                },title:obj.text
            })
        }

    }
}