export class StepManager<T> {
    public steps: T[]; // 用于存储步骤的栈
    public currentPosition: number; // 当前所在的位置指针
    private readonly MAX_STEPS:number;
        constructor(maxSteps: number = 10) {
        this.steps = [];
        this.currentPosition = -1;
            this.MAX_STEPS = maxSteps; //
    }

    // 添加新步骤
    addStep(step: T): void {
        // 如果当前步骤不是最新的步骤，那么删除当前位置后的所有步骤
        if (this.currentPosition < this.steps.length - 1) {
            this.steps = this.steps.slice(0, this.currentPosition + 1);
        }
        // 检查步骤数是否达到最大限制
        if (this.steps.length >= this.MAX_STEPS) {
            this.steps.shift(); // 移除最早的步骤
            this.currentPosition--; // 更新当前位置指针
        }
        // 将新步骤添加到栈中，并更新当前位置
        this.steps.push(step);
        this.currentPosition++;
        console.log(`新增步骤: ${step}, 当前步骤栈: ${this.steps}`);
    }

    // 返回到上一步
    previousStep(): T | null {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            console.log(`返回到上一步: ${this.steps[this.currentPosition]}`);
            return this.steps[this.currentPosition];
        } else {
            console.log('无法再返回上一步了');
            return null;
        }
    }

    // 前往下一步
    nextStep(): T | null {
        if (this.currentPosition < this.steps.length - 1) {
            this.currentPosition++;
            console.log(`前往下一步: ${this.steps[this.currentPosition]}`);
            return this.steps[this.currentPosition];
        } else {
            console.log('无法再前往下一步了');
            return null;
        }
    }
    // 判断是否可以返回上一步
    canGoBack(): boolean {
        return this.currentPosition > 0;
    }

    // 判断是否可以前往下一步
    canGoForward(): boolean {
        console.log(`canGoForward=>`, this.currentPosition < this.steps.length - 1)
        return this.currentPosition < this.steps.length - 1;
    }
}

