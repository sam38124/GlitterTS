import {GVC} from "../glitterBundle/GVController.js";

export class ViewWidget{
    public static dialogSaveRaw(gvc:GVC,close:()=>void,save:()=>void){
        return `<div class="d-flex align-items-center justify-content-end border-top p-3" style="gap:10px;">
<div class="btn-sm btn-secondary fw-500" style="cursor:pointer;" onclick="${gvc.event(()=>{close()})}">取消</div>
<div class="btn-sm fw-500" style=" background: #295ed1;color:white;cursor:pointer;" onclick="${gvc.event(()=>{save()})}">儲存</div>
</div>`
    }
}