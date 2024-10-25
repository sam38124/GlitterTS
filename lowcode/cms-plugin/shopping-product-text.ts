import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { Tool } from '../modules/tool.js';
import { ApiUser } from '../glitter-base/route/user.js';

const html = String.raw;

type Example = {
    id: string;
    type: 'file' | 'folder';
    title: string;
    data: {
        content: string;
    };
    status: boolean;
    updated_time: string;
};

interface ViewModel {
    id: string;
    type: 'list' | 'text_edit' | 'tag_edit';
    dataList: any;
    data: Example;
}

export class ProductText {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        function getExample(): Example {
            return {
                id: '',
                type: 'file',
                title: '',
                data: {
                    content: '',
                },
                status: false,
                updated_time: '',
            };
        }
        const vm: ViewModel = {
            id: glitter.getUUID(),
            type: 'list',
            dataList: [],
            data: getExample(),
        };

        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    function getTextList(list: any) {
                        return list.map((item: any) => {
                            const ids = [gvc.glitter.getUUID(), gvc.glitter.getUUID()];
                            return [
                                {
                                    key: '文本名稱',
                                    value: item.title,
                                },
                                {
                                    key: '最後更新時間',
                                    value: gvc.bindView({
                                        bind: ids[0],
                                        view: () => glitter.ut.dateFormat(new Date(item.updated_time), 'yyyy-MM-dd hh:mm:ss'),
                                    }),
                                },
                                // {
                                //     key: '文本統一',
                                //     value: gvc.bindView(() => {
                                //         return {
                                //             bind: ids[1],
                                //             view: () =>
                                //                 BgWidget.switchTextButton(gvc, item.status, { left: item.status ? '開啟' : '關閉' }, (bool) => {
                                //                     item.status = bool;
                                //                     item.updated_time = glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                                //                     vm.dataList[vm.dataList.findIndex((d: { id: string }) => d.id === item.id)] = item;
                                //                     ApiUser.setPublicConfig({
                                //                         key: 'text-manager',
                                //                         user_id: 'manager',
                                //                         value: vm.dataList,
                                //                     }).then((result) => {
                                //                         if (!result.response.result) {
                                //                             dialog.errorMessage({ text: '設定失敗' });
                                //                         }
                                //                         ids.map((id) => gvc.notifyDataChange(id));
                                //                     });
                                //                 }),
                                //             divCreate: {
                                //                 option: [
                                //                     {
                                //                         key: 'onclick',
                                //                         value: gvc.event((e, event) => {
                                //                             event.stopPropagation();
                                //                         }),
                                //                     },
                                //                 ],
                                //             },
                                //         };
                                //     }),
                                // },
                            ];
                        });
                    }

