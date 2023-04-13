import { Glitter } from "../Glitter.js";
import { GVC } from "../GVController.js";
export interface HtmlJson {
    clickEvent?: {
        src: string;
        route: string;
    };
    rout: string;
    type: string;
    id: string;
    label: string;
    data: any;
    js: string;
    refreshAll: () => void;
    refreshComponent: () => void;
    styleManager?: (tag: string) => {
        value: string;
        editor: (gvc: GVC, title: string) => string;
    };
}
export declare class Plugin {
    constructor();
    static create(url: string, fun: (glitter: Glitter, editMode: boolean) => {
        [name: string]: {
            defaultData: any;
            render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[]) => {
                view: () => string;
                editor: () => string;
            };
        };
    }): void;
    static initial(gvc: GVC, set: any[]): Promise<boolean>;
    static initialConfig(name: string): void;
    static getAppConfig(name: string, defaultData: any): any;
    static setAppConfig(name: string, setData: any): void;
}
