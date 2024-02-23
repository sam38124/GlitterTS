var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { PageEditor } from "../editor/page-editor.js";
export class DialogInterface {
    static globalResource(gvc) {
        gvc.glitter.closeDiaLog('globalResource');
        EditorElem.openEditorDialog(gvc, (gvc) => {
            return gvc.bindView(() => {
                return {
                    bind: gvc.glitter.getUUID(),
                    view: () => {
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            const data = yield PageEditor.valueRender(gvc);
                            resolve(`
                                                                <div class="d-flex" style="height:600px;">
                          <div class="border-end" style="width:300px;overflow:hidden;"> ${data.left}</div>
                                                                ${data.right}                                       
</div>
                                                              
                                                                `);
                        }));
                    }
                };
            });
        }, () => {
        }, 700, '共用資源管理', 'globalResource');
    }
}
