import { pageManager } from "../setting/pageManager.js";
export class Page_editor {
    static left(gvc, viewModel, createID, gBundle) {
        let group = [];
        let selectGroup = '';
        let id = gvc.glitter.getUUID();
        const glitter = gvc.glitter;
        viewModel.dataList.map((dd) => {
            if (dd.tag === viewModel.data.tag) {
                selectGroup = dd.group;
            }
            if (!group.find((d2) => {
                return d2.group === dd.group;
            })) {
                group.push(dd);
            }
        });
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    return `<h3 class="fs-lg d-flex align-items-center px-3 py-3 border-bottom mb-0 shadow" style="">頁面編輯 : ${viewModel.data.name}
</h3>` + group.map((dd) => {
                        return `<l1 onclick="${gvc.event(() => {
                            selectGroup = dd.group;
                            viewModel.data = dd;
                            glitter.setUrlParameter('page', dd.tag);
                            gvc.notifyDataChange(createID);
                        })}"  class="list-group-item list-group-item-action border-0 py-2 ${(selectGroup === dd.group) && 'active'} position-relative " style="border-radius: 0px;cursor: pointer;">${dd.group || "未分類"}</l1>`
                            +
                                `<div class="collapse multi-collapse ${(selectGroup === dd.group) && 'show'}" style="margin-left: 10px;">
 ${viewModel.dataList.filter((d2) => {
                                    return d2.group === dd.group;
                                }).map((d3) => {
                                    if (d3.tag !== viewModel.data.tag) {
                                        return `<a onclick="${gvc.event(() => {
                                            viewModel.data = d3;
                                            glitter.setUrlParameter('page', d3.tag);
                                            gvc.notifyDataChange(createID);
                                        })}" class=" list-group-item list-group-item-action border-0 py-2 px-4"  style="border-radius: 0px;">${d3.name}</a>`;
                                    }
                                    else {
                                        return `<a  class=" list-group-item list-group-item-action border-0 py-2 px-4 bg-warning"  style="cursor:pointer;background-color: #FFDC6A !important;color:black !important;border-radius: 0px;">${d3.name}</a>`;
                                    }
                                }).join('')}
</div>`;
                    }).join('');
                },
                divCreate: {
                    class: `w-100`
                }
            };
        });
    }
    static center(viewModel, gvc, createID) {
        return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${pageManager(gvc, viewModel, createID)}
                </div>`;
    }
}
Page_editor.index = '1';
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}