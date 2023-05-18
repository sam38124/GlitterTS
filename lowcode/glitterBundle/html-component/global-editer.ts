import {HtmlJson, Plugin} from "../plugins/plugin-creater.js";
import {Glitter} from "../Glitter.js";
import {GVC} from "../GVController.js";
import {TriggerEvent} from "../plugins/trigger-event.js";
import {Editor} from "./editor.js";
export const globalEditer = {
    render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData:any) => {
        const glitter=gvc.glitter
        widget.data.elem = widget.data.elem ?? "h3"
        widget.data.inner = widget.data.inner ?? ""
        widget.data.attr = widget.data.attr ?? []
        const id = subData.widgetComponentID
        subData = subData ?? {}
        let formData = subData
        if((widget.data.dataFrom==="code")){
            widget.data.innerEvenet=widget.data.innerEvenet??{}
            TriggerEvent.trigger({
                gvc: gvc,
                widget: widget,
                clickEvent: widget.data.innerEvenet
            }).then((data) => {
                if(widget.data.elem === 'select'){
                    formData[widget.data.key]=data
                }
                widget.data.inner=data
                gvc.notifyDataChange(id)
            })
        }

        return {
            view: () => {
                return {}
            },
            editor: () => {
                widget.type = widget.type ?? "elem"
                widget.data.elemExpand = widget.data.elemExpand ?? []
                widget.data.atrExpand = widget.data.atrExpand ?? {}
                return gvc.map([
                    `<div class="mt-2"></div>`,
                    Editor.toggleExpand({
                        gvc: gvc,
                        title: '元件設定',
                        data: widget.data.elemExpand,
                        innerText: () => {
                            return gvc.map([
                                glitter.htmlGenerate.styleEditor(widget.data).editor(gvc, () => {
                                    widget.refreshComponent()
                                }, '元素設計樣式'),
                                Editor.searchInput({
                                    title: 'HTML元素標籤',
                                    gvc: gvc,
                                    def: widget.data.elem,
                                    array: ['button', 'h1', 'h2', 'h3', 'h4', 'h5', 'li', 'ul', 'table', 'div', 'header', 'section', 'span', 'p', 'a', 'img'
                                        , 'input', 'select'],
                                    callback: (text: string) => {
                                        widget.data.elem = text
                                        widget.refreshComponent()
                                    },
                                    placeHolder: "請輸入元素標籤"
                                }),
                                (() => {
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
                                                    title: 'API', value: 'api'
                                                }],
                                                callback: (text) => {
                                                    widget.data.selectType = text;
                                                    widget.refreshComponent()
                                                }
                                            })
                                            if (widget.data.selectType === 'manual') {
                                                html += `<div class="alert alert-dark mt-2 p-2">${(Editor.arrayItem({
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
                                                                }) + glitter.htmlGenerate.editeInput({
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
                                                }) + (()=>{
                                                    widget.data.dataFrom=widget.data.dataFrom??"static"
                                                    widget.data.innerEvenet=widget.data.innerEvenet??{}
                                                    return gvc.map([
                                                        Editor.select({
                                                            title: '預設值',
                                                            gvc: gvc,
                                                            def:widget.data.dataFrom,
                                                            array: [{
                                                                title: "靜態",
                                                                value: "static"
                                                            }, {
                                                                title: "程式碼",
                                                                value: "code"
                                                            }],
                                                            callback: (text) => {
                                                                widget.data.dataFrom= text;
                                                                widget.refreshComponent();
                                                            }
                                                        }),
                                                        (()=>{
                                                            if(widget.data.dataFrom === 'static'){
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
                                                            }else{
                                                                return TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                    option: [],
                                                                    hover: false,
                                                                    title: "程式碼"
                                                                })
                                                            }
                                                        })()
                                                    ])
                                                })())}</div>`
                                            } else {
                                                widget.data.selectAPI = widget.data.selectAPI ?? {}
                                                html += TriggerEvent.editer(gvc, widget, widget.data.selectAPI, {
                                                    hover: true,
                                                    option: [],
                                                    title: "選擇API"
                                                })
                                            }
                                            return `<div class="alert  mt-2 p-2"  style="background-color: #262677;">${html}</div>`
                                        case 'img':
                                            widget.data.dataFrom=widget.data.dataFrom??"static"
                                            widget.data.innerEvenet=widget.data.innerEvenet??{}
                                            return gvc.map([
                                                Editor.select({
                                                    title: '內容取得',
                                                    gvc: gvc,
                                                    def:widget.data.dataFrom,
                                                    array: [{
                                                        title: "靜態",
                                                        value: "static"
                                                    }, {
                                                        title: "程式碼",
                                                        value: "code"
                                                    }],
                                                    callback: (text) => {
                                                        widget.data.dataFrom= text;
                                                        widget.refreshComponent();
                                                    }
                                                }),
                                                (()=>{
                                                    if(widget.data.dataFrom === 'static'){
                                                        return Editor.uploadImage({
                                                            title:'選擇圖片',
                                                            gvc:gvc,
                                                            def: widget.data.inner ?? "",
                                                            callback:(data:string)=>{
                                                                widget.data.inner = data
                                                                widget.refreshComponent()
                                                            }
                                                        })
                                                    }else{
                                                        return TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                            option: [],
                                                            hover: false,
                                                            title: "程式碼"
                                                        })
                                                    }
                                                })()
                                            ])
                                        default:
                                            widget.data.dataFrom=widget.data.dataFrom??"static"
                                            widget.data.innerEvenet=widget.data.innerEvenet??{}
                                            return gvc.map([
                                                Editor.select({
                                                    title: '內容取得',
                                                    gvc: gvc,
                                                    def:widget.data.dataFrom,
                                                    array: [{
                                                        title: "靜態",
                                                        value: "static"
                                                    }, {
                                                        title: "程式碼",
                                                        value: "code"
                                                    }],
                                                    callback: (text) => {
                                                        widget.data.dataFrom= text;
                                                        widget.refreshComponent();
                                                    }
                                                }),
                                                (()=>{
                                                    if(widget.data.dataFrom === 'static'){
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
                                                    }else{
                                                        return TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                            option: [],
                                                            hover: false,
                                                            title: "程式碼"
                                                        })
                                                    }
                                                })()
                                            ])
                                    }
                                })()
                            ])
                        }
                    }),
                    Editor.arrayItem({
                        originalArray: widget.data.attr,
                        gvc: gvc,
                        title: '特徵值',
                        array: widget.data.attr.map((dd: any, index: number) => {
                            // TriggerEvent.editer(gvc, widget, widget.data)
                            dd.type = dd.type ?? "par"
                            dd.attr = dd.attr ?? ""
                            return {
                                title: dd.attr ?? `特徵:${index + 1}`,
                                expand: dd,
                                innerHtml: (() => {
                                    return gvc.map([
                                        Editor.select({
                                            title: "特徵類型",
                                            gvc: gvc,
                                            def: dd.type,
                                            array: [{
                                                title: '參數', value: 'par'
                                            }, {
                                                title: '事件', value: 'event'
                                            }],
                                            callback: (text) => {
                                                dd.type = text
                                                widget.refreshComponent()
                                            }
                                        }),
                                        (()=>{
                                            if (dd.type === 'par') {
                                                return  Editor.searchInput({
                                                    title: '特徵標籤',
                                                    gvc: gvc,
                                                    def: dd.attr,
                                                    array: ['onclick', 'oninput', 'onchange', 'ondrag','placeholder'],
                                                    callback: (text: string) => {
                                                        dd.attr = text
                                                        widget.refreshComponent()
                                                    },
                                                    placeHolder: "請輸入特徵標籤"
                                                })
                                            }else{
                                                return  Editor.searchInput({
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
                                        })()
                                        ,
                                        (() => {
                                            if (dd.type === 'par') {
                                                return glitter.htmlGenerate.editeText({
                                                    gvc: gvc,
                                                    title: '參數編輯',
                                                    default: dd.value ?? "",
                                                    placeHolder: "輸入參數內容",
                                                    callback: (text) => {
                                                        dd.value = text
                                                        widget.refreshComponent()
                                                    }
                                                })
                                            } else {
                                                return TriggerEvent.editer(gvc, widget, dd, {
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
                        }),
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
                ]);
            },
        };
    }
}