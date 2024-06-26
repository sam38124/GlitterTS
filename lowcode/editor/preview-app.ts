import {init} from "../glitterBundle/GVController.js";
import {ViewType} from "../jspage/editor.js";

let viewType=ViewType.desktop
init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const html = String.raw
            return html`
                <div class="vw-100  vh-100 bg-white">
                    <div class="w-100  d-lg-flex justify-content-start border-bottom px-0" style="height: 56px;">
                        <div class="navbar-brand text-dark d-none d-lg-flex py-0 h-100">
                            <div class="d-flex align-items-center justify-content-center border-end "
                                 style="width:50px;height: 56px;" onclick="${gvc.event(() => {
                                gvc.closeDialog()
                                gvc.glitter.goBack()
                            })}">
                                <i class="fa-solid fa-left-to-bracket hoverBtn" style="cursor:pointer;"
                                   aria-hidden="true">
                                </i>
                            </div>
                            <span class="ms-3 fw-500 fs-6" style="color:black;">${gBundle.title || '預覽頁面'}</span>
                        </div>
                        <div class="position-absolute  translate-middle-x start-50" style="top:5px;">
                            ${gvc.bindView({
                                bind: `showViewIcon`,
                                view: () => {
                                    return html`
                                    <div style="background:#f1f1f1;border-radius:10px;"
                                         class="d-flex align-items-center justify-content-center p-1 ">
                                        <h3 class="m-0  mx-3" style="font-size:14px;">模式</h3>
                                        ${[
                                        {icon: 'fa-regular fa-desktop', type: ViewType.desktop},
                                        {icon: 'fa-regular fa-mobile', type: ViewType.mobile}
                                    ].map((dd) => {
                                        if (dd.type === viewType) {
                                            return html`
                                                    <div class="d-flex align-items-center justify-content-center bg-white"
                                                         style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;">
                                                        <i class="${dd.icon}"></i>
                                                    </div>`
                                        } else {
                                            return html`
                                                    <div class="d-flex align-items-center justify-content-center"
                                                         style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                         onclick="${gvc.event(() => {
                                                viewType = dd.type
                                                gvc.recreateView()
                                            })}">
                                                        <i class="${dd.icon}"></i>
                                                    </div>`
                                        }
                                    }).join('')}
                                    </div>`
                                },
                                divCreate: {}
                            })}
                        </div>
                    </div>
                    <div class="m-2 d-flex align-items-center justify-content-center" style="height:calc(100vh - 70px);">
                        
                        <iframe class="" src="${(()=>{
                            const url=new URL(`${glitter.root_path}${gBundle.page}${location.search}`);
                            url.searchParams.set('appName',gBundle.appName)
                            url.searchParams.delete('type')
                            return url.href
                        })()}"
                        style="border:2px solid lightgrey;${(viewType === ViewType.mobile ) ? `width: 414px;` : `width:100%;height:100%;`}
"
                        ></iframe>
                    </div>
                </div>

            `
        }
    }
})