import {HtmlJson} from "./plugin-creater.js"
import {GVC} from "../GVController.js";

export class ClickEvent {
    public static create(url: string, event: {
        [name: string]: {
            title: string, fun: (gvc: GVC, widget: HtmlJson,obj:any) => {
                editor: () => string,
                event: () => void
            }
        }
    }) {
        const glitter = (window as any).glitter
        glitter.share.clickEvent = glitter.share.clickEvent ?? {}
        glitter.share.clickEvent[url] = event
    }

    public static trigger(oj:{
        gvc: GVC, widget: HtmlJson,clickEvent:any
    }){
        const event:{src:string,route:string}=oj.clickEvent.clickEvent
        async function run(){
            oj.gvc.glitter.share.clickEvent=oj.gvc.glitter.share.clickEvent ?? {}
            if(!oj.gvc.glitter.share.clickEvent[event.src]){
                await new Promise((resolve, reject)=>{
                    oj.gvc.glitter.addMtScript([
                        {src: `${event.src}`,type:'module'}
                    ],()=>{
                        resolve(true)
                    },()=>{
                        resolve(false)
                    })
                })
            }
            oj.gvc.glitter.share.clickEvent[event.src][event.route].fun(oj.gvc,oj.widget,oj.clickEvent).event()
        }
        run().then()
    }
    public static editer(gvc: GVC, widget: HtmlJson,obj:any,option:{
        hover:boolean,
        option:string[],
        title?:string
    }={hover:false,option:[]}) {
        gvc.glitter.share.clickEvent = gvc.glitter.share.clickEvent ?? {}
        const glitter = gvc.glitter
        const selectID=glitter.getUUID()
        return `<div class="mt-2 ${(option.hover) ? `alert alert-dark`:``}">
 <h3 class="m-0" style="font-size: 16px;">${option.title ?? "點擊事件"}</h3>
 ${
            gvc.bindView(() => {
                return {
                    bind: selectID,
                    view: () => {
                        var select=false
                        return `<select class="form-select m-0 mt-2" onchange="${gvc.event((e) => {
                            if(e.value==='undefined'){
                                obj.clickEvent=undefined
                            }else{
                                obj.clickEvent = JSON.parse(e.value)
                            }
                            widget.refreshAll()
                        })}">
${gvc.map(Object.keys(glitter.share.clickEvent).map((key) => {
                            const value = glitter.share.clickEvent[key]

                            return gvc.map(Object.keys(value).map((v2) => {
                                if(option.option.length>0){
                                    if(option.option.indexOf(v2)===-1){
                                        return  ``
                                    }
                                }
                                const value2 = value[v2]
                                const selected=JSON.stringify({
                                    src: key,
                                    route: v2
                                }) === JSON.stringify(obj.clickEvent)
                                select=selected||select
                                return `<option value='${JSON.stringify({
                                    src: key,
                                    route: v2
                                })}' ${(selected) ? `selected`:``}>${value2.title}</option>`
                            }))
                        }))
                        }
<option value="undefined"  ${(!select) ? `selected`:``}>未定義</option>
</select>
${gvc.bindView(()=>{
                            const id=glitter.getUUID()
                            return {
                                bind:id,
                                view:()=>{
                                    try{
                                        if(!glitter.share.clickEvent[obj.clickEvent.src]){
                                            return  ``
                                        }
                                        return glitter.share.clickEvent[obj.clickEvent.src][obj.clickEvent.route].fun(gvc,widget,obj).editor()
                                    }catch (e){
                                        return ``
                                    }
                                },
                                divCreate:{},
                                onCreate:()=>{
                                    glitter.share.clickEvent=glitter.share.clickEvent ?? {}
                                    try {
                                        console.log(glitter.share.clickEvent[obj.clickEvent.src])
                                        if(!glitter.share.clickEvent[obj.clickEvent.src]){
                                            glitter.addMtScript([
                                                {src:obj.clickEvent.src,type:'module'}
                                            ],()=>{
                                                gvc.notifyDataChange(selectID)
                                            },()=>{
                                                alert(obj.clickEvent.src)
                                            })
                                        }
                                    }catch (e){}

                                }
                            }
                        })}
`
                    },
                    divCreate: {}
                }
            })
        }
</div> `
    }
}
