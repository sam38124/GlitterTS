import { GVC } from '../../glitterBundle/GVController.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';

const html = String.raw;

export class UmClass {
    static nav(gvc: GVC) {
        this.addStyle(gvc);
        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
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
                key: 'rebate',
                title: '商店購物金',
            },
            {
                key: 'order_list',
                title: '訂單記錄',
            },
            {
                key: 'wish_container',
                title: '心願單',
            },
            {
                key: 'reset_password',
                title: '修改密碼',
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
                        onclick="${gvc.event(() => {
                            if (item.key === 'reset_password') {
                                console.log('修改密碼事件');
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
            <div class="section-title mb-4 mt-0 pt-lg-3 um-nav-title">我的帳號</div>
            ${document.body.clientWidth > 768
                ? html`<div class="mx-auto mt-3 um-nav-container">
                      <div class="account-options d-flex gap-4">${buttonHTML}</div>
                  </div>`
                : html`<div class="account-navigation w-100">
                      <nav class="nav-links mb-3 mb-md-0">
                          <div class="nav-options d-flex flex-wrap um-nav-mobile-tags-container">${buttonHTML}</div>
                      </nav>
                  </div>`}
        </div>`;
    }

    static spinner() {
        return html`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto" style="height: 100vh">
            <div class="spinner-border" role="status"></div>
            <span class="mt-3">載入中</span>
        </div>`;
    }

    static dialog(obj: { gvc: GVC; tag: string; title?: string; innerHTML: string }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html` <div
                class="bg-white shadow rounded-3"
                style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: 600px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
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
                            <div class="c_dialog_main" style="gap: 24px; height: auto; max-height: 500px; padding: 12px 20px;">${obj.innerHTML}</div>
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
                width: 120px;
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
                font-size: 36px;
                line-height: 36px;
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
}
