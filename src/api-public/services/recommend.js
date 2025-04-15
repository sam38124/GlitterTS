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
exports.Recommend = void 0;
var database_1 = require("../../modules/database");
var exception_1 = require("../../modules/exception");
var shopping_js_1 = require("./shopping.js");
var config_js_1 = require("../../config.js");
var Recommend = /** @class */ (function () {
    function Recommend(app, token) {
        this.app = app;
        this.token = token;
    }
    Recommend.prototype.calculatePercentage = function (numerator, denominator, decimalPlaces) {
        if (decimalPlaces === void 0) { decimalPlaces = 2; }
        if (denominator === 0) {
            return "0%";
        }
        var percentage = (numerator / denominator) * 100;
        return "".concat(percentage.toFixed(decimalPlaces), "%");
    };
    Recommend.prototype.getLinkList = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var search, links_2, total, shopping, orderList, monitors, _loop_1, this_1, _i, links_1, data, error_1;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
                        query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
                        search = ['1=1'];
                        if (query === null || query === void 0 ? void 0 : query.code) {
                            search.push("(code = \"".concat(query.code, "\")"));
                        }
                        if (query === null || query === void 0 ? void 0 : query.status) {
                            search.push("(JSON_EXTRACT(content, '$.status') = ".concat(query.status, ")"));
                        }
                        if (query === null || query === void 0 ? void 0 : query.user_id) {
                            search.push("(JSON_EXTRACT(content, '$.recommend_user.id') = ".concat(query.user_id, ")"));
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_links WHERE ").concat(search.join(' AND '), "\n                ").concat(query.page !== undefined && query.limit !== undefined ? "LIMIT ".concat(query.page * query.limit, ", ").concat(query.limit) : '', ";\n            "), [])];
                    case 1:
                        links_2 = _c.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT count(*) as c FROM `".concat(this.app, "`.t_recommend_links WHERE ").concat(search.join(' AND '), ";\n            "), [])];
                    case 2:
                        total = _c.sent();
                        shopping = new shopping_js_1.Shopping(this.app, this.token);
                        if (!!query.no_detail) return [3 /*break*/, 5];
                        return [4 /*yield*/, shopping.getCheckOut({
                                page: 0,
                                limit: 999999,
                                distribution_code: links_2.map(function (data) { return data.code; }).join(','),
                            })];
                    case 3:
                        orderList = _c.sent();
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (links_2.length === 0) {
                                                return [2 /*return*/, []];
                                            }
                                            return [4 /*yield*/, database_1.default.query("SELECT id, mac_address, base_url \n                        FROM `".concat(config_js_1.saasConfig.SAAS_NAME, "`.t_monitor\n                        WHERE app_name = \"").concat(this.app, "\"\n                        AND base_url in (").concat(links_2.map(function (data) { return "\"/shopnex/distribution/".concat(data.content.link, "\""); }).join(','), ")\n                     "), [])];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })()];
                    case 4:
                        monitors = _c.sent();
                        _loop_1 = function (data) {
                            var orders = orderList.data.filter(function (d) {
                                try {
                                    return d.orderData.distribution_info.code === data.code;
                                }
                                catch (error) {
                                    return false;
                                }
                            });
                            var monitor = monitors.filter(function (d) { return d.base_url === "/shopnex/distribution/".concat(data.content.link); });
                            var monitorLength = monitor.length;
                            var macAddrSize = new Set(monitor.map(function (item) { return item.mac_address; })).size;
                            var totalOrders = orders.filter(function (order) {
                                return order.status === 1;
                            }).length;
                            var totalPrice = orders.reduce(function (sum, order) {
                                if (order.status === 1) {
                                    return sum + order.orderData.total - order.orderData.shipment_fee;
                                }
                                return sum;
                            }, 0);
                            data.orders = totalOrders;
                            data.click_times = monitorLength;
                            data.mac_address_count = macAddrSize;
                            data.conversion_rate = this_1.calculatePercentage(totalOrders, monitor.length, 1);
                            data.total_price = totalPrice;
                            data.sharing_bonus = 0;
                            if (data.content.lineItems) {
                                var idArray_1 = data.content.lineItems.map(function (item) {
                                    return item.id;
                                });
                                orders.map(function (order) {
                                    order.orderData.lineItems.forEach(function (item) {
                                        if (idArray_1.includes(item.id) && order.status === 1) {
                                            console.log("item.sale_price=>", item.sale_price);
                                            console.log("item.count=>", item.count);
                                            console.log("data.content.share_value=>", data.content.share_value);
                                            data.sharing_bonus += Math.floor((item.sale_price * item.count * parseFloat(data.content.share_value)) / 100);
                                        }
                                    });
                                });
                            }
                        };
                        this_1 = this;
                        for (_i = 0, links_1 = links_2; _i < links_1.length; _i++) {
                            data = links_1[_i];
                            _loop_1(data);
                        }
                        _c.label = 5;
                    case 5: return [2 /*return*/, { data: links_2, total: total[0].c }];
                    case 6:
                        error_1 = _c.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend getLinkList Error: ' + error_1, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.postLink = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var getLinks, register, links, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        data.token && delete data.token;
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_links WHERE code = ?;\n            "), [data.code])];
                    case 1:
                        getLinks = _a.sent();
                        if (getLinks.length > 0) {
                            return [2 /*return*/, { result: false, message: '此分銷代碼已被建立' }];
                        }
                        if (!(data.recommend_status === 'new' && data.recommend_user && data.recommend_user.id === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.postUser(data.recommend_user)];
                    case 2:
                        register = _a.sent();
                        if (!register.result) {
                            return [2 /*return*/, { result: false, message: '信箱已被建立' }];
                        }
                        data.recommend_user.id = register.data.insertId;
                        _a.label = 3;
                    case 3: return [4 /*yield*/, database_1.default.query("INSERT INTO `".concat(this.app, "`.t_recommend_links SET ?"), [
                            {
                                code: data.code,
                                content: JSON.stringify(data),
                            },
                        ])];
                    case 4:
                        links = _a.sent();
                        return [2 /*return*/, { result: true, data: links }];
                    case 5:
                        error_2 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend postLink Error: ' + error_2, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.putLink = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var getLinks, links, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        data.token && delete data.token;
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_links WHERE code = ? AND id <> ?;\n            "), [data.code, id])];
                    case 1:
                        getLinks = _a.sent();
                        if (getLinks.length > 0) {
                            return [2 /*return*/, { result: false, message: '此分銷代碼已被建立' }];
                        }
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(this.app, "`.t_recommend_links SET ? WHERE (id = ?);"), [
                                {
                                    code: data.code,
                                    content: JSON.stringify(data),
                                },
                                id,
                            ])];
                    case 2:
                        links = _a.sent();
                        return [2 /*return*/, { result: true, data: links }];
                    case 3:
                        error_3 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend putLink Error: ' + error_3, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.toggleLink = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var getLinks, content, links, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_links WHERE id = ?;\n            "), [id])];
                    case 1:
                        getLinks = _a.sent();
                        if (getLinks.length === 0) {
                            return [2 /*return*/, { result: false, message: '此分銷連結不存在' }];
                        }
                        content = getLinks[0].content;
                        content.status = !content.status;
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(this.app, "`.t_recommend_links SET ? WHERE (id = ?);"), [
                                {
                                    content: JSON.stringify(content),
                                },
                                id,
                            ])];
                    case 2:
                        links = _a.sent();
                        return [2 /*return*/, { result: true, data: links }];
                    case 3:
                        error_4 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend toggleLink Error: ' + error_4, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.deleteLink = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var links, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        data.token && delete data.token;
                        if (!(data.id && data.id.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, database_1.default.query("DELETE FROM `".concat(this.app, "`.t_recommend_links \n                    WHERE id in (").concat(data.id.join(','), ");\n                "), [])];
                    case 1:
                        links = _a.sent();
                        return [2 /*return*/, { result: true, data: links }];
                    case 2: return [2 /*return*/, { result: false, message: '刪除失敗' }];
                    case 3:
                        error_5 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error_5, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.getUserList = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var search, orderBy, data_1, total, allOrders_1, n_1, error_6;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
                        query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
                        search = ['1=1'];
                        if (query.search) {
                            switch (query.searchType) {
                                case 'phone':
                                    search.push("(JSON_EXTRACT(content, '$.phone') like '%".concat(query.search, "%')"));
                                    break;
                                case 'name':
                                    search.push("(JSON_EXTRACT(content, '$.name') like '%".concat(query.search, "%')"));
                                    break;
                                case 'email':
                                default:
                                    search.push("(email like '%".concat(query.search, "%')"));
                                    break;
                            }
                        }
                        orderBy = 'id DESC';
                        if (query.orderBy) {
                            orderBy = (function () {
                                switch (query.orderBy) {
                                    case 'name':
                                        return "JSON_EXTRACT(content, '$.name')";
                                    case 'created_time_asc':
                                        return "created_time";
                                    case 'created_time_desc':
                                        return "created_time DESC";
                                    default:
                                        return "id DESC";
                                }
                            })();
                        }
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_users\n                    WHERE ").concat(search.join(' AND '), "\n                    ORDER BY ").concat(orderBy, "\n                    ").concat(query.page !== undefined && query.limit !== undefined ? "LIMIT ".concat(query.page * query.limit, ", ").concat(query.limit) : '', ";\n                "), [])];
                    case 1:
                        data_1 = _c.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT count(id) as c FROM `".concat(this.app, "`.t_recommend_users\n                    WHERE ").concat(search.join(' AND '), "\n                "), [])];
                    case 2:
                        total = _c.sent();
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_checkout WHERE orderData->>'$.distribution_info' is not null;\n                "), [])];
                    case 3:
                        allOrders_1 = _c.sent();
                        if (data_1.length === 0) {
                            return [2 /*return*/, {
                                    data: [],
                                    total: 0,
                                }];
                        }
                        n_1 = 0;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                data_1.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_links\n                        WHERE (JSON_EXTRACT(content, '$.recommend_user.id') = ").concat(user.id, ");\n                        "), []).then(function (results) {
                                            var orders = allOrders_1.filter(function (order) {
                                                try {
                                                    return order.orderData.distribution_info.recommend_user.id === user.id;
                                                }
                                                catch (error) {
                                                    return false;
                                                }
                                            });
                                            var totalList = results.map(function (result) {
                                                var code = result.code;
                                                var content = result.content;
                                                var total = orders.reduce(function (sum, order) {
                                                    if (order.status === 1 && order.orderData.distribution_info.code === code) {
                                                        return sum + order.orderData.total - order.orderData.shipment_fee;
                                                    }
                                                    return sum;
                                                }, 0);
                                                return { code: code, total: total, content: content };
                                            });
                                            user.sharing_bonus = totalList.reduce(function (sum, obj) {
                                                return sum + Math.floor((obj.total * parseFloat(obj.content.share_value)) / 100);
                                            }, 0);
                                            user.total_price = totalList.reduce(function (sum, obj) { return sum + obj.total; }, 0);
                                            user.links = results.length;
                                            n_1++;
                                            if (n_1 === data_1.length) {
                                                resolve();
                                            }
                                        });
                                        return [2 /*return*/];
                                    });
                                }); });
                            })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, {
                                data: data_1,
                                total: total[0].c,
                            }];
                    case 5:
                        error_6 = _c.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend getUserList Error: ' + error_6, null);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.postUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var getUsers, user, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        data.token && delete data.token;
                        data.id !== undefined && delete data.id;
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_users WHERE email = ?;\n            "), [data.email])];
                    case 1:
                        getUsers = _a.sent();
                        if (getUsers.length > 0) {
                            return [2 /*return*/, { result: false, message: '信箱已被建立' }];
                        }
                        return [4 /*yield*/, database_1.default.query("INSERT INTO `".concat(this.app, "`.t_recommend_users SET ?"), [
                                {
                                    email: data.email,
                                    content: JSON.stringify(data),
                                },
                            ])];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, { result: true, data: user }];
                    case 3:
                        error_7 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend postUser Error: ' + error_7, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.putUser = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var getUsers, user, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        data.token && delete data.token;
                        return [4 /*yield*/, database_1.default.query("SELECT * FROM `".concat(this.app, "`.t_recommend_users WHERE email = ? AND id <> ?;\n            "), [data.email, id])];
                    case 1:
                        getUsers = _a.sent();
                        if (getUsers.length > 0) {
                            return [2 /*return*/, { result: false, message: '信箱已被建立' }];
                        }
                        return [4 /*yield*/, database_1.default.query("UPDATE `".concat(this.app, "`.t_recommend_users SET ? WHERE (id = ?);"), [
                                {
                                    email: data.email,
                                    content: JSON.stringify(data),
                                },
                                id,
                            ])];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, { result: true, data: user }];
                    case 3:
                        error_8 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error_8, null);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Recommend.prototype.deleteUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        data.token && delete data.token;
                        if (!(data.id && data.id.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.default.query("DELETE FROM `".concat(this.app, "`.t_recommend_links \n                    WHERE JSON_EXTRACT(content, '$.recommend_user.id') in (").concat(data.id.join(','), ");\n                "), [])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, database_1.default.query("DELETE FROM `".concat(this.app, "`.t_recommend_users WHERE (id in (").concat(data.id.join(','), "));\n                    "), [])];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, { result: true, data: user }];
                    case 3: return [2 /*return*/, { result: false, message: '刪除失敗' }];
                    case 4:
                        error_9 = _a.sent();
                        throw exception_1.default.BadRequestError('ERROR', 'Recommend putUser Error: ' + error_9, null);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Recommend;
}());
exports.Recommend = Recommend;
