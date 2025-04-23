var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UmClass } from './um-class.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';
import { Tool } from '../../modules/tool.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { FormCheck } from "../../cms-plugin/module/form-check.js";
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
const css = String.raw;
export class UMLogin {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const vm = {
            account: '',
            password: '',
            loginConfig: {},
            registerConfig: [],
            viewType: '',
            resetEmail: '',
            validationCode: '',
            prefix: Tool.randomString(5),
        };
        UmClass.addStyle(gvc);
        this.addStyle(gvc, vm.prefix);
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        const gClass = (name) => `${vm.prefix}-${name}`;
        return gvc.bindView({
            bind: ids.view,
            dataList: [{ obj: vm, key: 'viewType' }],
            view: () => {
                try {
                    if (loadings.view) {
                        return UmClass.spinner();
                    }
                    if (vm.viewType === 'send_forget_pwd_email') {
                        return html `<section class="${gClass('container')}">
              <div class="${gClass('box')}">
                <div class="${gClass('login-title')}">${Language.text('forgot_password')}</div>
                <div class="w-100 d-flex flex-column gap-3">
                  <div>
                    <label class="${gClass('label')}">${Language.text('email')}</label>
                    <input class="bgw-input" type="text" id="vm-email" placeholder="${Language.text('email_placeholder')}" />
                  </div>
                  <div
                    class="${gClass('button')} my-2"
                    onclick="${gvc.event(() => {
                            this.sendResetEmail(widget, vm);
                        })}"
                  >
                    <span class="${gClass('button-text')}">${Language.text('get_verification_code')}</span>
                  </div>
                </div>
                ${this.backToLogin(gvc, vm)}
              </div>
            </section>`;
                    }
                    if (vm.viewType === 'validation_code') {
                        return html `<section class="${gClass('container')}">
              <div class="${gClass('box')}">
                <div class="${gClass('login-title')}">${Language.text('enter_verification_code')}</div>
                <div class="w-100 d-flex flex-column gap-3">
                  <div>
                    <label class="${gClass('label')}">${Language.text('verification_code')}</label>
                    <input class="bgw-input" type="text" id="vm-code" placeholder="${Language.text('please_enter_verification_code')}" />
                  </div>
                  ${this.sendCodeAgain(gvc, vm.prefix, () => {
                            this.sendResetEmail(widget, vm);
                        })}
                  <div
                    class="${gClass('button')} my-2"
                    onclick="${gvc.event(() => {
                            this.verifySubmitCode(widget, vm);
                        })}"
                  >
                    <span class="${gClass('button-text')}">${Language.text('submit')}</span>
                  </div>
                </div>
                ${this.backToLogin(gvc, vm)}
              </div>
            </section>`;
                    }
                    if (vm.viewType === 'reset_password') {
                        return html `<section class="${gClass('container')}">
              <div class="${gClass('box')}">
                <div class="${gClass('login-title')}">${Language.text('reset_password')}</div>
                <div class="w-100 d-flex flex-column gap-3">
                  <div>
                    <label class="${gClass('label')}">${Language.text('new_password')}</label>
                    <input class="bgw-input" type="password" id="vm-new-password" placeholder="${Language.text('new_password_placeholder')}" />
                  </div>
                  <div>
                    <label class="${gClass('label')}">${Language.text('confirm_password')}</label>
                    <input class="bgw-input" type="password" id="vm-confirm-password" placeholder="${Language.text('please_enter_password_again')}" />
                  </div>
                  <div
                    class="${gClass('button')} my-2"
                    onclick="${gvc.event(() => {
                            this.resetNewPassword(widget, vm);
                        })}"
                  >
                    <span class="${gClass('button-text')}">${Language.text('submit')}</span>
                  </div>
                </div>
                ${this.backToLogin(gvc, vm)}
              </div>
            </section>`;
                    }
                    if (vm.viewType === 'register') {
                        return html `<section class="${gClass('container')}">
              <div class="${gClass('box')}">
                <div class="${gClass('login-title')}">${Language.text('member_register')}</div>
                <div class="w-100 d-flex flex-column gap-3">
                  ${vm.registerConfig
                            .map((item) => {
                            if (item.hidden)
                                return '';
                            const title = ['name', 'email', 'phone', 'birth'].includes(item.key) ? Language.text(`form_${item.key}`) : item.title;
                            const placeholder = Language.text(`please_enter_${item.key}`) || item.form_config.place_holder || '';
                            const cell = html `<div class="position-relative">
                        <label class="${gClass('label')}">${title}</label>
                        <input
                          class="bgw-input"
                          type="${item.form_config.type}"
                          id="reg-${item.key}"
                          ${(item.form_config.type === 'date') ? `` : ` placeholder="${placeholder}"
                                                data-placeholder="${placeholder}"`}
                          onchange="${gvc.event((e) => {
                                if (CheckInput.isEmpty(e.value)) {
                                    e.style.color = 'rgba(0,0,0,0)';
                                    e.dataset.placeholder = placeholder;
                                }
                                else {
                                    e.style.color = '#393939';
                                    e.dataset.placeholder = '';
                                }
                            })}"
                        />
                      </div>`;
                            if (item.key === 'email' && vm.loginConfig.email_verify) {
                                return html `${cell}
                        <div>
                          <label class="${gClass('label')}">${Language.text('email_verification_code')}</label>
                          <input class="bgw-input" type="text" id="reg-${item.key}-verify" placeholder="${Language.text('please_enter_verification_code')}" />
                        </div>
                        ${this.sendCodeAgain(gvc, vm.prefix, () => {
                                    this.sendVerifyEmailCode(widget, `reg-${item.key}`);
                                })}`;
                            }
                            if (item.key === 'phone' && vm.loginConfig.phone_verify) {
                                return html `${cell}
                        <div>
                          <label class="${gClass('label')}">${Language.text('sms_verification_code')}</label>
                          <input class="bgw-input" type="text" id="reg-${item.key}-verify" placeholder="${Language.text('please_enter_verification_code')}" />
                        </div>
                        ${this.sendCodeAgain(gvc, vm.prefix, () => {
                                    this.sendVerifyPhoneCode(widget, `reg-${item.key}`);
                                })}`;
                            }
                            return cell;
                        })
                            .join('')}
                  <div>
                    <label class="${gClass('label')}">${Language.text('password')}</label>
                    <input class="bgw-input" type="password" id="vm-password" placeholder="${Language.text('please_enter_password')}" />
                  </div>
                  <div>
                    <label class="${gClass('label')}">${Language.text('confirm_password')}</label>
                    <input class="bgw-input" type="password" id="vm-confirm-password" placeholder="${Language.text('please_enter_password_again')}" />
                  </div>
                  <div
                    class="${gClass('button')} my-2"
                    onclick="${gvc.event(() => {
                            this.registerByNormal(gvc, widget, vm);
                        })}"
                  >
                    <span class="${gClass('button-text')}">${Language.text('register')}</span>
                  </div>
                  ${this.authThirdPartyHTML(gvc, widget, vm)}
                  <div class="d-flex flex-column gap-2 text-center mt-1">
                    <div class="${gClass('font-16')}">
                      ${Language.text('member_exists_prompt')}<span
                      class="${gClass('blue-note')}"
                      onclick="${gvc.event(() => {
                            this.viewCallback(vm, '');
                        })}"
                    >${Language.text('login')}</span
                    >
                    </div>
                    <div class="${gClass('font-14')}">
                      ${Language.text('registration_terms_agreement')}<a class="${gClass('blue-note')}" href="/privacy">${Language.text('terms_of_service')}</a>${Language.text('and')}<a class="${gClass('blue-note')}" href="/term">${Language.text('privacy_policy')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>`;
                    }
                    return html `<section class="${gClass('container')}">
            <div class="${gClass('box')}">
              <div class="${gClass('login-title')}">${Language.text('member_login')}</div>
              <div class="w-100 d-flex flex-column gap-3">
                <div>
                  <label class="${gClass('label')}">${Language.text('email_phone')}</label>
                  <input class="bgw-input" type="text" id="vm-account" placeholder="${Language.text('email_phone_placeholder')}" />
                </div>
                <div>
                  <label class="${gClass('label')}">${Language.text('password')}</label>
                  <input class="bgw-input" type="password" id="vm-password" placeholder="${Language.text('please_enter_password')}" />
                </div>
                <div class="text-end">
                                <span
                                  class="${gClass('blue-note')}"
                                  onclick="${gvc.event(() => {
                        vm.viewType = 'send_forget_pwd_email';
                    })}"
                                >${Language.text('forgot_password')}</span
                                >
                </div>
                <div
                  class="${gClass('button')} my-2"
                  onclick="${gvc.event(() => {
                        this.loginByNormal(gvc, widget);
                    })}"
                >
                  <span class="${gClass('button-text')}">${Language.text('login')}</span>
                </div>
                ${this.authThirdPartyHTML(gvc, widget, vm)}
                <div class="d-flex flex-column gap-2 text-center mt-1">
                  <div class="${gClass('font-16')}">
                    ${Language.text('member_not_exists_prompt')}<span
                    class="${gClass('blue-note')}"
                    onclick="${gvc.event(() => {
                        this.viewCallback(vm, 'register');
                    })}"
                  >${Language.text('register')}</span
                  >
                  </div>
                  <div class="${gClass('font-14')}">
                    ${Language.text('login_terms_agreement')}<a class="${gClass('blue-note')}" href="/privacy">${Language.text('terms_of_service')}</a>${Language.text('and')}<a
                    class="${gClass('blue-note')}"
                    href="/term"
                  >${Language.text('privacy_policy')}</a
                  >
                  </div>
                </div>
              </div>
            </div>
          </section>`;
                }
                catch (e) {
                    console.log(`error==>`, e);
                    return ``;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (loadings.view) {
                    Promise.all([
                        new Promise((resolve, reject) => {
                            ApiUser.getPublicConfig('login_config', 'manager').then((dd) => {
                                if (dd.result && dd.response.value) {
                                    resolve(dd.response.value);
                                }
                                else {
                                    resolve({});
                                }
                            });
                        }),
                        new Promise((resolve, reject) => {
                            ApiUser.getPublicConfig('custom_form_register', 'manager').then((dd) => {
                                try {
                                    resolve(dd.response.value.list || []);
                                }
                                catch (e) {
                                    resolve([]);
                                }
                            });
                        }),
                    ]).then((dataArray) => {
                        vm.loginConfig = dataArray[0];
                        vm.registerConfig = FormCheck.initialRegisterForm(dataArray[1]);
                        setTimeout(() => {
                            loadings.view = false;
                            gvc.notifyDataChange(ids.view);
                        }, 300);
                    });
                }
            },
        });
    }
    static addStyle(gvc, prefix) {
        const isPhone = document.body.clientWidth < 768;
        gvc.addStyle(css `
        .${prefix}-container {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: ${isPhone ? 0 : '100px'};
            padding-bottom: ${isPhone ? '0px' : '230px'};
            overflow: hidden;
        }
        .${prefix}-box {
            border-radius: ${isPhone ? '0px' : '30px'};
            background: #fff;
            ${isPhone ? '' : 'box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 0.15)'};
            display: flex;
            width: 576px;
            padding: ${isPhone ? '56px 16px' : '56px'};
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 32px;
            overflow: hidden;
        }
        .${prefix}-login-title {
            color: #393939;
            text-align: center;
            font-size: 32px;
            font-style: normal;
            font-weight: 700;
            line-height: 140%;
            margin-bottom: 24px;
        }
        .${prefix}-label {
            color: #393939;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .${prefix}-button {
            border-radius: 10px;
            background: #393939;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            padding: 14px 0;
            cursor: pointer;
            height: 48px;
        }
        .${prefix}-button:hover {
            background: #656565;
        }
        .${prefix}-button-text {
            color: #fff;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.64px;
        }
        .${prefix}-auth-thrid-button {
            border-radius: 5px;
            background: #f1f1f1;
            height: 50px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .${prefix}-auth-thrid-button:hover {
            background: #dbdbdb;
        }
        .${prefix}-blue-note {
            color: #4d86db;
            cursor: pointer;
            margin: 0 4px;
        }
        .${prefix}-blue-note:hover {
            color: #4d86db !important;
        }
        .${prefix}-gray-hr {
            flex: 1 1 auto !important;
            height: 1px;
            background-color: #ddd;
        }
        .${prefix}-font-16 {
            font-size: 16px;
        }
        .${prefix}-font-14 {
            font-size: 14px;
        }
    `);
    }
    static successCallback(gvc, widget, response, text) {
        var _a;
        gvc.glitter.share.public_api = (_a = gvc.glitter.share.public_api) !== null && _a !== void 0 ? _a : {};
        gvc.glitter.share.public_api.GlobalUser = GlobalUser;
        GlobalUser.token = response.token;
        GlobalUser.userInfo = response;
        GlobalUser.updateUserData = JSON.parse(JSON.stringify(response));
        widget.event('success', { title: text !== null && text !== void 0 ? text : Language.text('login_success') });
        setTimeout(() => {
            ApiUser.getUserData(GlobalUser.token, 'me').then(res => {
                if (res.response.userData && !res.response.userData.phone && window.login_config.phone_verify && gvc.glitter.getUrlParameter('page') !== 'account_edit') {
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.infoMessage({
                        text: Language.text('phone_verify_check')
                    });
                    gvc.glitter.href = '/account_edit';
                }
                else {
                    if (GlobalUser.loginRedirect) {
                        const red = GlobalUser.loginRedirect;
                        GlobalUser.loginRedirect = '';
                        gvc.glitter.href = red;
                    }
                    else {
                        if (window.appName === 'proshake_v2') {
                            gvc.glitter.href = '/user_info';
                        }
                        else {
                            gvc.glitter.href = '/account_userinfo';
                        }
                    }
                }
            });
        }, 700);
    }
    static authThirdPartyHTML(gvc, widget, vm) {
        const loginEvents = this.getAuthLoginEvents(gvc, widget);
        return html `<div class="w-100 d-flex align-items-center gap-2" style="color:#8D8D8D;">
      <div class="${vm.prefix}-gray-hr"></div>
      ${Language.text('or')}
      <div class="${vm.prefix}-gray-hr"></div>
    </div>
    <div class="d-flex w-100 align-items-center justify-content-center gap-2">
      ${[
            {
                type: 'google',
                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/Google__G__logo.svg.webp',
            },
            {
                type: 'line',
                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/LINE_Brand_icon.png',
            },
            {
                type: 'apple',
                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/14776639.png',
            },
            {
                type: 'fb',
                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/5968764.png',
            },
        ]
            .map((item) => {
            if (!vm.loginConfig[item.type]) {
                return '';
            }
            const event = loginEvents.find((data) => data.key === item.type);
            if (!event) {
                return '';
            }
            event.created();
            return html `<div
            class="${vm.prefix}-auth-thrid-button"
            onclick="${gvc.event(() => {
                event.call();
            })}"
          >
            <img style="width: 28px" src="${item.icon}" />
          </div>`;
        })
            .join('')}
    </div>`;
    }
    static checkValue(name) {
        const e = document.getElementById(name);
        return e && e.value ? e.value : false;
    }
    static viewCallback(vm, type) {
        setTimeout(() => {
            $('html').scrollTop(0);
        }, 100);
        vm.viewType = type;
    }
    static backToLogin(gvc, vm) {
        return html `<section
      class="m-auto d-flex align-items-center justify-content-center my-2"
      style="cursor: pointer;"
      onclick="${gvc.event(() => {
            this.viewCallback(vm, 'login');
        })}"
    >
      <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
      <span class="go-back-text">${Language.text('back_to_login_page')}</span>
    </section>`;
    }
    static sendCodeAgain(gvc, prefix, event) {
        const glitter = gvc.glitter;
        const id = glitter.getUUID();
        let n = 0;
        return gvc.bindView({
            bind: id,
            view: () => {
                return html `<span
          class="${prefix}-blue-note"
          onclick="${gvc.event(() => {
                    if (n == 0) {
                        event();
                        n = 30;
                        setTimeout(() => {
                            gvc.notifyDataChange(id);
                        }, 100);
                    }
                })}"
        >${n > 0 ? Language.text('resend_code_timer').replace('xxx', n) : Language.text('get_verification_code')}</span
        >`;
            },
            divCreate: {
                class: 'text-end',
            },
            onCreate: () => {
                if (n > 0) {
                    setTimeout(() => {
                        n--;
                        gvc.notifyDataChange(id);
                    }, 1000);
                }
            },
        });
    }
    static getAuthLoginEvents(gvc, widget) {
        const glitter = gvc.glitter;
        return [
            {
                key: 'line',
                created: () => {
                    if (gvc.glitter.getUrlParameter('state') === 'line_login') {
                        gvc.glitter.setUrlParameter('state', '');
                        ApiUser.login({
                            login_type: 'line',
                            line_token: gvc.glitter.getUrlParameter('code'),
                            redirect: (() => {
                                if (glitter.deviceType !== glitter.deviceTypeEnum.Web) {
                                    return 'app';
                                }
                                else {
                                    const url = new URL(location.origin + location.pathname);
                                    if (gvc.glitter.getUrlParameter('appName')) {
                                        url.searchParams.set('appName', window.appName);
                                    }
                                    return encodeURI(url.href);
                                }
                            })(),
                        }).then((r) => {
                            gvc.glitter.setUrlParameter('code', '');
                            if (r.result) {
                                this.successCallback(gvc, widget, r.response);
                            }
                            else {
                                widget.event('error', { title: `Line: ${Language.text('login_failure')}` });
                            }
                        });
                    }
                    else {
                        ApiUser.getPublicConfig('login_line_setting', 'manager').then((dd) => {
                            widget.share.line = dd.response.value || {};
                            if (gvc.glitter.getUrlParameter('line_liff') === 'true') {
                                widget.event('loading', { visible: true });
                                setTimeout(() => {
                                    localStorage.setItem('login_page', 'account');
                                }, 100);
                            }
                        });
                    }
                },
                call: () => {
                    if (glitter.deviceType !== glitter.deviceTypeEnum.Web) {
                        gvc.glitter.runJsInterFace('line_login', {
                            id: widget.share.line.id,
                        }, (response) => {
                            if (response.result) {
                                gvc.glitter.setUrlParameter('state', 'line_login');
                                gvc.glitter.setUrlParameter('code', response.code);
                                gvc.recreateView();
                            }
                        });
                    }
                    else {
                        const redirect_url = location.origin + location.pathname;
                        gvc.glitter.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${widget.share.line.id}&redirect_uri=${encodeURI(redirect_url)}&state=line_login&scope=profile%20openid%20email&nonce=09876xyz`;
                    }
                },
            },
            {
                key: 'google',
                created: () => {
                    if (localStorage.getItem('google_login') === 'true') {
                        localStorage.removeItem('google_login');
                        ApiUser.login({
                            login_type: 'google',
                            google_token: gvc.glitter.getUrlParameter('code'),
                            redirect: (() => {
                                if (glitter.deviceType !== glitter.deviceTypeEnum.Web) {
                                    return (glitter.deviceType === glitter.deviceTypeEnum.Android) ? 'android' : 'app';
                                }
                                else {
                                    const googleRedirect = localStorage.getItem('google_redirect');
                                    return googleRedirect ? encodeURI(googleRedirect) : '';
                                }
                            })(),
                        }).then((r) => {
                            if (r.result) {
                                this.successCallback(gvc, widget, r.response);
                            }
                            else {
                                widget.event('error', { title: `Google: ${Language.text('login_failure')}` });
                            }
                        });
                    }
                    else {
                        ApiUser.getPublicConfig('login_google_setting', 'manager').then((dd) => {
                            widget.share.google = dd.response.value || {};
                        });
                    }
                },
                call: () => {
                    const redirect_url = location.origin + location.pathname;
                    localStorage.setItem('google_login', 'true');
                    localStorage.setItem('google_redirect', redirect_url);
                    if (glitter.deviceType !== glitter.deviceTypeEnum.Web) {
                        ApiUser.getPublicConfig('login_google_setting', 'manager').then((dd) => {
                            widget.share.google = dd.response.value || {};
                            gvc.glitter.runJsInterFace('google_login', {
                                app_id: (glitter.deviceType === glitter.deviceTypeEnum.Android) ? widget.share.google.android_app_id : widget.share.google.app_id,
                            }, (response) => {
                                if (response.result) {
                                    gvc.glitter.setUrlParameter('state', 'google_login');
                                    gvc.glitter.setUrlParameter('code', response.code);
                                    gvc.recreateView();
                                }
                            });
                        });
                    }
                    else {
                        gvc.glitter.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${widget.share.google.id}&redirect_uri=${redirect_url}&state=google_login&response_type=code&scope=profile+email`;
                    }
                },
            },
            {
                key: 'fb',
                created: () => {
                    ApiUser.getPublicConfig('login_fb_setting', 'manager').then((dd) => {
                        widget.share.fb = dd.response.value || {};
                        const loadFacebookSDK = () => {
                            const intervalId = setInterval(() => {
                                var _a;
                                const FB = window.FB;
                                if (FB) {
                                    clearInterval(intervalId);
                                    FB.init({
                                        appId: widget.share.fb.id,
                                        xfbml: true,
                                        version: 'v22.0'
                                    });
                                    return;
                                }
                                const sdkId = 'facebook-jssdk';
                                if (!document.getElementById(sdkId)) {
                                    const script = document.createElement('script');
                                    script.id = sdkId;
                                    script.src = 'https://connect.facebook.net/en_US/sdk.js';
                                    const firstScript = document.getElementsByTagName('script')[0];
                                    (_a = firstScript.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(script, firstScript);
                                }
                            }, 500);
                        };
                        loadFacebookSDK();
                    });
                },
                call: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        console.log('call fb', widget.share.fb);
                        if (glitter.deviceType !== glitter.deviceTypeEnum.Web) {
                            gvc.glitter.runJsInterFace('facebook_login', {
                                app_id: widget.share.fb.id,
                                secret: widget.share.fb.secret
                            }, (response) => {
                                if (response.result) {
                                    ApiUser.login({
                                        login_type: 'fb',
                                        fb_token: response.accessToken,
                                    }).then((r) => {
                                        if (r.result) {
                                            this.successCallback(gvc, widget, r.response);
                                        }
                                        else {
                                            widget.event('error', { title: `Facebook: ${Language.text('login_failure')}` });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            window.FB.login((response) => {
                                const accessToken = response.authResponse.accessToken;
                                ApiUser.login({
                                    login_type: 'fb',
                                    fb_token: accessToken,
                                }).then((r) => {
                                    if (r.result) {
                                        this.successCallback(gvc, widget, r.response);
                                    }
                                    else {
                                        widget.event('error', { title: `Facebook: ${Language.text('login_failure')}` });
                                    }
                                });
                            }, { scope: 'public_profile,email' });
                        }
                    }));
                },
            },
            {
                key: 'apple',
                created: () => {
                    const appleCode = window.post_body.code;
                    if (appleCode) {
                        ApiUser.login({
                            login_type: 'apple',
                            token: appleCode,
                        }).then((r) => {
                            if (r.result) {
                                this.successCallback(gvc, widget, r.response);
                            }
                            else {
                                widget.event('error', { title: `Apple: ${Language.text('login_failure')}` });
                            }
                        });
                    }
                    else {
                        gvc.addMtScript([
                            {
                                src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
                            },
                        ], () => {
                            ApiUser.getPublicConfig('login_apple_setting', 'manager').then((dd) => {
                                widget.share.apple = dd.response.value || {};
                            });
                        }, () => { });
                    }
                },
                call: () => {
                    const AppleID = window.AppleID;
                    AppleID.auth.init({
                        clientId: widget.share.apple.id,
                        scope: 'name email',
                        redirectURI: `https://${document.domain}/login`,
                        usePopup: false,
                    });
                    AppleID.auth.signIn();
                },
            },
        ];
    }
    static registerByNormal(gvc, widget, vm) {
        const password = this.checkValue('vm-password');
        const confirmPassword = this.checkValue('vm-confirm-password');
        if (!password) {
            widget.event('error', { title: Language.text('please_enter_password') });
            return;
        }
        if (!confirmPassword) {
            widget.event('error', { title: Language.text('please_confirm_password_again') });
            return;
        }
        if (password !== confirmPassword) {
            widget.event('error', { title: Language.text('password_mismatch') });
            return;
        }
        const userData = {};
        for (const item of vm.registerConfig) {
            if (item.hidden) {
                continue;
            }
            if ((item.key === 'email' && vm.loginConfig.email_verify) || (item.key === 'phone' && vm.loginConfig.phone_verify)) {
                const vData = this.checkValue(`reg-${item.key}-verify`);
                if (item.key === 'email') {
                    if (!vData) {
                        widget.event('error', { title: Language.text('please_enter_email_verification_code') });
                        return;
                    }
                    userData.verify_code = vData;
                }
                if (item.key === 'phone') {
                    if (!vData) {
                        widget.event('error', { title: Language.text('please_enter_sms_verification_code') });
                        return;
                    }
                    userData.verify_code_phone = vData;
                }
            }
            const data = this.checkValue(`reg-${item.key}`);
            if (item.require && !data) {
                widget.event('error', { title: `${Language.text('please_enter')}「${item.title}」` });
                return;
            }
            if (item.key === 'email' && data && !CheckInput.isEmail(data)) {
                widget.event('error', { title: Language.text('enter_valid_email') });
                return;
            }
            if (item.key === 'phone' && data && !CheckInput.isTaiwanPhone(data)) {
                widget.event('error', { title: Language.text('enter_valid_phone_number') });
                return;
            }
            userData[item.key] = data;
        }
        widget.event('loading', { visible: true });
        ApiUser.register({
            account: userData.email || userData.phone,
            pwd: password,
            userData: userData,
        }).then((r) => {
            widget.event('loading', { visible: false });
            if (r.result) {
                this.successCallback(gvc, widget, r.response, Language.text('registration_success'));
                return;
            }
            if (r.response.message === 'user is already exists') {
                widget.event('error', { title: Language.text('existing_user') });
                return;
            }
            if (!r.response.data) {
                widget.event('error', { title: Language.text('registration_failure') });
                return;
            }
            if (r.response.data.msg === 'email-verify-false') {
                widget.event('error', { title: Language.text('email_verification_code_incorrect') });
                return;
            }
            if (r.response.data.msg === 'phone-verify-false') {
                widget.event('error', { title: Language.text('sms_verification_code_incorrect') });
                return;
            }
        });
    }
    static loginByNormal(gvc, widget) {
        const account = this.checkValue('vm-account');
        const password = this.checkValue('vm-password');
        if (!account) {
            widget.event('error', { title: Language.text('email_phone_placeholder') });
            return;
        }
        if (!password) {
            widget.event('error', { title: Language.text('please_enter_password') });
            return;
        }
        ApiUser.login({
            account: account,
            pwd: password,
        }).then((r) => {
            if (r.result) {
                this.successCallback(gvc, widget, r.response);
            }
            else {
                widget.event('error', { title: Language.text('incorrect_credentials') });
            }
        });
    }
    static sendResetEmail(widget, vm) {
        if (!vm.resetEmail) {
            const email = this.checkValue('vm-email');
            if (!email) {
                widget.event('error', { title: Language.text('email_placeholder') });
                return;
            }
            if (!CheckInput.isEmail(email)) {
                widget.event('error', { title: Language.text('enter_valid_email') });
                return;
            }
            vm.resetEmail = email;
        }
        widget.event('loading', { visible: true });
        ApiUser.forgetPwd(vm.resetEmail).then((r) => {
            widget.event('loading', { visible: false });
            if (r.result && r.response.result) {
                widget.event('success', { title: Language.text('verification_code_sent') });
                if (vm.viewType !== 'validation_code') {
                    setTimeout(() => {
                        vm.viewType = 'validation_code';
                    }, 1000);
                }
            }
            else {
                widget.event('error', { title: Language.text('system_error') });
            }
        });
    }
    static sendVerifyEmailCode(widget, id) {
        const email = this.checkValue(id);
        if (!email) {
            widget.event('error', { title: Language.text('email_placeholder') });
            return;
        }
        if (!CheckInput.isEmail(email)) {
            widget.event('error', { title: Language.text('enter_valid_email') });
            return;
        }
        ApiUser.emailVerify(email).then((r) => {
            if (r.result && r.response.result) {
                widget.event('success', { title: Language.text('verification_code_sent') });
            }
            else {
                widget.event('error', { title: Language.text('system_error') });
            }
        });
    }
    static sendVerifyPhoneCode(widget, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const phone = UMLogin.checkValue(id);
            if (!phone) {
                widget.event('error', { title: Language.text('enter_phone_number') });
                return;
            }
            if (!CheckInput.isTaiwanPhone(phone)) {
                widget.event('error', { title: Language.text('enter_valid_phone_number') });
                return;
            }
            if ((yield ApiUser.getPhoneCount(phone)).response.result) {
                widget.event('error', { title: Language.text('phone_number_already_exists') });
            }
            else {
                ApiUser.phoneVerify(phone).then((r) => {
                    if (r.result && r.response.result) {
                        widget.event('success', { title: Language.text('verification_code_sent') });
                    }
                    else {
                        widget.event('error', { title: Language.text('system_error') });
                    }
                });
            }
        });
    }
    static verifySubmitCode(widget, vm) {
        const code = this.checkValue('vm-code');
        if (!code) {
            widget.event('error', { title: Language.text('please_enter_verification_code') });
            return;
        }
        ApiUser.forgetPwdCheckCode(vm.resetEmail, code).then((r) => {
            if (r.result && r.response.result) {
                vm.validationCode = code;
                vm.viewType = 'reset_password';
            }
            else {
                widget.event('error', { title: Language.text('email_verification_code_incorrect') });
            }
        });
    }
    static resetNewPassword(widget, vm) {
        const newPassword = this.checkValue('vm-new-password');
        const confirmPassword = this.checkValue('vm-confirm-password');
        if (!newPassword) {
            widget.event('error', { title: Language.text('please_enter_new_password') });
            return;
        }
        if (!confirmPassword) {
            widget.event('error', { title: Language.text('please_confirm_password_again') });
            return;
        }
        if (newPassword !== confirmPassword) {
            widget.event('error', { title: Language.text('password_mismatch') });
            return;
        }
        ApiUser.resetPwdV2(vm.resetEmail, vm.validationCode, newPassword).then((r) => {
            vm.resetEmail = '';
            if (r.result && r.response.result) {
                widget.event('success', { title: Language.text('password_change_success') });
                setTimeout(() => {
                    this.viewCallback(vm, 'login');
                }, 1000);
            }
            else {
                widget.event('error', { title: Language.text('password_change_failure') });
            }
        });
    }
}
window.glitter.setModule(import.meta.url, UMLogin);
