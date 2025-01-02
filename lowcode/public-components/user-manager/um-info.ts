import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { FormCheck } from '../../cms-plugin/module/form-check.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Language } from '../../glitter-base/global/language.js';

const html = String.raw;

type User = {
    id: number;
    userID: number;
    account: string;
    userData: UserData;
    created_time: string;
    role: number;
    company: string | null;
    status: number;
    online_time: string;
    static_info: string | null;
    member: Member[];
    member_level: MemberLevel;
    member_level_status: 'auto' | 'manual' | string;
};

type UserData = {
    name: string;
    birth: string;
    email: string;
    phone: string;
    repeatPwd: string;
};

type Member = {
    id: string;
    trigger: boolean;
    tag_name: string;
    dead_line: string;
    og: OriginalMemberInfo;
    leak: number;
    sum?: number;
    start_with?: string;
    re_new_member?: RenewedMemberInfo;
};

type MemberLevel = {
    id: string;
    og: OriginalMemberInfo;
    trigger: boolean;
    tag_name: string;
    dead_line: string;
    start_with: string;
    re_new_member: RenewedMemberInfo;
};

type OriginalMemberInfo = {
    id: string;
    index: number;
    duration: Duration;
    tag_name: string;
    condition: Condition;
    dead_line: Deadline;
    create_date: string;
    renew_condition: RenewCondition;
};

type RenewedMemberInfo = Omit<OriginalMemberInfo, 'index' | 'create_date'> & {
    trigger: boolean;
    leak: number;
    og: OriginalMemberInfo;
};

type Duration = {
    type: 'noLimit' | 'day';
    value: number;
};

type Condition = {
    type: 'total';
    value: number;
};

type Deadline = {
    type: 'noLimit' | string;
};

type RenewCondition = {
    type: 'total';
    value: number;
};

