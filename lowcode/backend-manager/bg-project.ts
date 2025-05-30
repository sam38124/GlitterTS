import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from './bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { ApiApp } from '../glitter-base/route/app.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { ApiWallet } from '../glitter-base/route/wallet.js';
import { ApiPageConfig } from '../api/pageConfig.js';

const html = String.raw;

export class BgProject {
  public static setLoginConfig(gvc: GVC) {
    const saasConfig: {
      config: any;
      api: any;
    } = (window as any).saasConfig;
    const html = String.raw;
    const dialog = new ShareDialog(gvc.glitter);
    let keyData: {
      verify: 'normal' | 'mail' | 'phone';
      verify_forget: 'mail';
      name: string;
      content: string;
      title: string;
      forget_title: string;
      forget_content: string;
      forget_page: string;
      will_come_title: string;
      will_come_content: string;
    } = {
      verify: 'normal',
      name: '',
      content: '',
      title: '',
      verify_forget: 'mail',
      forget_title: '',
      forget_content: '',
      forget_page: '',
      will_come_title: '',
      will_come_content: '',
    };

    function save(next: () => void) {
      const dialog = new ShareDialog(gvc.glitter);
      dialog.dataLoading({ text: '設定中', visible: true });
      saasConfig.api
        .setPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`, keyData)
        .then((r: { response: any; result: boolean }) => {
          dialog.dataLoading({ visible: false });
          if (r.response) {
            next();
          } else {
            dialog.errorMessage({ text: '設定失敗' });
          }
        });
    }

    return BgWidget.container(html`
      <div class="title-container ">
        ${BgWidget.title(`登入認證`)}
        <div class="flex-fill"></div>
        <button
          class="btn btn-primary-c"
          style="height:38px;font-size: 14px;"
          onclick="${gvc.event(() => {
            save(() => {
              dialog.successMessage({
                text: '設定成功',
              });
            });
          })}"
        >
          儲存並更改
        </button>
      </div>
      ${gvc.bindView(() => {
        const id = gvc.glitter.getUUID();
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`).then((data: any) => {
          if (data.response.result[0]) {
            keyData = data.response.result[0].value;
            keyData.verify_forget = keyData.verify_forget ?? 'mail';
            gvc.notifyDataChange(id);
          }
        });

        return {
          bind: id,
          view: () => {
            return new Promise(async (resolve, reject) => {
              resolve(
                html` <div style="width: 100%;">
                  ${BgWidget.card(
                    [
                      EditorElem.select({
                        title: '登入認證',
                        gvc: gvc,
                        def: keyData.verify,
                        array: [
                          { title: '無需認證', value: 'normal' },
                          { title: '信箱認證', value: 'mail' },
                        ],
                        callback: (text: any) => {
                          keyData.verify = text;
                          gvc.notifyDataChange(id);
                        },
                      }),
                      (() => {
                        if (keyData.verify === 'mail') {
                          keyData.content = keyData.content ?? '';
                          keyData.title = keyData.title ?? '嗨！歡迎加入 GLITTER.AI，請輸入驗證碼。';
                          if (keyData.content.indexOf('@{{code}}') === -1) {
                            keyData.content = `嗨！歡迎加入 GLITTER.AI，請輸入驗證碼「 @{{code}} 」。請於1分鐘內輸入並完成驗證。`;
                          }
                          return [
                            EditorElem.editeInput({
                              gvc: gvc,
                              title: '寄件者名稱',
                              default: keyData.name,
                              callback: text => {
                                keyData.name = text;
                                gvc.notifyDataChange(id);
                              },
                              placeHolder: '請輸入寄件者名稱',
                            }),
                            EditorElem.editeInput({
                              gvc: gvc,
                              title: '信件標題',
                              default: keyData.title,
                              callback: text => {
                                keyData.title = text;
                                gvc.notifyDataChange(id);
                              },
                              placeHolder: '請輸入信件標題',
                            }),
                            EditorElem.h3('信件內容'),
                            EditorElem.richText({
                              gvc: gvc,
                              def: keyData.content,
                              callback: text => {
                                keyData.content = text;
                              },
                            }),
                          ].join('');
                        } else {
                          return ``;
                        }
                      })(),
                    ].join('<div class="my-2"></div>')
                  )}
                  <div class="my-4">${BgWidget.title(`註冊成功信件`)}</div>
                  ${BgWidget.card(
                    [
                      (() => {
                        keyData.will_come_content =
                          keyData.will_come_content ||
                          html`<table
                            style="height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                >
                                  <table
                                    class="m_-6935525929279934079header"
                                    style="width:100%;border-spacing:0;border-collapse:collapse;margin:40px 0 20px"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                        >
                                          <center>
                                            <table
                                              class="m_-6935525929279934079container"
                                              style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                  >
                                                    <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                      <tbody>
                                                        <tr>
                                                          <td
                                                            class="m_-6935525929279934079shop-name__cell"
                                                            style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                          >
                                                            <h1
                                                              style="font-weight:normal;font-size:30px;color:#333;margin:0"
                                                            >
                                                              <a href="https://glitter-ai.com/?page=index"
                                                                ><span class="il">Glitter</span>.AI</a
                                                              >
                                                            </h1>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </center>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                    <tbody>
                                      <tr>
                                        <td
                                          style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;padding-bottom:40px;border-width:0'
                                        >
                                          <center>
                                            <table
                                              class="m_-6935525929279934079container"
                                              style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                  >
                                                    <h2 style="font-weight:normal;font-size:24px;margin:0 0 10px">
                                                      歡迎造訪 <span class="il">Glitter</span>.AI
                                                    </h2>
                                                    <p style="color:#777;line-height:150%;font-size:16px;margin:0">
                                                      你已啟用顧客帳號。下次向我們購買商品時可登入以加快結帳程序。
                                                    </p>

                                                    <table
                                                      style="width:100%;border-spacing:0;border-collapse:collapse;margin-top:20px"
                                                    >
                                                      <tbody>
                                                        <tr>
                                                          <td
                                                            style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                          >
                                                            <table
                                                              class="m_-6935525929279934079button m_-6935525929279934079main-action-cell"
                                                              style="border-spacing:0;border-collapse:collapse;float:left;margin-right:15px"
                                                            >
                                                              <tbody>
                                                                <tr>
                                                                  <td
                                                                    style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;border-radius:4px'
                                                                    align="center"
                                                                    bgcolor="#FD6A58"
                                                                  >
                                                                    <a
                                                                      href="https://glitter-ai.com/?page=index"
                                                                      class="m_-6935525929279934079button__text"
                                                                      style="font-size:16px;text-decoration:none;display:block;color:#fff;padding:20px 25px"
                                                                      target="_blank"
                                                                      data-saferedirecturl="https://www.google.com/url?q=https://homee.cc/_t/c/A1030004-178DF593BC260730-3276808C?l%3DAAC31U1HQyLV6yRc418Ol6ZTVtd35pqHBs7MfVIFQDr5cyyO2sIEDkhWHwZOWThosKbnlo0vxspUzXz95nAfGCAefk7ZV5q%252F4OcvJNHMWdazV7L3oV%252FeYRwJeFSZL8IjeY9FoC4%252FftsbMqiOvv3N3fuybzH6h87aaIKXJB3xQLvRDdoUEc%252Bls9WXIWwMVLjXOm2TaM0mO0WY2bk%253D%26c%3DAABphhQuF%252Fv1oMua9CSFTngouEXUusFfuKKA%252B2VsQyoM2b7GLOICMbafbOHbq9R6gAbjuFK%252BvnPtv5UjwCIQGNQ92Tn4ZBbwZKMj8Z3tN3K1GfGK8g4OdJMbcjXvYu33KJPpHD8FHNoIR1E9%252BxLb67yVIoHfOsdRfTFnkGTlPXqCushhfwL9%252BLJjZhI0vabSZ0edxj1olnSwMe32VLib6ljdCUeFYftICVKoS%252FoQwo5BfFKozF64R1mOrnNPoMop1Jxl7XGbxVIJegWLjoR01AgtwLRdehnioWNe%252FQS2efaSSVfSFbKA%252BgjAgwB7EChxgqD1T2Df4aecH%252F5PN7dZ1Ljh9MOxgxAxYNE%253D&amp;source=gmail&amp;ust=1704369669126000&amp;usg=AOvVaw2lf2J55g8YoRh8zhgbNpwz"
                                                                      >造訪我們的商店</a
                                                                    >
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
                                          </center>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    style="width:100%;border-spacing:0;border-collapse:collapse;border-top-width:1px;border-top-color:#e5e5e5;border-top-style:solid"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;padding:35px 0'
                                        >
                                          <center>
                                            <table
                                              class="m_-6935525929279934079container"
                                              style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                  >
                                                    <p style="color:#999;line-height:150%;font-size:14px;margin:0">
                                                      如有任何疑問，請回覆本電子郵件或透過
                                                      <a
                                                        href="mailto:service@ncdesign.info"
                                                        style="font-size:14px;text-decoration:none;color:#fd6a58"
                                                        target="_blank"
                                                        >service@<span class="il">ncdesign</span>.info</a
                                                      >
                                                      聯絡我們
                                                    </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </center>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <img
                                    src="https://ci3.googleusercontent.com/meips/ADKq_NbTVurv9Myfyz9PhnR6e2VliLt0CFlSGZQ-llBSyYXgCJk484f6C9PtRc3NQ--UqTVQLrUbxo9QnW7Jeol11m54Ffyk3C_-YGtSYbBtM-pocpNiNcD8mIkv3bNN3eh5HpLh1tiKiOpQakyoPqKg8tioAtjIe3HfGjshqtJap0HP0qao4Rdp96g8T6NDAFRUjXK3PAB6N0Hki6PwEBf3ccdaPkQ3EqMHTw-WD8MjTbiKIoAM=s0-d-e1-ft#https://cdn.shopify.com/shopifycloud/shopify/assets/themes_support/notifications/spacer-1a26dfd5c56b21ac888f9f1610ef81191b571603cb207c6c0f564148473cab3c.png"
                                    class="m_-6935525929279934079spacer CToWUd"
                                    height="1"
                                    style="min-width:600px;height:0"
                                    data-bit="iit"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>`;
                        keyData.will_come_title = keyData.will_come_title || '嗨！歡迎加入 Glitter.AI。';

                        return [
                          EditorElem.editeInput({
                            gvc: gvc,
                            title: '寄件者名稱',
                            default: keyData.name,
                            callback: text => {
                              keyData.name = text;
                              gvc.notifyDataChange(id);
                            },
                            placeHolder: '請輸入寄件者名稱',
                          }),
                          EditorElem.editeInput({
                            gvc: gvc,
                            title: '信件標題',
                            default: keyData.will_come_title,
                            callback: text => {
                              keyData.will_come_title = text;
                              gvc.notifyDataChange(id);
                            },
                            placeHolder: '請輸入信件標題',
                          }),
                          EditorElem.h3('信件內容'),
                          EditorElem.richText({
                            gvc: gvc,
                            def: keyData.will_come_content,
                            callback: text => {
                              keyData.will_come_content = text;
                            },
                          }),
                        ].join('');
                      })(),
                    ].join('<div class="my-2"></div>')
                  )}
                  <div class="my-4">${BgWidget.title(`忘記密碼設定`)}</div>
                  ${BgWidget.card(
                    [
                      EditorElem.select({
                        title: '忘記密碼',
                        gvc: gvc,
                        def: keyData.verify_forget,
                        array: [{ title: '信箱認證', value: 'mail' }],
                        callback: (text: any) => {
                          keyData.verify_forget = text;
                          gvc.notifyDataChange(id);
                        },
                      }),
                      (() => {
                        keyData.forget_title = keyData.forget_title || '忘記密碼';
                        keyData.forget_content = keyData.forget_content || '';
                        if (keyData.forget_content.indexOf('@{{code}}') === -1) {
                          keyData.forget_content = html` <div style="margin:0">
                            <table
                              style="height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                  >
                                    <table
                                      class="m_-7325585852261570963header"
                                      style="width:100%;border-spacing:0;border-collapse:collapse;margin:40px 0 20px"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                          >
                                            <center>
                                              <table
                                                class="m_-7325585852261570963container"
                                                style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                    >
                                                      <table
                                                        style="width:100%;border-spacing:0;border-collapse:collapse"
                                                      >
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              class="m_-7325585852261570963shop-name__cell"
                                                              style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                            >
                                                              <h1
                                                                style="font-weight:normal;font-size:30px;color:#333;margin:0"
                                                              >
                                                                <a href="">GLITTER.AI</a>
                                                              </h1>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </center>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>

                                    <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                      <tbody>
                                        <tr>
                                          <td
                                            style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;padding-bottom:40px;border-width:0'
                                          >
                                            <center>
                                              <table
                                                class="m_-7325585852261570963container"
                                                style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                    >
                                                      <h2 style="font-weight:normal;font-size:24px;margin:0 0 10px">
                                                        重設密碼
                                                      </h2>
                                                      <p style="color:#777;line-height:150%;font-size:16px;margin:0">
                                                        利用此連結前往 <a>GLITTER.AI</a>
                                                        重設你的顧客帳號密碼。如果你沒有申請新密碼，
                                                        <wbr />
                                                        可以安心刪除這封電子郵件。
                                                      </p>
                                                      <table
                                                        style="width:100%;border-spacing:0;border-collapse:collapse;margin-top:20px"
                                                      >
                                                        <tbody>
                                                          <tr>
                                                            <td
                                                              style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;line-height:0em'
                                                            >
                                                              &nbsp;
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td
                                                              style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif'
                                                            >
                                                              <table
                                                                class="m_-7325585852261570963button m_-7325585852261570963main-action-cell"
                                                                style="border-spacing:0;border-collapse:collapse;float:left;margin-right:15px"
                                                              >
                                                                <tbody>
                                                                  <tr>
                                                                    <td
                                                                      style='font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;border-radius:4px'
                                                                      align="center"
                                                                      bgcolor="black"
                                                                    >
                                                                      <a
                                                                        href="@{{code}}"
                                                                        class="m_-7325585852261570963button__text"
                                                                        style="font-size:16px;text-decoration:none;display:block;color:#fff;padding:20px 25px"
                                                                        >重設密碼</a
                                                                      >
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
                                            </center>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div class="yj6qo"></div>
                            <div class="adL"></div>
                          </div>`;
                        }
                        return [
                          EditorElem.editeInput({
                            gvc: gvc,
                            title: '信件標題',
                            default: keyData.forget_title,
                            callback: text => {
                              keyData.forget_title = text;
                              gvc.notifyDataChange(id);
                            },
                            placeHolder: '請輸入信件標題',
                          }),
                          EditorElem.pageSelect(gvc, '重設密碼頁面', keyData.forget_page, data => {
                            keyData.forget_page = data;
                          }),
                          EditorElem.h3('信件內容'),
                          EditorElem.richText({
                            gvc: gvc,
                            def: keyData.forget_content,
                            callback: text => {
                              keyData.forget_content = text;
                            },
                          }),
                        ].join('');
                      })(),
                    ].join('<div class="my-2"></div>')
                  )}
                </div>`
              );
            });
          },
          divCreate: { class: 'd-flex flex-column flex-column-reverse flex-md-row p-0', style: 'gap: 10px;' },
        };
      })}
    `);
  }

  public static userManager(gvc: GVC, type: 'select' | 'list' = 'list', callback: (list: any[]) => void = () => {}) {
    const glitter = gvc.glitter;
    const vm: {
      type: 'list' | 'add' | 'replace' | 'select';
      data: any;
      dataList: any;
      query?: string;
    } = {
      type: 'list',
      data: {
        id: 61,
        userID: 549313940,
        account: 'jianzhi.wang@homee.ai',
        userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
        created_time: '2023-11-26T02:14:09.000Z',
        role: 0,
        company: null,
        status: 1,
      },
      dataList: undefined,
      query: '',
    };
    const filterID = gvc.glitter.getUUID();
    let vmi: any = undefined;

    function getDatalist() {
      return vm.dataList.map((dd: any) => {
        return [
          {
            key: '用戶名稱',
            value: `<span class="fs-7">${dd.userData.name}</span>`,
          },
          {
            key: '用戶信箱',
            value: `<span class="fs-7">${dd.userData.email}</span>`,
          },
          {
            key: '建立時間',
            value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
          },
          {
            key: '用戶狀態',
            value: (() => {
              if (dd.status === 1) {
                return `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
              } else {
                return `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
              }
            })(),
          },
        ];
      });
    }

    return gvc.bindView(() => {
      const id = glitter.getUUID();
      return {
        bind: id,
        dataList: [{ obj: vm, key: 'type' }],
        view: () => {
          if (vm.type === 'list') {
            return BgWidget.container(html`
              <div class="title-container ${type === 'select' ? `d-none` : ``}">
                ${type === 'select' ? BgWidget.title('選擇用戶') : BgWidget.title('用戶管理')}
                <div class="flex-fill"></div>
                <button
                  class="btn hoverBtn me-2 px-3"
                  style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                  onclick="${gvc.event(() => {
                    BgProject.setUserForm(gvc, () => {
                      gvc.notifyDataChange(id);
                    });
                  })}"
                >
                  <i class="fa-regular fa-gear me-2 "></i>
                  自訂資料
                </button>
              </div>
              ${BgWidget.mainCard(
                [
                  BgWidget.searchPlace(
                    gvc.event((e, event) => {
                      vm.query = e.value;
                      gvc.notifyDataChange(id);
                    }),
                    vm.query || '',
                    '搜尋所有用戶'
                  ),
                  BgWidget.tableV3({
                    gvc: gvc,
                    getData: vmi => {
                      const limit = 20;
                      ApiUser.getUserList({
                        page: vmi.page - 1,
                        limit: limit,
                        search: vm.query || undefined,
                      }).then(data => {
                        vm.dataList = data.response.data;
                        vmi.pageSize = Math.ceil(data.response.total / limit);
                        vmi.originalData = vm.dataList;
                        vmi.tableData = getDatalist();
                        vmi.loading = false;
                        vmi.callback();
                      });
                    },
                    rowClick: (data, index) => {
                      if (type === 'select') {
                        vm.dataList[index].checked = !vm.dataList[index].checked;
                        vmi.data = getDatalist();
                        vmi.callback();
                        callback(
                          vm.dataList.filter((dd: any) => {
                            return dd.checked;
                          })
                        );
                      } else {
                        vm.data = vm.dataList[index];
                        vm.type = 'replace';
                      }
                    },
                    filter: [
                      {
                        name: '批量移除',
                        event: () => {
                          const dialog = new ShareDialog(gvc.glitter);
                          dialog.checkYesOrNot({
                            text: '是否確認刪除所選項目？',
                            callback: response => {
                              if (response) {
                                dialog.dataLoading({ visible: true });
                                ApiUser.deleteUser({
                                  id: vm.dataList
                                    .filter((dd: any) => {
                                      return dd.checked;
                                    })
                                    .map((dd: any) => {
                                      return dd.id;
                                    })
                                    .join(`,`),
                                }).then(res => {
                                  dialog.dataLoading({ visible: false });
                                  if (res.result) {
                                    vm.dataList = undefined;
                                    gvc.notifyDataChange(id);
                                  } else {
                                    dialog.errorMessage({ text: '刪除失敗' });
                                  }
                                });
                              }
                            },
                          });
                        },
                      },
                    ],
                  }),
                ].join('')
              )}
            `);
          } else if (vm.type == 'replace') {
            return this.userInformationDetail({
              userID: vm.data.userID,
              callback: () => {
                vm.type = 'list';
              },
              gvc: gvc,
            });
          } else {
            return ``;
          }
        },
      };
    });
  }

  public static userInformationDetail(cf: {
    userID: string;
    gvc: GVC;
    callback: () => void;
    type?: 'readonly' | 'write';
  }) {
    const gvc = cf.gvc;
    const id = gvc.glitter.getUUID();
    const vm: any = {
      data: undefined,
      loading: true,
    };

    ApiUser.getPublicUserData(cf.userID).then(dd => {
      vm.data = dd.response;
      vm.loading = false;
      gvc.notifyDataChange(id);
    });
    return gvc.bindView(() => {
      return {
        bind: id,
        view: () => {
          if (vm.loading) {
            return html`<div class="w-100 d-flex align-items-center"><div class="spinner-border"></div></div>`;
          }
          vm.data.userData = vm.data.userData ?? {};
          return BgWidget.container(
            [
              html`<div class="title-container">
                ${BgWidget.goBack(
                  gvc.event(() => {
                    cf.callback();
                  })
                )}
                ${BgWidget.title(vm.data.userData.name ?? '匿名用戶')}
                <div class="flex-fill"></div>
                <button
                  class="btn hoverBtn me-2 px-3 ${cf.type === 'readonly' ? `d-none` : ``}"
                  style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                  onclick="${gvc.event(() => {
                    BgProject.setUserForm(gvc, () => {
                      gvc.notifyDataChange(id);
                    });
                  })}"
                >
                  <i class="fa-regular fa-gear me-2 "></i>
                  自訂資料
                </button>
                <button
                  class="btn btn-primary-c ${cf.type === 'readonly' ? `d-none` : ``}"
                  style="height:35px;font-size: 14px;"
                  onclick="${gvc.event(() => {
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.dataLoading({ text: '更新中', visible: true });
                    ApiUser.updateUserDataManager(vm.data, vm.data.userID).then(response => {
                      dialog.dataLoading({ text: '', visible: false });
                      if (response.result) {
                        dialog.successMessage({ text: '更新成功' });
                        gvc.notifyDataChange(id);
                      } else {
                        dialog.errorMessage({ text: '更新異常' });
                      }
                    });
                  })}"
                >
                  儲存
                </button>
              </div>`,
              html`<div class="d-flex" style="gap: 10px;">
                ${BgWidget.card(
                  [
                    gvc.bindView(() => {
                      const id = gvc.glitter.getUUID();
                      const vmi: {
                        mode: 'edit' | 'read';
                      } = {
                        mode: 'read',
                      };
                      return {
                        bind: id,
                        view: () => {
                          let map: any = [];
                          vm.data.userID &&
                            map.push(html`
                              <div class="d-flex align-items-center border-bottom pb-2">
                                <div class="fw-bold fs-7"></div>
                                <div class="d-flex" style="gap: 10px;">
                                  <div class="fw-bold fs-7">用戶ID</div>
                                  <div class="fw-normal fs-7">${vm.data.userID}</div>
                                  <div class="fw-bold fs-7">用戶建立時間</div>
                                  <div class="fw-normal fs-7">
                                    ${gvc.glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd hh:mm')}
                                  </div>
                                </div>
                                <div class="flex-fill"></div>
                                <i
                                  class="fa-solid fa-pencil ${cf.type === 'readonly' ? `d-none` : ``}"
                                  style="cursor:pointer;"
                                  onclick="${gvc.event(() => {
                                    vmi.mode = vmi.mode === 'edit' ? 'read' : 'edit';
                                    gvc.notifyDataChange(id);
                                  })}"
                                ></i>
                              </div>
                            `);
                          map.push(
                            gvc.bindView(() => {
                              const saasConfig: {
                                config: any;
                                api: any;
                              } = (window.parent as any).saasConfig;
                              const id = gvc.glitter.getUUID();
                              return {
                                bind: id,
                                view: () => {
                                  return new Promise(async (resolve, reject) => {
                                    let data = (
                                      (
                                        await saasConfig.api.getPrivateConfig(
                                          saasConfig.config.appName,
                                          `glitterUserForm`
                                        )
                                      ).response.result[0] ?? {}
                                    ).value;
                                    if (!Array.isArray(data)) {
                                      data = [];
                                    }
                                    resolve(
                                      FormWidget.editorView({
                                        gvc: gvc,
                                        array: data,
                                        refresh: () => {},
                                        formData: vm.data.userData,
                                        readonly: vmi.mode === 'edit' ? 'write' : 'read',
                                      })
                                    );
                                  });
                                },
                              };
                            })
                          );
                          return map.join('');
                        },
                      };
                    }),
                  ].join(html`<div class="my-2 bgf6 w-100" style="height:1px;"></div>`)
                )}
                <div style="width:350px;">
                  ${BgWidget.card(
                    [
                      html`<div class="fw-bold fs-7">電子錢包</div>
                        ${gvc.bindView(() => {
                          return {
                            bind: gvc.glitter.getUUID(),
                            view: () => {
                              return new Promise(async (resolve, reject) => {
                                const sum = (await ApiWallet.getSum({ userID: vm.data.userID })).response.sum;
                                resolve(`$${sum.toLocaleString()}`);
                              });
                            },
                            divCreate: {
                              class: `fs-7`,
                            },
                          };
                        })} `,
                      html`
                        <div class="fw-bold fs-7">購物金</div>
                        <div class="fs-7">
                          ${gvc.bindView(() => {
                            return {
                              bind: gvc.glitter.getUUID(),
                              view: () => {
                                return new Promise(async (resolve, reject) => {
                                  const sum = (await ApiWallet.getRebateSum({ userID: vm.data.userID })).response.sum;
                                  resolve(`$${sum.toLocaleString()}`);
                                });
                              },
                              divCreate: {
                                class: `fs-7 `,
                              },
                            };
                          })}
                        </div>
                      `,
                    ].join(html`<div class="w-100 border-bottom my-2"></div>`)
                  )}
                </div>
              </div>`,
            ].join('<div class="my-2"></div>')
          );
        },
      };
    });
  }

  public static setUserForm(gvc: GVC, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);
    const saasConfig: {
      config: any;
      api: any;
    } = (window as any).saasConfig;
    new Promise(async (resolve, reject) => {
      let data = (
        (await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0] ?? {}
      ).value;
      if (!Array.isArray(data)) {
        data = [];
      }
      EditorElem.openEditorDialog(
        gvc,
        gvc => {
          return [
            gvc.bindView(() => {
              const id = gvc.glitter.getUUID();
              return {
                bind: id,
                view: () => {
                  return FormWidget.settingView({
                    gvc: gvc,
                    array: data,
                    refresh: () => {
                      setTimeout(() => {
                        gvc.notifyDataChange(id);
                      }, 100);
                    },
                    title: '',
                    styleSetting: false,
                    concat: dd => {
                      dd.auth = dd.auth ?? 'all';
                      return [
                        EditorElem.select({
                          title: '更改資料權限',
                          gvc: gvc,
                          def: dd.auth,
                          array: [
                            { title: '用戶與管理員', value: 'all' },
                            { title: '僅管理員', value: 'manager' },
                          ],
                          callback: text => {
                            dd.auth = text;
                          },
                        }),
                      ];
                    },
                  });
                },
              };
            }),
            html`<div class="d-flex">
              <div class="flex-fill"></div>
              <div
                class=" btn-primary-c btn my-2 me-2"
                style="margin-left: 10px;height:35px;"
                onclick="${gvc.event(() => {
                  dialog.dataLoading({ text: '設定中', visible: true });
                  saasConfig.api
                    .setPrivateConfig(saasConfig.config.appName, 'glitterUserForm', data)
                    .then((r: { response: any; result: boolean }) => {
                      setTimeout(() => {
                        dialog.dataLoading({ visible: false });
                        if (r.response) {
                          dialog.successMessage({ text: '設定成功' });
                          callback();
                        } else {
                          dialog.errorMessage({ text: '設定失敗' });
                        }
                      }, 1000);
                    });
                  gvc.closeDialog();
                })}"
              >
                儲存設定
              </div>
            </div>`,
          ].join('');
        },
        () => {
          return new Promise((resolve, reject) => {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.checkYesOrNot({
              text: '是否取消除儲存?',
              callback: response => {
                resolve(response);
              },
            });
          });
        },
        500,
        '自訂表單'
      );
    });
  }

  public static appRelease(gvc: GVC, type: string) {
    const glitter = gvc.glitter;

    const vm: {
      status: 'list' | 'add' | 'replace';
      dataList: any;
      query: string;
    } = {
      status: 'list',
      dataList: undefined,
      query: '',
    };
    let replaceData: any = '';
    return gvc.bindView(() => {
      const id = glitter.getUUID();
      return {
        dataList: [
          {
            obj: vm,
            key: 'status',
          },
        ],
        bind: id,
        view: () => {
          switch (vm.status) {
            case 'add':
              return BgProject.appReleaseForm(vm, gvc, type);
            case 'list':
              const filterID = gvc.glitter.getUUID();
              return BgWidget.container(html`
                <div class="d-flex w-100 align-items-sm-center flex-column flex-sm-row" style="gap:20px;">
                  ${BgWidget.title('應用上架審核')}
                  <div class="d-flex  w-100 justify-content-between">
                    <div class="ms-sm-3" style="max-width: 200px;">
                      ${EditorElem.select({
                        title: '',
                        gvc: gvc,
                        def: type,
                        array: [
                          { title: 'IOS應用商城', value: 'apple_release' },
                          { title: 'Android應用商城', value: 'android_release' },
                        ],
                        callback: (text: string) => {
                          type = text;
                          gvc.notifyDataChange(id);
                        },
                      })}
                    </div>
                    <div class="flex-fill"></div>
                    ${BgWidget.darkButton(
                      '新增送審項目',
                      gvc.event(() => {
                        vm.status = 'add';
                      })
                    )}
                  </div>
                </div>
                <div class="my-3"></div>
                ${BgWidget.alertInfo('請注意!', [
                  '必須升級至電商+APP方案才能使用此功能',
                  '審核通過的結果可能會因應用程式的完整性、商店條款、隱私權政策、以及平台政策等方面而有所不同，建議送審時，請再三進行確認',
                  '審核時間預計落在 7 到 14 個工作天',
                ])}
                ${BgWidget.container(
                  BgWidget.mainCard(
                    [
                      BgWidget.searchPlace(
                        gvc.event((e, event) => {
                          vm.query = e.value;
                          gvc.notifyDataChange(id);
                        }),
                        vm.query || '',
                        '搜尋所有紀錄'
                      ),
                      BgWidget.tableV3({
                        gvc: gvc,
                        getData: vmi => {
                          const limit = 50;
                          ApiApp.getAppRelease({
                            page: vmi.page - 1,
                            limit: limit,
                            search: vm.query || undefined,
                            type: type,
                          }).then(data => {
                            function getDatalist() {
                              return data.response.data.map(
                                (dd: {
                                  content: {
                                    logo: string;
                                    image: {
                                      '6.7': string[];
                                      '6.5': string[];
                                      '5.5': string[];
                                    };
                                    type: 'apple_release';
                                    market_info: {
                                      promote_string: string;
                                      description: string;
                                      keywords: string;
                                      support_url: string;
                                      version: string;
                                      copy_right: string;
                                      market_url: string;
                                      title: string;
                                      sub_title: string;
                                      privacy: string;
                                    };
                                    name: string;
                                    bundle_id: string;
                                    status: 'wait' | 'finish' | 'manual' | 'error';
                                  };
                                  checked: boolean;
                                }) => {
                                  return [
                                    {
                                      key: 'APP資訊',
                                      value: html`<div style="min-width: 150px;">
                                        <img
                                          class="rounded border me-2 ${dd.content.logo || 'd-none'}"
                                          alt=""
                                          src="${dd.content.logo}"
                                          style="width:40px;height:40px;"
                                        />
                                        <span>${dd.content.name}</span>
                                      </div>`,
                                    },
                                    {
                                      key: '審核狀態',
                                      value: (() => {
                                        switch (dd.content.status) {
                                          case 'finish':
                                            return `<div class="badge badge-success fs-7" >審核通過</div>`;
                                          case 'error':
                                            return `<div class="badge bg-danger fs-7" >審核失敗</div>`;
                                          case 'wait':
                                            return `<div class="badge bg-warning fs-7" style="color:black;">等待審核</div>`;
                                          default:
                                            return `<div class="badge bg-secondary fs-7" >手動送審</div>`;
                                        }
                                      })(),
                                    },
                                    {
                                      key: '專案包',
                                      value: html`<i
                                        class="fa-solid fa-download fs-6 ms-3"
                                        onclick="${gvc.event((e, event) => {
                                          const dialog = new ShareDialog(gvc.glitter);
                                          dialog.dataLoading({ visible: true });
                                          (
                                            (type === 'android_release'
                                              ? ApiApp.downloadAndroidRelease
                                              : ApiApp.downloadIOSRelease) as any
                                          )({
                                            app_name: dd.content.name,
                                            bundle_id: dd.content.bundle_id,
                                          }).then((dd: any) => {
                                            dialog.dataLoading({ visible: false });
                                            if (dd.result) {
                                              dialog.successMessage({
                                                text: '下載成功，請前往資料夾查看。',
                                              });
                                              (window.parent as any).glitter.openNewTab(dd.response.url);
                                            } else {
                                              dialog.errorMessage({ text: '下載失敗' });
                                            }
                                          });
                                          event.stopPropagation();
                                        })}"
                                      ></i>`,
                                    },
                                  ].map(dd => {
                                    dd.value = `<div style="line-height:40px;">${dd.value}</div>`;
                                    return dd;
                                  });
                                }
                              );
                            }

                            vm.dataList = data.response.data;
                            vmi.pageSize = Math.ceil(data.response.total / limit);
                            vmi.originalData = vm.dataList;
                            vmi.tableData = getDatalist();
                            vmi.loading = false;
                            vmi.callback();
                          });
                        },
                        rowClick: (data, index) => {
                          replaceData = vm.dataList[index].content;
                          vm.status = 'replace';
                        },
                        filter: [
                          {
                            name: '批量移除',
                            event: checkedData => {
                              const dialog = new ShareDialog(glitter);
                              dialog.checkYesOrNot({
                                text: '是否確認刪除所選項目？',
                                callback: response => {
                                  if (response) {
                                    dialog.dataLoading({ visible: true });
                                    ApiShop.delete({
                                      id: checkedData.map((dd: any) => dd.id).join(`,`),
                                    }).then(res => {
                                      dialog.dataLoading({ visible: false });
                                      if (res.result) {
                                        vm.dataList = undefined;
                                        gvc.notifyDataChange(id);
                                      } else {
                                        dialog.errorMessage({ text: '刪除失敗' });
                                      }
                                    });
                                  }
                                },
                              });
                            },
                          },
                        ],
                      }),
                    ].join('')
                  )
                )}
              `);
            case 'replace':
              return BgProject.appReleaseForm(vm, gvc, type, replaceData);
          }
        },
        divCreate: {
          class: `w-100 h-100`,
        },
      };
    });
  }

  public static templateReleaseForm(gvc: GVC) {
    const saasConfig: {
      config: any;
      api: any;
    } = (window.parent as any).saasConfig;
    const html = String.raw;
    const postMD: {
      preview_img: string;
      image: string[];
      desc: string;
      name: string;
      created_by: string;
      version: string;
      status: 'finish' | 'error' | 'wait' | 'no';
      post_to: 'all' | 'me' | 'cancel';
      tag: string[];
    } = (window.parent as any).glitter.share.editorViewModel.appConfig.template_config ?? {
      preview_img: '',
      image: [],
      desc: '',
      name: '',
      created_by: '',
      status: 'no',
      post_to: 'all',
      version: '1.0',
      tag: [],
    };

    if (
      (window.parent as any).glitter.share.editorViewModel.appConfig.template_type === 2 ||
      (window.parent as any).glitter.share.editorViewModel.appConfig.template_type === 3
    ) {
      postMD.status = 'finish';
    } else if ((window.parent as any).glitter.share.editorViewModel.appConfig.template_type === -1) {
      postMD.status = 'error';
    } else if ((window.parent as any).glitter.share.editorViewModel.appConfig.template_type === 0) {
      postMD.status = 'no';
    }
    postMD.tag = postMD.tag ?? [];
    if (postMD.post_to === 'cancel') {
      postMD.post_to = 'all';
    }
    function save() {
      const dialog = new ShareDialog(gvc.glitter);
      if (postMD.post_to === 'all') {
        postMD.status = 'wait';
      } else {
        postMD.status = 'finish';
      }
      dialog.dataLoading({ text: '提交審核中...', visible: true });
      ApiPageConfig.createTemplate((window.parent as any).appName, postMD, saasConfig.config.token).then(response => {
        dialog.dataLoading({ visible: false });
        if (response.result) {
          dialog.successMessage({ text: `上傳成功...` });
        }
        location.reload();
      });
    }

    return BgWidget.container(html`
      <div class="title-container ">
        ${BgWidget.title(`模板發佈`)}
        ${(() => {
          return (() => {
            switch (postMD.status) {
              case 'finish':
                return `<div class="badge badge-success fs-7 ms-2" >審核通過</div>`;
              case 'error':
                return `<div class="badge bg-danger fs-7 ms-2" >審核失敗</div>`;
              case 'wait':
                return `<div class="badge bg-warning fs-7 ms-2" style="color:black;">等待審核</div>`;
              default:
                return `<div class="badge bg-secondary fs-7 ms-2 border" >尚未發佈</div>`;
            }
          })();
        })()}
        <div class="flex-fill"></div>
        ${BgWidget.darkButton(
          '確認發佈',
          gvc.event(() => {
            save();
          })
        )}
      </div>
      ${gvc.bindView(() => {
        const id = gvc.glitter.getUUID();
        return {
          bind: id,
          view: () => {
            return new Promise(async (resolve, reject) => {
              resolve(
                html` <div style="width: 100%;">
                  ${[
                    BgWidget.alertInfo('請注意 !', ['模板發佈請注意上架規範守則，嚴禁發佈觸犯法律條款之內容']),
                    BgWidget.card(
                      [
                        html`
                          ${[
                            html` <div class="row">
                              ${[
                                EditorElem.editeInput({
                                  title: '模板名稱',
                                  gvc: gvc,
                                  default: postMD.name,
                                  callback: text => {
                                    postMD.name = text;
                                  },
                                  placeHolder: '請輸入模板名稱',
                                }),
                                EditorElem.editeInput({
                                  title: '作者名稱',
                                  gvc: gvc,
                                  default: postMD.created_by,
                                  callback: text => {
                                    postMD.created_by = text;
                                  },
                                  placeHolder: '請輸入作者名稱',
                                }),
                                EditorElem.editeInput({
                                  title: '版本號碼',
                                  gvc: gvc,
                                  default: postMD.version,
                                  callback: text => {
                                    postMD.version = text;
                                  },
                                  placeHolder: '請輸入版本號碼',
                                }),
                                EditorElem.select({
                                  title: '發佈至',
                                  gvc: gvc,
                                  def: postMD.post_to,
                                  array: [
                                    {
                                      title: '官方與個人模板庫',
                                      value: 'all',
                                    },
                                    {
                                      title: '個人模板庫',
                                      value: 'me',
                                    },
                                  ],
                                  callback: (text: string) => {
                                    postMD.post_to = text as any;
                                  },
                                }),
                              ]
                                .map(dd => {
                                  return `<div class="col-6 ">${dd}</div>`;
                                })
                                .join('')}
                            </div>`,
                            `${EditorElem.h3('模板標籤')}
                                                    ${gvc.bindView(() => {
                                                      const id = gvc.glitter.getUUID();
                                                      function refreshTag() {
                                                        gvc.notifyDataChange(id);
                                                      }
                                                      return {
                                                        bind: id,
                                                        view: () => {
                                                          return html` ${postMD.tag
                                                              .map((dd, index) => {
                                                                return html` <div
                                                                  class="badge bg-warning text-dark btn "
                                                                >
                                                                  <i
                                                                    class="fa-regular fa-circle-minus me-1 text-danger fw-bold"
                                                                    onclick="${gvc.event(() => {
                                                                      postMD.tag.splice(index, 1);
                                                                      refreshTag();
                                                                    })}"
                                                                  ></i
                                                                  >${dd}
                                                                </div>`;
                                                              })
                                                              .join('')}
                                                            <div
                                                              class="badge  btn "
                                                              style="background: #295ed1;"
                                                              onclick="${gvc.event(() => {
                                                                EditorElem.openEditorDialog(
                                                                  gvc,
                                                                  gvc => {
                                                                    let label = '';
                                                                    return html`<div class="p-2">
                                                                        ${EditorElem.editeInput({
                                                                          gvc: gvc,
                                                                          title: '標籤名稱',
                                                                          default: label,
                                                                          placeHolder: '請輸入標籤名稱',
                                                                          callback: text => {
                                                                            label = text;
                                                                          },
                                                                        })}
                                                                      </div>
                                                                      <div
                                                                        class="w-100 border-top p-2 d-flex align-items-center justify-content-end"
                                                                      >
                                                                        <button
                                                                          class="btn btn-primary"
                                                                          style="height:35px;width:80px;"
                                                                          onclick="${gvc.event(() => {
                                                                            postMD.tag.push(label);
                                                                            refreshTag();
                                                                            gvc.closeDialog();
                                                                          })}"
                                                                        >
                                                                          確認新增
                                                                        </button>
                                                                      </div> `;
                                                                  },
                                                                  () => {},
                                                                  400,
                                                                  '新增標籤'
                                                                );
                                                              })}"
                                                            >
                                                              <i class="fa-regular fa-circle-plus me-1"></i>新增標籤
                                                            </div>`;
                                                        },
                                                        divCreate: {
                                                          class: `w-100 d-flex flex-wrap bg-secondary p-3`,
                                                          style: `gap:5px;`,
                                                        },
                                                      };
                                                    })} 
                                                     `,
                            EditorElem.editeText({
                              gvc: gvc,
                              title: '模板描述',
                              placeHolder: `請輸入模板描述`,
                              default: postMD.desc,
                              callback: text => {
                                postMD.desc = text;
                              },
                            }),

                            gvc.bindView(() => {
                              const id = gvc.glitter.getUUID();
                              return {
                                bind: id,
                                view: () => {
                                  return (
                                    EditorElem.h3(
                                      html` <div class="d-flex align-items-center" style="gap: 10px;">
                                        模板圖片（首張圖片為預覽圖）
                                        <div
                                          class="d-flex align-items-center justify-content-center rounded-3"
                                          style="height: 30px;width: 80px;"
                                        >
                                          <button
                                            class="btn ms-2 btn-primary-c ms-2"
                                            style="height: 30px;width: 80px;"
                                            onclick="${gvc.event(() => {
                                              EditorElem.uploadFileFunction({
                                                gvc: gvc,
                                                callback: text => {
                                                  postMD.image.push(text);
                                                  gvc.notifyDataChange(id);
                                                },
                                                type: `image/*, video/*`,
                                              });
                                            })}"
                                          >
                                            添加圖檔
                                          </button>
                                        </div>
                                      </div>`
                                    ) +
                                    html` <div class="my-2"></div>` +
                                    EditorElem.flexMediaManager({
                                      gvc: gvc,
                                      data: postMD.image,
                                    })
                                  );
                                },
                                divCreate: {},
                              };
                            }),
                          ].join('')}
                        `,
                      ].join('<div class="my-2"></div>')
                    ),
                    html`<div
                      class="${postMD.status === 'finish' ? `d-flex align-items-center justify-content-end` : `d-none`}"
                    >
                      ${BgWidget.redButton(
                        '取消發佈',
                        gvc.event(() => {
                          postMD.post_to = 'cancel';
                          save();
                        }),
                        { icon: 'fa-regular fa-trash-can' }
                      )}
                    </div>`,
                  ].join(`<div class="my-3"></div>`)}
                </div>`
              );
            });
          },
          divCreate: { class: 'd-flex flex-column flex-column-reverse flex-md-row p-0', style: 'gap: 10px;' },
        };
      })}
    `);
  }

  public static appReleaseForm(
    vm: {
      status: 'list' | 'add' | 'replace';
      dataList: any;
      query: string;
    },
    gvc: GVC,
    type: string,
    editorData?: any
  ) {
    const saasConfig: {
      config: any;
      api: any;
    } = (window as any).saasConfig;
    const html = String.raw;
    const dialog = new ShareDialog(gvc.glitter);
    const postMD: {
      logo: string;
      image: {
        '6.7': string[];
        '6.5': string[];
        '5.5': string[];
        android: string[];
      };
      type: 'apple_release' | 'android_release';
      market_info: {
        promote_string: string;
        description: string;
        keywords: string;
        support_url: string;
        version: string;
        copy_right: string;
        market_url: string;
        title: string;
        sub_title: string;
        privacy: string;
      };
      name: string;
      bundle_id: string;
      status: 'wait' | 'finish' | 'manual' | 'error';
    } = editorData || {
      logo: '',
      image: {
        '6.7': [],
        '6.5': [],
        '5.5': [],
        android: [],
      },
      name: '',
      type: type,
      market_info: {
        title: '',
        sub_title: '',
        keywords: '',
        support_url: '',
        version: '',
        copy_right: '',
        market_url: '',
        privacy: '',
        promote_string: '',
        description: '',
      },
      bundle_id: '',
      status: 'manual',
    };

    function save() {
      const dialog = new ShareDialog(gvc.glitter);
      if (
        !(postMD.name && postMD.logo && postMD.bundle_id) ||
        !(
          (postMD.image['6.7'].length >= 3 && postMD.image['6.5'].length >= 3 && postMD.image['5.5'].length >= 3) ||
          postMD.type === 'android_release'
        ) ||
        !(postMD.image.android.length >= 3 || postMD.type === 'apple_release') ||
        Object.keys(postMD.market_info).find(dd => {
          return (!postMD.market_info as any)[dd];
        })
      ) {
        dialog.infoMessage({ text: '請確實填寫所有內容' });
        return;
      }
      dialog.dataLoading({ text: '提交審核中...', visible: true });
      (editorData ? ApiPost.put : ApiPost.post)({
        postData: postMD,
        token: GlobalUser.saas_token,
        type: 'manager',
      }).then((re: any) => {
        dialog.dataLoading({ visible: false });
        if (re.result) {
          vm.status = 'list';
          dialog.successMessage({ text: `上傳成功...` });
        } else {
          dialog.errorMessage({ text: `上傳失敗...` });
        }
      });
    }

    return BgWidget.container(html`
      <div class="title-container">
        ${BgWidget.goBack(
          gvc.event(() => {
            vm.status = 'list';
          })
        )}
        ${BgWidget.title(`審核項目`)}
        ${(() => {
          return (() => {
            switch (postMD.status) {
              case 'finish':
                return `<div class="badge badge-success fs-7 ms-2" >審核通過</div>`;
              case 'error':
                return `<div class="badge bg-danger fs-7 ms-2" >審核失敗</div>`;
              case 'wait':
                return `<div class="badge bg-warning fs-7 ms-2" style="color:black;">等待審核</div>`;
              default:
                return `<div class="badge bg-secondary fs-7 ms-2" >手動送審</div>`;
            }
          })();
        })()}
        <div class="flex-fill"></div>
      </div>
      ${gvc.bindView(() => {
        const id = gvc.glitter.getUUID();
        return {
          bind: id,
          view: () => {
            return new Promise(async (resolve, reject) => {
              resolve(
                html` <div style="width: 100%;">
                  ${[
                    BgWidget.alertInfo('請注意!', [
                      '審核通過的結果可能會因應用程式的完整性、商店條款、隱私權政策、以及平台政策等方面而有所不同',
                      '建議送審時，請再三進行確認',
                      '審核時間預計落在 7 到 14 個工作天',
                    ]),
                    BgWidget.card(
                      [
                        html` ${BgWidget.title('APP資訊')}
                          <div class="row">
                            ${[
                              EditorElem.editeInput({
                                title: 'APP名稱',
                                gvc: gvc,
                                default: postMD.name,
                                callback: text => {
                                  postMD.name = text;
                                },
                                placeHolder: '請輸入APP名稱',
                              }),
                              EditorElem.editeInput({
                                title: `套件識別碼(${type === 'apple_release' ? `Bundle ID` : `Application Id`})`,
                                gvc: gvc,
                                default: postMD.bundle_id,
                                callback: text => {
                                  postMD.bundle_id = text;
                                },
                                placeHolder: '請輸入套件識別碼',
                              }),
                              EditorElem.uploadImage({
                                title: 'LOGO',
                                gvc: gvc,
                                def: postMD.logo,
                                callback: text => {
                                  postMD.logo = text;
                                },
                              }),
                              (() => {
                                switch (postMD.status) {
                                  case 'finish':
                                  case 'error':
                                    return ``;
                                  case 'wait':
                                  case 'manual':
                                    return EditorElem.select({
                                      title: '審核方式',
                                      gvc: gvc,
                                      def: postMD.status,
                                      array: [
                                        {
                                          title: '自行上架(僅下載APP原始碼，並自行上架至商城)',
                                          value: 'manual',
                                        },
                                        {
                                          title: '官方送審(透過SHOPNEX官方協助上架)',
                                          value: 'wait',
                                        },
                                      ],
                                      callback: text => {
                                        (postMD.status as any) = text;
                                      },
                                    });
                                }
                              })(),
                            ]
                              .map(dd => {
                                return html`<div class="col-12 col-md-6">${dd}</div>`;
                              })
                              .join('')}
                          </div>
                          <div class="mx-n3 mt-3">
                            ${(postMD.type === 'apple_release' ? ['6.7', '6.5', '5.5'] : ['android'])
                              .map((value, index: number) => {
                                const key: '6.7' | '6.5' | '5.5' | 'android' = value as any;
                                return EditorElem.arrayItem({
                                  gvc: gvc,
                                  title:
                                    key === 'android'
                                      ? `上傳應用程式截圖 *至少三張*`
                                      : `上傳${key}寸截圖 (${(() => {
                                          switch (key) {
                                            case '5.5':
                                              return '1242 x 2208';
                                            case '6.5':
                                              return '1284 x 2778';
                                            case '6.7':
                                              return '1290 x 2796';
                                          }
                                          {
                                          }
                                        })()}) *至少三張*`,
                                  array: () => {
                                    return postMD.image[key].map(dd => {
                                      return {
                                        title: dd,
                                        innerHtml: gvc => {
                                          gvc.glitter.openDiaLog(
                                            new URL('../dialog/image-preview.js', import.meta.url).href,
                                            'preview',
                                            dd
                                          );
                                          return ``;
                                        },
                                      };
                                    });
                                  },
                                  customEditor: true,
                                  originalArray: postMD.image[key],
                                  expand: {},
                                  refreshComponent: () => {
                                    gvc.notifyDataChange(id);
                                  },
                                  plus: {
                                    title: '新增截圖',
                                    event: gvc.event(() => {
                                      EditorElem.fileUploadEvent('image/*', url => {
                                        postMD.image[key].push(url);
                                        gvc.notifyDataChange(id);
                                      });
                                    }),
                                  },
                                  copyable: false,
                                });
                              })
                              .join('')}
                          </div>`,
                      ].join('<div class="my-2"></div>')
                    ),
                    BgWidget.card(
                      [
                        html` <div class="border-bottom pb-2">${BgWidget.title('商店資訊')}</div> `,
                        html`<div class="row">
                          ${(() => {
                            return [
                              'title',
                              'sub_title',
                              'keywords',
                              'support_url',
                              'version',
                              'copy_right',
                              'market_url',
                              'privacy',
                              'promote_string',
                              'description',
                            ]
                              .map(dd => {
                                const key:
                                  | 'promote_string'
                                  | 'privacy'
                                  | 'description'
                                  | 'keywords'
                                  | 'support_url'
                                  | 'version'
                                  | 'copy_right'
                                  | 'market_url'
                                  | 'title'
                                  | 'sub_title' = dd as any;
                                const title = (() => {
                                  switch (key) {
                                    case 'copy_right':
                                      return '版權';
                                    case 'description':
                                      return '描述';
                                    case 'keywords':
                                      return '關鍵字';
                                    case 'market_url':
                                      return '行銷 URL';
                                    case 'promote_string':
                                      return '行銷宣傳文字';
                                    case 'support_url':
                                      return '支援 URL';
                                    case 'version':
                                      return '版本';
                                    case 'privacy':
                                      return '隱私權政策網址';
                                    case 'sub_title':
                                      return '副標題';
                                    case 'title':
                                      return '商店名稱';
                                  }
                                })();
                                if (['promote_string', 'description'].indexOf(dd) !== -1) {
                                  return html`<div class="col-12">
                                    ${EditorElem.editeText({
                                      gvc: gvc,
                                      title: title,
                                      placeHolder: `請輸入${title}`,
                                      default: postMD.market_info[key],
                                      callback: text => {
                                        postMD.market_info[key] = text;
                                      },
                                    })}
                                  </div>`;
                                }
                                return html`<div class="col-12 col-md-6">
                                  ${EditorElem.editeInput({
                                    gvc: gvc,
                                    title: title,
                                    placeHolder: `請輸入${title}`,
                                    default: postMD.market_info[key],
                                    callback: text => {
                                      postMD.market_info[key] = text;
                                    },
                                  })}
                                </div>`;
                              })
                              .join('');
                          })()}
                        </div>`,
                      ].join('<div class="my-2"></div>')
                    ),
                  ].join('<div class="my-3"></div>')}
                </div>`
              );
            });
          },
          divCreate: { class: 'd-flex flex-column flex-column-reverse flex-md-row p-0', style: 'gap: 10px;' },
        };
      })}
      ${BgWidget.mbContainer(240)}
      <div class="update-bar-container">
        ${BgWidget.save(
          gvc.event(() => {
            save();
          }),
          editorData ? `再次送審` : `確認送審`
        )}
      </div>
    `);
  }

  public static checkoutHook(gvc: GVC) {
    const saasConfig: {
      config: any;
      api: any;
    } = (window as any).saasConfig;
    let keyData = {
      value: '',
    };
    return BgWidget.container(html`
      <div class="title-container">
        ${BgWidget.title('結帳事件')}
        <div class="flex-fill"></div>
        ${BgWidget.darkButton(
          '儲存事件設定',
          gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api
              .setPrivateConfig((window.parent as any).appName, `glitter_finance_webhook`, keyData)
              .then((r: { response: any; result: boolean }) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                  dialog.successMessage({ text: '設定成功' });
                } else {
                  dialog.errorMessage({ text: '設定失敗' });
                }
              });
          })
        )}
      </div>
      ${BgWidget.container(
        html` ${BgWidget.alertInfo('當會員完成購物時，所需執行的額外事件', [
          html`<strong>購物車資料</strong>:obj.cartData`,
          html`<strong>用戶資料</strong>:obj.userData`,
          html`<strong>資料庫</strong>:obj.sql`,
          html`<strong>Firebase推播</strong>:obj.fcm`,
        ])}
        ${gvc.bindView(() => {
          const id = gvc.glitter.getUUID();
          return {
            bind: id,
            view: () => {
              return new Promise(async (resolve, reject) => {
                const data = await saasConfig.api.getPrivateConfig(
                  (window.parent as any).appName,
                  `glitter_finance_webhook`
                );
                if (data.response.result[0]) {
                  keyData = data.response.result[0].value;
                }
                resolve(
                  html` <div style="width: 100%;">
                    ${BgWidget.card(
                      [
                        EditorElem.codeEditor({
                          gvc: gvc,
                          height: 600,
                          initial: keyData.value,
                          title: `區段代碼`,
                          callback: text => {
                            keyData.value = text;
                          },
                        }),
                      ].join('<div class="my-2"></div>')
                    )}
                  </div>`
                );
              });
            },
            divCreate: {
              class: 'd-flex flex-column flex-column-reverse flex-md-row p-0',
              style: 'gap: 10px; margin-top: 18px;',
            },
          };
        })}`
      )}
      ${BgWidget.mbContainer(120)}
    `);
  }

  public static seoHook(gvc: GVC) {
    const saasConfig: {
      config: any;
      api: any;
    } = (window.parent as any).saasConfig;
    let keyData = {
      value: '',
    };
    return BgWidget.container(html`
      <div class="title-container">
        ${BgWidget.title('SEO 自定義')}
        <div class="flex-fill"></div>
        ${BgWidget.darkButton(
          '儲存事件設定',
          gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api
              .setPrivateConfig((window.parent as any).appName, `seo_webhook`, keyData)
              .then((r: { response: any; result: boolean }) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                  dialog.successMessage({ text: '設定成功' });
                } else {
                  dialog.errorMessage({ text: '設定失敗' });
                }
              });
          })
        )}
      </div>
      ${BgWidget.container(
        [
          BgWidget.alertInfo('自定義設定 SEO'),
          gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
              bind: id,
              view: () => {
                return new Promise(async (resolve, reject) => {
                  const data = await saasConfig.api.getPrivateConfig((window.parent as any).appName, `seo_webhook`);
                  if (data.response.result[0]) {
                    keyData = data.response.result[0].value;
                  }
                  resolve(
                    html` <div style="width: 100%;">
                      ${BgWidget.card(
                        [
                          EditorElem.codeEditor({
                            gvc: gvc,
                            height: 600,
                            structStart: `((db,req)=>{`,
                            initial: keyData.value,
                            title: `區段代碼`,
                            callback: text => {
                              keyData.value = text;
                            },
                          }),
                        ].join('<div class="my-2"></div>')
                      )}
                    </div>`
                  );
                });
              },
              divCreate: { class: 'd-flex flex-column flex-column-reverse flex-md-row p-0', style: 'gap: 10px;' },
            };
          }),
          BgWidget.mbContainer(120),
        ].join(html`<div style="margin-top: 18px;"></div>`)
      )}
    `);
  }

  public static siteMapHook(gvc: GVC) {
    const saasConfig: {
      config: any;
      api: any;
    } = (window.parent as any).saasConfig;
    let keyData = {
      value: '',
    };
    return BgWidget.container(html`
      <div class="title-container">
        ${BgWidget.title('SiteMap 自定義')}
        <div class="flex-fill"></div>
        ${BgWidget.darkButton(
          '儲存事件設定',
          gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api
              .setPrivateConfig((window.parent as any).appName, `sitemap_webhook`, keyData)
              .then((r: { response: any; result: boolean }) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                  dialog.successMessage({ text: '設定成功' });
                } else {
                  dialog.errorMessage({ text: '設定失敗' });
                }
              });
          })
        )}
      </div>
      ${BgWidget.container(
        [
          BgWidget.alertInfo('自定義設定 SiteMap'),
          gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
              bind: id,
              view: () => {
                return new Promise(async (resolve, reject) => {
                  const data = await saasConfig.api.getPrivateConfig((window.parent as any).appName, `sitemap_webhook`);
                  if (data.response.result[0]) {
                    keyData = data.response.result[0].value;
                  }
                  resolve(
                    html` <div style="width: 100%;">
                      ${BgWidget.card(
                        [
                          EditorElem.codeEditor({
                            gvc: gvc,
                            height: 600,
                            structStart: `((db,req)=>{`,
                            initial: keyData.value,
                            title: `區段代碼`,
                            callback: text => {
                              keyData.value = text;
                            },
                          }),
                        ].join('<div class="my-2"></div>')
                      )}
                    </div>`
                  );
                });
              },
              divCreate: { class: 'd-flex flex-column flex-column-reverse flex-md-row p-0', style: 'gap: 10px;' },
            };
          }),
          BgWidget.mbContainer(120),
        ].join(html`<div style="margin-top: 18px;"></div>`)
      )}
    `);
  }

  public static loginHook(gvc: GVC) {
    const saasConfig: {
      config: any;
      api: any;
    } = (window as any).saasConfig;
    let keyData = {
      value: '',
    };
    return BgWidget.container(html`
      <div class="title-container ">
        ${BgWidget.title(`登入觸發事件`)}
        <div class="flex-fill"></div>
        <button
          class="btn btn-primary-c"
          style="height:38px;font-size: 14px;"
          onclick="${gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api
              .setPrivateConfig(saasConfig.config.appName, `glitter_login_webhook`, keyData)
              .then((r: { response: any; result: boolean }) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                  dialog.successMessage({ text: '設定成功' });
                } else {
                  dialog.errorMessage({ text: '設定失敗' });
                }
              });
          })}"
        >
          儲存事件設定
        </button>
      </div>

      ${BgWidget.alertInfo('當會員登入 / 註冊 / 初始化時，所需執行的額外事件', [
        html`<strong>用戶資料</strong>:obj.userData`,
        html`<strong>Firebase推播</strong>:obj.fcm`,
      ])}
      ${gvc.bindView(() => {
        const id = gvc.glitter.getUUID();
        return {
          bind: id,
          view: () => {
            return new Promise(async (resolve, reject) => {
              const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_login_webhook`);
              if (data.response.result[0]) {
                keyData = data.response.result[0].value;
              }
              resolve(
                html` <div style="width: 100%;">
                  ${BgWidget.card(
                    [
                      EditorElem.codeEditor({
                        gvc: gvc,
                        height: 600,
                        initial: keyData.value,
                        title: `區段代碼`,
                        callback: text => {
                          keyData.value = text;
                        },
                      }),
                    ].join('<div class="my-2"></div>')
                  )}
                </div>`
              );
            });
          },
          divCreate: { class: 'd-flex flex-column flex-column-reverse flex-md-row p-0', style: 'gap: 10px;' },
        };
      })}
    `);
  }
}

(window as any).glitter.setModule(import.meta.url, BgProject);
