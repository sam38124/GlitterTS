import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class MenusSetting {
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
                        key: '選單名稱',
                        value: `<span class="fs-7">${dd.title}</span>`,
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
                            <div class="d-flex w-100 align-items-center mb-3">
                                ${BgWidget.title('選單管理')}
                                <div class="flex-fill"></div>
                                <div
                                    class="bt_ffb40 d-none"
                                    onclick="${gvc.event(() => {
                            vm.type = 'add';
                            gvc.notifyDataChange(id);
                        })}"
                                >
                                    新增
                                </div>
                            </div>
                            ${BgWidget.table({
                            gvc: gvc,
                            getData: (vd) => {
                                vmi = vd;
                                vmi.pageSize = 1;
                                vm.dataList = [
                                    {
                                        tag: 'menu-setting',
                                        title: '主選單',
                                    },
                                    {
                                        tag: 'footer-setting',
                                        title: '頁腳',
                                    },
                                ];
                                vmi.data = getDatalist();
                                vmi.loading = false;
                                setTimeout(() => {
                                    vmi.callback();
                                }, 100);
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
                        })}
                        `);
                    }
                    else if (vm.type == 'add') {
                        return this.setMenu({
                            gvc: gvc,
                            widget: widget,
                            key: vm.dataList[vm.index].tag,
                            goBack: () => { },
                        });
                    }
                    else {
                        return this.setMenu({
                            gvc: gvc,
                            widget: widget,
                            key: vm.dataList[vm.index].tag,
                            goBack: () => {
                                vm.type = 'list';
                                gvc.notifyDataChange(id);
                            },
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
    static setMenu(cf) {
        const vm = {
            id: cf.gvc.glitter.getUUID(),
            link: [],
            selected: false,
            loading: true,
        };
        ApiUser.getPublicConfig(cf.key, 'manager').then((data) => {
            if (data.response.value) {
                vm.link = data.response.value;
                gvc.notifyDataChange(vm.id);
            }
        });
        function clearNoNeedData(items) {
            items.map((dd) => {
                dd.selected = undefined;
                clearNoNeedData(dd.items || []);
            });
        }
        function save() {
            clearNoNeedData(vm.link);
            cf.widget.event('loading', {
                title: '儲存中...',
            });
            ApiUser.setPublicConfig({
                key: cf.key,
                value: vm.link,
                user_id: 'manager',
            }).then((data) => {
                setTimeout(() => {
                    cf.widget.event('loading', {
                        visible: false,
                    });
                    cf.widget.event('success', {
                        title: '儲存成功',
                    });
                }, 1000);
            });
        }
        function selectAll(array) {
            array.selected = true;
            array.items.map((dd) => {
                dd.selected = true;
                selectAll(dd);
            });
        }
        function clearAll(array) {
            array.selected = false;
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
            if (dd.selected) {
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
        const gvc = cf.gvc;
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    return html ` <div class="d-flex align-items-center my-3">
                            ${BgWidget.goBack(cf.gvc.event(() => {
                        cf.goBack();
                    }))}${BgWidget.title('選單設定')}
                        </div>
                        <div
                            style="max-width:100%;width: 856px; padding: 20px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; justify-content: center; align-items: center; display: inline-flex"
                        >
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
                                        <div
                                            style="cursor:pointer;padding: 4px 14px;background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10); border-radius: 20px; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                                        >
                                            <div
                                                style="color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                                onclick="${gvc.event(() => {
                        vm.link = deleteSelect(vm.link);
                        gvc.notifyDataChange(vm.id);
                    })}"
                                            >
                                                刪除
                                            </div>
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
                                            onclick="${cf.gvc.event((e, event) => {
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
                                        <div style="left: 61px; top: 0px;  color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">選單名稱</div>
                                    </div>
                                    <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
                                        ${(() => {
                        function renderItems(array) {
                            const id = gvc.glitter.getUUID();
                            return (gvc.bindView(() => {
                                return {
                                    bind: id,
                                    view: () => {
                                        return array
                                            .map((dd, index) => {
                                            const list = html `
                                                                            <div
                                                                                class=" w-100 "
                                                                                style="width: 100%; justify-content: flex-start; align-items: center; gap: 5px; display: inline-flex;cursor: pointer;"
                                                                                onclick="${cf.gvc.event(() => {
                                                if (dd.items && dd.items.length > 0) {
                                                    dd.toggle = !dd.toggle;
                                                    gvc.notifyDataChange(vm.id);
                                                }
                                            })}"
                                                                            >
                                                                                <div
                                                                                    class="${allSelect(dd) ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                    style="color:#393939;width: 16px; height: 16px;"
                                                                                    onclick="${cf.gvc.event((e, event) => {
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
                                                                                    class="hoverF2 pe-2"
                                                                                    style="width: 100%;  justify-content: flex-start; align-items: center; gap: 8px; display: flex"
                                                                                >
                                                                                    <i
                                                                                        class="ms-2 fa-solid fa-grip-dots-vertical cl_39 dragItem hoverBtn d-flex align-items-center justify-content-center"
                                                                                        style="cursor: pointer;width:25px;height: 25px;"
                                                                                    ></i>
                                                                                    <div
                                                                                        style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px; display: inline-flex"
                                                                                    >
                                                                                        <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                                                                            <div
                                                                                                style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                                                                            >
                                                                                                ${dd.title}
                                                                                            </div>
                                                                                            ${dd.items && dd.items.length > 0
                                                ? !dd.toggle
                                                    ? `<i class="fa-solid fa-angle-down cl_39"></i>`
                                                    : `<i class="fa-solid fa-angle-up cl_39"></i>`
                                                : ``}
                                                                                        </div>
                                                                                        <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
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
                                                                                    <div
                                                                                        class="child me-2"
                                                                                        onclick="${cf.gvc.event((e, event) => {
                                                event.stopPropagation();
                                                MenusSetting.editEvent({
                                                    link: '',
                                                    title: '',
                                                    items: [],
                                                }, (data) => {
                                                    dd.items = dd.items || [];
                                                    dd.items.push(data);
                                                    gvc.notifyDataChange(vm.id);
                                                });
                                            })}"
                                                                                    >
                                                                                        <i class="fa-solid fa-plus" style="color:#393939;"></i>
                                                                                    </div>
                                                                                    <div
                                                                                        class="child"
                                                                                        onclick="${cf.gvc.event((e, event) => {
                                                event.stopPropagation();
                                                MenusSetting.editEvent(dd, (data) => {
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
                                                ? `
                                    <div class=" w-100 ${dd.toggle ? `` : `d-none`}" style="padding-left: 35px;" >
                                 ${renderItems(dd.items)}
</div>
                                    `
                                                : ``}
                                                                        `;
                                            return `<li class="w-100 ">${list}</li>`;
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
                                                    gvc.addStyle(`ul {
  list-style: none;
  padding: 0;
}`);
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
                                ` <div class=""
                                                         style="cursor:pointer;align-self: stretch; height: 50px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                                                         onclick="${cf.gvc.event(() => {
                                    MenusSetting.editEvent({
                                        link: '',
                                        title: '',
                                        items: [],
                                    }, (data) => {
                                        array.push(data);
                                        gvc.notifyDataChange(vm.id);
                                    });
                                })}">
                                                        <div style="align-self: stretch; height: 54px; border-radius: 10px; border: 1px #DDDDDD solid; justify-content: center; align-items: center; gap: 6px; display: inline-flex">
                                                            <i class="fa-solid fa-plus"
                                                               style="color: #3366BB;font-size: 16px; "></i>
                                                            <div style="color: #3366BB; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                新增選單
                                                            </div>
                                                        </div>
                                                    </div>`);
                        }
                        return renderItems(vm.link);
                    })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="position-fixed bg-body bottom-0  w-100 d-flex align-items-center justify-content-end p-3 border-top" style="gap:10px;left:0px;">
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
        const rightMenu = window.parent.glitter.share.NormalPageEditor;
        rightMenu.toggle({
            visible: true,
            title: '新增選單',
            view: [
                gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return [
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '選單名稱',
                                    default: data.title || '',
                                    placeHolder: '請輸入選單名稱',
                                    callback: (text) => {
                                        data.title = text;
                                    },
                                }),
                                BgWidget.linkList({
                                    gvc: gvc,
                                    title: '',
                                    default: data.link || '',
                                    placeHolder: '選擇或貼上外部連結',
                                    callback: (text) => {
                                        data.link = text;
                                    },
                                }),
                            ].join('');
                        },
                        divCreate: {
                            style: `padding:20px;`,
                        },
                    };
                }),
                `<div class="position-absolute bottom-0 left-0 w-100 d-flex align-items-center justify-content-end p-3 border-top" style="gap:10px;">
${BgWidget.cancel(gvc.event(() => {
                    rightMenu.toggle({ visible: false });
                }))}
${BgWidget.save(gvc.event(() => {
                    save(data);
                    rightMenu.toggle({ visible: false });
                }))}
</div>`,
            ].join(''),
            right: true,
        });
    }
    static collectionEvent(data, save) {
        const gvc = window.parent.glitter.pageConfig[0].gvc;
        const rightMenu = window.parent.glitter.share.NormalPageEditor;
        const id = gvc.glitter.getUUID();
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
                                    callback: (text) => {
                                        data.title = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: data.link || '',
                                    placeHolder: '請輸入分類標籤',
                                    callback: (text) => {
                                        data.link = text;
                                    },
                                }),
                            ].join('');
                        },
                        divCreate: {
                            style: `padding:20px;`,
                        },
                    };
                }),
                `<div class="position-absolute bottom-0 left-0 w-100 d-flex align-items-center justify-content-end p-3 border-top" style="gap:10px;">
${BgWidget.cancel(gvc.event(() => {
                    rightMenu.toggle({ visible: false });
                }))}
${BgWidget.save(gvc.event(() => {
                    if (save(data) !== false) {
                        rightMenu.toggle({ visible: false });
                    }
                    else {
                        gvc.notifyDataChange(id);
                    }
                }))}
</div>`,
            ].join(''),
            right: true,
        });
    }
}
window.glitter.setModule(import.meta.url, MenusSetting);
