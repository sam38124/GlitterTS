import {ShareDialog} from '../dialog/ShareDialog.js';


export class EditorElem {
    public static uploadImage(obj: { title: string; gvc: any; def: string; callback: (data: string) => void }) {
        const glitter = (window as any).glitter;
        const $ = glitter.$;
        return /*html*/ `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
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
                    class="fa-regular fa-upload  ms-2"
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
                        $.ajax({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            headers: {
                                "Content-Type": data1.type
                            },
                            processData: false,
                            crossDomain: true,
                            success: () => {
                                dialog.dataLoading({visible: false});
                                obj.callback(data1.fullUrl);
                            },
                            error: () => {
                                dialog.dataLoading({visible: false});
                                dialog.errorMessage({text: '上傳失敗'});
                            },
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
    }

    public static uploadFile(obj: { title: string; gvc: any; def: string; callback: (data: string) => void }) {
        const glitter = (window as any).glitter;
        const $ = glitter.$;
        return /*html*/ `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
            <div class="d-flex align-items-center mb-3">
                <input
                    class="flex-fill form-control "
                    placeholder="請輸入檔案連結"
                    value="${obj.def}"
                    onchange="${obj.gvc.event((e: any) => {
            obj.callback(e.value);
        })}"
                />
                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                <i
                    class="fa-regular fa-upload  ms-2"
                    style="cursor: pointer;"
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
                        $.ajax({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            headers: {
                                "Content-Type": data1.type
                            },
                            processData: false,
                            crossDomain: true,
                            success: () => {
                                dialog.dataLoading({visible: false});
                                obj.callback(data1.fullUrl);
                            },
                            error: () => {
                                dialog.dataLoading({visible: false});
                                dialog.errorMessage({text: '上傳失敗'});
                            },
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
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
                        $.ajax({
                            url: data1.url,
                            type: 'put',
                            data: file,
                            processData: false,
                            headers: {
                                "Content-Type": data1.type
                            },
                            crossDomain: true,
                            success: () => {
                                dialog.dataLoading({visible: false});
                                obj.callback(data1.fullUrl);
                            },
                            error: () => {
                                dialog.dataLoading({visible: false});
                                dialog.errorMessage({text: '上傳失敗'});
                            },
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
                        $.ajax({
                            url: data1.url,
                            type: 'put',
                            headers: {
                                "Content-Type": data1.type
                            },
                            data: file,
                            processData: false,
                            crossDomain: true,
                            success: () => {
                                dialog.dataLoading({visible: false});
                                obj.callback(data1.fullUrl);
                            },
                            error: () => {
                                dialog.dataLoading({visible: false});
                                dialog.errorMessage({text: '上傳失敗'});
                            },
                        });
                    });
                },
            });
        })}"
                ></i>
            </div>`;
    }

    public static h3(title: string) {
        return /*html*/ `<h3 style="color: black;font-size: 16px;margin-bottom: 10px;" class="mt-2">${title}</h3>`;
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
                    class="alert alert-dark alert-dismissible fade show p-2"
                    role="alert"
                    style="white-space: normal;word-break: break-all;"
                >
                    <a
                        onclick="${obj.gvc.event(() => glitter.openNewTab('https://fontawesome.com/search'))}"
                        class=" fw text-white"
                        style="cursor: pointer;"
                        >fontawesome</a
                    >
                    與
                    <a
                        onclick="${obj.gvc.event(() => glitter.openNewTab('https://boxicons.com/'))}"
                        class=" fw text-white"
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
                        return /*html*/ `<div class=" w-100  rounded p-2 " style="background: ${color}; ">
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
                    return /*html*/ `<div class="w-100  rounded p-2 " style="background-color: ${color};">
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
        const glitter = (window as any).glitter;
        const gvc = obj.gvc;
        const $ = glitter.$;
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
                            setTimeout(() => {
                                gvc.getBindViewElem(id).removeClass(`show`);
                            }, 300);
                        })}"
                                        oninput="${gvc.event((e: any) => {
                            obj.def = e.value;
                            gvc.notifyDataChange(id);
                            gvc.getBindViewElem(id).addClass(`show`);
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
                        return obj.array
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

    public static select(obj: {
        title: string;
        gvc: any;
        def: string;
        array: string[] | { title: string; value: string }[];
        callback: (text: string) => void;
    }) {
        return /*html*/ `
            ${EditorElem.h3(obj.title)}
            <select
                class="form-select"
                onchange="${obj.gvc.event((e: any) => {
            obj.callback(e.value);
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

    public static arrayItem(obj: {
        gvc: any;
        title: string;
        array: { title: string; innerHtml: string | (() => string); expand: any; minus: string }[];
        originalArray: any,
        expand: any;
        plus: {
            title: string;
            event: string;
        };
        refreshComponent: () => void,
        outside?: boolean,
        plusBtn?: (title: string, event: string) => void
    }) {
        let dragm = {
            start: 0,
            end: 0,
        };
        const innerText = obj.array
            .map((dd, index) => {

                return EditorElem.toggleExpand({
                    gvc: obj.gvc,
                    title: `<div  draggable="true"  ondragenter="${obj.gvc.event((e: any, event: any) => {
                        dragm.end = index;
                    })}" ondragstart="${obj.gvc.event(() => {
                        dragm.start = index;
                        dragm.end = index;
                    })}"   ondragend="${obj.gvc.event(() => {
                        swapArr(obj.originalArray, dragm.start, dragm.end);
                        obj.refreshComponent()
                    })}" >${EditorElem.minusTitle(dd.title, dd.minus)}</div>`,
                    data: dd.expand,
                    innerText: dd.innerHtml,
                    color: `#d9f1ff`,
                });
            })
            .join('<div class="my-3" style="color:#d9f1ff"></div>')
            +
            (obj.plusBtn ? obj.plusBtn!(obj.plus.title, obj.plus.event) : EditorElem.plusBtn(obj.plus.title, obj.plus.event))
        if (obj.expand === undefined) {
            return innerText
        }
        if (obj.outside === false) {
            return innerText;
        }
        return (
            /*html*/`<div class="mb-2"></div>` +
            EditorElem.toggleExpand({
                gvc: obj.gvc,
                title: obj.title,
                data: obj.expand,
                innerText: innerText as string,
                color: `#d9f1ff`,
            })
        );
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