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
exports.IosRelease = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var firebase_js_1 = require("../modules/firebase.js");
var ios_project_js_1 = require("./ios-project.js");
var sharp_1 = require("sharp");
var axios_1 = require("axios");
var IosRelease = /** @class */ (function () {
    function IosRelease() {
    }
    //產生APP的圖標
    IosRelease.generateIcon = function (url, inputImage, outputDir) {
        return __awaiter(this, void 0, void 0, function () {
            // 生成圖標函數
            function generateIcons(inputImage) {
                return __awaiter(this, void 0, void 0, function () {
                    var _i, iosIconSizes_1, icon, iconSize, outputFile, try_c, pass, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _i = 0, iosIconSizes_1 = iosIconSizes;
                                _a.label = 1;
                            case 1:
                                if (!(_i < iosIconSizes_1.length)) return [3 /*break*/, 8];
                                icon = iosIconSizes_1[_i];
                                if (!icon.filename) return [3 /*break*/, 7];
                                iconSize = parseInt(icon.size.split('x')[0], 10) * parseInt(icon.scale.replace('x', ''), 10);
                                outputFile = path_1.default.join(outputDir, icon.filename);
                                try_c = 0;
                                pass = false;
                                _a.label = 2;
                            case 2:
                                if (!(try_c < 3 && !pass)) return [3 /*break*/, 7];
                                _a.label = 3;
                            case 3:
                                _a.trys.push([3, 5, , 6]);
                                return [4 /*yield*/, (0, sharp_1.default)(inputImage)
                                        .resize(iconSize, iconSize) // 調整寬高
                                        .toFile(outputFile)];
                            case 4:
                                _a.sent(); // 輸出到檔案
                                console.log("Generated: ".concat(outputFile));
                                pass = true;
                                return [3 /*break*/, 6];
                            case 5:
                                error_1 = _a.sent();
                                try_c++;
                                console.error("Failed to generate icon ".concat(outputFile, ":"), error_1);
                                return [3 /*break*/, 6];
                            case 6: return [3 /*break*/, 2];
                            case 7:
                                _i++;
                                return [3 /*break*/, 1];
                            case 8: return [2 /*return*/];
                        }
                    });
                });
            }
            var iosIconSizes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //下載IOS APP LOGO
                    return [4 /*yield*/, downloadImage(url, inputImage)];
                    case 1:
                        //下載IOS APP LOGO
                        _a.sent();
                        iosIconSizes = [
                            {
                                filename: '40.png',
                                idiom: 'iphone',
                                scale: '2x',
                                size: '20x20',
                            },
                            {
                                filename: '60.png',
                                idiom: 'iphone',
                                scale: '3x',
                                size: '20x20',
                            },
                            {
                                filename: '29.png',
                                idiom: 'iphone',
                                scale: '1x',
                                size: '29x29',
                            },
                            {
                                filename: '58.png',
                                idiom: 'iphone',
                                scale: '2x',
                                size: '29x29',
                            },
                            {
                                filename: '87.png',
                                idiom: 'iphone',
                                scale: '3x',
                                size: '29x29',
                            },
                            {
                                filename: '80.png',
                                idiom: 'iphone',
                                scale: '2x',
                                size: '40x40',
                            },
                            {
                                filename: '120.png',
                                idiom: 'iphone',
                                scale: '3x',
                                size: '40x40',
                            },
                            {
                                filename: '57.png',
                                idiom: 'iphone',
                                scale: '1x',
                                size: '57x57',
                            },
                            {
                                filename: '114.png',
                                idiom: 'iphone',
                                scale: '2x',
                                size: '57x57',
                            },
                            {
                                filename: '120.png',
                                idiom: 'iphone',
                                scale: '2x',
                                size: '60x60',
                            },
                            {
                                filename: '180.png',
                                idiom: 'iphone',
                                scale: '3x',
                                size: '60x60',
                            },
                            {
                                filename: '20.png',
                                idiom: 'ipad',
                                scale: '1x',
                                size: '20x20',
                            },
                            {
                                filename: '40.png',
                                idiom: 'ipad',
                                scale: '2x',
                                size: '20x20',
                            },
                            {
                                filename: '29.png',
                                idiom: 'ipad',
                                scale: '1x',
                                size: '29x29',
                            },
                            {
                                filename: '58.png',
                                idiom: 'ipad',
                                scale: '2x',
                                size: '29x29',
                            },
                            {
                                filename: '40.png',
                                idiom: 'ipad',
                                scale: '1x',
                                size: '40x40',
                            },
                            {
                                filename: '80.png',
                                idiom: 'ipad',
                                scale: '2x',
                                size: '40x40',
                            },
                            {
                                filename: '50.png',
                                idiom: 'ipad',
                                scale: '1x',
                                size: '50x50',
                            },
                            {
                                filename: '100.png',
                                idiom: 'ipad',
                                scale: '2x',
                                size: '50x50',
                            },
                            {
                                filename: '72.png',
                                idiom: 'ipad',
                                scale: '1x',
                                size: '72x72',
                            },
                            {
                                filename: '144.png',
                                idiom: 'ipad',
                                scale: '2x',
                                size: '72x72',
                            },
                            {
                                filename: '76.png',
                                idiom: 'ipad',
                                scale: '1x',
                                size: '76x76',
                            },
                            {
                                filename: '152.png',
                                idiom: 'ipad',
                                scale: '2x',
                                size: '76x76',
                            },
                            {
                                filename: '167.png',
                                idiom: 'ipad',
                                scale: '2x',
                                size: '83.5x83.5',
                            },
                            {
                                filename: '1024.png',
                                idiom: 'ios-marketing',
                                scale: '1x',
                                size: '1024x1024',
                            },
                            {
                                filename: '16.png',
                                idiom: 'mac',
                                scale: '1x',
                                size: '16x16',
                            },
                            {
                                filename: '32.png',
                                idiom: 'mac',
                                scale: '2x',
                                size: '16x16',
                            },
                            {
                                filename: '32.png',
                                idiom: 'mac',
                                scale: '1x',
                                size: '32x32',
                            },
                            {
                                filename: '64.png',
                                idiom: 'mac',
                                scale: '2x',
                                size: '32x32',
                            },
                            {
                                filename: '128.png',
                                idiom: 'mac',
                                scale: '1x',
                                size: '128x128',
                            },
                            {
                                filename: '256.png',
                                idiom: 'mac',
                                scale: '2x',
                                size: '128x128',
                            },
                            {
                                filename: '256.png',
                                idiom: 'mac',
                                scale: '1x',
                                size: '256x256',
                            },
                            {
                                filename: '512.png',
                                idiom: 'mac',
                                scale: '2x',
                                size: '256x256',
                            },
                            {
                                filename: '512.png',
                                idiom: 'mac',
                                scale: '1x',
                                size: '512x512',
                            },
                            {
                                filename: '1024.png',
                                idiom: 'mac',
                                scale: '2x',
                                size: '512x512',
                            },
                            {
                                filename: '48.png',
                                idiom: 'watch',
                                role: 'notificationCenter',
                                scale: '2x',
                                size: '24x24',
                                subtype: '38mm',
                            },
                            {
                                filename: '55.png',
                                idiom: 'watch',
                                role: 'notificationCenter',
                                scale: '2x',
                                size: '27.5x27.5',
                                subtype: '42mm',
                            },
                            {
                                filename: '58.png',
                                idiom: 'watch',
                                role: 'companionSettings',
                                scale: '2x',
                                size: '29x29',
                            },
                            {
                                filename: '87.png',
                                idiom: 'watch',
                                role: 'companionSettings',
                                scale: '3x',
                                size: '29x29',
                            },
                            {
                                filename: '66.png',
                                idiom: 'watch',
                                role: 'notificationCenter',
                                scale: '2x',
                                size: '33x33',
                                subtype: '45mm',
                            },
                            {
                                filename: '80.png',
                                idiom: 'watch',
                                role: 'appLauncher',
                                scale: '2x',
                                size: '40x40',
                                subtype: '38mm',
                            },
                            {
                                filename: '88.png',
                                idiom: 'watch',
                                role: 'appLauncher',
                                scale: '2x',
                                size: '44x44',
                                subtype: '40mm',
                            },
                            {
                                filename: '92.png',
                                idiom: 'watch',
                                role: 'appLauncher',
                                scale: '2x',
                                size: '46x46',
                                subtype: '41mm',
                            },
                            {
                                filename: '100.png',
                                idiom: 'watch',
                                role: 'appLauncher',
                                scale: '2x',
                                size: '50x50',
                                subtype: '44mm',
                            },
                            {
                                idiom: 'watch',
                                role: 'appLauncher',
                                scale: '2x',
                                size: '51x51',
                                subtype: '45mm',
                            },
                            {
                                idiom: 'watch',
                                role: 'appLauncher',
                                scale: '2x',
                                size: '54x54',
                                subtype: '49mm',
                            },
                            {
                                filename: '172.png',
                                idiom: 'watch',
                                role: 'quickLook',
                                scale: '2x',
                                size: '86x86',
                                subtype: '38mm',
                            },
                            {
                                filename: '196.png',
                                idiom: 'watch',
                                role: 'quickLook',
                                scale: '2x',
                                size: '98x98',
                                subtype: '42mm',
                            },
                            {
                                filename: '216.png',
                                idiom: 'watch',
                                role: 'quickLook',
                                scale: '2x',
                                size: '108x108',
                                subtype: '44mm',
                            },
                            {
                                idiom: 'watch',
                                role: 'quickLook',
                                scale: '2x',
                                size: '117x117',
                                subtype: '45mm',
                            },
                            {
                                idiom: 'watch',
                                role: 'quickLook',
                                scale: '2x',
                                size: '129x129',
                                subtype: '49mm',
                            },
                            {
                                filename: '1024.png',
                                idiom: 'watch-marketing',
                                scale: '1x',
                                size: '1024x1024',
                            },
                            {
                                filename: '102.png',
                                idiom: 'watch',
                                role: 'appLauncher',
                                scale: '2x',
                                size: '45x45',
                                subtype: '41mm',
                            },
                        ];
                        // 確保輸出資料夾存在
                        if (!fs_1.default.existsSync(outputDir)) {
                            fs_1.default.mkdirSync(outputDir);
                        }
                        // 開始生成圖標
                        return [4 /*yield*/, generateIcons(inputImage)];
                    case 2:
                        // 開始生成圖標
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //產生APP的封面圖片
    IosRelease.generateAppLanding = function (url, inputImage, outputDir) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, b;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    //下載Landing Page
                    return [4 /*yield*/, downloadImage(url, inputImage)];
                    case 1:
                        //下載Landing Page
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    resolve(true);
                                }, 500);
                            })];
                    case 2:
                        _b.sent();
                        //覆蓋封面圖片
                        for (_i = 0, _a = ['封面.png', '封面 1.png', '封面 2.png']; _i < _a.length; _i++) {
                            b = _a[_i];
                            fs_1.default.copyFileSync(inputImage, "".concat(outputDir, "/").concat(b));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //更改包名
    IosRelease.changePackageName = function (project_router, bundleID, config) {
        var data = fs_1.default.readFileSync(project_router, 'utf8');
        data = data
            .replace(/PRODUCT_BUNDLE_IDENTIFIER([\s\S]*?);/g, "PRODUCT_BUNDLE_IDENTIFIER = ".concat(bundleID, ";"))
            .replace(/INFOPLIST_KEY_CFBundleDisplayName([\s\S]*?);/g, "INFOPLIST_KEY_CFBundleDisplayName = \"".concat(config.name, "\";"));
        fs_1.default.writeFileSync(path_1.default.resolve(project_router), data);
    };
    //更改InfoPlist
    IosRelease.changeInfo = function (project_router, bundleID, config) {
        var pat_ = path_1.default.resolve(project_router, '../../proshake/Info.plist');
        var data = fs_1.default.readFileSync(pat_, 'utf8');
        data = data
            .replace('com.shopnex.t-1725992531001', bundleID)
            .replace('com.shopnex.t-1725992531001', bundleID);
        fs_1.default.writeFileSync(pat_, data);
    };
    //
    IosRelease.start = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        //註冊FCM推播通知
                        return [4 /*yield*/, firebase_js_1.Firebase.appRegister({
                                appName: cf.appDomain,
                                appID: cf.bundleID,
                                type: 'ios',
                            })];
                    case 1:
                        //註冊FCM推播通知
                        _d.sent();
                        //產生APP的ICON
                        return [4 /*yield*/, IosRelease.generateIcon(cf.config.logo, path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/AppIcon.appiconset/original.png'), path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/AppIcon.appiconset'))];
                    case 2:
                        //產生APP的ICON
                        _d.sent();
                        //產生封面圖片
                        return [4 /*yield*/, IosRelease.generateAppLanding(cf.config.landing_page, path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/preview.imageset/original.png'), path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/preview.imageset'))];
                    case 3:
                        //產生封面圖片
                        _d.sent();
                        //更改APP包名
                        this.changePackageName(cf.project_router, cf.bundleID, cf.config);
                        //更改Info
                        this.changeInfo(cf.project_router, cf.bundleID, cf.config);
                        fs_1.default.writeFileSync(path_1.default.resolve(cf.project_router, '../../proshake/ViewController.swift'), ios_project_js_1.IosProject.getViewController("https://".concat(cf.domain_url)));
                        _b = (_a = fs_1.default).writeFileSync;
                        _c = [path_1.default.resolve(cf.project_router, '../../proshake/GoogleService-Info.plist')];
                        return [4 /*yield*/, firebase_js_1.Firebase.getConfig({
                                appID: cf.bundleID,
                                type: 'ios',
                                appDomain: cf.appDomain,
                            })];
                    case 4:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _d.sent();
                        console.log(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return IosRelease;
}());
exports.IosRelease = IosRelease;
function downloadImage(url, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var response, writer, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: url, // 圖片的 URL
                            method: 'GET',
                            responseType: 'stream', // 請求以流的方式返回數據
                        })];
                case 1:
                    response = _a.sent();
                    writer = fs_1.default.createWriteStream(outputPath);
                    response.data.pipe(writer);
                    writer.on('finish', function () { return console.log('Image downloaded successfully:', outputPath); });
                    writer.on('error', function (err) {
                        console.error('Error writing the image to disk:', err);
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error while downloading image:".concat(error_2));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
