var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShopee } from "../glitter-base/route/shopee.js";
export class MarketShopee {
    static main(gvc) {
        const shopee = localStorage.getItem('shopeeCode');
        if (shopee) {
            const data = JSON.parse(shopee);
            ApiShopee.getToken(data.code, data.shop_id);
            localStorage.removeItem('shopeeCode');
        }
        return (BgWidget.container(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const key = 'marketShopee';
            const vm = {
                loading: true,
                data: {
                    offer_ID: '',
                    advertiser_ID: '',
                    commission: '',
                },
            };
            const html = String.raw;
            ApiUser.getPublicConfig(key, 'manager').then((dd) => {
                vm.loading = false;
                dd.response.value && (vm.data = dd.response.value);
                gvc.notifyDataChange(id);
            });
            gvc.addStyle(html `
                        .shopee-btn {
                        background-color: #FB5533; /* 主橙色 */
                        color: #FFFFFF; /* 白色文字 */
                        border: none; /* 無邊框 */
                        border-radius: 5px; /* 圓角按鍵 */
                        padding: 10px 20px; /* 按鍵內邊距 */
                        font-size: 16px; /* 文字大小 */
                        font-weight: bold; /* 粗體文字 */
                        cursor: pointer; /* 指針樣式 */
                        transition: all 0.3s ease; /* 漸變效果 */
                        }

                        .shopee-btn:hover {
                        background-color: #D94428; /* 深橙色 */
                        }

                        .shopee-btn:active {
                        background-color: #C03D24; /* 更深的橙色 */
                        }
                    `);
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return BgWidget.spinner();
                    }
                    const html = String.raw;
                    return [
                        html `
                                    <div class="title-container">
                                        ${BgWidget.title('蝦皮串接與同步')}
                                        <div class="flex-fill"></div>
                                    </div>`,
                        BgWidget.mbContainer(18),
                        BgWidget.mainCard(html `
                                    <div class="d-flex flex-column" style="gap:12px;">
                                        <div class="tx_700">商店授權</div>
                                        <div>
                                            為了啟用蝦皮相關服務，請點擊下方按鈕進行授權操作。完成授權後，您將可以正常使用所有功能。
                                        </div>
                                    </div>
                                    <button class="shopee-btn mt-3" onclick="${gvc.event(() => {
                            localStorage.setItem("shopee", window.parent.location.href);
                            ApiShopee.generateAuth(window.parent.location.href);
                        })}">授權蝦皮
                                    </button>
                                    <button class="shopee-btn mt-3" onclick="${gvc.event(() => {
                            const today = new Date().toISOString().split('T')[0];
                            let startDate = today;
                            let endDate = today;
                            gvc.glitter.innerDialog((gvc) => {
                                gvc.addStyle(html `

                                                /* 外部容器 */
                                                .shopee-sync {
                                                background: #fff;
                                                border: 1px solid #e0e0e0;
                                                border-radius: 8px;
                                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                                padding: 20px;
                                                width: 300px;
                                                text-align: center;
                                                }

                                                /* 標題樣式 */
                                                .sync-header {
                                                font-size: 18px;
                                                font-weight: bold;
                                                color: #ee4d2d;
                                                margin-bottom: 20px;
                                                }

                                                /* 輸入區域 */
                                                .sync-body {
                                                margin-bottom: 20px;
                                                }

                                                .sync-body label {
                                                display: block;
                                                font-size: 14px;
                                                color: #333;
                                                margin-bottom: 5px;
                                                text-align: left;
                                                }

                                                .sync-input {
                                                width: 100%;
                                                padding: 10px;
                                                font-size: 14px;
                                                border: 1px solid #ddd;
                                                border-radius: 4px;
                                                margin-bottom: 15px;
                                                box-sizing: border-box;
                                                outline: none;
                                                transition: border-color 0.3s;
                                                }

                                                .sync-input:focus {
                                                border-color: #ee4d2d;
                                                }

                                                /* 按鈕樣式 */
                                                .sync-button {
                                                background-color: #ee4d2d;
                                                color: #fff;
                                                font-size: 16px;
                                                font-weight: bold;
                                                padding: 10px 20px;
                                                border: none;
                                                border-radius: 4px;
                                                cursor: pointer;
                                                transition: background-color 0.3s;
                                                width: 100%;
                                                }

                                                .sync-button:hover {
                                                background-color: #d44123;
                                                }

                                                .sync-button:active {
                                                background-color: #b8341b;
                                                }

                                                /* 響應式樣式 */
                                                @media (max-width: 400px) {
                                                .shopee-sync {
                                                width: 90%;
                                                }
                                                }

                                            `);
                                return html `
                                                <div id="date-sync"
                                                     style="position:relative;background: #fff;border: 1px solid #e0e0e0;border-radius: 8px;box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);padding: 20px;width: 300px;text-align: center;">
                                                    <i
                                                            class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                                            style="position: absolute;right: 5px; top: 5px;"
                                                            onclick="${gvc.event(() => {
                                    gvc.closeDialog();
                                })}"
                                                    ></i>
                                                    <div class="sync-header">選擇同步商品的日期區間</div>
                                                    <div class="sync-body">
                                                        <label for="start-date">開始日期：</label>
                                                        <input type="date" id="start-date" value="${startDate}"
                                                               class="sync-input" onchange="${gvc.event((e) => {
                                    startDate = e.value;
                                })}"/>

                                                        <label for="end-date">結束日期：</label>
                                                        <input type="date" id="end-date" value="${endDate}"
                                                               class="sync-input" onchange="${gvc.event((e) => {
                                    if (new Date(startDate) > new Date(endDate)) {
                                        alert('開始日期不能晚於結束日期');
                                        return;
                                    }
                                    endDate = e.value;
                                })}"/>

                                                    </div>

                                                    <button id="confirm-btn" class="sync-button"
                                                            onclick="${gvc.event(() => {
                                    const startTime = Math.floor(new Date(startDate).getTime() / 1000);
                                    const endTime = Math.floor(new Date(endDate).getTime() / 1000);
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.dataLoading({
                                        text: "資料匯入中",
                                        visible: true
                                    });
                                    ApiShopee.getItemList(startTime, endTime, (response) => {
                                        dialog.dataLoading({
                                            text: "資料匯入中",
                                            visible: false
                                        });
                                        console.log("response -- ", response);
                                        if (response.type == "error") {
                                            dialog.infoMessage({
                                                text: `error:${response.message}`
                                            });
                                        }
                                        else {
                                            dialog.infoMessage({
                                                text: `匯入完成`
                                            });
                                            gvc.closeDialog();
                                        }
                                    });
                                })}">確定
                                                    </button>
                                                    
                                                </div>
                                            `;
                            }, 'sync');
                        })}">同步商品
                                    </button>
                                `),
                        BgWidget.mbContainer(18),
                        html `
                                    <div class="update-bar-container">
                                        ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            ApiUser.setPublicConfig({
                                key: key,
                                value: vm.data,
                                user_id: 'manager',
                            }).then(() => {
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({ text: '設定成功' });
                                gvc.closeDialog();
                            });
                        })))}
                                    </div>`,
                    ].join('');
                },
            };
        })) + BgWidget.mbContainer(120));
    }
}
window.glitter.setModule(import.meta.url, MarketShopee);
