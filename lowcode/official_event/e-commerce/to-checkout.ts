import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.userInfo=object.userInfo??{}
            object.idData=object.idData ?? {}
            object.cartCount=object.cartCount ??{}
            return {
                editor: () => {
                    return gvc.bindView(()=>{
                        const id=gvc.glitter.getUUID()
                        return {
                            bind:id,
                            view:()=>{
                                let map:any=[
                                    EditorElem.select({
                                        gvc:gvc,
                                        title:"資料來源",
                                        def:object.dataFrom ?? "cart",
                                        array:[{title:"立即購買",value:"addNow"},{title:"購物車內容",value:"cart"}],
                                        callback:(text)=>{
                                            object.dataFrom=text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    TriggerEvent.editer(gvc,widget,object.userInfo,{
                                        hover:false,
                                        option:[],
                                        title:'取得客戶資料'
                                    })
                                ]
                                if(object.dataFrom==='addNow'){
                                    map.push( TriggerEvent.editer(gvc,widget,object.idData,{
                                        hover:false,
                                        option:[],
                                        title:'取得商品ID'
                                    }))
                                    map.push( TriggerEvent.editer(gvc,widget,object.cartCount,{
                                        hover:false,
                                        option:[],
                                        title:'購買數量'
                                    }))
                                }
                                return EditorElem.container(map)
                            }
                        }
                    })
                },
                event: () => {

                    return new Promise(async (resolve, reject)=>{
                        const userInfo=await TriggerEvent.trigger({gvc:gvc,widget:widget,clickEvent:object.userInfo})
                        const cartData:{
                            line_items:{
                                "sku": string,
                                "spec": string[],
                                "stock": number,
                                "sale_price": number,
                                "compare_price": number,
                                "preview_image": string,
                                "title":string,
                                "id":number,
                                "count":number
                            }[],
                            total:number
                        }={
                            line_items:[],
                            total:0
                        }
                        const voucher=await ApiShop.getVoucherCode()
                        const rebate=await ApiShop.getRebateValue() || 0
                        function checkout(){
                            const href=new URL(location.href)
                            href.searchParams.set('page','')
                            ApiShop.toCheckout({
                                line_items:cartData.line_items.map((dd)=>{
                                    return {
                                        id:dd.id,
                                        spec:dd.spec,
                                        count:dd.count
                                    }
                                }),
                                return_url:href.href,
                                user_info:userInfo as any,
                                code:voucher as string,
                                use_rebate:parseInt(rebate as string,10)
                            }).then((res)=>{
                                $('body').html(res.response.form)
                                setTimeout(()=>{
                                    console.log( (document.querySelector('#submit') as any).click())
                                },1000)
                                ApiShop.clearCart()
                            })
                        }
                        if(object.dataFrom==='addNow'){
                            let b:any=await TriggerEvent.trigger({gvc:gvc,widget:widget,clickEvent:object.idData})
                            let cartCount=await TriggerEvent.trigger({gvc:gvc,widget:widget,clickEvent:object.cartCount})
                            const pd:any=(await  ApiShop.getProduct({limit:50,page:0,id:b.split('-')[0]})).response.data.content
                            const vard=pd.variants.find((d2:any)=>{
                                return `${pd.id}-${d2.spec.join('-')}`===b
                            });
                            vard.id=pd.id
                            vard.count=cartCount
                            vard.title=pd.title
                            cartData.line_items.push(vard)
                            cartData.total+=vard.count*vard.sale_price
                            checkout()
                        }else{
                            ApiShop.getCart().then(async (res:any)=>{
                                for (const b of Object.keys(res)){
                                    const pd:any=(await  ApiShop.getProduct({limit:50,page:0,id:b.split('-')[0]})).response.data.content
                                    const vard=pd.variants.find((d2:any)=>{
                                        return `${pd.id}-${d2.spec.join('-')}`===b
                                    });
                                    vard.id=pd.id
                                    vard.count=res[b]
                                    vard.title=pd.title
                                    cartData.line_items.push(vard)
                                    cartData.total+=vard.count*vard.sale_price
                                }
                                checkout()
                            })
                        }

                    })
                },
            };
        },
    };
});

