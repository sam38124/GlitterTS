import {HtmlJson, Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {Glitter} from "../../glitterBundle/Glitter.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Storage} from "../../glitterBundle/helper/storage.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalWidget} from "../../glitterBundle/html-component/global-widget.js";
import {CustomStyle} from "../../glitterBundle/html-component/custom-style.js";


export const component = Plugin.createComponent(import.meta.url, (glitter: Glitter, editMode: boolean) => {
    return {
        render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData, htmlGenerate, doc) => {
            const document = doc || (window.document);
            widget.data.list = widget.data.list ?? []
            widget.storage = widget.storage ?? {};
            widget.storage.updateFormData = widget.storage.updateFormData ?? ((page_config: any) => {
            })
            let viewConfig: any = undefined
            const html = String.raw;
            const view_container_id = widget.id
            return {
                view: () => {
                    let data: any = undefined
                    let tag = widget.data.tag
                    let carryData = widget.data.carryData

                    async function getData(document: any) {
                        return new Promise(async (resolve, reject) => {
                            try {
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
                                            if (b.codeVersion === 'v2') {
                                                if ((await eval(`(() => {
                                                    ${b.code}
                                                })()`)) === true) {
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
                                        }
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                                let sub: any = subData;
                                try {
                                    sub.carryData = await TriggerEvent.trigger({
                                        gvc: gvc,
                                        clickEvent: carryData,
                                        widget: widget,
                                        subData: subData
                                    })
                                } catch (e) {
                                    console.log(e)
                                }
                                if (!tag) {
                                    resolve(``)
                                } else {
                                    const page_request_config = widget.data.refer_app ? {
                                        tag: tag,
                                        appName: widget.data.refer_app
                                    } : {
                                        tag: tag,
                                        appName: (window as any).appName
                                    };
                                    ((window as any).glitterInitialHelper).getPageData(page_request_config, (d2: any) => {
                                        data = d2.response.result[0]
                                        data.config = data.config ?? []
                                        data.config.map((dd: any) => {
                                            glitter.htmlGenerate.renameWidgetID(dd)
                                        })

                                        let formData = JSON.parse(JSON.stringify(data.page_config.formData))
                                        if ((widget.data.refer_app)) {
                                            GlobalWidget.initialShowCaseData({
                                                widget: widget,
                                                gvc: gvc
                                            });

                                            formData = JSON.parse(JSON.stringify((widget.data.refer_form_data || data.page_config.formData)))
                                            if (gvc.glitter.document.body.clientWidth < 800 && (widget as any).mobile.refer === 'hide') {
                                                resolve(`
                                                <!-- tag=${tag} -->
                                                `)
                                                return
                                            } else if (gvc.glitter.document.body.clientWidth >= 800 && (widget as any).desktop.refer === 'hide') {
                                                resolve(`
                                                <!-- tag=${tag} -->
                                                `)
                                                return
                                            } else if (gvc.glitter.document.body.clientWidth < 800 && (widget as any).mobile.refer === 'custom') {
                                                ((widget as any)[`mobile_editable`] ?? []).map((dd: any) => {
                                                    formData[dd] = ((widget as any).mobile.data.refer_form_data || data.page_config.formData)[dd]
                                                });
                                                // data.page_config.formData = (widget.data.refer_form_data || data.page_config.formData)
                                            } else if (gvc.glitter.document.body.clientWidth >= 800 && (widget as any).desktop.refer === 'custom') {
                                                ((widget as any)[`desktop_editable`] ?? []).map((dd: any) => {
                                                    formData[dd] = ((widget as any).desktop.data.refer_form_data || data.page_config.formData)[dd]
                                                });
                                                // data.page_config.formData = ((widget as any).desktop.data.refer_form_data || data.page_config.formData);
                                            }
                                        }

                                        data.config.formData = formData;
                                        viewConfig = data.config;
                                        const id = gvc.glitter.getUUID()

                                        function getView() {
                                            function loop(array: any) {
                                                array.map((dd: any) => {
                                                    if (dd.type === 'container') {
                                                        loop(dd.data.setting ?? [])
                                                    }
                                                    dd.formData = undefined
                                                })
                                            }

                                            function getCreateOption() {
                                                let createOption = (htmlGenerate ?? {}).createOption ?? {}
                                                createOption.option = createOption.option ?? []
                                                createOption.class = createOption.class || ``
                                                createOption.childContainer = true
                                                createOption.class += ` ${(glitter.htmlGenerate.isEditMode()) ? `${page_request_config.appName}_${page_request_config.tag} ${widget.id}` : ``}`;
                                                createOption.style = createOption.style ?? ''
                                                createOption.style += (() => {
                                                    if (gvc.glitter.document.body.clientWidth < 800 && (widget as any).mobile && (widget as any).mobile.refer === 'custom' && (widget as any)[`mobile_editable`].find((d1: any) => {
                                                        return d1 === '_container_margin'
                                                    })) {
                                                        return CustomStyle.value(gvc, (widget as any).mobile)
                                                    } else if (gvc.glitter.document.body.clientWidth >= 800 && (widget as any).desktop && (widget as any).desktop.refer === 'custom' && (widget as any)[`desktop_editable`].find((d1: any) => {
                                                        return d1 === '_container_margin'
                                                    })) {
                                                        return CustomStyle.value(gvc, (widget as any).desktop)
                                                    } else {
                                                        return CustomStyle.value(gvc, (widget as any))
                                                    }
                                                })()

                                                return createOption
                                            }

                                            loop(viewConfig)

                                            return new glitter.htmlGenerate(viewConfig, [], sub).render(gvc, {
                                                class: ``,
                                                style: ``,
                                                containerID: id,
                                                tag: page_request_config.tag,
                                                jsFinish: () => {
                                                },
                                                onCreate: () => {
                                                    if (glitter.htmlGenerate.isEditMode()) {
                                                        gvc.getBindViewElem(id).get(0).updatePageConfig = (formData: any) => {
                                                            viewConfig.formData = formData
                                                            document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = getView()
                                                        }
                                                    }
                                                },
                                                document: document
                                            }, getCreateOption)
                                        }


                                        widget.storage.updatePageConfig = (formData: any) => {
                                            try {
                                                console.log(`updatePageConfig->`, formData)
                                                viewConfig.formData = formData
                                                document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = getView()
                                            } catch (e) {

                                            }
                                        }
                                        resolve(`
                                                <!-- tag=${tag} -->
                                              ${getView()}
                                                `)

                                    })
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        })
                    }

                    return gvc.bindView(() => {
                        const tempView = glitter.getUUID()
                        return {
                            bind: tempView,
                            view: () => {
                                return ``
                            },
                            divCreate: {
                                class: ``
                            },
                            onInitial: async () => {
                                const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`)
                                target!.outerHTML = (await getData(gvc.glitter.document) as any)
                            },
                            onDestroy: () => {
                            },
                        }
                    })
                },
                editor: async () => {
                    const EditorElem: any = await new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('../../glitterBundle/plugins/editor-elem.js', import.meta.url).href, (clas) => {
                            resolve(clas)
                        })
                    })
                    const ApiPageConfig: any = await new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('../../api/pageConfig.js', import.meta.url).href, (clas) => {
                            resolve(clas)
                        })
                    })
                    const FormWidget: any = await new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('./form.js', import.meta.url).href, (clas) => {
                            resolve(clas)
                        })
                    })
                    const BgWidget: any = await new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('../../backend-manager/bg-widget.js', import.meta.url).href, (clas) => {
                            resolve(clas)
                        })
                    })

                    function devEditorView() {
                        const id = glitter.getUUID()
                        const data: any = {
                            dataList: undefined
                        }
                        const saasConfig = (window as any).saasConfig

                        function getData() {
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${widget.data.refer_app || saasConfig.config.appName}&page_type=module`,
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
                            return gvc.bindView(() => {
                                return {
                                    bind: id,
                                    view: () => {
                                        return [EditorElem.select({
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
                                                return 0;
                                            })).map((dd: any) => {
                                                return {
                                                    title: `${dd.group}-${dd.name}`, value: dd.tag
                                                }
                                            })),
                                            callback: (text: string) => {
                                                pd.tag = text;
                                            },
                                        }), (() => {
                                            return TriggerEvent.editer(gvc, widget, pd.carryData, {
                                                hover: true,
                                                option: [],
                                                title: "夾帶資料<[ subData.carryData ]>"
                                            })
                                        })()].join(`<div class="my-2"></div>`)
                                    },
                                    divCreate: {
                                        class: `mb-2`
                                    }
                                }
                            })
                        }

                        const html = String.raw
                        return gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    if (data.dataList) {
                                        return [
                                            EditorElem.editerDialog({
                                                gvc: gvc,
                                                dialog: (gvc: GVC) => {
                                                    return setPage(widget.data)
                                                },
                                                editTitle: `預設嵌入頁面`
                                            }),
                                            EditorElem.editerDialog({
                                                gvc: gvc,
                                                dialog: (gvc: GVC) => {
                                                    return gvc.bindView(() => {
                                                        const diaId = glitter.getUUID()
                                                        return {
                                                            bind: diaId,
                                                            view: () => {
                                                                return EditorElem.arrayItem({
                                                                    gvc: gvc,
                                                                    title: "",
                                                                    array: () => {
                                                                        return widget.data.list.map((dd: any, index: number) => {
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
                                                                                            }
                                                                                        }) +
                                                                                        EditorElem.select({
                                                                                            title: '類型',
                                                                                            gvc: gvc,
                                                                                            def: dd.triggerType,
                                                                                            array: [{
                                                                                                title: '程式碼',
                                                                                                value: 'manual'
                                                                                            }, {
                                                                                                title: '觸發事件',
                                                                                                value: 'trigger'
                                                                                            }],
                                                                                            callback: (text: any) => {
                                                                                                dd.triggerType = text;
                                                                                            }
                                                                                        }) +
                                                                                        (() => {
                                                                                            if (dd.triggerType === 'trigger') {
                                                                                                dd.evenet = dd.evenet ?? {}
                                                                                                return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, dd.evenet, {
                                                                                                    hover: false,
                                                                                                    option: [],
                                                                                                    title: "觸發事件"
                                                                                                })
                                                                                            } else {
                                                                                                return EditorElem.codeEditor({
                                                                                                    gvc: gvc,
                                                                                                    title: `判斷式內容`,
                                                                                                    initial: dd.code,
                                                                                                    callback: (text: any) => {
                                                                                                        dd.codeVersion = 'v2'
                                                                                                        dd.code = text
                                                                                                    },
                                                                                                    height: 400
                                                                                                })
                                                                                            }
                                                                                        })() + `
 ${setPage(dd)}`
                                                                                }),
                                                                                saveEvent: () => {
                                                                                    gvc.notifyDataChange(diaId)
                                                                                }
                                                                                ,
                                                                                minus: gvc.event(() => {
                                                                                    widget.data.list.splice(index, 1)
                                                                                    widget.refreshComponent()
                                                                                }),
                                                                                width: '600px',
                                                                            }
                                                                        })
                                                                    },
                                                                    expand: widget.data,
                                                                    plus: {
                                                                        title: "添加判斷",
                                                                        event: gvc.event(() => {
                                                                            widget.data.list.push({code: ''})
                                                                            gvc.notifyDataChange(diaId)
                                                                        })
                                                                    },
                                                                    refreshComponent: () => {

                                                                    },
                                                                    originalArray: widget.data.list
                                                                })
                                                            },
                                                            divCreate: {}
                                                        }
                                                    })
                                                },
                                                width: "400px",
                                                editTitle: `判斷式頁面嵌入`
                                            })
                                        ].join(` <div class="my-2"></div>`)
                                    } else {
                                        return `<div class="w-100 d-flex align-items-center justify-content-center p-3">
<div class="spinner-border"></div>
</div>`
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

                    function userEditorView() {
                        const saasConfig = (window as any).saasConfig
                        let data = {
                            dataList: []
                        }
                        return gvc.bindView(() => {
                            const id = glitter.getUUID()
                            let selectTag = ''
                            let vm: {
                                loading: boolean,
                                data: any
                            } = {
                                loading: true,
                                data: {}
                            }

                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${widget.data.refer_app || saasConfig.config.appName}`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                vm.data = d2
                                vm.loading = false
                                gvc.notifyDataChange(id)
                            })
                            return {
                                bind: id,
                                view: () => {
                                    if (vm.loading) {
                                        return `<div class="w-100 d-flex align-items-center justify-content-center">
<div class="spinner-border"></div>
</div>`
                                    } else {
                                        const d2 = vm.data
                                        data.dataList = d2.response.result
                                        let valueArray: { title: string, tag: string }[] = []
                                        const def: any = data.dataList.find((dd: any) => {
                                            return dd.tag === widget.data.tag
                                        })
                                        def && valueArray.push({
                                            title: def.name, tag: def.tag
                                        })
                                        widget.data.list.map((d2: any) => {
                                            const def: any = data.dataList.find((dd: any) => {
                                                return dd.tag === d2.tag
                                            })
                                            def && valueArray.push({
                                                title: def.name, tag: def.tag
                                            })
                                        })
                                        valueArray.map((dd) => {
                                            selectTag = selectTag || dd.tag
                                        })
                                        if (widget.data.refer_app) {
                                            selectTag = widget.data.tag
                                        }
                                        const html = String.raw
                                        return [
                                            html`
                                                <div class="d-flex align-items-center mt-2 mb-2 ${Storage.select_function === 'user-editor' ? `d-none` : ``}">
                                                    <select class="form-control form-select"
                                                            style="border-top-right-radius: 0;border-bottom-right-radius: 0;"
                                                            onchange="${gvc.event((e, event) => {
                                                selectTag = e.value;
                                                gvc.notifyDataChange(id)
                                            })}">${
                                                valueArray.map((dd) => {
                                                    return `<option value="${dd.tag}" ${(dd.tag === selectTag) ? `selected` : ''} >${dd.title}</option>`
                                                })
                                            }</select>
                                                    <div class="hoverBtn ms-auto d-flex align-items-center justify-content-center   border "
                                                         style="height:44px;width:44px;cursor:pointer;color:#151515;border-left: none;border-radius: 0px 10px 10px 0px;"
                                                         data-bs-toggle="tooltip" data-bs-placement="top"
                                                         data-bs-custom-class="custom-tooltip"
                                                         data-bs-title="跳轉至模塊" onclick="${gvc.event(() => {
                                                glitter.setUrlParameter('page', selectTag)
                                                glitter.share.reloadEditor()
                                            })}">
                                                        <i class="fa-regular fa-eye"></i>
                                                    </div>
                                                </div>
                                            `,
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID()
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return new Promise(async (resolve, reject) => {
                                                            function getPageData(cf: any) {
                                                                let tag = cf;
                                                                let appName = (window as any).appName;
                                                                if (typeof cf === 'object') {
                                                                    tag = cf.tag;
                                                                    appName = cf.appName;
                                                                }
                                                                return new Promise((resolve, reject) => {
                                                                    ((window as any).glitterInitialHelper).getPageData({
                                                                        tag: tag,
                                                                        appName: appName
                                                                    }, (d2: any) => {
                                                                        resolve(d2.response.result[0])
                                                                    })
                                                                })
                                                            }

                                                            const pageData: any = await getPageData(widget.data.refer_app ? {
                                                                tag: selectTag,
                                                                appName: widget.data.refer_app
                                                            } : selectTag as any);
                                                            let html = ''
                                                            let spiltCount = 0

                                                            function appendHtml(pageData: any, widget: any, initial: boolean, id: string, parent_array: any) {
                                                                const vm = {
                                                                    id: gvc.glitter.getUUID()
                                                                }

                                                                const page_config = pageData.page_config

                                                                function getReferForm(widget: any) {
                                                                    if ((widget.data.refer_app)) {
                                                                        widget.data.refer_form_data = widget.data.refer_form_data || page_config.formData
                                                                        return widget.data.refer_form_data
                                                                    } else {
                                                                        return page_config.formData
                                                                    }
                                                                }

                                                                if (page_config.formFormat && page_config.formFormat.length !== 0) {
                                                                    if (!initial && (spiltCount++ > 1)) {
                                                                        html += `<div class="d-flex align-items-center justify-content-center mt-2" style="gap:7px;">
