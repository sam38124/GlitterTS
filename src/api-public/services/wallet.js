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
exports.Wallet = void 0;
var financial_service_js_1 = require("./financial-service.js");
var private_config_js_1 = require("../../services/private_config.js");
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var redis_js_1 = require("../../modules/redis.js");
var tool_js_1 = require("../../modules/tool.js");
var Wallet = /** @class */ (function () {
    function Wallet(app, token) {
        this.app = app;
        this.token = token;
    }
    Wallet.prototype.store = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var id, keyData, kd;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = 'redirect_' + tool_js_1.default.randomString(6);
                        return [4 /*yield*/, redis_js_1.default.setValue(id, cf.return_url)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                                appName: this.app, key: 'glitter_finance'
                            })];
                    case 2:
                        keyData = (_b.sent())[0].value;
                        kd = keyData[keyData.TYPE];
                        _a = {};
                        return [4 /*yield*/, (new financial_service_js_1.default(this.app, {
                                "HASH_IV": kd.HASH_IV,
                                "HASH_KEY": kd.HASH_KEY,
                                "ActionURL": kd.ActionURL,
                                "NotifyURL": "".concat(process.env.DOMAIN, "/api-public/v1/wallet/notify?g-app=").concat(this.app, "&type=").concat(keyData.TYPE),
                                "ReturnURL": "".concat(process.env.DOMAIN, "/api-public/v1/ec/redirect?g-app=").concat(this.app, "&return=").concat(id, "&type=").concat(keyData.TYPE),
                                "MERCHANT_ID": kd.MERCHANT_ID,
                                TYPE: keyData.TYPE
                            }).saveWallet({
                                total: cf.total,
                                userID: this.token.userID,
                                note: cf.note,
                                method: cf.method || '',
                                table: 't_wallet',
                                title: '錢包儲值',
                                ratio: 1
                            }))];
                    case 3: return [2 /*return*/, (_a.form = (_b.sent()),
                            _a)];
                }
            });
        });
    };
    Wallet.prototype.withdraw = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var sum, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_js_1.default.query("SELECT sum(money)\n                                         FROM `".concat(this.app, "`.t_wallet\n                                         where status in (1, 2)\n                                           and userID = ?"), [this.token.userID])];
                    case 1:
                        sum = (_a.sent())[0]['sum(money)'] || 0;
                        if (!(sum < cf.money)) return [3 /*break*/, 2];
                        throw exception_js_1.default.BadRequestError('NO_MONEY', "No money.", null);
                    case 2: return [4 /*yield*/, database_js_1.default.query("insert into `".concat(this.app, "`.t_withdraw (userID, money, status, note)\n                                values (?, ?, ?, ?)"), [
                            "".concat(this.token.userID),
                            cf.money,
                            0,
                            JSON.stringify(cf.note)
                        ])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', e_1.message, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Wallet.prototype.putWithdraw = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var data, sum, trans, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, database_js_1.default.query("select *\n                                          from `".concat(this.app, "`.t_withdraw\n                                          where id = ").concat(cf.id, ";"), [])];
                    case 1:
                        data = (_a.sent())[0];
                        if (!(['1', '-2'].indexOf("".concat(data.status)) !== -1)) return [3 /*break*/, 2];
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', "Already use.", null);
                    case 2: return [4 /*yield*/, database_js_1.default.query("SELECT sum(money)\n                                             FROM `".concat(this.app, "`.t_wallet\n                                             where status in (1, 2)\n                                               and userID = ?"), [data.userID])];
                    case 3:
                        sum = (_a.sent())[0]['sum(money)'] || 0;
                        if (!(sum < data.money)) return [3 /*break*/, 4];
                        throw exception_js_1.default.BadRequestError('NO_MONEY', "No money.", null);
                    case 4: return [4 /*yield*/, database_js_1.default.Transaction.build()];
                    case 5:
                        trans = _a.sent();
                        if (!("".concat(cf.status) === '1')) return [3 /*break*/, 7];
                        return [4 /*yield*/, trans.execute("insert into `".concat(this.app, "`.t_wallet (orderID, userID, money, status, note)\n                                             values (?, ?, ?, ?, ?)"), [
                                new Date().getTime(),
                                data.userID,
                                data.money * -1,
                                2,
                                JSON.stringify("用戶提款")
                            ])];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        console.log("update `".concat(this.app, "`.t_withdraw\n                                 set status=1\n                                 where id = ").concat(cf.id));
                        return [4 /*yield*/, trans.execute("update `".concat(this.app, "`.t_withdraw\n                                         set status=").concat(cf.status, ",\n                                             note=?\n                                         where id = ?"), [JSON.stringify(cf.note), cf.id])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, trans.commit()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, trans.release()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_2 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', e_2.message, null);
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Wallet.prototype.delete = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("update `".concat(this.app, "`.t_wallet\n                            set status= -2\n                            where id in (?)"), [cf.id.split(',')])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', e_3.message, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Wallet.prototype.deleteWithDraw = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.query("update `".concat(this.app, "`.t_withdraw\n                            set status= -2\n                            where id in (?)"), [cf.id.split(',')])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', e_4.message, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Wallet;
}());
exports.Wallet = Wallet;
