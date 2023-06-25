import {HtmlGenerate} from "../glitterBundle/module/Html_generate.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {initialCode} from "./initialCode.js";
import {initialStyle} from "./initialStyle.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";

export function appSetting(gvc: GVC, viewModel: any, id: string) {
    const glitter = (window as any).glitter
    const tabIndex = [
        {
            title: '前端模塊 / Component',
            index: 'pageSet',
            html: (() => {
                return gvc.bindView(() => {
                    const id = glitter.getUUID()
                    return {
                        bind: id,
                        view: () => {
                            return `
<div class="alert shadow" style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);">
<div class="alert alert-warning" style="white-space: normal;word-break: break-all;">頁面模塊決定您能夠在網站上使用哪些設計模塊。您可以從官方或第三方資源中獲取連結，或自行開發插件上傳以供使用。</div>
${EditorElem.arrayItem({
                                originalArray: viewModel.pluginList,
                                gvc: gvc,
                                title: '頁面模塊',
                                array: viewModel.pluginList.map((dd: any, index: number) => {
                                    return {
                                        title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                        innerHtml: (() => {
                                            return ` ${HtmlGenerate.editeInput({
                                                gvc,
                                                title: '自定義插件名稱',
                                                default: dd.name,
                                                placeHolder: '自定義插件名稱',
                                                callback: (text) => {
                                                    dd.name = text;
                                                    gvc.notifyDataChange(id)
                                                }
                                            })}
                                                     ${HtmlGenerate.editeInput({
                                                gvc,
                                                title: '模板路徑',
                                                default: dd.src.official,
                                                placeHolder: '模板路徑',
                                                callback: (text) => {
                                                    dd.src.official = text;
                                                }
                                            })}`
                                        }),
                                        expand: dd,
                                        minus: gvc.event(() => {
                                            viewModel.pluginList.splice(index, 1);
                                            gvc.notifyDataChange(id);
                                        })
                                    }
                                }),
                                expand: undefined,
                                plus: {
                                    title: '添加頁面模塊',
                                    event: gvc.event(() => {
                                        viewModel.pluginList.push({
                                            name: '',
                                            route: '',
                                            src: {
                                                official: '',
                                                staging: '',
                                                open: true
                                            }
                                        });
                                        gvc.notifyDataChange(id);
                                    }),
                                },
                                refreshComponent: () => {
                                    gvc.notifyDataChange(id);
                                }
                            })}
</div>`
                        },
                        divCreate: {}
                    }
                })
            })()
        },
        {
            title: '觸發事件 / Event',
            index: 'pageCode',
            html: gvc.bindView(() => {
                const id = glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return `
<div class="alert shadow" style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);">
<div class="alert alert-warning" style="white-space: normal;word-break: break-all;">觸發事件包含了網頁上所設定的點擊、滑動、焦點觸發、預載....等事件。您可以從官方或第三方資源中獲取連結，或自行開發插件上傳以供使用．</div>
${EditorElem.arrayItem({
                            originalArray: viewModel.initialJS,
                            gvc: gvc,
                            title: '頁面模塊',
                            array: viewModel.initialJS.map((dd: any, index: number) => {
                                return {
                                    title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                    innerHtml: (() => {
                                        return `      ${HtmlGenerate.editeInput({
                                            gvc,
                                            title: '自定義插件名稱',
                                            default: dd.name,
                                            placeHolder: '自定義插件名稱',
                                            callback: (text) => {
                                                dd.name = text;
                                                gvc.notifyDataChange(id)
                                            }
                                        })}
                                                     ${HtmlGenerate.editeInput({
                                            gvc,
                                            title: '正式區',
                                            default: dd.src.official,
                                            placeHolder: '正式區路徑',
                                            callback: (text) => {
                                                dd.src.official = text;
                                                gvc.notifyDataChange(id)
                                            }
                                        })}`
                                    }),
                                    expand: dd,
                                    minus: gvc.event(() => {
                                        viewModel.initialJS.splice(index, 1);
                                        gvc.notifyDataChange(id);
                                    })
                                }
                            }),
                            expand: undefined,
                            plus: {
                                title: '添加頁面模塊',
                                event: gvc.event(() => {
                                    viewModel.initialJS.push({
                                        name: '',
                                        route: '',
                                        src: {
                                            official: '',
                                            open: true
                                        }
                                    });
                                    gvc.notifyDataChange(id);
                                }),
                            },
                            refreshComponent: () => {
                                gvc.notifyDataChange(id);
                            }
                        })}
</div>`
                    },
                    divCreate: {}
                }
            })
        },
        {
            title: '應用初始化 / Initial',
            index: 'pageConfig',
            html: `<div class="alert shadow" style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);white-space: normal;word-break: break-all;">${initialCode(gvc, viewModel, id)}</div>`
        },
        {
            title: '後台插件 / Backend',
            index: 'backendSet',
            html: (() => {
                return gvc.bindView(() => {
                    const id = glitter.getUUID()
                    return {
                        bind: id,
                        view: () => {
                            return `
<div class="alert shadow" style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);">
<div class="alert alert-warning" style="white-space: normal;word-break: break-all;">包括管理員後台系統所需的後台編輯功能，可能涉及的項目包括用戶管理、商品上架、訂單管理、應用審核、金流設定以及 APP 送審....等．</div>
${EditorElem.arrayItem({
                                originalArray: viewModel.backendPlugins,
                                gvc: gvc,
                                title: '頁面模塊',
                                array: viewModel.backendPlugins.map((dd: any, index: number) => {
                                    return {
                                        title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                        innerHtml: (() => {
                                            return ` ${HtmlGenerate.editeInput({
                                                gvc,
                                                title: '自定義插件名稱',
                                                default: dd.name,
                                                placeHolder: '自定義插件名稱',
                                                callback: (text) => {
                                                    dd.name = text;
                                                    gvc.notifyDataChange(id)
                                                }
                                            })}
                                                     ${HtmlGenerate.editeInput({
                                                gvc,
                                                title: '模板路徑',
                                                default: dd.src.official,
                                                placeHolder: '模板路徑',
                                                callback: (text) => {
                                                    dd.src.official = text;
                                                }
                                            })}`
                                        }),
                                        expand: dd,
                                        minus: gvc.event(() => {
                                            viewModel.backendPlugins.splice(index, 1);
                                            gvc.notifyDataChange(id);
                                        })
                                    }
                                }),
                                expand: undefined,
                                plus: {
                                    title: '添加頁面模塊',
                                    event: gvc.event(() => {
                                        viewModel.backendPlugins.push({
                                            name: '',
                                            route: '',
                                            src: {
                                                official: '',
                                                staging: '',
                                                open: true
                                            }
                                        });
                                        gvc.notifyDataChange(id);
                                    }),
                                },
                                refreshComponent: () => {
                                    gvc.notifyDataChange(id);
                                }
                            })}
</div>`
                        },
                        divCreate: {}
                    }
                })
            })()
        },
        {
            title: '全域設計 / Global Style',
            index: 'initialStyle',
            html: `<div class="alert shadow" style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);white-space: normal;word-break: break-all;">${initialStyle(gvc, viewModel, id)}</div>`
        }]
    return `
 <ul class="nav nav-tabs border-bottom " id="myTab" role="tablist">
  ${(() => {
        return tabIndex.map((dd, index) => {
            return `<li class="nav-item" role="presentation">
    <button class="nav-link ${(index === 0) ? `active` : ``}"  data-bs-toggle="tab" data-bs-target="#${dd.index}" type="button" role="tab" aria-controls="${dd.index}" aria-selected="${index === 0}">${dd.title}</button>
  </li>`
        }).join('')
    })()}
</ul>
<div class="tab-content" id="pills-tabContent">
   ${(() => {
        return tabIndex.map((dd, index) => {
            return `<div class="tab-pane ${(index === 0) ? `show active` : `fade`}" id="${dd.index}" role="tabpanel" aria-labelledby="profile-tab">