<div class="flex-fill border"></div>
<span class="fw-500" style="color:black;">${pageData.name}</span>
<div class="flex-fill border"></div>
</div>`
                                                                    }
                                                                    page_config.formData = page_config.formData || {}


                                                                    html += gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID()
                                                                        const vm: {
                                                                            id: string,
                                                                            page: 'setting' | 'editor'
                                                                        } = {
                                                                            id: gvc.glitter.getUUID(),
                                                                            page: 'editor'
                                                                        };
                                                                        ['mobile', 'desktop'].map((dd) => {
                                                                            widget[dd] = widget[dd] ?? {};
                                                                            (widget[dd].refer !== 'custom') && (widget[dd].refer = 'custom');
                                                                            widget[`${dd}_editable`] = widget[`${dd}_editable`] ?? [];
                                                                            widget[dd].data = widget[dd].data ?? {};
                                                                            widget[dd].data.refer_app = widget.data.refer_app;
                                                                        });

                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                const html = String.raw
                                                                                const oWidget = widget
                                                                                return [
                                                                                    `<div class="mx-n2">${(() => {
                                                                                        switch (vm.page) {
                                                                                            case "editor":
                                                                                                return html`
                                                                                                    <div
                                                                                                            class="px-3   border-bottom pb-3 fw-bold mt-n3 mb-2 pt-3 hoverF2 d-flex align-items-center"
                                                                                                            style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
                                                                                                            onclick="${gvc.event(() => {
                                                                                                    Storage.lastSelect = '';
                                                                                                    gvc.glitter.share.editorViewModel.selectItem = undefined;
                                                                                                    gvc.glitter.share.selectEditorItem();
                                                                                                })}"
                                                                                                    >
                                                                                                        <i class="fa-solid fa-chevron-left"></i>
                                                                                                        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${widget.label}</span>
                                                                                                        <div class="flex-fill"></div>
                                                                                                    </div>
                                                                                                    <div class="ps-2">
                                                                                                        ${GlobalWidget.showCaseBar(gvc, widget, () => {
                                                                                                    vm.page = 'editor'
                                                                                                    gvc.notifyDataChange(id)
                                                                                                })}
                                                                                                    </div>`
                                                                                            case "setting":
                                                                                                return html`
                                                                                                    <div
                                                                                                            class="px-3   border-bottom pb-3 fw-bold mt-n3  pt-3 hoverF2 d-flex align-items-center"
                                                                                                            style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
                                                                                                            onclick="${gvc.event(() => {
                                                                                                    vm.page = 'editor'
                                                                                                    gvc.notifyDataChange(id)
                                                                                                })}"
                                                                                                    >
                                                                                                        <i class="fa-solid fa-chevron-left"></i>
                                                                                                        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">設定</span>
                                                                                                        <div class="flex-fill"></div>
                                                                                                    </div>`
                                                                                        }
                                                                                    })()}</div>`,
                                                                                    GlobalWidget.showCaseEditor({
                                                                                        gvc: gvc,
                                                                                        widget: oWidget,
                                                                                        view: (widget, type) => {
                                                                                            try {
                                                                                                const array_html = []
                                                                                                array_html.push(gvc.bindView(() => {
                                                                                                    const html = String.raw

                                                                                                    async function filterFormat(filter: (dd: any) => boolean) {
                                                                                                        function loop(ogArray: any, data: any) {
                                                                                                            if (Array.isArray(data)) {
                                                                                                                data.map((dd) => {
                                                                                                                    loop(data, dd)
                                                                                                                })
                                                                                                            } else if (typeof data === 'object') {
                                                                                                                if (filter(data)) {
                                                                                                                    Object.keys(data).map((d1) => {
                                                                                                                        loop(data, data[d1])
                                                                                                                    })
                                                                                                                } else {
                                                                                                                    setTimeout(() => {
                                                                                                                        ogArray.splice(ogArray.findIndex((dd: any) => {
                                                                                                                            return dd === data
                                                                                                                        }), 1)
                                                                                                                    })
                                                                                                                }
                                                                                                            }
                                                                                                        }

                                                                                                        const formFormat = JSON.parse(JSON.stringify(page_config.formFormat))
                                                                                                        loop(formFormat, formFormat)

                                                                                                        return new Promise((resolve) => {
                                                                                                            setTimeout(() => {
                                                                                                                resolve(formFormat)
                                                                                                            }, 20)
                                                                                                        })
                                                                                                    }

                                                                                                    return {
                                                                                                        bind: vm.id,
                                                                                                        view: async () => {
                                                                                                            let refer_form: any = getReferForm(widget);

                                                                                                            function refresh(widget: any, device: 'mobile' | 'desktop' | 'def') {
                                                                                                                let refer_form: any = ((widget.data.refer_app)) ? ((widget.data.refer_form_data || page_config.formData) || {}) : page_config.formData;
                                                                                                                if (widget.data.refer_app) {
                                                                                                                    widget.data.refer_form_data = refer_form;
                                                                                                                    if (pageData.id !== id) {
                                                                                                                        glitter.share.editorViewModel.saveArray[pageData.id] = (() => {
                                                                                                                            return new Promise(async (resolve, reject) => {
                                                                                                                                await ApiPageConfig.setPage({
                                                                                                                                    id: id as any,
                                                                                                                                    appName: (window as any).appName,
                                                                                                                                    tag: (parent_array).tag,
                                                                                                                                    config: parent_array
                                                                                                                                });
                                                                                                                                resolve(true)
                                                                                                                            })
                                                                                                                        });
                                                                                                                        try {
                                                                                                                            (window as any).glitterInitialHelper.share[`getPageData-${parent_array.tag}`].data.response.result[0].config = parent_array;
                                                                                                                        } catch {

                                                                                                                        }
                                                                                                                    }
                                                                                                                    if (!widget.storage) {
                                                                                                                        try {
                                                                                                                            const doc: any = (((document.querySelector('#editerCenter iframe') as any)!.contentWindow as any).document).querySelectorAll(`.${widget.data.refer_app}_${widget.data.tag}`)!;
                                                                                                                            if (doc) {
                                                                                                                                for (const b of doc) {
                                                                                                                                    b.updatePageConfig(refer_form, device)
                                                                                                                                }
                                                                                                                            }
                                                                                                                        } catch (e) {

                                                                                                                        }
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    glitter.share.editorViewModel.saveArray[pageData.id] = (() => {
                                                                                                                        return ApiPageConfig.setPage({
                                                                                                                            id: pageData.id,
                                                                                                                            appName: pageData.appName,
                                                                                                                            tag: pageData.tag,
                                                                                                                            page_config: pageData.page_config,
                                                                                                                        })
                                                                                                                    });
                                                                                                                    try {
                                                                                                                        (window as any).glitterInitialHelper.share[`getPageData-${pageData.tag}`].data.response.result[0].page_config = pageData.page_config;
                                                                                                                    } catch {

                                                                                                                    }
                                                                                                                }
                                                                                                                widget.storage && widget.storage.updatePageConfig && widget.storage.updatePageConfig(refer_form, device);
                                                                                                            }

                                                                                                            const setting_option = [
                                                                                                                {
                                                                                                                    title: "樣式設定",
                                                                                                                    key: 'style',
                                                                                                                    array: await filterFormat((dd) => {
                                                                                                                        if (type === 'def' || oWidget[`${type}_editable`].find((d1: any) => {
                                                                                                                            return d1 === dd.key
                                                                                                                        })) {
                                                                                                                            return dd.page !== 'color_theme' && dd.category === 'style'
                                                                                                                        } else {
                                                                                                                            return false
                                                                                                                        }
                                                                                                                    })
                                                                                                                },
                                                                                                                {
                                                                                                                    title: "顏色設定",
                                                                                                                    key: 'color',
                                                                                                                    array: await filterFormat((dd) => {
                                                                                                                        if (type === 'def' || oWidget[`${type}_editable`].find((d1: any) => {
                                                                                                                            return d1 === dd.key
                                                                                                                        })) {
                                                                                                                            return dd.page === 'color_theme'
                                                                                                                        } else {
                                                                                                                            return false
                                                                                                                        }
                                                                                                                    })
                                                                                                                },
                                                                                                                {
                                                                                                                    title: "間距設定",
                                                                                                                    key: 'margin',
                                                                                                                    array: []
                                                                                                                },
                                                                                                                {
                                                                                                                    title: "開發者設定",
                                                                                                                    key: 'develop',
                                                                                                                    array: []
                                                                                                                }
                                                                                                            ].filter((dd: any) => {
                                                                                                                switch (dd.key) {
                                                                                                                    case 'style':
                                                                                                                    case 'color':
                                                                                                                        return (dd.array && dd.array.length > 0)
                                                                                                                    case 'margin':
                                                                                                                    case 'develop':
                                                                                                                        return (type === 'def' || oWidget[`${type}_editable`].filter((d1: any) => {
                                                                                                                            return d1 === '_container_margin'
                                                                                                                        }).length)
                                                                                                                }
                                                                                                            })
                                                                                                            try {
                                                                                                                if (vm.page === 'editor') {

                                                                                                                    return [
                                                                                                                        type === 'def' ? `` : gvc.bindView(() => {
                                                                                                                            const id = gvc.glitter.getUUID()
                                                                                                                            return {
                                                                                                                                bind: id,
                                                                                                                                view: () => {
                                                                                                                                    try {
                                                                                                                                        return html`
                                                                                                                                            <h3 class="my-auto tx_title fw-normal d-flex"
                                                                                                                                                style="white-space: nowrap;font-size: 16px;">
                                                                                                                                                    在${(() => {
                                                                                                                                            if (type === "mobile") {
                                                                                                                                                return `手機`
                                                                                                                                            } else {
                                                                                                                                                return `電腦`
                                                                                                                                            }
                                                                                                                                        })()}
                                                                                                                                                    版上${(widget.refer === 'hide') ? `不` : ``}
                                                                                                                                                顯示</h3>
                                                                                                                                            ${GlobalWidget.switchButton(gvc, widget.refer !== 'hide', (bool) => {
                                                                                                                                            // vm.data.main = bool;
                                                                                                                                            if (bool) {
                                                                                                                                                widget.refer = 'def'
                                                                                                                                            } else {
                                                                                                                                                widget.refer = 'hide'
                                                                                                                                            }
                                                                                                                                            gvc.notifyDataChange(id)
                                                                                                                                        })}`
                                                                                                                                    } catch (e) {
                                                                                                                                        console.log(`error`, e)
                                                                                                                                        return `${e}`
                                                                                                                                    }

                                                                                                                                },
                                                                                                                                divCreate: {
                                                                                                                                    class: `d-flex align-content-center my-2 mx-3 mt-3`,
                                                                                                                                    style: `gap:10px;`
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }),
                                                                                                                        type === 'def' ? `` : html`
                                                                                                                            <div class="my-2 mx-3 "
                                                                                                                                 style=" height: 40px; padding: 6px 18px;background: #393939; border-radius: 10px; overflow: hidden;
