import { HtmlJson } from "./plugin-creater.js";
import { GVC } from "../GVController.js";
import { Glitter } from "../Glitter.js";
export declare class TriggerEvent {
    static getUrlParameter(url: string, sParam: string): string | undefined;
    static setEventRouter(original: string, relative: string): (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: {
        e: any;
        event: any;
    }) => {
        editor: () => string;
        event: (() => void) | Promise<any>;
    };
    static createSingleEvent(url: string, fun: (glitter: Glitter) => {
        fun: (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: {
            e: any;
            event: any;
        }) => {
            editor: () => string;
            event: (() => void) | Promise<any>;
        };
    }): {
        fun: (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: {
            e: any;
            event: any;
        }) => {
            editor: () => string;
            event: (() => void) | Promise<any>;
        };
    };
    static create(url: string, event: {
        [name: string]: {
            subContent?: string;
            title: string;
            fun: (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: {
                e: any;
                event: any;
            }) => {
                editor: () => string;
                event: (() => void) | Promise<any>;
            };
        };
    }): void;
    static trigger(oj: {
        gvc: GVC;
        widget: HtmlJson;
        clickEvent: any;
        subData?: any;
        element?: {
            e: any;
            event: any;
        };
        callback?: (data: any) => void;
    }): Promise<unknown>;
    static editer(gvc: GVC, widget: HtmlJson, obj: any, option?: {
        hover?: boolean;
        option?: string[];
        title?: string;
    }): any;
    static getLink(url: string): any;
    static isEditMode(): boolean;
}
