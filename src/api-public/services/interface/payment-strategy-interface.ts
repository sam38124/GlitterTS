import { Cart } from '../shopping.js';
import { KeyData } from '../financial-serviceV2.js';

// export interface KeyData {
//   MERCHANT_ID: string;
//   HASH_KEY: string;
//   HASH_IV: string;
//   NotifyURL: string;
//   ReturnURL: string;
//   ActionURL: string;
//   TYPE: string;
//   CreditCheckCode?: string;
// }

/**
 * 定義支付策略執行後的回傳結果結構
 */
export interface PaymentResult {
  form?: string;         // For EcPay, EzPay HTML form string
  orderId?:string;       // For PayPal redirect link
  approveLink?:string;   // For PayPal redirect link
  responseData?: any;    // For LinePay, JKOpay API response
  off_line?: boolean;    // Flag for offline payment
  error?: string;        // Optional error message
}

/**
 * 定義傳遞給策略的通用設定物件結構
 */
export interface PaymentConfig {
  app: string;              // App 名稱/ID
  id: string;               // 產生的 redirect id (用於 ReturnURL)
  domain: string;           // process.env.DOMAIN
//   這裡還有line jko...的方式
}

/**
 * 定義支付策略的通用介面 (合約)
 */
export interface IPaymentStrategy {
  /**
   * 啟動支付流程
   * @param orderData - 訂單相關資料 (建議使用更精確的型別取代 any)
   * @param config - 通用的支付設定檔
   * @returns 一個 Promise，解析後為標準化的 PaymentResult
   */
  initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult>;
}