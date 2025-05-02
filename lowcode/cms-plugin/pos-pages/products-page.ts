import { OrderDetail, ViewModel } from './models.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { POSSetting } from '../POS-setting.js';
import { Swal } from '../../modules/sweetAlert.js';
import { PaymentPage } from './payment-page.js';
import { PayConfig } from './pay-config.js';

const html = String.raw;

export class ProductsPage {
  public static pageSplitV2 = (gvc: GVC, countPage: number, nowPage: number, callback: (p: number) => void) => {
    const generator = (n: number) => {
      return html`<li class="page-item my-0 mx-0">
        <div class="page-link-v2" onclick="${gvc.event(() => callback(n))}">${n}</div>
      </li>`;
    };
    const glitter = gvc.glitter;

    let vm = {
      id: glitter.getUUID(),
      loading: false,
      dataList: <any>[],
    };

    return gvc.bindView({
      bind: vm.id,
      view: () => {
        if (vm.loading) {
          return html`<div class="w-100 d-flex align-items-center justify-content-center p-3">
            <div class="spinner-border"></div>
          </div>`;
        } else {
          return html`
            <nav class="d-flex my-3 justify-content-center">
              <ul class="pagination pagination-rounded mb-0">
                <li class="page-item me-0">
                  <div
                    class="page-link-v2 page-link-prev"
                    aria-label="Previous"
                    style="cursor:pointer"
                    onclick="${gvc.event(() => {
                      nowPage - 1 > 0 && callback(nowPage - 1);
                    })}"
                  >
                    <i class="fa-solid fa-angle-left angle-style"></i>
                  </div>
                </li>
                ${glitter.print(() => {
                  let result = '';
                  // 產生前面四頁的按鈕
                  for (let i = Math.max(1, nowPage - 4); i < nowPage; i++) {
                    result += generator(i);
                  }
                  return result;
                })}
                <li class="page-item active mx-0" style="border-radius: 100%">
                  <div class="page-link-v2 page-link-active">${nowPage}</div>
                </li>
                ${glitter.print(() => {
                  let result = '';
                  // 產生後面四頁的按鈕
                  for (let i = nowPage + 1; i <= Math.min(nowPage + 4, countPage); i++) {
                    result += generator(i);
                  }
                  return result;
                })}
                <li class="page-item ms-0">
                  <div
                    class="page-link-v2 page-link-next"
                    aria-label="Next"
                    style="cursor:pointer"
                    onclick="${gvc.event(() => {
                      nowPage + 1 <= countPage && callback(nowPage + 1);
                    })}"
                  >
                    <i class="fa-solid fa-angle-right angle-style"></i>
                  </div>
                </li>
              </ul>
            </nav>
          `;
        }
      },
      divCreate: {},
      onCreate: () => {
        if (vm.loading) {
          vm.loading = false;
          gvc.notifyDataChange(vm.id);
        }
      },
    });
  };

