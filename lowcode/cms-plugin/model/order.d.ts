type Status = 0 | 1 | -1;
type VoucherMethod = 'percent' | 'fixed';
type ReBackType = 'rebate' | 'discount' | 'shipment_free';
type TriggerType = 'auto' | 'code';
type VoucherFor = 'collection' | 'product' | 'all';
type VoucherRule = 'min_price' | 'min_count';
type FilterType = 'normal' | 'block' | 'pos' | 'all';
type PaymentMethod = 'ATM' | 'CreditCard' | 'ConvenienceStore';
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
  | 'black_cat';

type ViewModelType = 'list' | 'add' | 'replace' | 'select' | 'createInvoice' | 'viewInvoice' | 'recommend';

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
  cash_flow: PaymentFlow;
  editRecord: EditRecord[];
  distribution_info?: DistributionInfo;
  archived: 'true' | 'false';
  customer_info: UserInfo;
  method: string;
  shipment_selector: ShipmentSelector[];
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
  proof_purchase: any;
  progress: string;
  order_note: string;
  voucherList: VoucherData[];
  orderSource?: string;
  deliveryData: Record<string, string>;
  pos_info: POSInfo;
  custom_receipt_form?: any;
  custom_form_format?: any;
  custom_form_data?: any;
}

interface PaymentFlow {
  amount?: number;
  HandlingCharge?: string;
  PaymentType: PaymentMethod;
  PaymentDate?: string;
  TradeStatus?: '0' | '1' | '10200095';
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
  city?: string;
  area?: string;
  shipment_date: string;
  shipment_refer: string;
  address: string;
  shipment_number?: string;
  state: string;
  company: string;
  country: string;
  postal_code: string;
  invoice_type: string;
  [key: string]: any;
}

interface POSInfo {
  payment: 'cash' | 'credit' | 'line_pay';
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
  sku: string;
  spec: string[];
  count: number;
  stock: number;
  title: string;
  rebate: number;
  weight: number;
  is_gift: boolean;
  sale_price: number;
  origin_price: number;
  discount_price: number;
}

interface OrderQuery {
  isPOS?: boolean;
  isArchived?: boolean;
  isShipment?: boolean;
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
