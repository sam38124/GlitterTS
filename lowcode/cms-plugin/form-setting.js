import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { ApiPost } from '../glitter-base/route/post.js';
export class FormSetting {
    static main(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data) => { };
        const vm = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
        };
        const filterID = gvc.glitter.getUUID();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
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
                        key: '表單標題',
                        value: html `<span class="fs-7">${dd.content.form_title}</span>`,
                    },
                    {
                        key: '表單標籤',
                        value: html `<span class="fs-7"
                            >${dd.content.tag
                            .map((dd) => {
                            return html `<div class="badge bg-primary text-white btn ">${dd}</div>`;
                        })
                            .join('')}</span
                        >`,
                    },
                    {
                        key: '建立時間',
                        value: html `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
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
                                    ${BgWidget.title('表單設定')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增表單', gvc.event(() => {
                            vm.type = 'add';
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vd) => {
                                vmi = vd;
                                ApiPost.getManagerPost({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    type: 'form_format_list',
                                    search: vm.query ? [`form_title-|>${vm.query}`] : [],
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                                vm.data = vm.dataList[index];
                                vm.type = 'replace';
                            },
                            filter: html `
                                                ${BgWidget.searchPlace(gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有表單')}
                                                ${gvc.bindView(() => {
                                return {
                                    bind: filterID,
                                    view: () => {
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
                                    },
                                    divCreate: () => {
                                        return {
                                            class: `mt-2 d-flex align-items-center p-2 py-3 ${!vm.dataList ||
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
                        })))}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type == 'replace' || vm.type == 'add') {
                        return this.formSettingDetail({ formID: '', gvc: gvc, vm: vm });
                    }
                    else {
                        return ``;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static form_post_list(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data) => { };
        const vm = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
        };
        const filterID = gvc.glitter.getUUID();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
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
                        key: '表單標題',
                        value: `<span class="fs-7">${dd.content.form_title}</span>`,
                    },
                    {
                        key: '建立時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
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
                                    ${BgWidget.title('表單收集')}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vd) => {
                                vmi = vd;
                                ApiPost.getV2({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    type: 'user',
                                    search: vm.query ? `form_title-|>${vm.query},type->post-form-config` : `type->post-form-config`,
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                                vm.data = vm.dataList[index];
                                vm.type = 'replace';
                            },
                            filter: html `
                                                ${BgWidget.searchPlace(gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有表單')}
                                                ${gvc.bindView(() => {
                                return {
                                    bind: filterID,
                                    view: () => {
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
                                    },
                                    divCreate: () => {
                                        return {
                                            class: `d-flex align-items-center p-2 mt-2 py-3 ${!vm.dataList ||
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
                        })))}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type == 'replace' || vm.type == 'add') {
                        return this.formReadOnly({
                            formID: '',
                            gvc: gvc,
                            vm: vm,
                        });
                    }
                    else {
                        return ``;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static formReadOnly(cf) {
        const postMd = cf.vm.data.content;
        let viewType = 'editor';
        const gvc = cf.gvc;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        return BgWidget.container(cf.gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    try {
                        return [
                            html ` <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgWidget.goBack(gvc.event(() => {
                                if (viewType === 'preview') {
                                    viewType = 'editor';
                                    gvc.notifyDataChange(id);
                                }
                                else {
                                    cf.vm.type = 'list';
                                }
                            }))}
                                    ${BgWidget.title(`表單內容`)}
                                    <div class="flex-fill"></div>
                                </div>`,
                            BgWidget.mainCard((() => {
                                return FormWidget.editorView({
                                    gvc: gvc,
                                    array: postMd.form_config,
                                    refresh: () => {
                                        gvc.notifyDataChange(id);
                                    },
                                    formData: postMd.form_data,
                                });
                            })()),
                        ].join('');
                    }
                    catch (e) {
                        console.log(e);
                        return `${e}`;
                    }
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                },
            };
        }), 800);
    }
    static formSettingDetail(cf) {
        const postMd = cf.vm.type === 'add'
            ? {
                form_title: '',
                tag: [],
                form_format: [],
                type: 'form_format_list',
            }
            : cf.vm.data.content;
        let viewType = 'editor';
        const gvc = cf.gvc;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        return BgWidget.container(cf.gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return [
                        html ` <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.goBack(gvc.event(() => {
                            if (viewType === 'preview') {
                                viewType = 'editor';
                                gvc.notifyDataChange(id);
                            }
                            else {
                                cf.vm.type = 'list';
                            }
                        }))}
                                ${BgWidget.title(viewType === 'preview' ? `表單預覽` : '表單設定')}
                                <div class="flex-fill"></div>
                                ${viewType === 'preview'
                            ? ''
                            : BgWidget.grayButton('預覽表單', gvc.event(() => {
                                viewType = 'preview';
                                gvc.notifyDataChange(id);
                            }))}
                            </div>`,
                        BgWidget.mainCard((() => {
                            if (viewType === 'preview') {
                                return [
                                    html `<div
                                                class="position-relative text-center bgf6 rounded-top d-flex align-items-center justify-content-center mx-n3 mt-n3 p-3 border-top border-bottom shadow"
                                            >
                                                <span class="fs-6 fw-bold " style="color:black;">表單樣式預覽</span>
                                            </div>`,
                                    FormWidget.editorView({
                                        gvc: gvc,
                                        array: postMd.form_format,
                                        refresh: () => {
                                            gvc.notifyDataChange(id);
                                        },
                                        formData: {},
                                    }),
                                ].join('');
                            }
                            else {
                                return [
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '表單標題',
                                        default: postMd.form_title,
                                        placeHolder: '請輸入表單標題',
                                        callback: (text) => {
                                            postMd.form_title = text;
                                        },
                                    }),
                                    html `${EditorElem.h3('表單標籤')}
                                            ${gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        function refreshTag() {
                                            gvc.notifyDataChange(id);
                                        }
                                        return {
                                            bind: id,
                                            view: () => {
                                                return html ` ${postMd.tag
                                                    .map((dd, index) => {
                                                    return html ` <div class="badge bg-warning text-dark btn ">
                                                                        <i
                                                                            class="fa-regular fa-circle-minus me-1 text-danger fw-bold"
                                                                            onclick="${gvc.event(() => {
                                                        postMd.tag.splice(index, 1);
                                                        refreshTag();
                                                    })}"
                                                                        ></i
                                                                        >${dd}
                                                                    </div>`;
                                                })
                                                    .join('')}
                                                            <div
                                                                class="badge  btn "
                                                                style="background: #295ed1;"
                                                                onclick="${gvc.event(() => {
                                                    EditorElem.openEditorDialog(gvc, (gvc) => {
                                                        let label = '';
                                                        return html `<div class="p-2">
                                                                                    ${EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '標籤名稱',
                                                            default: label,
                                                            placeHolder: '請輸入標籤名稱',
                                                            callback: (text) => {
                                                                label = text;
                                                            },
                                                        })}
                                                                                </div>
                                                                                <div class="w-100 border-top p-2 d-flex align-items-center justify-content-end">
                                                                                    <button
                                                                                        class="btn btn-primary"
                                                                                        style="height:35px;width:80px;"
                                                                                        onclick="${gvc.event(() => {
                                                            postMd.tag.push(label);
                                                            refreshTag();
                                                            gvc.closeDialog();
                                                        })}"
                                                                                    >
                                                                                        確認新增
                                                                                    </button>
                                                                                </div> `;
                                                    }, () => { }, 400, '新增標籤');
                                                })}"
                                                            >
                                                                <i class="fa-regular fa-circle-plus me-1"></i>新增標籤
                                                            </div>`;
                                            },
                                            divCreate: {
                                                class: `w-100 d-flex flex-wrap bg-secondary p-3`,
                                                style: `gap:5px;`,
                                            },
                                        };
                                    })} `,
                                    html `<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n3 mt-2 p-2 border-top border-bottom shadow">
                                                <span class="fs-6 fw-bold " style="color:black;">表單格式設定</span>
                                            </div>`,
                                    FormWidget.settingView({
                                        gvc: gvc,
                                        array: postMd.form_format,
                                        refresh: () => {
                                            gvc.notifyDataChange(id);
                                        },
                                        title: '',
                                    }),
                                ].join('');
                            }
                        })()),
                        html `${BgWidget.mbContainer(240)}
                                <div class="update-bar-container">
                                    ${BgWidget.save(gvc.event(() => {
                            if (!postMd.form_title) {
                                dialog.errorMessage({ text: '請輸入表單標題' });
                                return;
                            }
                            else if (postMd.form_format.length === 0) {
                                dialog.errorMessage({ text: '請設定表單內容' });
                                return;
                            }
                            dialog.dataLoading({
                                visible: true,
                            });
                            if (cf.vm.type === 'add') {
                                ApiPost.post({
                                    postData: postMd,
                                    type: 'manager',
                                }).then(() => {
                                    dialog.dataLoading({
                                        visible: false,
                                    });
                                    dialog.successMessage({
                                        text: '新增成功!',
                                    });
                                });
                            }
                            else {
                                ApiPost.put({
                                    postData: postMd,
                                    type: 'manager',
                                }).then(() => {
                                    dialog.dataLoading({
                                        visible: false,
                                    });
                                    dialog.successMessage({
                                        text: '更新成功!',
                                    });
                                });
                            }
                        }), cf.vm.type === 'add' ? `儲存` : `更新`)}
                                </div>`,
                    ].join('');
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                },
            };
        }), 800);
    }
}
window.glitter.setModule(import.meta.url, FormSetting);
