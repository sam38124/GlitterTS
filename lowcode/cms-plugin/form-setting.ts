import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { ApiPost } from '../glitter-base/route/post.js';

export class FormSetting {
    public static main(gvc: GVC) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data: any) => {};
        const vm: {
            type: 'list' | 'add' | 'replace' | 'select';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
        };
        const filterID = gvc.glitter.getUUID();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: '表單標題',
                        value: html`<span class="fs-7">${dd.content.form_title}</span>`,
                    },
                    {
                        key: '表單標籤',
                        value: html`<span class="fs-7"
                            >${dd.content.tag
                                .map((dd: any) => {
                                    return html`<div class="badge bg-primary text-white btn ">${dd}</div>`;
                                })
                                .join('')}</span
                        >`,
                    },
                    {
                        key: '建立時間',
                        value: html`<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
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
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('表單設定')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton(
                                        '新增表單',
                                        gvc.event(() => {
                                            vm.type = 'add';
                                        })
                                    )}
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        [
                                            BgWidget.searchPlace(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋所有表單'
                                            ),
                                            BgWidget.tableV3({
                                                gvc: gvc,
                                                getData: (vd) => {
                                                    vmi = vd;
                                                    const limit = 20;
                                                    ApiPost.getManagerPost({
                                                        page: vmi.page - 1,
                                                        limit: limit,
                                                        type: 'form_format_list',
                                                        search: vm.query ? [`form_title-|>${vm.query}`] : [],
                                                    }).then((data) => {
                                                        vm.dataList = data.response.data;
                                                        vmi.pageSize = Math.ceil(data.response.total / limit);
                                                        vmi.originalData = vm.dataList;
                                                        vmi.tableData = getDatalist();
                                                        vmi.loading = false;
                                                        vmi.callback();
                                                    });
                                                },
                                                rowClick: (data, index) => {
                                                    vm.data = vm.dataList[index];
                                                    vm.type = 'replace';
                                                },
                                                filter: [
                                                    {
                                                        name: '批量移除',
                                                        event: () => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.checkYesOrNot({
                                                                text: '是否確認刪除所選項目？',
                                                                callback: (response) => {
                                                                    if (response) {
                                                                        dialog.dataLoading({ visible: true });
                                                                        ApiPost.delete({
                                                                            id: vm.dataList
                                                                                .filter((dd: any) => {
                                                                                    return dd.checked;
                                                                                })
                                                                                .map((dd: any) => {
                                                                                    return dd.id;
                                                                                })
                                                                                .join(`,`),
                                                                        }).then((res) => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            if (res.result) {
                                                                                vm.dataList = undefined;
                                                                                gvc.notifyDataChange(id);
                                                                            } else {
                                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                                            }
                                                                        });
                                                                    }
                                                                },
                                                            });
                                                        },
                                                    },
                                                ],
                                            }),
                                        ].join('')
                                    )
                                )}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace' || vm.type == 'add') {
                        return this.formSettingDetail({ formID: '', gvc: gvc, vm: vm });
                    } else {
                        return ``;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }

    public static form_post_list(gvc: GVC) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data: any) => {};
        const vm: {
            type: 'list' | 'add' | 'replace' | 'select';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
        };
        const filterID = gvc.glitter.getUUID();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
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
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('表單收集')}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        [
                                            html`<div class="mb-3 px-2">
                                                ${BgWidget.searchPlace(
                                                    gvc.event((e, event) => {
                                                        vm.query = e.value;
                                                        gvc.notifyDataChange(id);
                                                    }),
                                                    vm.query || '',
                                                    '搜尋所有表單'
                                                )}
                                            </div>`,
                                            BgWidget.tableV3({
                                                gvc: gvc,
                                                getData: (vd) => {
                                                    vmi = vd;
                                                    const limit = 20;
                                                    ApiPost.getV2({
                                                        page: vmi.page - 1,
                                                        limit: limit,
                                                        type: 'user',
                                                        search: vm.query ? `form_title-|>${vm.query},type->post-form-config` : `type->post-form-config`,
                                                    }).then((data) => {
                                                        vm.dataList = data.response.data;
                                                        vmi.pageSize = Math.ceil(data.response.total / limit);
                                                        vmi.originalData = vm.dataList;
                                                        vmi.tableData = getDatalist();
                                                        vmi.loading = false;
                                                        vmi.callback();
                                                    });
                                                },
                                                rowClick: (data, index) => {
                                                    vm.data = vm.dataList[index];
                                                    vm.type = 'replace';
                                                },
                                                filter: [
                                                    {
                                                        name: '批量移除',
                                                        event: () => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.checkYesOrNot({
                                                                text: '是否確認刪除所選項目？',
                                                                callback: (response) => {
                                                                    if (response) {
                                                                        dialog.dataLoading({ visible: true });
                                                                        ApiPost.deleteUserPost({
                                                                            id: vm.dataList
                                                                                .filter((dd: any) => {
                                                                                    return dd.checked;
                                                                                })
                                                                                .map((dd: any) => {
                                                                                    return dd.id;
                                                                                })
                                                                                .join(`,`),
                                                                        }).then((res) => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            if (res.result) {
                                                                                vm.dataList = undefined;
                                                                                gvc.notifyDataChange(id);
                                                                            } else {
                                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                                            }
                                                                        });
                                                                    }
                                                                },
                                                            });
                                                        },
                                                    },
                                                ],
                                            }),
                                        ].join('')
                                    )
                                )}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace' || vm.type == 'add') {
                        return this.formReadOnly({
                            formID: '',
                            gvc: gvc,
                            vm: vm,
                        });
                    } else {
                        return ``;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    public static formReadOnly(cf: { formID: string; gvc: GVC; vm: any }) {
        const postMd: {
            form_title: string;
            tag: string[];
            form_config: any;
            form_data: any;
            type: string;
        } = cf.vm.data.content;
        let viewType: 'editor' | 'preview' = 'editor';
        const gvc = cf.gvc;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        return BgWidget.container(
            cf.gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        try {
                            return [
                                html` <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgWidget.goBack(
                                        gvc.event(() => {
                                            if (viewType === 'preview') {
                                                viewType = 'editor';
                                                gvc.notifyDataChange(id);
                                            } else {
                                                cf.vm.type = 'list';
                                            }
                                        })
                                    )}
                                    ${BgWidget.title(`表單內容`)}
                                    <div class="flex-fill"></div>
                                </div>`,
                                BgWidget.mainCard(
                                    (() => {
                                        return FormWidget.editorView({
                                            gvc: gvc,
                                            array: postMd.form_config,
                                            refresh: () => {
                                                gvc.notifyDataChange(id);
                                            },
                                            formData: postMd.form_data,
                                        });
                                    })()
                                ),
                            ].join('');
                        } catch (e) {
                            console.log(e);
                            return `${e}`;
                        }
                    },
                    onCreate: () => {
                        $('.tooltip')!.remove();
                        ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                    },
                };
            }),
            800
        );
    }
    public static formSettingDetail(cf: { formID: string; gvc: GVC; vm: any }) {
        const postMd: {
            form_title: string;
            tag: string[];
            form_format: any;
            type: string;
        } =
            cf.vm.type === 'add'
                ? {
                      form_title: '',
                      tag: [],
                      form_format: [],
                      type: 'form_format_list',
                  }
                : cf.vm.data.content;
        let viewType: 'editor' | 'preview' = 'editor';
        const gvc = cf.gvc;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        return BgWidget.container(
            cf.gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return [
                            html` <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.goBack(
                                    gvc.event(() => {
                                        if (viewType === 'preview') {
                                            viewType = 'editor';
                                            gvc.notifyDataChange(id);
                                        } else {
                                            cf.vm.type = 'list';
                                        }
                                    })
                                )}
                                ${BgWidget.title(viewType === 'preview' ? `表單預覽` : '表單設定')}
                                <div class="flex-fill"></div>
                                ${viewType === 'preview'
                                    ? ''
                                    : BgWidget.grayButton(
                                          '預覽表單',
                                          gvc.event(() => {
                                              viewType = 'preview';
                                              gvc.notifyDataChange(id);
                                          })
                                      )}
                            </div>`,
                            BgWidget.mainCard(
                                (() => {
                                    if (viewType === 'preview') {
                                        return [
                                            html`<div
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
                                    } else {
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
                                            html`${EditorElem.h3('表單標籤')}
                                            ${gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();

                                                function refreshTag() {
                                                    gvc.notifyDataChange(id);
                                                }

                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html` ${postMd.tag
                                                                .map((dd, index) => {
                                                                    return html` <div class="badge bg-warning text-dark btn ">
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
                                                                    EditorElem.openEditorDialog(
                                                                        gvc,
                                                                        (gvc) => {
                                                                            let label = '';
                                                                            return html`<div class="p-2">
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
                                                                        },
                                                                        () => {},
                                                                        400,
                                                                        '新增標籤'
                                                                    );
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
                                            html`<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n3 mt-2 p-2 border-top border-bottom shadow">
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
                                })()
                            ),
                            html`${BgWidget.mbContainer(240)}
                                <div class="update-bar-container">
                                    ${BgWidget.save(
                                        gvc.event(() => {
                                            if (!postMd.form_title) {
                                                dialog.errorMessage({ text: '請輸入表單標題' });
                                                return;
                                            } else if (postMd.form_format.length === 0) {
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
                                            } else {
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
                                        }),
                                        cf.vm.type === 'add' ? `儲存` : `更新`
                                    )}
                                </div>`,
                        ].join('');
                    },
                    onCreate: () => {
                        $('.tooltip')!.remove();
                        ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                    },
                };
            }),
            800
        );
    }
}

(window as any).glitter.setModule(import.meta.url, FormSetting);
