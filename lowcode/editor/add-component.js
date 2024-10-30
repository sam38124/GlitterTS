var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Storage } from '../glitterBundle/helper/storage.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import Add_item_dia from '../glitterBundle/plugins/add_item_dia.js';
import { PageEditor } from './page-editor.js';
import { BaseApi } from '../glitterBundle/api/base.js';
import { EditorConfig } from '../editor-config.js';
import { SearchIdea } from './search-idea.js';
import { BasicComponent } from './basic-component.js';
import { BgWidget } from "../backend-manager/bg-widget.js";
import { AiChat } from "../glitter-base/route/ai-chat.js";
export class AddComponent {
    static view(gvc) {
        return gvc.bindView(() => {
            const contentVM = {
                loading: true,
                leftID: gvc.glitter.getUUID(),
                rightID: gvc.glitter.getUUID(),
                leftBar: '',
                rightBar: '',
            };
            let vm = {
                select: 'official',
            };
            vm.select = Storage.select_add_btn;
            let searchText = '';
            const id = gvc.glitter.getUUID();
            AddComponent.refresh = () => {
                gvc.notifyDataChange(id);
            };
            const html = String.raw;
            return {
                bind: id,
                view: () => {
                    if (Storage.select_function === 'user-editor') {
                        Storage.select_add_btn = 'official';
                        vm.select = 'official';
                    }
                    return html `
                        <div class="w-100 d-flex align-items-center p-3 border-bottom">
                            <h5 class="offcanvas-title" style=""> 新增區塊</h5>
                            <div class="flex-fill"></div>
                            <div
                                    class="fs-5 text-black"
                                    style="cursor: pointer;"
                                    onclick="${gvc.event(() => {
                        AddComponent.toggle(false);
                    })}"
                            >
                                <i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i>
                            </div>
                        </div>
                        <div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom ${Storage.select_function === 'user-editor' ? `d-none` : ``}">
                            ${(() => {
                        const list = [
                            {
                                key: 'official',
                                label: '模板庫',
                                icon: '<i class="fa-regular fa-block"></i>',
                            },
                            {
                                key: 'me',
                                label: '我的模塊',
                                icon: '<i class="fa-regular fa-toolbox"></i>',
                            },
                            {
                                key: 'template',
                                label: '基礎開發元件',
                                icon: '<i class="fa-sharp fa-regular fa-screwdriver-wrench"></i>',
                            },
                            {
                                key: 'view',
                                label: '客製化插件',
                                icon: '<i class="fa-regular fa-puzzle-piece-simple"></i>',
                            },
                            {
                                key: 'code',
                                label: '代碼轉換',
                                icon: '<i class="fa-sharp fa-solid fa-repeat"></i>',
                            },
                            {
                                key: 'ai',
                                label: 'AI生成',
                                icon: '<i class="fa-solid fa-microchip-ai"></i>',
                            },
                            {
                                key: 'copy',
                                label: '剪貼簿',
                                icon: '<i class="fa-regular fa-scissors"></i>',
                            },
                        ];
                        return list
                            .map((dd) => {
                            return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${vm.select === dd.key
                                ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;`
                                : ``}
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                                vm.select = dd.key;
                                Storage.select_add_btn = vm.select;
                                gvc.notifyDataChange(id);
                            })}">
                               ${dd.icon}
                            </div>`;
                        })
                            .join('');
                    })()}
                        </div>
                        <div class="w-100" style="overflow-y: auto;">
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
                                        case 'me':
                                            PageEditor.pageSelctor(gvc, (d3) => {
                                                gvc.glitter.share.addComponent({
                                                    id: gvc.glitter.getUUID(),
                                                    js: './official_view_component/official.js',
                                                    css: {
                                                        class: {},
                                                        style: {},
                                                    },
                                                    data: {
                                                        tag: d3.tag,
                                                        list: [],
                                                        carryData: {},
                                                    },
                                                    type: 'component',
                                                    class: 'w-100',
                                                    index: 0,
                                                    label: d3.name,
                                                    style: '',
                                                    bundle: {},
                                                    global: [],
                                                    toggle: false,
                                                    stylist: [],
                                                    dataType: 'static',
                                                    style_from: 'code',
                                                    classDataType: 'static',
                                                    preloadEvenet: {},
                                                    share: {},
                                                });
                                                gvc.glitter.closeDiaLog();
                                            }, {
                                                filter: (data) => {
                                                    return data.page_type == 'module';
                                                },
                                            }).then((data) => {
                                                resolve(`
                                                         <div class="position-relative bgf6 d-flex align-items-center justify-content-between  p-2 border-bottom shadow">
                    <span class="fs-6 fw-bold " style="color:black;">我的模塊</span>
                </div>
               <div style="max-height: calc(100vh - 160px);overflow-y: auto;"> ${data.left ||
                                                    ` <div class="d-flex align-items-center justify-content-center flex-column w-100"
                                         style="width:700px;">
                                        <lottie-player style="max-width: 100%;width: 300px;"
                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                       speed="1" loop="true"
                                                       background="transparent"></lottie-player>
                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                            style="line-height: 200%;text-align: center;">
                                            尚未加入任何模塊。</h3>
                                    </div>`}</div>
                                                        `);
                                            });
                                            break;
                                        case 'official':
                                            AddComponent.addModuleView(gvc, 'module', (tdata) => {
                                                try {
                                                    console.log(`AddComponent.addEvent=>`, AddComponent.addEvent);
                                                    AddComponent.addEvent(gvc, tdata);
                                                }
                                                catch (e) {
                                                    console.log(e);
                                                }
                                            }, Storage.select_function !== 'user-editor', true).then((res) => {
                                                resolve(res);
                                            });
                                            break;
                                        case 'template':
                                            Add_item_dia.add_official_plugin(gvc, searchText).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
                                            });
                                            break;
                                        case 'view':
                                            Add_item_dia.add_unit_component(gvc, searchText).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
                                            });
                                            break;
                                        case 'ai':
                                            Add_item_dia.add_ai_micro_phone(gvc).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
                                            });
                                            break;
                                        case 'code':
                                            Add_item_dia.add_code_component(gvc).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
                                            });
                                            break;
                                        case 'copy':
                                            Add_item_dia.past_data(gvc).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
                                            });
                                    }
                                }));
                            },
                            divCreate: {
                                class: ``,
                                style: `overflow-y:auto;min-height:280px;`,
                            },
                        };
                    })}
                        </div>
                    `;
                },
                divCreate: {},
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                },
            };
        });
    }
    static toggle(visible) {
        if (visible) {
            window.glitter.closeDrawer();
            AddComponent.refresh();
            AddComponent.closeEvent = () => {
            };
            AddComponent.addWidget = (gvc, cf) => {
                gvc.glitter.share.addComponent(cf);
                gvc.glitter.closeDiaLog('dataLoading');
            };
            AddComponent.addEvent = (gvc, tdata) => {
                gvc.glitter.share.addComponent({
                    id: gvc.glitter.getUUID(),
                    js: './official_view_component/official.js',
                    css: {
                        class: {},
                        style: {},
                    },
                    data: {
                        refer_app: tdata.copyApp,
                        tag: tdata.copy,
                        list: [],
                        carryData: {},
                    },
                    type: 'component',
                    class: 'w-100',
                    index: 0,
                    label: tdata.title,
                    style: '',
                    bundle: {},
                    global: [],
                    toggle: false,
                    stylist: [],
                    dataType: 'static',
                    style_from: 'code',
                    classDataType: 'static',
                    preloadEvenet: {},
                    share: {},
                });
                gvc.glitter.closeDiaLog();
            };
            $('#addComponentViewHover').removeClass('d-none');
            $('#addComponentView').removeClass('scroll-out');
            $('#addComponentView').addClass('scroll-in');
        }
        else {
            AddComponent.closeEvent();
            $('#addComponentViewHover').addClass('d-none');
            $('#addComponentView').addClass('scroll-out');
            $('#addComponentView').removeClass('scroll-in');
        }
    }
    static leftNav(gvc) {
        const html = String.raw;
        return html `
            <div
                    class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                    id="addComponentViewHover"
                    style="z-index: 99999;background: rgba(0,0,0,0.5);"
                    onclick="${gvc.event(() => {
            AddComponent.toggle(false);
        })}"
            ></div>
            <div id="addComponentView" class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:${document.body.clientWidth < 768 ? `100vw` : `400px`};z-index: 99999;left: -100%;">
                ${AddComponent.view(gvc)}
            </div>`;
    }
    static addModuleView(gvc, type, callback, withEmpty = false, justGetIframe = false, basic) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerID = gvc.glitter.getUUID();
            const html = String.raw;
            const vm = {
                template_from: 'basic',
                query_tag: [],
                search: '',
            };
            return (gvc.bindView(() => {
                const searchContainer = gvc.glitter.getUUID();
                return {
                    bind: searchContainer,
                    view: () => {
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            resolve(html `
                                <div class="p-2 d-flex ${vm.template_from === 'plus' ? `border-bottom` : ``} ${type === 'form_plugin' ? `d-none` : ``} d-none"
                                     style="gap: 10px;height: 60px;">
                                    <div
                                            class="${vm.template_from === 'all' ? `bt_ffb40` : `bt_ffb40_stroke`}"
                                            style="flex: 1;"
                                            onclick="${gvc.event(() => {
                                vm.template_from = 'all';
                                gvc.notifyDataChange([searchContainer, containerID]);
                            })}"
                                    >
                                        官方模塊
                                    </div>
                                    <div
                                            class="${vm.template_from === 'plus' ? `bt_ffb40` : `bt_ffb40_stroke`}"
                                            style="flex: 1;"
                                            onclick="${gvc.event(() => {
                                vm.template_from = 'plus';
                                gvc.notifyDataChange([searchContainer, containerID]);
                            })}"
                                    >
                                        元件容器
                                    </div>
                                    <div
                                            class="bt_ffb40_stroke"
                                            style="width:50px;"
                                            onclick="${gvc.event(() => {
                                navigator.clipboard.readText().then((clipboardText) => {
                                    try {
                                        const data = JSON.parse(clipboardText);
                                        data.id = gvc.glitter.getUUID();
                                        try {
                                            AddComponent.addWidget(gvc, data);
                                        }
                                        catch (e) {
                                        }
                                    }
                                    catch (e) {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.errorMessage({ text: '請先選擇元件複製!' });
                                    }
                                });
                            })}"
                                    >
                                        <i class="fa-regular fa-paste"></i>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center p-2" style="gap:7px;">
                                    ${(() => {
                                const list = [
                                    {
                                        key: 'basic',
                                        label: '設計元件',
                                    },
                                    {
                                        key: 'ai',
                                        label: `<img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                                             style="width: 25px;height: 25px;" class="me-1">AI 生成`,
                                    },
                                    {
                                        key: 'idea',
                                        label: '找靈感',
                                        event: gvc.event(() => {
                                            AddComponent.toggle(false);
                                            SearchIdea.open(gvc);
                                        }),
                                    },
                                ];
                                return list
                                    .map((dd) => {
                                    if (vm.template_from === dd.key) {
                                        return `<div class="d-flex align-items-center justify-content-center fw-bold px-2 py-2 fw-500" style="
border-radius: 7px;
cursor: pointer;
color: white;
font-size: 16px;
height: 48px;
flex:1;
border: 1px solid #FFB400;
background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);" >${dd.label}</div>`;
                                    }
                                    else {
                                        return `<div class="d-flex align-items-center justify-content-center fw-bold  px-2 py-2 fw-500" style="
border-radius: 7px;
flex:1;
font-size: 16px;
border: 1px solid #FFB400;
cursor: pointer;
height: 48px;
background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;" onclick="${dd.event ||
                                            gvc.event(() => {
                                                vm.template_from = dd.key;
                                                gvc.notifyDataChange([searchContainer, containerID]);
                                            })}">${dd.label}</div>`;
                                    }
                                })
                                    .join('');
                            })()}
                                    <div
                                            class="d-flex align-items-center flex-column justify-content-center fw-bold    fw-500 "
                                            style="
