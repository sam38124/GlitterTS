var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
const html = String.raw;
export class UserModule {
    static setUserTags(gvc, arr) {
        const dialog = new ShareDialog(gvc.glitter);
        const list = [...new Set(arr)];
        dialog.dataLoading({ visible: true });
        ApiUser.setPublicConfig({
            key: 'user_general_tags',
            value: { list },
            user_id: 'manager',
        }).then(() => {
            dialog.dataLoading({ visible: false });
        });
    }
    static addTags(obj) {
        const gvc = obj.gvc;
        const dataArray = obj.dataArray;
        const dialog = new ShareDialog(gvc.glitter);
        const vmt = {
            id: gvc.glitter.getUUID(),
            loading: true,
            dataList: [],
            postData: JSON.parse(JSON.stringify([])),
            search: '',
        };
        BgWidget.settingDialog({
            gvc,
            title: '批量新增標籤',
            innerHTML: gvc2 => {
                return gvc2.bindView({
                    bind: vmt.id,
                    view: () => {
                        if (vmt.loading) {
                            return BgWidget.spinner();
                        }
                        else {
                            return [
                                BgWidget.searchPlace(gvc2.event(e => {
                                    vmt.search = e.value;
                                    vmt.loading = true;
                                    gvc2.notifyDataChange(vmt.id);
                                }), vmt.search, '搜尋標籤', '0', '0'),
                                BgWidget.grayNote('勾選的標籤，將會從已選取顧客的資料中新增'),
                                BgWidget.renderOptions(gvc2, vmt),
                            ].join(BgWidget.mbContainer(18));
                        }
                    },
                    onCreate: () => {
                        if (vmt.loading) {
                            ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd) => {
                                var _b, _c;
                                if (dd.result && ((_c = (_b = dd.response) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.list)) {
                                    vmt.dataList = dd.response.value.list.filter((item) => item.includes(vmt.search));
                                    vmt.loading = false;
                                    gvc2.notifyDataChange(vmt.id);
                                }
                                else {
                                    this.setUserTags(gvc2, []);
                                }
                            });
                        }
                    },
                });
            },
            footer_html: gvc2 => {
                return [
                    html `<div
            style="color: #393939; text-decoration-line: underline; cursor: pointer"
            onclick="${gvc2.event(() => {
                        vmt.postData = [];
                        vmt.loading = true;
                        gvc2.notifyDataChange(vmt.id);
                    })}"
          >
            清除全部
          </div>`,
                    BgWidget.cancel(gvc2.event(() => gvc2.closeDialog())),
                    BgWidget.save(gvc2.event(() => {
                        const ids = dataArray.map((data) => data.userID).filter(Boolean);
                        ApiUser.batchAddTag({ userId: ids, tags: vmt.postData }).then(() => {
                            dialog.successMessage({ text: '「新增標籤」更新完成' });
                            gvc.notifyDataChange(obj.vm.id);
                        });
                        gvc2.closeDialog();
                        dialog.successMessage({ text: '準備開始更新資料，請稍後' });
                        gvc.notifyDataChange(obj.vm.progressId);
                    })),
                ].join('');
            },
        });
    }
    static removeTags(obj) {
        const gvc = obj.gvc;
        const dataArray = obj.dataArray;
        const dialog = new ShareDialog(gvc.glitter);
        const vmt = {
            id: gvc.glitter.getUUID(),
            loading: true,
            dataList: [],
            postData: JSON.parse(JSON.stringify([])),
        };
        BgWidget.settingDialog({
            gvc,
            title: '批量刪除標籤',
            innerHTML: gvc2 => {
                return gvc2.bindView({
                    bind: vmt.id,
                    view: () => {
                        if (vmt.loading) {
                            return BgWidget.spinner();
                        }
                        else {
                            return [
                                BgWidget.grayNote('勾選的標籤，將會從已選取顧客的資料中移除'),
                                BgWidget.renderOptions(gvc2, vmt),
                            ].join(BgWidget.mbContainer(18));
                        }
                    },
                    divCreate: {},
                    onCreate: () => {
                        if (vmt.loading) {
                            ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd) => {
                                var _b, _c;
                                if (dd.result && ((_c = (_b = dd.response) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.list)) {
                                    vmt.dataList = dd.response.value.list;
                                    vmt.loading = false;
                                    gvc2.notifyDataChange(vmt.id);
                                }
                                else {
                                    this.setUserTags(gvc2, []);
                                }
                            });
                        }
                    },
                });
            },
            footer_html: gvc2 => {
                return [
                    html `<div
            style="color: #393939; text-decoration-line: underline; cursor: pointer"
            onclick="${gvc2.event(() => {
                        vmt.postData = [];
                        vmt.loading = true;
                        gvc2.notifyDataChange(vmt.id);
                    })}"
          >
            清除全部
          </div>`,
                    BgWidget.cancel(gvc2.event(() => gvc2.closeDialog())),
                    BgWidget.save(gvc2.event(() => {
                        const ids = dataArray.map((data) => data.userID).filter(Boolean);
                        ApiUser.batchRemoveTag({ userId: ids, tags: vmt.postData }).then(() => {
                            dialog.successMessage({ text: '「移除標籤」更新完成' });
                            gvc.notifyDataChange(obj.vm.id);
                        });
                        gvc2.closeDialog();
                        dialog.successMessage({ text: '準備開始更新資料，請稍後' });
                        gvc.notifyDataChange(obj.vm.progressId);
                    })),
                ].join('');
            },
        });
    }
    static manualSetLevel(obj) {
        const gvc = obj.gvc;
        const dataArray = obj.dataArray;
        const dialog = new ShareDialog(gvc.glitter);
        const levelVM = {
            id: gvc.glitter.getUUID(),
            loading: true,
            options: [],
            level: '',
        };
        BgWidget.settingDialog({
            gvc,
            title: '手動調整等級',
            innerHTML: gvc2 => {
                return gvc2.bindView({
                    bind: levelVM.id,
                    view: () => {
                        if (levelVM.loading) {
                            return BgWidget.spinner();
                        }
                        else {
                            levelVM.level = levelVM.options[0].key;
                            return html `
                ${BgWidget.grayNote('此功能針對特殊會員，手動調整後將無法自動升級')}
                ${BgWidget.select({
                                gvc: gvc2,
                                default: levelVM.level,
                                callback: key => {
                                    levelVM.level = key;
                                },
                                options: levelVM.options,
                                style: 'margin: 8px 0;',
                            })}
              `;
                        }
                    },
                    onCreate: () => {
                        if (levelVM.loading) {
                            ApiUser.getPublicConfig('member_level_config', 'manager').then((dd) => {
                                var _b, _c;
                                if (dd.result && ((_c = (_b = dd.response) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.levels)) {
                                    levelVM.options = dd.response.value.levels.map((item) => {
                                        return {
                                            key: `${item.id}`,
                                            value: item.tag_name,
                                        };
                                    });
                                    levelVM.loading = false;
                                    gvc2.notifyDataChange(levelVM.id);
                                }
                            });
                        }
                    },
                });
            },
            footer_html: gvc2 => {
                return [
                    BgWidget.cancel(gvc2.event(() => gvc2.closeDialog())),
                    BgWidget.save(gvc2.event(() => __awaiter(this, void 0, void 0, function* () {
                        const ids = dataArray.map((data) => data.userID).filter(Boolean);
                        ApiUser.batchManualLevel({ userId: ids, level: levelVM.level }).then(() => {
                            dialog.successMessage({ text: '「手動修改會員標籤」更新完成' });
                            gvc.notifyDataChange(obj.vm.id);
                        });
                        gvc2.closeDialog();
                        dialog.successMessage({ text: '準備開始更新資料，請稍後' });
                        gvc.notifyDataChange(obj.vm.progressId);
                    }))),
                ].join('');
            },
        });
    }
    static deleteUsers(obj) {
        const gvc = obj.gvc;
        const dataArray = obj.dataArray;
        const dialog = new ShareDialog(gvc.glitter);
        dialog.warningMessage({
            text: '您即將批量刪除所選顧客的所有資料<br />此操作無法復原。確定要刪除嗎？',
            callback: response => {
                if (response) {
                    dialog.dataLoading({ visible: true });
                    ApiUser.deleteUser({
                        id: dataArray.map((dd) => dd.id).join(','),
                    }).then(res => {
                        dialog.dataLoading({ visible: false });
                        if (res.result) {
                            obj.callback();
                        }
                        else {
                            dialog.errorMessage({ text: '刪除失敗' });
                        }
                    });
                }
            },
        });
    }
    static failedUpdateDialog(gvc, failedUpdates, checkedDataLength) {
        const dialog = new ShareDialog(gvc.glitter);
        return dialog.checkYesOrNot({
            text: `部分用戶更新失敗 (${failedUpdates.length}/${checkedDataLength})`,
            callback: bool => {
                if (bool) {
                    const failedArray = failedUpdates.map(e => {
                        const user = e.response.data.data.userData;
                        return [
                            {
                                key: '顧客名稱',
                                value: `<span class="fs-7">${user.name || '－'}</span>`,
                            },
                            {
                                key: '電子信箱',
                                value: `<span class="fs-7">${user.email || '－'}</span>`,
                            },
                            {
                                key: '手機',
                                value: `<span class="fs-7">${user.phone || '－'}</span>`,
                            },
                            {
                                key: '錯誤原因',
                                value: '系統操作頻繁，更新失敗',
                            },
                        ];
                    });
                    let vmi = undefined;
                    BgWidget.dialog({
                        gvc,
                        title: '更新失敗訊息',
                        width: 800,
                        innerHTML: gvc => {
                            return BgWidget.tableV3({
                                gvc: gvc,
                                getData: vd => {
                                    vmi = vd;
                                    setTimeout(() => {
                                        vmi.pageSize = 0;
                                        vmi.originalData = failedArray;
                                        vmi.tableData = failedArray;
                                        vmi.loading = false;
                                        vmi.callback();
                                    }, 200);
                                },
                                rowClick: () => { },
                                filter: [],
                                hiddenPageSplit: true,
                            });
                        },
                    });
                }
            },
            yesString: '查看訊息',
            notString: '忽略',
        });
    }
}
_a = UserModule;
UserModule.batchProcess = (dataArray, batchSize = 20) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    const totalBatches = Math.ceil(dataArray.length / batchSize);
    for (let i = 0; i < totalBatches; i++) {
        const startIndex = i * batchSize;
        const endIndex = Math.min(startIndex + batchSize, dataArray.length);
        const currentBatch = dataArray.slice(startIndex, endIndex);
        const batchResults = yield Promise.all(currentBatch.map((item) => ApiUser.updateUserDataManager(item, item.userID)));
        results.push(...batchResults);
        if (i < totalBatches - 1) {
            yield new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    return results;
});
