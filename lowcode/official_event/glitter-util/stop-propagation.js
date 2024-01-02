import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, obj, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    element.event.preventDefault();
                    element.event.stopPropagation();
                }
            };
        }
    };
});