width: calc(100% - 30px);
justify-content: center; align-items: center; gap: 8px; display: inline-flex;cursor: pointer;"
                                                                                                                                 onclick="${gvc.event(() => {
                                                                                                                            const cGvc = gvc
                                                                                                                            EditorElem.openEditorDialog(gvc, (gvc: GVC) => {

                                                                                                                                return html`
                                                                                                                                             <div class="p-3">
                                                                                                                                                 ${[
                                                                                                                                    BgWidget.multiCheckboxContainer(
                                                                                                                                        gvc,
                                                                                                                                        page_config.formFormat.map((dd: any) => {
                                                                                                                                            return {
                                                                                                                                                key: dd.key,
                                                                                                                                                name: dd.title
                                                                                                                                            }
                                                                                                                                        }).concat({
                                                                                                                                            key: '_container_margin',
                                                                                                                                            name: '容器間距'
                                                                                                                                        }),
                                                                                                                                        oWidget[`${type}_editable`] || [],
                                                                                                                                        (select: any) => {
                                                                                                                                            oWidget[`${type}_editable`] = select
                                                                                                                                        }
                                                                                                                                    ),
                                                                                                                                    html`
                                                                                                                                                         <div class="d-flex justify-content-end"
                                                                                                                                                              style="gap:10px;">
                                                                                                                                                             ${BgWidget.cancel(gvc.event(() => {
                                                                                                                                        gvc.closeDialog()
                                                                                                                                    }))}
                                                                                                                                                             ${BgWidget.save(gvc.event(() => {
                                                                                                                                        refresh(oWidget, type)
                                                                                                                                        cGvc.notifyDataChange(id)
                                                                                                                                        gvc.closeDialog()
                                                                                                                                    }), '完成')}
                                                                                                                                                         </div>`
                                                                                                                                ].join('')}
                                                                                                                                             </div>`
                                                                                                                            }, () => {
                                                                                                                            }, 569, '設置自定義選項')
                                                                                                                        })}">
                                                                                                                                <div style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                                                                                                                    設置自定義選項
                                                                                                                                </div>
                                                                                                                            </div>`,
                                                                                                                        FormWidget.editorView({
                                                                                                                            gvc: gvc,
                                                                                                                            array: await filterFormat((dd) => {
                                                                                                                                if (type === 'def' || oWidget[`${type}_editable`].find((d1: any) => {
                                                                                                                                    return d1 === dd.key
                                                                                                                                })) {
                                                                                                                                    return dd.page !== 'color_theme' && dd.category !== 'style'
                                                                                                                                } else {
                                                                                                                                    return false
                                                                                                                                }
                                                                                                                            }),
                                                                                                                            refresh: () => {
                                                                                                                                refresh(widget, type)
                                                                                                                            },
                                                                                                                            formData: refer_form,
                                                                                                                            widget: pageData.config
                                                                                                                        }),
                                                                                                                        html`
                                                                                                                            <div class="p-3 mt-3 d-flex align-items-center ${setting_option.length > 0 ? `` : `d-none`}"
                                                                                                                                 style="font-size: 16px;
