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
exports.Release = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var archiver_1 = require("archiver");
var aws_sdk_1 = require("aws-sdk");
var config_js_1 = require("../config.js");
var exception_js_1 = require("../modules/exception.js");
var firebase_js_1 = require("../modules/firebase.js");
var android_project_js_1 = require("./android-project.js");
var Release = /** @class */ (function () {
    function Release() {
    }
    Release.android = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, firebase_js_1.Firebase.appRegister({
                                appName: cf.appDomain,
                                appID: cf.bundleID,
                                type: 'android',
                            })];
                    case 1:
                        _d.sent();
                        fs_1.default.writeFileSync(path_1.default.resolve(cf.project_router, './app/src/main/java/com/ncdesign/kenda/MyAPP.kt'), android_project_js_1.AndroidProject.appKt(cf.domain_url));
                        _b = (_a = fs_1.default).writeFileSync;
                        _c = [path_1.default.resolve(cf.project_router, './app/google-services.json')];
                        return [4 /*yield*/, firebase_js_1.Firebase.getConfig({
                                appID: cf.bundleID,
                                type: 'android',
                                appDomain: cf.appDomain,
                            })];
                    case 2:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        return [4 /*yield*/, this.resetProjectRouter({
                                project_router: cf.project_router,
                                targetString: 'com.ncdesign.kenda',
                                replacementString: cf.bundleID,
                            })];
                    case 3:
                        _d.sent();
                        fs_1.default.renameSync(path_1.default.resolve(cf.project_router, './app/src/main/java/com/ncdesign/kenda'), path_1.default.resolve(cf.project_router, 'temp_file'));
                        Release.deleteFolder(path_1.default.resolve(cf.project_router, './app/src/main/java/com'));
                        fs_1.default.mkdirSync(path_1.default.resolve(cf.project_router, "./app/src/main/java/".concat(cf.bundleID.split('.').join('/'))), {
                            recursive: true,
                        });
                        fs_1.default.renameSync(path_1.default.resolve(cf.project_router, 'temp_file'), path_1.default.resolve(cf.project_router, "./app/src/main/java/".concat(cf.bundleID.split('.').join('/'))));
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _d.sent();
                        console.log(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Release.resetProjectRouter = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var replaceInFile, traverseDirectory;
            var _this = this;
            return __generator(this, function (_a) {
                replaceInFile = function (filePath) {
                    fs_1.default.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            console.error("Error reading file ".concat(filePath, ":"), err);
                            return;
                        }
                        if (data.includes(cf.targetString)) {
                            var result = data.replace(new RegExp(cf.targetString, 'g'), cf.replacementString);
                            fs_1.default.writeFile(filePath, result, 'utf8', function (err) {
                                if (err) {
                                    console.error("Error writing file ".concat(filePath, ":"), err);
                                }
                                else {
                                    console.log("Replaced in file: ".concat(filePath));
                                }
                            });
                        }
                    });
                };
                traverseDirectory = function (dir) {
                    fs_1.default.readdir(dir, { withFileTypes: true }, function (err, files) {
                        if (err) {
                            console.error("Error reading directory ".concat(dir, ":"), err);
                            return;
                        }
                        files.forEach(function (file) {
                            var fullPath = path_1.default.join(dir, file.name);
                            if (file.isDirectory()) {
                                traverseDirectory(fullPath);
                            }
                            else if (file.isFile()) {
                                replaceInFile(fullPath);
                            }
                        });
                    });
                };
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            traverseDirectory(cf.project_router);
                            setTimeout(function () {
                                resolve(true);
                            }, 2000);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    Release.getHtml = function (cf) {
        var html = "<!DOCTYPE html>\n<meta name=\"viewport\" content=\"width=device-width,height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1,user-scalable=no,initial-scale=1.0001,maximum-scale=1.0001,viewport-fit=cover\">\n<html lang=\"en\">\n<head>\n</head>\n\n<style>\n    .selectComponentHover{\n        border: 4px solid dodgerblue !important;\n        border-radius: 5px !important;\n        box-sizing: border-box !important;\n    }\n  #toast {\n    position: absolute;\n    z-index: 2147483646;\n    background-color: black;\n    opacity: .8;\n    color: white;\n    bottom: 100px;\n    max-width: calc(100% - 20px);\n    transform: translateX(-50%);\n    left: 50%;\n    font-size: 14px;\n    border-radius: 10px;\n    padding: 10px;\n    display: none;\n  }\n\n  body{\n    margin: 0;\n    padding: 0;\n    overflow-x: hidden;\n    white-space: normal;\n      overflow-y:auto !important;\n  }\n  iframe{\n    width: 100%;\n    height: 100%;\n    border-width: 0;\n    padding: 0;\n    margin: 0;\n    white-space: normal;\n    position: relative;\n  }\n  html{\n    white-space: normal;\n    margin: 0;\n    padding: 0;\n  }\n  .toggleInner h3{\n      color:white !important;\n  }\n  .alert-success h3{\n      color: #d0b9b9 !important;\n  }\n  .page-loading {\n    position: fixed;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    -webkit-transition: all .4s .2s ease-in-out;\n    transition: all .4s .2s ease-in-out;\n    background-color: #fff;\n    opacity: 0;\n    visibility: hidden;\n    z-index: 99;\n  }\n\n  .dark-mode .page-loading {\n    background-color: #131022;\n  }\n\n  .page-loading.active {\n    opacity: 1;\n    visibility: visible;\n  }\n\n  .page-loading-inner {\n    position: absolute;\n    top: 50%;\n    left: 0;\n    width: 100%;\n    text-align: center;\n    -webkit-transform: translateY(-50%);\n    transform: translateY(-50%);\n    -webkit-transition: opacity .2s ease-in-out;\n    transition: opacity .2s ease-in-out;\n    opacity: 0;\n  }\n\n  .page-loading.active > .page-loading-inner {\n    opacity: 1;\n  }\n\n  .page-loading-inner > span {\n    display: block;\n    font-size: 1rem;\n    font-weight: normal;\n    color: #9397ad;\n  }\n\n  .dark-mode .page-loading-inner > span {\n    color: #fff;\n    opacity: .6;\n  }\n\n  .page-spinner {\n    display: inline-block;\n    width: 2.75rem;\n    height: 2.75rem;\n    margin-bottom: .75rem;\n    vertical-align: text-bottom;\n    border: .15em solid #b4b7c9;\n    border-right-color: transparent;\n    border-radius: 50%;\n    -webkit-animation: spinner .75s linear infinite;\n    animation: spinner .75s linear infinite;\n  }\n\n  .dark-mode .page-spinner {\n    border-color: rgba(255, 255, 255, .4);\n    border-right-color: transparent;\n  }\n\n  @-webkit-keyframes spinner {\n    100% {\n      -webkit-transform: rotate(360deg);\n      transform: rotate(360deg);\n    }\n  }\n\n  @keyframes spinner {\n    100% {\n      -webkit-transform: rotate(360deg);\n      transform: rotate(360deg);\n    }\n  }\n</style>\n<script>\n    (window).appName=`".concat(cf.appDomain, "`;\n    (window).glitterBackend=`").concat(cf.glitter_domain, "`;\n</script>\n").concat('<script>\n' +
            '    function preload(data){\n' +
            "        let joinArray=['__']\n" +
            '        function loop(array) {\n' +
            '            array.map((dd) => {\n' +
            "                if (dd.type === 'container') {\n" +
            '                    loop(dd.data.setting)\n' +
            "                } else if (dd.type === 'component') {\n" +
            '                    joinArray.push(dd.data.tag)\n' +
            '                }\n' +
            '            })\n' +
            '        }\n' +
            '        data.response.result.map((d2) => {\n' +
            '            loop(d2.config)\n' +
            '        })\n' +
            '        joinArray=joinArray.filter((value, index, self)=>{\n' +
            '            return value\n' +
            '        })\n' +
            '        joinArray.map((tag)=>{\n' +
            '            window.glitterInitialHelper.setQueue(`getPageData-${tag}`, (callback) => {\n' +
            "                glitterInitialHelper.getPageData(joinArray.join(','),(dd)=>{\n" +
            '                    const data=JSON.parse(JSON.stringify(dd))\n' +
            '                    data.response.result=data.response.result.filter((d2)=>{\n' +
            '                        return d2.tag===tag\n' +
            '                    })\n' +
            '                    callback({\n' +
            '                        response: data.response, result: true\n' +
            '                    })\n' +
            '                    preload(data)\n' +
            '                })\n' +
            '            })\n' +
            '        })\n' +
            '    }\n' +
            '    window.glitterInitialHelper = {\n' +
            '        share: {},\n' +
            '        setQueue: (tag, fun, callback) => {\n' +
            '\n' +
            '            window.glitterInitialHelper.share[tag] = window.glitterInitialHelper.share[tag] ?? {\n' +
            '                callback: [],\n' +
            '                data: undefined,\n' +
            '                isRunning: false\n' +
            '            }\n' +
            '            if (window.glitterInitialHelper.share[tag].data) {\n' +
            '                callback && callback((()=>{\n' +
            '                    try {\n' +
            '                        return JSON.parse(JSON.stringify(window.glitterInitialHelper.share[tag].data))\n' +
            '                    }catch (e) {\n' +
            '                        console.log(`parseError`,window.glitterInitialHelper.share[tag].data)\n' +
            '                    }\n' +
            '                })())\n' +
            '            } else {\n' +
            '                window.glitterInitialHelper.share[tag].callback.push(callback)\n' +
            '\n' +
            '                if (!window.glitterInitialHelper.share[tag].isRunning) {\n' +
            '                    window.glitterInitialHelper.share[tag].isRunning = true\n' +
            '                    fun((response) => {\n' +
            '                        window.glitterInitialHelper.share[tag].callback.map((callback) => {\n' +
            '                            callback && callback((()=>{\n' +
            '                                try {\n' +
            '                                    return JSON.parse(JSON.stringify(response))\n' +
            '                                }catch (e) {\n' +
            '                                    console.log(`parseError`,window.glitterInitialHelper.share[tag].data)\n' +
            '                                }\n' +
            '                            })())\n' +
            '                        })\n' +
            '                        window.glitterInitialHelper.share[tag].data = response\n' +
            '                        window.glitterInitialHelper.share[tag].callback = []\n' +
            '                    })\n' +
            '                }\n' +
            '            }\n' +
            '\n' +
            '        },\n' +
            '        getPlugin: (callback) => {\n' +
            "            window.glitterInitialHelper.setQueue('getPlugin', (callback) => {\n" +
            '                const myHeaders = new Headers();\n' +
            '                const requestOptions = {\n' +
            "                    method: 'GET',\n" +
            '                    headers: myHeaders\n' +
            '                };\n' +
            '\n' +
            '                function execute() {\n' +
            '                    fetch(`${window.glitterBackend}/api/v1/app/plugin?appName=${window.appName}`, requestOptions)\n' +
            '                        .then(response => response.json())\n' +
            '                        .then(result => {\n' +
            '                            callback({\n' +
            '                                response: result, result: true\n' +
            '                            })\n' +
            '                        })\n' +
            '                        .catch(error => {\n' +
            '                            console.log(error)\n' +
            '                            setTimeout(() => {\n' +
            '                                execute()\n' +
            '                            }, 100)\n' +
            '                        });\n' +
            '                }\n' +
            '\n' +
            '                execute()\n' +
            '            }, callback)\n' +
            '        },\n' +
            '        preloadComponent: {\n' +
            '            data: {}\n' +
            '        },\n' +
            '        getPageData: (tag, callback) => {\n' +
            '\n' +
            '            window.glitterInitialHelper.setQueue(`getPageData-${tag}`, (callback) => {\n' +
            '                const myHeaders = new Headers();\n' +
            '                const requestOptions = {\n' +
            "                    method: 'GET',\n" +
            '                    headers: myHeaders\n' +
            '                };\n' +
            '\n' +
            '                function execute() {\n' +
            '                    fetch(window.glitterBackend + `/api/v1/template?appName=${window.appName}&tag=${encodeURIComponent(tag)}`, requestOptions)\n' +
            '                        .then(response => response.json())\n' +
            '                        .then(response => {\n' +
            '                            for(const b of response.result){\n' +
            "                                if(b.group==='glitter-article'){\n" +
            '                                    glitterInitialHelper.getPageData(b.page_config.template, (data) => { preload(data) })\n' +
            '                                }\n' +
            '                            }\n' +
            '                            callback({\n' +
            '                                response: response, result: true\n' +
            '                            })\n' +
            '                        }).catch(error => {\n' +
            '                        console.log(error)\n' +
            '                        setTimeout(() => {\n' +
            '                            execute()\n' +
            '                        }, 100)\n' +
            '                    });\n' +
            '                }\n' +
            '\n' +
            '                execute()\n' +
            '            }, callback)\n' +
            '        }\n' +
            '    }\n' +
            '    let clockF = () => {\n' +
            '        return {\n' +
            '            start: new Date(),\n' +
            '            stop: function () {\n' +
            '                return ((new Date()).getTime() - (this.start).getTime())\n' +
            '            },\n' +
            '            zeroing: function () {\n' +
            '                this.start = new Date()\n' +
            '            }\n' +
            '        }\n' +
            '    }\n' +
            '    let renderClock = clockF();\n' +
            '    (window.renderClock) = renderClock;\n' +
            '    if (location.pathname.slice(-1) !== \'/\' && !location.pathname.endsWith("html")) {\n' +
            '        location.pathname = location.pathname + "/"\n' +
            '    }\n' +
            '    glitterInitialHelper.getPlugin()\n' +
            '    const url = new URL(location.href)\n' +
            "    glitterInitialHelper.getPageData(url.searchParams.get('page'), (data) => { preload(data) })\n" +
            '</script>', "\n<script src=\"").concat(cf.glitter_domain, "/").concat(cf.appDomain, "/glitterBundle/jquery.js\"></script>\n<script src=\"").concat(cf.glitter_domain, "/").concat(cf.appDomain, "/glitterBundle/GlitterInitial.js\" type=\"module\"></script>\n<link href=\"").concat(cf.glitter_domain, "/").concat(cf.appDomain, "/glitterBundle/Glitter.css\" rel=\"stylesheet\">\n<body>\n <div id=\"glitterPage\" class=\"flex-fill h-100\">\n   <div class=\"page-loading active\">\n    <div class=\"page-loading-inner\">\n      <div class=\"page-spinner\"></div>\n    </div>\n  </div>\n </div>\n <aside id=\"drawerEl\" style=\"z-index:99999;\">\n     <div id='Navigation' style=\"width: 100%;height: 100%;z-index:99999;\"></div>\n </aside>\n</body>\n</html>");
        return html;
    };
    Release.copyFolderSync = function (source, target) {
        var _this = this;
        // 確保目標資料夾存在，如果不存在則建立
        if (!fs_1.default.existsSync(target)) {
            fs_1.default.mkdirSync(target);
        }
        // 讀取源資料夾中的所有檔案/資料夾
        var files = fs_1.default.readdirSync(source);
        // 遍歷所有檔案/資料夾
        files.forEach(function (file) {
            var sourcePath = path_1.default.join(source, file);
            var targetPath = path_1.default.join(target, file);
            // 檢查是否為資料夾
            if (fs_1.default.statSync(sourcePath).isDirectory()) {
                // 如果是資料夾，遞迴地複製資料夾
                _this.copyFolderSync(sourcePath, targetPath);
            }
            else {
                // 如果是檔案，直接複製檔案
                fs_1.default.copyFileSync(sourcePath, targetPath);
            }
        });
    };
    Release.removeAllFilesInFolder = function (folderPath) {
        var _this = this;
        // 读取目标文件夹内所有文件和子文件夹
        var files = fs_1.default.readdirSync(folderPath);
        // 遍历所有文件和子文件夹
        files.forEach(function (file) {
            var filePath = path_1.default.join(folderPath, file);
            // 检查是否为文件
            if (fs_1.default.statSync(filePath).isFile()) {
                // 如果是文件，删除文件
                fs_1.default.unlinkSync(filePath);
            }
            else {
                // 如果是子文件夹，递归地删除子文件夹内所有文件
                _this.removeAllFilesInFolder(filePath);
                // 删除空的子文件夹
                fs_1.default.rmdirSync(filePath);
            }
        });
    };
    Release.compressFiles = function (inputFolder, outputZip) {
        return new Promise(function (resolve, reject) {
            // 建立壓縮器實例
            var archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
            // 建立壓縮檔案
            var output = fs_1.default.createWriteStream(outputZip);
            // 將壓縮器與輸出流相連
            archive.pipe(output);
            // 將指定目錄的所有內容添加到壓縮器中
            archive.directory(inputFolder, false);
            // 完成壓縮
            archive.finalize();
            // 監聽壓縮完成事件
            output.on('close', function () {
                resolve(true);
            });
            // 監聽壓縮出錯事件
            archive.on('error', function (err) {
                resolve(false);
            });
        });
    };
    Release.uploadFile = function (filePath, fileName) {
        return new Promise(function (resolve, reject) {
            var s3 = new aws_sdk_1.default.S3();
            var bucketName = config_js_1.default.AWS_S3_NAME; // 替换为你的S3存储桶名称
            var params = {
                Bucket: bucketName,
                Key: fileName,
                Body: fs_1.default.createReadStream(filePath),
            };
            s3.upload(params, function (err, data) {
                if (err) {
                    console.error('Error uploading file:', err);
                    throw exception_js_1.default.BadRequestError('S3 ERROR', 'upload file error.', null);
                }
                else {
                    resolve(data.Location);
                    console.log('File uploaded successfully. S3 URL:', data.Location);
                }
            });
        });
    };
    Release.deleteFolder = function (folderPath) {
        try {
            // 删除目标文件夹
            fs_1.default.rmdirSync(folderPath, { recursive: true });
            console.log("\u6210\u529F\u5220\u9664\u6587\u4EF6\u5939\uFF1A".concat(folderPath));
        }
        catch (err) {
            console.error("\u5220\u9664\u6587\u4EF6\u5939\u65F6\u53D1\u751F\u9519\u8BEF\uFF1A".concat(err));
        }
    };
    Release.deleteFile = function (filePath) {
        try {
            // 删除目标文件夹
            fs_1.default.rmSync(filePath, { recursive: true });
            console.log("\u6210\u529F\u5220\u9664\u6587\u4EF6\uFF1A".concat(filePath));
        }
        catch (err) {
            console.error("\u5220\u9664\u6587\u4EF6\u65F6\u53D1\u751F\u9519\u8BEF\uFF1A".concat(err));
        }
    };
    return Release;
}());
exports.Release = Release;
