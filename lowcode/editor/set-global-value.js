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
import { PageEditor } from './page-editor.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgGlobalEvent } from '../backend-manager/bg-global-event.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import Add_item_dia from '../glitterBundle/plugins/add_item_dia.js';
export class SetGlobalValue {
    static view(gvc) {
        const html = String.raw;
        let vm = {
            select: Storage.global_select,
        };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            SetGlobalValue.refresh = () => {
                gvc.notifyDataChange(id);
            };
            return {
                bind: id,
                view: () => {
                    return [
                        `  <div class="w-100 d-flex align-items-center p-3 border-bottom">
                    <h5 class=" offcanvas-title  " >
                        全域設定</h5>
                    <div class="flex-fill"></div>
                    <div class="fs-5 text-black" style="cursor: pointer;" onclick="${gvc.event(() => {
                            SetGlobalValue.toggle(false);
                        })}"><i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i></div>
                </div>`,
                        `<div class="d-flex justify-content-around border-bottom py-2">
   ${(() => {
                            const list = [
                                {
                                    key: 'resource',
                                    label: '全域資源',
                                    icon: '<i class="fa-regular fa-folder"></i>',
                                },
                                {
                                    key: 'plugin',
                                    label: '模塊插件',
                                    icon: '<i class="fa-solid fa-puzzle-piece-simple"></i>',
                                },
                                {
                                    key: 'event',
                                    label: '事件集管理',
                                    icon: '<i class="fa-sharp fa-regular fa-brackets-curly"></i>',
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
                                    SetGlobalValue.checkFinish(() => {
                                        SetGlobalValue.checkFinish = (callback) => {
                                            callback();
                                        };
                                        vm.select = dd.key;
                                        Storage.global_select = dd.key;
                                        gvc.notifyDataChange(id);
                                    });
                                })}">
                               ${dd.icon}
                            </div>`;
                            })
                                .join('');
                        })()}

</div>`,
                        `<div style="height: calc(100vh - 120px);overflow-y: auto;" class="w-100 ">
${(() => {
                            switch (vm.select) {
                                case 'domain':
                                    return SetGlobalValue.domainSetting(gvc);
                                case 'event':
                                    return BgGlobalEvent.mainPage(gvc);
                                case 'plugin':
                                    return SetGlobalValue.pluginSetting(gvc);
                                case 'resource':
                                    return SetGlobalValue.resourceView(gvc);
                            }
                        })()}
