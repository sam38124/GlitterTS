import { GVC } from '../../glitterBundle/GVController.js';

export class UMInfo {
    static main(gvc: GVC, widget: any, subData: any) {
        return '123';
    }
}

(window as any).glitter.setModule(import.meta.url, UMInfo);
