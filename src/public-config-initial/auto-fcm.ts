import { AutoSendEmail } from '../api-public/services/auto-send-email.js';
import { User } from '../api-public/services/user.js';
import { ManagerNotify } from '../api-public/services/notify.js';
import { Firebase } from '../modules/firebase.js';

export class AutoFcm {
  public static initial(value: any) {
    const obj: any = {
      shipment: {
        name: '@{{app_name}}',
        title: '配送狀態已更新',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        toggle: true,
      },
      in_stock: {
        name: '@{{app_name}}',
        title: '配送狀態已更新',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 備貨中',
        toggle: true,
      },
      arrival: {
        name: '@{{app_name}}',
        title: '配送狀態已更新',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        toggle: true,
      },
      'order-create': {
        name: '@{{app_name}}',
        title: '訂單狀態已更新',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立，訂單驗證碼為「@{{訂單驗證碼}}」',
        toggle: true,
      },
      'payment-successful': {
        name: '@{{app_name}}',
        title: '付款狀態已更新',
        content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
        toggle: true,
      },
      'proof-purchase': {
        name: '@{{app_name}}',
        title: '付款狀態已更新',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
        toggle: true,
      },
      'order-cancel-success': {
        name: '@{{app_name}}',
        title: '取消訂單成功',
        content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
        toggle: true,
      },
      birthday: {
        name: '@{{app_name}}',
        title: '生日快樂',
        content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
        toggle: true,
      },
      'get-customer-message': {
        name: '@{{app_name}}',
        title: '收到客服訊息',
        content: getCustomerMessageHTML(),
        toggle: true,
      },
      ...value,
    };
    return obj;
  }

  public static async orderChangeInfo(obj: {
    app: string;
    tag: string;
    order_id: string;
    phone_email: string;
    verify_code: string;
  }) {
    const userData = await new User(obj.app).getUserData(obj.phone_email, 'email_or_phone');
    if (userData) {
      //
      const data = await new User(obj.app).getConfigV2({
        key: 'auto_fcm',
        user_id: 'manager',
      });
      const orderChangeInfo = (
        await new User(obj.app).getConfigV2({
          key: 'auto_fcm',
          user_id: 'manager',
        })
      )[obj.tag];

      const appData = await new User(obj.app).getConfigV2({
        key: 'store-information',
        user_id: 'manager',
      });
      //
      await new Firebase(obj.app).sendMessage({
        title: orderChangeInfo.title.replace(/@\{\{app_name\}\}/g, (appData && appData.shop_name) || '商店名稱'),
        userID: userData.userID,
        tag: 'orderChangeInfo',
        link: `/order_detail?cart_token=${obj.order_id}`,
        body: orderChangeInfo.content
          .replace(/@\{\{app_name\}\}/g, (appData && appData.shop_name) || '商店名稱')
          .replace(/@\{\{訂單號碼\}\}/g, `#${obj.order_id}`)
          .replace(/@\{\{訂單驗證碼\}\}/g, obj.verify_code ?? ''),
      });
    }
  }
}

function getCustomerMessageHTML() {
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
