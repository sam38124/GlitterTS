export class OrderDetail {
  subtotal: number;
  shipment: number;
  total: number;
  discount: number = 0;
  rebate: number = 0;
  cart_token: string = '';
  tag: 'manual' = 'manual';
  voucher: VoucherData;
  lineItems: LineItem[] = [];
  customer_info: CustomerInfo;
  user_info: {
    name: string;
    email: string;
    city?: string;
    area?: string;
    phone: string;
    address: string;
    custom_form_delivery?: any;
    shipment:
      | 'normal'
      | 'black_cat_freezing'
      | 'now'
      | 'shop'
      | 'global_express'
      | 'black_cat'
      | 'UNIMARTC2C'
      | 'FAMIC2C'
      | 'HILIFEC2C'
      | 'OKMARTC2C'
      | 'UNIMARTFREEZE'
      | 'FAMIC2CFREEZE';
    CVSStoreName: string;
    CVSStoreID: string;
    CVSTelephone: string;
    MerchantTradeNo: string;
    CVSAddress: string;
    note?: string;
    code_note?: string;
  };
  pay_status: string;

  constructor(subtotal: number, shipment: number) {
    this.subtotal = subtotal;
    this.shipment = shipment;
    this.customer_info = this.initCustomerInfo();
    this.user_info = this.initUserInfo();
    this.total = 0;
    this.pay_status = '0';
    this.voucher = this.initVoucher();
  }

  private initCustomerInfo(): CustomerInfo {
    return {
      name: '',
      phone: '',
      email: '',
    };
  }

  private initUserInfo(): UserInfo {
    return {
      country: '',
      postal_code: '',
      invoice_type: '',
      shipment_date: '',
      shipment_refer: '',
      state: '',
      company: '',
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

  private initVoucher(): VoucherData {
    return {
      id: 0,
      discount_total: 0,
      end_ISO_Date: '',
      for: 'product',
      forKey: [],
      method: 'fixed',
      overlay: false,
      reBackType: 'rebate',
      rebate_total: 0,
      rule: 'min_count',
      ruleValue: 0,
      startDate: '',
      startTime: '',
      start_ISO_Date: '',
      status: 1,
      target: '',
      targetList: [],
      title: '',
      trigger: 'auto',
      type: 'voucher',
      value: '0',
    };
  }
}
