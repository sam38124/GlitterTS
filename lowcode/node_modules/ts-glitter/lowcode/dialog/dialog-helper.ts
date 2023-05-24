export class DialogHelper {
    public static dataLoading(obj: { text?: string; visible: boolean }) {
        const glitter=(window as any).glitter
        glitter.runJsInterFace("dataLoading",{
            show:obj.visible,
            text:(obj.text&&obj.text!=='') ? obj.text:undefined
        },()=>{

        },{
            webFunction(data: any, callback: (data: any) => void): any {
                if (obj.visible) {
                    glitter.openDiaLog(new URL('./dialog.js',import.meta.url), 'dataLoading', {type: 'dataLoading', obj: obj})
                } else {
                    glitter.closeDiaLog('dataLoading')
                }
            }
        })

    }
}