var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiRecommend } from '../glitter-base/route/recommend.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { Tool } from '../modules/tool.js';
export class BgRecommend {
    static linkList(gvc, widget) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            filterId: glitter.getUUID(),
            type: 'list',
            loading: true,
            users: [],
            editData: {},
            dataList: undefined,
            query: '',
        };
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.loading) {
                        return BgWidget.spinner();
                    }
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('分銷連結')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增', gvc.event(() => {
                            vm.type = 'add';
                            gvc.notifyDataChange(vm.id);
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(this.linkTable({
                            gvc,
                            vm,
                            rowCallback: (data, index) => {
                                vm.editData = vm.dataList[index];
                                vm.type = 'replace';
                            },
                        })))}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type === 'add') {
                        return this.editorLink({
                            gvc: gvc,
                            widget: widget,
                            data: {},
                            callback: () => {
                                vm.type = 'list';
                            },
                        });
                    }
                    return this.editorLink({
                        gvc: gvc,
                        widget: widget,
                        data: vm.editData,
                        callback: () => {
                            vm.type = 'list';
                        },
                    });
                },
                divCreate: {
                    class: 'mx-auto',
                    style: 'max-width: 100%; width: 960px;',
                },
                onCreate: () => {
                    if (vm.loading) {
                        new Promise((resolve) => {
                            ApiRecommend.getUsers({
                                data: {},
                                page: 0,
                                limit: 99999,
                                token: window.parent.config.token,
                            }).then((data) => {
                                if (data.result) {
                                    resolve(data.response.data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }).then((data) => {
                            vm.users = data;
                            vm.loading = false;
                            gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            };
        });
    }
    static linkTable(obj) {
        const html = String.raw;
        const gvc = obj.gvc;
        const vm = obj.vm;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        let vmi = undefined;
        function getDatalist() {
            const prefixURL = `https://${window.parent.glitter.share.editorViewModel.domain}`;
            return vm.dataList.map((dd) => {
                var _a, _b, _c;
                const url = prefixURL + ((_a = dd.content.link) !== null && _a !== void 0 ? _a : '');
                return [
                    {
                        key: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: !vm.dataList.find((dd) => {
                                return !dd.checked;
                            }),
                            callback: (result) => {
                                vm.dataList.map((dd) => {
                                    dd.checked = result;
                                });
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(vm.filterId);
                            },
                        }),
                        value: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: dd.checked,
                            callback: (result) => {
                                dd.checked = result;
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(vm.filterId);
                            },
                            style: 'height: 37.5px;',
                        }),
                    },
                    {
                        key: '連結名稱',
                        value: `<span class="fs-7">${dd.content.title}</span>`,
                    },
                    {
                        key: '連結網址',
                        value: gvc.bindView((() => {
                            const id = glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return html `<span
                                            style="color: #4D86DB;"
                                            onclick="${gvc.event(() => {
                                        glitter.openNewTab(url);
                                    })}"
                                        >
                                            ${url}
                                        </span>`;
                                },
                                divCreate: {
                                    option: [
                                        {
                                            key: 'onclick',
                                            value: gvc.event((e, event) => {
                                                event.stopPropagation();
                                            }),
                                        },
                                    ],
                                },
                            };
                        })()),
                    },
                    {
                        key: '總金額',
                        value: `<span class="fs-7">${dd.total_price ? dd.total_price.toLocaleString() : 0}</span>`,
                    },
                    {
                        key: '曝光量',
                        value: `<span class="fs-7">${dd.exposure ? dd.exposure.toLocaleString() : 0}</span>`,
                    },
                    {
                        key: '下單數',
                        value: `<span class="fs-7">${dd.orders ? dd.orders.toLocaleString() : 0}</span>`,
                    },
                    {
                        key: '轉換率',
                        value: `<span class="fs-7">${(_b = dd.conversion_rate) !== null && _b !== void 0 ? _b : 0}%</span>`,
                    },
                    {
                        key: '分潤獎金',
                        value: `<span class="fs-7">${dd.sharing_bonus ? dd.sharing_bonus.toLocaleString() : 0}</span>`,
                    },
                    {
                        key: '推薦人',
                        value: html `<span class="fs-7">${getRecommender(vm.users, dd.content.recommend_user)}</span>`,
                    },
                    {
                        key: '期限',
                        value: `<div class="fs-7">${dd.content.startDate} ~<br/> ${(_c = dd.content.endDate) !== null && _c !== void 0 ? _c : '永不過期'}</div>`,
                    },
                    {
                        key: '狀態',
                        value: gvc.bindView((() => {
                            const id = glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return BgWidget.switchTextButton(gvc, dd.content.status, {
                                        left: dd.content.status ? '啟用' : '關閉',
                                    }, () => {
                                        dialog.dataLoading({ visible: true });
                                        ApiRecommend.toggleListData({ id: dd.id }).then((data) => {
                                            dialog.dataLoading({ visible: false });
                                            if (data.result) {
                                                dd.content.status = !dd.content.status;
                                                dialog.successMessage({ text: `${dd.content.status ? '啟用' : '關閉'}成功` });
                                            }
                                            else {
                                                dialog.errorMessage({ text: `${dd.content.status ? '啟用' : '關閉'}失敗` });
                                            }
                                            gvc.notifyDataChange(id);
                                        });
                                    });
                                },
                                divCreate: {
                                    option: [
                                        {
                                            key: 'onclick',
                                            value: gvc.event((e, event) => {
                                                event.stopPropagation();
                                            }),
                                        },
                                    ],
                                },
                            };
                        })()),
                    },
                ];
            });
        }
        return BgWidget.tableV2({
            gvc: gvc,
            getData: (vd) => __awaiter(this, void 0, void 0, function* () {
                vmi = vd;
                ApiRecommend.getList({
                    data: {},
                    limit: 10,
                    page: vmi.page - 1,
                    user_id: obj.user_id,
                    token: window.parent.config.token,
                }).then((data) => {
                    vmi.pageSize = Math.ceil(data.response.total / 10);
                    vm.dataList = data.result ? data.response.data : [];
                    vmi.data = getDatalist();
                    vmi.loading = false;
                    vmi.callback();
                });
            }),
            style: [
                '',
                'min-width: 150px; max-width: 200px; white-space: normal !important;',
                'min-width: 220px; max-width: 250px; white-space: normal !important; overflow-wrap: break-word;',
                ...new Array(5).fill('min-width: 70px;'),
                ...new Array(3).fill('min-width: 100px;'),
            ],
            rowClick: (data, index) => {
                obj.rowCallback(data, index);
            },
            filter: html `
                ${gvc.bindView(() => {
                return {
                    bind: vm.filterId,
                    view: () => {
                        const selCount = vm.dataList.filter((dd) => dd.checked).length;
                        return BgWidget.selNavbar({
                            count: selCount,
                            buttonList: [
                                BgWidget.selEventButton('批量移除', gvc.event(() => {
                                    this.deleteLink({
                                        gvc: gvc,
                                        ids: vm.dataList
                                            .filter((dd) => {
                                            return dd.checked;
                                        })
                                            .map((dd) => {
                                            return dd.id;
                                        }),
                                        callback: () => {
                                            gvc.notifyDataChange(vm.id);
                                        },
                                    });
                                })),
                            ],
                        });
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
        });
    }
    static userList(gvc, widget) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            filterId: glitter.getUUID(),
            type: 'list',
            editData: {},
            dataList: undefined,
            query: '',
            queryType: 'name',
            group: { type: 'level', title: '', tag: '' },
            filter: {},
            orderString: 'default',
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.recommendUserFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                var _a;
                return [
                    {
                        key: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: !vm.dataList.find((dd) => {
                                return !dd.checked;
                            }),
                            callback: (result) => {
                                vm.dataList.map((dd) => {
                                    dd.checked = result;
                                });
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(vm.filterId);
                            },
                        }),
                        value: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: dd.checked,
                            callback: (result) => {
                                dd.checked = result;
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(vm.filterId);
                            },
                            style: 'height: 37.5px;',
                        }),
                    },
                    {
                        key: '推薦人名稱',
                        value: `<span class="fs-7">${dd.content.name}</span>`,
                    },
                    {
                        key: '總金額',
                        value: `<span class="fs-7">${dd.total_price ? dd.total_price.toLocaleString() : 0}</span>`,
                    },
                    {
                        key: '轉換率',
                        value: `<span class="fs-7">${(_a = dd.conversion_rate) !== null && _a !== void 0 ? _a : 0}%</span>`,
                    },
                    {
                        key: '分潤獎金',
                        value: `<span class="fs-7">${dd.sharing_bonus ? dd.sharing_bonus.toLocaleString() : 0}</span>`,
                    },
                    {
                        key: '分銷連結數',
                        value: `<span class="fs-7">${dd.orders}</span>`,
                    },
                ];
            });
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('推薦人列表')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增', gvc.event(() => {
                            vm.type = 'add';
                            gvc.notifyDataChange(vm.id);
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard([
                            (() => {
                                const fvm = {
                                    id: gvc.glitter.getUUID(),
                                    loading: true,
                                    levelList: [],
                                };
                                return gvc.bindView({
                                    bind: fvm.id,
                                    view: () => {
                                        if (fvm.loading) {
                                            return '';
                                        }
                                        const filterList = [
                                            BgWidget.selectFilter({
                                                gvc,
                                                callback: (value) => {
                                                    vm.queryType = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(fvm.id);
                                                },
                                                default: vm.queryType || 'name',
                                                options: FilterOptions.recommendUserSelect,
                                            }),
                                            BgWidget.searchFilter(gvc.event((e) => {
                                                vm.query = e.value;
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(fvm.id);
                                            }), vm.query || '', '搜尋推薦人'),
                                            BgWidget.updownFilter({
                                                gvc,
                                                callback: (value) => {
                                                    vm.orderString = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(fvm.id);
                                                },
                                                default: vm.orderString || 'default',
                                                options: FilterOptions.recommendUserOrderBy,
                                            }),
                                        ];
                                        if (document.body.clientWidth < 768) {
                                            return html ` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                    <div>${filterList[0]}</div>
                                                                    <div style="display: flex;">
                                                                        <div class="me-2">${filterList[2]}</div>
                                                                    </div>
                                                                </div>
                                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>`;
                                        }
                                        else {
                                            return html ` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>`;
                                        }
                                    },
                                    onCreate: () => {
                                        if (fvm.loading) {
                                            setTimeout(() => {
                                                fvm.loading = false;
                                                gvc.notifyDataChange(fvm.id);
                                            }, 100);
                                        }
                                    },
                                });
                            })(),
                            gvc.bindView({
                                bind: vm.tableId,
                                view: () => {
                                    return BgWidget.tableV2({
                                        gvc: gvc,
                                        getData: (vd) => __awaiter(this, void 0, void 0, function* () {
                                            vmi = vd;
                                            ApiRecommend.getUsers({
                                                data: {},
                                                limit: 15,
                                                page: vmi.page - 1,
                                                token: window.parent.config.token,
                                                search: vm.query,
                                                searchType: vm.queryType,
                                                orderBy: vm.orderString,
                                            }).then((data) => {
                                                vmi.pageSize = Math.ceil(data.response.total / 15);
                                                vm.dataList = data.response.data;
                                                vmi.data = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                            });
                                        }),
                                        rowClick: (data, index) => {
                                            vm.editData = vm.dataList[index];
                                            vm.type = 'replace';
                                        },
                                        filter: html `
                                                            ${gvc.bindView(() => {
                                            return {
                                                bind: vm.filterId,
                                                view: () => {
                                                    const dialog = new ShareDialog(glitter);
                                                    const selCount = vm.dataList.filter((dd) => dd.checked).length;
                                                    return BgWidget.selNavbar({
                                                        count: selCount,
                                                        buttonList: [
                                                            BgWidget.selEventButton('批量移除', gvc.event(() => {
                                                                this.deleteUser({
                                                                    gvc: gvc,
                                                                    ids: vm.dataList
                                                                        .filter((dd) => {
                                                                        return dd.checked;
                                                                    })
                                                                        .map((dd) => {
                                                                        return dd.id;
                                                                    }),
                                                                    callback: () => {
                                                                        gvc.notifyDataChange(vm.id);
                                                                    },
                                                                });
                                                            })),
                                                        ],
                                                    });
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
                                    });
                                },
                            }),
                        ].join('')))}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type === 'add') {
                        return this.editorUser({
                            gvc: gvc,
                            widget: widget,
                            data: {},
                            callback: () => {
                                vm.type = 'list';
                            },
                        });
                    }
                    return this.editorUser({
                        gvc: gvc,
                        widget: widget,
                        data: vm.editData,
                        callback: () => {
                            vm.type = 'list';
                        },
                    });
                },
                divCreate: {
                    class: 'mx-auto',
                    style: 'max-width: 100%; width: 960px;',
                },
            };
        });
    }
    static editorLink(cf) {
        var _a;
        const html = String.raw;
        const gvc = cf.gvc;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const vm = {
            id: glitter.getUUID(),
            previewId: glitter.getUUID(),
            noteId: glitter.getUUID(),
            data: (_a = cf.data.content) !== null && _a !== void 0 ? _a : {
                code: '',
                link: '',
                title: '',
                condition: 0,
                share_type: 'none',
                voucher_status: 'no',
                recommend_status: 'old',
                share_value: 0,
                voucher: 0,
                startDate: getDateTime().date,
                startTime: getDateTime().time,
                endDate: undefined,
                endTime: undefined,
                recommend_medium: [],
                recommend_user: {
                    id: 0,
                    name: '',
                    email: '',
                    phone: '',
                },
            },
            loading: true,
            voucherList: [],
            users: [],
            readonly: cf.data.id !== undefined,
        };
        const mediumList = [
            { key: 'youtube', value: 'Youtube' },
            { key: 'facebook', value: 'Facebook' },
            { key: 'instagram', value: 'Instagram' },
            { key: 'threads', value: 'Threads' },
            { key: 'dcard', value: 'Dcard' },
            { key: 'ptt', value: 'PTT' },
            { key: 'other', value: '其他' },
        ];
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return BgWidget.spinner({ textNone: true });
                    }
                    return BgWidget.container([
                        html ` <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.goBack(gvc.event(() => {
                            cf.callback();
                        }))}
                                ${BgWidget.title(vm.data.title || '新增分銷連結')}
                                <div class="flex-fill"></div>
                            </div>`,
                        html `<div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                                ${BgWidget.container(gvc.bindView(() => {
                            const id = glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                                    const inputStyle = 'font-size: 16px; height:40px; width:200px;';
                                    let map = [
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">連結網址</div>`,
                                            html ` <div class="tx_normal">分銷代碼</div>
                                                                <div style="margin: 4px 0 8px;">
                                                                    ${BgWidget.grayNote('是一段唯一的識別碼，用於系統追蹤和記錄通過該代碼完成的銷售', 'font-size: 14px;')}
                                                                </div>
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: (_a = vm.data.code) !== null && _a !== void 0 ? _a : '',
                                                placeHolder: '請輸入分銷代碼',
                                                callback: (text) => {
                                                    vm.data.code = text;
                                                },
                                                readonly: vm.readonly,
                                            })}`,
                                            html ` <div class="tx_normal">導向網頁</div>
                                                                ${BgWidget.linkList({
                                                gvc: gvc,
                                                title: '',
                                                default: (_b = vm.data.link) !== null && _b !== void 0 ? _b : '',
                                                placeHolder: '選擇或貼上外部連結',
                                                callback: (text) => {
                                                    vm.data.link = text;
                                                    gvc.notifyDataChange(vm.previewId);
                                                },
                                                filter: {
                                                    page: ['一頁商店', '隱形賣場'],
                                                },
                                            })}`,
                                            gvc.bindView({
                                                bind: vm.previewId,
                                                view: () => {
                                                    var _a;
                                                    const prefixURL = `https://${window.parent.glitter.share.editorViewModel.domain}`;
                                                    const url = prefixURL + ((_a = vm.data.link) !== null && _a !== void 0 ? _a : '');
                                                    return html ` <div class="tx_normal">網址預覽</div>
                                                                        ${BgWidget.mbContainer(8)}
                                                                        <div class="d-flex align-items-center">
                                                                            <div
                                                                                class="form-control cursor_pointer"
                                                                                style="background:#F7F7F7; color: #4D86DB; font-size: 16px; overflow-wrap: anywhere;"
                                                                                onclick="${gvc.event(() => glitter.openNewTab(url))}"
                                                                            >
                                                                                ${url}
                                                                            </div>
                                                                        </div>`;
                                                },
                                            }),
                                            html ` <div class="tx_700">基本設定</div>`,
                                            html ` <div class="tx_normal">分銷連結名稱</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: (_c = vm.data.title) !== null && _c !== void 0 ? _c : '',
                                                placeHolder: '請輸入分銷連結名稱',
                                                callback: (text) => {
                                                    vm.data.title = text;
                                                },
                                            })}`,
                                        ].join(BgWidget.mbContainer(18))),
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">分潤條件</div>`,
                                            html ` <div class="tx_700">訂單滿額</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${EditorElem.numberInput({
                                                gvc: gvc,
                                                title: '',
                                                default: (_d = vm.data.condition) !== null && _d !== void 0 ? _d : 0,
                                                placeHolder: '請輸入分銷代碼',
                                                callback: (text) => {
                                                    vm.data.condition = text;
                                                },
                                                min: 0,
                                                unit: '元',
                                                readonly: vm.readonly,
                                            })}`,
                                            BgWidget.horizontalLine(),
                                            html ` <div class="tx_700">分潤類型</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${BgWidget.multiCheckboxContainer(gvc, [
                                                { key: 'none', name: '沒有分潤' },
                                                {
                                                    key: 'fix',
                                                    name: '固定金額',
                                                    innerHtml: html `<div style="margin: 4px 0 8px;">${BgWidget.grayNote('每筆訂單分潤固定金額', 'font-size: 14px;')}</div>
                                                                                ${EditorElem.numberInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        default: (_e = vm.data.share_value) !== null && _e !== void 0 ? _e : 0,
                                                        placeHolder: '請輸入數值',
                                                        callback: (text) => {
                                                            vm.data.share_value = text;
                                                            gvc.notifyDataChange(id);
                                                        },
                                                        min: 0,
                                                        unit: '元',
                                                    })}`,
                                                },
                                                {
                                                    key: 'percent',
                                                    name: '百分比',
                                                    innerHtml: html `<div style="margin: 4px 0 8px;">
                                                                                    ${BgWidget.grayNote('分潤計算方式為: (訂單結算金額 - 運費)*分潤百分比', 'font-size: 14px;')}
                                                                                </div>
                                                                                ${EditorElem.numberInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        default: (_f = vm.data.share_value) !== null && _f !== void 0 ? _f : 0,
                                                        placeHolder: '請輸入數值',
                                                        callback: (text) => {
                                                            vm.data.share_value = text;
                                                            gvc.notifyDataChange(id);
                                                        },
                                                        max: 100,
                                                        min: 0,
                                                        unit: '%',
                                                    })}`,
                                                },
                                            ], [(_g = vm.data.share_type) !== null && _g !== void 0 ? _g : ''], (data) => {
                                                vm.data.share_type = data[0];
                                            }, { single: true, readonly: vm.readonly })}`,
                                        ].join(BgWidget.mbContainer(18))),
                                        BgWidget.mainCard((() => {
                                            const id = gvc.glitter.getUUID();
                                            return gvc.bindView({
                                                bind: id,
                                                view: () => {
                                                    var _a;
                                                    return html `<div class="tx_700">優惠折扣</div>
                                                                        ${BgWidget.mbContainer(8)}
                                                                        ${BgWidget.multiCheckboxContainer(gvc, [
                                                        { key: 'no', name: '不套用折扣' },
                                                        {
                                                            key: 'yes',
                                                            name: '套用折扣',
                                                            innerHtml: html `<div style="margin: 4px 0 8px;">
                                                                                            ${BgWidget.grayNote('請至「優惠促銷」新增折扣，折扣方式必須勾選「供分銷連結使用」', 'font-size: 14px;')}
                                                                                        </div>
                                                                                        ${BgWidget.select({
                                                                gvc: gvc,
                                                                callback: (text) => {
                                                                    vm.data.voucher = parseInt(text, 10);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                default: vm.data.voucher ? `${vm.data.voucher}` : '',
                                                                options: [{ key: '', value: '（請選擇優惠券）' }].concat(vm.voucherList.map((item) => {
                                                                    return { key: `${item.id}`, value: item.content.title };
                                                                })),
                                                            })}`,
                                                        },
                                                    ], [(_a = vm.data.voucher_status) !== null && _a !== void 0 ? _a : ''], (data) => {
                                                        vm.data.voucher_status = data[0];
                                                    }, { single: true })}
                                                                        ${(() => {
                                                        const voucherData = vm.voucherList.find((item) => item.id === vm.data.voucher);
                                                        if (!voucherData) {
                                                            return '';
                                                        }
                                                        const vou = voucherData.content;
                                                        return [
                                                            BgWidget.horizontalLine(),
                                                            html `<div class="tx_700">優惠概覽</div>`,
                                                            BgWidget.summaryHTML([
                                                                [
                                                                    `優惠活動名稱: ${vou.title}`,
                                                                    `適用顧客範圍: ${(() => {
                                                                        switch (vou.target) {
                                                                            case 'customer':
                                                                                return '特定顧客';
                                                                            case 'levels':
                                                                                return '會員等級';
                                                                            case 'group':
                                                                                return '顧客分群';
                                                                            case 'all':
                                                                            default:
                                                                                return '所有顧客';
                                                                        }
                                                                    })()}`,
                                                                    `將此優惠套用至: ${(() => {
                                                                        switch (vou.for) {
                                                                            case 'collection':
                                                                                return `指定 ${vou.forKey.length} 種商品分類`;
                                                                            case 'product':
                                                                                return `指定 ${vou.forKey.length} 個商品`;
                                                                            case 'all':
                                                                            default:
                                                                                return '所有商品';
                                                                        }
                                                                    })()}`,
                                                                    `消費條件: ${(() => {
                                                                        if (vou.rule === 'min_price')
                                                                            return `最少消費金額 ${vou.ruleValue} 元`;
                                                                        if (vou.rule === 'min_count')
                                                                            return `最少購買數量 ${vou.ruleValue} 個`;
                                                                        return '';
                                                                    })()}`,
                                                                    `折扣優惠: ${(() => {
                                                                        switch (vou.reBackType) {
                                                                            case 'rebate':
                                                                                return vou.method === 'fixed' ? `${vou.value} 點購物金` : `訂單總額的 ${vou.value} ％作為購物金`;
                                                                            case 'discount':
                                                                                return vou.method === 'fixed' ? `折扣 ${vou.value} 元` : `訂單總額折扣 ${vou.value} ％`;
                                                                            case 'shipment_free':
                                                                                return '免運費';
                                                                            default:
                                                                                return '';
                                                                        }
                                                                    })()}`,
                                                                ],
                                                            ]),
                                                        ].join(BgWidget.mbContainer(18));
                                                    })()}`;
                                                },
                                            });
                                        })()),
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">推薦人帳號</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'old',
                                                    name: '現有推薦人',
                                                    innerHtml: (() => {
                                                        const id = glitter.getUUID();
                                                        return gvc.bindView({
                                                            bind: id,
                                                            view: () => {
                                                                var _a;
                                                                const user = vm.users.find((user) => user.id === vm.data.recommend_user.id);
                                                                return html `<div>
                                                                                            ${BgWidget.select({
                                                                    gvc: gvc,
                                                                    callback: (text) => {
                                                                        vm.data.recommend_user.id = parseInt(text, 10);
                                                                        gvc.notifyDataChange(id);
                                                                        gvc.notifyDataChange(vm.noteId);
                                                                    },
                                                                    default: `${(_a = vm.data.recommend_user.id) !== null && _a !== void 0 ? _a : 0}`,
                                                                    options: [{ key: '', value: '（請選擇推薦人）' }].concat(vm.users.map((item) => {
                                                                        return { key: `${item.id}`, value: `${item.content.name}（${item.email}）` };
                                                                    })),
                                                                    readonly: vm.readonly,
                                                                })}
                                                                                            ${user && vm.data.recommend_user.id !== 0
                                                                    ? [
                                                                        '',
                                                                        html `<div class="tx_normal">名字</div>`,
                                                                        EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            default: user.content.name,
                                                                            placeHolder: '請輸入名字',
                                                                            callback: () => { },
                                                                            readonly: true,
                                                                        }),
                                                                        html ` <div class="tx_normal">電子信箱</div>
                                                                                                          ${BgWidget.grayNote('將作為登入帳號，系統會寄送隨機密碼至此信箱', 'font-size: 14px;')}`,
                                                                        EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            default: user.email,
                                                                            placeHolder: '',
                                                                            callback: () => { },
                                                                            readonly: true,
                                                                        }),
                                                                        html `<div class="tx_normal">電話</div>`,
                                                                        EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            default: user.content.phone,
                                                                            placeHolder: '',
                                                                            callback: () => { },
                                                                            readonly: true,
                                                                        }),
                                                                    ].join(BgWidget.mbContainer(8))
                                                                    : ''}
                                                                                        </div>`;
                                                            },
                                                        });
                                                    })(),
                                                },
                                                {
                                                    key: 'new',
                                                    name: '添加新推薦人',
                                                    innerHtml: (() => {
                                                        var _a, _b;
                                                        const user = vm.users.find((user) => user.id === vm.data.recommend_user.id);
                                                        return html `<div>
                                                                                    ${[
                                                            html `<div class="tx_normal">名字</div>`,
                                                            EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                default: user ? user.content.name : (_a = vm.data.recommend_user.name) !== null && _a !== void 0 ? _a : '',
                                                                placeHolder: '請輸入名字',
                                                                callback: (text) => {
                                                                    vm.data.recommend_user.name = text;
                                                                    gvc.notifyDataChange(vm.noteId);
                                                                },
                                                                readonly: vm.readonly,
                                                            }),
                                                            html ` <div class="tx_normal">電子信箱</div>
                                                                                            ${BgWidget.grayNote('將作為登入帳號，系統會寄送隨機密碼至此信箱', 'font-size: 14px;')}`,
                                                            gvc.bindView((() => {
                                                                const id = glitter.getUUID();
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        var _a;
                                                                        return EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            default: user ? user.content.email : (_a = vm.data.recommend_user.email) !== null && _a !== void 0 ? _a : '',
                                                                            placeHolder: '請輸入電子信箱',
                                                                            callback: (text) => {
                                                                                if (vm.users.find((user) => user.email === text)) {
                                                                                    dialog.infoMessage({ text: '此推薦人信箱已建立<br />請更換其他信箱' });
                                                                                    gvc.notifyDataChange(id);
                                                                                }
                                                                                else {
                                                                                    vm.data.recommend_user.email = text;
                                                                                }
                                                                            },
                                                                            readonly: vm.readonly,
                                                                        });
                                                                    },
                                                                };
                                                            })()),
                                                            html `<div class="tx_normal">電話</div>`,
                                                            EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                default: user ? user.content.phone : (_b = vm.data.recommend_user.phone) !== null && _b !== void 0 ? _b : '',
                                                                placeHolder: '請輸入電話',
                                                                callback: (text) => {
                                                                    vm.data.recommend_user.phone = text;
                                                                },
                                                                readonly: vm.readonly,
                                                            }),
                                                        ].join(BgWidget.mbContainer(8))}
                                                                                </div>`;
                                                    })(),
                                                },
                                            ], [(_h = vm.data.recommend_status) !== null && _h !== void 0 ? _h : ''], (data) => {
                                                vm.data.recommend_status = data[0];
                                                if (!vm.readonly && vm.data.recommend_status === 'new') {
                                                    vm.data.recommend_user = {
                                                        id: 0,
                                                        name: '',
                                                        email: '',
                                                        phone: '',
                                                    };
                                                }
                                            }, { single: true, readonly: vm.readonly })}`,
                                            html ` <div class="tx_700">推薦媒介（可複選）</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${BgWidget.selectDropList({
                                                gvc: gvc,
                                                callback: (value) => {
                                                    vm.data.recommend_medium = value;
                                                },
                                                default: (_j = vm.data.recommend_medium) !== null && _j !== void 0 ? _j : [],
                                                options: mediumList,
                                                style: 'width: 100%; background-position-x: 97.5%;',
                                            })}`,
                                        ].join(BgWidget.mbContainer(18))),
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">活動時間</div>`,
                                            html `<div class="tx_normal">開始時間</div>`,
                                            html ` <div class="d-flex mb-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'date',
                                                style: inputStyle,
                                                default: (_k = vm.data.startDate) !== null && _k !== void 0 ? _k : getDateTime().date,
                                                placeHolder: '',
                                                callback: (text) => {
                                                    vm.data.startDate = text;
                                                },
                                            })}
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'time',
                                                style: inputStyle,
                                                default: (_l = vm.data.startTime) !== null && _l !== void 0 ? _l : getDateTime().time,
                                                placeHolder: '',
                                                callback: (text) => {
                                                    vm.data.startTime = text;
                                                },
                                            })}
                                                            </div>`,
                                            BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'withEnd',
                                                    name: '設定結束時間',
                                                    innerHtml: html `<div class="d-flex mt-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                                            ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'date',
                                                        style: inputStyle,
                                                        default: (_m = vm.data.endDate) !== null && _m !== void 0 ? _m : getDateTime(7).date,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            vm.data.endDate = text;
                                                        },
                                                    })}
                                                                            ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'time',
                                                        style: inputStyle,
                                                        default: (_o = vm.data.endTime) !== null && _o !== void 0 ? _o : getDateTime(7).time,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            vm.data.endTime = text;
                                                        },
                                                    })}
                                                                        </div>`,
                                                },
                                            ], [vm.data.endDate ? 'withEnd' : ''], (data) => {
                                                var _a, _b;
                                                if (data[0] === 'withEnd') {
                                                    vm.data.endDate = (_a = vm.data.endDate) !== null && _a !== void 0 ? _a : getDateTime(7).date;
                                                    vm.data.endTime = (_b = vm.data.endTime) !== null && _b !== void 0 ? _b : getDateTime(7).time;
                                                }
                                                else {
                                                    vm.data.endDate = undefined;
                                                    vm.data.endTime = undefined;
                                                }
                                            }, { single: false }),
                                        ].join(BgWidget.mbContainer(18))),
                                    ];
                                    return map.join(BgWidget.mbContainer(24));
                                },
                                divCreate: { class: 'p-0' },
                            };
                        }), undefined, 'padding: 0; margin: 0 !important; width: 65%;')}
                                ${BgWidget.container(gvc.bindView(() => {
                            return {
                                bind: vm.noteId,
                                dataList: [
                                    { obj: vm.data, key: 'code' },
                                    { obj: vm.data, key: 'title' },
                                    { obj: vm.data, key: 'voucher_status' },
                                    { obj: vm.data, key: 'voucher' },
                                    { obj: vm.data, key: 'share_type' },
                                    { obj: vm.data, key: 'share_value' },
                                    { obj: vm.data, key: 'recommend_medium' },
                                    { obj: vm.data, key: 'startDate' },
                                ],
                                view: () => {
                                    return BgWidget.mainCard(BgWidget.summaryHTML([
                                        [
                                            `分銷代碼: ${vm.data.code.length > 0 ? vm.data.code : '尚未輸入分銷代碼'}`,
                                            `分銷連結名稱: ${vm.data.title.length > 0 ? vm.data.title : '尚未輸入分銷連結名稱'}`,
                                        ],
                                        [
                                            vm.data.voucher_status === 'yes'
                                                ? `套用折扣: ${(() => {
                                                    const voucher = vm.voucherList.find((v) => v.id === vm.data.voucher);
                                                    return voucher && voucher.content && voucher.content.title ? voucher.content.title : '尚未選擇優惠券';
                                                })()}`
                                                : '不套用折扣',
                                        ],
                                        [
                                            (() => {
                                                switch (vm.data.share_type) {
                                                    case 'fix':
                                                        return `分潤按固定金額 ${vm.data.share_value} 元`;
                                                    case 'percent':
                                                        return `分潤按百分比 ${vm.data.share_value} %`;
                                                    case 'none':
                                                    default:
                                                        return '沒有分潤';
                                                }
                                            })(),
                                            `推薦人: ${vm.data.recommend_user.id
                                                ? getRecommender(vm.users, vm.data.recommend_user)
                                                : vm.data.recommend_user.name.length > 0
                                                    ? vm.data.recommend_user.name
                                                    : '尚未選擇推薦人'}`,
                                            `推薦媒介: ${vm.data.recommend_medium.length > 0
                                                ? mediumList
                                                    .filter((item) => {
                                                    return vm.data.recommend_medium.includes(item.key);
                                                })
                                                    .map((item) => {
                                                    return item.value;
                                                })
                                                : ' 尚未選擇推薦媒介'}`,
                                            `啟用時間: ${vm.data.startDate}`,
                                        ],
                                    ]));
                                },
                                divCreate: { class: 'summary-card p-0' },
                            };
                        }), undefined, 'padding: 0; margin: 0 !important; width: 35%;')}
                            </div>`,
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                                ${cf.data.id
                            ? BgWidget.danger(gvc.event(() => {
                                this.deleteLink({
                                    gvc: gvc,
                                    ids: [cf.data.id],
                                    callback: () => {
                                        cf.callback();
                                    },
                                });
                            }))
                            : ''}
                                ${BgWidget.cancel(gvc.event(() => {
                            cf.callback();
                        }))}
                                ${BgWidget.save(gvc.event(() => {
                            const valids = [
                                { key: 'code', text: '分銷代碼不得為空白' },
                                { key: 'title', text: '分銷連結名稱不得為空白' },
                            ];
                            for (const v of valids) {
                                if (vm.data[v.key] === undefined || vm.data[v.key].length === 0 || vm.data[v.key] === null) {
                                    dialog.infoMessage({ text: v.text });
                                    return;
                                }
                            }
                            if (vm.data.recommend_status === 'old' && vm.data.recommend_user.id === 0) {
                                dialog.infoMessage({ text: '請選擇推薦人' });
                                return;
                            }
                            if (vm.data.recommend_status === 'new') {
                                if (vm.data.recommend_user.email === '' || vm.data.recommend_user.email === '' || vm.data.recommend_user.email === '') {
                                    dialog.infoMessage({ text: '請確實填寫推薦人資訊' });
                                    return;
                                }
                                if (!checkEmailPattern(vm.data.recommend_user.email)) {
                                    dialog.infoMessage({ text: '請輸入正確的電子信箱格式' });
                                    return;
                                }
                                if (!checkPhonePattern(vm.data.recommend_user.phone)) {
                                    dialog.infoMessage({ text: '請輸入正確的手機號碼格式' });
                                    return;
                                }
                            }
                            dialog.dataLoading({ visible: true });
                            if (vm.readonly) {
                                ApiRecommend.putListData({
                                    id: cf.data.id,
                                    data: vm.data,
                                }).then((data) => {
                                    dialog.dataLoading({ visible: false });
                                    if (data.result) {
                                        cf.callback();
                                        dialog.successMessage({ text: '儲存成功' });
                                    }
                                    else {
                                        dialog.errorMessage({ text: '儲存失敗' });
                                    }
                                });
                            }
                            else {
                                vm.data.status = true;
                                ApiRecommend.postListData({
                                    data: vm.data,
                                }).then((data) => {
                                    var _a;
                                    dialog.dataLoading({ visible: false });
                                    if (data.result) {
                                        if (data.response.result) {
                                            cf.callback();
                                            dialog.successMessage({ text: '儲存成功' });
                                        }
                                        else {
                                            dialog.errorMessage({ text: (_a = data.response.message) !== null && _a !== void 0 ? _a : '儲存失敗' });
                                        }
                                    }
                                    else {
                                        dialog.errorMessage({ text: '儲存失敗' });
                                    }
                                });
                            }
                        }))}
                            </div>`,
                    ].join('<div class="my-2"></div>'), BgWidget.getContainerWidth(), 'position: relative');
                },
                onCreate: () => {
                    if (vm.loading) {
                        Promise.all([
                            new Promise((resolve) => {
                                ApiShop.getVoucher({
                                    page: 0,
                                    limit: 99999,
                                }).then((data) => {
                                    if (data.result) {
                                        resolve(data.response.data.filter((item) => {
                                            return item.content.trigger === 'distribution';
                                        }));
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }),
                            new Promise((resolve) => {
                                ApiRecommend.getUsers({
                                    data: {},
                                    page: 0,
                                    limit: 99999,
                                    token: window.parent.config.token,
                                }).then((data) => {
                                    if (data.result) {
                                        resolve(data.response.data);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }),
                        ]).then((data) => {
                            vm.voucherList = data[0];
                            vm.users = data[1];
                            vm.loading = false;
                            gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            };
        });
    }
    static editorUser(cf) {
        var _a;
        const html = String.raw;
        const gvc = cf.gvc;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const vm = {
            id: glitter.getUUID(),
            previewId: glitter.getUUID(),
            noteId: glitter.getUUID(),
            type: 'user',
            data: (_a = cf.data.content) !== null && _a !== void 0 ? _a : {},
            loading: true,
            voucherList: [],
            readonly: cf.data.id !== undefined,
        };
        const linkVM = {
            id: glitter.getUUID(),
            filterId: glitter.getUUID(),
            type: 'list',
            loading: true,
            users: [],
            editData: {},
            dataList: undefined,
            query: '',
        };
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.loading) {
                        return BgWidget.spinner({ textNone: true });
                    }
                    if (vm.type === 'user') {
                        return BgWidget.container([
                            html ` <div class="d-flex flex-column mt-1">
                                        <div class="d-flex w-100 align-items-center mb-2">
                                            <div class="mt-1">
                                                ${BgWidget.goBack(gvc.event(() => {
                                cf.callback();
                            }))}
                                            </div>
                                            ${BgWidget.title(vm.data.name || '新增推薦人')}
                                        </div>
                                        <div class="ms-3 mb-2">${cf.data.id ? BgWidget.grayNote(`建立時間: ${Tool.convertDateTimeFormat(cf.data.created_time)}`) : ''}</div>
                                    </div>
                                    <div class="flex-fill"></div>`,
                            html `<div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                                    ${BgWidget.container(gvc.bindView(() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        var _a, _b, _c, _d;
                                        return [
                                            BgWidget.mainCard([
                                                html `<div class="tx_700">推薦人資訊</div>`,
                                                html `<div class="row">
                                                                    <div class="col-12 col-md-6">
                                                                        <div class="tx_normal">姓名</div>
                                                                        ${BgWidget.mbContainer(8)}
                                                                        ${EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: (_a = vm.data.name) !== null && _a !== void 0 ? _a : '',
                                                    placeHolder: '請輸入推薦人姓名',
                                                    callback: (text) => {
                                                        vm.data.name = text;
                                                    },
                                                })}
                                                                    </div>
                                                                    ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                                                                    <div class="col-12 col-md-6">
                                                                        <div class="tx_normal">電子信箱</div>
                                                                        ${BgWidget.mbContainer(8)}
                                                                        ${EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: (_b = vm.data.email) !== null && _b !== void 0 ? _b : '',
                                                    placeHolder: '請輸入推薦人電子信箱',
                                                    callback: (text) => {
                                                        vm.data.email = text;
                                                    },
                                                })}
                                                                    </div>
                                                                </div>`,
                                                html `<div class="tx_normal">電話</div>
                                                                    ${BgWidget.mbContainer(8)}
                                                                    ${EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: (_c = vm.data.phone) !== null && _c !== void 0 ? _c : '',
                                                    placeHolder: '請輸入推薦人電話',
                                                    callback: (text) => {
                                                        vm.data.phone = text;
                                                    },
                                                })}`,
                                                html `<div class="tx_normal">推薦人備註</div>
                                                                    <div style="margin: 4px 0 8px;">${BgWidget.grayNote('只有後台管理員看得見', 'font-size: 14px;')}</div>
                                                                    ${EditorElem.editeText({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: (_d = vm.data.note) !== null && _d !== void 0 ? _d : '',
                                                    placeHolder: '請輸入備註',
                                                    callback: (text) => {
                                                        vm.data.note = text;
                                                    },
                                                })}`,
                                            ].join(BgWidget.mbContainer(18))),
                                            cf.data.id
                                                ? BgWidget.mainCard([
                                                    html `<div class="tx_700">分銷連結</div>`,
                                                    this.linkTable({
                                                        gvc,
                                                        vm: linkVM,
                                                        rowCallback: (data, index) => {
                                                            linkVM.editData = linkVM.dataList[index];
                                                            vm.type = 'link';
                                                        },
                                                        user_id: cf.data.id,
                                                    }),
                                                ].join(''))
                                                : '',
                                        ]
                                            .filter((item) => {
                                            return item.length > 0;
                                        })
                                            .join(BgWidget.mbContainer(24));
                                    },
                                    divCreate: { class: 'p-0' },
                                };
                            }), BgWidget.getContainerWidth(), 'padding: 0; margin: 0 !important;')}
                                </div>`,
                            BgWidget.mbContainer(240),
                            html ` <div class="update-bar-container">
                                    ${vm.readonly
                                ? BgWidget.danger(gvc.event(() => {
                                    this.deleteUser({
                                        gvc: gvc,
                                        ids: [cf.data.id],
                                        callback: () => {
                                            cf.callback();
                                        },
                                    });
                                }))
                                : ''}
                                    ${BgWidget.cancel(gvc.event(() => {
                                cf.callback();
                            }))}
                                    ${BgWidget.save(gvc.event(() => {
                                const valids = [
                                    { key: 'name', text: '姓名不得為空白' },
                                    { key: 'email', text: '信箱不得為空白' },
                                    { key: 'phone', text: '電話不得為空白' },
                                ];
                                for (const v of valids) {
                                    if (vm.data[v.key] === undefined || vm.data[v.key].length === 0 || vm.data[v.key] === null) {
                                        dialog.infoMessage({ text: v.text });
                                        return;
                                    }
                                }
                                if (!checkEmailPattern(vm.data.email)) {
                                    dialog.infoMessage({ text: '請輸入正確的電子信箱格式' });
                                    return;
                                }
                                if (!checkPhonePattern(vm.data.phone)) {
                                    dialog.infoMessage({ text: '請輸入正確的手機號碼格式' });
                                    return;
                                }
                                dialog.dataLoading({ visible: true });
                                if (vm.readonly) {
                                    ApiRecommend.putUserData({
                                        id: cf.data.id,
                                        data: vm.data,
                                    }).then((data) => {
                                        dialog.dataLoading({ visible: false });
                                        if (data.result) {
                                            cf.callback();
                                            dialog.successMessage({ text: '儲存成功' });
                                        }
                                        else {
                                            dialog.errorMessage({ text: '儲存失敗' });
                                        }
                                    });
                                }
                                else {
                                    ApiRecommend.postUserData({
                                        data: vm.data,
                                    }).then((data) => {
                                        dialog.dataLoading({ visible: false });
                                        if (data.result) {
                                            cf.callback();
                                            dialog.successMessage({ text: '儲存成功' });
                                        }
                                        else {
                                            dialog.errorMessage({ text: '儲存失敗' });
                                        }
                                    });
                                }
                            }))}
                                </div>`,
                        ].join('<div class="my-2"></div>'), BgWidget.getContainerWidth(), 'position: relative');
                    }
                    if (vm.type === 'link') {
                        return this.editorLink({
                            gvc: gvc,
                            widget: cf.widget,
                            data: linkVM.editData,
                            callback: () => {
                                vm.type = 'user';
                            },
                        });
                    }
                    return '';
                },
                onCreate: () => {
                    if (vm.loading) {
                        Promise.all([
                            new Promise((resolve) => {
                                ApiShop.getVoucher({
                                    page: 0,
                                    limit: 99999,
                                }).then((data) => {
                                    if (data.result) {
                                        resolve(data.response.data.filter((item) => {
                                            return item.content.trigger === 'distribution';
                                        }));
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }),
                        ]).then((data) => {
                            vm.voucherList = data[0];
                            vm.loading = false;
                            gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            };
        });
    }
    static deleteLink(obj) {
        const dialog = new ShareDialog(obj.gvc.glitter);
        dialog.checkYesOrNot({
            text: '是否確認刪除所選項目？',
            callback: (response) => {
                if (response) {
                    dialog.dataLoading({ visible: true });
                    ApiRecommend.deleteLinkData({
                        token: window.parent.config.token,
                        data: { id: obj.ids },
                    }).then((data) => {
                        var _a;
                        dialog.dataLoading({ visible: false });
                        if (data.result) {
                            if (data.response.result) {
                                dialog.successMessage({ text: '刪除成功' });
                                obj.callback();
                            }
                            else {
                                dialog.errorMessage({ text: (_a = data.response.message) !== null && _a !== void 0 ? _a : '刪除失敗' });
                            }
                        }
                        else {
                            dialog.errorMessage({ text: '刪除失敗' });
                        }
                    });
                }
            },
        });
    }
    static deleteUser(obj) {
        const dialog = new ShareDialog(obj.gvc.glitter);
        dialog.checkYesOrNot({
            text: '若刪除推薦人，也將同時刪除與此推薦人相關的分銷連結，<br />是否確認刪除所選項目？',
            callback: (response) => {
                if (response) {
                    dialog.dataLoading({ visible: true });
                    ApiRecommend.deleteUserData({
                        token: window.parent.config.token,
                        data: { id: obj.ids },
                    }).then((data) => {
                        var _a;
                        dialog.dataLoading({ visible: false });
                        if (data.result) {
                            if (data.response.result) {
                                dialog.successMessage({ text: '刪除成功' });
                                obj.callback();
                            }
                            else {
                                dialog.errorMessage({ text: (_a = data.response.message) !== null && _a !== void 0 ? _a : '刪除失敗' });
                            }
                        }
                        else {
                            dialog.errorMessage({ text: '刪除失敗' });
                        }
                    });
                }
            },
        });
    }
}
function checkEmailPattern(input) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(input);
}
function checkPhonePattern(input) {
    const phonePattern = /^09\d{8}$/;
    return phonePattern.test(input);
}
function getRecommender(userList, data) {
    if (data.name && data.name.length > 0) {
        return data.name;
    }
    const user = userList.find((u) => u.id === data.id);
    return user ? user.content.name : '';
}
function getDateTime(n = 0) {
    const now = new Date();
    now.setDate(now.getDate() + n);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:00`;
    return { date: dateStr, time: timeStr };
}
window.glitter.setModule(import.meta.url, BgRecommend);