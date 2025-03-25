import { Storage } from "../helper/storage.js";
var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
    ViewType["def"] = "def";
})(ViewType || (ViewType = {}));
const html = String.raw;
export class GlobalWidget {
    constructor() {
    }
    static showCaseBar(gvc, widget, refresh) {
        if (['mobile', 'desktop'].includes(gvc.glitter.getCookieByName('ViewType')) && GlobalWidget.glitter_view_type !== 'def') {
            GlobalWidget.glitter_view_type = gvc.glitter.getCookieByName('ViewType');
        }
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a;
                    GlobalWidget.glitter_view_type = (_a = GlobalWidget.glitter_view_type) !== null && _a !== void 0 ? _a : 'def';
                    return html `
                        <h3 class="my-auto tx_title me-2 ms-2 " style="white-space: nowrap;font-size: 16px;">
                            元件顯示樣式</h3>
                        <div style="background:#f1f1f1;border-radius:10px;"
                             class="d-flex align-items-center justify-content-center p-1 ">
                            ${[
                        {
                            icon: 'fa-regular fa-border-all guide-user-editor-5-back',
                            type: 'def',
                            title: '預設樣式'
                        },
                        { icon: 'fa-regular fa-desktop', type: "desktop", title: '電腦版' },
                        { icon: 'fa-regular fa-mobile guide-user-editor-5', type: "mobile", title: '手機版' },
                    ].map((dd) => {
                        if (dd.type === GlobalWidget.glitter_view_type) {
                            return html `
                                        <div
                                                class="d-flex align-items-center justify-content-center bg-white"
                                                style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="${dd.title}">
                                            <i class="${dd.icon}"></i>
                                        </div>`;
                        }
                        else {
                            return html `
                                        <div
                                                class="d-flex align-items-center justify-content-center"
                                                style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                onclick="${gvc.event(() => {
                                GlobalWidget.glitter_view_type = dd.type;
                                if (dd.type !== 'def') {
                                    Storage.view_type = dd.type;
                                }
                                else {
                                    Storage.view_type = 'desktop';
                                }
                                refresh(dd.type);
                                gvc.glitter.share.loading_dialog.dataLoading({
                                    text: '模組加載中...',
                                    visible: true
                                });
                                gvc.notifyDataChange(['docs-container', id]);
                            })}"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="${dd.title}"
                                        >
                                            <i class="${dd.icon}"></i>
                                        </div>`;
                        }
                    })
                        .join('')}
                        </div>`;
                },
                divCreate: {
                    class: `${(gvc.glitter.getUrlParameter('device') === 'mobile') ? `d-none ` : `d-flex`} align-items-center border-bottom mx-n2 mt-n2 p-2 guide-user-editor-4`,
                    style: ``
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }
            };
        });
    }
    static initialShowCaseData(obj) {
        ['mobile', 'desktop'].map((d2) => {
            var _a, _b, _c;
            obj.widget[d2] = (_a = obj.widget[d2]) !== null && _a !== void 0 ? _a : { refer: 'def' };
            if (obj.widget[d2].refer === 'custom') {
                obj.widget[d2].data = (_b = obj.widget[d2].data) !== null && _b !== void 0 ? _b : JSON.parse(JSON.stringify(obj.widget.data));
                const cp = JSON.parse(JSON.stringify(obj.widget));
                cp['mobile'] = undefined;
                cp['desktop'] = undefined;
                cp.data = obj.widget[d2].data;
                cp.data.setting = obj.widget.data.setting;
                cp.refer = obj.widget[d2].refer;
                obj.widget[d2] = cp;
                obj.widget[d2].refreshComponent = obj.widget.refreshComponent;
                delete obj.widget[d2].formData;
                delete obj.widget[d2].storage;
                delete obj.widget[d2].share;
                delete obj.widget[d2].bundle;
                (!obj.widget[d2].formData) && Object.defineProperty(obj.widget[d2], 'formData', {
                    get: function () {
                        return obj.widget.formData;
                    }
                });
                (!obj.widget[d2].storage) && Object.defineProperty(obj.widget[d2], 'storage', {
                    get: function () {
                        return obj.widget.storage;
                    },
                    set(v) {
                        obj.widget.storage = v;
                    },
                });
                (!obj.widget[d2].share) && Object.defineProperty(obj.widget[d2], 'share', {
                    get: function () {
                        return obj.widget.share;
                    },
                    set(v) {
                        obj.widget.share = v;
                    },
                });
                (!obj.widget[d2].bundle) && Object.defineProperty(obj.widget[d2], 'bundle', {
                    get: function () {
                        return obj.widget.bundle;
                    },
                    set(v) {
                        obj.widget.bundle = v;
                    },
                });
                obj.widget[d2].editorEvent = obj.widget.editorEvent;
                obj.widget[d2].global = (_c = obj.widget.global) !== null && _c !== void 0 ? _c : [];
                obj.widget[d2].global.gvc = obj.gvc;
                obj.widget[d2].global.pageConfig = obj.widget.page_config;
                obj.widget[d2].global.appConfig = obj.widget.app_config;
                obj.widget[d2].globalColor = function (key, index) {
                    return `@{{theme_color.${index}.${key}}}`;
                };
            }
            else if (obj.widget[d2].refer === 'hide') {
                obj.widget[d2] = { refer: 'hide' };
            }
            else {
                obj.widget[d2] = { refer: obj.widget[d2].refer };
            }
        });
    }
    static switchButton(gvc, def, callback) {
        return html `
            <div class="form-check form-switch d-flex align-items-center my-0" style=" cursor: pointer;">
                <input
                        class="form-check-input"
                        type="checkbox"
                        onchange="${gvc.event((e) => {
            callback(e.checked);
        })}"
                        style="height:17px;width:30px;"
                        ${def ? `checked` : ``}
                />
            </div>`;
    }
    static showCaseEditor(obj) {
        GlobalWidget.glitter_view_type = ViewType.desktop;
        if (Storage.view_type === 'mobile') {
            GlobalWidget.glitter_view_type = ViewType.mobile;
        }
        if (['mobile', 'desktop'].includes(obj.gvc.glitter.getCookieByName('ViewType')) && GlobalWidget.glitter_view_type !== 'def') {
            GlobalWidget.glitter_view_type = obj.gvc.glitter.getCookieByName('ViewType');
        }
        if ((GlobalWidget.glitter_view_type === 'def') || (obj.gvc.glitter.getUrlParameter('device') === 'mobile')) {
            return obj.view(obj.widget, 'def');
        }
        else {
            const id = obj.gvc.glitter.getUUID();
            const gvc = obj.gvc;
            GlobalWidget.initialShowCaseData({ widget: obj.widget, gvc: obj.gvc });
            let select_bt = 'form_editor';
            function ai_switch() {
                return `<div class="d-flex align-items-center  shadow border-bottom mt-n2"
                                                     style="">
                                                    ${(() => {
                    const list = [
                        {
                            key: 'form_editor',
                            label: `元件設計`,
                            icon: `fa-regular fa-pencil`
                        },
                        {
                            key: 'ai_editor',
                            label: 'AI 設計',
                            icon: `fa-regular fa-wand-magic-sparkles`
                        }
                    ];
                    return list
                        .map((dd) => {
                        if (select_bt === dd.key) {
                            return html `
                                    <div class="d-flex align-items-center justify-content-center fw-bold px-2 py-2 fw-500 select-label-ai-message_ fs-6"
                                         style="gap:5px;">
                                        <i class="${dd.icon} "></i>${dd.label}
                                    </div>`;
                        }
                        else {
                            return html `
                                    <div class="d-flex align-items-center justify-content-center fw-bold  px-2 py-2 fw-500 select-btn-ai-message_ fs-6"
                                         style="gap:5px;"
                                         onclick="${gvc.event(() => {
                                select_bt = dd.key;
                                gvc.notifyDataChange(id);
                            })}"
                                    >
                                        <i class="${dd.icon}"></i>${dd.label}
                                    </div>`;
                        }
                    })
                        .join(`<div class="border-end" style="width:1px;height:39px;"></div>`);
                })()}
                                                </div>`;
            }
            function selector(widget, key) {
                if (obj.hide_selector) {
                    return ``;
                }
                return html `
                    <div class=" mx-n2"
                         style="">${[
                    ...(() => {
                        if (obj.hide_ai) {
                            return [];
                        }
                        else {
                            return [ai_switch()];
                        }
                    })(),
                    obj.gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return html `
                                                <div class="my-auto tx_title fw-normal d-flex align-items-center"
                                                     style="white-space: nowrap;font-size: 16px;">在${(() => {
                                    if (GlobalWidget.glitter_view_type === "mobile") {
                                        return `手機`;
                                    }
                                    else {
                                        return `電腦`;
                                    }
                                })()}版上${(obj.widget[key].refer === 'hide') ? `不` : ``}顯示
                                                </div>
                                                ${GlobalWidget.switchButton(obj.gvc, obj.widget[key].refer !== 'hide', (bool) => {
                                    if (bool) {
                                        obj.widget[key].refer = 'def';
                                    }
                                    else {
                                        obj.widget[key].refer = 'hide';
                                    }
                                    obj.toggle_visible && obj.toggle_visible(bool);
                                    gvc.notifyDataChange(id);
                                    setTimeout(() => {
                                        obj.widget.refreshComponent();
                                    }, 250);
                                })}`;
                            },
                            divCreate: {
                                class: `d-flex align-content-center px-3`,
                                style: `gap:10px;margin-bottom:18px;margin-top:13px;`
                            }
                        };
                    })
                ].concat((() => {
                    if (obj.widget[key].refer === 'hide') {
                        return [];
                    }
                    else {
                        if (obj.custom_edit) {
                            return [];
                        }
                        else {
                            return [(obj.gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return `<div class="my-auto tx_title fw-normal d-flex align-items-center" style="white-space: nowrap;font-size: 16px;">顯示獨立樣式</div>
${GlobalWidget.switchButton(obj.gvc, obj.widget[key].refer === 'custom', (bool) => {
                                                obj.widget[key].refer = (bool) ? `custom` : `def`;
                                                if (obj.widget.refreshComponent) {
                                                    obj.widget.refreshComponent();
                                                }
                                                else if (obj.widget.refreshAll) {
                                                    obj.widget.refreshAll();
                                                }
                                            })}`;
                                        },
                                        divCreate: {
                                            class: `d-flex align-content-center px-3`,
                                            style: `gap:10px;margin-top:13px;`
                                        }
                                    };
                                }) + `<div class="px-3 pt-2" style="white-space: normal;word-break: break-all;color: #8D8D8D; font-size: 14px; font-weight: 400; ">透過設定獨立樣式在${(() => {
                                    if (GlobalWidget.glitter_view_type === "mobile") {
                                        return `手機`;
                                    }
                                    else {
                                        return `電腦`;
                                    }
                                })()}版上顯示特定設計效果</div>`), `<div class="mx-n3" style="background: #DDD;height: 1px;"></div>`].join(`<div style="height:18px;"></div>`);
                        }
                    }
                })()).join('<div class="my-3"></div>')}
                    </div>`;
            }
            return obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        if (select_bt === 'ai_editor') {
                            return new Promise((resolve, reject) => {
                                gvc.glitter.getModule(gvc.glitter.root_path + 'cms-plugin/ai-generator/editor-ai.js', (EditorAi) => {
                                    resolve([`<div class="mx-n2">${ai_switch()}</div>`, EditorAi.view(gvc)].join(''));
                                });
                            });
                        }
                        const view = (() => {
                            try {
                                if (GlobalWidget.glitter_view_type === 'mobile') {
                                    const view = [selector(obj.widget.mobile, 'mobile')];
                                    if (obj.widget.mobile.refer === 'custom') {
                                        view.push(obj.view(obj.widget.mobile, 'mobile'));
                                    }
                                    else {
                                        view.push(obj.view(obj.widget, 'def'));
                                    }
                                    return view.join('');
                                }
                                else if (GlobalWidget.glitter_view_type === 'desktop') {
                                    const view = [selector(obj.widget.desktop, 'desktop')];
                                    if (obj.widget.desktop.refer === 'custom') {
                                        view.push(obj.view(obj.widget.desktop, 'desktop'));
                                    }
                                    else {
                                        view.push(obj.view(obj.widget, 'def'));
                                    }
                                    return view.join('');
                                }
                                else {
                                    return obj.view(obj.widget, 'def');
                                }
                            }
                            catch (e) {
                                console.log(e);
                                return `${e}`;
                            }
                        })();
                        return [view].join('');
                    }
                };
            });
        }
    }
    static showCaseData(obj) {
        GlobalWidget.initialShowCaseData({ widget: obj.widget, gvc: obj.gvc });
        if (obj.gvc.glitter.document.body.clientWidth < 800 && obj.widget.mobile.refer === 'hide') {
            return obj.empty || '';
        }
        else if (obj.gvc.glitter.document.body.clientWidth >= 800 && obj.widget.desktop.refer === 'hide') {
            return obj.empty || '';
        }
        else if (obj.gvc.glitter.document.body.clientWidth < 800 && obj.widget.mobile.refer === 'custom') {
            return obj.view(obj.widget.mobile);
        }
        else if (obj.gvc.glitter.document.body.clientWidth >= 800 && obj.widget.desktop.refer === 'custom') {
            return obj.view(obj.widget.desktop);
        }
        else {
            return obj.view(obj.widget);
        }
    }
}
GlobalWidget.glitter_view_type = 'def';
