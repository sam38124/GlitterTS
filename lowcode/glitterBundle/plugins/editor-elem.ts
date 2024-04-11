import {ShareDialog} from '../dialog/ShareDialog.js';

import {Swal} from "../module/sweetAlert.js";
import {GVC} from "../GVController.js";
//@ts-ignore
import autosize from "./autosize.js";
import {BaseApi} from "../api/base.js";


export class EditorElem {
    public static uploadImage(obj: { title: string; gvc: GVC; def: string; callback: (data: string) => void }) {
        const glitter = (window as any).glitter;
        const $ = glitter.$;
        return `${EditorElem.h3(obj.title)}
${
            obj.gvc.bindView(() => {
                const id = glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return ` <input
                    class="flex-fill form-control "
                    placeholder="請輸入圖片連結"
                    value="${obj.def}"
                    onchange="${obj.gvc.event((e: any) => {
                            obj.callback(e.value);
                        })}"
                />
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
               <i class="fa-regular fa-eye text-black ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
                            glitter.openDiaLog(new URL('../../dialog/image-preview.js', import.meta.url).href, 'preview', obj.def)
                        })}"></i>
                <i
                    class="fa-regular fa-upload  ms-2 text-black"
                    style="cursor: pointer;"
                    onclick="${obj.gvc.event(() => {
                            glitter.ut.chooseMediaCallback({
                                single: true,
                                accept: 'json,image/*',
                                callback(data: any) {
                                    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                                    const dialog = new ShareDialog(obj.gvc.glitter);
                                    dialog.dataLoading({visible: true});
                                    const file = data[0].file;
                                    saasConfig.api.uploadFile(file.name).then((data: any) => {
                                        dialog.dataLoading({visible: false});
                                        const data1 = data.response;
                                        dialog.dataLoading({visible: true});
                                        BaseApi.create({
                                            url: data1.url,
                                            type: 'put',
                                            data: file,
                                            headers: {
                                                "Content-Type": data1.type
                                            }
                                        }).then((res) => {
                                            if (res.result) {
                                                dialog.dataLoading({visible: false});
                                                obj.callback(data1.fullUrl);
                                                obj.def = data1.fullUrl;
                                                obj.gvc.notifyDataChange(id)
                                            } else {
                                                dialog.dataLoading({visible: false});
                                                dialog.errorMessage({text: '上傳失敗'});
                                            }
                                        })
                                    });
                                },
                            });
                        })}"
                ></i>`
                    },
                    divCreate: {
                        class: `d-flex align-items-center mb-2`
                    }
                }
            })
        }
            `;
    }

    public static fileUploadEvent(file: string, callback: (link: string) => void) {
        const glitter = (window as any).glitter
        glitter.ut.chooseMediaCallback({
            single: true,
            accept: file,
            callback(data: any) {
                const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                const dialog = new ShareDialog(glitter);
                dialog.dataLoading({visible: true});
                const file = data[0].file;
                saasConfig.api.uploadFile(file.name).then((data: any) => {
                    dialog.dataLoading({visible: false});
                    const data1 = data.response;
                    dialog.dataLoading({visible: true});
                    BaseApi.create({
                        url: data1.url,
                        type: 'put',
                        data: file,
                        headers: {
                            "Content-Type": data1.type
                        }
                    }).then((res) => {
                        if (res.result) {
                            dialog.dataLoading({visible: false});
                            callback(data1.fullUrl);
                        } else {
                            dialog.dataLoading({visible: false});
                            dialog.errorMessage({text: '上傳失敗'});
                        }
                    })
                });
            },
        });
    }

    public static flexMediaManager(obj: {
        gvc: GVC,
        data: string[]
    }) {
        obj.gvc.addStyle(`.p-hover-image:hover{
  opacity: 1 !important; /* 在父元素悬停时，底层元素可见 */
}`)
        const data = obj.data
        return obj.gvc.bindView(() => {
            obj.gvc.addMtScript([{
                src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`
            }], () => {
            }, () => {
            })
            const id = obj.gvc.glitter.getUUID()
            const bid = obj.gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    if (data.length === 0) {
                        return `<div class="w-100 d-flex align-items-center justify-content-center fw-bold fs-6 alert bgf6">
尚未新增任何檔案...
</div>`
                    }
                    return obj.gvc.glitter.html`
<div class="" style="gap:10px; ">
<ul id="${bid}" class="d-flex " style="gap:10px;overflow-x: auto;">
${data.map((dd, index) => {
                        return `<li class="d-flex align-items-center justify-content-center rounded-3 shadow" index="${index}" style="min-width:135px;135px;height:135px;cursor:pointer;
background: 50%/cover url('${dd}');
">
<div class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image" style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;">
<i class="fa-regular fa-eye" onclick="${obj.gvc.event(() => {
                            obj.gvc.glitter.openDiaLog(new URL('../../dialog/image-preview.js', import.meta.url).href, 'preview', dd)
                        })}"></i>
<i class="fa-regular fa-trash" onclick="${obj.gvc.event(() => {
                            data.splice(index, 1)
                            obj.gvc.notifyDataChange(id)
                        })}"></i>
</div>
</li>`
                    }).join('')}
  </ul>
</div>
`
                },
                divCreate: {class: `w-100`, style: `overflow-x: auto;display: inline-block;white-space: nowrap; `},
                onCreate: () => {
                    const interval = setInterval(() => {
                        if ((window as any).Sortable) {
                            try {
                                obj.gvc.addStyle(`ul {
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
                                Sortable.create(document.getElementById(bid), {
                                    group: 'foo',
                                    animation: 100,
                                    // Called when dragging element changes position
                                    onChange: function (evt: any) {
                                        swapArr(data, startIndex, evt.newIndex)
                                        startIndex = evt.newIndex
                                        console.log(`change--`, data)
                                    },
                                    onStart: function (evt: any) {
                                        startIndex = evt.oldIndex

                                        console.log(`oldIndex--`, startIndex)
                                    }
                                });
                            } catch (e) {
                            }
                            clearInterval(interval)
                        }
                    }, 100)
                }
            }
        })
    }

    public static editeText(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void, readonly?: boolean }) {
        obj.title = obj.title ?? ""
        const html = String.raw
        const id = obj.gvc.glitter.getUUID()
        return html`${EditorElem.h3(obj.title)}
        ${obj.gvc.bindView({
            bind: id,
            view: () => {
                return obj.default ?? ''
            },
            divCreate: {
                elem: `textArea`,
                style: `max-height:400px!important;min-height:100px;`,
                class: `form-control`, option: [
                    {key: 'placeholder', value: obj.placeHolder},
                    {
                        key: 'onchange', value: obj.gvc.event((e) => {
                            obj.callback(e.value);
                        })
                    }
                ]
            },
            onCreate: () => {
                //@ts-ignore
                autosize(obj.gvc.getBindViewElem(id))
            }
        })}`;
    }

    public static styleEditor(obj: {
        gvc: GVC
        height: number,
        initial: string,
        title: string,
        dontRefactor?: boolean,
        callback: (data: string) => void
    }) {
        let idlist: any = []

        function getComponent(gvc: GVC, height: number) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID()
                idlist.push(id)
                const frameID = obj.gvc.glitter.getUUID()
                console.log(`frameID-->`, frameID)
                const domain = 'https://sam38124.github.io/code_component'
                let listener = function (event: any) {
                    if (event.data.type === 'initial') {
                        const childWindow = (document.getElementById(frameID)! as any).contentWindow!!;

                        function addNewlineAfterSemicolon(inputString: string) {
                            // 使用正则表达式将分号后面没有换行的地方替换为分号和换行符
                            const regex = /;/g;
                            const resultString = inputString.replace(regex, ';\n');
                            return resultString;
                        }

                        childWindow.postMessage({
                            type: 'getData',
                            value: obj.dontRefactor ? obj.initial : `style {
${addNewlineAfterSemicolon(obj.initial)}
}`,
                            language: 'css',
                            refactor: !obj.dontRefactor
                        }, domain);
                    } else if (event.data.data.callbackID === id) {
                        if (obj.dontRefactor) {
                            obj.initial = event.data.data.value
                            obj.callback(event.data.data.value)
                        } else {
                            const array = event.data.data.value.split('\n')
                            const cb = array.filter((dd: any, index: number) => {
                                return index !== 0 && index !== (array.length - 1)
                            }).join('')
                            obj.callback(cb)
                            obj.initial = cb
                        }

                    }
                }
                return {
                    bind: id,
                    view: () => {
                        return gvc.glitter.html`<iframe id="${frameID}" class="w-100 h-100 border rounded-3"
                                    src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"></iframe>`
                    },
                    divCreate: {class: `w-100 `, style: `height:${height}px;`},
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                        gvc.glitter.share.postMessageCallback.push({
                            fun: listener,
                            id: frameID
                        })
                    }
                }
            })
        }

        return obj.gvc.glitter.html`
        <div class="d-flex">
        ${(obj.title ? EditorElem.h3(obj.title) : '')}
        <div class="d-flex align-items-center justify-content-center" style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
        onclick="${obj.gvc.event(() => {
            EditorElem.openEditorDialog(obj.gvc, (gvc: GVC) => {
                return getComponent(gvc, window.innerHeight - 100)
            }, () => {
                obj.gvc.notifyDataChange(idlist)
            })
        })}"><i class="fa-solid fa-expand"></i></div>
</div>
        ` + getComponent(obj.gvc, obj.height)
    }

    public static htmlEditor(obj: {
        gvc: GVC
        height: number,
        initial: string,
        title: string,
        dontRefactor?: boolean,
        callback: (data: string) => void
    }) {
        let idlist: any = []

        function getComponent(gvc: GVC, height: number) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID()
                idlist.push(id)
                const frameID = obj.gvc.glitter.getUUID()
                const domain = 'https://sam38124.github.io/code_component'
                let listener = function (event: any) {
                    if (event.data.type === 'initial') {
                        const childWindow = (document.getElementById(frameID)! as any).contentWindow!!;
                        childWindow.postMessage({
                            type: 'getData',
                            value: obj.initial,
                            language: 'html',
                            refactor: !obj.dontRefactor
                        }, domain);
                    } else if (event.data.data.callbackID === id) {
                        obj.initial = event.data.data.value
                        obj.callback(event.data.data.value)
                    }
                }
                return {
                    bind: id,
                    view: () => {
                        return gvc.glitter.html`
                            <iframe id="${frameID}" class="w-100 h-100 border rounded-3"
                                    src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"></iframe>
                        `
                    },
                    divCreate: {class: `w-100 `, style: `height:${height}px;`},
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                        gvc.glitter.share.postMessageCallback.push({
                            fun: listener,
                            id: frameID
                        })
                    }
                }
            })
        }

        return obj.gvc.glitter.html`
        <div class="d-flex">
        ${(obj.title ? EditorElem.h3(obj.title) : '')}
        <div class="d-flex align-items-center justify-content-center" style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
        onclick="${obj.gvc.event(() => {
            EditorElem.openEditorDialog(obj.gvc, (gvc: GVC) => {
                return getComponent(gvc, window.innerHeight - 100)
            }, () => {
                obj.gvc.notifyDataChange(idlist)
            })
        })}"><i class="fa-solid fa-expand"></i></div>
</div>
        ` + getComponent(obj.gvc, obj.height)
    }

    public static pageEditor(cf: {
        page: string,
        width: number,
        height: number,
        par: { key: string, value: string }[]
    }) {
        const href = new URL(location.href)
        href.searchParams.set('page', cf.page)
        href.searchParams.set('type', 'editor')
        href.searchParams.set('editorPosition', '0')
        href.searchParams.set('blogEditor', "true")
        cf.par.map((dd) => {
            href.searchParams.set(dd.key, dd.value)
        })
        return `<iframe class="rounded-3" src="${href.href}" style="border: none;width:${cf.width}px;height:${cf.height}px;"></iframe>`
    }

    public static iframeComponent(cf: {
        page: string,
        width: number,
        height: number,
        par: { key: string, value: string }[]
    }) {
        const href = new URL(location.href)
        href.searchParams.set('page', cf.page)
        href.searchParams.delete('type')
        href.searchParams.delete('router')
        cf.par.map((dd) => {
            href.searchParams.set(dd.key, dd.value)
        })
        return `<iframe class="rounded-3" src="${href.href}" style="border: none;width:${cf.width}px;height:${cf.height}px;"></iframe>`
    }

    public static codeEventListener = () => {

    }

    public static codeEditor(obj: {
        gvc: GVC
        height: number,
        initial: string,
        title: string,
        callback: (data: string) => void,
        structStart?: string,
        structEnd?: string
    }) {
        const codeID = obj.gvc.glitter.getUUID()

        function getComponent(gvc: GVC, height: number) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID()
                const frameID = obj.gvc.glitter.getUUID()
                const domain = 'https://sam38124.github.io/code_component'
                let listener = function (event: any) {
                    if (event.data.type === 'initial') {
                        console.log(frameID)
                        const childWindow = (document.getElementById(frameID)! as any).contentWindow!!;
                        childWindow.postMessage({
                            type: 'getData',
                            value: `${(obj.structStart) ? obj.structStart : `(()=>{`}
${obj.initial ?? ""}
${(obj.structEnd) ? obj.structEnd : "})()"}`,
                            language: 'javascript',
                            refactor: true
                        }, domain);
                    } else if (event.data.data.callbackID === id) {
                        const array = event.data.data.value.split('\n')
                        const data = array.filter((dd: any, index: number) => {
                            return index !== 0 && index !== (array.length - 1)
                        }).join('\n')
                        obj.initial = data
                        obj.callback(data)
                    }
                }
                return {
                    bind: id,
                    view: () => {
                        return html`
                            <iframe id="${frameID}" class="w-100 h-100 border rounded-3"
                                    src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"></iframe>
                        `
                    },
                    divCreate: {class: `w-100 `, style: `height:${height}px;`},
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                        gvc.glitter.share.postMessageCallback.push({
                            fun: listener,
                            id: frameID
                        })
                    }
                }
            })
        }

        const html = String.raw
        return obj.gvc.bindView(() => {
            return {
                bind: codeID,
                view: () => {
                    return html`
                        <div class="d-flex">
                            ${(obj.title ? EditorElem.h3(obj.title) : '')}
                            <div class="d-flex align-items-center justify-content-center"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                 onclick="${obj.gvc.event(() => {
                                     EditorElem.openEditorDialog(obj.gvc, (gvc: GVC) => {
                                         return getComponent(gvc, window.innerHeight - 100)
                                     }, () => {
                                         obj.gvc.notifyDataChange(codeID)
                                     })
                                 })}"><i class="fa-solid fa-expand"></i></div>
                        </div>` + getComponent(obj.gvc, obj.height)
                }
            }
        })

    }

    public static customCodeEditor(obj: {
        gvc: GVC
        height: number,
        initial: string,
        language: string,
        title: string,
        callback: (data: string) => void
    }) {
        let idlist: any = []

        function getComponent(gvc: GVC, height: number) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID()
                const frameID = obj.gvc.glitter.getUUID()
                idlist.push(id)
                const domain = 'https://sam38124.github.io/code_component'
                return {
                    bind: id,
                    view: () => {
                        return html`
                            <iframe id="${frameID}" class="w-100 h-100 border rounded-3"
                                    src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"></iframe>
                        `
                    },
                    divCreate: {class: `w-100 `, style: `height:${height}px;`},
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd: any) => {
                            return dd.id === frameID
                        })
                        gvc.glitter.share.postMessageCallback.push({
                            fun: (event: any) => {
                                if (event.data.type === 'initial') {
                                    if ((document.getElementById(frameID)! as any)) {
                                        const childWindow = (document.getElementById(frameID)! as any).contentWindow!!;
                                        childWindow.postMessage({
                                            type: 'getData',
                                            value: obj.initial ?? "",
                                            language: obj.language,
                                            refactor: true
                                        }, domain);
                                    }

                                } else if (event.data.data.callbackID === id) {
                                    obj.initial = event.data.data.value
                                    obj.callback(event.data.data.value)
                                }
                            },
                            id: frameID
                        })
                    }
                }
            })
        }

        const html = String.raw
        return obj.gvc.glitter.html`
        <div class="d-flex">
        ${(obj.title ? EditorElem.h3(obj.title) : '')}
        <div class="d-flex align-items-center justify-content-center" style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
        onclick="${obj.gvc.event(() => {
            EditorElem.openEditorDialog(obj.gvc, (gvc: GVC) => {
                return getComponent(gvc, window.innerHeight - 100)
            }, () => {
                obj.gvc.notifyDataChange(idlist)
            })
        })}"><i class="fa-solid fa-expand"></i></div>
</div>
        ` + getComponent(obj.gvc, obj.height)
    }

    public static richText(obj: {
        gvc: GVC,
        def: string,
        callback: (text: string) => void,
        style?: string
    }) {
        let quill: any = undefined;
//         return obj.gvc.bindView(() => {
//             const id = obj.gvc.glitter.getUUID();
//             const toolBarID = obj.gvc.glitter.getUUID();
//             return {
//                 bind: id,
//                 view: () => {
//                     return `<div id="${toolBarID}" style="white-space: normal;">
//   <span class="ql-formats">
//     <select class="ql-font"></select>
//     <select class="ql-size"></select>
//   </span>
//   <span class="ql-formats">
//     <button class="ql-bold"></button>
//     <button class="ql-italic"></button>
//     <button class="ql-underline"></button>
//     <button class="ql-strike"></button>
//   </span>
//   <span class="ql-formats">
//     <select class="ql-color"></select>
//     <select class="ql-background"></select>
//   </span>
//   <span class="ql-formats">
//     <button class="ql-script" value="sub"></button>
//     <button class="ql-script" value="super"></button>
//   </span>
//   <span class="ql-formats">
//     <button class="ql-header" value="1"></button>
//     <button class="ql-header" value="2"></button>
//     <button class="ql-blockquote"></button>
//     <button class="ql-code-block"></button>
//   </span>
//   <span class="ql-formats">
//     <button class="ql-list" value="ordered"></button>
//     <button class="ql-list" value="bullet"></button>
//     <button class="ql-indent" value="-1"></button>
//     <button class="ql-indent" value="+1"></button>
//   </span>
//   <span class="ql-formats">
//     <button class="ql-direction" value="rtl"></button>
//     <select class="ql-align"></select>
//   </span>
//   <span class="ql-formats">
//     <button class="ql-link"></button>
//     <i class="fa-solid fa-image ms-1" style="cursor:pointer;" onclick="${obj.gvc.event(() => {
//                         EditorElem.fileUploadEvent('image/*', (link: string) => {
//                             try {
//                                 var range = ((quill.getSelection) && quill.getSelection().index) || 0;
//                                 quill.insertEmbed(range, 'image', link);
//                             } catch {
//                                 quill.insertEmbed(0, 'image', link);
//                             }
//                         })
//                     })}"></i>
//   </span>
//   <span class="ql-formats">
//     <button class="ql-clean"></button>
//   </span>
// </div>
// <div id="${id}" ></div>`
//                 },
//                 divCreate: {
//                     elem: 'div',
//                     option: []
//                 },
//                 onCreate: () => {
//                     obj.gvc.glitter.addStyleLink([`https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.5/dist/quill.snow.css`])
//                     const quill_resize=new URL('../../jslib/quill-resize.js',import.meta.url)
//                     obj.gvc.addMtScript([
//                         {
//                             src: `https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.5/dist/quill.js`
//                         },
//                         {
//                             src: quill_resize.href
//                         },
//                         {
//                             src: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js`
//                         }
//                     ], () => {
//                         const interval = setInterval(() => {
//                             if ((window as any).Quill) {
//                                 try {
//                                     (window as any).Quill.register("modules/resize", (window as any).QuillResizeModule);
//                                     //@ts-ignore
//                                     quill = new (window as any).Quill('#' + id, {
//                                         modules: {
//                                             resize: {
//                                                 locale: {
//                                                     altTip: "按住alt键比例缩放",
//                                                     inputTip: "",
//                                                     floatLeft: "靠左",
//                                                     floatRight: "靠右",
//                                                     center: "居中",
//                                                     restore: "還原",
//                                                 },
//                                             },
//                                             syntax: false,
//                                             toolbar: `#` + toolBarID,
//                                         },
//                                         placeholder: '請輸入內容...',
//                                         theme: 'snow',
//                                     });
//                                     clearInterval(interval)
//                                 } catch (e) {
//                                     clearInterval(interval)
//                                 }
//
//                             }
//                             quill.container.firstChild.innerHTML=obj.def
//                             quill.on('text-change', (delta:any, oldDelta:any, source:any) => {
//                                 obj.callback(quill.container.firstChild.innerHTML)
//                             });
//                             // const observer = new MutationObserver(function (mutationsList) {
//                             //     obj.callback(quill.container.firstChild.innerHTML)
//                             // });
//                             // observer.observe(document.querySelector(`#${id}`)!, {childList: true, subtree: true});
//                             // const editableDiv:any = document.querySelector( `#${id} .ql-editor`);
//                             //
//                             // // 添加 input 事件监听器
//                             // editableDiv.addEventListener('input', function() {
//                             //     console.log(`change`)
//                             //     obj.callback(quill.container.firstChild.innerHTML)
//                             // });
//
//                         }, 100)
//
//                     }, () => {
//                     });
//                 }
//             }
//         })
        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID()
            const richID = obj.gvc.glitter.getUUID()
            obj.gvc.glitter.addMtScript([{
                src: new URL('../../jslib/froala.js', import.meta.url)
            }], () => {
            }, () => {
            })
            obj.gvc.addStyleLink(['https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css'])
            return {
                bind: id,
                view: () => {
                    return `<div style="" class="" id="${richID}">${obj.def}</div>`
                },
                divCreate: {
                    style: obj.style || `max-height:500px;overflow-y: auto;`
                },
                onCreate: () => {
                    const interval = setInterval(() => {
                        if ((window as any).FroalaEditor) {
                            //@ts-ignore
                            var editor = new FroalaEditor('#' + richID, {
                                language: 'zh_tw',
                                content: `<span>test</span>`,
                                events: {
                                    'contentChanged': function () {
                                        // Do something here.
                                        // this is the editor instance.
                                        obj.callback(editor.html.get());
                                    },
                                    'image.beforeUpload': function (e: any, images: any) {
                                        console.log(e[0])

                                        EditorElem.uploadFileFunction({
                                            gvc: obj.gvc,
                                            callback: (text) => {
                                                editor.html.insert(`<img src="${text}">`)
                                            },
                                            file: e[0]
                                        })
                                        // 在图片上传之前执行的自定义逻辑
                                        // images 参数是要上传的图片文件数组

                                        // 在此处执行上传逻辑
                                        // 可以使用 AJAX 或其他方式将图片上传到指定的服务器端

                                        // 如果使用 AJAX，可以如下示例：
                                        // $.ajax({
                                        //   type: 'POST',
                                        //   url: '/upload-image',
                                        //   data: formData,
                                        //   processData: false,
                                        //   contentType: false,
                                        //   success: function (data) {
                                        //     // 处理上传成功后的逻辑
                                        //     // data 包含了服务器响应的信息
                                        //   },
                                        //   error: function (error) {
                                        //     // 处理上传失败时的逻辑
                                        //   }
                                        // });

                                        // 阻止默认上传行为
                                        return false;
                                    }
                                }
                            });

                            console.log(`rich--`, ('#' + richID))

                            clearInterval(interval)
                        }
                    }, 200)


                }
            }
        })
    }

    public static pageSelect(gvc: GVC, title: string, def: any, callback: (tag: string) => void, filter?: (data: any) => boolean) {
        const glitter = gvc.glitter
        const id = glitter.getUUID()
        const data: any = {
            dataList: undefined
        }
        const saasConfig = (window as any).saasConfig

        function getData() {
            BaseApi.create({
                "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                }
            }).then((d2: any) => {
                data.dataList = d2.response.result.filter((dd: any) => {
                    return (!filter) || filter!(dd)
                })

                gvc.notifyDataChange(id)
            })
        }


        const html = String.raw
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (data.dataList) {
                        return EditorElem.select({
                            title: title,
                            gvc: gvc,
                            def: def,
                            array: [
                                {
                                    title: '選擇嵌入頁面', value: ''
                                }
                            ].concat(data.dataList.sort((function (a: any, b: any) {
                                if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                    return -1;
                                }
                                if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                    return 1;
                                }
                                return 0;
                            })).map((dd: any) => {
                                return {
                                    title: `${dd.group}-${dd.name}`, value: dd.tag
                                }
                            })),
                            callback: (text: string) => {
                                callback(text)
                            },
                        })
                    } else {
                        return ``
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (!data.dataList) {
                        setTimeout(() => {
                            getData()
                        }, 100)
                    }
                }
            }
        })
    }

    public static uploadFile(obj: { title: string; gvc: any; def: string; callback: (data: string) => void, readonly?: boolean }) {
        const glitter = (window as any).glitter;
        const $ = glitter.$;

        return `${EditorElem.h3(obj.title)}
${obj.gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return `<input
                    class="flex-fill form-control "
                    placeholder="請輸入檔案連結"
                    value="${obj.def ?? ""}"
                    onchange="${obj.gvc.event((e: any) => {
                        obj.callback(e.value);
                    })}"
                    ${(obj.readonly) ? `readonly` : ``}
                />
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                ${(!obj.readonly) ? `<i
                    class="fa-regular fa-upload  ms-2 fs-5"
                    style="cursor: pointer;color:black;"
                    onclick="${obj.gvc.event(() => {
                        glitter.ut.chooseMediaCallback({
                            single: true,
                            accept: '*',
                            callback(data: any) {
                                const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                                const dialog = new ShareDialog(obj.gvc.glitter);
                                dialog.dataLoading({visible: true});
                                const file = data[0].file;
                                saasConfig.api.uploadFile(file.name).then((data: any) => {
                                    dialog.dataLoading({visible: false});
                                    const data1 = data.response;
                                    dialog.dataLoading({visible: true});
                                    BaseApi.create({
                                        url: data1.url,
                                        type: 'put',
                                        data: file,
                                        headers: {
                                            "Content-Type": data1.type
                                        }
                                    }).then((res) => {
                                        console.log(res)
                                        if (res.result) {
                                            dialog.dataLoading({visible: false});
                                            obj.def = data1.fullUrl
                                            obj.callback(data1.fullUrl);
                                            obj.gvc.notifyDataChange(id)
                                        } else {
                                            dialog.dataLoading({visible: false});
                                            dialog.errorMessage({text: '上傳失敗'});
                                        }
                                    });
                                });
                            },
                        });
                    })}"
                ></i>` : ``}
              `
                },
                divCreate: {
                    class: `d-flex align-items-center mb-2`
                }
            }
        })}
          `;
    }

    public static uploadFileFunction(obj: {
        gvc: GVC,
        callback: (text: string) => void,
        type?: string,
        file?: File
    }) {
        const glitter = (window as any).glitter

        function upload(file: any) {
            const saasConfig: { config: any; api: any } = (window as any).saasConfig;
            const dialog = new ShareDialog(obj.gvc.glitter);
            dialog.dataLoading({visible: true});
            saasConfig.api.uploadFile(file.name.replace(/ /g, '')).then((data: any) => {
                dialog.dataLoading({visible: false});
                const data1 = data.response;
                dialog.dataLoading({visible: true});
                BaseApi.create({
                    url: data1.url,
                    type: 'put',
                    data: file,
                    headers: {
                        "Content-Type": data1.type
                    }
                }).then((res) => {
                    if (res.result) {
                        dialog.dataLoading({visible: false});
                        obj.callback(data1.fullUrl);
                    } else {
                        dialog.dataLoading({visible: false});
                        dialog.errorMessage({text: '上傳失敗'});
                    }
                });
            });
        }

        if (obj.file) {
            upload(obj.file)
        } else {
            glitter.ut.chooseMediaCallback({
                single: true,
                accept: obj.type ?? '*',
                callback(data: any) {
                    upload(data[0].file)
                },
            });
        }
    }

    public static uploadVideo(obj: { title: string; gvc: any; def: string; callback: (data: string) => void }) {
        const glitter = (window as any).glitter;
        const $ = glitter.$;
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${
            obj.def
        }" onchange="${obj.gvc.event((e: any) => {
            obj.callback(e.value);
        })}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
            glitter.ut.chooseMediaCallback({
                single: true,
                accept: 'json,video/*',
                callback(data: any) {
                    const saasConfig: {
                        config: any;
                        api: any;
                    } = (window as any).saasConfig;
                    const dialog = new ShareDialog(obj.gvc.glitter);
                    dialog.dataLoading({visible: true});
                    const file = data[0].file;
                    saasConfig.api.uploadFile(file.name).then((data: any) => {
                        dialog.dataLoading({visible: false});
                        const data1 = data.response;
                        dialog.dataLoading({visible: true});
                        BaseApi.create({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            headers: {
                                "Content-Type": data1.type
                            }
                        }).then((res) => {
                            if (res.result) {
                                dialog.dataLoading({visible: false});
                                obj.callback(data1.fullUrl);
                            } else {
                                dialog.dataLoading({visible: false});
                                dialog.errorMessage({text: '上傳失敗'});
                            }
                        });
                    });
                },
            });
        })}"></i>
                            </div>`;
    }

    public static uploadLottie(obj: { title: string; gvc: any; def: string; callback: (data: string) => void }) {
        const glitter = (window as any).glitter;
        const $ = glitter.$;
        return /*html*/ `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
            <div class="alert alert-dark alert-dismissible fade show" role="alert" style="white-space: normal;word-break: break-word;">
                <a
                    onclick="${obj.gvc.event(() => glitter.openNewTab(`https://lottiefiles.com/`))}"
                    class=" fw text-white"
                    style="cursor: pointer;"
                    >Lottie</a
                >
                是開放且免費的動畫平台，可以前往下載動畫檔後進行上傳．
            </div>
            <div class="d-flex align-items-center mb-3">
                <input
                    class="flex-fill form-control "
                    placeholder="請輸入圖片連結"
                    value="${obj.def}"
                    onchange="${obj.gvc.event((e: any) => {
            obj.callback(e.value);
        })}"
                />
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                <i
                    class="fa-regular fa-upload text-white ms-2"
                    style="cursor: pointer;"
                    onclick="${obj.gvc.event(() => {
            glitter.ut.chooseMediaCallback({
                single: true,
                accept: 'json,image/*,.json',
                callback(data: any) {
                    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                    const dialog = new ShareDialog(obj.gvc.glitter);
                    dialog.dataLoading({visible: true});
                    const file = data[0].file;
                    saasConfig.api.uploadFile(file.name).then((data: any) => {
                        dialog.dataLoading({visible: false});
                        const data1 = data.response;
                        dialog.dataLoading({visible: true});
                        BaseApi.create({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            headers: {
                                "Content-Type": data1.type
                            }
                        }).then((res) => {
                            if (res.result) {
                                dialog.dataLoading({visible: false});
                                obj.callback(data1.fullUrl);
                            } else {
                                dialog.dataLoading({visible: false});
                                dialog.errorMessage({text: '上傳失敗'});
                            }
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
    }

    public static h3(title: string) {
        return /*html*/ `<h3 style="color: black;font-size: 15px;margin-bottom: 5px;" class="fw-500 mt-2">${title}</h3>`;
    }

    public static plusBtn(title: string, event: any) {
        return /*html*/ `<div class="w-100 my-3" style="background: black;height: 1px;"></div>
            <div
                class="fw-500 text-dark align-items-center justify-content-center d-flex p-1 rounded mt-1 hoverBtn"
                style="border: 1px solid #151515;color:#151515;"
                onclick="${event}"
            >
                ${title}
            </div>`;
    }

    public static fontawesome(obj: { title: string; gvc: any; def: string; callback: (text: string) => void }) {
        const glitter = (window as any).glitter;
        return (
            /*html*/ `
                ${EditorElem.h3(obj.title)}
                <div
                    class="alert alert-info fade show p-2"
                    role="alert"
                    style="white-space: normal;word-break: break-all;"
                >
                    <a
                        onclick="${obj.gvc.event(() => glitter.openNewTab('https://fontawesome.com/search'))}"
                        class="fw fw-bold"
                        style="cursor: pointer;"
                        >fontawesome</a
                    >
                    與
                    <a
                        onclick="${obj.gvc.event(() => glitter.openNewTab('https://boxicons.com/'))}"
                        class="fw fw-bold"
                        style="cursor: pointer;"
                        >box-icon</a
                    >
                    是開放且免費的icon提供平台，可以前往挑選合適標籤進行設定.
                </div>
            ` +
            glitter.htmlGenerate.editeInput({
                gvc: obj.gvc,
                title: '',
                default: obj.def,
                placeHolder: '請輸入ICON-標籤',
                callback: (text: string) => {
                    obj.callback(text);
                },
            })
        );
    }

    public static toggleExpand(obj: { gvc: any; title: string; data: any; innerText: string | (() => string); color?: string }) {
        const color = obj.color ?? `#4144b0;`;
        const glitter = (window as any).glitter;
        return /*html*/ `${obj.gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (obj.data.expand) {
                        return /*html*/ `<div class="toggleInner  mb-2 p-2" style="width:calc(100%);border-radius:8px;
                    min-height:45px;background:#d9f1ff;border: 1px solid #151515;color:#151515;">
                            <div
                                class="d-flex p-0 align-items-center mb-2 w-100"
                                onclick="${obj.gvc.event(() => {
                            obj.data.expand = !obj.data.expand;
                            obj.gvc.notifyDataChange(id);
                        })}"
                                style="cursor: pointer;"
                            >
                                <h3 style="font-size: 16px;color: black;width: calc(100% - 60px);" class="m-0 p-0">${obj.title}</h3>
                                <div class="flex-fill"></div>
                                <div class="text-dark fw-bold" style="cursor: pointer;">收合<i class="fa-solid fa-up ms-2 text-dark"></i></div>
                            </div>
                            ${(typeof obj.innerText === 'string') ? obj.innerText : obj.innerText()}
                        </div>`;
                    }
                    return /*html*/ `<div class="toggleInner  mb-2 p-2" style="width:calc(100%);border-radius:8px;
                    min-height:45px;background:#d9f1ff;border: 1px solid #151515;color:#151515;">
                        <div
                            class="w-100 d-flex p-0 align-items-center"
                            onclick="${obj.gvc.event(() => {
                        obj.data.expand = !obj.data.expand;
                        obj.gvc.notifyDataChange(id);
                    })}"
                            style="cursor: pointer;"
                        >
                            <h3 style="font-size: 16px;color: black;width: calc(100% - 60px);" class="m-0 p-0">${obj.title}</h3>
                            <div class="flex-fill"></div>
                            <span class="text-dark fw-bold" style="cursor: pointer;">展開<i class="fa-solid fa-down ms-2 text-dark"></i></span>
                        </div>
                    </div>`;
                },
                divCreate: {},
            };
        })}`;
    }

    public static minusTitle(title: string, event: string) {
        return /*html*/ `<div class="d-flex align-items-center">
            <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${event}"></i>
            <h3 style="color: black;font-size: 16px;" class="m-0">${title}</h3>
        </div>`;
    }

    public static searchInput(obj: {
        title: string;
        gvc: any;
        def: string;
        array: string[];
        callback: (text: string) => void;
        placeHolder: string;
    }) {
        obj.def = obj.def || ''
        const glitter = (window as any).glitter;
        const gvc = obj.gvc;
        const $ = glitter.$;
        let changeInterval: any = undefined
        return /*html*/ `
            ${(obj.title) ? EditorElem.h3(obj.title) : ``}
            <div class="btn-group dropdown w-100">
                ${(() => {
            const id = glitter.getUUID();
            const id2 = glitter.getUUID();
            return /*html*/ `
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id2,
                    view: () => {
                        return /*html*/ `<input
                                        class="form-control w-100"
                                        style="height: 40px;"
                                        placeholder="${obj.placeHolder}"
                                        onfocus="${obj.gvc.event(() => {
                            gvc.getBindViewElem(id).addClass(`show`);
                        })}"
                                        onblur="${gvc.event(() => {

                        })}"
                                        oninput="${gvc.event((e: any) => {
                            obj.def = e.value;
                            gvc.notifyDataChange(id);
                            setTimeout(() => {
                                gvc.getBindViewElem(id).addClass(`show`);
                            }, 100)

                        })}"
                                        value="${obj.def}"
                                        onchange="${gvc.event((e: any) => {
                            changeInterval = setTimeout(() => {
                                obj.def = e.value;
                                obj.callback(obj.def);
                                setTimeout(() => {
                                    gvc.getBindViewElem(id).removeClass(`show`);
                                }, 100)
                            }, 200)

                        })}"
                                    />`;
                    },
                    divCreate: {class: `w-100`},
                };
            })}
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return obj.array
                            .filter((d2: any) => {
                                return d2.toUpperCase().indexOf(obj.def.toUpperCase()) !== -1;
                            })
                            .map((d3) => {
                                return /*html*/ `<button
                                                class="dropdown-item"
                                                onclick="${gvc.event(() => {
                                    clearInterval(changeInterval)
                                    obj.def = d3;
                                    gvc.notifyDataChange(id2)
                                    obj.callback(obj.def);
                                    setTimeout(() => {
                                        gvc.getBindViewElem(id).removeClass(`show`);
                                    }, 100)
                                })}"
                                            >
                                                ${d3}
                                            </button>`;
                            })
                            .join('');
                    },
                    divCreate: {
                        class: `dropdown-menu`,
                        style: `transform: translateY(40px);max-height:200px;overflow-y:scroll;position:fixed;`,
                    },
                };
            })}
                    `;
        })()}
            </div>
        `;
    }

    public static searchInputDynamic(obj: {
        title: string;
        gvc: any;
        def: string;
        callback: (text: string) => void;
        placeHolder: string;
        search: (text: string, callback: (data: string[]) => void) => void
    }) {
        const glitter = (window as any).glitter;
        const gvc = obj.gvc;
        const $ = glitter.$;
        let array: string[] = []

        return /*html*/ `
            ${(obj.title) ? EditorElem.h3(obj.title) : ``}
            <div class="btn-group dropdown w-100">
                ${(() => {
            const id = glitter.getUUID();
            const id2 = glitter.getUUID();

            function refreshData() {
                obj.search(obj.def, (data) => {
                    array = data
                    try {
                        gvc.notifyDataChange(id);
                        gvc.getBindViewElem(id).addClass(`show`);
                    } catch (e) {
                    }

                })
            }

            // refreshData()
            return /*html*/ `
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id2,
                    view: () => {
                        return /*html*/ `<input
                                        class="form-control w-100"
                                        style="height: 40px;max-height:100%;"
                                        placeholder="${obj.placeHolder}"
                                        onfocus="${obj.gvc.event(() => {
                            gvc.getBindViewElem(id).addClass(`show`);
                            refreshData()
                        })}"
                                        onblur="${gvc.event(() => {
                            setTimeout(() => {
                                gvc.getBindViewElem(id).removeClass(`show`);
                            }, 300);
                        })}"
                                        oninput="${gvc.event((e: any) => {
                            obj.def = e.value;
                            refreshData()
                        })}"
                                        value="${obj.def}"
                                        onchange="${gvc.event((e: any) => {
                            obj.def = e.value;
                            setTimeout(() => {
                                obj.callback(obj.def);
                            }, 500);
                        })}"
                                    />`;
                    },
                    divCreate: {class: `w-100`},
                };
            })}
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return array
                            .filter((d2: any) => {
                                return d2.toUpperCase().indexOf(obj.def.toUpperCase()) !== -1;
                            })
                            .map((d3) => {
                                return /*html*/ `<button
                                                class="dropdown-item"
                                                onclick="${gvc.event(() => {
                                    obj.def = d3;
                                    gvc.notifyDataChange(id2)
                                    obj.callback(obj.def);
                                })}"
                                            >
                                                ${d3}
                                            </button>`;
                            })
                            .join('');
                    },
                    divCreate: {
                        class: `dropdown-menu`,
                        style: `transform: translateY(40px);max-height:300px;overflow-y:scroll;`,
                    },
                };
            })}
                    `;
        })()}
            </div>
        `;
    }

    public static editeInput(obj: {
        gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void, style?: string
        type?: string,
        readonly?: boolean
    }) {
        obj.title = obj.title ?? ""
        return `${(obj.title) ? EditorElem.h3(obj.title) : ``}
<input class="form-control" style="${obj.style ?? ""}" type="${obj.type ?? 'text'}" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${obj.default ?? ''}" ${(obj.readonly) ? `readonly` : ``}>`;
    }

    public static container(array: string[]) {
        return array.join(`<div class="my-2"></div>`)
    }

    public static select(obj: {
        title: string;
        gvc: GVC;
        def: string;
        array: string[] | { title: string; value: string }[];
        callback: (text: string) => void;
        style?: string,
        class?: string,
        readonly?: boolean
    }) {
        return /*html*/ `
            ${(obj.title) ? EditorElem.h3(obj.title) : ``}
            <select
            
                class="form-select ${obj.class ?? ""}"
                style="max-height:100%; ${obj.style ?? ""};"
                onchange="${obj.gvc.event((e: any) => {
            obj.callback(e.value);
        })}"
                ${obj.readonly ? `disabled` : ``}
                onclick="${obj.gvc.event((e: any, event: any) => {
            if (obj.readonly) {
                event.stopPropagation()
                event.preventDefault()
            }
        })}"
            >
                ${obj.array
            .map((dd) => {
                if (typeof dd === 'object') {
                    return /*html*/ `<option value="${dd.value}" ${dd.value === obj.def ? `selected` : ``}>
                                ${dd.title}
                            </option>`;
                } else {
                    return /*html*/ `<option value="${dd}" ${dd === obj.def ? `selected` : ``}>${dd}</option>`;
                }
            })
            .join('')}
            </select>
        `;
    }

    public static checkBox(obj: {
        title: string;
        gvc: any;
        def: string | string[];
        array: string[] | { title: string; value: string; innerHtml?: string }[];
        callback: (text: string) => void;
        type?: 'single' | 'multiple'
    }) {
        obj.type = obj.type ?? 'single'
        const gvc = obj.gvc;
        return /*html*/ `
            ${(obj.title) ? EditorElem.h3(obj.title) : ``}
            ${
            obj.gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return obj.array.map((dd: any) => {
                            function isSelect() {
                                if (obj.type === 'multiple') {
                                    return (obj.def as any).find((d2: any) => {
                                        return d2 === dd.value;
                                    })
                                } else {
                                    return obj.def === dd.value
                                }
                            }

                            return `<div class="d-flex align-items-center" onclick="${
                                obj.gvc.event(() => {
                                    if (obj.type === 'multiple') {
                                        if ((obj.def as any).find((d2: any) => {
                                            return d2 === dd.value;
                                        })) {
                                            obj.def = (obj.def as any).filter((d2: any) => {
                                                return d2 !== dd.value;
                                            })
                                        } else {
                                            (obj.def as any).push(dd.value)
                                        }
                                        obj.callback(obj.def as any)
                                    } else {
                                        obj.def = dd.value
                                        obj.callback(dd.value)
                                    }
                                    gvc.notifyDataChange(id)
                                })
                            }">
