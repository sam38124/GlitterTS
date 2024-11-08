import {GVC} from '../../glitterBundle/GVController.js';
import {ApiUser} from '../../glitter-base/route/user.js';
import {GlobalUser} from '../../glitter-base/global/global-user.js';
import {Tool} from '../../modules/tool.js';
import {BgWidget} from "../../backend-manager/bg-widget.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";

const html = String.raw;

export class UmClass {
    static nav(gvc: GVC) {
        this.addStyle(gvc);
        let changePage = (index: string, type: 'page' | 'home', subData: any) => {
        };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });

        const pageName = gvc.glitter.getUrlParameter('page');
        const buttonHTML = [
            {
                key: 'account_userinfo',
                title: '個人資料',
            },
            {
                key: 'voucher-list',
                title: '我的優惠券',
            },
            {
                key: 'rebate',
                title: '我的購物金',
            },
            {
                key: 'order_list',
                title: '訂單記錄',
            },
            {
                key: 'wishlist',
                title: '心願單',
            },
            {
                key: 'reset_password',
                title: '重設密碼',
            },
            {
                key: 'logout',
                title: '登出',
            },
        ]
            .map((item) => {
                return html`
                    <div
                            class="option px-4 d-flex justify-content-center um-nav-btn ${pageName === item.key ? 'um-nav-btn-active' : ''}"
                            onclick="${gvc.event(async () => {
                                if (item.key === 'reset_password') {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.dataLoading({visible: true});
                                    const userData:any = (await UmClass.getUserData(gvc));
                                    dialog.dataLoading({visible: false});
                                    UmClass.dialog({
                                        gvc: gvc,
                                        title: '重設密碼事件',
                                        tag: '',
                                        innerHTML: (gvc: GVC) => {
                                            let update_vm = {
                                                verify_code: '',
                                                pwd: ''
                                            }
                                            let get_verify_timer = 0;
                                            let repeat_pwd = ''
                                            return [
                                                html`<div class="tx_normal fw-normal mb-1" style="">密碼</div>`,
                                                html`<input class="bgw-input " style="" type="password"
                                                            placeholder="請輸入密碼"
                                                            oninput="${gvc.event((e, event) => {
                                                                update_vm.pwd = e.value;
                                                            })}" value="${update_vm.pwd}">`,
                                                html`<div class="tx_normal fw-normal mt-2 mb-1" style="">確認密碼</div>`,
                                                html`<input class="bgw-input mb-2" style="" type="password"
                                                            placeholder="請再次輸入密碼"
                                                            oninput="${gvc.event((e, event) => {
                                                                repeat_pwd = e.value;
                                                })}" value="${repeat_pwd}">`,
                                                gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return html`重設密碼驗證碼
                                                                ${BgWidget.blueNote(
                                                                    get_verify_timer ? `驗證碼已發送至『${userData.userData.email}』` : '點我取得驗證碼',
                                                                    gvc.event(() => {
                                                                        if (!get_verify_timer) {
                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                            dialog.dataLoading({visible: true});
                                                                            ApiUser.emailVerify(userData.userData.email, (window as any).appName).then(async (r) => {
                                                                                dialog.dataLoading({visible: false});
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
                                                html`<input class="bgw-input mt-2 mb-4" style="" type="text"
                                                            placeholder="請輸入驗證碼"
                                                            oninput="${gvc.event((e, event) => {
                                                                update_vm.verify_code = e.value;
                                                })}" value="${  update_vm.verify_code}">`,
                                                    `<div class="d-flex align-items-center justify-content-end pt-2 border-top mx-n3">
<div class="um-nav-btn um-nav-btn-active d-flex align-items-center justify-content-center" style="cursor:pointer;" type="button" onclick="${gvc.event(()=>{
    
                                                        if (update_vm.pwd.length < 8) {
                                                            dialog.errorMessage({text: '密碼必須大於8位數'})
                                                            return
                                                        }
                                                        if (repeat_pwd !== update_vm.pwd) {
                                                            dialog.errorMessage({text: '請再次確認密碼'})
                                                            return
                                                        }
                                                        dialog.dataLoading({visible: true});
                                                        ApiUser.updateUserData({
                                                            userData: update_vm,
                                                        }).then((res) => {
                                                            dialog.dataLoading({ visible: false });
                                                            if (!res.result && res.response.data.msg === 'email-verify-false') {
                                                                dialog.errorMessage({ text: '信箱驗證碼輸入錯誤' });
                                                            } else if (!res.result && res.response.data.msg === 'phone-verify-false') {
                                                                dialog.errorMessage({ text: '簡訊驗證碼輸入錯誤' });
                                                            } else if (!res.result && res.response.data.msg === 'phone-exists') {
                                                                dialog.errorMessage({ text: '此電話號碼已存在' });
                                                            } else if (!res.result && res.response.data.msg === 'email-exists') {
                                                                dialog.errorMessage({ text: '此信箱已存在' });
                                                            } else if (!res.result) {
                                                                dialog.errorMessage({ text: '更新異常' });
                                                            } else {
                                                                dialog.successMessage({ text: '更改成功' });
                                                                gvc.closeDialog()
                                                            }
                                                        })
                                                    })}">
                <span class="tx_700_white">確認重設</span>
            </div>
</div>`
                                            ].join('');
                                        }
                                    })
                                    console.log('重設密碼事件');
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

        return html`
            <div class="account-section">
                <div class="section-title mb-4 mt-0 pt-lg-3 um-nav-title">我的帳號</div>
                ${document.body.clientWidth > 768
                        ? html`
                            <div class="mx-auto mt-3 um-nav-container">
                                <div class="account-options d-flex gap-3">${buttonHTML}</div>
                            </div>`
                        : html`
                            <div class="account-navigation w-100">
                                <nav class="nav-links mb-3 mb-md-0">
                                    <div class="nav-options d-flex flex-wrap um-nav-mobile-tags-container">
                                        ${buttonHTML}
                                    </div>
                                </nav>
                            </div>`}
            </div>`;
    }

    static spinner(height?: string): string {
        return html`
            <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto"
                 style="height: ${height ?? '100vh'}">
                <div class="spinner-border" role="status"></div>
                <span class="mt-3">載入中</span>
            </div>`;
    }

    static dialog(obj: { gvc: GVC; tag: string; title?: string; innerHTML: (gvc: GVC) => string }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html`
                <div
                        class="bg-white shadow rounded-3"
                        style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: 600px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
                >
                    <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                        <div class="w-100 d-flex align-items-center p-3 border-bottom"
                             style="position: sticky; top: 0; background: #fff;">
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
                                <div class="c_dialog_main"
                                     style="gap: 24px; height: auto; max-height: 500px; padding: 12px 20px;">
                                    ${obj.innerHTML(gvc)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }, obj.tag);
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

    static async addStyle(gvc: GVC) {
        const css = String.raw;
        gvc.addStyle(css`
            .um-nav-title {
                font-weight: 700;
                font-size: 36px;
                color: #292218;
            }

            .um-nav-btn {
                white-space: nowrap;
                text-align: center;
                border: 2px solid #232323;
                align-items: center;
                border-radius: 22px;
                height: 44px;
                cursor: pointer;
                width: 108px;
                font-size: 16px;
            }

            .um-nav-btn.um-nav-btn-active {
                background: #292218;
                color: #ffffff;
                font-weight: 600;
            }

            .um-nav-mobile-tags-container {
                gap: 10px;
                overflow-x: auto;
                align-items: center;
            }

            .um-info-title {
                color: #000000;
                font-size: 28px;
            }

            .um-info-insignia {
                border-radius: 20px;
                height: 32px;
                padding: 8px 16px;
                font-size: 14px;
                display: inline-block;
                font-weight: 500;
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
                color: #292218;
            }

            .um-content {
                text-align: start;
                font-size: 14px;
                font-weight: 400;
                line-height: 25.2px;
                word-wrap: break-word;
                color: #292218;
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
                background: #292218;
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
                border: 1px solid #393939;
                background-color: #ffffff;
                appearance: none;
                width: 100%;
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
                color: #292218;
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
                color: #292218;
            }

            .um-mobile-area {
                padding: 28px;
                margin-top: 12px;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                border: 1px solid;
                justify-content: center;
                align-items: flex-start;
                display: flex;
                flex-direction: column;
                gap: 12px;
                border: 1px solid #292218;
            }

            .um-mobile-text {
                text-align: start;
                font-size: 16px;
                font-weight: 400;
                line-height: 22.4px;
                letter-spacing: 0.64px;
                word-wrap: break-word;
                color: #292218;
            }

            .um-img-bgr {
                padding-bottom: 100%;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }

            .um-card-title {
                font-weight: 600;
                color: #292218;
            }

            .um-icon-container {
                position: absolute;
                right: 10px;
                top: 10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: white;
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
                    width: 110px;
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

    static jumpAlert(obj: {
        gvc: GVC;
        text: string;
        justify: 'top' | 'bottom';
        align: 'left' | 'center' | 'right';
        timeout?: number;
        width?: number
    }) {
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

        const htmlString = html`
            <div class="bounce-effect-${className}">${obj.text}</div>`;
        obj.gvc.glitter.document.body.insertAdjacentHTML('beforeend', htmlString);
        setTimeout(() => {
            const element = document.querySelector(`.bounce-effect-${className}`) as HTMLElement;
            if (element) {
                element.remove();
            }
        }, obj.timeout ?? 2000);
    }
}
