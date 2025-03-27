import tool from '../../modules/tool.js';
import redis from '../../modules/redis.js';
import process from 'process';
import CryptoJS from 'crypto-js';
import { createHash } from 'crypto';
import { Private_config } from '../../services/private_config.js';
import { ShipmentConfig } from '../config/shipment-config.js';
import axios from 'axios';
import db from '../../modules/database.js';
import { CheckoutService } from './checkout.js';
import { Shopping } from './shopping.js';
import { User } from './user.js';

const html = String.raw;

export class PayNowLogistics {
  static printStack:{
    code:string,
    html:string
  }[]=[]
  app_name: string;

  constructor(app_name: string) {
    this.app_name = app_name;
  }

  async config() {
    const deliveryConfig = (
      await Private_config.getConfig({
        appName: this.app_name,
        key: 'glitter_delivery',
      })
    )[0];

    return {
      pwd: deliveryConfig.value.pay_now.pwd,
      link:
        deliveryConfig.value.pay_now.Action === 'test'
          ? `https://testlogistic.paynow.com.tw`
          : `https://logistic.paynow.com.tw`,
      toggle: deliveryConfig.value.pay_now.toggle,
      account: deliveryConfig.value.pay_now.account,
      sender_name: deliveryConfig.value.pay_now.SenderName,
      sender_phone: deliveryConfig.value.pay_now.SenderCellPhone,
      sender_address: deliveryConfig.value.pay_now.SenderAddress,
      sender_email: deliveryConfig.value.pay_now.SenderEmail,
    };
  }

  //超商選擇門市
  async choseLogistics(type: string, return_url: string) {
    const key = tool.randomString(6);
    await redis.setValue('redirect_' + key, return_url);
    const shipment_config = await new User(this.app_name).getConfigV2({
      key: `shipment_config_${type}`,
      user_id: 'manager',
    });
    let deliveryConfig = (
      await Private_config.getConfig({
        appName: this.app_name,
        key: 'glitter_delivery',
      })
    )[0];
    deliveryConfig = (deliveryConfig && deliveryConfig.value && deliveryConfig.value.pay_now) || {};

    const code = await this.encrypt(deliveryConfig.pwd || (process.env.logistic_apicode as string));
    const cf: any = {
      user_account: deliveryConfig.account || process.env.logistic_account,
      apicode: encodeURIComponent(code as string),
      Logistic_serviceID: (() => {
        const paynow_id = ShipmentConfig.list.find(dd => {
          return dd.value === type;
        })!!.paynow_id;
        if (shipment_config.bulk) {
          if (paynow_id === '01') {
            return '02';
          } else if (paynow_id === '21') {
            return '22';
          } else if (paynow_id === '03') {
            return '04';
          } else if (paynow_id === '23') {
            return '24';
          } else {
            return `-1`;
          }
        } else {
          return paynow_id;
        }
      })(),
      returnUrl: `${process.env.DOMAIN}/api-public/v1/ec/logistics/redirect?g-app=${this.app_name}&return=${key}`,
    };
    // console.log(`Logistic_serviceID`,cf.Logistic_serviceID)
    return html`
      <form
        action="https://logistic.paynow.com.tw/Member/Order/Choselogistics"
        method="post"
        enctype="application/x-www-form-urlencoded"
        accept="text/html"
      >
        ${Object.keys(cf)
          .map(dd => {
            return `<input type="hidden" name="${dd}" id="${dd}" value="${cf[dd]}"/>`;
          })
          .join('\n')}
        <button type="submit" class="btn btn-secondary custom-btn beside-btn d-none" id="submit" hidden></button>
      </form>
    `;
  }

