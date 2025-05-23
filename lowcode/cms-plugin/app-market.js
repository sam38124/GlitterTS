import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { Tool } from '../modules/tool.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { ApiMarket } from '../glitter-base/route/market.js';
const html = String.raw;
const css = String.raw;
export class AppMarket {
    static main(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            card_list_id: glitter.getUUID(),
            tag_list_id: glitter.getUUID(),
            type: 'landing',
            banner: {
                image: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_ses9s7s5sbs5sbse_%E5%AE%B6%E5%85%B7banner2.png',
                link: '',
            },
            app_list: [],
            show_app_list: [],
            tag_list: [],
            show_tag: '',
            query: '',
            orderString: 'name',
        };
        const dialog = new ShareDialog(gvc.glitter);
        const sortByName = () => {
            return vm.show_app_list.sort((a, b) => a.name.localeCompare(b.name));
        };
        const sortByPopularDesc = () => {
            return vm.show_app_list.sort((a, b) => b.download_count - a.download_count);
        };
        const sortByPopularAsc = () => {
            return sortByPopularDesc().reverse();
        };
        const sortByPriceDesc = () => {
            return vm.show_app_list.sort((a, b) => b.price - a.price);
        };
        const sortByPriceAsc = () => {
            return sortByPriceDesc().reverse();
        };
        const sortFun = {
            name: sortByName,
            popularity_desc: sortByPopularDesc,
            popularity_asc: sortByPopularAsc,
            price_desc: sortByPriceDesc,
            price_asc: sortByPriceAsc,
        };
        function drawBanner() {
            gvc.addStyle(css `
        .banner {
          background-image: url('${vm.banner.image}');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          height: 250px;
          width: 100%;
        }

        .banner h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .banner p {
          font-size: 16px;
          margin-bottom: 20px;
        }

        .btn {
          background-color: #fff;
          color: #4caf50;
          padding: 10px 20px;
          font-size: 16px;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .btn:hover {
          background-color: #45a049; /* Darker green on hover */
          color: white;
        }
      `);
            return html `<!-- Banner Section -->
        <div class="banner"></div> `;
        }
        function getAppList() {
            ApiMarket.getAppList().then((dd) => {
                vm.app_list = dd.response;
                filterAppTag();
                gvc.notifyDataChange(vm.id);
            });
        }
        function drawCard(app) {
            gvc.addStyle(css `
        .app-card {
          border-radius: 10px;
          border: 1px solid #ddd;
          background: #fff;
        }

        .card-image {
          padding-top: 50%;
          width: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .app-card .tag{
          height: 22px;
          padding: 2px 8px;
          border-radius: 5px;
          background: #EAEAEA;
          letter-spacing: 0.28px;
          font-size: 14px;
          font-weight: 400;
        }
      `);
            function drawTag(tag) {
                return html `<div class="tag d-flex align-items-center">${tag}</div>
        `;
            }
            return html `
        <div class="col-6 col-xl-3 px-3 pb-4" style="">
          <div class="d-flex flex-column app-card">
            <div class="card-image" style="background-image:url('${app.image}') "></div>
            <div class="d-flex flex-column " style="gap:10px;padding: 12px;">
              <div class="d-flex flex-column" style="gap: 6px;">
                <div class="d-flex flex-column" style="gap: 2px">
                  <div class="tx_700 tx_normal">${app.name}</div>
                  <div class="d-flex" style="gap:4px">
                    <div class="d-flex flex-fill align-items-center" style="gap: 4px;">
                      <i class="fa-solid fa-star" style="color: #FFB21C;"></i>
                      <div class="tx_yellow_12">${app.rate}</div>
                      <div class="tx_gray_12">(${app.rate_count})</div>
                    </div>
                    <div class="tx_gray_14" style="letter-spacing: 0.28px;">${app.price == 0 ? '免費' : app.price}</div>
                  </div>
                </div>
                <div class="tx_normal_14 text-break" style="letter-spacing: 0.28px;">
                  ${Tool.truncateString(app.description, 12)}
                </div>
              </div>
              <div class="d-flex" style="gap: 6px">
                ${app.tag.map(tag => {
                return drawTag(tag);
            }).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
        }
        function filterAppTag() {
            vm.app_list.forEach(app => {
                app.tag.forEach(tag => {
                    if (vm.tag_list.indexOf(tag) == -1) {
                        vm.tag_list.push(tag);
                    }
                });
            });
        }
        function drawTag(tag) {
            gvc.addStyle(css `
        .app-tag {
          display: flex;
          height: 40px;
          padding: 6px 18px;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          border: 1px solid #ddd;
          background: #fff;
          white-space: nowrap;
        }

        .app-tag-active {
          background-color: #dddddd;
        }

        .app-tag:hover {
          background-color: #dddddd;
        }
      `);
            return html `
        <div
          class="app-tag ${vm.show_tag == tag ? 'app-tag-active' : ''}"
          onclick="${gvc.event(() => {
                vm.show_tag = vm.show_tag === tag ? '' : tag;
                gvc.notifyDataChange(vm.id);
            })}"
        >
          ${tag}
        </div>
      `;
        }
        function drawSearchBar() {
            return html ` <div class="d-flex w-100" style="gap:14px;margin-bottom: 18px;">
        ${BgWidget.searchFilter(gvc.event(e => {
                vm.query = e.value;
                gvc.notifyDataChange(vm.id);
            }), vm.query || '', '搜尋APP')}
        ${BgWidget.updownFilter({
                gvc,
                callback: (value) => {
                    vm.orderString = value;
                    gvc.notifyDataChange(vm.id);
                },
                default: vm.orderString || 'default',
                options: FilterOptions.appMarketOrderBy,
            })}
      </div>`;
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'landing') {
                        if (vm.app_list.length === 0) {
                            getAppList();
                        }
                        vm.show_app_list = vm.show_app_list.length ? vm.show_app_list : vm.app_list;
                        return html `
              ${drawBanner()}
              <div class="px-4">
                ${BgWidget.mainCard(gvc.bindView({
                            bind: vm.tag_list_id,
                            view: () => {
                                return vm.tag_list
                                    .map(tag => {
                                    return drawTag(tag);
                                })
                                    .join('');
                            },
                            divCreate: {
                                class: 'd-flex w-100 overflow-scroll',
                                style: 'gap:10px;margin-bottom:10px',
                            },
                        }) +
                            drawSearchBar() +
                            gvc.bindView({
                                bind: vm.card_list_id,
                                view: () => {
                                    function filterApp() {
                                        var _a;
                                        if (vm.show_tag.length) {
                                            vm.show_app_list = vm.app_list.filter(app => {
                                                return app.tag.indexOf(vm.show_tag) != -1;
                                            });
                                        }
                                        else {
                                            vm.show_app_list = vm.app_list;
                                        }
                                        vm.show_app_list = sortFun[(_a = vm.orderString) !== null && _a !== void 0 ? _a : 'name']();
                                    }
                                    filterApp();
                                    return vm.show_app_list
                                        .map(app => {
                                        return drawCard(app);
                                    })
                                        .join('');
                                },
                                divCreate: {
                                    class: 'd-flex flex-wrap ',
                                    style: '',
                                },
                            }), 'px-3')}
              </div>
            `;
                    }
                    else {
                        return ``;
                    }
                },
                divCreate: {
                    class: 'd-flex flex-column',
                    style: 'gap: 24px;',
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, AppMarket);
