"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScript = void 0;
var database_1 = require("./modules/database");
var UpdateScript = /** @class */ (function () {
    function UpdateScript() {
    }
    UpdateScript.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, b;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0;
                        return [4 /*yield*/, database_1.default.query('SELECT appName FROM glitter.app_config where brand=?;', ['shopnex'])];
                    case 1:
                        _a = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        b = _a[_i];
                        return [4 /*yield*/, this.footer_migrate(b.appName)];
                    case 3:
                        _b.sent();
                        console.log("pass=>", b.appName);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateArticle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pass, _i, _a, b;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pass = 0;
                        _i = 0;
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                                        FROM glitter.page_config\n                                         where tag = 'article';", [])];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        b = _a[_i];
                        pass++;
                        return [4 /*yield*/, database_1.default.query("update glitter.page_config set config=? where id=?", [
                                JSON.stringify([
                                    {
                                        "id": "sas6sas6s3s0ses0-s5sbs3s3-4scs0s4-sascsas4-s3s1s0s8s4sas4s9s7s5s0se",
                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                        "css": {
                                            "class": {},
                                            "style": {}
                                        },
                                        "data": {
                                            "attr": [
                                                {
                                                    "attr": "href",
                                                    "type": "par",
                                                    "value": "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
                                                    "expand": false,
                                                    "attrType": "normal",
                                                    "valueFrom": "manual"
                                                },
                                                {
                                                    "attr": "rel",
                                                    "type": "par",
                                                    "value": "stylesheet",
                                                    "expand": false,
                                                    "attrType": "normal"
                                                }
                                            ],
                                            "elem": "link",
                                            "note": "",
                                            "class": "",
                                            "inner": "",
                                            "style": "",
                                            "setting": [],
                                            "dataFrom": "static",
                                            "atrExpand": {
                                                "expand": true
                                            },
                                            "elemExpand": {
                                                "expand": true
                                            },
                                            "innerEvenet": {},
                                            "onCreateEvent": {}
                                        },
                                        "type": "widget",
                                        "index": 0,
                                        "label": "STYLE資源",
                                        "global": [],
                                        "styleList": [],
                                        "preloadEvenet": {}
                                    },
                                    {
                                        "id": "scs4s5s3s7scsbs1-s0sfsasc-4s6sfsa-sas6s9s0-s4s9s4sfs8s5sfs2s8ses2sd",
                                        "js": "$style1/official.js",
                                        "css": {
                                            "class": {},
                                            "style": {}
                                        },
                                        "data": {
                                            "attr": [],
                                            "elem": "style",
                                            "list": [],
                                            "inner": "/***請輸入設計代碼***/\n\n    .swiper {\n      width: 100%;\n      height: 100%;\n    }\n\n    .swiper-slide {\n      text-align: center;\n      font-size: 18px;\n      background: #fff;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    }\n\n    .swiper-slide img {\n      display: block;\n      width: 100%;\n      height: 100%;\n      object-fit: cover;\n    }\n\n\n\n    .swiper {\n      width: 100%;\n      height: 300px;\n      margin-left: auto;\n      margin-right: auto;\n    }\n\n    .swiper-slide {\n      background-size: cover;\n      background-position: center;\n    }\n\n    .mySwiper2 {\n      height: 80%;\n      width: 100%;\n    }\n\n    .mySwiper {\n      height: 20%;\n      box-sizing: border-box;\n      padding: 10px 0;\n    }\n\n    .mySwiper .swiper-slide {\n      width: 25%;\n      height: 100%;\n      opacity: 0.4;\n    }\n\n    .mySwiper .swiper-slide-thumb-active {\n      opacity: 1;\n    }\n\n    .swiper-slide img {\n      display: block;\n      width: 100%;\n      height: 100%;\n      object-fit: cover;\n    }",
                                            "version": "v2",
                                            "dataFrom": "static",
                                            "atrExpand": {
                                                "expand": true
                                            },
                                            "elemExpand": {
                                                "expand": true
                                            },
                                            "innerEvenet": {}
                                        },
                                        "type": "widget",
                                        "index": 1,
                                        "label": "STYLE代碼",
                                        "global": [],
                                        "onCreateEvent": {},
                                        "preloadEvenet": {}
                                    },
                                    {
                                        "id": "s4s6s3s3s3s1sbs7",
                                        "js": "./official_view_component/official.js",
                                        "css": {
                                            "class": {},
                                            "style": {}
                                        },
                                        "data": {
                                            "tag": "c_header",
                                            "list": [],
                                            "carryData": {},
                                            "_style_refer": "global",
                                            "elem": "div",
                                            "inner": "",
                                            "attr": [],
                                            "_padding": {},
                                            "_margin": {},
                                            "_border": {},
                                            "_max_width": "",
                                            "_gap": "",
                                            "_background": "",
                                            "_other": {},
                                            "_radius": "",
                                            "_reverse": "false",
                                            "_hor_position": "center",
                                            "_background_setting": {
                                                "type": "none"
                                            }
                                        },
                                        "list": [],
                                        "type": "component",
                                        "index": 2,
                                        "label": "嵌入模塊",
                                        "global": [],
                                        "version": "v2",
                                        "preloadEvenet": {},
                                        "editor_bridge": {},
                                        "mobile": {
                                            "refer": "custom",
                                            "data": {}
                                        },
                                        "mobile_editable": [],
                                        "desktop": {
                                            "refer": "custom",
                                            "data": {}
                                        },
                                        "desktop_editable": [],
                                        "container_fonts": 0
                                    },
                                    {
                                        "id": "s4sbses1sbsfs4sc",
                                        "js": "./official_view_component/official.js",
                                        "css": {
                                            "class": {},
                                            "style": {}
                                        },
                                        "data": {
                                            "tag": "art_template",
                                            "list": [],
                                            "carryData": {},
                                            "refer_app": "shop_template_black_style",
                                            "_style_refer": "global",
                                            "elem": "div",
                                            "inner": "",
                                            "attr": [],
                                            "_padding": {},
                                            "_margin": {},
                                            "_border": {},
                                            "_max_width": "",
                                            "_gap": "",
                                            "_background": "",
                                            "_other": {},
                                            "_radius": "",
                                            "_reverse": "false",
                                            "_hor_position": "center",
                                            "_background_setting": {
                                                "type": "none"
                                            }
                                        },
                                        "list": [],
                                        "type": "component",
                                        "class": "",
                                        "index": 3,
                                        "label": "網誌模板",
                                        "style": "",
                                        "global": [],
                                        "toggle": false,
                                        "stylist": [],
                                        "version": "v2",
                                        "dataType": "static",
                                        "style_from": "code",
                                        "classDataType": "static",
                                        "preloadEvenet": {},
                                        "editor_bridge": {},
                                        "mobile": {
                                            "id": "s4sbses1sbsfs4sc",
                                            "js": "./official_view_component/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "refer_app": "shop_template_black_style"
                                            },
                                            "list": [],
                                            "type": "component",
                                            "class": "",
                                            "index": 3,
                                            "label": "網誌模板",
                                            "style": "",
                                            "global": [],
                                            "toggle": false,
                                            "stylist": [],
                                            "version": "v2",
                                            "dataType": "static",
                                            "style_from": "code",
                                            "classDataType": "static",
                                            "preloadEvenet": {},
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {},
                                            "editor_bridge": {},
                                            "mobile_editable": [],
                                            "desktop_editable": [],
                                            "refer": "custom"
                                        },
                                        "mobile_editable": [],
                                        "desktop": {
                                            "id": "s4sbses1sbsfs4sc",
                                            "js": "./official_view_component/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "refer_app": "shop_template_black_style"
                                            },
                                            "list": [],
                                            "type": "component",
                                            "class": "",
                                            "index": 3,
                                            "label": "網誌模板",
                                            "style": "",
                                            "global": [],
                                            "toggle": false,
                                            "stylist": [],
                                            "version": "v2",
                                            "dataType": "static",
                                            "style_from": "code",
                                            "classDataType": "static",
                                            "preloadEvenet": {},
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {},
                                            "editor_bridge": {},
                                            "mobile_editable": [],
                                            "desktop_editable": [],
                                            "refer": "custom"
                                        },
                                        "desktop_editable": [],
                                        "container_fonts": 0
                                    },
                                    {
                                        "id": "sds0s9s1s1s6sbs7-s2s4s3sd-4s1scs8-s9s0s9s6-s4s5s1s9sdsds0sbs8s3s6s1",
                                        "js": "./official_view_component/official.js",
                                        "css": {
                                            "class": {},
                                            "style": {}
                                        },
                                        "data": {
                                            "tag": "footer",
                                            "list": [],
                                            "carryData": {},
                                            "_style_refer": "global",
                                            "elem": "div",
                                            "inner": "",
                                            "attr": [],
                                            "_padding": {},
                                            "_margin": {},
                                            "_border": {},
                                            "_max_width": "",
                                            "_gap": "",
                                            "_background": "",
                                            "_other": {},
                                            "_radius": "",
                                            "_reverse": "false",
                                            "_hor_position": "center",
                                            "_background_setting": {
                                                "type": "none"
                                            }
                                        },
                                        "list": [],
                                        "type": "component",
                                        "index": 4,
                                        "label": "嵌入模塊",
                                        "global": [],
                                        "version": "v2",
                                        "preloadEvenet": {},
                                        "editor_bridge": {},
                                        "mobile": {
                                            "refer": "custom",
                                            "data": {}
                                        },
                                        "mobile_editable": [],
                                        "desktop": {
                                            "refer": "custom",
                                            "data": {}
                                        },
                                        "desktop_editable": [],
                                        "container_fonts": 0
                                    }
                                ]),
                                b.id
                            ])];
                    case 3:
                        _b.sent();
                        console.log(pass);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.footer_migrate = function (app_name) {
        return __awaiter(this, void 0, void 0, function () {
            var cf, header, footer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                        FROM glitter.page_config\n                                        where appName = ?\n                                          and tag = 'footer';", [app_name])];
                    case 1:
                        cf = (_a.sent())[0];
                        if (!cf) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                                        FROM glitter.page_config\n                                        where appName = ?\n                                          and tag = 'c_header';", [app_name])];
                    case 2:
                        header = (_a.sent())[0]['config'];
                        footer = cf['config'];
                        if (!footer[0]) return [3 /*break*/, 4];
                        footer[0]['gCount'] = 'single';
                        footer[0]["arrayData"] = undefined;
                        footer = [footer[0]];
                        return [4 /*yield*/, database_1.default.query("update glitter.page_config\n                            set config=?\n                            where appName = ?\n                              and tag = 'footer'", [JSON.stringify(footer), app_name])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!header[0]) return [3 /*break*/, 6];
                        header[0]['gCount'] = 'single';
                        header[0]["arrayData"] = undefined;
                        header = [
                            header[0]
                        ];
                        // const obj={"id":"s2scscses9s3s6s9","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"tag":"MH-01","_gap":"","attr":[],"elem":"div","list":[],"inner":"","_other":{},"_border":{},"_margin":{},"_radius":"","_padding":{},"_reverse":"false","carryData":{},"refer_app":"shop_template_black_style","_max_width":"","_background":"","_style_refer":"global","_hor_position":"center","refer_form_data":{"logo":{"type":"text","value":"SHOPNEX"},"color":"black","option":[],"select":"#e8e8e8","title2":"","a_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"b_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"c_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"btn_color":"#ffffff","logo_text":{"type":"text","value":"Sample Shop"},"logo_type":"text","background":"#0d0d0d","theme_color":{"id":"0","title":"@{{theme_color.0.title}}","content":"@{{theme_color.0.content}}","background":"@{{theme_color.0.background}}","solid-button-bg":"@{{theme_color.0.solid-button-bg}}","border-button-bg":"@{{theme_color.0.border-button-bg}}","solid-button-text":"@{{theme_color.0.solid-button-text}}","border-button-text":"@{{theme_color.0.border-button-text}}"}},"_background_setting":{"type":"none"}},"list":[],"type":"component","class":"w-100","index":0,"label":"手機版標頭","style":"","gCount":"multiple","global":[],"mobile":{"id":"s1sds3s3s3sfs1s3","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-標頭","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((glitter.share.is_application) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"toggle":false,"desktop":{"id":"s1sds3s3s3sfs1s3","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-標頭","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((glitter.share.is_application) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((glitter.share.is_application) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{},"formData":{"logo":"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1708252131063-Screenshot 2024-02-18 at 6.22.20 PM.png","color":"black","option":[{"link":"?page=index","child":[],"index":0,"title":"首頁"},{"link":"./?page=all_product","child":[{"link":"?collection=狗狗&page=all_product","title":"狗狗專區"},{"link":"?collection=貓貓&page=all_product","title":"貓貓專區"}],"index":1,"title":"所有商品"},{"link":"?page=blog_list","child":[],"index":2,"title":"部落格 / 網誌"},{"link":"?page=aboutus","child":[],"index":3,"title":"關於我們"}],"select":"#554233","btn_color":"#000000","background":"#fcfcfc"}}
                        // if (!header[1]) {
                        //     header.push(obj)
                        // }else{
                        //     header[1]=obj
                        // }
                        return [4 /*yield*/, database_1.default.query("update glitter.page_config\n                            set config=?\n                            where appName = ?\n                              and tag = 'c_header'", [JSON.stringify(header), app_name])];
                    case 5:
                        // const obj={"id":"s2scscses9s3s6s9","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"tag":"MH-01","_gap":"","attr":[],"elem":"div","list":[],"inner":"","_other":{},"_border":{},"_margin":{},"_radius":"","_padding":{},"_reverse":"false","carryData":{},"refer_app":"shop_template_black_style","_max_width":"","_background":"","_style_refer":"global","_hor_position":"center","refer_form_data":{"logo":{"type":"text","value":"SHOPNEX"},"color":"black","option":[],"select":"#e8e8e8","title2":"","a_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"b_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"c_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"btn_color":"#ffffff","logo_text":{"type":"text","value":"Sample Shop"},"logo_type":"text","background":"#0d0d0d","theme_color":{"id":"0","title":"@{{theme_color.0.title}}","content":"@{{theme_color.0.content}}","background":"@{{theme_color.0.background}}","solid-button-bg":"@{{theme_color.0.solid-button-bg}}","border-button-bg":"@{{theme_color.0.border-button-bg}}","solid-button-text":"@{{theme_color.0.solid-button-text}}","border-button-text":"@{{theme_color.0.border-button-text}}"}},"_background_setting":{"type":"none"}},"list":[],"type":"component","class":"w-100","index":0,"label":"手機版標頭","style":"","gCount":"multiple","global":[],"mobile":{"id":"s1sds3s3s3sfs1s3","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-標頭","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((glitter.share.is_application) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"toggle":false,"desktop":{"id":"s1sds3s3s3sfs1s3","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-標頭","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((glitter.share.is_application) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((glitter.share.is_application) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{},"formData":{"logo":"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1708252131063-Screenshot 2024-02-18 at 6.22.20 PM.png","color":"black","option":[{"link":"?page=index","child":[],"index":0,"title":"首頁"},{"link":"./?page=all_product","child":[{"link":"?collection=狗狗&page=all_product","title":"狗狗專區"},{"link":"?collection=貓貓&page=all_product","title":"貓貓專區"}],"index":1,"title":"所有商品"},{"link":"?page=blog_list","child":[],"index":2,"title":"部落格 / 網誌"},{"link":"?page=aboutus","child":[],"index":3,"title":"關於我們"}],"select":"#554233","btn_color":"#000000","background":"#fcfcfc"}}
                        // if (!header[1]) {
                        //     header.push(obj)
                        // }else{
                        //     header[1]=obj
                        // }
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.container_migrate = function (app_name) {
        return __awaiter(this, void 0, void 0, function () {
            function loop(widget) {
                if (widget.type === 'container') {
                    widget.data.setting.map(function (dd) {
                        loop(dd);
                    });
                }
                function loopWidget(widget) {
                    if (widget) {
                        if (widget.data && widget.data._style_refer === 'global' && widget.data._style_refer_global && widget.data._style_refer_global.index) {
                            if (global_theme_1[parseInt(widget.data._style_refer_global.index, 10)]) {
                                var obj_1 = global_theme_1[parseInt(widget.data._style_refer_global.index, 10)].data;
                                Object.keys(obj_1).map(function (dd) {
                                    widget.data[dd] = obj_1[dd];
                                });
                            }
                        }
                        if (widget.data) {
                            widget.data._style_refer = 'custom';
                        }
                    }
                }
                loopWidget(widget);
                loopWidget(widget.mobile);
                loopWidget(widget.desktop);
            }
            var global_theme_1, page_config, _i, page_config_1, b, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                                                  FROM glitter.app_config\n                                                  where appName = ?;", [app_name])];
                    case 1:
                        global_theme_1 = (_a.sent())[0]['config']['container_theme'];
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                                                 FROM glitter.page_config\n                                                 where appName = ?\n                                                   and tag = 'index';", [app_name])];
                    case 2:
                        page_config = (_a.sent())[0]['config'];
                        for (_i = 0, page_config_1 = page_config; _i < page_config_1.length; _i++) {
                            b = page_config_1[_i];
                            loop(b);
                        }
                        return [4 /*yield*/, database_1.default.query("update glitter.page_config\n                            set config=?\n                            where appName = ?\n                              and tag = 'index';", [JSON.stringify(page_config), app_name])];
                    case 3:
                        _a.sent();
                        console.log("migrate-finish-".concat(app_name));
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrate_blogs_toPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blogs, _i, blogs_1, b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                      FROM shopnex.t_manager_post\n                                      where content ->>'$.for_index'='false' and content->>'$.page_type'='blog'", [])];
                    case 1:
                        blogs = _a.sent();
                        _i = 0, blogs_1 = blogs;
                        _a.label = 2;
                    case 2:
                        if (!(_i < blogs_1.length)) return [3 /*break*/, 5];
                        b = blogs_1[_i];
                        b.content.page_type = 'page';
                        return [4 /*yield*/, database_1.default.query("update shopnex.t_manager_post\n                            set content=?\n                            where id = ?", [
                                JSON.stringify(b.content),
                                b.id
                            ])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateHomePageFooter = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, appList_1, b, homePage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, appList_1 = appList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < appList_1.length)) return [3 /*break*/, 5];
                        b = appList_1[_i];
                        return [4 /*yield*/, database_1.default.query("select *\n                                              from glitter.page_config\n                                              where appName = ?\n                                                and tag = ?", [b, 'index'])];
                    case 2:
                        homePage = (_a.sent())[0];
                        homePage.config[0]['deletable'] = 'false';
                        homePage.config[homePage.config.length - 1]['deletable'] = 'false';
                        homePage.created_time = new Date();
                        homePage.config = JSON.stringify(homePage.config);
                        homePage.page_config = JSON.stringify(homePage.page_config);
                        return [4 /*yield*/, database_1.default.query("update glitter.page_config\n                            set ?\n                            where id = ?", [
                                homePage, homePage.id
                            ])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateInitialConfig = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var private_config, public_config, pb_config2, _i, appList_2, v, _a, private_config_1, b, _b, public_config_1, b, _c, pb_config2_1, b;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select *\n                                             from glitter.private_config\n                                             where app_name = ?", ['t_1719819344426'])];
                    case 1:
                        private_config = _d.sent();
                        return [4 /*yield*/, database_1.default.query("select *\n                                            from `t_1719819344426`.t_user_public_config", [])];
                    case 2:
                        public_config = _d.sent();
                        return [4 /*yield*/, database_1.default.query("select *\n                                         from `t_1719819344426`.public_config", [])];
                    case 3:
                        pb_config2 = _d.sent();
                        _i = 0, appList_2 = appList;
                        _d.label = 4;
                    case 4:
                        if (!(_i < appList_2.length)) return [3 /*break*/, 20];
                        v = appList_2[_i];
                        _a = 0, private_config_1 = private_config;
                        _d.label = 5;
                    case 5:
                        if (!(_a < private_config_1.length)) return [3 /*break*/, 9];
                        b = private_config_1[_a];
                        b.id = undefined;
                        b.app_name = v;
                        b.updated_at = new Date();
                        if (typeof b.value === 'object') {
                            b.value = JSON.stringify(b.value);
                        }
                        return [4 /*yield*/, database_1.default.query("delete\n                                from glitter.private_config\n                                where app_name = ?\n                                  and `key` = ?", [v, b.key])];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, database_1.default.query("insert into glitter.private_config\n                                set ?", [
                                b
                            ])];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 5];
                    case 9:
                        _b = 0, public_config_1 = public_config;
                        _d.label = 10;
                    case 10:
                        if (!(_b < public_config_1.length)) return [3 /*break*/, 14];
                        b = public_config_1[_b];
                        b.id = undefined;
                        b.updated_at = new Date();
                        if (typeof b.value === 'object') {
                            b.value = JSON.stringify(b.value);
                        }
                        return [4 /*yield*/, database_1.default.query("delete\n                                from `".concat(v, "`.t_user_public_config\n                                where `key` = ?\n                                  and id > 0"), [b.key])];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, database_1.default.query("insert into `".concat(v, "`.t_user_public_config\n                                set ?"), [
                                b
                            ])];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13:
                        _b++;
                        return [3 /*break*/, 10];
                    case 14:
                        _c = 0, pb_config2_1 = pb_config2;
                        _d.label = 15;
                    case 15:
                        if (!(_c < pb_config2_1.length)) return [3 /*break*/, 19];
                        b = pb_config2_1[_c];
                        b.id = undefined;
                        b.updated_at = new Date();
                        if (typeof b.value === 'object') {
                            b.value = JSON.stringify(b.value);
                        }
                        return [4 /*yield*/, database_1.default.query("delete\n                                from `".concat(v, "`.public_config\n                                where `key` = ?\n                                  and id > 0"), [b.key])];
                    case 16:
                        _d.sent();
                        return [4 /*yield*/, database_1.default.query("insert into `".concat(v, "`.public_config\n                                set ?"), [
                                b
                            ])];
                    case 17:
                        _d.sent();
                        _d.label = 18;
                    case 18:
                        _c++;
                        return [3 /*break*/, 15];
                    case 19:
                        _i++;
                        return [3 /*break*/, 4];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateSinglePage = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var cart_footer, index2, _i, appList_3, b, image, index, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cart_footer = {
                            "id": "sdsds5s9s9sasbs8",
                            "js": "./official_view_component/official.js",
                            "css": { "class": {}, "style": {} },
                            "data": {
                                "refer_app": "shop_template_black_style",
                                "tag": "sy01_checkout_detail",
                                "list": [],
                                "carryData": {}
                            },
                            "type": "component",
                            "class": "w-100",
                            "index": 0,
                            "label": "SY01-購物車詳情",
                            "style": "",
                            "bundle": {},
                            "global": [],
                            "toggle": false,
                            "stylist": [],
                            "dataType": "static",
                            "style_from": "code",
                            "classDataType": "static",
                            "preloadEvenet": {},
                            "share": {},
                            "formData": {},
                            "refreshAllParameter": {},
                            "refreshComponentParameter": {},
                            "list": [],
                            "version": "v2",
                            "storage": {},
                            "mobile": { "refer": "def" },
                            "desktop": { "refer": "def" }
                        };
                        index2 = 0;
                        _i = 0, appList_3 = appList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < appList_3.length)) return [3 /*break*/, 12];
                        b = appList_3[_i];
                        index2 = index2 + 1;
                        return [4 /*yield*/, database_1.default.query("delete\n                            from glitter.page_config\n                            where appName = ?\n                              and tag = ?", [b, 'spa'])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("delete\n                            from glitter.page_config\n                            where appName = ?\n                              and tag = ?", [b, 'spa' + index2])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("delete\n                            from glitter.page_config\n                            where appName = ?\n                              and tag = ?", ['shop_template_black_style', 'spa' + index2])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                                           FROM glitter.app_config\n                                           where appName = ?", [b])];
                    case 5:
                        image = (_a.sent())[0].template_config.image[0];
                        return [4 /*yield*/, database_1.default.query("select *\n                                           from glitter.page_config\n                                           where appName = ?\n                                             and tag = ?", [b, 'index'])];
                    case 6:
                        index = (_a.sent())[0];
                        index.config.splice(index.config.length - 1, 1);
                        index.config.splice(0, 1);
                        index.config.push(cart_footer);
                        index.page_config = {
                            "list": [],
                            "version": "v2",
                            "formData": {},
                            "formFormat": [],
                            "resource_from": "global"
                        };
                        index.template_type = 2;
                        index.group = '一頁商店';
                        index.tag = 'spa' + index2;
                        index.name = "\u4E00\u9801\u8CFC\u7269-AS".concat((index2 < 10) ? "0".concat(index2) : index2);
                        index.appName = 'shop_template_black_style';
                        index.template_config = {
                            "tag": ["一頁購物"],
                            "desc": "",
                            "name": "\u4E00\u9801\u8CFC\u7269-AS".concat((index2 < 10) ? "0".concat(index2) : index2),
                            "image": [image],
                            "status": "wait",
                            "post_to": "all",
                            "version": "1.0",
                            "created_by": "liondesign.io",
                            "preview_img": image
                        };
                        index.template_config = JSON.stringify(index.template_config);
                        index.config = JSON.stringify(index.config);
                        index.page_config = JSON.stringify(index.page_config);
                        index.id = undefined;
                        return [4 /*yield*/, database_1.default.query("delete\n                            from shop_template_black_style.t_manager_post\n                            where id > 0\n                              and content ->>'$.tag'=?", [
                                index.tag
                            ])];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("insert into shop_template_black_style.t_manager_post\n                            set ?", [
                                {
                                    userID: index.userID,
                                    content: JSON.stringify({
                                        "seo": {},
                                        "tag": index.tag,
                                        "name": index.name,
                                        "type": "article",
                                        "config": JSON.parse(index.config),
                                        "relative": "collection",
                                        "template": "article",
                                        "for_index": "false",
                                        "generator": "page_editor",
                                        "page_type": "page",
                                        "collection": [],
                                        "relative_data": [],
                                        "with_discount": "false"
                                    })
                                }
                            ])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("insert into glitter.page_config\n                                         set ?", [index])];
                    case 9:
                        data = _a.sent();
                        return [4 /*yield*/, database_1.default.query("replace\n            into glitter.t_template_tag  (`type`,tag,bind) values (?,?,?)", [
                                'page', '一頁購物', data.insertId
                            ])
                            //
                        ];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateLink = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, appList_4, appName, _a, appList_5, b;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, appList_4 = appList;
                        _b.label = 1;
                    case 1:
                        if (!(_i < appList_4.length)) return [3 /*break*/, 7];
                        appName = appList_4[_i];
                        _a = 0, appList_5 = appList;
                        _b.label = 2;
                    case 2:
                        if (!(_a < appList_5.length)) return [3 /*break*/, 6];
                        b = appList_5[_a];
                        return [4 /*yield*/, database_1.default.query("update `".concat(b, "`.t_user_public_config\n                                set value=?\n                                where `key` = 'menu-setting'\n                                  and id > 0"), [JSON.stringify([
                                    {
                                        "link": "./index",
                                        "items": [],
                                        "title": "首頁"
                                    },
                                    {
                                        "link": "/all-product",
                                        "items": [
                                            {
                                                "link": "/all-product?collection=分類一",
                                                "items": [],
                                                "title": "分類一"
                                            },
                                            {
                                                "link": "/all-product?collection=分類二",
                                                "items": [],
                                                "title": "分類二"
                                            }
                                        ],
                                        "title": "所有商品",
                                        "toggle": false
                                    },
                                    {
                                        "link": "/blogs",
                                        "items": [],
                                        "title": "部落格 / 網誌"
                                    },
                                    {
                                        "link": "./pages/about-us",
                                        "items": [],
                                        "title": "關於我們"
                                    }
                                ])])];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, database_1.default.query("update `".concat(b, "`.t_user_public_config\n                                set value=?\n                                where `key` = 'footer-setting'\n                                  and id > 0"), [JSON.stringify([{
                                        "link": "",
                                        "items": [{
                                                "link": "./?page=aboutus",
                                                "items": [],
                                                "title": "品牌故事"
                                            }, { "link": "./?page=contact-us", "items": [], "title": "加入我們" }, {
                                                "link": "./?page=blog_list",
                                                "items": [],
                                                "title": "最新消息"
                                            }],
                                        "title": "關於我們",
                                        "toggle": false
                                    }, {
                                        "link": "",
                                        "items": [{
                                                "link": "./?page=ask",
                                                "items": [],
                                                "title": "常見問題"
                                            }, { "link": "./?page=refund_privacy", "items": [], "title": "退換貨政策" }, {
                                                "link": "",
                                                "items": [],
                                                "title": "購物須知"
                                            }, { "link": "", "items": [], "title": "實體店面" }],
                                        "title": "購買相關",
                                        "toggle": false
                                    }, {
                                        "link": "",
                                        "items": [{
                                                "link": "",
                                                "items": [],
                                                "title": "營業時間 : 10:00～19:00"
                                            }, { "link": "http://lin.ee/s212wq", "items": [], "title": "line客服 : @sam31212" }, {
                                                "link": "",
                                                "items": [],
                                                "title": "電話：0912345678"
                                            }, { "link": "", "items": [], "title": "統一編號 : 90687281" }],
                                        "title": "聯絡我們",
                                        "toggle": true
                                    }])])];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 2];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateRichText = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page_list, _i, page_list_1, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select page_config, id\n                                           FROM glitter.page_config\n                                           where template_type = 2", [])];
                    case 1:
                        page_list = (_a.sent());
                        page_list.map(function (d) {
                            d.page_config = JSON.parse(JSON.stringify(d.page_config).replace(/multiple_line_text/g, 'rich_text'));
                        });
                        _i = 0, page_list_1 = page_list;
                        _a.label = 2;
                    case 2:
                        if (!(_i < page_list_1.length)) return [3 /*break*/, 5];
                        p = page_list_1[_i];
                        return [4 /*yield*/, database_1.default.query("update glitter.page_config\n                            set page_config=?\n                            where id = ?", [JSON.stringify(p.page_config), p.id])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateAccount = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            var page_list, _i, page_list_2, b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                           FROM glitter.page_config\n                                           where appName = 't_1725992531001'\n                                             and tag = 'advertise'", [])];
                    case 1:
                        page_list = (_a.sent());
                        page_list.map(function (d) {
                            Object.keys(d).map(function (dd) {
                                if (typeof d[dd] === 'object') {
                                    d[dd] = JSON.stringify(d[dd]);
                                }
                            });
                        });
                        _i = 0, page_list_2 = page_list;
                        _a.label = 2;
                    case 2:
                        if (!(_i < page_list_2.length)) return [3 /*break*/, 6];
                        b = page_list_2[_i];
                        return [4 /*yield*/, database_1.default.query("delete\n                            from glitter.page_config\n                            where appName = ".concat(database_1.default.escape(appName), "\n                              and tag = ?"), [b.tag])];
                    case 3:
                        _a.sent();
                        b['appName'] = appName;
                        b['id'] = undefined;
                        b['updated_time'] = new Date();
                        b['created_time'] = new Date();
                        return [4 /*yield*/, database_1.default.query("insert into glitter.page_config\n                            set ?", [
                                b
                            ])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6:
                        console.log("appName=>".concat(appName));
                        return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateHeaderAndFooterAndCollection = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var rebate_page, _i, appList_6, b, _a, rebate_page_1, c;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                             FROM t_1719819344426.t_user_public_config\n                                             where `key` in ('menu-setting', 'footer-setting', 'blog_collection');", [])];
                    case 1:
                        rebate_page = (_b.sent());
                        _i = 0, appList_6 = appList;
                        _b.label = 2;
                    case 2:
                        if (!(_i < appList_6.length)) return [3 /*break*/, 7];
                        b = appList_6[_i];
                        _a = 0, rebate_page_1 = rebate_page;
                        _b.label = 3;
                    case 3:
                        if (!(_a < rebate_page_1.length)) return [3 /*break*/, 6];
                        c = rebate_page_1[_a];
                        if (typeof c.value !== 'string') {
                            c.value = JSON.stringify(c.value);
                        }
                        return [4 /*yield*/, database_1.default.query("replace\n                into `".concat(b, "`.t_user_public_config set ?"), [
                                c
                            ])];
                    case 4:
                        (_b.sent());
                        _b.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 3];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migratePages = function (appList, migrate) {
        return __awaiter(this, void 0, void 0, function () {
            var rebate_page, _i, appList_7, b, _a, rebate_page_2, c;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                             FROM t_1719819344426.t_manager_post\n                                             where content ->> '$.type' = 'article'\n                                               and content ->> '$.tag' in (".concat(migrate.map(function (dd) {
                            return "\"".concat(dd, "\"");
                        }).join(','), ")"), [])];
                    case 1:
                        rebate_page = (_b.sent());
                        rebate_page.map(function (dd) {
                            dd.content.template = 'article';
                            dd.content = JSON.stringify(dd.content);
                            dd['id'] = undefined;
                        });
                        _i = 0, appList_7 = appList;
                        _b.label = 2;
                    case 2:
                        if (!(_i < appList_7.length)) return [3 /*break*/, 8];
                        b = appList_7[_i];
                        return [4 /*yield*/, database_1.default.query("delete\n                            from `".concat(b, "`.t_manager_post\n                            where content ->> '$.type' = 'article' "), [])];
                    case 3:
                        _b.sent();
                        _a = 0, rebate_page_2 = rebate_page;
                        _b.label = 4;
                    case 4:
                        if (!(_a < rebate_page_2.length)) return [3 /*break*/, 7];
                        c = rebate_page_2[_a];
                        return [4 /*yield*/, database_1.default.query("insert into `".concat(b, "`.t_manager_post\n                                set ?"), [
                                c
                            ])];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _a++;
                        return [3 /*break*/, 4];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateRebatePage = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var rebate_page, migrate, _i, migrate_1, b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                             FROM glitter.page_config\n                                             where appName = 't_1719819344426'\n                                               and tag = 'rebate'", [])];
                    case 1:
                        rebate_page = (_a.sent())[0];
                        migrate = appList;
                        Object.keys(rebate_page).map(function (dd) {
                            if (typeof rebate_page[dd] === 'object') {
                                rebate_page[dd] = JSON.stringify(rebate_page[dd]);
                            }
                        });
                        _i = 0, migrate_1 = migrate;
                        _a.label = 2;
                    case 2:
                        if (!(_i < migrate_1.length)) return [3 /*break*/, 6];
                        b = migrate_1[_i];
                        return [4 /*yield*/, database_1.default.query("delete\n                            from glitter.page_config\n                            where appName = ".concat(database_1.default.escape(b), "\n                              and tag = 'rebate'"), [])];
                    case 3:
                        _a.sent();
                        rebate_page['id'] = undefined;
                        rebate_page['appName'] = b;
                        rebate_page['created_time'] = new Date();
                        return [4 /*yield*/, database_1.default.query("insert into glitter.page_config\n                            set ?", [
                                rebate_page
                            ])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateDialog = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var page_list, global_event, _i, appList_8, appName, _a, page_list_3, b, _b, global_event_1, b_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                           FROM glitter.page_config\n                                           where appName = 'shop_template_black_style'\n                                             and tag in ('loading_dialog', 'toast', 'false_dialog')", [])];
                    case 1:
                        page_list = (_c.sent());
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                                              FROM cms_system.t_global_event;", [])];
                    case 2:
                        global_event = (_c.sent());
                        page_list.map(function (d) {
                            Object.keys(d).map(function (dd) {
                                if (typeof d[dd] === 'object') {
                                    d[dd] = JSON.stringify(d[dd]);
                                }
                            });
                        });
                        _i = 0, appList_8 = appList;
                        _c.label = 3;
                    case 3:
                        if (!(_i < appList_8.length)) return [3 /*break*/, 10];
                        appName = appList_8[_i];
                        _a = 0, page_list_3 = page_list;
                        _c.label = 4;
                    case 4:
                        if (!(_a < page_list_3.length)) return [3 /*break*/, 9];
                        b = page_list_3[_a];
                        return [4 /*yield*/, database_1.default.query("delete\n                                from glitter.page_config\n                                where appName = ".concat(database_1.default.escape(appName), "\n                                  and tag = ?"), [b.tag])];
                    case 5:
                        _c.sent();
                        b['appName'] = appName;
                        b['id'] = undefined;
                        b['created_time'] = new Date();
                        b['updated_time'] = new Date();
                        return [4 /*yield*/, database_1.default.query("insert into glitter.page_config\n                                set ?", [
                                b
                            ])];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, database_1.default.query("replace\n                into `".concat(appName, "`.t_global_event\n                            (tag,name,json) values ?"), [
                                global_event.map(function (dd) {
                                    dd.id = undefined;
                                    return [
                                        dd.tag,
                                        dd.name,
                                        JSON.stringify(dd.json)
                                    ];
                                })
                            ])];
                    case 7:
                        _c.sent();
                        for (_b = 0, global_event_1 = global_event; _b < global_event_1.length; _b++) {
                            b_1 = global_event_1[_b];
                        }
                        _c.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 4];
                    case 9:
                        _i++;
                        return [3 /*break*/, 3];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.hiddenEditorAble = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hidden_page, _loop_1, _i, hidden_page_1, b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                            FROM glitter.page_config\n                                            where tag!='index' and page_config->>'$.support_editor'=\"true\";", [])];
                    case 1:
                        hidden_page = _a.sent();
                        _loop_1 = function (b) {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        b.page_config.support_editor = 'false';
                                        b['id'] = undefined;
                                        Object.keys(b).map(function (dd) {
                                            if (typeof b[dd] === 'object') {
                                                b[dd] = JSON.stringify(b[dd]);
                                            }
                                        });
                                        b['created_time'] = new Date();
                                        b['updated_time'] = new Date();
                                        return [4 /*yield*/, database_1.default.query("replace\n            into glitter.page_config\n                            set ?", [
                                                b
                                            ])];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, hidden_page_1 = hidden_page;
                        _a.label = 2;
                    case 2:
                        if (!(_i < hidden_page_1.length)) return [3 /*break*/, 5];
                        b = hidden_page_1[_i];
                        return [5 /*yield**/, _loop_1(b)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateHeader = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var page_list, _i, appList_9, appName, _a, page_list_4, b;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                           FROM glitter.page_config\n                                           where appName = 't_1719819344426'\n                                             and tag in ('c_header')", [])];
                    case 1:
                        page_list = (_b.sent());
                        page_list.map(function (d) {
                            Object.keys(d).map(function (dd) {
                                if (typeof d[dd] === 'object') {
                                    d[dd] = JSON.stringify(d[dd]);
                                }
                            });
                        });
                        _i = 0, appList_9 = appList;
                        _b.label = 2;
                    case 2:
                        if (!(_i < appList_9.length)) return [3 /*break*/, 8];
                        appName = appList_9[_i];
                        _a = 0, page_list_4 = page_list;
                        _b.label = 3;
                    case 3:
                        if (!(_a < page_list_4.length)) return [3 /*break*/, 7];
                        b = page_list_4[_a];
                        return [4 /*yield*/, database_1.default.query("delete\n                                from glitter.page_config\n                                where appName = ".concat(database_1.default.escape(appName), "\n                                  and tag = ?"), [b.tag])];
                    case 4:
                        _b.sent();
                        b['appName'] = appName;
                        b['id'] = undefined;
                        b['created_time'] = new Date();
                        b['updated_time'] = new Date();
                        return [4 /*yield*/, database_1.default.query("insert into glitter.page_config\n                                set ?", [
                                b
                            ])];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _a++;
                        return [3 /*break*/, 3];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UpdateScript.migrateFooter = function (appList) {
        return __awaiter(this, void 0, void 0, function () {
            var page_list, _i, appList_10, appName, _a, page_list_5, b;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("SELECT *\n                                           FROM glitter.page_config\n                                           where appName = 't_1719819344426'\n                                             and tag in ('c_header')", [])];
                    case 1:
                        page_list = (_b.sent());
                        page_list.map(function (d) {
                            Object.keys(d).map(function (dd) {
                                if (typeof d[dd] === 'object') {
                                    d[dd] = JSON.stringify(d[dd]);
                                }
                            });
                        });
                        _i = 0, appList_10 = appList;
                        _b.label = 2;
                    case 2:
                        if (!(_i < appList_10.length)) return [3 /*break*/, 8];
                        appName = appList_10[_i];
                        _a = 0, page_list_5 = page_list;
                        _b.label = 3;
                    case 3:
                        if (!(_a < page_list_5.length)) return [3 /*break*/, 7];
                        b = page_list_5[_a];
                        return [4 /*yield*/, database_1.default.query("delete\n                                from glitter.page_config\n                                where appName = ".concat(database_1.default.escape(appName), "\n                                  and tag = ?"), [b.tag])];
                    case 4:
                        _b.sent();
                        b['appName'] = appName;
                        b['id'] = undefined;
                        b['created_time'] = new Date();
                        b['updated_time'] = new Date();
                        return [4 /*yield*/, database_1.default.query("insert into glitter.page_config\n                                set ?", [
                                b
                            ])];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _a++;
                        return [3 /*break*/, 3];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return UpdateScript;
}());
exports.UpdateScript = UpdateScript;
