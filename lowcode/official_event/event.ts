import { TriggerEvent } from '../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { NormalPageEditor } from '../editor/normal-page-editor.js';

export class GlobalData {
    public static data = {
        pageList: [],
        isRunning: false,
        run: () => {
            if (GlobalData.data.isRunning) {
                return;
            }
            GlobalData.data.isRunning = true;
            const saasConfig: {
                config: any;
                api: any;
            } = (window as any).saasConfig;
            saasConfig.api
                .getPage({
                    appName: saasConfig.config.appName,
                    page_type: 'page',
                })
                .then((data: any) => {
                    if (data.result) {
                        GlobalData.data.pageList = data.response.result
                            .map((dd: any) => {
                                dd.page_config = dd.page_config ?? {};
                                return dd;
                            })
                            .sort((a: any, b: any) => `${a.group}-${a.name}`.localeCompare(`${b.group}-${b.name}`));
                    } else {
                        GlobalData.data.isRunning = false;
                        GlobalData.data.run();
                    }
                });
        },
    };
}

TriggerEvent.create(import.meta.url, {
    inputText: {
        title: '官方事件 / 輸入 / Input',
        fun: TriggerEvent.setEventRouter(import.meta.url, './input/input.js'),
    },
    editorText: {
        title: '官方事件 / 輸入 / TextArea',
        fun: TriggerEvent.setEventRouter(import.meta.url, './input/textArea.js'),
    },
    fileUpload: {
        title: '官方事件 / 輸入 / 檔案上傳',
        fun: TriggerEvent.setEventRouter(import.meta.url, './input/fileUpload.js'),
    },
    link: {
        title: '官方事件 / 畫面 / 頁面跳轉',
        subContent: ``,
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/change-page.js'),
    },
    goBack: {
        title: '官方事件 / 畫面 / 返回上一頁',
        subContent: ``,
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/goback.js'),
    },
    dialog: {
        title: '官方事件 / 畫面 / 彈跳視窗',
        subContent: ``,
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/dialog.js'),
    },
    close_dialog: {
        title: '官方事件 / 畫面 / 視窗關閉',
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/close-dialog.js'),
    },
    drawer: {
        title: '官方事件 / 畫面 / 左側導覽列',
        fun: TriggerEvent.setEventRouter(import.meta.url, './view/navagation.js'),
    },
    closeDrawer: {
        title: '官方事件 / 畫面 / 關閉導覽列',
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/close-drawer.js'),
    },
    reloadPage: {
        title: '官方事件 / 畫面 / 頁面刷新',
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/recreate-gvc.js'),
    },
    reload: {
        title: '官方事件 / 畫面 / 刷新瀏覽器',
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/reload.js'),
    },
    notify: {
        title: '官方事件 / 畫面 / 區塊刷新',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/refresh-block.js'),
    },
    setStyle: {
        title: '官方事件 / 畫面 / 更換STYLE樣式',
        fun: TriggerEvent.setEventRouter(import.meta.url, './style/change-style.js'),
    },
    getFormData: {
        title: '官方事件 / 表單 / 取得表單資料',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-form.js'),
    },
    getFormConfig: {
        title: '官方事件 / 表單 / 取得表單設定檔',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-form-config.js'),
    },
    getWebConfig: {
        title: '官方事件 / 表單 / 取得網頁配置檔',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-web-config.js'),
    },
    postFormConfig: {
        title: '官方事件 / 表單 / 發佈表單',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/post-form-config.js'),
    },
    checkForm: {
        title: '官方事件 / 表單 / 判斷表單是否填寫完畢',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/check-form.js'),
    },
    postForm: {
        title: '官方事件 / 表單 / 內容發佈',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/post-form.js'),
    },
    code: {
        title: '官方事件 / 開發工具 / 代碼區塊',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/eval-code.js'),
    },
    codeArray: {
        title: '官方事件 / 開發工具 / 多項事件判斷',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/code-array.js'),
    },
    setURl: {
        title: '官方事件 / 開發工具 / 設定URL參數',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/set-url.js'),
    },
    checkInput: {
        title: '官方事件 / 開發工具 / 輸入內容過濾',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/check-input.js'),
    },
    event_trigger: {
        title: '官方事件 / 開發工具 / 事件觸發',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/event-trigger.js'),
    },
    globalEvent: {
        title: '官方事件 / 開發工具 / 執行事件集',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/global-event.js'),
    },
    getLanguageCode: {
        title: '官方事件 / 開發工具 / 取得多國語言代號',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-language.js'),
    },
    setLanguageCode: {
        title: '官方事件 / 開發工具 / 設定多國語言代號',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/set-language.js'),
    },
    getGlobalResource: {
        title: '官方事件 / 開發工具 / 取得全局資源',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-global-value.js'),
    },
    getURl: {
        title: '官方事件 / 開發工具 / 取得URL參數',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-url.js'),
    },
    getPageFormData: {
        title: '官方事件 / 開發工具 / 取得頁面參數',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-page-form.js'),
    },
    sizeEvent: {
        title: '官方事件 / 開發工具 / 依照尺寸執行事件',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/size-event.js'),
    },
    delay: {
        title: '官方事件 / 開發工具 / 延遲執行事件',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/delay-event.js'),
    },
    api_request: {
        title: '官方事件 / 開發工具 / API 請求',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-request.js'),
    },
    scrollWatch: {
        title: '官方事件 / 開發工具 / 滾動監聽',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/scroll-watch.js'),
    },
    storeData: {
        title: '官方事件 / 開發工具 / 儲存資料',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/store-data.js'),
    },
    getData: {
        title: '官方事件 / 開發工具 / 取得儲存資料',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-data.js'),
    },
    getPublicConfig: {
        title: '官方事件 / 開發工具 / 取得公開配置檔案',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/get-public-config.js'),
    },
    setPublicConfig: {
        title: '官方事件 / 開發工具 / 設定公開配置檔案',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter-util/set-public-config.js'),
    },
    registerDevice: {
        title: '官方事件 / 推播 / 註冊裝置',
        fun: TriggerEvent.setEventRouter(import.meta.url, './fcm/register-device.js'),
    },
    registerNotify: {
        title: '官方事件 / 推播 / 註冊推播頻道',
        fun: TriggerEvent.setEventRouter(import.meta.url, './fcm/register-topic.js'),
    },
    getFcm: {
        title: '官方事件 / 推播 / 取得推播ID',
        fun: TriggerEvent.setEventRouter(import.meta.url, './fcm/get-device-id.js'),
    },
    deleteFireBaseToken: {
        title: '官方事件 / 推播 / 移除推播註冊',
        fun: TriggerEvent.setEventRouter(import.meta.url, './fcm/un-register-device.js'),
    },
    emailSubscription: {
        title: '官方事件 / 推播 / 信箱註冊',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/email-subscription.js'),
    },
    api_graph: {
        title: '官方事件 / API / Graph-API',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-graph.js'),
    },
    api_data_get: {
        title: '官方事件 / API / 內容取得',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-data-get.js'),
    },
    api_data_post: {
        title: '官方事件 / API / 內容上傳',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-data-post.js'),
    },
    api_data_put: {
        title: '官方事件 / API / 內容更新',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-data-put.js'),
    },
    api_data_delete: {
        title: '官方事件 / API / 內容移除',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-data-delete.js'),
    },
    upload_file: {
        title: '官方事件 / API / 檔案上傳',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-file-upload.js'),
    },
    api_text_upload: {
        title: '官方事件 / API / 文字檔上傳',
        fun: TriggerEvent.setEventRouter(import.meta.url, './api/api-text-upload.js'),
    },
    getProduct: {
        title: '電子商務 / 選擇商品',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/getProduct.js'),
    },
    allProduct: {
        title: '電子商務 / 列出所有商品',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/all-product.js'),
    },
    getCollection: {
        title: '電子商務 / 取得商品系列',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/all-collection.js'),
    },
    productShowList: {
        title: '電子商務 / 取得商品顯示列表',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/product-show-list.js'),
    },
    addToCart: {
        title: '電子商務 / 加入購物車',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/add-to-cart.js'),
    },
    updateToCart: {
        title: '電子商務 / 更新商品數量',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/update-cart.js'),
    },
    getCart: {
        title: '電子商務 / 取得購物車內容',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-cart.js'),
    },
    deleteCart: {
        title: '電子商務 / 清空購物車',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/delete-cart.js'),
    },
    getRebateMainStatus: {
        title: '電子商務 / 取得購物金總功能是否啟用',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-rebate-main-status.js'),
    },
    getRebate: {
        title: '電子商務 / 取得購物金金額',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-rebate.js'),
    },
    getRebateList: {
        title: '電子商務 / 取得購物金列表',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-rebate-list.js'),
    },
    getOldestRebate: {
        title: '電子商務 / 取得最快到期一筆購物金',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-oldest-rebate.js'),
    },
    getCount: {
        title: '電子商務 / 取得購物車數量',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-count.js'),
    },
    getOrder: {
        title: '電子商務 / 取得訂單列表',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-order.js'),
    },
    getOrderDetail: {
        title: '電子商務 / 取得單一訂單紀錄',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-order-detail.js'),
    },
    toCheckout: {
        title: '電子商務 / 前往結帳',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/to-checkout.js'),
    },
    setVoucher: {
        title: '電子商務 / 設定優惠券',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/set-voucher.js'),
    },
    setRebate: {
        title: '電子商務 / 設定購物金',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/set-rebate.js'),
    },
    deleteVoucher: {
        title: '電子商務 / 清空優惠券',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/delete-voucher.js'),
    },
    getVoucher: {
        title: '電子商務 / 取得優惠券代碼',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-voucher.js'),
    },
    addWishList: {
        title: '電子商務 / 加入許願池',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/wish-list.js'),
    },
    deleteWishList: {
        title: '電子商務 / 移除許願池',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/delete-wish-list.js'),
    },
    getWishList: {
        title: '電子商務 / 取得許願池',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-wish-list.js'),
    },
    inWishList: {
        title: '電子商務 / 判斷商品是否存在於許願池',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/check-wish-list.js'),
    },
    c2cMap: {
        title: '電子商務 / 選擇門市',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/to-c2cMap.js'),
    },
    getPaymentMethod: {
        title: '電子商務 / 取得支援付款方式',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-payment-method.js'),
    },
    dataAnalyze: {
        title: '電子商務 / 資料分析',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/data-analyze.js'),
    },
    invoiceType: {
        title: '電子商務 / 取得發票開立方式',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-invoice-type.js'),
    },
    checkLoginForOrder: {
        title: '電子商務 / 判斷是否需要登入後付款',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-login-for-order.js'),
    },
    postWallet: {
        title: '電子錢包 / 新增儲值金額',
        fun: TriggerEvent.setEventRouter(import.meta.url, './wallet/add-money.js'),
    },
    withdraw: {
        title: '電子錢包 / 提領金額',
        fun: TriggerEvent.setEventRouter(import.meta.url, './wallet/withdraw.js'),
    },
    getWalletSum: {
        title: '電子錢包 / 取得總金額',
        fun: TriggerEvent.setEventRouter(import.meta.url, './wallet/get-sum.js'),
    },
    getWalletMemory: {
        title: '電子錢包 / 取得紀錄',
        fun: TriggerEvent.setEventRouter(import.meta.url, './wallet/get-memory.js'),
    },
    login: {
        title: '用戶相關 / 用戶登入',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/login.js'),
    },
    register: {
        title: '用戶相關 / 用戶註冊',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/register.js'),
    },
    logout: {
        title: '用戶相關 / 用戶登出',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/logout.js'),
    },
    user_initial: {
        title: '用戶相關 / 用戶初始化',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/initial.js'),
    },
    user_token_check: {
        title: '用戶相關 / 判斷用戶是否登入',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/check_login.js'),
    },
    get_user_data: {
        title: '用戶相關 / 取得個人檔案資料',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/get-userdata.js'),
    },
    get_user_info: {
        title: '用戶相關 / 取得某用戶資料',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/get-users-data.js'),
    },
    set_user_data: {
        title: '用戶相關 / 設定用戶資料',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/set-userdata.js'),
    },
    remove_user_memory: {
        title: '用戶相關 / 清空用戶資料暫存',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/clear-userdata.js'),
    },
    get_user_config: {
        title: '用戶相關 / 取得用戶配置檔案',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/get-public-config.js'),
    },
    set_user_config: {
        title: '用戶相關 / 設定配置檔案',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/set-public-config.js'),
    },
    forgetPwd: {
        title: '用戶相關 / 忘記密碼',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/forget_pwd.js'),
    },
    checkForgetCode: {
        title: '用戶相關 / 忘記密碼 / 確認驗證碼',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/forget-check-code.js'),
    },
    forgetPwd_Reset: {
        title: '用戶相關 / 忘記密碼 / 進行重設',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/forget_reset_pwd.js'),
    },
    reset_v2:{
        title: '用戶相關 / 忘記密碼 / 重設密碼V2',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/reset-pwd-v2.js'),
    },
    reset_pwd: {
        title: '用戶相關 / 個人檔案 / 重設密碼',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/reset_pwd.js'),
    },
    getToken: {
        title: '用戶相關 / 取得TOKEN',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/token.js'),
    },
    getNotice: {
        title: '用戶相關 / 取得通知訊息',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/get-notice.js'),
    },
    getEmailCount: {
        title: '用戶相關 / 判斷Email是否已被使用',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/check-email-exists.js'),
    },
    getNoticeUnread: {
        title: '用戶相關 / 取得通知數量',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/get-notice-unread.js'),
    },
    get_chat_room: {
        title: '訊息相關 / 取得已建立聊天室',
        fun: TriggerEvent.setEventRouter(import.meta.url, './chat/get-chat-room.js'),
    },
    get_un_read: {
        title: '訊息相關 / 取得未讀訊息',
        fun: TriggerEvent.setEventRouter(import.meta.url, './chat/get-un-read.js'),
    },
    addChatRoom: {
        title: '訊息相關 / 建立聊天室',
        fun: TriggerEvent.setEventRouter(import.meta.url, './chat/add-chat-room.js'),
    },
    sendChatMessage: {
        title: '訊息相關 / 傳送訊息',
        fun: TriggerEvent.setEventRouter(import.meta.url, './chat/send-chat-message.js'),
    },
    getChatMessage: {
        title: '訊息相關 / 取得訊息',
        fun: TriggerEvent.setEventRouter(import.meta.url, './chat/get-message.js'),
    },
    getAutoReply: {
        title: '訊息相關 / 客服 / 取得自動答覆問題',
        fun: TriggerEvent.setEventRouter(import.meta.url, './chat/auto-reply.js'),
    },
    messageChange: {
        title: '訊息相關 / 用戶 / 訊息更新',
        fun: TriggerEvent.setEventRouter(import.meta.url, './chat/message-change.js'),
    },
    glitterADD: {
        title: 'GLITTER / 建立APP',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/create.js'),
    },
    glitterAddTheme: {
        title: 'GLITTER / 添加主題',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/create-theme.js'),
    },
    glitterChangeTheme: {
        title: 'GLITTER / 更換主題',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/change-theme.js'),
    },
    glitterChangeThemeConfig: {
        title: 'GLITTER / 更新主題資訊',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/change-theme-config.js'),
    },
    glitterGetTemplate: {
        title: 'GLITTER / 取得模板列表',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/get-template-list.js'),
    },
    glitterPreview: {
        title: 'GLITTER / 預覽APP',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/preview.js'),
    },
    glitterAPPList: {
        title: 'GLITTER / 取得APP列表',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/app-list.js'),
    },
    glitterThemeList: {
        title: 'GLITTER / 取得主題列表',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/theme-list.js'),
    },
    deleteAPP: {
        title: 'GLITTER / 刪除APP',
        fun: TriggerEvent.setEventRouter(import.meta.url, './glitter/delete.js'),
    },
    getTopInset: {
        title: '手機裝置 / 取得上方導覽列高度',
        fun: TriggerEvent.setEventRouter(import.meta.url, './mobile/get-top-inset.js'),
    },
    getBottomInset: {
        title: '手機裝置 / 取得下方導覽列高度',
        fun: TriggerEvent.setEventRouter(import.meta.url, './mobile/get-bottom-inset.js'),
    },
    getBlogList: {
        title: 'Blog / 取得網誌列表',
        fun: TriggerEvent.setEventRouter(import.meta.url, './blog/get-blog.js'),
    },
    getBlogTag: {
        title: 'Blog / 標籤取得網誌',
        fun: TriggerEvent.setEventRouter(import.meta.url, './blog/get-blog-tag.js'),
    },
});
