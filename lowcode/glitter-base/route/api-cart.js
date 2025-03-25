export class ApiCart {
    constructor(cartID = ApiCart.globalCart) {
        this.cartID = cartID;
    }
    static get checkoutCart() {
        return localStorage.getItem('checkoutCart') || ApiCart.globalCart;
    }
    static set checkoutCart(value) {
        localStorage.setItem('checkoutCart', value);
    }
    static toCheckOutPage(cartID = ApiCart.globalCart) {
        localStorage.setItem('checkoutCart', cartID);
        window.glitter.href = '/checkout';
    }
    get onlineCart() {
        const cart = (() => {
            try {
                const cart = localStorage.getItem(this.cartID + `${window.appName}`) ||
                    JSON.stringify({
                        line_items: [],
                        give_away: [],
                    });
                return JSON.parse(cart);
            }
            catch (e) {
                return {
                    line_items: [],
                    give_away: [],
                };
            }
        })();
        cart.distribution_code = localStorage.getItem('distributionCode');
        return cart;
    }
    get cart() {
        const cart = (() => {
            try {
                const cart = localStorage.getItem(this.cartID + `${window.appName}`) ||
                    JSON.stringify({
                        line_items: [],
                        give_away: [],
                    });
                return JSON.parse(cart);
            }
            catch (e) {
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
        localStorage.setItem(this.cartID + `${window.appName}`, JSON.stringify(value));
    }
    addToGift(voucher_id, id, spec, count) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product = {
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
            }
            else {
                updated_cart.give_away.push(product);
            }
        });
    }
    addToCart(id, spec, count) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product = {
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
            }
            else {
                updated_cart.line_items.push(product);
            }
        });
        if (window.parent.glitter.share.reloadCartData) {
            window.parent.glitter.share.reloadCartData();
        }
    }
    serToCart(id, spec, count) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product = {
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
            }
            else {
                updated_cart.line_items.push(product);
            }
        });
    }
    clearCart() {
        this.cart = {
            line_items: [],
            give_away: [],
        };
    }
    setCart(exe) {
        const cart = this.cart;
        exe(cart);
        this.cart = cart;
    }
}
ApiCart.globalCart = 'lemnoasew';
ApiCart.buyItNow = 'lemnoasewbuyqwji';
ApiCart.cartPrefix = 'lemnoasewdvk';
const interVal = setInterval(() => {
    if (window.glitter) {
        clearInterval(interVal);
        window.glitter.share.ApiCart = ApiCart;
    }
}, 100);
