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
exports.CustomCode = void 0;
var private_config_js_1 = require("../../services/private_config.js");
var database_js_1 = require("../../modules/database.js");
var user_js_1 = require("./user.js");
var firebase_js_1 = require("../../modules/firebase.js");
var CustomCode = /** @class */ (function () {
    function CustomCode(appName) {
        this.appName = '';
        this.appName = appName;
    }
    CustomCode.prototype.loginHook = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute('glitter_login_webhook', config)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomCode.prototype.checkOutHook = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute('glitter_finance_webhook', config)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomCode.prototype.execute = function (key, config) {
        return __awaiter(this, void 0, void 0, function () {
            var sqlData, webHook, evalString;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.appName, key: key
                        })];
                    case 1:
                        sqlData = (_a.sent());
                        if (!sqlData[0] || !sqlData[0].value) {
                            return [2 /*return*/];
                        }
                        webHook = sqlData[0].value.value;
                        evalString = "\n                return {\n                    execute:(obj)=>{\n                      ".concat(webHook, "\n                    }\n                }\n                ");
                        return [4 /*yield*/, database_js_1.default.queryLambada({
                                database: this.appName
                            }, function (sql) { return __awaiter(_this, void 0, void 0, function () {
                                var originUserData, userID, myFunction;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            originUserData = config.userData && JSON.stringify(config.userData.userData);
                                            userID = config.userData && config.userData.userID;
                                            myFunction = new Function(evalString);
                                            config.userID = userID;
                                            config.sql = sql;
                                            config.userData = config.userData && config.userData.userData;
                                            config.fcm = new firebase_js_1.Firebase(this.appName);
                                            return [4 /*yield*/, (myFunction().execute(config))];
                                        case 1:
                                            (_a.sent());
                                            if (!(config.userData && (JSON.stringify(config.userData) !== originUserData))) return [3 /*break*/, 3];
                                            return [4 /*yield*/, (new user_js_1.User(this.appName).updateUserData(userID, {
                                                    userData: config.userData
                                                }, true))];
                                        case 2:
                                            (_a.sent());
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CustomCode;
}());
exports.CustomCode = CustomCode;
