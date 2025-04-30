import { IPaymentStrategy, PaymentConfig, PaymentResult } from './interface/payment-strategy-interface.js';
import { KeyData } from './financial-serviceV2.js';
import { Cart } from './shopping.js';
import redis from '../../modules/redis.js';
import Tool from '../../modules/tool.js';
import { Private_config } from '../../services/private_config';
import { OrderEvent } from './order-event';

export class PaymentService {
  private kd: KeyData | undefined; // KeyData 型別來自 interface 檔案
  private app: string;
  private domain: string;
  private payment_select: string;
  // **** 依賴注入：透過建構子傳入所有可用的策略 Map ****
  constructor(
    private paymentStrategies: Map<string, IPaymentStrategy>,
    appName: string,
    payment_select: string
  ) {
    this.paymentStrategies = paymentStrategies;
    this.app = appName;
    // 實際應用中 DOMAIN 應來自環境變數
    this.domain = process.env.DOMAIN || ''; //
    this.payment_select = payment_select;
    if (!process.env.DOMAIN) console.warn('DOMAIN environment variable is not set! Using default.');
  }

  // 載入 keyData 的方法
  private async createInstance() {
    console.info('執行 createInstance 載入金流資料...');
    const keyData = (
      await Private_config.getConfig({
        appName: this.app,
        key: 'glitter_finance',
      })
    )[0].value;
    if (keyData) {
      this.kd = keyData[this.payment_select] ?? {
        ReturnURL: '',
        NotifyURL: '',
      };
      console.log('金流資料載入完成 。');
    } else {
      console.log('金流資料載入錯誤 。');
    }
  }

  /**
   * 處理支付流程（重構後）
   * @param carData 訂單/購物車資料
   * @param return_url
   * @param payment_select 使用者選擇的支付方式 key (例如 'ecPay', 'line_pay')
   * @returns 標準化的支付結果 PaymentResult
   */
  async processPayment(carData: Cart, return_url: string, payment_select: string): Promise<PaymentResult> {
    // 1. 確保 keyData 已載入
    if (!this.kd) {
      await this.createInstance();
    }
    if (!this.kd) {
      console.error('無法載入支付金鑰資料 (keyData)。');
      return { error: '無法載入支付金鑰資料，請聯繫管理員。' }; // 回傳錯誤結果
    }

    // 2. 產生並儲存 Redis ID 並且把前端指定的return_url塞進去
    // Generate notify redirect id
    const id = 'redirect_' + Tool.randomString(6);
    //前端希望跳轉的頁面
    const redirect_url = new URL(return_url);
    redirect_url.searchParams.set('cart_token', carData.orderID);
    await redis.setValue(id, redirect_url.href);

    // 3. 從注入的 Map 中查找對應的策略物件
    const strategy = this.paymentStrategies.get(payment_select);

    // 4. 如果找不到策略，處理預設情況或錯誤
    if (!strategy) {
      console.warn(`找不到支付方式 "${payment_select}" 的處理策略，將使用預設線下處理。`);
      const offlineStrategy = this.paymentStrategies.get('off_line');
      if (offlineStrategy) {
        const offlineConfig: PaymentConfig = {
          app: this.app,
          id: id,
          domain: this.domain,
        };
        // 委派給線下策略
        return await offlineStrategy.initiatePayment(carData, offlineConfig);
      } else {
        console.error(`不支援的支付方式: ${payment_select}，且找不到預設處理方式。`);
        return { error: `不支援的支付方式: ${payment_select}` };
      }
    }

    // 5. 準備通用的設定物件傳給策略
    const config: PaymentConfig = {
      app: this.app,
      id: id,
      domain: this.domain,
    };



    // 6. 呼叫選中策略的 initiatePayment 方法，並回傳結果
    try {
      return await strategy.initiatePayment(carData, config);
    } catch (paymentError) {
      console.error(`支付方式 "${payment_select}" 處理失敗:`, paymentError);
      const errorMessage = paymentError instanceof Error ? paymentError.message : String(paymentError);
      return { error: `支付處理失敗: ${errorMessage}` };
    }
  }
}