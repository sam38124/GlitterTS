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
import {BgWidget} from "../../backend-manager/bg-widget.js";



const container_style_list = ['grid', 'vertical', 'proportion']
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
                widget.refreshComponent = () => {
                    (widget as any).refreshComponentParameter.view1();
                    (widget as any).refreshComponentParameter.view2();
                }
                (widget as any).refreshComponentParameter.view1 = () => {
                    gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = showCaseData()
                    setTimeout(()=>{
                        gvc.glitter.document.querySelector(`.editor_it_${view_container_id}`).classList.add('editorItemActive');
                        // gvc.glitter.$(`[gvc-id="${gvc.id(id)}"].editorChild`).addClass('editorItemActive')
                    },500)
                }

                function showCaseData() {
                    const oWidget=widget
                    return GlobalWidget.showCaseData({
                        gvc: gvc,
                        widget: widget,
                        empty: ` <!-- tag=${widget.label} -->
                         ${gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    return ``
                                },
                                divCreate: {
                                    class: `d-none`, style: ``
                                },
                                onCreate: () => {
                                    widget.data.setting.refresh = () => {
                                        gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = showCaseData()
                                    }
                                }
                            }
                        })}`,
                        view: (widget) => {
                            function isEditorMode() {
                                return (((window.parent as any).editerData !== undefined) || ((window as any).editerData !== undefined))
                            }

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
                                    }).filter((dd: any) => {
                                        return !(((gvc.glitter.getUrlParameter('type') === 'htmlEditor') && dd.key === 'onclick'));
                                    })
                                    if (widget.data.elem === 'a' && ((window.parent as any).editerData !== undefined)) {
                                        option = option.filter((dd: any) => {
                                            return dd.key !== 'href'
                                        })
                                    }
                                    if (widget.data.elem === 'img') {
                                        option.push({key: 'src', value: gvc.glitter.ut.resize_img_url(innerText)})
                                    } else if (widget.data.elem === 'input') {
                                        option.push({key: 'value', value: innerText})
                                    }
                                    let classList = []
                                    let elem = widget.data.elem
                                    if (isEditorMode() && htmlGenerate.root) {
                                        classList.push(`editorParent`)
                                        classList.push(`relativePosition`)
                                        classList.push(view_container_id)
                                        option = option.concat([
                                            {
                                                key: 'onmouseover',
                                                value: gvc.event((e, event) => {
                                                    ($(e).children('.editorChild').children('.plus_bt') as any).show();
                                                }),
                                            },
                                            {
                                                key: 'onmouseout',
                                                value: gvc.event((e, event) => {
                                                    ($(e).children('.editorChild').children('.plus_bt') as any).hide();
                                                }),
                                            },
                                        ])
                                    }
                                    classList.push(glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).class())
                                    widget.hashTag && classList.push(`glitterTag${widget.hashTag}`);
                                    let style_user = ''
                                    if (widget.type === 'container' && container_style_list.includes(widget.data._layout)) {
                                        style_user = RenderValue.custom_style.value(gvc, widget)
                                        style_user += RenderValue.custom_style.container_style(gvc, widget);
                                    }
                                    style_user += widget.code_style || '';
                                    return {
                                        elem: elem,
                                        class: classList.join(' ') + ` ${((window.parent as any).editerData !== undefined) ? `${((widget as any).visible === false) ? `hide-elem` : ``}` : ``}`,
                                        style: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).style() + ` ${style_user}`,
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
                                                    if (container_style_list.includes(widget.data._layout) &&
                                                        (((gvc.glitter.window.parent as any).editerData !== undefined) ||
                                                            ((gvc.glitter.window as any).editerData !== undefined)) && htmlGenerate.root) {
                                                        const html = String.raw
                                                        const tempID = gvc.glitter.getUUID()

                                                        function rerenderReplaceElem() {
                                                            gvc.glitter.$('.' + tempID).remove();
                                                            widget.data.setting.need_count = (() => {
                                                                if (widget.data._layout === 'proportion') {
                                                                    return (widget.data._ratio_layout_value ?? ``).split(',').length
                                                                } else {
                                                                    return parseInt(widget.data._x_count, 10) * parseInt(widget.data._y_count, 10)
                                                                }
                                                            })();
                                                            if (widget.data._layout === 'vertical') {
                                                                widget.data.setting.need_count = 1
                                                            }
                                                            let horGroup: any = [];
                                                            let gIndex = 0
                                                            let wCount = 0
                                                            for (let index = 0; index < (widget.data._ratio_layout_value ?? ``).split(',').length; index++) {
                                                                if (horGroup[gIndex] === undefined) {
                                                                    horGroup[gIndex] = [];
                                                                    wCount = 0;
                                                                }
                                                                const wid = Number((widget.data._ratio_layout_value ?? ``).split(',')[index] || '0');
                                                                if (wCount + wid <= 100) {
                                                                    wCount = wCount + wid
                                                                    horGroup[gIndex].push(index)
                                                                    if (wCount >= 100) {
                                                                        gIndex = gIndex + 1;
                                                                    }
                                                                } else {
                                                                    gIndex = gIndex + 1
                                                                }
                                                            }

                                                            for (let b = widget.data.setting.length; b < widget.data.setting.need_count; b++) {
                                                                gvc.glitter.$(`.editor_it_${id}`).append(
                                                                    html`
                                                                        <div
                                                                                class="d-flex align-items-center justify-content-center flex-column rounded-3 w-100 py-3 ${tempID}"
                                                                                style="background: lightgrey;color: #393939;cursor: pointer;min-height: 100px;left: 0px;top:0px;width: ${(() => {
                                                                                    if (widget.data._layout === 'proportion') {
                                                                                        const wid = (widget.data._ratio_layout_value ?? ``).split(',')
                                                                                        for (const c of horGroup) {
                                                                                            if (c.includes(b)) {
                                                                                                const wid = (widget.data._ratio_layout_value ?? ``).split(',');
                                                                                                const _gap_y = ((Number(widget.data._gap_y) * (c.length - 1)) / c.length).toFixed(0);

                                                                                                return `calc(${wid[b] || 100}% - ${_gap_y}px) !important;`
                                                                                            }
                                                                                        }
                                                                                        return wid[b] || 100 + '% !important'
                                                                                    } else {
                                                                                        return `100%`
                                                                                    }
                                                                                })()};height: 100%;"
                                                                                onmousedown="${gvc.event(() => {
                                                                        glitter.getModule(new URL(gvc.glitter.root_path + 'editor/add-component.js').href, (AddComponent: any) => {
                                                                            glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                            AddComponent.toggle(true);
                                                                            AddComponent.addWidget = (gvc: GVC, cf: any) => {
                                                                                (window.parent as any).glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                                (window.parent as any).glitter.share.addComponent(cf);
                                                                                RenderValue.custom_style.value(gvc, widget)
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
                                                                                RenderValue.custom_style.value(gvc, widget)
                                                                                AddComponent.toggle(false);
                                                                            };  
                                                                        })
                                                                                })}"
                                                                        >
                                                                            <i class="fa-regular fa-circle-plus text-black"
                                                                               style="font-size: 50px;"></i>
                                                                            <span class="fw-500 fs-6 mt-3">添加元件</span>
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
                                            origin_widget: widget
                                        }, getCreateOption)
                                    }

                                    widget.data.setting.refresh = (() => {
                                        try {
                                            hoverID = [Storage.lastSelect];
                                            gvc.glitter.document.querySelector('.selectComponentHover') && gvc.glitter.document.querySelector('.selectComponentHover').classList.remove("selectComponentHover");
                                            gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = showCaseData()
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

                                function getCodeText() {
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
                                }

                                getCodeText()
                                return gvc.bindView(() => {
                                    return {
                                        bind: id,
                                        view: () => {
                                            let view: any = []

                                            switch (widget.data.elem) {
                                                case 'select':
                                                    return new Promise(async (resolve, reject) => {
                                                        const widget=oWidget
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
                                                        // console.log(`widget.data.key=>`,widget.data.key)
                                                        // console.log(oWidget)
                                                        if (widget.data.selectType === 'api') {
                                                            resolve(vm.data.map((dd: any) => {
                                                                formData[widget.data.key] = formData[widget.data.key] ?? dd.value
                                                                if (dd.visible === 'invisible' && (dd.value !== formData[widget.data.key])) {
                                                                    return ``
                                                                }
                                                                return glitter.html`<option  value="${dd.value}" ${`${dd.value}` === `${formData[widget.data.key]}` ? `selected` : ``}>
                                ${dd.key}
                            </option>`;
                                                            }).join('') + `<option value="" ${formData[widget.data.key] === '' ? `selected` : ``}>
                                選擇${widget.data.label}
                            </option>`)
                                                        } else if (widget.data.selectType === 'trigger') {
                                                            const data = await TriggerEvent.trigger({
                                                                gvc: gvc,
                                                                widget: oWidget,
                                                                clickEvent: oWidget.data.selectTrigger,
                                                                subData: subData
                                                            })
                                                            const selectItem = await TriggerEvent.trigger({
                                                                gvc: gvc,
                                                                widget: oWidget,
                                                                clickEvent: oWidget.data.selectItem,
                                                                subData: subData
                                                            })

                                                            if(!data){
                                                                console.log(`area_json_IS`,oWidget.share.area_json)
                                                            }
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
                                            // console.log(`htmlGenerate.root`, htmlGenerate.root)
                                            // if ((window.parent as any).editerData !== undefined && htmlGenerate.root && widget.data.elem !== 'textArea') {
                                            //     view.push(glitter.htmlGenerate.getEditorSelectSection({
                                            //         id: widget.id,
                                            //         gvc: gvc,
                                            //         label: widget.label,
                                            //         widget: widget
                                            //     }));
                                            // }

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
                                                }, 300)

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
                                        },
                                        onResume: () => {
                                        }
                                    }
                                })
                            } catch (e) {
                                console.log(e)
                                return `${e}`
                            }
                        }
                    })
                }

                return showCaseData()

            },
            editor: () => {

                if (widget.type === 'container' && Storage.select_function === 'user-editor' || localStorage.getItem('uasi') === 'user_editor') {
                    const setting_refer_option = [
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
                            title: "進階設定",
                            key: 'develop',
                            array: []
                        }
                    ]

                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();

                        const vm: {
                            page: 'editor' | 'setting'
                        } = {
                            get page() {
                                return Storage.page_setting_global
                            },
                            set page(vale) {
                                Storage.page_setting_global = vale
                            }
                        }
                        const html = String.raw
                        return {
                            bind: id,
                            view: async () => {
                                const CustomStyle: any = await new Promise((resolve, reject) => {
                                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'glitterBundle/html-component/custom-style.js').href, (clas) => {
                                        resolve(clas)
                                    })
                                })
                                if (vm.page === 'setting') {
                                    const oWidget: any = widget;
                                    return GlobalWidget.showCaseEditor({
                                        gvc: gvc,
                                        widget: widget,
                                        view: (widget, type) => {
                                           const setting_option=setting_refer_option.filter((dd: any) => {
                                                oWidget[`${type}_editable`] = oWidget[`${type}_editable`] ?? []
                                                switch (dd.key) {
                                                    case 'style':
                                                    case 'color':
                                                        return (dd.array && dd.array.length > 0)
                                                    case 'background':
                                                        return true
                                                    case 'margin':
                                                    case 'develop':
                                                        return true
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
                                                                                                        </div>`, setting_option.map((dd: any, index: number) => {
                                                return gvc.bindView(() => {
                                                    const vm_c: {
                                                        id: string
                                                    } = {
                                                        id: gvc.glitter.getUUID()
                                                    };
                                                    (setting_option[index] as any).vm_c = vm_c;
                                                    (widget as any).refreshComponentParameter.view2 = () => {
                                                        gvc.notifyDataChange(vm_c.id)
                                                    }
                                                    return {
                                                        bind: vm_c.id,
                                                        view: () => {
                                                            const array_string = [html`
                                                                <div class="hoverF2 d-flex align-items-center p-3"
                                                                     onclick="${gvc.event(() => {
                                                                         const toggle = !dd.toggle;
                                                                         (setting_option as any).map((dd: any) => {
                                                                             if (dd.toggle) {
                                                                                 dd.toggle = false
                                                                                 gvc.notifyDataChange(dd.vm_c.id)
                                                                             }
                                                                         });
                                                                         dd.toggle = toggle
                                                                         gvc.notifyDataChange(vm_c.id)
                                                                     })}">
<span class="fw-500"
      style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${dd.title}</span>
                                                                    <div class="flex-fill"></div>
                                                                    ${dd.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : ` <i class="fa-solid fa-chevron-right"></i>`}

                                                                </div>`]

                                                            if (dd.toggle) {
                                                                switch (dd.key) {
                                                                    case 'margin':

                                                                        array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorMargin(gvc, widget, () => {

                                                                            gvc.notifyDataChange(vm_c.id)
                                                                            oWidget.refreshComponentParameter.view1()
                                                                        })}</div>`)
                                                                        break
                                                                    case 'background':
                                                                        array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorBackground(gvc, widget, () => {
                                                                            gvc.notifyDataChange(vm_c.id)
                                                                                oWidget.refreshComponentParameter.view1()
                                                                        })}</div>`)
                                                                        break
                                                                    case 'develop':
                                                                        array_string.push(`<div class="px-3">${CustomStyle.editor(gvc, widget, () => {
                                                                            gvc.notifyDataChange(vm_c.id)
                                                                                oWidget.refreshComponentParameter.view1()
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
                                        },
                                        hide_selector: true
                                    })
                                }
                                (widget as any).refreshComponentParameter.view2 = () => {
                                    gvc.notifyDataChange(id)
                                }

                                return [
                                    gvc.bindView(() => {
                                        const vm: {
                                            id: string,
                                            type: 'editor' | 'preview'
                                        } = {
                                            id: gvc.glitter.getUUID(),
                                            type: 'preview'
                                        }
                                        return {
                                            bind: vm.id,
                                            view: () => {
                                                if (vm.type === 'preview') {
                                                    return html`
                                                        <i class="fa-solid fa-chevron-left h-100 d-flex align-items-center justify-content-center "></i>
                                                        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${widget.label}</span>
                                                        <div class="flex-fill"></div>
                                                        <button class="btn sel_normal"
                                                                type="button"
                                                                onclick="${gvc.event(() => {
                                                                    vm.type = 'editor'
                                                                    gvc.notifyDataChange([vm.id,'item-editor-select'])
                                                                })}">
                                                            <span style="font-size: 14px; color: #393939; font-weight: 400;">更改命名</span>
                                                        </button>`
                                                } else {
                                                    let name = widget.label
                                                    return html`
                                                        <i class="fa-solid fa-xmark h-100 d-flex align-items-center justify-content-center "
                                                           onclick="${gvc.event((e, event) => {
                                                               vm.type = 'preview';
                                                               event.stopPropagation();
                                                               event.preventDefault();
                                                               gvc.notifyDataChange(vm.id)
                                                           })}"></i>
                                                        ${
                                                                EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    default: name,
                                                                    placeHolder: '請輸入自定義名稱',
                                                                    callback: (text: any) => {
                                                                        name = text;
                                                                    },
                                                                })
                                                        }
                                                        <button class="btn sel_normal"
                                                                type="button"
                                                                onclick="${gvc.event(() => {
                                                                    vm.type = 'preview';
                                                                    widget.label = name;
                                                                    gvc.notifyDataChange([vm.id,'item-editor-select'])
                                                                })}">
                                                            <span style="font-size: 14px; color: #393939; font-weight: 400;">確認</span>
                                                        </button>`
                                                }

                                            },
                                            divCreate: {
                                                class: `px-3 mx-n2  border-bottom pb-3 fw-bold mt-n3 mb-2 pt-3 hoverF2 d-flex align-items-center`,
                                                style: `cursor: pointer;color:#393939;border-radius: 0px;gap:10px;`,
                                                option: [{
                                                    key: 'onclick',
                                                    value: gvc.event((e, event) => {
                                                        if (vm.type === 'editor') {
                                                            return
                                                        }
                                                      Storage.lastSelect = '';
                                                      gvc.glitter.share.editorViewModel.selectItem = undefined;
                                                      gvc.glitter.share.selectEditorItem();
                                                        // const select_ = glitter.share.findWidgetIndex(glitter.share.editorViewModel.selectItem.id)
                                                        // if (select_.container_cf) {
                                                        //     const gvc_ = gvc.glitter.document.querySelector('.iframe_view').contentWindow.glitter.pageConfig[0].gvc
                                                        //     gvc_.glitter.htmlGenerate.selectWidget({
                                                        //         widget: select_.container_cf,
                                                        //         widgetComponentID: select_.container_cf.id,
                                                        //         gvc: gvc_,
                                                        //         scroll_to_hover: true,
                                                        //         glitter: glitter,
                                                        //     });
                                                        // } else {
                                                        //     Storage.lastSelect = '';
                                                        //     gvc.glitter.share.editorViewModel.selectItem = undefined;
                                                        //     gvc.glitter.share.selectEditorItem();
                                                        // }
                                                    })
                                                }]
                                            }
                                        }
                                    }),
                                    GlobalWidget.showCaseEditor({
                                        gvc: gvc,
                                        widget: widget,
                                        view: (widget) => {
                                            const html = String.raw
                                            let array: string[] = []
                                            const setting_btn = html`
                                                <div class="py-3 mx-n3 px-3   d-flex align-items-center "
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
                                            const child_container = gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID()
                                                const parId = gvc.glitter.getUUID()
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        let viewArray: string[] = [`<h3  style="color: #393939;margin-bottom: 5px;" class="fw-500 fs-6">子元件</h3>`]
                                                        viewArray.push(gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID()
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return (widget.data.setting || []).map((dd: any) => {
                                                                        dd.visible = dd.visible ?? 'visible'
                                                                        return `<li onclick="${gvc.event(() => {

                                                                            const gvc_ = gvc.glitter.document.querySelector('.iframe_view').contentWindow.glitter.pageConfig[0].gvc
                                                                            gvc_.glitter.htmlGenerate.selectWidget({
                                                                                widget: dd,
                                                                                widgetComponentID: dd.id,
                                                                                gvc: gvc_,
                                                                                scroll_to_hover: true,
                                                                                glitter: glitter,
                                                                            });
                                                                        })}">
                                                                    <div class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1 subComponentGuide" style="gap:5px;color:#393939;" >
                                                                        <div class=" p-1 dragItem " >
                                                                            <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  " style="width:15px;height:15px;" aria-hidden="true"></i>
                                                                        </div>
                                                                        <span>${dd.label}</span>
                                                                        <div class="flex-fill"></div>
                                                                        <div class="hoverBtn p-1 child" onclick="${gvc.event((e, event) => {
                                                                            event.stopPropagation();
                                                                            event.preventDefault();
                                                                            glitter.htmlGenerate.deleteWidget(widget.data.setting, dd, () => {
                                                                            })
                                                                        })}">
                                                                            <i class="fa-regular fa-trash d-flex align-items-center justify-content-center " aria-hidden="true"></i>
                                                                        </div>
                                                                        <div class="hoverBtn p-1 child" onclick="${gvc.event((e, event) => {
                                                                            event.stopPropagation();
                                                                            event.preventDefault();
                                                                            dd.visible = !dd.visible
                                                                            if (dd.visible) {
                                                                                (gvc.glitter.document.querySelector('#editerCenter iframe')! as any).contentWindow.glitter
                                                                                    .$(`.editor_it_${dd.id}`)
                                                                                    .parent()
                                                                                    .show();
                                                                            } else {
                                                                                (gvc.glitter.document.querySelector('#editerCenter iframe')! as any).contentWindow.glitter
                                                                                    .$(`.editor_it_${dd.id}`)
                                                                                    .parent()
                                                                                    .hide();
                                                                            }
                                                                            gvc.notifyDataChange(id)
                                                                        })}">
                                                                            <i class="${(dd.visible) ? `fa-regular fa-eye` : `fa-solid fa-eye-slash`} d-flex align-items-center justify-content-center " style="width:15px;height:15px;" aria-hidden="true"></i>
                                                                        </div>
                                                                    </div>
                                                                </li>`
                                                                    }).join('')
                                                                },
                                                                divCreate: {
                                                                    class: `mx-n2`,
                                                                    elem: 'ul',
                                                                    option: [{key: 'id', value: parId}],
                                                                },
                                                                onCreate: () => {
                                                                    gvc.glitter.addMtScript(
                                                                        [
                                                                            {
                                                                                src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                                            },
                                                                        ],
                                                                        () => {
                                                                            const interval = setInterval(() => {
                                                                                if ((window as any).Sortable) {
                                                                                    try {
                                                                                        gvc.addStyle(`
                                    ul {
                                        list-style: none;
                                        padding: 0;
                                    }
                                `);

                                                                                        function swapArr(arr: any, index1: number, index2: number) {
                                                                                            const data = arr[index1];
                                                                                            arr.splice(index1, 1);
                                                                                            arr.splice(index2, 0, data);
                                                                                        }

                                                                                        let startIndex = 0;
                                                                                        //@ts-ignore
                                                                                        Sortable.create(gvc.glitter.document.getElementById(parId), {
                                                                                            handle: '.dragItem',
                                                                                            group: gvc.glitter.getUUID(),

                                                                                            animation: 100,
                                                                                            onChange: function (evt: any) {
                                                                                                function swapElements(elm1: any, elm2: any) {
                                                                                                    var parent1, next1,
                                                                                                        parent2, next2;

                                                                                                    parent1 = elm1.parentNode;
                                                                                                    next1 = elm1.nextSibling;
                                                                                                    parent2 = elm2.parentNode;
                                                                                                    next2 = elm2.nextSibling;

                                                                                                    parent1.insertBefore(elm2, next1);
                                                                                                    parent2.insertBefore(elm1, next2);
                                                                                                }

                                                                                                swapElements(widget.data.setting[startIndex].editor_bridge.element().parentNode, widget.data.setting[evt.newIndex].editor_bridge.element().parentNode)
                                                                                                swapArr(widget.data.setting, startIndex, evt.newIndex);
                                                                                                const newIndex = evt.newIndex
                                                                                                startIndex = newIndex
                                                                                                setTimeout(() => {
                                                                                                    const dd = widget.data.setting[newIndex]
                                                                                                    dd && dd.editor_bridge && dd.editor_bridge.scrollWithHover()
                                                                                                })

                                                                                            },
                                                                                            onEnd: (evt: any) => {

                                                                                            },
                                                                                            onStart: function (evt: any) {
                                                                                                startIndex = evt.oldIndex;
                                                                                            },
                                                                                        });
                                                                                    } catch (e) {
                                                                                    }
                                                                                    clearInterval(interval);
                                                                                }
                                                                            }, 100);
                                                                        },
                                                                        () => {
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        }))
                                                        viewArray.push(`<div class="w-100" style="justify-content: center; align-items: center; gap: 4px; display: flex;color: #3366BB;cursor: pointer;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
