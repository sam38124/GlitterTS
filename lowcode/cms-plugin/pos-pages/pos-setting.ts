import {GVC} from "../../glitterBundle/GVController.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";

export class PosSetting{
    public static main(obj:{
        gvc:GVC,
        vm:any
    }){
        const gvc=obj.gvc
        return gvc.bindView(()=>{
            const vm={
                id:gvc.glitter.getUUID()
            }
            return {
                bind:vm.id,
                view:()=>{
                    return BgWidget.mainCard([
                        {
                            title:'員工列表',
                            event:()=>{}
                        },
                        {
                            title:'付款方式',
                            event:()=>{}
                        },
                        {
                            title:'列印商品條碼',
                            event:()=>{}
                        },
                        {
                            title:'庫存管理',
                            event:()=>{}
                        },
                        {
                            title:'折扣管理',
                            event:()=>{}
                        }
                    ].map((value, index, array)=>{
                        return `<div class="d-flex justify-content-between hoverBtn" style="width:100% height: 39px; padding: 6px 12px; border-radius: 10px; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex;
cursor: pointer;" onclick="${gvc.event(()=>{
                            value.event()
                        })}">
  <div style="flex: 1 1 0; color: #393939; font-size: 20px;  font-weight: 700; text-transform: uppercase; letter-spacing: 2px; word-wrap: break-word">${value.title}</div>
  <i class="fa-solid fa-angle-right"></i>
</div>`
                    }).join(''))
                },
            divCreate:{
                    class:`mx-auto`,style:`margin-top:42px;width:1000px;max-width:calc(100% - 20px);`
            }
            }
        })
    }
}