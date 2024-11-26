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
import { ApiShop } from "../glitter-base/route/shopping.js";
export class MarketAmerica {
    static main(gvc) {
        return (BgWidget.container(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const key = 'marketAmerica';
            const vm = {
                loading: true,
                data: {
                    offer_ID: '',
                    advertiser_ID: '',
                    commission: '',
                },
            };
            ApiUser.getPublicConfig(key, 'manager').then((dd) => {
                vm.loading = false;
                dd.response.value && (vm.data = dd.response.value);
                gvc.notifyDataChange(id);
            });
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
                                        ${BgWidget.title('美安串接')}
                                        <div class="flex-fill"></div>
                                    </div>`,
                        BgWidget.mbContainer(18),
                        BgWidget.mainCard(html `
                                    <div class="d-flex flex-column" style="gap:12px;">
                                        <div class="tx_700">注意事項</div>
                                        <div>如要與美安進行同步串接，務必確認上傳之商品圖片皆為.jpg格式。</div>
                                    </div>
                                `),
                        BgWidget.mbContainer(18),
                        BgWidget.container(BgWidget.mainCard([
                            html `
                                                <div class="tx_700">串接綁定</div>`,
                            BgWidget.editeInput({
                                gvc: gvc,
                                title: html `
                                                    <div class="d-flex align-items-center" style="gap:10px;">Offer ID
                                                    </div>`,
                                default: vm.data.offer_ID,
                                placeHolder: '請填入Offer ID',
                                callback: (text) => {
                                    vm.data.offer_ID = text;
                                },
                            }),
                            BgWidget.editeInput({
                                gvc: gvc,
                                title: html `
                                                    <div class="d-flex align-items-center" style="gap:10px;">Advertiser
                                                        ID
                                                    </div>`,
                                default: vm.data.advertiser_ID,
                                placeHolder: '請填入Advertiser ID',
                                callback: (text) => {
                                    vm.data.advertiser_ID = text;
                                },
                            }),
                            BgWidget.editeInput({
                                gvc: gvc,
                                title: html `
                                                    <div class="d-flex align-items-center" style="gap:10px;">佣金%數
                                                    </div>`,
                                default: vm.data.commission,
                                type: 'number',
                                placeHolder: '請填入佣金%數',
                                callback: (text) => {
                                    vm.data.commission = text;
                                },
                            }),
                            html `
                                                <div
                                                        onclick="${gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                                const dialog = new ShareDialog(gvc.glitter);
                                const appData = (yield ApiUser.getPublicConfig('store-information', 'manager')).response.value;
                                ApiShop.getProduct({
                                    page: 0,
                                    limit: 1000,
                                    search: '',
                                }).then((data) => {
                                    let printData = data.response.data.map((product) => {
                                        return product.content.variants.map((variant) => {
                                            var _a, _b;
                                            return html `
                                                                        <Product>
                                                                            <SKU>${variant.sku}</SKU>
                                                                            <Name>${product.content.title}</Name>
                                                                            <Description>${appData.shop_name} - ${product.content.title}</Description>
                                                                            <URL>
                                                                                ${`https://` + window.parent.glitter.share.editorViewModel.domain + '/products/' + product.content.title}
                                                                            </URL>
                                                                            <Price>${(_a = variant.compare_price) !== null && _a !== void 0 ? _a : variant.sale_price}</Price>
                                                                            <LargeImage>
                                                                                ${(_b = variant.preview_image) !== null && _b !== void 0 ? _b : ""}
                                                                            </LargeImage>
                                                                            <SalePrice>${variant.sale_price}</SalePrice>
                                                                            <Category>${product.content.collection.join('')}</Category>
                                                                        </Product>
                                                                    `;
                                        }).join('');
                                    }).join('');
                                });
                            }))}"
                                                >
                                                    ${BgWidget.editeInput({
                                readonly: true,
                                gvc: gvc,
                                title: html `
                                                            <div class="d-flex flex-column" style="gap:5px;">
                                                                產品資料XML
                                                            </div>`,
                                default: `https://` + window.parent.glitter.share.editorViewModel.domain + '/tw_shop.xml',
                                placeHolder: '',
                                callback: (text) => {
                                },
                            })}
                                                </div>`
                        ].join(BgWidget.mbContainer(12)))),
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
window.glitter.setModule(import.meta.url, MarketAmerica);
