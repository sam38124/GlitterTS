import {OrderDetail, ViewModel} from "./models.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {POSSetting} from "../POS-setting.js";
import {Swal} from "../../modules/sweetAlert.js";

const html = String.raw

export class ProductsPage {
    public static main(obj: { gvc: GVC,vm: ViewModel,orderDetail:OrderDetail }) {
        const swal = new Swal(obj.gvc);
        const gvc = obj.gvc
        const vm = obj.vm
        const orderDetail=obj.orderDetail
        const dialog = new ShareDialog(gvc.glitter);
        (orderDetail as any).total=orderDetail.total || 0;
        return html`
            <div class="left-panel"
                 style="${(document.body.offsetWidth < 800) ? `width:calc(100%);padding-top: 32px` : `width:calc(100% - 352px);padding: 32px 36px`};overflow: hidden;">
                ${gvc.bindView({
                    bind: `category`,
                    view: () => {
                        try {
                            if (vm.categorySearch) {
                                ApiShop.getCollection().then(r => {
                                    vm.categorySearch = false;

                                    r.response.value.forEach((data: any) => {
                                        vm.categories.push({
                                            key: data.code,
                                            value: data.title
                                        })
                                    })
                                    gvc.notifyDataChange('category');
                                })
                            }

                            // "全部商品","最新上架","熱門商品","貓跳台","貓抓板","逗貓棒","貓糧"
                            return vm.categories.map((data: any) => {
                                return html`
                                    <div style="font-size: 18px;;width:131px;height:51px;margin-right:24px;white-space: nowrap;display: flex;padding: 12px 24px;justify-content: center;align-items: center;border-radius: 10px;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);${data?.select ? `background: #393939;color: #FFF;` : `background: #FFF;color#393939;`}"
                                         onclick="${gvc.event(() => {
                                             vm.categories.forEach((category) => {
                                                 category.select = false;
                                             })
                                             data.select = true;
                                             vm.searchable = true;
                                             gvc.notifyDataChange(['category', 'productShow']);
                                         })}">
                                        ${data.value}
                                    </div>
                                `
                            }).join('')
                        } catch (e) {
                            console.log(e)
                            return `${e}`
                        }

                    },
                    divCreate: {
                        class: `d-flex px-3 px-lg-2`,
                        style: `width:100%;overflow: scroll;padding-bottom:32px;`
                    }
                })}
                ${gvc.bindView({
                    bind: `productShow`,
                    view: () => {
                        let image = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
                        let parent = document.querySelector(`.left-panel`) as HTMLElement;
                        let rowItem = Math.floor((parent.offsetWidth - 72) / 188);
                        rowItem = (rowItem * 188 + 26 * (rowItem - 1) > (parent.offsetWidth - 72)) ? rowItem - 1 : rowItem;
                        if (document.body.offsetWidth < 600) {
                            rowItem = 2;
                        }
                        let maxwidth = (parent.offsetWidth - 72 - (rowItem - 1) * 26) / rowItem
                        if (document.body.offsetWidth < 600) {
                            maxwidth += 10;
                        }
                        let category = vm.categories.find((category: any) => {
                            return category.select == true;
                        })

                        function arraysEqual(arr1: any[], arr2: any[]) {
                            if (arr1.length !== arr2.length) return false;
                            return arr1.every((value, index) => value === arr2[index]);
                        }

                        function changeSelectVariant(product: any) {
                            let emptyArray: any[] = [];
                            product.content.specs.forEach((spec: any) => {
                                emptyArray.push(spec.option.find((opt: any) => {
                                    return opt.select == true;
                                }).title)
                            })
                            return product.content.variants.find((variant: any) => {
                                return arraysEqual(variant.spec, emptyArray)
                            })
                        }


                        if (vm.searchable) {
                            dialog.dataLoading({visible:true})
                            ApiShop.getProduct({
                                page: 0,
                                collection: (category.key == 'all' ? '' : category.key),
                                limit: 50000,
                                search: vm.query,
                                orderBy: 'created_time_desc'
                            }).then(res => {
                                vm.searchable = false;
                                vm.productSearch = res.response.data;
                                dialog.dataLoading({visible:false})
                                gvc.notifyDataChange(`productShow`)
                            })
                        }
                        if (vm.productSearch.length > 0) {
                            
                            return vm.productSearch.map((data) => {
                                let selectVariant = data.content.variants[0];
                                let count = 1;
                                data.content.specs.forEach((spec: any) => {
                                    spec.option[0].select = true;
                                })
                              
                                return html`
                                    <div class="d-flex flex-column mb-4 mb-sm-0"
                                         style="max-width:${maxwidth}px;flex-basis: 188px;flex-grow: 1;border-radius: 10px;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);"
                                         onclick="${gvc.event(() => {
                                             gvc.glitter.innerDialog((gvc) => {
                                                 return gvc.bindView({
                                                     bind: `productDialog`,
                                                     view: () => {
                                                         return html`
                                                             <div class="w-100 h-100 d-flex align-items-center justify-content-center"
                                                                  onclick="${gvc.event(() => {
                                                                      gvc.glitter.closeDiaLog()
                                                                  })}">
                                                                 <div class="d-flex flex-column position-relative"
                                                                      style="width: 542px;padding: 32px;background-color: white;border-radius: 10px;max-width: calc(100% - 20px);overflow-y:auto;max-height:calc(100% - 20px);"
                                                                      onclick="${gvc.event((e, event) => {
                                                                          event.stopPropagation();
                                                                      })}">
                                                                     <div class="w-100 d-block d-sm-flex flex-column flex-sm-row m"
                                                                          style="gap:24px;">
                                                                         <div class="rounded-3 d-none"
                                                                              style="${(document.body.offsetWidth < 800) ? `width: 100%;padding-bottom:100%;` : `width: 204px;height: 204px;`}background: 50%/cover url('${(selectVariant.preview_image.length > 1) ? selectVariant.preview_image : data.content.preview_image[0]}');"></div>
                                                                         <div class="d-flex flex-column flex-fill justify-content-center">
                                                                             <div style="font-size: 24px;font-weight: 700;">
                                                                                 ${data.content.title ?? "no name"}
                                                                             </div>
                                                                             <div style="font-size: 20px;font-weight: 500;margin-top: 8px;">
                                                                                     NT.${parseInt(selectVariant.sale_price, 10).toLocaleString()}
                                                                             </div>
                                                                             ${gvc.bindView({
                                                                                 bind: `productSpec`,
                                                                                 view: () => {
                                                                                     if (data.content.specs.length > 0) {
                                                                                         return data.content.specs.map((spec: any) => {
                                                                                             return html`
                                                                                                 <div style="font-size: 16px;font-style: normal;font-weight: 500;color: #8D8D8D;">
                                                                                                     ${spec.title}
                                                                                                 </div>
                                                                                                 <select class="w-100 form-select"
                                                                                                         style="border-radius: 5px;border: 1px solid #DDD;padding: 10px 18px;font-size: 18px;"
                                                                                                         onchange="${gvc.event((e) => {
                                                                                                             spec.option.forEach((option: any) => {
                                                                                                                 option.select = false;
                                                                                                             })
                                                                                                             spec.option[e.value].select = true;
                                                                                                             selectVariant = changeSelectVariant(data);
                                                                                                             gvc.notifyDataChange('productDialog');
                                                                                                         })}">
                                                                                                     ${(() => {
                                                                                                         return spec.option.map((option: any, index: number) => {
                                                                                                             return html`
                                                                                                                 <option class="d-flex align-items-center justify-content-center"
                                                                                                                         value="${index}"
                                                                                                                         ${(option.select) ? 'selected' : ''}
                                                                                                                         style="border-radius: 5px;padding: 10px 18px;color: #393939;font-size: 18px;font-weight: 500;letter-spacing: 0.72px;"
                                                                                                                         onclick="${gvc.event(() => {
                                                                                                                         })}">
                                                                                                                     ${option.title}
                                                                                                                 </option>`
                                                                                                         }).join('');
                                                                                                     })()}
                                                                                                 </select>
                                                                                             `
                                                                                         }).join('')
                                                                                     } else {
                                                                                         return ``
                                                                                     }
                                                                                 },
                                                                                 divCreate: {
                                                                                     style: `gap:8px;margin-bottom:${data.content.specs.length ? `24px`:`0px`};margin-top:16px;`,
                                                                                     class: `d-flex flex-column`
                                                                                 }
                                                                             })}
                                                                             ${gvc.bindView(() => {

                                                                                 return {
                                                                                     bind: 'count_bt',
                                                                                     view: () => {
                                                                                         if (count > 1 && selectVariant.stock < count && !selectVariant.show_understocking) {
                                                                                             count = selectVariant.stock;
                                                                                             
                                                                                             dialog.infoMessage({text: `此商品僅剩${selectVariant.stock}個庫存`})
                                                                                         }
                                                                                         return html`
                                                                                             <div class="d-flex align-items-center justify-content-between"
                                                                                                  style="gap: 10px;padding: 10px 18px;border-radius: 5px;border: 1px solid #DDD;">
                                                                                                 <div class="d-flex align-items-center justify-content-center"
                                                                                                      style="border-radius: 10px;cursor: pointer;"
                                                                                                      onclick="${gvc.event(() => {
                                                                                                          count = (count == 1) ? count : count - 1;
                                                                                                          gvc.notifyDataChange(`productDialog`);
                                                                                                      })}">
                                                                                                     <svg xmlns="http://www.w3.org/2000/svg"
                                                                                                          width="13"
                                                                                                          height="3"
                                                                                                          viewBox="0 0 13 3"
                                                                                                          fill="none">
                                                                                                         <path d="M13 1.5C13 1.98398 12.5531 2.375 12 2.375H1C0.446875 2.375 0 1.98398 0 1.5C0 1.01602 0.446875 0.625 1 0.625H12C12.5531 0.625 13 1.01602 13 1.5Z"
                                                                                                               fill="#393939"/>
                                                                                                     </svg>
                                                                                                 </div>
                                                                                                 <input class="border-0 qty"
                                                                                                        style="text-align: center;width: 30px;"
                                                                                                        value="${count}"
                                                                                                        onchange="${gvc.event((e) => {
                                                                                                            count = e.value;
                                                                                                            gvc.notifyDataChange(['count_bt', 'product_btn']);
                                                                                                        })}">
                                                                                                 <div class="d-flex align-items-center justify-content-center"
                                                                                                      style="border-radius: 10px;cursor: pointer;"
                                                                                                      onclick="${gvc.event(() => {
                                                                                                          count++
                                                                                                          gvc.notifyDataChange(['count_bt', 'product_btn']);
                                                                                                      })}">
                                                                                                     <svg xmlns="http://www.w3.org/2000/svg"
                                                                                                          width="14"
                                                                                                          height="15"
                                                                                                          viewBox="0 0 14 15"
                                                                                                          fill="none">
                                                                                                         <path d="M8.07692 1.57692C8.07692 0.98125 7.59567 0.5 7 0.5C6.40433 0.5 5.92308 0.98125 5.92308 1.57692V6.42308H1.07692C0.48125 6.42308 0 6.90433 0 7.5C0 8.09567 0.48125 8.57692 1.07692 8.57692H5.92308V13.4231C5.92308 14.0188 6.40433 14.5 7 14.5C7.59567 14.5 8.07692 14.0188 8.07692 13.4231V8.57692H12.9231C13.5188 8.57692 14 8.09567 14 7.5C14 6.90433 13.5188 6.42308 12.9231 6.42308H8.07692V1.57692Z"
                                                                                                               fill="#393939"/>
                                                                                                     </svg>
                                                                                                 </div>
                                                                                             </div>
                                                                                             <div class="d-flex mt-2 align-items-center justify-content-end ${selectVariant.show_understocking ? `d-none`:``}">
                                                                                                 <span>庫存數量:${selectVariant.stock}</span>
                                                                                             </div>
                                                                                         `

                                                                                     },
                                                                                     divCreate: {
                                                                                         class: `d-flex flex-column`,
                                                                                         style: ``
                                                                                     }
                                                                                 }
                                                                             })}
                                                                         </div>
                                                                     </div>
                                                                     <div class="d-flex mt-4 justify-content-between" style="gap:10px;">
                                                                         ${
                                                                                 gvc.bindView(() => {

                                                                                     return {
                                                                                         bind: 'close',
                                                                                         view: () => {
                                                                                             return `取消`
                                                                                         },
                                                                                         divCreate: () => {
                                                                                             return {
                                                                                                 class: `d-flex align-items-center justify-content-center`,
                                                                                                 style: `flex:1;padding: 12px 24px;font-size: 20px;color: #FFF;font-weight: 500;border-radius: 10px;min-height: 58px;background:gray;`,
                                                                                                 option: [
                                                                                                     {
                                                                                                         key: 'onclick',
                                                                                                         value: gvc.event(() => {
                                                                                                             gvc.glitter.closeDiaLog()
                                                                                                         })
                                                                                                     }
                                                                                                 ]
                                                                                             }
                                                                                         }
                                                                                     }
                                                                                 })
                                                                         }
                                                                         ${
                                                                                 gvc.bindView(() => {

                                                                                     return {
                                                                                         bind: 'product_btn',
                                                                                         view: () => {
                                                                                             if (!selectVariant.show_understocking && selectVariant.stock === 0) {
                                                                                                 return `尚無庫存`
                                                                                             }
                                                                                             return `加入購物車`
                                                                                         },
                                                                                         divCreate: () => {
                                                                                             return {
                                                                                                 class: `d-flex align-items-center justify-content-center`,
                                                                                                 style: `flex:1;padding: 12px 24px;font-size: 20px;color: #FFF;font-weight: 500;border-radius: 10px;background: ${(!selectVariant.show_understocking && selectVariant.stock === 0) ? `#B8B8B8;` : `#393939;`}min-height: 58px;`,
                                                                                                 option: [
                                                                                                     {
                                                                                                         key: 'onclick',
                                                                                                         value: gvc.event(() => {
                                                                                                             let addItem = orderDetail.lineItems.find((item: any) => {
                                                                                                                 console.log(data)
                                                                                                                 console.log(item)
                                                                                                                 console.log(selectVariant)
                                                                                                                 return data.content.title == item.title && arraysEqual(item.spec, selectVariant.spec)
                                                                                                             });
                                                                                                             if (addItem) {
                                                                                                                 addItem.count += count;
                                                                                                             } else {
                                                                                                                 orderDetail.lineItems.push({
                                                                                                                     id: data.id,
                                                                                                                     title: data.content.title,
                                                                                                                     preview_image: (selectVariant.preview_image.length > 1) ? selectVariant.preview_image : data.content.preview_image[0],
                                                                                                                     spec: selectVariant.spec,
                                                                                                                     count: count,
                                                                                                                     sale_price: selectVariant.sale_price,
                                                                                                                     sku: selectVariant.sku
                                                                                                                 })
                                                                                                             }
                                                                                                             if(document.querySelector('.js-cart-count')){
                                                                                                                 (document.querySelector('.js-cart-count') as any).recreateView()
                                                                                                             }
                                                                                                             gvc.glitter.closeDiaLog()
                                                                                                         })
                                                                                                     }
                                                                                                 ]
                                                                                             }
                                                                                         }
                                                                                     }
                                                                                 })
                                                                         }
                                                                     </div>
                                                                 </div>
                                                             </div>`
                                                     }, divCreate: {class: `w-100 h-100 `}
                                                 })
                                             }, 'product', {
                                                 dismiss: () => {
                                                     gvc.notifyDataChange('order')
                                                 }
                                             })
                                         })}">
                                        <div class="w-100"
                                             style="border-radius: 10px 10px 0 0;;padding-bottom: 116px;background: 50%/cover no-repeat url('${data.content.preview_image[0] ?? image ?? image}');"></div>
                                        <div class="d-flex flex-column"
                                             style="padding: 12px 10px;gap: 4px;">
                                            <div style="font-size: 18px;width: 100%;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;text-overflow: ellipsis;word-break: break-word;-webkit-box-orient: vertical;">
                                                ${data.content.title ?? "no name"}
                                            </div>
                                            <div class="w-100 align-items-center justify-content-end"
                                                 style="font-size: 16px;font-weight: 700;text-align: right;">
                                                    NT.${parseInt(data.content.min_price ?? 0, 10).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                `
                            }).join('')
                        }else{
                            return POSSetting.emptyView('查無相關商品')
                        }
                        return html``
                    },
                    divCreate: () => {
                        if (document.body.offsetWidth < 800) {
                            return {
                                class: `d-flex flex-wrap w-100 product-show`,
                                style: `overflow:scroll;max-height:100%;padding-left:24px;padding-right:24px;justify-content: space-between;padding-bottom:100px;`
                            }
                        } else {
                            return {
                                class: `d-flex flex-wrap w-100 product-show p-2`,
                                style: `gap:26px;overflow:scroll;max-height:100%;`
                            }
                        }
                    }
                })}
            </div>
            ${(()=>{
                const view=`<div class=""
                 style="height: 100%;width: 352px;max-width:100%;overflow: auto;${(document.body.clientWidth>800) ? `padding: 36px 24px;`:`padding: 10px 12px;`};background: #FFF;box-shadow: 1px 0 10px 0 rgba(0, 0, 0, 0.10);">
                <div style="color:#393939;font-size: 32px;font-weight: 700;letter-spacing: 3px;margin-bottom: 32px;">
                    購物車
                </div>
                ${gvc.bindView({
                    bind: 'order',
                    dataList: [{obj: vm, key: 'order'}],
                    view: () => {
                        orderDetail.subtotal = 0;
                        orderDetail.lineItems.forEach((item) => {
                            orderDetail.subtotal += item.sale_price * item.count;
                        })
                        
                        return html`
                            <div style="display: flex;flex-direction: column;gap: 18px;">
                                ${orderDetail.lineItems.map((item, index) => {
                            return html`
                                        ${(index > 0) ? `<div style="background-color: #DDD;height:1px;width: 100%;"></div>` : ""}
                                        <div class="d-flex align-items-center"
                                             style="height: 87px;">
                                            <div class="rounded-3" style="background: 50%/cover url('${item.preview_image}');height: 67px;width: 66px;margin-right: 12px;"></div>
                                            <div class="d-flex flex-column flex-fill">
                                                <div>${item.title}</div>
                                                <div class="d-flex" style="gap:4px;">
                                                    ${(item.spec.length > 0) ? item.spec.map((spec) => {
                                return html`
                                                            <div style="color: #949494;font-size: 16px;font-style: normal;font-weight: 500;">
                                                                ${spec}
                                                            </div>`
                            }).join('') : "單一規格"}
                                                </div>
                                                <div class="d-flex align-items-center"
                                                     style="margin-top:6px;">
                                                    <div style="display: flex;width: 30px;height: 30px;padding: 8px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;"
                                                         onclick="${gvc.event(() => {
                                item.count = (item.count < 2) ? item.count : item.count - 1;
                                gvc.notifyDataChange('order')
                            })}">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             width="10" height="10"
                                                             viewBox="0 0 10 10"
                                                             fill="none">
                                                            <path d="M9.64314 5C9.64314 5.3457 9.32394 5.625 8.92885 5.625H1.07171C0.676618 5.625 0.357422 5.3457 0.357422 5C0.357422 4.6543 0.676618 4.375 1.07171 4.375H8.92885C9.32394 4.375 9.64314 4.6543 9.64314 5Z"
                                                                  fill="white"/>
                                                        </svg>
                                                    </div>
                                                    <input class="border-0"
                                                           style="width: 50px;height: 25px;color: #393939;font-size: 18px;font-weight: 500;text-align: center"
                                                           value="${item.count}">
                                                    <div style="display: flex;width: 30px;height: 30px;padding: 8px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;"
                                                         onclick="${gvc.event(() => {
                                item.count++
                                gvc.notifyDataChange('order')
                            })}">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             width="10" height="10"
                                                             viewBox="0 0 10 10" fill="none"
                                                             onclick="${gvc.event(() => {
                            })}">
                                                            <path d="M5.76923 0.769231C5.76923 0.34375 5.42548 0 5 0C4.57452 0 4.23077 0.34375 4.23077 0.769231V4.23077H0.769231C0.34375 4.23077 0 4.57452 0 5C0 5.42548 0.34375 5.76923 0.769231 5.76923H4.23077V9.23077C4.23077 9.65625 4.57452 10 5 10C5.42548 10 5.76923 9.65625 5.76923 9.23077V5.76923H9.23077C9.65625 5.76923 10 5.42548 10 5C10 4.57452 9.65625 4.23077 9.23077 4.23077H5.76923V0.769231Z"
                                                                  fill="white"/>
                                                        </svg>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="h-100 d-flex flex-column align-items-end justify-content-between" >
                                                <div class="" onclick="${gvc.event(()=>{
                                                    orderDetail.lineItems.splice(index,1)
                                                    if(document.querySelector('.js-cart-count')){
                                                        (document.querySelector('.js-cart-count') as any).recreateView()
                                                    }
                                                    gvc.notifyDataChange('order')
                                                })}">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="14" height="14"
                                                         viewBox="0 0 14 14"
                                                         fill="none">
                                                        <path d="M1 1L13 13" stroke="#949494"
                                                              stroke-width="2"
                                                              stroke-linecap="round"/>
                                                        <path d="M13 1L1 13" stroke="#949494"
                                                              stroke-width="2"
                                                              stroke-linecap="round"/>
                                                    </svg>
                                                </div>
                                              
                                                <div style="color:#393939;font-size: 18px;font-style: normal;font-weight: 500;letter-spacing: 0.72px;">
                                                        $${(item.sale_price * item.count).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    `
                        }).join('')}
                            </div>
                            <div class="w-100"
                                 style="margin-top: 24px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;display: flex;padding: 24px;flex-direction: column;justify-content: center;">
                                <div class=" w-100 d-flex flex-column" style="gap:6px;">
                                    ${(() => {
                            let tempData = [
                                {
                                    left: `小計總額`,
                                    right: parseInt((orderDetail.subtotal ?? 0) as any, 10).toLocaleString()
                                },
                                // {
                                //     left: `活動折扣`,
                                //     right: parseInt((orderDetail.discount ?? 0) as any, 10).toLocaleString()
                                // }
                            ]
                            return tempData.map((data) => {
                                return html`
                                                <div class="w-100 d-flex">
                                                    <div style="font-size: 16px;font-style: normal;font-weight: 500;">
                                                        ${data.left}
                                                    </div>
                                                    <div class="ms-auto"
                                                         style="font-size: 16px;font-weight: 700;">
                                                        ${data.right}
                                                    </div>
                                                </div>
                                            `
                            }).join(``)
                        })()}
                                </div>
                                <div class="d-flex align-items-center justify-content-center"
                                     style="margin:18px 0;">
                                    <svg width="350" height="2" viewBox="0 0 350 2"
                                         fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 1H350" stroke="#DDDDDD"
                                              stroke-dasharray="8 8"/>
                                    </svg>
                                </div>
                                <div class="d-flex"
                                     style="font-size: 18px;color: #393939;font-weight: 700;">
                                    <div class="" style="">總金額</div>
                                    <div class="ms-auto">${orderDetail.total.toLocaleString()}</div>
                                </div>

                            </div>
                        `
                    }, divCreate: {class: `display: flex;flex-direction: column;gap: 24px;`},
                    onCreate:()=>{
                        const dialog=new ShareDialog(gvc.glitter)
                        obj.gvc.glitter.share.scan_back = (text: string) => {
                            dialog.dataLoading({visible:true})
                            ApiShop.getProduct({
                                page: 0,
                                limit: 50000,
                                accurate_search_text:true,
                                search:text,
                                orderBy: 'created_time_desc'
                            }).then(res => {
                                dialog.dataLoading({visible:false})
                                if(res.response.data[0]){
                                    const data=res.response.data[0]
                                    const selectVariant=res.response.data[0].content.variants.find((d1:any)=>{
                                        return d1.barcode===text
                                    })
                                    if(!orderDetail.lineItems.find((dd)=>{
                                        return (dd.id+dd.spec.join('-'))===(data.id + selectVariant.spec.join('-'))
                                    })){
                                        orderDetail.lineItems.push({
                                            id: data.id,
                                            title: data.content.title,
                                            preview_image: (selectVariant.preview_image.length > 1) ? selectVariant.preview_image : data.content.preview_image[0],
                                            spec: selectVariant.spec,
                                            count: 0,
                                            sale_price: selectVariant.sale_price,
                                            sku: selectVariant.sku
                                        }) 
                                    }
                                    orderDetail.lineItems.find((dd)=>{
                                        return (dd.id+dd.spec.join('-'))===(data.id + selectVariant.spec.join('-'))
                                    })!.count++
                                    gvc.notifyDataChange('order')
                                }else{
                                    swal.toast({icon:'error',title:'無此商品'})
                                }
                                
                                gvc.notifyDataChange(`order`)
                            })
                        }
                    }
                })}

                <div style="margin-top: 32px;display: flex;padding: 12px 24px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;font-size: 20px;font-style: normal;font-weight: 500;color: #FFF;"
                     onclick="${gvc.event(() => {
                    vm.type = 'payment';
                    gvc.glitter.closeDrawer()
                })}">
                    送出訂單
                </div>
            </div>`
                if(document.body.offsetWidth<800){
                    gvc.glitter.setDrawer(view,()=>{})
                    return  ``
                }else {
                    return view
                }
            })()}
            
        `
    }
}