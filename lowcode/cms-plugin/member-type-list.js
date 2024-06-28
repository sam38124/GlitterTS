import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
export class MemberTypeList {
    static main(gvc, widget) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data) => { };
        const vm = {
            type: 'list',
            index: 0,
            dataList: undefined,
            query: '',
        };
        const filterID = gvc.glitter.getUUID();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd, index) => {
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
                                gvc.notifyDataChange(filterID);
                                callback(vm.dataList.filter((dd) => {
                                    return dd.checked;
                                }));
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
                                callback(vm.dataList.filter((dd) => {
                                    return dd.checked;
                                }));
                            },
                            style: 'height:25px;',
                        }),
                    },
                    {
                        key: '等級順序',
                        value: `<span class="fs-7">等級${index + 1}</span>`,
                    },
                    {
                        key: '有效期限',
                        value: `<span class="fs-7">${(() => {
                            const index = [30, 90, 180, 365].findIndex((d1) => {
                                return parseInt(dd.dead_line.value, 10) === d1;
                            });
                            if (dd.dead_line.type === 'date') {
                                if (index !== -1) {
                                    return ['一個月', '三個月', '半年', '一年'][index];
                                }
                                else {
                                    return `${dd.dead_line.value}天`;
                                }
                            }
                            else {
                                return `永久`;
                            }
                        })()}</span>`,
                    },
                    {
                        key: '會員名稱',
                        value: `<span class="fs-7">${dd.tag_name}</span>`,
                    },
                    {
                        key: '會員數',
                        value: `<span class="fs-7">0</span>`,
                    },
                ];
            });
        }
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('會員等級')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增', gvc.event(() => {
                            vm.type = 'add';
                            gvc.notifyDataChange(id);
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vd) => {
                                vmi = vd;
                                ApiUser.getPublicConfig('member_level_config', 'manager').then((dd) => {
                                    const data = dd.response.value || {};
                                    vmi.pageSize = 1;
                                    data.levels = (data.levels || []).filter((dd) => {
                                        return dd;
                                    });
                                    vm.dataList = data.levels;
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                                vm.index = index;
                                vm.type = 'replace';
                            },
                            filter: html `
                                                ${gvc.bindView(() => {
                                return {
                                    bind: filterID,
                                    view: () => {
                                        return [
                                            `<span class="fs-7 fw-bold">操作選項</span>`,
                                            `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.checkYesOrNot({
                                                    text: '是否確認移除所選項目?',
                                                    callback: (response) => {
                                                        if (response) {
                                                            widget.event('loading', {
                                                                title: '設定中...',
                                                            });
                                                            ApiUser.setPublicConfig({
                                                                key: 'member_level_config',
                                                                user_id: 'manager',
                                                                value: {
                                                                    levels: vm.dataList.filter((dd) => {
                                                                        return !dd.checked;
                                                                    }),
                                                                },
                                                            }).then(() => {
                                                                setTimeout(() => {
                                                                    widget.event('loading', {
                                                                        visible: false,
                                                                    });
                                                                    widget.event('success', {
                                                                        title: '設定成功',
                                                                    });
                                                                    gvc.notifyDataChange(id);
                                                                }, 500);
                                                            });
                                                        }
                                                    },
                                                });
                                            })}">批量移除</button>`,
                                        ].join(``);
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
                            })}
                                            `,
                        })))}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type == 'add') {
                        return this.userInformationDetail({
                            widget: widget,
                            callback: () => {
                                vm.type = 'list';
                            },
                            gvc: gvc,
                            index: vm.dataList.length,
                        });
                    }
                    else {
                        return this.userInformationDetail({
                            widget: widget,
                            callback: () => {
                                vm.type = 'list';
                            },
                            gvc: gvc,
                            index: vm.index,
                        });
                    }
                },
                divCreate: {
                    class: `mx-auto `,
                    style: `max-width:100%;width:960px;`,
                },
            };
        });
    }
    static userInformationDetail(cf) {
        const html = String.raw;
        const gvc = cf.gvc;
        const id = gvc.glitter.getUUID();
        const vm = {
            data: '',
            original_data: undefined,
            index: cf.index,
            loading: true,
        };
        ApiUser.getPublicConfig('member_level_config', 'manager').then((dd) => {
            vm.original_data = dd.response.value || {};
            vm.original_data.levels = (vm.original_data.levels || []).filter((dd) => {
                return dd;
            });
            vm.data = vm.original_data.levels[vm.index] || {
                tag_name: '',
                condition: {
                    type: 'total',
                    value: 0,
                },
                duration: {
                    type: 'noLimit',
                    value: 30,
                },
                dead_line: {
                    type: 'noLimit',
                },
                id: gvc.glitter.getUUID(),
                create_date: new Date(),
            };
            vm.original_data.levels.map((dd) => {
                dd.create_date = dd.create_date || new Date();
            });
            vm.loading = false;
            gvc.notifyDataChange(id);
        });
        const noteID = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return html ` <div class="w-100 d-flex align-items-center justify-content-center">
                            <div class="spinner-border"></div>
                        </div>`;
                    }
                    return BgWidget.container([
                        html ` <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.goBack(gvc.event(() => {
                            cf.callback();
                        }))}
                                ${BgWidget.title(vm.data.tag_name || '新增會員')}
                                <div class="flex-fill"></div>
                            </div>`,
                        html ` <div class="d-flex" style="gap:24px;">
                                ${gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    let map = [
                                        BgWidget.mainCard(html `
                                                    ${html `<div class="tx_normal fw-bold">會員名稱*</div>`}
                                                    ${BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: vm.data.tag_name || '',
                                            placeHolder: '請輸入會員名稱',
                                            callback: (text) => {
                                                vm.data.tag_name = text;
                                                gvc.notifyDataChange(noteID);
                                            },
                                        })}
                                                `),
                                        BgWidget.mainCard(html `
                                                    <div class="tx_normal fw-bold" style="margin-bottom: 18px;">會員條件*</div>
                                                    ${[
                                            { title: '累積消費金額', value: 'total' },
                                            { title: '單筆消費金額', value: 'single' },
                                        ]
                                            .map((dd) => {
                                            return html `<div>
                                                                ${[
                                                html ` <div
                                                                        class="d-flex align-items-center cursor_pointer"
                                                                        style="gap:8px;"
                                                                        onclick="${gvc.event(() => {
                                                    vm.data.condition.type = dd.value;
                                                    gvc.notifyDataChange(id);
                                                })}"
                                                                    >
                                                                        ${vm.data.condition.type === dd.value
                                                    ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>`
                                                    : ` <div class="c_39_checkbox"></div>`}
                                                                        <div class="tx_normal fw-normal">${dd.title}</div>
                                                                    </div>`,
                                                html ` <div class="d-flex position-relative mt-2" style="">
                                                                        <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                                                        <div class="flex-fill w-100 mt-n2 d-flex align-items-center" style="margin-left:30px;max-width: 518px;gap:10px;">
                                                                            ${(() => {
                                                    var _a;
                                                    if (vm.data.condition.type === dd.value) {
                                                        vm.data.condition.value = (_a = vm.data.condition.value) !== null && _a !== void 0 ? _a : 0;
                                                        return [
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                type: 'number',
                                                                default: `${vm.data.condition.value || '0'}`,
                                                                placeHolder: '',
                                                                callback: (text) => {
                                                                    vm.data.condition.value = parseInt(text, 10);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                            }),
                                                            html `<div class="tx_normal" style="color:#8D8D8D;margin-top: 8px;">元</div>`,
                                                        ].join('');
                                                    }
                                                    else {
                                                        return ``;
                                                    }
                                                })()}
                                                                        </div>
                                                                    </div>`,
                                            ].join('')}
                                                            </div>`;
                                        })
                                            .join('<div class="my-2"></div>')}
                                                `),
                                        BgWidget.mainCard(html `
                                                    <div class="tx_normal fw-bold" style="margin-bottom: 18px;">計算期間*</div>
                                                    ${[
                                            { title: '計算期限', value: 'day' },
                                            { title: '不計算期限', value: 'noLimit' },
                                        ]
                                            .map((dd) => {
                                            return `<div>${[
                                                html ` <div
                                                                    class="d-flex align-items-center cursor_pointer"
                                                                    style="gap:8px;"
                                                                    onclick="${gvc.event(() => {
                                                    vm.data.duration.type = dd.value;
                                                    gvc.notifyDataChange(id);
                                                })}"
                                                                >
                                                                    ${vm.data.duration.type === dd.value
                                                    ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>`
                                                    : ` <div class="c_39_checkbox"></div>`}
                                                                    <div class="tx_normal fw-normal">${dd.title}</div>
                                                                </div>`,
                                                html ` <div class="d-flex position-relative mt-2" style="">
                                                                    <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                                                    <div class="flex-fill w-100 mt-n2 d-flex align-items-center" style="margin-left:30px;max-width: 518px;gap:10px;">
                                                                        ${(() => {
                                                    var _a;
                                                    if (vm.data.duration.type === dd.value && dd.value === 'day') {
                                                        vm.data.duration.value = (_a = vm.data.duration.value) !== null && _a !== void 0 ? _a : 30;
                                                        return [
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                type: 'number',
                                                                default: `${vm.data.duration.value || '0'}`,
                                                                placeHolder: '',
                                                                callback: (text) => {
                                                                    vm.data.duration.value = parseInt(text, 10);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                            }),
                                                            `<div class="tx_normal" style="color:#8D8D8D;margin-top: 8px;white-space: nowrap;">天內消費</div>`,
                                                        ].join('');
                                                    }
                                                    else {
                                                        return ``;
                                                    }
                                                })()}
                                                                    </div>
                                                                </div>`,
                                            ].join('')}</div>`;
                                        })
                                            .join('<div class="my-2"></div>')}
                                                `),
                                        BgWidget.mainCard(html `
                                                    <div class="tx_normal fw-bold" style="margin-bottom: 18px;">會員期限*</div>
                                                    ${[
                                            { title: '沒有期限', value: 'noLimit' },
                                            { title: '設定期限', value: 'date' },
                                        ]
                                            .map((dd) => {
                                            return `<div>${[
                                                html ` <div
                                                                    class="d-flex align-items-center cursor_pointer"
                                                                    style="gap:8px;"
                                                                    onclick="${gvc.event(() => {
                                                    vm.data.dead_line.type = dd.value;
                                                    gvc.notifyDataChange(id);
                                                })}"
                                                                >
                                                                    ${vm.data.dead_line.type === dd.value
                                                    ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>`
                                                    : ` <div class="c_39_checkbox"></div>`}
                                                                    <div class="tx_normal fw-normal">${dd.title}</div>
                                                                </div>`,
                                                html ` <div class="d-flex position-relative mt-2" style="">
                                                                    <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                                                    <div class="flex-fill w-100  d-flex align-items-center" style="margin-left:30px;max-width: 518px;gap:10px;">
                                                                        ${(() => {
                                                    var _a;
                                                    if (vm.data.dead_line.type === dd.value && dd.value === 'date') {
                                                        vm.data.dead_line.value = (_a = vm.data.dead_line.value) !== null && _a !== void 0 ? _a : 30;
                                                        let map = [
                                                            EditorElem.select({
                                                                title: '',
                                                                gvc: gvc,
                                                                def: `${[30, 90, 180, 365].find((dd) => {
                                                                    return parseInt(vm.data.dead_line.value, 10) === dd;
                                                                })
                                                                    ? vm.data.dead_line.value
                                                                    : `custom`}`,
                                                                array: [
                                                                    {
                                                                        title: '一個月',
                                                                        value: '30',
                                                                    },
                                                                    {
                                                                        title: '三個月',
                                                                        value: '90',
                                                                    },
                                                                    {
                                                                        title: '六個月',
                                                                        value: '180',
                                                                    },
                                                                    {
                                                                        title: '一年',
                                                                        value: '365',
                                                                    },
                                                                    {
                                                                        title: '自訂',
                                                                        value: 'custom',
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    vm.data.dead_line.value = parseInt(text, 10);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                            }),
                                                        ];
                                                        if (![30, 90, 180, 365].find((dd) => {
                                                            return parseInt(vm.data.dead_line.value, 10) === dd;
                                                        })) {
                                                            map.push(` <div class="flex-fill w-100 mt-n2 d-flex align-items-center"
                                                                                 style="gap:10px;flex: 2;">
                                                                                ${(() => {
                                                                return [
                                                                    BgWidget.editeInput({
                                                                        gvc: gvc,
                                                                        title: '',
                                                                        type: 'number',
                                                                        default: `${vm.data.dead_line.value || '0'}`,
                                                                        placeHolder: '請輸入有效天數',
                                                                        callback: (text) => {
                                                                            vm.data.dead_line.value = parseInt(text, 10);
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                    }),
                                                                    `<div class="tx_normal" style="color:#8D8D8D;margin-top: 8px;white-space: nowrap;">天</div>`,
                                                                ].join('');
                                                            })()}
                                                                            </div>`);
                                                        }
                                                        return map.join('');
                                                    }
                                                    else {
                                                        return ``;
                                                    }
                                                })()}
                                                                    </div>
                                                                </div>`,
                                            ].join('')}</div>`;
                                        })
                                            .join('<div class="my-2"></div>')}
                                                `),
                                    ];
                                    return map.join('<div style="height: 24px;"></div>');
                                },
                                divCreate: {
                                    style: 'width:594px;',
                                },
                                onCreate: () => {
                                    gvc.notifyDataChange(noteID);
                                },
                            };
                        })}
                                ${gvc.bindView(() => {
                            return {
                                bind: noteID,
                                view: () => {
                                    return BgWidget.mainCard(html `
                                                <div class="tx_normal fw-bold">摘要</div>
                                                <div class="tx_normal fw-normal" style="margin-top: 18px;margin-bottom: 18px;">會員名稱: ${vm.data.tag_name || '尚未設定'}</div>
                                                <div class="w-100" style="background: #DDD;height: 2px;"></div>
                                                <div class="tx_normal fw-normal" style="margin-top: 18px;">
                                                    會員條件: ${vm.data.condition.type === 'single' ? `單筆消費金額${vm.data.condition.value}元` : `累計消費金額${vm.data.condition.value}元`}
                                                </div>
                                                <div class="tx_normal fw-normal" style="margin-top: 12px;margin-bottom: 18px;">
                                                    計算期間: ${vm.data.duration.type === 'noLimit' ? `不計算期限` : `${vm.data.duration.value}天`} 天內消費
                                                </div>
                                                <div class="w-100" style="background: #DDD;height: 2px;"></div>
                                                <div class="tx_normal fw-normal" style="margin-top: 18px;">
                                                    會員期限: ${vm.data.dead_line.type === 'noLimit' ? `沒有期限` : `${vm.data.dead_line.value}天`}
                                                </div>
                                            `);
                                },
                                divCreate: {
                                    style: `width:294px;`,
                                },
                            };
                        })}
                            </div>`,
                        html ` <div class="d-flex align-items-center justify-content-end pt-2" style="gap:20px;">
                                ${BgWidget.cancel(gvc.event(() => {
                            cf.callback();
                        }))}
                                ${BgWidget.save(gvc.event(() => {
                            vm.original_data.levels[vm.index] = vm.data;
                            cf.widget.event('loading', {
                                title: '設定中...',
                            });
                            ApiUser.setPublicConfig({
                                key: 'member_level_config',
                                user_id: 'manager',
                                value: vm.original_data,
                            }).then(() => {
                                setTimeout(() => {
                                    cf.widget.event('loading', {
                                        visible: false,
                                    });
                                    cf.widget.event('success', {
                                        title: '設定成功',
                                    });
                                }, 500);
                            });
                        }))}
                            </div>`,
                    ].join('<div class="my-2"></div>'), BgWidget.getContainerWidth());
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, MemberTypeList);
