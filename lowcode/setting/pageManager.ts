import {HtmlGenerate} from "../glitterBundle/module/Html_generate.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";

export function pageManager(gvc:GVC,viewModel:any,id:string){
    const glitter=gvc.glitter;
    viewModel.data.page_config.seo = viewModel.data.page_config.seo ?? {}
    const seo = viewModel.data.page_config.seo
    // viewModel.homePage=tag
    return `
    <ul class="nav nav-tabs border-bottom" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">頁面設定</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">配置檔</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">程式碼</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">${gvc.map([
        [
            `<div class=" m-0 d-flex align-items-center " style="border-radius: 0px;">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">首頁設定:</h3>
<select onchange="${gvc.event((e)=>{
                if(e.value==='true'){
                    viewModel.homePage=viewModel.data.tag
                }
            })}" class="form-control form-select">

<option value="false">否</option>
<option value="true" ${(viewModel.homePage===viewModel.data.tag) ? `selected`:``}>是</option>
</select>
</div>`,
            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">容器樣式:</h3>
${
                glitter.htmlGenerate.styleEditor(viewModel.data.page_config).editor(gvc, () => {
                }, "設定樣式")}</div>`,
            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">頁面連結:</h3>
${ glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: '',
                placeHolder: `請輸入頁面標籤`,
                default: viewModel.data.tag,
                callback: (text) => {
                    viewModel.data.tag = text
                }
            })}</div>`,
            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">頁面名稱:</h3>
${  glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: '',
                placeHolder: `請輸入頁面名稱`,
                default: viewModel.data.name,
                callback: (text) => {
                    viewModel.data.name = text
                }
            })}</div>`,
            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0 ">頁面分類:</h3>
${  EditorElem.searchInput({
                title: "",
                gvc: gvc,
                def: viewModel.data.group,
                array: (() => {
                    let group: string[] = []
                    viewModel.dataList.map((dd: any) => {
                        if (group.indexOf(dd.group) === -1) {
                            group.push(dd.group)
                        }
                    });
                    return group
                })(),
                callback: (text: string) => {
                    viewModel.data.group = text
                    gvc.notifyDataChange(id)
                },
                placeHolder: "請輸入頁面分類"
            })}</div>`,
            EditorElem.h3("<span style='color:#ff5d24;'>SEO參數設定</span>")+gvc.bindView(()=>{
                const id=glitter.getUUID()
                return {
                    bind:id,
                    view:()=>{
                        seo.type=seo.type??"def"
                        if(viewModel.data.tag===viewModel.homePage){
                            seo.type='custom'
                        }
                        return `
<select class="form-select form-control ${(viewModel.data.tag===viewModel.homePage) && 'd-none'}" onchange="${gvc.event((e)=>{
                            seo.type=e.value
                            gvc.notifyDataChange(id)
                        })}">
<option value="def" ${(seo.type==="def") ? `selected`:``}>依照首頁</option>
<option value="custom" ${(seo.type==="custom") ? `selected`:``}>自定義</option>
</select>
<div class="alert alert-dark p-0 px-2 pb-2 mt-2 ${(seo.type==="def") ? `d-none`:``}">
${gvc.map([                                     uploadImage({
                            gvc: gvc,
                            title: `網頁logo`,
                            def: seo.logo ?? "",
                            callback: (data) => {
                                seo.logo = data
                            }
                        }),
                            uploadImage({
                                gvc: gvc,
                                title: `預覽圖片`,
                                def: seo.image ?? "",
                                callback: (data) => {
                                    seo.image = data
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: "網頁標題",
                                default: seo.title ?? "",
                                placeHolder: "請輸入網頁標題",
                                callback: (text: string) => {
                                    seo.title = text
                                }
                            }),
                            glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: "網頁描述",
                                default: seo.content ?? "",
                                placeHolder: "請輸入網頁標題",
                                callback: (text: string) => {
                                    seo.content = text
                                }
                            }),
                            glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: "關鍵字設定",
                                default: seo.keywords ?? "",
                                placeHolder: "關鍵字設定",
                                callback: (text: string) => {
                                    seo.keywords = text
                                }
                            })
                        ])}
</div>`
                    },
                    divCreate:{}
                }
            })].join(`<div class="my-2 border-bottom w-100"></div>`)
    ])}<button class="btn btn-warning w-100 mt-2" style="color: black;" onclick="${gvc.event(() => {
        glitter.closeDiaLog()
        glitter.htmlGenerate.saveEvent()
    })}">儲存</button> </div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
<div class="alert alert-danger " style="white-space: normal;word-break:break-all;">此頁面的配置檔包含所有設計模組和觸發事件的項目。建議由熟悉程式開發的工程師進行編輯。</div>
${(()=>{
        const json = JSON.parse(JSON.stringify((viewModel.data! as any).config));
        json.map((dd: any) => {
            dd.refreshAllParameter = undefined;
            dd.refreshComponentParameter = undefined;
        });
        let value = ''
        return ` <textArea class="form-control " style="overflow-x: scroll;height: 450px;" onchange="${gvc.event((e) => {
            value = e.value;
        })}">${JSON.stringify(json, null, '\t')}</textArea>
 <div class="d-flex w-100 mt-2 justify-content-between">
 <button class="btn btn-primary " style="width:calc(50% - 10px);" onclick="${gvc.event(() => {
            navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
        })}">複製到剪貼簿</button>
  <button class="btn btn-warning " style="width:calc(50% - 10px);color:black; " onclick="${gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter)
            try {
                (viewModel.data! as any).config = JSON.parse(value)
                glitter.closeDiaLog()
                glitter.htmlGenerate.saveEvent()
            } catch (e: any) {
                dialog.errorMessage({text: "代碼輸入錯誤"})
                console.log(`${e}${e.stack}${e.line}`)
            }

        })}">儲存</button>
