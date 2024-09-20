type Product = {
    id: number;
    spec: string[];
    count: number;
};
export interface CartItem{
    //購買的商品
    line_items:Product[],
    //選擇的贈品
    give_away:Product[],
    //使用的優惠代碼
    code?:string,
    //使用的回饋金
    use_rebate?:number,
    //使用的分銷連結
    distribution_code?:string
}
export class ApiCart{
    static cartID = 'lemnoasew';
    static get cart():CartItem{
       const cart=(()=>{
           try {
               const cart=localStorage.getItem(ApiCart.cartID+`${(window as any).appName}`) || JSON.stringify({
                   line_items:[],
                   give_away:[]
               })
               return JSON.parse(cart)
           }catch (e) {
               return  {
                   line_items:[],
                   give_away:[]
               }
           }
       })()
        cart.distribution_code=localStorage.getItem('distributionCode')
        return  cart
    }
    static set cart(value){
        localStorage.setItem(ApiCart.cartID+`${(window as any).appName}`,JSON.stringify(value))
    }
    //添加商品至購物車
    static addToGift(id:any,spec:string[],count:any){
        count=parseInt(count,10)
        id=parseInt(id,10)
        const product: Product = {
            id,
            spec,
            count
        };
        ApiCart.setCart((updated_cart)=>{
            const find=updated_cart.give_away.find((dd)=>{return (dd.spec.join('')===spec.join('')) && `${dd.id}`===`${id}`})
            if(find){find.count+=count}else{
                updated_cart.give_away.push(product)
            }
        })
    }
    //添加商品至購物車
    static addToCart(id:any,spec:string[],count:any){
        count=parseInt(count,10)
        id=parseInt(id,10)
        const product: Product = {
            id,
            spec,
            count
        };
        ApiCart.setCart((updated_cart)=>{
            const find=updated_cart.line_items.find((dd)=>{return (dd.spec.join('')===spec.join('')) && `${dd.id}`===`${id}`})
            if(find){find.count+=count}else{
                updated_cart.line_items.push(product)
            }
        })
    }
    //設定商品與數量至購物車
    static serToCart(id:any,spec:string[],count:any){
        count=parseInt(count,10)
        id=parseInt(id,10)
        const product: Product = {
            id,
            spec,
            count
        };
        ApiCart.setCart((updated_cart)=>{
            const find=updated_cart.line_items.find((dd)=>{return (dd.spec.join('')===spec.join('')) && `${dd.id}`===`${id}`})
            if(find){find.count=count}else{
                updated_cart.line_items.push(product)
            }
        })
    }
    //清空購物車
    static clearCart(){
       ApiCart.cart={
           line_items:[],
           give_away:[]
       }
    }
    //設定購物車內容
    static setCart(exe:(cartItem:CartItem)=>void){
        const cart=ApiCart.cart
        exe(cart)
        ApiCart.cart=cart
    }
}