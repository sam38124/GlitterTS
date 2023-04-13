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
    }
]