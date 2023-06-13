import { init } from '../GVController.js';
import { TriggerEvent } from "./trigger-event.js";
init((gvc, glitter, gBundle) => {
    var _a;
    glitter.share.htmlExtension = (_a = glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
    const vm = {
        loading: true
    };
    async function load() {
        var _a;
        await (new Promise(async (resolve, reject) => {
            var _a;
            ((_a = gBundle.page_config.initialList) !== null && _a !== void 0 ? _a : []).map((dd) => {
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
                        catch (e) {
                        }
                    }
                }
            });
            resolve(true);
        }));
        ((_a = gBundle.page_config.initialStyleSheet) !== null && _a !== void 0 ? _a : []).map(async (data) => {
            if (data.type === 'script') {
                try {
                    gvc.addStyleLink(data);
                }
                catch (e) { }
            }
            else {
                try {
                    gvc.addStyle(data.src.official);
                }
                catch (e) { }
            }
        });
    }
    ;
    load().then(() => {
        vm.loading = false;
        gvc.notifyDataChange('main');
    });
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: 'main',
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return (gBundle.editMode && gBundle.editMode.render(gvc))
                        ||
                            new glitter.htmlGenerate(gBundle.config, [], undefined, true).render(gvc);
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
