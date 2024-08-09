var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiRecommend } from '../glitter-base/route/recommend.js';
export class BgRecommend {
    static main(gvc, widget) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            type: 'list',
            index: 0,
            editData: {},
            dataList: undefined,
            query: '',
            group: { type: 'level', title: '', tag: '' },
        };
        const filterID = glitter.getUUID();
        let vmi = undefined;
        function getDatalist() {
            const prefixURL = `https://${window.parent.glitter.share.editorViewModel.domain}`;
            return vm.dataList.map((dd, index) => {
                var _a;
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
                            },
                            style: 'height: 37.5px;',
                        }),
                    },
                    {
                        key: '分銷連結名稱',
                        value: `<span class="fs-7">${dd.title}</span>`,
                    },
                    {
                        key: '連結網址',
                        value: `<span class="fs-7">${prefixURL + ((_a = dd.link) !== null && _a !== void 0 ? _a : '')}</span>`,
                    },
                    {
                        key: '總金額',
                        value: `<span class="fs-7">${dd.total_price.toLocaleString()}</span>`,
                    },
                    {
                        key: '曝光量',
                        value: `<span class="fs-7">${dd.exposure.toLocaleString()}</span>`,
                    },
                    {
                        key: '下單數',
                        value: `<span class="fs-7">${dd.orders.toLocaleString()}</span>`,
                    },
                    {
                        key: '轉換率',
                        value: `<span class="fs-7">${dd.conversion_rate}%</span>`,
                    },
                    {
                        key: '分潤獎金',
                        value: `<span class="fs-7">${dd.sharing_bonus.toLocaleString()}</span>`,
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
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('分銷連結')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增', gvc.event(() => {
                            vm.type = 'add';
                            gvc.notifyDataChange(vm.id);
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vd) => __awaiter(this, void 0, void 0, function* () {
                                vmi = vd;
                                ApiRecommend.getList({
                                    data: {},
                                    token: window.parent.config.token,
                                }).then((data) => {
                                    console.log(data);
                                    vmi.pageSize = 1;
                                    vm.dataList = [
                                        {
                                            title: '與YT貓皇的貓跳台合作，給貓咪最好的跳台！',
                                            link: '/pages/oneyone',
                                            total_price: 3100,
                                            exposure: 200,
                                            orders: 26,
                                            conversion_rate: 70,
                                            sharing_bonus: 234,
                                            code: 'XY0001',
                                            condition: 1200,
                                            share_type: 'fix',
                                            share_value: 100,
                                            voucher_status: 'no',
                                            recommend_status: 'old',
                                            recommend_user_id: '123',
                                            recommend_medium: [],
                                            startDate: '2024-08-09',
                                            startTime: '16:00',
                                            endDate: '2024-08-17',
                                            endTime: '16:00',
                                        },
                                    ];
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            }),
                            style: ['', 'max-width: 100px; white-space: normal !important;', 'max-width: 200px; white-space: normal !important; overflow-wrap: break-word;'],
                            rowClick: (data, index) => {
                                vm.editData = vm.dataList[index];
                                vm.type = 'replace';
                            },
                            filter: html `
                                                ${gvc.bindView(() => {
                                return {
                                    bind: filterID,
                                    view: () => {
                                        const dialog = new ShareDialog(glitter);
                                        const selCount = vm.dataList.filter((dd) => dd.checked).length;
                                        return BgWidget.selNavbar({
                                            count: selCount,
                                            buttonList: [
                                                BgWidget.selEventButton('批量移除', gvc.event(() => {
                                                    dialog.checkYesOrNot({
                                                        text: '是否確認刪除所選項目？',
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
                                                                        gvc.notifyDataChange(vm.id);
                                                                    }, 500);
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
                                            class: `d-flex align-items-center p-2 py-3 ${!vm.dataList ||
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
                    else if (vm.type === 'add') {
                        return this.editor({
                            gvc: gvc,
                            widget: widget,
                            data: {},
                            callback: () => {
                                vm.type = 'list';
                            },
                        });
                    }
                    return this.editor({
                        gvc: gvc,
                        widget: widget,
                        data: vm.editData,
                        callback: () => {
                            vm.type = 'list';
                        },
                    });
                },
                divCreate: {
                    class: `mx-auto `,
                    style: `max-width:100%;width:960px;`,
                },
            };
        });
    }
    static editor(cf) {
        const html = String.raw;
        const gvc = cf.gvc;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const vm = {
            id: glitter.getUUID(),
            previewId: glitter.getUUID(),
            noteId: glitter.getUUID(),
            data: cf.data,
            original_data: undefined,
            loading: false,
        };
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return BgWidget.spinner({ textNone: true });
                    }
                    return BgWidget.container([
                        html ` <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.goBack(gvc.event(() => {
                            cf.callback();
                        }))}
                                ${BgWidget.title(vm.data.title || '新增分銷連結')}
                                <div class="flex-fill"></div>
                            </div>`,
                        html `<div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                                ${BgWidget.container(gvc.bindView(() => {
                            const id = glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                    const inputStyle = 'font-size: 16px; height:40px; width:200px;';
                                    let map = [
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">連結網址</div>`,
                                            html ` <div class="tx_normal">分銷代碼</div>
                                                                <div style="margin: 4px 0 8px;">
                                                                    ${BgWidget.grayNote('是一段唯一的識別碼，用於系統追蹤和記錄通過該代碼完成的銷售', 'font-size: 14px;')}
                                                                </div>
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: (_a = vm.data.code) !== null && _a !== void 0 ? _a : '',
                                                placeHolder: '請輸入分銷代碼',
                                                callback: (text) => {
                                                    vm.data.code = text;
                                                },
                                            })}`,
                                            html ` <div class="tx_normal">導向網頁</div>
                                                                ${BgWidget.linkList({
                                                gvc: gvc,
                                                title: '',
                                                default: (_b = vm.data.link) !== null && _b !== void 0 ? _b : '',
                                                placeHolder: '選擇或貼上外部連結',
                                                callback: (text) => {
                                                    vm.data.link = text;
                                                    gvc.notifyDataChange(vm.previewId);
                                                },
                                            })}`,
                                            gvc.bindView({
                                                bind: vm.previewId,
                                                view: () => {
                                                    var _a;
                                                    const prefixURL = `https://${window.parent.glitter.share.editorViewModel.domain}`;
                                                    const url = prefixURL + ((_a = vm.data.link) !== null && _a !== void 0 ? _a : '');
                                                    return html ` <div class="tx_normal">網址預覽</div>
                                                                        ${BgWidget.mbContainer(8)}
                                                                        <div class="d-flex align-items-center">
                                                                            <div
                                                                                class="form-control cursor_pointer"
                                                                                style="background:#F7F7F7; color: #4D86DB; font-size: 16px;"
                                                                                onclick="${gvc.event(() => glitter.openNewTab(url))}"
                                                                            >
                                                                                ${url}
                                                                            </div>
                                                                        </div>`;
                                                },
                                            }),
                                            html ` <div class="tx_700">基本設定</div>`,
                                            html ` <div class="tx_normal">分銷連結名稱</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                default: (_c = vm.data.title) !== null && _c !== void 0 ? _c : '',
                                                placeHolder: '請輸入分銷連結名稱',
                                                callback: (text) => {
                                                    vm.data.title = text;
                                                },
                                            })}`,
                                        ].join(BgWidget.mbContainer(18))),
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">分潤條件</div>`,
                                            html ` <div class="tx_700">訂單滿額</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'number',
                                                default: (_d = vm.data.condition) !== null && _d !== void 0 ? _d : 0,
                                                placeHolder: '請輸入分銷代碼',
                                                callback: (text) => {
                                                    vm.data.condition = parseInt(`${text}`, 10);
                                                },
                                                unit: '元',
                                            })}`,
                                            BgWidget.horizontalLine(),
                                            html ` <div class="tx_700">分潤類型</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${BgWidget.multiCheckboxContainer(gvc, [
                                                { key: 'none', name: '沒有分潤' },
                                                {
                                                    key: 'fix',
                                                    name: '固定金額',
                                                    innerHtml: html `<div style="margin: 4px 0 8px;">${BgWidget.grayNote('每筆訂單分潤固定金額', 'font-size: 14px;')}</div>
                                                                                ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'number',
                                                        default: (_e = vm.data.share_value) !== null && _e !== void 0 ? _e : 0,
                                                        placeHolder: '0',
                                                        callback: (text) => {
                                                            vm.data.share_value = parseInt(`${text}`, 10);
                                                        },
                                                        unit: '元',
                                                    })}`,
                                                },
                                                {
                                                    key: 'percent',
                                                    name: '百分比',
                                                    innerHtml: html `<div style="margin: 4px 0 8px;">
                                                                                    ${BgWidget.grayNote('分潤計算方式為: (訂單結算金額 - 運費)*分潤百分比', 'font-size: 14px;')}
                                                                                </div>
                                                                                ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'number',
                                                        default: (() => {
                                                            const n = parseInt(vm.data.share_value, 10);
                                                            if (n > 100) {
                                                                return '100';
                                                            }
                                                            else if (n < 0) {
                                                                return '0';
                                                            }
                                                            return `${n}`;
                                                        })(),
                                                        placeHolder: '0',
                                                        callback: (text) => {
                                                            const n = parseInt(text, 10);
                                                            vm.data.share_value = (() => {
                                                                if (n > 100) {
                                                                    return 100;
                                                                }
                                                                else if (n < 0) {
                                                                    return 0;
                                                                }
                                                                return n;
                                                            })();
                                                        },
                                                        unit: '%',
                                                    })}`,
                                                },
                                            ], [(_f = vm.data.share_type) !== null && _f !== void 0 ? _f : ''], (data) => {
                                                vm.data.share_type = data[0];
                                            }, { single: true })}`,
                                        ].join(BgWidget.mbContainer(18))),
                                        BgWidget.mainCard((() => {
                                            const id = gvc.glitter.getUUID();
                                            return gvc.bindView({
                                                bind: id,
                                                view: () => {
                                                    var _a, _b;
                                                    return html `<div class="tx_700">優惠折扣</div>
                                                                        ${BgWidget.mbContainer(8)}
                                                                        ${BgWidget.multiCheckboxContainer(gvc, [
                                                        { key: 'no', name: '不套用折扣' },
                                                        {
                                                            key: 'yes',
                                                            name: '套用折扣',
                                                            innerHtml: html `<div style="margin: 4px 0 8px;">
                                                                                            ${BgWidget.grayNote('請至「優惠促銷」新增折扣，折扣方式必須勾選「供分銷連結使用」', 'font-size: 14px;')}
                                                                                        </div>
                                                                                        ${BgWidget.select({
                                                                gvc: gvc,
                                                                callback: (text) => {
                                                                    vm.data.voucher = text;
                                                                },
                                                                default: (_a = vm.data.voucher) !== null && _a !== void 0 ? _a : '',
                                                                options: [
                                                                    { key: '123', value: '123' },
                                                                    { key: '456', value: '456' },
                                                                    { key: '789', value: '789' },
                                                                ],
                                                            })}`,
                                                        },
                                                    ], [(_b = vm.data.voucher_status) !== null && _b !== void 0 ? _b : ''], (data) => {
                                                        vm.data.voucher_status = data[0];
                                                    }, { single: true })}
                                                                        ${BgWidget.mbContainer(18)} ${BgWidget.horizontalLine()} ${BgWidget.mbContainer(18)}
                                                                        <div class="tx_700">優惠概覽</div>
                                                                        <div class="tx_normal">優惠活動名稱: 專屬B網紅優惠</div>`;
                                                },
                                            });
                                        })()),
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">推薦人帳號</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'old',
                                                    name: '現有推薦人',
                                                    innerHtml: html `<div>
                                                                                ${BgWidget.select({
                                                        gvc: gvc,
                                                        callback: (text) => {
                                                            vm.data.recommend_user_id = text;
                                                        },
                                                        default: (_g = vm.data.recommend_user_id) !== null && _g !== void 0 ? _g : '',
                                                        options: [
                                                            { key: '123', value: '123' },
                                                            { key: '456', value: '456' },
                                                            { key: '789', value: '789' },
                                                        ],
                                                    })}
                                                                            </div>`,
                                                },
                                                { key: 'new', name: '添加新推薦人' },
                                            ], [(_h = vm.data.recommend_status) !== null && _h !== void 0 ? _h : ''], (data) => {
                                                vm.data.recommend_status = data[0];
                                            }, { single: true })}`,
                                            html ` <div class="tx_700">推薦媒介（可複選）</div>
                                                                ${BgWidget.mbContainer(8)}
                                                                ${BgWidget.selectDropList({
                                                gvc: gvc,
                                                callback: (value) => {
                                                    vm.data.recommend_medium = value;
                                                },
                                                default: [],
                                                options: [
                                                    { key: 'youtube', value: 'Youtube' },
                                                    { key: 'facebook', value: 'Facebook' },
                                                    { key: 'instagram', value: 'Instagram' },
                                                    { key: 'threads', value: 'Threads' },
                                                    { key: 'dcard', value: 'Dcard' },
                                                    { key: 'ptt', value: 'PTT' },
                                                    { key: 'other', value: '其他' },
                                                ],
                                                style: 'width: 100%; background-position-x: 97.5%;',
                                            })}`,
                                        ].join(BgWidget.mbContainer(18))),
                                        BgWidget.mainCard([
                                            html ` <div class="tx_700">活動時間</div>`,
                                            html `<div class="tx_normal">開始時間</div>`,
                                            html ` <div class="d-flex mb-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'date',
                                                style: inputStyle,
                                                default: (_j = vm.data.startDate) !== null && _j !== void 0 ? _j : '',
                                                placeHolder: '',
                                                callback: (text) => {
                                                    vm.data.startDate = text;
                                                },
                                            })}
                                                                ${EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'time',
                                                style: inputStyle,
                                                default: (_k = vm.data.startTime) !== null && _k !== void 0 ? _k : '',
                                                placeHolder: '',
                                                callback: (text) => {
                                                    vm.data.startTime = text;
                                                },
                                            })}
                                                            </div>`,
                                            BgWidget.multiCheckboxContainer(gvc, [
                                                {
                                                    key: 'withEnd',
                                                    name: '設定結束時間',
                                                    innerHtml: html `<div class="d-flex mt-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 12px">
                                                                            ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'date',
                                                        style: inputStyle,
                                                        default: vm.data.endDate,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            vm.data.endDate = text;
                                                        },
                                                    })}
                                                                            ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        type: 'time',
                                                        style: inputStyle,
                                                        default: vm.data.endTime,
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                            vm.data.endTime = text;
                                                        },
                                                    })}
                                                                        </div>`,
                                                },
                                            ], [], (data) => {
                                                var _a, _b;
                                                if (data[0] !== 'withEnd') {
                                                    vm.data.endDate = undefined;
                                                    vm.data.endTime = undefined;
                                                }
                                                else {
                                                    vm.data.endDate = (_a = vm.data.endDate) !== null && _a !== void 0 ? _a : this.getDateTime(7).date;
                                                    vm.data.endTime = (_b = vm.data.endTime) !== null && _b !== void 0 ? _b : this.getDateTime(7).time;
                                                }
                                            }, { single: false }),
                                        ].join(BgWidget.mbContainer(18))),
                                    ];
                                    return map.join(BgWidget.mbContainer(24));
                                },
                                divCreate: { class: 'p-0' },
                                onCreate: () => {
                                },
                            };
                        }), undefined, 'padding: 0; margin: 0 !important; width: 65%;')}
                                ${BgWidget.container(gvc.bindView(() => {
                            return {
                                bind: vm.noteId,
                                view: () => {
                                    const money = parseInt(`${vm.data.condition.value}`, 10).toLocaleString();
                                    return BgWidget.mainCard(html `
                                                    <div class="tx_normal fw-bold">摘要</div>
                                                    <div class="tx_normal fw-normal" style="margin-top: 18px;margin-bottom: 18px;">會員名稱: ${vm.data.tag_name || '尚未設定'}</div>
                                                    <div class="w-100" style="background: #DDD;height: 2px;"></div>
                                                    <div class="tx_normal fw-normal" style="margin-top: 18px;">
                                                        會員條件: ${vm.data.condition.type === 'single' ? `單筆消費金額${money}元` : `累計消費金額${money}元`}
                                                    </div>
                                                    <div class="tx_normal fw-normal" style="margin-top: 12px;margin-bottom: 18px;">
                                                        計算期間: ${vm.data.duration.type === 'noLimit' ? `不計算期限` : `${vm.data.duration.value}天`} 天內消費
                                                    </div>
                                                    <div class="w-100" style="background: #DDD;height: 2px;"></div>
                                                    <div class="tx_normal fw-normal" style="margin-top: 18px;">
                                                        會員期限: ${vm.data.dead_line.type === 'noLimit' ? `沒有期限` : `${vm.data.dead_line.value}天`}
                                                    </div>
                                                `);
                                },
                                divCreate: { class: 'summary-card p-0' },
                            };
                        }), undefined, 'padding: 0; margin: 0 !important; width: 35%;')}
                            </div>`,
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                                ${BgWidget.cancel(gvc.event(() => {
                            cf.callback();
                        }))}
                                ${BgWidget.save(gvc.event(() => {
                            console.log(vm.data);
                        }))}
                            </div>`,
                    ].join('<div class="my-2"></div>'), BgWidget.getContainerWidth(), 'position: relative');
                },
            };
        });
    }
}
BgRecommend.getDateTime = (n = 0) => {
    const now = new Date();
    now.setDate(now.getDate() + n);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:00`;
    return { date: dateStr, time: timeStr };
};
window.glitter.setModule(import.meta.url, BgRecommend);
