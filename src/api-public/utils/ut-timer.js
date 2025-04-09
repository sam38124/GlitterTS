"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtTimer = void 0;
class UtTimer {
    constructor(timerName) {
        this.checkPoint = (name) => {
            const t = Date.now();
            this.history.push(t);
            const spendTime = t - this.history[this.count];
            const totalTime = t - this.history[0];
            this.count++;
            const n = this.count.toString().padStart(2, '0');
            console.info(`${this.timerName}-${n} [${name}] `.padEnd(40, '=') + '>', {
                totalTime,
                spendTime,
            });
        };
        this.timerName = timerName.toUpperCase();
        this.count = 0;
        this.history = [Date.now()];
    }
}
exports.UtTimer = UtTimer;
//# sourceMappingURL=ut-timer.js.map