</div>
                        `;
    })()}</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
  <div class="alert alert-danger " style="white-space: normal;word-break:break-all;">此頁面的代碼涉及到頁面上所需執行的行為。建議由熟悉程式開發的工程師進行編輯。</div>
  ${
        (()=>{
            viewModel.data.page_config.initialList=viewModel.data.page_config.initialList??[]
            return gvc.bindView(()=>{
                const id=glitter.getUUID()
                return {
                    bind:id,
                    view:()=>{
                        return EditorElem.arrayItem({
                            originalArray:viewModel.data.page_config.initialList,
                            gvc: gvc,
                            title: '文字區塊內容',
                            array: viewModel.data.page_config.initialList.map((dd:any, index:number) => {
                                return {
                                    title:`<span style="color:#ffba08;">${dd.name || `區塊:${index}`}</span>`,
                                    innerHtml: `${gvc.bindView(() => {
                                        const cid = glitter.getUUID();
                                        return {
                                            bind: cid,
                                            view: () => {
                                                return ` 
                                                 ${EditorElem.select({
                                                    title:"執行時機",
                                                    gvc:gvc,
                                                    def:dd.when,
                                                    array:[{
                                                        title:"頁面渲染前",value:"initial"
                                                    },
                                                        {
                                                            title:"頁面渲染後",value:"onCreate"
                                                        }],
                                                    callback:(text)=>{
                                                        dd.when=text
                                                        gvc.notifyDataChange(id)
                                                    }
                                                })}
                                                 ${HtmlGenerate.editeInput({
                                                    gvc,
                                                    title: '自定義程式區塊名稱',
                                                    default: dd.name,
                                                    placeHolder: '自定義程式區塊名稱',
                                                    callback: (text) => {
                                                        dd.name = text;
                                                        gvc.notifyDataChange(cid);
                                                    }
                                                })}
                                                  ${
                                                    EditorElem.select({
                                                        title: '類型',
                                                        gvc: gvc,
                                                        def: dd.type ?? 'code',
                                                        callback: (text: string) => {
                                                            dd.type =text
                                                            gvc.notifyDataChange(cid)
                                                        },
                                                        array: [{title:"自定義",value:"code"},{title:"觸發事件",value:"script"}],
                                                    })
                                                }
                                                  ${(()=>{
                                                    if(dd.type==='script'){
                                                        return  TriggerEvent.editer(gvc,({
                                                            refreshComponent:()=>{
                                                                gvc.notifyDataChange(cid)
                                                            }
                                                        } as any),dd)
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
                                    })}`,
                                    expand:dd,
                                    minus:gvc.event(()=>{
                                        viewModel.data.page_config.initialList.splice(index, 1);
                                        gvc.notifyDataChange(id);
                                    })
                                }
                            }),
                            expand: undefined,
                            plus: {
                                title: '添加代碼區塊',
                                event: gvc.event(() => {
                                    viewModel.data.page_config.initialList.push({
                                        name: '代碼區塊',
                                        src: {
                                            official: '',
                                            staging: '',
                                            open: true
                                        },
                                        when:'onCreate'
                                    });
                                    gvc.notifyDataChange(id);
                                }),
                            },
                            refreshComponent:()=>{
                                gvc.notifyDataChange(id);
                            }
                        })+`<button class="btn btn-warning w-100 mt-4" style="color: black;" onclick="${gvc.event(() => {
                            glitter.closeDiaLog()
                            glitter.htmlGenerate.saveEvent()
                        })}">儲存</button> `
                    },
                    divCreate:{}
                }
            })
        })()
    }
</div>
</div>

    `
}
function uploadImage(obj: {
    title: string,
    gvc: any, def: string, callback: (data: string) => void
}) {
    const glitter = (window as any).glitter
    const id = glitter.getUUID()
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control "  placeholder="請輸入圖片連結" value="${obj.def}" onchange="${obj.gvc.event((e: any) => {
                    obj.callback(e.value)
                    obj.gvc.notifyDataChange(id)
                })}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
                    glitter.ut.chooseMediaCallback({
                        single: true,
                        accept: 'json,image/*',
                        callback(data: any) {
                            const saasConfig: {
                                config: any,
                                api: any
                            } = (window as any).saasConfig
                            const dialog = new ShareDialog(obj.gvc.glitter)
                            dialog.dataLoading({visible: true})
                            const file = data[0].file
                            saasConfig.api.uploadFile(file.name).then((data: any) => {
                                dialog.dataLoading({visible: false})
                                const data1 = data.response
                                dialog.dataLoading({visible: true})
                                $.ajax({
                                    url: data1.url,
                                    type: 'put',
                                    data: file,
                                    processData: false,
                                    crossDomain: true,
                                    success: (data2) => {
                                        dialog.dataLoading({visible: false})
                                        obj.callback(data1.fullUrl)
                                        obj.def = data1.fullUrl
                                        obj.gvc.notifyDataChange(id)
                                    },
                                    error: (err) => {
                                        dialog.dataLoading({visible: false})
                                        dialog.errorMessage({text: "上傳失敗"})
                                    },
                                });
                            })
                        }
                    });
                })}"></i>
                            </div>
                            ${obj.def && `<img src="${obj.def}" style="max-width: 150px;">`}

`
            },
            divCreate: {}
        }
    })
}