"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormCheck = void 0;
class FormCheck {
    static initialRegisterForm(form_formats) {
        if (!form_formats.find((dd) => {
            return dd.key === 'name';
        })) {
            form_formats.push({
                "col": "12",
                "key": "name",
                "page": "input",
                "type": "form_plugin_v2",
                "group": "",
                "title": "姓名",
                "col_sm": "12",
                "toggle": false,
                "appName": "cms_system",
                "require": true,
                "readonly": "write",
                "formFormat": "{}",
                "style_data": {
                    "input": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    },
                    "label": {
                        "list": [],
                        "class": "form-label fs-base ",
                        "style": "",
                        "version": "v2"
                    },
                    "container": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    }
                },
                "form_config": {
                    "type": "text",
                    "title": "",
                    "input_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "title_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "place_holder": "請輸入姓名"
                },
                "deletable": false
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'email';
        })) {
            form_formats.push({
                "col": "12",
                "key": "email",
                "page": "input",
                "type": "form_plugin_v2",
                "group": "",
                "title": "信箱 / 帳號",
                "col_sm": "12",
                "toggle": false,
                "appName": "cms_system",
                "require": true,
                "readonly": "write",
                "formFormat": "{}",
                "style_data": {
                    "input": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    },
                    "label": {
                        "list": [],
                        "class": "form-label fs-base ",
                        "style": "",
                        "version": "v2"
                    },
                    "container": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    }
                },
                "form_config": {
                    "type": "email",
                    "title": "",
                    "input_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "title_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "place_holder": "請輸入電子信箱"
                },
                "deletable": false
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'phone';
        })) {
            form_formats.push({
                "col": "12",
                "key": "phone",
                "page": "input",
                "type": "form_plugin_v2",
                "group": "",
                "title": "手機",
                "col_sm": "12",
                "toggle": false,
                "appName": "cms_system",
                "require": false,
                "readonly": "write",
                "formFormat": "{}",
                "style_data": {
                    "input": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    },
                    "label": {
                        "list": [],
                        "class": "form-label fs-base ",
                        "style": "",
                        "version": "v2"
                    },
                    "container": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    }
                },
                "form_config": {
                    "type": "phone",
                    "title": "",
                    "input_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "title_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "place_holder": "請輸入手機號碼"
                },
                "deletable": false
            });
        }
        if (!form_formats.find((dd) => {
            return dd.key === 'birth';
        })) {
            form_formats.push({
                "col": "12",
                "key": "birth",
                "page": "input",
                "type": "form_plugin_v2",
                "group": "",
                "title": "生日",
                "col_sm": "12",
                "toggle": false,
                "appName": "cms_system",
                "require": true,
                "readonly": "write",
                "formFormat": "{}",
                "style_data": {
                    "input": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    },
                    "label": {
                        "list": [],
                        "class": "form-label fs-base ",
                        "style": "",
                        "version": "v2"
                    },
                    "container": {
                        "list": [],
                        "class": "",
                        "style": "",
                        "version": "v2"
                    }
                },
                "form_config": {
                    "type": "date",
                    "title": "",
                    "input_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "title_style": {
                        "list": [],
                        "version": "v2"
                    },
                    "place_holder": "請輸入你的出生日期"
                },
                "deletable": false
            });
        }
    }
}
exports.FormCheck = FormCheck;
//# sourceMappingURL=form-check.js.map