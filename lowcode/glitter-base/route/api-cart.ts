type Product = {
    id: number;
    spec: string[];
    count: number;
    voucher_id?: string;
};

export interface CartItem {
    //購買的商品
    line_items: Product[];
    //選擇的贈品
    give_away: Product[];
    //使用的優惠代碼
    code?: string;
    //使用的回饋金
    use_rebate?: number;
    //使用的分銷連結
    distribution_code?: string;
}

export class ApiCart {
    //全部的購物車
    static globalCart: string = 'lemnoasew';
    //立即結帳購物車
    static buyItNow: string = 'lemnoasewbuyqwji';
    //不同物流購物車前綴
    static cartPrefix: string = 'lemnoasewdvk';

    static get checkoutCart() {
        return localStorage.getItem('checkoutCart') || ApiCart.globalCart;
    }
    //前往購物車
    static toCheckOutPage(cartID: string = ApiCart.globalCart) {
        localStorage.setItem('checkoutCart', cartID);
        (window as any).glitter.href = '/checkout';
    }
    //當下選擇購物車
    cartID: string;
    constructor(cartID: string = ApiCart.globalCart) {
        this.cartID = cartID;
    }

    get cart(): CartItem {
        const cart = (() => {
            try {
                const cart =
                    localStorage.getItem(this.cartID + `${(window as any).appName}`) ||
                    JSON.stringify({
                        line_items: [],
                        give_away: [],
                    });
                return JSON.parse(cart);
            } catch (e) {
                return {
                    line_items: [],
                    give_away: [],
                };
            }
        })();
        cart.distribution_code = localStorage.getItem('distributionCode');
        return cart;
    }

    set cart(value) {
        localStorage.setItem(this.cartID + `${(window as any).appName}`, JSON.stringify(value));
    }

    //添加商品至購物車
    addToGift(voucher_id: string, id: any, spec: string[], count: any) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product: Product = {
            id,
            spec,
            count,
            voucher_id,
        };
        this.setCart((updated_cart) => {
            const find = updated_cart.give_away.find((dd) => {
                return dd.spec.join('') === spec.join('') && `${dd.id}` === `${id}` && dd.voucher_id === voucher_id;
            });
            if (find) {
                find.count += count;
            } else {
                updated_cart.give_away.push(product);
            }
        });
    }

    //添加商品至購物車
    addToCart(id: any, spec: string[], count: any) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product: Product = {
            id,
            spec,
            count,
        };
        this.setCart((updated_cart) => {
            const find = updated_cart.line_items.find((dd) => {
                return dd.spec.join('') === spec.join('') && `${dd.id}` === `${id}`;
            });
            if (find) {
                find.count += count;
            } else {
                updated_cart.line_items.push(product);
            }
        });
        if ((window.parent as any).glitter.share.reloadCartData) {
            (window.parent as any).glitter.share.reloadCartData();
        }
    }

    //設定商品與數量至購物車
    serToCart(id: any, spec: string[], count: any) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product: Product = {
            id,
            spec,
            count,
        };
        this.setCart((updated_cart) => {
            const find = updated_cart.line_items.find((dd) => {
                return dd.spec.join('') === spec.join('') && `${dd.id}` === `${id}`;
            });
            if (find) {
                find.count = count;
            } else {
                updated_cart.line_items.push(product);
            }
        });
    }

    //清空購物車
    clearCart() {
        this.cart = {
            line_items: [],
            give_away: [],
        };
    }

    //設定購物車內容
    setCart(exe: (cartItem: CartItem) => void) {
        const cart = this.cart;
        exe(cart);
        this.cart = cart;
    }
}

const interVal = setInterval(() => {
    if ((window as any).glitter) {
        clearInterval(interVal);
        (window as any).glitter.share.ApiCart = ApiCart;
    }
}, 100);
