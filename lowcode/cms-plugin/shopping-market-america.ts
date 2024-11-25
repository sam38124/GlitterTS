import {GVC} from '../glitterBundle/GVController.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {ApiShop} from "../glitter-base/route/shopping.js";

export class MarketAmerica {
    public static main(gvc: GVC) {
        return (
            BgWidget.container(
                gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    const key = 'marketAmerica';
                    const vm: {
                        loading: boolean;
                        data: {
                            offer_ID: string,
                            advertiser_ID: string,
                            commission: string,
                        };
                    } = {
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
                                html`
                                    <div class="title-container">
                                        ${BgWidget.title('美安串接')}
                                        <div class="flex-fill"></div>
                                    </div>`,
                                BgWidget.mbContainer(18),
                                BgWidget.mainCard(html`
                                    <div class="d-flex flex-column" style="gap:12px;">
                                        <div class="tx_700">注意事項</div>
                                        <div>如要與美安進行同步串接，務必確認上傳之商品圖片皆為.jpg格式。</div>
                                    </div>
                                `),
                                BgWidget.mbContainer(18),
                                BgWidget.container(
                                    BgWidget.mainCard(
                                        [
                                            html`
                                                <div class="tx_700">串接綁定</div>`,
                                            BgWidget.editeInput({
                                                gvc: gvc,
                                                title: html`
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
                                                title: html`
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
                                                title: html`
                                                    <div class="d-flex align-items-center" style="gap:10px;">佣金%數
                                                    </div>`,
                                                default: vm.data.commission,
                                                type: 'number',
                                                placeHolder: '請填入佣金%數',
                                                callback: (text) => {
                                                    vm.data.commission = text;
                                                },
                                            }),
                                            html`
                                                <div
                                                        onclick="${gvc.event(async () => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            const appData = (await ApiUser.getPublicConfig('store-information', 'manager')).response.value;
                                                            ApiShop.getProduct({
                                                                page: 0,
                                                                limit: 1000,
                                                                search: '',
                                                            }).then((data) => {
                                                                let printData = data.response.data.map((product: any) => {
                                                                    return product.content.variants.map((variant: any) => {
                                                                        return html`
                                                                        <Product>
                                                                            <SKU>${variant.sku}</SKU>
                                                                            <Name>${product.content.title}</Name>
                                                                            <Description>${appData.shop_name} - ${product.content.title}</Description>
                                                                            <URL>
                                                                                ${`https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/products/' + product.content.title}
                                                                            </URL>
                                                                            <Price>${variant.compare_price??variant.sale_price}</Price>
                                                                            <LargeImage>
                                                                                ${variant.preview_image??""}
                                                                            </LargeImage>
                                                                            <SalePrice>${variant.sale_price}</SalePrice>
                                                                            <Category>${product.content.collection.join('')}</Category>
                                                                        </Product>
                                                                    `
                                                                    }).join('');
                                                                }).join('')
                                                                console.log("printData -- " , printData)
                                                            });
                                                            // navigator.clipboard.writeText(`https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/tw_shop');
                                                            // dialog.successMessage({ text: '已複製至剪貼簿' });
                                                        })}"
                                                >
                                                    ${BgWidget.editeInput({
                                                        readonly: true,
                                                        gvc: gvc,
                                                        title: html`
                                                            <div class="d-flex flex-column" style="gap:5px;">
                                                                產品資料XML
                                                            </div>`,
                                                        default: `https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/tw_shop',
                                                        placeHolder: '',
                                                        callback: (text) => {
                                                        },
                                                    })}
                                                </div>`
                                            ,
                                            BgWidget.editeInput({
                                                gvc: gvc,
                                                title: html`
                                                    <div class="d-flex align-items-center" style="gap:10px;">
                                                        產品資料xml
                                                    </div>`,
                                                default: vm.data.commission,
                                                type: 'number',
                                                placeHolder: '請填入佣金%數',
                                                callback: (text) => {
                                                    vm.data.commission = text;
                                                },
                                            }),
                                        ].join(BgWidget.mbContainer(12))
                                    )
                                ),
                                html`
                                    <div class="update-bar-container">
                                        ${BgWidget.save(
                                                gvc.event(async () => {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    dialog.dataLoading({visible: true});

                                                    ApiUser.setPublicConfig({
                                                        key: key,
                                                        value: vm.data,
                                                        user_id: 'manager',
                                                    }).then(() => {
                                                        dialog.dataLoading({visible: false});
                                                        dialog.successMessage({text: '設定成功'});
                                                        gvc.closeDialog();
                                                    });
                                                })
                                        )}
                                    </div>`,
                            ].join('');
                        },
                    };
                })
            ) + BgWidget.mbContainer(120)
        );
    }
}

(window as any).glitter.setModule(import.meta.url, MarketAmerica);
