import {HtmlJson, Plugin} from "../plugins/plugin-creater.js";
import {Glitter} from "../Glitter.js";
import {GVC} from "../GVController.js";
import {TriggerEvent} from "../plugins/trigger-event.js";
import {Editor} from "./editor.js";
import {EditorElem} from "../plugins/editor-elem.js";
//@ts-ignore
import autosize from "../plugins/autosize.js";
import {ShareDialog} from "../dialog/ShareDialog.js";

export const widgetComponent = {
    render: (gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], subData: any, htmlGenerate: any) => {
        const glitter = gvc.glitter
        widget.data.elem = widget.data.elem ?? "div"
        widget.data.inner = widget.data.inner ?? ""
        widget.data.attr = widget.data.attr ?? []
        widget.data.onCreateEvent = widget.data.onCreateEvent ?? {}
        const id = htmlGenerate.widgetComponentID
        subData = subData ?? {}
        let formData = subData
        return {
            view: () => {
                let re = false
                let innerText = widget.data.inner

                let createOption = {}

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
                                    return {key: dd.attr, value: eval(dd.value)}
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
                        option.push({key: 'src', value: innerText})
                    } else if (widget.data.elem === 'input') {
                        option.push({key: 'value', value: innerText})
                    }
                    return {
                        elem: widget.data.elem,
                        class: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).class() + ` ${(widget.hashTag) ? `glitterTag${widget.hashTag}` : ``} ${hoverID.indexOf(widget.id) !== -1 ? ` selectComponentHover` : ``}`,
                        style: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).style(),
                        option: option.concat(htmlGenerate.option),
                    }
                }

                if (widget.type === 'container') {
                    const glitter = (window as any).glitter
                    widget.data.setting.formData = widget.formData;
                    const htmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID, subData);
                    innerText = ''
                    return htmlGenerate.render(gvc, {
                        containerID: id, onCreate: () => {
                            TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: widget.data.onCreateEvent,
                                subData: subData
                            })
                        },
                        app_config: widget.global.appConfig,
                        page_config: widget.global.pageConfig
                    }, getCreateOption())
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
                        innerText = data
                        re = true
                        gvc.notifyDataChange(id)
                    })
                }
                return gvc.bindView(() => {
                    return {
                        bind: id,
                        view: () => {
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
                                            gvc: gvc, widget: widget, clickEvent: widget.data.selectAPI, subData: vm
                                        })
                                    } else {
                                        resolve(true)
                                    }
                                })
                                switch (widget.data.elem) {
                                    case 'select':
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
                            </option>`;
                                            }).join(''))
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
                                        break
                                    case 'img':
                                    case 'input':
                                        resolve(``)
                                        break
                                    default:
                                        resolve(innerText)
                                        break
                                }
                            })
                        },
                        divCreate: getCreateOption,
                        onCreate: () => {
                            TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: widget.data.onCreateEvent,
                                subData: subData
                            })
                            glitter.elementCallback[gvc.id(id)].updateAttribute()
                            if (widget.data.elem.toLowerCase() === 'textarea') {
                                autosize(gvc.getBindViewElem(id))
                            }
                        },
                        onInitial: () => {
                        }
                    }
                })
            },
            editor: () => {
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
                                                    let html = Editor.select({
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
                                                        html += (Editor.arrayItem({
                                                            gvc: gvc,
                                                            title: "選項集合",
                                                            originalArray: widget.data.selectList,
                                                            array: widget.data.selectList.map((dd: any, index: number) => {
                                                                dd.visible = dd.visible ?? 'visible'
                                                                return {
                                                                    title: dd.name || `區塊:${index + 1}`,
                                                                    expand: dd,
                                                                    innerHtml:
                                                                        glitter.htmlGenerate.editeInput({
                                                                            gvc: gvc,
                                                                            title: `參數標題`,
                                                                            default: dd.name,
                                                                            placeHolder: "輸入參數標題",
                                                                            callback: (text) => {
                                                                                dd.name = text
                                                                                widget.refreshComponent()
                                                                            }
                                                                        }) +
                                                                        glitter.htmlGenerate.editeInput({
                                                                            gvc: gvc,
                                                                            title: `Value`,
                                                                            default: dd.value,
                                                                            placeHolder: "輸入參數值",
                                                                            callback: (text) => {
                                                                                dd.value = text
                                                                                widget.refreshComponent()
                                                                            }
                                                                        }) +
                                                                        `${Editor.select({
                                                                            title: "參數可見度",
                                                                            gvc: gvc,
                                                                            def: dd.visible ?? 'visible',
                                                                            array: [
                                                                                {title: '隱藏', value: "invisible"},
                                                                                {title: '可選', value: "visible"}
                                                                            ],
                                                                            callback: (text) => {
                                                                                dd.visible = text
                                                                                widget.refreshComponent()
                                                                            }
                                                                        })}`
                                                                    ,
                                                                    minus: gvc.event(() => {
                                                                        list.splice(index, 1)
                                                                        widget.refreshComponent()
                                                                    })
                                                                }
                                                            }),
                                                            expand: widget.data,
                                                            plus: {
                                                                title: "添加區塊",
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
                                                        }) + (() => {
                                                            widget.data.dataFrom = widget.data.dataFrom ?? "static"
                                                            widget.data.innerEvenet = widget.data.innerEvenet ?? {}
                                                            return gvc.map([
                                                                Editor.select({
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
                                                        })())
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
                                                        Editor.select({
                                                            title: '內容取得',
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
                                                                return Editor.uploadImage({
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
                                                            if (['link'].indexOf(widget.data.elem) !== -1) {
                                                                return ``
                                                            } else {
                                                                return Editor.select({
                                                                    title: '內容取得',
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
                                        })(),

                                        `<div class="my-2"></div>`,
                                        TriggerEvent.editer(gvc, widget, widget.data.onCreateEvent, {
                                            hover: false,
                                            option: [],
                                            title: "[onCreate]建立事件"
                                        })
                                    ]),
                                `<div class="mx-n2 mt-2">${
                                    EditorElem.arrayItem({
                                        originalArray: widget.data.attr,
                                        gvc: gvc,
                                        title: '特徵值',
                                        array: () => {
                                            return widget.data.attr.map((dd: any, index: number) => {
                                                // TriggerEvent.editer(gvc, widget, widget.data)
                                                dd.type = dd.type ?? 'par'
                                                dd.attr = dd.attr ?? ""
                                                dd.attrType = dd.attrType ?? "normal"
                                                return {
                                                    title: dd.attr,
                                                    expand: dd,
                                                    innerHtml: ((gvc: GVC) => {
                                                        return gvc.map([
                                                            Editor.select({
                                                                title: "特徵類型",
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
                                                                    gvc.recreateView()
                                                                    widget.refreshComponent()
                                                                }
                                                            }),
                                                            (() => {
                                                                if (dd.type === 'par') {
                                                                    return gvc.map([
                                                                        Editor.searchInput({
                                                                            title: '特徵標籤',
                                                                            gvc: gvc,
                                                                            def: dd.attr,
                                                                            array: ['src', 'placeholder', 'href'],
                                                                            callback: (text: string) => {
                                                                                dd.attr = text
                                                                                widget.refreshComponent()
                                                                            },
                                                                            placeHolder: "請輸入特徵標籤"
                                                                        }),
                                                                        Editor.select({
                                                                            title: '特徵類型',
                                                                            gvc: gvc,
                                                                            def: dd.attrType,
                                                                            array: [
                                                                                {title: "一般", value: 'normal'},
                                                                                {title: "檔案連結", value: 'link'}],
                                                                            callback: (text: string) => {
                                                                                dd.attrType = text
                                                                                gvc.recreateView()
                                                                                widget.refreshComponent()
                                                                            }
                                                                        })
                                                                    ])
                                                                } else {
                                                                    return Editor.searchInput({
                                                                        title: '特徵標籤',
                                                                        gvc: gvc,
                                                                        def: dd.attr,
                                                                        array: ['onclick', 'oninput', 'onchange', 'ondrag'],
                                                                        callback: (text: string) => {
                                                                            dd.attr = text
                                                                            widget.refreshComponent()
                                                                        },
                                                                        placeHolder: "請輸入特徵標籤"
                                                                    })
                                                                }
                                                            })(),
                                                            (() => {
                                                                if (dd.type === 'par') {
                                                                    if ((['script', 'img'].indexOf(widget.data.elem) !== -1 && (dd.attr === 'src')) || dd.attrType === 'link') {
                                                                        return Editor.uploadFile({
                                                                            title: "資源路徑",
                                                                            gvc: gvc,
                                                                            def: dd.value ?? '',
                                                                            callback: (text) => {
                                                                                dd.value = text
                                                                                gvc.recreateView()
                                                                                widget.refreshComponent()
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
                                                                                    {title: '帶入值', value: "manual"},
                                                                                    {title: '程式碼', value: "code"}
                                                                                ],
                                                                                callback: (text) => {
                                                                                    dd.valueFrom = text
                                                                                    gvc.recreateView()
                                                                                    widget.refreshComponent()
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
                                                                                            widget.refreshComponent()
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
                                                                                            widget.refreshComponent()
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
                                                        ])
                                                    }),
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
                                        }
                                    })
                                }</div>`
                            ].join('')
                        }
                    }
                });
            },
        };
    }
}
