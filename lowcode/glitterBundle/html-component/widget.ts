import {HtmlJson, Plugin} from "../plugins/plugin-creater.js";
import {GVC} from "../GVController.js";
import {TriggerEvent} from "../plugins/trigger-event.js";
import {EditorElem} from "../plugins/editor-elem.js";
//@ts-ignore
import autosize from "../plugins/autosize.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {Storage} from "../helper/storage.js";
import {NormalPageEditor} from "../../editor/normal-page-editor.js";
import {GlobalWidget} from "./global-widget.js";
import {RenderValue} from "./render-value.js";


export const widgetComponent = {
    render: (gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], sub: any, htmlGenerate: any, document?: any) => {
        const rootHtmlGenerate = htmlGenerate;
        const glitter = gvc.glitter;
        const subData = sub ?? {};
        let formData = subData;
        const id = htmlGenerate.widgetComponentID
        RenderValue.custom_style.initialWidget(widget);
        const view_container_id = widget.id;


        return {
            view: () => {
                widget.refreshComponent=()=>{
                    (widget as any).refreshComponentParameter.view1();
                    (widget as any).refreshComponentParameter.view2();
                }
                (widget as any).refreshComponentParameter.view1=()=>{
                    gvc.notifyDataChange(id)
                }

                return GlobalWidget.showCaseData({
                    gvc: gvc,
                    widget: widget,
                    view: (widget) => {
                        try {
                            let innerText = (() => {
                                if ((widget.data.dataFrom === "code") || (widget.data.dataFrom === "code_text")) {
                                    return ``
                                } else {
                                    return widget.data.inner;
                                }
                            })()

                            function getCreateOption() {
                                let option = widget.data.attr.map((dd: any) => {
                                    if (dd.type === 'par') {
                                        try {
                                            if (dd.valueFrom === 'code') {
                                                return {
                                                    key: dd.attr, value: eval(`(() => {
                                                        ${dd.value}
                                                    })()`)
                                                }
                                            } else {
                                                return {key: dd.attr, value: dd.value}
                                            }

                                        } catch (e) {
                                            return {key: dd.attr, value: dd.value}
                                        }
                                    } else if (dd.type === 'append') {
                                        return {
                                            key: glitter.promiseValue(new Promise((resolve, reject) => {
                                                TriggerEvent.trigger({
                                                    gvc: gvc,
                                                    widget: widget,
                                                    clickEvent: dd,
                                                    subData: subData
                                                }).then((data) => {
                                                    if (data) {
                                                        resolve(dd.attr)
                                                    }
                                                })
                                            })), value: ''
                                        }
                                    } else {
                                        return {
                                            key: dd.attr, value: gvc.event((e, event) => {
                                                event.stopPropagation();
                                                TriggerEvent.trigger({
                                                    gvc: gvc,
                                                    widget: widget,
                                                    clickEvent: dd,
                                                    element: {e, event},
                                                    subData: subData
                                                }).then((data) => {
                                                })
                                            })
                                        }
                                    }
                                })
                                if (widget.data.elem === 'a' && ((window.parent as any).editerData !== undefined)) {
                                    option = option.filter((dd: any) => {
                                        return dd.key !== 'href'
                                    })
                                }
                                if (widget.data.elem === 'img') {
                                    //判斷是新版響應式連結
                                    let rela_link = innerText
                                    if (innerText.includes(`size1440_s*px$_`)) {
                                        [150, 600, 1200, 1440].reverse().map((dd) => {
                                            if (document.body.clientWidth < dd) {
                                                rela_link = innerText.replace('size1440_s*px$_', `size${dd}_s*px$_`)
                                            }
                                        })
                                    }
                                    option.push({key: 'src', value: rela_link})
                                } else if (widget.data.elem === 'input') {
                                    option.push({key: 'value', value: innerText})
                                }
                                let classList = []
                                if (((((window.parent as any).editerData !== undefined) || ((window as any).editerData !== undefined)) && htmlGenerate.root)) {
                                    classList.push(`editorParent`)
                                    classList.push(`relativePosition`)
                                    classList.push(view_container_id)
                                }
                                classList.push(glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).class())
                                widget.hashTag && classList.push(`glitterTag${widget.hashTag}`);
                                let style_user = ''
                                if (widget.type === 'container'  ) {
                                    style_user = RenderValue.custom_style.value(gvc, widget)
                                    style_user += RenderValue.custom_style.container_style(gvc,widget);
                                }
                                return {
                                    elem: widget.data.elem,
                                    class: classList.join(' '),
                                    style: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).style() + ` ${((window.parent as any).editerData !== undefined) ? `${((widget as any).visible === false) ? `display:none;` : ``}` : ``} ${style_user}`,
                                    option: option.concat(htmlGenerate.option),
                                }
                            }

                            if (widget.type === 'container') {
                                const glitter = (window as any).glitter
                                widget.data.setting.formData = widget.formData;

                                function getView() {
                                    const chtmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID, subData, rootHtmlGenerate.root);
                                    innerText = '';
                                    return chtmlGenerate.render(gvc, {
                                        containerID: id,
                                        tag: (widget as any).tag,
                                        onCreate: () => {
                                            gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).onResumeEvent = () => {
                                                TriggerEvent.trigger({
                                                    gvc,
                                                    widget: widget as any,
                                                    clickEvent: (widget as any).onResumtEvent,
                                                    subData: subData
                                                })
                                            }
                                            setTimeout(() => {
                                                if ((widget.data._layout === 'grid' || widget.data._layout === 'vertical') && (((gvc.glitter.window.parent as any).editerData !== undefined) || ((gvc.glitter.window as any).editerData !== undefined)) && htmlGenerate.root) {
                                                    const html = String.raw
                                                    const tempID = gvc.glitter.getUUID()

                                                    function rerenderReplaceElem() {
                                                        gvc.glitter.$('.' + tempID).remove();
                                                        widget.data.setting.need_count = parseInt(widget.data._x_count, 10) * parseInt(widget.data._y_count, 10);
                                                        if(widget.data._layout === 'vertical'){
                                                            widget.data.setting.need_count=1
                                                        }
                                                        for (let b = widget.data.setting.length; b < widget.data.setting.need_count; b++) {
                                                            gvc.glitter.$(`.editor_it_${id}`).append(
                                                                html`
                                                                    <div
                                                                            class="d-flex align-items-center justify-content-center flex-column rounded-3 w-100 py-3 ${tempID}"
                                                                            style="background: lightgrey;color: #393939;cursor: pointer;min-height: 100px;left: 0px;top:0px;width: 100%;height: 100%;"
                                                                            onmousedown="${gvc.event(() => {
                                                                                glitter.getModule(new URL(gvc.glitter.root_path + 'editor/add-component.js').href, (AddComponent: any) => {
                                                                                    glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                                    AddComponent.toggle(true);
                                                                                    AddComponent.addWidget = (gvc: GVC, cf: any) => {
                                                                                        (window.parent as any).glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                                        (window.parent as any).glitter.share.addComponent(cf);
                                                                                        AddComponent.toggle(false);
                                                                                    };
                                                                                    AddComponent.addEvent = (gvc: GVC, tdata: any) => {
                                                                                        (window.parent as any).glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                                        (window.parent as any).glitter.share.addComponent({
                                                                                            id: gvc.glitter.getUUID(),
                                                                                            js: './official_view_component/official.js',
                                                                                            css: {
                                                                                                class: {},
                                                                                                style: {},
                                                                                            },
                                                                                            data: {
                                                                                                refer_app: tdata.copyApp,
                                                                                                tag: tdata.copy,
                                                                                                list: [],
                                                                                                carryData: {},
                                                                                                _style_refer_global: {
                                                                                                    index: `0`,
                                                                                                },
                                                                                            },
                                                                                            type: 'component',
                                                                                            class: 'w-100',
                                                                                            index: 0,
                                                                                            label: tdata.title,
                                                                                            style: '',
                                                                                            bundle: {},
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            stylist: [],
                                                                                            dataType: 'static',
                                                                                            style_from: 'code',
                                                                                            classDataType: 'static',
                                                                                            preloadEvenet: {},
                                                                                            share: {},
                                                                                        });
                                                                                        AddComponent.toggle(false);
                                                                                    };
                                                                                });
                                                                            })}"
                                                                    >
                                                                        <i class="fa-regular fa-circle-plus text-black"
                                                                           style="font-size: 60px;"></i>
                                                                        <span class="fw-500 fs-5 mt-3">添加元件</span>
                                                                    </div>`
                                                            );

                                                        }
                                                    }

                                                    widget.data.setting.rerenderReplaceElem = rerenderReplaceElem
                                                    rerenderReplaceElem()
                                                }
                                            }, 200)
                                            TriggerEvent.trigger({
                                                gvc,
                                                widget: widget as any,
                                                clickEvent: (widget as any).onCreateEvent,
                                                subData: subData,
                                                element: gvc.getBindViewElem(id).get(0)
                                            })
                                        },
                                        onDestroy: () => {
                                            TriggerEvent.trigger({
                                                gvc,
                                                widget: widget as any,
                                                clickEvent: (widget as any).onDestoryEvent,
                                                subData: subData
                                            })
                                        },
                                        onInitial: () => {
                                            TriggerEvent.trigger({
                                                gvc,
                                                widget: widget as any,
                                                clickEvent: (widget as any).onInitialEvent,
                                                subData: subData
                                            })
                                        },
                                        app_config: widget.global.appConfig,
                                        page_config: widget.global.pageConfig,
                                        document: document,
                                        editorSection: widget.id,
                                        origin_widget:widget
                                    }, getCreateOption)
                                }

                                widget.data.setting.refresh = (() => {
                                    try {
                                        hoverID = [Storage.lastSelect];
                                        gvc.glitter.document.querySelector('.selectComponentHover') && gvc.glitter.document.querySelector('.selectComponentHover').classList.remove("selectComponentHover");
                                        gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = getView()
                                        setTimeout(() => {
                                            gvc.glitter.document.querySelector('.selectComponentHover').scrollIntoView({
                                                behavior: 'auto', // 使用平滑滾動效果
                                                block: 'center', // 將元素置中
                                            })
                                        }, 10)
                                    } catch (e) {

                                    }
                                });
                                return getView()
                            }
                            if ((widget.data.dataFrom === "code")) {
                                if (widget.data.elem !== 'select') {
                                    innerText = ''
                                }
                                widget.data.innerEvenet = widget.data.innerEvenet ?? {}
                                TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: widget.data.innerEvenet,
                                    subData
                                }).then((data) => {
                                    if (widget.data.elem === 'select') {
                                        formData[widget.data.key] = data
                                    }
                                    innerText = data || ''
                                    gvc.notifyDataChange(id)
                                })
                            } else if (widget.data.dataFrom === "code_text") {
                                const inner = (eval(`(() => {
                                    ${widget.data.inner}
                                })()`))
                                if (inner && inner.then) {

                                    inner.then((data: any) => {
                                        innerText = data || ''
                                        gvc.notifyDataChange(id)
                                    })
                                } else {
                                    innerText = inner
                                    gvc.notifyDataChange(id)
                                }
                            }
                            return gvc.bindView(() => {
                                return {
                                    bind: id,
                                    view: () => {

                                        let view: any = []
                                        switch (widget.data.elem) {
                                            case 'select':
                                                return new Promise(async (resolve, reject) => {
                                                    const vm: {
                                                        callback: () => void,
                                                        data: any
                                                    } = {
                                                        callback: () => {

                                                        },
                                                        data: []
                                                    }
                                                    await new Promise((resolve, reject) => {
                                                        if (widget.data.elem === 'select' && widget.data.selectType === 'api') {
                                                            widget.data.selectAPI = widget.data.selectAPI ?? {}
                                                            vm.callback = () => {
                                                                resolve(true)
                                                            }
                                                            TriggerEvent.trigger({
                                                                gvc: gvc,
                                                                widget: widget,
                                                                clickEvent: widget.data.selectAPI,
                                                                subData: vm
                                                            })
                                                            resolve(true)
                                                        } else {
                                                            resolve(true)
                                                        }
                                                    })
                                                    formData[widget.data.key] = innerText
                                                    if (widget.data.selectType === 'api') {
                                                        resolve(vm.data.map((dd: any) => {
                                                            formData[widget.data.key] = formData[widget.data.key] ?? dd.value
                                                            if (dd.visible === 'invisible' && (dd.value !== formData[widget.data.key])) {
                                                                return ``
                                                            }
                                                            return glitter.html`<option class="" value="${dd.value}" ${`${dd.value}` === `${formData[widget.data.key]}` ? `selected` : ``}>
                                ${dd.key}
                            </option>`;
                                                        }).join('') + `<option value="" ${formData[widget.data.key] === '' ? `selected` : ``}>
                                選擇${widget.data.label}
                            </option>`)
                                                    } else if (widget.data.selectType === 'trigger') {
                                                        const data = await TriggerEvent.trigger({
                                                            gvc: gvc,
                                                            widget: widget,
                                                            clickEvent: widget.data.selectTrigger,
                                                            subData: subData
                                                        })
                                                        const selectItem = await TriggerEvent.trigger({
                                                            gvc: gvc,
                                                            widget: widget,
                                                            clickEvent: widget.data.selectItem,
                                                            subData: subData
                                                        })

                                                        resolve((data as any).map((dd: any) => {
                                                            return /*html*/ `<option value="${dd.value}" ${`${dd.value}` === `${selectItem}` ? `selected` : ``}>
                                ${dd.name}
                            </option>
`;
                                                        }).join('') + `<option class="d-none" ${((data as any).find((dd: any) => {
                                                            return `${dd.value}` === `${selectItem}`
                                                        })) ? `` : `selected`}>請選擇</option>`)
                                                    } else {
                                                        resolve(widget.data.selectList.map((dd: any) => {
                                                            if (dd.visible === 'invisible' && (dd.value !== formData[widget.data.key])) {
                                                                return ``
                                                            }
                                                            formData[widget.data.key] = formData[widget.data.key] ?? dd.value
                                                            return /*html*/ `<option value="${dd.value}" ${dd.value === formData[widget.data.key] ? `selected` : ``}>
                                ${dd.name}
                            </option>`;
                                                        }).join(''))
                                                    }
                                                })
                                            case 'img':
                                            case 'input':
                                            case 'textArea':
                                                break
                                            default:
                                                view.push(innerText)
                                                break

                                        }
                                        if ((window.parent as any).editerData !== undefined && htmlGenerate.root && widget.data.elem !== 'textArea' ) {
                                            view.push(glitter.htmlGenerate.getEditorSelectSection({
                                                id: widget.id,
                                                gvc: gvc,
                                                label: widget.label,
                                                widget:widget
                                            }));
                                        }

                                        return view.join('')
                                    },
                                    divCreate: getCreateOption,
                                    onCreate: () => {

                                        // console.log(`elementCallback->`,glitter.elementCallback[gvc.id(id)].element)
                                        // let images = document.querySelectorAll(".branwdo");
                                        // lazyload(images);
                                        glitter.elementCallback[gvc.id(id)].updateAttribute()
                                        if (widget.data.elem.toLowerCase() === 'textarea') {
                                            const textArea = gvc.getBindViewElem(id).get(0)
                                            textArea.textContent = innerText;
                                            setTimeout(() => {
                                                textArea.style.height = textArea.scrollHeight + 'px';
                                                autosize(textArea)
                                            }, 100)

                                        }
                                        TriggerEvent.trigger({
                                            gvc,
                                            widget: widget as any,
                                            clickEvent: (widget as any).onCreateEvent,
                                            subData: subData,
                                            element: gvc.getBindViewElem(id).get(0)
                                        })
                                        gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).onResumeEvent = () => {
                                            TriggerEvent.trigger({
                                                gvc,
                                                widget: widget as any,
                                                clickEvent: (widget as any).onResumtEvent,
                                                subData: subData
                                            })
                                        }
                                    },
                                    onDestroy: () => {
                                        TriggerEvent.trigger({
                                            gvc,
                                            widget: widget as any,
                                            clickEvent: (widget as any).onDestoryEvent,
                                            subData: subData
                                        })
                                    },
                                    onInitial: () => {
                                        TriggerEvent.trigger({
                                            gvc,
                                            widget: widget as any,
                                            clickEvent: (widget as any).onInitialEvent,
                                            subData: subData
                                        })
                                    }
                                }
                            })
                        } catch (e) {
                            console.log(e)
                            return `${e}`
                        }
                    }
                })

            },
            editor: () => {

                if (widget.type === 'container' && Storage.select_function === 'user-editor' || localStorage.getItem('uasi') === 'user_editor') {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();

                        const vm:{
                            page:'editor'|'setting'
                        }={
                           get page(){
                               return Storage.page_setting_global
                           },
                           set page(vale){
                               Storage.page_setting_global=vale
                           }
                        }
                        const html=String.raw
                        return {
                            bind: id,
                            view: async () => {
                                const CustomStyle: any = await new Promise((resolve, reject) => {
                                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'glitterBundle/html-component/custom-style.js').href, (clas) => {
                                        resolve(clas)
                                    })
                                })
                                if(vm.page==='setting'){
                                    const oWidget:any=widget
                                    return       GlobalWidget.showCaseEditor({
                                        gvc: gvc,
                                        widget: widget,
                                        view: (widget,type) => {
                                            const setting_option = [
                                                {
                                                    title: "間距設定",
                                                    key: 'margin',
                                                    array: []
                                                },
                                                {
                                                    title: "容器背景設定",
                                                    key: 'background',
                                                    array: []
                                                },
                                                {
                                                    title: "開發者設定",
                                                    key: 'develop',
                                                    array: []
                                                }
                                            ].filter((dd: any) => {
                                                oWidget[`${type}_editable`]=oWidget[`${type}_editable`]??[]
                                                switch (dd.key) {
                                                    case 'style':
                                                    case 'color':
                                                        return (dd.array && dd.array.length > 0)
                                                    case 'background':
                                                       return  true
                                                    case 'margin':
                                                    case 'develop':
                                                       return  true
                                                }
                                            })
                                            // array.push(CustomStyle.editorMargin(gvc, widget))
                                               return [`<div
                                                                                                                class="px-3   border-bottom pb-3 fw-bold mt-n3  pt-3 hoverF2 d-flex align-items-center mx-n2"
                                                                                                                style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
                                                                                                                onclick="${gvc.event(() => {
                                                   vm.page = 'editor'
                                                   gvc.notifyDataChange(id)
                                               })}"
                                                                                                        >
                                                                                                            <i class="fa-solid fa-chevron-left"></i>
                                                                                                            <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">設定</span>
                                                                                                            <div class="flex-fill"></div>
                                                                                                        </div>`,setting_option.map((dd: any) => {
                                                return gvc.bindView(() => {
                                                    const vm_c: {
                                                        id: string,
                                                        toggle: boolean
                                                    } = {
                                                        id: gvc.glitter.getUUID(),
                                                        toggle: dd.toggle
                                                    };
                                                    (widget as any).refreshComponentParameter.view2=()=>{
                                                        gvc.notifyDataChange(vm_c.id)
                                                    }
                                                    return {
                                                        bind: vm_c.id,
                                                        view: () => {
                                                            const array_string = [html`
                                                                                                                                            <div class="hoverF2 d-flex align-items-center p-3"
                                                                                                                                                 onclick="${gvc.event(() => {
                                                                vm_c.toggle = !vm_c.toggle
                                                                gvc.notifyDataChange(vm_c.id)
                                                            })}">
<span class="fw-500"
      style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${dd.title}</span>
                                                                                                                                                <div class="flex-fill"></div>
                                                                                                                                                ${vm_c.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : ` <i class="fa-solid fa-chevron-right"></i>`}

                                                                                                                                            </div>`]

                                                            if (vm_c.toggle) {
                                                                switch (dd.key) {
                                                                    case 'margin':

                                                                        array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorMargin(gvc, widget, () => {
                                                                          
                                                                            gvc.notifyDataChange(vm_c.id)
                                                                            oWidget.refreshComponent()
                                                                        })}</div>`)
                                                                        break
                                                                    case 'background':
                                                                        array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorBackground(gvc, widget, () => {
                                                                            gvc.notifyDataChange(vm_c.id)
                                                                            oWidget.refreshComponent()
                                                                        })}</div>`)
                                                                        break
                                                                    case 'develop':
                                                                        array_string.push(`<div class="px-3">${CustomStyle.editor(gvc, widget, () => {
                                                                            gvc.notifyDataChange(vm_c.id)
                                                                            oWidget.refreshComponent()
                                                                        })}</div>`)
                                                                        break
                                                                }
                                                            }

                                                            return array_string.join('')
                                                        },
                                                        divCreate: {
                                                            class: `border-bottom mx-n2 `,
                                                            style: `cursor: pointer;color:#393939;border-radius: 0px;gap:10px;`
                                                        }
                                                    }
                                                })
                                            }).join('')].join('')
                                        }
                                    })


                                }
                                (widget as any).refreshComponentParameter.view2=()=>{
                                    gvc.notifyDataChange(id)
                                }
                                return [
                                    `<div
                                                                                                            class="px-3 mx-n2   border-bottom pb-3 fw-bold mt-n3 mb-2 pt-3 hoverF2 d-flex align-items-center"
                                                                                                            style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
                                                                                                            onclick="${gvc.event(() => {
                                        Storage.lastSelect = '';
                                        gvc.glitter.share.editorViewModel.selectItem = undefined;
                                        gvc.glitter.share.selectEditorItem();
                                    })}"
                                                                                                    >
                                                                                                        <i class="fa-solid fa-chevron-left"></i>
                                                                                                        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${widget.label}</span>
                                                                                                        <div class="flex-fill"></div>
                                                                                                    </div>`,
                                    GlobalWidget.showCaseBar(gvc, widget, () => {
                                        gvc.notifyDataChange(id)
                                    }),
                                    GlobalWidget.showCaseEditor({
                                        gvc: gvc,
                                        widget: widget,
                                        view: (widget) => {

                                            const html = String.raw
                                            let array: string[] = []
                                            const setting_btn=html`
                                                        <div class="p-2 mx-n2  mt-3 d-flex align-items-center"
                                                             style="font-size: 16px;
cursor: pointer;
border-top: 1px solid #DDD;
font-style: normal;
gap:10px;
font-weight: 700;" onclick="${gvc.event(() => {
                                                vm.page = 'setting'
                                                gvc.notifyDataChange(id)
                                            })}">
                                                            設定
                                                            <i class="fa-solid fa-angle-right"></i>
                                                        </div>`
                                            if (widget.data._layout === 'grid') {
                                                array = array.concat([EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: `X軸數量`,
                                                    default: widget.data._x_count,
                                                    placeHolder: '請輸入X軸數量',
                                                    callback: (text) => {
                                                        widget.data._x_count = text;
                                                        widget.refreshComponent()
                                                    }
                                                }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `Y軸數量`,
                                                        default: widget.data._y_count,
                                                        placeHolder: '請輸入Y軸數量',
                                                        callback: (text) => {
                                                            widget.data._y_count = text;
                                                            widget.refreshComponent()
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `X軸間距`,
                                                        default: widget.data._gap_x,
                                                        placeHolder: '請輸入X軸間距',
                                                        callback: (text) => {
                                                            widget.data._gap_x = text;
                                                            widget.refreshComponent()
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `Y軸間距`,
                                                        default: widget.data._gap_y,
                                                        placeHolder: '請輸入Y軸間距',
                                                        callback: (text) => {
                                                            widget.data._gap_y = text;
                                                            widget.refreshComponent()
                                                        }
                                                    }),setting_btn])
                                            }  if (widget.data._layout === 'vertical') {
                                                widget.data._ver_position=widget.data._ver_position ?? 'center'
                                                array=array.concat(
                                                   [ EditorElem.editeInput({
                                                       gvc: gvc,
                                                       title: '元件間隔',
                                                       default: widget.data._gap || '',
                                                       placeHolder: '單位px',
                                                       callback: (text) => {
                                                           widget.data._gap = text;
                                                           widget.refreshComponent()
                                                       }
                                                   }),
                                                       EditorElem.select({
                                                           title: '垂直方向',
                                                           gvc: gvc,
                                                           def: widget.data._ver_position,
                                                           array: [{
                                                               title: "靠上",
                                                               value: "flex-start"
                                                           }, {
                                                               title: "置中",
                                                               value: "center"
                                                           },
                                                               {
                                                                   title: "靠下",
                                                                   value: "flex-end"
                                                               }],
                                                           callback: (text) => {
                                                               widget.data._ver_position = text;
                                                               widget.refreshComponent();
                                                           }
                                                       }),
                                                       setting_btn]
                                                )
                                            }
                                            // array.push(CustomStyle.editorMargin(gvc, widget))
                                            return `<div class="mx-2">${array.join('')}</div>`
                                        },
                                        toggle_visible: (bool) => {
                                            if (bool) {
                                                $((gvc.glitter.document.querySelector('#editerCenter  iframe') as any).contentWindow.document.querySelector('.' + view_container_id)).show()
                                            } else {
                                                $((gvc.glitter.document.querySelector('#editerCenter  iframe') as any).contentWindow.document.querySelector('.' + view_container_id)).hide()
                                            }
                                        }
                                    })
                                ].join('')
                            }
                        }
                    })
                }
                widget.type = widget.type ?? "elem"
                widget.data.elemExpand = widget.data.elemExpand ?? {}
                widget.data.atrExpand = widget.data.atrExpand ?? {}
                if (['link', 'style'].indexOf(widget.data.elem) !== -1) {
                    widget.data.elemExpand.expand = true
                }
                return gvc.bindView(() => {
                    const id = gvc.glitter.getUUID()

                    function refreshEditor() {
                        gvc.notifyDataChange(id)
                    }

                    return {
                        bind: id,
                        view: () => {
                            return [
                                `<div class="mt-2"></div>`,
                                (['link', 'script'].indexOf(widget.data.elem) !== -1) ? `` :
                                    gvc.map([
                                        (() => {
                                            if (['link', 'style', 'script'].indexOf(widget.data.elem) !== -1) {
                                                return ``
                                            } else {
                                                return glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).editor(gvc, () => {
                                                    widget.refreshComponent()
                                                }, '元素設計樣式')
                                            }
                                        })(),
                                        (() => {
                                            if (['link', 'style', 'img', 'input', 'script'].indexOf(widget.data.elem) !== -1) {
                                                return ``
                                            } else {
                                                return EditorElem.select({
                                                    title: '元素類型',
                                                    gvc: gvc,
                                                    def: widget.type,
                                                    array: [{
                                                        title: '容器', value: 'container'
                                                    }, {
                                                        title: '元件', value: 'widget'
                                                    }],
                                                    callback: (text) => {
                                                        widget.type = text
                                                        if (widget.type === 'container') {
                                                            widget.data.setting = widget.data.setting ?? []
                                                        }
                                                        gvc.notifyDataChange('HtmlEditorContainer')
                                                        widget.refreshComponent()
                                                    }
                                                })
                                            }
                                        })(),
                                        (widget.type === 'container') ? `<div class="d-flex justify-content-end">
<button class="btn btn-secondary mt-2 w-100" onclick="${gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter)

                                            dialog.checkYesOrNot({
                                                text: '是否確認清空容器內容?',
                                                callback: (b) => {
                                                    if (b) {
                                                        widget.data.setting = []
                                                    }
                                                    gvc.notifyDataChange('HtmlEditorContainer')
                                                    widget.refreshComponent()
                                                }
                                            })
                                        })}">
<i class="fa-solid fa-trash-can me-2" aria-hidden="true"></i>
清空容器內容
</button>
</div>` : ``,
                                        (() => {
                                            const array: any = []
                                            if ((['link', 'style', 'script'].indexOf(widget.data.elem) === -1)) {
                                                array.push(EditorElem.searchInput({
                                                    title: 'HTML元素標籤',
                                                    gvc: gvc,
                                                    def: widget.data.elem,
                                                    array: ['button', 'h1', 'h2', 'h3', 'h4', 'h5', 'li', 'ul', 'table', 'div', 'header', 'section', 'span', 'p', 'a', 'img'
                                                        , 'input', 'select', 'script', 'src', 'textArea'],
                                                    callback: (text: string) => {
                                                        if (['link', 'style'].indexOf(widget.data.elem) === -1) {
                                                            widget.data.elem = text
                                                            widget.refreshComponent()
                                                        }
                                                    },
                                                    placeHolder: "請輸入元素標籤"
                                                }))
                                            }
                                            return array.join()
                                        })(),
                                        (() => {
                                            if (widget.type === 'container') {
                                                return ``
                                            }
                                            switch (widget.data.elem) {
                                                case 'select':
                                                    widget.data.selectList = widget.data.selectList ?? []
                                                    widget.data.selectType = widget.data.selectType ?? 'manual'
                                                    const list = widget.data.selectList
                                                    let html = EditorElem.select({
                                                        title: '資料來源',
                                                        gvc: gvc,
                                                        def: widget.data.selectType,
                                                        array: [{
                                                            title: '手動設定', value: 'manual'
                                                        }, {
                                                            title: '觸發事件', value: 'trigger'
                                                        }, {
                                                            title: 'API', value: 'api'
                                                        }],
                                                        callback: (text) => {
                                                            widget.data.selectType = text;
                                                            widget.refreshComponent()
                                                        }
                                                    })
                                                    if (widget.data.selectType === 'manual') {
                                                        widget.data.selectList = widget.data.selectList ?? []
                                                        html += `<div class="mx-n2 my-2">${(EditorElem.arrayItem({
                                                            gvc: gvc,
                                                            title: "選項集合",
                                                            originalArray: widget.data.selectList,
                                                            array: (() => {
                                                                return widget.data.selectList.map((dd: any, index: number) => {
                                                                    dd.visible = dd.visible ?? 'visible'
                                                                    return {
                                                                        title: dd.name || `區塊:${index + 1}`,
                                                                        expand: dd,
                                                                        innerHtml: () => {
                                                                            return [glitter.htmlGenerate.editeInput({
                                                                                gvc: gvc,
                                                                                title: `參數標題`,
                                                                                default: dd.name,
                                                                                placeHolder: "輸入參數標題",
                                                                                callback: (text) => {
                                                                                    dd.name = text
                                                                                    widget.refreshComponent()
                                                                                }
                                                                            }),
                                                                                glitter.htmlGenerate.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: `Value`,
                                                                                    default: dd.value,
                                                                                    placeHolder: "輸入參數值",
                                                                                    callback: (text) => {
                                                                                        dd.value = text
                                                                                        widget.refreshComponent()
                                                                                    }
                                                                                }),
                                                                                EditorElem.select({
                                                                                    title: "參數可見度",
                                                                                    gvc: gvc,
                                                                                    def: dd.visible ?? 'visible',
                                                                                    array: [
                                                                                        {
                                                                                            title: '隱藏',
                                                                                            value: "invisible"
                                                                                        },
                                                                                        {
                                                                                            title: '可選',
                                                                                            value: "visible"
                                                                                        }
                                                                                    ],
                                                                                    callback: (text) => {
                                                                                        dd.visible = text
                                                                                        widget.refreshComponent()
                                                                                    }
                                                                                })].join('')
                                                                        }

                                                                        ,
                                                                        minus: gvc.event(() => {
                                                                            list.splice(index, 1)
                                                                            widget.refreshComponent()
                                                                        })
                                                                    }
                                                                })
                                                            }),
                                                            expand: widget.data,
                                                            plus: {
                                                                title: "添加選項",
                                                                event: gvc.event(() => {
                                                                    widget.data.selectList.push({
                                                                        name: "名稱", value: "", key: "default"
                                                                    })
                                                                    widget.refreshComponent()
                                                                })
                                                            },
                                                            refreshComponent: () => {
                                                                widget.refreshComponent()
                                                            }
                                                        }))}</div>
${(() => {
                                                            widget.data.dataFrom = widget.data.dataFrom ?? "static"
                                                            widget.data.innerEvenet = widget.data.innerEvenet ?? {}
                                                            return gvc.map([
                                                                EditorElem.select({
                                                                    title: '預設值',
                                                                    gvc: gvc,
                                                                    def: widget.data.dataFrom,
                                                                    array: [{
                                                                        title: "靜態",
                                                                        value: "static"
                                                                    }, {
                                                                        title: "程式碼",
                                                                        value: "code"
                                                                    }],
                                                                    callback: (text) => {
                                                                        widget.data.dataFrom = text;
                                                                        widget.refreshComponent();
                                                                    }
                                                                }),
                                                                (() => {
                                                                    if (widget.data.dataFrom === 'static') {
                                                                        return glitter.htmlGenerate.editeInput({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            default: widget.data.inner,
                                                                            placeHolder: "預設值內容",
                                                                            callback: (text) => {
                                                                                widget.data.inner = text
                                                                                widget.refreshComponent()
                                                                            }
                                                                        })
                                                                    } else {
                                                                        return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                            option: [],
                                                                            hover: false,
                                                                            title: "程式碼"
                                                                        })
                                                                    }
                                                                })()
                                                            ])
                                                        })()}`
                                                    } else if (widget.data.selectType === 'trigger') {
                                                        widget.data.selectTrigger = widget.data.selectTrigger ?? {}
                                                        widget.data.selectItem = widget.data.selectItem ?? {}
                                                        html += `<div class="my-2"><div>${TriggerEvent.editer(gvc, widget, widget.data.selectTrigger, {
                                                            hover: true,
                                                            option: [],
                                                            title: "選項列表來源"
                                                        })}`;
                                                        html += `<div class="my-2"><div>${TriggerEvent.editer(gvc, widget, widget.data.selectItem, {
                                                            hover: true,
                                                            option: [],
                                                            title: "選中項目"
                                                        })}`;

                                                    } else {
                                                        widget.data.selectAPI = widget.data.selectAPI ?? {}
                                                        html += `<div class="my-2"><div>${TriggerEvent.editer(gvc, widget, widget.data.selectAPI, {
                                                            hover: true,
                                                            option: [],
                                                            title: "選擇API"
                                                        })}`
                                                    }
                                                    return html
                                                case 'img':
                                                    widget.data.dataFrom = widget.data.dataFrom ?? "static"
                                                    widget.data.innerEvenet = widget.data.innerEvenet ?? {}
                                                    return gvc.map([
                                                        EditorElem.select({
                                                            title: '內容取得',
                                                            gvc: gvc,
                                                            def: widget.data.dataFrom,
                                                            array: [{
                                                                title: "文字",
                                                                value: "static"
                                                            }, {
                                                                title: "觸發事件",
                                                                value: "code"
                                                            }],
                                                            callback: (text) => {
                                                                widget.data.dataFrom = text;
                                                                widget.refreshComponent();
                                                            }
                                                        }),
                                                        (() => {
                                                            if (widget.data.dataFrom === 'static') {
                                                                return EditorElem.uploadImage({
                                                                    title: '選擇圖片',
                                                                    gvc: gvc,
                                                                    def: widget.data.inner ?? "",
                                                                    callback: (data: string) => {
                                                                        widget.data.inner = data
                                                                        widget.refreshComponent()
                                                                    }
                                                                })
                                                            } else {
                                                                return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                    option: [],
                                                                    hover: false,
                                                                    title: "程式碼"
                                                                })
                                                            }
                                                        })()
                                                    ])
                                                default:
                                                    widget.data.dataFrom = widget.data.dataFrom ?? "static"
                                                    widget.data.innerEvenet = widget.data.innerEvenet ?? {}
                                                    return gvc.map([
                                                        (() => {
                                                            if (['link', 'style'].indexOf(widget.data.elem) !== -1) {
                                                                return ``
                                                            } else {
                                                                return EditorElem.select({
                                                                    title: '內容取得',
                                                                    gvc: gvc,
                                                                    def: widget.data.dataFrom,
                                                                    array: [{
                                                                        title: "靜態",
                                                                        value: "static"
                                                                    }, {
                                                                        title: "程式碼",
                                                                        value: "code_text"
                                                                    },
                                                                        {
                                                                            title: "觸發事件",
                                                                            value: "code"
                                                                        },
                                                                        {
                                                                            title: "HTML代碼",
                                                                            value: "static_code"
                                                                        }],
                                                                    callback: (text) => {
                                                                        widget.data.dataFrom = text;
                                                                        widget.refreshComponent();
                                                                    }
                                                                })
                                                            }
                                                        })()
                                                        ,
                                                        (() => {
                                                            if (['link'].indexOf(widget.data.elem) !== -1) {
                                                                return ``
                                                            } else {
                                                                if (widget.data.dataFrom === 'static') {
                                                                    if (widget.data.elem === 'style') {
                                                                        return EditorElem.styleEditor({
                                                                            gvc: gvc,
                                                                            title: 'CSS代碼',
                                                                            height: 300,
                                                                            initial: widget.data.inner,
                                                                            dontRefactor: true,
                                                                            callback: (text) => {
                                                                                widget.data.inner = text
                                                                            }
                                                                        })
                                                                    } else {
                                                                        return glitter.htmlGenerate.editeText({
                                                                            gvc: gvc,
                                                                            title: '內容',
                                                                            default: widget.data.inner,
                                                                            placeHolder: "元素內容",
                                                                            callback: (text) => {
                                                                                widget.data.inner = text
                                                                                widget.refreshComponent()
                                                                            }
                                                                        })
                                                                    }
                                                                } else if (widget.data.dataFrom === 'static_code') {
                                                                    return EditorElem.customCodeEditor({
                                                                        gvc: gvc,
                                                                        title: '複製的代碼內容',
                                                                        height: 300,
                                                                        initial: widget.data.inner,
                                                                        language: 'html',
                                                                        callback: (text) => {
                                                                            widget.data.inner = text;
                                                                        }
                                                                    })

                                                                } else if (widget.data.dataFrom === 'code_text') {
                                                                    return EditorElem.codeEditor({
                                                                        gvc: gvc,
                                                                        height: 200,
                                                                        initial: widget.data.inner,
                                                                        title: "代碼區塊",
                                                                        callback: (text) => {
                                                                            widget.data.inner = text
                                                                        },
                                                                        structStart: `((gvc,widget,object,subData,element)=>{`
                                                                    })
                                                                } else {
                                                                    return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                        option: [],
                                                                        hover: false,
                                                                        title: "程式碼"
                                                                    })
                                                                }
                                                            }

                                                        })()
                                                    ])
                                            }
                                        })()
                                    ]),
                                `<div class="mx-n2 mt-2">${
                                    EditorElem.arrayItem({
                                        originalArray: widget.data.attr,
                                        gvc: gvc,
                                        title: '特徵值',
                                        array: () => {
                                            return widget.data.attr.map((dd: any, index: number) => {
                                                dd.type = dd.type ?? 'par'
                                                dd.attr = dd.attr ?? ""
                                                dd.attrType = dd.attrType ?? "normal"
                                                return {
                                                    title: dd.attr,
                                                    expand: dd,
                                                    innerHtml: (() => {
                                                        NormalPageEditor.closeEvent = () => {
                                                            widget.refreshComponent();
                                                        }
                                                        NormalPageEditor.toggle({
                                                            visible: true,
                                                            title: '編輯特徵值',
                                                            view: gvc.bindView(() => {
                                                                const id = gvc.glitter.getUUID()
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        return [
                                                                            EditorElem.select({
                                                                                title: "特徵來源",
                                                                                gvc: gvc,
                                                                                def: dd.type,
                                                                                array: [{
                                                                                    title: '參數', value: 'par'
                                                                                }, {
                                                                                    title: '事件', value: 'event'
                                                                                }, {
                                                                                    title: '附加值', value: 'append'
                                                                                }
                                                                                ],
                                                                                callback: (text) => {
                                                                                    dd.type = text
                                                                                    gvc.notifyDataChange(id)

                                                                                }
                                                                            }),
                                                                            (() => {
                                                                                if (dd.type === 'par') {
                                                                                    let parMap: any = [EditorElem.searchInput({
                                                                                        title: '特徵標籤',
                                                                                        gvc: gvc,
                                                                                        def: dd.attr,
                                                                                        array: ['src', 'placeholder', 'href'],
                                                                                        callback: (text: string) => {
                                                                                            dd.attr = text

                                                                                        },
                                                                                        placeHolder: "請輸入特徵標籤"
                                                                                    })]
                                                                                    if (!((['script', 'img'].indexOf(widget.data.elem) !== -1 && (dd.attr === 'src')) || dd.attrType === 'link')) {
                                                                                        parMap.push(EditorElem.select({
                                                                                            title: '特徵類型',
                                                                                            gvc: gvc,
                                                                                            def: dd.attrType,
                                                                                            array: [
                                                                                                {
                                                                                                    title: "一般",
                                                                                                    value: 'normal'
                                                                                                },
                                                                                                {
                                                                                                    title: "檔案連結",
                                                                                                    value: 'link'
                                                                                                }],
                                                                                            callback: (text: string) => {
                                                                                                dd.attrType = text
                                                                                                gvc.notifyDataChange(id)

                                                                                            }
                                                                                        }))
                                                                                    }
                                                                                    return parMap.join('')
                                                                                } else {
                                                                                    return EditorElem.searchInput({
                                                                                        title: '特徵標籤',
                                                                                        gvc: gvc,
                                                                                        def: dd.attr,
                                                                                        array: ['onclick', 'oninput', 'onchange', 'ondrag', 'onmouseover', 'onmouseout'],
                                                                                        callback: (text: string) => {
                                                                                            dd.attr = text

                                                                                        },
                                                                                        placeHolder: "請輸入特徵標籤"
                                                                                    })
                                                                                }
                                                                            })(),
                                                                            (() => {
                                                                                if (dd.type === 'par') {
                                                                                    if ((['script', 'img'].indexOf(widget.data.elem) !== -1 && (dd.attr === 'src')) || dd.attrType === 'link') {
                                                                                        return EditorElem.uploadFile({
                                                                                            title: "資源路徑",
                                                                                            gvc: gvc,
                                                                                            def: dd.value ?? '',
                                                                                            callback: (text) => {
                                                                                                dd.value = text
                                                                                                gvc.notifyDataChange(id)

                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        dd.valueFrom = dd.valueFrom ?? "manual"
                                                                                        return [
                                                                                            EditorElem.h3('參數內容'),
                                                                                            EditorElem.select({
                                                                                                title: '',
                                                                                                gvc: gvc,
                                                                                                def: dd.valueFrom,
                                                                                                array: [
                                                                                                    {
                                                                                                        title: '帶入值',
                                                                                                        value: "manual"
                                                                                                    },
                                                                                                    {
                                                                                                        title: '程式碼',
                                                                                                        value: "code"
                                                                                                    }
                                                                                                ],
                                                                                                callback: (text) => {
                                                                                                    dd.valueFrom = text
                                                                                                    gvc.notifyDataChange(id)

                                                                                                }
                                                                                            }),
                                                                                            (() => {
                                                                                                if (dd.valueFrom === 'code') {
                                                                                                    return EditorElem.codeEditor({
                                                                                                        gvc: gvc,
                                                                                                        height: 200,
                                                                                                        initial: dd.value,
                                                                                                        title: '程式碼',
                                                                                                        callback: (data) => {
                                                                                                            dd.value = data

                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    return glitter.htmlGenerate.editeText({
                                                                                                        gvc: gvc,
                                                                                                        title: '',
                                                                                                        default: dd.value ?? "",
                                                                                                        placeHolder: `請輸入參數內容`,
                                                                                                        callback: (text) => {
                                                                                                            dd.value = text

                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })()
                                                                                        ].join('<div class="my-1"></div>');

                                                                                    }
                                                                                } else if (dd.type === 'append') {
                                                                                    return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, dd, {
                                                                                        option: [],
                                                                                        hover: false,
                                                                                        title: "顯示條件[請返回Bool值]"
                                                                                    })
                                                                                } else {
                                                                                    return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, dd, {
                                                                                        option: [],
                                                                                        hover: false,
                                                                                        title: "觸發事件"
                                                                                    })
                                                                                }
                                                                            })()
                                                                        ].join('')
                                                                    },
                                                                    divCreate: {
                                                                        class: `p-2`
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    }),
                                                    saveEvent: () => {
                                                        widget.refreshComponent();
                                                    },
                                                    minus: gvc.event(() => {
                                                        widget.data.attr.splice(index, 1);
                                                        widget.refreshComponent();
                                                    }),
                                                };
                                            })
                                        },
                                        expand: widget.data.atrExpand,
                                        plus: {
                                            title: '添加特徵',
                                            event: gvc.event(() => {
                                                widget.data.attr.push({});
                                                widget.refreshComponent();
                                            }),
                                        },
                                        refreshComponent: () => {
                                            widget.refreshComponent();
                                        },
                                        customEditor: true
                                    })
                                }</div>`
                            ].join('')
                        },
                        onCreate: () => {
                            setTimeout(() => {
                                gvc.glitter.document.querySelector('.right_scroll')!.scrollTop = glitter.share.lastRightScrollTop
                                console.log(`lastRightScrollTop-->`, glitter.share.lastRightScrollTop)
                            })
                        }
                    }
                });
            },
        };
    }
}