onclick="${gvc.event(() => {
                                                            gvc.glitter.getModule(gvc.glitter.root_path + 'editor/add-component.js', (AddComponent: any) => {
                                                                gvc.glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                AddComponent.toggle(true);

                                                                AddComponent.addWidget = (gvc: GVC, cf: any) => {
                                                                    gvc.glitter.share.addComponent(cf);
                                                                    gvc.notifyDataChange(id)
                                                                }
                                                                AddComponent.addEvent = (gvc: GVC, tdata: any) => {
                                                                    gvc.glitter.share.addComponent({
                                                                        "id": gvc.glitter.getUUID(),
                                                                        "js": "./official_view_component/official.js",
                                                                        "css": {
                                                                            "class": {},
                                                                            "style": {}
                                                                        },
                                                                        "data": {
                                                                            'refer_app': tdata.copyApp,
                                                                            "tag": tdata.copy,
                                                                            "list": [],
                                                                            "carryData": {},
                                                                            _style_refer_global: {
                                                                                index: `0`
                                                                            }
                                                                        },
                                                                        "type": "component",
                                                                        "class": "",
                                                                        "index": 0,
                                                                        "label": tdata.title,
                                                                        "style": "",
                                                                        "bundle": {},
                                                                        "global": [],
                                                                        "toggle": false,
                                                                        "stylist": [],
                                                                        "dataType": "static",
                                                                        "style_from": "code",
                                                                        "classDataType": "static",
                                                                        "preloadEvenet": {},
                                                                        "share": {}
                                                                    });
                                                                    gvc.notifyDataChange(id)
                                                                }
                                                            })
                                                        })}">
                        <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">新增一個元件</div>
                        <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    </div>`)
                                                        return viewArray.join('<div class="my-2"></div>')
                                                    },
                                                    divCreate: {
                                                        class: 'py-3  mt-3 mx-n3 px-3',
                                                        style: `border-top: 1px solid #DDD;`
                                                    }
                                                }
                                            })
                                            if (widget.data._layout === 'grid') {
                                                array = array.concat([
                                                    EditorElem.editeInput({
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
                                                        title: `上下間隔`,
                                                        default: widget.data._gap_x,
                                                        placeHolder: '請輸入上下間隔',
                                                        callback: (text) => {
                                                            widget.data._gap_x = text;
                                                            widget.refreshComponent()
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `左右間隔`,
                                                        default: widget.data._gap_y,
                                                        placeHolder: '請輸入左右間隔',
                                                        callback: (text) => {
                                                            widget.data._gap_y = text;
                                                            widget.refreshComponent()
                                                        }
                                                    }),
                                                    child_container,
                                                    setting_btn])
                                            } else if (widget.data._layout === 'vertical') {
                                                widget.data._ver_position = widget.data._ver_position ?? 'center'
                                                array = array.concat(
                                                    [
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '元件間隔',
                                                            default: widget.data._gap || '',
                                                            placeHolder: '單位px',
                                                            callback: (text) => {
                                                                widget.data._gap = text;
                                                                widget.refreshComponent()
                                                            }
                                                        }),
                                                        child_container,
                                                        setting_btn
                                                    ]
                                                )
                                            } else if (widget.data._layout === 'proportion') {
                                                array = array.concat(
                                                    [
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: `上下間隔`,
                                                            default: widget.data._gap_x,
                                                            placeHolder: '請輸入上下間隔',
                                                            callback: (text) => {
                                                                widget.data._gap_x = text;
                                                                widget.refreshComponent()
                                                            }
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: `左右間隔`,
                                                            default: widget.data._gap_y,
                                                            placeHolder: '請輸入左右間隔',
                                                            callback: (text) => {
                                                                widget.data._gap_y = text;
                                                                widget.refreshComponent()
                                                            }
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: html`
                                                                <div class="d-flex flex-column" style="gap:5px;">
                                                                    元件比例設定
                                                                    <h3
                                                                            class="my-auto tx_title"
                                                                            style="color: #8D8D8D;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;"
                                                                    >
                                                                        一列為100%，超過100%則跳往下一行
                                                                    </h3>
                                                                </div>`,
                                                            default: widget.data._ratio_layout_value,
                                                            placeHolder: '範例30,70,70,30',
                                                            callback: (text) => {
                                                                widget.data._ratio_layout_value = text;
                                                                RenderValue.custom_style.value(gvc, widget)
                                                                widget.refreshComponent()
                                                            }
                                                        }),
                                                        child_container,
                                                        setting_btn
                                                    ]
                                                )
                                            }
                                            // array.push(CustomStyle.editorMargin(gvc, widget))
                                            return `<div class="mx-2">${array.join('')}</div>`
                                        },
                                        toggle_visible: (bool) => {
                                            widget.data.setting.refresh()
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
