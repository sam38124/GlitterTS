import {HtmlGenerate} from "../glitterBundle/module/Html_generate.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";

export function styleManager(gvc:GVC,viewModel:any,id:string){
    const glitter=gvc.glitter;
    return `
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Style sheet</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link d-none" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link d-none" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Contact</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">${styleList(gvc,viewModel,id)}</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
</div>
                                             `;
}

function styleList(gvc:GVC,viewModel:any,id:string){
    const glitter=gvc.glitter;
    viewModel.initialStyle=viewModel.initialStyle ?? []
    return `${
        gvc.bindView(()=>{
            const id=glitter.getUUID()
            return {
                bind:id,
                view:()=>{
                    return EditorElem.arrayItem({
                        originalArray:viewModel.initialStyle,
                        gvc: gvc,
                        title: '文字區塊內容',
                        array: viewModel.initialStyle.map((dd:any, index:number) => {
                            return {
                                title:`<span style="color:#ffba08;">${dd.name || `區塊:${index}`}</span>`,
                                innerHtml: `
                                                    ${gvc.bindView(() => {
                                    const cid = glitter.getUUID();
                                    return {
                                        bind: cid,
                                        view: () => {
                                            return gvc.map([
                                                HtmlGenerate.editeInput({
                                                    gvc,
                                                    title: '自定義群組名稱',
                                                    default: dd.name,
                                                    placeHolder: '自定義群組名稱',
                                                    callback: (text) => {
                                                        dd.name = text;
                                                        gvc.notifyDataChange(id);
                                                    }
                                                }),
                                                EditorElem.arrayItem({
                                                    originalArray:dd.src.links,
                                                    gvc: gvc,
                                                    title: '群組連結',
                                                    array: dd.src.links.map((d2: any, index: number) => {
                                                        return {
                                                            title: `<span style="color:orange;">${d2.name || `區塊:${index + 1}`}</span>`,
                                                            expand: d2,
                                                            innerHtml: gvc.map([
                                                                glitter.htmlGenerate.editeInput({
                                                                    gvc: gvc,
                                                                    title: `樣式名稱`,
                                                                    default: d2.name,
                                                                    placeHolder: '輸入樣式名稱',
                                                                    callback: (text) => {
                                                                        d2.name = text;
                                                                        gvc.notifyDataChange(cid);
                                                                    },
                                                                }),
                                                                glitter.htmlGenerate.editeInput({
                                                                    gvc: gvc,
                                                                    title: `樣式連結`,
                                                                    default: d2.src,
                                                                    placeHolder: '輸入樣式連結',
                                                                    callback: (text) => {
                                                                        d2.src = text;
                                                                        gvc.notifyDataChange(cid);
                                                                    },
                                                                })
                                                            ]),
                                                            minus: gvc.event(() => {
                                                                dd.src.links.splice(index, 1);
                                                                gvc.notifyDataChange(cid);
                                                            }),
                                                        };
                                                    }),
                                                    expand: dd,
                                                    plus: {
                                                        title: '添加連結',
                                                        event: gvc.event(() => {
                                                            dd.src.links.push({src: '',name:''});
                                                            gvc.notifyDataChange(cid);
                                                        }),
                                                    },
                                                    refreshComponent:()=>{
                                                        gvc.notifyDataChange(cid);
                                                    }
                                                })
                                            ]);
                                        },
                                        divCreate: {
                                            class: `w-100`,
                                            style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                                        }
                                    };
                                })}
                                                    `,
                                expand:dd,
                                minus:gvc.event(()=>{
                                    viewModel.initialStyle.splice(index, 1);
                                    gvc.notifyDataChange(id);
                                })
                            }
                        }),
                        expand: undefined,
                        plus: {
                            title: '添加樣式群組',
                            event: gvc.event(() => {
                                viewModel.initialStyle.push({
                                    name: '樣式群組',
                                    src: {
                                        links:[],
                                        open: true
                                    }
                                });
                                gvc.notifyDataChange(id);
                            }),
                        },
                        refreshComponent:()=>{
                            gvc.notifyDataChange(id);
                        }
                    })
                },
                divCreate:{}
            }
        })
    }
      <button class="btn btn-warning w-100 mt-4" style="flex: 1;height: 50px;color:black;" onclick="${gvc.event(() => {
        glitter.closeDiaLog()
        glitter.htmlGenerate.saveEvent()
    })}">儲存</button>
                                             `;
}