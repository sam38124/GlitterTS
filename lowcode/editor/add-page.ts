import {GVC} from "../glitterBundle/GVController.js";
import {Storage} from "../glitterBundle/helper/storage.js";
import {AddComponent} from "./add-component.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {EditorConfig} from "../editor-config.js";

export class AddPage {
    public static refresh = () => {
    }

    public static view(gvc: GVC) {
        const html = String.raw
        const containerID = gvc.glitter.getUUID()
        const tabID = gvc.glitter.getUUID()
        let vm = {
            get type() {
                return Storage.select_page_type
            }
        }
        AddPage.refresh = () => {
            gvc.notifyDataChange([containerID, tabID])
        }
        return [
            html`
                <div class="w-100 d-flex align-items-center p-3 border-bottom">
                    <h5 class=" offcanvas-title  " >
                        添加畫面</h5>
                    <div class="flex-fill"></div>
                    <div class="fs-5 text-black" style="cursor: pointer;" onclick="${gvc.event(() => {
                        AddPage.toggle(false)
                    })}"><i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i></div>
                </div>
            `,
            ` <div class="px-2 my-2">
                               ${EditorElem.select({
                title:'',
                gvc:gvc,
                def:Storage.select_page_type  || 'page',
                array:EditorConfig.page_type_list,
                callback:(text:string)=>{
                    Storage.select_page_type = text as any
                    gvc.notifyDataChange(containerID)
                    gvc.notifyDataChange(tabID)
                }
            })}
                           </div>`,
            gvc.bindView(() => {
                return {
                    bind: containerID,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            AddComponent.addModuleView(gvc, vm.type, (tData: any) => {
                                gvc.glitter.setUrlParameter('page', tData.tag);
                                location.reload()
                            }, true).then((res) => {
                                resolve(res)
                            })
                        })
                    },
                    divCreate: {}
                }
            })
        ].join('')
    }

    public static leftNav(gvc: GVC) {
        const html = String.raw
        return html`
            <div class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                 id="addPageViewHover"
                 style="z-index: 99999;background: rgba(0,0,0,0.5);"
                 onclick="${gvc.event(() => {
                     AddPage.toggle(false)
                 })}"></div>

            <div id="addPageView"
                 class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:350px;z-index: 99999;left: -120%;">
                ${AddPage.view(gvc)}
            </div>`
    }

    public static toggle(visible: boolean) {
        if (visible) {
            $('#addPageViewHover').removeClass('d-none')
            $('#addPageView').removeClass('scroll-out')
            $('#addPageView').addClass('scroll-in')
            AddPage.refresh()
        } else {
            $('#addPageViewHover').addClass('d-none')
            $('#addPageView').addClass('scroll-out')
            $('#addPageView').removeClass('scroll-in')
        }

    }
}