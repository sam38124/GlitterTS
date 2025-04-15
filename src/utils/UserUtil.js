'use strict';
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
var jsonwebtoken_1 = require("jsonwebtoken");
var logger_1 = require("../modules/logger");
var database_1 = require("../modules/database");
var redis_1 = require("../modules/redis");
var config_1 = require("../config");
var UserUtil = /** @class */ (function () {
    function UserUtil() {
    }
    UserUtil.insertNewUser = function (trans, id, email, pwd, firstName, lastName, gender, birth) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SQL = "\n            INSERT INTO t_user (id, email,\n                                first_name,\n                                last_name,\n                                gender,\n                                ".concat(birth ? 'birth,' : '', "\n                                pwd)\n            VALUES (").concat(id, ", ").concat(database_1.default.escape(email), ",\n                    ").concat(database_1.default.escape(firstName), ",\n                    ").concat(database_1.default.escape(lastName), ",\n                    ").concat(gender, ",\n                    ").concat(birth ? "".concat(database_1.default.escape(birth), ",") : '', "\n                    ").concat(database_1.default.escape(pwd), ")\n        ");
                        return [4 /*yield*/, trans.execute(SQL, {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserUtil.updateUser = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var SQL;
            var trans = _b.trans, id = _b.id, email = _b.email, pwd = _b.pwd, firstName = _b.firstName, lastName = _b.lastName, gender = _b.gender, phone = _b.phone, birth = _b.birth;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        SQL = "\n            update t_user\n            set first_name= ".concat(database_1.default.escape(firstName), ",\n                last_name= ").concat(database_1.default.escape(lastName), ",\n                phone=").concat(database_1.default.escape(phone), ",\n                ").concat(pwd ? "pwd=".concat(database_1.default.escape(pwd), ",") : '', "\n                    ").concat(gender ? "gender= ".concat(gender, ",") : '', " ").concat(birth ? "birth= ".concat(database_1.default.escape(birth), ",") : '', "\n                id=").concat(id, "\n            where email = ").concat(database_1.default.escape(email), "\n        ");
                        return [4 /*yield*/, trans.execute(SQL, {})];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserUtil.generateToken = function (userObj) {
        return __awaiter(this, void 0, void 0, function () {
            var iat, expTime, payload, signedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iat = Math.floor(Date.now() / 1000);
                        expTime = 365 * 24 * 60 * 60;
                        payload = {
                            account: userObj.account,
                            userID: userObj.user_id,
                            iat: iat,
                            exp: iat + expTime,
                            userData: userObj.userData
                        };
                        signedToken = jsonwebtoken_1.default.sign(payload, config_1.default.SECRET_KEY);
                        // set redis
                        return [4 /*yield*/, redis_1.default.setValue(signedToken, String(iat))];
                    case 1:
                        // set redis
                        _a.sent();
                        return [2 /*return*/, signedToken];
                }
            });
        });
    };
    UserUtil.expireToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var logger, TAG;
            return __generator(this, function (_a) {
                logger = new logger_1.default();
                TAG = 'ExpireToken';
                logger.info(TAG, 'Expire token in redis.');
                redis_1.default.expire(token, 0);
                return [2 /*return*/];
            });
        });
    };
    return UserUtil;
}());
exports.default = UserUtil;
