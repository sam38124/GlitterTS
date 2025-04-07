import { GVC } from '../glitterBundle/GVController.js';
import { Language } from '../glitter-base/global/language.js';
import { UmClass } from '../public-components/user-manager/um-class.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';

const html = String.raw;

export class AccountInfo {
  public static main(gvc: GVC) {
    const glitter = gvc.glitter;
    const g_css = {
      title: glitter.share.globalValue['theme_color.0.title'],
    };
    UmClass.addStyle(gvc);
    return [
      gvc.bindView(() => {
        const id = gvc.glitter.getUUID();
        return {
          bind: id,
          view: async () => {
            if (!gvc.glitter.share.rebateConfig) {
              gvc.glitter.share.rebateConfig = await UmClass.getRebateInfo();
            }

            return html` <div
              class="breadcrumb mb-0 d-flex align-items-center pt-4 pb-5 d-none d-lg-flex"
              style="cursor:pointer; gap:10px;"
            >
              <li
                class="breadcrumb-item "
                style="margin-top: 0px;color:#292218;"
                onclick="${gvc.event(() => {
              gvc.glitter.href = '/index';
            })}"
              >
                ${Language.text('home_page')}
              </li>
              <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
              <li class="breadcrumb-item " style="margin-top: 0px;color:#292218;">
                ${Language.text('account_user_info')}
              </li>
            </div>
            <div
              class="d-flex flex-column-reverse flex-lg-row "
              style="gap:${document.body.clientWidth > 800 ? 76 : 18}px;"
            >
              ${(() => {
              if (
                ['account_edit', 'account_edit', 'order_list', 'voucher-list', 'rebate', 'wishlist'].includes(
                  gvc.glitter.getUrlParameter('page')
                ) &&
                document.body.clientWidth < 800
              ) {
                return ``;
              } else {
                return html` <div
                    class="d-flex flex-column  align-items-start ${document.body.clientWidth > 800
                  ? ``
                  : `border rounded-3 w-100 py-2 px-3`}"
                    style="min-width:190px;width:190px;gap:4px;"
                  >
                    ${[
                  {
                    title: Language.text('account_user_info'),
                    event: gvc.event(() => {
                      gvc.glitter.href = '/account_userinfo';
                    }),
                  },
                  {
                    title: Language.text('member_info'),
                    event: gvc.event(() => {
                      gvc.glitter.href = '/account_edit';
                    }),
                  },
                  {
                    title: Language.text('order_history'),
                    event: gvc.event(() => {
                      gvc.glitter.href = '/order_list';
                    }),
                  },
                  {
                    title: `${Language.text('my')}${glitter.share.rebateConfig.title || Language.text('shopping_credit')}`,
                    event: gvc.event(() => {
                      gvc.glitter.href = '/rebate';
                    }),
                  },
                  {
                    title: Language.text('my_coupons'),
                    event: gvc.event(() => {
                      gvc.glitter.href = '/voucher-list';
                    }),
                  },
                  {
                    title: Language.text('wishlist'),
                    event: gvc.event(() => {
                      gvc.glitter.href = '/wishlist';
                    }),
                  },
                  {
                    title: Language.text('reset_password'),
                    event: gvc.event(async () => {
                      const dialog = new ShareDialog(gvc.glitter);
                      dialog.dataLoading({ visible: true });
                      const userData: any = await UmClass.getUserData(gvc);
                      dialog.dataLoading({ visible: false });
                      UmClass.dialog({
                        gvc: gvc,
                        title: Language.text('reset_password_event'),
                        tag: '',
                        innerHTML: (gvc: GVC) => {
                          let update_vm = {
                            verify_code: '',
                            pwd: '',
                          };
                          let get_verify_timer = 0;
                          let repeat_pwd = '';
                          return [
                            html` <div class="tx_normal fw-normal mb-1">${Language.text('password')}</div>`,
                            html`<input
                                  class="bgw-input"
                                  type="password"
                                  placeholder="${Language.text('please_enter_password')}"
                                  oninput="${gvc.event(e => {
                              update_vm.pwd = e.value;
                            })}"
                                  value="${update_vm.pwd}"
                                />`,
                            html` <div class="tx_normal fw-normal mt-2 mb-1">
                                  ${Language.text('confirm_password')}
                                </div>`,
                            html`<input
                                  class="bgw-input mb-2"
                                  type="password"
                                  placeholder="${Language.text('please_enter_password_again')}"
                                  oninput="${gvc.event(e => {
                              repeat_pwd = e.value;
                            })}"
                                  value="${repeat_pwd}"
                                />`,
                            gvc.bindView(() => {
                              const id = gvc.glitter.getUUID();
                              return {
                                bind: id,
                                view: () => {
                                  return html`${Language.text('reset_password_verification_code')}
                                      ${UmClass.style_components.blueNote(
                                    get_verify_timer
                                      ? `${Language.text('verification_code_sent_to')}『${userData.userData.email}』`
                                      : Language.text('get_verification_code'),
                                    gvc.event(() => {
                                      if (!get_verify_timer) {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.dataLoading({ visible: true });
                                        ApiUser.emailVerify(userData.userData.email, (window as any).appName).then(
                                          async r => {
                                            dialog.dataLoading({ visible: false });
                                            get_verify_timer = 60;
                                            gvc.notifyDataChange(id);
                                          }
                                        );
                                      }
                                    })
                                  )}`;
                                },
                                divCreate: {
                                  class: `d-flex flex-column`,
                                  style: `gap:3px;`,
                                },
                                onCreate: () => {
                                  if (get_verify_timer > 0) {
                                    get_verify_timer--;
                                    setTimeout(() => {
                                      gvc.notifyDataChange(id);
                                    }, 1000);
                                  }
                                },
                              };
                            }),
                            html`<input
                                  class="bgw-input mt-2 mb-4"
                                  type="text"
                                  placeholder="${Language.text('please_enter_verification_code')}"
                                  oninput="${gvc.event((e, event) => {
                              update_vm.verify_code = e.value;
                            })}"
                                  value="${update_vm.verify_code}"
                                />`,
                            html` <div class="d-flex align-items-center justify-content-end pt-2 border-top mx-n3">
                                  <div
                                    class="um-nav-btn um-nav-btn-active d-flex align-items-center justify-content-center"
                                    style="cursor:pointer;"
                                    type="button"
                                    onclick="${gvc.event(() => {
                              if (update_vm.pwd.length < 8) {
                                dialog.errorMessage({ text: Language.text('password_min_length') });
                                return;
                              }
                              if (repeat_pwd !== update_vm.pwd) {
                                dialog.errorMessage({ text: Language.text('please_confirm_password_again') });
                                return;
                              }
                              dialog.dataLoading({ visible: true });
                              ApiUser.updateUserData({
                                userData: update_vm,
                              }).then(res => {
                                dialog.dataLoading({ visible: false });
                                if (!res.result && res.response.data.msg === 'email-verify-false') {
                                  dialog.errorMessage({
                                    text: Language.text('email_verification_code_incorrect'),
                                  });
                                } else if (!res.result && res.response.data.msg === 'phone-verify-false') {
                                  dialog.errorMessage({
                                    text: Language.text('sms_verification_code_incorrect'),
                                  });
                                } else if (!res.result && res.response.data.msg === 'phone-exists') {
                                  dialog.errorMessage({ text: Language.text('phone_number_already_exists') });
                                } else if (!res.result && res.response.data.msg === 'email-exists') {
                                  dialog.errorMessage({ text: Language.text('email_already_exists') });
                                } else if (!res.result) {
                                  dialog.errorMessage({ text: Language.text('update_exception') });
                                } else {
                                  dialog.successMessage({ text: Language.text('change_success') });
                                  gvc.closeDialog();
                                }
                              });
                            })}"
                                  >
                                    <span class="tx_700_white">${Language.text('confirm_reset')}</span>
                                  </div>
                                </div>`,
                          ].join('');
                        },
                      });
                    }),
                  },
                  {
                    title: Language.text('delete_account'),
                    event: gvc.event(async () => {
                      const dialog = new ShareDialog(gvc.glitter);
                      dialog.checkYesOrNot({
                        text: Language.text('delete_account_c'),
                        callback: response => {
                          if (response) {
                            dialog.successMessage({ text: Language.text('request_submit') });
                          }
                        },
                      });
                    }),
                  },
                  {
                    title: Language.text('logout'),
                    event: gvc.event(() => {
                      const dialog = new ShareDialog(gvc.glitter);
                      dialog.checkYesOrNot({
                        text: Language.text('check_logout'),
                        callback: response => {
                          if (response) {
                            GlobalUser.token = '';
                            gvc.glitter.href = '/index';
                          }
                        },
                      });
                    }),
                  },
                ]
                  .map(dd => {
                    return `<div class="d-flex align-items-center w-100" style="
cursor:pointer;
height: 30px;
font-size: 16px;
font-style: normal;
font-weight: 400;
color:${g_css.title};" onclick="${dd.event}">${dd.title}</div>`;
                  })
                  .join(`${document.body.clientWidth > 800 ? `` : `<div class="w-100 border-top my-1"></div>`}`)}
                  </div>`;
              }
            })()}
              ${gvc.bindView(() => {
              return {
                bind: gvc.glitter.getUUID(),
                view: () => {
                  return new Promise((resolve, reject) => {
                    switch (gvc.glitter.getUrlParameter('page')) {
                      case 'rebate':
                        gvc.glitter.getModule(
                          gvc.glitter.root_path + `public-components/user-manager/um-rebate.js`,
                          res => {
                            resolve(res.main(gvc, {}, {}));
                          }
                        );
                        break;
                      case 'account_userinfo':
                        gvc.glitter.getModule(
                          gvc.glitter.root_path + `public-components/user-manager/um-info.js`,
                          res => {
                            resolve(res.main(gvc, {}, {}));
                          }
                        );
                        break;
                      case 'account_edit':
                        gvc.glitter.getModule(
                          gvc.glitter.root_path + `public-components/user-manager/um-info.js`,
                          res => {
                            resolve(res.edit(gvc, {}, {}));
                          }
                        );
                        break;
                      case 'order_list':
                        gvc.glitter.getModule(
                          gvc.glitter.root_path + `public-components/user-manager/um-orderlist.js`,
                          res => {
                            resolve(res.main(gvc, {}, {}));
                          }
                        );
                        break;
                      case 'wishlist':
                        gvc.glitter.getModule(
                          gvc.glitter.root_path + `public-components/user-manager/um-wishlist.js`,
                          res => {
                            resolve(res.main(gvc, {}, {}));
                          }
                        );
                        break;
                      case 'voucher-list':
                        gvc.glitter.getModule(
                          gvc.glitter.root_path + `public-components/user-manager/um-voucher.js`,
                          res => {
                            resolve(res.main(gvc, {}, {}));
                          }
                        );
                        break;
                    }
                  });
                },
                divCreate: {
                  class: `flex-fill`,
                },
              };
            })}
             
            </div>`;
          },
          divCreate: {
            class: `mx-auto px-3 px-lg-0 pb-5`,
            style: `width:1180px;max-width:100%;min-height:calc(100vh - 100px);`,
          },
        };
      }),
      ` <div style="height:${glitter.share.bottom_inset || 0}px;"></div>`
    ];
  }
}

(window as any).glitter.setModule(import.meta.url, AccountInfo);
