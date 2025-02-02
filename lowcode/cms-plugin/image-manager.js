import { BgWidget } from "../backend-manager/bg-widget.js";
export class ImageManager {
    static main(gvc) {
        const id = gvc.glitter.getUUID();
        return BgWidget.container(gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    return [
                        BgWidget.title('圖庫管理'),
                    ].join('');
                }
            };
        }));
    }
}
window.glitter.setModule(import.meta.url, ImageManager);
