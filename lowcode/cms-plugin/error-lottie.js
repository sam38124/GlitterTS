import { BgWidget } from '../backend-manager/bg-widget.js';
export class ErrorLottie {
    static maintenance() {
        return BgWidget.maintenance();
    }
    static noPermission() {
        return BgWidget.noPermission();
    }
}
window.glitter.setModule(import.meta.url, ErrorLottie);
