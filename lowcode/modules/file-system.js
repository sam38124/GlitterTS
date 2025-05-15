var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
const html = String.raw;
export class FileSystem {
    static fileSystem(cf) {
        const gvc = cf.gvc;
        const vm = {
            id: cf.gvc.glitter.getUUID(),
            link: [],
            selected: false,
            loading: true,
            query: '',
            orderString: '',
            type: 'file',
        };
        function selectAll(array) {
            var _a;
            array.selected = true;
            array.items = (_a = array.items) !== null && _a !== void 0 ? _a : [];
            array.items.map((dd) => {
                dd.selected = true;
                selectAll(dd);
            });
        }
        function clearAll(array) {
            var _a;
            array.selected = false;
            array.items = (_a = array.items) !== null && _a !== void 0 ? _a : [];
            array.items.map((dd) => {
                dd.selected = false;
                clearAll(dd);
            });
        }
        function allSelect(dd) {
            return (!dd.items.find((d1) => {
                return !d1.selected;
            }) && dd.selected);
        }
        function getSelectCount(dd) {
            let count = 0;
            if (dd.selected && dd.type == vm.type) {
                count++;
            }
            dd.items.map((d1) => {
                count += getSelectCount(d1);
            });
            return count;
        }
        function deleteSelect(items) {
            return items.filter((d1) => {
                d1.items = deleteSelect(d1.items || []);
                return !d1.selected;
            });
        }
        BgWidget.settingDialog({
            gvc: gvc,
            title: cf.title,
            innerHTML: (gvc) => {
                ApiUser.getPublicConfig(cf.key, 'manager').then((data) => {
                    if (data.response.value) {
                        vm.link = data.response.value;
                        function loop(array) {
                            array.map((dd) => {
                                var _a;
                                if (dd.type === 'folder') {
                                    loop((_a = dd.items) !== null && _a !== void 0 ? _a : []);
                                }
                                if (cf.def.includes(dd.id)) {
                                    dd.selected = true;
                                }
                            });
                        }
                        loop(vm.link);
                        gvc.notifyDataChange(vm.id);
                    }
                });
                return gvc.bindView(() => {
                    return {
                        bind: vm.id,
                        view: () => __awaiter(this, void 0, void 0, function* () {
                            return html `
                                <div >
                                    <div style="width: 100%;  position: relative">
                                        <div style="width: 100%;  left: 0px; top: 0px;  flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                            <div
                                                class="w-100  ${getSelectCount({
                                items: vm.link,
                            }) > 0
                                ? ``
                                : `d-none`}"
                                                style="height: 40px; padding: 12px 18px;background: #F7F7F7; border-radius: 10px; justify-content: flex-end; align-items: center; gap: 8px; display: inline-flex"
                                            >
                                                <div style="flex: 1 1 0; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                                    已選取${getSelectCount({
                                items: vm.link,
                            })}項
                                                </div>
                                            </div>
                                            <div class="d-flex align-items-center" style="width: 100%; height: 22px; position: relative;gap:29px;">
                                                <div
                                                    class="${allSelect({
                                items: vm.link,
                                selected: !vm.link.find((dd) => {
                                    return !dd.selected;
                                }),
                            })
                                ? `fa-solid fa-square-check`
                                : `fa-regular fa-square`}"
                                                    style="color:#393939;width: 16px; height: 16px;cursor: pointer;"
                                                    onclick="${gvc.event((e, event) => {
                                event.stopPropagation();
                                if (vm.link.find((dd) => {
                                    return !dd.selected;
                                })) {
                                    selectAll({
                                        items: vm.link,
                                    });
                                }
                                else {
                                    clearAll({
                                        items: vm.link,
                                    });
                                }
                                gvc.notifyDataChange(vm.id);
                            })}"
                                                ></div>
                                                <div  style="left: 61px; top: 0px;  color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                                    選單名稱
                                                </div>
                                                <div class="flex-fill"></div>
                                                <div
                                                    class="me-2"
                                                    style="cursor: pointer;"
                                                    onclick="${gvc.event((e, event) => {
                                event.stopPropagation();
                                cf.plus(gvc, (file) => {
                                    vm.link.push(file);
                                    gvc.notifyDataChange(vm.id);
                                });
                            })}"
                                                >
                                                    <i class="fa-solid  fa-plus" style="color:#393939;"></i>
                                                </div>
                                            </div>
                                            <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
                                                ${(() => {
                                function renderItems(array) {
                                    const id = gvc.glitter.getUUID();
                                    return gvc.bindView(() => {
                                        return {
                                            bind: id,
                                            view: () => {
                                                return array
                                                    .map((dd, index) => {
                                                    const list = html `
                                                                                <div
                                                                                    class=" w-100 "
                                                                                    style="width: 100%; justify-content: flex-start; align-items: center; gap: 5px; display: inline-flex;cursor: pointer;"
                                                                                    onclick="${gvc.event(() => {
                                                        if (dd.items && dd.items.length > 0) {
                                                            dd.toggle = !dd.toggle;
                                                            gvc.notifyDataChange(vm.id);
                                                        }
                                                    })}"
                                                                                >
                                                                                    <div
                                                                                        class="${allSelect(dd) ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                        style="color:#393939;width: 16px; height: 16px;"
                                                                                        onclick="${gvc.event((e, event) => {
                                                        event.stopPropagation();
                                                        dd.selected = !dd.selected;
                                                        if (dd.selected) {
                                                            selectAll(dd);
                                                        }
                                                        else {
                                                            clearAll(dd);
                                                        }
                                                        gvc.notifyDataChange(vm.id);
                                                    })}"
                                                                                    ></div>
                                                                                    <div
                                                                                        class="hoverF2 pe-2 py-2"
                                                                                        style="width: 100%;  justify-content: flex-start; align-items: center; gap: 8px; display: flex"
                                                                                    >
                                                                                        <i
                                                                                            class="ms-2 fa-solid fa-grip-dots-vertical color39 dragItem hoverBtn d-flex align-items-center justify-content-center"
                                                                                            style="cursor: pointer;width:25px;height: 25px;"
                                                                                        ></i>
                                                                                        <div
                                                                                            style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px; display: inline-flex;white-space: normal;word-break: break-all;"
                                                                                        >
                                                                                            <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                                                                                <div style="color: #393939; font-size: 16px;  font-weight: 400; word-break: break-all;">
                                                                                                    ${dd.type === 'folder' ? `<i class="fa-regular fa-folder-open me-2"></i>` : ``} ${dd.title}
                                                                                                </div>
                                                                                                ${dd.items && dd.items.length > 0
                                                        ? !dd.toggle
                                                            ? `<i class="fa-solid fa-angle-down color39"></i>`
                                                            : `<i class="fa-solid fa-angle-up color39"></i>`
                                                        : ``}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="flex-fill"></div>
                                                                                        <div
                                                                                            class="child me-2"
                                                                                            onclick="${gvc.event((e, event) => {
                                                        event.stopPropagation();
                                                        cf.plus(gvc, (file) => {
                                                            var _a;
                                                            dd.items = (_a = dd.items) !== null && _a !== void 0 ? _a : [];
                                                            dd.items.push(file);
                                                            gvc.notifyDataChange(vm.id);
                                                        });
                                                    })}"
                                                                                        >
                                                                                            <i class="fa-solid ${dd.type === 'folder' ? `` : `d-none`} fa-plus" style="color:#393939;"></i>
                                                                                        </div>
                                                                                        <div
                                                                                            class="child"
                                                                                            onclick="${gvc.event((e, event) => {
                                                        event.stopPropagation();
                                                        cf.edit(dd, (replace) => {
                                                            if (!replace) {
                                                                array.splice(index, 1);
                                                                gvc.notifyDataChange(vm.id);
                                                            }
                                                            else {
                                                                array[index] = replace;
                                                                gvc.notifyDataChange(id);
                                                            }
                                                        });
                                                    })}"
                                                                                        >
                                                                                            <i class="fa-solid fa-pencil" style="color:#393939;"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                ${dd.items && dd.items.length > 0
                                                        ? html `
                                                                                          <div class=" w-100 ${dd.toggle ? `` : `d-none`}" style="padding-left: 35px;">
                                                                                              ${renderItems(dd.items)}
                                                                                          </div>
                                                                                      `
                                                        : ``}
                                                                            `;
                                                    return html ` <li class="w-100 ">${list}</li>`;
                                                })
                                                    .join('');
                                            },
                                            divCreate: {
                                                elem: 'ul',
                                                class: `w-100 my-2`,
                                                style: `display:flex;flex-direction: column;gap:18px;`,
                                            },
                                            onCreate: () => {
                                                gvc.glitter.addMtScript([
                                                    {
                                                        src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                    },
                                                ], () => { }, () => { });
                                                const interval = setInterval(() => {
                                                    if (window.Sortable) {
                                                        try {
                                                            gvc.addStyle(`
                                                                                ul {
                                                                                    list-style: none;
                                                                                    padding: 0;
                                                                                }
                                                                            `);
                                                            function swapArr(arr, index1, index2) {
                                                                const data = arr[index1];
                                                                arr.splice(index1, 1);
                                                                arr.splice(index2, 0, data);
                                                            }
                                                            let startIndex = 0;
                                                            Sortable.create(gvc.getBindViewElem(id).get(0), {
                                                                group: id,
                                                                animation: 100,
                                                                handle: '.dragItem',
                                                                onChange: function (evt) { },
                                                                onEnd: (evt) => {
                                                                    swapArr(array, startIndex, evt.newIndex);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                onStart: function (evt) {
                                                                    startIndex = evt.oldIndex;
                                                                },
                                                            });
                                                        }
                                                        catch (e) { }
                                                        clearInterval(interval);
                                                    }
                                                }, 100);
                                            },
                                        };
                                    });
                                }
                                return renderItems(vm.link);
                            })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }),
                        divCreate: {
                            style: ``,
                        },
                    };
                });
            },
            footer_html: (gvc) => {
                const dialog = new ShareDialog(cf.gvc.glitter);
                function clearNoNeedData(items) {
                    items.map((dd) => {
                        dd.selected = undefined;
                        clearNoNeedData(dd.items || []);
                    });
                }
                function save(finish) {
                    clearNoNeedData(vm.link);
                    dialog.dataLoading({ visible: true });
                    ApiUser.setPublicConfig({
                        key: cf.key,
                        value: vm.link,
                        user_id: 'manager',
                    }).then((data) => {
                        dialog.dataLoading({ visible: false });
                        dialog.successMessage({ text: '儲存成功' });
                        finish();
                    });
                }
                return [
                    BgWidget.cancel(gvc.event(() => {
                        gvc.closeDialog();
                    })),
                    BgWidget.save(gvc.event(() => {
                        let select = [];
                        function loop(array) {
                            array.map((dd) => {
                                if (dd.type === 'folder') {
                                    loop(dd.items || []);
                                }
                                else if (dd.selected) {
                                    select.push(dd.id);
                                }
                            });
                        }
                        loop(vm.link);
                        save(() => {
                            cf.getSelect(select);
                            gvc.closeDialog();
                        });
                    }), '確認'),
                ].join('');
            },
        });
    }
    static selectRichText(gvc, callback, title, def) {
        function editorView(gvc, item) {
            var _a, _b;
            if (item.type === 'folder') {
                return BgWidget.editeInput({
                    gvc: gvc,
                    title: `資料夾標題`,
                    default: item.title,
                    placeHolder: `請輸入資料夾標題`,
                    callback: (text) => {
                        item.title = text;
                    },
                });
            }
            else {
                item.data = (_a = item.data) !== null && _a !== void 0 ? _a : {};
                return [
                    BgWidget.editeInput({
                        gvc: gvc,
                        title: `文本標題`,
                        default: item.title,
                        placeHolder: `請輸入文本標題`,
                        callback: (text) => {
                            item.title = text;
                        },
                    }),
                    EditorElem.richText({
                        gvc: gvc,
                        def: (_b = item.data.content) !== null && _b !== void 0 ? _b : '',
                        callback: (text) => {
                            item.data.content = text;
                        },
                        style: 'min-height:100vh;',
                    }),
                ].join('');
            }
        }
        FileSystem.fileSystem({
            getSelect: callback,
            gvc: gvc,
            key: 'text-manager',
            title: title,
            def: def,
            plus: (gvc, callback) => {
                const item = {
                    title: '',
                    data: {},
                    items: [],
                    type: 'file',
                    id: gvc.glitter.getUUID(),
                };
                BgWidget.settingDialog({
                    gvc: gvc,
                    title: '新增文本',
                    innerHTML: (gvc) => {
                        return [
                            html ` <div>
                                <div class="tx_normal fw-normal mb-2">新增類型</div>
                                ${BgWidget.select({
                                gvc: gvc,
                                default: item.type,
                                callback: (key) => {
                                    item.type = key;
                                    gvc.recreateView();
                                },
                                options: [
                                    {
                                        key: 'folder',
                                        value: '資料夾',
                                    },
                                    {
                                        key: 'file',
                                        value: '文本',
                                    },
                                ],
                                style: 'margin:0px;',
                            })}
                            </div>`,
                            editorView(gvc, item),
                        ].join('');
                    },
                    footer_html: (gvc) => {
                        return [
                            BgWidget.cancel(gvc.event(() => {
                                gvc.closeDialog();
                            })),
                            BgWidget.save(gvc.event(() => {
                                callback(item);
                                gvc.closeDialog();
                            }), '新增'),
                        ].join('');
                    },
                    closeCallback: () => { },
                });
            },
            edit: (item, callback) => {
                item = JSON.parse(JSON.stringify(item));
                BgWidget.settingDialog({
                    gvc: gvc,
                    title: '新增文本',
                    innerHTML: (gvc) => {
                        return editorView(gvc, item);
                    },
                    footer_html: (gvc) => {
                        return [
                            BgWidget.danger(gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.checkYesOrNot({
                                    text: `刪除後使用此資源的內容將會被取消關聯，是否確認刪除?`,
                                    callback: (response) => {
                                        if (response) {
                                            callback(undefined);
                                            gvc.closeDialog();
                                        }
                                    },
                                });
                            })),
                            BgWidget.cancel(gvc.event(() => {
                                gvc.closeDialog();
                            })),
                            BgWidget.save(gvc.event(() => {
                                callback(item);
                                gvc.closeDialog();
                            }), '新增'),
                        ].join('');
                    },
                    closeCallback: () => { },
                });
            },
        });
    }
}
