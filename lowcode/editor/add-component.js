var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Storage } from "../glitterBundle/helper/storage.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import Add_item_dia from "../glitterBundle/plugins/add_item_dia.js";
import { PageEditor } from "./page-editor.js";
import { BaseApi } from "../glitterBundle/api/base.js";
import { EditorConfig } from "../editor-config.js";
export class AddComponent {
    static view(gvc) {
        return gvc.bindView(() => {
            const contentVM = {
                loading: true,
                leftID: gvc.glitter.getUUID(),
                rightID: gvc.glitter.getUUID(),
                leftBar: '',
                rightBar: ''
            };
            let vm = {
                select: "official"
            };
            vm.select = Storage.select_add_btn;
            let searchText = '';
            const id = gvc.glitter.getUUID();
            const html = String.raw;
            return {
                bind: id,
                view: () => {
                    return html `
                        <div class="w-100 d-flex align-items-center p-3 border-bottom">
                            <h5 class=" offcanvas-title  " style="">
                                添加組件</h5>
                            <div class="flex-fill"></div>
                            <div class="fs-5 text-black" style="cursor: pointer;" onclick="${gvc.event(() => {
                        AddComponent.toggle(false);
                    })}"><i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i></div>
                        </div>
                        <div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom">
                            ${(() => {
                        const list = [
                            {
                                key: 'official',
                                label: "模板庫",
                                icon: '<i class="fa-regular fa-block"></i>'
                            },
                            {
                                key: 'me',
                                label: "我的模塊",
                                icon: '<i class="fa-regular fa-toolbox"></i>'
                            },
                            {
                                key: 'template',
                                label: "基礎開發元件",
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
                                        case "me":
                                            PageEditor.pageSelctor(gvc, (d3) => {
                                                gvc.glitter.share.addComponent({
                                                    "id": gvc.glitter.getUUID(),
                                                    "js": "./official_view_component/official.js",
                                                    "css": {
                                                        "class": {},
                                                        "style": {}
                                                    },
                                                    "data": {
                                                        "tag": d3.tag,
                                                        "list": [],
                                                        "carryData": {}
                                                    },
                                                    "type": "component",
                                                    "class": "",
                                                    "index": 0,
                                                    "label": d3.name,
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
                                            }, {
                                                filter: (data) => {
                                                    return data.page_type == 'module';
                                                }
                                            }).then((data) => {
                                                resolve(`
                                                         <div class="position-relative bgf6 d-flex align-items-center justify-content-between  p-2 border-bottom shadow">
                    <span class="fs-6 fw-bold " style="color:black;">我的模塊</span>
                </div>
               <div style="max-height: calc(100vh - 160px);overflow-y: auto;"> ${data.left || ` <div class="d-flex align-items-center justify-content-center flex-column w-100"
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
                                        case "official":
                                            AddComponent.addModuleView(gvc, 'module', (tdata) => {
                                                gvc.glitter.share.addComponent({
                                                    "id": gvc.glitter.getUUID(),
                                                    "js": "./official_view_component/official.js",
                                                    "css": {
                                                        "class": {},
                                                        "style": {}
                                                    },
                                                    "data": {
                                                        'refer_app': tdata.copyApp,
                                                        "tag": tdata.copy,
                                                        "list": [],
                                                        "carryData": {}
                                                    },
                                                    "type": "component",
                                                    "class": "",
                                                    "index": 0,
                                                    "label": tdata.title,
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
                                            }, true, true).then((res) => {
                                                resolve(res);
                                            });
                                            break;
                                        case "template":
                                            Add_item_dia.add_official_plugin(gvc, searchText).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
                                            });
                                            break;
                                        case "view":
                                            Add_item_dia.add_unit_component(gvc, searchText).then((data) => {
                                                contentVM.loading = false;
                                                contentVM.leftBar = data.left;
                                                contentVM.rightBar = data.right;
                                                resolve(data.left);
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
                                                resolve(data.left);
                                            });
                                            break;
                                        case "copy":
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
                                style: `overflow-y:auto;min-height:280px;`
                            }
                        };
                    })}
                        </div>
                    `;
                },
                divCreate: {},
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }
            };
        });
    }
    static toggle(visible) {
        if (visible) {
            $('#addComponentViewHover').removeClass('d-none');
            $('#addComponentView').removeClass('scroll-out');
            $('#addComponentView').addClass('scroll-in');
        }
        else {
            $('#addComponentViewHover').addClass('d-none');
            $('#addComponentView').addClass('scroll-out');
            $('#addComponentView').removeClass('scroll-in');
        }
    }
    static leftNav(gvc) {
        const html = String.raw;
        return html `
            <div class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                 id="addComponentViewHover"
                 style="z-index: 99999;background: rgba(0,0,0,0.5);"
                 onclick="${gvc.event(() => {
            AddComponent.toggle(false);
        })}"></div>
            <div id="addComponentView"
                 class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:400px;z-index: 99999;left: -100%;">
                ${AddComponent.view(gvc)}
            </div>`;
    }
    static addModuleView(gvc, type, callback, withEmpty = false, justGetIframe = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerID = gvc.glitter.getUUID();
            const html = String.raw;
            const vm = {
                template_from: 'all',
                query_tag: [],
                search: ''
            };
            return gvc.bindView(() => {
                const searchContainer = gvc.glitter.getUUID();
                return {
                    bind: searchContainer,
                    view: () => {
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            let tagList = yield ApiPageConfig.getTagList({
                                type: type,
                                template_from: vm.template_from
                            });
                            resolve(html `
                            <div class="p-2 border-bottom border-top" style="background: whitesmoke;">
                                <div class="input-group">
                                    <input class="form-control input-sm" placeholder="關鍵字或標籤名稱"
                                           onchange="${gvc.event((e, event) => {
                                vm.search = e.value;
                                gvc.notifyDataChange(containerID);
                            })}">
                                    <span class="input-group-text" style="cursor: pointer">
   <i class="fa-solid fa-magnifying-glass" style="color:black;"></i>
  </span>
                                </div>
                            </div>
                            <div class="w-100 d-flex align-items-center  border-bottom">
                                ${gvc.bindView(() => {
                                const tagCId = gvc.glitter.getUUID();
                                return {
                                    bind: tagCId,
                                    view: () => {
                                        return tagList.response.result.map((dd, index) => {
                                            if (vm.query_tag.indexOf(dd.tag) !== -1) {
                                                return html `
                                                        <div class="d-flex align-items-center justify-content-center p-2    bgf6 fw-500 border "
                                                             style="border-radius: 14px;font-size:13px;height:28px;cursor: pointer;background: #295ed1;color:white;"
                                                             onclick="${gvc.event(() => {
                                                    vm.query_tag = vm.query_tag.filter((d2) => {
                                                        return d2 !== dd.tag;
                                                    });
                                                    gvc.notifyDataChange(containerID);
                                                    gvc.notifyDataChange(tagCId);
                                                })}">
                                                            <i class="fa-solid fa-circle-minus me-1"
                                                               style="color:red;font-size:14px;"></i>
                                                            ${dd.tag}
                                                        </div>`;
                                            }
                                            else {
                                                return html `
                                                        <div class="d-flex align-items-center justify-content-center p-2   bgf6 fw-500 border"
                                                             style="color:black;border-radius: 14px;font-size:13px;height:28px;cursor: pointer;"
                                                             onclick="${gvc.event(() => {
                                                    vm.query_tag.push(dd.tag);
                                                    gvc.notifyDataChange(containerID);
                                                    gvc.notifyDataChange(tagCId);
                                                })}"># ${dd.tag}
                                                        </div>`;
                                            }
                                        }).join(`<div class="mx-1"></div>`);
                                    },
                                    divCreate: {
                                        class: `flex-fill d-inline-flex px-2`, style: `overflow-x:auto;`
                                    }
                                };
                            })}
                                ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                let show = false;
                                return {
                                    bind: id,
                                    view: () => {
                                        return html `
                                                <button type="button"
                                                        class="btn btn-outline-secondary-c  dropdown-toggle"
                                                        style="height:30px;width:80px;font-size:13px;"
                                                        onclick="${gvc.event(() => {
                                            show = !show;
                                            gvc.notifyDataChange(id);
                                        })}">
                                                    ${(() => {
                                            switch (vm.template_from) {
                                                case "project":
                                                    return `專案資料`;
                                                case "me":
                                                    return `個人模板`;
                                                case "all":
                                                    return `官方模板`;
                                            }
                                        })()}
                                                </button>
                                                <div class="dropdown-menu my-1 ${(show) ? `show` : ``} position-fixed"
                                                     style="transform: translateY(30px);cursor: pointer;background: #f6f6f6">
                                                    <a class="dropdown-item" onclick="${gvc.event(() => {
                                            vm.template_from = 'all';
                                            gvc.notifyDataChange(containerID);
                                            gvc.notifyDataChange(searchContainer);
                                        })}">官方模板庫</a>
                                                    <a class="dropdown-item" onclick="${gvc.event(() => {
                                            vm.template_from = 'me';
                                            gvc.notifyDataChange(containerID);
                                            gvc.notifyDataChange(searchContainer);
                                        })}">個人模板庫</a>
                                                    <a class="dropdown-item" onclick="${gvc.event(() => {
                                            vm.template_from = 'project';
                                            gvc.notifyDataChange(containerID);
                                            gvc.notifyDataChange(searchContainer);
                                        })}">專案資料夾</a>
                                                </div>`;
                                    },
                                    divCreate: {
                                        class: `btn-group dropdown p-2 border-start`, style: "background: #f6f6f6;"
                                    }
                                };
                            })}
                            </div>`);
                        }));
                    }
                };
            }) + gvc.bindView(() => {
                return {
                    bind: containerID,
                    view: () => {
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            const data = yield ApiPageConfig.getPageTemplate({
                                template_from: vm.template_from,
                                page: '0',
                                limit: '50',
                                type: type,
                                tag: vm.query_tag.join(','),
                                search: vm.search
                            });
                            const title = EditorConfig.page_type_list.find((dd) => {
                                return type === dd.value;
                            }).title;
                            if (withEmpty) {
                                data.response.result.data = [{
                                        template_config: {
                                            image: ['https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709282671899-BLANK PAGE.jpg'],
                                            tag: ['頁面設計'],
                                            name: '空白-' + title
                                        },
                                        name: '空白-' + title
                                    }].concat(data.response.result.data);
                            }
                            resolve((() => {
                                if (data.response.result.data.length === 0) {
                                    return html `
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

                                `;
                                }
                                else {
                                    return html `
                                    <div class="w-100"
                                         style="max-height: calc(100vh - 220px);overflow-y: auto;">
                                        <div class="row m-0 pt-2 w-100">
                                            ${data.response.result.data.map((dd, index) => {
                                        var _a, _b;
                                        return html `
                                                    <div class="col-6 mb-3">
                                                        <div class="d-flex flex-column  justify-content-center w-100"
                                                             style="gap:5px;cursor:pointer;">
                                                            <div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                 style="padding-bottom: 58%;">
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
                                            if (withEmpty && index === 0) {
                                                AddComponent.redefinePage(gvc, (data) => {
                                                    const tdata = {
                                                        "appName": window.appName,
                                                        "tag": data.tag,
                                                        "group": data.group,
                                                        "name": data.name,
                                                        page_type: type
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
                                                                    text: "已有此頁面標籤"
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
                                                        title: dd.name
                                                    });
                                                }
                                                else {
                                                    dialog.dataLoading({ visible: true });
                                                    this.checkLoop(gvc, {
                                                        copy: dd.tag,
                                                        copyApp: dd.appName
                                                    }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                                        function next() {
                                                            var _a, _b;
                                                            return __awaiter(this, void 0, void 0, function* () {
                                                                for (const dd of res.copy_component) {
                                                                    if (dd.execute !== 'ignore') {
                                                                        const data = {
                                                                            "appName": window.appName,
                                                                            "tag": dd.tag,
                                                                            "group": dd.group,
                                                                            "name": dd.name,
                                                                            page_type: dd.page_type,
                                                                            config: dd.config,
                                                                            page_config: dd.page_config,
                                                                            replace: dd.execute === 'replace'
                                                                        };
                                                                        if ((dd.page_config.resource_from !== 'own')) {
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
                                                                        "appName": window.appName,
                                                                        "tag": res.copy_component[0].tag,
                                                                        "group": res.copy_component[0].group,
                                                                        "name": res.copy_component[0].name,
                                                                        page_type: res.copy_component[0].page_type,
                                                                        config: res.copy_component[0].config,
                                                                        page_config: res.copy_component[0].page_config
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
                                                                visible: false
                                                            });
                                                            EditorElem.openEditorDialog(gvc, (gvc) => {
                                                                return [gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                return html `
                                                                                                                <div class="alert alert-danger fs-base fw-bold">
                                                                                                                    標籤名稱發生衝突，請選擇以下衝突組件的處理方式。
                                                                                                                </div>
                                                                                                                ${res.copy_component.filter((d1) => {
                                                                                    return gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                                                                        return d1.tag === dd.tag;
                                                                                    });
                                                                                }).map((data, index) => {
                                                                                    let view = [
                                                                                        EditorElem.h3(html `
                                                                                                                            <span class="text-danger">
${(data.template_config && data.template_config.name) || data.name}
</span>`),
                                                                                        `<div class="d-flex flex-wrap px-1 align-items-center ">
${[
                                                                                            {
                                                                                                title: "忽略",
                                                                                                value: 'ignore'
                                                                                            },
                                                                                            {
                                                                                                title: "替換",
                                                                                                value: 'replace'
                                                                                            },
                                                                                            {
                                                                                                title: "重新命名",
                                                                                                value: 'tag'
                                                                                            }
                                                                                        ].map((dd) => {
                                                                                            return `<div class="form-check form-check-inline" onclick="${gvc.event(() => {
                                                                                                data.execute = dd.value;
                                                                                                gvc.notifyDataChange(id);
                                                                                            })}">
  <input class="form-check-input" type="checkbox" id="ch-${dd.value}-${index}"   ${(dd.value === data.execute) ? `checked` : ``} >
  <label class="form-check-label" for="ch-${dd.value}-${index}" style="color:#5e5e5e;" onclick="${gvc.event(() => {
                                                                                            })}">${dd.title}</label>
</div>
                                                        `;
                                                                                        }).join('')}
</div>`
                                                                                    ];
                                                                                    (data.execute === 'tag') && (view.push(`<div class="pb-2">${EditorElem.editeInput({
                                                                                        gvc: gvc,
                                                                                        title: ``,
                                                                                        default: data.changeTag,
                                                                                        placeHolder: `請輸入標籤名稱`,
                                                                                        callback: (text) => {
                                                                                            data.changeTag = text;
                                                                                        }
                                                                                    })}</div>`));
                                                                                    return `<div class="border-bottom w-100 ">${view.join('')}</div>`;
                                                                                }).join('')}
                                                                                                            `;
                                                                            },
                                                                            divCreate: {
                                                                                class: `p-2 `
                                                                            }
                                                                        };
                                                                    }),
                                                                    html `
                                                                                                        <div class="d-flex align-items-center justify-content-end px-2 ">
                                                                                                            <button class="btn btn-primary-c btn-sm mb-2 fs-base"
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
                                                                            return (dd.execute === 'tag') && !dd.changeTag;
                                                                        })) {
                                                                            dialog.errorMessage({ text: '請設定標籤名稱' });
                                                                        }
                                                                        else if (conflict.find((d1) => {
                                                                            return (d1.execute === 'tag') && gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                                                                return d1.changeTag === dd.tag;
                                                                            });
                                                                        })) {
                                                                            dialog.errorMessage({
                                                                                text: `此標籤名稱已重複:${conflict.find((d1) => {
                                                                                    return (d1.execute === 'tag') && gvc.glitter.share.editorViewModel.dataList.find((dd) => {
                                                                                        return d1.changeTag === dd.tag;
                                                                                    });
                                                                                }).changeTag}`
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
                                                                            conflict.filter((d1) => {
                                                                                return (d1.execute === 'tag');
                                                                            }).map((dd) => {
                                                                                loop(dd.config, dd.tag, dd.changeTag);
                                                                                dd.tag = dd.changeTag;
                                                                            });
                                                                        }
                                                                        next();
                                                                    })}">
                                                                                                                確認
                                                                                                            </button>
                                                                                                        </div>`
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
                                                                    <button class="btn btn-warning d-flex align-items-center ${(withEmpty && index === 0) ? `d-none` : ``}"
                                                                            style="height: 28px;width: 75px;color:black;gap:5px;"
                                                                            onclick="${gvc.event(() => {
                                            gvc.glitter.openDiaLog(new URL('./preview-app.js', import.meta.url).href, 'preview', {
                                                "page": dd.tag,
                                                "appName": dd.appName,
                                                "title": dd.name
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
                                                                ${((_b = dd.template_config.tag) !== null && _b !== void 0 ? _b : []).map((dd) => {
                                            return html `
                                                                        <div class="d-flex align-items-center justify-content-center p-2   mb-1 bgf6 fw-500 border"
                                                                             style="color:black;border-radius: 11px;font-size:11px;height:22px;cursor: pointer;">
                                                                                #${dd}
                                                                        </div>`;
                                        }).join('<div class="me-1"></div>')}

                                                            </div>

                                                        </div>
                                                    </div>
                                                `;
                                    }).join('')}
                                        </div>
                                    </div>
                                `;
                                }
                            })());
                        }));
                    }
                };
            });
        });
    }
    static redefinePage(gvc, callback, type) {
        const html = String.raw;
        const title = EditorConfig.page_type_list.find((dd) => {
            return dd.value === type;
        }).title;
        EditorElem.openEditorDialog(gvc, (gvc) => {
            const tdata = {
                "tag": "",
                "group": "",
                "name": "",
            };
            return `<div class="px-2 pb-2">${[EditorElem.editeInput({
                    gvc: gvc,
                    title: `${title}標籤`,
                    default: "",
                    placeHolder: `請輸入${title}標籤`,
                    callback: (text) => {
                        tdata.tag = text;
                    }
                }), EditorElem.editeInput({
                    gvc: gvc,
                    title: `${title}名稱`,
                    default: "",
                    placeHolder: `請輸入${title}名稱`,
                    callback: (text) => {
                        tdata.name = text;
                    }
                }), EditorElem.searchInput({
                    title: html `${title}分類
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
                    placeHolder: `請輸入${title}分類`
                })].join('')}</div>
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
                        type: 'get'
                    }).then((res) => {
                        resolve(res.response.data);
                    });
                });
            }
            function getPageData(cf) {
                return new Promise((resolve, reject) => {
                    BaseApi.create({
                        url: `${window.glitterBackend}/api/v1/template?appName=${cf.appName}&tag=${cf.tag}`,
                        type: 'get'
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
                                tag: dd.data.tag
                            })).config);
                        }
                    }
                });
            }
            yield loop((yield getPageData({
                appName: data.copyApp,
                tag: data.copy
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
