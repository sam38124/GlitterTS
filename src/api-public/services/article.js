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
exports.Article = void 0;
var database_js_1 = require("../../modules/database.js");
var exception_js_1 = require("../../modules/exception.js");
var Article = /** @class */ (function () {
    function Article(app_name, token) {
        this.app_name = app_name;
        this.token = token;
    }
    Article.prototype.addArticle = function (tData, status) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_js_1.default.query("select count(1) from `".concat(this.app_name, "`.t_manager_post where (content->>'$.type'='article') and (content->>'$.tag'='").concat(tData.tag, "')"), [])];
                    case 1:
                        if (!((_a.sent())[0]['count(1)'] === 0)) return [3 /*break*/, 3];
                        tData.type = 'article';
                        return [4 /*yield*/, database_js_1.default.query("insert into `".concat(this.app_name, "`.t_manager_post (userID,content,status) values (").concat(this.token.userID, ",?,?)"), [JSON.stringify(tData), status || 0])];
                    case 2:
                        data = (_a.sent());
                        return [2 /*return*/, data.insertId];
                    case 3: throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'Already exists.', null);
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', e_1.message, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Article.prototype.putArticle = function (tData) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        tData.content.type = 'article';
                        return [4 /*yield*/, database_js_1.default.query("update `".concat(this.app_name, "`.t_manager_post set content=? , updated_time=? ,status=? where id=? "), [JSON.stringify(tData.content), new Date(), (_a = tData.status) !== null && _a !== void 0 ? _a : 1, tData.id])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_2 = _b.sent();
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', e_2.message, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Article;
}());
exports.Article = Article;
