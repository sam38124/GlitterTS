import {GVC, init} from '../GVController.js';
import {EditorElem} from "./editor-elem.js";
import Add_item_dia from "./add_item_dia.js";
//@ts-ignore
import {Swal} from "../../modules/sweetAlert.js";
import {TriggerEvent} from "./trigger-event.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {Storage} from "../../helper/storage.js";

const html = String.raw

init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            console.log(`gBundle.data.version===>`,gBundle.data)
            if (gBundle.data.version !== 'v2') {
                gBundle.data.version = 'v2';
                gBundle.data.list = gBundle.data.list ?? [];
            }
            const styleDataSetting: {
                list: {
                    name: string,
                    style: string,
                    class: string,
                    style_from: 'manual' | 'code' | 'tag',
                    stylist: {
                        style: string,
                        class: string,
                        size: number | string
                    }[],
                }[],
                style: string,
                class: string,
                style_from: 'manual' | 'code' | 'tag',
                stylist: {
                    style: string,
                    class: string,
                    size: number | string
                }[],
                version: 'v2',
                name: string
            } = gBundle.data;

            function migrateFrSize(styleData: any, key: 'style' | 'class') {
                try {
                    if (styleData[key].trim().startsWith('glitter.ut.frSize')) {
                        const data = styleData[key].trim().replace(`glitter.ut.frSize(`, '')
                        let f1: any = `(()=>{
                return ${data.substring(0, data.lastIndexOf(`},`))}}
                })()`
                        f1 = eval(f1)
                        let f2 = data.substring(data.lastIndexOf(`},`) + 2, data.length - 1)
                        f2 = eval(f2)
                        styleData[key] = f2
                        Object.keys(f1).map((d1) => {
                            let waitPost: any = styleData.stylist.find((d2: any) => {
                                return d2.size === d1
                            })
                            if (!waitPost) {
                                waitPost = {
                                    size: d1,
                                    style: ``,
                                    class: ``
                                }
                                styleData.stylist.push(waitPost)
                            }
                            waitPost[key] = f1[d1]
                        })
                    }
                } catch (e) {

                }
            }

            function retDefineListData() {
                styleDataSetting.list.map((dd) => {
                    dd.style_from = dd.style_from ?? 'code'
                    dd.stylist = dd.stylist ?? [];
                    migrateFrSize(dd, "class")
                    migrateFrSize(dd, "style")
                })
            }

            let vm: any = {
                rightID: gvc.glitter.getUUID(),
                leftId: gvc.glitter.getUUID(),
                diaID:gvc.glitter.getUUID(),
                left_selected: 'def'
            }
            retDefineListData()
            gvc.addMtScript([{
                src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`
            }], () => {
            }, () => {
            })
            return gvc.bindView(()=>{
                return {
                    bind:vm.diaID,
                    view:()=>{
                        return ` <div class="bg-white rounded position-relative " style="max-height:90vh;max-width:900px;">
                        ${gvc.bindView(() => {
                            return {
                                bind: vm.leftId,
                                view: () => {
                                    return html`<i class="fa-solid fa-chevron-down" style="color:black;"></i>
                                    ${(() => {
                                        function generateIconStyleHtml(dd: any) {
                                            return html`
                                                <li class="d-flex align-items-center justify-content-center hoverBtn  border mt-2"
                                                    style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${(vm.left_selected === dd.key) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : ``}
                                 "
                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                                                if (dd.key === 'add') {
                                                    styleDataSetting.list.push({} as any)
                                                    retDefineListData()
                                                    vm.left_selected = `${styleDataSetting.list.length - 1}`;
                                                } else {
                                                    vm.left_selected = dd.key as any
                                                }
                                                gvc.notifyDataChange(vm.diaID)
                                            })}">
                                                    ${dd.icon}
                                                </li>`
                                        }

                                        return [
                                            generateIconStyleHtml({
                                                key: 'def',
                                                label: styleDataSetting.name ?? '預設樣式',
                                                icon: '<i class="fa-solid fa-pencil-slash"></i>'
                                            }),
                                            gvc.bindView(() => {
                                                const parId = gvc.glitter.getUUID()
                                                return {
                                                    bind: parId,
                                                    view: () => {
                                                        return styleDataSetting.list.map((dd, index) => {
                                                            return generateIconStyleHtml({
                                                                key: `${index}`,
                                                                label: dd.name ?? `樣式:${index + 1}`,
                                                                icon: `<span class="fw-bold fs-6">${index + 1}</span>`
                                                            })
                                                        }).join('')
                                                    },
                                                    onCreate: () => {
                                                        const interval = setInterval(() => {
                                                            if ((window as any).Sortable) {
                                                                try {
                                                                    gvc.addStyle(`ul {
  list-style: none;
  padding: 0;
}`)

                                                                    function swapArr(arr: any, index1: number, index2: number) {
                                                                        const data = arr[index1];
                                                                        arr.splice(index1, 1);
                                                                        arr.splice(index2, 0, data);
                                                                    }

                                                                    let startIndex = 0
                                                                    //@ts-ignore
                                                                    Sortable.create(document.getElementById(parId), {
                                                                        group: gvc.glitter.getUUID(),
                                                                        animation: 100,
                                                                        // Called when dragging element changes position
                                                                        onChange: function (evt: any) {
                                                                            swapArr(styleDataSetting.list, startIndex, evt.newIndex)
                                                                            startIndex = evt.newIndex;
                                                                        },
                                                                        onStart: function (evt: any) {
                                                                            startIndex = evt.oldIndex

                                                                            console.log(`oldIndex--`, startIndex)
                                                                        },
                                                                        onEnd: () => {
                                                                            gvc.notifyDataChange([vm.rightID, vm.leftId])
                                                                        }
                                                                    });
                                                                } catch (e) {
                                                                }
                                                                clearInterval(interval)
                                                            }
                                                        }, 100)
                                                    },
                                                    divCreate: {
                                                        class: `m-0`,
                                                        elem: 'ul',
                                                        option: [
                                                            {key: 'id', value: parId}
                                                        ]
                                                    },
                                                }
                                            }),
                                            generateIconStyleHtml({
                                                key: 'add',
                                                label: "新增樣式",
                                                icon: '<i class="fa-regular fa-circle-plus"></i>'
                                            })
                                        ].join('')
                                    })()}`
                                },
                                divCreate: {
                                    class: `position-absolute d-flex  rounded py-3 px-2 bg-white align-items-center flex-column`,
                                    style: `left:-60px;top:0px;z-index:10;`
                                },
                                onCreate: () => {
                                    $('.tooltip')!.remove();
                                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                }
                            }
                        })}
                        <div class="d-flex w-100 border-bottom align-items-center" style="">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ">
                                ${gvc.bindView(() => {
                            const vm_: {
                                id: string,
                                type: 'edit' | 'preview'
                            } = {
                                id: gvc.glitter.getUUID(),
                                type: "preview"
                            }

                            return {
                                bind: vm_.id,
                                view: () => {
                                    const styleData = (vm.left_selected === 'def') ? styleDataSetting : styleDataSetting.list[parseInt(vm.left_selected)]
                                    if (vm_.type === 'edit') {
                                        return html`<i class="fa-solid fa-check me-2"
                                                               style="color:#295ed1;cursor:pointer;" onclick="${
                                            gvc.event(() => {
                                                vm_.type = 'preview'
                                                gvc.notifyDataChange([vm_.id])
                                            })
                                        }"></i>
                                                ${EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: styleData.name,
                                            placeHolder: '請輸入別名',
                                            callback: (text) => {
                                                styleData.name = text;
                                                vm_.type = 'preview'
                                                gvc.notifyDataChange([vm.leftId, vm.rightID, vm_.id])
                                            },
                                        })}`
                                    } else {
                                        return `
 ${(vm.left_selected !== 'def') ? html`
                                                            <div class="d-flex align-items-center justify-content-end me-2"
                                                                 style="cursor: pointer;"
                                                                 data-bs-toggle="tooltip" data-bs-placement="top"
                                                                 data-bs-custom-class="custom-tooltip"
                                                                 data-bs-title="刪除樣式"
                                                                  onclick="${gvc.event(() => {
                                            vm.left_selected = 'def'
                                            styleDataSetting.list.splice(parseInt(vm.left_selected), 1)
                                            gvc.notifyDataChange(vm.diaID)
                                        })}">
                                                                <i class="fa-sharp fa-regular fa-circle-minus text-danger"></i>
                                                            </div>
                                                        ` : ``}
                               <div class="rounded p-2" style="background: whitesmoke;"><i class="fa-solid fa-pencil me-1" 
                                   data-bs-toggle="tooltip" data-bs-placement="top"
                                                                 data-bs-custom-class="custom-tooltip"
                                                                 data-bs-title="編輯樣式名稱"
                               style="color:black;cursor:pointer;" aria-hidden="true" onclick="${
                                            gvc.event(() => {
                                                vm_.type = 'edit'
                                                gvc.notifyDataChange(vm_.id)
                                            })
                                        }"></i> ${(vm.left_selected === 'def') ? styleDataSetting.name ?? `預設樣式` : styleDataSetting.list[parseInt(vm.left_selected)].name ?? '樣式:'+(parseInt(vm.left_selected)+1)}</div>
`
                                    }

                                },
                                divCreate: {
                                    class: `d-flex align-items-center  p-3 py-2`,
                                    style: ``
                                }
                            }
                        })}
                            </h3>
                            <div class="flex-fill"></div>
                            <div class="hoverBtn p-2 me-2" style="color:black;font-size:20px;"
                                 onclick="${gvc.event(() => {
                            gvc.closeDialog()
                            gBundle.callback()
                        })}"
                            ><i class="fa-sharp fa-regular fa-circle-xmark"></i>
                            </div>
                        </div>
                        <div class="d-flex " style="">
                            <div>
                                ${gvc.bindView(() => {
                            return {
                                bind: vm.rightID,
                                view: () => {
                                    const styleData = (vm.left_selected === 'def') ? styleDataSetting : styleDataSetting.list[parseInt(vm.left_selected)]
                                    styleData.style_from=styleData.style_from ?? 'code'
                                    return html`
                                                <div class="d-flex">
                                                    <div style="width:400px;" class="border-end  pb-2">
                                                        ${gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID()
                                        return {
                                            bind: id,
                                            view: () => {
                                                return [
                                                    `<div class="mx-2">${EditorElem.select({
                                                        title: '樣式來源',
                                                        gvc: gvc,
                                                        def: styleData.style_from,
                                                        array: [
                                                            {title: "設定值", value: "code"},
                                                            {title: "標籤值", value: "tag"}
                                                        ],
                                                        callback: (text) => {
                                                            styleData.style_from = text as any
                                                            gvc.notifyDataChange(id)
                                                        }
                                                    })}</div>`,
                                                    (() => {
                                                        if (styleData.style_from === 'code') {
                                                            return [styleEditor(gvc, styleData)].join('')
                                                        } else if (styleData.style_from === 'tag') {
                                                            return html`
                                                                                    <div class="mx-2">
                                                                                        <div class="btn btn-primary-c  w-100"
                                                                                             onclick="${gvc.event(() => {
                                                                glitter.share.selectStyleCallback = (tag: string) => {
                                                                    function toOneArray(array: any, map: any) {
                                                                        try {
                                                                            array.map((dd: any) => {
                                                                                if (dd.type === 'container') {
                                                                                    toOneArray(dd.data.setting, map)
                                                                                } else {
                                                                                    map[dd.data.tag] = dd.data.value
                                                                                }
                                                                            })
                                                                            return map
                                                                        } catch (e) {
                                                                        }
                                                                    };
                                                                    glitter.share.editerGlitter.share.globalStyle = toOneArray(glitter.share.editorViewModel.globalStyleTag, {});
                                                                    (styleData as any).tag = tag
                                                                    glitter.closeDiaLog('EditItem')
                                                                    gvc.recreateView()
                                                                }
                                                                gvc.glitter.innerDialog((gvc: GVC) => {
                                                                    let searchText = ''
                                                                    let searchInterval: any = 0
                                                                    const id = gvc.glitter.getUUID()
                                                                    return html`
                                                                                                         <div class="bg-white rounded"
                                                                                                              style="max-height:90vh;">
                                                                                                             <div class="d-flex w-100 border-bottom align-items-center"
                                                                                                                  style="height:50px;">
                                                                                                                 <h3 style="font-size:15px;font-weight:500;"
                                                                                                                     class="m-0 ps-3">
                                                                                                                     設定STYLE標籤</h3>
                                                                                                                 <div class="flex-fill"></div>
                                                                                                                 <div class="hoverBtn p-2 me-2"
                                                                                                                      style="color:black;font-size:20px;"
                                                                                                                      onclick="${gvc.event(() => {
                                                                        if ((styleData as any).tag) {
                                                                            glitter.share.selectStyleCallback((styleData as any).tag)
                                                                        } else {
                                                                            gvc.closeDialog()
                                                                        }
                                                                    })}"
                                                                                                                 >
                                                                                                                     <i class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                                                                 </div>
                                                                                                             </div>
                                                                                                             <div class="d-flex "
                                                                                                                  style="">
                                                                                                                 <div>
                                                                                                                     ${gvc.bindView(() => {
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                const contentVM: {
                                                                                    loading: boolean,
                                                                                    leftID: string,
                                                                                    rightID: string,
                                                                                    leftBar: string,
                                                                                    rightBar: string
                                                                                } = {
                                                                                    loading: true,
                                                                                    leftID: gvc.glitter.getUUID(),
                                                                                    rightID: gvc.glitter.getUUID(),
                                                                                    leftBar: '',
                                                                                    rightBar: ''
                                                                                }

                                                                                styleRender(gvc, (styleData as any).tag).then((response) => {
                                                                                    contentVM.loading = false
                                                                                    contentVM.leftBar = response.left
                                                                                    contentVM.rightBar = response.right
                                                                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID])
                                                                                })

                                                                                return html`
                                                                                                                                     <div class="d-flex">
                                                                                                                                         <div style="width:300px;"
                                                                                                                                              class="border-end">
                                                                                                                                             ${gvc.bindView(() => {
                                                                                    return {
                                                                                        bind: contentVM.leftID,
                                                                                        view: () => {
                                                                                            return contentVM.leftBar
                                                                                        },
                                                                                        divCreate: {
                                                                                            class: ``,
                                                                                            style: `max-height:calc(90vh - 150px);overflow-y:auto;overflow-x:hidden;`
                                                                                        }
                                                                                    }
                                                                                })}
                                                                                                                                         </div>
                                                                                                                                         ${gvc.bindView(() => {
                                                                                    return {
                                                                                        bind: contentVM.rightID,
                                                                                        view: () => {
                                                                                            return contentVM.rightBar
                                                                                        },
                                                                                        divCreate: {}
                                                                                    }
                                                                                })}
                                                                                                                                     </div>`
                                                                            },
                                                                            divCreate: {
                                                                                style: `overflow-y:auto;`
                                                                            },
                                                                            onCreate: () => {

                                                                            }
                                                                        }
                                                                    })}
                                                                                                                 </div>
                                                                                                             </div>
                                                                                                         </div>
                                                                                                     `
                                                                }, "EditItem")
                                                            })}">
                                                                                            ${(styleData as any).tag ? `當前標籤 : [${(styleData as any).tag}]` : `設定標籤`}
                                                                                        </div>
                                                                                    </div>`
                                                        }
                                                    })()
                                                ].join('<div class="my-2"></div>')
                                            },
                                            divCreate: {
                                                class: ``,
                                                style: `max-height:calc(90vh - 150px);overflow-y:auto;`
                                            }
                                        }
                                    })}
                                                    </div>
                                                </div>`
                                },
                                divCreate: {
                                    style: `overflow-y:auto;`
                                },
                                onCreate: () => {

                                }
                            }
                        })}
                            </div>
                        </div>
                    </div>`
                    },
                    divCreate:{
                        class:`vw-100 vh-100 d-flex align-items-center justify-content-center`,
                        style:'background:rgba(0,0,0,0.6);'
                    }
                }
            })
        }
    }
})

//頁面共用STYLE設計
function styleRender(gvc: GVC, tag?: string) {
    const html = String.raw
    const glitter = gvc.glitter
    const viewModel = gvc.glitter.share.editorViewModel
    const docID = glitter.getUUID()
    const vid = glitter.getUUID()
    viewModel.selectItem = undefined
    viewModel.globalStyleTag = viewModel.globalStyleTag ?? [];
    viewModel.data.page_config.globalStyleTag = viewModel.data.page_config.globalStyleTag ?? []
    //viewModel.data.page_config.globalStyleTag
    //viewModel.globalStyleTag
    return new Promise<{ left: string, right: string }>((resolve, reject) => {
        resolve({
            left: gvc.bindView(() => {
                return {
                    bind: vid,
                    view: () => {
                        return [
                            html`
                                <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                     style="font-size:14px;color:black;">全域標籤
                                    <div class="flex-fill"></div>
                                    <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                        viewModel.selectContainer = viewModel.globalStyleTag
                                    })}">
                                        <div class="editor_item   px-2 me-0 d-none" style="cursor:pointer; "
                                             onclick="${gvc.event(() => {
                                                 viewModel.selectContainer = viewModel.globalStyleTag
                                                 glitter.share.pastEvent()
                                             })}"
                                        >
                                            <i class="fa-duotone fa-paste"></i>
                                        </div>
                                        <div class="editor_item   px-2 ms-0 me-n1"
                                             style="cursor:pointer;gap:5px;"
                                             data-bs-toggle="dropdown"
                                             aria-haspopup="true"
                                             aria-expanded="false">
                                            <i class="fa-regular fa-circle-plus "></i>
                                        </div>
                                        <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                             style="z-index:999999;"
                                             onclick="${gvc.event((e, event) => {
                                                 event.preventDefault()
                                                 event.stopPropagation()

                                             })}">
                                            ${Add_item_dia.add_content_folder(gvc, 'style', (response) => {
                                                viewModel.globalStyleTag.push(response)
                                                gvc.notifyDataChange(vid)
                                            })}
                                        </div>
                                    </l1>
                                </div>`,
                            new Render(gvc, vid, docID).renderLineItem(viewModel.globalStyleTag.map((dd: any, index: number) => {
                                dd.index = index
                                return dd
                            }), false, viewModel.globalStyleTag, {
                                addComponentView: (gvc: GVC, callback?: (data: any) => void) => {
                                    return Add_item_dia.add_content_folder(gvc, 'style', callback)
                                },
                                copyType: 'directly',
                                selectEv: (dd: any) => {
                                    if ((dd.data ?? {}).tag && (dd.data ?? {}).tag === tag) {
                                        viewModel.selectItem = dd
                                        tag = undefined
                                        gvc.notifyDataChange(docID)
                                        return true
                                    } else {
                                        return false
                                    }
                                }
                            })
                        ].join('')
                    },
                    divCreate: {
                        style: `min-height:400px;`
                    },
                    onCreate: () => {
                        gvc.notifyDataChange(docID)
                    }
                }
            }),
            right: gvc.bindView(() => {
                return {
                    bind: docID,
                    view: () => {
                        if (viewModel.selectItem) {
                            return html`
                                <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    ${viewModel.selectItem.label}
                                    <button class="btn btn-outline-danger ms-auto" style="height: 35px;width: 100px;"
                                            onclick="${gvc.event(() => {
                                                function checkValue(check: any) {
                                                    let data: any = []
                                                    check.map((dd: any) => {
                                                        if (dd.id !== viewModel.selectItem.id) {
                                                            data.push(dd)
                                                        }
                                                        if (dd.type === 'container') {
                                                            dd.data.setting = checkValue(dd.data.setting ?? [])
                                                        }
                                                    })
                                                    return data
                                                }

                                                viewModel.globalStyleTag = checkValue(viewModel.globalStyleTag)
                                                viewModel.selectItem = undefined
                                                gvc.notifyDataChange([vid, docID])
                                            })}">
                                        <i class="fa-light fa-circle-minus me-2"></i>移除標籤
                                    </button>
                                </div>
                                ${gvc.bindView(() => {
                                    return {
                                        bind: `htmlGenerate`,
                                        view: () => {
                                            return (viewModel.selectItem.type === 'container') ? EditorElem.editeInput({
                                                gvc: gvc,
                                                title: `${((viewModel.selectItem.type === 'container') ? `分類` : `標籤`)}名稱`,
                                                default: viewModel.selectItem.label ?? "",
                                                placeHolder: `請輸入${((viewModel.selectItem.type === 'container') ? `分類` : `標籤`)}名稱`,
                                                callback: (text) => {
                                                    viewModel.selectItem.label = text
                                                    gvc.notifyDataChange([vid, docID])
                                                }
                                            }) : `` + ((viewModel.selectItem.type === 'container') ? `` : (() => {
                                                        viewModel.selectItem.data.tagType = viewModel.selectItem.data.tagType ?? "value"
                                                        if (typeof viewModel.selectItem.data.value !== 'object') {
                                                            viewModel.selectItem.data.value = {}
                                                        }
                                                        const data = [EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: `標籤名稱`,
                                                            default: viewModel.selectItem.data.tag ?? "",
                                                            placeHolder: `請輸入標籤名`,
                                                            callback: (text) => {
                                                                viewModel.selectItem.data.tag = text
                                                                viewModel.selectItem.label = text
                                                                gvc.notifyDataChange([vid, docID])
                                                            }
                                                        }), `<div class="mx-n2">${styleEditor(gvc, viewModel.selectItem.data.value)}</div>`]

                                                        return data.join('')
                                                    })()
                                            )
                                        },
                                        divCreate: {
                                            class: `p-2`, style: `overflow-y:auto;max-height:calc(100vh - 270px);`
                                        },
                                        onCreate: () => {
                                            setTimeout(() => {
                                                $('#jumpToNav').scrollTop(parseInt(glitter.getCookieByName('jumpToNavScroll'), 10) ?? 0)
                                            }, 1000)
                                        }
                                    };
                                })}
                                <div class="flex-fill"></div>
                                <div class=" d-flex border-top align-items-center mb-n1 py-2 pt-2 mx-n2 pe-3 bgf6"
                                     style="height:50px;">
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c me-n2" style="height: 40px;width: 100px;"
                                            onclick="${gvc.event(() => {
                                                glitter.share.selectStyleCallback(viewModel.selectItem.data.tag)
                                            })}">
                                        <i class="fa-regular fa-circle-plus me-2"></i>
                                        選擇標籤
                                    </button>
                                </div>
                            `
                        } else {
                            return html`
                                <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    說明描述
                                </div>
                                <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                     style="height:calc(100% - 48px);">
                                    <lottie-player src="lottie/animation_cdd.json" class="mx-auto my-n4" speed="1"
                                                   style="max-width: 100%;width: 250px;height:300px;" loop
                                                   autoplay></lottie-player>
                                    <h3 class=" text-center px-4" style="font-size:18px;">透過設定STYLE標籤，來決定頁面的統一樣式。
                                    </h3>
                                </div>
                            `

                        }


                    },
                    divCreate: () => {
                        return {
                            class: ` h-100 p-2 d-flex flex-column`, style: `width:400px;`
                        }
                    },
                    onCreate: () => {
                    }
                }
            })
        })
    })
}

//
function styleEditor(gvc: GVC, styleData: any, classs: string = 'mx-2') {
    styleData.stylist = styleData.stylist ?? []
    const glitter = gvc.glitter;
    const vm: {
        select: string,
        pageID: string,
        selectData: string
    } = {
        select: 'class',
        pageID: gvc.glitter.getUUID(),
        selectData: 'def'
    }

    function refreshView() {
        gvc.notifyDataChange(vm.pageID)
    }

    styleData.stylist.map((dd:any,index:number)=>{
        if(document.querySelector('#editerCenter')!.clientWidth>parseInt(dd.size)){
            vm.selectData=`${index}`
        }
    })
    function editIt(gvc: GVC, data: any) {
        data.class = (data.class ?? "").trim()
        data.style = (data.style ?? "").trim()
        let array = [html`
            <div class="mx-2 mb-2">
                <h3 style="color: black;font-size: 15px;margin-bottom: 10px;" class="fw-500 mt-2">尺寸樣式</h3>
                <div class="d-flex">
                    <select class="form-select d-flex"
                            style="max-height:100%;border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
                            onchange="${
                                    gvc.event((e, event) => {
                                        vm.selectData = e.value;
                                        refreshView()
                                    })
                            }">
                        <option value="def" ${(vm.selectData === 'def') ? `selected` : ``}>
                            預設樣式
                        </option>
                        ${styleData.stylist.map((dd: any, index: number) => {
                            return ` <option value="${index}" ${(vm.selectData === `${index}`) ? `selected` : ``}>
                            寬度${dd.size}
                        </option>`
                        })}
                    </select>
                    <div class="hoverBtn ms-auto d-flex align-items-center justify-content-center   border" style="height:44px;width:44px;cursor:pointer;color:#151515;
                                                         border-left: none;
