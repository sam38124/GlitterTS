import { Private_config } from '../../../services/private_config.js';

class PaymentTransaction {
  private readonly app: string;
  private kd: any;
  private readonly payment_select: string;

  constructor(app: string, payment_select: string) {
    this.app = app;
    this.payment_select = payment_select;
  }

  async createInstance() {
    try {
      const keyData = (
        await Private_config.getConfig({
          appName: this.app,
          key: 'glitter_finance',
        })
      )[0].value;
      this.kd = keyData[this.payment_select] ?? {
        ReturnURL: '',
        NotifyURL: '',
      };
    } catch (error) {
      // 處理非同步操作中的錯誤，例如拋出更明確的例外
      throw new Error(`Failed to create MyClass instance: ${error}`);
    }
  }

  async processPayment(carData: any, return_url: string): Promise<any> {
    if (!this.kd) {
      await this.createInstance();
    }
  }
}

export default PaymentTransaction;
