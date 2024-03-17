var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Storage } from "../helper/storage.js";
import { AddComponent } from "./add-component.js";
export class AddPage {
    static view(gvc) {
        const html = String.raw;
        const containerID = gvc.glitter.getUUID();
        let vm = {
            type: Storage.select_page_type
        };
        return [
            html `
                <div class="w-100 d-flex align-items-center p-3 border-bottom">
                    <h5 class=" offcanvas-title  " style="">
                        添加畫面</h5>
                    <div class="flex-fill"></div>
                    <div class="fs-5 text-black" style="cursor: pointer;" onclick="${gvc.event(() => {
                AddPage.toggle(false);
            })}"><i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i></div>
                </div>
            `,
            gvc.bindView(() => {
                const tabID = gvc.glitter.getUUID();
                return {
                    bind: tabID,
                    view: () => {
                        return (() => {
                            let list = [{
                                    icon: `fa-sharp fa-regular fa-memo`,
                                    title: "網頁",
                                    type: 'page',
                                    desc: '首頁 / Landing page / 登入頁面 / 註冊頁面...等。'
                                }, {
                                    type: 'module',
                                    icon: `fa-regular fa-block`,
                                    title: "模塊",
                                    desc: 'Header / Footer / 輪播圖 / 廣告區塊...等。'
                                }, {
                                    type: 'article',
                                    icon: `fa-regular fa-file-dashed-line`,
                                    title: "樣板",
                                    desc: '用來決定頁面的統一外觀樣式。'
                                }];
                            return list.map((dd) => {
                                return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${(vm.type === dd.type) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : ``}
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.title}" onclick="${gvc.event(() => {
                                    vm.type = dd.type;
                                    gvc.notifyDataChange(containerID);
                                    gvc.notifyDataChange(tabID);
                                })}">
                              <i class="${dd.icon}" ></i>
                            </div>`;
                            }).join('');
                        })();
                    },
                    divCreate: {
                        class: `d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom`
                    },
                    onCreate: () => {
                        $('.tooltip').remove();
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }
                };
            }),
            gvc.bindView(() => {
                return {
                    bind: containerID,
                    view: () => {
                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            AddComponent.addModuleView(gvc, vm.type, (tData) => {
                                gvc.glitter.setUrlParameter('page', tData.tag);
                                location.reload();
                            }, true).then((res) => {
                                resolve(res);
                            });
                        }));
                    },
                    divCreate: {}
                };
            })
        ].join('');
    }
    static leftNav(gvc) {
        const html = String.raw;
        return html `
            <div class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                 id="addPageViewHover"
                 style="z-index: 99999;background: rgba(0,0,0,0.5);"
                 onclick="${gvc.event(() => {
            AddPage.toggle(false);
        })}"></div>

            <div id="addPageView"
                 class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:350px;z-index: 99999;left: -100%;">
                ${AddPage.view(gvc)}
            </div>`;
    }
    static toggle(visible) {
        if (visible) {
            $('#addPageViewHover').removeClass('d-none');
            $('#addPageView').removeClass('scroll-out');
            $('#addPageView').addClass('scroll-in');
        }
        else {
            $('#addPageViewHover').addClass('d-none');
            $('#addPageView').addClass('scroll-out');
            $('#addPageView').removeClass('scroll-in');
        }
    }
}
