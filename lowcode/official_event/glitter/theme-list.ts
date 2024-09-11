import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiPageConfig } from '../../api/pageConfig.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.appName = object.appName ?? {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.appName, {
                            hover: false,
                            option: [],
                            title: '參照APP來源',
                        }),
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const appName = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.appName,
                            subData: subData,
                        });
                        const appList = await ApiPageConfig.getAppList(appName as any);
                        resolve(appList.response.result);
                    });
                },
            };
        },
    };
});
