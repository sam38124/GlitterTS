import { ShareDialog } from "../dialog/ShareDialog.js";
const html = String.raw;
export class Editor {
    static uploadImage(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2 ${(obj.title) ? `` : `d-none`}">${obj.title}</h3>
             ${obj.gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return `<input
                    class="flex-fill form-control "
                    placeholder="請輸入圖片連結"
                    value="${obj.def}"
                    onchange="${obj.gvc.event((e) => {
                        obj.callback(e.value);
                        obj.def = e.value;
                        obj.gvc.notifyDataChange(id);
                    })}"
                    ${obj.readonly ? `readonly` : ``}
                />
                <div class="ms-1" style="width: 1px;height: 25px;background-color: white;"></div>
                <i class="fa-sharp fa-solid fa-eye text-dark ms-2" onclick="${obj.gvc.event(() => {
                        glitter.openDiaLog(new URL('./dialog/image-preview.js', import.meta.url), 'preview', obj.def);
                    })}"></i>
                <i
                    class="fa-regular fa-upload text-dark ms-2"
                    style="cursor: pointer;${obj.readonly ? `display:none;` : ``}"
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
                                    $.ajax({
                                        url: data1.url,
                                        type: 'put',
                                        data: file,
                                        processData: false,
                                        crossDomain: true,
                                        headers: {
                                            'Content-Type': data1.type,
                                        },
                                        success: () => {
                                            dialog.dataLoading({ visible: false });
                                            obj.callback(data1.fullUrl);
                                            obj.def = data1.fullUrl;
                                            obj.gvc.notifyDataChange(id);
                                        },
                                        error: () => {
                                            dialog.dataLoading({ visible: false });
                                            dialog.errorMessage({ text: '上傳失敗' });
                                        },
                                    });
                                });
                            },
                        });
                    })}"
                   
                ></i>`;
                },
                divCreate: {
                    class: `d-flex align-items-center mb-3`
                }
            };
        })}`;
    }
    static uploadFile(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
            <div class="d-flex align-items-center mb-3">
                <input
                    class="flex-fill form-control "
                    placeholder="請輸入檔案連結"
                    value="${obj.def}"
                    onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
                />
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                <i
                    class="fa-regular fa-upload  ms-2 text-dark"
                    style="cursor: pointer;"
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
                        $.ajax({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            processData: false,
                            headers: {
                                'Content-Type': data1.type,
                            },
                            crossDomain: true,
                            success: () => {
                                dialog.dataLoading({ visible: false });
                                obj.callback(data1.fullUrl);
                            },
                            error: () => {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: '上傳失敗' });
                            },
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
    }
    static uploadVideo(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${obj.def}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
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
                        $.ajax({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            processData: false,
                            headers: {
                                'Content-Type': data1.type,
                            },
                            crossDomain: true,
                            success: () => {
                                dialog.dataLoading({ visible: false });
                                obj.callback(data1.fullUrl);
                            },
                            error: () => {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: '上傳失敗' });
                            },
                        });
                    });
                },
            });
        })}"></i>
                            </div>`;
    }
    static uploadLottie(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
            <div class="alert alert-primary alert-dismissible fade show" role="alert" style="white-space: normal;word-break: break-word;">
                <a
                    onclick="${obj.gvc.event(() => glitter.openNewTab(`https://lottiefiles.com/`))}"
                    class="fw fw-bold"
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
                    onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
                />
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                <i
                    class="fa-regular fa-upload  text-dark ms-2"
                    style="cursor: pointer;${(obj.color) ? `color:${obj.color};` : ``}"
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
                        $.ajax({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            processData: false,
                            crossDomain: true,
                            headers: {
                                'Content-Type': data1.type,
                            },
                            success: () => {
                                dialog.dataLoading({ visible: false });
                                obj.callback(data1.fullUrl);
                            },
                            error: () => {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: '上傳失敗' });
                            },
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
    }
    static h3(title) {
        return `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2 text-dark">${title}</h3>`;
    }
    static plusBtn(title, event) {
        return html `<div class="w-100 my-3 " style="height: 1px;background:#151515;"></div>
            <div
                class=" fw-bold align-items-center justify-content-center d-flex p-1 rounded mt-3"
                style="border: 1px solid #151515;color:#151515;"
                onclick="${event}"
            >
                ${title}
            </div>`;
    }
    static fontawesome(obj) {
        const glitter = window.glitter;
        return (`
                ${Editor.h3(obj.title)}
                <div
                    class="alert alert-primary alert-dismissible fade show p-2"
                    role="alert"
                    style="white-space: normal;word-break: break-all;"
                >
                    <a
                        onclick="${obj.gvc.event(() => glitter.openNewTab('https://fontawesome.com/search'))}"
                        class="fw-bold fw text-primary"
                        style="cursor: pointer;"
                        >fontawesome</a
                    >
                    與
                    <a
                        onclick="${obj.gvc.event(() => glitter.openNewTab('https://boxicons.com/'))}"
                        class="fw-bold fw text-primary"
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
                callback: (text) => {
                    obj.callback(text);
                },
            }));
    }
    static toggleExpand(obj) {
        var _a;
        const glitter = window.glitter;
        obj.data.expand = (_a = obj.data.expand) !== null && _a !== void 0 ? _a : false;
        return html `${obj.gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (obj.data.expand) {
                        return html `<div class="w-100  ${obj.class}" style="">
                            <div
                                class="d-flex p-0 align-items-center mb-2 w-100 "
                                onclick="${obj.gvc.event(() => {
                            obj.data.expand = !obj.data.expand;
                            obj.gvc.notifyDataChange(id);
                        })}"
                                style="cursor: pointer;"
                            >
                                <h3 style="font-size: 16px;width: calc(100% - 60px);color:#151515 !important;" class="m-0 p-0">
                                    ${obj.title}
                                </h3>
                                <div class="flex-fill"></div>
                                <div style="cursor: pointer;color:#9e9e9e !important;">收合<i class="fa-solid fa-angle-up ms-2"></i></div>
                            </div>
                            ${typeof obj.innerText === 'string' ? obj.innerText : obj.innerText()}
                        </div>`;
                    }
                    return html `<div
                        class="w-100   "
                        style=""
                    >
                        <div
                            class="w-100 d-flex p-0 align-items-center "
                            onclick="${obj.gvc.event(() => {
                        obj.data.expand = !obj.data.expand;
                        obj.gvc.notifyDataChange(id);
                    })}"
                            style="cursor: pointer;"
                        >
                            <h3 style="font-size: 16px;width: calc(100% - 60px);color:#151515 !important;" class="m-0 p-0 ">${obj.title}</h3>
                            <div class="flex-fill"></div>
                            <div style="cursor: pointer;color:#9e9e9e !important;" >展開<i class="fa-solid fa-angle-down ms-2"></i></i></div>
                        </div>
                    </div>`;
                },
                divCreate: {
                    class: `toggleInner  mb-2 p-2`, style: `background:white;width:calc(100%);border-radius:8px;
                    min-height:45px;border:1px solid black;${obj.style};`
                },
            };
        })}`;
    }
    static minusTitle(title, event) {
        return `<div class="d-flex align-items-center">
            <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${event}"></i>
            <h3 style="color: #151515;font-size: 16px;" class="m-0">${title}</h3>
        </div>`;
    }
    static searchInput(obj) {
        const glitter = window.glitter;
        const gvc = obj.gvc;
        const $ = glitter.$;
        return `
            ${(obj.title) ? Editor.h3(obj.title) : ``}
            <div class="btn-group dropdown w-100">
                ${(() => {
            const id = glitter.getUUID();
            const id2 = glitter.getUUID();
            return `
                        ${obj.gvc.bindView(() => {
                return {
                    bind: id2,
                    view: () => {
                        return `<input
                                        class="form-control w-100"
                                        style="height: 40px;"
                                        placeholder="${obj.placeHolder}"
                                        onfocus="${obj.gvc.event(() => {
                            gvc.getBindViewElem(id).addClass(`show`);
                        })}"
                                        onblur="${gvc.event(() => {
                            setTimeout(() => {
                                gvc.getBindViewElem(id).removeClass(`show`);
                            }, 300);
                        })}"
                                        oninput="${gvc.event((e) => {
                            obj.def = e.value;
                            gvc.notifyDataChange(id);
                            gvc.getBindViewElem(id).addClass(`show`);
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
                        return obj.array
                            .filter((d2) => {
                            return d2.toUpperCase().indexOf(obj.def.toUpperCase()) !== -1;
                        })
                            .map((d3) => {
                            return `<button
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
    static returnInnerHtml(obj) {
    }
    static select(obj) {
        return `
            ${Editor.h3(obj.title)}
            <select
                class="form-select"
                onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
            >
                ${obj.array
            .map((dd) => {
            if (typeof dd === 'object') {
                return `<option value="${dd.value}" ${dd.value === obj.def ? `selected` : ``}>
                                ${dd.title}
                            </option>`;
            }
            else {
                return `<option value="${dd}" ${dd === obj.def ? `selected` : ``}>${dd}</option>`;
            }
        })
            .join('')}
            </select>
        `;
    }
    static arrayItem(obj) {
        let dragm = {
            start: 0,
            end: 0,
        };
        return (`<div class="mb-2"></div>` +
            Editor.toggleExpand({
                gvc: obj.gvc,
                title: obj.title,
                data: obj.expand,
                innerText: () => {
                    return obj.array
                        .map((dd, index) => {
                        return Editor.toggleExpand({
                            gvc: obj.gvc,
                            title: `<div    draggable="true"  ondragenter="${obj.gvc.event((e, event) => {
                                dragm.end = index;
                            })}" ondragstart="${obj.gvc.event(() => {
                                dragm.start = index;
                                dragm.end = index;
                            })}"   ondragend="${obj.gvc.event(() => {
                                swapArr(obj.originalArray, dragm.start, dragm.end);
                                obj.refreshComponent();
                            })}">${Editor.minusTitle(dd.title, dd.minus)}</div>`,
                            data: dd.expand,
                            innerText: dd.innerHtml,
                            class: `` + obj.class,
                            style: `;` + obj.style,
                        });
                    })
                        .join('<div class="my-2"></div>') + ((obj.readonly) ? `` : Editor.plusBtn(obj.plus.title, obj.plus.event));
                },
                class: ``,
                style: `background:#d9f1ff;border: 1px solid #151515;color:#151515;`
            }));
    }
}
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}
export class Element {
    constructor() {
    }
}
