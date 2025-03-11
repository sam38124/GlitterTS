import { GVC } from '../glitterBundle/GVController.js';
type icons = 'success' | 'error' | 'warning' | 'info' | 'question';
export declare class Swal {
    init: (callback: () => void) => void;
    fire: (title: string, text: string, icon: icons) => void;
    nextStep: (title: string, callback: () => void, icon?: icons) => void;
    notify: (title: string, text: string, icon: string, callback: () => void) => void;
    stoper: () => Promise<boolean>;
    isVisible: () => void;
    close: () => void;
    loading: (text: string) => void;
    toast: (data: {
        icon: icons;
        title: string;
        position?: 'top' | 'bottom' | 'center';
    }) => void;
    isConfirm: (text: string, icon: string, callback: () => void) => void;
    deleteAlertDetail: (text: string, callback: () => void) => void;
    deleteAlert: (text: string, callback: () => void) => void;
    formHTML: (title: string, formList: {
        title: string;
        value: any;
        [k: string]: any;
    }[], validList: {
        [k: string]: any;
    }, formCB: (resp: any) => void, finallyCB: () => void, confirmText?: string) => void;
    printHTML: (title: string, html: string, arg?: {
        width?: string;
        allowOutsideClick?: boolean;
    }) => void;
    showValid: (text: string) => void;
    resetValid: () => void;
    constructor(gvc: GVC);
}
export {};
