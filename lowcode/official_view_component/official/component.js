import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { BaseApi } from "../../api/base.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
export const component = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData, htmlGenerate) => {
            var _a;
            widget.data.list = (_a = widget.data.list) !== null && _a !== void 0 ? _a : [];
            return {
                view: () => {
                    return new Promise(async (resolve, reject) => {
                        let data = undefined;
                        const saasConfig = window.saasConfig;
                        let fal = 0;
                        async function getData() {
                            var _a;
                            let tag = widget.data.tag;
                            let carryData = widget.data.carryData;
                            for (const b of widget.data.list) {
                                b.evenet = (_a = b.evenet) !== null && _a !== void 0 ? _a : {};
                                try {
                                    if (b.triggerType === 'trigger') {
                                        const result = await new Promise((resolve, reject) => {
                                            (TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: b.evenet,
                                                subData
                                            })).then((data) => {
                                                resolve(data);
                                            });
                                        });
                                        if (result) {
                                            tag = b.tag;
                                            carryData = b.carryData;
                                            break;
                                        }
                                    }
                                    else {
                                        if ((await eval(b.code)) === true) {
                                            tag = b.tag;
                                            carryData = b.carryData;
                                            break;
                                        }
                                    }
                                }
                                catch (e) {
                                }
                            }
                            let sub = subData !== null && subData !== void 0 ? subData : {};
                            try {
                                sub.carryData = await TriggerEvent.trigger({
                                    gvc: gvc,
                                    clickEvent: carryData,
                                    widget: widget,
                                    subData: subData
                                });
                            }
                            catch (e) {
                            }
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${tag}`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                var _a;
                                try {
                                    if (!d2.result) {
                                        fal += 1;
                                        if (fal < 20) {
                                            setTimeout(() => {
                                                getData();
                                            }, 200);
                                        }
                                    }
                                    else {
                                        data = d2.response.result[0];
                                        let createOption = (_a = (htmlGenerate !== null && htmlGenerate !== void 0 ? htmlGenerate : {}).createOption) !== null && _a !== void 0 ? _a : {};
                                        resolve(new glitter.htmlGenerate(data.config, [], subData).render(gvc, undefined, createOption !== null && createOption !== void 0 ? createOption : {}));
                                    }
                                }
                                catch (e) {
                                    resolve('');
                                }
                            });
                        }
                        await getData();
                    });
                },
                editor: () => {
                    const id = glitter.getUUID();
                    const data = {
                        dataList: undefined
                    };
                    const saasConfig = window.saasConfig;
                    function getData() {
                        BaseApi.create({
                            "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                            "type": "GET",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json"
                            }
                        }).then((d2) => {
                            data.dataList = d2.response.result;
                            gvc.notifyDataChange(id);
                        });
                    }
                    function setPage(pd) {
                        var _a;
                        let group = [];
                        let selectGroup = '';
                        pd.carryData = (_a = pd.carryData) !== null && _a !== void 0 ? _a : {};
                        let id = glitter.getUUID();
                        data.dataList.map((dd) => {
                            if (dd.tag === pd.tag) {
                                selectGroup = dd.group;
                            }
                            if (group.indexOf(dd.group) === -1) {
                                group.push(dd.group);
                            }
                        });
                        let data2 = undefined;
                        let fal = 0;
                        function getDd() {
                            let tag = widget.data.tag;
                            for (const b of widget.data.list) {
                                if (eval(b.code) === true) {
                                    tag = b.tag;
                                    break;
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
                                    fal += 1;
                                    if (fal < 5) {
                                        setTimeout(() => {
                                            getDd();
                                        }, 200);
                                    }
                                }
                                else {
                                    data2 = d2.response.result[0];
                                    try {
                                        subData.callback(data);
                                    }
                                    catch (e) {
                                    }
                                    gvc.notifyDataChange(id);
                                }
                            });
                        }
                        return gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    var _a;
                                    return EditorElem.select({
                                        title: "選擇嵌入頁面",
                                        gvc: gvc,
                                        def: (_a = pd.tag) !== null && _a !== void 0 ? _a : "",
                                        array: [
                                            {
                                                title: '選擇嵌入頁面', value: ''
                                            }
                                        ].concat(data.dataList.sort((function (a, b) {
                                            if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                                return -1;
                                            }
                                            if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                                return 1;
                                            }
                                            return 0;
                                        })).map((dd) => {
                                            return {
                                                title: `${dd.group}-${dd.name}`, value: dd.tag
                                            };
                                        })),
                                        callback: (text) => {
                                            pd.tag = text;
                                        },
                                    }) + (() => {
                                        return TriggerEvent.editer(gvc, widget, pd.carryData, {
                                            hover: true,
                                            option: [],
                                            title: "夾帶的資料-[ 存放於subData.carryData中 ]"
                                        });
                                    })();
                                },
                                divCreate: {}
                            };
                        });
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
                                        array: widget.data.list.map((dd, index) => {
                                            return {
                                                title: dd.name || `判斷式:${index + 1}`,
                                                expand: dd,
                                                innerHtml: ((gvc) => {
                                                    return glitter.htmlGenerate.editeInput({
                                                        gvc: gvc,
                                                        title: `判斷式名稱`,
                                                        default: dd.name,
                                                        placeHolder: "輸入判斷式名稱",
                                                        callback: (text) => {
                                                            dd.name = text;
                                                            gvc.notifyDataChange(id);
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
                                                                gvc.notifyDataChange(id);
                                                            }
                                                        }) +
                                                        (() => {
                                                            var _a;
                                                            if (dd.triggerType === 'trigger') {
                                                                dd.evenet = (_a = dd.evenet) !== null && _a !== void 0 ? _a : {};
                                                                return TriggerEvent.editer(gvc, widget, dd.evenet, {
                                                                    hover: false,
                                                                    option: [],
                                                                    title: "觸發事件"
                                                                });
                                                            }
                                                            else {
                                                                return glitter.htmlGenerate.editeText({
                                                                    gvc: gvc,
                                                                    title: `判斷式內容`,
                                                                    default: dd.code,
                                                                    placeHolder: "輸入程式碼",
                                                                    callback: (text) => {
                                                                        dd.code = text;
                                                                        gvc.notifyDataChange(id);
                                                                    }
                                                                });
                                                            }
                                                        })() + `
 ${setPage(dd)}`;
                                                }),
                                                minus: gvc.event(() => {
                                                    widget.data.list.splice(index, 1);
                                                    widget.refreshComponent();
                                                })
                                            };
                                        }),
                                        expand: widget.data,
                                        plus: {
                                            title: "添加判斷",
                                            event: gvc.event(() => {
                                                widget.data.list.push({ code: '' });
                                                gvc.notifyDataChange(id);
                                            })
                                        },
                                        refreshComponent: () => {
                                            widget.refreshComponent();
                                        },
                                        originalArray: widget.data.list
                                    })}
`;
                                }
                                else {
                                    return ``;
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                if (!data.dataList) {
                                    setTimeout(() => {
                                        getData();
                                    }, 100);
                                }
                            }
                        };
                    });
                }
            };
        }
    };
});
