import {GVC} from '../GVController.js';
import {HtmlJson} from '../module/Html_generate.js';
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

// function selectWithValue(all: { key: string, title: string, value: string } [], data: { key: string, value: string } [], obj: { widget: HtmlJson, tag: string, gvc: GVC }) {
//     return data.map((d1) => {
//         return `<div class="d-flex w-100 align-items-center">
// <select class="form-control form-select" onchange="${obj.gvc.event((e) => {
//             d1.key = e.value;
//             obj.widget!!.refreshComponent();
//         })}">
// ${all.map((d2) => {
//             return `<option value="${d2.key}" ${(d1.key === d2.key) ? `selected` : ``}>${d2.title}</option>`;
//         })}
// </select>
// <input class="flex-fill form-control" value="${d1.value}" onchange="${obj.gvc.event((e) => {
//             d1.value = e.value;
//             obj.widget!!.refreshComponent();
//         })}">
// </div>`;
//     }).join('');
// }

// glitter.htmlGenerate.editeInput({
//     gvc: obj.gvc,
//     title: 'string',
//     default: 'string',
//     placeHolder: 'string',
//     callback: (text: string) => {
//     }
// })