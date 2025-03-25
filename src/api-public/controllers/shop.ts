import express from 'express';
import response from '../../modules/response';
import multer from 'multer';
import exception from '../../modules/exception';
import db from '../../modules/database.js';
import redis from '../../modules/redis.js';
import axios from 'axios';
import { UtDatabase } from '../utils/ut-database.js';
import { UtPermission } from '../utils/ut-permission';
import { EcPay, EzPay, JKO, LinePay, PayNow, PayPal } from '../services/financial-service.js';
import { Private_config } from '../../services/private_config.js';
import { User } from '../services/user.js';
import { Post } from '../services/post.js';
import { Shopping, VoucherData } from '../services/shopping';
import { DataAnalyze } from '../services/data-analyze';
import { Rebate, IRebateSearch } from '../services/rebate';
import { Pos } from '../services/pos.js';
import { FbApi } from '../services/fb-api.js';
import { ShopnexLineMessage } from '../services/model/shopnex-line-message';

const router: express.Router = express.Router();
export = router;

// 多線程範例
router.post('/worker', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new DataAnalyze(req.get('g-app') as string, req.body.token).workerExample({
        type: req.body.type,
        divisor: req.body.divisor,
      })
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 多國貨幣
router.get('/currency-covert', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, { data: await Shopping.currencyCovert((req.query.base || 'TWD') as string) });
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 購物金
router.get('/rebate', async (req: express.Request, resp: express.Response) => {
  try {
    const app = req.get('g-app') as string;
    const rebateClass = new Rebate(app);

    if (await UtPermission.isManager(req)) {
      return response.succ(resp, await rebateClass.getRebateListByRow(req.query as unknown as IRebateSearch));
    }

    const user = await new User(app).getUserData(req.body.token.userID, 'userID');
    if (user.id) {
      const historyList = await rebateClass.getCustomerRebateHistory({ user_id: req.body.token.userID });
      const oldest = await rebateClass.getOldestRebate(req.body.token.userID);
      const historyMaps = historyList
        ? historyList.data.map((item: any) => {
            return {
              id: item.id,
              orderID: item.content.order_id ?? '',
              userID: item.user_id,
              money: item.origin,
              remain: item.remain,
              status: 1,
              note: item.note,
              created_time: item.created_at,
              deadline: item.deadline,
              userData: user.userData,
            };
          })
        : [];
      return response.succ(resp, { data: historyMaps, oldest: oldest?.data });
    }
    return response.fail(resp, '使用者不存在');
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/rebate/config', async (req: express.Request, resp: express.Response) => {
  try {
    const app = req.get('g-app') as string;
    const rebateClass = new Rebate(app);
    const config = await rebateClass.getConfig();
    return response.succ(resp, { data: config });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/rebate/sum', async (req: express.Request, resp: express.Response) => {
  try {
    const app = req.get('g-app') as string;
    const rebateClass = new Rebate(app);
    const data = await rebateClass.getOneRebate({ user_id: req.query.userID || req.body.token.userID });
    const main = await rebateClass.mainStatus();
    return response.succ(resp, { main: main, sum: data ? data.point : 0 });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/rebate/manager', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      const app = req.get('g-app') as string;
      let orderID = new Date().getTime();

      return response.succ(resp, {
        result: true,
      });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/rebate', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(resp, {
        result: true,
      });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 結帳付款
router.post('/checkout', async (req: express.Request, resp: express.Response) => {
  try {
    const result = await new Shopping(req.get('g-app') as string, req.body.token).toCheckout({
      line_items: req.body.line_items as any,
      email: (req.body.token && req.body.token.account) || req.body.email,
      return_url: req.body.return_url,
      user_info: req.body.user_info,
      code: req.body.code,
      customer_info: req.body.customer_info,
      checkOutType: req.body.checkOutType,
      use_rebate: (() => {
        if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
          return req.body.use_rebate;
        } else {
          return 0;
        }
      })(),
      custom_receipt_form: req.body.custom_receipt_form,
      custom_form_format: req.body.custom_form_format,
      custom_form_data: req.body.custom_form_data,
      distribution_code: req.body.distribution_code,
      code_array: req.body.code_array,
      give_away: req.body.give_away,
      language: req.headers['language'] as any,
      client_ip_address: (req.query.ip || req.headers['x-real-ip'] || req.ip) as string,
      fbc: req.cookies._fbc,
      fbp: req.cookies._fbp,
      temp_cart_id: req.body.temp_cart_id,
    });

    //
    // const fb_data=new FbApi(req.get('g-app') as string)
    // fb_data.checkOut({
    //     "event_name": "Purchase",
    //     "event_time": 1740037377,
    //     "action_source": "website",
    //     "user_data": {
    //         "em": [
    //             "309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd"
    //         ],
    //         "ph": [
    //             "254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4",
    //             "6f4fcb9deaeadc8f9746ae76d97ce1239e98b404efe5da3ee0b7149740f89ad6"
    //         ],
    //         "client_ip_address": "123.123.123.123",
    //         "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
    //         "fbp": "fb.1.1558571054389.1098115397"
    //     },
    //     "custom_data": {
    //         "currency": "TWD",
    //         "value": 100.0
    //     }
    // })
    return response.succ(resp, result);
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/checkout/repay', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
        {
          return_url: req.body.return_url,
        } as any,
        'add',
        req.body.order_id
      )
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/checkout/preview', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
        {
          line_items: req.body.line_items as any,
          email:
            req.body.checkOutType === 'POS' ? undefined : (req.body.token && req.body.token.account) || req.body.email,
          return_url: req.body.return_url,
          user_info: req.body.user_info,
          code: req.body.code,
          use_rebate: (() => {
            if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
              return req.body.use_rebate;
            } else {
              return 0;
            }
          })(),
          checkOutType: req.body.checkOutType,
          distribution_code: req.body.distribution_code,
          code_array: req.body.code_array,
          give_away: req.body.give_away,
          pos_store: req.body.pos_store,
          language: req.headers['language'] as any,
        },
        'preview'
      )
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/manager/checkout', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
          {
            line_items: req.body.line_items as any,
            email: req.body.customer_info.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            checkOutType: 'manual',
            voucher: req.body.voucher,
            customer_info: req.body.customer_info,
            discount: req.body.discount,
            total: req.body.total,
            pay_status: req.body.pay_status,
            code_array: req.body.code_array,
          },
          'manual'
        )
      );
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/manager/checkout/preview', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
          {
            line_items: req.body.line_items as any,
            email: (req.body.token && req.body.token.account) || req.body.email,
            return_url: req.body.return_url,
            user_info: req.body.user_info,
            use_rebate: (() => {
              if (req.body.use_rebate && typeof req.body.use_rebate === 'number') {
                return req.body.use_rebate;
              } else {
                return 0;
              }
            })(),
            code_array: req.body.code_array,
          },
          'manual-preview'
        )
      );
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 訂單
router.get('/order', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      //管理員
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
          page: (req.query.page ?? 0) as number,
          limit: (req.query.limit ?? 50) as number,
          search: req.query.search as string,
          phone: req.query.phone as string,
          id: req.query.id as string,
          id_list: req.query.id_list as string,
          email: req.query.email as string,
          status: req.query.status as string,
          searchType: req.query.searchType as string,
          shipment: req.query.shipment as string,
          is_pos: req.query.is_pos as string,
          progress: req.query.progress as string,
          orderStatus: req.query.orderStatus as string,
          created_time: req.query.created_time as string,
          orderString: req.query.orderString as string,
          archived: req.query.archived as string,
          distribution_code: req.query.distribution_code as string,
          returnSearch: req.query.returnSearch as string,
          valid: req.query.valid === 'true',
          shipment_time: req.query.shipment_time as string,
          is_shipment: req.query.is_shipment === 'true',
          is_reconciliation: req.query.is_reconciliation === 'true',
          payment_select: req.query.payment_select as string,
          reconciliation_status:
            req.query.reconciliation_status && ((req.query.reconciliation_status as string).split(',') as any),
        })
      );
    } else if (await UtPermission.isAppUser(req)) {
      //已登入用戶
      const user_data = await new User(req.get('g-app') as string, req.body.token).getUserData(
        req.body.token.userID as any,
        'userID'
      );
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
          page: (req.query.page ?? 0) as number,
          limit: (req.query.limit ?? 50) as number,
          search: req.query.search as string,
          id: req.query.id as string,
          email: user_data.userData.email,
          phone: user_data.userData.phone,
          status: req.query.status as string,
          progress: req.query.progress as string,
          searchType: req.query.searchType as string,
        })
      );
    } else if (req.query.search) {
      //未登入訪客
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).getCheckOut({
          page: (req.query.page ?? 0) as number,
          limit: (req.query.limit ?? 50) as number,
          search: req.query.search as string,
          id: req.query.id as string,
          status: req.query.status as string,
          searchType: req.query.searchType as string,
          progress: req.query.progress as string,
        })
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/order/payment-method', async (req: express.Request, resp: express.Response) => {
  try {
    const keyData = (
      await Private_config.getConfig({
        appName: req.get('g-app') as string,
        key: 'glitter_finance',
      })
    )[0].value;
    //清空敏感資料
    ['MERCHANT_ID', 'HASH_KEY', 'HASH_IV'].map(dd => {
      delete keyData[dd];
    });
    return response.succ(resp, keyData);
  } catch (e) {}
});
router.get('/payment/method', async (req: express.Request, resp: express.Response) => {
  try {
    const keyData = (
      await Private_config.getConfig({
        appName: req.get('g-app') as string,
        key: 'glitter_finance',
      })
    )[0].value;

    return response.succ(resp, {
      method: [
        {
          value: 'credit',
          title: '信用卡',
        },
        {
          value: 'atm',
          title: 'ATM',
        },
        {
          value: 'web_atm',
          title: '網路ATM',
        },
        {
          value: 'c_code',
          title: '超商代碼',
        },
        {
          value: 'c_bar_code',
          title: '超商條碼',
        },
      ].filter(dd => {
        return keyData[dd.value] && keyData.TYPE !== 'off_line';
      }),
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/order/proof-purchase', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).proofPurchase(req.body.order_id, req.body.text)
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/order', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).putOrder({
          id: req.body.id,
          orderData: req.body.order_data,
          status: req.body.status,
        })
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/order/cancel', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).manualCancelOrder(req.body.id)
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/order', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).deleteOrder({
          id: req.body.id as string,
        })
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 退貨訂單
router.get('/returnOrder', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      //管理員
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).getReturnOrder({
          page: (req.query.page ?? 0) as number,
          limit: (req.query.limit ?? 50) as number,
          search: req.query.search as string,
          id: req.query.id as string,
          email: req.query.email as string,
          status: req.query.status as string,
          searchType: req.query.searchType as string,
          progress: req.query.progress as string,
          created_time: req.query.created_time as string,
          orderString: req.query.orderString as string,
          archived: req.query.archived as string,
        })
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/returnOrder', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      //管理員
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).putReturnOrder({
          id: req.body.id,
          orderData: req.body.data,
          status: req.body.status || '0',
        })
      );
      // return response.succ(
      //     resp,
      //     await new Shopping(req.get('g-app') as string, req.body.token).getReturnOrder({
      //         page: (req.query.page ?? 0) as number,
      //         limit: (req.query.limit ?? 50) as number,
      //         search: req.query.search as string,
      //         id: req.query.id as string,
      //         email: req.query.email as string,
      //         status: req.query.status as string,
      //         searchType: req.query.searchType as string,
      //         progress: req.query.progress as string,
      //         created_time: req.query.created_time as string,
      //         orderString: req.query.orderString as string,
      //         archived: req.query.archived as string,
      //     })
      // );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/returnOrder', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).createReturnOrder(req.body)
      );
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 合併訂單
router.post('/combineOrder', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).combineOrder(req.body));
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 優惠券
router.get('/voucher', async (req: express.Request, resp: express.Response) => {
  try {
    let query = [`(content->>'$.type'='voucher')`];

    if (req.query.search) {
      query.push(`(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%${req.query.search}%'))`);
    }

    if (req.query.voucher_type) {
      query.push(`(content->>'$.reBackType'='${req.query.voucher_type}')`);
    }

    // 獲取優惠券
    const shopping = new Shopping(req.get('g-app') as string, req.body.token);
    const vouchers = await shopping.querySql(query, {
      page: Number(req.query.page) || 0,
      limit: Number(req.query.limit) || 50,
      id: req.query.id as string,
    });

    const isManager = await UtPermission.isManager(req);

    // 後台列表直接回傳
    if (isManager && !req.query.user_email) {
      return response.succ(resp, vouchers);
    }

    // 篩選過期優惠券
    if (req.query.date_confirm === 'true') {
      vouchers.data = vouchers.data.filter((voucher: { content: VoucherData }) => {
        const { start_ISO_Date, end_ISO_Date } = voucher.content;
        const now = new Date().getTime();
        return new Date(start_ISO_Date).getTime() < now && (!end_ISO_Date || new Date(end_ISO_Date).getTime() > now);
      });
    }

    // 獲取用戶資料
    const userClass = new User(req.get('g-app') as string);
    const groupList = await userClass.getUserGroups();
    const userID = await (async () => {
      if (!isManager) return req.body.token.userID;
      if (req.query.user_email === 'guest') return -1;

      const userData = await userClass.getUserData(req.query.user_email as string, 'email_or_phone');
      return userData.userID;
    })();
    const userLevels = await userClass.getUserLevel([{ userId: userID }]);

    // 篩選用戶適用的優惠券
    vouchers.data = vouchers.data.filter((voucher: { content: VoucherData }) => {
      const { target, targetList } = voucher.content;

      switch (target) {
        case 'customer':
          return targetList.includes(userID);
        case 'levels':
          return userLevels[0] ? targetList.includes(userLevels[0].data.id) : false;
        case 'group':
          if (!groupList.result) return false;
          return groupList.data.some(
            group => targetList.includes(group.type) && group.users.some(user => user.userID === userID)
          );
        default:
          return true; // 所有顧客皆可使用
      }
    });

    return response.succ(resp, vouchers);
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/voucher', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      await new Shopping(req.get('g-app') as string, req.body.token).deleteVoucher({
        id: req.query.id as string,
      });
      return response.succ(resp, { result: true });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 重導向
async function redirect_link(req: express.Request, resp: express.Response) {
  try {
    //預防沒有APPName
    req.query.appName = req.query.appName || (req.get('g-app') as string) || (req.query['g-app'] as string);
    // 判斷paypal進來 做capture
    let return_url = new URL((await redis.getValue(req.query.return as string)) as any);
    if (req.query.LinePay && req.query.LinePay === 'true') {
      const check_id = await redis.getValue(`linepay` + req.query.orderID);

      const order_data = (
        await db.query(
          `SELECT *
           FROM \`${req.query.appName}\`.t_checkout
           WHERE cart_token = ?
          `,
          [req.query.orderID]
        )
      )[0];
      const keyData = (
        await Private_config.getConfig({
          appName: req.query.appName as string,
          key: 'glitter_finance',
        })
      )[0].value.line_pay;
      const linePay = new LinePay(req.query.appName as string, keyData);

      console.log(`check_id===>${req.query.orderID}===>${req.query.transactionId}`);
      console.log(`req.query=>`, req.query);
      const data: any = (
        await linePay.confirmAndCaptureOrder(req.query.transactionId as string, order_data['orderData'].total)
      ).data;
      console.log(`line-response==>`, data);
      //判斷付款成功且Receipt單據ID為相同的orderID
      if (data.returnCode == '0000' && data.info.orderId === req.query.orderID) {
        await new Shopping(req.query.appName as string).releaseCheckout(1, req.query.orderID as string);
      }
    }
    if (req.query.payment && req.query.payment == 'true') {
      const check_id = await redis.getValue(`paypal` + req.query.orderID);
      const keyData = (
        await Private_config.getConfig({
          appName: req.query.appName as string,
          key: 'glitter_finance',
        })
      )[0].value.paypal;
      const paypal = new PayPal(req.query.appName as string, keyData);
      const data = await paypal.confirmAndCaptureOrder(check_id as string);
      if (data.status === 'COMPLETED') {
        await new Shopping(req.query.appName as string).releaseCheckout(1, req.query.orderID as string);
      }
    }
    if (req.query.paynow && req.query.paynow === 'true') {
      // const check_id = '1234555'
      const keyData = (
        await Private_config.getConfig({
          appName: req.query.appName as string,
          key: 'glitter_finance',
        })
      )[0].value.paynow;
      const check_id = await redis.getValue(`paynow` + req.query.orderID);
      const payNow = new PayNow(req.query.appName as string, keyData);
      const data: any = await payNow.confirmAndCaptureOrder(check_id as string);
      if (data.type == 'success' && data.result.status === 'success') {
        await new Shopping(req.query.appName as string).releaseCheckout(1, req.query.orderID as string);
      }
    }
    //pp_1bed7f12879241198832063d5e091976
    if (req.query.jkopay && req.query.jkopay === 'true') {
      let kd = {
        ReturnURL: '',
        NotifyURL: '',
      };

      const jko = new JKO(req.query.appName as string, kd);
      const data: any = jko.confirmAndCaptureOrder(req.query.orderID as string);
      if (data.tranactions[0].status == 'success') {
        await new Shopping(req.query.appName as string).releaseCheckout(1, req.query.orderID as string);
      }
    }
    const html = String.raw;
    return resp.send(
      html`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Title</title>
          </head>
          <body>
            <script>
              try {
                window.webkit.messageHandlers.addJsInterFace.postMessage(
                  JSON.stringify({
                    functionName: 'check_out_finish',
                    callBackId: 0,
                    data: {
                      redirect: '${return_url.href}',
                    },
                  })
                );
              } catch (e) {}
              location.href = '${return_url.href}';
            </script>
          </body>
        </html> `
    );
  } catch (err) {
    console.error(err);
    return response.fail(resp, err);
  }
}

router.get('/redirect', redirect_link);
router.post('/redirect', redirect_link);

// 執行訂單結帳與付款事項
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get('/testRelease', async (req: express.Request, resp: express.Response) => {
  try {
    const test = true;
    const appName = req.get('g-app') as string;
    if (test) {
      await new Shopping(appName).releaseCheckout(1, req.query.orderId + '');
    }
    return response.succ(resp, {});
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/notify', upload.single('file'), async (req: express.Request, resp: express.Response) => {
  try {
    console.log(`notify-order-result`);
    let decodeData = undefined;
    //預防沒有APPName
    req.query.appName = req.query.appName || (req.get('g-app') as string) || (req.query['g-app'] as string);
    const appName: string = req.query.appName as string;
    const type = req.query['type'] as string;

    const keyData = (
      await Private_config.getConfig({
        appName: appName,
        key: 'glitter_finance',
      })
    )[0].value[type];
    if (type === 'paynow') {
      const check_id = await redis.getValue(`paynow` + req.query.orderID);
      const payNow = new PayNow(req.query.appName as string, keyData);
      const data: any = await payNow.confirmAndCaptureOrder(check_id as string);
      if (data.type == 'success' && data.result.status === 'success') {
        await new Shopping(req.query.appName as string).releaseCheckout(1, req.query.orderID as string);
      }
    }

    if (['ecPay', 'newWebPay'].includes(type)) {
      if (type === 'ecPay') {
        delete req.body.CheckMacValue;
        decodeData = {
          Status:
            (await new EcPay(appName).checkPaymentStatus(req.body.MerchantTradeNo)).TradeStatus === '1'
              ? 'SUCCESS'
              : 'ERROR',
          Result: {
            MerchantOrderNo: req.body.MerchantTradeNo,
            CheckMacValue: req.body.CheckMacValue,
          },
        };
      }
      if (type === 'newWebPay') {
        decodeData = JSON.parse(
          new EzPay(appName, {
            HASH_IV: keyData.HASH_IV,
            HASH_KEY: keyData.HASH_KEY,
            ActionURL: keyData.ActionURL,
            NotifyURL: '',
            ReturnURL: '',
            MERCHANT_ID: keyData.MERCHANT_ID,
            TYPE: keyData.TYPE,
          }).decode(req.body.TradeInfo)
        );
      }
      // 執行付款完成之訂單事件
      if (decodeData['Status'] === 'SUCCESS') {
        await new Shopping(appName).releaseCheckout(1, decodeData['Result']['MerchantOrderNo']);
      } else {
        await new Shopping(appName).releaseCheckout(-1, decodeData['Result']['MerchantOrderNo']);
      }
    }

    return response.succ(resp, {});
  } catch (err) {
    console.error(err);
    return response.fail(resp, err);
  }
});

// 許願池
router.get('/wishlist', async (req: express.Request, resp: express.Response) => {
  try {
    let query = [`(content->>'$.type'='wishlist')`, `userID = ${req.body.token.userID}`];
    const data = await new UtDatabase(req.get('g-app') as string, `t_post`).querySql(query, req.query as any);

    return response.succ(
      resp,
      await new UtDatabase(req.get('g-app') as string, `t_manager_post`).querySql(
        [
          `id in (${['0']
            .concat(
              data.data.map((dd: any) => {
                return dd.content.product_id;
              })
            )
            .join(',')})`,
        ],
        req.query as any
      )
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/checkWishList', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, {
      result:
        (
          await db.query(
            `select count(1)
             FROM \`${req.get('g-app') as string}\`.t_post
             where (content ->>'$.type'='wishlist')
               and userID = ?
               and (content ->>'$.product_id'=${req.query.product_id})
            `,
            [req.body.token.userID]
          )
        )[0]['count(1)'] == '1',
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/wishlist', async (req: express.Request, resp: express.Response) => {
  try {
    const post = new Post(req.get('g-app') as string, req.body.token);
    await db.query(
      `delete
       FROM \`${req.get('g-app') as string}\`.t_post
       where (content ->>'$.type'='wishlist')
         and userID = ?
         and (content ->>'$.product_id'=${req.body.product_id})
      `,
      [req.body.token.userID]
    );
    const postData = {
      product_id: req.body.product_id,
      userID: (req.body.token && req.body.token.userID) || 0,
      type: 'wishlist',
    };
    if (req.body.product_id) {
      await post.postContent(
        {
          userID: postData.userID,
          content: JSON.stringify(postData),
        },
        't_post'
      );
    }
    return response.succ(resp, { result: true });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/wishlist', async (req: express.Request, resp: express.Response) => {
  try {
    await db.query(
      `delete
       FROM \`${req.get('g-app') as string}\`.t_post
       where (content ->>'$.type'='wishlist')
         and userID = ?
         and (content ->>'$.product_id'=${req.body.product_id})
      `,
      [req.body.token.userID]
    );
    return response.succ(resp, { result: true });
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 資料分析
router.get('/dataAnalyze', async (req: express.Request, resp: express.Response) => {
  try {
    const tags = `${req.query.tags}`;
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new DataAnalyze(req.get('g-app') as string, req.body.token).getDataAnalyze(
          tags.split(','),
          req.query.query
        )
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 取得配送方法
router.get('/shippingMethod', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).getShippingMethod());
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 商品類別
router.get('/collection/products', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).getCollectionProducts(`${req.query.tag}`)
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/collection/product/variants', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).getCollectionProductVariants(`${req.query.tag}`)
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/collection', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).putCollection(
          req.body.replace,
          req.body.original
        )
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/collection', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).deleteCollection(req.body.data)
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/collection/sort', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(
        resp,
        await new Shopping(req.get('g-app') as string, req.body.token).sortCollection(req.body.list)
      );
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 產品
router.get('/product', async (req: express.Request, resp: express.Response) => {
  try {
    const shopping = await new Shopping(req.get('g-app') as string, req.body.token).getProduct({
      page: (req.query.page ?? 0) as number,
      limit: (req.query.limit ?? 50) as number,
      search: req.query.search as string,
      searchType: req.query.searchType as string,
      sku: req.query.sku as string,
      id: req.query.id as string,
      domain: req.query.domain as string,
      collection: req.query.collection as string,
      accurate_search_text: req.query.accurate_search_text === 'true',
      accurate_search_collection: req.query.accurate_search_collection === 'true',
      min_price: req.query.min_price as string,
      max_price: req.query.max_price as string,
      status: req.query.status as string,
      channel: req.query.channel as string,
      whereStore: req.query.whereStore as string,
      id_list: req.query.id_list as string,
      order_by: req.query.order_by as string,
      with_hide_index: req.query.with_hide_index as string,
      is_manger: (await UtPermission.isManager(req)) as any,
      show_hidden: `${req.query.show_hidden as any}`,
      productType: req.query.productType as any,
      product_category: req.query.product_category as any,
      filter_visible: req.query.filter_visible as any,
      view_source: req.query.view_source as string,
      distribution_code: req.query.distribution_code as string,
      language: req.headers['language'] as string,
      currency_code: req.headers['currency_code'] as string,
    });

    return response.succ(resp, shopping);
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/product/domain', async (req: express.Request, resp: express.Response) => {
  try {
    const shopping = await new Shopping(req.get('g-app') as string, req.body.token).getDomain({
      id: req.query.id as string,
      search: req.query.search as string,
      domain: req.query.domain as string,
    });
    return response.succ(resp, shopping);
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/product/variants', async (req: express.Request, resp: express.Response) => {
  try {
    const shopping = await new Shopping(req.get('g-app') as string, req.body.token).getVariants({
      page: (req.query.page ?? 0) as number,
      limit: (req.query.limit ?? 50) as number,
      search: req.query.search as string,
      searchType: req.query.searchType as string,
      id: req.query.id as string,
      collection: req.query.collection as string,
      accurate_search_collection: req.query.accurate_search_collection === 'true',
      status: req.query.status as string,
      id_list: req.query.id_list as string,
      order_by: req.query.order_by as string,
      stockCount: req.query.stockCount as string,
      productType: req.query.productType as string,
    });
    return response.succ(resp, shopping);
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/product', async (req: express.Request, resp: express.Response) => {
  try {
    if (!(await UtPermission.isManager(req))) {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    } else {
      return response.succ(resp, {
        result: true,
        id: await new Shopping(req.get('g-app') as string, req.body.token).postProduct(req.body),
      });
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/product/multiple', async (req: express.Request, resp: express.Response) => {
  try {
    if (!(await UtPermission.isManager(req))) {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    } else {
      return response.succ(resp, {
        result: true,
        id: await new Shopping(req.get('g-app') as string, req.body.token).postMulProduct(req.body),
      });
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/product', async (req: express.Request, resp: express.Response) => {
  try {
    if (!(await UtPermission.isManager(req))) {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    } else {
      return response.succ(resp, {
        result: true,
        id: await new Shopping(req.get('g-app') as string, req.body.token).putProduct(req.body),
      });
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.put('/product/variants', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).putVariants(req.body));
    } else {
      throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 產品評論
router.get('/product/comment', async (req: express.Request, resp: express.Response) => {
  try {
    const id = Math.max(0, parseInt(`${req.query.id}`, 10) || 0);
    const comment = await new Shopping(req.get('g-app') as string, req.body.token).getProductComment(id);
    return response.succ(resp, comment);
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/product/comment', async (req: express.Request, resp: express.Response) => {
  try {
    await new Shopping(req.get('g-app') as string, req.body.token).postProductComment(req.body);
    return response.succ(resp, { result: true });
  } catch (err) {
    return response.fail(resp, err);
  }
});

// router.put('/product/variants/recoverStock', async (req: express.Request, resp: express.Response) => {
//     try {
//         if (await UtPermission.isManager(req)) {
//             return response.succ(resp, await new Stock(req.get('g-app') as string, req.body.token).recoverStock(req.body));
//         } else {
//             throw exception.BadRequestError('BAD_REQUEST', 'No permission.', null);
//         }
//     } catch (err) {
//         return response.fail(resp, err);
//     }
// });

router.delete('/product', async (req: express.Request, resp: express.Response) => {
  try {
    if (await UtPermission.isManager(req)) {
      await new Shopping(req.get('g-app') as string, req.body.token).deleteProduct({
        id: req.query.id as string,
      });
      return response.succ(resp, { result: true });
    } else {
      return response.fail(resp, exception.BadRequestError('BAD_REQUEST', 'No permission.', null));
    }
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 登入選項
router.get('/check-login-for-order', async (req: express.Request, resp: express.Response) => {
  try {
    const keyData = await new User(req.get('g-app') as string).getConfigV2({
      user_id: 'manager',
      key: 'login_config',
    });

    return response.succ(resp, {
      result: keyData.login_in_to_order,
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});

// POS機相關
router.post('/pos/checkout', async (req: express.Request, resp: express.Response) => {
  async function checkoutPos() {
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).toCheckout(
        {
          order_id: req.body.orderID,
          line_items: req.body.lineItems as any,
          email: req.body.customer_info.email,
          return_url: req.body.return_url,
          user_info: req.body.user_info,
          checkOutType: 'POS',
          voucher: req.body.voucher,
          customer_info: req.body.customer_info,
          discount: req.body.discount,
          total: req.body.total,
          use_rebate: req.body.use_rebate,
          pay_status: req.body.pay_status,
          code_array: req.body.code_array,
          pos_info: req.body.pos_info,
          pos_store: req.body.pos_store,
          invoice_select: req.body.invoice_select,
          pre_order: req.body.pre_order,
          voucherList: req.body.voucherList,
        },
        'POS'
      )
    );
  }

  try {
    let result = await checkoutPos();
    return response.succ(resp, result);
  } catch (err) {
    return response.fail(resp, err);
  }
});
// POS機相關
router.post('/pos/linePay', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, {
      result: await new Shopping(req.get('g-app') as string, req.body.token).linePay(req.body),
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});
// 點數續費
router.post('/apple-webhook', async (req: express.Request, resp: express.Response) => {
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      // url: 'https://sandbox.itunes.apple.com/verifyReceipt',
      url: 'https://buy.itunes.apple.com/verifyReceipt',
      headers: {
        'Content-Type': 'application/json',
      },
      data: req.body.base64,
    };
    //取得收據
    const receipt: any = await new Promise((resolve, reject) => {
      axios
        .request(config)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          resolve(false);
        });
    });
    if (!receipt) {
      throw exception.BadRequestError('BAD_REQUEST', 'No Receipt.Cant find receipt.', null);
    }
    for (const b of receipt.receipt.in_app.filter((dd: any) => {
      return `${dd.product_id}`.includes('ai_points_') && dd.in_app_ownership_type === 'PURCHASED';
    })) {
      const count = (
        await db.query(
          `select count(1)
           from \`${req.get('g-app')}\`.t_ai_points
           where orderID = ?`,
          [b.transaction_id]
        )
      )[0]['count(1)'];
      if (!count) {
        await db.query(
          `insert into \`${req.get('g-app')}\`.t_ai_points
           set ?`,
          [
            {
              orderID: b.transaction_id,
              userID: req.body.token.userID,
              money: parseInt(b.product_id.replace('ai_points_', ''), 10) * 10,
              status: 1,
              note: JSON.stringify({
                text: 'apple內購加值',
                receipt: receipt,
              }),
            },
          ]
        );
      }
    }
    for (const b of receipt.receipt.in_app.filter((dd: any) => {
      return `${dd.product_id}`.includes('sms_') && dd.in_app_ownership_type === 'PURCHASED';
    })) {
      const count = (
        await db.query(
          `select count(1)
           from \`${req.get('g-app')}\`.t_sms_points
           where orderID = ?`,
          [b.transaction_id]
        )
      )[0]['count(1)'];
      if (!count) {
        await db.query(
          `insert into \`${req.get('g-app')}\`.t_sms_points
           set ?`,
          [
            {
              orderID: b.transaction_id,
              userID: req.body.token.userID,
              money: parseInt(b.product_id.replace('sms_', ''), 10) * 10,
              status: 1,
              note: JSON.stringify({
                text: 'apple內購加值',
                receipt: receipt,
              }),
            },
          ]
        );
      }
    }
    for (const b of receipt.receipt.in_app.filter((dd: any) => {
      return (
        ['light_year_apple', 'basic_year_apple', 'omo_year_apple', 'app_year_apple', 'flagship_year_apple'].includes(
          `${dd.product_id}`
        ) && dd.in_app_ownership_type === 'PURCHASED'
      );
    })) {
      if (
        !(
          await db.query(
            `select count(1)
             from shopnex.t_checkout
             where cart_token = ?`,
            [b.transaction_id]
          )
        )[0]['count(1)']
      ) {
        const app_info = (
          await db.query(
            `select dead_line, user
             from glitter.app_config
             where appName = ?`,
            [req.body.app_name]
          )
        )[0];
        const user = (
          await db.query(
            `SELECT *
             FROM shopnex.t_user
             where userID = ?`,
            [app_info.user]
          )
        )[0];
        const start = (() => {
          if (new Date(app_info.dead_line).getTime() > new Date().getTime()) {
            return new Date(app_info.dead_line);
          } else {
            return new Date();
          }
        })();
        start.setDate(start.getDate() + 365);
        await db.query(
          `update glitter.app_config
           set dead_line=?,
               plan=?
           where appName = ?`,
          [start, `${b.product_id}`.replace('_apple', '').replace(/_/g, '-'), req.body.app_name]
        );
        const index = [
          'light_year_apple',
          'basic_year_apple',
          'omo_year_apple',
          'app_year_apple',
          'flagship_year_apple',
        ].findIndex(d1 => {
          return `${b.product_id}` === d1;
        });
        const money = ([13200, 26400, 52800, 52800, 66000] as any)[index];
        await db.query(
          `insert into shopnex.t_checkout
           set ? `,
          [
            {
              cart_token: b.transaction_id,
              status: 1,
              email: user.userData.email,
              orderData: JSON.stringify({
                email: user.userData.email,
                total: money,
                method: 'ALL',
                rebate: 0,
                orderID: b.transaction_id,
                discount: 0,
                lineItems: [
                  {
                    id: 289,
                    sku: b.product_id,
                    spec: [['輕便電商方案', '標準電商方案', '通路電商方案', '行動電商方案', '旗艦電商方案'][index]],
                    count: 1,
                    title: 'SHOPNEX會員方案',
                    rebate: 0,
                    collection: [],
                    sale_price: money,
                    shipment_obj: { type: 'weight', value: 0 },
                    preview_image: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1702389593777-Frame 2 (2).png',
                    discount_price: 0,
                  },
                ],
                user_info: {
                  email: user.userData.email,
                  appName: req.body.app_name,
                  company: '',
                  gui_number: '',
                  invoice_type: 'me',
                },
                code_array: [],
                use_rebate: 0,
                use_wallet: '0',
                user_email: user.userData.email,
                orderSource: '',
                voucherList: [],
                shipment_fee: 0,
                customer_info: { payment_select: 'ecPay' },
                useRebateInfo: { point: 0 },
                payment_setting: { TYPE: 'ecPay' },
                user_rebate_sum: 0,
                off_line_support: { atm: false, line: false, cash_on_delivery: false },
                payment_info_atm: { bank_code: '', bank_name: '', bank_user: '', bank_account: '' },
                shipment_support: [],
                shipment_selector: [],
                payment_info_line_pay: { text: '' },
              }),
            },
          ]
        );
      }
    }
    return response.succ(resp, { result: true });
  } catch (err) {
    console.error(err);
    return response.fail(resp, err);
  }
});

// 手動開立發票
router.post('/customer_invoice', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).postCustomerInvoice({
        orderID: req.body.orderID,
        invoice_data: req.body.invoiceData,
        orderData: req.body.orderData,
      })
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 發票作廢
router.post('/void_invoice', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).voidInvoice({
        invoice_no: req.body.invoiceNo,
        reason: req.body.voidReason,
        createDate: req.body.createDate,
      })
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/void_allowance', async (req: express.Request, resp: express.Response) => {
  try {
    let passData = {
      invoiceNo: req.body.invoiceNo,
      allowanceNo: req.body.allowanceNo,
      voidReason: req.body.voidReason,
    };
    return response.succ(resp, await new Shopping(req.get('g-app') as string, req.body.token).voidAllowance(passData));
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 折讓發票
router.post('/allowance_invoice', async (req: express.Request, resp: express.Response) => {
  try {
    let passData = {
      invoiceID: req.body.invoiceID,
      allowanceData: req.body.allowanceData,
      orderID: req.body.orderID,
      orderData: req.body.orderData,
      allowanceInvoiceTotalAmount: req.body.allowanceInvoiceTotalAmount,
      itemList: req.body.itemList,
      invoiceDate: req.body.invoiceDate,
    };
    return response.succ(
      resp,
      await new Shopping(req.get('g-app') as string, req.body.token).allowanceInvoice(passData)
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 小結單
router.get('/pos/summary', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, {
      data: await new Pos(req.get('g-app') as string, req.body.token).getSummary(req.query.shop as string),
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/pos/summary', async (req: express.Request, resp: express.Response) => {
  try {
    await new Pos(req.get('g-app') as string, req.body.token).setSummary(req.body);
    return response.succ(resp, {
      result: true,
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});

// 取得上班狀態
router.get('/pos/work-status', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, {
      status: await new Pos(req.get('g-app') as string, req.body.token).getWorkStatus(req.query as any),
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.get('/pos/work-status-list', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new Pos(req.get('g-app') as string, req.body.token).getWorkStatusList(req.query as any)
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/pos/work-status', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, {
      status: await new Pos(req.get('g-app') as string, req.body.token).setWorkStatus(req.body),
    });
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.post('/logistics/redirect', async (req: express.Request, resp: express.Response) => {
  try {
    const re_: string = req.query['return'] as string;
    const return_url = new URL((await redis.getValue(`redirect_${re_}`)) as string);
    console.log(`logistics/redirect/body`, req.body);
    console.log(`logistics/redirect/query`, req.query);
    return_url.searchParams.set('CVSStoreID', req.body.storeid);
    return_url.searchParams.set('CVSStoreName', req.body.storename);
    return_url.searchParams.set('CVSAddress', req.body.storeaddress);
    const html = String.raw;
    return resp.send(
      html`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Title</title>
          </head>
          <body>
            <script>
              location.href = '${return_url.toString()}';
            </script>
          </body>
        </html> `
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.get('/ec-pay/payments/status', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new EcPay(req.get('g-app') as string).checkPaymentStatus(req.query.orderID as any)
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.delete('/ec-pay/payments/brush-back', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(
      resp,
      await new EcPay(req.get('g-app') as string).brushBack(
        req.body.orderID as string,
        req.body.tradNo as string,
        req.body.total as string
      )
    );
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.get('/verification-code', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, await ShopnexLineMessage.generateVerificationCode(req.get('g-app') as string));
  } catch (err) {
    return response.fail(resp, err);
  }
});
router.post('/verification-code', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, await ShopnexLineMessage.verifyVerificationCode(req.body));
  } catch (err) {
    return response.fail(resp, err);
  }
});

router.get('/line_group', async (req: express.Request, resp: express.Response) => {
  try {
    return response.succ(resp, await ShopnexLineMessage.getLineGroup(req.get('g-app') as string));
  } catch (err) {
    return response.fail(resp, err);
  }
});
