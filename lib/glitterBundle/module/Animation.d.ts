import { PageConfig } from "./PageManager.js";
export declare class AnimationConfig {
    inView: (pageConfig: PageConfig, finish: () => void) => void;
    outView: (pageConfig: PageConfig, finish: () => void) => void;
    constructor(inView: (pageConfig: PageConfig, finish: () => void) => void, outView: (pageConfig: PageConfig, finish: () => void) => void);
}
export declare class Animation {
    static none: AnimationConfig;
    static fade: AnimationConfig;
    static rightToLeft: AnimationConfig;
    static topToBottom: AnimationConfig;
}
