import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { UserList } from './user-list.js';

export class MemberTypeList {
  public static main(gvc: GVC, widget: any) {
    const html = String.raw;
    const glitter = gvc.glitter;
    const vm: {
      id: string;
      type: 'groupList' | 'list' | 'replace' | 'subscriber';
      index: number;
      group: { type: string; title: string };
      dataList: any;
      tabs: { title: string; key: string }[];
    } = {
      id: glitter.getUUID(),
      type: 'groupList',
      group: { type: '', title: '' },
      index: 0,
      dataList: [],
      tabs: [],
    };
    let vmi: any = undefined;

    function getDatalist() {
      return vm.dataList
        .filter((dd: any) => {
          return dd.type !== 'level';
        })
        .map((dd: any) => {
          return [
            {
              key: '分群名稱',
              value: `<span class="fs-7">${dd.title}</span>`,
            },
            {
              key: '顧客數',
              value: `<span class="fs-7">${dd.count}</span>`,
            },
            {
              key: '查閱名單',
              value: BgWidget.customButton({
                button: { color: 'gray', size: 'sm' },
                text: { name: '查閱名單' },
                event: gvc.event(() => {
                  if (dd.type === 'subscriber') {
                    vm.type = 'subscriber';
                  } else {
                    vm.type = 'list';
                  }
                  vm.group = dd;
                  gvc.notifyDataChange(vm.id);
                }),
              }),
            },
          ];
        });
    }

    return gvc.bindView(() => {
      return {
        bind: vm.id,
        dataList: [{ obj: vm, key: 'type' }],
        view: () => {
          if (vm.type === 'groupList') {
            return BgWidget.container(html`
              <div class="title-container">
                ${BgWidget.title('顧客分群')}
                <div class="flex-fill"></div>
              </div>
              ${BgWidget.container(
                BgWidget.mainCard(
                  BgWidget.tableV3({
                    gvc: gvc,
                    getData: async vd => {
                      vmi = vd;
                      ApiUser.getUserGroupList().then((dd: any) => {
                        vm.dataList = dd.response.data;
                        vmi.pageSize = 1;
                        vmi.originalData = vm.dataList;
                        vmi.tableData = getDatalist();
                        vmi.loading = false;
                        vmi.callback();
                      });
                    },
                    rowClick: () => {},
                    filter: [],
                  })
                )
              )}
            `);
          } else if (vm.type === 'subscriber') {
            return UserList.main(gvc, {
              group: vm.group,
              createUserEvent: MemberTypeList.createSubscriberView(gvc, vm),
              backButtonEvent: gvc.event(() => {
                vm.type = 'groupList';
              }),
            });
          } else {
            return UserList.main(gvc, {
              group: vm.group,
              backButtonEvent: gvc.event(() => {
                vm.type = 'groupList';
              }),
            });
          }
        },
        divCreate: {
          class: `mx-auto`,
          style: `max-width:100%;width:960px;`,
        },
      };
    });
  }

  public static createSubscriberView(gvc: GVC, vm: any) {
    const html = String.raw;
    return gvc.event(() => {
      gvc.glitter.innerDialog(gvc2 => {
        let mail = '';
        let tag = '';
        return html`<div class="modal-content bg-white rounded-3 p-2" style="max-width:90%; width:400px;">
          <div class="border-bottom ms-1 my-2 pb-2">
            <span class="tx_700">新增推播信箱</span>
          </div>
          <div class="px-1 mb-1">
            ${BgWidget.editeInput({
              gvc: gvc,
              title: '信箱',
              default: '',
              placeHolder: '請輸入信箱',
              callback: text => {
                mail = text;
              },
            })}
            ${BgWidget.editeInput({
              gvc: gvc,
              title: '標籤',
              default: '',
              placeHolder: '請輸入標籤',
              callback: text => {
                tag = text;
              },
            })}
          </div>
          <div class="modal-footer mb-0 pt-1 pb-0">
            ${BgWidget.cancel(
              gvc.event(() => {
                gvc2.closeDialog();
              })
            )}
            ${BgWidget.save(
              gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                dialog.dataLoading({ visible: true });
                ApiUser.subScribe(mail, tag).then(response => {
                  dialog.dataLoading({ visible: false });
                  if (response.result) {
                    dialog.successMessage({ text: '新增成功' });
                    vm.type = 'subscriber';
                    gvc2.closeDialog();
                  } else {
                    dialog.errorMessage({ text: '發生錯誤' });
                  }
                });
              })
            )}
          </div>
        </div>`;
      }, 'add');
    });
  }
}

(window as any).glitter.setModule(import.meta.url, MemberTypeList);
