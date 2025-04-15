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
exports.BackendService = void 0;
var database_js_1 = require("../modules/database.js");
var config_js_1 = require("../config.js");
var exception_js_1 = require("../modules/exception.js");
var create_instance_js_1 = require("./create-instance.js");
var ssh_js_1 = require("../modules/ssh.js");
var path_1 = require("path");
var release_js_1 = require("./release.js");
var fs_1 = require("fs");
var ut_database_js_1 = require("../api-public/utils/ut-database.js");
var nginx_conf_1 = require("nginx-conf");
var axios_1 = require("axios");
var public_table_check_js_1 = require("../api-public/services/public-table-check.js");
var BackendService = /** @class */ (function () {
    function BackendService(appName) {
        this.appName = appName;
        public_table_check_js_1.ApiPublic.createScheme(this.appName).then(function () {
        });
    }
    BackendService.prototype.getDataBaseInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.execute("\n                select *\n                from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                where appName = ?\n            "), [this.appName])];
                    case 1:
                        info = (_a.sent())[0];
                        info.sql_ip = config_js_1.default.DB_URL;
                        return [2 /*return*/, info];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_1, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.getApiList = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var exInfo_1, querySql, resp, _loop_1, _i, _a, b, e_2;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        exInfo_1 = _d.sent();
                        query.page = (_b = query.page) !== null && _b !== void 0 ? _b : 0;
                        query.limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 50;
                        querySql = [];
                        query.search && querySql.push([
                            "(UPPER(name) LIKE UPPER('%".concat(query.search, "%')))"),
                        ].join(" || "));
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(this.appName, "t_api_router").querySql(querySql, query)];
                    case 2:
                        resp = _d.sent();
                        _loop_1 = function (b) {
                            var _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        _e = b;
                                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                var config = {
                                                    method: 'get',
                                                    maxBodyLength: Infinity,
                                                    url: "http://".concat(exInfo_1.ip, ":").concat(b.port),
                                                    headers: {}
                                                };
                                                axios_1.default.request(config)
                                                    .then(function (response) {
                                                    resolve(true);
                                                })
                                                    .catch(function (error) {
                                                    if (error.response) {
                                                        resolve(true);
                                                    }
                                                    else {
                                                        resolve(false);
                                                    }
                                                });
                                            })];
                                    case 1:
                                        _e.health = _f.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _a = resp.data;
                        _d.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        b = _a[_i];
                        return [5 /*yield**/, _loop_1(b)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        resp.data.map(function (dd) {
                            dd.ipAddress = exInfo_1.ip;
                            return dd;
                        });
                        return [2 /*return*/, resp];
                    case 7:
                        e_2 = _d.sent();
                        console.log(e_2);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getApiList Error:' + e_2, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.getApiRouter = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var ip, qu, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        ip = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                                        FROM `".concat(this.appName, "`.t_domain_setting\n                                        where port = ?"), [query.port])];
                    case 2:
                        qu = (_a.sent())[0];
                        return [2 /*return*/, {
                                url: (qu && "https://".concat(qu.domain)) || "http://".concat(ip.ip, ":").concat(query.port)
                            }];
                    case 3:
                        e_3 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.getDomainList = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var querySql, resp, e_4;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
                        query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
                        querySql = [];
                        query.search && querySql.push([
                            "(UPPER(domain) LIKE UPPER('%".concat(query.search, "%')))"),
                        ].join(" || "));
                        return [4 /*yield*/, new ut_database_js_1.UtDatabase(this.appName, "t_domain_setting").querySql(querySql, query)];
                    case 1:
                        resp = _c.sent();
                        return [2 /*return*/, resp];
                    case 2:
                        e_4 = _c.sent();
                        console.log(e_4);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getApiList Error:' + e_4, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.serverID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ec2_id, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_js_1.default.execute("\n                select *\n                from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                where appName = ?\n            "), [this.appName])];
                    case 1:
                        ec2_id = (_a.sent())[0]['ec2_id'];
                        return [2 /*return*/, ec2_id];
                    case 2:
                        e_5 = _a.sent();
                        console.log(e_5);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_5, null);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.serverInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ec2_id, ec2INFO, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_js_1.default.execute("\n                select *\n                from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                where appName = ?\n            "), [this.appName])];
                    case 1:
                        ec2_id = (_a.sent())[0]['ec2_id'];
                        if (!ec2_id) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, create_instance_js_1.getEC2INFO)(ec2_id)];
                    case 2:
                        ec2INFO = _a.sent();
                        return [2 /*return*/, {
                                id: ec2_id,
                                ip: ec2INFO && ec2INFO.ipAddress,
                                type: ec2INFO && ec2INFO.type
                            }];
                    case 3: return [2 /*return*/, {
                            id: ec2_id,
                            ip: ''
                        }];
                    case 4:
                        e_6 = _a.sent();
                        console.log(e_6);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_6, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.postApi = function (conf) {
        return __awaiter(this, void 0, void 0, function () {
            var serverInfo, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        serverInfo = _a.sent();
                        return [4 /*yield*/, this.postProjectToEc2(serverInfo.ip, conf.name, conf.file, conf.port)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_js_1.default.query("\n                    replace\n                    into `".concat(this.appName, "`.t_api_router\n                    SET ?\n                "), [conf])];
                    case 3:
                        (_a.sent());
                        return [2 /*return*/, {
                                result: true
                            }];
                    case 4: return [2 /*return*/, {
                            result: false
                        }];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_7 = _a.sent();
                        console.log(e_7);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_7, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.shutdown = function (conf) {
        return __awaiter(this, void 0, void 0, function () {
            var serverInfo, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        serverInfo = _a.sent();
                        return [4 /*yield*/, this.stopEc2Project(serverInfo.ip, conf.port)];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/, {
                                    result: true
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    result: false
                                }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        console.log(e_8);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_8, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.deleteAPI = function (conf) {
        return __awaiter(this, void 0, void 0, function () {
            var serverInfo, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        serverInfo = _a.sent();
                        return [4 /*yield*/, database_js_1.default.execute("delete\n                              from `".concat(this.appName, "`.t_api_router\n                              where port = ?"), [conf.port])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.stopEc2Project(serverInfo.ip, conf.port)];
                    case 3:
                        if (_a.sent()) {
                            return [2 /*return*/, {
                                    result: true
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    result: false
                                }];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_9 = _a.sent();
                        console.log(e_9);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_9, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.putDomain = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var ip_1, data_1, result, url_1, response, e_10;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        ip_1 = (_b.sent()).ip;
                        return [4 /*yield*/, ssh_js_1.Ssh.readFile('/etc/nginx/sites-enabled/default', ip_1)];
                    case 2:
                        data_1 = _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                nginx_conf_1.NginxConfFile.createFromSource(data_1, function (err, conf) {
                                    var server = [];
                                    try {
                                        for (var _i = 0, _a = conf.nginx.server; _i < _a.length; _i++) {
                                            var b = _a[_i];
                                            if (b.server_name.toString().indexOf(config.domain) === -1) {
                                                console.log(b.server_name.toString());
                                                server.push(b);
                                            }
                                        }
                                    }
                                    catch (e) {
                                    }
                                    conf.nginx.server = server;
                                    resolve(conf.toString());
                                });
                            })];
                    case 3:
                        result = _b.sent();
                        result += "\n\nserver {\n       server_name ".concat(config.domain, ";\n    location / {\n       proxy_pass http://127.0.0.1:").concat(config.port, ";\n       proxy_set_header X-Real-IP $remote_addr;\n       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;\n    }\n}");
                        return [4 /*yield*/, ssh_js_1.Ssh.uploadFile(result, new Date().getTime().toString(), 'data')];
                    case 4:
                        url_1 = _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ssh_js_1.Ssh.exec([
                                    "sudo curl -o /etc/nginx/sites-enabled/default ".concat(url_1),
                                    "sudo certbot --nginx -d ".concat(config.domain, " --non-interactive --agree-tos -m sam38124@gmail.com"),
                                    "sudo nginx -s reload"
                                ], ip_1).then(function (res) {
                                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                                });
                            })];
                    case 5:
                        response = _b.sent();
                        if (!response) {
                            throw exception_js_1.default.BadRequestError('BAD_REQUEST', '網域驗證失敗', null);
                        }
                        return [4 /*yield*/, database_js_1.default.query("replace\n            into `".concat(this.appName, "`.t_domain_setting  set ?"), [
                                {
                                    domain: config.domain,
                                    port: parseInt(config.port, 10)
                                }
                            ])];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 7:
                        e_10 = _b.sent();
                        throw exception_js_1.default.BadRequestError((_a = e_10.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_10, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.deleteDomain = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var ip_2, data_2, result, url_2, response, e_11;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        ip_2 = (_b.sent()).ip;
                        return [4 /*yield*/, ssh_js_1.Ssh.readFile('/etc/nginx/sites-enabled/default', ip_2)];
                    case 2:
                        data_2 = _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                nginx_conf_1.NginxConfFile.createFromSource(data_2, function (err, conf) {
                                    var server = [];
                                    try {
                                        for (var _i = 0, _a = conf.nginx.server; _i < _a.length; _i++) {
                                            var b = _a[_i];
                                            if (b.server_name.toString().indexOf(config.domain) === -1) {
                                                server.push(b);
                                            }
                                        }
                                    }
                                    catch (e) {
                                    }
                                    conf.nginx.server = server;
                                    resolve(conf.toString());
                                });
                            })];
                    case 3:
                        result = _b.sent();
                        return [4 /*yield*/, ssh_js_1.Ssh.uploadFile(result, new Date().getTime().toString(), 'data')];
                    case 4:
                        url_2 = _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ssh_js_1.Ssh.exec([
                                    "sudo curl -o /etc/nginx/sites-enabled/default ".concat(url_2),
                                    "sudo nginx -s reload"
                                ], ip_2).then(function (res) {
                                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                                });
                            })];
                    case 5:
                        response = _b.sent();
                        return [4 /*yield*/, database_js_1.default.query("delete\n                            from `".concat(this.appName, "`.t_domain_setting\n                            where domain =?"), [
                                config.domain
                            ])];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 7:
                        e_11 = _b.sent();
                        throw exception_js_1.default.BadRequestError((_a = e_11.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e_11, null);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.getSampleProject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serverInfo, dbInfo, file, copyFile, url, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.serverInfo()];
                    case 1:
                        serverInfo = _a.sent();
                        return [4 /*yield*/, this.getDataBaseInfo()];
                    case 2:
                        dbInfo = _a.sent();
                        file = new Date().getTime();
                        copyFile = path_1.default.resolve(__filename, "../../app-project/work-space/".concat(file));
                        release_js_1.Release.copyFolderSync(path_1.default.resolve(__filename, '../../app-project/serverless'), copyFile);
                        fs_1.default.writeFileSync(path_1.default.resolve(__filename, "../../app-project/work-space/".concat(file, "/env/server.env")), "DB_URL=".concat(dbInfo.sql_ip, "\nDB_PORT=3306\nDB_USER=").concat(dbInfo.sql_admin, "\nDB_PWD=").concat(dbInfo.sql_pwd, "\nREDIS_URL=").concat(serverInfo.ip, "\nREDIS_PORT=6379\nREDIS_PWD=hdseasa\nPORT=8000"));
                        return [4 /*yield*/, release_js_1.Release.compressFiles(copyFile, "".concat(copyFile, ".zip"))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, release_js_1.Release.uploadFile("".concat(copyFile, ".zip"), "".concat(file, "/serverless.zip"))];
                    case 4:
                        url = _a.sent();
                        release_js_1.Release.deleteFile("".concat(copyFile, ".zip"));
                        release_js_1.Release.deleteFolder("".concat(copyFile));
                        return [2 /*return*/, {
                                result: url
                            }];
                    case 5:
                        e_12 = _a.sent();
                        console.log(e_12);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_12, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.postProjectToEc2 = function (ip, name, file, port) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ssh_js_1.Ssh.exec([
                            "sudo mkdir /home/project",
                            "sudo rm -rf /home/project/".concat(name),
                            "sudo mkdir /home/project/".concat(name),
                            "sudo rm -f ".concat(name, ".zip"),
                            "sudo curl -o /home/project/".concat(name, "/").concat(name, ".zip \"").concat(file, "\""),
                            "cd /home/project/".concat(name, " && sudo unzip -o /home/project/").concat(name, "/").concat(name, ".zip"),
                            "sudo rm -f /home/project/".concat(name, "/").concat(name, ".zip"),
                            "sudo docker system prune -f",
                            "cd /home/project/".concat(name, " && sudo docker build . -t ").concat(name),
                            "sudo docker stop $(sudo docker ps --filter \"expose=".concat(port, "\" --format \"{{.ID}}\")"),
                            "sudo docker run --restart=always --log-opt max-size=50m  -d -p ".concat(port, ":").concat(port, " -t  ").concat(name)
                        ], ip)];
                    case 1: 
                    //Post project to ec2.
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BackendService.prototype.stopEc2Project = function (ip, port) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ssh_js_1.Ssh.exec([
                            "sudo docker stop $(sudo docker ps --filter \"expose=".concat(port, "\" --format \"{{.ID}}\")"),
                        ], ip)];
                    case 1: 
                    //Post project to ec2.
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BackendService.prototype.startServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ec2_id, ec2ID, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_js_1.default.execute("\n                select *\n                from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                where appName = ?\n            "), [this.appName])];
                    case 1:
                        ec2_id = (_a.sent())[0]['ec2_id'];
                        if (!ec2_id) return [3 /*break*/, 2];
                        throw exception_js_1.default.BadRequestError("ERROR", "THE SERVER ALREADY CREATED.", null);
                    case 2:
                        console.log("this.appName", this.appName);
                        return [4 /*yield*/, (0, create_instance_js_1.createEC2Instance)()];
                    case 3:
                        ec2ID = _a.sent();
                        return [4 /*yield*/, database_js_1.default.execute("update `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                                  set ec2_id=?\n                                  where appName = ?"), [ec2ID, this.appName])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_13 = _a.sent();
                        console.log(e_13);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_13, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BackendService.prototype.stopServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ec2_id, e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_js_1.default.execute("\n                select *\n                from `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                where appName = ?\n            "), [this.appName])];
                    case 1:
                        ec2_id = (_a.sent())[0]['ec2_id'];
                        return [4 /*yield*/, (0, create_instance_js_1.terminateInstances)(ec2_id)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_js_1.default.execute("update `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                                  set ec2_id=?\n                                  where appName = ?"), ['', this.appName])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_14 = _a.sent();
                        console.log(e_14);
                        throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e_14, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return BackendService;
}());
exports.BackendService = BackendService;
