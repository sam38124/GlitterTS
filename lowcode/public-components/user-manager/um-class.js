var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from '../../glitter-base/route/user.js';
const html = String.raw;
export class UmClass {
    static nav(gvc) {
        gvc.addStyle(`
            .um-nav-container {
                width: 1000px;
                max-width: 100%;
            }
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
            @media (max-width: 768px) {
                .um-nav-btn {
                    width: 110px;
                    font-size: 14px;
                    height: 40px;
                }
                .um-nav-title {
                    font-size: 30px;
                }
            }
        `);
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
                key: 'orderlist',
                title: '訂單記錄',
            },
            {
                key: 'wishlist',
                title: '心願單',
            },
            {
                key: 'logout',
                title: '登出',
            },
        ]
            .map((item) => {
            return html `
                    <div
                        class="option px-4 d-flex justify-content-center um-nav-btn ${pageName === item.key ? 'um-nav-btn-active' : ''}"
                        onclick="${gvc.event(() => {
                console.log(item.key);
            })}"
                    >
                        ${item.title}
                    </div>
                `;
        })
            .join('');
        return html ` <div class="account-section">
            <div class="section-title mb-4 mt-0 pt-lg-3 um-nav-title">我的帳號</div>
            ${document.body.clientWidth > 768
            ? html `<div class="mx-auto mt-3 um-nav-container">
                      <div class="account-options d-flex gap-4">${buttonHTML}</div>
                  </div>`
            : html `<div class="account-navigation w-100">
                      <nav class="nav-links mb-3 mb-md-0">
                          <div class="nav-options d-flex flex-wrap um-nav-mobile-tags-container">${buttonHTML}</div>
                      </nav>
                  </div>`}
        </div>`;
    }
    static spinner() {
        return html `<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
            <div class="spinner-border" role="status"></div>
            <span class="mt-3">載入中</span>
        </div>`;
    }
    static dialog(obj) {
        return obj.gvc.glitter.innerDialog((gvc) => {
            var _a;
            return html ` <div
                class="bg-white shadow rounded-3"
                style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: 600px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
            >
                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
                    <div class="w-100 d-flex align-items-center p-3 border-bottom" style="position: sticky; top: 0; background: #fff;">
                        <div style="font-size: 16px; font-weight: 700; color: #292218;">${(_a = obj.title) !== null && _a !== void 0 ? _a : ''}</div>
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
    static getUserData(gvc) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                gvc.glitter.share.GlobalUser.userInfo = undefined;
                gvc.glitter.ut.queue['api-get-user_data'] = undefined;
                if (!gvc.glitter.share.GlobalUser.token) {
                    gvc.glitter.share.GlobalUser.token = '';
                    resolve(false);
                    return;
                }
                gvc.glitter.ut.setQueue('api-get-user_data', (callback) => __awaiter(this, void 0, void 0, function* () {
                    callback(yield ApiUser.getUserData(gvc.glitter.share.GlobalUser.token, 'me'));
                }), (r) => {
                    try {
                        if (!r.result) {
                            gvc.glitter.share.GlobalUser.token = '';
                            resolve(false);
                            gvc.glitter.ut.queue['api-get-user_data'] = undefined;
                        }
                        else {
                            gvc.glitter.share.GlobalUser.userInfo = r.response;
                            gvc.glitter.share.GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response));
                            resolve(gvc.glitter.share.GlobalUser.userInfo);
                        }
                    }
                    catch (e) {
                        resolve(false);
                        gvc.glitter.ut.queue['api-get-user_data'] = undefined;
                    }
                });
            })).then((data) => {
                return data;
            });
        });
    }
}
