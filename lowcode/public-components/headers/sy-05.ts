import { GVC } from '../../glitterBundle/GVController.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { Language } from '../../glitter-base/global/language.js';
import { LanguageView } from '../public/language-view.js';
import { Color } from '../public/color.js';
import { HeadInitial } from './head-initial.js';
import { HeaderMobile } from './header-mobile.js';
import { PdClass } from '../product/pd-class.js';
import { HeaderClass } from './header-class.js';

const html = String.raw;

export class Sy05 {
  public static main(gvc: GVC, widget: any, subData: any) {
    return HeadInitial.initial({
      widget: widget,
      browser: () => {
        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(HeaderClass.getChangePagePath(gvc), cl => (changePage = cl.changePage));

        HeaderClass.addStyle(gvc);

        return html`
          <!--Header Sy05-->
            <div style="height: 76px;"></div>
            <nav
              class="navbar navbar-expand-lg vw-100 header header-place shadow  position-fixed top-0 left-0  py-0"
              style="background:  ${widget.formData.theme_color['background'] ?? '#000'} !important;height: 76px;z-index:9999;"
            >
              <div class="container header-place  h-100">
                <!--LOGO顯示區塊-->
                <div class="d-flex align-items-center justify-content-center h-100 w-100 gap-2">
                  <!--手機版選單-->
                  <div
                    class="d-flex d-lg-none align-items-center justify-content-center"
                    style="width:40px !important;height:40px !important;"
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
                                                      ? html`<i
                                                          class="fa-solid ${dd.open ? `fa-angle-up` : `fa-angle-down`}"
                                                          style="color: ${widget.formData.theme_color['title'] ??
                                                          '#000'} !important;"
                                                        ></i>`
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
background: ${widget.formData.theme_color['background'] ?? '#000'};overflow-x: hidden;`,
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
                      class="fa-solid fa-bars fa-fw d-md-none "
                      style="font-size: 20px;
    color: ${widget.formData.theme_color['title'] ?? '#000'};"
                    ></i>
                  </div>
                  <div class="${widget.formData.logo.type === 'text' ? '' : `h-100`}"
                       onclick="${gvc.event(() => {
                         changePage('index', 'home', {});
                       })}"> ${
                         widget.formData.logo.type === 'text'
                           ? html`
                               <div
                                 class=" fw-bold d-flex align-items-center h-100 mb-1 mb-sm-auto"
                                 style="font-size: 28px;line-height: 28px;color: ${widget.formData.theme_color[
                                   'title'
                                 ] ?? '#000'};"
                               >
                                 ${widget.formData.logo.value}
                               </div>
                             `
                           : html`
                               <div class="d-flex align-items-center justify-content-center h-100 py-2">
                                 <img src="${widget.formData.logo.value}" style="height: 100%;" />
                               </div>
                             `
                       }
                  </div>
                  <!--選單列表顯示區塊-->
                  <ul class="navbar-nav d-none d-md-block flex-fill ps-2" >
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
                                    ${dd.items.length > 0 ? `<i class="fa-solid fa-angle-down ms-2"></i>` : ''}</a
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
                          class: `navbar-nav ms-3 me-auto`,
                          style: `flex-direction: row; gap: 15px;`,
                          elem: `ul`,
                        },
                      };
                    })}
                  </ul>
                  <div class="d-flex align-items-center ms-auto">
                    <!--固定按鈕顯示區塊-->
                    <ul class="navbar-nav flex-row ms-auto">
                      <div class="mt-n2">   ${LanguageView.selectLanguage(gvc, Color.getTheme(gvc, widget.formData))}</div>

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

(window as any).glitter.setModule(import.meta.url, Sy05);
