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
        let productLoading = true
        let postMD = obj.postMD;
        let productData:any={}
        let topGVC = (window.parent as any).glitter.pageConfig[(window.parent as any).glitter.pageConfig.length - 1].gvc
        const dialog = new ShareDialog(obj.gvc.glitter);

        topGVC.glitter.innerDialog((gvc: GVC) => {

            function getStockStore() {
                if (stockList.length == 0) {
                    ApiUser.getPublicConfig('store_manager',
                        'manager'
                    ).then((storeData: any) => {
                        if (storeData.result) {
                            stockList = storeData.response.value.list;
                            loading = false;
                            if (!loading && !productLoading){
                                gvc.notifyDataChange('editDialog');
                            }

                        }
                    })
                }
                ApiShop.getProduct({
                    limit: 99,
                    page: 0,
                    productType:"all",
                    id_list: postMD.map((dd: any) => {
                        return dd.id;
                    })
                }).then(r => {
                    productLoading = false;

                    productData = r.response.data;
                    if (!loading && !productLoading){
                        gvc.notifyDataChange('editDialog');
                    }
                })
            }


            let dialog = new ShareDialog(topGVC.glitter);
            let origData = JSON.parse(JSON.stringify(postMD))
            getStockStore()
            let selected: any[] = [];
            return gvc.bindView({
                bind: "editDialog",
                view: () => {
                    const titleLength = 250;
                    const elementLength = 100;
                    if (loading && productLoading){
                        dialog.dataLoading({
                            visible:true
                        })
                        return ``
                    }else {
                        dialog.dataLoading({
                            visible:false
                        })
                    }

                    if (!productLoading){
                        postMD.map((dd: any) => {
                            const product = productData.find((product: any) => {
                                return product.id == dd.id;
                            })
                            if (product){
                                const variant = product.content.variants.find((variant: any) => {
                                    return JSON.stringify(variant.spec)  == JSON.stringify(dd.spec)
                                })
                                dd.stockList = variant.stockList;
                            }


                        })

                    }

                    return html`
                        <div class="d-flex flex-column position-relative"
                             style="width: 80%;height:70%;background:white;border-radius: 10px;">
                            <div class="d-flex align-items-center"
                                 style="height: 60px;width: 100%;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;background: #F2F2F2;border-radius: 10px 10px 0px 0px;">

                                <div class="flex-fill"
                                     style="padding: 19px 32px;">
                                    分倉出貨
                                </div>
                            </div>
                            <div class="overflow-scroll" style="padding:20px;margin-right:30px;">
                                <div class="d-flex "
                                     style="margin-bottom:16px;gap:44px;position: relative;">
                                    <div class="d-flex flex-shrink-0 align-items-center "
                                         style="width:${titleLength}px;font-size: 16px;font-style: normal;font-weight: 700;">
                                        商品
                                    </div>
                                    ${(() => {
                                        type TitleItem = {
                                            title: string;
                                            width: string;
                                        };
                                        let titleArray: TitleItem[] = [
                                             {
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

                                        titleArray = insertSubStocks(titleArray, stockList.flatMap((item: any) => {
                                            return [
                                                html`
                                                    <div class="" style="text-align: center;">
                                                        ${item.name}<br>庫存數量
                                                    </div>`,
                                                html`
                                                    <div class="" style="text-align: center;">
                                                        ${item.name}<br>出貨數量
                                                    </div>`
                                            ]
                                        }));
                                        return titleArray.map((title) => {
                                            return html`
                                                <div class="d-flex flex-shrink-0 align-items-center ${title.title == '下單數量'?'justify-content-end':''} ${(title.title != '商品' && title.title != '下單數量'? 'justify-content-center' : '')}"
                                                     style="width:${title.width};font-size: 16px;font-style: normal;font-weight: 700;;${(title.title == '商品' ? 'position:absolute;left: 0;top: 0;' : '')}">
                                                    ${title.title}
                                                </div>
                                            `
                                        }).join('')
                                    })()}
                                </div>
                                ${(() => {
                                    const id = topGVC.glitter.getUUID();
                                    return gvc.bindView({
                                        bind:id,
                                        view:()=>{
                                            return postMD.map((item: any) => {

                                                if (item.deduction_log && Object.keys(item.deduction_log).length === 0) {
                                                    return
                                                }
                                                return html`
                                            <div class="d-flex align-items-center" style="gap:44px;">
                                                <div class="d-flex align-items-center flex-shrink-0"
                                                     style="width: ${titleLength}px;gap: 12px">
                                                    <img style="height: 54px;width: 54px;border-radius: 5px;"
                                                         src="${item.preview_image}">
                                                    <div class="d-flex flex-column"
                                                         style="font-size: 16px;">
                                                        <div>${item.title}</div>
                                                        <div style="color: #8D8D8D;font-size: 14px;">
                                                            ${(item.spec.length == 0 ? `單一規格` : item.spec.join(`,`))}
                                                        </div>
                                                        <div style="color: #8D8D8D;font-size: 14px;">存貨單位 (SKU):
                                                            ${item.sku}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex align-items-center justify-content-end flex-shrink-0"
                                                " style="width: ${elementLength}px;gap: 12px">
                                                ${item.count}
                                            </div>
                                            ${stockList.flatMap((stock: any) => {
                                                    const limit = item.stockList?.[stock.id]?.count??0;
                                                    return [html`
                                                    <div class="d-flex align-items-center justify-content-end flex-shrink-0" style="width: ${elementLength}px;gap: 12px;">
                                                    ${parseInt(limit) + (parseInt(item.deduction_log[stock.id]??"0"))}
                                                    </div>`,
                                                        html`
                                                        <div class="d-flex align-items-center justify-content-end flex-shrink-0"" style="width: ${elementLength}px;gap: 12px">
                                                        <input class="w-100"
                                                               style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;text-align: center;padding:0 18px;height:40px;"
                                                               max="${limit + (item.deduction_log[stock.id]??0)}"
                                                               min="0"
                                                               value="${item.deduction_log[stock.id]??0}"
                                                               type="number"
                                                               onchange="${gvc.event((e: any) => {
                                                                   const previewNum = item.deduction_log[stock.id];
                                                                   let still = 0;
                                                                   item.deduction_log[stock.id] = 0;
                                                                   Object.values(item.deduction_log).forEach((dd: any) => {
                                                                       still += dd;
                                                                   })
                                                                   still = item.count - still
                                                                   item.deduction_log
                                                                   
                                                                   if (e.value > still){
                                                                       e.value = still
                                                                   }
                                                                   item.deduction_log[stock.id] = parseInt(e.value);
                                                                   gvc.notifyDataChange('id')
                                                                   console.log("item -- " , item);
                                                                })}">
                                                        </div>`]
                                                }).join('')}
                                            </div>
                                        `
                                            }).join('')
                                        },divCreate:{class:"d-flex flex-column" , style:"margin-bottom:80px;gap:12px;"}
                                    })
                                    
                                })()}
                            </div>
                            <div class="w-100 justify-content-end d-flex bg-white"
                                 style="margin-top:100px;position: absolute;left: 0;bottom: 0;gap:14px;padding-right:24px;padding-bottom:20px;padding-top: 10px;border-radius: 0px 0px 10px 10px;">
                                ${BgWidget.cancel(
                                        gvc.event(() => {
                                            postMD = origData;
                                            topGVC.glitter.closeDiaLog();
                                        })
                                )}
                                ${BgWidget.save(gvc.event(() => {
                                    console.log("postMD -- ", postMD)
                                    let errorProduct : any = [];
                                    let pass = true;
                                    postMD.forEach((data:any)=>{
                                        let count = 0;
                                        if (Object.keys(data.deduction_log).length != 0) {
                                             Object.values(data.deduction_log).forEach((log:any)=>{
                                                 count += log ;
                                             });
                                            if (count != data.count){
                                                pass = false;
                                                errorProduct.push(data.title + "-" + data.spec.join(','));
                                            }
                                        }
                                        
                                    })
                                    if (pass){
                                        topGVC.glitter.closeDiaLog();

                                        if (obj.callback) {
                                            obj.callback();
                                        }
                                    }else {
                                        
                                        dialog.errorMessage({
                                            text : html`
                                                <div class="d-flex flex-column">
                                                    出貨數量異常
                                                </div>
                                            `
                                        })
                                    }
                                    
                                }))}
                            </div>
                        </div>
                    `
                },
                divCreate: {
                    style: `width: 100vw;height:100vh;`,
                    class: `d-flex align-items-center justify-content-center`
                },
                onCreate: () => {

                }
            })

        }, "batchEdit");
    }
}