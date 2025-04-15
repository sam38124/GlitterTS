"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.Post = void 0;
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var app_js_1 = require("../../services/app.js");
var shopping_js_1 = require("./shopping.js");
var ut_database_js_1 = require("../utils/ut-database.js");
var notify_js_1 = require("./notify.js");
var Post = /** @class */ (function () {
    function Post(app, token) {
        this.app = app;
        this.token = token;
    }
    Post.addPostObserver = function (callback) {
        Post.postObserverList.push(callback);
    };
    Post.prototype.postContent = function (content_1) {
        return __awaiter(this, arguments, void 0, function (content, tb) {
            var data, reContent, e_1;
            var _this = this;
            if (tb === void 0) { tb = 't_post'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_1.default.query("INSERT INTO `".concat(this.app, "`.`").concat(tb, "`\n                 SET ?"), [content])];
                    case 1:
                        data = _a.sent();
                        reContent = JSON.parse(content.content);
                        if (!(reContent.type === 'product' && tb === 't_manager_post')) return [3 /*break*/, 3];
                        return [4 /*yield*/, new shopping_js_1.Shopping(this.app, this.token).postVariantsAndPriceValue(reContent)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(reContent.type === 'post-form-config')) return [3 /*break*/, 5];
                        return [4 /*yield*/, new notify_js_1.ManagerNotify(this.app).formSubmit({
                                user_id: content.userID,
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        reContent.id = data.insertId;
                        content.content = JSON.stringify(reContent);
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.`").concat(tb, "`\n                 SET ?\n                 WHERE id = ").concat(data.insertId), [content])];
                    case 6:
                        _a.sent();
                        Post.postObserverList.map(function (value, index, array) {
                            value(content, _this.app);
                        });
                        return [2 /*return*/, data];
                    case 7:
                        e_1 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e_1, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Post.prototype.sqlApi = function (router, datasource) {
        return __awaiter(this, void 0, void 0, function () {
            var apConfig, sq_1, sql, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, app_js_1.App.getAdConfig(this.app, 'sql_api_config_post')];
                    case 1:
                        apConfig = _a.sent();
                        sq_1 = apConfig.apiList.find(function (dd) {
                            return dd.route === router;
                        });
                        sql = (function () {
                            return eval(sq_1.sql);
                        })().replaceAll('$app', "`".concat(this.app, "`"));
                        return [4 /*yield*/, database_1.default.query(sql, [])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'SqlApi Error:' + e_2, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Post.prototype.lambda = function (query, router, datasource, type) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.queryLambada({
                                database: this.app,
                            }, function (sql) { return __awaiter(_this, void 0, void 0, function () {
                                var user, _a, _b, sqlType;
                                var _this = this;
                                var _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            user = undefined;
                                            if (!!Post.lambda_function[this.app]) return [3 /*break*/, 2];
                                            _a = Post.lambda_function;
                                            _b = this.app;
                                            return [4 /*yield*/, app_js_1.App.getAdConfig(this.app, 'sql_api_config_post')];
                                        case 1:
                                            _a[_b] = _e.sent();
                                            _e.label = 2;
                                        case 2:
                                            if (!this.token) return [3 /*break*/, 4];
                                            return [4 /*yield*/, sql.query("select *\n                                     from t_user\n                                     where userID = ".concat((_c = this.token.userID) !== null && _c !== void 0 ? _c : 0), [])];
                                        case 3:
                                            user =
                                                (_d = (_e.sent())[0]) !== null && _d !== void 0 ? _d : user;
                                            _e.label = 4;
                                        case 4: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                                var sq, html, myFunction;
                                                return __generator(this, function (_a) {
                                                    sq = Post.lambda_function[this.app].apiList.find(function (dd) {
                                                        return dd.route === router && dd.type === type;
                                                    });
                                                    if (!sq) {
                                                        throw exception_1.default.BadRequestError('BAD_REQUEST', "Router ".concat(router, " not exist."), null);
                                                    }
                                                    html = String.raw;
                                                    myFunction = new Function(html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["try { return\n                        ", "\n                        } catch (error) { return 'error'; }"], ["try { return\n                        ", "\n                        } catch (error) { return 'error'; }"])), sq.sql.replace(/new\s*Promise\s*\(\s*async\s*\(\s*resolve\s*,\s*reject\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/i, 'new Promise(async (resolve, reject) => { try { $1 } catch (error) { console.log(error);reject(error); } })')));
                                                    return [2 /*return*/, (function () {
                                                            try {
                                                                return myFunction();
                                                            }
                                                            catch (e) {
                                                                throw exception_1.default.BadRequestError('BAD_REQUEST', e, null);
                                                            }
                                                        })()];
                                                });
                                            }); })()];
                                        case 5:
                                            sqlType = _e.sent();
                                            if (!sqlType) {
                                                throw exception_1.default.BadRequestError('BAD_REQUEST', 'SqlApi Error', null);
                                            }
                                            else {
                                                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            try {
                                                                sqlType
                                                                    .execute(sql, {
                                                                    user: user,
                                                                    data: datasource,
                                                                    app: this.app,
                                                                    query: query,
                                                                    firebase: {
                                                                        sendMessage: function (message) {
                                                                        },
                                                                    },
                                                                })
                                                                    .then(function (data) {
                                                                    resolve({ result: true, data: data });
                                                                })
                                                                    .catch(function (e) {
                                                                    resolve({ result: false, message: e });
                                                                });
                                                            }
                                                            catch (e) {
                                                                console.error(e);
                                                                reject(e);
                                                            }
                                                            return [2 /*return*/];
                                                        });
                                                    }); })];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'SqlApi Error:' + e_3, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Post.prototype.putContent = function (content_1) {
        return __awaiter(this, arguments, void 0, function (content, tb) {
            var reContent, data, e_4;
            if (tb === void 0) { tb = 't_post'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        reContent = JSON.parse(content.content);
                        if (!(reContent.type === 'product' && tb === 't_manager_post')) return [3 /*break*/, 2];
                        return [4 /*yield*/, new shopping_js_1.Shopping(this.app, this.token).postVariantsAndPriceValue(reContent)];
                    case 1:
                        _a.sent();
                        content.content = JSON.stringify(reContent);
                        _a.label = 2;
                    case 2:
                        content.updated_time = new Date();
                        return [4 /*yield*/, database_1.default.query("update `".concat(this.app, "`.`").concat(tb, "`\n                 SET ?\n                 where 1 = 1\n                   and userID = ").concat(this.token.userID, "\n                   and id = ").concat(reContent.id), [content])];
                    case 3:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 4:
                        e_4 = _a.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e_4, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Post.prototype.getContentV2 = function (query, manager) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql_1, e_5;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
                        query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 10;
                        querySql_1 = [];
                        query.id && querySql_1.push("id=".concat(query.id));
                        query.search &&
                            query.search.split(',').map(function (dd) {
                                if (dd.includes('->')) {
                                    var qu = dd.split('->');
                                    querySql_1.push("(content->>'$.".concat(qu[0], "'='").concat(qu[1], "')"));
                                }
                                else if (dd.includes('-|>')) {
                                    var qu = dd.split('-|>');
                                    querySql_1.push("(content->>'$.".concat(qu[0], "' like '%").concat(qu[1], "%')"));
                                }
                                else if (dd.includes('-[]>')) {
                                    var qu = dd.split('-[]>');
                                    querySql_1.push("(JSON_CONTAINS(content, '\"".concat(qu[1], "\"', '$.").concat(qu[0], "'))"));
                                }
                            });
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(this.app, manager ? "t_manager_post" : "t_post").querySql(querySql_1, query)];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        e_5 = _c.sent();
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'GetContentV2 Error:' + e_5, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Post.prototype.getContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, database_1.queryLambada)({
                            database: this.app,
                        }, function (v) { return __awaiter(_this, void 0, void 0, function () {
                            var apConfig_1, userData, countSql_1, sql_1, data, _i, data_1, dd, _a, _b, e_6, countText, _c, e_7;
                            var _d;
                            var _this = this;
                            var _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        _f.trys.push([0, 14, , 15]);
                                        return [4 /*yield*/, app_js_1.App.getAdConfig(this.app, 'sql_api_config')];
                                    case 1:
                                        apConfig_1 = _f.sent();
                                        userData = {};
                                        countSql_1 = '';
                                        sql_1 = (function () {
                                            if (content.queryType === 'sql') {
                                                var datasource_1 = JSON.parse(content.datasource);
                                                var sq = apConfig_1.apiList.find(function (dd) {
                                                    return dd.route === datasource_1.route;
                                                });
                                                return eval(sq.sql).replaceAll('$app', "`".concat(_this.app, "`"));
                                            }
                                            else {
                                                var query_1 = "";
                                                var app_1 = _this.app;
                                                var selectOnly_1 = " * ";
                                                function getQueryString(dd) {
                                                    var _a;
                                                    if (!dd || dd.length === 0 || dd.key === '') {
                                                        return "";
                                                    }
                                                    if (dd.type === 'relative_post') {
                                                        dd.query = (_a = dd.query) !== null && _a !== void 0 ? _a : [];
                                                        return " and JSON_EXTRACT(content, '$.".concat(dd.key, "') in (SELECT JSON_EXTRACT(content, '$.").concat(dd.value, "') AS datakey\n from `").concat(app_1, "`.t_post where 1=1 ").concat(dd.query
                                                            .map(function (dd) {
                                                            return getQueryString(dd);
                                                        })
                                                            .join("  "), ")");
                                                    }
                                                    else if (dd.type === 'in') {
                                                        return "and JSON_EXTRACT(content, '$.".concat(dd.key, "') in (").concat(dd.query
                                                            .map(function (dd) {
                                                            return typeof dd.value === 'string' ? "'".concat(dd.value, "'") : dd.value;
                                                        })
                                                            .join(','), ")");
                                                    }
                                                    else if (dd.type) {
                                                        return " and JSON_EXTRACT(content, '$.".concat(dd.key, "') ").concat(dd.type, " ").concat(typeof dd.value === 'string' ? "'".concat(dd.value, "'") : dd.value);
                                                    }
                                                    else {
                                                        return " and JSON_EXTRACT(content, '$.".concat(dd.key, "') LIKE '%").concat(dd.value, "%'");
                                                    }
                                                }
                                                function getSelectString(dd) {
                                                    if (!dd || dd.length === 0) {
                                                        return "";
                                                    }
                                                    if (dd.type === 'SUM') {
                                                        return " SUM(JSON_EXTRACT(content, '$.".concat(dd.key, "')) AS ").concat(dd.value);
                                                    }
                                                    else if (dd.type === 'count') {
                                                        return " count(1)";
                                                    }
                                                    else if (dd.type === 'AVG') {
                                                        return " AVG(JSON_EXTRACT(content, '$.".concat(dd.key, "')) AS ").concat(dd.value);
                                                    }
                                                    else {
                                                        return " JSON_EXTRACT(content, '$.".concat(dd.key, "') AS '").concat(dd.value, "' ");
                                                    }
                                                }
                                                if (content.query) {
                                                    content.query = JSON.parse(content.query);
                                                    content.query.map(function (dd) {
                                                        query_1 += getQueryString(dd);
                                                    });
                                                }
                                                if (content.selectOnly) {
                                                    content.selectOnly = JSON.parse(content.selectOnly);
                                                    content.selectOnly.map(function (dd, index) {
                                                        if (index === 0) {
                                                            selectOnly_1 = '';
                                                        }
                                                        selectOnly_1 += getSelectString(dd);
                                                    });
                                                }
                                                if (content.datasource) {
                                                    content.datasource = JSON.parse(content.datasource);
                                                    if (content.datasource.length > 0) {
                                                        query_1 += " and userID in ('".concat(content.datasource
                                                            .map(function (dd) {
                                                            return dd;
                                                        })
                                                            .join('\',\''), "')");
                                                    }
                                                }
                                                countSql_1 = "select count(1)\n                                        from `".concat(_this.app, "`.`t_post`\n                                        where 1 = 1\n                                            ").concat(query_1, "\n                                        order by id desc ").concat((0, database_1.limit)(content));
                                                return "select ".concat(selectOnly_1, "\n                                    from `").concat(_this.app, "`.`t_post`\n                                    where 1 = 1\n                                        ").concat(query_1, "\n                                    order by id desc ").concat((0, database_1.limit)(content));
                                            }
                                        })();
                                        return [4 /*yield*/, v.query(sql_1.replace('$countIndex', ''), [])];
                                    case 2:
                                        data = _f.sent();
                                        _i = 0, data_1 = data;
                                        _f.label = 3;
                                    case 3:
                                        if (!(_i < data_1.length)) return [3 /*break*/, 9];
                                        dd = data_1[_i];
                                        if (!dd.userID) {
                                            return [3 /*break*/, 8];
                                        }
                                        if (!!userData[dd.userID]) return [3 /*break*/, 7];
                                        _f.label = 4;
                                    case 4:
                                        _f.trys.push([4, 6, , 7]);
                                        _a = userData;
                                        _b = dd.userID;
                                        return [4 /*yield*/, v.query("select userData\n                                         from `".concat(this.app, "`.`t_user`\n                                         where userID = ").concat(dd.userID), [])];
                                    case 5:
                                        _a[_b] = (_f.sent())[0]['userData'];
                                        return [3 /*break*/, 7];
                                    case 6:
                                        e_6 = _f.sent();
                                        return [3 /*break*/, 7];
                                    case 7:
                                        dd.userData = userData[dd.userID];
                                        _f.label = 8;
                                    case 8:
                                        _i++;
                                        return [3 /*break*/, 3];
                                    case 9:
                                        countText = (function () {
                                            if (sql_1.indexOf('$countIndex') !== -1) {
                                                var index = sql_1.indexOf('$countIndex');
                                                return "select count(1)\n                                    from ".concat(sql_1.substring(index + 11));
                                            }
                                            else {
                                                return "select count(1)\n                                     ".concat(sql_1.substring(sql_1.lastIndexOf(' from ')));
                                            }
                                        })();
                                        countText = countText.substring(0, (_e = countText.indexOf(' order ')) !== null && _e !== void 0 ? _e : countText.length);
                                        _d = {
                                            data: data
                                        };
                                        if (!countSql_1) return [3 /*break*/, 11];
                                        return [4 /*yield*/, v.query(countSql_1, [content])];
                                    case 10:
                                        _c = (_f.sent())[0]['count(1)'];
                                        return [3 /*break*/, 13];
                                    case 11: return [4 /*yield*/, v.query(countText, [content])];
                                    case 12:
                                        _c = (_f.sent())[0]['count(1)'];
                                        _f.label = 13;
                                    case 13: return [2 /*return*/, (_d.count = _c,
                                            _d)];
                                    case 14:
                                        e_7 = _f.sent();
                                        console.error(e_7);
                                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e_7, null);
                                    case 15: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Post.postObserverList = [];
    Post.lambda_function = {};
    return Post;
}());
exports.Post = Post;
var templateObject_1;
