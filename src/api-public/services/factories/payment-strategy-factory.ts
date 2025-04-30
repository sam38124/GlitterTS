import { IPaymentStrategy } from '../interface/payment-strategy-interface.js';
import { EcPayStrategy } from '../strategies/ecpay-strategy.js';
import { EzPayStrategy } from '../strategies/ezpay-strategy.js';
import { PayPalStrategy } from '../strategies/paypal-strategy.js';
import { LinePayStrategy } from '../strategies/linepay-strategy.js';
import { JkoPayStrategy } from '../strategies/jkopay-strategy';
import { EcEzPayKeyData } from '../interface/payment-keys-interface';
import { PayNowStrategy } from '../strategies/paynow-strategy';
// 定義每個策略設定項目的型別
interface StrategyConfigEntry {
  key: string;
  strategyClass: new (keys: any) => IPaymentStrategy;
}

const paymentStrategyConfigurations: StrategyConfigEntry[] = [
  { key: 'ecPay',    strategyClass: EcPayStrategy },
  { key: 'newWebPay', strategyClass: EzPayStrategy },
  { key: 'paypal',   strategyClass: PayPalStrategy },
  { key: 'line_pay',   strategyClass: LinePayStrategy },
  { key: 'jkopay',   strategyClass: JkoPayStrategy },
  { key: 'paynow',   strategyClass: PayNowStrategy },
];


export class PaymentStrategyFactory {
  // 如果策略的創建需要依賴，可以注入到工廠的建構子
  private allKeyData: Record<string, any>;
  constructor(loadedKeyData: Record<string, any>) {
    if (!loadedKeyData) {
      throw new Error("KeyData must be provided to PaymentStrategyFactory");
    }
    this.allKeyData = loadedKeyData;
  }

  public createStrategyRegistry(): Map<string, IPaymentStrategy> {
    const strategies = new Map<string, IPaymentStrategy>();

// **** 使用迴圈處理 strategyConfigs ****
    paymentStrategyConfigurations.forEach(config => {
      // 從 allKeyData 中獲取該策略所需的特定金鑰物件
      const specificKeyData = this.allKeyData[config.key];

      if (specificKeyData) {
        try {
          const strategyInstance = new config.strategyClass(specificKeyData);
          strategies.set(config.key, strategyInstance);
          console.log(`Strategy registered for key: ${config.key}`);
        } catch (error) {
          // 捕捉並記錄實例化過程中可能發生的錯誤
          console.error(`Error instantiating strategy for key '${config.key}':`, error);
          console.warn(`Strategy for '${config.key}' will not be available.`);
        }
      } else {
        // 如果在 allKeyData 中找不到對應的金鑰資料，則發出警告
        console.warn(`Key data for '${config.key}' not found in provided configuration. Strategy not available.`);
      }
    });
    //
    // strategies.set('newWebPay', new EzPayStrategy());
    // strategies.set('paypal', new PayPalStrategy());
    // strategies.set('line_pay', new LinePayStrategy());
    // strategies.set('jkopay', new JkoPayStrategy());
    // strategies.set('paynow', new PayNowStrategy(/* ... */));
    // strategies.set('off_line', new OfflineStrategy(/* ... */)); // 線下也視為一種策略

    console.log(`PaymentStrategyFactory: Registry created with ${strategies.size} strategies.`);
    return strategies;
  }


}