border-radius: 0px 10px 10px 0px;" data-bs-toggle="tooltip" data-bs-placement="top"
                         data-bs-custom-class="custom-tooltip" data-bs-title="編輯尺寸" onclick="${gvc.event(() => {
                        EditorElem.openEditorDialog(gvc, (gvc) => {
                            return EditorElem.arrayItem({
                                gvc: gvc,
                                title: '設定裝置尺寸',
                                array: () => {
                                    return styleData.stylist.map((dd: any) => {
                                        return {
                                            title: `<div class="d-flex align-items-center">寬度:<input class="form-control ms-2 ps-2" style="height:30px;" type="number" value="${dd.size}" onchange="${gvc.event((e,event)=>{
                                                dd.size=parseInt(e.value)
                                            })}"></div>`,
                                            innerHtml: (gvc: GVC) => {
                                                return []
                                            },
                                            width: '600px'
                                        }
                                    })
                                },
                                originalArray: styleData.stylist,
                                expand: {},
                                customEditor: true,
                                plus: {
                                    title: "新增尺寸",
                                    event: gvc.event(() => {
                                        styleData.stylist.push({
                                            size: 480,
                                            style: ``,
                                            class: ``
                                        })
                                        gvc.recreateView()
                                    })
                                },
                                refreshComponent: () => {
                                    gvc.notifyDataChange(vm.pageID)
                                }
                            })
                        }, () => {
                            refreshView()
                        }, 400, '尺寸編輯')
                    })}">
                        <i class="fa-regular fa-gear"></i>
                    </div>
                </div>
            </div>`, gvc.bindView(() => {
            data.classDataType = data.classDataType ?? "static"
            return {
                bind: gvc.glitter.getUUID(),
                view: () => {

                    return html`
                        <div class="w-100 mt-n2" style="">
                            <div class="d-flex align-items-center justify-content-around w-100 p-2">
                                ${[
                                    {
                                        title: 'ClASS樣式設定',
                                        value: 'class',
                                        icon: 'fa-solid fa-c'
                                    },
                                    {
                                        title: 'STYLE樣式設定',
                                        value: 'style',
                                        icon: 'fa-solid fa-s'
                                    },
                                    {
                                        title: '檔案上傳',
                                        value: 'file',
                                        icon: 'fa-solid fa-upload'
                                    },
                                ].map((dd) => {
                                    return html`
                                        <div class=" d-flex align-items-center justify-content-center ${(dd.value === vm.select) ? `border` : ``} rounded-3"
                                             style="height:36px;width:36px;cursor:pointer;
${(dd.value === vm.select) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : `color:#151515;`}
"
                                             onclick="${gvc.event(() => {
                                                 if (dd.value === 'file') {
                                                     glitter.ut.chooseMediaCallback({
                                                         single: true,
                                                         accept: '*',
                                                         callback(data: any) {
                                                             const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                                                             const dialog = new ShareDialog(gvc.glitter);
                                                             dialog.dataLoading({visible: true});
                                                             const file = data[0].file;
                                                             saasConfig.api.uploadFile(file.name).then((data: any) => {
                                                                 dialog.dataLoading({visible: false});
                                                                 const data1 = data.response;
                                                                 dialog.dataLoading({visible: true});
                                                                 $.ajax({
                                                                     url: data1.url,
                                                                     type: 'put',
                                                                     data: file,
                                                                     headers: {
                                                                         "Content-Type": data1.type
                                                                     },
                                                                     processData: false,
                                                                     crossDomain: true,
                                                                     success: () => {
                                                                         dialog.dataLoading({visible: false});
                                                                         navigator.clipboard.writeText(data1.fullUrl);
                                                                         dialog.successMessage({
                                                                             text: "已將檔案連結複製至剪貼簿"
                                                                         })
                                                                     },
                                                                     error: () => {
                                                                         dialog.dataLoading({visible: false});
                                                                         dialog.errorMessage({text: '上傳失敗'});
                                                                     },
                                                                 });
                                                             });
                                                         },
                                                     });
                                                 } else {
                                                     vm.select = dd.value
                                                     gvc.notifyDataChange(vm.pageID)
                                                 }
                                             })}"
                                             data-bs-toggle="tooltip" data-bs-placement="top"
                                             data-bs-custom-class="custom-tooltip"
                                             data-bs-title="${dd.title}">
                                            <i class="${dd.icon}" aria-hidden="true"></i>
                                        </div>`
                                }).join(``)}
                            </div>
                        </div>`
                },
                divCreate: {
                    class: `d-flex bg-white mx-n3 border-bottom`,
                },
                onCreate: () => {
                    $('.tooltip')!.remove();
                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                }
            }
        })];
        if (vm.select === 'class') {
            array.push(`<div style="color: black;font-size: 16px;background: #f6f6f6;" class="fw-bold mx-n2 py-2 px-3">
                                CLASS參數設置</div>`)
            array.push(gvc.bindView(() => {
                const id = glitter.getUUID()
                data.classDataType = data.classDataType ?? "static"
                return {
                    bind: id,
                    view: () => {
                        return [
                            EditorElem.select({
                                title: "設定參數資料來源",
                                gvc: gvc,
                                def: data.classDataType,
                                array: [
                                    {
                                        title: '靜態來源',
                                        value: 'static'
                                    },
                                    {
                                        title: '程式碼',
                                        value: 'code'
                                    },
                                    {
                                        title: '觸發事件',
                                        value: 'triggerEvent'
                                    }
                                ],
                                callback: (text) => {
                                    data.classDataType = text
                                    gvc.notifyDataChange(id)
                                }
                            }),
                            `<div class="mt-2"></div>`,
                            (() => {
                                if (data.classDataType === 'static') {
                                    return EditorElem.editeText({
                                        gvc: gvc,
                                        default: data.class,
                                        title: ``,
                                        placeHolder: ``,
                                        callback: (text) => {
                                            data.class = text
                                        }
                                    })
                                } else if (data.classDataType === 'triggerEvent') {
                                    data.trigger = data.trigger ?? {}
                                    return TriggerEvent.editer(gvc, data as any, data.trigger, {
                                        hover: false,
                                        option: [],
                                        title: '觸發事件'
                                    })
                                } else {
                                    return EditorElem.codeEditor({
                                        gvc: gvc,
                                        height: 300,
                                        initial: data.class,
                                        title: ``,
                                        callback: (text) => {
                                            data.class = text
                                        }
                                    })
                                }
                            })()
                        ].join('')
                    },
                    divCreate: {
                        class: `  px-2 mt-0 py-1 `,
                        style: ``
                    }
                }
            }))
        }
        if (vm.select === 'style') {
            array.push(`<div style="color: black;font-size: 16px;background: #f6f6f6;" class="fw-bold mx-n2 py-2 px-3">
                                STYLE參數設置</div>`)
            array.push(gvc.bindView(() => {
                const id = glitter.getUUID()
                data.dataType = data.dataType ?? "static"
                return {
                    bind: id,
                    view: () => {
                        return [
                            EditorElem.select({
                                title: "設定參數資料來源",
                                gvc: gvc,
                                def: data.dataType,
                                array: [
                                    {
                                        title: '靜態來源',
                                        value: 'static'
                                    },
                                    {
                                        title: '程式碼',
                                        value: 'code'
                                    },
                                    {
                                        title: '觸發事件',
                                        value: 'triggerEvent'
                                    }
                                ],
                                callback: (text) => {
                                    data.dataType = text
                                    gvc.notifyDataChange(id)
                                }
                            }),
                            `<div class="mt-2"></div>`,
                            (() => {
                                if (data.dataType === 'static') {
                                    return EditorElem.styleEditor({
                                        gvc: gvc,
                                        height: 300,
                                        initial: data.style,
                                        title: ``,
                                        callback: (text) => {
                                            data.style = text
                                        }
                                    })
                                } else if (data.dataType === 'triggerEvent') {
                                    data.triggerStyle = data.triggerStyle ?? {}
                                    return TriggerEvent.editer(gvc, data as any, data.triggerStyle, {
                                        hover: false,
                                        option: [],
                                        title: '觸發事件'
                                    })
                                } else {
                                    return EditorElem.codeEditor({
                                        gvc: gvc,
                                        height: 300,
                                        initial: data.style,
                                        title: ``,
                                        callback: (text) => {
                                            data.style = text
                                        }
                                    })
                                }
                            })()
                        ].join('')
                    },
                    divCreate: {
                        class: `  px-2 mt-0 py-1 `,
                        style: ``
                    }
                }
            }))
        }

        return array.join('')
    }

    return html`
        ${gvc.bindView(() => {
            return {
                bind: vm.pageID,
                view: () => {
                    if (!((vm.selectData === 'def') ? styleData : styleData.stylist[parseInt(vm.selectData)])) {
                        vm.selectData = 'def'
                    }
                    return editIt(gvc, (vm.selectData === 'def') ? styleData : styleData.stylist[parseInt(vm.selectData)])
                },
                divCreate: {
                    class: `position-relative`
                }
            }
        })}
    `
}


