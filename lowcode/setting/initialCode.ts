import {HtmlGenerate} from "../glitterBundle/module/Html_generate.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";

export function initialCode(gvc:GVC,viewModel:any,id:string){
    const glitter=gvc.glitter;
    viewModel.initialList=viewModel.initialList??[]
  return `
<div class="alert alert-warning " style="white-space: normal;word-break:break-all;">初始化代碼會在頁面載入之前執行，通常處理一些基本配置行為，例如設定後端API路徑...等。這些初始化代碼會按照順序執行。</div>
                        ${
      gvc.bindView(()=>{
          const id=glitter.getUUID()
          return {
              bind:id,
              view:()=>{
                  return EditorElem.arrayItem({
                      originalArray:viewModel.initialList,
                      gvc: gvc,
                      title: '文字區塊內容',
                      array: viewModel.initialList.map((dd:any, index:number) => {
                          return {
                              title:`<span style="color:black;">${dd.name || `區塊:${index}`}</span>`,
                              innerHtml: `
                                                    ${gvc.bindView(() => {
                                  const cid = glitter.getUUID();
                                  return {
                                      bind: cid,
                                      view: () => {
                                          return `  
                                          ${
                                              EditorElem.select({
                                                  title: '類型',
                                                  gvc: gvc,
                                                  def: dd.type ?? 'code',
                                                  callback: (text: string) => {
                                                      dd.type =text
                                                      gvc.notifyDataChange(cid)
                                                  },
                                                  array: [{title:"自定義",value:"code"},{title:"程式碼路徑",value:"script"},{title:"觸發事件",value:"event"}],
                                              })
                                          }
                                          ${HtmlGenerate.editeInput({
                                              gvc,
                                              title: '自定義程式區塊名稱',
                                              default: dd.name,
                                              placeHolder: '自定義程式區塊名稱',
                                              callback: (text) => {
                                                  dd.name = text;
                                                  gvc.notifyDataChange(id);
                                              }
                                          })}
                                          ${(()=>{
                                              if(dd.type==='script'){
                                                  return  EditorElem.uploadFile({
                                                      gvc,
                                                      title: '輸入或上傳路徑連結',
                                                      def: dd.src.link ?? "",
                                                      callback: (text) => {
                                                          dd.src.link = text;
                                                          gvc.notifyDataChange(cid)
                                                      }
                                                  })
                                              }else if(dd.type==="event"){
                                                  dd.src.event=dd.src.event ?? {};
                                                  return  TriggerEvent.editer(gvc,({
                                                      refreshComponent:()=>{
                                                          gvc.notifyDataChange(cid)
                                                      }
                                                  } as any),dd.src.event,{
                                                      title:"觸發事件",
                                                      hover:false,
                                                      option:[]
                                                  })
                                              }else{
                                                  return gvc.map([
                                                      HtmlGenerate.editeText({
                                                          gvc,
                                                          title: '區塊代碼',
                                                          default: dd.src.official,
                                                          placeHolder: '請輸入代碼',
                                                          callback: (text) => {
                                                              dd.src.official = text;
                                                          }
                                                      })
                                                  ])
                                              }
                                          })()}  `;
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
                                  viewModel.initialList.splice(index, 1);
                                  gvc.notifyDataChange(id);
                              })
                          }
                      }),
                      expand: undefined,
                      plus: {
                          title: '添加代碼區塊',
                          event: gvc.event(() => {
                              viewModel.initialList.push({
                                  name: '代碼區塊',
                                  src: {
                                      official: '',
                                      staging: '',
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
                                             `;
}