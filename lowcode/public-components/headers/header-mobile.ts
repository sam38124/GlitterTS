import { GVC } from '../../glitterBundle/GVController.js';
import { Storage } from '../../glitterBundle/helper/storage.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { LanguageView } from '../public/language-view.js';
import { Language } from '../../glitter-base/global/language.js';
import { Color } from '../public/color.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { CheckoutIndex } from '../checkout/index.js';
import { Animation } from '../../glitterBundle/module/Animation.js';

const html = String.raw;

export class HeaderMobile {
  public static mian(cf: { gvc: GVC; widget: any }) {
    const { gvc } = cf;

    return html`
      <div style="height:${66 + gvc.glitter.share.top_inset}px;"></div>
      ${(() => {
        switch (gvc.glitter.getUrlParameter('page')) {
          case 'checkout':
            return HeaderMobile.checkoutHeader(cf);
          default:
            return HeaderMobile.appHeader(cf);
        }
      })()}
    `;
  }

  //一般APP首頁
  public static appHeader(cf: { gvc: GVC; widget: any }) {
    const { gvc } = cf;
    return gvc.bindView(() => {
      const v_id = gvc.glitter.getUUID();
      let head_config: any = undefined;
      const colors = Color.getThemeColors(gvc, {
        background: '.0',
      });
      new Promise((resolve, reject) => {
        (window.parent as any).glitter.share.ApiUser.getPublicConfig(
          'app-header-config',
          'manager',
          (window.parent as any).appName
        ).then((res: any) => {
          head_config = res.response.value;
          resolve(res.response.value);
          gvc.notifyDataChange(v_id);
        });
      });
      return {
        bind: v_id,
        view: () => {
          if (!head_config) {
            return ``;
          }
          return html` <div class="w-100 d-flex align-items-center" style="position: relative;">
            <div
              class="d-flex align-items-center justify-content-center d-md-none"
              style="width:45px !important;height:40px !important;"
            >
              <i
                class="fa-solid fa-bars fa-fw  "
                style="font-size: 20px;
    color: ${head_config.btn_color || '#ffffff'};"
                aria-hidden="true"
                onclick="${gvc.event(() => {
                  gvc.glitter.setDrawer(
                    gvc.bindView(() => {
                      const id = gvc.glitter.getUUID();
                      return {
                        bind: id,
                        view: () => {
                          return html` <div
                              class="div d-flex align-items-center flex-column w-100 p-3"
                              style="border-bottom:1px solid ${head_config.btn_color};"
                            >
                              ${[
                                ` <div class="d-flex align-items-center ">
                                  <div>
                                    <div
                                      class="h-100"
                                      onclick="${gvc.event(() => {
                                        gvc.glitter.href = '/index';
                                      })}"
                                    >
                                      <img
                                        style="width: 180px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 10px;
    margin-bottom: 20px;"
                                        src="${head_config.header_img}"
                                      />
                                    </div>
                                  </div>
                                </div>`,
                                LanguageView.selectLanguage(gvc, colors),
                              ]
                                .filter(dd => {
                                  return dd;
                                })
                                .join(`<div class="my-3"></div>`)}

                              <div class="position-relative">
                                <input
                                  class="form-control fw-500 "
                                  placeholder="${Language.text('find_product')}"
                                  autocomplete="off"
                                  value=""
                                  onchange="${gvc.event((e, event) => {
                                    gvc.glitter.href = `/all-product?search=${e.value}`;
                                  })}"
                                />

                                <div
                                  style=" position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: rgb(107, 114, 128);"
                                >
                                  <i class="fa-solid fa-magnifying-glass"></i>
                                </div>
                              </div>
                            </div>

                            <div class="offcanvas-body p-0 ">
                              ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                const vm = {
                                  data: [],
                                };
                                ApiUser.getPublicConfig('menu-setting', 'manager', (window as any).appName).then(
                                  res => {
                                    vm.data = res.response.value[Language.getLanguage()];
                                    gvc.notifyDataChange(id);
                                  }
                                );
                                return {
                                  bind: id,
                                  view: () => {
                                    function resetToggle() {
                                      function loop(data: any) {
                                        data.map((dd: any) => {
                                          (dd as any).open = false;
                                          loop((dd as any).items ?? []);
                                        });
                                      }

                                      loop(vm.data);
                                    }

                                    function loopItems(data: any, show_border: boolean) {
                                      return data
                                        .map((dd: any) => {
                                          return html`
                                            <li
                                              style="${show_border
                                                ? `border-bottom: 1px solid ${head_config.btn_color ?? '#000'} !important;`
                                                : ``}"
                                            >
                                              <div
                                                class="nav-link d-flex justify-content-between"
                                                style="padding: 16px;"
                                                onclick="${gvc.event(() => {
                                                  if (((dd as any).items ?? []).length === 0) {
                                                    if (dd.link) {
                                                      gvc.glitter.href = dd.link;
                                                      gvc.glitter.closeDrawer();
                                                    }
                                                  } else {
                                                    let og = dd.open;
                                                    resetToggle();
                                                    if (!og) {
                                                      dd.open = true;
                                                    }
                                                    gvc.notifyDataChange(id);
                                                  }
                                                })}"
                                              >
                                                <div
                                                  style="color: ${head_config.btn_color ?? '#000'} !important;"
                                                  onclick="${gvc.event((e, event) => {
                                                    if (dd.link) {
                                                      gvc.glitter.href = dd.link;
                                                      gvc.glitter.closeDrawer();
                                                    }
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                  })}"
                                                >
                                                  ${dd.title}
                                                </div>
                                                ${(dd.items ?? []).length
                                                  ? html` <i
                                                      class="fa-solid ${dd.open ? `fa-angle-up` : `fa-angle-down`}"
                                                      style="color: ${head_config.btn_color ?? '#000'} !important;"
                                                    ></i>`
                                                  : ``}
                                              </div>
                                              ${dd.open
                                                ? `<ul class="ps-3  pb-2">${loopItems(dd.items ?? [], false)}</ul>`
                                                : ``}
                                            </li>
                                          `;
                                        })
                                        .join('');
                                    }

                                    return loopItems(vm.data, true);
                                  },
                                  divCreate: {
                                    class: `navbar-nav me-auto mb-2 mb-lg-0`,
                                    style: ``,
                                    elem: `ul`,
                                  },
                                };
                              })}
                            </div>`;
                        },
                        divCreate: {
                          class: `w-100 h-100`,
                          style: `z-index: 9999;overflow-y:auto;
