import { init } from '../GVController.js';
import { TriggerEvent } from "./trigger-event.js";
init((gvc, glitter, gBundle) => {
    var _a, _b, _c, _d;
    glitter.share.htmlExtension = (_a = glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
    gBundle.app_config = (_b = gBundle.app_config) !== null && _b !== void 0 ? _b : {};
    gBundle.app_config.globalStyle = (_c = gBundle.app_config.globalStyle) !== null && _c !== void 0 ? _c : [];
    gBundle.app_config.globalScript = (_d = gBundle.app_config.globalScript) !== null && _d !== void 0 ? _d : [];
    const vm = {
        loading: true
    };
    async function load() {
        var _a;
        await (new Promise(async (resolve, reject) => {
            var _a;
            for (const b of (_a = gBundle.app_config.initialList) !== null && _a !== void 0 ? _a : []) {
                try {
                    await TriggerEvent.trigger({
                        gvc: gvc, widget: b, clickEvent: b.src.event
                    }).then(() => {
                        resolve(true);
                    }).catch(() => {
                        resolve(true);
                    });
                }
                catch (e) {
                    resolve(true);
                }
            }
        }));
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
    return {
        onCreateView: () => {
            var _a;
            return new glitter.htmlGenerate((_a = gBundle.app_config.globalScript) !== null && _a !== void 0 ? _a : [], [], undefined, true).render(gvc, {
                class: ``,
                style: ``,
                jsFinish: () => {
                    load().then(() => {
                        if (vm.loading) {
                            vm.loading = false;
                            gvc.notifyDataChange('main');
                        }
                    });
                }
            }) + gvc.bindView({
                bind: 'main',
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return new glitter.htmlGenerate(gBundle.app_config.globalStyle, [], undefined, true).render(gvc) + ((gBundle.editMode && gBundle.editMode.render(gvc))
                        ||
                            new glitter.htmlGenerate(gBundle.config, [], undefined, true).render(gvc));
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
