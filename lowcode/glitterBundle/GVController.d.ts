import { Glitter } from './Glitter.js';
import { PageConfig } from "./module/PageManager.js";
export declare class GVC {
    static initial: boolean;
    get glitter(): Glitter;
    static get glitter(): Glitter;
    parameter: {
        clickMap: any;
        pageConfig?: PageConfig;
        bindViewList: any;
        clickID: number;
        styleList: {
            id: string;
            style: string;
        }[];
        styleLinks: {
            id: string;
            src: string;
        }[];
        jsList: {
            id: string;
            src: string;
        }[];
    };
    closeDialog(): void;
    getBundle(): any;
    style_list: {};
    share: any;
    notifyDataChange(id: any): void;
    getBindViewElem(id: string): any;
    recreateView: () => void;
    addObserver(obj: any, callback: () => void, viewBind?: string): void;
    initialElemCallback(id: any): void;
    bindView(map: (() => {
        view: () => (string) | Promise<string>;
        bind: string;
        divCreate?: {
            elem?: string;
            style?: string;
            class?: string;
            option?: {
                key: string;
                value: string;
            }[];
        } | (() => ({
            elem?: string;
            style?: string;
            class?: string;
            option?: {
                key: string;
                value: string;
            }[];
        }));
        dataList?: {
            obj: any;
            key: string;
        }[];
        onCreate?: () => void;
        onInitial?: () => void;
        onDestroy?: () => void;
    }) | {
        view: () => (string) | Promise<string>;
        bind: string;
        divCreate?: {
            elem?: string;
            style?: string;
            class?: string;
            option?: {
                key: string;
                value: string;
            }[];
        } | (() => ({
            elem?: string;
            style?: string;
            class?: string;
            option?: {
                key: string;
                value: string;
            }[];
        }));
        dataList?: {
            obj: any;
            key: string;
        }[];
        onCreate?: () => void;
        onInitial?: () => void;
        onDestroy?: () => void;
    }): string;
    event(fun: (e: any, event: any) => void, noCycle?: string): string;
    editorEvent(fun: (e: any, event: any) => void, noCycle?: string): string;
    addStyle(style: string): void;
    addStyleLink(fs: string | string[]): Promise<void>;
    addMtScript(urlArray: any[], success: () => void, error: (message: string) => void): void;
    id(id: String): string;
    map(array: string[]): string;
}
export declare function init(metaURL: string, fun: (gvc: GVC, glitter: Glitter, gBundle: any) => {
    onCreateView: () => string;
    onResume?: () => void;
    onPause?: () => void;
    onDestroy?: () => void;
    onCreate?: () => void;
    cssInitial?: () => string;
}): void;
