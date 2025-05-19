import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShopee } from '../glitter-base/route/shopee.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { response } from 'express';

const css = String.raw;

interface IShopeeBlock {
  btnText: string;
  url: string;
  title: string;
  subTitle: string;
  click: (blockID: string) => void;
}

//todo 這邊需要一個開關是 讓客戶決定有沒需要讓shopnex主動同步shopee
export class MarketShopee {
  public static main(gvc: GVC) {
    const html = String.raw;
    const shopee = localStorage.getItem('shopeeCode');
    const id = gvc.glitter.getUUID();
    let loading = false;
    let first = true;

    function reload(id: String) {
      gvc.notifyDataChange(id);
    }

    //
    function showShopeeBlock(blockData: IShopeeBlock) {
      const blockID = gvc.glitter.getUUID();
      return BgWidget.mainCard(html`
        ${gvc.bindView(() => {
          return {
            bind: blockID,
            view: async () => {
              if (first) {
                let res = await ApiShopee.syncStatus();
                loading = res.response.result;
                first = false;
              }
              return [
                html`
                  <div class="tx_700 d-flex flex-column">${blockData.title}</div>
                  ${BgWidget.grayNote(blockData.subTitle)}
                  <div>
                    ${loading
                      ? BgWidget.grayButton(
                          html` <div class="d-flex align-items-center" style="gap:8px;">
                            <div class="spinner-border spinner" style="width:20px;height: 20px;"></div>
                            同步中請稍候...
                          </div>`,
                          gvc.event(() => {})
                        )
                      : ``}
                    <button
                      class="shopee-btn ${loading ? `d-none` : ``}"
                      onclick="${gvc.event(() => {
                        blockData.click(blockID);
                      })}"
                    >
                      ${blockData.btnText}
                    </button>
                  </div>
                `,
              ].join('');
            },
            divCreate: {
              class: `d-flex flex-column`,
              style: 'gap:8px;',
            },
            onCreate: () => {
              ApiShopee.syncStatus().then(res => {
                loading = res.response.result;
                if (gvc.glitter.share.shopee_interval) {
                  clearInterval(gvc.glitter.share.shopee_interval);
                }
                gvc.glitter.share.shopee_interval = setTimeout(() => {
                  gvc.notifyDataChange(blockID);
                }, 1000);
              });
            },
          };
        })}
      `);
    }

    if (shopee) {
      const data: {
        code: string;
        shop_id: number;
      } = JSON.parse(shopee);
      ApiShopee.getToken(data.code, data.shop_id);
      localStorage.removeItem('shopeeCode');
    }
    return (
      BgWidget.container(
        gvc.bindView(() => {
          const id = gvc.glitter.getUUID();
          const key = 'marketShopee';
          const vm: {
            loading: boolean;
            data: {
              offer_ID: string;
              advertiser_ID: string;
              commission: string;
            };
            config: any;
          } = {
            loading: true,
            data: {
              offer_ID: '',
              advertiser_ID: '',
              commission: '',
            },
            config: {},
          };

          function save_shopee() {
            ApiUser.setPublicConfig({
              key: 'shopp_config',
              value: vm.config,
              user_id: 'manager',
            });
          }

          function drawDialog(callback: (startTime: string, endTime: string , gvc:GVC) => void) {
            const today = new Date().toISOString().split('T')[0];
            let startDate = today;
            let endDate = today;
            gvc.glitter.innerDialog((gvc: GVC) => {
              gvc.addStyle(css`
                /* 外部容器 */

                .shopee-sync {
                  background: #fff;
                  border: 1px solid #e0e0e0;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                  width: 300px;
                  text-align: center;
                }

                /* 標題樣式 */

                .sync-header {
                  font-size: 18px;
                  font-weight: bold;
                  color: #ee4d2d;
                  margin-bottom: 20px;
                }

                /* 輸入區域 */

                .sync-body {
                  margin-bottom: 20px;
                }

                .sync-body label {
                  display: block;
                  font-size: 14px;
                  color: #333;
                  margin-bottom: 5px;
                  text-align: left;
                }

                .sync-input {
                  width: 100%;
                  padding: 10px;
                  font-size: 14px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  margin-bottom: 15px;
                  box-sizing: border-box;
                  outline: none;
                  transition: border-color 0.3s;
                }

                .sync-input:focus {
                  border-color: #ee4d2d;
                }

                /* 按鈕樣式 */

                .sync-button {
                  background-color: #ee4d2d;
                  color: #fff;
                  font-size: 16px;
                  font-weight: bold;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  transition: background-color 0.3s;
                  width: 100%;
                }

                .sync-button:hover {
                  background-color: #d44123;
                }

                .sync-button:active {
                  background-color: #b8341b;
                }

                /* 響應式樣式 */
                @media (max-width: 400px) {
                  .shopee-sync {
                    width: 90%;
                  }
                }
              `);
              return html`
                <div
                  id="date-sync"
                  style="position:relative;background: #fff;border: 1px solid #e0e0e0;border-radius: 8px;box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);padding: 20px;width: 300px;text-align: center;"
                >
                  <i
                    class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                    style="position: absolute;right: 5px; top: 5px;"
                    onclick="${gvc.event(() => {
                      gvc.closeDialog();
                    })}"
                  ></i>
                  <div class="sync-header">選擇同步商品的日期區間</div>
                  <div class="sync-body">
                    <label for="start-date">開始日期：</label>
                    <input
                      type="date"
                      id="start-date"
                      value="${startDate}"
                      class="sync-input"
                      onchange="${gvc.event((e: any) => {
                        startDate = e.value;
                      })}"
                    />
                    <label for="end-date">結束日期：</label>
                    <input
                      type="date"
                      id="end-date"
                      value="${endDate}"
                      class="sync-input"
                      onchange="${gvc.event((e: any) => {
                        if (new Date(startDate) > new Date(endDate)) {
                          alert('開始日期不能晚於結束日期');
                          return;
                        }
                        endDate = e.value;
                      })}"
                    />
                  </div>
                  <button
                    id="confirm-btn"
                    class="sync-button"
                    onclick="${gvc.event(() => {
                      callback(startDate, endDate , gvc);
                    })}"
                  >
                    確定
                  </button>
                </div>
              `;
            }, 'sync');
          }

          Promise.all([
            ApiUser.getPublicConfig(key, 'manager'),
            ApiUser.getPublicConfig('shopp_config', 'manager'),
          ]).then(dd => {
            vm.loading = false;
            dd[0].response.value && (vm.data = dd[0].response.value);
            vm.config = dd[1].response.value;
            vm.config.auto_async = vm.config.auto_async ?? true;
            gvc.notifyDataChange(id);
          });

          gvc.addStyle(css`
            .shopee-btn {
              background-color: #fb5533; /* 主橙色 */
              color: #ffffff; /* 白色文字 */
              border: none; /* 無邊框 */
              border-radius: 5px; /* 圓角按鍵 */
              padding: 10px 20px; /* 按鍵內邊距 */
              font-size: 16px; /* 文字大小 */
              font-weight: bold; /* 粗體文字 */
              cursor: pointer; /* 指針樣式 */
              transition: all 0.3s ease; /* 漸變效果 */
            }

            .shopee-btn:hover {
              background-color: #d94428; /* 深橙色 */
            }

            .shopee-btn:active {
              background-color: #c03d24; /* 更深的橙色 */
            }
          `);
          return {
            bind: id,
            view: () => {
              if (vm.loading) {
                return BgWidget.spinner();
              }
              const html = String.raw;
              return [
                html` <div class="title-container">
                  ${BgWidget.title('蝦皮串接與同步')}
                  <div class="flex-fill"></div>
                </div>`,
                BgWidget.mbContainer(18),
                BgWidget.mainCard(html`
                  <div class="d-flex flex-column" style="gap:12px;">
                    <div class="tx_700 d-flex align-items-center" style="gap:5px;">
                      當前商店授權狀態
                      ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                          bind: id,
                          view: async () => {
                            const access_token = await ApiPageConfig.getPrivateConfig(
                              (window.parent as any).appName,
                              'shopee_access_token'
                            );
                            if (access_token.response.result[0] && access_token.response.result[0].value.access_token) {
                              let dead_line = new Date(access_token.response.result[0]['updated_at']);
                              dead_line.setTime(dead_line.getTime() + 30 * 3600 * 24 * 1000);
                              return BgWidget.infoInsignia(
                                `已授權至 ${gvc.glitter.ut.dateFormat(dead_line, 'yyyy-MM-dd')}`
                              );
                            } else {
                              return BgWidget.warningInsignia('尚未授權');
                            }
                          },
                        };
                      })}
                    </div>
                    <div>
                      為了啟用蝦皮相關服務，請點擊下方按鈕進行授權操作，蝦皮授權有效期限為30天，請定期前往此頁面刷新有效期限。
                    </div>
                  </div>
                  <button
                    class="shopee-btn mt-3"
                    onclick="${gvc.event(() => {
                      localStorage.setItem('shopee', window.parent.location.href);
                      ApiShopee.generateAuth(window.parent.location.href);
                    })}"
                  >
                    授權蝦皮
                  </button>
                  <button
                    class="shopee-btn mt-3 d-none"
                    onclick="${gvc.event(() => {
                      localStorage.setItem('shopee', window.parent.location.href);
                      ApiShopee.generateOrderAuth(window.parent.location.href);
                    })}"
                  >
                    授權訂單同步
                  </button>
                `),
                BgWidget.mbContainer(18),
                showShopeeBlock({
                  btnText: '匯入商品',
                  subTitle: '如要同步蝦皮商品庫存，請先匯入蝦皮商品。',
                  title: '匯入蝦皮商品',
                  url: '',
                  click: blockID => {
                    drawDialog((startDate,endDate ,gvcDialog)=>{
                      const startTime = Math.floor(new Date(startDate).getTime() / 1000);
                      const endTime = Math.floor(new Date(endDate).getTime() / 1000);

                      ApiShopee.getItemList(startTime, endTime, (response: any) => {
                        gvcDialog.closeDialog();
                        gvc.notifyDataChange(blockID);
                      });

                      loading = true;
                    })
                  },
                }),
                //todo 訂單同步
                // BgWidget.mbContainer(18),
                // showShopeeBlock({
                //   btnText: '匯入訂單',
                //   subTitle: '如要同步蝦皮訂單，請先匯入定單。',
                //   title: '匯入蝦皮訂單',
                //   url: '',
                //   click: (blockID) => {
                //     drawDialog((startDate,endDate ,gvcDialog)=>{
                //       const startTime = Math.floor(new Date(startDate).getTime() / 1000);
                //       const endTime = Math.floor(new Date(endDate).getTime() / 1000);
                //
                //       ApiShopee.getOrderList(startTime, endTime, (response: any) => {
                //         gvcDialog.closeDialog();
                //         gvc.notifyDataChange(blockID);
                //       });
                //
                //       loading = true;
                //     })
                //   },
                // }),
              ].join('');
            },
          };
        })
      ) + BgWidget.mbContainer(120)
    );
  }
}

(window as any).glitter.setModule(import.meta.url, MarketShopee);