${dd.html}</div>`
        }).join('')
    })()}
</div>
    `
}

export function appCreate(gvc: GVC, viewModel: any, id: string) {
    const saasConfig: {
        config: any,
        api: any
    } = (window as any).saasConfig
    const glitter = (window as any).glitter
    let postVM: any = {
        appName: '',
        storeName: '',
        storeTitle: '',
        bundleName: '',
        keyWord: '',
        logo: '',
        logo_stored: '',
        prmote_string: '',
        privacy: ''
    }
    const dialog = new ShareDialog(gvc.glitter)

    function submit() {
        dialog.dataLoading({text: '設定中', visible: true})
        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "glitter_appPost", postVM).then((r: { response: any, result: boolean }) => {
            dialog.dataLoading({visible: false})
            if (r.response) {
                dialog.successMessage({text: "送審成功"})
            } else {
                dialog.errorMessage({text: "送審失敗"})
            }
        })
    }

    function save() {
        dialog.dataLoading({text: '設定中', visible: true})
        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "glitter_appPost", postVM).then((r: { response: any, result: boolean }) => {
            dialog.dataLoading({visible: false})
            if (r.response) {
                dialog.successMessage({text: "儲存成功"})
            } else {
                dialog.errorMessage({text: "送審失敗"})
            }
        })
    }


    const tabIndex = [
        {
            title: 'IOS 應用生成',
            index: 'Create IOS',
            html: (() => {
                const id = glitter.getUUID()
                let load=false
                saasConfig.api.getPrivateConfig(saasConfig.config.appName, "glitter_appPost").then((r: { response: any, result: boolean }) => {
                    if (r.response.result[0]) {
                        postVM = r.response.result[0].value
                    }
                    load=true
                    gvc.notifyDataChange(id)
                })
                return gvc.bindView(() => {
                    return {
                        bind: id,
                        view: () => {
                            if(!load){
                                return `                                        <div class="d-flex align-items-center justify-content-center w-100 flex-column">
                                        <div class="spinner-border" role="status">
  <span class="sr-only"></span>
</div>
<span class="mt-2">加載中...</span>
</div>`
                            }
                            return `${EditorElem.h3("<span style='font-size:20px;color:orangered;'>基本設定</span>")}
  ${[
                                `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">APP名稱</h3>
${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    placeHolder: `請輸入APP名稱`,
                                    default: postVM.appName,
                                    callback: (text: string) => {
                                        postVM.appName = text
                                    }
                                })}</div>`,
                                `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">BundleID</h3>
${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    placeHolder: `請輸入BundleID`,
                                    default: postVM.bundleName,
                                    callback: (text: string) => {
                                        postVM.bundleName = text
                                    }
                                })}</div>`,
                                `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="m-0 ">LOGO</h3>
${uploadImage({
                                    gvc: gvc,
                                    title: ``,
                                    def: postVM.logo ?? "",
                                    callback: (data) => {
                                        postVM.logo = data
                                    }
                                })}</div>`
                                ,

                            ].map((dd) => {
                                return `<div class="col-sm-6 pb-2  pt-3">${dd}</div>`
                            }).join(``)}
  <div class="col-12 mt-4 mb-2 bg-dark" style="height:2px;"></div>
<div class="row pt-0 justify-content-start" >
${EditorElem.h3("<span style='font-size:20px;color:orangered;'>上架設定</span>")}
  ${[
                                `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">商店名稱</h3>
${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    placeHolder: `請輸入商店顯示名稱`,
                                    default: postVM.storeName,
                                    callback: (text: string) => {
                                        postVM.storeName = text
                                    }
                                })}</div>`,
                                `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">關鍵字</h3>
${glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    placeHolder: `請輸入商店顯示關鍵字`,
                                    default: postVM.keyWord,
                                    callback: (text: string) => {
                                        postVM.keyWord = text
                                    }
                                })}</div>`,
                                `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="m-0 ">商店Logo</h3>
