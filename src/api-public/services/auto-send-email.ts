import { User } from '../services/user.js';
import { Mail } from '../services/mail.js';
import { App } from '../../services/app.js';
import db from '../../modules/database.js';
import exception from '../../modules/exception.js';

export class AutoSendEmail {
  public static async getDefCompare(app: string, tag: string, language: string) {
    const dataList: any = [
      {
        tag: 'auto-email-shipment',
        tag_name: '商品出貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        toggle: true,
      },
      {
        tag: 'auto-email-in-stock',
        tag_name: '商品備貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 備貨中',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 備貨中',
        toggle: true,
      },
      {
        tag: 'auto-sns-shipment',
        tag_name: '簡訊通知商品出貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        toggle: true,
      },
      {
        tag: 'auto-line-shipment',
        tag_name: 'line訊息通知商品出貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        toggle: true,
      },
      {
        tag: 'auto-line-in-stock',
        tag_name: 'line訊息通知商品備貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 備貨中',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 備貨中',
        toggle: true,
      },
      {
        tag: 'auto-fb-shipment',
        tag_name: 'fb訊息通知商品出貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        toggle: true,
      },
      {
        tag: 'auto-email-shipment-arrival',
        tag_name: '商品到貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        toggle: true,
      },
      {
        tag: 'auto-sns-shipment-arrival',
        tag_name: '簡訊通知商品到貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        toggle: true,
      },
      {
        tag: 'auto-line-shipment-arrival',
        tag_name: 'line訊息通知商品到貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        toggle: true,
      },
      {
        tag: 'auto-fb-shipment-arrival',
        tag_name: 'fb訊息通知商品到貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        toggle: true,
      },
      {
        tag: 'auto-email-order-create',
        tag_name: '訂單成立',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        toggle: true,
      },
      {
        tag: 'auto-sns-order-create',
        tag_name: '簡訊通知訂單成立',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        toggle: true,
      },
      {
        tag: 'auto-line-order-create',
        tag_name: 'ling通知訂單成立',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        toggle: true,
      },
      {
        tag: 'auto-fb-order-create',
        tag_name: 'fb通知訂單成立',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        toggle: true,
      },
      {
        tag: 'auto-email-payment-successful',
        tag_name: '訂單付款成功',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        toggle: true,
      },
      {
        tag: 'auto-sns-payment-successful',
        tag_name: '簡訊通知訂單付款成功',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        toggle: true,
      },
      {
        tag: 'auto-line-payment-successful',
        tag_name: 'line訊息通知訂單付款成功',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        toggle: true,
      },
      {
        tag: 'auto-fb-payment-successful',
        tag_name: 'fb訊息通知訂單付款成功',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        toggle: true,
      },
      {
        tag: 'proof-purchase',
        tag_name: '訂單待核款',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        toggle: true,
      },
      {
        tag: 'sns-proof-purchase',
        tag_name: '簡訊通知訂單待核款',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        toggle: true,
      },
      {
        tag: 'line-proof-purchase',
        tag_name: 'line訊息通知訂單待核款',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        toggle: true,
      },
      {
        tag: 'fb-proof-purchase',
        tag_name: 'fb訊息通知訂單待核款',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        toggle: true,
      },
      {
        tag: 'auto-email-order-cancel-success',
        tag_name: '取消訂單成功',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
        content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
        toggle: true,
      },
      {
        tag: 'auto-line-order-cancel-success',
        tag_name: '取消訂單成功',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
        content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
        toggle: true,
      },
      {
        tag: 'auto-sns-order-cancel-success',
        tag_name: '取消訂單成功',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
        content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
        toggle: true,
      },

      {
        tag: 'auto-email-order-cancel-false',
        tag_name: '取消訂單失敗',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗',
        content: '[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗',
        toggle: true,
      },
      {
        tag: 'auto-email-birthday',
        tag_name: '生日祝福',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
        content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
        toggle: true,
      },
      {
        tag: 'auto-sns-birthday',
        tag_name: '簡訊通知生日祝福',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
        content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
        toggle: true,
      },
      {
        tag: 'auto-line-birthday',
        tag_name: 'line訊息通知生日祝福',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
        content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
        toggle: true,
      },
      {
        tag: 'auto-email-welcome',
        tag_name: '歡迎信件',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
        content: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
        toggle: true,
      },
      {
        tag: 'auto-email-verify',
        tag_name: '信箱驗證',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 帳號認證通知',
        content: '嗨！歡迎加入 @{{app_name}}，請輸入驗證碼「 @{{code}} 」。請於一分鐘內輸入並完成驗證。',
        toggle: true,
      },
      {
        tag: 'auto-email-verify-update',
        tag_name: '信箱驗證',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 信箱認證通知',
        content: '請輸入驗證碼「 @{{code}} 」。請於五分鐘內輸入並完成驗證。',
        toggle: true,
      },
      {
        tag: 'auto-phone-verify-update',
        tag_name: '電話認證',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 帳號認證通知',
        content: '請輸入驗證碼「 @{{code}} 」。請於五分鐘內輸入並完成驗證。',
        toggle: true,
      },
      {
        tag: 'auto-phone-verify',
        tag_name: '電話認證',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 帳號認證通知',
        content: '嗨！歡迎加入 @{{app_name}}，請輸入驗證碼「 @{{code}} 」。請於一分鐘內輸入並完成驗證。',
        toggle: true,
      },
      {
        tag: 'auto-email-forget',
        tag_name: '忘記密碼',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 重設密碼',
        content: '[@{{app_name}}]，請輸入驗證碼「 @{{code}} 」。請於一分鐘內輸入並完成驗證。',
        toggle: true,
      },
      {
        tag: 'get-customer-message',
        tag_name: '客服訊息',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 收到客服訊息',
        content: this.getCustomerMessageHTML(),
        toggle: true,
      },
    ];
    const keyData = await new User(app).getConfigV2({
      key: tag,
      user_id: 'manager',
    });
    const appData = await new User(app).getConfigV2({
      key: 'store-information',
      user_id: 'manager',
    });
    const b = dataList.find((dd: any) => {
      return dd.tag === tag;
    })!;
    if (b) {
      if (keyData) {
        const c = keyData[language] || keyData;
        b.title = c.title || b.title;
        b.toggle = keyData.toggle ?? true;
        b.content = c.content || b.content;
        b.name = c.name || b.name;
        b.updated_time = new Date(keyData.updated_time);
      }
      Object.keys(b).map(dd => {
        if (typeof b[dd] === 'string') {
          b[dd] = b[dd].replace(/@\{\{app_name\}\}/g, (appData && appData.shop_name) || '商店名稱');
        }
      });
      return b;
    }
    return {};
  }