</div>`,
                    ].join('');
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                },
            };
        });
    }
    static leftNav(gvc) {
        const html = String.raw;
        return html ` <div
                class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                id="setGlobalViewHover"
                style="z-index: 99999;background: rgba(0,0,0,0.5);"
                onclick="${gvc.event(() => {
            SetGlobalValue.toggle(false);
        })}"
            ></div>
            <div id="setGlobalView" class="position-fixed left-0 top-0 h-100 bg-white shadow-lg " style="width:600px;z-index: 99999;left: -200%;">${SetGlobalValue.view(gvc)}</div>`;
    }
    static toggle(visible) {
        if (visible) {
            $('#setGlobalViewHover').removeClass('d-none');
            $('#setGlobalView').removeClass('scroll-out');
            $('#setGlobalView').addClass('scroll-in');
            SetGlobalValue.refresh();
        }
        else {
            SetGlobalValue.checkFinish(() => {
                SetGlobalValue.checkFinish = (callback) => {
                    callback();
                };
                $('#setGlobalViewHover').addClass('d-none');
                $('#setGlobalView').addClass('scroll-out');
                $('#setGlobalView').removeClass('scroll-in');
            });
        }
    }
    static resourceView(gvc) {
        return gvc.bindView(() => {
            return {
                bind: gvc.glitter.getUUID(),
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const data = yield SetGlobalValue.valueRender(gvc);
                        resolve(`<div class="w-100 d-flex">${data.left}${data.right}</div>`);
                    }));
                },
            };
        });
    }
    static valueRender(gvc) {
        var _a;
        const html = String.raw;
        const glitter = gvc.glitter;
        const og = JSON.parse(JSON.stringify(gvc.glitter.share.editorViewModel));
        const viewModel = JSON.parse(JSON.stringify(gvc.glitter.share.editorViewModel));
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        viewModel.selectItem = undefined;
        viewModel.globalValue = (_a = viewModel.globalValue) !== null && _a !== void 0 ? _a : [];
        SetGlobalValue.checkFinish = (callback) => {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(viewModel.globalValue) !== JSON.stringify(og.globalValue)) {
                dialog.checkYesOrNot({
                    text: '偵測到變更，是否儲存?',
                    callback: (response) => {
                        if (!response) {
                            callback();
                        }
                        else {
                            gvc.glitter.share.editorViewModel.globalValue = viewModel.globalValue;
                            gvc.glitter.htmlGenerate.saveEvent(true);
                        }
                    },
                });
            }
            else {
                callback();
            }
        };
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    return {
                        bind: vid,
                        view: () => {
                            return [
                                html ` <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom bgf6" style="color:#151515;font-size:14px;gap:0px;height:48px;">
                                    共用資源管理
                                    <div class="flex-fill"></div>
                                    <li
                                        class="btn-group dropend"
                                        onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalValue;
                                })}"
                                    >
                                        <div
                                            class="editor_item   px-2 me-0 d-none"
                                            style="cursor:pointer; "
                                            onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalValue;
                                    glitter.share.pastEvent();
                                })}"
                                        >
                                            <i class="fa-duotone fa-paste"></i>
                                        </div>
                                        <div
                                            class="editor_item   px-2 ms-0 me-n1"
                                            style="cursor:pointer;gap:5px;width:30px;color:black;"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i class="fa-regular fa-circle-plus "></i>
                                        </div>
                                        <div
                                            class="dropdown-menu  position-fixed pb-0 border "
                                            style="z-index:999999;"
                                            onclick="${gvc.event((e, event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                })}"
                                        >
                                            ${Add_item_dia.add_content_folder(gvc, 'globalValue', (response) => {
                                    viewModel.globalValue.push(response);
                                    gvc.notifyDataChange(vid);
                                })}
                                        </div>
                                    </li>
                                </div>`,
                                new PageEditor(gvc, vid, docID).renderLineItem(viewModel.globalValue.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }), false, viewModel.globalValue, {
                                    addComponentView: (gvc, callback) => {
                                        return Add_item_dia.add_content_folder(gvc, 'globalValue', callback);
                                    },
                                    copyType: 'directly',
                                    selectEvent: (dd) => {
                                        var _a;
                                        viewModel.selectItem = dd;
                                        dd.data.tagType = (_a = dd.data.tagType) !== null && _a !== void 0 ? _a : 'value';
                                        gvc.notifyDataChange([docID, vid]);
                                    },
                                }),
                            ].join('');
                        },
                        divCreate: {
                            style: `min-height:400px;width:250px;height: calc(100vh - 120px);overflow-y:auto;`,
                            class: `border-end`,
                        },
                        onCreate: () => {
                            gvc.notifyDataChange(docID);
                        },
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            if (viewModel.selectItem && viewModel.selectItem.data && (viewModel.selectItem.data.tagType || viewModel.selectItem.type === 'container')) {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:14px;gap:0px;height:48px;">
                                        ${viewModel.selectItem.label}
                                        <div class="flex-fill"></div>
                                        <button
                                            class="btn btn-primary-c me-2"
                                            style="height: 28px;width: 80px;"
                                            onclick="${gvc.event(() => {
                                    gvc.glitter.share.editorViewModel.globalValue = viewModel.globalValue;
                                    gvc.glitter.htmlGenerate.saveEvent(true);
                                })}"
                                        >
                                            儲存內容
                                        </button>
                                    </div>
                                    ${gvc.bindView(() => {
                                    return {
                                        bind: `htmlGenerate`,
                                        view: () => {
                                            var _a;
                                            return (EditorElem.editeInput({
                                                gvc: gvc,
                                                title: `${viewModel.selectItem.type === 'container' ? `分類` : `參數`}名稱`,
                                                default: (_a = viewModel.selectItem.label) !== null && _a !== void 0 ? _a : '',
                                                placeHolder: `請輸入${viewModel.selectItem.type === 'container' ? `分類` : `參數`}名稱`,
                                                callback: (text) => {
                                                    viewModel.selectItem.label = text;
                                                    gvc.notifyDataChange([vid, docID]);
                                                },
                                            }) +
                                                (viewModel.selectItem.type === 'container'
                                                    ? ``
                                                    : (() => {
                                                        var _a, _b, _c, _d;
                                                        viewModel.selectItem.data.tagType = (_a = viewModel.selectItem.data.tagType) !== null && _a !== void 0 ? _a : 'value';
                                                        const data = [
                                                            EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: `標籤名稱`,
                                                                default: (_b = viewModel.selectItem.data.tag) !== null && _b !== void 0 ? _b : '',
                                                                placeHolder: `請輸入標籤名`,
                                                                callback: (text) => {
                                                                    viewModel.selectItem.data.tag = text;
                                                                    gvc.notifyDataChange([vid, docID]);
                                                                },
                                                            }),
                                                            EditorElem.select({
                                                                title: '資料類型',
                                                                gvc: gvc,
                                                                def: viewModel.selectItem.data.tagType,
                                                                array: [
                                                                    {
                                                                        title: '多國語言',
                                                                        value: `language`,
                                                                    },
                                                                    {
                                                                        title: '參數',
                                                                        value: `value`,
                                                                    },
                                                                    {
                                                                        title: 'STYLE設計',
                                                                        value: `style`,
                                                                    },
                                                                    {
                                                                        title: '檔案路徑',
                                                                        value: `file`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    viewModel.selectItem.data.tagType = text;
                                                                    gvc.notifyDataChange([vid, docID]);
                                                                },
                                                            }),
                                                        ];
                                                        if (viewModel.selectItem.data.tagType === 'language') {
                                                            if (!Array.isArray(viewModel.selectItem.data.value)) {
                                                                viewModel.selectItem.data.value = [];
                                                            }
                                                            data.push(gvc.bindView(() => {
                                                                const id = glitter.getUUID();
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        return EditorElem.arrayItem({
                                                                            gvc: gvc,
                                                                            title: ``,
                                                                            array: () => {
                                                                                return viewModel.selectItem.data.value.map((dd) => {
                                                                                    var _a;
                                                                                    return {
                                                                                        title: (_a = dd.lan) !== null && _a !== void 0 ? _a : '尚未設定語言',
                                                                                        innerHtml: (gvc) => {
                                                                                            var _a;
                                                                                            return [
                                                                                                EditorElem.searchInput({
                                                                                                    gvc: gvc,
                                                                                                    title: `語言代號`,
                                                                                                    def: dd.lan,
                                                                                                    placeHolder: `請輸入語言代號`,
                                                                                                    array: [
                                                                                                        'zh-TW',
                                                                                                        'en',
                                                                                                        'af',
                                                                                                        'sq',
                                                                                                        'ar',
                                                                                                        'hy',
                                                                                                        'az',
                                                                                                        'eu',
                                                                                                        'be',
                                                                                                        'bs',
                                                                                                        'bg',
                                                                                                        'ca',
                                                                                                        'hr',
                                                                                                        'cs',
                                                                                                        'da',
                                                                                                        'nl',
                                                                                                        'en',
                                                                                                        'et',
                                                                                                        'fi',
                                                                                                        'fr',
                                                                                                        'ka',
                                                                                                        'de',
                                                                                                        'el',
                                                                                                        'ht',
                                                                                                        'hu',
                                                                                                        'is',
                                                                                                        'id',
                                                                                                        'ga',
                                                                                                        'it',
                                                                                                        'ja',
                                                                                                        'ko',
                                                                                                        'lv',
                                                                                                        'lt',
                                                                                                        'mk',
                                                                                                        'mt',
                                                                                                        'no',
                                                                                                        'fa',
                                                                                                        'pl',
                                                                                                        'pt',
                                                                                                        'ro',
                                                                                                        'ru',
                                                                                                        'sr',
                                                                                                        'sk',
                                                                                                        'sl',
                                                                                                        'es',
                                                                                                        'sw',
                                                                                                        'sv',
                                                                                                        'th',
                                                                                                        'tr',
                                                                                                        'uk',
                                                                                                        'vi',
                                                                                                        'cy',
                                                                                                        'yi',
                                                                                                        'zu',
                                                                                                    ],
                                                                                                    callback: (text) => {
                                                                                                        dd.lan = text;
                                                                                                    },
                                                                                                }),
                                                                                                EditorElem.editeText({
                                                                                                    gvc: gvc,
                                                                                                    title: `文字內容`,
                                                                                                    default: (_a = dd.text) !== null && _a !== void 0 ? _a : '',
                                                                                                    placeHolder: `請輸入文字內容`,
                                                                                                    callback: (text) => {
                                                                                                        dd.text = text;
                                                                                                    },
                                                                                                }),
                                                                                            ].join('');
                                                                                        },
                                                                                    };
                                                                                });
                                                                            },
                                                                            originalArray: viewModel.selectItem.data.value,
                                                                            expand: {},
                                                                            refreshComponent: () => {
                                                                                gvc.notifyDataChange(id);
                                                                            },
                                                                            plus: {
                                                                                title: '新增多國語言',
                                                                                event: gvc.event(() => {
                                                                                    viewModel.selectItem.data.value.push({
                                                                                        lan: navigator.language,
                                                                                        text: '',
                                                                                    });
                                                                                    gvc.notifyDataChange(id);
                                                                                }),
                                                                            },
                                                                        });
                                                                    },
                                                                    divCreate: {
                                                                        class: `mx-n3`,
                                                                    },
                                                                };
                                                            }));
                                                        }
                                                        else if (viewModel.selectItem.data.tagType === 'value') {
                                                            data.push(EditorElem.editeText({
                                                                gvc: gvc,
                                                                title: ``,
                                                                default: (_c = viewModel.selectItem.data.value) !== null && _c !== void 0 ? _c : '',
                                                                placeHolder: '請輸入參數內容',
                                                                callback: (text) => {
                                                                    viewModel.selectItem.data.value = text;
                                                                },
                                                            }));
                                                            if (viewModel.selectItem.data.tagType === 'value') {
                                                                data.push(`<div class="alert alert-info mt-2 fw-500 p-2" style="white-space:normal;word-break: break-all;font-size:14px;">
