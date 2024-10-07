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
import { GlobalUser } from "../../glitter-base/global/global-user.js";
init(import.meta.url, (gvc, glitter, gBundle) => {
    var _a, _b, _c, _d;
    glitter.share.htmlExtension = (_a = glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
    gBundle.app_config = (_b = gBundle.app_config) !== null && _b !== void 0 ? _b : {};
    gBundle.app_config.globalStyle = (_c = gBundle.app_config.globalStyle) !== null && _c !== void 0 ? _c : [];
    gBundle.app_config.globalScript = (_d = gBundle.app_config.globalScript) !== null && _d !== void 0 ? _d : [];
    const vm = {
        loading: true,
        mainView: ''
    };
    console.log(`the-page`, gvc.glitter.getUrlParameter('page'));
    console.log(`waitCreateView-time:`, window.renderClock.stop());
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
    if (!gBundle.data) {
        gBundle.data = {};
    }
    return {
        onCreateView: () => {
            var _a, _b;
            if (gvc.glitter.getUrlParameter('page') === 'account_userinfo' && !GlobalUser.token) {
                gvc.glitter.href = '/login';
                return ``;
            }
            document.querySelector('body').style.background = gBundle.app_config._background || glitter.share.globalValue[`theme_color.0.background`];
            console.log(`onCreateView-time:`, window.renderClock.stop());
            const mainId = glitter.getUUID();
            let map = [];
            if (gBundle.page_config.resource_from !== 'own') {
                map.push(new glitter.htmlGenerate((_a = gBundle.app_config.globalScript) !== null && _a !== void 0 ? _a : [], [], gBundle.data, true).render(gvc, {
                    class: ``,
                    style: ``,
                    jsFinish: () => {
                        console.log(`jsFinish-time:`, window.renderClock.stop());
                        load().then(() => {
                            if (vm.loading) {
                                vm.loading = false;
                                gvc.notifyDataChange(mainId);
                                window.history.replaceState({}, glitter.document.title, location.href);
                            }
                        });
                    }
                }));
                let globalStyleLink = ((_b = gBundle.app_config.globalStyle) !== null && _b !== void 0 ? _b : []).filter((dd) => {
                    return dd.data.elem === 'link';
                });
                let check = globalStyleLink.length;
                globalStyleLink.map((dd) => {
                    try {
                        $('#glitterPage').hide();
                        glitter.addStyleLink(dd.data.attr.find((dd) => {
                            return dd.attr === 'href';
                        }).value).then(() => {
                            check--;
                            if (check === 0) {
                                $('#glitterPage').show();
                            }
                        });
                    }
                    catch (e) {
                        return ``;
                    }
                });
                map.push(new glitter.htmlGenerate(gBundle.app_config.globalStyle, [], gBundle.data, true).render(gvc, {
                    class: ``,
                    style: ``,
                    app_config: gBundle.app_config,
                    page_config: gBundle.page_config,
                    onCreate: () => {
                        console.log(`createRender`);
                    }
                }));
            }
            else {
                vm.loading = false;
            }
            map.push(gvc.bindView({
                bind: mainId,
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        console.log(`Render-time:`, window.renderClock.stop());
                        (gBundle.config.formData = gBundle.page_config.formData);
                        if (gBundle.page_config.template) {
                            window.glitterInitialHelper.getPageData(gBundle.page_config.template, (data) => {
                                const template_config = JSON.parse(JSON.stringify(data.response.result[0].config));
                                function findContainer(set) {
                                    set.map((dd, index) => {
                                        var _a;
                                        if (dd.type === 'glitter_article') {
                                            if (gBundle.page_config.meta_article.view_type === "rich_text") {
                                                set[index].type = 'widget';
                                                set[index].data.inner = gBundle.page_config.meta_article.content;
                                            }
                                            else {
                                                if (gBundle.editMode) {
                                                    set[index].type = 'widget';
                                                    set[index].data.inner = (gBundle.editMode && gBundle.editMode.render(gvc, {
                                                        class: ``,
                                                        style: ``,
                                                        app_config: gBundle.app_config,
                                                        page_config: gBundle.page_config
                                                    }));
                                                }
                                                else {
                                                    set[index].type = 'container';
                                                    set[index].data = {
                                                        "setting": gBundle.config,
                                                        "elem": "div",
                                                        "style_from": set[index].style_from,
                                                        "class": set[index].class,
                                                        "style": set[index].style,
                                                        "classDataType": set[index].classDataType,
                                                        "dataType": set[index].dataType
                                                    };
                                                }
                                                function loopFormData(dd) {
                                                    dd.formData = gBundle.page_config.formData;
                                                    if (dd.type === 'container') {
                                                        loopFormData(dd.data.setting);
                                                    }
                                                }
                                                loopFormData(set[index]);
                                            }
                                        }
                                        else if (dd.type === 'container') {
                                            dd.data.setting = (_a = dd.data.setting) !== null && _a !== void 0 ? _a : [];
                                            dd.formData = data.response.result[0].page_config.formData;
                                            findContainer(dd.data.setting);
                                        }
                                    });
                                }
                                findContainer(template_config);
                                resolve(new glitter.htmlGenerate(template_config, [], gBundle.data, true).render(gvc, {
                                    class: ``,
                                    style: ``,
                                    app_config: gBundle.app_config,
                                    page_config: gBundle.page_config
                                }));
                            });
                        }
                        else {
                            function editorView() {
                                return gBundle.editMode.render(gvc, {
                                    class: ``,
                                    style: ``,
                                    containerID: `MainView`,
                                    app_config: gBundle.app_config,
                                    page_config: gBundle.page_config
                                });
                            }
                            resolve(((gBundle.editMode && editorView())
                                ||
                                    new glitter.htmlGenerate(gBundle.config, [], gBundle.data, true).render(gvc, {
                                        class: ``,
                                        style: ``,
                                        app_config: gBundle.app_config,
                                        page_config: gBundle.page_config,
                                        is_page: true
                                    })));
                        }
                    }));
                },
                divCreate: {
                    class: glitter.htmlGenerate.styleEditor(gBundle.page_config).class() + ' d-none',
                    style: `overflow-x:hidden;min-height: 100%;min-width: 100%;${glitter.htmlGenerate.styleEditor(gBundle.page_config).style()}`
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
                    setTimeout(() => {
                        document.querySelector(`[gvc-id='${gvc.id(mainId)}']`).classList.remove('d-none');
                    }, 20);
                }
            }));
            return map.join('');
        }
    };
});
