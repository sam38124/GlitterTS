import { init } from '../glitterBundle/GVController.js';
import { initialCode } from "../setting/initialCode.js";
import { pageManager } from "../setting/pageManager.js";
import { appSetting } from "../setting/appSetting.js";
import { styleManager } from "../setting/styleManager.js";
init((gvc, glitter, gBundle) => {
    function getSource(dd) {
        return dd.src.official;
    }
    return {
        onCreateView: () => {
            let viewModel = {
                dataList: undefined,
                data: undefined,
                loading: true,
                selectItem: undefined,
                pluginList: [],
                initialJS: [],
                initialCode: '',
                homePage: ''
            };
            function pageSelect(def, callback) {
                var _a;
                const btid = glitter.getUUID();
                const defd = (_a = viewModel.dataList.find((dd) => {
                    return dd.tag === def;
                })) !== null && _a !== void 0 ? _a : { name: "尚未選擇" };
                return `
<div class="w-100"><button class="form-control position-relative" onclick="${gvc.event(() => {
                    $('#' + btid).toggle();
                })}">${defd.name} <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y" style="top: 50%;right: 20px;"></i></button>
<div class="dropdown-menu" id="${btid}" style="max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;">
 
<ul class="list-group list-group-flush border-bottom mt-2">
    ${(() => {
                    let group = [];
                    let selectGroup = '';
                    let id = glitter.getUUID();
                    viewModel.dataList.map((dd) => {
                        if (dd.tag === def) {
                            selectGroup = dd.group;
                        }
                        if (group.indexOf(dd.group) === -1) {
                            group.push(dd.group);
                        }
                    });
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                return group.map((dd) => {
                                    return `<l1 onclick="${gvc.event(() => {
                                        selectGroup = dd;
                                        gvc.notifyDataChange(id);
                                    })}"  class="list-group-item list-group-item-action border-0 py-2 ${(selectGroup === dd) && 'active'} position-relative " style="border-radius: 0px;cursor: pointer;">${dd || "未分類"}</l1>`
                                        +
                                            `<div class="collapse multi-collapse ${(selectGroup === dd) && 'show'}" style="margin-left: 10px;">
 ${viewModel.dataList.filter((d2) => {
                                                return d2.group === dd;
                                            }).map((d3) => {
                                                if (d3.tag !== def) {
                                                    return `<a onclick="${gvc.event(() => {
                                                        callback(d3.tag);
                                                    })}"  class=" list-group-item list-group-item-action border-0 py-2 px-4"  style="border-radius: 0px;">${d3.name}</a>`;
                                                }
                                                else {
                                                    return `<a onclick="${gvc.event(() => {
                                                        callback(d3.tag);
                                                    })}"  class=" list-group-item list-group-item-action border-0 py-2 px-4 bg-warning"  style="cursor:pointer;background-color: #FFDC6A !important;color:black !important;border-radius: 0px;">${d3.name}</a>`;
                                                }
                                            }).join('')}
</div>`;
                                }).join('');
                            },
                            divCreate: {}
                        };
                    });
                })()}

</ul>

  </div></div>`;
            }
            viewModel = gBundle.vm;
            const id = glitter.getUUID();
            let select = "defaultStyle";
            var option = [{
                    title: "頁面設定",
                    value: "defaultStyle"
                }, {
                    title: "應用設定",
                    value: "appSetting"
                }
            ];
            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(255,255,255,0.5);" >
            <div class="bg-dark m-auto rounded overflow-scroll" style="max-width: 100%;max-height: calc(100% - 50px);width: 480px;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4 text-white" >設定</h3>
        <i class="fa-solid fa-xmark text-white position-absolute " style=" font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer; "
        onclick="${gvc.event(() => {
                glitter.closeDiaLog();
            })}"></i>
</div>    
${gvc.bindView(() => {
                const selecter = glitter.getUUID();
                return {
                    bind: selecter,
                    view: () => {
                        return `<div class="p-2  m-0 d-flex align-items-center " style="border-radius: 0px;"><h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">設定項目:</h3>
  <select class="form-select form-control flex-fill" onchange="${gvc.event((e) => {
                            select = e.value;
                            gvc.notifyDataChange([id, selecter]);
                        })}">
            ${option.map((dd) => {
                            return `<option value="${dd.value}" ${dd.value === select && "selected"}>${dd.title}</option>`;
                        }).join('')}
</select></div>` + (() => {
                            if (select === 'defaultStyle') {
                                return `<div class="p-2  m-0 d-flex align-items-center " style="border-radius: 0px;"><h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">選擇頁面:</h3>

${pageSelect(viewModel.data.tag, (tag) => {
                                    viewModel.data = viewModel.dataList.find((dd) => {
                                        return dd.tag === tag;
                                    });
                                    gvc.notifyDataChange([id, selecter]);
                                })}
</div>
`;
                            }
                            else {
                                return ``;
                            }
                        })();
                    },
                    divCreate: {
                        class: `w-100 alert alert-primary border-bottom p-2 m-0`,
                        style: `border-radius: 0px;background:#1d59c0;`
                    }
                };
            })}
<div style="" class="p-2">
${gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return `
                            ` + (() => {
                            switch (select) {
                                case `appSetting`:
                                    return appSetting(gvc, viewModel, id);
                                case `initialCode`:
                                    return initialCode(gvc, viewModel, id);
                                case `defaultStyle`:
                                    return pageManager(gvc, viewModel, id);
                                case `style`:
                                    return styleManager(gvc, viewModel, id);
                            }
                        })();
                    },
                    divCreate: { class: `m-2` }
                };
            })}
</div>

<div class="w-100 bg-light" style="height: 1px;"></div>
</div>
</div>
            `;
        }
    };
});
