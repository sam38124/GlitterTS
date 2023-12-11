import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
Plugin.createViewComponent(import.meta.url, (glitter, editMode) => {
    return {
        defaultData: {},
        render: (cf) => {
            return {
                view: () => {
                    return `${(cf.formData).title}`;
                },
                editor: () => {
                    return `testtttt`;
                }
            };
        }
    };
});
