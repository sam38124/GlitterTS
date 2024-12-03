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
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { imageLibrary } from "../modules/image-library.js";
import { BaseApi } from "../glitterBundle/api/base.js";
import { config } from "../config.js";
export class ShoppingInformation {
    static main(gvc) {
        const glitter = gvc.glitter;
        const html = String.raw;
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            filterId: glitter.getUUID(),
            type: 'list',
            data: {
                "ubn": "",
                "email": "",
                "phone": "",
                "address": "",
                "category": "",
                "pos_type": "retails",
                "ai_search": true,
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
            domainLoading: true
        };
        const dialog = new ShareDialog(gvc.glitter);
        const shopCategory = [
            { "key": "寵物用品", "value": "寵物用品" },
            { "key": "服飾販售", "value": "服飾販售" },
            { "key": "珠寶販售", "value": "珠寶販售" },
            { "key": "雜貨店", "value": "雜貨店" },
            { "key": "電子產品", "value": "電子產品" },
            { "key": "藥局", "value": "藥局" },
            { "key": "書店", "value": "書店" },
            { "key": "家具店", "value": "家具店" },
            { "key": "玩具店", "value": "玩具店" },
            { "key": "運動用品店", "value": "運動用品店" },
            { "key": "五金店", "value": "五金店" },
            { "key": "超市", "value": "超市" },
            { "key": "百貨公司", "value": "百貨公司" },
            { "key": "美妝店", "value": "美妝店" },
            { "key": "鞋店", "value": "鞋店" },
            { "key": "眼鏡店", "value": "眼鏡店" },
            { "key": "香水店", "value": "香水店" },
            { "key": "文具店", "value": "文具店" },
            { "key": "家電店", "value": "家電店" },
            { "key": "自行車店", "value": "自行車店" },
            { "key": "音樂器材店", "value": "音樂器材店" },
            { "key": "建材店", "value": "建材店" },
            { "key": "農產品店", "value": "農產品店" },
            { "key": "咖啡店", "value": "咖啡店" },
            { "key": "甜品店", "value": "甜品店" },
            { "key": "鮮花店", "value": "鮮花店" },
            { "key": "餐具店", "value": "餐具店" },
            { "key": "床上用品店", "value": "床上用品店" },
            { "key": "汽車配件店", "value": "汽車配件店" },
            { "key": "影視產品店", "value": "影視產品店" },
            { "key": "二手店", "value": "二手店" },
            { "key": "眼鏡店", "value": "眼鏡店" },
            { "key": "酒品店", "value": "酒品店" },
            { "key": "蔬果店", "value": "蔬果店" },
            { "key": "冰淇淋店", "value": "冰淇淋店" },
            { "key": "烘焙店", "value": "烘焙店" },
            { "key": "肉品店", "value": "肉品店" },
            { "key": "海鮮店", "value": "海鮮店" },
            { "key": "奶製品店", "value": "奶製品店" },
            { "key": "文創商品店", "value": "文創商品店" },
            { "key": "紀念品店", "value": "紀念品店" },
            { "key": "花藝店", "value": "花藝店" },
            { "key": "園藝用品店", "value": "園藝用品店" },
            { "key": "玩具收藏店", "value": "玩具收藏店" },
            { "key": "手工藝品店", "value": "手工藝品店" },
            { "key": "茶葉店", "value": "茶葉店" },
            { "key": "香氛店", "value": "香氛店" },
            { "key": "健康食品店", "value": "健康食品店" },
            { "key": "巧克力店", "value": "巧克力店" },
            { "key": "盆栽店", "value": "盆栽店" },
            { "key": "其他", "value": "其他" }
        ];
        function getSEOData() {
            return __awaiter(this, void 0, void 0, function* () {
                const appName = window.parent.saasConfig.config.appName;
                return yield BaseApi.create({
                    "url": config.url + `/api/v1/template?appName=${appName}&tag=index`,
                    "type": "GET",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": config.token
                    },
                });
            });
        }
        function setSEOData(passData) {
            return __awaiter(this, void 0, void 0, function* () {
                const appName = window.parent.saasConfig.config.appName;
                return yield BaseApi.create({
                    "url": config.url + `/api/v1/template?appName=${appName}`,
                    "type": "PUT",
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": window.parent.saasConfig.config.token
                    },
                    data: JSON.stringify(passData)
                });
            });
        }
        function getDomainData() {
            return __awaiter(this, void 0, void 0, function* () {
                const appName = window.parent.saasConfig.config.appName;
            });
        }
        function setDomainData(passData) {
            return __awaiter(this, void 0, void 0, function* () {
                const appName = window.parent.saasConfig.config.appName;
            });
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.mainLoading) {
                    ApiUser.getPublicConfig("store-information", "manager").then((r) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        vm.data = r.response.value;
                        const data = r.response.value;
                        vm.data = {
                            "ubn": (_a = data.ubn) !== null && _a !== void 0 ? _a : "",
                            "email": (_b = data.email) !== null && _b !== void 0 ? _b : "",
                            "phone": (_c = data.phone) !== null && _c !== void 0 ? _c : "",
                            "address": (_d = data.address) !== null && _d !== void 0 ? _d : "",
                            "category": (_e = data.category) !== null && _e !== void 0 ? _e : "",
                            "pos_type": (_f = data.pos_type) !== null && _f !== void 0 ? _f : "retails",
                            "ai_search": (_g = data.ai_search) !== null && _g !== void 0 ? _g : true,
                            "shop_name": (_h = data.shop_name) !== null && _h !== void 0 ? _h : "",
                            "support_pos_payment": (_j = data.support_pos_payment) !== null && _j !== void 0 ? _j : [
                                "cash",
                                "creditCard",
                                "line"
                            ]
                        };
                        vm.mainLoading = false;
                        gvc.notifyDataChange(vm.id);
                    });
                }
                return BgWidget.container(html `
                    <div class="title-container mb-4">
                        ${BgWidget.title(`商店訊息`)}
                        <div class="flex-fill"></div>
                    </div>
                    ${gvc.bindView({
                    bind: "basic",
                    view: () => {
                        var _a, _b, _c, _d;
                        return BgWidget.mainCard(html `
                        <div class="d-flex flex-column" style="gap:18px;">
                            <div style="font-size: 16px;font-weight: 700;">商店基本資訊</div>
                            <div class="d-flex w-100" style="gap:24px;">
                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '商店名稱',
                            default: (_a = vm.data.shop_name) !== null && _a !== void 0 ? _a : "",
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
                            default: (_b = vm.data.category) !== null && _b !== void 0 ? _b : "",
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
                            default: (_c = vm.data.email) !== null && _c !== void 0 ? _c : "",
                            callback: (text) => {
                                vm.data.email = text;
                            },
                            placeHolder: '請輸入電子信箱',
                            divStyle: "width:100%;"
                        })}
                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '聯絡電話',
                            default: (_d = vm.data.phone) !== null && _d !== void 0 ? _d : "",
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
                            <div class="d-flex flex-column" style="gap:8px;">
                                <div style="color: #393939;font-size: 16px;">啟用 AI 選品</div>
                                <div style="color: #8D8D8D;font-size:13px;">透過 AI 選品功能用戶可以使用自然語言描述找到所需商品<br>
                                    例如:幫我找到真皮材質的三人座沙發</div>
                                <div class="cursor_pointer form-check form-switch m-0 p-0" style="margin-top: 10px;">
                                    <input
                                            class="form-check-input m-0"
                                            type="checkbox"
                                            onchange="${gvc.event((e, event) => {
                        })}"
                                            ${vm.data.ai_search ? `checked`
                            : ``}
                                    />
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                ${BgWidget.save(gvc.event(() => {
                            ApiUser.setPublicConfig({
                                key: "store-information",
                                value: vm.data,
                                user_id: 'manager'
                            }).then(r => {
                                console.log("r -- ", r);
                            });
                        }), '儲存')}
                            </div>
                        </div>
                    `);
                    }, divCreate: {}
                })}
                    <div style="margin-top: 24px;"></div>
                    ${gvc.bindView({
                    bind: `SEO`,
                    view: () => {
                        let QShow = [false, false, false, false];
                        if (vm.SEOLoading) {
                            getSEOData().then(r => {
                                var _a, _b, _c, _d, _e, _f, _g;
                                const data = r.response.result[0].page_config.seo;
                                vm.SEOData = {
                                    "seo": {
                                        "code": (_a = data.code) !== null && _a !== void 0 ? _a : "",
                                        "type": (_b = data.type) !== null && _b !== void 0 ? _b : "custom",
                                        "image": (_c = data.image) !== null && _c !== void 0 ? _c : "",
                                        "logo": (_d = data.logo) !== null && _d !== void 0 ? _d : "",
                                        "title": (_e = data.title) !== null && _e !== void 0 ? _e : "",
                                        "content": (_f = data.content) !== null && _f !== void 0 ? _f : "",
                                        "keywords": (_g = data.keywords) !== null && _g !== void 0 ? _g : ""
                                    },
                                    "list": [],
                                    "version": "v2",
                                    "formData": {},
                                    "formFormat": [],
                                    "resource_from": "global",
                                    "globalStyleTag": [],
                                    "support_editor": "true"
                                };
                                vm.SEOLoading = false;
                            });
                        }
                        return BgWidget.mainCard(html `
                                <div class="d-flex flex-column" style="gap:18px;">
                                    ${BgWidget.editeInput({
                            gvc: gvc,
                            title: 'SEO標題',
                            default: vm.SEOData.seo.title,
                            callback: (text) => {
                                vm.SEOData.seo.title = text;
                            },
                            placeHolder: '請輸入SEO標題',
                            divStyle: "width:100%;",
                            titleStyle: "font-weight:700!important;"
                        })}
                                    <div class="d-flex flex-column" style="gap:18px ">
                                        <div class="d-flex flex-column w-100" style="gap: 8px;">
                                            <div class="d-flex align-items-center  position-relative" style="gap:4px;font-weight:700;font-size: 16px;">SEO描述
                                                ${BgWidget.questionButton(gvc.event(() => {
                            QShow[0] = !QShow[0];
                            gvc.notifyDataChange('Q1');
                        }))}
                                                ${gvc.bindView({
                            bind: `Q1`,
                            view: () => {
                                return html `
                                                            <div class="${QShow[0] ? 'd-flex' : 'd-none'}" style="position: absolute;left: 0;top: 100%;">
                                                                <div class="" style="width: 100vw;height: 100vh;position: fixed;left: 0;top: 0" onclick="${gvc.event(() => {
                                    QShow[0] = !QShow[0];
                                    gvc.notifyDataChange('Q1');
                                })}">
                                                                </div>
                                                                <div
                                                                        style="width:100%;border-radius: 10px;background: #393939;display: flex;padding: 10px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 16px;"
                                                                >
                                                                    <div class="tx_normal  text-white text-wrap">
                                                                        <div class="text-wrap ">SEO敘述為搜索引擎結果頁面中顯示的摘要文字，為網頁提供簡短說明（如下圖紅框處）。撰寫優質的SEO描述有助於提高點擊率，增加網站流量，進而提升銷售。</div>
                                                                        <br>
                                                                        <div class="text-wrap ">1.建議文字數量不超過 99 個中文字，因此描述應該簡潔，直指重點。</div>
                                                                        <div class="text-wrap ">2.強調您的商店或產品的關鍵字，如「高品質材料」、「獨特設計」、「限時優惠」等，關鍵字不超過3個。</div>
                                                                        <div class="text-wrap ">3.詳細請見 <span >SHOPNEX教學</span></div>
                                                                    </div>
                                                                    <div>
                                                                        <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s3sasdsases9s7sd_ec8f32082f0c9b98c663492595ac5ba4.png" alt="sample">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            `;
                            }, divCreate: {}
                        })}
                                            </div>
                                            <textarea cols="4" style="padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;" onchange="${gvc.event((e) => {
                            vm.SEOData.seo.content = e.value;
                        })}"></textarea>
                                        </div>
                                        <div class="d-flex flex-column w-100" style="gap:8px">
                                            <div class="d-flex align-items-center position-relative" style="gap:4px;font-weight:700;font-size: 16px;">SEO關鍵字
                                                ${BgWidget.questionButton(gvc.event(() => {
                            QShow[1] = !QShow[1];
                            gvc.notifyDataChange('Q2');
                        }))}
                                                ${gvc.bindView({
                            bind: `Q2`,
                            view: () => {
                                return html `
                                                            <div class="${QShow[1] ? 'd-flex' : 'd-none'}" style="position: absolute;left: 0;top: 100%;">
                                                                <div class="" style="width: 100vw;height: 100vh;position: fixed;left: 0;top: 0" onclick="${gvc.event(() => {
                                    QShow[1] = !QShow[1];
                                    gvc.notifyDataChange('Q2');
                                })}">
                                                                </div>
                                                                <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716793602485-seo%E9%97%9C%E9%8D%B5%E5%AD%97.jpg" alt="Q2">
                                                            </div>
                                                            `;
                            }, divCreate: {}
                        })}
                                            </div>
                                            <textarea cols="4" style="padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;" onchange="${gvc.event((e) => {
                            vm.SEOData.seo.keywords = e.value;
                        })}"></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex " style="gap:18px ">
                                        <div class="d-flex flex-column w-50" style="gap: 8px;">
                                            <div class="d-flex align-items-center  position-relative" style="gap:4px;font-weight:700;font-size: 16px;">社群分享縮圖
                                                ${BgWidget.questionButton(gvc.event(() => {
                            QShow[2] = !QShow[2];
                            gvc.notifyDataChange('Q3');
                        }))}
                                                ${gvc.bindView({
                            bind: `Q3`,
                            view: () => {
                                return html `
                                                            <div class="${QShow[2] ? 'd-flex' : 'd-none'}" style="position: absolute;left: 0;top: 100%;">
                                                                <div class="" style="width: 100vw;height: 100vh;position: fixed;left: 0;top: 0" onclick="${gvc.event(() => {
                                    QShow[2] = !QShow[2];
                                    gvc.notifyDataChange('Q3');
                                })}">
                                                                </div>
                                                                <div
                                                                        style="width:100%;border-radius: 10px;background: #393939;display: flex;padding: 10px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 16px;"
                                                                >
                                                                    <div>
                                                                        <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716793571173-%E7%A4%BE%E7%BE%A4%E5%88%86%E4%BA%AB%E7%B8%AE%E5%9C%96.jpg" alt="sample">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            `;
                            }, divCreate: {}
                        })}
                                            </div>
                                            <div class="w-100 " style="height:191px;display: flex;justify-content: center;align-items: center;border-radius: 10px 0px 0px 10px;border: 1px solid #DDD;background: #FFF;" onclick="${gvc.event(() => {
                            imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                if (urlArray.length > 0) {
                                    vm.SEOData.seo.image = urlArray[0].data;
                                    gvc.notifyDataChange('SEO');
                                }
                                else {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                }
                            }, html ` <div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">社群分享縮圖
                                                            </div>`, { mul: false });
                        })}">
                                                <img class="${vm.SEOData.seo.image && vm.SEOData.seo.image.length > 0 ? '' : 'd-none'}" style="height:calc(100% - 10px);max-width: 100%;" src="${vm.SEOData.seo.image}" alt="縮圖error">
                                                <div class="${vm.SEOData.seo.image && vm.SEOData.seo.image.length > 0 ? 'd-none' : ''}" style="padding: 10px;border-radius: 10px;background: #FFF;/* 按鈕 */box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);" >新增圖片</div>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column w-50" style="gap:8px">
                                            <div class="d-flex align-items-center position-relative" style="gap:4px;font-weight:700;font-size: 16px;">網址旁小圖示
                                                ${BgWidget.questionButton(gvc.event(() => {
                            QShow[3] = !QShow[3];
                            gvc.notifyDataChange('Q4');
                        }))}
                                                ${gvc.bindView({
                            bind: `Q4`,
                            view: () => {
                                return html `
                                                            <div class="${QShow[1] ? 'd-flex' : 'd-none'}" style="position: absolute;left: 0;top: 100%;">
                                                                <div class="" style="width: 100vw;height: 100vh;position: fixed;left: 0;top: 0" onclick="${gvc.event(() => {
                                    QShow[3] = !QShow[3];
                                    gvc.notifyDataChange('Q4');
                                })}">
                                                                </div>
                                                                <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716793630046-favicon.jpg" alt="Q4">
                                                            </div>
                                                            `;
                            }, divCreate: {}
                        })}
                                            </div>
                                            <div class="w-100 " style="height:191px; display: flex;justify-content: center;align-items: center;border-radius: 10px 0px 0px 10px;border: 1px solid #DDD;background: #FFF;" onclick="${gvc.event(() => {
                            imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                if (urlArray.length > 0) {
                                    vm.SEOData.seo.logo = urlArray[0].data;
                                    gvc.notifyDataChange('SEO');
                                }
                                else {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                }
                            }, html ` <div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">社群分享縮圖
                                                            </div>`, { mul: false });
                        })}">
                                                <img class="${vm.SEOData.seo.logo && vm.SEOData.seo.logo.length > 0 ? '' : 'd-none'}" style="height:calc(100% - 10px);max-width: 100%;" src="${vm.SEOData.seo.logo}" alt="縮圖error">
                                                <div class="${vm.SEOData.seo.logo && vm.SEOData.seo.logo.length > 0 ? 'd-none' : ''}" style="padding: 10px;border-radius: 10px;background: #FFF;/* 按鈕 */box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);" >新增圖片</div>
                                            </div>
                                        </div>
                                    </div>
                                    ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '自訂代碼區塊',
                            default: vm.SEOData.seo.code,
                            callback: (text) => {
                                vm.SEOData.seo.code = text;
                            },
                            placeHolder: '請輸入SEO標題',
                            divStyle: "width:100%;",
                            titleStyle: "font-weight:700!important;"
                        })}
                                    <div class="d-flex justify-content-end">
                                        ${BgWidget.save(gvc.event(() => {
                            setSEOData(vm.SEOData);
                        }), '儲存')}
                                    </div>
                                </div>
                                
                            `);
                    }, divCreate: {}
                })}
                    <div style="margin-top: 24px;"></div>
                    ${gvc.bindView({
                    bind: `domain`,
                    view: () => {
                        if (vm.domainLoading) {
                            getDomainData().then(r => {
                                vm.domainLoading = false;
                            });
                        }
                        return BgWidget.mainCard(html `
                                <div class="d-flex flex-column" style="gap:24px">
                                    <div class="d-flex flex-column" style="gap: 18px">
                                        <div style="font-weight: 700;">網域設定</div>
                                        <div class="d-flex align-items-center">
                                            <div class="d-flex" >
                                                <div style="border-radius: 20px;background: #FFF;border: solid 4px #393939;width: 16px;height: 16px;"></div>
                                                <div>子網域</div>
                                            </div>
                                            <div class="d-flex" style="margin-left: 8px;margin-right: 4px;">
                                                <div style="border-radius: 20px;background: #FFF;border: solid 1px #DDD;width: 16px;height: 16px;"></div>
                                                <div>獨立網域</div>
                                            </div>
                                            ${BgWidget.questionButton(gvc.event(() => {
                        }))}
                                        </div>
                                        <div class="d-flex w-100" style="border:1px solid #DDD;border-radius:10px;">
                                            <div style="display: flex;padding: 9px 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px 0px 0px 10px;background: #EAEAEA;">https://</div>
                                            <input class="flex-fill border-0" onchange="${gvc.event((e) => {
                        })}">
                                            <div style="padding: 9px 10px;border-radius: 0px 10px 10px 0px;background: #EAEAEA;">.shopnex.tw</div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        ${BgWidget.save(gvc.event(() => {
                        }), '申請')}
                                    </div>
                                </div>
                            `);
                    }
                })}
                    <div style="margin-top: 240px;"></div>
                `);
            }, divCreate: { style: `color:#393939;font-size: 14px;` }
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingInformation);
