var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { getCheckoutCount } from '../../official_event/e-commerce/get-count.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { AiSearch } from '../ai/ai-search.js';
import { Language } from '../../glitter-base/global/language.js';
import { Color } from '../public/color.js';
import { LanguageView } from '../public/language-view.js';
import { Tool } from '../../modules/tool.js';
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
                    return html `<div
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
                        this.rightCartMenu(gvc, widget);
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
    static spinner(obj) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const container = {
            class: `${(_b = (_a = obj === null || obj === void 0 ? void 0 : obj.container) === null || _a === void 0 ? void 0 : _a.class) !== null && _b !== void 0 ? _b : ''}`,
            style: `margin-top: 2rem ;${(_c = obj === null || obj === void 0 ? void 0 : obj.container) === null || _c === void 0 ? void 0 : _c.style}`,
        };
        const circleAttr = {
            visible: ((_d = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _d === void 0 ? void 0 : _d.visible) === false ? false : true,
            width: (_f = (_e = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _e === void 0 ? void 0 : _e.width) !== null && _f !== void 0 ? _f : 20,
            borderSize: (_h = (_g = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _g === void 0 ? void 0 : _g.borderSize) !== null && _h !== void 0 ? _h : 16,
        };
        const textAttr = {
            value: (_k = (_j = obj === null || obj === void 0 ? void 0 : obj.text) === null || _j === void 0 ? void 0 : _j.value) !== null && _k !== void 0 ? _k : Language.text('loading'),
            visible: ((_l = obj === null || obj === void 0 ? void 0 : obj.text) === null || _l === void 0 ? void 0 : _l.visible) === false ? false : true,
            fontSize: (_o = (_m = obj === null || obj === void 0 ? void 0 : obj.text) === null || _m === void 0 ? void 0 : _m.fontSize) !== null && _o !== void 0 ? _o : 16,
        };
        return html ` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}" style="${container.style}">
            <div
                class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
                style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
                role="status"
            ></div>
            <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}" style="font-size: ${textAttr.fontSize}px;">${textAttr.value}</span>
        </div>`;
    }
    static isImageUrlValid(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    static rightCartMenu(gvc, widget) {
        gvc.glitter.setDrawer(gvc.bindView((() => {
            var _a, _b;
            const vm = {
                id: gvc.glitter.getUUID(),
                imageId: gvc.glitter.getUUID(),
                dataList: [],
                loading: true,
            };
            const classPrefix = Tool.randomString(6);
            gvc.addStyle(`
                        .${classPrefix}-wh {
                            display: flex;
                            min-width: 70px;
                            min-height: 70px;
                            max-width: 70px;
                            max-height: 70px;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            object-position: center;
                        }

                        .${classPrefix}-select {
                            display: flex;
                            padding: 7px 30px 7px 18px;
                            max-height: 40px;
                            align-items: center;
                            gap: 6px;
                            border-radius: 10px;
                            border: 1px solid #ddd;
                            background: transparent url('https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1718100926212-Vector 89.png') no-repeat;
                            background-position-x: calc(100% - 12px);
                            background-position-y: 16px;
                            appearance: none;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            color: #393939;
                        }

                        .${classPrefix}-select:focus {
                            outline: 0;
                        }

                        .${classPrefix}-cart-container {
                            display: flex;
                            width: 100%;
                            align-items: center;
                            padding: 0;
                            margin-bottom: 18px;
                            padding: 12px;
                            border-bottom: 1px solid #dddddd;
                        }

                        .${classPrefix}-cart-title {
                            letter-spacing: 4px;
                            font-size: 22px;
                            font-weight: 700;
                        }

                        .${classPrefix}-title {
                            font-size: 16px;
                        }

                        .${classPrefix}-spec {
                            font-size: 14px;
                            color: #8d8d8d;
                        }

                        .${classPrefix}-button {
                            display: flex;
                            padding: 8px 14px;
                            max-height: 36px;
                            justify-content: center;
                            align-items: center;
                            gap: 8px;
                            border: 0;
                            border-radius: 10px;
                            background: ${(_a = widget.formData.theme_color['solid-button-bg']) !== null && _a !== void 0 ? _a : '#000'};
                            cursor: pointer;
                            color: ${(_b = widget.formData.theme_color['solid-button-text']) !== null && _b !== void 0 ? _b : '#fff'};
                        }
                    `);
            function refreshView() {
                setTimeout(() => {
                    vm.loading = true;
                    gvc.notifyDataChange(vm.id);
                }, 200);
            }
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return this.spinner();
                    }
                    else {
                        return html `<div class="mt-2" style="position: relative;">
                                    <div class="${classPrefix}-cart-container">
                                        <div class="${classPrefix}-cart-title">購物車詳細</div>
                                        <div class="flex-fill"></div>
                                        <button
                                            class="${classPrefix}-button"
                                            type="button"
                                            onclick="${gvc.event(() => {
                            window.drawer.close();
                            gvc.glitter.href = '/checkout';
                        })}"
                                        >
                                            前往購物車
                                        </button>
                                    </div>
                                    ${gvc.map(vm.dataList.map((item, index) => {
                            return html `<div class="d-flex align-items-center mb-4 px-3">
                                                <div class="d-flex" style="width: 10%">
                                                    <i
                                                        class="fa-solid fa-xmark-large"
                                                        style="cursor: pointer;"
                                                        onclick="${gvc.event(() => {
                                ApiCart.setCart((cartItem) => {
                                    cartItem.line_items = cartItem.line_items.filter((dd) => {
                                        return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                    });
                                    refreshView();
                                });
                            })}"
                                                    ></i>
                                                </div>
                                                <div class="d-flex" style="width: 22%">
                                                    ${gvc.bindView(() => {
                                return {
                                    bind: vm.imageId,
                                    view: () => {
                                        return '';
                                    },
                                    divCreate: {
                                        elem: 'img',
                                        class: `${classPrefix}-wh`,
                                        option: [
                                            {
                                                key: 'src',
                                                value: item.image,
                                            },
                                        ],
                                    },
                                };
                            })}
                                                </div>
                                                <div class="d-flex flex-column gap-1" style="width: 68%">
                                                    <div class="${classPrefix}-title">${item.title}</div>
                                                    <div class="${classPrefix}-spec">${item.spec.join(' / ')}</div>
                                                    <div class="d-flex align-items-center justify-content-between">
                                                        <div class="d-flex align-items-center gap-1">
                                                            數量：<select
                                                                class="${classPrefix}-select"
                                                                style="width: 100px;"
                                                                onchange="${gvc.event((e) => {
                                ApiCart.setCart((cartItem) => {
                                    cartItem.line_items.find((dd) => {
                                        return dd.id === item.id && item.spec.join('') === dd.spec.join('');
                                    }).count = parseInt(e.value, 10);
                                    refreshView();
                                });
                            })}"
                                                            >
                                                                ${[...new Array(99)]
                                .map((_, index) => {
                                return html ` <option value="${index + 1}" ${index + 1 === item.count ? `selected` : ``}>${index + 1}</option>`;
                            })
                                .join('')}
                                                            </select>
                                                        </div>
                                                        NT$ ${(item.price * item.count).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>`;
                        }))}
                                </div>`;
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (vm.loading) {
                        vm.dataList = [];
                        const cart = ApiCart.cart;
                        new Promise((resolve, reject) => {
                            ApiShop.getProduct({
                                page: 0,
                                limit: 10000,
                                id_list: [...new Set(cart.line_items.map((item) => item.id))].join(','),
                            })
                                .then((data) => __awaiter(this, void 0, void 0, function* () {
                                if (data.result && data.response) {
                                    const products = data.response.data;
                                    for (const item of cart.line_items) {
                                        const product = products.find((p) => p.id === item.id);
                                        const variant = product.content.variants.find((v) => {
                                            return v.spec.slice().sort().join(',') === item.spec.slice().sort().join(',');
                                        });
                                        vm.dataList.push({
                                            id: item.id,
                                            title: product.content.title,
                                            count: item.count,
                                            spec: item.spec,
                                            price: variant ? variant.sale_price : 0,
                                            image: yield (() => __awaiter(this, void 0, void 0, function* () {
                                                if (!variant) {
                                                    return this.noImageURL;
                                                }
                                                const img = yield this.isImageUrlValid(variant.preview_image).then((isValid) => {
                                                    return isValid ? variant.preview_image : this.noImageURL;
                                                });
                                                return img;
                                            }))(),
                                        });
                                    }
                                    resolve();
                                }
                            }))
                                .then(() => {
                                document.querySelector('.hy-drawer-content').style.background = '#ffffff';
                                vm.loading = false;
                                gvc.notifyDataChange(vm.id);
                            });
                        });
                    }
                },
            };
        })()), () => {
            gvc.glitter.openDrawer(400);
        });
    }
}
Sy02.noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
window.glitter.setModule(import.meta.url, Sy02);
