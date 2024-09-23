import { GVC } from "../GVController.js";
export declare class RenderValue {
    static custom_style: {
        container_style: (gvc: GVC, widget: any) => string;
        value: (gvc: GVC, widget: any) => string;
        initialWidget: (widget: any) => void;
    };
}
