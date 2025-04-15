"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHooks = exports.Singleton = void 0;
var async_hooks_1 = require("async_hooks");
var AsyncHook = /** @class */ (function () {
    function AsyncHook() {
        var _this = this;
        this.store = new Map();
        async_hooks_1.default.createHook({
            init: function (asyncId, _, triggerAsyncId) {
                if (_this.store.has(triggerAsyncId)) {
                    _this.store.set(asyncId, _this.store.get(triggerAsyncId));
                }
            },
            destroy: function (asyncId) {
                if (_this.store.has(asyncId)) {
                    _this.store.delete(asyncId);
                }
            }
        }).enable();
    }
    AsyncHook.prototype.createRequestContext = function (requestInfo) {
        this.store.set(async_hooks_1.default.executionAsyncId(), requestInfo);
        return;
    };
    AsyncHook.prototype.getRequestContext = function () {
        return this.store.get(async_hooks_1.default.executionAsyncId());
    };
    return AsyncHook;
}());
var Singleton = /** @class */ (function () {
    function Singleton() {
        throw Error('This is singletion, please use getInstance method to get the instance');
    }
    Singleton.getInstance = function () {
        if (!Singleton.instance) {
            Singleton.instance = new AsyncHook();
        }
        return Singleton.instance;
    };
    return Singleton;
}());
exports.Singleton = Singleton;
exports.asyncHooks = Singleton;
