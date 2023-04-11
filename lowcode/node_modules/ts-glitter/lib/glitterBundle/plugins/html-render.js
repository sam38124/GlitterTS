"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GVController_js_1 = require("../GVController.js");
(0, GVController_js_1.init)((gvc, glitter, gBundle) => {
    var _a;
    glitter.share.htmlExtension = (_a = glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: 'main',
                view: () => {
                    return (gBundle.editMode && gBundle.editMode.render(gvc))
                        ||
                            new glitter.htmlGenerate(gBundle.config, []).render(gvc);
                },
                divCreate: {
                    class: glitter.htmlGenerate.styleEditor(gBundle.page_config).class(), style: `min-height: 100vh;min-width: 100vw;${glitter.htmlGenerate.styleEditor(gBundle.page_config).style()}`
                }
            });
        }
    };
});
//# sourceMappingURL=html-render.js.map