<i class="${(isSelect()) ? `fa-solid fa-square-check` : `fa-regular fa-square`} me-2" style="${(isSelect()) ? `color:#295ed1;` : `color:black;`}"></i>
<span style="font-size:0.85rem;">${dd.title}</span>
</div>
${(obj.def === dd.value && dd.innerHtml) ? `<div class="mt-1">${dd.innerHtml}</div>` : ``}
`
                        }).join('<div class="my-2"></div>')
                    },
                    divCreate: {
                        class: `ps-1`
                    }
                }
            })
        }
           
        `;
    }

    public static checkBoxOnly(obj: {
        gvc: GVC,
        def: boolean,
        callback: (result: boolean) => void,
        style?: string
    }) {
        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return `<i class="${(obj.def) ? `fa-solid fa-square-check` : `fa-regular fa-square`} " style="${(obj.def) ? `color:#295ed1;` : `color:black;`}"></i>`
                },
                divCreate: {
                    option: [
                        {
                            key: 'onclick', value: obj.gvc.event((e, event) => {
                                obj.def = !obj.def
                                obj.callback(obj.def)
                                event.stopPropagation()
                                obj.gvc.notifyDataChange(id)
                            })
                        }
                    ],
                    class: `d-flex align-items-center justify-content-center`,
                    style: `height:20px;font-size:18px;cursor:pointer;${obj.style ?? ""}`
                }
            }
        })
    }

    public static editerDialog(par: {
        gvc: GVC,
        dialog: (gvc: GVC) => string,
        width?: string,
        editTitle?: string
    }) {
        const html = String.raw
        return `<button type="button" class="btn btn-primary-c  w-100" style="" onclick="${par.gvc.event(() => {
            par.gvc.glitter.innerDialog((gvc: GVC) => {
                return html`
                    <div class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show "
                         style="z-index:999999;${(par.width) ? `width:${par.width + ';'}` : ``}"
                         onclick="${gvc.event((e: any, event: any) => {
                             event.preventDefault()
                             event.stopPropagation()
                         })}">
                        <div class="d-flex align-items-center px-2 border-bottom"
                             style="height:50px;min-width:400px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0">
                                ${par.editTitle ? par.editTitle : `編輯內容`}</h3>
                            <div class="flex-fill"></div>
                            <div class="hoverBtn p-2" data-bs-toggle="dropdown"
                                 aria-haspopup="true" aria-expanded="false"
                                 style="color:black;font-size:20px;"
                                 onclick="${gvc.event((e: any, event: any) => {
                                     gvc.closeDialog()
                                 })}"><i
                                    class="fa-sharp fa-regular fa-circle-xmark"></i>
                            </div>
                        </div>
                        <div class="px-2 pb-2 pt-2"
                             style="max-height:calc(100vh - 150px);overflow-y:auto;">
                            ${par.dialog(gvc)}
                        </div>
                    </div>`
            }, par.gvc.glitter.getUUID())
        })}">${par.editTitle}</button>`
    }

    public static folderLineItems(obj: {
        gvc: GVC,
        viewArray: {
            type: 'container' | 'items',
            dataList?: any[]
        }[],
        originalArray: any,
        isOptionSelected: (dd: any) => boolean,
        onOptionSelected: (dd: any) => void
    }): string {
        const gvc = obj.gvc
        const glitter = gvc.glitter
        const parId = gvc.glitter.getUUID()
        const html = String.raw
        return gvc.bindView(() => {
            gvc.glitter.addMtScript([{
                src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`
            }], () => {
            }, () => {
            })
            return {
                bind: parId,
                view: () => {
                    return obj.viewArray.map((dd: any, index: number) => {
                        const checkChildSelect = (setting: any) => {
                            for (const b of setting) {
                                if (obj.isOptionSelected(b)) {
                                    return true
                                }
                                if (b.data && b.dataList && checkChildSelect(b.dataList)) {
                                    return true
                                }
                            }
                            return false;
                        }

                        const childSelect = (dd.type === 'container') ? checkChildSelect(dd.dataList) : false

                        return html`
                            <li class="btn-group d-flex flex-column"
                                style="margin-top:1px;margin-bottom:1px;">
                                <div class="editor_item d-flex   px-2 my-0 hi me-n1  ${(dd.toggle || childSelect || obj.isOptionSelected(dd)) ? `active` : ``}"
                                     style=""
                                     onclick="${gvc.event(() => {
                                         obj.onOptionSelected(dd)
                                         gvc.notifyDataChange(parId)
                                     })}">
                                    ${(dd.type === 'container') ? html`
                                        <div class="subBt ps-0 ms-n2" onclick="${gvc.event((e, event) => {
                                            dd.toggle = !dd.toggle
                                            gvc.notifyDataChange(parId)
                                            event.stopPropagation()
                                            event.preventDefault()
                                        })}">
                                            ${((dd.toggle) ? `<i class="fa-regular fa-angle-down hoverBtn " ></i>` : `
                                                                        <i class="fa-regular fa-angle-right hoverBtn " ></i>
                                                                        `)}
                                        </div>` : ``}
                                    ${dd.label}
                                    <div class="flex-fill"></div>
                                </div>
                                ${(() => {
                                    if ((dd.type !== 'container') || dd.dataList.length === 0) {
                                        return '' as string
                                    } else {
                                        return `<div class="${(dd.toggle || (dd.toggle === undefined && (checkChildSelect(dd.dataList)))) ? `` : `d-none`}"
                                                     style="padding-left:5px;">${this.folderLineItems(
                                                {
                                                    gvc: obj.gvc,
                                                    viewArray: dd.dataList.map((dd: any, index: number) => {
                                                        dd.index = index
                                                        return dd
                                                    }),
                                                    originalArray: dd.dataList,
                                                    isOptionSelected: obj.isOptionSelected,
                                                    onOptionSelected: obj.onOptionSelected
                                                }
                                        )}
                                                </div>` as string
                                    }
                                })()}
                            </li>`
                    }).join('')
                },
                divCreate: {
                    class: `d-flex flex-column position-relative border-bottom position-relative ps-0 m-0`,
                    elem: 'ul',
                    option: [
                        {key: 'id', value: parId}
                    ]
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
                                        // swapArr(original, startIndex, evt.newIndex)
                                    },
                                    onEnd: (evt: any) => {
                                        console.log(`change-${startIndex}-${evt.newIndex}-`)
                                        swapArr(obj.originalArray, startIndex, evt.newIndex)
                                    },
                                    onStart: function (evt: any) {
                                        startIndex = evt.oldIndex

                                        console.log(`oldIndex--`, startIndex)
                                    }
                                });
                            } catch (e) {
                            }
                            clearInterval(interval)
                        }
                    }, 100)
                }
            }
        })
    }

    public static arrayItem(obj: {
        gvc: GVC;
        title: string;
        array: () => {
            title: string; innerHtml?: string | ((gvc: GVC) => string); editTitle?: string, saveEvent?: () => void, width?: string, saveAble?: boolean,
            isSelect?: boolean
        }[];
        originalArray: any,
        expand: any;
        height?: number
        plus?: {
            title: string;
            event: string;
        };
        hr?: boolean
        refreshComponent: () => void,
        minus?: boolean,
        draggable?: boolean,
        copyable?: boolean,
        customEditor?: boolean,
        minusEvent?: (data: any, index: number) => void
    }) {
        const gvc = obj.gvc
        const glitter = gvc.glitter
        const viewId = glitter.getUUID()
        const html = String.raw
        const swal = new Swal(gvc);

        function render(array: any, child: boolean, original: any) {
            const parId = obj.gvc.glitter.getUUID()
            return gvc.bindView(() => {
                obj.gvc.addMtScript([{
                    src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`
                }], () => {
                }, () => {
                })
                return {
                    bind: parId,
                    view: () => {
                        return array.map((dd: any, index: number) => {
                            let toggle = gvc.event((e: any, event: any) => {
                                dd.toggle = !dd.toggle
                                gvc.notifyDataChange(parId)
                                event.preventDefault()
                                event.stopPropagation()
                            })
                            return html`
                                <li class="btn-group" style="margin-top:1px;margin-bottom:1px;">
                                    <div class="editor_item d-flex   align-items-center px-2 my-0 hi me-n1 ${(dd.isSelect) ? `bgf6 border` : ``}"
                                         style="${(obj.height) ? `height:${obj.height}px` : ``};cursor: pointer;"
                                         onclick="${gvc.event(() => {
                                             if (!dd.innerHtml) {
                                                 return
                                             }
                                             if (obj.customEditor) {
                                                 dd.innerHtml(gvc)
                                             } else {
                                                 const originalData = JSON.parse(JSON.stringify(original[index]))
                                                 gvc.glitter.innerDialog((gvc: GVC) => {
                                                     return html`
                                                         <div class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show"
                                                              style="z-index:999999;${(dd.width) ? `width:${dd.width + ';'}` : ``}"
                                                              onclick="${gvc.event((e: any, event: any) => {
                                                                  event.preventDefault()
                                                                  event.stopPropagation()
                                                              })}">
                                                             <div class="d-flex align-items-center px-2 border-bottom"
                                                                  style="height:50px;min-width:400px;">

                                                                 <h3 style="font-size:15px;font-weight:500;"
                                                                     class="m-0">
                                                                     ${dd.editTitle ? dd.editTitle : `編輯項目「${dd.title}」`}</h3>
                                                                 <div class="flex-fill"></div>
                                                                 <div class="hoverBtn p-2" data-bs-toggle="dropdown"
                                                                      aria-haspopup="true" aria-expanded="false"
                                                                      style="color:black;font-size:20px;"
                                                                      onclick="${gvc.event((e: any, event: any) => {
                                                                          original[index] = originalData
                                                                          gvc.closeDialog()
                                                                          obj.refreshComponent()
                                                                      })}"><i
                                                                         class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                 </div>
                                                             </div>
                                                             <div class="px-2"
                                                                  style="max-height:calc(100vh - 150px);overflow-y:auto;">
                                                                 ${dd.innerHtml(gvc)}
                                                             </div>
                                                             <div class="d-flex w-100 p-2 border-top ${(dd.saveAble === false) ? `d-none` : ``}">
                                                                 <div class="flex-fill"></div>
                                                                 <div class="btn btn-secondary"
                                                                      style="height:40px;width:80px;"
                                                                      onclick="${gvc.event(() => {
                                                                          original[index] = originalData
                                                                          gvc.closeDialog()
                                                                          obj.refreshComponent()
                                                                      })}">取消
                                                                 </div>
                                                                 <div class="btn btn-primary-c ms-2"
                                                                      style="height:40px;width:80px;"
                                                                      onclick="${gvc.event(() => {
                                                                          gvc.closeDialog();
                                                                          (dd.saveEvent && dd.saveEvent()) || obj.refreshComponent();
                                                                      })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存
                                                                 </div>
                                                             </div>
                                                         </div>`
                                                 }, glitter.getUUID())
                                             }
                                         })}"
                                    >
                                        <div class="subBt ms-n2 ${(obj.minus === false) ? `d-none` : ``}"
                                             onclick="${gvc.event((e: any, event: any) => {
                                                 if (obj.minusEvent) {
                                                     obj.minusEvent(obj.originalArray, index)
                                                 } else {
                                                     obj.originalArray.splice(index, 1)
                                                     obj.refreshComponent()
                                                 }
                                                 gvc.notifyDataChange(viewId)
                                                 event.stopPropagation()
                                             })}">
                                            <i class="fa-regular fa-circle-minus d-flex align-items-center justify-content-center subBt "
                                               style="width:15px;height:15px;color:red;"
                                            ></i>
                                        </div>

                                        ${dd.title}
                                        <div class="flex-fill"></div>
                                        ${
                                                (() => {
                                                    let interval: any = undefined
                                                    if (obj.copyable === false) {
                                                        return ``
                                                    }

                                                    function addIt(ind: number, event: any) {
                                                        const copy = JSON.parse(JSON.stringify(original[index]))
                                                        obj.originalArray.splice(index + ind, 0, copy)
                                                        event.stopPropagation()
                                                        gvc.notifyDataChange(viewId)
                                                        obj.refreshComponent()
                                                    }

                                                    let toggle = false;
                                                    return `<div class="btn-group dropend subBt" style="position: relative;"
                                                 onclick="${gvc.event((e, event) => {
                                                        toggle = !toggle;
                                                        if (toggle) {
                                                            ($(e).children('.bt') as any).dropdown('show');
                                                            $(e).children('.dropdown-menu').css('top', `${0}px`);
                                                        } else {
                                                            ($(e).children('.bt') as any).dropdown('hide');
                                                        }
                                                        event.stopPropagation()

                                                    })}">

                                                <div type="button" class="bt" style="background:none;"
                                                     data-bs-toggle="dropdown" aria-haspopup="true"
                                                     aria-expanded="false">
                                                    <i class="fa-sharp fa-regular fa-scissors"></i>
                                                </div>
                                                <div class="dropdown-menu mx-1 " 
                                                   style="height: 135px;" onclick="${gvc.event((e, event) => {
                                                        toggle = false
                                                        event.stopPropagation()
                                                    })}">
                                                    <a class="dropdown-item" onclick="${gvc.event((e, event) => {
                                                        addIt(0, event)
                                                    })}">向上複製</a>
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item" onclick="${gvc.event((e, event) => {
                                                        ($(e).parent().parent().children('.bt') as any).dropdown('hide');
                                                        navigator.clipboard.writeText(JSON.stringify(original[index]));
                                                    })}">複製到剪貼簿</a>
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item" onclick="${gvc.event((e, event) => {
                                                        ($(e).parent().parent().children('.bt') as any).dropdown('hide');
                                                        addIt(1, event)
                                                    })}">向下複製</a>
                                                </div>
                                            </div>`
                                                })()
                                        }
                                        <div class="subBt ${(obj.draggable === false) ? `d-none` : ``}">
                                            <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                               style="width:15px;height:15px;"></i>
                                        </div>
                                    </div>
                                </li>
                            `
                        }).join(obj.hr ? `<div class="bgf6 w-100" style="height:1px;"></div>` : ``)
                    },
                    divCreate: {
                        class: `d-flex flex-column ${(child) ? `` : ``} m-0 p-0 position-relative`,
                        elem: 'ul',
                        option: [
                            {key: 'id', value: parId}
                        ]
                    },
                    onCreate: () => {
                        if (obj.draggable !== false) {
                            const interval = setInterval(() => {
                                if ((window as any).Sortable) {
                                    try {
                                        obj.gvc.addStyle(`ul {
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
                                            group: obj.gvc.glitter.getUUID(),
                                            animation: 100,
                                            // Called when dragging element changes position
                                            onChange: function (evt: any) {
                                                swapArr(obj.originalArray, startIndex, evt.newIndex)
                                                startIndex = evt.newIndex;
                                            },
                                            onStart: function (evt: any) {
                                                startIndex = evt.oldIndex

                                                console.log(`oldIndex--`, startIndex)
                                            },
                                            onEnd: () => {
                                                obj.refreshComponent()
                                            }
                                        });
                                    } catch (e) {
                                    }
                                    clearInterval(interval)
                                }
                            }, 100)
                        }
                    }
                }
            }) + ((obj.plus) ? html`
                <l1 class="btn-group mt-2 ps-1 pe-2 w-100 border-bottom pb-2">
                    <div class="btn-outline-secondary-c btn ms-2 " style="height:30px;flex:1;"
                         onclick="${obj.plus!.event}">
                        <i class="fa-regular fa-circle-plus me-2"></i>${obj.plus!.title}
                    </div>
                    ${
                            (() => {
                                if (obj.copyable === false) {
                                    return ``
                                }
                                let interval: any = undefined
                                return ` <div type="button" class="bt ms-1" style="background:none;"
                                                     data-bs-toggle="dropdown" aria-haspopup="true"
                                                     data-placement="right"
                                                     aria-expanded="false" onclick="${gvc.event(() => {
                                    async function readClipboardContent() {
                                        try {
                                            // 使用 navigator.clipboard.readText() 方法取得剪貼簿的文字內容
                                            const clipboardText: any = await navigator.clipboard.readText();
                                            try {
                                                const data = JSON.parse(clipboardText)
                                                if (Array.isArray(data)) {
                                                    data.map((dd) => {
                                                        obj.originalArray.push(dd)
                                                    })
                                                } else {
                                                    obj.originalArray.push(data)
                                                }

                                                gvc.notifyDataChange(viewId)
                                                obj.refreshComponent()
                                            } catch (e) {
                                                alert('請貼上JSON格式')
                                            }
                                        } catch (error) {
                                            // 處理錯誤，例如未授權或不支援
                                            console.error('無法取得剪貼簿內容:', error);
                                        }
                                    }

                                    readClipboardContent()
                                })}">
                                                    <i class="fa-regular fa-paste"></i>
                                                </div>`
                            })()
                    }
                </l1>` : ``)
        }

        return (obj.title ? `<div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                             style="color:#151515;font-size:16px;gap:0px;">
                            ${obj.title}
                            <div class="flex-fill"></div>
                          ${(obj.copyable !== false) ? `
                          <div class="d-flex align-items-center justify-content-center hoverBtn me-2 border" style="height:30px;width:30px;border-radius:6px;cursor:pointer;color:#151515;"
                          onclick="${gvc.event(() => {
            navigator.clipboard.writeText(JSON.stringify(obj.originalArray));
            const dialog = new ShareDialog(gvc.glitter)
            dialog.successMessage({text: "已複製至剪貼簿!"})
        })}">
                                    <i class="fa-sharp fa-regular fa-scissors" aria-hidden="true"></i>
                                </div>
                          ` : ``}
                        </div>` : ``) + gvc.bindView(() => {
            return {
                bind: viewId,
                view: () => {
                    return render(obj.array().map((dd: any, index: number) => {
                        dd.index = index
                        return dd
                    }), false, obj.originalArray)
                }
            }
        })


    }

    public static buttonPrimary(title: string, event: string) {
        return `<button type="button" class="btn btn-primary-c  w-100" onclick="${event}">${title}</button>`
    }

    public static buttonNormal(title: string, event: string) {
        return `<button type="button" class="btn w-100" style="background:white;width:calc(100%);border-radius:8px;
                    min-height:45px;border:1px solid black;color:#151515;" onclick="${event}">${title}</button>`
    }

    public static openEditorDialog(gvc: GVC, inner: (gvc: GVC) => string, close: () => any, width?: number, title?: string, tag?: string) {
        return gvc.glitter.innerDialog((gvc: GVC) => {
            return gvc.glitter.html`
            <div class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show "
                 style="z-index:999999;"
                 onclick="${gvc.event((e: any, event: any) => {
                event.preventDefault()
                event.stopPropagation()
            })}">
                <div class="d-flex align-items-center px-2 border-bottom"
                     style="height:50px;width: ${(width) || gvc.glitter.ut.frSize({
                1400: 1200,
                1600: 1400,
                1900: 1600
            }, '1200')}px;">
                    <h3 style="font-size:15px;font-weight:500;" class="m-0">
                        ${title ?? `代碼編輯`}</h3>
                    <div class="flex-fill"></div>
                    <div class="hoverBtn p-2" data-bs-toggle="dropdown"
                         aria-haspopup="true" aria-expanded="false"
                         style="color:black;font-size:20px;"
                         onclick="${gvc.event(async (e: any, event: any) => {
                let wait_promise = close()
                if (wait_promise && wait_promise.then) {
                    wait_promise = await wait_promise
                }
                if ((wait_promise !== false)) {
                    gvc.closeDialog()
                }
            })}"><i
                            class="fa-sharp fa-regular fa-circle-xmark"></i>
                    </div>
                </div>
                <div class=""
                     style="max-height:calc(100vh - 150px);overflow-y:auto;${(width) ? `${width}px;` : `0px;`}">
                    ${inner(gvc)}
                </div>
            </div>`
        }, tag ?? gvc.glitter.getUUID())
    }

    public static btnGroup(obj: {
        gvc: GVC, inner: string, style?: string, classS?: string, dropDownStyle?: string, top?: number, fontawesome: string

    }) {
        const html = String.raw
        const gvc = obj.gvc
        let interval: any = undefined
        return html`
            <div class="position-relative btn-group dropend subBt my-auto ms-1 ${obj.classS ?? ""}"
                 style="${obj.style ?? ""}"
                 onmouseover="${obj.gvc.event((e, event) => {


                     // $(e).children('.dropdown-menu').css('position', `fixed`);
                     // $(e).children('.dropdown-menu').css('width', `191px`);
                     // $(e).children('.dropdown-menu').css('height', `139px`);
                     // $(e).children('.dropdown-menu').css('left', `${box.left + 50}px`);
                     // $(e).children('.dropdown-menu').css('left', `${0}px`);
                     // $(e).children('.dropdown-menu').css('top', `${0}px`)
                     // },1000)
                 })}">

                <div type="button" class="bt"
                     style="background:none;"
                     data-bs-toggle="dropdown" aria-haspopup="true"
                     data-placement="left"
                     aria-expanded="false" onclick="${gvc.event((e, event) => {
                    // ($(e).children('.bt') as any).dropdown('show');
                    // setTimeout(()=>{
                    setTimeout(() => {
                        obj.top && $(e).parent().children('.dropdown-menu').css('top', `${obj.top}px`);
                        // $(e).parent().children('.dropdown-menu').css('left', `${-300}px`);
                    }, 100)
                    event.stopPropagation()
                    event.preventDefault()
                })}">
                    ${obj.fontawesome}
                </div>
                <div class="dropdown-menu mx-1"
                     data-placement="right"
                     onmouseover="${obj.gvc.event((e, event) => {
                         clearInterval(interval)
                     })}" onmouseout="${obj.gvc.event((e, event) => {
                    ($(e).children('.bt') as any).dropdown('hide');
                })}" style="min-height: 150px;${obj.dropDownStyle}">
                    <div class="px-2">
                        ${(obj.inner)}
                    </div>

                </div>
            </div>`
    }
}


function swapArr(arr: any, index1: number, index2: number) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}

export class Element {
    constructor() {

    }
}