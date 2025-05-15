var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { ApiUser } from "../glitter-base/route/user.js";
import { BgWidget } from "../backend-manager/bg-widget.js";
import { imageLibrary } from "../modules/image-library.js";
import { LanguageBackend } from "./language-backend.js";
export class SeoBlog {
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
            domainLoading: true,
            save_seo: () => {
                return new Promise(() => {
                });
            },
            language: window.parent.store_info.language_setting.def,
            robots: ''
        };
        const dialog = new ShareDialog(gvc.glitter);
        function getSEOData() {
            return __awaiter(this, void 0, void 0, function* () {
                const appName = window.parent.saasConfig.config.appName;
                return yield ApiUser.getPublicConfig(`article_seo_data_${vm.language}`, 'manager');
            });
        }
        function setSEOData(passData) {
            return __awaiter(this, void 0, void 0, function* () {
                const appName = window.parent.saasConfig.config.appName;
                dialog.dataLoading({ visible: true });
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    yield ApiUser.setPublicConfig({
                        key: `article_seo_data_${vm.language}`,
                        user_id: 'manager',
                        value: vm.SEOData.seo
                    });
                    dialog.dataLoading({ visible: false });
                    dialog.successMessage({ text: '設定成功' });
                    resolve(true);
                }));
            });
        }
        function loadData() {
            vm.mainLoading = true;
            gvc.notifyDataChange(vm.id);
            getSEOData().then((r) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g;
                const data = r.response.value;
                vm.SEOData = {
                    "seo": {
                        "code": (_a = data.code) !== null && _a !== void 0 ? _a : "",
                        "type": (_b = data.type) !== null && _b !== void 0 ? _b : "custom",
                        "image": (_c = data.image) !== null && _c !== void 0 ? _c : "",
                        "logo": (_d = data.logo) !== null && _d !== void 0 ? _d : "",
                        "title": (_e = data.title) !== null && _e !== void 0 ? _e : "",
                        "content": (_f = data.content) !== null && _f !== void 0 ? _f : "",
                        "keywords": (_g = data.keywords) !== null && _g !== void 0 ? _g : ""
                    }
                };
                vm.mainLoading = false;
                gvc.notifyDataChange(vm.id);
            }));
        }
        loadData();
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.mainLoading) {
                    return BgWidget.spinner();
                }
                return BgWidget.container(html `
                    <div class="title-container mb-4">
                        ${BgWidget.title(`網誌目錄設定`)}
                        <div class="flex-fill"></div>
                        ${LanguageBackend.switchBtn({
                    gvc: gvc,
                    language: vm.language,
                    callback: (language) => {
                        vm.language = language;
                        loadData();
                    }
                })}
                    </div>

                    ${gvc.bindView(() => {
                    return {
                        bind: `SEO`,
                        view: () => {
                            vm.save_seo = () => {
                                return setSEOData(vm.SEOData);
                            };
                            let QShow = [false, false, false, false];
                            return BgWidget.mainCard(html `
                                    <div class="d-flex flex-column" style="gap:18px;">
                                        ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '目錄標題' + BgWidget.languageInsignia(vm.language, 'margin-left:5px;'),
                                default: vm.SEOData.seo.title,
                                callback: (text) => {
                                    vm.SEOData.seo.title = text;
                                },
                                placeHolder: '網誌列表',
                                divStyle: "width:100%;",
                                titleStyle: "font-weight:700!important;"
                            })}
                                        <div class="d-flex flex-column" style="gap:18px ">
                                            <div class="d-flex flex-column w-100" style="gap: 8px;">
                                                <div class="d-flex align-items-center  "
                                                     style="gap:4px;font-weight:700;font-size: 16px;">目錄描述
                                                    ${BgWidget.generateTooltipButton(gvc, html `
                                                                <div class="d-flex flex-column">
                                                                    <div 
                                                                         style="width: 100vw;height: 100vh;position: fixed;left: 0;top: 0"
                                                                         onclick="${gvc.event(() => {
                                QShow[0] = !QShow[0];
                                gvc.notifyDataChange('Q1');
                            })}">
                                                                    </div>
                                                                    <div
                                                                            style="width:100%;border-radius: 10px;background: #393939;display: flex;padding: 10px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 16px;"
                                                                    >
                                                                        <div class="tx_normal  text-white text-wrap">
                                                                            <div class="text-wrap ">
                                                                                SEO敘述為搜索引擎結果頁面中顯示的摘要文字，為網頁提供簡短說明（如下圖紅框處）。撰寫優質的SEO描述有助於提高點擊率，增加網站流量，進而提升銷售。
                                                                            </div>
                                                                            <br>
                                                                            <div class="text-wrap ">1.建議文字數量不超過
                                                                                99 個中文字，因此描述應該簡潔，直指重點。
                                                                            </div>
                                                                            <div class="text-wrap ">
                                                                                2.強調您的商店或產品的關鍵字，如「高品質材料」、「獨特設計」、「限時優惠」等，關鍵字不超過3個。
                                                                            </div>
                                                                            <div class="text-wrap ">3.詳細請見 <span>SHOPNEX教學</span>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s3sasdsases9s7sd_ec8f32082f0c9b98c663492595ac5ba4.png"
                                                                                 alt="sample">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            `)}
