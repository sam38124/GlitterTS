import {GVC} from "../GVController.js";
import {EditorElem} from "../plugins/editor-elem.js";
import {Storage} from "../helper/storage.js";

enum ViewType {
    mobile = 'mobile',
    desktop = 'desktop',
    def = 'def'
}

const html = String.raw

export class GlobalWidget {
    constructor() {
    }

    public static glitter_view_type = 'def'

    public static showCaseBar(gvc: GVC, widget: any, refresh: (data: string) => void) {
        if (['mobile', 'desktop'].includes(gvc.glitter.getCookieByName('ViewType')) && GlobalWidget.glitter_view_type !== 'def') {
            GlobalWidget.glitter_view_type = gvc.glitter.getCookieByName('ViewType')
        }
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    GlobalWidget.glitter_view_type = GlobalWidget.glitter_view_type ?? 'def'
                    return html`
                        <h3 class="my-auto tx_title me-2 ms-2 " style="white-space: nowrap;font-size: 16px;">
                            元件顯示樣式</h3>
                        <div style="background:#f1f1f1;border-radius:10px;"
                             class="d-flex align-items-center justify-content-center p-1 ">
                            ${[
                                {icon: 'fa-regular fa-border-all guide-user-editor-5-back', type: 'def', title: '預設樣式'},
                                {icon: 'fa-regular fa-desktop', type: "desktop", title: '電腦版'},
                                {icon: 'fa-regular fa-mobile guide-user-editor-5', type: "mobile", title: '手機版'},
                            ].map((dd) => {
                                if (dd.type === GlobalWidget.glitter_view_type) {
                                    return html`
                                        <div
                                                class="d-flex align-items-center justify-content-center bg-white"
                                                style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="${dd.title}">
                                            <i class="${dd.icon}"></i>
                                        </div>`;
                                } else {
                                    return html`
                                        <div
                                                class="d-flex align-items-center justify-content-center"
                                                style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                onclick="${gvc.event(() => {
                                                    GlobalWidget.glitter_view_type = dd.type;
                                                    if (dd.type !== 'def') {
                                                        Storage.view_type = dd.type as any
                                                    } else {
                                                        Storage.view_type = 'desktop'
                                                    }
                                                    refresh(dd.type as any);
                                                    gvc.glitter.share.loading_dialog.dataLoading({text:'模組加載中...',visible:true})
                                                    gvc.notifyDataChange(['docs-container', id])
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
                        </div>`
                },
                divCreate: {
                    class: `${(gvc.glitter.getUrlParameter('device')==='mobile') ? `d-none`:`d-flex`} align-items-center border-bottom mx-n2 mt-n2 p-2 guide-user-editor-4`, style: ``
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                }
            }
        })
    }

    public static initialShowCaseData(obj: {
        widget: any,
        gvc: GVC
    }) {

        ['mobile', 'desktop'].map((d2) => {
            obj.widget[d2] = obj.widget[d2] ?? {refer: 'def'};
            if (obj.widget[d2].refer === 'custom') {
                obj.widget[d2].data = obj.widget[d2].data ?? JSON.parse(JSON.stringify(obj.widget.data))
                const cp = JSON.parse(JSON.stringify(obj.widget));
                cp['mobile'] = undefined;
                cp['desktop'] = undefined;
                cp.data = obj.widget[d2].data;
                cp.data.setting = obj.widget.data.setting;
                cp.refer = obj.widget[d2].refer;
                obj.widget[d2] = cp;
                obj.widget[d2].refreshComponent = obj.widget.refreshComponent
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
                obj.widget[d2].editorEvent = obj.widget.editorEvent
                obj.widget[d2].global = obj.widget.global ?? [];
                obj.widget[d2].global.gvc = obj.gvc;
                obj.widget[d2].global.pageConfig = obj.widget.page_config;
                obj.widget[d2].global.appConfig = obj.widget.app_config;
                obj.widget[d2].globalColor = function (key: string, index: number) {
                    return `@{{theme_color.${index}.${key}}}`;
                };
            } else if (obj.widget[d2].refer === 'hide') {
                obj.widget[d2] = {refer: 'hide'}
            } else {
                obj.widget[d2] = {refer: obj.widget[d2].refer}
            }
        })

    }

    public static switchButton(gvc: GVC, def: boolean, callback: (value: boolean) => void) {
        return html`
            <div class="form-check form-switch m-0" style="margin-top: 10px; cursor: pointer;">
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

    public static showCaseEditor(obj: {
        gvc: GVC,
        widget: any,
        view: (widget: any, type: any) => string,
        custom_edit?: boolean,
        toggle_visible?: (result: boolean) => void,
        hide_selector?:boolean
    }) {
        if (['mobile', 'desktop'].includes(obj.gvc.glitter.getCookieByName('ViewType')) && GlobalWidget.glitter_view_type !== 'def') {
            GlobalWidget.glitter_view_type = obj.gvc.glitter.getCookieByName('ViewType')
        }

        if ((GlobalWidget.glitter_view_type === 'def') || (obj.gvc.glitter.getUrlParameter('device')==='mobile')) {
            return obj.view(obj.widget, 'def')
        } else {
            const id = obj.gvc.glitter.getUUID()
            const gvc = obj.gvc;
            GlobalWidget.initialShowCaseData({widget: obj.widget, gvc: obj.gvc})

            function selector(widget: any, key: string) {
                if(obj.hide_selector){
                    return  ``
                }
                return html`
                    <div class=" mx-n2"
                         style="padding: 18px 18px 10px;">${
                    [
                        obj.gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            return {
                                bind: id,
                                view: () => {
                                    return `<h3 class="my-auto tx_title fw-normal" style="white-space: nowrap;font-size: 16px;">在${(() => {
                                        if (GlobalWidget.glitter_view_type === "mobile") {
                                            return `手機`
                                        } else {
                                            return `電腦`
                                        }
                                    })()}版上${(obj.widget[key].refer === 'hide') ? `不` : ``}顯示</h3>
${GlobalWidget.switchButton(obj.gvc, obj.widget[key].refer !== 'hide', (bool) => {
                                        // vm.data.main = bool;
                                        if (bool) {
                                            obj.widget[key].refer = 'def'
                                        } else {
                                            obj.widget[key].refer = 'hide'
                                        }
                                        obj.toggle_visible && obj.toggle_visible(bool);
                                        gvc.notifyDataChange(id)
                                        setTimeout(() => {
                                            obj.widget.refreshComponent()
                                        }, 250)
                                    })}`
                                },
                                divCreate: {
                                    class: `d-flex align-content-center`, style: `gap:10px;`
                                }
                            }
                        })
                    ].concat((() => {
                        if (obj.widget[key].refer === 'hide') {
                            return []
                        } else {
                            if (obj.custom_edit) {
                                return []
                            } else {
                                return [
                                    `<div class="fw-bold" style="font-size: 16px;">顯示樣式</div>`,
                                    EditorElem.select({
                                        title: '',
                                        gvc: obj.gvc,
                                        def: widget.refer || 'def',
                                        array: [
                                            {title: '預設樣式', value: "def"},
                                            {title: '自定義', value: "custom"}
                                        ],
                                        callback: (text) => {
                                            obj.widget[key].refer = text;
                                            // obj.gvc.notifyDataChange(id)
                                            if (obj.widget.refreshComponent) {
                                                obj.widget.refreshComponent()
                                            } else if (obj.widget.refreshAll) {
                                                obj.widget.refreshAll()
                                            }
                                        }
                                    })
                                ]
                            }


                        }
                    })()).join('<div class="my-3"></div>')
                }
                    </div>`
            }

            return obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        const view = (() => {
                            try {
                                if (GlobalWidget.glitter_view_type === 'mobile') {
                                    const view = [selector(obj.widget.mobile, 'mobile')]
                                    if (obj.widget.mobile.refer === 'custom') {
                                        view.push(obj.view(obj.widget.mobile, 'mobile'))
                                    }
                                    return view.join('')
                                } else if (GlobalWidget.glitter_view_type === 'desktop') {
                                    const view = [selector(obj.widget.desktop, 'desktop')]
                                    if (obj.widget.desktop.refer === 'custom') {
                                        view.push(obj.view(obj.widget.desktop, 'desktop'))
                                    }
                                    return view.join('')
                                } else {
                                    return obj.view(obj.widget, 'deg')
                                }
                            } catch (e) {
                                console.log(e)
                                return `${e}`
                            }
                        })()
                        return [view].join('')
                    }
                }
            })
        }
    }

    public static showCaseData(obj: {
        gvc: GVC,
        widget: any,
        empty?:string
        view: (widget: any) => string
    }) {
        GlobalWidget.initialShowCaseData({widget: obj.widget, gvc: obj.gvc})
        if (obj.gvc.glitter.document.body.clientWidth < 800 && obj.widget.mobile.refer === 'hide') {
            return obj.empty || ''
        } else if (obj.gvc.glitter.document.body.clientWidth >= 800 && obj.widget.desktop.refer === 'hide') {
            return obj.empty || ''
        } else if (obj.gvc.glitter.document.body.clientWidth < 800 && obj.widget.mobile.refer === 'custom') {
            return obj.view(obj.widget.mobile)
        } else if (obj.gvc.glitter.document.body.clientWidth >= 800 && obj.widget.desktop.refer === 'custom') {
            return obj.view(obj.widget.desktop)
        } else {
            return obj.view(obj.widget)
        }
    }
}