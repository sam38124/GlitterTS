import {GVC} from "../glitterBundle/GVController.js";

export class Dialog{
    public dataLoading: (show: Boolean,text?:String) => void;
    public confirm: (title:string,callback: (result: Boolean) => void) => void;
    public showInfo: (title: string) => void;
    constructor(gvc?:GVC) {
        const glitter=(window as any).glitter
        //loading view
        this.dataLoading=(show:Boolean,text?:String)=>{
            switch (glitter.deviceType){
                case glitter.deviceTypeEnum.Web:
                    if(show){
                        glitter.openDiaLog(new URL('./dialog.js',import.meta.url).href, 'dataLoading', {type:'dataLoading',obj: {
                            text:text
                            }})
                    }else{
                        glitter.closeDiaLog()

                    }
                    break
                default:
                    glitter.runJsInterFace("dataLoading",{show:show,text:text},(response:any)=>{})
                    break
            }
        }
        //Confirm view
        this.confirm=(title:string,callback:(result:Boolean)=>void)=>{
            glitter.runJsInterFace("confirm",{
                title:title
            },(response:any)=>{
               callback(response.result)
            },{
                webFunction(data: {}, callback: (data: any) => void): any {
                    return {
                        result:confirm(title)
                    }
                }
            })
        }
        //Info Alert
        this.showInfo=(title:string)=>{
            glitter.runJsInterFace("showInfo",{
                title:title
            },(response:any)=>{
            },{
                webFunction(data: {}, callback: (data: any) => void): any {
                    return confirm(title)
                }
            })
        }
        //Success alert
        // this.success=()=>{
        //
        // }
    }
}
