import {GVC} from '../glitterBundle/GVController.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {BaseApi} from "../glitterBundle/api/base.js";
import {config} from "../config.js";
import {Currency} from "../glitter-base/global/currency.js";
import {LanguageBackend} from "./language-backend.js";
import { GlobalUser } from '../glitter-base/global/global-user.js';

export class ShoppingInformation {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const html = String.raw;
        const vm: {
            id: string;
            tableId: string;
            filterId: string;
            type: 'basic' | 'function' | 'global';
            data: any;
            SEOData: any,
            domain: any,
            dataList: any;
            query?: string;
            mainLoading: boolean;
            SEOLoading: boolean;
            domainLoading: boolean;
            save_info: () => Promise<any>
        } = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            filterId: glitter.getUUID(),
            type: 'basic',
            data: {
                "ubn": "",
                "email": "",
                "phone": "",
                "address": "",
                "category": "",
                "pos_type": "retails",
                "ai_search": false,
                "shop_name": "",
                "support_pos_payment": [
                    "cash",
                    "creditCard",
                    "line"
                ]
            },
            SEOData: {
                "seo": {
                    "code": "",
                    "type": "custom",
                    "image": "",
                    "logo": "",
                    "title": "",
                    "content": "",
                    "keywords": ""
                },
                "list": [],
                "version": "v2",
                "formData": {},
                "formFormat": [],
                "resource_from": "global",
                "globalStyleTag": [],
                "support_editor": "true"
            },
            domain: {},
            dataList: undefined,
            query: '',
            mainLoading: true,
            SEOLoading: true,
            domainLoading: true,
            save_info: () => {
                return new Promise<any>(() => {
                })
            }
        };
        const dialog = new ShareDialog(gvc.glitter);
        const shopCategory = [
            {"key": "寵物用品", "value": "寵物用品"},
            {"key": "服飾販售", "value": "服飾販售"},
            {"key": "珠寶販售", "value": "珠寶販售"},
            {"key": "雜貨店", "value": "雜貨店"},
            {"key": "電子產品", "value": "電子產品"},
            {"key": "藥局", "value": "藥局"},
            {"key": "書店", "value": "書店"},
            {"key": "家具店", "value": "家具店"},
            {"key": "玩具店", "value": "玩具店"},
            {"key": "運動用品店", "value": "運動用品店"},
            {"key": "五金店", "value": "五金店"},
            {"key": "超市", "value": "超市"},
            {"key": "百貨公司", "value": "百貨公司"},
            {"key": "美妝店", "value": "美妝店"},
            {"key": "鞋店", "value": "鞋店"},
            {"key": "眼鏡店", "value": "眼鏡店"},
            {"key": "香水店", "value": "香水店"},
            {"key": "文具店", "value": "文具店"},
            {"key": "家電店", "value": "家電店"},
            {"key": "自行車店", "value": "自行車店"},
            {"key": "音樂器材店", "value": "音樂器材店"},
            {"key": "建材店", "value": "建材店"},
            {"key": "農產品店", "value": "農產品店"},
            {"key": "咖啡店", "value": "咖啡店"},
            {"key": "甜品店", "value": "甜品店"},
            {"key": "鮮花店", "value": "鮮花店"},
            {"key": "餐具店", "value": "餐具店"},
            {"key": "床上用品店", "value": "床上用品店"},
            {"key": "汽車配件店", "value": "汽車配件店"},
            {"key": "影視產品店", "value": "影視產品店"},
            {"key": "二手店", "value": "二手店"},
            {"key": "眼鏡店", "value": "眼鏡店"},
            {"key": "酒品店", "value": "酒品店"},
            {"key": "蔬果店", "value": "蔬果店"},
            {"key": "冰淇淋店", "value": "冰淇淋店"},
            {"key": "烘焙店", "value": "烘焙店"},
            {"key": "肉品店", "value": "肉品店"},
            {"key": "海鮮店", "value": "海鮮店"},
            {"key": "奶製品店", "value": "奶製品店"},
            {"key": "文創商品店", "value": "文創商品店"},
            {"key": "紀念品店", "value": "紀念品店"},
            {"key": "花藝店", "value": "花藝店"},
            {"key": "園藝用品店", "value": "園藝用品店"},
            {"key": "玩具收藏店", "value": "玩具收藏店"},
            {"key": "手工藝品店", "value": "手工藝品店"},
            {"key": "茶葉店", "value": "茶葉店"},
            {"key": "香氛店", "value": "香氛店"},
            {"key": "健康食品店", "value": "健康食品店"},
            {"key": "巧克力店", "value": "巧克力店"},
            {"key": "盆栽店", "value": "盆栽店"},
            {"key": "其他", "value": "其他"}
        ]

        async function getSEOData() {
            const appName = (window.parent as any).saasConfig.config.appName
            return await BaseApi.create({
                "url": config.url + `/api/v1/template?appName=${appName}&tag=index`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": config.token
                },
            })
        }

        async function setSEOData(passData: any): Promise<any> {
            const appName = (window.parent as any).saasConfig.config.appName;
            dialog.dataLoading({visible: true})
            return new Promise(async (resolve, reject) => {
                const page_config = (await getSEOData()).response.result[0].page_config;
                page_config.seo = passData.seo
                await BaseApi.create({
                    "url": config.url + `/api/v1/template`,
                    "type": "PUT",
                    "headers": {
                        "Content-Type": "application/json",
                        'g-app': appName,
                        "Authorization": (window.parent as any).saasConfig.config.token
                    },
                    data: JSON.stringify({
                        "page_config": page_config,
                        "appName": appName,
                        "tag": "index"
                    })
                })
                resolve(true)
            })
        }

        return gvc.bindView({
            bind: vm.id,
            dataList: [{obj: vm, key: 'type'}],
            view: () => {

                if (vm.mainLoading) {
                    ApiUser.getPublicConfig("store-information", "manager").then((r: any) => {

                        vm.data = r.response.value;
                        const data = r.response.value
                        vm.data = {
                            "ubn": "",
                            "email": "",
                            "phone": "",
                            "address": "",
                            "category": "",
                            "pos_type": "retails",
                            "ai_search": false,
                            "wishlist": true,
                            "shop_name": "",
                            "support_pos_payment": [
                                "cash",
                                "creditCard",
                                "line"
                            ],
                            ...data
                        }
                        vm.mainLoading = false;
                        gvc.notifyDataChange(vm.id)
                    })
                }
                vm.data.web_type = vm.data.web_type ?? ['shop']
                vm.data.currency_code = vm.data.currency_code || 'TWD'
                vm.data.cookie_check=vm.data.cookie_check ?? true
                return BgWidget.container(html`
                    <div class="title-container">
                        ${BgWidget.title('全站設定')}
                    </div>
                    ${BgWidget.tab(
                            [
                                {title: '商店訊息', key: 'basic'},
                                {title: '功能管理', key: 'function'},
                                {title: '跨境電商', key: 'global'}
                            ],
                            gvc,
                            vm.type,
                            (text) => {
                                vm.type=text as any
                                // vm.select = text as any;
                                // gvc.notifyDataChange(id);
                            }
                    )}
                    ${(()=>{
                        switch (vm.type){
                            case 'basic':
                                return ` ${gvc.bindView({
                                    bind: "basic",
                                    view: () => {
                                        vm.save_info = () => {
                                            return new Promise((resolve, reject) => {
                                                ApiUser.setPublicConfig({
                                                    key: "store-information",
                                                    value: vm.data,
                                                    user_id: 'manager'
                                                }).then(r => {
                                                    resolve(true);
                                                    (window.parent as any).store_info.web_type=vm.data.web_type;
                                                })
                                            })
                                        }
                                        return BgWidget.mainCard(html`
                                <div class="d-flex flex-column " style="gap:18px;">
                                    <div class="d-flex flex-column guide6-3">
                                        <div class="d-flex w-100" style="gap:24px;">
                                            ${BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '商店名稱',
                                            default: vm.data.shop_name ?? "",
                                            callback: (text) => {
                                                vm.data.shop_name = text;
                                            },
                                            placeHolder: '請輸入商店資訊',
                                            divStyle: "width:100%;"
                                        })}
                                            <div class="w-100 d-flex flex-column">
                                                <div class="tx_normal fw-normal">商店類別</div>
                                                ${BgWidget.select({
                                            gvc: gvc,
                                            default: vm.data.category ?? "",
                                            callback: (key) => {
                                                vm.data.category = key;
                                            },
                                            options: shopCategory,
                                            style: 'width:100%;margin: 8px 0;',
                                        })}
                                            </div>
                                        </div>
                                        <div class="d-flex w-100" style="gap:24px;">
                                            ${BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '電子信箱',
                                            default: vm.data.email ?? "",
                                            callback: (text) => {
                                                vm.data.email = text;
                                            },
                                            placeHolder: '請輸入電子信箱',
                                            divStyle: "width:100%;"
                                        })}
                                            ${BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '聯絡電話',
                                            default: vm.data.phone ?? "",
                                            callback: (text) => {
                                                vm.data.phone = text;
                                            },
                                            placeHolder: '請輸入聯絡電話',
                                            divStyle: "width:100%;"
                                        })}
                                        </div>
                                        <div class="d-flex w-100" style="gap:24px;">
                                            ${BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '店家地址',
                                            default: vm.data.address,
                                            callback: (text) => {
                                                vm.data.address = text;
                                            },
                                            placeHolder: '請輸入店家地址',
                                            divStyle: "width:100%;"
                                        })}
                                            ${BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '統一編號',
                                            default: vm.data.ubn,
                                            callback: (text) => {
                                                vm.data.ubn = text;
                                            },
                                            placeHolder: '請輸入統一編號',
                                            divStyle: "width:100%;"
                                        })}
                                        </div>
                                    </div>
                                </div>
                            `, ``)
                                    }, divCreate: {}
                                })}
                    <div style="margin-top: 24px;"></div>
                    ${gvc.bindView(() => {
                                    const origin_select = (window.parent as any).glitter.share.editorViewModel.domain.includes('shopnex.tw') ? `free` : `custom`
                                    let domain_from = (window.parent as any).glitter.share.editorViewModel.domain.includes('shopnex.tw') ? `free` : `custom`
                                    let domain_text = (window.parent as any).glitter.share.editorViewModel.domain.replace('.shopnex.tw', '')
                                    return {
                                        bind: `domain`,
                                        view: () => {
                                            return BgWidget.mainCard(html`
                                    <div class="d-flex flex-column" style="gap:24px">
                                        <div class="d-flex flex-column" style="">
                                            <div class="tx_normal fw-bold">網域設定</div>
                                            <div class="d-flex align-items-center" style="gap:8px;">
                                                ${BgWidget.inlineCheckBox({
                                                title: '',
                                                gvc: gvc,
                                                def: domain_from,
                                                array: [
                                                    {
                                                        title: '子網域',
                                                        value: 'free',
                                                    },
                                                    {
                                                        title: '獨立網域',
                                                        value: 'custom',
                                                    },
                                                ],
                                                callback: (text) => {
                                                    domain_from = text as any
                                                    if (origin_select === domain_from) {
                                                        domain_text = (window.parent as any).glitter.share.editorViewModel.domain.replace('.shopnex.tw', '')
                                                    } else {
                                                        domain_text = ''
                                                    }
                                                    gvc.notifyDataChange('domain')
                                                },
                                            })}
                                                ${BgWidget.questionButton(
                                                    gvc.event(() => {
                                                        BgWidget.settingDialog({
                                                            gvc: gvc,
                                                            title: 'DNS 設定指南',
                                                            innerHTML: (gvc) => {
                                                                return `<div class=" s000032" style="word-break: break-all;white-space:normal;max-width: 100%;" >
${BgWidget.title('GoDaddy DNS 設定指南')}
   <div class="fw-bold fw-normal">DNS 設定指南（以 GoDaddy 舉例</div>
    <h3>步驟 1：登錄 GoDaddy 帳戶</h3>
    <ol>
        <li>訪問 <a href="https://www.godaddy.com" target="_blank">GoDaddy 官方網站</a>。</li>
        <li>使用你的帳號和密碼登錄到 GoDaddy 控制台。</li>
    </ol>

    <h3>步驟 2：訪問你的域名管理區</h3>
    <ol>
        <li>前往「我的產品」：登錄後，點擊右上角的「我的帳戶」，然後選擇「我的產品」。</li>
        <li>選擇你的域名：在「我的產品」頁面中找到你要設置的域名，點擊該域名旁邊的「DNS」按鈕。</li>
    </ol>

    <h3>步驟 3：設置 DNS 記錄</h3>
    <ol>
        <li>進入 DNS 管理頁面：點擊「DNS」後，會進入域名的 DNS 管理頁面。</li>
        <li>添加 A 記錄：
            <ul>
                <li>在「記錄」區域，找到「A 記錄」，如果已有一個 A 記錄指向根域名（@），可以編輯它。如果沒有，點擊「添加」。</li>
                <li>設定如下：
                    <ul>
                        <li><code>名稱（Name）: @</code></li>
                        <li><code>類型（Type）: A</code></li>
                        <li><code>值（Value）: 34.81.28.192</code></li>
                        <li><code>TTL: 600</code></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>保存記錄：確保記錄設置正確後，點擊「保存」按鈕。</li>
    </ol>

    <h3>步驟 4：設置 WWW 子域名（選擇性）</h3>
    <ol>
        <li>添加 CNAME 記錄（如需將 <code>www</code> 子域名指向根域名）：
            <ul>
                <li>點擊「添加」按鈕。</li>
                <li>設定如下：
                    <ul>
                        <li><code>名稱（Name）: @</code></li>
                        <li><code>類型（Type）: CNAME</code></li>
                        <li><code>值（Value）: 34.81.28.192</code></li>
                        <li><code>TTL: 600</code></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>保存記錄：確保記錄設置正確後，點擊「保存」按鈕。</li>
    </ol>

    <h3>步驟 5：確認 DNS 設置</h3>
    <ol style="padding-bottom: 60px;">
        <li>等待生效：DNS 設置通常需要一些時間才能完全生效，通常在 24 到 48 小時內。</li>
    </ol>



    </div>`
                                                            },
                                                            footer_html: (gvc: GVC) => {
                                                                return ``
                                                            }
                                                        })
                                                    })
                                            )}
                                            </div>
                                            <div class="d-flex w-100"
                                                 style="border:1px solid #DDD;border-radius:10px;overflow:hidden;">
                                                <div style="display: flex;padding: 9px 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px 0px 0px 10px;background: #EAEAEA;">
                                                    https://
                                                </div>
                                                <input class="flex-fill border-0 px-2" onchange="${gvc.event((e) => {
                                                domain_text = e.value;
                                            })}" value="${domain_text}">
                                                <div class="${domain_from === 'custom' ? `d-none` : ``}"
                                                     style="padding: 9px 10px;border-radius: 0px 10px 10px 0px;background: #EAEAEA;">
                                                    .shopnex.tw
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            ${BgWidget.save(gvc.event(() => {
                                                const glitter = (window.parent as any).glitter;
                                                if (!domain_text) {
                                                    dialog.errorMessage({text: '請輸入網域名稱'})
                                                    return
                                                } else if (glitter.share.editorViewModel.domain === domain_text) {
                                                    dialog.errorMessage({text: '此網域已部署完成'})
                                                    return
                                                }
                                                dialog.dataLoading({visible: true})
                                                const appName = (window.parent as any).appName;
                                                const saasConfig = (window.parent as any).saasConfig;
                                                if (domain_from === 'custom') {
                                                    saasConfig.api.setDomain({
                                                        domain: domain_text,
                                                        app_name: appName,
                                                        token: saasConfig.config.token
                                                    }).then((res: any) => {
                                                        dialog.dataLoading({visible: false})
                                                        if (res.result) {
                                                            dialog.successMessage({text: '網域部署成功!'})
                                                            glitter.share.editorViewModel.domain = domain_text;
                                                        } else {
                                                            dialog.errorMessage({text: '網域部署失敗!'})
                                                        }
                                                    })
                                                } else {
                                                    saasConfig.api.setSubDomain({
                                                        sub_domain: domain_text,
                                                        app_name: appName,
                                                        token: saasConfig.config.token
                                                    }).then((res: any) => {
                                                        dialog.dataLoading({visible: false})
                                                        if (res.result) {
                                                            dialog.successMessage({text: '網域部署成功!'})
                                                            glitter.share.editorViewModel.domain = `${domain_text}.shopnex.tw`
                                                        } else {
                                                            dialog.errorMessage({text: '網域部署失敗!'})
                                                        }
                                                    })
                                                }
                                            }), '申請')}
                                        </div>
                                    </div>
                                `, 'guide6-5')

                                        }
                                    }
                                })}
          `
                            case 'function':
                                return  BgWidget.mainCard(`
                                 <div class="d-flex flex-column" style="gap:8px;">
                                        <div style="color: #393939;font-size: 16px;">網站功能</div>
                                        ${BgWidget.grayNote('系統將根據您勾選的項目，開放相對應的功能')}
                                        <div class="d-flex align-items-center">
                                            ${
                                        BgWidget.inlineCheckBox({
                                            title: '',
                                            gvc: gvc,
                                            def: vm.data.web_type,
                                            array: [
                                                {
                                                    title: '零售購物',
                                                    value: 'shop',
                                                },
                                                // {
                                                //     title: '形象網站',
                                                //     value: 'image',
                                                // },
                                                {
                                                    title: '授課網站',
                                                    value: 'teaching',
                                                },
                                                {
                                                    title: '預約系統',
                                                    value: 'reserve',
                                                },
                                                {
                                                    title: '餐飲組合',
                                                    value: 'kitchen',
                                                }
                                            ],
                                            callback: (array: any) => {
                                                vm.data.web_type = array
                                            },
                                            type: 'multiple',
                                        })
                                }
                                        </div>
                                        <div style="color: #393939;font-size: 16px;">啟用 AI 選品</div>
                                        <div style="color: #8D8D8D;font-size:13px;">透過 AI 選品功能用戶可以使用自然語言描述找到所需商品<br>
                                            例如:幫我找到真皮材質的三人座沙發
                                        </div>
                                        <div class="cursor_pointer form-check form-switch m-0 p-0"
                                             style="margin-top: 10px;">
                                            <input
                                                    class="form-check-input m-0"
                                                    type="checkbox"
                                                    onchange="${gvc.event((e, event) => {
                                    vm.data.ai_search = !vm.data.ai_search

                                })}"
                                                    ${vm.data.ai_search ? `checked`
                                        : ``}
                                            />
                                        </div>
                                        ${
                                            GlobalUser.getPlan().id > 0 ? html`<div class="d-flex flex-column" style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">啟用聊聊功能</div>
                                            <div style="color: #8D8D8D;font-size:13px;">啟用聊聊功能，方便客戶直接於官網前台與您聯繫，並詢問商品詳細內容。
                                            </div>
                                            <div class="cursor_pointer form-check form-switch m-0 p-0"
                                                 style="margin-top: 10px;">
                                                <input
                                                        class="form-check-input m-0"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                    vm.data.chat_toggle = !vm.data.chat_toggle
                                })}"
                                                        ${vm.data.chat_toggle ? `checked` : ``}
                                                />
                                            </div>
                                        </div>` : ''
                                        }
                                        <div class="d-flex flex-column" style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">啟用心願單功能</div>
                                            <div style="color: #8D8D8D;font-size:13px;">啟用心願單功能，方便客戶收藏並管理喜愛的商品清單。<br>
                                                隨時查看心儀商品，提升購物體驗與轉換率。
                                            </div>
                                            <div class="cursor_pointer form-check form-switch m-0 p-0"
                                                 style="margin-top: 10px;">
                                                <input
                                                        class="form-check-input m-0"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                    vm.data.wishlist = !vm.data.wishlist
                                })}"
                                                        ${vm.data.wishlist ? `checked` : ``}
                                                />
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column" style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">啟用顧客評論功能</div>
                                            <div style="color: #8D8D8D;font-size:13px;">啟用顧客評論功能，顧客可以對您的商品進行評論。
                                            </div>
                                            <div class="cursor_pointer form-check form-switch m-0 p-0"
                                                 style="margin-top: 10px;">
                                                <input
                                                        class="form-check-input m-0"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                    vm.data.customer_comment = !vm.data.customer_comment
                                })}"
                                                        ${vm.data.customer_comment ? `checked` : ``}
                                                />
                                            </div>
                                        </div>
  <div class="d-flex flex-column" style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">啟用Cookie聲明</div>
                                            <div style="color: #8D8D8D;font-size:13px;">如需使用廣告追蹤行為，必須啟用Cookie聲明，才可發送廣告。</div>
                                            <div class="cursor_pointer form-check form-switch m-0 p-0"
                                                 style="margin-top: 10px;">
                                                <input
                                                        class="form-check-input m-0"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                    vm.data.cookie_check = !vm.data.cookie_check
                                })}"
                                                        ${vm.data.cookie_check ? `checked` : ``}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                `)
                            case "global":
                                return  BgWidget.mainCard(`
   ${gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID()
                                    const html = String.raw
                                    const all_lan = ['en-US', 'zh-CN', 'zh-TW'];
                                    vm.data.language_setting = (window.parent as any).store_info.language_setting

                                    function refreshLanguage() {
                                        gvc.notifyDataChange([id, 'SEO'])
                                    }

                                    return {
                                        bind: id,
                                        view: () => {
                                            const sup = [
                                                {
                                                    key: 'en-US',
                                                    value: '英文'
                                                },
                                                {
                                                    key: 'zh-CN',
                                                    value: '簡體中文'
                                                },
                                                {
                                                    key: 'zh-TW',
                                                    value: '繁體中文'
                                                }
                                            ].filter((dd) => {
                                                return vm.data.language_setting.support.includes(dd.key)
                                            }).sort((dd: any) => {
                                                return dd.key === vm.data.language_setting.def ? -1 : 1
                                            });
                                            return html`
                                                        <div class="mt-2" style="color: #393939;font-size: 16px;">
                                                            多國語言
                                                            <span class="cursor_pointer"
                                                                  style="font-size: 13px;color:#36B;"
                                                                  onclick="${gvc.event(() => {
                                                BgWidget.selectLanguage({})
                                            })}"> 
                                                                管理語言包
                                                            </span>
                                                        </div>
                                                        <div style="color: #8D8D8D;font-size:13px;">
                                                            初次載入時將優先預設為用戶裝置所設定的語言
                                                        </div>
                                                        <div class="d-flex mt-3" style="gap:15px;">
                                                            ${sup.map((dd: any) => {
                                                return `<div class="px-3 py-1 text-white position-relative d-flex align-items-center justify-content-center" style="border-radius: 20px;background: #393939;cursor: pointer;width:100px;" onclick="${gvc.event(() => {
                                                    BgWidget.settingDialog({
                                                        gvc: gvc,
                                                        title: '語系設定',
                                                        innerHTML: (gvc: GVC) => {
                                                            return html`
                                                                                <div class="w-100 d-flex align-items-center justify-content-end"
                                                                                     style="gap:10px;">
                                                                                    ${
                                                                    BgWidget.danger(gvc.event(() => {
                                                                        vm.data.language_setting.support = vm.data.language_setting.support.filter((d1: any) => {
                                                                            return d1 != dd.key
                                                                        });
                                                                        refreshLanguage()
                                                                        gvc.closeDialog()
                                                                    }), '刪除語系')
                                                            }
                                                                                    ${
                                                                    BgWidget.save(gvc.event(() => {
                                                                        vm.data.language_setting.def = dd.key;
                                                                        refreshLanguage()
                                                                        gvc.closeDialog()
                                                                    }), '設為預設語系')
                                                            }
                                                                                </div>`
                                                        },
                                                        footer_html: (gvc) => {
                                                            return ``
                                                        },
                                                        width: 400
                                                    })
                                                })}">${dd.value}
