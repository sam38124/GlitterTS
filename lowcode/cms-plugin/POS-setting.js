var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { PaymentPage } from './pos-pages/payment-page.js';
import { OrderDetail } from './pos-pages/models.js';
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
const html = String.raw;
const css = String.raw;
export class POSSetting {
    static loginManager(gvc, mode, result) {
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm = {
                account: '',
                pwd: '',
            };
            return {
                bind: id,
                view: () => {
                    return html `
                        <section class="vw-100 vh-100"
                                 style="  box-sizing: border-box; display: flex;    align-items: center;    justify-content: center;  padding-top: 120px;    padding-bottom: 130px;
background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);;
">
                            <div class=""
                                 style="border-radius: 30px;    background: #FFF;    box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 0.15);    display: flex;    width: 576px;max-width: calc(100% - 30px);    padding: 40px;    flex-direction: column;    justify-content: center;    align-items: center;"
                            >
                                <div class="w-100 d-flex align-items-center mb-3 mb-sm-4" style="">
                                    <img class="w-100"
                                         src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s7s6sbs6s6s5s0s5_messageImage_1726330128813.jpg">
                                </div>
                                <div class=" px-sm-3"
                                     style="width: 100%;    display: flex;    flex-direction: column;    align-items: flex-start;        align-self: stretch;     gap: 24px;"
                                >
                                    <div class=""
                                         style="display: flex;    flex-direction: column;    align-items: flex-start;    gap: 12px;    align-self: stretch;"
                                    >
                                        <div class=""
                                             style="display: flex;    flex-direction: column;    align-items: flex-start;    gap: 4px;    align-self: stretch;"
                                        >
                                            <div class="mb-2"
                                                 style="color: #393939;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;">
                                                管理員帳號
                                            </div>
                                            <input class=""
                                                   style="display: flex;    padding: 10px 18px;    align-items: center;    gap: 10px;    align-self: stretch;    border-radius: 10px;    border: 1px solid #DDD;    background: #FFF;    width: 100%;    font-size: 16px;    font-style: normal;    font-weight: 400;    line-height: 140%;"

                                                   placeholder="請輸入管理員帳號" value=""
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
                                    <div class="w-100 d-flex" style="gap:15px;">
                                        <div class="${mode === 'switch' ? `` : `d-none`}"
                                             style="display: flex;    width: 100%;    padding: 16px ;    gap: 10px;   border-radius: 10px;
background: #DDD;
height: 51px;
                                            text-align: center;    align-items: center;    justify-content: center;    color: #393939;    font-size: 20px;    font-style: normal;    font-weight: 700;    line-height: normal;    letter-spacing: 1.6px;    cursor: pointer;"
                                             onclick="${gvc.event(() => {
                        gvc.closeDialog();
                    })}">取消
                                        </div>
                                        <div class=""
                                             style="display: flex;    width: 100%;    padding: 16px ;    gap: 10px;   border-radius: 10px;
background: #393939;
height: 51px;
                                            text-align: center;    align-items: center;    justify-content: center;    color: #FFF;    font-size: 20px;    font-style: normal;    font-weight: 700;    line-height: normal;    letter-spacing: 1.6px;    cursor: pointer;"
                                             onclick="${gvc.event(() => {
                        dialog.dataLoading({ visible: true });
                        ApiUser.login({
                            app_name: 'shopnex',
                            account: vm.account,
                            pwd: vm.pwd,
                        }).then((r) => __awaiter(this, void 0, void 0, function* () {
                            dialog.dataLoading({ visible: false });
                            if (r.result) {
                                GlobalUser.saas_token = r.response.token;
                                if ((yield ApiUser.checkAdminAuth({
                                    app: gvc.glitter.getUrlParameter('app-id'),
                                    token: GlobalUser.saas_token,
                                })).response.result) {
                                    POSSetting.config.who = 'manager';
                                    result(true);
                                    gvc.recreateView();
                                }
                                else {
                                    dialog.errorMessage({ text: '帳號或有誤' });
                                }
                            }
                            else {
                                dialog.errorMessage({ text: '帳號或有誤' });
                            }
                        }));
                    })}">登入
                                        </div>
                                    </div>
                                </div>
                        </section>`;
                },
            };
        });
    }
    static initial(gvc) {
        gvc.glitter.share.editorViewModel = {
            app_config_original: {},
        };
        gvc.glitter.share.shop_config = {
            shop_name: '',
        };
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            ApiUser.getPublicConfig('store-information', 'manager').then((res) => {
                gvc.glitter.share.shop_config.shop_name = res.response.value.shop_name;
                ApiPageConfig.getAppConfig().then((res) => {
                    gvc.glitter.share.editorViewModel.app_config_original = res.response.result[0];
                    gvc.glitter.share.editorViewModel.domain = res.response.result[0].domain;
                    gvc.glitter.share.editorViewModel.originalDomain = gvc.glitter.share.editorViewModel.domain;
                    resolve(true);
                });
            });
        }));
    }
    static main(gvc) {
        const glitter = gvc.glitter;
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
        ConnectionMode.initial(gvc);
        POSSetting.initialStyle(gvc);
        gvc.glitter.share.NormalPageEditor = NormalPageEditor;
        window.glitterBase = 'shopnex';
        window.appName = gvc.glitter.getUrlParameter('app-id');
        window.saasConfig.config.token = GlobalUser.saas_token;
        gvc.glitter.addStyleLink('./css/editor.css');
        localStorage.setItem('on-pos', 'true');
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            let timer_vm = {
                timer: 0,
                last_string: '',
            };
            let scannerObserver = function (event) {
                if (event.key.toLowerCase() !== 'enter' && event.key.toLowerCase() !== 'shift') {
                    clearInterval(timer_vm.timer);
                    timer_vm.last_string += event.key;
                    timer_vm.timer = setTimeout(() => {
                        POSSetting.scannerCallback(gvc, timer_vm.last_string);
                        timer_vm.last_string = '';
                    }, 150);
                }
            };
            glitter.share._scanBack = (text) => {
                POSSetting.scannerCallback(gvc, text);
            };
            function getTimeState(startDate, endDate) {
                const now = new Date();
                const start = new Date(`${startDate}T00:00:00`);
                const end = new Date(`${endDate}T23:59:59`);
                if (now < start)
                    return 'beforeStart';
                if (now > end)
                    return 'afterEnd';
                return 'inRange';
            }
            return {
                bind: id,
                view: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    try {
                        let [initial, res, member_auth, store_list, exhibition_list] = yield Promise.all([
                            POSSetting.initial(gvc),
                            ApiUser.checkAdminAuth({
                                app: gvc.glitter.getUrlParameter('app-id'),
                                token: GlobalUser.saas_token,
                            }),
                            ApiUser.getPermission({
                                page: 0,
                                limit: 100,
                            }),
                            ApiUser.getPublicConfig('store_manager', 'manager'),
                            ApiUser.getPublicConfig('exhibition_manager', 'manager'),
                        ]);
                        member_auth = member_auth.response.data.filter((dd) => dd.invited && dd.status);
                        store_list = store_list.response.value.list;
                        glitter.share.store_list = store_list;
                        const exh_list = (_a = exhibition_list.response.value.list) !== null && _a !== void 0 ? _a : [];
                        glitter.share.exhibition_list = exh_list.filter((item) => {
                            const state = getTimeState(item.startDate, item.endDate);
                            return state === 'inRange';
                        });
                        glitter.share.member_auth_list = member_auth;
                        try {
                            const login_user = GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID;
                            const find_ = member_auth.find((dd) => {
                                return `${dd.user}` === `${login_user}`;
                            });
                            POSSetting.config.who = find_.user;
                        }
                        catch (e) { }
                        const member_auth_ = member_auth.find((dd) => {
                            return `${dd.user}` === `${POSSetting.config.who}`;
                        });
                        member_auth_.config.support_shop = member_auth_.config.support_shop.filter((dd) => {
                            return store_list.find((d1) => {
                                return dd === d1.id;
                            });
                        });
                        if (res.response.result && (member_auth_ || POSSetting.config.who === 'manager')) {
                            if (!member_auth_.config.support_shop || member_auth_.config.support_shop.length === 0) {
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.errorMessage({
                                    text: `尚未設定任何門市，請前往『 門市設定 』與『 員工設定 』中設定相關參數`,
                                    callback: () => {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.dataLoading({ visible: true });
                                        localStorage.removeItem('on-pos');
                                        window.parent.history.replaceState({}, document.title, `${glitter.root_path}cms?appName=${glitter.getUrlParameter('app-id')}&type=editor&function=backend-manger&tab=home_page`);
                                        glitter.share.reload('cms', 'shopnex');
                                    },
                                });
                                return ``;
                            }
                            else {
                                glitter.share.member_auth_list = member_auth.filter((dd) => {
                                    return dd.config.support_shop && dd.config.support_shop.length > 0;
                                });
                                if (!member_auth_.config.support_shop.includes(POSSetting.config.where_store)) {
                                    POSSetting.config.where_store = member_auth_.config.support_shop[0];
                                }
                                glitter.share.work_status = (yield ApiPos.getWorkStatus(POSSetting.config.who, POSSetting.config.where_store)).response.status;
                                return POSSetting.posView(gvc);
                            }
                        }
                        else {
                            return POSSetting.loginManager(gvc, 'first', () => { });
                        }
                    }
                    catch (e) {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        localStorage.removeItem('on-pos');
                        window.parent.history.replaceState({}, document.title, `${glitter.root_path}cms?appName=${glitter.getUrlParameter('app-id')}&type=editor&function=backend-manger&tab=home_page`);
                        glitter.share.reload('cms', 'shopnex');
                        return ``;
                    }
                }),
                divCreate: {},
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
    static scannerCallback(gvc, text) {
        return __awaiter(this, void 0, void 0, function* () {
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
                }).then((res) => {
                    dialog.dataLoading({ visible: false });
                    if (res.response.data[0]) {
                        const data = res.response.data[0];
                        const selectVariant = res.response.data[0].content.variants.find((d1) => {
                            return d1.barcode === text;
                        });
                        if (!OrderDetail.singleInstance.lineItems.find((dd) => {
                            return dd.id + dd.spec.join('-') === data.id + selectVariant.spec.join('-');
                        })) {
                            OrderDetail.singleInstance.lineItems.push({
                                id: data.id,
                                title: data.content.title,
                                preview_image: selectVariant.preview_image.length > 1 ? selectVariant.preview_image : data.content.preview_image[0],
                                spec: selectVariant.spec,
                                count: 0,
                                sale_price: selectVariant.sale_price,
                                sku: selectVariant.sku,
                            });
                        }
                        OrderDetail.singleInstance.lineItems.find((dd) => {
                            return dd.id + dd.spec.join('-') === data.id + selectVariant.spec.join('-');
                        }).count++;
                        gvc.glitter.share.checkStock();
                        gvc.notifyDataChange(['order', 'checkout-page']);
                    }
                    else {
                        swal.toast({ icon: 'error', title: '無此商品' });
                    }
                });
            }
            if (text.indexOf(`user-`) === 0) {
                const dialog = new ShareDialog(gvc.glitter);
                dialog.dataLoading({ visible: true });
                const user = yield ApiUser.getUsersData(text.replace('user-', ''));
                if (!user.response || !user.response.account) {
                    dialog.errorMessage({ text: '查無此會員' });
                }
                else {
                    dialog.dataLoading({ visible: false });
                    OrderDetail.singleInstance.user_info.email = user.response.userData.email;
                    OrderDetail.singleInstance.user_info.phone = user.response.userData.phone;
                    gvc.notifyDataChange(['checkout-page']);
                }
            }
            if (text.indexOf(`voucher-`) === 0) {
                text = text.replace(`voucher-`, '');
                const dialog = new ShareDialog(gvc.glitter);
                OrderDetail.singleInstance.code_array = OrderDetail.singleInstance.code_array || [];
                OrderDetail.singleInstance.code_array = OrderDetail.singleInstance.code_array.filter((dd) => {
                    return dd !== text;
                });
                OrderDetail.singleInstance.code_array.push(text);
                dialog.dataLoading({ visible: true });
                const od = (yield ApiShop.getCheckout({
                    line_items: OrderDetail.singleInstance.lineItems,
                    checkOutType: 'POS',
                    user_info: OrderDetail.singleInstance.user_info,
                    code_array: OrderDetail.singleInstance.code_array,
                })).response.data;
                dialog.dataLoading({ visible: false });
                if (!od ||
                    !od.voucherList.find((dd) => {
                        return dd.code === text;
                    })) {
                    OrderDetail.singleInstance.code_array = OrderDetail.singleInstance.code_array.filter((dd) => {
                        return dd !== text;
                    });
                    dialog.errorMessage({ text: '請輸入正確的優惠代碼' });
                }
                else {
                    dialog.successMessage({ text: '成功新增優惠券' });
                    gvc.notifyDataChange(['checkout-page']);
                }
            }
        });
    }
    static posView(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            filterID: glitter.getUUID(),
            get type() {
                var _a;
                return (_a = localStorage.getItem('show_pos_page')) !== null && _a !== void 0 ? _a : 'menu';
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
            categories: [
                {
                    key: 'all',
                    value: '全部商品',
                    select: true,
                },
            ],
        };
        glitter.share.reloadPosPage = () => {
            gvc.notifyDataChange(vm.id);
        };
        let orderDetail = JSON.parse(JSON.stringify(new OrderDetail(0, 0)));
        glitter.share.clearOrderData = () => {
            orderDetail = JSON.parse(JSON.stringify(new OrderDetail(0, 0)));
            orderDetail.user_info.shipment = 'now';
        };
        function loadOrderData() {
            const storageOrder = localStorage.getItem('pos_order_detail');
            if (storageOrder) {
                orderDetail = JSON.parse(storageOrder);
            }
            else {
                orderDetail.user_info = orderDetail.user_info || { shipment: 'now' };
                orderDetail.user_info.shipment = 'now';
            }
            if (!orderDetail.lineItems || orderDetail.lineItems.length === 0) {
                orderDetail.user_info = orderDetail.user_info || { shipment: 'now' };
                orderDetail.user_info.shipment = 'now';
            }
        }
        gvc.addStyle(`
            .product-show{
            -ms-overflow-style: none;
            scrollbar-width: none;

            }
            .product-show::-webkit-scrollbar {
            display: none;  /* Chrome, Safari, Opera */
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
        const apConfig = ApiUser.getPublicConfig('store-information', 'manager').then((res) => {
            PayConfig.pos_config = res.response.value;
            vm.loading = false;
            gvc.notifyDataChange(vm.id);
        });
        if (vm.type === 'home') {
            vm.type = 'menu';
        }
        return (gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return html ` <div class="d-flex align-items-center justify-content-center p-3">
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
                                        return `<i class="fa-regular fa-cart-shopping" style="
cursor: pointer;
color: #393939;
 font-size: 20px;"></i>`;
                                    }
                                    return `<span style="position: relative;"><i class="fa-regular fa-cart-shopping" style="color: #393939;
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
    right: 0px;">${orderDetail.lineItems.length}</span></span>
    </span>`;
                                },
                                divCreate: {
                                    class: `nav-link js-cart-count d-sm-none ${vm.type !== 'menu' ? `d-none` : ``}`,
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
                                let page = [
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
                                    .map((data) => {
                                    return html `
                                                <div
                                                    class="d-flex flex-column justify-content-center align-items-center ${document.body.offsetWidth < 800 ? `py-2` : ``}"
                                                    style="gap: 6px;font-weight: 500;letter-spacing: 0.8px;${vm.type == data.type
                                        ? `color:#393939;${document.body.offsetWidth < 800 ? `border-bottom: 3px solid #393939;font-size: 16px;` : `border-right: 3px solid #393939;font-size: 18px;padding-top: 16px;padding-bottom: 16px;`}`
                                        : 'color:#949494;'}flex:1;cursor:pointer;${glitter.ut.frSize({
                                        sm: `padding-right:32px;padding-left:32px;`,
                                    }, ``)}"
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
                                }
                                else {
                                    return {
                                        class: `d-flex nav-left flex-column`,
                                        style: `height: 100%;gap:24px;padding-top:114px;position:fixed;left:0px;top:0px;background: #FFF;box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.05);z-index:15;`,
                                    };
                                }
                            },
                        });
                        return html `
                                <div
                                    class="d-flex nav-top flex-column"
                                    style="z-index:20;padding-top:${glitter.share
                            .top_inset}px;width: 100%;background: #FFF;box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.10);position: fixed;left: 0;top: 0;"
                                >
                                    <div
                                        class="POS-logo  d-flex align-items-center ${document.body.offsetWidth < 800 ? `justify-content-center` : ` `} mx-2 "
                                        style="${document.body.offsetWidth < 800 ? `gap: 0px;` : `gap: 10px;padding-left: 24px;`}height: ${(() => {
                            if (document.body.offsetWidth > 800) {
                                return `86px`;
                            }
                            else {
                                return `76px`;
                            }
                        })()};"
                                    >
                                        ${document.body.offsetWidth < 800
                            ? ` `
                            : `<div class=" d-flex align-items-center h-100 border-end pe-4" style="gap:10px;"><svg width="157" height="28" viewBox="0 0 157 28" fill="none"
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
                                        ${document.body.clientWidth > 800 ? cartBtn : ``}
                                        <div
                                            class="searchBar ms-sm-2 me-2 ${vm.type !== 'menu' ? `d-none` : ``} ${document.body.offsetWidth < 800 ? `d-none` : ``}"
                                            style="position: relative;max-width:calc(100% - 60px);