border-radius: 7px;
width: 48px;
height: 48px;
font-size: 16px;
gap:3px;
border: 1px solid #FFB400;
cursor: pointer;
background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;"
                                            onclick="${gvc.event(() => {
                                navigator.clipboard.readText().then((clipboardText) => {
                                    try {
                                        const data = JSON.parse(clipboardText);
                                        data.id = gvc.glitter.getUUID();
                                        try {
                                            AddComponent.addWidget(gvc, data);
                                        }
                                        catch (e) {
                                        }
                                    }
                                    catch (e) {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.errorMessage({ text: '請先選擇元件複製!' });
                                    }
                                });
                            })}"
                                    >
                                        <i class="fa-regular fa-paste fs-6 d-flex align-items-center justify-content-center"
                                           style=""></i>
                                    </div>

                                </div>
                                <div class="p-2 border-bottom  f-flex ${['plus', 'basic', 'ai'].includes(vm.template_from) ? `d-none` : ``}"
                                     style="">
                                    <div class="input-group mb-2">
                                        <input
                                                class="form-control input-sm"
                                                placeholder="輸入關鍵字或標籤名稱"
                                                onchange="${gvc.event((e, event) => {
                                vm.search = e.value;
                                gvc.notifyDataChange(containerID);
                            })}"
                                                value="${vm.search || ''}"
                                        />
                                        <span class="input-group-text" style="cursor: pointer;border-left:none;">
                                            <i class="fa-solid fa-magnifying-glass" style="color:black;"></i>
                                        </span>
                                        <div
                                                class="bt_gray_stroke d-none"
                                                style="width:50px;"
                                                onclick="${gvc.event(() => {
                                navigator.clipboard.readText().then((clipboardText) => {
                                    try {
                                        const data = JSON.parse(clipboardText);
                                        data.id = gvc.glitter.getUUID();
                                        try {
                                            AddComponent.addWidget(gvc, data);
                                        }
                                        catch (e) {
                                        }
                                    }
                                    catch (e) {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.errorMessage({ text: '請先選擇元件複製!' });
                                    }
                                });
                            })}"
                                        >
                                            <i class="fa-regular fa-paste"></i>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }));
                    },
                };
            }) +
                gvc.bindView(() => {
                    return {
                        bind: containerID,
                        view: () => {
                            if (vm.template_from === 'plus') {
                                return AddComponent.plusView(gvc);
                            }
                            else if (vm.template_from === 'basic') {
                                return BasicComponent.main(gvc);
                            }
                            else if (vm.template_from === 'ai') {
                                let message = '';
                                return html `
                                <div class="border-top"></div>
                                <div class="p-2">
                                    ${[
                                    html `
                                            <lottie-player src="lottie/ai.json" class="mx-auto my-n4" speed="1"
                                                           style="max-width: 100%;width: 250px;height:300px;" loop
                                                           autoplay></lottie-player>`,
                                    EditorElem.editeText({
                                        gvc: gvc,
                                        title: '',
                                        default: '',
                                        placeHolder: `幫我新增一個標題，字體大小為20px，顏色為黑色，距離左邊20px
幫我插入Google Map地圖，地址為....
幫我插入Youtube 影片，並自動播放，連結為....
`,
                                        callback: (text) => {
                                            message = text;
                                        },
                                        min_height: 300
                                    }),
                                    `<div class="w-100 d-flex align-items-center justify-content-end">
${BgWidget.save(gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.dataLoading({ visible: true });
                                        AiChat.generateHtml({
                                            app_name: window.appName,
                                            text: message
                                        }).then((res) => {
                                            if (res.result && res.response.data.usage === 0) {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: `很抱歉你的AI代幣不足，請先前往加值` });
                                            }
                                            else if (res.result && (!res.response.data.obj.result)) {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: `AI無法理解你的需求，請給出具體一點的描述` });
                                            }
                                            else if (!res.result) {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: `發生錯誤` });
                                            }
                                            else {
                                                AddComponent.addWidget(gvc, {
                                                    "id": "s7scs2s9s3s5s8sc",
                                                    "js": "./official_view_component/official.js",
                                                    "css": { "class": {}, "style": {} },
                                                    "data": {
                                                        "refer_app": "shop_template_black_style",
                                                        "tag": "custom-code",
                                                        "list": [],
                                                        "carryData": {},
                                                        "_style_refer_global": { "index": "0" },
                                                        "_style_refer": "custom",
                                                        "elem": "div",
                                                        "inner": "",
                                                        "attr": [],
                                                        "_padding": {},
                                                        "_margin": {},
                                                        "_border": {},
                                                        "_max_width": "1200",
                                                        "_gap": "",
                                                        "_background": "",
                                                        "_other": {},
                                                        "_radius": "",
                                                        "_reverse": "false",
                                                        "_hor_position": "center",
                                                        "_background_setting": { "type": "none" },
                                                        "refer_form_data": {
                                                            "code": res.response.data.obj.html,
                                                            "width": { "unit": "px", "value": "0px", "number": "0" },
                                                            "height": {
                                                                "unit": "px",
                                                                "value": "50px",
                                                                "number": "50"
                                                            },
                                                            "with_bg": "false",
                                                            "background": {
                                                                "id": "custom-background",
                                                                "title": "#030303",
                                                                "content": "#000000",
                                                                "sec-title": "#000000",
                                                                "background": "#ffffff",
                                                                "sec-background": "#FFFFFF",
                                                                "solid-button-bg": "#000000",
                                                                "border-button-bg": "#000000",
                                                                "solid-button-text": "#ffffff",
                                                                "border-button-text": "#000000"
                                                            }
                                                        }
                                                    },
                                                    "type": "component",
                                                    "class": "w-100",
                                                    "index": 0,
                                                    "label": "自定義HTML代碼",
                                                    "style": "",
                                                    "bundle": {},
                                                    "global": [],
                                                    "toggle": true,
                                                    "stylist": [],
                                                    "dataType": "static",
                                                    "style_from": "code",
                                                    "classDataType": "static",
                                                    "preloadEvenet": {},
                                                    "share": {},
                                                    "formData": {},
                                                    "refreshAllParameter": {},
                                                    "editor_bridge": {},
                                                    "refreshComponentParameter": {},
                                                    "list": [],
                                                    "version": "v2",
                                                    "storage": {},
                                                    "mobile": {
                                                        "id": "s7scs2s9s3s5s8sc",
                                                        "js": "./official_view_component/official.js",
                                                        "css": { "class": {}, "style": {} },
                                                        "data": { "refer_app": "shop_template_black_style" },
                                                        "type": "component",
                                                        "class": "w-100",
                                                        "index": 0,
                                                        "label": "自定義HTML代碼",
                                                        "style": "",
                                                        "global": [],
                                                        "toggle": true,
                                                        "stylist": [],
                                                        "dataType": "static",
                                                        "style_from": "code",
                                                        "classDataType": "static",
                                                        "preloadEvenet": {},
                                                        "refreshAllParameter": {},
                                                        "editor_bridge": {},
                                                        "refreshComponentParameter": {},
                                                        "list": [],
                                                        "version": "v2",
                                                        "mobile_editable": [],
                                                        "desktop_editable": [],
                                                        "container_fonts": 0,
                                                        "visible": true,
                                                        "refer": "custom"
                                                    },
                                                    "mobile_editable": [],
                                                    "desktop": {
                                                        "data": {
                                                            "refer_app": "shop_template_black_style",
                                                            "refer_form_data": {}
                                                        }, "refer": "custom"
                                                    },
                                                    "desktop_editable": [],
                                                    "container_fonts": 0,
                                                    "visible": true
                                                });
                                                dialog.successMessage({ text: `AI生成完畢，使用了『${res.response.data.usage}』點 AI Points.` });
                                            }
                                        });
                                    }), "開始生成")}
