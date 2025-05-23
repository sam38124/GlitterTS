import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiWallet } from '../glitter-base/route/wallet.js';
import { UserList } from './user-list.js';
import { Tool } from '../modules/tool.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiMarket } from '../glitter-base/route/market.js';
import { AppMarketInstall } from './app-market-install.js';

const html=String.raw;
const css = String.raw;


interface App {
  name: string;
  image: string;
  link: string;
  rate: number;
  rate_count: number;
  description: string;
  tag: string[];
  price: number;
}
export class AppMarketPublished {
  public static main(gvc: GVC) {
    const glitter = gvc.glitter;
    const vm: {
      id: string;
      card_list_id:string;
      app_list: App[];
    } = {
      id: glitter.getUUID(),
      card_list_id:glitter.getUUID(),
      app_list: [],
    };
    const dialog = new ShareDialog(gvc.glitter);
    function getAppList() {
      ApiMarket.getPublishedAppList().then((dd: any) => {
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
          return BgWidget.container(html`
          <div class="tx_700" style="font-size: 24px;margin-bottom: 18px;">已發佈APP</div>
          ${AppMarketInstall.drawAppList(gvc , vm.card_list_id , vm.app_list)}
          `)

        },divCreate:{
          class:'d-flex flex-column',
          style:'gap: 24px;'
        },
      };
    });
  }

}

(window as any).glitter.setModule(import.meta.url, AppMarketPublished);
