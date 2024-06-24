"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHooks = exports.Singleton = void 0;
const async_hooks_1 = __importDefault(require("async_hooks"));
class AsyncHook {
    constructor() {
        this.store = new Map();
        async_hooks_1.default.createHook({
            init: (asyncId, _, triggerAsyncId) => {
                if (this.store.has(triggerAsyncId)) {
                    this.store.set(asyncId, this.store.get(triggerAsyncId));
                }
            },
            destroy: (asyncId) => {
                if (this.store.has(asyncId)) {
                    this.store.delete(asyncId);
                }
            }
        }).enable();
    }
    createRequestContext(requestInfo) {
        this.store.set(async_hooks_1.default.executionAsyncId(), requestInfo);
        return;
    }
    getRequestContext() {
        return this.store.get(async_hooks_1.default.executionAsyncId());
    }
}
class Singleton {
    constructor() {
        throw Error('This is singletion, please use getInstance method to get the instance');
    }
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new AsyncHook();
        }
        return Singleton.instance;
    }
}
exports.Singleton = Singleton;
exports.asyncHooks = Singleton;
//# sourceMappingURL=hooks.js.map