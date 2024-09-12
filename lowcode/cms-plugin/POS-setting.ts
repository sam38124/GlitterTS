import {GVC} from '../glitterBundle/GVController.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {PaymentPage} from './pos-pages/payment-page.js';
import {OrderDetail, ViewModel} from './pos-pages/models.js';
import {ProductsPage} from './pos-pages/products-page.js';
import {ShoppingOrderManager} from './shopping-order-manager.js';
import {GlobalUser} from '../glitter-base/global/global-user.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {NormalPageEditor} from '../editor/normal-page-editor.js';
import {PosSetting} from "./pos-pages/pos-setting.js";
import {PayConfig} from "./pos-pages/pay-config.js";
import {ApiPageConfig} from "../api/pageConfig.js";

function getConfig() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    return saasConfig;
}

export class POSSetting {
    public static login(gvc: GVC) {
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const html = String.raw;
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
                    return html`
                        <section class="vw-100 vh-100"
                                 style="background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);    box-sizing: border-box; display: flex;    align-items: center;    justify-content: center; background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);    padding-top: 120px;    padding-bottom: 130px;">
                            <div class=""
                                 style="border-radius: 30px;    background: #FFF;    box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 0.15);    display: flex;    width: 576px;max-width: calc(100% - 30px);    padding: 40px;    flex-direction: column;    justify-content: center;    align-items: center;    gap: 42px;"
                            >
                                <div class=""
                                     style="color: #393939;        text-align: center;        font-size: 32px;        font-style: normal;        font-weight: 700;        line-height: 140%;    "
                                >POS系統登入
                                </div>
                                <div class=""
                                     style="width: 100%;    display: flex;    flex-direction: column;    align-items: flex-start;        align-self: stretch;     gap: 32px;"
                                >
                                    <div class=""
                                         style="display: flex;    flex-direction: column;    align-items: flex-start;    gap: 12px;    align-self: stretch;"
                                    >
                                        <div class=""
                                             style="display: flex;    flex-direction: column;    align-items: flex-start;    gap: 4px;    align-self: stretch;"
                                        >
                                            <div class="mb-2"
                                                 style="color: #393939;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;">
                                                管理員帳號或員工編號
                                            </div>
                                            <input class=""
                                                   style="display: flex;    padding: 10px 18px;    align-items: center;    gap: 10px;    align-self: stretch;    border-radius: 10px;    border: 1px solid #DDD;    background: #FFF;    width: 100%;    font-size: 16px;    font-style: normal;    font-weight: 400;    line-height: 140%;"

                                                   placeholder="請輸入管理員帳號或員工編號" value=""
                                                   onchange="${gvc.event((e, event) => {
                                                       vm.account = e.value;
                                                   })}"></div>
                                        <div class=""
                                             style="display: flex;    flex-direction: column;    align-items: flex-start;    gap: 4px;    align-self: stretch;"
                                        >
                                            <div class="mb-2"
                                                 style="color: #393939;        font-size: 16px;        font-style: normal;        font-weight: 700;        line-height: normal;"
                                            >密碼
                                            </div>
                                            <input class=""
                                                   style="display: flex;    height: 40px;    padding: 10px 18px;    align-items: center;    gap: 10px;    align-self: stretch;    width: 100%;    border-radius: 10px;    border: 1px solid #DDD;    background: #FFF;"
                                                   placeholder="請輸入密碼" type="password" value=""
                                                   onchange="${gvc.event((e, event) => {
                                                       vm.pwd = e.value;
                                                   })}">
                                        </div>
                                    </div>
                                    <div class=""
                                         style="display: flex;    width: 100%;    padding: 16px ;    gap: 10px;    border-radius: 100px;    background: linear-gradient(233deg, #FFB400 -22.7%, #FF6C02 114.57%);    text-align: center;    align-items: center;    justify-content: center;    color: #FFF;    font-size: 20px;    font-style: normal;    font-weight: 700;    line-height: normal;    letter-spacing: 1.6px;    cursor: pointer;"
                                         onclick="${gvc.event(() => {
                                             dialog.dataLoading({visible: true});
                                             ApiUser.login({
                                                 app_name: 'shopnex',
                                                 account: vm.account,
                                                 pwd: vm.pwd,
                                             }).then(async (r) => {
                                                 dialog.dataLoading({visible: false});
                                                 if (r.result) {
                                                     GlobalUser.saas_token = r.response.token;
                                                     if (
                                                             (
                                                                     await ApiUser.checkAdminAuth({
                                                                         app: gvc.glitter.getUrlParameter('app-id'),
                                                                         token: GlobalUser.saas_token,
                                                                     })
                                                             ).response.result
                                                     ) {
                                                         gvc.recreateView();
                                                     } else {
                                                         dialog.errorMessage({text: '帳號或密碼錯誤!'});
                                                     }
                                                 } else {
                                                     dialog.errorMessage({text: '帳號或密碼錯誤!'});
                                                 }
                                             });
                                         })}">登入
                                    </div>
                                </div>
                        </section>`;
                },
            };
        });
    }

    public static async initial(gvc: GVC) {
        gvc.glitter.share.editorViewModel = {
            app_config_original: {}
        }
        return new Promise(async (resolve, reject)=>{
            ApiPageConfig.getAppConfig().then((res) => {
                gvc.glitter.share.editorViewModel.app_config_original = res.response.result[0];
                gvc.glitter.share.editorViewModel.domain = res.response.result[0].domain;
                gvc.glitter.share.editorViewModel.originalDomain = gvc.glitter.share.editorViewModel.domain;
                resolve(true);
            });
        })
    }

    public static main(gvc: GVC) {
        //設定裝置類型
        gvc.glitter.runJsInterFace("pos-device", {}, (res) => {
            PayConfig.deviceType = res.deviceType || 'web';
        })
        //

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
        POSSetting.initialStyle(gvc);
        //提供給編輯器使用
        gvc.glitter.share.NormalPageEditor = NormalPageEditor;
        getConfig().config.appName = gvc.glitter.getUrlParameter('app-id');
        (window as any).glitterBase = 'shopnex';
        (window as any).appName = gvc.glitter.getUrlParameter('app-id');
        (window as any).saasConfig.config.token = GlobalUser.saas_token;
        gvc.glitter.addStyleLink('./css/editor.css');
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: async () => {
                    const res = await ApiUser.checkAdminAuth({
                        app: gvc.glitter.getUrlParameter('app-id'),
                        token: GlobalUser.saas_token,
                    });
                    if (res.response.result) {
                        await POSSetting.initial(gvc)
                        return POSSetting.posView(gvc);
                    } else {
                        return POSSetting.login(gvc);
                    }
                },
                divCreate: {},
            };
        });
    }

    public static posView(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: ViewModel = {
            id: glitter.getUUID(),
            filterID: glitter.getUUID(),
            type: 'home',
            order: {},
            query: '',
            productSearch: [],
            searchable: true,
            categorySearch: true,
            categories: [
                {
                    key: 'all',
                    value: '全部商品',
                    select: true,
                },
            ],
            paySelect: 'cash',
        };
        const html = String.raw;

        let orderDetail = JSON.parse(JSON.stringify(new OrderDetail(0, 0)));
        glitter.share.clearOrderData = () => {
            orderDetail = JSON.parse(JSON.stringify(new OrderDetail(0, 0)));
            (orderDetail.user_info.shipment as any) = 'now';
        };
        if (localStorage.getItem('pos_order_detail')) {
            orderDetail = JSON.parse(localStorage.getItem('pos_order_detail') as string);
            if (orderDetail.lineItems && orderDetail.lineItems.length > 0) {
                vm.type = 'home';
            }
        } else {
            (orderDetail.user_info.shipment as any) = 'now';
        }

        if (!orderDetail.lineItems || orderDetail.lineItems.length === 0) {
            vm.type = 'home';
            (orderDetail.user_info.shipment as any) = 'now';
        }
        return (
            gvc.bindView(() => {
                return {
                    bind: vm.id,
                    dataList: [{obj: vm, key: 'type'}],
                    view: () => {
                        gvc.addStyle(`
                        .product-show{
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                        
                        }
                        .product-show::-webkit-scrollbar {
                            display: none;  /* Chrome, Safari, Opera */
                        }
                    `);
                        return html`
                            <div
                                    class="d-flex nav-top"
                                    style="z-index:2;height: 86px;width: 100%;background: #FFF;box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);padding-top: 6px;position: fixed;left: 0;top: 0;"
                            >
                                <div
                                        class="POS-logo h-100 d-flex align-items-center ${document.body.offsetWidth < 800 ? `justify-content-center` : ``} mx-2 w-100"
                                        style="${document.body.offsetWidth < 800 ? `gap: 0px;` : `gap: 32px;padding-left: 24px;`}"
                                >
                                    ${document.body.offsetWidth < 800 && vm.type==='menu'
                                            ? `
                                <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/size1440_s*px$_425460019_424417803637934_9083646427244839885_n.jpg" style="width:50px;height: 50px;border-radius: 50%;" >
                               
                                `
                                            : `<div class="ms-2 d-flex align-items-center" style="gap:10px;"><svg width="157" height="28" viewBox="0 0 157 28" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.812 17.972C2.28067 18.342 3.08233 18.8477 4.217 19.489C5.37633 20.1303 6.474 20.451 7.51 20.451C8.57067 20.451 9.101 20.044 9.101 19.23C9.101 18.86 8.953 18.5393 8.657 18.268C8.361 17.972 7.81833 17.639 7.029 17.269C6.23967 16.899 5.64767 16.6153 5.253 16.418C4.85833 16.196 4.328 15.8507 3.662 15.382C3.02067 14.8887 2.52733 14.383 2.182 13.865C1.19533 12.459 0.702 10.6707 0.702 8.5C0.702 6.32933 1.50367 4.504 3.107 3.024C4.735 1.51933 6.85633 0.766998 9.471 0.766998C11.247 0.766998 12.8873 0.964332 14.392 1.359C15.8967 1.729 16.6737 2.22233 16.723 2.839C16.723 2.913 16.723 2.987 16.723 3.061C16.723 3.92433 16.4517 5.022 15.909 6.354C15.3663 7.66133 14.984 8.389 14.762 8.537C13.1833 7.723 11.765 7.316 10.507 7.316C9.27367 7.316 8.657 7.76 8.657 8.648C8.657 9.19067 9.11333 9.67167 10.026 10.091C10.2233 10.1897 10.507 10.3253 10.877 10.498C11.247 10.6707 11.6663 10.8803 12.135 11.127C12.6283 11.349 13.1463 11.645 13.689 12.015C14.2563 12.3603 14.8607 12.829 15.502 13.421C16.8093 14.6543 17.463 16.2823 17.463 18.305C17.463 20.9443 16.7353 23.1027 15.28 24.78C13.8247 26.4573 11.58 27.3207 8.546 27.37C7.066 27.37 5.72167 27.2467 4.513 27C3.329 26.7533 2.293 26.2723 1.405 25.557C0.517 24.8417 0.073 23.9783 0.073 22.967C0.073 21.9557 0.258 20.9567 0.628 19.97C0.998 18.9587 1.39267 18.2927 1.812 17.972ZM40.6343 26.371C40.6343 26.7903 39.3886 27 36.8973 27C34.4059 27 33.1603 26.7903 33.1603 26.371V17.861H27.9803V26.371C27.9803 26.7903 26.7346 27 24.2433 27C21.7519 27 20.5063 26.7903 20.5063 26.371V1.84C20.5063 1.322 21.7519 1.063 24.2433 1.063C26.7346 1.063 27.9803 1.322 27.9803 1.84V10.535H33.1603V1.914C33.1603 1.56867 33.7769 1.322 35.0103 1.174C35.6516 1.12467 36.2806 1.1 36.8973 1.1L38.7843 1.174C40.0176 1.322 40.6343 1.56867 40.6343 1.914V26.371ZM55.3068 27.37C51.8534 27.37 49.0291 26.2353 46.8338 23.966C44.6631 21.6967 43.5778 18.3913 43.5778 14.05C43.5778 9.684 44.6754 6.37867 46.8708 4.134C49.0908 1.88933 51.9398 0.766998 55.4178 0.766998C58.9204 0.766998 61.7448 1.877 63.8908 4.097C66.0368 6.29233 67.1098 9.63467 67.1098 14.124C67.1098 18.5887 66.0121 21.9187 63.8168 24.114C61.6214 26.2847 58.7848 27.37 55.3068 27.37ZM55.3438 7.871C54.1598 7.871 53.1608 8.41367 52.3468 9.499C51.5574 10.5843 51.1628 12.1137 51.1628 14.087C51.1628 16.0357 51.5451 17.5403 52.3098 18.601C53.0744 19.637 54.0734 20.155 55.3068 20.155C56.5648 20.155 57.5761 19.6247 58.3408 18.564C59.1301 17.5033 59.5248 15.9863 59.5248 14.013C59.5248 12.0397 59.1178 10.5227 58.3038 9.462C57.5144 8.40133 56.5278 7.871 55.3438 7.871ZM73.2995 27.074C71.0548 27.074 69.9325 26.8273 69.9325 26.334V2.358C69.9325 1.51933 70.3148 1.1 71.0795 1.1H77.5915C81.2421 1.1 83.8691 1.85233 85.4725 3.357C87.1005 4.86167 87.9145 7.04467 87.9145 9.906C87.9145 12.274 87.1498 14.4447 85.6205 16.418C84.8558 17.4047 83.7335 18.194 82.2535 18.786C80.7735 19.378 79.0468 19.674 77.0735 19.674V26.297C77.0735 26.593 76.6048 26.8027 75.6675 26.926C74.7548 27.0247 73.9655 27.074 73.2995 27.074ZM77.0735 7.538V13.384H77.5545C78.4178 13.384 79.1455 13.1127 79.7375 12.57C80.3295 12.0273 80.6255 11.2627 80.6255 10.276C80.6255 9.28933 80.4158 8.58633 79.9965 8.167C79.6018 7.74767 78.8865 7.538 77.8505 7.538H77.0735ZM111.458 26.186C111.458 26.704 110.299 26.963 107.98 26.963C105.661 26.963 104.403 26.778 104.206 26.408L98.027 14.864V26.371C98.027 26.815 96.88 27.037 94.586 27.037C92.3167 27.037 91.182 26.815 91.182 26.371V1.618C91.182 1.248 92.1564 1.063 94.105 1.063C94.8697 1.063 95.7577 1.137 96.769 1.285C97.805 1.40833 98.434 1.655 98.656 2.025L104.576 13.421V1.803C104.576 1.33433 105.723 1.1 108.017 1.1C110.311 1.1 111.458 1.33433 111.458 1.803V26.186ZM127.199 11.386C127.668 11.386 127.902 12.2493 127.902 13.976C127.902 14.494 127.841 15.1107 127.717 15.826C127.619 16.5167 127.421 16.862 127.125 16.862H122.426V20.562H129.234C129.654 20.562 129.937 21.1047 130.085 22.19C130.159 22.6587 130.196 23.1643 130.196 23.707C130.196 24.225 130.122 24.9033 129.974 25.742C129.826 26.5807 129.58 27 129.234 27H116.58C115.643 27 115.174 26.6177 115.174 25.853V2.062C115.174 1.42067 115.458 1.1 116.025 1.1H129.271C129.789 1.1 130.048 2.19767 130.048 4.393C130.048 6.56367 129.789 7.649 129.271 7.649H122.426V11.386H127.199ZM147.148 2.099C147.444 1.359 148.986 0.989 151.773 0.989C152.489 0.989 153.364 1.05067 154.4 1.174C155.461 1.27267 155.991 1.37133 155.991 1.47L149.701 14.272L156.213 26.519C156.287 26.6423 155.757 26.7657 154.622 26.889C153.488 26.9877 152.526 27.037 151.736 27.037C148.604 27.037 146.889 26.6177 146.593 25.779L143.818 18.712L141.302 26.001C141.056 26.6917 139.477 27.037 136.566 27.037C135.851 27.037 134.963 26.9877 133.902 26.889C132.842 26.7903 132.361 26.6547 132.459 26.482L138.231 13.68L132.237 1.47C132.163 1.34666 132.669 1.23566 133.754 1.137C134.864 1.01366 135.802 0.951998 136.566 0.951998C139.674 0.951998 141.376 1.396 141.672 2.284L144.225 8.5L147.148 2.099Z"
                                          fill="url(#paint0_linear_3001_1051)"></path>
                                    <defs>
                                        <linearGradient id="paint0_linear_3001_1051" x1="-6" y1="-22.75" x2="13.6088"
                                                        y2="74.6316" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FFB400"></stop>
                                            <stop offset="1" stop-color="#FF6C02"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style="text-align: center; color: #8D8D8D; font-size: 38px; font-family: Lilita One; font-weight: 400; word-wrap: break-word">POS</div>
                                </div>`}
                                    
                                    <div class="searchBar ms-2 ${vm.type !=='menu' ? `d-none`:``} ${document.body.offsetWidth < 800 ? `flex-fill` : ``}"
                                         style="position: relative;max-width:calc(100% - 60px);">
                                        <input
                                                class="border-0 "
                                                placeholder="搜尋商品名稱或貨號"
                                                style="display: flex;${document.body.offsetWidth < 800
                                                        ? `width:100%;`
                                                        : `width: 357px;max-width:calc(100%);`}height: 56px;padding: 17px 24px;justify-content: center;gap: 10px;border-radius: 10px;font-size: 18px;background: #F7F7F7;"
                                                onchange="${gvc.event((e) => {

                                                    glitter.share.search_interval = setTimeout(() => {
                                                        vm.query = e.value;
                                                        vm.searchable = true
                                                        gvc.notifyDataChange('mainView')
                                                    }, 500)
                                                })}"
                                        />
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="25"
                                                viewBox="0 0 24 25"
                                                fill="none"
                                                style="width: 24px;height: 24px;flex-shrink: 0;position:absolute;top: 17px;right: 24px;"
                                        >
                                            <g clip-path="url(#clip0_12216_123850)">
                                                <path
                                                        d="M19.5 9.92139C19.5 12.0729 18.8016 14.0604 17.625 15.6729L23.5594 21.612C24.1453 22.1979 24.1453 23.1495 23.5594 23.7355C22.9734 24.3214 22.0219 24.3214 21.4359 23.7355L15.5016 17.7964C13.8891 18.9776 11.9016 19.6714 9.75 19.6714C4.36406 19.6714 0 15.3073 0 9.92139C0 4.53545 4.36406 0.171387 9.75 0.171387C15.1359 0.171387 19.5 4.53545 19.5 9.92139ZM9.75 16.6714C10.6364 16.6714 11.5142 16.4968 12.3331 16.1576C13.1521 15.8184 13.8962 15.3212 14.523 14.6944C15.1498 14.0676 15.647 13.3234 15.9862 12.5045C16.3254 11.6856 16.5 10.8078 16.5 9.92139C16.5 9.03496 16.3254 8.15722 15.9862 7.33827C15.647 6.51933 15.1498 5.77521 14.523 5.14842C13.8962 4.52162 13.1521 4.02442 12.3331 3.6852C11.5142 3.34598 10.6364 3.17139 9.75 3.17139C8.86358 3.17139 7.98583 3.34598 7.16689 3.6852C6.34794 4.02442 5.60382 4.52162 4.97703 5.14842C4.35023 5.77521 3.85303 6.51933 3.51381 7.33827C3.17459 8.15722 3 9.03496 3 9.92139C3 10.8078 3.17459 11.6856 3.51381 12.5045C3.85303 13.3234 4.35023 14.0676 4.97703 14.6944C5.60382 15.3212 6.34794 15.8184 7.16689 16.1576C7.98583 16.4968 8.86358 16.6714 9.75 16.6714Z"
                                                        fill="#8D8D8D"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_12216_123850">
                                                    <rect width="24" height="24" fill="white"
                                                          transform="translate(0 0.171387)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div class="flex-fill"></div>
                                    ${gvc.bindView(() => {
                                        return {
                                            bind: 'cartBtn',
                                            view: () => {
                                                if (!orderDetail.lineItems || orderDetail.lineItems.length === 0) {
                                                    return `<i class="fa-duotone fa-cart-shopping" style="color: #000000;
cursor: pointer;
 font-size: 20px;"></i>`;
                                                }
                                                return `<span style="position: relative;"><i class="fa-duotone fa-cart-shopping" style="color: #000000;
cursor: pointer;
 font-size: 20px;"></i><span style="position: absolute;top:-32px;right: -12px;"><span style="display: inline-block;
    background-color:#fe5541;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    text-align: center;
    font-size: 11px;
    font-weight: 400;
    line-height: 18px;
    color: #fff;
    position: absolute;
    top: 25px;
    right: 0px;">${orderDetail.lineItems.length}</span></span></span>`;
                                            },
                                            divCreate: {
                                                class: `nav-link js-cart-count d-sm-none ${vm.type !=='menu' ? `d-none`:``}`,
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
                                    })}
                                </div>
                            </div>
                            ${gvc.bindView({
                                bind: 'mainView',
                                view: async () => {
                                    let view = await (async () => {
                                        try {
                                            (orderDetail.user_info.shipment as any) = (orderDetail.user_info.shipment as any) || 'now';
                                            if (vm.type == 'payment') {
                                                return PaymentPage.main({
                                                    ogOrderData: orderDetail,
                                                    gvc: gvc,
                                                    vm: vm,

                                                });
                                            } else if (vm.type === 'order') {
                                                return `<div class="vw-100" style="overflow-y: scroll;">${ShoppingOrderManager.main(gvc, {isPOS: true})}</div>`;
                                            } else if (vm.type === 'setting') {
                                                return PosSetting.main({gvc: gvc, vm: vm})
                                            } else if(vm.type === 'home'){
                                                return `<iframe class="w-100" src="${glitter.root_path}home_page?appName=cms_system&cms=true&page=home_page" style="border: none;height: calc(100%);"></iframe>`
                                            }
                                            return ProductsPage.main({gvc: gvc, vm: vm, orderDetail: orderDetail});
                                        } catch (e) {
                                            console.log(e);
                                            return `${e}`;
                                        }
                                    })();
                                    if (document.body.clientWidth < 768) {
                                        view += `<div style="height: 100px;"><div`;
                                    }
                                    return view;
                                },
                                divCreate: {
                                    class: `h-100 ${document.body.clientWidth < 768 ? `` : `d-flex`}`,
                                    style: `background: #F7F7F7;`,
                                },
                            })}
                            ${gvc.bindView({
                                bind: 'nav-slide',
                                dataList: [{obj: vm, key: 'type'}],
                                view: () => {
                                    let page = [
                                        {
                                            selectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                                     viewBox="0 0 28 28" fill="none">
                                                    <g clip-path="url(#clip0_12231_77522)">
                                                        <path d="M13.2444 2.51333C13.6819 2.14758 14.3187 2.14758 14.7562 2.51333L27.5895 13.2933C28.0805 13.7072 28.1437 14.4339 27.7256 14.92C27.3076 15.406 26.5735 15.4638 26.0826 15.0547L24.8867 14.0537V23.029C24.8867 25.1561 23.1465 26.879 20.9978 26.879H6.99784C4.84923 26.879 3.10895 25.1561 3.10895 23.029V14.0537L1.91798 15.0547C1.427 15.4686 0.688116 15.406 0.274921 14.92C-0.138273 14.4339 -0.0799399 13.7024 0.411032 13.2933L13.2444 2.51333ZM13.9978 4.90995L5.44228 12.095V23.029C5.44228 23.8808 6.13742 24.569 6.99784 24.569H9.33117V17.254C9.33117 16.1905 10.2013 15.329 11.2756 15.329H16.7201C17.7944 15.329 18.6645 16.1905 18.6645 17.254V24.569H20.9978C21.8583 24.569 22.5534 23.8808 22.5534 23.029V12.095L13.9978 4.90995ZM11.6645 24.569H16.3312V17.639H11.6645V24.569Z"
                                                              fill="#393939"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_12231_77522">
                                                            <rect width="28" height="28" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>`,
                                            unselectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                                     viewBox="0 0 28 28" fill="none">
                                                    <g clip-path="url(#clip0_12231_77522)">
                                                        <path d="M13.2444 2.51333C13.6819 2.14758 14.3187 2.14758 14.7562 2.51333L27.5895 13.2933C28.0805 13.7072 28.1437 14.4339 27.7256 14.92C27.3076 15.406 26.5735 15.4638 26.0826 15.0547L24.8867 14.0537V23.029C24.8867 25.1561 23.1465 26.879 20.9978 26.879H6.99784C4.84923 26.879 3.10895 25.1561 3.10895 23.029V14.0537L1.91798 15.0547C1.427 15.4686 0.688116 15.406 0.274921 14.92C-0.138273 14.4339 -0.0799399 13.7024 0.411032 13.2933L13.2444 2.51333ZM13.9978 4.90995L5.44228 12.095V23.029C5.44228 23.8808 6.13742 24.569 6.99784 24.569H9.33117V17.254C9.33117 16.1905 10.2013 15.329 11.2756 15.329H16.7201C17.7944 15.329 18.6645 16.1905 18.6645 17.254V24.569H20.9978C21.8583 24.569 22.5534 23.8808 22.5534 23.029V12.095L13.9978 4.90995ZM11.6645 24.569H16.3312V17.639H11.6645V24.569Z"
                                                              fill="#949494"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_12231_77522">
                                                            <rect width="28" height="28" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>`,
                                            title: `首頁`,
                                            type: `home`
                                        },
                                        {
                                            selectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"
                                                     viewBox="0 0 26 26" fill="none">
                                                    <g clip-path="url(#clip0_12400_257115)">
                                                        <path
                                                                d="M17.5195 1.98572C17.0473 1.50837 16.2754 1.50329 15.798 1.97556C15.3207 2.44783 15.3156 3.2197 15.7879 3.69704L22.2727 10.2631C23.9941 12.0049 23.9941 14.8029 22.2727 16.5447L16.5902 22.2982C16.118 22.7756 16.123 23.5474 16.6004 24.0197C17.0777 24.492 17.8496 24.4869 18.3219 24.0095L24.0094 18.2611C26.6703 15.5697 26.6703 11.2431 24.0094 8.55173L17.5195 1.98572ZM12.3246 2.57478C11.7152 1.9654 10.8875 1.62517 10.0242 1.62517L2.4375 1.62517C1.0918 1.62517 0 2.71697 0 4.06267L0 11.6545C0 12.5177 0.340234 13.3455 0.949609 13.9549L9.48086 22.4861C10.7504 23.7556 12.807 23.7556 14.0766 22.4861L20.8559 15.7068C22.1254 14.4373 22.1254 12.3806 20.8559 11.1111L12.3246 2.57986V2.57478ZM2.4375 4.06267L10.0293 4.06267C10.2426 4.06267 10.4508 4.149 10.6031 4.30134L19.1344 12.8326C19.4492 13.1474 19.4492 13.6654 19.1344 13.9802L12.3551 20.7595C12.0402 21.0744 11.5223 21.0744 11.2074 20.7595L2.67617 12.2283C2.52383 12.076 2.4375 11.8677 2.4375 11.6545L2.4375 4.06267ZM7.3125 7.31267C7.3125 6.88169 7.14129 6.46837 6.83655 6.16362C6.5318 5.85887 6.11848 5.68767 5.6875 5.68767C5.25652 5.68767 4.8432 5.85887 4.53845 6.16362C4.2337 6.46837 4.0625 6.88169 4.0625 7.31267C4.0625 7.74365 4.2337 8.15697 4.53845 8.46172C4.8432 8.76646 5.25652 8.93767 5.6875 8.93767C6.11848 8.93767 6.5318 8.76646 6.83655 8.46172C7.14129 8.15697 7.3125 7.74365 7.3125 7.31267Z"
                                                                fill="#393939"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_12400_257115">
                                                            <rect width="26" height="26" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>`,
                                            unselectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28"
                                                     viewBox="0 0 29 28" fill="none">
                                                    <g clip-path="url(#clip0_12462_92)">
                                                        <path
                                                                d="M19.3672 2.13827C18.8586 1.62421 18.0273 1.61874 17.5133 2.12733C16.9992 2.63593 16.9937 3.46718 17.5023 3.98124L24.4859 11.0523C26.3398 12.9281 26.3398 15.9414 24.4859 17.8172L18.3664 24.0133C17.8578 24.5273 17.8633 25.3586 18.3773 25.8672C18.8914 26.3758 19.7227 26.3703 20.2312 25.8562L26.3562 19.6656C29.2219 16.7672 29.2219 12.1078 26.3562 9.20937L19.3672 2.13827ZM13.7727 2.77265C13.1164 2.1164 12.225 1.74999 11.2953 1.74999H3.125C1.67578 1.74999 0.5 2.92577 0.5 4.37499V12.5508C0.5 13.4805 0.866406 14.3719 1.52266 15.0281L10.7102 24.2156C12.0773 25.5828 14.2922 25.5828 15.6594 24.2156L22.9602 16.9148C24.3273 15.5476 24.3273 13.3328 22.9602 11.9656L13.7727 2.77812V2.77265ZM3.125 4.37499H11.3008C11.5305 4.37499 11.7547 4.46796 11.9187 4.63202L21.1062 13.8195C21.4453 14.1586 21.4453 14.7164 21.1062 15.0555L13.8055 22.3562C13.4664 22.6953 12.9086 22.6953 12.5695 22.3562L3.38203 13.1687C3.21797 13.0047 3.125 12.7805 3.125 12.5508V4.37499ZM8.375 7.87499C8.375 7.41086 8.19063 6.96574 7.86244 6.63755C7.53425 6.30937 7.08913 6.12499 6.625 6.12499C6.16087 6.12499 5.71575 6.30937 5.38756 6.63755C5.05937 6.96574 4.875 7.41086 4.875 7.87499C4.875 8.33912 5.05937 8.78424 5.38756 9.11243C5.71575 9.44062 6.16087 9.62499 6.625 9.62499C7.08913 9.62499 7.53425 9.44062 7.86244 9.11243C8.19063 8.78424 8.375 8.33912 8.375 7.87499Z"
                                                                fill="#949494"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_12462_92">
                                                            <rect width="28" height="28" fill="white"
                                                                  transform="translate(0.5)"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>`,
                                            title: `商品`,
                                            type: `menu`,
                                        },
                                        {
                                            selectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                                     viewBox="0 0 28 28" fill="none">
                                                    <path
                                                            d="M24.8889 4.375C25.3167 4.375 25.6667 4.76875 25.6667 5.25V7H2.33333V5.25C2.33333 4.76875 2.68333 4.375 3.11111 4.375H24.8889ZM25.6667 12.25V22.75C25.6667 23.2313 25.3167 23.625 24.8889 23.625H3.11111C2.68333 23.625 2.33333 23.2313 2.33333 22.75V12.25H25.6667ZM3.11111 1.75C1.39514 1.75 0 3.31953 0 5.25V22.75C0 24.6805 1.39514 26.25 3.11111 26.25H24.8889C26.6049 26.25 28 24.6805 28 22.75V5.25C28 3.31953 26.6049 1.75 24.8889 1.75H3.11111ZM5.83333 18.375C5.18681 18.375 4.66667 18.9602 4.66667 19.6875C4.66667 20.4148 5.18681 21 5.83333 21H8.16667C8.81319 21 9.33333 20.4148 9.33333 19.6875C9.33333 18.9602 8.81319 18.375 8.16667 18.375H5.83333ZM12.0556 18.375C11.409 18.375 10.8889 18.9602 10.8889 19.6875C10.8889 20.4148 11.409 21 12.0556 21H17.5C18.1465 21 18.6667 20.4148 18.6667 19.6875C18.6667 18.9602 18.1465 18.375 17.5 18.375H12.0556Z"
                                                            fill="#393939"
                                                    />
                                                </svg>`,
                                            unselectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                                     viewBox="0 0 28 28" fill="none">
                                                    <path
                                                            d="M24.8889 4.375C25.3167 4.375 25.6667 4.76875 25.6667 5.25V7H2.33333V5.25C2.33333 4.76875 2.68333 4.375 3.11111 4.375H24.8889ZM25.6667 12.25V22.75C25.6667 23.2313 25.3167 23.625 24.8889 23.625H3.11111C2.68333 23.625 2.33333 23.2313 2.33333 22.75V12.25H25.6667ZM3.11111 1.75C1.39514 1.75 0 3.31953 0 5.25V22.75C0 24.6805 1.39514 26.25 3.11111 26.25H24.8889C26.6049 26.25 28 24.6805 28 22.75V5.25C28 3.31953 26.6049 1.75 24.8889 1.75H3.11111ZM5.83333 18.375C5.18681 18.375 4.66667 18.9602 4.66667 19.6875C4.66667 20.4148 5.18681 21 5.83333 21H8.16667C8.81319 21 9.33333 20.4148 9.33333 19.6875C9.33333 18.9602 8.81319 18.375 8.16667 18.375H5.83333ZM12.0556 18.375C11.409 18.375 10.8889 18.9602 10.8889 19.6875C10.8889 20.4148 11.409 21 12.0556 21H17.5C18.1465 21 18.6667 20.4148 18.6667 19.6875C18.6667 18.9602 18.1465 18.375 17.5 18.375H12.0556Z"
                                                            fill="#8D8D8D"
                                                    />
                                                </svg>`,
                                            title: `款項`,
                                            type: `payment`,
                                        },
                                        {
                                            selectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29"
                                                     viewBox="0 0 29 29" fill="none">
                                                    <g clip-path="url(#clip0_12544_35571)">
                                                        <path
                                                                d="M21.75 4H19.5625H19.0375C18.6328 2.00391 16.8664 0.5 14.75 0.5C12.6336 0.5 10.8672 2.00391 10.4625 4H9.9375H7.75C5.81953 4 4.25 5.56953 4.25 7.5V25C4.25 26.9305 5.81953 28.5 7.75 28.5H21.75C23.6805 28.5 25.25 26.9305 25.25 25V7.5C25.25 5.56953 23.6805 4 21.75 4ZM8.625 6.625V7.9375C8.625 8.66484 9.21016 9.25 9.9375 9.25H14.75H19.5625C20.2898 9.25 20.875 8.66484 20.875 7.9375V6.625H21.75C22.2313 6.625 22.625 7.01875 22.625 7.5V25C22.625 25.4813 22.2313 25.875 21.75 25.875H7.75C7.26875 25.875 6.875 25.4813 6.875 25V7.5C6.875 7.01875 7.26875 6.625 7.75 6.625H8.625ZM13.4375 4.875C13.4375 4.5269 13.5758 4.19306 13.8219 3.94692C14.0681 3.70078 14.4019 3.5625 14.75 3.5625C15.0981 3.5625 15.4319 3.70078 15.6781 3.94692C15.9242 4.19306 16.0625 4.5269 16.0625 4.875C16.0625 5.2231 15.9242 5.55694 15.6781 5.80308C15.4319 6.04922 15.0981 6.1875 14.75 6.1875C14.4019 6.1875 14.0681 6.04922 13.8219 5.80308C13.5758 5.55694 13.4375 5.2231 13.4375 4.875ZM11.6875 15.375C11.6875 15.2026 11.6536 15.032 11.5876 14.8727C11.5216 14.7135 11.425 14.5688 11.3031 14.4469C11.1812 14.325 11.0365 14.2284 10.8773 14.1624C10.718 14.0964 10.5474 14.0625 10.375 14.0625C10.2026 14.0625 10.032 14.0964 9.87273 14.1624C9.71349 14.2284 9.5688 14.325 9.44692 14.4469C9.32505 14.5688 9.22837 14.7135 9.16241 14.8727C9.09645 15.032 9.0625 15.2026 9.0625 15.375C9.0625 15.5474 9.09645 15.718 9.16241 15.8773C9.22837 16.0365 9.32505 16.1812 9.44692 16.3031C9.5688 16.425 9.71349 16.5216 9.87273 16.5876C10.032 16.6536 10.2026 16.6875 10.375 16.6875C10.5474 16.6875 10.718 16.6536 10.8773 16.5876C11.0365 16.5216 11.1812 16.425 11.3031 16.3031C11.425 16.1812 11.5216 16.0365 11.5876 15.8773C11.6536 15.718 11.6875 15.5474 11.6875 15.375ZM13.875 14.5C13.3938 14.5 13 14.8938 13 15.375C13 15.8562 13.3938 16.25 13.875 16.25H19.125C19.6062 16.25 20 15.8562 20 15.375C20 14.8938 19.6062 14.5 19.125 14.5H13.875ZM13.875 19.75C13.3938 19.75 13 20.1437 13 20.625C13 21.1063 13.3938 21.5 13.875 21.5H19.125C19.6062 21.5 20 21.1063 20 20.625C20 20.1437 19.6062 19.75 19.125 19.75H13.875ZM10.375 21.9375C10.7231 21.9375 11.0569 21.7992 11.3031 21.5531C11.5492 21.3069 11.6875 20.9731 11.6875 20.625C11.6875 20.2769 11.5492 19.9431 11.3031 19.6969C11.0569 19.4508 10.7231 19.3125 10.375 19.3125C10.0269 19.3125 9.69306 19.4508 9.44692 19.6969C9.20078 19.9431 9.0625 20.2769 9.0625 20.625C9.0625 20.9731 9.20078 21.3069 9.44692 21.5531C9.69306 21.7992 10.0269 21.9375 10.375 21.9375Z"
                                                                fill="#393939"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_12544_35571">
                                                            <rect width="28" height="28" fill="white"
                                                                  transform="translate(0.75 0.5)"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>`,
                                            unselectIcon: html`
                                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29"
                                                     viewBox="0 0 29 29" fill="none">
                                                    <g clip-path="url(#clip0_12544_35571)">
                                                        <path
                                                                d="M21.75 4H19.5625H19.0375C18.6328 2.00391 16.8664 0.5 14.75 0.5C12.6336 0.5 10.8672 2.00391 10.4625 4H9.9375H7.75C5.81953 4 4.25 5.56953 4.25 7.5V25C4.25 26.9305 5.81953 28.5 7.75 28.5H21.75C23.6805 28.5 25.25 26.9305 25.25 25V7.5C25.25 5.56953 23.6805 4 21.75 4ZM8.625 6.625V7.9375C8.625 8.66484 9.21016 9.25 9.9375 9.25H14.75H19.5625C20.2898 9.25 20.875 8.66484 20.875 7.9375V6.625H21.75C22.2313 6.625 22.625 7.01875 22.625 7.5V25C22.625 25.4813 22.2313 25.875 21.75 25.875H7.75C7.26875 25.875 6.875 25.4813 6.875 25V7.5C6.875 7.01875 7.26875 6.625 7.75 6.625H8.625ZM13.4375 4.875C13.4375 4.5269 13.5758 4.19306 13.8219 3.94692C14.0681 3.70078 14.4019 3.5625 14.75 3.5625C15.0981 3.5625 15.4319 3.70078 15.6781 3.94692C15.9242 4.19306 16.0625 4.5269 16.0625 4.875C16.0625 5.2231 15.9242 5.55694 15.6781 5.80308C15.4319 6.04922 15.0981 6.1875 14.75 6.1875C14.4019 6.1875 14.0681 6.04922 13.8219 5.80308C13.5758 5.55694 13.4375 5.2231 13.4375 4.875ZM11.6875 15.375C11.6875 15.2026 11.6536 15.032 11.5876 14.8727C11.5216 14.7135 11.425 14.5688 11.3031 14.4469C11.1812 14.325 11.0365 14.2284 10.8773 14.1624C10.718 14.0964 10.5474 14.0625 10.375 14.0625C10.2026 14.0625 10.032 14.0964 9.87273 14.1624C9.71349 14.2284 9.5688 14.325 9.44692 14.4469C9.32505 14.5688 9.22837 14.7135 9.16241 14.8727C9.09645 15.032 9.0625 15.2026 9.0625 15.375C9.0625 15.5474 9.09645 15.718 9.16241 15.8773C9.22837 16.0365 9.32505 16.1812 9.44692 16.3031C9.5688 16.425 9.71349 16.5216 9.87273 16.5876C10.032 16.6536 10.2026 16.6875 10.375 16.6875C10.5474 16.6875 10.718 16.6536 10.8773 16.5876C11.0365 16.5216 11.1812 16.425 11.3031 16.3031C11.425 16.1812 11.5216 16.0365 11.5876 15.8773C11.6536 15.718 11.6875 15.5474 11.6875 15.375ZM13.875 14.5C13.3938 14.5 13 14.8938 13 15.375C13 15.8562 13.3938 16.25 13.875 16.25H19.125C19.6062 16.25 20 15.8562 20 15.375C20 14.8938 19.6062 14.5 19.125 14.5H13.875ZM13.875 19.75C13.3938 19.75 13 20.1437 13 20.625C13 21.1063 13.3938 21.5 13.875 21.5H19.125C19.6062 21.5 20 21.1063 20 20.625C20 20.1437 19.6062 19.75 19.125 19.75H13.875ZM10.375 21.9375C10.7231 21.9375 11.0569 21.7992 11.3031 21.5531C11.5492 21.3069 11.6875 20.9731 11.6875 20.625C11.6875 20.2769 11.5492 19.9431 11.3031 19.6969C11.0569 19.4508 10.7231 19.3125 10.375 19.3125C10.0269 19.3125 9.69306 19.4508 9.44692 19.6969C9.20078 19.9431 9.0625 20.2769 9.0625 20.625C9.0625 20.9731 9.20078 21.3069 9.44692 21.5531C9.69306 21.7992 10.0269 21.9375 10.375 21.9375Z"
                                                                fill="#8D8D8D"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_12544_35571">
                                                            <rect width="28" height="28" fill="white"
                                                                  transform="translate(0.75 0.5)"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>`,
                                            title: `訂單`,
                                            type: `order`,
                                        },
                                        // {
                                        //     selectIcon: html`
                                        //         <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29"
                                        //              viewBox="0 0 29 29" fill="none">
                                        //             <g clip-path="url(#clip0_13485_10484)">
                                        //                 <path d="M14.0998 0.5C15.0295 0.5 15.9373 0.592969 16.8233 0.7625C17.2553 0.844531 18.0155 1.09609 18.4311 1.86172C18.5405 2.06406 18.628 2.27734 18.6826 2.50703L19.1912 4.6125C19.2678 4.92969 19.8037 5.24141 20.1155 5.14844L22.1936 4.53594C22.4123 4.47031 22.6365 4.4375 22.8608 4.43203C23.7412 4.40469 24.3373 4.94609 24.6272 5.27422C25.8358 6.64688 26.7655 8.26016 27.3561 9.99375C27.4983 10.4094 27.6623 11.1859 27.2084 11.9297C27.0881 12.1266 26.9405 12.3125 26.7709 12.4766L25.2014 13.9695C24.9717 14.1883 24.9717 14.8172 25.2014 15.0359L26.7709 16.5289C26.9405 16.693 27.0881 16.8789 27.2084 17.0758C27.6569 17.8195 27.4928 18.5961 27.3561 19.0117C26.7655 20.7453 25.8358 22.3531 24.6272 23.7312C24.3373 24.0594 23.7358 24.6008 22.8608 24.5734C22.6365 24.568 22.4123 24.5297 22.1936 24.4695L20.1155 23.8516C19.8037 23.7586 19.2678 24.0703 19.1912 24.3875L18.6826 26.493C18.628 26.7227 18.5405 26.9414 18.4311 27.1383C18.01 27.9039 17.2498 28.15 16.8233 28.2375C15.9373 28.407 15.0295 28.5 14.0998 28.5C13.1701 28.5 12.2623 28.407 11.3764 28.2375C10.9444 28.1555 10.1842 27.9039 9.76858 27.1383C9.65921 26.9359 9.57171 26.7227 9.51702 26.493L9.00842 24.3875C8.93186 24.0703 8.39592 23.7586 8.08421 23.8516L6.00608 24.4641C5.78733 24.5297 5.56311 24.5625 5.33889 24.568C4.45843 24.5953 3.86233 24.0539 3.57249 23.7258C2.36936 22.3531 1.43421 20.7398 0.843581 19.0063C0.701394 18.5906 0.537331 17.8141 0.991237 17.0703C1.11155 16.8734 1.25921 16.6875 1.42874 16.5234L2.99827 15.0305C3.22796 14.8117 3.22796 14.1828 2.99827 13.9641L1.42327 12.4711C1.25374 12.307 1.10608 12.1211 0.985769 11.9242C0.537331 11.1805 0.701394 10.4039 0.843581 9.99375C1.43421 8.26016 2.36389 6.65234 3.57249 5.27422C3.86233 4.94609 4.46389 4.40469 5.33889 4.43203C5.56311 4.4375 5.78733 4.47578 6.00608 4.53594L8.08421 5.14844C8.39592 5.24141 8.93186 4.92969 9.00842 4.6125L9.51702 2.50703C9.57171 2.27734 9.65921 2.05859 9.76858 1.86172C10.1897 1.09609 10.9498 0.85 11.3764 0.7625C12.2623 0.592969 13.1701 0.5 14.0998 0.5ZM12.0272 3.31094L11.5623 5.23047C11.1358 6.99687 9.08499 8.17813 7.34046 7.66953L5.45374 7.11172C4.55139 8.16719 3.84046 9.39219 3.37561 10.7047L4.80842 12.0664C6.12092 13.3133 6.12092 15.6867 4.80842 16.9336L3.37561 18.2953C3.84046 19.6078 4.55139 20.8328 5.45374 21.8883L7.34592 21.3305C9.08499 20.8164 11.1412 22.0031 11.5678 23.7695L12.0326 25.6891C13.378 25.9352 14.8381 25.9352 16.1834 25.6891L16.6483 23.7695C17.0748 22.0031 19.1256 20.8219 20.8701 21.3305L22.7623 21.8883C23.6647 20.8328 24.3756 19.6078 24.8405 18.2953L23.4076 16.9336C22.0951 15.6867 22.0951 13.3133 23.4076 12.0664L24.8405 10.7047C24.3756 9.39219 23.6647 8.16719 22.7623 7.11172L20.8701 7.66953C19.1311 8.18359 17.0748 6.99687 16.6483 5.23047L16.1834 3.31094C14.8381 3.06484 13.378 3.06484 12.0326 3.31094H12.0272ZM11.4748 14.5C11.4748 15.1962 11.7514 15.8639 12.2437 16.3562C12.736 16.8484 13.4036 17.125 14.0998 17.125C14.796 17.125 15.4637 16.8484 15.956 16.3562C16.4483 15.8639 16.7248 15.1962 16.7248 14.5C16.7248 13.8038 16.4483 13.1361 15.956 12.6438C15.4637 12.1516 14.796 11.875 14.0998 11.875C13.4036 11.875 12.736 12.1516 12.2437 12.6438C11.7514 13.1361 11.4748 13.8038 11.4748 14.5ZM14.0998 19.75C12.7074 19.75 11.3721 19.1969 10.3875 18.2123C9.40295 17.2277 8.84983 15.8924 8.84983 14.5C8.84983 13.1076 9.40295 11.7723 10.3875 10.7877C11.3721 9.80312 12.7074 9.25 14.0998 9.25C15.4922 9.25 16.8276 9.80312 17.8121 10.7877C18.7967 11.7723 19.3498 13.1076 19.3498 14.5C19.3498 15.8924 18.7967 17.2277 17.8121 18.2123C16.8276 19.1969 15.4922 19.75 14.0998 19.75Z"
                                        //                       fill="#393939"/>
                                        //             </g>
                                        //             <defs>
                                        //                 <clipPath id="clip0_13485_10484">
                                        //                     <rect width="28" height="28" fill="white"
                                        //                           transform="translate(0.0998535 0.5)"/>
                                        //                 </clipPath>
                                        //             </defs>
                                        //         </svg>`,
                                        //     unselectIcon: html`
                                        //         <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29"
                                        //              viewBox="0 0 29 29" fill="none">
                                        //             <g clip-path="url(#clip0_13485_10484)">
                                        //                 <path d="M14.0998 0.5C15.0295 0.5 15.9373 0.592969 16.8233 0.7625C17.2553 0.844531 18.0155 1.09609 18.4311 1.86172C18.5405 2.06406 18.628 2.27734 18.6826 2.50703L19.1912 4.6125C19.2678 4.92969 19.8037 5.24141 20.1155 5.14844L22.1936 4.53594C22.4123 4.47031 22.6365 4.4375 22.8608 4.43203C23.7412 4.40469 24.3373 4.94609 24.6272 5.27422C25.8358 6.64688 26.7655 8.26016 27.3561 9.99375C27.4983 10.4094 27.6623 11.1859 27.2084 11.9297C27.0881 12.1266 26.9405 12.3125 26.7709 12.4766L25.2014 13.9695C24.9717 14.1883 24.9717 14.8172 25.2014 15.0359L26.7709 16.5289C26.9405 16.693 27.0881 16.8789 27.2084 17.0758C27.6569 17.8195 27.4928 18.5961 27.3561 19.0117C26.7655 20.7453 25.8358 22.3531 24.6272 23.7312C24.3373 24.0594 23.7358 24.6008 22.8608 24.5734C22.6365 24.568 22.4123 24.5297 22.1936 24.4695L20.1155 23.8516C19.8037 23.7586 19.2678 24.0703 19.1912 24.3875L18.6826 26.493C18.628 26.7227 18.5405 26.9414 18.4311 27.1383C18.01 27.9039 17.2498 28.15 16.8233 28.2375C15.9373 28.407 15.0295 28.5 14.0998 28.5C13.1701 28.5 12.2623 28.407 11.3764 28.2375C10.9444 28.1555 10.1842 27.9039 9.76858 27.1383C9.65921 26.9359 9.57171 26.7227 9.51702 26.493L9.00842 24.3875C8.93186 24.0703 8.39592 23.7586 8.08421 23.8516L6.00608 24.4641C5.78733 24.5297 5.56311 24.5625 5.33889 24.568C4.45843 24.5953 3.86233 24.0539 3.57249 23.7258C2.36936 22.3531 1.43421 20.7398 0.843581 19.0063C0.701394 18.5906 0.537331 17.8141 0.991237 17.0703C1.11155 16.8734 1.25921 16.6875 1.42874 16.5234L2.99827 15.0305C3.22796 14.8117 3.22796 14.1828 2.99827 13.9641L1.42327 12.4711C1.25374 12.307 1.10608 12.1211 0.985769 11.9242C0.537331 11.1805 0.701394 10.4039 0.843581 9.99375C1.43421 8.26016 2.36389 6.65234 3.57249 5.27422C3.86233 4.94609 4.46389 4.40469 5.33889 4.43203C5.56311 4.4375 5.78733 4.47578 6.00608 4.53594L8.08421 5.14844C8.39592 5.24141 8.93186 4.92969 9.00842 4.6125L9.51702 2.50703C9.57171 2.27734 9.65921 2.05859 9.76858 1.86172C10.1897 1.09609 10.9498 0.85 11.3764 0.7625C12.2623 0.592969 13.1701 0.5 14.0998 0.5ZM12.0272 3.31094L11.5623 5.23047C11.1358 6.99687 9.08499 8.17813 7.34046 7.66953L5.45374 7.11172C4.55139 8.16719 3.84046 9.39219 3.37561 10.7047L4.80842 12.0664C6.12092 13.3133 6.12092 15.6867 4.80842 16.9336L3.37561 18.2953C3.84046 19.6078 4.55139 20.8328 5.45374 21.8883L7.34592 21.3305C9.08499 20.8164 11.1412 22.0031 11.5678 23.7695L12.0326 25.6891C13.378 25.9352 14.8381 25.9352 16.1834 25.6891L16.6483 23.7695C17.0748 22.0031 19.1256 20.8219 20.8701 21.3305L22.7623 21.8883C23.6647 20.8328 24.3756 19.6078 24.8405 18.2953L23.4076 16.9336C22.0951 15.6867 22.0951 13.3133 23.4076 12.0664L24.8405 10.7047C24.3756 9.39219 23.6647 8.16719 22.7623 7.11172L20.8701 7.66953C19.1311 8.18359 17.0748 6.99687 16.6483 5.23047L16.1834 3.31094C14.8381 3.06484 13.378 3.06484 12.0326 3.31094H12.0272ZM11.4748 14.5C11.4748 15.1962 11.7514 15.8639 12.2437 16.3562C12.736 16.8484 13.4036 17.125 14.0998 17.125C14.796 17.125 15.4637 16.8484 15.956 16.3562C16.4483 15.8639 16.7248 15.1962 16.7248 14.5C16.7248 13.8038 16.4483 13.1361 15.956 12.6438C15.4637 12.1516 14.796 11.875 14.0998 11.875C13.4036 11.875 12.736 12.1516 12.2437 12.6438C11.7514 13.1361 11.4748 13.8038 11.4748 14.5ZM14.0998 19.75C12.7074 19.75 11.3721 19.1969 10.3875 18.2123C9.40295 17.2277 8.84983 15.8924 8.84983 14.5C8.84983 13.1076 9.40295 11.7723 10.3875 10.7877C11.3721 9.80312 12.7074 9.25 14.0998 9.25C15.4922 9.25 16.8276 9.80312 17.8121 10.7877C18.7967 11.7723 19.3498 13.1076 19.3498 14.5C19.3498 15.8924 18.7967 17.2277 17.8121 18.2123C16.8276 19.1969 15.4922 19.75 14.0998 19.75Z"
                                        //                       fill="#949494"/>
                                        //             </g>
                                        //             <defs>
                                        //                 <clipPath id="clip0_13485_10484">
                                        //                     <rect width="28" height="28" fill="white"
                                        //                           transform="translate(0.0998535 0.5)"/>
                                        //                 </clipPath>
                                        //             </defs>
                                        //         </svg>`,
                                        //     title: `設定`,
                                        //     type: `setting`,
                                        // }
                                    ];
                                    return page
                                            .map((data) => {
                                                return html`
                                                    <div
                                                            class="d-flex flex-column justify-content-center align-items-center"
                                                            style="padding-top: 16px;padding-bottom: 16px;gap: 6px;font-weight: 500;letter-spacing: 0.8px;${vm.type == data.type
                                                                    ? `color:#393939;${document.body.offsetWidth < 800 ? `border-top: 3px solid #393939;font-size: 16px;` : `border-right: 3px solid #393939;font-size: 18px;`}`
                                                                    : 'color:#949494;'}flex:1;cursor:pointer;${glitter.ut.frSize({
                                                                sm: `padding-right:32px;padding-left:32px;`
                                                            }, ``)}"
                                                            onclick="${gvc.event(() => {
                                                                vm.type = data.type;
                                                            })}"
                                                    >
                                                        ${vm.type == data.type ? data.selectIcon : data.unselectIcon}
                                                        ${data.title}
                                                    </div>
                                                `;
                                            })
                                            .join('');
                                },
                                divCreate: () => {
                                    if (document.body.offsetWidth < 800) {
                                        return {
                                            class: ` flex-row pos-footer-menu`,
                                            style: `width: 100%;gap:24px;height:100px;position:fixed;bottom:0px;left:0px;background: #FFF;box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.05); justify-content: space-around;display:flex;`,
                                        };
                                    } else {
                                        return {
                                            class: `d-flex nav-left flex-column`,
                                            style: `height: 100%;gap:24px;padding-top:114px;position:fixed;left:0px;top:0px;background: #FFF;box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.05);`,
                                        };
                                    }
                                },
                            })}
                        `;
                    },
                    divCreate: () => {
                        if (document.body.offsetWidth > 800) {
                            return {style: `padding: 86px 0 0 103px;height:100vh;width:100vw;color:#393939;`};
                        } else {
                            return {style: `padding-top:86px;padding-bottom:0px;height:100vh;width:100vw;color:#393939;overflow-y:auto;`};
                        }
                    },
                };
            }) + NormalPageEditor.leftNav(gvc)
        );
    }

    public static initialStyle(gvc: GVC) {
        const css = String.raw;
        gvc.addStyle(css`
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
        gvc.addStyle(css`
            .scroll-right-in {
                right: -120%; /* 將元素移到畫面外 */
                animation: slideInRight 0.5s ease-out forwards;
            }

            .scroll-right-out {
                right: 0; /* 將元素移到畫面外 */
                animation: slideOutRight 0.5s ease-out forwards;
            }

            /* @keyframes 定義動畫 */
            @keyframes slideInRight {
                0% {
                    right: -120%; /* 起始位置在畫面外 */
                }
                100% {
                    right: 0; /* 結束位置在畫面內 */
                }
            }
            /* @keyframes 定義動畫 */
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

    public static emptyView(text: string) {
        (window as any).glitter.addMtScript([{src: 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'}], () => {
        }, () => {
        })
        return ` <div class="d-flex align-items-center justify-content-center w-100  "
                     style="height: calc(100vh - 200px);">
                    <div class="d-flex flex-column align-items-center justify-content-center" style="gap:30px;">
                        <lottie-player class="rounded-circle bg-white" style="max-width: 100%;width: 300px;"
                                       src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
                                       speed="1"
                                       loop="" autoplay="" background="transparent"></lottie-player>
                        <div class="fw-bold fs-6"> ${text}</div>
                    </div>

                </div>`
    }
}

(window as any).glitter.setModule(import.meta.url, POSSetting);
