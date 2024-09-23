import { GVC } from "../GVController.js";
import { HtmlJson } from "../plugins/plugin-creater.js";
export declare const codeComponent: {
    render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData: any, htmlGenerate?: any) => {
        view: () => Promise<unknown>;
        editor: () => string;
    };
};
