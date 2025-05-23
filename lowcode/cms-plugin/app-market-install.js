import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { Tool } from '../modules/tool.js';
import { ApiMarket } from '../glitter-base/route/market.js';
const html = String.raw;
const css = String.raw;
export class AppMarketInstall {
    static drawAppList(gvc, card_list_id, app_list) {
        gvc.addStyle(css `
        .app-card-border{
          border-radius: 10px;
          padding-bottom:18px;
        }
        .app-card{
          display: flex;
          padding: 20px;
          flex-direction: column;
          gap: 24px;
          border-radius: 10px;
          background: #FFF;
        }
      `);
        return gvc.bindView({
            bind: card_list_id,
            view: () => {
                return app_list.map(app => {
                    return html `
            <div class="app-card-border col-12 col-xl-4 ps-3 ps-xl-0 pe-3">
              <div class="app-card">
                <div class="d-flex" style="gap: 12px;">
                  <div class="h-100">
                    <img src="${app.image}" style="width: 40px;height: 40px;" alt="logo" />
                  </div>
                  <div class="d-flex flex-column flex-fill" style="gap: 6px;">
                    <div class="tx_700" style="line-height: 100%;">${app.name}</div>
                    <div class="d-flex w-100">
                      <div class="w-100 tx_yellow_14 d-flex align-items-center" style="gap:4px;">
                        <i class="fa-solid fa-star"></i>
                        <div class="tx_yellow_14">${app.rate}</div>
                        <div class="tx_gray_12 h-100 d-flex align-items-end">(${app.rate_count})</div>
                      </div>
                      <div class="ms-auto tx_gray_14">${app.price == 0 ? '免費' : app.price}</div>
                    </div>
                    <div class="d-flex tx_gray_14">
                      ${Tool.truncateString(app.description, 21)}
                    </div>
                  </div>
                </div>
                <div class="w-100 d-flex justify-content-end" style="gap:12px;">
                  ${BgWidget.cancel('', '移除')}
                  <button class="btn btn-gray tx_700" style="color:#393939">查看</button>
                </div>
              </div>
            </div>
            `;
                }).join('');
            }, divCreate: {
                class: 'd-flex flex-wrap',
            }
        });
    }
    static main(gvc) {
        const that = this;
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            card_list_id: glitter.getUUID(),
            app_list: [],
        };
        const dialog = new ShareDialog(gvc.glitter);
        function getAppList() {
            ApiMarket.getInstallAppList().then((dd) => {
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
          <div class="tx_700" style="font-size: 24px;margin-bottom: 18px;">已安裝APP</div>
          ${that.drawAppList(gvc, vm.card_list_id, vm.app_list)}
          `);
                }, divCreate: {
                    class: 'd-flex flex-column',
                    style: 'gap: 24px;'
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, AppMarketInstall);