</div>`
                                ].join('<div class="my-2"></div>')}
                                </div>`;
                            }
                            else {
                                return gvc.bindView(() => {
                                    let data = undefined;
                                    const id = gvc.glitter.getUUID();
                                    ApiPageConfig.getPageTemplate({
                                        template_from: vm.template_from,
                                        page: '0',
                                        limit: '3000',
                                        type: type,
                                        tag: (() => {
                                            if (basic) {
                                                return `基本元件`;
                                            }
                                            return (Storage.select_function === 'user-editor' ? vm.query_tag.concat('設計元件') : vm.query_tag).join(',');
                                        })(),
                                        search: vm.search,
                                    }).then((res) => {
                                        data = res;
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (data) {
                                                const title = EditorConfig.page_type_list.find((dd) => {
                                                    return type === dd.value;
                                                }).title;
                                                if (withEmpty) {
                                                    data.response.result.data = [
                                                        {
                                                            template_config: {
                                                                image: ['https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709282671899-BLANK PAGE.jpg'],
                                                                tag: ['頁面設計', '基本元件'],
                                                                name: '空白-' + title,
                                                            },
                                                            name: '空白-' + title,
                                                        },
                                                    ].concat(data.response.result.data);
                                                }
                                                return (() => {
                                                    if (data.response.result.data.length === 0) {
                                                        if (!vm.search) {
                                                            return html `
                                                            <div class="d-flex align-items-center justify-content-center flex-column w-100 py-4"
                                                                 style="width:700px;gap:10px;">
                                                                <img src="./img/box-open-solid.svg"/>
                                                                <span class="color39 text-center">尚未自製任何模塊<br/>請前往開發者模式自製專屬模塊</span>
                                                            </div>
                                                        `;
                                                        }
                                                        else {
                                                            return html `
                                                            <div class="d-flex align-items-center justify-content-center flex-column w-100 py-4"
                                                                 style="width:700px;gap:10px;">
                                                                <img src="./img/box-open-solid.svg"/>
                                                                <span class="color39 text-center">查無相關模塊</span>
                                                            </div>
                                                        `;
                                                        }
                                                    }
                                                    else {
                                                        return html `
                                                        <div
                                                                class="w-100"
                                                                style=" max-height:${(() => {
                                                            if (type === 'form_plugin') {
                                                                return `calc(100vh - 150px)`;
                                                            }
                                                            else {
                                                                return Storage.select_function === 'user-editor' ? `calc(100vh - 200px)` : `calc(100vh - 160px)`;
                                                            }
                                                        })()};overflow-y: auto;"
                                                        >
                                                            ${[
                                                            {
                                                                title: '基礎設計元件',
                                                                value: 'basic',
                                                            },
                                                            {
                                                                title: '商品顯示元件',
                                                                value: 'product_show',
                                                            },
                                                            {
                                                                title: '其餘設計模塊',
                                                                value: 'layout',
                                                            },
                                                            {
                                                                title: '包裝容器元件',
                                                                value: 'container',
                                                            },
                                                        ]
                                                            .map((d1) => {
                                                            return gvc.bindView(() => {
                                                                let vm_c = {
                                                                    toggle: false,
                                                                    id: gvc.glitter.getUUID(),
                                                                };
                                                                return {
                                                                    bind: vm_c.id,
                                                                    view: () => {
                                                                        const array = [
                                                                            html `
                                                                                            <div
                                                                                                    class="hoverF2 d-flex align-items-center p-3"
                                                                                                    onclick="${gvc.event(() => {
                                                                                vm_c.toggle = !vm_c.toggle;
                                                                                gvc.notifyDataChange(vm_c.id);
                                                                            })}"
                                                                                            >
                                                                                            <span
                                                                                                    class="fw-500"
                                                                                                    style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                                                                                            >${d1.title}</span
                                                                                            >
                                                                                                <div class="flex-fill"></div>
                                                                                                ${vm_c.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : `<i class="fa-solid fa-chevron-right"></i>`}
                                                                                            </div>
                                                                                        `,
                                                                        ];
                                                                        if (vm_c.toggle) {
                                                                            array.push(AddComponent.getComponentDetail({
                                                                                data: data.response.result.data
                                                                                    .concat((() => {
                                                                                    if (d1.value === 'container') {
                                                                                        return [
                                                                                            {
                                                                                                template_config: {
                                                                                                    image: [
                                                                                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/Screenshot 2024-08-12 at 2.11.09 PM.jpg',
                                                                                                    ],
                                                                                                    tag: [],
                                                                                                    name: '網格容器',
                                                                                                },
                                                                                                type: '容器',
                                                                                                name: '網格容器',
                                                                                            },
                                                                                            {
                                                                                                template_config: {
                                                                                                    image: [
                                                                                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_Screenshot2024-08-16at5.04.35 PM.jpg',
                                                                                                    ],
                                                                                                    tag: [],
                                                                                                    name: '垂直排版',
                                                                                                },
                                                                                                type: '容器',
                                                                                                name: '垂直排版',
                                                                                            },
                                                                                            {
                                                                                                template_config: {
                                                                                                    image: [
                                                                                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sbs8sfs9s0s2ses5_Screenshot2024-08-20at6.19.57 PM.jpg',
                                                                                                    ],
                                                                                                    tag: [],
                                                                                                    name: '比例佈局',
                                                                                                },
                                                                                                type: '容器',
                                                                                                name: '比例佈局',
                                                                                            },
                                                                                        ];
                                                                                    }
                                                                                    else {
                                                                                        return [];
                                                                                    }
                                                                                })())
                                                                                    .filter((dd) => {
                                                                                    var _a, _b, _c;
                                                                                    if (d1.value === 'basic') {
                                                                                        return ((_a = dd.template_config.tag) !== null && _a !== void 0 ? _a : []).find((dd) => {
                                                                                            return dd === '基本元件';
                                                                                        });
                                                                                    }
                                                                                    else if (d1.value === 'layout') {
                                                                                        return !((_b = dd.template_config.tag) !== null && _b !== void 0 ? _b : []).find((dd) => {
                                                                                            return dd === '基本元件' || dd === '商品元件';
                                                                                        });
                                                                                    }
                                                                                    else if (d1.value === 'product_show') {
                                                                                        return ((_c = dd.template_config.tag) !== null && _c !== void 0 ? _c : []).find((dd) => {
                                                                                            return dd === '商品元件';
                                                                                        });
                                                                                    }
                                                                                    else if (d1.value === 'container') {
                                                                                        return dd.type === '容器';
                                                                                    }
                                                                                }),
                                                                                gvc: gvc,
                                                                                justGetIframe: justGetIframe,
                                                                                withEmpty: withEmpty,
                                                                                callback: (dd) => {
                                                                                    if (dd.title === '網格容器') {
                                                                                        const config = {
                                                                                            id: gvc.glitter.getUUID(),
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: {
                                                                                                class: {},
                                                                                                style: {},
                                                                                            },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                inner: '',
                                                                                                setting: [],
                                                                                                version: 'v2',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                _layout: 'grid',
                                                                                                _x_count: '2',
                                                                                                _y_count: '2',
                                                                                                _gap_x: '30',
                                                                                                _gap_y: '30',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '容器',
                                                                                            global: [],
                                                                                            toggle: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        };
                                                                                        config.label = `網格容器`;
                                                                                        AddComponent.addWidget(gvc, config);
                                                                                    }
                                                                                    else if (dd.title === '垂直排版') {
                                                                                        const config = {
                                                                                            id: gvc.glitter.getUUID(),
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: {
                                                                                                class: {},
                                                                                                style: {},
                                                                                            },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                inner: '',
                                                                                                setting: [],
                                                                                                version: 'v2',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                _layout: 'vertical',
                                                                                                _x_count: '2',
                                                                                                _y_count: '2',
                                                                                                _gap_x: '30',
                                                                                                _gap_y: '30',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '容器',
                                                                                            global: [],
                                                                                            toggle: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        };
                                                                                        config.label = `垂直排版`;
                                                                                        AddComponent.addWidget(gvc, config);
                                                                                    }
                                                                                    else if (dd.title === '比例佈局') {
                                                                                        const config = {
                                                                                            id: gvc.glitter.getUUID(),
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: {
                                                                                                class: {},
                                                                                                style: {},
                                                                                            },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                inner: '',
                                                                                                setting: [],
                                                                                                _ratio_layout_value: '30,70,70,30',
                                                                                                version: 'v2',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                _layout: 'proportion',
                                                                                                _gap_x: '30',
                                                                                                _gap_y: '30',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '容器',
                                                                                            global: [],
                                                                                            toggle: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        };
                                                                                        config.label = `比例佈局`;
                                                                                        AddComponent.addWidget(gvc, config);
                                                                                    }
                                                                                    else {
                                                                                        callback(dd);
                                                                                    }
                                                                                },
                                                                                type: type,
                                                                            }));
                                                                        }
                                                                        return array.join(``);
                                                                    },
                                                                    divCreate: {
                                                                        class: `border-bottom`,
                                                                    },
                                                                };
                                                            });
                                                        })
                                                            .join('')}
                                                        </div>
                                                    `;
                                                    }
                                                })();
                                            }
                                            else {
                                                return html `
                                                <div class="w-100 p-3 d-flex align-items-center justify-content-center flex-column"
                                                     style="gap: 10px;">
                                                    <div class="spinner-border fs-5"></div>
                                                    <div class="fs-6 fw-500">載入中...</div>
                                                </div>`;
                                            }
                                        },
                                        divCreate: {
                                            style: '',
                                        },
                                    };
                                });
                            }
                        },
                    };
                }));
        });
    }
    static getComponentDetail(obj) {
        const data = obj.data;
        const gvc = obj.gvc;
        const withEmpty = obj.withEmpty;
        const type = obj.type;
        const callback = obj.callback;
        const justGetIframe = obj.justGetIframe;
        const html = String.raw;
        return html `
            <div class="row m-0 pt-2 w-100">
                ${data
            .sort((a, b) => {
            var _a, _b;
            if (['SY00-內文', 'SY00-按鈕連結', 'SY00-圖片元件', 'SY00-影片方塊', 'SY00-標題', 'SY00-商品顯示區塊', 'SY00-富文本區塊'].find((dd) => {
                return a.template_config.name === dd;
            })) {
                return -1;
            }
            const aData = ((_a = a.template_config.tag) !== null && _a !== void 0 ? _a : []).find((dd) => {
                return dd === '基本元件';
            });
            const bData = ((_b = b.template_config.tag) !== null && _b !== void 0 ? _b : []).find((dd) => {
                return dd === '基本元件';
            });
            if (aData && bData) {
                if (a.template_config.name === '空白-嵌入模塊') {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else if (aData) {
                return -1;
            }
            else {
                return 1;
            }
        })
            .sort((a, b) => {
            var _a;
            return Number(a.template_config.sort) < Number((_a = b.template_config.sort) !== null && _a !== void 0 ? _a : Infinity) ? -1 : 1;
        })
            .sort((a, b) => {
            var _a;
            if (a.template_config.name === '空白-嵌入模塊') {
                return -1;
            }
            else {
                return Number(a.template_config.sort) < Number((_a = b.template_config.sort) !== null && _a !== void 0 ? _a : Infinity) ? -1 : 1;
            }
        })
            .map((dd, index) => {
            var _a, _b;
            return html `
                                <div class="col-6  mb-3 ">
                                    <div class="d-flex flex-column  justify-content-center w-100"
                                         style="gap:5px;cursor:pointer;">
                                        <div class="card w-100 position-relative rounded hoverHidden  rounded-3"
                                             style="padding-bottom: 58%;overflow: hidden;">
                                            <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                                                 style="overflow: hidden;">
                                                <img class="w-100 "
                                                     src="${(_a = dd.template_config.image[0]) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"></img>
                                            </div>

                                            <div class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                 style="background: rgba(0,0,0,0.5);gap:5px;">
                                                <button class="btn btn-primary-c  d-flex align-items-center"
                                                        style="height: 28px;width: 75px;gap:5px;"
                                                        onclick="${gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                if (withEmpty && index === 0 && dd.template_config.name.includes('空白')) {
                    AddComponent.redefinePage(gvc, (data) => {
                        const tdata = {
                            appName: window.appName,
                            tag: data.tag,
                            group: data.group,
                            name: data.name,
                            page_type: type,
                        };
                        dialog.dataLoading({ visible: true });
                        ApiPageConfig.addPage(tdata).then((it) => {
                            setTimeout(() => {
                                dialog.dataLoading({ visible: false });
                                if (it.result) {
                                    callback(tdata);
                                    gvc.glitter.closeDiaLog();
                                }
                                else {
                                    dialog.errorMessage({
                                        text: '已有此頁面標籤',
                                    });
                                }
                            }, 1000);
                        });
                    }, type);
                }
                else {
                    if (justGetIframe) {
                        callback({
                            copy: dd.tag,
                            copyApp: dd.appName,
                            title: dd.name,
                        });
                    }
                    else {
                        dialog.dataLoading({ visible: true });
                        this.checkLoop(gvc, {
                            copy: dd.tag,
                            copyApp: dd.appName,
                        }).then((res) => __awaiter(this, void 0, void 0, function* () {
                            function next() {
                                var _a, _b;
                                return __awaiter(this, void 0, void 0, function* () {
                                    for (const dd of res.copy_component) {
                                        if (dd.execute !== 'ignore') {
                                            const data = {
                                                appName: window.appName,
                                                tag: dd.tag,
                                                group: dd.group,
                                                name: dd.name,
                                                page_type: dd.page_type,
                                                config: dd.config,
                                                page_config: dd.page_config,
                                                replace: dd.execute === 'replace',
                                            };
                                            if (dd.page_config.resource_from !== 'own') {
                                                data.config = data.config.concat((_a = res.global_style) !== null && _a !== void 0 ? _a : []);
                                                data.config = data.config.concat((_b = res.global_script) !== null && _b !== void 0 ? _b : []);
                                            }
                                            yield new Promise((resolve, reject) => {
                                                ApiPageConfig.addPage(data).then((it) => {
                                                    resolve(true);
                                                });
                                            });
                                        }
                                    }
                                    gvc.glitter.htmlGenerate.saveEvent(false, () => {
                                        dialog.dataLoading({ visible: false });
                                        callback({
                                            appName: window.appName,
                                            tag: res.copy_component[0].tag,
                                            group: res.copy_component[0].group,
                                            name: res.copy_component[0].name,
                                            page_type: res.copy_component[0].page_type,
                                            config: res.copy_component[0].config,
                                            page_config: res.copy_component[0].page_config,
                                        });
                                    });
                                });
                            }
                            if (gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                return res.copy_component.find((d2) => {
                                    return d2.tag === dd.tag;
                                });
                            })) {
                                dialog.dataLoading({
                                    visible: false,
                                });
                                EditorElem.openEditorDialog(gvc, (gvc) => {
                                    return [
                                        gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return html `
                                                                                                            <div class="alert alert-danger fs-base fw-bold">
                                                                                                                標籤名稱發生衝突，請選擇以下衝突組件的處理方式。
                                                                                                            </div>
                                                                                                            ${res.copy_component
                                                        .filter((d1) => {
                                                        return gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                                            return d1.tag === dd.tag;
                                                        });
                                                    })
                                                        .map((data, index) => {
                                                        let view = [
                                                            EditorElem.h3(html `
                                                                                                                                <span class="text-danger">
                                                                                                                        ${(data.template_config && data.template_config.name) || data.name}
                                                                                                                    </span>`),
                                                            `<div class="d-flex flex-wrap px-1 align-items-center ">
${[
                                                                {
                                                                    title: '忽略',
                                                                    value: 'ignore',
                                                                },
                                                                {
                                                                    title: '替換',
                                                                    value: 'replace',
                                                                },
                                                                {
                                                                    title: '重新命名',
                                                                    value: 'tag',
                                                                },
                                                            ]
                                                                .map((dd) => {
                                                                return `<div class="form-check form-check-inline" onclick="${gvc.event(() => {
                                                                    data.execute = dd.value;
                                                                    gvc.notifyDataChange(id);
                                                                })}">
  <input class="form-check-input" type="checkbox" id="ch-${dd.value}-${index}"   ${dd.value === data.execute ? `checked` : ``} >
  <label class="form-check-label" for="ch-${dd.value}-${index}" style="color:#5e5e5e;" onclick="${gvc.event(() => {
                                                                })}">${dd.title}</label>
</div>
                                                        `;
                                                            })
                                                                .join('')}
</div>`,
                                                        ];
                                                        data.execute === 'tag' &&
                                                            view.push(`<div class="pb-2">${EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: ``,
                                                                default: data.changeTag,
                                                                placeHolder: `請輸入標籤名稱`,
                                                                callback: (text) => {
                                                                    data.changeTag = text;
                                                                },
                                                            })}</div>`);
                                                        return `<div class="border-bottom w-100 ">${view.join('')}</div>`;
                                                    })
                                                        .join('')}
                                                                                                        `;
                                                },
                                                divCreate: {
                                                    class: `p-2 `,
                                                },
                                            };
                                        }),
                                        html `
                                                                                                <div class="d-flex align-items-center justify-content-end px-2 ">
                                                                                                    <button
                                                                                                            class="btn btn-primary-c btn-sm mb-2 fs-base"
                                                                                                            onclick="${gvc.event(() => {
                                            const conflict = res.copy_component.filter((d1) => {
                                                return gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                                    return d1.tag === dd.tag;
                                                });
                                            });
                                            if (conflict.find((dd) => {
                                                return !dd.execute;
                                            })) {
                                                dialog.errorMessage({ text: '請勾選項目' });
                                            }
                                            else if (conflict.find((dd) => {
                                                return dd.execute === 'tag' && !dd.changeTag;
                                            })) {
                                                dialog.errorMessage({ text: '請設定標籤名稱' });
                                            }
                                            else if (conflict.find((d1) => {
                                                return (d1.execute === 'tag' &&
                                                    gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                                        return d1.changeTag === dd.tag;
                                                    }));
                                            })) {
                                                dialog.errorMessage({
                                                    text: `此標籤名稱已重複:${conflict.find((d1) => {
                                                        return (d1.execute === 'tag' &&
                                                            gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                                                return d1.changeTag === dd.tag;
                                                            }));
                                                    }).changeTag}`,
                                                });
                                            }
                                            else {
                                                function loop(array, tag, replace) {
                                                    for (const dd of array) {
                                                        if (dd.type === 'container') {
                                                            loop(dd.data.setting, tag, replace);
                                                        }
                                                        else if (dd.type === 'component') {
                                                            if (dd.data.tag === tag) {
                                                                dd.data.tag = replace;
                                                            }
                                                        }
                                                    }
                                                }
                                                conflict
                                                    .filter((d1) => {
                                                    return d1.execute === 'tag';
                                                })
                                                    .map((dd) => {
                                                    loop(dd.config, dd.tag, dd.changeTag);
                                                    dd.tag = dd.changeTag;
                                                });
                                            }
                                            next();
                                        })}"
                                                                                                    >
                                                                                                        確認
                                                                                                    </button>
                                                                                                </div>`,
                                    ].join('');
                                }, () => {
                                }, 400, '偵測到衝突組件');
                            }
                            else {
                                next();
                            }
                        }));
                    }
                }
            })}"
                                                >
                                                    <i class="fa-regular fa-circle-plus "></i>新增
                                                </button>
                                                <button class="btn btn-warning d-flex align-items-center ${withEmpty && index === 0 ? `d-none` : ``}"
                                                        style="height: 28px;width: 75px;color:black;gap:5px;"
                                                        onclick="${gvc.event(() => {
                gvc.glitter.openDiaLog(new URL('./preview-app.js', import.meta.url).href, 'preview', {
                    page: dd.tag,
                    appName: dd.appName,
                    title: dd.name,
                });
            })}"
                                                >
                                                    <i class="fa-solid fa-eye "></i>預覽
                                                </button>
                                            </div>
                                        </div>
                                        <h3 class="fs-6 mb-0">
                                            ${dd.template_config.name}</h3>
                                        <div class="d-flex flex-wrap">
                                            ${((_b = dd.template_config.tag) !== null && _b !== void 0 ? _b : [])
                .filter((dd) => {
                return dd !== '設計元件' && dd !== '基本元件' && dd !== '商品元件';
            })
                .map((dd) => {
                return html `
                                                            <div
                                                                    class="d-flex align-items-center justify-content-center p-2   mb-1 bgf6 fw-500 border"
                                                                    style="color:black;border-radius: 11px;font-size:11px;height:22px;cursor: pointer;"
                                                            >
                                                                    #${dd}
                                                            </div>`;
            })
                .join('<div class="me-1"></div>')}

                                        </div>

                                    </div>
                                </div>
                            `;
        })
            .join('')}
            </div>`;
    }
    static plusView(gvc) {
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return [
                        {
                            title: '1格',
                            array: [
                                {
                                    title: '1-1',
                                    img: './img/gird-img/1-1.png',
                                    config: () => {
                                        return {
                                            id: gvc.glitter.getUUID(),
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                inner: '',
                                                setting: [],
                                                version: 'v2',
                                                atrExpand: {},
                                                elemExpand: {},
                                                _layout: 'grid',
                                            },
                                            type: 'container',
                                            index: 0,
                                            label: '容器',
                                            global: [],
                                            toggle: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                            ],
                        },
                        {
                            title: '2格',
                            array: [
                                {
                                    title: '2-1',
                                    img: './img/gird-img/2-1.png',
                                    config: () => {
                                        return {
                                            id: gvc.glitter.getUUID(),
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 'sasfsfsdsfscs8se',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'sfs2s7s4s3s6s4sc',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '1-1',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '2-2',
                                    img: './img/gird-img/2-2.png',
                                    config: () => {
                                        return {
                                            id: gvc.glitter.getUUID(),
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column ',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's0s2s2s0s8sbs5s9',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'sbs9sbs7sas8s0s7',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '2-2',
                                            global: [],
                                            toggle: false,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                            ],
                        },
                        {
                            title: '3格',
                            array: [
                                {
                                    title: '3-1',
                                    img: './img/gird-img/3-1.png',
                                    config: () => {
                                        return {
                                            id: gvc.glitter.getUUID(),
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's0s4sesasbsfsfsc',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'sds2s5sas3s7sbs9',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'sesfsds0s4s0ses3',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 2,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '3-1',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '3-2',
                                    img: './img/gird-img/3-2.png',
                                    config: () => {
                                        return {
                                            id: gvc.glitter.getUUID(),
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'row m-0',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 'sas9s0s9s0s8sbs1',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: 'col-12 col-sm-6',
                                                            inner: '',
                                                            style: 'flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'ses6ses7s6sbsbsa',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: 'col-12 col-sm-6',
                                                            inner: '',
                                                            style: '',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's5s1s4scs1s3sas1',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: 'col-12 ',
                                                            inner: '',
                                                            style: '',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 2,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:3-2',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '3-3',
                                    img: './img/gird-img/3-3.png',
                                    config: () => {
                                        return {
                                            id: gvc.glitter.getUUID(),
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'row m-0',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 'scscsasesescs9sa',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: 'col-12 ',
                                                            inner: '',
                                                            style: '',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's2sbsds5s0s7s7s1',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: 'col-12 col-sm-6',
                                                            inner: '',
                                                            style: 'flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's0s9sbs2s7sesfs9',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: 'col-12 col-sm-6',
                                                            inner: '',
                                                            style: '',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 2,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:3-3',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '3-4',
                                    img: './img/gird-img/3-4.png',
                                    config: () => {
                                        return {
                                            id: gvc.glitter.getUUID(),
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's1ses1s9s8scs9sb',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's4s0s2sds9s3s9sa',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 'sas4sas9s8s5sas3',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 'sdsfs8s1sfs8sbs5',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 'sas7s7s5s9sfscsd',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:3-4',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '3-5',
                                    img: './img/gird-img/3-5.png',
                                    config: () => {
                                        return {
                                            id: 's8s3s8saseses1sb',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's6sas4s5s6s1s0sa',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 's9s1sdsbsesds3s5',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's0sds9sfs3s3s0s0',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 'sfses5scsasfs1sd',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's7s2s3sds5scsfsa',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:3-5',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                            ],
                        },
                        {
                            title: '4格',
                            array: [
                                {
                                    title: '4-1',
                                    img: './img/gird-img/4-1.png',
                                    config: () => {
                                        return {
                                            id: 's4s4s1sfsbs7sbsf',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 'sds6s6sbs7s0s9s5',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 'sds3s0sbsds9sbs6',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's6sdsfsds9s2sfs1',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 'sfs1s9s2s0s7s0s3',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's0sbs3s0s2s7s8s5',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 's6sesas5s9sesbs3',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's7s0s8sbses7s3s4',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's5s5scs0s1s2s7s7',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-1',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '4-2',
                                    img: './img/gird-img/4-2.png',
                                    config: () => {
                                        return {
                                            id: 's3sfs4sbs4s1s9sc',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 'sesesfsesasas8s5',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 'sfs2s8s9s9s5sas0',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's7s5s3s9s3s9s1s4',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's5s1s3sas0s8ses1',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's4s0s9ses8sasfsc',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:2;',
                                                            setting: [
                                                                {
                                                                    id: 's2scs7s8sfsfs9s5',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's8s7s3s6s3s5s8s5',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's9s0s5s5scsfs2sd',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-1',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '4-3',
                                    img: './img/gird-img/4-3.png',
                                    config: () => {
                                        return {
                                            id: 'sas4s8s3s5s3sesc',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's9scs4sbses8s5s5',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:2;',
                                                            setting: [
                                                                {
                                                                    id: 's0s0s6s8sasbsbs8',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's6s6s3s6scs3s7s3',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's4s1s2scs7ses3s0',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's1sds1s9sas4sfs9',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 'sdsfs8sasbs0sbs5',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 'sds5s2sbs9s9sasb',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's5sas1sfs6sas9s1',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-1',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '4-4',
                                    img: './img/gird-img/4-4.png',
                                    config: () => {
                                        return {
                                            id: 's7s6s6seses2s1s1',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's8ses6sbs7s2sbs7',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'sfscscs8sdscsbs8',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:2;',
                                                            setting: [
                                                                {
                                                                    id: 's8s3s8s1s6s7s4sa',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's7scs5s6scs2sasc',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 'scs3sfs2sfsbs1s0',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: 'd-flex flex-column flex-sm-row',
                                                                                    inner: '',
                                                                                    style: 'gap:10px;',
                                                                                    setting: [
                                                                                        {
                                                                                            id: 's3s4sbs4s4s4sfs6',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                        {
                                                                                            id: 's5s1s9ses4s5sase',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 1,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                    ],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '容器:2-1',
                                                                                global: [],
                                                                                toggle: true,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-2',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '4-5',
                                    img: './img/gird-img/4-5.png',
                                    config: () => {
                                        return {
                                            id: 's0s7s8ses4sfsds0',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's0s2sfs5s5sds8s2',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:2;',
                                                            setting: [
                                                                {
                                                                    id: 'sas7sds6scscs6se',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's3s6sas3ses7s3sd',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: 'd-flex flex-column flex-sm-row',
                                                                                    inner: '',
                                                                                    style: 'gap:10px;',
                                                                                    setting: [
                                                                                        {
                                                                                            id: 's8ses8s4s9sbs4sd',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                        {
                                                                                            id: 's0s7sas2sas0s5sf',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 1,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                    ],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '容器:2-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's9s6s2sbs0sds3s4',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's3s4sbsds3s8s2s7',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-2',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                            ],
                        },
                        {
                            title: '5格',
                            array: [
                                {
                                    title: '5-1',
                                    img: './img/gird-img/5-1.png',
                                    config: () => {
                                        return {
                                            id: 'sbs2sds1s7sescs4',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column ',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's2sas1sas8sbs3sd',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 'sesesescs4sbs6s0',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column flex-sm-row',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's4sasfscs7s0s5s7',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's7s4sasas0s5s3s1',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-1',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's3scs4s6scsas4sb',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 's8s6sdscscsdsfs1',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column flex-sm-row',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 'sasasbs5s5scs3se',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's8s1s1s6sbs3sfs0',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's1scs4s2s3s9ses9',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 2,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:3-1',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:2-2',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '5-2',
                                    img: './img/gird-img/5-2.png',
                                    config: () => {
                                        return {
                                            id: 'sas1s0s1s3sbscs4',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column ',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's5s3sdsds5sds9s1',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 's4s0s0seses9s5s1',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column flex-sm-row',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's3scsesasbs9s0s7',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's4s1sbs2s4s1s8se',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's3s3s4s3s6sds4sd',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 2,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:3-1',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'sfsdsbs8sfsfs9se',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 'sfscsas3s3s5s9sd',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column flex-sm-row',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's9s7s7s0s0s4s8se',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's0sfs3s2s1s2s5sc',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-1',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:2-2',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '5-3',
                                    img: './img/gird-img/5-3.png',
                                    config: () => {
                                        return {
                                            id: 'sbs9s0s2s9s8s2s0',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's5s2sbscs3s8s0s9',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'sas1sds4s5sbs6sf',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:2;',
                                                            setting: [
                                                                {
                                                                    id: 's0s7s8s2s7s5s4s4',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 'sasasas9s8s0s3s0',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: 'd-flex flex-column flex-sm-row',
                                                                                    inner: '',
                                                                                    style: 'gap:10px;',
                                                                                    setting: [
                                                                                        {
                                                                                            id: 'sas4s9s5s7sfscsb',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                        {
                                                                                            id: 'sbsfsds0scs1s3s8',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 1,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                    ],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '容器:2-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's3sbsfs9s7s2s1s0',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: 'd-flex flex-column flex-sm-row',
                                                                                    inner: '',
                                                                                    style: 'gap:10px;',
                                                                                    setting: [
                                                                                        {
                                                                                            id: 'scsds3s4s5s1s9s0',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                        {
                                                                                            id: 's9s1s2s0s1s7s1sb',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 1,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                    ],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '容器:2-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-4',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '5-4',
                                    img: './img/gird-img/5-4.png',
                                    config: () => {
                                        return {
                                            id: 's1ses8sdscsds7sd',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's1s7scs9scs8sfs2',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:2;',
                                                            setting: [
                                                                {
                                                                    id: 's2s1sds5sas4s5sf',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's6s7s7s4s0sdsbsc',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: 'd-flex flex-column flex-sm-row',
                                                                                    inner: '',
                                                                                    style: 'gap:10px;',
                                                                                    setting: [
                                                                                        {
                                                                                            id: 'sfsas6s8s8s1s6s8',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                        {
                                                                                            id: 'ses6s8sdsfs1s8s7',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 1,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                    ],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '容器:2-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 'sds1ses6sas7sbsf',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: 'd-flex flex-column flex-sm-row',
                                                                                    inner: '',
                                                                                    style: 'gap:10px;',
                                                                                    setting: [
                                                                                        {
                                                                                            id: 's8s1sdsascs4s8s1',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                        {
                                                                                            id: 'sas3sasbscsfs5s2',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 1,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                    ],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '容器:2-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: false,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 'seses2s5scsfs7s6',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-4',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                                {
                                    title: '5-5',
                                    img: './img/gird-img/5-5.png',
                                    config: () => {
                                        return {
                                            id: 's8s3scs9sdsas7s2',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column flex-sm-row',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 'sds9s8s1s1s2s2s9',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 's3s3sas8s8sbs2sf',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 'ses4sfs4s4s6sese',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's3sdscs6s8scsbs5',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: false,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's8s4s6s4s9sfs7s2',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:2;',
                                                            setting: [
                                                                {
                                                                    id: 's3sasesbs0sds2s7',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column ',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's0s0s0s9sfscs6s5',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's3sfsbs5s8s2sbs0',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: 'd-flex flex-column flex-sm-row',
                                                                                    inner: '',
                                                                                    style: 'gap:10px;',
                                                                                    setting: [
                                                                                        {
                                                                                            id: 's9sfses2s4sdsfse',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 0,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                        {
                                                                                            id: 's1s5s6sfs3sesas6',
                                                                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                            css: { class: {}, style: {} },
                                                                                            data: {
                                                                                                attr: [],
                                                                                                elem: 'div',
                                                                                                list: [],
                                                                                                class: '',
                                                                                                inner: '',
                                                                                                style: '    flex:1;',
                                                                                                setting: [],
                                                                                                stylist: [],
                                                                                                version: 'v2',
                                                                                                dataType: 'static',
                                                                                                atrExpand: {},
                                                                                                elemExpand: {},
                                                                                                style_from: 'code',
                                                                                                classDataType: 'static',
                                                                                            },
                                                                                            type: 'container',
                                                                                            index: 1,
                                                                                            label: '1-1',
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            visible: true,
                                                                                            preloadEvenet: {},
                                                                                            refreshAllParameter: {},
                                                                                            refreshComponentParameter: {},
                                                                                            formData: {},
                                                                                        },
                                                                                    ],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '容器:2-1',
                                                                                global: [],
                                                                                toggle: true,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:2-2',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:4-4',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                            ],
                        },
                        {
                            title: '6格',
                            array: [
                                {
                                    title: '6-1',
                                    img: './img/gird-img/6-1.png',
                                    config: () => {
                                        return {
                                            id: 's1s8s9s4sas6s5s2',
                                            js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                            css: { class: {}, style: {} },
                                            data: {
                                                attr: [],
                                                elem: 'div',
                                                list: [],
                                                class: 'd-flex flex-column ',
                                                inner: '',
                                                style: 'gap:10px;',
                                                setting: [
                                                    {
                                                        id: 's1sas0s7sds2s1s0',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 'sasdscscsas5s0s1',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column flex-sm-row',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 's7s5s2sasfsbscsb',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's2s7s8s9sasas2s1',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's1sds1sfs0s8sas7',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 2,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:3-1',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 0,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                    {
                                                        id: 's0s0scsesfsds4s2',
                                                        js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                        css: { class: {}, style: {} },
                                                        data: {
                                                            attr: [],
                                                            elem: 'div',
                                                            list: [],
                                                            class: '',
                                                            inner: '',
                                                            style: '    flex:1;',
                                                            setting: [
                                                                {
                                                                    id: 's9sescs5s8s9s4sd',
                                                                    js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                    css: { class: {}, style: {} },
                                                                    data: {
                                                                        attr: [],
                                                                        elem: 'div',
                                                                        list: [],
                                                                        class: 'd-flex flex-column flex-sm-row',
                                                                        inner: '',
                                                                        style: 'gap:10px;',
                                                                        setting: [
                                                                            {
                                                                                id: 'scs6s4s1sesfs5sa',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 0,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's9s9sbsas9sbscs5',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 1,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                            {
                                                                                id: 's7s3s4s9s2s6ses2',
                                                                                js: 'http://127.0.0.1:4000/shopnex/official_view_component/official.js',
                                                                                css: { class: {}, style: {} },
                                                                                data: {
                                                                                    attr: [],
                                                                                    elem: 'div',
                                                                                    list: [],
                                                                                    class: '',
                                                                                    inner: '',
                                                                                    style: '    flex:1;',
                                                                                    setting: [],
                                                                                    stylist: [],
                                                                                    version: 'v2',
                                                                                    dataType: 'static',
                                                                                    atrExpand: {},
                                                                                    elemExpand: {},
                                                                                    style_from: 'code',
                                                                                    classDataType: 'static',
                                                                                },
                                                                                type: 'container',
                                                                                index: 2,
                                                                                label: '1-1',
                                                                                global: [],
                                                                                toggle: false,
                                                                                visible: true,
                                                                                preloadEvenet: {},
                                                                                refreshAllParameter: {},
                                                                                refreshComponentParameter: {},
                                                                                formData: {},
                                                                            },
                                                                        ],
                                                                        stylist: [],
                                                                        version: 'v2',
                                                                        dataType: 'static',
                                                                        atrExpand: {},
                                                                        elemExpand: {},
                                                                        style_from: 'code',
                                                                        classDataType: 'static',
                                                                    },
                                                                    type: 'container',
                                                                    index: 0,
                                                                    label: '容器:3-1',
                                                                    global: [],
                                                                    toggle: true,
                                                                    visible: true,
                                                                    preloadEvenet: {},
                                                                    refreshAllParameter: {},
                                                                    refreshComponentParameter: {},
                                                                    formData: {},
                                                                },
                                                            ],
                                                            stylist: [],
                                                            version: 'v2',
                                                            dataType: 'static',
                                                            atrExpand: {},
                                                            elemExpand: {},
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                        },
                                                        type: 'container',
                                                        index: 1,
                                                        label: '1-1',
                                                        global: [],
                                                        toggle: true,
                                                        visible: true,
                                                        preloadEvenet: {},
                                                        refreshAllParameter: {},
                                                        refreshComponentParameter: {},
                                                        formData: {},
                                                    },
                                                ],
                                                stylist: [],
                                                version: 'v2',
                                                dataType: 'static',
                                                atrExpand: {},
                                                elemExpand: {},
                                                style_from: 'code',
                                                classDataType: 'static',
                                            },
                                            type: 'container',
                                            index: 1,
                                            label: '容器:2-2',
                                            global: [],
                                            toggle: true,
                                            visible: true,
                                            preloadEvenet: {},
                                            refreshAllParameter: {},
                                            refreshComponentParameter: {},
                                            formData: {},
                                        };
                                    },
                                },
                            ],
                        },
                    ]
                        .map((dd, index) => {
                        return `
                        <div class="col-12 mt-3"><span class="color39 fs-6 fw-bold">${dd.title}</span></div>
                        ${dd.array
                            .map((dd) => {
                            return `<div class="col-6" style="margin-top: 12px;cursor: pointer;" onclick="${gvc.event(() => {
                                const config = dd.config();
                                config.label = `容器:${dd.title}`;
                                AddComponent.addWidget(gvc, config);
                            })}"><img class="w-100" src="${dd.img}"></img>
<div class="my-1 color39 w-100 d-flex align-items-center justify-content-center">${dd.title}</div>
</div>`;
                        })
                            .join('')}`;
                    })
                        .join('');
                },
                divCreate: {
                    class: `row m-0 px-3`,
                    style: `overflow-y:auto;max-height:calc(100vh - 130px);`,
                },
            };
        });
    }
    static redefinePage(gvc, callback, type) {
        const html = String.raw;
        const title = EditorConfig.page_type_list.find((dd) => {
            return dd.value === type;
        }).title;
        EditorElem.openEditorDialog(gvc, (gvc) => {
            const tdata = {
                tag: '',
                group: '',
                name: '',
            };
            return `<div class="px-2 pb-2">${[
                EditorElem.editeInput({
                    gvc: gvc,
                    title: `${title}標籤`,
                    default: '',
                    placeHolder: `請輸入${title}標籤`,
                    callback: (text) => {
                        tdata.tag = text;
                    },
                }),
                EditorElem.editeInput({
                    gvc: gvc,
                    title: `${title}名稱`,
                    default: '',
                    placeHolder: `請輸入${title}名稱`,
                    callback: (text) => {
                        tdata.name = text;
                    },
                }),
                EditorElem.searchInput({
                    title: html `${title}分類
                        <div class="alert alert-info p-2 mt-2" style="word-break: break-all;white-space:normal">可加入 /
                            進行分類:<br/>例如:首頁／置中版面
                        </div>`,
                    gvc: gvc,
                    def: '',
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
                    placeHolder: `請輸入${title}分類`,
                }),
            ].join('')}</div>
<div class="border-top d-flex p-2 justify-content-end">
<div class="btn btn-sm btn-primary-c fs-base" onclick="${gvc.event(() => {
                callback(tdata);
            })}">確認新增</div>
</div>
`;
        }, () => {
        }, 400, '編輯' + title);
    }
    static checkLoop(gvc, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                copy_component: [],
                global_style: [],
                global_script: [],
            };
            function getPlugin() {
                return new Promise((resolve, reject) => {
                    BaseApi.create({
                        url: `${window.glitterBackend}/api/v1/app/plugin?appName=${data.copyApp}`,
                        type: 'get',
                    }).then((res) => {
                        resolve(res.response.data);
                    });
                });
            }
            function getPageData(cf) {
                return new Promise((resolve, reject) => {
                    BaseApi.create({
                        url: `${window.glitterBackend}/api/v1/template?appName=${cf.appName}&tag=${cf.tag}`,
                        type: 'get',
                    }).then((res) => {
                        response.copy_component.push(res.response.result[0]);
                        resolve(res.response.result[0]);
                    });
                });
            }
            function loop(array) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const dd of array) {
                        if (dd.type === 'container') {
                            yield loop(dd.data.setting);
                        }
                        else if (dd.type === 'component') {
                            console.log(`component->${data.copyApp}=${dd.data.tag}`);
                            yield loop((yield getPageData({
                                appName: data.copyApp,
                                tag: dd.data.tag,
                            })).config);
                        }
                    }
                });
            }
            yield loop((yield getPageData({
                appName: data.copyApp,
                tag: data.copy,
            })).config);
            const plugin = yield getPlugin();
            plugin.globalStyle.map((dd) => {
                response.global_style.push(dd);
            });
            plugin.globalScript.map((dd) => {
                response.global_script.push(dd);
            });
            return response;
        });
    }
}
AddComponent.addEvent = (gvc, tdata) => {
};
AddComponent.addWidget = (gvc, tdata) => {
};
AddComponent.refresh = () => {
};
AddComponent.closeEvent = () => {
};
window.glitter.setModule(import.meta.url, AddComponent);
