export class ApiCart {
    static get cart() {
        const cart = (() => {
            try {
                const cart = localStorage.getItem(ApiCart.cartID + `${window.appName}`) ||
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
    static set cart(value) {
        localStorage.setItem(ApiCart.cartID + `${window.appName}`, JSON.stringify(value));
    }
    static addToGift(voucher_id, id, spec, count) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product = {
            id,
            spec,
            count,
            voucher_id,
        };
        ApiCart.setCart((updated_cart) => {
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
    static addToCart(id, spec, count) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product = {
            id,
            spec,
            count,
        };
        ApiCart.setCart((updated_cart) => {
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
    }
    static serToCart(id, spec, count) {
        count = parseInt(count, 10);
        id = parseInt(id, 10);
        const product = {
            id,
            spec,
            count,
        };
        ApiCart.setCart((updated_cart) => {
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
    static clearCart() {
        ApiCart.cart = {
            line_items: [],
            give_away: [],
        };
    }
    static setCart(exe) {
        const cart = ApiCart.cart;
        exe(cart);
        ApiCart.cart = cart;
    }
}
ApiCart.cartID = 'lemnoasew';
const interVal = setInterval(() => {
    if (window.glitter) {
        clearInterval(interVal);
        window.glitter.share.ApiCart = ApiCart;
    }
}, 100);
