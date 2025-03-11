import { GVC } from '../../glitterBundle/GVController.js';
export declare class FormWidget {
    static settingView(obj: {
        gvc: GVC;
        array: any;
        refresh: () => void;
        widget?: any;
        subData?: any;
        title?: string;
        styleSetting?: boolean;
        concat?: (dd: any) => void;
        user_mode?: boolean;
    }): string;
    static editorView(obj: {
        gvc: GVC;
        array: any;
        refresh: (key: string) => void;
        widget?: any;
        subData?: any;
        formData: any;
        readonly?: 'read' | 'write' | 'block';
    }): string;
    static checkLeakData(form_config_list: any, formData: any): any;
    static checkLeakDataObj(form_config_list: any, formData: any): any;
}
