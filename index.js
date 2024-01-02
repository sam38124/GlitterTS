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
        while (_) try {
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
exports.__esModule = true;
exports.api_public = exports.set_backend_editor = exports.set_frontend = void 0;
var fs = require("fs");
var index_1 = require("./src/index");
var config_1 = require("./src/config");
var post_1 = require("./src/api-public/services/post");
var database_1 = require("./src/modules/database");
var config_2 = require("./src/config");
var interface_1 = require("./src/lambda/interface");
function set_frontend(express, rout) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, rout_1, dd;
        var _this = this;
        return __generator(this, function (_a) {
            _loop_1 = function (dd) {
                express.use(dd.rout, function (req, resp, next) { return __awaiter(_this, void 0, void 0, function () {
                    var path, seo, fullPath, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                path = req.path;
                                if (path === '/') {
                                    path = "/index.html";
                                }
                                if (!((dd.path + path).indexOf('index.html') !== -1)) return [3 /*break*/, 2];
                                return [4 /*yield*/, dd.seoManager(req, resp)];
                            case 1:
                                seo = _a.sent();
                                fullPath = dd.path + "/index.html";
                                data = fs.readFileSync(fullPath, 'utf8');
                                resp.header('Content-Type', 'text/html; charset=UTF-8');
                                return [2 /*return*/, resp.send(data.replace(data.substring(data.indexOf("<head>"), data.indexOf("</head>")), seo))];
                            case 2: return [2 /*return*/, resp.sendFile(decodeURI((dd.path + path)))];
                        }
                    });
                }); });
            };
            for (_i = 0, rout_1 = rout; _i < rout_1.length; _i++) {
                dd = rout_1[_i];
                _loop_1(dd);
            }
            return [2 /*return*/];
        });
    });
}
exports.set_frontend = set_frontend;
function set_backend_editor(envPath, serverPort) {
    if (serverPort === void 0) { serverPort = 3090; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config_1.ConfigSetting.setConfig(envPath);
                    return [4 /*yield*/, (0, index_1.initial)(serverPort)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, index_1.app];
            }
        });
    });
}
exports.set_backend_editor = set_backend_editor;
exports.api_public = {
    get db() {
        return database_1["default"];
    },
    getAdConfig: function (appName, key) {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"].query("select `value`\n                                         from `" + config_2["default"].DB_NAME + "`.private_config\n                                         where app_name = '" + appName + "'\n                                           and `key` = " + database_1["default"].escape(key), [])];
                    case 1:
                        data = _a.sent();
                        resolve((data[0]) ? data[0]['value'] : {});
                        return [2 /*return*/];
                }
            });
        }); });
    },
    addPostObserver: function (callback) {
        post_1.Post.addPostObserver(callback);
    },
    lambda: interface_1.lambda
};