  //取消托運單
  async deleteLogOrder(orderNO: string, logisticNumber: string, totalAmount: string) {
    const l_config = await this.config();
    const url = `${l_config.link}/api/Orderapi/CancelOrder`;
    const data: any = {
      LogisticNumber: logisticNumber,
      sno: 1,
      PassCode: await this.sha1Encrypt([l_config.account, orderNO, totalAmount, l_config.pwd].join('')),
    };
    //轉成純字串
    Object.keys(data).map(dd => {
      data[dd] = `${data[dd]}`;
    });
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/JSON',
      },
      data: data,
    };
    const response = await axios(config);
    console.log(`response_data==>`, response.data);
    if (response.data && !response.data.includes('已繳費') && !response.data.includes('已寄件') && !response.data.includes('出貨中')) {
      const order = (
        await db.query(
          `select *
           from \`${this.app_name}\`.t_checkout
           where cart_token = ?`,
          [orderNO]
        )
      )[0];
      delete order.orderData.user_info.shipment_number;
      delete order.orderData.user_info.shipment_refer;
      await new Shopping(this.app_name).putOrder({
        cart_token: orderNO,
        orderData: order.orderData,
        status: undefined,
      });
    }
    return response.data;
  }

  //查詢物流單
  async getOrderInfo(orderNO: string) {
    try {
      const l_config = await this.config();
      const url = `${l_config.link}/api/Orderapi/Get_Order_Info_orderno?orderno=${orderNO}&user_account=${l_config.account}&sno=1`;
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/JSON',
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (e: any) {
      console.log(e);
      return {
        status: e.status,
      };
    }
  }

  //列印托運單
  async printLogisticsOrder(carData: any) {
    const l_config = await this.config();
    const url = `${l_config.link}/api/Orderapi/Add_Order`;
    const shipment_config = await new User(this.app_name).getConfigV2({
      key: `shipment_config_${carData.user_info.shipment}`,
      user_id: 'manager',
    });
    const service = (() => {
      const paynow_id = ShipmentConfig.list.find(dd => {
        return dd.value === carData.user_info.shipment;
      })!!.paynow_id;
      if (shipment_config.bulk) {
        if (paynow_id === '01') {
          return '02';
        } else if (paynow_id === '21') {
          return '22';
        } else if (paynow_id === '03') {
          return '04';
        } else if (paynow_id === '23') {
          return '24';
        } else {
          return `-1`;
        }
      } else {
        return paynow_id;
      }
    })();

    const data: any = await (async () => {
      if (service === '36') {
        return {
          user_account: l_config.account,
          apicode: l_config.pwd,
          Logistic_service: service,
          OrderNo: carData.orderID,
          DeliverMode: carData.customer_info.payment_select == 'cash_on_delivery' ? '01' : '02',
          TotalAmount: carData.total,
          receiver_storeid: carData.user_info.CVSStoreID,
          receiver_storename: carData.user_info.CVSStoreName,
          return_storeid: '',
          Receiver_Name: carData.user_info.name,
          Receiver_Phone: carData.user_info.phone,
          Receiver_Email: carData.user_info.email,
          Receiver_address: carData.user_info.address,
          Sender_Name: l_config.sender_name,
          Sender_Phone: l_config.sender_phone,
          Sender_Email: l_config.sender_email,
          Sender_address: l_config.sender_address,
          Length: carData.user_info.length,
          Wide: carData.user_info.wide,
          High: carData.user_info.high,
          Weight: carData.user_info.weight,
          DeliveryType: (() => {
            switch (carData.user_info.shipment) {
              case 'black_cat':
                return '0001';
              case 'black_cat_ice':
                return '0002';
              case 'black_cat_freezing':
                return '0003';
            }
          })(),
          Remark: '',
          Description: '',
          PassCode: await this.sha1Encrypt([l_config.account, carData.orderID, carData.total, l_config.pwd].join('')),
        };
      } else {
        return {
          user_account: l_config.account,
          apicode: l_config.pwd,
          Logistic_service: service,
          OrderNo: carData.orderID,
          DeliverMode: carData.customer_info.payment_select == 'cash_on_delivery' ? '01' : '02',
          TotalAmount: carData.total,
          receiver_storeid: carData.user_info.CVSStoreID,
          receiver_storename: carData.user_info.CVSStoreName,
          return_storeid: '',
          Receiver_Name: carData.user_info.name,
          Receiver_Phone: carData.user_info.phone,
          Receiver_Email: carData.user_info.email,
          Receiver_address: carData.user_info.CVSAddress,
          Sender_Name: l_config.sender_name,
          Sender_Phone: l_config.sender_phone,
          Sender_Email: l_config.sender_email,
          Sender_address: l_config.sender_address,
          Remark: '',
          Description: '',
          PassCode: await this.sha1Encrypt([l_config.account, carData.orderID, carData.total, l_config.pwd].join('')),
        };

      }
    })();
    console.log(`add-order-data==>`, data);
    function getDaysDifference(date1: Date, date2: Date) {
      // 獲取毫秒時間戳，使用 Math.abs() 確保不受前後順序影響
      const timeDifference = Math.abs(date2.getTime() - date1.getTime());
      // 將毫秒轉換為天數 (1 天 = 1000 毫秒 * 60 秒 * 60 分鐘 * 24 小時)
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return daysDifference;
    }

    if (service === '36') {
      data.Deadline = '0';
    } else if (['02', '22', '04', '24'].includes(service as string)) {
      data.Deadline = getDaysDifference(new Date(), new Date(carData.user_info.shipment_date));
    }
    //轉成純字串
    Object.keys(data).map(dd => {
      data[dd] = `${data[dd]}`;
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/JSON',
      },
      data: {
        JsonOrder: await this.encrypt(JSON.stringify(data)),
      },
    };
    const response = await axios(config);
    console.log(`response_data==>`, response.data);
    return response.data;
  }

  async encrypt(content: string) {
    try {
      var ivbyte = CryptoJS.enc.Utf8.parse('12345678');
      console.log(`ivbyte=>`, ivbyte);
      const encrypted = CryptoJS.TripleDES.encrypt(
        CryptoJS.enc.Utf8.parse(content),
        CryptoJS.enc.Utf8.parse('123456789070828783123456'),
        {
          iv: ivbyte, // 当 mode 为 CBC 时，偏移量必传
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.ZeroPadding,
        }
      );
      // mBcTYds3zPQ=
      // tB5BKj5AMGw=
      // W1BhPWN3FAI= 這是對的
      return encrypted.toString();
    } catch (e) {
      console.error(e);
    }
  }

  async sha1Encrypt(data: string) {
    const hash = createHash('sha1').update(data, 'utf8').digest('hex');
    return hash.toUpperCase();
  }
}
