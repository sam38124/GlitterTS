import {HtmlJson} from "../glitterBundle/module/Html_generate.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {PageEditor} from "../editor-widget/page-editor.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";

class TriggerEventBridge {
    public static editer(gvc: GVC, widget: HtmlJson, obj: any, option: {
        hover: boolean,
        option: string[],
        title?: string
    } = {hover: false, option: []}) {
        const html = String.raw
        return `
<div class="w-100">
<button class="btn btn-primary-c  w-100 " onclick="${gvc.event(() => {
            const tag = gvc.glitter.getUUID();
            gvc.glitter.share.clickEvent = gvc.glitter.share.clickEvent ?? {}
            const glitter = gvc.glitter
            let arrayEvent: any[] = []
            if (obj.clickEvent !== undefined && Array.isArray(obj.clickEvent)) {
                arrayEvent = obj.clickEvent
            } else if (obj.clickEvent !== undefined) {
                arrayEvent = [JSON.parse(JSON.stringify(obj))]
            }
            obj.clickEvent = arrayEvent;
            const vm = {
                rightID: glitter.getUUID(),
                right: html`
                    <div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                         style="color:#151515;font-size:16px;gap:0px;height:44px;">
                        操作說明
                    </div>
                    <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                         style="height:calc(100% - 48px);">
                        <lottie-player src="lottie/animation_event.json" class="mx-auto my-n4" speed="1"
                                       style="max-width: 100%;width: 250px;height:300px;" loop
                                       autoplay></lottie-player>
                        <h3 class=" text-center px-4" style="font-size:18px;">
                            請於左側選擇事件添加，來賦予頁面功能。
                        </h3>
                    </div>
                `
            }
            PageEditor.openDialog.event_trigger_list(gvc, gvc.bindView(() => {
                const did = glitter.getUUID()
                return {
                    bind: did,
                    view: () => {
                        return EditorElem.arrayItem({
                            originalArray: arrayEvent,
                            gvc: gvc,
                            title: '編輯列表',
                            array: () => {
                                return arrayEvent.map((obj: any, index: number) => {
                                    function getEventTitle() {
                                        let select = false
                                        let title = `尚未定義`
                                        try {
                                            title=glitter.share?.clickEvent[TriggerEvent.getLink(obj.clickEvent.src)][obj.clickEvent.route].title
                                        }catch (e) {
                                            
                                        }
                                        return title
                                    }

                                    return {
                                        title: getEventTitle(),
                                        expand: obj,
                                        innerHtml: () => {
                                            const selectID = glitter.getUUID()
                                            vm.right = `  <div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6 "
                                                                 style="color:#151515;font-size:16px;gap:0px;height:44px;">
                                                                ${getEventTitle()}
                                                            </div>` + gvc.bindView(() => {
                                                return {
                                                    bind: selectID,
                                                    view: () => {
                                                        return questionText(`編輯內容`, [
                                                            {
                                                                title: '事件請求',
                                                                content: `<div class="mb-2 w-100" style="word-break: break-word;white-space: normal;">透過設定事件請求，來執行事件，並且取得事件返回的內容。</div>
                                                                ${(() => {
                                                                    obj.pluginExpand = obj.pluginExpand ?? {}
                                                                    try {
                                                                        let text = ``
                                                                        const key = `${TriggerEvent.getLink(obj.clickEvent.src)}`
                                                                        if (!glitter.share.clickEvent[key]) {
                                                                            text = ``
                                                                        } else {
                                                                            text = glitter.share.clickEvent[key][obj.clickEvent.route].fun(gvc, widget, obj).editor()
                                                                        }
                                                                        if (text.replace(/ /g, '') === '') {
                                                                            return ``
                                                                        } else {
                                                                            return EditorElem.editerDialog({
                                                                                gvc: gvc,
                                                                                dialog: (gvc) => {
                                                                                    return glitter.share.clickEvent[key][obj.clickEvent.route].fun(gvc, widget, obj).editor()
                                                                                },
                                                                                editTitle: "編輯事件請求"
                                                                            })
                                                                        }
                                                                    } catch (e) {
                                                                        return ``
                                                                    }
                                                                })()}
                                                                `
                                                            },
                                                            {
                                                                title: '返回事件',
                                                                content: `<div class="mb-2 w-100" style="word-break: break-word;white-space: normal;">將事件返回的內容參數進行二次處理。</div>
                                                                 ${EditorElem.editerDialog({
                                                                    gvc: gvc,
                                                                    dialog: (gvc) => {
                                                                        return glitter.htmlGenerate.editeText({
                                                                            gvc: gvc,
                                                                            title: "",
                                                                            default: obj.dataPlace ?? "",
                                                                            placeHolder: `執行事件或儲存返回資料:
範例:
 (()=>{
   //將資料儲存於當前頁面．
   gvc.saveData=response;
   //將資料儲存於全域變數中
   glitter.share.saveData=response
     })()`,
                                                                            callback: (text: string) => {
                                                                                obj.dataPlace = text
                                                                                gvc.notifyDataChange(did)
                                                                            }
                                                                        })
                                                                    },
                                                                    editTitle: "編輯返回事件"
                                                                })}
                                                                `
                                                            },
                                                            {
                                                                title: '異常返回值',
                                                                content: `<div class="mb-2 w-100" style="word-break: break-word;white-space: normal;">當事件無法正常執行時則會返回異常返回值。</div>
                                                                 ${EditorElem.editerDialog({
                                                                    gvc: gvc,
                                                                    dialog: (gvc) => {
                                                                        return glitter.htmlGenerate.editeInput({
                                                                            gvc: gvc,
                                                                            title: "",
                                                                            default: obj.errorCode ?? "",
                                                                            placeHolder: `請輸入參數值`,
                                                                            callback: (text: string) => {
                                                                                obj.errorCode = text
                                                                                gvc.notifyDataChange(did)
                                                                            }
                                                                        })
                                                                    },
                                                                    editTitle: "編輯異常返回值"
                                                                })}`
                                                            },
                                                            {
                                                                title: '中斷指令',
                                                                content: `<div class="mb-2 w-100" style="word-break: break-word;white-space: normal;">判斷事件返回內容，決定事件流程是否要繼續進行。</div>
                                                                 ${EditorElem.editerDialog({
                                                                    gvc: gvc,
                                                                    dialog: (gvc) => {
                                                                        return glitter.htmlGenerate.editeText({
                                                                            gvc: gvc,
                                                                            title: "",
                                                                            default: obj.blockCommand ?? "",
                                                                            placeHolder: `返回true則中斷指令不往下繼續執行:
範例:
 (()=>{
  return gvc.getBundle()['identify']==='';
     })()`,
                                                                            callback: (text: string) => {
                                                                                obj.blockCommand = text
                                                                                gvc.notifyDataChange(did)
                                                                            }
                                                                        })
                                                                    },
                                                                    editTitle: "編輯中斷指令"
                                                                })}
                                                                `
                                                            }
                                                        ])
                                                    },
                                                    divCreate: {
                                                        class: `bg-secondary`,
                                                        style: `max-height:660px;overflow-y:auto;min-height:450px;`
                                                    }
                                                }
                                            })
                                            gvc.notifyDataChange(vm.rightID)
                                            return ``
                                        },
                                        minus: gvc.event(() => {
                                            arrayEvent.splice(index, 1);
                                            gvc.notifyDataChange(did)
                                        }),
                                    };
                                })
                            },
                            expand: {expand: true},
                            plus: {
                                title: '添加事件',
                                event: gvc.event(() => {
                                    PageEditor.openDialog.event_config(gvc, (data) => {
                                        console.log(`add--`,JSON.stringify(data))
                                        arrayEvent.push({
                                            clickEvent: {
                                                src: data.src,
                                                route: data.key
                                            }
                                        })
                                        gvc.notifyDataChange(did)
                                    })
                                }),
                            },
                            refreshComponent: () => {
                                gvc.recreateView()
                            },
                            customEditor: true
                        })
                    },
                    divCreate: {}
                }
            }), gvc.bindView(() => {
                return {
                    bind: vm.rightID,
                    view: () => {
                        return vm.right
                    },
                    divCreate: {style: `width:350px;height:100%;`, class: ``}
                }
            }))
        })}">${option.title ?? "觸發事件"}</button>
</div>

`
    }
}

export let initial = function () {
    const glitter = (window as any).glitter
    glitter.share.editorBridge = glitter.share.editorBridge ?? {}
    glitter.share.editorBridge['TriggerEventBridge'] = {
        editer: TriggerEventBridge.editer
    }
}

function questionText(title: string, data: { title: string, content: string }[]) {
    return `<div class="bg-secondary  py-2 px-2">
          ${title && `<h2 class="text-center my-3 mt-2" style="font-size:22px;">${title}</h2>`}
             <div class="accordion mx-2" id="faq">
                ${data.map((dd, index) => {
        return ` <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                  <h3 class="accordion-header">
                    <button class="accordion-button shadow-none rounded-3 ${(index === 0) ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#q-${index}" aria-expanded="false" aria-controls="q-1">${dd.title}</button>
                  </h3>
                  <div class="accordion-collapse collapse ${(index === 0) ? 'show' : ''}" id="q-${index}" data-bs-parent="#faq" style="">
                    <div class="accordion-body fs-sm pt-0">
                     ${dd.content}
                    </div>
                  </div>
                </div>`
    }).join('')}
              
              </div>
        </div>`
}