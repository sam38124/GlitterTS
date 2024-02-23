import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {GlobalEvent} from "../../api/global-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.scrollTOP = object.scrollTOP ?? {}
            object.scrollBT = object.scrollBT ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.scrollTOP, {
                            hover: false,
                            option: [],
                            title: "滾動至頂部"
                        }),
                        TriggerEvent.editer(gvc, widget, object.scrollBT, {
                            hover: false,
                            option: [],
                            title: "滾動至底部"
                        }),
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        // 取得要監聽的元素
                        let targetElement = element?.e;
                        if(targetElement.scrollWatch){
                            targetElement.removeEventListener('scroll',targetElement.scrollWatch)
                        }
                        targetElement.scrollWatch=function () {
                            // 檢查是否已經滾動到底部
                            if (targetElement.scrollTop + targetElement.clientHeight >= targetElement.scrollHeight) {
                                // 在這裡執行相應的操作或加載更多內容的程式碼
                                TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.scrollBT, subData: subData, element: element
                                })
                            }

                        }
                        // 添加滾動事件監聽器
                        targetElement.addEventListener('scroll', targetElement.scrollWatch);
                        resolve(true)
                    })
                },
            };
        },
    };
});

