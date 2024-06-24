import { SeoSetting } from './seo-setting.js';
import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { ApiPost } from '../glitter-base/route/post.js';

export class WebConfigSetting {
    public static tag = 'web_config_setting';

    public static main(gvc: GVC) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data: any) => {};
        const vm: {
            id: string;
            type: 'list' | 'add' | 'replace' | 'select';
            data: any;
            dataList: any;
            query?: string;
        } = {
            id: glitter.getUUID(),
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
                        key: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: !vm.dataList.find((dd: any) => {
                                return !dd.checked;
                            }),
                            callback: (result) => {
                                vm.dataList.map((dd: any) => {
                                    dd.checked = result;
                                });
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(filterID);
                                callback(
                                    vm.dataList.filter((dd: any) => {
                                        return dd.checked;
                                    })
                                );
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
                                callback(
                                    vm.dataList.filter((dd: any) => {
                                        return dd.checked;
                                    })
                                );
                            },
                            style: 'height:25px;',
                        }),
                    },
                    {
                        key: '配置檔標題',
                        value: `<span class="fs-7">${dd.content.form_title}</span>`,
                    },
                    {
                        key: '配置檔標籤',
                        value: `<span class="fs-7"><div class="badge bg-primary text-white btn "
                                                                                 >${dd.content.key}
                                                                            </div></span>`,
                    },
                    {
                        key: '建立時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
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
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center" style="margin-bottom: 24px;">
                                    ${BgWidget.title('網站配置檔')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton(
                                        '新增配置檔',
                                        gvc.event(() => {
                                            vm.type = 'add';
                                        })
                                    )}
                                </div>
                                ${BgWidget.table({
                                    gvc: gvc,
                                    getData: (vd) => {
                                        vmi = vd;
                                        ApiPost.getManagerPost({
                                            page: vmi.page - 1,
                                            limit: 20,
                                            type: WebConfigSetting.tag,
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
                                    filter: html`
                                        ${BgWidget.searchPlace(
                                            gvc.event((e, event) => {
                                                vm.query = e.value;
                                                gvc.notifyDataChange(vm.id);
                                            }),
                                            vm.query || '',
                                            '搜尋所有表單'
                                        )}
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
                                                                                gvc.notifyDataChange(vm.id);
                                                                            } else {
                                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                                            }
                                                                        });
                                                                    }
                                                                },
                                                            });
                                                        })}">批量移除</button>`,
                                                    ].join(``);
                                                },
                                                divCreate: () => {
                                                    return {
                                                        class: `d-flex align-items-center p-2 py-3 ${
                                                            !vm.dataList ||
                                                            !vm.dataList.find((dd: any) => {
                                                                return dd.checked;
                                                            })
                                                                ? `d-none`
                                                                : ``
                                                        }`,
                                                        style: `height:40px;gap:10px;margin-top:10px;`,
                                                    };
                                                },
                                            };
                                        })}
                                    `,
                                })}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'add') {
                        return this.formSettingDetail({
                            formID: '',
                            gvc: gvc,
                            vm: vm,
                        });
                    } else {
                        return this.configSetting({
                            formID: '',
                            gvc: gvc,
                            vm: vm,
                        });
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }

    public static configSetting(cf: { formID: string; gvc: GVC; vm: any }) {
        const postMd: {
            form_title: string;
            tag: string[];
            form_format: any;
            key: string;
            type: string;
            form_data: any;
        } = cf.vm.data.content;
        postMd.form_data = postMd.form_data || {};
        let viewType: 'editor' | 'preview' = 'preview';
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
                                        if (viewType === 'editor') {
                                            viewType = 'preview';
                                            gvc.notifyDataChange(id);
                                        } else {
                                            cf.vm.type = 'list';
                                        }
                                    })
                                )}
                                ${BgWidget.title(viewType === 'preview' ? `配置設定` : '表單調整')}
                                <div class="flex-fill"></div>
                                <div
                                    class="${viewType === 'editor' ? `d-none` : `d-flex`}  align-items-center justify-content-center bg-white  me-2 border"
                                    style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    data-bs-custom-class="custom-tooltip"
                                    data-bs-title="格式設定"
                                    onclick="${gvc.event(() => {
                                        viewType = 'editor';
                                        gvc.notifyDataChange(id);
                                    })}"
                                >
                                    <i class="fa-sharp fa-regular fa-gear"></i>
                                </div>
                                <button
                                    class="btn btn-primary-c "
                                    style="height:35px;font-size: 14px;"
                                    onclick="${gvc.event(() => {
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
                                    })}"
                                >
                                    ${cf.vm.type === 'add' ? `儲存` : `更新`}
                                </button>
                            </div>`,
                            BgWidget.card(
                                (() => {
                                    if (viewType === 'preview') {
                                        return [
                                            `<div class="position-relative text-center bgf6 rounded-top d-flex align-items-center justify-content-center mx-n3 mt-n3 p-3 border-top border-bottom shadow">
                <span class="fs-6 fw-bold " style="color:black;">配置檔案設定</span>
            </div>`,
                                            FormWidget.editorView({
                                                gvc: gvc,
                                                array: postMd.form_format,
                                                refresh: () => {
                                                    const scrollTop = document.querySelector('.web_config_container')!.scrollTop;
                                                    gvc.notifyDataChange(id);
                                                    setTimeout(() => {
                                                        document.querySelector('.web_config_container')!.scrollTop = scrollTop;
                                                    });
                                                },
                                                formData: postMd.form_data,
                                            }),
                                        ].join('');
                                    } else {
                                        return [
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '配置檔標題',
                                                default: postMd.form_title,
                                                placeHolder: '請輸入配置檔案',
                                                callback: (text) => {
                                                    postMd.form_title = text;
                                                },
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '配置檔標籤',
                                                default: postMd.key,
                                                placeHolder: '請輸入配置檔標籤',
                                                callback: (text) => {
                                                    postMd.key = text;
                                                },
                                            }),
                                            `<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n3 mt-2 p-2 border-top border-bottom shadow">
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
    public static formSettingDetail(cf: { formID: string; gvc: GVC; vm: any }) {
        const postMd: {
            form_title: string;
            tag: string[];
            form_format: any;
            key: string;
            type: string;
        } =
            cf.vm.type === 'add'
                ? {
                      form_title: '',
                      tag: [],
                      form_format: [],
                      key: '',
                      type: WebConfigSetting.tag,
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
                                <div
                                    class="${viewType === 'preview' ? `d-none` : `d-flex`}  align-items-center justify-content-center bg-white  me-2 border"
                                    style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    data-bs-custom-class="custom-tooltip"
                                    data-bs-title="預覽表單"
                                    onclick="${gvc.event(() => {
                                        cf.vm.type = 'list';
                                    })}"
                                >
                                    <i class="fa-regular fa-eye" aria-hidden="true"></i>
                                </div>
                                <button
                                    class="btn btn-primary-c "
                                    style="height:35px;font-size: 14px;"
                                    onclick="${gvc.event(() => {
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
                                                cf.vm.type = 'list';
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
                                    })}"
                                >
                                    ${cf.vm.type === 'add' ? `儲存` : `更新`}
                                </button>
                            </div>`,
                            BgWidget.card(
                                (() => {
                                    if (viewType === 'preview') {
                                        return [
                                            `<div class="position-relative text-center bgf6 rounded-top d-flex align-items-center justify-content-center mx-n3 mt-n3 p-3 border-top border-bottom shadow">
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
                                                title: '配置檔標題',
                                                default: postMd.form_title,
                                                placeHolder: '請輸入配置檔案',
                                                callback: (text) => {
                                                    postMd.form_title = text;
                                                },
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '配置檔標籤',
                                                default: postMd.key,
                                                placeHolder: '請輸入配置檔標籤',
                                                callback: (text) => {
                                                    postMd.key = text;
                                                },
                                            }),
                                            `<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n3 mt-2 p-2 border-top border-bottom shadow">
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

(window as any).glitter.setModule(import.meta.url, WebConfigSetting);
