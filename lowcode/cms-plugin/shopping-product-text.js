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
            labelList: [],
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
                var _a;
                if (vm.type === 'list') {
                    function getTextList(list) {
                        return list.map((item) => {
                            const ids = [gvc.glitter.getUUID(), gvc.glitter.getUUID()];
                            return [
                                {
                                    key: '標籤名稱',
                                    value: item.title,
                                },
                                {
                                    key: '最後更新時間',
                                    value: gvc.bindView({
                                        bind: ids[0],
                                        view: () => {
                                            if (!item.updated_time) {
                                                return '尚無更新紀錄';
                                            }
                                            return glitter.ut.dateFormat(new Date(item.updated_time), 'yyyy-MM-dd hh:mm:ss');
                                        },
                                    }),
                                },
                            ];
                        });
                    }
                    function getLabelList(list) {
                        return list.map((item) => {
                            const ids = [gvc.glitter.getUUID(), gvc.glitter.getUUID()];
                            return [
                                {
                                    key: '標籤名稱',
                                    value: item.title,
                                },
                                {
                                    key: '標籤樣式',
                                    value: item.data.shape,
                                },
                                {
                                    key: '標籤位置',
                                    value: item.data.position,
                                },
                                {
                                    key: '標籤顏色',
                                    value: html ` <div style="background: ${item.data.label_color};width: 26px;height: 26px;"></div> `,
                                },
                            ];
                        });
                    }
                    function getHtml() {
                        return BgWidget.mainCard([
                            html ` <div class="d-flex align-items-center gap-2 ms-1 mb-3">
                                    <div class="tx_700">商品促銷標籤</div>
                                    ${BgWidget.questionButton(gvc.event(() => {
                                BgWidget.quesDialog({
                                    gvc,
                                    innerHTML: () => {
                                        return html `
                                                        <div
                                                            style="width:100%;border-radius: 10px;background: #393939;display: flex;padding: 10px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 16px;"
                                                        >
                                                            <div class="tx_normal text-wrap text-white">
                                                                顯示於商品卡片上方，用於突出推廣特定商品，例如「熱賣中」、「特價」等，以便消費者快速識別商品狀態，提升購物吸引力。
                                                            </div>
                                                            <div class="w-100" style="width: 182.681px;height: 225.135px;flex-shrink: 0;">
                                                                <img
                                                                    style="width: 182.681px;height: 225.135px;flex-shrink: 0;"
                                                                    src="https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s4s0sbs5s5sbs6se_messageImage_1730260643019.jpg"
                                                                />
                                                            </div>
                                                        </div>
                                                    `;
                                    },
                                });
                            }))}
                                </div>`,
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiUser.getPublicConfig('promo-label', 'manager').then((data) => {
                                        vm.labelList = (() => {
                                            return data.response.value == '' ? [] : data.response.value;
                                        })();
                                        vmi.originalData = vm.labelList;
                                        vmi.tableData = getLabelList(vm.labelList);
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => {
                                    vm.data = vm.labelList[index];
                                    vm.type = 'label_edit';
                                },
                                filter: [
                                    {
                                        name: '批量刪除',
                                        event: (checkedData) => {
                                            dialog.checkYesOrNot({
                                                text: '確認要刪除已勾選的文本？',
                                                callback: (bool) => {
                                                    if (bool) {
                                                        vm.labelList = vm.labelList.filter((item) => {
                                                            return checkedData.findIndex((d) => d.id === item.id) === -1;
                                                        });
                                                        ApiUser.setPublicConfig({
                                                            key: 'promo-label',
                                                            user_id: 'manager',
                                                            value: vm.labelList,
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
                            html ` <div
                                    class="w-100 d-flex justify-content-center align-items-center gap-2 cursor_pointer"
                                    style="color: #3366BB"
                                    onclick="${gvc.event(() => {
                                vm.data = getExample();
                                vm.type = 'label_edit';
                            })}"
                                >
                                    <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">新增一個標籤</div>
                                    <i class="fa-solid fa-plus"></i>
                                </div>`,
                        ].join(''));
                    }
                    return BgWidget.container([
                        BgWidget.mainCard([
                            html ` <div class="d-flex align-items-center gap-2 ms-1 mb-3">
                                        <div class="tx_700">商品文本</div>
                                        ${BgWidget.questionButton(gvc.event(() => {
                                BgWidget.quesDialog({
                                    gvc,
                                    innerHTML: () => {
                                        return html `
                                                            <div
                                                                style="display: flex;padding: 20px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 16px;border-radius: 10px;background: #393939;"
                                                            >
                                                                <div class="tx_normal text-wrap text-white">
                                                                    可在商品頁面展示多個自訂文本分頁，如商品規格、退換貨政策等，並能自由選擇每個文本的顯示內容是否統一，提升管理靈活性。
                                                                </div>
                                                                <div class="w-100 border border-1">
                                                                    <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/s348251.png" />
                                                                </div>
                                                            </div>
                                                        `;
                                    },
                                });
                            }))}
                                    </div>`,
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiUser.getPublicConfig('text-manager', 'manager').then((data) => {
                                        vm.dataList = (() => {
                                            return data.response.value == '' ? [] : data.response.value;
                                        })();
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
                            html ` <div
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
                        ].join('')),
                        html ` <div style="margin-top: 15px;"></div>`,
                        getHtml(),
                    ].join(''));
                }
                const targetText = (text) => `#${text}#`;
                function originRichtext(text) {
                    let gText = `${text}`;
                    if (vm.data.data.tags && vm.data.data.tags.length > 0) {
                        const tempElement = document.createElement('div');
                        tempElement.innerHTML = gText;
                        for (const item of vm.data.data.tags) {
                            const regex = new RegExp(targetText(item.title), 'g');
                            gText = gText.replace(regex, `@{{${item.key}}}`);
                        }
                    }
                    return gText;
                }
                function generateRichtext(text) {
                    let gText = `${text}`;
                    if (vm.data.data.tags && vm.data.data.tags.length > 0) {
                        for (const item of vm.data.data.tags) {
                            const textImage = targetText(item.title);
                            const regex = new RegExp(`@{{${item.key}}}`, 'g');
                            gText = gText.replace(regex, textImage);
                        }
                    }
                    return gText;
                }
                function editDocumentTag(index) {
                    const item = vm.data.data.tags[index];
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
                            event: () => {
                                return new Promise((resolve) => {
                                    const sameTitleItem = vm.data.data.tags.findIndex((tag) => tag.title === item.title);
                                    if (sameTitleItem !== index && sameTitleItem !== -1) {
                                        dialog.errorMessage({
                                            text: html `<div class="text-center">標籤名稱「${item.title}」已存在<br />請更換一個標籤名稱</div>`,
                                        });
                                        resolve(false);
                                    }
                                    else {
                                        gvc.notifyDataChange([ids.tag, ids.content]);
                                        resolve(true);
                                    }
                                });
                            },
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
                                                                        ${gvc.map(vm.data.data.tags.map((item, index) => {
                                                return html ` <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                                                                                    ${item.title}
                                                                                    <div class="d-flex gap-3">
                                                                                        <i
                                                                                            class="fa-regular fa-copy cursor_pointer"
                                                                                            onclick="${gvc.event(() => {
                                                    navigator.clipboard.writeText(targetText(item.title));
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
                                                    editDocumentTag(index);
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
                                                    const limit = 30;
                                                    const defaultLabel = '新標籤';
                                                    if (vm.data.data.tags.length + 1 > limit) {
                                                        dialog.errorMessage({
                                                            text: `標籤上限為${limit}個`,
                                                        });
                                                        return;
                                                    }
                                                    function getNextLabel() {
                                                        const existingLabels = vm.data.data.tags.slice();
                                                        const labels = existingLabels.map((label) => label.title);
                                                        const numbers = Array.from({ length: limit }, (_, i) => {
                                                            return (i + 1).toString().padStart(2, '0');
                                                        });
                                                        for (const n of numbers) {
                                                            const label = labels.find((label) => label === `${defaultLabel}${n}`);
                                                            if (!label)
                                                                return `${defaultLabel}${n}`;
                                                        }
                                                        return `${defaultLabel}${vm.data.data.tags.length + 1}`;
                                                    }
                                                    vm.data.data.tags.push({
                                                        key: Tool.randomString(16),
                                                        title: getNextLabel(),
                                                        font_size: '16',
                                                        font_color: '#393939',
                                                        font_bgr: '#FFFFFF',
                                                    });
                                                    gvc.notifyDataChange(ids.tag);
                                                    editDocumentTag(vm.data.data.tags.length - 1);
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
                            if (vm.data.data.tags) {
                                for (const tag of vm.data.data.tags) {
                                    if (!vm.data.data.content.includes(`@{{${tag.key}}}`)) {
                                        dialog.errorMessage({ text: `標籤名「${tag.title}」尚未使用<br />請加入至文本或刪除標籤` });
                                        return;
                                    }
                                }
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
                if (vm.type === 'label_edit') {
                    function drawColorInput(title, key) {
                        const id = gvc.glitter.getUUID();
                        const inputClass = gvc.glitter.getUUID();
                        return gvc.bindView({
                            bind: id,
                            view: () => {
                                var _a, _b, _c, _d;
                                vm.data.data['label_color'] = (_a = vm.data.data['label_color']) !== null && _a !== void 0 ? _a : '#393939';
                                vm.data.data['text_color'] = (_b = vm.data.data['text_color']) !== null && _b !== void 0 ? _b : '#FFFFFF';
                                return html `
                                    <div style="font-size: 16px;font-style: normal;font-weight: 400;color:#393939;">${title}</div>
                                    <div
                                        class="d-flex "
                                        style="padding: 12px 10px;gap: 10px;cursor: pointer;border-radius: 7px;border: 1px solid #DDD;"
                                        onclick="${gvc.event(() => {
                                    document.querySelector(`.${inputClass}`).click();
                                })}"
                                    >
                                        <input
                                            class="d-none ${inputClass}"
                                            value="${vm.data.data[key]}"
                                            type="color"
                                            onchange="${gvc.event((e) => {
                                    vm.data.data[key] = e.value;
                                    gvc.notifyDataChange([id, 'drawPreview']);
                                })}"
                                        />
                                        <div style="width: 24px;height: 24px;flex-shrink: 0;border-radius: 3px;background: ${(_c = vm.data.data[key]) !== null && _c !== void 0 ? _c : '#393939'};border: 1px solid #393939;"></div>
                                        <div style="color: #393939;font-size: 16px; font-weight: 400; ">${(_d = vm.data.data[key]) !== null && _d !== void 0 ? _d : '#393939'}</div>
                                    </div>
                                `;
                            },
                            divCreate: {
                                class: 'd-flex flex-column',
                                style: 'gap:8px;',
                            },
                        });
                    }
                    function drawShapeInput(title) {
                        const id = gvc.glitter.getUUID();
                        const inputClass = gvc.glitter.getUUID();
                        return gvc.bindView({
                            bind: id,
                            view: () => {
                                var _a;
                                let shapeArray = [
                                    {
                                        title: '矩形',
                                        shape: html `
                                            <svg width="64" height="30" viewBox="0 0 64 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect y="0.666016" width="64" height="29.3333" rx="1.33333" fill="#D2D2D2" />
                                            </svg>
                                        `,
                                    },
                                    {
                                        title: '橢圓',
                                        shape: html `
                                            <svg width="64" height="30" viewBox="0 0 64 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect y="0.666016" width="64" height="29.3333" rx="14.6667" fill="#D2D2D2" />
                                            </svg>
                                        `,
                                    },
                                    {
                                        title: '標籤',
                                        shape: html `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M14.0064 19C13.6114 19 13.2366 19.1752 12.9833 19.4784L0.310174 34.6451C-0.103392 35.14 -0.103391 35.86 0.310175 36.3549L12.9833 51.5216C13.2366 51.8248 13.6114 52 14.0064 52H70.2625C70.9988 52 71.5958 51.403 71.5958 50.6667V20.3333C71.5958 19.597 70.9988 19 70.2625 19H14.0064ZM12.3281 39C14.2611 39 15.8281 37.433 15.8281 35.5C15.8281 33.567 14.2611 32 12.3281 32C10.3951 32 8.82812 33.567 8.82812 35.5C8.82812 37.433 10.3951 39 12.3281 39Z"
                                                    fill="#D9D9D9"
                                                />
                                            </svg>
                                        `,
                                    },
                                    {
                                        title: '彩帶(橫)',
                                        shape: html `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
                                                <path
                                                    d="M0 21C0 20.1716 0.671573 19.5 1.5 19.5H68.4945C69.8141 19.5 70.4907 21.0812 69.5795 22.0357L57.2386 34.9643C56.6853 35.5439 56.6853 36.4561 57.2386 37.0357L69.5795 49.9643C70.4907 50.9188 69.8141 52.5 68.4945 52.5H1.5C0.671571 52.5 0 51.8284 0 51V21Z"
                                                    fill="#D9D9D9"
                                                />
                                            </svg>
                                        `,
                                    },
                                    {
                                        title: '彩帶(直)',
                                        shape: html `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
                                                <path
                                                    d="M50.5 -6.55671e-08C51.3284 -2.93554e-08 52 0.671573 52 1.5L52 68.4945C52 69.8141 50.4188 70.4907 49.4643 69.5795L36.5357 57.2386C35.9561 56.6853 35.0439 56.6853 34.4643 57.2386L21.5357 69.5795C20.5812 70.4907 19 69.8141 19 68.4945L19 1.5C19 0.67157 19.6716 -1.41312e-06 20.5 -1.37691e-06L50.5 -6.55671e-08Z"
                                                    fill="#D9D9D9"
                                                />
                                            </svg>
                                        `,
                                    },
                                    {
                                        title: '圓形',
                                        shape: html `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
                                                <circle cx="37.333" cy="36" r="28" fill="#D9D9D9" />
                                            </svg>
                                        `,
                                    },
                                    {
                                        title: '梯形',
                                        shape: html `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
                                                <path d="M33.6632 4H68L4 68V33.6632L33.6632 4Z" fill="#D9D9D9" />
                                            </svg>
                                        `,
                                    },
                                ];
                                vm.data.data.shape = (_a = vm.data.data.shape) !== null && _a !== void 0 ? _a : '矩形';
                                return html `
                                    <div style="font-size: 16px;font-weight: 400;">${title}</div>
                                    <div style="font-size: 14px;font-weight: 400;color: #8D8D8D;">梯形與圓形字數建議不要超過 3 個</div>
                                    ${gvc.bindView({
                                    bind: 'shape',
                                    view: () => {
                                        return shapeArray
                                            .map((data) => {
                                            return html `
                                                        <div style="display: flex;flex-direction: column;align-items: center;gap: 8px;">
                                                            <div class="d-flex align-items-center justify-content-center" style="width: 80px;height: 80px;">${data.shape}</div>
                                                            <div
                                                                class="d-flex align-items-center justify-content-center"
                                                                style="font-size: 16px;font-style: normal;font-weight: 400;gap: 6px;cursor:pointer;"
                                                                onclick="${gvc.event(() => {
                                                vm.data.data.shape = data.title;
                                                gvc.notifyDataChange(['shape', 'drawPreview']);
                                            })}"
                                                            >
                                                                ${vm.data.data.shape == data.title
                                                ? html `<div style="width: 16px;height: 16px;border-radius: 20px;border:4px solid #393939;"></div>`
                                                : html `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;background: #FFF;"></div>`}
                                                                ${data.title}
                                                            </div>
                                                        </div>
                                                    `;
                                        })
                                            .join('');
                                    },
                                    divCreate: { class: 'w-100 d-flex flex-wrap', style: `gap:42px;` },
                                })}
                                `;
                            },
                            divCreate: {
                                class: 'd-flex flex-column',
                                style: 'gap:4px;',
                            },
                        });
                    }
                    function drawPreview() {
                        return gvc.bindView({
                            bind: `drawPreview`,
                            view: () => {
                                var _a, _b, _c, _d;
                                const position = ['左上', '右上', '左下', '右下'];
                                const color = (_a = vm.data.data.label_color) !== null && _a !== void 0 ? _a : '#393939';
                                const text = (_b = vm.data.title) !== null && _b !== void 0 ? _b : '熱賣中';
                                vm.data.data.position = (_c = vm.data.data.position) !== null && _c !== void 0 ? _c : '左上';
                                const labelPosition = vm.data.data.position;
                                let shapeArray = [
                                    {
                                        title: '矩形',
                                        shape: html `
                                            <div
                                                style="${labelPosition == '左上' || labelPosition == '右上' ? 'padding-top:' : 'padding-bottom:'}10px; ${labelPosition == '左上' ||
                                            labelPosition == '左下'
                                            ? 'padding-left:'
                                            : 'padding-right:'}10px;"
                                            >
                                                <div style="min-width: 49px;height:24px;background: ${color};position: relative;padding:5px 9px;">
                                                    <div style="color: ${vm.data.data.text_color};font-size: 10px;font-weight: 400;letter-spacing: 0.4px;">${text}</div>
                                                </div>
                                            </div>
                                        `,
                                    },
                                    {
                                        title: '橢圓',
                                        shape: html `
                                            <div
                                                style="${labelPosition == '左上' || labelPosition == '右上' ? 'padding-top:' : 'padding-bottom:'}10px; ${labelPosition == '左上' ||
                                            labelPosition == '左下'
                                            ? 'padding-left:'
                                            : 'padding-right:'}10px;"
                                            >
                                                <div style="min-width: 59px;height:24px;background: ${color};border-radius: 32px;padding:5px 14px;">
                                                    <div style="color: ${vm.data.data.text_color};font-size: 10px;font-weight: 400;letter-spacing: 0.4px;">${text}</div>
                                                </div>
                                            </div>
                                        `,
                                    },
                                    {
                                        title: '標籤',
                                        shape: html `
                                            <div
                                                style="${labelPosition == '左上' || labelPosition == '右上' ? 'padding-top:' : 'padding-bottom:'}9.57px; ${labelPosition == '左上' ||
                                            labelPosition == '左下'
                                            ? 'padding-left:'
                                            : 'padding-right:'}9.11px; position: relative;"
                                            >
                                                <div
                                                    style="position: absolute;right: ${labelPosition == '左上' || labelPosition == '左下' ? '9' : '19'}px;top: ${labelPosition == '左上' ||
                                            labelPosition == '右上'
                                            ? '17.5'
                                            : '7.5'}px;font-size: 10px;font-weight: 400;letter-spacing: 0.4px;color: ${vm.data.data.text_color}"
                                                >
                                                    ${text}
                                                </div>
                                                <svg class="" width="72" height="32" viewBox="0 0 69 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                                    <path
                                                        fill-rule="evenodd"
                                                        clip-rule="evenodd"
                                                        d="M14.4492 0C14.0593 0 13.6889 0.170677 13.4356 0.467093L4.31972 11.1338C3.89342 11.6326 3.89343 12.3674 4.31972 12.8662L13.4356 23.5329C13.6889 23.8293 14.0593 24 14.4492 24H66.2461C66.9825 24 67.5794 23.403 67.5794 22.6667V1.33333C67.5794 0.596954 66.9825 0 66.2461 0H14.4492ZM16.1178 15C17.7938 15 19.1523 13.6569 19.1523 12C19.1523 10.3431 17.7938 9 16.1178 9C14.4419 9 13.0833 10.3431 13.0833 12C13.0833 13.6569 14.4419 15 16.1178 15Z"
                                                        fill="${color}"
                                                    />
                                                </svg>
                                            </div>
                                        `,
                                    },
                                    {
                                        title: '彩帶(橫)',
                                        shape: html `
                                            <div
                                                style="${labelPosition == '左上' || labelPosition == '右上' ? 'padding-top:' : 'padding-bottom:'}9.57px; ${labelPosition == '左上' ||
                                            labelPosition == '左下'
                                            ? 'padding-left:'
                                            : 'padding-right:'}9.11px;position: relative;"
                                            >
                                                <div
                                                    style="position: absolute;left: ${labelPosition == '左上' || labelPosition == '左下' ? '21' : '11'}px;top: ${labelPosition == '左上' ||
                                            labelPosition == '右上'
                                            ? '13.5'
                                            : '3.5'}px;font-size: 10px;font-weight: 400;letter-spacing: 0.4px;color: ${vm.data.data.text_color}"
                                                >
                                                    ${text}
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="71" height="32" viewBox="0 0 71 32" fill="none">
                                                    <g filter="url(#filter0_d_14130_223497)">
                                                        <path
                                                            d="M4.54297 1.5C4.54297 0.671573 5.21454 0 6.04297 0H65.3404C66.6122 0 67.3069 1.48329 66.4927 2.46028L59.3432 11.0397C58.8796 11.596 58.8796 12.404 59.3432 12.9603L66.4927 21.5397C67.3069 22.5167 66.6122 24 65.3404 24H6.04297C5.21454 24 4.54297 23.3284 4.54297 22.5V1.5Z"
                                                            fill="${color}"
                                                        />
                                                    </g>
                                                </svg>
                                            </div>
                                        `,
                                    },
                                    {
                                        title: '彩帶(直)',
                                        shape: html `
                                            <div
                                                style="${labelPosition == '左上' || labelPosition == '右上' ? 'padding-top:' : 'padding-bottom:'} 9.57px;${labelPosition == '左上' ||
                                            labelPosition == '左下'
                                            ? 'padding-left:'
                                            : 'padding-right:'} 9.11px;position: relative;"
                                            >
                                                <div
                                                    style="position: absolute;left: ${labelPosition == '左上' || labelPosition == '左下' ? '17.5' : '7.5'}px;top: ${labelPosition == '左上' ||
                                            labelPosition == '右上'
                                            ? '17.5'
                                            : '7.5'}px;font-size: 10px;font-weight: 400;letter-spacing: 0.4px;color: ${vm.data.data.text_color};writing-mode: vertical-lr;"
                                                >
                                                    ${text}
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="71" viewBox="0 0 33 71" fill="none">
                                                    <g filter="url(#filter0_d_14130_223503)">
                                                        <path
                                                            d="M27.043 -0.00195319C27.8714 -0.00195315 28.543 0.66962 28.543 1.49805L28.543 60.7955C28.543 62.0672 27.0597 62.762 26.0827 61.9478L17.5032 54.7983C16.947 54.3347 16.139 54.3347 15.5827 54.7983L7.00324 61.9478C6.02625 62.762 4.54297 62.0672 4.54297 60.7955L4.54297 1.49805C4.54297 0.669619 5.21454 -0.00195414 6.04297 -0.00195411L27.043 -0.00195319Z"
                                                            fill="${color}"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <filter
                                                            id="filter0_d_14130_223503"
                                                            x="0.542969"
                                                            y="-0.00195312"
                                                            width="32"
                                                            height="70.3008"
                                                            filterUnits="userSpaceOnUse"
                                                            color-interpolation-filters="sRGB"
                                                        >
                                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                            <feOffset dy="4" />
                                                            <feGaussianBlur stdDeviation="2" />
                                                            <feComposite in2="hardAlpha" operator="out" />
                                                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14130_223503" />
                                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14130_223503" result="shape" />
                                                        </filter>
                                                    </defs>
                                                </svg>
                                            </div>
                                        `,
                                    },
                                    {
                                        title: '圓形',
                                        shape: html `
                                            <div
                                                style="${labelPosition == '左上' || labelPosition == '右上' ? 'padding-top:' : 'padding-bottom:'} 9.57px;${labelPosition == '左上' ||
                                            labelPosition == '左下'
                                            ? 'padding-left:'
                                            : 'padding-right:'} 9.11px;"
                                            >
                                                <div
                                                    class=" align-items-center justify-content-center"
                                                    style="display: inline-flex; width: 46px;height: 46px;flex-shrink: 0;background-color: ${color};border-radius: 50%;color: ${vm.data.data
                                            .text_color};font-size: 10px;font-weight: 400;letter-spacing: 0.4px;"
                                                >
                                                    ${text}
                                                </div>
                                            </div>
                                        `,
                                    },
                                    {
                                        title: '梯形',
                                        shape: (() => {
                                            switch (labelPosition) {
                                                case '左上': {
                                                    return html `
                                                        <div style="display: inline-block;position: relative;">
                                                            <div
                                                                style="position: absolute;left: 5px;top: 13.5px;font-size: 10px;font-weight: 400;letter-spacing: 0.4px;color: ${vm.data.data
                                                        .text_color};transform: rotate(-44.938deg);"
                                                            >
                                                                ${text}
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="66" viewBox="0 0 62 66" fill="none">
                                                                <g filter="url(#filter0_d_14130_126851)">
                                                                    <path d="M26.8833 0H58.001L0.000976562 58V26.8823L26.8833 0Z" fill="${color}" />
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_d_14130_126851"
                                                                        x="-3.99902"
                                                                        y="0"
                                                                        width="66"
                                                                        height="66"
                                                                        filterUnits="userSpaceOnUse"
                                                                        color-interpolation-filters="sRGB"
                                                                    >
                                                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                        <feOffset dy="4" />
                                                                        <feGaussianBlur stdDeviation="2" />
                                                                        <feComposite in2="hardAlpha" operator="out" />
                                                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14130_126851" />
                                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14130_126851" result="shape" />
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                    `;
                                                }
                                                case '左下': {
                                                    return html `
                                                        <div style="display: inline-block;position: relative;min-height:79px;">
                                                            <div
                                                                style="position: absolute;left: 5px;bottom: 13.5px;font-size: 10px;font-weight: 400;letter-spacing: 0.4px;color: ${vm.data.data
                                                        .text_color};transform: rotate(45deg);"
                                                            >
                                                                ${text}
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
                                                                <g filter="url(#filter0_d_14378_119252)">
                                                                    <path d="M26.8823 58H58L0 0V31.1177L26.8823 58Z" fill="${color}" />
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_d_14378_119252"
                                                                        x="-4"
                                                                        y="0"
                                                                        width="66"
                                                                        height="66"
                                                                        filterUnits="userSpaceOnUse"
                                                                        color-interpolation-filters="sRGB"
                                                                    >
                                                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                        <feOffset dy="4" />
                                                                        <feGaussianBlur stdDeviation="2" />
                                                                        <feComposite in2="hardAlpha" operator="out" />
                                                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14378_119252" />
                                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14378_119252" result="shape" />
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                    `;
                                                }
                                                case '右上': {
                                                    return html `
                                                        <div style="display: inline-block;position: relative;min-height:79px;">
                                                            <div
                                                                style="position: absolute;right: 5px;top: 13.5px;font-size: 10px;font-weight: 400;letter-spacing: 0.4px;color: ${vm.data.data
                                                        .text_color};transform: rotate(45deg);"
                                                            >
                                                                ${text}
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="63" height="66" viewBox="0 0 63 66" fill="none">
                                                                <g filter="url(#filter0_d_14378_119247)">
                                                                    <path d="M35.1177 0H4L62 58V26.8823L35.1177 0Z" fill="${color}" />
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_d_14378_119247"
                                                                        x="0"
                                                                        y="0"
                                                                        width="66"
                                                                        height="66"
                                                                        filterUnits="userSpaceOnUse"
                                                                        color-interpolation-filters="sRGB"
                                                                    >
                                                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                        <feOffset dy="4" />
                                                                        <feGaussianBlur stdDeviation="2" />
                                                                        <feComposite in2="hardAlpha" operator="out" />
                                                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14378_119247" />
                                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14378_119247" result="shape" />
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                    `;
                                                }
                                                default: {
                                                    return html `
                                                        <div style="display: inline-block;position: relative;min-height:79px;">
                                                            <div
                                                                style="position: absolute;right: 5px;bottom: 13.5px;font-size: 10px;font-weight: 400;letter-spacing: 0.4px;color: ${vm.data.data
                                                        .text_color};transform: rotate(-45deg);"
                                                            >
                                                                ${text}
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none">
                                                                <g filter="url(#filter0_d_14378_119257)">
                                                                    <path d="M35.1177 58H4L62 0V31.1177L35.1177 58Z" fill="${color}" />
                                                                </g>
                                                                <defs>
                                                                    <filter
                                                                        id="filter0_d_14378_119257"
                                                                        x="0"
                                                                        y="0"
                                                                        width="66"
                                                                        height="66"
                                                                        filterUnits="userSpaceOnUse"
                                                                        color-interpolation-filters="sRGB"
                                                                    >
                                                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                        <feOffset dy="4" />
                                                                        <feGaussianBlur stdDeviation="2" />
                                                                        <feComposite in2="hardAlpha" operator="out" />
                                                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14378_119257" />
                                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14378_119257" result="shape" />
                                                                    </filter>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                    `;
                                                }
                                            }
                                        })(),
                                    },
                                ];
                                const labelHTML = (_d = shapeArray.find((shape) => {
                                    return shape.title == vm.data.data.shape;
                                })) === null || _d === void 0 ? void 0 : _d.shape;
                                vm.data.data.content = labelHTML !== null && labelHTML !== void 0 ? labelHTML : '';
                                return html `
                                    <div
                                        class="w-100 w-lg-50"
                                        style="display: flex;height: 270px;justify-content: center;align-items: center;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                                    >
                                        <div class="d-flex flex-wrap" style="height: 178px;width: 178px;">
                                            ${position
                                    .map((data, index) => {
                                    if (vm.data.data.position == data) {
                                        return html `
                                                            <div
                                                                class="d-flex align-items-center justify-content-center"
                                                                style="width: 89px;height: 89px;border: 1px solid rgba(205, 205, 205, 0.87);background: #393939;color: #FFF;font-size: 16px;font-weight: 400;"
                                                            >
                                                                ${data}
                                                            </div>
                                                        `;
                                    }
                                    return html `
                                                        <div
                                                            class=""
                                                            style="width: 89px;height: 89px;border: 1px solid rgba(205, 205, 205, 0.87);background: #EAEAEA;"
                                                            onclick="${gvc.event(() => {
                                        vm.data.data.position = data;
                                        gvc.notifyDataChange('drawPreview');
                                    })}"
                                                        ></div>
                                                    `;
                                })
                                    .join('')}
                                        </div>
                                    </div>
                                    <div
                                        class="w-100 w-lg-50"
                                        style="display: flex;padding: 14px 114px 13.713px 113px;justify-content: center;align-items: center;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                                    >
                                        <div
                                            class=""
                                            style="padding: 11.67px;border-radius: 2px;border: 1px solid #DDD;background: #FFF;display: flex;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;"
                                        >
                                            <div
                                                class="d-flex flex-column align-items-center position-relative"
                                                style="width:178px;height: 178px;padding-top: 10px;border-radius: 2px;background-image: url('https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_sdsfs9sbs5ses7sb_Frame127.png')"
                                            >
                                                <div
                                                    style="position:absolute;${vm.data.data.position == '左上' || vm.data.data.position == '左下' ? 'left' : 'right'}: 0;${vm.data.data.position ==
                                    '左上' || vm.data.data.position == '右上'
                                    ? 'top'
                                    : 'bottom'}: 0;z-index:2;"
                                                >
                                                    ${labelHTML}
                                                </div>
                                                <div
                                                    style="position: absolute;top: 9.75px;right: 9.94px;;display: flex;width: 25.285px;height: 25.285px;padding: 7.779px 7.778px 7.781px 7.782px;justify-content: center;align-items: center;flex-shrink: 0;border-radius: 58.351px;background: #FFF;box-shadow: 3.89px 1.945px 9.725px 0px rgba(0, 0, 0, 0.15);"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                                        <g clip-path="url(#clip0_14130_223540)">
                                                            <path
                                                                d="M5.07214 9.6716L5.02465 9.62791L1.69683 6.53753C1.11371 5.99618 0.783203 5.23641 0.783203 4.44054V4.37786C0.783203 3.04066 1.73292 1.8934 3.04733 1.64267C3.79571 1.49831 4.56119 1.67116 5.17091 2.10043C5.34186 2.222 5.50141 2.36256 5.64577 2.52401C5.72554 2.43284 5.81102 2.34926 5.90219 2.27138C5.97247 2.2106 6.04465 2.15362 6.12063 2.10043C6.73035 1.67116 7.49582 1.49831 8.2442 1.64077C9.55861 1.8915 10.5083 3.04066 10.5083 4.37786V4.44054C10.5083 5.23641 10.1778 5.99618 9.5947 6.53753L6.26688 9.62791L6.2194 9.6716C6.06364 9.81596 5.8585 9.89763 5.64577 9.89763C5.43303 9.89763 5.22789 9.81786 5.07214 9.6716ZM5.32476 3.53261C5.31716 3.52691 5.31147 3.51932 5.30577 3.51172L4.96767 3.13183L4.96577 3.12993C4.527 2.63798 3.86409 2.41384 3.21828 2.53731C2.33315 2.70636 1.69493 3.47753 1.69493 4.37786V4.44054C1.69493 4.98188 1.92097 5.50043 2.31795 5.86892L5.64577 8.95931L8.97359 5.86892C9.37057 5.50043 9.5966 4.98188 9.5966 4.44054V4.37786C9.5966 3.47943 8.95839 2.70636 8.07515 2.53731C7.42934 2.41384 6.76454 2.63988 6.32767 3.12993C6.32767 3.12993 6.32767 3.12993 6.32577 3.13183C6.32387 3.13373 6.32577 3.13183 6.32387 3.13373L5.98577 3.51362C5.98007 3.52122 5.97247 3.52691 5.96677 3.53451C5.8813 3.61999 5.76543 3.66747 5.64577 3.66747C5.5261 3.66747 5.41024 3.61999 5.32476 3.53451V3.53261Z"
                                                                fill="#393939"
                                                            />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_14130_223540">
                                                                <rect width="9.72513" height="9.72513" fill="white" transform="translate(0.782227 0.779297)" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div style="display: flex;flex-direction: column;gap: 5.835px;color:#393939;font-size: 9.725px;font-weight: 400;letter-spacing: 0.389px;">
                                                <div style="">商品名稱</div>
                                                <div style="">NT.$ 99</div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            },
                            divCreate: { style: `display: flex;align-items: flex-start;gap: 18px;align-self: stretch;`, class: `flex-column flex-lg-row` },
                        });
                    }
                    return BgWidget.container([
                        html ` <div class="title-container">
                                ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                                ${BgWidget.title(vm.data.title || '新增商品促銷標籤')}
                                <div class="flex-fill"></div>
                            </div>`,
                        BgWidget.container([
                            BgWidget.mainCard(BgWidget.editeInput({
                                gvc: gvc,
                                title: '標籤文字',
                                default: (_a = vm.data.title) !== null && _a !== void 0 ? _a : '',
                                placeHolder: '請輸入標籤文字',
                                callback: (text) => {
                                    vm.data.title = text;
                                    gvc.notifyDataChange('drawPreview');
                                },
                            })),
                            BgWidget.mainCard(html `
                                            <div class="d-flex flex-column" style="gap: 18px;">
                                                ${BgWidget.title('標籤樣式')} ${drawColorInput('標籤顏色', 'label_color')} ${drawColorInput('文字顏色', 'text_color')} ${drawShapeInput('標籤形狀')}
                                            </div>
                                        `),
                            BgWidget.mainCard(html ` <div class="d-flex flex-column" style="gap: 18px;">${BgWidget.title('標籤位置')} ${drawPreview()}</div> `),
                        ].join(BgWidget.mbContainer(12))),
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                                ${vm.data.id.length === 0
                            ? ''
                            : BgWidget.danger(gvc.event(() => {
                                dialog.checkYesOrNot({
                                    text: '確認要刪除此標籤？',
                                    callback: (bool) => {
                                        if (bool) {
                                            vm.labelList = vm.labelList.filter((item) => vm.data.id !== item.id);
                                            ApiUser.setPublicConfig({
                                                key: 'promo-label',
                                                user_id: 'manager',
                                                value: vm.labelList,
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
                            vm.data.updated_time = glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                            if (vm.data.id.length === 0) {
                                vm.data.id = Tool.randomString(10);
                                vm.labelList.push(vm.data);
                            }
                            else {
                                vm.labelList[vm.labelList.findIndex((item) => item.id === vm.data.id)] = vm.data;
                            }
                            dialog.dataLoading({ text: '設定中...', visible: true });
                            ApiUser.setPublicConfig({
                                key: 'promo-label',
                                user_id: 'manager',
                                value: vm.labelList,
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
                return BgWidget.container(BgWidget.mainCard(html ` <div>tag_edit</div>`));
            },
        });
    }
}
window.glitter.setModule(import.meta.url, ProductText);
