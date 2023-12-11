import {GVC} from '../GVController.js';
import {HtmlJson} from '../module/html-generate.js';
const glitter=(window as any).glitter
glitter.htmlGenerate.share.styleEditor = {
    render: (obj:{tag:string,widget:HtmlJson,gvc:GVC,title:string,def:string}) => {
        return   glitter.htmlGenerate.editeText({
            gvc: obj.gvc,
            title: '',
            default: obj.widget.css.style[obj.tag] || obj.def,
            placeHolder: `輸入設計樣式`,
            callback: (text: string) => {
                obj.widget.css.style[obj.tag]=text
                obj.widget!!.refreshComponent!()
            }
        })
    }
};

function styleValue(obj: { widget: HtmlJson, tag: string, gvc: GVC }) {
    obj.widget.css.style[obj.tag] = obj.widget.css.style[obj.tag] ?? [];
    return ;
}

