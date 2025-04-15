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
exports.Pos = void 0;
var database_js_1 = require("../../modules/database.js");
var exception_js_1 = require("../../modules/exception.js");
var Pos = /** @class */ (function () {
    function Pos(app, token) {
        this.app = app;
        this.token = token;
    }
    //取得上下班狀態
    Pos.prototype.getWorkStatus = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                                           FROM `".concat(this.app, "`.t_check_in_pos\n                                           where staff = ? and store=?\n                                           order by id desc limit 0,1;"), [query.userID, query.store])];
                    case 1:
                        status_1 = _a.sent();
                        return [2 /*return*/, (status_1[0] && status_1[0].execute) || 'off_work'];
                    case 2:
                        e_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e_1, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //取得上下班列表
    Pos.prototype.getWorkStatusList = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        querySql = ["1=1"];
                        if (query.store) {
                            querySql.push("store=".concat(database_js_1.default.escape(query.store)));
                        }
                        return [4 /*yield*/, this.querySql(querySql, query, 't_check_in_pos')];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'getWorkStatus is Failed. ' + e_2, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //設定上下班狀態
    Pos.prototype.setWorkStatus = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("insert into `".concat(this.app, "`.t_check_in_pos (staff,execute,store) values (?,?,?)"), [
                                (_a = this.token) === null || _a === void 0 ? void 0 : _a.userID,
                                obj.status,
                                obj.store
                            ])];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _b.sent();
                        throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'setWorkStatus is Failed. ' + e_3, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //新增小結單
    Pos.prototype.setSummary = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!obj.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_js_1.default.query("update `".concat(this.app, "`.`t_pos_summary` set staff=?,summary_type=?,content=? where id=?"), [
                                obj.staff,
                                obj.summary_type,
                                JSON.stringify(obj.content),
                                obj.id
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, database_js_1.default.query("insert into `".concat(this.app, "`.`t_pos_summary` (staff,`summary_type`,content) values (?,?,?)"), [
                            obj.staff,
                            obj.summary_type,
                            JSON.stringify(obj.content)
                        ])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'setSummary is Failed. ' + e_4, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //取得小結單
    Pos.prototype.getSummary = function (shop) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("select * from `".concat(this.app, "`.`t_pos_summary` where content->>'$.store'=? order by id desc"), [shop])];
                    case 1: return [2 /*return*/, (_a.sent()).map(function (dd) {
                            dd.created_time = dd.created_time.toISOString();
                            return dd;
                        })];
                    case 2:
                        e_5 = _a.sent();
                        throw exception_js_1.default.BadRequestError('INTERNAL_SERVER_ERROR', 'setSummary is Failed. ' + e_5, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Pos.prototype.querySql = function (querySql, query, db_n) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, data;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sql = "SELECT *\n                   FROM `".concat(this.app, "`.`").concat(db_n, "`\n                   WHERE ").concat(querySql.join(' and '), " ").concat(query.order_by || "order by id desc", "\n        ");
                        console.log("query=string=>", sql);
                        if (!query.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                     FROM (".concat(sql, ") as subqyery\n                         limit ").concat(query.page * query.limit, "\n                        , ").concat(query.limit), [])];
                    case 1:
                        data = (_b.sent())[0];
                        return [2 /*return*/, { data: data, result: !!data }];
                    case 2:
                        _a = {};
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                         FROM (".concat(sql, ") as subqyery\n                             limit ").concat(query.page * query.limit, "\n                            , ").concat(query.limit), [])];
                    case 3:
                        _a.data = (_b.sent()).map(function (dd) {
                            return dd;
                        });
                        return [4 /*yield*/, database_js_1.default.query("SELECT count(1)\n                         FROM (".concat(sql, ") as subqyery"), [])];
                    case 4: return [2 /*return*/, (_a.total = (_b.sent())[0]['count(1)'],
                            _a)];
                }
            });
        });
    };
    return Pos;
}());
exports.Pos = Pos;
