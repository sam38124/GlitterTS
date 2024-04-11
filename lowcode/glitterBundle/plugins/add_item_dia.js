var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from "./editor-elem.js";
import { ShareDialog } from "../../dialog/ShareDialog.js";
import { config } from "../../config.js";
import { BaseApi } from "../api/base.js";
import autosize from "./autosize.js";
import { component_group_key } from "./group_key.js";
import { ApiPageConfig } from "../../api/pageConfig.js";
import { Storage } from "../helper/storage.js";
const html = String.raw;
class Add_item_dia {
    static view(gvc) {
        let searchText = '';
        let searchInterval = 0;
        const id = gvc.glitter.getUUID();
        return html `
            <div class="bg-white rounded" style="max-height:90vh;">
                <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                    <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                        新增頁面區段</h3>
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
                        ${Add_item_dia.userMode(gvc, id, searchText)}
                    </div>
                </div>
            </div>
        `;
    }
    static userMode(gvc, id, searchText) {
        const html = String.raw;
        let searchInterval = 0;
        let vm = {
            select: "official"
        };
        vm.select = Storage.select_add_btn;
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
                            },
                            {
                                key: 'template',
                                label: "開發元件",
                                icon: '<i class="fa-sharp fa-regular fa-screwdriver-wrench"></i>'
                            },
                            {
                                key: 'view',
                                label: "客製化插件",
                                icon: '<i class="fa-regular fa-puzzle-piece-simple"></i>'
                            }, {
                                key: 'code',
                                label: "代碼轉換",
                                icon: '<i class="fa-sharp fa-solid fa-repeat"></i>'
                            }, {
                                key: 'ai',
                                label: "AI生成",
                                icon: '<i class="fa-solid fa-microchip-ai"></i>'
                            },
                            {
                                key: 'copy',
                                label: "剪貼簿",
                                icon: '<i class="fa-regular fa-scissors"></i>'
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
                                Storage.select_add_btn = vm.select;
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
                                    switch (vm.select) {
                                        case "official":
                                        case "me":
                                            const data = yield ApiPageConfig.getPage({
                                                page_type: 'module',
                                                me: vm.select === 'me',
                                                favorite: true
                                            });
                                            data.response.result = data.response.result.filter((dd) => {
                                                return dd.name.includes(searchText);
                                            });
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
                                                                查無相關模塊。</h3>
                                                        </div>

                                                    `);
                                            }
                                            else {
                                                resolve(html `
                                                        <div class="row m-0 pt-2"
                                                             style="width:700px;max-height:550px;overflow-y: auto;">
                                                            ${data.response.result.map((dd) => {
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
                                                                                         src="${(_a = dd.preview_image) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1708434247510-未命名設計 (1).jpg'}"></img>
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
                                                                "copy": dd.tag,
                                                                "copyApp": dd.appName,
                                                                page_type: 'module'
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
                                                                                                                               for="username">模塊標籤</label>
                                                                                                                        <input
                                                                                                                                class="  "
                                                                                                                                style="border-color: black;    color: black;    display: block;    width: 100%;    padding: 0.625rem 1rem;    font-size: 0.875rem;    font-weight: 400;    line-height: 1.6;    background-color: #fff;    background-clip: padding-box;    border: 1px solid #d4d7e5;    -webkit-appearance: none;    -moz-appearance: none;    appearance: none;    border-radius: 0.375rem;    box-shadow: inset 0 0 0 transparent;    transition: border-color .15s ease-in-out,background-color .15s ease-in-out,box-shadow .15s ease-in-out;"
                                                                                                                                type="text"
                                                                                                                                placeholder="請輸入模塊標籤"
                                                                                                                                value=""
                                                                                                                                onchange="${gvc.event((e, event) => {
                                                                tdata.tag = e.value;
                                                            })}">
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                ${[gvc.glitter.htmlGenerate.editeInput({
                                                                    gvc: gvc,
                                                                    title: '模塊名稱',
                                                                    default: "",
                                                                    placeHolder: "請輸入模塊名稱",
                                                                    callback: (text) => {
                                                                        tdata.name = text;
                                                                    }
                                                                }), EditorElem.searchInput({
                                                                    title: html `模塊分類
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
                                                                            if (group.indexOf(dd.group) === -1 && dd.page_type === 'module') {
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
                                                                            gvc.glitter.share.addComponent({
                                                                                "id": gvc.glitter.getUUID(),
                                                                                "js": "./official_view_component/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "tag": tdata.tag,
                                                                                    "list": [],
                                                                                    "carryData": {}
                                                                                },
                                                                                "type": "component",
                                                                                "class": "",
                                                                                "index": 0,
                                                                                "label": "標頭區塊",
                                                                                "style": "",
                                                                                "bundle": {},
                                                                                "global": [],
                                                                                "toggle": false,
                                                                                "stylist": [],
                                                                                "dataType": "static",
                                                                                "style_from": "code",
                                                                                "classDataType": "static",
                                                                                "preloadEvenet": {},
                                                                                "share": {}
                                                                            });
                                                                            gvc.glitter.closeDiaLog();
                                                                            gvc.glitter.htmlGenerate.saveEvent(true);
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
                                                                                        <i class="fa-regular fa-circle-plus me-2"></i>新增模塊
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
                                        case "template":
                                            Add_item_dia.add_official_plugin(gvc, searchText).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(`<div class="d-flex">
<div style="width:300px;overflow-y: auto;height:400px;" class="border-end">${data.left}</div>
<div style="height:400px;">${data.right}</div>
</div>`);
                                            });
                                            break;
                                        case "view":
                                            Add_item_dia.add_unit_component(gvc, searchText).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(`<div class="d-flex">
<div style="width:300px;overflow-y: auto;height:400px;" class="border-end">${data.left}</div>
<div style="height:400px;">${data.right}</div>
</div>`);
                                            });
                                            break;
                                        case "ai":
                                            Add_item_dia.add_ai_micro_phone(gvc).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
                                            });
                                            break;
                                        case "code":
                                            Add_item_dia.add_code_component(gvc).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(`<div class="d-flex">
<div style="width:450px;overflow-y: auto;height:720px;" class="border-end">${data.left}</div>
</div>`);
                                            });
                                            break;
                                        case "copy":
                                            Add_item_dia.past_data(gvc).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(`<div class="d-flex">
<div style="width:450px;overflow-y: auto;height:540px;" class="border-end">${data.left}</div>
</div>`);
                                            });
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
    static add_official_plugin(gvc, search) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const glitter = gvc.glitter;
            const docID = gvc.glitter.getUUID();
            const tabID = gvc.glitter.getUUID();
            let viewModel = {
                loading: true,
                pluginList: []
            };
            function getSource(dd) {
                return dd.src.official;
            }
            viewModel.pluginList = [];
            viewModel.pluginList.push({
                "src": {
                    "official": new URL('../../official_view_component/official.js', import.meta.url).href
                },
                "name": "開發元件"
            });
            const data = yield BaseApi.create({
                "url": `https://liondesign.tw/api/v1/app/official/plugin`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": config.token
                }
            });
            ((_a = data.response.data) !== null && _a !== void 0 ? _a : []).map((dd) => {
                if (component_group_key[dd.key]) {
                    viewModel.pluginList.push({
                        "src": {
                            "official": dd.url
                        },
                        "name": component_group_key[dd.key].title
                    });
                }
            });
            function loading() {
                viewModel.loading = false;
                if (viewModel.pluginList.length > 0) {
                    viewModel.pluginList.map((dd) => {
                        dd.toggle = true;
                    });
                }
                glitter.addMtScript(viewModel.pluginList.map((dd) => {
                    return {
                        src: glitter.htmlGenerate.resourceHook(getSource(dd)),
                        type: 'module'
                    };
                }), () => {
                    console.log('notify-tab');
                    gvc.notifyDataChange(tabID);
                }, () => {
                });
            }
            function tryReturn(fun, defaults) {
                try {
                    return fun();
                }
                catch (e) {
                    return defaults;
                }
            }
            loading();
            resolve({
                left: gvc.bindView({
                    bind: tabID,
                    view: () => {
                        try {
                            let hi = false;
                            const it = gvc.map(viewModel.pluginList.map((dd, index) => {
                                try {
                                    const source = getSource(dd);
                                    const obg = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(getSource(dd))];
                                    if (!obg) {
                                        setTimeout(() => {
                                            gvc.notifyDataChange(tabID);
                                        }, 1000);
                                        return ``;
                                    }
                                    const haveItem = Object.keys(obg).filter((d2) => {
                                        return d2 !== 'document';
                                    }).find((dd) => {
                                        return obg[dd].title.indexOf(search) !== -1;
                                    });
                                    if (haveItem || (!search)) {
                                        hi = true;
                                    }
                                    return html `
                                        <div class="border-bottom w-100  ${(search && !haveItem) ? `d-none` : ``}">
                                            <div class="px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                                 style="color:#151515;font-size:16px;gap:0px;cursor: pointer;"
                                                 onclick="${gvc.event(() => {
                                        dd.toggle = !dd.toggle;
                                        gvc.notifyDataChange([tabID, docID]);
                                    })}">
                                                    ．${dd.name}
                                                <div class="flex-fill"></div>
                                                <i class="fa-solid  ${(dd.toggle || search) ? `fa-angle-down` : `fa-angle-right`} d-flex align-items-center justify-content-center me-2"
                                                   style="cursor:pointer;"></i>
                                            </div>
                                            ${(() => {
                                        const id = gvc.glitter.getUUID();
                                        return gvc.bindView({
                                            bind: id,
                                            view: () => {
                                                return gvc.map(Object.keys(obg).filter((d2) => {
                                                    return d2 !== 'document' && d2 !== 'code';
                                                }).map((dd) => {
                                                    if (!viewModel.selectSource) {
                                                        viewModel.selectSource = obg[dd];
                                                        viewModel.addEvent = () => {
                                                            var _a;
                                                            const ob = JSON.parse(JSON.stringify(obg));
                                                            glitter.share.addComponent({
                                                                'id': glitter.getUUID(),
                                                                'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                                                                'style': ob[dd].style,
                                                                'class': ob[dd].class,
                                                                'type': dd,
                                                                'label': tryReturn(() => {
                                                                    return ob[dd].title;
                                                                }, dd),
                                                                'js': source
                                                            });
                                                            glitter.closeDiaLog();
                                                        };
                                                        gvc.notifyDataChange(docID);
                                                    }
                                                    return html `
                                                                <div class="d-flex editor_item ${(viewModel.selectSource === obg[dd]) ? `active` : `text_unselect`}"
                                                                     onclick="${gvc.event(() => {
                                                        viewModel.selectSource = obg[dd];
                                                        viewModel.addEvent = () => {
                                                            var _a;
                                                            const ob = JSON.parse(JSON.stringify(obg));
                                                            glitter.share.addComponent({
                                                                'id': glitter.getUUID(),
                                                                'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                                                                'style': ob[dd].style,
                                                                'class': ob[dd].class,
                                                                'type': dd,
                                                                'label': tryReturn(() => {
                                                                    return ob[dd].title;
                                                                }, dd),
                                                                'js': source
                                                            });
                                                            glitter.closeDiaLog();
                                                        };
                                                        gvc.notifyDataChange([tabID, docID]);
                                                    })}">
                                                                    ${obg[dd].title}
                                                                    <div class="flex-fill"></div>
                                                                    <button class="btn ms-2 btn-primary-c me-2 p-2"
                                                                            style="height: 25px;width: 25px;"
                                                                            onclick="${gvc.event(() => {
                                                        var _a;
                                                        const ob = JSON.parse(JSON.stringify(obg));
                                                        glitter.share.addComponent({
                                                            'id': glitter.getUUID(),
                                                            'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                                                            'style': ob[dd].style,
                                                            'class': ob[dd].class,
                                                            'type': dd,
                                                            'label': tryReturn(() => {
                                                                return ob[dd].title;
                                                            }, dd),
                                                            'js': source
                                                        });
                                                        glitter.closeDiaLog();
                                                    })}">
                                                                        <i class="fa-regular fa-circle-plus"></i>
                                                                    </button>
                                                                </div>`;
                                                }));
                                            },
                                            divCreate: {
                                                class: `${(!dd.toggle && !search) ? `d-none` : ``}`
                                            }
                                        });
                                    })()}
                                        </div>
                                    `;
                                }
                                catch (e) {
                                    return ``;
                                }
                            }));
                            if (hi) {
                                return it;
                            }
                            else {
                                return `<div class="d-flex align-items-center justify-content-center flex-column w-100"
                                                             style="width:700px;">
                                                            <lottie-player style="max-width: 100%;width: 300px;"
                                                                           src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                                           speed="1" loop="true"
                                                                           background="transparent"></lottie-player>
                                                            <h3 class="text-dark fs-6 mt-n3 px-2  "
                                                                style="line-height: 200%;text-align: center;">
                                                                查無相關模塊。</h3>
                                                        </div>`;
                            }
                        }
                        catch (e) {
                            console.log(e);
                            setTimeout(() => {
                                gvc.notifyDataChange(tabID);
                            }, 500);
                            return `<span class="font-14 m-auto p-2 w-100 d-flex align-items-center justify-content-center fw-500">loading...</span>`;
                        }
                    },
                    divCreate: {
                        style: 'overflow-y:auto;height:calc(100vh - 110px);', class: 'border-bottom '
                    }
                }),
                right: gvc.bindView({
                    bind: docID,
                    view: () => {
                        if (!viewModel.selectSource) {
                            return ``;
                        }
                        function isValidHTML(str) {
                            const htmlRegex = /<[a-z][\s\S]*>/i;
                            return htmlRegex.test(str);
                        }
                        return html `
                            <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                 style="color:#151515;font-size:16px;gap:0px;height:44px;">
                                模塊描述
                            </div>
                            <div class="d-flex flex-column w-100" style="height:calc(100% - 48px);">
                                ${(() => {
                            if (isValidHTML(viewModel.selectSource.subContent)) {
                                return viewModel.selectSource.subContent;
                            }
                            else {
                                return html `
                                            <div class="flex-fill"></div>
                                            <div class="alert alert-info p-2"
                                                 style="white-space: normal;word-break:break-all;">
                                                <strong>元件說明:</strong>
                                                ${viewModel.selectSource.subContent}
                                            </div>
                                        `;
                            }
                        })()}
                                <div class="flex-fill"></div>
                                <div class="w-100 d-flex border-top align-items-center mb-n2 pt-2"
                                     style="height:50px;">
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c" style="height: 40px;width: 100px;"
                                            onclick="${gvc.event(() => {
                            viewModel.addEvent();
                        })}">
                                        <i class="fa-light fa-circle-plus me-2"></i>插入模塊
                                    </button>
                                </div>
                            </div>
                        `;
                    },
                    divCreate: () => {
                        if (viewModel.selectSource) {
                            return {
                                class: ` h-100 p-2`, style: `width:450px;`
                            };
                        }
                        else {
                            return {
                                class: `d-none`
                            };
                        }
                    },
                    onCreate: () => {
                    }
                })
            });
        }));
    }
    static add_unit_component(gvc, search) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const glitter = gvc.glitter;
            const docID = gvc.glitter.getUUID();
            const tabID = gvc.glitter.getUUID();
            let viewModel = {
                loading: true,
                pluginList: window.saasConfig.appConfig.pagePlugin
            };
            function tryReturn(fun, defaults) {
                try {
                    return fun();
                }
                catch (e) {
                    return defaults;
                }
            }
            resolve({
                left: gvc.bindView({
                    bind: tabID,
                    view: () => {
                        try {
                            return viewModel.pluginList.map((dd, index) => {
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return new Promise((resolve, reject) => {
                                                glitter.htmlGenerate.loadScript(glitter, [
                                                    {
                                                        src: gvc.glitter.htmlGenerate.resourceHook(dd.src.official),
                                                        callback: (obg) => {
                                                            console.log(`obg-->`, obg);
                                                            const source = dd.src.official;
                                                            resolve(html `
                                                                <div class="w-100 ">
                                                                    <div class="mx-0 d-flex   px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                                                         style="color:black;"
                                                                         onclick="${gvc.event(() => {
                                                                dd.toggle = !dd.toggle;
                                                                gvc.notifyDataChange([tabID, docID]);
                                                            })}">
                                                                            ．${dd.name}
                                                                        <div class="flex-fill"></div>

                                                                        <i class="fa-solid  ${(dd.toggle || search) ? `fa-angle-down` : `fa-angle-right`} d-flex align-items-center justify-content-center me-2"
                                                                           style="cursor:pointer;"></i>
                                                                    </div>
                                                                    ${(() => {
                                                                const id = gvc.glitter.getUUID();
                                                                return gvc.bindView({
                                                                    bind: id,
                                                                    view: () => {
                                                                        if (search) {
                                                                            return gvc.map(Object.keys(obg).filter((d2) => {
                                                                                return d2 !== 'document';
                                                                            }).map((dd) => {
                                                                                if (obg[dd].title.indexOf(search) !== -1) {
                                                                                    return html `
                                                                                                <div class="editor_item text_unselect"
                                                                                                     onclick="${gvc.event(() => {
                                                                                        viewModel.selectSource = obg[dd];
                                                                                        viewModel.addEvent = () => {
                                                                                            var _a;
                                                                                            const ob = JSON.parse(JSON.stringify(obg));
                                                                                            glitter.share.addComponent({
                                                                                                'id': glitter.getUUID(),
                                                                                                'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                                                                                                'style': ob[dd].style,
                                                                                                'class': ob[dd].class,
                                                                                                'type': dd,
                                                                                                'label': tryReturn(() => {
                                                                                                    return ob[dd].title;
                                                                                                }, dd),
                                                                                                'js': source
                                                                                            });
                                                                                            glitter.closeDiaLog();
                                                                                        };
                                                                                        gvc.notifyDataChange([tabID, docID]);
                                                                                    })}">
                                                                                                    ${obg[dd].title}
                                                                                                </div>`;
                                                                                }
                                                                                else {
                                                                                    return html ``;
                                                                                }
                                                                            }));
                                                                        }
                                                                        else {
                                                                            return gvc.map(Object.keys(obg).filter((d2) => {
                                                                                return d2 !== 'document';
                                                                            }).map((dd) => {
                                                                                return html `
                                                                                            <div class="editor_item  ${(viewModel.selectSource === obg[dd]) ? `active` : `text_unselect`}"
                                                                                                 onclick="${gvc.event(() => {
                                                                                    viewModel.selectSource = obg[dd];
                                                                                    viewModel.addEvent = () => {
                                                                                        var _a;
                                                                                        const ob = JSON.parse(JSON.stringify(obg));
                                                                                        glitter.share.addComponent({
                                                                                            'id': glitter.getUUID(),
                                                                                            'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                                                                                            'style': ob[dd].style,
                                                                                            'class': ob[dd].class,
                                                                                            'type': dd,
                                                                                            'label': tryReturn(() => {
                                                                                                return ob[dd].title;
                                                                                            }, dd),
                                                                                            'js': source
                                                                                        });
                                                                                        glitter.closeDiaLog();
                                                                                    };
                                                                                    gvc.notifyDataChange([tabID, docID]);
                                                                                })}">
                                                                                                ${obg[dd].title}
                                                                                                <div class="flex-fill"></div>
                                                                                                <button class="btn ms-2 btn-primary-c me-2 p-2"
                                                                                                        style="height: 25px;width: 25px;"
                                                                                                        onclick="${gvc.event(() => {
                                                                                    var _a;
                                                                                    const ob = JSON.parse(JSON.stringify(obg));
                                                                                    glitter.share.addComponent({
                                                                                        'id': glitter.getUUID(),
                                                                                        'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                                                                                        'style': ob[dd].style,
                                                                                        'class': ob[dd].class,
                                                                                        'type': dd,
                                                                                        'label': tryReturn(() => {
                                                                                            return ob[dd].title;
                                                                                        }, dd),
                                                                                        'js': source
                                                                                    });
                                                                                    glitter.closeDiaLog();
                                                                                })}">
                                                                                                    <i class="fa-regular fa-circle-plus"></i>
                                                                                                </button>
                                                                                            </div>`;
                                                                            }));
                                                                        }
                                                                    },
                                                                    divCreate: {
                                                                        class: ` ${(!dd.toggle && !search) ? `d-none` : ``}`
                                                                    }
                                                                });
                                                            })()}
                                                                </div>
                                                            `);
                                                        }
                                                    }
                                                ]);
                                            });
                                        },
                                        divCreate: {}
                                    };
                                });
                            }).join('') || `<div class="d-flex align-items-center justify-content-center flex-column w-100"
                                                             style="width:700px;">
                                                            <lottie-player style="max-width: 100%;width: 300px;"
                                                                           src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                                           speed="1" loop="true"
                                                                           background="transparent"></lottie-player>
                                                            <h3 class="text-dark fs-6 mt-n3 px-2  "
                                                                style="line-height: 200%;text-align: center;">
                                                                尚未加入任何模塊。</h3>
                                                        </div>`;
                        }
                        catch (e) {
                            console.log(`error-->`, e);
                        }
                    },
                    divCreate: {
                        style: 'overflow-y:auto;height:calc(100vh - 110px);', class: 'border-bottom '
                    }
                }),
                right: gvc.bindView({
                    bind: docID,
                    view: () => {
                        return ``;
                    },
                    divCreate: () => {
                        if (viewModel.selectSource) {
                            return {
                                class: ` h-100 p-2`, style: `width:400px;`
                            };
                        }
                        else {
                            return {
                                class: `d-none`
                            };
                        }
                    },
                    onCreate: () => {
                    }
                })
            });
        }));
    }
    static add_code_component(gvc) {
        return new Promise((resolve, reject) => {
            const glitter = gvc.glitter;
            let code = '';
            let relativePath = '';
            let copyElem = [
                {
                    elem: 'all',
                    title: '全部',
                    check: true
                },
                {
                    elem: 'html',
                    title: 'Html標籤',
                    check: false
                }, {
                    elem: 'style',
                    title: 'Style',
                    check: false
                }, {
                    elem: 'script',
                    title: 'Script',
                    check: false
                }
            ];
            resolve({
                left: gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return `<div class="position-relative bgf6 d-flex align-items-center justify-content-between  p-2 border-bottom shadow">
                    <span class="fs-6 fw-bold " style="color:black;">代碼轉換</span>
                    <button class="btn btn-primary-c "
                            style="height: 28px;width:80px;font-size:14px;"
                            onclick="${gvc.event(() => {
                                const html = document.createElement('body');
                                html.innerHTML = code;
                                saveHTML(traverseHTML(html), relativePath, gvc, copyElem).then(() => {
                                    code = '';
                                    gvc.notifyDataChange(id);
                                });
                            })}">轉換代碼
                    </button>
                </div>
                <div class="px-2 pb-2 overflow-auto" style="height: calc(100vh - 170px)">
                    ${EditorElem.h3('勾選複製項目')}
                    <div class="pb-2 px-2 border-bottom">
                        ${gvc.bindView(() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return copyElem.map((dd) => {
                                            return `<div class="d-flex align-items-center" style="gap:10px;cursor:pointer;" onclick="${gvc.event(() => {
                                                if ((dd.elem === 'all')) {
                                                    copyElem.map((dd) => {
                                                        dd.check = false;
                                                    });
                                                }
                                                copyElem.find((dd) => {
                                                    return dd.elem === 'all';
                                                }).check = false;
                                                if (copyElem.filter((dd) => {
                                                    return dd.check;
                                                }).length > 1) {
                                                    dd.check = !dd.check;
                                                }
                                                else {
                                                    dd.check = true;
                                                }
                                                gvc.notifyDataChange(id);
                                            })}">
  <i class="${(dd.check) ? `fa-solid fa-square-check` : `fa-regular fa-square`}" style="font-size:15px;${(dd.check) ? `color:rgb(41, 94, 209);` : ``}"></i>
  <span class="form-check-label " style="font-size:15px;color:#5e5e5e;font-weight: 400!important;" >${dd.title}</span>
</div>`;
                                        }).join('');
                                    },
                                    divCreate: { class: `d-flex flex-wrap my-1 mt-1`, style: 'gap:10px;cursor:pointer;' }
                                };
                            })}
                    </div>
                    <div class="my-2"></div>
                    ${EditorElem.h3('資源相對路徑')}
                    ${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: ``,
                                default: relativePath,
                                placeHolder: `請輸入資源相對路徑-[為空則以當前網址作為相對路徑]`,
                                callback: (text) => {
                                    relativePath = text;
                                }
                            })}
                    <div class="mt-3 mb-2 border-bottom"></div>
                    ${EditorElem.customCodeEditor({
                                gvc: gvc,
                                title: '複製的代碼內容',
                                height: 550,
                                initial: code,
                                language: 'html',
                                callback: (text) => {
                                    console.log(`change--`, text);
                                    code = text;
                                }
                            })}
                </div>`;
                        }
                    };
                }),
                right: ``
            });
        });
    }
    static add_ai_micro_phone(gvc) {
        return new Promise((resolve, reject) => {
            const textID = gvc.glitter.getUUID();
            const glitter = gvc.glitter;
            let configText = '';
            gvc.addMtScript([
                { src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }
            ], () => {
            }, () => {
            });
            function trigger() {
                const dialog = new ShareDialog(glitter);
                if (!configText) {
                    dialog.errorMessage({ text: "請輸入描述語句" });
                    return;
                }
                dialog.dataLoading({ text: "AI運算中", visible: true });
                BaseApi.create({
                    "url": config.url + `/api/v1/ai/generate-html`,
                    "type": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": config.token
                    },
                    data: JSON.stringify({
                        "search": configText
                    })
                }).then((re) => {
                    dialog.dataLoading({ visible: false });
                    if (re.result) {
                        const html = document.createElement('body');
                        console.log(`responseData:` + re.response.data);
                        html.innerHTML = re.response.data;
                        saveHTML(traverseHTML(html), '', gvc);
                    }
                    else {
                        dialog.errorMessage({ text: "轉換失敗，請輸入其他文案" });
                    }
                });
            }
            resolve({
                left: html `
                    <div class="position-relative bgf6 d-flex align-items-center justify-content-between  p-2 border-bottom shadow">
                        <span class="fs-6 fw-bold " style="color:black;">AI 代碼生成工具</span>
                        <button class="btn btn-primary-c "
                                style="height: 28px;width:80px;font-size:14px;"
                                onclick="${gvc.event(() => {
                    trigger();
                })}">轉換代碼
                        </button>
                    </div>
                    <lottie-player src="lottie/ai.json" class="mx-auto my-n4" speed="1"
                                   style="max-width: 100%;width: 250px;height:300px;" loop autoplay></lottie-player>
                    ${gvc.bindView(() => {
                    return {
                        bind: textID,
                        view: () => {
                            return glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: '',
                                default: configText !== null && configText !== void 0 ? configText : "",
                                placeHolder: `輸入或說出AI生成語句\n譬如:
        -產生一個h1，字體顏色為紅色，大小為30px．
        -產生一個商品內文．
        -使用bootstrap生成一個商品展示頁面．
        `,
                                callback: (text) => {
                                    configText = text;
                                }
                            });
                        },
                        divCreate: { class: `w-100 px-2` }
                    };
                })}
                    ${gvc.bindView(() => {
                    let linsten = false;
                    const id = glitter.getUUID();
                    const recognition = new webkitSpeechRecognition();
                    recognition.lang = 'zh-tw';
                    recognition.continuous = true;
                    recognition.interimResults = false;
                    recognition.onresult = function (event) {
                        configText = Object.keys(event.results).map((dd) => {
                            return event.results[dd][0].transcript;
                        }).join('');
                        gvc.notifyDataChange(textID);
                    };
                    return {
                        bind: id,
                        view: () => {
                            return html `
                                    ${(linsten) ? `
                                  <button class="btn btn-danger flex-fill" style="flex:1;"
                                        onclick="${gvc.event(() => {
                                linsten = false;
                                recognition.stop();
                                gvc.notifyDataChange(id);
                            })}">
                                        <i class="fa-solid fa-stop me-2" style="font-size:20px;"></i>停止
                                </button>
                                ` : `  <button class="btn btn-outline-secondary-c flex-fill" style="flex:1;"
                                        onclick="${gvc.event(() => {
                                linsten = true;
                                recognition.start();
                                gvc.notifyDataChange(id);
                            })}">
                                    <i class="fa-light fa-microphone me-2" style="font-size:20px;"></i>語音輸入
                                </button>`}

                                `;
                        },
                        divCreate: {
                            class: `p-2 w-100 d-flex`, style: `gap:10px;`
                        }
                    };
                })}
                `,
                right: ``
            });
        });
    }
    static past_data(gvc) {
        return new Promise((resolve, reject) => {
            let copyCount = 1;
            const textID = gvc.glitter.getUUID();
            const glitter = gvc.glitter;
            let configText = '';
            gvc.addMtScript([
                { src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }
            ], () => {
            }, () => {
            });
            function trigger() {
                const dialog = new ShareDialog(glitter);
                if (!configText) {
                    dialog.errorMessage({ text: "請貼上模塊內容" });
                    return;
                }
                glitter.share.copycomponent = configText;
                for (let c = 0; c < copyCount; c++) {
                    glitter.share.pastEvent();
                }
                configText = '';
                gvc.notifyDataChange(textID);
                gvc.closeDialog();
            }
            resolve({
                left: `     
      <div class="position-relative bgf6 d-flex align-items-center justify-content-between  p-2 border-bottom shadow">
                    <span class="fs-6 fw-bold " style="color:black;">元件複製</span>
                    <button class="btn btn-primary-c "
                            style="height: 28px;width:80px;font-size:14px;"
                            onclick="${gvc.event(() => {
                    trigger();
                })}">確認複製
                    </button>
                </div>        
 ${gvc.bindView(() => {
                    return {
                        bind: textID,
                        view: () => {
                            const id = gvc.glitter.getUUID();
                            return `<div class="alert alert-info mt-2 p-2 fw-500 mb-0" style="white-space: normal;word-break:break-all;font-size:14px;">
將複製於剪貼簿的元件貼上於下方區塊，確認後來產生元件。
</div>
` + EditorElem.editeInput({
                                gvc: gvc,
                                title: "複製數量",
                                default: `${copyCount}`,
                                placeHolder: "複製數量",
                                callback: (text) => {
                                    copyCount = parseInt(text, 10);
                                },
                                type: 'number'
                            }) + `<div class="my-2"></div>` + gvc.bindView({
                                bind: id,
                                view: () => {
                                    return configText !== null && configText !== void 0 ? configText : "";
                                },
                                divCreate: {
                                    elem: `textArea`,
                                    style: `max-height:300px!important;min-height:300px;`,
                                    class: `form-control`, option: [
                                        { key: 'placeholder', value: "請將剪貼簿的內容貼上。" },
                                        {
                                            key: 'onchange', value: gvc.event((e) => {
                                                configText = e.value;
                                            })
                                        }
                                    ]
                                },
                                onCreate: () => {
                                    autosize(obj.gvc.getBindViewElem(id));
                                }
                            });
                        },
                        divCreate: { class: `w-100 px-2 `, style: `height:530px;` }
                    };
                })}
`,
                right: ``
            });
        });
    }
    static add_content_folder(gvc, tagType, callback) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `<a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            id: gvc.glitter.getUUID(),
                            label: "分類名稱",
                            data: {
                                setting: []
                            },
                            type: 'container'
                        };
                        if (callback) {
                            callback(data);
                        }
                        else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加分類</a>
                    <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            id: gvc.glitter.getUUID(),
                            label: "標籤名稱",
                            data: {
                                value: "",
                                tagType: tagType
                            },
                            type: 'text',
                        };
                        if (callback) {
                            callback(data);
                        }
                        else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加資源</a>
                    <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            const data = JSON.parse((yield navigator.clipboard.readText()));
                            data.id = gvc.glitter.getUUID();
                            if (callback) {
                                callback(data);
                            }
                            else {
                                gvc.glitter.share.addComponent(data);
                            }
                        }));
                    })}">剪貼簿貼上</a>`;
                }
            };
        });
    }
    static add_style(gvc, callback) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `<a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            'id': gvc.glitter.getUUID(),
                            "data": {
                                "attr": [],
                                "elem": "style",
                                "inner": "/***請輸入設計代碼***/",
                                "dataFrom": "static",
                                "atrExpand": {
                                    "expand": true
                                },
                                "elemExpand": {
                                    "expand": true
                                },
                                "innerEvenet": {}
                            },
                            'type': 'widget',
                            'label': 'STYLE代碼',
                            'js': '$style1/official.js'
                        };
                        if (callback) {
                            callback(data);
                        }
                        else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加設計代碼</a>
                    <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            "id": gvc.glitter.getUUID(),
                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                            "css": { "class": {}, "style": {} },
                            "data": {
                                "class": "",
                                "style": "",
                                "attr": [{
                                        "attr": "href",
                                        "type": "par",
                                        "value": "",
                                        "expand": false
                                    }, { "attr": "rel", "type": "par", "value": "stylesheet", "expand": false }],
                                "elem": "link",
                                "inner": "",
                                "dataFrom": "static",
                                "atrExpand": { "expand": true },
                                "elemExpand": { "expand": true },
                                "innerEvenet": {},
                                "setting": [],
                                "note": ""
                            },
                            "type": "widget",
                            "label": "STYLE資源",
                            "styleList": [],
                            "refreshAllParameter": {},
                            "refreshComponentParameter": {}
                        };
                        if (callback) {
                            callback(data);
                        }
                        else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加資源連結</a>`;
                }
            };
        });
    }
    static add_script(gvc, callback) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                        <a class="dropdown-item d-none" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            "id": gvc.glitter.getUUID(),
                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                            "data": {
                                "elem": "script",
                                "inner": "/***請輸入Script代碼***/",
                                "setting": [],
                                "dataFrom": "static",
                                "innerEvenet": {}
                            },
                            "type": "widget",
                            "label": "SCRIPT代碼"
                        };
                        if (callback) {
                            callback(data);
                        }
                        else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加SCRIPT代碼</a>
                        <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            "id": gvc.glitter.getUUID(),
                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                            "data": {
                                "attr": [{
                                        "attr": "src",
                                        "type": "par",
                                        "value": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
                                        "expand": false
                                    }, {
                                        "attr": "crossorigin",
                                        "type": "par",
                                        "value": "anonymous",
                                        "expand": false
                                    }],
                                "elem": "script",
                                "note": "",
                                "setting": [],
                                "dataFrom": "static",
                                "atrExpand": { "expand": true },
                                "elemExpand": { "expand": true }
                            },
                            "type": "widget",
                            "label": "SCRIPT資源",
                            "styleList": []
                        };
                        if (callback) {
                            callback(data);
                        }
                        else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加SCRIPT資源</a>
                        <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            "id": gvc.glitter.getUUID(),
                            "data": { "triggerTime": "first", "clickEvent": {} },
                            "type": "code",
                            "label": "代碼區塊",
                            "js": "$style1/official.js",
                            "index": 2,
                            "css": { "style": {}, "class": {} },
                            "refreshAllParameter": {},
                            "refreshComponentParameter": {}
                        };
                        if (callback) {
                            callback(data);
                        }
                        else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加觸發事件</a>
                    `;
                }
            };
        });
    }
}
function traverseHTML(element) {
    var _a, _b;
    var result = {};
    result.tag = element.tagName;
    var attributes = (_a = element.attributes) !== null && _a !== void 0 ? _a : [];
    if (attributes.length > 0) {
        result.attributes = {};
        for (let i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    if (element.children && element.children.length > 0) {
        result.children = [];
        var childNodes = element.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                result.children.push(traverseHTML(node));
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                const html = document.createElement('span');
                html.innerHTML = node.textContent.trim();
                if (html.innerHTML) {
                    result.children.push(traverseHTML(html));
                }
            }
            else {
                if (node.tagName) {
                    result.children.push(traverseHTML(node));
                }
            }
        }
    }
    result.innerText = ((_b = element.innerText) !== null && _b !== void 0 ? _b : "").replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    return result;
}
function saveHTML(json, relativePath, gvc, elem) {
    return __awaiter(this, void 0, void 0, function* () {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ visible: true, text: "解析資源中" });
        const glitter = gvc.glitter;
        let addSheet = (elem === null || elem === void 0 ? void 0 : elem.find((dd) => {
            return (dd.elem === 'all' && dd.check) || (dd.elem === 'style' && dd.check);
        })) || (elem === undefined);
        let addHtml = (elem === null || elem === void 0 ? void 0 : elem.find((dd) => {
            return (dd.elem === 'all' && dd.check) || (dd.elem === 'html' && dd.check);
        })) || (elem === undefined);
        let addScript = (elem === null || elem === void 0 ? void 0 : elem.find((dd) => {
            return (dd.elem === 'all' && dd.check) || (dd.elem === 'script' && dd.check);
        })) || (elem === undefined);
        const styleSheet = {
            "id": glitter.getUUID(),
            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
            "css": { "class": {}, "style": {} },
            "data": {
                "elem": "glitterStyle",
                "dataFrom": "static",
                "atrExpand": { "expand": false },
                "elemExpand": { "expand": true },
                "innerEvenet": {},
                "setting": []
            },
            "type": "container",
            "label": "所有設計樣式",
        };
        const jsLink = {
            "id": glitter.getUUID(),
            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
            "css": { "class": {}, "style": {} },
            "data": {
                "elem": "glitterJS",
                "dataFrom": "static",
                "atrExpand": { "expand": false },
                "elemExpand": { "expand": true },
                "innerEvenet": {},
                "setting": []
            },
            "type": "container",
            "label": "所有JS資源",
        };
        function covertHtml(json, pushArray) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                for (const dd of (_a = json.children) !== null && _a !== void 0 ? _a : []) {
                    if ((dd.tag.toLowerCase() !== 'title')) {
                        dd.attributes = (_b = dd.attributes) !== null && _b !== void 0 ? _b : {};
                        let originalHref = '';
                        let originalSrc = '';
                        try {
                            originalHref = new URL(dd.attributes.href, relativePath).href;
                        }
                        catch (e) {
                        }
                        try {
                            originalSrc = new URL(dd.attributes.src, relativePath).href;
                        }
                        catch (e) {
                        }
                        const obj = yield convert(dd);
                        if (obj.data.elem !== 'meta' && !(((obj.data.elem === 'link') && (dd.attributes.rel !== 'stylesheet')))) {
                            if (obj.data.elem === 'style' || ((obj.data.elem === 'link') && (dd.attributes.rel === 'stylesheet'))) {
                                if ((obj.data.elem === 'link' && (dd.attributes.rel === 'stylesheet'))) {
                                    obj.data.note = "源代碼路徑:" + originalHref;
                                }
                                if (addSheet) {
                                    styleSheet.data.setting.push(obj);
                                }
                            }
                            else if (obj.data.elem === 'script') {
                                if (addScript) {
                                    obj.data.note = "源代碼路徑:" + originalSrc;
                                    jsLink.data.setting.push(obj);
                                }
                            }
                            else if (obj.data.elem === 'image') {
                                obj.data.note = "源代碼路徑:" + originalSrc;
                            }
                            else {
                                if (addHtml) {
                                    pushArray.push(obj);
                                }
                            }
                        }
                    }
                }
            });
        }
        function convert(obj) {
            var _a, _b, _c, _d, _e, _f, _g;
            return __awaiter(this, void 0, void 0, function* () {
                obj.children = (_a = obj.children) !== null && _a !== void 0 ? _a : [];
                obj.attributes = (_b = obj.attributes) !== null && _b !== void 0 ? _b : {};
                let originalHref = obj.attributes.href;
                let originalSrc = obj.attributes.src;
                obj.innerText = (_c = obj.innerText) !== null && _c !== void 0 ? _c : "";
                const a = yield new Promise((resolve, reject) => {
                    try {
                        if (obj.tag.toLowerCase() === 'link' && obj.attributes.rel === 'stylesheet' && addSheet) {
                            const src = obj.attributes.href;
                            const url = new URL(src, relativePath);
                            originalHref = url.href;
                            getFile(url.href).then((link) => {
                                obj.attributes.href = link;
                                resolve(true);
                            });
                        }
                        else if (obj.tag.toLowerCase() === 'script' && obj.attributes.src && addScript) {
                            const src = obj.attributes.src;
                            const url = new URL(src, relativePath);
                            originalSrc = url;
                            getFile(url.href).then((link) => {
                                obj.attributes.src = link;
                                resolve(true);
                            });
                        }
                        else if (obj.tag.toLowerCase() === 'img' && obj.attributes.src && addHtml) {
                            const src = obj.attributes.src;
                            const url = new URL(src, relativePath);
                            getFile(url.href).then((link) => {
                                obj.attributes.src = link;
                                resolve(true);
                            });
                        }
                        else {
                            resolve(true);
                        }
                    }
                    catch (e) {
                        resolve(true);
                    }
                });
                let setting = [];
                yield covertHtml(obj, setting);
                let x = {
                    "id": glitter.getUUID(),
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": { "class": {}, "style": {} },
                    "data": {
                        "class": (_d = obj.attributes.class) !== null && _d !== void 0 ? _d : "",
                        "style": ((_e = obj.attributes.style) !== null && _e !== void 0 ? _e : ""),
                        "attr": Object.keys(obj.attributes).filter((key) => {
                            return key !== 'class' && key !== 'style' && key !== 'gvc-id' && key !== 'glem';
                        }).map((dd) => {
                            const of = obj.attributes[dd];
                            return {
                                "attr": dd,
                                "type": "par",
                                "value": of,
                                "expand": false,
                            };
                        }),
                        "elem": obj.tag.toLowerCase(),
                        "inner": (_f = obj.innerText) !== null && _f !== void 0 ? _f : "",
                        "dataFrom": "static",
                        "atrExpand": { "expand": true },
                        "elemExpand": { "expand": true },
                        "innerEvenet": {},
                        "setting": setting
                    },
                    "type": (obj.children && obj.children.length > 0) ? "container" : "widget",
                    "label": (() => {
                        var _a;
                        if (obj.tag.toLowerCase() === 'link' && (obj.attributes.rel === 'stylesheet')) {
                            return `style資源`;
                        }
                        const source = ['script', 'style'].indexOf(obj.tag.toLowerCase());
                        if (source >= 0) {
                            return ['script資源', 'style資源'][source];
                        }
                        let lab = (_a = obj.innerText) !== null && _a !== void 0 ? _a : ((obj.type === 'container') ? `HTML容器` : `HTML元件`);
                        lab = lab.trim().replace(/&nbsp;/g, '');
                        if (lab.length > 10) {
                            return lab.substring(0, 10);
                        }
                        else {
                            if (lab.length === 0) {
                                return ((obj.type === 'container') ? `HTML容器` : `HTML元件`);
                            }
                            else {
                                return lab;
                            }
                        }
                    })(),
                    "styleList": []
                };
                if (x.data.style.length > 0) {
                    x.data.style += ";";
                }
                if (x.data.elem === 'img') {
                    x.data.inner = ((_g = x.data.attr.find((dd) => {
                        return dd.attr === 'src';
                    })) !== null && _g !== void 0 ? _g : { value: "" }).value;
                    x.data.attr = x.data.attr.filter((dd) => {
                        return dd.attr !== 'src';
                    });
                }
                if ((x.data.elem === 'html') || (x.data.elem === 'head')) {
                    x.data.elem = 'div';
                }
                return new Promise((resolve, reject) => {
                    resolve(x);
                });
            });
        }
        let waitPush = [];
        yield covertHtml(json, waitPush);
        if (styleSheet.data.setting.length > 0) {
            styleSheet.data.setting.map((dd) => {
                glitter.share.addComponent(dd);
            });
        }
        if (jsLink.data.setting.length > 0) {
            jsLink.data.setting.map((dd) => {
                glitter.share.addComponent(dd);
            });
        }
        waitPush.map((obj) => {
            glitter.share.addComponent(obj);
        });
        setTimeout((() => {
            dialog.dataLoading({ visible: false });
            glitter.closeDiaLog();
        }), 1000);
    });
}
function getFile(href) {
    const glitter = window.glitter;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: config.url + "/api/v1/fileManager/getCrossResource",
            type: 'post',
            data: JSON.stringify({
                "url": href
            }),
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            crossDomain: true,
            processData: false,
            success: (data2) => {
                resolve(data2.url);
            },
            error: (err) => {
                resolve(href);
            }
        });
    });
}
export default Add_item_dia;
