import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import {FileSystemGet} from "../../modules/file-system-get.js";
import {FileItem} from "../../modules/file-system.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.id_from=object.id_from??{}
            return {
                editor: () => {
                    let view:string[]=[];
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                view.push(TriggerEvent.editer(gvc, widget, object.id_from, { title: '文本ID來源', hover: false, option: [] }));
                                return view.join('');
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const id: any = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.id_from,
                            subData: subData
                        })
                        const text_array:FileItem[] = await FileSystemGet.getFile({
                            id:id,
                            key:'text-manager'
                        })
                        resolve(text_array)
                    });
                },
            };
        },
    };
});
