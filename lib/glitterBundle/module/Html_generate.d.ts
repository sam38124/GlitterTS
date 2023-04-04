import { GVC } from '../GVController.js';
export interface HtmlJson {
    route: string;
    type: string;
    id: string;
    label: string;
    data: any;
    js: string;
    layoutMode?: string;
    class?: string;
    style?: string;
    css: {
        class: any;
        style: any;
    };
    refreshAll?: () => void;
    refreshComponent?: () => void;
    refreshComponentParameter?: {
        view1: () => void;
        view2: () => void;
    };
    refreshAllParameter?: {
        view1: () => void;
        view2: () => void;
    };
    expand?: boolean;
    expandStyle?: boolean;
    styleManager?: {
        get: (obj: {
            title: string;
            tag: string;
            def: string;
        }) => string;
        editor: (gvc: GVC, array: {
            [name: string]: {
                title: string;
                tag: string;
                def: string;
            };
        }, title?: string) => string;
    };
    selectStyle: string;
}
export declare class HtmlGenerate {
    static share: any;
    static resourceHook: (src: string) => string;
    render: (gvc: GVC, option?: {
        class: string;
        style: string;
        divCreate?: boolean;
    }) => string;
    exportJson: (setting: HtmlJson[]) => any;
    editor: (gvc: GVC, option?: {
        return_: boolean;
        refreshAll: () => void;
        setting?: any[];
        deleteEvent?: () => void;
    }) => string;
    static saveEvent: () => void;
    static styleEditor(data: any): {
        editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string | undefined) => string;
        class: () => any;
        style: () => string;
    };
    static setHome: (obj: {
        page_config?: any;
        config: any;
        editMode?: any;
        data: any;
        tag: string;
        option?: any;
    }) => void;
    static changePage: (obj: {
        config: any;
        editMode?: any;
        data: any;
        tag: string;
        goBack: boolean;
        option?: any;
    }) => void;
    static editeInput(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
    }): string;
    static editeText(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
    }): string;
    setting: HtmlJson[];
    constructor(setting: HtmlJson[], hover?: string[]);
}
