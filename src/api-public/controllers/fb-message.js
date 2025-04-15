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
var ut_permission_js_1 = require("../utils/ut-permission.js");
var line_message_1 = require("../services/line-message");
var http_status_codes_1 = require("http-status-codes");
var fb_message_1 = require("../services/fb-message");
var router = express_1.default.Router();
router.get('/', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4 /*yield*/, ut_permission_js_1.UtPermission.isManager(req)];
            case 1:
                if (!_d.sent()) return [3 /*break*/, 3];
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new line_message_1.LineMessage(req.get('g-app'), req.body.token).getLine({
                        type: req.query.list ? "".concat(req.query.list) : '',
                        page: req.query.page ? parseInt("".concat(req.query.page), 10) : 0,
                        limit: req.query.limit ? parseInt("".concat(req.query.limit), 10) : 99999,
                        search: req.query.search ? "".concat(req.query.search) : '',
                        status: req.query.status !== undefined ? "".concat(req.query.status) : '',
                        searchType: req.query.searchType ? "".concat(req.query.searchType) : '',
                        mailType: req.query.mailType ? "".concat(req.query.mailType) : '',
                    })];
            case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3: return [2 /*return*/, response_1.default.fail(resp, exception_1.default.BadRequestError('BAD_REQUEST', 'No permission.', null))];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/listenMessage', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var challenge;
    var _a;
    return __generator(this, function (_b) {
        try {
            //FB webhook 驗證，記得網頁上的
            if (req.query['hub.verify_token'] === 'my_secret_token') {
                challenge = req.query["hub.challenge"];
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send(challenge)];
            }
            // https://www.facebook.com/dialog/oauth?client_id=556137570735606&redirect_uri=https%3A%2F%2Fshopnex.cc%2F&scope=pages_read_engagement%2Cpages_manage_metadata%2Cpages_read_user_content%2Cpages_show_list&state=test
            // https://www.facebook.com/dialog/oauth?
            //   client_id=556137570735606&
            //   redirect_uri=https://08e5ebd30cf4.ngrok.app/api-public/v1/fb_message/listenMessage?g-app=t_1725992531001&
            // scope=pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_show_list&
            // state=test
            // https://shopnex.tw/#_=_?code=AQAuNqckNF5AjMwBCZB--xamyoAt9MMzM_Pz-cxfUpRw6Syy0ry7uu6KeS5REtEqyAv_RrXCt7WerYM8FqjpD7ObOBUYPRWqCKa9I0ja6H4-TA9qOVm0hu0-8zYRxmMo4UqCB6iOO6SiLVC33WPoHKcSPYAwXWcYVUimGwEflGHnFWB_lHvVFjG-rygSa74o3NyuejXdH8I8LRKq2yJyzLltc604nJwM63-n7siKfjwQJYkaJ3ityMeVAbhS0Z9GaifbfAatYfqbBNqkn0hsGiDy-rxsWJbB8O0NO0qNaVUYLCU7aXhNFMmpj-sYksNZkfOF9a_t3m3K4k7jUd1XjmQgyovEnsfPWUsflQsoV3d4eJ1jJqgn_2o_qmK0RH1XNR4&state=test
            // https://shopnex.tw/#_=_?code=AQCbDv2wFIm2B-LONfMaPdb7WhNNu33k6Jb1R2XE76hPinG0LSq8aND1QAj_X9-bI4PAdOn97DNfgHhfkI50cYa7rHLhams7JjQTCJDbCcQQx3Pbz1CTQdRhkUo2zK0CtzUVM5VSSSnX_fOINPIti_R9e_2upwSeRwzOPgTPCymAiE7cNglrwqie7fq3oXC8I17GMy4-YQh8yVcabiHs2oFcCYmt4RPyp0jqMUN9Nes4KgbgiHvQRLjnCe0ioPl6r17SkfN1_wJQ4c823FYdGA_3Ak-AgvG6N_rbcfCIeVNY3h2LuoipigJHQya-Q_Cz3A_YD93WB0rj71hQ5kTho8q7JJGO2WQf3dzOoAv13oKRBHgHRI2m_AOq3hIXzDEdtuE
            //       // &state=test
            //
            //   https://graph.facebook.com/v22.0/oauth/access_token?client_id=556137570735606&redirect_uri=https%3A%2F%2Fshopnex.cc%2F&client_secret=861f9adf9c3c147a5f78246d03e6dabe&code=AQAo3dKiL9TR_lBG0MMFCVk9TqRDH9xWVF164XbB4V-xCYT3GC8peOdx-xwu3xj0vDRuM8RUyoSOIJ3J_Jv9b2LTy54l12WzjzZAme7y16PvbiJMEv0q49M_nENlLpPWF47LSsLJ6QCVoZLBONFge0irZnGDoMjlAww2NJASknaczDFj0WHdno-SUWgPMTZJkUFSTFOeRjGpl2olp5gDYXG1XoDr1RWw5AkZ0kMsJd-4nrSfoJkS7LORlgZ0YIIMh0rlLqCw7abIGpqA7sd3Obx16u7ijvw8sGsnBnqZJ1_OqFoqKkuYGpAWCnWnsuW98wbsnjut8OQ2ytQH0siBkK9rKJgvZNIMyShe7lwJVLK2iKRcs0_w_Gn1iAr7GVGSGyw
            // await new LineMessage(req.get('g-app') as string, req.body.token).listenMessage(req.body)
            // return response.succ(
            //     resp,
            //     {
            //         "result":"OK"
            //     }
            // )
            return [2 /*return*/, response_1.default.succ(resp, {
                    "result": "OK"
                })];
        }
        catch (err) {
            return [2 /*return*/, response_1.default.fail(resp, ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message)];
        }
        return [2 /*return*/];
    });
}); });
router.post('/listenMessage', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new fb_message_1.FbMessage(req.get('g-app'), req.body.token).listenMessage(req.body)];
            case 1:
                _b.sent();
                return [2 /*return*/, resp.status(http_status_codes_1.default.OK).send("收到你的訊息")];
            case 2:
                err_2 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, ((_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) || err_2.message)];
            case 3: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
