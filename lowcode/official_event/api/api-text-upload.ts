import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.accept = object.accept ?? {};
            object.uploading = object.uploading ?? {};
            object.uploadFinish = object.uploadFinish ?? {};
            object.error = object.error ?? {}
            object.upload_count = object.upload_count || 'single'
            object.text = object.text ?? {}
            const html = String.raw
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.text, {
                            hover: false,
                            option: [],
                            title: '文字來源'
                        }),
                        TriggerEvent.editer(gvc, widget, object.accept, {
                            hover: false,
                            option: [],
                            title: '副檔名'
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
                        let text=await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.text,
                            subData: subData,
                            element: element
                        });
                        if(typeof text !=='string'){
                            text=JSON.stringify(text)
                        }

                        const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                        (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.uploading,
                            subData: subData,
                            element: element
                        }));
                        let url_stack: string[] = [];
                        const res = await new Promise((resolve, reject) => {
                            saasConfig.api.uploadFile(glitter.getUUID()+'.'+accept).then((data: any) => {
                                const data1 = data.response;
                                BaseApi.create({
                                    url: data1.url,
                                    type: 'put',
                                    data: text,
                                    headers: {
                                        "Content-Type": data1.type
                                    }
                                }).then(async (res) => {
                                    if (res.result) {
                                        resolve(data1.fullUrl);
                                    } else {
                                        resolve(false);
                                    }
                                });
                            });
                        });
                        if (!res) {
                            await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.error,
                                subData: subData,
                                element: element
                            });
                            resolve(false)
                            return
                        }
                        url_stack.push(res as string)

                        resolve(url_stack[0])
                    })

                }
            }
        }
    }
})