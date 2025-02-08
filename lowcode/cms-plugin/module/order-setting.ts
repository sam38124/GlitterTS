import { GVC } from '../../glitterBundle/GVController.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ShareDialog } from '../../dialog/ShareDialog.js';

const html = String.raw;
const css = String.raw;

type TitleItem = {
    title: string;
    width: string;
};

export class OrderSetting {
    static showEditShip(obj: { gvc: GVC; postMD: any; productData: any; callback?: () => void }) {
        let stockList: any = [];
        let loading = true;
        let productLoading = false;
        let postMD = obj.postMD;
        let productData: any = obj.productData;
        let topGVC = (window.parent as any).glitter.pageConfig[(window.parent as any).glitter.pageConfig.length - 1].gvc;

        topGVC.glitter.innerDialog((gvc: GVC) => {
            function getStockStore() {
                if (stockList.length == 0) {
                    ApiUser.getPublicConfig('store_manager', 'manager').then((storeData: any) => {
                        if (storeData.result) {
                            stockList = storeData.response.value.list;
                            loading = false;
                            if (!loading && !productLoading) {
                                gvc.notifyDataChange('editDialog');
                            }
                        }
                    });
                }
            }

            let dialog = new ShareDialog(topGVC.glitter);
            let origData = JSON.parse(JSON.stringify(postMD));
            getStockStore();

            return gvc.bindView({
                bind: 'editDialog',
                view: () => {
                    const titleLength = 250;
                    const elementLength = 100;
                    if (loading && productLoading) {
                        dialog.dataLoading({ visible: true });
                        return '';
                    } else {
                        dialog.dataLoading({ visible: false });
                    }
                    if (!productLoading) {
                        postMD.map((dd: any) => {
                            const product = productData.find((product: any) => product.id == dd.id);
                            if (product) {
                                const variant = product.content.variants.find((variant: any) => {
                                    return JSON.stringify(variant.spec) == JSON.stringify(dd.spec);
                                });
                                dd.stockList = variant.stockList;
                            }
                        });
                    }

                    gvc.addStyle(`
                        .scrollbar-appear::-webkit-scrollbar {
                            width: 10px;
                            height: 10px;
                        }
                        .scrollbar-appear::-webkit-scrollbar-thumb {
                            background: #666;
                            border-radius: 20px;
                        }
                        .scrollbar-appear::-webkit-scrollbar-track {
                            border-radius: 20px;
                            background: #d8d8d8;
                        }
                        .scrollbar-appear {
                        }
                    `);

                    return html`
                        <div class="d-flex flex-column position-relative" style="width: 80%;height:70%;background:white;border-radius: 10px;">
                            <div
                                class="d-flex align-items-center"
                                style="height: 60px;width: 100%;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;background: #F2F2F2;border-radius: 10px 10px 0px 0px;"
                            >
                                <div class="flex-fill" style="padding: 19px 32px;">分倉出貨</div>
                            </div>
                            <div class="overflow-scroll scrollbar-appear flex-fill" style="padding:20px;">
                                <div class="d-flex " style="margin-bottom:16px;gap:44px;position: relative;">
                                    <div class="d-flex flex-shrink-0 align-items-center " style="width:${titleLength}px;font-size: 16px;font-style: normal;font-weight: 700;">商品</div>
                                    ${(() => {
                                        let titleArray: TitleItem[] = [
                                            {
                                                title: '下單數量',
                                                width: `${elementLength}px`,
                                            },
                                            {
                                                title: '庫存',
                                                width: `${elementLength}px`,
                                            },
                                        ];

                                        function insertSubStocks(titleArray: TitleItem[], subStocks: string[]): TitleItem[] {
                                            const targetIndex = titleArray.findIndex((item) => item.title === '庫存');
                                            if (targetIndex !== -1) {
                                                // 格式化細分庫存
                                                const formattedSubStocks: TitleItem[] = subStocks.map((stockTitle) => ({
                                                    title: stockTitle,
                                                    width: titleArray[targetIndex].width, // 使用原"庫存"的寬度
                                                }));

                                                // 替換 "庫存" 為細分庫存
                                                titleArray.splice(targetIndex, 1, ...formattedSubStocks);
                                            }
                                            return titleArray;
                                        }

                                        titleArray = insertSubStocks(
                                            titleArray,
                                            stockList.flatMap((item: any) => {
                                                return [
                                                    html` <div class="d-flex flex-column" style="text-align: center;gap:5px;">${item.name}${BgWidget.warningInsignia('庫存數量')}</div>`,
                                                    html` <div class="d-flex flex-column" style="text-align: center;gap:5px;">${item.name}<br />${BgWidget.infoInsignia('出貨數量')}</div>`,
                                                ];
                                            })
                                        );
                                        return titleArray
                                            .map((title) => {
                                                return html`
                                                    <div
                                                        class="d-flex flex-shrink-0 align-items-center ${title.title == '下單數量' ? 'justify-content-end' : ''} ${title.title != '商品' &&
                                                        title.title != '下單數量'
                                                            ? 'justify-content-center'
                                                            : ''}"
                                                        style="width:${title.width};font-size: 16px;font-style: normal;font-weight: 700;;${title.title == '商品'
                                                            ? 'position:absolute;left: 0;top: 0;'
                                                            : ''}"
                                                    >
                                                        ${title.title}
                                                    </div>
                                                `;
                                            })
                                            .join('');
                                    })()}
                                </div>
                                ${(() => {
                                    const id = topGVC.glitter.getUUID();
                                    return gvc.bindView({
                                        bind: id,
                                        view: () => {
                                            return postMD
                                                .map((item: any) => {
                                                    if (item.deduction_log && Object.keys(item.deduction_log).length === 0) {
                                                        return;
                                                    }
                                                    return html`
                                                        <div class="d-flex align-items-center" style="gap:44px;">
                                                            <div class="d-flex align-items-center flex-shrink-0" style="width: ${titleLength}px;gap: 12px">
                                                                <img style="height: 54px;width: 54px;border-radius: 5px;" src="${item.preview_image}" />
                                                                <div class="d-flex flex-column" style="font-size: 16px;">
                                                                    <div>${item.title}</div>
                                                                    <div style="color: #8D8D8D;font-size: 14px;">${item.spec.length == 0 ? `單一規格` : item.spec.join(`,`)}</div>
                                                                    <div style="color: #8D8D8D;font-size: 14px;">存貨單位 (SKU): ${item.sku}</div>
                                                                </div>
                                                            </div>
                                                            <div class="d-flex align-items-center justify-content-end flex-shrink-0" style="width: ${elementLength}px;gap: 12px">${item.count}</div>
                                                            ${stockList
                                                                .flatMap((stock: any) => {
                                                                    const limit = item.stockList?.[stock.id]?.count ?? 0;
                                                                    return [
                                                                        html` <div class="d-flex align-items-center justify-content-end flex-shrink-0" style="width: ${elementLength}px;gap: 12px;">
                                                                            ${parseInt(limit)}
                                                                        </div>`,
                                                                        html` <div class="d-flex align-items-center justify-content-end flex-shrink-0" style="width: ${elementLength}px;gap: 12px">
                                                                            <input
                                                                                class="w-100"
                                                                                style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;text-align: center;padding:0 18px;height:40px;"
                                                                                max="${limit + (item.deduction_log[stock.id] ?? 0)}"
                                                                                min="0"
                                                                                value="${item.deduction_log[stock.id] ?? 0}"
                                                                                type="number"
                                                                                onchange="${gvc.event((e: any) => {
                                                                                    const originalDeduction = item.deduction_log[stock.id] ?? 0;
                                                                                    item.deduction_log[stock.id] = 0;

                                                                                    /// 明確指定 item.deduction_log 的型別為 Record<string, number>
                                                                                    const totalDeducted = Object.values(item.deduction_log as Record<string, number>).reduce(
                                                                                        (total, deduction) => total + deduction,
                                                                                        0
                                                                                    );
                                                                                    const remainingStock = item.count - totalDeducted;

                                                                                    // 限制輸入值不超過剩餘庫存
                                                                                    const newDeduction = Math.min(parseInt(e.value), remainingStock);

                                                                                    // 更新扣除紀錄
                                                                                    item.deduction_log[stock.id] = newDeduction;

                                                                                    // 如果有變更，更新庫存數量
                                                                                    if (originalDeduction !== newDeduction) {
                                                                                        const stockDiff = newDeduction - originalDeduction;
                                                                                        item.stockList[stock.id]!.count -= stockDiff;
                                                                                    }

                                                                                    gvc.notifyDataChange(id);
                                                                                })}"
                                                                            />
                                                                        </div>`,
                                                                    ];
                                                                })
                                                                .join('')}
                                                        </div>
                                                    `;
                                                })
                                                .join('');
                                        },
                                        divCreate: { class: 'd-flex flex-column', style: 'margin-bottom:80px;gap:12px;' },
                                    });
                                })()}
                            </div>
                            <div class="w-100 justify-content-end d-flex bg-white" style="gap:14px;padding-right:24px;padding-bottom:20px;padding-top: 10px;border-radius: 0px 0px 10px 10px;">
                                ${BgWidget.cancel(
                                    gvc.event(() => {
                                        postMD = origData;
                                        topGVC.glitter.closeDiaLog();
                                    })
                                )}
                                ${BgWidget.save(
                                    gvc.event(() => {
                                        const errorProducts: string[] = [];
                                        const hasError = postMD.some((product: any) => {
                                            const totalDeduction = Object.values(product.deduction_log as Record<string, number>).reduce((sum, value) => sum + value, 0);

                                            if (Object.keys(product.deduction_log).length && totalDeduction !== product.count) {
                                                errorProducts.push(`${product.title} - ${product.spec.join(',')}`);
                                                return true; // 偵測到錯誤
                                            }
                                            return false;
                                        });

                                        if (hasError) {
                                            dialog.errorMessage({
                                                text: html`<div class="d-flex flex-column">出貨數量異常</div>`,
                                            });
                                        } else {
                                            topGVC.glitter.closeDiaLog();
                                            obj.callback?.(); // 簡化 callback 呼叫
                                        }
                                    })
                                )}
                            </div>
                        </div>
                    `;
                },
                divCreate: {
                    class: `d-flex align-items-center justify-content-center`,
                    style: `width: 100vw; height: 100vh;`,
                },
                onCreate: () => {},
            });
        }, 'batchEdit');
    }

    static combineOrders(topGVC: GVC, dataArray: CartData[]) {
        const parentPageConfig = (window.parent as any)?.glitter?.pageConfig;
        const latestPageConfig = parentPageConfig?.[parentPageConfig.length - 1];
        const ogvc = latestPageConfig?.gvc || topGVC;
        const glitter = ogvc.glitter;

        const vm = {
            originDataArray: JSON.parse(JSON.stringify(dataArray)),
            prefix: 'combine-orders',
        };

        const ids = {
            page: glitter.getUUID(),
        };

        const gClass = (name: string) => `${vm.prefix}-${name}`;

        const closeDialog = () => glitter.closeDiaLog();

        const applyClass = () => {
            ogvc.addStyle(`
                .scrollbar-appear::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .scrollbar-appear::-webkit-scrollbar-thumb {
                    background: #666;
                    border-radius: 20px;
                }
                .scrollbar-appear::-webkit-scrollbar-track {
                    border-radius: 20px;
                    background: #d8d8d8;
                }
                .${vm.prefix}-full-screen {
                    width: 100vw;
                    height: 100vh;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background-color: white;
                    z-index: 1;
                }
                .${vm.prefix}-header {
                    height: 60px;
                    border-bottom: 1px solid #ddd;
                    font-size: 16px;
                    font-weight: 700;
                    color: #393939;
                    background-color: white;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .${vm.prefix}-back-btn {
                    padding: 19px 32px;
                    gap: 8px;
                    cursor: pointer;
                    border-right: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                }
                .${vm.prefix}-title {
                    padding: 19px 32px;
                }
                .${vm.prefix}-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding: 14px 16px;
                    gap: 14px;
                    background-color: white;
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                }
            `);
        };

        const renderHeader = (gvc: GVC) => html`
            <div class="d-flex align-items-center ${gClass('header')}">
                <div class="${gClass('back-btn')}" onclick="${gvc.event(closeDialog)}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M13.79 4.96L8.03 10.72C7.69 11.06 7.5 11.52 7.5 12s.19.94.53 1.28l5.76 5.76c.3.3.7.46 1.12.46.88 0 1.59-.71 1.59-1.59V15h6c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-6V6.09c0-.88-.71-1.59-1.59-1.59-.42 0-.82.16-1.12.46ZM7.5 19.5h-3c-.83 0-1.5-.67-1.5-1.5V6c0-.83.67-1.5 1.5-1.5h3C8.33 4.5 9 3.83 9 3s-.67-1.5-1.5-1.5h-3C2.02 1.5 0 3.52 0 6v12c0 2.48 2.02 4.5 4.5 4.5h3c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5Z"
                            fill="#393939"
                        />
                    </svg>
                    返回
                </div>
                <div class="flex-fill ${gClass('title')}">合併 ${dataArray.length} 個訂單</div>
            </div>
        `;

        const handleSave = () => {
            closeDialog();
            console.log('save');
        };

        const handleCancel = () => {
            closeDialog();
            console.log('cancel');
        };

        const renderFooter = (gvc: GVC) => html` <div class="${gClass('footer')}">${BgWidget.cancel(gvc.event(handleCancel))} ${BgWidget.save(gvc.event(handleSave))}</div> `;

        const renderContent = (gvc: GVC) => {
            return html` <div>renderContent</div> `;
        };

        glitter.innerDialog((gvc: GVC) => {
            applyClass();
            return gvc.bindView({
                bind: ids.page,
                view: () => html`
                    <div class="d-flex flex-column ${gClass('full-screen')}">
                        ${renderHeader(gvc)}
                        <div class="flex-fill overflow-scroll scrollbar-appear" style="padding: 24px 32px;">${renderContent(gvc)}</div>
                        ${renderFooter(gvc)}
                    </div>
                `,
                divCreate: {},
                onCreate: () => {},
            });
        }, 'combineOrders');
    }
}
