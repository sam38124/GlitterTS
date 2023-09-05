import {HtmlJson, Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {Glitter} from "../../glitterBundle/Glitter.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {BaseApi} from "../../api/base.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

export const component = Plugin.createComponent(import.meta.url, (glitter: Glitter, editMode: boolean) => {
    return {
        render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData, htmlGenerate) => {
            widget.data.list = widget.data.list ?? []
            return {
                view: () => {
                    return new Promise(async (resolve, reject) => {
                        let data: any = undefined
                        const saasConfig = (window as any).saasConfig
                        let fal = 0

                        async function getData() {
                            let tag = widget.data.tag
                            let carryData = widget.data.carryData
                            for (const b of widget.data.list) {
                                b.evenet = b.evenet ?? {}
                                try {
                                    if (b.triggerType === 'trigger') {
                                        const result = await new Promise((resolve, reject) => {
                                            (TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: b.evenet,
                                                subData
                                            })).then((data) => {
                                                resolve(data)
                                            })

                                        })
                                        if (result) {
                                            tag = b.tag
                                            carryData = b.carryData
                                            break
                                        }
                                    } else {
                                        if ((await eval(b.code)) === true) {
                                            tag = b.tag
                                            carryData = b.carryData
                                            break
                                        }
                                    }
                                } catch (e) {

                                }

                            }
                            let sub: any = subData ?? {}
                            try {
                                sub.carryData = await TriggerEvent.trigger({
                                    gvc: gvc,
                                    clickEvent: carryData,
                                    widget: widget,
                                    subData: subData
                                })
                            } catch (e) {
                            }
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${tag}`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                try {
                                    if (!d2.result) {
                                        fal += 1
                                        if (fal < 20) {
                                            setTimeout(() => {
                                                getData()
                                            }, 200)
                                        }
                                    } else {
                                        data = d2.response.result[0]
                                        let createOption = (htmlGenerate ?? {}).createOption ?? {}

                                        resolve(new glitter.htmlGenerate(data.config, [], subData).render(gvc, undefined, createOption ?? {}))

                                    }
                                } catch (e) {
                                    resolve('')
                                }


                            })
                        }

                        await getData()
                    })
                },
                editor: () => {
                    const id = glitter.getUUID()
                    const data: any = {
                        dataList: undefined
                    }
                    const saasConfig = (window as any).saasConfig

                    function getData() {
                        BaseApi.create({
                            "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                            "type": "GET",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json"
                            }
                        }).then((d2) => {
                            data.dataList = d2.response.result
                            gvc.notifyDataChange(id)
                        })
                    }

                    function setPage(pd: any) {
                        let group: string[] = [];
                        let selectGroup = ''
                        pd.carryData = pd.carryData ?? {}
                        let id = glitter.getUUID()
                        data.dataList.map((dd: any) => {
                            if (dd.tag === pd.tag) {
                                selectGroup = dd.group
                            }
                            if (group.indexOf(dd.group) === -1) {
                                group.push(dd.group)
                            }
                        })
                        let data2: any = undefined
                        let fal = 0

                        function getDd() {
                            let tag = widget.data.tag
                            for (const b of widget.data.list) {
                                if (eval(b.code) === true) {
                                    tag = b.tag
                                    break
                                }
                            }
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${tag}`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                if (!d2.result) {
                                    fal += 1
                                    if (fal < 5) {
                                        setTimeout(() => {
                                            getDd()
                                        }, 200)
                                    }
                                } else {
                                    data2 = d2.response.result[0]
                                    try {
                                        subData.callback(data)
                                    } catch (e) {
                                    }
                                    gvc.notifyDataChange(id)
                                }

                            })
                        }

                        // getDd()
                        return gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    return EditorElem.select({
                                        title: "選擇嵌入頁面",
                                        gvc: gvc,
                                        def: pd.tag ?? "",
                                        array: [
                                            {
                                                title: '選擇嵌入頁面', value: ''
                                            }
                                        ].concat(data.dataList.sort((function (a: any, b: any) {
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
                                            pd.tag = text;
                                        },
                                    }) + (() => {
                                        //

                                        return TriggerEvent.editer(gvc, widget, pd.carryData, {
                                            hover: true,
                                            option: [],
                                            title: "夾帶的資料-[ 存放於subData.carryData中 ]"
                                        })
                                    })()
                                },
                                divCreate: {}
                            }
                        })
                    }

                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                if (data.dataList) {
                                    return `
   ${setPage(widget.data)}
  ${EditorElem.arrayItem({
                                        gvc: gvc,
                                        title: "判斷式頁面嵌入",
                                        array: widget.data.list.map((dd: any, index: number) => {
                                            return {
                                                title: dd.name || `判斷式:${index + 1}`,
                                                expand: dd,
                                                innerHtml: ((gvc: GVC) => {
                                                    return glitter.htmlGenerate.editeInput({
                                                            gvc: gvc,
                                                            title: `判斷式名稱`,
                                                            default: dd.name,
                                                            placeHolder: "輸入判斷式名稱",
                                                            callback: (text) => {
                                                                dd.name = text
                                                                gvc.notifyDataChange(id)
                                                            }
                                                        }) +
                                                        EditorElem.select({
                                                            title: '類型',
                                                            gvc: gvc,
                                                            def: dd.triggerType,
                                                            array: [{
                                                                title: '程式碼', value: 'manual'
                                                            }, {
                                                                title: '觸發事件', value: 'trigger'
                                                            }],
                                                            callback: (text) => {
                                                                dd.triggerType = text;
                                                                gvc.notifyDataChange(id)
                                                            }
                                                        }) +
                                                        (() => {
                                                            if (dd.triggerType === 'trigger') {
                                                                dd.evenet = dd.evenet ?? {}
                                                                return TriggerEvent.editer(gvc, widget, dd.evenet, {
                                                                    hover: false,
                                                                    option: [],
                                                                    title: "觸發事件"
                                                                })
                                                            } else {
                                                                return glitter.htmlGenerate.editeText({
                                                                    gvc: gvc,
                                                                    title: `判斷式內容`,
                                                                    default: dd.code,
                                                                    placeHolder: "輸入程式碼",
                                                                    callback: (text) => {
                                                                        dd.code = text
                                                                        gvc.notifyDataChange(id)
                                                                    }
                                                                })
                                                            }
                                                        })() + `
 ${setPage(dd)}`
                                                })
                                                ,
                                                minus: gvc.event(() => {
                                                    widget.data.list.splice(index, 1)
                                                    widget.refreshComponent()
                                                })
                                            }
                                        }),
                                        expand: widget.data,
                                        plus: {
                                            title: "添加判斷",
                                            event: gvc.event(() => {
                                                widget.data.list.push({code: ''})
                                                gvc.notifyDataChange(id)
                                            })
                                        },
                                        refreshComponent: () => {
                                            widget.refreshComponent()
                                        },
                                        originalArray: widget.data.list
                                    })}
`
                                } else {
                                    return ``
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                if (!data.dataList) {
                                    setTimeout(() => {
                                        getData()
                                    }, 100)
                                }
                            }
                        }
                    })
                }
            }
        }
    }
})