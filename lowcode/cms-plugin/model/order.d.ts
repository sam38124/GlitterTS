type Status = 0 | 1 | -1;
type VoucherMethod = 'percent' | 'fixed';
type VoucherFor = 'collection' | 'product' | 'all';
type VoucherRule = 'min_price' | 'min_count';
type ReBackType = 'rebate' | 'discount' | 'shipment_free';
type TriggerType = 'auto' | 'code';
type FilterType = 'normal' | 'block' | 'pos' | 'all';
type ShipmentMethod =
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
  | 'black_cat'
  | 'FAMIC2CFREEZE';
type PaymentMethod = 'ATM' | 'CreditCard' | 'ConvenienceStore';
type ViewModelType = 'list' | 'add' | 'replace' | 'select' | 'createInvoice' | 'viewInvoice' | 'recommend';
type POSPayment = 'cash' | 'credit' | 'line_pay';
type TradeStatus = '0' | '1' | '10200095';

interface EditRecord {
  time: string;
  record: string;
}

interface VoucherData {
  id: number;
  title: string;
  method: VoucherMethod;
  reBackType: ReBackType;
  trigger: TriggerType;
  value: number | string;
  for: VoucherFor;
  rule: VoucherRule;
  forKey: string[];
  ruleValue: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  status: Status;
  type: 'voucher';
  code?: string;
  overlay: boolean;
  bind?: Bind[];
  start_ISO_Date: string;
  end_ISO_Date: string;
  discount_total: number;
  rebate_total: number;
  target: string;
  targetList: string[];
}

interface Bind {
  id: string;
  spec: string[];
  count: number;
  sale_price: number;
  collection: string[];
  discount_price: number;
  rebate: number;
  shipment_fee: number;
}

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

interface CartData {
  id: number;
  cart_token: string;
  status: number;
  email: string;
  orderData: OrderData;
  created_time: string;
}

interface OrderData {
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
  lineItems: LineItem[];
  user_info: UserInfo;
  custom_receipt_form?: any;
  custom_form_format?: any;
  custom_form_data?: any;
  proof_purchase: any;
  progress: string;
  order_note: string;
  voucherList: VoucherData[];
  orderSource?: string;
  deliveryData: Record<string, string>;
  cash_flow: PaymentFlow;
  pos_info: POSInfo;
  tags?: string[];
  fbp?: string;
  fbc?:string;
}

interface PaymentFlow {
  amount?: number;
  HandlingCharge?: string;
  PaymentType: PaymentMethod;
  PaymentDate?: string;
  TradeStatus?: TradeStatus;
  TradeAmt: string;
  TradeNo: string;
  credit_receipt?: any;
  payment: {
    paymentMethod: PaymentMethod;
    paidAt: string;
  };
  status: string;
}

interface ShipmentSelector {
  name: string;
  value: string;
  isExcludedByTotal?: boolean;
  isExcludedByWeight?: boolean;
  form: any;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  shipment: ShipmentMethod;
  CVSStoreName: string;
  CVSStoreID: string;
  CVSTelephone: string;
  MerchantTradeNo: string;
  CVSAddress: string;
  note: string;
  city?: string;
  area?: string;
  shipment_date: string;
  shipment_refer: string;
  shipment_number?: string;
  state: string;
  company: string;
  country: string;
  postal_code: string;
  invoice_type: string;
  custom_form_delivery?: any;
  shipment_detail?: any;
  code_note?: string;
  [key: string]: any;
}

interface POSInfo {
  payment: POSPayment;
  who: {
    id: number;
    user: string;
    config: POSConfig;
    status: 1;
  };
}

interface POSConfig {
  pin: string;
  auth: any;
  name: string;
  phone: string;
  title: string;
  come_from: string;
  member_id: string;
  verifyEmail: string;
}

interface LineItem {
  id: number;
  spec: string[];
  count: number;
  sale_price: number;
  sku: string;
  rebate: number;
  weight: number;
  is_gift: boolean;
  origin_price: number;
  discount_price: number;
  title?: string;
  preview_image?: string;
  deduction_log?: any;
}

interface OrderQuery {
  isPOS?: boolean;
  isArchived?: boolean;
  isShipment?: boolean;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  payment_select?: string;
}

interface ViewModel {
  id: string;
  loading: boolean;
  filterId: string;
  type: ViewModelType;
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
  filter_type: FilterType;
  apiJSON: any;
  checkedData: any[];
  headerConfig: string[];
  listLimit: number;
}

interface Invoice {
  invoice_no: string;
  invoice_data: any;
  invoice_status: number;
  id: number;
  cart_token: string;
  status: number;
  email: string;
  orderData: OrderData;
  created_time: string;
  total: number;
  order_status: string;
  payment_method: string;
  shipment_method: string;
  shipment_date: string | null;
  progress: string;
  shipment_number: string | null;
  total_received: number | null;
  offset_amount: number | null;
  offset_reason: string | null;
  offset_records: any | null;
  reconciliation_date: string | null;
  order_source: string | null;
  archived: any | null;
  customer_name: string;
  shipment_name: string;
  customer_email: string;
  shipment_email: string;
  customer_phone: string;
  shipment_phone: string;
  shipment_address: string;
  invoice_number: string;
  user_data: any;
}
