import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise((resolve, reject) => {
                        const glitter = window.glitter;
                        glitter.runJsInterFace('getBottomInset', {}, (response) => {
                            resolve(response.data);
                        }, {
                            webFunction: () => {
                                return { data: 0 };
                            },
                        });
                    });
                }
            };
        }
    };
});
