import {init} from '../glitterBundle/GVController.js';
import {ApiPageConfig} from "../api/pageConfig.js";
import {ShareDialog} from "./ShareDialog.js";
import {config} from "../config.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const tdata: {
                "appName": string,
                "tag": string,
                "group"?: string,
                "name"?: string,
                "config"?: [],
                "page_config"?: any,
                "copy"?: string,
            } = {
                "appName": config.appName,
                "tag": "",
                "group": "",
                "name": "",
                "config": []
            }
            let addType = 'manual'
            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);" >
            <div class="m-auto rounded shadow bg-white" style="max-width: 100%;max-height: 100%;width: 360px;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4" >添加頁面</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                glitter.closeDiaLog();
            })}"></i>
</div>    
<div class="py-2 px-3">
${gvc.bindView(() => {
                const id = glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return gvc.map([
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: '頁面標籤',
                                default: "",
                                placeHolder: "請輸入頁面標籤[不得重複]",
                                callback: (text) => {
                                    tdata.tag = text
                                }
                            }),
                            glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: '頁面名稱',
                                default: "",
                                placeHolder: "請輸入頁面名稱",
                                callback: (text) => {
                                    tdata.name = text
                                }
                            }),
                            EditorElem.searchInput({
                                title: "頁面分類",
                                gvc: gvc,
                                def: "",
                                array: (() => {
                                    let group: string[] = []
                                    gBundle.vm.dataList.map((dd: any) => {
                                        if (group.indexOf(dd.group) === -1) {
                                            group.push(dd.group)
                                        }
                                    });
                                    return group
                                })(),
                                callback: (text: string) => {
                                    tdata.group = text
                                },
                                placeHolder: "請輸入頁面分類"
                            }),
                            EditorElem.select({
                                title: "[可選]：複製頁面內容",
                                gvc: gvc,
                                def: tdata.copy ?? "",
                                array: [
                                    {
                                        title: '選擇複製頁面內容', value: ''
                                    }
                                ].concat(gBundle.vm.dataList.sort((function (a: any, b: any) {
                                    if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                        return -1;
                                    }
                                    if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                        return 1;
                                    }

                                    // names must be equal
                                    return 0;
                                })).map((dd: any) => {
                                    return {
                                        title: `${dd.group}-${dd.name}`, value: dd.tag
                                    }
                                })),
                                callback: (text: string) => {
                                    tdata.copy = text
                                },
                            })
                        ])
                    },
                    divCreate: {}
                }
            })}
</div>
<div class="w-100 bg-white my-1" style="height: 1px;"></div>
<div class="d-flex w-100 my-2 align-items-center justify-content-center">
<button class="btn btn-primary " style="width: calc(100% - 20px);" onclick="${gvc.event(() => {
                const dialog = new ShareDialog(glitter)
                dialog.dataLoading({text: "上傳中", visible: true})
                ApiPageConfig.addPage(tdata).then((it) => {
                    setTimeout(() => {
                        dialog.dataLoading({text: "", visible: false})
                        if (it.result) {
                            location.href = `index.html?page=${tdata.tag}&type=editor`
                        } else {
                            dialog.errorMessage({
                                text: "已有此頁面標籤"
                            })
                        }
                    }, 1000)
                })
            })}">確認新增</button>
</div>
</div>
</div>
            `;
        }
    };
});