${uploadImage({
                                    gvc: gvc,
                                    title: ``,
                                    def: postVM.logo_stored ?? "",
                                    callback: (data) => {
                                        postVM.logo_stored = data
                                    }
                                })}</div>`
                            ].map((dd) => {
                                return `<div class="col-sm-6 pb-2  pt-3">${dd}</div>`
                            }).join(``)}
  <div class="w-100 my-3" style="height:1px;background:lightgray;"></div>
  <div class="w-100 col-12 d-flex flex-column  justify-content-start align-items-start mt-2" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 mt-0 ">行銷描述</h3>
${glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: '',
                                placeHolder: `請輸入行銷描述`,
                                default: postVM.prmote_string,
                                callback: (text: string) => {
                                    postVM.prmote_string = text
                                }
                            })}
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 mt-2 ">隱私權政策</h3>
${glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: '',
                                placeHolder: `請輸入隱私權政策`,
                                default: postVM.privacy,
                                callback: (text: string) => {
                                    postVM.privacy = text
                                }
                            })}
</div>
</div>
</div>
<div class="d-flex justify-content-end mt-2" style="padding-right: 30px;">
<button class="btn btn-warning text-dark rounded mt-2 me-2" onclick="${gvc.event(() => {
                                save()
                            })}"><i class="fa-regular fa-floppy-disk me-2"></i>儲存</button>
<button class="btn btn-primary  rounded mt-2 " onclick="${gvc.event(() => {
                                submit()
                            })}">提交審核</button></div>`
                        },
                        divCreate: {
                            class: `row pt-0 justify-content-start`
                        }
                    }
                })
            })()
        }, {
            title: 'Android 應用生成',
            index: 'Create IOS',
            html: (() => {
                return `<div class="row pt-0 justify-content-start" >
${EditorElem.h3("<span style='font-size:20px;color:orangered;'>基本設定</span>")}
  ${[
                    `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">APP名稱</h3>
${glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: '',
                        placeHolder: `請輸入APP名稱`,
                        default: postVM.appName,
                        callback: (text: string) => {
                            postVM.appName = text
                        }
                    })}</div>`,
                    `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">BundleID</h3>
${glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: '',
                        placeHolder: `請輸入BundleID`,
                        default: postVM.bundleName,
                        callback: (text: string) => {
                            postVM.bundleName = text
                        }
                    })}</div>`,
                    `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="m-0 ">LOGO</h3>