cursor: pointer;
border-top: 1px solid #DDD;
font-style: normal;
gap:10px;
font-weight: 700;" onclick="${gvc.event(() => {
                                                                                                                            vm.page = 'setting'
                                                                                                                            gvc.notifyDataChange(id)
                                                                                                                        })}">
                                                                                                                                設定
                                                                                                                                <i class="fa-solid fa-angle-right"></i>
                                                                                                                            </div>`
                                                                                                                    ].join('')
                                                                                                                } else if (vm.page === 'setting') {
                                                                                                                    return [setting_option.map((dd: any) => {
                                                                                                                        return gvc.bindView(() => {
                                                                                                                            const vm_c: {
                                                                                                                                id: string,
                                                                                                                                toggle: boolean
                                                                                                                            } = {
                                                                                                                                id: gvc.glitter.getUUID(),
                                                                                                                                toggle: false
                                                                                                                            }
                                                                                                                            return {
                                                                                                                                bind: vm_c.id,
                                                                                                                                view: () => {
                                                                                                                                    const array_string = [html`
                                                                                                                                        <div class="hoverF2 d-flex align-items-center p-3"
                                                                                                                                             onclick="${gvc.event(() => {
                                                                                                                                        vm_c.toggle = !vm_c.toggle
                                                                                                                                        gvc.notifyDataChange(vm_c.id)
                                                                                                                                    })}">
