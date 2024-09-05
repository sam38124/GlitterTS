export class StepManager {
    constructor(maxSteps = 10) {
        this.steps = [];
        this.currentPosition = -1;
        this.MAX_STEPS = maxSteps;
    }
    addStep(step) {
        if (this.currentPosition < this.steps.length - 1) {
            this.steps = this.steps.slice(0, this.currentPosition + 1);
        }
        if (this.steps.length >= this.MAX_STEPS) {
            this.steps.shift();
            this.currentPosition--;
        }
        this.steps.push(step);
        this.currentPosition++;
        console.log(`新增步骤: ${step}, 当前步骤栈: ${this.steps}`);
    }
    previousStep() {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            console.log(`返回到上一步: ${this.steps[this.currentPosition]}`);
            return this.steps[this.currentPosition];
        }
        else {
            console.log('无法再返回上一步了');
            return null;
        }
    }
    nextStep() {
        if (this.currentPosition < this.steps.length - 1) {
            this.currentPosition++;
            console.log(`前往下一步: ${this.steps[this.currentPosition]}`);
            return this.steps[this.currentPosition];
        }
        else {
            console.log('无法再前往下一步了');
            return null;
        }
    }
    canGoBack() {
        return this.currentPosition > 0;
    }
    canGoForward() {
        console.log(`canGoForward=>`, this.currentPosition < this.steps.length - 1);
        return this.currentPosition < this.steps.length - 1;
    }
}
