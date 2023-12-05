var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    function load() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield (new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                for (const b of (_b = gBundle.app_config.initialList) !== null && _b !== void 0 ? _b : []) {
                    try {
                        yield TriggerEvent.trigger({
                            gvc: gvc, widget: b, clickEvent: b.src.event
                        }).then(() => {
                        }).catch(() => {
                        });
                    }
                    catch (e) {
                    }
                }
                resolve(true);
            })));
            yield (new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _c;
                ((_c = gBundle.page_config.initialList) !== null && _c !== void 0 ? _c : []).map((dd) => {
                    if (dd.when === 'initial') {
                        if (dd.type === 'script') {
                            try {
                                TriggerEvent.trigger({
                                    gvc: gvc, widget: undefined, clickEvent: dd
                                });
                            }
                            catch (e) {
                            }
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
            })));
            ((_a = gBundle.page_config.initialStyleSheet) !== null && _a !== void 0 ? _a : []).map((data) => __awaiter(this, void 0, void 0, function* () {
                if (data.type === 'script') {
                    try {
                        gvc.addStyleLink(data);
                    }
                    catch (e) {
                    }
                }
                else {
                    try {
                        gvc.addStyle(data.src.official);
                    }
                    catch (e) {
                    }
                }
            }));
        });
    }
    ;
    return {
        onCreateView: () => {
            var _a;
            console.log(`onCreateView-time:`, window.renderClock.stop());
            return new glitter.htmlGenerate((_a = gBundle.app_config.globalScript) !== null && _a !== void 0 ? _a : [], [], undefined, true).render(gvc, {
                class: ``,
                style: ``,
                jsFinish: () => {
                    console.log(`jsFinish-time:`, window.renderClock.stop());
                    load().then(() => {
                        console.log(`loadFinish-time:`, window.renderClock.stop());
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
                    console.log(`Render-time:`, window.renderClock.stop());
                    return new glitter.htmlGenerate(gBundle.app_config.globalStyle, [], undefined, true).render(gvc) + ((gBundle.editMode && gBundle.editMode.render(gvc))
                        ||
                            new glitter.htmlGenerate(gBundle.config, [], undefined, true).render(gvc));
                },
                divCreate: {
                    class: glitter.htmlGenerate.styleEditor(gBundle.page_config).class(),
                    style: `min-height: 100vh;min-width: 100vw;${glitter.htmlGenerate.styleEditor(gBundle.page_config).style()}`
                },
                onCreate: () => {
                    var _a;
                    ((_a = gBundle.page_config.initialList) !== null && _a !== void 0 ? _a : []).map((dd) => {
                        if (dd.when === 'onCreate') {
                            try {
                                eval(dd.src.official);
                            }
                            catch (e) {
                            }
                        }
                    });
                }
            });
        }
    };
});