<span class="fw-500"
      style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${dd.title}</span>
                                                                                                                                            <div class="flex-fill"></div>
                                                                                                                                            ${vm_c.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : ` <i class="fa-solid fa-chevron-right"></i>`}

                                                                                                                                        </div>`]

                                                                                                                                    if (vm_c.toggle) {
                                                                                                                                        switch (dd.key) {
                                                                                                                                            case 'style':
                                                                                                                                            case 'color':
                                                                                                                                                (dd.array && dd.array.length > 0) && array_string.push(`<div class="px-1 pb-3 mt-n2">${FormWidget.editorView({
                                                                                                                                                    gvc: gvc,
                                                                                                                                                    array: dd.array.map((dd: any) => {
                                                                                                                                                        if (dd.page === 'color_theme') {
                                                                                                                                                            dd.title = ''
                                                                                                                                                        }
                                                                                                                                                        return dd
                                                                                                                                                    }),
                                                                                                                                                    refresh: () => {
                                                                                                                                                        refresh(widget, type)
                                                                                                                                                    },
                                                                                                                                                    formData: refer_form,
                                                                                                                                                    widget: pageData.config
                                                                                                                                                })}</div>`)
                                                                                                                                                break
                                                                                                                                            case 'margin':
                                                                                                                                                array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorMargin(gvc, widget, () => {
                                                                                                                                                    refresh(widget, type)
                                                                                                                                                })}</div>`)
                                                                                                                                                break
                                                                                                                                            case 'develop':
                                                                                                                                                array_string.push(`<div class="px-3">${CustomStyle.editor(gvc, widget, () => {
                                                                                                                                                    refresh(widget, type)
                                                                                                                                                })}</div>`)
                                                                                                                                                break
                                                                                                                                        }
                                                                                                                                    }

                                                                                                                                    return array_string.join('')
                                                                                                                                },
                                                                                                                                divCreate: {
                                                                                                                                    class: `border-bottom`,
                                                                                                                                    style: `cursor: pointer;color:#393939;border-radius: 0px;gap:10px;`
                                                                                                                                }
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }).join('')].join('')
                                                                                                                } else {
                                                                                                                    return ``
                                                                                                                }
                                                                                                            } catch (e) {
                                                                                                                console.log(`render-error`, e)
                                                                                                                return ``
                                                                                                            }

                                                                                                        }
                                                                                                    }
                                                                                                }))
                                                                                                return `<div class="mx-n2">${array_html.join('')}</div>`
                                                                                            } catch (e) {
                                                                                                console.log(`error--->`, e)
                                                                                                return ``
                                                                                            }

                                                                                        },
                                                                                        custom_edit: true,
                                                                                        toggle_visible: (bool) => {
                                                                                            alert(bool)
                                                                                            if (bool) {
                                                                                                $((document.querySelector('#editerCenter  iframe') as any).contentWindow.document.querySelector('.' + view_container_id)).show()
                                                                                            } else {
                                                                                                $((document.querySelector('#editerCenter  iframe') as any).contentWindow.document.querySelector('.' + view_container_id)).hide()
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                ].join('')
                                                                            },
                                                                            onDestroy: () => {
                                                                            },
                                                                            divCreate: {
                                                                                class: ``
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }

                                                            pageData.config.tag = pageData.tag;
                                                            appendHtml(pageData, widget, true, pageData.id, pageData.config)

                                                            async function loop(array: any, id: string, parent_config: any) {
                                                                for (const dd of array) {
                                                                    if (dd.type === 'container') {
                                                                        await loop(dd.data.setting, id, parent_config)
                                                                    } else if (dd.type === 'component') {
                                                                        const pageData: any = await getPageData(dd.data.refer_app ? {
                                                                            tag: dd.data.tag,
                                                                            appName: dd.data.refer_app
                                                                        } : dd.data.tag);
                                                                        appendHtml(pageData, dd, false, (dd.data.refer_app) ? id : pageData.id, parent_config);
                                                                        if (!dd.data.refer_app) {
                                                                            pageData.config.tag = pageData.tag;
                                                                            await loop(pageData.config ?? [], pageData.id, pageData.config);
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                            await loop(pageData.config, pageData.id, pageData.config)

                                                            if (!html) {
                                                                resolve(`<div class="d-flex align-items-center justify-content-center flex-column w-100"
                                         style="width:100%;">
                                        <lottie-player style="max-width: 100%;width: 200px;"
                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                       speed="1" loop="true"
                                                       background="transparent"></lottie-player>
                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                            style="line-height: 200%;text-align: center;">
                                            此模塊無可編輯內容。</h3>
                                    </div>`)
                                                            } else {
                                                                resolve(html)
                                                            }

                                                        })
                                                    }
                                                }
                                            })
                                        ].join('')
                                    }
                                },
                                divCreate: {
                                    class: 'pb-2'
                                },
                                onCreate: () => {
                                    $('.tooltip').remove();
                                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                }
                            }
                        })
                    }

                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            let toggle = true
                            return {
                                bind: id,
                                view: () => {
                                    return html`
                                        <div class="${Storage.select_function === 'user-editor' ? `d-none` : ``} mx-0 d-flex  px-3 hi fw-bold d-flex align-items-center shadow border-bottom  py-2 bgf6 "
                                             style="color:black;cursor: pointer;font-size:15px;"
                                             onclick="${gvc.event(() => {
                                        toggle = !toggle
                                        gvc.notifyDataChange(id)
                                    })}">
                                            內容編輯
                                            <div class="flex-fill"></div>
                                            ${toggle ? ` <i class="fa-solid fa-chevron-up d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>` : ` <i class="fa-solid  fa-angle-down d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>`}
                                        </div>
                                        <div class="p-2">
                                            ${(toggle) ? userEditorView() : ``}
                                            <div style="height:10px;"></div>
                                        </div>
                                    `
                                },
                                divCreate: {
                                    class: `mx-n2 mt-n2`, style: ``
                                }
                            }
                        }),
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            let toggle = false
                            return {
                                bind: id,
                                view: () => {
                                    return html`
                                        <div class="${Storage.select_function === 'user-editor' ? `d-none` : ``} mx-0 d-flex   border-top px-3 hi fw-bold d-flex align-items-center shadow border-bottom  py-2 bgf6"
                                             style="color:black;cursor: pointer;font-size:15px;"
                                             onclick="${gvc.event(() => {
                                        toggle = !toggle
                                        gvc.notifyDataChange(id)
                                    })}">
                                            模塊進階設定
                                            <div class="flex-fill"></div>
                                            ${toggle ? ` <i class="fa-solid fa-chevron-up d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>` : ` <i class="fa-solid  fa-angle-down d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>`}
                                        </div>
                                        ${(toggle) ? `<div class="p-2 border-bottom">
${devEditorView()}
</div>` : ``}

                                    `
                                },
                                divCreate: {
                                    class: `mx-n2 mt-n3`, style: ``
                                }
                            }
                        })
                    ].join(`<div style=""></div>`)
                }
            }
        }
    }
})

