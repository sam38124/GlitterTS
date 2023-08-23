import { ShareDialog } from '../dialog/ShareDialog.js';
import { Swal } from "../../modules/sweetAlert.js";
import autosize from "./autosize.js";
export class EditorElem {
    static uploadImage(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return `${EditorElem.h3(obj.title)}
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
                    class="fa-regular fa-upload  ms-2"
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
    static editeText(obj) {
        var _a;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : "";
        const html = String.raw;
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
                class: `form-control`, option: [
                    { key: 'placeholder', value: obj.placeHolder },
                    { key: 'onchange', value: obj.gvc.event((e) => { obj.callback(e.value); })
                    }
                ]
            },
            onCreate: () => {
                autosize(obj.gvc.getBindViewElem(id));
            }
        })}`;
    }
    static uploadFile(obj) {
        const glitter = window.glitter;
        const $ = glitter.$;
        return `${EditorElem.h3(obj.title)}
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
                                "Content-Type": data1.type
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
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
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
        return `<h3 style="color: black;font-size: 15px;margin-bottom: 10px;" class="fw-500 mt-2">${title}</h3>`;
    }
    static plusBtn(title, event) {
        return `<div class="w-100 my-3" style="background: black;height: 1px;"></div>
            <div
                class="fw-500 text-dark align-items-center justify-content-center d-flex p-1 rounded mt-1 hoverBtn"
                style="border: 1px solid #151515;color:#151515;"
                onclick="${event}"
            >
                ${title}
            </div>`;
    }
    static fontawesome(obj) {
        const glitter = window.glitter;
        return (`
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
                callback: (text) => {
                    obj.callback(text);
                },
            }));
    }
    static toggleExpand(obj) {
        var _a;
        const color = (_a = obj.color) !== null && _a !== void 0 ? _a : `#4144b0;`;
        const glitter = window.glitter;
        return `${obj.gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (obj.data.expand) {
                        return `<div class=" w-100  rounded p-2 " style="background: ${color}; ">
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
                    return `<div class="w-100  rounded p-2 " style="background-color: ${color};">
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
        return `<div class="d-flex align-items-center">
            <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${event}"></i>
            <h3 style="color: black;font-size: 16px;" class="m-0">${title}</h3>
        </div>`;
    }
    static searchInput(obj) {
        const glitter = window.glitter;
        const gvc = obj.gvc;
        const $ = glitter.$;
        return `
            ${(obj.title) ? EditorElem.h3(obj.title) : ``}
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
    static editeInput(obj) {
        var _a, _b, _c;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : "";
        return `${EditorElem.h3(obj.title)}
<input class="form-control mb-2" type="${(_b = obj.type) !== null && _b !== void 0 ? _b : 'text'}" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${(_c = obj.default) !== null && _c !== void 0 ? _c : ''}">`;
    }
    static select(obj) {
        return `
            ${EditorElem.h3(obj.title)}
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
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const viewId = glitter.getUUID();
        const html = String.raw;
        const swal = new Swal(gvc);
        function render(array, child, original) {
            const parId = obj.gvc.glitter.getUUID();
            const dragModel = {
                draggableElement: '',
                dragOffsetY: 0,
                dragStart: 0,
                maxHeight: 0,
                editor_item: [],
                hover_item: [],
                currentIndex: 0,
                changeIndex: 0,
                firstIndex: 0
            };
            const mup_Linstener = function (event) {
                if (dragModel.draggableElement) {
                    dragModel.currentIndex = (dragModel.currentIndex > array.length) ? array.length - 1 : dragModel.currentIndex;
                    $('.select_container').toggleClass('select_container');
                    document.getElementById(dragModel.draggableElement).remove();
                    dragModel.draggableElement = '';
                    function swapArr(arr, index1, index2) {
                        const data = arr[index1];
                        arr.splice(index1, 1);
                        arr.splice(index2, 0, data);
                    }
                    swapArr(original, array[dragModel.firstIndex].index, array[(dragModel.currentIndex > 0) ? dragModel.currentIndex - 1 : 0].index);
                    obj.gvc.notifyDataChange([viewId]);
                }
                document.removeEventListener('mouseup', mup_Linstener);
                document.removeEventListener('mousemove', move_Linstener);
            };
            const move_Linstener = function (event) {
                if (!dragModel.draggableElement) {
                    return;
                }
                let off = event.clientY - dragModel.dragStart + dragModel.dragOffsetY;
                if (off < 5) {
                    off = 5;
                }
                else if (off > dragModel.maxHeight) {
                    off = dragModel.maxHeight;
                }
                function findClosestNumber(ar, target) {
                    if (ar.length === 0)
                        return null;
                    const arr = JSON.parse(JSON.stringify(ar));
                    let index = 0;
                    let closest = arr[0];
                    arr.push(ar[ar.length - 1] + 34);
                    let minDifference = Math.abs(target - closest);
                    for (let i = 1; i < arr.length; i++) {
                        const difference = Math.abs(target - arr[i]);
                        if (difference < minDifference) {
                            closest = arr[i];
                            index = i;
                            minDifference = difference;
                        }
                    }
                    return index;
                }
                let closestNumber = findClosestNumber(dragModel.hover_item.map((dd, index) => {
                    return 34 * index - 17;
                }), off);
                console.log(`offSet:${off}-closestNumber:${closestNumber}-length:${array.length}`);
                console.log(closestNumber);
                dragModel.changeIndex = closestNumber;
                dragModel.currentIndex = closestNumber;
                $('.editor_item.hv').remove();
                if (dragModel.currentIndex == array.length) {
                    $('.select_container').append(`<div class="editor_item active hv"></div>`);
                }
                else if (dragModel.currentIndex == 1) {
                    $('.select_container').prepend(`<div class="editor_item active hv"></div>`);
                }
                else {
                    const parentElement = document.getElementsByClassName("select_container")[0];
                    const referenceElement = dragModel.hover_item[dragModel.currentIndex].elem.get(0);
                    const newElement = document.createElement("div", {});
                    newElement.classList.add("editor_item");
                    newElement.classList.add("active");
                    newElement.classList.add("hv");
                    newElement.textContent = "";
                    parentElement.insertBefore(newElement, referenceElement);
                }
                $(`#${dragModel.draggableElement}`).css("position", "absolute");
                $(`#${dragModel.draggableElement}`).css("right", "0px");
                $(`#${dragModel.draggableElement}`).css("top", off + "px");
            };
            return gvc.bindView(() => {
                return {
                    bind: parId,
                    view: () => {
                        return array.map((dd, index) => {
                            let toggle = gvc.event((e, event) => {
                                dd.toggle = !dd.toggle;
                                gvc.notifyDataChange(parId);
                                event.preventDefault();
                                event.stopPropagation();
                            });
                            return html `
                                <l1 class="btn-group "
                                    style="margin-top:1px;margin-bottom:1px;">
                                    <div class="editor_item d-flex   px-2 my-0 hi me-n1 "
                                         style=""
                                         onclick="${gvc.event(() => {
                                const originalData = JSON.parse(JSON.stringify(original[index]));
                                gvc.glitter.innerDialog((gvc) => {
                                    return html `
                                                     <div class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show"
                                                          style="z-index:999999;${(dd.width) ? `width:${dd.width};` : ``};"
                                                          onclick="${gvc.event((e, event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    })}">
                                                         <div class="d-flex align-items-center px-2 border-bottom"
                                                              style="height:50px;min-width:400px;">
                                                             <h3 style="font-size:15px;font-weight:500;" class="m-0">
                                                                 ${dd.editTitle ? dd.editTitle : `編輯項目「${dd.title}」`}</h3>
                                                             <div class="flex-fill"></div>
                                                             <div class="hoverBtn p-2" data-bs-toggle="dropdown"
                                                                  aria-haspopup="true" aria-expanded="false"
                                                                  style="color:black;font-size:20px;"
                                                                  onclick="${gvc.event((e, event) => {
                                        original[index] = originalData;
                                        gvc.closeDialog();
                                        obj.refreshComponent();
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
                                        original[index] = originalData;
                                        gvc.closeDialog();
                                        obj.refreshComponent();
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

                                                     </div>`;
                                }, glitter.getUUID());
                            })}"
                                    >
                                        <div class="subBt ms-n2 ${(obj.minus === false) ? `d-none` : ``}"
                                             onclick="${gvc.event((e, event) => {
                                obj.originalArray.splice(index, 1);
                                gvc.notifyDataChange(viewId);
                                event.stopPropagation();
                            })}">
                                            <i class="fa-regular fa-circle-minus d-flex align-items-center justify-content-center subBt "
                                               style="width:15px;height:15px;color:red;"
                                            ></i>
                                        </div>

                                        ${dd.title}
                                        <div class="flex-fill"></div>
                                        <div class="subBt ${(obj.copyable === false) ? `d-none` : ``}"
                                             onclick="${gvc.event((e, event) => {
                                obj.originalArray.push(original[index]);
                                swal.toast({
                                    icon: 'success',
                                    title: "複製成功．"
                                });
                                gvc.notifyDataChange(viewId);
                                event.stopPropagation();
                            })}">
                                            <i class="fa-sharp fa-regular fa-scissors d-flex align-items-center justify-content-center subBt"
                                               style="width:15px;height:15px;"
                                            ></i>
                                        </div>
                                        <div class="subBt ${(obj.draggable === false) ? `d-none` : ``}" onmousedown="${gvc.event((e, event) => {
                                dragModel.firstIndex = index;
                                dragModel.currentIndex = index;
                                dragModel.draggableElement = glitter.getUUID();
                                dragModel.dragStart = event.clientY;
                                dragModel.dragOffsetY = $(e).parent().parent().get(0).offsetTop;
                                dragModel.maxHeight = $(e).parent().parent().parent().height();
                                $(e).parent().addClass('d-none');
                                dragModel.hover_item = [];
                                $(e).parent().parent().append(`<div class="editor_item active  hv"></div>`);
                                $(e).parent().parent().parent().addClass('select_container');
                                $('.select_container').children().each(function (index) {
                                    dragModel.hover_item.push({
                                        elem: $(this),
                                        offsetTop: $(this).get(0).offsetTop
                                    });
                                });
                                $(e).parent().parent().parent().append(html `
                                                        <l1 class="btn-group position-absolute  "
                                                            style="width:${$(e).parent().parent().width() - 50}px;right:15px;top:${dragModel.dragOffsetY}px;z-index:99999;border-radius:10px;background:white!important;"
                                                            id="${dragModel.draggableElement}">
                                                            <div class="editor_item d-flex   px-2 my-0"
                                                                 style="background:white!important;">
                                                                ${dd.title}
                                                                <div class="flex-fill"></div>
                                                                <i class="d-none fa-solid fa-pencil d-flex align-items-center justify-content-center subBt"
                                                                   style="width:20px;height:20px;"></i>
                                                                <i class="d-none fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center subBt"
                                                                   style="width:20px;height:20px;"></i>
                                                            </div>
                                                        </l1>`);
                                document.addEventListener("mouseup", mup_Linstener);
                                document.addEventListener("mousemove", move_Linstener);
                            })}">
                                            <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                               style="width:15px;height:15px;"></i>
                                        </div>
                                    </div>
                                </l1>
                            `;
                        }).join('');
                    },
                    divCreate: {
                        class: `d-flex flex-column ${(child) ? `` : ``} position-relative`,
                    }
                };
            }) + ((obj.plus) ? `<l1 class="btn-group mt-1 ps-1 pe-2 w-100 border-bottom pb-2">
                    <div class="btn-outline-secondary-c btn ms-2 " style="height:30px;flex:1;" onclick="${obj.plus.event}"><i class="fa-regular fa-circle-plus me-2"></i>${obj.plus.title}</div>
</l1>` : ``);
        }
        return (obj.title ? `   <div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                             style="color:#151515;font-size:16px;gap:0px;">
                            ${obj.title}
                        </div>` : ``) + gvc.bindView(() => {
            return {
                bind: viewId,
                view: () => {
                    return render(obj.array().map((dd, index) => {
                        dd.index = index;
                        return dd;
                    }), false, obj.originalArray);
                }
            };
        });
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
