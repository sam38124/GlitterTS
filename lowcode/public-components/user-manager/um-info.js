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
import { ApiUser } from '../../glitter-base/route/user.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { FormCheck } from '../../cms-plugin/module/form-check.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Language } from '../../glitter-base/global/language.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
const html = String.raw;
export class UMInfo {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const vm = {
            data: {},
            memberNext: {},
            resetPassword: false,
        };
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                }
                else {
                    try {
                        return html `
              <div class="row">
                <div class="col-12  align-items-center d-none d-lg-flex" style="gap:10px;">
                  <div style="background: #FF9705;width:4px;height: 20px;"></div>
                  <div class="um-info-title fw-bold" style="font-size: 24px;">
                    ${Language.text('account_user_info')}
                  </div>
                </div>
                <div style="margin-top:24px;" class="col-12">
                  <div
                    class="w-100 p-3"
                    style="background: white; border-radius: 10px; outline: 1px #DDDDDD solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: inline-flex"
                  >
                    <div
                      class="d-flex flex-column-reverse flex-lg-row "
                      style="align-self: stretch; justify-content: flex-start; align-items: center; ${document.body
                            .clientWidth > 800
                            ? `gap: 28px;`
                            : `gap: 14px;`} display: inline-flex"
                    >
                      <div
                        class="${document.body.clientWidth < 800 ? 'w-100' : ''}"
                        style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: flex-start;  display: inline-flex;${document
                            .body.clientWidth < 800
                            ? ''
                            : ''}"
                      >
                        <div
                          style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 6px; display: flex"
                        >
                          <div
                            style="align-self: stretch; color: #393939; font-size: 24px;  font-weight: 700; word-wrap: break-word"
                          >
                            ${vm.data.userData.name}
                          </div>
                          <div style="justify-content: flex-start; align-items: center; gap: 6px; display: inline-flex">
                            <div
                              style="width: auto; height: 22px; padding: 4px 6px;background: #393939; border-radius: 7px; justify-content: center; align-items: center; gap: 10px; display: flex"
                            >
                              <div style="color: white; font-size: 14px;  font-weight: 700; word-wrap: break-word">
                                ${(() => {
                            const mem = vm.data.member.find(d => {
                                return d.trigger;
                            });
                            return mem ? mem.tag_name : Language.text('normal_member');
                        })()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="${document.body.clientWidth < 800 ? 'w-100' : ''}"
                          style="width: 463px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex"
                        >
                          <div class="w-100">
                            ${(() => {
                            var _a;
                            if (!vm.memberNext || !vm.memberNext.leak) {
                                return '';
                            }
                            const solidButtonBgr = `#FF9705`;
                            return html ` <div class="um-title mb-1 mt-2">
                                  ${Language.text('current_accumulated_spending_amount')}
                                </div>
                                <div class="w-100 um-linebar-container">
                                  <div class="d-flex w-100 justify-content-between align-items-center">
                                    <div class="um-content">NT. ${((_a = vm.memberNext.sum) !== null && _a !== void 0 ? _a : 0).toLocaleString()}</div>
                                    <div class="um-content um-text-danger">
                                      ${Language.text('distance_from_target_amount')}
                                      NT.${vm.memberNext.leak.toLocaleString()} ${Language.text('can_upgrade')}
                                    </div>
                                  </div>
                                  <div class="w-100 um-linebar">
                                    <div class="um-linebar-behind"></div>
                                    <div
                                      class="um-linebar-fill"
                                      style="${(() => {
                                const sum = vm.memberNext.sum;
                                const leak = vm.memberNext.leak;
                                return `
                                          background: ${solidButtonBgr};
                                          width: ${sum ? (sum * 100) / (leak + sum) : 0}%;
                                          z-index: 10;
                                        `;
                            })()}"
                                    ></div>
                                  </div>
                                </div>`;
                        })()}
                          </div>
                          <div
                            class="w-100"
                            style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex"
                          >
                            ${[
                            (() => {
                                if (vm.data.member_level.dead_line &&
                                    typeof vm.data.member_level.dead_line === 'string') {
                                    return `＊ ${Language.text('membership_expiry_date')} ${vm.data.member_level.dead_line.substring(0, 10).replace(/-/g, '/')}`;
                                }
                                return '';
                            })(),
                            (() => {
                                try {
                                    if (vm.data.member_level.re_new_member.trigger) {
                                        return `＊ ${Language.text('renewal_criteria_met')}`;
                                    }
                                    if (vm.data.member_level.re_new_member.og.condition.type === 'total') {
                                        return `＊ ${Language.text('spend_again')} NT.${Number(vm.data.member_level.re_new_member.leak).toLocaleString()} ${Language.text('can_meet_renewal_criteria')}`;
                                    }
                                    return `＊ ${Language.text('single_purchase_over')} NT.${Number(vm.data.member_level.re_new_member.leak).toLocaleString()} ${Language.text('can_meet_renewal_criteria')}`;
                                }
                                catch (_a) {
                                    return '';
                                }
                            })(),
                            (() => {
                                if (!vm.memberNext) {
                                    return '';
                                }
                                const condition_val = vm.memberNext.og.condition.value.toLocaleString();
                                if (vm.memberNext.og.condition.type !== 'total') {
                                    return `＊ ${Language.text('single_purchase_reaches')} NT.${condition_val} ${Language.text('upgrade_to')} ${vm.memberNext.tag_name}`;
                                }
                                if (vm.memberNext.og.duration.type === 'noLimit') {
                                    return `＊ ${Language.text('accumulated_spending_reaches')} NT.${condition_val} ${Language.text('upgrade_to')} ${vm.memberNext.tag_name}`;
                                }
                                return html `＊ ${vm.memberNext.og.duration.value} ${Language.text('days')}
                                ${Language.text('accumulated_spending_reaches')} NT.${condition_val}
                                ${Language.text('upgrade_to')} ${vm.memberNext.tag_name}`;
                            })(),
                        ]
                            .map(str => {
                            return str.length > 0
                                ? html ` <div class="um-info-note" style="font-size: 14px;">${str}</div> `
                                : '';
                        })
                            .join('')}

                            <div
                              class="um-info-event"
                              style="align-self: stretch;font-size: 14px;  font-weight: 400; word-wrap: break-word"
                              onclick="${gvc.event(() => {
                            UmClass.dialog({
                                gvc,
                                tag: 'level-of-detail',
                                title: Language.text('rules_explanation'),
                                innerHTML: (gvc) => {
                                    return html ` <div
                                        class="mt-1 pb-2 ${vm.data.member.length > 0 ? 'border-bottom' : ''}"
                                      >
                                        <div class="um-title">${Language.text('membership_level_rules')}</div>
                                        <div class="um-content">
                                          ${Language.text('if_renewal_criteria_not_met_within_membership_period')}
                                        </div>
                                      </div>
                                      ${(() => {
                                        const members = JSON.parse(JSON.stringify(vm.data.member));
                                        members.pop();
                                        return members
                                            .reverse()
                                            .map(leadData => {
                                            const detail = (() => {
                                                const condition_val = parseInt(`${leadData.og.condition.value}`, 10).toLocaleString();
                                                if (leadData.og.condition.type === 'total') {
                                                    if (leadData.og.duration.type === 'noLimit') {
                                                        return `${Language.text('accumulated_spending_reaches')} NT.${condition_val} ${Language.text('upgrade_to')} ${leadData.tag_name}`;
                                                    }
                                                    else {
                                                        return html `${leadData.og.duration.value} ${Language.text('days')}
                                                  ${Language.text('accumulated_spending_reaches')} NT.${condition_val}
                                                  ${Language.text('upgrade_to')} ${leadData.tag_name}`;
                                                    }
                                                }
                                                else {
                                                    return `${Language.text('single_purchase_reaches')} NT.${condition_val} ${Language.text('upgrade_to')} ${leadData.tag_name}`;
                                                }
                                            })();
                                            return html `
                                              <div class="mt-3">
                                                <div class="um-title">${leadData.tag_name}</div>
                                                <div class="um-content">${detail}</div>
                                              </div>
                                            `;
                                        })
                                            .join('');
                                    })()}`;
                                },
                            });
                        })}"
                            >
                              ${Language.text('view_membership_level_rules')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="d-flex flex-column align-items-center justify-content-center "
                        style="${document.body.clientWidth < 800
                            ? `width: 100%;`
                            : `width: 344.77px; `}cursor: pointer;"
                        onclick="${gvc.event(() => {
                            UmClass.dialog({
                                gvc,
                                tag: 'user-qr-code',
                                title: Language.text('membership_barcode'),
                                innerHTML: gvc => {
                                    return gvc.bindView((() => {
                                        const id = glitter.getUUID();
                                        let loading = true;
                                        let img = '';
                                        return {
                                            bind: id,
                                            view: () => {
                                                if (loading) {
                                                    return UmClass.spinner({
                                                        container: {
                                                            style: 'height: 100%;',
                                                        },
                                                    });
                                                }
                                                else {
                                                    return html ` <div style="text-align: center; vertical-align: middle;">
                                          <img src="${img}" />
                                        </div>`;
                                                }
                                            },
                                            divCreate: {},
                                            onCreate: () => {
                                                if (loading) {
                                                    glitter.addMtScript([
                                                        {
                                                            src: 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js',
                                                        },
                                                    ], () => {
                                                        const si = setInterval(() => {
                                                            const qr = window.QRCode;
                                                            if (qr) {
                                                                qr.toDataURL(`user-${vm.data.userID}`, {
                                                                    width: 400,
                                                                    margin: 2,
                                                                }, (err, url) => {
                                                                    if (err) {
                                                                        console.error(err);
                                                                        return;
                                                                    }
                                                                    img = url;
                                                                    loading = false;
                                                                    gvc.notifyDataChange(id);
                                                                });
                                                                clearInterval(si);
                                                            }
                                                        }, 300);
                                                    }, () => { });
                                                }
                                            },
                                        };
                                    })());
                                },
                            });
                        })}"
                      >
                        <div style=" color: #393939; font-size: 18px;  font-weight: 700; word-wrap: break-word">
                          ${Language.text('membership_barcode')}
                        </div>
                        ${(() => {
                            return gvc.bindView(() => {
                                return {
                                    bind: gvc.glitter.getUUID(),
                                    view: () => {
                                        return ``;
                                    },
                                    divCreate: {
                                        elem: 'svg',
                                        class: ``,
                                        option: [
                                            {
                                                key: 'id',
                                                value: 'barcode',
                                            },
                                        ],
                                    },
                                    onCreate: () => {
                                        gvc.glitter.addMtScript([`https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js`], () => {
                                            JsBarcode(document.querySelector('#barcode'), `user-${vm.data.userID}`, {
                                                format: 'CODE128',
                                                lineColor: '#000000',
                                                width: 2,
                                                height: 50,
                                                displayValue: true,
                                            });
                                        }, () => { });
                                    },
                                };
                            });
                        })()}
                      </div>
                    </div>
                    <div
                      style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 12px; display: inline-flex"
                    >
                      ${[
                            {
                                title: glitter.share.rebateConfig.title || Language.text('shopping_credit'),
                                value: gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    let sum = '-';
                                    ApiShop.getRebate({}).then(res => {
                                        sum = res.response.sum.toLocaleString();
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            return sum;
                                        },
                                        divCreate: {
                                            style: `align-self: stretch; text-align: center; color: #393939; font-size: 20px;  font-weight: 700; line-height: 28px; word-wrap: break-word`,
                                        },
                                    };
                                }),
                            },
                            {
                                title: Language.text('coupons'),
                                value: gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    let sum = '-';
                                    ApiShop.getVoucher({
                                        page: 0,
                                        limit: 10000,
                                        data_from: 'user',
                                    }).then(res => {
                                        sum = res.response.data
                                            .filter((item) => item.content.trigger === 'code')
                                            .length.toLocaleString();
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            return sum;
                                        },
                                        divCreate: {
                                            style: `align-self: stretch; text-align: center; color: #393939; font-size: 20px;  font-weight: 700; line-height: 28px; word-wrap: break-word`,
                                        },
                                    };
                                }),
                            },
                            {
                                title: Language.text('wait_ship'),
                                value: gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    let sum = '-';
                                    ApiShop.getOrder({
                                        limit: 1,
                                        page: 0,
                                        filter: {
                                            progress: ['in_stock', 'wait'],
                                        },
                                        data_from: 'user',
                                    }).then((res) => {
                                        sum = res.response.total.toLocaleString();
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            return sum;
                                        },
                                        divCreate: {
                                            style: `align-self: stretch; text-align: center; color: #393939; font-size: 20px;  font-weight: 700; line-height: 28px; word-wrap: break-word`,
                                        },
                                    };
                                }),
                            },
                            {
                                title: Language.text('shipped'),
                                value: gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    let sum = '-';
                                    ApiShop.getOrder({
                                        limit: 1,
                                        page: 0,
                                        filter: {
                                            progress: ['shipping'],
                                        },
                                        data_from: 'user',
                                    }).then((res) => {
                                        sum = res.response.total.toLocaleString();
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            return sum;
                                        },
                                        divCreate: {
                                            style: `align-self: stretch; text-align: center; color: #393939; font-size: 20px;  font-weight: 700; line-height: 28px; word-wrap: break-word`,
                                        },
                                    };
                                }),
                            },
                        ]
                            .map(dd => {
                            return `<div
                        style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex"
                      >
                        ${dd.value}
                        <div
                          style="align-self: stretch; text-align: center; color: #393939; font-size: 16px;  font-weight: 400; line-height: 22.40px; word-wrap: break-word"
                        >
                          ${dd.title}
                        </div>
                      </div>`;
                        })
                            .join(`<div class="border-end" style="width:1px;height: 30px;"></div>`)}
                    </div>
                  </div>
                </div>
                <div class="col-12" style="margin-top: 24px;">
                  <div
                    class="w-100"
                    style="padding: 24px 20px;background: white; border-radius: 10px; outline: 1px #DDDDDD solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; gap: 28px; display: inline-flex"
                  >
                    ${[
                            {
                                title: Language.text('member_info'),
                                icon: '<i class="fa-solid fa-address-book fs-3"></i>',
                                event: () => {
                                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                                        cl.changePage('account_edit', 'page', {});
                                    });
                                },
                            },
                            {
                                title: Language.text('order_history'),
                                icon: `<i class="fa-solid fa-square-list fs-3"></i>`,
                                event: () => {
                                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                                        cl.changePage('order_list', 'home', {});
                                    });
                                },
                            },
                            {
                                title: Language.text('wishlist'),
                                icon: `<i class="fa-solid fa-heart fs-3"></i>`,
                                event: () => {
                                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                                        cl.changePage('wishlist', 'home', {});
                                    });
                                },
                            },
                        ]
                            .map((dd) => {
                            return `
                    <div
                      style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex;cursor:pointer;"
                      onclick="${gvc.event(() => {
                                dd.event();
                            })}">
                     ${dd.icon}
                      <div
                        style="font-size:16px;" class="fw-500">
                        ${dd.title}
                      </div>
                    </div>
                 `;
                        })
                            .join('')}
                  </div>
                </div>
              </div>
            `;
                    }
                    catch (error) {
                        console.error('User Member Info Error: ', error);
                        return UmClass.spinner();
                    }
                }
            },
            divCreate: {},
            onCreate: () => {
                if (loadings.view) {
                    UmClass.getUserData(gvc).then((resp) => {
                        try {
                            vm.data = resp;
                            const members = JSON.parse(JSON.stringify(vm.data.member)).reverse();
                            vm.memberNext = members.find(dd => !dd.trigger);
                            loadings.view = false;
                            gvc.notifyDataChange(ids.view);
                        }
                        catch (e) {
                            gvc.glitter.href = './login';
                        }
                    });
                }
            },
        });
    }
    static edit(gvc) {
        const vm = {
            data: {},
            memberNext: {},
            resetPassword: false,
        };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm_info = {
                loading: true,
                list: [],
                form_array: [],
                login_config: {},
            };
            let update_userData = {};
            function loadConfig() {
                var _a, _b, _c, _d, _e;
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        vm_info.loading = true;
                        const [res, data, userSeeting, userData] = yield Promise.all([
                            ApiUser.getPublicConfig('custom_form_register', 'manager'),
                            ApiUser.getPublicConfig('login_config', 'manager'),
                            ApiUser.getPublicConfig('customer_form_user_setting', 'manager'),
                            UmClass.getUserData(gvc),
                        ]);
                        const defaultList = { list: [] };
                        vm_info.login_config = (_a = data.response.value) !== null && _a !== void 0 ? _a : {};
                        vm_info.list = [
                            ...((_c = (_b = res.response.value) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : defaultList.list),
                            ...((_e = (_d = userSeeting.response.value) === null || _d === void 0 ? void 0 : _d.list) !== null && _e !== void 0 ? _e : defaultList.list),
                        ];
                        vm_info.form_array = FormCheck.initialRegisterForm(vm_info.list).filter((dd) => !dd.hidden);
                        vm.data = userData;
                        vm_info.loading = false;
                        update_userData = JSON.parse(JSON.stringify(vm.data.userData));
                        gvc.notifyDataChange(id);
                    }
                    catch (error) {
                        console.error('載入設定時發生錯誤:', error);
                        vm_info.loading = false;
                    }
                });
            }
            loadConfig();
            return {
                bind: id,
                view: () => {
                    if (vm_info.loading) {
                        return UmClass.spinner();
                    }
                    const form_array = JSON.parse(JSON.stringify(vm_info.form_array));
                    if (update_userData.email !== vm.data.userData.email && vm_info.login_config.email_verify) {
                        form_array.splice(form_array.findIndex((dd) => {
                            return dd.key === 'email';
                        }) + 1, 0, {
                            key: `verify_code`,
                            page: 'email_verify',
                            type: 'form_plugin_v2',
                            group: '',
                            toggle: true,
                            title: Language.text('email_verification_code'),
                            appName: 'cms_system',
                            require: 'true',
                            readonly: 'write',
                            formFormat: '{}',
                            style_data: {
                                input: {
                                    list: [],
                                    class: '',
                                    style: '',
                                    version: 'v2',
                                },
                                label: {
                                    list: [],
                                    class: 'form-label fs-base ',
                                    style: '',
                                    version: 'v2',
                                },
                                container: {
                                    list: [],
                                    class: '',
                                    style: '',
                                    version: 'v2',
                                },
                            },
                            form_config: {
                                type: 'text',
                                title: '',
                                input_style: {
                                    list: [],
                                    version: 'v2',
                                },
                                title_style: {
                                    list: [],
                                    version: 'v2',
                                },
                                place_holder: Language.text('please_enter_verification_code'),
                                get email() {
                                    return update_userData.email;
                                },
                            },
                            col: '12',
                            col_sm: '12',
                        });
                    }
                    if (update_userData.phone !== vm.data.userData.phone && vm_info.login_config.phone_verify) {
                        form_array.splice(form_array.findIndex((dd) => {
                            return dd.key === 'phone';
                        }) + 1, 0, {
                            key: `verify_code_phone`,
                            page: 'phone_verify',
                            type: 'form_plugin_v2',
                            group: '',
                            toggle: true,
                            title: Language.text('sms_verification_code'),
                            appName: 'cms_system',
                            require: 'true',
                            readonly: 'write',
                            formFormat: '{}',
                            style_data: {
                                input: {
                                    list: [],
                                    class: '',
                                    style: '',
                                    version: 'v2',
                                },
                                label: {
                                    list: [],
                                    class: 'form-label fs-base ',
                                    style: '',
                                    version: 'v2',
                                },
                                container: {
                                    list: [],
                                    class: '',
                                    style: '',
                                    version: 'v2',
                                },
                            },
                            form_config: {
                                type: 'text',
                                title: '',
                                input_style: {
                                    list: [],
                                    version: 'v2',
                                },
                                title_style: {
                                    list: [],
                                    version: 'v2',
                                },
                                place_holder: Language.text('please_enter_sms_verification_code'),
                                get phone_number() {
                                    return update_userData.phone;
                                },
                            },
                            col: '12',
                            col_sm: '12',
                        });
                    }
                    form_array.map((dd) => {
                        dd.col = '6';
                        dd.form_config.title_style = {
                            list: [
                                {
                                    class: 'um-content mb-2',
                                    style: 'return `color:${glitter.share.globalValue[`theme_color.0.title`]} !important;font-size:16px !important;`',
                                    stylist: [],
                                    dataType: 'code',
                                    style_from: 'code',
                                    classDataType: 'static',
                                },
                            ],
                            class: 'form-label',
                            style: 'font-size: 20px;font-style: normal;font-weight: 400;line-height: 140%; color:#393939 !important;',
                            stylist: [],
                            version: 'v2',
                            dataType: 'static',
                            style_from: 'code',
                            classDataType: 'static',
                        };
                        dd.form_config.input_style = {
                            list: [
                                {
                                    class: 'bgw-input',
                                    style: 'return `border-radius: ${widget.formData.radius}px !important;`',
                                    stylist: [],
                                    dataType: 'code',
                                    style_from: 'code',
                                    classDataType: 'static',
                                },
                            ],
                            class: ' mb-3',
                            style: 'background: #FFF;',
                            stylist: [],
                            version: 'v2',
                            dataType: 'static',
                            style_from: 'code',
                            classDataType: 'static',
                        };
                    });
                    return [
                        ` <div class="w-100  align-items-center d-flex py-3 pb-lg-3 pt-lg-0" style="gap:10px;">

                  <div  class="d-none d-lg-flex" style="background: #FF9705;background: #FF9705;width:4px;height: 20px;" onclick="${gvc.event(() => {
                            gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                                cl.changePage('account_userinfo', 'home', {});
                            });
                        })}"></div>
                    <div class="d-flex d-lg-none align-items-center justify-content-center" style="width:20px;height: 20px;" onclick="${gvc.event(() => {
                            gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                                cl.changePage('account_userinfo', 'home', {});
                            });
                        })}">
                   <i class="fa-solid fa-angle-left fs-4"></i>
