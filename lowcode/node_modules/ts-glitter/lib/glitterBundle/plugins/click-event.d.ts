import { HtmlJson } from "./plugin-creater.js";
import { GVC } from "../GVController.js";
export declare class ClickEvent {
    static getUrlParameter(url: string, sParam: string): string | undefined;
    static create(url: string, event: {
        [name: string]: {
            title: string;
            fun: (gvc: GVC, widget: HtmlJson, obj: any) => {
                editor: () => string;
                event: () => void;
            };
        };
    }): void;
    static trigger(oj: {
        gvc: GVC;
        widget: HtmlJson;
        clickEvent: any;
    }): void;
    static editer(gvc: GVC, widget: HtmlJson, obj: any, option?: {
        hover: boolean;
        option: string[];
        title?: string;
    }): string;
}
