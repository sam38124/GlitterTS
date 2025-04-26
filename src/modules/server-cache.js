"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerCache = void 0;
class ServerCache {
    static setCache(tag, fun, callback) {
        ServerCache.share[tag] = ServerCache.share[tag] || {
            callback: [],
            data: undefined,
            isRunning: false,
        };
        if (ServerCache.share[tag].data) {
            callback &&
                callback((() => {
                    try {
                        return JSON.parse(JSON.stringify(ServerCache.share[tag].data));
                    }
                    catch (e) {
                        console.log(`parseError`, ServerCache.share[tag].data);
                    }
                })());
        }
        else {
            ServerCache.share[tag].callback.push(callback);
            if (!ServerCache.share[tag].isRunning) {
                ServerCache.share[tag].isRunning = true;
                fun((response) => {
                    ServerCache.share[tag].callback.map((callback) => {
                        callback &&
                            callback((() => {
                                try {
                                    return JSON.parse(JSON.stringify(response));
                                }
                                catch (e) {
                                    console.log(`parseError`, ServerCache.share[tag].data);
                                }
                            })());
                    });
                    ServerCache.share[tag].data = JSON.parse(JSON.stringify(response));
                    ServerCache.share[tag].callback = [];
                });
            }
        }
    }
    static clearCache(tag) {
        delete ServerCache.share[tag];
    }
}
exports.ServerCache = ServerCache;
ServerCache.share = {};
//# sourceMappingURL=server-cache.js.map