import { GVC } from '../glitterBundle/GVController.js';
export declare class SearchIdea {
    static main(obg: {
        gvc: GVC;
        type?: 'idea' | 'template';
        def?: string;
        selectCallback?: (app_data: any) => void;
    }): string;
    static open(gvc: GVC): void;
    static findTemplate(gvc: GVC, def: string, callback: (app_data: any) => void): void;
}
