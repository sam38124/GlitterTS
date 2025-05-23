import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiMarket } from '../glitter-base/route/market.js';
import { AppMarketInstall } from './app-market-install.js';
const html = String.raw;
const css = String.raw;
export class AppMarketPublished {
    static main(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            card_list_id: glitter.getUUID(),
            app_list: [],
        };
        const dialog = new ShareDialog(gvc.glitter);
        function getAppList() {
            ApiMarket.getPublishedAppList().then((dd) => {
                vm.app_list = dd.response;
                gvc.notifyDataChange(vm.id);
            });
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.app_list.length === 0) {
                        getAppList();
                    }
                    return BgWidget.container(html `
          <div class="tx_700" style="font-size: 24px;margin-bottom: 18px;">已發佈APP</div>
          ${AppMarketInstall.drawAppList(gvc, vm.card_list_id, vm.app_list)}
          `);
                }, divCreate: {
                    class: 'd-flex flex-column',
                    style: 'gap: 24px;'
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, AppMarketPublished);
