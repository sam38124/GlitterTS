export declare class UtTimer {
    timerName: string;
    count: number;
    history: number[];
    constructor(timerName: string);
    checkPoint: (name: string) => void;
}
