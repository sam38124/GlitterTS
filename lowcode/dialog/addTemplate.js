var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { init } from '../glitterBundle/GVController.js';
import { ApiPageConfig } from "../api/pageConfig.js";
import { ShareDialog } from "./ShareDialog.js";
import { config } from "../config.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const html = String.raw;
            const vm = {
                type: 'add', id: gvc.glitter.getUUID(), searchText: '',
                addType: 'page'
            };
            return gvc.bindView(() => {
                return {
                    bind: vm.id,
                    view: () => {
                        if (vm.type === 'add') {
                            return html `
                                <div class="d-flex align-items-center justify-content-center w-100 h-100"
                                     style="background-color: rgba(0,0,0,0.5);">
                                    <div class="bg-white rounded-3">
                                        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative py-3"
                                             style="">
                                            <h3 class="modal-title fs-5">選擇添加項目類型</h3>
                                            <i class="fa-solid fa-xmark text-dark position-absolute "
                                               style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
                                               onclick="${gvc.event(() => {
                                glitter.closeDiaLog();
                            })}"></i>
                                        </div>
                                        <div class="row align-items-center justify-content-center m-2"
                                             style="width:450px;">
                                            ${[{
                                    icon: `fa-sharp fa-regular fa-memo`,
                                    title: "網站頁面",
                                    type: 'page',
                                    desc: '首頁 / Landing page / 登入頁面 / 註冊頁面...等。'
                                }, {
                                    type: 'module',
                                    icon: `fa-regular fa-block`,
                                    title: "嵌入模塊",
                                    desc: 'Header / Footer / 輪播圖 / 廣告區塊...等。'
                                }, {
                                    type: 'article',
                                    icon: `fa-regular fa-file-dashed-line`,
                                    title: "內容模板",
                                    desc: '用來決定頁面的統一外觀樣式。'
                                }, {
                                    type: 'blog',
                                    icon: `fa-solid fa-blog`,
                                    title: "網誌文章",
                                    desc: '關於我們 / 隱私權政策 / 服務條款 / 退款政策...等。'
                                }].map((dd) => {
                                return ` 
 <div class="col-6 mb-1 p-2" >
 <div class="card-body text-center bg-white p-2  d-flex align-items-center justify-content-center flex-column shadow rounded-3 border w-100" style="width:200px;height: 200px;">
 <i class="${dd.icon} mb-2 fs-3" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;" aria-hidden="true"></i>
                                <h3 class=" h5 mb-1  " style="">${dd.title}</h3>
                                <div class="mb-1 w-100 px-2 mb-2" style="font-size:13px;white-space: normal;">${dd.desc}</div>
                                <button class=" btn  btn-primary-c " style="height: 30px;width: 60px;" onclick="${gvc.event(() => {
                                    vm.type = 'select';
                                    vm.addType = dd.type;
                                    gvc.notifyDataChange(vm.id);
                                })}">新增
                                </button>
                               </div>
</div>
 `;
                            }).join('')}
                                        </div>
                                    </div>

                                </div>`;
                        }
                        else if (vm.type === 'select') {
                            return ` <div class="bg-white rounded" style="max-height:90vh;">
                <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                <i class="fa-regular fa-circle-arrow-left ms-3 fs-5 text-black" style="color:black;cursor: pointer;" onclick="${gvc.event(() => {
                                vm.type = 'add';
                                gvc.notifyDataChange(vm.id);
                            })}"></i>
                    <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-2">
                        ${(() => {
                                switch (vm.addType) {
                                    case "page":
                                        return '新增頁面';
                                    case "article":
                                        return '新增內容模板';
                                    case "blog":
                                        return '新增網誌';
                                    case "module":
                                        return '新增模塊';
                                }
                            })()}</h3>
                    <div class="flex-fill"></div>
                    <div class="hoverBtn p-2 me-2" style="color:black;font-size:20px;"
                         onclick="${gvc.event(() => {
                                gvc.closeDialog();
                            })}"
                    ><i class="fa-sharp fa-regular fa-circle-xmark"></i>
                    </div>
                </div>
                <div class="d-flex " style="">
                    <div>
                        ${userMode(gvc, gvc.glitter.getUUID(), vm.searchText, vm.addType)}
                    </div>
                </div>
            </div>`;
                        }
                        else {
                            const tdata = {
                                "appName": config.appName,
                                "tag": "",
                                "group": "",
                                "name": "",
                                "config": [],
                                "page_type": 'page'
                            };
                            return `
            <div  class="w-100 h-100 d-flex flex-column  align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);" >
            <div class="m-auto rounded shadow bg-white" style="max-width: 100%;max-height: 100%;width: 360px;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative py-3" style="">
        <h3 class="modal-title fs-5" >添加頁面</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                                glitter.closeDiaLog();
                            })}"></i>
</div>    
<div class="py-2 px-3">
${gvc.bindView(() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        var _a, _b;
                                        return gvc.map([
                                            EditorElem.select({
                                                gvc: gvc,
                                                title: '類型',
                                                def: (_a = tdata.page_type) !== null && _a !== void 0 ? _a : 'page',
                                                array: [
                                                    {
                                                        title: "網頁",
                                                        value: 'page'
                                                    },
                                                    {
                                                        title: "頁面模塊",
                                                        value: 'module'
                                                    },
                                                    {
                                                        title: "網誌模板",
                                                        value: 'article'
                                                    },
                                                    {
                                                        title: "Blog網誌",
                                                        value: 'blog'
                                                    }
                                                ],
                                                callback: (text) => {
                                                    tdata.page_type = text;
                                                    gvc.notifyDataChange(id);
                                                }
                                            }),
                                            glitter.htmlGenerate.editeInput({
                                                gvc: gvc,
                                                title: '頁面標籤',
                                                default: "",
                                                placeHolder: "請輸入頁面標籤[不得重複]",
                                                callback: (text) => {
                                                    tdata.tag = text;
                                                }
                                            }),
                                            glitter.htmlGenerate.editeInput({
                                                gvc: gvc,
                                                title: '頁面名稱',
                                                default: "",
                                                placeHolder: "請輸入頁面名稱",
                                                callback: (text) => {
                                                    tdata.name = text;
                                                }
                                            }),
                                            EditorElem.searchInput({
                                                title: `頁面分類
<div class="alert alert-info p-2 mt-2" style="word-break: break-all;white-space:normal">
可加入 / 進行分類:<br>例如:頁面/權限相關/註冊頁面
</div>`,
                                                gvc: gvc,
                                                def: "",
                                                array: (() => {
                                                    let group = [];
                                                    gBundle.vm.dataList.map((dd) => {
                                                        if (group.indexOf(dd.group) === -1 && (dd.page_type === tdata.page_type)) {
                                                            group.push(dd.group);
                                                        }
                                                    });
                                                    return group;
                                                })(),
                                                callback: (text) => {
                                                    tdata.group = text;
                                                },
                                                placeHolder: "請輸入頁面分類"
                                            }),
                                            EditorElem.select({
                                                title: "[可選]：複製頁面內容",
                                                gvc: gvc,
                                                def: (_b = tdata.copy) !== null && _b !== void 0 ? _b : "",
                                                array: [
                                                    {
                                                        title: '選擇複製頁面內容', value: ''
                                                    }
                                                ].concat(gBundle.vm.dataList.sort((function (a, b) {
                                                    if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                                        return -1;
                                                    }
                                                    if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                                        return 1;
                                                    }
                                                    return 0;
                                                })).filter((d2) => {
                                                    return d2.page_type === tdata.page_type;
                                                }).map((dd) => {
                                                    return {
                                                        title: `${dd.group}-${dd.name}`, value: dd.tag
                                                    };
                                                })),
                                                callback: (text) => {
                                                    tdata.copy = text;
                                                },
                                            })
                                        ]);
                                    },
                                    divCreate: {}
                                };
                            })}
</div>
<div class="w-100 bg-white my-1" style="height: 1px;"></div>
<div class="d-flex w-100 my-2 align-items-center justify-content-center">
<button class="btn btn-primary " style="width: calc(100% - 20px);" onclick="${gvc.event(() => {
                                const dialog = new ShareDialog(glitter);
                                dialog.dataLoading({ text: "上傳中", visible: true });
                                ApiPageConfig.addPage(tdata).then((it) => {
                                    setTimeout(() => {
                                        dialog.dataLoading({ text: "", visible: false });
                                        if (it.result) {
                                            const li = new URL(location.href);
                                            li.searchParams.set('page', tdata.tag);
                                            location.href = li.href;
                                        }
                                        else {
                                            dialog.errorMessage({
                                                text: "已有此頁面標籤"
                                            });
                                        }
                                    }, 1000);
                                });
                            })}">確認新增</button>
</div>
</div>
</div>
            `;
                        }
                    },
                    divCreate: {
                        class: `vw-100 vh-100 d-flex align-items-center justify-content-center`,
                        style: `background: rgba(0,0,0,0.6);`
                    }
                };
            });
        }
    };
});
function userMode(gvc, id, searchText, type) {
    const html = String.raw;
    let searchInterval = 0;
    let vm = {
        select: "official"
    };
    vm.select = 'official';
    return gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                const contentVM = {
                    loading: true,
                    leftID: gvc.glitter.getUUID(),
                    rightID: gvc.glitter.getUUID(),
                    leftBar: '',
                    rightBar: ''
                };
                return html `
                    <div class="position-absolute d-flex flex-column rounded py-3 px-2 bg-white align-items-center"
                         style="left:-60px;top:-50px;gap:10px;z-index:10;">
                        <i class="fa-solid fa-chevron-down" style="color:black;"></i>
                        ${(() => {
                    const list = [
                        {
                            key: 'official',
                            label: "官方模板庫",
                            icon: '<i class="fa-regular fa-block"></i>'
                        },
                        {
                            key: 'me',
                            label: "我的模板庫",
                            icon: '<i class="fa-regular fa-user"></i>'
                        }
                    ];
                    return list.map((dd) => {
                        return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${(vm.select === dd.key) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : ``}
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                            vm.select = dd.key;
                            gvc.notifyDataChange(id);
                        })}">
                               ${dd.icon}
                            </div>`;
                    }).join('');
                })()}

                    </div>
                    ${(['official', 'me', 'template', 'view'].find((d3) => {
                    return d3 === vm.select;
                })) ? `<div class="add_item_search_bar w-100">
                            <i class="fa-regular fa-magnifying-glass"></i>
                            <input class="w-100" placeholder="搜尋模塊" oninput="${gvc.event((e, event) => {
                    searchText = e.value;
                    clearInterval(searchInterval);
                    searchInterval = setTimeout(() => {
                        gvc.notifyDataChange(id);
                    }, 500);
                })}" value="${searchText}">
                        </div>` : ``}
                    <div class="d-flex border-bottom  d-none">
                        ${[
                    {
                        key: 'official',
                        label: "官方模板庫"
                    },
                    {
                        key: 'me',
                        label: "我的模板庫"
                    }
                ].map((dd) => {
                    return html `
                                <div class="add_item_button ${(dd.key === vm.select) ? `add_item_button_active` : ``}"
                                     onclick="${gvc.event((e, event) => {
                        vm.select = dd.key;
                        gvc.notifyDataChange(id);
                    })}">${dd.label}
                                </div>`;
                }).join('')}
                    </div>
                    ${gvc.bindView(() => {
                    gvc.addStyle(`.hoverHidden div{
                        display:none;
                        }
                        .hoverHidden:hover div{
                        display:flex;
                        }
                        `);
                    return {
                        bind: contentVM.leftID,
                        view: () => {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                let title = (() => {
                                    switch (type) {
                                        case "page":
                                            return '頁面';
                                        case "article":
                                            return '模板';
                                        case "blog":
                                            return '網誌';
                                        case "module":
                                            return '模塊';
                                    }
                                })();
                                switch (vm.select) {
                                    case "official":
                                    case "me":
                                        const data = yield ApiPageConfig.getPage({
                                            page_type: type,
                                            me: vm.select === 'me',
                                            favorite: true
                                        });
                                        data.response.result = [{
                                                name: '空白' + title,
                                                preview_image: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709282671899-BLANK PAGE.jpg',
                                            }].concat(data.response.result.filter((dd) => {
                                            return dd.name.includes(searchText);
                                        }));
                                        if (data.response.result.length === 0) {
                                            resolve(html `
                                                    <div class="d-flex align-items-center justify-content-center flex-column w-100"
                                                         style="width:700px;">
                                                        <lottie-player style="max-width: 100%;width: 300px;"
                                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                                       speed="1" loop="true"
                                                                       background="transparent"></lottie-player>
                                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                                            style="line-height: 200%;text-align: center;">
                                                            查無相關內容。</h3>
                                                    </div>

                                                `);
                                        }
                                        else {
                                            resolve(html `
                                                    <div class="row m-0 pt-2"
                                                         style="width:700px;max-height:550px;overflow-y: auto;">
                                                        ${data.response.result.map((dd, index) => {
                                                var _a;
                                                return html `
                                                                <div class="col-4 mb-3">
                                                                    <div class="d-flex flex-column align-items-center justify-content-center w-100"
                                                                         style="gap:5px;cursor:pointer;">
                                                                        <div class="card w-100 position-relative rounded hoverHidden"
                                                                             style="padding-bottom: 58%;">
                                                                            <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                                                                                 style="overflow: hidden;">
                                                                                <img class="w-100 "
                                                                                     src="${(_a = dd.preview_image) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"></img>
                                                                            </div>

                                                                            <div class="position-absolute w-100 h-100  align-items-center justify-content-center rounded "
                                                                                 style="background: rgba(0,0,0,0.5);">
                                                                                <button class="btn btn-primary-c"
                                                                                        style="height: 35px;width: 90px;"
                                                                                        onclick="${gvc.event(() => {
                                                    gvc.glitter.innerDialog((gvc) => {
                                                        const tdata = {
                                                            "appName": window.appName,
                                                            "tag": "",
                                                            "group": "",
                                                            "name": "",
                                                            "copy": index === 0 ? undefined : dd.tag,
                                                            "copyApp": index === 0 ? undefined : dd.appName,
                                                            page_type: type
                                                        };
                                                        return html `
                                                                                                    <div class="modal-content bg-white rounded-3 p-3  "
                                                                                                         style="max-width:90%;width:400px;;">
                                                                                                        <div class="  "
                                                                                                             style="">
                                                                                                            <div class="ps-1 pe-1  "
                                                                                                                 style="">
                                                                                                                <div class="mb-3  "
                                                                                                                     style="">
                                                                                                                    <label class="form-label mb-3  "
                                                                                                                           style="color: black;"
                                                                                                                           for="username">${title}標籤</label>
                                                                                                                    <input
                                                                                                                            class="  "
                                                                                                                            style="border-color: black;    color: black;    display: block;    width: 100%;    padding: 0.625rem 1rem;    font-size: 0.875rem;    font-weight: 400;    line-height: 1.6;    background-color: #fff;    background-clip: padding-box;    border: 1px solid #d4d7e5;    -webkit-appearance: none;    -moz-appearance: none;    appearance: none;    border-radius: 0.375rem;    box-shadow: inset 0 0 0 transparent;    transition: border-color .15s ease-in-out,background-color .15s ease-in-out,box-shadow .15s ease-in-out;"
                                                                                                                            type="text"
                                                                                                                            placeholder="請輸入${title}標籤"
                                                                                                                            value=""
                                                                                                                            onchange="${gvc.event((e, event) => {
                                                            tdata.tag = e.value;
                                                        })}">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            ${[gvc.glitter.htmlGenerate.editeInput({
                                                                gvc: gvc,
                                                                title: title + '名稱',
                                                                default: "",
                                                                placeHolder: `請輸入${title}名稱`,
                                                                callback: (text) => {
                                                                    tdata.name = text;
                                                                }
                                                            }), EditorElem.searchInput({
                                                                title: html `路徑分類
                                                                                                                <div class="alert alert-info p-2 mt-2"
                                                                                                                     style="word-break: break-all;white-space:normal">
                                                                                                                    可加入
                                                                                                                    /
                                                                                                                    進行分類:<br>例如:首頁／置中版面
                                                                                                                </div>`,
                                                                gvc: gvc,
                                                                def: "",
                                                                array: (() => {
                                                                    let group = [];
                                                                    gvc.glitter.share.editorViewModel.dataList.map((dd) => {
                                                                        if (group.indexOf(dd.group) === -1 && dd.page_type === type) {
                                                                            group.push(dd.group);
                                                                        }
                                                                    });
                                                                    return group;
                                                                })(),
                                                                callback: (text) => {
                                                                    tdata.group = text;
                                                                },
                                                                placeHolder: "請輸入模塊分類"
                                                            })].join('')}
                                                                                                            <div class="d-flex mb-0 pb-0 mt-2"
                                                                                                                 style="justify-content: end;"
                                                                                                            >
                                                                                                                <button class="btn btn-outline-dark me-2  "
                                                                                                                        style=""
                                                                                                                        type="button"
                                                                                                                        onclick="${gvc.event(() => {
                                                            gvc.closeDialog();
                                                        })}">
                                                                                                                    取消
                                                                                                                </button>
                                                                                                                <button class="btn btn-primary-c  "
                                                                                                                        style=""
                                                                                                                        type="button"
                                                                                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.dataLoading({
                                                                text: "上傳中",
                                                                visible: true
                                                            });
                                                            ApiPageConfig.addPage(tdata).then((it) => {
                                                                setTimeout(() => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    if (it.result) {
                                                                        const li = new URL(location.href);
                                                                        li.searchParams.set('page', tdata.tag);
                                                                        location.href = li.href;
                                                                    }
                                                                    else {
                                                                        dialog.errorMessage({
                                                                            text: "已有此頁面標籤"
                                                                        });
                                                                    }
                                                                }, 1000);
                                                            });
                                                        })}">
                                                                                                                    確認添加
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>`;
                                                    }, '');
                                                })}"
                                                                                >
                                                                                    <i class="fa-regular fa-circle-plus me-2"></i>新增${title}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <h3 class="fs-6 mb-0">${dd.name}</h3>
                                                                    </div>
                                                                </div>
                                                            `;
                                            }).join('')}
                                                    </div>`);
                                        }
                                        break;
                                }
                            }));
                        },
                        divCreate: {
                            class: ``,
                            style: `overflow-y:auto;min-height:280px;`
                        }
                    };
                })}
                `;
            },
            divCreate: {
                class: `position-relative`,
                style: 'max-width:100%;'
            },
            onCreate: () => {
                $('.tooltip').remove();
                $('[data-bs-toggle="tooltip"]').tooltip();
            }
        };
    });
}
