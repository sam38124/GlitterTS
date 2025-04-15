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
exports.SystemSchedule = void 0;
var exception_1 = require("../modules/exception");
var database_1 = require("../modules/database");
var ssh_1 = require("../modules/ssh");
var SystemSchedule = /** @class */ (function () {
    function SystemSchedule() {
    }
    //檢查mysql狀態，如異常則重啟。
    SystemSchedule.prototype.checkMysqlStatus = function (sec) {
        return __awaiter(this, void 0, void 0, function () {
            var prepared_stmt_count, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.query("show global status like 'prepared_stmt_count';", [])];
                    case 1:
                        prepared_stmt_count = (_a.sent())[0]['Value'];
                        if (!(parseInt(prepared_stmt_count, 10) > 10000)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ssh_1.Ssh.exec([
                                    //重啟MYSQL
                                    "sudo systemctl restart mysqld",
                                    //重啟Docker
                                    "sudo docker restart $(sudo docker ps --filter \"expose=3080\" --format \"{{.ID}}\")"
                                ]).then(function (res) {
                                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                                });
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        setTimeout(function () {
                            _this.checkMysqlStatus(sec);
                        }, sec);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SystemSchedule.prototype.start = function () {
        var _this = this;
        var scheduleList = [
            { second: 60, status: false, func: 'checkMysqlStatus', desc: 'MYSQL狀態檢查' }
        ];
        try {
            scheduleList.forEach(function (schedule) {
                if (schedule.status && typeof _this[schedule.func] === 'function') {
                    _this[schedule.func](schedule.second);
                }
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Init Schedule Error: ' + e, null);
        }
    };
    return SystemSchedule;
}());
exports.SystemSchedule = SystemSchedule;
