import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { PaymentPage } from './pos-pages/payment-page.js';
import { OrderDetail, ViewModel } from './pos-pages/models.js';
import { ProductsPage } from './pos-pages/products-page.js';
import { ShoppingOrderManager } from './shopping-order-manager.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { NormalPageEditor } from '../editor/normal-page-editor.js';
import { PosSetting } from './pos-pages/pos-setting.js';
import { PayConfig } from './pos-pages/pay-config.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { Swal } from '../modules/sweetAlert.js';
import { ConnectionMode } from './pos-pages/connection-mode.js';
import { PosFunction } from './pos-pages/pos-function.js';
import { UserList } from './user-list.js';
import { TempOrder } from './pos-pages/temp-order.js';
import { PosSummary } from './pos-pages/pos-summary.js';
import { ApiPos } from '../glitter-base/route/pos.js';
import { PosWidget } from './pos-widget.js';
import { SaasOffer } from '../saas-offer.js';
import { Language } from '../glitter-base/global/language.js';
import { CreditCard } from './pos-pages/credit-card.js';
import { BgWidget } from '../backend-manager/bg-widget.js';

const html = String.raw;

export class POSSetting {
  static config: {
    who: string;
    recreate: () => void;
    pickup_number: number;
    where_store: string;
  } = {
    recreate: () => {},
    get who() {
      return localStorage.getItem('pos_use_member') || '';
    },
    set who(value) {
      localStorage.setItem('pos_use_member', value);
    },
    get pickup_number() {
      if (parseInt(localStorage.getItem('orderGetNumber') || '1', 10) > 1000) {
        POSSetting.config.pickup_number = 1;
        return 1;
      } else {
        return parseInt(localStorage.getItem('orderGetNumber') || '1', 10);
      }
    },
    set pickup_number(value) {
      localStorage.setItem('orderGetNumber', `${value}`);
    },
    get where_store() {
      return localStorage.getItem('where_store') || '';
    },
    set where_store(value) {
      localStorage.setItem('where_store', `${value}`);
    },
  };

  static loginManager(gvc: GVC, mode: 'first' | 'switch', result: (result: boolean) => void) {
    const dialog = new ShareDialog(gvc.glitter);
    return gvc.bindView(() => {
      const id = gvc.glitter.getUUID();
      const vm: {
        account: string;
        pwd: string;
      } = {
        account: '',
        pwd: '',
      };
      return {
        bind: id,
        view: () => {
          return html` <section
            class="vw-100 vh-100"
            style="box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding-top: 120px; padding-bottom: 130px; background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);"
          >
            <div
              style="border-radius: 30px; background: #FFF; box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 0.15); display: flex; width: 576px; max-width: calc(100% - 30px); padding: 40px; flex-direction: column; justify-content: center; align-items: center;"
            >
              <div class="w-100 d-flex align-items-center mb-3 mb-sm-4">
                <img
                  class="w-100"
                  src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s7s6sbs6s6s5s0s5_messageImage_1726330128813.jpg"
                />
              </div>
              <div
                class="px-sm-3"
                style="width: 100%; display: flex; flex-direction: column; align-items: flex-start; align-self: stretch; gap: 24px;"
              >
                <div
                  style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px; align-self: stretch;"
                >
                  <div
                    style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px; align-self: stretch;"
                  >
                    <div class="mb-2" style="color: #393939; font-size: 16px; font-weight: 700; line-height: normal;">
                      管理員帳號
                    </div>
                    <input
                      style="display: flex; padding: 10px 18px; align-items: center; gap: 10px; align-self: stretch; border-radius: 10px; border: 1px solid #DDD; background: #FFF; width: 100%; font-size: 16px; font-weight: 400; line-height: 140%;"
                      placeholder="請輸入管理員帳號"
                      onchange="${gvc.event(e => {
                        vm.account = e.value;
                      })}"
                    />
                  </div>
                  <div
                    style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px; align-self: stretch;"
                  >
                    <div class="mb-2" style="color: #393939; font-size: 16px; font-weight: 700; line-height: normal;">
                      密碼
                    </div>
                    <input
                      style="display: flex; height: 40px; padding: 10px 18px; align-items: center; gap: 10px; align-self: stretch; width: 100%; border-radius: 10px; border: 1px solid #DDD; background: #FFF;"
                      placeholder="請輸入密碼"
                      type="password"
                      onchange="${gvc.event(e => {
                        vm.pwd = e.value;
                      })}"
                    />
                  </div>
                </div>
                <div class="w-100 d-flex" style="gap: 15px;">
                  <div
                    class="${mode === 'switch' ? '' : 'd-none'}"
                    style="display: flex; width: 100%; padding: 16px; gap: 10px; border-radius: 10px; background: #DDD; height: 51px; text-align: center; align-items: center; justify-content: center; color: #393939; font-size: 20px; font-weight: 700; line-height: normal; letter-spacing: 1.6px; cursor: pointer;"
                    onclick="${gvc.event(() => {
                      gvc.closeDialog();
                    })}"
                  >
                    取消
                  </div>
                  <div
                    style="display: flex; width: 100%; padding: 16px; gap: 10px; border-radius: 10px; background: #393939; height: 51px; text-align: center; align-items: center; justify-content: center; color: #FFF; font-size: 20px; font-weight: 700; line-height: normal; letter-spacing: 1.6px; cursor: pointer;"
                    onclick="${gvc.event(() => {
                      dialog.dataLoading({ visible: true });
                      ApiUser.login({
                        app_name: (window as any).glitterBase,
                        account: vm.account,
                        pwd: vm.pwd,
                      }).then(async r => {
                        dialog.dataLoading({ visible: false });
                        if (r.result) {
                          GlobalUser.saas_token = r.response.token;
                          const isAdmin = await ApiUser.checkAdminAuth({
                            app: gvc.glitter.getUrlParameter('app-id'),
                            token: GlobalUser.saas_token,
                          });
                          if (isAdmin.response.result) {
                            POSSetting.config.who = 'manager';
                            result(true);
                            gvc.recreateView();
                          } else {
                            dialog.errorMessage({ text: '帳號或有誤' });
                          }
                        } else {
                          dialog.errorMessage({ text: '帳號或有誤' });
                        }
                      });
                    })}"
                  >
                    登入
                  </div>
                </div>
              </div>
            </div>
          </section>`;
        },
      };
    });
  }

  static initial(gvc: GVC) {
    gvc.glitter.share.editorViewModel = { app_config_original: {} };
    gvc.glitter.share.shop_config = { shop_name: '' };

    return new Promise(async resolve => {
      ApiUser.getPublicConfig('store-information', 'manager').then(res => {
        gvc.glitter.share.shop_config.shop_name = res.response.value.shop_name;
        ApiPageConfig.getAppConfig().then(res => {
          gvc.glitter.share.editorViewModel.app_config_original = res.response.result[0];
          gvc.glitter.share.editorViewModel.domain = res.response.result[0].domain;
          gvc.glitter.share.editorViewModel.originalDomain = gvc.glitter.share.editorViewModel.domain;
          resolve(true);
        });
      });
    });
  }

