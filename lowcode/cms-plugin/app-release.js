import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiPageConfig } from '../api/pageConfig.js';
export class AppRelease {
    static main(gvc) {
        const saasConfig = window.parent.saasConfig;
        const cId = gvc.glitter.getUUID();
        let loading = true;
        let postMDRefer = {
            name: '',
            logo: '',
            status: 'no',
            landing_page: '',
            store_name: '',
            store_sub_title: '',
            promote_img: '',
            google_play_promote: '',
            app_store_promote: '',
            description: '',
            copy_right: '',
            keywords: '',
            support_url: '',
            privacy_url: '',
            contact_email: '',
            contact_phone: '',
        };
        function save(delivery, model, callback) {
            const dialog = new ShareDialog(gvc.glitter);
            if (delivery) {
                const key = {
                    name: '請填寫應用名稱',
                    logo: '請上傳APP Logo',
                    status: 'no',
                    landing_page: '請上傳啟動畫面',
                    store_name: '請上傳商店應用名稱',
                    store_sub_title: '請上傳商店應用副標題',
                    promote_img: '請上傳商店宣傳圖片',
                    google_play_promote: '請填寫Google Play宣傳內文',
                    app_store_promote: '請填寫APP Store宣傳內文',
                    description: '請填寫APP描述',
                    copy_right: '請填寫商標與著作權',
                    keywords: '請填寫關鍵字',
                    support_url: '請填寫支援URL',
                    privacy_url: '請填寫隱私權URL',
                    contact_email: '請填寫聯絡信箱',
                    contact_phone: '請填寫聯絡電話',
                };
                for (const b of Object.keys(key)) {
                    if (!postMDRefer[b]) {
                        dialog.errorMessage({ text: key[b] });
                        return;
                    }
                }
                dialog.dataLoading({ visible: true });
                postMDRefer.status = 'wait';
                ApiPageConfig.setPrivateConfigV2({
                    key: 'glitter_app_release',
                    value: JSON.stringify(model),
                    appName: window.parent.appName,
                }).then((r) => {
                    dialog.dataLoading({ visible: false });
                    if (r.response) {
                        postMDRefer = model;
                        callback(true);
                        dialog.successMessage({ text: '送審成功' });
                    }
                    else {
                        callback(false);
                        dialog.errorMessage({ text: '儲存失敗' });
                    }
                });
            }
            else {
                dialog.dataLoading({ visible: true });
                ApiPageConfig.setPrivateConfigV2({
                    key: 'glitter_app_release',
                    value: JSON.stringify(model),
                    appName: window.parent.appName,
                }).then((r) => {
                    dialog.dataLoading({ visible: false });
                    if (r.response) {
                        postMDRefer = model;
                        callback(true);
                        dialog.successMessage({ text: '儲存成功' });
                    }
                    else {
                        callback(false);
                        dialog.errorMessage({ text: '儲存失敗' });
                    }
                });
            }
        }
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_app_release').then((res) => {
            if (res.response.result[0]) {
                postMDRefer = res.response.result[0].value;
            }
            loading = false;
            gvc.notifyDataChange(cId);
        });
        return gvc.bindView(() => {
            return {
                bind: cId,
                view: () => {
                    if (loading) {
                        return BgWidget.spinner();
                    }
                    return BgWidget.container([
                        BgWidget.title(`<div class="d-flex align-items-center" style="gap: 10px;">
APP管理
${(() => {
                            switch (postMDRefer.status) {
                                case 'no':
                                    return ``;
                                case 'error':
                                    return BgWidget.dangerInsignia(`審核未通過`);
                                case 'finish':
                                    return BgWidget.successInsignia(`審核通過`);
                                case 'wait':
                                    return BgWidget.warningInsignia('審核中');
                            }
                        })()}
</div>`),
                        BgWidget.alertInfo(``, [`審核通過時間約莫在7-14天，請確實填寫所有內容，已加快審核進度`], {
                            style: '',
                            class: 'fs-6 fw-500',
                        }),
                        [
                            {
                                title: '品牌內容',
                                editor: (() => {
                                    let postMD = JSON.parse(JSON.stringify(postMDRefer));
                                    const dialog = new ShareDialog(gvc.glitter);
                                    const id = gvc.glitter.getUUID();
                                    const html = String.raw;
                                    return gvc.bindView(() => {
                                        return {
                                            bind: id,
                                            view: () => {
                                                return [
                                                    BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: `<div class="d-flex flex-column" style="gap:3px;">
App 名稱
${BgWidget.grayNote('將展示於APP Logo下方，建議不要超過14個字元')}
</div>`,
                                                        default: postMD.name || '',
                                                        placeHolder: '請輸入APP名稱',
                                                        callback: (text) => {
                                                            postMD.name = text;
                                                        },
                                                    }),
                                                    `<div class="w-100">
<div class="d-flex flex-column mb-2" style="gap:3px;">
APP Logo
${BgWidget.grayNote('圖片上傳尺寸為1024 * 1024')}
</div>
${BgWidget.imageSelector(gvc, postMD.logo, (text) => {
                                                        postMD.logo = text;
                                                        gvc.notifyDataChange(id);
                                                    })}
</div>`,
                                                    `<div class="w-100">
<div class="d-flex flex-column mb-2" style="gap:3px;">
APP啟動畫面
${BgWidget.grayNote('圖片上傳尺寸為1080 * 2400')}
</div>
${BgWidget.imageSelector(gvc, postMD.landing_page, (text) => {
                                                        postMD.landing_page = text;
                                                        gvc.notifyDataChange(id);
                                                    })}
</div>`,
                                                    html ` <div class="w-100 d-flex align-items-center justify-content-end">
                                                            ${BgWidget.cancel(gvc.event(() => {
                                                        save(false, postMD, (result) => { });
                                                    }), '儲存')}
                                                        </div>`,
                                                ].join(`<div class="my-3"></div>`);
                                            },
                                            divCreate: {
                                                class: ``,
                                            },
                                        };
                                    });
                                })(),
                            },
                            {
                                title: '上架資訊',
                                editor: (() => {
                                    let postMD = JSON.parse(JSON.stringify(postMDRefer));
                                    const id = gvc.glitter.getUUID();
                                    return [
                                        gvc.bindView(() => {
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return [
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
App 名稱
${BgWidget.grayNote('顯示在 Apple Store 與 Google Play 商城上的APP名稱')}
</div>`,
                                                            default: postMD.store_name || '',
                                                            placeHolder: '請輸入APP名稱',
                                                            callback: (text) => {
                                                                postMD.store_name = text;
                                                            },
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
App 副標題
${BgWidget.grayNote('請輸入APP副標題')}
</div>`,
                                                            default: postMD.store_sub_title || '',
                                                            placeHolder: '請輸入副標題',
                                                            callback: (text) => {
                                                                postMD.store_sub_title = text;
                                                            },
                                                        }),
                                                        `<div class="w-100">
<div class="d-flex flex-column mb-2" style="gap:3px;">
應用程式商店宣傳圖片
${BgWidget.grayNote('圖片上傳尺寸為1024 * 500')}
</div>
<div class="position-relative">
${BgWidget.imageSelector(gvc, postMD.promote_img, (text) => {
                                                            postMD.promote_img = text;
                                                            gvc.notifyDataChange(id);
                                                        })}
</div>
</div>`,
                                                        BgWidget.textArea({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px; ">
Google Play 簡短說明
${BgWidget.grayNote('「App 的簡短說明」是使用者在 Play 商店瀏覽應用程式時首先看到的文字介紹，讓他們快速了解您的 App 特點。使用者可點擊展開以閱讀完整說明，深入了解更多細節。')}
</div>`,
                                                            default: postMD.google_play_promote || '',
                                                            placeHolder: '請輸入説明內文',
                                                            callback: (text) => {
                                                                postMD.google_play_promote = text;
                                                            },
                                                        }),
                                                        BgWidget.textArea({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px; ">
APP Store 簡短說明
${BgWidget.grayNote('「App 的簡短說明」是使用者在 App Store 瀏覽應用程式詳情時首先看到的文字介紹，讓他們快速了解您的 App 核心功能。使用者可以點擊展開以閱讀完整說明，獲取更多資訊。')}
</div>`,
                                                            default: postMD.app_store_promote || '',
                                                            placeHolder: '請輸入説明內文',
                                                            callback: (text) => {
                                                                postMD.app_store_promote = text;
                                                            },
                                                        }),
                                                        BgWidget.textArea({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px; ">
描述
${BgWidget.grayNote('此段描述將用來詳細介紹 App 的特性和功能，幫助使用者更好地了解您的應用程式提供的價值。請確保內容為純文字格式，無法支援 HTML 標籤或格式化功能。')}
</div>`,
                                                            default: postMD.description || '',
                                                            placeHolder: '請輸入描述',
                                                            callback: (text) => {
                                                                postMD.description = text;
                                                            },
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
版權標示
${BgWidget.grayNote('請提供擁有 App 專有權的個人或公司名稱，格式為獲得專有權的年份加上名稱（例如：“2024 SHOPNEX, Inc.”）。版權符號將會自動添加。')}
</div>`,
                                                            default: postMD.copy_right || '',
                                                            placeHolder: '版權內容',
                                                            callback: (text) => {
                                                                postMD.copy_right = text;
                                                            },
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
應用程式搜尋關鍵詞
${BgWidget.grayNote('請輸入描述 App 的一個或多個關鍵詞（每個關鍵詞至少包含兩個字符），並以逗號分隔。應注意，App 名稱和公司名稱已可被應用程式商店搜尋，因此無需在關鍵字中重複新增。此外，請避免使用其他 App 或公司的名稱。')}
</div>`,
                                                            default: postMD.keywords || '',
                                                            placeHolder: '請輸入關鍵詞',
                                                            callback: (text) => {
                                                                postMD.keywords = text;
                                                            },
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
App 支援網址（URL）
${BgWidget.grayNote('如有疑問，用戶可透過提供的支援網站獲取幫助。該網站應包含真實聯絡資訊，方便用戶就 App 的問題、使用回饋或功能優化提出建議。請提供包含協議的完整網址（例如：http://support.shopnex.cc）。此支援網址將顯示給已購買此 App 的用戶，並僅在 App Store 中顯示。')}
</div>`,
                                                            default: postMD.support_url || '',
                                                            placeHolder: '請輸入網址',
                                                            callback: (text) => {
                                                                postMD.support_url = text;
                                                            },
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
隱私政策網址（URL）
${BgWidget.grayNote('連結到你公司隱私政策的網址（URL）')}
</div>`,
                                                            default: postMD.privacy_url || '',
                                                            placeHolder: '請輸入網址',
                                                            callback: (text) => {
                                                                postMD.privacy_url = text;
                                                            },
                                                        }),
                                                    ].join(`<div class="my-3"></div>`);
                                                },
                                                divCreate: {
                                                    class: ``,
                                                },
                                            };
                                        }),
                                        `<div class="mt-3 w-100 d-flex align-items-center justify-content-end">
                                                            ${BgWidget.cancel(gvc.event(() => {
                                            save(false, postMD, (result) => { });
                                        }), '儲存')}
                                                        </div>`,
                                    ].join(``);
                                })(),
                            },
                            {
                                title: '聯絡資訊',
                                editor: (() => {
                                    let postMD = JSON.parse(JSON.stringify(postMDRefer));
                                    const dialog = new ShareDialog(gvc.glitter);
                                    const id = gvc.glitter.getUUID();
                                    return [
                                        gvc.bindView(() => {
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return [
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
聯絡信箱
${BgWidget.grayNote('承辦人員會透過此信箱與您聯絡')}
</div>`,
                                                            default: postMD.contact_email || '',
                                                            placeHolder: '請輸入信箱',
                                                            callback: (text) => {
                                                                function isValidEmail(email) {
                                                                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                                    return emailPattern.test(email);
                                                                }
                                                                if (isValidEmail(text)) {
                                                                    postMD.contact_email = text;
                                                                }
                                                                else {
                                                                    dialog.errorMessage({ text: '請填寫正確的信箱格式' });
                                                                    gvc.notifyDataChange(id);
                                                                }
                                                            },
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: `<div class="d-flex flex-column" style="gap:3px;">
聯絡電話
${BgWidget.grayNote('承辦人員會透過此電話與您聯絡')}
</div>`,
                                                            default: postMD.contact_phone || '',
                                                            placeHolder: '請輸入電話',
                                                            callback: (text) => {
                                                                function isValidUSPhoneNumber(phoneNumber) {
                                                                    const phonePattern = /^(\+1-?)?(\d{3})?-?\d{3}-?\d{4}$/;
                                                                    return phonePattern.test(phoneNumber);
                                                                }
                                                                if (isValidUSPhoneNumber(text)) {
                                                                    postMD.contact_phone = text;
                                                                }
                                                                else {
                                                                    dialog.errorMessage({ text: '請填寫正確的電話格式' });
                                                                    gvc.notifyDataChange(id);
                                                                }
                                                            },
                                                        }),
                                                    ].join(`<div class="my-3"></div>`);
                                                },
                                                divCreate: {
                                                    class: ``,
                                                },
                                            };
                                        }),
                                        `<div class="mt-3 w-100 d-flex align-items-center justify-content-end">
                                                            ${BgWidget.cancel(gvc.event(() => {
                                            save(false, postMD, (result) => { });
                                        }), '儲存')}
                                                        </div>`,
                                    ].join('');
                                })(),
                            },
                        ]
                            .map((dd) => {
                            return BgWidget.card(`<div class="d-flex flex-column">${BgWidget.title(dd.title, 'font-size:20px;')}
<div class="flex-fill"></div>
<div class="my-3">${dd.editor}</div>
</div>`);
                        })
                            .join(`<div class="my-2"></div>`),
                        `<div class="w-100 d-flex align-items-center justify-content-end">
${BgWidget.save(gvc.event(() => {
                            save(true, postMDRefer, () => { });
                        }), '將APP提交審查')}
</div>`,
                    ].join(`<div class="my-3"></div>`));
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, AppRelease);
