import { HtmlJson } from "../plugins/plugin-creater.js";
import { GVC } from "../GVController.js";
export declare const widgetComponent: {
    render: (gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], sub: any, htmlGenerate: any, document?: any) => {
        view: () => string;
        editor: () => string;
    };
};
