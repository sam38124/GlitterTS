import {GVC} from "../glitterBundle/GVController.js";
import {Swal} from "../modules/sweetAlert.js";
import Add_item_dia from "../editor/add_item_dia.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {PageEditor} from "../editor-widget/page-editor.js";


enum ViewType {
    mobile = "mobile",
    desktop = "desktop",
    col3 = "col3",
    fullScreen = "fullScreen"
}

const html = String.raw

export class Main_editor {
    public static left(gvc: GVC, viewModel: any, createID: string, gBundle: any) {

        const swal = new Swal(gvc);
        const glitter = gvc.glitter
        return gvc.bindView(() => {
            glitter.debugMode = true;
            const vid = glitter.getUUID();
            return {
                bind: vid,
                view: () => {

                    function checkSelect(array: any) {
                        array.map((dd: any) => {
                            if (dd.id === glitter.getCookieByName('lastSelect')) {
                                viewModel.selectContainer = array
                                viewModel.selectItem = dd
                            } else if (Array.isArray(dd.data.setting)) {
                                checkSelect(dd.data.setting)
                            }
                        })
                    }

                    checkSelect((viewModel.data! as any).config)

                    if ((glitter.getCookieByName("ViewType") === ViewType.col3)) {
                        gvc.notifyDataChange('right_NAV')
                    }
                   console.log(`viewModel.selectItem-->`,viewModel.selectItem)
                    if (viewModel.selectItem && (glitter.getCookieByName("ViewType") !== ViewType.col3) &&  (viewModel.selectItem.type !== 'code') && (viewModel.selectItem.type !== 'widget' || (viewModel.selectItem.data.elem !== 'style' && viewModel.selectItem.data.elem !== 'link' && viewModel.selectItem.data.elem !== 'script'))) {
                        return Main_editor.editorContent(gvc, viewModel, vid)
                    } else {
                        return html`
                            <li class="w-100 align-items-center  d-flex editor_item_title position-sticky top-0 start-0 bg-white z-index-9"
                                style="z-index: 999;"
                                onclick="${gvc.event(() => {
                                })}"
                            >${viewModel.data.name}-區段
                                <div class="ms-auto d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                                         PageEditor.openDialog.page_config(gvc)
                                     })}">
                                    <i class="fa-solid fa-code"></i>
                                </div>
                                <div class=" d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                                         viewModel.selectContainer = (viewModel.data! as any).config
                                         gvc.glitter.innerDialog((gvc: GVC) => {
                                             return Add_item_dia.view(gvc)
                                         }, 'Add_Item')
                                     })}">
                                    <i class="fa-regular fa-circle-plus"></i>
                                </div>
                            </li>
                            ${(() => {
                                return gvc.map([
                                    html`
                                        <div class="d-flex ms-2  px-2   hi fw-bold d-flex align-items-center border-bottom d-none"
                                             style="color:#151515;font-size:14px;gap:0px;">頁面-區段
                                            <div class="flex-fill"></div>
                                            <l1 class="btn-group dropend me-0" onclick="${gvc.event(() => {
                                                viewModel.selectContainer = (viewModel.data! as any).config
                                            })}">
                                                <div class="editor_item d-none  px-2 me-0" style="cursor:pointer; "
                                                     onclick="${gvc.event(() => {
                                                         viewModel.selectContainer = (viewModel.data! as any).config
                                                         glitter.share.pastEvent()
                                                     })}">
                                                    <i class="fa-duotone fa-paste"></i>
                                                </div>
                                                <div class="editor_item   px-2 ms-0 me-n1"
                                                     style="cursor:pointer;gap:5px;" onclick="${gvc.event(() => {
                                                    viewModel.selectContainer = (viewModel.data! as any).config
                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                        return Add_item_dia.view(gvc)
                                                    }, 'Add_Item')
                                                })}">
                                                    <i class="fa-regular fa-circle-plus"></i>
                                                </div>
                                            </l1>
                                        </div>`,
                                    new PageEditor(gvc, vid).renderLineItem((viewModel.data! as any).config.filter((dd: any, index: number) => {
                                        dd.index = index
                                        return (dd.type !== 'code') && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script'))
                                    }), false, (viewModel.data! as any).config)
                                ])
                            })()}
                        `

                    }
                },
                divCreate: {class: `swiper-slide h-100 position-relative`},
                onCreate: () => {
                    function check() {
                        if (!viewModel.data) {
                            setTimeout(() => {
                                check()
                            }, 1000)
                        } else {
                            const htmlGenerate = new gvc.glitter.htmlGenerate((viewModel.data! as any).config, [], undefined, true);
                            (window as any).editerData = htmlGenerate;
                            (window as any).page_config = (viewModel.data! as any).page_config
                            gvc.notifyDataChange('showView')
                        }
                    }

                    check()
                }
            }
        })
    }

    public static right(gvc: GVC, viewModel: any, createID: string, gBundle: any) {
        const glitter = gvc.glitter
        return gvc.bindView(() => {
            let haveAdd = true;
            return {
                bind: `htmlGenerate`,
                view: () => {
                    let hoverList: string[] = [];
                    if (viewModel.selectItem !== undefined) {
                        hoverList.push((viewModel.selectItem as any).id);
                    }
                    const htmlGenerate = new glitter.htmlGenerate((viewModel.data! as any).config, hoverList, undefined, true);
                    (window as any).editerData = htmlGenerate;
                    (window as any).page_config = (viewModel.data! as any).page_config
                    const json = JSON.parse(JSON.stringify((viewModel.data! as any).config));
                    json.map((dd: any) => {
                        dd.refreshAllParameter = undefined;
                        dd.refreshComponentParameter = undefined;
                    });

                    if (!viewModel.selectItem) {
                        return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<iframe src="https://embed.lottiefiles.com/animation/84663" class="w-100" style="width: 400px;height: 400px"></iframe>
<h3>請於左側選擇元件編輯</h3>
</div>`
                    }
                    return htmlGenerate.editor(gvc, {
                        return_: false,
                        refreshAll: () => {
                            if (viewModel.selectItem) {
                                gvc.notifyDataChange(['showView']);
                            }
                        },
                        setting: (() => {
                            if (viewModel.selectItem) {
                                return [viewModel.selectItem];
                            } else {
                                return undefined;
                            }
                        })(),
                        deleteEvent: () => {
                            viewModel.selectItem = undefined
                            gvc.notifyDataChange(createID);
                        }
                    });
                },
                divCreate: {},
                onCreate: () => {
                    setTimeout(() => {
                        $('#jumpToNav').scrollTop(parseInt(glitter.getCookieByName('jumpToNavScroll'), 10) ?? 0)
                    }, 1000)

                }
            };
        })
    }

    public static editorContent(gvc: GVC, viewModel: any, vid?: any) {
        const glitter = gvc.glitter
        if (viewModel.selectItem === undefined) {
            return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<img class="border" src="https://liondesign-prd.s3.amazonaws.com/file/252530754/1692927479829-Screenshot 2023-08-25 at 9.36.15 AM.png"  >
<lottie-player src="https://lottie.host/23df5e29-6a51-428a-b112-ff6901c4650e/yxNS0Bw8mk.json" class="position-relative" background="transparent" speed="1" style="margin-top:-70px;" loop  autoplay direction="1" mode="normal"></lottie-player>
<div style="font-size:16px;margin-top:-10px;width:calc(100% - 20px);word-break:break-all !important;display:inline-block;white-space:normal;" class="p-2 text-center alert alert-secondary" >
請直接點擊頁面元件，或於左側頁面區段來選擇元件進行編輯。</div>
</div>`
        }
        return [html`
            <div class="h-100 " style="overflow-y:auto;">
                <div class="w-100 d-flex align-items-center px-3 border-bottom ${(vid) ? `` : `d-none`}"
                     style="height:49px;color:#151515;">
                    <i class="fa-regular fa-chevron-left me-2 hoverBtn" style="cursor:pointer;"
                       onclick="${gvc.event(() => {
                           glitter.setCookie('lastSelect', '')
                           viewModel.selectItem = undefined
                           gvc.notifyDataChange(vid)
                       })}"></i>
                    <span class="fw-bold" style="font-size:15px;">${viewModel.selectItem.label}</span>
                </div>
                ${gvc.bindView(() => {
                    return {
                        bind: `htmlGenerate`,
                        view: () => {
                            let hoverList: string[] = [];
                            if (viewModel.selectItem !== undefined) {
                                hoverList.push((viewModel.selectItem as any).id);
                            }
                            const htmlGenerate = new glitter.htmlGenerate((viewModel.data! as any).config, hoverList, undefined, true);
                            (window as any).editerData = htmlGenerate;
                            (window as any).page_config = (viewModel.data! as any).page_config
                            const json = JSON.parse(JSON.stringify((viewModel.data! as any).config));
                            json.map((dd: any) => {
                                dd.refreshAllParameter = undefined;
                                dd.refreshComponentParameter = undefined;
                            });
                            return htmlGenerate.editor(gvc, {
                                return_: false,
                                refreshAll: () => {
                                    if (viewModel.selectItem) {
                                        gvc.notifyDataChange(['showView']);
                                    }
                                },
                                setting: (() => {
                                    if (viewModel.selectItem) {
                                        return [viewModel.selectItem];
                                    } else {
                                        return undefined;
                                    }
                                })(),
                                deleteEvent: () => {
                                }
                            })
                        },
                        divCreate: {
                            class: `p-2`
                        },
                        onCreate: () => {
                            setTimeout(() => {
                                $('#jumpToNav').scrollTop(parseInt(glitter.getCookieByName('jumpToNavScroll'), 10) ?? 0)
                            }, 1000)
                        }
                    };
                })}
                <div class="w-100" style="height:50px;"></div>
            </div>
        `,
            html`
                <div class="w-100  position-absolute bottom-0 border-top d-flex align-items-center ps-3"
                     style="height:50px;background:#f6f6f6;font-size:14px;">
                    <div class="hoverBtn fw-bold" style="color:#8e1f0b;cursor:pointer;"
                         onclick="${gvc.event(() => {
                             for (let a = 0; a < viewModel.selectContainer.length; a++) {
                                 if (viewModel.selectContainer[a] == viewModel.selectItem) {
                                     viewModel.selectContainer.splice(a, 1)
                                 }
                             }
                             viewModel.selectItem = undefined
                             gvc.notifyDataChange(['HtmlEditorContainer']);
                         })}">
                        <i class="fa-solid fa-trash-can me-2"></i>移除區塊
                    </div>
                </div>`
        ].join('')
    }

    public static center(viewModel: any, gvc: GVC) {
        return html`
            <div class="${(viewModel.type === ViewType.mobile) ? `d-flex align-items-center justify-content-center flex-column mx-auto` : `d-flex align-items-center justify-content-center flex-column`}"
                 style="${(viewModel.type === ViewType.mobile) ? `width: 414px;height: calc(100vh - 50px);padding-top: 20px;` : `width: calc(100% - 20px);margin-left:10px;height: calc(100vh - 50px);padding-top: 20px;"`}">
                <div class="bg-white" style="width:100%;height: calc(100%);">
                    <iframe class="w-100 h-100 rounded"
                            src="index.html?type=htmlEditor&page=${gvc.glitter.getUrlParameter('page')}"></iframe>
                </div>
            </div>`
    }

    public static index = '0'
}

function swapArr(arr: any, index1: number, index2: number) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}