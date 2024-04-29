import {HtmlJson, Plugin} from "../plugins/plugin-creater.js";
import {Glitter} from "../Glitter.js";
import {GVC} from "../GVController.js";
import {TriggerEvent} from "../plugins/trigger-event.js";
import {EditorElem} from "../plugins/editor-elem.js";
//@ts-ignore
import autosize from "../plugins/autosize.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {Storage} from "../helper/storage.js";
import {NormalPageEditor} from "../../editor/normal-page-editor.js";

export const widgetComponent = {
    render: (gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], sub: any, htmlGenerate: any, document?: any) => {
        const rootHtmlGenerate = htmlGenerate;
        const glitter = gvc.glitter;
        if (widget.data.onCreateEvent) {
            (widget as any).onCreateEvent = widget.data.onCreateEvent;
            widget.data.onCreateEvent = undefined;
        }
        widget.data.elem = widget.data.elem ?? "div"
        widget.data.inner = widget.data.inner ?? ""
        widget.data.attr = widget.data.attr ?? []
        const id = htmlGenerate.widgetComponentID
        const subData = sub ?? {};
        let formData = subData;

        return {
            view: () => {
                let innerText = widget.data.inner

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
                    let classList = []
                    if ((window.parent as any).editerData !== undefined && htmlGenerate.root) {
                        classList.push(`editorParent`)
                        classList.push(`relativePosition`)
                    }

                    classList.push(glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).class())
                    widget.hashTag && classList.push(`glitterTag${widget.hashTag}`);

                    return {
                        elem: widget.data.elem,
                        class: classList.join(' '),
                        style: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget as any, subData).style()+` ${((window.parent as any).editerData !== undefined) ? `${((widget as any).visible===false) ? `display:none;`:``}`:``}`,
                        option: option.concat(htmlGenerate.option),
                    }
                }

                if (widget.type === 'container') {
                    const glitter = (window as any).glitter
                    widget.data.setting.formData = widget.formData;

                    function getView() {
                        const htmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID, subData, rootHtmlGenerate.root);
                        innerText = ''
                        return htmlGenerate.render(gvc, {
                            containerID: id,
                            onCreate: () => {
                                TriggerEvent.trigger({
                                    gvc,
                                    widget: widget as any,
                                    clickEvent: (widget as any).onCreateEvent,
                                    subData: subData
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
                            app_config: widget.global.appConfig,
                            page_config: widget.global.pageConfig,
                            document: document,
                            editorSection:widget.id
                        }, getCreateOption())
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
                            return new Promise(async (resolve, reject) => {
                                const html = String.raw;
                                let view = [
                                    await new Promise(async (resolve, reject) => {
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
                                ];
                                if((window.parent as any).editerData !== undefined && htmlGenerate.root){
                                    view.push(glitter.htmlGenerate.getEditorSelectSection({
                                        id:widget.id,
                                        gvc:gvc,
                                        label:widget.label
                                    }));
                                }

                                resolve(view.join(''))
                            })
                        },
                        divCreate: getCreateOption,
                        onCreate: () => {
                            glitter.elementCallback[gvc.id(id)].updateAttribute()
                            if (widget.data.elem.toLowerCase() === 'textarea') {
                                autosize(gvc.getBindViewElem(id).get(0))
                            }
                            TriggerEvent.trigger({
                                gvc,
                                widget: widget as any,
                                clickEvent: (widget as any).onCreateEvent,
                                subData: subData
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
                                                                        structStart:`((gvc,widget,object,subData,element)=>{`
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