  public static getCustomerMessageHTML() {
    const html = String.raw;
    return html` <table
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(65, 65, 65); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; background-color: rgb(255, 255, 255);"
      id="isPasted"
    >
      <tbody
        style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
      >
        <tr
          style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
        >
          <td
            style="box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;"
          >
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-0.5 * var(--bs-gutter-x)); margin-left: calc(-0.5 * var(--bs-gutter-x)); border: none; empty-cells: show; max-width: 100%;"
            >
              <tbody
                style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased; flex-shrink: 0; width: 1055.59px; max-width: 100%; padding-right: calc(var(--bs-gutter-x) * 0.5); padding-left: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y);"
              >
                <tr
                  style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                >
                  <td
                    style="box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;"
                  >
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      width="600"
                      style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(0, 0, 0); width: 600px; margin: 0px auto;"
                    >
                      <tbody
                        style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                      >
                        <tr
                          style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                        >
                          <td
                            width="100%"
                            style="box-sizing: border-box; border: 0px; -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;"
                          >
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;"
                            >
                              <tbody
                                style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                              >
                                <tr
                                  style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                                >
                                  <td
                                    style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; width: 599px;"
                                  >
                                    <div
                                      align="center"
                                      style="box-sizing: border-box; -webkit-font-smoothing: antialiased; line-height: 10px;"
                                    >
                                      <div
                                        style="box-sizing: border-box; -webkit-font-smoothing: antialiased; max-width: 600px;"
                                      >
                                        <img
                                          src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719903595261-s3s4scs3s7sfsfs7.png"
                                          class="fr-fic fr-dii"
                                          style="width: 100%;"
                                        />
                                        <br />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;"
                            >
                              <tbody
                                style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                              >
                                <tr
                                  style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                                >
                                  <td
                                    style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 60px 45px 30px; text-align: left; width: 599px;"
                                  >
                                    <h1
                                      style="box-sizing: border-box; margin: 0px; font-weight: 700; line-height: 33.6px; color: rgb(54, 54, 54); font-size: 28px; -webkit-font-smoothing: antialiased; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; direction: ltr; font-family: Arial, Helvetica, sans-serif; text-align: left;"
                                      id="isPasted"
                                    >
                                      客服訊息
                                    </h1>
                                    <br />
                                    <div style="width: 100%;text-align: start;">@{{text}}</div>
                                    <br />
                                    <br /><span
                                      style="color: rgb(16, 17, 18); font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"
                                      ><a
                                        href="@{{link}}"
                                        target="_blank"
                                        style="box-sizing: border-box; color: rgb(255, 255, 255); text-decoration: none; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 148, 2); border-width: 0px; border-style: solid; border-color: transparent; border-radius: 5px; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 24px; padding-bottom: 15px; padding-top: 15px; text-align: center; width: auto; word-break: keep-all;"
                                        id="isPasted"
                                        ><span
                                          style="box-sizing: border-box; -webkit-font-smoothing: antialiased; padding-left: 30px; padding-right: 30px; font-size: 24px; display: inline-block; letter-spacing: normal;"
                                          ><span
                                            style="box-sizing: border-box; -webkit-font-smoothing: antialiased; word-break: break-word; line-height: 48px;"
                                            ><strong
                                              style="box-sizing: border-box; font-weight: 700; -webkit-font-smoothing: antialiased;"
                                              >前往商店</strong
                                            ></span
                                          ></span
                                        ></a
                                      ></span
                                    >
                                    <br />
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);"
                            >
                              <tbody
                                style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                              >
                                <tr
                                  style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                                >
                                  <td
                                    style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 28px 45px 10px;"
                                  >
                                    <div
                                      style="box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 19.2px; text-align: left;"
                                    >
                                      <p
                                        style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;"
                                      >
                                        如果您有任何疑問或需要幫助，我們的團隊隨時在這裡為您提供支持。
                                      </p>

                                      <p
                                        style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;"
                                      >
                                        服務電話：+886 978-028-730
                                      </p>

                                      <p
                                        style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;"
                                      >
                                        電子郵件：mk@ncdesign.info
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);"
                            >
                              <tbody
                                style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                              >
                                <tr
                                  style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;"
                                >
                                  <td
                                    style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 20px 10px 10px;"
                                  >
                                    <div
                                      style="box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 16.8px; text-align: center;"
                                    >
                                      <p
                                        style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;"
                                      >
                                        <a
                                          href="https://shopnex.tw/?article=termsofservice&page=blog_detail"
                                          target="_blank"
                                          rel="noopener"
                                          style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;"
                                          >服務條款</a
                                        >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        <a
                                          href="https://shopnex.tw/?article=privacyterms&page=blog_detail"
                                          target="_blank"
                                          rel="noopener"
                                          style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;"
                                          >隱私條款</a
                                        >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        <a
                                          href="https://shopnex.tw/?article=privacyterms&page=e-commerce-blog"
                                          target="_blank"
                                          rel="noopener"
                                          style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;"
                                          >開店教學</a
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>`;
  }

