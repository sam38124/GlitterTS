import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from '../user-manager/um-class.js';
import { Language } from '../../glitter-base/global/language.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Article } from '../../glitter-base/route/article.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { ApiPageConfig } from '../../api/pageConfig.js';
import { ApiUser } from '../../glitter-base/route/user.js';

const html = String.raw;

export class Blogs01 {
  static main(gvc: GVC, subData: any) {

    let initial = false;
    return gvc.bindView(() => {
      const bid = gvc.glitter.getUUID();
      return {
        bind: bid,
        view: () => {
          return ``;
        },
        divCreate: {
          class: `${bid}`,
        },
        onCreate: async () => {
          if (!initial) {
            try {
              initial = true;

              const [o_header,o_footer] = await Promise.all([
                new Promise<any>((resolve, reject)=>{
                  (window as any).glitterInitialHelper.getPageData('c_header',(res:any)=>{
                    resolve(res)
                  })
                }),
                new Promise<any>((resolve, reject)=>{
                  (window as any).glitterInitialHelper.getPageData('footer',(res:any)=>{
                    resolve(res)
                  })
                })
              ]);
              //取得HeaderView
              let ogHeaderView = new gvc.glitter.htmlGenerate(o_header.response.result[0].config, [], {}).render(
                gvc,
                {
                  class: `w-100`,
                  style: `position:relative;`,
                  containerID: gvc.glitter.getUUID(),
                  tag: gvc.glitter.getUUID(),
                  jsFinish: () => {},
                  onCreate: () => {},
                  document: document,
                },
                {}
              );
              //取得FooterView
              let footerView = new gvc.glitter.htmlGenerate(o_footer.response.result[0].config, [], {}).render(
                gvc,
                {
                  class: `w-100`,
                  style: `position:relative;`,
                  containerID: gvc.glitter.getUUID(),
                  tag: gvc.glitter.getUUID(),
                  jsFinish: () => {},
                  onCreate: () => {},
                  document: document,
                },
                {}
              );

              console.log(`o_header===>`,o_header)
              console.log(`subData===>`,subData)
              subData.content.config=subData.content.config??[]
              try {
                subData.content.config=subData.content.config.filter((dd:any)=>   {
                  return dd.data.tag!=='c_header' && dd.data.tag!=='footer'
                })
                //pages的自訂View
                const view = (() => {
                  if (subData.content.generator !== 'page_editor') {
                    const dd = subData.content;
                    return html` <div
                      class="container mx-auto fr-view mb-5"
                      style="max-width: 1100px;font-family: 'Source Sans Pro', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif;"
                    >
                      <h1
                        class="my-5 w-100 text-center p-0"
                        style="color:${subData.content.title};font-size:${document.body.clientWidth > 800
                      ? `32px`
                      : `24px`};font-weight: 600;"
                      >
                        ${(dd.language_data && dd.language_data[Language.getLanguage()].title) || dd.title}
                      </h1>
                      ${(dd.language_data && dd.language_data[Language.getLanguage()].text) || dd.text}
                    </div>`;
                  } else {
                    function startRender() {
                      // 隱形賣場和一頁商店，預設加入購物車
                      if (
                        subData.content.relative_data &&
                        ['shopping', 'hidden'].includes(subData.content.page_type) &&
                        localStorage.getItem('block-refresh-cart') !== 'true'
                      ) {
                        const clock = gvc.glitter.ut.clock();
                        const interVal = setInterval(() => {
                          if (clock.stop() < 2000) {
                            new ApiCart(ApiCart.globalCart).setCart(cart => {
                              subData.content.relative_data.map((dd: any) => {
                                const line_item = cart.line_items.find((d1: any) => {
                                  return (
                                    `${d1.id}-${d1.spec.join('-')}` === `${dd.product_id}-${dd.variant.spec.join('-')}`
                                  );
                                });
                                if (!line_item) {
                                  cart.line_items.push({
                                    id: dd.product_id,
                                    spec: dd.variant.spec,
                                    count: 1,
                                  });
                                }
                              });
                            });
                          } else {
                            gvc.notifyDataChange(['js-cart-count']);
                            gvc.glitter.share.reloadCartData && gvc.glitter.share.reloadCartData();
                            if (document.querySelector('.customer-message')) {
                              document.querySelector('.customer-message')!.remove();
                            }
                            clearInterval(interVal);
                          }
                        }, 300);
                      } else {
                        localStorage.setItem('block-refresh-cart', 'false');
                      }
                      return new gvc.glitter.htmlGenerate(subData.content.config, [], subData.content).render(
                        gvc,
                        {
                          class: `w-100`,
                          style: `position:relative;`,
                          containerID: gvc.glitter.getUUID(),
                          tag: gvc.glitter.getUUID(),
                          jsFinish: () => {},
                          onCreate: () => {},
                          document: document,
                        },
                        {}
                      );
                    }

                    // 判斷是隱形賣場決定是否可見
                    if (subData.content.page_type === 'hidden') {
                      if (subData.content.show_auth.auth === 'all') {
                        return startRender();
                      } else if (subData.content.show_auth.auth === 'password') {
                        if (
                          localStorage.getItem('password_to_see_' + subData.content.tag) ===
                          subData.content.show_auth.value
                        ) {
                          return startRender();
                        }
                        return gvc.bindView(() => {
                          const rid = gvc.glitter.getUUID();
                          return {
                            bind: rid,
                            view: () => {
                              return ``;
                            },
                            divCreate: {
                              option: [{ key: 'id', value: rid }],
                            },
                            onCreate: () => {
                              function checkPwd() {
                                const pwd = window.prompt(Language.text('enter_website_password'), '');
                                localStorage.setItem('password_to_see_' + subData.content.tag, pwd ?? '');
                                if (subData.content.show_auth.value === pwd) {
                                  document.querySelector(`#${rid}`)!.outerHTML = startRender();
                                } else {
                                  const dialog = new ShareDialog(gvc.glitter);
                                  dialog.checkYesOrNot({
                                    text: Language.text('incorrect_website_password'),
                                    callback: () => {
                                      gvc.glitter.closeDiaLog();
                                      checkPwd();
                                    },
                                  });
                                }
                              }

                              checkPwd();
                            },
                          };
                        });
                      } else if (subData.content.show_auth.auth === 'member_type') {
                        return gvc.bindView(() => {
                          const rid = gvc.glitter.getUUID();
                          return {
                            bind: rid,
                            view: () => {
                              return ``;
                            },
                            divCreate: {
                              option: [{ key: 'id', value: rid }],
                            },
                            onCreate: () => {
                              const dialog = new ShareDialog(gvc.glitter);
                              UmClass.getUserData(gvc).then((resp: any) => {
                                try {
                                  const mem = resp.member.find((d: any) => {
                                    return d.trigger;
                                  });
                                  if (subData.content.show_auth.value.includes(mem.id)) {
                                    document.querySelector(`#${rid}`)!.outerHTML = startRender();
                                  } else {
                                    if (GlobalUser.token) {
                                      dialog.errorMessage({ text: Language.text('no_access_permission') });
                                      gvc.glitter.href = '/index';
                                    } else {
                                      GlobalUser.loginRedirect = location.href;
                                      gvc.glitter.href = '/login';
                                    }
                                  }
                                } catch (e) {
                                  if (GlobalUser.token) {
                                    dialog.errorMessage({ text: Language.text('no_access_permission') });
                                    gvc.glitter.href = '/index';
                                  } else {
                                    GlobalUser.loginRedirect = location.href;
                                    gvc.glitter.href = '/login';
                                  }
                                }
                              });
                            },
                          };
                        });
                      } else {
                        return startRender();
                      }
                    } else {
                      return startRender();
                    }
                  }
                })();
                // //判斷有自訂Header調整自訂選單內容
                // if (c_header.response.value && c_header.response.value[0] && c_header.response.value[0].header_refer!=='def') {
                //   ogHeaderView=new gvc.glitter.htmlGenerate([c_header.response.value[0]], [], {}).render(
                //     gvc,
                //     {
                //       class: `w-100`,
                //       style: `position:relative;`,
                //       containerID: gvc.glitter.getUUID(),
                //       tag: gvc.glitter.getUUID(),
                //       jsFinish: () => {},
                //       onCreate: () => {},
                //       document: document,
                //     },
                //     {}
                //   )
                // }
                document.querySelector(`.${bid}`)!.outerHTML = [
                  ogHeaderView,
                  view,
                  footerView
                ].join('');
              }catch (e) {

              }
                initial = true;
            } catch (e) {
              console.log(e)
            }
          }
        },
      };
    });
  }

  static async getMain(gvc: GVC) {
    const page = gvc.glitter.getUrlParameter('page');
    return new Promise<string>((resolve, reject) => {
      Article.get({
        limit: 15,
        page: 0,
        tag: page.substring(page.indexOf('/') + 1, page.length),
      }).then(res => {
        if (!res.response.data[0]) {
          gvc.glitter.href = '/index';
        } else {
          resolve(Blogs01.main(gvc, res.response.data[0]));
        }
      });
    });
  }
}

(window as any).glitter.setModule(import.meta.url, Blogs01);
