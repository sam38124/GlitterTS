import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {imageLibrary} from "../../modules/image-library.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.accept = object.accept ?? {};
            object.uploading = object.uploading ?? {};
            object.uploadFinish = object.uploadFinish ?? {};
            object.error = object.error ?? {}
            object.upload_count = object.upload_count || 'single'
            const html = String.raw
            return {
                editor: () => {
                    return [
                        EditorElem.select({
                            title: '上傳數量',
                            gvc: gvc,
                            def: object.upload_count,
                            array: [
                                {title: '單個', value: "single"},
                                {title: '多個', value: "multiple"}
                            ],
                            callback: (text) => {
                                object.upload_count = text
                            }
                        }),
                        TriggerEvent.editer(gvc, widget, object.accept, {
                            hover: false,
                            option: [],
                            title: '檔案類型{accept}'
                        }),
                        TriggerEvent.editer(gvc, widget, object.uploading, {
                            hover: false,
                            option: [],
                            title: '上傳中'
                        }),
                        TriggerEvent.editer(gvc, widget, object.uploadFinish, {
                            hover: false,
                            option: [],
                            title: '上傳結束'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '上傳失敗'
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const accept: any = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.accept,
                            subData: subData,
                            element: element
                        });
                         imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                             if (urlArray.length > 0){
                                TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.uploadFinish,
                                    subData: urlArray[0],
                                    element: element
                                });
                                resolve(urlArray[0].data);
                            }else{
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.errorMessage({text:'請選擇至少一張圖片'});
                            }

                            // postMD.content_array = id
                            // obj.gvc.notifyDataChange(bi)
                        }, `<div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">圖片庫</div>`
                        ,{mul:object.upload_count !== 'single'})

                        // if(object.upload_count === 'single'){
                        //     await TriggerEvent.trigger({
                        //         gvc: gvc,
                        //         widget: widget,
                        //         clickEvent: object.uploadFinish,
                        //         subData: url_stack[0],
                        //         element: element
                        //     });
                        //     resolve(url_stack[0])
                        // }else{
                        //     await TriggerEvent.trigger({
                        //         gvc: gvc,
                        //         widget: widget,
                        //         clickEvent: object.uploadFinish,
                        //         subData: url_stack,
                        //         element: element
                        //     });
                        //     resolve(url_stack)
                        // }
                    })

                }
            }
        }
    }
})