<div class="position-absolute  text-white rounded-2 px-2 d-flex align-items-center rounded-3 ${dd.key !== vm.data.language_setting.def ? `d-none` : ``}" style="top: -12px;right: -10px; height:20px;font-size: 11px;background: #ff6c02;">預設</div>
</div>
`
                                            }).join('')}
                                                            <div class="d-flex align-items-center">
                                                                ${[((all_lan.length !== vm.data.language_setting.support.length) ? html`
                                                                    <div class=" d-flex align-items-center justify-content-center cursor_pointer"
                                                                         style="color: #36B; font-size: 16px; font-weight: 400;"
                                                                         onclick="${gvc.event(() => {
                                                let add = ''
                                                BgWidget.settingDialog({
                                                    gvc: gvc,
                                                    title: '新增語言',
                                                    innerHTML: (gvc: GVC) => {
                                                        const can_add = [{
                                                            key: 'en-US',
                                                            value: '英文'
                                                        },
                                                            {
                                                                key: 'zh-CN',
                                                                value: '簡體中文'
                                                            },
                                                            {
                                                                key: 'zh-TW',
                                                                value: '繁體中文'
                                                            }].filter((dd) => {
                                                            return !vm.data.language_setting.support.includes(dd.key)
                                                        });
                                                        add = can_add[0].key
                                                        return [
                                                            BgWidget.select({
                                                                gvc: gvc,
                                                                default: can_add[0].key,
                                                                options: can_add,
                                                                callback: (text) => {
                                                                    add = text
                                                                },
                                                            })
                                                        ].join('')
                                                    },
                                                    footer_html: (gvc: GVC) => {
                                                        return BgWidget.save(gvc.event(() => {
                                                            vm.data.language_setting.support.push(add)
                                                            gvc.closeDialog()
                                                            setTimeout(() => {
                                                                refreshLanguage()
                                                            }, 100)

                                                        }), '新增')
                                                    },
                                                    width: 200
                                                })
                                            })}">
                                                                        <div>新增語系</div>
                                                                        <div class="d-flex align-items-center justify-content-center p-2">
                                                                            <i class="fa-solid fa-plus fs-6"
                                                                               style="font-size: 16px; "
                                                                               aria-hidden="true"></i>
                                                                        </div>
                                                                    </div>
                                                                ` : ``)].filter((dd) => {
                                                return dd.trim()
                                            }).join(``)}
                                                            </div>
                                                        </div>`
                                        }
                                    }
                                })}
