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
var exception_1 = require("../../modules/exception");
var manager_js_1 = require("../services/manager.js");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var router = express_1.default.Router();
router.put('/config', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, new manager_js_1.Manager(req.body.token).setConfig({
                        appName: req.get('g-app'),
                        key: req.body.key,
                        value: req.body.value,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { result: true })];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/config', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_2;
    var _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {
                    result: true
                };
                return [4 /*yield*/, manager_js_1.Manager.getConfig({
                        appName: req.get('g-app'),
                        key: req.query.key,
                        language: req.headers['language']
                    })];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.value = (_f = ((_e = (_g.sent())[0]) !== null && _e !== void 0 ? _e : {})['value']) !== null && _f !== void 0 ? _f : '',
                        _d)]))];
            case 2:
                err_2 = _g.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
