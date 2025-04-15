"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormCheck = void 0;
var FormCheck = /** @class */ (function () {
    function FormCheck() {
    }
    FormCheck.initialRegisterForm = function (form_formats) {
        //沒有姓名欄位
        if (!form_formats.find(function (dd) {
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
        //沒有信箱欄位
        if (!form_formats.find(function (dd) {
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
        //沒有電話欄位
        if (!form_formats.find(function (dd) {
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
        //沒有生日欄位
        if (!form_formats.find(function (dd) {
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
    };
    FormCheck.initialUserForm = function (form_formats) {
        //沒有姓名欄位
        var userObject = [
            { key: 'carrier_number', title: '手機載具' },
            { key: 'gui_number', title: '統一編號' },
            { key: 'company', title: '公司' },
            { key: 'consignee_name', title: '收貨人', type: 'consignee' },
            { key: 'consignee_address', title: '收貨人地址', type: 'consignee' },
            { key: 'consignee_email', title: '收貨人電子郵件', type: 'consignee' },
            { key: 'consignee_phone', title: '收貨人手機', type: 'consignee' },
        ];
        userObject.map(function (item) {
            var _a;
            if (!form_formats.find(function (dd) {
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
    };
    FormCheck.initialListHeader = function (data) {
        var _a, _b;
        data = data || {};
        (_a = data['user-list']) !== null && _a !== void 0 ? _a : (data['user-list'] = [
            '顧客名稱',
            '電子信箱',
            '訂單',
            '會員等級',
            '累積消費',
            '上次登入時間',
            '社群綁定',
            '用戶狀態',
        ]);
        (_b = data['order-list']) !== null && _b !== void 0 ? _b : (data['order-list'] = ['訂單編號', '訂單日期', '訂購人', '訂單金額', '付款狀態', '出貨狀態', '訂單狀態']);
        return data;
    };
    FormCheck.initialLoginConfig = function (data) {
        data = __assign({ sorted_voucher: {
                toggle: false,
                array: [],
            } }, (data !== null && data !== void 0 ? data : {}));
        return data;
    };
    return FormCheck;
}());
exports.FormCheck = FormCheck;
