"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackTracker = void 0;
class StackTracker {
    static setProgress(taskId, percentage) {
        const task = this.stack.find(dd => dd.taskId === taskId);
        if (task) {
            task.progress = percentage;
        }
    }
    static getProgress(taskId) {
        var _a;
        return (_a = this.stack.find(item => item.taskId === taskId)) === null || _a === void 0 ? void 0 : _a.progress;
    }
    static getAllProgress(appName) {
        return this.stack.filter(item => item.appName === appName);
    }
    static clearProgress(taskId) {
        this.stack = this.stack.filter(item => item.taskId !== taskId);
    }
    static calcPercentage(nume, deno) {
        const n = (nume / deno) * 100;
        return n > 100 ? 100 : n;
    }
}
exports.StackTracker = StackTracker;
StackTracker.stack = [];
//# sourceMappingURL=update-progress-track.js.map