class Render {
    public gvc: GVC
    public vid: string

    public editorID: string

    public renderLineItem(array: any, child: boolean, original: any, option: {
        addComponentView?: (gvc: GVC, callback?: (data: any) => void) => string,
        copyType?: 'directly',
        readonly?: boolean,
        selectEvent?: string,
        selectEv?: (dd: any) => boolean
    } = {}) {
        const gvc = this.gvc
        const glitter = gvc.glitter
        const vid = this.vid
        const viewModel = gvc.glitter.share.editorViewModel
        const parId = gvc.glitter.getUUID()
        const swal = new Swal(gvc);
        const dragModel: {
            draggableElement: string,
            dragOffsetY: number,
            dragStart: number,
            maxHeight: number,
            editor_item: any[],
            hover_item: any[],
            currentIndex: number,
            firstIndex: number
            changeIndex: number
        } = {
            draggableElement: '',
            dragOffsetY: 0,
            dragStart: 0,
            maxHeight: 0,
            editor_item: [],
            hover_item: [],
            currentIndex: 0,
            changeIndex: 0,
            firstIndex: 0
        }
        const mup_Linstener = function (event: MouseEvent) {
            // 更新页面上的文本显示滑鼠放開狀態
            if (dragModel.draggableElement) {
                dragModel.currentIndex = (dragModel.currentIndex > array.length) ? array.length - 1 : dragModel.currentIndex
                // alert(`${array[dragModel.firstIndex].index}-${array[dragModel.currentIndex].index}`)
                $('.select_container').toggleClass('select_container')
                document.getElementById(dragModel.draggableElement)!.remove()
                dragModel.draggableElement = ''


                swapArr(original, array[dragModel.firstIndex].index, array[(dragModel.currentIndex > 0) ? dragModel.currentIndex - 1 : 0].index);
                // swapArr(array, dragModel.firstIndex, ((dragModel.currentIndex - 1 < dragModel.firstIndex) && (dragModel.currentIndex + 1 < array.length)) ? dragModel.currentIndex : (dragModel.currentIndex >= 0) ? dragModel.currentIndex - 1 : 0)
                gvc.notifyDataChange([vid, 'htmlGenerate', 'showView'])
            }
            document.removeEventListener('mouseup', mup_Linstener)
            document.removeEventListener('mousemove', move_Linstener)
        }
        const move_Linstener = function (event: MouseEvent) {
            if (!dragModel.draggableElement) {
                return
            }
            let off = event.clientY - dragModel.dragStart + dragModel.dragOffsetY
            if (off < 5) {
                off = 5
            } else if (off > dragModel.maxHeight) {
                off = dragModel.maxHeight
            }
            console.log(`offsetY`, off)

            function findClosestNumber(ar: any, target: any) {
                if (ar.length === 0) return null;
                const arr = JSON.parse(JSON.stringify(ar))
                let index = 0
                let closest = arr[0];
                arr.push(ar[ar.length - 1] + 34)
                let minDifference = Math.abs(target - closest);
                for (let i = 1; i < arr.length; i++) {
                    const difference = Math.abs(target - arr[i]);
                    if (difference < minDifference) {
                        closest = arr[i];
                        index = i
                        minDifference = difference;
                    }
                }
                return index;
            }

            let closestNumber: number = findClosestNumber(dragModel.hover_item.map((dd, index) => {
                return (34 * index + 1) - 17;
            }), off) as number;
            console.log(`closestNumber`, closestNumber)
            dragModel.changeIndex = (closestNumber as number)
            dragModel.currentIndex = (closestNumber as number)
            $('.editor_item.hv').remove();
            if (dragModel.currentIndex == array.length) {
                $('.select_container').append(`<div class="editor_item active hv"></div>`)
            } else if (dragModel.currentIndex == 1) {
                $('.select_container').prepend(`<div class="editor_item active hv"></div>`)
            } else {
                const parentElement = document.getElementsByClassName("select_container")[0];
                const referenceElement = dragModel.hover_item[dragModel.currentIndex].elem.get(0);
                const newElement = document.createElement("div", {});
                newElement.classList.add("editor_item")
                newElement.classList.add("active")
                newElement.classList.add("hv")
                newElement.textContent = "";
                parentElement.insertBefore(newElement, referenceElement);
            }
            $(`#${dragModel.draggableElement}`).css("position", "absolute");
            $(`#${dragModel.draggableElement}`).css("right", "0px");
            $(`#${dragModel.draggableElement}`).css("top", off + "px");
        }

        return gvc.bindView(() => {
            return {
                bind: parId,
                view: () => {
                    return array.map((dd: any, index: number) => {

                        dd.selectEditEvent = () => {
                            if (!glitter.share.inspect) {
                                return false
                            }
                            viewModel.selectContainer = original
                            viewModel.selectItem = dd
                            Storage.lastSelect=dd.id;
                            gvc.notifyDataChange([vid, this.editorID])
                            return true
                        }
                        let toggle = gvc.event((e, event) => {
                            dd.toggle = !dd.toggle
                            if ((() => {
                                return dd.type === 'container' && checkChildSelect(dd.data.setting)
                            })() && !dd.toggle) {
                                viewModel.selectItem = undefined
                            }
                            gvc.notifyDataChange(parId)
                            event.preventDefault()
                            event.stopPropagation()
                        })
                        const checkChildSelect = (setting: any) => {
                            for (const b of setting) {
                                if (b === viewModel.selectItem || (option.selectEv && option.selectEv(b))) {
                                    return true
                                }
                                if (b.data && b.data.setting && checkChildSelect(b.data.setting)) {
                                    return true
                                }
                            }
                            return false;
                        }
                        let selectChild = (() => {
                            return dd.type === 'container' && checkChildSelect(dd.data.setting)
                        })()
                        if (selectChild) {
                            dd.toggle = true
                        }
                        return html`
                                    <l1 class="btn-group "
                                        style="margin-top:1px;margin-bottom:1px;">
                                        <div class="editor_item d-flex   px-2 my-0 hi me-n1 ${(viewModel.selectItem === dd || selectChild || (option.selectEv && option.selectEv(dd))) ? `active` : ``}"
                                             style=""
                                             onclick="${option.selectEvent || gvc.event(() => {
                                                 viewModel.selectContainer = original
                                                 viewModel.selectItem = dd
                                                 Storage.lastSelect=dd.id;
                                                 gvc.notifyDataChange(['htmlGenerate', 'showView', vid, this.editorID]);
                                             })}">
                                            ${(dd.type === 'container') ? html`
                                                <div class="subBt ps-0 ms-n2" onclick="${toggle}">
                                                    ${((dd.toggle) ? `<i class="fa-regular fa-angle-down hoverBtn " ></i>` : `
                                                                        <i class="fa-regular fa-angle-right hoverBtn " ></i>
                                                                        `)}
                                                </div>` : ``}
                                            ${dd.label}
                                            <div class="flex-fill"></div>
                                            ${(dd.type === 'container') ? ` <l1 class="btn-group me-0 subBt"
                                                                                style=""
                                                                                onclick="${gvc.event((e, event) => {
                                                dd.data.setting = dd.data.setting ?? []
                                                viewModel.selectContainer = dd.data.setting
                                                event.stopPropagation()
                                                event.preventDefault()
                                            })}">
                                                                                ${(option.addComponentView) ? `
                                                                                    <div class="${(option.readonly) ? `d-none` : ``}"
                                     style="cursor:pointer;gap:5px;"
                                     data-bs-toggle="dropdown"
                                     aria-haspopup="true"
                                     aria-expanded="false">
                                    <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt "></i>
                                </div>
                                                                                  <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                     style="z-index:999999;"
                                     onclick="${gvc.event((e, event) => {
                                                event.preventDefault()
                                                event.stopPropagation()

                                            })}">
                                    ${option.addComponentView(gvc, (response) => {
                                                dd.data.setting.push(response)
                                                dd.toggle = true
                                                gvc.notifyDataChange(parId)
                                            })}
                                </div>
                                                                                ` : ` <div class="d-flex align-items-center justify-content-center w-100 h-100 ${(option.readonly) ? `d-none` : ``}" 
                                                                                   onclick="${gvc.event(() => {
                                                glitter.innerDialog((gvc: GVC) => {
                                                    viewModel.selectContainer = dd.data.setting
                                                    return Add_item_dia.view(gvc)
                                                }, 'Add_item_dia')
                                            })}">
                                                                                    <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt "></i>
                                                                                </div>`}
                                                                               
                                                                            </l1>` : ``}
                                            <div class="subBt ${(option.readonly) ? `d-none` : ``}"
                                                 onclick="${gvc.event((e, event) => {
                                                     if (option.copyType === 'directly') {
                                                         const copy = JSON.parse(JSON.stringify(dd))
                                                         copy.id = glitter.getUUID()
                                                         viewModel.selectContainer = array
                                                         viewModel.selectItem = copy
                                                         original.push(copy)
                                                         gvc.notifyDataChange([vid])
                                                     } else {
                                                         viewModel.selectContainer = array
                                                         viewModel.waitCopy = dd
                                                         glitter.share.copycomponent = JSON.stringify(viewModel.waitCopy);
                                                         navigator.clipboard.writeText(JSON.stringify(viewModel.waitCopy));
                                                         swal.toast({
                                                             icon: 'success',
                                                             title: "已複製至剪貼簿，選擇新增模塊來添加項目．"
                                                         })
                                                     }

                                                     event.stopPropagation()
                                                 })}">
                                                <i class="fa-sharp fa-regular fa-scissors d-flex align-items-center justify-content-center subBt "
                                                   style="width:15px;height:15px;"
                                                ></i>
                                            </div>
                                            ${(dd.type === 'container') ? html`
                                                <div class="subBt d-none"
                                                     onclick="${gvc.event((e, event) => {
                                                         viewModel.selectContainer = original.find((d2: any) => {
                                                             return d2.id === dd.id
                                                         }).data.setting
                                                         glitter.share.pastEvent()
                                                         event.stopPropagation()
                                                         event.preventDefault()
                                                     })}">
                                                    <i class="fa-duotone fa-paste d-flex align-items-center justify-content-center subBt"
                                                       style="width:15px;height:15px;"
                                                    ></i>
                                                </div>
                                            ` : ``}

                                            <div class="subBt ${(option.readonly) ? `d-none` : ``}" onmousedown="${
                                                    gvc.event((e, event) => {
                                                        dragModel.firstIndex = index
                                                        dragModel.currentIndex = index
                                                        dragModel.draggableElement = glitter.getUUID()
                                                        dragModel.dragStart = event.clientY
                                                        dragModel.dragOffsetY = $(e).parent().parent().get(0).offsetTop;
                                                        dragModel.maxHeight = ($(e).parent().parent().parent().height() as number);
                                                        $(e).parent().addClass('d-none')
                                                        dragModel.hover_item = []
                                                        $(e).parent().parent().append(`<div class="editor_item active  hv"></div>`)
                                                        $(e).parent().parent().parent().addClass('select_container')
                                                        $('.select_container').children().each(function (index) {
                                                            // 在這裡執行對每個 li 元素的操作
                                                            if ($(this).get(0)!.offsetTop > 0) {
                                                                dragModel.hover_item.push({
                                                                    elem: $(this),
                                                                    offsetTop: $(this).get(0)!.offsetTop
                                                                })
                                                            }

                                                        });
                                                        console.log(`hover_item`, dragModel.hover_item)
                                                        $(e).parent().parent().parent().append(html`
                                                            <l1 class="btn-group position-absolute  "
                                                                style="width:${($(e).parent().parent().width() as any) - 50}px;right:15px;top:${dragModel.dragOffsetY}px;z-index:99999;border-radius:10px;background:white!important;"
                                                                id="${dragModel.draggableElement}">
                                                                <div class="editor_item d-flex   px-2 my-0"
                                                                     style="background:white!important;">
                                                                    ${dd.label}
                                                                    <div class="flex-fill"></div>
                                                                    <i class="d-none fa-solid fa-pencil d-flex align-items-center justify-content-center subBt"
                                                                       style="width:20px;height:20px;"></i>
                                                                    <i class="d-none fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center subBt"
                                                                       style="width:20px;height:20px;"></i>
                                                                </div>
                                                            </l1>`)
                                                        document.addEventListener("mouseup", mup_Linstener);
                                                        document.addEventListener("mousemove", move_Linstener);
                                                    })}">
                                                <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                                   style="width:15px;height:15px;"></i>
                                            </div>

                                        </div>
                                    </l1>` +
                            (() => {
                                if (dd.type === 'container') {
                                    if (dd.data.setting.length === 0) {
                                        return ``
                                    } else {


                                        checkChildSelect(dd.data.setting)
                                        return `<l1 class="${(dd.toggle || (checkChildSelect(dd.data.setting))) ? `` : `d-none`}" style="padding-left:5px;">${this.renderLineItem(dd.data.setting.map((dd: any, index: number) => {
                                            dd.index = index
                                            return dd
                                        }), true, dd.data.setting, option)}</l1>`
                                    }
                                } else {
                                    return ``
                                }
                            })()
                    }).join('')
                },
                divCreate: {
                    class: `d-flex flex-column ${(child) ? `` : ``} position-relative border-bottom`,
                },
                onDestroy: () => {
                }
            }
        })
    }

    public constructor(gvc: GVC, vid: string, editorID: string = '') {
        this.gvc = gvc
        this.vid = vid
        this.editorID = editorID
    }
}

function swapArr(arr: any, index1: number, index2: number) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}