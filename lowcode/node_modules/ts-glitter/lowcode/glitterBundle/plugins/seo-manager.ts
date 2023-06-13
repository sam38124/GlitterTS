import {HtmlJson, Plugin} from "./plugin-creater.js";
import {Glitter} from "../Glitter.js";
import {GVC} from "../GVController.js";
import {EditorElem} from "./editor-elem.js";

export const seoManager: {
    title: string,
    key: string,
    callback: (text: string) => string,
    editor: (d: {
        def: string, callback: (value: string) => void,
        gvc: any
    }) => string
}[] = [
    {
        title: "網頁標題", key: "title", callback: (text) => {
            return `<title>${text}</title>`
        },
        editor: (def) => {
            const glitter = (window as any).glitter
            return glitter.htmlGenerate.editeInput({
                gvc: def.gvc,
                title: "網頁標題",
                default: def.def,
                placeHolder: "請輸入網頁標題",
                callback: (text: string) => {
                    def.callback(text)
                }
            })
        }
    }
]