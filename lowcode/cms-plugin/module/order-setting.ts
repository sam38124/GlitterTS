import {GVC} from "../../glitterBundle/GVController.js";
import {Variant} from "./product-excel.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";
import {Tool} from "../../modules/tool.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {ShareDialog} from "../../dialog/ShareDialog.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";

export class OrderSetting {
    public static showEditShip(obj: {
        gvc: GVC,
        postMD: any,
        callback?: () => void
    }) {
        let stockList: any = [];

        function getPreviewImage(img?: string) {
            return img || BgWidget.noImageURL;
        }

        const html = String.raw;
        let loading = true;
        let postMD = obj.postMD;
        let topGVC = (window.parent as any).glitter.pageConfig[(window.parent as any).glitter.pageConfig.length - 1].gvc

        ApiShop.getProduct({
            limit: 99,
            page: 0,
            id: postMD.map((dd: any) => {
                return dd.id;
            })
        }).then(r =>{
            console.log("r -- " , r)
        })
        topGVC.glitter.innerDialog((gvc: GVC) => {
            function getStockStore() {
                if (stockList.length == 0) {
                    ApiUser.getPublicConfig('store_manager',
                        'manager'
                    ).then((storeData: any) => {
                        if (storeData.result) {
                            stockList = storeData.response.value.list;
                            loading = false;
                            gvc.notifyDataChange('editDialog');
                        }
                    })
                }
            }

            let loading = true
            let dialog = new ShareDialog(topGVC.glitter);
            let origData = JSON.parse(JSON.stringify(postMD))
            // getStockStore()
            let selected:any[] = [];
            return gvc.bindView({
                bind: "editDialog",
                view: () => {
                    const titleLength = 300;
                    const elementLength = 120;

                    return html`
                        <div class="d-flex flex-column position-relative"
                             style="width: 70%;height:70%;background:white;border-radius: 10px;">
                            <div class="d-flex align-items-center"
                                 style="height: 60px;width: 100%;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;background: #F2F2F2;">
                                
                                <div class="flex-fill"
                                     style="padding: 19px 32px;">
                                    分倉出貨
                                </div>
                            </div>
                            <div class="overflow-scroll" style="padding:24px 32px;">
                                <div class="d-flex " style="margin-bottom:24px;gap:24px;">
                                    ${(() => {
                                        type TitleItem = {
                                            title: string;
                                            width: string;
                                        };
                                        let titleArray: TitleItem[] = [
                                            {
                                                title: "商品",
                                                width: `${titleLength}px`
                                            },  {
                                                title: "下單數量",
                                                width: `${elementLength}px`
                                            }, {
                                                title: "庫存",
                                                width: `${elementLength}px`
                                            }, 
                                        ];
                                        
                                        function insertSubStocks(titleArray: TitleItem[], subStocks: string[]): TitleItem[] {
                                            const targetIndex = titleArray.findIndex(item => item.title === "庫存");
                                            if (targetIndex !== -1) {
                                                subStocks.unshift("庫存政策")
                                                // 格式化細分庫存
                                                const formattedSubStocks: TitleItem[] = subStocks.map(stockTitle => ({
                                                    title: stockTitle,
                                                    width: titleArray[targetIndex].width // 使用原"庫存"的寬度
                                                }));
                                                
                                                // 替換 "庫存" 為細分庫存
                                                titleArray.splice(targetIndex, 1, ...formattedSubStocks);
                                            }
                                            return titleArray;
                                        }

                                        titleArray = insertSubStocks(titleArray, stockList.map((item: any) => {
                                            return item.name
                                        }));
                                        return titleArray.map((title) => {
                                            return html`
                                                <div class="d-flex flex-shrink-0   ${(title.title!='商品'?'justify-content-end':'')}"
                                                     style="width:${title.width};font-size: 16px;font-style: normal;font-weight: 700;">
                                                    ${title.title}
                                                </div>
                                            `
                                        }).join('')
                                    })()}
                                </div>
                                <div class="d-flex flex-column" style="margin-bottom:80px;gap:24px;">
                                    ${(() => {
                                        return postMD.map((item: any) => {
                                           
                                            if (item.deduction_log && Object.keys(item.deduction_log).length === 0) {
                                                console.log("deduction_log 是空物件");
                                                return
                                            }
                                            return html`
                                            <div class="d-flex align-items-center" style="gap:24px;">
                                                <div class="d-flex align-items-center" style="width: ${titleLength}px;gap: 12px">
                                                    <img style="height: 54px;width: 54px;border-radius: 5px;" src="${item.preview_image}">
                                                    <div class="d-flex flex-column" style="gap: 2px;font-size: 16px;">
                                                        <div>${item.title}</div>
                                                        <div style="color: #8D8D8D;font-size: 14px;">${(item.spec.length == 0?`單一規格`:item.spec.join(`,`))}</div>
                                                        <div style="color: #8D8D8D;font-size: 14px;">存貨單位 (SKU): ${item.sku}</div>
                                                    </div>
                                                </div>
                                                <div class="d-flex align-items-center justify-content-end" style="width: ${elementLength}px;gap: 12px">
                                                    ${item.count}
                                                </div>
                                            </div>
                                            ` 
                                        }).join('')
                                    })()}
                                </div>
                            </div>
                            <div class="w-100 justify-content-end d-flex bg-white"
                                 style="margin-top:100px;position: absolute;left: 0;bottom: 20px;gap:14px;padding-right:24px;">
                                ${BgWidget.cancel(
                                        gvc.event(() => {
                                            postMD = origData;
                                            topGVC.glitter.closeDiaLog();
                                        })
                                )}
                                ${BgWidget.save(gvc.event(() => {
                                    topGVC.glitter.closeDiaLog();

                                    if (obj.callback) {
                                        obj.callback();
                                    }
                                }))}
                            </div>
                        </div>
                    `
                },
                divCreate: {style:`width: 100vw;height:100vh;`,class:`d-flex align-items-center justify-content-center`},
                onCreate: () => {

                }
            })

        }, "batchEdit");
    }
}