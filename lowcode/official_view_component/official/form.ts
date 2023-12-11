import {HtmlJson, Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {Glitter} from "../../glitterBundle/Glitter.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {getInitialData} from "../initial_data.js";

export class FormWidget {
    public static settingView(obj: {
        gvc: GVC,
        array: any,
        refresh: () => void,
        widget?: any,
        subData?: any,
        title?:string
    }) {
        const gvc = obj.gvc
        const array = obj.array
        const glitter = obj.gvc.glitter;
        return EditorElem.arrayItem({
            title: obj.title ?? "表單項目",
            gvc: gvc,
            array: () => {
                return array.map((dd: any, index: number) => {
                    return {
                        title: dd.title ?? `選項.${index + 1}`,
                        innerHtml: (gvc: GVC) => {
                            const labelCSS = glitter.htmlGenerate.editor_component(dd.style_data.label, gvc, obj.widget, obj.subData)
                            const inputCSS = glitter.htmlGenerate.editor_component(dd.style_data.input, gvc, obj.widget, obj.subData)
                            const containerCss = glitter.htmlGenerate.editor_component(dd.style_data.container, gvc, obj.widget, obj.subData)
                            return [
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: 'Label名稱',
                                    placeHolder: `請輸入Label名稱`,
                                    default: dd.title,
                                    callback: (text) => {
                                        dd.title = text
                                        obj.refresh()
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
                                        {title: '密碼', value: 'password'},
                                        {title: '多項列表元件', value: 'array'},
                                        {title: '檔案上傳', value: 'file'}
                                    ],
                                    callback: (text) => {
                                        dd.type = text
                                        gvc.recreateView()
                                        obj.refresh()
                                    }
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: 'Key標籤',
                                    placeHolder: `請輸入Key標籤`,
                                    default: dd.key,
                                    callback: (text) => {
                                        dd.key = text
                                        obj.refresh()
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
                                        obj.refresh()
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
                                        obj.refresh()
                                    }
                                }),
                                ...(() => {
                                    if (dd.type === 'array') {
                                        return [
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '選項標題參照',
                                                placeHolder: `請輸入選項標題參照`,
                                                default: dd.referTitile,
                                                callback: (text) => {
                                                    dd.referTitile = text
                                                    obj.refresh()
                                                }
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '添加按鈕標題',
                                                placeHolder: `請輸入添加按鈕標題`,
                                                default: dd.plusBtn,
                                                callback: (text) => {
                                                    dd.plusBtn = text
                                                    obj.refresh()
                                                }
                                            }),
                                            EditorElem.editerDialog({
                                                gvc: gvc,
                                                dialog: (gvc: GVC) => {
                                                    dd.formList = dd.formList ?? []
                                                    return `<div class="m-n2">${
                                                        FormWidget.settingView({
                                                            gvc: gvc,
                                                            array: dd.formList,
                                                            refresh: () => {
                                                                gvc.recreateView()
                                                            },
                                                            widget: obj.widget,
                                                            subData: obj.subData,
                                                        })
                                                    }</div>`
                                                },
                                                width: '400px',
                                                editTitle: "編輯多項列表"
                                            })
                                        ]
                                    } else {
                                        return []
                                    }
                                })(),
                                ...(() => {
                                    if (dd.type === 'array') {
                                        return [
                                            containerCss.editor(gvc, () => {
                                                obj.refresh()
                                            }, '容器樣式'),
                                            inputCSS.editor(gvc, () => {
                                                obj.refresh()
                                            }, '添加按鈕樣式'),
                                            containerCss.editor(gvc, () => {
                                                obj.refresh()
                                            }, '容器樣式')
                                        ]
                                    } else {
                                        return [
                                            labelCSS.editor(gvc, () => {
                                                obj.refresh()
                                            }, 'Label樣式'),
                                            inputCSS.editor(gvc, () => {
                                                obj.refresh()
                                            }, '輸入框樣式'),
                                            containerCss.editor(gvc, () => {
                                                obj.refresh()
                                            }, '容器樣式')
                                        ]
                                    }
                                })()

                            ].join('<div class="my-2"></div>')
                        },
                        expand: dd,
                        minus: gvc.event(() => {
                            array.splice(index, 1)
                            obj.refresh()
                        })
                    }
                })
            },
            originalArray: array,
            expand: {},
            plus: {
                title: "新增選項",
                event: gvc.event((e, event) => {
                    array.push({
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
                    obj.refresh()
                })
            },
            refreshComponent: () => {
                obj.refresh()
            }
        })
    }

    public static editorView(obj: {
        gvc: GVC,
        array: any,
        refresh: (key:string) => void,
        widget?: any,
        subData?: any,
        formData: any
    }) {
        const html = String.raw
        const glitter = obj.gvc.glitter
        const gvc = obj.gvc
        const formData = obj.formData
        return obj.array.map((dd: any) => {
            const labelCSS = glitter.htmlGenerate.editor_component(dd.style_data.label, gvc, obj.widget, obj.subData)
            const inputCSS = glitter.htmlGenerate.editor_component(dd.style_data.input, gvc, obj.widget as any, obj.subData)
            const containerCss = glitter.htmlGenerate.editor_component(dd.style_data.container, gvc, obj.widget, obj.subData)
            const label = `<label class="${labelCSS.class()}" style="${labelCSS.style()}"><span class="text-danger  ${dd.require === "true" ? `` : 'd-none'}"> * </span>${dd.title}</label>`
            const containerClass = containerCss.class() ?? ``
            const containerStyle = containerCss.style() ?? ``
            const inputClass = inputCSS.class() ?? "form-control"
            const inputStyle = inputCSS.style() ?? ""
            switch (dd.type) {
                case "textArea":
                    return html`
                        <div class="${containerClass}" style="${containerStyle}">
                            ${label}
                            <textarea class="${inputClass}"
                                      style="${inputStyle}"
                                      onchange="${gvc.event((e, event) => {
                                          formData[dd.key] = e.value
                                          obj.refresh(dd.key)
                                      })}">
${formData[dd.key] ?? ""}
</textarea>
                        </div>`
                case "array":
                    formData[dd.key] = formData[dd.key] ?? []
                    return gvc.bindView(() => {
                        const arrayViewID = gvc.glitter.getUUID()
                        return {
                            bind: arrayViewID,
                            view: () => {
                                return html`
                                    <div class="${containerClass} mt-2" style="${containerStyle}">
                                        ${label}
                                        ${EditorElem.arrayItem({
                                            gvc: gvc,
                                            title: '',
                                            array: () => {
                                                return formData[dd.key].map((d2: any, index: number) => {
                                                    return {
                                                        title: d2[dd.referTitile] || `選項:${index + 1}`,
                                                        innerHtml: (gvc: GVC) => {
                                                            return `<div class="my-2">${FormWidget.editorView({
                                                                gvc: gvc,
                                                                array: dd.formList,
                                                                refresh: (key:string) => {
                                                                    obj.refresh(dd.key)
                                                                },
                                                                widget: obj.widget,
                                                                subData: obj.subData,
                                                                formData: d2
                                                            })}</div>`
                                                        }
                                                    }
                                                })
                                            },
                                            originalArray: formData[dd.key],
                                            expand: {},
                                            refreshComponent: () => {
                                                obj.refresh(dd.key)
                                                gvc.notifyDataChange(arrayViewID)
                                            },
                                            plus: {
                                                title: dd.plusBtn,
                                                event: gvc.event(() => {
                                                    formData[dd.key].push({})
                                                    gvc.notifyDataChange(arrayViewID)
                                                })
                                            }
                                        })}
                                    </div>`
                            }
                        }
                    })
                case 'file':
                    return EditorElem.uploadFile({
                        title:label,
                        gvc:gvc,
                        def:formData[dd.key] ,
                        callback:(text)=>{
                            formData[dd.key]=text
                            obj.refresh(dd.key)
                        }
                    })
                default:
            }
            return html`
                <div class="${containerClass}" style="${containerStyle}">
                    ${label}
                    <input type="${dd.type}" value="${formData[dd.key] ?? ""}"
                           class="${inputClass}"
                           style="${inputStyle}" onchange="${gvc.event((e, event) => {
                        formData[dd.key] = e.value
                        obj.refresh(dd.key)
                    })}">
                </div>`
        }).join('')
    }
}

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
                        function checkEditFinish() {
                            return !config.array.find((dd) => {
                                return (dd.require === 'true') && (!formData[dd.key])
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
                                return FormWidget.editorView({
                                    gvc: gvc,
                                    array: config.array,
                                    refresh: (key) => {
                                        widget.refreshComponent()
                                    },
                                    widget: widget,
                                    subData: subData,
                                    formData: formData
                                })
                            },
                            divCreate: {
                                class: `formID-${config.formID}`
                            },
                            onCreate: () => {
                                (document.querySelector(`.formID-${config.formID}`) as any).formValue = () => {
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
                        `<div class="mx-n2 ">${FormWidget.settingView({
                            gvc: gvc,
                            array: config.array,
                            refresh: () => {
                                widget.refreshComponent()
                            },
                            widget: widget,
                            subData: subData
                        })}</div>`
                    ].join('<div class="my-2"></div>')
                }
            }
        },
    }
})

