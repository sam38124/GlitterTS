import { GVC } from '../../glitterBundle/GVController.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { getCheckoutCount } from '../../official_event/e-commerce/get-count.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { AiSearch } from '../ai/ai-search.js';
import { Language } from '../../glitter-base/global/language.js';
import { Color } from '../public/color.js';
import { LanguageView } from '../public/language-view.js';
import { HeaderClass } from './header-class.js';
import { HeadInitial } from './head-initial.js';
import { HeaderMobile } from './header-mobile.js';
import { PdClass } from '../product/pd-class.js';

const html = String.raw;

export class Sy03 {
  public static main(gvc: GVC, widget: any, subData: any) {
    return HeadInitial.initial({
      widget: widget,
      browser: () => {
        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(HeaderClass.getChangePagePath(gvc), cl => (changePage = cl.changePage));

        const colors = Color.getTheme(gvc, widget.formData);
        HeaderClass.addStyle(gvc);

        return html` <!--Header Sy03-->
          <div class="d-sm-none" style="height: 76px;"></div>
          <nav
            class="navbar navbar-expand-lg vw-100 header header-place shadow   top-0 left-0  py-0 position-fixed position-sm-relative"
            style="background:  ${widget.formData.theme_color['background'] ?? '#000'} !important;z-index:9999;"
          >
            <div
              class="container header-place  h-100 align-items-center justify-content-center d-flex"
              style="${document.body.clientWidth < 800 ? `height:76px !important;` : ''}"
            >
              <div class="d-flex flex-column align-items-center justify-content-center pb-md-3 pt-md-3 flex-fill">
                <!--LOGO顯示區塊-->
                <div
                  class="d-flex align-items-center justify-content-start justify-content-md-center h-100 w-100 gap-2"
                >
                  <!--手機版選單-->
                  <div
                    class=" align-items-center justify-content-center d-flex d-lg-none "
                    style="width:45px !important;height:40px !important;"
                    onclick="${gvc.event(() => {
                      gvc.glitter.setDrawer(
                        gvc.bindView(() => {
                          const id = gvc.glitter.getUUID();
                          return {
                            bind: id,
                            view: () => {
                              return html` <div
                                  class="div d-flex align-items-center flex-column w-100 p-3"
                                  style="border-bottom:1px solid ${widget.formData.theme_color['title']};"
                                >
                                  <div class="d-flex align-items-center ">
                                    <div>
                                      <div
                                        class="h-100"
                                        onclick="${gvc.event(() => {
                                          changePage('index', 'home', {});
                                        })}"
                                      >
                                        <img class="h-logo-image" src="${widget.formData.logo}" />
                                      </div>
                                    </div>
                                  </div>
                                  <div class="mb-3">${LanguageView.selectLanguage(gvc, colors)}</div>
                                  <div class="position-relative ${HeaderClass.hideShopperBtn() ? `d-none` : ''}">
                                    <input
                                      class="form-control fw-500 "
                                      placeholder="${Language.text('find_product')}"
                                      autocomplete="off"
                                      value=""
                                      onchange="${gvc.event((e, event) => {
                                        gvc.glitter.href = `/all-product?search=${e.value}`;
                                      })}"
                                    />

                                    <div class="h-glass-div">
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
                                    ApiUser.getPublicConfig(
                                      widget.formData.menu_refer || 'menu-setting',
                                      'manager',
                                      (window as any).appName
                                    ).then(res => {
                                      vm.data = res.response.value[Language.getLanguage()];
                                      gvc.notifyDataChange(id);
                                    });
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

                                        function openParent(data: any, current_path: string[], depth: number) {
                                          data.open = current_path[depth] === data.title;

                                          if ((data.items || []).length > 0) {
                                            for (const d87 of data.items) {
                                              openParent(d87, current_path, depth + 1);
                                            }
                                          }
                                        }

                                        function loopItems(data: any, show_border: boolean, current_path: string[]) {
                                          return data
                                            .map((dd: any) => {
                                              const path = [...current_path, dd.title];
                                              return html`
                                                <li
                                                  style="${show_border
                                                    ? `border-bottom: 1px solid ${widget.formData.theme_color['title'] ?? '#000'} !important;`
                                                    : ''}"
                                                >
                                                  <div
                                                    class="nav-link d-flex justify-content-between"
                                                    style="padding: 16px; gap: 30px;"
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
                                                        for (const d4 of vm.data) {
                                                          openParent(d4, path, 0);
                                                        }
                                                        gvc.notifyDataChange(id);
                                                      }
                                                    })}"
                                                  >
                                                    <div
                                                      style="color: ${widget.formData.theme_color['title'] ??
                                                      '#000'} !important;"
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
                                                      ? `<i class="fa-solid ${dd.open ? `fa-angle-up` : `fa-angle-down`}"
                                                                                   style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;"></i>`
                                                      : ''}
                                                  </div>
                                                  ${dd.open
                                                    ? `<ul class="ps-3  pb-2">${loopItems(dd.items ?? [], false, path)}</ul>`
                                                    : ''}
                                                </li>
                                              `;
                                            })
                                            .join('');
                                        }

                                        return loopItems(vm.data, true, []);
                                      },
                                      divCreate: {
                                        class: `navbar-nav me-auto mb-2 mb-lg-0`,
                                        style: '',
                                        elem: `ul`,
                                      },
                                    };
                                  })}
                                </div>`;
                            },
                            divCreate: {
                              class: `w-100 h-100`,
                              style: `z-index: 9999;overflow-y:auto;
background: ${colors.bgr ?? '#000'};overflow-x: hidden;`,
                            },
                          };
                        }),
                        () => {
                          gvc.glitter.openDrawer(280);
                        }
                      );
                    })}"
                  >
                    <i
                      class="fa-solid fa-bars fa-fw  "
                      style="font-size: 20px;
    color: ${widget.formData.theme_color['title'] ?? '#000'};"
                    ></i>
                  </div>
                  <div
                    class="h-100"
                    onclick="${gvc.event(() => {
                      changePage('index', 'home', {});
                    })}"
                  >
                    <img
                      src="${widget.formData.logo}"
                      style="${document.body.clientWidth < 800 || gvc.glitter.getUrlParameter('page') === 'checkout'
                        ? `max-height: 100%;max-width:200px;max-height:60px;`
                        : `height: ${(() => {
                            try {
                              const h = widget.formData.height;
                              if (h && !isNaN(parseInt(`${h}`, 10))) {
                                return parseInt(`${h}`, 10);
                              }
                              return 150;
                            } catch (error) {
                              return 150;
                            }
                          })()}px;`}"
                    />
                  </div>
                </div>
                <!--選單列表顯示區塊-->
                <ul class="navbar-nav d-none d-md-block flex-fill ps-2 position-sticky">
                  ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    const vm = {
                      data: [],
                    };
                    ApiUser.getPublicConfig(
                      widget.formData.menu_refer || 'menu-setting',
                      'manager',
                      (window as any).appName
                    ).then(res => {
                      vm.data = res.response.value[Language.getLanguage()];
                      gvc.notifyDataChange(id);
                    });
                    return {
                      bind: id,
                      view: async () => {
                        const userData = await ApiUser.getUserData(gvc.glitter.share.GlobalUser.token, 'me');

                        function loopItems(data: any) {
                          return data
                            .map((dd: any) => {
                              if (!PdClass.menuVisibleVerify(userData, dd)) {
                                return '';
                              }

                              return html` <li class="nav-item dropdown">
                                <a
                                  class="nav-link header-link "
                                  style="color: ${widget.formData.theme_color['title'] ??
                                  '#000'} !important;cursor: pointer;"
                                  onclick="${gvc.event(() => {
                                    if (dd.link) {
                                      gvc.glitter.href = dd.link;
                                    }
                                  })}"
                                  >${dd.title}
                                  ${dd.items.length > 0 ? html`<i class="fa-solid m-2 fa-angle-down fs-5"></i>` : ''}</a
                                >
                                ${dd.items.length > 0
                                  ? html`<ul
                                      class="dropdown-menu"
                                      style="background:${widget.formData.theme_color['background'] ??
                                      '#000'} !important; cursor: pointer; z-index: 99999;"
                                    >
                                      ${loopItems(dd.items)}
                                    </ul>`
                                  : ''}
                              </li>`;
                            })
                            .join('');
                        }

                        return loopItems(vm.data);
                      },
                      divCreate: {
                        class: `navbar-nav ms-3 me-auto mt-3 flex-wrap`,
                        style: `flex-direction: row; gap: 15px; align-items: center;`,
                        elem: `ul`,
                      },
                    };
                  })}
                </ul>
              </div>
              <div
                class="d-flex align-items-center ${document.body.clientWidth >= 800
                  ? `position-lg-absolute`
                  : `position-relative`} "
                style="${document.body.clientWidth > 800 ? `top:10px;right:30px;` : ''}"
              >
                <!--固定按鈕顯示區塊-->
                <ul class="navbar-nav flex-row ms-auto">
                  ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    const vm = {
                      visible: false,
                    };
                    ApiUser.getPublicConfig('store-information', 'manager').then(res => {
                      if (res.response.value.ai_search) {
                        vm.visible = true;
                        gvc.notifyDataChange(id);
                      }
                    });
                    return {
                      bind: id,
                      view: () => {
                        return `<div class="d-flex align-items-center justify-content-center "
                                     style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;width:30px;height:30px;font-size: 15px;
border: 2px solid ${widget.formData.theme_color['title'] ?? '#000'} !important;
border-radius: 50%;
font-weight: 700 !important;
padding-bottom: 2px;
">AI
                                </div>`;
                      },
                      divCreate: () => {
                        return {
                          class: `nav-item  ${vm.visible ? `d-flex` : `d-none`} align-items-center justify-content-center`,
                          style: `width:45px !important;cursor: pointer;`,
                          option: [
                            {
                              key: 'onclick',
                              value: gvc.event(() => {
                                AiSearch.searchProduct(gvc);
                              }),
                            },
                          ],
                        };
                      },
                    };
                  })}
                  ${HeaderClass.hideShopperBtn()
                    ? ''
                    : `<li class="nav-item d-none d-sm-flex align-items-center justify-content-center" style="min-width:45px !important;">
                                ${gvc.bindView(() => {
                                  const vm = {
                                    id: gvc.glitter.getUUID(),
                                    toggle: false,
                                  };
                                  return {
                                    bind: vm.id,
                                    view: () => {
                                      if (PdClass.isShoppingPage()) {
                                        return '';
                                      }
                                      if (!vm.toggle) {
                                        return html`<i
                                          class="fa-regular fa-magnifying-glass"
                                          style="color: ${widget.formData.theme_color['title'] ??
                                          '#000'};cursor: pointer;font-size:20px;"
                                          onclick="${gvc.event(() => {
                                            vm.toggle = !vm.toggle;
                                            gvc.notifyDataChange(vm.id);
                                          })}"
                                        ></i>`;
                                      } else {
                                        return html`<a class="search-container d-flex align-items-center"
                                          ><i
                                            class="fa-regular fa-circle-xmark"
                                            style="color: ${widget.formData.theme_color['title'] ??
                                            '#000'};cursor: pointer;font-size:20px;"
                                            onclick="${gvc.event(() => {
                                              vm.toggle = !vm.toggle;
                                              gvc.notifyDataChange(vm.id);
                                            })}"
                                          ></i
                                          ><input
                                            class="ms-3 form-control"
                                            style="height:40px;"
                                            placeholder="${Language.text('input_product_keyword')}"
                                            autocomplete="off"
                                            onchange="${gvc.event((e, event) => {
                                              gvc.glitter.href = `/all-product?search=${`${e.value}`.trim()}`;
                                              vm.toggle = !vm.toggle;
                                              gvc.notifyDataChange(vm.id);
                                            })}"
                                          />
                                        </a>`;
                                      }
                                    },
                                    divCreate: {
                                      class: `nav-link search-container`,
                                      elem: `a`,
                                    },
                                  };
                                })}
                            </li>`}
                  <li
                    class="nav-item  ${HeaderClass.hideShopperBtn()
                      ? `d-none`
                      : `d-flex`} align-items-center justify-content-center"
                    style="width:45px !important;"
                  >
                    ${gvc.bindView(() => {
                      const vm = {
                        id: gvc.glitter.getUUID(),
                        count: 0,
                      };
                      return {
                        bind: vm.id,
                        view: () => {
                          return html`<span
                            class="position-relative"
                            onclick="${gvc.event(() => {
                              HeaderClass.rightCartMenu(gvc, widget);
                            })}"
                          >
                            <i
                              class="fa-duotone fa-cart-shopping"
                              style="color: ${widget.formData.theme_color['title'] ??
                              '#000'} !important;cursor: pointer;font-size:20px;"
                            ></i>
                            ${gvc.bindView(() => {
                              return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                  return new Promise((resolve, reject) => {
                                    getCheckoutCount(count => {
                                      vm.count = count;
                                      resolve(
                                        vm.count
                                          ? html`<div
                                              class="position-absolute"
                                              style="font-size: 10px;right: -10px;top: -6px;"
                                            >
                                              <div
                                                class="rounded-circle bg-danger text-white  align-items-center justify-content-center fw-500 d-flex"
                                                style="width:18px;height: 18px;color: white !important;background:#fe5541;"
                                              >
                                                ${vm.count}
                                              </div>
                                            </div>`
                                          : ''
                                      );
                                    });
                                  });
                                },
                              };
                            })}
                          </span>`;
                        },
                        divCreate: {
                          class: `nav-link js-cart-count `,
                        },
                      };
                    })}
                  </li>
                  <li
                    class="nav-item d-flex align-items-center justify-content-center ${HeaderClass.hideShopperBtn()
                      ? `d-none`
                      : `d-flex`}"
                    style="width:45px !important;"
                  >
                    <a class="nav-link search-container">
                      <i
                        class="fw-500  fa-regular fa-user "
                        style="color: ${widget.formData.theme_color['title'] ?? '#000'};cursor: pointer;font-size:20px;"
                        onclick="${gvc.event(() => {
                          if (GlobalUser.token) {
                            changePage('account_userinfo', 'page', {});
                          } else {
                            if (localStorage.getItem('redirect_cart') === 'true') {
                              localStorage.removeItem('redirect_cart');
                            }
                            changePage('login', 'page', {});
                          }
                        })}"
                      ></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>`;
      },
      mobile: () => {
        return HeaderMobile.mian({
          gvc: gvc,
          widget: widget,
        });
      },
      gvc: gvc,
    });
  }
}

(window as any).glitter.setModule(import.meta.url, Sy03);