background: ${head_config.background ?? '#000'};overflow-x: hidden;
padding-top:${gvc.glitter.share.top_inset}px !important;
`,
                        },
                      };
                    }),
                    () => {
                      gvc.glitter.openDrawer(280);
                    }
                  );
                })}"
              ></i>
            </div>
            <div class="position-absolute" style="transform: translate(-50%,-50%);top:50%;left: 50%;">
              <img
                src="${head_config.header_img}"
                style="max-width:200px;max-height:60px;"
                alt=""
                onclick="${gvc.event(() => {
                  gvc.glitter.href = '/index';
                })}"
              />
            </div>
            <div class="flex-fill"></div>
            <div
              class="d-flex align-items-center justify-content-center d-md-none ${(() => {
                if (
                  ['index-app', 'all-product', 'checkout', 'account_userinfo', 'index'].includes(
                    gvc.glitter.getUrlParameter('page')
                  )
                ) {
                  return `d-none`;
                } else {
                  return ``;
                }
              })()}"
              style="width:45px !important;height:40px !important;"
            >
              <i
                class="fa-regular fa-cart-shopping"
                style="font-size: 20px;
    color: ${head_config.btn_color || '#ffffff'};"
                aria-hidden="true"
                onclick="${gvc.event(() => {
                  ApiCart.checkoutCart = ApiCart.globalCart;
                  gvc.glitter.href = '/checkout';
                })}"
              ></i>
            </div>
          </div>`;
        },
        divCreate: () => {
          return {
            elem: 'nav',
            class: `navbar navbar-expand-lg vw-100 header header-place shadow   top-0 left-0 px-2 py-0 position-fixed position-sm-relative
              ${head_config ? `` : `d-none`}
              `,
            style: `background:  ${head_config && head_config.background} !important;z-index:9999;
        height:${66 + gvc.glitter.share.top_inset}px;padding-top:${gvc.glitter.share.top_inset}px !important;
`,
          };
        },
      };
    });
  }

  //購物車的首頁
  public static checkoutHeader(cf: { gvc: GVC; widget: any }) {
    const { gvc } = cf;
    return gvc.bindView(() => {
      const v_id = gvc.glitter.getUUID();
      let head_config: any = undefined;
      const colors = Color.getThemeColors(gvc, {
        background: '.0',
      });
      new Promise((resolve, reject) => {
        (window.parent as any).glitter.share.ApiUser.getPublicConfig(
          'app-header-config',
          'manager',
          (window.parent as any).appName
        ).then((res: any) => {
          head_config = res.response.value;
          resolve(res.response.value);
          gvc.notifyDataChange(v_id);
        });
      });
      return {
        bind: v_id,
        view: () => {
          if (!head_config) {
            return ``;
          }
          return html` <div class="w-100 d-flex align-items-center" style="position: relative;">
            <div
              class="d-flex align-items-center justify-content-center d-md-none ps-2"
              style="height:40px !important;gap:10px;"
              onclick="${gvc.event(() => {
                const glitter=gvc.glitter;
                if(glitter.pageConfig.length>1 && (glitter.pageConfig[glitter.pageConfig.length-2].tag !== 'checkout')){
                  gvc.glitter.goBack();
                }else{
                  gvc.glitter.href='/index-app'
                }
              })}"
            >
              <i
                class="fa-solid fa-angle-left"
                style="font-size: 20px;
    color: ${head_config.btn_color || '#ffffff'};"
                aria-hidden="true"
              ></i>
              <div class="fw-500" style="color: ${head_config.btn_color || '#ffffff'};font-size: 18px;">返回</div>
            </div>
            <div class="position-absolute fw-bold fs-5" style="transform: translate(-50%,-50%);top:50%;left: 50%;color: ${head_config.btn_color || '#ffffff'};">
              購物車
            </div>
            <div class="flex-fill"></div>
            <div
              class="d-flex align-items-center justify-content-center d-md-none ${(() => {
                if (
                  ['index-app', 'all-product', 'checkout', 'account_userinfo', 'index'].includes(
                    gvc.glitter.getUrlParameter('page')
                  )
                ) {
                  return `d-none`;
                } else {
                  return ``;
                }
              })()}"
              style="width:45px !important;height:40px !important;"
            >
              <i
                class="fa-regular fa-cart-shopping"
                style="font-size: 20px;
    color: ${head_config.btn_color || '#ffffff'};"
                aria-hidden="true"
                onclick="${gvc.event(() => {
                  ApiCart.checkoutCart = ApiCart.globalCart;
                  gvc.glitter.href = '/checkout';
                })}"
              ></i>
            </div>
          </div>`;
        },
        divCreate: () => {
          return {
            elem: 'nav',
            class: `navbar navbar-expand-lg vw-100 header header-place shadow   top-0 left-0 px-2 py-0 position-fixed position-sm-relative
              ${head_config ? `` : `d-none`}
              `,
            style: `background:  ${head_config && head_config.background} !important;z-index:9999;
        height:${66 + gvc.glitter.share.top_inset}px;padding-top:${gvc.glitter.share.top_inset}px !important;
`,
          };
        },
      };
    });
  }

  public static editor(cf: { gvc: GVC; widget: any }) {
    const gvc = cf.gvc;

    return html`
      <div
        class="px-3 mx-n2 border-bottom pb-3 fw-bold mt-n3 mb-2 pt-3 hoverF2 d-flex align-items-center"
        style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
        onclick="${cf.gvc.event(() => {
          Storage.lastSelect = '';
          gvc.glitter.share.editorViewModel.selectItem = undefined;
          gvc.glitter.share.selectEditorItem();
        })}"
      >
        <i
          class="fa-solid fa-chevron-left h-100 d-flex align-items-center justify-content-center "
          style="cursor: pointer;"
          aria-hidden="true"
        ></i>
        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
          >手機版標頭</span
        >
        <div class="flex-fill"></div>
      </div>
      ${gvc.bindView(() => {
        const vm = {
          id: gvc.glitter.getUUID(),
        };
        return {
          bind: vm.id,
          view: async () => {
            const BgWidget: any = await new Promise((resolve, reject) => {
              gvc.glitter.getModule(
                new URL(gvc.glitter.root_path + 'backend-manager/bg-widget.js', import.meta.url).href,
                clas => {
                  resolve(clas);
                }
              );
            });
            const EditorElem: any = await new Promise((resolve, reject) => {
              gvc.glitter.getModule(
                new URL(gvc.glitter.root_path + 'glitterBundle/plugins/editor-elem.js', import.meta.url).href,
                clas => {
                  resolve(clas);
                }
              );
            });
            const head_config: any = await new Promise((resolve, reject) => {
              (window.parent as any).glitter.share.ApiUser.getPublicConfig(
                'app-header-config',
                'manager',
                (window.parent as any).appName
              ).then((res: any) => {
                resolve(res.response.value);
              });
            });

            function refresh() {
              for (const b of (window.parent as any).document
                .querySelector('.iframe_view')
                .contentWindow.document.querySelectorAll(
                  `.${cf.widget.data.refer_app || (window as any).appName}_${cf.widget.data.tag}`
                )) {
                b.updatePageConfig({}, 'def', cf.widget);
              }
            }

            gvc.glitter.share.editorViewModel.saveArray[cf.widget.id] = () => {
              return new Promise((resolve, reject) => {
                (window.parent as any).glitter.share.ApiUser.setPublicConfig({
                  key: 'app-header-config',
                  value: head_config,
                  user_id: 'manager',
                }).then((r: any) => {
                  resolve(true);
                });
              });
            };
            return [
              BgWidget.title('LOGO圖片', 'font-size:16px;margin-bottom: 5px;'),
              BgWidget.imageSelector(gvc, head_config.header_img || '', (res: any) => {
                head_config.header_img = res;
                refresh();
                gvc.notifyDataChange(vm.id);
              }),
              html` <div class="tx_normal mt-2">背景顏色</div>`,
              EditorElem.colorSelect({
                gvc: gvc,
                title: '',
                callback: (text: string) => {
                  head_config.background = text;
                  refresh();
                  gvc.notifyDataChange(vm.id);
                },
                def: head_config.background,
              }),
              html` <div class="tx_normal mt-2">按鈕顏色</div>`,
              EditorElem.colorSelect({
                gvc: gvc,
                title: '',
                callback: (text: string) => {
                  head_config.btn_color = text;
                  refresh();
                  gvc.notifyDataChange(vm.id);
                },
                def: head_config.btn_color,
              }),
            ].join('');
          },
          divCreate: {},
        };
      })}
    `;
  }
}

(window as any).glitter.setModule(import.meta.url, HeaderMobile);
