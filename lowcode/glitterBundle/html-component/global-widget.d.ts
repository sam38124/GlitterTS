import { GVC } from "../GVController.js";
export declare class GlobalWidget {
    constructor();
    static glitter_view_type: string;
    static showCaseBar(gvc: GVC, widget: any, refresh: (data: string) => void): string;
    static initialShowCaseData(obj: {
        widget: any;
        gvc: GVC;
    }): void;
    static switchButton(gvc: GVC, def: boolean, callback: (value: boolean) => void): string;
    static showCaseEditor(obj: {
        gvc: GVC;
        widget: any;
        view: (widget: any, type: any) => string;
        custom_edit?: boolean;
        toggle_visible?: (result: boolean) => void;
        hide_selector?: boolean;
        hide_ai?: boolean;
    }): string;
    static showCaseData(obj: {
        gvc: GVC;
        widget: any;
        empty?: string;
        view: (widget: any) => string;
    }): string;
}