<div class="d-flex flex-column mt-2" style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">商店貨幣</div>
                                            <div style="color: #8D8D8D;font-size:13px;">
                                                統一設定商品幣別，前台將依據商品幣別進行換算顯示
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center">
                                                ${BgWidget.select({
                                    gvc: gvc,
                                    callback: (text) => {
                                        vm.data.currency_code = text
                                    },
                                    default: vm.data.currency_code,
                                    options: Currency.code.map((dd) => {
                                        return {
                                            key: dd.currency_code,
                                            value: dd.currency_title
                                        }
                                    })
                                })}
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column mt-2" style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">啟用多國貨幣</div>
                                            <div style="color: #8D8D8D;font-size:13px;">
                                                啟用多國貨幣功能，將自動根據用戶IP所在地區進行幣值轉換
                                            </div>
                                            <div class="cursor_pointer form-check form-switch ms-0 ps-0"
                                                 style="">
                                                <input
                                                        class="form-check-input m-0"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                    vm.data.multi_currency = !vm.data.multi_currency
                                    gvc.notifyDataChange('basic')
                                })}"
                                                        ${vm.data.multi_currency ? `checked` : ``}
                                                />
                                            </div>
                                        </div>
                                        ${vm.data.multi_currency ? `<div class="d-flex flex-column " style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">啟用貨幣切換</div>
                                            <div style="color: #8D8D8D;font-size:13px;">
                                                是否開放用戶於前台自行切換幣別進行顯示
                                            </div>
                                            <div class="cursor_pointer form-check form-switch ms-0 ps-0"
                                                 style="">
                                                <input
                                                        class="form-check-input m-0"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                    vm.data.switch_currency = !vm.data.switch_currency
                                })}"
                                                        ${vm.data.switch_currency ? `checked` : ``}
                                                />
                                            </div>
                                        </div>` : ``}
                                        <div class="d-flex flex-column mt-2" style="gap:8px;">
                                            <div style="color: #393939;font-size: 16px;">預設顯示幣別</div>
                                            <div style="color: #8D8D8D;font-size:13px;">
                                                當查無相關幣別支援國家，前台將預設使用此幣別進行顯示
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center">
                                                ${BgWidget.select({
                                    gvc: gvc,
                                    callback: (text) => {
                                        vm.data.currency_code_f_def = text
                                    },
                                    default: vm.data.currency_code_f_def,
                                    options: Currency.code.map((dd) => {
                                        return {
                                            key: dd.currency_code,
                                            value: dd.currency_title
                                        }
                                    })
                                })}
                                            </div>
                                        </div>
                                     `)
                        }
                    })()}
                    <div style="margin-top: 300px;"></div>
                    <div class="shadow"
                         style="width: 100%;padding: 14px 16px;background: #FFF; display: flex;justify-content: end;position: fixed;bottom: 0;right: 0;z-index:1;gap:14px;">
                        ${BgWidget.save(
                                gvc.event(async () => {
                                    const dialog = new ShareDialog(gvc.glitter)
                                    dialog.dataLoading({visible: true})
                                    await vm.save_info()
                                    await Promise.all(ShoppingInformation.saveArray.map((dd) => {
                                        return dd()
                                    }));
                                    ShoppingInformation.saveArray = []
                                    dialog.dataLoading({visible: false})
                                    dialog.successMessage({text: '儲存成功'})
                                }),
                                '儲存',
                                'guide3-5'
                        )}
                    </div>
                `)
            }, divCreate: {style: `color:#393939;font-size: 14px;`}
        })
    }

    public static saveArray: (() => Promise<boolean>)[] = []

    public static policy(gvc: GVC) {
        const id = gvc.glitter.getUUID()
        const html = String.raw
        const vm2 = {
            language: (window.parent as any).store_info.language_setting.def
        }
        return BgWidget.container(gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    return [
                        html`
                            <div class="title-container mb-4">
                                ${BgWidget.title(`商店條款`)}
                                <div class="flex-fill"></div>
                                ${LanguageBackend.switchBtn({
                                    gvc: gvc,
                                    language: vm2.language,
                                    callback: (language) => {
                                        vm2.language=language;
                                        gvc.notifyDataChange(id)
                                    }
                                })}
                            </div>`,
                        gvc.bindView(() => {
                            return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                    return BgWidget.mainCard(`<div class="d-flex flex-column" style="">${
                                        [
                                            ...[{
                                                key: 'privacy',
                                                title: '隱私權政策'
                                            }, {
                                                key: 'term',
                                                title: '服務條款'
                                            }, {
                                                key: 'refund',
                                                title: '退換貨政策'
                                            }, {
                                                key: 'delivery',
                                                title: '購買與配送須知'
                                            }].map((dd) => {
                                                return html`
                                                    <div style="color: #393939;font-size: 16px;">${dd.title}</div>
                                                    <div style="color: #36B;font-size:13px;cursor:pointer;"
                                                         onclick="${gvc.event(() => {
                                                             (window.parent as any).glitter.openNewTab(`https://${(window.parent as any).glitter.share.editorViewModel.domain}/${dd.key}`)
                                                         })}">
                                                            https://${(window.parent as any).glitter.share.editorViewModel.domain}/${dd.key}
                                                    </div>
                                                    ${gvc.bindView(() => {
                                                        const key = dd.key
                                                        const vm: {
                                                            id: string,
                                                            loading: boolean,
                                                            data: any
                                                        } = {
                                                            id: gvc.glitter.getUUID(),
                                                            loading: true,
                                                            data: {}
                                                        }
                                                        ApiUser.getPublicConfig(`terms-related-${key}-${vm2.language}`, 'manager').then((dd) => {
                                                            dd.response.value && (vm.data = dd.response.value);
                                                            vm.loading = false
                                                            gvc.notifyDataChange(vm.id);
                                                        })
                                                        return {
                                                            bind: vm.id,
                                                            view: () => {
                                                                if (vm.loading) {
                                                                    return `<div class="w-100 d-flex align-items-center justify-content-center">${BgWidget.spinner()}</div>`
                                                                }
                                                                return BgWidget.richTextEditor({
                                                                    gvc: gvc,
                                                                    content: vm.data.text || '',
                                                                    callback: (content) => {
                                                                        vm.data.text = content;
                                                                        ShoppingInformation.saveArray.push(() => {
                                                                            return new Promise(async (resolve, reject) => {
                                                                                await ApiUser.setPublicConfig({
                                                                                    key: `terms-related-${key}-${vm2.language}`,
                                                                                    user_id: 'manager',
                                                                                    value: vm.data
                                                                                });
                                                                                resolve(true)
                                                                            })
                                                                        })
                                                                    },
                                                                    title: dd.title
                                                                })
                                                            },
                                                            divCreate: {
                                                                class: `w-100 mt-2`
                                                            }
                                                        }
                                                    })}
                                                `
                                            })
                                        ].join('<div class="my-1"></div>')
                                    }
                    <div class="shadow"
                         style="width: 100%;padding: 14px 16px;background: #FFF; display: flex;justify-content: end;position: fixed;bottom: 0;right: 0;z-index:1;gap:14px;">
                        ${BgWidget.save(
                                        gvc.event(async () => {
                                            const dialog = new ShareDialog(gvc.glitter)
                                            dialog.dataLoading({visible: true})
                                            await Promise.all(ShoppingInformation.saveArray.map((dd) => {
                                                return dd()
                                            }));
                                            ShoppingInformation.saveArray = []
                                            dialog.dataLoading({visible: false})
                                            dialog.successMessage({text: '儲存成功'})
                                        }),
                                        '儲存'
                                    )}
                    </div>
</div>`)
                                },
                                divCreate: {
                                    class: `mt-3`, style: ``
                                }
                            }
                        }),
                        `<div style="margin-top: 300px;"></div>`
                    ].join('')
                }
            }
        }))
    }

    public static question = {}

}

(window as any).glitter.setModule(import.meta.url, ShoppingInformation);
