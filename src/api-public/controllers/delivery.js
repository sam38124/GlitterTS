"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var delivery_js_1 = require("../services/delivery.js");
var redis_js_1 = require("../../modules/redis.js");
var paynow_logistics_js_1 = require("../services/paynow-logistics.js");
var shopping_js_1 = require("../services/shopping.js");
var router = express_1.default.Router();
router.post('/c2cRedirect', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var html, return_url_1, _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                html = String.raw;
                _a = URL.bind;
                return [4 /*yield*/, redis_js_1.default.getValue(req.query.return)];
            case 1:
                return_url_1 = new (_a.apply(URL, [void 0, (_b.sent())]))();
                Object.keys(req.body).map(function (key) {
                    return_url_1.searchParams.set(encodeURIComponent(key), encodeURIComponent(req.body[key]));
                });
                return [2 /*return*/, resp.send(html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\"/>\n            <title>Title</title>\n        </head>\n        <body>\n        <script>\n            try {\n                window.webkit.messageHandlers.addJsInterFace.postMessage(\n                        JSON.stringify({\n                            functionName: 'closeWebView',\n                            callBackId: 0,\n                            data: {},\n                        })\n                );\n            } catch (e) {\n            }\n            location.href = '", "';\n        </script>\n        </body>\n        </html> "], ["<!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\"/>\n            <title>Title</title>\n        </head>\n        <body>\n        <script>\n            try {\n                window.webkit.messageHandlers.addJsInterFace.postMessage(\n                        JSON.stringify({\n                            functionName: 'closeWebView',\n                            callBackId: 0,\n                            data: {},\n                        })\n                );\n            } catch (e) {\n            }\n            location.href = '", "';\n        </script>\n        </body>\n        </html> "])), return_url_1.href))];
            case 2:
                err_1 = _b.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/c2cNotify', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                return [4 /*yield*/, new delivery_js_1.Delivery(req.get('g-app')).notify(req.body)];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                err_2 = _d.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/notify', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // console.log(`delivery-notify=>`,req.body)
                //
                //通知更新訂單狀態
                return [4 /*yield*/, new shopping_js_1.Shopping(req.get('g-app')).getCheckOut({
                        page: 0,
                        limit: 1,
                        search: req.body.orderno,
                        searchType: 'cart_token',
                    })];
            case 1:
                // console.log(`delivery-notify=>`,req.body)
                //
                //通知更新訂單狀態
                _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, {
                        'success': true
                    })];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); });
//api-public/v1/delivery/storeMaps
router.post('/storeMaps', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_4;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = response_1.default).succ;
                _c = [resp];
                _d = {};
                return [4 /*yield*/, (new paynow_logistics_js_1.PayNowLogistics(req.get('g-app')).choseLogistics(req.body.logistics, req.body.returnURL))];
            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([(_d.form = _e.sent(), _d)]))];
            case 2:
                err_4 = _e.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/cancel-order', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new paynow_logistics_js_1.PayNowLogistics(req.get('g-app')).deleteLogOrder(req.body.cart_token, req.body.logistic_number, req.body.total_amount)];
            case 1:
                data = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { data: data })];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_5)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/orderInfo', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new delivery_js_1.Delivery(req.get('g-app')).getOrderInfo({
                        cart_token: "".concat(req.body.order_id),
                        shipment_date: req.body.shipment_date,
                    })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, response_1.default.succ(resp, { data: data })];
            case 2:
                err_6 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_6)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/formView', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var html, key_1, data, formString, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                html = String.raw;
                key_1 = 'delivery_' + req.query.id;
                return [4 /*yield*/, redis_js_1.default.getValue(key_1)];
            case 1:
                data = _a.sent();
                setTimeout(function () {
                    redis_js_1.default.deleteKey(key_1);
                }, 1000);
                formString = delivery_js_1.EcPay.generateForm(JSON.parse(data));
                return [2 /*return*/, resp.send(html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\"/>\n            <title>Title</title>\n        </head>\n        <body>\n        ", "\n        </body>\n        <script>\n            const myForm = document.getElementById('submit');\n            if (myForm) {\n                myForm.click();\n            }\n        </script>\n        </html>"], ["<!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\"/>\n            <title>Title</title>\n        </head>\n        <body>\n        ", "\n        </body>\n        <script>\n            const myForm = document.getElementById('submit');\n            if (myForm) {\n                myForm.click();\n            }\n        </script>\n        </html>"])), formString))];
            case 2:
                err_7 = _a.sent();
                return [2 /*return*/, response_1.default.fail(resp, err_7)];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/print-delivery', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var html, f_;
    return __generator(this, function (_a) {
        try {
            html = String.raw;
            f_ = paynow_logistics_js_1.PayNowLogistics.printStack.find(function (dd) {
                return dd.code === req.query.code;
            });
            if (f_ === null || f_ === void 0 ? void 0 : f_.html) {
                return [2 /*return*/, resp.send(f_.html)];
            }
            else {
                return [2 /*return*/, resp.send(html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["<!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\"/>\n            <title>Title</title>\n        </head>\n        <body>\n         Not Found\n        </body>\n        </html>"], ["<!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\"/>\n            <title>Title</title>\n        </head>\n        <body>\n         Not Found\n        </body>\n        </html>"]))))];
            }
        }
        catch (err) {
            return [2 /*return*/, response_1.default.fail(resp, err)];
        }
        return [2 /*return*/];
    });
}); });
var templateObject_1, templateObject_2, templateObject_3;
module.exports = router;
