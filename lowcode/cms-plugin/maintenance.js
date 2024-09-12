import { BgWidget } from '../backend-manager/bg-widget';
export class Maintenance {
    static main(gvc) {
        return BgWidget.maintenance();
    }
}
window.glitter.setModule(import.meta.url, Maintenance);