export class UMInfo {
    static main(gvc: GVC, widget: any, subData: any) {
        const glitter = gvc.glitter;

        const vm = {
            data: {} as User,
            memberNext: {} as Member | undefined,
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
                } else {
                    try {
                        return html`
                            ${UmClass.nav(gvc)}
                            <div class="row my-5">
                                <div class="col-12 d-flex align-items-center gap-3 mb-3">
                                    <div class="um-info-title">${vm.data.userData.name}</div>
                                    <div class="um-info-insignia">
                                        ${(() => {
                                            const mem = vm.data.member.find((d) => {
                                                return d.trigger;
                                            });
                                            return mem ? mem.tag_name : Language.text('normal_member');
                                        })()}
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="d-flex flex-column gap-2">
                                        ${[
                                            (() => {
                                                if (vm.data.member_level.dead_line && typeof vm.data.member_level.dead_line === 'string') {
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
                                                        return `＊ ${Language.text('spend_again')} NT.${Number(vm.data.member_level.re_new_member.leak).toLocaleString()} ${Language.text(
                                                            'can_meet_renewal_criteria'
                                                        )}`;
                                                    }
                                                    return `＊ ${Language.text('single_purchase_over')} NT.${Number(vm.data.member_level.re_new_member.leak).toLocaleString()} ${Language.text(
                                                        'can_meet_renewal_criteria'
                                                    )}`;
                                                } catch {
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
                                                return html`＊ ${vm.memberNext.og.duration.value} ${Language.text('days')} ${Language.text('accumulated_spending_reaches')} NT.${condition_val}
                                                ${Language.text('upgrade_to')} ${vm.memberNext.tag_name}`;
                                            })(),
                                        ]
                                            .map((str) => {
                                                return str.length > 0 ? html` <div class="um-info-note">${str}</div> ` : '';
                                            })
                                            .join('')}
                                        <div
                                            class="um-info-event"
                                            onclick="${gvc.event(() => {
                                                UmClass.dialog({
                                                    gvc,
                                                    tag: 'level-of-detail',
                                                    title: Language.text('rules_explanation'),
                                                    innerHTML: (gvc: GVC) => {
                                                        return html`<div class="mt-1 pb-2 ${vm.data.member.length > 0 ? 'border-bottom' : ''}">
                                                                <div class="um-title">${Language.text('membership_level_rules')}</div>
                                                                <div class="um-content">${Language.text('if_renewal_criteria_not_met_within_membership_period')}</div>
                                                            </div>
                                                            ${(() => {
                                                                const members = JSON.parse(JSON.stringify(vm.data.member)) as Member[];
                                                                members.pop();
                                                                return members
                                                                    .reverse()
                                                                    .map((leadData) => {
                                                                        const detail = (() => {
                                                                            const condition_val = parseInt(`${leadData.og.condition.value}`, 10).toLocaleString();
                                                                            if (leadData.og.condition.type === 'total') {
                                                                                if (leadData.og.duration.type === 'noLimit') {
                                                                                    return `${Language.text('accumulated_spending_reaches')} NT.${condition_val} ${Language.text('upgrade_to')} ${
                                                                                        leadData.tag_name
                                                                                    }`;
                                                                                } else {
                                                                                    return html`${leadData.og.duration.value} ${Language.text('days')} ${Language.text('accumulated_spending_reaches')}
                                                                                    NT.${condition_val} ${Language.text('upgrade_to')} ${leadData.tag_name}`;
                                                                                }
                                                                            } else {
                                                                                return `${Language.text('single_purchase_reaches')} NT.${condition_val} ${Language.text('upgrade_to')} ${
                                                                                    leadData.tag_name
                                                                                }`;
                                                                            }
                                                                        })();
                                                                        return html`
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
                                        <div
                                            class="um-info-event"
                                            onclick="${gvc.event(() => {
                                                UmClass.dialog({
                                                    gvc,
                                                    tag: 'user-qr-code',
                                                    title: Language.text('membership_barcode'),
                                                    innerHTML: (gvc) => {
                                                        return gvc.bindView(
                                                            (() => {
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
                                                                        } else {
                                                                            return html` <div style="text-align: center; vertical-align: middle;">
                                                                                <img src="${img}" />
                                                                            </div>`;
                                                                        }
                                                                    },
                                                                    divCreate: {},
                                                                    onCreate: () => {
                                                                        if (loading) {
                                                                            glitter.addMtScript(
                                                                                [
                                                                                    {
                                                                                        src: 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js',
                                                                                    },
                                                                                ],
                                                                                () => {
                                                                                    const si = setInterval(() => {
                                                                                        const qr = (window as any).QRCode;
                                                                                        if (qr) {
                                                                                            qr.toDataURL(
                                                                                                `user-${vm.data.userID}`,
                                                                                                {
                                                                                                    width: 400,
                                                                                                    margin: 2,
                                                                                                },
                                                                                                (err: any, url: string) => {
                                                                                                    if (err) {
                                                                                                        console.error(err);
                                                                                                        return;
                                                                                                    }
                                                                                                    img = url;
                                                                                                    loading = false;
                                                                                                    gvc.notifyDataChange(id);
                                                                                                }
                                                                                            );
                                                                                            clearInterval(si);
                                                                                        }
                                                                                    }, 300);
                                                                                },
                                                                                () => {}
                                                                            );
                                                                        }
                                                                    },
                                                                };
                                                            })()
                                                        );
                                                    },
                                                });
                                            })}"
                                        >
                                            ${Language.text('present_membership_barcode')}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    ${(() => {
                                        if (!vm.memberNext) {
                                            return '';
                                        }
                                        const solidButtonBgr = gvc.glitter.share.globalValue['theme_color.0.solid-button-bg'] ?? '#292218';
                                        return html` <div class="um-title mb-1 mt-2">${Language.text('current_accumulated_spending_amount')}</div>
                                            <div class="w-100 um-linebar-container">
                                                <div class="d-flex w-100 justify-content-between align-items-center">
                                                    <div class="um-content">NT. ${(vm.memberNext.sum ?? 0).toLocaleString()}</div>
                                                    <div class="um-content um-text-danger">
                                                        ${Language.text('distance_from_target_amount')} NT.${vm.memberNext.leak.toLocaleString()} ${Language.text('can_upgrade')}
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
                                                        `;
                                                        })()}"
                                                    ></div>
                                                </div>
                                            </div>`;
                                    })()}
                                </div>
                                <div class="w-100 mt-4" style="min-height: 500px;">
                                    <div class="um-title my-2">${Language.text('edit_profile')}</div>
                                    ${gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        const vm_info: {
                                            loading: boolean;
                                            list: any[];
                                            form_array: any[];
                                            login_config: any;
                                        } = {
                                            loading: true,
                                            list: [],
                                            form_array: [],
                                            login_config: {},
                                        };
                                        const update_userData = JSON.parse(JSON.stringify(vm.data.userData));
                                        ApiUser.getPublicConfig('custom_form_register', 'manager').then((res) => {
                                            ApiUser.getPublicConfig('login_config', 'manager').then((data) => {
                                                vm_info.login_config = data.response.value ?? {};
                                                vm_info.list = (res.response.value ?? { list: [] }).list;
                                                vm_info.form_array = FormCheck.initialRegisterForm(vm_info.list).filter((dd: any) => {
                                                    return !dd.hidden;
                                                });
                                                vm_info.loading = false;
                                                gvc.notifyDataChange(id);
                                            });
                                        });
                                        return {
                                            bind: id,
                                            view: () => {
                                                if (vm_info.loading) {
                                                    return UmClass.spinner();
                                                }
                                                const form_array = JSON.parse(JSON.stringify(vm_info.form_array));
                                                // 判斷要驗證信箱時，插入驗證元件
                                                if (update_userData.email !== vm.data.userData.email && vm_info.login_config.email_verify) {
                                                    form_array.splice(
                                                        form_array.findIndex((dd: any) => {
                                                            return dd.key === 'email';
                                                        }) + 1,
                                                        0,
                                                        {
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
                                                        }
                                                    );
                                                }
                                                // 判斷要驗證電話時，插入驗證元件
                                                if (update_userData.phone !== vm.data.userData.phone && vm_info.login_config.phone_verify) {
                                                    form_array.splice(
                                                        form_array.findIndex((dd: any) => {
                                                            return dd.key === 'phone';
                                                        }) + 1,
                                                        0,
                                                        {
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
                                                        }
                                                    );
                                                }

                                                form_array.map((dd: any) => {
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
                                                    FormWidget.editorView({
                                                        gvc: gvc,
                                                        array: form_array.map((dd: any) => {
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
                                                    html` <div
                                                        class="mt-2 w-100 d-flex align-items-center justify-content-end ${JSON.stringify(update_userData) === JSON.stringify(vm.data.userData)
                                                            ? `d-none`
                                                            : ``}"
                                                    >
                                                        <div
                                                            class="um-nav-btn um-nav-btn-active d-flex align-items-center justify-content-center fw-bold"
                                                            onclick="${gvc.event(() => {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                const leak = form_array.find((dd: any) => {
                                                                    return `${dd.require}` === 'true' && !update_userData[dd.key];
                                                                });
                                                                if (leak) {
                                                                    dialog.errorMessage({ text: `${Language.text('not_filled_in_yet')} ${leak.title}` });
                                                                    return;
                                                                }
                                                                dialog.dataLoading({ visible: true });
                                                                ApiUser.updateUserData({
                                                                    userData: update_userData,
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
                                                class: `w-100 mx-n2 mt-2`,
                                            },
                                        };
                                    })}
                                </div>
                            </div>
                        `;
                    } catch (error) {
                        console.error('User Member Info Error: ', error);
                        return UmClass.spinner();
                    }
                }
            },
            divCreate: {},
            onCreate: () => {
                if (loadings.view) {
                    UmClass.getUserData(gvc).then((resp: any) => {
                        try {
                            vm.data = resp;
                            const members = JSON.parse(JSON.stringify(vm.data.member)).reverse() as Member[];
                            vm.memberNext = members.find((dd) => !dd.trigger);
                            loadings.view = false;
                            gvc.notifyDataChange(ids.view);
                        } catch (e) {
                            gvc.glitter.href = './login';
                        }
                    });
                }
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, UMInfo);
