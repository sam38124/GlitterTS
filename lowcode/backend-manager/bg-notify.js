var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from './bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { ApiFcm } from '../glitter-base/route/fcm.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { Chat } from '../glitter-base/route/chat.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { ShoppingDiscountSetting } from '../cms-plugin/shopping-discount-setting.js';
import { ApiSmtp } from '../glitter-base/route/smtp.js';
import { BgListComponent } from './bg-list-component.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
const inputStyle = 'font-size: 16px; height:40px; width:300px;';
export class BgNotify {
    static email(gvc, type = 'list', callback = () => { }) {
        const vm = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi = undefined;
                    function getDatalist() {
                        let interval = 0;
                        return vm.dataList.map((dd) => {
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (!vm.dataList.find((dd) => {
                                            return !dd.checked;
                                        })) {
                                            interval = setTimeout(() => {
                                                ApiUser.getSubScribe({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }
                                        return EditorElem.checkBoxOnly({
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
                                                gvc.notifyDataChange(filterID);
                                                callback(vm.dataList.filter((dd) => {
                                                    return dd.checked;
                                                }));
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(vm.dataList.filter((dd) => {
                                                return dd.checked;
                                            }));
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '註冊信箱',
                                    value: `<span class="fs-7">${dd.email}</span>`,
                                },
                                {
                                    key: '訂閱標籤',
                                    value: `<span class="fs-7">${dd.tag}</span>`,
                                },
                            ];
                        });
                    }
                    return BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                        gvc: gvc,
                        getData: (vmk) => {
                            vmi = vmk;
                            ApiUser.getSubScribe({
                                page: vmi.page - 1,
                                limit: 20,
                                search: vm.query || undefined,
                                filter: { account: 'no' },
                            }).then((data) => {
                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                vm.dataList = data.response.data;
                                vmi.data = getDatalist();
                                vmi.loading = false;
                                vmi.callback();
                                if (type === 'select') {
                                    callback(vm.dataList.filter((dd) => {
                                        return dd.checked;
                                    }));
                                }
                            });
                        },
                        rowClick: (data, index) => {
                            vm.dataList[index].checked = !vm.dataList[index].checked;
                            vmi.data = getDatalist();
                            vmi.callback();
                            gvc.notifyDataChange(filterID);
                            callback(vm.dataList.filter((dd) => {
                                return dd.checked;
                            }));
                        },
                        filter: html `
                                    ${BgWidget.searchPlace(gvc.event((e, event) => {
                            vm.query = e.value;
                            gvc.notifyDataChange(id);
                        }), vm.query || '', '搜尋信箱或標籤')}
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
                                                                ApiUser.deleteSubscribe({
                                                                    email: vm.dataList
                                                                        .filter((dd) => {
                                                                        return dd.checked;
                                                                    })
                                                                        .map((dd) => {
                                                                        return dd.email;
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
                                            }) ||
                                            type === 'select'
                                            ? `d-none`
                                            : ``}`,
                                        style: ``,
                                    };
                                },
                            };
                        })}
                                `,
                    })), type === 'select' ? 850 : BgWidget.getContainerWidth(), 'padding: 0;');
                },
            };
        });
    }
    static emailSetting(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: undefined,
        };
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const filterID = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('信件樣式')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增', gvc.event(() => {
                            vm.data = undefined;
                            vm.type = 'add';
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vmi) => {
                                ApiPost.getManagerPost({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query ? [`title->${vm.query}`] : undefined,
                                    type: 'notify-email-config',
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
                                                        style: 'height:25px;',
                                                    }),
                                                },
                                                {
                                                    key: '標題',
                                                    value: html `<span class="fs-7">${dd.content.title}</span>`,
                                                },
                                                {
                                                    key: '最後更新時間',
                                                    value: dd.updated_time ? gvc.glitter.ut.dateFormat(new Date(dd.updated_time), 'yyyy-MM-dd') : '無',
                                                },
                                            ];
                                        });
                                    }
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            style: ['', `min-width: ${BgWidget.getContainerWidth() / 2 - 30}px`, ''],
                            rowClick: (data, index) => {
                                vm.data = vm.dataList[index].content;
                                vm.type = 'replace';
                            },
                            filter: html ` ${BgWidget.searchPlace(gvc.event((e) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有信件內容')}
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
                                                                    ApiPost.delete({
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
                            })}`,
                        })))}
                                ${BgWidget.mbContainer(120)}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type == 'replace') {
                        return this.emailEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    }
                    else {
                        return this.emailEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                        });
                    }
                },
            };
        });
    }
    static emailHistory(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: '',
            queryType: 'email',
            filter: {},
        };
        return gvc.bindView(() => {
            const ListComp = new BgListComponent(gvc, vm, FilterOptions.emailFilterFrame);
            vm.filter = ListComp.getFilterObject();
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('歷史寄件紀錄')}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.container(BgWidget.mainCard([
                            (() => {
                                const id = glitter.getUUID();
                                return gvc.bindView({
                                    bind: id,
                                    view: () => {
                                        const filterList = [
                                            BgWidget.selectFilter({
                                                gvc,
                                                callback: (value) => {
                                                    vm.queryType = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(id);
                                                },
                                                default: vm.queryType || 'email',
                                                options: FilterOptions.emailSelect,
                                            }),
                                            BgWidget.searchFilter(gvc.event((e) => {
                                                vm.query = e.value;
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(id);
                                            }), vm.query || '', '搜尋所有信件內容'),
                                            BgWidget.funnelFilter({
                                                gvc,
                                                callback: () => {
                                                    return ListComp.showRightMenu(FilterOptions.emailFunnel);
                                                },
                                            }),
                                        ];
                                        const filterTags = ListComp.getFilterTags(FilterOptions.emailFunnel);
                                        if (document.body.clientWidth < 768) {
                                            return html `<div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                    <div>${filterList[0]}</div>
                                                                    <div style="display: flex;">
                                                                        <div class="me-2">${filterList[2]}</div>
                                                                    </div>
                                                                </div>
                                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                                <div>${filterTags}</div>`;
                                        }
                                        else {
                                            return html `<div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                                <div>${filterTags}</div>`;
                                        }
                                    },
                                });
                            })(),
                            gvc.bindView({
                                bind: vm.tableId,
                                view: () => {
                                    return BgWidget.tableV2({
                                        gvc: gvc,
                                        getData: (vmi) => {
                                            var _a, _b;
                                            const limit = 20;
                                            ApiSmtp.history({
                                                page: vmi.page - 1,
                                                limit: limit,
                                                search: (_a = vm.query) !== null && _a !== void 0 ? _a : '',
                                                searchType: (_b = vm.queryType) !== null && _b !== void 0 ? _b : 'email',
                                                sendTime: undefined,
                                                status: vm.filter.status,
                                                mailType: vm.filter.mailType,
                                            }).then((data) => {
                                                if (data.result) {
                                                    vmi.pageSize = Math.ceil(data.response.total / limit);
                                                    vm.dataList = data.response.data;
                                                    function getDatalist() {
                                                        return data.response.data.map((dd) => {
                                                            return [
                                                                {
                                                                    key: '寄件類型',
                                                                    value: html `<span class="fs-7">${dd.content.typeName}</span>`,
                                                                },
                                                                {
                                                                    key: '標題',
                                                                    value: html `<span class="fs-7">${Tool.truncateString(`[${dd.content.name}] ${dd.content.title}`, 25)}</span>`,
                                                                },
                                                                {
                                                                    key: '收件群組',
                                                                    value: html `<span class="fs-7"
                                                                                        >${(() => {
                                                                        if (!dd.content.sendGroup) {
                                                                            return '沒有群組';
                                                                        }
                                                                        const lengthLimit = 25;
                                                                        const tagList = [];
                                                                        for (const group of dd.content.sendGroup) {
                                                                            const tagLength = tagList.join('').length;
                                                                            if (tagLength + group.length > lengthLimit) {
                                                                                tagList.push(Tool.truncateString(group, tagLength));
                                                                                break;
                                                                            }
                                                                            else {
                                                                                tagList.push(group);
                                                                            }
                                                                        }
                                                                        return tagList.join(html `<span class="badge fs-7 mx-1 px-1" style="color: #393939; background: #FFD5D0;"
                                                                                                    >${dd.content.boolean === 'and' ? '且' : '或'}</span
                                                                                                >`);
                                                                    })()}</span
                                                                                    >`,
                                                                },
                                                                {
                                                                    key: '寄送時間',
                                                                    value: dd.trigger_time ? gvc.glitter.ut.dateFormat(new Date(dd.trigger_time), 'yyyy-MM-dd hh:mm') : '無',
                                                                },
                                                                {
                                                                    key: '寄送狀態',
                                                                    value: (() => {
                                                                        switch (dd.status) {
                                                                            case 0:
                                                                                return html `<div class="badge fs-7" style="color: #393939; background: #ffd6a4;">尚未寄送</div>`;
                                                                            case 1:
                                                                                return html `<div class="badge fs-7" style="color: #393939; background: #0000000f;">已寄出</div>`;
                                                                        }
                                                                    })(),
                                                                },
                                                            ];
                                                        });
                                                    }
                                                    vmi.data = getDatalist();
                                                    vmi.loading = false;
                                                    vmi.callback();
                                                }
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            vm.dataList[index].content.status = vm.dataList[index].status;
                                            vm.data = vm.dataList[index].content;
                                            vm.type = 'replace';
                                        },
                                    });
                                },
                            }),
                        ].join('')))}
                                ${BgWidget.mbContainer(120)}
                            `, BgWidget.getContainerWidth());
                    }
                    return this.emailEditor({
                        vm: vm,
                        gvc: gvc,
                        type: 'replace',
                        readonly: true,
                    });
                },
            };
        });
    }
    static emailEditor(obj) {
        var _a;
        const gvc = obj.gvc;
        const vm = obj.vm;
        const postData = (_a = vm.data) !== null && _a !== void 0 ? _a : {
            content: '',
            title: '',
            type: 'notify-email-config',
            name: '',
        };
        return BgWidget.container(html `
                <div class="d-flex w-100 align-items-center">
                    ${BgWidget.goBack(gvc.event(() => {
            vm.type = 'list';
        }))}
                    ${BgWidget.title(obj.readonly ? '信件詳細內容' : '編輯信件樣式')}
                    <div class="flex-fill"></div>
                    ${obj.readonly
            ? [
                html `<div class="badge fs-7 me-2" style="color: #393939; background: #0000000f;">${vm.data.typeName}</div>`,
                (() => {
                    switch (vm.data.status) {
                        case 0:
                            return html `<div class="badge fs-7 me-1" style="color: #393939; background: #ffd6a4;">尚未寄送</div>`;
                        case 1:
                            return html `<div class="badge fs-7 me-1" style="color: #393939; background: #0000000f;">已寄出</div>`;
                    }
                })(),
            ].join('')
            : ''}
                </div>
                ${BgWidget.mbContainer(18)}
                ${BgWidget.container(obj.gvc.bindView(() => {
            const bi = obj.gvc.glitter.getUUID();
            return {
                bind: bi,
                view: () => {
                    var _a;
                    let htmlList = [];
                    if (obj.readonly) {
                        const sendGroupHTML = ((_a = vm.data.sendGroup) !== null && _a !== void 0 ? _a : []).map((str) => html `<div class="c_filter_tag">${str}</div>`);
                        const emailHTML = vm.data.email.map((str) => html `<div class="c_filter_tag">${str}</div>`);
                        htmlList = htmlList.concat([
                            BgWidget.mainCard(html `
                                                <div class="tx_normal fw-normal">篩選條件</div>
                                                <div class="c_filter_container">
                                                    ${sendGroupHTML.length === 0
                                ? '沒有群組'
                                : sendGroupHTML.join(html `<span class="badge fs-7 px-1" style="color: #393939; background: #FFD5D0;"
                                                              >${vm.data.boolean === 'and' ? '且' : '或'}</span
                                                          >`)}
                                                </div>
                                            `),
                            BgWidget.mainCard(html `
                                            <div class="tx_normal fw-normal">電子信箱</div>
                                            <div class="c_filter_container">${emailHTML.join('')}</div>
                                        `),
                            BgWidget.mainCard(html `<div class="tx_700 mb-3">發送時間</div>
                                            ${EditorElem.radio({
                                gvc: gvc,
                                title: '',
                                def: vm.data.sendTime === undefined ? 'now' : 'set',
                                array: [
                                    {
                                        title: '立即發送',
                                        value: 'now',
                                    },
                                    {
                                        title: '排定發送時間',
                                        value: 'set',
                                        innerHtml: html `<div class="d-flex mt-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                            ${EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            type: 'date',
                                            style: inputStyle,
                                            default: vm.data.sendTime ? vm.data.sendTime.date : '',
                                            placeHolder: '',
                                            callback: () => { },
                                            readonly: true,
                                        })}
                                                            ${EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            type: 'time',
                                            style: inputStyle,
                                            default: vm.data.sendTime ? vm.data.sendTime.time : '',
                                            placeHolder: '',
                                            callback: () => { },
                                            readonly: true,
                                        })}
                                                        </div>`,
                                    },
                                ],
                                callback: () => { },
                                readonly: true,
                            })}`),
                        ]);
                    }
                    htmlList = htmlList.concat([
                        BgWidget.mainCard(BgWidget.editeInput({
                            gvc: gvc,
                            title: '寄件者名稱',
                            default: postData.name,
                            placeHolder: '請輸入寄件者名稱',
                            callback: (text) => {
                                postData.name = text;
                            },
                            readonly: obj.readonly,
                        })),
                        BgWidget.mainCard(BgWidget.editeInput({
                            gvc: gvc,
                            title: '信件主旨',
                            default: postData.title,
                            placeHolder: '請輸入信件主旨',
                            callback: (text) => {
                                if (text === 'default') {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.infoMessage({ text: 'default 為系統預設值，請更改其他信件主旨' });
                                    postData.title = '';
                                    obj.gvc.notifyDataChange(bi);
                                    return;
                                }
                                postData.title = text;
                            },
                            readonly: obj.readonly,
                        })),
                        BgWidget.mainCard(html `<div class="d-flex align-items-center mb-3">
                                                <div class="tx_normal fw-normal me-2">信件內文</div>
                                                ${obj.readonly
                            ? ''
                            : BgWidget.selEventButton('範例', obj.gvc.event(() => {
                                postData.content = defaultEmailText();
                                obj.gvc.notifyDataChange(bi);
                            }))}
                                            </div>
                                            ${EditorElem.richText({
                            gvc: obj.gvc,
                            def: postData.content,
                            callback: (text) => {
                                postData.content = text;
                            },
                            style: `overflow-y: auto;`,
                            readonly: obj.readonly,
                        })}`),
                    ]);
                    return htmlList.filter((str) => str.length > 0).join(BgWidget.mbContainer(16));
                },
                divCreate: {},
            };
        }), BgWidget.getContainerWidth(), 'padding: 0 !important; margin: 0 !important;')}
                ${BgWidget.mbContainer(240)}
                <div class="update-bar-container">
                    ${obj.type === 'replace' && !obj.readonly
            ? BgWidget.danger(obj.gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                dialog.checkYesOrNot({
                    text: '是否確認刪除此信件樣式？',
                    callback: (response) => {
                        if (response) {
                            dialog.dataLoading({ visible: true });
                            ApiPost.delete({
                                id: postData.id,
                            }).then((res) => {
                                dialog.dataLoading({ visible: false });
                                if (res.result) {
                                    dialog.successMessage({ text: '刪除成功' });
                                    vm.type = 'list';
                                }
                                else {
                                    dialog.errorMessage({ text: '刪除失敗' });
                                }
                            });
                        }
                    },
                });
            }))
            : ''}
                    ${BgWidget.cancel(gvc.event(() => {
            vm.type = 'list';
        }), obj.readonly ? '關閉' : undefined)}
                    ${obj.readonly
            ? ''
            : BgWidget.save(gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                if (obj.type === 'replace') {
                    dialog.dataLoading({ text: '變更信件', visible: true });
                    ApiPost.put({
                        postData: postData,
                        token: window.parent.saasConfig.config.token,
                        type: 'manager',
                    }).then((re) => {
                        dialog.dataLoading({ visible: false });
                        if (re.result) {
                            vm.status = 'list';
                            dialog.successMessage({ text: '上傳成功' });
                        }
                        else {
                            dialog.errorMessage({ text: '上傳失敗' });
                        }
                    });
                }
                else {
                    dialog.dataLoading({ text: '新增信件', visible: true });
                    ApiPost.post({
                        postData: postData,
                        token: window.parent.saasConfig.config.token,
                        type: 'manager',
                    }).then((re) => {
                        dialog.dataLoading({ visible: false });
                        if (re.result) {
                            vm.type = 'list';
                            dialog.successMessage({ text: '上傳成功' });
                        }
                        else {
                            dialog.errorMessage({ text: '上傳失敗' });
                        }
                    });
                }
            }))}
                </div>
            `, BgWidget.getContainerWidth());
    }
    static emailSender(gvc) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        const startDate = ShoppingDiscountSetting.getDateTime(1).date;
        const startTime = ShoppingDiscountSetting.getDateTime(1).time;
        const vm = {
            id: glitter.getUUID(),
            containerId: glitter.getUUID(),
            emailId: glitter.getUUID(),
            tagsId: glitter.getUUID(),
            loading: true,
            dataList: [],
        };
        const postData = {
            type: 'notify-email-config',
            tag: '',
            tagList: [],
            userList: [],
            boolean: 'or',
            name: '',
            title: '',
            content: '',
            sendTime: { date: startDate, time: startTime },
            sendGroup: [],
        };
        function getOptions(tag) {
            return __awaiter(this, void 0, void 0, function* () {
                if (tag === 'level') {
                    return yield ApiUser.getPublicConfig('member_level_config', 'manager').then((res) => {
                        if (res.result && res.response.value && res.response.value.levels.length > 0) {
                            return res.response.value.levels.map((data) => {
                                return { key: data.id, value: data.tag_name };
                            });
                        }
                        return [];
                    });
                }
                if (tag === 'group') {
                    return yield ApiUser.getUserGroupList().then((res) => {
                        if (res.result) {
                            return res.response.data
                                .filter((data) => {
                                return data.type !== 'level';
                            })
                                .map((data) => {
                                return { key: data.type, value: data.title };
                            });
                        }
                        return [];
                    });
                }
                if (tag === 'birth') {
                    const birthData = FilterOptions.userFunnel.find((data) => data.key === 'birth');
                    if (birthData && Array.isArray(birthData.data)) {
                        return birthData.data.map((item) => {
                            item.value = item.name;
                            return item;
                        });
                    }
                }
                return [];
            });
        }
        function filterEvent(filter) {
            if (filter.length === 0) {
                postData.tagList = postData.tagList.filter((data) => data.tag !== postData.tag);
            }
            else {
                let valueString = '';
                if (postData.tag === 'all') {
                    valueString = '';
                }
                else if (Array.isArray(filter)) {
                    valueString = vm.dataList
                        .filter((data) => {
                        return filter.includes(data.key);
                    })
                        .map((data) => {
                        return data.value;
                    })
                        .join(', ');
                }
                else {
                    const intFiltter = parseInt(`${filter}`, 10);
                    filter = intFiltter > 0 ? intFiltter : 0;
                    valueString = filter;
                }
                const index = postData.tagList.findIndex((data) => data.tag === postData.tag);
                if (index === -1) {
                    postData.tagList.push({ tag: postData.tag, filter: filter, valueString });
                }
                else {
                    postData.tagList[index] = { tag: postData.tag, filter: filter, valueString };
                }
            }
            setUserList();
        }
        function filterEmails(emails, mode, n) {
            if (mode === 'or') {
                const uniqueIds = new Set();
                return emails.filter((emailObj) => {
                    if (!uniqueIds.has(emailObj.id)) {
                        uniqueIds.add(emailObj.id);
                        return true;
                    }
                    return false;
                });
            }
            else if (mode === 'and' && n && n > 0) {
                const frequencyMap = {};
                emails.forEach((emailObj) => {
                    if (frequencyMap[emailObj.id]) {
                        frequencyMap[emailObj.id].count += 1;
                    }
                    else {
                        frequencyMap[emailObj.id] = { count: 1, emailObj };
                    }
                });
                return Object.values(frequencyMap)
                    .filter((entry) => entry.count >= n)
                    .map((entry) => entry.emailObj);
            }
            return [];
        }
        function setUserList() {
            let n = 0;
            postData.userList = [];
            dialog.dataLoading({ visible: true, text: '更新預計寄件人...' });
            new Promise((resolve) => {
                const si = setInterval(() => {
                    if (postData.tagList.length === n) {
                        resolve();
                        clearInterval(si);
                    }
                }, 200);
                postData.tagList.map((tagData) => {
                    if (tagData.tag === 'all') {
                        ApiUser.getUserList({
                            page: 0,
                            limit: 99999,
                        }).then((dd) => {
                            dd.response.data.map((user) => {
                                if (user.userData.email && user.userData.email.length > 0) {
                                    postData.userList.push({
                                        id: user.userID,
                                        email: user.userData.email,
                                    });
                                }
                            });
                            n++;
                        });
                    }
                    if (tagData.tag === 'customers') {
                        ApiUser.getUserList({
                            page: 0,
                            limit: 99999,
                            id: tagData.filter.join(','),
                        }).then((dd) => {
                            dd.response.data.map((user) => {
                                if (user.userData.email && user.userData.email.length > 0) {
                                    postData.userList.push({
                                        id: user.userID,
                                        email: user.userData.email,
                                    });
                                }
                            });
                            n++;
                        });
                    }
                    if (tagData.tag === 'level') {
                        let n1 = 0;
                        new Promise((resolve) => {
                            const list = [];
                            tagData.filter.map((id) => {
                                ApiUser.getUserListOrders({
                                    page: 0,
                                    limit: 99999,
                                    group: { type: 'level', tag: id },
                                }).then((data) => {
                                    data.response.data.map((user) => {
                                        if (user.userData.email) {
                                            list.push({
                                                id: user.userID,
                                                email: user.userData.email,
                                            });
                                        }
                                    });
                                    n1++;
                                });
                                const si = setInterval(() => {
                                    if (tagData.filter.length === n1) {
                                        resolve(filterEmails(list, 'or'));
                                        clearInterval(si);
                                    }
                                }, 200);
                            });
                        }).then((res) => {
                            postData.userList = postData.userList.concat(res);
                            n++;
                        });
                    }
                    if (tagData.tag === 'group') {
                        let n2 = 0;
                        const list = [];
                        new Promise((resolve) => {
                            tagData.filter.map((type) => {
                                ApiUser.getUserListOrders({
                                    page: 0,
                                    limit: 99999,
                                    group: { type: type },
                                }).then((data) => {
                                    let dataArray = data.response.data;
                                    if (data.response.extra) {
                                        dataArray = dataArray.concat(data.response.extra.noRegisterUsers);
                                    }
                                    dataArray.map((user) => {
                                        if (user && user.userData.email) {
                                            list.push({
                                                id: user.userID,
                                                email: user.userData.email,
                                            });
                                        }
                                    });
                                    n2++;
                                });
                                const si = setInterval(() => {
                                    if (tagData.filter.length === n2) {
                                        resolve(filterEmails(list, 'or'));
                                        clearInterval(si);
                                    }
                                }, 200);
                            });
                        }).then((res) => {
                            postData.userList = postData.userList.concat(res);
                            n++;
                        });
                    }
                    if (tagData.tag === 'birth') {
                        ApiUser.getUserListOrders({
                            page: 0,
                            limit: 99999,
                            filter: { birth: tagData.filter },
                        }).then((data) => {
                            data.response.data.map((user) => {
                                if (user.userData.email) {
                                    postData.userList.push({
                                        id: user.userID,
                                        email: user.userData.email,
                                    });
                                }
                            });
                            n++;
                        });
                    }
                    if (tagData.tag === 'expiry') {
                    }
                    if (tagData.tag === 'remain') {
                        ApiUser.getUserListOrders({
                            page: 0,
                            limit: 99999,
                            filter: { rebate: { key: 'moreThan', value: tagData.filter } },
                        }).then((data) => {
                            data.response.data.map((user) => {
                                if (user.userData.email) {
                                    postData.userList.push({
                                        id: user.userID,
                                        email: user.userData.email,
                                    });
                                }
                            });
                            n++;
                        });
                    }
                    if (tagData.tag === 'uncheckout') {
                    }
                });
            }).then(() => {
                postData.userList = filterEmails(postData.userList, postData.boolean, postData.boolean === 'and' ? postData.tagList.length : undefined);
                dialog.dataLoading({ visible: false });
                gvc.notifyDataChange(vm.tagsId);
            });
        }
        function tagBadge(key, name, value) {
            const formatName = value && value.length > 0 ? `${name}：${value}` : name;
            return {
                name: formatName,
                html: html `<div class="c_filter_tag">
                    ${formatName}
                    <i
                        class="fa-solid fa-xmark ms-1"
                        style="cursor: pointer"
                        onclick="${gvc.event(() => {
                    postData.tagList = postData.tagList.filter((data) => data.tag !== key);
                    setUserList();
                    gvc.notifyDataChange(vm.tagsId);
                })}"
                    ></i>
                </div>`,
            };
        }
        function getTagsHTML() {
            const badgeList = [];
            postData.tagList.map((data) => {
                const opt = FilterOptions.emailOptions.find((item) => item.key === data.tag);
                if (opt) {
                    if (!Array.isArray(data.filter)) {
                        switch (data.tag) {
                            case 'remain':
                                data.valueString = `大於${data.filter}點`;
                                break;
                        }
                    }
                    badgeList.push(tagBadge(data.tag, opt.value, data.valueString));
                }
            });
            postData.sendGroup = badgeList.map((item) => item.name);
            return [
                html `<div class="tx_normal fw-normal">標籤判斷</div>
                    <div style="margin: 8px 0;">
                        ${BgWidget.switchTextButton(gvc, postData.boolean === 'and', { left: '或', right: '且' }, (bool) => {
                    postData.boolean = bool ? 'and' : 'or';
                    setUserList();
                    gvc.notifyDataChange(vm.tagsId);
                })}
                    </div>`,
                html `<div class="tx_normal fw-normal">預計寄件顧客人數</div>
                    <div style="display:flex; align-items: center; gap: 18px; margin: 8px 0;">
                        <div class="tx_normal">${postData.userList.length}人</div>
                        ${BgWidget.grayButton('查看名單', gvc.event(() => {
                    if (postData.userList.length === 0) {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.infoMessage({ text: '目前無預計寄件的顧客' });
                        return;
                    }
                    const userVM = {
                        dataList: [],
                    };
                    BgWidget.selectDropDialog({
                        gvc: gvc,
                        title: '預計寄件顧客',
                        tag: 'send_users_list',
                        callback: () => { },
                        default: [],
                        api: () => {
                            return new Promise((resolve) => {
                                ApiUser.getUserListOrders({
                                    page: 0,
                                    limit: 99999,
                                    id: postData.userList.map((user) => { var _a; return (_a = user.id) !== null && _a !== void 0 ? _a : 0; }).join(','),
                                }).then((dd) => {
                                    if (dd.response.data) {
                                        userVM.dataList = dd.response.data.map((item) => {
                                            return {
                                                key: item.userID,
                                                value: item.userData.name,
                                                note: item.userData.email,
                                            };
                                        });
                                        if (postData.userList.length > userVM.dataList.length) {
                                            const noRegisterUser = postData.userList
                                                .filter((item) => {
                                                return item.id < 0 && item.email;
                                            })
                                                .map((item) => {
                                                return {
                                                    key: `${item.id}`,
                                                    value: '（未註冊的會員）',
                                                    note: item.email,
                                                };
                                            });
                                            userVM.dataList = userVM.dataList.concat(noRegisterUser);
                                        }
                                        resolve(userVM.dataList);
                                    }
                                });
                            });
                        },
                        style: 'width: 100%;',
                        readonly: true,
                    });
                }), { textStyle: 'font-weight: 400;' })}
                    </div> `,
                html `
                    <div class="tx_normal fw-normal">篩選條件</div>
                    <div class="c_filter_container">
                        ${badgeList.length === 0
                    ? '無'
                    : badgeList
                        .map((item) => {
                        return item.html;
                    })
                        .join(postData.boolean === 'and' ? '且' : '或')}
                    </div>
                `,
            ].join(BgWidget.mbContainer(18));
        }
        return BgWidget.container(html `
                <div class="d-flex w-100 align-items-center">
                    ${BgWidget.title('手動寄件')}
                    <div class="flex-fill"></div>
                </div>
                ${BgWidget.mbContainer(18)}
                ${BgWidget.container(gvc.bindView(() => {
            return {
                bind: vm.containerId,
                view: () => {
                    return [
                        BgWidget.mainCard([
                            html ` <div class="tx_700">選擇收件對象</div>`,
                            html ` <div class="tx_normal fw-normal mt-3">根據</div>`,
                            html `<div style="display: flex; ${document.body.clientWidth > 768 ? 'gap: 18px;' : 'flex-direction: column;'}">
                                                <div style="width: ${document.body.clientWidth > 768 ? '400px' : '100%'};">
                                                    ${BgWidget.select({
                                gvc: gvc,
                                default: postData.tag,
                                callback: (key) => {
                                    postData.tag = key;
                                    vm.loading = true;
                                    gvc.notifyDataChange(vm.id);
                                },
                                options: FilterOptions.emailOptions,
                                style: 'margin: 8px 0;',
                            })}
                                                </div>
                                                <div style="width: 100%; display: flex; align-items: center;">
                                                    ${gvc.bindView({
                                bind: vm.id,
                                view: () => {
                                    const getDefault = (def) => {
                                        const data = postData.tagList.find((data) => data.tag === postData.tag);
                                        return data ? data.filter : def;
                                    };
                                    const callback = (value) => {
                                        if (typeof value === 'string' || typeof value === 'number') {
                                            const intFiltter = parseInt(`${value}`, 10);
                                            value = intFiltter > 0 ? intFiltter : 0;
                                            if (isNaN(intFiltter) || intFiltter < 0) {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.infoMessage({ text: '請輸入正整數或0' });
                                                return;
                                            }
                                        }
                                        filterEvent(value);
                                    };
                                    switch (postData.tag) {
                                        case 'all':
                                            dialog.dataLoading({ visible: true, text: '取得所有會員資料中...' });
                                            new Promise((resolve) => {
                                                ApiUser.getUserListOrders({
                                                    page: 0,
                                                    limit: 99999,
                                                }).then((dd) => {
                                                    if (dd.response.data) {
                                                        const ids = [];
                                                        vm.dataList = dd.response.data
                                                            .filter((item) => {
                                                            return item.userData.email && item.userData.email.length > 0;
                                                        })
                                                            .map((item) => {
                                                            var _a;
                                                            ids.push(item.userID);
                                                            return {
                                                                key: item.userID,
                                                                value: (_a = item.userData.name) !== null && _a !== void 0 ? _a : '（尚無姓名）',
                                                                note: item.userData.email,
                                                            };
                                                        });
                                                        resolve(ids);
                                                    }
                                                });
                                            }).then((data) => {
                                                dialog.dataLoading({ visible: false });
                                                callback(data);
                                            });
                                            return '';
                                        case 'level':
                                        case 'group':
                                        case 'birth':
                                            return BgWidget.selectDropList({
                                                gvc: gvc,
                                                callback: callback,
                                                default: getDefault([]),
                                                options: vm.loading ? [] : vm.dataList,
                                                placeholder: vm.loading ? '資料載入中...' : undefined,
                                                style: 'margin: 8px 0; width: 100%;',
                                            });
                                        case 'customers':
                                            return BgWidget.grayButton('點擊選取顧客', gvc.event(() => {
                                                BgWidget.selectDropDialog({
                                                    gvc: gvc,
                                                    title: '搜尋特定顧客',
                                                    tag: 'set_send_users',
                                                    updownOptions: FilterOptions.userOrderBy,
                                                    callback: callback,
                                                    default: getDefault([]),
                                                    api: (data) => {
                                                        return new Promise((resolve) => {
                                                            ApiUser.getUserListOrders({
                                                                page: 0,
                                                                limit: 99999,
                                                                search: data.query,
                                                                orderString: data.orderString,
                                                            }).then((dd) => {
                                                                if (dd.response.data) {
                                                                    vm.dataList = dd.response.data
                                                                        .filter((item) => {
                                                                        return item.userData.email && item.userData.email.length > 0;
                                                                    })
                                                                        .map((item) => {
                                                                        var _a;
                                                                        return {
                                                                            key: item.userID,
                                                                            value: (_a = item.userData.name) !== null && _a !== void 0 ? _a : '（尚無姓名）',
                                                                            note: item.userData.email,
                                                                        };
                                                                    });
                                                                    resolve(vm.dataList);
                                                                }
                                                            });
                                                        });
                                                    },
                                                    style: 'width: 100%;',
                                                });
                                            }), { textStyle: 'font-weight: 400;' });
                                        case 'expiry':
                                            return BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: getDefault('0'),
                                                placeHolder: '請輸入剩餘多少天',
                                                callback: callback,
                                                endText: '天',
                                            });
                                        case 'remain':
                                            return BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: getDefault('0'),
                                                placeHolder: '請輸入大於多少',
                                                callback: callback,
                                                startText: '大於',
                                                endText: '點',
                                            });
                                        case 'uncheckout':
                                            return BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: getDefault('0'),
                                                placeHolder: '請輸入超過幾天未結帳',
                                                callback: callback,
                                                endText: '天',
                                            });
                                        default:
                                            return '';
                                    }
                                },
                                divCreate: { class: 'w-100' },
                                onCreate: () => {
                                    if (vm.loading) {
                                        getOptions(postData.tag).then((opts) => {
                                            vm.dataList = opts;
                                            vm.loading = false;
                                            gvc.notifyDataChange(vm.id);
                                        });
                                    }
                                },
                            })}
                                                </div>
                                            </div>`,
                            gvc.bindView({
                                bind: vm.tagsId,
                                view: () => getTagsHTML(),
                                divCreate: { style: 'margin-top: 8px;' },
                            }),
                        ].join('')),
                        BgWidget.mainCard([
                            html ` <div class="tx_700">信件內容</div>`,
                            html ` <div class="tx_normal fw-normal mt-3">信件樣式</div>`,
                            (() => {
                                const selectVM = {
                                    id: glitter.getUUID(),
                                    loading: true,
                                    dataList: [],
                                };
                                return gvc.bindView({
                                    bind: selectVM.id,
                                    view: () => {
                                        return BgWidget.select({
                                            gvc: gvc,
                                            default: postData.name,
                                            callback: (key) => {
                                                const data = selectVM.dataList.find((data) => data.key === key && key !== 'def');
                                                postData.name = data ? data.name : '';
                                                postData.title = data ? data.value : '';
                                                postData.content = data ? data.content : '';
                                                gvc.notifyDataChange(vm.emailId);
                                            },
                                            options: selectVM.dataList,
                                            style: 'margin: 8px 0;',
                                        });
                                    },
                                    divCreate: {},
                                    onCreate: () => {
                                        if (selectVM.loading) {
                                            ApiPost.getManagerPost({
                                                page: 0,
                                                limit: 9999,
                                                type: 'notify-email-config',
                                            }).then((res) => {
                                                if (res.result) {
                                                    selectVM.dataList = res.response.data.map((data) => {
                                                        data = data.content;
                                                        return {
                                                            key: `${data.id}`,
                                                            name: data.name,
                                                            value: data.title,
                                                            content: data.content,
                                                        };
                                                    });
                                                    selectVM.dataList.splice(0, 0, {
                                                        key: 'default',
                                                        name: '',
                                                        value: '（空白樣式）',
                                                        content: '',
                                                    });
                                                }
                                                selectVM.loading = false;
                                                gvc.notifyDataChange(selectVM.id);
                                            });
                                        }
                                    },
                                });
                            })(),
                            gvc.bindView({
                                bind: vm.emailId,
                                view: () => {
                                    return [
                                        BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '寄件者名稱',
                                            default: postData.name,
                                            placeHolder: '請輸入寄件者名稱',
                                            callback: (text) => {
                                                postData.name = text;
                                            },
                                        }),
                                        BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '信件主旨',
                                            default: postData.title,
                                            placeHolder: '請輸入信件主旨',
                                            callback: (text) => {
                                                postData.title = text;
                                            },
                                        }),
                                        html `<div class="d-flex align-items-center mb-3">
                                                                <div class="tx_normal fw-normal me-2">信件內文</div>
                                                                ${BgWidget.selEventButton('範例', gvc.event(() => {
                                            postData.content = defaultEmailText();
                                            gvc.notifyDataChange(vm.containerId);
                                        }))}
                                                            </div>
                                                            ${EditorElem.richText({
                                            gvc: gvc,
                                            def: postData.content,
                                            callback: (text) => {
                                                postData.content = text;
                                            },
                                            style: `overflow-y: auto;`,
                                        })}`,
                                    ].join('');
                                },
                            }),
                        ].join('')),
                        BgWidget.mainCard(html `<div class="tx_700 mb-3">發送時間</div>
                                            ${EditorElem.radio({
                            gvc: gvc,
                            title: '',
                            def: postData.sendTime === undefined ? 'now' : 'set',
                            array: [
                                {
                                    title: '立即發送',
                                    value: 'now',
                                },
                                {
                                    title: '排定發送時間',
                                    value: 'set',
                                    innerHtml: html `<div class="d-flex mt-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                            ${EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        type: 'date',
                                        style: inputStyle,
                                        default: startDate,
                                        placeHolder: '',
                                        callback: (date) => {
                                            var _a, _b;
                                            postData.sendTime = {
                                                date: date,
                                                time: (_b = (_a = postData.sendTime) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : '',
                                            };
                                        },
                                    })}
                                                            ${EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        type: 'time',
                                        style: inputStyle,
                                        default: startTime,
                                        placeHolder: '',
                                        callback: (time) => {
                                            var _a, _b;
                                            postData.sendTime = {
                                                date: (_b = (_a = postData.sendTime) === null || _a === void 0 ? void 0 : _a.date) !== null && _b !== void 0 ? _b : '',
                                                time: time,
                                            };
                                        },
                                    })}
                                                        </div>`,
                                },
                            ],
                            callback: (text) => {
                                if (text === 'now') {
                                    postData.sendTime = undefined;
                                }
                                if (text === 'set') {
                                    postData.sendTime = { date: startDate, time: startTime };
                                }
                            },
                        })}`),
                    ].join(BgWidget.mbContainer(16));
                },
                divCreate: {},
            };
        }), BgWidget.getContainerWidth(), 'padding: 0 !important; margin: 0 !important;')}
                ${BgWidget.mbContainer(240)}
                <div class="update-bar-container">
                    ${BgWidget.save(gvc.event(() => {
            function isLater(dateTimeObj) {
                const currentDateTime = new Date();
                const { date, time } = dateTimeObj;
                const dateTimeString = `${date}T${time}:00`;
                const providedDateTime = new Date(dateTimeString);
                return currentDateTime > providedDateTime;
            }
            if (postData.sendTime && isLater(postData.sendTime)) {
                dialog.errorMessage({ text: '排定發送的時間需大於現在時間' });
                return;
            }
            if (postData.userList.length == 0) {
                dialog.errorMessage({ text: '請選擇發送對象' });
                return;
            }
            dialog.dataLoading({
                text: postData.sendTime ? '信件排定中...' : '信件發送中...',
                visible: true,
            });
            ApiSmtp.send(Object.assign(Object.assign({}, postData), { email: postData.userList.map((user) => user.email) })).then((data) => {
                dialog.dataLoading({ visible: false });
                if (data.result) {
                    dialog.successMessage({
                        text: postData.sendTime ? '排定成功' : '發送成功',
                    });
                }
                else {
                    dialog.errorMessage({ text: '手動寄件失敗' });
                }
            });
        }), '送出')}
                </div>
            `, BgWidget.getContainerWidth());
    }
    static fcmEditor(obj) {
        var _a;
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vm = obj.vm;
        const postData = (_a = vm.data) !== null && _a !== void 0 ? _a : {
            content: '',
            title: '',
            link: '',
            type: 'notify-message-config',
            name: '',
        };
        return BgWidget.container(html `
                <div class="d-flex w-100 align-items-center">
                    ${BgWidget.goBack(gvc.event(() => {
            vm.type = 'list';
        }))}
                    ${BgWidget.title(`編輯推播通知`)}
                    <div class="flex-fill"></div>
                </div>
                ${BgWidget.container(html `<div class="d-flex px-0" style="gap: 10px;">
                        <div style="width: 100%">
                            ${BgWidget.mainCard(obj.gvc.bindView(() => {
            const bi = obj.gvc.glitter.getUUID();
            return {
                bind: bi,
                view: () => {
                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '推播標題',
                            default: postData.title,
                            placeHolder: '請輸入推播標題',
                            callback: (text) => {
                                postData.title = text;
                            },
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '跳轉連結',
                            default: postData.link,
                            placeHolder: '請輸入要跳轉的連結',
                            callback: (text) => {
                                postData.link = text;
                            },
                        }),
                        EditorElem.editeText({
                            gvc: gvc,
                            title: '推播主旨',
                            default: postData.content,
                            placeHolder: '請輸入推播內容',
                            callback: (text) => {
                                postData.content = text;
                            },
                        }),
                    ].join('');
                },
                divCreate: {},
            };
        }))}
                        </div>
                    </div>
                    ${obj.type === 'replace'
            ? html `
                              <div class="d-flex w-100 mt-2">
                                  <div class="flex-fill"></div>
                                  ${BgWidget.redButton('刪除樣本', obj.gvc.event(() => {
                const dialog = new ShareDialog(obj.gvc.glitter);
                dialog.checkYesOrNot({
                    text: '是否確認刪除樣本?',
                    callback: (response) => {
                        if (response) {
                            dialog.dataLoading({ visible: true });
                            ApiPost.delete({
                                id: postData.id,
                            }).then((res) => {
                                dialog.dataLoading({ visible: false });
                                if (res.result) {
                                    vm.type = 'list';
                                }
                                else {
                                    dialog.errorMessage({ text: '刪除失敗' });
                                }
                            });
                        }
                    },
                });
            }))}
                              </div>
                          `
            : ``}
                    <div class="update-bar-container">
                        ${BgWidget.cancel(gvc.event(() => {
            vm.type = 'list';
        }))}
                        ${BgWidget.save(gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            if (obj.type === 'replace') {
                dialog.dataLoading({ text: '變更信件', visible: true });
                ApiPost.put({
                    postData: postData,
                    token: window.parent.saasConfig.config.token,
                    type: 'manager',
                }).then((re) => {
                    dialog.dataLoading({ visible: false });
                    if (re.result) {
                        vm.status = 'list';
                        dialog.successMessage({ text: '上傳成功' });
                    }
                    else {
                        dialog.errorMessage({ text: '上傳失敗' });
                    }
                });
            }
            else {
                dialog.dataLoading({ text: '新增信件', visible: true });
                ApiPost.post({
                    postData: postData,
                    token: window.parent.saasConfig.config.token,
                    type: 'manager',
                }).then((re) => {
                    dialog.dataLoading({ visible: false });
                    if (re.result) {
                        vm.type = 'list';
                        dialog.successMessage({ text: '上傳成功' });
                    }
                    else {
                        dialog.errorMessage({ text: '上傳失敗' });
                    }
                });
            }
        }))}
                    </div>`)}
            `, BgWidget.getContainerWidth({ rate: { web: 0.68 } }));
    }
    static fcmDevice(gvc, type = 'list', callback = () => { }) {
        const vm = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi = undefined;
                    function getDatalist() {
                        let interval = 0;
                        return vm.dataList.map((dd) => {
                            var _a;
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (!vm.dataList.find((dd) => {
                                            return !dd.checked;
                                        })) {
                                            interval = setTimeout(() => {
                                                ApiUser.getFCM({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }
                                        return EditorElem.checkBoxOnly({
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
                                                gvc.notifyDataChange(filterID);
                                                callback(vm.dataList.filter((dd) => {
                                                    return dd.checked;
                                                }));
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(vm.dataList.filter((dd) => {
                                                return dd.checked;
                                            }));
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '用戶ID',
                                    value: `<span class="fs-7">${(_a = dd.userID) !== null && _a !== void 0 ? _a : '尚未登入'}</span>`,
                                },
                                {
                                    key: '用戶名稱',
                                    value: `<span class="fs-7">${dd.userData ? dd.userData.name : '尚未登入'}</span>`,
                                },
                                {
                                    key: '訂閱Token',
                                    value: `<span class="fs-7">${Tool.truncateString(dd.deviceToken, 40)}</span>`,
                                },
                            ];
                        });
                    }
                    return BgWidget.container(html `
                            <div class="d-flex w-100 align-items-center ${type === 'select' ? `d-none` : ``}">
                                ${BgWidget.title('已訂閱裝置')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                        gvc: gvc,
                        getData: (vmk) => {
                            vmi = vmk;
                            ApiUser.getFCM({
                                page: vmi.page - 1,
                                limit: 20,
                                search: vm.query || undefined,
                            }).then((data) => {
                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                vm.dataList = data.response.data;
                                vmi.data = getDatalist();
                                vmi.loading = false;
                                vmi.callback();
                                if (type === 'select') {
                                    callback(vm.dataList.filter((dd) => {
                                        return dd.checked;
                                    }));
                                }
                            });
                        },
                        rowClick: (data, index) => {
                            vm.dataList[index].checked = !vm.dataList[index].checked;
                            vmi.data = getDatalist();
                            vmi.callback();
                            gvc.notifyDataChange(filterID);
                            callback(vm.dataList.filter((dd) => {
                                return dd.checked;
                            }));
                        },
                        filter: html `
                                            ${BgWidget.searchPlace(gvc.event((e, event) => {
                            vm.query = e.value;
                            gvc.notifyDataChange(id);
                        }), vm.query || '', '搜尋信箱或者標籤')}
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
                                                                ApiUser.deleteSubscribe({
                                                                    email: vm.dataList
                                                                        .filter((dd) => {
                                                                        return dd.checked;
                                                                    })
                                                                        .map((dd) => {
                                                                        return dd.email;
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
                                            }) ||
                                            type === 'select'
                                            ? `d-none`
                                            : ``}`,
                                        style: ``,
                                    };
                                },
                            };
                        })}
                                        `,
                    })))}
                        `, BgWidget.getContainerWidth());
                },
                divCreate: {
                    class: type === 'select' ? `m-n4` : ``,
                },
            };
        });
    }
    static fcmSetting(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: undefined,
        };
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const filterID = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('推播訊息管理')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增推播', gvc.event(() => {
                            vm.data = undefined;
                            vm.type = 'add';
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vmi) => {
                                ApiPost.getManagerPost({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query ? [`title->${vm.query}`] : undefined,
                                    type: 'notify-message-config',
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
                                                        style: 'height:25px;',
                                                    }),
                                                },
                                                {
                                                    key: '推播標題',
                                                    value: `<span class="fs-7">${dd.content.title}</span>`,
                                                },
                                                {
                                                    key: '推播內文',
                                                    value: `<span class="fs-7">${Tool.truncateString(dd.content.content.replace(/<[^>]*>/g, ''), 30)}</span>`,
                                                },
                                                {
                                                    key: '發送推播',
                                                    value: html `<button
                                                                        class="btn btn-primary-c px-4"
                                                                        style="width:20px !important;height: 30px;"
                                                                        onclick="${gvc.event((e, event) => {
                                                        event.stopPropagation();
                                                        gvc.glitter.innerDialog((gvc) => {
                                                            let dataList = [];
                                                            return html `
                                                                                    <div style="max-height: calc(100vh - 100px);overflow-y: auto;">
                                                                                        ${BgWidget.container(BgWidget.card([
                                                                html `
                                                                                                        <div class="d-flex w-100 align-items-center mb-3 ">
                                                                                                            ${BgWidget.goBack(gvc.event(() => {
                                                                    gvc.closeDialog();
                                                                }))}
                                                                                                            ${BgWidget.title(`選擇群發對象`)}
                                                                                                            <div class="flex-fill"></div>
                                                                                                            <button
                                                                                                                class="btn bt_c39 me-2"
                                                                                                                style="height:38px;font-size: 14px;"
                                                                                                                onclick="${gvc.event(() => {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    dialog.dataLoading({
                                                                        text: '發送中...',
                                                                        visible: true,
                                                                    });
                                                                    ApiFcm.send({
                                                                        device_token: ['all'],
                                                                        title: dd.content.title,
                                                                        content: dd.content.content,
                                                                        link: dd.content.link,
                                                                    }).then(() => {
                                                                        dialog.dataLoading({ visible: false });
                                                                        dialog.successMessage({ text: `發送成功` });
                                                                    });
                                                                })}"
                                                                                                            >
                                                                                                                發送給所有用戶
                                                                                                            </button>
                                                                                                            <button
                                                                                                                class="btn bt_c39"
                                                                                                                style="height:38px;font-size: 14px;"
                                                                                                                onclick="${gvc.event(() => {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    if (dataList.length > 0) {
                                                                        dialog.dataLoading({
                                                                            text: '發送中...',
                                                                            visible: true,
                                                                        });
                                                                        ApiFcm.send({
                                                                            device_token: dataList.map((dd) => {
                                                                                return dd.deviceToken;
                                                                            }),
                                                                            title: dd.content.title,
                                                                            content: dd.content.content,
                                                                            link: dd.content.link,
                                                                        }).then(() => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            dialog.successMessage({ text: '發送成功' });
                                                                        });
                                                                    }
                                                                    else {
                                                                        dialog.errorMessage({ text: '請選擇發送對象' });
                                                                    }
                                                                })}"
                                                                                                            >
                                                                                                                確認並發送
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    ` +
                                                                    BgNotify.fcmDevice(gvc, 'select', (data) => {
                                                                        dataList = data;
                                                                    }),
                                                            ].join('')), 900)}
                                                                                        <div></div>
                                                                                    </div>
                                                                                `;
                                                        }, 'email');
                                                    })}"
                                                                    >
                                                                        <i class="fa-sharp fa-regular fa-paper-plane-top"></i>
                                                                    </button>`,
                                                },
                                            ];
                                        });
                                    }
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                                vm.data = vm.dataList[index].content;
                                vm.type = 'replace';
                            },
                            filter: html ` ${BgWidget.searchPlace(gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有信件內容')}
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
                                                                    ApiPost.delete({
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
                            })}`,
                        })))}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type == 'replace') {
                        return this.fcmEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    }
                    else {
                        return this.fcmEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                        });
                    }
                },
            };
        });
    }
    static rebackMessage(gvc, type = 'list', callback = () => { }) {
        const vm = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi = undefined;
                    function getDatalist() {
                        let interval = 0;
                        return vm.dataList.map((dd) => {
                            var _a;
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (!vm.dataList.find((dd) => {
                                            return !dd.checked;
                                        })) {
                                            interval = setTimeout(() => {
                                                ApiUser.getFCM({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }
                                        return EditorElem.checkBoxOnly({
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
                                                gvc.notifyDataChange(filterID);
                                                callback(vm.dataList.filter((dd) => {
                                                    return dd.checked;
                                                }));
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(vm.dataList.filter((dd) => {
                                                return dd.checked;
                                            }));
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '名稱',
                                    value: `<span class="fs-7">${dd.content.name}</span>`,
                                },
                                {
                                    key: '信箱',
                                    value: `<span class="fs-7">${dd.content.email}</span>`,
                                },
                                {
                                    key: '標題',
                                    value: `<span class="fs-7">${dd.content.title}</span>`,
                                },
                                {
                                    key: '內文',
                                    value: `<span class="fs-7">${Tool.truncateString((_a = dd.content.content) !== null && _a !== void 0 ? _a : '', 30)}</span>`,
                                },
                            ];
                        });
                    }
                    if (vm.type === 'replace') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                            gvc.notifyDataChange(id);
                        }))}
                                    ${BgWidget.title(`用戶回饋內容`)}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.card(` ${FormWidget.editorView({
                            gvc: gvc,
                            array: [
                                {
                                    key: 'name',
                                    type: 'name',
                                    title: '姓名',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            tag: 'aboutus-container',
                                            class: '',
                                            style: '',
                                            stylist: [],
                                            dataType: 'static',
                                            style_from: 'tag',
                                            classDataType: 'static',
                                        },
                                    },
                                },
                                {
                                    key: 'email',
                                    type: 'email',
                                    title: '信箱',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            tag: 'aboutus-container',
                                            class: '',
                                            style: '',
                                            stylist: [],
                                            style_from: 'tag',
                                        },
                                    },
                                },
                                {
                                    key: 'title',
                                    type: 'text',
                                    title: '標題',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            tag: 'aboutus-container',
                                            class: '',
                                            style: '',
                                            stylist: [],
                                            dataType: 'static',
                                            style_from: 'tag',
                                            classDataType: 'static',
                                        },
                                    },
                                },
                                {
                                    key: 'content',
                                    type: 'textArea',
                                    title: '訊息',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            class: '',
                                            style: '',
                                        },
                                    },
                                },
                            ],
                            refresh: () => { },
                            formData: vm.data.content,
                        })}`)}
                            `, 800);
                    }
                    return BgWidget.container(html `
                        <div class="d-flex w-100 align-items-center mb-3 ${type === 'select' ? `d-none` : ``}">
                            ${BgWidget.title('回饋信件')}
                            <div class="flex-fill"></div>
                        </div>
                        ${BgWidget.table({
                        gvc: gvc,
                        getData: (vmk) => {
                            vmi = vmk;
                            ApiPost.getUserPost({
                                page: vmi.page - 1,
                                limit: 20,
                                search: vm.query || undefined,
                                type: 'userQuestion',
                            }).then((data) => {
                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                vm.dataList = data.response.data;
                                vmi.data = getDatalist();
                                vmi.loading = false;
                                vmi.callback();
                                if (type === 'select') {
                                    callback(vm.dataList.filter((dd) => {
                                        return dd.checked;
                                    }));
                                }
                            });
                        },
                        rowClick: (data, index) => {
                            vm.type = 'replace';
                            vm.data = vm.dataList[index];
                            gvc.notifyDataChange(id);
                        },
                        filter: html `
                                ${BgWidget.searchPlace(gvc.event((e, event) => {
                            vm.query = e.value;
                            gvc.notifyDataChange(id);
                        }), vm.query || '', '搜尋標題')}
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
                                                                ApiPost.deleteUserPost({
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
                                            }) ||
                                            type === 'select'
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
                },
                divCreate: {
                    class: type === 'select' ? `m-n4` : ``,
                },
            };
        });
    }
    static customerMessage(gvc, type = 'list', callback = () => { }) {
        const vm = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi = undefined;
                    function getDatalist() {
                        let interval = 0;
                        return vm.dataList.map((dd) => {
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (!vm.dataList.find((dd) => {
                                            return !dd.checked;
                                        })) {
                                            interval = setTimeout(() => {
                                                ApiUser.getFCM({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }
                                        return EditorElem.checkBoxOnly({
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
                                                gvc.notifyDataChange(filterID);
                                                callback(vm.dataList.filter((dd) => {
                                                    return dd.checked;
                                                }));
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(vm.dataList.filter((dd) => {
                                                return dd.checked;
                                            }));
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '名稱',
                                    value: `<span class="fs-7">${dd.user_data ? dd.user_data.userData.name : `訪客`}</span>`,
                                },
                                {
                                    key: '信箱',
                                    value: `<span class="fs-7">${dd.user_data ? dd.user_data.userData.email : `...`}</span>`,
                                },
                                {
                                    key: '訊息內容',
                                    value: `<span class="fs-7">${dd.topMessage ? dd.topMessage.text : ``}</span>`,
                                },
                            ];
                        });
                    }
                    if (vm.type === 'replace') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                            gvc.notifyDataChange(id);
                        }))}
                                    ${BgWidget.title(`客服訊息`)}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.card(` ${FormWidget.editorView({
                            gvc: gvc,
                            array: [
                                {
                                    key: 'name',
                                    type: 'name',
                                    title: '姓名',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            tag: 'aboutus-container',
                                            class: '',
                                            style: '',
                                            stylist: [],
                                            dataType: 'static',
                                            style_from: 'tag',
                                            classDataType: 'static',
                                        },
                                    },
                                },
                                {
                                    key: 'email',
                                    type: 'email',
                                    title: '信箱',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            tag: 'aboutus-container',
                                            class: '',
                                            style: '',
                                            stylist: [],
                                            style_from: 'tag',
                                        },
                                    },
                                },
                                {
                                    key: 'title',
                                    type: 'text',
                                    title: '標題',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            tag: 'aboutus-container',
                                            class: '',
                                            style: '',
                                            stylist: [],
                                            dataType: 'static',
                                            style_from: 'tag',
                                            classDataType: 'static',
                                        },
                                    },
                                },
                                {
                                    key: 'content',
                                    type: 'textArea',
                                    title: '訊息',
                                    require: 'true',
                                    readonly: 'read',
                                    style_data: {
                                        input: {
                                            class: '',
                                            style: '',
                                        },
                                        label: {
                                            class: 'form-label fs-base ',
                                            style: '',
                                        },
                                        container: {
                                            class: '',
                                            style: '',
                                        },
                                    },
                                },
                            ],
                            refresh: () => { },
                            formData: vm.data.content,
                        })}`)}
                            `, 800);
                    }
                    return BgWidget.container(html `
                        <div class="d-flex w-100 align-items-center mb-3 ${type === 'select' ? `d-none` : ``}">
                            ${BgWidget.title('客服訊息')}
                            <div class="flex-fill"></div>
                            <button
                                class="btn hoverBtn me-2 px-3"
                                style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                onclick="${gvc.event(() => {
                        EditorElem.openEditorDialog(gvc, (gvc) => {
                            const saasConfig = window.saasConfig;
                            const id = gvc.glitter.getUUID();
                            let keyData = {};
                            return [
                                gvc.bindView(() => {
                                    ApiUser.getPublicConfig(`robot_auto_reply`, 'manager').then((data) => {
                                        if (data.response.value) {
                                            keyData = data.response.value;
                                            gvc.notifyDataChange(id);
                                        }
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            return new Promise((resolve, reject) => {
                                                resolve(FormWidget.editorView({
                                                    gvc: gvc,
                                                    array: [
                                                        {
                                                            title: '機器人問答',
                                                            key: 'question',
                                                            readonly: 'write',
                                                            type: 'array',
                                                            require: 'true',
                                                            style_data: {
                                                                label: {
                                                                    class: 'form-label fs-base ',
                                                                    style: '',
                                                                },
                                                                input: { class: '', style: '' },
                                                                container: {
                                                                    class: '',
                                                                    style: '',
                                                                },
                                                            },
                                                            referTitile: 'ask',
                                                            plusBtn: '添加自動問答',
                                                            formList: [
                                                                {
                                                                    title: '問題',
                                                                    key: 'ask',
                                                                    readonly: 'write',
                                                                    type: 'text',
                                                                    require: 'true',
                                                                    style_data: {
                                                                        label: {
                                                                            class: 'form-label fs-base ',
                                                                            style: '',
                                                                        },
                                                                        input: {
                                                                            class: '',
                                                                            style: '',
                                                                        },
                                                                        container: {
                                                                            class: '',
                                                                            style: '',
                                                                        },
                                                                    },
                                                                },
                                                                {
                                                                    title: '回應',
                                                                    key: 'response',
                                                                    readonly: 'write',
                                                                    type: 'textArea',
                                                                    require: 'true',
                                                                    style_data: {
                                                                        label: {
                                                                            class: 'form-label fs-base ',
                                                                            style: '',
                                                                        },
                                                                        input: {
                                                                            class: '',
                                                                            style: '',
                                                                        },
                                                                        container: {
                                                                            class: '',
                                                                            style: '',
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                    refresh: () => {
                                                        gvc.notifyDataChange(id);
                                                    },
                                                    formData: keyData,
                                                }));
                                            });
                                        },
                                        divCreate: {
                                            class: 'p-2',
                                        },
                                    };
                                }),
                                html `<div class="d-flex">
                                                    <div class="flex-fill"></div>
                                                    <div
                                                        class=" btn-primary-c btn my-2 me-2"
                                                        style="margin-left: 10px;height:35px;"
                                                        onclick="${gvc.event(() => {
                                    dialog.dataLoading({ visible: true });
                                    ApiUser.setPublicConfig({
                                        key: `robot_auto_reply`,
                                        value: keyData,
                                        user_id: 'manager',
                                    }).then((data) => {
                                        dialog.dataLoading({ visible: false });
                                        dialog.successMessage({ text: '設定成功' });
                                    });
                                })}"
                                                    >
                                                        儲存設定
                                                    </div>
                                                </div>`,
                            ].join('');
                        }, () => { }, 500, '自訂表單');
                    })}"
                            >
                                <i class="fa-regular fa-gear me-2 "></i>
                                機器人問答
                            </button>
                        </div>
                        ${BgWidget.table({
                        gvc: gvc,
                        getData: (vmk) => {
                            vmi = vmk;
                            Chat.getChatRoom({
                                page: vmi.page - 1,
                                limit: 20,
                                user_id: 'manager',
                            }).then((data) => {
                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                vm.dataList = data.response.data;
                                vmi.data = getDatalist();
                                vmi.loading = false;
                                vmi.callback();
                                if (type === 'select') {
                                    callback(vm.dataList.filter((dd) => {
                                        return dd.checked;
                                    }));
                                }
                            });
                        },
                        rowClick: (data, index) => {
                            gvc.glitter.innerDialog(() => {
                                return EditorElem.iframeComponent({
                                    page: 'chat_page',
                                    width: 400,
                                    height: 680,
                                    par: [
                                        {
                                            key: 'is_manager',
                                            value: 'true',
                                        },
                                        {
                                            key: 'chat_who',
                                            value: vm.dataList[index].who,
                                        },
                                    ],
                                });
                            }, '');
                        },
                        filter: html `
                                <div style="height:50px;" class="w-100 border-bottom ">
                                    <input
                                        class="form-control h-100 "
                                        style="border: none;"
                                        placeholder="搜尋用戶名稱"
                                        onchange="${gvc.event((e, event) => {
                            vm.query = e.value;
                            gvc.notifyDataChange(id);
                        })}"
                                        value="${vm.query || ''}"
                                    />
                                </div>
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
                                                                Chat.deleteChatRoom({
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
                                            }) ||
                                            type === 'select'
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
                },
                divCreate: {
                    class: type === 'select' ? `m-n4` : ``,
                },
            };
        });
    }
}
function defaultEmailText() {
    return `親愛的 [使用者名稱],

    歡迎來到 [你的公司或社群名稱]！我們很高興你選擇了我們，並成為我們社群的一員。
    
    在這裡，我們致力於提供 [描述你的服務或社群的價值]。我們的團隊一直在努力讓你有一個令人愉快和有價值的體驗。
    
    以下是一些建議的下一步：
    
    1. **完善個人資料：** 請登入您的帳戶，完善您的個人資料，這有助於我們更好地瞭解您的需求。
    
    2. **參與社群：** 加入我們的社交媒體，訂閱我們的通訊，參與我們的討論，您將有機會與其他社群成員建立聯繫。
    
    3. **探索我們的服務：** 探索我們的網站/應用程式，瞭解我們提供的所有功能和服務。
    
    如果您在使用過程中遇到任何問題，或者有任何反饋，請隨時與我們聯繫。我們的支援團隊隨時準備協助您。
    
    再次感謝您加入 [你的公司或社群名稱]，我們期待與您建立長期的合作關係！
    
    祝您有美好的一天！
    
    最誠摯的問候，
    
    [你的名稱]
    [你的職務]
    [你的公司或社群名稱]
    [聯絡電子郵件]
    [聯絡電話]`.replace(/\n/g, `<br>`);
}
window.glitter.setModule(import.meta.url, BgNotify);
