import {GVC} from "../glitterBundle/GVController.js";
import {BgWidget} from "../backend-manager/bg-widget.js";

export class ImageManager {
    public static main(gvc: GVC) {
        const id = gvc.glitter.getUUID();
        return BgWidget.container(gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    return [
                        BgWidget.title('圖庫管理'),
                    ].join('')
                }
            }
        }))
    }
}


(window as any).glitter.setModule(import.meta.url, ImageManager)