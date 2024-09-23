import { GVC } from '../glitterBundle/GVController.js';
export declare class NormalPageEditor {
    static refresh: () => void;
    static back(): void;
    static view(gvc: GVC): string;
    static leftNav(gvc: GVC): string;
    static viewArray: any;
    static isRight?: boolean;
    static visible: boolean;
    static closeEvent: () => void;
    static toggle(cf: {
        visible: boolean;
        title?: string;
        view?: string;
        width?: number;
        right?: boolean;
    }): void;
    static isVisible(): boolean;
}
