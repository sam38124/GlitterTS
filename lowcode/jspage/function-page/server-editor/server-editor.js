import { EditorElem } from "../../../glitterBundle/plugins/editor-elem.js";
export class ServerEditor {
    static left(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        function setItemsList(fontawsome, title, itemList, id) {
            const html = String.raw;
            return html `
                <li class="btn-group w-100" style="margin-top:1px;margin-bottom:1px;" onclick="${gvc.event(() => {
                glitter.setUrlParameter('router', `${title}/${itemList[0].title}`);
                gvc.recreateView();
            })}">
                    <div class="editor_item d-flex   align-items-center px-2 my-0 hi me-n1 w-100  fw-bold
${(!itemList.find((dd) => {
                return glitter.getUrlParameter('router') === `${title}/${dd.title}`;
            })) ? `` : `bgf6 border`}
" style="border-top-right-radius: 0;border-bottom-right-radius: 0;">
                        <div class="subBt ms-n2 d-none">
                            <i class="fa-regular fa-circle-minus d-flex align-items-center justify-content-center subBt "
                               style="width:15px;height:15px;color:red;" aria-hidden="true"></i>
                        </div>
                        <i class="${fontawsome} me-1 d-flex align-items-center justify-content-center"
                           style="width:20px;"></i>${title}
                    </div>
                </li>
                <br>
                <div class="ps-3 ${(!itemList.find((dd) => {
                return glitter.getUrlParameter('router') === `${title}/${dd.title}`;
            })) ? `d-none` : ``} pb-1 border-bottom">
                    ${EditorElem.arrayItem({
                gvc: gvc,
                title: '',
                array: () => {
                    return itemList.map((dd) => {
                        if (!glitter.getUrlParameter('router')) {
                            glitter.setUrlParameter('router', `${title}/${dd.title}`);
                            gvc.recreateView();
                        }
                        if (glitter.getUrlParameter('router') === `${title}/${dd.title}`) {
                            const responseView = dd.view(gvc);
                            if (typeof responseView === 'string') {
                                $('#editerCenter').html(responseView);
                            }
                            else {
                                responseView.then((dd) => {
                                    $('#editerCenter').html(dd);
                                });
                            }
                        }
                        return {
                            title: dd.title,
                            innerHtml: () => {
                                glitter.setUrlParameter('router', `${title}/${dd.title}`);
                                gvc.recreateView();
                                return ``;
                            },
                            editTitle: dd.title,
                            saveEvent: dd.saveEvent,
                            width: dd.width,
                            saveAble: dd.saveAble,
                            isSelect: glitter.getUrlParameter('router') === `${title}/${dd.title}`
                        };
                    });
                },
                customEditor: true,
                minus: false,
                originalArray: itemList,
                expand: {},
                draggable: false,
                copyable: false,
                refreshComponent: () => {
                    gvc.notifyDataChange(id);
                }
            })}
                </div>
            `;
        }
        const id = glitter.getUUID();
        return html `
            <li class="w-100 align-items-center  d-flex editor_item_title  start-0 bg-white z-index-9 mb-1"
                style="z-index: 999;">
                <span style="font-size:14px;">後端應用管理</span>
            </li>
            ${setItemsList(`fa-regular fa-server me-1`, `伺服器內容`, [
            {
                title: `資料庫設定`,
                view: (gvc) => {
                    return new Promise((resolve, reject) => {
                        glitter.getModule(new URL('./router/database.js', import.meta.url).href, (dd) => {
                            resolve(dd(gvc));
                        });
                    });
                }
            },
            {
                title: `主機狀態管理`,
                view: (gvc) => {
                    return new Promise((resolve, reject) => {
                        glitter.getModule(new URL('./router/server-status.js', import.meta.url).href, (dd) => {
                            resolve(dd(gvc));
                        });
                    });
                }
            },
            {
                title: `專案部署`,
                view: (gvc) => {
                    return new Promise((resolve, reject) => {
                        glitter.getModule(new URL('./router/api-manager.js', import.meta.url).href, (dd) => {
                            resolve(dd(gvc));
                        });
                    });
                }
            },
            {
                title: `網域部署`,
                view: (gvc) => {
                    return new Promise((resolve, reject) => {
                        glitter.getModule(new URL('./router/domain-manager.js', import.meta.url).href, (dd) => {
                            resolve(dd(gvc));
                        });
                    });
                }
            }
        ], id)}
        `;
    }
}