${uploadImage({
                        gvc: gvc,
                        title: ``,
                        def: postVM.logo ?? "",
                        callback: (data) => {
                            postVM.logo = data
                        }
                    })}</div>`
                    ,

                ].map((dd) => {
                    return `<div class="col-sm-6 pb-2  pt-3">${dd}</div>`
                }).join(``)}
  <div class="col-12 mt-4 mb-2 bg-dark" style="height:2px;"></div>
<div class="row pt-0 justify-content-start" >
${EditorElem.h3("<span style='font-size:20px;color:orangered;'>上架設定</span>")}
  ${[
                    `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">商店名稱</h3>
${glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: '',
                        placeHolder: `請輸入APP名稱`,
                        default: postVM.appName,
                        callback: (text: string) => {
                            postVM.appName = text
                        }
                    })}</div>`,
                    `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2 ">關鍵字</h3>
${glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: '',
                        placeHolder: `請輸入APP名稱`,
                        default: postVM.appName,
                        callback: (text: string) => {
                            postVM.appName = text
                        }
                    })}</div>`,
                    `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="m-0 ">商店Logo</h3>
${uploadImage({
                        gvc: gvc,
                        title: ``,
                        def: postVM.logo ?? "",
                        callback: (data) => {
                            postVM.logo = data
                        }
                    })}</div>`
                ].map((dd) => {
                    return `<div class="col-sm-6 pb-2  pt-3">${dd}</div>`
                }).join(``)}
  <div class="w-100 d-flex flex-column  justify-content-start align-items-start mt-2" style="">
<h3 style="font-size: 16px;min-width: 80px;" class="mb-2  mt-0 ">行銷描述</h3>
${glitter.htmlGenerate.editeText({
                    gvc: gvc,
                    title: '',
                    placeHolder: `請輸入APP名稱`,
                    default: postVM.appName,
                    callback: (text: string) => {
                        postVM.appName = text
                    }
                })}</div>
</div>
<div class="d-flex justify-content-end mt-2" style="padding-right: 30px;">
<button class="btn btn-warning text-dark rounded mt-2 ms-auto">提交審核</button>
</div>
`
            })()
        }]
    return `
 <ul class="nav nav-tabs border-bottom " id="myTab" role="tablist">
  ${(() => {
        return tabIndex.map((dd, index) => {
            return `<li class="nav-item" role="presentation">
    <button class="nav-link ${(index === 0) ? `active` : ``}"  data-bs-toggle="tab" data-bs-target="#${dd.index}" type="button" role="tab" aria-controls="${dd.index}" aria-selected="${index === 0}">${dd.title}</button>
  </li>`
        }).join('')
    })()}
</ul>
<div class="tab-content" id="pills-tabContent" style="overflow-x:hidden;">
   ${(() => {
        return tabIndex.map((dd, index) => {
            return `<div class="tab-pane ${(index === 0) ? `show active` : `fade`}" id="${dd.index}" role="tabpanel" aria-labelledby="profile-tab">
${dd.html}</div>`
        }).join('')
    })()}
</div>
    `
}


