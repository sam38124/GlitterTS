import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {GVC} from "../glitterBundle/GVController.js";
import {PageEditor} from "../editor/page-editor.js";

export class DialogInterface {
    //共用資源管理
    public static globalResource(gvc: GVC) {
        gvc.glitter.closeDiaLog('globalResource')
        EditorElem.openEditorDialog(gvc, (gvc: GVC) => {
            return gvc.bindView(() => {
                return {
                    bind: gvc.glitter.getUUID(),
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            const data = await PageEditor.valueRender(gvc)
                            resolve(`
                                                                <div class="d-flex" style="height:600px;">
                          <div class="border-end" style="width:300px;overflow:hidden;"> ${data.left}</div>
                                                                ${data.right}                                       
</div>
                                                              
                                                                `)
                        })
                    }
                }
            })
        }, () => {
        }, 700, '共用資源管理','globalResource')
    }
}