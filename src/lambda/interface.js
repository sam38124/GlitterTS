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
exports.lambda = exports.createViewComponent = void 0;
var axios_1 = require("axios");
var fs_1 = require("fs");
var fs_2 = require("fs");
var path_1 = require("path");
function setup(config) {
    var data = JSON.stringify(config.auth);
    axios_1.default.request({
        method: 'post',
        url: config.domain + '/api/v1/user/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then(function (response) {
        var token = response.data.userData.token;
        axios_1.default.request({
            method: 'get',
            url: "".concat(config.domain, "/api/v1/private?appName=").concat(config.app_name, "&key=sql_api_config_post"),
            headers: {
                'Authorization': "Bearer ".concat(token),
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
            var postData = config.router.map(function (dd) {
                return {
                    "sql": "{\n execute: ".concat(dd.execute.toString(), "\n}"),
                    "type": dd.type,
                    "route": dd.route,
                    "title": dd.name,
                    "expand": false
                };
            });
            axios_1.default.request({
                method: 'post',
                url: "".concat(config.domain, "/api/v1/private"),
                headers: {
                    'Authorization': "Bearer ".concat(token),
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "appName": config.app_name,
                    "key": "sql_api_config_post",
                    "value": {
                        "expand": true,
                        "firebase": config.firebase,
                        "apiList": postData
                    }
                })
            })
                .then(function (response) {
                console.log("部署成功");
            })
                .catch(function (error) {
                console.log(error);
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    })
        .catch(function (error) {
        console.log(error);
    });
}
function create_function(fun) {
    return fun;
}
function createViewComponent(config) {
    var _this = this;
    var cloneConfig = JSON.parse(JSON.stringify(config));
    return new Promise(function (resolve, reject) {
        (new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            function readPath(path, parent, prefix) {
                fs_2.default.readdirSync(path).map(function (file) {
                    if (fs_2.default.lstatSync("".concat(path, "/").concat(file)).isDirectory()) {
                        readPath("".concat(path, "/").concat(file), parent, prefix);
                    }
                    else if (path_1.default.extname("".concat(path, "/").concat(file)) !== ".ts" && path_1.default.extname("".concat(path, "/").concat(file)) !== ".ts~") {
                        var stats = fs_2.default.statSync("".concat(path, "/").concat(file));
                        var pathRoute = path_1.default.relative(path_1.default.resolve(parent), path_1.default.resolve("".concat(path, "/").concat(file)));
                        if (!lastRead[pathRoute] || lastRead[pathRoute] < (stats.mtime.getTime())) {
                            console.log("\u4FEE\u6539\u4E86:".concat(path, "/").concat(file));
                            lastRead[pathRoute] = stats.mtime.getTime();
                            waitPush.push({
                                path: "".concat(path, "/").concat(file),
                                prefix: prefix,
                                name: pathRoute
                            });
                        }
                    }
                });
            }
            function upload(path, fileName) {
                var _this = this;
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var fileData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fs_1.default.readFileSync(path)];
                            case 1:
                                fileData = _a.sent();
                                axios_1.default.request({
                                    method: 'post',
                                    url: "".concat(config.domain, "/api/v1/fileManager/uploadTemplate"),
                                    headers: {
                                        'Authorization': "Bearer ".concat(token),
                                        'Content-Type': 'application/json'
                                    },
                                    data: JSON.stringify({
                                        "fileName": fileName,
                                        "app": config.app_name,
                                    })
                                }).then(function (response) {
                                    var data1 = response.data;
                                    axios_1.default.request({
                                        method: 'put',
                                        url: data1.url,
                                        headers: {
                                            'Content-Type': data1.type
                                        },
                                        data: fileData
                                    })
                                        .then(function (response) {
                                        console.log("\u4E0A\u50B3\u6210\u529F:".concat(data1.fullUrl));
                                        resolve(data1.fullUrl);
                                    }).catch(function (error) {
                                        console.log("\u4E0A\u50B3\u5931\u6557:".concat(fileName));
                                        reject(false);
                                    });
                                }).catch(function (e) {
                                    console.log(e);
                                    console.log("\u4E0A\u50B3\u5931\u6557:".concat(fileName));
                                    reject(false);
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            var waitPush, lastRead, token, _a, _loop_1, _i, _b, b, state_1, data, appPrefix;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        waitPush = [];
                        lastRead = {};
                        try {
                            lastRead = JSON.parse(fs_2.default.readFileSync('glitter.buildInfo', 'utf8'));
                        }
                        catch (e) {
                        }
                        config.router.map(function (dd) {
                            readPath(dd.path, dd.path, dd.prefix);
                        });
                        if (waitPush.length === 0) {
                            resolve(true);
                            return [2 /*return*/];
                        }
                        if (!(typeof config.auth === 'string')) return [3 /*break*/, 1];
                        _a = config.auth;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            axios_1.default.request({
                                method: 'post',
                                url: config.domain + '/api/v1/user/login',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: JSON.stringify(config.auth)
                            })
                                .then(function (response) {
                                resolve(response.data.userData.token);
                            }).catch(function (error) {
                                resolve(false);
                            });
                        })];
                    case 2:
                        _a = _d.sent();
                        _d.label = 3;
                    case 3:
                        token = _a;
                        if (!token) {
                            console.log("\u90E8\u7F72\u5931\u6557\uFF0E");
                            resolve(false);
                            return [2 /*return*/];
                        }
                        _loop_1 = function (b) {
                            var result;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            var count = 0;
                                            var _loop_2 = function (c) {
                                                //嘗試三次
                                                var falRetry = 3;
                                                function exe() {
                                                    if (fs_1.default.statSync(b[c].path).size === 0) {
                                                        count++;
                                                        if (count === b.length) {
                                                            resolve(true);
                                                        }
                                                    }
                                                    else {
                                                        upload(b[c].path, b[c].prefix + "/" + b[c].name).then(function (data) {
                                                            count++;
                                                            if (count === b.length) {
                                                                resolve(true);
                                                            }
                                                        }).catch(function (reason) {
                                                            falRetry--;
                                                            if (falRetry == 0) {
                                                                resolve(false);
                                                            }
                                                            else {
                                                                setTimeout(function () {
                                                                    exe();
                                                                }, 100);
                                                            }
                                                        });
                                                    }
                                                }
                                                exe();
                                            };
                                            for (var c = 0; c < b.length; c++) {
                                                _loop_2(c);
                                            }
                                        })];
                                    case 1:
                                        result = _e.sent();
                                        if (!result) {
                                            console.log("\u4E0A\u50B3\u6A94\u6848\u5931\u6557");
                                            resolve(false);
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _b = chunkArray(waitPush, 200);
                        _d.label = 4;
                    case 4:
                        if (!(_i < _b.length)) return [3 /*break*/, 7];
                        b = _b[_i];
                        return [5 /*yield**/, _loop_1(b)];
                    case 5:
                        state_1 = _d.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            axios_1.default.request({
                                method: 'get',
                                url: "".concat(config.domain, "/api/v1/app/plugin?appName=").concat(config.app_name),
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json'
                                }
                            }).then(function (response) {
                                resolve(response.data.data);
                            }).catch(function (e) {
                                console.log(e);
                                console.log("\u53D6\u5F97\u5931\u6557");
                                reject(false);
                            });
                        })];
                    case 8:
                        data = _d.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default.request({
                                    method: 'get',
                                    url: "".concat(config.domain, "/api/v1/fileManager/templatePrefix?app=").concat(config.app_name),
                                    headers: {
                                        'Authorization': "Bearer ".concat(token),
                                        'Content-Type': 'application/json'
                                    }
                                }).then(function (response) {
                                    resolve(response.data.domain);
                                }).catch(function (e) {
                                    console.log(e);
                                    console.log("\u53D6\u5F97\u5931\u6557");
                                    reject(false);
                                });
                            })];
                    case 9:
                        appPrefix = _d.sent();
                        data.lambdaView = ((_c = data.lambdaView) !== null && _c !== void 0 ? _c : []).filter(function (dd) {
                            return !config.router.find(function (d2) {
                                return dd.prefix === d2.prefix;
                            });
                        });
                        config.router.map(function (d2) {
                            data.lambdaView = data.lambdaView.concat(d2.interface.map(function (dd) {
                                dd.path = appPrefix + "/" + d2.prefix + "/" + dd.path;
                                dd.prefix = d2.prefix;
                                return dd;
                            }));
                        });
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                axios_1.default.request({
                                    method: 'put',
                                    url: "".concat(config.domain, "/api/v1/app/plugin"),
                                    headers: {
                                        'Authorization': "Bearer ".concat(token),
                                        'Content-Type': 'application/json'
                                    },
                                    data: JSON.stringify({
                                        appName: config.app_name,
                                        config: data
                                    })
                                }).then(function (response) {
                                    resolve(response.data.data);
                                }).catch(function (e) {
                                    console.log(e);
                                    console.log("\u4E0A\u50B3\u914D\u7F6E\u6A94\u5931\u6557");
                                    reject(false);
                                });
                            })];
                    case 10:
                        _d.sent();
                        console.log("\u90E8\u7F72\u6210\u529F");
                        fs_2.default.writeFileSync("glitter.buildInfo", JSON.stringify(lastRead));
                        resolve(true);
                        return [2 /*return*/];
                }
            });
        }); })).then(function () {
            if (config.loop) {
                setTimeout(function () {
                    createViewComponent(cloneConfig);
                }, 100);
            }
        });
    });
}
exports.createViewComponent = createViewComponent;
function chunkArray(array, groupSize) {
    var result = [];
    for (var i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
exports.lambda = {
    setup: setup,
    create_function: create_function,
    createViewComponent: createViewComponent
};
