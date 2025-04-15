"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacebookPageLiveVideo = exports.getFacebookPagePicture = exports.getFacebookPages = exports.FacebookService = void 0;
var database_js_1 = require("../../modules/database.js");
var process_1 = require("process");
var private_config_js_1 = require("../../services/private_config.js");
var mime = require('mime');
/**
 * FacebookService
 * 用於處理與 Facebook Graph API 相關的業務邏輯，例如取得 OAuth 資訊、
 * 獲取粉絲專頁資料、啟動直播、取得直播留言等。
 */
var FacebookService = /** @class */ (function () {
    function FacebookService(app, token) {
        this.app = app;
        this.token = token;
    }
    /**
     * 取得 Facebook OAuth 的訪問憑證
     * @param obj - 包含 OAuth 驗證碼 (code) 的物件
     * @returns 成功時回傳 true，失敗時回傳 false
     */
    // 實作中會將取得的 access_token 存入應用程式的設定中
    // 並轉換過期時間為易於理解的格式
    FacebookService.prototype.getOauth = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var client_id, client_secret, redirect_uri, accessUrl;
            var _this = this;
            return __generator(this, function (_a) {
                client_id = process_1.default.env.fb_auth_client_id;
                client_secret = process_1.default.env.fb_auth_client_secret;
                redirect_uri = 'https://08e5ebd30cf4.ngrok.app/shopnex/shopnex-fb-oauth';
                accessUrl = "https://graph.facebook.com/v22.0/oauth/access_token?client_id=".concat(client_id, "&redirect_uri=").concat(redirect_uri, "&client_secret=").concat(client_secret, "&code=").concat(obj.code);
                //
                fetch(accessUrl)
                    .then(function (response) { return response.json(); })
                    .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                    var accessToken, tokenType, expiresIn, appName, expiryDate, passData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                accessToken = data.access_token;
                                tokenType = data.token_type;
                                expiresIn = data.expires_in;
                                appName = this.app;
                                expiryDate = new Date(Date.now() + expiresIn * 1000);
                                passData = {
                                    accessToken: accessToken,
                                    tokenType: tokenType,
                                    expiresIn: expiryDate,
                                };
                                return [4 /*yield*/, new private_config_js_1.Private_config(this.token).setConfig({
                                        appName: appName,
                                        key: 'fb_auth_token',
                                        value: passData,
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, true];
                        }
                    });
                }); })
                    .catch(function (error) {
                    console.error('Error fetching access token:', error);
                    return false;
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * 取得 Facebook 粉絲專頁授權的相關資訊，包括名稱、圖片與目前的直播狀態
     * @returns 包含粉絲專頁資訊的陣列
     */
    // 實作中會從設定中取得 access_token
    // 並使用它來獲取粉絲專頁的基本資訊與圖片 以及操作這個粉絲專頁所需要的access_token
    FacebookService.prototype.getAuthPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, pages, picturePromises, pagesWithPictures;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, private_config_js_1.Private_config.getConfig({
                            appName: this.app,
                            key: 'fb_auth_token',
                        })];
                    case 1:
                        tokenData = (_a.sent())[0].value;
                        return [4 /*yield*/, getFacebookPages(tokenData.accessToken)];
                    case 2:
                        pages = _a.sent();
                        picturePromises = pages.map(function (page) { return __awaiter(_this, void 0, void 0, function () {
                            var picture, live_video;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getFacebookPagePicture(page.id)];
                                    case 1:
                                        picture = _a.sent();
                                        return [4 /*yield*/, getFacebookPageLiveVideo(page.id, page.access_token)];
                                    case 2:
                                        live_video = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, page), { picture: picture, live_video: live_video })]; // 返回包含圖片的 page 物件
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(picturePromises)];
                    case 3:
                        pagesWithPictures = _a.sent();
                        return [2 /*return*/, pagesWithPictures.map(function (page) {
                                return {
                                    name: page.name,
                                    id: page.id,
                                    access_token: page.access_token,
                                    picture: page.picture,
                                    live_video: page.live_video,
                                };
                            })];
                }
            });
        });
    };
    //暫時用不到 他是開啟直播流 但目前沒後續接直播流的功能
    FacebookService.prototype.launchFacebookLive = function (liveData) {
        return __awaiter(this, void 0, void 0, function () {
            var startFacebookLive, pageId, accessToken;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startFacebookLive = function (pageId, accessToken) { return __awaiter(_this, void 0, void 0, function () {
                            var apiUrl, liveVideoParams, response, result, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        apiUrl = "https://graph.facebook.com/v22.0/".concat(pageId, "/live_videos?status=LIVE_NOW");
                                        liveVideoParams = {
                                            title: "工程師測試",
                                            description: "工程師測試",
                                            status: "LIVE_NOW", // 設置直播立即開始
                                        };
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, fetch(apiUrl, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    Authorization: "Bearer ".concat(accessToken),
                                                },
                                                body: JSON.stringify(liveVideoParams),
                                            })];
                                    case 2:
                                        response = _a.sent();
                                        if (!response.ok) {
                                            throw new Error("Facebook API \u56DE\u61C9\u5931\u6557: ".concat(response.statusText));
                                        }
                                        return [4 /*yield*/, response.json()];
                                    case 3:
                                        result = _a.sent();
                                        console.log("成功建立直播：", result);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_1 = _a.sent();
                                        console.error("建立 Facebook 直播時發生錯誤：", error_1);
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); };
                        pageId = liveData.id;
                        accessToken = liveData.access_token;
                        return [4 /*yield*/, startFacebookLive(pageId, accessToken)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取得指定直播影片的留言
     * @param scheduled_id 團購那張表的id
     * @param liveID - 直播影片的 ID
     * @param accessToken - Facebook 的訪問憑證
     * @param after - （可選）用於分頁的指標
     * @returns 包含留言資料的物件
     */
    // 使用 liveID 和 accessToken 呼叫 Facebook API 獲取留言
    // 如果提供了 after，則會取得該指標之後的留言
    FacebookService.prototype.getLiveComments = function (scheduled_id, liveID, accessToken, after) {
        return __awaiter(this, void 0, void 0, function () {
            function getScheduledData() {
                return __awaiter(this, void 0, void 0, function () {
                    var error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, database_js_1.default.query("\n          SELECT * \n          FROM `".concat(appName, "`.`t_live_purchase_interactions`\n          WHERE id = ?\n        "), [scheduled_id])];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                error_3 = _a.sent();
                                console.error("取得粉絲專頁圖片時發生錯誤：", error_3);
                                throw error_3;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            var appName, url, response, pagesResponse, scheduledData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appName = this.app;
                        url = "https://graph.facebook.com/v22.0/".concat(liveID, "/comments?access_token=").concat(accessToken).concat(after ? "&after=".concat(after) : "");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _a.sent();
                        // 檢查 HTTP 狀態碼
                        if (!response.ok) {
                            throw new Error("Facebook API \u56DE\u61C9\u5931\u6557: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        pagesResponse = _a.sent();
                        return [4 /*yield*/, getScheduledData()];
                    case 4:
                        scheduledData = _a.sent();
                        console.log("pagesResponse -- ", pagesResponse);
                        console.log("scheduledData -- ", scheduledData);
                        console.log("scheduled_id -- ", scheduled_id);
                        // 回傳粉絲專頁資料
                        pagesResponse.data.forEach(function (comment) {
                        });
                        return [2 /*return*/, pagesResponse];
                    case 5:
                        error_2 = _a.sent();
                        // 處理錯誤並回報
                        console.error("取得直播留言時發生錯誤：", error_2);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return FacebookService;
}());
exports.FacebookService = FacebookService;
//透過accessToken 取得這個用戶的所有已授權粉絲團
function getFacebookPages(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, pagesResponse, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://graph.facebook.com/v22.0/me/accounts?access_token=".concat(accessToken);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    // 檢查 HTTP 狀態碼
                    if (!response.ok) {
                        throw new Error("Facebook API \u56DE\u61C9\u5931\u6557: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    pagesResponse = _a.sent();
                    // 回傳粉絲專頁資料
                    return [2 /*return*/, pagesResponse.data];
                case 4:
                    error_4 = _a.sent();
                    // 處理錯誤並回報
                    console.error("取得粉絲專頁清單時發生錯誤：", error_4);
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getFacebookPages = getFacebookPages;
//取得這個對應id粉絲團的圖片
function getFacebookPagePicture(id) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://graph.facebook.com/v22.0/".concat(id, "/picture");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    // 檢查 HTTP 狀態碼
                    if (!response.ok) {
                        throw new Error("Facebook API \u56DE\u61C9\u5931\u6557: ".concat(response.statusText));
                    }
                    // 回傳粉絲專頁資料
                    return [2 /*return*/, response.url];
                case 3:
                    error_5 = _a.sent();
                    // 處理錯誤並回報
                    console.error("取得粉絲專頁圖片時發生錯誤：", error_5);
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getFacebookPagePicture = getFacebookPagePicture;
//取得這個對應id粉絲團的正在直播的影片 若要其他狀態 狀態碼在內層
function getFacebookPageLiveVideo(id, accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://graph.facebook.com/v22.0/".concat(id, "/live_videos?fields=id,status,broadcast_start_time,title&access_token=").concat(accessToken, "&broadcast_status=[\"LIVE\"]");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    // 檢查 HTTP 狀態碼
                    if (!response.ok) {
                        throw new Error("Facebook API \u56DE\u61C9\u5931\u6557: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    // 回傳粉絲專頁資料
                    return [2 /*return*/, data];
                case 4:
                    error_6 = _a.sent();
                    // 處理錯誤並回報
                    console.error("取得粉絲專頁圖片時發生錯誤：", error_6);
                    throw error_6;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getFacebookPageLiveVideo = getFacebookPageLiveVideo;
