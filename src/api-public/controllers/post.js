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
var express_1 = require("express");
var response_1 = require("../../modules/response");
var database_1 = require("../../modules/database");
var post_1 = require("../services/post");
var exception_1 = require("../../modules/exception");
var shopping_js_1 = require("../services/shopping.js");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var ut_database_js_1 = require("../utils/ut-database.js");
var router = express_1.default.Router();
router.post('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, postData, _a, data, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                post = new post_1.Post(req.get('g-app'), req.body.token);
                postData = req.body.postData;
                postData.userID = (req.body.token && req.body.token.userID) || 0;
                _a = req.body.type === 'manager';
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                _a = !(_b.sent());
                _b.label = 2;
            case 2:
                if (_a) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                return [4 /*yield*/, post.postContent({
                        userID: postData.userID,
                        content: JSON.stringify(postData),
                    }, req.body.type === 'manager' ? "t_manager_post" : "t_post")];
            case 3:
                data = (_b.sent());
                return [2 /*return*/, response_1.default.succ(resp, { result: true, id: data.insertId })];
            case 4:
                err_1 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                post = new post_1.Post(req.get('g-app'), req.body.token);
                return [4 /*yield*/, post.getContent(req.query)];
            case 1:
                data = (_a.sent());
                data.result = true;
                return [2 /*return*/, response_1.default.succ(resp, data)];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/user', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, data, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                post = new post_1.Post(req.get('g-app'), req.body.token);
                return [4 /*yield*/, post.getContentV2(req.query, false)];
            case 1:
                data = (_a.sent());
                return [2 /*return*/, response_1.default.succ(resp, data)];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, data, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                post = new post_1.Post(req.get('g-app'), req.body.token);
                return [4 /*yield*/, post.getContentV2(req.query, true)];
            case 1:
                data = (_a.sent());
                return [2 /*return*/, response_1.default.succ(resp, data)];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var post, postData, _a, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                post = new post_1.Post(req.get('g-app'), req.body.token);
                postData = req.body.postData;
                postData.userID = req.body.token.userID;
                _a = req.body.type === 'manager';
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                _a = !(_b.sent());
                _b.label = 2;
            case 2:
                if (_a) {
                    return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
                }
                return [4 /*yield*/, post.putContent({
                        userID: req.body.token.userID,
                        content: JSON.stringify(postData),
                    }, req.body.type === 'manager' ? "t_manager_post" : "t_post")];
            case 3:
                (_b.sent());
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 4:
                err_5 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_5)];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, _b, _c, err_6;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_f.sent()) return [3 /*break*/, 3];
                query = [
                    "(content->>'$.type'='".concat(req.query.type, "')")
                ];
                req.query.search && query.push("(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%".concat(req.query.search, "%'))"));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, (new shopping_js_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
                        page: ((_d = req.query.page) !== null && _d !== void 0 ? _d : 0),
                        limit: ((_e = req.query.limit) !== null && _e !== void 0 ? _e : 50),
                        id: req.query.id
                    }))];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_f.sent()]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_6 = _f.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_6)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.delete('/manager', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, database_1.default.query("delete\n                            FROM `".concat(req.get('g-app'), "`.t_manager_post\n                            where id in (?)"), [req.query.id.split(',')])];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_7 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_7)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.delete('/user', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!(_a.sent())) return [3 /*break*/, 3];
                return [4 /*yield*/, database_1.default.query("delete\n                            FROM `".concat(req.get('g-app'), "`.t_post\n                            where id in (?)"), [req.query.id.split(',')])];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 3: return [4 /*yield*/, database_1.default.query("delete\n                            FROM `".concat(req.get('g-app'), "`.t_post\n                            where id in (?) and userID=?"), [req.query.id.split(','), req.body.token.userID])];
            case 4:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_8 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_8)];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/user', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var query, data, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = [
                    "(content->>'$.type'='".concat(req.query.type, "')")
                ];
                req.query.search && query.push("(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%".concat(req.query.search, "%'))"));
                return [4 /*yield*/, new ut_database_js_1.UtDatabase(req.get('g-app'), "t_post").querySql(query, req.query)];
            case 1:
                data = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, data)];
            case 2:
                err_9 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_9)];
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
