var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../dialog/ShareDialog.js';
import autosize from './autosize.js';
import { BaseApi } from '../api/base.js';
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
const html = String.raw;
export class EditorElem {
    static uploadImage(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return html `${EditorElem.h3(obj.title)}
        ${obj.gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html ` <input
                            class="flex-fill form-control "
                            placeholder="請輸入圖片連結"
                            value="${obj.def}"
                            onchange="${obj.gvc.event((e) => {
                        obj.callback(e.value);
                    })}"
                        />
                        <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                        <i
                            class="fa-regular fa-eye text-black ms-2"
                            style="cursor: pointer;"
                            onclick="${obj.gvc.event(() => {
                        glitter.openDiaLog(new URL('../../dialog/image-preview.js', import.meta.url).href, 'preview', obj.def);
                    })}"
                        ></i>
                        <i
                            class="fa-regular fa-upload  ms-2 text-black"
                            style="cursor: pointer;"
                            onclick="${obj.gvc.event(() => {
                        glitter.ut.chooseMediaCallback({
                            single: true,
                            accept: 'json,image/*',
                            callback(data) {
                                const saasConfig = window.saasConfig;
                                const dialog = new ShareDialog(obj.gvc.glitter);
                                dialog.dataLoading({ visible: true });
                                const file = data[0].file;
                                saasConfig.api.uploadFile(file.name).then((data) => {
                                    dialog.dataLoading({ visible: false });
                                    const data1 = data.response;
                                    dialog.dataLoading({ visible: true });
                                    BaseApi.create({
                                        url: data1.url,
                                        type: 'put',
                                        data: file,
                                        headers: {
                                            'Content-Type': data1.type,
                                        },
                                    }).then((res) => {
                                        if (res.result) {
                                            dialog.dataLoading({ visible: false });
                                            obj.callback(data1.fullUrl);
                                            obj.def = data1.fullUrl;
                                            obj.gvc.notifyDataChange(id);
                                        }
                                        else {
                                            dialog.dataLoading({ visible: false });
                                            dialog.errorMessage({ text: '上傳失敗' });
                                        }
                                    });
                                });
                            },
                        });
                    })}"
                        ></i>`;
                },
                divCreate: {
                    class: `d-flex align-items-center mb-2`,
                },
            };
        })} `;
    }
    static uploadImageContainer(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        return html `${EditorElem.h3(obj.title)}
        ${gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (obj.def && obj.def.length > 0) {
                        return html `<div class="uimg-container">
                            <img class="uimg-image" src="${obj.def}" />
                            <div
                                class="uimg-shadow"
                                onmouseover="${gvc.event((e) => {
                            e.style.opacity = '1';
                        })}"
                                onmouseout="${gvc.event((e) => {
                            e.style.opacity = '0';
                        })}"
                            >
                                <i
                                    class="fa-regular fa-trash mx-auto fs-1 uimg-trash"
                                    onclick="${gvc.event(() => {
                            obj.def = '';
                            obj.callback(obj.def);
                            gvc.notifyDataChange(id);
                        })}"
                                ></i>
                            </div>
                        </div>`;
                    }
                    return html `<div class="uimg-container">
                        <button
                            class="btn btn-gray"
                            type="button"
                            onclick="${gvc.event(() => {
                        glitter.ut.chooseMediaCallback({
                            single: true,
                            accept: 'json,image/*',
                            callback(data) {
                                const saasConfig = window.saasConfig;
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.dataLoading({ visible: true });
                                const file = data[0].file;
                                saasConfig.api.uploadFile(file.name).then((data) => {
                                    dialog.dataLoading({ visible: false });
                                    const data1 = data.response;
                                    dialog.dataLoading({ visible: true });
                                    BaseApi.create({
                                        url: data1.url,
                                        type: 'put',
                                        data: file,
                                        headers: {
                                            'Content-Type': data1.type,
                                        },
                                    }).then((res) => {
                                        if (res.result) {
                                            dialog.dataLoading({ visible: false });
                                            obj.callback(data1.fullUrl);
                                            obj.def = data1.fullUrl;
                                            gvc.notifyDataChange(id);
                                        }
                                        else {
                                            dialog.dataLoading({ visible: false });
                                            dialog.errorMessage({ text: '上傳失敗' });
                                        }
                                    });
                                });
                            },
                        });
                    })}"
                        >
                            <span class="tx_700">新增圖片</span>
                        </button>
                    </div>`;
                },
            };
        })}`;
    }
    static fileUploadEvent(file, callback) {
        const glitter = window.glitter;
        glitter.ut.chooseMediaCallback({
            single: true,
            accept: file,
            callback(data) {
                const saasConfig = window.saasConfig;
                const dialog = new ShareDialog(glitter);
                dialog.dataLoading({ visible: true });
                const file = data[0].file;
                saasConfig.api.uploadFile(file.name).then((data) => {
                    dialog.dataLoading({ visible: false });
                    const data1 = data.response;
                    dialog.dataLoading({ visible: true });
                    BaseApi.create({
                        url: data1.url,
                        type: 'put',
                        data: file,
                        headers: {
                            'Content-Type': data1.type,
                        },
                    }).then((res) => {
                        if (res.result) {
                            dialog.dataLoading({ visible: false });
                            callback(data1.fullUrl);
                        }
                        else {
                            dialog.dataLoading({ visible: false });
                            dialog.errorMessage({ text: '上傳失敗' });
                        }
                    });
                });
            },
        });
    }
    static flexMediaManager(obj) {
        obj.gvc.addStyle(`
            .p-hover-image:hover {
                opacity: 1 !important; /* 在父元素悬停时，底层元素可见 */
            }
        `);
        const data = obj.data;
        return obj.gvc.bindView(() => {
            obj.gvc.addMtScript([
                {
                    src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                },
            ], () => { }, () => { });
            const id = obj.gvc.glitter.getUUID();
            const bid = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (data.length === 0) {
                        return html ` <div class="w-100 d-flex align-items-center justify-content-center fw-bold fs-6 alert m-0 bgf6">尚未新增任何檔案...</div>`;
                    }
                    return html `
                        <div class="" style="gap:10px; ">
                            <ul id="${bid}" class="d-flex " style="gap:10px;overflow-x: auto;">
                                ${data
                        .map((dd, index) => {
                        return html ` <li
                                            class="d-flex align-items-center justify-content-center rounded-3 shadow"
                                            index="${index}"
                                            style="min-width:135px;135px;height:135px;cursor:pointer;background: 50%/cover url('${dd}');"
                                        >
                                            <div
                                                class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image"
                                                style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                                            >
                                                <i
                                                    class="fa-regular fa-eye"
                                                    onclick="${obj.gvc.event(() => {
                            window.parent.glitter.openDiaLog(new URL('../../dialog/image-preview.js', import.meta.url).href, 'preview', dd);
                        })}"
                                                ></i>
                                                <i
                                                    class="fa-regular fa-trash"
                                                    onclick="${obj.gvc.event(() => {
                            data.splice(index, 1);
                            obj.gvc.notifyDataChange(id);
                        })}"
                                                ></i>
                                            </div>
                                        </li>`;
                    })
                        .join('')}
                            </ul>
                        </div>
                    `;
                },
                divCreate: { class: `w-100`, style: `overflow-x: auto;display: inline-block;white-space: nowrap; ` },
                onCreate: () => {
                    const interval = setInterval(() => {
                        if (window.Sortable) {
                            try {
                                obj.gvc.addStyle(`
                                    ul {
                                        list-style: none;
                                        padding: 0;
                                    }
                                `);
                                function swapArr(arr, index1, index2) {
                                    const data = arr[index1];
                                    arr.splice(index1, 1);
                                    arr.splice(index2, 0, data);
                                }
                                let startIndex = 0;
                                Sortable.create(document.getElementById(bid), {
                                    group: 'foo',
                                    animation: 100,
                                    onChange: function (evt) {
                                        swapArr(data, startIndex, evt.newIndex);
                                        startIndex = evt.newIndex;
                                    },
                                    onStart: function (evt) {
                                        startIndex = evt.oldIndex;
                                    },
                                });
                            }
                            catch (e) { }
                            clearInterval(interval);
                        }
                    }, 100);
                },
            };
        });
    }
    static flexMediaManagerV2(obj) {
        obj.gvc.addStyle(`
            .p-hover-image:hover {
                opacity: 1 !important; /* 在父元素悬停时，底层元素可见 */
            }
        `);
        const data = obj.data;
        return obj.gvc.bindView(() => {
            obj.gvc.addMtScript([
                {
                    src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                },
            ], () => { }, () => { });
            const id = obj.gvc.glitter.getUUID();
            const bid = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (data.length === 0) {
                        return html ` <div class="w-100 d-flex align-items-center justify-content-center fw-bold fs-6 alert m-0 bgf6">尚未新增任何檔案...</div>`;
                    }
                    return html `
                        <ul id="${bid}" class="d-flex " style="gap:10px;overflow-x: auto;max-width: 700px;">
                            ${data
                        .map((dd, index) => {
                        return html ` <li
                                        class="d-flex align-items-center justify-content-center rounded-3 shadow"
                                        index="${index}"
                                        style="min-width:135px;135px;height:135px;cursor:pointer;background: 50%/cover url('${dd}');"
                                    >
                                        <div
                                            class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image"
                                            style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                                        >
                                            <i
                                                class="fa-regular fa-eye"
                                                onclick="${obj.gvc.event(() => {
                            obj.gvc.glitter.openDiaLog(new URL('../../dialog/image-preview.js', import.meta.url).href, 'preview', dd);
                        })}"
                                            ></i>
                                            <i
                                                class="fa-regular fa-trash"
                                                onclick="${obj.gvc.event(() => {
                            data.splice(index, 1);
                            obj.gvc.notifyDataChange(id);
                        })}"
                                            ></i>
                                        </div>
                                    </li>`;
                    })
                        .join('')}
                        </ul>
                    `;
                },
                divCreate: { class: ``, style: `gap:10px;overflow-x: auto;display: flex;white-space: nowrap; ` },
                onCreate: () => {
                    const interval = setInterval(() => {
                        if (window.Sortable) {
                            try {
                                obj.gvc.addStyle(`
                                    ul {
                                        list-style: none;
                                        padding: 0;
                                    }
                                `);
                                function swapArr(arr, index1, index2) {
                                    const data = arr[index1];
                                    arr.splice(index1, 1);
                                    arr.splice(index2, 0, data);
                                }
                                let startIndex = 0;
                                Sortable.create(document.getElementById(bid), {
                                    group: 'foo',
                                    animation: 100,
                                    onChange: function (evt) {
                                        swapArr(data, startIndex, evt.newIndex);
                                        startIndex = evt.newIndex;
                                    },
                                    onStart: function (evt) {
                                        startIndex = evt.oldIndex;
                                    },
                                });
                            }
                            catch (e) { }
                            clearInterval(interval);
                        }
                    }, 100);
                },
            };
        });
    }
    static editeText(obj) {
        var _a;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        const id = obj.gvc.glitter.getUUID();
        return html `${EditorElem.h3(obj.title)}
        ${obj.gvc.bindView({
            bind: id,
            view: () => {
                var _a;
                return (_a = obj.default) !== null && _a !== void 0 ? _a : '';
            },
            divCreate: {
                elem: `textArea`,
                style: `max-height:400px!important;min-height:100px;`,
                class: `form-control`,
                option: [
                    { key: 'placeholder', value: obj.placeHolder },
                    {
                        key: 'onchange',
                        value: obj.gvc.event((e) => {
                            obj.callback(e.value);
                        }),
                    },
                ],
            },
            onCreate: () => {
                autosize(obj.gvc.getBindViewElem(id));
            },
        })}`;
    }
    static styleEditor(obj) {
        let idlist = [];
        function getComponent(gvc, height) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID();
                idlist.push(id);
                const frameID = obj.gvc.glitter.getUUID();
                const domain = 'https://sam38124.github.io/code_component';
                let listener = function (event) {
                    if (event.data.type === 'initial') {
                        const childWindow = document.getElementById(frameID).contentWindow;
                        function addNewlineAfterSemicolon(inputString) {
                            const regex = /;/g;
                            const resultString = inputString.replace(regex, ';\n');
                            return resultString;
                        }
                        childWindow.postMessage({
                            type: 'getData',
                            value: obj.dontRefactor
                                ? obj.initial
                                : `style {
    ${addNewlineAfterSemicolon(obj.initial)}
}`,
                            language: 'css',
                            refactor: !obj.dontRefactor,
                        }, domain);
                    }
                    else if (event.data.data.callbackID === id) {
                        if (obj.dontRefactor) {
                            obj.initial = event.data.data.value;
                            obj.callback(event.data.data.value);
                        }
                        else {
                            const array = event.data.data.value.split('\n');
                            const cb = array
                                .filter((dd, index) => {
                                return index !== 0 && index !== array.length - 1;
                            })
                                .join('');
                            obj.callback(cb);
                            obj.initial = cb;
                        }
                    }
                };
                return {
                    bind: id,
                    view: () => {
                        return html ` <iframe
                            id="${frameID}"
                            class="w-100 h-100 border rounded-3"
                            src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"
                        ></iframe>`;
                    },
                    divCreate: { class: `w-100 `, style: `height:${height}px;` },
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                        gvc.glitter.share.postMessageCallback.push({
                            fun: listener,
                            id: frameID,
                        });
                    },
                };
            });
        }
        return (html `
                <div class="d-flex">
                    ${obj.title ? EditorElem.h3(obj.title) : ''}
                    <div
                        class="d-flex align-items-center justify-content-center"
                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                        onclick="${obj.gvc.event(() => {
            EditorElem.openEditorDialog(obj.gvc, (gvc) => {
                return getComponent(gvc, window.innerHeight - 100);
            }, () => {
                obj.gvc.notifyDataChange(idlist);
            });
        })}"
                    >
                        <i class="fa-solid fa-expand"></i>
                    </div>
                </div>
            ` + getComponent(obj.gvc, obj.height));
    }
    static htmlEditor(obj) {
        let idlist = [];
        function getComponent(gvc, height) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID();
                idlist.push(id);
                const frameID = obj.gvc.glitter.getUUID();
                const domain = 'https://sam38124.github.io/code_component';
                let listener = function (event) {
                    if (event.data.type === 'initial') {
                        const childWindow = document.getElementById(frameID).contentWindow;
                        childWindow.postMessage({
                            type: 'getData',
                            value: obj.initial,
                            language: 'html',
                            refactor: !obj.dontRefactor,
                        }, domain);
                    }
                    else if (event.data.data.callbackID === id) {
                        obj.initial = event.data.data.value;
                        obj.callback(event.data.data.value);
                    }
                };
                return {
                    bind: id,
                    view: () => {
                        return html `
                            <iframe
                                id="${frameID}"
                                class="w-100 h-100 border rounded-3"
                                src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"
                            ></iframe>
                        `;
                    },
                    divCreate: { class: `w-100 `, style: `height:${height}px;` },
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                        gvc.glitter.share.postMessageCallback.push({
                            fun: listener,
                            id: frameID,
                        });
                    },
                };
            });
        }
        return (html `
                <div class="d-flex">
                    ${obj.title ? EditorElem.h3(obj.title) : ''}
                    <div
                        class="d-flex align-items-center justify-content-center"
                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                        onclick="${obj.gvc.event(() => {
            EditorElem.openEditorDialog(obj.gvc, (gvc) => {
                return getComponent(gvc, window.innerHeight - 100);
            }, () => {
                obj.gvc.notifyDataChange(idlist);
            });
        })}"
                    >
                        <i class="fa-solid fa-expand"></i>
                    </div>
                </div>
            ` + getComponent(obj.gvc, obj.height));
    }
    static pageEditor(cf) {
        const href = new URL(location.href);
        href.searchParams.set('page', cf.page);
        href.searchParams.set('type', 'editor');
        href.searchParams.set('editorPosition', '0');
        href.searchParams.set('blogEditor', 'true');
        cf.par.map((dd) => {
            href.searchParams.set(dd.key, dd.value);
        });
        return html ` <iframe class="rounded-3" src="${href.href}" style="border: none;width:${cf.width}px;height:${cf.height}px;"></iframe>`;
    }
    static iframeComponent(cf) {
        const href = new URL(location.href);
        href.searchParams.set('page', cf.page);
        href.searchParams.delete('type');
        href.searchParams.delete('router');
        cf.par.map((dd) => {
            href.searchParams.set(dd.key, dd.value);
        });
        return html ` <iframe class="rounded-3" src="${href.href}" style="border: none;width:${cf.width}px;height:${cf.height}px;"></iframe>`;
    }
    static codeEditor(obj) {
        const codeID = obj.gvc.glitter.getUUID();
        function getComponent(gvc, height) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID();
                const frameID = obj.gvc.glitter.getUUID();
                const domain = 'https://sam38124.github.io/code_component';
                let listener = function (event) {
                    var _a;
                    if (event.data.type === 'initial') {
                        const childWindow = (document.getElementById(frameID) || window.parent.document.getElementById(frameID)).contentWindow;
                        childWindow.postMessage({
                            type: 'getData',
                            value: `${obj.structStart ? obj.structStart : `(()=>{`}
${(_a = obj.initial) !== null && _a !== void 0 ? _a : ''}
${obj.structEnd ? obj.structEnd : '})()'}`,
                            language: 'javascript',
                            refactor: true,
                            structStart: obj.structStart,
                            structEnd: obj.structEnd,
                        }, domain);
                    }
                    else if (event.data.data && event.data.data.callbackID === id) {
                        const array = event.data.data.value.split('\n');
                        const data = array
                            .filter((dd, index) => {
                            return index !== 0 && index !== array.length - 1;
                        })
                            .join('\n');
                        obj.initial = data;
                        obj.callback(data);
                    }
                };
                return {
                    bind: id,
                    view: () => {
                        return html `
                            <iframe
                                id="${frameID}"
                                class="w-100 h-100 border rounded-3"
                                src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"
                            ></iframe>
                        `;
                    },
                    divCreate: { class: `w-100 `, style: `height:${height}px;` },
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                        gvc.glitter.share.postMessageCallback.push({
                            fun: listener,
                            id: frameID,
                        });
                    },
                };
            });
        }
        return obj.gvc.bindView(() => {
            return {
                bind: codeID,
                view: () => {
                    return (html ` <div class="d-flex">
                            ${obj.title ? EditorElem.h3(obj.title) : ''}
                            <div
                                class="d-flex align-items-center justify-content-center"
                                style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                onclick="${obj.gvc.event(() => {
                        EditorElem.openEditorDialog(obj.gvc, (gvc) => {
                            return getComponent(gvc, window.innerHeight - 100);
                        }, () => {
                            obj.gvc.notifyDataChange(codeID);
                        });
                    })}"
                            >
                                <i class="fa-solid fa-expand"></i>
                            </div>
                        </div>` + getComponent(obj.gvc, obj.height));
                },
            };
        });
    }
    static customCodeEditor(obj) {
        let idlist = [];
        function getComponent(gvc, height) {
            return gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID();
                const frameID = obj.gvc.glitter.getUUID();
                idlist.push(id);
                const domain = 'https://sam38124.github.io/code_component';
                return {
                    bind: id,
                    view: () => {
                        return html `
                            <iframe
                                id="${frameID}"
                                class="w-100 h-100 border rounded-3"
                                src="${domain}/browser-amd-editor/component.html?height=${height}&link=${location.origin}&callbackID=${id}"
                            ></iframe>
                        `;
                    },
                    divCreate: { class: `w-100 `, style: `height:${height}px;` },
                    onDestroy: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                    },
                    onCreate: () => {
                        gvc.glitter.share.postMessageCallback = gvc.glitter.share.postMessageCallback.filter((dd) => {
                            return dd.id === frameID;
                        });
                        gvc.glitter.share.postMessageCallback.push({
                            fun: (event) => {
                                var _a;
                                if (event.data.type === 'initial') {
                                    if (document.getElementById(frameID)) {
                                        const childWindow = document.getElementById(frameID).contentWindow;
                                        childWindow.postMessage({
                                            type: 'getData',
                                            value: (_a = obj.initial) !== null && _a !== void 0 ? _a : '',
                                            language: obj.language,
                                            refactor: true,
                                        }, domain);
                                    }
                                }
                                else if (event.data.data.callbackID === id) {
                                    obj.initial = event.data.data.value;
                                    obj.callback(event.data.data.value);
                                }
                            },
                            id: frameID,
                        });
                    },
                };
            });
        }
        return (html `
                <div class="d-flex">
                    ${obj.title ? EditorElem.h3(obj.title) : ''}
                    <div
                        class="d-flex align-items-center justify-content-center"
                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                        onclick="${obj.gvc.event(() => {
            EditorElem.openEditorDialog(obj.gvc, (gvc) => {
                return getComponent(gvc, window.innerHeight - 100);
            }, () => {
                obj.gvc.notifyDataChange(idlist);
            });
        })}"
                    >
                        <i class="fa-solid fa-expand"></i>
                    </div>
                </div>
            ` + getComponent(obj.gvc, obj.height));
    }
    static richText(obj) {
        let quill = undefined;
        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            const richID = obj.gvc.glitter.getUUID();
            obj.gvc.glitter.addMtScript([
                '../../jslib/froala.js',
                '../../jslib/froala/languages/zh_tw.js',
            ].map((dd) => {
                return { src: new URL(dd, import.meta.url) };
            }), () => { }, () => { });
            obj.gvc.addStyleLink(['https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css']);
            return {
                bind: id,
                view: () => {
                    return html ` <div style="" class="" id="${richID}">${obj.def}</div>`;
                },
                divCreate: {
                    style: `${obj.style || `overflow-y: auto;`}position:relative;`,
                },
                onCreate: () => {
                    const interval = setInterval(() => {
                        if (window.FroalaEditor) {
                            obj.gvc.addStyle(`.fr-sticky-on {
    position: relative !important;
    z-index: 10;
}
.fr-sticky-dummy{
display:none !important;
}
`);
                            const editor = new FroalaEditor('#' + richID, {
                                language: 'zh_tw',
                                heightMin: 500,
                                content: obj.def,
                                events: {
                                    imageMaxSize: 5 * 1024 * 1024,
                                    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                                    contentChanged: function () {
                                        obj.callback(editor.html.get());
                                    },
                                    'image.beforeUpload': function (e, images) {
                                        EditorElem.uploadFileFunction({
                                            gvc: obj.gvc,
                                            callback: (text) => {
                                                editor.html.insert(`<img src="${text}">`);
                                            },
                                            file: e[0],
                                        });
                                        return false;
                                    },
                                },
                                key: 'hWA2C-7I2B2C4B3E4E2G3wd1DBKSPF1WKTUCQOa1OURPJ1KDe2F-11D2C2D2D2C3B3C1D6B1C2==',
                            });
                            setTimeout(() => {
                                const target = document.querySelector(`#insertImage-1`);
                                target.outerHTML = html ` <button
                                    id="insertImage-1"
                                    type="button"
                                    tabindex="-1"
                                    role="button"
                                    class="fr-command fr-btn "
                                    data-title="插入圖片 (⌘P)"
                                    onclick="${obj.gvc.event(() => {
                                    obj.gvc.glitter.ut.chooseMediaCallback({
                                        single: true,
                                        accept: 'image/*',
                                        callback(data) {
                                            const saasConfig = window.saasConfig;
                                            const dialog = new ShareDialog(obj.gvc.glitter);
                                            dialog.dataLoading({ visible: true });
                                            const file = data[0].file;
                                            saasConfig.api.uploadFile(file.name).then((data) => {
                                                dialog.dataLoading({ visible: false });
                                                const data1 = data.response;
                                                dialog.dataLoading({ visible: true });
                                                BaseApi.create({
                                                    url: data1.url,
                                                    type: 'put',
                                                    data: file,
                                                    headers: {
                                                        'Content-Type': data1.type,
                                                    },
                                                }).then((res) => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (res.result) {
                                                        editor.html.insert(`<img src="${data1.fullUrl}">`);
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '上傳失敗' });
                                                    }
                                                });
                                            });
                                        },
                                    });
                                })}"
                                >
                                    <svg class="fr-svg" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.2,11l3.8,5H6l3-3.9l2.1,2.7L14,11H14.2z M8.5,11c0.8,0,1.5-0.7,1.5-1.5S9.3,8,8.5,8S7,8.7,7,9.5C7,10.3,7.7,11,8.5,11z   M22,6v12c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V6c0-1.1,0.9-2,2-2h16C21.1,4,22,4.9,22,6z M20,8.8V6H4v12h16V8.8z"
                                        ></path>
                                    </svg>
                                    <span class="fr-sr-only">插入圖片</span>
                                </button>`;
                            }, 100);
                            clearInterval(interval);
                        }
                    }, 200);
                },
            };
        });
    }
    static richTextBtn(obj) {
        return EditorElem.buttonPrimary(obj.title, obj.gvc.event(() => {
            EditorElem.openEditorDialog(obj.gvc, () => {
                return `<div class="p-3" style="overflow: hidden;">
${EditorElem.richText({
                    gvc: obj.gvc,
                    def: obj.def,
                    callback: (text) => {
                        obj.def = text;
                        obj.callback(text);
                    },
                })}
</div>`;
            }, () => { }, 800, obj.title);
        }));
    }
    static pageSelect(gvc, title, def, callback, filter) {
        const glitter = gvc.glitter;
        const id = glitter.getUUID();
        const data = {
            dataList: undefined,
        };
        const saasConfig = window.parent.saasConfig;
        function getData() {
            BaseApi.create({
                url: saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                type: 'GET',
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((d2) => {
                data.dataList = d2.response.result.filter((dd) => {
                    return !filter || filter(dd);
                });
                gvc.notifyDataChange(id);
            });
        }
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
                                    title: '選擇嵌入頁面',
                                    value: '',
                                },
                            ].concat(data.dataList
                                .sort(function (a, b) {
                                if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                    return -1;
                                }
                                if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                    return 1;
                                }
                                return 0;
                            })
                                .map((dd) => {
                                return {
                                    title: `${dd.group}-${dd.name}`,
                                    value: dd.tag,
                                };
                            })),
                            callback: (text) => {
                                callback(text);
                            },
                        });
                    }
                    else {
                        return ``;
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (!data.dataList) {
                        setTimeout(() => {
                            getData();
                        }, 100);
                    }
                },
            };
        });
    }
    static uploadFile(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return `${EditorElem.h3(obj.title)}
${obj.gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a;
                    return html `<input
                    class="flex-fill form-control "
                    placeholder="請輸入檔案連結"
                    value="${(_a = obj.def) !== null && _a !== void 0 ? _a : ''}"
                    onchange="${obj.gvc.event((e) => {
                        obj.callback(e.value);
                    })}"
                    ${obj.readonly ? `readonly` : ``}
                />
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                ${!obj.readonly
                        ? html `<i
                          class="fa-regular fa-upload  ms-2 fs-5"
                          style="cursor: pointer;color:black;"
                          onclick="${obj.gvc.event(() => {
                            glitter.ut.chooseMediaCallback({
                                single: true,
                                accept: '*',
                                callback(data) {
                                    const saasConfig = window.saasConfig;
                                    const dialog = new ShareDialog(obj.gvc.glitter);
                                    dialog.dataLoading({ visible: true });
                                    const file = data[0].file;
                                    saasConfig.api.uploadFile(file.name).then((data) => {
                                        dialog.dataLoading({ visible: false });
                                        const data1 = data.response;
                                        dialog.dataLoading({ visible: true });
                                        BaseApi.create({
                                            url: data1.url,
                                            type: 'put',
                                            data: file,
                                            headers: {
                                                'Content-Type': data1.type,
                                            },
                                        }).then((res) => {
                                            if (res.result) {
                                                dialog.dataLoading({ visible: false });
                                                obj.def = data1.fullUrl;
                                                obj.callback(data1.fullUrl);
                                                obj.gvc.notifyDataChange(id);
                                            }
                                            else {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: '上傳失敗' });
                                            }
                                        });
                                    });
                                },
                            });
                        })}"
                      ></i>`
                        : ``} `;
                },
                divCreate: {
                    class: `d-flex align-items-center mb-2`,
                },
            };
        })}
          `;
    }
    static uploadFileFunction(obj) {
        var _a;
        const glitter = window.glitter;
        function upload(file) {
            const saasConfig = window.saasConfig;
            const dialog = new ShareDialog(obj.gvc.glitter);
            dialog.dataLoading({ visible: true });
            saasConfig.api
                .uploadFile((file.name ||
                `${glitter.getUUID()}.${(() => {
                    if (file.type === 'image/jpeg') {
                        return `jpg`;
                    }
                    else if (file.type === 'image/png') {
                        return `png`;
                    }
                    else {
                        return `png`;
                    }
                })()}`).replace(/ /g, ''))
                .then((data) => {
                dialog.dataLoading({ visible: false });
                const data1 = data.response;
                dialog.dataLoading({ visible: true });
                BaseApi.create({
                    url: data1.url,
                    type: 'put',
                    data: file,
                    headers: {
                        'Content-Type': data1.type,
                    },
                }).then((res) => {
                    if (res.result) {
                        dialog.dataLoading({ visible: false });
                        obj.callback(data1.fullUrl);
                    }
                    else {
                        dialog.dataLoading({ visible: false });
                        dialog.errorMessage({ text: '上傳失敗' });
                    }
                });
            });
        }
        if (obj.file) {
            upload(obj.file);
        }
        else {
            glitter.ut.chooseMediaCallback({
                single: true,
                accept: (_a = obj.type) !== null && _a !== void 0 ? _a : '*',
                callback(data) {
                    upload(data[0].file);
                },
            });
        }
    }
    static uploadVideo(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return html `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
            <div class="d-flex align-items-center mb-3">
                <input
                    class="flex-fill form-control "
                    placeholder="請輸入圖片連結"
                    value="${obj.def}"
                    onchange="${obj.gvc.event((e) => {
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
                accept: 'json,video/*',
                callback(data) {
                    const saasConfig = window.saasConfig;
                    const dialog = new ShareDialog(obj.gvc.glitter);
                    dialog.dataLoading({ visible: true });
                    const file = data[0].file;
                    saasConfig.api.uploadFile(file.name).then((data) => {
                        dialog.dataLoading({ visible: false });
                        const data1 = data.response;
                        dialog.dataLoading({ visible: true });
                        BaseApi.create({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            headers: {
                                'Content-Type': data1.type,
                            },
                        }).then((res) => {
                            if (res.result) {
                                dialog.dataLoading({ visible: false });
                                obj.callback(data1.fullUrl);
                            }
                            else {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: '上傳失敗' });
                            }
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
    }
    static uploadLottie(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return html `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
            <div class="alert alert-dark alert-dismissible fade show" role="alert" style="white-space: normal;word-break: break-word;">
                <a onclick="${obj.gvc.event(() => glitter.openNewTab(`https://lottiefiles.com/`))}" class="fw text-white" style="cursor: pointer;">Lottie</a>
                是開放且免費的動畫平台，可以前往下載動畫檔後進行上傳．
            </div>
            <div class="d-flex align-items-center mb-3">
                <input
                    class="flex-fill form-control "
                    placeholder="請輸入圖片連結"
                    value="${obj.def}"
                    onchange="${obj.gvc.event((e) => {
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
                callback(data) {
                    const saasConfig = window.saasConfig;
                    const dialog = new ShareDialog(obj.gvc.glitter);
                    dialog.dataLoading({ visible: true });
                    const file = data[0].file;
                    saasConfig.api.uploadFile(file.name).then((data) => {
                        dialog.dataLoading({ visible: false });
                        const data1 = data.response;
                        dialog.dataLoading({ visible: true });
                        BaseApi.create({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            headers: {
                                'Content-Type': data1.type,
                            },
                        }).then((res) => {
                            if (res.result) {
                                dialog.dataLoading({ visible: false });
                                obj.callback(data1.fullUrl);
                            }
                            else {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: '上傳失敗' });
                            }
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
    }
    static h3(title) {
        return html `<h3 style="color: #393939;font-size: 15px;margin-bottom: 5px;" class="fw-500 mt-2">${title}</h3>`;
    }
    static plusBtn(title, event) {
        return html ` <div class="w-100 my-3" style="background: black;height: 1px;"></div>
            <div class="fw-500 text-dark align-items-center justify-content-center d-flex p-1 rounded mt-1 hoverBtn" style="border: 1px solid #151515;color:#151515;" onclick="${event}">
                ${title}
            </div>`;
    }
    static fontawesome(obj) {
        const glitter = window.glitter;
        return (html `
                ${EditorElem.h3(obj.title)}
                <div class="alert alert-info fade show p-2" role="alert" style="white-space: normal;word-break: break-all;">
                    <a onclick="${obj.gvc.event(() => glitter.openNewTab('https://fontawesome.com/search'))}" class="fw fw-bold" style="cursor: pointer;">fontawesome</a>
                    與
                    <a onclick="${obj.gvc.event(() => glitter.openNewTab('https://boxicons.com/'))}" class="fw fw-bold" style="cursor: pointer;">box-icon</a>
                    是開放且免費的icon提供平台，可以前往挑選合適標籤進行設定.
                </div>
            ` +
            glitter.htmlGenerate.editeInput({
                gvc: obj.gvc,
                title: '',
                default: obj.def,
                placeHolder: '請輸入ICON-標籤',
                callback: (text) => {
                    obj.callback(text);
                },
            }));
    }
    static toggleExpand(obj) {
        var _a;
        const color = (_a = obj.color) !== null && _a !== void 0 ? _a : `#4144b0;`;
        const glitter = window.glitter;
        return html `${obj.gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (obj.data.expand) {
                        return html ` <div
                            class="toggleInner  mb-2 p-2"
                            style="width:calc(100%);border-radius:8px;
                    min-height:45px;background:#d9f1ff;border: 1px solid #151515;color:#151515;"
                        >
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
                            ${typeof obj.innerText === 'string' ? obj.innerText : obj.innerText()}
                        </div>`;
                    }
                    return html ` <div
                        class="toggleInner  mb-2 p-2"
                        style="width:calc(100%);border-radius:8px;
                    min-height:45px;background:#d9f1ff;border: 1px solid #151515;color:#151515;"
                    >
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
    static minusTitle(title, event) {
        return html ` <div class="d-flex align-items-center">
            <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${event}"></i>
            <h3 style="color: black;font-size: 16px;" class="m-0">${title}</h3>
        </div>`;
    }
    static searchInput(obj) {
        obj.def = obj.def || '';
        const glitter = window.glitter;
        const gvc = obj.gvc;
        const $ = glitter.$;
        let changeInterval = undefined;
        return html `
            ${obj.title ? EditorElem.h3(obj.title) : ``}
            <div class="btn-group dropdown w-100">
                ${(() => {
            const id = glitter.getUUID();
            const id2 = glitter.getUUID();
            return html `
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id2,
                    view: () => {
                        return html `<input
                                        class="form-control w-100"
                                        style="height: 40px;"
                                        placeholder="${obj.placeHolder}"
                                        onfocus="${obj.gvc.event(() => {
                            gvc.getBindViewElem(id).addClass(`show`);
                        })}"
                                        onblur="${gvc.event(() => { })}"
                                        oninput="${gvc.event((e) => {
                            obj.def = e.value;
                            gvc.notifyDataChange(id);
                            setTimeout(() => {
                                gvc.getBindViewElem(id).addClass(`show`);
                            }, 100);
                        })}"
                                        value="${obj.def.replace(/"/g, "'")}"
                                        onchange="${gvc.event((e) => {
                            changeInterval = setTimeout(() => {
                                obj.def = e.value;
                                obj.callback(obj.def);
                                setTimeout(() => {
                                    gvc.getBindViewElem(id).removeClass(`show`);
                                }, 100);
                            }, 200);
                        })}"
                                    />`;
                    },
                    divCreate: { class: `w-100` },
                };
            })}
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return obj.array
                            .filter((d2) => {
                            return d2.toUpperCase().indexOf(obj.def.toUpperCase()) !== -1;
                        })
                            .map((d3) => {
                            return html ` <button
                                                class="dropdown-item"
                                                onclick="${gvc.event(() => {
                                clearInterval(changeInterval);
                                obj.def = d3;
                                gvc.notifyDataChange(id2);
                                obj.callback(obj.def);
                                setTimeout(() => {
                                    gvc.getBindViewElem(id).removeClass(`show`);
                                }, 100);
                            })}"
                                            >
                                                ${d3}
                                            </button>`;
                        })
                            .join('');
                    },
                    divCreate: {
                        class: `dropdown-menu`,
                        style: `
                                        transform: translateY(40px);
                                        max-height: 200px;
                                        overflow-y: scroll;
                                        position: fixed;
                                    `,
                    },
                };
            })}
                    `;
        })()}
            </div>
        `;
    }
    static searchInputDynamic(obj) {
        const glitter = window.glitter;
        const gvc = obj.gvc;
        const $ = glitter.$;
        let array = [];
        return html `
            ${obj.title ? EditorElem.h3(obj.title) : ``}
            <div class="btn-group dropdown w-100">
                ${(() => {
            const id = glitter.getUUID();
            const id2 = glitter.getUUID();
            function refreshData() {
                obj.search(obj.def, (data) => {
                    array = data;
                    try {
                        gvc.notifyDataChange(id);
                        setTimeout(() => {
                            gvc.getBindViewElem(id).addClass(`show`);
                        }, 100);
                    }
                    catch (e) { }
                });
            }
            return html `
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id2,
                    view: () => {
                        return html `<input
                                        class="form-control w-100"
                                        style="height: 40px;max-height:100%;"
                                        placeholder="${obj.placeHolder}"
                                        onfocus="${obj.gvc.event(() => {
                            gvc.getBindViewElem(id).addClass(`show`);
                            refreshData();
                        })}"
                                        onblur="${gvc.event(() => {
                            setTimeout(() => {
                                gvc.getBindViewElem(id).removeClass(`show`);
                            }, 300);
                        })}"
                                        oninput="${gvc.event((e) => {
                            obj.def = e.value;
                            refreshData();
                        })}"
                                        value="${obj.def}"
                                        onchange="${gvc.event((e) => {
                            obj.def = e.value;
                            setTimeout(() => {
                                obj.callback(obj.def);
                            }, 500);
                        })}"
                                    />`;
                    },
                    divCreate: { class: `w-100` },
                };
            })}
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return array
                            .filter((d2) => {
                            return d2.toUpperCase().indexOf(obj.def.toUpperCase()) !== -1;
                        })
                            .map((d3) => {
                            return html ` <button
                                                class="dropdown-item"
                                                onclick="${gvc.event(() => {
                                obj.def = d3;
                                gvc.notifyDataChange(id2);
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
    static editeInput(obj) {
        var _a, _b, _c, _d;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        return html `${obj.title ? EditorElem.h3(obj.title) : ``}
            <div class="d-flex align-items-center">
                <input
                    class="form-control"
                    style="${(_b = obj.style) !== null && _b !== void 0 ? _b : ''}"
                    type="${(_c = obj.type) !== null && _c !== void 0 ? _c : 'text'}"
                    placeholder="${obj.placeHolder}"
                    onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
                    oninput="${obj.gvc.event((e) => {
            if (obj.pattern) {
                const value = e.value;
                const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                const validValue = value.replace(regex, '');
                if (value !== validValue) {
                    e.value = validValue;
                }
            }
        })}"
                    value="${(_d = obj.default) !== null && _d !== void 0 ? _d : ''}"
                    ${obj.readonly ? `readonly` : ``}
                />
                ${obj.unit ? html `<div class="p-2">${obj.unit}</div>` : ''}
            </div> `;
    }
    static container(array) {
        return array.join(`<div class="my-2"></div>`);
    }
    static colorSelect(obj) {
        obj.def = obj.def || '#FFFFFF';
        return html `${obj.title ? `<div class="t_39_16">${obj.title}</div>` : ``}
        ${obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return `<input class="form-control form-control-color p-0 " type="color" style="border:none;width:24px;height: 24px;"
                 value="${obj.def}" onchange="${obj.gvc.event((e, event) => {
                        obj.def = e.value;
                        obj.gvc.notifyDataChange(id);
                        obj.callback(obj.def);
                    })}">
            <input class="flex-fill ms-2" value="${obj.def}" placeholder="" style="border:none;width:100px;" onchange="${obj.gvc.event((e, event) => {
                        if (!e.value.includes('#')) {
                            alert('請輸入正確數值');
                            obj.gvc.notifyDataChange(id);
                        }
                        else {
                            obj.def = e.value;
                            obj.callback(obj.def);
                            obj.gvc.notifyDataChange(id);
                        }
                    })}">`;
                },
                divCreate: {
                    class: `mt-2 d-flex align-items-center`,
                    style: `padding:10px;border-radius: 7px;border: 1px solid #DDD;`,
                },
            };
        })} `;
    }
    static select(obj) {
        var _a, _b;
        return html `
            ${obj.title ? EditorElem.h3(obj.title) : ``}
            <select
                class="form-select ${(_a = obj.class) !== null && _a !== void 0 ? _a : ''}"
                style="max-height:100%; ${(_b = obj.style) !== null && _b !== void 0 ? _b : ''};"
                onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
                ${obj.readonly ? `disabled` : ``}
                onclick="${obj.gvc.event((e, event) => {
            if (obj.readonly) {
                event.stopPropagation();
                event.preventDefault();
            }
        })}"
            >
                ${obj.array
            .map((dd) => {
            if (typeof dd === 'object') {
                return html ` <option value="${dd.value}" ${dd.value === obj.def ? `selected` : ``}>${dd.title}</option>`;
            }
            else {
                return html ` <option value="${dd}" ${dd === obj.def ? `selected` : ``}>${dd}</option>`;
            }
        })
            .join('')}
            </select>
        `;
    }
    static checkBox(obj) {
        var _a;
        obj.type = (_a = obj.type) !== null && _a !== void 0 ? _a : 'single';
        const gvc = obj.gvc;
        return html `
            ${obj.title ? EditorElem.h3(obj.title) : ``}
            ${obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return obj.array
                        .map((dd) => {
                        function isSelect() {
                            if (obj.type === 'multiple') {
                                return obj.def.find((d2) => {
                                    return d2 === dd.value;
                                });
                            }
                            else {
                                return obj.def === dd.value;
                            }
                        }
                        return html `
                                    <div
                                        class="d-flex align-items-center"
                                        onclick="${obj.gvc.event(() => {
                            if (obj.type === 'multiple') {
                                if (obj.def.find((d2) => {
                                    return d2 === dd.value;
                                })) {
                                    obj.def = obj.def.filter((d2) => {
                                        return d2 !== dd.value;
                                    });
                                }
                                else {
                                    obj.def.push(dd.value);
                                }
                                obj.callback(obj.def);
                            }
                            else {
                                obj.def = dd.value;
                                obj.callback(dd.value);
                            }
                            gvc.notifyDataChange(id);
                        })}"
                                    >
                                        <i class="${isSelect() ? `fa-solid fa-square-check` : `fa-regular fa-square`} me-2" style="${isSelect() ? `color:#295ed1;` : `color:black;`}"></i>
                                        <span style="font-size:0.85rem;">${dd.title}</span>
                                    </div>
                                    ${obj.def === dd.value && dd.innerHtml ? `<div class="mt-1">${dd.innerHtml}</div>` : ``}
                                `;
                    })
                        .join('<div class="my-2"></div>');
                },
                divCreate: {
                    class: `ps-1`,
                },
            };
        })}
        `;
    }
    static checkBoxOnly(obj) {
        return obj.gvc.bindView(() => {
            var _a;
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `<i class="${obj.def ? `fa-solid fa-square-check` : `fa-regular fa-square`} " style="color: #393939;"></i>`;
                },
                divCreate: {
                    option: [
                        {
                            key: 'onclick',
                            value: obj.gvc.event((e, event) => {
                                obj.def = !obj.def;
                                obj.callback(obj.def);
                                event.stopPropagation();
                                obj.gvc.notifyDataChange(id);
                            }),
                        },
                    ],
                    class: `d-flex align-items-center justify-content-center`,
                    style: `height:20px;font-size:18px;cursor:pointer;${(_a = obj.style) !== null && _a !== void 0 ? _a : ''}`,
                },
            };
        });
    }
    static radio(obj) {
        var _a;
        obj.type = (_a = obj.type) !== null && _a !== void 0 ? _a : 'single';
        const gvc = obj.gvc;
        return html `
            ${obj.title ? html `<div class="tx_700" style="margin-bottom: 18px">${obj.title}</div>` : ``}
            ${obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return obj.array
                        .map((dd) => {
                        function isSelect() {
                            if (obj.type === 'multiple') {
                                return obj.def.find((d2) => {
                                    return d2 === dd.value;
                                });
                            }
                            else {
                                return obj.def === dd.value;
                            }
                        }
                        return html `
                                    <div
                                        class="d-flex align-items-center"
                                        onclick="${obj.gvc.event(() => {
                            if (obj.type === 'multiple') {
                                if (obj.def.find((d2) => {
                                    return d2 === dd.value;
                                })) {
                                    obj.def = obj.def.filter((d2) => {
                                        return d2 !== dd.value;
                                    });
                                }
                                else {
                                    obj.def.push(dd.value);
                                }
                                obj.callback(obj.def);
                            }
                            else {
                                obj.def = dd.value;
                                obj.callback(dd.value);
                            }
                            gvc.notifyDataChange(id);
                        })}"
                                    >
                                        <i class="${isSelect() ? `fa-solid fa-circle-dot` : `fa-regular fa-circle`} me-2" style="color: #000"></i>
                                        <span style="font-size: 16px; cursor: pointer;">${dd.title}</span>
                                    </div>
                                    ${obj.def === dd.value && dd.innerHtml ? `<div style="margin-top: 8px;">${dd.innerHtml}</div>` : ``}
                                `;
                    })
                        .join(html `<div style="margin-top: 12px;"></div>`);
                },
                divCreate: {
                    class: `${obj.oneLine ? 'd-flex gap-2' : ''} ps-1`,
                },
            };
        })}
        `;
    }
    static editerDialog(par) {
        return html ` <button
            type="button"
            class="btn btn-primary-c  w-100"
            style=""
            onclick="${par.gvc.event(() => {
            const gvc = par.gvc;
            NormalPageEditor.toggle({
                visible: true,
                view: `
                    <div class="p-2"
                             style="overflow-y:auto;">
                            ${par.dialog(gvc)}
                        </div>`,
                title: par.editTitle || '',
            });
        })}"
        >
            ${par.editTitle}
        </button>`;
    }
    static folderLineItems(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const parId = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            gvc.glitter.addMtScript([
                {
                    src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                },
            ], () => { }, () => { });
            return {
                bind: parId,
                view: () => {
                    return obj.viewArray
                        .map((dd, index) => {
                        const checkChildSelect = (setting) => {
                            for (const b of setting) {
                                if (obj.isOptionSelected(b)) {
                                    return true;
                                }
                                if (b.data && b.dataList && checkChildSelect(b.dataList)) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        const childSelect = dd.type === 'container' ? checkChildSelect(dd.dataList) : false;
                        return html ` <li class="btn-group d-flex flex-column" style="margin-top:1px;margin-bottom:1px;">
                                <div
                                    class="editor_item d-flex px-2 my-0 hi me-n1  ${dd.toggle || childSelect || obj.isOptionSelected(dd) ? `active` : ``}"
                                    style=""
                                    onclick="${gvc.event(() => {
                            if (dd.type === 'container') {
                                dd.toggle = !dd.toggle;
                            }
                            obj.onOptionSelected(dd);
                            gvc.notifyDataChange(parId);
                        })}"
                                >
                                    ${dd.type === 'container'
                            ? html ` <div
                                              class="subBt ps-0 ms-n2"
                                              onclick="${gvc.event((e, event) => {
                                dd.toggle = !dd.toggle;
                                gvc.notifyDataChange(parId);
                                event.stopPropagation();
                                event.preventDefault();
                            })}"
                                          >
                                              ${dd.toggle ? html `<i class="fa-regular fa-angle-down hoverBtn "></i>` : html ` <i class="fa-regular fa-angle-right hoverBtn "></i> `}
                                          </div>`
                            : ``}
                                    ${dd.label}
                                    <div class="flex-fill"></div>
                                </div>
                                ${(() => {
                            if (dd.type !== 'container' || dd.dataList.length === 0) {
                                return '';
                            }
                            else {
                                return html ` <div class="${dd.toggle || (dd.toggle === undefined && checkChildSelect(dd.dataList)) ? `` : `d-none`}" style="padding-left:5px;">
                                            ${this.folderLineItems({
                                    gvc: obj.gvc,
                                    viewArray: dd.dataList.map((dd, index) => {
                                        dd.index = index;
                                        return dd;
                                    }),
                                    originalArray: dd.dataList,
                                    isOptionSelected: obj.isOptionSelected,
                                    onOptionSelected: obj.onOptionSelected,
                                })}
                                        </div>`;
                            }
                        })()}
                            </li>`;
                    })
                        .join('');
                },
                divCreate: {
                    class: `d-flex flex-column position-relative border-bottom position-relative ps-0 m-0`,
                    elem: 'ul',
                    option: [{ key: 'id', value: parId }],
                },
                onCreate: () => {
                    const interval = setInterval(() => {
                        if (window.Sortable) {
                            try {
                                gvc.addStyle(`
                                    ul {
                                        list-style: none;
                                        padding: 0;
                                    }
                                `);
                                function swapArr(arr, index1, index2) {
                                    const data = arr[index1];
                                    arr.splice(index1, 1);
                                    arr.splice(index2, 0, data);
                                }
                                let startIndex = 0;
                                Sortable.create(document.getElementById(parId), {
                                    group: gvc.glitter.getUUID(),
                                    animation: 100,
                                    onChange: function (evt) {
                                    },
                                    onEnd: (evt) => {
                                        swapArr(obj.originalArray, startIndex, evt.newIndex);
                                    },
                                    onStart: function (evt) {
                                        startIndex = evt.oldIndex;
                                    },
                                });
                            }
                            catch (e) { }
                            clearInterval(interval);
                        }
                    }, 100);
                },
            };
        });
    }
    static arrayItem(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const viewId = glitter.getUUID();
        function render(array, child, original) {
            const parId = obj.gvc.glitter.getUUID();
            return (gvc.bindView(() => {
                obj.gvc.addMtScript([
                    {
                        src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                    },
                ], () => { }, () => { });
                if (obj.hoverGray) {
                    gvc.addStyle(`
                            #${parId} :hover{
                                background-color:#F7F7F7;
                            }
                            #${parId} :hover .option{
                                background-color:#DDD;
                            }
                            #${parId} :hover .pen{
                                display:block;
                            }
                            
                        `);
                }
                return {
                    bind: parId,
                    view: () => {
                        return array
                            .map((dd, index) => {
                            let toggle = gvc.event((e, event) => {
                                dd.toggle = !dd.toggle;
                                gvc.notifyDataChange(parId);
                                event.preventDefault();
                                event.stopPropagation();
                            });
                            return html `
                                        <li class="btn-group" style="margin-top:1px;margin-bottom:1px;${obj.hr ? `border-bottom: 1px solid #f6f6f6; ` : ``};">
                                            <div
                                                class="h-auto  align-items-center px-2 my-0 hi me-n1 ${dd.isSelect ? `bgf6 border` : ``}"
                                                style="cursor: pointer;min-height:36px;width: calc(100% - 10px);display: flex;font-size: 14px;line-height: 20px;font-weight: 500;text-rendering: optimizelegibility;user-select: none;margin: 5px 10px;"
                                                onclick="${gvc.event(() => {
                                if (!dd.innerHtml) {
                                    return;
                                }
                                if (obj.customEditor) {
                                    dd.innerHtml(gvc);
                                }
                                else if (original[index]) {
                                    const originalData = JSON.parse(JSON.stringify(original[index]));
                                    gvc.glitter.innerDialog((gvc) => {
                                        return html ` <div
                                                                class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show"
                                                                style="z-index:999999;${dd.width ? `width:${dd.width + ';'}` : ``}"
                                                                onclick="${gvc.event((e, event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        })}"
                                                            >
                                                                <div class="d-flex align-items-center px-2 border-bottom" style="height:50px;min-width:400px;">
                                                                    <h3 style="font-size:15px;font-weight:500;" class="m-0">${dd.editTitle ? dd.editTitle : `編輯項目「${dd.title}」`}</h3>
                                                                    <div class="flex-fill"></div>
                                                                    <div
                                                                        class="hoverBtn p-2"
                                                                        data-bs-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        style="color:black;font-size:20px;"
                                                                        onclick="${gvc.event((e, event) => {
                                            original[index] = originalData;
                                            gvc.closeDialog();
                                            obj.refreshComponent();
                                        })}"
                                                                    >
                                                                        <i class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                    </div>
                                                                </div>
                                                                <div class="px-2" style="max-height:calc(100vh - 150px);overflow-y:auto;">${dd.innerHtml(gvc)}</div>
                                                                <div class="d-flex w-100 p-2 border-top ${dd.saveAble === false ? `d-none` : ``}">
                                                                    <div class="flex-fill"></div>
                                                                    <div
                                                                        class="btn btn-secondary"
                                                                        style="height:40px;width:80px;"
                                                                        onclick="${gvc.event(() => {
                                            original[index] = originalData;
                                            gvc.closeDialog();
                                            obj.refreshComponent();
                                        })}"
                                                                    >
                                                                        取消
                                                                    </div>
                                                                    <div
                                                                        class="btn btn-primary-c ms-2"
                                                                        style="height:40px;width:80px;"
                                                                        onclick="${gvc.event(() => {
                                            gvc.closeDialog();
                                            (dd.saveEvent && dd.saveEvent()) || obj.refreshComponent();
                                        })}"
                                                                    >
                                                                        <i class="fa-solid fa-floppy-disk me-2"></i>儲存
                                                                    </div>
                                                                </div>
                                                            </div>`;
                                    }, glitter.getUUID());
                                }
                            })}"
                                            >
                                                <div
                                                    class="subBt ms-n2 ${obj.minus === false ? `d-none` : ``}"
                                                    onclick="${gvc.event((e, event) => {
                                if (obj.minusEvent) {
                                    obj.minusEvent(obj.originalArray, index);
                                }
                                else {
                                    obj.originalArray.splice(index, 1);
                                    obj.refreshComponent();
                                }
                                gvc.notifyDataChange(viewId);
                                event.stopPropagation();
                            })}"
                                                >
                                                    <i class="fa-regular fa-circle-minus d-flex align-items-center justify-content-center subBt " style="width:15px;height:15px;color:red;"></i>
                                                </div>
                                                <div class="subBt ${obj.draggable === false ? `d-none` : ``} ${obj.position ? `` : `d-none`}">
                                                    <i
                                                        class="dragItem fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                                        style="width:15px;height:15px;padding-right: 14px;"
                                                    ></i>
                                                </div>
                                                ${dd.title}
                                                <div class="flex-fill"></div>
                                                ${(() => {
                                let interval = undefined;
                                if (obj.copyable === false) {
                                    return ``;
                                }
                                function addIt(ind, event) {
                                    const copy = JSON.parse(JSON.stringify(original[index]));
                                    obj.originalArray.splice(index + ind, 0, copy);
                                    event.stopPropagation();
                                    gvc.notifyDataChange(viewId);
                                    obj.refreshComponent();
                                }
                                let toggle = false;
                                return html ` <div
                                                        class="btn-group dropend subBt"
                                                        style="position: relative;"
                                                        onclick="${gvc.event((e, event) => {
                                    toggle = !toggle;
                                    if (toggle) {
                                        $(e).children('.bt').dropdown('show');
                                        $(e).children('.dropdown-menu').css('top', `${0}px`);
                                    }
                                    else {
                                        $(e).children('.bt').dropdown('hide');
                                    }
                                    event.stopPropagation();
                                })}"
                                                    >
                                                        <div type="button" class="bt" style="background:none;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i class="fa-sharp fa-regular fa-scissors"></i>
                                                        </div>
                                                        <div
                                                            class="dropdown-menu mx-1 "
                                                            style="height: 135px;"
                                                            onclick="${gvc.event((e, event) => {
                                    toggle = false;
                                    event.stopPropagation();
                                })}"
                                                        >
                                                            <a
                                                                class="dropdown-item"
                                                                onclick="${gvc.event((e, event) => {
                                    addIt(0, event);
                                })}"
                                                                >向上複製</a
                                                            >
                                                            <hr class="dropdown-divider" />
                                                            <a
                                                                class="dropdown-item"
                                                                onclick="${gvc.event((e, event) => {
                                    $(e).parent().parent().children('.bt').dropdown('hide');
                                    navigator.clipboard.writeText(JSON.stringify(original[index]));
                                })}"
                                                                >複製到剪貼簿</a
                                                            >
                                                            <hr class="dropdown-divider" />
                                                            <a
                                                                class="dropdown-item"
                                                                onclick="${gvc.event((e, event) => {
                                    $(e).parent().parent().children('.bt').dropdown('hide');
                                    addIt(1, event);
                                })}"
                                                                >向下複製</a
                                                            >
                                                        </div>
                                                    </div>`;
                            })()}
                                                <div class="dragItem subBt ${obj.draggable === false ? `d-none` : ``} ${obj.position ? `d-none` : ``}">
                                                    <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  " style="width:15px;height:15px;"></i>
                                                </div>
                                            </div>
                                        </li>
                                    `;
                        })
                            .join('');
                    },
                    divCreate: {
                        class: `d-flex flex-column ${child ? `` : ``} m-0 p-0 position-relative`,
                        elem: 'ul',
                        option: [{ key: 'id', value: parId }],
                    },
                    onCreate: () => {
                        if (obj.draggable !== false) {
                            const interval = setInterval(() => {
                                if (window.Sortable) {
                                    try {
                                        obj.gvc.addStyle(`
                                                ul {
                                                    list-style: none;
                                                    padding: 0;
                                                }
                                            `);
                                        function swapArr(arr, index1, index2) {
                                            const data = arr[index1];
                                            arr.splice(index1, 1);
                                            arr.splice(index2, 0, data);
                                        }
                                        let startIndex = 0;
                                        Sortable.create(document.getElementById(parId), {
                                            group: obj.gvc.glitter.getUUID(),
                                            animation: 100,
                                            handle: '.dragItem',
                                            onChange: function (evt) { },
                                            onStart: function (evt) {
                                                startIndex = evt.oldIndex;
                                            },
                                            onEnd: (evt) => {
                                                console.log(evt.newIndex);
                                                swapArr(obj.originalArray, startIndex, evt.newIndex);
                                                obj.refreshComponent();
                                            },
                                        });
                                    }
                                    catch (e) { }
                                    clearInterval(interval);
                                }
                            }, 100);
                        }
                    },
                };
            }) +
                (obj.plus
                    ? html ` <div class="btn-group mt-2 ps-1 pe-2 w-100 border-bottom pb-2 align-items-center">
                          <div class="btn-outline-secondary-c btn ms-2 " style="height:30px;flex:1;" onclick="${obj.plus.event}"><i class="fa-regular fa-circle-plus me-2"></i>${obj.plus.title}</div>
                          ${(() => {
                        if (obj.copyable === false) {
                            return ``;
                        }
                        let interval = undefined;
                        return html ` <div
                                  type="button"
                                  class="bt ms-1"
                                  style="background:none;"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  data-placement="right"
                                  aria-expanded="false"
                                  onclick="${gvc.event(() => {
                            function readClipboardContent() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    try {
                                        const clipboardText = yield navigator.clipboard.readText();
                                        try {
                                            const data = JSON.parse(clipboardText);
                                            if (Array.isArray(data)) {
                                                data.map((dd) => {
                                                    obj.originalArray.push(dd);
                                                });
                                            }
                                            else {
                                                obj.originalArray.push(data);
                                            }
                                            gvc.notifyDataChange(viewId);
                                            obj.refreshComponent();
                                        }
                                        catch (e) {
                                            alert('請貼上JSON格式');
                                        }
                                    }
                                    catch (error) {
                                        console.error('無法取得剪貼簿內容:', error);
                                    }
                                });
                            }
                            readClipboardContent();
                        })}"
                              >
                                  <i class="fa-regular fa-paste"></i>
                              </div>`;
                    })()}
                      </div>`
                    : ``));
        }
        return ((obj.title
            ? html ` <div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom  py-2 border-top bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">
                      ${obj.title}
                      <div class="flex-fill"></div>
                      ${obj.copyable !== false
                ? html `
                                <div
                                    class="d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                    style="height:30px;width:30px;border-radius:6px;cursor:pointer;color:#151515;"
                                    onclick="${gvc.event(() => {
                    navigator.clipboard.writeText(JSON.stringify(obj.originalArray));
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.successMessage({ text: '已複製至剪貼簿!' });
                })}"
                                >
                                    <i class="fa-sharp fa-regular fa-scissors" aria-hidden="true"></i>
                                </div>
                            `
                : ``}
                  </div>`
            : ``) +
            gvc.bindView(() => {
                return {
                    bind: viewId,
                    view: () => {
                        return render(obj.array().map((dd, index) => {
                            dd.index = index;
                            return dd;
                        }), false, obj.originalArray);
                    },
                };
            }));
    }
    static buttonPrimary(title, event) {
        return html ` <button type="button" class="btn btn-primary-c  w-100" onclick="${event}">${title}</button>`;
    }
    static buttonNormal(title, event) {
        return html ` <button type="button" class="btn w-100" style="background:white;width:calc(100%);border-radius:8px;min-height:45px;border:1px solid black;color:#151515;" onclick="${event}">
            ${title}
        </button>`;
    }
    static openEditorDialog(gvc, inner, close, width, title, tag) {
        return gvc.glitter.innerDialog((gvc) => {
            return html ` <div
                class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show "
                style="z-index:999999;max-height: calc(100vh - 20px);"
                onclick="${gvc.event((e, event) => {
                event.preventDefault();
                event.stopPropagation();
            })}"
            >
                <div
                    class="d-flex align-items-center px-2 border-bottom"
                    style="height:50px;width: ${width ||
                gvc.glitter.ut.frSize({
                    1400: 1200,
                    1600: 1400,
                    1900: 1600,
                }, '1200')}px;"
                >
                    <h3 style="font-size:15px;font-weight:500;" class="m-0">${title !== null && title !== void 0 ? title : `代碼編輯`}</h3>
                    <div class="flex-fill"></div>
                    <div
                        class="hoverBtn p-2"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style="color:black;font-size:20px;"
                        onclick="${gvc.event((e, event) => __awaiter(this, void 0, void 0, function* () {
                let wait_promise = close();
                if (wait_promise && wait_promise.then) {
                    wait_promise = yield wait_promise;
                }
                if (wait_promise !== false) {
                    gvc.closeDialog();
                }
            }))}"
                    >
                        <i class="fa-sharp fa-regular fa-circle-xmark"></i>
                    </div>
                </div>
                <div
                    class=""
                    style="max-height:calc(100vh - 150px);overflow-y:auto;width: ${width ||
                gvc.glitter.ut.frSize({
                    1400: 1200,
                    1600: 1400,
                    1900: 1600,
                }, '1200')}px;"
                >
                    ${inner(gvc)}
                </div>
            </div>`;
        }, tag !== null && tag !== void 0 ? tag : gvc.glitter.getUUID());
    }
    static btnGroup(obj) {
        var _a, _b;
        const gvc = obj.gvc;
        let interval = undefined;
        return html ` <div class="position-relative btn-group dropend subBt my-auto ms-1 ${(_a = obj.classS) !== null && _a !== void 0 ? _a : ''}" style="${(_b = obj.style) !== null && _b !== void 0 ? _b : ''}">
            <div
                type="button"
                class="bt"
                style="background:none;"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                data-placement="left"
                aria-expanded="false"
                onclick="${gvc.event((e, event) => {
            setTimeout(() => {
                obj.top && $(e).parent().children('.dropdown-menu').css('top', `${obj.top}px`);
            }, 100);
            event.stopPropagation();
            event.preventDefault();
        })}"
            >
                ${obj.fontawesome}
            </div>
            <div
                class="dropdown-menu mx-1"
                data-placement="right"
                onmouseover="${obj.gvc.event((e, event) => {
            clearInterval(interval);
        })}"
                onmouseout="${obj.gvc.event((e, event) => {
            $(e).children('.bt').dropdown('hide');
        })}"
                style="min-height: 150px;${obj.dropDownStyle}"
            >
                <div class="px-2">${obj.inner}</div>
            </div>
        </div>`;
    }
}
EditorElem.codeEventListener = () => { };
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}
export class Element {
    constructor() { }
}
const interval = setInterval(() => {
    if (window.glitter) {
        clearInterval(interval);
        window.glitter.setModule(import.meta.url, EditorElem);
    }
}, 100);
