interface VoucherData {
  id: number;
  title: string;
  method: 'percent' | 'fixed';
  reBackType: 'rebate' | 'discount' | 'shipment_free';
  trigger: 'auto' | 'code';
  value: number | string;
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
  distribution_info?: DistributionInfo;
  archived: 'true' | 'false';
  customer_info: any;
  editRecord: any;
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
  custom_receipt_form?: any;
  custom_form_format?: any;
  custom_form_data?: any;
  proof_purchase: any;
  progress: string;
  order_note: string;
  voucherList: Voucher[];
  orderSource?: string;
  deliveryData: Record<string, string>;
  pos_info: POSInfo;
}

interface DistributionInfo {
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
  custom_form_delivery?: any;
  shipment: ShipmentMethod;
  CVSStoreName: string;
  CVSStoreID: string;
  CVSTelephone: string;
  MerchantTradeNo: string;
  CVSAddress: string;
  note?: string;
  code_note?: string;
  shipment_detail?: any;
  state: string;
  company: string;
  country: string;
  gui_number: string;
  postal_code: string;
  invoice_type: string;
  [key: string]: any;
}

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

interface OrderQuery {
  isPOS?: boolean;
  isArchived?: boolean;
  isShipment?: boolean;
}

interface Invoice {
  invoice_no: string;
  invoice_data: InvoiceData;
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
  user_data: UserData;
}

interface InvoiceData {
  response: ResponseData;
  orderData: OrderData;
  original_data: OriginalData;
}

interface ResponseData {
  RtnMsg: string;
  RtnCode: number;
  InvoiceNo: string;
  InvoiceDate: string;
  RandomNumber: string;
}

interface LineItem {
  id: number;
  sku: string;
  spec: string[];
  count: number;
  specs: Spec[];
  stock: number;
  title: string;
  rebate: number;
  weight: number;
  is_gift: boolean;
  is_hidden: boolean;
  stockList: Record<string, StockCount>;
  collection: string[];
  sale_price: number;
  origin_price: number;
  shipment_obj: ShipmentObject;
  language_data: LanguageData;
  preview_image: string;
  discount_price: number;
  is_add_on_items: boolean;
  product_category: string;
  show_understocking: string;
  designated_logistics: DesignatedLogistics;
}

interface Spec {
  title: string;
  option: Option[];
  language_title: Record<string, string>;
}

interface Option {
  title: string;
  expand: boolean;
  language_title: Record<string, string>;
}

interface StockCount {
  count: number;
}

interface ShipmentObject {
  type: string;
  value: number;
}

interface LanguageData {
  [key: string]: LanguageContent;
}

interface LanguageContent {
  seo: SEO;
  title: string;
  content: string;
  content_array: any[];
}

interface SEO {
  title: string;
  domain: string;
  content: string;
  keywords: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  payment_select: string;
}

interface RebateInfo {
  point: number;
  status: boolean;
}

interface PaymentSetting {
  key: string;
  name: string;
  custome_name?: string;
}

interface OfflineSupport {
  atm: boolean;
  line: boolean;
  cash_on_delivery: boolean;
  [key: string]: boolean;
}

interface PaymentInfoAtm {
  text: string;
  bank_code: string;
  bank_name: string;
  bank_user: string;
  bank_account: string;
  shipmentSupport: string[];
}

interface ShipmentSelector {
  name: string;
  value: string;
  isExcludedByTotal?: boolean;
  isExcludedByWeight?: boolean;
  form: any;
}

interface PaymentInfoCustom {
  id: string;
  name: string;
  text: string;
  shipmentSupport: any[];
}

interface PaymentCustomerForm {
  id: string;
  list: CustomerFormField[];
}

interface CustomerFormField {
  col: string;
  key: string;
  page: string;
  type: string;
  group: string;
  title: string;
  col_sm: string;
  toggle: boolean;
  appName: string;
  require: boolean;
  readonly: string;
  formFormat: string;
  style_data: StyleData;
  form_config: FormConfig;
}

interface StyleData {
  input: StyleItem;
  label: StyleItem;
  container: StyleItem;
}

interface StyleItem {
  list: any[];
  class: string;
  style: string;
  version: string;
}

interface FormConfig {
  type: string;
  title: string;
  input_style: { list: any[]; version: string };
  title_style: { list: any[]; version: string };
  place_holder: string;
}

interface PaymentInfoLinePay {
  text: string;
  shipmentSupport: string[];
}

interface OriginalData {
  Items: OriginalItem[];
  Print: string;
  InvType: string;
  TaxType: string;
  Donation: string;
  LoveCode: string;
  CarrierNum: string;
  CustomerID: string;
  MerchantID: string;
  CarrierType: string;
  SalesAmount: number;
  CustomerAddr: string;
  CustomerName: string;
  RelateNumber: string;
  ClearanceMark: string;
  CustomerEmail: string;
  CustomerPhone: string;
  CustomerIdentifier: string;
}

interface OriginalItem {
  ItemSeq: number;
  ItemName: string;
  ItemWord: string;
  ItemCount: number;
  ItemPrice: number;
  ItemAmount: number;
  ItemRemark: string;
  ItemTaxType: number;
}
