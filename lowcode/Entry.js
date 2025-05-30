'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from './config.js';
import { ApiPageConfig } from './api/pageConfig.js';
import { BaseApi } from './glitterBundle/api/base.js';
import { GlobalUser } from './glitter-base/global/global-user.js';
import { EditorConfig } from './editor-config.js';
import { ShareDialog } from './glitterBundle/dialog/ShareDialog.js';
import { Language } from './glitter-base/global/language.js';
import { PayConfig } from './cms-plugin/pos-pages/pay-config.js';
import { ApiCart } from './glitter-base/route/api-cart.js';
import { ApiUser } from './glitter-base/route/user.js';
import { ApplicationConfig } from './application-config.js';
import { TriggerEvent } from './glitterBundle/plugins/trigger-event.js';
import { Ad } from './public-components/public/ad.js';
export class Entry {
    static onCreate(glitter) {
        glitter.share.ad = Ad;
        glitter.share.TriggerEvent = TriggerEvent;
        glitter.share.PayConfig = PayConfig;
        config.url = location.origin;
        window.glitterBackend = location.origin;
        const originalReplaceState = history.replaceState;
        let last_replace = '';
        window.history.replaceState = function (data, unused, url) {
            if (last_replace !== url) {
                last_replace = `${url}`;
                return originalReplaceState.apply(history, arguments);
            }
        };
        window.history.pushState({}, glitter.document.title, location.href);
        function next() {
            var _a, _b;
            if (glitter.getUrlParameter('EndCheckout') === '1') {
                try {
                    const lineItemIds = JSON.parse(localStorage.getItem('clear_cart_items'));
                    const cartKeys = [ApiCart.cartPrefix, ApiCart.buyItNow, ApiCart.globalCart];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && cartKeys.some(cartKey => key === null || key === void 0 ? void 0 : key.includes(cartKey))) {
                            const formatKey = key === null || key === void 0 ? void 0 : key.replace(window.appName, '');
                            const cart = new ApiCart(formatKey);
                            cart.setCart(cartItem => {
                                cartItem.line_items = cartItem.line_items.filter(item => !lineItemIds.includes(item.id));
                            });
                        }
                    }
                    localStorage.removeItem('clear_cart_items');
                }
                catch (e) { }
            }
            glitter.share.ApiCart = ApiCart;
            glitter.share.ApiUser = ApiUser;
            const clock = glitter.ut.clock();
            const hashLoop = setInterval(() => {
                try {
                    if (document.querySelector(`${location.hash}`)) {
                        location.href = `${location.hash}`;
                        clearInterval(hashLoop);
                        const clock2 = glitter.ut.clock();
                        const interVal = setInterval(() => {
                            location.href = `${location.hash}`;
                            if (clock2.stop() > 2000) {
                                clearInterval(interVal);
                            }
                        }, 100);
                    }
                    else if (clock.stop() > 5000) {
                        clearInterval(hashLoop);
                    }
                }
                catch (e) {
                    clearInterval(hashLoop);
                }
            }, 100);
            window.store_info.web_type = (_a = window.store_info.web_type) !== null && _a !== void 0 ? _a : ['shop'];
            const shopp = localStorage.getItem('shopee');
            if (shopp) {
                localStorage.removeItem('shopee');
                localStorage.setItem('shopeeCode', JSON.stringify({
                    code: glitter.getUrlParameter('code'),
                    shop_id: glitter.getUrlParameter('shop_id'),
                }));
                location.href = shopp;
                return;
            }
            if (window.language !== Language.getLanguage()) {
                const url = new URL(`${glitter.root_path}${Language.getLanguageLinkPrefix()}${window.glitter_page}${new URL(location.href).search}`);
                if (glitter.getUrlParameter('appName')) {
                    url.searchParams.set('appName', glitter.getUrlParameter('appName'));
                }
                location.href = url.href;
                return;
            }
            glitter.share.reload = (page, app_name) => {
                window.appName = app_name || window.appName;
                window.glitter_page = page;
                location.reload();
            };
            glitter.share.updated_form_data = {};
            glitter.share.top_inset = 0;
            glitter.share.bottom_inset = 0;
            glitter.share.reload_code_hash = function () {
                const hashCode = window.preloadData.eval_code_hash || {};
                Object.keys(hashCode).map(dd => {
                    if (typeof hashCode[dd] === 'string') {
                        try {
                            hashCode[dd] = new Function(`return {
              execute:(gvc,widget,object,subData,element,window,document,glitter,$)=>{
                return (() => { ${hashCode[dd]} })()
              }
            }`)().execute;
                        }
                        catch (e) {
                            console.error(`reload_code_hash error: ` + e);
                        }
                    }
                });
            };
            glitter.share.reload_code_hash();
            glitter.share.editor_util = { baseApi: BaseApi };
            glitter.page = window.glitter_page;
            glitter.share.GlobalUser = GlobalUser;
            if (glitter.getUrlParameter('page') !== 'backend_manager') {
                Entry.checkRedirectPage(glitter);
            }
            glitter.share.logID = glitter.getUUID();
            glitter.addStyle(`
      @media (prefers-reduced-motion: no-preference) {
        :root {
          scroll-behavior: auto !important;
        }
      }
      .hide-elem {
        display: none !important;
      }
      .hy-drawer-left {
        left: -1000px !important;
      }
    `);
            if (glitter.getUrlParameter('appName')) {
                window.appName = glitter.getUrlParameter('appName');
            }
            window.renderClock = (_b = window.renderClock) !== null && _b !== void 0 ? _b : createClock();
            console.log(`Entry-time:`, window.renderClock.stop());
            glitter.share.editerVersion = 'V_22.0.5';
            glitter.share.start = new Date();
            const vm = { appConfig: [] };
            window.saasConfig = {
                config: (window.config = config),
                api: ApiPageConfig,
                appConfig: undefined,
            };
            config.token = GlobalUser.saas_token;
            Entry.resourceInitial(glitter, vm, (dd) => __awaiter(this, void 0, void 0, function* () {
                glitter.addStyle(`
        ${parseInt(window.parent.glitter.share.bottom_inset, 10)
                    ? `
                .update-bar-container {
                  padding-bottom: ${window.parent.glitter.share.bottom_inset}px !important;
                }
              `
                    : ``}

        .editorParent .editorChild {
          display: none;
        }

        .editorChild::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 99999;
        }

        .editorParent:hover > .editorChild {
          display: block;
          border: 2px dashed #ffb400;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .editor_item.active {
          background: #ddd;
        }

        .editorItemActive {
          display: block !important;
          border: 2px solid #ffb400 !important;
          z-index: 99999;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          position: absolute;
        }

        .editorItemActive > .badge_it {
          display: flex;
        }

        .editorItemActive > .plus_btn {
          display: none;
        }

        .editorParent:hover > .editorChild > .plus_btn {
          display: block !important;
        }

        .badge_it {
          display: none;
        }

        .relativePosition {
          position: relative;
        }
        .sel_normal {
          cursor: pointer;
          border-radius: 7px;
          border: 1px solid #ddd;
          padding: 2px 14px;
          background: #fff;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
        }

        ul {
          list-style: none;
        }
        li {
          list-style: none;
        }
      `);
                yield Entry.globalStyle(glitter, dd);
                if (glitter.getUrlParameter('type') === 'editor') {
                    const dialog = new ShareDialog(glitter);
                    dialog.dataLoading({ visible: true, text: '後台載入中' });
                    Entry.toBackendEditor(glitter, () => { });
                }
                else if (glitter.getUrlParameter('type') === 'htmlEditor') {
                    Entry.toHtmlEditor(glitter, vm, () => Entry.checkIframe(glitter));
                }
                else if (glitter.getUrlParameter('page') === 'backend_manager') {
                    if (!GlobalUser.token) {
                        glitter.setUrlParameter('page', 'login');
                        location.reload();
                    }
                    else {
                        try {
                            const appList = (yield ApiPageConfig.getAppList(undefined, GlobalUser.token)).response.result;
                            localStorage.setItem('select_item', '0');
                            if (appList.length === 0) {
                                glitter.getModule(new URL('./view-model/saas-view-model.js', location.href).href, SaasViewModel => {
                                    glitter.innerDialog(gvc => {
                                        return gvc.bindView(() => {
                                            return {
                                                bind: gvc.glitter.getUUID(),
                                                view: () => SaasViewModel.createShop(gvc, true),
                                            };
                                        });
                                    }, 'change_app');
                                });
                            }
                            else {
                                let appName = appList[0].appName;
                                if (appList.find((dd) => dd.appName === localStorage.getItem('select_app_name'))) {
                                    appName = localStorage.getItem('select_app_name');
                                }
                                glitter.setUrlParameter('page', 'index');
                                glitter.setUrlParameter('type', 'editor');
                                glitter.setUrlParameter('appName', appName);
                                glitter.setUrlParameter('function', 'backend-manger');
                                location.reload();
                            }
                        }
                        catch (e) {
                            console.error(e);
                            glitter.setUrlParameter('page', 'login');
                            location.reload();
                        }
                    }
                }
                else {
                    Entry.toNormalRender(glitter, vm, () => Entry.checkIframe(glitter));
                }
            }));
            glitter.share.LanguageApi = Language;
            glitter.share.plan_text = () => GlobalUser.getPlan().title;
            window.addEventListener('resize', () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                for (const b of document.querySelectorAll(`.glitter-dialog`)) {
                    b.style.height = `${height}px`;
                    b.style.minHeight = `${height}px`;
                }
                console.log(`視窗大小變化: 寬度=${width}px, 高度=${height}px`);
            });
        }
        if ((window.parent.glitter.getUrlParameter('device') === 'mobile')) {
            glitter.share.is_application = true;
            next();
        }
        else {
            if (glitter.deviceType === glitter.deviceTypeEnum.Web) {
                next();
            }
            else {
                glitter.runJsInterFace('is_application', {}, res => {
                    glitter.share.is_application = res.is_application;
                    if (glitter.share.is_application) {
                        ApplicationConfig.is_application = res.is_application;
                        ApplicationConfig.bundle_id = res.bundle_id;
                        ApplicationConfig.device_type = res.device_type;
                        ApplicationConfig.initial(glitter);
                        if (res.redirect) {
                            glitter.href = res.redirect;
                        }
                        window.is_application = true;
                    }
                    next();
                });
            }
        }
        Entry.checkSeoInfo(glitter);
    }
    static checkSeoInfo(glitter) {
        var _a, _b, _c;
        glitter.share.last_seo_config = (_a = glitter.share.last_seo_config) !== null && _a !== void 0 ? _a : {
            title: document.title,
            description: (_b = document.querySelector('meta[name="description"]')) === null || _b === void 0 ? void 0 : _b.getAttribute('content'),
            ogImage: (_c = document.querySelector('meta[property="og:image"]')) === null || _c === void 0 ? void 0 : _c.getAttribute('content')
        };
        window.glitterInitialHelper.getPageData(glitter.getUrlParameter('page'), (data) => {
            var _a, _b;
            if ((data.response.seo_config && (data.response.seo_config.title && data.response.seo_config.content)) && ([data.response.seo_config.title, data.response.seo_config.content].join('') !== [
                glitter.share.last_seo_config.title,
                glitter.share.last_seo_config.description,
            ].join(''))) {
                glitter.share.last_seo_config.title = data.response.seo_config.title;
                glitter.share.last_seo_config.description = data.response.seo_config.content;
                (_a = document.querySelector('meta[name="description"]')) === null || _a === void 0 ? void 0 : _a.setAttribute('content', data.response.seo_config.content);
                (_b = document.querySelector('meta[name="og:description"]')) === null || _b === void 0 ? void 0 : _b.setAttribute('content', data.response.seo_config.content);
                document.title = data.response.seo_config.title;
            }
            setTimeout(() => {
                Entry.checkSeoInfo(glitter);
            }, 500);
        });
    }
    static checkIframe(glitter) {
        if (glitter.getUrlParameter('isIframe') === 'true') {
            console.log('checkIframe:' + glitter.share.logID);
            glitter.goBack = window.parent.glitter.goBack;
            setInterval(() => {
                window.parent.glitter.share.iframeHeightChange[glitter.getUrlParameter('iframe_id')](document.body.scrollHeight);
                $(`body`).height(`${document.body.scrollHeight}px`);
            }, 100);
            glitter.addStyle(`
        html,
        body {
          overflow: hidden !important;
        }
      `);
        }
        else {
            glitter.addStyle(`
        html,
        body {
          height: 100vh !important;
        }
      `);
        }
    }
    static toBackendEditor(glitter, callback) {
        glitter.addStyle(`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
      @media (prefers-reduced-motion: no-preference) {
        :root {
          scroll-behavior: auto !important;
        }
      }

      ::-webkit-scrollbar {
        width: 0; /* 滚动条宽度 */
        height: 0;
      }
    `);
        glitter.share.EditorMode = true;
        glitter.share.evalPlace = (evals) => eval(evals);
        function running() {
            return __awaiter(this, void 0, void 0, function* () {
                glitter.addStyleLink([
                    'assets/vendor/boxicons/css/boxicons.min.css',
                    'assets/css/theme.css',
                    'css/editor.css',
                    'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css',
                    'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/monolith.min.css',
                    'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css',
                ]);
                yield new Promise(resolve => {
                    glitter.addMtScript([
                        'jslib/pickr.min.js',
                        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
                        'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                        'assets/vendor/swiper/swiper-bundle.min.js',
                        'assets/js/theme.min.js',
                        `${glitter.root_path}/jslib/lottie-player.js`,
                    ], () => resolve(true), () => resolve(true));
                });
                return;
            });
        }
        window.mode = 'light';
        window.root = document.getElementsByTagName('html')[0];
        window.root.classList.add('light-mode');
        function toNext() {
            console.log(`to-next-time:`, window.renderClock.stop());
            running().then(() => __awaiter(this, void 0, void 0, function* () {
                {
                    console.log(`to-page-time:`, window.renderClock.stop());
                    let data = yield ApiPageConfig.getPage({
                        appName: config.appName,
                        tag: glitter.getUrlParameter('page'),
                    });
                    if (data.response.result.length === 0 && glitter.getUrlParameter('page') !== 'cms') {
                        glitter.setUrlParameter('page', data.response.redirect);
                    }
                    glitter.addStyle(`
            .page-box {
              min-height: ${window.innerHeight}px !important;
            }
          `);
                    if (localStorage.getItem('on-pos') === 'true' &&
                        glitter.getUrlParameter('page') !== 'pos' &&
                        glitter.getUrlParameter('type') === 'editor') {
                        localStorage.removeItem('on-pos');
                        location.href = glitter.root_path + 'pos?app-id=' + window.appName;
                    }
                    else {
                        glitter.setHome('jspage/main.js', glitter.getUrlParameter('page'), {
                            appName: config.appName,
                        }, {
                            backGroundColor: `transparent;`,
                        });
                    }
                }
            }));
        }
        BaseApi.create({
            url: config.url + `/api/v1/user/checkToken`,
            type: 'GET',
            timeout: 0,
            headers: {
                'Content-Type': 'application/json',
                Authorization: GlobalUser.saas_token,
            },
        }).then(d2 => {
            if (!d2.result) {
                const url = new URL(glitter.location.href);
                location.href = `${url.origin}/${window.glitterBase}/login`;
            }
            else {
                toNext();
            }
        });
    }
    static toHtmlEditor(glitter, vm, callback) {
        var _a;
        window.preloadData.eval_code_hash = window.parent.preloadData.eval_code_hash;
        glitter.share.reload_code_hash();
        glitter.addMtScript([
            {
                src: 'https://kit.fontawesome.com/cccedec0f8.js',
            },
        ], () => { }, () => { });
        glitter.addStyle(`
      @media (prefers-reduced-motion: no-preference) {
        :root {
          scroll-behavior: auto !important;
        }
      }
    `);
        window.parent.glitter.share.editerGlitter = glitter;
        const clock = glitter.ut.clock();
        function scrollToItem(element) {
            if (element) {
                element.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                });
            }
        }
        const interVal = setInterval(() => {
            if (document.querySelector('.editorItemActive')) {
                scrollToItem(document.querySelector('.editorItemActive'));
            }
            if (clock.stop() > 2000) {
                clearInterval(interVal);
            }
        });
        window.parent.glitter.share.evalPlace = (evals) => eval(evals);
        glitter.addMtScript(window.parent.editerData.setting.map((dd) => {
            return {
                src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                type: 'module',
            };
        }), () => { }, () => { }, [{ key: 'async', value: 'true' }]);
        glitter.htmlGenerate.loadScript(glitter, window.parent.editerData.setting
            .filter((dd) => {
            return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
        })
            .map((dd) => {
            return {
                src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                type: 'module',
            };
        }));
        glitter.share.evalPlace = (evals) => eval(evals);
        setTimeout(() => {
            window.parent.glitter.share.loading_dialog.dataLoading({
                text: '',
                visible: false,
            });
        }, 2000);
        glitter.htmlGenerate.setHome({
            app_config: vm.appConfig,
            page_config: (_a = window.parent.page_config) !== null && _a !== void 0 ? _a : {},
            get config() {
                return window.parent.editerData.setting;
            },
            get editMode() {
                return window.parent.editerData;
            },
            data: {},
            tag: window.parent.glitter.getUrlParameter('page'),
        });
        callback();
    }
    static toNormalRender(glitter, vm, callback) {
        if (['hidden/', 'shop/', 'pages/'].find((dd) => {
            return (glitter.getUrlParameter('page') || '').startsWith(dd) || ((glitter.getUrlParameter('page_refer') || '').startsWith(dd));
        })) {
            const og_path = glitter.getUrlParameter('page_refer') || glitter.getUrlParameter('page');
            window.page_refer = og_path;
            (glitter.share).is_shop = true;
        }
        ApiUser.getUserData(GlobalUser.token, 'me').then((r) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!r.result) {
                    GlobalUser.token = '';
                }
                else {
                    GlobalUser.userInfo = r.response;
                    GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response));
                }
            }
            catch (e) {
            }
        }));
        glitter.addStyleLink([`https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css`]);
        glitter.addMtScript([
            {
                src: `${glitter.root_path}/jslib/lottie-player.js`,
            },
        ], () => { }, () => { });
        if (glitter.getUrlParameter('token') && glitter.getUrlParameter('return_type') === 'resetPassword') {
            GlobalUser.token = glitter.getUrlParameter('token');
            glitter.setUrlParameter('token');
            glitter.setUrlParameter('return_type');
        }
        if (GlobalUser.token) {
            GlobalUser.registerFCM(GlobalUser.token);
        }
        glitter.share.evalPlace = (evals) => eval(evals);
        console.log(`exePlugin-time:`, window.renderClock.stop());
        window.glitterInitialHelper.getPageData(glitter.getUrlParameter('page'), (data) => {
            console.log(`getPageData-time:`, window.renderClock.stop());
            if (data.response.result.length === 0) {
                const url = new URL('./', location.href);
                url.searchParams.set('page', data.response.redirect);
                if (glitter.getUrlParameter('appName')) {
                    url.searchParams.set('appName', glitter.getUrlParameter('appName'));
                }
                if (glitter.getUrlParameter('function')) {
                    url.searchParams.set('function', glitter.getUrlParameter('function'));
                }
                if (data.response.redirect) {
                    location.href = url.href;
                }
                return;
            }
            glitter.htmlGenerate.loadScript(glitter, data.response.result[0].config
                .filter((dd) => {
                return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
            })
                .map((dd) => {
                return {
                    src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
                    callback: () => { },
                };
            }));
            function authPass() {
                function next() {
                    glitter.htmlGenerate.setHome({
                        app_config: vm.appConfig,
                        page_config: data.response.result[0].page_config,
                        config: data.response.result[0].config,
                        data: {},
                        tag: glitter.getUrlParameter('page'),
                    });
                    callback();
                }
                const login_config = window.login_config;
                if (login_config.password_to_see && localStorage.getItem('password_to_see') !== login_config.shop_pwd) {
                    const pwd = window.prompt('請輸入網站密碼', '');
                    localStorage.setItem('password_to_see', pwd !== null && pwd !== void 0 ? pwd : '');
                    if (login_config.shop_pwd === pwd) {
                        next();
                    }
                    else {
                        glitter.closeDiaLog();
                        const dialog = new ShareDialog(glitter);
                        dialog.checkYesOrNot({
                            text: '網站密碼輸入錯誤',
                            callback: () => {
                                authPass();
                            },
                        });
                    }
                }
                else {
                    next();
                }
            }
            function authError(message) {
                glitter.addStyleLink(['assets/vendor/boxicons/css/boxicons.min.css', 'assets/css/theme.css', 'css/editor.css']);
                glitter.setHome('jspage/alert.js', glitter.getUrlParameter('page'), message, {
                    backGroundColor: `transparent;`,
                });
            }
            if (window.memberType !== 'noLimit' &&
                vm.appConfig.dead_line &&
                new Date(vm.appConfig.dead_line).getTime() < new Date().getTime() &&
                (!vm.appConfig.refer_app || vm.appConfig.refer_app === vm.appConfig.appName)) {
                authError('使用權限已過期，請前往後台執行續費。');
            }
            else {
                authPass();
            }
        });
    }
    static resourceInitial(glitter, vm, callback) {
        glitter.share.PayConfig = PayConfig;
        glitter.runJsInterFace('pos-device', {}, res => {
            console.log(`res.deviceType=>`, res.deviceType);
            PayConfig.deviceType = ['SUNMI', 'neostra'].includes(res.deviceType) ? 'pos' : 'web';
            PayConfig.posType = res.deviceType;
            if (res.deviceType === 'neostra') {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mui/3.7.1/js/mui.min.js';
                script.integrity =
                    'sha512-5LSZkoyayM01bXhnlp2T6+RLFc+dE4SIZofQMxy/ydOs3D35mgQYf6THIQrwIMmgoyjI+bqjuuj4fQcGLyJFYg==';
                script.referrerPolicy = 'no-referrer';
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
                glitter.addMtScript([
                    'https://oss-sg.imin.sg/web/iMinPartner/js/imin-printer.min.js',
                    'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
                    glitter.root_path + 'jslib/qrcode-d.js',
                ], () => { }, () => { });
                setTimeout(() => {
                    window.IminPrintInstance = new IminPrinter();
                    window.IminPrintInstance.connect();
                }, 3000);
            }
            if (res.deviceType === 'SUNMI') {
                glitter.addMtScript([
                    'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
                    glitter.root_path + 'jslib/qrcode-d.js',
                ], () => { }, () => { });
            }
        });
        glitter.runJsInterFace('getTopInset', {}, (response) => {
            glitter.share.top_inset = parseInt(response.data, 10);
        }, {
            webFunction: () => {
                return { data: 0 };
            },
        });
        glitter.runJsInterFace('getBottomInset', {}, (response) => {
            glitter.share.bottom_inset = parseInt(response.data, 10);
        }, {
            webFunction: () => {
                return { data: 0 };
            },
        });
        window.glitterInitialHelper.getPlugin((dd) => {
            var _a, _b, _c, _d, _e;
            console.log(`getPlugin-time:`, window.renderClock.stop());
            window.saasConfig.appConfig = dd.response.data;
            GlobalUser.language = GlobalUser.language || navigator.language;
            vm.appConfig = dd.response.data;
            glitter.share.appConfigresponse = dd;
            glitter.share.globalValue = {};
            glitter.share.globalStyle = {};
            const config = glitter.share.appConfigresponse.response.data;
            config.color_theme = (_a = config.color_theme) !== null && _a !== void 0 ? _a : [];
            config.container_theme = (_b = config.container_theme) !== null && _b !== void 0 ? _b : [];
            config.font_theme = (_c = config.font_theme) !== null && _c !== void 0 ? _c : [];
            config.globalValue = (_d = config.globalValue) !== null && _d !== void 0 ? _d : [];
            config.globalStyleTag = (_e = config.globalStyleTag) !== null && _e !== void 0 ? _e : [];
            config.color_theme.map((dd, index) => {
                EditorConfig.color_setting_config.map(d2 => {
                    glitter.share.globalValue[`theme_color.${index}.${d2.key}`] = dd[d2.key];
                });
            });
            glitter.share.font_theme = config.font_theme;
            glitter.share.global_container_theme = config.container_theme;
            glitter.share.initial_fonts = [];
            if (glitter.share.font_theme[0]) {
                glitter.addStyle(`
          @charset "UTF-8";
          ${glitter.share.font_theme
                    .map((dd) => {
                    glitter.share.initial_fonts.push(dd.value);
                    return `@import url('https://fonts.googleapis.com/css2?family=${dd.value}&display=swap');`;
                })
                    .join('\n')}
          body {
            font-family: '${glitter.share.font_theme[0].value}' !important;
            font-optical-sizing: auto;
            font-style: normal;
            color: #393939;
          }
        `);
            }
            function loopCheckGlobalValue(array, tag) {
                try {
                    array.map((dd) => {
                        if (dd.type === 'container') {
                            loopCheckGlobalValue(dd.data.setting, tag);
                        }
                        else {
                            if (dd.data.tagType === 'language') {
                                if (dd.data.value.length > 0) {
                                    glitter.share[tag][dd.data.tag] = (dd.data.value.find((dd) => {
                                        return dd.lan.toLowerCase().indexOf(GlobalUser.language.toLowerCase()) !== -1;
                                    }) || dd.data.value[0]).text;
                                }
                            }
                            else {
                                glitter.share[tag][dd.data.tag] = dd.data.value;
                            }
                        }
                    });
                }
                catch (e) {
                    console.error(e);
                }
            }
            if (glitter.getUrlParameter('type') === 'htmlEditor') {
                loopCheckGlobalValue(window.parent.glitter.share.editorViewModel.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue(window.parent.glitter.share.editorViewModel.globalValue, 'globalValue');
            }
            else {
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalStyleTag, 'globalStyle');
                loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalValue, 'globalValue');
            }
            callback(dd);
        });
    }
    static globalStyle(glitter, dd) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            function loopVersion() {
                ApiPageConfig.getGlitterVersion().then(res => {
                    console.log('glitterVersion:', res.response.result);
                    if (res.result && !glitter.share.editerVersion.includes(res.response.result)) {
                        const dialog = new ShareDialog(glitter);
                        dialog.checkYesOrNot({
                            text: '新版本已發佈，是否進行更新?',
                            callback: response => {
                                if (response) {
                                    location.reload();
                                }
                                else {
                                    setTimeout(() => {
                                        loopVersion();
                                    }, 1000 * 300);
                                }
                            },
                        });
                    }
                    else {
                        setTimeout(() => {
                            loopVersion();
                        }, 1000 * 300);
                    }
                });
            }
            if (glitter.getUrlParameter('type') === 'editor' || glitter.getUrlParameter('page') === 'pos') {
                setTimeout(() => {
                    loopVersion();
                }, 1000 * 300);
            }
            let countI = dd.response.data.initialList.length;
            const vm = {
                get count() {
                    return countI;
                },
                set count(v) {
                    countI = v;
                    if (countI === 0) {
                        resolve(true);
                    }
                },
            };
            for (const data of (_a = dd.response.data.initialList) !== null && _a !== void 0 ? _a : []) {
                try {
                    if (data.type === 'script') {
                        const url = new URL(glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(data.src.link)));
                        glitter.share.callBackList = (_b = glitter.share.callBackList) !== null && _b !== void 0 ? _b : {};
                        const callbackID = glitter.getUUID();
                        url.searchParams.set('callback', callbackID);
                        glitter.share.callBackList[callbackID] = () => {
                            vm.count--;
                        };
                        glitter.addMtScript([
                            {
                                src: url.href,
                                type: 'module',
                            },
                        ], () => {
                            vm.count--;
                        }, () => {
                            vm.count--;
                        });
                    }
                    else {
                        vm.count--;
                    }
                }
                catch (e) {
                    console.error(e);
                    vm.count--;
                }
            }
            if (countI === 0) {
                resolve(true);
            }
        }));
    }
    static checkRedirectPage(glitter) {
        const url = new URL(location.href);
        if (url.searchParams.get('state') === 'google_login' && glitter.getUrlParameter('page') !== 'backend_manager') {
            glitter.setUrlParameter('page', 'login');
        }
    }
}
const createClock = () => {
    let startTime = Date.now();
    return {
        start: startTime,
        stop: function () {
            return Date.now() - startTime;
        },
        zeroing: function () {
            startTime = Date.now();
            this.start = startTime;
        },
    };
};
