"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsolutePathCheck = void 0;
//判斷是否為codeBase絕對路徑
var html = String.raw;
var AbsolutePathCheck = /** @class */ (function () {
    function AbsolutePathCheck() {
    }
    AbsolutePathCheck.check = function (page) {
        //         switch (page) {
        //             case 'sy01_checkout_detail':
        //                 return AbsolutePathCheck.getTemplate(`return new Promise((resolve) => {
        //     glitter.getModule(new URL('./public-components/checkout/index.js', gvc.glitter.root_path).href, (res) => {
        //         resolve(res.main(gvc, widget, subData));
        //     });
        // })`)
        //         }
    };
    AbsolutePathCheck.getTemplate = function (code) {
        return {
            "id": -1,
            "userID": "manager",
            "appName": "none",
            "tag": "index",
            "group": "",
            "name": "自訂模塊",
            "config": [{
                    "id": "s0s1sfs8s4s9ses1",
                    "js": "https://shopnex.cc/official_view_component/official.js",
                    "css": { "class": {}, "style": {} },
                    "data": {
                        "_gap": "",
                        "attr": [],
                        "elem": "div",
                        "list": [],
                        "inner": "",
                        "_other": {},
                        "_border": {},
                        "_margin": {},
                        "_radius": "",
                        "setting": [{
                                "id": "scs0s7sdsfsases0",
                                "js": "https://shopnex.cc/official_view_component/official.js",
                                "css": { "class": {}, "style": {} },
                                "data": {
                                    "_gap": "",
                                    "attr": [],
                                    "elem": "div",
                                    "list": [],
                                    "inner": "",
                                    "_other": {},
                                    "_border": {},
                                    "_margin": {},
                                    "_radius": "",
                                    "version": "v2",
                                    "_padding": {},
                                    "_reverse": "false",
                                    "dataFrom": "code",
                                    "atrExpand": {},
                                    "_max_width": "",
                                    "elemExpand": {},
                                    "_background": "",
                                    "innerEvenet": {
                                        "clickEvent": [{
                                                "code": code,
                                                "clickEvent": { "src": "./official_event/event.js", "route": "code" },
                                                "codeVersion": "v2"
                                            }]
                                    },
                                    "_style_refer": "global",
                                    "_hor_position": "center",
                                    "_background_setting": { "type": "none" },
                                    "_style_refer_global": { "index": "0" }
                                },
                                "type": "widget",
                                "index": 0,
                                "label": "HTML元件",
                                "global": [],
                                "mobile": { "refer": "def" },
                                "desktop": { "refer": "def" },
                                "editor_bridge": {},
                                "preloadEvenet": {},
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }],
                        "version": "v2",
                        "_padding": {},
                        "_reverse": "false",
                        "atrExpand": {},
                        "_max_width": "",
                        "elemExpand": {},
                        "_background": "",
                        "_style_refer": "global",
                        "_hor_position": "center",
                        "_background_setting": { "type": "none" },
                        "_style_refer_global": { "index": "0" }
                    },
                    "type": "container",
                    "index": 2,
                    "label": "code base 容器",
                    "gCount": "multiple",
                    "global": [],
                    "mobile": { "refer": "def" },
                    "toggle": false,
                    "desktop": { "refer": "def" },
                    "arrayData": {
                        "clickEvent": [{
                                "code": "return [subData];",
                                "clickEvent": { "src": "./official_event/event.js", "route": "code" },
                                "codeVersion": "v2"
                            }]
                    },
                    "hiddenEvent": {},
                    "editor_bridge": {},
                    "onCreateEvent": {},
                    "onResumtEvent": {},
                    "preloadEvenet": {},
                    "onDestoryEvent": {},
                    "onInitialEvent": {},
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                }],
            "page_type": "page",
            "page_config": {
                "seo": {
                    "type": "global"
                },
                "list": [],
                "version": "v2",
                "formData": {},
                "formFormat": [],
                "resource_from": "global",
                "globalStyleTag": [],
                "support_editor": "true"
            },
            "created_time": "2024-11-04T05:11:49.000Z",
            "preview_image": null,
            "favorite": 0,
            "template_config": null,
            "template_type": 0,
            "updated_time": "2024-11-04T05:11:49.000Z"
        };
    };
    return AbsolutePathCheck;
}());
exports.AbsolutePathCheck = AbsolutePathCheck;
