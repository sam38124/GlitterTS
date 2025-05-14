import { ApiUser } from '../../glitter-base/route/user.js';
import { Language } from '../../glitter-base/global/language.js';
import { LanguageView } from "../public/language-view.js";
import { Color } from "../public/color.js";
import { HeadInitial } from './head-initial.js';
import { HeaderMobile } from './header-mobile.js';
const html = String.raw;
export class Sy05 {
    static main(gvc, widget, subData) {
        return HeadInitial.initial({
            widget: widget,
            browser: () => {
                var _a, _b, _c;
                let changePage = (index, type, subData) => {
                };
                gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
                    changePage = cl.changePage;
                });
                return html `
            <div style="height: 76px;"></div>
            <nav
              class="navbar navbar-expand-lg vw-100 header header-place shadow  position-fixed top-0 left-0  py-0"
              style="background:  ${(_a = widget.formData.theme_color['background']) !== null && _a !== void 0 ? _a : '#000'} !important;height: 76px;z-index:9999;"
            >
              <div class="container header-place  h-100">
                <!--LOGO顯示區塊-->
                <div class="d-flex align-items-center justify-content-center h-100 w-100 gap-2">
                  <!--手機版選單-->
                  <div
                    class="d-flex d-lg-none align-items-center justify-content-center"
                    style="width:40px !important;height:40px !important;"
                    onclick="${gvc.event(() => {
                    gvc.glitter.setDrawer(gvc.bindView(() => {
                        var _a;
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                return html ` <div
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
                                    ? html `
                                          <div
                                            class=" fw-bold d-flex align-items-center justify-content-center"
                                            style="width: 150px;    margin-bottom: 20px;font-size: 36px;color: ${(_a = widget.formData.theme_color['title']) !== null && _a !== void 0 ? _a : '#000'};"
                                          >
                                            ${widget.formData.logo.value}
                                          </div>
                                        `
                                    : html `<img
                                          style="width: 150px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 10px;
    margin-bottom: 20px;"
                                          src="${widget.formData.logo.value}"
                                        /> `}
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
                                    ApiUser.getPublicConfig(widget.formData.menu_refer || 'menu-setting', 'manager', window.appName).then((res) => {
                                        vm.data = res.response.value[Language.getLanguage()];
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            function resetToggle() {
                                                function loop(data) {
                                                    data.map((dd) => {
                                                        var _a;
                                                        dd.open = false;
                                                        loop((_a = dd.items) !== null && _a !== void 0 ? _a : []);
                                                    });
                                                }
                                                loop(vm.data);
                                            }
                                            function loopItems(data, show_border) {
                                                return data
                                                    .map((dd) => {
                                                    var _a, _b, _c, _d, _e;
                                                    return html `
                                              <li
                                                style="${show_border
                                                        ? `border-bottom: 1px solid ${(_a = widget.formData.theme_color['title']) !== null && _a !== void 0 ? _a : '#000'} !important;`
                                                        : ``}"
                                              >
                                                <div
                                                  class="nav-link d-flex justify-content-between"
                                                  style="padding: 16px;"
                                                  onclick="${gvc.event(() => {
                                                        var _a;
                                                        if (((_a = dd.items) !== null && _a !== void 0 ? _a : []).length === 0) {
                                                            if (dd.link) {
                                                                gvc.glitter.href = dd.link;
                                                                gvc.glitter.closeDrawer();
                                                            }
                                                        }
                                                        else {
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
                                                    style="color: ${(_b = widget.formData.theme_color['title']) !== null && _b !== void 0 ? _b : '#000'} !important;"
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
                                                  ${((_c = dd.items) !== null && _c !== void 0 ? _c : []).length
                                                        ? html `<i
                                                                                                          class="fa-solid ${dd.open ? `fa-angle-up` : `fa-angle-down`}"
                                                                                                          style="color: ${(_d = widget.formData.theme_color['title']) !== null && _d !== void 0 ? _d : '#000'} !important;"
                                                                                                      ></i>`
                                                        : ``}
                                                </div>
                                                ${dd.open ? `<ul class="ps-3  pb-2">${loopItems((_e = dd.items) !== null && _e !== void 0 ? _e : [], false)}</ul>` : ``}
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
background: ${(_a = widget.formData.theme_color['background']) !== null && _a !== void 0 ? _a : '#000'};overflow-x: hidden;`,
                            },
                        };
                    }), () => {
                        gvc.glitter.openDrawer(280);
                    });
                })}"
                  >
                    <i
                      class="fa-solid fa-bars fa-fw d-md-none "
                      style="font-size: 20px;
    color: ${(_b = widget.formData.theme_color['title']) !== null && _b !== void 0 ? _b : '#000'};"
                    ></i>
                  </div>
                  <div class="${widget.formData.logo.type === 'text' ? `` : `h-100`}"
                       onclick="${gvc.event(() => {
                    changePage('index', 'home', {});
                })}"> ${widget.formData.logo.type === 'text'
                    ? html `
                        <div class=" fw-bold d-flex align-items-center h-100 mb-1 mb-sm-auto" style="font-size: 28px;line-height: 28px;color: ${(_c = widget.formData.theme_color['title']) !== null && _c !== void 0 ? _c : '#000'};">
                          ${widget.formData.logo.value}
                        </div>
                      `
                    : html ` <div class="d-flex align-items-center justify-content-center h-100 py-2"><img src="${widget.formData.logo.value}" style="height: 100%;" /></div> `}
                  </div>
                  <!--選單列表顯示區塊-->
                  <ul class="navbar-nav  d-none d-md-block flex-fill ps-2" style="">
                    ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    const vm = {
                        data: [],
                    };
                    ApiUser.getPublicConfig(widget.formData.menu_refer || 'menu-setting', 'manager', window.appName).then((res) => {
                        vm.data = res.response.value[Language.getLanguage()];
                        gvc.notifyDataChange(id);
                    });
                    return {
                        bind: id,
                        view: () => {
                            function loopItems(data) {
                                return data
                                    .map((dd) => {
                                    var _a, _b;
                                    return html ` <li class="nav-item dropdown">
                                  <a
                                    class="nav-link header-link "
                                    style="color: ${(_a = widget.formData.theme_color['title']) !== null && _a !== void 0 ? _a : '#000'} !important;cursor: pointer;"
                                    onclick="${gvc.event(() => {
                                        if (dd.link) {
                                            gvc.glitter.href = dd.link;
                                        }
                                    })}"
                                  >${dd.title} ${dd.items.length > 0 ? `<i class="fa-solid fa-angle-down ms-2"></i>` : ``}</a
                                  >
                                  ${dd.items.length > 0
                                        ? html `<ul
                                                                  class="dropdown-menu"
                                                                  style="background:${(_b = widget.formData.theme_color['background']) !== null && _b !== void 0 ? _b : '#000'} !important; cursor: pointer; z-index: 99999;"
                                                              >
                                                                  ${loopItems(dd.items)}
                                                              </ul>`
                                        : ``}
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
                    widget: widget
                });
            },
            gvc: gvc
        });
    }
}
window.glitter.setModule(import.meta.url, Sy05);
