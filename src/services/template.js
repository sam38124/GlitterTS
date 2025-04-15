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
exports.Template = void 0;
var database_1 = require("../modules/database");
var config_1 = require("../config");
var exception_1 = require("../modules/exception");
var process_1 = require("process");
var ut_database_js_1 = require("../api-public/utils/ut-database.js");
var Template = /** @class */ (function () {
    function Template(token) {
        this.token = token;
    }
    Template.prototype.createPage = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!config.copy) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_1.default.execute("\n              select `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config.page_config,\n                     `").concat(config_1.saasConfig.SAAS_NAME, "`.page_config.config\n              from `").concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n              where tag = ").concat(database_1.default.escape(config.copy), "\n                and appName = ").concat(database_1.default.escape(config.copyApp || config.appName), "\n          "), [])];
                    case 1:
                        data = (_d.sent())[0];
                        config.page_config = data['page_config'];
                        config.config = data['config'];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, database_1.default.execute("\n                ".concat(config.replace ? "replace" : 'insert', " into `").concat(config_1.saasConfig.SAAS_NAME, "`.page_config (userID, appName, tag, `group`, `name`, config,\n                                                                     page_config, page_type)\n                values (?, ?, ?, ?, ?, ?, ?, ?);\n            "), [
                                this.token.userID,
                                config.appName,
                                config.tag,
                                config.group,
                                config.name,
                                (_a = config.config) !== null && _a !== void 0 ? _a : [],
                                (_b = config.page_config) !== null && _b !== void 0 ? _b : {},
                                (_c = config.page_type) !== null && _c !== void 0 ? _c : 'page',
                            ])];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, true];
                    case 4:
                        e_1 = _d.sent();
                        throw exception_1.default.BadRequestError('Forbidden', 'This page already exists.', null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Template.prototype.updatePage = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            //先判斷是否存在，不存在則添加
            function checkExits() {
                return __awaiter(this, void 0, void 0, function () {
                    var where_, sql, count;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                where_ = (function () {
                                    var sql = '';
                                    if (config.id) {
                                        sql += " and `id` = ".concat(config.id, " ");
                                    }
                                    else {
                                        sql += " and `tag` = ".concat(database_1.default.escape(config.tag));
                                    }
                                    sql += " and appName = ".concat(database_1.default.escape(config.appName));
                                    return sql;
                                })();
                                sql = "\n          select count(1)\n          from `".concat(config_1.saasConfig.SAAS_NAME, "`.").concat(page_db, "\n          where 1 = 1 ").concat(where_, "\n      ");
                                return [4 /*yield*/, database_1.default.query(sql, [])];
                            case 1:
                                count = _a.sent();
                                if (!(count[0]['count(1)'] === 0)) return [3 /*break*/, 3];
                                return [4 /*yield*/, database_1.default.query("INSERT INTO `".concat(config_1.saasConfig.SAAS_NAME, "`.").concat(page_db, "\n           SELECT *\n           FROM `").concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n           where 1 = 1 ").concat(where_, ";\n          "), [])];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var page_db, params, sql, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page_db = (function () {
                            switch (config.language) {
                                case 'zh-TW':
                                    return 'page_config';
                                case 'en-US':
                                    return 'page_config_en';
                                case 'zh-CN':
                                    return 'page_config_rcn';
                                default:
                                    return 'page_config';
                            }
                        })();
                        return [4 /*yield*/, checkExits()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        params = {};
                        config.appName && (params['appName'] = config.appName);
                        config.tag && (params['tag'] = config.tag);
                        config.group && (params['group'] = config.group);
                        config.page_type && (params['page_type'] = config.page_type);
                        config.name && (params['name'] = config.name);
                        config.config && (params['config'] = JSON.stringify(config.config));
                        config.preview_image && (params['preview_image'] = config.preview_image);
                        config.page_config && (params['page_config'] = JSON.stringify(config.page_config));
                        config.favorite && (params['favorite'] = config.favorite);
                        config.updated_time = new Date();
                        sql = "\n          UPDATE `".concat(config_1.saasConfig.SAAS_NAME, "`.").concat(page_db, "\n          SET ?\n          WHERE 1 = 1\n      ");
                        if (config.id) {
                            sql += " and `id` = ".concat(config.id, " ");
                        }
                        else {
                            sql += " and `tag` = ".concat(database_1.default.escape(config.tag));
                        }
                        sql += "and appName = ".concat(database_1.default.escape(config.appName));
                        return [4 /*yield*/, database_1.default.query(sql, [params])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        e_2 = _a.sent();
                        throw exception_1.default.BadRequestError('Forbidden', 'No permission.' + e_2, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Template.prototype.deletePage = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, b, sql, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _i = 0, _a = ['page_config', 'page_config_rcn', 'page_config_en'];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        b = _a[_i];
                        sql = config.id
                            ? "\n                    delete\n                    from `".concat(config_1.saasConfig.SAAS_NAME, "`.").concat(b, "\n                    WHERE appName = ").concat(database_1.default.escape(config.appName), "\n                      and id = ").concat(database_1.default.escape(config.id))
                            : "\n                    delete\n                    from `".concat(config_1.saasConfig.SAAS_NAME, "`.").concat(b, "\n                    WHERE appName = ").concat(database_1.default.escape(config.appName), "\n                      and tag = ").concat(database_1.default.escape(config.tag));
                        return [4 /*yield*/, database_1.default.execute(sql, [])];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, true];
                    case 5:
                        e_3 = _b.sent();
                        throw exception_1.default.BadRequestError('Forbidden', 'No permission.' + e_3, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Template.prototype.getTemplate = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, data, e_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        sql = [];
                        query.template_from === 'me' && sql.push("user = '".concat(this.token.userID, "'"));
                        query.template_from === 'me' && sql.push("template_type in (3,2)");
                        query.template_from === 'all' && sql.push("template_type = 2");
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(config_1.saasConfig.SAAS_NAME, "page_config").querySql(sql, query, "\n            id,userID,tag,`group`,name, page_type,  preview_image,appName,template_type,template_config\n            ")];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, data];
                    case 2:
                        e_4 = _b.sent();
                        throw exception_1.default.BadRequestError((_a = e_4.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_4, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Template.prototype.postTemplate = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var template_type, officialAccount, e_5;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        template_type = '0';
                        if (config.data.post_to === 'all') {
                            officialAccount = ((_a = process_1.default.env.OFFICIAL_ACCOUNT) !== null && _a !== void 0 ? _a : '').split(',');
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
                        return [4 /*yield*/, database_1.default.execute("update `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n             set template_config = ?,\n                 template_type=").concat(template_type, "\n             where appName = ").concat(database_1.default.escape(config.appName), "\n               and tag = ?\n            "), [config.data, config.tag])];
                    case 1: return [2 /*return*/, ((_c.sent())['changedRows'] == true)];
                    case 2:
                        e_5 = _c.sent();
                        throw exception_1.default.BadRequestError((_b = e_5.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', e_5, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Template.getRealPage = function (query_page, appName) {
        return __awaiter(this, void 0, void 0, function () {
            var page, count, copyPageData, _i, copyPageData_1, dd, page_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query_page = query_page || 'index';
                        page = query_page;
                        if (query_page.includes('#')) {
                            query_page = query_page.substring(0, query_page.indexOf('#'));
                        }
                        if (appName === 'proshake_v2') {
                            return [2 /*return*/, query_page];
                        }
                        console.log("query_page", query_page);
                        if (!(page === 'index-app')) return [3 /*break*/, 6];
                        return [4 /*yield*/, database_1.default.query("select count(1)\n         from `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n         where appName = ").concat(database_1.default.escape(appName), "\n           and tag = 'index-app'"), [])];
                    case 1:
                        count = _a.sent();
                        if (!(count[0]['count(1)'] === 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, database_1.default.execute("select *\n           from `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config\n           where appName = ").concat(database_1.default.escape(appName), "\n             and tag = 'index'"), [])];
                    case 2:
                        copyPageData = _a.sent();
                        _i = 0, copyPageData_1 = copyPageData;
                        _a.label = 3;
                    case 3:
                        if (!(_i < copyPageData_1.length)) return [3 /*break*/, 6];
                        dd = copyPageData_1[_i];
                        return [4 /*yield*/, database_1.default.execute("\n                insert into `".concat(config_1.saasConfig.SAAS_NAME, "`.page_config (userID, appName, tag, `group`,\n                                                                     `name`,\n                                                                     `config`, `page_config`, page_type)\n                values (?, ?, ?, ?, ?, ").concat(database_1.default.escape(JSON.stringify(dd.config)), ",\n                        ").concat(database_1.default.escape(JSON.stringify(dd.page_config)), ", ").concat(database_1.default.escape(dd.page_type), ");\n            "), [dd.userID, appName, 'index-app', dd.group || '未分類', 'APP首頁樣式'])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        //判斷是條款頁面或部落格列表頁面時
                        if ([
                            'privacy',
                            'term',
                            'refund',
                            'delivery',
                            'blogs',
                            'blog_tag_setting',
                            'blog_global_setting',
                            'checkout',
                            'fb_live',
                            'ig_live',
                            'line_plus',
                            'shipment_list',
                            'shipment_list_archive',
                            'reconciliation_area',
                            'app-design',
                        ].includes(query_page)) {
                            return [2 /*return*/, 'official-router'];
                        }
                        if (['account_userinfo', 'voucher-list', 'rebate', 'order_list', 'wishlist', 'account_edit'].includes(query_page) &&
                            appName !== 'cms_system') {
                            return [2 /*return*/, 'official-router'];
                        }
                        //當判斷是Blog時
                        if (['blogs', 'pages', 'shop', 'hidden'].includes(query_page.split('/')[0]) && query_page.split('/')[1]) {
                            return [2 /*return*/, 'official-router'];
                        }
                        if (!(query_page.split('/')[0] === 'distribution' && query_page.split('/')[1])) return [3 /*break*/, 11];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 10, , 11]);
                        return [4 /*yield*/, database_1.default.query("SELECT *\n             from `".concat(appName, "`.t_recommend_links\n             where content ->>'$.link'=?"), [query_page.split('/')[1]])];
                    case 8:
                        page_1 = (_a.sent())[0].content;
                        return [4 /*yield*/, Template.getRealPage(page_1.redirect.substring(1), appName)];
                    case 9: return [2 /*return*/, _a.sent()];
                    case 10:
                        error_1 = _a.sent();
                        console.error("distribution \u8DEF\u5F91\u932F\u8AA4 code: ".concat(query_page.split('/')[1]));
                        page = '';
                        return [3 /*break*/, 11];
                    case 11:
                        //當判斷是Collection時
                        if (query_page.split('/')[0] === 'collections' && query_page.split('/')[1]) {
                            page = 'all-product';
                        }
                        //當判斷是商品頁時
                        if (query_page.split('/')[0] === 'products' && query_page.split('/')[1]) {
                            if (appName === '3131_shop') {
                                page = 'products';
                            }
                            else {
                                page = 'official-router';
                            }
                        }
                        //當判斷是CMS頁面時
                        if (query_page === 'cms') {
                            page = 'index';
                        }
                        //當判斷是Voucher-list頁面時
                        if (query_page === 'voucher-list') {
                            page = 'rebate';
                        }
                        //當判斷是line驗證頁面
                        if (query_page === 'shopnex-line-oauth') {
                            page = 'official-router';
                        }
                        return [2 /*return*/, page];
                }
            });
        });
    };
    Template.prototype.getPage = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page_db, sql, page_data, e_6;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!config.tag) return [3 /*break*/, 2];
                        _a = config;
                        return [4 /*yield*/, Template.getRealPage(config.tag, config.appName)];
                    case 1:
                        _a.tag = _b.sent();
                        if (config.tag === 'official-router') {
                            config.appName = 'cms_system';
                        }
                        else if (config.tag === 'all-product') {
                            config.tag = 'official-router';
                            config.appName = 'cms_system';
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, , 8]);
                        page_db = (function () {
                            switch (config.language) {
                                case 'zh-TW':
                                    return 'page_config';
                                case 'en-US':
                                    return 'page_config_en';
                                case 'zh-CN':
                                    return 'page_config_rcn';
                                default:
                                    return 'page_config';
                            }
                        })();
                        sql = "select ".concat(config.tag || config.id ? "*" : "id,userID,tag,`group`,name,page_type,preview_image,appName,page_config", "\n                 from `").concat(config_1.saasConfig.SAAS_NAME, "`.").concat(page_db, "\n                 where ").concat((function () {
                            var query = ["1 = 1"];
                            config.user_id && query.push("userID=".concat(config.user_id));
                            config.appName && query.push("appName=".concat(database_1.default.escape(config.appName)));
                            config.id && query.push("id=".concat(database_1.default.escape(config.id)));
                            config.tag &&
                                query.push(" tag in (".concat(config.tag
                                    .split(',')
                                    .map(function (dd) {
                                    return database_1.default.escape(dd);
                                })
                                    .join(','), ")"));
                            config.page_type && query.push("page_type=".concat(database_1.default.escape(config.page_type)));
                            config.group &&
                                query.push("`group` in (".concat(config.group
                                    .split(',')
                                    .map(function (dd) {
                                    return database_1.default.escape(dd);
                                })
                                    .join(','), ")"));
                            if (config.favorite && config.favorite === 'true') {
                                query.push("favorite=1");
                            }
                            if (config.me === 'true') {
                                query.push("userID = ".concat(_this.token.userID));
                            }
                            else {
                                // let officialAccount=(process.env.OFFICIAL_ACCOUNT ?? '').split(',')
                                // query.push(`userID in (${officialAccount.map((dd)=>{
                                //     return `${db.escape(dd)}`
                                // }).join(',')})`)
                            }
                            return query.join(' and ');
                        })());
                        if (config.type) {
                            if (config.type === 'template') {
                                sql += " and `group` != ".concat(database_1.default.escape('glitter-article'));
                            }
                            else if (config.type === 'article') {
                                sql += " and `group` = 'glitter-article' ";
                            }
                        }
                        return [4 /*yield*/, database_1.default.query(sql, [])];
                    case 3:
                        page_data = _b.sent();
                        if (!(page_db !== 'page_config' && page_data.length === 0 && config.language != 'zh-TW')) return [3 /*break*/, 5];
                        config.language = 'zh-TW';
                        return [4 /*yield*/, this.getPage(config)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [2 /*return*/, page_data];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_6 = _b.sent();
                        throw exception_1.default.BadRequestError('Forbidden', 'No permission.' + e_6, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return Template;
}());
exports.Template = Template;
