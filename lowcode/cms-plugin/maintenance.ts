import { BgWidget } from '../backend-manager/bg-widget';
import { GVC } from '../glitterBundle/GVController.js';

export class Maintenance {
    static main(gvc: GVC) {
        return BgWidget.maintenance();
    }
}

(window as any).glitter.setModule(import.meta.url, Maintenance);
