import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
export const article = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData) => {
            return {
                view: () => {
                    return ``;
                },
                editor: () => {
                    return ``;
                }
            };
        }
    };
});
