export class ProductConfig {
    static getName(data) {
        if (`${data.visible}` === `false`) {
            return `隱形商品`;
        }
        else if (data.productType.giveaway) {
            return `贈品`;
        }
        else if (data.productType.addProduct) {
            return `加購品`;
        }
        else if (data.productType.product) {
            return `前台商品`;
        }
        return `前台商品`;
    }
}
