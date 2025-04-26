"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsQueue = void 0;
class ThreadsQueue {
    static setQueue(tag, fun, callback) {
        ThreadsQueue.share[tag] = ThreadsQueue.share[tag] || {
            callback: [],
            data: undefined,
            isRunning: false,
        };
        if (ThreadsQueue.share[tag].data) {
            callback &&
                callback((() => {
                    try {
                        return JSON.parse(JSON.stringify(ThreadsQueue.share[tag].data));
                    }
                    catch (e) {
                        console.log(`parseError`, ThreadsQueue.share[tag].data);
                    }
                })());
        }
        else {
            ThreadsQueue.share[tag].callback.push(callback);
            if (!ThreadsQueue.share[tag].isRunning) {
                ThreadsQueue.share[tag].isRunning = true;
                fun((response) => {
                    ThreadsQueue.share[tag].callback.map((callback) => {
                        callback &&
                            callback((() => {
                                try {
                                    return JSON.parse(JSON.stringify(response));
                                }
                                catch (e) {
                                    console.log(`parseError`, ThreadsQueue.share[tag].data);
                                }
                            })());
                    });
                    ThreadsQueue.share[tag].data = JSON.parse(JSON.stringify(response));
                    ThreadsQueue.share[tag].callback = [];
                });
            }
        }
    }
}
exports.ThreadsQueue = ThreadsQueue;
ThreadsQueue.share = {};
//# sourceMappingURL=threads-queue.js.map