                    return BgWidget.container(
                        BgWidget.mainCard(
                            [
                                html`<div class="d-flex align-items-center gap-2 ms-1 mb-3">
                                    <div class="tx_700">商品文本</div>
                                    ${BgWidget.questionButton(
                                        gvc.event(() => {
                                            BgWidget.dialog({
                                                gvc,
                                                title: '提示',
                                                innerHTML: () => {
                                                    return html`
                                                        <div class="tx_normal text-wrap">
                                                            可在商品頁面展示多個自訂文本分頁，如商品規格、退換貨政策等，並能自由選擇每個文本的顯示內容是否統一，提升管理靈活性。
                                                        </div>
                                                        <div class="w-100 border border-1">
                                                            <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/s348251.png" />
                                                        </div>
                                                    `;
                                                },
                                                height: 210,
                                            });
                                        })
                                    )}
                                </div>`,
                                BgWidget.tableV3({
                                    gvc: gvc,
                                    getData: (vmi) => {
                                        ApiUser.getPublicConfig('text-manager', 'manager').then((data: any) => {
                                            vm.dataList = data.response.value;
                                            vmi.originalData = vm.dataList;
                                            vmi.tableData = getTextList(vm.dataList);
                                            vmi.loading = false;
                                            vmi.callback();
                                        });
                                    },
                                    rowClick: (data, index) => {
                                        vm.data = vm.dataList[index];
                                        vm.type = 'text_edit';
                                    },
                                    filter: [
                                        {
                                            name: '批量刪除',
                                            event: (checkedData) => {
                                                dialog.checkYesOrNot({
                                                    text: '確認要刪除已勾選的文本？',
                                                    callback: (bool) => {
                                                        if (bool) {
                                                            vm.dataList = vm.dataList.filter((item: any) => {
                                                                return checkedData.findIndex((d: any) => d.id === item.id) === -1;
                                                            });
                                                            ApiUser.setPublicConfig({
                                                                key: 'text-manager',
                                                                user_id: 'manager',
                                                                value: vm.dataList,
                                                            }).then((result) => {
                                                                if (!result.response.result) {
                                                                    dialog.errorMessage({ text: '設定失敗' });
                                                                }
                                                                gvc.notifyDataChange(vm.id);
                                                            });
                                                        }
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                    hiddenPageSplit: true,
                                }),
                                html` <div
                                    class="w-100 d-flex justify-content-center align-items-center gap-2 cursor_pointer"
                                    style="color: #3366BB"
                                    onclick="${gvc.event(() => {
                                        vm.data = getExample();
                                        vm.type = 'text_edit';
                                    })}"
                                >
                                    <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">新增一個文本</div>
                                    <i class="fa-solid fa-plus"></i>
                                </div>`,
                            ].join('')
                        )
                    );
                }

                // 新增類型
                // BgWidget.mainCard(
                //     html`<div class="tx_normal fw-normal mb-2">新增類型</div>
                //         ${BgWidget.select({
                //             gvc: gvc,
                //             default: vm.data.type,
                //             callback: (key) => {
                //                 vm.data.type = key;
                //             },
                //             options: [
                //                 { key: 'folder', value: '資料夾' },
                //                 { key: 'file', value: '文本' },
                //             ],
                //         })}`
                // ),

                // 文本統一開關
                // BgWidget.container(
                //     BgWidget.mainCard(
                //         html`
                //             <div class="tx_normal">文本統一</div>
                //             ${BgWidget.grayNote('開啟此設定後，所有商品將共享此文本內容。')}
                //             ${BgWidget.select({
                //                 gvc: gvc,
                //                 callback: (text) => {
                //                     vm.data.status = text === 'yes';
                //                 },
                //                 default: vm.data.status ? 'yes' : 'no',
                //                 options: [
                //                     { key: 'no', value: '關閉' },
                //                     { key: 'yes', value: '開啟' },
                //                 ],
                //                 style: 'margin: 8px 0;',
                //             })}
                //         `
                //     ),
                //     undefined,
                //     'padding: 0; margin: 0 !important; width: 30%;'
                // ),

                if (vm.type === 'text_edit') {
                    return BgWidget.container(
                        [
                            html` <div class="title-container">
                                ${BgWidget.goBack(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.title(vm.data.title || '新增文本')}
                                <div class="flex-fill"></div>
                            </div>`,
                            BgWidget.container(
                                [
                                    BgWidget.mainCard(
                                        BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '文本標題',
                                            default: vm.data.title,
                                            placeHolder: '請輸入文本標題',
                                            callback: (text) => {
                                                vm.data.title = text;
                                            },
                                        })
                                    ),
                                    BgWidget.mainCard(
                                        html`<div>
                                            <div class="title-container">
                                                <div class="tx_normal fw-normal">文本說明</div>
                                                <div class="flex-fill"></div>
                                                ${BgWidget.aiChatButton({ gvc, select: 'writer' })}
                                            </div>
                                            <div style="margin: 8px 0">
                                                ${EditorElem.richText({
                                                    gvc: gvc,
                                                    def: vm.data.data.content,
                                                    callback: (text) => {
                                                        vm.data.data.content = text;
                                                    },
                                                })}
                                            </div>
                                        </div>`
                                    ),
                                ].join(BgWidget.mbContainer(12))
                            ),
                            BgWidget.mbContainer(240),
                            html` <div class="update-bar-container">
                                ${vm.data.id.length === 0
                                    ? ''
                                    : BgWidget.danger(
                                          gvc.event(() => {
                                              dialog.checkYesOrNot({
                                                  text: '確認要刪除此文本？',
                                                  callback: (bool) => {
                                                      if (bool) {
                                                          vm.dataList = vm.dataList.filter((item: any) => vm.data.id !== item.id);
                                                          ApiUser.setPublicConfig({
                                                              key: 'text-manager',
                                                              user_id: 'manager',
                                                              value: vm.dataList,
                                                          }).then((result) => {
                                                              if (!result.response.result) {
                                                                  dialog.errorMessage({ text: '設定失敗' });
                                                              }
                                                              vm.type = 'list';
                                                          });
                                                      }
                                                  },
                                              });
                                          })
                                      )}
                                ${BgWidget.cancel(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.save(
                                    gvc.event(() => {
                                        vm.data.updated_time = glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                                        if (vm.data.id.length === 0) {
                                            vm.data.id = Tool.randomString(10);
                                            vm.dataList.push(vm.data);
                                        } else {
                                            vm.dataList[vm.dataList.findIndex((item: { id: string }) => item.id === vm.data.id)] = vm.data;
                                        }
                                        dialog.dataLoading({ text: '設定中...', visible: true });
                                        ApiUser.setPublicConfig({
                                            key: 'text-manager',
                                            user_id: 'manager',
                                            value: vm.dataList,
                                        }).then((result) => {
                                            dialog.dataLoading({ visible: false });
                                            if (result.response.result) {
                                                dialog.successMessage({ text: '設定成功' });
                                                setTimeout(() => {
                                                    vm.type = 'list';
                                                }, 200);
                                            } else {
                                                dialog.errorMessage({ text: '設定失敗' });
                                            }
                                        });
                                    })
                                )}
                            </div>`,
                        ].join('')
                    );
                }
                return BgWidget.container(BgWidget.mainCard(html`<div>tag_edit</div>`));
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ProductText);
