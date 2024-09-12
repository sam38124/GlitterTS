import { BgWidget } from '../backend-manager/bg-widget.js';

export class ErrorLottie {
    static maintenance() {
        return BgWidget.maintenance();
    }

    static noPermission() {
        return BgWidget.noPermission();
    }
}

(window as any).glitter.setModule(import.meta.url, ErrorLottie);
