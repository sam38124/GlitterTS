import { GVC } from '../../glitterBundle/GVController.js';
export declare class UmClass {
    static nav(gvc: GVC): string;
    static spinner(obj?: {
        container?: {
            class?: string;
            style?: string;
        };
        circle?: {
            visible?: boolean;
            width?: number;
            borderSize?: number;
        };
        text?: {
            value?: string;
            visible?: boolean;
            fontSize?: number;
        };
    }): string;
    static dialog(obj: {
        gvc: GVC;
        tag: string;
        title?: string;
        innerHTML: (gvc: GVC) => string;
        width?: number;
    }): void;
    static getRebateInfo(): Promise<unknown>;
    static getUserData(gvc: GVC): Promise<unknown>;
    static addStyle(gvc: GVC): void;
    static jumpAlert(obj: {
        gvc: GVC;
        text: string;
        justify: 'top' | 'bottom';
        align: 'left' | 'center' | 'right';
        timeout?: number;
        width?: number;
    }): void;
    static validImageBox(obj: {
        gvc: GVC;
        image: string;
        width: number;
        height?: number;
        class?: string;
        style?: string;
    }): string;
}
