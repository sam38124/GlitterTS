import { GVC } from './glitterBundle/GVController.js';
export declare class EditorConfig {
    static get editor_layout(): {
        main_color: string;
        btn_background: string;
    };
    static page_type_list: {
        title: string;
        value: string;
    }[];
    static color_setting_config: {
        key: string;
        title: string;
    }[];
    static paymentInfo(gvc: GVC): string;
    static getPaddingTop(gvc: GVC): any;
    static getPaymentStatus(): {
        plan: any;
        dead_line: any;
    };
    static backend_page(): 'backend-manger' | 'page-editor' | 'user-editor';
}
