import {GVC} from "../GVController.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";
import {EditorElem} from "../plugins/editor-elem.js";

enum ViewType {
    mobile,
    desktop,
    def
}

const html = String.raw

export class GlobalWidget {
    public static glitter_view_type=ViewType.def
    public static showCaseBar(gvc: GVC, widget: any, refresh: (data: string) => void) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    GlobalWidget.glitter_view_type = GlobalWidget.glitter_view_type ?? ViewType.def
                    return html`
                        <h3 class="my-auto tx_title me-2" style="white-space: nowrap;font-size: 16px;">元素顯示樣式</h3>
                        <div style="background:#f1f1f1;border-radius:10px;"
                             class="d-flex align-items-center justify-content-center p-1 ">
                            ${[
                                {icon: 'fa-regular fa-border-all', type: ViewType.def, title: '預設樣式'},
                                {icon: 'fa-regular fa-desktop', type: ViewType.desktop, title: '電腦版'},
                                {icon: 'fa-regular fa-mobile', type: ViewType.mobile, title: '手機版'},
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
                                                            refresh(dd.type as any);
                                                            gvc.notifyDataChange(id)
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
                    class: `d-flex align-items-center border-bottom mx-n2 mt-n2 p-2 `, style: ``
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                }
            }
        })
    }

    public static initialShowCaseData(obj:{
        widget:any,
        gvc:GVC
    }){

        ['mobile','desktop'].map((d2)=>{
            obj.widget[d2] = obj.widget[d2] ?? {refer: 'def'};
            if(obj.widget[d2].refer==='custom'){
                obj.widget[d2].data= obj.widget[d2].data ?? JSON.parse(JSON.stringify(obj.widget.data))
                const cp=JSON.parse(JSON.stringify(obj.widget));
                cp['mobile']=undefined;
                cp['desktop']=undefined;
                cp.data=obj.widget[d2].data;
                cp.data.setting=obj.widget.data.setting;
                cp.refer=obj.widget[d2].refer;
                obj.widget[d2]=cp;
                obj.widget[d2].refreshComponent=obj.widget.refreshComponent
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
                obj.widget[d2].editorEvent=obj.widget.editorEvent
                obj.widget[d2].global = obj.widget.global ?? [];
                obj.widget[d2].global.gvc = obj.gvc;
                obj.widget[d2].global.pageConfig = obj.widget.page_config;
                obj.widget[d2].global.appConfig = obj.widget.app_config;
                obj.widget[d2].globalColor = function (key: string, index: number) {
                    return `@{{theme_color.${index}.${key}}}`;
                };
            }else{
                obj.widget[d2]={refer: 'def'}
            }
        })

    }
    public static showCaseEditor(obj: {
        gvc: GVC,
        widget: any,
        view: (widget: any) => string
    }) {
        if (GlobalWidget.glitter_view_type === ViewType.def) {
            return obj.view(obj.widget)
        } else {
            const id = obj.gvc.glitter.getUUID()
            GlobalWidget.initialShowCaseData({widget:obj.widget,gvc:obj.gvc})
            function selector(widget: any) {
                return EditorElem.select({
                    title: '樣式來源',
                    gvc: obj.gvc,
                    def: widget.refer,
                    array: [
                        {title: '參照預設', value: "def"},
                        {title: '自定義', value: "custom"}
                    ],
                    callback: (text) => {
                        widget.refer = text
                        setTimeout(()=>{
                            obj.gvc.notifyDataChange(id)
                        })

                        // obj.widget.refreshComponent()
                    }
                })
            }
            return obj.gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        if (GlobalWidget.glitter_view_type === ViewType.mobile) {
                            const view = [selector(obj.widget.mobile)]
                            if (obj.widget.mobile.refer !== 'def') {
                                view.push(obj.view(obj.widget.mobile))
                            }
                            return view.join('')
                        } else if (GlobalWidget.glitter_view_type === ViewType.desktop) {
                            const view = [selector(obj.widget.desktop)]
                            if (obj.widget.desktop.refer !== 'def') {
                                view.push(obj.view(obj.widget.desktop))
                            }
                            return view.join('')
                        } else {
                            return obj.view(obj.widget)
                        }
                    }
                }
            })
        }
    }

    public static showCaseData(obj: {
        gvc: GVC,
        widget: any,
        view: (widget: any) => string
    }) {
        GlobalWidget.initialShowCaseData({widget:obj.widget,gvc:obj.gvc})
        if(obj.gvc.glitter.document.body.clientWidth<800 && obj.widget.mobile.refer==='custom'){
            return obj.view(obj.widget.mobile)
        }else if(obj.gvc.glitter.document.body.clientWidth>=800 && obj.widget.desktop.refer==='custom'){
            return obj.view(obj.widget.desktop)
        }else{
            return obj.view(obj.widget)
        }
    }
}