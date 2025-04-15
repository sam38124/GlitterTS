export class UtTimer {
  timerName: string;
  count: number;
  history: number[];

  constructor(timerName: string) {
    this.timerName = timerName.toUpperCase();
    this.count = 0;
    this.history = [Date.now()];
  }

  checkPoint = (name: string) => {
    const t = Date.now();
    this.history.push(t);

    const spendTime = (t - this.history[this.count]) / 1000; // 計算與上一個檢查點的時間差
    const totalTime = (t - this.history[0]) / 1000; // 計算從開始到現在的總時間

    this.count++;
    const n = this.count.toString().padStart(2, '0');

    console.info(`${this.timerName}-${n} [${name}] `.padEnd(50, '-') + '>', {
      totalTime,
      spendTime,
    });
  };
}