-HTML內容嵌入:<br>@{{${viewModel.selectItem.data.tag}}<br>
-取值代碼:<br>glitter.share.globalValue["${viewModel.selectItem.data.tag}"]
</div>`);
                                                            }
                                                        }
                                                        else if (viewModel.selectItem.data.tagType === 'style') {
                                                            data.push(`<div class="mt-2"></div>`);
                                                            data.push(EditorElem.styleEditor({
                                                                gvc: gvc,
                                                                height: 300,
                                                                initial: viewModel.selectItem.data.value,
                                                                title: '',
                                                                callback: (data) => {
                                                                    viewModel.selectItem.data.value = data;
                                                                },
                                                            }));
                                                        }
                                                        else if (viewModel.selectItem.data.tagType === 'file') {
                                                            data.push(`<div class="mt-2"></div>`);
                                                            data.push(EditorElem.uploadFile({
                                                                gvc: gvc,
                                                                title: ``,
                                                                def: (_d = viewModel.selectItem.data.value) !== null && _d !== void 0 ? _d : '',
                                                                callback: (text) => {
                                                                    viewModel.selectItem.data.value = text;
                                                                    gvc.notifyDataChange([vid, docID]);
                                                                },
                                                            }));
                                                        }
                                                        return data.join('');
                                                    })()));
                                        },
                                        divCreate: {
                                            class: `p-2`,
                                            style: `overflow-y:auto;max-height:calc(100vh - 270px);`,
                                        },
                                        onCreate: () => {
                                            setTimeout(() => {
                                                var _a;
                                                $('#jumpToNav').scrollTop((_a = parseInt(glitter.getCookieByName('jumpToNavScroll'), 10)) !== null && _a !== void 0 ? _a : 0);
                                            }, 1000);
                                        },
                                    };
                                })}
                                    <div class="d-flex">
                                        <div class="flex-fill"></div>
                                        <button
                                            class="btn btn-danger me-2"
                                            style="height: 30px;width: 90px;"
                                            onclick="${gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.checkYesOrNot({
                                        text: '是否確認刪除資源?',
                                        callback: (response) => {
                                            if (response) {
                                                function checkValue(check) {
                                                    let data = [];
                                                    check.map((dd) => {
                                                        var _a;
                                                        if (dd.id !== viewModel.selectItem.id) {
                                                            data.push(dd);
                                                        }
                                                        if (dd.type === 'container') {
                                                            dd.data.setting = checkValue((_a = dd.data.setting) !== null && _a !== void 0 ? _a : []);
                                                        }
                                                    });
                                                    return data;
                                                }
                                                gvc.glitter.share.editorViewModel.globalValue = checkValue(viewModel.globalValue);
                                                viewModel.selectItem = undefined;
                                                gvc.notifyDataChange([vid, docID]);
                                            }
                                        },
                                    });
                                })}"
                                        >
                                            <i class="fa-regular fa-circle-minus me-1"></i>移除參數
                                        </button>
                                    </div>
                                    <div class="flex-fill"></div>
                                `;
                            }
                            else {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:14px;gap:0px;height:48px;">
                                        說明描述
                                    </div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center" style="height:calc(100% - 48px);">
                                        <lottie-player
                                            src="lottie/animation_data.json"
                                            class="mx-auto my-n4"
                                            speed="1"
                                            style="max-width: 100%;width: 250px;height:300px;"
                                            loop
                                            autoplay
                                        ></lottie-player>
                                        <h3 class=" text-center px-4" style="font-size:18px;">
                                            透過設定共用資源，來決定頁面的統一內容。
                                            <div class="alert alert-info mt-3 mx-n3 p-2 text-start" style="white-space: normal;font-size: 15px;font-weight: 500;">
                                                <p class="m-0">．使用 @{{value}}，在HTML特徵值中嵌入參數。</p>
                                                <p class="m-0 mt-2">．使用glitter.share.globalValue[value]，在代碼中取得參數。</p>
                                            </div>
                                        </h3>
                                    </div>
                                `;
                            }
                        },
                        divCreate: () => {
                            return {
                                class: ` h-100 p-2 d-flex flex-column`,
                                style: `width:350px;`,
                            };
                        },
                        onCreate: () => { },
                    };
                }),
            });
        });
    }
    static domainSetting(gvc) {
        const id = gvc.glitter.getUUID();
        const html = String.raw;
        return html `
            <div class="bg-white rounded" style="max-height:90vh;">
                <div class="position-relative bgf6 d-flex align-items-center justify-content-between  px-2 py-3 border-bottom shadow">
                    <span class="fs-6 fw-bold " style="color:black;">網域設定</span>
                </div>
                <div class="d-flex " >
                    <div>
                        ${gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    const contentVM = {
                        loading: true,
                        leftID: gvc.glitter.getUUID(),
                        rightID: gvc.glitter.getUUID(),
                        leftBar: '',
                        rightBar: '',
                    };
                    PageEditor.domainRender(gvc).then((response) => {
                        contentVM.loading = false;
                        contentVM.leftBar = response.left;
                        contentVM.rightBar = response.right;
                        gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                    });
                    return html ` <div class="d-flex">
                                        <div  class="border-end w-100">
                                            ${gvc.bindView(() => {
                        return {
                            bind: contentVM.leftID,
                            view: () => {
                                return contentVM.leftBar;
                            },
                            divCreate: {
                                class: `position-relative`,
                                style: `height:calc(100vh - 170px);overflow-y:auto;overflow-x:hidden;background-color:#f3f6ff !important`,
                            },
                        };
                    })}
                                        </div>
                                        ${gvc.bindView(() => {
                        return {
                            bind: contentVM.rightID,
                            view: () => {
                                return contentVM.rightBar;
                            },
                            divCreate: {
                                class: `position-relative`,
                            },
                        };
                    })}
                                    </div>`;
                },
                divCreate: {
                    style: `overflow-y:auto;`,
                },
                onCreate: () => { },
            };
        })}
                    </div>
                </div>
            </div>
        `;
    }
    static pluginSetting(gvc) {
        const html = String.raw;
        const id = gvc.glitter.getUUID();
        const vm = {
            select: Storage.select_global_editor_tab,
        };
        return html `
            <div class="bg-white rounded" >
                <div class="d-flex " >
                    <div>
                        ${gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    const contentVM = {
                        loading: true,
                        leftID: gvc.glitter.getUUID(),
                        rightID: gvc.glitter.getUUID(),
                        leftBar: '',
                        rightBar: '',
                    };
                    switch (vm.select) {
                        case 'view':
                            SetGlobalValue.pluginViewRender(gvc).then((data) => {
                                contentVM.loading = false;
                                contentVM.leftBar = data.left;
                                contentVM.rightBar = data.right;
                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                            });
                            break;
                        case 'event':
                            SetGlobalValue.eventRender(gvc).then((data) => {
                                contentVM.loading = false;
                                contentVM.leftBar = data.left;
                                contentVM.rightBar = data.right;
                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                            });
                            break;
                        default:
                            SetGlobalValue.resourceInitial(gvc).then((data) => {
                                contentVM.loading = false;
                                contentVM.leftBar = data.left;
                                contentVM.rightBar = data.right;
                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                            });
                            break;
                    }
                    const list = [
                        {
                            key: 'view',
                            label: '頁面模塊',
                            icon: '<i class="fa-regular fa-file-dashed-line"></i>',
                        },
                        {
                            key: 'event',
                            label: '事件模塊',
                            icon: '<i class="fa-solid fa-code"></i>',
                        },
                        {
                            key: 'router',
                            label: '路徑設定',
                            icon: '<i class="fa-duotone fa-route"></i>',
                        },
                    ];
                    return html ` <div class="d-flex">
                                        <div style="width:300px;" class="border-end">
                                            <div class="d-flex w-100  ps-2   hi fw-bold d-flex align-items-center border-bottom bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                                ${list.find((dd) => {
                        return dd.key === vm.select;
                    }).label}
                                                <div class="flex-fill"></div>
                                                ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return `<div class="fw-500 me-2 pb-1 " style="font-size:15px;color:#151515;">開發者模式</div>
                                                                <div class="form-check form-switch mode-switch"  data-bs-toggle="mode"
                                                                     onchange="${gvc.event(() => {
                                    Storage.develop_mode = Storage.develop_mode === 'false' ? 'true' : 'false';
                                    gvc.notifyDataChange(['showView', id]);
                                })}">
                                                                    <input type="checkbox" class="form-check-input" style="${Storage.develop_mode === 'true' ? `background-color:#E30000FF !important;` : `background-color:gray !important;`}" id="theme-mode"
                                                                           ${Storage.develop_mode === 'true' ? `checked` : ``}>
                                                                </div>`;
                            },
                            divCreate: {
                                class: `d-flex align-items-center justify-content-center me-2 h-100 border-start ps-2`,
                                style: `cursor:pointer;`,
                            },
                            onCreate: () => { },
                        };
                    })}
                                            </div>
                                            <div class="d-flex justify-content-around py-2 border-bottom">
                                                ${(() => {
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
                                SetGlobalValue.checkFinish(() => {
                                    SetGlobalValue.checkFinish = (callback) => {
                                        callback();
                                    };
                                    Storage.select_global_editor_tab = dd.key;
                                    vm.select = dd.key;
                                    gvc.notifyDataChange(id);
                                });
                            })}">
                               ${dd.icon}
                            </div>`;
                        })
                            .join('');
                    })()}
                                            </div>
                                            ${gvc.bindView(() => {
                        return {
                            bind: contentVM.leftID,
                            view: () => {
                                return contentVM.leftBar;
                            },
                            divCreate: {
                                class: ``,
                                style: `height:calc(100vh - 230px);overflow-y:auto;overflow-x:hidden;`,
                            },
                        };
                    })}
                                        </div>
                                        ${gvc.bindView(() => {
                        return {
                            bind: contentVM.rightID,
                            view: () => {
                                return contentVM.rightBar;
                            },
                            divCreate: {},
                        };
                    })}
                                    </div>`;
                },
                divCreate: {
                    style: `overflow-y:auto;`,
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                },
            };
        })}
                    </div>
                </div>
            </div>
        `;
    }
    static pluginViewRender(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        glitter.share.editorViewModel.selectItem = undefined;
        const og = JSON.parse(JSON.stringify(glitter.share.editorViewModel));
        const viewModel = JSON.parse(JSON.stringify(glitter.share.editorViewModel));
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        SetGlobalValue.checkFinish = (callback) => {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(viewModel.pluginList) !== JSON.stringify(og.pluginList)) {
                dialog.checkYesOrNot({
                    text: '偵測到變更，是否儲存?',
                    callback: (response) => {
                        if (!response) {
                            callback();
                        }
                        else {
                            glitter.share.editorViewModel.appConfig.pagePlugin = viewModel.pluginList;
                            gvc.glitter.htmlGenerate.saveEvent(true);
                        }
                    },
                });
            }
            else {
                callback();
            }
        };
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    const id = vid;
                    return {
                        bind: id,
                        view: () => {
                            return `
                          
${EditorElem.arrayItem({
                                originalArray: viewModel.pluginList,
                                gvc: gvc,
                                customEditor: true,
                                title: '',
                                array: () => {
                                    return viewModel.pluginList.map((dd, index) => {
                                        return {
                                            title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                            innerHtml: () => {
                                                viewModel.selectItem = dd;
                                                gvc.notifyDataChange(docID);
                                            },
                                        };
                                    });
                                },
                                expand: undefined,
                                plus: {
                                    title: '頁面模塊',
                                    event: gvc.event(() => {
                                        viewModel.pluginList.push({
                                            name: '',
                                            route: '',
                                            src: {
                                                official: '',
                                                staging: '',
                                                open: true,
                                            },
                                        });
                                        gvc.notifyDataChange(id);
                                    }),
                                },
                                refreshComponent: () => {
                                    viewModel.selectItem = viewModel.pluginList.find((dd) => {
                                        return dd === viewModel.selectItem;
                                    });
                                    gvc.notifyDataChange(id);
                                    gvc.notifyDataChange(docID);
                                },
                            })}`;
                        },
                        divCreate: {},
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            const dd = viewModel.selectItem;
                            if (!dd) {
                                return html `
                                    <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">插件說明</div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center" >
                                        <div class="alert alert-info m-2 p-2 fw-500" style="white-space: normal;word-break: break-all;font-size:14px;">
                                            頁面模塊決定您能夠在網站上使用哪些設計模塊。<br /><br />您可以從官方或第三方資源中獲取連結，或自行開發插件上傳以供使用。<br /><br />
                                            啟用開發者模式來切換路徑進行工程開發。<br />
                                        </div>
                                    </div>
                                `;
                            }
                            return html `
                                <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    插件設定
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn btn-primary-c me-2"
                                        style="height: 28px;width: 80px;"
                                        onclick="${gvc.event(() => {
                                glitter.share.editorViewModel.appConfig.pagePlugin = viewModel.pluginList;
                                gvc.glitter.htmlGenerate.saveEvent(true);
                            })}"
                                    >
                                        儲存內容
                                    </button>
                                </div>
                                <div class="px-2">
                                    ${[
                                EditorElem.editeInput({
                                    gvc,
                                    title: '自定義模塊名稱',
                                    default: dd.name,
                                    placeHolder: '自定義模塊名稱',
                                    callback: (text) => {
                                        dd.name = text;
                                        gvc.notifyDataChange(vid);
                                    },
                                }),
                                EditorElem.editeInput({
                                    gvc,
                                    title: '模塊路徑',
                                    default: dd.src.official,
                                    placeHolder: '模塊路徑',
                                    callback: (text) => {
                                        dd.src.official = text;
                                    },
                                }),
                                `<div class="alert alert-info mt-2 fw-500 p-2" style="font-size:14px;white-space: normal;">可使用$字符設定相對路徑。<br>範例 : $router/sample.js</div>`,
                            ].join('')}
                                </div>
                            `;
                        },
                        divCreate: {
                            style: `width:300px;min-height:400px;height:400px;`,
                        },
                    };
                }),
            });
        });
    }
    static eventRender(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const og = JSON.parse(JSON.stringify(glitter.share.editorViewModel));
        const viewModel = JSON.parse(JSON.stringify(gvc.glitter.share.editorViewModel));
        viewModel.selectItem = undefined;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        SetGlobalValue.checkFinish = (callback) => {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(viewModel.initialJS) !== JSON.stringify(og.initialJS)) {
                dialog.checkYesOrNot({
                    text: '偵測到變更，是否儲存?',
                    callback: (response) => {
                        if (!response) {
                            callback();
                        }
                        else {
                            glitter.share.editorViewModel.appConfig.eventPlugin = viewModel.initialJS;
                            gvc.glitter.htmlGenerate.saveEvent(true);
                        }
                    },
                });
            }
            else {
                callback();
            }
        };
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    const id = vid;
                    return {
                        bind: id,
                        view: () => {
                            return EditorElem.arrayItem({
                                originalArray: viewModel.initialJS,
                                gvc: gvc,
                                title: '',
                                array: () => {
                                    return viewModel.initialJS.map((dd, index) => {
                                        return {
                                            title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                            innerHtml: () => {
                                                viewModel.selectItem = dd;
                                                gvc.notifyDataChange(docID);
                                            },
                                            expand: dd,
                                            minus: gvc.event(() => {
                                                viewModel.initialJS.splice(index, 1);
                                                gvc.notifyDataChange(id);
                                            }),
                                        };
                                    });
                                },
                                expand: undefined,
                                customEditor: true,
                                plus: {
                                    title: '觸發事件',
                                    event: gvc.event(() => {
                                        viewModel.initialJS.push({
                                            name: '',
                                            route: '',
                                            src: {
                                                official: '',
                                                open: true,
                                            },
                                        });
                                        gvc.notifyDataChange(id);
                                    }),
                                },
                                refreshComponent: () => {
                                    viewModel.selectItem = viewModel.initialJS.find((dd) => {
                                        return dd === viewModel.selectItem;
                                    });
                                    gvc.notifyDataChange(id);
                                },
                            });
                        },
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            const dd = viewModel.selectItem;
                            if (!dd) {
                                return html `
                                    <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        插件說明
                                        <div class="flex-fill"></div>
                                    </div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center" >
                                        <div class="alert alert-info m-2 p-2 fw-500" style="white-space: normal;word-break: break-all;font-size:14px;">
                                            為您的元件添加各樣的觸發事件，包含連結跳轉/內容取得/資料儲存/頁面渲染/動畫事件/內容發布....等，都能透過事件來完成。<br /><br />您可以從官方或第三方資源中獲取連結，或自行開發插件上傳以供使用。<br /><br />
                                            啟用開發者模式來切換路徑進行工程開發。<br />
                                        </div>
                                    </div>
                                `;
                            }
                            return html `
                                <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    插件設定
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn btn-primary-c me-2"
                                        style="height: 28px;width: 80px;"
                                        onclick="${gvc.event(() => {
                                glitter.share.editorViewModel.appConfig.eventPlugin = viewModel.initialJS;
                                gvc.glitter.htmlGenerate.saveEvent(true);
                            })}"
                                    >
                                        儲存內容
                                    </button>
                                </div>
                                <div class="px-2">
                                    ${[
                                EditorElem.editeInput({
                                    gvc,
                                    title: '自定義模塊名稱',
                                    default: dd.name,
                                    placeHolder: '自定義模塊名稱',
                                    callback: (text) => {
                                        dd.name = text;
                                        gvc.notifyDataChange(vid);
                                    },
                                }),
                                EditorElem.editeInput({
                                    gvc,
                                    title: '模塊路徑',
                                    default: dd.src.official,
                                    placeHolder: '模塊路徑',
                                    callback: (text) => {
                                        dd.src.official = text;
                                    },
                                }),
                                `<div class="alert alert-info mt-2 fw-500 p-2" style="font-size:14px;white-space: normal;">可使用$字符設定相對路徑。<br>範例 : $router/sample.js</div>`,
                            ].join('')}
                                </div>
                            `;
                        },
                        divCreate: {
                            style: `width:300px;min-height:400px;height:400px;`,
                        },
                    };
                }),
            });
        });
    }
    static resourceInitial(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const og = JSON.parse(JSON.stringify(gvc.glitter.share.editorViewModel));
        const viewModel = JSON.parse(JSON.stringify(gvc.glitter.share.editorViewModel));
        viewModel.selectItem = undefined;
        SetGlobalValue.checkFinish = (callback) => {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(viewModel.initialList) !== JSON.stringify(og.initialList)) {
                dialog.checkYesOrNot({
                    text: '偵測到變更，是否儲存?',
                    callback: (response) => {
                        if (!response) {
                            callback();
                        }
                        else {
                            glitter.share.editorViewModel.appConfig.initialList = viewModel.initialList;
                            gvc.glitter.htmlGenerate.saveEvent(true);
                        }
                    },
                });
            }
            else {
                callback();
            }
        };
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    const id = vid;
                    return {
                        bind: id,
                        view: () => {
                            return EditorElem.arrayItem({
                                originalArray: viewModel.initialList,
                                gvc: gvc,
                                title: '',
                                array: () => {
                                    return viewModel.initialList.map((dd, index) => {
                                        return {
                                            title: `<span style="color:black;">${dd.name || `區塊:${index}`}</span>`,
                                            innerHtml: () => {
                                                viewModel.selectItem = dd;
                                                gvc.notifyDataChange(docID);
                                            },
                                            expand: dd,
                                            minus: gvc.event(() => {
                                                viewModel.initialList.splice(index, 1);
                                                gvc.notifyDataChange(id);
                                            }),
                                        };
                                    });
                                },
                                expand: undefined,
                                plus: {
                                    title: '添加路徑',
                                    event: gvc.event(() => {
                                        viewModel.initialList.push({
                                            name: '',
                                            src: {
                                                official: '',
                                                staging: '',
                                                open: true,
                                            },
                                        });
                                        gvc.notifyDataChange(id);
                                    }),
                                },
                                refreshComponent: () => {
                                    viewModel.selectItem = viewModel.initialList.find((dd) => {
                                        return dd === viewModel.selectItem;
                                    });
                                    gvc.notifyDataChange(id);
                                },
                                customEditor: true,
                            });
                        },
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            const dd = viewModel.selectItem;
                            if (!dd) {
                                return html `
                                    <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">路徑説明</div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center" >
                                        <div class="alert alert-info m-2 p-2 fw-500" style="white-space: normal;word-break: break-all;font-size:14px;">
                                            設定資源相對路徑，來決定頁面與事件模塊所載入的路徑位置。<br /><br />
                                            使用$字符設定相對路徑。<br />範例 : $router/sample.js
                                        </div>
                                    </div>
                                `;
                            }
                            return html ` <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom  py-2 bgf6" style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    路徑設定
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn btn-primary-c me-2"
                                        style="height: 28px;width: 80px;"
                                        onclick="${gvc.event(() => {
                                glitter.share.editorViewModel.appConfig.initialList = viewModel.initialList;
                                gvc.glitter.htmlGenerate.saveEvent(true);
                            })}"
                                    >
                                        儲存內容
                                    </button>
                                </div>
                                <div class="p-2">
                                    ${[
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '路徑名稱',
                                    placeHolder: `請輸入路徑名稱`,
                                    default: dd.name,
                                    callback: (text) => {
                                        dd.name = text;
                                    },
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '路徑標籤',
                                    placeHolder: `請輸入路徑標籤`,
                                    default: dd.tag,
                                    callback: (text) => {
                                        dd.tag = text;
                                    },
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '正式版路徑',
                                    placeHolder: `請輸入正式版路徑`,
                                    default: dd.official,
                                    callback: (text) => {
                                        dd.official = text;
                                    },
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '開發路徑',
                                    placeHolder: `請輸入開發路徑`,
                                    default: dd.staging,
                                    callback: (text) => {
                                        dd.staging = text;
                                    },
                                }),
                            ].join('')}
                                </div>`;
                        },
                        divCreate: {
                            style: `width:300px;height:600px;`,
                        },
                    };
                }),
            });
        });
    }
}
SetGlobalValue.checkFinish = (callback) => {
    callback();
};
SetGlobalValue.refresh = () => { };