export function fileManager(gvc: GVC, viewModel: any, id: string) {
    const glitter=gvc.glitter
    let fileVm:any={
        data:[]
    }
    const saasConfig: {
        config: any,
        api: any
    } = (window as any).saasConfig
    const dialog = new ShareDialog(gvc.glitter)
    function save() {
        dialog.dataLoading({text: '設定中', visible: true})
        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "glitter_fileStored", fileVm).then((r: { response: any, result: boolean }) => {
            dialog.dataLoading({visible: false})
            if (r.response) {
                dialog.successMessage({text: "儲存成功"})
            } else {
                dialog.errorMessage({text: "送審失敗"})
            }
        })
    }
    return `
    <h3 class="fw-bold" style="font-size:25px;color:orangered;">檔案資源管理</h3>
${gvc.bindView(()=>{
    const id=glitter.getUUID()
        let load=false
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, "glitter_fileStored").then((r: { response: any, result: boolean }) => {
            if (r.response.result[0]) {
                fileVm = r.response.result[0].value
            }
            load=true
            gvc.notifyDataChange(id)
        })
        return {
        bind:id,
            view:()=>{
            if(!load){
                return  `                                        <div class="d-flex align-items-center justify-content-center w-100 flex-column">
                                        <div class="spinner-border" role="status">
  <span class="sr-only"></span>
</div>
<span class="mt-2">加載中...</span>
</div>`
            }
            return EditorElem.arrayItem({
                gvc:gvc,
                outside:false,
                title:"檔案管理",
                array:fileVm.data.map((dd:any,index:number)=>{
                    return {
                        title:dd.title ?? ('資源:'+(index+1)),
                        innerHtml:()=>{
                            return [
                                glitter.htmlGenerate.editeInput({
                                    gvc:gvc,
                                    title:"標題",
                                    default:dd.title ?? "",
                                    placeHolder:"資源標題",
                                    callback:(text)=>{
                                        dd.title=text
                                        gvc.notifyDataChange(id)
                                    }
                                }),
                                EditorElem.uploadFile({
                                    gvc: gvc,
                                    title: `圖片上傳`,
                                    def: dd.src ?? "",
                                    callback: (d2:any) => {
                                        dd.src=d2
                                        gvc.notifyDataChange(id)
                                    },
                                })
                            ].join('')
                        },
                        expand:dd,
                        minus:gvc.event(()=>{
                            fileVm.data.splice(index,1)
                            gvc.notifyDataChange(id)
                        })
                    }
                }),
                originalArray:fileVm.data,
                expand:fileVm,
                plus:{
                    title: "添加資源",
                    event: gvc.event(()=>{
                        fileVm.data.push({})
                        gvc.notifyDataChange(id)
                    })
                },
                refreshComponent:()=>{

                }
            })
            },
            divCreate:{
            elem:`div`,class:`alert-secondary alert`
            }
        }
    })}
<div class="d-flex justify-content-end mt-2 " style="">
<button class="btn btn-warning text-dark rounded mt-2 " onclick="${gvc.event(() => {
        save()
    })}"><i class="fa-regular fa-floppy-disk me-2"></i>儲存</button></div>
    `
}


function uploadImage(obj: {
    title: string,
    gvc: any, def: string, callback: (data: string) => void
}) {
    const glitter = (window as any).glitter
    const id = glitter.getUUID()
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {

                return `
                          <input class="flex-fill form-control "  placeholder="請輸入圖片連結" value="${obj.def}" onchange="${obj.gvc.event((e: any) => {
                    obj.callback(e.value)
                    obj.gvc.notifyDataChange(id)
                })}">
                                <div class="" style="width: 1px;height: 25px;background-"></div>
                                <i class="fa-regular fa-upload text-dark ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
                    glitter.ut.chooseMediaCallback({
                        single: true,
                        accept: 'json,image/*',
                        callback(data: any) {
                            const saasConfig: {
                                config: any,
                                api: any
                            } = (window as any).saasConfig
                            const dialog = new ShareDialog(obj.gvc.glitter)
                            dialog.dataLoading({visible: true})
                            const file = data[0].file
                            saasConfig.api.uploadFile(file.name).then((data: any) => {
                                dialog.dataLoading({visible: false})
                                const data1 = data.response
                                dialog.dataLoading({visible: true})
                                $.ajax({
                                    url: data1.url,
                                    type: 'put',
                                    data: file,
                                    processData: false,
                                    crossDomain: true,
                                    success: (data2) => {
                                        dialog.dataLoading({visible: false})
                                        obj.callback(data1.fullUrl)
                                        obj.def = data1.fullUrl
                                        obj.gvc.notifyDataChange(id)
                                    },
                                    error: (err) => {
                                        dialog.dataLoading({visible: false})
                                        dialog.errorMessage({text: "上傳失敗"})
                                    },
                                });
                            })
                        }
                    });
                })}"></i>
                            ${obj.def && `<img src="${obj.def}"  class="ms-2" style="max-width: 150px;">`}
`
            },
            divCreate: {
                class: 'flex-fill d-flex align-items-center justify-content-center'
            }
        }
    })
}