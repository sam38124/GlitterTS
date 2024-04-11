import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {BaseApi} from "../../glitterBundle/api/base.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.accept=object.accept??{};
            object.uploading=object.uploading??{};
            object.uploadFinish=object.uploadFinish??{};
            object.error=object.error??{}
            const html = String.raw
            return {
                editor: () => {
                    return [
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
                    if( gvc.glitter.htmlGenerate.isEditMode()){
                        return
                    }
                    return new Promise(async (resolve, reject)=>{
                        const accept:any=await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.accept,
                            subData: subData,
                            element: element
                        });
                        glitter.ut.chooseMediaCallback({
                            single: true,
                            accept: accept || '*',
                            async callback(data: any) {
                                const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                                await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.uploading,
                                    subData: subData,
                                    element: element
                                })
                                const file = data[0].file;
                                saasConfig.api.uploadFile(file.name).then((data: any) => {
                                    const data1 = data.response;
                                    BaseApi.create({
                                        url: data1.url,
                                        type: 'put',
                                        data: file,
                                        headers: {
                                            "Content-Type": data1.type
                                        }
                                    }).then(async (res)=>{
                                        if(res.result){
                                            await TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: object.uploadFinish,
                                                subData: data1.fullUrl,
                                                element: element
                                            })
                                            resolve(data1.fullUrl);
                                        }else{
                                            await TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: object.error,
                                                subData: subData,
                                                element: element
                                            })
                                            resolve(false);
                                        }
                                    });
                                });
                            },
                        });
                    })

                }
            }
        }
    }
})