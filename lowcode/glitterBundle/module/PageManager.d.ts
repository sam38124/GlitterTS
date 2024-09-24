import { AnimationConfig } from './Animation.js';
import { GVC } from "../GVController.js";
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
    initial: boolean;
    search: string;
    id: string;
    obj: any;
    goBack: boolean;
    src: string;
    tag: string;
    createResource: () => void;
    deleteResource: (destroy: boolean) => void;
    type: GVCType;
    animation: AnimationConfig;
    backGroundColor: string;
    scrollTop: number;
    dismiss: () => void;
    renderFinish: () => void;
    static rootPath: string;
    getElement(): any;
    gvc?: GVC;
    constructor(par: {
        id: string;
        obj: any;
        goBack: boolean;
        src: string;
        tag: string;
        createResource: () => void;
        deleteResource: (destroy: boolean) => void;
        type: GVCType;
        animation: AnimationConfig;
        backGroundColor: string;
        dismiss: () => void;
        renderFinish: () => void;
        search?: string;
    });
}
export declare class PageManager {
    static hiddenElement: any;
    static hidePageView(id: string, del?: boolean): void;
    static showPageView(id: string): void;
    static hideLoadingView(): void;
    static getRelativeUrl(url: string | any): any;
    static setHome(url: string, tag: string, obj: any, option?: {
        animation?: AnimationConfig;
        backGroundColor?: string;
        dismiss?: () => void;
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
    static setHistory(tag: string, type: string): void;
    static changePage(url: string, tag: string, goBack: boolean, obj: any, option?: {
        animation?: AnimationConfig;
        backGroundColor?: string;
        dismiss?: () => void;
    }): void;
    static removePage(tag: string): void;
    static innerDialog: (html: (gvc: GVC) => string | Promise<string>, tag: string, option?: {
        animation?: AnimationConfig;
        backGroundColor?: string;
        dismiss?: () => void;
    }) => void;
    static openDiaLog(url: string, tag: string, obj: any, option?: {
        animation?: AnimationConfig;
        backGroundColor?: string;
        dismiss?: () => void;
    }): void;
    static closeDiaLog(tag?: string): void;
    static goBack(tag?: string | undefined): void;
    static goMenu(): void;
    static addChangePageListener(callback: (data: string) => void): void;
}
