var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { ApiPageConfig } from "../../api/pageConfig.js";
Plugin.createViewComponent(import.meta.url, (glitter, editMode) => {
    return {
        defaultData: {},
        render: (cf) => {
            return {
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a, _b, _c;
                        const data = (yield ApiPageConfig.getPage({
                            tag: "c_header",
                            appName: 'furniture-v2'
                        })).response.result[0];
                        let createOption = (_b = ((_a = cf.htmlGenerate) !== null && _a !== void 0 ? _a : {}).createOption) !== null && _b !== void 0 ? _b : {};
                        createOption.option = (_c = createOption.option) !== null && _c !== void 0 ? _c : [];
                        createOption.childContainer = true;
                        data.config.formData = data.page_config.formData;
                        resolve(new glitter.htmlGenerate(data.config, [], {}).render(cf.gvc, undefined, createOption !== null && createOption !== void 0 ? createOption : {}));
                    }));
                },
                editor: () => {
                    return ``;
                },
                user_editor: () => {
                    return `rmldma`;
                }
            };
        }
    };
});
