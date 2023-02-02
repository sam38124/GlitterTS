import {init} from '../../glitterBundle/GVController.js';
import {Editor} from './editor.js';
import {Items} from '../page-config.js';
import {Galary} from '../../view/galary.js';

init((gvc, glitter, gBundle) => {
    let loading = true
    const setting = gBundle.setting;
    const doc = new Editor(gvc,setting);
    const htmlGenerate=new glitter.htmlGenerate(setting);
    (window as any).editerData=htmlGenerate;
    return {
        onCreateView: () => {

            const data = []
            return doc.create(
                '',
                gvc.bindView(()=>{
                    let mode=glitter.getCookieByName("EditMode") ?? 'gui'
                    return {
                        bind:`htmlGenerate`,
                        view:()=>{
                            const json=JSON.parse(JSON.stringify(setting))
                            json.map((dd:any)=>{
                                dd.refreshAllParameter=undefined
                                dd.refreshComponentParameter=undefined
                            })
                            glitter.setCookie("EditMode",mode)
                            return `<div class="w-100 d-flex border-bottom pb-2 mb-2 align-items-center justify-content-center">
                        <h3 class="m-0" style="font-size: 16px;">編輯視窗</h3>
                       <div class="flex-fill"></div>
                       ${(mode === 'gui') ? `
                        <div style="cursor: pointer;" class="border p-1 rounded" onclick="${gvc.event(()=>{
                                mode='code'
                                gvc.notifyDataChange('htmlGenerate')
                            })}"> <span class="text-white fw-bold">GUI</span>
                       <i class="fa-solid fa-arrows-repeat ms-2 text-white"></i></div>`:`<div style="cursor: pointer;" class="border p-1 rounded" onclick="${gvc.event(()=>{
                                mode='gui'
                                gvc.notifyDataChange('htmlGenerate')
                            })}">
                         <span class="text-white fw-bold">Code</span>
                       <i class="fa-solid fa-arrows-repeat ms-2 text-white"></i>
</div>`}            
</div>
                        ${(mode === 'gui') ? htmlGenerate.editor(gvc):`
                        <textArea class="form-control " style="overflow-x: scroll;height: calc(100vh - 200px);" onchange="${gvc.event((e)=>{
                            })}">${JSON.stringify(json,null, "\t")}</textArea>
                        <button class="btn btn-primary  w-100 mt-2" onclick="${gvc.event(()=>{
                                navigator.clipboard.writeText(JSON.stringify(json,null, "\t"))
                            })}">複製到剪貼簿</button>
                        `}
`
                        },
                        divCreate:{}
                    }
                })
            );
        },
        onCreate: () => {
        },
    };
})
