var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { PageEditor } from "../editor/page-editor.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import { TriggerEvent } from "../glitterBundle/plugins/trigger-event.js";
import { GlobalEvent } from "../glitterBundle/api/global-event.js";
const html = String.raw;
export class BgGlobalEvent {
    static eventEditorView(gvc) {
        return html `
            <div class="d-flex w-100  px-2   hi fw-bold d-flex align-items-center border-bottom bgf6"
                 style="color:#151515;font-size:16px;gap:0px;height:48px;">
                事件編輯
                <div class="flex-fill"></div>
                <button class="btn btn-primary" style="height:28px;width:60px;" onclick="${gvc.event(() => {
            BgGlobalEvent.saveEvent();
        })}">儲存
                </button>
            </div>
            <div class="p-2">${BgGlobalEvent.editor({
            gvc: gvc,
            tag: BgGlobalEvent.selectTag,
            type: (BgGlobalEvent.selectTag) ? "put" : "post"
        })}
            </div>`;
    }
    static mainPage(gvc) {
        const rightID = gvc.glitter.getUUID();
        return `<div class="d-flex w-100">
                <div style="width:300px;" >
                    ${BgGlobalEvent.leftBar(gvc, (tag) => {
            BgGlobalEvent.selectTag = tag;
            gvc.notifyDataChange(rightID);
        })}
                </div>
               <div class="flex-fill">
${gvc.bindView(() => {
            return {
                bind: rightID,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        if (BgGlobalEvent.selectTag !== undefined) {
                            resolve(BgGlobalEvent.eventEditorView(gvc));
                        }
                        else {
                            resolve(html `
                                <div class="d-flex p-2      hi fw-bold d-flex align-items-center border-bottom bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    事件編輯
                                    <div class="flex-fill"></div>
                                </div>
                                <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                     style="height:calc(100% - 48px);">
                                    <lottie-player src="lottie/animation_code.json" class="mx-auto my-n4"
                                                   speed="1"
                                                   style="max-width: 100%;width: 100%;height:300px;" loop
                                                   autoplay></lottie-player>
                                    <h3 class="text-center px-4" style="font-size:18px;">
                                        透過設定事件集，來管理程式碼事件。
                                    </h3>
                                </div>`);
                        }
                    }));
                },
                divCreate: {
                    style: `height:calc(100vh - 120px);overflow-y:auto;`, class: ``
                }
            };
        })}</div>
            </div>`;
    }
    static leftBar(gvc, callback) {
        const vid = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            let res = {};
            function getData() {
                GlobalEvent.getGlobalEvent({}).then((dd) => {
                    res = dd;
                    gvc.notifyDataChange(vid);
                });
            }
            BgGlobalEvent.refresh = () => {
                getData();
            };
            getData();
            return {
                bind: vid,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        if (res.result && res.response.result) {
                            let mapData = [];
                            res.response.result.sort(function (a, b) {
                                var nameA = a.name.toUpperCase();
                                var nameB = b.name.toUpperCase();
                                if (nameA < nameB) {
                                    return -1;
                                }
                                if (nameA > nameB) {
                                    return 1;
                                }
                                return 0;
                            }).map((data, index) => {
                                data.group = data.group || '未分類';
                                if (data.group !== 'glitter-article') {
                                    const folder = data.group.split('/');
                                    let nowFolder = mapData;
                                    folder.map((d2) => {
                                        const selectFD = nowFolder.find((dd) => {
                                            return dd.label === d2;
                                        });
                                        if (!selectFD) {
                                            const fd = {
                                                type: 'container',
                                                label: d2,
                                                tag: gvc.glitter.getUUID(),
                                                data: { setting: [] }
                                            };
                                            nowFolder.push(fd);
                                            nowFolder = fd.data.setting;
                                        }
                                        else {
                                            nowFolder = selectFD.data.setting;
                                        }
                                    });
                                    data.label = data.name;
                                    nowFolder.push(data);
                                }
                            });
                            resolve([html `
                                <div class="d-flex w-100  ps-2   hi fw-bold d-flex align-items-center border-bottom bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    事件集列表
                                    <div class="flex-fill"></div>
                                    <div class="hoverBtn d-flex align-items-center justify-content-center   border ms-auto me-2"
                                         style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                         onclick="${gvc.event(() => {
                                    gvc.glitter.closeDiaLog();
                                    BgGlobalEvent.selectTag = undefined;
                                    EditorElem.openEditorDialog(gvc, (gvc) => {
                                        return BgGlobalEvent.eventEditorView(gvc);
                                    }, () => {
                                        getData();
                                        callback(BgGlobalEvent.selectTag);
                                    }, 400);
                                    callback('');
                                })}">
                                        <i class="fa-regular fa-circle-plus" aria-hidden="true"></i>
                                    </div>
                                </div>

                            `,
                                new PageEditor(gvc, vid, '').renderLineItem(mapData, false, mapData, {
                                    copyType: 'directly',
                                    readonly: true,
                                    selectEvent: (dd) => {
                                        if (!dd) {
                                            BgGlobalEvent.selectTag = undefined;
                                            gvc.notifyDataChange(vid);
                                            callback(undefined);
                                        }
                                        else {
                                            BgGlobalEvent.selectTag = dd.tag;
                                            gvc.notifyDataChange(vid);
                                            callback(dd.tag);
                                        }
                                    },
                                    justFolder: true,
                                    selectEv: (dd) => {
                                        return dd.tag === BgGlobalEvent.selectTag;
                                    }
                                })].join(''));
                        }
                        else {
                            resolve('');
                        }
                    }));
                },
                divCreate: {
                    style: `height:calc(100vh - 120px);overflow-y:auto;`, class: `border-end`
                }
            };
        });
    }
    static editor(obj) {
        const dialog = new ShareDialog(obj.gvc.glitter);
        return obj.gvc.bindView(() => {
            let vm = (obj.type === 'put') ? undefined : {
                data: {
                    tag: '',
                    name: '',
                    json: {
                        group: '',
                        event: {},
                        note: ''
                    }
                }
            };
            const id = obj.gvc.glitter.getUUID();
            if (obj.type === 'put') {
                GlobalEvent.getGlobalEvent({
                    tag: obj.tag
                }).then((dd) => {
                    vm = {
                        data: dd.response.result[0]
                    };
                    obj.gvc.notifyDataChange(id);
                });
            }
            return {
                bind: id,
                view: () => {
                    var _a;
                    BgGlobalEvent.saveEvent = () => {
                        if (!vm.data.tag || !vm.data.name) {
                            dialog.errorMessage({ text: "標題與標籤不得為空!" });
                            return;
                        }
                        dialog.dataLoading({ visible: true });
                        if (obj.type === 'put') {
                            GlobalEvent.putGlobalEvent(vm.data).then((data) => {
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({
                                    text: "儲存成功"
                                });
                            });
                        }
                        else {
                            BgGlobalEvent.selectTag = vm.data.tag;
                            GlobalEvent.addGlobalEvent(vm.data).then((data) => {
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({
                                    text: "儲存成功"
                                });
                                obj.gvc.recreateView();
                            });
                        }
                    };
                    if (!vm) {
                        return ``;
                    }
                    else {
                        return [
                            EditorElem.editeInput({
                                gvc: obj.gvc,
                                title: '事件標題',
                                default: vm.data.name,
                                placeHolder: '請輸入事件標題',
                                callback: (text) => {
                                    vm.data.name = text;
                                }
                            }),
                            EditorElem.editeInput({
                                gvc: obj.gvc,
                                title: '事件標籤',
                                default: vm.data.tag,
                                placeHolder: '唯一值(不可重複)',
                                callback: (text) => {
                                    vm.data.tag = text;
                                }
                            }),
                            EditorElem.editeInput({
                                gvc: obj.gvc,
                                title: '事件分類',
                                default: (_a = vm.data.json.group) !== null && _a !== void 0 ? _a : "",
                                placeHolder: '透過添加/往後延續子分類',
                                callback: (text) => {
                                    vm.data.json.group = text;
                                }
                            }),
                            TriggerEvent.editer(obj.gvc, vm.data.json, vm.data.json, {
                                hover: false,
                                option: [],
                                title: "設定觸發事件"
                            }),
                            EditorElem.editeText({
                                gvc: obj.gvc,
                                title: '事件備註',
                                default: vm.data.json.note,
                                placeHolder: '設定事件備註',
                                callback: (text) => {
                                    vm.data.json.note = text;
                                }
                            }),
                            `<div class="d-flex border-top pt-2">
<div class="flex-fill"></div>
<button class="btn btn-danger ${(obj.type === 'put') ? `` : `d-none`}"  style="height:35px;width:100px;" onclick="${obj.gvc.event(() => {
                                dialog.checkYesOrNot({
                                    callback: (response) => {
                                        if (response) {
                                            dialog.dataLoading({ visible: true });
                                            GlobalEvent.deleteGlobalEvent(vm.data.tag).then((data) => {
                                                dialog.dataLoading({ visible: false });
                                                dialog.successMessage({
                                                    text: "刪除成功"
                                                });
                                                BgGlobalEvent.selectTag = undefined;
                                                BgGlobalEvent.refresh();
                                            });
                                        }
                                    },
                                    text: '是否確認刪除?'
                                });
                            })}">刪除事件</button>
</div>`
                        ].join(`<div class="my-2"></div>`);
                    }
                }
            };
        });
    }
}
BgGlobalEvent.selectTag = undefined;
BgGlobalEvent.saveEvent = () => {
};
BgGlobalEvent.refresh = () => { };