${document.body.clientWidth < 800 ? `` : `position: absolute;left: 50%;top:50%;transform:translate(-50%,-50%);`}
"
                                        >
                                            <input
                                                class="border-0 "
                                                placeholder="搜尋商品名稱或貨號"
                                                style="display: flex;${document.body.offsetWidth < 800
                            ? `width:100%;font-size: 15px;height: 50px;padding: 17px 12px;`
                            : `width: 357px;max-width:calc(100%);font-size: 18px;height: 56px;padding: 17px 24px;`}justify-content: center;gap: 10px;border-radius: 10px;background: #F7F7F7;"
                                                onchange="${gvc.event((e) => {
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
                                                style="width: 24px;height: 24px;flex-shrink: 0;position:absolute; ${document.body.offsetWidth < 800
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
                                        ${document.body.clientWidth > 800 ? `<div class="flex-fill"></div>` : ``}
                                        ${gvc.bindView(() => {
                            const id = 'right_top_info';
                            function refreshUserBar() {
                                gvc.notifyDataChange([id, 'nav-slide']);
                            }
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise((resolve, reject) => {
                                        var _a;
                                        const member_auth = glitter.share.member_auth_list;
                                        const select_member = (_a = member_auth.find((dd) => {
                                            return `${dd.user}` === `${POSSetting.config.who}`;
                                        })) !== null && _a !== void 0 ? _a : { config: { title: '管理員', name: 'manager' } };
                                        glitter.share.select_member = select_member;
                                        glitter.share.staff_title = select_member.config.name === 'manager' ? `BOSS` : POSSetting.config.who;
                                        resolve(html ` <div class="h-100 group dropdown  ps-1 pe-1 d-flex align-items-center" style="">
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
                                                                                style="color: #393939;
                                                                        font-size: 18px;
                                                                        font-style: normal;
                                                                        font-weight: 400;
                                                                        line-height: normal;"
                                                                            >
                                                                                ${select_member.config.name}
                                                                            </div>
                                                                            <div
                                                                                class="fs-xs lh-1 opacity-60 fw-500 d-flex align-items-center fw-500 mt-1"
                                                                                style="color: #8D8D8D;
                                                                        font-size: 14px;
                                                                        font-style: normal;
                                                                        gap:5px;
                                                                        font-weight: 400;
                                                                        line-height: normal;"
                                                                            >
                                                                                ${select_member.config.title}
                                                                                <div>/</div>
                                                                                <div class="text-info fw-bold">
                                                                                    ${(() => {
                                            if (POSSetting.config.where_store.includes('store_')) {
                                                return glitter.share.store_list.find((dd) => {
                                                    return dd.id === POSSetting.config.where_store;
                                                }).name;
                                            }
                                            if (POSSetting.config.where_store.includes('exhibition_')) {
                                                return glitter.share.exhibition_list.find((dd) => {
                                                    return dd.id === POSSetting.config.where_store;
                                                }).name;
                                            }
                                            return '未知地點';
                                        })()}
                                                                                </div>
                                                                            </div>
                                                                            <div class="d-flex align-items-center mt-1">
                                                                                ${glitter.share.work_status === 'off_work'
                                            ? html `
                                                                                          <div class="rounded-circle " style="width:8px;height: 8px;background: #fe5541;"></div>
                                                                                          <div class="fw-500 ms-1" style="font-size: 12px;">已下班</div>
                                                                                      `
                                            : html `
                                                                                          <div class="rounded-circle " style="width:8px;height: 8px;background: #33a252;"></div>
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
                                                const mem_ = member_auth.filter((dd) => {
                                                    return `${dd.user}` !== `${POSSetting.config.who}`;
                                                });
                                                if (mem_.length > 0) {
                                                    return [
                                                        `<a
                                                                                    class="dropdown-item cursor_pointer d-flex align-items-center" style="gap:5px;"
                                                                                    onclick="${gvc.event(() => {
                                                            PosFunction.selectUserSwitch(gvc);
                                                        })}">
                                                                               <i class="fa-regular fa-swap-arrows me-1"></i>切換當值員工
                                                                            </a>`,
                                                    ];
                                                }
                                                else {
                                                    return [];
                                                }
                                            })(),
                                            ...(() => {
                                                if (glitter.share.select_member.config.support_shop.length > 1) {
                                                    return [
                                                        html `<a
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
                                                }
                                                else {
                                                    return [];
                                                }
                                            })(),
                                            ...(() => {
                                                if (glitter.share.work_status === 'on_work') {
                                                    return [
                                                        html `<a
                                                                                        class="dropdown-item cursor_pointer d-flex align-items-center"
                                                                                        style="gap:5px;"
                                                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.checkYesOrNot({
                                                                text: html `是否確認打卡下班? <br /><span style="font-size:13px;color:gray;"
                                                                                                        >*打卡下班前請記得填寫小結單*</span
                                                                                                    >`,
                                                                callback: (response) => {
                                                                    if (response) {
                                                                        dialog.dataLoading({ visible: true });
                                                                        ApiPos.setWorkStatus({
                                                                            store: POSSetting.config.where_store,
                                                                            status: 'off_work',
                                                                        }).then((res) => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            if (!res.result) {
                                                                                dialog.errorMessage({ text: '打卡異常' });
                                                                            }
                                                                            else {
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
                                                }
                                                else {
                                                    return [];
                                                }
                                            })(),
                                        ].join('<div class="dropdown-divider"></div>')}
                                                                </div>
                                                            </div>`);
                                    });
                                },
                                divCreate: {
                                    class: `h-100`,
                                },
                            };
                        })}
                                        ${document.body.clientWidth < 800 ? `<div class="flex-fill"></div>` : ``}
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
                            ? `<span style="position: absolute;top:-28px;right: -8px;"><span style="display: inline-block;
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
    right: 0px;">${TempOrder.getTempOrders().length}</span></span>`
                            : ``}
                                                </div>
                                            </div>
                                            ${document.body.clientWidth > 800 || vm.type !== 'menu'
                            ? ``
                            : `<div style="width:50px;" class="d-flex align-items-center justify-content-center">${cartBtn}</div>`}
                                            ${gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return html ` <div class="h-100 group dropdown  ps-1 d-flex align-items-center" style="">
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
                                                    html ` <a
                                                                                      class="dropdown-item cursor_pointer d-flex align-items-center"
                                                                                      style="gap:10px;"
                                                                                      onclick="${gvc.event(() => {
                                                        ConnectionMode.main(gvc);
                                                    })}"
                                                                                      ><i class="fa-solid fa-plug d-flex align-items-center justify-content-center" style="width:20px;"></i>連線模式</a
                                                                                  >`,
                                                ]
                                                : []),
                                            ...(ConnectionMode.on_connected_device
                                                ? [
                                                    `<a class="dropdown-item cursor_pointer d-flex align-items-center"
                                                                           style="gap:10px;"
                                                                           onclick="${gvc.event(() => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.checkYesOrNot({
                                                            text: '是否斷開與 IMIN 裝置的連線?',
                                                            callback: (response) => {
                                                                if (response) {
                                                                    dialog.infoMessage({ text: '已斷開連線' });
                                                                    ConnectionMode.last_connect_id = '';
                                                                    ConnectionMode.on_connected_device = '';
                                                                    ConnectionMode.socket.close();
                                                                }
                                                            },
                                                        });
                                                    })}"><i class="fa-solid fa-power-off d-flex align-items-center justify-content-center" style="width:20px;"></i>斷開裝置連線</a>`,
                                                ]
                                                : []),
                                        ].concat(PayConfig.deviceType === 'pos'
                                            ? []
                                            : ConnectionMode.device_list.map((dd) => {
                                                return html `<a
                                                                                      class="dropdown-item cursor_pointer d-flex align-items-center"
                                                                                      style="gap:10px;"
                                                                                      onclick="${gvc.event(() => {
                                                    ConnectionMode.connect(dd);
                                                })}"
                                                                                      ><i class="fa-solid fa-plug d-flex align-items-center justify-content-center" style="width:20px;"></i>連線至『
                                                                                      ${dd} 』</a
                                                                                  >`;
                                            })),
                                        ` <a class="dropdown-item cursor_pointer  d-flex align-items-center"
                                                                   style="gap:5px;" onclick="${gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.dataLoading({ visible: true });
                                            localStorage.removeItem('on-pos');
                                            window.parent.history.replaceState({}, document.title, `${glitter.root_path}cms?appName=${glitter.getUrlParameter('app-id')}&type=editor&function=backend-manger&tab=home_page`);
                                            glitter.share.reload('cms', 'shopnex');
                                        })}"><i class="fa-solid fa-angle-left d-flex align-items-center justify-content-center"
                                                                        style="width:20px;"></i>返回後台管理</a>`,
                                    ].join('<div class="dropdown-divider"></div>')}
                                                            </div>
                                                        </div>`;
                                },
                                divCreate: {
                                    class: `d-flex align-items-center justify-content-center`,
                                    style: `width:50px;height: 100%;`,
                                },
                            };
                        })}
                                        </div>
                                    </div>
                                    ${document.body.clientWidth < 800 ? nav_slide : ''}
                                </div>
                                ${document.body.clientWidth > 800 ? nav_slide : ''}
                                ${gvc.bindView({
                            bind: 'mainView',
                            view: () => __awaiter(this, void 0, void 0, function* () {
                                let view = (() => {
                                    try {
                                        if (glitter.share.work_status === 'off_work') {
                                            return PosWidget.checkInView(gvc);
                                        }
                                        OrderDetail.singleInstance = orderDetail;
                                        orderDetail.user_info.shipment = orderDetail.user_info.shipment || 'now';
                                        if (vm.type == 'payment') {
                                            return PaymentPage.main({
                                                ogOrderData: orderDetail,
                                                gvc: gvc,
                                                vm: vm,
                                            });
                                        }
                                        else if (vm.type === 'order') {
                                            return `<div class="vw-100 px-lg-3" style="overflow-y: scroll;">${ShoppingOrderManager.main(gvc, { isPOS: true })}</div>`;
                                        }
                                        else if (vm.type === 'member') {
                                            return `<div class="vw-100 px-lg-3" style="overflow-y: scroll;">${UserList.main(gvc)}</div>`;
                                        }
                                        else if (vm.type === 'setting') {
                                            return PosSetting.main({ gvc: gvc, vm: vm });
                                        }
                                        else if (vm.type === 'summary') {
                                            return PosSummary.main({
                                                gvc: gvc,
                                            });
                                        }
                                        return ProductsPage.main({ gvc: gvc, vm: vm, orderDetail: orderDetail });
                                    }
                                    catch (e) {
                                        console.error(e);
                                        return `${e}`;
                                    }
                                })();
                                if (document.body.clientWidth < 768) {
                                    view += `<div style="height: 100px;"><div`;
                                }
                                return view;
                            }),
                            divCreate: {
                                class: `h-100 ${document.body.clientWidth < 768 ? `` : `d-flex`}`,
                                style: `background: #F7F7F7;padding-top:${glitter.share.top_inset}px;`,
                            },
                        })}
                            `;
                    }
                    catch (e) {
                        localStorage.removeItem('pos_order_detail');
                        gvc.recreateView();
                        console.error(e);
                        return `${e}`;
                    }
                },
                divCreate: () => {
                    if (document.body.offsetWidth > 800) {
                        return { style: `padding: 86px 0 0 103px;height:100vh;width:100vw;color:#393939;` };
                    }
                    else {
                        return { style: `padding-top:150px;padding-bottom:0px;height:100vh;width:100vw;color:#393939;overflow-y:auto;` };
                    }
                },
            };
        }) + NormalPageEditor.leftNav(gvc));
    }
    static initialStyle(gvc) {
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
    static emptyView(text) {
        window.glitter.addMtScript([{ src: '${ gvc.glitter.root_path}/jslib/lottie-player.js' }], () => { }, () => { });
        return ` <div class="d-flex align-items-center justify-content-center w-100  "
                     style="height: calc(100vh - 200px);">
                    <div class="d-flex flex-column align-items-center justify-content-center" style="gap:30px;">
                        <lottie-player class="rounded-circle bg-white" style="max-width: 100%;width: 300px;"
                                       src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
                                       speed="1"
                                       loop="" autoplay="" background="transparent"></lottie-player>
                        <div class="fw-bold fs-6"> ${text}</div>
                    </div>

                </div>`;
    }
}
POSSetting.config = {
    get who() {
        return localStorage.getItem('pos_use_member') || '';
    },
    set who(value) {
        localStorage.setItem('pos_use_member', value);
    },
    recreate: () => { },
    get pickup_number() {
        if (parseInt(localStorage.getItem('orderGetNumber') || '1', 10) > 1000) {
            POSSetting.config.pickup_number = 1;
            return 1;
        }
        else {
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
window.glitter.setModule(import.meta.url, POSSetting);
