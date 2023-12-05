import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { GlobalUser } from "../../glitter-base/global/global-user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return [].join('');
                },
                event: () => {
                    return GlobalUser.language;
                },
            };
        },
    };
});
