import { EditorElem } from '../plugins/editor-elem.js';
import { Storage } from '../helper/storage.js';
var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
    ViewType["def"] = "def";
})(ViewType || (ViewType = {}));
const html = String.raw;
export class GlobalWidget {
    constructor() { }
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
                    return html ` <h3 class="my-auto tx_title me-2 ms-2" style="white-space: nowrap;font-size: 16px;">元件顯示樣式</h3>
                        <div style="background:#f1f1f1;border-radius:10px;" class="d-flex align-items-center justify-content-center p-1 ">
                            ${[
                        { icon: 'fa-regular fa-border-all', type: 'def', title: '預設樣式' },
                        { icon: 'fa-regular fa-desktop', type: 'desktop', title: '電腦版' },
                        { icon: 'fa-regular fa-mobile', type: 'mobile', title: '手機版' },
                    ]
                        .map((dd) => {
                        if (dd.type === GlobalWidget.glitter_view_type) {
                            return html ` <div
                                            class="d-flex align-items-center justify-content-center bg-white"
                                            style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            data-bs-custom-class="custom-tooltip"
                                            data-bs-title="${dd.title}"
                                        >
                                            <i class="${dd.icon}"></i>
                                        </div>`;
                        }
                        else {
                            return html ` <div
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
                                gvc.notifyDataChange(['docs-container', id]);
                            })}"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
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
                    class: `d-flex align-items-center border-bottom mx-n2 mt-n2 p-2 `,
                    style: ``,
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                },
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
                !obj.widget[d2].formData &&
                    Object.defineProperty(obj.widget[d2], 'formData', {
                        get: function () {
                            return obj.widget.formData;
                        },
                    });
                !obj.widget[d2].storage &&
                    Object.defineProperty(obj.widget[d2], 'storage', {
                        get: function () {
                            return obj.widget.storage;
                        },
                        set(v) {
                            obj.widget.storage = v;
                        },
                    });
                !obj.widget[d2].share &&
                    Object.defineProperty(obj.widget[d2], 'share', {
                        get: function () {
                            return obj.widget.share;
                        },
                        set(v) {
                            obj.widget.share = v;
                        },
                    });
                !obj.widget[d2].bundle &&
                    Object.defineProperty(obj.widget[d2], 'bundle', {
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
        return html ` <div class="form-check form-switch m-0" style="margin-top: 10px; cursor: pointer;">
            <input
                class="form-check-input"
                type="checkbox"
                onchange="${gvc.event((e) => {
            callback(e.checked);
        })}"
                ${def ? `checked` : ``}
            />
        </div>`;
    }
    static showCaseEditor(obj) {
        if (['mobile', 'desktop'].includes(obj.gvc.glitter.getCookieByName('ViewType')) && GlobalWidget.glitter_view_type !== 'def') {
            GlobalWidget.glitter_view_type = obj.gvc.glitter.getCookieByName('ViewType');
        }
        if (GlobalWidget.glitter_view_type === 'def') {
            return obj.view(obj.widget, 'def');
        }
        else {
            const id = obj.gvc.glitter.getUUID();
            const gvc = obj.gvc;
            GlobalWidget.initialShowCaseData({ widget: obj.widget, gvc: obj.gvc });
            function selector(widget, key) {
                return html ` <div class=" mx-n2" style="padding: 18px 18px 10px;">
                    ${[
                    obj.gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return `<h3 class="my-auto tx_title fw-normal" style="white-space: nowrap;font-size: 16px;">在${(() => {
                                    if (GlobalWidget.glitter_view_type === 'mobile') {
                                        return `手機`;
                                    }
                                    else {
                                        return `電腦`;
                                    }
                                })()}版上${obj.widget[key].refer === 'hide' ? `不` : ``}顯示</h3>
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
                                class: `d-flex align-content-center`,
                                style: `gap:10px;`,
                            },
                        };
                    }),
                ]
                    .concat((() => {
                    if (obj.widget[key].refer === 'hide') {
                        return [];
                    }
                    else {
                        if (obj.custom_edit) {
                            return [];
                        }
                        else {
                            return [
                                `<div class="fw-bold" style="font-size: 16px;">顯示樣式</div>`,
                                EditorElem.select({
                                    title: '',
                                    gvc: obj.gvc,
                                    def: widget.refer || 'def',
                                    array: [
                                        { title: '預設樣式', value: 'def' },
                                        { title: '自定義', value: 'custom' },
                                    ],
                                    callback: (text) => {
                                        obj.widget[key].refer = text;
                                        if (obj.widget.refreshComponent) {
                                            obj.widget.refreshComponent();
                                        }
                                        else if (obj.widget.refreshAll) {
                                            obj.widget.refreshAll();
                                        }
                                    },
                                }),
                            ];
                        }
                    }
                })())
                    .join('<div class="my-3"></div>')}
                </div>`;
            }
            return obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        const view = (() => {
                            try {
                                if (GlobalWidget.glitter_view_type === 'mobile') {
                                    const view = [selector(obj.widget.mobile, 'mobile')];
                                    if (obj.widget.mobile.refer === 'custom') {
                                        view.push(obj.view(obj.widget.mobile, 'mobile'));
                                    }
                                    return view.join('');
                                }
                                else if (GlobalWidget.glitter_view_type === 'desktop') {
                                    const view = [selector(obj.widget.desktop, 'desktop')];
                                    if (obj.widget.desktop.refer === 'custom') {
                                        view.push(obj.view(obj.widget.desktop, 'desktop'));
                                    }
                                    return view.join('');
                                }
                                else {
                                    return obj.view(obj.widget, 'deg');
                                }
                            }
                            catch (e) {
                                console.log(e);
                                return `${e}`;
                            }
                        })();
                        return [view].join('');
                    },
                };
            });
        }
    }
    static showCaseData(obj) {
        GlobalWidget.initialShowCaseData({ widget: obj.widget, gvc: obj.gvc });
        if (obj.gvc.glitter.document.body.clientWidth < 768 && obj.widget.mobile.refer === 'hide') {
            return ``;
        }
        else if (obj.gvc.glitter.document.body.clientWidth >= 800 && obj.widget.desktop.refer === 'hide') {
            return ``;
        }
        else if (obj.gvc.glitter.document.body.clientWidth < 768 && obj.widget.mobile.refer === 'custom') {
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
