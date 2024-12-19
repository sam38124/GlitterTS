import { ApiUser } from '../../glitter-base/route/user.js';
import { getCheckoutCount } from '../../official_event/e-commerce/get-count.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { AiSearch } from '../ai/ai-search.js';
import { Language } from '../../glitter-base/global/language.js';
import { Color } from '../public/color.js';
import { LanguageView } from '../public/language-view.js';
import { HeaderClass } from './header-class.js';
const html = String.raw;
export class Sy02 {
    static main(gvc, widget, subData) {
        var _a, _b, _c, _d, _e;
        let changePage = (index, type, subData) => {
            alert('change_page_origin');
        };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });
        const colors = Color.getTheme(gvc, widget.formData);
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
                                class="d-flex align-items-center justify-content-center"
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
                                                            <div class="mb-3">${LanguageView.selectLanguage(gvc, colors)}</div>
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
                            ApiUser.getPublicConfig('menu-setting', 'manager', window.appName).then((res) => {
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
                                                ? html ` <i
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
            ApiUser.getPublicConfig('menu-setting', 'manager', window.appName).then((res) => {
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
                                ? html ` <ul
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
                                ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm = {
                visible: false,
            };
            ApiUser.getPublicConfig('store-information', 'manager').then((res) => {
                if (res.response.value.ai_search) {
                    vm.visible = true;
                    gvc.notifyDataChange(id);
                }
            });
            return {
                bind: id,
                view: () => {
                    var _a, _b;
                    return html ` <div
                                                class="d-flex align-items-center justify-content-center "
                                                style="color: ${(_a = widget.formData.theme_color['title']) !== null && _a !== void 0 ? _a : '#000'} !important;width:30px;height:30px;font-size: 15px;
border: 2px solid ${(_b = widget.formData.theme_color['title']) !== null && _b !== void 0 ? _b : '#000'} !important;
border-radius: 50%;
font-weight: 700 !important;
padding-bottom: 2px;
"
                                            >
                                                AI
                                            </div>`;
                },
                divCreate: () => {
                    return {
                        class: `nav-item  ${vm.visible ? `d-flex` : `d-none`} align-items-center justify-content-center`,
                        style: `width:48px !important;cursor: pointer;`,
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
                                <li class="nav-item d-none d-sm-flex align-items-center justify-content-center"
                                    style="">
                                    ${gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
                toggle: false,
            };
            return {
                bind: vm.id,
                view: () => {
                    var _a, _b;
                    if (!vm.toggle) {
                        return html `<i
                                                        class="fa-regular fa-magnifying-glass"
                                                        style="color: ${(_a = widget.formData.theme_color['title']) !== null && _a !== void 0 ? _a : '#000'};cursor: pointer;font-size:20px;"
                                                        onclick="${gvc.event(() => {
                            vm.toggle = !vm.toggle;
                            gvc.notifyDataChange(vm.id);
                        })}"
                                                    ></i>`;
                    }
                    else {
                        return html `<a class="nav-link search-container d-flex align-items-center"
                                                        ><i
                                                            class="fa-regular fa-circle-xmark"
                                                            style="color: ${(_b = widget.formData.theme_color['title']) !== null && _b !== void 0 ? _b : '#000'};cursor: pointer;font-size:20px;"
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
                            gvc.glitter.href = `/all-product?search=${e.value}`;
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
                                </li>
                                <li class="nav-item  d-flex align-items-center justify-content-center"
                                    style="width:40px !important;">
                                    ${gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
                count: 0,
            };
            return {
                bind: vm.id,
                view: () => {
                    var _a;
                    return html `<span
                                                    class="position-relative"
                                                    onclick="${gvc.event(() => {
                        HeaderClass.rightCartMenu(gvc, widget);
                    })}"
                                                >
                                                    <i
                                                        class="fa-duotone fa-cart-shopping"
                                                        style="color: ${(_a = widget.formData.theme_color['title']) !== null && _a !== void 0 ? _a : '#000'} !important;cursor: pointer;font-size:20px;"
                                                    ></i>
                                                    ${gvc.bindView(() => {
                        return {
                            bind: gvc.glitter.getUUID(),
                            view: () => {
                                return new Promise((resolve, reject) => {
                                    getCheckoutCount((count) => {
                                        vm.count = count;
                                        resolve(vm.count
                                            ? html ` <div class="position-absolute" style="font-size: 10px;right: -10px;top: -6px;">
                                                                                      <div
                                                                                          class="rounded-circle bg-danger text-white  align-items-center justify-content-center fw-500 d-flex"
                                                                                          style="width:18px;height: 18px;color: white !important;background:#fe5541;"
                                                                                      >
                                                                                          ${vm.count}
                                                                                      </div>
                                                                                  </div>`
                                            : ``);
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
                                        class="nav-item d-flex align-items-center justify-content-center ms-3 ms-sm-4"
                                        style=""
                                        onclick="${gvc.event(() => {
            if (GlobalUser.token) {
                changePage('account_userinfo', 'page', {});
            }
            else {
                if (localStorage.getItem('redirect_cart') === 'true') {
                    localStorage.removeItem('redirect_cart');
                }
                changePage('login', 'page', {});
            }
        })}"
                                >
                                    <div
                                            class=""
                                            style="background: ${(_d = widget.formData.theme_color['solid-button-bg']) !== null && _d !== void 0 ? _d : '#000'};
color: ${(_e = widget.formData.theme_color['solid-button-text']) !== null && _e !== void 0 ? _e : '#000'};  cursor: pointer;
display: flex;
width: 100px;
padding: 7px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 5px;"
                                    >
                                        ${GlobalUser.token ? Language.text('member_management') : Language.text('member_login')}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
            </nav>`;
    }
}
window.glitter.setModule(import.meta.url, Sy02);
