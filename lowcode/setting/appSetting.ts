import {HtmlGenerate} from "../glitterBundle/module/Html_generate.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {initialCode} from "./initialCode.js";

export function appSetting(gvc:GVC,viewModel:any,id:string){
    const glitter=(window as any).glitter
    return `
 <ul class="nav nav-tabs border-bottom" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">頁面模塊</button>
  </li>
   <li class="nav-item" role="presentation">
    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">觸發事件</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">初始化代碼</button>
  </li>
</ul>
<div class="tab-content" id="pills-tabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
${(()=>{
        return `
                                                ${gvc.map(viewModel.pluginList.map((dd:any, index:number) => {
            return `
                                                    ${gvc.bindView(() => {
                const cid = glitter.getUUID();
                return {
                    bind: cid,
                    view: () => {
                        return `
                                                     <div class="d-flex align-items-center" style="height: 40px;">
    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                            viewModel.pluginList.splice(index, 1);
                            gvc.notifyDataChange(id);
                        })}"></i>
                                                    <h3 style="color: white;font-size: 16px;" class="m-0 text-warning">${(dd.name && dd.name !== '') ? dd.name : '未命名插件'}</h3>

                                                    <div class="flex-fill"></div>
                                                     ${(dd.src.open) ? `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                            dd.src.open = false;
                            gvc.notifyDataChange(cid);
                        })}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>
                                                     ` : `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                            dd.src.open = true;
                            gvc.notifyDataChange(cid);
                        })}}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>
                                                     `}
                                                     </div>
                                                     ${(dd.src.open) ? `
                                                     ${HtmlGenerate.editeInput({
                            gvc,
                            title: '自定義插件名稱',
                            default: dd.name,
                            placeHolder: '自定義插件名稱',
                            callback: (text) => {
                                dd.name = text;
                                gvc.notifyDataChange(cid);
                            }
                        })}
                                                     ${HtmlGenerate.editeInput({
                            gvc,
                            title: '模板路徑',
                            default: dd.src.official,
                            placeHolder: '模板路徑',
                            callback: (text) => {
                                dd.src.official = text;
                            }
                        })}
                                                     ` : ''}
                                                    `;
                    },
                    divCreate: {
                        class: `w-100`,
                        style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                    }
                };
            })}
                                                    `;
        }))}
                                                <div class="d-flex" style="gap: 10px;">
                                                  <div class="btn btn-warning" style="color:black;flex: 1;height: 50px;" onclick="${
            gvc.event(() => {
                viewModel.pluginList.push({
                    name: '',
                    route: '',
                    src: {
                        official: '',
                        staging: '',
                        open: true
                    }
                });
                gvc.notifyDataChange(id);
            })
        }">添加模塊</div>
                                                  <button class="btn btn-primary w-100" style="flex: 1;height: 50px;" onclick="${gvc.event(() => {
            glitter.closeDiaLog()
            glitter.htmlGenerate.saveEvent()
        })}">儲存</button>
</div>
                                             `;
    })()}</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
${initialCode(gvc, viewModel, id)}</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
  ${gvc.bindView(()=>{
      const td=glitter.getUUID()
        return {
          bind:td,
            view:()=>{
              return `<div class="alert-warning alert " style="word-break: break-all;white-space:normal;">觸發事件是指在網頁上所設定的點擊、滑動、焦點觸發等事件。</div>
${
                  (()=>{
                      return `
                                                ${gvc.map(viewModel.initialJS.map((dd:any, index:number) => {
                          return `
                                                    ${gvc.bindView(() => {
                              const cid = glitter.getUUID();
                              return {
                                  bind: cid,
                                  view: () => {
                                      return `
                                                     <div class="d-flex align-items-center" style="height: 40px;">
    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                          viewModel.initialJS.splice(index, 1);
                                          gvc.notifyDataChange(td);
                                      })}"></i>
                                                    <h3 style="color: white;font-size: 16px;" class="m-0 text-warning">${(dd.name && dd.name !== '') ? dd.name : '未命名插件'}</h3>

                                                    <div class="flex-fill"></div>
                                                     ${(dd.src.open) ? `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                                          dd.src.open = false;
                                          gvc.notifyDataChange(cid);
                                      })}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>
                                                     ` : `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                                          dd.src.open = true;
                                          gvc.notifyDataChange(cid);
                                      })}}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>
                                                     `}
                                                     </div>
                                                     ${(dd.src.open) ? `
                                                     ${HtmlGenerate.editeInput({
                                          gvc,
                                          title: '自定義插件名稱',
                                          default: dd.name,
                                          placeHolder: '自定義插件名稱',
                                          callback: (text) => {
                                              dd.name = text;
                                              gvc.notifyDataChange(cid);
                                          }
                                      })}
                                                     ${HtmlGenerate.editeInput({
                                          gvc,
                                          title: '正式區',
                                          default: dd.src.official,
                                          placeHolder: '正式區路徑',
                                          callback: (text) => {
                                              dd.src.official = text;
                                          }
                                      })}
                                                     ` : ''}
                                                    `;
                                  },
                                  divCreate: {
                                      class: `w-100`,
                                      style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                                  }
                              };
                          })}
                                                    `;
                      }))}
                                                <div class="d-flex" style="gap: 10px;">
                                                  <div class="btn btn-warning" style="color:black;flex: 1;height: 50px;" onclick="${
                          gvc.event(() => {
                              viewModel.initialJS.push({
                                  name: '',
                                  route: '',
                                  src: {
                                      official: '',
                                      open: true
                                  }
                              });
                              gvc.notifyDataChange(td);
                          })
                      }">添加插件</div>
                                                  <button class="btn btn-primary w-100" style="flex: 1;height: 50px;" onclick="${gvc.event(() => {
                          glitter.closeDiaLog()
                          glitter.htmlGenerate.saveEvent()
                      })}">儲存</button>
</div>
                                              `
                  })()
              }`
            },
            divCreate:{}
        }
    })}
</div>
</div>
    `
}