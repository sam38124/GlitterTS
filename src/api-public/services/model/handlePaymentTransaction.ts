import db from '../../../modules/database.js';
import {saasConfig} from '../../../config.js';
import axios from 'axios';
import {App} from '../../../services/app.js';
import process from "process";
import {User} from "../user";
import { CustomerSessions } from '../customer-sessions';
import FinancialService, { JKO, LinePay, PayNow, PayPal } from '../financial-service.js';
import { Private_config } from '../../../services/private_config.js';
import Tool from '../../../modules/tool.js';
import redis from '../../../modules/redis';

const mime = require('mime');


class PaymentTransaction {
  private readonly app: string;
  private kd: any;
  private readonly payment_select: string;

  constructor(app: string, payment_select: string,) {
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

  async processPayment(carData:any , return_url:string): Promise<any> {
    if (!this.kd){
      await this.createInstance();
    }
    const id = 'redirect_' + Tool.randomString(6);
    await redis.setValue(id, return_url);

    switch (this.payment_select) {
      case 'ecPay':
      case 'newWebPay':
        const subMitData = await new FinancialService(this.app, {
          HASH_IV: this.kd.HASH_IV,
          HASH_KEY: this.kd.HASH_KEY,
          ActionURL: this.kd.ActionURL,
          NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`,
          ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
          MERCHANT_ID: this.kd.MERCHANT_ID,
          TYPE: this.payment_select,
        }).createOrderPage(carData);
        return { form: subMitData };
      case 'paypal':
        this.kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`;
        this.kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
        return await new PayPal(this.app, this.kd).checkout(carData);
      case 'line_pay':
        this.kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${this.payment_select}`;
        this.kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${this.payment_select}`;
        return await new LinePay(this.app, this.kd).createOrder(carData);
      case 'paynow': {
        this.kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
        this.kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&paynow=true&type=${carData.customer_info.payment_select}`;
        return await new PayNow(this.app , this.kd).createOrder(carData);
      }
      case 'jkopay': {
        this.kd.ReturnURL = `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&jkopay=true&return=${id}`;
        this.kd.NotifyURL = `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=jkopay&return=${id}`;
        return await new JKO(this.app, this.kd).createOrder(carData);
      }

      default: {
        carData.method = 'off_line';
        return ``;
      }
      //
      //   if (carData.customer_info.lineID) {
      //     await this.lineMessage.sendCustomerLine('auto-line-order-create', carData.orderID, carData.customer_info.lineID);
      //     console.info('訂單line訊息寄送成功');
      //   }
      //
      //   for (const email of new Set([carData.customer_info, carData.user_info].map(dd => dd && dd.email))) {
      //     if (email) {
      //       this.autoSendEmail.customerOrder(this.app, 'auto-email-order-create', carData.orderID, email, carData.language!!);
      //     }
      //   }
      //
      //   await this.releaseVoucherHistory(carData.orderID, 1);
      //   this.checkPoint('default release checkout');
      //   return { off_line: true, return_url: `${this.processEnvDomain}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}` };
    }
  }
}

export default PaymentTransaction;


