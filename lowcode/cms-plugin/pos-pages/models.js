export class OrderDetail {
    constructor(subtotal, shipment) {
        this.subtotal = subtotal;
        this.discount = 0;
        this.rebate = 0;
        this.shipment = shipment;
        this.cart_token = '';
        this.lineItems = [];
        this.user_info = {
            CVSAddress: '',
            CVSStoreID: '',
            CVSStoreName: '',
            CVSTelephone: '',
            MerchantTradeNo: '',
            id: 0,
            address: '',
            email: '',
            name: '',
            note: '',
            phone: '',
            shipment: 'normal',
        };
        this.customer_info = {
            payment_select: 'POS',
            name: '',
            phone: '',
            email: '',
        };
        this.pay_status = 1;
        this.use_rebate = 0;
        this.voucherList = [];
    }
    get total() {
        return this.subtotal + this.shipment - this.discount;
    }
}
OrderDetail.singleInstance = new OrderDetail(0, 0);
