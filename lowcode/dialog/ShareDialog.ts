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
                glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'dataLoading', {type:'dataLoading',obj:obj})
            }else{
                glitter.closeDiaLog('dataLoading')
            }
        };
        this.errorMessage = (obj: { text?: string; }) => {

            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'errorMessage', {type:'errorMessage',obj:obj})
        };
        this.successMessage = (obj: { text?: string; }) => {
            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'successMessage', {type:'successMessage',obj:obj})
        };
        this.policy = () => {
            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'policy', {type:'policy'})
        };

        this.checkYesOrNot = (obj:{text:string,callback:(response:boolean)=>void})=>{
            glitter.openDiaLog(new URL('../dialog/dialog.js', import.meta.url).href, 'checkYesOrNot', {
                type: 'checkYesOrNot', callback: (response: boolean) => {
                    glitter.closeDiaLog('checkYesOrNot')
                    obj.callback(response)
                },title:obj.text
            })
        }

    }
}