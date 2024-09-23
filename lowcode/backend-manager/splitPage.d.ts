import { GVC } from '../glitterBundle/GVController.js';
export declare class PageSplit {
    pageSplit: (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => any;
    pageSplitV2: (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => any;
    constructor(gvc: GVC);
}
