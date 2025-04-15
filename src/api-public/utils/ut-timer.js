"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtTimer = void 0;
var UtTimer = /** @class */ (function () {
    function UtTimer(timerName) {
        var _this = this;
        this.checkPoint = function (name) {
            var t = Date.now();
            _this.history.push(t);
            var spendTime = t - _this.history[_this.count]; // 計算與上一個檢查點的時間差
            var totalTime = t - _this.history[0]; // 計算從開始到現在的總時間
            _this.count++;
            var n = _this.count.toString().padStart(2, '0');
            console.info("".concat(_this.timerName, "-").concat(n, " [").concat(name, "] ").padEnd(40, '=') + '>', {
                totalTime: totalTime,
                spendTime: spendTime,
            });
        };
        this.timerName = timerName.toUpperCase();
        this.count = 0;
        this.history = [Date.now()];
    }
    return UtTimer;
}());
exports.UtTimer = UtTimer;
