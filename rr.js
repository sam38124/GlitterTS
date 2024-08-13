const b = {
    "col": "12",
    "key": "repeatPwd",
    "page": "input",
    "type": "form_plugin_v2",
    "group": "",
    "title": "確認密碼",
    "col_sm": "12",
    "appName": "cms_system",
    "require": "true",
    "readonly": "write",
    "formFormat": "{}",
    "moduleName": "輸入框",
    "style_data": {
        "input": {"list": [], "class": "", "style": "", "version": "v2"},
        "label": {"list": [], "class": "form-label fs-base ", "style": "", "version": "v2"},
        "container": {"list": [], "class": "", "style": "", "version": "v2"}
    },
    "form_config": {
        "type": "password",
        "title": "",
        "input_style": {
            "list": [{
                "class": "",
                "style": "return `border-radius: ${widget.formData.radius}px;`",
                "stylist": [],
                "dataType": "code",
                "style_from": "code",
                "classDataType": "static"
            }],
            "class": "form-control form-control-lg mb-4",
            "style": "border: 1px solid var(--, #554233);background: #FFF;",
            "stylist": [],
            "version": "v2",
            "dataType": "static",
            "style_from": "code",
            "classDataType": "static"
        },
        "title_style": {
            "list": [{
                "class": "",
                "style": "return `color:${glitter.share.globalValue[`theme_color.0.title`]};`",
                "stylist": [],
                "dataType": "code",
                "style_from": "code",
                "classDataType": "static"
            }],
            "class": "form-label",
            "style": "font-size: 20px;font-style: normal;font-weight: 400;line-height: 140%; color:#393939;",
            "stylist": [],
            "version": "v2",
            "dataType": "static",
            "style_from": "code",
            "classDataType": "static"
        },
        "place_holder": "請再次確認密碼"
    }
}