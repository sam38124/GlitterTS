var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { LanguageBackend } from './language-backend.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class MenusSetting {
    static main(gvc, widget, def) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const vm = {
            type: 'list',
            index: 0,
            dataList: undefined,
            query: '',
            tab: def || 'menu',
            select: { title: '', tag: '' },
        };
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
                    {
                        key: '選單名稱',
                        value: html `<span class="tx_normal">${dd.title}</span>`,
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
              <div class="title-container">
                ${BgWidget.title('選單管理')}
                <div class="flex-fill"></div>
                ${BgWidget.darkButton(`新增${vm.tab === 'menu' ? `頁首選單` : `頁腳選單`}`, gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                            let title = '';
                            function next() {
                                var _a;
                                return __awaiter(this, void 0, void 0, function* () {
                                    dialog.dataLoading({ visible: true });
                                    const tab = vm.tab === 'menu' ? `頁首選單` : `頁腳選單`;
                                    let menu_all = (yield ApiUser.getPublicConfig('menu-setting-list', 'manager')).response.value;
                                    menu_all.list = (_a = menu_all.list) !== null && _a !== void 0 ? _a : [];
                                    menu_all.list = [
                                        {
                                            tag: gvc.glitter.getUUID(),
                                            title: title || [tab, `${menu_all.list.length + 1}`].join(''),
                                            tab: vm.tab === 'menu' ? 'menu-setting' : 'footer-setting',
                                        },
                                    ].concat(menu_all.list);
                                    yield ApiUser.setPublicConfig({
                                        key: 'menu-setting-list',
                                        value: menu_all,
                                        user_id: 'manager',
                                    });
                                    dialog.dataLoading({ visible: false });
                                    gvc.notifyDataChange(id);
                                });
                            }
                            BgWidget.settingDialog({
                                gvc: gvc,
                                title: '選單名稱',
                                innerHTML: (gvc) => {
                                    return [
                                        BgWidget.editeInput({
                                            title: '',
                                            callback: text => {
                                                title = text;
                                            },
                                            default: title,
                                            gvc: gvc,
                                            placeHolder: '請輸入選單名稱',
                                        }),
                                    ].join('');
                                },
                                footer_html: (gvc) => {
                                    return BgWidget.save(gvc.event(() => {
                                        next();
                                        gvc.closeDialog();
                                    }), '儲存');
                                },
                                width: 300,
                            });
                        })))}
              </div>
              ${def
                            ? ''
                            : BgWidget.tab([
                                { title: '主選單', key: 'menu' },
                                { title: '頁腳', key: 'footer' },
                            ], gvc, vm.tab, text => {
                                vm.tab = text;
                                gvc.notifyDataChange(id);
                            }, `${document.body.clientWidth < 800 ? '' : `margin-bottom:0px !important;`}
                `)}
              ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV3({
                            gvc: gvc,
                            getData: (vmi) => __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                const tag = vm.tab === 'menu' ? 'menu-setting' : 'footer-setting';
                                let menu_all = (yield ApiUser.getPublicConfig('menu-setting-list', 'manager')).response.value;
                                menu_all.list = (_a = menu_all.list) !== null && _a !== void 0 ? _a : [];
                                vm.dataList = [
                                    {
                                        tag: tag,
                                        title: html `
                            <div>
                              ${vm.tab === 'menu' ? '頁首選單' : '頁腳選單'}
                              <span style="font-size: 12px; color: #36B;">系統預設</span>
                            </div>
                          `,
                                    },
                                    ...menu_all.list.filter((d1) => d1.tab === tag),
                                ];
                                vmi.pageSize = 1;
                                vmi.originalData = vm.dataList;
                                vmi.tableData = getDatalist();
                                vmi.loading = false;
                                vmi.callback();
                            }),
                            rowClick: (_, index) => {
                                vm.select = vm.dataList[index];
                                vm.type = 'replace';
                            },
                            filter: [],
                        })))}
            `);
                    }
                    else if (vm.type == 'add') {
                        return BgWidget.container(this.setMenu({
                            gvc: gvc,
                            widget: widget,
                            title: '新增選單',
                            key: vm.dataList[vm.index].tag,
                            goBack: () => { },
                        }));
                    }
                    else {
                        return BgWidget.container(this.setMenu({
                            gvc: gvc,
                            widget: widget,
                            key: vm.select.tag,
                            title: vm.select.title,
                            goBack: () => {
                                vm.type = 'list';
                                gvc.notifyDataChange(id);
                            },
                        }));
                    }
                },
                divCreate: {
                    class: 'w-100',
                    style: 'max-width: 100%;',
                },
            };
        });
    }
    static setMenu(cf) {
        const vm = {
            id: cf.gvc.glitter.getUUID(),
            link: {
                'en-US': [],
                'zh-CN': [],
                'zh-TW': [],
            },
            selected: false,
            loading: true,
            language: window.parent.store_info.language_setting.def,
        };
        const gvc = cf.gvc;
        const dialog = new ShareDialog(gvc.glitter);
        ApiUser.getPublicConfig(cf.key, 'manager').then((data) => {
            if (data.response.value) {
                vm.link = data.response.value;
            }
            gvc.notifyDataChange(vm.id);
        });
        function clearNoNeedData(items) {
            items.map(dd => {
                dd.selected = undefined;
                clearNoNeedData(dd.items || []);
            });
        }
        function save() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                for (const a of ['en-US', 'zh-CN', 'zh-TW']) {
                    vm.link[a] = (_a = vm.link[a]) !== null && _a !== void 0 ? _a : [];
                    clearNoNeedData(vm.link[a]);
                }
                dialog.dataLoading({ visible: true });
                let menu_all = (yield ApiUser.getPublicConfig('menu-setting-list', 'manager')).response.value;
                menu_all.list = (_b = menu_all.list) !== null && _b !== void 0 ? _b : [];
                const find_ = menu_all.list.find((d1) => {
                    return d1.tag === cf.key;
                });
                find_ && (find_.title = cf.title);
                yield ApiUser.setPublicConfig({
                    key: 'menu-setting-list',
                    value: menu_all,
                    user_id: 'manager',
                });
                ApiUser.setPublicConfig({
                    key: cf.key,
                    value: vm.link,
                    user_id: 'manager',
                }).then(data => {
                    setTimeout(() => {
                        dialog.dataLoading({ visible: false });
                        dialog.successMessage({ text: '儲存成功' });
                    }, 1000);
                });
            });
        }
        function selectAll(array) {
            array.selected = true;
            array.items.map(dd => {
                dd.selected = true;
                selectAll(dd);
            });
        }
        function clearAll(array) {
            array.selected = false;
            array.items.map(dd => {
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
            if (dd.selected) {
                count++;
            }
            dd.items.map((d1) => {
                count += getSelectCount(d1);
            });
            return count;
        }
        function deleteSelect(items) {
            return items.filter(d1 => {
                d1.items = deleteSelect(d1.items || []);
                return !d1.selected;
            });
        }
        function refresh() {
            gvc.notifyDataChange(vm.id);
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    var _a, _b;
                    vm.link[vm.language] = (_a = vm.link[vm.language]) !== null && _a !== void 0 ? _a : [];
                    const link = vm.link[vm.language];
                    return html `<div class="title-container" style="width: 100%; max-width: 100%;">
              ${BgWidget.goBack(cf.gvc.event(() => {
                        cf.goBack();
                    }))}${BgWidget.title((_b = cf.title) !== null && _b !== void 0 ? _b : '選單設定')}
              <div class="mx-2 ${['menu-setting', 'footer-setting', 'text-manager'].includes(cf.key) ? 'd-none' : ''}">
                ${BgWidget.grayButton('重新命名', gvc.event(() => {
                        BgWidget.settingDialog({
                            gvc: gvc,
                            title: '重新命名',
                            innerHTML: (gvc) => {
                                return [
                                    BgWidget.editeInput({
                                        title: '',
                                        callback: text => {
                                            cf.title = text;
                                        },
                                        default: cf.title,
                                        gvc: gvc,
                                        placeHolder: '',
                                    }),
                                ].join('');
                            },
                            footer_html: (gvc) => {
                                return BgWidget.save(gvc.event(() => {
                                    gvc.closeDialog();
                                    refresh();
                                }), '儲存');
                            },
                            width: 500,
                        });
                    }))}
              </div>
              <div class="flex-fill"></div>
              ${LanguageBackend.switchBtn({
                        gvc: gvc,
                        language: vm.language,
                        callback: language => {
                            vm.language = language;
                            refresh();
                        },
                    })}
            </div>
            ${BgWidget.container(html `<div
                style="max-width:100%;width: 100%; padding: 20px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; justify-content: center; align-items: center; display: inline-flex"
              >
                <div style="width: 100%;  position: relative">
                  <div
                    style="width: 100%;  left: 0px; top: 0px;  flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex"
                  >
                    <div
                      class="w-100  ${getSelectCount({ items: link }) > 0 ? '' : 'd-none'}"
                      style="height: 40px; padding: 12px 18px;background: #F7F7F7; border-radius: 10px; justify-content: flex-end; align-items: center; gap: 8px; display: inline-flex"
                    >
                      <div
                        style="flex: 1 1 0; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word"
                      >
                        已選取${getSelectCount({ items: link })}項
                      </div>
                      <div
                        style="cursor:pointer;padding: 4px 14px;background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10); border-radius: 20px; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                      >
                        <div
                          style="color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                          onclick="${gvc.event(() => {
                        vm.link[vm.language] = deleteSelect(link);
                        gvc.notifyDataChange(vm.id);
                    })}"
                        >
                          刪除
                        </div>
                      </div>
                    </div>
                    <div
                      class="d-flex align-items-center"
                      style="width: 100%; height: 22px; position: relative;gap:29px;"
                    >
                      <div
                        class="${allSelect({
                        items: link,
                        selected: !link.find(dd => !dd.selected),
                    })
                        ? 'fa-solid fa-square-check'
                        : 'fa-regular fa-square'}"
                        style="color: #393939; width: 16px; height: 16px; cursor: pointer;"
                        onclick="${cf.gvc.event((e, event) => {
                        event.stopPropagation();
                        if (link.find(dd => !dd.selected)) {
                            selectAll({ items: link });
                        }
                        else {
                            clearAll({ items: link });
                        }
                        gvc.notifyDataChange(vm.id);
                    })}"
                      ></div>
                      <div
                        style="left: 61px; top: 0px;  color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word"
                      >
                        選單名稱 ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                      </div>
                    </div>
                    <div
                      style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex"
                    >
                      ${(() => {
                        function renderItems(array, depth) {
                            const id = gvc.glitter.getUUID();
                            return (gvc.bindView(() => {
                                return {
                                    bind: id,
                                    view: () => {
                                        return array
                                            .map((dd, index) => {
                                            const list = html `
                                        <div
                                          class="w-100"
                                          style="width: 100%; justify-content: flex-start; align-items: center; gap: 5px; display: inline-flex;cursor: pointer;"
                                          onclick="${cf.gvc.event(() => {
                                                if (dd.items && dd.items.length > 0) {
                                                    dd.toggle = !dd.toggle;
                                                    gvc.notifyDataChange(vm.id);
                                                }
                                            })}"
                                        >
                                          <div
                                            class="${allSelect(dd)
                                                ? `fa-solid fa-square-check`
                                                : `fa-regular fa-square`}"
                                            style="color:#393939;width: 16px; height: 16px;"
                                            onclick="${cf.gvc.event((_, event) => {
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
                                            class="hoverF2 pe-2 my-1"
                                            style="width: 100%;  justify-content: flex-start; align-items: center; gap: 8px; display: flex"
                                          >
                                            <i
                                              class="ms-2 fa-solid fa-grip-dots-vertical color39 dragItem hoverBtn d-flex align-items-center justify-content-center"
                                              style="cursor: pointer;width:25px;height: 25px;"
                                            ></i>
                                            <div
                                              style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px; display: inline-flex;white-space: normal;word-break: break-all;"
                                            >
                                              <div
                                                style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex"
                                              >
                                                <div
                                                  style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-break: break-all;"
                                                >
                                                  ${dd.title}
                                                </div>
                                                ${dd.items && dd.items.length > 0
                                                ? !dd.toggle
                                                    ? html `<i class="fa-solid fa-angle-down color39"></i>`
                                                    : html `<i class="fa-solid fa-angle-up color39"></i>`
                                                : ''}
                                              </div>
                                              <div
                                                style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex;white-space: normal;word-break: break-all;"
                                              >
                                                <div
                                                  style="color: #3366BB; font-size: 14px; font-family: Noto Sans; font-weight: 400; line-height: 14px; word-wrap: break-word"
                                                >
                                                  ${dd.title}
                                                </div>
                                                <div
                                                  style="color: #159240; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                                >
                                                  ${dd.link}
                                                </div>
                                              </div>
                                            </div>
                                            <div class="flex-fill"></div>
                                            ${depth < 2
                                                ? html `<div
                                                  class="child me-2"
                                                  onclick="${cf.gvc.event((_, event) => {
                                                    event.stopPropagation();
                                                    MenusSetting.editEvent({
                                                        link: '',
                                                        title: '',
                                                        visible_type: 'all',
                                                        items: [],
                                                    }, data => {
                                                        dd.items = dd.items || [];
                                                        dd.items.push(data);
                                                        gvc.notifyDataChange(vm.id);
                                                    });
                                                })}"
                                                >
                                                  <i class="fa-solid fa-plus" style="color:#393939;"></i>
                                                </div>`
                                                : ''}
                                            <div
                                              class="child"
                                              onclick="${cf.gvc.event((_, event) => {
                                                event.stopPropagation();
                                                MenusSetting.editEvent(dd, data => {
                                                    array[index] = data;
                                                    gvc.notifyDataChange(vm.id);
                                                });
                                            })}"
                                            >
                                              <i class="fa-solid fa-pencil" style="color:#393939;"></i>
                                            </div>
                                          </div>
                                        </div>
                                        ${dd.items && dd.items.length > 0
                                                ? html `
                                              <div
                                                class=" w-100 ${dd.toggle ? '' : 'd-none'}"
                                                style="padding-left: 35px;"
                                              >
                                                ${renderItems(dd.items, depth + 1)}
                                              </div>
                                            `
                                                : ''}
                                      `;
                                            return html `<li class="w-100 ">${list}</li>`;
                                        })
                                            .join('');
                                    },
                                    divCreate: {
                                        elem: 'ul',
                                        class: 'w-100 my-2',
                                        style: 'display:flex; flex-direction: column; gap: 18px;',
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
                            }) +
                                html ` <div
                              style="cursor:pointer;align-self: stretch; height: 50px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                              onclick="${cf.gvc.event(() => {
                                    MenusSetting.editEvent({
                                        link: '',
                                        title: '',
                                        visible_type: 'all',
                                        items: [],
                                    }, data => {
                                        array.push(data);
                                        gvc.notifyDataChange(vm.id);
                                    });
                                })}"
                            >
                              <div
                                style="align-self: stretch; height: 54px; border-radius: 10px; border: 1px #DDDDDD solid; justify-content: center; align-items: center; gap: 6px; display: inline-flex"
                              >
                                <i class="fa-solid fa-plus" style="color: #3366BB;font-size: 16px; "></i>
                                <div
                                  style="color: #3366BB; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                >
                                  新增選單
                                </div>
                              </div>
                            </div>`);
                        }
                        return renderItems(link, 0);
                    })()}
                    </div>
                  </div>
                </div>
              </div>`)}
            <div class="update-bar-container">
              ${['menu-setting', 'footer-setting', 'text-manager'].includes(cf.key)
                        ? ''
                        : BgWidget.danger(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                            dialog.checkYesOrNot({
                                text: '是否確認刪除?',
                                callback: (response) => __awaiter(this, void 0, void 0, function* () {
                                    if (response) {
                                        dialog.dataLoading({ visible: true });
                                        let menu_all = (yield ApiUser.getPublicConfig('menu-setting-list', 'manager')).response
                                            .value;
                                        menu_all.list = menu_all.list.filter((d1) => d1.tag != cf.key);
                                        yield ApiUser.setPublicConfig({
                                            key: 'menu-setting-list',
                                            value: menu_all,
                                            user_id: 'manager',
                                        });
                                        dialog.dataLoading({ visible: false });
                                        cf.goBack();
                                    }
                                }),
                            });
                        })))}
              ${BgWidget.cancel(gvc.event(() => {
                        cf.goBack();
                    }))}
              ${BgWidget.save(gvc.event(() => {
                        save();
                    }))}
            </div>`;
                },
                divCreate: {
                    style: `padding-bottom:60px;`,
                },
            };
        });
    }
    static editEvent(data, save) {
        const gvc = window.parent.glitter.pageConfig[0].gvc;
        const glitter = gvc.glitter;
        const rightMenu = glitter.share.NormalPageEditor;
        const vm = {
            search: '',
            levelList: undefined,
            userList: undefined,
            visibleDataList: undefined,
            cloneData: structuredClone(data),
            show: false,
            dataLoading: true,
        };
        const ids = {
            main: glitter.getUUID(),
            visibleSelect: glitter.getUUID(),
            dataArray: glitter.getUUID(),
        };
        const setVisibleSelect = () => {
            return gvc.bindView({
                bind: ids.visibleSelect,
                view: () => {
                    var _a;
                    return html `
            <div class="tx_normal fw-normal">選單可見對象</div>
            <div class="d-flex align-items-center" style="margin-top: 8px; gap: 10px;">
              ${[
                        BgWidget.select({
                            gvc,
                            callback: value => {
                                data.visible_type = value;
                                data.visible_data_array = [];
                                vm.visibleDataList = [];
                                vm.show = false;
                                vm.dataLoading = true;
                                gvc.notifyDataChange([ids.visibleSelect, ids.dataArray]);
                            },
                            default: (_a = data.visible_type) !== null && _a !== void 0 ? _a : 'all',
                            options: [
                                { key: 'all', value: '所有顧客' },
                                { key: 'loggedIn', value: '已登入顧客' },
                                { key: 'user', value: '特定顧客' },
                                { key: 'level', value: '特定會員等級' },
                            ],
                        }),
                        ['user', 'level'].includes(data.visible_type)
                            ? BgWidget.grayButton('選擇', gvc.event(() => {
                                if (!vm.show) {
                                    vm.show = true;
                                    gvc.notifyDataChange(ids.dataArray);
                                }
                            }))
                            : '',
                    ].join('')}
            </div>
          `;
                },
                divCreate: {
                    style: 'margin-top: 8px;',
                },
            });
        };
        const optionView = () => {
            const id = glitter.getUUID();
            return gvc.bindView({
                bind: id,
                view: () => {
                    var _a;
                    function includesItem(item) {
                        var _a, _b;
                        const text = vm.search.toLowerCase();
                        return ((_a = item.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(text)) || ((_b = item.note) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(text));
                    }
                    const targetList = data.visible_type === 'user' ? vm.userList : vm.levelList;
                    if (!targetList) {
                        return BgWidget.spinner({ container: { class: 'w-100' } });
                    }
                    const filterList = targetList.filter((item) => includesItem(item));
                    const filterListIdArray = new Set(filterList.map((item) => item.key));
                    return BgWidget.multiCheckboxContainer(gvc, filterList, (_a = data.visible_data_array) !== null && _a !== void 0 ? _a : [], items => {
                        var _a;
                        data.visible_data_array = [
                            ...new Set(((_a = data.visible_data_array) !== null && _a !== void 0 ? _a : [])
                                .filter(item => {
                                return !filterListIdArray.has(item);
                            })
                                .concat(items)),
                        ];
                    });
                },
                divCreate: {
                    style: 'max-height: 300px; overflow-y: auto; width: 100%;',
                },
                onCreate: () => {
                    if (vm.userList === undefined) {
                        this.getUserOption().then(data => {
                            vm.userList = data;
                            gvc.notifyDataChange(id);
                        });
                    }
                    if (vm.levelList === undefined) {
                        this.getLevelOption().then(data => {
                            vm.levelList = data;
                            gvc.notifyDataChange(id);
                        });
                    }
                },
            });
        };
        const setVisibleDataArray = () => {
            return gvc.bindView({
                bind: ids.dataArray,
                view: () => {
                    if (data.visible_type === 'user' || data.visible_type === 'level') {
                        if (!vm.show) {
                            if (vm.dataLoading) {
                                return BgWidget.spinner({ container: { class: 'w-100' } });
                            }
                            return html `
                <div class="mt-2">${data.visible_type === 'user' ? '顧客名稱' : '會員等級'}</div>
                ${BgWidget.horizontalLine()}
                <div class="d-flex flex-column gap-1">
                  ${Array.isArray(vm.visibleDataList)
                                ? data.visible_type === 'user'
                                    ? vm.visibleDataList
                                        .map(item => {
                                        return html `<div class="d-flex gap-1">
                              <div>${item.userData.name}</div>
                              ${BgWidget.grayNote(item.account)}
                            </div>`;
                                    })
                                        .join('')
                                    : vm.visibleDataList
                                        .map(item => {
                                        return html `<div class="d-flex gap-1">
                              <div>${item.title.replace('會員等級 - ', '')}</div>
                            </div>`;
                                    })
                                        .join('')
                                : ''}
                </div>
              `;
                        }
                        return BgWidget.mainCard([
                            html `<div
                  class="d-flex align-items-center cursor_pointer"
                  onclick="${gvc.event(() => {
                                vm.show = false;
                                vm.dataLoading = true;
                                gvc.notifyDataChange(ids.dataArray);
                            })}"
                >
                  ${BgWidget.goBack('')}
                  <span>返回</span>
                </div>`,
                            BgWidget.searchPlace(gvc.event(e => {
                                vm.search = e.value;
                                gvc.notifyDataChange(ids.dataArray);
                            }), vm.search || '', '搜尋', undefined, '0', 'width: 100%;'),
                            optionView(),
                        ].join(''), 'd-flex flex-column align-items-start');
                    }
                    return '';
                },
                divCreate: {
                    class: 'mt-1 p-1',
                },
                onCreate: () => {
                    if (vm.dataLoading && (data.visible_type === 'user' || data.visible_type === 'level')) {
                        Promise.all([
                            Array.isArray(data.visible_data_array) && data.visible_data_array.length > 0
                                ? data.visible_type === 'user'
                                    ? this.getUserList(data.visible_data_array)
                                    : this.getLevelList(data.visible_data_array)
                                : [],
                        ]).then(([visibleDataList]) => {
                            vm.visibleDataList = visibleDataList;
                            vm.dataLoading = false;
                            gvc.notifyDataChange(ids.dataArray);
                        });
                    }
                },
            });
        };
        const backToDefault = () => {
            return html `<div
        class="position-absolute bottom-0 left-0 w-100 d-flex align-items-center justify-content-end p-3 border-top pe-4"
        style="gap: 10px; background-color: #fff"
      >
        ${BgWidget.cancel(gvc.event(() => {
                data = vm.cloneData;
                vm.show = false;
                vm.dataLoading = true;
                gvc.notifyDataChange(ids.main);
            }), '回到預設值')}
      </div>`;
        };
        const view = [
            BgWidget.editeInput({
                gvc: gvc,
                title: '選單名稱',
                default: data.title || '',
                placeHolder: '請輸入選單名稱',
                callback: text => {
                    data.title = text;
                },
            }),
            BgWidget.linkList({
                gvc: gvc,
                title: '連結位置',
                default: data.link || '',
                placeHolder: '選擇或貼上外部連結',
                callback: text => {
                    data.link = text;
                },
            }),
            setVisibleSelect(),
            setVisibleDataArray(),
            backToDefault(),
        ]
            .map(h => html `<div class="w-100">${h}</div>`)
            .join('');
        rightMenu.closeEvent = () => {
            if (data.title.length > 0 || data.link.length > 0) {
                save(data);
            }
        };
        rightMenu.toggle({
            visible: true,
            title: '新增選單',
            view: gvc.bindView({
                bind: ids.main,
                view: () => html `<div class="d-flex flex-column p-3">${view}</div>`,
            }),
            right: true,
        });
    }
    static collectionEvent(data, save) {
        const gvc = window.parent.glitter.pageConfig[0].gvc;
        const rightMenu = window.parent.glitter.share.NormalPageEditor;
        const id = gvc.glitter.getUUID();
        rightMenu.closeEvent = () => {
            if (data.title.length > 0 && data.link.length > 0) {
                save(data);
            }
        };
        rightMenu.toggle({
            visible: true,
            title: '新增分類',
            view: [
                gvc.bindView(() => {
                    return {
                        bind: id,
                        view: () => {
                            return [
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '分類名稱',
                                    default: data.title || '',
                                    placeHolder: '請輸入分類名稱',
                                    callback: text => {
                                        data.title = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: data.link || '',
                                    placeHolder: '請輸入分類標籤',
                                    callback: text => {
                                        data.link = text;
                                    },
                                }),
                            ].join('');
                        },
                        divCreate: {
                            style: 'padding: 20px;',
                        },
                    };
                }),
            ].join(''),
            right: true,
        });
    }
    static getUserList(visible_data_array) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ApiUser.getUserList({
                page: 0,
                limit: 99999,
                only_id: true,
                id: visible_data_array.join(','),
            }).then(dd => {
                try {
                    return dd.response.data;
                }
                catch (error) {
                    return [];
                }
            });
        });
    }
    static getUserOption() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ApiUser.getUserList({
                page: 0,
                limit: 99999,
                only_id: true,
            }).then(dd => {
                var _a;
                try {
                    return ((_a = dd.response.data.map((item) => {
                        var _a;
                        return {
                            key: item.userID,
                            name: (_a = item.userData.name) !== null && _a !== void 0 ? _a : '（尚無姓名）',
                            note: item.userData.email,
                        };
                    })) !== null && _a !== void 0 ? _a : []);
                }
                catch (error) {
                    return [];
                }
            });
        });
    }
    static getLevelList(visible_data_array) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ApiUser.getUserGroupList('level').then(r => {
                var _a;
                if (r.result && Array.isArray((_a = r.response) === null || _a === void 0 ? void 0 : _a.data)) {
                    return r.response.data.filter((d) => {
                        return visible_data_array === null || visible_data_array === void 0 ? void 0 : visible_data_array.includes(d.tag === '' ? 'default' : d.tag);
                    });
                }
                return [];
            });
        });
    }
    static getLevelOption() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ApiUser.getUserGroupList('level').then(r => {
                var _a;
                if (r.result && Array.isArray((_a = r.response) === null || _a === void 0 ? void 0 : _a.data)) {
                    return r.response.data.map((d) => ({
                        key: d.tag || 'default',
                        name: d.title.replace('會員等級 - ', ''),
                    }));
                }
                return [];
            });
        });
    }
}
window.glitter.setModule(import.meta.url, MenusSetting);
