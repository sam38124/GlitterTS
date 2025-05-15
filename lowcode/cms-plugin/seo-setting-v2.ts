import {GVC} from "../glitterBundle/GVController.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import {BaseApi} from "../glitterBundle/api/base.js";
import {config} from "../config.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {imageLibrary} from "../modules/image-library.js";
import {LanguageBackend} from "./language-backend.js";


export class SeoSettingV2 {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const html = String.raw;
        const vm: {
            id: string;
            tableId: string;
            filterId: string;
            type: 'list' | 'add' | 'replace';
            data: any;
            SEOData: any,
            domain: any,
            dataList: any;
            query?: string;
            mainLoading: boolean;
            SEOLoading: boolean;
            domainLoading: boolean;
            save_seo: () => Promise<any>,
            language: string,
            robots:string
        } = {
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
                return new Promise<any>(() => {
                })
            },
            language: (window.parent as any).store_info.language_setting.def,
            robots:''
        };
        const dialog = new ShareDialog(gvc.glitter);

        async function getSEOData() {
            const appName = (window.parent as any).saasConfig.config.appName
            return await BaseApi.create({
                "url": config.url + `/api/v1/template?appName=${appName}&tag=index`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": config.token,
                    "language":vm.language
                },
            })
        }

        async function setSEOData(passData: any): Promise<any> {
            const appName = (window.parent as any).saasConfig.config.appName;
            dialog.dataLoading({visible: true})
            return new Promise(async (resolve, reject) => {
                const page_config = (await getSEOData()).response.result[0].page_config;
                page_config.seo = passData.seo;
                await ApiUser.setPublicConfig({
                    key:'robots_text',
                    user_id:'manager',
                    value:{text:vm.robots}
                });
                (await BaseApi.create({
                    "url": config.url + `/api/v1/template`,
                    "type": "PUT",
                    "headers": {
                        "Content-Type": "application/json",
                        'g-app': appName,
                        "Authorization": (window.parent as any).saasConfig.config.token,
                        "language":vm.language
                    },
                    data: JSON.stringify({
                        "page_config": page_config,
                        "appName": appName,
                        "tag": "index"
                    })
                }));
                resolve(true)
            })
        }

        function loadData() {
            vm.mainLoading = true;
            gvc.notifyDataChange(vm.id)
            getSEOData().then(async (r) => {
                const data = r.response.result[0].page_config.seo;
                vm.SEOData = {
                    "seo": {
                        "code": data.code ?? "",
                        "type": data.type ?? "custom",
                        "image": data.image ?? "",
                        "logo": data.logo ?? "",
                        "title": data.title ?? "",
                        "content": data.content ?? "",
                        "keywords": data.keywords ?? "",
                        "title_prefix":data.title_prefix ?? '',
                        'title_suffix':data.title_suffix ?? ''
                    },
                    "list": [],
                    "version": "v2",
                    "formData": {},
                    "formFormat": [],
                    "resource_from": "global",
                    "globalStyleTag": [],
                    "support_editor": "true"
                }
                vm.mainLoading = false;
                const ro_=(await ApiUser.getPublicConfig('robots_text','manager')).response.value
                    vm.robots=ro_.text || ''
                gvc.notifyDataChange(vm.id)
            })
        }
        loadData()
        return gvc.bindView({
            bind: vm.id,
            dataList: [{obj: vm, key: 'type'}],
            view: () => {
                if(vm.mainLoading){
                    return  BgWidget.spinner()
                }
                return BgWidget.container(html`
                    <div class="title-container mb-4">
                        ${BgWidget.title(`SEO設定`)}
                        <div class="flex-fill"></div>
                        ${LanguageBackend.switchBtn({
                            gvc: gvc,
                            language: vm.language as any,
                            callback: (language) => {
                                vm.language = language
                                loadData()
                            }
                        })}
                    </div>

                    ${gvc.bindView(() => {
                        return {
                            bind: `SEO`,
                            view: () => {
                                
                                vm.save_seo = () => {
                                    return setSEOData(vm.SEOData)
                                }
                                let QShow = [false, false, false, false]
                                return BgWidget.mainCard(html`
                                    <div class="d-flex flex-column" style="gap:18px;">
                                        ${BgWidget.editeInput({
                                            gvc: gvc,
                                            title: 'SEO標題'+BgWidget.languageInsignia(vm.language as any,'margin-left:5px;'),
                                            default: vm.SEOData.seo.title,
                                            callback: (text) => {
                                                vm.SEOData.seo.title = text;
                                            },
                                            placeHolder: '請輸入SEO標題',
                                            divStyle: "width:100%;",
                                            titleStyle: "font-weight:700!important;"
                                        })}
<div class="d-flex align-items-center" style="gap:10px;">
    <div  style="flex: 1;">${BgWidget.editeInput({
        gvc: gvc,
        title: '統一標題前綴'+BgWidget.languageInsignia(vm.language as any,'margin-left:5px;'),
        default: vm.SEOData.seo.title_prefix,
        callback: (text) => {
            vm.SEOData.seo.title_prefix = text;
        },
        placeHolder: '請輸入SEO標題前綴',
        divStyle: "width:100%;",
        titleStyle: "font-weight:700!important;"
    })}</div>
    <div  style="flex: 1;">${BgWidget.editeInput({
        gvc: gvc,
        title: '統一標題後綴'+BgWidget.languageInsignia(vm.language as any,'margin-left:5px;'),
        default: vm.SEOData.seo.title_suffix,
        callback: (text) => {
            vm.SEOData.seo.title_suffix = text;
        },
        placeHolder: '請輸入SEO標題後綴',
        divStyle: "width:100%;",
        titleStyle: "font-weight:700!important;"
    })}</div>
</div>
                                        <div class="d-flex flex-column" style="gap:18px ">
                                            <div class="d-flex flex-column w-100" style="gap: 8px;">
                                                <div class="d-flex align-items-center  "
                                                     style="gap:4px;font-weight:700;font-size: 16px;">SEO描述
                                                    ${BgWidget.generateTooltipButton(
                                                            gvc,
                                                            html`
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
                                                            `
                                                    )}
${BgWidget.languageInsignia(vm.language as any,'margin-left:5px;')}
                                                </div>
                                                <textarea cols="4"
                                                          style="padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                          onchange="${gvc.event((e) => {
                                                              vm.SEOData.seo.content = e.value
                                                          })}">${vm.SEOData.seo.content || ''}</textarea>
                                            </div>
                                            <div class="d-flex flex-column w-100" style="gap:8px">
                                                <div class="d-flex align-items-center position-relative"
                                                     style="gap:4px;font-weight:700;font-size: 16px;">SEO關鍵字
                                                    ${BgWidget.generateTooltipButton(
                                                            gvc,
                                                            html`
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
                                                            `
                                                    )}
                                                    ${BgWidget.languageInsignia(vm.language as any,'margin-left:5px;')}
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
                                                    ${BgWidget.generateTooltipButton(
                                                            gvc,
                                                            html`
                                                                <div class="d-flex flex-column"
                                                                     style="color:white;background: #393939;padding: 12px 18px;border-radius: 10px;border: 1px solid #DDD;gap:10px;font-size: 16px;">
                                                                    <div>
                                                                        當您在社群媒體上（例：LINE、Facebook）分享商店連結時，將顯示此圖片作為預覽。
                                                                    </div>
                                                                    <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s2sfs4scs6scsdsc_3a295f8cde07e0fd53cb65b549280b4a.png"
                                                                         alt="Q4">
                                                                </div>
                                                            `
                                                    )}
                                                </div>
                                                <div class="w-100 "
                                                     style="height:191px;display: flex;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                     onclick="${gvc.event(() => {
                                                         imageLibrary.selectImageLibrary(
                                                                 gvc,
                                                                 (urlArray) => {
                                                                     if (urlArray.length > 0) {
                                                                         vm.SEOData.seo.image = urlArray[0].data;
                                                                         gvc.notifyDataChange('SEO');
                                                                     } else {
                                                                         const dialog = new ShareDialog(gvc.glitter);
                                                                         dialog.errorMessage({text: '請選擇至少一張圖片'});
                                                                     }
                                                                 },
                                                                 html`
                                                                     <div class="d-flex flex-column"
                                                                          style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">
                                                                         社群分享縮圖
                                                                     </div>`,
                                                                 {mul: false}
                                                         );
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
                                            <div class="d-flex flex-column w-50" style="gap:8px">
                                                <div class="d-flex align-items-center position-relative"
                                                     style="gap:4px;font-weight:700;font-size: 16px;">網址旁小圖示
                                                    ${BgWidget.generateTooltipButton(
                                                            gvc,
                                                            html`
                                                                <div class="d-flex flex-column">
                                                                    <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716793630046-favicon.jpg"
                                                                         alt="Q4">
                                                                </div>
                                                            `
                                                    )}
                                                </div>
                                                <div class="w-100 "
                                                     style="height:191px; display: flex;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                     onclick="${gvc.event(() => {
                                                         imageLibrary.selectImageLibrary(
                                                                 gvc,
                                                                 (urlArray) => {
                                                                     if (urlArray.length > 0) {
                                                                         vm.SEOData.seo.logo = urlArray[0].data;
                                                                         gvc.notifyDataChange('SEO')
                                                                     } else {
                                                                         const dialog = new ShareDialog(gvc.glitter);
                                                                         dialog.errorMessage({text: '請選擇至少一張圖片'});
                                                                     }
                                                                 },
                                                                 html`
                                                                     <div class="d-flex flex-column"
                                                                          style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">
                                                                         社群分享縮圖
                                                                     </div>`,
                                                                 {mul: false}
                                                         );
                                                     })}">
                                                    <img class="${vm.SEOData.seo.logo && vm.SEOData.seo.logo.length > 0 ? '' : 'd-none'}"
                                                         style="height:calc(100% - 10px);max-width: 100%;"
                                                         src="${vm.SEOData.seo.logo}" alt="縮圖error">
                                                    <div class="${vm.SEOData.seo.logo && vm.SEOData.seo.logo.length > 0 ? 'd-none' : ''}"
                                                         style="padding: 10px;border-radius: 10px;background: #FFF;/* 按鈕 */box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);">
                                                        新增圖片
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        ${BgWidget.textArea({
                                            gvc: gvc,
                                            title: `<div class="d-flex align-items-center"><div class="tx_normal fw-bold" >自訂代碼區塊</div>${BgWidget.languageInsignia(vm.language as any,'margin-left:5px;')}</div>`,
                                            default: vm.SEOData.seo.code,
                                            callback: (text) => {
                                                vm.SEOData.seo.code = text;
                                            },
                                            placeHolder: ' ( GOOGLE SEARCH CONSOLE , 網域驗證 , GA埋點 , 外部插件串接 ...等)',
                                        })}
                                        ${BgWidget.textArea({
                                            gvc: gvc,
                                            title: `<div class="d-flex flex-column mb-n2" style="gap:5px;">
<div class="d-flex align-items-center"><div class="tx_normal fw-bold" >自訂Robots.txt</div></div>
${BgWidget.grayNote('未輸入則參照系統預設')}
</div>`,
                                            default: vm.robots || ``,
                                            callback: (text) => {
                                                vm.robots = text;
                                            },
                                            placeHolder: `User-agent: * \nSitemap: https://${(window.parent as any).glitter.share.editorViewModel.domain}/sitemap.xml`,
                                        })}
                                    </div>

                                `)
                            }, divCreate: {}
                        }
                    })}
                    ${BgWidget.mbContainer(240)}
                    <div class="shadow"
                         style="width: 100%;padding: 14px 16px;background: #FFF; display: flex;justify-content: end;position: fixed;bottom: 0;right: 0;z-index:1;gap:14px;">
                        ${BgWidget.save(
                                gvc.event(async () => {
                                    const dialog = new ShareDialog(gvc.glitter)
                                    dialog.dataLoading({visible: true})
                                    await vm.save_seo()
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
}

(window as any).glitter.setModule(import.meta.url, SeoSettingV2);