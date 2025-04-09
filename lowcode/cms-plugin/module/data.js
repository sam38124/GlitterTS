export class OrderDetail {
    constructor(subtotal, shipment) {
        this.discount = 0;
        this.rebate = 0;
        this.cart_token = '';
        this.tag = 'manual';
        this.lineItems = [];
        this.subtotal = subtotal;
        this.shipment = shipment;
        this.customer_info = this.initCustomerInfo();
        this.user_info = this.initUserInfo();
        this.total = 0;
        this.pay_status = "0";
        this.voucher = this.initVoucher();
    }
    initCustomerInfo() {
        return {
            name: '',
            phone: '',
            email: '',
        };
    }
    initUserInfo() {
        return {
            CVSAddress: '',
            CVSStoreID: '',
            CVSStoreName: '',
            CVSTelephone: '',
            MerchantTradeNo: '',
            address: '',
            email: '',
            name: '',
            note: '',
            phone: '',
            shipment: 'normal',
        };
    }
    initVoucher() {
        return {
            id: 0,
            discount_total: 0,
            end_ISO_Date: '',
            for: "product",
            forKey: [],
            method: "fixed",
            overlay: false,
            reBackType: "rebate",
            rebate_total: 0,
            rule: "min_count",
            ruleValue: 0,
            startDate: '',
            startTime: '',
            start_ISO_Date: '',
            status: 1,
            target: '',
            targetList: [],
            title: '',
            trigger: "auto",
            type: 'voucher',
            value: "0"
        };
    }
}
