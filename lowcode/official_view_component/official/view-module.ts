import {Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {ApiPageConfig} from "../../api/pageConfig.js";

Plugin.createViewComponent(import.meta.url, (glitter, editMode) => {
    return {
        defaultData: {},
        render: (cf) => {
            return {
                view: () => {
                    return new Promise(async (resolve, reject) => {
                        const data = (await ApiPageConfig.getPage({
                           tag:"c_header",
                            appName: 'furniture-v2'
                        })).response.result[0]
                        let createOption = (cf.htmlGenerate ?? {}).createOption ?? {}
                        createOption.option = createOption.option ?? []
                        createOption.childContainer = true
                        data.config.formData = data.page_config.formData
                        resolve(new glitter.htmlGenerate(data.config, [], {}).render(cf.gvc, undefined, createOption ?? {}))
                    })
                },
                editor: () => {
                    return ``
                },
                user_editor:()=>{
                    return `rmldma`
                }
            }
        }
    }
})