${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                                                </div>
                                                <textarea cols="4"
                                                          style="padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                          onchange="${gvc.event((e) => {
                                vm.SEOData.seo.content = e.value;
                            })}"
placeholder="請輸入網誌目錄描述">${vm.SEOData.seo.content || ''}</textarea>
                                            </div>
                                            <div class="d-flex flex-column w-100" style="gap:8px">
                                                <div class="d-flex align-items-center position-relative"
                                                     style="gap:4px;font-weight:700;font-size: 16px;">目錄關鍵字
                                                    ${BgWidget.generateTooltipButton(gvc, html `
                                                                <div class="d-flex flex-column"
                                                                     style="color:white;background: #393939;padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;">
                                                                    <div >
                                                                        1.選擇與您的產品或服務高度相關且搜索量高的關鍵字。
                                                                    </div>
                                                                    <div>
                                                                        2.每個關鍵字之間請用半型逗號分隔,例:電子商務,客製化,APP上架。
                                                                    </div>
                                                                    <div>3.建議文字數量不超過99個中文字。</div>

                                                                </div>
                                                            `)}
                                                    ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                                                </div>
                                                <textarea cols="4"
                                                          style="padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                          onchange="${gvc.event((e) => {
                                vm.SEOData.seo.keywords = e.value;
                            })}">${vm.SEOData.seo.keywords || ''}</textarea>
                                            </div>
                                        </div>
                                        <div class="d-flex " style="gap:18px ">
                                            <div class="d-flex flex-column w-50" style="gap: 8px;">
                                                <div class="d-flex align-items-center  position-relative"
                                                     style="gap:4px;font-weight:700;font-size: 16px;">社群分享縮圖
                                                    ${BgWidget.generateTooltipButton(gvc, html `
                                                                <div class="d-flex flex-column"
                                                                     style="color:white;background: #393939;padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;gap:10px;font-size: 16px;">
                                                                    <div>
                                                                        當您在社群媒體上（例：LINE、Facebook）分享商店連結時，將顯示此圖片作為預覽。
                                                                    </div>
                                                                    <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s2sfs4scs6scsdsc_3a295f8cde07e0fd53cb65b549280b4a.png"
                                                                         alt="Q4">
                                                                </div>
                                                            `)}
                                                </div>
                                                <div class="w-100 "
                                                     style="height:191px;display: flex;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                                                     onclick="${gvc.event(() => {
                                imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                    if (urlArray.length > 0) {
                                        vm.SEOData.seo.image = urlArray[0].data;
                                        gvc.notifyDataChange('SEO');
                                    }
                                    else {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                    }
                                }, html `
                                                                     <div class="d-flex flex-column"
                                                                          style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">
                                                                         社群分享縮圖
                                                                     </div>`, { mul: false });
                            })}">
                                                    <img class="${vm.SEOData.seo.image && vm.SEOData.seo.image.length > 0 ? '' : 'd-none'}"
                                                         style="height:calc(100% - 10px);max-width: 100%;"
                                                         src="${vm.SEOData.seo.image}" alt="縮圖error">
                                                    <div class="${vm.SEOData.seo.image && vm.SEOData.seo.image.length > 0 ? 'd-none' : ''}"
                                                         style="padding: 10px;border-radius: 10px;background: #FFF;/* 按鈕 */box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);">
                                                        新增圖片
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>

                                `);
                        }, divCreate: {}
                    };
                })}
                    ${BgWidget.mbContainer(240)}
                    <div class="shadow"
                         style="width: 100%;padding: 14px 16px;background: #FFF; display: flex;justify-content: end;position: fixed;bottom: 0;right: 0;z-index:1;gap:14px;">
                        ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.dataLoading({ visible: true });
                    yield vm.save_seo();
                    dialog.dataLoading({ visible: false });
                    dialog.successMessage({ text: '儲存成功' });
                })), '儲存', 'guide3-5')}
                    </div>
                `);
            }, divCreate: { style: `color:#393939;font-size: 14px;` }
        });
    }
}
window.glitter.setModule(import.meta.url, SeoBlog);
