import { GVC } from '../GVController.js';
import { Glitter } from '../Glitter.js';
export interface HtmlJson {
    route: string;
    tag?: string;
    type: string;
    id: string;
    hashTag: string;
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
    formData: any;
    gCount: 'multiple' | 'single';
    arrayData: any;
    editorEvent: any;
    pageConfig: any;
    appConfig: any;
    global: any;
    share: any;
    bundle: any;
    event: any;
}
export declare class HtmlGenerate {
    static share: any;
    static isEditMode: typeof isEditMode;
    static isIdeaMode: typeof isIdeaMode;
    static resourceHook: (src: string) => string;
    static configureCDN(src: string): string;
    render: (gvc: GVC, option?: {
        class: string;
        style: string;
        jsFinish?: () => void;
        containerID?: string;
        onCreate?: () => void;
        onInitial?: () => void;
        onDestroy?: () => void;
        tag?: string;
        attribute?: {
            key: string;
            value: string;
        }[];
        childContainer?: boolean;
        page_config?: any;
        app_config?: any;
        document?: any;
        is_page?: boolean;
        editorSection?: string;
        id?: string;
    }, createOption?: any) => string;
    exportJson: (setting: HtmlJson[]) => any;
    editor: (gvc: GVC, option?: {
        return_: boolean;
        refreshAll: () => void;
        setting?: any[];
        deleteEvent?: () => void;
        hideInfo?: boolean;
    }) => string;
    static saveEvent: (boolean?: boolean, callback?: () => void) => void;
    static getResourceLink(url: string): string;
    static loadScript: (glitter: Glitter, js: {
        src: string;
        callback?: (widget: any) => void;
    }[], where?: string) => void;
    static reDefineJsResource(js: string): string;
    static checkEventStore(glitter: Glitter, src: string): any;
    static checkJsEventStore(glitter: Glitter, src: string, where: string): any;
    static loadEvent: (glitter: Glitter, js: {
        src: string;
        callback?: (widget: any) => void;
    }[]) => void;
    static getKey: (js: string) => any;
    static renameWidgetID: (dd: any) => any;
    static scrollToCenter(gvc: GVC, elementId: string): void;
    static styleEditor(data: any, gvc?: GVC, widget?: HtmlJson, subData?: any): {
        editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => string;
        class: () => string;
        style: () => string;
    };
    static editor_component(data: any, gvc?: GVC, widget?: HtmlJson, subData?: any): {
        [name: string]: any;
        editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => string;
        class: () => string;
        style: () => string;
    };
    static setHome: (obj: {
        page_config?: any;
        app_config?: any;
        config: any;
        editMode?: any;
        data: any;
        tag: string;
        option?: any;
    }) => void;
    static changePage: (obj: {
        page_config?: any;
        config: any;
        editMode?: any;
        data: any;
        tag: string;
        goBack: boolean;
        option?: any;
        app_config?: any;
    }) => void;
    static editeInput(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        type?: string;
    }): string;
    static editeText(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
    }): string;
    setting: HtmlJson[];
    initialFunction: () => void;
    static hover_items: string[];
    constructor(container: HtmlJson[], hoverInitial?: string[], subData?: any, root?: boolean);
    static renderWidgetSingle(cf: {
        widget: any;
        gvc: GVC;
        option: any;
        container: any;
        container_id: string;
        child_container: any;
        root?: boolean;
        sub_data: any;
    }): string;
    static block_timer: number;
    static selectWidget(cf: {
        widget: any;
        gvc: GVC;
        widgetComponentID: string;
        event?: any;
        scroll_to_hover?: boolean;
        glitter: Glitter;
    }): void;
    static getEditorSelectSection(cf: {
        id: string;
        gvc: GVC;
        label: string;
        widget: any;
    }): string;
    static deleteWidget(container_items: any, item: any, callback: () => void): void;
    static preloadEvent(data: any): void;
    static renderComponent(cf: {
        appName: string;
        tag: string;
        gvc: GVC;
        subData: any;
    }): string;
}
declare function isEditMode(): boolean;
declare function isIdeaMode(): boolean;
export {};
