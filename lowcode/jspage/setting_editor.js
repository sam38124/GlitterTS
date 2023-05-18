import { appCreate, appSetting, fileManager } from "../setting/appSetting.js";
export class Setting_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const glitter = gvc.glitter;
        return gvc.bindView(() => {
            var _a;
            glitter.setUrlParameter('selectItem', (_a = glitter.getUrlParameter('selectItem')) !== null && _a !== void 0 ? _a : 'pageDesign');
            let items = [
                {
                    title: `後台管理系統`,
                    option: [{
                            tag: 'pageDesign',
                            text: `<i class="fa-regular fa-gear me-2 d-flex align-items-center justify-content-center" style="width:25px;"></i>應用程式設定`,
                            click: () => {
                                gvc.notifyDataChange(createID);
                            },
                            select: true
                        }, {
                            tag: 'pushApp',
                            text: `<i class="fa-light fa-mobile me-2 d-flex align-items-center justify-content-center" style="width:25px;"></i>APP上架送審`,
                            click: () => {
                                gvc.notifyDataChange(createID);
                            },
                            select: false
                        }, {
                            tag: 'fileManager',
                            text: `<i class="fa-regular fa-folders me-2 d-flex align-items-center justify-content-center" style="width:25px;"></i>資源管理`,
                            click: () => {
                                gvc.notifyDataChange(createID);
                            },
                            select: false
                        }].map((dd) => {
                        dd.select = (glitter.getUrlParameter('selectItem') === dd.tag);
                        return dd;
                    })
                }
            ];
            const vid = glitter.getUUID();
            function clearSelect() {
                items.map((dd) => {
                    function clear(dd) {
                        dd.select = false;
                        if (dd.option) {
                            dd.option.map((d2) => {
                                clear(d2);
                            });
                        }
                    }
                    clear(dd);
                });
            }
            return {
                bind: vid,
                view: () => {
                    let html = '';
                    let dragm = {
                        start: 0,
                        end: 0,
                        div: ''
                    };
                    let indexCounter = 9999;
                    items.map((dd, index) => {
                        html += `<h3 class="fs-lg d-flex align-items-center">${dd.title}
</h3>
                                                    <ul class="list-group list-group-flush border-bottom pb-3 mb-4 mx-n4">
                                                        ${(() => {
                            function convertInner(d2, inner, parentCallback = () => {
                            }) {
                                const hoverID = glitter.getUUID();
                                function checkOptionSelect(data) {
                                    if (data.select) {
                                        return true;
                                    }
                                    else if (data.option) {
                                        for (const a of data.option) {
                                            if (checkOptionSelect(a)) {
                                                data.select = true;
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                }
                                let onMouselem = 'first';
                                return `<li class="align-items-center list-group-item list-group-item-action border-0 py-2 px-4 ${d2.select ? `${(inner) ? `bg-warning` : `active`}` : ``} position-relative d-flex"
                                                                    onclick="${gvc.event(() => {
                                    clearSelect();
                                    d2.select = true;
                                    glitter.setUrlParameter('selectItem', d2.tag);
                                    parentCallback();
                                    gvc.notifyDataChange(createID);
                                    d2.click();
                                })}"
                                                                    style="z-index: ${indexCounter--} !important;cursor:pointer;${(inner && d2.select) ? `background-color: #FFDC6A !important;color:black !important;` : ``}"
                                                                 >${d2.text}
                                                                 </li>`;
                            }
                            return gvc.map(dd.option.map((d2, index) => {
                                return convertInner(d2, false, () => {
                                });
                            }));
                        })()}
                                                    </ul>`;
                    });
                    return html;
                },
                divCreate: {
                    class: `swiper-slide h-auto`,
                },
                onCreate: () => {
                }
            };
        });
    }
    static center(gvc, viewModel, createID) {
        const glitter = gvc.glitter;
        if (glitter.getUrlParameter('selectItem') === 'pushApp') {
            return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${appCreate(gvc, viewModel, createID)}
                </div>`;
        }
        else if (glitter.getUrlParameter('selectItem') === 'fileManager') {
            return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${fileManager(gvc, viewModel, createID)}
                </div>`;
        }
        else {
            return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${appSetting(gvc, viewModel, createID)}
                </div>`;
        }
    }
}
Setting_editor.index = '2';
