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
var ut_database_js_1 = require("../utils/ut-database.js");
var response_js_1 = require("../../modules/response.js");
var express_1 = require("express");
var database_js_1 = require("../../modules/database.js");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var exception_js_1 = require("../../modules/exception.js");
var article_js_1 = require("../services/article.js");
var user_js_1 = require("../services/user.js");
var router = express_1.default.Router();
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var query, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                query = ["page_type = 'blog'", "`appName` = ".concat(database_js_1.default.escape(req.get('g-app')))];
                req.query.tag && query.push("tag = ".concat(database_js_1.default.escape(req.query.tag)));
                req.query.label && query.push("(JSON_EXTRACT(page_config, '$.meta_article.tag') LIKE '%".concat(req.query.label, "%')"));
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_a.sent())) {
                    query.push("(JSON_EXTRACT(page_config, '$.hideIndex') IS NULL\n   OR JSON_EXTRACT(page_config, '$.hideIndex') != 'true')");
                }
                if (req.query.search) {
                    query.push("tag like '%".concat(req.query.search, "%'"));
                }
                if (req.query.search) {
                    query.push("(tag like '%".concat(req.query.search, "%') \n            ||\n             (UPPER(JSON_EXTRACT(page_config, '$.meta_article.title')) LIKE UPPER('%").concat(req.query.search, "%'))"));
                }
                return [4 /*yield*/, new ut_database_js_1.UtDatabase(process.env.GLITTER_DB, "page_config").querySql(query, req.query)];
            case 2:
                data = (_a.sent());
                data.data.map(function (dd) {
                    var content = dd.content;
                    if (content.language_data && content.language_data[req.headers['language']]) {
                        var lang_ = content.language_data[req.headers['language']];
                        content.name = lang_.name || content.name;
                        content.seo = lang_.seo || content.seo;
                        content.text = lang_.text || content.text;
                        content.title = lang_.title || content.title;
                        content.config = lang_.config || content.config;
                    }
                });
                return [2 /*return*/, response_js_1.default.succ(resp, data)];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var query, collection_list_value, collection_title_map_1, data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                query = ["(content->>'$.type'='article')"];
                if (req.query.for_index === 'true') {
                    req.query.for_index && query.push("((content->>'$.for_index' != 'false') || (content->>'$.for_index' IS NULL))");
                }
                else {
                    req.query.for_index && query.push("((content->>'$.for_index' = 'false'))");
                }
                req.query.page_type && query.push("((content->>'$.page_type' = '".concat(req.query.page_type, "'))"));
                req.query.tag && query.push("(content->>'$.tag' = ".concat(database_js_1.default.escape(req.query.tag), ")"));
                req.query.label && query.push("JSON_CONTAINS(content->'$.collection', '\"".concat(req.query.label, "\"')"));
                if (req.query.status) {
                    req.query.status && query.push("status in (".concat(req.query.status, ")"));
                }
                else {
                    query.push("status = 1");
                }
                if (req.query.search) {
                    query.push("(content->>'$.name' like '%".concat(req.query.search, "%') || (content->>'$.title' like '%").concat(req.query.search, "%')"));
                }
                return [4 /*yield*/, new user_js_1.User(req.get('g-app')).getConfigV2({
                        key: 'blog_collection',
                        user_id: 'manager',
                    })];
            case 1:
                collection_list_value = _a.sent();
                collection_title_map_1 = [];
                if (Array.isArray(collection_list_value)) {
                    function loop(list) {
                        list.map(function (dd) {
                            loop(dd.items);
                            collection_title_map_1.push({
                                link: dd.link,
                                title: dd.title,
                            });
                        });
                    }
                    loop(collection_list_value);
                }
                return [4 /*yield*/, new ut_database_js_1.UtDatabase(req.get('g-app'), "t_manager_post").querySql(query, req.query)];
            case 2:
                data = _a.sent();
                if (!Array.isArray(data.data)) {
                    data.data = [data.data];
                }
                data.data.map(function (dd) {
                    dd.content.collection = dd.content.collection || [];
                    dd.content.collection = collection_title_map_1.filter(function (d1) {
                        return dd.content.collection.find(function (d2) {
                            return d2 === d1.link;
                        });
                    });
                    var content = dd.content;
                    if (content.language_data && content.language_data[req.headers['language']]) {
                        var lang_ = content.language_data[req.headers['language']];
                        content.name = lang_.name || content.name;
                        content.seo = lang_.seo || content.seo;
                        content.text = lang_.text || content.text;
                        content.config = lang_.config || content.config;
                        content.description = lang_.description || content.description;
                        content.title = lang_.title || content.title;
                    }
                });
                return [2 /*return*/, response_js_1.default.succ(resp, data)];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_3;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_e.sent())) {
                    return [2 /*return*/, response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                _b = (_a = response_js_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new article_js_1.Article(req.get('g-app'), req.body.token).addArticle(req.body.data, req.body.status)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.result = _e.sent(),
                        _d)]))];
            case 3:
                err_3 = _e.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_3)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_4;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_e.sent())) {
                    return [2 /*return*/, response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                _b = (_a = response_js_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, new article_js_1.Article(req.get('g-app'), req.body.token).putArticle(req.body.data)];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.result = _e.sent(),
                        _d)]))];
            case 3:
                err_4 = _e.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_4)];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, database_js_1.default.query("delete\n                 FROM `".concat(process.env.GLITTER_DB, "`.page_config\n                 where id in (?)\n                   and userID = ?"), [req.body.id.split(','), req.body.token.userID])];
            case 2:
                _a.sent();
                return [2 /*return*/, response_js_1.default.succ(resp, { result: true })];
            case 3: return [2 /*return*/, response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_5)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.delete('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, database_js_1.default.query("delete\n                 FROM `".concat(req.get('g-app'), "`.t_manager_post\n                 where id in (?)"), [req.body.id.split(',')])];
            case 2:
                _a.sent();
                return [2 /*return*/, response_js_1.default.succ(resp, { result: true })];
            case 3: return [2 /*return*/, response_js_1.default.fail(resp, exception_js_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_6 = _a.sent();
                return [2 /*return*/, response_js_1.default.fail(resp, err_6)];
            case 6: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
