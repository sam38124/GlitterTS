import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { BgWidget, OptionsItem } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';

const html = String.raw;

export class UserModule {
  static setUserTags(gvc: GVC, arr: string[]) {
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

  static addTags(obj: { gvc: GVC; vm: any; dataArray: any }) {
    const gvc = obj.gvc;
    const dataArray = obj.dataArray;
    const dialog = new ShareDialog(gvc.glitter);
    const vmt = {
      id: gvc.glitter.getUUID(),
      loading: true,
      dataList: [] as string[],
      postData: JSON.parse(JSON.stringify([])) as string[],
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
            } else {
              return [
                BgWidget.searchPlace(
                  gvc2.event(e => {
                    vmt.search = e.value;
                    vmt.loading = true;
                    gvc2.notifyDataChange(vmt.id);
                  }),
                  vmt.search,
                  '搜尋標籤',
                  '0',
                  '0'
                ),
                BgWidget.grayNote('勾選的標籤，將會從已選取顧客的資料中新增'),
                BgWidget.renderOptions(gvc2, vmt),
              ].join(BgWidget.mbContainer(18));
            }
          },
          onCreate: () => {
            if (vmt.loading) {
              ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd: any) => {
                if (dd.result && dd.response?.value?.list) {
                  vmt.dataList = dd.response.value.list.filter((item: string) => item.includes(vmt.search));
                  vmt.loading = false;
                  gvc2.notifyDataChange(vmt.id);
                } else {
                  this.setUserTags(gvc2, []);
                }
              });
            }
          },
        });
      },
      footer_html: gvc2 => {
        return [
          html`<div
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
          BgWidget.save(
            gvc2.event(() => {
              const ids = dataArray.map((data: any) => data.userID).filter(Boolean);
              ApiUser.batchAddTag({ userId: ids, tags: vmt.postData }).then(() => {
                dialog.successMessage({ text: '「新增標籤」更新完成' });
                gvc.notifyDataChange(obj.vm.id);
              });
              gvc2.closeDialog();
              dialog.successMessage({ text: '準備開始更新資料，請稍後' });
              gvc.notifyDataChange(obj.vm.progressId);
            })
          ),
        ].join('');
      },
    });
  }

  static removeTags(obj: { gvc: GVC; vm: any; dataArray: any }) {
    const gvc = obj.gvc;
    const dataArray = obj.dataArray;
    const dialog = new ShareDialog(gvc.glitter);
    const vmt = {
      id: gvc.glitter.getUUID(),
      loading: true,
      dataList: [] as string[],
      postData: JSON.parse(JSON.stringify([])) as string[],
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
            } else {
              return [
                BgWidget.grayNote('勾選的標籤，將會從已選取顧客的資料中移除'),
                BgWidget.renderOptions(gvc2, vmt),
              ].join(BgWidget.mbContainer(18));
            }
          },
          divCreate: {},
          onCreate: () => {
            if (vmt.loading) {
              ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd: any) => {
                if (dd.result && dd.response?.value?.list) {
                  vmt.dataList = dd.response.value.list;
                  vmt.loading = false;
                  gvc2.notifyDataChange(vmt.id);
                } else {
                  this.setUserTags(gvc2, []);
                }
              });
            }
          },
        });
      },
      footer_html: gvc2 => {
        return [
          html`<div
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
          BgWidget.save(
            gvc2.event(() => {
              const ids = dataArray.map((data: any) => data.userID).filter(Boolean);
              ApiUser.batchRemoveTag({ userId: ids, tags: vmt.postData }).then(() => {
                dialog.successMessage({ text: '「移除標籤」更新完成' });
                gvc.notifyDataChange(obj.vm.id);
              });
              gvc2.closeDialog();
              dialog.successMessage({ text: '準備開始更新資料，請稍後' });
              gvc.notifyDataChange(obj.vm.progressId);
            })
          ),
        ].join('');
      },
    });
  }

  static manualSetLevel(obj: { gvc: GVC; vm: any; dataArray: any }) {
    const gvc = obj.gvc;
    const dataArray = obj.dataArray;
    const dialog = new ShareDialog(gvc.glitter);
    const levelVM = {
      id: gvc.glitter.getUUID(),
      loading: true,
      options: [] as { key: string; value: string }[],
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
            } else {
              levelVM.level = levelVM.options[0].key;
              return html`
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
              ApiUser.getPublicConfig('member_level_config', 'manager').then((dd: any) => {
                if (dd.result && dd.response?.value?.levels) {
                  levelVM.options = dd.response.value.levels.map((item: { id: string; tag_name: string }) => {
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
          BgWidget.save(
            gvc2.event(async () => {
              const ids = dataArray.map((data: any) => data.userID).filter(Boolean);
              ApiUser.batchManualLevel({ userId: ids, level: levelVM.level }).then(() => {
                dialog.successMessage({ text: '「手動修改會員標籤」更新完成' });
                gvc.notifyDataChange(obj.vm.id);
              });
              gvc2.closeDialog();
              dialog.successMessage({ text: '準備開始更新資料，請稍後' });
              gvc.notifyDataChange(obj.vm.progressId);
            })
          ),
        ].join('');
      },
    });
  }

  static deleteUsers(obj: { gvc: GVC; dataArray: any; callback: () => void }) {
    const gvc = obj.gvc;
    const dataArray = obj.dataArray;
    const dialog = new ShareDialog(gvc.glitter);
    dialog.warningMessage({
      text: '您即將批量刪除所選顧客的所有資料<br />此操作無法復原。確定要刪除嗎？',
      callback: response => {
        if (response) {
          dialog.dataLoading({ visible: true });
          ApiUser.deleteUser({
            id: dataArray.map((dd: any) => dd.id).join(','),
          }).then(res => {
            dialog.dataLoading({ visible: false });
            if (res.result) {
              obj.callback();
            } else {
              dialog.errorMessage({ text: '刪除失敗' });
            }
          });
        }
      },
    });
  }

  static failedUpdateDialog(gvc: GVC, failedUpdates: any[], checkedDataLength: number) {
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

          let vmi: any = undefined;
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
                rowClick: () => {},
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

  static batchProcess = async (dataArray: any[], batchSize: number = 20) => {
    const results = [];
    const totalBatches = Math.ceil(dataArray.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      // 取得當前批次的資料
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, dataArray.length);
      const currentBatch = dataArray.slice(startIndex, endIndex);

      // 處理當前批次
      const batchResults = await Promise.all(
        currentBatch.map((item: any) => ApiUser.updateUserDataManager(item, item.userID))
      );

      results.push(...batchResults);

      // 如果不是最後一批，則等待50毫秒
      if (i < totalBatches - 1) {
        await new Promise<void>(resolve => setTimeout(resolve, 50));
      }
    }

    return results;
  };
}
