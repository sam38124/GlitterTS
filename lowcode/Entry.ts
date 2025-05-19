'use strict';
import { Glitter } from './glitterBundle/Glitter.js';
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

export class Entry {
  // 建立初始函式
  public static onCreate(glitter: Glitter) {
    //設定後端路徑API
    config.url=location.origin;
    (window as any).glitterBackend=location.origin;
    const originalReplaceState = history.replaceState;
    let last_replace='';
    window.history.replaceState = function(data: any, unused: string, url?: string | URL | null) {
      if(last_replace!==url){
        last_replace=`${url}`

        //@ts-ignore
        return originalReplaceState.apply(history, arguments);
      }
    };
    //進入時就要提供堆棧，避免頁面返回問題
    window.history.pushState({}, glitter.document.title,location.href);
    function next(){
      //判斷結帳成功清空購物車紀錄
      if (glitter.getUrlParameter('EndCheckout') === '1') {
        try {
          const lineItemIds = JSON.parse(localStorage.getItem('clear_cart_items') as string);
          const cartKeys = [ApiCart.cartPrefix, ApiCart.buyItNow, ApiCart.globalCart];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && cartKeys.some(cartKey => key?.includes(cartKey))) {
              const formatKey = key?.replace((window as any).appName, '');
              const cart = new ApiCart(formatKey);
              cart.setCart(cartItem => {
                cartItem.line_items = cartItem.line_items.filter(item => !lineItemIds.includes(item.id));
              });
            }
          }
          localStorage.removeItem('clear_cart_items');
        } catch (e) {}
      }
      //設定API Cart
      glitter.share.ApiCart = ApiCart;
      //設定API USER
      glitter.share.ApiUser = ApiUser;
      //判斷是否有hash則跳轉
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
          } else if (clock.stop() > 5000) {
            clearInterval(hashLoop);
          }
        } catch (e) {
          clearInterval(hashLoop);
        }
      }, 100);
      //預設為購物網站
      (window as any).store_info.web_type = (window as any).store_info.web_type ?? ['shop'];
      const shopp = localStorage.getItem('shopee');
      if (shopp) {
        localStorage.removeItem('shopee');
        localStorage.setItem(
          'shopeeCode',
          JSON.stringify({
            code: glitter.getUrlParameter('code'),
            shop_id: glitter.getUrlParameter('shop_id'),
          })
        );
        location.href = shopp;
        return;
      }
      if ((window as any).language !== Language.getLanguage()) {
        const url = new URL(
          `${glitter.root_path}${Language.getLanguageLinkPrefix()}${(window as any).glitter_page}${new URL(location.href).search}`
        );
        if (glitter.getUrlParameter('appName')) {
          url.searchParams.set('appName', glitter.getUrlParameter('appName'));
        }
        location.href = url.href;
        return;
      }
      glitter.share.reload = (page: string, app_name: string) => {
        (window as any).appName = app_name || (window as any).appName;
        (window as any).glitter_page = page;
        location.reload();
      };
      glitter.share.updated_form_data = {};
      glitter.share.top_inset = 0;
      glitter.share.bottom_inset = 0;
      glitter.share.reload_code_hash = function () {
        const hashCode = (window as any).preloadData.eval_code_hash || {};
        Object.keys(hashCode).map(dd => {
          if (typeof hashCode[dd] === 'string') {
            try {
              hashCode[dd] = new Function(`return {
              execute:(gvc,widget,object,subData,element,window,document,glitter,$)=>{
                return (() => { ${hashCode[dd]} })()
              }
            }`)().execute;
            } catch (e) {
              console.error(`reload_code_hash error: ` + e);
            }
          }
        });
      };
      glitter.share.reload_code_hash();
      glitter.share.editor_util = { baseApi: BaseApi };
      glitter.page = (window as any).glitter_page;
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
        (window as any).appName = glitter.getUrlParameter('appName');
      }
      (window as any).renderClock = (window as any).renderClock ?? createClock();
      console.log(`Entry-time:`, (window as any).renderClock.stop());
      glitter.share.editerVersion = 'V_21.7.0';
      glitter.share.start = new Date();
      const vm = { appConfig: [] };
      (window as any).saasConfig = {
        config: ((window as any).config = config),
        api: ApiPageConfig,
        appConfig: undefined,
      };
      // 設定SAAS管理員請求API
      config.token = GlobalUser.saas_token;
      // 資源初始化
      Entry.resourceInitial(glitter, vm, async dd => {
        glitter.addStyle(`
        ${
          parseInt((window.parent as any).glitter.share.bottom_inset, 10)
            ? `
                .update-bar-container {
                  padding-bottom: ${(window.parent as any).glitter.share.bottom_inset}px !important;
                }
              `
            : ``
        }

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
        // 載入全域資源
        await Entry.globalStyle(glitter, dd);
        if (glitter.getUrlParameter('type') === 'editor') {
          const dialog = new ShareDialog(glitter);
          dialog.dataLoading({ visible: true, text: '後台載入中' });
          // 頁面編輯器
          Entry.toBackendEditor(glitter, () => {});
        } else if (glitter.getUrlParameter('type') === 'htmlEditor') {
          // Iframe預覽區塊
          Entry.toHtmlEditor(glitter, vm, () => Entry.checkIframe(glitter));
        } else if (glitter.getUrlParameter('page') === 'backend_manager') {
          if (!GlobalUser.token) {
            glitter.setUrlParameter('page', 'login');
            location.reload();
          } else {
            try {
              const appList = (await ApiPageConfig.getAppList(undefined, GlobalUser.token)).response.result;
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
              } else {
                let appName = appList[0].appName;
                if (appList.find((dd: any) => dd.appName === localStorage.getItem('select_app_name'))) {
                  appName = localStorage.getItem('select_app_name');
                }
                glitter.setUrlParameter('page', 'index');
                glitter.setUrlParameter('type', 'editor');
                glitter.setUrlParameter('appName', appName);
                glitter.setUrlParameter('function', 'backend-manger');
                location.reload();
              }
            } catch (e) {
              console.error(e);
              glitter.setUrlParameter('page', 'login');
              location.reload();
            }
          }
        } else {
          // 一般頁面
          Entry.toNormalRender(glitter, vm, () => Entry.checkIframe(glitter));
        }
      });
      glitter.share.LanguageApi = Language;
      //當前方案
      glitter.share.plan_text = () => GlobalUser.getPlan().title;
      // 監聽視窗大小變化
      window.addEventListener('resize', () => {
        const width = window.innerWidth; // 視窗的寬度
        const height = window.innerHeight; // 視窗的高度
        for (const b of document.querySelectorAll(`.glitter-dialog`)) {
          (b as any).style.height = `${height}px`;
          (b as any).style.minHeight = `${height}px`;
        }
        console.log(`視窗大小變化: 寬度=${width}px, 高度=${height}px`);
      });
    }
    if (((window.parent as any).glitter.getUrlParameter('device') === 'mobile')) {
      glitter.share.is_application = true;
      next()
    } else {
      if(glitter.deviceType===glitter.deviceTypeEnum.Web){
        //網頁版本
        next()
      }else{
        //APP應用程式
        glitter.runJsInterFace('is_application', {}, res => {
          glitter.share.is_application = res.is_application;
          if (glitter.share.is_application) {
            ApplicationConfig.is_application = res.is_application;
            ApplicationConfig.bundle_id = res.bundle_id;
            ApplicationConfig.device_type = res.device_type;
            ApplicationConfig.initial(glitter)
            if(res.redirect){
              glitter.href = res.redirect;
            }
            (window as any).is_application=true;
          }
          next()
        })
      }
    }
    Entry.checkSeoInfo(glitter)
  }

  //定期確認SEO資訊並更新
  public static checkSeoInfo(glitter:Glitter){
    glitter.share.last_seo_config=glitter.share.last_seo_config ?? {
      title:document.title,
      description:document.querySelector('meta[name="description"]')?.getAttribute('content'),
      ogImage:document.querySelector('meta[property="og:image"]')?.getAttribute('content')
    };
    (window as any).glitterInitialHelper.getPageData(glitter.getUrlParameter('page'), (data: any) => {
      if((data.response.seo_config && (data.response.seo_config.title && data.response.seo_config.content)) && ([data.response.seo_config.title,data.response.seo_config.content].join('') !== [
        glitter.share.last_seo_config.title,
        glitter.share.last_seo_config.description,
      ].join(''))){
        glitter.share.last_seo_config.title=data.response.seo_config.title;
        glitter.share.last_seo_config.description=data.response.seo_config.content;
        document.querySelector('meta[name="description"]')?.setAttribute('content',data.response.seo_config.content);
        document.querySelector('meta[name="og:description"]')?.setAttribute('content',data.response.seo_config.content);
        document.title=data.response.seo_config.title;
      }
      setTimeout(()=>{
        Entry.checkSeoInfo(glitter)
      },500)
    })
  }

  // 判斷是否為 Iframe 來覆寫 Glitter 代碼
  public static checkIframe(glitter: Glitter) {
    if (glitter.getUrlParameter('isIframe') === 'true') {
      console.log('checkIframe:' + glitter.share.logID);
      glitter.goBack = (window.parent as any).glitter.goBack;
      setInterval(() => {
        (window.parent as any).glitter.share.iframeHeightChange[glitter.getUrlParameter('iframe_id')](
          document.body.scrollHeight
        );
        $(`body`).height(`${document.body.scrollHeight}px`);
      }, 100);
      glitter.addStyle(`
        html,
        body {
          overflow: hidden !important;
        }
      `);
    } else {
      glitter.addStyle(`
        html,
        body {
          height: 100vh !important;
        }
      `);
    }
  }

  // 跳轉至頁面編輯器
  public static toBackendEditor(glitter: Glitter, callback: () => void) {
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
    glitter.share.evalPlace = (evals: string) => eval(evals);

    async function running() {
      glitter.addStyleLink([
        'assets/vendor/boxicons/css/boxicons.min.css',
        'assets/css/theme.css',
        'css/editor.css',
        'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css',
        'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/monolith.min.css',
        'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css',
      ]);
      await new Promise(resolve => {
        glitter.addMtScript(
          [
            'jslib/pickr.min.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
            'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
            'assets/vendor/swiper/swiper-bundle.min.js',
            'assets/js/theme.min.js',
            `${glitter.root_path}/jslib/lottie-player.js`,
          ],
          () => resolve(true),
          () => resolve(true)
        );
      });
      return;
    }

    (window as any).mode = 'light';
    (window as any).root = document.getElementsByTagName('html')[0];
    (window as any).root.classList.add('light-mode');

    function toNext() {
      console.log(`to-next-time:`, (window as any).renderClock.stop());
      running().then(async () => {
        {
          console.log(`to-page-time:`, (window as any).renderClock.stop());
          let data = await ApiPageConfig.getPage({
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

          if (
            localStorage.getItem('on-pos') === 'true' &&
            glitter.getUrlParameter('page') !== 'pos' &&
            glitter.getUrlParameter('type') === 'editor'
          ) {
            localStorage.removeItem('on-pos');
            location.href = glitter.root_path + 'pos?app-id=' + (window as any).appName;
          } else {
            glitter.setHome(
              'jspage/main.js',
              glitter.getUrlParameter('page'),
              {
                appName: config.appName,
              },
              {
                backGroundColor: `transparent;`,
              }
            );
          }
        }
      });
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
        location.href = `${url.origin}/${(window as any).glitterBase}/login`;
      } else {
        toNext();
      }
    });
  }

  // 跳轉至頁面編輯器 Iframe 顯示
  public static toHtmlEditor(glitter: Glitter, vm: any, callback: () => void) {
    (window as any).preloadData.eval_code_hash = (window.parent as any).preloadData.eval_code_hash;
    glitter.share.reload_code_hash();
    glitter.addMtScript(
      [
        {
          src: 'https://kit.fontawesome.com/cccedec0f8.js',
        },
      ],
      () => {},
      () => {}
    );
    glitter.addStyle(`
      @media (prefers-reduced-motion: no-preference) {
        :root {
          scroll-behavior: auto !important;
        }
      }
    `);
    (window.parent as any).glitter.share.editerGlitter = glitter;
    const clock = glitter.ut.clock();

    function scrollToItem(element: any) {
      if (element) {
        element.scrollIntoView({
          behavior: 'auto', // 使用平滑滾動效果
          block: 'center', // 將元素置中
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

    (window.parent as any).glitter.share.evalPlace = (evals: string) => eval(evals);

    glitter.addMtScript(
      (window.parent as any).editerData.setting.map((dd: any) => {
        return {
          src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
          type: 'module',
        };
      }),
      () => {},
      () => {},
      [{ key: 'async', value: 'true' }]
    );

    // Preload page script
    glitter.htmlGenerate.loadScript(
      glitter,
      (window.parent as any).editerData.setting
        .filter((dd: any) => {
          return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
        })
        .map((dd: any) => {
          return {
            src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
            type: 'module',
          };
        })
    );
    glitter.share.evalPlace = (evals: string) => eval(evals);
    setTimeout(() => {
      (window.parent as any).glitter.share.loading_dialog.dataLoading({
        text: '',
        visible: false,
      });
    }, 2000);
    glitter.htmlGenerate.setHome({
      app_config: vm.appConfig,
      page_config: (window.parent as any).page_config ?? {},
      get config() {
        return (window.parent as any).editerData.setting;
      },
      get editMode() {
        return (window.parent as any).editerData;
      },
      data: {},
      tag: (window.parent as any).glitter.getUrlParameter('page'),
    });

    callback();
  }

  // 跳轉至一般頁面
  public static toNormalRender(glitter: Glitter, vm: any, callback: () => void) {
    //紀錄初始載入頁面，後續會帶入query當中用與替換Header避免跳頁
    if(['hidden/','shop/'].find((dd)=>{
      return (glitter.getUrlParameter('page') || '').startsWith(dd) || ((glitter.getUrlParameter('page_refer') || '').startsWith(dd))
    })){
      const og_path=glitter.getUrlParameter('page_refer') || glitter.getUrlParameter('page');
      (window as any).page_refer=og_path;
      (glitter.share).is_shop=true
      // setInterval(()=>{
      //   if(glitter.getUrlParameter('page')==='index'){
      //     glitter.href='/'+og_path
      //   }else if(glitter.getUrlParameter('page')!==og_path){
      //     glitter.setUrlParameter('page_refer',og_path)
      //   }else{
      //     glitter.setUrlParameter('page_refer',undefined)
      //   }
      // },100)
    }
    ApiUser.getUserData(GlobalUser.token,'me').then(async (r) => {
      try {
        if (!r.result) {
          GlobalUser.token = ''
        } else {
          GlobalUser.userInfo = r.response
          GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response))
         }
      } catch (e) {
       }
    })
    glitter.addStyleLink([`https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css`]);
    glitter.addMtScript(
      [
        {
          src: `${glitter.root_path}/jslib/lottie-player.js`,
        },
      ],
      () => {},
      () => {}
    );

    if (glitter.getUrlParameter('token') && glitter.getUrlParameter('return_type') === 'resetPassword') {
      GlobalUser.token = glitter.getUrlParameter('token');
      glitter.setUrlParameter('token');
      glitter.setUrlParameter('return_type');
    }
    if (GlobalUser.token) {
      GlobalUser.registerFCM(GlobalUser.token);
    }
    glitter.share.evalPlace = (evals: string) => eval(evals);
    console.log(`exePlugin-time:`, (window as any).renderClock.stop());
    (window as any).glitterInitialHelper.getPageData(glitter.getUrlParameter('page'), (data: any) => {
      console.log(`getPageData-time:`, (window as any).renderClock.stop());
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
      // Preload page script
      glitter.htmlGenerate.loadScript(
        glitter,
        data.response.result[0].config
          .filter((dd: any) => {
            return ['widget', 'container', 'code'].indexOf(dd.type) === -1;
          })
          .map((dd: any) => {
            return {
              src: `${glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.js))}`,
              callback: () => {},
            };
          })
      );

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

        const login_config = (window as any).login_config;
        if (login_config.password_to_see && localStorage.getItem('password_to_see') !== login_config.shop_pwd) {
          const pwd = window.prompt('請輸入網站密碼', '');
          localStorage.setItem('password_to_see', pwd ?? '');
          if (login_config.shop_pwd === pwd) {
            next();
          } else {
            glitter.closeDiaLog();
            const dialog = new ShareDialog(glitter);
            dialog.checkYesOrNot({
              text: '網站密碼輸入錯誤',
              callback: () => {
                authPass();
              },
            });
          }
        } else {
          next();
        }
      }

      function authError(message: string) {
        glitter.addStyleLink(['assets/vendor/boxicons/css/boxicons.min.css', 'assets/css/theme.css', 'css/editor.css']);

        glitter.setHome('jspage/alert.js', glitter.getUrlParameter('page'), message, {
          backGroundColor: `transparent;`,
        });
      }

      // 判斷APP是否過期
      if (
        (window as any).memberType !== 'noLimit' &&
        vm.appConfig.dead_line &&
        new Date(vm.appConfig.dead_line).getTime() < new Date().getTime() &&
        (!vm.appConfig.refer_app || vm.appConfig.refer_app === vm.appConfig.appName)
      ) {
        authError('使用權限已過期，請前往後台執行續費。');
      } else {
        authPass();
      }
    });
  }

  // 資源初始化
  public static resourceInitial(glitter: Glitter, vm: any, callback: (data: any) => void) {
    glitter.share.PayConfig = PayConfig;
    //判斷是否為POS裝置的Initial
    glitter.runJsInterFace('pos-device', {}, res => {
      console.log(`res.deviceType=>`, res.deviceType);
      PayConfig.deviceType = ['SUNMI', 'neostra'].includes(res.deviceType) ? 'pos' : 'web';
      PayConfig.posType = res.deviceType;
      //POS機台啟用列印功能
      if (res.deviceType === 'neostra') {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mui/3.7.1/js/mui.min.js';
        script.integrity =
          'sha512-5LSZkoyayM01bXhnlp2T6+RLFc+dE4SIZofQMxy/ydOs3D35mgQYf6THIQrwIMmgoyjI+bqjuuj4fQcGLyJFYg==';
        script.referrerPolicy = 'no-referrer';
        script.crossOrigin = 'anonymous';
        // 当脚本加载完成后执行回调函数
        document.head.appendChild(script);
        glitter.addMtScript(
          [
            'https://oss-sg.imin.sg/web/iMinPartner/js/imin-printer.min.js',
            'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
            glitter.root_path + 'jslib/qrcode-d.js',
          ],
          () => {},
          () => {}
        );
        setTimeout(() => {
          //@ts-ignore
          window.IminPrintInstance = new IminPrinter();
          //@ts-ignore
          window.IminPrintInstance.connect();
        }, 3000);
      }
      if (res.deviceType === 'SUNMI') {
        glitter.addMtScript(
          [
            'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
            glitter.root_path + 'jslib/qrcode-d.js',
          ],
          () => {},
          () => {}
        );
      }
    });
    //取得APP的上間隔距離
    glitter.runJsInterFace(
      'getTopInset',
      {},
      (response: any) => {
        glitter.share.top_inset = parseInt(response.data, 10);
      },
      {
        webFunction: () => {
          return { data: 0 };
        },
      }
    );
    //取得APP的底部間隔距離
    glitter.runJsInterFace(
      'getBottomInset',
      {},
      (response: any) => {
        glitter.share.bottom_inset = parseInt(response.data, 10);
      },
      {
        webFunction: () => {
          return { data: 0 };
        },
      }
    );
    (window as any).glitterInitialHelper.getPlugin((dd: any) => {
      console.log(`getPlugin-time:`, (window as any).renderClock.stop());
      (window as any).saasConfig.appConfig = dd.response.data;
      // 設定預設的多國語言
      GlobalUser.language = GlobalUser.language || navigator.language;
      vm.appConfig = dd.response.data;
      glitter.share.appConfigresponse = dd;
      glitter.share.globalValue = {};
      glitter.share.globalStyle = {};
      const config = glitter.share.appConfigresponse.response.data;
      config.color_theme = config.color_theme ?? [];
      config.container_theme = config.container_theme ?? [];
      config.font_theme = config.font_theme ?? [];
      config.globalValue = config.globalValue ?? [];
      config.globalStyleTag = config.globalStyleTag ?? [];
      config.color_theme.map((dd: any, index: number) => {
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
            .map((dd: any) => {
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

      function loopCheckGlobalValue(array: any, tag: string) {
        try {
          array.map((dd: any) => {
            if (dd.type === 'container') {
              loopCheckGlobalValue(dd.data.setting, tag);
            } else {
              if (dd.data.tagType === 'language') {
                if (dd.data.value.length > 0) {
                  glitter.share[tag][dd.data.tag] = (
                    dd.data.value.find((dd: any) => {
                      return dd.lan.toLowerCase().indexOf(GlobalUser.language.toLowerCase()) !== -1;
                    }) || dd.data.value[0]
                  ).text;
                }
              } else {
                glitter.share[tag][dd.data.tag] = dd.data.value;
              }
            }
          });
        } catch (e) {
          console.error(e);
        }
      }

      if (glitter.getUrlParameter('type') === 'htmlEditor') {
        loopCheckGlobalValue((window.parent as any).glitter.share.editorViewModel.globalStyleTag, 'globalStyle');
        loopCheckGlobalValue((window.parent as any).glitter.share.editorViewModel.globalValue, 'globalValue');
      } else {
        loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalStyleTag, 'globalStyle');
        loopCheckGlobalValue(glitter.share.appConfigresponse.response.data.globalValue, 'globalValue');
      }
      callback(dd);
    });
  }

  // 載入全域資源
  public static globalStyle(glitter: Glitter, dd: any) {
    return new Promise(async (resolve, reject) => {
      //定期確認版本號碼
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
                } else {
                  setTimeout(() => {
                    loopVersion();
                  }, 1000 * 300);
                }
              },
            });
          } else {
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
        // @ts-ignore
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
      for (const data of dd.response.data.initialList ?? []) {
        try {
          if (data.type === 'script') {
            const url = new URL(glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(data.src.link)));
            glitter.share.callBackList = glitter.share.callBackList ?? {};
            const callbackID = glitter.getUUID();
            url.searchParams.set('callback', callbackID);
            glitter.share.callBackList[callbackID] = () => {
              vm.count--;
            };
            glitter.addMtScript(
              [
                {
                  src: url.href,
                  type: 'module',
                },
              ],
              () => {
                vm.count--;
              },
              () => {
                vm.count--;
              }
            );
          } else {
            vm.count--;
          }
        } catch (e) {
          console.error(e);
          vm.count--;
        }
      }
      if (countI === 0) {
        resolve(true);
      }
    });
  }

  // 判斷是否要重新定義頁面
  public static checkRedirectPage(glitter: Glitter) {
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
