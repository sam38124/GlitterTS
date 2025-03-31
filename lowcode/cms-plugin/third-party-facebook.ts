import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiFbService } from '../glitter-base/route/fb-service.js';

export class ThirdPartyLine {
  public static main(gvc: GVC) {
    return (
      BgWidget.container(
        gvc.bindView(() => {
          const id = gvc.glitter.getUUID();
          const key = 'login_fb_setting';
          const vm: {
            loading: boolean;
            data: {
              facebook_toggle: boolean;
              message_toggle: boolean;
              id: string;
              secret: string;
              pixel: string;
              api_token: string;
              secret_message: string;
              id_message: string;
              fans_id: string;
              fans_token: string;
            };
          } = {
            loading: true,
            data: {
              message_toggle: false,
              facebook_toggle: false,
              id: '',
              secret: '',
              pixel: '',
              api_token: '',
              secret_message: '',
              id_message: '',
              fans_id: '',
              fans_token: '',
            },
          };

          ApiUser.getPublicConfig(key, 'manager').then(dd => {
            vm.loading = false;
            dd.response.value && (vm.data = dd.response.value);
            console.log('vm.data -- ', vm.data);
            gvc.notifyDataChange(id);
          });

          return {
            bind: id,
            view: () => {
              const html = String.raw;
              if (vm.loading) {
                return BgWidget.spinner();
              }
              return [
                html` <div class="title-container">
                  ${BgWidget.title('臉書串接設定')}
                  <div class="flex-fill"></div>
                </div>`,
                BgWidget.mbContainer(18),
                BgWidget.container1x2(
                  {
                    html: [
                      BgWidget.mainCard(
                        [
                          html` <div class="tx_700">臉書登入設定</div>`,
                          html` <div class="d-flex align-items-center" style="gap:10px;">
                            啟用臉書登入${BgWidget.switchButton(gvc, vm.data.facebook_toggle, () => {
                              vm.data.facebook_toggle = !vm.data.facebook_toggle;
                              gvc.notifyDataChange(id);
                            })}
                          </div>`,
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: html` <div class="d-flex align-items-center" style="gap:10px;">應用程式編號</div>`,
                            default: vm.data.id,
                            placeHolder: '請前往META開發者後台取得應用程式編號',
                            callback: text => {
                              vm.data.id = text;
                            },
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: html` <div class="d-flex align-items-center" style="gap:10px;">應用程式密鑰</div>`,
                            default: vm.data.secret,
                            placeHolder: '請前往META開發者後台取得應用程式密鑰',
                            callback: text => {
                              vm.data.secret = text;
                            },
                          }),
                          html` <div
                            onclick="${gvc.event(() => {
                              const dialog = new ShareDialog(gvc.glitter);
                              navigator.clipboard.writeText(
                                `https://` + (window.parent as any).glitter.share.editorViewModel.domain
                              );
                              dialog.successMessage({ text: '已複製至剪貼簿' });
                            })}"
                          >
                            ${BgWidget.editeInput({
                              readonly: true,
                              gvc: gvc,
                              title: html` <div class="d-flex flex-column" style="gap:5px;">
                                允許網域 ${BgWidget.grayNote('點擊複製此連結至FACEBOOK開發者後台的Javascript允許網域')}
                              </div>`,
                              default: `https://` + (window.parent as any).glitter.share.editorViewModel.domain,
                              placeHolder: '',
                              callback: text => {},
                            })}
                          </div>`,
                          html` <div
                            onclick="${gvc.event(() => {
                              const dialog = new ShareDialog(gvc.glitter);
                              navigator.clipboard.writeText(
                                `https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/login'
                              );
                              dialog.successMessage({ text: '已複製至剪貼簿' });
                            })}"
                          >
                            ${BgWidget.editeInput({
                              readonly: true,
                              gvc: gvc,
                              title: html` <div class="d-flex flex-column" style="gap:5px;">
                                重新導向URI『 登入頁 』
                                ${BgWidget.grayNote('點擊複製此連結至FACEBOOK開發者後台的OAuth重新導向URI')}
                              </div>`,
                              default:
                                `https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/login',
                              placeHolder: '',
                              callback: text => {},
                            })}
                          </div>`,
                          html` <div
                            onclick="${gvc.event(() => {
                              const dialog = new ShareDialog(gvc.glitter);
                              navigator.clipboard.writeText(
                                `https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/register'
                              );
                              dialog.successMessage({ text: '已複製至剪貼簿' });
                            })}"
                          >
                            ${BgWidget.editeInput({
                              readonly: true,
                              gvc: gvc,
                              title: html` <div class="d-flex flex-column" style="gap:5px;">
                                重新導向URI『 註冊頁 』
                                ${BgWidget.grayNote('點擊複製此連結至FACEBOOK開發者後台的OAuth重新導向URI')}
                              </div>`,
                              default:
                                `https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/register',
                              placeHolder: '',
                              callback: text => {},
                            })}
                          </div>`,
                        ].join(BgWidget.mbContainer(12))
                      ),
                      BgWidget.mainCard(
                        [
                          html` <div class="tx_700">臉書訊息綁定</div>`,
                          html` <div class="d-flex align-items-center" style="gap:10px;">
                            啟用臉書訊息綁定${BgWidget.switchButton(gvc, vm.data.message_toggle, () => {
                              vm.data.message_toggle = !vm.data.message_toggle;
                              gvc.notifyDataChange(id);
                            })}
                          </div>`,

                          BgWidget.editeInput({
                            gvc: gvc,
                            title: html` <div class="d-flex align-items-center" style="gap:10px;">粉絲團ID</div>`,
                            default: vm.data.fans_id,
                            placeHolder: '請輸入粉絲團ID',
                            callback: text => {
                              vm.data.fans_id = text;
                            },
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: html` <div class="d-flex align-items-center" style="gap:10px;">粉絲團TOKEN</div>`,
                            default: vm.data.fans_token,
                            placeHolder: '請輸入粉絲團TOKEN',
                            callback: text => {
                              vm.data.fans_token = text;
                            },
                          }),
                          html` <div
                            onclick="${gvc.event(() => {
                              const dialog = new ShareDialog(gvc.glitter);
                              navigator.clipboard.writeText(
                                `${(window.parent as any).config.url}/api-public/v1/fb_message/listenMessage?g-app=${(window.parent as any).appName}`
                              );
                              dialog.successMessage({ text: '已複製至剪貼簿' });
                            })}"
                          >
                            ${BgWidget.editeInput({
                              readonly: true,
                              gvc: gvc,
                              title: html` <div class="d-flex flex-column" style="gap:5px;">
                                Webhook URL
                                ${BgWidget.grayNote(
                                  '點擊複製此連結至FB開發者後台的Messaging API 中的設定 Webhooks -> 編輯 -> 回呼網址，並將"my_secret_token"填入驗證權杖欄位中'
                                )}
                              </div>`,
                              default: `${(window.parent as any).config.url}/api-public/v1/fb_message/listenMessage?g-app=${(window.parent as any).appName}`,
                              placeHolder: '',
                              callback: text => {},
                            })}
                          </div>`,
                        ].join(BgWidget.mbContainer(12))
                      ),
                      BgWidget.mainCard(
                        [
                          html` <div class="tx_700">臉書像素(Pixel)</div>`,
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: `透過臉書像素來追蹤你的廣告成效`,
                            default: vm.data.pixel,
                            placeHolder: '請前往META開發者後台取得像素編號',
                            callback: text => {
                              vm.data.pixel = text;
                            },
                          }),
                          BgWidget.editeInput({
                            gvc: gvc,
                            title: `轉換API token`,
                            default: vm.data.api_token,
                            placeHolder: '請前往META開發者後台取得轉換 API token',
                            callback: text => {
                              vm.data.api_token = text;
                            },
                          }),
                        ].join(BgWidget.mbContainer(12))
                      ),
                    ].join(BgWidget.mbContainer(24)),
                    ratio: 70,
                  },
                  {
                    // 摘要預覽
                    html: [
                      BgWidget.summaryCard(
                        [
                          html` <div class="tx_700">操作說明</div>`,
                          html` <div class="tx_normal">設定FACEBOOK串接，實現臉書登入、訊息同步，與用戶行為追蹤</div>`,
                          html` <div class="tx_normal">
                            前往
                            ${BgWidget.blueNote(
                              `『 教學步驟 』`,
                              gvc.event(() => {
                                (window.parent as any).glitter.openNewTab('https://shopnex.tw/blogs/fbapiconnect');
                              })
                            )}
                            查看串接設定流程
                          </div>`,
                        ].join(BgWidget.mbContainer(12))
                      ),
                      BgWidget.summaryCard(
                        html`
                          <h2 style="font-size: 1.5rem; margin-bottom: 10px; color: #333;">Facebook 授權</h2>
                          <p style="font-size: 1rem; color: #666; margin-bottom: 20px;">
                            我們需要您授權 Facebook 資訊，以便進一步提供服務。點擊下方按鈕完成授權：
                          </p>
                          <div class="cursor_pointer"
                            href="https://www.facebook.com/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=YOUR_PERMISSIONS"
                            onclick="${gvc.event(()=>{
                              const url = window.parent.location.href;
                              console.log("url -- " , url);
                              localStorage.setItem('fb_url', url);
                              localStorage.setItem('gapp', (window.parent as any).appName);
                              //todo 
                              const authUrl = `${(window.parent as any).config.url}/shopnex/shopnex-fb-oauth`
                              const trans = `https://www.facebook.com/dialog/oauth?client_id=556137570735606&redirect_uri=${authUrl}&scope=pages_messaging%2Cpages_read_engagement%2Cpages_manage_metadata%2Cpages_read_user_content%2Cpages_show_list&state=test`
                              window.parent.location.href = trans;
                            })}"
                            style="display: inline-block; background-color: #1877f2; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; font-size: 1rem;"
                          >
                            點擊完成授權
                          </div>
                        `
                      )
                    ].join(BgWidget.mbContainer(24)),
                    ratio: 30,
                  }
                ),
                html` <div class="update-bar-container">
                  ${BgWidget.save(
                    gvc.event(async () => {
                      const dialog = new ShareDialog(gvc.glitter);
                      dialog.dataLoading({ visible: true });
                      const cf = (await ApiUser.getPublicConfig('login_config', 'manager')).response.value || {};
                      cf.fb = vm.data.facebook_toggle;
                      await ApiUser.setPublicConfig({
                        key: 'login_config',
                        value: cf,
                        user_id: 'manager',
                      });
                      ApiUser.setPublicConfig({
                        key: key,
                        value: vm.data,
                        user_id: 'manager',
                      }).then(() => {
                        dialog.dataLoading({ visible: false });
                        dialog.successMessage({ text: '設定成功' });
                        gvc.closeDialog();
                      });
                    })
                  )}
                </div>`,
              ].join('');
            },
          };
        })
      ) + BgWidget.mbContainer(120)
    );
  }
  public static drawFacebookAuthRedirect(gvc: GVC) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);
    const html = String.raw;

    // const url = localStorage.getItem('fb_url');
    // 使用 URL 物件解析整個 href
    const url = new URL(location.href);

// 獲取 hash 的部分，移除 # 之前的符號
    const hash = url.hash.slice(4); // 移除掉最前面的 '#'
// 進一步用 URLSearchParams 處理 hash 部分
    const params = new URLSearchParams(hash);

// 獲取 "code" 的值
    const code = params.get('code');


    ApiFbService.getOauth(code).then(r => {
      console.log("r -- " , r);
      console.log("url -- " , localStorage.getItem('fb_url'));
      //todo 認證錯誤的畫面
      if (r.result){
        location.href = localStorage.getItem('fb_url')??"";
      }

    })

    gvc.addStyle(`
    .container2 {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            background: #ffffff;
        }
        h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333333;
        }
        p {
            font-size: 1rem;
            color: #666666;
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `)

    return html`
      <div class="container2" style="margin: 80px auto;">
        <h1>認證完成</h1>
        <p class="redirect-message">請稍待片刻，系統將為您跳轉...</p>
      </div>
    `

  }
}

(window as any).glitter.setModule(import.meta.url, ThirdPartyLine);