</div>
                  <div class="um-info-title fw-bold " style="font-size: 24px;">${Language.text('member_info')}</div>
                </div>`,
                        `<div style="height:5px;"></div>`,
                        FormWidget.editorView({
                            gvc: gvc,
                            array: form_array.map((dd) => {
                                switch (dd.key) {
                                    case 'name':
                                        dd.title = Language.text('name');
                                        break;
                                    case 'email':
                                        dd.title = Language.text('email');
                                        break;
                                    case 'phone':
                                        dd.title = Language.text('phone');
                                        break;
                                    case 'birth':
                                        dd.title = Language.text('birth');
                                        break;
                                }
                                return dd;
                            }),
                            refresh: () => {
                                setTimeout(() => {
                                    gvc.notifyDataChange(id);
                                });
                            },
                            formData: update_userData,
                        }),
                        html ` <div
              class="mt-2 w-100 d-flex align-items-center justify-content-end ${JSON.stringify(update_userData) ===
                            JSON.stringify(vm.data.userData)
                            ? `d-none`
                            : ``}"
            >
              <div
                class="um-nav-btn um-nav-btn-active d-flex align-items-center justify-content-center fw-bold"
                onclick="${gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            const leak = form_array.find((dd) => {
                                return `${dd.require}` === 'true' && !update_userData[dd.key];
                            });
                            if (leak) {
                                dialog.errorMessage({ text: `${Language.text('not_filled_in_yet')} ${leak.title}` });
                                return;
                            }
                            dialog.dataLoading({ visible: true });
                            ApiUser.updateUserData({
                                userData: update_userData,
                            }).then(res => {
                                dialog.dataLoading({ visible: false });
                                if (!res.result && res.response.data.msg === 'email-verify-false') {
                                    dialog.errorMessage({ text: Language.text('email_verification_code_incorrect') });
                                }
                                else if (!res.result && res.response.data.msg === 'phone-verify-false') {
                                    dialog.errorMessage({ text: Language.text('sms_verification_code_incorrect') });
                                }
                                else if (!res.result && res.response.data.msg === 'phone-exists') {
                                    dialog.errorMessage({ text: Language.text('phone_number_already_exists') });
                                }
                                else if (!res.result && res.response.data.msg === 'email-exists') {
                                    dialog.errorMessage({ text: Language.text('email_already_exists') });
                                }
                                else if (!res.result) {
                                    dialog.errorMessage({ text: Language.text('update_exception') });
                                }
                                else {
                                    dialog.successMessage({ text: Language.text('change_success') });
                                    gvc.recreateView();
                                }
                            });
                        })}"
              >
                ${Language.text('confirm_reset')}
              </div>
            </div>`,
                    ].join('');
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, UMInfo);
