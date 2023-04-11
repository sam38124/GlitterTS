import { AnimationConfig } from './Animation.js';
export declare class DefaultSetting {
    pageBgColor: string;
    pageAnimation: AnimationConfig;
    dialogAnimation: AnimationConfig;
    pageLoading: () => void;
    pageLoadingFinish: () => void;
    constructor(obj: {
        pageBgColor: string;
        pageAnimation: AnimationConfig;
        dialogAnimation: AnimationConfig;
        pageLoading: () => void;
        pageLoadingFinish: () => void;
    });
}
export declare enum GVCType {
    Page = 0,
    Dialog = 1
}
export declare class PageConfig {
    id: string;
    obj: any;
    goBack: boolean;
    src: string;
    tag: string;
    createResource: () => void;
    deleteResource: () => void;
    type: GVCType;
    animation: AnimationConfig;
    backGroundColor: string;
    scrollTop: number;
    getElement(): any;
    constructor(par: {
        id: string;
        obj: any;
        goBack: boolean;
        src: string;
        tag: string;
        createResource: () => void;
        deleteResource: () => void;
        type: GVCType;
        animation: AnimationConfig;
        backGroundColor: string;
    });
}
export declare class PageManager {
    static hidePageView(id: string, del?: boolean): void;
    static showPageView(id: string): void;
    static hideLoadingView(): void;
    static setHome(url: string, tag: string, obj: any, option?: {
        animation?: AnimationConfig;
        backGroundColor?: string;
    }): void;
    static setLoadingView(link: string): void;
    static changePageListener(tag: string): void;
    static showLoadingView(): void;
    static changeWait: () => void;
    static setAnimation(page: PageConfig): void;
    static clock: {
        start: Date;
        stop: () => number;
        zeroing: () => void;
    };
    static changePage(url: string, tag: string, goBack: boolean, obj: any, option?: {
        animation?: AnimationConfig;
        backGroundColor?: string;
    }): void;
    static removePage(tag: string): void;
    static openDiaLog(url: string, tag: string, obj: any, option?: {
        animation?: AnimationConfig;
        backGroundColor?: string;
    }): void;
    static closeDiaLog(tag?: string): void;
    static goBack(tag?: string | undefined): void;
    static goMenu(): void;
    static addChangePageListener(callback: (data: string) => void): void;
}
