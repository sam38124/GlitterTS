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

export class Sy02 {
  public static main(gvc: GVC, widget: any, subData: any) {
    return HeadInitial.initial({
      widget: widget,
      browser: () => {
        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(HeaderClass.getChangePagePath(gvc), cl => (changePage = cl.changePage));

        const colors = Color.getTheme(gvc, widget.formData);
        HeaderClass.addStyle(gvc);

        function navbar() {
          const id = gvc.glitter.getUUID();
          const vm = { data: [] };

          ApiUser.getPublicConfig(
            widget.formData.menu_refer || 'menu-setting',
            'manager',
            (window as any).appName
          ).then(res => {
            vm.data = res.response.value[Language.getLanguage()];
            gvc.notifyDataChange(id);
          });

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

                function linkEvent() {
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
                }

                function stopEvent(event: any) {
                  if (dd.link) {
                    gvc.glitter.href = dd.link;
                    gvc.glitter.closeDrawer();
                  }
                  event.stopPropagation();
                  event.preventDefault();
                }

                return html`
                  <li
                    style="${show_border
                      ? `border-bottom: 1px solid ${widget.formData.theme_color['title'] ?? '#000'} !important;`
                      : ''}"
                  >
                    <div
                      class="nav-link d-flex justify-content-between"
                      style="padding: 16px; gap: 30px;"
                      onclick="${gvc.event(() => linkEvent())}"
                    >
                      <div
                        style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;"
                        onclick="${gvc.event((_, event) => stopEvent(event))}"
                      >
                        ${dd.title}
                      </div>
                      ${(dd.items || []).length
                        ? html` <i
                            class="fa-solid ${dd.open ? 'fa-angle-up' : 'fa-angle-down'}"
                            style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;"
                          ></i>`
                        : ''}
                    </div>
                    ${dd.open
                      ? html`<ul class="ps-3 pb-2">
                          ${loopItems(dd.items ?? [], false, path)}
                        </ul>`
                      : ''}
                  </li>
                `;
              })
              .join('');
          }

          return {
            bind: id,
            view: () => {
              return loopItems(vm.data, true, []);
            },
            divCreate: {
              class: 'navbar-nav me-auto mb-2 mb-lg-0',
              elem: 'ul',
            },
          };
        }

        function drawer() {
          return gvc.bindView({
            bind: gvc.glitter.getUUID(),
            view: () => {
              return html`<div
                  class="div d-flex align-items-center flex-column w-100 p-3"
                  style="border-bottom:1px solid ${widget.formData.theme_color['title']};"
                >
                  <div class="d-flex align-items-center">
                    <div>
                      <div class="h-100" onclick="${gvc.event(() => changePage('index', 'home', {}))}">
                        ${widget.formData.logo.type === 'text'
                          ? html`
                              <div
                                class="fw-bold d-flex align-items-center justify-content-center h-logo-text-1"
                                style="color: ${widget.formData.theme_color['title'] ?? '#000'};"
                              >
                                ${widget.formData.logo.value}
                              </div>
                            `
                          : html`<img class="h-logo-image" src="${widget.formData.logo.value}" /> `}
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">${LanguageView.selectLanguage(gvc, colors)}</div>
                  <div class="position-relative">
                    <input
                      class="form-control fw-500 "
                      placeholder="${Language.text('find_product')}"
                      autocomplete="off"
                      onchange="${gvc.event(e => {
                        gvc.glitter.href = `/all-product?search=${e.value}`;
                      })}"
                    />
                    <div class="h-glass-div">
                      <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                  </div>
                </div>
                <div class="offcanvas-body p-0">${gvc.bindView(navbar())}</div>`;
            },
            divCreate: {
              class: 'w-100 h-100',
              style: `
                z-index: 9999;
                overflow-y: auto;
                overflow-x: hidden;
                background: ${colors.bgr ?? '#000'};
              `,
            },
          });
        }

        function menu() {
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

          return gvc.bindView({
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
                        '#000'} !important;cursor: pointer;font-size: 15px;"
                        onclick="${gvc.event(() => {
                          if (dd.link) {
                            gvc.glitter.href = dd.link;
                          }
                        })}"
                        >${dd.title} ${dd.items.length > 0 ? html`<i class="fa-solid fa-angle-down ms-2"></i>` : ''}</a
                      >
                      ${dd.items.length > 0
                        ? html` <ul
                            class="dropdown-menu"
                            style="background:${widget.formData.theme_color['background'] ??
                            '#000'} !important; cursor: pointer; z-index: 99999;"
                          >
                            ${loopItems(dd.items)}
                          </ul>`
                        : ''}
                    </li>`;
                  })
                  .filter(Boolean)
                  .join('');
              }

              return loopItems(vm.data);
            },
            divCreate: {
              class: 'navbar-nav ms-3 me-auto flex-wrap',
              style: 'flex-direction: row; gap: 8px;',
              elem: 'ul',
            },
          });
        }

        function defaultButton() {
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

          const style = `
            color: ${widget.formData.theme_color['title'] ?? '#000'} !important;
            width: 30px;
            height: 30px;
            font-size: 15px;
            border: 2px solid ${widget.formData.theme_color['title'] ?? '#000'} !important;
            border-radius: 50%;
            font-weight: 700 !important;
            padding-bottom: 2px;
          `;

          return gvc.bindView({
            bind: id,
            view: () => {
              return html`<div class="d-flex align-items-center justify-content-center " style="${style}">AI</div>`;
            },
            divCreate: () => {
              return {
                class: `nav-item ${vm.visible ? 'd-flex' : 'd-none'} align-items-center justify-content-center`,
                style: 'width: 48px !important; cursor: pointer;',
                option: [
                  {
                    key: 'onclick',
                    value: gvc.event(() => AiSearch.searchProduct(gvc)),
                  },
                ],
              };
            },
          });
        }

        function searchView() {
          if (PdClass.isShoppingPage()) {
            return '';
          }

          const vm = {
            id: gvc.glitter.getUUID(),
            toggle: false,
          };

          return gvc.bindView({
            bind: vm.id,
            view: () => {
              if (!vm.toggle) {
                return html`<i
                  class="fa-regular fa-magnifying-glass h-20px-pointer"
                  style="color: ${widget.formData.theme_color['title'] ?? '#000'};"
                  onclick="${gvc.event(() => {
                    vm.toggle = !vm.toggle;
                    gvc.notifyDataChange(vm.id);
                  })}"
                ></i>`;
              }

              return html`<a class="nav-link search-container d-flex align-items-center"
                ><i
                  class="fa-regular fa-circle-xmark h-20px-pointer"
                  style="color: ${widget.formData.theme_color['title'] ?? '#000'};"
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
                  onchange="${gvc.event(e => {
                    gvc.glitter.href = `/all-product?search=${`${e.value}`.trim()}`;
                    vm.toggle = !vm.toggle;
                    gvc.notifyDataChange(vm.id);
                  })}"
                />
              </a>`;
            },
            divCreate: {
              class: 'nav-link search-container',
              elem: 'a',
            },
          });
        }

        function shoppingCount() {
          const vm = {
            id: gvc.glitter.getUUID(),
            count: 0,
          };

          return gvc.bindView({
            bind: vm.id,
            view: () => {
              return html`<span
                class="position-relative"
                onclick="${gvc.event(() => HeaderClass.rightCartMenu(gvc, widget))}"
              >
                <i
                  class="fa-duotone fa-cart-shopping h-20px-pointer"
                  style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;"
                ></i>
                ${gvc.bindView({
                  bind: gvc.glitter.getUUID(),
                  view: () => {
                    return new Promise(resolve => {
                      getCheckoutCount(count => {
                        vm.count = count;
                        resolve(
                          vm.count
                            ? html` <div class="position-absolute" style="font-size: 10px; right: -10px; top: -6px;">
                                <div class="rounded-circle bg-danger h-checkout-count-icon">${vm.count}</div>
                              </div>`
                            : ''
                        );
                      });
                    });
                  },
                })}
              </span>`;
            },
            divCreate: {
              class: 'nav-link js-cart-count',
            },
          });
        }

        function view() {
          return html` <!--Header Sy02-->
            <div id="header-bgr" style="height: 76px;"></div>
            <nav
              class="navbar navbar-expand-lg vw-100 header header-place shadow position-fixed top-0 left-0 py-0"
              style="background: ${widget.formData.theme_color['background'] ??
              '#000'} !important; min-height: 76px; z-index:9999;"
            >
              <div
                class="mx-auto header-place h-100"
                style="max-width: 100% !important; ${document.body.clientWidth > 1300
                  ? 'min-width: 1280px !important;'
                  : 'width: 100%; padding-left: 10px; padding-right: 10px;'}"
              >
                <!--LOGO顯示區塊-->
                <div class="d-flex align-items-center justify-content-center h-100 w-100 gap-2 px-0 px-md-3 px-lg-5">
                  <!--手機版選單-->
                  <div
                    class="d-flex d-lg-none align-items-center justify-content-center"
                    style="width: 40px !important; height: 40px !important;"
                    onclick="${gvc.event(() => {
                      gvc.glitter.setDrawer(drawer(), () => gvc.glitter.openDrawer(280));
                    })}"
                  >
                    <i
                      class="fa-solid fa-bars fa-fw d-md-none"
                      style="font-size: 20px; color: ${widget.formData.theme_color['title'] ?? '#000'};"
                    ></i>
                  </div>
                  <div
                    class="${widget.formData.logo.type === 'text' ? '' : `h-100`}"
                    onclick="${gvc.event(() => changePage('index', 'home', {}))}"
                  >
                    ${widget.formData.logo.type === 'text'
                      ? html`
                          <div
                            class="fw-bold d-flex align-items-center h-100 mb-1 mb-sm-auto"
                            style="font-size: 28px; line-height: 28px; cursor: pointer; color: ${widget.formData
                              .theme_color['title'] ?? '#000'};"
                          >
                            ${widget.formData.logo.value}
                          </div>
                        `
                      : html`
                          <div class="d-flex align-items-center justify-content-center h-100 p-2">
                            <img src="${widget.formData.logo.value}" style="max-height: 100%;max-width:60px;" />
                          </div>
                        `}
                  </div>
                  <!--選單列表顯示區塊-->
                  <ul class="navbar-nav d-none d-md-block flex-fill ps-2">
                    ${menu()}
                  </ul>
                  <div class="d-flex align-items-center ms-auto">
                    <!--固定按鈕顯示區塊-->
                    <ul class="navbar-nav flex-row ms-auto">
                      ${defaultButton()}
                      ${HeaderClass.hideShopperBtn()
                        ? ''
                        : html`<li class="nav-item d-none d-sm-flex align-items-center justify-content-center">
                            ${searchView()}
                          </li>`}
                      <li
                        class="nav-item d-flex align-items-center justify-content-center"
                        style="width:40px !important;"
                      >
                        ${shoppingCount()}
                      </li>
                      <li
                        class="nav-item d-flex align-items-center justify-content-center ms-3 "
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
                      >
                        <div
                          class="h-member-button"
                          style="${(() => {
                            const bgr = widget.formData.theme_color['solid-button-bg'] ?? '#000';
                            const color = widget.formData.theme_color['solid-button-text'] ?? '#000';
                            return `background: ${bgr}; color: ${color};`;
                          })()}"
                        >
                          ${GlobalUser.token ? Language.text('member_management') : Language.text('member_login')}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>`;
        }

        return gvc.bindView({
          bind: gvc.glitter.getUUID(),
          view: () => view(),
          onCreate: () => {
            setTimeout(() => {
              const nav = document.querySelector('nav');
              const headerBgr = document.getElementById('header-bgr');
              const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                  if (headerBgr) headerBgr.style.height = `${entry.contentRect.height}px`;
                }
              });
              nav && resizeObserver.observe(nav);
            }, 200);
          },
        });
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

(window as any).glitter.setModule(import.meta.url, Sy02);