  public static main(obj: { gvc: GVC; vm: ViewModel; orderDetail: OrderDetail }) {
    const swal = new Swal(obj.gvc);
    const gvc = obj.gvc;
    const vm = obj.vm;
    const orderDetail = obj.orderDetail;
    const dialog = new ShareDialog(gvc.glitter);
    (orderDetail as any).total = orderDetail.total || 0;
    const pVM = {
      pageSize: 0,
      pageIndex: 1,
      limit: 50,
    };

    function loadData() {
      let category = vm.categories.find((category: any) => category.select == true);
      dialog.dataLoading({ visible: true });
      ApiShop.getProduct({
        page: pVM.pageIndex - 1,
        collection: category.key == 'all' ? '' : category.key,
        limit: pVM.limit,
        search: vm.query,
        status: 'inRange',
        channel: POSSetting.config.where_store.includes('store_') ? 'pos' : 'exhibition',
        whereStore: POSSetting.config.where_store,
        orderBy: 'created_time_desc',
      }).then(res => {
        vm.productSearch = res.response.data;
        pVM.pageSize = Math.ceil(res.response.total / parseInt(pVM.limit as any, 10));
        dialog.dataLoading({ visible: false });
        gvc.notifyDataChange(`productShow`);
      });
    }

    loadData();
    gvc.glitter.share.reloadProduct = loadData;

    return html`
      <div
        class="left-panel"
        style="${document.body.offsetWidth < 800
          ? `width:calc(100%);padding-top: 42px`
          : `width:calc(100% - 352px);padding-top: 32px ;padding-bottom:32px;`}overflow: hidden;"
      >
        ${gvc.bindView({
          bind: `category`,
          view: () => {
            try {
              if (vm.categorySearch) {
                ApiShop.getCollection().then(r => {
                  vm.categorySearch = false;

                  r.response.value.forEach((data: any) => {
                    vm.categories.push({
                      key: data.code,
                      value: data.title,
                    });
                  });
                  gvc.notifyDataChange('category');
                });
              }

              return vm.categories
                .map((data: any) => {
                  return html`
                    <div
                      style="font-size: 18px;;width:131px;height:51px;margin-right:24px;white-space: nowrap;display: flex;padding: 12px 24px;justify-content: center;align-items: center;border-radius: 10px;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);${data?.select
                        ? `background: #393939;color: #FFF;`
                        : `background: #FFF;color#393939;`}"
                      onclick="${gvc.event(() => {
                        vm.categories.forEach(category => {
                          category.select = false;
                        });
                        data.select = true;
                        pVM.pageIndex = 1;
                        loadData();
                        gvc.notifyDataChange(['category', 'productShow']);
                      })}"
                    >
                      ${data.value}
                    </div>
                  `;
                })
                .join('');
            } catch (e) {
              console.error(e);
              return `${e}`;
            }
          },
          divCreate: {
            class: `d-flex px-3 `,
            style: `width:100%;overflow: scroll;padding-bottom:32px;${document.body.clientWidth > 992 ? `padding-left:32px !important;padding-right:32px !important;` : `padding-top:20px;`}`,
          },
        })}
        ${gvc.bindView(() => {
          return {
            bind: `productShow`,
            view: () => {
              let image = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
              let parent = document.querySelector(`.left-panel`) as HTMLElement;
              let rowItem = Math.floor((parent.offsetWidth - 72) / 188);
              rowItem = rowItem * 188 + 26 * (rowItem - 1) > parent.offsetWidth - 72 ? rowItem - 1 : rowItem;
              if (document.body.offsetWidth < 600) {
                rowItem = 2;
              }
              let maxwidth = (parent.offsetWidth - 72 - (rowItem - 1) * 26) / rowItem;
              if (document.body.offsetWidth < 600) {
                maxwidth += 10;
              }

              if (vm.productSearch.length > 0) {
                return (
                  vm.productSearch
                    .map(data => {
                      let selectVariant = data.content.variants[0];
                      data.content.specs.forEach((spec: any) => {
                        spec.option[0].select = true;
                      });

                      return html`
                        <div
                          class="d-flex flex-column mb-4 mb-sm-0"
                          style="max-width:${maxwidth}px;flex-basis: 188px;flex-grow: 1;border-radius: 10px;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);"
                          onclick="${gvc.event(() => {
                            POSSetting.productDialog({
                              gvc,
                              selectVariant,
                              defaultData: data,
                              orderDetail,
                              callback: data => {
                                selectVariant = data;
                              },
                            });
                          })}"
                        >
                          <div
                            class="w-100"
                            style="border-radius: 10px 10px 0 0;;padding-bottom: ${
                              (()=>{
                                if(PayConfig.pos_config.prdouct_card_layout){
                                  const wi=PayConfig.pos_config.prdouct_card_layout.split(':').map((dd:any)=>{
                                    return parseInt(dd,10)
                                  })
                                  return  parseInt(`${wi[0] / wi[1] * 100}`,10)
                                }else{
                                  return `56`
                                }
                              })()
                            }%;background: 50%/cover no-repeat url('${data
                              .content.preview_image[0] ??
                            image ??
                            image}');"
                          ></div>
                          <div class="d-flex flex-column" style="padding: 12px 10px;gap: 4px;">
                            <div
                              style="font-size: 18px;width: 100%;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;text-overflow: ellipsis;word-break: break-word;-webkit-box-orient: vertical;"
                            >
                              ${data.content.title ?? 'no name'}
                            </div>
                            <div
                              class="w-100 align-items-center justify-content-end"
                              style="font-size: 16px;font-weight: 700;text-align: right;"
                            >
                              NT.${parseInt(`${data.content.min_price ?? 0}`, 10).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      `;
                    })
                    .join('') +
                  html`
                    <div class="w-100">
                      ${this.pageSplitV2(gvc, pVM.pageSize, pVM.pageIndex, p => {
                        pVM.pageIndex = p;
                        (document.querySelector('html') as any).scrollTo(0, 0);
                        loadData();
                      })}
                    </div>
                  `
                );
              }
              return POSSetting.emptyView('查無相關商品');
            },
            divCreate: () => {
              if (document.body.offsetWidth < 800) {
                return {
                  class: `d-flex flex-wrap w-100 product-show`,
                  style: `overflow:scroll;max-height:100%;padding-left:24px;padding-right:24px;justify-content: space-between;padding-bottom:100px;`,
                };
              } else {
                return {
                  class: `d-flex flex-wrap w-100 product-show p-2`,
                  style: `gap:26px;overflow:scroll;max-height:100%;padding-bottom:100px !important;margin-left:32px;margin-right:32px;`,
                };
              }
            },
          };
        })}
      </div>
      ${(() => {
        const checkId = gvc.glitter.getUUID();
        let checking = true;
        let interVal: any = 0;

        async function checkStock() {
          checking = true;
          PaymentPage.storeHistory(orderDetail);
          checking = false;
          gvc.notifyDataChange(checkId);
        }

        gvc.glitter.share.checkStock = checkStock;
        checkStock();

        function checkStockInterVal() {
          clearInterval(interVal);
          interVal = setTimeout(() => checkStock(), 300);
        }

        const view = html` <div
          class=""
          style="height: 100%;width: 352px;max-width:100%;overflow: auto;${document.body.clientWidth > 800
            ? `padding: 36px 24px;`
            : `padding: 10px 12px;`};background: #FFF;box-shadow: 1px 0 10px 0 rgba(0, 0, 0, 0.10);"
        >
          ${gvc.bindView(() => {
            return {
              bind: checkId,
              view: () => {
                if (checking) {
                  return html` <div class="w-100 ">
                    <div
                      class="d-flex align-items-center justify-content-center mb-4 p-2 fw-500 rounded-3"
                      style="background: #ffb400;color:#393939;gap:10px;"
                    >
                      <div class="spinner-border" style="width:20px;height: 20px;"></div>
                      庫存檢查中...
                    </div>
                  </div>`;
                } else {
                  return html` <div style="color:#393939;font-size: 32px;font-weight: 700;letter-spacing: 3px;">
                    購物清單
                  </div>`;
                }
              },
              divCreate: {
                class: `d-flex flex-column`,
                style: `height:50px; margin-bottom:24px;margin-top:${gvc.glitter.share.top_inset}px;`,
              },
            };
          })}
          ${gvc.bindView({
            bind: 'order',
            dataList: [{ obj: vm, key: 'order' }],
            view: () => {
              orderDetail.subtotal = 0;
              orderDetail.lineItems.forEach(item => {
                orderDetail.subtotal += item.sale_price * item.count;
              });
              return html`
                <div style="display: flex;flex-direction: column;gap: 18px;">
                  ${orderDetail.lineItems
                    .map((item, index) => {
                      return html`
                        ${index > 0 ? `<div style="background-color: #DDD;height:1px;width: 100%;"></div>` : ''}
                        <div class="d-flex align-items-center" style="min-height: 87px;">
                          <div
                            class="rounded-3"
                            style="background: 50%/cover url('${item.preview_image ||
                            'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'}');height: 67px;width: 66px;margin-right: 12px; min-height: 67px;min-width: 66px;"
                          ></div>
                          <div class="d-flex flex-column flex-fill">
                            <div>${item.title}</div>
                            <div class="d-flex" style="gap:4px;">
                              ${item.spec.length > 0
                                ? item.spec
                                    .map(spec => {
                                      return html` <div
                                        style="color: #949494;font-size: 16px;font-style: normal;font-weight: 500;"
                                      >
                                        ${spec}
                                      </div>`;
                                    })
                                    .join('')
                                : '單一規格'}
                            </div>
                            <div class="d-flex align-items-center" style="margin-top:6px;">
                              <div
                                style="display: flex;width: 30px;height: 30px;padding: 8px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;"
                                onclick="${gvc.event(() => {
                                  item.count = item.count < 2 ? item.count : item.count - 1;
                                  checkStockInterVal();
                                  gvc.notifyDataChange('order');
                                })}"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                >
                                  <path
                                    d="M9.64314 5C9.64314 5.3457 9.32394 5.625 8.92885 5.625H1.07171C0.676618 5.625 0.357422 5.3457 0.357422 5C0.357422 4.6543 0.676618 4.375 1.07171 4.375H8.92885C9.32394 4.375 9.64314 4.6543 9.64314 5Z"
                                    fill="white"
                                  />
                                </svg>
                              </div>
                              <input
                                class="border-0"
                                style="width: 50px;height: 25px;color: #393939;font-size: 18px;font-weight: 500;text-align: center"
                                value="${item.count}"
                                onchange="${gvc.event(e => {
                                  const category = orderDetail.lineItems[index].product_category;
                                  const n = category === 'weighing' ? parseFloat(e.value) : parseInt(e.value);
                                  item.count = isNaN(n) ? 0 : n;
                                  checkStockInterVal();
                                  gvc.notifyDataChange('order');
                                })}"
                              />
                              <div
                                style="display: flex;width: 30px;height: 30px;padding: 8px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;"
                                onclick="${gvc.event(() => {
                                  item.count++;
                                  checkStockInterVal();
                                  gvc.notifyDataChange('order');
                                })}"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="10"
                                  height="10"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                >
                                  <path
                                    d="M5.76923 0.769231C5.76923 0.34375 5.42548 0 5 0C4.57452 0 4.23077 0.34375 4.23077 0.769231V4.23077H0.769231C0.34375 4.23077 0 4.57452 0 5C0 5.42548 0.34375 5.76923 0.769231 5.76923H4.23077V9.23077C4.23077 9.65625 4.57452 10 5 10C5.42548 10 5.76923 9.65625 5.76923 9.23077V5.76923H9.23077C9.65625 5.76923 10 5.42548 10 5C10 4.57452 9.65625 4.23077 9.23077 4.23077H5.76923V0.769231Z"
                                    fill="white"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div class="h-100 d-flex flex-column align-items-end justify-content-between">
                            <div
                              class=""
                              onclick="${gvc.event(() => {
                                const rmProd = orderDetail.lineItems[index];
                                PaymentPage.rmProductHistory(rmProd.id);
                                orderDetail.lineItems.splice(index, 1);
                                if (document.querySelector('.js-cart-count')) {
                                  (document.querySelector('.js-cart-count') as any).recreateView();
                                }
                                gvc.notifyDataChange('order');
                              })}"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                              >
                                <path d="M1 1L13 13" stroke="#949494" stroke-width="2" stroke-linecap="round" />
                                <path d="M13 1L1 13" stroke="#949494" stroke-width="2" stroke-linecap="round" />
                              </svg>
                            </div>

                            <div
                              style="color:#393939;font-size: 18px;font-style: normal;font-weight: 500;letter-spacing: 0.72px;"
                            >
                              $${(item.sale_price * item.count).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      `;
                    })
                    .join('')}
                </div>
                <div
                  class="w-100"
                  style="margin-top: 24px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;display: flex;padding: 24px;flex-direction: column;justify-content: center;"
                >
                  <div class="w-100 d-flex flex-column" style="gap: 6px;">
                    ${(() => {
                      let tempData = [
                        {
                          left: `小計總額`,
                          right: parseInt((orderDetail.subtotal ?? 0) as any, 10).toLocaleString(),
                        },
                        // {
                        //     left: `活動折扣`,
                        //     right: parseInt((orderDetail.discount ?? 0) as any, 10).toLocaleString()
                        // }
                      ];
                      return tempData
                        .map(data => {
                          return html`
                            <div class="w-100 d-flex">
                              <div style="font-size: 18px;font-style: normal;font-weight: 700;">${data.left}</div>
                              <div class="ms-auto" style="font-size: 16px;font-weight: 700;">$ ${data.right}</div>
                            </div>
                          `;
                        })
                        .join(``);
                    })()}
                  </div>
                </div>
              `;
            },
            onCreate: () => {
              const dialog = new ShareDialog(gvc.glitter);
              obj.gvc.glitter.share.scan_back = (text: string) => {
                dialog.dataLoading({ visible: true });
                ApiShop.getProduct({
                  page: 0,
                  limit: 50000,
                  accurate_search_text: true,
                  search: text,
                  status: 'inRange',
                  channel: POSSetting.config.where_store.includes('store_') ? 'pos' : 'exhibition',
                  whereStore: POSSetting.config.where_store,
                  orderBy: 'created_time_desc',
                }).then(res => {
                  dialog.dataLoading({ visible: false });
                  if (res.response.data[0]) {
                    const data = res.response.data[0];
                    const selectVariant = res.response.data[0].content.variants.find((d1: any) => d1.barcode === text);
                    if (
                      !orderDetail.lineItems.find(dd => {
                        return dd.id + dd.spec.join('-') === data.id + selectVariant.spec.join('-');
                      })
                    ) {
                      orderDetail.lineItems.push({
                        id: data.id,
                        title: data.content.title,
                        preview_image:
                          selectVariant.preview_image.length > 1
                            ? selectVariant.preview_image
                            : data.content.preview_image[0],
                        spec: selectVariant.spec,
                        count: 0,
                        sale_price: selectVariant.sale_price,
                        sku: selectVariant.sku,
                      });
                    }
                    orderDetail.lineItems.find(dd => {
                      return dd.id + dd.spec.join('-') === data.id + selectVariant.spec.join('-');
                    })!.count++;
                    gvc.notifyDataChange('order');
                  } else {
                    swal.toast({ icon: 'error', title: '無此商品' });
                  }

                  gvc.notifyDataChange(`order`);
                });
              };
            },
          })}

          <div
            style="margin-top: 32px;display: flex;padding: 12px 24px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;font-size: 20px;font-style: normal;font-weight: 500;color: #FFF;"
            onclick="${gvc.event(() => {
              vm.type = 'payment';
              gvc.glitter.closeDrawer();
            })}"
          >
            前往結帳
          </div>
        </div>`;
        if (document.body.offsetWidth < 800) {
          gvc.glitter.setDrawer(view, () => {});
          return '';
        } else {
          return view;
        }
      })()}
    `;
  }
}
