import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.sizeList = object.sizeList ?? []
            object.event = object.event ?? {}
            return {
                editor: () => {
                    return gvc.bindView(()=>{
                        const id=gvc.glitter.getUUID()

                        return {
                            bind:id,
                            view:()=>{
                                return [
                                    TriggerEvent.editer(gvc, widget, object.event, {
                                        hover: false,
                                        option: [],
                                        title: "預設事件"
                                    }),
                                    EditorElem.arrayItem({
                                        gvc: gvc,
                                        title: '設定其他裝置尺寸',
                                        array: () => {
                                            return object.sizeList.map((dd: any) => {
                                                return {
                                                    title: `寬度:${dd.size}`,
                                                    innerHtml: () => {
                                                        return [ EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '設定寬度尺寸',
                                                            default: `${dd.size}`,
                                                            placeHolder: '請輸入Class參數',
                                                            callback: (text) => {
                                                                dd.size = text
                                                                gvc.recreateView()
                                                            },
                                                            type: 'text'
                                                        }),TriggerEvent.editer(gvc, widget, dd.event, {
                                                            hover: false,
                                                            option: [],
                                                            title: "執行事件"
                                                        })].join(`<div class="my-2"></div>`)
                                                    },
                                                    width: '400px'
                                                }
                                            })
                                        },
                                        originalArray: object.sizeList,
                                        expand: {},
                                        plus: {
                                            title: "新增尺寸",
                                            event: gvc.event(() => {
                                                object.sizeList.push({
                                                    size: 480,
                                                    event:{}
                                                })
                                                gvc.notifyDataChange(id)
                                            })
                                        },
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(id)
                                        }
                                    })
                                ].join('<div class="my-2"></div>')
                            }
                        }
                    })
            },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const key:any={}
                        object.sizeList.map((dd:any)=>{
                            key[dd.size]=(async ()=>{
                                resolve( await TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: dd.event, subData: subData
                                }))
                            })
                        })
                      gvc.glitter.ut.frSize(key,async ()=>{
                          resolve( await TriggerEvent.trigger({
                              gvc: gvc, widget: widget, clickEvent: object.event, subData: subData
                          }))
                      })()
                    })
                },
            };
        },
    };
});

