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
exports.Manager = void 0;
var exception_js_1 = require("../../modules/exception.js");
var database_js_1 = require("../../modules/database.js");
var Manager = /** @class */ (function () {
    function Manager(token) {
        this.token = token;
    }
    Manager.prototype.setConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.execute("replace\n            into `".concat(config.appName, "`.public_config (`key`,`value`,updated_at)\n            values (?,?,?)\n            "), [
                                config.key,
                                config.value,
                                new Date()
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_1, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Manager.getConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = this.checkData;
                        return [4 /*yield*/, database_js_1.default.execute("select *\n                                                          from `".concat(config.appName, "`.public_config\n                                                          where `key` = ").concat(database_js_1.default.escape(config.key), "\n            "), [])];
                    case 1: return [4 /*yield*/, _a.apply(this, [_b.sent(), config.language])];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        e_2 = _b.sent();
                        console.log(e_2);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_2, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Manager.checkData = function (data, language) {
        return __awaiter(this, void 0, void 0, function () {
            function loop(array) {
                array.map(function (dd) {
                    if (dd.language_data && dd.language_data[language]) {
                        dd.code = dd.language_data[language].seo.domain || dd.code;
                        dd.seo_content = dd.language_data[language].seo.content || dd.seo_content;
                        dd.seo_title = dd.language_data[language].seo.title || dd.seo_title;
                        if (dd.array) {
                            loop(dd.array);
                        }
                    }
                });
            }
            var data_;
            return __generator(this, function (_a) {
                if (data[0]) {
                    data_ = data[0];
                    switch (data_.key) {
                        case 'collection':
                            loop(data_.value);
                            break;
                    }
                }
                return [2 /*return*/, data];
            });
        });
    };
    return Manager;
}());
exports.Manager = Manager;
