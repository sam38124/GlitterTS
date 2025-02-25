export class FormCheck {
    static initialRegisterForm(form_formats) {
        if (!form_formats.find((dd) => {
            return dd.key === 'name';
        })) {
            form_formats.push({
                col: '12',
                key: 'name',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '姓名',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    place_holder: '請輸入姓名',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'email';
        })) {
            form_formats.push({
                col: '12',
                key: 'email',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '信箱 / 帳號',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    type: 'email',
                    title: '',
                    input_style: {
                        list: [],
                        version: 'v2',
                    },
                    title_style: {
                        list: [],
                        version: 'v2',
                    },
                    place_holder: '請輸入電子信箱',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'phone';
        })) {
            form_formats.push({
                col: '12',
                key: 'phone',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '手機',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: false,
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
                    type: 'phone',
                    title: '',
                    input_style: {
                        list: [],
                        version: 'v2',
                    },
                    title_style: {
                        list: [],
                        version: 'v2',
                    },
                    place_holder: '請輸入手機號碼',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'birth';
        })) {
            form_formats.push({
                col: '12',
                key: 'birth',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '生日',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    type: 'date',
                    title: '',
                    input_style: {
                        list: [],
                        version: 'v2',
                    },
                    title_style: {
                        list: [],
                        version: 'v2',
                    },
                    place_holder: '請輸入你的出生日期',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'gender';
        })) {
            form_formats.push({
                deletable: false,
                require: false,
                hidden: true,
                col: '12',
                key: 'gender',
                page: 'check_box',
                type: 'form_plugin_v2',
                group: '',
                title: '性別',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                readonly: 'write',
                formFormat: '{}',
                moduleName: '單選題',
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
                            name: '男生',
                            index: 0,
                            value: '男生',
                        },
                        {
                            name: '女生',
                            index: 0,
                            value: '女生',
                        },
                    ],
                    input_style: {},
                    title_style: {},
                    place_holder: '',
                },
            });
        }
        return form_formats;
    }
    static initialCheckOutForm(form_formats) {
        if (!form_formats.find((dd) => {
            return dd.key === 'name';
        })) {
            form_formats.push({
                col: '12',
                key: 'name',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '姓名',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    place_holder: '請輸入姓名',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'email';
        })) {
            form_formats.push({
                col: '12',
                key: 'email',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '信箱',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    type: 'email',
                    title: '',
                    input_style: {
                        list: [],
                        version: 'v2',
                    },
                    title_style: {
                        list: [],
                        version: 'v2',
                    },
                    place_holder: '請輸入電子信箱',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'phone';
        })) {
            form_formats.push({
                col: '12',
                key: 'phone',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '手機',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    type: 'phone',
                    title: '',
                    input_style: {
                        list: [],
                        version: 'v2',
                    },
                    title_style: {
                        list: [],
                        version: 'v2',
                    },
                    place_holder: '請輸入手機號碼',
                },
                deletable: false,
            });
        }
        return form_formats;
    }
    static initialRecipientForm(form_formats) {
        if (!form_formats.find((dd) => {
            return dd.key === 'name';
        })) {
            form_formats.push({
                col: '12',
                key: 'name',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '姓名',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    place_holder: '請輸入姓名',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'email';
        })) {
            form_formats.push({
                col: '12',
                key: 'email',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '信箱',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    type: 'email',
                    title: '',
                    input_style: {
                        list: [],
                        version: 'v2',
                    },
                    title_style: {
                        list: [],
                        version: 'v2',
                    },
                    place_holder: '請輸入電子信箱',
                },
                deletable: false,
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'phone';
        })) {
            form_formats.push({
                col: '12',
                key: 'phone',
                page: 'input',
                type: 'form_plugin_v2',
                group: '',
                title: '手機',
                col_sm: '12',
                toggle: false,
                appName: 'cms_system',
                require: true,
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
                    type: 'phone',
                    title: '',
                    input_style: {
                        list: [],
                        version: 'v2',
                    },
                    title_style: {
                        list: [],
                        version: 'v2',
                    },
                    place_holder: '請輸入手機號碼',
                },
                deletable: false,
            });
        }
        return form_formats;
    }
    static initialUserForm(form_formats) {
        const userObject = [
            { key: 'carrier_number', title: '手機載具' },
            { key: 'gui_number', title: '統一編號' },
            { key: 'company', title: '公司' },
            { key: 'consignee_name', title: '收貨人', type: 'consignee' },
            { key: 'consignee_address', title: '收貨人地址', type: 'consignee' },
            { key: 'consignee_email', title: '收貨人電子郵件', type: 'consignee' },
            { key: 'consignee_phone', title: '收貨人手機', type: 'consignee' },
        ];
        userObject.map((item) => {
            var _a;
            if (!form_formats.find((dd) => {
                return dd.key === item.key;
            })) {
                form_formats.push({
                    col: '12',
                    key: item.key,
                    page: 'input',
                    type: 'form_plugin_v2',
                    group: '',
                    title: item.title,
                    col_sm: '12',
                    toggle: false,
                    appName: 'cms_system',
                    require: false,
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
                        type: (_a = item.type) !== null && _a !== void 0 ? _a : 'text',
                        title: '',
                        input_style: {
                            list: [],
                            version: 'v2',
                        },
                        title_style: {
                            list: [],
                            version: 'v2',
                        },
                        place_holder: '',
                    },
                    deletable: false,
                });
            }
        });
        return form_formats;
    }
}
