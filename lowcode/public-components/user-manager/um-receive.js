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
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { Language } from '../../glitter-base/global/language.js';
import { FormCheck } from '../../cms-plugin/module/form-check.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { CartModule } from '../../public-components/modules/cart-module.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class UMReceive {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        const vm = {
            id: glitter.getUUID(),
            loading: true,
            userData: {},
            funnyForm: [],
            dataList: [],
            dataKeys: [],
        };
        const receive_list_max_length = 100;
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            changePage = cl.changePage;
        });
        return gvc.bindView({
            bind: vm.id,
            view: () => __awaiter(this, void 0, void 0, function* () {
                if (vm.loading) {
                    return UmClass.spinner();
                }
                function saveView() {
                    return html `<div class="d-flex justify-content-end">
            <div
              class="um-nav-btn um-nav-btn-active d-flex align-items-center justify-content-center fw-bold"
              onclick="${gvc.event(() => {
                        vm.userData.receive_list = vm.dataList
                            .map((data) => {
                            const temp = {};
                            vm.dataKeys.map(key => {
                                temp[key] = data[key];
                            });
                            return temp;
                        })
                            .filter((data) => {
                            return Object.values(data).some(Boolean);
                        });
                        ApiUser.updateUserData({
                            userData: vm.userData,
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
              ${Language.text('confirm')}
            </div>
          </div>`;
                }
                function recipientView() {
                    return html ` <div class="col-12" style="min-height: 500px;">
            ${vm.dataList
                        .map((data, index) => {
                        const cloneForm = JSON.parse(JSON.stringify(vm.funnyForm));
                        return html `<div class="px-0 py-2 px-md-2 py-md-4 mb-3">
                  <h5>${Language.text('recipient')} ${index + 1}</h5>
                  ${FormWidget.editorView({
                            gvc: gvc,
                            array: cloneForm.map((dd, index) => {
                                dd.col = '6';
                                if (index === cloneForm.length - 1) {
                                    dd.col = '12';
                                }
                                return dd;
                            }),
                            refresh: () => {
                                gvc.notifyDataChange(vm.id);
                            },
                            formData: data,
                        })}
                </div>`;
                    })
                        .join('')}
          </div>`;
                }
                function plusButton() {
                    return html `<div
            class="w-100 d-flex justify-content-center align-items-center gap-2"
            style="color: #3366BB; cursor: pointer"
            onclick="${gvc.event(() => {
                        vm.dataList.push({});
                        gvc.notifyDataChange(vm.id);
                    })}"
          >
            <div style="font-size: 16px; font-weight: 400; word-wrap: break-word">
              ${Language.text('add_recipient')}
            </div>
            <i class="fa-solid fa-plus"></i>
          </div>`;
                }
                return html `
          <div class="row mx-auto p-0">
            <div class="w-100 align-items-center d-flex py-3 pb-lg-3 pt-lg-0" style="gap:10px;">
              <div
                class="d-none d-lg-flex"
                style="background: #FF9705;width:4px;height: 20px;"
                onclick="${gvc.event(() => {
                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                        cl.changePage('account_userinfo', 'home', {});
                    });
                })}"
              ></div>
              <div
                class="d-flex d-lg-none align-items-center justify-content-center"
                style="width:20px;height: 20px;"
                onclick="${gvc.event(() => {
                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                        cl.changePage('account_userinfo', 'home', {});
                    });
                })}"
              >
                <i class="fa-solid fa-angle-left fs-4"></i>
              </div>
              <div class="um-info-title fw-bold" style="font-size: 24px;">${Language.text('recipient_info')}</div>
            </div>
            ${vm.dataList.length > 0 ? [saveView(), recipientView()].join('') : ''}
            <div class="w-100 my-3" style="background: white;height: 1px;"></div>
            ${receive_list_max_length > vm.dataList.length ? plusButton() : ''}
          </div>
        `;
            }),
            onCreate: () => {
                if (vm.loading) {
                    const classPrefix = 'cart-prefix';
                    CartModule.addStyle(gvc, classPrefix);
                    Promise.all([ApiUser.getUserData(GlobalUser.token, 'me'), this.funnyQuickFormFrame(classPrefix)]).then(dataArray => {
                        vm.userData = dataArray[0].response.userData;
                        vm.userData.receive_list = Array.isArray(vm.userData.receive_list) ? vm.userData.receive_list : [];
                        vm.dataList = vm.userData.receive_list;
                        vm.funnyForm = dataArray[1];
                        vm.dataKeys = vm.funnyForm.map((item) => item.key).filter(Boolean);
                        vm.loading = false;
                        gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }
    static funnyQuickFormFrame(classPrefix) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield ApiUser.getPublicConfig('custom_form_checkout_recipient', 'manager');
            const share_receipt_form = FormCheck.initialRecipientForm((_a = res.response.value.list) !== null && _a !== void 0 ? _a : []).filter(dd => {
                return !dd.hidden;
            });
            const receipt_form = JSON.parse(JSON.stringify(share_receipt_form)).map((dd) => {
                switch (dd.key) {
                    case 'name':
                        dd.form_config.place_holder = Language.text('please_enter_name');
                        dd.title = Language.text('name');
                        break;
                    case 'phone':
                        dd.form_config.place_holder = Language.text('please_enter_contact_number');
                        dd.title = Language.text('contact_number');
                        break;
                    case 'email':
                        dd.form_config.place_holder = Language.text('please_enter_email');
                        dd.title = Language.text('email');
                        break;
                }
                dd.col = '4';
                return dd;
            });
            const list = (() => {
                try {
                    return [
                        ...receipt_form,
                        ...[
                            {
                                col: '6',
                                key: 'invoice_type',
                                page: 'form-select',
                                type: 'form_plugin_v2',
                                group: '',
                                title: Language.text('invoice_recipient'),
                                col_sm: '12',
                                appName: 'cms_system',
                                require: 'true',
                                readonly: 'write',
                                formFormat: '{}',
                                moduleName: '下拉選單',
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
                                    type: 'name',
                                    title: '',
                                    option: [
                                        {
                                            name: Language.text('personal'),
                                            index: 0,
                                            value: 'me',
                                        },
                                        {
                                            name: Language.text('company'),
                                            index: 1,
                                            value: 'company',
                                        },
                                        {
                                            name: Language.text('donate_invoice'),
                                            index: 2,
                                            value: 'donate',
                                        },
                                    ],
                                    input_style: { list: [], version: 'v2' },
                                    title_style: { list: [], version: 'v2' },
                                    place_holder: '',
                                },
                                hidden_code: "return (form_data['invoice_method']==='nouse')",
                            },
                            {
                                col: '6',
                                key: 'send_type',
                                page: 'form-select',
                                type: 'form_plugin_v2',
                                group: '',
                                title: Language.text('invoice_method'),
                                col_sm: '12',
                                appName: 'cms_system',
                                require: 'true',
                                readonly: 'write',
                                formFormat: '{}',
                                moduleName: '下拉選單',
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
                                    type: 'name',
                                    title: '',
                                    option: [
                                        {
                                            name: Language.text('send_to_user_email'),
                                            index: 0,
                                            value: 'email',
                                        },
                                        {
                                            name: Language.text('mobile_barcode_device'),
                                            index: 1,
                                            value: 'carrier',
                                        },
                                    ],
                                    input_style: { list: [], version: 'v2' },
                                    title_style: { list: [], version: 'v2' },
                                    place_holder: '',
                                },
                                hidden_code: "    if(form_data['invoice_type']!=='me' || (form_data['invoice_method']==='nouse') || (form_data['invoice_method']==='off_line')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                            },
                            {
                                key: 'carrier_num',
                                page: 'input',
                                type: 'form_plugin_v2',
                                group: '',
                                title: Language.text('carrier_number'),
                                appName: 'cms_system',
                                require: 'false',
                                readonly: 'write',
                                formFormat: '{}',
                                moduleName: '輸入框',
                                col: '3',
                                col_sm: '12',
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
                                    type: 'name',
                                    title: '',
                                    input_style: { list: [], version: 'v2' },
                                    title_style: { list: [], version: 'v2' },
                                    place_holder: Language.text('please_enter_carrier_number'),
                                },
                                hidden_code: "    \n    if(form_data['invoice_type']!=='me' || form_data['send_type']!=='carrier'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                            },
                            {
                                key: 'company',
                                page: 'input',
                                type: 'form_plugin_v2',
                                group: '',
                                title: Language.text('company_name'),
                                appName: 'cms_system',
                                require: 'false',
                                readonly: 'write',
                                formFormat: '{}',
                                moduleName: '輸入框',
                                col: '3',
                                col_sm: '12',
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
                                    type: 'name',
                                    title: '',
                                    input_style: { list: [], version: 'v2' },
                                    title_style: { list: [], version: 'v2' },
                                    place_holder: Language.text('please_enter_company_name'),
                                },
                                hidden_code: "    if(form_data['invoice_type']!=='company' || (form_data['invoice_method']==='nouse')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                            },
                            {
                                key: 'gui_number',
                                page: 'input',
                                type: 'form_plugin_v2',
                                group: '',
                                title: Language.text('company_tax_id'),
                                col: '3',
                                col_sm: '12',
                                appName: 'cms_system',
                                require: 'false',
                                readonly: 'write',
                                formFormat: '{}',
                                moduleName: '輸入框',
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
                                    type: 'name',
                                    title: '',
                                    input_style: { list: [], version: 'v2' },
                                    title_style: { list: [], version: 'v2' },
                                    place_holder: Language.text('please_enter_company_tax_id'),
                                },
                                hidden_code: "    if(form_data['invoice_type']!=='company'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                            },
                            {
                                col: '6',
                                key: 'love_code',
                                page: 'input',
                                type: 'form_plugin_v2',
                                group: '',
                                title: Language.text('donation_code'),
                                col_sm: '12',
                                appName: 'cms_system',
                                require: 'false',
                                readonly: 'write',
                                formFormat: '{}',
                                moduleName: '輸入框',
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
                                    type: 'name',
                                    title: '',
                                    input_style: { list: [], version: 'v2' },
                                    title_style: { list: [], version: 'v2' },
                                    place_holder: Language.text('please_enter_donation_code'),
                                },
                                hidden_code: "    if(form_data['invoice_type']!=='donate' || (form_data['invoice_method']==='nouse')){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                            },
                        ],
                        {
                            col: '12',
                            key: 'note',
                            page: 'multiple_line_text',
                            type: 'form_plugin_v2',
                            group: '',
                            title: Language.text('delivery_notes'),
                            col_sm: '12',
                            appName: 'cms_system',
                            require: 'false',
                            readonly: 'write',
                            formFormat: '{}',
                            moduleName: '多行文字區塊',
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
                                title_style: { list: [], version: 'v2' },
                                place_holder: Language.text('enter_delivery_notes'),
                            },
                            hidden_code: 'return false',
                        },
                    ];
                }
                catch (error) {
                    console.error(error);
                    return [];
                }
            })();
            function sortObjectKeys(obj) {
                if (Array.isArray(obj)) {
                    return obj.map(sortObjectKeys);
                }
                else if (obj !== null && typeof obj === 'object') {
                    const sortedKeys = Object.keys(obj).sort();
                    const result = {};
                    for (const key of sortedKeys) {
                        result[key] = sortObjectKeys(obj[key]);
                    }
                    return result;
                }
                return obj;
            }
            function gClass(text) {
                if (Array.isArray(text)) {
                    return text.map(c => gClass(c)).join(' ');
                }
                return `${classPrefix}-${text}`;
            }
            const formatList = list.map((dd) => {
                dd.form_config.title_style = {
                    list: [
                        {
                            class: ['company', 'gui_number', 'carrier_num', 'love_code'].includes(dd.key)
                                ? gClass('label') + ' mt-2'
                                : gClass('label') + ' mb-2',
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
                            class: gClass('input'),
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
                return dd;
            });
            return sortObjectKeys(formatList);
        });
    }
}
window.glitter.setModule(import.meta.url, UMReceive);
