import {GVC} from "../glitterBundle/GVController.js";
const html=String.raw
export class Footer{

    public static main(cf: { gvc: GVC; formData: any; widget: any; key: string; callback: (data: any) => void }){
return [
    {
        title:'首頁',
        icon:'<i class="fa-solid fa-house"></i>',
        event:cf.gvc.event(()=>{
cf.gvc.glitter.href='/index-mobile'+location.search
        }),
        select:()=>{
            return cf.gvc.glitter.getUrlParameter('page')==='index-mobile'
        }
    },
    {
        title:'分類',
        icon:'<i class="fa-duotone fa-solid fa-grid-2"></i>',
        event:cf.gvc.event(()=>{
            cf.gvc.glitter.href='/all-product'+location.search
        }),
        select:()=>{
            return cf.gvc.glitter.getUrlParameter('page')==='all-product'
        }
    },
    {
        title:'購物車',
        icon:'<i class="fa-regular fa-cart-shopping"></i>',
        event:cf.gvc.event(()=>{
            cf.gvc.glitter.href='/checkout'+location.search
        }),
        select:()=>{
            return cf.gvc.glitter.getUrlParameter('page')==='checkout'
        }
    },
    // {
    //     title:'訊息',
    //     icon:'<i class="fa-sharp fa-solid fa-headset"></i>',
    //     event:cf.gvc.event(()=>{}),
    //     select:()=>{
    //
    //     }
    // },
    {
        title:'我的',
        icon:'<i class="fa-regular fa-user"></i>',
        event:cf.gvc.event(()=>{
            cf.gvc.glitter.href='/account_userinfo'+location.search
        }),
        select:()=>{
            return cf.gvc.glitter.getUrlParameter('page')==='account_userinfo'
        }
    }
].map((dd:any)=>{
    const color=(dd.select()) ? cf.widget.formData.select_color:cf.widget.formData.un_select_color
    return html`<div class="d-flex flex-column align-items-center justify-content-center" style="height:63px;gap: 2px;cursor: pointer;" onclick="${dd.event}">
        <div class="d-flex align-items-center justify-content-center fs-5" style="width:25px;height: 25px;color:${color};">${dd.icon}</div>
        <div class="fw-500" style="font-size: 12px; color:${color};" >${dd.title}</div>
    </div>`
}).join('')
    }
}

(window as any).glitter.setModule(import.meta.url, Footer);
