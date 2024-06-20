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
                        glitter.ut.chooseMediaCallback({
                            single: (object.upload_count === 'single'),
                            accept: accept || '*',
                            async callback(data: any) {
                                const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                                (await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.uploading,
                                    subData: subData,
                                    element: element
                                }));
                                let url_stack: string[] = [];
                                for (const dd of data) {
                                    const file = dd.file;
                                    const res = await new Promise((resolve, reject) => {
                                        saasConfig.api.uploadFile(file.name).then((data: any) => {
                                            const data1 = data.response;
                                            BaseApi.create({
                                                url: data1.url,
                                                type: 'put',
                                                data: file,
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
                                }

                                if(object.upload_count === 'single'){
                                    await TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.uploadFinish,
                                        subData: url_stack[0],
                                        element: element
                                    });
                                    resolve(url_stack[0])
                                }else{
                                    await TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.uploadFinish,
                                        subData: url_stack,
                                        element: element
                                    });
                                    resolve(url_stack)
                                }
                            },
                        });
                    })

                }
            }
        }
    }
})