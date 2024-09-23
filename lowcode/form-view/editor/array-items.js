var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
const html = String.raw;
export class ArrayItems {
    static main(cf) {
        const gvc = cf.gvc;
        return gvc.bindView(() => {
            var _a, _b;
            cf.widget.bundle = (_a = cf.widget.bundle) !== null && _a !== void 0 ? _a : {};
            cf.formData[cf.key] = cf.formData[cf.key] || [];
            cf.widget.bundle.form_config = (_b = cf.widget.bundle.form_config) !== null && _b !== void 0 ? _b : {};
            const widget = cf.widget;
            const id = gvc.glitter.getUUID();
            const parId = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    let viewArray = [];
                    viewArray.push(gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return (cf.formData[cf.key] || []).map((dd, index) => {
                                    return `<li onclick="${gvc.event(() => {
                                    })}">
                                                                    <div class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1" style="gap:5px;color:#393939;" >
                                                                        <div class=" p-1 dragItem " >
                                                                            <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  " style="width:15px;height:15px;" aria-hidden="true"></i>
                                                                        </div>
                                                                        <span style="text-overflow: ellipsis;max-width: calc(100% - 100px);overflow: hidden;white-space: nowrap;">${dd[widget.bundle.form_config.refer_title] || `選項 ${index + 1}`}</span>
                                                                        <div class="flex-fill"></div>
                                                                      
                                                                        <div class="hoverBtn p-1 child" onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.checkYesOrNot({
                                            text: '是否確認刪除?',
                                            callback: (b) => {
                                                if (b) {
                                                    cf.formData[cf.key].splice(index, 1);
                                                    cf.callback({});
                                                    gvc.notifyDataChange(id);
                                                }
                                            }
                                        });
                                    })}">
                                                                            <i class="fa-regular fa-trash d-flex align-items-center justify-content-center " aria-hidden="true"></i>
                                                                        </div>
                                                                          <div class="hoverBtn p-1 child " onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        const edit_data = dd;
                                        const gvc_ref = (gvc.glitter.getUrlParameter('cms') !== 'true') ? gvc : window.parent.glitter.pageConfig[0].gvc;
                                        const pageEditor = (gvc.glitter.getUrlParameter('cms') === 'true') ? window.parent.glitter.share.NormalPageEditor : NormalPageEditor;
                                        pageEditor.toggle({
                                            visible: true,
                                            view: gvc_ref.bindView(() => {
                                                const gvc = gvc_ref;
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => __awaiter(this, void 0, void 0, function* () {
                                                        let view = [];
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.dataLoading({ visible: true });
                                                        view.push(yield new Promise((resolve, reject) => {
                                                            gvc.glitter.getModule(new URL('./official_view_component/official/form.js', location.href).href, (res) => {
                                                                resolve(res.editorView({
                                                                    gvc: gvc,
                                                                    array: widget.bundle.form_config['form_array'] || [],
                                                                    formData: edit_data,
                                                                    refresh: (widget.bundle.refresh && widget.bundle.refresh) || (() => {
                                                                        widget.refreshComponent();
                                                                    })
                                                                }));
                                                            });
                                                        }));
                                                        dialog.dataLoading({ visible: false });
                                                        return view.join('');
                                                    })
                                                };
                                            }),
                                            title: edit_data[widget.bundle.form_config.refer_title] || `選項 ${index + 1}`
                                        });
                                    })}">
                                                                            <i class="fa-solid fa-pencil"></i>
                                                                               </div>
                                                                    </div>
                                                                </li>`;
                                }).join('');
                            },
                            divCreate: {
                                class: `mx-n2`, elem: 'ul', option: [{ key: 'id', value: parId }],
                            },
                            onCreate: () => {
                                gvc.glitter.addMtScript([
                                    {
                                        src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                    },
                                ], () => {
                                    const interval = setInterval(() => {
                                        if (window.Sortable) {
                                            try {
                                                gvc.addStyle(`
                                    ul {
                                        list-style: none;
                                        padding: 0;
                                    }
                                `);
                                                function swapArr(arr, index1, index2) {
                                                    const data = arr[index1];
                                                    arr.splice(index1, 1);
                                                    arr.splice(index2, 0, data);
                                                }
                                                let startIndex = 0;
                                                Sortable.create(gvc.glitter.document.getElementById(parId), {
                                                    handle: '.dragItem',
                                                    group: gvc.glitter.getUUID(),
                                                    animation: 100,
                                                    onChange: function (evt) {
                                                        swapArr(cf.formData[cf.key], startIndex, evt.newIndex);
                                                        startIndex = evt.newIndex;
                                                    },
                                                    onEnd: (evt) => {
                                                        cf.callback(cf.formData[cf.key]);
                                                        gvc.notifyDataChange(id);
                                                    },
                                                    onStart: function (evt) {
                                                        startIndex = evt.oldIndex;
                                                    },
                                                });
                                            }
                                            catch (e) { }
                                            clearInterval(interval);
                                        }
                                    }, 100);
                                }, () => { });
                            }
                        };
                    }));
                    viewArray.push(`<div class="w-100" style="justify-content: center; align-items: center; gap: 4px; display: flex;color: #3366BB;cursor: pointer;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
onclick="${gvc.event(() => {
                        cf.formData[cf.key].push({});
                        cf.callback(cf.formData[cf.key]);
                        cf.gvc.notifyDataChange(id);
                    })}">
                        <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">${cf.widget.bundle.form_config['plus_title'] || '新增選項'}</div>
                        <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    </div>`);
                    return viewArray.join('<div class="my-2"></div>');
                },
                divCreate: {
                    class: 'py-2',
                    style: ``
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, ArrayItems);
