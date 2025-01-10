import { GVC } from '../../glitterBundle/GVController.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { Tool } from '../../modules/tool.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiWallet } from '../../glitter-base/route/wallet.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';

const html = String.raw;
const css = String.raw;

export class UmClass {
    static nav(gvc: GVC) {
        const glitter = gvc.glitter;
        this.addStyle(gvc);
        const vm = {
            id: gvc.glitter.getUUID(),
            loading: true,
            pageName: glitter.getUrlParameter('page'),
        };

        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });

        return gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return '';
                } else {
                    glitter.share.rebateConfig.title = CheckInput.isEmpty(glitter.share.rebateConfig.title) ? Language.text('shopping_credit') : glitter.share.rebateConfig.title;
                    const buttonHTML = [
                        {
                            key: 'account_userinfo',
                            title: Language.text('account'),
                        },
                        {
                            key: 'voucher-list',
                            title: Language.text('my_coupons'),
                        },
                        {
                            key: 'rebate',
                            title: `${Language.text('my')} ${glitter.share.rebateConfig.title}`,
                        },
                        {
                            key: 'order_list',
                            title: Language.text('order_history'),
                        },
                        {
                            key: 'wishlist',
                            title: Language.text('wishlist'),
                        },
                        {
                            key: 'reset_password',
                            title: Language.text('reset_password'),
                        },
                        {
                            key: 'logout',
                            title: Language.text('logout'),
                        },
                    ]
                        .map((item) => {
                            if (item.key == 'wishlist' && (window as any).store_info.wishlist == false) {
                                return '';
                            }
                            return html`
                                <div
                                    class="option px-2 d-flex justify-content-center um-nav-btn ${vm.pageName === item.key ? 'um-nav-btn-active' : ''}"
                                    onclick="${gvc.event(async () => {
                                        if (item.key === 'reset_password') {
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
                                                        html`<div class="tx_normal fw-normal mb-1">${Language.text('password')}</div>`,
                                                        html`<input
                                                            class="bgw-input"
                                                            type="password"
                                                            placeholder="${Language.text('please_enter_password')}"
                                                            oninput="${gvc.event((e) => {
                                                                update_vm.pwd = e.value;
                                                            })}"
                                                            value="${update_vm.pwd}"
                                                        />`,
                                                        html`<div class="tx_normal fw-normal mt-2 mb-1">${Language.text('confirm_password')}</div>`,
                                                        html`<input
                                                            class="bgw-input mb-2"
                                                            type="password"
                                                            placeholder="${Language.text('please_enter_password_again')}"
                                                            oninput="${gvc.event((e) => {
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
                                                                    ${BgWidget.blueNote(
                                                                        get_verify_timer
                                                                            ? `${Language.text('verification_code_sent_to')}『${userData.userData.email}』`
                                                                            : Language.text('get_verification_code'),
                                                                        gvc.event(() => {
                                                                            if (!get_verify_timer) {
                                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                                dialog.dataLoading({ visible: true });
                                                                                ApiUser.emailVerify(userData.userData.email, (window as any).appName).then(async (r) => {
                                                                                    dialog.dataLoading({ visible: false });
                                                                                    get_verify_timer = 60;
                                                                                    gvc.notifyDataChange(id);
                                                                                });
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
                                                        html`<div class="d-flex align-items-center justify-content-end pt-2 border-top mx-n3">
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
                                                                    }).then((res) => {
                                                                        dialog.dataLoading({ visible: false });
                                                                        if (!res.result && res.response.data.msg === 'email-verify-false') {
                                                                            dialog.errorMessage({ text: Language.text('email_verification_code_incorrect') });
                                                                        } else if (!res.result && res.response.data.msg === 'phone-verify-false') {
                                                                            dialog.errorMessage({ text: Language.text('sms_verification_code_incorrect') });
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
                                        } else if (item.key === 'logout') {
                                            GlobalUser.token = '';
                                            changePage('index', 'home', {});
                                        } else {
                                            changePage(item.key, 'page', {});
                                        }
                                    })}"
                                >
                                    ${item.title}
                                </div>
                            `;
                        })
                        .join('');

                    return html` <div class="account-section">
                        <div class="section-title mb-4 mt-0 pt-lg-3 um-nav-title px-2">${Language.text('my_profile')}</div>
                        ${document.body.clientWidth > 768
                            ? html` <div class="mx-auto mt-3 um-nav-container">
                                  <div class="account-options d-flex gap-3">${buttonHTML}</div>
                              </div>`
                            : html` <div class="account-navigation w-100">
                                  <nav class="nav-links mb-3 mb-md-0">
                                      <div class="nav-options d-flex flex-wrap  um-nav-mobile-tags-container px-0">${buttonHTML}</div>
                                  </nav>
                              </div>`}
                    </div>`;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (vm.loading) {
                    UmClass.getRebateInfo().then((data) => {
                        glitter.share.rebateConfig = data;
                        vm.loading = false;
                        gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }

    static spinner(obj?: {
        container?: {
            class?: string;
            style?: string;
        };
        circle?: {
            visible?: boolean;
            width?: number;
            borderSize?: number;
        };
        text?: {
            value?: string;
            visible?: boolean;
            fontSize?: number;
        };
    }) {
        const container = {
            class: `${obj?.container?.class ?? ''}`,
            style: `margin-top: 2rem ;${obj?.container?.style}`,
        };
        const circleAttr = {
            visible: obj?.circle?.visible === false ? false : true,
            width: obj?.circle?.width ?? 20,
            borderSize: obj?.circle?.borderSize ?? 16,
        };
        const textAttr = {
            value: obj?.text?.value ?? Language.text('loading'),
            visible: obj?.text?.visible === false ? false : true,
            fontSize: obj?.text?.fontSize ?? 16,
        };
        return html` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}" style="${container.style}">
            <div
                class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
                style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
                role="status"
            ></div>
            <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}" style="font-size: ${textAttr.fontSize}px;">${textAttr.value}</span>
        </div>`;
    }

    static dialog(obj: { gvc: GVC; tag: string; title?: string; innerHTML: (gvc: GVC) => string; width?: number }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html` <div
                class="bg-white shadow rounded-3"
                style="overflow-y: auto; ${document.body.clientWidth > 768 ? `width: ${obj.width || 600}px;` : `width:  ${obj.width ? `${obj.width}px` : `90vw`}; max-width: 92.5vw;`}"
            >
                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                    <div class="w-100 d-flex align-items-center p-3 border-bottom" style="position: sticky; top: 0; background: #fff;">
                        <div style="font-size: 16px; font-weight: 700; color: #292218;">${obj.title ?? ''}</div>
                        <div class="flex-fill"></div>
                        <i
                            class="fa-regular fa-circle-xmark fs-5 text-dark"
                            style="cursor: pointer"
                            onclick="${gvc.event(() => {
                                gvc.closeDialog();
                            })}"
                        ></i>
                    </div>
                    <div class="c_dialog">
                        <div class="c_dialog_body">
                            <div class="c_dialog_main" style="gap: 24px; height: auto; max-height: 500px; padding: 12px 20px;">${obj.innerHTML(gvc)}</div>
                        </div>
                    </div>
                </div>
            </div>`;
        }, obj.tag);
    }

    static async getRebateInfo() {
        return new Promise((resolve) => {
            ApiWallet.getRebateConfig({
                type: 'me',
            }).then(async (res) => {
                if (res.result && res.response.data) {
                    resolve(res.response.data);
                } else {
                    resolve({});
                }
            });
        });
    }

    static async getUserData(gvc: GVC) {
        return new Promise(async (resolve, reject) => {
            gvc.glitter.share.GlobalUser.userInfo = undefined;
            (gvc.glitter.ut.queue as any)['api-get-user_data'] = undefined;

            if (!gvc.glitter.share.GlobalUser.token) {
                gvc.glitter.share.GlobalUser.token = '';
                resolve(false);
                return;
            }

            gvc.glitter.ut.setQueue(
                'api-get-user_data',
                async (callback: any) => {
                    callback(await ApiUser.getUserData(gvc.glitter.share.GlobalUser.token, 'me'));
                },
                (r: any) => {
                    try {
                        if (!r.result) {
                            gvc.glitter.share.GlobalUser.token = '';
                            resolve(false);
                            (gvc.glitter.ut.queue as any)['api-get-user_data'] = undefined;
                        } else {
                            gvc.glitter.share.GlobalUser.userInfo = r.response;
                            gvc.glitter.share.GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response));
                            resolve(gvc.glitter.share.GlobalUser.userInfo);
                        }
                    } catch (e) {
                        resolve(false);
                        (gvc.glitter.ut.queue as any)['api-get-user_data'] = undefined;
                    }
                }
            );
        }).then((data) => {
            return data;
        });
    }

    static addStyle(gvc: GVC) {
        const globalValue = gvc.glitter.share.globalValue;
        const titleFontColor = globalValue['theme_color.0.title'] ?? '#333333';
        const contentColor = globalValue['theme_color.0.content'] ?? '#333333';
        const borderButtonBgr = globalValue['theme_color.0.border-button-bg'] ?? '#fff';
        const borderButtonText = globalValue['theme_color.0.border-button-text'] ?? '#333333';
        const solidButtonBgr = globalValue['theme_color.0.solid-button-bg'] ?? '#292218';
        const solidButtonText = globalValue['theme_color.0.solid-button-text'] ?? '#000000';

        gvc.addStyle(`
            .um-nav-title {
                font-weight: 700;
                font-size: 36px;
                color: ${titleFontColor};
            }

            .um-nav-btn {
                white-space: nowrap;
                text-align: center;
                align-items: center;
                border-radius: 22px;
                height: 44px;
                cursor: pointer;
                font-size: 16px;
                min-width: 31%;
                max-width: 180px;
                background: #ffffff;
                border: 2px solid ${borderButtonBgr};
                color: ${borderButtonText};
            }

            .um-nav-btn.um-nav-btn-active {
                background: ${borderButtonBgr};
                color: #ffffff;
                font-weight: 600;
            }

            .um-nav-mobile-tags-container {
                gap: 10px;
                overflow-x: auto;
                align-items: center;
            }

            .um-info-title {
                color: ${titleFontColor};
                font-size: 28px;
            }

            .um-info-insignia {
                border-radius: 20px;
                height: 32px;
                padding: 8px 16px;
                font-size: 14px;
                display: inline-block;
                font-weight: 600;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                vertical-align: baseline;
                background: #7e7e7e;
                color: #fff;
            }

            .um-info-note {
                color: #393939;
                font-size: 16px;
            }

            .um-info-event {
                color: #3564c0;
                font-size: 16px;
                cursor: pointer;
            }

            .um-title {
                text-align: start;
                font-size: 16px;
                font-weight: 700;
                line-height: 25.2px;
                word-wrap: break-word;
                color: ${titleFontColor};
            }

            .um-content {
                text-align: start;
                font-size: 14px;
                font-weight: 400;
                line-height: 25.2px;
                word-wrap: break-word;
                color: ${contentColor};
            }

            .um-linebar-container {
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                gap: 8px;
                display: flex;
            }

            .um-text-danger {
                color: #aa4b4b;
            }

            .um-linebar {
                border-radius: 40px;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                display: flex;
                position: relative;
                overflow: hidden;
            }

            .um-linebar-behind {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0.4;
                background: ${solidButtonBgr};
            }

            .um-linebar-fill {
                padding: 10px;
                border-radius: 10px;
                height: 100%;
            }

            .bgw-input {
                flex-grow: 1;
                padding: 9px 12px;
                border-radius: 10px;
                border: 1px solid ${borderButtonBgr};
                background: #ffffff;
                appearance: none;
                width: 100%;
                min-height: 44px;
            }

            .bgw-input[type=date]{
                color: rgba(0,0,0,0);
            }

            .bgw-input[type=date]::before {
                content: attr(data-placeholder);
                position: absolute;
                color: #8d8d8d;
                pointer-events: none;
                font-size: 15px;
            }
    
            .bgw-input:focus {
                outline: 0;
            }

            .bgw-input-readonly:focus-visible {
                outline: 0;
            }

            .um-rb-bgr {
                background: whitesmoke;
                justify-content: space-between;
                gap: 18px;
            }

            .um-rb-amount {
                display: flex;
                align-items: center;
                font-size: 32px;
                line-height: 32px;
            }

            .um-container {
                display: flex;
                justify-content: center;
                margin: 2rem auto;
                width: 100%;
            }

            .um-th-bar {
                justify-content: space-around;
                align-items: center;
                height: 40px;
            }

            .um-th {
                text-align: start;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                color: ${titleFontColor};
            }

            .um-td-bar {
                justify-content: space-around;
                align-items: center;
                height: 40px;
                border-bottom: 1px solid #e2d6cd;
            }

            .um-td {
                text-align: start;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                color: ${titleFontColor};
            }

            .um-mobile-area {
                padding: 28px;
                margin-top: 12px;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                justify-content: center;
                align-items: flex-start;
                display: flex;
                flex-direction: column;
                gap: 12px;
                border: 1px solid ${titleFontColor};
            }

            .um-mobile-text {
                text-align: start;
                font-size: 16px;
                font-weight: 400;
                line-height: 22.4px;
                letter-spacing: 0.64px;
                word-wrap: break-word;
                color: ${titleFontColor};
            }

            .um-img-bgr {
                padding-bottom: 100%;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }

            .um-card-title {
                font-weight: 600;
                color: ${titleFontColor};
            }

            .um-icon-container {
                position: absolute;
                right: 10px;
                top: 10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: white;
                color: black;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .card-sale-price {
                font-style: normal;
                line-height: normal;
                font-size: 16px;
                opacity: 0.9;
                color: #322b25;
            }

            .card-cost-price {
                color: #d45151;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                font-size: 14px;
                margin-right: 4px;
                letter-spacing: -0.98px;
            }
            .gray-line {
                border-bottom: 1px solid #dddddd;
                padding-bottom: 6px;
                margin-bottom: 6px;
            }
            .um-insignia {
                border-radius: 0.5rem;
                height: 26px;
                padding: 6px 8px;
                font-size: 14px;
                display: inline-block;
                font-weight: 500;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                vertical-align: baseline;
            }
            .um-insignia-secondary {
                background: #8d8d8d;
                color: #ffffff;
            }
            

            @media (min-width: 576px) {
                .um-container {
                    max-width: 540px;
                }
            }

            @media (min-width: 768px) {
                .um-container {
                    max-width: 720px;
                }

                .um-nav-btn {
                    min-width: 110px;
                    font-size: 14px;
                    height: 40px;
                }

                .um-nav-title {
                    font-size: 30px;
                }

                .um-rb-amount {
                    font-size: 36px;
                    line-height: 36px;
                }
            }

            @media (min-width: 992px) {
                .um-container {
                    max-width: 800px;
                }
            }

            @media (min-width: 1200px) {
                .um-container {
                    max-width: 860px;
                }
            }

            @media (min-width: 1400px) {
                .um-container {
                    max-width: 960px;
                }
            }
        `);
    }

    static jumpAlert(obj: { gvc: GVC; text: string; justify: 'top' | 'bottom'; align: 'left' | 'center' | 'right'; timeout?: number; width?: number }) {
        const className = Tool.randomString(5);
        const fixedStyle = (() => {
            let style = '';
            if (obj.justify === 'top') {
                style += `top: 90px;`;
            } else if (obj.justify === 'bottom') {
                style += `bottom: 24px;`;
            }
            if (obj.align === 'left') {
                style += `left: 12px;`;
            } else if (obj.align === 'center') {
                style += `left: 50%; right: 50%;`;
            } else if (obj.align === 'right') {
                style += `right: 12px;`;
            }
            return style;
        })();
        const transX = obj.align === 'center' ? '-50%' : '0';

        obj.gvc.addStyle(`
            .bounce-effect-${className} {
                animation: bounce 0.5s alternate;
                animation-iteration-count: 2;
                position: fixed;
                ${fixedStyle}
                background-color: #393939;
                opacity: 0.85;
                color: white;
                padding: 10px;
                border-radius: 8px;
                width: ${obj.width ?? 120}px;
                text-align: center;
                z-index: 100001;
                transform: translateX(${transX});
            }

            @keyframes bounce {
                0% {
                    transform: translate(${transX}, 0);
                }
                100% {
                    transform: translate(${transX}, -6px);
                }
            }
        `);

        const htmlString = html` <div class="bounce-effect-${className}">${obj.text}</div>`;
        obj.gvc.glitter.document.body.insertAdjacentHTML('beforeend', htmlString);
        setTimeout(() => {
            const element = document.querySelector(`.bounce-effect-${className}`) as HTMLElement;
            if (element) {
                element.remove();
            }
        }, obj.timeout ?? 2000);
    }

    static validImageBox(obj: { gvc: GVC; image: string; width: number; height?: number; class?: string; style?: string }) {
        const imageVM = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            url: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
        };
        const wh = `
            display: flex;
            min-width: ${obj.width}px;
            min-height: ${obj.height ?? obj.width}px;
            max-width: ${obj.width}px;
            max-height: ${obj.height ?? obj.width}px;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        `;
        return obj.gvc.bindView({
            bind: imageVM.id,
            view: () => {
                if (imageVM.loading) {
                    return obj.gvc.bindView(() => {
                        return {
                            bind: obj.gvc.glitter.getUUID(),
                            view: () => {
                                return UmClass.spinner({
                                    container: { class: 'mt-0' },
                                    text: { visible: false },
                                });
                            },
                            divCreate: {
                                style: `${wh}${obj.style ?? ''}`,
                                class: obj.class ?? '',
                            },
                        };
                    });
                } else {
                    return obj.gvc.bindView(() => {
                        return {
                            bind: obj.gvc.glitter.getUUID(),
                            view: () => {
                                return '';
                            },
                            divCreate: {
                                elem: 'img',
                                style: `${wh}${obj.style ?? ''}`,
                                class: obj.class ?? '',
                                option: [
                                    {
                                        key: 'src',
                                        value: imageVM.url,
                                    },
                                ],
                            },
                        };
                    });
                }
            },
            onCreate: () => {
                function isImageUrlValid(url: string): Promise<boolean> {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                        img.src = url;
                    });
                }

                if (imageVM.loading) {
                    isImageUrlValid(obj.image).then((isValid) => {
                        if (isValid) {
                            imageVM.url = obj.image;
                        }
                        imageVM.loading = false;
                        obj.gvc.notifyDataChange(imageVM.id);
                    });
                }
            },
        });
    }
}
