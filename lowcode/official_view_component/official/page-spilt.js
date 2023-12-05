import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { PageSplit } from "../../backend-manager/splitPage.js";
Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        defaultData: {},
        render: (gvc, widget, setting, hoverID) => {
            return {
                view: () => {
                    const pageSpilt = new PageSplit(gvc);
                    return pageSpilt.pageSplit(10, 1, (p) => {
                    });
                },
                editor: () => {
                    return ``;
                }
            };
        }
    };
});
