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
exports.App = void 0;
var database_1 = require("../modules/database");
var exception_1 = require("../modules/exception");
var config_1 = require("../config");
var index_js_1 = require("../index.js");
var aws_sdk_1 = require("aws-sdk");
var config_js_1 = require("../config.js");
var fs_1 = require("fs");
var ssh_js_1 = require("../modules/ssh.js");
var nginx_conf_1 = require("nginx-conf");
var process = require("process");
var public_table_check_js_1 = require("../api-public/services/public-table-check.js");
var backend_service_js_1 = require("./backend-service.js");
var template_js_1 = require("./template.js");
var tool_1 = require("./tool");
var path_1 = require("path");
var app_initial_js_1 = require("./app-initial.js");
var user_js_1 = require("../api-public/services/user.js");
var App = /** @class */ (function () {
    function App(token) {
        this.token = token;
    }
    App.getAdConfig = function (app, key) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select `value`\n                 from `".concat(config_js_1.default.DB_NAME, "`.private_config\n                 where app_name = '").concat(app, "'\n                   and `key` = ").concat(database_1.default.escape(key)), [])];
                    case 1:
                        data = _a.sent();
                        resolve(data[0] ? data[0]['value'] : {});
                        return [2 /*return*/];
                }
            });
        }); });
    };
    App.prototype.checkVersion = function (libraryName) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDir, packageJsonPath, packageJson, dependencies, devDependencies;
            return __generator(this, function (_a) {
                currentDir = process.cwd();
                packageJsonPath = path_1.default.join(currentDir, 'package.json');
                // 读取 package.json 文件内容
                if (fs_1.default.existsSync(packageJsonPath)) {
                    packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
                    dependencies = packageJson.dependencies || {};
                    devDependencies = packageJson.devDependencies || {};
                    if (dependencies[libraryName]) {
                        return [2 /*return*/, dependencies[libraryName]];
                    }
                    else if (devDependencies[libraryName]) {
                        return [2 /*return*/, devDependencies[libraryName]];
                    }
                    else {
                        throw new Error("Library ".concat(libraryName, " is not listed in dependencies or devDependencies"));
                    }
                }
                else {
                    throw new Error('package.json not found in the current directory');
                }
                return [2 /*return*/];
            });
        });
    };
    App.prototype.createApp = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var count, domain_count, copyAppData, copyPageData, privateConfig, trans, _i, _a, dd, _b, _c, dd, _d, _e, dd, _f, _g, dd, _h, _j, dd, _k, privateConfig_1, dd, _l, copyPageData_1, dd, store_information, _m, _o, b, e_1;
            var _p, _q, _r, _s;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        _t.trys.push([0, 58, , 60]);
                        cf.copyWith = (_p = cf.copyWith) !== null && _p !== void 0 ? _p : [];
                        cf.sub_domain = cf.sub_domain.replace(/\./g, '');
                        return [4 /*yield*/, database_1.default.execute("\n                    select count(1)\n                    from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                    where appName = ").concat(database_1.default.escape(cf.appName), "\n                "), [])];
                    case 1:
                        count = _t.sent();
                        if (count[0]['count(1)'] === 1) {
                            throw exception_1.default.BadRequestError('HAVE_APP', 'This app already be used.', null);
                        }
                        return [4 /*yield*/, database_1.default.execute("\n                    select count(1)\n                    from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                    where domain = ").concat(database_1.default.escape("".concat(cf.sub_domain, ".").concat(config_js_1.default.HostedDomain)), "\n                "), [])];
                    case 2:
                        domain_count = _t.sent();
                        if (domain_count[0]['count(1)'] === 1) {
                            throw exception_1.default.BadRequestError('HAVE_DOMAIN', 'This domain already be used.', null);
                        }
                        copyAppData = undefined;
                        copyPageData = undefined;
                        privateConfig = undefined;
                        if (!cf.copyApp) return [3 /*break*/, 7];
                        return [4 /*yield*/, public_table_check_js_1.ApiPublic.createScheme(cf.copyApp)];
                    case 3:
                        _t.sent();
                        return [4 /*yield*/, database_1.default.execute("select *\n                         from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                         where appName = ").concat(database_1.default.escape(cf.copyApp)), [])];
                    case 4:
                        copyAppData = (_t.sent())[0];
                        return [4 /*yield*/, database_1.default.execute("select *\n                     from `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n                     where appName = ").concat(database_1.default.escape(cf.copyApp)), [])];
                    case 5:
                        copyPageData = _t.sent();
                        return [4 /*yield*/, database_1.default.execute("select *\n                     from `".concat(config_1.saasConfig.SAAS_NAME, "`.private_config\n                     where app_name = ").concat(database_1.default.escape(cf.copyApp), " "), [])];
                    case 6:
                        privateConfig = _t.sent();
                        _t.label = 7;
                    case 7: return [4 /*yield*/, database_1.default.execute("insert into `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config (user, appName, dead_line, `config`,\n                                                                     brand, theme_config, refer_app,\n                                                                     template_config)\n                 values (?, ?, ?, ").concat(database_1.default.escape(JSON.stringify((copyAppData && copyAppData.config) || {})), ",\n                         ").concat(database_1.default.escape((_q = cf.brand) !== null && _q !== void 0 ? _q : config_1.saasConfig.SAAS_NAME), ",\n                         ").concat(database_1.default.escape(JSON.stringify((_r = (copyAppData && copyAppData.theme_config)) !== null && _r !== void 0 ? _r : { name: (copyAppData && copyAppData.template_config && copyAppData.template_config.name) || cf.name })), ",\n                         ").concat(cf.theme ? database_1.default.escape(cf.theme) : 'null', ",\n                         ").concat(database_1.default.escape(JSON.stringify((copyAppData && copyAppData.template_config) || {})), ")"), [this.token.userID, cf.appName, addDays(new Date(), config_1.saasConfig.DEF_DEADLINE)])];
                    case 8:
                        _t.sent();
                        return [4 /*yield*/, this.putSubDomain({
                                app_name: cf.appName,
                                name: cf.sub_domain,
                            })];
                    case 9:
                        _t.sent();
                        return [4 /*yield*/, public_table_check_js_1.ApiPublic.createScheme(cf.appName)];
                    case 10:
                        _t.sent();
                        return [4 /*yield*/, database_1.default.Transaction.build()];
                    case 11:
                        trans = _t.sent();
                        if (!(cf.copyWith.indexOf('manager_post') !== -1)) return [3 /*break*/, 16];
                        _i = 0;
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                     FROM `".concat(cf.copyApp, "`.t_manager_post"), [])];
                    case 12:
                        _a = _t.sent();
                        _t.label = 13;
                    case 13:
                        if (!(_i < _a.length)) return [3 /*break*/, 16];
                        dd = _a[_i];
                        dd.content = dd.content && JSON.stringify(dd.content);
                        dd.userID = this.token.userID;
                        return [4 /*yield*/, trans.execute("\n                            insert into `".concat(cf.appName, "`.t_manager_post\n                            SET ?;\n                        "), [dd])];
                    case 14:
                        _t.sent();
                        _t.label = 15;
                    case 15:
                        _i++;
                        return [3 /*break*/, 13];
                    case 16:
                        if (!(cf.copyWith.indexOf('user_post') !== -1)) return [3 /*break*/, 21];
                        _b = 0;
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                     FROM `".concat(cf.copyApp, "`.t_post"), [])];
                    case 17:
                        _c = _t.sent();
                        _t.label = 18;
                    case 18:
                        if (!(_b < _c.length)) return [3 /*break*/, 21];
                        dd = _c[_b];
                        dd.content = dd.content && JSON.stringify(dd.content);
                        return [4 /*yield*/, trans.execute("\n                            insert into `".concat(cf.appName, "`.t_post\n                            SET ?;\n                        "), [dd])];
                    case 19:
                        _t.sent();
                        _t.label = 20;
                    case 20:
                        _b++;
                        return [3 /*break*/, 18];
                    case 21:
                        _d = 0;
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                 FROM `".concat(cf.copyApp, "`.t_global_event"), [])];
                    case 22:
                        _e = _t.sent();
                        _t.label = 23;
                    case 23:
                        if (!(_d < _e.length)) return [3 /*break*/, 26];
                        dd = _e[_d];
                        dd.json = dd.json && JSON.stringify(dd.json);
                        return [4 /*yield*/, trans.execute("\n                        insert into `".concat(cf.appName, "`.t_global_event\n                        SET ?;\n                    "), [dd])];
                    case 24:
                        _t.sent();
                        _t.label = 25;
                    case 25:
                        _d++;
                        return [3 /*break*/, 23];
                    case 26:
                        if (!(cf.copyWith.indexOf('public_config') !== -1)) return [3 /*break*/, 36];
                        _f = 0;
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                     FROM `".concat(cf.copyApp, "`.public_config"), [])];
                    case 27:
                        _g = _t.sent();
                        _t.label = 28;
                    case 28:
                        if (!(_f < _g.length)) return [3 /*break*/, 31];
                        dd = _g[_f];
                        dd.value = dd.value && JSON.stringify(dd.value);
                        if (!!['editorGuide', 'guideable', 'guide'].includes(dd.key)) return [3 /*break*/, 30];
                        return [4 /*yield*/, trans.execute("\n                                insert into `".concat(cf.appName, "`.public_config\n                                SET ?;\n                            "), [dd])];
                    case 29:
                        _t.sent();
                        _t.label = 30;
                    case 30:
                        _f++;
                        return [3 /*break*/, 28];
                    case 31:
                        _h = 0;
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                     FROM `".concat(cf.copyApp, "`.t_user_public_config"), [])];
                    case 32:
                        _j = _t.sent();
                        _t.label = 33;
                    case 33:
                        if (!(_h < _j.length)) return [3 /*break*/, 36];
                        dd = _j[_h];
                        dd.value = dd.value && JSON.stringify(dd.value);
                        if (!(dd.userID !== 'manager' && !['custom_form_checkout', 'custom_form_register', 'customer_form_user_setting', 'robot_auto_reply', 'image-manager', 'message_setting'].includes(dd.key))) return [3 /*break*/, 35];
                        return [4 /*yield*/, trans.execute("\n                                insert\n                                ignore into `".concat(cf.appName, "`.t_user_public_config\n                                SET ?;\n                            "), [dd])];
                    case 34:
                        _t.sent();
                        _t.label = 35;
                    case 35:
                        _h++;
                        return [3 /*break*/, 33];
                    case 36:
                        if (!privateConfig) return [3 /*break*/, 40];
                        _k = 0, privateConfig_1 = privateConfig;
                        _t.label = 37;
                    case 37:
                        if (!(_k < privateConfig_1.length)) return [3 /*break*/, 40];
                        dd = privateConfig_1[_k];
                        if (dd.key === 'logistics_setting') {
                            dd.value = {
                                form: [],
                                info: '<p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\' id="isPasted">感謝您在 SHOPNEX 購買商品，商品的包裝與配送</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>預計花費約 3 到 6 週，煩請耐心等候！</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>若約定配送日當天未能聯繫到你，因而無法完成配送</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>商家會約定再次配送的時間，您將支付額外的運費。</p>',
                                support: ['OKMARTC2C', 'shop', 'FAMIC2C', 'UNIMARTC2C'],
                                custom_delivery: [],
                                whiteListExpand: {},
                            };
                        }
                        if (dd.key === 'glitter_shipment') {
                            dd.value = {
                                volume: [],
                                weight: [],
                                selectCalc: 'volume',
                            };
                        }
                        return [4 /*yield*/, trans.execute("\n                            insert into `".concat(config_1.saasConfig.SAAS_NAME, "`.private_config (`app_name`, `key`, `value`, updated_at)\n                            values (?, ?, ?, ?);\n                        "), [cf.appName, dd.key, JSON.stringify(dd.value), new Date()])];
                    case 38:
                        _t.sent();
                        _t.label = 39;
                    case 39:
                        _k++;
                        return [3 /*break*/, 37];
                    case 40:
                        if (!copyPageData) return [3 /*break*/, 45];
                        _l = 0, copyPageData_1 = copyPageData;
                        _t.label = 41;
                    case 41:
                        if (!(_l < copyPageData_1.length)) return [3 /*break*/, 44];
                        dd = copyPageData_1[_l];
                        if (!(dd.tag !== 'index-app')) return [3 /*break*/, 43];
                        return [4 /*yield*/, trans.execute("\n                            insert into `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config (userID, appName, tag, `group`,\n                                                                                 `name`,\n                                                                                 `config`, `page_config`, page_type)\n                            values (?, ?, ?, ?, ?, ").concat(database_1.default.escape(JSON.stringify(dd.config)), ",\n                                    ").concat(database_1.default.escape(JSON.stringify(dd.page_config)), ", ").concat(database_1.default.escape(dd.page_type), ");\n                        "), [this.token.userID, cf.appName, dd.tag, dd.group || '未分類', dd.name])];
                    case 42:
                        _t.sent();
                        _t.label = 43;
                    case 43:
                        _l++;
                        return [3 /*break*/, 41];
                    case 44: return [3 /*break*/, 47];
                    case 45: return [4 /*yield*/, trans.execute("\n                        insert into `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config (userID, appName, tag, `group`, `name`,\n                                                                             `config`, `page_config`)\n                        values (?, ?, ?, ?, ?, ").concat(database_1.default.escape(JSON.stringify({})), ", ").concat(database_1.default.escape(JSON.stringify({})), ");\n                    "), [this.token.userID, cf.appName, 'index', '', '首頁'])];
                    case 46:
                        _t.sent();
                        _t.label = 47;
                    case 47: return [4 /*yield*/, trans.commit()];
                    case 48:
                        _t.sent();
                        return [4 /*yield*/, database_1.default.query("select *\n                     from `".concat(cf.appName, "`.t_user_public_config\n                     where `key` = ? "), ["store-information"])];
                    case 49:
                        store_information = (_t.sent())[0];
                        if (!store_information) return [3 /*break*/, 51];
                        return [4 /*yield*/, database_1.default.query("delete\n                     from `".concat(cf.appName, "`.t_user_public_config\n                     where `key` = ?\n                       and id > 0"), ['store-information'])];
                    case 50:
                        _t.sent();
                        _t.label = 51;
                    case 51:
                        _m = 0, _o = app_initial_js_1.AppInitial.main(cf.appName);
                        _t.label = 52;
                    case 52:
                        if (!(_m < _o.length)) return [3 /*break*/, 55];
                        b = _o[_m];
                        return [4 /*yield*/, database_1.default.query(b.sql, [b.obj])];
                    case 53:
                        _t.sent();
                        _t.label = 54;
                    case 54:
                        _m++;
                        return [3 /*break*/, 52];
                    case 55: return [4 /*yield*/, database_1.default.query("insert into `".concat(cf.appName, "`.t_user_public_config\n                 set ?"), [
                            {
                                key: 'store-information',
                                user_id: 'manager',
                                updated_at: new Date(),
                                value: JSON.stringify({
                                    shop_name: cf.name,
                                }),
                            },
                        ])];
                    case 56:
                        _t.sent();
                        return [4 /*yield*/, (0, index_js_1.createAPP)(cf)];
                    case 57:
                        _t.sent();
                        return [2 /*return*/, true];
                    case 58:
                        e_1 = _t.sent();
                        return [4 /*yield*/, database_1.default.query("delete\n                 from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 where appName = ?"), [cf.appName])];
                    case 59:
                        _t.sent();
                        console.log(e_1);
                        throw exception_1.default.BadRequestError((_s = e_1.code) !== null && _s !== void 0 ? _s : 'BAD_REQUEST', e_1, null);
                    case 60: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.updateThemeConfig = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.query("update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 set theme_config=?\n                 where appName = ?"), [JSON.stringify(body.config), body.theme])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_2 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_2.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_2, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.changeTheme = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_app_name, temp_app_theme, tran, cf_app, e_3;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 13, , 14]);
                        temp_app_name = tool_1.default.randomString(4) + new Date().getTime();
                        temp_app_theme = tool_1.default.randomString(4) + new Date().getTime();
                        return [4 /*yield*/, database_1.default.Transaction.build()];
                    case 1:
                        tran = _f.sent();
                        return [4 /*yield*/, database_1.default.query("select `domain`, `dead_line`, `plan`\n                     from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                     where appName = ").concat(database_1.default.escape(config.app_name)), [])];
                    case 2:
                        cf_app = (_f.sent())[0];
                        /*
                         * 交換APP和theme的資料
                         * */
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 set appName=").concat(database_1.default.escape(temp_app_name), ",\n                     refer_app=").concat(database_1.default.escape(config.app_name), ",\n                     domain=null\n                 where appName = ").concat(database_1.default.escape(config.app_name), "\n                   and user = ?"), [(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID])];
                    case 3:
                        /*
                         * 交換APP和theme的資料
                         * */
                        _f.sent();
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 set appName=").concat(database_1.default.escape(temp_app_theme), ",\n                     refer_app=null,\n                     domain=").concat(cf_app['domain'] ? database_1.default.escape(cf_app['domain']) : 'null', ",\n                     dead_line=").concat(cf_app['dead_line'] ? database_1.default.escape(cf_app['dead_line']) : 'null', ",\n                     plan=").concat(cf_app['plan'] ? database_1.default.escape(cf_app['plan']) : 'null', "\n                 where appName = ").concat(database_1.default.escape(config.theme), "\n                   and user = ?"), [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID])];
                    case 4:
                        _f.sent();
                        /*
                         * 將APP name 寫回去
                         * */
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 set appName=").concat(database_1.default.escape(config.app_name), "\n                 where appName = ").concat(database_1.default.escape(temp_app_theme), "\n                   and user = ?"), [(_c = this.token) === null || _c === void 0 ? void 0 : _c.userID])];
                    case 5:
                        /*
                         * 將APP name 寫回去
                         * */
                        _f.sent();
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 set appName=").concat(database_1.default.escape(config.theme), "\n                 where appName = ").concat(database_1.default.escape(temp_app_name), "\n                   and user = ?"), [(_d = this.token) === null || _d === void 0 ? void 0 : _d.userID])];
                    case 6:
                        _f.sent();
                        /*
                         * 交換PageConfig
                         * */
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n                 set appName=").concat(database_1.default.escape(temp_app_name), "\n                 where appName = ").concat(database_1.default.escape(config.app_name), "\n                "), [])];
                    case 7:
                        /*
                         * 交換PageConfig
                         * */
                        _f.sent();
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n                 set appName=").concat(database_1.default.escape(temp_app_theme), "\n                 where appName = ").concat(database_1.default.escape(config.theme), "\n                "), [])];
                    case 8:
                        _f.sent();
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n                 set appName=").concat(database_1.default.escape(config.app_name), "\n                 where appName = ").concat(database_1.default.escape(temp_app_theme), "\n                "), [])];
                    case 9:
                        _f.sent();
                        return [4 /*yield*/, tran.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n                 set appName=").concat(database_1.default.escape(config.theme), "\n                 where appName = ").concat(database_1.default.escape(temp_app_name), "\n                "), [])];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, tran.commit()];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, tran.release()];
                    case 12:
                        _f.sent();
                        return [2 /*return*/, true];
                    case 13:
                        e_3 = _f.sent();
                        console.log("error-->", e_3);
                        throw exception_1.default.BadRequestError((_e = e_3.code) !== null && _e !== void 0 ? _e : 'BAD_REQUEST', e_3, null);
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.getAPP = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var empStores_1, allStores, e_4;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                 FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                 WHERE user = '").concat(this.token.userID, "'\n                   AND status = 1\n                   AND invited = 1;"), [])];
                    case 1:
                        empStores_1 = _b.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT *\n                 FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 WHERE ").concat((function () {
                                var sql = [
                                    "(user = '".concat(_this.token.userID, "' OR appName = \n                            (SELECT appName FROM `").concat(config_1.saasConfig.SAAS_NAME, "`.app_auth_config\n                            WHERE user = '").concat(_this.token.userID, "' AND status = 1 AND invited = 1)\n                        )"),
                                ];
                                if (query.app_name) {
                                    sql.push(" appName='".concat(query.app_name, "' "));
                                }
                                else if (query.theme) {
                                    sql.push(" refer_app='".concat(query.theme, "' "));
                                }
                                else {
                                    sql.push(" refer_app is null ");
                                }
                                return sql.join(' and ');
                            })(), ";\n                "), [])];
                    case 2:
                        allStores = _b.sent();
                        return [2 /*return*/, allStores.map(function (store) {
                                var type = empStores_1.find(function (st) { return st.appName === store.appName; });
                                store.store_permission_title = type ? 'employee' : 'owner';
                                return store;
                            })];
                    case 3:
                        e_4 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_4.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_4, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.getTemplate = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.execute("\n                    SELECT user, appName, created_time, dead_line, brand, template_config, template_type, domain\n                    FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                    where ").concat((function () {
                                var sql = [];
                                query.template_from === 'me' && sql.push("user = '".concat(_this.token.userID, "'"));
                                query.template_from === 'me' && sql.push("template_type in (3,2)");
                                query.template_from === 'all' && sql.push("template_type = 2");
                                return sql
                                    .map(function (dd) {
                                    return "(".concat(dd, ")");
                                })
                                    .join(' and ');
                            })(), ";\n                "), [])];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        e_5 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_5.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_5, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.getAppConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var data, pluginList, e_6;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.execute("\n                        SELECT config, `dead_line`, `template_config`, `template_type`\n                        FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                        where appName = ").concat(database_1.default.escape(config.appName), ";\n                    "), [])];
                    case 1:
                        data = (_e.sent())[0];
                        pluginList = (_a = data['config']) !== null && _a !== void 0 ? _a : {};
                        pluginList.dead_line = data.dead_line;
                        pluginList.pagePlugin = (_b = pluginList.pagePlugin) !== null && _b !== void 0 ? _b : [];
                        pluginList.eventPlugin = (_c = pluginList.eventPlugin) !== null && _c !== void 0 ? _c : [];
                        pluginList.template_config = data.template_config;
                        pluginList.template_type = data.template_type;
                        return [2 /*return*/, pluginList];
                    case 2:
                        e_6 = _e.sent();
                        throw exception_1.default.BadRequestError((_d = e_6.code) !== null && _d !== void 0 ? _d : 'BAD_REQUEST', e_6, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.getOfficialPlugin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.execute("\n                    SELECT *\n                    FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.official_component;\n                "), [])];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        e_7 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_7.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_7, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    App.checkBrandAndMemberType = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var appConfig, userData, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query("SELECT brand, domain, plan, user as userId\n                     FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                     WHERE appName = ?"), [app])];
                    case 1:
                        appConfig = (_d.sent())[0];
                        if (!appConfig) {
                            throw new Error("App \"".concat(app, "\" not found in app_config"));
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT userData\n                     FROM `".concat(appConfig.brand, "`.t_user\n                     WHERE userID = ?"), [appConfig.userId])];
                    case 2:
                        userData = (_d.sent())[0];
                        //試用版本是企業方案
                        appConfig.plan = appConfig.plan || 'app-year';
                        return [2 /*return*/, {
                                memberType: (_b = (_a = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _a === void 0 ? void 0 : _a.menber_type) !== null && _b !== void 0 ? _b : null, // 避免 userData 為 undefined
                                brand: appConfig.brand,
                                userData: (_c = userData === null || userData === void 0 ? void 0 : userData.userData) !== null && _c !== void 0 ? _c : {},
                                domain: appConfig.domain,
                                plan: appConfig.plan,
                                user_id: appConfig.userId,
                            }];
                    case 3:
                        error_1 = _d.sent();
                        console.error(error_1);
                        throw exception_1.default.BadRequestError('ERROR', 'checkBrandAndMemberType error' + error_1, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    App.preloadPageData = function (appName, refer_page, language) {
        return __awaiter(this, void 0, void 0, function () {
            var start, page, app, preloadData, pageData, event_list, index, str, regex, str2, matches, match, _i, matches_1, b, event_, checkPass, mapPush, eval_code_hash, match1, code;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        start = new Date().getTime();
                        return [4 /*yield*/, template_js_1.Template.getRealPage(refer_page, appName)];
                    case 1:
                        page = _b.sent();
                        console.log("preload-0==>", (new Date().getTime() - start) / 1000);
                        app = new App();
                        _a = {
                            component: []
                        };
                        return [4 /*yield*/, app.getAppConfig({
                                appName: appName,
                            })];
                    case 2:
                        preloadData = (_a.appConfig = _b.sent(),
                            _a.event = [],
                            _a);
                        return [4 /*yield*/, new template_js_1.Template(undefined).getPage({
                                appName: appName,
                                tag: page,
                                language: language,
                            })];
                    case 3:
                        pageData = (_b.sent())[0];
                        event_list = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../lowcode/official_event/event.js'), 'utf8');
                        index = "TriggerEvent.create(import.meta.url,";
                        str = "(".concat(event_list.substring(event_list.indexOf(index) + index.length));
                        regex = /TriggerEvent\.setEventRouter\(import\.meta\.url,\s*['"](.+?)['"]\)/g;
                        str2 = str;
                        matches = [];
                        while ((match = regex.exec(str)) !== null) {
                            matches.push(match[0]); // 将整个匹配的字符串加入数组
                        }
                        for (_i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                            b = matches_1[_i];
                            str2 = str2.replace(b, "\"".concat(b, "\""));
                        }
                        event_ = eval(str2);
                        if (!pageData) {
                            return [2 /*return*/, {}];
                        }
                        preloadData.component.push(pageData);
                        checkPass = 0;
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                function loop(array) {
                                    var _this = this;
                                    var _loop_1 = function (dd) {
                                        if (dd.type === 'container') {
                                            loop(dd.data.setting);
                                        }
                                        else if (dd.type === 'component') {
                                            checkPass++;
                                            new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                var pageData;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, new template_js_1.Template(undefined).getPage({
                                                                appName: dd.data.refer_app || appName,
                                                                tag: dd.data.tag,
                                                                language: language,
                                                            })];
                                                        case 1:
                                                            pageData = (_b.sent())[0];
                                                            if (pageData && pageData.config) {
                                                                preloadData.component.push(pageData);
                                                                loop((_a = pageData.config) !== null && _a !== void 0 ? _a : []);
                                                            }
                                                            resolve(true);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }).then(function () {
                                                checkPass--;
                                                if (checkPass === 0) {
                                                    resolve(true);
                                                }
                                            });
                                        }
                                    };
                                    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                                        var dd = array_1[_i];
                                        _loop_1(dd);
                                    }
                                }
                                return __generator(this, function (_a) {
                                    loop(pageData && pageData.config);
                                    if (checkPass === 0) {
                                        resolve(true);
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 4:
                        _b.sent();
                        console.log("preload-2==>", (new Date().getTime() - start) / 1000);
                        mapPush = {};
                        mapPush['getPlugin'] = {
                            callback: [],
                            data: { response: { data: preloadData.appConfig, result: true } },
                            isRunning: true,
                        };
                        preloadData.component.map(function (dd) {
                            mapPush["getPageData-".concat(dd.appName, "-").concat(dd.tag)] = {
                                callback: [],
                                isRunning: true,
                                data: { response: { result: [dd] } },
                            };
                        });
                        eval_code_hash = {};
                        console.log("preload-3==>", (new Date().getTime() - start) / 1000);
                        match1 = JSON.stringify(preloadData.component).match(/\{"src":"\.\/official_event\/[^"]+\.js","route":"[^"]+"}/g);
                        code = JSON.stringify(preloadData.component).match(/\{"code":"[^"]+","/g);
                        (code || []).map(function (dd) {
                            try {
                                var code_1 = JSON.parse(dd.substring(0, dd.length - 2) + '}');
                                eval_code_hash[tool_1.default.checksum(code_1.code)] = code_1.code;
                            }
                            catch (e) {
                                console.log("error->", dd);
                            }
                        });
                        console.log("preload-4==>", (new Date().getTime() - start) / 1000);
                        // 輸出結果
                        if (match1) {
                            match1.map(function (d1) {
                                if (!preloadData.event.find(function (dd) {
                                    return event_[JSON.parse(d1)['route']] === dd;
                                })) {
                                    preloadData.event.push(event_[JSON.parse(d1)['route']]);
                                }
                            });
                        }
                        else {
                            console.log('未找到匹配的字串');
                        }
                        console.log("preload-5==>", (new Date().getTime() - start) / 1000);
                        mapPush.eval_code_hash = eval_code_hash;
                        mapPush.event = preloadData.event;
                        return [2 /*return*/, mapPush];
                }
            });
        });
    };
    App.prototype.setAppConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var official, trans, _i, _a, b, e_8;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, database_1.default.query("SELECT count(1)\n                         FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.t_user\n                         where userID = ?"), [this.token.userID, 'LION'])];
                    case 1:
                        official = (_d.sent())[0]['count(1)'] == 1;
                        if (!official) return [3 /*break*/, 9];
                        return [4 /*yield*/, database_1.default.Transaction.build()];
                    case 2:
                        trans = _d.sent();
                        return [4 /*yield*/, trans.execute("delete\n                     from `".concat(config_1.saasConfig.SAAS_NAME, "`.official_component\n                     where app_name = ?"), [config.appName])];
                    case 3:
                        _d.sent();
                        _i = 0, _a = (_b = config.data.lambdaView) !== null && _b !== void 0 ? _b : [];
                        _d.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        b = _a[_i];
                        return [4 /*yield*/, trans.execute("insert into `".concat(config_1.saasConfig.SAAS_NAME, "`.official_component\n                         set ?"), [
                                {
                                    key: b.key,
                                    group: b.name,
                                    userID: this.token.userID,
                                    app_name: config.appName,
                                    url: b.path,
                                },
                            ])];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, trans.commit()];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [4 /*yield*/, database_1.default.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                         set config=?,\n                             update_time=?\n                         where appName = ").concat(database_1.default.escape(config.appName), "\n                           and user = '").concat(this.token.userID, "'\n                        "), [config.data, new Date()])];
                    case 10: return [2 /*return*/, ((_d.sent())['changedRows'] == true)];
                    case 11:
                        e_8 = _d.sent();
                        throw exception_1.default.BadRequestError((_c = e_8.code) !== null && _c !== void 0 ? _c : 'BAD_REQUEST', e_8, null);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.postTemplate = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var template_type, officialAccount, e_9;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        template_type = '0';
                        if (config.data.post_to === 'all') {
                            officialAccount = ((_a = process.env.OFFICIAL_ACCOUNT) !== null && _a !== void 0 ? _a : '').split(',');
                            if (officialAccount.indexOf("".concat(this.token.userID)) !== -1) {
                                template_type = '2';
                            }
                            else {
                                template_type = '1';
                            }
                        }
                        else if (config.data.post_to === 'me') {
                            template_type = '3';
                        }
                        return [4 /*yield*/, database_1.default.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                         set template_config = ?,\n                             template_type=").concat(template_type, "\n                         where appName = ").concat(database_1.default.escape(config.appName), "\n                           and user = '").concat(this.token.userID, "'\n                        "), [config.data])];
                    case 1: return [2 /*return*/, ((_c.sent())['changedRows'] == true)];
                    case 2:
                        e_9 = _c.sent();
                        throw exception_1.default.BadRequestError((_b = e_9.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', e_9, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.putSubDomain = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var domain_name, result, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        domain_name = "".concat(cf.name, ".").concat(config_js_1.default.HostedDomain);
                        return [4 /*yield*/, database_1.default.query("SELECT count(1)\n                     FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                     where domain =").concat(database_1.default.escape(domain_name)), [])];
                    case 1:
                        if (!((_c.sent())[0]['count(1)'] === 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.addDNSRecord(domain_name)];
                    case 2:
                        result = _c.sent();
                        _a = this.setSubDomain;
                        _b = {};
                        return [4 /*yield*/, database_1.default.query("SELECT domain\n                         FROM `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                         where appName=?;"), [cf.app_name])];
                    case 3: return [4 /*yield*/, _a.apply(this, [(_b.original_domain = (_c.sent())[0]['domain'],
                                _b.appName = cf.app_name,
                                _b.domain = domain_name,
                                _b)])];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 5: throw exception_1.default.BadRequestError('ERROR', 'ERROR.THIS DOMAIN ALREADY USED.', null);
                }
            });
        });
    };
    App.prototype.addDNSRecord = function (domain) {
        console.log("addDNSRecord->".concat(domain));
        return new Promise(function (resolve, reject) {
            var route53 = new aws_sdk_1.default.Route53();
            var params = {
                ChangeBatch: {
                    Changes: [
                        {
                            Action: 'CREATE', // 或 'UPSERT' 如果記錄已存在
                            ResourceRecordSet: {
                                Name: domain, // 您的域名
                                Type: 'A',
                                TTL: 600, // 時間以秒為單位，TTL 的數值
                                ResourceRecords: [
                                    {
                                        Value: config_js_1.default.sshIP, // 目標 IP 地址
                                    },
                                ],
                            },
                        },
                    ],
                    Comment: 'Adding A record for example.com',
                },
                HostedZoneId: config_js_1.default.AWS_HostedZoneId, // 您的托管區域 ID
            };
            route53.changeResourceRecordSets(params, function (err, data) {
                resolve(true);
            });
        });
    };
    App.prototype.setSubDomain = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var checkExists, e_10;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select count(1)\n                     from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                     where domain =?\n                       and user !=?"), [config.domain, this.token.userID])];
                    case 1:
                        checkExists = (_b.sent())['count(1)'] > 0;
                        if (checkExists ||
                            config.domain.split('.').find(function (dd) {
                                return !dd;
                            })) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'this domain already on use.', null);
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        //             const data = await Ssh.readFile(`/etc/nginx/sites-enabled/default.conf`);
                        //             let result: string = await new Promise((resolve, reject) => {
                        //                 NginxConfFile.createFromSource(data as string, (err, conf) => {
                        //                     const server: any = [];
                        //                     for (const b of conf!.nginx.server as any) {
                        //                         if (!b.server_name.toString().includes(`server_name ${config.domain};`) && !b.server_name.toString().includes(`server_name ${config.original_domain};`)) {
                        //                             server.push(b);
                        //                         }
                        //                     }
                        //                     conf!.nginx.server = server;
                        //                     resolve(conf!.toString());
                        //                 });
                        //             });
                        //             result += `\n\nserver {
                        //     server_name ${config.domain};
                        //     location / {
                        //        proxy_pass http://127.0.0.1:3080/${config.appName}/;
                        //        proxy_set_header X-Real-IP $remote_addr;
                        //        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        //        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
                        //     }
                        //     listen 443 ssl;
                        //     ssl_certificate ${process.env.ssl_certificate};
                        //     ssl_certificate_key ${process.env.ssl_certificate_key};
                        // }
                        // server {
                        //     if ($host = ${config.domain}) {
                        //         return 301 https://$host$request_uri;
                        //     }
                        //     server_name ${config.domain};
                        //     listen 80;
                        //     return 404;
                        // }
                        // `;
                        //             fs.writeFileSync('/nginx.config', result);
                        //             const response = await new Promise((resolve, reject) => {
                        //                 Ssh.exec([`sudo docker cp $(sudo docker ps --filter "expose=3080" --format "{{.ID}}"):/nginx.config /etc/nginx/sites-enabled/default.conf`, `sudo nginx -s reload`]).then(
                        //                     (res: any) => {
                        //                         resolve(res && res.join('').indexOf('Successfully') !== -1);
                        //                     }
                        //                 );
                        //             });
                        return [4 /*yield*/, database_1.default.execute("\n                    update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                    set domain=?\n                    where domain = ?\n                "), [null, config.domain])];
                    case 3:
                        //             const data = await Ssh.readFile(`/etc/nginx/sites-enabled/default.conf`);
                        //             let result: string = await new Promise((resolve, reject) => {
                        //                 NginxConfFile.createFromSource(data as string, (err, conf) => {
                        //                     const server: any = [];
                        //                     for (const b of conf!.nginx.server as any) {
                        //                         if (!b.server_name.toString().includes(`server_name ${config.domain};`) && !b.server_name.toString().includes(`server_name ${config.original_domain};`)) {
                        //                             server.push(b);
                        //                         }
                        //                     }
                        //                     conf!.nginx.server = server;
                        //                     resolve(conf!.toString());
                        //                 });
                        //             });
                        //             result += `\n\nserver {
                        //     server_name ${config.domain};
                        //     location / {
                        //        proxy_pass http://127.0.0.1:3080/${config.appName}/;
                        //        proxy_set_header X-Real-IP $remote_addr;
                        //        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        //        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
                        //     }
                        //     listen 443 ssl;
                        //     ssl_certificate ${process.env.ssl_certificate};
                        //     ssl_certificate_key ${process.env.ssl_certificate_key};
                        // }
                        // server {
                        //     if ($host = ${config.domain}) {
                        //         return 301 https://$host$request_uri;
                        //     }
                        //     server_name ${config.domain};
                        //     listen 80;
                        //     return 404;
                        // }
                        // `;
                        //             fs.writeFileSync('/nginx.config', result);
                        //             const response = await new Promise((resolve, reject) => {
                        //                 Ssh.exec([`sudo docker cp $(sudo docker ps --filter "expose=3080" --format "{{.ID}}"):/nginx.config /etc/nginx/sites-enabled/default.conf`, `sudo nginx -s reload`]).then(
                        //                     (res: any) => {
                        //                         resolve(res && res.join('').indexOf('Successfully') !== -1);
                        //                     }
                        //                 );
                        //             });
                        _b.sent();
                        return [4 /*yield*/, database_1.default.execute("\n                    update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                    set domain=?\n                    where appName = ?\n                "), [config.domain, config.appName])];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        e_10 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_10.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_10, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.setDomain = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var checkExists, data_1, result, response, e_11;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("select count(1)\n                     from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                     where domain =?\n                       and user !=?"), [config.domain, this.token.userID])];
                    case 1:
                        checkExists = (_b.sent())['count(1)'] > 0;
                        if (checkExists) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', 'this domain already on use.', null);
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, ssh_js_1.Ssh.readFile('/etc/nginx/sites-enabled/default.conf')];
                    case 3:
                        data_1 = _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                nginx_conf_1.NginxConfFile.createFromSource(data_1, function (err, conf) {
                                    var server = [];
                                    for (var _i = 0, _a = conf.nginx.server; _i < _a.length; _i++) {
                                        var b = _a[_i];
                                        if ((!b.server_name) || (!b.server_name.toString().includes("server_name ".concat(config.domain, ";")) && !b.server_name.toString().includes("server_name ".concat(config.original_domain, ";")))) {
                                            server.push(b);
                                        }
                                    }
                                    conf.nginx.server = server;
                                    resolve(conf.toString());
                                });
                            })];
                    case 4:
                        result = _b.sent();
                        result += "\n\nserver {\n       server_name ".concat(config.domain, ";\n    location / {\n       proxy_pass http://127.0.0.1:3080/").concat(config.appName, "/;\n       proxy_set_header X-Real-IP $remote_addr;\n       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;\n    }\n}");
                        fs_1.default.writeFileSync('/nginx.config', result);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ssh_js_1.Ssh.exec([
                                    "sudo docker cp $(sudo docker ps --filter \"expose=3080\" --format \"{{.ID}}\"):/nginx.config /etc/nginx/sites-enabled/default.conf",
                                    "sudo certbot --nginx -d ".concat(config.domain, " --non-interactive --agree-tos -m sam38124@gmail.com"),
                                    "sudo nginx -s reload",
                                ]).then(function (res) {
                                    console.log("response-ssh->", res && res.join(''));
                                    resolve(res && res.join('').toLowerCase().includes('successfully'));
                                });
                            })];
                    case 5:
                        response = _b.sent();
                        if (!response) {
                            throw exception_1.default.BadRequestError('BAD_REQUEST', '網域驗證失敗', null);
                        }
                        return [4 /*yield*/, database_1.default.execute("\n                    update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                    set domain=?\n                    where domain = ?\n                "), [null, config.domain])];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, database_1.default.execute("\n                    update `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                    set domain=?\n                    where appName = ?\n                "), [config.domain, config.appName])];
                    case 7: return [2 /*return*/, _b.sent()];
                    case 8:
                        e_11 = _b.sent();
                        console.log("error", e_11);
                        throw exception_1.default.BadRequestError((_a = e_11.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_11, null);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.deleteAPP = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var e_12, e_13;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new backend_service_js_1.BackendService(config.appName).stopServer()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_12 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, database_1.default.execute("delete\n                 from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n                 where appName = ").concat(database_1.default.escape(config.appName), "\n                   and user = '").concat(this.token.userID, "'"), [])];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, database_1.default.execute("delete\n                 from `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n                 where appName = ").concat(database_1.default.escape(config.appName), "\n                   and userID = '").concat(this.token.userID, "'"), [])];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, database_1.default.execute("delete\n                 from `".concat(config_1.saasConfig.SAAS_NAME, "`.private_config\n                 where app_name = ").concat(database_1.default.escape(config.appName), "\n                "), [])];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_13 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_13.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_13, null);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    App.getSupportLanguage = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            var store_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new user_js_1.User(appName).getConfigV2({
                            key: 'store-information',
                            user_id: 'manager',
                        })];
                    case 1:
                        store_info = _a.sent();
                        return [2 /*return*/, store_info.language_setting.support];
                }
            });
        });
    };
    App.getDefLanguage = function (appName) {
        return __awaiter(this, void 0, void 0, function () {
            var store_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new user_js_1.User(appName).getConfigV2({
                            key: 'store-information',
                            user_id: 'manager',
                        })];
                    case 1:
                        store_info = _a.sent();
                        return [2 /*return*/, store_info.language_setting.def];
                }
            });
        });
    };
    return App;
}());
exports.App = App;
function addDays(dat, addDays) {
    var date = new Date(dat);
    date.setDate(date.getDate() + addDays);
    return date;
}
