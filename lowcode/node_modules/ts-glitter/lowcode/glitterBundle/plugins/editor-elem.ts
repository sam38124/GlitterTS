export class EditorElem{


    public static h3(title:string){
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${title}</h3>`
    }

    public static plusBtn(title:string,event:any){
        return `<div class="w-100 my-3" style="background: white;height: 1px;"></div>
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded mt-3" style="border: 2px dashed white;" onclick="${
            event
        }">${title}</div>`
    }

    public static toggleExpand(obj:{
        gvc:any,
        title:string,
        data:any,
        innerText:string | (()=>string)
        color?:string
    }){
        const color=obj.color ?? `#4144b0;`
        const glitter=(window as any).glitter
        return `${obj.gvc.bindView(()=>{
            const id=glitter.getUUID()
            return {
                bind:id,
                view:()=>{
                    if(obj.data.expand){
                        return  `<div class="w-100  rounded p-2 "  style="background: ${color}; ">
<div class="w-100 d-flex p-0 align-items-center mb-2" onclick="${
                            obj.gvc.event(() => {
                                obj.data.expand = !obj.data.expand
                                obj.gvc.notifyDataChange(id)
                            })
                        }" data-gs-event-1055="event" style="cursor: pointer;"><h3 style="font-size: 16px;color: lightpink;" class="m-0 p-0">${obj.title}</h3>
<div class="flex-fill"></div>
<div style="cursor: pointer;">收合<i class="fa-solid fa-up ms-2 text-white" ></i></div>
</div>
${
                            (typeof  obj.innerText === 'string') ?  obj.innerText: obj.innerText()
                        }</div>`
                    }else{

                    }
                    return `<div class="w-100  rounded p-2 " style="background-color: ${color};">
<div class="w-100 d-flex p-0 align-items-center" onclick="${
                        obj.gvc.event(()=>{
                            obj.data.expand=!obj.data.expand
                            obj.gvc.notifyDataChange(id)
                        })
                    }" style="cursor: pointer;"><h3 style="font-size: 16px;color: lightpink;" class="m-0 p-0">${obj.title}</h3>
<div class="flex-fill"></div>
<div style="cursor: pointer;">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>
</div>
</div>`
                },
                divCreate:{}
            }
        })}`
    }

    public static minusTitle(title:string,event:string){
        return `<div class="d-flex align-items-center">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${event}"></i>
<h3 style="color: white;font-size: 16px;" class="m-0">${title}</h3>
</div>`
    }
    public static searchInput(obj:{
        title:string,
        gvc:any,
        def:string,array:string[],
        callback: (text:string) => void,
        placeHolder:string
    }){
        const glitter=(window as any).glitter
        const gvc=obj.gvc
        return `
${EditorElem.h3(obj.title)}
<div class="btn-group dropdown w-100">
  ${(() => {
            const id = glitter.getUUID()
            const id2 = glitter.getUUID()

            return `
${obj.gvc.bindView(() => {
                return {
                    bind: id2,
                    view: () => {
                        return `<input class="form-control w-100" style="height: 40px;" placeholder="${obj.placeHolder}" onfocus="${obj.gvc.event(() => {
                            $('#' + obj.gvc.id(id)).addClass(`show`)
                        })}" onblur="${gvc.event(() => {
                            setTimeout(() => {
                                $('#' + gvc.id(id)).removeClass(`show`)
                            }, 300)
                        })}" oninput="${gvc.event((e:any) => {
                            obj.def = e.value
                            gvc.notifyDataChange(id)
                        })}" value="${obj.def}" onchange="${gvc.event((e:any)=>{
                            obj.def = e.value
                            setTimeout(()=>{
                                obj.callback(e.value)
                            },100)

                        })}" >`
                    },
                    divCreate: {class: `w-100`}
                }
            })}
${obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return obj.array.filter((d2) => {
                            return d2.toUpperCase().indexOf(obj.def.toUpperCase()) !== -1
                        }).map((d3) => {
                            return `<button  class="dropdown-item" onclick="${gvc.event(() => {
                                obj.def=d3
                                obj.callback(obj.def)
                                gvc.notifyDataChange(id2)
                            })}">${d3}</button>`
                        }).join('')
                    },
                    divCreate: {
                        class: `dropdown-menu`, style: `transform: translateY(40px);`
                    }
                }
            })}                                 
                                            `
        })()}
</div>       
`
    }
}

