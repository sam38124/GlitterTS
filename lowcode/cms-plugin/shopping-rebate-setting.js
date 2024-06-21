import { ShareDialog } from '../dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
const html = String.raw;
export class ShoppingRebateSetting {
    static main(gvc) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        const vm = {
            id: glitter.getUUID(),
            loading: true,
            type: '',
            data: {},
            dataList: undefined,
        };
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return BgWidget.container(html ` <div class="d-flex w-100 align-items-center">
                                ${BgWidget.title('列表名')}
                                <div class="flex-fill"></div>
                                <div style="display: flex; gap: 14px;">
                                    ${BgWidget.grayButton('按鈕1', gvc.event(() => {
                        console.log('灰色按鈕1');
                    }))}
                                    ${BgWidget.darkButton('按鈕2', gvc.event(() => {
                        console.log('黑色按鈕2');
                    }))}
                                </div>
                            </div>
                            ${BgWidget.container([
                        BgWidget.mainCard(html `1234`),
                        html `<div style="margin-bottom: 240px"></div>`,
                        html `<div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => {
                            dialog.successMessage({ text: '取消' });
                        }))}
                                        ${BgWidget.save(gvc.event(() => {
                            dialog.dataLoading({ text: '更新中', visible: true });
                            setTimeout(() => {
                                const response = { result: true };
                                dialog.dataLoading({ text: '', visible: false });
                                if (response.result) {
                                    dialog.successMessage({ text: '更新成功' });
                                    vm.loading = true;
                                    gvc.notifyDataChange(vm.id);
                                }
                                else {
                                    dialog.errorMessage({ text: '更新異常' });
                                }
                            }, 1000);
                        }))}
                                    </div>`,
                    ].join(html `<div style="margin-top: 24px"></div>`))}`, BgWidget.getContainerWidth());
                }
                return BgWidget.maintenance();
            },
            onCreate: () => {
                vm.loading = !vm.loading;
            },
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingRebateSetting);
