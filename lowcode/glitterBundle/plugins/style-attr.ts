import {GVC} from "../GVController.js";
import {EditorElem} from "./editor-elem.js";

export const styleAttr: { tag: string, title: string, innerHtml: (gvc: GVC, data: { [name: string]: string }) => string }[] = [
    {
        tag: "margin", title: "間距", innerHtml: (gvc, data) => {
            const glitter = (window as any).glitter;
            return `
            <div class="alert alert-dark mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>
            ${ ['margin-left', 'margin-right', 'margin-top', 'margin-bottom'].map((dd, index) => {
                const k = ["左", "右", "上", "下"][index]
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側間距`,
                    default: data[dd] ?? "",
                    placeHolder: `輸入${k}側間距`,
                    callback: (text:string) => {
                        data[dd] = text
                    }
                })
            }).join('')}`
        }
    },
    {
        tag:"font-size",title:"字體大小",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["font-size"]= data["font-size"]??"14px"
            return ` <div class="alert alert-dark mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體大小`,
                default:data["font-size"] ,
                placeHolder: `輸入字體大小`,
                callback: (text:string) => {
                    data["font-size"] = text
                }
            })
        }
    },
    {
        tag:"background-image",title:"背景圖片",innerHtml: (gvc, data) =>{
            data["background-image"]= data["background-image"]??""
            data["background-repeat"]=data["background-repeat"]??"repeat"
            return  gvc.bindView(()=>{
                const id=gvc.glitter.getUUID()
                return {
                    bind:id,
                    view:()=>{
                        return gvc.map([EditorElem.uploadImage({
                            gvc: gvc,
                            title: `背景圖`,
                            def: data["background-image"],
                            callback: (dd:any) => {
                                if(dd.indexOf(`url('`)===-1){
                                    data["background-image"] = `url('${dd}')`;
                                }
                                gvc.notifyDataChange(id)
                            },
                        }),EditorElem.select({
                            title: '是否重複繪圖',
                            gvc: gvc,
                            def: data["background-repeat"],
                            callback: (text: string) => {
                                data["background-repeat"]=text
                            },
                            array: [{title:"是",value:"repeat"},{title:"否",value:"no-repeat"}],
                        })])
                    },
                    divCreate:{}
                }
            })
        }
    }
]