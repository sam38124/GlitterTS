import { init } from '../GVController.js';
import { TriggerEvent } from "./trigger-event.js";
init((gvc, glitter, gBundle) => {
    var _a, _b;
    glitter.share.htmlExtension = (_a = glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
    ((_b = gBundle.page_config.initialList) !== null && _b !== void 0 ? _b : []).map((dd) => {
        if (dd.when === 'initial') {
            if (dd.type === 'script') {
                try {
                    TriggerEvent.trigger({
                        gvc: gvc, widget: undefined, clickEvent: dd
                    });
                }
                catch (e) { }
            }
            else {
                try {
                    eval(dd.src.official);
                }
                catch (e) { }
            }
        }
    });
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
                },
                onCreate: () => {
                    var _a;
                    ((_a = gBundle.page_config.initialList) !== null && _a !== void 0 ? _a : []).map((dd) => {
                        if (dd.when === 'onCreate') {
                            try {
                                eval(dd.src.official);
                            }
                            catch (e) { }
                        }
                    });
                }
            });
        }
    };
});
