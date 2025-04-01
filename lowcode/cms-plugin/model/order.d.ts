interface VoucherData {
  id: number;
  title: string;
  method: 'percent' | 'fixed';
  reBackType: 'rebate' | 'discount' | 'shipment_free';
  trigger: 'auto' | 'code';
  value: number;
  for: 'collection' | 'product' | 'all';
  rule: 'min_price' | 'min_count';
  forKey: string[];
  ruleValue: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  status: 0 | 1 | -1;
  type: 'voucher';
  code?: string;
  overlay: boolean;
  bind?: {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    collection: string[];
    discount_price: number;
    rebate: number;
    shipment_fee: number;
  }[];
  start_ISO_Date: string;
  end_ISO_Date: string;
  discount_total: number;
  rebate_total: number;
  target: string;
  targetList: string[];
}

// 2. ViewModel
// -------------------------
interface ViewModel {
  id: string;
  loading: boolean;
  filterId: string;
  type: 'list' | 'add' | 'replace' | 'select' | 'createInvoice' | 'viewInvoice' | 'recommend';
  data: any;
  invoiceData: any;
  orderData: any;
  distributionData: any;
  dataList: any;
  query?: string;
  queryType?: string;
  orderString?: string;
  return_order?: boolean;
  filter?: any;
  tempOrder?: string;
  filter_type: 'normal' | 'block' | 'pos' | 'all';
  apiJSON: any;
  checkedData: any[];
  headerConfig: string[];
}

// 3. EcCashFlow
// -------------------------
interface EcCashFlow {
  HandlingCharge: string;
  PaymentType: 'ATM_CHINATRUST' | 'Credit_CreditCard';
  PaymentDate: string;
  TradeStatus: '0' | '1' | '10200095';
  TradeAmt: string;
  TradeNo: string;
  credit_receipt: any;
}

// 4. PayNowCashFlow
// -------------------------
interface PayNowCashFlow {
  amount: number;
  status: string;
  payment: {
    paymentMethod: 'ATM' | 'CreditCard' | 'ConvenienceStore';
    paidAt: string;
  };
}

// 5. Order
// -------------------------
interface Order {
  id: number;
  cart_token: string;
  status: number;
  invoice_status: number;
  email: string;
  orderData: OrderData;
  created_time: string;
  total_received: string;
  reconciliation_date: string;
  offset_records: any[];
}

// 6. CartData
// -------------------------
interface CartData {
  id: number;
  cart_token: string;
  status: number;
  email: string;
  orderData: OrderData;
  created_time: string;
}

// 7. OrderData
// -------------------------
interface OrderData {
  cash_flow?: EcCashFlow | PayNowCashFlow;
  distribution_info?: {
    code: string;
    condition: number;
    link: string;
    recommend_medium: any;
    recommend_status: string;
    recommend_user: any;
    redirect: string;
    relative: string;
    relative_data: any;
    share_type: string;
    share_value: number;
    startDate: string;
    startTime: string;
    status: boolean;
    title: string;
    voucher: number;
    voucher_status: string;
  };
  archived: 'true' | 'false';
  customer_info: any;
  editRecord: any;
  method: string;
  shipment_selector: {
    name: string;
    value: string;
    form: any;
  }[];
  orderStatus: string;
  use_wallet: number;
  email: string;
  total: number;
  discount: number;
  expectDate: string;
  shipment_fee: number;
  use_rebate: number;
  lineItems: {
    id: number;
    spec: string[];
    count: string;
    sale_price: number;
    title: string;
    sku: string;
  }[];
  user_info: {
    name: string;
    email: string;
    phone: string;
    city?: string;
    area?: string;
    shipment_date: string;
    shipment_refer: string;
    address: string;
    shipment_number?: string;
    custom_form_delivery?: any;
    shipment:
      | 'normal'
      | 'FAMIC2C'
      | 'UNIMARTC2C'
      | 'HILIFEC2C'
      | 'OKMARTC2C'
      | 'now'
      | 'shop'
      | 'global_express'
      | 'UNIMARTFREEZE'
      | 'black_cat_freezing'
      | 'black_cat';
    CVSStoreName: string;
    CVSStoreID: string;
    CVSTelephone: string;
    MerchantTradeNo: string;
    CVSAddress: string;
    note?: string;
    code_note?: string;
    shipment_detail?: any;
  };
  custom_receipt_form?: any;
  custom_form_format?: any;
  custom_form_data?: any;
  proof_purchase: any;
  progress: string;
  order_note: string;
  voucherList: [
    {
      title: string;
      method: 'percent' | 'fixed';
      trigger: 'auto' | 'code';
      value: string;
      for: 'collection' | 'product';
      rule: 'min_price' | 'min_count';
      forKey: string[];
      ruleValue: number;
      startDate: string;
      startTime: string;
      endDate?: string;
      endTime?: string;
      status: 0 | 1 | -1;
      type: 'voucher';
      code?: string;
      overlay: boolean;
      bind?: {
        id: string;
        spec: string[];
        count: number;
        sale_price: number;
        collection: string[];
        discount_price: number;
      }[];
      start_ISO_Date: string;
      end_ISO_Date: string;
    },
  ];
  orderSource?: string;
  deliveryData: Record<string, string>;
  pos_info: {
    payment: 'cash' | 'credit' | 'line_pay';
    who: {
      id: number;
      user: string;
      config: {
        pin: string;
        auth: any;
        name: string;
        phone: string;
        title: string;
        come_from: string;
        member_id: string;
        verifyEmail: string;
      };
      status: 1;
    };
  };
}

interface OrderQuery {
  isPOS?: boolean;
  isArchived?: boolean;
  isShipment?: boolean;
}
