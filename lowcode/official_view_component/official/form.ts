import {HtmlJson, Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {Glitter} from "../../glitterBundle/Glitter.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {getInitialData} from "../initial_data.js";

Plugin.createComponent(import.meta.url, (glitter: Glitter, editMode: boolean) => {
    return {
        defaultData: {},
        render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData, element) => {
            const html = String.raw
            const config: {
                array: {
                    title: string, key: string, readonly: 'read' | 'write' | 'block', type: 'text' | 'number' | 'textArea' | 'address', require: "true" | "false",
                    style_data: {
                        label: {
                            class: string,
                            style: string
                        },
                        input: {
                            class: string,
                            style: string
                        },
                        container: {
                            class: string,
                            style: string
                        }
                    }
                }[]
                formID: string,
                getFormData: any
            } = getInitialData({
                obj: widget.data,
                key: 'layout',
                def: {
                    array: [
                        {
                            title: '標題', key: '', readonly: 'read', type: 'text', require: "true",
                            style_data: {
                                label: {
                                    class: `form-label fs-base `,
                                    style: ``
                                },
                                input: {
                                    class: ``,
                                    style: ``
                                },
                                container: {
                                    class: ``,
                                    style: ``
                                }
                            }
                        }
                    ],
                    style: {},
                    formID: 'formID',
                    getFormData: {}
                },
            })

            let formData: any = {}
            return {
                view: () => {
                    return gvc.bindView(() => {
                        function checkEditFinish(){
                            return !config.array.find((dd)=>{
                                return (dd.require==='true') && (!formData[dd.key])
                            })
                        }
                        const id = glitter.getUUID()
                        const getFormData = TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: config.getFormData, subData: subData, element: element
                        }).then((data) => {
                            formData = data || formData
                            gvc.notifyDataChange(id)
                        })
                        return {
                            bind: id,
                            view: () => {
                                return config.array.map((dd) => {
                                    const labelCSS = glitter.htmlGenerate.editor_component(dd.style_data.label, gvc, widget as any, subData)
                                    const inputCSS = glitter.htmlGenerate.editor_component(dd.style_data.input, gvc, widget as any, subData)
                                    const containerCss = glitter.htmlGenerate.editor_component(dd.style_data.container, gvc, widget as any, subData)
                                    const label = ` <label class="${labelCSS.class()}" style="${labelCSS.style()}"><span class="text-danger  ${dd.require==="true" ? `` : 'd-none'}"> * </span>${dd.title}</label>`
                                    switch (dd.type) {
                                        case "textArea":
                                            return html`
                                                <div class="${containerCss.class()}" style="${containerCss.style()}">
                                                    ${label}
                                                    <textarea class="${inputCSS.class()}"
                                                              style="${inputCSS.style()}"
                                                              onchange="${gvc.event((e, event) => {
                                                                  formData[dd.key] = e.value
                                                              })}">
${formData[dd.key] ?? ""}
</textarea>
                                                </div>`
                                        default:
                                    }
                                    return html`
                                        <div class="${containerCss.class()}" style="${containerCss.style()}">
                                            ${label}
                                            <input type="${dd.type}" value="${formData[dd.key] ?? ""}" class="${inputCSS.class()}"
                                                   style="${inputCSS.style()}" onchange="${gvc.event((e, event) => {
                                                formData[dd.key] = e.value
                                            })}" >
                                        </div>`
                                }).join('')
                            },
                            divCreate: {
                                class: `formID-${config.formID}`
                            },
                            onCreate: () => {
                                (document.querySelector(`.formID-${config.formID}`) as any).formValue =()=>{
                                    return formData
                                }
                                (document.querySelector(`.formID-${config.formID}`) as any).checkEditFinish = checkEditFinish
                            }
                        }
                    })

                },
                editor: () => {
                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '表單ID',
                            placeHolder: `請輸入表單ID`,
                            default: config.formID,
                            callback: (text) => {
                                config.formID = text
                                widget.refreshComponent()
                            }
                        }),
                        TriggerEvent.editer(gvc, widget, config.getFormData, {
                            hover: false,
                            option: [],
                            title: "設定表單資料來源。"
                        })
                        ,
                        `<div class="mx-n2 ">${EditorElem.arrayItem({
                            title: "表單項目",
                            gvc: gvc,
                            array: () => {
                                return config.array.map((dd: any, index: number) => {
                                    return {
                                        title: dd.title ?? `選項.${index + 1}`,
                                        innerHtml: (gvc: GVC) => {
                                            const labelCSS = glitter.htmlGenerate.editor_component(dd.style_data.label, gvc, widget as any, subData)
                                            const inputCSS = glitter.htmlGenerate.editor_component(dd.style_data.input, gvc, widget as any, subData)
                                            const containerCss = glitter.htmlGenerate.editor_component(dd.style_data.container, gvc, widget as any, subData)
                                            return [
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: 'Label名稱',
                                                    placeHolder: `請輸入Label名稱`,
                                                    default: dd.title,
                                                    callback: (text) => {
                                                        dd.title = text
                                                        widget.refreshComponent()
                                                    }
                                                }),
                                                EditorElem.select({
                                                    title: "元件類型",
                                                    gvc: gvc,
                                                    def: dd.type,
                                                    array: [
                                                        {title: '文字', value: 'text'},
                                                        {title: '信箱', value: 'email'},
                                                        {title: '電話', value: 'phone'},
                                                        {title: '數字', value: 'number'},
                                                        {title: '名稱', value: 'name'},
                                                        {title: '多行文字區塊', value: 'textArea'},
                                                        {title: '地址', value: 'address'},
                                                        {title: '密碼', value: 'password'}
                                                    ],
                                                    callback: (text) => {
                                                        dd.type = text
                                                        widget.refreshComponent()
                                                    }
                                                }),
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: 'Key標籤',
                                                    placeHolder: `請輸入Key標籤`,
                                                    default: dd.key,
                                                    callback: (text) => {
                                                        dd.key = text
                                                        widget.refreshComponent()
                                                    }
                                                }),
                                                EditorElem.select({
                                                    title: "元件類型",
                                                    gvc: gvc,
                                                    def: dd.readonly,
                                                    array: [
                                                        {title: '唯獨', value: 'read'},
                                                        {title: '可寫', value: 'write'},
                                                        {title: '隱藏', value: 'block'},
                                                    ],
                                                    callback: (text) => {
                                                        dd.readonly = text
                                                        widget.refreshComponent()
                                                    }
                                                }),
                                                EditorElem.select({
                                                    title: "是否必填",
                                                    gvc: gvc,
                                                    def: dd.require,
                                                    array: [
                                                        {title: '是', value: 'true'},
                                                        {title: '否', value: 'false'}
                                                    ],
                                                    callback: (text) => {
                                                        dd.require = text
                                                        widget.refreshComponent()
                                                    }
                                                }),
                                                labelCSS.editor(gvc, () => {
                                                    widget.refreshComponent()
                                                }, 'Label樣式'),
                                                inputCSS.editor(gvc, () => {
                                                    widget.refreshComponent()
                                                }, '輸入框樣式'),
                                                containerCss.editor(gvc, () => {
                                                    widget.refreshComponent()
                                                }, '容器樣式')
                                            ].join('<div class="my-2"></div>')
                                        },
                                        expand: dd,
                                        minus: gvc.event(() => {
                                            config.array.splice(index, 1)
                                            widget.refreshComponent()
                                        })
                                    }
                                })
                            },
                            originalArray: config.array,
                            expand: widget.data,
                            plus: {
                                title: "新增選項",
                                event: gvc.event((e, event) => {
                                    config.array.push({
                                        title: '標題',
                                        key: '',
                                        readonly: 'write',
                                        type: 'text',
                                        require: 'true',
                                        style_data: {
                                            label: {
                                                class: `form-label fs-base `,
                                                style: ``
                                            },
                                            input: {
                                                class: ``,
                                                style: ``
                                            },
                                            container: {
                                                class: ``,
                                                style: ``
                                            }
                                        }
                                    })
                                    widget.refreshComponent()
                                })
                            },
                            refreshComponent: () => {
                                widget.refreshComponent()
                            }
                        })}</div>`
                    ].join('<div class="my-2"></div>')
                }
            }
        },
    }
})