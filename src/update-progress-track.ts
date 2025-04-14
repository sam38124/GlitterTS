export interface Stack {
  appName: string;
  taskId: string;
  taskTag: string;
  progress: number;
}

export class StackTracker {
  static stack: Stack[] = [];

  static setProgress(taskId: string, percentage: number) {
    const task = this.stack.find(dd => dd.taskId === taskId);
    if (task) {
      task.progress = percentage;
    }
  }

  static getProgress(taskId: string): number | undefined {
    return this.stack.find(item => item.taskId === taskId)?.progress;
  }

  static getAllProgress(appName: string): Stack[] {
    return this.stack.filter(item => item.appName === appName);
  }

  static clearProgress(taskId: string) {
    this.stack = this.stack.filter(item => item.taskId !== taskId);
  }

  static calcPercentage(nume: number, deno: number) {
    const n = (nume / deno) * 100;
    return n > 100 ? 100 : n;
  }
}
