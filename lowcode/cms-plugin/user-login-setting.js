var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { BgWidget } from "../backend-manager/bg-widget.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
export class UserLoginSetting {
    static main(gvc) {
        const saasConfig = window.parent.saasConfig;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        let keyData = {
            verify: 'normal',
            name: '',
            content: '',
            title: '',
            verify_forget: 'mail',
            forget_title: '',
            forget_content: '',
            forget_page: '',
            will_come_title: '',
            will_come_content: ''
        };
        function save(next) {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`, keyData).then((r) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                    next();
                }
                else {
                    dialog.errorMessage({ text: "設定失敗" });
                }
            });
        }
        return BgWidget.container(html `
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.title(`登入認證`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
            save(() => {
                dialog.successMessage({
                    text: '設定成功'
                });
            });
        })}">儲存並更改
                </button>
            </div>
            ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`).then((data) => {
                var _a;
                if (data.response.result[0]) {
                    keyData = data.response.result[0].value;
                    keyData.verify_forget = (_a = keyData.verify_forget) !== null && _a !== void 0 ? _a : 'mail';
                    gvc.notifyDataChange(id);
                }
            });
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        resolve(html `
                                <div style="width:900px;max-width:100%;"> ${BgWidget.card([
                            EditorElem.select({
                                title: '登入認證',
                                gvc: gvc,
                                def: keyData.verify,
                                array: [
                                    { title: '無需認證', value: "normal" },
                                    { title: '信箱認證', value: "mail" }
                                ],
                                callback: (text) => {
                                    keyData.verify = text;
                                    gvc.notifyDataChange(id);
                                }
                            }),
                            (() => {
                                var _a, _b;
                                if (keyData.verify === 'mail') {
                                    keyData.content = (_a = keyData.content) !== null && _a !== void 0 ? _a : '';
                                    keyData.title = (_b = keyData.title) !== null && _b !== void 0 ? _b : '嗨！歡迎加入 GLITTER.AI，請輸入驗證碼。';
                                    if (keyData.content.indexOf('@{{code}}') === -1) {
                                        keyData.content = `嗨！歡迎加入 GLITTER.AI，請輸入驗證碼「 @{{code}} 」。請於1分鐘內輸入並完成驗證。`;
                                    }
                                    return [
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '寄件者名稱',
                                            default: keyData.name,
                                            callback: (text) => {
                                                keyData.name = text;
                                                gvc.notifyDataChange(id);
                                            },
                                            placeHolder: '請輸入寄件者名稱'
                                        }),
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '信件標題',
                                            default: keyData.title,
                                            callback: (text) => {
                                                keyData.title = text;
                                                gvc.notifyDataChange(id);
                                            },
                                            placeHolder: '請輸入信件標題'
                                        }),
                                        EditorElem.h3('信件內容'),
                                        EditorElem.richText({
                                            gvc: gvc,
                                            def: keyData.content,
                                            callback: (text) => {
                                                keyData.content = text;
                                            }
                                        })
                                    ].join('');
                                }
                                else {
                                    return ``;
                                }
                            })()
                        ].join('<div class="my-2"></div>'))}
                                    <div class="my-4">${BgWidget.title(`註冊成功信件`)}</div>
                                    ${BgWidget.card([
                            (() => {
                                keyData.will_come_content = keyData.will_come_content || `<table style="height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse">
      <tbody><tr>
        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
          <table class="m_-6935525929279934079header" style="width:100%;border-spacing:0;border-collapse:collapse;margin:40px 0 20px">
  <tbody><tr>
    <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
      <center>

        <table class="m_-6935525929279934079container" style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
          <tbody><tr>
            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

              <table style="width:100%;border-spacing:0;border-collapse:collapse">
                <tbody><tr>
                  <td class="m_-6935525929279934079shop-name__cell" style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                      <h1 style="font-weight:normal;font-size:30px;color:#333;margin:0">
                        <a href="https://glitter-ai.com/?page=index"><span class="il">Glitter</span>.AI</a>
                      </h1>
                  </td>

                </tr>
              </tbody></table>

            </td>
          </tr>
        </tbody></table>

      </center>
    </td>
  </tr>
</tbody></table>

          <table style="width:100%;border-spacing:0;border-collapse:collapse">
  <tbody><tr>
    <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;padding-bottom:40px;border-width:0">
      <center>
        <table class="m_-6935525929279934079container" style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
          <tbody><tr>
            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
              
            <h2 style="font-weight:normal;font-size:24px;margin:0 0 10px">歡迎造訪 <span class="il">Glitter</span>.AI</h2>
            <p style="color:#777;line-height:150%;font-size:16px;margin:0">你已啟用顧客帳號。下次向我們購買商品時可登入以加快結帳程序。</p>
            
              <table style="width:100%;border-spacing:0;border-collapse:collapse;margin-top:20px">
                <tbody><tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                    <table class="m_-6935525929279934079button m_-6935525929279934079main-action-cell" style="border-spacing:0;border-collapse:collapse;float:left;margin-right:15px">
                      <tbody><tr>
                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;border-radius:4px" align="center" bgcolor="#FD6A58"><a href="https://glitter-ai.com/?page=index" class="m_-6935525929279934079button__text" style="font-size:16px;text-decoration:none;display:block;color:#fff;padding:20px 25px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://homee.cc/_t/c/A1030004-178DF593BC260730-3276808C?l%3DAAC31U1HQyLV6yRc418Ol6ZTVtd35pqHBs7MfVIFQDr5cyyO2sIEDkhWHwZOWThosKbnlo0vxspUzXz95nAfGCAefk7ZV5q%252F4OcvJNHMWdazV7L3oV%252FeYRwJeFSZL8IjeY9FoC4%252FftsbMqiOvv3N3fuybzH6h87aaIKXJB3xQLvRDdoUEc%252Bls9WXIWwMVLjXOm2TaM0mO0WY2bk%253D%26c%3DAABphhQuF%252Fv1oMua9CSFTngouEXUusFfuKKA%252B2VsQyoM2b7GLOICMbafbOHbq9R6gAbjuFK%252BvnPtv5UjwCIQGNQ92Tn4ZBbwZKMj8Z3tN3K1GfGK8g4OdJMbcjXvYu33KJPpHD8FHNoIR1E9%252BxLb67yVIoHfOsdRfTFnkGTlPXqCushhfwL9%252BLJjZhI0vabSZ0edxj1olnSwMe32VLib6ljdCUeFYftICVKoS%252FoQwo5BfFKozF64R1mOrnNPoMop1Jxl7XGbxVIJegWLjoR01AgtwLRdehnioWNe%252FQS2efaSSVfSFbKA%252BgjAgwB7EChxgqD1T2Df4aecH%252F5PN7dZ1Ljh9MOxgxAxYNE%253D&amp;source=gmail&amp;ust=1704369669126000&amp;usg=AOvVaw2lf2J55g8YoRh8zhgbNpwz">造訪我們的商店</a></td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            

            </td>
          </tr>
        </tbody></table>
      </center>
    </td>
  </tr>
</tbody></table>
          <table style="width:100%;border-spacing:0;border-collapse:collapse;border-top-width:1px;border-top-color:#e5e5e5;border-top-style:solid">
  <tbody><tr>
    <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;padding:35px 0">
      <center>
        <table class="m_-6935525929279934079container" style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
          <tbody><tr>
            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
              
              <p style="color:#999;line-height:150%;font-size:14px;margin:0">如有任何疑問，請回覆本電子郵件或透過 <a href="mailto:service@ncdesign.info" style="font-size:14px;text-decoration:none;color:#fd6a58" target="_blank">service@<span class="il">ncdesign</span>.info</a> 聯絡我們</p>
            </td>
          </tr>
        </tbody></table>
      </center>
    </td>
  </tr>
</tbody></table>

<img src="https://ci3.googleusercontent.com/meips/ADKq_NbTVurv9Myfyz9PhnR6e2VliLt0CFlSGZQ-llBSyYXgCJk484f6C9PtRc3NQ--UqTVQLrUbxo9QnW7Jeol11m54Ffyk3C_-YGtSYbBtM-pocpNiNcD8mIkv3bNN3eh5HpLh1tiKiOpQakyoPqKg8tioAtjIe3HfGjshqtJap0HP0qao4Rdp96g8T6NDAFRUjXK3PAB6N0Hki6PwEBf3ccdaPkQ3EqMHTw-WD8MjTbiKIoAM=s0-d-e1-ft#https://cdn.shopify.com/shopifycloud/shopify/assets/themes_support/notifications/spacer-1a26dfd5c56b21ac888f9f1610ef81191b571603cb207c6c0f564148473cab3c.png" class="m_-6935525929279934079spacer CToWUd" height="1" style="min-width:600px;height:0" data-bit="iit">

        </td>
      </tr>
    </tbody></table>`;
                                keyData.will_come_title = keyData.will_come_title || '嗨！歡迎加入 Glitter.AI。';
                                return [
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '寄件者名稱',
                                        default: keyData.name,
                                        callback: (text) => {
                                            keyData.name = text;
                                            gvc.notifyDataChange(id);
                                        },
                                        placeHolder: '請輸入寄件者名稱'
                                    }),
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '信件標題',
                                        default: keyData.will_come_title,
                                        callback: (text) => {
                                            keyData.will_come_title = text;
                                            gvc.notifyDataChange(id);
                                        },
                                        placeHolder: '請輸入信件標題'
                                    }),
                                    EditorElem.h3('信件內容'),
                                    EditorElem.richText({
                                        gvc: gvc,
                                        def: keyData.will_come_content,
                                        callback: (text) => {
                                            keyData.will_come_content = text;
                                        }
                                    })
                                ].join('');
                            })()
                        ].join('<div class="my-2"></div>'))}
                                    <div class="my-4">${BgWidget.title(`忘記密碼設定`)}</div>
                                    ${BgWidget.card([
                            EditorElem.select({
                                title: '忘記密碼',
                                gvc: gvc,
                                def: keyData.verify_forget,
                                array: [
                                    { title: '信箱認證', value: "mail" },
                                ],
                                callback: (text) => {
                                    keyData.verify_forget = text;
                                    gvc.notifyDataChange(id);
                                }
                            }),
                            (() => {
                                keyData.forget_title = keyData.forget_title || "忘記密碼";
                                keyData.forget_content = keyData.forget_content || '';
                                if (keyData.forget_content.indexOf('@{{code}}') === -1) {
                                    keyData.forget_content = html `
                                                    <div style="margin:0">
                                                        <table style="height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse">
                                                            <tbody>
                                                            <tr>
                                                                <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                    <table class="m_-7325585852261570963header"
                                                                           style="width:100%;border-spacing:0;border-collapse:collapse;margin:40px 0 20px">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                <center>

                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td class="m_-7325585852261570963shop-name__cell"
                                                                                                            style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <h1 style="font-weight:normal;font-size:30px;color:#333;margin:0">
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
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;padding-bottom:40px;border-width:0">
                                                                                <center>
                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <h2 style="font-weight:normal;font-size:24px;margin:0 0 10px">
                                                                                                    重設密碼</h2>
                                                                                                <p style="color:#777;line-height:150%;font-size:16px;margin:0">
                                                                                                    利用此連結前往 <a
                                                                                                >GLITTER.AI</a>
                                                                                                    重設你的顧客帳號密碼。如果你沒有申請新密碼，
                                                                                                    <wbr>
                                                                                                    可以安心刪除這封電子郵件。
                                                                                                </p>
                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse;margin-top:20px">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;line-height:0em">
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <table class="m_-7325585852261570963button m_-7325585852261570963main-action-cell"
                                                                                                                   style="border-spacing:0;border-collapse:collapse;float:left;margin-right:15px">
                                                                                                                <tbody>
                                                                                                                <tr>
                                                                                                                    <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;border-radius:4px"
                                                                                                                        align="center"
                                                                                                                        bgcolor="black">
                                                                                                                        <a href="@{{code}}"
                                                                                                                           class="m_-7325585852261570963button__text"
                                                                                                                           style="font-size:16px;text-decoration:none;display:block;color:#fff;padding:20px 25px">重設密碼</a>
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
                                                        <div class="adL">
                                                        </div>
                                                    </div>`;
                                }
                                return [
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '信件標題',
                                        default: keyData.forget_title,
                                        callback: (text) => {
                                            keyData.forget_title = text;
                                            gvc.notifyDataChange(id);
                                        },
                                        placeHolder: '請輸入信件標題'
                                    }),
                                    EditorElem.pageSelect(gvc, '重設密碼頁面', keyData.forget_page, (data) => {
                                        keyData.forget_page = data;
                                    }),
                                    EditorElem.h3('信件內容'),
                                    EditorElem.richText({
                                        gvc: gvc,
                                        def: keyData.forget_content,
                                        callback: (text) => {
                                            keyData.forget_content = text;
                                        }
                                    })
                                ].join('');
                            })()
                        ].join('<div class="my-2"></div>'))}
                                </div>`);
                    }));
                },
                divCreate: { class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;` }
            };
        })}
        `, 900);
    }
}
window.glitter.setModule(import.meta.url, UserLoginSetting);
