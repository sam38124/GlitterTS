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
exports.Ssh = void 0;
var ssh2_1 = require("ssh2");
var process = require("process");
var fs_1 = require("fs");
var Ssh = /** @class */ (function () {
    function Ssh() {
    }
    Ssh.exec = function (array, ip) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sshConfig;
            var _this = this;
            return __generator(this, function (_a) {
                conn = new ssh2_1.Client();
                sshConfig = {
                    host: ip || process.env.sshIP,
                    port: 22, // 默认 SSH 端口号
                    username: process.env.ssh_user,
                    privateKey: fs_1.default.readFileSync(process.env.ssh), // 用您的私钥路径替换
                };
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            conn.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
                                var response, _loop_1, _i, array_1, c;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log('SSH 连接已建立');
                                            response = [];
                                            _loop_1 = function (c) {
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            console.log(c);
                                                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                                    setTimeout(function () {
                                                                        conn.exec(c, function (err, stream) {
                                                                            if (err) {
                                                                                console.log(err);
                                                                                resolve(true);
                                                                            }
                                                                            else {
                                                                                stream.on('close', function (code, signal) {
                                                                                    console.log("\u547D\u4EE4Close: ".concat(code));
                                                                                    resolve(true);
                                                                                }).on('data', function (data) {
                                                                                    response.push(data);
                                                                                    console.log("\u547D\u4EE4\u8F93\u51FA: ".concat(data));
                                                                                    // resolve(true)
                                                                                });
                                                                            }
                                                                            ;
                                                                        });
                                                                    }, 100);
                                                                })];
                                                        case 1:
                                                            _b.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, array_1 = array;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < array_1.length)) return [3 /*break*/, 4];
                                            c = array_1[_i];
                                            return [5 /*yield**/, _loop_1(c)];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            conn.end();
                                            resolve(response);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }).connect(sshConfig);
                            conn.on('error', function (err) {
                                console.error('SSH 连接错误:', err);
                                conn.end();
                                resolve(false);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    Ssh.readFile = function (remote, ip) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sshConfig;
            var _this = this;
            return __generator(this, function (_a) {
                conn = new ssh2_1.Client();
                sshConfig = {
                    host: ip || process.env.sshIP,
                    port: 22, // 默认 SSH 端口号
                    username: process.env.ssh_user,
                    privateKey: fs_1.default.readFileSync(process.env.ssh), // 用您的私钥路径替换
                };
                console.log("privateKey--", sshConfig);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            conn.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
                                var fileName;
                                return __generator(this, function (_a) {
                                    console.log('SSH 连接已建立');
                                    fileName = "".concat(new Date().getTime());
                                    conn.sftp(function (err, sftp) {
                                        if (err) {
                                            resolve(false);
                                        }
                                        else {
                                            sftp.fastGet(remote, "".concat(fileName), function (err) {
                                                if (err) {
                                                    console.log(err);
                                                    resolve(false);
                                                }
                                                resolve(fs_1.default.readFileSync(fileName, 'utf-8'));
                                                fs_1.default.rmSync(fileName);
                                                conn.end(); // 关闭SSH连接
                                            });
                                        }
                                        ;
                                    });
                                    return [2 /*return*/];
                                });
                            }); }).connect(sshConfig);
                            conn.on('error', function (err) {
                                console.error('SSH 连接错误:', err);
                                conn.end();
                                resolve(false);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    Ssh.uploadFile = function (file, fileName, type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var AWS = require('aws-sdk');
                        var fs = require('fs');
                        var s3 = new AWS.S3();
                        var bucketName = 'liondesign-prd'; // 替换为你的S3存储桶名称
                        var params = {
                            Bucket: bucketName,
                            Key: fileName,
                            Body: (type === 'data') ? file : fs.createReadStream(file)
                        };
                        s3.upload(params, function (err, data) {
                            if (err) {
                                console.error('Error uploading file:', err);
                            }
                            else {
                                resolve(data.Location);
                                console.log('File uploaded successfully. S3 URL:', data.Location);
                            }
                        });
                    })];
            });
        });
    };
    return Ssh;
}());
exports.Ssh = Ssh;
