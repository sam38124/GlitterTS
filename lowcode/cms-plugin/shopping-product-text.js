import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { Tool } from '../modules/tool.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { CheckInput } from '../modules/checkInput.js';
const html = String.raw;
export class ProductText {
    static main(gvc) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        function getExample() {
            return {
                id: '',
                type: 'file',
                title: '',
                data: {
                    content: '',
                    tags: [],
                },
                status: false,
                updated_time: '',
            };
        }
        const vm = {
            id: glitter.getUUID(),
            type: 'list',
            dataList: [],
            data: getExample(),
        };
        const ids = {
            content: glitter.getUUID(),
            tag: glitter.getUUID(),
        };
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    function getTextList(list) {
                        return list.map((item) => {
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
                            ];
                        });
                    }
                    return BgWidget.container(BgWidget.mainCard([
                        html `<div class="d-flex align-items-center gap-2 ms-1 mb-3">
                                    <div class="tx_700">商品文本</div>
                                    ${BgWidget.iconButton({
                            icon: 'question',
                            event: gvc.event(() => {
                                BgWidget.dialog({
                                    gvc,
                                    title: '提示',
                                    innerHTML: () => {
                                        return html `
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
                            }),
                        })}
                                </div>`,
                        BgWidget.tableV3({
                            gvc: gvc,
                            getData: (vmi) => {
                                ApiUser.getPublicConfig('text-manager', 'manager').then((data) => {
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
                                                    vm.dataList = vm.dataList.filter((item) => {
                                                        return checkedData.findIndex((d) => d.id === item.id) === -1;
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
                        BgWidget.plusButton({
                            title: '新增一個文本',
                            event: gvc.event(() => {
                                vm.data = getExample();
                                vm.type = 'text_edit';
                            }),
                        }),
                    ].join('')));
                }
                function originRichtext(text) {
                    let gText = `${text}`;
                    if (vm.data.data.tags && vm.data.data.tags.length > 0) {
                        const tempElement = document.createElement('div');
                        tempElement.innerHTML = gText;
                        for (const item of vm.data.data.tags) {
                            const imgElements = tempElement.querySelectorAll(`img[alt="${item.key}"]`);
                            if (imgElements.length > 0) {
                                imgElements.forEach((imgElement) => {
                                    const newText = document.createTextNode(`@{{${item.key}}}`);
                                    imgElement.parentNode.replaceChild(newText, imgElement);
                                });
                                gText = tempElement.innerHTML;
                            }
                        }
                    }
                    return gText;
                }
                function generateRichtext(text) {
                    let gText = `${text}`;
                    if (vm.data.data.tags && vm.data.data.tags.length > 0) {
                        for (const item of vm.data.data.tags) {
                            const textImage = html `<img
                                alt="${item.key}"
                                class="rounded-2"
                                src="https://assets.imgix.net/~text?bg=4d86db&txtclr=f2f2f2&w=${Tool.twenLength(item.title) *
                                20}&h=40&txtsize=12&txt=${item.title}&txtfont=Helvetica&txtalign=middle,center"
                            />`;
                            const regex = new RegExp(`@{{${item.key}}}`, 'g');
                            gText = gText.replace(regex, textImage);
                        }
                    }
                    return gText;
                }
                if (vm.type === 'text_edit') {
                    return BgWidget.container([
                        html ` <div class="title-container">
                                ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                                ${BgWidget.title(vm.data.title || '新增文本')}
                                <div class="flex-fill"></div>
                            </div>`,
                        BgWidget.container([
                            BgWidget.mainCard(BgWidget.editeInput({
                                gvc: gvc,
                                title: '文本標題',
                                default: vm.data.title,
                                placeHolder: '請輸入文本標題',
                                callback: (text) => {
                                    vm.data.title = text;
                                },
                            })),
                            BgWidget.container1x2({
                                html: BgWidget.mainCard(html `<div>
                                                    <div class="title-container px-0">
                                                        <div class="tx_normal fw-normal">文本說明</div>
                                                        <div class="flex-fill"></div>
                                                        ${BgWidget.aiChatButton({ gvc, select: 'writer' })}
                                                    </div>
                                                    <div style="margin: 8px 0">
                                                        ${gvc.bindView((() => {
                                    return {
                                        bind: ids.content,
                                        view: () => {
                                            return EditorElem.richText({
                                                gvc: gvc,
                                                def: generateRichtext(vm.data.data.content),
                                                callback: (text) => {
                                                    vm.data.data.content = originRichtext(text);
                                                },
                                            });
                                        },
                                        onCreate: () => {
                                            function pasteEvent() {
                                                setTimeout(() => {
                                                    gvc.notifyDataChange(ids.content);
                                                }, 10);
                                            }
                                            document.removeEventListener('paste', pasteEvent);
                                            document.addEventListener('paste', pasteEvent);
                                        },
                                    };
                                })())}
                                                    </div>
                                                </div>`),
                                ratio: 70,
                            }, {
                                html: gvc.bindView((() => {
                                    return {
                                        bind: ids.tag,
                                        view: () => {
                                            var _a;
                                            vm.data.data.tags = (_a = vm.data.data.tags) !== null && _a !== void 0 ? _a : [];
                                            return BgWidget.mainCard(html `<div>
                                                                    <div class="title-container px-0">
                                                                        <div class="tx_normal fw-normal">標籤</div>
                                                                    </div>
                                                                    <div style="margin: 12px 0">
                                                                        ${gvc.map(vm.data.data.tags.map((item) => {
                                                return html ` <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                                                                                    ${item.title}
                                                                                    <div class="d-flex gap-3">
                                                                                        <i
                                                                                            class="fa-regular fa-copy cursor_pointer"
                                                                                            onclick="${gvc.event(() => {
                                                    navigator.clipboard.writeText(`@{{${item.key}}}`);
                                                    BgWidget.jumpAlert({
                                                        gvc,
                                                        text: '複製成功',
                                                        justify: 'top',
                                                        align: 'center',
                                                    });
                                                })}"
                                                                                        ></i>
                                                                                        <i
                                                                                            class="fa-solid fa-pencil cursor_pointer"
                                                                                            onclick="${gvc.event(() => {
                                                    const originText = `${item.title}`;
                                                    BgWidget.dialog({
                                                        gvc,
                                                        title: '編輯標籤',
                                                        innerHTML: (gvc) => {
                                                            return html `<div>
                                                                                                            ${[
                                                                html `<div class="tx_normal">標籤名稱</div>`,
                                                                BgWidget.editeInput({
                                                                    gvc,
                                                                    title: '',
                                                                    default: item.title,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        item.title = text;
                                                                    },
                                                                }),
                                                                html `<div class="tx_normal mt-2">字體大小</div>`,
                                                                BgWidget.editeInput({
                                                                    gvc,
                                                                    title: '',
                                                                    default: item.font_size,
                                                                    type: 'number',
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        item.font_size = text;
                                                                    },
                                                                }),
                                                                html `<div class="tx_normal mt-2">字體顏色</div>`,
                                                                EditorElem.colorSelect({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    callback: (text) => {
                                                                        item.font_color = text;
                                                                        gvc.recreateView();
                                                                    },
                                                                    def: item.font_color,
                                                                }),
                                                                html `<div class="tx_normal mt-2">背景顏色</div>`,
                                                                EditorElem.colorSelect({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    callback: (text) => {
                                                                        item.font_bgr = text;
                                                                        gvc.recreateView();
                                                                    },
                                                                    def: item.font_bgr,
                                                                }),
                                                            ].join('')}
                                                                                                        </div>`;
                                                        },
                                                        save: {
                                                            event: () => new Promise((resolve) => {
                                                                gvc.notifyDataChange([ids.tag, ids.content]);
                                                                resolve(true);
                                                            }),
                                                        },
                                                        cancel: {
                                                            event: () => new Promise((resolve) => {
                                                                item.title = originText;
                                                                gvc.notifyDataChange(ids.tag);
                                                                resolve(true);
                                                            }),
                                                        },
                                                        xmark: () => new Promise((resolve) => {
                                                            item.title = originText;
                                                            gvc.notifyDataChange(ids.tag);
                                                            resolve(true);
                                                        }),
                                                    });
                                                })}"
                                                                                        ></i>
                                                                                        <i
                                                                                            class="fa-regular fa-trash cursor_pointer"
                                                                                            onclick="${gvc.event(() => {
                                                    if (vm.data.data.content.includes(`@{{${item.key}}}`)) {
                                                        dialog.warningMessage({
                                                            callback: (bool) => {
                                                                if (bool) {
                                                                    const regex = new RegExp(`@{{${item.key}}}`, 'g');
                                                                    vm.data.data.tags = vm.data.data.tags.filter((tag) => tag.key !== item.key);
                                                                    vm.data.data.content = vm.data.data.content.replace(regex, '');
                                                                    gvc.notifyDataChange([ids.tag, ids.content]);
                                                                }
                                                            },
                                                            text: `此操作將會移除文本內所有「${item.title}」的標籤<br/>確定要執行嗎？`,
                                                        });
                                                    }
                                                    else {
                                                        vm.data.data.tags = vm.data.data.tags.filter((tag) => tag.key !== item.key);
                                                        gvc.notifyDataChange([ids.tag, ids.content]);
                                                    }
                                                })}"
                                                                                        ></i>
                                                                                    </div>
                                                                                </div>`;
                                            }))}
                                                                    </div>
                                                                    ${BgWidget.plusButton({
                                                title: '新增一個標籤',
                                                event: gvc.event(() => {
                                                    vm.data.data.tags.push({
                                                        key: Tool.randomString(16),
                                                        title: '新標籤',
                                                        font_size: '16',
                                                        font_color: '#393939',
                                                        font_bgr: '#FFFFFF',
                                                    });
                                                    gvc.notifyDataChange(ids.tag);
                                                }),
                                            })}
                                                                </div>`);
                                        },
                                    };
                                })()),
                                ratio: 30,
                            }),
                        ].join(BgWidget.mbContainer(12))),
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                                ${vm.data.id.length === 0
                            ? ''
                            : BgWidget.danger(gvc.event(() => {
                                dialog.checkYesOrNot({
                                    text: '確認要刪除此文本？',
                                    callback: (bool) => {
                                        if (bool) {
                                            vm.dataList = vm.dataList.filter((item) => vm.data.id !== item.id);
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
                            }))}
                                ${BgWidget.cancel(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                                ${BgWidget.save(gvc.event(() => {
                            if (CheckInput.isEmpty(vm.data.title)) {
                                dialog.errorMessage({ text: '請輸入文本標題' });
                                return;
                            }
                            vm.data.updated_time = glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                            if (vm.data.id.length === 0) {
                                vm.data.id = Tool.randomString(10);
                                vm.dataList.push(vm.data);
                            }
                            else {
                                vm.dataList[vm.dataList.findIndex((item) => item.id === vm.data.id)] = vm.data;
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
                                }
                                else {
                                    dialog.errorMessage({ text: '設定失敗' });
                                }
                            });
                        }))}
                            </div>`,
                    ].join(''));
                }
                return BgWidget.container(BgWidget.mainCard(html `<div>tag_edit</div>`));
            },
        });
    }
}
window.glitter.setModule(import.meta.url, ProductText);
