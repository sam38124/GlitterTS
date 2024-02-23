import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    gvc.glitter.goBack();
                },
            };
        }
    };
});
