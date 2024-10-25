var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../../../../backend-manager/bg-widget.js';
import { ApiUser } from '../../../../glitter-base/route/user.js';
import { EditorElem } from '../../../../glitterBundle/plugins/editor-elem.js';
import { BackendServer } from '../../../../api/backend-server.js';
import { ShareDialog } from '../../../../glitterBundle/dialog/ShareDialog.js';
window.glitter.setModule(import.meta.url, (gvc) => {
    return gvc.bindView(() => {
        const html = String.raw;
        const id = gvc.glitter.getUUID();
        const vm = {
            type: 'list',
            data: {},
            query: '',
            dataList: [],
        };
        let postVm = {
            name: '',
            domain: '',
            version: '',
            port: '',
            file: '',
        };
        const filterID = gvc.glitter.getUUID();
        return {
            bind: id,
            view: () => {
                if (vm.type === 'post') {
                    return BgWidget.container([
                        html ` <div class="title-container">
                                ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                            gvc.notifyDataChange(id);
                        }))}
                                ${BgWidget.title('發佈後端專案')}
                                <div class="flex-fill"></div>
                                <button
                                    class="btn btn-outline-secondary-c me-2"
                                    style="height:35px;font-size: 14px;"
                                    onclick="${gvc.event(() => __awaiter(void 0, void 0, void 0, function* () {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            const resp = yield BackendServer.sampleProject();
                            dialog.dataLoading({ visible: false });
                            if (resp.result) {
                                location.href = resp.response.result;
                            }
                            else {
                                dialog.errorMessage({
                                    text: '下載範例失敗!',
                                });
                            }
                        }))}"
                                >
                                    <i class="fa-regular fa-download me-2"></i>下載範例專案
                                </button>
                                <button
                                    class="btn btn-primary-c"
                                    style="height:35px;font-size: 14px;"
                                    onclick="${gvc.event(() => __awaiter(void 0, void 0, void 0, function* () {
                            const dialog = new ShareDialog(gvc.glitter);
                            if (Object.keys(postVm).find((dd) => {
                                return !postVm[dd] && dd !== 'domain';
                            })) {
                                dialog.errorMessage({ text: '請確實填寫必帶資料。' });
                                return;
                            }
                            dialog.dataLoading({ text: '上傳中', visible: true });
                            const resp = yield BackendServer.postAPI(postVm);
                            dialog.dataLoading({ visible: false });
                            if (resp.result) {
                                dialog.successMessage({
                                    text: '發佈成功',
                                });
                                vm.type = 'list';
                            }
                            else {
                                dialog.errorMessage({
                                    text: '發佈失敗',
                                });
                            }
                            gvc.notifyDataChange(id);
                        }))}"
                                >
                                    確認發佈
                                </button>
                            </div>`,
                        BgWidget.card([
                            EditorElem.editeInput({
                                gvc: gvc,
                                title: '專案名稱-必須與專案資料夾名稱一致',
                                default: postVm.name,
                                placeHolder: '[僅限英數字與減號和下滑線且必須與專案資料夾名稱一致]',
                                callback: (text) => {
                                    postVm.name = text.replace(/[^a-zA-Z0-9-_]/g, '');
                                    gvc.notifyDataChange(id);
                                },
                            }),
                            EditorElem.editeInput({
                                gvc: gvc,
                                title: '應用踔號[Listen Port]',
                                default: postVm.port,
                                placeHolder: '踔號範圍[8000-8100]',
                                callback: (text) => {
                                    if (parseInt(text) < 8000) {
                                        text = '8000';
                                    }
                                    else if (parseInt(text) > 8100) {
                                        text = '8100';
                                    }
                                    postVm.port = text;
                                    gvc.notifyDataChange(id);
                                },
                                type: 'number',
                            }),
                            EditorElem.editeInput({
                                gvc: gvc,
                                title: '版本號碼',
                                default: postVm.version,
                                placeHolder: '請輸入版本號碼例如：1.0.1',
                                callback: (text) => {
                                    postVm.version = text;
                                    gvc.notifyDataChange(id);
                                },
                            }),
                            EditorElem.h3('上傳專案壓縮檔案，副檔名需為zip'),
                            gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                function uploadEvent() {
                                    EditorElem.uploadFileFunction({
                                        gvc: gvc,
                                        callback: (text) => {
                                            postVm.file = text;
                                            gvc.notifyDataChange(id);
                                        },
                                    });
                                }
                                return {
                                    bind: id,
                                    view: () => {
                                        if (postVm.file) {
                                            return `<button class="btn btn-primary w-100" style="height: 40px;" onclick="${gvc.event(() => {
                                                uploadEvent();
                                            })}">更換檔案</button>`;
                                        }
                                        else {
                                            return `<button class="btn btn-primary w-100" style="height: 40px;" onclick="${gvc.event(() => {
                                                uploadEvent();
                                            })}">上傳檔案</button>`;
                                        }
                                    },
                                };
                            }),
                        ].join('')),
                    ].join(`<div class="my-3"></div>`));
                }
                else if (vm.type === 'replace') {
                    function updateEvent() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const dialog = new ShareDialog(gvc.glitter);
                            if (Object.keys(postVm).find((dd) => {
                                postVm[dd] = vm.data[dd];
                                return !postVm[dd] && dd !== 'domain';
                            })) {
                                dialog.errorMessage({ text: '請確實填寫必帶資料。' });
                                return;
                            }
                            dialog.dataLoading({ text: '上傳中', visible: true });
                            const resp = yield BackendServer.postAPI(postVm);
                            dialog.dataLoading({ visible: false });
                            if (resp.result) {
                                dialog.successMessage({
                                    text: '發佈成功',
                                });
                                vm.type = 'list';
                            }
                            else {
                                dialog.errorMessage({
                                    text: '發佈失敗',
                                });
                            }
                            gvc.notifyDataChange(id);
                        });
                    }
                    return gvc.bindView(() => {
                        const ff = gvc.glitter.getUUID();
                        return {
                            bind: ff,
                            view: () => {
                                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                    const address = yield BackendServer.getApiPath({
                                        port: vm.data.port,
                                    });
                                    resolve(BgWidget.container([
                                        html ` <div class="title-container">
                                                    ${BgWidget.goBack(gvc.event(() => {
                                            vm.type = 'list';
                                            gvc.notifyDataChange(id);
                                        }))}
                                                    ${BgWidget.title(vm.data.name)}
                                                    <div class="flex-fill"></div>
                                                    <button
                                                        class="btn btn-outline-secondary-c me-2"
                                                        style="height:35px;font-size: 14px;"
                                                        onclick="${gvc.event(() => __awaiter(void 0, void 0, void 0, function* () {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.dataLoading({ visible: true });
                                            const resp = yield BackendServer.sampleProject();
                                            dialog.dataLoading({ visible: false });
                                            if (resp.result) {
                                                location.href = resp.response.result;
                                            }
                                            else {
                                                dialog.errorMessage({
                                                    text: '下載範例失敗!',
                                                });
                                            }
                                        }))}"
                                                    >
                                                        <i class="fa-regular fa-download me-2"></i>下載範例專案
                                                    </button>
                                                    <button
                                                        class="btn btn-primary-c"
                                                        style="height:35px;font-size: 14px;"
                                                        onclick="${gvc.event(() => __awaiter(void 0, void 0, void 0, function* () {
                                            updateEvent();
                                        }))}"
                                                    >
                                                        發佈更新
                                                    </button>
                                                </div>`,
                                        BgWidget.card([
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                                            if (vm.data.health) {
                                                                resolve(`<span class="fs-6 fw-bold">狀態 :</span><span class="badge bg-success " style="font-size:16px;">正常</span>
<div class="hoverBtn rounded p-1 d-flex align-items-center justify-content-center" 
 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
data-bs-title="重啟專案" 
style="border:1px solid black;font-size:14px; width:30px;height: 30px;" onclick="${gvc.event(() => {
                                                                    updateEvent();
                                                                })}"><i class="fa-solid fa-arrows-rotate"></i></div>`);
                                                            }
                                                            else {
                                                                resolve(`<span class="fs-6 fw-bold">狀態 :</span><span class="badge bg-danger " style="font-size:16px;">已停止</span>
<div class="hoverBtn rounded p-1 d-flex align-items-center justify-content-center" 
 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
data-bs-title="重啟專案" 
style="border:1px solid black;font-size:14px; width:30px;height: 30px;" onclick="${gvc.event(() => {
                                                                    updateEvent();
                                                                })}"><i class="fa-solid fa-arrows-rotate"></i></div>
`);
                                                            }
                                                        }));
                                                    },
                                                    divCreate: {
                                                        class: `d-flex align-items-center border-bottom pb-2 mb-2`,
                                                        style: 'gap:10px;',
                                                    },
                                                    onCreate: () => {
                                                        $('.tooltip').remove();
                                                        $('[data-bs-toggle="tooltip"]').tooltip();
                                                    },
                                                };
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '專案名稱-必須與專案資料夾名稱一致',
                                                default: vm.data.name,
                                                placeHolder: '[僅限英數字與減號和下滑線且必須與專案資料夾名稱一致]',
                                                callback: (text) => { },
                                                readonly: true,
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: html ` <div class="d-flex align-items-center" style="gap:2px;">
                                                                專案路徑
                                                                <div
                                                                    class="hoverBtn ms-2 d-flex align-items-center justify-content-center   border"
                                                                    style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-placement="top"
                                                                    data-bs-custom-class="custom-tooltip"
                                                                    data-bs-title="網域設置"
                                                                    onclick="${gvc.event(() => {
                                                    const href = new URL(location.href);
                                                    href.searchParams.set('router', '伺服器內容/網域部署');
                                                    location.href = href.href;
                                                })}"
                                                                >
                                                                    <i class="fa-sharp fa-regular fa-globe-pointer" aria-hidden="true"></i>
                                                                </div>
                                                            </div>`,
                                                default: address.response.url,
                                                placeHolder: '專案路徑',
                                                callback: (text) => { },
                                                readonly: true,
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '應用踔號[Listen Port]',
                                                default: vm.data.port,
                                                placeHolder: '踔號範圍[8000-8100]',
                                                callback: (text) => { },
                                                readonly: true,
                                                type: 'number',
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '版本號碼',
                                                default: vm.data.version,
                                                placeHolder: '請輸入版本號碼例如：1.0.1',
                                                callback: (text) => {
                                                    vm.data.version = text;
                                                    gvc.notifyDataChange(id);
                                                },
                                            }),
                                            EditorElem.h3('上傳專案壓縮檔案，副檔名需為zip'),
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                function uploadEvent() {
                                                    EditorElem.uploadFileFunction({
                                                        gvc: gvc,
                                                        callback: (text) => {
                                                            vm.data.file = text;
                                                            gvc.notifyDataChange(id);
                                                        },
                                                    });
                                                }
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        if (vm.data.file) {
                                                            return `<button class="btn btn-primary w-100" style="height: 40px;" onclick="${gvc.event(() => {
                                                                uploadEvent();
                                                            })}">更換專案檔</button>
<div class="d-flex align-items-center justify-content-center  ms-2 border bg-white" style="height:36px;width:36px;border-radius:10px;cursor:pointer;"
data-bs-toggle="tooltip" data-bs-placement="top"
data-bs-custom-class="custom-tooltip"
data-bs-title="下載專案壓縮檔"
>
                          <i class="fa-regular fa-download"></i>
</div>
`;
                                                        }
                                                        else {
                                                            return `<button class="btn btn-primary w-100" style="height: 40px;" onclick="${gvc.event(() => {
                                                                uploadEvent();
                                                            })}">上傳檔案</button>`;
                                                        }
                                                    },
                                                    divCreate: {
                                                        class: `d-flex align-items-center`,
                                                    },
                                                    onCreate: () => {
                                                        $('.tooltip').remove();
                                                        $('[data-bs-toggle="tooltip"]').tooltip();
                                                    },
                                                };
                                            }),
                                        ].join('')),
                                        `<div class="d-flex" style="gap:10px;">
<div class="flex-fill"></div>
<button class="bg-warning  btn  btn-sm" style="color:black;" onclick="${gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.checkYesOrNot({
                                                callback: (response) => __awaiter(void 0, void 0, void 0, function* () {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        yield BackendServer.shutDown({
                                                            port: vm.data.port,
                                                        });
                                                        location.reload();
                                                    }
                                                }),
                                                text: `是否確認停止專案?`,
                                            });
                                        })}">暫停應用</button>
<button class="bg-danger btn btn-sm" onclick="${gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.checkYesOrNot({
                                                callback: (response) => __awaiter(void 0, void 0, void 0, function* () {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        yield BackendServer.deleteAPI({
                                                            port: vm.data.port,
                                                        });
                                                        location.reload();
                                                    }
                                                }),
                                                text: `是否確認刪除專案?`,
                                            });
                                        })}">刪除專案</button>
</div>`,
                                    ].join(`<div class="my-3"></div>`)));
                                }));
                            },
                        };
                    });
                }
                else {
                    return BgWidget.container(html `
                        <div class="title-container ">
                            ${BgWidget.title('專案部署')}
                            <div class="flex-fill"></div>
                            <button
                                class="btn btn-outline-secondary-c me-2"
                                style="height:35px;font-size: 14px;"
                                onclick="${gvc.event(() => __awaiter(void 0, void 0, void 0, function* () {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        const resp = yield BackendServer.sampleProject();
                        dialog.dataLoading({ visible: false });
                        if (resp.result) {
                            location.href = resp.response.result;
                        }
                        else {
                            dialog.errorMessage({
                                text: '下載範例失敗!',
                            });
                        }
                    }))}"
                            >
                                <i class="fa-regular fa-download me-2"></i>下載範例專案
                            </button>
                            <button
                                class="btn btn-primary-c me-2 px-3"
                                style="height:35px !important;font-size: 14px;border:1px solid black;"
                                onclick="${gvc.event(() => {
                        vm.type = 'post';
                        gvc.notifyDataChange(id);
                    })}"
                            >
                                新增專案
                            </button>
                        </div>
                        ${BgWidget.table({
                        gvc: gvc,
                        getData: (vmi) => {
                            BackendServer.getApi({
                                page: vmi.page - 1,
                                limit: 20,
                                search: vm.query || undefined,
                            }).then((data) => {
                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                vm.dataList = data.response.data;
                                vmi.data = vm.dataList.map((dd) => {
                                    return [
                                        {
                                            key: '專案名稱',
                                            value: dd.name,
                                        },
                                        {
                                            key: '運行狀態',
                                            value: gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return new Promise((resolve, reject) => {
                                                            if (dd.health) {
                                                                resolve(`<span class="badge bg-success " style="font-size:14px;">正常</span>`);
                                                            }
                                                            else {
                                                                resolve(`<span class="badge bg-danger " style="font-size:14px;">已停止</span>`);
                                                            }
                                                        });
                                                    },
                                                };
                                            }),
                                        },
                                        {
                                            key: '專案路徑',
                                            value: gvc.bindView(() => {
                                                return {
                                                    bind: gvc.glitter.getUUID(),
                                                    view: () => {
                                                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                                            const address = yield BackendServer.getApiPath({
                                                                port: dd.port,
                                                            });
                                                            resolve(address.response.url);
                                                        }));
                                                    },
                                                };
                                            }),
                                        },
                                        {
                                            key: '踔號',
                                            value: dd.port,
                                        },
                                        {
                                            key: '版本號碼',
                                            value: dd.version,
                                        },
                                        {
                                            key: '發佈時間',
                                            value: gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                        },
                                    ];
                                });
                                vmi.loading = false;
                                vmi.callback();
                            });
                        },
                        rowClick: (data, index) => {
                            vm.data = vm.dataList[index];
                            vm.type = 'replace';
                            gvc.notifyDataChange(id);
                        },
                        filter: html `
                                ${BgWidget.searchPlace(gvc.event((e, event) => {
                            vm.query = e.value;
                            gvc.notifyDataChange(id);
                        }), vm.query || '', '搜尋所有專案')}
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
                                        const dialog = new ShareDialog(gvc.glitter);
                                        const selCount = vm.dataList.filter((dd) => dd.checked).length;
                                        return BgWidget.selNavbar({
                                            count: selCount,
                                            buttonList: [
                                                BgWidget.selEventButton('批量移除', gvc.event(() => {
                                                    dialog.checkYesOrNot({
                                                        text: '是否確認刪除所選項目？',
                                                        callback: (response) => {
                                                            if (response) {
                                                                dialog.dataLoading({ visible: true });
                                                                ApiUser.deleteUser({
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
                                                })),
                                            ],
                                        });
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
                                        style: ``,
                                    };
                                },
                            };
                        })}
                            `,
                    })}
                    `);
                }
            },
            divCreate: {},
        };
    });
});
