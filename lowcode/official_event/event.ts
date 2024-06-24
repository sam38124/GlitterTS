import { BaseApi } from '../glitterBundle/api/base.js';
import { GVC } from '../glitterBundle/GVController.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { TriggerEvent } from '../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { component } from '../official_view_component/official/component.js';
import { ApiUser } from '../glitter-base/route/user.js';
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
        subContent: questionText([
            {
                title: '內部連結跳轉',
                content: `使用此事件可以跳轉至GLITTER內部頁面，採用SPA的開發技術，來降低頁面延遲，使轉場的效果更加順暢。`,
            },
            {
                title: '外連結跳轉',
                content: `使用此事件可以跳轉至外部頁面。`,
            },
            {
                title: 'HashTag',
                content: `使用此事件可以滾動至此標籤的位置。`,
            },
        ]),
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/change-page.js'),
    },
    goBack: {
        title: '官方事件 / 畫面 / 返回上一頁',
        subContent: ``,
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/goback.js'),
    },
    dialog: {
        title: '官方事件 / 畫面 / 彈跳視窗',
        subContent: questionText([
            {
                title: '打開彈跳視窗',
                content: `使用此事件可以開啟彈跳視窗，可以實現 表單 / 載入動畫 / 錯誤提醒 ....等效果都可以透過頁面彈窗來進行實現。`,
            },
            {
                title: '關閉彈跳視窗',
                content: `於跳轉的頁面執行 <span style="color:#295ed1;">gvc.closeDialog()</span> 即可關閉彈跳視窗。`,
            },
            {
                title: '夾帶資料',
                content: `返回要挾帶的資料並且於彈跳視窗的頁面中，透過 <span style="color:#295ed1;">gvc.getBundle().carryData</span>  ，來取得夾帶內容。`,
            },
        ]),
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/dialog.js'),
    },
    close_dialog: {
        title: '官方事件 / 畫面 / 視窗關閉',
        subContent: questionText([
            {
                title: '當前視窗',
                content: `僅關閉當前的彈跳視窗。`,
            },
            {
                title: '所有視窗',
                content: `關閉所有彈跳視窗。`,
            },
            {
                title: '標籤',
                content: `關閉具有此標籤的視窗。`,
            },
        ]),
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/close-dialog.js'),
    },
    drawer: {
        title: '官方事件 / 畫面 / 左側導覽列',
        subContent: `<div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                             style="height:400px;">
<video src="video/open_navagation.mov" class="mx-auto " style="max-width: 100%;height: 300px;" loop
                                                           autoplay>
                                                           
</video>
                                            <h3 class=" text-center px-4 mt-2" style="font-size:18px;">
                                                選擇頁面並嵌入來實現導覽列的效果。
                                            </h3>
                                        </div>`,
        fun: TriggerEvent.setEventRouter(import.meta.url, './view/navagation.js'),
    },
    closeDrawer: {
        title: '官方事件 / 畫面 / 關閉導覽列',
        subContent: `<div class="w-100 alert alert-light" style="white-space: normal;word-break: break-word;">透過<span class="mx-2" style="color:#295ed1;">glitter.closeDrawer()</span>來關閉左側導覽列。</div>`,
        fun: TriggerEvent.setEventRouter(import.meta.url, './page/close-drawer.js'),
    },
    reloadPage: {
        title: '官方事件 / 畫面 / 頁面刷新',
        subContent: `<div class="w-100 alert alert-light" style="white-space: normal;word-break: break-word;">透過<span class="mx-2" style="color:#295ed1;">gvc.recreateView()</span>來刷新當前頁面。</div>`,
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    gvc.recreateView();
                },
            };
        },
    },
    reload: {
        title: '官方事件 / 畫面 / 刷新瀏覽器',
        subContent: `<div class="w-100 alert alert-light" style="white-space: normal;word-break: break-word;">透過<span class="mx-2" style="color:#295ed1;">location.reload()</span>來刷新整個瀏覽器。</div>`,
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    location.reload();
                },
            };
        },
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
        subContent: `<div class="w-100 alert alert-light" style="white-space: normal;word-break: break-word;">於內容編輯器中，直接輸入代碼來執行事件。</div>`,
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    object.codeVersion = 'v2';
                    const html = String.raw;
                    return html` <div class="w-100">
                        ${EditorElem.codeEditor({
                            gvc: gvc,
                            height: 500,
                            initial: object.code,
                            title: '代碼區塊',
                            callback: (text) => {
                                object.code = text;
                            },
                            structStart: `((gvc,widget,object,subData,element)=>{`,
                        })}
                    </div>`;
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            const queryWhere = `
                            /*
      ->Tag->${(widget as any).tag}
      ->Label->${widget.label}
      ->ID->${widget.id}
      */
                            `;
                            const a =
                                object.codeVersion == 'v2'
                                    ? eval(`
                                        (()=>{
                                            try {
                                                return (() => {
                                                    ${queryWhere}
                                                    ${object.code}
                                                })()
                                            }catch (e) {
                                                console.log(e)
                                                return undefined
                                            }
                                        })()
                                    `)
                                    : eval(object.code);
                            if (a.then) {
                                a.then((data: any) => {
                                    resolve(data);
                                });
                            } else {
                                resolve(a);
                            }
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        },
    },
    codeArray: {
        title: '官方事件 / 開發工具 / 多項事件判斷',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                object.eventList = object.eventList ?? [];
                                try {
                                    return EditorElem.arrayItem({
                                        originalArray: object.eventList,
                                        gvc: gvc,
                                        title: '',
                                        array: () => {
                                            return object.eventList.map((dd: any, index: number) => {
                                                dd.yesEvent = dd.yesEvent ?? {};
                                                dd.trigger = dd.trigger ?? {};
                                                return {
                                                    title: dd.title || `事件:${index + 1}`,
                                                    expand: dd,
                                                    innerHtml: () => {
                                                        NormalPageEditor.toggle({
                                                            visible: true,
                                                            view: gvc.bindView(() => {
                                                                return {
                                                                    bind: gvc.glitter.getUUID(),
                                                                    view: () => {
                                                                        return `<div class="p-2">${[
                                                                            gvc.glitter.htmlGenerate.editeInput({
                                                                                gvc: gvc,
                                                                                title: '事件標題',
                                                                                default: dd.title ?? '',
                                                                                placeHolder: '請輸入事件標題',
                                                                                callback: (text: string) => {
                                                                                    dd.title = text;
                                                                                    // gvc.notifyDataChange(id)
                                                                                },
                                                                            }),
                                                                            TriggerEvent.editer(gvc, widget, dd.yesEvent, {
                                                                                hover: true,
                                                                                option: [],
                                                                                title: '判斷式-返回true則執行事件',
                                                                            }),
                                                                            `<div class="mt-2"></div>`,
                                                                            TriggerEvent.editer(gvc, widget, dd.trigger, {
                                                                                hover: true,
                                                                                option: [],
                                                                                title: '執行事件',
                                                                            }),
                                                                        ].join('')}</div>`;
                                                                    },
                                                                };
                                                            }),
                                                            title: '設定事件',
                                                        });
                                                    },
                                                    minus: gvc.event(() => {
                                                        object.eventList.splice(index, 1);
                                                        gvc.notifyDataChange(id);
                                                    }),
                                                };
                                            });
                                        },
                                        expand: object,
                                        plus: {
                                            title: '添加事件判斷',
                                            event: gvc.event(() => {
                                                object.eventList.push({ yesEvent: {}, trigger: {} });
                                                gvc.notifyDataChange(id);
                                            }),
                                        },
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(id);
                                        },
                                        customEditor: true,
                                    });
                                } catch (e) {
                                    return ``;
                                }
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            for (const a of object.eventList) {
                                const result = await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: a.yesEvent,
                                    subData: subData,
                                    element: element,
                                });
                                if (result) {
                                    const response = await TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: a.trigger,
                                        subData: subData,
                                        element: element,
                                    });
                                    resolve(response);
                                    return;
                                }
                            }
                            resolve(true);
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        },
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
        fun: (gvc, widget, object, subData, element) => {
            object.getEvent = object.getEvent ?? {};
            return {
                editor: () => {
                    //gvc.glitter.share.public_api.GlobalUser.updateUserData.userData.service
                    return TriggerEvent.editer(gvc, widget, object.getEvent, {
                        option: [],
                        title: '取得推播頻道',
                        hover: false,
                    });
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            const topic = await TriggerEvent.trigger({
                                gvc,
                                widget,
                                clickEvent: object.getEvent,
                                subData: subData,
                                element,
                            });
                            if (typeof topic != 'object') {
                                gvc.glitter.runJsInterFace(
                                    'regNotification',
                                    {
                                        topic: topic,
                                    },
                                    (response) => {}
                                );
                            } else {
                                (topic as any).map((dd: any) => {
                                    gvc.glitter.runJsInterFace(
                                        'regNotification',
                                        {
                                            topic: dd,
                                        },
                                        (response) => {}
                                    );
                                });
                            }
                            resolve(true);
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        },
    },
    getFcm: {
        title: '官方事件 / 推播 / 取得推播ID',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            gvc.glitter.runJsInterFace('getFireBaseToken', {}, (response) => {
                                resolve(response.token);
                            });
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        },
    },
    deleteFireBaseToken: {
        title: '官方事件 / 推播 / 移除推播註冊',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            gvc.glitter.runJsInterFace('deleteFireBaseToken', {}, (response) => {
                                resolve(true);
                            });
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        },
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
    getRebate: {
        title: '電子商務 / 取得回饋金金額',
        fun: TriggerEvent.setEventRouter(import.meta.url, './e-commerce/get-rebate.js'),
    },
    getRebateList: {
        title: '電子商務 / 取得回饋金列表',
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
        title: '電子商務 / 設定回饋金',
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
    forgetPwd_Reset: {
        title: '用戶相關 / 忘記密碼 / 進行重設',
        fun: TriggerEvent.setEventRouter(import.meta.url, './user/forget_reset_pwd.js'),
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

function questionText(data: { title: string; content: string }[]) {
    return `<div class="bg-secondary rounded-3 py-2 px-2 ">
          <h2 class="text-center my-3 mt-2" style="font-size:22px;">使用方法說明</h2>
             <div class="accordion mx-2" id="faq">
                ${data
                    .map((dd, index) => {
                        return ` <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                  <h3 class="accordion-header">
                    <button class="accordion-button shadow-none rounded-3 ${
                        index === 0 ? '' : 'collapsed'
                    }" type="button" data-bs-toggle="collapse" data-bs-target="#q-${index}" aria-expanded="false" aria-controls="q-1">${dd.title}</button>
                  </h3>
                  <div class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" id="q-${index}" data-bs-parent="#faq" style="">
                    <div class="accordion-body fs-sm pt-0">
                     ${dd.content}
                    </div>
                  </div>
                </div>`;
                    })
                    .join('')}
              
              </div>
        </div>`;
}

function getConfig() {
    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
    return saasConfig;
}

function getBaseUrl() {
    return getConfig().config.url;
}