  public static async customerOrder(app: string, tag: string, order_id: string, email: string, language: string) {
    try {
      const customerMail = await this.getDefCompare(app, tag, language);
      const brandAndMemberType = await App.checkBrandAndMemberType(app);
      const order = await db.query(
        `SELECT * FROM \`${app}\`.t_checkout WHERE cart_token = ?
                `,
        [order_id]
      );
      if (order[0]) {
        const order_data = order[0]['orderData'];
        if (customerMail.toggle) {
          await new Mail(app).postMail({
            name: customerMail.name,
            title: customerMail.title.replace(/@\{\{訂單號碼\}\}/g, order_id),
            content: customerMail.content
              .replace(
                /@\{\{訂單號碼\}\}/g,
                `<a href="https://${brandAndMemberType.domain}/order_detail?cart_token=${order_id}">${order_id}</a>`
              )
              .replace(/@\{\{訂單金額\}\}/g, order_data.total)
              .replace(/@\{\{姓名\}\}/g, order_data.customer_info.name ?? '')
              .replace(/@\{\{電話\}\}/g, order_data.customer_info.phone ?? '')
              .replace(/@\{\{地址\}\}/g, order_data.user_info.address ?? '')
              .replace(/@\{\{信箱\}\}/g, order_data.customer_info.email ?? '')
              .replace(/@\{\{訂單驗證碼\}\}/g, order_data.verify_code ?? ''),
            email: [email],
            type: tag,
          });
        }
      }
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('BAD_REQUEST', 'customerOrder Error:' + error, null);
    }
  }
}
