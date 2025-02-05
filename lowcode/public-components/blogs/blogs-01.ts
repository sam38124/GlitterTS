import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from '../user-manager/um-class.js';
import { Language } from '../../glitter-base/global/language.js';
import {ApiCart} from "../../glitter-base/route/api-cart.js";

export class Blogs01 {
    static main(gvc: GVC, subData: any) {
        if (subData.content.generator !== 'page_editor') {
            return subData.content.text;
        } else {
            function startRender() {
                // 隱形賣場和一頁商店，預設加入購物車
                if (subData.content.relative_data && ['shopping', 'hidden'].includes(subData.content.page_type) && localStorage.getItem('block-refresh-cart') !== 'true') {
                  const clock=gvc.glitter.ut.clock()
                    const interVal=setInterval(()=>{
                      if(clock.stop()<2000){
                          (new ApiCart(ApiCart.globalCart)).setCart((cart)=>{
                              subData.content.relative_data.map((dd: any) => {
                                  const line_item = cart.line_items.find((d1: any) => {
                                      return `${d1.id}-${d1.spec.join('-')}` === `${dd.product_id}-${dd.variant.spec.join('-')}`;
                                  });
                                  if (!line_item) {
                                      cart.line_items.push({
                                          id: dd.product_id,
                                          spec: dd.variant.spec,
                                          count: 1,
                                      });
                                  }
                              })
                          });
                      }else{
                          clearInterval(interVal)
                      }
                  },300)
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
                    if (localStorage.getItem('password_to_see_' + subData.content.tag) === subData.content.show_auth.value) {
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
                                            dialog.errorMessage({ text: Language.text('no_access_permission') });
                                            gvc.glitter.href = '/index';
                                        }
                                    } catch (e) {
                                        dialog.errorMessage({ text: Language.text('no_access_permission') });
                                        gvc.glitter.href = '/index';
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
    }
}

(window as any).glitter.setModule(import.meta.url, Blogs01);