  static setSaasBrand() {
    if (window.location.href.includes('smartshop')) {
      (window as any).glitterBase = 'hd_saas';
    } else {
      (window as any).glitterBase = 'shopnex';
    }
    (window as any).saasConfig.config.token = GlobalUser.saas_token;
  }
  static main(gvc: GVC) {
    this.setSaasBrand();
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(glitter);

    gvc.addStyle(`
      .dialog-box {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
      }

      .dialog-absolute {
        width: 100%;
        border-top: 1px solid #e2e5f1;
        position: absolute;
        left: 0px;
        bottom: 0px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .hover-cancel {
        background-color: #fff;
        border-radius: 0 0 0 0.5rem;
      }

      .hover-cancel:hover {
        background-color: #e6e6e6;
      }

      .hover-save {
        background-color: #393939;
        border-radius: 0 0 0.5rem;
      }

      .hover-save:hover {
        background-color: #646464;
      }
    `);

    ConnectionMode.initial(gvc); // 監聽連線裝置
    POSSetting.initialStyle(gvc); // 設定style

    gvc.glitter.share.NormalPageEditor = NormalPageEditor; // 提供給編輯器使用
    gvc.glitter.addStyleLink('./css/editor.css');

    (window as any).appName = gvc.glitter.getUrlParameter('app-id');
    (window as any).saasConfig.config.token = GlobalUser.saas_token;

    localStorage.setItem('on-pos', 'true');

    return gvc.bindView(() => {
      const id = gvc.glitter.getUUID();
      let timer_vm: {
        timer: any;
        last_string: '';
      } = {
        timer: 0,
        last_string: '',
      };

      const scannerObserver = function (event: KeyboardEvent) {
        if (event.key.toLowerCase() !== 'enter' && event.key.toLowerCase() !== 'shift') {
          clearInterval(timer_vm.timer);
          timer_vm.last_string += event.key;
          timer_vm.timer = setTimeout(() => {
            POSSetting.scannerCallback(gvc, timer_vm.last_string);
            timer_vm.last_string = '';
          }, 150);
        }
      };

      glitter.share._scanBack = (text: string) => POSSetting.scannerCallback(gvc, text);

      function getTimeState(startDate: string, endDate: string): 'beforeStart' | 'inRange' | 'afterEnd' {
        const now = new Date();
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59`);

        if (now < start) return 'beforeStart'; // 待上架
        if (now > end) return 'afterEnd'; // 下架
        return 'inRange'; // 上架
      }

      return {
        bind: id,
        view: async () => {
          try {
            let [initial, res, member_auth, store_list, exhibition_list]: any = await Promise.all([
              POSSetting.initial(gvc),
              ApiUser.checkAdminAuth({ app: gvc.glitter.getUrlParameter('app-id'), token: GlobalUser.saas_token }),
              ApiUser.getPermission({ page: 0, limit: 100 }),
              ApiUser.getPublicConfig('store_manager', 'manager'),
              ApiUser.getPublicConfig('exhibition_manager', 'manager'),
            ]);
            member_auth = member_auth.response.data.filter((dd: any) => dd.invited && dd.status);
            store_list = store_list.response.value.list;
            glitter.share.store_list = store_list;
            const exh_list = exhibition_list.response.value.list ?? [];
            glitter.share.exhibition_list = exh_list.filter((item: any) => {
              const state = getTimeState(item.startDate, item.endDate);
              return state === 'inRange';
            });
            glitter.share.member_auth_list = member_auth;
            try {
              const login_user = GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID;
              const find_ = member_auth.find((dd: any) => `${dd.user}` === `${login_user}`);
              POSSetting.config.who = find_.user;
            } catch (e) {
              console.error(e);
            }
            const member_auth_ = member_auth.find((dd: any) => `${dd.user}` === `${POSSetting.config.who}`);
            member_auth_.config.support_shop = member_auth_.config.support_shop.filter((dd: string) => {
              return store_list.find((d1: any) => dd === d1.id);
            });
            if (res.response.result && (member_auth_ || POSSetting.config.who === 'manager')) {
              if (!member_auth_.config.support_shop || member_auth_.config.support_shop.length === 0) {
                dialog.errorMessage({
                  text: `尚未設定任何門市，請前往『 門市設定 』與『 員工設定 』中設定相關參數`,
                  callback: () => {
                    dialog.dataLoading({ visible: true });
                    localStorage.removeItem('on-pos');
                    window.parent.history.replaceState(
                      {},
                      document.title,
                      `${glitter.root_path}cms?appName=${glitter.getUrlParameter('app-id')}&type=editor&function=backend-manger&tab=home_page`
                    );
                    glitter.share.reload('cms', (window as any).glitterBase);
                  },
                });
                return '';
              } else {
                glitter.share.member_auth_list = member_auth.filter((dd: any) => {
                  return dd.config.support_shop && dd.config.support_shop.length > 0;
                });
                if (!member_auth_.config.support_shop.includes(POSSetting.config.where_store)) {
                  POSSetting.config.where_store = member_auth_.config.support_shop[0];
                }
                const workStatus = await ApiPos.getWorkStatus(POSSetting.config.who, POSSetting.config.where_store);
                glitter.share.work_status = workStatus.response.status;
                return POSSetting.posView(gvc);
              }
            } else {
              return POSSetting.loginManager(gvc, 'first', () => {});
            }
          } catch (e) {
            dialog.dataLoading({ visible: true });
            localStorage.removeItem('on-pos');
            window.parent.history.replaceState(
              {},
              document.title,
              `${glitter.root_path}cms?appName=${glitter.getUrlParameter('app-id')}&type=editor&function=backend-manger&tab=home_page`
            );
            glitter.share.reload('cms', (window as any).glitterBase);
            return '';
          }
        },
        onCreate: () => {
          document.removeEventListener('keydown', scannerObserver);
          document.addEventListener('keydown', scannerObserver);
        },
        onDestroy: () => {
          document.removeEventListener('keydown', scannerObserver);
        },
      };
    });
  }

  static productDialog(obj: {
    gvc: GVC;
    selectVariant: any;
    defaultData: any;
    orderDetail: OrderDetail;
    callback: (data: any) => void;
  }) {
    const gvc = obj.gvc;
    const data = obj.defaultData;
    const orderDetail = obj.orderDetail;
    let selectVariant = obj.selectVariant;

    let count = 1;

    function arraysEqual(arr1: any[], arr2: any[]) {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((value, index) => value === arr2[index]);
    }

    function changeSelectVariant(product: any) {
      let emptyArray: any[] = [];
      product.content.specs.forEach((spec: any) => {
        emptyArray.push(spec.option.find((opt: any) => opt.select == true).title);
      });
      return product.content.variants.find((variant: any) => arraysEqual(variant.spec, emptyArray));
    }
    data.content.specs.map((dd:any,index:number)=>{
      dd.option.map((d1:any,index:number)=>{
        d1.select = index===0;
      })
    });
    selectVariant = changeSelectVariant(data);
    obj.callback(selectVariant);
    gvc.glitter.innerDialog(
      gvc => {
        return gvc.bindView({
          bind: 'productDialog',
          view: () => {
            try {
              selectVariant.preview_image = selectVariant.preview_image || [];
              selectVariant.stock = gvc.glitter.share.store_list.filter((dd:any)=>{
                return (dd.id===POSSetting.config.where_store) || (
                  gvc.glitter.share.store_list.find((dd:any)=>{
                    return dd.id === POSSetting.config.where_store;
                  }).support_store ?? []
                ).includes(dd.id);
              }).map((d1:any)=>{
                 return  selectVariant.stockList[d1.id].count
                }).reduce((acc: any, val: any) => acc + val,0)


              return html` <div
                class="w-100 h-100 d-flex align-items-center justify-content-center"
                onclick="${gvc.event(() => gvc.glitter.closeDiaLog())}"
              >
                <div
                  class="d-flex flex-column position-relative"
                  style="width: 542px;padding: 24px;background-color: white;border-radius: 10px;max-width: calc(100% - 20px);overflow-y:auto;max-height:calc(100% - 20px);"
                  onclick="${gvc.event((_, event) => event.stopPropagation())}"
                >
                  <div class="w-100 d-block d-sm-flex flex-column flex-sm-row m" style="gap:24px;">
                    <div
                      class="rounded-3 d-none"
                      style="${document.body.offsetWidth < 800
                        ? `width: 100%;padding-bottom:100%;`
                        : `width: 204px;height: 204px;`}background: 50%/cover url('${(selectVariant.preview_image
                        .length > 1
                        ? selectVariant.preview_image
                        : data.content.preview_image[0]) ||
                      'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'}');"
                    ></div>
                    <div class="d-flex flex-column flex-fill justify-content-center">
                      <div style="font-size: 24px;font-weight: 700;">${data.content.title ?? 'no name'}</div>
                      <div style="font-size: 20px;font-weight: 500;margin-top: 8px;">
                        NT.${parseInt(selectVariant.sale_price, 10).toLocaleString()}
                      </div>
                      ${gvc.bindView({
                        bind: 'productSpec',
                        view: () => {
                          if (data.content.specs.length == 0) {
                            return '';
                          }

                          const productSpecs: {
                            title: string;
                            option: any;
                            language_title?: {
                              'en-US': string;
                              'zh-CN': string;
                              'zh-TW': string;
                            };
                          }[] = data.content.specs;
                       
                          return productSpecs
                            .map((spec, index1) => {
                              return html` <div>
                                <h5 class="mb-2" style="color: #393939; font-size: 14px;">
                                  ${(spec.language_title && (spec.language_title as any)[Language.getLanguage()]) ||
                                  spec.title}
                                </h5>
                                <div class="d-flex gap-2 flex-wrap">
                                  ${gvc.map(
                                    spec.option.map((opt: any, optIndex: number) => {
                                      return html` <div
                                        class="spec-option ${spec.option[optIndex].select ? 'selected-option' : ''}"
                                        onclick="${gvc.event(() => {
                                          spec.option.forEach((option: any) => {
                                            option.select = false;
                                          });
                                          spec.option[optIndex].select = true;
                                          selectVariant = changeSelectVariant(data);
                                          obj.callback(selectVariant);
                                          gvc.notifyDataChange('productDialog');
                                        })}"
                                      >
                                        <span style="font-size: 15px; font-weight: 500; letter-spacing: 1.76px;"
                                          >${(opt.language_title &&
                                            (opt.language_title as any)[Language.getLanguage()]) ||
                                          opt.title}</span
                                        >
                                      </div>`;
                                    })
                                  )}
                                </div>
                              </div>`;
                            })
                            .join('');
                        },
                        divCreate: {
                          style: `gap:8px;margin-bottom:${data.content.specs.length ? `24px` : `0px`};margin-top:16px;`,
                          class: `d-flex flex-column`,
                        },
                      })}
                      ${gvc.bindView(() => {
                        return {
                          bind: 'count_bt',
                          view: () => {
                            return html`
                              <div
                                class="d-flex align-items-center justify-content-between"
                                style="gap: 10px;padding: 10px 18px;border-radius: 5px;border: 1px solid #DDD;"
                              >
                                <div
                                  class="d-flex align-items-center justify-content-center"
                                  style="border-radius: 10px;cursor: pointer;"
                                  onclick="${gvc.event(() => {
                                    count = count == 1 ? count : count - 1;
                                    gvc.notifyDataChange(`productDialog`);
                                  })}"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="13"
                                    height="3"
                                    viewBox="0 0 13 3"
                                    fill="none"
                                  >
                                    <path
                                      d="M13 1.5C13 1.98398 12.5531 2.375 12 2.375H1C0.446875 2.375 0 1.98398 0 1.5C0 1.01602 0.446875 0.625 1 0.625H12C12.5531 0.625 13 1.01602 13 1.5Z"
                                      fill="#393939"
                                    />
                                  </svg>
                                </div>
                                <input
                                  class="border-0 qty"
                                  style="text-align: center; width: 120px; height: 32px;"
                                  value="${count}"
                                  onchange="${gvc.event(e => {
                                    const n =
                                      data.content.product_category === 'weighing'
                                        ? parseFloat(e.value)
                                        : parseInt(e.value);
                                    count = isNaN(n) ? 0 : n;
                                    gvc.notifyDataChange(['count_bt', 'product_btn']);
                                  })}"
                                />
                                <div
                                  class="d-flex align-items-center justify-content-center"
                                  style="border-radius: 10px;cursor: pointer;"
                                  onclick="${gvc.event(() => {
                                    count++;
                                    gvc.notifyDataChange(['count_bt', 'product_btn']);
                                  })}"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="15"
                                    viewBox="0 0 14 15"
                                    fill="none"
                                  >
                                    <path
                                      d="M8.07692 1.57692C8.07692 0.98125 7.59567 0.5 7 0.5C6.40433 0.5 5.92308 0.98125 5.92308 1.57692V6.42308H1.07692C0.48125 6.42308 0 6.90433 0 7.5C0 8.09567 0.48125 8.57692 1.07692 8.57692H5.92308V13.4231C5.92308 14.0188 6.40433 14.5 7 14.5C7.59567 14.5 8.07692 14.0188 8.07692 13.4231V8.57692H12.9231C13.5188 8.57692 14 8.09567 14 7.5C14 6.90433 13.5188 6.42308 12.9231 6.42308H8.07692V1.57692Z"
                                      fill="#393939"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div class="d-flex flex-column gap-1 mt-2 align-items-end justify-content-center">
                                <div>
                                  ${(() => {
                                    if (selectVariant.show_understocking === 'false') {
                                      return '此商品未追蹤庫存數量';
                                    }
                                    if (
                                      POSSetting.config.where_store.includes('exhibition_') &&
                                      selectVariant.exhibition_type
                                    ) {
                                      return `庫存數量: ${selectVariant.exhibition_active_stock}`;
                                    }
                                    return `庫存數量: ${selectVariant.stock}`;
                                  })()}
                                </div>
                                ${selectVariant.show_understocking === 'false'
                                  ? ''
                                  : BgWidget.blueNote(
                                      '查看各庫存點數量',
                                      gvc.event(() => {
                                        BgWidget.settingDialog({
                                          gvc,
                                          title: '其他庫存點',
                                          innerHTML: () => {
                                            return BgWidget.tableV3({
                                              gvc,
                                              filter: [],
                                              getData: vmi => {
                                                const dataList: { name: string; count: number }[] = [];
                                                function callback() {
                                                  vmi.pageSize = 1;
                                                  vmi.originalData = dataList;
                                                  vmi.tableData = getDatalist();
                                                  vmi.loading = false;
                                                  vmi.callback();
                                                }
                                                function getDatalist() {
                                                  return dataList.map((dd: any) => {
                                                    return [
                                                      {
                                                        key: '門市/庫存點',
                                                        value: `<span class="fs-7">${dd.name}</span>`,
                                                      },
                                                      {
                                                        key: '數量',
                                                        value: `<span class="fs-7">${dd.count || 0}</span>`,
                                                      },
                                                    ];
                                                  });
                                                }

                                                ApiUser.getPublicConfig('store_manager', 'manager').then((dd: any) => {
                                                  console.log(`selectVariant===>`,selectVariant)
                                                  if (dd.result && Array.isArray(dd.response.value?.list)) {
                                                    dd.response.value.list.map((store: any) => {
                                                      const n = selectVariant.stockList?.[store.id]?.count ?? 0;
                                                      dataList.push({
                                                        name: store.name,
                                                        count: n > 0 ? n : 0,
                                                      });
                                                    });
                                                  }

                                                  callback();
                                                });
                                              },
                                              rowClick: () => {},
                                              hiddenPageSplit: true,
                                            });
                                          },
                                          footer_html: (fGVC: GVC) => {
                                            return [
                                              BgWidget.save(
                                                fGVC.event(() => fGVC.closeDialog()),
                                                '確認'
                                              ),
                                            ].join();
                                          },
                                        });
                                      })
                                    )}
                              </div>
                            `;
                          },
                          divCreate: { class: `d-flex flex-column` },
                        };
                      })}
                    </div>
                  </div>
                  <div class="d-flex mt-4 justify-content-between" style="gap:10px;">
                    ${gvc.bindView(() => {
                      return {
                        bind: 'close',
                        view: () => {
                          return '取消';
                        },
                        divCreate: () => {
                          return {
                            class: `d-flex align-items-center justify-content-center`,
                            style: `flex:1;padding: 12px 24px;font-size: 20px;color: #FFF;font-weight: 500;border-radius: 10px;min-height: 58px;background:gray;`,
                            option: [
                              {
                                key: 'onclick',
                                value: gvc.event(() => {
                                  gvc.glitter.closeDiaLog();
                                }),
                              },
                            ],
                          };
                        },
                      };
                    })}
                    ${gvc.bindView(() => {
                      return {
                        bind: 'product_btn',
                        view: () => {
                          if (POSSetting.config.where_store.includes('exhibition_')) {
                            return selectVariant.exhibition_type && selectVariant.exhibition_active_stock > 0
                              ? '加入購物車'
                              : '非展會銷售規格';
                          }

                          if (selectVariant.show_understocking === 'true' && selectVariant.stock <= 0) {
                            return '預購商品';
                          }

                          return '加入購物車';
                        },
                        divCreate: () => {
                          const getColorStyle = () => {
                            if (
                              POSSetting.config.where_store.includes('exhibition_') &&
                              !selectVariant.exhibition_type
                            ) {
                              return 'gray';
                            }

                            return selectVariant.show_understocking === 'true' && selectVariant.stock <= 0
                              ? '#FF6C02'
                              : '#393939';
                          };

                          return {
                            class: 'd-flex align-items-center justify-content-center',
                            style: `
                              flex: 1;
                              padding: 12px 12px;
                              font-size: 20px;
                              color: #fff;
                              font-weight: 500;
                              border-radius: 10px;
                              background: ${getColorStyle()};
                              min-height: 58px;
                            `,
                            option: [
                              {
                                key: 'onclick',
                                value: gvc.event(() => {
                                  function next() {
                                    const countValue =
                                      data.content.product_category === 'weighing'
                                        ? parseFloat(`${count ?? 0}`)
                                        : parseInt(`${count ?? 0}`, 10);

                                    let addItem = orderDetail.lineItems.find(
                                      (item: any) =>
                                        data.content.title === item.title && arraysEqual(item.spec, selectVariant.spec)
                                    );

                                    if (addItem) {
                                      addItem.count += countValue;
                                    } else {
                                      orderDetail.lineItems.push({
                                        id: data.id,
                                        title: data.content.title,
                                        preview_image:
                                          selectVariant.preview_image.length > 1
                                            ? selectVariant.preview_image
                                            : (data.content.preview_image?.[0] ?? ''),
                                        spec: selectVariant.spec,
                                        count: countValue,
                                        sale_price: selectVariant.sale_price,
                                        sku: selectVariant.sku,
                                        product_category: data.content.product_category,
                                      });
                                    }

                                    // 獲取購物車 UI 元素並更新視圖
                                    const cartCountEl = document.querySelector('.js-cart-count');
                                    cartCountEl && (cartCountEl as any).recreateView();

                                    // 更新庫存狀態並關閉對話框
                                    gvc.glitter.share.checkStock();
                                    gvc.glitter.closeDiaLog();
                                  }

                                  if (POSSetting.config.where_store.includes('exhibition_')) {
                                    if (!selectVariant.exhibition_type) return; // 若為展會模式但該商品不是展會銷售品，則不執行任何動作
                                  }

                                  if (selectVariant.exhibition_type && selectVariant.exhibition_active_stock > 0) {
                                    return next(); // 若是展會商品且庫存充足，直接加入購物車
                                  }

                                  if (selectVariant.show_understocking === 'true' && selectVariant.stock === 0) {
                                    // 若商品可缺貨銷售且庫存為 0，則彈出對話框詢問是否預購
                                    new ShareDialog(gvc.glitter).checkYesOrNot({
                                      text: '庫存數量不足，是否進行預購?',
                                      callback: response => response && next(),
                                    });
                                    return;
                                  }

                                  // 其他情況直接加入購物車
                                  next();
                                }),
                              },
                            ],
                          };
                        },
                      };
                    })}
                  </div>
                </div>
              </div>`;
            } catch (e) {
              console.error(e);
              return '';
            }
          },
          divCreate: { class: 'w-100 h-100' },
        });
      },
      'product',
      {
        dismiss: () => {
          gvc.notifyDataChange('order');
        },
      }
    );
  }

  static async scannerCallback(gvc: GVC, text: string) {
    const dialog = new ShareDialog(gvc.glitter);
    const swal = new Swal(gvc);

    if (PayConfig.onPayment) {
      PayConfig.onPayment(text);
      return;
    }

    if (text.indexOf(`variants-`) === 0) {
      dialog.dataLoading({ visible: true, text: '搜尋商品...' });
      text = text.replace(`variants-`, '');
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
        const data = res.response.data[0];

        if (data) {
          const productCategory = data.content.product_category;
          const selectVariant = data.content.variants.find((d1: any) => d1.barcode === text);

          if (productCategory === 'weighing') {
            this.productDialog({
              gvc,
              selectVariant,
              defaultData: data,
              orderDetail: OrderDetail.singleInstance,
              callback: () => {},
            });
            return;
          }

          if (
            !OrderDetail.singleInstance.lineItems.find(dd => {
              return dd.id + dd.spec.join('-') === data.id + selectVariant.spec.join('-');
            })
          ) {
            OrderDetail.singleInstance.lineItems.push({
              id: data.id,
              title: data.content.title,
              preview_image:
                selectVariant.preview_image.length > 1 ? selectVariant.preview_image : data.content.preview_image[0],
              spec: selectVariant.spec,
              count: 0,
              sale_price: selectVariant.sale_price,
              sku: selectVariant.sku,
            });
          }

          OrderDetail.singleInstance.lineItems.find(dd => {
            return dd.id + dd.spec.join('-') === data.id + selectVariant.spec.join('-');
          })!.count++;

          gvc.glitter.share.checkStock();
          gvc.notifyDataChange(['order', 'checkout-page']);
        } else {
          swal.toast({ icon: 'error', title: '無此商品' });
        }
      });
    }
    if (text.indexOf(`user-`) === 0) {
      dialog.dataLoading({ visible: true });
      const user = await ApiUser.getUsersData(text.replace('user-', ''));
      if (!user.response || !user.response.account) {
        dialog.errorMessage({ text: '查無此會員' });
      } else {
        dialog.dataLoading({ visible: false });
        OrderDetail.singleInstance.user_info.email = user.response.userData.email;
        OrderDetail.singleInstance.user_info.phone = user.response.userData.phone;
        gvc.notifyDataChange(['checkout-page']);
      }
    }

    if (text.indexOf(`voucher-`) === 0) {
      text = text.replace(`voucher-`, '');
      OrderDetail.singleInstance.code_array = OrderDetail.singleInstance.code_array || [];
      OrderDetail.singleInstance.code_array = OrderDetail.singleInstance.code_array.filter((dd: any) => {
        return dd !== text;
      });
      OrderDetail.singleInstance.code_array.push(text);
      dialog.dataLoading({ visible: true });
      const od: any = (
        await ApiShop.getCheckout({
          line_items: OrderDetail.singleInstance.lineItems,
          checkOutType: 'POS',
          user_info: OrderDetail.singleInstance.user_info,
          code_array: OrderDetail.singleInstance.code_array,
        })
      ).response.data;
      dialog.dataLoading({ visible: false });
      if (
        !od ||
        !od.voucherList.find((dd: any) => {
          return dd.code === text;
        })
      ) {
        OrderDetail.singleInstance.code_array = OrderDetail.singleInstance.code_array.filter((dd: any) => {
          return dd !== text;
        });
        dialog.errorMessage({ text: '請輸入正確的優惠代碼' });
      } else {
        dialog.successMessage({ text: '成功新增優惠券' });
        gvc.notifyDataChange(['checkout-page']);
      }
    }
  }

  static posView(gvc: GVC) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(glitter);

    const vm: ViewModel = {
      id: glitter.getUUID(),
      filterID: glitter.getUUID(),
      get type() {
        return localStorage.getItem('show_pos_page') ?? 'menu';
      },
      set type(value) {
        localStorage.setItem('show_pos_page', `${value}`);
        gvc.notifyDataChange(vm.id);
      },
      loading: true,
      order: {},
      query: '',
      productSearch: [],
      categorySearch: true,
      categories: [],
    };

    let orderDetail = JSON.parse(JSON.stringify(new OrderDetail(0, 0)));

    glitter.share.reloadPosPage = () => gvc.notifyDataChange(vm.id);

    glitter.share.clearOrderData = () => {
      orderDetail = JSON.parse(JSON.stringify(new OrderDetail(0, 0)));
      (orderDetail.user_info.shipment as any) = 'now';
    };

    function loadOrderData() {
      const storageOrder = localStorage.getItem('pos_order_detail');
      if (storageOrder) {
        orderDetail = JSON.parse(storageOrder);
      } else {
        orderDetail.user_info = orderDetail.user_info || { shipment: 'now' };
        (orderDetail.user_info.shipment as any) = 'now';
      }
      if (!orderDetail.lineItems || orderDetail.lineItems.length === 0) {
        orderDetail.user_info = orderDetail.user_info || { shipment: 'now' };
        (orderDetail.user_info.shipment as any) = 'now';
      }
    }

    gvc.addStyle(`
      .product-show {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .product-show::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
      .hoverHidden div {
        display: none;
      }

      .hoverHidden:hover div {
        display: flex;
      }

      .tooltip {
        z-index: 99999 !important;
      }

      .scroll-in {
        animation: slideInFromLeft 0.3s ease-out forwards;
      }

      .scroll-out {
        left: 0%; /* 將元素移到畫面外 */
        animation: slideOutFromLeft 0.3s ease-out forwards;
      }

      .spec-option {
        display: flex;
        height: 38px;
        padding-left: 10px;
        padding-right: 10px;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        gap: 10px;
        border: 1px solid #393939;
        color: #393939;
        cursor: pointer;
        transition: 0.3s;
      }

      .spec-option.selected-option {
        background: #393939;
        color: #fff;
      }

      .spec-option:not(.selected-option):hover {
        background: #8d8d8d;
      }

      /* @keyframes 定義動畫 */
      @keyframes slideInFromLeft {
        0% {
          left: -120%; /* 起始位置在畫面外 */
        }
        100% {
          left: 0; /* 結束位置在畫面內 */
        }
      }
      /* @keyframes 定義動畫 */
      @keyframes slideOutFromLeft {
        0% {
          left: 0; /* 起始位置在畫面外 */
        }
        100% {
          left: -120%; /* 結束位置在畫面內 */
        }
      }
    `);

    ApiUser.getPublicConfig('store-information', 'manager').then(res => {
      PayConfig.pos_config = res.response.value;
      vm.loading = false;
      gvc.notifyDataChange(vm.id);
    });

    if (vm.type === 'home') {
      vm.type = 'menu';
    }

    return (
      gvc.bindView(() => {
        return {
          bind: vm.id,
          view: () => {
            if (vm.loading) {
              return html` <div class="d-flex align-items-center justify-content-center p-3">
                <div class="spinner-border"></div>
              </div>`;
            }
            try {
              loadOrderData();
              const cartBtn = gvc.bindView(() => {
                return {
                  bind: 'cartBtn',
                  view: () => {
                    if (!orderDetail.lineItems || orderDetail.lineItems.length === 0) {
                      return html`<i
                        class="fa-regular fa-cart-shopping"
                        style="cursor: pointer; color: #393939; font-size: 20px;"
                      ></i>`;
                    }
                    return html`<span style="position: relative;"
                      ><i
                        class="fa-regular fa-cart-shopping"
                        style="color: #393939; cursor: pointer; font-size: 20px;"
                      ></i
                      ><span style="position: absolute;top:-32px;right: -12px;"
                        ><span
                          style="display: inline-block; background-color:#fe5541; height: 18px; width: 18px; border-radius: 50%; text-align: center; font-size: 11px; font-weight: 400; line-height: 18px; color: #fff; position: absolute; top: 25px; right: 0px;"
                          >${orderDetail.lineItems.length}</span
                        ></span
                      >
                    </span>`;
                  },
                  divCreate: {
                    class: `nav-link js-cart-count d-sm-none ${vm.type !== 'menu' ? `d-none` : ''}`,
                    style: `cursor: pointer;`,
                    option: [
                      {
                        key: 'onclick',
                        value: gvc.event(() => {
                          gvc.glitter.openDrawer();
                        }),
                      },
                    ],
                  },
                };
              });
              const nav_slide = gvc.bindView({
                bind: 'nav-slide',
                view: () => {
                  const page = [
                    {
                      icon: `fa-regular fa-tag`,
                      title: PayConfig.pos_config.pos_type === 'eat' ? `點餐` : `商品`,
                      type: `menu`,
                    },
                    {
                      icon: `fa-regular fa-credit-card`,
                      title: `結帳`,
                      type: `payment`,
                    },
                    {
                      icon: `fa-sharp fa-regular fa-clipboard-list`,
                      title: `訂單`,
                      type: `order`,
                    },
                    {
                      icon: `fa-sharp fa-regular fa-user-group-crown`,
                      title: `會員`,
                      type: `member`,
                    },
                    {
                      icon: `fa-sharp-duotone fa-solid fa-list-check`,
                      title: `小結`,
                      type: `summary`,
                    },
                  ];

                  return page
                    .map(data => {
                      return html`
                        <div
                          class="d-flex flex-column justify-content-center align-items-center ${document.body
                            .offsetWidth < 800
                            ? `py-2`
                            : ''}"
                          style="gap: 6px;font-weight: 500;letter-spacing: 0.8px;${vm.type == data.type
                            ? `color:#393939;${document.body.offsetWidth < 800 ? `border-bottom: 3px solid #393939;font-size: 16px;` : `border-right: 3px solid #393939;font-size: 18px;padding-top: 16px;padding-bottom: 16px;`}`
                            : 'color:#949494;'}flex:1;cursor:pointer;${glitter.ut.frSize(
                            {
                              sm: `padding-right:32px;padding-left:32px;`,
                            },
                            ''
                          )}"
                          onclick="${gvc.event(() => {
                            vm.type = data.type;
                          })}"
                        >
                          <i
                            class="${data.icon} fs-2 d-flex align-items-center justify-content-center"
                            style="${vm.type == data.type ? `color:#393939;` : ''};width: 24px;height: 24px;"
                          ></i>

                          ${data.title}
                        </div>
                      `;
                    })
                    .join('');
                },
                divCreate: () => {
                  if (document.body.offsetWidth < 800) {
                    return {
                      class: ` flex-row pos-footer-menu border-top`,
                      style: `width: 100%;gap:24px;background: #FFF; justify-content: space-around;display:flex;`,
                    };
                  } else {
                    return {
                      class: `d-flex nav-left flex-column`,
                      style: `height: 100%;gap:24px;padding-top:114px;position:fixed;left:0px;top:0px;background: #FFF;box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.05);z-index:15;`,
                    };
                  }
                },
              });
              return html`
                <div
                  class="d-flex nav-top flex-column"
                  style="z-index:20;padding-top:${glitter.share
                    .top_inset}px;width: 100%;background: #FFF;box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);position: fixed;left: 0;top: 0;"
                >
                  <div
                    class="POS-logo  d-flex align-items-center ${document.body.offsetWidth < 800
                      ? `justify-content-center`
                      : ''} mx-2 "
                    style="${document.body.offsetWidth < 800
                      ? `gap: 0px;`
                      : `gap: 10px;padding-left: 24px;`}height: ${document.body.offsetWidth > 800 ? '86px' : '76px'};"
                  >
                    ${document.body.offsetWidth < 800
                      ? ''
                      : html` <div class="d-flex align-items-center h-100 border-end pe-4" style="gap:10px;">
                          <img src="${SaasOffer.saas_logo}" style="max-width:150px;" />
                          <div
                            style="text-align: center; color: #8D8D8D; font-size: 38px; font-family: Lilita One; font-weight: 400; word-wrap: break-word"
                          >
                            POS
                          </div>
                        </div>`}
                    ${document.body.clientWidth > 800 ? cartBtn : ''}
                    <div
                      class="searchBar ms-sm-2 me-2 ${vm.type !== 'menu' ? `d-none` : ''} ${document.body.offsetWidth <
                      800
                        ? `d-none`
                        : ''}"
                      style="position: relative;max-width:calc(100% - 60px); ${document.body.clientWidth < 800
                        ? ''
                        : `position: absolute;left: 50%;top:50%;transform:translate(-50%,-50%);`}"
                    >
                      <input
                        class="border-0 "
                        placeholder="搜尋商品名稱或貨號"
                        style="display: flex;${document.body.offsetWidth < 800
                          ? `width:100%;font-size: 15px;height: 50px;padding: 17px 12px;`
                          : `width: 357px;max-width:calc(100%);font-size: 18px;height: 56px;padding: 17px 24px;`}justify-content: center;gap: 10px;border-radius: 10px;background: #F7F7F7;"
                        onchange="${gvc.event(e => {
                          glitter.share.search_interval = setTimeout(() => {
                            vm.query = e.value;
                            gvc.glitter.share.reloadProduct();
                          }, 500);
                        })}"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        style="width: 24px;height: 24px;flex-shrink: 0;position:absolute; ${document.body.offsetWidth <
                        800
                          ? `top:13px;right: 12px;`
                          : `top:17px;right: 24px;`};"
                      >
                        <g clip-path="url(#clip0_12216_123850)">
                          <path
                            d="M19.5 9.92139C19.5 12.0729 18.8016 14.0604 17.625 15.6729L23.5594 21.612C24.1453 22.1979 24.1453 23.1495 23.5594 23.7355C22.9734 24.3214 22.0219 24.3214 21.4359 23.7355L15.5016 17.7964C13.8891 18.9776 11.9016 19.6714 9.75 19.6714C4.36406 19.6714 0 15.3073 0 9.92139C0 4.53545 4.36406 0.171387 9.75 0.171387C15.1359 0.171387 19.5 4.53545 19.5 9.92139ZM9.75 16.6714C10.6364 16.6714 11.5142 16.4968 12.3331 16.1576C13.1521 15.8184 13.8962 15.3212 14.523 14.6944C15.1498 14.0676 15.647 13.3234 15.9862 12.5045C16.3254 11.6856 16.5 10.8078 16.5 9.92139C16.5 9.03496 16.3254 8.15722 15.9862 7.33827C15.647 6.51933 15.1498 5.77521 14.523 5.14842C13.8962 4.52162 13.1521 4.02442 12.3331 3.6852C11.5142 3.34598 10.6364 3.17139 9.75 3.17139C8.86358 3.17139 7.98583 3.34598 7.16689 3.6852C6.34794 4.02442 5.60382 4.52162 4.97703 5.14842C4.35023 5.77521 3.85303 6.51933 3.51381 7.33827C3.17459 8.15722 3 9.03496 3 9.92139C3 10.8078 3.17459 11.6856 3.51381 12.5045C3.85303 13.3234 4.35023 14.0676 4.97703 14.6944C5.60382 15.3212 6.34794 15.8184 7.16689 16.1576C7.98583 16.4968 8.86358 16.6714 9.75 16.6714Z"
                            fill="#8D8D8D"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_12216_123850">
                            <rect width="24" height="24" fill="white" transform="translate(0 0.171387)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    ${document.body.clientWidth > 800 ? `<div class="flex-fill"></div>` : ''}
                    ${gvc.bindView({
                      bind: 'right_top_info',
                      view: () => {
                        return new Promise(resolve => {
                          const member_auth = glitter.share.member_auth_list;
                          const select_member = member_auth.find((dd: any) => {
                            return `${dd.user}` === `${POSSetting.config.who}`;
                          }) ?? { config: { title: '管理員', name: 'manager' } };

                          glitter.share.select_member = select_member;
                          glitter.share.staff_title =
                            select_member.config.name === 'manager' ? `BOSS` : POSSetting.config.who;

                          resolve(
                            html` <div class="h-100 group dropdown  ps-1 pe-1 d-flex align-items-center">
                              <div
                                class=" btn btn-outline-secondary  border-0 p-1 position-relative"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                <div class="d-flex align-items-center px-sm-2" style="gap:10px;">
                                  <div class="ps-2 text-start">
                                    <div
                                      class="d-flex align-items-center"
                                      style="color: #393939; font-size: 18px; font-style: normal; font-weight: 400; line-height: normal;"
                                    >
                                      ${select_member.config.name}
                                    </div>
                                    <div
                                      class="fs-xs lh-1 opacity-60 fw-500 d-flex align-items-center fw-500 mt-1"
                                      style="color: #8D8D8D; font-size: 14px; font-style: normal; gap:5px; font-weight: 400; line-height: normal;"
                                    >
                                      ${select_member.config.title}
                                      <div>/</div>
                                      <div class="text-info fw-bold">
                                        ${(() => {
                                          if (POSSetting.config.where_store.includes('store_')) {
                                            return glitter.share.store_list.find((dd: any) => {
                                              return dd.id === POSSetting.config.where_store;
                                            }).name;
                                          }
                                          if (POSSetting.config.where_store.includes('exhibition_')) {
                                            return glitter.share.exhibition_list.find((dd: any) => {
                                              return dd.id === POSSetting.config.where_store;
                                            }).name;
                                          }
                                          return '未知地點';
                                        })()}
                                      </div>
                                    </div>
                                    <div class="d-flex align-items-center mt-1">
                                      ${glitter.share.work_status === 'off_work'
                                        ? html`
                                            <div
                                              class="rounded-circle "
                                              style="width:8px;height: 8px;background: #fe5541;"
                                            ></div>
                                            <div class="fw-500 ms-1" style="font-size: 12px;">已下班</div>
                                          `
                                        : html`
                                            <div
                                              class="rounded-circle "
                                              style="width:8px;height: 8px;background: #33a252;"
                                            ></div>
                                            <div class="fw-500 ms-1" style="font-size: 12px;">上班中</div>
                                          `}
                                    </div>
                                  </div>
                                  <i class="fa-regular fa-angle-down fs-6"></i>
                                </div>
                              </div>
                              <div class="dropdown-menu position-absolute" style="top:50px; right: 0;">
                                ${[
                                  ...(() => {
                                    const mem_ = member_auth.filter((dd: any) => {
                                      return `${dd.user}` !== `${POSSetting.config.who}`;
                                    });
                                    if (mem_.length > 0) {
                                      return [
                                        html`<a
                                          class="dropdown-item cursor_pointer d-flex align-items-center"
                                          style="gap:5px;"
                                          onclick="${gvc.event(() => {
                                            PosFunction.selectUserSwitch(gvc);
                                          })}"
                                        >
                                          <i class="fa-regular fa-swap-arrows me-1"></i>切換當值員工
                                        </a>`,
                                      ];
                                    } else {
                                      return [];
                                    }
                                  })(),
                                  ...(() => {
                                    if (glitter.share.select_member.config.support_shop.length > 1) {
                                      return [
                                        html`<a
                                          class="dropdown-item cursor_pointer d-flex align-items-center"
                                          style="gap:5px;"
                                          onclick="${gvc.event(() => {
                                            PosFunction.selectStoreSwitch(gvc, () => {
                                              vm.type = vm.type;
                                            });
                                          })}"
                                        >
                                          <i class="fa-solid fa-store me-1"></i>切換門市
                                        </a>`,
                                      ];
                                    } else {
                                      return [];
                                    }
                                  })(),
                                  ...(() => {
                                    if (glitter.share.work_status === 'on_work') {
                                      return [
                                        html`<a
                                          class="dropdown-item cursor_pointer d-flex align-items-center"
                                          style="gap:5px;"
                                          onclick="${gvc.event(() => {
                                            dialog.checkYesOrNot({
                                              text: html`是否確認打卡下班? <br /><span
                                                  style="font-size:13px;color:gray;"
                                                  >*打卡下班前請記得填寫小結單*</span
                                                >`,
                                              callback: response => {
                                                if (response) {
                                                  dialog.dataLoading({ visible: true });
                                                  ApiPos.setWorkStatus({
                                                    store: POSSetting.config.where_store,
                                                    status: 'off_work',
                                                  }).then(res => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (!res.result) {
                                                      dialog.errorMessage({ text: '打卡異常' });
                                                    } else {
                                                      gvc.recreateView();
                                                    }
                                                  });
                                                }
                                              },
                                            });
                                          })}"
                                        >
                                          <i class="fa-sharp fa-solid fa-right-from-bracket me-1  fs-6"></i>打卡下班
                                        </a>`,
                                      ];
                                    } else {
                                      return [];
                                    }
                                  })(),
                                ].join('<div class="dropdown-divider"></div>')}
                              </div>
                            </div>`
                          );
                        });
                      },
                      divCreate: {
                        class: `h-100`,
                      },
                    })}
                    ${document.body.clientWidth < 800 ? html` <div class="flex-fill"></div>` : ''}
                    <div class="h-100 d-flex align-items-center border-start ps-1">
                      <div
                        style="width:50px;height: 100%;cursor: pointer;"
                        class="d-flex align-items-center justify-content-center"
                        onclick="${gvc.event(() => {
                          PosFunction.selectTempOrder(gvc);
                        })}"
                      >
                        <div class=" btn btn-outline-secondary border-0 p-1 position-relative">
                          <i class="fa-regular fa-box fs-4"></i>
                          ${TempOrder.getTempOrders().length
                            ? html`<span style="position: absolute;top:-28px;right: -8px;"
                                ><span
                                  style="display: inline-block; background-color:#fe5541; height: 18px; width: 18px; border-radius: 50%; text-align: center; font-size: 11px; font-weight: 400; line-height: 18px; color: #fff; position: absolute; top: 25px; right: 0px;"
                                  >${TempOrder.getTempOrders().length}</span
                                ></span
                              >`
                            : ''}
                        </div>
                      </div>
                      ${document.body.clientWidth > 800 || vm.type !== 'menu'
                        ? ''
                        : html` <div style="width:50px;" class="d-flex align-items-center justify-content-center">
                            ${cartBtn}
                          </div>`}
                      ${gvc.bindView({
                        bind: gvc.glitter.getUUID(),
                        view: () => {
                          return html` <div class="h-100 group dropdown  ps-1 d-flex align-items-center">
                            <div
                              class="btn btn-outline-secondary  border-0 p-1 position-relative "
                              style="cursor: pointer;"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <div class="d-flex align-items-center px-sm-2" style="gap:10px;">
                                <i class="fa-solid fa-bars fs-4"></i>
                              </div>
                            </div>
                            <div class="dropdown-menu position-absolute" style="top:50px; right: 0;">
                              ${[
                                ...[
                                  ...(PayConfig.deviceType === 'pos'
                                    ? [
                                        html`<a
                                          class="dropdown-item cursor_pointer d-flex align-items-center"
                                          style="gap:10px;"
                                          onclick="${gvc.event(() => {
                                            CreditCard.refundView(gvc);
                                          })}"
                                          ><i
                                            class="fa-regular fa-credit-card d-flex align-items-center justify-content-center"
                                            style="width:20px;"
                                          ></i
                                          >信用卡刷退</a
                                        >`,
                                        html` <a
                                          class="dropdown-item cursor_pointer d-flex align-items-center"
                                          style="gap:10px;"
                                          onclick="${gvc.event(() => {
                                            ConnectionMode.main(gvc);
                                          })}"
                                          ><i
                                            class="fa-solid fa-plug d-flex align-items-center justify-content-center"
                                            style="width:20px;"
                                          ></i
                                          >連線模式</a
                                        >`,
                                      ]
                                    : []),
                                  ...(ConnectionMode.on_connected_device
                                    ? [
                                        html`<a
                                          class="dropdown-item cursor_pointer d-flex align-items-center"
                                          style="gap:10px;"
                                          onclick="${gvc.event(() => {
                                            dialog.checkYesOrNot({
                                              text: '是否斷開與 IMIN 裝置的連線?',
                                              callback: response => {
                                                if (response) {
                                                  dialog.infoMessage({
                                                    text: '已斷開連線',
                                                  });
                                                  ConnectionMode.last_connect_id = '';
                                                  ConnectionMode.on_connected_device = '';
                                                  ConnectionMode.socket.close();
                                                }
                                              },
                                            });
                                          })}"
                                          ><i
                                            class="fa-solid fa-power-off d-flex align-items-center justify-content-center"
                                            style="width:20px;"
                                          ></i
                                          >斷開裝置連線</a
                                        >`,
                                      ]
                                    : []),
                                ].concat(
                                  PayConfig.deviceType === 'pos'
                                    ? []
                                    : ConnectionMode.device_list.map(dd => {
                                        return html`<a
                                          class="dropdown-item cursor_pointer d-flex align-items-center"
                                          style="gap:10px;"
                                          onclick="${gvc.event(() => {
                                            ConnectionMode.connect(dd);
                                          })}"
                                          ><i
                                            class="fa-solid fa-plug d-flex align-items-center justify-content-center"
                                            style="width:20px;"
                                          ></i
                                          >連線至『 ${dd} 』</a
                                        >`;
                                      })
                                ),
                                html` <a
                                  class="dropdown-item cursor_pointer  d-flex align-items-center"
                                  style="gap:5px;"
                                  onclick="${gvc.event(() => {
                                    dialog.dataLoading({ visible: true });
                                    localStorage.removeItem('on-pos');
                                    window.parent.history.replaceState(
                                      {},
                                      document.title,
                                      `${glitter.root_path}cms?appName=${glitter.getUrlParameter('app-id')}&type=editor&function=backend-manger&tab=home_page`
                                    );
                                    glitter.share.reload('cms', (window as any).glitterBase);
                                  })}"
                                  ><i
                                    class="fa-solid fa-angle-left d-flex align-items-center justify-content-center"
                                    style="width:20px;"
                                  ></i
                                  >返回後台管理</a
                                >`,
                              ].join('<div class="dropdown-divider"></div>')}
                            </div>
                          </div>`;
                        },
                        divCreate: {
                          class: `d-flex align-items-center justify-content-center`,
                          style: `width:50px;height: 100%;`,
                        },
                      })}
                    </div>
                  </div>
                  ${document.body.clientWidth < 800 ? nav_slide : ''}
                </div>
                ${document.body.clientWidth > 800 ? nav_slide : ''}
                ${gvc.bindView({
                  bind: 'mainView',
                  view: async () => {
                    let view = (() => {
                      try {
                        if (glitter.share.work_status === 'off_work') {
                          return PosWidget.checkInView(gvc);
                        }
                        OrderDetail.singleInstance = orderDetail;
                        (orderDetail.user_info.shipment as any) = (orderDetail.user_info.shipment as any) || 'now';
                        if (vm.type == 'payment') {
                          return PaymentPage.main({
                            ogOrderData: orderDetail,
                            gvc: gvc,
                            vm: vm,
                          });
                        } else if (vm.type === 'order') {
                          return html` <div class="vw-50 px-lg-3" style="overflow-y: scroll;">
                            ${ShoppingOrderManager.main(gvc, { isPOS: true })}
                          </div>`;
                        } else if (vm.type === 'member') {
                          return html` <div class="vw-100 px-lg-3" style="overflow-y: scroll;">
                            ${UserList.main(gvc)}
                          </div>`;
                        } else if (vm.type === 'setting') {
                          return PosSetting.main({ gvc: gvc, vm: vm });
                        } else if (vm.type === 'summary') {
                          return PosSummary.main({
                            gvc: gvc,
                          });
                        }
                        return ProductsPage.main({ gvc: gvc, vm: vm, orderDetail: orderDetail });
                      } catch (e) {
                        console.error(e);
                        return `${e}`;
                      }
                    })();
                    if (document.body.clientWidth < 768) {
                      view += html` <div style="height: 100px;"></div>`;
                    }
                    return view;
                  },
                  divCreate: {
                    class: `h-100 ${document.body.clientWidth < 768 ? '' : `d-flex`}`,
                    style: `background: #F7F7F7;padding-top:${glitter.share.top_inset}px;`,
                  },
                })}
              `;
            } catch (e) {
              localStorage.removeItem('pos_order_detail');
              gvc.recreateView();
              console.error(e);
              return `${e}`;
            }
          },
          divCreate: {
            style:
              document.body.offsetWidth > 800
                ? 'padding: 86px 0 0 103px; height: 100vh; width: 100vw; color: #393939;'
                : 'padding-top: 150px; padding-bottom: 0px; height: 100vh; width: 100vw; color: #393939; overflow-y: auto;',
          },
        };
      }) + NormalPageEditor.leftNav(gvc)
    );
  }

  static initialStyle(gvc: GVC) {
    gvc.addStyle(`
      .hoverHidden div {
        display: none;
      }

      .hoverHidden:hover div {
        display: flex;
      }

      .tooltip {
        z-index: 99999 !important;
      }

      .scroll-in {
        left: -120%; /* 將元素移到畫面外 */
        animation: slideInFromLeft 0.5s ease-out forwards;
      }

      .scroll-out {
        left: 0%; /* 將元素移到畫面外 */
        animation: slideOutFromLeft 0.5s ease-out forwards;
      }

      .scroll-right-in {
        right: -120%; /* 將元素移到畫面外 */
        animation: slideInRight 0.5s ease-out forwards;
      }

      .scroll-right-out {
        right: 0; /* 將元素移到畫面外 */
        animation: slideOutRight 0.5s ease-out forwards;
      }

      @keyframes slideInFromLeft {
        0% {
          left: -120%; /* 起始位置在畫面外 */
        }
        100% {
          left: 0; /* 結束位置在畫面內 */
        }
      }

      @keyframes slideOutFromLeft {
        0% {
          left: 0; /* 起始位置在畫面外 */
        }
        100% {
          left: -120%; /* 結束位置在畫面內 */
        }
      }

      @keyframes slideInRight {
        0% {
          right: -120%; /* 起始位置在畫面外 */
        }
        100% {
          right: 0; /* 結束位置在畫面內 */
        }
      }

      @keyframes slideOutRight {
        0% {
          right: 0; /* 起始位置在畫面外 */
        }
        100% {
          right: -120%; /* 結束位置在畫面內 */
        }
      }
    `);
  }

  static emptyView(text: string) {
    (window as any).glitter.addMtScript(
      [{ src: '${ gvc.glitter.root_path}/jslib/lottie-player.js' }],
      () => {},
      () => {}
    );
    return html` <div
      class="d-flex align-items-center justify-content-center w-100  "
      style="height: calc(100vh - 200px);"
    >
      <div class="d-flex flex-column align-items-center justify-content-center" style="gap:30px;">
        <lottie-player
          class="rounded-circle bg-white"
          style="max-width: 100%;width: 300px;"
          src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
          speed="1"
          loop=""
          autoplay=""
          background="transparent"
        ></lottie-player>
        <div class="fw-bold fs-6">${text}</div>
      </div>
    </div>`;
  }
}

(window as any).glitter.setModule(import.meta.url, POSSetting);
