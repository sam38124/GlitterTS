import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiUser } from '../glitter-base/route/user.js';
const html = String.raw;
export class ShoppingRebateSetting {
    static main(gvc) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        const vm = {
            id: glitter.getUUID(),
            settingId: glitter.getUUID(),
            loading: true,
            type: 'list',
            data: {
                main: false,
                title: '',
                register: {
                    switch: false,
                    value: 100,
                    date: 7,
                    unlimited: false,
                },
                birth: {
                    switch: false,
                    type: 'base',
                    value: 100,
                    date: 30,
                    unlimited: false,
                    level: [],
                },
                config: {
                    condition: {
                        type: 'total_price',
                        value: 1000,
                    },
                    use_limit: {
                        type: 'price',
                        value: 100,
                    },
                    customize: false,
                },
            },
            dataObjectList: [],
        };
        function formatObject(obj, parentObj = obj) {
            Object.keys(obj).forEach((key) => {
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    formatObject(obj[key], obj[key]);
                }
                else {
                    vm.dataObjectList.push({ obj: parentObj, key: key });
                }
            });
        }
        function getTextList() {
            if (!vm.data.main) {
                return ['購物金功能關閉'];
            }
            const register = (() => {
                if (!vm.data.register.switch) {
                    return ['新加入會員購物金功能關閉'];
                }
                return ['新加入會員購物金功能開啟', `會員獲得${vm.data.register.value}點購物金`, vm.data.register.unlimited ? '無使用期限' : `使用期限${vm.data.register.date}天`];
            })();
            const birth = (() => {
                if (!vm.data.birth.switch) {
                    return ['生日購物金功能關閉'];
                }
                const given = [];
                if (vm.data.birth.type === 'base') {
                    given.push(`統一給予${vm.data.birth.value}點購物金`);
                }
                else {
                    given.push(`依照會員等級給予${vm.data.birth.level.length}種購物金`);
                }
                return ['生日購物金功能開啟', ...given, vm.data.birth.unlimited ? '無使用期限' : `使用期限${vm.data.birth.date}天`];
            })();
            const config = [];
            if (vm.data.config.condition.type === 'total_price') {
                config.push(`單筆訂單達到${vm.data.config.condition.value}元`);
            }
            else {
                config.push(`無折抵限制`);
            }
            if (vm.data.config.customize) {
                config.push('允許顧客自行設定要折抵的金額');
            }
            else {
                switch (vm.data.config.use_limit.type) {
                    case 'price':
                        config.push(`折抵上限最高為${vm.data.config.use_limit.value}元`);
                        break;
                    case 'percent':
                        config.push(`折抵上限最高為訂單總計的${vm.data.config.use_limit.value}%`);
                        break;
                    case 'none':
                        config.push(`無折抵上限`);
                        break;
                }
            }
            return ['購物金功能開啟', '', ...register, '', ...birth, '', ...config];
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.loading) {
                    return BgWidget.spinner();
                }
                if (vm.type === 'list') {
                    return BgWidget.container(html ` <div class="title-container">
                                ${BgWidget.title('購物金設定')}
                                <div class="flex-fill"></div>
                                <div style="display: flex; gap: 14px; "></div>
                            </div>
                            ${BgWidget.container([
                        BgWidget.container1x2({
                            html: [
                                BgWidget.mainCard(html `<div style="display: flex; flex-direction: column; gap: 16px;">
                                                    <div>
                                                        <span class="tx_700">購物金功能</span>
                                                    </div>
                                                    <div class="gray-bottom-line-18">
                                                        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                                                            <div class="tx_normal">購物金功能開啟</div>
                                                            ${BgWidget.switchButton(gvc, vm.data.main, (bool) => {
                                    vm.data.main = bool;
                                    gvc.notifyDataChange(vm.settingId);
                                })}
                                                        </div>
                                                        ${BgWidget.grayNote('一鍵開啟或關閉整個平台的購物金功能，停用後顧客將無法獲取或使用購物金來折抵消費金額。')}
                                                    </div>
                                                    <div>
                                                        ${BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '購物金前台名稱',
                                    default: vm.data.title,
                                    callback: (text) => {
                                        vm.data.title = text;
                                    },
                                    placeHolder: '請輸入購物金前台名稱',
                                })}
                                                        ${BgWidget.grayNote('消費者在前台商店看到的購物金名稱，如「Lucky Point」、「樂購點」，無填寫則顯示「購物金」')}
                                                    </div>
                                                </div>`),
                                gvc.bindView({
                                    bind: vm.settingId,
                                    view: () => {
                                        if (!vm.data.main) {
                                            return '';
                                        }
                                        return [
                                            BgWidget.mainCard((() => {
                                                const id = glitter.getUUID();
                                                return gvc.bindView({
                                                    bind: id,
                                                    view: () => {
                                                        return html `<div style="display: flex; flex-direction: column; gap: 18px;">
                                                                                <span class="tx_700">新加入會員購物金</span>
                                                                                <div style="display: flex; align-items: center; gap: 4px;">
                                                                                    <div class="tx_normal">新加入會員購物金開啟</div>
                                                                                    ${BgWidget.switchButton(gvc, vm.data.register.switch, (bool) => {
                                                            vm.data.register.switch = bool;
                                                            gvc.notifyDataChange(id);
                                                        })}
                                                                                </div>
                                                                                ${BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '購物金',
                                                            default: `${vm.data.register.value || ''}`,
                                                            placeHolder: '0',
                                                            callback: (text) => {
                                                                vm.data.register.value = parseInt(text, 10);
                                                                gvc.notifyDataChange(id);
                                                            },
                                                            readonly: !vm.data.register.switch,
                                                            endText: '點',
                                                        })}
                                                                                <div>
                                                                                    <span class="tx_700">使用期限</span>
                                                                                    ${BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '',
                                                            default: `${vm.data.register.date || ''}`,
                                                            placeHolder: '0',
                                                            callback: (text) => {
                                                                vm.data.register.date = parseInt(text, 10);
                                                                gvc.notifyDataChange(id);
                                                            },
                                                            readonly: !vm.data.register.switch || vm.data.register.unlimited,
                                                            endText: '天',
                                                        })}
                                                                                    ${BgWidget.multiCheckboxContainer(gvc, [{ key: 'true', name: '無使用期限' }], vm.data.register.unlimited ? ['true'] : [], (list) => {
                                                            vm.data.register.unlimited = Boolean(list[0] === 'true');
                                                            gvc.notifyDataChange(id);
                                                        }, { readonly: !vm.data.register.switch })}
                                                                                </div>
                                                                            </div>`;
                                                    },
                                                });
                                            })()),
                                            BgWidget.mainCard((() => {
                                                const id = glitter.getUUID();
                                                return gvc.bindView({
                                                    bind: id,
                                                    view: () => {
                                                        return html `<div style="display: flex; flex-direction: column; gap: 18px;">
                                                                                <span class="tx_700">生日購物金</span>
                                                                                <div style="display: flex; align-items: center; gap: 4px;">
                                                                                    <div class="tx_normal">生日購物金開啟</div>
                                                                                    ${BgWidget.switchButton(gvc, vm.data.birth.switch, (bool) => {
                                                            vm.data.birth.switch = bool;
                                                            gvc.notifyDataChange(id);
                                                        })}
                                                                                </div>
                                                                                <div>
                                                                                    ${EditorElem.radio({
                                                            gvc: gvc,
                                                            title: '購物金設定',
                                                            def: vm.data.birth.type,
                                                            array: [
                                                                {
                                                                    title: '統一給予',
                                                                    value: 'base',
                                                                    innerHtml: html `<div style="position: relative">
                                                                                                    ${gvc.map([
                                                                        BgWidget.leftLineBar(),
                                                                        BgWidget.editeInput({
                                                                            gvc: gvc,
                                                                            title: '購物金',
                                                                            default: `${vm.data.birth.value || ''}`,
                                                                            placeHolder: '0',
                                                                            callback: (text) => {
                                                                                vm.data.birth.value = parseInt(text, 10);
                                                                                gvc.notifyDataChange(id);
                                                                            },
                                                                            readonly: !vm.data.birth.switch,
                                                                            endText: '點',
                                                                            divStyle: 'margin-left: 22px;',
                                                                            titleStyle: 'font-size: 14px;',
                                                                        }),
                                                                    ])}
                                                                                                </div>`,
                                                                },
                                                                {
                                                                    title: '依會員等級給予',
                                                                    value: 'levels',
                                                                    innerHtml: gvc.bindView(() => {
                                                                        const levelVM = {
                                                                            id: gvc.glitter.getUUID(),
                                                                            loading: true,
                                                                            options: [],
                                                                        };
                                                                        return {
                                                                            bind: levelVM.id,
                                                                            view: () => {
                                                                                if (levelVM.loading) {
                                                                                    return BgWidget.spinner();
                                                                                }
                                                                                return html `<div style="position: relative">
                                                                                                                    ${gvc.map(vm.data.birth.level.map((item, index) => {
                                                                                    return html `
                                                                                                                                <div class="row d-flex align-items-center">
                                                                                                                                    <div class="col-6 mb-2">
                                                                                                                                        <div class="tx_normal">會員等級</div>
                                                                                                                                        ${BgWidget.select({
                                                                                        gvc: gvc,
                                                                                        callback: (text) => {
                                                                                            const n = vm.data.birth.level.findIndex((d) => {
                                                                                                return d.id === text;
                                                                                            });
                                                                                            if (n === -1 || n === index) {
                                                                                                item.id = text;
                                                                                            }
                                                                                            else {
                                                                                                dialog.infoMessage({
                                                                                                    text: '列表存在此會員等級，請重新選擇',
                                                                                                });
                                                                                            }
                                                                                            gvc.notifyDataChange(levelVM.id);
                                                                                        },
                                                                                        default: item.id,
                                                                                        options: levelVM.options,
                                                                                        readonly: !vm.data.birth.switch,
                                                                                        style: 'margin: 8px 0;',
                                                                                    })}
                                                                                                                                    </div>
                                                                                                                                    <div class="col-5 mb-2">
                                                                                                                                        ${BgWidget.editeInput({
                                                                                        gvc: gvc,
                                                                                        title: '購物金',
                                                                                        default: `${item.value || 0}`,
                                                                                        placeHolder: '請輸入購物金',
                                                                                        callback: (text) => {
                                                                                            item.value = parseInt(text, 10);
                                                                                            gvc.notifyDataChange(levelVM.id);
                                                                                        },
                                                                                        readonly: !vm.data.birth.switch,
                                                                                    })}
                                                                                                                                    </div>
                                                                                                                                    <div
                                                                                                                                        class="col-1 d-flex justify-content-start mb-2
                                                                                                                                    ${document.body.clientWidth > 768 ? '' : 'px-0'}"
                                                                                                                                    >
                                                                                                                                        <i
                                                                                                                                            class="fa-regular fa-trash fs-5 cursor_pointer"
                                                                                                                                            onclick="${gvc.event(() => {
                                                                                        if (!vm.data.birth.switch) {
                                                                                            return;
                                                                                        }
                                                                                        vm.data.birth.level.splice(index, 1);
                                                                                        gvc.notifyDataChange(levelVM.id);
                                                                                        vm.data.birth.type = 'levels';
                                                                                    })}"
                                                                                                                                        ></i>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            `;
                                                                                }))}
                                                                                                                </div>
                                                                                                                ${levelVM.options.length === vm.data.birth.level.length
                                                                                    ? ''
                                                                                    : (() => {
                                                                                        return html `<div
                                                                                                                              class="w-100 d-flex align-items-center justify-content-center cursor_pointer"
                                                                                                                              style="color: #36B; font-size: 16px; font-weight: 400; margin-top: 12px;"
                                                                                                                              onclick="${gvc.event(() => {
                                                                                            const opts = levelVM.options.filter((item) => {
                                                                                                return !vm.data.birth.level.find((lv) => lv.id === item.key);
                                                                                            });
                                                                                            if (opts.length > 0) {
                                                                                                vm.data.birth.level.push({
                                                                                                    id: opts[0].key,
                                                                                                    value: 0,
                                                                                                });
                                                                                            }
                                                                                            gvc.notifyDataChange(levelVM.id);
                                                                                            vm.data.birth.type = 'levels';
                                                                                        })}"
                                                                                                                          >
                                                                                                                              <div>新增一個區間</div>
                                                                                                                              <div>
                                                                                                                                  <i
                                                                                                                                      class="fa-solid fa-plus ps-2"
                                                                                                                                      style="font-size: 16px; height: 14px; width: 14px;"
                                                                                                                                  ></i>
                                                                                                                              </div>
                                                                                                                          </div>`;
                                                                                    })()}`;
                                                                            },
                                                                            onCreate: () => {
                                                                                if (levelVM.loading) {
                                                                                    ApiUser.getPublicConfig('member_level_config', 'manager').then((dd) => {
                                                                                        var _a;
                                                                                        if (dd.result && dd.response.value) {
                                                                                            levelVM.options = dd.response.value.levels.map((item) => {
                                                                                                return {
                                                                                                    key: item.id,
                                                                                                    value: item.tag_name,
                                                                                                };
                                                                                            });
                                                                                            vm.data.birth.level = (_a = vm.data.birth.level) !== null && _a !== void 0 ? _a : [];
                                                                                            levelVM.loading = false;
                                                                                            gvc.notifyDataChange(levelVM.id);
                                                                                        }
                                                                                    });
                                                                                }
                                                                            },
                                                                        };
                                                                    }),
                                                                },
                                                            ],
                                                            callback: (text) => {
                                                                vm.data.birth.type = text;
                                                            },
                                                        })}
                                                                                </div>
                                                                                <div>
                                                                                    <span class="tx_700">使用期限</span>
                                                                                    ${BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '',
                                                            default: `${vm.data.birth.date || ''}`,
                                                            placeHolder: '0',
                                                            callback: (text) => {
                                                                vm.data.birth.date = parseInt(text, 10);
                                                                gvc.notifyDataChange(id);
                                                            },
                                                            readonly: !vm.data.birth.switch || vm.data.birth.unlimited,
                                                            endText: '天',
                                                        })}
                                                                                    ${BgWidget.multiCheckboxContainer(gvc, [{ key: 'true', name: '無使用期限' }], vm.data.birth.unlimited ? ['true'] : [], (list) => {
                                                            vm.data.birth.unlimited = Boolean(list[0] === 'true');
                                                            gvc.notifyDataChange(id);
                                                        }, { readonly: !vm.data.birth.switch })}
                                                                                </div>
                                                                            </div>`;
                                                    },
                                                });
                                            })()),
                                            BgWidget.mainCard((() => {
                                                const id = glitter.getUUID();
                                                return gvc.bindView({
                                                    bind: id,
                                                    view: () => {
                                                        return html `<div style="display: flex; flex-direction: column; gap: 18px;">
                                                                                <span class="tx_700">購物金使用設定</span>
                                                                                <div class="gray-bottom-line-18">
                                                                                    ${EditorElem.radio({
                                                            gvc: gvc,
                                                            title: '折抵條件',
                                                            def: vm.data.config.condition.type,
                                                            array: [
                                                                {
                                                                    title: '單筆訂單達到指定金額',
                                                                    value: 'total_price',
                                                                    innerHtml: html `<div style="position: relative">
                                                                                                    ${gvc.map([
                                                                        BgWidget.leftLineBar(),
                                                                        BgWidget.editeInput({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            default: `${vm.data.config.condition.value || ''}`,
                                                                            placeHolder: '0',
                                                                            callback: (text) => {
                                                                                vm.data.config.condition.value = parseInt(text, 10);
                                                                                gvc.notifyDataChange(id);
                                                                            },
                                                                            endText: '元',
                                                                            divStyle: 'margin-left: 22px;',
                                                                        }),
                                                                    ])}
                                                                                                </div>`,
                                                                },
                                                                {
                                                                    title: '無折抵條件',
                                                                    value: 'none',
                                                                },
                                                            ],
                                                            callback: (text) => {
                                                                vm.data.config.condition.type = text;
                                                            },
                                                        })}
                                                                                </div>
                                                                                <div class="gray-bottom-line-18">
                                                                                    ${EditorElem.radio({
                                                            gvc: gvc,
                                                            title: '折抵上限',
                                                            def: vm.data.config.use_limit.type,
                                                            array: [
                                                                {
                                                                    title: '固定金額',
                                                                    value: 'price',
                                                                    innerHtml: html `<div style="position: relative">
                                                                                                    ${gvc.map([
                                                                        BgWidget.leftLineBar(),
                                                                        BgWidget.grayNote('最高能折抵', 'margin-left: 22px;'),
                                                                        BgWidget.editeInput({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            default: `${vm.data.config.use_limit.value || ''}`,
                                                                            placeHolder: '0',
                                                                            callback: (text) => {
                                                                                vm.data.config.use_limit.value = parseInt(text, 10);
                                                                                gvc.notifyDataChange(id);
                                                                            },
                                                                            endText: '元',
                                                                            divStyle: 'margin-left: 22px;',
                                                                            readonly: vm.data.config.customize,
                                                                        }),
                                                                    ])}
                                                                                                </div>`,
                                                                },
                                                                {
                                                                    title: '百分比',
                                                                    value: 'percent',
                                                                    innerHtml: html `<div style="position: relative">
                                                                                                    ${gvc.map([
                                                                        BgWidget.leftLineBar(),
                                                                        BgWidget.grayNote('最高能折抵', 'margin-left: 22px;'),
                                                                        BgWidget.editeInput((() => {
                                                                            function formatPercent(text) {
                                                                                const textInt = parseInt(`${text}`, 10);
                                                                                if (isNaN(textInt))
                                                                                    return 0;
                                                                                if (textInt < 0)
                                                                                    return 0;
                                                                                if (textInt > 100)
                                                                                    return 100;
                                                                                return textInt;
                                                                            }
                                                                            return {
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                default: `${formatPercent(vm.data.config.use_limit.value)}`,
                                                                                placeHolder: '0',
                                                                                callback: (text) => {
                                                                                    vm.data.config.use_limit.value = formatPercent(text);
                                                                                    gvc.notifyDataChange(id);
                                                                                },
                                                                                endText: '%',
                                                                                divStyle: 'margin-left: 22px;',
                                                                                readonly: vm.data.config.customize,
                                                                            };
                                                                        })()),
                                                                    ])}
                                                                                                </div>`,
                                                                },
                                                                {
                                                                    title: '無折抵上限',
                                                                    value: 'none',
                                                                },
                                                            ],
                                                            callback: (text) => {
                                                                vm.data.config.use_limit.type = text;
                                                            },
                                                        })}
                                                                                </div>
                                                                                <div style="display: flex; align-items: center; gap: 4px;">
                                                                                    <div class="tx_normal">允許顧客自行設定要折抵的金額</div>
                                                                                    ${BgWidget.switchButton(gvc, vm.data.config.customize, (bool) => {
                                                            vm.data.config.customize = bool;
                                                            gvc.notifyDataChange(id);
                                                        })}
                                                                                </div>
                                                                            </div>`;
                                                    },
                                                });
                                            })()),
                                        ].join(BgWidget.mbContainer(24));
                                    },
                                }),
                            ].join(BgWidget.mbContainer(24)),
                            ratio: 65,
                        }, {
                            html: gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    dataList: (() => {
                                        formatObject(vm.data);
                                        return vm.dataObjectList;
                                    })(),
                                    view: () => {
                                        return BgWidget.mainCard(gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return html `
                                                                            <h3 class="tx_700" style="margin-bottom: 18px;">摘要</h3>
                                                                            <div style="display: flex; gap: 12px; flex-direction: column;">
                                                                                ${gvc.map(getTextList().map((text) => {
                                                        return html ` <div class="${text.length > 0 ? 'tx_normal' : 'gray-top-bottom-line-6'}">${text}</div>`;
                                                    }))}
                                                                            </div>
                                                                        `;
                                                },
                                            };
                                        }));
                                    },
                                    divCreate: { class: 'summary-card p-0' },
                                };
                            }),
                            ratio: 35,
                        }),
                        BgWidget.mbContainer(240),
                        html `<div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => {
                            dialog.checkYesOrNot({
                                callback: (bool) => {
                                    if (bool) {
                                        vm.loading = true;
                                        gvc.notifyDataChange(vm.id);
                                    }
                                },
                                text: '確定要恢復預設值？',
                            });
                        }), '恢復預設值')}
                                        ${BgWidget.save(gvc.event(() => {
                            dialog.dataLoading({ text: '更新中', visible: true });
                            ApiUser.setPublicConfig({
                                key: 'rebate_setting',
                                value: vm.data,
                                user_id: 'manager',
                            }).then((data) => {
                                dialog.dataLoading({ text: '', visible: false });
                                if (data.result) {
                                    dialog.successMessage({ text: '更新成功' });
                                    vm.loading = true;
                                    gvc.notifyDataChange(vm.id);
                                }
                                else {
                                    dialog.errorMessage({ text: '更新異常' });
                                }
                            });
                        }))}
                                    </div>`,
                    ].join(''))}`);
                }
                return BgWidget.maintenance();
            },
            onCreate: () => {
                if (vm.loading) {
                    ApiUser.getPublicConfig('rebate_setting', 'manager').then((data) => {
                        if (data.response && data.response.value) {
                            vm.data = data.response.value;
                        }
                        vm.loading = false;
                        gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingRebateSetting);
