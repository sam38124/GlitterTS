import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';
import { Tool } from '../../modules/tool.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { ApiUser } from '../../glitter-base/route/user.js';

const html = String.raw;
const css = String.raw;

type VM = {
    account: string;
    password: string;
    loginConfig: any;
    registerConfig: any;
    resetEmail: string;
    viewType: string;
    validationCode: string;
    prefix: string;
};

export class UMLogin {
    static main(gvc: GVC, widget: any, subData: any) {
        const glitter = gvc.glitter;
        const vm: VM = {
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

        const gClass = (name: string) => `${vm.prefix}-${name}`;

        return gvc.bindView({
            bind: ids.view,
            dataList: [{ obj: vm, key: 'viewType' }],
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                }

                if (vm.viewType === 'send_forget_pwd_email') {
                    return html`<section class="${gClass('container')}">
                        <div class="${gClass('box')}">
                            <div class="${gClass('login-title')}">忘記密碼</div>
                            <div class="w-100 d-flex flex-column gap-3">
                                <div>
                                    <label class="${gClass('label')}">電子信箱</label>
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
                    return html`<section class="${gClass('container')}">
                        <div class="${gClass('box')}">
                            <div class="${gClass('login-title')}">輸入驗證碼</div>
                            <div class="w-100 d-flex flex-column gap-3">
                                <div>
                                    <label class="${gClass('label')}">驗證碼</label>
                                    <input class="bgw-input" type="text" id="vm-code" placeholder="${Language.text('please_enter_verification_code')}" />
                                </div>
                                ${this.sendCodeAgain(gvc, vm.prefix, () => {
                                    this.sendResetEmail(widget, vm);
                                })}
                                <div
                                    class="${gClass('button')} my-2"
                                    onclick="${gvc.event(() => {
                                        this.validationCode(widget, vm);
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
                    return html`<section class="${gClass('container')}">
                        <div class="${gClass('box')}">
                            <div class="${gClass('login-title')}">重設密碼</div>
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
                    return html`<section class="${gClass('container')}">
                        <div class="${gClass('box')}">
                            <div class="${gClass('login-title')}">會員註冊</div>
                            <div class="w-100 d-flex flex-column gap-3">
                                ${vm.registerConfig
                                    .map((item: any) => {
                                        if (item.hidden) return '';

                                        const cell = html`<div>
                                            <label class="${gClass('label')}">${item.title}</label>
                                            <input class="bgw-input" type="${item.form_config.type}" id="reg-${item.key}" placeholder="${item.form_config.place_holder}" />
                                        </div>`;

                                        if (item.key === 'email' && vm.loginConfig.email_verify) {
                                            return html`${cell}
                                                <div>
                                                    <label class="${gClass('label')}">${item.title}驗證碼</label>
                                                    <input class="bgw-input" type="text" id="reg-${item.key}-verify" placeholder="${Language.text('please_enter_verification_code')}" />
                                                </div>
                                                ${this.sendCodeAgain(gvc, vm.prefix, () => {
                                                    this.sendVerifyEmailCode(widget, `reg-${item.key}`);
                                                })}`;
                                        }

                                        if (item.key === 'phone' && vm.loginConfig.phone_verify) {
                                            return html`${cell}
                                                <div>
                                                    <label class="${gClass('label')}">${item.title}驗證碼</label>
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
                                    <label class="${gClass('label')}">${Language.text('new_password')}</label>
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
                                        已經有會員了？前往<span
                                            class="${gClass('blue-note')}"
                                            onclick="${gvc.event(() => {
                                                this.viewCallback(vm, '');
                                            })}"
                                            >登入</span
                                        >
                                    </div>
                                    <div class="${gClass('font-14')}">
                                        註冊完成時，即代表您同意我們的<a class="${gClass('blue-note')}" href="/pages/privacy">服務條款</a>和<a class="${gClass('blue-note')}" href="/pages/terms"
                                            >隱私條款</a
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>`;
                }

                return html`<section class="${gClass('container')}">
                    <div class="${gClass('box')}">
                        <div class="${gClass('login-title')}">會員登入</div>
                        <div class="w-100 d-flex flex-column gap-3">
                            <div>
                                <label class="${gClass('label')}">信箱或電話</label>
                                <input class="bgw-input" type="text" id="vm-account" placeholder="${Language.text('email_phone_placeholder')}" />
                            </div>
                            <div>
                                <label class="${gClass('label')}">密碼</label>
                                <input class="bgw-input" type="password" id="vm-password" placeholder="${Language.text('please_enter_password')}" />
                            </div>
                            <div class="text-end">
                                <span
                                    class="${gClass('blue-note')}"
                                    onclick="${gvc.event(() => {
                                        vm.viewType = 'send_forget_pwd_email';
                                    })}"
                                    >忘記密碼</span
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
                                    還沒有成為會員？前往<span
                                        class="${gClass('blue-note')}"
                                        onclick="${gvc.event(() => {
                                            this.viewCallback(vm, 'register');
                                        })}"
                                        >註冊</span
                                    >
                                </div>
                                <div class="${gClass('font-14')}">
                                    登入完成時，即代表您同意我們的<a class="${gClass('blue-note')}" href="/pages/privacy">服務條款</a>和<a class="${gClass('blue-note')}" href="/pages/terms"
                                        >隱私條款</a
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </section>`;
            },
            divCreate: {},
            onCreate: () => {
                if (loadings.view) {
                    Promise.all([
                        new Promise((resolve, reject) => {
                            ApiUser.getPublicConfig('login_config', 'manager').then((dd) => {
                                if (dd.result && dd.response.value) {
                                    resolve(dd.response.value);
                                } else {
                                    resolve({});
                                }
                            });
                        }),
                        new Promise((resolve, reject) => {
                            ApiUser.getPublicConfig('custom_form_register', 'manager').then((dd) => {
                                try {
                                    resolve(dd.response.value.list);
                                } catch (e) {
                                    resolve([]);
                                }
                            });
                        }),
                    ]).then((dataArray) => {
                        vm.loginConfig = dataArray[0];
                        vm.registerConfig = dataArray[1];
                        loadings.view = false;
                        gvc.notifyDataChange(ids.view);
                    });
                }
            },
        });
    }

    static addStyle(gvc: GVC, prefix: string) {
        const isPhone = document.body.clientWidth < 768;
        gvc.addStyle(css`
            .${prefix}-container {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-top: ${isPhone ? 0 : '100px'};
                padding-bottom: ${isPhone ? '40px' : '230px'};
                overflow: hidden;
            }
            .${prefix}-box {
                border-radius: 30px;
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

    static successCallback(gvc: GVC, widget: any, response: any, text?: string) {
        gvc.glitter.share.public_api = gvc.glitter.share.public_api ?? {};
        gvc.glitter.share.public_api.GlobalUser = GlobalUser;
        GlobalUser.token = response.token;
        GlobalUser.userInfo = response;
        GlobalUser.updateUserData = JSON.parse(JSON.stringify(response));
        widget.event('success', { title: text ?? '登入成功' });
        setTimeout(() => {
            widget.event('loading', { visible: true, title: '頁面跳轉中' });
            if (localStorage.getItem('redirect_cart') === 'true') {
                gvc.glitter.href = './checkout';
            }
            gvc.glitter.href = './account_userinfo';
        }, 700);
    }

    static authThirdPartyHTML(gvc: GVC, widget: any, vm: VM) {
        const loginEvents = this.getLoginEvents(gvc, widget);

        return html`<div class="w-100 d-flex align-items-center gap-2" style="color:#8D8D8D;">
                <div class="${vm.prefix}-gray-hr"></div>
                或
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
                        return html`<div
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

    static checkValue(name: string): string | false {
        const e = document.getElementById(name) as HTMLInputElement;
        return e && e.value ? e.value : false;
    }

    static viewCallback(vm: VM, type: string): void {
        setTimeout(() => {
            $('html').scrollTop(0);
        }, 100);
        vm.viewType = type;
    }

    static backToLogin(gvc: GVC, vm: VM): string {
        return html`<section
            class="m-auto d-flex align-items-center justify-content-center my-2"
            style="cursor: pointer;"
            onclick="${gvc.event(() => {
                this.viewCallback(vm, 'login');
            })}"
        >
            <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
            <span class="go-back-text">回到登入頁</span>
        </section>`;
    }

    static sendCodeAgain(gvc: GVC, prefix: string, event: () => void) {
        const glitter = gvc.glitter;
        const id = glitter.getUUID();
        let n = 0;
        return gvc.bindView({
            bind: id,
            view: () => {
                return html`<span
                    class="${prefix}-blue-note"
                    onclick="${gvc.event(() => {
                        if (n == 0) {
                            event();
                            n = 10;
                            setTimeout(() => {
                                gvc.notifyDataChange(id);
                            }, 100);
                        }
                    })}"
                    >${n > 0 ? `${n}秒後可重新` : ''}發送驗證碼</span
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

    static getLoginEvents(gvc: GVC, widget: any): { key: string; created: () => void; call: () => void }[] {
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
                                if (glitter.deviceType === glitter.deviceTypeEnum.Ios) {
                                    return 'app';
                                } else {
                                    const url = new URL(location.origin + location.pathname);
                                    if (gvc.glitter.getUrlParameter('appName')) {
                                        url.searchParams.set('appName', (window as any).appName);
                                    }
                                    return encodeURI(url.href);
                                }
                            })(),
                        }).then((r) => {
                            gvc.glitter.setUrlParameter('code', '');
                            if (r.result) {
                                this.successCallback(gvc, widget, r.response);
                            } else {
                                widget.event('error', { title: 'Line 登入失敗' });
                            }
                        });
                    } else {
                        ApiUser.getPublicConfig('login_line_setting', 'manager').then((dd) => {
                            widget.share.line = dd.response.value || {};
                            if (gvc.glitter.getUrlParameter('line_liff') === 'true') {
                                widget.event('loading', { visible: true });
                                setTimeout(() => {
                                    localStorage.setItem('login_page', 'account');
                                    // document.querySelector('.line_bt').click();
                                }, 100);
                            }
                        });
                    }
                },
                call: () => {
                    if (glitter.deviceType === glitter.deviceTypeEnum.Ios) {
                        gvc.glitter.runJsInterFace(
                            'line_login',
                            {
                                id: widget.share.line.id,
                            },
                            (response) => {
                                if (response.result) {
                                    gvc.glitter.setUrlParameter('state', 'line_login');
                                    gvc.glitter.setUrlParameter('code', response.code);
                                    gvc.recreateView();
                                }
                            }
                        );
                    } else {
                        const redirect_url = location.origin + location.pathname;
                        gvc.glitter.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${widget.share.line.id}&redirect_uri=${encodeURI(
                            redirect_url
                        )}&state=line_login&scope=profile%20openid%20email&nonce=09876xyz`;
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
                                if (glitter.deviceType === glitter.deviceTypeEnum.Ios) {
                                    return 'app';
                                } else {
                                    const googleRedirect = localStorage.getItem('google_redirect');
                                    return googleRedirect ? encodeURI(googleRedirect) : '';
                                }
                            })(),
                        }).then((r) => {
                            if (r.result) {
                                this.successCallback(gvc, widget, r.response);
                            } else {
                                widget.event('error', { title: 'Google 登入失敗' });
                            }
                        });
                    } else {
                        ApiUser.getPublicConfig('login_google_setting', 'manager').then((dd) => {
                            widget.share.google = dd.response.value || {};
                        });
                    }
                },
                call: () => {
                    const redirect_url = location.origin + location.pathname;

                    localStorage.setItem('google_login', 'true');
                    localStorage.setItem('google_redirect', redirect_url);

                    if (glitter.deviceType === glitter.deviceTypeEnum.Ios) {
                        gvc.glitter.runJsInterFace(
                            'google_login',
                            {
                                app_id: widget.share.google.app_id,
                            },
                            (response) => {
                                if (response.result) {
                                    gvc.glitter.setUrlParameter('state', 'google_login');
                                    gvc.glitter.setUrlParameter('code', response.code);
                                    gvc.recreateView();
                                }
                            }
                        );
                    } else {
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
                                const FB = (window as any).FB;

                                // 檢查 SDK 是否已載入
                                if (FB) {
                                    clearInterval(intervalId); // 清除間隔
                                    (window as any).fbAsyncInit = () => {
                                        FB.init({
                                            appId: widget.share.fb.id,
                                            xfbml: true,
                                            version: 'v19.0',
                                        });
                                    };
                                    return;
                                }

                                // 如果未載入，創建 script 標籤
                                const sdkId = 'facebook-jssdk';
                                if (!document.getElementById(sdkId)) {
                                    const script = document.createElement('script');
                                    script.id = sdkId;
                                    script.src = 'https://connect.facebook.net/en_US/sdk.js';
                                    const firstScript = document.getElementsByTagName('script')[0];
                                    firstScript.parentNode?.insertBefore(script, firstScript);
                                }
                            }, 500);
                        };

                        loadFacebookSDK();
                    });
                },
                call: () => {
                    return new Promise(async (resolve, reject) => {
                        if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
                            gvc.glitter.runJsInterFace('facebook_login', {}, (response) => {
                                if (response.result) {
                                    ApiUser.login({
                                        login_type: 'fb',
                                        fb_token: response.accessToken,
                                    }).then((r) => {
                                        if (r.result) {
                                            this.successCallback(gvc, widget, r.response);
                                        } else {
                                            widget.event('error', { title: '臉書登入錯誤' });
                                        }
                                    });
                                }
                            });
                        } else {
                            (window as any).FB.login(
                                (response: any) => {
                                    const accessToken = response.authResponse.accessToken;
                                    ApiUser.login({
                                        login_type: 'fb',
                                        fb_token: accessToken,
                                    }).then((r) => {
                                        if (r.result) {
                                            this.successCallback(gvc, widget, r.response);
                                        } else {
                                            widget.event('error', { title: '臉書登入錯誤' });
                                        }
                                    });
                                },
                                { scope: 'public_profile,email' }
                            );
                        }
                    });
                },
            },
            {
                key: 'apple',
                created: () => {
                    const appleCode = (window as any).post_body.code;
                    if (appleCode) {
                        ApiUser.login({
                            login_type: 'apple',
                            token: appleCode,
                        }).then((r) => {
                            if (r.result) {
                                this.successCallback(gvc, widget, r.response);
                            } else {
                                widget.event('error', { title: 'Apple 登入錯誤' });
                            }
                        });
                    } else {
                        gvc.addMtScript(
                            [
                                {
                                    src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
                                },
                            ],
                            () => {
                                ApiUser.getPublicConfig('login_apple_setting', 'manager').then((dd) => {
                                    widget.share.apple = dd.response.value || {};
                                });
                            },
                            () => {}
                        );
                    }
                },
                call: () => {
                    const AppleID = (window as any).AppleID;
                    AppleID.auth.init({
                        clientId: widget.share.apple.id,
                        scope: 'name email',
                        redirectURI: 'https://shopnex.cc/login',
                        usePopup: false,
                    });
                    AppleID.auth.signIn();
                },
            },
        ];
    }

    static registerByNormal(gvc: GVC, widget: any, vm: VM) {
        const password = this.checkValue('vm-password');
        const confirmPassword = this.checkValue('vm-confirm-password');

        if (!password) {
            widget.event('error', { title: '請輸入密碼' });
            return;
        }

        if (!confirmPassword) {
            widget.event('error', { title: '請輸入確認密碼' });
            return;
        }

        if (password !== confirmPassword) {
            widget.event('error', { title: '密碼與確認密碼不符' });
            return;
        }

        const userData = {} as any;

        for (const item of vm.registerConfig) {
            if (item.hidden) {
                continue;
            }

            if ((item.key === 'email' && vm.loginConfig.email_verify) || (item.key === 'phone' && vm.loginConfig.phone_verify)) {
                const vData = this.checkValue(`reg-${item.key}-verify`);
                if (!vData) {
                    widget.event('error', { title: `請輸入${item.title}驗證碼` });
                    return;
                }
                if (item.key === 'email') {
                    userData.verify_code = vData;
                }
                if (item.key === 'phone') {
                    userData.verify_code_phone = vData;
                }
            }

            const data = this.checkValue(`reg-${item.key}`);
            if (item.require && !data) {
                widget.event('error', { title: `請輸入${item.title}` });
                return;
            }
            if (item.key === 'email' && data && !CheckInput.isEmail(data)) {
                widget.event('error', { title: `請輸入有效電子信箱` });
                return;
            }
            if (item.key === 'phone' && data && !CheckInput.isTaiwanPhone(data)) {
                widget.event('error', { title: `請輸入有效手機號碼` });
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
                this.successCallback(gvc, widget, r.response, '註冊成功');
                return;
            }
            if (r.response.message === 'user is already exists') {
                widget.event('error', { title: '此為已註冊的使用者' });
                return;
            }
            if (!r.response.data) {
                widget.event('error', { title: '註冊失敗' });
                return;
            }
            if (r.response.data.msg === 'email-verify-false') {
                widget.event('error', { title: '信箱驗證碼輸入錯誤' });
                return;
            }
            if (r.response.data.msg === 'phone-verify-false') {
                widget.event('error', { title: '簡訊驗證碼輸入錯誤' });
                return;
            }
        });
    }

    static loginByNormal(gvc: GVC, widget: any) {
        const account = this.checkValue('vm-account');
        const password = this.checkValue('vm-password');

        if (!account) {
            widget.event('error', { title: '請輸入帳號' });
            return;
        }

        if (!password) {
            widget.event('error', { title: '請輸入密碼' });
            return;
        }

        ApiUser.login({
            account: account,
            pwd: password,
        }).then((r) => {
            if (r.result) {
                this.successCallback(gvc, widget, r.response);
            } else {
                widget.event('error', { title: '帳號或密碼錯誤' });
            }
        });
    }

    static sendResetEmail(widget: any, vm: VM) {
        if (!vm.resetEmail) {
            const email = this.checkValue('vm-email');

            if (!email) {
                widget.event('error', { title: '請輸入信箱' });
                return;
            }

            if (!CheckInput.isEmail(email)) {
                widget.event('error', { title: '請輸入有效信箱' });
                return;
            }

            vm.resetEmail = email;
        }

        widget.event('loading', { visible: true });
        ApiUser.forgetPwd(vm.resetEmail).then((r) => {
            widget.event('loading', { visible: false });
            if (r.result && r.response.result) {
                widget.event('success', { title: '成功寄送驗證碼' });
                if (vm.viewType !== 'validation_code') {
                    setTimeout(() => {
                        vm.viewType = 'validation_code';
                    }, 1000);
                }
            } else {
                widget.event('error', { title: '信件寄送錯誤' });
            }
        });
    }

    static sendVerifyEmailCode(widget: any, id: string) {
        const email = this.checkValue(id);

        if (!email) {
            widget.event('error', { title: '請輸入信箱' });
            return;
        }

        if (!CheckInput.isEmail(email)) {
            widget.event('error', { title: '請輸入有效信箱' });
            return;
        }

        ApiUser.emailVerify(email).then((r) => {
            if (r.result && r.response.result) {
                widget.event('success', { title: '已送出驗證碼信件' });
            } else {
                widget.event('error', { title: '信件寄送錯誤' });
            }
        });
    }

    static sendVerifyPhoneCode(widget: any, id: string) {
        const phone = this.checkValue(id);

        if (!phone) {
            widget.event('error', { title: '請輸入手機號碼' });
            return;
        }

        if (!CheckInput.isTaiwanPhone(phone)) {
            widget.event('error', { title: '請輸入有效的手機號碼' });
            return;
        }

        ApiUser.phoneVerify(phone).then((r) => {
            if (r.result && r.response.result) {
                widget.event('success', { title: '已送出驗證碼簡訊' });
            } else {
                widget.event('error', { title: '簡訊寄送錯誤' });
            }
        });
    }

    static validationCode(widget: any, vm: VM) {
        const code = this.checkValue('vm-code');

        if (!code) {
            widget.event('error', { title: '請輸入驗證碼' });
            return;
        }

        ApiUser.forgetPwdCheckCode(vm.resetEmail, code).then((r) => {
            if (r.result && r.response.result) {
                vm.validationCode = code;
                vm.viewType = 'reset_password';
            } else {
                widget.event('error', { title: '驗證碼輸入錯誤' });
            }
        });
    }

    static resetNewPassword(widget: any, vm: VM) {
        const newPassword = this.checkValue('vm-new-password');
        const confirmPassword = this.checkValue('vm-confirm-password');

        if (!newPassword) {
            widget.event('error', { title: '請輸入新密碼' });
            return;
        }

        if (!confirmPassword) {
            widget.event('error', { title: '請輸入確認密碼' });
            return;
        }

        if (newPassword !== confirmPassword) {
            widget.event('error', { title: '新密碼與確認密碼不符' });
            return;
        }

        ApiUser.resetPwdV2(vm.resetEmail, vm.validationCode, newPassword).then((r) => {
            vm.resetEmail = '';
            if (r.result && r.response.result) {
                widget.event('success', { title: '更換密碼成功' });
                setTimeout(() => {
                    this.viewCallback(vm, 'login');
                }, 1000);
            } else {
                widget.event('error', { title: '更換密碼失敗' });
            }
        });
    }
}

(window as any).glitter.setModule(import.meta.url, UMLogin);
