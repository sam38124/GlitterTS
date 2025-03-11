import { GVC } from '../glitterBundle/GVController.js';
export declare class AddComponent {
    static addEvent: (gvc: GVC, tdata: any) => void;
    static addWidget: (gvc: GVC, tdata: any) => void;
    static refresh: () => void;
    static view(gvc: GVC): string;
    static toggle(visible: boolean): void;
    static leftNav(gvc: GVC): string;
    static addModuleView(gvc: GVC, type: 'page' | 'module' | 'article' | 'blog' | 'backend' | 'form_plugin', callback: (data: any) => void, withEmpty?: boolean, justGetIframe?: boolean, basic?: boolean): Promise<string>;
    static getComponentDetail(obj: {
        data: any;
        gvc: GVC;
        withEmpty: boolean;
        type: string;
        callback: (data: any) => void;
        justGetIframe: boolean;
    }): string;
    static plusView(gvc: GVC): string;
    static redefinePage(gvc: GVC, callback: (data: {
        tag: string;
        group?: string;
        name?: string;
    }) => void, type: string): void;
    static checkLoop(gvc: GVC, data: {
        copyApp: string;
        copy: string;
    }): Promise<{
        copy_component: any;
        global_style: any;
        global_script: any;
    }>;
    static closeEvent: () => void;
}
