import { Glitter } from "../Glitter.js";
import { GVC } from "../GVController.js";
export interface HtmlJson {
    clickEvent?: {
        src: string;
        route: string;
    };
    hashTag: string;
    rout: string;
    type: string;
    id: string;
    storage: any;
    label: string;
    data: any;
    js: string;
    refreshAll: () => void;
    refreshComponent: () => void;
    styleManager?: (tag: string) => {
        value: string;
        editor: (gvc: GVC, title: string) => string;
    };
    refreshView?: () => void;
    refreshEditor?: () => void;
    formData?: any;
    pageConfig: any;
    appConfig: any;
    global: any;
    share: any;
    bundle: any;
}
export declare class Plugin {
    constructor();
    static create(url: string, fun: (glitter: Glitter, editMode: boolean) => {
        [name: string]: {
            defaultData?: any;
            render: ((gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], subData?: any, htmlGenerate?: any) => {
                view: () => (Promise<string> | string);
                editor: () => Promise<string> | string;
            }) | ((cf: any) => {
                view: () => (Promise<string> | string);
                editor: () => Promise<string> | string;
            });
        };
    }): ({
        [name: string]: {
            defaultData?: any;
            render: ((gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], subData?: any, htmlGenerate?: any) => {
                view: () => (Promise<string> | string);
                editor: () => Promise<string> | string;
            });
        };
    });
    static createComponent(url: string, fun: (glitter: Glitter, editMode: boolean) => {
        defaultData?: any;
        render: ((gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], subData?: any, htmlGenerate?: any, document?: Document) => {
            view: () => (Promise<string> | string);
            editor: () => Promise<string> | string;
        });
    }): any;
    static createViewComponent(url: string, fun: (glitter: Glitter, editMode: boolean) => {
        defaultData?: any;
        render: ((cf: {
            gvc: GVC;
            widget: HtmlJson;
            widgetList: HtmlJson[];
            hoverID: string[];
            subData?: any;
            htmlGenerate?: any;
            formData: any;
        }) => {
            view: () => (Promise<string> | string);
            editor: () => Promise<string> | string;
            user_editor?: () => (Promise<string> | string);
        });
    }): {
        defaultData?: any;
        render: ((cf: {
            gvc: GVC;
            widget: HtmlJson;
            widgetList: HtmlJson[];
            hoverID: string[];
            subData?: any;
            htmlGenerate?: any;
            formData: any;
        }) => {
            view: () => (Promise<string> | string);
            editor: () => Promise<string> | string;
            user_editor?: () => (Promise<string> | string);
        });
    };
    static setComponent(original: string, url: URL): (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData?: any, htmlGenerate?: any) => {
        view: () => (Promise<string> | string);
        editor: () => Promise<string> | string;
    };
    static setViewComponent(url: URL): (cf: any) => {
        view: () => (Promise<string> | string);
        editor: () => Promise<string> | string;
    };
    static initial(gvc: GVC, set: any[]): Promise<boolean>;
    static initialConfig(name: string): void;
    static getAppConfig(name: string, defaultData: any): any;
    static setAppConfig(name: string, setData: any): void;
}
