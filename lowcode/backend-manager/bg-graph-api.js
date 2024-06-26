import { BgWidget } from './bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { GraphApi } from '../glitter-base/route/graph-api.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class BgGraphApi {
    static main(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            status: 'list',
            dataList: undefined,
            query: '',
            data: undefined,
        };
        let replaceData = '';
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                dataList: [
                    {
                        obj: vm,
                        key: 'status',
                    },
                ],
                bind: id,
                view: () => {
                    switch (vm.status) {
                        case 'add':
                            return BgGraphApi.editor({
                                gvc: gvc,
                                type: 'add',
                                vm: vm,
                            });
                        case 'list':
                            const filterID = gvc.glitter.getUUID();
                            return BgWidget.container(html `
                                    <div class="d-flex w-100 align-items-center mb-3">
                                        ${BgWidget.title('Graph API')}
                                        <div class="flex-fill"></div>
                                        ${BgWidget.darkButton('新增API', gvc.event(() => {
                                vm.status = 'add';
                            }))}
                                    </div>
                                    ${BgWidget.mainCard(BgWidget.tableV2({
                                gvc: gvc,
                                getData: (vmi) => {
                                    GraphApi.get({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined,
                                    }).then((data) => {
                                        vmi.pageSize = Math.ceil(data.response.total / 20);
                                        vm.dataList = data.response.data;
                                        function getDatalist() {
                                            return data.response.data.map((dd) => {
                                                return [
                                                    {
                                                        key: EditorElem.checkBoxOnly({
                                                            gvc: gvc,
                                                            def: !data.response.data.find((dd) => {
                                                                return !dd.checked;
                                                            }),
                                                            callback: (result) => {
                                                                data.response.data.map((dd) => {
                                                                    dd.checked = result;
                                                                });
                                                                vmi.data = getDatalist();
                                                                vmi.callback();
                                                                gvc.notifyDataChange(filterID);
                                                            },
                                                        }),
                                                        value: EditorElem.checkBoxOnly({
                                                            gvc: gvc,
                                                            def: dd.checked,
                                                            callback: (result) => {
                                                                dd.checked = result;
                                                                vmi.data = getDatalist();
                                                                vmi.callback();
                                                                gvc.notifyDataChange(filterID);
                                                            },
                                                            style: 'height:40px;',
                                                        }),
                                                    },
                                                    {
                                                        key: 'method',
                                                        value: dd.method,
                                                    },
                                                    {
                                                        key: 'route',
                                                        value: dd.route,
                                                    },
                                                    {
                                                        key: 'API名稱',
                                                        value: dd.info.title,
                                                    },
                                                    {
                                                        key: '建立時間',
                                                        value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm'),
                                                    },
                                                ].map((dd) => {
                                                    dd.value = `<div style="line-height:40px;">${dd.value}</div>`;
                                                    return dd;
                                                });
                                            });
                                        }
                                        vmi.data = getDatalist();
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => {
                                    vm.data = vm.dataList[index];
                                    vm.status = 'replace';
                                },
                                filter: html ` ${BgWidget.searchPlace(gvc.event((e, event) => {
                                    vm.query = e.value;
                                    gvc.notifyDataChange(id);
                                }), vm.query || '', '搜尋所有訂單')}
                                            ${gvc.bindView(() => {
                                    return {
                                        bind: filterID,
                                        view: () => {
                                            if (!vm.dataList ||
                                                !vm.dataList.find((dd) => {
                                                    return dd.checked;
                                                })) {
                                                return ``;
                                            }
                                            else {
                                                return [
                                                    `<span class="fs-7 fw-bold">操作選項</span>`,
                                                    `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.checkYesOrNot({
                                                            text: '是否確認移除所選項目?',
                                                            callback: (response) => {
                                                                if (response) {
                                                                    dialog.dataLoading({ visible: true });
                                                                    GraphApi.delete({
                                                                        id: vm.dataList
                                                                            .filter((dd) => {
                                                                            return dd.checked;
                                                                        })
                                                                            .map((dd) => {
                                                                            return dd.id;
                                                                        })
                                                                            .join(`,`),
                                                                    }).then((res) => {
                                                                        dialog.dataLoading({ visible: false });
                                                                        if (res.result) {
                                                                            vm.dataList = undefined;
                                                                            gvc.notifyDataChange(id);
                                                                        }
                                                                        else {
                                                                            dialog.errorMessage({ text: '刪除失敗' });
                                                                        }
                                                                    });
                                                                }
                                                            },
                                                        });
                                                    })}">批量移除</button>`,
                                                ].join(``);
                                            }
                                        },
                                        divCreate: () => {
                                            return {
                                                class: `d-flex align-items-center p-2 py-3 ${!vm.dataList ||
                                                    !vm.dataList.find((dd) => {
                                                        return dd.checked;
                                                    })
                                                    ? `d-none`
                                                    : ``}`,
                                                style: `height:40px;gap:10px;margin-top:10px;`,
                                            };
                                        },
                                    };
                                })}`,
                            }))}
                                `, BgWidget.getContainerWidth());
                        case 'replace':
                            return BgGraphApi.editor({
                                gvc: gvc,
                                type: 'replace',
                                vm: vm,
                                data: vm.data,
                            });
                    }
                },
                divCreate: {
                    class: `w-100 h-100`,
                },
            };
        });
    }
    static editor(obj) {
        const gvc = obj.gvc;
        const postData = obj.data || {
            route: '',
            method: 'get',
            info: {
                title: '',
                code: '',
            },
        };
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return BgWidget.container(html `
                            <div class="d-flex">
                                ${BgWidget.goBack(obj.gvc.event(() => {
                        obj.vm.status = 'list';
                    }))}
                                ${BgWidget.title(obj.type === 'replace' ? `編輯API` : `新增API`)}
                                <div class="flex-fill"></div>
                                <button
                                    class="btn btn-primary-c btn-sm"
                                    style=""
                                    onclick="${obj.gvc.event(() => {
                        if (obj.type === 'add') {
                            dialog.dataLoading({ visible: true });
                            GraphApi.post(postData).then((res) => {
                                dialog.dataLoading({ visible: false });
                                if (!res.result) {
                                    dialog.errorMessage({ text: '此API路徑已被使用' });
                                }
                                else {
                                    postData.id = res.response.inertID;
                                    obj.data = postData;
                                    obj.type = 'replace';
                                    gvc.notifyDataChange(id);
                                    dialog.successMessage({ text: '添加成功' });
                                }
                            });
                        }
                        else {
                            dialog.dataLoading({ visible: true });
                            GraphApi.put(postData).then((res) => {
                                dialog.dataLoading({ visible: false });
                                obj.data = postData;
                                obj.type = 'replace';
                                gvc.notifyDataChange(id);
                                dialog.successMessage({ text: '更新成功' });
                            });
                        }
                    })}"
                                >
                                    ${obj.type === 'replace' ? `儲存並更改` : `儲存並新增`}
                                </button>
                            </div>
                            <div class="my-3"></div>
                            ${BgWidget.card(` ${[
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: 'API名稱',
                            placeHolder: `請輸入API名稱`,
                            default: postData.info.title,
                            callback: (text) => {
                                postData.info.title = text;
                            },
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: 'API路徑',
                            placeHolder: `請輸入API路徑`,
                            default: postData.route,
                            callback: (text) => {
                                postData.route = text;
                            },
                        }),
                        EditorElem.select({
                            title: 'API method',
                            gvc: gvc,
                            def: postData.method,
                            array: [
                                { title: 'GET', value: 'GET' },
                                { title: 'POST', value: 'POST' },
                                { title: 'PUT', value: 'PUT' },
                                { title: 'DELETE', value: 'DELETE' },
                                { title: 'PATCH', value: 'PATCH' },
                            ],
                            callback: (text) => {
                                postData.method = text;
                            },
                        }),
                        EditorElem.codeEditor({
                            gvc: gvc,
                            height: 600,
                            initial: postData.info.code,
                            title: `區段代碼`,
                            callback: (text) => {
                                postData.info.code = text;
                            },
                            structStart: `((db,is_manager,is_appUser,body,query,user_data,sendMessage,axios)=>{`,
                        }),
                    ].join(`<div class="my-2"></div>`)}`)}
                        `, 800);
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, BgGraphApi);
