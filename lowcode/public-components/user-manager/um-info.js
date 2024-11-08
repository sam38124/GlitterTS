import { UmClass } from './um-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { FormCheck } from '../../cms-plugin/module/form-check.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { UMVoucher } from './um-voucher.js';
const html = String.raw;
export class UMInfo {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        if (glitter.getUrlParameter('page') === 'voucher-list') {
            return UMVoucher.main(gvc, widget, subData);
        }
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
                    return html `
                        ${UmClass.nav(gvc)}
                        <div class="row my-5">
                            <div class="col-12 d-flex align-items-center gap-3 mb-3">
                                <div class="um-info-title">${vm.data.userData.name}</div>
                                <div class="um-info-insignia">
                                    ${(() => {
                        const mem = vm.data.member.find((d) => {
                            return d.trigger;
                        });
                        return mem ? mem.tag_name : '一般會員';
                    })()}
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="d-flex flex-column gap-2">
                                    ${[
                        (() => {
                            if (vm.data.member_level.dead_line) {
                                return `＊ 會員到期日至 ${vm.data.member_level.dead_line.substring(0, 10).replace(/-/g, '/')}`;
                            }
                            return '';
                        })(),
                        (() => {
                            try {
                                if (vm.data.member_level.re_new_member.trigger) {
                                    return `＊ 已達成續會條件`;
                                }
                                if (vm.data.member_level.re_new_member.og.condition.type === 'total') {
                                    return `＊ 再消費NT.${Number(vm.data.member_level.re_new_member.leak).toLocaleString()}即可達成續會條件`;
                                }
                                return `＊ 單筆消費滿NT.${Number(vm.data.member_level.re_new_member.leak).toLocaleString()}即可達成續會條件`;
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
                                return `＊ 單筆消費達 NT${condition_val} 即可升級至${vm.memberNext.tag_name}`;
                            }
                            if (vm.memberNext.og.duration.type === 'noLimit') {
                                return `＊ 累積消費額達 NT${condition_val} 即可升級至${vm.memberNext.tag_name}`;
                            }
                            return `＊ ${vm.memberNext.og.duration.value}天內累積消費額達 NT${condition_val} 即可升級至${vm.memberNext.tag_name}`;
                        })(),
                    ]
                        .map((str) => {
                        return str.length > 0 ? html ` <div class="um-info-note">${str}</div> ` : '';
                    })
                        .join('')}
                                    <div
                                        class="um-info-event"
                                        onclick="${gvc.event(() => {
                        UmClass.dialog({
                            gvc,
                            tag: 'level-of-detail',
                            title: '規則說明',
                            innerHTML: ((gvc) => {
                                return `<div class="mt-1 pb-2 ${vm.data.member.length > 0 ? 'border-bottom' : ''}">
                                                        <div class="um-title">會員等級規則</div>
                                                        <div class="um-content">會籍期效內若沒達成續會條件，將會自動降級</div>
                                                    </div>
                                                    ${(() => {
                                    const members = JSON.parse(JSON.stringify(vm.data.member));
                                    members.pop();
                                    return members
                                        .reverse()
                                        .map((leadData) => {
                                        const detail = (() => {
                                            const condition_val = parseInt(`${leadData.og.condition.value}`, 10).toLocaleString();
                                            if (leadData.og.condition.type === 'total') {
                                                if (leadData.og.duration.type === 'noLimit') {
                                                    return `累積消費額達 NT${condition_val} 即可升級至${leadData.tag_name}`;
                                                }
                                                else {
                                                    return `${leadData.og.duration.value}天內累積消費額達 NT${condition_val} 即可升級至${leadData.tag_name}`;
                                                }
                                            }
                                            else {
                                                return `單筆消費達 NT${condition_val} 即可升級至${leadData.tag_name}`;
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
                            }),
                        });
                    })}"
                                    >
                                        查看會員級數規則
                                    </div>
                                    <div
                                        class="um-info-event"
                                        onclick="${gvc.event(() => {
                        UmClass.dialog({
                            gvc,
                            tag: 'user-qr-code',
                            title: '會員條碼',
                            innerHTML: (gvc) => {
                                return gvc.bindView((() => {
                                    const id = glitter.getUUID();
                                    let loading = true;
                                    let img = '';
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (loading) {
                                                return UmClass.spinner('100%');
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
                                                const si = setInterval(() => {
                                                    const qr = window.QRCode;
                                                    if (qr) {
                                                        qr.toDataURL(`${vm.data.userID}`, {
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
                                            }
                                        },
                                    };
                                })());
                            },
                        });
                    })}"
                                    >
                                        出示會員條碼
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                ${(() => {
                        var _a;
                        if (!vm.memberNext) {
                            return '';
                        }
                        return html ` <div class="um-title mb-1 mt-2">目前累積消費金額</div>
                                        <div class="w-100 um-linebar-container">
                                            <div class="d-flex w-100 justify-content-between align-items-center">
                                                <div class="um-content">NT. ${((_a = vm.memberNext.sum) !== null && _a !== void 0 ? _a : 0).toLocaleString()}</div>
                                                <div class="um-content um-text-danger">差 NT.${vm.memberNext.leak.toLocaleString()} 即可升級</div>
                                            </div>
                                            <div class="w-100 um-linebar">
                                                <div class="um-linebar-behind"></div>
                                                <div
                                                    class="um-linebar-fill"
                                                    style="${(() => {
                            var _a;
                            const sum = vm.memberNext.sum;
                            const leak = vm.memberNext.leak;
                            return `
                                                            background: ${(_a = glitter.share.globalValue['theme_color.0.solid-button-bg']) !== null && _a !== void 0 ? _a : '#292218'};
                                                            width: ${sum ? (sum * 100) / (leak + sum) : 0}%;
                                                        `;
                        })()}"
                                                ></div>
                                            </div>
                                        </div>`;
                    })()}
                            </div>
                            <div class="w-100 mt-4" style="min-height: 500px;">
                                <div class="um-title my-2">編輯個人資料</div>
                                ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        const vm_info = {
                            loading: true,
                            list: [],
                            form_array: [],
                            login_config: {},
                        };
                        const update_userData = JSON.parse(JSON.stringify(vm.data.userData));
                        ApiUser.getPublicConfig('custom_form_register', 'manager').then((res) => {
                            ApiUser.getPublicConfig('login_config', 'manager').then((data) => {
                                var _a, _b;
                                vm_info.login_config = (_a = data.response.value) !== null && _a !== void 0 ? _a : {};
                                vm_info.list = ((_b = res.response.value) !== null && _b !== void 0 ? _b : { list: [] }).list;
                                vm_info.form_array = FormCheck.initialRegisterForm(vm_info.list).filter((dd) => {
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
                                if (update_userData.email !== vm.data.userData.email && vm_info.login_config.email_verify) {
                                    form_array.splice(form_array.findIndex((dd) => {
                                        return dd.key === 'email';
                                    }) + 1, 0, {
                                        key: `verify_code`,
                                        page: 'email_verify',
                                        type: 'form_plugin_v2',
                                        group: '',
                                        toggle: true,
                                        title: '信箱驗證碼',
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
                                            place_holder: '請輸入驗證碼',
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
                                        title: '簡訊驗證碼',
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
                                            place_holder: '請輸入簡訊驗證碼',
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
                                    FormWidget.editorView({
                                        gvc: gvc,
                                        array: form_array,
                                        refresh: () => {
                                            setTimeout(() => {
                                                gvc.notifyDataChange(id);
                                            });
                                        },
                                        formData: update_userData,
                                    }),
                                    html ` <div
                                                    class="mt-2 w-100 d-flex align-items-center justify-content-end ${JSON.stringify(update_userData) === JSON.stringify(vm.data.userData)
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
                                            dialog.errorMessage({ text: '尚未填寫' + leak.title });
                                            return;
                                        }
                                        dialog.dataLoading({ visible: true });
                                        ApiUser.updateUserData({
                                            userData: update_userData,
                                        }).then((res) => {
                                            dialog.dataLoading({ visible: false });
                                            if (!res.result && res.response.data.msg === 'email-verify-false') {
                                                dialog.errorMessage({ text: '信箱驗證碼輸入錯誤' });
                                            }
                                            else if (!res.result && res.response.data.msg === 'phone-verify-false') {
                                                dialog.errorMessage({ text: '簡訊驗證碼輸入錯誤' });
                                            }
                                            else if (!res.result && res.response.data.msg === 'phone-exists') {
                                                dialog.errorMessage({ text: '此電話號碼已存在' });
                                            }
                                            else if (!res.result && res.response.data.msg === 'email-exists') {
                                                dialog.errorMessage({ text: '此信箱已存在' });
                                            }
                                            else if (!res.result) {
                                                dialog.errorMessage({ text: '更新異常' });
                                            }
                                            else {
                                                dialog.successMessage({ text: '更新成功' });
                                                gvc.recreateView();
                                            }
                                        });
                                    })}"
                                                    >
                                                        儲存更改
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
                }
            },
            divCreate: {},
            onCreate: () => {
                if (loadings.view) {
                    UmClass.getUserData(gvc).then((resp) => {
                        vm.data = resp;
                        const members = JSON.parse(JSON.stringify(vm.data.member)).reverse();
                        vm.memberNext = members.find((dd) => !dd.trigger);
                        loadings.view = false;
                        gvc.notifyDataChange(ids.view);
                    });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, UMInfo);
