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
var config_1 = require("../../config");
var exception_1 = require("../../modules/exception");
var shopping_js_1 = require("../services/shopping.js");
var release_js_1 = require("../../services/release.js");
var path_1 = require("path");
var ut_permission_js_1 = require("../utils/ut-permission.js");
var private_config_js_1 = require("../../services/private_config.js");
var ios_release_js_1 = require("../../services/ios-release.js");
var router = express_1.default.Router();
router.get('/release', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, _b, _c, err_1;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 2, , 3]);
                query = ["(content->>'$.type'='".concat(req.query.type, "')")];
                req.query.search &&
                    query.push("(UPPER(JSON_UNQUOTE(JSON_EXTRACT(content, '$.title'))) LIKE UPPER('%".concat(req.query.search, "%'))"));
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new shopping_js_1.Shopping(req.get('g-app'), req.body.token).querySql(query, {
                        page: ((_d = req.query.page) !== null && _d !== void 0 ? _d : 0),
                        limit: ((_e = req.query.limit) !== null && _e !== void 0 ? _e : 50),
                        id: req.query.id,
                    })];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_f.sent()]))];
            case 2:
                err_1 = _f.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/release/ios/download', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var file, copyFile, domain, config_2, url, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 7];
                file = new Date().getTime();
                copyFile = path_1.default.resolve(__filename, "../../../app-project/work-space/".concat(file));
                release_js_1.Release.copyFolderSync(path_1.default.resolve(__filename, '../../../app-project/ios'), copyFile);
                return [4 /*yield*/, database_1.default.query("select `domain`\n           from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n           where appName = ?"), [req.get('g-app')])];
            case 2:
                domain = (_a.sent())[0]['domain'];
                return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                        appName: req.get('g-app'),
                        key: 'glitter_app_release',
                    })];
            case 3:
                config_2 = (_a.sent())[0].value;
                return [4 /*yield*/, ios_release_js_1.IosRelease.start({
                        appName: config_2.name,
                        bundleID: config_2.ios_app_bundle_id || (domain),
                        glitter_domain: config_2.domain,
                        appDomain: req.get('g-app'),
                        project_router: copyFile + '/proshake.xcodeproj/project.pbxproj',
                        domain_url: domain,
                        config: config_2,
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, release_js_1.Release.compressFiles(copyFile, "".concat(copyFile, ".zip"))];
            case 5:
                _a.sent();
                return [4 /*yield*/, release_js_1.Release.uploadFile("".concat(copyFile, ".zip"), "".concat(copyFile, ".zip"))];
            case 6:
                url = _a.sent();
                release_js_1.Release.deleteFile("".concat(copyFile, ".zip"));
                release_js_1.Release.deleteFolder("".concat(copyFile));
                return [2 /*return*/, response_1.default.succ(resp, {
                        url: url
                    })];
            case 7: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 8: return [3 /*break*/, 10];
            case 9:
                err_2 = _a.sent();
                console.error(err_2);
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/release/android/download', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var file, copyFile, domain, url, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 6];
                file = new Date().getTime();
                copyFile = path_1.default.resolve(__filename, "../../../app-project/work-space/".concat(file));
                release_js_1.Release.copyFolderSync(path_1.default.resolve(__filename, '../../../app-project/android'), copyFile);
                return [4 /*yield*/, database_1.default.query("select `domain`\n           from `".concat(config_1.saasConfig.SAAS_NAME, "`.app_config\n           where appName = ?"), [req.get('g-app')])];
            case 2:
                domain = (_a.sent())[0]['domain'];
                return [4 /*yield*/, release_js_1.Release.android({
                        appName: req.body.app_name,
                        bundleID: req.body.bundle_id,
                        glitter_domain: config_1.config.domain,
                        appDomain: req.get('g-app'),
                        project_router: copyFile,
                        domain_url: domain,
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, release_js_1.Release.compressFiles(copyFile, "".concat(copyFile, ".zip"))];
            case 4:
                _a.sent();
                return [4 /*yield*/, release_js_1.Release.uploadFile("".concat(copyFile, ".zip"), "".concat(copyFile, ".zip"))];
            case 5:
                url = _a.sent();
                release_js_1.Release.deleteFile("".concat(copyFile, ".zip"));
                release_js_1.Release.deleteFolder("".concat(copyFile));
                return [2 /*return*/, response_1.default.succ(resp, {
                        url: url,
                    })];
            case 6: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_3 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 9: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
